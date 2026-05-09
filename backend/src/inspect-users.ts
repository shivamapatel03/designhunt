import db from "./db";

async function inspect() {
  try {
    const schema = await db.all(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users'
    `) as any[];
    console.log("Users Table Schema:");
    schema.forEach(col => {
      console.log(`- ${col.column_name}: ${col.data_type}`);
    });
  } catch (error) {
    console.error("Error inspecting DB:", error);
  }
}

inspect().then(() => process.exit(0));
