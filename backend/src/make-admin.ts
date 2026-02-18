import Database from "better-sqlite3";
import path from "path";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

const dbPath = path.join(process.cwd(), "designhunt_v2.db");
const db = new Database(dbPath);

async function makeAdmin() {
  const email = "shivampatel2330@gmail.com";
  const password = "admin123";
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    let user = db
      .prepare("SELECT * FROM users WHERE email = ?")
      .get(email) as any;

    if (user) {
      console.log(`User found: ${user.email} (Current Role: ${user.role})`);
      db.prepare(
        "UPDATE users SET role = 'ADMIN', status = 'APPROVED', password = ? WHERE id = ?",
      ).run(hashedPassword, user.id);
      console.log(`User promoted to ADMIN and password reset to: ${password}`);
    } else {
      console.log("User not found. Creating new ADMIN account...");
      const id = randomUUID();
      db.prepare(
        "INSERT INTO users (id, email, password, name, role, status, email_verified, onboarding_completed) VALUES (?, ?, ?, 'Shivam Patel', 'ADMIN', 'APPROVED', 1, 1)",
      ).run(id, email, hashedPassword);
      console.log(`Created new ADMIN: ${email}`);
      console.log(`Password: ${password}`);
    }
  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

makeAdmin();
