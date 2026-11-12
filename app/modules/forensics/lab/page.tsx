'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import LabTerminal, { LabStep } from '../../../components/LabTerminal'
import FreeLabTerminal from '../../../components/FreeLabTerminal'

const accent = '#5ccfe0'
const moduleId = 'forensics'
const moduleName = 'Digital Forensics'
const moduleNum = '18'

const steps: LabStep[] = [
  // ── SECTION 1: Acquisition & Integrity ───────────────────────────────────
  {
    id: 'frn-01',
    title: 'Verify the Image Hash',
    objective: `A workstation, FIN-WS-14, was seized after a suspected intrusion and payroll data theft. You receive the forensic image GN-0042.raw with an acquisition record stating sha256 = 9f2c0b7d...e41a.

Before you analyse anything, you must prove the working copy is identical to what was acquired. What command computes the SHA-256 of the image so you can compare it to the recorded value?`,
    hint: 'The GNU coreutils tool for SHA-256 ends in "sum". Point it at the image file.',
    answers: ['sha256sum GN-0042.raw', 'sha256sum /evidence/GN-0042.raw', 'shasum -a 256 GN-0042.raw'],
    xp: 15,
    explanation: `sha256sum reads the whole image and prints its digest:

  $ sha256sum GN-0042.raw
  9f2c0b7d41e2c8a60f1b...e41a  GN-0042.raw   -> MATCH

Integrity is the foundation of every finding. You hash the source before acquisition, the image after, and re-verify at each custody change. A match proves nothing was altered; a mismatch means the evidence is compromised and inadmissible.

MD5/SHA-1 are still seen in older records, but SHA-256 is recorded now so the integrity proof survives future scrutiny. E01 containers verify their own embedded per-block hashes with ewfverify.`
  },
  {
    id: 'frn-02',
    title: 'Mount the Image Read-Only',
    objective: `Hashes match. You want to browse the filesystem without altering a single timestamp. Mounting read-write would let the OS replay the journal and update access times, destroying evidence.

What command mounts the raw image read-only via a loop device at /mnt/evid?`,
    hint: 'Use mount with -o and the "ro" option; a raw disk image needs "loop" too.',
    answers: ['mount -o ro,loop GN-0042.raw /mnt/evid', 'mount -o ro GN-0042.raw /mnt/evid', 'sudo mount -o ro,loop GN-0042.raw /mnt/evid'],
    xp: 18,
    explanation: `mount -o ro,loop attaches the image through a loopback device in read-only mode:

  $ sudo mount -o ro,loop,offset=671088640 GN-0042.raw /mnt/evid
  $ ls /mnt/evid
  '$MFT'  Users  Windows  'System Volume Information'

Read-only is not optional in forensics. Even listing a directory read-write can update last-access times and trigger indexing. For real court work you place a hardware write blocker between the source drive and the workstation; for an image you examine a copy and mount ro. The offset comes from mmls, which maps the partition start.`
  },

  // ── SECTION 2: Filesystem & Windows Execution ────────────────────────────
  {
    id: 'frn-03',
    title: 'Hunt the Timestomped File',
    objective: `Browsing C:/Users/j.doe/AppData/Local/Temp you find svvhost.exe dated 2019 — suspiciously old for a 2026 intrusion. You suspect timestomping and need to compare its $STANDARD_INFORMATION (SI) and $FILE_NAME (FN) timestamps.

Which Eric Zimmerman tool parses the $MFT into CSV so you can compare the SI and FN timestamps of every record?`,
    hint: 'The tool name is MFTECmd. Point it at the $MFT with -f and output --csv.',
    answers: ['MFTECmd -f $MFT --csv out', 'MFTECmd -f $MFT', 'MFTECmd.exe -f $MFT --csv out', 'MFTECmd'],
    flag: 'GHOST{si_predates_fn_timestomp}',
    xp: 22,
    explanation: `MFTECmd decodes each 1024-byte record and exposes both timestamp sets:

  Entry     : 94213-3   InUse: False
  FileName  : Temp/svvhost.exe
  SI Created: 2019-04-11 03:12:44   <- what the attacker set
  FN Created: 2026-11-02 23:51:08   <- the real creation (kernel-only)

SI timestamps can be rewritten from user space (SetFileTime); FN timestamps are set only by the kernel during create/rename and cannot be stomped by normal APIs. When SI predates FN, the file was timestomped. The true creation — 2 November — matches the intrusion window. The $UsnJrnl and $LogFile preserve the real sequence even after a stomp.`
  },
  {
    id: 'frn-04',
    title: 'Prove Execution with Prefetch',
    objective: `You need to prove svvhost.exe actually ran, not merely existed on disk, and how many times. Windows wrote a Prefetch file for it under C:/Windows/Prefetch.

Which tool parses the .pf file SVVHOST.EXE-9B1F2C07.pf to reveal the run count and last-run times?`,
    hint: "Eric Zimmerman's Prefetch parser is PECmd. Use -f for a single file or -d for the Prefetch folder.",
    answers: ['PECmd -f SVVHOST.EXE-9B1F2C07.pf', 'PECmd -d Prefetch', 'PECmd.exe -f SVVHOST.EXE-9B1F2C07.pf', 'PECmd'],
    xp: 20,
    explanation: `PECmd decodes the prefetcher record:

  Executable name : SVVHOST.EXE
  Run count       : 4
  Last run        : 2026-11-03 00:05:12
  Other run times : 2026-11-02 23:51:11, 23:55:40, 23:59:03
  Referenced      : ws2_32.dll, wininet.dll, Temp/exfil.dat

Prefetch is the single strongest execution artifact on a workstation: it proves the program executed, when, and roughly how often, and lists the files it touched. ws2_32 and wininet in the reference list mean the binary used network APIs — consistent with a beacon. Note Prefetch is often disabled on SSD-only servers.`
  },
  {
    id: 'frn-05',
    title: 'Pivot on Amcache',
    objective: `Prefetch proved execution. Now you want a hash of the binary to pivot against threat intel, plus confirmation it was present even if Prefetch had been cleared. Amcache.hve records the path, size, compile time and a SHA-1 of each executable the system has seen.

Which tool parses Amcache.hve?`,
    hint: 'AmcacheParser, again from the Eric Zimmerman suite. Use -f on the hive.',
    answers: ['AmcacheParser -f Amcache.hve --csv out', 'AmcacheParser -f Amcache.hve', 'AmcacheParser.exe -f Amcache.hve'],
    xp: 20,
    explanation: `AmcacheParser extracts, per executable:

  Path      : C:/Users/j.doe/AppData/Local/Temp/svvhost.exe
  SHA1      : b7e4...9c2a
  Size      : 71680
  Compiled  : 2026-10-29 14:02:11

That SHA-1 is your pivot — feed it to VirusTotal or an internal IOC feed to identify the malware family. Amcache complements Shimcache (AppCompatCache, in the SYSTEM hive), which records path, last-modified time and an execution flag but no hash. Together they routinely catch tools that ran once and were deleted before anything else recorded them.`
  },

  // ── SECTION 3: Persistence & User Activity ───────────────────────────────
  {
    id: 'frn-06',
    title: 'Find the Persistence Run Key',
    objective: `The attacker needs to survive a reboot. You suspect an autostart entry. Which registry key launches a program for ALL users at logon and is the classic place to plant persistence?

Give the registry key path (forward slashes are fine).`,
    hint: 'It is under HKLM SOFTWARE, Microsoft/Windows/CurrentVersion, and the final key is literally "Run".',
    answers: [
      'HKLM/SOFTWARE/Microsoft/Windows/CurrentVersion/Run',
      'SOFTWARE/Microsoft/Windows/CurrentVersion/Run',
      'HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run',
      'HKLM/Software/Microsoft/Windows/CurrentVersion/Run',
    ],
    flag: 'GHOST{runkey_updater_persistence}',
    xp: 22,
    explanation: `The machine-wide autorun key:

  HKLM/SOFTWARE/Microsoft/Windows/CurrentVersion/Run
    "Updater" = C:/Users/j.doe/AppData/Local/Temp/svvhost.exe

RegRipper or RECmd pull this from the offline SOFTWARE hive in seconds. The per-user equivalent lives in HKCU (NTUSER.DAT). Other persistence lives in Services (SYSTEM hive), Scheduled Tasks (System32/Tasks), WMI event subscriptions (fileless) and the Startup folder. Sysinternals Autoruns in offline-hive mode scans every autostart location at once — run it first to triage persistence quickly.`
  },
  {
    id: 'frn-07',
    title: 'Parse the LNK Shortcut',
    objective: `You find Q4_payroll.lnk in the user's Recent folder. An LNK is created automatically when a file is opened and embeds the target path, size, timestamps and the source volume — even after the target is gone.

Which tool parses the LNK to show what file was opened and from where?`,
    hint: 'LECmd (Link Explorer command line). Use -f on the .lnk file.',
    answers: ['LECmd -f Q4_payroll.lnk', 'LECmd -d Recent', 'LECmd.exe -f Q4_payroll.lnk', 'LECmd'],
    xp: 20,
    explanation: `LECmd decodes the shortcut:

  Target path    : E:/exfil/Q4_payroll.xlsx
  Target size    : 2,118,144
  Drive type     : Removable storage media
  Volume label   : KINGSTON    Serial: 8C41-02FF
  Target created : 2026-11-02 22:40:11

This proves a payroll spreadsheet was opened from a removable USB volume named KINGSTON. Cross-reference the USBSTOR registry key and the Excel JumpList (AutomaticDestinations) referencing the same file to show the user copied a sensitive document onto a specific, identifiable device at a precise time.`
  },

  // ── SECTION 4: Recovery & Browser ────────────────────────────────────────
  {
    id: 'frn-08',
    title: 'Carve a Deleted File',
    objective: `The attacker deleted their tooling, but deleted data persists in unallocated space until overwritten. You want to recover deleted executables and documents from the raw image by their file signatures (headers/footers).

What command carves files out of GN-0042.raw into an output folder named carved?`,
    hint: 'foremost (-i input, -o output) or photorec. Carving ignores the filesystem and matches signatures.',
    answers: [
      'foremost -i GN-0042.raw -o carved',
      'foremost -t all -i GN-0042.raw -o carved',
      'photorec GN-0042.raw',
      'scalpel GN-0042.raw -o carved',
    ],
    xp: 24,
    explanation: `foremost scans for header/footer signatures and extracts the bytes between:

  $ foremost -t exe,pdf,jpg,xlsx -i GN-0042.raw -o carved
  Processing: GN-0042.raw
  exe:= 3   pdf:= 37   jpg:= 142   xlsx:= 9
  # output in carved/exe, carved/pdf, with an audit.txt index

Carving recovers content, not metadata — files are named by offset, so you identify them by content. PhotoRec is more format-aware and recovers from damaged/formatted media; scalpel is a fast config-driven carver. One of the carved EXEs is svvhost.exe, letting you hash the actual binary even though it was deleted.`
  },
  {
    id: 'frn-09',
    title: 'Extract Browser History',
    objective: `You want to know what the user searched for and visited. Chromium stores this in a SQLite database called History (urls and visits tables).

Write a sqlite3 command that selects the url column from the urls table of the History database.`,
    hint: 'sqlite3 <db> followed by a SQL query in quotes. The table is "urls".',
    answers: [
      'sqlite3 History "SELECT url FROM urls;"',
      'sqlite3 History "SELECT url FROM urls"',
      'sqlite3 History "SELECT url, visit_count FROM urls;"',
      'sqlite3 History',
    ],
    xp: 20,
    explanation: `Querying the History store reveals intent:

  sqlite> SELECT datetime(last_visit_time/1000000-11644473600,
          'unixepoch'), url FROM urls ORDER BY last_visit_time DESC;
  2026-11-02 22:35 | https://anonfiles-mirror.example/upload
  2026-11-02 22:31 | https://google.com/search?q=exfiltrate+data+usb

Chrome timestamps are microseconds since 1601 — the epoch math converts them to UTC. The Downloads table records each file's source URL, target path and size. Firefox uses places.sqlite. Deleted rows often survive in the SQLite freelist and the -wal file, so "cleared" history is frequently recoverable.`
  },

  // ── SECTION 5: Memory Forensics (Volatility 3) ───────────────────────────
  {
    id: 'frn-10',
    title: 'List Processes from Memory',
    objective: `The machine was captured live, so you also have a RAM image, mem.raw. RAM holds running and fileless malware that disk never will. You start with the active process list.

What Volatility 3 command lists the running processes in the Windows memory image?`,
    hint: 'The runner is vol (or vol.py). Plugins are namespaced by OS: windows.pslist.',
    answers: ['vol -f mem.raw windows.pslist', 'vol.py -f mem.raw windows.pslist', 'volatility3 -f mem.raw windows.pslist', 'python3 vol.py -f mem.raw windows.pslist'],
    xp: 18,
    explanation: `windows.pslist walks the kernel's active EPROCESS list:

  PID    PPID   ImageFileName   CreateTime
  848    740    svchost.exe     2026-11-02 19:03:19
  5120   848    svvhost.exe     2026-11-02 23:51:11   <- odd child of svchost
  6710   5120   cmd.exe         2026-11-03 00:04:55

Volatility 3 dropped the profile system — it fetches the right symbols automatically. pslist is fast but a rootkit can unlink its process from the list; the next technique (psscan) catches what pslist misses. windows.pstree renders the parent-child hierarchy so lineage anomalies like svvhost.exe spawning cmd.exe stand out.`
  },
  {
    id: 'frn-11',
    title: 'Find Injected Code',
    objective: `svvhost.exe may have injected code into a legitimate process. You need to find memory that is private, committed and executable (PAGE_EXECUTE_READWRITE) but not backed by any file on disk — the signature of process injection.

What Volatility 3 command finds injected/unmapped executable memory?`,
    hint: 'The plugin is windows.malfind. It flags RWX regions with no file backing.',
    answers: ['vol -f mem.raw windows.malfind', 'vol.py -f mem.raw windows.malfind', 'volatility3 -f mem.raw windows.malfind'],
    flag: 'GHOST{malfind_rwx_mz_injection}',
    xp: 26,
    explanation: `windows.malfind dumps suspicious regions and disassembles their start:

  Process: svchost.exe  PID: 848
  Address: 0x1f2a0000  Protection: PAGE_EXECUTE_READWRITE
  0x1f2a0000  4d 5a 90 00 03 00 00 00   MZ......   <- PE header in RWX

An MZ header (4D 5A) at the top of a private, committed, RWX region that is not file-backed is a reflectively-loaded PE — injected code. Legitimate executables are mapped from image files, not allocated as anonymous RWX. Dump the region and triage it. This is how you catch injection and process hollowing that leave nothing on disk.`
  },
  {
    id: 'frn-12',
    title: 'Recover Network Connections',
    objective: `You want the C2 address svvhost.exe was talking to, including connections that have since closed and no longer show in a live netstat. Volatility carves network objects out of the memory pool.

What Volatility 3 command recovers the network connections from the image?`,
    hint: 'The plugin is windows.netscan — it scans the pool for socket/connection objects.',
    answers: ['vol -f mem.raw windows.netscan', 'vol.py -f mem.raw windows.netscan', 'volatility3 -f mem.raw windows.netscan'],
    xp: 22,
    explanation: `windows.netscan reconstructs endpoints from pool memory:

  Proto  LocalAddr     LPort  ForeignAddr      FPort  State        PID
  TCPv4  10.0.14.22    49771  185.220.101.17   443    ESTABLISHED  5120
  TCPv4  10.0.14.22    49772  185.220.101.17   8443   CLOSE_WAIT   8044

PID 5120 (svvhost.exe) holds a beacon to 185.220.101.17:443. netscan finds connections that a live netstat would miss because the socket object lingers in the pool after the connection closes. This IP becomes a pivot you will confirm against the network logs. windows.cmdline would also reveal the full command line the process was launched with.`
  },

  // ── SECTION 6: Timeline & IOC ────────────────────────────────────────────
  {
    id: 'frn-13',
    title: 'Build the Super-Timeline',
    objective: `You have many artifacts; now you fuse them onto one chronological axis. Plaso runs dozens of parsers (MFT, registry, EVTX, Prefetch, SRUM, browser) and writes every event into a single storage file.

What command runs log2timeline to extract everything from GN-0042.raw into timeline.plaso?`,
    hint: 'The engine is log2timeline.py. Give it the storage file then the image.',
    answers: [
      'log2timeline.py timeline.plaso GN-0042.raw',
      'log2timeline.py --storage-file timeline.plaso GN-0042.raw',
      'log2timeline timeline.plaso GN-0042.raw',
      'log2timeline.py --storage-file timeline.plaso GN-0042.raw',
    ],
    xp: 24,
    explanation: `log2timeline builds the Plaso store:

  $ log2timeline.py --storage-file timeline.plaso GN-0042.raw
  [INFO] Processing completed.
    Events extracted : 4,318,662
    Parsers used     : mft, usnjrnl, winreg, winevtx, prefetch,
                       srum, sqlite/chrome, lnk, filestat ...

A super-timeline fuses filesystem and application artifacts so a Prefetch run, the Run key that launched it, the 4688 process-creation event and the resulting network connection all line up to the second. The cost is volume — millions of events — which is why the next step filters. On large images, constrain parsers or a date range up front.`
  },
  {
    id: 'frn-14',
    title: 'Filter the Timeline',
    objective: `4.3 million events is unreadable. You want only the intrusion window — 23:00 on 2 November to 03:00 on 3 November — rendered to CSV in UTC.

What psort command renders timeline.plaso to a CSV file (breach.csv) you can open in Timeline Explorer?`,
    hint: 'psort.py with -o l2tcsv and -w for the output file, reading the .plaso store.',
    answers: [
      'psort.py -o l2tcsv -w breach.csv timeline.plaso',
      'psort.py -z UTC -o l2tcsv -w breach.csv timeline.plaso',
      'psort.py -w breach.csv timeline.plaso',
      'psort.py -o l2tcsv -w breach.csv timeline.plaso',
    ],
    xp: 20,
    explanation: `psort filters and renders the Plaso store:

  $ psort.py -z UTC -o l2tcsv -w breach.csv timeline.plaso
      "date > '2026-11-02 23:00:00' AND date < '2026-11-03 03:00:00'"

  Time (UTC)   Source    Description
  23:51:08     FILE      svvhost.exe created (FN born)
  23:51:11     PREFETCH  SVVHOST.EXE first run
  23:52:40     REG       Run key 'Updater' set
  00:09:02     PREFETCH  BEACON.EXE first run
  02:00:00     SRUM      svvhost.exe 100MB sent

Always constrain by time and set the timezone, or you drown. Timeline Explorer lets you sort, filter and colour-tag the CSV so attacker clusters stand out. You pivot from one known event outward.`
  },
  {
    id: 'frn-15',
    title: 'Find the Flag in Slack Space',
    objective: `The filesystem shows a file cleanup.log of only 1 KB, but it occupies a 4 KB cluster — leaving 3 KB of file slack that still holds whatever was there before. You suspect a planted marker hides in that slack.

What command extracts the slack space from the image so you can run strings over it?`,
    hint: "The Sleuth Kit's blkls with -s extracts slack. Pipe it to strings.",
    answers: [
      'blkls -s GN-0042.raw | strings',
      'blkls -s GN-0042.raw',
      'blkls -s GN-0042.raw | strings | grep GHOST',
      'blkls --slack GN-0042.raw | strings',
    ],
    flag: 'GHOST{slack_space_never_forgets}',
    xp: 24,
    explanation: `blkls -s carves only the slack; strings then reveals readable data:

  $ blkls -s GN-0042.raw > slack.dd
  $ strings slack.dd | grep -i ghost
  marker: GHOST{slack_space_never_forgets}

Slack space is invisible to the operating system and to any logical file copy — which is exactly why forensics works on full physical images. A 1 KB file in a 4 KB cluster leaves 3 KB holding whatever previously occupied those sectors. Deleted fragments, old passwords and planted markers routinely survive in slack long after the parent data is gone.`
  },
  {
    id: 'frn-16',
    title: 'Hash and Look Up the IOC',
    objective: `You carved svvhost.exe back from unallocated space. To confirm it against threat intelligence you need its SHA-256 to submit to VirusTotal or match against your IOC list.

What command computes the SHA-256 of the recovered svvhost.exe?`,
    hint: 'Same hashing tool as step 1, pointed at the recovered binary.',
    answers: ['sha256sum svvhost.exe', 'sha256sum carved/exe/svvhost.exe', 'shasum -a 256 svvhost.exe'],
    xp: 20,
    explanation: `Hashing the sample makes it a shareable, pivotable indicator:

  $ sha256sum svvhost.exe
  3b1f9a0c7d...e22f  svvhost.exe
  # IOC match: "QuietRAT" loader, first seen 2026-10-27

A file hash is a precise indicator of compromise: you can sweep every other endpoint for the same hash (Velociraptor across the fleet), block it, and attribute it to a known family. Amcache gave you a SHA-1 earlier; computing the SHA-256 of the actual recovered binary is stronger and standard for IOC sharing in STIX/MISP feeds.`
  },

  // ── SECTION 7: Exfil & Logs ──────────────────────────────────────────────
  {
    id: 'frn-17',
    title: 'Prove Exfiltration with SRUM',
    objective: `You need to show how much data left the host and under which application — even though the tool was deleted. SRUM (SRUDB.dat) records per-application network bytes in hourly buckets.

Which tool parses SRUDB.dat into readable CSVs?`,
    hint: 'SrumECmd (Eric Zimmerman). Use -f on SRUDB.dat.',
    answers: ['SrumECmd -f SRUDB.dat --csv out', 'SrumECmd -f SRUDB.dat', 'SrumECmd.exe -f SRUDB.dat --csv out'],
    xp: 22,
    explanation: `SrumECmd ties application, user and bytes to time:

  Timestamp            Application        SentBytes    RecvBytes
  2026-11-03 00:00:00  Temp/svvhost.exe   48,112,640     204,800
  2026-11-03 01:00:00  Temp/svvhost.exe   61,204,992     189,440
  # ~100 MB pushed outbound overnight under the deleted binary's name

SRUM is one of the most powerful and underused artifacts: it survives the deletion of the tool and proves resource usage by application. Roughly 100 MB sent at 02:00 under svvhost.exe is direct evidence of exfiltration that you will corroborate against the firewall accept log and Volatility netscan.`
  },
  {
    id: 'frn-18',
    title: 'Confirm the Logon in the Event Log',
    objective: `You need to place the user — or an attacker — interactively at the console. The Windows Security event log records authentication with specific event IDs.

What Security event ID records a SUCCESSFUL logon?`,
    hint: 'It is a four-digit ID in the 46xx range. Successful logon, not failure (that is 4625).',
    answers: ['4624', 'event 4624', 'id 4624', 'event id 4624'],
    xp: 20,
    explanation: `Event ID 4624 = successful logon. Parse Security.evtx with EvtxECmd:

  EvtxECmd.exe -f Security.evtx --csv out
  4624  2026-11-02 21:55:03  Logon Type 2   j.doe   (interactive)
  4688  2026-11-02 23:51:12  svvhost.exe  ppid=svchost
  4634  2026-11-03 02:07:31  logoff  j.doe

Logon Type matters: Type 2 is console-interactive, Type 3 is network (SMB), Type 10 is RDP. Key IDs: 4624 logon, 4625 failed logon, 4688 process creation (with command line if auditing is on), 4672 special privileges, 7045 service install, 1149 RDP auth. Chainsaw and Hayabusa run detection rules across EVTX at speed.`
  },

  // ── SECTION 8: Integrity & Reporting ─────────────────────────────────────
  {
    id: 'frn-19',
    title: 'Document the Chain',
    objective: `Before this reaches court, you must show the evidence was handled under an unbroken, documented record from seizure to presentation — who had it, when, and why, with the hash re-verified at every transfer.

What is the name for this documented, continuous record of evidence handling? (two words)`,
    hint: 'If this record has a single unexplained gap, the evidence can be excluded. "___ of custody".',
    answers: ['chain of custody', 'the chain of custody', 'custody chain'],
    xp: 22,
    explanation: `Chain of custody is the documented, continuous record of everyone who handled an exhibit:

  Exhibit  : GN-2026-0042-HDD1
  Seized   : 2026-11-03 09:14 by J. Mensah (warrant #2026-118)
  Acquired : 2026-11-03 11:02  sha256 9f2c...e41a  (verified)
  Transfers: locker A-7 (seal 00318) -> bench 2 -> locker A-7 (seal 00412)
  Hash re-verified at each change: MATCH

A single unexplained gap lets opposing counsel argue the evidence was altered or substituted, and a judge may exclude it entirely. Tamper-evident seals, unique exhibit numbers and cryptographic hashes make the chain both a signature trail and a mathematical one.`
  },
  {
    id: 'frn-20',
    title: 'Write the Finding',
    objective: `The examination is done. Four independent artifacts — SRUM bytes, the firewall accept log, a Zeek session and Volatility netscan — all agree that ~100 MB of payroll data went to 185.220.101.17 at 02:00. Now you produce the deliverable that presents these defensible, reproducible conclusions.

What is this final deliverable called? (one or two words)`,
    hint: 'It is the document a judge, jury or executive actually reads — the forensic ___.',
    answers: ['forensic report', 'report', 'the report', 'dfir report', 'examination report'],
    flag: 'GHOST{case_closed_defensible_report}',
    xp: 21,
    explanation: `The report is the product — a finding no one can read, reproduce or defend has no value.

  Finding 3 - Data exfiltration of payroll records
    Claim      : ~100 MB sent from FIN-WS-14 to 185.220.101.17,
                 02:00-02:08 on 2026-11-03.
    Evidence   : SRUM (104,857,600 bytes), firewall accept log,
                 Zeek conn.log, Volatility netscan PID 5120.
    Confidence : High - four independent artifacts agree.
    Caveats    : TLS-encrypted; file contents inferred from host LNK.

A defensible report separates fact from interpretation, states confidence honestly, records what was NOT found, and lets an independent examiner reproduce every conclusion. Master that discipline across host, memory, network and cloud, and the tools — which keep changing — become mere details. Case closed.`
  },
]

const xpTotal = steps.reduce((sum, s) => sum + s.xp, 0)

export default function ForensicsLab() {
  const [guidedDone, setGuidedDone] = useState(false)
  const [freeLaunched, setFreeLaunched] = useState(false)
  const [earnedXp, setEarnedXp] = useState(0)
  const [showKeywords, setShowKeywords] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('lab_forensics-lab')
    if (saved) {
      const d = JSON.parse(saved)
      if (d.done) { setGuidedDone(true); setEarnedXp(d.xp || 0) }
    }
  }, [])

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#4a7a82' }}>
        <Link href="/" style={{ color: '#4a7a82', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>&#8250;</span>
        <Link href="/modules/forensics" style={{ color: '#4a7a82', textDecoration: 'none' }}>DIGITAL FORENSICS</Link>
        <span>&#8250;</span>
        <span style={{ color: accent }}>LAB</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px', alignItems: 'center' }}>
          <Link href="/modules/forensics" style={{ textDecoration: 'none', padding: '3px 10px', border: '1px solid #16303a', borderRadius: '3px', color: '#4a7a82', fontSize: '7.5px', letterSpacing: '0.1em' }}>&#8592; CONCEPT</Link>
          <span style={{ padding: '3px 10px', background: 'rgba(92,207,224,0.1)', border: '1px solid rgba(92,207,224,0.4)', borderRadius: '3px', color: accent, fontSize: '7.5px', letterSpacing: '0.1em', fontWeight: 700 }}>LAB ACTIVE</span>
        </div>
      </div>

      {/* Progress banner */}
      <div style={{ background: 'rgba(92,207,224,0.04)', border: '1px solid rgba(92,207,224,0.15)', borderRadius: '6px', padding: '10px 16px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' as const }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {[{ label: 'PHASE 1', done: true, active: !guidedDone }, { label: 'PHASE 2', done: guidedDone, active: guidedDone }].map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.done ? accent : '#16303a', border: p.active ? '2px solid ' + accent : '1px solid #16303a', boxShadow: p.active ? '0 0 6px ' + accent : 'none' }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: p.done ? accent : '#2a5a62', letterSpacing: '0.1em' }}>{p.label}</span>
              {i === 0 && <span style={{ fontSize: '7px', color: '#16303a', margin: '0 2px' }}>—</span>}
            </div>
          ))}
        </div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#4a7a82' }}>
          MOD-{moduleNum} &nbsp;·&nbsp; {moduleName.toUpperCase()} &nbsp;·&nbsp; {xpTotal} XP &nbsp;·&nbsp; {steps.length} STEPS
        </div>
        {guidedDone && (
          <div style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: accent, fontWeight: 700 }}>
            &#10003; GUIDED PHASE COMPLETE — LAUNCH FREE LAB BELOW
          </div>
        )}
      </div>

      {/* Section index */}
      <div style={{ background: 'rgba(92,207,224,0.02)', border: '1px solid rgba(92,207,224,0.08)', borderRadius: '6px', padding: '12px 16px', marginBottom: '1.5rem', fontFamily: 'JetBrains Mono, monospace' }}>
        <div style={{ fontSize: '7px', color: '#1d4852', letterSpacing: '0.25em', marginBottom: '10px' }}>LAB SECTIONS — THE EVIDENCE ROOM</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '6px' }}>
          {[
            { section: '01–02', title: 'Acquisition & Integrity', steps: '2 steps' },
            { section: '03–05', title: 'Filesystem & Execution Artifacts', steps: '3 steps' },
            { section: '06–07', title: 'Persistence & User Activity', steps: '2 steps' },
            { section: '08–09', title: 'Recovery & Browser Forensics', steps: '2 steps' },
            { section: '10–12', title: 'Memory Forensics (Volatility 3)', steps: '3 steps' },
            { section: '13–16', title: 'Timeline, Slack & IOC Pivot', steps: '4 steps' },
            { section: '17–18', title: 'Exfiltration & Event Logs', steps: '2 steps' },
            { section: '19–20', title: 'Chain of Custody & Reporting', steps: '2 steps' },
          ].map(s => (
            <div key={s.section} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '7px', color: accent + '66', flexShrink: 0, minWidth: '34px' }}>{s.section}</span>
              <div>
                <div style={{ fontSize: '7.5px', color: '#4a8a92' }}>{s.title}</div>
                <div style={{ fontSize: '6.5px', color: '#2a5a62', marginTop: '1px' }}>{s.steps}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── PHASE 1: Guided Learning ── */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(92,207,224,0.1)', border: '1px solid rgba(92,207,224,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: accent, fontWeight: 700 }}>1</span>
          </div>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#2a5a62', letterSpacing: '0.2em', marginBottom: '2px' }}>PHASE 1 — GUIDED EXAMINATION</div>
            <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.4rem', fontWeight: 700, color: accent, margin: 0 }}>The Evidence Room</h1>
          </div>
        </div>

        <p style={{ color: '#6a8a92', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: 1.7, fontFamily: 'JetBrains Mono, monospace' }}>
          A full end-to-end examination of a seized machine, FIN-WS-14, after an intrusion and payroll data theft.
          {steps.length} steps: verify the image, mount it read-only, expose a timestomped binary, prove execution,
          find persistence, parse a USB LNK, carve deleted tooling, pull browser history, analyse RAM with Volatility 3,
          build and filter a Plaso super-timeline, recover a flag from slack, hash the IOC, prove exfiltration, and write
          the defensible finding. Everything is simulated — read every explanation.
        </p>

        <div style={{ background: 'rgba(92,207,224,0.03)', border: '1px solid rgba(92,207,224,0.12)', borderRadius: '6px', padding: '1rem 1.25rem', marginBottom: '1.25rem', fontFamily: 'JetBrains Mono, monospace' }}>
          <div style={{ fontSize: '7px', color: '#1d4852', letterSpacing: '0.25em', marginBottom: '8px' }}>SKILLS DEVELOPED</div>
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '6px' }}>
            {[
              'Image integrity (sha256)',
              'Read-only mounting',
              '$MFT & timestomp detection',
              'Prefetch execution proof',
              'Amcache / Shimcache',
              'Registry Run-key persistence',
              'LNK & JumpList parsing',
              'File carving (foremost/photorec)',
              'Browser SQLite forensics',
              'Volatility 3 pslist',
              'malfind injection hunting',
              'netscan C2 recovery',
              'Plaso super-timelines',
              'psort timeline filtering',
              'Slack-space recovery',
              'IOC hashing & lookup',
              'SRUM exfiltration proof',
              'Event-log analysis (4624/4688)',
              'Chain of custody',
              'Defensible reporting',
            ].map(c => (
              <span key={c} style={{ fontSize: '7.5px', color: '#3a7a82', background: 'rgba(92,207,224,0.06)', border: '1px solid rgba(92,207,224,0.12)', padding: '2px 8px', borderRadius: '3px' }}>{c}</span>
            ))}
          </div>
        </div>

        <LabTerminal
          labId="forensics-lab"
          moduleId={moduleId}
          title="The Evidence Room"
          accent={accent}
          steps={steps}
          onComplete={(xp) => { setGuidedDone(true); setEarnedXp(xp) }}
          onRestart={() => { setGuidedDone(false); setFreeLaunched(false); setEarnedXp(0) }}
        />
      </div>

      {/* ── PHASE 2: Free Lab ── */}
      <div id="free-lab" style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: guidedDone ? 'rgba(92,207,224,0.15)' : 'rgba(0,0,0,0.3)', border: '1px solid ' + (guidedDone ? 'rgba(92,207,224,0.4)' : '#16303a'), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: guidedDone ? accent : '#2a5a62', fontWeight: 700 }}>2</span>
          </div>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: guidedDone ? '#4a8a92' : '#2a5a62', letterSpacing: '0.2em', marginBottom: '2px' }}>PHASE 2 — FREE LAB ENVIRONMENT</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.1rem', fontWeight: 700, color: guidedDone ? accent : '#2a5a62' }}>Full Forensics Practice Sandbox</div>
          </div>
          {guidedDone && !freeLaunched && (
            <div style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#ffb347', background: 'rgba(255,179,71,0.08)', border: '1px solid rgba(255,179,71,0.2)', padding: '3px 10px', borderRadius: '3px' }}>
              GUIDED PHASE COMPLETE
            </div>
          )}
        </div>

        {!freeLaunched ? (
          <div style={{ background: guidedDone ? 'rgba(92,207,224,0.04)' : '#02060a', border: '1px solid ' + (guidedDone ? 'rgba(92,207,224,0.25)' : '#0a1a20'), borderRadius: '10px', padding: '2.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            {guidedDone && (
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, ' + accent + ', transparent)' }} />
            )}
            <div style={{ fontSize: '7px', color: guidedDone ? '#3a7a82' : '#1d3a42', letterSpacing: '0.3em', marginBottom: '1rem' }}>
              {guidedDone ? 'READY FOR FREE-FORM EXAMINATION' : 'COMPLETE GUIDED PHASE TO UNLOCK'}
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.2rem', color: guidedDone ? accent : '#2a5a62', fontWeight: 700, marginBottom: '0.5rem' }}>
              LAUNCH FULL LAB ENVIRONMENT
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', color: '#4a7a82', marginBottom: '0.75rem', lineHeight: 1.7 }}>
              Free-form terminal sandbox — no guided prompts, no restrictions
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' as const, marginBottom: '2rem' }}>
              {[
                'Imaging & hashing',
                'Sleuth Kit & EZ tools',
                'Volatility 3 memory',
                'Plaso timelines',
                'Carving & slack',
                'KAPE triage',
              ].map(feat => (
                <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: guidedDone ? accent : '#16303a' }} />
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: guidedDone ? '#4a8a92' : '#1d3a42' }}>{feat}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => guidedDone && setFreeLaunched(true)}
              disabled={!guidedDone}
              style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.15em',
                padding: '14px 40px', border: '1px solid ' + (guidedDone ? 'rgba(92,207,224,0.6)' : '#16303a'),
                borderRadius: '6px', background: guidedDone ? 'rgba(92,207,224,0.12)' : 'transparent',
                color: guidedDone ? accent : '#1d3a42', cursor: guidedDone ? 'pointer' : 'not-allowed',
                boxShadow: guidedDone ? '0 0 24px rgba(92,207,224,0.18)' : 'none', transition: 'all 0.2s',
              }}
            >
              {guidedDone ? 'LAUNCH FREE LAB ENVIRONMENT' : 'COMPLETE THE GUIDED PHASE FIRST'}
            </button>
            {!guidedDone && (
              <div style={{ marginTop: '1rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: '#1d3a42' }}>
                Complete all {steps.length} guided steps above to unlock the free lab environment
              </div>
            )}
          </div>
        ) : (
          <div style={{ border: '1px solid ' + accent + '30', borderRadius: '10px', overflow: 'hidden', background: '#02080a' }}>
            <FreeLabTerminal moduleId={moduleId} moduleName={moduleName} accent={accent} onClose={() => setFreeLaunched(false)} />
            <div style={{ padding: '8px 16px', background: '#030a0d', borderTop: '1px solid ' + accent + '15', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: accent, boxShadow: '0 0 5px ' + accent }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#3a7a82' }}>
                Free practice mode. Ask <span style={{ color: accent }}>GHOST AGENT</span> (bottom-right) for deeper explanations on any forensic tool or artifact.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Quick reference */}
      <div style={{ marginBottom: '2rem' }}>
        <button
          onClick={() => setShowKeywords(!showKeywords)}
          style={{ background: 'transparent', border: '1px solid #16303a', borderRadius: '5px', padding: '8px 16px', cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#3a6a72', letterSpacing: '0.1em', marginBottom: showKeywords ? '12px' : 0, transition: 'all 0.15s' }}
        >
          {showKeywords ? '▼' : '▶'} QUICK REFERENCE — FORENSIC TOOLS & COMMANDS
        </button>
        {showKeywords && (
          <div style={{ background: '#030a0d', border: '1px solid #0d1f24', borderRadius: '6px', padding: '1.25rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '8px' }}>
              {[
                ['sha256sum image.raw', 'Verify acquired image integrity'],
                ['mount -o ro,loop image.raw /mnt/evid', 'Mount image read-only'],
                ['mmls image.raw', 'Map partitions / volume offsets'],
                ['fls -r -m C: -o OFFSET image.raw', 'Build a body file for timeline'],
                ['mactime -b bodyfile -z UTC', 'Render filesystem timeline'],
                ['MFTECmd -f $MFT --csv out', 'Parse $MFT (SI vs FN timestamps)'],
                ['PECmd -d Prefetch --csv out', 'Parse Prefetch (execution proof)'],
                ['AmcacheParser -f Amcache.hve --csv out', 'Amcache SHA-1 + paths'],
                ['LECmd -d Recent --csv out', 'Parse LNK shortcuts'],
                ['SrumECmd -f SRUDB.dat --csv out', 'SRUM per-app network bytes'],
                ['EvtxECmd -f Security.evtx --csv out', 'Parse Windows event logs'],
                ['foremost -i image.raw -o carved', 'Carve deleted files by signature'],
                ['photorec image.raw', 'Format-aware file recovery'],
                ['blkls -s image.raw', 'Extract file slack space'],
                ['vol -f mem.raw windows.pslist', 'Volatility 3 process list'],
                ['vol -f mem.raw windows.malfind', 'Find injected RWX memory'],
                ['vol -f mem.raw windows.netscan', 'Recover network connections'],
                ['log2timeline.py out.plaso image.raw', 'Build Plaso super-timeline'],
                ['psort.py -o l2tcsv -w tl.csv out.plaso', 'Filter / render a timeline'],
                ['kape.exe --target KapeTriage', 'Rapid artifact triage collection'],
              ].map(([cmd, desc]) => (
                <div key={cmd} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '6px 8px', background: '#02060a', borderRadius: '4px' }}>
                  <code style={{ color: accent, fontSize: '0.7rem', flexShrink: 0 }}>{cmd}</code>
                  <span style={{ color: '#4a7a82', fontSize: '0.68rem' }}>{desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer nav */}
      <div style={{ paddingTop: '2rem', borderTop: '1px solid #0d1f24', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' as const, gap: '10px' }}>
        <Link href="/modules/forensics" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#3a6a72' }}>&#8592; BACK TO CONCEPT</Link>
        <Link href="/" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#3a6a72' }}>GHOSTNET HOME &#8594;</Link>
      </div>
    </div>
  )
}
