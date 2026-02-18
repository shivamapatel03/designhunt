const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'designhunt_v2.db');
const db = new Database(dbPath);

try {
  const setting = db.prepare("SELECT value FROM system_settings WHERE key = 'SUPER_ADMIN_CODE'").get();
  console.log("DB Value:", setting ? setting.value : "Not set (Using default)");
} catch (e) {
  console.log("Error reading system_settings:", e.message);
}
