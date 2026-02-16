import { NextResponse, NextRequest } from "next/server";
import db from "@/lib/db";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-key-change-me');

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.userId as string;

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as any;
    
    // Fetch enrollments
    const enrollments = db.prepare(`
      SELECT e.*, c.title, c.thumbnail, c.difficulty 
      FROM enrollments e 
      JOIN courses c ON e.course_id = c.id 
      WHERE e.user_id = ?
    `).all(userId);

    const tutorRequest = db.prepare('SELECT status FROM tutor_requests WHERE user_id = ?').get(userId) as any;

    const userProfile = {
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        tutor_request_status: tutorRequest?.status || null,
        handle: user.username ? `@${user.username}` : `@${user.name.toLowerCase().replace(/\s+/g, '')}`,
        avatar: user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200", 
        level: 1, 
        xp: 0,
        nextLevelXp: 1000,
        stats: {
          challenges_completed: 0,
          sprints_won: 0,
          theory_mastered: 0
        },
        bio: user.bio || "Design enthusiast.",
        skills: user.skills ? JSON.parse(user.skills) : []
      },
      history: [],
      enrollments: enrollments,
      badges: []
    };

    return NextResponse.json(userProfile);
  } catch (error) {
    console.error('Profile Error:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}
