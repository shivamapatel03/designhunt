"use server";

import db from "@/lib/db";

export interface Concept {
    id: string;
    term: string;
    definition: string;
    visual_example?: string;
    related_lesson_id?: string;
}

export async function getConcepts(): Promise<Concept[]> {
    try {
        const concepts = db.prepare('SELECT * FROM concepts').all() as Concept[];
        return concepts;
    } catch (error) {
        console.error('Error fetching concepts:', error);
        return [];
    }
}
