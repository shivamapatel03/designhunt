import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const courses = db.prepare('SELECT * FROM courses').all() as any[];

    const formattedCourses = courses.map((course: any) => ({
      id: course.id,
      title: course.title,
      description: course.description,
      difficulty: course.difficulty,
      duration: course.duration,
      thumbnail: course.thumbnail,
      video_url: course.video_url,
      instructor: {
        name: course.instructor_name,
        avatar: course.instructor_avatar
      },
      price: course.price,
      category: course.category,
      status: course.status
    }));

    return NextResponse.json(formattedCourses);
  } catch (error) {
    console.error('SQLite Error:', error);
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
  }
}
