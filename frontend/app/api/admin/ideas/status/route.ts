import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json(
        { error: "Missing ID or status" },
        { status: 400 },
      );
    }

    const validStatuses = [
      "pending",
      "reviewed",
      "approved",
      "under_process",
      "implemented",
      "rejected",
    ];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const stmt = db.prepare(
      "UPDATE ideas SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
    );
    const info = stmt.run(status, id);

    if (info.changes === 0) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating idea status:", error);
    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 },
    );
  }
}
