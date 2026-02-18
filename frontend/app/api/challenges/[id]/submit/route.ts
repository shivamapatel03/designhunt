import { NextResponse } from "next/server";
import db from "@/lib/db";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { randomUUID } from "crypto";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key",
);

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 },
      );
    }

    // Verify User
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let userId, userName, userAvatar;
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      userId = payload.userId as string;

      if (!userId) {
        return NextResponse.json(
          { error: "Invalid token payload" },
          { status: 401 },
        );
      }

      // Fetch user details for submission (denormalized)
      const user = db
        .prepare(
          "SELECT name, (SELECT 'https://api.dicebear.com/7.x/avataaars/svg?seed=' || username) as avatar FROM users WHERE id = ?",
        )
        .get(userId) as any;
      userName = user?.name || "Anonymous";
      userAvatar = user?.avatar;
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Check if already submitted? (Optional, allowing multiple for now)

    console.log(
      `[Submit API] Attempting submission for Challenge: ${id}, User: ${userId}`,
    );

    // Validate User Existence
    const userExists = db
      .prepare("SELECT 1 FROM users WHERE id = ?")
      .get(userId);
    if (!userExists) {
      console.error(`[Submit API] User ID ${userId} not found in DB.`);
      return NextResponse.json(
        { error: "User not found. Please log in again." },
        { status: 401 },
      );
    }

    // Validate Challenge Existence
    const challengeExists = db
      .prepare("SELECT 1 FROM challenges WHERE id = ?")
      .get(id);
    if (!challengeExists) {
      console.error(`[Submit API] Challenge ID ${id} not found in DB.`);
      return NextResponse.json(
        { error: "Challenge not found or expired." },
        { status: 404 },
      );
    }

    const submissionId = randomUUID();

    try {
      const stmt = db.prepare(`
            INSERT INTO submissions (id, challenge_id, user_id, content)
            VALUES (?, ?, ?, ?)
        `);

      stmt.run(submissionId, id, userId, content);
      console.log(`[Submit API] Submission successful: ${submissionId}`);
    } catch (dbError: any) {
      console.error("[Submit API] Database Insertion Error:", dbError);
      console.error("Params:", {
        submissionId,
        id,
        userId,
        contentLength: content?.length,
      });
      throw dbError; // Re-throw to be caught by outer block
    }

    return NextResponse.json({ success: true, submissionId });
  } catch (error: any) {
    console.error("Submission Error Wrapper:", error);
    return NextResponse.json(
      { error: error.message || "Failed to submit" },
      { status: 500 },
    );
  }
}
