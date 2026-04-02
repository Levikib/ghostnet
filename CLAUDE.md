# GHOSTNET — Security Research Platform

## Stack
Next.js 14 (App Router), TypeScript, Tailwind, JetBrains Mono font, terminal/hacker aesthetic.
Babel compiler (NOT SWC) — .babelrc exists, do not remove it.
Supabase — auth, postgres, realtime. Client: lib/supabase.ts (browser), lib/supabase-server.ts (API routes only).
Groq API — llama-3.3-70b-versatile, 2048 max tokens, via /api/ghost route.

## Critical Rules
- NEVER use template literals with bash variables like ${VAR} inside JSX/TSX — use string concatenation or replace with placeholder text like ADDR_HERE
- NEVER use raw backslashes in template literals e.g. domain\uid — use domain/uid instead
- All pages must have 'use client' at the very top line
- All Pre components use backtick children passed as JSX, not single-quoted multiline strings
- Colors: green=#00ff41, cyan=#00d4ff, orange=#ffb347, purple=#bf5fff, red=#ff4136

## Project Structure
app/
  page.tsx              — Dashboard (ShanGhost Admin)
  layout.tsx            — Nav with dropdowns (MODULES x13, TOOLS x6, DASHBOARD)
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
  auth/page.tsx         — Login/register page (works offline if Supabase not configured)
  profile/page.tsx      — User profile, badges, lab history
  components/
    GhostAgent.tsx      — AI chat widget, bottom-right, uses Groq API via /api/ghost
    ProgressTracker.tsx — XP tracker, bottom-left above CheatSheet
    CheatSheet.tsx      — Quick ref, bottom-left lowest
    CVEFeed.tsx         — Live CVEs, bottom-right above GhostAgent
    AuthProvider.tsx    — Supabase auth context + NavUserBadge (rank pill in nav)
lib/
  supabase.ts           — Browser Supabase client, type defs, rank utils
  supabase-server.ts    — Server-side Supabase client (API routes only)
supabase-schema.sql     — Full DB schema + seed (run in Supabase SQL Editor)
api/
  ghost/route.ts        — Groq AI chat endpoint
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

## Persona
Platform owner: ShanGhost Admin
Target audience: Beginners to advanced security researchers
Tone: Clear, educational, technically accurate but accessible. Explain concepts like you would to a smart person who is new to security. Avoid jargon without explanation.
