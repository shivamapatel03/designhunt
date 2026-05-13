
import db from "./db";

async function checkTopicObjects() {
  try {
    const res = await db.all(`SELECT id, email, topics_to_learn FROM users`);
    for (const row of res as any[]) {
        if (row.topics_to_learn) {
            try {
                const topics = JSON.parse(row.topics_to_learn);
                if (Array.isArray(topics)) {
                    for (const t of topics) {
                        if (typeof t !== 'string') {
                            console.log(`User ${row.email} has non-string topic:`, t);
                        }
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

checkTopicObjects();
