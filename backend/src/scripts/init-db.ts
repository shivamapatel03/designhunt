import db from "../db";

async function initDb() {
  console.log("🚀 Initializing Supabase Database...");

  try {
    // 1. Users Table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT,
        name TEXT,
        role TEXT DEFAULT 'USER',
        username TEXT UNIQUE,
        avatar TEXT,
        bio TEXT,
        skills TEXT, 
        social_links TEXT, 
        onboarding_completed BOOLEAN DEFAULT false,
        otp_code TEXT,
        otp_expires_at TIMESTAMP,
        reset_token TEXT,
        reset_token_expires_at TIMESTAMP,
        email_verified BOOLEAN DEFAULT false,
        last_login TIMESTAMP,
        status TEXT DEFAULT 'APPROVED',
        portfolio_items TEXT DEFAULT '[]',
        looking_for_work BOOLEAN DEFAULT false,
        is_pro BOOLEAN DEFAULT false,
        scan_balance INTEGER DEFAULT 0,
        total_xp INTEGER DEFAULT 0,
        current_streak INTEGER DEFAULT 0,
        badges_json TEXT DEFAULT '[]',
        last_active_date DATE,
        topics_to_learn TEXT DEFAULT '[]',
        skill_level TEXT,
        daily_goal TEXT,
        motivation TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Other tables...
    await db.exec(`
      CREATE TABLE IF NOT EXISTS expert_reviews (
        id TEXT PRIMARY KEY,
        author_name TEXT NOT NULL,
        author_title TEXT,
        rating REAL DEFAULT 5.0,
        content TEXT NOT NULL,
        author_image TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        amount REAL NOT NULL,
        currency TEXT DEFAULT 'USD',
        status TEXT DEFAULT 'completed',
        type TEXT DEFAULT 'subscription',
        description TEXT,
        razorpay_order_id TEXT,
        razorpay_payment_id TEXT,
        razorpay_signature TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS labs (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        owner_id TEXT NOT NULL,
        members TEXT DEFAULT '[]',
        canvas_state TEXT DEFAULT '{}',
        status TEXT DEFAULT 'ACTIVE',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
        status TEXT DEFAULT 'PENDING',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS enrollments (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        course_id TEXT NOT NULL,
        status TEXT DEFAULT 'active',
        progress INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
        stage TEXT DEFAULT 'REVIEW',
        status TEXT DEFAULT 'PENDING',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS challenges (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        difficulty TEXT,
        points INTEGER DEFAULT 0,
        category TEXT,
        type TEXT DEFAULT 'STANDARD',
        requirements TEXT,
        is_active BOOLEAN DEFAULT false,
        expires_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS tools (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        category TEXT,
        url TEXT,
        icon TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS submissions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        challenge_id TEXT NOT NULL,
        content TEXT,
        status TEXT DEFAULT 'PENDING',
        feedback TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS learning_topics (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT,
        icon TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS learning_levels (
        id TEXT PRIMARY KEY,
        topic_id TEXT NOT NULL,
        level_number INTEGER NOT NULL,
        difficulty TEXT NOT NULL,
        "order" INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS learning_sections (
        id TEXT PRIMARY KEY,
        level_id TEXT NOT NULL,
        title TEXT NOT NULL,
        content_json TEXT,
        duration_mins INTEGER DEFAULT 5,
        type TEXT DEFAULT 'READ',
        "order" INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS learning_quizzes (
        id TEXT PRIMARY KEY,
        section_id TEXT NOT NULL,
        question TEXT NOT NULL,
        options_json TEXT NOT NULL,
        correct_answer INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS learning_progress (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        section_id TEXT NOT NULL,
        status TEXT DEFAULT 'COMPLETED',
        score INTEGER DEFAULT 0,
        xp_earned INTEGER DEFAULT 0,
        completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, section_id)
      );

      CREATE TABLE IF NOT EXISTS learning_bookmarks (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        section_id TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, section_id)
      );

      CREATE TABLE IF NOT EXISTS learning_saves (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        level_id TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, level_id)
      );

      CREATE TABLE IF NOT EXISTS ideas (
        id SERIAL PRIMARY KEY,
        idea TEXT NOT NULL,
        image TEXT,
        user_id TEXT,
        user_handle TEXT,
        user_avatar TEXT,
        name TEXT,
        email TEXT,
        likes_count INTEGER DEFAULT 0,
        comments_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS system_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY,
        admin_id TEXT NOT NULL,
        action TEXT NOT NULL,
        target_id TEXT,
        details TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        status TEXT DEFAULT 'SUBSCRIBED',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS submission_votes (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        submission_id TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, submission_id)
      );

      CREATE TABLE IF NOT EXISTS daily_duels (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        image_a TEXT,
        image_b TEXT,
        label_a TEXT,
        label_b TEXT,
        date DATE UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS duel_votes (
        id TEXT PRIMARY KEY,
        duel_id TEXT NOT NULL,
        user_id TEXT,
        choice TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS idea_likes (
        id SERIAL PRIMARY KEY,
        idea_id INTEGER NOT NULL,
        user_id TEXT NOT NULL,
        reaction_type TEXT DEFAULT 'heart',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(idea_id, user_id)
      );

      CREATE TABLE IF NOT EXISTS idea_comments (
        id SERIAL PRIMARY KEY,
        idea_id INTEGER NOT NULL,
        user_id TEXT NOT NULL,
        user_handle TEXT,
        user_avatar TEXT,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS idea_saves (
        id SERIAL PRIMARY KEY,
        idea_id INTEGER NOT NULL,
        user_id TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(idea_id, user_id)
      );
    `);

    console.log("✅ Tables created successfully!");
    
    // Insert default settings
    await db.run("INSERT INTO system_settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING", ['SUPER_ADMIN_CODE', 'DESIGNHUNT12']);
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Initialization failed:", error);
    process.exit(1);
  }
}

initDb();
