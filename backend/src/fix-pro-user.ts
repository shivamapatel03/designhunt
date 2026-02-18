import db from "./db";

const targetUser = "mikep"; // From the user's handle in the screenshot

// 1. Find user by username
let user = db
  .prepare("SELECT * FROM users WHERE username = ? OR username = ?")
  .get(targetUser, `@${targetUser}`);

if (!user) {
  // If not found by username, try searching by email given earlier just to verify
  const email = "gotike3527@advarm.com";
  user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (user) {
    console.log(
      `Found user by email: ${user.username} (${user.email}). Is Pro: ${user.is_pro}`,
    );
  } else {
    console.log(
      "User not found by username 'mikep' or email 'gotike3527@advarm.com'",
    );
  }
} else {
  console.log(
    `Found user: ${user.username} (${user.email}). Is Pro: ${user.is_pro}`,
  );

  // 2. Upgrade the user if found by username
  const result = db
    .prepare("UPDATE users SET is_pro = 1 WHERE id = ?")
    .run(user.id);
  console.log(
    `Updated 'is_pro' for user ${user.username}: Changes: ${result.changes}`,
  );
}
