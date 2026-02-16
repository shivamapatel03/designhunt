import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const challenges = db.prepare("SELECT * FROM challenges ORDER BY difficulty ASC").all();
    return NextResponse.json(challenges);
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Failed to fetch challenges' }, { status: 500 });
  }
}
