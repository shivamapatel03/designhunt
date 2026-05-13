
import db from "./db";

async function checkDefault() {
  try {
    const res = await db.all(`
      SELECT column_name, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name IN ('badges_json', 'topics_to_learn', 'portfolio_items')
    `);
    console.log(JSON.stringify(res, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkDefault();
