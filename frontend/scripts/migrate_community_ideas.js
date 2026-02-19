const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, '../../backend/designhunt_v2.db');
console.log("Migrating DB for Community Hub at:", dbPath);
const db = new Database(dbPath);

try {
  // Check existing columns
  const tableInfo = db.prepare("PRAGMA table_info(ideas)").all();
  const columns = tableInfo.map(c => c.name);

  if (!columns.includes('image')) {
    console.log("Adding 'image' column...");
    db.prepare("ALTER TABLE ideas ADD COLUMN image TEXT").run();
  }
  
  if (!columns.includes('user_handle')) {
    console.log("Adding 'user_handle' column...");
    db.prepare("ALTER TABLE ideas ADD COLUMN user_handle TEXT").run();
  }

  if (!columns.includes('user_avatar')) {
    console.log("Adding 'user_avatar' column...");
    db.prepare("ALTER TABLE ideas ADD COLUMN user_avatar TEXT").run();
  }

  if (!columns.includes('likes_count')) {
    console.log("Adding 'likes_count' column...");
    db.prepare("ALTER TABLE ideas ADD COLUMN likes_count INTEGER DEFAULT 0").run();
  }

  if (!columns.includes('comments_count')) {
    console.log("Adding 'comments_count' column...");
    db.prepare("ALTER TABLE ideas ADD COLUMN comments_count INTEGER DEFAULT 0").run();
  }

  if (!columns.includes('user_id')) {
    console.log("Adding 'user_id' column...");
    db.prepare("ALTER TABLE ideas ADD COLUMN user_id TEXT").run();
  }

  console.log("Ideas table migration completed successfully!");
} catch (error) {
  console.error("Error migrating ideas table:", error);
  process.exit(1);
}
