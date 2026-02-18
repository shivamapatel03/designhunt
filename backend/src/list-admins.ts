const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(process.cwd(), "designhunt_v2.db");
const db = new Database(dbPath);

const admins = db
  .prepare("SELECT email, name, role, status FROM users WHERE role = 'ADMIN'")
  .all();
console.log("Existing Admins:", JSON.stringify(admins, null, 2));
