import { NextResponse } from 'next/server';
import db from '@/lib/db';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import { sendAdminLoginEmail } from '@/lib/email';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-key-change-me');

export async function POST(req: Request) {
  try {
    const { email, password, otp, step = 'login' } = await req.json();

    if (!email || (step === 'login' && !password) || (step === 'verify' && !otp) || (step === 'identify' && !email)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Find user using SQLite
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // New Step: Identification (Sends OTP if staff)
    if (step === 'identify') {
        const staffRoles = ['TUTOR', 'ADMIN', 'SUPER_ADMIN'];
        if (staffRoles.includes(user.role)) {
            const code = Math.floor(100000 + Math.random() * 900000).toString();
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
            const hashedOtp = await bcrypt.hash(code, 10);

            db.prepare('UPDATE users SET otp_code = ?, otp_expires_at = ? WHERE id = ?')
              .run(hashedOtp, expiresAt, user.id);

            await sendAdminLoginEmail(email, code, user.role);
            return NextResponse.json({ success: true, requiresOtp: true });
        }
        return NextResponse.json({ success: true, requiresOtp: false });
    }

    if (step === 'login') {
        // Verify regular password
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Check if role requires OTP (Tutor, Admin, or Super Admin)
        const staffRoles = ['TUTOR', 'ADMIN', 'SUPER_ADMIN'];
        if (staffRoles.includes(user.role)) {
            const code = Math.floor(100000 + Math.random() * 900000).toString();
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 mins
            const hashedOtp = await bcrypt.hash(code, 10);

            db.prepare('UPDATE users SET otp_code = ?, otp_expires_at = ? WHERE id = ?')
              .run(hashedOtp, expiresAt, user.id);

            const emailResult = await sendAdminLoginEmail(email, code, user.role);

            if (!emailResult.success) {
                return NextResponse.json({ 
                    error: 'Failed to send verification email. Please contact support.',
                    details: process.env.NODE_ENV !== 'production' ? emailResult.error : undefined
                }, { status: 500 });
            }

            return NextResponse.json({ 
                success: true, 
                requiresOtp: true,
                message: 'Verification code sent to your email.' 
            });
        }
    } else if (step === 'verify') {
        // Verify OTP
        if (!user.otp_code || !user.otp_expires_at) {
            return NextResponse.json({ error: 'No active verification session' }, { status: 400 });
        }

        if (new Date() > new Date(user.otp_expires_at)) {
            return NextResponse.json({ error: 'Code expired' }, { status: 400 });
        }

        const isOtpValid = await bcrypt.compare(otp, user.otp_code);
        if (!isOtpValid) {
            return NextResponse.json({ error: 'Invalid verification code' }, { status: 401 });
        }

        // Clear OTP after successful use
        db.prepare('UPDATE users SET otp_code = NULL, otp_expires_at = NULL WHERE id = ?')
          .run(user.id);
    }

    // If we reach here, either it was a regular user or OTP was verified
    // Create session
    const token = await new SignJWT({ userId: user.id, email: user.email, role: user.role })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(JWT_SECRET);
    
    // Update last login
    db.prepare('UPDATE users SET last_login = ? WHERE id = ?')
      .run(new Date().toISOString(), user.id);
    
    const response = NextResponse.json({ 
        success: true, 
        user: { name: user.name, email: user.email, role: user.role },
        redirect: user.role === 'SUPER_ADMIN' ? '/super-admin' : user.role === 'ADMIN' ? '/admin' : user.role === 'TUTOR' ? '/tutor-dashboard' : '/profile'
    });
    
    // Set HTTP-only cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
