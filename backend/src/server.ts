import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import challengeRoutes from "./routes/challenges";
import duelsRoutes from "./routes/duels";

import adminRoutes from "./routes/admin";
import toolsRoutes from "./routes/tools";

dotenv.config();

const app = express();
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

// Basic health check
app.get("/", (req, res) => {
  res.json({ message: "DesignHunt Backend is running" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
