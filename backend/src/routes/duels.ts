import express, { Request, Response } from "express";
import db from "../db";
import { randomUUID } from "crypto";

const router = express.Router();

// GET /daily - Fetch current daily duel
router.get("/daily", async (req: Request, res: Response) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    // Get today's duel
    let duel = await db.get("SELECT * FROM daily_duels WHERE date = $1", [today]) as any;

    // Fallback: Get most recent duel if today's is missing
    if (!duel) {
      duel = await db.get("SELECT * FROM daily_duels ORDER BY date DESC LIMIT 1") as any;
    }

    if (!duel) {
      res.status(404).json({ error: "No daily duel found" });
      return;
    }

    // Get vote counts
    const votes = await db.get(
      `
            SELECT 
                SUM(CASE WHEN choice = 'A' THEN 1 ELSE 0 END) as votes_a,
                SUM(CASE WHEN choice = 'B' THEN 1 ELSE 0 END) as votes_b,
                COUNT(*) as total_votes
            FROM duel_votes 
            WHERE duel_id = $1
        `,
      [duel.id]
    ) as any;

    res.json({
      ...duel,
      votes: {
        a: parseInt(votes.votes_a || "0"),
        b: parseInt(votes.votes_b || "0"),
        total: parseInt(votes.total_votes || "0"),
      },
    });
  } catch (error) {
    console.error("Error fetching daily duel:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /daily/:id/vote - Vote on a duel
router.post("/:id/vote", async (req: Request, res: Response) => {
  try {
    const { choice, userId } = req.body; // userId is optional (can be anon session)

    if (!["A", "B"].includes(choice)) {
      res.status(400).json({ error: "Invalid choice. Must be 'A' or 'B'." });
      return;
    }

    // Start transaction
    const voteId = randomUUID();

    // If userId is provided, ensure unique vote per user
    if (userId) {
      const existing = await db.get("SELECT id FROM duel_votes WHERE duel_id = $1 AND user_id = $2", [req.params.id, userId]);
      if (existing) {
        res.status(400).json({ error: "User already voted on this duel." });
        return;
      }
    }

    await db.run(
      `
            INSERT INTO duel_votes (id, duel_id, user_id, choice)
            VALUES ($1, $2, $3, $4)
        `,
      [voteId, req.params.id, userId || null, choice]
    );

    // Return updated stats
    const votes = await db.get(
      `
             SELECT 
                SUM(CASE WHEN choice = 'A' THEN 1 ELSE 0 END) as votes_a,
                SUM(CASE WHEN choice = 'B' THEN 1 ELSE 0 END) as votes_b,
                COUNT(*) as total_votes
            FROM duel_votes 
            WHERE duel_id = $1
        `,
      [req.params.id]
    ) as any;

    res.json({
      success: true,
      votes: {
        a: parseInt(votes.votes_a || "0"),
        b: parseInt(votes.votes_b || "0"),
        total: parseInt(votes.total_votes || "0"),
      },
    });
  } catch (error) {
    console.error("Error voting on duel:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
