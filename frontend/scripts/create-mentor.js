const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const path = require('path');

const dbPath = path.join(process.cwd(), 'designhunt_v2.db');
const db = new Database(dbPath);

async function createMentor() {
  const email = 'mentor@designhunt.com';
  const password = 'password123';
  const role = 'TUTOR';
  const name = 'Design Mentor';

  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = crypto.randomUUID();

  try {
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);

    if (existingUser) {
      db.prepare('UPDATE users SET role = ?, password = ? WHERE email = ?')
        .run(role, hashedPassword, email);
      console.log(`Updated existing account: ${email}`);
    } else {
      db.prepare('INSERT INTO users (id, email, password, name, role) VALUES (?, ?, ?, ?, ?)')
        .run(userId, email, hashedPassword, name, role);
      console.log(`Created new mentor account: ${email}`);
    }
    console.log(`Password: ${password}`);
  } catch (error) {
    console.error('Error:', error);
  }
}

createMentor();
