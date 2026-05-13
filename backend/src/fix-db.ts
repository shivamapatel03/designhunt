
import db from "./db";

async function createMissingTables() {
  try {
    console.log("Creating missing tables...");
    
    await db.exec(`
      CREATE TABLE IF NOT EXISTS onboarding_data (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log("Table onboarding_data created.");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

createMissingTables();
