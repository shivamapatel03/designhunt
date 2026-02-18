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
