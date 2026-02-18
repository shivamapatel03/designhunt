import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db";
import { sendVerificationEmail, sendAdminLoginEmail } from "../lib/email";
import { randomUUID } from "crypto";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "default-secret-key-change-me";

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
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    db.prepare(
      "INSERT INTO users (id, email, password, name, otp_code, otp_expires_at, email_verified) VALUES (?, ?, ?, ?, ?, ?, 0)",
    ).run(userId, email, hashedPassword, name, otp, otpExpires);

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

    const now = new Date().toISOString();
    if (user.otp_code !== otp || user.otp_expires_at < now) {
      res.status(400).json({ error: "Invalid or expired code" });
      return;
    }

    db.prepare(
      "UPDATE users SET email_verified = 1, otp_code = NULL, otp_expires_at = NULL WHERE id = ?",
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
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.json({
      success: true,
      redirect: "/onboarding",
      user: { name: user.name, email: user.email, role: user.role },
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
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
        const hashedOtp = await bcrypt.hash(code, 10);

        db.prepare(
          "UPDATE users SET otp_code = ?, otp_expires_at = ? WHERE id = ?",
        ).run(hashedOtp, expiresAt, user.id);

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
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
        const hashedOtp = await bcrypt.hash(code, 10);

        db.prepare(
          "UPDATE users SET otp_code = ?, otp_expires_at = ? WHERE id = ?",
        ).run(hashedOtp, expiresAt, user.id);

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
      if (
        !user.otp_code ||
        !user.otp_expires_at ||
        new Date() > new Date(user.otp_expires_at)
      ) {
        res
          .status(400)
          .json({ error: "Invalid or expired verification session" });
        return;
      }

      const isOtpValid = await bcrypt.compare(otp, user.otp_code);
      if (!isOtpValid) {
        res.status(401).json({ error: "Invalid verification code" });
        return;
      }

      db.prepare(
        "UPDATE users SET otp_code = NULL, otp_expires_at = NULL WHERE id = ?",
      ).run(user.id);
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
      user: { name: user.name, email: user.email, role: user.role },
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
    const user = db
      .prepare("SELECT id, name, email, role, avatar FROM users WHERE id = ?")
      .get(payload.userId);

    if (!user) {
      res.status(401).json({ user: null });
      return;
    }

    res.json({ user });
  } catch (e) {
    res.status(401).json({ user: null });
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
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    db.prepare(
      "UPDATE users SET otp_code = ?, otp_expires_at = ? WHERE id = ?",
    ).run(otp, expiresAt, user.id);

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

    // Verify OTP
    const cleanOtp = String(otp).trim();
    const storedOtp = String(user.otp_code).trim();

    if (storedOtp !== cleanOtp || new Date(user.otp_expires_at) < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Clear OTP
    db.prepare(
      "UPDATE users SET otp_code = NULL, otp_expires_at = NULL WHERE id = ?",
    ).run(user.id);

    // Set Cookie
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "fallback_secret",
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

export default router;
