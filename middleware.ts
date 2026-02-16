import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-key-change-me');

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Paths that require authentication
  const protectedPaths = [
    '/dashboard', 
    '/profile', 
    '/settings', 
    '/api/protected', 
    '/tutor', 
    '/tutor-dashboard', 
    '/admin', 
    '/super-admin'
  ];
  
  // Paths that are for guests only (redirect to dashboard if logged in)
  const authPaths = [
    '/login', 
    '/signup', 
    '/auth', 
    '/tutor/login', 
    '/admin/login', 
    '/super-admin/login'
  ];

  const isAuthPath = authPaths.some(path => pathname === path || pathname.startsWith(path + '/'));
  const isProtectedPath = protectedPaths.some(path => pathname === path || pathname.startsWith(path + '/')) && !isAuthPath;

  // Verify token if it exists
  let payload = null;
  if (token) {
    try {
      const { payload: verifiedPayload } = await jwtVerify(token, JWT_SECRET);
      payload = verifiedPayload;
    } catch (err) {
      // Invalid token
    }
  }

  // Redirect unauthenticated users trying to access protected paths
  if (isProtectedPath && !payload) {
    let loginRoot = '/login';
    
    if (pathname.startsWith('/tutor')) loginRoot = '/tutor/login';
    else if (pathname.startsWith('/admin')) loginRoot = '/admin/login';
    else if (pathname.startsWith('/super-admin')) loginRoot = '/super-admin/login';

    const loginUrl = new URL(loginRoot, request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users trying to access auth paths
  if (isAuthPath && payload) {
    // Determine the user's natural dashboard
    let dashboard = '/profile';
    if (payload.role === 'SUPER_ADMIN') dashboard = '/super-admin';
    else if (payload.role === 'ADMIN') dashboard = '/admin';
    else if (payload.role === 'TUTOR') dashboard = '/tutor-dashboard';

    // FIX: If the user is on a login page that matches their role, redirect to dashboard.
    // BUT: If they are a STUDENT and on a staff login page, let them through so they can elevate their session.
    const isStaffLogin = pathname.includes('/tutor/login') || pathname.includes('/admin/login') || pathname.includes('/super-admin/login');
    
    if (payload.role === 'STUDENT' && isStaffLogin) {
        return NextResponse.next();
    }

    return NextResponse.redirect(new URL(dashboard, request.url));
  }
  
  // Role-based Access Control
  const isSuperAdminPath = pathname.startsWith('/super-admin') && !pathname.includes('/login');
  const isAdminPath = pathname.startsWith('/admin') && !pathname.includes('/login');
  const isTutorPath = (pathname.startsWith('/tutor-dashboard') || (pathname.startsWith('/tutor') && !pathname.startsWith('/tutor/apply'))) && !pathname.includes('/login');

  const userRole = payload?.role ? String(payload.role).toUpperCase() : null;

  // 4. Staff Portal Redirects
  // If a staff member tries to access the public /login, send them to /staff/login
  // But allow them to proceed if they are explicitly going to /staff/login
  if (pathname === '/login') {
      // We can't easily know if they are staff before they login, so we'll leave /login for students
      // However, we should protect /staff routes
  }

  // Protect Staff Portal
  if (pathname.startsWith('/staff') && !pathname.includes('/staff/login')) {
      if (!isAdminPath && !isSuperAdminPath && !isTutorPath) {
          // If they aren't trying to access a specific dashboard, just keep them in the loop or send to login
          if (!payload) {
             return NextResponse.redirect(new URL('/staff/login', request.url));
          }
      }
  }

  // Redirect authenticated staff away from login pages
  if (payload && (pathname === '/login' || pathname === '/staff/login' || pathname === '/admin/login' || pathname === '/tutor/login' || pathname === '/register')) {
    if (payload.role === 'SUPER_ADMIN') return NextResponse.redirect(new URL('/super-admin', request.url));
    if (payload.role === 'ADMIN') return NextResponse.redirect(new URL('/admin', request.url));
    if (payload.role === 'TUTOR') return NextResponse.redirect(new URL('/tutor-dashboard', request.url));
    if (payload.role === 'USER') return NextResponse.redirect(new URL('/profile', request.url));
  }

  if (isSuperAdminPath) {
    if (userRole !== 'SUPER_ADMIN') {
      // If they are an ADMIN, they might have hit this by mistake, send to /admin
      if (userRole === 'ADMIN') {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      return NextResponse.redirect(new URL('/profile', request.url));
    }
  }

  if (isAdminPath) {
    // SUPER_ADMIN has absolute authority over /admin
    if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/profile', request.url));
    }
  }

  if (isTutorPath) {
    // Staff (Admin/Super Admin) can also access tutor views for oversight
    if (userRole !== 'TUTOR' && userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/profile', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
