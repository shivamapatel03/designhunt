import db from "./db";

const migrate = () => {
  console.log("Running migration: Adding is_pro to users table...");
  try {
    db.exec(`ALTER TABLE users ADD COLUMN is_pro BOOLEAN DEFAULT 0`);
    console.log("Migration successful: Added is_pro column.");
  } catch (error: any) {
    if (error.message.includes("duplicate column name")) {
      console.log("Migration skipped: Column already exists.");
    } else {
      console.error("Migration failed:", error);
    }
  }
};

migrate();
