import express from "express";
import { authenticateToken } from "../middleware/auth";
import db from "../db";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// Apply to be a Tutor
router.post("/apply", authenticateToken, (req: any, res) => {
  const { bio, experience, portfolio, expertise } = req.body;
  const userId = req.user.userId;

  try {
    // Check if request already exists
    const existing = db
      .prepare(
        "SELECT * FROM tutor_requests WHERE user_id = ? AND status = 'PENDING'",
      )
      .get(userId);
    if (existing) {
      return res
        .status(400)
        .json({ error: "You already have a pending application." });
    }

    const id = uuidv4();
    const stmt = db.prepare(`
      INSERT INTO tutor_requests (id, user_id, name, email, role, bio, expertise, portfolio, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'PENDING')
    `);

    // Fetch user details for the record
    const user = db
      .prepare("SELECT name, email, role FROM users WHERE id = ?")
      .get(userId) as any;

    stmt.run(
      id,
      userId,
      user.name,
      user.email,
      user.role,
      bio,
      expertise,
      portfolio,
    );

    res.json({ message: "Application submitted successfully." });
  } catch (err) {
    console.error("Error submitting tutor application:", err);
    res.status(500).json({ error: "Failed to submit application." });
  }
});

// Get My Application Status
router.get("/status", authenticateToken, (req: any, res) => {
  const userId = req.user.userId;
  try {
    const request = db
      .prepare(
        "SELECT * FROM tutor_requests WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
      )
      .get(userId);
    res.json(request || { status: null });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch status" });
  }
});

export default router;
