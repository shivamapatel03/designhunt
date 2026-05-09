import db from "./db";

async function migrateChallengesV2() {
  console.log("Starting migration for Challenges V2...");

  // 1. Add 'enable_challenges' to system_settings if not exists
  try {
    const columns = await db.all(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'system_settings'
    `) as any[];
    const hasEnableChallenges = columns.some((c: any) => c.column_name === "enable_challenges");

    if (!hasEnableChallenges) {
      console.log("Adding 'enable_challenges' to system_settings...");
      await db.run(
        "ALTER TABLE system_settings ADD COLUMN enable_challenges INTEGER DEFAULT 0",
      );
    } else {
      console.log("'enable_challenges' column already exists in system_settings.");
    }
  } catch (e) {
    console.error("Error checking/adding system_settings column:", e);
  }

  // 2. Refresh Challenges Table
  console.log("Recreating challenges table...");

  // Drop existing table to ensure clean schema with new columns
  await db.exec("DROP TABLE IF EXISTS challenges CASCADE");
  await db.exec(`
    CREATE TABLE challenges (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        difficulty TEXT NOT NULL,
        points INTEGER NOT NULL,
        category TEXT NOT NULL,
        requirements TEXT,
        is_active INTEGER DEFAULT 0,
        expires_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log("Migration complete.");
}

migrateChallengesV2().then(() => process.exit(0));
