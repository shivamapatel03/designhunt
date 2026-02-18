"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createTool(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const url = formData.get("url") as string;
    const icon = formData.get("icon") as string;

    const id = name.toLowerCase().replace(/[^a-z0-9]/g, "-");

    db.prepare(
      `
      INSERT INTO tools (id, name, description, category, url, icon)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
    ).run(id, name, description, category, url, icon);

    revalidatePath("/admin");
    revalidatePath("/library");

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to create tool" };
  }
}

export async function deleteTool(id: string) {
  try {
    db.prepare("DELETE FROM tools WHERE id = ?").run(id);
    revalidatePath("/admin");
    revalidatePath("/library");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to delete tool" };
  }
}

export async function getTools() {
  try {
    const tools = db
      .prepare(
        `
        SELECT * FROM tools ORDER BY created_at DESC
    `,
      )
      .all();
    return tools;
  } catch (error) {
    console.error(error);
    return [];
  }
}
