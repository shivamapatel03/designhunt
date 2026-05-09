import db from "./db";

async function getCode() {
  const setting = await db.get(
    "SELECT value FROM system_settings WHERE key = 'SUPER_ADMIN_CODE'"
  ) as any;
  console.log(
    "Current Super Admin Code:",
    setting ? setting.value : "DESIGNHUNT12 (Default)",
  );
}

getCode().then(() => process.exit(0));
