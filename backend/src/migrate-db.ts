import db from "./db";

async function migrateDb() {
  try {
    const columns = await db.all(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users'
    `) as any[];
    const hasStatus = columns.some((c: any) => c.column_name === "status");

    if (!hasStatus) {
      console.log("Adding missing 'status' column to users table...");
      await db.run(
        "ALTER TABLE users ADD COLUMN status TEXT DEFAULT 'APPROVED'",
      );
      console.log("Column added successfully.");
    } else {
      console.log("'status' column already exists.");
    }
  } catch (err: any) {
    console.error("Migration Error:", err.message);
  }
}

migrateDb().then(() => process.exit(0));
