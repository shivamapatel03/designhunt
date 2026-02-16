import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-key-change-me');

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: 'Missing email or OTP' }, { status: 400 });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.email_verified) {
         return NextResponse.json({ success: true, redirect: '/onboarding' });
    }

    // Verify OTP
    const now = new Date().toISOString();
    if (user.otp_code !== otp || user.otp_expires_at < now) {
      return NextResponse.json({ error: 'Invalid or expired code' }, { status: 400 });
    }

    // Mark as verified
    db.prepare('UPDATE users SET email_verified = 1, otp_code = NULL, otp_expires_at = NULL WHERE id = ?').run(user.id);

    // Create Session
    const token = await new SignJWT({ userId: user.id, email: user.email, role: user.role })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(JWT_SECRET);

    const response = NextResponse.json({ success: true, redirect: '/onboarding' });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Verify Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
