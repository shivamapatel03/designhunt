import db from "./db";

async function fixSettingsRow() {
  console.log("Fixing system_settings table...");

  try {
    await db.run(`
        INSERT INTO system_settings (key, value) VALUES ('ENABLE_CHALLENGES', '0')
        ON CONFLICT(key) DO NOTHING
    `);

    console.log("Ensured ENABLE_CHALLENGES key exists.");

    // Check it
    const row = await db.get("SELECT * FROM system_settings WHERE key = 'ENABLE_CHALLENGES'");
    console.log("Current Value:", row);
  } catch (error) {
    console.error("Error fixing settings:", error);
  }
}

fixSettingsRow().then(() => process.exit(0));
