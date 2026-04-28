"use server";

import db from "@/lib/db";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { revalidatePath } from "next/cache";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "designhunt_secret_key_123",
);

export async function updateOnboardingData(data: Record<string, any>) {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) return { error: "Unauthorized" };

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.userId as string;
    if (!userId) return { error: "Invalid token" };

    const allowedFields = [
        'goal', 
        'skill_level', 
        'topics_to_learn', 
        'daily_goal', 
        'motivation', 
        'onboarding_completed', 
        'avatar'
    ];
    
    const fieldsToUpdate = Object.keys(data).filter(f => allowedFields.includes(f));

    if (fieldsToUpdate.length === 0) return { error: "No valid fields to update" };

    const setClause = [...fieldsToUpdate, 'current_streak', 'total_xp', 'last_active_date'].map(f => `${f} = ?`).join(', ');
    const today = new Date().toISOString().split('T')[0];
    const values = [
        ...fieldsToUpdate.map(f => {
            const val = data[f];
            if (val === undefined) return null;
            if (typeof val === 'boolean') return val ? 1 : 0;
            return typeof val === 'object' ? JSON.stringify(val) : val;
        }),
        1, // current_streak
        0, // total_xp
        today // last_active_date
    ];

    const stmt = db.prepare(`UPDATE users SET ${setClause} WHERE id = ?`);
    stmt.run(...values, userId);

    revalidatePath("/");
    revalidatePath("/profile");

    return { success: true };
  } catch (error) {
    console.error("Onboarding Action Error:", error);
    return { error: "Failed to update onboarding progress" };
  }
}
