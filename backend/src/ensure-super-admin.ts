import db from "./db";
import { randomUUID } from "crypto";

const SUPER_ADMIN_EMAIL = "shivampatel2330@gmail.com";

const ensureSuperAdmin = () => {
  console.log(`Checking for Super Admin: ${SUPER_ADMIN_EMAIL}...`);

  const user = db
    .prepare("SELECT * FROM users WHERE email = ?")
    .get(SUPER_ADMIN_EMAIL) as any;

  if (user) {
    if (user.role !== "SUPER_ADMIN") {
      console.log(
        `User exists but has role ${user.role}. Promoting to SUPER_ADMIN...`,
      );
      db.prepare(
        "UPDATE users SET role = ?, status = ?, email_verified = 1 WHERE email = ?",
      ).run("SUPER_ADMIN", "APPROVED", SUPER_ADMIN_EMAIL);
      console.log("User promoted successfully.");
    } else {
      console.log("Super Admin already exists and has correct role.");
    }
  } else {
    console.log("User does not exist. Creating new Super Admin...");
    const id = randomUUID();
    db.prepare(
      `
      INSERT INTO users (id, email, name, role, status, email_verified, onboarding_completed)
      VALUES (?, ?, 'Super Admin', 'SUPER_ADMIN', 'APPROVED', 1, 1)
    `,
    ).run(id, SUPER_ADMIN_EMAIL);
    console.log("Super Admin created successfully.");
  }
};

ensureSuperAdmin();
