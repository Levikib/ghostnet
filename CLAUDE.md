# GHOSTNET — Security Research Platform

## Stack
Next.js 14 (App Router), TypeScript strict mode (`ignoreBuildErrors: false`), Tailwind, JetBrains Mono font, terminal/hacker aesthetic.
Babel compiler (NOT SWC) — .babelrc exists, do not remove it.
Database: Neon Postgres via SQL-over-HTTP (lib/server/db.ts, no driver). Schema self-heals in lib/server/schema.ts (idempotent statements; add new columns at the end).
Auth: GHOSTNET's own engine (lib/server/*): scrypt passwords, email OTP verification, DB sessions (httpOnly `gn_session`, hashed), optional TOTP 2FA + backup codes, new-device alerts, rate limits, audit log. Supabase is no longer used.
Email: Gmail SMTP via lib/server/mailer.ts (SMTP_USER, SMTP_PASS app password). Env: DATABASE_URL, AUTH_SECRET, SMTP_USER, SMTP_PASS, MAIL_FROM_NAME, ADMIN_EMAILS.
Groq API via /api/ghost — model from GHOST_MODEL (default openai/gpt-oss-120b, fallback GHOST_FALLBACK_MODEL openai/gpt-oss-20b; llama-3.3-70b was retired 16 Aug 2026). The system prompt is built ONLY on the server (lib/ghost/prompt.ts + lib/ghost/pages.ts); clients send { messages, path, context } or { mode: 'attack-narrative' | 'report' }. Never accept prompt text from the browser. Pages publish what the learner sees with setGhostContext (lib/client/ghostContext.ts).

## Auth & LMS rules
- Server code that touches the DB lives in lib/server/* and route handlers with `export const runtime = 'nodejs'`. Always use `sql()` / `one()` with $n params.
- Every API route authenticates itself with `getSessionUser(req)`; middleware only redirects pages without a session cookie to /welcome.
- Client: `useAuth()` gives `profile` (the full operator incl. per-module progress). Progress sync goes through lib/client/progress.ts (syncChapter, syncLabStep, syncLabComplete).
- Course catalogue, lab XP and the progress formula (60% chapters + 40% lab) live in lib/learning.ts. Never hardcode lab XP elsewhere.
- Flow: /welcome (boot, briefing, hold-to-breach portal) -> /auth (sign in / enlist / verify / 2FA / reset) -> /onboarding (sigil, clearance, focus) -> dashboard.

## Critical Rules
- NEVER use template literals with bash variables like ${VAR} inside JSX/TSX — use string concatenation or replace with placeholder text like ADDR_HERE
- NEVER use raw backslashes in template literals e.g. domain\uid — use domain/uid instead
- All pages must have 'use client' at the very top line
- All Pre components use backtick children passed as JSX, not single-quoted multiline strings
- Colors: green=#00ff41, cyan=#00d4ff, orange=#ffb347, purple=#bf5fff, red=#ff4136
- TypeScript is strict — `ignoreBuildErrors: false`. Fix all TS errors before committing.
- TDZ rule: never declare `const xpTotal` before `const steps = [...]` in lab pages — use `steps.reduce()` after the steps array

## Project Structure
app/
  page.tsx              — Dashboard (ShanGhost Admin)
  layout.tsx            — Nav with dropdowns (MODULES x13, TOOLS dynamic, DASHBOARD)
                          MobileMenuContext hides floating widgets when mobile menu is open
                          TOOLS list is auth-aware: shows PROFILE when logged in, ACCOUNT when not
  welcome/page.tsx      — Cinematic splash: matrix rain, scramble text, boot sequence
                          Checks session on mount — skips splash if already authenticated
  auth/page.tsx         — Login/register page (works offline if Supabase not configured)
  profile/page.tsx      — User profile, badges, lab history
  modules/
    tor/                — MOD-01 green #00ff41
    osint/              — MOD-02 cyan #00d4ff
    crypto/             — MOD-03 orange #ffb347
    offensive/          — MOD-04 purple #bf5fff
    active-directory/   — MOD-05 red #ff4136
    web-attacks/        — MOD-06 cyan
    malware/            — MOD-07 green
    network-attacks/    — MOD-08 #00ffff
    cloud-security/     — MOD-09 #ff9500
    social-engineering/ — MOD-10 #ff6ec7
    red-team/           — MOD-11 #ff3333
    wireless-attacks/   — MOD-12 #aaff00
    mobile-security/    — MOD-13 #7c4dff
  Each module has page.tsx (concept) and lab/page.tsx (interactive lab).
  All concept pages have 4-column stat card grid (.module-stat-grid) and LAUNCH LAB CTA at bottom.
  auth/page.tsx         — Login/register page (works offline if Supabase not configured)
  profile/page.tsx      — User profile, badges, lab history
  components/
    GhostAgent.tsx      — AI chat widget, bottom-right, uses Groq API via /api/ghost
                          Imports RANK_LIST from lib/supabase — never define its own rank array
    ProgressTracker.tsx — XP tracker, bottom-left above CheatSheet
    CheatSheet.tsx      — Quick ref, bottom-left lowest
    CVEFeed.tsx         — Live CVEs, bottom-right above GhostAgent
    AuthProvider.tsx    — Supabase auth context + NavUserBadge (rank pill in nav)
    ModuleCodex.tsx     — Chapter-format content renderer for all 13 concept pages
                          Uses className hooks (codex-nav-strip, codex-chapter-header, etc.)
                          for CSS mobile targeting in globals.css
    LabTerminal.tsx     — Guided lab engine: steps, XP, hints, verification, Supabase sync
lib/
  supabase.ts           — Browser Supabase client, type defs, RANK_LIST, getRank(), RANK_COLORS
                          Single source of truth for all rank/XP logic — never duplicate
  supabase/client.ts    — @supabase/ssr browser client factory
  supabase/server.ts    — @supabase/ssr server client (API routes only)
supabase-schema.sql     — Full DB schema + seed (run in Supabase SQL Editor)
middleware.ts           — Auth gate, 20-min sliding session timeout, /welcome redirect
api/
  ghost/route.ts        — Groq AI endpoint: server-built prompt, Postgres rate limits (20/10 min, 200/day)
  progress/route.ts     — Lab completion + XP award (POST) / progress fetch (GET)
  auth/callback/route.ts — Email confirmation redirect handler

## Floating Widget Layout (FIXED positions — do not change)
Bottom-left stack (no overlap):
  CheatSheet button:      bottom: 24px,  left: 24px
  ProgressTracker button: bottom: 70px,  left: 24px
Bottom-right stack (no overlap):
  GhostAgent button:      bottom: 24px,  right: 24px
  CVEFeed button:         bottom: 70px,  right: 24px
All panels open UPWARD. All zIndex >= 9000.
IMPORTANT: All four floating widgets are hidden (unmounted) when the mobile menu is open.
This is handled by MobileMenuContext in layout.tsx — do not use z-index to fight it.

## Mobile CSS Classes (globals.css)
Module concept pages use these className hooks for mobile targeting:
  .module-stat-grid       — 4-col stat cards grid → 2-col at ≤640px
  .codex-nav-strip        — chapter nav strip padding
  .codex-chapter-header   — chapter header card padding
  .codex-chapter-title    — chapter h2 font size
  .codex-prev-btn / .codex-next-btn — prev/next buttons (truncate with ellipsis on mobile)
  .codex-takeaways        — key takeaways box padding
Lab pages use: .lab-objective, .step-progress-bar, .lab-input-area, .xp-toast, .phase-badges

## Rank/XP System (single source of truth: lib/supabase.ts)
Total earnable XP across all 13 labs: 5,450
Rank thresholds: Ghost 0 / Specter 750 / Phantom 1,800 / Wraith 3,200 / Legend 5,000
These are also set in: supabase-schema.sql trigger, ProgressTracker.tsx LABS array XP values
Never hardcode rank data in individual components — always import RANK_LIST from lib/supabase.ts

## Navigation — Auth-Aware Tools List
The TOOLS array in layout.tsx is built dynamically inside the Nav component:
- When authenticated: last tool entry is { href: '/profile', label: 'PROFILE', ... }
- When not authenticated: last tool entry is { href: '/auth', label: 'ACCOUNT', ... }
Logout redirects to /welcome (not /) to always show the splash screen after sign-out.

## Persona
Platform owner: ShanGhost Admin
Target audience: Beginners to advanced security researchers
Tone: Clear, educational, technically accurate but accessible. Explain concepts like you would to a smart person who is new to security. Avoid jargon without explanation.

## Learning integrity rules
- Chapter XP is credited only after 20s on the chapter AND reaching its end (ModuleCodex).
- A lab completes only when every step is in the completed set; learners can only jump to completed steps or the first open one.
- `skip`/`solution` reveals the answer; the learner still types it and that step pays no XP.
- Answer matching: exact, or the expected command plus at most 4 extra words (no keyword stuffing).
