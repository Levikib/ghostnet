import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Public routes that never require auth
const PUBLIC_PATHS = [
  '/welcome',
  '/auth',
  '/auth/callback',
  '/api/auth/callback', // Supabase email confirmation redirect
]

// Static asset prefixes — always pass through
// NOTE: /api/ is NOT here — API routes enforce their own auth checks
const ASSET_PREFIXES = ['/_next', '/favicon']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Always allow static assets
  if (ASSET_PREFIXES.some(p => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  // Always allow public pages
  if (PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'))) {
    return NextResponse.next()
  }

  // Check if Supabase is configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseKey || supabaseUrl === 'your_supabase_url_here') {
    // Supabase not configured — allow access (dev mode)
    return NextResponse.next()
  }

  // Create response and Supabase client with cookie handling
  const response = NextResponse.next({
    request: { headers: request.headers },
  })

  // Sliding inactivity timeout — 20 minutes
  // Cookie is refreshed on every request, so active users stay logged in.
  // 20 minutes of no requests = cookie expires = session ends = splash screen on next visit.
  const SESSION_MAX_AGE = 60 * 20 // 20 minutes in seconds

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value)
          response.cookies.set(name, value, {
            ...options,
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            maxAge: SESSION_MAX_AGE, // sliding — resets on every request
          })
        })
      },
    },
  })

  // Refresh session (keeps the cookie alive on activity)
  const { data: { user } } = await supabase.auth.getUser()

  // Not authenticated — redirect to welcome
  if (!user) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/welcome'
    // Pass the original destination so we can redirect back after login
    redirectUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all routes except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
