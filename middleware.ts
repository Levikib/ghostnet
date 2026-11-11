import { NextResponse, type NextRequest } from 'next/server'

// ── Public routes — never require auth ────────────────────────────────────────
// Guests can browse freely to get a feel for the platform. Only progress-tracking,
// personal data, and AI-cost-bearing tools require an account.
const PUBLIC_PATHS = [
  '/welcome',
  '/auth',
  '/privacy',
  '/terms',
  // SEO / AEO files must be reachable by crawlers without a session
  '/robots.txt',
  '/sitemap.xml',
  '/llms.txt',
  '/opengraph-image',
  '/twitter-image',
  '/icon.svg',
]

// Module CONCEPT pages (read-only learning content) are public.
// Their /lab sub-routes are NOT — labs track XP/progress and require an account.
const PUBLIC_MODULE_CONCEPT = /^\/modules\/[^/]+\/?$/

// ── Static asset prefixes — always pass through ───────────────────────────────
// /api/ is NOT here — every API route enforces its own auth
// /.well-known/ files (agent and security manifests) must never be swapped for the splash page.
const ASSET_PREFIXES = ['/_next', '/favicon', '/.well-known/']

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
  const origin = request.headers.get('origin')
  // Same-origin requests (including Vercel preview hosts) are always fine.
  const host = request.headers.get('host')
  if (origin && host && (origin === 'https://' + host || origin === 'http://' + host)) return false
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

  // Module concept pages are public — guests can learn without an account
  if (PUBLIC_MODULE_CONCEPT.test(pathname)) {
    return NextResponse.next()
  }

  // API routes authenticate themselves (and must answer JSON, not a redirect).
  if (pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // Signed-in check. The httpOnly session cookie is validated against the database by every
  // API route and page that reads data; here we only route visitors without one to the splash.
  const hasSession = !!request.cookies.get('gn_session')?.value
  if (!hasSession) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/welcome'
    redirectUrl.search = ''
    redirectUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
