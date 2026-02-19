import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const ideas = db
      .prepare("SELECT * FROM ideas ORDER BY created_at DESC")
      .all();
    return NextResponse.json(ideas);
  } catch (error) {
    console.error("Error fetching ideas:", error);
    return NextResponse.json(
      { error: "Failed to fetch ideas" },
      { status: 500 },
    );
  }
}
