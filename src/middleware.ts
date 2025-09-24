import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';

export const config = {
  // Match all paths except for static files, api routes, and the login page itself
  matcher: ['/((?!_next/static|_next/image|favicon.ico|login|api/login).*)'],
};

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth-token')?.value;
  const loginUrl = new URL('/login', request.url);

  if (!authToken) {
    // If there's no token, redirect to the login page
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
