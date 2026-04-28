'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function updateTutorStage(requestId: string, newStage: string) {
    try {
        db.prepare('UPDATE tutor_requests SET stage = ?, updated_at = ? WHERE id = ?')
          .run(newStage, new Date().toISOString(), requestId);
        revalidatePath('/super-admin');
        return { success: true };
    } catch (error) {
        return { error: 'Failed to update stage' };
    }
}

export async function approveTutorRequest(requestId: string) {
    try {
        const request = db.prepare('SELECT * FROM tutor_requests WHERE id = ?').get(requestId) as any;
        if (!request) throw new Error('Request not found');

        // Update user role
        db.prepare('UPDATE users SET role = ? WHERE id = ?').run('TUTOR', request.user_id);

        // Update request status and stage
        db.prepare('UPDATE tutor_requests SET status = ?, stage = ?, updated_at = ? WHERE id = ?')
          .run('APPROVED', 'ONBOARDING', new Date().toISOString(), requestId);

        revalidatePath('/super-admin');
        return { success: true, email: request.email };
    } catch (error) {
        console.error('Approval Error:', error);
        return { error: 'Failed to approve request' };
    }
}

export async function declineTutorRequest(requestId: string) {
    try {
        db.prepare('UPDATE tutor_requests SET status = ?, updated_at = ? WHERE id = ?')
          .run('DECLINED', new Date().toISOString(), requestId);
        revalidatePath('/super-admin');
        return { success: true };
    } catch (error) {
        return { error: 'Failed to decline' };
    }
}

export async function approveCourse(courseId: string) {
    try {
        db.prepare('UPDATE courses SET status = ? WHERE id = ?').run('APPROVED', courseId);
        revalidatePath('/super-admin');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        return { error: 'Failed to approve course' };
    }
}

export async function rejectCourse(courseId: string) {
    try {
        db.prepare('UPDATE courses SET status = ? WHERE id = ?').run('REJECTED', courseId);
        revalidatePath('/super-admin');
        return { success: true };
    } catch (error) {
        return { error: 'Failed' };
    }
}

export async function getPendingCourses() {
    const courses = db.prepare('SELECT * FROM courses WHERE status = ?').all('PENDING');
    return courses || [];
}

export async function getSystemStats() {
    try {
        const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get() as any;
        const totalTrainers = db.prepare('SELECT COUNT(*) as count FROM users WHERE role = ?').get('TUTOR') as any;
        const pendingVerifications = db.prepare('SELECT COUNT(*) as count FROM tutor_requests WHERE status = ?').get('PENDING') as any;

        const totalAdmins = db.prepare('SELECT COUNT(*) as count FROM users WHERE role IN (?, ?)').get('ADMIN', 'SUPER_ADMIN') as any;

        return {
            totalUsers: totalUsers?.count || 0,
            activeUsers: totalUsers?.count || 0,
            totalTrainers: totalTrainers?.count || 0,
            pendingVerifications: pendingVerifications?.count || 0,
            totalAdmins: totalAdmins?.count || 0,
            activeAdmins: totalAdmins?.count || 0
        };
    } catch (error) {
        return { totalUsers: 0, activeUsers: 0, totalTrainers: 0, pendingVerifications: 0 };
    }
}

export async function updateUserRole(userId: string, newRole: string) {
    try {
        db.prepare('UPDATE users SET role = ? WHERE id = ?').run(newRole, userId);
        revalidatePath('/super-admin');
        revalidatePath('/admin');
        return { success: true };
    } catch (error) {
        console.error('Update Role Error:', error);
        return { error: 'Failed to update user role' };
    }
}
