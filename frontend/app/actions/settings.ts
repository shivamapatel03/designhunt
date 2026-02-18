import db from "@/lib/db";

export async function getSettings() {
  try {
    const row = db
      .prepare(
        "SELECT value FROM system_settings WHERE key = 'ENABLE_CHALLENGES'",
      )
      .get() as { value: string } | undefined;

    return {
      enable_challenges: row ? parseInt(row.value) : 0,
    };
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return { enable_challenges: 0 };
  }
}

export async function toggleChallenges(enabled: boolean) {
  try {
    const value = enabled ? "1" : "0";
    // Upsert logic
    const stmt = db.prepare(`
            INSERT INTO system_settings (key, value) VALUES ('ENABLE_CHALLENGES', ?)
            ON CONFLICT(key) DO UPDATE SET value = excluded.value
        `);

    stmt.run(value);
    return { success: true };
  } catch (error) {
    console.error("Failed to update settings:", error);
    return { success: false, error };
  }
}
