import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { user_id } = await request.json();
    const idea_id = parseInt(params.id);

    if (!user_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check ownership
    const idea = db
      .prepare("SELECT user_id FROM ideas WHERE id = ?")
      .get(idea_id) as any;

    if (!idea) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 });
    }

    if (idea.user_id !== user_id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete associated data first (though cascading should handle it)
    db.prepare("DELETE FROM idea_likes WHERE idea_id = ?").run(idea_id);
    db.prepare("DELETE FROM idea_comments WHERE idea_id = ?").run(idea_id);
    db.prepare("DELETE FROM ideas WHERE id = ?").run(idea_id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting idea:", error);
    return NextResponse.json(
      { error: "Failed to delete idea" },
      { status: 500 },
    );
  }
}
