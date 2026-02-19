import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const idea_id = parseInt(params.id);
    const comments = db
      .prepare(
        "SELECT * FROM idea_comments WHERE idea_id = ? ORDER BY created_at DESC",
      )
      .all(idea_id);

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 },
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { user_id, user_handle, user_avatar, content } = await request.json();
    const idea_id = parseInt(params.id);

    if (!user_id || !content) {
      return NextResponse.json(
        { error: "Unauthorized or missing content" },
        { status: 400 },
      );
    }

    const stmt = db.prepare(
      "INSERT INTO idea_comments (idea_id, user_id, user_handle, user_avatar, content) VALUES (?, ?, ?, ?, ?)",
    );
    const info = stmt.run(idea_id, user_id, user_handle, user_avatar, content);

    // Increment comment count
    db.prepare(
      "UPDATE ideas SET comments_count = comments_count + 1 WHERE id = ?",
    ).run(idea_id);

    return NextResponse.json({ success: true, id: info.lastInsertRowid });
  } catch (error) {
    console.error("Error posting comment:", error);
    return NextResponse.json(
      { error: "Failed to post comment" },
      { status: 500 },
    );
  }
}
