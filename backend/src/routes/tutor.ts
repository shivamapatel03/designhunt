import express from "express";
import { authenticate } from "../middleware/auth";
import db from "../db";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// Apply to be a Tutor
router.post("/apply", authenticate, async (req: any, res) => {
  const { bio, experience, portfolio, expertise } = req.body;
  const userId = req.user.userId;

  try {
    // Check if request already exists
    const existing = await db.get(
      "SELECT * FROM tutor_requests WHERE user_id = $1 AND status = 'PENDING'",
      [userId]
    );
    if (existing) {
      return res
        .status(400)
        .json({ error: "You already have a pending application." });
    }

    const id = uuidv4();
    
    // Fetch user details for the record
    const user = await db.get("SELECT name, email, role FROM users WHERE id = $1", [userId]) as any;

    await db.run(`
      INSERT INTO tutor_requests (id, user_id, name, email, role, bio, expertise, portfolio, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'PENDING')
    `, [
      id,
      userId,
      user.name,
      user.email,
      user.role,
      bio,
      expertise,
      portfolio
    ]);

    res.json({ message: "Application submitted successfully." });
  } catch (err) {
    console.error("Error submitting tutor application:", err);
    res.status(500).json({ error: "Failed to submit application." });
  }
});

// Get My Application Status
router.get("/status", authenticate, async (req: any, res) => {
  const userId = req.user.userId;
  try {
    const request = await db.get(
      "SELECT * FROM tutor_requests WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1",
      [userId]
    );
    res.json(request || { status: null });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch status" });
  }
});

export default router;
