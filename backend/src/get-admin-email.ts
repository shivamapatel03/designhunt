import db from "./db";

async function getAdminEmail() {
  const admin = await db.get("SELECT email FROM users WHERE role = 'ADMIN'") as any;
  if (admin) {
    console.log(`ADMIN_EMAIL: ${admin.email}`);
  } else {
    console.log("NO_ADMIN_FOUND");
  }
}

getAdminEmail().then(() => process.exit(0));
