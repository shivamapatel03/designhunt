import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as any;
    const courseCount = db.prepare('SELECT COUNT(*) as count FROM courses').get() as any;
    const requestCount = db.prepare('SELECT COUNT(*) as count FROM tutor_requests').get() as any;

    return NextResponse.json({
        users: userCount?.count || 0,
        courses: courseCount?.count || 0,
        tools: 0, // Placeholder
        challenges: 0, // Placeholder or pull from challenges table if needed
        submissions: requestCount?.count || 0
    });
  } catch (error) {
    console.error('Admin Stats Error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
