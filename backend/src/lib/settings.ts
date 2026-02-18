import db from "../db";

export const getSetting = (key: string): string | null => {
  try {
    const row = db
      .prepare("SELECT value FROM system_settings WHERE key = ?")
      .get(key) as { value: string } | undefined;
    return row ? row.value : null;
  } catch (err) {
    console.error(`Error fetching setting ${key}:`, err);
    return null;
  }
};

export const updateSetting = (key: string, value: string) => {
  try {
    db.prepare(
      `
      INSERT INTO system_settings (key, value, updated_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(key) DO UPDATE SET
        value = excluded.value,
        updated_at = CURRENT_TIMESTAMP
    `,
    ).run(key, value);
    return true;
  } catch (err) {
    console.error(`Error updating setting ${key}:`, err);
    return false;
  }
};

export const getAllSettings = () => {
  try {
    const rows = db.prepare("SELECT * FROM system_settings").all() as {
      key: string;
      value: string;
    }[];
    // Convert array of objects to a single object map
    return rows.reduce(
      (acc, row) => {
        acc[row.key] = row.value;
        return acc;
      },
      {} as Record<string, string>,
    );
  } catch (err) {
    console.error("Error fetching all settings:", err);
    return {};
  }
};
