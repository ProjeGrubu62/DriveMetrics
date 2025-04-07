import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                    request.nextUrl.pathname.startsWith('/register');

  // Oturum açmış kullanıcılar login/register sayfalarına erişmeye çalışırsa
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Korumalı sayfalara erişim kontrolü
  const protectedPaths = [
    '/dashboard',
    '/profile',
    '/analysis',
    '/drive-setup',
    '/manual-entry',
    '/auto-collect'
  ];

  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedPath && !token) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/analysis/:path*',
    '/drive-setup/:path*',
    '/manual-entry/:path*',
    '/auto-collect/:path*',
    '/login',
    '/register'
  ]
};