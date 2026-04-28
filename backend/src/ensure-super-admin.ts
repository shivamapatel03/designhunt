import db from "./db";
import { randomUUID } from "crypto";

const SUPER_ADMIN_EMAILS = ["shivampatel2330@gmail.com", "shivamsenton@gmail.com"];

const ensureSuperAdmin = () => {
  SUPER_ADMIN_EMAILS.forEach(email => {
    console.log(`Checking for Super Admin: ${email}...`);

    const user = db
      .prepare("SELECT * FROM users WHERE email = ?")
      .get(email) as any;

    if (user) {
      if (user.role !== "SUPER_ADMIN") {
        console.log(
          `User exists but has role ${user.role}. Promoting to SUPER_ADMIN...`,
        );
        db.prepare(
          "UPDATE users SET role = ?, status = ?, email_verified = 1 WHERE email = ?",
        ).run("SUPER_ADMIN", "APPROVED", email);
        console.log("User promoted successfully.");
      } else {
        console.log(`${email} already exists and has correct role.`);
      }
    } else {
      console.log(`User ${email} does not exist. Creating new Super Admin...`);
      const id = randomUUID();
      db.prepare(
        `
        INSERT INTO users (id, email, name, role, status, email_verified, onboarding_completed)
        VALUES (?, ?, 'Super Admin', 'SUPER_ADMIN', 'APPROVED', 1, 1)
      `,
      ).run(id, email);
      console.log(`${email} created successfully.`);
    }
  });
};

ensureSuperAdmin();
