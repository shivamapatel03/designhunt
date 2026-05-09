import db from "./db";

async function migrateIsPro() {
  console.log("Running migration: Adding is_pro to users table...");
  try {
    await db.exec(`ALTER TABLE users ADD COLUMN is_pro BOOLEAN DEFAULT false`);
    console.log("Migration successful: Added is_pro column.");
  } catch (error: any) {
    if (error.message.includes("already exists")) {
      console.log("Migration skipped: Column already exists.");
    } else {
      console.error("Migration failed:", error);
    }
  }
}

migrateIsPro().then(() => process.exit(0));
