import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import db from '@/lib/db';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-key-change-me');

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.userId as string;

    // Check if already applied
    const existing = db.prepare('SELECT id FROM tutor_requests WHERE user_id = ? AND status = ?').get(userId, 'PENDING');

    if (existing) {
        return NextResponse.json({ error: 'You already have a pending application.' }, { status: 400 });
    }

    const { name, expertise, portfolio, bio } = await req.json();

    // Get email from user
    const user = db.prepare('SELECT email FROM users WHERE id = ?').get(userId) as any;
    
    if (!user) {
        return NextResponse.json({ error: 'User account not recognized. Please relog.' }, { status: 404 });
    }

    const requestId = crypto.randomUUID();

    db.prepare(`
        INSERT INTO tutor_requests (id, user_id, name, role, email, portfolio, expertise, bio, status, stage)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
        requestId,
        userId,
        name,
        'Tutor Candidate',
        user.email,
        portfolio,
        expertise,
        bio,
        'PENDING',
        'REVIEW'
    );

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Tutor Application Error:', error);
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
  }
}
