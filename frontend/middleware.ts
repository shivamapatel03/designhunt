import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Paths that should not be accessible if authenticated
  const authPaths = ["/login", "/signup"];

  // Protected paths
  const adminPaths = ["/admin", "/super-admin"];

  /* 
     1. ROUTE PROTECTION: Unauthenticated users 
  */
  if (!token) {
    // Super Admin Routes
    if (pathname.startsWith("/super-admin")) {
      if (pathname !== "/super-admin/login") {
        return NextResponse.redirect(
          new URL("/super-admin/login", request.url),
        );
      }
    }
    // Admin Routes
    else if (pathname.startsWith("/admin")) {
      if (pathname !== "/admin/login") {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
    }
  }

  /* 
     2. AUTHENTICATED REDIRECTS: Logged-in users shouldn't see login pages 
  */
  if (token) {
    // If on Admin Login page, go to Admin Dashboard
    if (pathname === "/admin/login") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    // If on Super Admin Login page, go to Super Admin Dashboard
    if (pathname === "/super-admin/login") {
      return NextResponse.redirect(new URL("/super-admin", request.url));
    }
    // If on public Login/Signup, go to Profile (or Home)
    if (authPaths.includes(pathname)) {
      return NextResponse.redirect(new URL("/profile", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/signup", "/admin/:path*", "/super-admin/:path*"],
};
