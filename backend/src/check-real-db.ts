
import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function checkRealDb() {
  try {
    const res = await pool.query(`SELECT id, email, name FROM users`);
    console.log(`Real DB Users (${res.rows.length}):`);
    console.log(JSON.stringify(res.rows, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkRealDb();
