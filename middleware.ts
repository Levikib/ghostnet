import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// ── Public routes — never require auth ────────────────────────────────────────
const PUBLIC_PATHS = [
  '/welcome',
  '/auth',
  '/auth/callback',
  '/api/auth/callback',
  '/privacy',
  '/terms',
]

// ── Static asset prefixes — always pass through ───────────────────────────────
// /api/ is NOT here — every API route enforces its own auth
const ASSET_PREFIXES = ['/_next', '/favicon']

// ── Allowed origins for CSRF checks ──────────────────────────────────────────
// Add your production domain here. Localhost allowed in dev.
function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return true // same-origin requests have no Origin header
  const allowed = [
    process.env.NEXT_PUBLIC_SITE_URL,
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ].filter(Boolean)
  return allowed.some(o => origin.startsWith(o as string))
}

// ── CSRF: reject cross-origin state-mutating API calls ────────────────────────
function isCsrfViolation(request: NextRequest): boolean {
  const pathname = request.nextUrl.pathname
  const method = request.method
  if (!pathname.startsWith('/api/')) return false
  if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') return false
  // Allow Supabase auth callback (POST from Supabase servers)
  if (pathname.startsWith('/api/auth/')) return false
  const origin = request.headers.get('origin')
  return !isAllowedOrigin(origin)
}

// ── Block obviously malformed / scanner requests ──────────────────────────────
const BLOCKED_PATTERNS = [
  /\.\.(\/|\\)/,           // path traversal
  /<script/i,              // XSS in URL
  /(%3c|%3e)/i,            // encoded < >
  /\bexec\b|\beval\b/i,    // code injection attempts in path
  /\bwp-admin\b/i,         // WordPress scanner noise
  /\bphpmyadmin\b/i,
  /\.php$/i,
  /\.env/i,
]

function isBlockedPath(pathname: string): boolean {
  return BLOCKED_PATTERNS.some(p => p.test(pathname))
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Block scanner noise and traversal attempts immediately
  if (isBlockedPath(pathname)) {
    return new NextResponse(null, { status: 404 })
  }

  // CSRF check — must happen before any state mutation
  if (isCsrfViolation(request)) {
    return new NextResponse(JSON.stringify({ error: 'Forbidden' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    })
  }

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
    // Dev mode — Supabase not configured, allow access
    return NextResponse.next()
  }

  // Create response + Supabase SSR client with cookie handling
  const response = NextResponse.next({
    request: { headers: request.headers },
  })

  // Sliding inactivity timeout — 20 minutes
  // Cookie refreshed on every authenticated request.
  // 20 minutes of no activity → cookie expires → next visit shows splash.
  const SESSION_MAX_AGE = 60 * 20

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
            maxAge: SESSION_MAX_AGE,
          })
        })
      },
    },
  })

  // Refresh session (keeps the cookie alive on activity)
  const { data: { user } } = await supabase.auth.getUser()

  // Not authenticated — redirect to welcome, preserving destination
  if (!user) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/welcome'
    redirectUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
