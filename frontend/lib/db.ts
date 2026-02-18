import Database from "better-sqlite3";
import path from "path";

// Initialize the database
const dbPath = path.resolve(process.cwd(), "../backend/designhunt_v2.db");
console.log("Checking DB at:", dbPath);
const db = new Database(dbPath);

// Schema management is now handled by the backend service.
// This connection is strictly for server-side data fetching in Next.js

export default db;
