import { NextResponse, NextRequest } from "next/server";
import db from "@/lib/db";
import { jwtVerify } from "jose";
import bcrypt from "bcryptjs";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default-secret-key-change-me",
);

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.userId as string;

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Missing password fields" },
        { status: 400 },
      );
    }

    // Get current user password
    const user = db
      .prepare("SELECT password FROM users WHERE id = ?")
      .get(userId) as { password?: string } | undefined;

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify current password
    if (!user.password) {
      return NextResponse.json(
        { error: "Auth provider mismatch or missing password" },
        { status: 400 },
      );
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Incorrect current password" },
        { status: 400 },
      );
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    db.prepare("UPDATE users SET password = ? WHERE id = ?").run(
      hashedPassword,
      userId,
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Change Password Error:", error);
    return NextResponse.json(
      { error: "Failed to change password" },
      { status: 500 },
    );
  }
}
