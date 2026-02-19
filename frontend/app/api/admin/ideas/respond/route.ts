import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { id, message } = await request.json();

    if (!id || !message) {
      return NextResponse.json(
        { error: "Missing ID or message" },
        { status: 400 },
      );
    }

    // 1. Get user details from the idea
    const idea = db.prepare("SELECT * FROM ideas WHERE id = ?").get(id) as any;
    if (!idea) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 });
    }

    // 2. Update DB with feedback
    const stmt = db.prepare(
      'UPDATE ideas SET admin_feedback = ?, status = "reviewed", updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    );
    stmt.run(message, id);

    // 3. Send Email (Backend Proxy Call)
    try {
      const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
      // Note: For now, we are skipping admin token passing here for simplicity in this bridge API,
      // but in production, we should pass the user's token or use an internal secret.
      const emailRes = await fetch(
        `${backendUrl}/api/admin/send-idea-feedback`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: idea.email,
            userName: idea.name,
            ideaText: idea.idea,
            feedback: message,
          }),
        },
      );

      if (!emailRes.ok) {
        console.error("Backend Email error:", await emailRes.text());
        // We still return success for DB part, but log the error
      } else {
        console.log(`[EMAIL DISPATCHED] To: ${idea.email}`);
      }
    } catch (emailErr) {
      console.error("Fetch to backend failed:", emailErr);
    }

    // In a real environment, we'd fetch to backend/api/notify or similar
    // const emailRes = await fetch(`${process.env.BACKEND_URL}/api/admin/send-email`, { ... });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error responding to idea:", error);
    return NextResponse.json(
      { error: "Failed to send response" },
      { status: 500 },
    );
  }
}
