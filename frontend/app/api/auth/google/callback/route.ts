import { NextResponse, NextRequest } from 'next/server';
import db from '@/lib/db';
import { SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-key-change-me');

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  const error = req.nextUrl.searchParams.get('error');

  if (error || !code) {
    return NextResponse.redirect(new URL('/login?error=google_auth_failed', req.url));
  }

  try {
    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID || '',
        client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
    });

    const tokens = await tokenResponse.json();

    if (!tokens.access_token) {
      throw new Error('No access token');
    }

    // Get user info
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    const googleUser = await userResponse.json();

    if (!googleUser.email) {
      throw new Error('No email found in Google profile');
    }

    // Check if user exists
    let user = db.prepare('SELECT * FROM users WHERE email = ?').get(googleUser.email) as any;

    if (!user) {
      // Create new user
      const userId = crypto.randomUUID();
      const insert = db.prepare('INSERT INTO users (id, email, name, role) VALUES (?, ?, ?, ?)');
      insert.run(userId, googleUser.email, googleUser.name, 'USER');
      user = { id: userId, email: googleUser.email, role: 'USER', name: googleUser.name };
    }

    // Create session
    const token = await new SignJWT({ userId: user.id, email: user.email, role: user.role })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(JWT_SECRET);

    const response = NextResponse.redirect(
      new URL(user.onboarding_completed ? '/profile' : '/onboarding', req.url)
    );
    
    // Set HTTP-only cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return response;

  } catch (err) {
    console.error('Google Auth Error:', err);
    return NextResponse.redirect(new URL('/login?error=google_auth_error', req.url));
  }
}
