import db from "./db";

const setting = db
  .prepare("SELECT value FROM system_settings WHERE key = 'SUPER_ADMIN_CODE'")
  .get() as any;
console.log(
  "Current Super Admin Code:",
  setting ? setting.value : "DESIGNHUNT12 (Default)",
);
