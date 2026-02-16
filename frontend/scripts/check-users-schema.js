const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'designhunt_v2.db');
const db = new Database(dbPath);

try {
  const info = db.prepare("PRAGMA table_info(users)").all();
  console.log('Users Table Schema:');
  info.forEach(col => console.log(`- ${col.name} (${col.type})`));
} catch (error) {
  console.error('Error checking users schema:', error);
}
