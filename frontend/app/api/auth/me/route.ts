import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import db from "@/lib/db";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "designhunt_secret_key_123",
);

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);

    if (!payload.userId) {
      console.error("Token missing userId", payload);
      return NextResponse.json({ user: null }, { status: 401 });
    }

    // Fetch fresh user data from SQLite
    const user = db
      .prepare("SELECT id, name, email, role, avatar FROM users WHERE id = ?")
      .get(payload.userId) as any;

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Auth API Error:", error);
    // If it's a JWT error, return 401, otherwise 500 but safely
    return NextResponse.json(
      { user: null, error: "Authentication failed" },
      { status: 401 },
    );
  }
}
