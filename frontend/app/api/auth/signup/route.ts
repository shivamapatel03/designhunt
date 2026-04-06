import { NextResponse } from 'next/server';
import db from '@/lib/db';
import redis from '@/lib/redis';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if user exists
    const existingUser = db.prepare('SELECT email FROM users WHERE email = ?').get(email);

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Check if name (Identification) is unique
    const existingName = db.prepare('SELECT id FROM users WHERE name = ?').get(name);
    if (existingName) {
      return NextResponse.json({ error: 'username already exists make new' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = crypto.randomUUID();
    
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes

    // Insert user without OTP since we store OTP in Redis
    db.prepare('INSERT INTO users (id, email, password, name, email_verified) VALUES (?, ?, ?, ?, 0)')
      .run(userId, email, hashedPassword, name);

    // Store OTP in Redis (expires in 600 seconds = 10 minutes)
    await redis.set(`otp:${email}`, otp, 'EX', 600);

    // Send verification email
    const emailRes = await sendVerificationEmail(email, otp);

    if (!emailRes.success) {
       console.error("Failed to send email", emailRes.error);
       // We still proceed so user can try resending later or checking spam
    }

    // Return success without session (user must verify first)
    return NextResponse.json({ 
        success: true, 
        redirect: `/verify-email?email=${encodeURIComponent(email)}` 
    });

  } catch (error) {
    console.error('Signup Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
    return NextResponse.json({ error: 'Method not allowed. Please use POST to sign up.' }, { status: 405 });
}
