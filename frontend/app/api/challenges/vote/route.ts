import { NextResponse } from "next/server";
import db from "@/lib/db";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { randomUUID } from "crypto";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key",
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { submissionId } = body;

    if (!submissionId) {
      return NextResponse.json(
        { error: "Submission ID is required" },
        { status: 400 },
      );
    }

    // Verify User
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let userId;
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      userId = payload.userId as string;
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Check if user exists
    const userExists = db
      .prepare("SELECT 1 FROM users WHERE id = ?")
      .get(userId);
    if (!userExists) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    // Check if vote exists
    const existingVote = db
      .prepare(
        "SELECT id FROM submission_votes WHERE user_id = ? AND submission_id = ?",
      )
      .get(userId, submissionId);

    let voted = false;

    if (existingVote) {
      // Toggle OFF (Remove vote)
      db.prepare(
        "DELETE FROM submission_votes WHERE user_id = ? AND submission_id = ?",
      ).run(userId, submissionId);
      voted = false;
    } else {
      // Toggle ON (Add vote)
      db.prepare(
        "INSERT INTO submission_votes (id, user_id, submission_id) VALUES (?, ?, ?)",
      ).run(randomUUID(), userId, submissionId);
      voted = true;
    }

    // Get new count
    const countResult = db
      .prepare(
        "SELECT COUNT(*) as count FROM submission_votes WHERE submission_id = ?",
      )
      .get(submissionId) as { count: number };

    return NextResponse.json({
      success: true,
      voted,
      newCount: countResult.count,
    });
  } catch (error) {
    console.error("Vote Error:", error);
    return NextResponse.json({ error: "Failed to vote" }, { status: 500 });
  }
}
