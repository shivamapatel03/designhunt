import db from "./db";

async function inspect() {
  try {
    const schema = await db.all(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'challenges'
    `);
    console.log("Challenges Table Schema:", schema);
  } catch (error) {
    console.error("Error inspecting DB:", error);
  }
}

inspect().then(() => process.exit(0));
