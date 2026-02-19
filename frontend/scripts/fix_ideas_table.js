const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, '../../backend/designhunt_v2.db');
console.log("Migrating DB at:", dbPath);
const db = new Database(dbPath);

try {
  db.prepare(`
    CREATE TABLE IF NOT EXISTS ideas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      idea TEXT NOT NULL,
      status TEXT DEFAULT 'new',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `).run();
  console.log("Ideas table created successfully!");
} catch (error) {
  console.error("Error creating ideas table:", error);
  process.exit(1);
}
