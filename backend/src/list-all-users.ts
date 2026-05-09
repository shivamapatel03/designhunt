import db from "./db";

async function listAllUsers() {
  const users = await db.all("SELECT id, username, name, email FROM users");
  console.log(JSON.stringify(users, null, 2));
}

listAllUsers().then(() => process.exit(0));
