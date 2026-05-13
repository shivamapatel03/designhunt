
import db from "./db";

async function checkSchema() {
  try {
    const res = await db.all(`
      SELECT table_schema, column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users'
      ORDER BY table_schema, column_name
    `);
    console.log(JSON.stringify(res, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkSchema();
