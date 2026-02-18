import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "designhunt_v2.db");
const db = new Database(dbPath);

const columns = db.prepare("PRAGMA table_info(users)").all();
console.log(
  "Users table columns:",
  columns.map((c: any) => c.name),
);
