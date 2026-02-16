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
    const { username, bio, skills, role, avatar } = body;

    // Check if username is taken (if changed)
    if (username) {
        const existing = db.prepare('SELECT id FROM users WHERE username = ? AND id != ?').get(username, userId);
        if (existing) {
            return NextResponse.json({ error: 'Username already taken' }, { status: 400 });
        }
    }

    const update = db.prepare(`
        UPDATE users 
        SET username = COALESCE(?, username),
            bio = COALESCE(?, bio),
            skills = COALESCE(?, skills),
            role = COALESCE(?, role),
            avatar = COALESCE(?, avatar),
            onboarding_completed = 1
        WHERE id = ?
    `);

    update.run(
        username || null,
        bio || null,
        JSON.stringify(skills || []),
        role || null,
        avatar || null,
        userId
    );

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Update Profile Error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
