
import db from "./db";

async function checkSkills() {
  try {
    const res = await db.all(`SELECT id, email, skills FROM users`);
    for (const row of res as any[]) {
        if (row.skills) {
            try {
                JSON.parse(row.skills);
            } catch (e: any) {
                console.log(`User ${row.email} has INVALID skills JSON: "${row.skills}"`);
                console.log(`Error: ${e.message}`);
            }
        }
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkSkills();
