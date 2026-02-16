const db = require('better-sqlite3')('designhunt.db');

console.log('Migrating courses table...');

try {
  const columns = db.prepare('PRAGMA table_info(courses)').all();
  const columnNames = columns.map(c => c.name);

  const columnsToAdd = [
    { name: 'video_url', type: 'TEXT' },
    { name: 'tutor_id', type: 'TEXT' },
    { name: 'status', type: "TEXT DEFAULT 'APPROVED'" } // Set existing to APPROVED to avoid hiding old courses
  ];

  columnsToAdd.forEach(col => {
    if (!columnNames.includes(col.name)) {
      console.log(`Adding column: ${col.name}`);
      db.exec(`ALTER TABLE courses ADD COLUMN ${col.name} ${col.type}`);
    } else {
      console.log(`Column ${col.name} already exists.`);
    }
  });

  console.log('Migration complete!');
} catch (error) {
  console.error('Migration failed:', error);
}
