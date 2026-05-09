import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for Supabase
  }
});

// Helper to mimic the old SQLite API but as async functions
const db = {
  query: async (text: string, params?: any[]) => {
    return pool.query(text, params);
  },
  
  // To replace db.prepare().get()
  get: async (text: string, params?: any[]) => {
    const res = await pool.query(text, params);
    return res.rows[0];
  },
  
  // To replace db.prepare().all()
  all: async (text: string, params?: any[]) => {
    const res = await pool.query(text, params);
    return res.rows;
  },
  
  // To replace db.prepare().run()
  run: async (text: string, params?: any[]) => {
    return pool.query(text, params);
  },
  
  // To replace db.exec()
  exec: async (text: string) => {
    return pool.query(text);
  },

  // Close the pool (useful for scripts)
  close: async () => {
    await pool.end();
  }
};

export default db;
export { pool };
