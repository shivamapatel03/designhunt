import express from "express";
import { randomUUID } from "crypto";
import db from "../db";
import { sendWelcomeEmail } from "../lib/email";

const router = express.Router();

// Subscribe to newsletter
router.post("/subscribe", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Valid email is required" });
    }

    // Check if they were already subscribed
    const existing = await db.get("SELECT status FROM newsletter_subscribers WHERE email = $1", [email]) as any;
    const wasAlreadySubscribed = existing && existing.status === 'SUBSCRIBED';

    const id = randomUUID();
    await db.run(
      "INSERT INTO newsletter_subscribers (id, email) VALUES ($1, $2) ON CONFLICT(email) DO UPDATE SET status = 'SUBSCRIBED'",
      [id, email]
    );

    // Send Welcome Email asynchronously if this is a new active subscription
    if (!wasAlreadySubscribed) {
      sendWelcomeEmail(email);
    }

    res.json({ success: true, message: "Subscribed successfully" });
  } catch (error) {
    console.error("Newsletter Subscribe Error:", error);
    res.status(500).json({ error: "Failed to subscribe" });
  }
});

export default router;
