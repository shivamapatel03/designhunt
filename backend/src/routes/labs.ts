import express from "express";
import db from "../db";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// Get all active labs
router.get("/", (req, res) => {
  try {
    const labs = db.prepare("SELECT * FROM labs WHERE status = 'ACTIVE' ORDER BY created_at DESC").all();
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
router.post("/", (req, res) => {
  const { title, description, owner_id } = req.body;
  if (!title || !owner_id) {
    return res.status(400).json({ error: "Title and owner_id are required" });
  }

  const id = uuidv4();
  try {
    db.prepare(
      "INSERT INTO labs (id, title, description, owner_id, members, status) VALUES (?, ?, ?, ?, ?, ?)"
    ).run(id, title, description, owner_id, JSON.stringify([owner_id]), "ACTIVE");

    const newLab = db.prepare("SELECT * FROM labs WHERE id = ?").get(id);
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
router.get("/:id", (req, res) => {
  const { id } = req.params;
  try {
    const lab = db.prepare("SELECT * FROM labs WHERE id = ?").get(id);
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
router.patch("/:id/canvas", (req, res) => {
  const { id } = req.params;
  const { canvas_state } = req.body;

  try {
    db.prepare("UPDATE labs SET canvas_state = ? WHERE id = ?").run(
      JSON.stringify(canvas_state),
      id
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to update canvas" });
  }
});

// Join a lab (add member)
router.post("/:id/join", (req, res) => {
    const { id } = req.params;
    const { user_id } = req.body;

    if (!user_id) return res.status(400).json({ error: "user_id required" });

    try {
        const lab = db.prepare("SELECT members FROM labs WHERE id = ?").get(id);
        if (!lab) return res.status(404).json({ error: "Lab not found" });

        const members = JSON.parse(lab.members);
        if (!members.includes(user_id)) {
            members.push(user_id);
            db.prepare("UPDATE labs SET members = ? WHERE id = ?").run(JSON.stringify(members), id);
        }

        res.json({ success: true, members });
    } catch (error) {
        res.status(500).json({ error: "Failed to join lab" });
    }
});

export default router;
