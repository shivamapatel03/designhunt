import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { ids } = await request.json();

    if (!ids || !Array.isArray(ids)) {
      return NextResponse.json(
        { error: "Invalid or missing IDs" },
        { status: 400 },
      );
    }

    if (ids.length === 0) {
      return NextResponse.json({ success: true, count: 0 });
    }

    const placeholders = ids.map(() => "?").join(",");
    const stmt = db.prepare(`DELETE FROM ideas WHERE id IN (${placeholders})`);
    const info = stmt.run(...ids);

    return NextResponse.json({ success: true, count: info.changes });
  } catch (error) {
    console.error("Error deleting ideas:", error);
    return NextResponse.json(
      { error: "Failed to delete ideas" },
      { status: 500 },
    );
  }
}
