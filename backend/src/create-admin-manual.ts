const Database = require("better-sqlite3");
const path = require("path");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

// Force absolute path to avoid ambiguity
const dbPath = path.join(
  "c:\\Users\\User\\Downloads\\new look\\backend",
  "designhunt_v2.db",
);
console.log("Connecting to:", dbPath);
const db = new Database(dbPath);

async function createAdmin() {
  try {
    const id = crypto.randomUUID();
    const email = "admin@designhunt.com";
    const password = "admin123";
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if exists
    const existing = db
      .prepare("SELECT * FROM users WHERE email = ?")
      .get(email);
    if (existing) {
      console.log("Admin already exists. Updating password...");
      db.prepare(
        "UPDATE users SET password = ?, role = 'ADMIN', status = 'APPROVED' WHERE email = ?",
      ).run(hashedPassword, email);
    } else {
      console.log("Creating new admin...");
      db.prepare(
        "INSERT INTO users (id, email, password, name, role, status, email_verified) VALUES (?, ?, ?, 'Test Admin', 'ADMIN', 'APPROVED', 1)",
      ).run(id, email, hashedPassword);
    }

    console.log("---------------------------------------------------");
    console.log("Admin Credentials Ready:");
    console.log("Email: " + email);
    console.log("Password: " + password);
    console.log("---------------------------------------------------");
  } catch (err) {
    console.error("Error:", err);
  }
}

createAdmin();
