<div align="center">

```
 ██████╗ ██╗  ██╗ ██████╗ ███████╗████████╗███╗   ██╗███████╗████████╗
██╔════╝ ██║  ██║██╔═══██╗██╔════╝╚══██╔══╝████╗  ██║██╔════╝╚══██╔══╝
██║  ███╗███████║██║   ██║███████╗   ██║   ██╔██╗ ██║█████╗     ██║
██║   ██║██╔══██║██║   ██║╚════██║   ██║   ██║╚██╗██║██╔══╝     ██║
╚██████╔╝██║  ██║╚██████╔╝███████║   ██║   ██║ ╚████║███████╗   ██║
 ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚══════╝   ╚═╝   ╚═╝  ╚═══╝╚══════╝   ╚═╝
```

**A full-stack cybersecurity research and training platform.**

13 modules · 243 lab steps · 5,450 XP · 9 live tools · AI Ghost Agent · Full gamification · Mandatory auth gate · Live leaderboard · Fully responsive

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=nextdotjs)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20DB%20%2B%20Realtime-green?style=flat-square&logo=supabase)](https://supabase.com)
[![Groq](https://img.shields.io/badge/Groq-llama--3.3--70b--versatile-orange?style=flat-square)](https://groq.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)
[![Build](https://img.shields.io/badge/Build-46%20pages%2C%200%20errors-brightgreen?style=flat-square)]()
[![Version](https://img.shields.io/badge/Version-1.0.0-blue?style=flat-square)]()

</div>

---

## What is GHOSTNET?

GHOSTNET is a full-stack cybersecurity research and training platform built for security researchers, penetration testers, CTF players, and anyone serious about learning offensive and defensive security from first principles.

It is not a course. It is not a quiz app. It is an **operational platform** — a living system built like a tool, not a tutorial site:

- **13 security modules** — each with a deep concept page and a multi-step interactive lab, covering the full spectrum from beginner Tor/OSINT through to expert-level Red Team operations, Active Directory attacks, and Binary Exploitation
- **243 verified lab steps** across all 13 modules — step-by-step command workflows with answer verification, contextual hints, XP awards, and persistent progress tracking
- **5,450 XP earnable** — calibrated precisely to a 5-rank progression system where completing all 13 labs takes you from Ghost → Legend
- **9 live interactive tools** — payload generator, blockchain tracer, live CVE feed, Shodan query builder, MITRE ATT&CK kill chain visualizer, AI pentest report generator, CTF toolkit, 200+ command reference, and research terminal
- **GHOST AI agent** — powered by Groq's llama-3.3-70b, context-aware per page, operator-identity driven (knows your callsign, rank, completed labs), adapts depth to your skill level, 4096-token responses
- **Cinematic welcome experience** — matrix rain splash screen with scramble-text reveal, boot sequence animation, and phase state machine before authentication; shown on first visit and after every logout
- **Mandatory authentication** — middleware-gated routes, 20-minute sliding inactivity timeout, session cookies with httpOnly/sameSite/secure settings
- **Live leaderboard** — real Supabase data, realtime channel subscriptions, 30-second polling fallback, admin panel with full user monitoring
- **Full gamification** — XP, 5 rank tiers, streak tracking, daily goals, 13+ badges, progress notes per module
- **Fully responsive** — mobile-first nav with hamburger menu, auth-aware PROFILE/ACCOUNT routing, floating widgets auto-hide when mobile menu is open, stat cards and lab content adapted for small screens

---

## Table of Contents

1. [Platform Architecture](#platform-architecture)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [The 13 Security Modules](#the-13-security-modules)
5. [Lab Terminal Engine](#lab-terminal-engine)
6. [The 9 Interactive Tools](#the-9-interactive-tools)
7. [GHOST AI Agent](#ghost-ai-agent)
8. [Gamification and Rank System](#gamification-and-rank-system)
9. [Authentication and Session Management](#authentication-and-session-management)
10. [Leaderboard and Admin Panel](#leaderboard-and-admin-panel)
11. [Database Schema](#database-schema)
12. [Component Architecture](#component-architecture)
13. [API Routes](#api-routes)
14. [Getting Started](#getting-started)
15. [Environment Variables](#environment-variables)
16. [Deployment](#deployment)
17. [Roadmap — Version 2](#roadmap--version-2)

---

## Platform Architecture

```
+------------------------------------------------------------------+
|                           GHOSTNET v1.0                          |
|                                                                  |
|  ENTRY FLOW:  /welcome (splash) → /auth (login) → / (dashboard) |
|               logout / 20-min inactivity → /welcome (splash)     |
|                                                                  |
|  +------------------+  +----------------+  +----------------+   |
|  |   13 MODULES     |  |    9 TOOLS     |  | GAMIFICATION   |   |
|  |  Concept + Lab   |  | Payload · CVE  |  | XP · Ranks     |   |
|  |  243 steps total |  | Blockchain ·  |  | Streaks · Goals|   |
|  |  5,450 XP total  |  | Shodan · ATT&CK|  | Leaderboard    |   |
|  +--------+---------+  +-------+--------+  +-------+--------+   |
|           |                    |                   |             |
|           +----------+---------+-------------------+            |
|                      |                                          |
|  +-------------------v------------------------------------+     |
|  |              LAB TERMINAL ENGINE                       |     |
|  |  Guided steps → answer verification → XP awards       |     |
|  |  Hint system → flag capture → free-form Phase 2       |     |
|  +------------------------+-------------------------------+     |
|                           |                                     |
|  +-----------+  +---------v------+  +---------------------+    |
|  |  GHOST    |  |   SUPABASE     |  |  PROGRESS TRACKER   |    |
|  |  AGENT    |  | Auth + Postgres|  |  localStorage-first |    |
|  | Groq AI   |  | Realtime subs  |  |  Cloud sync via API |    |
|  | Per-user  |  | lab_progress   |  |  Streak + goals     |    |
|  | identity  |  | user_profiles  |  |  Notes per module   |    |
|  +-----------+  +----------------+  +---------------------+    |
+------------------------------------------------------------------+
```

### Design Principles

- **Offline-first**: All progress persists to `localStorage` immediately. Supabase is an enhancement — the platform works completely without it.
- **Content at practitioner depth**: Not "here's what SQL injection is" but "here's the exact sqlmap flag, why the 1000 hash type is NTLM, and what the output of a UNION-based extraction looks like."
- **Terminal aesthetic**: JetBrains Mono throughout, green-on-black. It feels like a tool, not a tutorial site.
- **Single source of truth**: Rank thresholds, XP values, and user data all flow through `lib/supabase.ts` — no duplicated constants across components.
- **Graceful degradation**: Groq key missing → Ghost Agent shows error. Supabase missing → auth bypassed in dev mode, localStorage handles all progress.

---

## Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | Next.js 14 App Router | `'use client'` on all pages |
| Language | TypeScript 5 | `ignoreBuildErrors: false` — strict mode enforced |
| Compiler | Babel (`.babelrc`) | SWC disabled — custom Babel config |
| Styling | Tailwind CSS + inline styles | JetBrains Mono font, terminal aesthetic |
| Auth | Supabase Auth + `@supabase/ssr` | Middleware-gated, httpOnly session cookies |
| Database | Supabase Postgres | `user_profiles`, `lab_progress`, `badges` |
| Realtime | Supabase Realtime | `postgres_changes` on leaderboard |
| AI | Groq API | `llama-3.3-70b-versatile`, 4096 max tokens |
| State | React hooks + localStorage | No Redux/Zustand — intentionally simple |
| Deployment | Vercel / any Node.js host | 46 pages, 0 build errors |

---

## Project Structure

```
ghostnet/
├── app/
│   ├── layout.tsx                  # Root layout: Nav (desktop + mobile hamburger),
│   │                               #   MobileMenuContext hides floating widgets when
│   │                               #   mobile menu open; auth-aware TOOLS list
│   │                               #   (PROFILE when logged in, ACCOUNT when not)
│   ├── page.tsx                    # Dashboard: stats, module grid, tools, learning paths
│   ├── welcome/page.tsx            # Cinematic splash: matrix rain, scramble text,
│   │                               #   boot sequence, phase state machine
│   ├── auth/page.tsx               # Login/register with ?from= redirect preservation
│   ├── leaderboard/page.tsx        # Live leaderboard + admin panel (realtime + polling)
│   ├── profile/page.tsx            # User profile, badges, lab history, rank display
│   │
│   ├── modules/
│   │   ├── tor/                    # MOD-01 · #00ff41 · BEGINNER
│   │   │   ├── page.tsx            # Concept: onion routing, hidden services, opsec
│   │   │   └── lab/page.tsx        # 17 steps · 345 XP
│   │   ├── osint/                  # MOD-02 · #00d4ff · BEGINNER
│   │   │   ├── page.tsx            # Concept: passive recon, Shodan, SOCMINT, metadata
│   │   │   └── lab/page.tsx        # 16 steps · 305 XP
│   │   ├── crypto/                 # MOD-03 · #ffb347 · INTERMEDIATE
│   │   │   ├── page.tsx            # Concept: blockchain forensics, smart contracts, DeFi
│   │   │   └── lab/page.tsx        # 20 steps · 405 XP
│   │   ├── offensive/              # MOD-04 · #bf5fff · INTERMEDIATE
│   │   │   ├── page.tsx            # Concept: pentest methodology, Metasploit, privesc
│   │   │   └── lab/page.tsx        # 20 steps · 400 XP
│   │   ├── active-directory/       # MOD-05 · #ff4136 · ADVANCED
│   │   │   ├── page.tsx            # Concept: Kerberos, BloodHound, DCSync, Golden Ticket
│   │   │   └── lab/page.tsx        # 22 steps · 495 XP
│   │   ├── web-attacks/            # MOD-06 · #00d4ff · ADVANCED
│   │   │   ├── page.tsx            # Concept: blind SQLi, XSS chains, SSRF, deserialization
│   │   │   └── lab/page.tsx        # 21 steps · 445 XP
│   │   ├── malware/                # MOD-07 · #00ff41 · ADVANCED
│   │   │   ├── page.tsx            # Concept: static/dynamic analysis, YARA, Volatility
│   │   │   └── lab/page.tsx        # 22 steps · 465 XP
│   │   ├── network-attacks/        # MOD-08 · #00ffff · INTERMEDIATE
│   │   │   ├── page.tsx            # Concept: ARP spoofing, DNS poisoning, VLAN hopping
│   │   │   └── lab/page.tsx        # 21 steps · 445 XP
│   │   ├── cloud-security/         # MOD-09 · #ff9500 · ADVANCED
│   │   │   ├── page.tsx            # Concept: AWS IAM privesc, IMDS, container escape
│   │   │   └── lab/page.tsx        # 18 steps · 490 XP
│   │   ├── social-engineering/     # MOD-10 · #ff6ec7 · INTERMEDIATE
│   │   │   ├── page.tsx            # Concept: phishing infra, vishing, RFID, deepfakes
│   │   │   └── lab/page.tsx        # 16 steps · 300 XP
│   │   ├── red-team/               # MOD-11 · #ff3333 · EXPERT
│   │   │   ├── page.tsx            # Concept: C2 frameworks, EDR evasion, TIBER-EU
│   │   │   └── lab/page.tsx        # 18 steps · 465 XP
│   │   ├── wireless-attacks/       # MOD-12 · #aaff00 · INTERMEDIATE
│   │   │   ├── page.tsx            # Concept: WPA2, PMKID, evil twin, BLE, Zigbee
│   │   │   └── lab/page.tsx        # 18 steps · 455 XP
│   │   └── mobile-security/        # MOD-13 · #7c4dff · ADVANCED
│   │       ├── page.tsx            # Concept: APK analysis, Frida, iOS, OWASP Mobile
│   │       └── lab/page.tsx        # 18 steps · 435 XP
│   │
│   ├── components/
│   │   ├── GhostAgent.tsx          # AI chat: Groq, operator identity, skill-adaptive,
│   │   │                           #   persistent history, rank pill, real-time rank sync
│   │   ├── LabTerminal.tsx         # Guided lab engine: steps, verification, XP, hints,
│   │   │                           #   flag capture, Supabase sync, localStorage fallback
│   │   ├── FreeLabTerminal.tsx     # Phase 2 open sandbox terminal
│   │   ├── ProgressTracker.tsx     # XP tracker: 13 labs, streaks, daily goals, notes
│   │   ├── CVEFeed.tsx             # Live CVE feed widget (NVD/NIST)
│   │   ├── CheatSheet.tsx          # Quick reference widget
│   │   ├── AuthProvider.tsx        # Supabase auth context + NavUserBadge rank pill
│   │   ├── ModuleCodex.tsx         # Chapter-format deep content renderer
│   │   └── ErrorBoundary.tsx       # React error boundary with terminal-style error UI
│   │
│   └── api/
│       ├── ghost/route.ts          # POST: Groq llama-3.3-70b proxy, 4096 tokens
│       ├── progress/route.ts       # POST/GET: lab completion + XP upsert to Supabase
│       └── auth/callback/route.ts  # Supabase email confirmation redirect handler
│
├── lib/
│   ├── supabase.ts                 # TypeScript types, RANK_LIST, getRank(),
│   │                               #   RANK_COLORS — single source of truth
│   │                               #   for all rank/XP logic on the platform
│   ├── supabase/
│   │   ├── client.ts               # @supabase/ssr browser client factory
│   │   └── server.ts               # @supabase/ssr server client (API routes only)
│
├── middleware.ts                   # Auth gate: all routes protected, unauthenticated
│                                   #   → /welcome, 20-min sliding session timeout
├── supabase-schema.sql             # Full DB schema + triggers + badge seed data
├── CLAUDE.md                       # AI coding assistant project instructions
├── .babelrc                        # Babel config (SWC intentionally disabled)
└── .env.example                    # Environment variable template with instructions
```

**Stats:** 50+ TypeScript files · 243 lab steps · 5,450 XP earnable · 46 built pages · 0 build errors · TypeScript strict mode

---

## The 13 Security Modules

Each module has a **concept page** (deep theory, real tools, case studies, working commands) and a **lab page** (multi-step interactive terminal with verified answers, hints, XP awards, and a free-form Phase 2 sandbox).

| # | Module | Accent | Difficulty | Steps | XP |
|---|--------|--------|------------|-------|----|
| 01 | Tor & Dark Web | `#00ff41` | Beginner | 17 | 345 |
| 02 | OSINT & Surveillance | `#00d4ff` | Beginner | 16 | 305 |
| 03 | Crypto & Blockchain | `#ffb347` | Intermediate | 20 | 405 |
| 04 | Offensive Security | `#bf5fff` | Intermediate | 20 | 400 |
| 05 | Active Directory | `#ff4136` | Advanced | 22 | 495 |
| 06 | Web Attacks Advanced | `#00d4ff` | Advanced | 21 | 445 |
| 07 | Malware Analysis | `#00ff41` | Advanced | 22 | 465 |
| 08 | Network Attacks | `#00ffff` | Intermediate | 21 | 445 |
| 09 | Cloud Security | `#ff9500` | Advanced | 18 | 490 |
| 10 | Social Engineering | `#ff6ec7` | Intermediate | 16 | 300 |
| 11 | Red Team Operations | `#ff3333` | Expert | 18 | 465 |
| 12 | Wireless Attacks | `#aaff00` | Intermediate | 18 | 455 |
| 13 | Mobile Security | `#7c4dff` | Advanced | 18 | 435 |
| | **TOTAL** | | | **243** | **5,450** |

### Content Depth Examples

**MOD-05 Active Directory (22 steps, 495 XP):** Kerberos 4-step authentication protocol, AS-REQ/AS-REP/TGS mechanics, unauthenticated enumeration, AS-REP roasting (GetNPUsers.py), Kerberoasting (etype targeting), BloodHound shortest attack paths, Pass-the-Hash/Ticket with CrackMapExec, DCSync (DRSReplicaSync), credential dumping (comsvcs.dll LSASS), Golden/Silver ticket forging, constrained delegation (S4U2Self/S4U2Proxy), ACL abuse (GenericAll/WriteDACL), shadow credentials (msDS-KeyCredentialLink), DPAPI decryption, AdminSDHolder persistence, cross-forest trust attacks.

**MOD-11 Red Team Operations (18 steps, 465 XP):** C2 framework architecture (Sliver mTLS/WireGuard/DNS/HTTP), malleable C2 profiles, redirectors with nginx mod_rewrite, LOLBins execution (certutil/regsvr32/mshta), lateral movement (wmiexec/smbexec), process injection API chain (VirtualAllocEx/WriteProcessMemory/CreateRemoteThread), process hollowing, APC injection, token impersonation (Potato family), AMSI/ETW bypass techniques, EDR unhooking (SysWhispers/direct syscalls), phishing infrastructure (GoPhish + Evilginx2), supply chain attacks (dependency confusion/SolarWinds/XZ Utils), purple team MITRE ATT&CK mapping, TIBER-EU methodology, pentest reporting structure.

---

## Lab Terminal Engine

The `LabTerminal` component is the core interactive learning mechanism. Each lab runs through two phases:

### Phase 1 — Guided Steps
- Each step presents an **objective** (what to do and why), a **hint** (available on demand, no XP penalty), and expects a specific **answer**
- Answers are verified against `correctAnswers[]` — an array supporting multiple valid forms (e.g. `nmap`, `nmap -sS`, full command flags)
- On correct answer: XP awarded, step advances, output printed to terminal
- On incorrect answer: attempt logged, contextual feedback shown, hint offered
- On completion: total XP saved to `localStorage` instantly, then synced to Supabase `lab_progress` table via `/api/progress`
- Custom `ghostnet_progress_updated` event fired — all widgets (ProgressTracker, GhostAgent, NavUserBadge) react in real time

### Phase 2 — Free Lab
- `FreeLabTerminal` component: open-ended sandbox with a simulated terminal
- No step constraints — operators practice freely in the module context
- XP already awarded; this is pure practice time

### XP and Progress Sync
```
User completes step
  → localStorage updated immediately (offline-first)
  → ghostnet_progress_updated event fired
  → ProgressTracker, GhostAgent, NavUserBadge all re-render
  → If authenticated: POST /api/progress → Supabase upsert
  → Rank recalculated server-side via DB trigger
  → Realtime channel notifies leaderboard
```

---

## The 9 Interactive Tools

| Tool | Path | Description |
|------|------|-------------|
| Live CVE Feed | `/intel` | Real-time NVD/NIST vulnerability feed, filterable by CRITICAL/HIGH/MEDIUM/LOW |
| Command Reference | `/tools` | 200+ security commands with flags explained — nmap, sqlmap, metasploit, hashcat, impacket, CrackMapExec, Frida, AWS CLI and more |
| Research Terminal | `/terminal` | Interactive browser terminal for command practice and output exploration |
| Payload Generator | `/payload` | 40+ attack payloads: reverse shells, XSS, SQLi, LFI, XXE, SSTI, CSRF, command injection |
| Blockchain Tracer | `/crypto-tracer` | Bitcoin and Ethereum transaction tracing, wallet analysis, mixer detection |
| CTF Toolkit | `/ctf` | Decoders, hash identifiers, cipher crackers, RSA tools, steganography helpers, pwntools templates |
| Report Generator | `/report-generator` | AI-assisted pentest report builder: findings manager, AI draft generation, executive summary, copy-ready output |
| Attack Path Visualizer | `/attack-path` | MITRE ATT&CK kill chain builder — 9 phases, 45 techniques, AI narrative generation, preset paths |
| Shodan Builder | `/shodan` | Point-and-click Shodan query constructor — 6 filter groups, 20 example queries, live preview |

---

## GHOST AI Agent

GHOST is the embedded AI research intelligence, rendered as a floating panel (bottom-right).

### Capabilities
- **Full platform knowledge**: knows every module, every lab step, every tool on the platform — answers are tied to actual GHOSTNET content, not generic security information
- **Operator identity**: reads the authenticated user's callsign (username), rank, XP, and completed lab list — addresses operators by name, references their progress, calibrates to their level
- **Skill-level adaptation**: Ghost/Specter operators get first-principles explanations with analogies; Wraith/Legend operators get peer-level exchange with no hand-holding
- **Page context awareness**: knows exactly which page/module/tool the operator is currently on — every vague question is interpreted in context
- **Persistent history**: conversation stored in `localStorage`, survives page navigation, up to 20 messages retained
- **Real-time rank sync**: listens for `ghostnet_progress_updated` events — rank and XP update live without page reload

### Technical Details
- Model: `llama-3.3-70b-versatile` via Groq API
- Max tokens: 4096
- System prompt: operator identity block + full platform knowledge + page context injected per request
- History: last 20 messages sent as context on every request
- Rate limit: Groq free tier — 14,400 requests/day

---

## Gamification and Rank System

### XP and Ranks

All rank thresholds are calibrated to the total earnable XP across all 13 labs (5,450 XP). Every rank is reachable through normal platform use.

| Rank | XP Required | Color | How to reach |
|------|-------------|-------|--------------|
| Ghost | 0 | `#4a9a4a` | Starting rank |
| Specter | 750 | `#00d4ff` | ~2 labs |
| Phantom | 1,800 | `#bf5fff` | ~5-6 labs |
| Wraith | 3,200 | `#ff4136` | ~9-10 labs |
| Legend | 5,000 | `#ffb347` | All 13 labs |

Single source of truth: `RANK_LIST` and `getRank()` exported from `lib/supabase.ts`, imported by ProgressTracker, GhostAgent, AuthProvider, leaderboard — never duplicated.

### Badges (13+ defined in `supabase-schema.sql`)

| Category | Badges |
|----------|--------|
| Rank progression | Specter, Phantom, Wraith, Legend |
| Lab completion | Lab Rat (3 labs), Operator (7), Elite Operator (10), Ghost Protocol (all 13) |
| Module mastery | One badge per module (Tor Master, Domain Lord, Web Assassin, etc.) |
| Streaks | Multi-day streak badges |

### Streak and Daily Goals
- Streak tracked per calendar day — completing any lab step counts as activity
- Daily goals: complete a step today, complete 3+ labs total, reach 50% completion
- All computed client-side from `localStorage` — no server round-trip needed

---

## Authentication and Session Management

### Entry Flow
```
First visit / session expired / after logout
  → /welcome (cinematic splash screen)
  → "ACCESS THE NETWORK" button
  → /auth (login or register)
  → dashboard (or original destination via ?from= param)

Already authenticated with active session
  → /welcome checks session on mount
  → router.replace('/') immediately — splash skipped

Logout (desktop or mobile)
  → supabase.auth.signOut()
  → router.push('/welcome') — splash always shown on sign-out
```

### Session Timeout
- **20-minute sliding inactivity timeout** — cookie refreshed on every request via middleware
- After 20 minutes of no page loads: cookie expires → Supabase session invalidated → next visit shows splash screen and requires re-authentication
- Cookie settings: `httpOnly: true`, `sameSite: 'lax'`, `secure: true` (production), `maxAge: 1200`

### Middleware
`middleware.ts` gates every route except:
- `/welcome`, `/auth`, `/auth/callback` (public)
- `/_next`, `/favicon`, `/api/` (static assets and API)
- Dev mode bypass: if Supabase env vars are not configured, all access is allowed

### Redirect Preservation
Unauthenticated requests to any protected route are redirected to `/welcome?from=ORIGINAL_PATH`. After login, the user is sent to their original destination.

---

## Leaderboard and Admin Panel

### Live Leaderboard (`/leaderboard`)
- Queries `user_profiles` ordered by XP descending, limit 50
- Realtime: `supabase.channel('leaderboard_realtime')` subscribing to `postgres_changes` on `user_profiles` and `lab_progress` tables
- 30-second polling fallback for environments where WebSocket realtime is unavailable
- Shows: rank badge, callsign, XP bar, ghost rank, labs completed count, last active

### Admin Panel
- Visible only to users whose email matches `NEXT_PUBLIC_ADMIN_EMAIL` (comma-separated for multiple admins)
- Shows full user table including email addresses, XP, rank, streak, lab count
- Expandable rows load per-user lab history from `lab_progress` table
- Stats bar: total operators, total labs completed, average XP, highest rank achieved

---

## Database Schema

Full schema in `supabase-schema.sql`. Key tables:

```sql
-- User profiles (auto-created on signup via trigger)
user_profiles (
  id uuid PRIMARY KEY,          -- matches auth.users.id
  username text UNIQUE,
  email text,
  ghost_rank text,              -- Ghost | Specter | Phantom | Wraith | Legend
  xp integer DEFAULT 0,
  streak_days integer DEFAULT 0,
  last_active timestamptz,
  is_public boolean DEFAULT true
)

-- Lab completion records
lab_progress (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES user_profiles,
  lab_id text,                  -- e.g. 'active-directory-lab'
  module_id text,               -- e.g. 'active-directory'
  completed boolean DEFAULT false,
  xp_earned integer DEFAULT 0,
  completed_at timestamptz,
  attempts integer DEFAULT 1
)

-- Badge definitions (seeded)
badges (slug, name, description, icon, color, xp_reward,
        requirement_type, requirement_value)

-- User badge awards
user_badges (user_id, badge_id, earned_at)
```

### Key Database Functions
- `award_xp(p_user_id, p_xp_delta)` — adds XP and automatically recalculates `ghost_rank` via CASE expression
- Rank trigger: Ghost 0 / Specter 750 / Phantom 1,800 / Wraith 3,200 / Legend 5,000
- Auto-profile trigger: creates `user_profiles` row on `auth.users` insert

---

## Component Architecture

### Floating Widget Layout (fixed — do not change)
```
Bottom-left stack:
  CheatSheet button:      bottom: 24px, left: 24px
  ProgressTracker button: bottom: 70px, left: 24px

Bottom-right stack:
  GhostAgent button:      bottom: 24px, right: 24px
  CVEFeed button:         bottom: 70px, right: 24px

All panels open upward. All z-index >= 9000.
```

All four floating widgets are **unmounted** while the mobile menu is open (via `MobileMenuContext`) to prevent overlap. They remount automatically when the menu closes.

### Mobile Navigation
The mobile hamburger menu (≤768px) includes:
- **Auth row at top**: MY PROFILE + LOGOUT when authenticated; LOGIN/CREATE ACCOUNT when not
- **All 13 modules** with CONCEPT and LAB links per module
- **All 9 tools** with descriptions
- Full-height panel with `padding-bottom: 5rem` to avoid clipping near-bottom items
- Closes automatically on any navigation (`useEffect` on `pathname`)

### Module Concept Pages
Every module concept page (`/modules/[name]/page.tsx`) follows a consistent layout:
1. Breadcrumb with CONCEPT / LAB toggle links
2. Page header: module ID, title, subtitle topic tags
3. **4-column stat card grid** (`.module-stat-grid`) — chapters, read time, difficulty, identifier — collapses to 2 columns at ≤640px
4. `<ModuleCodex>` — chapter-by-chapter deep content renderer
5. **Launch Lab CTA** — XP, steps, link to lab + prev/next module navigation

### Event Bus
Custom browser events for cross-component reactivity (no global state manager):
- `ghostnet_progress_updated` — fired on every lab step completion and manual progress toggle. Consumed by: ProgressTracker, GhostAgent, NavUserBadge, Dashboard stats.
- `ghostnet_profile_refresh` — fired after Supabase profile sync. Consumed by: AuthProvider, leaderboard.

### AuthProvider Context
Wraps the entire app. Exposes: `user`, `profile`, `loading`, `signIn`, `signUp`, `signOut`, `refreshProfile`, `isSupabaseConfigured`.

`NavUserBadge` (rendered inside the nav) reads `profile` to show the operator's callsign and rank pill in the top navigation bar.

---

## API Routes

### `POST /api/ghost`
Proxies requests to Groq API.
```typescript
Body: { messages: Message[], systemPrompt: string }
Response: { text: string }
```
Injects operator identity (callsign, rank, XP, completed labs) + page context + full platform knowledge into every request.

### `POST /api/progress`
Awards XP for lab completion and syncs to Supabase.
```typescript
Body: { labId: string, moduleId: string, xpEarned: number, userId?: string }
Response: { success: boolean, totalXp: number }
```
Upserts `lab_progress` record, calls `award_xp()` DB function.

### `GET /api/progress`
Fetches user's complete lab progress from Supabase.
```typescript
Query: ?userId=string
Response: { labs: LabProgress[], totalXp: number }
```

### `GET /api/auth/callback`
Handles Supabase email confirmation redirect. Exchanges code for session, redirects to dashboard.

---

## Getting Started

### Prerequisites
- Node.js 20+
- A Supabase project (free tier) — optional but required for user accounts
- A Groq API key (free tier) — optional but required for Ghost Agent

### Installation

```bash
git clone https://github.com/Levikib/ghostnet.git
cd ghostnet
npm install
```

### Configuration

```bash
cp .env.example .env.local
# Edit .env.local with your keys
```

### Database Setup

1. Go to your Supabase project → SQL Editor
2. Paste and run the entire contents of `supabase-schema.sql`
3. This creates all tables, triggers, functions, and seeds badge data

### Run Development Server

```bash
npm run dev
# Open http://localhost:3000
```

Without Supabase configured, the platform runs in dev mode — all routes accessible, progress saved to localStorage only.

### Build for Production

```bash
npm run build
npm start
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GROQ_API_KEY` | Yes (for Ghost Agent) | Groq API key — free at console.groq.com |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes (for auth) | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes (for auth) | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes (for server API) | Supabase service role key (never expose client-side) |
| `NEXT_PUBLIC_ADMIN_EMAIL` | Yes (for admin panel) | Comma-separated admin email(s) for leaderboard admin tab |
| `SHODAN_API_KEY` | No | Enhances Shodan builder tool |
| `HIBP_API_KEY` | No | HaveIBeenPwned breach lookups |

---

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Add all environment variables in Vercel dashboard → Project → Settings → Environment Variables.

Update Supabase Auth settings:
- **Site URL**: `https://your-project.vercel.app`
- **Redirect URLs**: `https://your-project.vercel.app/api/auth/callback`

### Self-Hosted

```bash
npm run build
PORT=3000 npm start
```

Use nginx as a reverse proxy with SSL (Let's Encrypt via certbot).

---

## Roadmap — Version 2

Version 2 is in active development. The major upgrade:

### Docker Sandbox Environment
Real isolated lab environments — each user session spins up Docker containers on demand:
- **Kali Linux container** — real attack machine with all tools installed (nmap, metasploit, sqlmap, hashcat, impacket, BloodHound, etc.)
- **Vulnerable target containers** — per-module targets: DVWA for web attacks, Metasploitable for offensive, custom AD environment for Active Directory, etc.
- **xterm.js terminal** — real interactive shell in the browser connected via WebSocket
- **Session lifecycle** — containers spin up on lab start, idle timeout tears them down automatically
- **Scenario engine** — randomised vulnerable environments: random target IPs, hostnames, service versions, credentials, flags — different scenario every session

Infrastructure: Oracle Cloud Always Free (Ampere A1, 4 OCPUs, 24GB RAM) running Docker with per-session container orchestration.

### Also Planned for V2
- CTF challenge mode with real flags and timed scoring
- Team/cohort features for instructors
- Module completion certificates

---

## Contributing

This is a private project. For issues, questions, or access requests, open an issue on the repository.

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

```
GHOSTNET // FOR EDUCATIONAL AND AUTHORISED USE ONLY
```

Built by **ShanGhost** · Powered by Next.js, Supabase, and Groq

</div>
