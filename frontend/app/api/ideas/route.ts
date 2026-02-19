import { NextResponse } from "next/server";
import db from "@/lib/db";
import { useAuth } from "@/components/providers/auth-provider"; // Note: This won't work in route handlers directly, need to check session or cookies

export async function GET() {
  try {
    const ideas = db
      .prepare(
        `
      SELECT * FROM ideas 
      ORDER BY created_at DESC
    `,
      )
      .all();

    return NextResponse.json(ideas);
  } catch (error) {
    console.error("Error fetching community ideas:", error);
    return NextResponse.json(
      { error: "Failed to fetch feed" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const { idea, image, user_id, user_handle, user_avatar } =
      await request.json();

    if (!idea) {
      return NextResponse.json(
        { error: "Idea content is required" },
        { status: 400 },
      );
    }

    const stmt = db.prepare(
      "INSERT INTO ideas (idea, image, user_id, user_handle, user_avatar, name, email) VALUES (?, ?, ?, ?, ?, ?, ?)",
    );

    // Fallback for name/email if not provided in JSON but we have handle
    const name = user_handle || "Anonymous Designer";
    const email = "community@designhunt.com";

    const info = stmt.run(
      idea,
      image || null,
      user_id || null,
      user_handle || null,
      user_avatar || null,
      name,
      email,
    );

    return NextResponse.json({ success: true, id: info.lastInsertRowid });
  } catch (error) {
    console.error("Error submitting idea:", error);
    return NextResponse.json(
      { error: "Failed to submit idea" },
      { status: 500 },
    );
  }
}
