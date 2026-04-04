/** @type {import('next').NextConfig} */

const SELF = "'self'"
const NONE = "'none'"
const UNSAFE_INLINE = "'unsafe-inline'"
// next/image and fonts need data: for inline images; JetBrains Mono loaded from Google Fonts
const GOOGLE_FONTS = 'https://fonts.googleapis.com https://fonts.gstatic.com'

const securityHeaders = [
  // ── Strict Transport Security ──────────────────────────────────────────────
  // Force HTTPS for 2 years, include subdomains, allow preload submission
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  // ── Clickjacking protection ────────────────────────────────────────────────
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  // ── MIME sniffing protection ───────────────────────────────────────────────
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  // ── Referrer policy — don't leak path/query to third parties ──────────────
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  // ── Permissions Policy — disable APIs this platform never uses ────────────
  {
    key: 'Permissions-Policy',
    value: [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'payment=()',
      'usb=()',
      'bluetooth=()',
      'interest-cohort=()',   // blocks FLoC
    ].join(', '),
  },
  // ── Content Security Policy ───────────────────────────────────────────────
  // Tight policy: only allow what GHOSTNET actually needs.
  // - Scripts: self only (Next.js bundles) + inline scripts Next needs
  // - Styles: self + inline (Tailwind generates inline, Google Fonts CDN)
  // - Fonts: Google Fonts CDN
  // - Images: self + data: (Next.js image optimization uses data URIs)
  // - Connect: self (API routes) + Supabase + Groq
  // - Frame: none — we never embed iframes
  {
    key: 'Content-Security-Policy',
    value: [
      `default-src ${SELF}`,
      `script-src ${SELF} ${UNSAFE_INLINE}`,   // Next.js requires unsafe-inline for hydration
      `style-src ${SELF} ${UNSAFE_INLINE} ${GOOGLE_FONTS}`,
      `font-src ${SELF} ${GOOGLE_FONTS}`,
      `img-src ${SELF} data: https:`,
      `connect-src ${SELF} https://*.supabase.co wss://*.supabase.co https://api.groq.com https://services.nvd.nist.gov https://api.blockcypher.com`,
      `frame-src ${NONE}`,
      `frame-ancestors ${NONE}`,
      `object-src ${NONE}`,
      `base-uri ${SELF}`,
      `form-action ${SELF}`,
      `upgrade-insecure-requests`,
    ].join('; '),
  },
  // ── Cross-Origin policies ─────────────────────────────────────────────────
  {
    key: 'Cross-Origin-Opener-Policy',
    value: 'same-origin',
  },
  {
    key: 'Cross-Origin-Resource-Policy',
    value: 'same-origin',
  },
  {
    key: 'Cross-Origin-Embedder-Policy',
    value: 'require-corp',
  },
]

const nextConfig = {
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: true },

  async headers() {
    return [
      {
        // Apply to all routes
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}

module.exports = nextConfig
