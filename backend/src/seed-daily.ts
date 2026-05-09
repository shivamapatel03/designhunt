import db from "./db";
import { randomUUID } from "crypto";

async function seedDaily() {
  console.log("Seeding daily challenge...");

  try {
    // Check if one exists
    const existing = await db.get("SELECT * FROM challenges WHERE type = 'DAILY'");

    if (existing) {
      console.log(
        "Found existing daily challenge, updating expiry to 24h from now.",
      );
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      await db.run("UPDATE challenges SET expires_at = $1 WHERE id = $2", [
        tomorrow,
        (existing as any).id,
      ]);
      console.log("Updated expiry.");
    } else {
      console.log("No daily challenge found. Creating one.");
      const id = randomUUID();
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

      await db.run(
        `
          INSERT INTO challenges (id, title, description, difficulty, points, category, type, expires_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `,
        [
          id,
          "Reimagine the Spotify UI",
          "Design a fresh, geometric take on the music player interface. Focus on typography and bold visual hierarchy. No gradients allowed!",
          "Medium",
          500,
          "UI Design",
          "DAILY",
          tomorrow,
        ]
      );
      console.log("Created daily challenge:", id);
    }
  } catch (error) {
    console.error("Seeding failed:", error);
  }
}

seedDaily().then(() => process.exit(0));
