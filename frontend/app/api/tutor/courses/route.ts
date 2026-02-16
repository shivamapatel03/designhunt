import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-key-change-me');

export async function GET(req: Request) {
    try {
        const token = (await cookies()).get('token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const { payload } = await jwtVerify(token, JWT_SECRET);
        const userId = payload.userId as string;

        // Fetch courses for this tutor
        const courses = db.prepare('SELECT * FROM courses WHERE tutor_id = ? ORDER BY created_at DESC').all(userId) as any[];
        
        // Enrich with enrollment counts
        const enrichedCourses = courses.map((course: any) => {
            const studentCount = db.prepare('SELECT COUNT(*) as count FROM enrollments WHERE course_id = ?').get(course.id) as any;
            return {
                ...course,
                studentCount: studentCount?.count || 0
            };
        });

        return NextResponse.json(enrichedCourses);

    } catch (error) {
        console.error('Tutor Courses Fetch Error:', error);
        return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const token = (await cookies()).get('token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const { payload } = await jwtVerify(token, JWT_SECRET);
        const userId = payload.userId as string;

        // Fetch instructor name
        const user = db.prepare('SELECT name FROM users WHERE id = ?').get(userId) as any;
        const instructorName = user?.name || 'Instructor';
        
        const data = await req.json();
        const courseId = crypto.randomUUID();
        
        db.prepare(`
            INSERT INTO courses (id, title, description, price, difficulty, duration, category, video_url, instructor_name, tutor_id, thumbnail, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            courseId,
            data.title,
            data.description,
            data.price,
            data.difficulty,
            data.duration,
            data.category,
            data.video_url,
            instructorName,
            userId,
            data.thumbnail || '',
            'PENDING'
        );

        const newCourse = db.prepare('SELECT * FROM courses WHERE id = ?').get(courseId);

        return NextResponse.json({ success: true, course: newCourse });

    } catch (error) {
        console.error('Create Course Error:', error);
        return NextResponse.json({ error: 'Failed to create course' }, { status: 500 });
    }
}
