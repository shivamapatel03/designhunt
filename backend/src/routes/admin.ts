import express from "express";
import db from "../db";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { sendCodeRotationEmail } from "../lib/email";

const router = express.Router();

// Create Admin (Super Admin only)
router.post("/create-admin", async (req, res) => {
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

    console.log(`[CREATE ADMIN] Request for: ${email}`);
    res.json({ success: true, password }); // Return password to Super Admin
  } catch (error: any) {
    console.error("[CREATE ADMIN ERROR]:", error.message);
    res
      .status(500)
      .json({ error: "Failed to create admin", details: error.message });
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
router.post("/delete-user", (req, res) => {
  try {
    const { id } = req.body;
    db.prepare("DELETE FROM users WHERE id = ?").run(id);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// Delete All Users (Except Super Admin)
router.post("/delete-all-users", (req, res) => {
  try {
    db.prepare("DELETE FROM users WHERE role != 'SUPER_ADMIN'").run();
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to clear users" });
  }
});

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

export default router;
