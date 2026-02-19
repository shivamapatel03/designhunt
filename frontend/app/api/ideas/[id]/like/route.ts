import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { user_id } = await request.json();
    const idea_id = parseInt(params.id);

    if (!user_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if like exists
    const existingLike = db
      .prepare("SELECT id FROM idea_likes WHERE user_id = ? AND idea_id = ?")
      .get(user_id, idea_id);

    if (existingLike) {
      // Unlike
      db.prepare(
        "DELETE FROM idea_likes WHERE user_id = ? AND idea_id = ?",
      ).run(user_id, idea_id);
      db.prepare(
        "UPDATE ideas SET likes_count = likes_count - 1 WHERE id = ?",
      ).run(idea_id);
      return NextResponse.json({ success: true, action: "unliked" });
    } else {
      // Like
      db.prepare("INSERT INTO idea_likes (user_id, idea_id) VALUES (?, ?)").run(
        user_id,
        idea_id,
      );
      db.prepare(
        "UPDATE ideas SET likes_count = likes_count + 1 WHERE id = ?",
      ).run(idea_id);
      return NextResponse.json({ success: true, action: "liked" });
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    return NextResponse.json(
      { error: "Failed to update like" },
      { status: 500 },
    );
  }
}
