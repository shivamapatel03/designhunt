import { Pool } from "pg";
import Database from "better-sqlite3";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for Supabase
  }
});

const sqliteDb = new Database(path.resolve(__dirname, "../designhunt_v2.db"));

// Helper to mimic the old SQLite API but as async functions
const db = {
  query: async (text: string, params?: any[]) => {
    return pool.query(text, params);
  },
  
  // To replace db.prepare().get()
  get: async (text: string, params?: any[]) => {
    // Try Postgres first
    const res = await pool.query(text, params);
    if (res.rows[0]) return res.rows[0];

    // Fallback to SQLite (only for SELECT)
    if (text.trim().toUpperCase().startsWith("SELECT")) {
      console.log("DB: Falling back to SQLite for query:", text);
      try {
        // Convert $1, $2 to ?, ? for SQLite
        const sqliteQuery = text.replace(/\$\d+/g, "?");
        const row = sqliteDb.prepare(sqliteQuery).get(params || []);
        return row;
      } catch (e) {
        console.error("SQLite Fallback Error:", e);
      }
    }
    return undefined;
  },
  
  // To replace db.prepare().all()
  all: async (text: string, params?: any[]) => {
    const res = await pool.query(text, params);
    if (res.rows.length > 0) return res.rows;

    if (text.trim().toUpperCase().startsWith("SELECT")) {
      console.log("DB: Falling back to SQLite for all query:", text);
      try {
        const sqliteQuery = text.replace(/\$\d+/g, "?");
        const rows = sqliteDb.prepare(sqliteQuery).all(params || []);
        return rows;
      } catch (e) {
        console.error("SQLite Fallback Error:", e);
      }
    }
    return [];
  },
  
  run: async (text: string, params?: any[]) => {
    const res = await pool.query(text, params);
    if (res.rowCount && res.rowCount > 0) return res;

    // Fallback to SQLite (only for UPDATE/INSERT)
    const upperText = text.trim().toUpperCase();
    if (upperText.startsWith("UPDATE") || upperText.startsWith("INSERT")) {
      console.log("DB: Falling back to SQLite for write query:", text);
      try {
        const sqliteQuery = text.replace(/\$\d+/g, "?");
        const resSqlite = sqliteDb.prepare(sqliteQuery).run(params || []);
        return resSqlite;
      } catch (e) {
        console.error("SQLite Fallback Error (Write):", e);
      }
    }
    return res;
  },
  
  exec: async (text: string) => {
    return pool.query(text);
  },

  close: async () => {
    await pool.end();
    sqliteDb.close();
  }
};

export default db;
export { pool };
