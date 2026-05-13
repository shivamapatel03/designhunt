
import db from "./db";

async function checkEmptyStrings() {
  try {
    const res = await db.all(`
      SELECT id, email, badges_json, topics_to_learn, skills, portfolio_items 
      FROM users 
      WHERE badges_json = '' OR topics_to_learn = '' OR skills = '' OR portfolio_items = ''
    `);
    console.log(JSON.stringify(res, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkEmptyStrings();
