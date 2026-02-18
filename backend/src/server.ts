import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import authRoutes from "./routes/auth";
import challengeRoutes from "./routes/challenges";
import duelsRoutes from "./routes/duels";

import adminRoutes from "./routes/admin";
import toolsRoutes from "./routes/tools";
import settingsRoutes from "./routes/settings";
import tutorRoutes from "./routes/tutor";
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

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/challenges", challengeRoutes);
app.use("/api/tools", toolsRoutes);
app.use("/api/duels", duelsRoutes);
app.use("/api/duels", duelsRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/tutor", tutorRoutes);

// Basic health check
app.get("/", (req, res) => {
  res.json({ message: "DesignHunt Backend is running" });
});

// Mock Upgrade Flow
app.post("/api/upgrade-pro", (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    db.prepare("UPDATE users SET is_pro = 1 WHERE id = ?").run(payload.userId);
    res.json({ success: true, message: "Upgraded to Pro!" });
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
