import express from "express";
import db from "../db";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { sendCodeRotationEmail, sendIdeaFeedbackEmail, sendNewsletterEmail } from "../lib/email";
import { logAction, getAuditLogs } from "../lib/audit";
import { getAllSettings, updateSetting } from "../lib/settings";
import { getFinancialStats } from "../lib/finance";
import { authenticateToken, requireSuperAdmin } from "../middleware/auth";

const router = express.Router();

// Create Admin (Super Admin only)
router.post(
  "/create-admin",
  authenticateToken,
  requireSuperAdmin,
  async (req: any, res) => {
    try {
      const { email, name, avatar } = req.body;

      const existingUser = db
        .prepare("SELECT id FROM users WHERE email = ?")
        .get(email);
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      // Generate Random Password
      const password =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8); // simple random string
      const hashedPassword = await bcrypt.hash(password, 10);
      const id = randomUUID();

      db.prepare(
        "INSERT INTO users (id, email, password, name, role, status, email_verified, avatar) VALUES (?, ?, ?, ?, 'ADMIN', 'APPROVED', 1, ?)",
      ).run(id, email, hashedPassword, name || "Admin", avatar || null);

      logAction(req.user.userId, "CREATE_ADMIN", id, { email, name });

      console.log(`[CREATE ADMIN] Request for: ${email}`);
      res.json({ success: true, password }); // Return password to Super Admin
    } catch (error: any) {
      console.error("[CREATE ADMIN ERROR]:", error.message);
      res
        .status(500)
        .json({ error: "Failed to create admin", details: error.message });
    }
  },
);

// Get Global Settings
router.get("/settings", authenticateToken, requireSuperAdmin, (req, res) => {
  try {
    const settings = getAllSettings();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch settings" });
  }
});

// Update Global Settings
router.post(
  "/settings",
  authenticateToken,
  requireSuperAdmin,
  (req: any, res) => {
    try {
      const { key, value } = req.body;
      if (!key) return res.status(400).json({ error: "Key is required" });

      const success = updateSetting(key, String(value));
      if (success) {
        logAction(req.user.userId, "UPDATE_SETTING", key, { value });
        res.json({ success: true });
      } else {
        res.status(500).json({ error: "Failed to update setting" });
      }
    } catch (err) {
      res.status(500).json({ error: "Failed to update setting" });
    }
  },
);

// Get Audit Logs
router.get("/audit-logs", authenticateToken, requireSuperAdmin, (req, res) => {
  try {
    const logs = getAuditLogs();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch logs" });
  }
});

// Get Financial Stats
router.get("/financials", authenticateToken, requireSuperAdmin, (req, res) => {
  try {
    const stats = getFinancialStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch financials" });
  }
});

// Get Admin Access Code
router.get("/code", (req, res) => {
  try {
    const row = db
      .prepare("SELECT value FROM system_settings WHERE key = 'ADMIN_CODE'")
      .get() as any;
    const code = row ? row.value : process.env.ADMIN_CODE || "DESIGNHUNT_ADMIN";
    res.json({ code });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch code" });
  }
});

// Delete User (Generic)
router.post(
  "/delete-user",
  authenticateToken,
  requireSuperAdmin,
  (req: any, res) => {
    try {
      const { id } = req.body;
      db.prepare("DELETE FROM users WHERE id = ?").run(id);

      logAction(req.user.userId, "DELETE_USER", id, {});

      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete user" });
    }
  },
);

// Delete All Users (Except Super Admin)
router.post(
  "/delete-all-users",
  authenticateToken,
  requireSuperAdmin,
  (req: any, res) => {
    try {
      db.prepare("DELETE FROM users WHERE role != 'SUPER_ADMIN'").run();
      logAction(req.user.userId, "DELETE_ALL_USERS", "", {});
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to clear users" });
    }
  },
);

// Rotate Super Admin Access Code
router.post("/rotate-access-code", async (req, res) => {
  try {
    // Generate 8-character alphanumeric code
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Removed confusables like I, 1, O, 0
    let newCode = "";
    for (let i = 0; i < 8; i++) {
      newCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    db.prepare(
      "INSERT OR REPLACE INTO system_settings (key, value) VALUES ('ADMIN_CODE', ?)",
    ).run(newCode);

    // Notify Admin via Email
    const adminEmail = process.env.ADMIN_EMAIL || "shivamsenton@gmail.com";
    await sendCodeRotationEmail(adminEmail, newCode);

    res.json({ success: true, code: newCode });
  } catch (error: any) {
    console.error("Rotate Code Error:", error);
    res.status(500).json({ error: "Failed to rotate code" });
  }
});

// Emergency Reset Access Code
router.post("/reset-access-code", async (req, res) => {
  try {
    const defaultCode = "DESIGNHUNT_ADMIN";

    db.prepare(
      "INSERT OR REPLACE INTO system_settings (key, value) VALUES ('ADMIN_CODE', ?)",
    ).run(defaultCode);

    // Notify Admin via Email
    const adminEmail = process.env.ADMIN_EMAIL || "shivamsenton@gmail.com";
    await sendCodeRotationEmail(adminEmail, defaultCode);

    res.json({ success: true, code: defaultCode });
  } catch (error: any) {
    console.error("Reset Code Error:", error);
    res.status(500).json({ error: "Failed to reset code" });
  }
});

// Backup Database
router.post(
  "/backup",
  authenticateToken,
  requireSuperAdmin,
  async (req: any, res) => {
    try {
      const fs = require("fs");
      const path = require("path");

      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const backupDir = path.join(__dirname, "../../backups");
      const dbPath = path.join(__dirname, "../../designhunt_v2.db");
      const backupPath = path.join(backupDir, `designhunt_v2_${timestamp}.db`);

      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir);
      }

      fs.copyFileSync(dbPath, backupPath);

      logAction(req.user.userId, "BACKUP_DATABASE", "SYSTEM", { path: backupPath });

      res.json({ success: true, filename: `designhunt_v2_${timestamp}.db` });
    } catch (err: any) {
      console.error("Backup failed:", err);
      res.status(500).json({ error: "Backup failed: " + err.message });
    }
  },
);

// Send Idea Feedback Email
router.post(
  "/send-idea-feedback",
  authenticateToken,
  requireSuperAdmin,
  async (req: any, res) => {
    try {
      const { email, userName, ideaText, feedback } = req.body;

      if (!email || !userName || !ideaText || !feedback) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const result = await sendIdeaFeedbackEmail(
        email,
        userName,
        ideaText,
        feedback,
      );

      if (result.success) {
        logAction(req.user.userId, "SEND_IDEA_FEEDBACK", email, { ideaText });
        res.json({ success: true });
      } else {
        res.status(500).json({ error: "Failed to send email" });
      }
    } catch (error: any) {
      console.error("Feedback Email Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// Get all Expert Reviews
router.get("/expert-reviews", authenticateToken, (req: any, res) => {
  try {
    const reviews = db.prepare("SELECT * FROM expert_reviews ORDER BY created_at DESC").all();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

// Create an Expert Review
router.post("/expert-reviews", authenticateToken, (req: any, res) => {
  try {
    const { author_name, author_title, rating, content, author_image } = req.body;
    
    if (!author_name || !content) {
      return res.status(400).json({ error: "Name and content are required" });
    }

    const id = randomUUID();
    db.prepare(
      "INSERT INTO expert_reviews (id, author_name, author_title, rating, content, author_image) VALUES (?, ?, ?, ?, ?, ?)"
    ).run(id, author_name, author_title || null, rating || 5.0, content, author_image || null);

    logAction(req.user.userId, "CREATE_EXPERT_REVIEW", id, { author_name });
    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: "Failed to create review" });
  }
});

// Delete an Expert Review
router.delete("/expert-reviews/:id", authenticateToken, (req: any, res) => {
  try {
    const { id } = req.params;
    db.prepare("DELETE FROM expert_reviews WHERE id = ?").run(id);
    
    logAction(req.user.userId, "DELETE_EXPERT_REVIEW", id, {});
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete review" });
  }
});

// Send Newsletter to all active subscribers
router.post(
  "/newsletter/send",
  authenticateToken,
  requireSuperAdmin,
  async (req: any, res) => {
    try {
      const { subject, headerImageUrl, bodyText, ctaText, ctaLink } = req.body;

      if (!subject || !bodyText) {
        return res.status(400).json({ error: "Subject and Body text are required" });
      }

      // Fetch all subscribed emails
      const subscribers = db.prepare("SELECT email FROM newsletter_subscribers WHERE status = 'SUBSCRIBED'").all() as { email: string }[];

      if (subscribers.length === 0) {
        return res.status(400).json({ error: "No active subscribers found" });
      }

      let successCount = 0;
      let failCount = 0;

      // Send to all subscribers asynchronously
      for (const sub of subscribers) {
        const result = await sendNewsletterEmail(sub.email, subject, headerImageUrl, bodyText, ctaText, ctaLink);
        if (result.success) {
          successCount++;
        } else {
          failCount++;
        }
      }

      if ((req as any).user) {
        logAction((req as any).user.userId, "SEND_NEWSLETTER", "BULK", { subject, successCount, failCount });
      }

      res.json({ 
        success: true, 
        message: `Newsletter sent to ${successCount} subscribers. Failed: ${failCount}` 
      });
    } catch (error: any) {
      console.error("Newsletter Bulk Send Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Get subscriber list and count
router.get(
  "/newsletter/subscribers",
  authenticateToken,
  requireSuperAdmin,
  (req, res) => {
    try {
      const subscribers = db.prepare("SELECT * FROM newsletter_subscribers ORDER BY created_at DESC").all();
      res.json({ success: true, subscribers });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch subscribers" });
    }
  }
);

// Delete a subscriber
router.delete(
  "/newsletter/subscribers/:id",
  authenticateToken,
  requireSuperAdmin,
  (req, res) => {
    try {
      const { id } = req.params;
      db.prepare("DELETE FROM newsletter_subscribers WHERE id = ?").run(id);
      if ((req as any).user) {
        logAction((req as any).user.userId, "DELETE_SUBSCRIBER", id as string, {});
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete subscriber" });
    }
  }
);

// List all admins for Super Admin
router.get(
  "/admins",
  authenticateToken,
  requireSuperAdmin,
  (req, res) => {
    try {
      const admins = db.prepare("SELECT id, name, email, role, status, created_at FROM users WHERE role IN (?, ?)").all('ADMIN', 'SUPER_ADMIN');
      res.json({ success: true, admins });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch admins" });
    }
  }
);

// Invite a new admin (creates user with generated password)
router.post(
  "/invite-admin",
  authenticateToken,
  requireSuperAdmin,
  async (req: any, res) => {
    try {
      const { name, email } = req.body;
      const { randomUUID, randomBytes } = require('crypto');
      const bcrypt = require('bcryptjs');
      const { sendAdminOnboardingEmail } = require('../lib/email');
      
      const existing = db.prepare("SELECT id, role, name FROM users WHERE email = ?").get(email) as any;
      
      // Generate a secure random password (12 chars)
      const generatedPassword = randomBytes(6).toString('hex');
      const hashedPassword = await bcrypt.hash(generatedPassword, 10);

      let userId: string;
      let userName = name;

      if (existing) {
        if (existing.role === 'ADMIN' || existing.role === 'SUPER_ADMIN') {
          return res.status(400).json({ error: "This user is already an administrator." });
        }
        userId = existing.id;
        userName = existing.name || name;
        db.prepare("UPDATE users SET role = 'ADMIN', password = ?, status = 'APPROVED' WHERE id = ?").run(hashedPassword, userId);
      } else {
        userId = randomUUID();
        db.prepare("INSERT INTO users (id, name, email, password, role, status, email_verified) VALUES (?, ?, ?, ?, 'ADMIN', 'APPROVED', 1)").run(userId, name, email, hashedPassword);
      }

      // Send Email with Password
      const emailRes = await sendAdminOnboardingEmail(email, generatedPassword, userName);
      
      if (req.user) {
        logAction(req.user.userId, "INVITE_ADMIN", userId, { email, autoEmailSent: emailRes.success });
      }

      if (!emailRes.success) {
        console.warn(`[INVITE FALLBACK] Email failed for ${email}. Password: ${generatedPassword}`);
        return res.json({ 
          success: true, 
          userId, 
          message: "Admin created but email failed. You can manually give them the password from console.",
          passwordFallback: generatedPassword 
        });
      }

      res.json({ success: true, userId, message: "Invitation sent with password!" });
    } catch (error) {
      console.error("Invite Admin Error:", error);
      res.status(500).json({ error: "Failed to invite admin" });
    }
  }
);

// Delete an admin
router.delete(
  "/admins/:id",
  authenticateToken,
  requireSuperAdmin,
  (req: any, res) => {
    try {
      const { id } = req.params;
      
      // Prevent deleting self
      if (id === req.user?.userId) {
        return res.status(400).json({ error: "You cannot delete yourself" });
      }

      db.prepare("DELETE FROM users WHERE id = ?").run(id);
      
      if (req.user) {
        logAction(req.user.userId, "DELETE_ADMIN", id as string, {});
      }

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete admin" });
    }
  }
);

export default router;
