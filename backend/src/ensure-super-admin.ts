import db from "./db";
import { randomUUID } from "crypto";

const SUPER_ADMIN_EMAILS = ["shivampatel2330@gmail.com", "shivamsenton@gmail.com"];

async function ensureSuperAdmin() {
  for (const email of SUPER_ADMIN_EMAILS) {
    console.log(`Checking for Super Admin: ${email}...`);

    try {
      const user = await db.get("SELECT * FROM users WHERE email = $1", [email]) as any;

      if (user) {
        if (user.role !== "SUPER_ADMIN") {
          console.log(
            `User exists but has role ${user.role}. Promoting to SUPER_ADMIN...`,
          );
          await db.run(
            "UPDATE users SET role = $1, status = $2, email_verified = 1 WHERE email = $3",
            ["SUPER_ADMIN", "APPROVED", email]
          );
          console.log("User promoted successfully.");
        } else {
          console.log(`${email} already exists and has correct role.`);
        }
      } else {
        console.log(`User ${email} does not exist. Creating new Super Admin...`);
        const id = randomUUID();
        await db.run(
          `
          INSERT INTO users (id, email, name, role, status, email_verified, onboarding_completed)
          VALUES ($1, $2, 'Super Admin', 'SUPER_ADMIN', 'APPROVED', 1, 1)
        `,
          [id, email]
        );
        console.log(`${email} created successfully.`);
      }
    } catch (error) {
      console.error(`Failed to ensure super admin ${email}:`, error);
    }
  }
}

ensureSuperAdmin().then(() => process.exit(0));
