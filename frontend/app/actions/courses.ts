"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export interface Course {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  duration: string;
  thumbnail: string;
  video_url: string;
  instructor_name: string;
  instructor_avatar: string;
  price: string;
  category: string;
  status: string;
  tutor_id: string;
}

export async function getCourses(
  query?: string,
  category?: string,
): Promise<Course[]> {
  try {
    let sql = "SELECT * FROM courses WHERE status = ?";
    const params: any[] = ["APPROVED"];

    if (query) {
      sql += " AND (title LIKE ? OR description LIKE ?)";
      params.push(`%${query}%`, `%${query}%`);
    }

    if (category && category !== "All") {
      sql += " AND category = ?";
      params.push(category);
    }

    const courses = db.prepare(sql).all(...params) as Course[];
    return courses;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw new Error("Failed to fetch courses");
  }
}

export async function submitCourse(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = formData.get("price") as string;
    const difficulty = formData.get("difficulty") as string;
    const duration = formData.get("duration") as string;
    const category = formData.get("category") as string;
    const video_url = formData.get("video_url") as string;
    const instructor_name = formData.get("instructor_name") as string;
    const tutor_id = formData.get("tutor_id") as string;

    // Fix for SQLite binding error: Ensure thumbnailUrl is a string
    const thumbValue = formData.get("thumbnail");
    let thumbnailUrl = "";

    if (typeof thumbValue === "string") {
      thumbnailUrl = thumbValue;
    } else if (thumbValue && typeof (thumbValue as any).name === "string") {
      // It's a File object, we don't have storage yet, so use a placeholder or just use a default
      thumbnailUrl = "/course-placeholder.jpg";
    } else {
      thumbnailUrl =
        (formData.get("thumbnailUrl") as string) || "/course-placeholder.jpg";
    }

    const id = crypto.randomUUID();

    db.prepare(
      `
      INSERT INTO courses (id, title, description, price, difficulty, duration, category, video_url, instructor_name, tutor_id, thumbnail, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    ).run(
      id,
      title,
      description,
      price,
      difficulty,
      duration,
      category,
      video_url,
      instructor_name,
      tutor_id,
      thumbnailUrl,
      "PENDING",
    );

    // Handle Modules
    const modulesJson = formData.get("modules") as string;
    if (modulesJson) {
      const modules = JSON.parse(modulesJson);
      const insertModule = db.prepare(`
        INSERT INTO modules (id, course_id, title, duration, [order])
        VALUES (?, ?, ?, ?, ?)
      `);

      modules.forEach((mod: any, index: number) => {
        insertModule.run(
          crypto.randomUUID(),
          id,
          mod.title,
          mod.duration,
          index + 1,
        );
      });
    }

    revalidatePath("/tutor-dashboard");
    revalidatePath("/super-admin");
    return { success: true };
  } catch (err: any) {
    console.error("Server Action Error:", err);
    return { error: err.message || "An unexpected error occurred" };
  }
}

export async function updateCoursePrice(id: string, price: string) {
  try {
    db.prepare("UPDATE courses SET price = ? WHERE id = ?").run(price, id);
    revalidatePath("/super-admin");
    revalidatePath("/courses");
    return { success: true };
  } catch (error) {
    console.error("Update Error:", error);
    return { error: "Failed to update price" };
  }
}

import { cache } from "react";

export const getCourseById = cache(async (id: string) => {
  try {
    const course = db
      .prepare("SELECT * FROM courses WHERE id = ?")
      .get(id) as Course;

    if (!course) return null;

    const modules = db
      .prepare("SELECT * FROM modules WHERE course_id = ? ORDER BY [order]")
      .all(id) as any[];

    // Fetch lessons for each module
    const modulesWithLessons = modules.map((mod) => {
      const lessons = db
        .prepare("SELECT * FROM lessons WHERE module_id = ? ORDER BY [order]")
        .all(mod.id);
      return { ...mod, lessons };
    });

    return { ...course, modules: modulesWithLessons };
  } catch (error) {
    console.error("Error fetching course:", error);
    return null;
  }
});
