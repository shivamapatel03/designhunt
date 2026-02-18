import express from "express";
import db from "../db";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { sendCodeRotationEmail } from "../lib/email";
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

      logAction(req.user.id, "CREATE_ADMIN", id, { email, name });

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
        logAction(req.user.id, "UPDATE_SETTING", key, { value });
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

      logAction(req.user.id, "DELETE_USER", id, {});

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
      logAction(req.user.id, "DELETE_ALL_USERS", "", {});
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
    const adminEmail = process.env.ADMIN_EMAIL || "shivampatel2330@gmail.com";
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
    const adminEmail = process.env.ADMIN_EMAIL || "shivampatel2330@gmail.com";
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

      logAction(req.user.id, "BACKUP_DATABASE", "SYSTEM", { path: backupPath });

      res.json({ success: true, filename: `designhunt_v2_${timestamp}.db` });
    } catch (err: any) {
      console.error("Backup failed:", err);
      res.status(500).json({ error: "Backup failed: " + err.message });
    }
  },
);

export default router;
