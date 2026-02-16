import { NextResponse, NextRequest } from "next/server";
import db from "@/lib/db";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-key-change-me');

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.userId as string;

    const body = await req.json();
    const { name, role, email, portfolio, expertise } = body;

    // Check if user already has a pending request
    const existing = db.prepare('SELECT id FROM tutor_requests WHERE user_id = ? AND status = "PENDING"').get(userId);
    if (existing) {
      return NextResponse.json({ error: 'You already have a pending application' }, { status: 400 });
    }

    const id = crypto.randomUUID();
    const stmt = db.prepare(`
      INSERT INTO tutor_requests (id, user_id, name, role, email, portfolio, expertise)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(id, userId, name, role, email, portfolio, expertise);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Tutor Request Error:', error);
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
  }
}
