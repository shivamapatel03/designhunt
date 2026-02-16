const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'designhunt_v2.db');
const db = new Database(dbPath);

console.log('Database Path:', dbPath);

try {
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log('Tables:', tables);

  for (const table of tables) {
    const count = db.prepare(`SELECT COUNT(*) as count FROM ${table.name}`).get();
    console.log(`Table ${table.name}: ${count.count} rows`);
    if (table.name === 'courses') {
      const sample = db.prepare(`SELECT * FROM ${table.name} LIMIT 1`).get();
      console.log('Course Sample:', sample);
    }
  }
} catch (error) {
  console.error('Error checking database:', error);
}
