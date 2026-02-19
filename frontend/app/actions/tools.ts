"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "tools");

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

async function handleFileUpload(
  icon: File | string | null,
): Promise<string | null> {
  if (!icon || typeof icon === "string") return icon as string;

  if (icon instanceof File && icon.size > 0) {
    const bytes = await icon.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create friendly filename
    const fileName = `${Date.now()}-${icon.name.replace(/\s+/g, "-")}`;
    const filePath = path.join(UPLOAD_DIR, fileName);

    fs.writeFileSync(filePath, buffer);
    return `/uploads/tools/${fileName}`;
  }

  return null;
}

export async function createTool(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const url = formData.get("url") as string;
    const iconFile = formData.get("icon_file") as File | null;
    const iconUrl = formData.get("icon_url") as string;

    let icon = iconUrl;
    if (iconFile && iconFile.size > 0) {
      const uploadedPath = await handleFileUpload(iconFile);
      if (uploadedPath) icon = uploadedPath;
    }

    const id = name.toLowerCase().replace(/[^a-z0-9]/g, "-");

    db.prepare(
      `
      INSERT INTO tools (id, name, description, category, url, icon)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
    ).run(id, name, description, category, url, icon);

    revalidatePath("/admin");
    revalidatePath("/library");
    revalidatePath("/tools");

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to create tool" };
  }
}

export async function updateTool(id: string, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const url = formData.get("url") as string;
    const iconFile = formData.get("icon_file") as File | null;
    const iconUrl = formData.get("icon_url") as string;
    const existingIcon = formData.get("existing_icon") as string;

    let icon = iconUrl || existingIcon;
    if (iconFile && iconFile.size > 0) {
      const uploadedPath = await handleFileUpload(iconFile);
      if (uploadedPath) icon = uploadedPath;
    }

    db.prepare(
      `
            UPDATE tools 
            SET name = ?, description = ?, category = ?, url = ?, icon = ?
            WHERE id = ?
        `,
    ).run(name, description, category, url, icon, id);

    revalidatePath("/admin");
    revalidatePath("/library");
    revalidatePath("/tools");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to update tool" };
  }
}

export async function deleteTool(id: string) {
  try {
    db.prepare("DELETE FROM tools WHERE id = ?").run(id);
    revalidatePath("/admin");
    revalidatePath("/library");
    revalidatePath("/tools");
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
