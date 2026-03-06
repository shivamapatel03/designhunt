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

// Middleware for optional authentication
const authenticateOptional = (req: any, res: any, next: any) => {
  const token = req.cookies.token;
  if (!token) {
    req.userId = null;
    return next();
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    req.userId = payload.userId || payload.id;
    next();
  } catch (error) {
    req.userId = null;
    next();
  }
};

// GET ALL IDEAS
router.get("/", (req, res) => {
  try {
    const token = req.cookies.token;
    let userId: string | null = null;

    let isAuthenticated = false;

    if (token) {
      try {
        const payload = jwt.verify(token, JWT_SECRET) as any;
        userId = payload.userId || payload.id;
        isAuthenticated = true;
      } catch (e) {
        // Token invalid, ignore
      }
    }

    const effectiveUserId = userId || `GUEST_${req.ip || "unknown"}`;

    const { sort } = req.query;
    let query = "SELECT * FROM ideas";
    if (sort === "top") {
      query += " ORDER BY likes_count DESC";
    } else if (sort === "trending") {
      // Trending: Recent and liked
      query +=
        " ORDER BY (likes_count * 1.5 + comments_count) DESC, created_at DESC";
    } else if (sort === "saved") {
      if (!isAuthenticated)
        return res.status(401).json({ error: "Unauthorized" });
      query =
        "SELECT ideas.* FROM ideas JOIN idea_saves ON ideas.id = idea_saves.idea_id WHERE idea_saves.user_id = ? ORDER BY idea_saves.created_at DESC";
    } else if (sort === "liked") {
      if (!isAuthenticated)
        return res.status(401).json({ error: "Unauthorized" });
      query =
        "SELECT ideas.* FROM ideas JOIN idea_likes ON ideas.id = idea_likes.idea_id WHERE idea_likes.user_id = ? ORDER BY idea_likes.created_at DESC";
    } else {
      query += " ORDER BY created_at DESC";
    }

    const ideas =
      (sort === "saved" || sort === "liked") && isAuthenticated
        ? (db.prepare(query).all(userId) as any[])
        : (db.prepare(query).all() as any[]);

    if (effectiveUserId) {
      // Mark ideas liked by the user
      const likedIdeas = db
        .prepare(
          "SELECT idea_id, reaction_type FROM idea_likes WHERE user_id = ?",
        )
        .all(effectiveUserId) as any[];
      const likedMap = new Map(
        likedIdeas.map((l) => [l.idea_id, l.reaction_type]),
      );

      const savedIds = new Set();
      if (isAuthenticated && userId) {
        const savedIdeas = db
          .prepare("SELECT idea_id FROM idea_saves WHERE user_id = ?")
          .all(userId) as any[];
        savedIdeas.forEach((s) => savedIds.add(s.idea_id));
      }

      const enrichedIdeas = ideas.map((idea) => ({
        ...idea,
        liked: likedMap.has(idea.id),
        reaction_type: likedMap.get(idea.id) || null,
        saved: savedIds.has(idea.id),
      }));
      return res.json(enrichedIdeas);
    }

    res.json(ideas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch ideas" });
  }
});

// SUBMIT IDEA
router.post("/", authenticate, (req: any, res: any) => {
  try {
    const { idea, image, user_handle, user_avatar, name, email } = req.body;
    const user_id = req.userId;

    if (!idea) {
      return res.status(400).json({ error: "Idea content is required" });
    }

    const stmt = db.prepare(
      "INSERT INTO ideas (idea, image, user_id, user_handle, user_avatar, name, email) VALUES (?, ?, ?, ?, ?, ?, ?)",
    );

    const info = stmt.run(
      idea,
      image || null,
      user_id,
      user_handle || null,
      user_avatar || null,
      name || user_handle || "Anonymous",
      email || "user@designhunt.com",
    );

    res.json({ success: true, id: info.lastInsertRowid });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to submit idea" });
  }
});

// UPDATE IDEA
router.patch("/:id", authenticate, (req: any, res: any) => {
  try {
    const { idea, image } = req.body;
    const idea_id = req.params.id;
    const user_id = req.userId;

    const existingIdea = db
      .prepare("SELECT user_id FROM ideas WHERE id = ?")
      .get(idea_id) as any;
    if (!existingIdea) return res.status(404).json({ error: "Idea not found" });

    if (existingIdea.user_id !== user_id) {
      return res
        .status(403)
        .json({ error: "Forbidden: You don't own this spark." });
    }

    db.prepare("UPDATE ideas SET idea = ?, image = ? WHERE id = ?").run(
      idea,
      image || null,
      idea_id,
    );
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update idea" });
  }
});

// DELETE IDEA
router.delete("/:id", authenticate, (req: any, res: any) => {
  try {
    const idea_id = req.params.id;
    const user_id = req.userId;

    const idea = db
      .prepare("SELECT user_id FROM ideas WHERE id = ?")
      .get(idea_id) as any;
    if (!idea) return res.status(404).json({ error: "Idea not found" });

    if (idea.user_id !== user_id) {
      return res
        .status(403)
        .json({ error: "Forbidden: You don't own this spark." });
    }

    db.prepare("DELETE FROM idea_likes WHERE idea_id = ?").run(idea_id);
    db.prepare("DELETE FROM idea_comments WHERE idea_id = ?").run(idea_id);
    db.prepare("DELETE FROM ideas WHERE id = ?").run(idea_id);

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete idea" });
  }
});

// LIKE IDEA (With Reaction Types)
router.post("/:id/like", authenticateOptional, (req: any, res: any) => {
  try {
    const idea_id = req.params.id;
    const user_id = req.userId || `GUEST_${req.ip || "unknown"}`;
    const { type = "heart" } = req.body;

    const existingLike = db
      .prepare(
        "SELECT id, reaction_type FROM idea_likes WHERE idea_id = ? AND user_id = ?",
      )
      .get(idea_id, user_id) as any;

    if (existingLike) {
      if (existingLike.reaction_type === type) {
        // Same reaction type -> Toggle off (Unlike)
        db.prepare(
          "DELETE FROM idea_likes WHERE idea_id = ? AND user_id = ?",
        ).run(idea_id, user_id);
        db.prepare(
          "UPDATE ideas SET likes_count = likes_count - 1 WHERE id = ?",
        ).run(idea_id);
        res.json({ success: true, liked: false, reaction_type: null });
      } else {
        // Different reaction type -> Change reaction type
        db.prepare(
          "UPDATE idea_likes SET reaction_type = ? WHERE idea_id = ? AND user_id = ?",
        ).run(type, idea_id, user_id);
        res.json({ success: true, liked: true, reaction_type: type });
      }
    } else {
      // New like
      db.prepare(
        "INSERT INTO idea_likes (idea_id, user_id, reaction_type) VALUES (?, ?, ?)",
      ).run(idea_id, user_id, type);
      db.prepare(
        "UPDATE ideas SET likes_count = likes_count + 1 WHERE id = ?",
      ).run(idea_id);
      res.json({ success: true, liked: true, reaction_type: type });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to react to idea" });
  }
});

// GET ALL COMMENTS FOR AN IDEA
router.get("/:id/comment", (req, res) => {
  try {
    const idea_id = req.params.id;
    const comments = db
      .prepare(
        "SELECT * FROM idea_comments WHERE idea_id = ? ORDER BY created_at ASC",
      )
      .all(idea_id);
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

// POST A COMMENT
router.post("/:id/comment", authenticateOptional, (req: any, res: any) => {
  try {
    const idea_id = req.params.id;
    const user_id =
      req.userId || `GUEST_${Math.random().toString(36).substr(2, 9)}`;
    const { user_handle, user_avatar, content } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Comment content is required" });
    }

    db.prepare(
      "INSERT INTO idea_comments (idea_id, user_id, user_handle, user_avatar, content) VALUES (?, ?, ?, ?, ?)",
    ).run(
      idea_id,
      user_id,
      user_handle || (req.userId ? "Designer" : "Guest Designer"),
      user_avatar ||
        (req.userId
          ? null
          : "https://api.dicebear.com/7.x/avataaars/svg?seed=guest"),
      content,
    );

    // Update comment count
    db.prepare(
      "UPDATE ideas SET comments_count = comments_count + 1 WHERE id = ?",
    ).run(idea_id);

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to post comment" });
  }
});

// TOGGLE SAVE IDEA
router.post("/:id/save", authenticate, (req: any, res: any) => {
  try {
    const idea_id = req.params.id;
    const user_id = req.userId;

    const existingSave = db
      .prepare("SELECT id FROM idea_saves WHERE idea_id = ? AND user_id = ?")
      .get(idea_id, user_id);

    if (existingSave) {
      // Unsave
      db.prepare(
        "DELETE FROM idea_saves WHERE idea_id = ? AND user_id = ?",
      ).run(idea_id, user_id);
      res.json({ success: true, saved: false });
    } else {
      // Save
      db.prepare("INSERT INTO idea_saves (idea_id, user_id) VALUES (?, ?)").run(
        idea_id,
        user_id,
      );
      res.json({ success: true, saved: true });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save idea" });
  }
});

export default router;
