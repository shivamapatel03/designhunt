
import db from "./db";

async function checkTutorRequests() {
  try {
    const res = await db.all(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'tutor_requests'
    `);
    console.log(JSON.stringify(res, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkTutorRequests();
