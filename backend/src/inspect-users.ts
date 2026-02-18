import db from "./db";

const users = db.prepare("SELECT id, username, email, is_pro FROM users").all();
console.log(JSON.stringify(users, null, 2));
