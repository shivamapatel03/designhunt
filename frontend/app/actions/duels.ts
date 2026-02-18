"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createDuel(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const date = formData.get("date") as string;
    const category = formData.get("category") as string;

    const option_a_label = formData.get("option_a_label") as string;
    const option_a_image = formData.get("option_a_image") as string;

    const option_b_label = formData.get("option_b_label") as string;
    const option_b_image = formData.get("option_b_image") as string;

    const id = crypto.randomUUID();

    db.prepare(
      `
      INSERT INTO daily_duels (id, title, description, date, category, option_a_label, option_a_image, option_b_label, option_b_image)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    ).run(
      id,
      title,
      description,
      date,
      category,
      option_a_label,
      option_a_image,
      option_b_label,
      option_b_image,
    );

    revalidatePath("/admin");
    revalidatePath("/"); // Update home page if it's today's duel

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to create duel" };
  }
}

export async function getAdminDuels() {
  try {
    const duels = db
      .prepare(
        `
        SELECT * FROM daily_duels ORDER BY date DESC
    `,
      )
      .all();
    return duels;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function deleteDuel(id: string) {
  try {
    db.prepare("DELETE FROM daily_duels WHERE id = ?").run(id);
    db.prepare("DELETE FROM duel_votes WHERE duel_id = ?").run(id); // Cascade delete votes
    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to delete duel" };
  }
}
