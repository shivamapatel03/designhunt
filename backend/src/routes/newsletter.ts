import express from "express";
import { randomUUID } from "crypto";
import db from "../db";
import { sendWelcomeEmail } from "../lib/email";

const router = express.Router();

// Subscribe to newsletter
router.post("/subscribe", (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Valid email is required" });
    }

    // Check if they were already subscribed
    const existing = db.prepare("SELECT status FROM newsletter_subscribers WHERE email = ?").get(email) as any;
    const wasAlreadySubscribed = existing && existing.status === 'SUBSCRIBED';

    const id = randomUUID();
    db.prepare(
      "INSERT INTO newsletter_subscribers (id, email) VALUES (?, ?) ON CONFLICT(email) DO UPDATE SET status = 'SUBSCRIBED'"
    ).run(id, email);

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
