import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const startups = db.prepare('SELECT * FROM startups').all().map((startup: any) => ({
      ...startup,
      tags: JSON.parse(startup.tags),
      requiredSkills: JSON.parse(startup.required_skills)
    }));

    return NextResponse.json(startups);
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Failed to fetch startups' }, { status: 500 });
  }
}
