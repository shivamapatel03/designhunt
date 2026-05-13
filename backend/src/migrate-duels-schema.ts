import db from "./db";

async function migrate() {
  try {
    console.log("Dropping old daily_duels table...");
    await db.exec("DROP TABLE IF EXISTS daily_duels CASCADE");
    
    console.log("Creating new daily_duels table with correct schema...");
    await db.exec(`
      CREATE TABLE daily_duels (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        option_a_label TEXT,
        option_a_image TEXT,
        option_b_label TEXT,
        option_b_image TEXT,
        category TEXT,
        date DATE UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log("✅ Table daily_duels recreated successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
  }
}

migrate().then(() => process.exit(0));
