import db from "./db";

const user = db.prepare("SELECT * FROM users WHERE username = ?").get("mikep");

if (user) {
  console.log("Found User:");
  console.log(JSON.stringify(user, null, 2));

  if (user.is_pro !== 1) {
    console.log("Upgrading user...");
    db.prepare("UPDATE users SET is_pro = 1 WHERE id = ?").run(user.id);
    console.log("Upgraded!");
  } else {
    console.log("User is already PRO.");
  }
} else {
  console.log("User 'mikep' NOT FOUND.");
  // Let's dump all usernames just in case
  const allUsers = db.prepare("SELECT username FROM users").all();
  console.log(
    "All usernames:",
    allUsers.map((u) => u.username),
  );
}
