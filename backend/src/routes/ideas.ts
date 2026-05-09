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
router.get("/", async (req, res) => {
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
    let params: any[] = [];

    if (sort === "top") {
      query += " ORDER BY likes_count DESC";
    } else if (sort === "trending") {
      // Trending: Recent and liked
      query += " ORDER BY (likes_count * 1.5 + comments_count) DESC, created_at DESC";
    } else if (sort === "saved") {
      if (!isAuthenticated)
        return res.status(401).json({ error: "Unauthorized" });
      query = "SELECT ideas.* FROM ideas JOIN idea_saves ON ideas.id = idea_saves.idea_id WHERE idea_saves.user_id = $1 ORDER BY idea_saves.created_at DESC";
      params = [userId];
    } else if (sort === "liked") {
      if (!isAuthenticated)
        return res.status(401).json({ error: "Unauthorized" });
      query = "SELECT ideas.* FROM ideas JOIN idea_likes ON ideas.id = idea_likes.idea_id WHERE idea_likes.user_id = $1 ORDER BY idea_likes.created_at DESC";
      params = [userId];
    } else {
      query += " ORDER BY created_at DESC";
    }

    const ideas = await db.all(query, params) as any[];

    if (effectiveUserId) {
      // Mark ideas liked by the user
      const likedIdeas = await db.all(
        "SELECT idea_id, reaction_type FROM idea_likes WHERE user_id = $1",
        [effectiveUserId]
      ) as any[];
      const likedMap = new Map(
        likedIdeas.map((l) => [l.idea_id, l.reaction_type]),
      );

      const savedIds = new Set();
      if (isAuthenticated && userId) {
        const savedIdeas = await db.all("SELECT idea_id FROM idea_saves WHERE user_id = $1", [userId]) as any[];
        savedIdeas.forEach((s) => savedIds.add(s.idea_id));
      }

      const enrichedIdeas = ideas.map((idea) => ({
        ...idea,
        liked: likedMap.has(String(idea.id)),
        reaction_type: likedMap.get(String(idea.id)) || null,
        saved: savedIds.has(String(idea.id)),
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
router.post("/", authenticate, async (req: any, res: any) => {
  try {
    const { idea, image, user_handle, user_avatar, name, email } = req.body;
    const user_id = req.userId;

    if (!idea) {
      return res.status(400).json({ error: "Idea content is required" });
    }

    const res_db = await db.get(
      "INSERT INTO ideas (idea, image, user_id, user_handle, user_avatar, name, email) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
      [
        idea,
        image || null,
        user_id,
        user_handle || null,
        user_avatar || null,
        name || user_handle || "Anonymous",
        email || "user@designhunt.com",
      ]
    ) as any;

    res.json({ success: true, id: res_db.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to submit idea" });
  }
});

// UPDATE IDEA
router.patch("/:id", authenticate, async (req: any, res: any) => {
  try {
    const { idea, image } = req.body;
    const idea_id = req.params.id;
    const user_id = req.userId;

    const existingIdea = await db.get("SELECT user_id FROM ideas WHERE id = $1", [idea_id]) as any;
    if (!existingIdea) return res.status(404).json({ error: "Idea not found" });

    if (existingIdea.user_id !== user_id) {
      return res
        .status(403)
        .json({ error: "Forbidden: You don't own this spark." });
    }

    await db.run("UPDATE ideas SET idea = $1, image = $2 WHERE id = $3", [
      idea,
      image || null,
      idea_id,
    ]);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update idea" });
  }
});

// DELETE IDEA
router.delete("/:id", authenticate, async (req: any, res: any) => {
  try {
    const idea_id = req.params.id;
    const user_id = req.userId;

    const idea = await db.get("SELECT user_id FROM ideas WHERE id = $1", [idea_id]) as any;
    if (!idea) return res.status(404).json({ error: "Idea not found" });

    if (idea.user_id !== user_id) {
      return res
        .status(403)
        .json({ error: "Forbidden: You don't own this spark." });
    }

    await db.run("DELETE FROM idea_likes WHERE idea_id = $1", [idea_id]);
    await db.run("DELETE FROM idea_comments WHERE idea_id = $1", [idea_id]);
    await db.run("DELETE FROM ideas WHERE id = $1", [idea_id]);

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete idea" });
  }
});

// LIKE IDEA (With Reaction Types)
router.post("/:id/like", authenticateOptional, async (req: any, res: any) => {
  try {
    const idea_id = req.params.id;
    const user_id = req.userId || `GUEST_${req.ip || "unknown"}`;
    const { type = "heart" } = req.body;

    const existingLike = await db.get(
      "SELECT id, reaction_type FROM idea_likes WHERE idea_id = $1 AND user_id = $2",
      [idea_id, user_id]
    ) as any;

    if (existingLike) {
      if (existingLike.reaction_type === type) {
        // Same reaction type -> Toggle off (Unlike)
        await db.run(
          "DELETE FROM idea_likes WHERE idea_id = $1 AND user_id = $2",
          [idea_id, user_id]
        );
        await db.run(
          "UPDATE ideas SET likes_count = likes_count - 1 WHERE id = $1",
          [idea_id]
        );
        res.json({ success: true, liked: false, reaction_type: null });
      } else {
        // Different reaction type -> Change reaction type
        await db.run(
          "UPDATE idea_likes SET reaction_type = $1 WHERE idea_id = $2 AND user_id = $3",
          [type, idea_id, user_id]
        );
        res.json({ success: true, liked: true, reaction_type: type });
      }
    } else {
      // New like
      await db.run(
        "INSERT INTO idea_likes (idea_id, user_id, reaction_type) VALUES ($1, $2, $3)",
        [idea_id, user_id, type]
      );
      await db.run(
        "UPDATE ideas SET likes_count = likes_count + 1 WHERE id = $1",
        [idea_id]
      );
      res.json({ success: true, liked: true, reaction_type: type });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to react to idea" });
  }
});

// GET ALL COMMENTS FOR AN IDEA
router.get("/:id/comment", async (req, res) => {
  try {
    const idea_id = req.params.id;
    const comments = await db.all(
      "SELECT * FROM idea_comments WHERE idea_id = $1 ORDER BY created_at ASC",
      [idea_id]
    );
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

// POST A COMMENT
router.post("/:id/comment", authenticateOptional, async (req: any, res: any) => {
  try {
    const idea_id = req.params.id;
    const user_id =
      req.userId || `GUEST_${Math.random().toString(36).substr(2, 9)}`;
    const { user_handle, user_avatar, content } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Comment content is required" });
    }

    await db.run(
      "INSERT INTO idea_comments (idea_id, user_id, user_handle, user_avatar, content) VALUES ($1, $2, $3, $4, $5)",
      [
        idea_id,
        user_id,
        user_handle || (req.userId ? "Designer" : "Guest Designer"),
        user_avatar ||
          (req.userId
            ? null
            : "https://api.dicebear.com/7.x/avataaars/svg?seed=guest"),
        content,
      ]
    );

    // Update comment count
    await db.run(
      "UPDATE ideas SET comments_count = comments_count + 1 WHERE id = $1",
      [idea_id]
    );

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to post comment" });
  }
});

// TOGGLE SAVE IDEA
router.post("/:id/save", authenticate, async (req: any, res: any) => {
  try {
    const idea_id = req.params.id;
    const user_id = req.userId;

    const existingSave = await db.get("SELECT id FROM idea_saves WHERE idea_id = $1 AND user_id = $2", [idea_id, user_id]);

    if (existingSave) {
      // Unsave
      await db.run(
        "DELETE FROM idea_saves WHERE idea_id = $1 AND user_id = $2",
        [idea_id, user_id]
      );
      res.json({ success: true, saved: false });
    } else {
      // Save
      await db.run("INSERT INTO idea_saves (idea_id, user_id) VALUES ($1, $2)", [
        idea_id,
        user_id,
      ]);
      res.json({ success: true, saved: true });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save idea" });
  }
});

export default router;
