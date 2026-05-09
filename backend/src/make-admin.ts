import db from "./db";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

async function makeAdmin() {
  const email = "shivampatel2330@gmail.com";
  const password = "admin123";
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    let user = await db.get("SELECT * FROM users WHERE email = $1", [email]) as any;

    if (user) {
      console.log(`User found: ${user.email} (Current Role: ${user.role})`);
      await db.run(
        "UPDATE users SET role = 'ADMIN', status = 'APPROVED', password = $1 WHERE id = $2",
        [hashedPassword, user.id]
      );
      console.log(`User promoted to ADMIN and password reset to: ${password}`);
    } else {
      console.log("User not found. Creating new ADMIN account...");
      const id = randomUUID();
      await db.run(
        "INSERT INTO users (id, email, password, name, role, status, email_verified, onboarding_completed) VALUES ($1, $2, $3, 'Shivam Patel', 'ADMIN', 'APPROVED', 1, 1)",
        [id, email, hashedPassword]
      );
      console.log(`Created new ADMIN: ${email}`);
      console.log(`Password: ${password}`);
    }
  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

makeAdmin().then(() => process.exit(0));
