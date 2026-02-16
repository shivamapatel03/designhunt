import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('token');
  return response;
}

export async function GET(req: Request) {
  const response = NextResponse.redirect(new URL('/login', req.url));
  response.cookies.delete('token');
  return response;
}
