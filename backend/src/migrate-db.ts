import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "designhunt_v2.db");
const db = new Database(dbPath);

try {
  const columns = db.prepare("PRAGMA table_info(users)").all();
  const hasStatus = columns.some((c: any) => c.name === "status");

  if (!hasStatus) {
    console.log("Adding missing 'status' column to users table...");
    db.prepare(
      "ALTER TABLE users ADD COLUMN status TEXT DEFAULT 'APPROVED'",
    ).run();
    console.log("Column added successfully.");
  } else {
    console.log("'status' column already exists.");
  }
} catch (err: any) {
  console.error("Migration Error:", err.message);
}
