import { NextResponse } from "next/server";
import db from "@/lib/db";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key",
);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // Check if user has voted if token exists
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    let userId = null;

    if (token) {
      try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        userId = payload.userId as string;
      } catch (e) {
        // Invalid token, treat as guest
      }
    }

    const submissions = db
      .prepare(
        `
        SELECT 
            s.*,
            u.name as user_name,
            u.avatar as user_avatar,
            (SELECT COUNT(*) FROM submission_votes sv WHERE sv.submission_id = s.id) as vote_count,
            (SELECT COUNT(*) FROM submission_votes sv WHERE sv.submission_id = s.id AND sv.user_id = ?) as has_voted
        FROM submissions s
        JOIN users u ON s.user_id = u.id
        WHERE s.challenge_id = ?
        ORDER BY vote_count DESC, s.created_at DESC
        LIMIT 50
    `,
      )
      .all(userId || "guest", id);

    // Booleanize has_voted
    const result = submissions.map((s: any) => ({
      ...s,
      has_voted: s.has_voted > 0,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch submissions" },
      { status: 500 },
    );
  }
}
