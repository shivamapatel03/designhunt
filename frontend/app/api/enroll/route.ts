import { NextResponse, NextRequest } from 'next/server';
import db from '@/lib/db';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-key-change-me');

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.userId as string;

    // Check if user exists (handle stale sessions from DB resets)
    const userExists = db.prepare('SELECT 1 FROM users WHERE id = ?').get(userId);
    if (!userExists) {
        const response = NextResponse.json({ error: 'User not found' }, { status: 401 });
        response.cookies.delete('token');
        return response;
    }
    
    const { courseId } = await req.json();

    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }

    // Check if already enrolled
    const existing = db.prepare('SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?').get(userId, courseId);
    if (existing) {
       return NextResponse.json({ message: 'Already enrolled' }, { status: 200 });
    }

    const id = crypto.randomUUID();
    const insert = db.prepare('INSERT INTO enrollments (id, user_id, course_id) VALUES (?, ?, ?)');
    insert.run(id, userId, courseId);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Enrollment Error:', error);
    return NextResponse.json({ error: 'Failed to enroll' }, { status: 500 });
  }
}
