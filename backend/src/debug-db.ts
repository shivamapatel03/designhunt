import db from "./db";

async function debugDb() {
  const schema = await db.all(`
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'users'
  `) as any[];
  console.log(
    "Users table columns:",
    schema.map((c: any) => c.column_name),
  );
}

debugDb().then(() => process.exit(0));
