import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import db from '@/lib/db';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-key-change-me');

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json({ progress: [] });
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    const progress = db.prepare(`
      SELECT up.*, c.title as course_title, c.thumbnail as course_thumbnail 
      FROM user_progress up
      JOIN courses c ON up.course_id = c.id
      WHERE up.user_id = ?
    `).all(payload.userId);

    return NextResponse.json(progress);
  } catch (error) {
    return NextResponse.json({ progress: [] });
  }
}

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const { courseId, moduleId, status } = await req.json();

    const insert = db.prepare(`
      INSERT INTO user_progress (id, user_id, course_id, module_id, status, completed_at)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET status = ?, completed_at = ?
    `);

    const id = `${payload.userId}-${courseId}-${moduleId || 'general'}`;
    const now = status === 'completed' ? new Date().toISOString() : null;

    insert.run(id, payload.userId, courseId, moduleId, status, now, status, now);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 });
  }
}
