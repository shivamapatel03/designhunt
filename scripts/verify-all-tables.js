const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'designhunt_v2.db');
const db = new Database(dbPath);

const requiredTables = [
  'users', 'courses', 'jobs', 'startups', 'enrollments', 
  'tutor_requests', 'challenges', 'tools', 'submissions', 'user_progress'
];

console.log('Verifying Database Tables...');

try {
  const existingTables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all().map(t => t.name);
  
  for (const table of requiredTables) {
    if (existingTables.includes(table)) {
      console.log(`[OK] Table exists: ${table}`);
      const info = db.prepare(`PRAGMA table_info(${table})`).all();
      console.log(`     Columns: ${info.map(c => c.name).join(', ')}`);
    } else {
      console.error(`[MISSING] Table does not exist: ${table}`);
      // The app will attempt to create missing tables on next start because of lib/db.ts
      // but let's be proactive and trigger the creations if needed.
    }
  }
} catch (error) {
  console.error('Check failed:', error);
}
