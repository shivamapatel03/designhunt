import express, { Request, Response } from "express";
import db from "../db";
import { authenticateToken } from "../middleware/auth";
import { z } from "zod";
import crypto from "crypto";

const router = express.Router();

// Validation Schemas
const submissionSchema = z.object({
  content: z.string().min(1, "Content is required"),
});

// GET /daily - Fetch the current active daily challenge
router.get("/daily", (req: Request, res: Response) => {
  try {
    // Find a challenge of type 'DAILY' that expires in the future
    const dailyChallenge = db
      .prepare(
        "SELECT * FROM challenges WHERE type = 'DAILY' AND expires_at > datetime('now') ORDER BY expires_at ASC LIMIT 1",
      )
      .get();

    // Fallback: get the latest created challenge of type 'DAILY' (even if expired, to show something)
    const fallback =
      dailyChallenge ||
      db
        .prepare(
          "SELECT * FROM challenges WHERE type = 'DAILY' ORDER BY created_at DESC LIMIT 1",
        )
        .get();

    if (!fallback) {
      // If absolutely no daily challenge exists, return 404
      res.status(404).json({ error: "No daily challenge found" });
      return;
    }

    res.json(fallback);
  } catch (error) {
    console.error("Error fetching daily challenge:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /:id - Fetch challenge details
router.get("/:id", (req: Request, res: Response) => {
  try {
    const challenge = db
      .prepare("SELECT * FROM challenges WHERE id = ?")
      .get(req.params.id);
    if (!challenge) {
      res.status(404).json({ error: "Challenge not found" });
      return;
    }
    res.json(challenge);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /:id/submit - Submit a solution
router.post("/:id/submit", authenticateToken, (req: Request, res: Response) => {
  try {
    const { content } = submissionSchema.parse(req.body);

    // Check if user has already submitted
    const existing = db
      .prepare(
        "SELECT * FROM submissions WHERE user_id = ? AND challenge_id = ?",
      )
      .get(req.user!.userId, req.params.id);

    if (existing) {
      res
        .status(400)
        .json({ error: "You have already submitted for this challenge" });
      return;
    }

    const id = crypto.randomUUID();
    db.prepare(
      "INSERT INTO submissions (id, user_id, challenge_id, content) VALUES (?, ?, ?, ?)",
    ).run(id, req.user!.userId, req.params.id, content);

    res.json({ success: true, id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: (error as any).errors[0].message });
      return;
    }
    console.error("Submission error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /:id/submissions - Get submissions for a challenge (with vote counts)
// Optional: authenticateToken to see if current user voted?
router.get(
  "/:id/submissions",
  authenticateToken,
  (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;

      const submissions = db
        .prepare(
          `
        SELECT 
          s.*, 
          u.name as user_name, 
          u.avatar as user_avatar,
          (SELECT COUNT(*) FROM submission_votes sv WHERE sv.submission_id = s.id) as vote_count,
          EXISTS(SELECT 1 FROM submission_votes sv WHERE sv.submission_id = s.id AND sv.user_id = ?) as has_voted
        FROM submissions s
        JOIN users u ON s.user_id = u.id
        WHERE s.challenge_id = ?
        ORDER BY vote_count DESC, s.created_at DESC
      `,
        )
        .all(userId || null, req.params.id);

      res.json(submissions);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// POST /submissions/:id/vote - Vote for a submission
router.post(
  "/submissions/:id/vote",
  authenticateToken,
  (req: Request, res: Response) => {
    try {
      const submissionId = req.params.id;
      const userId = req.user!.userId;

      // Check if submitting user is trying to vote for themselves
      const submission = db
        .prepare("SELECT user_id FROM submissions WHERE id = ?")
        .get(submissionId) as any;

      if (!submission) {
        res.status(404).json({ error: "Submission not found" });
        return;
      }

      if (submission.user_id === userId) {
        res
          .status(400)
          .json({ error: "You cannot vote for your own submission" });
        return;
      }

      // Toggle vote: if exists delete, if not insert
      const existingVote = db
        .prepare(
          "SELECT * FROM submission_votes WHERE user_id = ? AND submission_id = ?",
        )
        .get(userId, submissionId);

      if (existingVote) {
        db.prepare(
          "DELETE FROM submission_votes WHERE user_id = ? AND submission_id = ?",
        ).run(userId, submissionId);
        res.json({ success: true, voted: false });
      } else {
        const id = crypto.randomUUID();
        db.prepare(
          "INSERT INTO submission_votes (id, user_id, submission_id) VALUES (?, ?, ?)",
        ).run(id, userId, submissionId);
        res.json({ success: true, voted: true });
      }
    } catch (error) {
      console.error("Voting error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// GET /:id/leaderboard - Get top 3 submissions
router.get("/:id/leaderboard", (req: Request, res: Response) => {
  try {
    const leaderboard = db
      .prepare(
        `
        SELECT 
          s.*, 
          u.name as user_name, 
          u.avatar as user_avatar,
          (SELECT COUNT(*) FROM submission_votes sv WHERE sv.submission_id = s.id) as vote_count
        FROM submissions s
        JOIN users u ON s.user_id = u.id
        WHERE s.challenge_id = ?
        ORDER BY vote_count DESC
        LIMIT 3
      `,
      )
      .all(req.params.id);

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
