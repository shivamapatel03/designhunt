
import db from "./db";

async function checkNullTopics() {
  try {
    const res = await db.all(`SELECT id, email, topics_to_learn FROM users`);
    for (const row of res as any[]) {
        if (row.topics_to_learn) {
            try {
                const topics = JSON.parse(row.topics_to_learn);
                if (Array.isArray(topics)) {
                    if (topics.includes(null)) {
                        console.log(`User ${row.email} has NULL in topics_to_learn array:`, topics);
                    }
                }
            } catch (e) {}
        }
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkNullTopics();
