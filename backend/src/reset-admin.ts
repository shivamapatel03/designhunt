import Database from "better-sqlite3";
import path from "path";
import bcrypt from "bcryptjs";
import fs from "fs";

const dbPath = path.join(process.cwd(), "designhunt_v2.db");
const db = new Database(dbPath);

async function resetAdmin() {
  const password = "admin123";
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    let admin = db
      .prepare("SELECT * FROM users WHERE role = 'ADMIN'")
      .get() as any;

    if (admin) {
      db.prepare("UPDATE users SET password = ? WHERE id = ?").run(
        hashedPassword,
        admin.id,
      );
      const msg = `Admin Email: ${admin.email}\nPassword: ${password}`;
      fs.writeFileSync("admin_creds.txt", msg);
      console.log(msg);
    } else {
      // ... create logic if needed
      console.log("No admin found (unexpected).");
    }
  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

resetAdmin();
