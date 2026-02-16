import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const tools = db.prepare("SELECT * FROM tools ORDER BY category ASC").all();
    return NextResponse.json(tools);
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Failed to fetch tools' }, { status: 500 });
  }
}
