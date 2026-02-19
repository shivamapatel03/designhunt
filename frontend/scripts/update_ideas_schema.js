const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, '../../backend/designhunt_v2.db');
const db = new Database(dbPath);

console.log("Updating ideas table schema...");

try {
    // Add columns if they don't exist
    const columns = [
        { name: 'status', type: 'TEXT DEFAULT "pending"' },
        { name: 'admin_feedback', type: 'TEXT' },
        { name: 'user_image', type: 'TEXT' },
        { name: 'updated_at', type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' }
    ];

    for (const col of columns) {
        try {
            db.prepare(`ALTER TABLE ideas ADD COLUMN ${col.name} ${col.type}`).run();
            console.log(`Added column: ${col.name}`);
        } catch (e) {
            if (e.message.includes('duplicate column name')) {
                console.log(`Column already exists: ${col.name}`);
            } else {
                throw e;
            }
        }
    }

    console.log("Schema update complete.");
} catch (err) {
    console.error("Migration failed:", err);
} finally {
    db.close();
}
