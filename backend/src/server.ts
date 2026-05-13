import express from "express";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import authRoutes from "./routes/auth";
import { connectRedis } from "./lib/redis";
import challengeRoutes from "./routes/challenges";
import duelsRoutes from "./routes/duels";

import adminRoutes from "./routes/admin";
import toolsRoutes from "./routes/tools";
import settingsRoutes from "./routes/settings";
import tutorRoutes from "./routes/tutor";
import ideasRoutes from "./routes/ideas";
import profileRoutes from "./routes/profile";
import labsRoutes from "./routes/labs";
import paymentRoutes from "./routes/payments";
import learningRoutes from "./routes/learning";
import newsletterRoutes from "./routes/newsletter";
import db from "./db";

dotenv.config();

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || "designhunt_secret_key_123";
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:3000", // Frontend URL
    credentials: true,
  }),
);
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/challenges", challengeRoutes);
app.use("/api/tools", toolsRoutes);
app.use("/api/duels", duelsRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/tutor", tutorRoutes);
app.use("/api/ideas", ideasRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/labs", labsRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/learning", learningRoutes);
app.use("/api/newsletter", newsletterRoutes);

// Basic health check
app.get("/", (req, res) => {
  res.json({ message: "Designhunt. Backend is running" });
});

// Mock Upgrade Flow
app.post("/api/upgrade-pro", async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    await db.run("UPDATE users SET is_pro = true WHERE id = $1", [payload.userId]);
    res.json({ success: true, message: "Upgraded to Pro!" });
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
});

app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  await connectRedis();
});

// Diagnostic: Keep the event loop alive
setInterval(() => {
  // dummy log every minute to ensure we stay alive
  // console.log("Still alive...");
}, 60000);
