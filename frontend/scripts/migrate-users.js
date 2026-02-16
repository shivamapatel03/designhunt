const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'designhunt_v2.db');
const db = new Database(dbPath);

console.log('Running Migration...');

try {
  const columns = db.prepare("PRAGMA table_info(users)").all().map(c => c.name);
  
  const missingColumns = [
    { name: 'otp_code', type: 'TEXT' },
    { name: 'otp_expires_at', type: 'DATETIME' },
    { name: 'last_login', type: 'DATETIME' }
  ];

  for (const col of missingColumns) {
    if (!columns.includes(col.name)) {
      console.log(`Adding column: ${col.name}`);
      db.prepare(`ALTER TABLE users ADD COLUMN ${col.name} ${col.type}`).run();
    } else {
      console.log(`Column ${col.name} already exists.`);
    }
  }

  console.log('Migration completed successfully.');
} catch (error) {
  console.error('Migration failed:', error);
}
