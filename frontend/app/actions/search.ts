"use server";

import db from "@/lib/db";

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  type: "theory" | "idea" | "person" | "page";
  url: string;
}

const STATIC_PAGES = [
  { id: "page-library", title: "Library", description: "Design resources, UI kits, colors, and more", url: "/library" },
  { id: "page-theory", title: "Theory", description: "Learn color theory, typography, UX laws", url: "/theory" },
  { id: "page-critique", title: "Critique", description: "AI-powered design critique and improvements", url: "/critique" },
  { id: "page-tools", title: "Tools", description: "Handy design tools and generators", url: "/tools" },
  { id: "page-community", title: "Community Ideas", description: "Explore ideas from other designers", url: "/ideas" },
  { id: "page-icons", title: "Icons Library", description: "Download premium icons for your projects", url: "/library/icons" },
  { id: "page-color", title: "Color Palette", description: "Explore and pick beautiful color palettes", url: "/library/colors" },
  { id: "page-animations", title: "Animations", description: "Framer motion and CSS animation snippets", url: "/library/animations" },
];

export async function searchEverything(query: string): Promise<SearchResult[]> {
  if (!query || query.length < 2) return [];

  const lowerQuery = query.toLowerCase();
  const searchTerm = `%${query}%`;
  const results: SearchResult[] = [];

  try {
    // 0. Search Static Pages
    const matchedPages = STATIC_PAGES.filter(p => 
      p.title.toLowerCase().includes(lowerQuery) || 
      p.description.toLowerCase().includes(lowerQuery)
    );
    
    matchedPages.forEach(p => {
      results.push({
        id: p.id,
        title: p.title,
        description: p.description,
        thumbnail: null,
        type: "page",
        url: p.url
      });
    });

    // 1. Search Theory Modules (Courses)
    const courses = db.prepare(`
      SELECT id, title, description, thumbnail, category 
      FROM courses 
      WHERE (title LIKE ? OR description LIKE ?) AND status = 'APPROVED'
      LIMIT 10
    `).all(searchTerm, searchTerm) as any[];

    courses.forEach(c => {
      results.push({
        id: c.id,
        title: c.title,
        description: c.description || "",
        thumbnail: c.thumbnail || null,
        type: "theory",
        url: `/theory/${c.id}`
      });
    });

    // 2. Search Community Ideas
    const ideas = db.prepare(`
      SELECT id, name, idea, image 
      FROM ideas 
      WHERE (name LIKE ? OR idea LIKE ?)
      LIMIT 10
    `).all(searchTerm, searchTerm) as any[];

    ideas.forEach(i => {
      results.push({
        id: i.id.toString(),
        title: i.name,
        description: i.idea || "",
        thumbnail: i.image || null,
        type: "idea",
        url: `/ideas/${i.id}`
      });
    });

    // 3. Search Users (Designers)
    const users = db.prepare(`
      SELECT id, name, username, avatar 
      FROM users 
      WHERE (name LIKE ? OR username LIKE ?)
      LIMIT 10
    `).all(searchTerm, searchTerm) as any[];

    users.forEach(u => {
      results.push({
        id: u.id,
        title: u.name || u.username,
        description: `@${u.username}`,
        thumbnail: u.avatar || null,
        type: "person",
        url: `/profile/${u.username}`
      });
    });

    return results;
  } catch (error) {
    console.error("Search error:", error);
    return [];
  }
}
