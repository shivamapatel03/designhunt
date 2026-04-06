'use server';

import db from '@/lib/db';

export async function getLatestIdeas(limit = 10) {
    try {
        const ideas = db.prepare(`
            SELECT * FROM ideas 
            ORDER BY created_at DESC 
            LIMIT ?
        `).all(limit) as any[];

        return ideas || [];
    } catch (error) {
        console.error('Failed to fetch latest ideas:', error);
        return [];
    }
}
