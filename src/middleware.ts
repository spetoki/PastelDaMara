import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';

export const config = {
  // Match all paths except for static files and the login page
  matcher: ['/((?!_next/static|_next/image|favicon.ico|login|api/login).*)'],
};

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth-token')?.value;
  const loginUrl = new URL('/login', request.url);

  if (!authToken) {
    // If on any page other than login and no token, redirect to login
    if (request.nextUrl.pathname !== '/login') {
      return NextResponse.redirect(loginUrl);
    }
  }

  // If the user has a token and tries to access the login page, redirect them to home
  if (authToken && request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}
