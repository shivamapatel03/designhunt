import db from "./db";

async function makeUserPro() {
  const email = "[EMAIL_ADDRESS]";

  try {
    const result = await db.run(
      "UPDATE users SET is_pro = true WHERE email = $1",
      [email],
    );
    if (result.rowCount && result.rowCount > 0) {
      console.log(`Successfully upgraded user ${email} to Pro!`);
    } else {
      console.log(`User ${email} not found.`);
    }
  } catch (error) {
    console.error("Failed to upgrade user:", error);
  }
}

makeUserPro().then(() => process.exit(0));
