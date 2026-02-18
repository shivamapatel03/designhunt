import db from "./db";

const email = "gotike3527@advarm.com";

try {
  const result = db
    .prepare("UPDATE users SET is_pro = 1 WHERE email = ?")
    .run(email);
  if (result.changes > 0) {
    console.log(`Successfully upgraded user ${email} to Pro!`);
  } else {
    console.log(`User ${email} not found.`);
  }
} catch (error) {
  console.error("Failed to upgrade user:", error);
}
