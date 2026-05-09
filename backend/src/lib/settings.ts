import db from "../db";

export const getSetting = async (key: string): Promise<string | null> => {
  try {
    const row = await db.get("SELECT value FROM system_settings WHERE key = $1", [key]) as { value: string } | undefined;
    return row ? row.value : null;
  } catch (err) {
    console.error(`Error fetching setting ${key}:`, err);
    return null;
  }
};

export const updateSetting = async (key: string, value: string) => {
  try {
    await db.run(
      `
      INSERT INTO system_settings (key, value, updated_at)
      VALUES ($1, $2, CURRENT_TIMESTAMP)
      ON CONFLICT(key) DO UPDATE SET
        value = EXCLUDED.value,
        updated_at = CURRENT_TIMESTAMP
    `,
      [key, value]
    );
    return true;
  } catch (err) {
    console.error(`Error updating setting ${key}:`, err);
    return false;
  }
};

export const getAllSettings = async () => {
  try {
    const rows = await db.all("SELECT * FROM system_settings") as {
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
