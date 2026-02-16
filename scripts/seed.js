const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(process.cwd(), 'designhunt_v2.db');
const db = new Database(dbPath);

async function seed() {
  console.log('Seeding database...');

  // Create tables if they don't exist (copying from lib/db.ts to ensure standalone execution)
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
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
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
      
    CREATE TABLE IF NOT EXISTS challenges (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      difficulty TEXT,
      points INTEGER DEFAULT 0,
      category TEXT,
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
  `);

  // Clear existing data
  try {
     db.exec('DELETE FROM courses');
     db.exec('DELETE FROM challenges');
     db.exec('DELETE FROM tools');
     db.exec('DELETE FROM users WHERE email = "test@example.com"');
  } catch (error) {
    console.log('Error clearing tables (might be first run):', error.message);
  }

  // Define insertUser prepared statement
  const insertUser = db.prepare(`
    INSERT INTO users (id, name, email, password, role)
    VALUES (?, ?, ?, ?, ?)
  `);

  // Seed Admin User
  const adminPassword = await bcrypt.hash('admin123', 10);
  const adminId = 'admin-user';
  
  try {
      insertUser.run(adminId, 'Admin User', 'admin@example.com', adminPassword, 'ADMIN');
      console.log('Admin created: admin@example.com / admin123');
  } catch (e) {
      console.log('Admin already exists');
  }

  // Seed Users
  const hashedPassword = await bcrypt.hash('password123', 10);
  const userId = 'user-123';
  
  try {
      insertUser.run(userId, 'Test User', 'test@example.com', hashedPassword, 'USER');
      console.log('User created: test@example.com / password123');
  } catch (e) {
      console.log('User already exists');
  }

  // Seed Courses
  const courses = [
    {
      id: 'ui-fundamentals',
      title: 'UI Design Fundamentals',
      description: 'Master the basics of color, typography, and layout.',
      difficulty: 'Beginner',
      duration: '4 Weeks',
      thumbnail: 'bg-accent-blue',
      price: 'Free',
      category: 'UI Design',
      instructor_name: 'Sarah Drasner',
      instructor_avatar: 'SD'
    },
    {
      id: 'figma-mastery',
      title: 'Figma Mastery: Zero to Hero',
      description: 'Learn Auto Layout, Components, and Prototyping like a pro.',
      difficulty: 'Intermediate',
      duration: '6 Weeks',
      thumbnail: 'bg-black',
      price: '$49',
      category: 'UI Design',
      instructor_name: 'Gary Simon',
      instructor_avatar: 'GS'
    },
    {
      id: 'advanced-prototyping',
      title: 'Advanced Prototyping with Rive',
      description: 'Create interactive animations for web and mobile apps.',
      difficulty: 'Advanced',
      duration: '8 Weeks',
      thumbnail: 'bg-accent-pink',
      price: '$99',
      category: 'Motion',
      instructor_name: 'Bucky Roberts',
      instructor_avatar: 'BR'
    }
  ];

  const insertCourse = db.prepare(`
    INSERT INTO courses (id, title, description, difficulty, duration, thumbnail, price, category, instructor_name, instructor_avatar)
    VALUES (@id, @title, @description, @difficulty, @duration, @thumbnail, @price, @category, @instructor_name, @instructor_avatar)
  `);

  for (const course of courses) {
    insertCourse.run(course);
  }
  console.log(`Seeded ${courses.length} courses`);

  // Seed Challenges
  const challenges = [
    {
      id: 'challenge-1',
      title: 'Redesign a Login Screen',
      description: 'Create a modern, accessible login screen for a fintech app.',
      difficulty: 'Easy',
      points: 50,
      category: 'UI Design'
    },
    {
      id: 'challenge-2',
      title: 'Dashboard Dark Mode',
      description: 'Design a dark mode version of an analytics dashboard.',
      difficulty: 'Medium',
      points: 100,
      category: 'UI Design'
    },
    {
      id: 'challenge-3',
      title: 'Micro-interaction for Like Button',
      description: 'Create a delightful animation for a like button state change.',
      difficulty: 'Hard',
      points: 150,
      category: 'Interaction'
    }
  ];

  const insertChallenge = db.prepare(`
    INSERT INTO challenges (id, title, description, difficulty, points, category)
    VALUES (@id, @title, @description, @difficulty, @points, @category)
  `);

  for (const challenge of challenges) {
    insertChallenge.run(challenge);
  }
  console.log(`Seeded ${challenges.length} challenges`);

  // Seed Tools
  const tools = [
    {
      id: 'tool-1',
      name: 'Contrast Grid',
      description: 'Test many foreground/background color combos for compliance.',
      category: 'Accessibility',
      url: 'https://contrast-grid.eightshapes.com/',
      icon: 'Grid'
    },
    {
      id: 'tool-2',
      name: 'Type Scale',
      description: 'Visual calculator for typographic scale.',
      category: 'Typography',
      url: 'https://type-scale.com/',
      icon: 'Type'
    },
    {
      id: 'tool-3',
      name: 'Coolors',
      description: 'The super fast color palettes generator.',
      category: 'Color',
      url: 'https://coolors.co/',
      icon: 'Palette'
    }
  ];

  const insertTool = db.prepare(`
    INSERT INTO tools (id, name, description, category, url, icon)
    VALUES (@id, @name, @description, @category, @url, @icon)
  `);

  for (const tool of tools) {
    insertTool.run(tool);
  }
  console.log(`Seeded ${tools.length} tools`);

  console.log('Seeding completed!');
}

seed().catch(console.error);
