import express from "express";
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
        level: 1,
        xp: 0,
        nextLevelXp: 1000,
        stats: {
          challenges_completed: 0,
          sprints_won: 0,
          theory_mastered: 0,
        },
        bio: user.bio || "Design enthusiast.",
        skills: user.skills ? JSON.parse(user.skills) : [],
      },
      history: [],
      enrollments: enrollments,
      badges: [],
    };

    res.json(userProfile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

export default router;
