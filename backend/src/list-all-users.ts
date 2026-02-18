import db from "./db";

const users = db.prepare("SELECT id, username, name, email FROM users").all();
console.log(JSON.stringify(users, null, 2));
