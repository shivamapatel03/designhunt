import express from "express";
import jwt from "jsonwebtoken";
import db from "../db";
import { randomUUID } from "crypto";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "designhunt_secret_key_123";

// Middleware to verify session
const authenticate = (req: any, res: any, next: any) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    req.userId = payload.userId || payload.id;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

/**
 * GET /api/learning/:topic_slug
 * Fetch all levels and sections for a topic, with user progress.
 */
router.get("/topic/:topic_slug", authenticate, async (req: any, res: any) => {
  try {
    const { topic_slug } = req.params;
    const userId = req.userId;

    const topic = await db.get("SELECT * FROM learning_topics WHERE slug = $1", [topic_slug]) as any;
    if (!topic) return res.status(404).json({ error: "Topic not found" });

    const levels = await db.all(`
      SELECT * FROM learning_levels 
      WHERE topic_id = $1 
      ORDER BY "order" ASC
    `, [topic.id]) as any[];

    const resultLevels = await Promise.all(levels.map(async (level) => {
      const sections = await db.all(`
        SELECT s.*, p.status as progress_status
        FROM learning_sections s
        LEFT JOIN learning_progress p ON s.id = p.section_id AND p.user_id = $1
        WHERE s.level_id = $2
        ORDER BY s."order" ASC
      `, [userId, level.id]) as any[];

      return {
        ...level,
        sections: sections.map(s => ({
          ...s,
          content_json: s.content_json ? JSON.parse(s.content_json) : null
        }))
      };
    }));

    const userBookmarks = await db.all("SELECT section_id FROM learning_bookmarks WHERE user_id = $1", [userId]) as any[];
    const userSaves = await db.all("SELECT level_id FROM learning_saves WHERE user_id = $1", [userId]) as any[];

    res.json({
      topic,
      levels: resultLevels,
      userBookmarks: userBookmarks.map(b => b.section_id),
      userSaves: userSaves.map(s => s.level_id)
    });
  } catch (error) {
    console.error("Error fetching learning topic:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /api/learning/section/:section_id
 * Fetch details for a specific section, including quiz if applicable.
 */
router.get("/section/:section_id", authenticate, async (req: any, res: any) => {
  try {
    const { section_id } = req.params;
    
    const section = await db.get("SELECT * FROM learning_sections WHERE id = $1", [section_id]) as any;
    if (!section) return res.status(404).json({ error: "Section not found" });

    let quiz = null;
    if (section.type === 'TEST') {
      const quizRes = await db.all("SELECT * FROM learning_quizzes WHERE section_id = $1", [section_id]) as any[];
      quiz = quizRes.map(q => ({
        ...q,
        options_json: JSON.parse(q.options_json)
      }));
    }

    res.json({
      section: {
        ...section,
        content_json: section.content_json ? JSON.parse(section.content_json) : null
      },
      quiz
    });
  } catch (error) {
    console.error("Error fetching learning section:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * POST /api/learning/complete
 * Mark a section as completed and update user stats.
 */
router.post("/complete", authenticate, async (req: any, res: any) => {
  try {
    const { section_id, score = 100 } = req.body;
    const userId = req.userId;

    if (!section_id) return res.status(400).json({ error: "Section ID required" });

    const section = await db.get("SELECT * FROM learning_sections WHERE id = $1", [section_id]) as any;
    if (!section) return res.status(404).json({ error: "Section not found" });

    // 1. Record progress
    const progressId = randomUUID();
    const xp_earned = 50; // Standard XP per section

    await db.run(`
      INSERT INTO learning_progress (id, user_id, section_id, status, score, xp_earned, completed_at)
      VALUES ($1, $2, $3, 'COMPLETED', $4, $5, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id, section_id) DO UPDATE SET
        status = 'COMPLETED',
        score = $4,
        xp_earned = $5,
        completed_at = CURRENT_TIMESTAMP
    `, [progressId, userId, section_id, score, xp_earned]);

    // 2. Update user XP and streak
    const user = await db.get("SELECT total_xp, current_streak, last_active_date FROM users WHERE id = $1", [userId]) as any;
    
    let newStreak = user.current_streak || 0;
    const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
    const lastActive = user.last_active_date;

    if (!lastActive) {
      newStreak = 1;
    } else {
      const lastDate = new Date(lastActive);
      const diffTime = Math.abs(new Date(today).getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        newStreak += 1;
      } else if (diffDays > 1) {
        newStreak = 1; // Streak broken
      }
      // If diffDays === 0, streak stays the same (already active today)
    }

    await db.run(`
      UPDATE users 
      SET total_xp = total_xp + $1, 
          current_streak = $2, 
          last_active_date = $3
      WHERE id = $4
    `, [xp_earned, newStreak, today, userId]);

    // 3. Check for badges
    const levelInfo = await db.get(`
        SELECT l.level_number, t.title as topic_title, t.slug as topic_slug
        FROM learning_sections s
        JOIN learning_levels l ON s.level_id = l.id
        JOIN learning_topics t ON l.topic_id = t.id
        WHERE s.id = $1
    `, [section_id]) as any;

    let badge_earned = null;
    if (levelInfo) {
        const milestones: any = {
            12: { tier: 'NORMAL', name: 'Typography Apprentice', image: 'normal.png' },
            28: { tier: 'MEDIUM', name: 'Typography Architect', image: 'medium.png' },
            50: { tier: 'HARD', name: 'Typography Master', image: 'hard.png' }
        };

        const milestone = milestones[levelInfo.level_number];
        if (milestone) {
            // Get current badges
            const userData = await db.get("SELECT badges_json FROM users WHERE id = $1", [userId]) as any;
            const currentBadges = JSON.parse(userData.badges_json || '[]');
            
            // Check if already earned
            const alreadyEarned = currentBadges.find((b: any) => b.tier === milestone.tier && b.topic === levelInfo.topic_title);
            
            if (!alreadyEarned) {
                badge_earned = {
                    ...milestone,
                    earned_at: new Date(),
                    topic: levelInfo.topic_title,
                    topic_slug: levelInfo.topic_slug
                };
                currentBadges.push(badge_earned);
                await db.run("UPDATE users SET badges_json = $1 WHERE id = $2", [JSON.stringify(currentBadges), userId]);
            }
        }
    }

    res.json({
      success: true,
      xp_earned,
      new_total_xp: (user.total_xp || 0) + xp_earned,
      new_streak: newStreak,
      badge_earned
    });
  } catch (error) {
    console.error("Error completing learning section:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
/**
 * GET /api/learning/activity
 * Fetch user's saved levels and bookmarked sections.
 */
router.get("/activity", authenticate, async (req: any, res: any) => {
  try {
    const userId = req.userId;

    const savedLessons = await db.all(`
      SELECT s.id, t.title as category, l.title, l.difficulty as level, s.created_at as date
      FROM learning_saves s
      JOIN learning_levels l ON s.level_id = l.id
      JOIN learning_topics t ON l.topic_id = t.id
      WHERE s.user_id = $1
      ORDER BY s.created_at DESC
    `, [userId]);

    const bookmarks = await db.all(`
      SELECT b.id, t.title as category, s.title, l.difficulty as level, b.created_at as date
      FROM learning_bookmarks b
      JOIN learning_sections s ON b.section_id = s.id
      JOIN learning_levels l ON s.level_id = l.id
      JOIN learning_topics t ON l.topic_id = t.id
      WHERE b.user_id = $1
      ORDER BY b.created_at DESC
    `, [userId]);

    res.json({ savedLessons, bookmarks });
  } catch (error) {
    console.error("Error fetching learning activity:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * POST /api/learning/toggle-save
 */
router.post("/toggle-save", authenticate, async (req: any, res: any) => {
  try {
    const { level_id } = req.body;
    const userId = req.userId;

    const existing = await db.get("SELECT id FROM learning_saves WHERE user_id = $1 AND level_id = $2", [userId, level_id]) as any;

    if (existing) {
      await db.run("DELETE FROM learning_saves WHERE id = $1", [existing.id]);
      return res.json({ status: "UNSAVED" });
    } else {
      await db.run("INSERT INTO learning_saves (id, user_id, level_id) VALUES ($1, $2, $3)", [randomUUID(), userId, level_id]);
      return res.json({ status: "SAVED" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * POST /api/learning/toggle-bookmark
 */
router.post("/toggle-bookmark", authenticate, async (req: any, res: any) => {
  try {
    const { section_id } = req.body;
    const userId = req.userId;

    const existing = await db.get("SELECT id FROM learning_bookmarks WHERE user_id = $1 AND section_id = $2", [userId, section_id]) as any;

    if (existing) {
      await db.run("DELETE FROM learning_bookmarks WHERE id = $1", [existing.id]);
      return res.json({ status: "UNBOOKMARKED" });
    } else {
      await db.run("INSERT INTO learning_bookmarks (id, user_id, section_id) VALUES ($1, $2, $3)", [randomUUID(), userId, section_id]);
      return res.json({ status: "BOOKMARKED" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * DELETE endpoints for activity feed
 */
router.delete("/activity/save/:id", authenticate, async (req: any, res: any) => {
  await db.run("DELETE FROM learning_saves WHERE id = $1 AND user_id = $2", [req.params.id, req.userId]);
  res.json({ success: true });
});

router.delete("/activity/bookmark/:id", authenticate, async (req: any, res: any) => {
  await db.run("DELETE FROM learning_bookmarks WHERE id = $1 AND user_id = $2", [req.params.id, req.userId]);
  res.json({ success: true });
});

/**
 * GET /api/learning/topic/:topic_slug/report
 */
router.get("/topic/:topic_slug/report", authenticate, async (req: any, res: any) => {
  try {
    const { topic_slug } = req.params;
    const userId = req.userId;

    const topic = await db.get("SELECT * FROM learning_topics WHERE slug = $1", [topic_slug]) as any;
    if (!topic) return res.status(404).json({ error: "Topic not found" });

    const levels = await db.all(`
        SELECT l.id, l.level_number, l.difficulty,
               (SELECT COUNT(*) FROM learning_sections s WHERE s.level_id = l.id) as section_count,
               (SELECT COUNT(*) FROM learning_progress p 
                JOIN learning_sections s ON p.section_id = s.id 
                WHERE s.level_id = l.id AND p.user_id = $1 AND p.status = 'COMPLETED') as completed_count
        FROM learning_levels l
        WHERE l.topic_id = $2
        ORDER BY l."order" ASC
    `, [userId, topic.id]) as any[];

    // Calculate accuracy only from TEST sections
    const quizStats = await db.get(`
        SELECT AVG(p.score) as avg_score
        FROM learning_progress p
        JOIN learning_sections s ON p.section_id = s.id
        JOIN learning_levels l ON s.level_id = l.id
        WHERE l.topic_id = $1 AND p.user_id = $2 AND s.type = 'TEST'
    `, [topic.id, userId]) as any;

    const totalXp = await db.get(`
        SELECT SUM(p.xp_earned) as total_xp
        FROM learning_progress p
        JOIN learning_sections s ON p.section_id = s.id
        JOIN learning_levels l ON s.level_id = l.id
        WHERE l.topic_id = $1 AND p.user_id = $2
    `, [topic.id, userId]) as any;

    const timeSpent = await db.get(`
        SELECT SUM(s.duration_mins) as total_mins
        FROM learning_progress p
        JOIN learning_sections s ON p.section_id = s.id
        JOIN learning_levels l ON s.level_id = l.id
        WHERE l.topic_id = $1 AND p.user_id = $2
    `, [topic.id, userId]) as any;

    res.json({
        topic_title: topic.title,
        accuracy: Math.round(parseFloat(quizStats?.avg_score || "0")),
        total_xp: parseInt(totalXp?.total_xp || "0"),
        time_spent_mins: parseInt(timeSpent?.total_mins || "0"),
        levels: levels.map(l => ({
            level_number: l.level_number,
            difficulty: l.difficulty,
            status: parseInt(l.completed_count) === parseInt(l.section_count) && parseInt(l.section_count) > 0 ? 'COMPLETED' : 'IN_PROGRESS'
        }))
    });
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
