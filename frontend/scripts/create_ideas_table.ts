import db from "./db";

const createIdeasTable = () => {
  try {
    db.prepare(
      `
      CREATE TABLE IF NOT EXISTS ideas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        idea TEXT NOT NULL,
        status TEXT DEFAULT 'new',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `,
    ).run();
    console.log("Ideas table created successfully!");
  } catch (error) {
    console.error("Error creating ideas table:", error);
  }
};

createIdeasTable();
