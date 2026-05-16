import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that require the user to be logged in
const protectedRoutes = ['/dashboard', '/profile', '/settings']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if it's a protected route
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route))
  
  if (isProtected) {
    const userId = request.cookies.get('verve_user_id')?.value
    
    // If no user ID cookie is present, redirect to the home/join page
    if (!userId) {
      const url = request.nextUrl.clone()
      url.pathname = '/join'
      url.searchParams.set('next', pathname)
      return NextResponse.redirect(url)
    }
    
    // We can pass the user ID as a header to downstream API routes if needed
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-id', userId)
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
