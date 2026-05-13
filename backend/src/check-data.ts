
import db from "./db";

async function checkData() {
  try {
    const res = await db.all(`
      SELECT id, email, name, username, topics_to_learn, badges_json, skills, portfolio_items 
      FROM users 
      LIMIT 10
    `);
    console.log(JSON.stringify(res, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkData();
