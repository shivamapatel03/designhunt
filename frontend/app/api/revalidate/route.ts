import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  try {
    // In a real app, verify a secret token here
    // const secret = req.nextUrl.searchParams.get('secret');
    // if (secret !== process.env.MY_SECRET_TOKEN) return NextResponse.json({ message: 'Invalid token' }, { status: 401 });

    revalidatePath("/", "layout");
    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    return NextResponse.json(
      { revalidated: false, message: "Error revalidating" },
      { status: 500 },
    );
  }
}
