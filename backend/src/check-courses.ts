
import db from "./db";

async function checkCourses() {
  try {
    const res = await db.all(`SELECT * FROM courses LIMIT 5`);
    console.log(JSON.stringify(res, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkCourses();
