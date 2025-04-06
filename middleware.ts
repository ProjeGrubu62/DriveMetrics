import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  // Ana sayfa için özel kontrol
  if (pathname === '/') {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Korumalı rotalar
  const protectedRoutes = [
    '/dashboard',
    '/analysis',
    '/drive-setup',
    '/manual-entry',
    '/auto-collect',
    '/profile'
  ];

  // Auth sayfaları
  const authRoutes = ['/login', '/register'];

  // Geçerli yol korumalı mı kontrol et
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );

  const isAuthRoute = authRoutes.includes(pathname);

  // Oturum yoksa ve korumalı rotaya erişilmeye çalışılıyorsa login'e yönlendir
  if (!token && isProtectedRoute) {
    const callbackUrl = encodeURIComponent(pathname);
    return NextResponse.redirect(new URL(`/login?callbackUrl=${callbackUrl}`, request.url));
  }

  // Oturum varsa ve auth sayfalarına erişilmeye çalışılıyorsa dashboard'a yönlendir
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/analysis/:path*',
    '/drive-setup/:path*',
    '/manual-entry/:path*',
    '/auto-collect/:path*',
    '/profile/:path*',
    '/login',
    '/register'
  ],
};