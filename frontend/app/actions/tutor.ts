'use server';

import db from '@/lib/db';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-key-change-me');

async function getUserId() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return null;
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload.userId as string;
    } catch {
        return null;
    }
}

export async function getTutorDashboardData() {
    const userId = await getUserId();
    if (!userId) return { error: 'Unauthorized' };

    try {
        // Fetch courses owned by this tutor with student counts
        const courses = db.prepare(`
            SELECT c.*, COUNT(e.id) as student_count 
            FROM courses c
            LEFT JOIN enrollments e ON c.id = e.course_id
            WHERE c.tutor_id = ?
            GROUP BY c.id
        `).all(userId) as any[];

        const totalStudents = courses.reduce((sum, c) => sum + (c.student_count || 0), 0);

        return {
            courses: courses || [],
            stats: {
                totalStudents,
                activeCourses: courses.length || 0,
                rating: 4.8, // Placeholder
                revenue: '$0' // Placeholder
            }
        };
    } catch (error) {
        console.error('Tutor Dashboard Data Error:', error);
        return { error: 'Failed to fetch dashboard data' };
    }
}

export async function getTutorApplicationStatus() {
    const userId = await getUserId();
    if (!userId) return null;

    try {
        const data = db.prepare('SELECT * FROM tutor_requests WHERE user_id = ? ORDER BY created_at DESC LIMIT 1').get(userId);
        return data || null;
    } catch (error) {
        console.error('Fetch Application Status Error:', error);
        return null;
    }
}
