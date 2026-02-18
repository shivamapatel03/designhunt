import db from "./db";
import { randomUUID } from "crypto";

const CHALLENGE = {
  title: "Minimal Music Player",
  description:
    "Design a clean, distraction-free music player interface. Focus on typography and album art.",
  difficulty: "Medium",
  points: 50,
  category: "UI Design",
  requirements: JSON.stringify([
    "Play controls",
    "Progress bar",
    "Volume",
    "Album Art",
    "Song Title",
  ]),
  is_active: 1,
  expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
};

console.log("Seeding single active challenge...");

// Clear existing
db.prepare("DELETE FROM challenges").run();

const stmt = db.prepare(`
    INSERT INTO challenges (id, title, description, difficulty, points, category, requirements, is_active, expires_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

stmt.run(
  randomUUID(),
  CHALLENGE.title,
  CHALLENGE.description,
  CHALLENGE.difficulty,
  CHALLENGE.points,
  CHALLENGE.category,
  CHALLENGE.requirements,
  CHALLENGE.is_active,
  CHALLENGE.expires_at,
);

console.log(`Seeded active challenge: ${CHALLENGE.title}`);
