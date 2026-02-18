import db from "./db";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

async function resetSuperAdmin() {
  const email = "shivampatel2330@gmail.com";
  const password = "mike@1714";
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    console.log(`Resetting user: ${email}`);

    // Delete existing to avoid any state issues
    db.prepare("DELETE FROM users WHERE email = ?").run(email);

    // Insert fresh
    const id = randomUUID();
    db.prepare(
      `
      INSERT INTO users (id, email, password, name, role, status, email_verified, onboarding_completed) 
      VALUES (?, ?, ?, 'Super Admin', 'SUPER_ADMIN', 'APPROVED', 1, 1)
    `,
    ).run(id, email, hashedPassword);

    console.log("\n==================================================");
    console.log("SUPER ADMIN CREDENTIALS FORCED");
    console.log("==================================================");
    console.log(`Email:    ${email}`);
    console.log(`Password: ${password}`);
    console.log(`Role:     SUPER_ADMIN`);
    console.log("==================================================\n");
  } catch (error) {
    console.error("Error resetting Super Admin:", error);
  }
}

resetSuperAdmin();
