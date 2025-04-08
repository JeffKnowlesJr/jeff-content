import { NextRequest, NextResponse } from 'next/server'

// Define admin routes that should be protected
const protectedRoutes = [
  '/admin',
  '/admin/dashboard',
  '/admin/users',
  '/admin/settings'
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for non-admin routes
  if (!pathname.startsWith('/admin') || pathname === '/admin/login') {
    return NextResponse.next()
  }

  // Check if this is a protected route
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )

  if (!isProtectedRoute) {
    return NextResponse.next()
  }

  // Check if user is authenticated
  const authToken = request.cookies.get('auth_token')?.value

  if (!authToken) {
    // Redirect to login page with return URL
    const url = new URL('/admin/login', request.url)
    url.searchParams.set('returnUrl', pathname)
    return NextResponse.redirect(url)
  }

  // In a real application, you would validate the token here
  // For now, we'll assume the token is valid if it exists

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}
