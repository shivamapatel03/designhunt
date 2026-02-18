"use server";

import db from "@/lib/db";

export interface Concept {
  id: string;
  term: string;
  slug: string;
  definition: string;
  content: string;
  category: string;
  widget_type: string;
  visual_example: string;
  related_lesson_id?: string;
}

export async function getConcepts(): Promise<Concept[]> {
  try {
    const concepts = db
      .prepare("SELECT * FROM concepts ORDER BY category, term")
      .all() as Concept[];
    return concepts;
  } catch (error) {
    console.error("Failed to fetch concepts:", error);
    return [];
  }
}

export async function getConceptBySlug(slug: string): Promise<Concept | null> {
  try {
    const concept = db
      .prepare("SELECT * FROM concepts WHERE slug = ?")
      .get(slug) as Concept;
    return concept || null;
  } catch (error) {
    console.error(`Failed to fetch concept ${slug}:`, error);
    return null;
  }
}
