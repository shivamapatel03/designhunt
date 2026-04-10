import Database from "better-sqlite3";
import path from "path";

// Initialize the database
// Assuming running from 'backend' root
const dbPath = path.join(process.cwd(), "designhunt_v2.db");
let db: any;

try {
  db = new Database(dbPath);

  console.log("Connected to database at:", dbPath);

  // Attempt to add reaction_type column to idea_likes for migration
  try {
    db.prepare(
      "ALTER TABLE idea_likes ADD COLUMN reaction_type TEXT DEFAULT 'heart'",
    ).run();
    console.log("Migration: Added reaction_type column to idea_likes");
  } catch (e) {
    // Column likely already exists
  }

  try {
    db.prepare(
      "ALTER TABLE users ADD COLUMN portfolio_items TEXT DEFAULT '[]'",
    ).run();
    console.log("Migration: Added portfolio_items column to users");
  } catch (e) {}

  try {
    db.prepare(
      "ALTER TABLE users ADD COLUMN looking_for_work BOOLEAN DEFAULT 0",
    ).run();
    console.log("Migration: Added looking_for_work column to users");
  } catch (e) {}

  try {
    db.prepare(
      "ALTER TABLE users ADD COLUMN is_pro BOOLEAN DEFAULT 0",
    ).run();
    console.log("Migration: Added is_pro column to users");
  } catch (e) {}

  try {
    db.prepare(
      "ALTER TABLE users ADD COLUMN scan_balance INTEGER DEFAULT 0",
    ).run();
    console.log("Migration: Added scan_balance column to users");
  } catch (e) {}

  try {
    db.prepare(
      "ALTER TABLE users ADD COLUMN total_xp INTEGER DEFAULT 0",
    ).run();
    console.log("Migration: Added total_xp column to users");
  } catch (e) {}

  try {
    db.prepare(
      "ALTER TABLE users ADD COLUMN current_streak INTEGER DEFAULT 0",
    ).run();
    console.log("Migration: Added current_streak column to users");
  } catch (e) {}

  try {
    db.prepare(
      "ALTER TABLE users ADD COLUMN badges_json TEXT DEFAULT '[]'",
    ).run();
    console.log("Migration: Added badges_json column to users");
  } catch (e) {}

  try {
    db.prepare(
      "ALTER TABLE users ADD COLUMN last_active_date DATE",
    ).run();
    console.log("Migration: Added last_active_date column to users");
  } catch (e) {}

  try {
    db.prepare(
      "ALTER TABLE transactions ADD COLUMN razorpay_order_id TEXT",
    ).run();
  } catch (e) {}

  try {
    db.prepare(
      "ALTER TABLE transactions ADD COLUMN razorpay_payment_id TEXT",
    ).run();
  } catch (e) {}

  try {
    db.prepare(
      "ALTER TABLE transactions ADD COLUMN razorpay_signature TEXT",
    ).run();
  } catch (e) {}

  // Create tables if they don't exist
  db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT,
    name TEXT,
    role TEXT DEFAULT 'USER',
    username TEXT UNIQUE,
    avatar TEXT,
    bio TEXT,
    skills TEXT, -- JSON string
    social_links TEXT, -- JSON string
    onboarding_completed BOOLEAN DEFAULT 0,
    otp_code TEXT,
    otp_expires_at DATETIME,
    reset_token TEXT,
    reset_token_expires_at DATETIME,
    email_verified BOOLEAN DEFAULT 0,
    last_login DATETIME,
    status TEXT DEFAULT 'APPROVED', -- APPROVED, PENDING, REJECTED
    portfolio_items TEXT DEFAULT '[]', -- JSON string
    looking_for_work BOOLEAN DEFAULT 0,
    is_pro BOOLEAN DEFAULT 0,
    scan_balance INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  `);

  // (rest of the system_settings table or other tables)

  db.exec(`
  CREATE TABLE IF NOT EXISTS expert_reviews (
    id TEXT PRIMARY KEY,
    author_name TEXT NOT NULL,
    author_title TEXT,
    rating REAL DEFAULT 5.0,
    content TEXT NOT NULL,
    author_image TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    amount REAL NOT NULL,
    currency TEXT DEFAULT 'USD',
    status TEXT DEFAULT 'completed', -- completed, pending, failed
    type TEXT DEFAULT 'subscription', -- subscription, one_time, refund
    description TEXT,
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    razorpay_signature TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS labs (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    owner_id TEXT NOT NULL,
    members TEXT DEFAULT '[]', -- JSON array of user IDs
    canvas_state TEXT DEFAULT '{}', -- JSON state of the design board
    status TEXT DEFAULT 'ACTIVE', -- ACTIVE, ARCHIVED
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(owner_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS courses (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    price TEXT,
    difficulty TEXT,
    duration TEXT,
    thumbnail TEXT,
    video_url TEXT,
    instructor_name TEXT,
    instructor_avatar TEXT,
    tutor_id TEXT,
    category TEXT,
    status TEXT DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tutor_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS jobs (
    id TEXT PRIMARY KEY,
    company TEXT NOT NULL,
    role TEXT NOT NULL,
    location TEXT,
    type TEXT,
    salary TEXT,
    logo TEXT,
    tags TEXT, -- JSON string
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS startups (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    mission TEXT,
    industry TEXT,
    location TEXT,
    tags TEXT, -- JSON string
    required_skills TEXT, -- JSON string
    image TEXT,
    role TEXT,
    equity TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS enrollments (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    course_id TEXT NOT NULL,
    status TEXT DEFAULT 'active', -- active, completed, dropped
    progress INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (course_id) REFERENCES courses(id)
  );

  CREATE TABLE IF NOT EXISTS tutor_requests (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    email TEXT NOT NULL,
    portfolio TEXT,
    expertise TEXT,
    bio TEXT,
    stage TEXT DEFAULT 'REVIEW', -- REVIEW, INTERVIEW, VETTING, ONBOARDING
    status TEXT DEFAULT 'PENDING', -- PENDING, APPROVED, DECLINED
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS challenges (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    difficulty TEXT,
    points INTEGER DEFAULT 0,
    category TEXT,
    type TEXT DEFAULT 'STANDARD', -- STANDARD, DAILY
    expires_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS tools (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    url TEXT,
    icon TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS submissions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    challenge_id TEXT NOT NULL,
    content TEXT, -- URL or text content
    status TEXT DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED
    feedback TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (challenge_id) REFERENCES challenges(id)
  );

  CREATE TABLE IF NOT EXISTS submission_votes (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    submission_id TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (submission_id) REFERENCES submissions(id),
    UNIQUE(user_id, submission_id) -- Prevent double voting
  );

  CREATE TABLE IF NOT EXISTS user_progress (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    course_id TEXT NOT NULL,
    module_id TEXT,
    status TEXT DEFAULT 'started', -- started, completed
    completed_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (course_id) REFERENCES courses(id)
  );
  
  CREATE TABLE IF NOT EXISTS modules (
    id TEXT PRIMARY KEY,
    course_id TEXT NOT NULL,
    title TEXT NOT NULL,
    duration TEXT,
    [order] INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS lessons (
    id TEXT PRIMARY KEY,
    module_id TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT, -- For text-based theory lessons
    video_url TEXT,
    duration TEXT,
    type TEXT DEFAULT 'VIDEO', -- VIDEO, TEXT
    [order] INTEGER NOT NULL,
    is_free BOOLEAN DEFAULT 0, -- For public preview (Marketing)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS concepts (
    id TEXT PRIMARY KEY,
    term TEXT UNIQUE NOT NULL,
    definition TEXT NOT NULL,
    visual_example TEXT,
    related_lesson_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS daily_duels (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    option_a_label TEXT NOT NULL,
    option_a_image TEXT NOT NULL, -- URL
    option_b_label TEXT NOT NULL,
    option_b_image TEXT NOT NULL, -- URL
    category TEXT,
    date DATE UNIQUE NOT NULL, -- YYYY-MM-DD
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS duel_votes (
    id TEXT PRIMARY KEY,
    duel_id TEXT NOT NULL,
    user_id TEXT, -- Optional, or use a session/fingerprint ID if anon
    choice TEXT NOT NULL, -- 'A' or 'B'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (duel_id) REFERENCES daily_duels(id)
  );

  CREATE TABLE IF NOT EXISTS system_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    admin_id TEXT,
    action TEXT NOT NULL,
    target_id TEXT,
    details TEXT, -- JSON string
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS ideas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    idea TEXT NOT NULL,
    image TEXT,
    user_id TEXT,
    user_handle TEXT,
    user_avatar TEXT,
    name TEXT,
    email TEXT,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS idea_likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    idea_id INTEGER NOT NULL,
    user_id TEXT NOT NULL,
    reaction_type TEXT DEFAULT 'heart',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idea_id) REFERENCES ideas(id) ON DELETE CASCADE,
    UNIQUE(idea_id, user_id)
  );

  CREATE TABLE IF NOT EXISTS idea_comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    idea_id INTEGER NOT NULL,
    user_id TEXT NOT NULL,
    user_handle TEXT,
    user_avatar TEXT,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idea_id) REFERENCES ideas(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS idea_saves (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    idea_id INTEGER NOT NULL,
    user_id TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idea_id) REFERENCES ideas(id) ON DELETE CASCADE,
    UNIQUE(idea_id, user_id)
  );

  -- Learning System Tables
  CREATE TABLE IF NOT EXISTS learning_topics (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS learning_levels (
    id TEXT PRIMARY KEY,
    topic_id TEXT NOT NULL,
    level_number INTEGER NOT NULL,
    difficulty TEXT NOT NULL, -- NORMAL, MEDIUM, HARD
    [order] INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (topic_id) REFERENCES learning_topics(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS learning_sections (
    id TEXT PRIMARY KEY,
    level_id TEXT NOT NULL,
    title TEXT NOT NULL,
    content_json TEXT, -- JSON array of content blocks (text, image, interactive)
    duration_mins INTEGER DEFAULT 5,
    type TEXT DEFAULT 'READ', -- READ, TEST
    [order] INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (level_id) REFERENCES learning_levels(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS learning_quizzes (
    id TEXT PRIMARY KEY,
    section_id TEXT NOT NULL,
    question TEXT NOT NULL,
    options_json TEXT NOT NULL, -- JSON array of strings
    correct_answer INTEGER NOT NULL, -- Index of correct option
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (section_id) REFERENCES learning_sections(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS learning_progress (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    section_id TEXT NOT NULL,
    status TEXT DEFAULT 'COMPLETED',
    score INTEGER DEFAULT 0,
    xp_earned INTEGER DEFAULT 0,
    completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (section_id) REFERENCES learning_sections(id),
    UNIQUE(user_id, section_id)
  );

  CREATE TABLE IF NOT EXISTS learning_saves (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    level_id TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (level_id) REFERENCES learning_levels(id),
    UNIQUE(user_id, level_id)
  );

  CREATE TABLE IF NOT EXISTS learning_bookmarks (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    section_id TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (section_id) REFERENCES learning_sections(id),
    UNIQUE(user_id, section_id)
  );
  `);

  db.prepare(
    "INSERT OR IGNORE INTO system_settings (key, value) VALUES ('SUPER_ADMIN_CODE', 'DESIGNHUNT12')",
  ).run();
} catch (error) {
  console.error("Database initialization failed:", error);
}

export default db;
