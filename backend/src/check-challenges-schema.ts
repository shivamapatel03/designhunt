
import db from "./db";

async function checkChallenges() {
  try {
    const res = await db.all(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'challenges'
    `);
    console.log(JSON.stringify(res, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkChallenges();
