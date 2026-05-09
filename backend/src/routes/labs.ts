import express from "express";
import db from "../db";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// Get all active labs
router.get("/", async (req, res) => {
  try {
    const labs = await db.all("SELECT * FROM labs WHERE status = 'ACTIVE' ORDER BY created_at DESC") as any[];
    res.json(labs.map((lab: any) => ({
        ...lab,
        members: JSON.parse(lab.members || '[]'),
        canvas_state: JSON.parse(lab.canvas_state || '{}')
    })));
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch labs" });
  }
});

// Create a new lab
router.post("/", async (req, res) => {
  const { title, description, owner_id } = req.body;
  if (!title || !owner_id) {
    return res.status(400).json({ error: "Title and owner_id are required" });
  }

  const id = uuidv4();
  try {
    await db.run(
      "INSERT INTO labs (id, title, description, owner_id, members, status) VALUES ($1, $2, $3, $4, $5, $6)",
      [id, title, description, owner_id, JSON.stringify([owner_id]), "ACTIVE"]
    );

    const newLab = await db.get("SELECT * FROM labs WHERE id = $1", [id]) as any;
    res.status(201).json({
        ...newLab,
        members: JSON.parse(newLab.members),
        canvas_state: JSON.parse(newLab.canvas_state)
    });
  } catch (error) {
    console.error("Create lab error:", error);
    res.status(500).json({ error: "Failed to create lab" });
  }
});

// Get a specific lab
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const lab = await db.get("SELECT * FROM labs WHERE id = $1", [id]) as any;
    if (!lab) {
      return res.status(404).json({ error: "Lab not found" });
    }
    res.json({
        ...lab,
        members: JSON.parse(lab.members),
        canvas_state: JSON.parse(lab.canvas_state)
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch lab" });
  }
});

// Update canvas state
router.patch("/:id/canvas", async (req, res) => {
  const { id } = req.params;
  const { canvas_state } = req.body;

  try {
    await db.run("UPDATE labs SET canvas_state = $1 WHERE id = $2", [
      JSON.stringify(canvas_state),
      id
    ]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to update canvas" });
  }
});

// Join a lab (add member)
router.post("/:id/join", async (req, res) => {
    const { id } = req.params;
    const { user_id } = req.body;

    if (!user_id) return res.status(400).json({ error: "user_id required" });

    try {
        const lab = await db.get("SELECT members FROM labs WHERE id = $1", [id]) as any;
        if (!lab) return res.status(404).json({ error: "Lab not found" });

        const members = JSON.parse(lab.members);
        if (!members.includes(user_id)) {
            members.push(user_id);
            await db.run("UPDATE labs SET members = $1 WHERE id = $2", [JSON.stringify(members), id]);
        }

        res.json({ success: true, members });
    } catch (error) {
        res.status(500).json({ error: "Failed to join lab" });
    }
});

export default router;
