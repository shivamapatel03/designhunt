const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'designhunt_v2.db');
const db = new Database(dbPath);

try {
  console.log('Migrating database...');
  db.prepare("ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT 0").run();
  console.log('Migration successful: Added email_verified column.');
} catch (error) {
  if (error.message.includes('duplicate column name')) {
    console.log('Column email_verified already exists.');
  } else {
    console.error('Migration failed:', error);
  }
}
