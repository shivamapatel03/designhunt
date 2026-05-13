
import db from "./db";

async function checkEnrollments() {
  try {
    const res = await db.all(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name IN ('courses', 'enrollments')
    `);
    console.log(JSON.stringify(res, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkEnrollments();
