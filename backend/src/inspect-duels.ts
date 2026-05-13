import db from "./db";

async function inspectSchema() {
  const tables = ['daily_duels', 'duel_votes'];
  for (const table of tables) {
    const schema = await db.all(
      `SELECT column_name, data_type 
       FROM information_schema.columns 
       WHERE table_name = $1`,
      [table]
    );
    console.log(`Schema for ${table}:`, schema);
  }
}

inspectSchema().then(() => process.exit(0));
