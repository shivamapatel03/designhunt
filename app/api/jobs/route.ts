import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const jobs = db.prepare('SELECT * FROM jobs').all().map((job: any) => ({
      ...job,
      tags: JSON.parse(job.tags)
    }));

    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}
