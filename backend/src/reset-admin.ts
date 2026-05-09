import db from "./db";
import bcrypt from "bcryptjs";
import fs from "fs";

async function resetAdmin() {
  const password = "admin123";
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    let admin = await db.get("SELECT * FROM users WHERE role = 'ADMIN'") as any;

    if (admin) {
      await db.run("UPDATE users SET password = $1 WHERE id = $2", [
        hashedPassword,
        admin.id,
      ]);
      const msg = `Admin Email: ${admin.email}\nPassword: ${password}`;
      fs.writeFileSync("admin_creds.txt", msg);
      console.log(msg);
    } else {
      console.log("No admin found (unexpected).");
    }
  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

resetAdmin().then(() => process.exit(0));
