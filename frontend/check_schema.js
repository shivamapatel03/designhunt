const Database = require('better-sqlite3');
const path = require('path');

// Adjust path as needed based on where I run this script
const dbPath = path.resolve('c:/Users/User/Downloads/new look/backend/designhunt_v2.db');
console.log("Checking DB at:", dbPath);

try {
    const db = new Database(dbPath);
    const tableInfo = db.prepare("PRAGMA table_info(users)").all();
    console.log("Columns in users table:");
    tableInfo.forEach(col => console.log(col.name, col.type));
} catch (e) {
    console.error("Error opening db:", e);
}
