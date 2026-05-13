
import db from "./db";

async function checkTopics() {
  try {
    const res = await db.all(`SELECT * FROM learning_topics`);
    console.log(JSON.stringify(res, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkTopics();
