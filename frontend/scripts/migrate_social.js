const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, '../../backend/designhunt_v2.db');
console.log("Migrating DB for Social Interactions at:", dbPath);
const db = new Database(dbPath);

try {
  // Create idea_likes table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS idea_likes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      idea_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, idea_id),
      FOREIGN KEY (idea_id) REFERENCES ideas(id) ON DELETE CASCADE
    )
  `).run();
  console.log("Table 'idea_likes' created/verified.");

  // Create idea_comments table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS idea_comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      idea_id INTEGER NOT NULL,
      user_id TEXT NOT NULL,
      user_handle TEXT,
      user_avatar TEXT,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (idea_id) REFERENCES ideas(id) ON DELETE CASCADE
    )
  `).run();
  console.log("Table 'idea_comments' created/verified.");

  console.log("Social migration completed successfully!");
} catch (error) {
  console.error("Error migrating social tables:", error);
  process.exit(1);
}
