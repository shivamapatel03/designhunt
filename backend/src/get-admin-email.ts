import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "designhunt_v2.db");
const db = new Database(dbPath);

const admin = db
  .prepare("SELECT email FROM users WHERE role = 'ADMIN'")
  .get() as any;
if (admin) {
  console.log(`ADMIN_EMAIL: ${admin.email}`);
} else {
  console.log("NO_ADMIN_FOUND");
}
