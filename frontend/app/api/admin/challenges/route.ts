import { NextResponse } from "next/server";
import db from "@/lib/db";
import { randomUUID } from "crypto";

export async function GET() {
  try {
    const challenges = db
      .prepare("SELECT * FROM challenges ORDER BY created_at DESC")
      .all();
    return NextResponse.json(challenges);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch challenges" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      difficulty,
      points,
      category,
      requirements,
      is_active,
    } = body;

    const id = randomUUID();
    const createdAt = new Date().toISOString();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // Default 24h

    // If setting as active, deactivate others
    if (is_active) {
      db.prepare("UPDATE challenges SET is_active = 0").run();
    }

    const stmt = db.prepare(`
            INSERT INTO challenges (id, title, description, difficulty, points, category, requirements, is_active, expires_at, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

    stmt.run(
      id,
      title,
      description,
      difficulty,
      points,
      category,
      JSON.stringify(requirements),
      is_active ? 1 : 0,
      expiresAt,
      createdAt,
    );

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create challenge" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, is_active } = body;

    if (is_active) {
      // Transaction to ensure only one active
      const deactivate = db.prepare("UPDATE challenges SET is_active = 0");
      const activate = db.prepare(
        "UPDATE challenges SET is_active = 1 WHERE id = ?",
      );
      // Better-sqlite3 transaction
      const transaction = db.transaction(() => {
        deactivate.run();
        activate.run(id);
      });
      transaction();
    } else {
      db.prepare("UPDATE challenges SET is_active = 0 WHERE id = ?").run(id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update challenge" },
      { status: 500 },
    );
  }
}
