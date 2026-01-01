import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  });

  const { pathname } = request.nextUrl;

  // Allow access to auth pages and API routes
  if (
    pathname.startsWith('/auth') || 
    pathname.startsWith('/api/auth') ||
    pathname === '/'
  ) {
    return NextResponse.next();
  }

  // Redirect to login if not authenticated
  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Role-based access control
  const userRole = token.role as string;

  // Admin can access everything
  if (userRole === 'ADMIN') {
    // Redirect admin to admin dashboard if accessing generic /dashboard
    if (pathname === '/dashboard') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.next();
  }

  // Seller can only access seller routes
  if (userRole === 'SELLER') {
    // Block admin routes for sellers
    if (pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/seller', request.url));
    }
    
    // Redirect seller to seller dashboard if accessing generic /dashboard
    if (pathname === '/dashboard') {
      return NextResponse.redirect(new URL('/seller', request.url));
    }
    
    // Allow access to seller routes
    if (pathname.startsWith('/seller')) {
      return NextResponse.next();
    }
  }

  // Default redirect to appropriate dashboard
  if (pathname === '/dashboard') {
    if (userRole === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin', request.url));
    } else if (userRole === 'SELLER') {
      return NextResponse.redirect(new URL('/seller', request.url));
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
     * - public (public files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};