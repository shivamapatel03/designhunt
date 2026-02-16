import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') || 'courses';

  try {
    let data = [];
    if (type === 'courses') {
        data = db.prepare('SELECT * FROM courses ORDER BY created_at DESC').all();
    } else if (type === 'challenges') {
        data = db.prepare('SELECT * FROM challenges ORDER BY created_at DESC').all();
    } else if (type === 'tools') {
        data = db.prepare('SELECT * FROM tools ORDER BY created_at DESC').all();
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { type } = body; 

        // Simplified creation logic for demo
        if (type === 'course') {
            const { title, description, difficulty, category, price } = body;
            const id = title.toLowerCase().replace(/ /g, '-');
            const insert = db.prepare('INSERT INTO courses (id, title, description, difficulty, category, price) VALUES (?, ?, ?, ?, ?, ?)');
            insert.run(id, title, description, difficulty, category, price);
        }
        
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create content' }, { status: 500 });
    }
}
