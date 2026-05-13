
import express from "express";
import db from "../db";
import { authenticate } from "../middleware/auth";
import multer from "multer";
import { storage } from "../lib/cloudinary";

const router = express.Router();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

router.get("/", authenticate, async (req: any, res: any) => {
  try {
    const userId = req.userId;
    console.log("Fetching profile for userId:", userId);
    
    const user = await db.get("SELECT * FROM users WHERE id = $1", [userId]) as any;

    if (!user) {
      console.log("Profile route: User NOT found in either DB for ID:", userId);
      return res.status(404).json({ error: "User not found" });
    }

    // Safely parse JSON columns
    const safeParse = (str: any) => {
      if (!str) return [];
      if (typeof str === 'object') return str; // Already parsed by driver
      try {
        return JSON.parse(str);
      } catch (e) {
        console.error("JSON Parse Error for string:", str);
        return [];
      }
    };

    const userProfile = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        handle: user.username ? `@${user.username}` : `@${user.name?.toLowerCase().replace(/\s+/g, "") || "user"}`,
        avatar: user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
        profession: user.profession || "Designer",
        level: user.level || 1,
        current_course: user.current_course || "None",
        streak: user.current_streak || 0,
        xp: user.total_xp || 0,
        current_streak: user.current_streak || 0,
        total_xp: user.total_xp || 0,
        xp_percentile: "Top 10%",
        typography_progress: { completed: 0, total: 30 },
        stats: {
          lessons_completed: user.lessons_completed || 0,
          badges_earned: safeParse(user.badges_json).length,
          total_xp: user.total_xp || 0,
        },
        bio: user.bio || "Design enthusiast.",
        skills: safeParse(user.skills),
        topics_to_learn: safeParse(user.topics_to_learn),
        portfolio_items: safeParse(user.portfolio_items),
        looking_for_work: !!user.looking_for_work,
      },
      history: [],
      enrollments: [],
      badges: safeParse(user.badges_json),
    };

    res.json(userProfile);
  } catch (error: any) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ error: "Failed to fetch profile", details: error.message });
  }
});

router.patch("/update", authenticate, async (req: any, res: any) => {
    try {
        const userId = req.userId;
        const { name, username, bio, avatar } = req.body;
        
        await db.run(`
          UPDATE users 
          SET name = COALESCE($1, name),
              username = COALESCE($2, username),
              bio = COALESCE($3, bio),
              avatar = COALESCE($4, avatar)
          WHERE id = $5
        `, [name, username, bio, avatar, userId]);

        res.json({ success: true, message: "Profile updated successfully" });
    } catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({ error: "Failed to update profile" });
    }
});

// Photo upload route
router.post("/upload-avatar", authenticate, upload.single("avatar"), async (req: any, res: any) => {
  try {
    const userId = req.userId;
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const avatarUrl = req.file.path; // Cloudinary URL
    
    await db.run("UPDATE users SET avatar = $1 WHERE id = $2", [avatarUrl, userId]);
    
    res.json({ 
      success: true, 
      url: avatarUrl,
      message: "Profile photo updated successfully" 
    });
  } catch (error) {
    console.error("Avatar upload error:", error);
    res.status(500).json({ error: "Failed to upload avatar" });
  }
});

export default router;
