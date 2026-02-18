import Database from "better-sqlite3";
import path from "path";
import crypto from "crypto";
import bcrypt from "bcryptjs";

// Use process.cwd() for cleaner path resolution
const dbPath = path.join(process.cwd(), "designhunt_v2.db");
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
      .get(email) as any;

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
