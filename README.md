<div align="center">

```
 ██████╗ ██╗  ██╗ ██████╗ ███████╗████████╗███╗   ██╗███████╗████████╗
██╔════╝ ██║  ██║██╔═══██╗██╔════╝╚══██╔══╝████╗  ██║██╔════╝╚══██╔══╝
██║  ███╗███████║██║   ██║███████╗   ██║   ██╔██╗ ██║█████╗     ██║
██║   ██║██╔══██║██║   ██║╚════██║   ██║   ██║╚██╗██║██╔══╝     ██║
╚██████╔╝██║  ██║╚██████╔╝███████║   ██║   ██║ ╚████║███████╗   ██║
 ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚══════╝   ╚═╝   ╚═╝  ╚═══╝╚══════╝   ╚═╝
```

**A private cybersecurity research and training platform.**
13 modules · 65 interactive lab steps · 9 live tools · AI Ghost Agent · Full gamification

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=nextdotjs)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20DB-green?style=flat-square&logo=supabase)](https://supabase.com)
[![Groq](https://img.shields.io/badge/Groq-llama--3.3--70b-orange?style=flat-square)](https://groq.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)
[![Build](https://img.shields.io/badge/Build-45%20pages%2C%200%20errors-brightgreen?style=flat-square)]()

</div>

---

## What is GHOSTNET?

GHOSTNET is a full-stack cybersecurity research and training platform built for security researchers, penetration testers, CTF players, and anyone serious about understanding offensive and defensive security from first principles.

It is not a course. It is not a quiz app. It is an **operational platform** — a living system that combines:

- **Deep educational content** written at practitioner depth across 13 security domains
- **Interactive terminal labs** that simulate real command-line workflows with step verification, flags, XP awards, and persistent progress
- **9 live tools** — payload generator, blockchain tracer, CVE feed, Shodan query builder, attack path visualizer, AI pentest report generator, CTF toolkit, command reference, and research terminal
- **AI research agent (GHOST)** powered by Groq's llama-3.3-70b, with full page context awareness, skill-level adaptation, and persistent conversation memory
- **Complete gamification** — XP system, 10 rank tiers from Script Kiddie to Shadow God, streak tracking, daily goals, leaderboard, and 81-lab progress tracking
- **Supabase auth and cloud sync** — sign in to persist progress across devices; works fully offline via localStorage fallback

---

## Table of Contents

1. [Platform Architecture](#platform-architecture)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [The 13 Security Modules](#the-13-security-modules)
5. [Interactive Lab Terminal Engine](#interactive-lab-terminal-engine)
6. [The 9 Interactive Tools](#the-9-interactive-tools)
7. [AI Ghost Agent](#ai-ghost-agent)
8. [Gamification System](#gamification-system)
9. [Authentication and Data Layer](#authentication-and-data-layer)
10. [Component Architecture](#component-architecture)
11. [API Routes](#api-routes)
12. [Getting Started](#getting-started)
13. [Environment Variables](#environment-variables)
14. [Database Setup](#database-setup)
15. [Deployment](#deployment)
16. [Changelog](#changelog)

---

## Platform Architecture

```
+-------------------------------------------------------------+
|                         GHOSTNET                            |
|                                                             |
|  +---------------+  +--------------+  +----------------+   |
|  |  13 MODULES   |  |   9 TOOLS    |  |  GAMIFICATION  |   |
|  |  Concept +    |  | Payload Gen  |  |  XP + Ranks    |   |
|  |  Lab pages    |  | CVE Feed     |  |  Streaks/Goals |   |
|  |  per module   |  | Blockchain   |  |  Leaderboard   |   |
|  +-------+-------+  +------+-------+  +-------+--------+   |
|          |                 |                  |             |
|          +--------+--------+------------------+            |
|                   |                                        |
|  +----------------v------------------------------------+   |
|  |              LAB TERMINAL ENGINE                    |   |
|  |  Step-by-step answers · Verification · Flags · XP   |   |
|  +---------------------+-------------------------------+   |
|                        |                                   |
|  +----------+  +-------v------+  +--------------------+   |
|  |  GHOST   |  |   SUPABASE   |  |  PROGRESS TRACKER  |   |
|  |  AGENT   |  |  Auth + DB   |  |  Offline-first     |   |
|  |  Groq AI |  | lab_progress |  |  localStorage      |   |
|  | Skill-   |  | user_profile |  |  81 labs tracked   |   |
|  | aware    |  |              |  |                    |   |
|  +----------+  +--------------+  +--------------------+   |
+-------------------------------------------------------------+
```

### Design Principles

- **Offline-first**: All progress persists to `localStorage` immediately. Supabase is an enhancement, not a dependency.
- **Content-first**: Every module is written at practitioner depth — not "here's what SQL injection is" but "here's the exact sqlmap flag, why it works, and what the output means."
- **Terminal aesthetic**: JetBrains Mono throughout, green-on-black terminal color scheme. It feels like a tool, not a tutorial site.
- **Progressive difficulty**: BEGINNER through EXPERT ratings with recommended learning paths for different backgrounds.
- **No vendor lock-in**: Groq API key is optional (GHOST Agent degrades gracefully). Supabase is optional (localStorage fallback handles everything).

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Compiler | Babel (SWC disabled — custom .babelrc) |
| Styling | Tailwind CSS + inline styles (JetBrains Mono font) |
| Auth | Supabase Auth (@supabase/ssr) |
| Database | Supabase Postgres |
| AI | Groq API — llama-3.3-70b-versatile, 2048 max tokens |
| State | React useState/useEffect + localStorage |
| Deployment | Vercel / any Node.js host |

---

## Project Structure

```
ghostnet/
+-- app/
|   +-- layout.tsx                  # Root layout: Nav, floating widgets, ErrorBoundary, OfflineBanner
|   +-- page.tsx                    # Dashboard: Quick Access Bar, module grid, tools, learning paths
|   |
|   +-- modules/
|   |   +-- tor/
|   |   |   +-- page.tsx            # MOD-01 concept: 14 sections, Tor architecture to red team C2
|   |   |   +-- lab/page.tsx        # MOD-01 lab: 5 LabTerminal steps, 130 XP
|   |   +-- osint/
|   |   |   +-- page.tsx            # MOD-02 concept: passive recon, Shodan, SOCMINT, metadata
|   |   |   +-- lab/page.tsx        # MOD-02 lab: DNS enum, Shodan, email harvest, metadata, 130 XP
|   |   +-- crypto/
|   |   |   +-- page.tsx            # MOD-03 concept: blockchain forensics, smart contract auditing
|   |   |   +-- lab/page.tsx        # MOD-03 lab: hash cracking, base64, AES, RSA, 120 XP
|   |   +-- offensive/
|   |   |   +-- page.tsx            # MOD-04 concept: pentest methodology, Metasploit, privesc
|   |   |   +-- lab/page.tsx        # MOD-04 lab: Nmap, Metasploit, payload gen, LinPEAS, 130 XP
|   |   +-- active-directory/
|   |   |   +-- page.tsx            # MOD-05 concept: Kerberoasting, BloodHound, DCSync, Golden Ticket
|   |   |   +-- lab/page.tsx        # MOD-05 lab: enum4linux, Kerberoasting, PtH, DCSync, 145 XP
|   |   +-- web-attacks/
|   |   |   +-- page.tsx            # MOD-06 concept: advanced SQLi, XSS chains, SSRF, deserial
|   |   |   +-- lab/page.tsx        # MOD-06 lab: SQLi, sqlmap, XSS, gobuster, Burp Suite, 120 XP
|   |   +-- malware/
|   |   |   +-- page.tsx            # MOD-07 concept: static/dynamic analysis, YARA, ransomware
|   |   |   +-- lab/page.tsx        # MOD-07 lab: file, strings, strace, tcpdump, 130 XP
|   |   +-- network-attacks/
|   |   |   +-- page.tsx            # MOD-08 concept: ARP spoofing, DNS poisoning, SSL stripping
|   |   |   +-- lab/page.tsx        # MOD-08 lab: arpspoof, tcpdump, etter.dns, bettercap, 125 XP
|   |   +-- cloud-security/
|   |   |   +-- page.tsx            # MOD-09 concept: AWS IAM, S3, IMDS, Lambda, EKS, CI/CD
|   |   |   +-- lab/page.tsx        # MOD-09 lab: IMDS, IAM enum, S3, Lambda, CloudTrail, 145 XP
|   |   +-- social-engineering/
|   |   |   +-- page.tsx            # MOD-10 concept: phishing, deepfakes, BEC, GoPhish
|   |   |   +-- lab/page.tsx        # MOD-10 lab: email headers, SPF, GoPhish port, vishing, 120 XP
|   |   +-- red-team/
|   |   |   +-- page.tsx            # MOD-11 concept: C2, AV evasion, LOLBins, persistence
|   |   |   +-- lab/page.tsx        # MOD-11 lab: C2 select, LOLBins, malleable C2, WMI, reg, 135 XP
|   |   +-- wireless-attacks/
|   |   |   +-- page.tsx            # MOD-12 concept: WPA2, PMKID, evil twin, BLE, Zigbee, RFID
|   |   |   +-- lab/page.tsx        # MOD-12 lab: airmon-ng, airodump, hashcat, wifiphisher, BT, 135 XP
|   |   +-- mobile-security/
|   |       +-- page.tsx            # MOD-13 concept: APK analysis, Frida, iOS, OWASP Mobile
|   |       +-- lab/page.tsx        # MOD-13 lab: jadx, ADB, Frida, SSL bypass, iOS, 130 XP
|   |
|   +-- components/
|   |   +-- GhostAgent.tsx          # AI chat: Groq, skill-aware, persistent history, rank pill
|   |   +-- LabTerminal.tsx         # Interactive lab engine: steps, verification, XP, flags
|   |   +-- ProgressTracker.tsx     # XP tracker: 81 labs, streaks, goals, notes
|   |   +-- CVEFeed.tsx             # Live CVE feed from NVD/NIST
|   |   +-- CheatSheet.tsx          # Quick reference widget
|   |   +-- AuthProvider.tsx        # Supabase auth context + NavUserBadge
|   |   +-- ErrorBoundary.tsx       # React error boundary with RETRY
|   |
|   +-- leaderboard/page.tsx        # Global rankings, module progress grid
|   +-- profile/page.tsx            # User profile, badges, rank history
|   +-- auth/page.tsx               # Login/register (works offline)
|   +-- attack-path/page.tsx        # MITRE ATT&CK kill chain builder
|   +-- crypto-tracer/page.tsx      # Blockchain transaction tracer
|   +-- ctf/page.tsx                # CTF toolkit (decoders, cipher crackers)
|   +-- intel/page.tsx              # Live CVE feed page
|   +-- payload/page.tsx            # 40+ attack payload library
|   +-- report-generator/page.tsx   # AI pentest report builder
|   +-- shodan/page.tsx             # Shodan query constructor
|   +-- terminal/page.tsx           # Interactive research terminal
|   +-- tools/page.tsx              # 200+ command reference
|
+-- api/
|   +-- ghost/route.ts              # POST: Groq llama-3.3-70b proxy
|   +-- progress/route.ts           # POST/GET: lab completion + XP upsert
|   +-- auth/callback/route.ts      # Supabase email confirmation redirect
|
+-- lib/
|   +-- supabase.ts                 # Browser client, type defs, rank utils
|   +-- supabase/client.ts          # @supabase/ssr browser client factory
|   +-- supabase/server.ts          # @supabase/ssr server client factory
|
+-- supabase-schema.sql             # Full DB schema + seed data
+-- CLAUDE.md                       # AI coding assistant instructions
+-- .babelrc                        # Babel config (SWC disabled intentionally)
+-- .env.example                    # Environment variable template
```

**Stats**: 47 TypeScript files, 17,463 total lines of code, 45 built pages, 0 errors.

---

## The 13 Security Modules

Each module has two pages: a **concept page** (deep theory, tools, real-world examples) and a **lab page** (5 interactive steps via LabTerminal with verified answers, hints, flags, and XP).

### MOD-01 — Tor & Dark Web `#00ff41` | BEGINNER

Tor architecture, onion routing (Guard/Middle/Exit), circuit building and path selection algorithm, v3 hidden services (Ed25519 key derivation, introduction/rendezvous protocol), traffic analysis attacks (guard correlation, timing, website fingerprinting, Sybil), opsec failures and case studies (Silk Road, Carnegie Mellon, Harvard bomb threat), bridge types (obfs4/meek-azure/Snowflake/WebTunnel), C2 infrastructure over Tor, vanity .onion generation (mkp224o), hidden service hardening (HiddenServiceAuthorizeClient), OnionScan enumeration.

**Lab**: service status check → /etc/tor/torrc path → curl SOCKS5 proxy test → HiddenServiceDir directive → hostname file read. **130 XP.**

---

### MOD-02 — OSINT & Surveillance `#00d4ff` | BEGINNER

Passive vs active recon distinction, DNS reconnaissance (dig, AXFR zone transfers, PTR lookups), Shodan (filters: port/product/country/org/ssl.cert.subject.cn/http.title/tag:ics, CLI usage), Google Dorking (GHDB operators: site/filetype/intitle/inurl/intext), certificate transparency (crt.sh, CT log mechanics), SOCMINT (Sherlock 300+ platforms, Holehe email-to-profile, LinkedIn org charts), metadata forensics (ExifTool GPS/author/company extraction), theHarvester, Maltego relationship graphs.

**Lab**: dnsenum/dig → sublist3r/subfinder → Shodan product:apache country:de dork → theHarvester → ExifTool. **130 XP.**

---

### MOD-03 — Cryptography & Blockchain `#ffb347` | INTERMEDIATE

Hash identification by length (MD5=32, SHA-1=40, SHA-256=64), hashcat modes (0=MD5, 100=SHA-1, 1000=NTLM, 1800=sha512crypt, 3200=bcrypt), Base64 encoding/decoding, AES-256-CBC with OpenSSL (pbkdf2 flag importance), RSA key generation and public key extraction, blockchain forensics (UTXO model, Ethereum account model, Etherscan, Chainalysis techniques), smart contract vulnerabilities (reentrancy, flash loans, oracle manipulation), Slither/Mythril/Echidna, and audit report structure.

**Lab**: MD5 identification → hashcat -m 0 → base64 decode "hello world" → openssl enc -out → genrsa 4096. **120 XP.**

---

### MOD-04 — Offensive Security `#bf5fff` | INTERMEDIATE

PTES methodology (6 phases), Nmap mastery (SYN scan -sS, version -sV, OS -O, scripts -sC, timing -T1-T5, output -oN/-oX/-oG, evasion decoys/fragmentation), service enumeration (SMB/FTP/SSH/HTTP), Gobuster/Nikto, OWASP Top 10 2021, SQL injection (manual to sqlmap), password attacks (hashcat rules/masks, hydra HTTP-form-POST), Metasploit framework (search/use/set/run, meterpreter commands, msfvenom), Linux privesc (SUID/GTFOBins, sudo -l, writable /etc/passwd, cron hijacking), Windows privesc (whoami /priv, AlwaysInstallElevated, token impersonation), pentest report structure.

**Lab**: -sS flag → -sV flag → search eternalblue → windows/x64/meterpreter/reverse_tcp → linpeas. **130 XP.**

---

### MOD-05 — Active Directory `#ff4136` | ADVANCED

AD structure and Kerberos flow (AS-REQ/AS-REP/TGS-REQ/TGS-REP), Kerberoasting (GetUserSPNs.py → hashcat -m 13100), AS-REP Roasting, BloodHound attack path analysis (bloodhound-python collector, neo4j, "Shortest path to Domain Admins" query), Pass-the-Hash (CrackMapExec smb -H flag), Pass-the-Ticket, DCSync (impacket-secretsdump -just-dc-ntlm, DS-Replication rights), Golden Ticket (krbtgt hash + Mimikatz kerberos::golden, 10-year validity), Silver Ticket, ACL abuse (WriteDACL/GenericWrite/ForceChangePassword), constrained/unconstrained delegation, forest trust attacks.

**Lab**: enum4linux → GetUserSPNs.py → CrackMapExec PtH → bloodhound-python → impacket-secretsdump. **145 XP.**

---

### MOD-06 — Web Attacks Advanced `#00d4ff` | ADVANCED

Blind SQLi (boolean: AND 1=1/1=2, time-based: SLEEP(5), second-order, INTO OUTFILE to RCE), stored XSS chains (cookie theft → CSRF → account takeover), DOM-based XSS, CSP bypass, SSRF to AWS IMDS (169.254.169.254/latest/meta-data/iam/security-credentials/), SSRF filter bypass (DNS rebinding/IPv6/decimal IP), Java deserialization (ysoserial gadget chains), PHP deserialization (POP chains), GraphQL introspection/batch attacks/NoSQL injection, IDOR, HTTP request smuggling (CL.TE/TE.CL), JWT attacks (alg:none/key confusion), OAuth 2.0 misconfigs.

**Lab**: single quote SQLi → sqlmap --dbs → alert(1) XSS → gobuster dir → Burp Suite Ctrl+F forward. **120 XP.**

---

### MOD-07 — Malware Analysis `#00ff41` | ADVANCED

Safe environment setup (FlareVM, REMnux, INetSim network simulation), analysis phases (triage/static/dynamic/reporting), PE structure (magic bytes, sections .text/.data/.rsrc, imports table, entropy — high=packed/encrypted), FLOSS for obfuscated strings, x64dbg debugging workflow (ScyllaHide anti-anti-debug, breakpoints, memory inspection), ransomware anatomy (5 stages: initial access → pre-encryption → encryption → post-encryption → monetisation), ransomware family table (LockBit 3.0/Conti/ALPHV/CL0P/REvil with key characteristics), YARA rule writing, Volatility memory forensics (malfind/pslist/netscan/cmdline), IR checklist.

**Lab**: file type identification → strings extraction → PE imports tool → strace system calls → tcpdump -i -w capture. **130 XP.**

---

### MOD-08 — Network Attacks `#00ffff` | INTERMEDIATE

ARP spoofing theory (stateless protocol, gratuitous ARP abuse), arpspoof/ettercap for MITM positioning, IP forwarding requirement, tcpdump (interface -i, write -w, filters), DNS poisoning (etter.dns configuration, dnschef, Kaminsky attack mechanics), SSL stripping (bettercap https.proxy, sslstrip, HSTS bypass), VLAN hopping (double-tagging, DTP switch spoofing), Scapy packet crafting (IP/TCP/UDP/ICMP, send/sendp/sniff), 802.1X and NAC evasion.

**Lab**: arpspoof tool → tcpdump -i → /etc/ettercap/etter.dns → bettercap SSL stripping → knock client. **125 XP.**

---

### MOD-09 — Cloud Security `#ff9500` | ADVANCED

AWS service attack surface table (10 services), automated enumeration (enumerate-iam, ScoutSuite, Prowler, Pacu), Terraform state file credential theft, 15 IAM privilege escalation paths (iam:PassRole + lambda:CreateFunction = admin path), EC2 IMDS credential theft (169.254.169.254, IMDSv1 no-auth vs IMDSv2 token), Lambda exploitation (environment variable theft, event injection, layer poisoning, update function code for RCE), EKS attack (aws-auth ConfigMap bypass, kubectl secret dump), CI/CD pipeline attacks (6 attack types: source poisoning/build injection/artifact tampering/registry compromise/deployment abuse/secret theft), CloudTrail analysis.

**Lab**: IMDS URL → enumerate-iam tool → aws s3 ls --no-sign-request → aws lambda get-function-configuration → GetCallerIdentity CloudTrail event. **145 XP.**

---

### MOD-10 — Social Engineering `#ff6ec7` | INTERMEDIATE

Cialdini's 6 principles weaponised (reciprocity/commitment/social proof/authority/liking/scarcity), attack surface table by role (6 roles: admin/finance/HR/IT helpdesk/executive/customer service), email header analysis (Received header path tracing), SPF/DKIM/DMARC mechanics and checking, BEC taxonomy with documented losses (CEO fraud/W-2 theft/vendor impersonation/attorney impersonation/account compromise — $26B+ annually), smishing and quishing (QR code phishing mechanics), deepfakes and AI-assisted SE (ElevenLabs voice cloning, HeyGen video synthesis, $25M Hong Kong incident), red team campaign 6-phase planning with timelines, GoPhish framework architecture, MFA type vs SE resistance table.

**Lab**: Received email header → SPF TXT record type → pretexting definition → GoPhish port 3333 → CLI spoofing. **120 XP.**

---

### MOD-11 — Red Team Operations `#ff3333` | EXPERT

Red team vs pentest distinction (adversary simulation vs VA, timeline/stealth/purple team), 7-phase campaign methodology, C2 framework comparison (Cobalt Strike/Sliver/Havoc/Brute Ratel C4), C2 infrastructure (nginx redirectors with mod_rewrite, domain fronting, CDN-based C2), Malleable C2 Profiles (traffic blending to Teams/S3/etc.), AV/EDR evasion (AMSI bypass via AmsiScanBuffer patch, ETW patching, reflective DLL injection, process hollowing, Donut shellcode loader, obfuscation techniques), LOLBins (certutil/regsvr32/rundll32/mshta/wscript/MSBuild), persistence mechanisms (HKCU Run keys, schtasks, WMI subscriptions, DLL hijacking, COM hijacking), data staging and exfil (7z, dnscat2, iodine, HTTPS to cloud storage, timing transfers).

**Lab**: C2 framework identification → PowerShell LOLBin → Malleable C2 Profiles concept → wmiexec lateral movement → HKCU registry Run key path. **135 XP.**

---

### MOD-12 — Wireless Attacks `#aaff00` | INTERMEDIATE

Hardware comparison table (5 adapters: Alfa AWUS036ACH/Panda PAU09/TP-Link TL-WN722N/HackRF One/Ubertooth One), monitor mode (airmon-ng start, iw dev, check kill), WPA2 4-way handshake capture (airodump-ng --bssid -c -w, aireplay-ng deauth), hashcat WPA2 cracking (hcxpcapngtool conversion, -m 22000, wordlist+rules+masks), WPA3 + Dragonblood vulnerability table (CVE-2019-9494/9496/9498/13377), WPA-Enterprise 802.1X (hostapd-wpe RADIUS server, eaphammer, MSCHAPv2 → asleap crack), BLE GATT testing (gatttool, ubertooth, replay attacks), Zigbee/Z-Wave (KillerBee, rtl_433, SDR frequency monitoring), RFID/NFC cloning (Flipper Zero, Proxmark3, MIFARE Classic darkside attack), wireless detection/defence table.

**Lab**: airmon-ng start wlan0 → airodump-ng --bssid → hashcat mode 22000 → wifiphisher evil twin → hcitool scan BT. **135 XP.**

---

### MOD-13 — Mobile Security `#7c4dff` | ADVANCED

Android security model table (7 layers: Linux kernel/HAL/ART/app sandbox/permissions/SELinux/Keystore, each with bypass methods), APK structure (AndroidManifest.xml, classes.dex, lib/ native), native library analysis (.so with Ghidra/radare2), ADB workflow (shell/logcat/pull/push/monkey), Frida dynamic instrumentation (frida-ps/Java.use()/implementation override/crypto logger hooking SecretKeySpec + Cipher.doFinal), iOS security architecture table (Secure Enclave/TrustZone/SIP/App Sandbox/ASLR+PIE), iOS jailbreak tools (checkra1n/palera1n/Dopamine), iOS data storage locations (Keychain/NSUserDefaults/Core Data/iCloud backup — what's accessible without jailbreak), full Burp Suite proxy setup for both platforms, 6-phase mobile pentest methodology, OWASP Mobile Top 10 2024 (M1-M10), mobile malware indicator table, 14-tool reference.

**Lab**: jadx decompile → adb shell → frida-ps -U → objection SSL bypass → iOS NSUserDefaults backup accessible. **130 XP.**

---

## Interactive Lab Terminal Engine

The `LabTerminal` component (`app/components/LabTerminal.tsx`, 380 lines) is the core interactive learning engine.

### Step Interface

```typescript
export interface LabStep {
  id: string          // unique step identifier
  title: string       // step heading shown in card
  objective: string   // what the user must do/answer
  hint: string        // revealed on "hint" command or HINT button
  answers: string[]   // accepted answers — any match passes
                      // '*' = any non-empty input accepted
  flag?: string       // optional FLAG{...} reward displayed on pass
  xp: number          // XP awarded for correct answer
  explanation: string // explanation shown after correct answer
}
```

### Answer Matching

```typescript
function normalise(s: string) {
  return s.trim().toLowerCase().replace(/\s+/g, ' ')
}

function checkAnswer(input: string, answers: string[]): boolean {
  const norm = normalise(input)
  return answers.some(a => {
    if (a === '*') return norm.length > 0
    return normalise(a) === norm || norm.includes(normalise(a))
  })
}
```

Whitespace-tolerant, case-insensitive, substring-matching. A user typing `nmap -sS` matches against `['nmap -sS', '-sS', 'syn scan']` regardless of spacing.

### Features

| Feature | Detail |
|---------|--------|
| Answer normalisation | Case-insensitive, whitespace-collapsed, substring match |
| Wildcard | `answers: ['*']` accepts any non-empty input |
| Hint system | `hint` command or HINT button — shows step hint in terminal output |
| Skip | `skip` command — advances without XP (flag not revealed) |
| Clear | `clear` command — clears terminal output buffer |
| XP flash | Fixed-position `+N XP` toast with CSS fadeUp animation |
| Step progress bar | Color-coded segments per step |
| FLAG display | `FLAG{...}` rendered in accent color after correct answer |
| localStorage | Key `lab_{labId}` — persists `{completed[], xp, step, done}` |
| Supabase sync | POST `/api/progress` on full lab completion if authenticated |
| Restart | Clears localStorage + resets all state to step 0 |
| Offline resilience | Supabase wrapped in try/catch — localStorage always succeeds |

### Total Lab XP Available

| Lab | XP |
|-----|-----|
| MOD-01 Tor | 130 |
| MOD-02 OSINT | 130 |
| MOD-03 Crypto | 120 |
| MOD-04 Offensive | 130 |
| MOD-05 Active Directory | 145 |
| MOD-06 Web Attacks | 120 |
| MOD-07 Malware | 130 |
| MOD-08 Network Attacks | 125 |
| MOD-09 Cloud Security | 145 |
| MOD-10 Social Engineering | 120 |
| MOD-11 Red Team | 135 |
| MOD-12 Wireless | 135 |
| MOD-13 Mobile Security | 130 |
| **TOTAL** | **1,695 XP** |

---

## The 9 Interactive Tools

### 1. Threat Intel `/intel`
Live CVE feed from NVD/NIST. Filterable by CRITICAL/HIGH/MEDIUM/LOW severity. Each entry links to the full NVD detail page. Combine with Shodan Builder to find internet-exposed instances of vulnerable software.

### 2. Tool Reference `/tools`
200+ working security commands across every major tool: Nmap, SQLmap, Metasploit, msfvenom, Hydra, Hashcat, Gobuster, Burp Suite, ffuf, Nikto, Impacket, CrackMapExec, BloodHound, Mimikatz, netcat, socat, Wireshark/tshark, aircrack-ng suite, Frida/Objection, ADB, AWS CLI, Docker/kubectl. Every command is copy-ready with explanations.

### 3. Research Terminal `/terminal`
Browser-based interactive terminal for command exploration, syntax practice, and workflow research without switching to a VM.

### 4. Payload Generator `/payload`
40+ offensive payloads: reverse shells (bash/Python/PHP/PowerShell/netcat/socat), XSS vectors (reflected/stored/DOM/polyglots/filter bypasses), SQL injection (UNION/boolean blind/time-based/error-based/stacked), LFI path traversal, command injection, XXE (basic/file read/SSRF/blind OOB), SSTI (Jinja2/Twig/Freemarker/Smarty), CSRF, open redirect. Each documented with mechanical explanation of how and why it works.

### 5. Blockchain Tracer `/crypto-tracer`
On-chain transaction analysis for Bitcoin and Ethereum. Input wallet address or tx hash to visualize fund flows, identify exchange deposits (KYC choke points), flag mixer usage (Tornado Cash/CoinJoin/Wasabi), and build attribution chains — same methodology as Chainalysis and TRM Labs.

### 6. CTF Toolkit `/ctf`
Base64/hex/binary/URL encoders-decoders, hash identifier, frequency analysis, ROT13/Caesar/Vigenere crackers, steganography helpers (stegsolve/zsteg/steghide workflow), RSA attack tools (common factor/small exponent/Wiener's), format string helpers, pwntools templates.

### 7. Report Generator `/report-generator`
Full AI-assisted pentest report builder: engagement form, AI executive summary generation, dynamic findings manager (unlimited findings with severity/CVSS/asset/description/impact/recommendation), AI draft buttons per finding, structured plaintext output with copy button, risk summary badges. AI drafts as a senior penetration tester.

### 8. Attack Path Visualizer `/attack-path`
MITRE ATT&CK kill chain builder. 9 phases, 5 techniques per phase (45 total with real T-IDs). Add steps, assign targets, add evidence notes, reorder, generate AI narrative, export. Presets: "Classic External Pentest" (9 steps) and "Phishing to Domain Compromise" (8 steps).

### 9. Shodan Query Builder `/shodan`
Point-and-click Shodan query constructor. 6 filter groups (Network/Location/Service/SSL-TLS/HTTP/ICS-IoT). Live query preview. 20 curated example queries. Negate any filter. Open Shodan directly with assembled query.

---

## AI Ghost Agent

The Ghost Agent (`app/components/GhostAgent.tsx`, 807 lines) is a context-aware AI research assistant on every page.

### System Architecture

```
User input
  |
  v
GhostAgent component
  |-- reads ghostnet_progress from localStorage
  |-- computes current rank + XP + labs completed
  |-- builds systemPrompt:
  |     [USER PROFILE]      <- skill-level calibration
  |   + [SYSTEM_PROMPT]     <- 350-line expert security mentor prompt
  |   + [PAGE_CONTEXT]      <- per-page 500-1000 word detail map
  |
  v
POST /api/ghost
  |
  v
Groq API (llama-3.3-70b-versatile, 2048 tokens)
  |
  v
Response -> MessageBubble renderer (code block highlighting)
  |
  v
saveHistory() -> localStorage ghost_chat_history (last 20 messages)
```

### Skill-Level Calibration

| Rank | Guidance Injected |
|------|------------------|
| Script Kiddie | "Explain fundamentals clearly — avoid jargon without definition. Use analogies." |
| Recon Agent | "User has basics down. Focus on practical commands and tool usage." |
| Threat Hunter | "Go beyond basics — cover edge cases and tool flags." |
| Exploit Dev+ | "Go deep on technical mechanics. Skip basics, lead with the technique." |
| Ghost Tier+ | "Treat as a peer. Precise technical language, edge cases, opsec implications." |

### Page Context Coverage

`PAGE_CONTEXT` covers every route with a dedicated expert brief:
- All 13 module concept pages (each 300-600 words of precise technical detail)
- All 13 module lab pages (exact exercise breakdowns)
- All 9 tool pages (feature documentation, use cases, Ghost help capabilities)
- Dashboard page (full platform overview)

### Features

| Feature | Detail |
|---------|--------|
| Persistent memory | Last 20 messages saved to `ghost_chat_history` localStorage |
| Clear history | CLEAR button in header — wipes and resets to welcome message |
| Rank pill | Header shows current rank live from localStorage |
| Code rendering | Triple-backtick blocks render as styled terminal `<pre>` |
| Quick prompts | Context-sensitive suggestions per page type |
| Typing indicator | 3-dot bounce animation |
| Error handling | Inline error display, no crash |
| Offline fallback | API failure silently handled |
| Footer | "powered by Groq llama-3.3-70b" |

---

## Gamification System

### Rank Progression

| Rank | XP Required | Color |
|------|------------|-------|
| Script Kiddie | 0 | #5a7a5a |
| Recon Agent | 500 | #00d4ff |
| Threat Hunter | 1,500 | #00ff41 |
| Exploit Dev | 3,000 | #ffb347 |
| Red Operator | 5,000 | #ff4136 |
| Ghost Tier | 8,000 | #bf5fff |
| Ghost Operative | 12,000 | #bf5fff |
| Phantom | 18,000 | #ff6ec7 |
| Wraith | 26,000 | #ff3333 |
| Shadow God | 36,000 | #ff9500 |

### Streak Logic

```
On lab toggle (complete):
  today    = new Date().toDateString()
  lastAct  = new Date(progress.lastActivity).toDateString()
  yesterday = new Date(Date.now() - 86400000).toDateString()

  if lastAct === yesterday  -> streak + 1
  if lastAct === today      -> streak unchanged
  else                      -> streak = 1 (reset)
```

### Progress Tracker Widget

Three-tab floating panel (bottom-left):
- **PROGRESS**: 81 labs across 13 modules, click-to-toggle, XP award/deduct
- **GOALS**: Streak counter, 3 daily goals, XP/rank/labs summary, leaderboard link
- **NOTES**: Per-module markdown note editor, saved to localStorage

### Leaderboard `/leaderboard`

Two tabs:
- **GLOBAL TOP 10**: Ranked operators table with XP, labs, streak, rank badge. I/II/III medals for top 3.
- **MODULE PROGRESS**: 13-module grid with color-coded progress bars

Personal stats card reads from localStorage. Sign-in prompt to appear on global board.

---

## Authentication and Data Layer

### Supabase Schema Summary

```sql
user_profiles (
  id, user_id, username, xp, rank,
  completed_labs TEXT[],
  streak_days INTEGER,
  last_activity TIMESTAMPTZ,
  badges TEXT[],
  created_at, updated_at
)

lab_progress (
  id, user_id, lab_id, module_id,
  xp_earned INTEGER,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, lab_id)   -- idempotent completion
)

-- RPC
update_xp_and_rank(p_user_id UUID, p_xp_delta INT)
  -> increments xp, recalculates rank tier
```

### Offline-First Architecture

```
Lab complete event
  |
  +-> localStorage.setItem('lab_' + id, JSON)   <- always, sync
  |
  +-> supabase.auth.getUser()
        |
        +-- [authenticated] -> POST /api/progress -> DB upsert + XP RPC
        |
        +-- [not auth / offline] -> silent catch, localStorage is truth
```

---

## Component Architecture

### Floating Widget Positions

```
Bottom-left stack:         Bottom-right stack:
  CheatSheet:  b:24 l:24     GhostAgent: b:24 r:24
  Progress:    b:70 l:24     CVEFeed:    b:70 r:24
All panels open upward. All z-index >= 9000.
```

### Error Boundary

React class component wrapping all floating widgets and main `{children}`. Catches render errors, shows error message + RETRY button, logs to console.

### Offline Banner

`OfflineBanner` in layout root. Listens to `window offline/online` events. Shows amber warning bar when `navigator.onLine === false`. Text: "OFFLINE MODE — AI features and cloud sync unavailable. Progress saves locally."

---

## API Routes

### POST /api/ghost

```json
Request:  { "systemPrompt": "...", "messages": [{"role":"user|assistant","content":"..."}] }
Response: { "text": "..." }
Model: llama-3.3-70b-versatile | Max tokens: 2048
```

### POST /api/progress

```json
Request:  { "user_id": "uuid", "lab_id": "string", "module_id": "string", "xp_earned": 130 }
Response: { "success": true }
Behavior: UPSERT lab_progress (unique user_id+lab_id), call update_xp_and_rank RPC
```

### GET /api/auth/callback

Supabase email confirmation handler. Exchanges code for session, redirects to `/profile`.

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- Supabase project (optional)
- Groq API key (optional)

### Installation

```bash
git clone https://github.com/yourusername/ghostnet.git
cd ghostnet
npm install
cp .env.example .env.local
# Edit .env.local with your keys
npm run dev
```

Visit `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

---

## Environment Variables

```bash
# Supabase (optional — platform works without it)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Groq (optional — Ghost Agent degrades gracefully without it)
GROQ_API_KEY=gsk_your_groq_api_key
```

---

## Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Open SQL Editor
3. Paste and run `supabase-schema.sql`

This creates all tables, RLS policies, the XP RPC function, and seed data.

---

## Deployment

### Vercel

```bash
npm i -g vercel
vercel
# Set env vars in Vercel Dashboard
```

### Notes

- `.babelrc` must remain present — SWC is intentionally disabled
- `NEXT_PUBLIC_` prefix required on all client-side env vars
- All 45 pages build as static — no server runtime required except API routes

---

## Changelog

### v2.0 — April 2026 (Current)

#### TASK 2 — Interactive Lab Terminal Engine
- New `LabTerminal` component (380 lines): step state machine, answer verification with normalisation, hint system, FLAG rewards, XP flash animations, progress bar
- localStorage persistence per lab (`lab_{id}` key)
- Supabase cloud sync on lab completion for authenticated users
- Wired into all 13 module lab pages — 65 total interactive steps, 1,695 total XP available

#### TASK 3 — Content Depth Upgrade (6 modules massively expanded)
- MOD-01 Tor: 8 → 14 sections. Added: C2 over Tor, vanity .onion (mkp224o), hidden service hardening, OnionScan, red team detection, bridge comparison table
- MOD-07 Malware: 9 → 13 sections. Added: INetSim setup, PE entropy analysis, FLOSS, x64dbg workflow with ScyllaHide, ransomware family table, full IR checklist
- MOD-09 Cloud Security: 7 → 12 sections. Added: AWS attack surface table, 15 IAM privesc paths, Lambda exploitation, EKS attack, CI/CD pipeline attacks, defensive baseline
- MOD-10 Social Engineering: 7 → 11 sections. Added: attack surface by role table, BEC taxonomy with dollar figures, deepfakes + AI-assisted SE, 6-phase red team planning, MFA resistance table
- MOD-12 Wireless: 7 → 13 sections. Added: hardware comparison table, WPA3 Dragonblood table, WPA-Enterprise RADIUS capture, BLE GATT testing, Zigbee/Z-Wave, RFID/NFC cloning
- MOD-13 Mobile Security: 7 → 13 sections. Added: Android security model table, Frida crypto logger script, iOS architecture table, jailbreak tools, iOS data storage table, OWASP Mobile Top 10 2024

#### TASK 4 — Gamification
- `/leaderboard` page: global top 10 table, module progress grid, personal stats card
- ProgressTracker GOALS tab: visual streak counter, 3 daily goals, XP/rank summary, leaderboard link
- Streak tracking with calendar-day logic (increment on consecutive days, reset on gap)

#### TASK 5 — Ghost Agent Upgrade
- Skill-level awareness: reads rank/XP from localStorage, injects USER PROFILE section into every Groq API call
- Persistent chat history: save/restore last 20 messages via `ghost_chat_history` localStorage key
- CLEAR button in header to reset history
- Rank pill displayed live in chat header
- Footer updated to "powered by Groq llama-3.3-70b"

#### TASK 6 — UI/UX CTA Overhaul
- Quick Access Bar on homepage: 6 accent-colored shortcut links with glow on primary
- Module cards: LAUNCH LAB button with box-shadow glow, CONCEPT demoted to secondary
- Module preview panel: LAUNCH LAB as primary glowing CTA, READ CONCEPT secondary
- Nav: "BOARD" link added pointing to /leaderboard

#### TASK 7 — Polish and Hardening
- `ErrorBoundary` component: wraps all 4 floating widgets + main page content, RETRY button
- `OfflineBanner`: live navigator.onLine tracking, amber persistent warning bar
- All components tested: 45 pages, 0 build errors

### v1.0 — March 2026

Initial platform launch: 13 modules, 9 tools, Ghost Agent, Supabase auth, ProgressTracker, CVE feed, unified nav with dropdowns.

---

## License

MIT License — see [LICENSE](LICENSE) for full text.

**For educational and authorised security research use only.**

---

<div align="center">

```
GHOSTNET // SECURITY RESEARCH PLATFORM
FOR EDUCATIONAL AND AUTHORISED USE ONLY
BUILT BY SHANGHOST ADMIN
```

*"Understanding how systems break is how you learn to defend them."*

</div>
