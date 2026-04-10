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
router.get("/topic/:topic_slug", authenticate, (req: any, res: any) => {
  try {
    const { topic_slug } = req.params;
    const userId = req.userId;

    const topic = db.prepare("SELECT * FROM learning_topics WHERE slug = ?").get(topic_slug) as any;
    if (!topic) return res.status(404).json({ error: "Topic not found" });

    const levels = db.prepare(`
      SELECT * FROM learning_levels 
      WHERE topic_id = ? 
      ORDER BY [order] ASC
    `).all(topic.id) as any[];

    const resultLevels = levels.map((level) => {
      const sections = db.prepare(`
        SELECT s.*, p.status as progress_status
        FROM learning_sections s
        LEFT JOIN learning_progress p ON s.id = p.section_id AND p.user_id = ?
        WHERE s.level_id = ?
        ORDER BY s.[order] ASC
      `).all(userId, level.id) as any[];

      return {
        ...level,
        sections: sections.map(s => ({
          ...s,
          content_json: s.content_json ? JSON.parse(s.content_json) : null
        }))
      };
    });

    const userBookmarks = db.prepare("SELECT section_id FROM learning_bookmarks WHERE user_id = ?").all(userId) as any[];
    const userSaves = db.prepare("SELECT level_id FROM learning_saves WHERE user_id = ?").all(userId) as any[];

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
router.get("/section/:section_id", authenticate, (req: any, res: any) => {
  try {
    const { section_id } = req.params;
    
    const section = db.prepare("SELECT * FROM learning_sections WHERE id = ?").get(section_id) as any;
    if (!section) return res.status(404).json({ error: "Section not found" });

    let quiz = null;
    if (section.type === 'TEST') {
      quiz = db.prepare("SELECT * FROM learning_quizzes WHERE section_id = ?").all(section_id) as any[];
      quiz = quiz.map(q => ({
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
router.post("/complete", authenticate, (req: any, res: any) => {
  try {
    const { section_id, score = 100 } = req.body;
    const userId = req.userId;

    if (!section_id) return res.status(400).json({ error: "Section ID required" });

    const section = db.prepare("SELECT * FROM learning_sections WHERE id = ?").get(section_id) as any;
    if (!section) return res.status(404).json({ error: "Section not found" });

    // 1. Record progress
    const progressId = randomUUID();
    const xp_earned = 50; // Standard XP per section

    db.prepare(`
      INSERT OR REPLACE INTO learning_progress (id, user_id, section_id, status, score, xp_earned, completed_at)
      VALUES (?, ?, ?, 'COMPLETED', ?, ?, CURRENT_TIMESTAMP)
    `).run(progressId, userId, section_id, score, xp_earned);

    // 2. Update user XP and streak
    const user = db.prepare("SELECT total_xp, current_streak, last_active_date FROM users WHERE id = ?").get(userId) as any;
    
    let newStreak = user.current_streak || 0;
    const today = new Date().toISOString().split('T')[0];
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

    db.prepare(`
      UPDATE users 
      SET total_xp = total_xp + ?, 
          current_streak = ?, 
          last_active_date = ?
      WHERE id = ?
    `).run(xp_earned, newStreak, today, userId);

    // 3. Check for badges
    const levelInfo = db.prepare(`
        SELECT l.level_number, t.title as topic_title, t.slug as topic_slug
        FROM learning_sections s
        JOIN learning_levels l ON s.level_id = l.id
        JOIN learning_topics t ON l.topic_id = t.id
        WHERE s.id = ?
    `).get(section_id) as any;

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
            const userData = db.prepare("SELECT badges_json FROM users WHERE id = ?").get(userId) as any;
            const currentBadges = JSON.parse(userData.badges_json || '[]');
            
            // Check if already earned
            const alreadyEarned = currentBadges.find((b: any) => b.tier === milestone.tier && b.topic === levelInfo.topic_title);
            
            if (!alreadyEarned) {
                badge_earned = {
                    ...milestone,
                    earned_at: new Date().toISOString(),
                    topic: levelInfo.topic_title,
                    topic_slug: levelInfo.topic_slug
                };
                currentBadges.push(badge_earned);
                db.prepare("UPDATE users SET badges_json = ? WHERE id = ?").run(JSON.stringify(currentBadges), userId);
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
router.get("/activity", authenticate, (req: any, res: any) => {
  try {
    const userId = req.userId;

    const savedLessons = db.prepare(`
      SELECT s.id, t.title as category, l.title, l.difficulty as level, s.created_at as date
      FROM learning_saves s
      JOIN learning_levels l ON s.level_id = l.id
      JOIN learning_topics t ON l.topic_id = t.id
      WHERE s.user_id = ?
      ORDER BY s.created_at DESC
    `).all(userId);

    const bookmarks = db.prepare(`
      SELECT b.id, t.title as category, s.title, l.difficulty as level, b.created_at as date
      FROM learning_bookmarks b
      JOIN learning_sections s ON b.section_id = s.id
      JOIN learning_levels l ON s.level_id = l.id
      JOIN learning_topics t ON l.topic_id = t.id
      WHERE b.user_id = ?
      ORDER BY b.created_at DESC
    `).all(userId);

    res.json({ savedLessons, bookmarks });
  } catch (error) {
    console.error("Error fetching learning activity:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * POST /api/learning/toggle-save
 */
router.post("/toggle-save", authenticate, (req: any, res: any) => {
  try {
    const { level_id } = req.body;
    const userId = req.userId;

    const existing = db.prepare("SELECT id FROM learning_saves WHERE user_id = ? AND level_id = ?").get(userId, level_id);

    if (existing) {
      db.prepare("DELETE FROM learning_saves WHERE id = ?").run(existing.id);
      return res.json({ status: "UNSAVED" });
    } else {
      db.prepare("INSERT INTO learning_saves (id, user_id, level_id) VALUES (?, ?, ?)").run(randomUUID(), userId, level_id);
      return res.json({ status: "SAVED" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * POST /api/learning/toggle-bookmark
 */
router.post("/toggle-bookmark", authenticate, (req: any, res: any) => {
  try {
    const { section_id } = req.body;
    const userId = req.userId;

    const existing = db.prepare("SELECT id FROM learning_bookmarks WHERE user_id = ? AND section_id = ?").get(userId, section_id);

    if (existing) {
      db.prepare("DELETE FROM learning_bookmarks WHERE id = ?").run(existing.id);
      return res.json({ status: "UNBOOKMARKED" });
    } else {
      db.prepare("INSERT INTO learning_bookmarks (id, user_id, section_id) VALUES (?, ?, ?)").run(randomUUID(), userId, section_id);
      return res.json({ status: "BOOKMARKED" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * DELETE endpoints for activity feed
 */
router.delete("/activity/save/:id", authenticate, (req: any, res: any) => {
  db.prepare("DELETE FROM learning_saves WHERE id = ? AND user_id = ?").run(req.params.id, req.userId);
  res.json({ success: true });
});

router.delete("/activity/bookmark/:id", authenticate, (req: any, res: any) => {
  db.prepare("DELETE FROM learning_bookmarks WHERE id = ? AND user_id = ?").run(req.params.id, req.userId);
  res.json({ success: true });
});

export default router;
