import db from "./db";

async function listAdmins() {
  const admins = await db.all(
    "SELECT email, name, role, status FROM users WHERE role = 'ADMIN'"
  );
  console.log("Existing Admins:", JSON.stringify(admins, null, 2));
}

listAdmins().then(() => process.exit(0));
