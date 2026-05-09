import db from "./db";
import crypto from "crypto";
import bcrypt from "bcryptjs";

async function createAdmin() {
  try {
    const id = crypto.randomUUID();
    const email = "designhunt.community@gmail.com";
    const password = "admin123";
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if exists
    const existing = await db.get("SELECT * FROM users WHERE email = $1", [email]) as any;

    if (existing) {
      console.log("Admin already exists. Updating password...");
      await db.run(
        "UPDATE users SET password = $1, role = 'ADMIN', status = 'APPROVED' WHERE email = $2",
        [hashedPassword, email]
      );
    } else {
      console.log("Creating new admin...");
      await db.run(
        "INSERT INTO users (id, email, password, name, role, status, email_verified) VALUES ($1, $2, $3, 'Test Admin', 'ADMIN', 'APPROVED', true)",
        [id, email, hashedPassword]
      );
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

createAdmin().then(() => process.exit(0));
