import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const courses = db.prepare('SELECT * FROM courses').all();
    return NextResponse.json(courses);
  } catch (error) {
    console.error('SQLite Error:', error);
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
  }
}
