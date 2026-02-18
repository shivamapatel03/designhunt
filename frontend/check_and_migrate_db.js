const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve('c:/Users/User/Downloads/new look/backend/designhunt_v2.db');
console.log("Checking DB at:", dbPath);

try {
    const db = new Database(dbPath);
    const tableInfo = db.prepare("PRAGMA table_info(users)").all();
    const hasSkills = tableInfo.some(col => col.name === 'skills');
    console.log("Has skills column:", hasSkills);
    
    if (!hasSkills) {
        console.log("Adding skills column...");
        db.prepare("ALTER TABLE users ADD COLUMN skills TEXT").run();
        console.log("Skills column added successfully.");
    } else {
        console.log("Skills column already exists.");
    }
} catch (e) {
    console.error("Error:", e);
}
