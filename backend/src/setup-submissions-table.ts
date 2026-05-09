import db from "./db";

async function setupSubmissionsTable() {
  const createTable = `
    CREATE TABLE IF NOT EXISTS submissions (
        id TEXT PRIMARY KEY,
        challenge_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        user_name TEXT,
        user_avatar TEXT,
        content TEXT NOT NULL,
        vote_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(challenge_id) REFERENCES challenges(id)
    );
  `;

  const createVotesTable = `
    CREATE TABLE IF NOT EXISTS submission_votes (
        user_id TEXT NOT NULL,
        submission_id TEXT NOT NULL,
        PRIMARY KEY (user_id, submission_id),
        FOREIGN KEY(submission_id) REFERENCES submissions(id)
    );
  `;

  try {
    console.log("Creating submissions table...");
    await db.exec(createTable);
    console.log("Creating submission_votes table...");
    await db.exec(createVotesTable);
    console.log("Tables created successfully.");
  } catch (error) {
    console.error("Error creating tables:", error);
  }
}

setupSubmissionsTable().then(() => process.exit(0));
