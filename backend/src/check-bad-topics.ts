
import db from "./db";

async function checkBadTopics() {
  try {
    const res = await db.all(`SELECT id, email, topics_to_learn FROM users`);
    for (const row of res as any[]) {
        if (row.topics_to_learn) {
            try {
                const topics = JSON.parse(row.topics_to_learn);
                if (Array.isArray(topics)) {
                    for (const t of topics) {
                        if (typeof t !== 'string') {
                            console.log(`Bad topic for user ${row.email}:`, t);
                        }
                    }
                } else {
                    console.log(`topics_to_learn is not an array for user ${row.email}:`, topics);
                }
            } catch (e) {
                console.log(`Invalid JSON for user ${row.email}:`, row.topics_to_learn);
            }
        }
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkBadTopics();
