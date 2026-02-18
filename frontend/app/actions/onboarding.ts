"use server";

import db from "@/lib/db";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { revalidatePath } from "next/cache";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default-secret-key-change-me",
);

export async function updateAvatar(avatar: string) {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return { error: "Unauthorized" };
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.userId as string;

    if (!userId) {
      return { error: "Invalid token" };
    }

    // Update user avatar only
    const stmt = db.prepare("UPDATE users SET avatar = ? WHERE id = ?");
    stmt.run(avatar, userId);

    return { success: true };
  } catch (error) {
    console.error("Update Avatar Error:", error);
    return { error: "Failed to update avatar" };
  }
}

export async function updateSkills(skills: string[]) {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return { error: "Unauthorized" };
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.userId as string;

    if (!userId) {
      return { error: "Invalid token" };
    }

    // Update user skills and mark onboarding as completed
    const stmt = db.prepare(
      "UPDATE users SET skills = ?, onboarding_completed = 1 WHERE id = ?",
    );
    stmt.run(JSON.stringify(skills), userId);

    // Revalidate paths
    revalidatePath("/");
    revalidatePath("/profile");

    return { success: true };
  } catch (error) {
    console.error("Update Skills Error:", error);
    return { error: "Failed to update skills" };
  }
}
