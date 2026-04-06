import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db";
import {
  sendVerificationEmail,
  sendAdminLoginEmail,
  sendPasswordResetEmail,
} from "../lib/email";
import { randomUUID } from "crypto";
import { client as redis, isHealthy as isRedisHealthy } from "../lib/redis";

const OTP_EXPIRY_SECONDS = 600; // 10 minutes

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "designhunt_secret_key_123";

/**
 * Stores an OTP in Redis if healthy, otherwise falls back to SQLite.
 */
async function storeOtp(email: string, otp: string, type: "signup" | "login" | "admin", hashed = false) {
  const redisKey = `otp:${type}:${email}`;
  const valueToStore = hashed ? await bcrypt.hash(otp, 10) : otp;

  if (isRedisHealthy()) {
    try {
      await redis.set(redisKey, valueToStore, { EX: OTP_EXPIRY_SECONDS });
      return { success: true, storedIn: "redis" };
    } catch (err) {
      console.error("Redis set error, falling back to DB:", err);
    }
  }

  // Fallback to SQLite
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_SECONDS * 1000).toISOString();
  db.prepare(
    "UPDATE users SET otp_code = ?, otp_expires_at = ? WHERE email = ?"
  ).run(valueToStore, expiresAt, email);
  
  return { success: true, storedIn: "db" };
}

/**
 * Retrieves an OTP from Redis or SQLite.
 */
async function getStoredOtp(email: string, type: "signup" | "login" | "admin") {
  const redisKey = `otp:${type}:${email}`;

  if (isRedisHealthy()) {
    try {
      const redisOtp = await redis.get(redisKey);
      if (redisOtp) return redisOtp;
    } catch (err) {
      console.error("Redis get error, checking DB:", err);
    }
  }

  // Check SQLite
  const user = db.prepare("SELECT otp_code, otp_expires_at FROM users WHERE email = ?").get(email) as any;
  if (user && user.otp_code && new Date(user.otp_expires_at) > new Date()) {
    return user.otp_code;
  }

  return null;
}

/**
 * Clears an OTP from both Redis and SQLite.
 */
async function clearOtp(email: string, type: "signup" | "login" | "admin") {
  if (isRedisHealthy()) {
    try {
      await redis.del(`otp:${type}:${email}`);
    } catch (err) {
      console.error("Redis del error:", err);
    }
  }
  db.prepare("UPDATE users SET otp_code = NULL, otp_expires_at = NULL WHERE email = ?").run(email);
}

// SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password || !name) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const existingUser = db
      .prepare("SELECT email FROM users WHERE email = ?")
      .get(email);

    if (existingUser) {
      res.status(400).json({ error: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = randomUUID();
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    db.prepare(
      "INSERT INTO users (id, email, password, name, email_verified) VALUES (?, ?, ?, ?, 0)",
    ).run(userId, email, hashedPassword, name);

    // Store OTP (Redis or DB Fallback)
    await storeOtp(email, otp, "signup");

    const emailRes = await sendVerificationEmail(email, otp);

    if (!emailRes.success) {
      console.error("Failed to send email", emailRes.error);
      res.status(500).json({
        error: "Failed to send verification email. (Resend Error)",
        details: emailRes.error,
      });
      return;
    }

    res.json({
      success: true,
      redirect: `/verify-email?email=${encodeURIComponent(email)}`,
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// RESEND OTP
router.post("/resend-otp", async (req, res) => {
  try {
    const { email, type = "signup" } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = db
      .prepare("SELECT * FROM users WHERE email = ?")
      .get(email) as any;
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    if (type === "signup") {
      if (user.email_verified) {
        return res.status(400).json({ error: "Email already verified" });
      }
      await storeOtp(email, otp, "signup");
      await sendVerificationEmail(email, otp);
    } else if (type === "login") {
      await storeOtp(email, otp, "login", true); // Login OTPs are usually hashed
      await sendAdminLoginEmail(email, otp, user.role);
    }

    res.json({ success: true, message: "New OTP sent" });
  } catch (error) {
    console.error("Resend OTP Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// VERIFY EMAIL
router.post("/verify", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      res.status(400).json({ error: "Missing email or OTP" });
      return;
    }

    const user = db
      .prepare("SELECT * FROM users WHERE email = ?")
      .get(email) as any;

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (user.email_verified) {
      res.json({ success: true, redirect: "/onboarding" });
      return;
    }

    const storedOtp = await getStoredOtp(email, "signup");
    if (!storedOtp || storedOtp !== otp) {
      res.status(400).json({ error: "Invalid or expired code" });
      return;
    }

    // Clear OTP (Redis & DB)
    await clearOtp(email, "signup");

    db.prepare(
      "UPDATE users SET email_verified = 1 WHERE id = ?",
    ).run(user.id);

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "24h" },
    );

    // Set HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.json({
      success: true,
      redirect: "/onboarding",
      user: { 
        name: user.name, 
        email: user.email, 
        role: user.role,
        handle: user.username ? `@${user.username}` : `@${user.name.toLowerCase().replace(/\s+/g, "")}`
      },
    });
  } catch (error) {
    console.error("Verify Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password, otp, step = "login" } = req.body;

    if (
      !email ||
      (step === "login" && !password) ||
      (step === "verify" && !otp) ||
      (step === "identify" && !email)
    ) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const user = db
      .prepare("SELECT * FROM users WHERE email = ?")
      .get(email) as any;

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Step 1: Identification (Staff)
    if (step === "identify") {
      const staffRoles = ["TUTOR", "ADMIN", "SUPER_ADMIN"];
      if (staffRoles.includes(user.role)) {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        // Store OTP (Redis or DB Fallback)
        await storeOtp(email, code, "login", true);

        await sendAdminLoginEmail(email, code, user.role);
        res.json({ success: true, requiresOtp: true });
        return;
      }
      res.json({ success: true, requiresOtp: false });
      return;
    }

    // Step 2: Login / OTP
    if (step === "login") {
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      const staffRoles = ["TUTOR", "ADMIN", "SUPER_ADMIN"];
      if (staffRoles.includes(user.role)) {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Store OTP (Redis or DB Fallback)
        await storeOtp(email, code, "login", true);

        const emailResult = await sendAdminLoginEmail(email, code, user.role);
        if (!emailResult.success) {
          res.status(500).json({ error: "Failed to send verification email" });
          return;
        }

        res.json({
          success: true,
          requiresOtp: true,
          message: "Verification code sent.",
        });
        return;
      }
    } else if (step === "verify") {
      const storedHashedOtp = await getStoredOtp(email, "login");
      if (!storedHashedOtp) {
        res
          .status(400)
          .json({ error: "Invalid or expired verification session" });
        return;
      }

      const isOtpValid = await bcrypt.compare(otp, storedHashedOtp);
      if (!isOtpValid) {
        res.status(401).json({ error: "Invalid verification code" });
        return;
      }

      await clearOtp(email, "login");
    }

    // Create session
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "24h" },
    );

    db.prepare("UPDATE users SET last_login = ? WHERE id = ?").run(
      new Date().toISOString(),
      user.id,
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });

    const redirect =
      user.role === "SUPER_ADMIN"
        ? "/super-admin"
        : user.role === "ADMIN"
          ? "/admin"
          : user.role === "TUTOR"
            ? "/tutor-dashboard"
            : "/profile";

    res.json({
      success: true,
      user: { 
        name: user.name, 
        email: user.email, 
        role: user.role,
        handle: user.username ? `@${user.username}` : `@${user.name.toLowerCase().replace(/\s+/g, "")}`
      },
      redirect,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET ME
router.get("/me", async (req, res) => {
  const token = req.cookies?.token; // Requires cookie-parser

  if (!token) {
    res.status(401).json({ user: null });
    return;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    const userId = payload.userId || payload.id;
    const user = db
      .prepare(
        "SELECT id, name, email, role, avatar, username, is_pro, scan_balance FROM users WHERE id = ?",
      )
      .get(userId) as any;

    if (!user) {
      res.clearCookie("token").status(401).json({ user: null });
      return;
    }

    const userData = {
      ...user,
      handle: user.username
        ? `@${user.username}`
        : `@${user.name.toLowerCase().replace(/\s+/g, "")}`,
    };

    res.json({ user: userData });
  } catch (e) {
    res.clearCookie("token").status(401).json({ user: null });
  }
});

// LOGOUT
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ success: true });
});

// Admin Login Step 1: Validate Password & Send OTP
router.post("/admin-login-step1", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = db
      .prepare("SELECT * FROM users WHERE email = ?")
      .get(email) as any;

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    // Validate Password (ONLY for regular Admins)
    if (user.role === "ADMIN") {
      if (!password) {
        return res.status(400).json({ message: "Password required" });
      }
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
    }
    // Super Admins skip password check (Email -> OTP only)

    if (user.status === "PENDING") {
      return res.status(403).json({ message: "Account pending approval" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP (Redis or DB Fallback)
    await storeOtp(email, otp, "admin");

    // Send Email
    const emailResult = await sendAdminLoginEmail(email, otp, user.role);

    if (!emailResult.success) {
      console.error("Failed to send OTP email:", emailResult.error);
      // Fallback for dev/demo if email fails
      console.log(`[ADMIN OTP FALLBACK] For ${email}: ${otp}`);
    } else {
      console.log(`[ADMIN OTP] Email sent to ${email}`);
    }

    res.json({ success: true, message: "OTP sent" });
  } catch (error: any) {
    console.error("Login Step 1 Error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
      stack: error.stack,
    });
  }
});

// Admin Login Step 2: Verify OTP & Login
router.post("/admin-login-step2", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = db
      .prepare("SELECT * FROM users WHERE email = ?")
      .get(email) as any;

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Verify OTP (Redis or DB)
    const cleanOtp = String(otp).trim();
    const storedOtp = await getStoredOtp(email, "admin");

    if (!storedOtp || String(storedOtp).trim() !== cleanOtp) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Clear OTP (Redis & DB)
    await clearOtp(email, "admin");

    // Set Cookie
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      {
        expiresIn: "24h",
      },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });

    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, message: "Login successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// FORGOT PASSWORD
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = db
      .prepare("SELECT * FROM users WHERE email = ?")
      .get(email) as any;
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate a secure 6-digit code for simplicity (similar to OTP pattern)
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

    db.prepare(
      "UPDATE users SET reset_token = ?, reset_token_expires_at = ? WHERE id = ?",
    ).run(token, expiresAt, user.id);

    const emailRes = await sendPasswordResetEmail(email, token);

    if (!emailRes.success) {
      console.error("Failed to send reset email:", emailRes.error);
      // Still return success to prevent email enumeration, but log the error
      return res.json({
        success: true,
        message: "If this email is registered, you will receive a reset code.",
      });
    }

    res.json({ success: true, message: "Reset code sent to your email." });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// RESET PASSWORD
router.post("/reset-password", async (req, res) => {
  try {
    const { token, email, password } = req.body;

    if (!token || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const user = db
      .prepare("SELECT * FROM users WHERE email = ?")
      .get(email) as any;

    if (
      !user ||
      user.reset_token !== token ||
      new Date(user.reset_token_expires_at) < new Date()
    ) {
      return res.status(400).json({ error: "Invalid or expired reset code" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.prepare(
      "UPDATE users SET password = ?, reset_token = NULL, reset_token_expires_at = NULL WHERE id = ?",
    ).run(hashedPassword, user.id);

    res.json({
      success: true,
      message: "Password reset successful. You can now login.",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
