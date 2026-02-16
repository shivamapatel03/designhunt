import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'designhunt_v2.db');
const db = new Database(dbPath);

try {
    db.prepare('ALTER TABLE users ADD COLUMN last_login DATETIME').run();
    console.log('Successfully added last_login column to users table.');
} catch (error) {
    if (error.message.includes('duplicate column name')) {
        console.log('Column last_login already exists.');
    } else {
        console.error('Error adding column:', error);
    }
} finally {
    db.close();
}
