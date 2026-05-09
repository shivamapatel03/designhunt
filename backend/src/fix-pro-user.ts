import db from "./db";

async function fixProUser() {
  const targetUser = "mikep"; // From the user's handle in the screenshot

  // 1. Find user by username
  let user = await db.get("SELECT * FROM users WHERE username = $1 OR username = $2", [targetUser, `@${targetUser}`]) as any;

  if (!user) {
    // If not found by username, try searching by email given earlier just to verify
    const email = "gotike3527@advarm.com";
    user = await db.get("SELECT * FROM users WHERE email = $1", [email]) as any;
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
    await db.run("UPDATE users SET is_pro = 1 WHERE id = $1", [user.id]);
    console.log(`Updated 'is_pro' for user ${user.username}`);
  }
}

fixProUser().then(() => process.exit(0));
