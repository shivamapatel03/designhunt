'use server';

import db from '@/lib/db';

export async function getExpertReviews() {
    try {
        const reviews = db.prepare(`SELECT * FROM expert_reviews ORDER BY created_at DESC`).all() as any[];
        return reviews || [];
    } catch (error) {
        console.error('Failed to fetch expert reviews:', error);
        return [];
    }
}
