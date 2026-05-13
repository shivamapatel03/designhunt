
import db from "./db";

async function checkUser() {
  const id = 'cedc6a5b-f1ce-4da1-96e5-141d022d4107';
  try {
    const user = await db.get("SELECT * FROM users WHERE id = $1", [id]);
    console.log("User:", JSON.stringify(user, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkUser();
