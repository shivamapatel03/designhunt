const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'designhunt.db');
const db = new Database(dbPath);

console.log('Migrating database...');

try {
  // Check if columns exist
  const columns = db.prepare('PRAGMA table_info(users)').all();
  const columnNames = columns.map(c => c.name);

  const columnsToAdd = [
    { name: 'username', type: 'TEXT' },
    { name: 'avatar', type: 'TEXT' },
    { name: 'bio', type: 'TEXT' },
    { name: 'skills', type: 'TEXT' },
    { name: 'social_links', type: 'TEXT' },
    { name: 'onboarding_completed', type: 'BOOLEAN DEFAULT 0' }
  ];

  columnsToAdd.forEach(col => {
    if (!columnNames.includes(col.name)) {
      console.log(`Adding column: ${col.name}`);
      db.exec(`ALTER TABLE users ADD COLUMN ${col.name} ${col.type}`);
    } else {
      console.log(`Column ${col.name} already exists.`);
    }
  });

  // Add unique index separately
  console.log('Adding unique index for username...');
  db.exec('CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username ON users(username)');

  console.log('Migration complete!');
} catch (error) {
  console.error('Migration failed:', error);
}
