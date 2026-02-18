import db from "./db";

console.log("Starting migration for Challenges V2...");

// 1. Add 'enable_challenges' to system_settings if not exists
try {
  // Check if column exists by trying to select it
  // If it fails, add it. SQLite doesn't have "IF NOT EXISTS" for columns easily
  const check = db.prepare(
    "SELECT enable_challenges FROM system_settings LIMIT 1",
  );
  try {
    check.get();
    console.log(
      "'enable_challenges' column already exists in system_settings.",
    );
  } catch (e) {
    console.log("Adding 'enable_challenges' to system_settings...");
    db.exec(
      "ALTER TABLE system_settings ADD COLUMN enable_challenges INTEGER DEFAULT 0",
    );
  }
} catch (e) {
  console.error("Error checking/adding system_settings column:", e);
}

// 2. Refresh Challenges Table
console.log("Recreating challenges table...");

// Drop existing table to ensure clean schema with new columns
db.exec("DROP TABLE IF EXISTS challenges");
db.exec(`
CREATE TABLE challenges (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    points INTEGER NOT NULL,
    category TEXT NOT NULL,
    requirements TEXT,
    is_active INTEGER DEFAULT 0,
    expires_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`);

// Re-create submissions table foreign key constraint valid
// (SQLite doesn't enforce FK strongly by default unless PRAGMA foreign_keys = ON, but good to keep in mind)

console.log("Migration complete.");
