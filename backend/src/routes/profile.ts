import express from "express";
import multer from "multer";
import path from "path";
import jwt from "jsonwebtoken";
import db from "../db";

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

router.get("/", authenticate, (req: any, res: any) => {
  try {
    const userId = req.userId;
    const user = db
      .prepare("SELECT * FROM users WHERE id = ?")
      .get(userId) as any;

    if (!user) return res.status(404).json({ error: "User not found" });

    const enrollments = db
      .prepare(
        `
      SELECT e.*, c.title, c.thumbnail, c.difficulty 
      FROM enrollments e 
      JOIN courses c ON e.course_id = c.id 
      WHERE e.user_id = ?
    `,
      )
      .all(userId);

    const tutorRequest = db
      .prepare("SELECT status FROM tutor_requests WHERE user_id = ?")
      .get(userId) as any;

    // Fetch real typography progress
    const typographyTopic = db.prepare("SELECT id FROM learning_topics WHERE slug = 'typography'").get() as any;
    let typographyStats = { completed: 0, total: 30 }; // Fallback
    
    if (typographyTopic) {
        const totalLevels = db.prepare("SELECT COUNT(*) as count FROM learning_levels WHERE topic_id = ?").get(typographyTopic.id) as any;
        // A level is "completed" if at least one of its sections is completed by the user
        const completedLevels = db.prepare(`
            SELECT COUNT(DISTINCT l.id) as count 
            FROM learning_levels l
            JOIN learning_sections s ON l.id = s.level_id
            JOIN learning_progress p ON s.id = p.section_id
            WHERE l.topic_id = ? AND p.user_id = ?
        `).get(typographyTopic.id, userId) as any;
        
        typographyStats = {
            completed: completedLevels?.count || 0,
            total: totalLevels?.count || 0
        };
    }

    const topicsToLearnRaw = user.topics_to_learn ? JSON.parse(user.topics_to_learn) : [];
    const topicsWithProgress = topicsToLearnRaw.map((topicName: string) => {
        const slug = topicName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        const topic = db.prepare("SELECT id FROM learning_topics WHERE slug = ? OR title = ?").get(slug, topicName) as any;
        
        let percentage = 0;
        if (topic) {
            const totalRes = db.prepare("SELECT COUNT(*) as count FROM learning_levels WHERE topic_id = ?").get(topic.id) as any;
            const completedRes = db.prepare(`
                SELECT COUNT(DISTINCT l.id) as count 
                FROM learning_levels l
                JOIN learning_sections s ON l.id = s.level_id
                JOIN learning_progress p ON s.id = p.section_id
                WHERE l.topic_id = ? AND p.user_id = ?
            `).get(topic.id, userId) as any;
            
            const total = totalRes?.count || 1;
            const completed = completedRes?.count || 0;
            percentage = Math.round((completed / total) * 100);
        }
        
        return {
            title: topicName,
            percentage
        };
    });

    const userProfile = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        tutor_request_status: tutorRequest?.status || null,
        handle: user.username
          ? `@${user.username}`
          : `@${user.name.toLowerCase().replace(/\s+/g, "")}`,
        avatar:
          user.avatar ||
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
        profession: user.profession || "Designer",
        level: 2,
        current_course: "Typography",
        streak: user.current_streak || 0,
        xp: user.total_xp || 0,
        current_streak: user.current_streak || 0,
        total_xp: user.total_xp || 0,
        xp_percentile: (() => {
            const totalUsersRes = db.prepare("SELECT COUNT(*) as count FROM users").get() as any;
            const usersAheadRes = db.prepare("SELECT COUNT(*) as count FROM users WHERE total_xp > ?").get(user.total_xp || 0) as any;
            const totalUsers = totalUsersRes?.count || 1;
            const usersAhead = usersAheadRes?.count || 0;
            const topPercent = Math.max(1, Math.round((usersAhead / totalUsers) * 100));
            return `Top ${topPercent}%`;
        })(),
        typography_progress: typographyStats,
        stats: {
          lessons_completed: typographyStats.completed,
          badges_earned: (user.badges_json ? JSON.parse(user.badges_json).length : 0) || 0,
          total_xp: user.total_xp || 0,
        },
        bio: user.bio || "Design enthusiast.",
        skills: user.skills ? JSON.parse(user.skills) : [],
        topics_to_learn: topicsWithProgress,
        portfolio_items: user.portfolio_items ? JSON.parse(user.portfolio_items) : [],
        looking_for_work: !!user.looking_for_work,
      },
      history: [],
      enrollments: enrollments,
      badges: user.badges_json ? JSON.parse(user.badges_json) : [],
    };

    res.json(userProfile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

router.patch("/update", authenticate, (req: any, res: any) => {
  try {
    const userId = req.userId;
    const { name, username, bio, avatar } = req.body;

    // Check if username is already taken by another user
    if (username) {
      const existingUser = db.prepare("SELECT id FROM users WHERE username = ? AND id != ?").get(username, userId);
      if (existingUser) {
        return res.status(400).json({ error: "Username already taken" });
      }
    }

    db.prepare(`
      UPDATE users 
      SET name = COALESCE(?, name),
          username = COALESCE(?, username),
          bio = COALESCE(?, bio),
          avatar = COALESCE(?, avatar)
      WHERE id = ?
    `).run(name, username, bio, avatar, userId);

    res.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
});
 
import { storage } from "../lib/cloudinary";
 
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) return cb(null, true);
    cb(new Error("Only images are allowed (jpeg, jpg, png, webp)"));
  },
});
 
router.post("/upload-avatar", authenticate, upload.single("avatar"), (req: any, res: any) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
 
    const fileUrl = req.file.path; // Cloudinary URL is in req.file.path
    
    // Update user avatar in database
    db.prepare("UPDATE users SET avatar = ? WHERE id = ?").run(fileUrl, req.userId);

    res.json({ success: true, url: fileUrl });
  } catch (error: any) {
    console.error("Upload error:", error);
    res.status(500).json({ error: error.message || "Failed to upload image" });
  }
});

router.post("/decrement-scans", authenticate, (req: any, res: any) => {
  try {
    const userId = req.userId;
    const user = db.prepare("SELECT scan_balance FROM users WHERE id = ?").get(userId) as any;
    
    if (user && user.scan_balance > 0) {
      db.prepare("UPDATE users SET scan_balance = scan_balance - 1 WHERE id = ?").run(userId);
      return res.json({ success: true, remaining: user.scan_balance - 1 });
    }
    
    res.status(400).json({ error: "Insufficient scan balance" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
