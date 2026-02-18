import db from "./db";

console.log("Fixing system_settings table...");

try {
  const stmt = db.prepare(`
        INSERT INTO system_settings (key, value) VALUES ('ENABLE_CHALLENGES', '0')
        ON CONFLICT(key) DO NOTHING
    `);

  stmt.run();
  console.log("Ensured ENABLE_CHALLENGES key exists.");

  // Check it
  const row = db
    .prepare("SELECT * FROM system_settings WHERE key = 'ENABLE_CHALLENGES'")
    .get();
  console.log("Current Value:", row);
} catch (error) {
  console.error("Error fixing settings:", error);
}
