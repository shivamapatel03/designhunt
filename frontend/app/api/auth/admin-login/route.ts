import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import { Pool } from 'pg';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'design-hunt-secret-key-12345');

// Rate limiter (in-memory)
const loginAttempts = new Map<string, { count: number; lockedUntil: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

// Postgres pool — same DB as Express backend
const pool = new Pool({
  connectionString: process.env.DATABASE_URL?.startsWith('file:')
    ? undefined
    : process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function POST(req: Request) {
  try {
    const { email, password, masterKey } = await req.json();

    if (!email || !password || !masterKey) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    // Check rate limit
    const attempts = loginAttempts.get(email);
    if (attempts && attempts.lockedUntil > Date.now()) {
      const minutesLeft = Math.ceil((attempts.lockedUntil - Date.now()) / 60000);
      return NextResponse.json(
        { message: `Too many failed attempts. Try again in ${minutesLeft} minute(s).` },
        { status: 429 }
      );
    }

    const recordFailure = () => {
      const current = loginAttempts.get(email) || { count: 0, lockedUntil: 0 };
      current.count += 1;
      if (current.count >= MAX_ATTEMPTS) current.lockedUntil = Date.now() + LOCKOUT_MS;
      loginAttempts.set(email, current);
    };

    // 1. Verify Master Key against ENV — never hits the DB
    const envKey = process.env.SUPER_ADMIN_MASTER_KEY || '';
    if (!envKey || masterKey !== envKey) {
      recordFailure();
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // 2. Look up user in Postgres
    let user: any = null;
    try {
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      user = result.rows[0];
    } catch (dbErr) {
      console.error('DB error:', dbErr);
      return NextResponse.json({ message: 'Database error' }, { status: 500 });
    }

    if (!user) {
      recordFailure();
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // 3. Must be SUPER_ADMIN
    if (user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ message: 'Unauthorized access' }, { status: 403 });
    }

    // 4. Verify password
    const isValid = user.password ? await bcrypt.compare(password, user.password) : false;
    if (!isValid) {
      recordFailure();
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // ✅ All 3 factors verified
    loginAttempts.delete(email);

    // Issue JWT
    const token = await new SignJWT({ userId: user.id, email: user.email, role: user.role })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('8h')
      .sign(JWT_SECRET);

    const { password: _, otp_code: __, ...safeUser } = user;

    const response = NextResponse.json({
      user: safeUser,
      message: 'Login successful',
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 8 * 60 * 60, // 8 hours
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Admin Login Error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
