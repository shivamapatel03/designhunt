"use server";

import db from "@/lib/db";

import { cache } from "react";

export const getUserStats = cache(async () => {
  try {
    // Get total count
    const countResult = db
      .prepare("SELECT COUNT(*) as count FROM users")
      .get() as { count: number };
    const totalUsers = countResult.count;

    // Get recent 4 users with avatars (if available) or initials
    // We prioritize users with avatars, then fall back to any recent users
    const recentUsers = db
      .prepare(
        `
      SELECT name, avatar 
      FROM users 
      WHERE avatar IS NOT NULL 
      ORDER BY created_at DESC 
      LIMIT 4
    `,
      )
      .all() as { name: string; avatar: string }[];

    // If not enough users with avatars, fill with others (optional, for now just returns what we have)
    // In a real app we might mix them or use placeholders

    return {
      count: totalUsers,
      recentUsers,
    };
  } catch (error) {
    console.error("Failed to fetch user stats:", error);
    return { count: 0, recentUsers: [] };
  }
});

export const getTopCreators = cache(async (limit = 5) => {
  try {
    const creators = db.prepare(`
      SELECT 
        u.id, 
        u.name, 
        u.username as handle, 
        u.avatar, 
        COUNT(i.id) as ideas_count, 
        SUM(i.likes_count) as total_likes
      FROM users u
      LEFT JOIN ideas i ON u.id = i.user_id
      GROUP BY u.id
      HAVING ideas_count > 0
      ORDER BY total_likes DESC, ideas_count DESC
      LIMIT ?
    `).all(limit) as {
      id: string;
      name: string;
      handle: string;
      avatar: string;
      ideas_count: number;
      total_likes: number;
    }[];
    
    return creators;
  } catch (error) {
    console.error("Failed to fetch top creators:", error);
    return [];
  }
});
