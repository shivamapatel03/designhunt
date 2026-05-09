import express from "express";
import db from "../db";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const tools = await db.all("SELECT * FROM tools ORDER BY created_at DESC");
    res.json(tools);
  } catch (error) {
    console.error("Error fetching tools:", error);
    res.status(500).json({ error: "Failed to fetch tools" });
  }
});

export default router;
