import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // Top 5 submissions by vote count
    // Top 5 submissions by vote count
    const leaderboard = db
      .prepare(
        `
        SELECT 
            s.id, 
            u.name as user_name, 
            u.avatar as user_avatar, 
            (SELECT COUNT(*) FROM submission_votes sv WHERE sv.submission_id = s.id) as vote_count
        FROM submissions s
        JOIN users u ON s.user_id = u.id
        WHERE s.challenge_id = ?
        ORDER BY vote_count DESC
        LIMIT 5
    `,
      )
      .all(id);

    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 },
    );
  }
}
