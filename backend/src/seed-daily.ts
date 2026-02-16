import db from "./db";
import { randomUUID } from "crypto";

const seedDaily = () => {
  console.log("Seeding daily challenge...");

  // Check if one exists
  const existing = db
    .prepare("SELECT * FROM challenges WHERE type = 'DAILY'")
    .get();

  if (existing) {
    console.log(
      "Found existing daily challenge, updating expiry to 24h from now.",
    );
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    db.prepare("UPDATE challenges SET expires_at = ? WHERE id = ?").run(
      tomorrow,
      (existing as any).id,
    );
    console.log("Updated expiry.");
  } else {
    console.log("No daily challenge found. Creating one.");
    const id = randomUUID();
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    db.prepare(
      `
        INSERT INTO challenges (id, title, description, difficulty, points, category, type, expires_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
    ).run(
      id,
      "Reimagine the Spotify UI",
      "Design a fresh, geometric take on the music player interface. Focus on typography and bold visual hierarchy. No gradients allowed!",
      "Medium",
      500,
      "UI Design",
      "DAILY",
      tomorrow,
    );
    console.log("Created daily challenge:", id);
  }
};

seedDaily();
