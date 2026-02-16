import { NextResponse, NextRequest } from "next/server";
import db from "@/lib/db";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-key-change-me');

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (payload.role !== 'TUTOR' && payload.role !== 'SUPER_ADMIN' && payload.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Permission denied. Only Tutors can create courses.' }, { status: 403 });
    }

    const userId = payload.userId as string;
    const body = await req.json();
    const { title, description, price, difficulty, duration, thumbnail, video_url, category } = body;

    // Get instructor info from user table
    const user = db.prepare('SELECT name, avatar FROM users WHERE id = ?').get(userId) as any;

    const id = crypto.randomUUID();
    const stmt = db.prepare(`
      INSERT INTO courses (id, title, description, price, difficulty, duration, thumbnail, video_url, instructor_name, instructor_avatar, tutor_id, category, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING')
    `);

    stmt.run(
        id, 
        title, 
        description, 
        price || 'Free', 
        difficulty, 
        duration, 
        thumbnail, 
        video_url, 
        user.name, 
        user.avatar, 
        userId, 
        category,
        'PENDING'
    );

    return NextResponse.json({ success: true, courseId: id });

  } catch (error) {
    console.error('Course Creation Error:', error);
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 });
  }
}
