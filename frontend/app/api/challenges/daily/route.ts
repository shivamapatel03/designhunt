import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    // Select the currently active challenge
    const challenge = db
      .prepare("SELECT * FROM challenges WHERE is_active = 1 LIMIT 1")
      .get();

    if (!challenge) {
      return NextResponse.json(
        { error: "No active challenge found" },
        { status: 404 },
      );
    }

    return NextResponse.json(challenge);
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch daily challenge" },
      { status: 500 },
    );
  }
}
