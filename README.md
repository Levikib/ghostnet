# GHOSTNET — Security Research Platform

<div align="center">

```
  ██████  ██░ ██  ▒█████    ██████ ▄▄▄█████▓ ███▄    █ ▓█████▄▄▄█████▓
▒██    ▒ ▓██░ ██▒▒██▒  ██▒▒██    ▒ ▓  ██▒ ▓▒ ██ ▀█   █ ▓█   ▀▓  ██▒ ▓▒
░ ▓██▄   ▒██▀▀██░▒██░  ██▒░ ▓██▄   ▒ ▓██░ ▒░▓██  ▀█ ██▒▒███  ▒ ▓██░ ▒░
  ▒   ██▒░▓█ ░██ ▒██   ██░  ▒   ██▒░ ▓██▓ ░ ▓██▒  ▐▌██▒▒▓█  ▄░ ▓██▓ ░
▒██████▒▒░▓█▒░██▓░ ████▓▒░▒██████▒▒  ▒██▒ ░ ▒██░   ▓██░░▒████▒ ▒██▒ ░
```

**A private security research knowledge base and interactive learning platform**

![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)
![Status](https://img.shields.io/badge/Status-Active%20Development-brightgreen?style=flat-square)

[Live Demo](#) · [Documentation](#modules) · [Contributing](#contributing)

</div>

---

## Overview

GHOSTNET is a comprehensive, self-hostable security research platform built for cybersecurity practitioners, CTF competitors, penetration testers, and blockchain security researchers. It combines structured learning modules with interactive tooling, a live threat intelligence feed, and an embedded AI research agent — all in a terminal-aesthetic Next.js application.

> Built by a security researcher, for security researchers. Every command, technique, and concept documented from first principles to advanced application.

---

## Features

### Learning Modules
| Module | Topics | Labs |
|--------|--------|------|
| **MOD-01 · Tor & Dark Web** | Onion routing, circuit building, hidden services, opsec, deanonymization | 5 hands-on labs |
| **MOD-02 · OSINT & Surveillance** | Passive recon, Shodan, Google dorking, SOCMINT, metadata, Maltego | 6 hands-on labs |
| **MOD-03 · Crypto & Blockchain** | Blockchain forensics, smart contract auditing, DeFi exploits, on-chain tracing | 6 hands-on labs |
| **MOD-04 · Offensive Security** | Pen test methodology, Nmap, SQLi, Metasploit, privilege escalation, reporting | 6 hands-on labs |
| **Active Directory** | BloodHound, Kerberoasting, AS-REP Roasting, DCSync, Golden Ticket, Pass-the-Hash | 5 hands-on labs |
| **Web Attacks (Advanced)** | File upload RCE, SSRF, XXE, deserialization, JWT attacks, GraphQL, request smuggling | 6 hands-on labs |
| **Malware Analysis** | Static/dynamic analysis, Ghidra, YARA rules, memory forensics, Volatility | 4 hands-on labs |

### Interactive Tools

| Tool | Description |
|------|-------------|
| **GHOST Agent** | Embedded AI security research assistant (Groq/Llama 3.3 70B) — context-aware per module, answers any security question in real time |
| **Research Terminal** | In-browser security terminal with filesystem navigation, tool man pages, cheatsheets, CVE lookup, scan simulation |
| **Payload Generator** | 40+ payloads — reverse shells, web shells, SQLi, XSS, privesc, listeners — auto-configured with your LHOST/LPORT |
| **Transaction Tracer** | Blockchain forensics tool — address risk scoring, transaction flow visualization, heuristics reference, live explorer links |
| **Threat Intelligence** | Live CVE feed from NVD API, DeFi exploit tracker, dark web intelligence sources |
| **Tool Reference** | Searchable database of 200+ commands across 18 security tools — filterable by category and tag |
| **CTF Toolkit** | Quick reference for CTF competitions — Web, Crypto, Forensics, Pwnable, OSINT with essential tool directory |

---

## Tech Stack

```
Frontend:     Next.js 14 (App Router) · TypeScript · Tailwind CSS
AI Agent:     Groq API (Llama 3.3 70B) via server-side Next.js route
Threat Intel: NVD API (live CVE feed) · Custom DeFi exploit database
Fonts:        JetBrains Mono · DM Sans (Google Fonts)
Deployment:   Vercel (recommended) · Self-hosted
```

---

## Getting Started

### Prerequisites

```bash
Node.js 18+
npm or yarn
WSL2 (if on Windows) — recommended for full tool compatibility
```

### Installation

```bash
# Clone the repository
git clone https://github.com/Levikib/ghostnet.git
cd ghostnet

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Add your Groq API key (free at console.groq.com)

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Environment Variables

```env
# Required for GHOST Agent AI (free tier available)
GROQ_API_KEY=your_groq_api_key_here

# Optional — Anthropic Claude (alternative to Groq)
# ANTHROPIC_API_KEY=your_key_here
```

Get a free Groq API key at [console.groq.com](https://console.groq.com) — 14,400 requests/day free.

---

## Project Structure

```
ghostnet/
├── app/
│   ├── api/
│   │   └── ghost/          # GHOST Agent server-side API route
│   ├── components/
│   │   └── GhostAgent.tsx  # AI research assistant component
│   ├── modules/
│   │   ├── tor/            # MOD-01: Tor & Dark Web
│   │   ├── osint/          # MOD-02: OSINT & Surveillance
│   │   ├── crypto/         # MOD-03: Crypto & Blockchain
│   │   ├── offensive/      # MOD-04: Offensive Security
│   │   ├── active-directory/  # Active Directory attacks
│   │   ├── web-attacks/    # Advanced web exploitation
│   │   └── malware/        # Malware analysis & RE
│   ├── intel/              # Live threat intelligence dashboard
│   ├── tools/              # Tool command reference
│   ├── terminal/           # In-browser research terminal
│   ├── payload/            # Payload generator
│   ├── crypto-tracer/      # Blockchain transaction tracer
│   ├── ctf/                # CTF toolkit
│   ├── layout.tsx          # Root layout with navigation
│   ├── page.tsx            # Dashboard
│   └── globals.css         # Terminal aesthetic styles
├── .env.local              # Environment variables (not committed)
├── .env.example            # Environment template
├── next.config.js
├── tailwind.config.js
└── package.json
```

---

## Modules

### MOD-01 · Tor & The Dark Web

Complete coverage of Tor's architecture and operational security:

- **Onion Routing** — layered encryption, circuit building, guard/middle/exit node roles
- **Hidden Services** — v3 .onion address cryptography, rendezvous protocol
- **Operational Security** — browser fingerprinting, opsec rules, common deanonymization vectors
- **Deanonymization** — traffic correlation attacks, real-world case studies (Silk Road, Playpen)
- **CLI Usage** — torsocks, Tor daemon configuration, hidden service deployment
- **Labs** — install & verify, circuit analysis with nyx, deploy hidden service, opsec testing, traffic capture

### MOD-02 · OSINT & Surveillance

Full open-source intelligence methodology:

- **Intelligence Cycle** — planning, collection, processing, analysis, dissemination
- **Domain Footprinting** — WHOIS, DNS enumeration, subdomain discovery, ASN mapping
- **Shodan** — complete operator reference, high-value search patterns
- **Google Dorking** — advanced operators, GHDB patterns, exposed file discovery
- **SOCMINT** — Twitter/LinkedIn/Instagram intelligence, platform-specific techniques
- **Metadata Forensics** — exiftool, bulk extraction, GPS coordinate recovery
- **Maltego** — entity relationships, transform chains, hub node identification
- **Automated OSINT** — theHarvester, Recon-ng, SpiderFoot
- **Breach Data** — HaveIBeenPwned, IntelX, Dehashed methodology
- **Labs** — domain footprinting, Shodan recon, Google dorking, social intel, metadata extraction, full target profile

### MOD-03 · Crypto & Blockchain Security

From blockchain fundamentals to DeFi exploitation:

- **Blockchain Architecture** — UTXO model, account model, consensus mechanisms, 51% attacks
- **Transaction Forensics** — common input ownership, change address detection, exchange identification
- **Wallet Analysis** — HD wallet derivation, address type identification, key hierarchy
- **Smart Contract Vulnerabilities** — reentrancy (with DAO deep-dive), integer overflow, access control, flash loans, oracle manipulation
- **Smart Contract Auditing** — Slither, Mythril, Echidna, Foundry, full audit checklist
- **DeFi Architecture** — AMMs, lending protocols, flash loans, bridges — all exploit surfaces
- **Real Exploits** — 9 documented case studies from The DAO to KyberSwap with technical root causes
- **Privacy Coins** — Monero ring signatures, Tornado Cash, forensic tracing through mixers
- **Forensic Tooling** — Chainalysis, TRM Labs, free alternatives
- **Labs** — transaction tracing with Python, wallet clustering, reentrancy deploy/exploit, flash loan demo, Tenderly/Phalcon historical exploit analysis, mini audit report

### MOD-04 · Offensive Security

Full penetration testing methodology:

- **Methodology** — 5 phases, pentest types (black/grey/white/red team), legal requirements
- **Nmap** — complete flag reference, NSE scripts, evasion techniques, timing templates
- **Enumeration** — SMB (enum4linux, CrackMapExec), web (gobuster, ffuf, nikto), SNMP
- **Web Application Attacks** — Burp Suite workflow, manual SQLi, SQLMap
- **Authentication Attacks** — Hydra, Hashcat with full mode reference
- **Metasploit** — full msfconsole workflow, Meterpreter post-exploitation
- **Privilege Escalation** — Linux (SUID, sudo, cron, kernel) and Windows (unquoted paths, token impersonation, Mimikatz)
- **Post-Exploitation** — credential harvesting, lateral movement, Pass-the-Hash
- **Reporting** — professional pentest report structure with CVSS scoring
- **Labs** — Nmap recon against Metasploitable, DVWA web exploitation, SQLi manual + SQLMap, password cracking, Metasploit chain, privilege escalation + first finding report

### Active Directory Attacks

Enterprise network penetration:

- **AD Architecture** — domain controllers, NTDS.dit, Kerberos vs NTLM, GPOs, SPNs
- **BloodHound** — setup, SharpHound collection, high-value queries, attack path visualization
- **Kerberoasting** — SPN enumeration, TGS request, offline cracking with Hashcat
- **AS-REP Roasting** — no-preauth enumeration, unauthenticated hash capture
- **Pass-the-Hash** — CrackMapExec lateral movement, Impacket PSExec/WMIExec
- **DCSync** — replication rights abuse, full domain hash dump, secretsdump.py
- **Golden/Silver Tickets** — krbtgt hash exploitation, persistent domain access
- **LLMNR Poisoning** — Responder setup, NTLMv2 capture and cracking
- **SMB Relay** — signing detection, ntlmrelayx, interactive shell
- **Defence Evasion** — AMSI bypass, PowerShell execution policy, LOLBins

### Web Attacks (Advanced)

Beyond OWASP Top 10:

- **File Upload RCE** — extension blacklist bypass, content-type bypass, magic bytes, polyglot files
- **SSRF** — internal network access, cloud metadata APIs (AWS/GCP/Azure), bypass techniques
- **XXE** — entity injection, blind XXE with OOB exfiltration, SVG/DOCX vectors
- **Insecure Deserialization** — PHP, Java (ysoserial), .NET, Python pickle, Node.js
- **JWT Attacks** — none algorithm, algorithm confusion, secret brute force, kid injection
- **Command Injection** — separator techniques, blind detection, filter bypass, shell upgrade
- **IDOR** — Burp Intruder methodology, mass enumeration, privilege escalation via mass assignment
- **GraphQL** — introspection queries, field suggestion, batch attacks, injection
- **HTTP Request Smuggling** — CL.TE and TE.CL attacks, detection, exploitation
- **Web Cache Poisoning** — unkeyed header identification, XSS via poisoning

### Malware Analysis & Reverse Engineering

- **Methodology** — static vs dynamic analysis trade-offs, when to use each
- **Static Analysis** — strings, PE structure, import table analysis with pefile
- **Sandbox Analysis** — Any.run, Hybrid Analysis, VirusTotal, Triage comparison
- **Dynamic Analysis** — Procmon setup, Regshot, Wireshark during execution
- **Ghidra** — project setup, navigation, decompiler workflow, renaming conventions
- **YARA Rules** — syntax, writing detection rules, testing, community rules
- **Network Analysis** — Wireshark filters for malware, C2 pattern identification
- **Evasion Techniques** — packing, obfuscation, anti-debug, anti-sandbox, process injection, rootkits, fileless/LOLBins
- **Memory Forensics** — Volatility 3 workflow, malfind, SSDT hooks, process dumps

---

## Interactive Tools Reference

### GHOST Agent
The embedded AI assistant uses Groq's Llama 3.3 70B model, served through a server-side Next.js API route. It is context-aware — it knows which module you're currently studying and tailors responses accordingly. Tuned for security research: direct, technical, full command output, no hedging.

### Research Terminal
A fully simulated security research terminal with:
- Persistent filesystem (`/home/ghost/`, `/tools/`, `/etc/`)
- Real file contents (nmap scans, OSINT reports, reverse shell scripts)
- Tool man pages for 15 security tools
- Cheatsheets: nmap, sqli, privesc, opsec, tor, crypto
- CVE lookup for common vulnerabilities
- Scan/enum simulation
- Base64 encode/decode
- Tab completion and command history

### Payload Generator
Pre-configured payload library with your LHOST/LPORT auto-injected:
- **Reverse Shells** — Bash, Python3, Python2, PHP, PowerShell, Perl, Ruby, Node.js, Netcat
- **Web Shells** — PHP (system/passthru/POST), ASPX, JSP
- **SQL Injection** — MySQL union, error-based, time-based blind, file read/write, MSSQL xp_cmdshell
- **XSS** — alert PoC, cookie stealer, img onerror, SVG
- **Privilege Escalation** — SUID binaries, sudo abuse, cron exploitation, Mimikatz, PrintSpoofer
- **Listeners** — nc, rlwrap nc, Python PTY upgrade, socat, Metasploit multi/handler

### Transaction Tracer
Blockchain forensics reference with:
- Pre-loaded historical addresses (Genesis block, DAO hack, mixer pattern demo)
- Risk scoring (0–100) with flag detection
- Transaction flow visualization
- 8 forensic heuristics explained
- Complete tool directory (free vs enterprise)
- Direct links to live blockchain explorers pre-populated with traced address

---

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd ghostnet
vercel

# Add environment variable in Vercel dashboard:
# GROQ_API_KEY = your_key
```

Or connect your GitHub repo at [vercel.com/new](https://vercel.com/new) for automatic deployments on push.

### Self-Hosted

```bash
npm run build
npm start
# Runs on port 3000
```

---

## Security Notice

GHOSTNET is built for **educational and authorised security research purposes only**.

- All exploitation techniques documented are for use against systems you own or have explicit written permission to test
- The platform does not facilitate illegal activity — it documents how attacks work so defenders can understand and prevent them
- Understanding offensive techniques is a prerequisite for effective defence
- Always obtain written authorisation before conducting security assessments

---

## Roadmap

- [ ] **Supabase Auth** — user accounts, progress tracking, completion streaks
- [ ] **Stripe Integration** — Pro tier ($15/mo) for full access
- [ ] **Live CTF Arena** — daily challenges with leaderboard
- [ ] **Attack Simulation Engine** — browser-based vulnerable target VMs
- [ ] **Network Attacks Module** — Wireshark analysis, ARP spoofing, MITM deep-dive
- [ ] **Cloud Security Module** — AWS/GCP/Azure misconfigurations, IAM exploitation
- [ ] **Mobile Security Module** — Android APK analysis, Frida hooking, SSL unpinning
- [ ] **AI-Powered Report Generator** — paste findings → professional pentest report
- [ ] **Community Layer** — writeups, forum, badges

---

## Contributing

Contributions that add technical depth are welcome:

```bash
git fork https://github.com/Levikib/ghostnet
git checkout -b feature/new-module
# Add content
git commit -m "Add: [module name] - [what was added]"
git push origin feature/new-module
# Open pull request
```

Content guidelines:
- Technical accuracy over brevity
- Working commands with real examples
- Cite CVEs and real-world case studies where applicable
- Educational framing — understand to defend

---

## Author

**Levis Kibirie (Levo)**
Founding Fullstack Engineer · Security Researcher · SaaS Builder

- Portfolio: [levo-portfolio.vercel.app](https://levo-portfolio.vercel.app)
- GitHub: [@Levikib](https://github.com/Levikib)
- Built alongside: [Makeja Homes](https://makejahomes.co.ke) — multi-tenant property management SaaS

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

```
GHOSTNET // SECURITY RESEARCH PLATFORM // FOR EDUCATIONAL USE ONLY
```

*"In order to understand your enemy, you have to know everything about them."*

</div>
