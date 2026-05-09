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
  is_active: true,
  expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
};

async function seedActiveChallenge() {
  console.log("Seeding single active challenge...");

  try {
    // Clear existing
    await db.run("DELETE FROM challenges");

    await db.run(
      `
      INSERT INTO challenges (id, title, description, difficulty, points, category, requirements, is_active, expires_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `,
      [
        randomUUID(),
        CHALLENGE.title,
        CHALLENGE.description,
        CHALLENGE.difficulty,
        CHALLENGE.points,
        CHALLENGE.category,
        CHALLENGE.requirements,
        CHALLENGE.is_active,
        CHALLENGE.expires_at,
      ]
    );

    console.log(`Seeded active challenge: ${CHALLENGE.title}`);
  } catch (error) {
    console.error("Seeding failed:", error);
  }
}

seedActiveChallenge().then(() => process.exit(0));
