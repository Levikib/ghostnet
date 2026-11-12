'use client'
import React from 'react'
import Link from 'next/link'
import ModuleCodex, { CodexChapter } from '@/app/components/ModuleCodex'
import { Local } from '@/app/components/learn/Mtaani'

const mono = 'JetBrains Mono, monospace'
const accent = '#ffd166'

// Authoring rule for this module: code samples live in template literals, so they never
// contain a dollar sign followed by an opening brace, and never contain backslashes or backticks.
// Bash variables are written "$VAR", regexes use classes like [0-9] and [.] instead of escapes.

const Pre = ({ label, children }: { label?: string; children: string }) => (
  <div style={{ margin: '1rem 0 1.5rem' }}>
    {label && (
      <div style={{ fontFamily: mono, fontSize: '9px', color: '#8a7a4a', letterSpacing: '0.15em', marginBottom: '4px', paddingLeft: '4px' }}>
        {label}
      </div>
    )}
    <pre style={{
      background: '#080704', border: '1px solid #2e2a1a', borderRadius: '4px',
      padding: '1.25rem', overflow: 'auto', color: accent,
      fontFamily: mono, fontSize: '0.78rem', lineHeight: 1.7, whiteSpace: 'pre'
    }}>
      {children}
    </pre>
  </div>
)

const H3 = ({ children }: { children: React.ReactNode }) => (
  <h3 style={{
    fontFamily: mono, fontSize: '0.85rem', fontWeight: 600,
    color: '#e0b04a', marginTop: '2rem', marginBottom: '0.75rem'
  }}>
    &#9658; {children}
  </h3>
)

const P = ({ children }: { children: React.ReactNode }) => (
  <p style={{ color: '#9a9a8a', lineHeight: 1.8, marginBottom: '1rem', fontSize: '0.9rem' }}>
    {children}
  </p>
)

const Note = ({ type, children }: { type?: 'info' | 'warn' | 'danger' | 'tip'; children: React.ReactNode }) => {
  const configs: Record<string, [string, string, string]> = {
    info: ['#ffd166', 'rgba(255,209,102,0.05)', 'NOTE'],
    warn: ['#ffb347', 'rgba(255,179,71,0.05)', 'WARNING'],
    danger: ['#ff4136', 'rgba(255,65,54,0.05)', 'CRITICAL'],
    tip: ['#00d4ff', 'rgba(0,212,255,0.05)', 'TIP'],
  }
  const [color, bg, label] = configs[type || 'info']
  return (
    <div style={{
      background: bg, borderLeft: '3px solid ' + color,
      padding: '1rem 1.25rem', borderRadius: '0 4px 4px 0',
      margin: '1.5rem 0', border: '1px solid ' + color + '33', borderLeftColor: color
    }}>
      <div style={{ fontFamily: mono, fontSize: '9px', color, letterSpacing: '0.2em', marginBottom: '6px' }}>{label}</div>
      <div style={{ color: '#9a9a8a', fontSize: '0.85rem', lineHeight: 1.7 }}>{children}</div>
    </div>
  )
}

const Table = ({ headers, rows }: { headers: string[]; rows: string[][] }) => (
  <div style={{ overflowX: 'auto', margin: '1rem 0 1.5rem' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: mono, fontSize: '0.75rem' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid #2e2a1a' }}>
          {headers.map((h, i) => (
            <th key={i} style={{ textAlign: 'left', padding: '8px 12px', color: '#e0b04a', fontWeight: 600, letterSpacing: '0.1em', fontSize: '0.7rem' }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} style={{ borderBottom: '1px solid #1a170e', background: i % 2 === 0 ? 'transparent' : 'rgba(255,209,102,0.015)' }}>
            {row.map((cell, j) => (
              <td key={j} style={{ padding: '8px 12px', color: '#9a9a8a', verticalAlign: 'top' }}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

const chapters: CodexChapter[] = [
  // ── CHAPTER 1 ─────────────────────────────────────────────────────────────
  {
    id: 'why-script',
    title: 'Why Defenders and Attackers Script',
    difficulty: 'BEGINNER',
    readTime: '15 min',
    labLink: '/modules/scripting/lab',
    takeaways: [
      'Scripting turns a task you do by hand into a repeatable, reviewable, testable procedure - the same skill powers SOC triage, incident response, red team tooling and bug bounty recon.',
      'Bash is the glue for Linux and its text tools, Python is the general-purpose language for parsing, networking and APIs, PowerShell is the native object-based shell of Windows and Active Directory.',
      'A useful rule: if you do it three times, script it; if a mistake would hurt, add a dry-run mode and a scope check first.',
      'Attackers script to scale and to live off the land; defenders script to triage faster, enrich alerts and catch exactly those living-off-the-land techniques.',
      'Never run code you do not understand - including code from forums, gists or AI assistants. Read it, run it in a lab, then promote it.',
    ],
    content: (
      <div>
        <Local>Scripting is hiring a tireless mkokoteni boy who never sleeps and never forgets. Anything you find yourself doing by hand more than twice &mdash; renaming 200 files, checking which servers are up, pulling the same numbers every morning &mdash; you write down once, and he repeats it perfectly at 3am while you rest. A script is just those instructions, written clearly enough that the machine can follow them without you standing over it.</Local>
        <H3>The Automation Mindset</H3>
        <P>
          Picture a night-shift analyst. At 02:00 an alert fires: a web server is seeing thousands of failed SSH logins. Without scripting, the analyst opens the log in a text editor, scrolls, copies IP addresses into a spreadsheet, looks each one up in a threat-intel site, and writes a ticket. That takes an hour and is full of copy-paste mistakes. With a ten-line script, the same work takes four seconds, produces the same answer every time, and can run again tomorrow without anyone awake. That is the whole argument for this module.
        </P>
        <P>
          Scripting is not a separate career path from security - it is a force multiplier inside every path. A penetration tester scripts recon so every engagement starts the same way. A SOC analyst scripts enrichment so alerts arrive with context already attached. An incident responder scripts evidence collection so it is consistent and defensible in court. A threat hunter scripts queries across thousands of endpoints. Even a GRC analyst scripts the boring evidence pulls for an audit. You do not need to become a software engineer. You need to become dangerous with a terminal and a text editor.
        </P>
        <P>
          The mindset has four parts. First, notice repetition: any task you have done three times by hand is a candidate. Second, make it reproducible: the script is documentation that actually runs - a colleague can read exactly what you did. Third, make it safe: scripts act fast, so mistakes also happen fast. Build in dry-run modes, confirmations and scope checks. Fourth, make it observable: log what the script did, so when it fails at 03:00 you know why.
        </P>

        <H3>How Attackers Use Scripts</H3>
        <P>
          Attackers script for scale and stealth. A single operator with a Python script can test leaked credentials against hundreds of login portals, parse the results and pivot to the ones that worked. Ransomware affiliates use PowerShell and batch scripts to disable backups, push payloads with remote management tools and wipe logs. Most importantly, attackers love built-in interpreters - Bash on Linux, PowerShell on Windows - because they are already installed, trusted and signed. This is called living off the land: no custom malware binary to detect, just a legitimate interpreter running hostile instructions.
        </P>
        <P>
          This is exactly why defenders must read scripts fluently. When you pull a suspicious command line out of an EDR alert, it will often be a one-liner: a base64-encoded PowerShell command, a curl piped into sh, a Python reverse shell. If you cannot read it, you cannot judge it. Chapter 8 teaches you to decode an encoded PowerShell command with three lines of Python.
        </P>

        <H3>How Defenders Use Scripts</H3>
        <Table
          headers={['Task', 'Manual time', 'Scripted time', 'Typical tools']}
          rows={[
            ['Count failed SSH logins per IP', '30-60 min', 'Seconds', 'grep, awk, sort, uniq'],
            ['Enrich 200 IOCs with threat intel', 'Hours', 'Minutes (rate-limited)', 'Python + requests + an intel API'],
            ['Find new open ports since last week', 'Hours of comparison', 'Seconds', 'nmap -oX + Python XML diff'],
            ['Pull failed Windows logons from 50 hosts', 'A day of RDP sessions', 'Minutes', 'PowerShell Get-WinEvent + remoting'],
            ['Extract IOCs from a threat report PDF/text', '45 min', 'Seconds', 'Python regex + ipaddress validation'],
            ['Hash every file in a suspicious folder', '20 min', 'Seconds', 'sha256sum, Python hashlib'],
          ]}
        />

        <H3>Choosing the Right Language</H3>
        <P>
          There is no single best language. Experienced practitioners switch between three depending on the job, and often combine them - a Bash wrapper that calls a Python parser, or a Python script that shells out to a PowerShell command on a Windows host.
        </P>
        <Table
          headers={['Language', 'Best at', 'Weak at', 'Where it already exists']}
          rows={[
            ['Bash', 'Gluing command-line tools, quick text pipelines, server admin, cron jobs', 'Complex data structures, error handling, anything over ~150 lines', 'Every Linux distro, macOS (zsh default, bash available), WSL'],
            ['Python', 'Parsing, networking, APIs, data analysis, real tools with tests', 'Startup time for tiny tasks, dependency management if careless', 'Most Linux distros, Kali, macOS (via Xcode tools or Homebrew); installable on Windows'],
            ['PowerShell', 'Windows administration, AD, event logs, Microsoft 365 and Azure', 'Unix text tools, portability to minimal Linux boxes', 'Every modern Windows (5.1 built in); PowerShell 7 is cross-platform'],
          ]}
        />
        <Pre label="DECISION SHORTCUT">
{`Is it a one-off pipeline over text files on Linux?        -> Bash one-liner
Will it grow past a page, need JSON/HTTP, or need tests?  -> Python
Is the data inside Windows (event logs, AD, registry)?    -> PowerShell
Will someone else run it on a schedule?                   -> Python or PowerShell,
                                                             with logging and --help`}
        </Pre>

        <H3>The Same Task in Three Languages</H3>
        <P>
          To see the personalities, here is one task - count lines containing the word Failed in a log file - written three ways. Notice that Bash leans on an existing tool, Python reads the file explicitly, and PowerShell passes objects down a pipeline.
        </P>
        <Pre label="BASH">
{`grep -c "Failed" auth.log`}
        </Pre>
        <Pre label="PYTHON">
{`count = 0
with open("auth.log", encoding="utf-8", errors="replace") as f:
    for line in f:
        if "Failed" in line:
            count += 1
print(count)`}
        </Pre>
        <Pre label="POWERSHELL">
{`(Select-String -Path ./auth.log -Pattern "Failed").Count`}
        </Pre>
        <P>
          The Bash version is shortest because grep already exists and is fast. The Python version is longer but every step is explicit, and it is easy to extend: tomorrow you might want to extract the IP, group by hour and send a JSON report to a webhook. That kind of growth is where Python wins.
        </P>

        <H3>Safety Principles From Day One</H3>
        <P>
          Scripts amplify intent. A typo in a manual command breaks one thing; a typo in a loop breaks everything the loop touches. Build these habits before you write anything clever:
        </P>
        <Table
          headers={['Principle', 'What it looks like in practice']}
          rows={[
            ['Scope first', 'Targets come from an allow-list file you control; the script refuses anything outside it.'],
            ['Dry run', 'A --dry-run flag prints what would happen without doing it. Make it the default for destructive actions.'],
            ['Fail loudly', 'Bash: set -euo pipefail. Python: let unexpected exceptions crash with a traceback instead of hiding them.'],
            ['Least privilege', 'Do not run as root or Administrator unless the step genuinely needs it.'],
            ['No secrets in code', 'API keys come from environment variables or a secrets manager, never from the script or git.'],
            ['Log what you did', 'Timestamped logs to a file or stderr, so the 03:00 failure can be explained at 09:00.'],
          ]}
        />
        <Note type="warn">
          AI coding assistants can produce working scripts in seconds, and they are genuinely useful. They also confidently produce scripts that delete the wrong directory, scan the wrong subnet or invent library functions that do not exist. Treat generated code exactly like code from a stranger on a forum: read every line, run it in a lab, and only then point it at anything real.
        </Note>

        <H3>Setting Up Your Workbench</H3>
        <P>
          You need a Linux shell, Python 3 and optionally PowerShell. Kali, Ubuntu, Debian and Fedora all ship Bash and Python 3. On Windows, install WSL (wsl --install from an administrator terminal) to get a real Linux environment alongside native PowerShell. On macOS the default shell is zsh, which runs almost all of the Bash in this module, but you can run bash explicitly. Install shellcheck (a Bash linter) and a code editor with Python support. Every example in this module targets lab files, documentation IP ranges (192.0.2.0/24, 198.51.100.0/24, 203.0.113.0/24, reserved by RFC 5737 for examples) or localhost - never real third-party systems.
        </P>
        <Pre label="CHECK YOUR TOOLS">
{`$ bash --version | head -1
GNU bash, version 5.2.37(1)-release (x86_64-pc-linux-gnu)
$ python3 --version
Python 3.13.5
$ pwsh --version          # optional, PowerShell 7 on Linux/macOS
PowerShell 7.5.2
$ sudo apt install shellcheck jq    # Debian/Ubuntu/Kali`}
        </Pre>
        <P>
          Version numbers on your machine will differ; anything from Bash 5, Python 3.10 and PowerShell 7.4 upward works for this module. With the workbench ready, Chapter 2 starts with the shell you already have open.
        </P>
      </div>
    ),
  },

  // ── CHAPTER 2 ─────────────────────────────────────────────────────────────
  {
    id: 'bash-essentials',
    title: 'Bash Essentials',
    difficulty: 'BEGINNER',
    readTime: '20 min',
    labLink: '/modules/scripting/lab',
    takeaways: [
      'Assign variables with no spaces around the equals sign, and always reference them in double quotes ("$host") so spaces and wildcards in data cannot split or expand them.',
      'Single quotes are completely literal; double quotes allow $VAR and $(command) substitution. Most Bash bugs are quoting bugs.',
      'Every command returns an exit code: 0 means success, anything else means failure. if, &&, || and set -e all act on exit codes, not on output.',
      'Read files line by line with while IFS= read -r line; do ...; done < file - it is safe for spaces where for x in $(cat file) is not.',
      'Start scripts with #!/usr/bin/env bash and set -euo pipefail, run shellcheck on them, and use local variables inside functions.',
    ],
    content: (
      <div>
        <H3>Your First Script</H3>
        <P>
          A Bash script is a plain text file containing commands you could type at the prompt. The first line, called the shebang, tells the kernel which interpreter to run. Using /usr/bin/env bash finds bash wherever it is installed, which matters on systems like macOS or NixOS where it is not at /bin/bash.
        </P>
        <Pre label="hello.sh">
{`#!/usr/bin/env bash
set -euo pipefail

echo "Night shift started on $(hostname) at $(date -u +%H:%M) UTC"`}
        </Pre>
        <Pre label="RUN IT">
{`$ chmod +x hello.sh      # mark it executable (once)
$ ./hello.sh            # ./ means "in this directory" - the current dir is not on PATH
Night shift started on web01 at 02:14 UTC
$ bash hello.sh         # also works without chmod: bash reads the file itself`}
        </Pre>

        <H3>Variables and Quoting</H3>
        <P>
          Variables are assigned with no spaces around the equals sign - target = 10.0.0.5 would try to run a command called target. You read a variable with a dollar sign. The single most important Bash habit is to put variable references inside double quotes. Without quotes, Bash performs word splitting (breaking the value on spaces) and globbing (expanding wildcards like *) on the value, which turns a filename such as "incident report.txt" into two arguments, or a value of * into every file in the directory.
        </P>
        <Pre label="VARIABLES AND QUOTES">
{`target="10.0.0.5"
logfile="incident report.txt"

echo "Scanning $target"          # double quotes: variables expand -> Scanning 10.0.0.5
echo 'Scanning $target'          # single quotes: literal         -> Scanning $target
wc -l $logfile                   # BUG: becomes  wc -l incident report.txt  (two files)
wc -l "$logfile"                 # correct: one argument

today="$(date +%F)"              # command substitution: capture output -> 2026-11-11
count=$(( 3 + 4 ))               # arithmetic expansion                  -> 7
echo "Report for $today has $count findings"`}
        </Pre>
        <Table
          headers={['Syntax', 'Meaning', 'Example']}
          rows={[
            ['"..."', 'Double quotes: expands $VAR and $(cmd), prevents splitting', 'echo "Host: $host"'],
            ["'...'", 'Single quotes: nothing expands, fully literal', "awk '{print $1}'"],
            ['$(cmd)', 'Command substitution: replace with the output of cmd', 'now="$(date -u)"'],
            ['$(( expr ))', 'Integer arithmetic', 'total=$(( total + 1 ))'],
            ['$1 $2 ... $#', 'Positional arguments and their count', 'echo "first arg: $1, total: $#"'],
            ['"$@"', 'All arguments, each kept as a separate word', 'for arg in "$@"; do ...; done'],
            ['$?', 'Exit code of the last command', 'echo "status was $?"'],
          ]}
        />
        <Note type="info">
          Bash also has a braced form of variable expansion used for defaults, substrings and arrays (documented under Parameter Expansion in man bash). It is powerful, but this module sticks to the plain "$VAR" form, which covers almost all security scripting.
        </Note>

        <H3>Exit Codes: How Bash Decides True and False</H3>
        <P>
          Bash does not think in true and false the way most languages do. Every command finishes with an exit code from 0 to 255. Zero means success; anything else means some kind of failure. grep, for example, exits 0 if it found a match, 1 if it found none and 2 if there was an error. if, && and || all branch on these codes.
        </P>
        <Pre label="EXIT CODES IN ACTION">
{`$ grep -q "Failed password" auth.log; echo $?
0                                   # found at least one match
$ grep -q "zzzz" auth.log; echo $?
1                                   # no match

# && runs the next command only on success, || only on failure
grep -q "Failed password" auth.log && echo "brute force activity present"
ping -c 1 -W 1 10.10.10.5 > /dev/null || echo "10.10.10.5 is not answering"

# in your own scripts, exit with a meaningful code
exit 2      # e.g. 0 = clean, 1 = findings, 2 = usage error`}
        </Pre>

        <H3>Conditionals</H3>
        <P>
          The double-bracket test [[ ... ]] is the modern Bash way to compare strings, numbers and check files. Inside it, use -eq, -lt and -gt for numbers and == or != for strings. A space is required after [[ and before ]].
        </P>
        <Pre label="CONDITIONALS">
{`if [[ ! -f "$logfile" ]]; then
    echo "missing log: $logfile" >&2      # >&2 sends the message to stderr
    exit 2
fi

failures=$(grep -c "Failed password" "$logfile" || true)

if [[ "$failures" -gt 100 ]]; then
    echo "CRITICAL: $failures failures"
elif [[ "$failures" -gt 10 ]]; then
    echo "WARNING: $failures failures"
else
    echo "OK: $failures failures"
fi`}
        </Pre>
        <Table
          headers={['Test', 'True when']}
          rows={[
            ['-f path', 'path exists and is a regular file'],
            ['-d path', 'path exists and is a directory'],
            ['-r / -w / -x path', 'path is readable / writable / executable by you'],
            ['-z "$s"', 'string is empty'],
            ['-n "$s"', 'string is not empty'],
            ['"$a" == "$b"', 'strings are equal (inside [[ ]] the right side can be a glob pattern)'],
            ['"$a" -eq "$b"', 'integers are equal (also -ne -lt -le -gt -ge)'],
          ]}
        />

        <H3>Loops</H3>
        <P>
          A for loop iterates over a list of words. A while loop runs as long as a command succeeds. For reading a file line by line - the most common job in security scripting - the while read pattern is the correct one: IFS= stops leading spaces being trimmed and -r stops backslashes being interpreted.
        </P>
        <Pre label="LOOPS">
{`# loop over explicit values
for port in 22 80 443; do
    echo "checking port $port"
done

# loop over a numeric range
for i in $(seq 1 5); do
    echo "attempt $i"
done

# the safe way to read a file line by line
while IFS= read -r host; do
    [[ -z "$host" || "$host" == "#"* ]] && continue    # skip blanks and comments
    echo "probing $host"
done < hosts.txt

# the quick way you will see everywhere (fine when lines have no spaces)
for host in $(cat hosts.txt); do
    ping -c 1 -W 1 "$host" > /dev/null && echo "$host up"
done`}
        </Pre>

        <H3>Functions</H3>
        <P>
          Functions group commands under a name. They receive arguments as $1, $2 and so on, just like a script. Declare variables with local inside functions so they do not leak into the rest of the script. A function returns an exit code with return; to return data, print it and capture it with $( ).
        </P>
        <Pre label="FUNCTIONS">
{`log() {
    echo "$(date -u +%FT%TZ) [$1] $2" >&2
}

is_up() {
    local host="$1"
    ping -c 1 -W 1 "$host" > /dev/null 2>&1
}

while IFS= read -r host; do
    if is_up "$host"; then
        log INFO "$host responded"
    else
        log WARN "$host did not respond"
    fi
done < hosts.txt`}
        </Pre>

        <H3>Strict Mode: set -euo pipefail</H3>
        <P>
          By default, Bash keeps going after errors, treats undefined variables as empty and judges a pipeline only by its last command. All three behaviours cause silent disasters. Imagine rm -rf "$workdir/" where workdir was never set because of a typo. Strict mode fixes this.
        </P>
        <Table
          headers={['Option', 'Effect', 'Disaster it prevents']}
          rows={[
            ['set -e', 'Exit immediately when a command fails', 'Script continues after a failed cd and deletes files in the wrong directory'],
            ['set -u', 'Treat use of an unset variable as an error', 'A typo like $wrokdir silently becomes an empty string'],
            ['set -o pipefail', 'A pipeline fails if any command in it fails', 'A failed download piped into a parser looks like success'],
          ]}
        />
        <Pre label="STRICT MODE TEMPLATE">
{`#!/usr/bin/env bash
set -euo pipefail

workdir="$(mktemp -d)"                  # unique temp dir, not a guessable /tmp name
cleanup() { rm -rf "$workdir"; }
trap cleanup EXIT                       # runs on normal exit, error or Ctrl-C

if [[ $# -lt 1 ]]; then
    echo "usage: $0 LOGFILE" >&2
    exit 2
fi
logfile="$1"

# grep exits 1 on "no match" - under set -e that would kill the script, so allow it
hits=$(grep -c "Failed password" "$logfile" || true)
echo "failed logins: $hits"`}
        </Pre>
        <Note type="warn">
          set -e has well-known gaps: it does not trigger inside if conditions, in commands joined with || or &&, or in some function contexts. Treat it as a safety net, not a substitute for checking the commands that matter.
        </Note>

        <H3>Lint Everything With ShellCheck</H3>
        <P>
          ShellCheck reads your script and flags quoting mistakes, unused variables, useless cat calls and dozens of subtle bugs. Run it on every script before you trust it. Its warnings come with codes like SC2086 (unquoted variable) that you can look up for a full explanation.
        </P>
        <Pre label="SHELLCHECK OUTPUT">
{`$ shellcheck sweep.sh

In sweep.sh line 6:
wc -l $logfile
      ^------^ SC2086 (info): Double quote to prevent globbing and word splitting.

Did you mean:
wc -l "$logfile"`}
        </Pre>
      </div>
    ),
  },

  // ── CHAPTER 3 ─────────────────────────────────────────────────────────────
  {
    id: 'text-processing',
    title: 'Text Processing Power Tools',
    difficulty: 'BEGINNER',
    readTime: '20 min',
    labLink: '/modules/scripting/lab',
    takeaways: [
      'Unix tools each do one job and connect with the pipe: grep filters lines, cut and awk pick fields, sort and uniq count, sed edits, xargs turns lines into arguments, jq handles JSON.',
      'The classic top-talkers pipeline is ... | sort | uniq -c | sort -nr | head - uniq only collapses adjacent duplicates, so always sort first.',
      'Use awk with $NF and $(NF-3) style field references when log lines vary in length, like sshd lines for valid versus invalid users.',
      'Modern systems may log to journald instead of /var/log/auth.log, and OpenSSH 9.8+ logs failures under sshd-session - check what your system actually writes before trusting a pipeline.',
      'jq -r extracts raw values from JSON, and select() filters arrays - essential for EDR, cloud and SIEM exports.',
    ],
    content: (
      <div>
        <Local>The Unix philosophy is a mama mboga&apos;s stall: a few small, sharp tools, each doing exactly one thing &mdash; one knife, one scale, one sufuria &mdash; combined fresh for every customer. <strong>grep</strong> (find), <strong>sort</strong> (order), <strong>uniq</strong> (dedupe), <strong>wc</strong> (count) are those tools; the <strong>pipe</strong> (<strong>|</strong>) is her passing the vegetable from one hand to the next. You rarely need a big new machine &mdash; you need to arrange the small tools you already have.</Local>
        <H3>The Unix Philosophy for Analysts</H3>
        <P>
          The tools in this chapter are older than most of the people using them, and they are still the fastest way to answer questions about logs. Each one does one thing well. The pipe character | sends the output of one command into the input of the next, so you build an answer step by step, checking the output after each stage. Get in the habit of adding one stage at a time and looking at the result before adding the next.
        </P>
        <P>
          The examples use an SSH authentication log. Here is what typical lines look like on a Debian or Ubuntu server using rsyslog in traditional format:
        </P>
        <Pre label="SAMPLE auth.log LINES">
{`Nov 11 02:14:07 web01 sshd[2211]: Failed password for root from 203.0.113.45 port 52144 ssh2
Nov 11 02:14:09 web01 sshd[2211]: Failed password for invalid user admin from 203.0.113.45 port 52150 ssh2
Nov 11 02:15:01 web01 sshd[2215]: Accepted publickey for deploy from 198.51.100.7 port 40022 ssh2
Nov 11 02:16:11 web01 sshd[2230]: Failed password for root from 192.0.2.99 port 60001 ssh2`}
        </Pre>
        <Note type="info">
          Log formats drift. Newer rsyslog defaults may write ISO timestamps (2026-11-11T02:14:07.123456+00:00) instead of Nov 11 02:14:07. Debian 12 and later do not install rsyslog by default, so auth.log may not exist at all - read the same events with journalctl -u ssh (Debian/Ubuntu) or journalctl -u sshd (RHEL/Fedora). OpenSSH 9.8 and later log per-connection messages from a process called sshd-session. Always look at a few raw lines before writing a pipeline.
        </Note>

        <H3>grep: Find the Lines That Matter</H3>
        <Table
          headers={['Flag', 'Meaning', 'Example']}
          rows={[
            ['-c', 'Count matching lines', 'grep -c "Failed password" auth.log'],
            ['-i', 'Case-insensitive', 'grep -i "error" app.log'],
            ['-v', 'Invert: lines that do NOT match', 'grep -v "CRON" syslog'],
            ['-E', 'Extended regex (+ ? | {} without escaping)', 'grep -E "Failed|Invalid" auth.log'],
            ['-o', 'Print only the matching part', "grep -oE '[0-9]{1,3}([.][0-9]{1,3}){3}' auth.log"],
            ['-F', 'Fixed string, no regex (fast, safe for IOC lists)', 'grep -F -f iocs.txt proxy.log'],
            ['-r / -l', 'Recurse into directories / list filenames only', 'grep -rl "api_key" ./repo'],
            ['-A / -B / -C n', 'Show n lines after / before / around each match', 'grep -A 3 "Traceback" app.log'],
          ]}
        />
        <Pre label="GREP ON THE AUTH LOG">
{`$ grep -c "Failed password" auth.log
3
$ grep "Accepted" auth.log
Nov 11 02:15:01 web01 sshd[2215]: Accepted publickey for deploy from 198.51.100.7 port 40022 ssh2
$ grep -F -f known_bad_ips.txt auth.log | wc -l     # lines mentioning any IP on a blocklist
2`}
        </Pre>
        <P>
          The -o example extracts anything shaped like an IPv4 address. We write the dot as [.] - a character class containing only a literal dot - because a bare dot in a regex means any character. It is a deliberately loose pattern: it would also match 999.1.1.1. Chapter 6 shows how to validate matches properly with Python.
        </P>

        <H3>cut and awk: Pick Out Fields</H3>
        <P>
          cut splits each line on a single delimiter character and prints the fields you ask for. It is perfect for CSV exports and colon-separated files like /etc/passwd. awk is a small programming language built for columns: by default it splits on runs of whitespace, numbers the fields $1, $2 and so on, and exposes NF (number of fields) so you can count from the end with $NF (last field) or $(NF-3) (fourth from last).
        </P>
        <Pre label="CUT">
{`$ head -3 vpn.csv
timestamp,user,src_ip,result
2026-11-11T01:58:12Z,amina,198.51.100.23,success
2026-11-11T02:03:40Z,svc_backup,203.0.113.45,failure

$ cut -d',' -f3 vpn.csv | tail -n +2        # column 3, skip the header row
198.51.100.23
203.0.113.45

$ cut -d: -f1,7 /etc/passwd | head -3       # username and login shell
root:/bin/bash
daemon:/usr/sbin/nologin
bin:/usr/sbin/nologin`}
        </Pre>
        <P>
          Why not use $11 for the source IP in the SSH log? Look at the sample: for a valid user the IP is field 11, but "for invalid user admin" adds two extra words and pushes it to field 13. Counting from the end is stable because every failure line ends with: IP, the word port, the port number, ssh2. So the IP is always $(NF-3).
        </P>
        <Pre label="AWK">
{`$ grep "Failed password" auth.log | awk '{print $(NF-3)}'
203.0.113.45
203.0.113.45
192.0.2.99

# awk can filter and print in one step: /pattern/ { action }
$ awk '/Failed password/ {print $(NF-5)}' auth.log     # the username
root
admin
root

# awk can do arithmetic: total bytes sent in an nginx access log (field 10)
$ awk '{sum += $10} END {print sum " bytes"}' access.log
48211933 bytes

# change the field separator with -F: user agents are field 6 when splitting on quotes
$ awk -F'"' '{print $6}' access.log | sort | uniq -c | sort -nr | head -3`}
        </Pre>

        <H3>sort, uniq and head: Who Is Attacking Me?</H3>
        <P>
          This is the most famous pipeline in log analysis. uniq -c collapses adjacent identical lines and prefixes a count, which is why you must sort first - otherwise identical IPs that are not next to each other are counted separately. The second sort -nr orders numerically (-n) in reverse (-r) so the biggest counts come first.
        </P>
        <Pre label="TOP ATTACKING IPS">
{`$ grep "Failed password" auth.log | awk '{print $(NF-3)}' | sort | uniq -c | sort -nr | head
   4127 203.0.113.45
    902 198.51.100.200
     61 192.0.2.99
      3 198.51.100.23`}
        </Pre>
        <Table
          headers={['Stage', 'Output of this stage']}
          rows={[
            ['grep "Failed password" auth.log', 'Only failure lines'],
            ["awk '{print $(NF-3)}'", 'One IP per line, in log order'],
            ['sort', 'Identical IPs now adjacent'],
            ['uniq -c', 'Each IP once, prefixed with its count'],
            ['sort -nr', 'Biggest count first'],
            ['head', 'Top 10 (head -n 5 for top 5)'],
          ]}
        />

        <H3>sed: Stream Editing</H3>
        <P>
          sed applies edits to each line as it streams past. The most common use is substitution: s/old/new/ replaces the first match on each line, and adding g replaces all matches. Use sed -n with p to print specific lines. Be careful with sed -i, which edits files in place - give it a suffix such as -i.bak to keep a backup, and never run it on evidence.
        </P>
        <Pre label="SED">
{`# defang URLs before pasting them into a ticket, so nobody clicks them
$ echo "http://evil.example/payload" | sed 's/http/hxxp/; s/[.]/[.]/g'
hxxp://evil[.]example/payload

# print only lines 100 to 120 of a huge log
$ sed -n '100,120p' syslog

# redact anything after "password=" in an app log copy before sharing it
$ sed 's/password=[^&]*/password=REDACTED/g' app.log > app_redacted.log`}
        </Pre>

        <H3>xargs: Lines Into Arguments</H3>
        <P>
          Many commands take arguments, not standard input. xargs reads lines and passes them as arguments. -n 1 runs the command once per item, -P runs several in parallel, and -0 pairs with find -print0 to handle filenames containing spaces safely.
        </P>
        <Pre label="XARGS">
{`# hash every file in a suspicious upload directory, safely handling odd names
$ find ./uploads -type f -print0 | xargs -0 sha256sum > uploads.sha256

# resolve a list of domains, four at a time
$ xargs -P 4 -n 1 dig +short < domains.txt`}
        </Pre>

        <H3>jq: JSON on the Command Line</H3>
        <P>
          EDR tools, cloud audit logs, SIEM exports and nearly every API speak JSON. jq is grep, cut and awk for JSON. A filter starting with . walks into the structure; -r prints raw strings without quotes; .[] iterates over an array; select() keeps only items where a condition is true.
        </P>
        <Pre label="alert.json">
{`{
  "rule": "SSH brute force",
  "severity": "high",
  "source": { "ip": "203.0.113.45", "geo": "NL" },
  "destination": { "ip": "10.0.0.12", "port": 22 },
  "count": 4127
}`}
        </Pre>
        <Pre label="JQ FILTERS">
{`$ jq '.severity' alert.json
"high"
$ jq -r '.source.ip' alert.json
203.0.113.45

# alerts.json is an ARRAY of alerts: keep only high severity, print rule and IP
$ jq -r '.[] | select(.severity == "high") | [.rule, .source.ip] | @tsv' alerts.json
SSH brute force     203.0.113.45
Impossible travel   198.51.100.200

# count alerts per severity
$ jq -r '.[].severity' alerts.json | sort | uniq -c
      7 high
     31 low
     12 medium`}
        </Pre>
        <Note type="tip">
          Combine the tools freely. A real triage command chains journalctl -u ssh --since &quot;1 hour ago&quot; -o cat into the same grep, awk, sort and uniq stages shown above - one line that answers who is brute-forcing this box right now.
        </Note>
      </div>
    ),
  },

  // ── CHAPTER 4 ─────────────────────────────────────────────────────────────
  {
    id: 'python-fundamentals',
    title: 'Python Fundamentals for Security',
    difficulty: 'BEGINNER',
    readTime: '22 min',
    labLink: '/modules/scripting/lab',
    takeaways: [
      'Know the core types cold: str (text), bytes (raw data), int, float, bool, list, dict and set - most security bugs in scripts are str versus bytes confusion.',
      'Open files with a with block so they always close, and choose encoding and errors explicitly when reading logs that may contain junk bytes.',
      'Catch specific exceptions you can handle (FileNotFoundError, PermissionError) and let unexpected ones crash loudly.',
      'Always work inside a virtual environment: python3 -m venv .venv, then source .venv/bin/activate, then pip install. Modern distros block system-wide pip (PEP 668) for good reason.',
      'Pin dependencies in requirements.txt and double-check package names - typosquatted packages on PyPI are a real supply-chain attack.',
    ],
    content: (
      <div>
        <H3>Why Python</H3>
        <P>
          Python reads almost like pseudocode, has an enormous standard library (sockets, HTTP, JSON, CSV, hashing, regex, XML, logging, argument parsing - all built in) and a huge security ecosystem: Impacket, Scapy, pwntools, Volatility, YARA bindings, requests. When a Bash pipeline starts needing if statements inside awk inside a loop, it is time to switch to Python.
        </P>
        <P>
          You can run Python three ways: interactively in the REPL (type python3 and experiment), as a one-liner with python3 -c, or as a script file. The REPL is your scratchpad - use it constantly to test a line before putting it in a script.
        </P>
        <Pre label="THE REPL">
{`$ python3
>>> ip = "203.0.113.45"
>>> ip.split(".")
['203', '0', '113', '45']
>>> len(ip)
12
>>> exit()`}
        </Pre>

        <H3>Core Types</H3>
        <Table
          headers={['Type', 'Example', 'Security use']}
          rows={[
            ['str', '"Failed password"', 'Log lines, usernames, URLs - human-readable text'],
            ['bytes', "b'MZ' (the two bytes 0x4D 0x5A)", 'Network packets, file contents, hashes, anything binary'],
            ['int / float', '4625, 0.75', 'Ports, event IDs, counts, thresholds, scores'],
            ['bool', 'True / False', 'Flags such as is_malicious'],
            ['list', '["22", "80", "443"]', 'Ordered collections: hosts to check, lines to process'],
            ['dict', '{"ip": "203.0.113.45", "count": 4127}', 'Key-value records: one alert, one host, a JSON object'],
            ['set', '{"203.0.113.45", "192.0.2.99"}', 'Unique values, fast membership tests: blocklists, seen IOCs'],
          ]}
        />
        <P>
          The str versus bytes distinction deserves special attention. Text is a sequence of characters; bytes are raw numbers from 0 to 255. Network sockets, files opened in binary mode and hash functions all deal in bytes. Convert with .encode() (str to bytes) and .decode() (bytes to str). A file starting with the bytes 4D 5A (the characters MZ) is a Windows executable - you can only check that reliably by reading bytes.
        </P>
        <Pre label="STR AND BYTES">
{`>>> "admin".encode()
b'admin'
>>> b'admin'.decode()
'admin'
>>> with open("sample.bin", "rb") as f:
...     magic = f.read(2)
>>> magic == b"MZ"
True              # a PE executable, whatever its file extension claims`}
        </Pre>

        <H3>Lists, Dicts and Sets in Practice</H3>
        <Pre label="COLLECTIONS">
{`hosts = ["10.10.10.5", "10.10.10.6", "10.10.10.7"]
hosts.append("10.10.10.8")
for h in hosts:
    print("checking", h)

alert = {"rule": "SSH brute force", "ip": "203.0.113.45", "count": 4127}
print(alert["ip"])                     # 203.0.113.45
print(alert.get("country", "unknown")) # .get avoids KeyError for missing keys

blocklist = {"203.0.113.45", "198.51.100.200"}
if alert["ip"] in blocklist:           # set lookup is fast even with millions of items
    print("known bad IP")

# comprehension: build a list in one readable line
high_ports = [p for p in [22, 80, 443, 8080, 31337] if p > 1024]
print(high_ports)                      # [8080, 31337]`}
        </Pre>

        <H3>Functions</H3>
        <P>
          Functions make code reusable and testable. Type hints (the : str and -&gt; bool annotations) are optional - Python does not enforce them at runtime - but they document intent and let editors and tools like mypy catch mistakes.
        </P>
        <Pre label="FUNCTIONS">
{`def is_private(ip: str) -> bool:
    """Return True for RFC 1918 IPv4 addresses (rough check - see Chapter 6 for ipaddress)."""
    first, second = [int(x) for x in ip.split(".")[:2]]
    return first == 10 or (first == 172 and 16 <= second <= 31) or (first == 192 and second == 168)

def severity(count: int, threshold: int = 10) -> str:
    if count >= threshold * 10:
        return "critical"
    if count >= threshold:
        return "warning"
    return "ok"

print(is_private("10.0.0.12"), severity(4127))   # True critical`}
        </Pre>

        <H3>Reading and Writing Files</H3>
        <P>
          Always open files in a with block: the file is closed automatically even if an error happens halfway. Logs often contain invalid UTF-8 (binary junk from an attacker, a truncated write), so pass errors="replace" when reading them - otherwise one bad byte crashes your parser at 03:00.
        </P>
        <Pre label="FILES">
{`failed = 0
with open("auth.log", encoding="utf-8", errors="replace") as f:
    for line in f:                       # iterates lazily - works on multi-GB logs
        if "Failed password" in line:
            failed += 1

with open("report.txt", "w", encoding="utf-8") as out:
    print("failed logins:", failed, file=out)     # print can write to a file

with open("hosts.txt", encoding="utf-8") as f:
    hosts = [line.strip() for line in f if line.strip() and not line.startswith("#")]`}
        </Pre>

        <H3>Exceptions: Failing Well</H3>
        <P>
          When something goes wrong, Python raises an exception. If nothing catches it, the script stops and prints a traceback showing exactly where. Catch only the exceptions you can do something useful about, and catch them by name. A bare except: that swallows everything hides bugs and even blocks Ctrl-C.
        </P>
        <Pre label="EXCEPTIONS">
{`import sys

def load_lines(path: str) -> list[str]:
    try:
        with open(path, encoding="utf-8", errors="replace") as f:
            return f.readlines()
    except FileNotFoundError:
        print("error: no such file:", path, file=sys.stderr)
        sys.exit(2)
    except PermissionError:
        print("error: permission denied (try reading a copy, not the live log):", path, file=sys.stderr)
        sys.exit(2)

lines = load_lines("auth.log")
print(len(lines), "lines loaded")`}
        </Pre>
        <Note type="warn">
          Never write except: pass. In security tooling it is especially dangerous: a scanner that silently ignores errors reports hosts as clean when it actually failed to check them. A false all-clear is worse than a crash.
        </Note>

        <H3>Modules and the main Guard</H3>
        <P>
          Every .py file is a module that can be imported. The if __name__ == "__main__": block runs only when the file is executed directly, not when it is imported - which lets you reuse functions from your script in tests or other tools.
        </P>
        <Pre label="SCRIPT SKELETON">
{`#!/usr/bin/env python3
"""count_failures.py - count failed SSH logins in a log file."""
import sys

def count_failures(path: str) -> int:
    with open(path, encoding="utf-8", errors="replace") as f:
        return sum(1 for line in f if "Failed password" in line)

def main() -> int:
    if len(sys.argv) != 2:
        print("usage: count_failures.py LOGFILE", file=sys.stderr)
        return 2
    print(count_failures(sys.argv[1]))
    return 0

if __name__ == "__main__":
    sys.exit(main())`}
        </Pre>

        <H3>Virtual Environments and pip</H3>
        <P>
          Third-party packages come from PyPI via pip. Installing them system-wide causes version conflicts and can break operating system tools written in Python. Debian 12+, Ubuntu 23.04+, Kali and Fedora now mark the system Python as externally managed (PEP 668), so plain pip install fails with an externally-managed-environment error. The fix is not --break-system-packages; it is a virtual environment - a private folder with its own Python and packages, one per project.
        </P>
        <Pre label="VENV WORKFLOW">
{`$ python3 -m venv .venv              # create the environment in ./.venv
$ source .venv/bin/activate          # activate (Windows: .venv/Scripts/activate)
(.venv) $ pip install requests       # installs into .venv only
(.venv) $ pip freeze > requirements.txt
(.venv) $ cat requirements.txt                # your versions will differ
certifi==2025.8.3
charset-normalizer==3.4.3
idna==3.10
requests==2.32.5
urllib3==2.5.0
(.venv) $ deactivate

# on another machine, rebuild exactly the same environment
$ python3 -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt`}
        </Pre>
        <Table
          headers={['Tool', 'Use it for']}
          rows={[
            ['python3 -m venv', 'Built-in, always available: one environment per project'],
            ['pipx', 'Installing Python command-line tools globally but isolated (pipx install impacket)'],
            ['uv', 'A fast modern replacement for pip + venv (uv venv, uv pip install) - popular, optional'],
            ['apt install python3-xyz', 'When you want the distro-packaged, security-updated version of a library'],
          ]}
        />
        <Note type="danger">
          PyPI is open to anyone, and attackers regularly upload typosquatted packages (names like reqeusts or python-nmap lookalikes) whose install scripts steal credentials and SSH keys. Copy package names from official docs, pin versions in requirements.txt, and prefer well-known packages with long histories. pip-audit can check your requirements against known vulnerabilities.
        </Note>
      </div>
    ),
  },

  // ── CHAPTER 5 ─────────────────────────────────────────────────────────────
  {
    id: 'python-networks',
    title: 'Python for Networks',
    difficulty: 'BEGINNER',
    readTime: '22 min',
    labLink: '/modules/scripting/lab',
    takeaways: [
      'A TCP port check is just an attempted connection: socket.create_connection with a timeout succeeds if the port is open and raises OSError if it is closed or filtered.',
      'Always set timeouts on sockets and on requests calls - without one, a single unresponsive host can hang your script forever.',
      'requests with r.raise_for_status() and r.json() covers most API work; send an honest User-Agent and read API keys from environment variables.',
      'Respect rate limits: sleep between calls, honour HTTP 429 and Retry-After, and cache results instead of re-querying.',
      "Only probe systems you own or have written permission to test. Unauthorised scanning can break laws such as the US CFAA, the UK Computer Misuse Act or Kenya's Computer Misuse and Cybercrimes Act.",
    ],
    content: (
      <div>
        <H3>Sockets: The Bottom Layer</H3>
        <P>
          A socket is an endpoint for network communication. Every browser, SSH client and scanner ultimately opens sockets. Python&apos;s socket module gives you the same primitives. For TCP, connecting to a port triggers the three-way handshake: you send SYN, an open port answers SYN-ACK and the connection is established; a closed port answers RST (connection refused); a firewalled port often answers nothing at all, so you wait until a timeout.
        </P>
        <Table
          headers={['Port state', 'What the network does', 'What Python sees']}
          rows={[
            ['Open', 'SYN -> SYN-ACK -> ACK, handshake completes', 'create_connection returns a socket'],
            ['Closed', 'SYN -> RST', 'ConnectionRefusedError (a subclass of OSError), almost instantly'],
            ['Filtered', 'SYN -> silence (dropped by a firewall)', 'TimeoutError after the timeout you set'],
            ['Host down / no route', 'No response or ICMP unreachable', 'OSError (timeout or "No route to host")'],
          ]}
        />

        <H3>A TCP Port Checker for Your Own Lab</H3>
        <P>
          The script below checks a handful of ports on a host you control. It refuses targets outside an allow-list, sets a timeout, and uses a thread pool so twenty ports take about one timeout period instead of twenty. This is a learning tool for your lab VMs and your own servers - Nmap is faster, stealthier and far more capable for real assessments.
        </P>
        <Pre label="portcheck.py">
{`#!/usr/bin/env python3
"""portcheck.py - check TCP ports on hosts YOU own. Lab use only."""
import ipaddress
import socket
import sys
from concurrent.futures import ThreadPoolExecutor

ALLOWED = [ipaddress.ip_network("127.0.0.0/8"), ipaddress.ip_network("10.10.10.0/24")]
PORTS = [22, 25, 53, 80, 110, 143, 443, 445, 3306, 3389, 5432, 8080]

def in_scope(host: str) -> bool:
    addr = ipaddress.ip_address(socket.gethostbyname(host))
    return any(addr in net for net in ALLOWED)

def check(host: str, port: int, timeout: float = 1.0) -> tuple[int, bool]:
    try:
        with socket.create_connection((host, port), timeout=timeout):
            return port, True
    except OSError:                      # refused, timed out, unreachable
        return port, False

def main() -> int:
    if len(sys.argv) != 2:
        print("usage: portcheck.py HOST", file=sys.stderr)
        return 2
    host = sys.argv[1]
    if not in_scope(host):
        print("refusing: " + host + " is outside the allowed lab ranges", file=sys.stderr)
        return 3
    with ThreadPoolExecutor(max_workers=20) as pool:
        results = pool.map(lambda p: check(host, p), PORTS)
    for port, is_open in sorted(results):
        if is_open:
            print(f"{host}:{port:<5} open")
    return 0

if __name__ == "__main__":
    sys.exit(main())`}
        </Pre>
        <Pre label="RUN AGAINST YOUR OWN MACHINE">
{`$ python3 portcheck.py 127.0.0.1
127.0.0.1:22    open
127.0.0.1:5432  open
$ python3 portcheck.py 8.8.8.8
refusing: 8.8.8.8 is outside the allowed lab ranges`}
        </Pre>
        <Note type="info">
          A full connect like this is logged by the target (the connection really happens). Nmap&apos;s default SYN scan sends only the first packet of the handshake and needs raw-socket privileges. For your own learning, the connect method is simpler and needs no root.
        </Note>

        <H3>Banner Grabbing a Service You Run</H3>
        <P>
          Many services announce themselves when you connect. SSH sends a version string immediately; reading it tells you what is running and whether it is outdated. Note the bytes: recv returns bytes, so we decode with errors="replace".
        </P>
        <Pre label="BANNER GRAB (YOUR OWN SSH SERVER)">
{`import socket

with socket.create_connection(("127.0.0.1", 22), timeout=3) as s:
    banner = s.recv(256).decode(errors="replace").strip()
print(banner)

# output:
# SSH-2.0-OpenSSH_9.6p1 Ubuntu-3ubuntu13.13`}
        </Pre>

        <H3>HTTP With requests</H3>
        <P>
          Most security work over the network is HTTP: threat-intel APIs, SIEM APIs, cloud APIs, web application testing. The requests library makes it pleasant. Three habits separate good scripts from fragile ones: always pass a timeout, call raise_for_status() so HTTP errors become exceptions instead of silently returning error pages, and identify your client honestly with a User-Agent.
        </P>
        <Pre label="REQUESTS BASICS">
{`import requests

r = requests.get(
    "https://services.nvd.nist.gov/rest/json/cves/2.0",
    params={"cveId": "CVE-2021-44228"},          # requests builds the query string safely
    headers={"User-Agent": "nightshift-lab/1.0"},
    timeout=15,
)
r.raise_for_status()                              # 4xx/5xx -> requests.HTTPError
data = r.json()                                   # parse JSON body into dicts/lists

cve = data["vulnerabilities"][0]["cve"]
score = cve["metrics"]["cvssMetricV31"][0]["cvssData"]["baseScore"]
print(cve["id"], score)
print(cve["descriptions"][0]["value"][:90])

# output:
# CVE-2021-44228 10.0
# Apache Log4j2 2.0-beta9 through 2.15.0 (excluding security releases 2.12.2, 2.12.3, and 2.`}
        </Pre>

        <H3>Parsing a Real Feed: CISA KEV</H3>
        <P>
          The CISA Known Exploited Vulnerabilities catalogue is a free JSON feed of vulnerabilities confirmed to be exploited in the wild. Pulling it daily and matching it against your asset inventory is one of the highest-value scripts a small team can run.
        </P>
        <Pre label="kev_watch.py">
{`import requests

KEV_URL = "https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json"
WATCH = {"fortinet", "ivanti", "citrix", "microsoft"}      # vendors in YOUR estate

feed = requests.get(KEV_URL, timeout=30).json()
recent = sorted(feed["vulnerabilities"], key=lambda v: v["dateAdded"], reverse=True)[:50]

for v in recent:
    if v["vendorProject"].lower() in WATCH:
        flag = " [ransomware]" if v["knownRansomwareCampaignUse"] == "Known" else ""
        print(v["dateAdded"], v["cveID"], v["vendorProject"], v["product"] + flag)`}
        </Pre>

        <H3>Rate Limiting and Being a Good Citizen</H3>
        <P>
          APIs enforce limits. The NVD API, for example, allows around 5 requests per rolling 30 seconds without an API key and about 50 with one. Hammering an API gets your key revoked or your IP blocked, and in a shared office it can get everyone blocked. Build politeness in.
        </P>
        <Pre label="POLITE CLIENT">
{`import os
import time
import requests

session = requests.Session()                      # reuses TCP connections
session.headers["User-Agent"] = "nightshift-lab/1.0"
api_key = os.environ.get("NVD_API_KEY")           # never hard-code keys
if api_key:
    session.headers["apiKey"] = api_key

def get_json(url: str, params: dict, max_tries: int = 5) -> dict:
    for attempt in range(max_tries):
        r = session.get(url, params=params, timeout=20)
        if r.status_code == 429:                  # Too Many Requests
            wait = int(r.headers.get("Retry-After", 2 ** attempt))
            time.sleep(wait)
            continue
        r.raise_for_status()
        return r.json()
    raise RuntimeError("gave up after repeated 429 responses")

for cve_id in ["CVE-2024-3400", "CVE-2023-4966", "CVE-2021-44228"]:
    data = get_json("https://services.nvd.nist.gov/rest/json/cves/2.0", {"cveId": cve_id})
    print(cve_id, data["totalResults"])
    time.sleep(6.5)                               # stay under 5 requests / 30 s without a key`}
        </Pre>

        <H3>Ethics and Law</H3>
        <P>
          Network scripts reach out and touch other people&apos;s systems. The technical ease of doing so has nothing to do with whether you are allowed to. Scanning, brute-forcing or fuzzing systems without authorisation can be a crime even if nothing breaks, and terms of service for APIs and websites are enforceable contracts.
        </P>
        <Table
          headers={['Target', 'OK to probe?']}
          rows={[
            ['Your own VMs, home lab, localhost', 'Yes'],
            ["Your employer's systems", 'Only within your role or with written authorisation'],
            ['Bug bounty targets', 'Only assets listed in scope, following program rules on rate and tooling'],
            ['scanme.nmap.org', 'Light scanning is explicitly permitted by the Nmap project - no brute force, no floods'],
            ['Anything else', 'No'],
          ]}
        />
        <Note type="danger">
          Bake scope into the tool, not just into your intentions. The in_scope check in portcheck.py means a typo cannot turn a lab exercise into an incident report. Chapter 7 generalises this into a scope file every tool must consult.
        </Note>
      </div>
    ),
  },

  // ── CHAPTER 6 ─────────────────────────────────────────────────────────────
  {
    id: 'python-parsing',
    title: 'Python for Parsing and Data',
    difficulty: 'BEGINNER',
    readTime: '22 min',
    labLink: '/modules/scripting/lab',
    takeaways: [
      'Use regex to find candidates, then validate them with real parsers - ipaddress for IPs, urllib.parse for URLs - because patterns alone produce false positives like 999.1.1.1.',
      'Avoid nested quantifiers like (a+)+ that cause catastrophic backtracking (ReDoS); keep patterns specific and bounded.',
      'csv.DictReader and collections.Counter turn exports and logs into answers in a few lines.',
      'hashlib computes MD5/SHA-1/SHA-256 for file identification; use SHA-256 for anything that matters and read large files in chunks or with hashlib.file_digest.',
      'Base64 is an encoding, not encryption - anyone can decode it. Attackers use it to hide payloads; defenders decode it in one line.',
    ],
    content: (
      <div>
        <Local>A <strong>regex</strong> is describing a matatu to a tout by its pattern instead of its plate: &quot;white Nissan, red stripe, route 125&quot; matches every matatu that fits, no matter the number plate. That is its power &mdash; you catch all the emails, all the IPs, all the error lines at once. But describe it too loosely (&quot;any white vehicle&quot;) and you flag half the road; write it carelessly and a <em>greedy</em> pattern can even hang your program. Precise pattern, precise catch.</Local>
        <H3>Regular Expressions, Done Safely</H3>
        <P>
          A regular expression is a pattern that describes text. Python&apos;s re module finds, extracts and replaces matching text. Regex is how you pull IPs, hashes, domains and usernames out of messy logs and threat reports. In your own code you will often see shortcuts written with a backslash, such as backslash-d for a digit; in this module we use the equivalent character classes, which are often clearer anyway.
        </P>
        <Table
          headers={['Pattern', 'Matches', 'Example match']}
          rows={[
            ['[0-9]', 'One digit', '7'],
            ['[0-9]{1,3}', 'One to three digits', '203'],
            ['[.]', 'A literal dot (a bare . means any character)', '.'],
            ['[a-f0-9]{64}', 'Exactly 64 hex characters (a SHA-256 hash)', '24196f8a...c3f56e'],
            ['[A-Za-z0-9._-]+', 'One or more of these characters', 'svc_backup'],
            ['(?:...)', 'A group that does not capture', '(?:[.][0-9]{1,3}){3}'],
            ['(?<![a-f0-9])', 'Lookbehind: not preceded by hex (a boundary without backslash-b)', ''],
            ['^ and $', 'Start and end of the string (or line with re.MULTILINE)', ''],
          ]}
        />
        <Pre label="EXTRACT FAILED LOGINS WITH NAMED GROUPS">
{`import re

LINE = re.compile(r"Failed password for (?:invalid user )?(?P<user>[^ ]+) from (?P<ip>[0-9.]+) port (?P<port>[0-9]+)")

sample = "Nov 11 02:14:09 web01 sshd[2211]: Failed password for invalid user admin from 203.0.113.45 port 52150 ssh2"
m = LINE.search(sample)
if m:
    print(m.group("user"), m.group("ip"), m.group("port"))

# output: admin 203.0.113.45 52150`}
        </Pre>
        <P>
          Compile patterns once with re.compile and reuse them inside loops. Use search to find a match anywhere in a line, fullmatch to require the whole string to match (essential for validating input), and findall or finditer to get every match.
        </P>

        <H3>Why Regex Alone Is Not Enough</H3>
        <P>
          The loose IPv4 pattern from Chapter 3 matches 203.0.113.45 - but also 999.999.999.999 and the version string 1.2.3.4 inside v1.2.3.4. The fix is two-stage: regex finds candidates, a real parser validates them. Python&apos;s ipaddress module knows what a valid address is and can tell you whether it is private, loopback or reserved, which is exactly what you need to drop noise from IOC lists.
        </P>
        <Pre label="VALIDATE WITH ipaddress">
{`import ipaddress

for candidate in ["203.0.113.45", "999.1.1.1", "10.0.0.12", "127.0.0.1"]:
    try:
        ip = ipaddress.ip_address(candidate)
    except ValueError:
        print(candidate, "-> not an IP")
        continue
    print(candidate, "-> private" if ip.is_private else "-> public", "loopback" if ip.is_loopback else "")

# 203.0.113.45 -> private        (RFC 5737 documentation range counts as non-global)
# 999.1.1.1 -> not an IP
# 10.0.0.12 -> private
# 127.0.0.1 -> private loopback`}
        </Pre>
        <Note type="info">
          Use ip.is_global when you want internet-routable addresses only. Documentation ranges like 203.0.113.0/24 are deliberately not global, which is why they are safe to use in examples like these.
        </Note>
        <Note type="warn">
          ReDoS (regular expression denial of service): patterns with nested quantifiers such as (a+)+ or (.*)* can take exponential time on crafted input. If your tool parses attacker-controlled data - and logs are attacker-controlled - keep patterns specific, avoid nested repetition, and cap line length before matching. Python 3.11+ also supports atomic groups and possessive quantifiers that prevent backtracking.
        </Note>

        <H3>CSV: Exports Everywhere</H3>
        <P>
          Firewalls, VPNs, identity providers and spreadsheets all export CSV. Never split CSV on commas by hand - quoted fields can contain commas. csv.DictReader turns each row into a dict keyed by the header row.
        </P>
        <Pre label="VPN FAILURES PER USER">
{`import csv
from collections import Counter

failures = Counter()
with open("vpn.csv", newline="", encoding="utf-8") as f:
    for row in csv.DictReader(f):
        if row["result"] == "failure":
            failures[row["user"]] += 1

for user, n in failures.most_common(3):
    print(f"{user:<12} {n}")

# svc_backup   212
# amina        4
# kiprop       2`}
        </Pre>
        <Pre label="WRITE RESULTS BACK OUT">
{`with open("failures_by_user.csv", "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f)
    w.writerow(["user", "failures"])
    w.writerows(failures.most_common())`}
        </Pre>

        <H3>Parsing a Log Into Structured Data</H3>
        <P>
          Combining a compiled regex with Counter gives you the Bash top-talkers pipeline, but now you can easily add logic: group by user and IP, apply thresholds, output JSON for a SIEM.
        </P>
        <Pre label="STRUCTURED SSH SUMMARY">
{`import json
import re
from collections import Counter, defaultdict

LINE = re.compile(r"Failed password for (?:invalid user )?(?P<user>[^ ]+) from (?P<ip>[0-9.]+) port")

by_ip = Counter()
users_by_ip = defaultdict(set)
with open("auth.log", encoding="utf-8", errors="replace") as f:
    for line in f:
        m = LINE.search(line[:2000])               # cap length: defensive against junk lines
        if m:
            by_ip[m["ip"]] += 1
            users_by_ip[m["ip"]].add(m["user"])

report = [
    {"ip": ip, "failures": n, "distinct_users": len(users_by_ip[ip])}
    for ip, n in by_ip.most_common() if n >= 10
]
print(json.dumps(report, indent=2))`}
        </Pre>
        <P>
          The distinct_users field is a useful signal: one IP trying hundreds of different usernames is password spraying or username enumeration, while one IP hammering only root is classic brute force.
        </P>

        <H3>Hashing With hashlib</H3>
        <P>
          A cryptographic hash turns any input into a fixed-length fingerprint. Change one bit and the hash changes completely. Analysts use hashes to identify malware samples, check file integrity and share IOCs without sharing the file. MD5 and SHA-1 are broken for collision resistance and should not be trusted for integrity, but you will still see them in older threat reports; SHA-256 is the default today.
        </P>
        <Pre label="HASHLIB">
{`$ python3 -c "import hashlib; print(hashlib.sha256(b'nightshift').hexdigest())"
24196f8a6feeb465c790774d3f85b53a2cdf84ed1e0044c420086c4310c3f56e

# hash a file without loading it all into memory (Python 3.11+)
import hashlib
with open("suspicious.exe", "rb") as f:
    print(hashlib.file_digest(f, "sha256").hexdigest())

# portable version for older Pythons: read in 1 MiB chunks
h = hashlib.sha256()
with open("suspicious.exe", "rb") as f:
    for chunk in iter(lambda: f.read(1024 * 1024), b""):
        h.update(chunk)
print(h.hexdigest())`}
        </Pre>
        <Note type="tip">
          Hashing the string nightshift typed with echo gives a different result than the Python one-liner above, because echo adds a newline byte. Use printf or echo -n when comparing with sha256sum. One invisible byte, totally different hash.
        </Note>

        <H3>Base64: Encoding, Not Encryption</H3>
        <P>
          Base64 represents arbitrary bytes using 64 printable characters so binary data survives email, JSON and command lines. It provides zero secrecy. Attackers use it to smuggle payloads past naive keyword filters - an encoded PowerShell command, a webshell body, a config blob in malware. Defenders decode it instantly.
        </P>
        <Pre label="BASE64">
{`$ python3 -c "import base64; print(base64.b64decode('R0hPU1R7YjY0X2lzX2VuY29kaW5nX25vdF9jcnlwdG99').decode())"
GHOST{b64_is_encoding_not_crypto}

$ echo 'R0hPU1R7YjY0X2lzX2VuY29kaW5nX25vdF9jcnlwdG99' | base64 -d     # same result in Bash

>>> import base64
>>> base64.b64encode(b"whoami")
b'd2hvYW1p'
>>> base64.urlsafe_b64decode("aGVsbG8tLT4_")       # URL-safe alphabet uses - and _
b'hello-->?'`}
        </Pre>

        <H3>A Simple IOC Extractor</H3>
        <P>
          Threat reports are full of indicators, often defanged so readers do not click them: hxxp instead of http, [.] instead of a dot. This extractor refangs, extracts, validates and deduplicates.
        </P>
        <Pre label="iocx.py">
{`import ipaddress
import re
import sys

IP_RE = re.compile(r"(?<![0-9A-Za-z.])[0-9]{1,3}(?:[.][0-9]{1,3}){3}(?![0-9.])")   # not inside v1.2.3.4
SHA256_RE = re.compile(r"(?<![a-fA-F0-9])[a-fA-F0-9]{64}(?![a-fA-F0-9])")
DOMAIN_RE = re.compile(r"(?<![A-Za-z0-9.-])(?:[A-Za-z0-9-]{1,63}[.])+[A-Za-z]{2,24}(?![A-Za-z0-9-])")

RFC1918 = [ipaddress.ip_network(n) for n in ("10.0.0.0/8", "172.16.0.0/12", "192.168.0.0/16")]

def interesting(ip) -> bool:
    # drop internal noise; production code often uses ip.is_global, which ALSO drops
    # documentation ranges like the 198.51.100.0/24 addresses used in this module
    return not (ip.is_loopback or ip.is_link_local or ip.is_multicast or ip.is_unspecified
                or any(ip in net for net in RFC1918))

def refang(text: str) -> str:
    return text.replace("[.]", ".").replace("(.)", ".").replace("hxxp", "http").replace("[:]", ":")

def extract(text: str) -> dict[str, list[str]]:
    text = refang(text)
    ips = set()
    for cand in IP_RE.findall(text):
        try:
            if interesting(ipaddress.ip_address(cand)):
                ips.add(cand)
        except ValueError:
            pass                                   # 999.1.1.1 and friends
    return {
        "ipv4": sorted(ips),
        "sha256": sorted({h.lower() for h in SHA256_RE.findall(text)}),
        "domains": sorted({d.lower() for d in DOMAIN_RE.findall(text)}),
    }

if __name__ == "__main__":
    for kind, values in extract(sys.stdin.read()).items():
        for v in values:
            print(kind, v, sep=",")`}
        </Pre>
        <Pre label="USAGE">
{`$ cat report.txt | python3 iocx.py
ipv4,198.51.100.77
sha256,24196f8a6feeb465c790774d3f85b53a2cdf84ed1e0044c420086c4310c3f56e
domains,cdn-sync.example
domains,update-check.example`}
        </Pre>
        <P>
          Expect false positives in the domain list (filenames like report.pdf look like domains) - review output before you block anything. Mature teams pair a script like this with an allow-list of their own domains and a check against a threat-intel platform.
        </P>
      </div>
    ),
  },

  // ── CHAPTER 7 ─────────────────────────────────────────────────────────────
  {
    id: 'automate-recon-defence',
    title: 'Automating Recon and Defence Safely',
    difficulty: 'INTERMEDIATE',
    readTime: '22 min',
    labLink: '/modules/scripting/lab',
    takeaways: [
      "Never scrape Nmap's human-readable output; use -oX (XML) and parse it with xml.etree.ElementTree, or defusedxml for files you did not produce.",
      "Diffing today's scan against yesterday's turns a scanner into a change detector - new open ports are exactly what defenders want to hear about.",
      'cron runs jobs on a schedule with a minimal environment: use absolute paths, redirect output to a log, and wrap jobs in flock to prevent overlapping runs.',
      'A log watcher that follows a file and alerts on thresholds is a mini-SIEM; add cooldowns so one attack does not produce a thousand alerts.',
      'Every tool that touches the network should read a scope file and refuse anything outside it, with a dry-run mode for new targets.',
    ],
    content: (
      <div>
        <H3>From Scripts to Systems</H3>
        <P>
          So far you have written scripts you run by hand. Real value appears when scripts run themselves: a nightly scan of your own perimeter that tells you what changed, a watcher that pages you when brute force starts, a feed check that flags newly exploited vulnerabilities in products you run. This chapter builds those pieces - with the guard rails that stop automation from becoming an incident.
        </P>

        <H3>Rule Zero: A Scope File</H3>
        <P>
          Automated tools run without a human double-checking each target. That makes scope enforcement in code mandatory. Keep authorised ranges in one file, load it in every tool, and refuse anything outside it. When a colleague adds a target, they edit the scope file - which can be reviewed in git - not the script.
        </P>
        <Pre label="scope.txt">
{`# Authorised targets - owner: blue team, approved 2026-11-01, ticket SEC-1042
10.10.10.0/24
192.168.56.0/24
203.0.113.10/32        # our public web server (documentation IP used here)`}
        </Pre>
        <Pre label="scope.py">
{`import ipaddress

def load_scope(path: str = "scope.txt") -> list:
    nets = []
    with open(path, encoding="utf-8") as f:
        for raw in f:
            line = raw.split("#", 1)[0].strip()
            if line:
                nets.append(ipaddress.ip_network(line, strict=False))
    return nets

def require_in_scope(target: str, scope: list) -> None:
    net = ipaddress.ip_network(target, strict=False)
    if not any(net.subnet_of(s) for s in scope if s.version == net.version):
        raise SystemExit("OUT OF SCOPE, refusing: " + target)`}
        </Pre>

        <H3>Wrapping Nmap and Parsing XML</H3>
        <P>
          Nmap&apos;s normal output is meant for humans and changes between versions. Its XML output (-oX) is structured and stable. Run Nmap from Python with subprocess using a list of arguments - never build a shell string from input, which invites command injection - then parse the XML.
        </P>
        <Pre label="RUN NMAP FROM PYTHON (LIST ARGS, NO SHELL)">
{`import subprocess

def run_scan(target: str, out_xml: str) -> None:
    cmd = ["nmap", "-sV", "--top-ports", "1000", "-T3", "-oX", out_xml, target]
    subprocess.run(cmd, check=True, capture_output=True, text=True, timeout=3600)`}
        </Pre>
        <Pre label="PARSE nmap -oX OUTPUT">
{`import xml.etree.ElementTree as ET    # fine for XML you generated yourself

def open_ports(xml_path: str) -> set[tuple[str, int, str]]:
    found = set()
    root = ET.parse(xml_path).getroot()
    for host in root.findall("host"):
        addr = host.find("address").get("addr")
        for port in host.findall("ports/port"):
            if port.find("state").get("state") != "open":
                continue
            svc = port.find("service")
            name = svc.get("name", "?") if svc is not None else "?"
            found.add((addr, int(port.get("portid")), name))
    return found

for addr, port, name in sorted(open_ports("today.xml")):
    print(f"{addr:<15} {port:>5}/tcp  {name}")

# 10.10.10.5         22/tcp  ssh
# 10.10.10.5         80/tcp  http
# 10.10.10.7       3389/tcp  ms-wbt-server`}
        </Pre>
        <Note type="warn">
          The standard library XML parsers are not hardened against malicious XML such as entity-expansion bombs. For XML produced by your own Nmap run they are fine; for XML uploaded by someone else, use the defusedxml package, which offers the same API with the dangerous features disabled.
        </Note>

        <H3>Change Detection: The Scan Diff</H3>
        <P>
          A list of open ports is mildly interesting. A list of ports that opened since yesterday is actionable: a developer exposed a database, someone enabled RDP on a server, or an attacker started a listener. Sets make the diff one line.
        </P>
        <Pre label="DIFF TWO SCANS">
{`before = open_ports("yesterday.xml")
after = open_ports("today.xml")

for addr, port, name in sorted(after - before):
    print("NEW    ", addr, port, name)
for addr, port, name in sorted(before - after):
    print("CLOSED ", addr, port, name)

# NEW     10.10.10.7 3389 ms-wbt-server
# NEW     10.10.10.9 5432 postgresql`}
        </Pre>

        <H3>Scheduling With cron</H3>
        <P>
          cron is the classic Unix scheduler. Each user has a crontab (edit with crontab -e, list with crontab -l). Each line has five time fields followed by the command.
        </P>
        <Table
          headers={['Field', 'Allowed values', 'Example', 'Meaning']}
          rows={[
            ['minute', '0-59', '*/15', 'every 15 minutes'],
            ['hour', '0-23', '2', 'at 02:xx'],
            ['day of month', '1-31', '*', 'every day'],
            ['month', '1-12', '*', 'every month'],
            ['day of week', '0-7 (0 and 7 are Sunday)', '1-5', 'Monday to Friday'],
          ]}
        />
        <Pre label="CRONTAB LINES">
{`# m    h  dom mon dow  command
*/15   *  *   *   *    /opt/nightshift/run.sh >> /var/log/nightshift.log 2>&1
30     2  *   *   *    /usr/bin/flock -n /run/lock/scan.lock /opt/nightshift/.venv/bin/python /opt/nightshift/scan_diff.py
0      7  *   *   1-5  /opt/nightshift/.venv/bin/python /opt/nightshift/kev_watch.py`}
        </Pre>
        <Table
          headers={['Gotcha', 'Fix']}
          rows={[
            ['cron runs with a tiny PATH and no venv activation', 'Use absolute paths, and call the venv interpreter directly (.venv/bin/python)'],
            ['Output is mailed locally or lost', 'Redirect: >> /var/log/job.log 2>&1'],
            ['A slow run overlaps the next one', 'Wrap with flock -n LOCKFILE so a second copy exits immediately'],
            ["Times are in the server's timezone", 'Check timedatectl; many teams run servers in UTC'],
            ['The % character is special in crontab', 'Escape it or move the command into a script'],
          ]}
        />
        <Note type="info">
          On systemd-based distributions, systemd timers are a modern alternative to cron with built-in logging (journalctl -u yourjob), randomised delays and catch-up after downtime (Persistent=true). Both are fine; cron is everywhere and simpler to learn first.
        </Note>
        <Note type="danger">
          Attackers love cron too: a malicious crontab entry is one of the most common Linux persistence techniques (MITRE ATT&amp;CK T1053.003). Audit crontabs during incident response with crontab -l for each user and by reviewing /etc/crontab, /etc/cron.d and the spool directory under /var/spool/cron.
        </Note>

        <H3>A Log Watcher That Alerts</H3>
        <P>
          A watcher follows a log as it grows, keeps a sliding window of recent failures per IP, and sends an alert when a threshold is crossed. A cooldown prevents alert storms. This is a miniature version of what fail2ban and SIEM correlation rules do.
        </P>
        <Pre label="watch_ssh.py">
{`import os
import re
import time
from collections import defaultdict, deque

import requests

LOG = "/var/log/auth.log"
WEBHOOK = os.environ["ALERT_WEBHOOK_URL"]          # Slack/Teams/Discord incoming webhook
LINE = re.compile(r"Failed password for (?:invalid user )?[^ ]+ from (?P<ip>[0-9.]+) port")
WINDOW, THRESHOLD, COOLDOWN = 60, 20, 900          # 20 failures in 60 s, re-alert after 15 min

hits = defaultdict(deque)
last_alert = {}

def follow(path):
    with open(path, encoding="utf-8", errors="replace") as f:
        f.seek(0, os.SEEK_END)                     # start at the end, like tail -f
        while True:
            line = f.readline()
            if not line:
                time.sleep(0.5)
                continue
            yield line

for line in follow(LOG):
    m = LINE.search(line)
    if not m:
        continue
    ip, now = m["ip"], time.time()
    q = hits[ip]
    q.append(now)
    while q and now - q[0] > WINDOW:
        q.popleft()
    if len(q) >= THRESHOLD and now - last_alert.get(ip, 0) > COOLDOWN:
        last_alert[ip] = now
        msg = f"SSH brute force: {ip} - {len(q)} failures in {WINDOW}s on {os.uname().nodename}"
        requests.post(WEBHOOK, json={"text": msg}, timeout=10)`}
        </Pre>
        <P>
          This simple follower does not handle log rotation (when auth.log is renamed and a new file starts). Production watchers reopen the file when its inode changes, or read from journald instead with journalctl -f -u ssh -o cat piped into the script. Run the watcher as a systemd service so it restarts on failure.
        </P>

        <H3>Alerting Versus Acting</H3>
        <P>
          It is tempting to make the watcher block IPs automatically. Do that carefully: an attacker who can spoof source addresses, or a misparsed log line, can trick an auto-blocker into blocking your own gateway or monitoring server. Start with alerts, measure false positives for a few weeks, then automate blocking with an allow-list of addresses that must never be blocked and an expiry on every block. Mature tools like fail2ban and CrowdSec already implement these safeguards - often the right answer is to configure one of them and keep your script for reporting.
        </P>
      </div>
    ),
  },

  // ── CHAPTER 8 ─────────────────────────────────────────────────────────────
  {
    id: 'powershell-essentials',
    title: 'PowerShell Essentials',
    difficulty: 'INTERMEDIATE',
    readTime: '22 min',
    labLink: '/modules/scripting/lab',
    takeaways: [
      'PowerShell pipes objects, not text: filter with Where-Object, pick properties with Select-Object, and discover what an object holds with Get-Member.',
      'Get-WinEvent -FilterHashtable filters at the event log service and is far faster than piping everything into Where-Object.',
      'Know the core event IDs: 4624/4625 logon success/failure, 4688 process creation, 4104 script block logging, 7045 service installed, 1102 audit log cleared.',
      'Execution policy is a safety feature, not a security boundary - powershell -ExecutionPolicy Bypass defeats it trivially.',
      'Defenders win with Script Block Logging (event 4104), module logging, transcription, AMSI, Constrained Language Mode via application control, and removing PowerShell 2.0.',
    ],
    content: (
      <div>
        <H3>Why PowerShell Matters to Both Sides</H3>
        <P>
          PowerShell is the administration language of Windows, Active Directory, Exchange, Microsoft 365 and Azure. Windows PowerShell 5.1 is built into every supported Windows version; PowerShell 7 (pwsh) is the modern, cross-platform edition that runs on Windows, Linux and macOS and installs side by side. For an attacker on a Windows network, it is a signed, trusted, always-present tool that can reach every management API. For a defender, it is the fastest way to query event logs and configuration across a fleet - and its logging is one of the best sources of attacker telemetry Windows offers.
        </P>

        <H3>Cmdlets: Verb-Noun</H3>
        <P>
          Commands are called cmdlets and follow a Verb-Noun pattern: Get-Process, Stop-Service, Get-LocalUser. Because the naming is consistent, you can discover commands you have never seen. Three cmdlets teach you everything else.
        </P>
        <Pre label="DISCOVERY">
{`PS> Get-Command -Noun *Event*            # what commands deal with events?
PS> Get-Help Get-WinEvent -Examples      # usage examples (run Update-Help once first)
PS> Get-Process | Get-Member             # what properties and methods does a process object have?

   TypeName: System.Diagnostics.Process
Name        MemberType  Definition
----        ----------  ----------
Kill        Method      void Kill()
Id          Property    int Id {get;}
Path        ScriptProperty System.Object Path {get=$this.MainModule.FileName;}
StartTime   Property    datetime StartTime {get;}`}
        </Pre>
        <Table
          headers={['Bash habit', 'PowerShell equivalent']}
          rows={[
            ['ls / cat / grep', 'Get-ChildItem / Get-Content / Select-String (aliases ls, cat, sls exist)'],
            ['ps aux', 'Get-Process'],
            ['grep pattern (filter lines)', 'Where-Object { $_.Name -like "*pattern*" }'],
            ['awk print a column', 'Select-Object Name, Id'],
            ['sort | uniq -c', 'Group-Object Property | Sort-Object Count -Descending'],
            ['wc -l', 'Measure-Object'],
            ['jq', 'ConvertFrom-Json / ConvertTo-Json'],
          ]}
        />

        <H3>The Object Pipeline</H3>
        <P>
          In Bash, every command emits text and the next command has to parse it. In PowerShell, commands emit .NET objects with typed properties. You never need to count columns: you ask for the property by name. Inside a script block, $_ (or $PSItem) refers to the current object.
        </P>
        <Pre label="OBJECTS DOWN THE PIPE">
{`# processes using more than 500 MB, biggest first
PS> Get-Process | Where-Object { $_.WorkingSet64 -gt 500MB } |
>>   Sort-Object WorkingSet64 -Descending | Select-Object Name, Id, @{n='MB'; e={[int]($_.WorkingSet64 / 1MB)}}

Name      Id    MB
----      --    --
msedge    8812  1210
MsMpEng   3120   612

# services set to start automatically but currently stopped
PS> Get-Service | Where-Object { $_.StartType -eq 'Automatic' -and $_.Status -ne 'Running' }

# export anything to CSV or JSON for a report
PS> Get-LocalUser | Select-Object Name, Enabled, LastLogon | Export-Csv users.csv -NoTypeInformation`}
        </Pre>
        <Note type="tip">
          A pipe at the end of a line lets a command continue on the next line, as above. PowerShell also has a backtick line-continuation character, but it is fragile (an invisible trailing space breaks it); ending lines with a pipe or using splatting is the cleaner habit.
        </Note>

        <H3>Querying Event Logs With Get-WinEvent</H3>
        <P>
          Windows security telemetry lives in event logs. Get-WinEvent reads them, and its -FilterHashtable parameter pushes the filter down to the event log service so only matching events are returned. Piping every event into Where-Object instead can be hundreds of times slower on a busy domain controller. Reading the Security log requires an elevated session.
        </P>
        <Pre label="FAILED LOGONS (4625) IN THE LAST 24 HOURS">
{`PS> Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4625; StartTime=(Get-Date).AddHours(-24)} -MaxEvents 5

   ProviderName: Microsoft-Windows-Security-Auditing
TimeCreated            Id LevelDisplayName Message
-----------            -- ---------------- -------
11/11/2026 02:14:07  4625 Information      An account failed to log on. ...
11/11/2026 02:14:05  4625 Information      An account failed to log on. ...`}
        </Pre>
        <P>
          The interesting fields (target user, source IP, logon type) sit inside the event data. The most robust way to read them is to convert the event to XML and select fields by name, rather than relying on positional indexes that differ between event IDs.
        </P>
        <Pre label="TOP SOURCE IPS FOR FAILED LOGONS">
{`$events = Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4625; StartTime=(Get-Date).AddDays(-1)}

$events | ForEach-Object {
    $data = ([xml]$_.ToXml()).Event.EventData.Data
    [pscustomobject]@{
        Time      = $_.TimeCreated
        User      = ($data | Where-Object Name -eq 'TargetUserName').'#text'
        SourceIP  = ($data | Where-Object Name -eq 'IpAddress').'#text'
        LogonType = ($data | Where-Object Name -eq 'LogonType').'#text'
    }
} | Group-Object SourceIP | Sort-Object Count -Descending | Select-Object -First 5 Count, Name

Count Name
----- ----
 4127 203.0.113.45
   61 192.0.2.99`}
        </Pre>
        <Table
          headers={['Event ID', 'Log', 'Meaning', 'Why you care']}
          rows={[
            ['4624', 'Security', 'Successful logon', 'Logon type 3 (network) and 10 (RDP) after a spray = compromise'],
            ['4625', 'Security', 'Failed logon', 'Brute force and password spraying'],
            ['4688', 'Security', 'Process created (enable command-line auditing)', 'See every command an attacker ran'],
            ['4720 / 4732', 'Security', 'User created / added to local group', 'Persistence and privilege escalation'],
            ['7045', 'System', 'New service installed', 'PsExec-style lateral movement, malicious services'],
            ['1102', 'Security', 'Audit log cleared', 'Anti-forensics - almost never legitimate'],
            ['4104', 'Microsoft-Windows-PowerShell/Operational', 'Script block logged', 'The actual PowerShell code that ran, after de-obfuscation'],
          ]}
        />

        <H3>Execution Policy: Not a Security Boundary</H3>
        <P>
          Execution policy controls whether PowerShell will run script files. The default is Restricted on Windows client editions and RemoteSigned on Windows Server. Microsoft itself documents that execution policy is not a security boundary: it exists to stop users running scripts by accident. Anyone can bypass it for their own session.
        </P>
        <Pre label="EXECUTION POLICY">
{`PS> Get-ExecutionPolicy -List                       # policy at each scope
PS> Set-ExecutionPolicy RemoteSigned -Scope CurrentUser   # sensible for your own admin box

# why it is not a defence - all of these sidestep it:
powershell.exe -ExecutionPolicy Bypass -File script.ps1
Get-Content script.ps1 | powershell.exe -NoProfile -
powershell.exe -EncodedCommand <base64 of UTF-16LE text>`}
        </Pre>

        <H3>Why Attackers Love PowerShell</H3>
        <P>
          It is present everywhere, signed by Microsoft, can download and execute code entirely in memory, talks natively to Active Directory, WMI and the Windows API, and its commands can be obfuscated in endless ways. Two patterns appear in countless incident reports: the download cradle, where IEX (Invoke-Expression) runs a script fetched with Net.WebClient or Invoke-WebRequest straight from a URL, and -EncodedCommand (often shortened to -enc or -e), which takes a base64 string of UTF-16LE text so the real command is not visible in the process command line.
        </P>
        <Pre label="DECODE AN -EncodedCommand FROM AN ALERT (PYTHON)">
{`import base64

blob = "dwBoAG8AYQBtAGkAOwAgAGgAbwBzAHQAbgBhAG0AZQA="     # taken from a 4688 / EDR alert
print(base64.b64decode(blob).decode("utf-16-le"))

# output: whoami; hostname`}
        </Pre>

        <H3>How Defenders Log and Constrain It</H3>
        <P>
          The good news: modern PowerShell gives defenders excellent visibility if it is switched on. Script Block Logging records the content of every script block PowerShell processes - after it has been decoded and de-obfuscated at runtime - as event 4104 in the Microsoft-Windows-PowerShell/Operational log. Even when it is not explicitly enabled, PowerShell 5+ automatically logs script blocks that contain known-suspicious keywords as warning-level 4104 events.
        </P>
        <Pre label="ENABLE SCRIPT BLOCK LOGGING (LAB MACHINE, ELEVATED)">
{`# Group Policy (preferred in a domain):
#   Computer Configuration > Administrative Templates > Windows Components >
#   Windows PowerShell > Turn on PowerShell Script Block Logging = Enabled
#
# Local equivalent via the policy registry key (PowerShell accepts / in registry paths):
$key = 'HKLM:/SOFTWARE/Policies/Microsoft/Windows/PowerShell/ScriptBlockLogging'
New-Item -Path $key -Force | Out-Null
Set-ItemProperty -Path $key -Name EnableScriptBlockLogging -Value 1

# hunt for download cradles and encoded commands in what was logged
Get-WinEvent -FilterHashtable @{LogName='Microsoft-Windows-PowerShell/Operational'; Id=4104} |
  Where-Object { $_.Message -match 'DownloadString|Invoke-Expression|IEX |FromBase64String' } |
  Select-Object TimeCreated, @{n='Snippet'; e={$_.Message.Substring(0, [Math]::Min(160, $_.Message.Length))}}`}
        </Pre>
        <Table
          headers={['Control', 'What it gives you']}
          rows={[
            ['Script Block Logging (4104)', 'The de-obfuscated code that actually ran'],
            ['Module Logging (4103)', 'Pipeline execution details for specified modules'],
            ['Transcription', 'Full input/output text of sessions written to a protected share'],
            ['AMSI', 'Lets antivirus/EDR scan script content in memory before it runs'],
            ['Constrained Language Mode', 'Blocks .NET/COM abuse; enforced properly via App Control for Business (WDAC) or AppLocker'],
            ['Remove PowerShell 2.0', 'v2 has none of the above - attackers downgrade with powershell -version 2. Recent Windows 11 and Server 2025 builds have removed it; uninstall it elsewhere'],
            ['Forward logs to a SIEM', 'Attackers clear local logs (1102); a copy elsewhere survives'],
          ]}
        />
        <Note type="info">
          Script block logs can capture secrets that admins type into scripts, such as passwords in connection strings. Treat the PowerShell Operational log and your SIEM index as sensitive data, and consider Protected Event Logging, which encrypts 4104 content with a certificate.
        </Note>
      </div>
    ),
  },

  // ── CHAPTER 9 ─────────────────────────────────────────────────────────────
  {
    id: 'build-and-share',
    title: 'Building and Sharing a Real Tool',
    difficulty: 'INTERMEDIATE',
    readTime: '22 min',
    labLink: '/modules/scripting/lab',
    takeaways: [
      'argparse gives any script a real CLI - --help, typed options, defaults and errors - for free; design flags so the safe behaviour is the default.',
      'Use the logging module (to stderr) for diagnostics and stdout for results, and return meaningful exit codes so other tools and cron can react.',
      'Small pytest tests on your parsing functions catch regressions when log formats drift, which they will.',
      'Package with pyproject.toml and a [project.scripts] entry point so users can pipx install your tool; keep .venv and secrets out of git.',
      'Publishing a security tool is a disclosure decision: document intended use, ship safe defaults, never bundle working exploits for unpatched bugs, and add a SECURITY.md for reports.',
    ],
    content: (
      <div>
        <H3>From Script to Tool</H3>
        <P>
          A script is something you run. A tool is something other people can run without asking you how. The difference is a command-line interface with help text, predictable output, sensible errors, tests, a README and a way to install it. This chapter turns the SSH log parser from earlier chapters into parse_auth, the same tool you will drive in the lab.
        </P>

        <H3>A Real CLI With argparse</H3>
        <P>
          argparse is in the standard library. You declare arguments; it generates --help, validates types, applies defaults and prints a usage error (with exit code 2) when the user gets it wrong.
        </P>
        <Pre label="parse_auth.py">
{`#!/usr/bin/env python3
"""parse_auth - summarise failed SSH logins from an auth log."""
import argparse
import json
import logging
import re
import sys
from collections import Counter

__version__ = "1.0.0"
log = logging.getLogger("parse_auth")
LINE = re.compile(r"Failed password for (?:invalid user )?(?P<user>[^ ]+) from (?P<ip>[0-9.]+) port")

def parse(lines) -> Counter:
    counts = Counter()
    for line in lines:
        m = LINE.search(line[:2000])
        if m:
            counts[m["ip"]] += 1
    return counts

def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(prog="parse_auth", description=__doc__)
    p.add_argument("--log", default="/var/log/auth.log", help="log file to read (default: %(default)s)")
    p.add_argument("--threshold", type=int, default=10, help="report IPs with at least N failures")
    p.add_argument("--json", action="store_true", help="emit JSON instead of a table")
    p.add_argument("-v", "--verbose", action="store_true", help="debug logging to stderr")
    p.add_argument("--version", action="version", version="%(prog)s " + __version__)
    return p

def main(argv=None) -> int:
    args = build_parser().parse_args(argv)
    logging.basicConfig(level=logging.DEBUG if args.verbose else logging.WARNING,
                        format="%(asctime)s %(levelname)s %(name)s: %(message)s")
    try:
        with open(args.log, encoding="utf-8", errors="replace") as f:
            counts = parse(f)
    except OSError as e:
        log.error("cannot read %s: %s", args.log, e)
        return 2
    hits = [(ip, n) for ip, n in counts.most_common() if n >= args.threshold]
    log.debug("parsed %d IPs, %d over threshold", len(counts), len(hits))
    if args.json:
        print(json.dumps([{"ip": ip, "failures": n} for ip, n in hits], indent=2))
    else:
        for ip, n in hits:
            print(f"{n:>7}  {ip}")
    return 1 if hits else 0          # 1 = findings, so cron or CI can react

if __name__ == "__main__":
    sys.exit(main())`}
        </Pre>
        <Pre label="USING IT">
{`$ python3 parse_auth.py --help
usage: parse_auth [-h] [--log LOG] [--threshold THRESHOLD] [--json] [-v]
                  [--version]

parse_auth - summarise failed SSH logins from an auth log.

options:
  -h, --help            show this help message and exit
  --log LOG             log file to read (default: /var/log/auth.log)
  --threshold THRESHOLD
                        report IPs with at least N failures
  --json                emit JSON instead of a table
  -v, --verbose         debug logging to stderr
  --version             show program's version number and exit

$ python3 parse_auth.py --log auth.log --threshold 50
   4127  203.0.113.45
    902  198.51.100.200
     61  192.0.2.99
$ echo $?
1`}
        </Pre>

        <H3>Design Choices That Matter</H3>
        <Table
          headers={['Choice', 'Why']}
          rows={[
            ['Results on stdout, logs on stderr', 'Users can pipe results (| jq) without debug noise mixed in'],
            ['--json output mode', 'Machines (SIEM, SOAR, jq) consume it; humans get the table'],
            ['Exit codes 0 / 1 / 2', 'Clean / findings / error - scripts and cron can branch on them'],
            ['Safe defaults', 'Read-only by default; anything destructive needs an explicit flag'],
            ['main(argv) takes a list', 'Tests can call main(["--log", "x"]) without spawning a process'],
            ['--version', 'Bug reports become answerable'],
          ]}
        />

        <H3>Tests With pytest</H3>
        <P>
          Log formats change - remember the ISO timestamps and sshd-session from Chapter 3. Tests pin down what your parser must handle, so when you adapt it you know you did not break the old cases. Install pytest inside your venv and put tests in a tests directory.
        </P>
        <Pre label="tests/test_parse_auth.py">
{`from parse_auth import parse, main

VALID = "Nov 11 02:14:07 web01 sshd[2211]: Failed password for root from 203.0.113.45 port 52144 ssh2"
INVALID = "Nov 11 02:14:09 web01 sshd[2211]: Failed password for invalid user admin from 203.0.113.45 port 52150 ssh2"
ISO = "2026-11-11T02:16:11.481516+00:00 web01 sshd-session[2230]: Failed password for root from 192.0.2.99 port 60001 ssh2"
NOISE = "Nov 11 02:15:01 web01 sshd[2215]: Accepted publickey for deploy from 198.51.100.7 port 40022 ssh2"

def test_counts_valid_and_invalid_users():
    assert parse([VALID, INVALID])["203.0.113.45"] == 2

def test_handles_iso_timestamps_and_sshd_session():
    assert parse([ISO])["192.0.2.99"] == 1

def test_ignores_successful_logins():
    assert parse([NOISE]) == {}

def test_missing_file_returns_2(tmp_path):
    assert main(["--log", str(tmp_path / "nope.log")]) == 2`}
        </Pre>
        <Pre label="RUN TESTS">
{`(.venv) $ pip install pytest
(.venv) $ pytest -q
....                                                     [100%]
4 passed in 0.03s`}
        </Pre>

        <H3>Packaging With pyproject.toml</H3>
        <P>
          A pyproject.toml file describes your project in the standard format every modern Python tool understands. The [project.scripts] table creates a real command on install, so users type parse-auth instead of python3 path/to/parse_auth.py.
        </P>
        <Pre label="pyproject.toml">
{`[build-system]
requires = ["setuptools>=69"]
build-backend = "setuptools.build_meta"

[project]
name = "parse-auth"
version = "1.0.0"
description = "Summarise failed SSH logins from auth logs"
readme = "README.md"
requires-python = ">=3.10"
license = "MIT"
dependencies = []

[project.scripts]
parse-auth = "parse_auth:main"

[project.optional-dependencies]
dev = ["pytest"]`}
        </Pre>
        <Pre label="INSTALL IT LIKE A USER WOULD">
{`$ pipx install .                 # isolated install of your own tool
$ parse-auth --log auth.log --json | jq '.[0]'
{
  "ip": "203.0.113.45",
  "failures": 4127
}`}
        </Pre>

        <H3>Git Basics for Tool Authors</H3>
        <Pre label="FIRST COMMIT">
{`$ git init
$ cat > .gitignore <<'EOF'
.venv/
__pycache__/
*.log
.env
EOF
$ git add parse_auth.py tests/ pyproject.toml README.md .gitignore
$ git commit -m "parse_auth 1.0.0: failed SSH login summariser"
$ git log --oneline
3f2c9a1 parse_auth 1.0.0: failed SSH login summariser`}
        </Pre>
        <P>
          The heredoc (everything between the two EOF markers) writes four lines into .gitignore. Ignoring .venv, logs and .env files matters: the most common way security tools leak credentials is a developer committing an API key or a sample log full of real IPs and usernames. Scanners like gitleaks or trufflehog can check your history before you publish. If a secret is ever pushed, rotate it immediately - deleting the commit does not un-leak it.
        </P>

        <H3>Writing a README People Can Use</H3>
        <Pre label="README.md">
{`# parse-auth

Summarise failed SSH logins from an auth log, as a table or JSON.

## Intended use
Defensive triage of logs from systems you administer. Read-only.

## Install
    pipx install parse-auth

## Usage
    parse-auth --log /var/log/auth.log --threshold 20
    parse-auth --log auth.log --json | jq '.[].ip'

Exit codes: 0 = no findings, 1 = findings, 2 = error.

## Limitations
IPv4 only. Does not follow log rotation. journald users:
    journalctl -u ssh -o cat > ssh.log && parse-auth --log ssh.log

## Reporting security issues
See SECURITY.md. Please do not open public issues for vulnerabilities.`}
        </Pre>

        <H3>Responsible Disclosure of Tools</H3>
        <P>
          Almost every security tool is dual-use: a scanner that finds exposed databases for defenders finds them for attackers too. That is not a reason to never publish - the community depends on shared tooling - but publishing is a decision with consequences, and professionals make it deliberately.
        </P>
        <Table
          headers={['Question', 'Good practice']}
          rows={[
            ['Does it exploit an unpatched vulnerability?', 'Do not publish working exploit code until the vendor has patched and users have had time to update; coordinate timing with the vendor or a CERT'],
            ['Could defaults cause harm?', 'Ship conservative defaults: low rates, scope files required, destructive actions behind explicit flags'],
            ['Is the purpose clear?', 'Document intended use, limitations and legal reminders in the README'],
            ['Can defenders detect it?', 'Consider publishing detection guidance (Sigma or YARA rules) alongside offensive tooling'],
            ['How do people report bugs in your tool?', 'Add SECURITY.md with a private contact and enable GitHub private vulnerability reporting'],
            ['Is it maintained?', 'Say so honestly; archive projects you no longer maintain'],
          ]}
        />
        <Note type="tip">
          You have now built the whole chain: Bash pipelines for quick answers, Python for parsing, networking and APIs, PowerShell for Windows telemetry, scheduling and alerting for automation, and the packaging and ethics that turn a script into a tool. The lab puts it all together in one simulated night shift.
        </Note>
      </div>
    ),
  },
]

export default function ScriptingPage() {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Breadcrumb */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem',
        fontFamily: mono, fontSize: '0.7rem', color: '#7a7a5a'
      }}>
        <Link href="/" style={{ color: '#7a7a5a', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>&#8250;</span>
        <span style={{ color: accent }}>MOD-15 // PYTHON &amp; BASH FOR SECURITY</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link href="/" style={{
            fontFamily: mono, fontSize: '0.65rem', color: '#7a7a5a',
            textDecoration: 'none', letterSpacing: '0.05em'
          }}>
            ALL MODULES &#8594;
          </Link>
        </div>
      </div>

      {/* Page header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{
          fontFamily: mono, fontSize: '9px', letterSpacing: '0.2em',
          color: '#7a7a5a', textTransform: 'uppercase', marginBottom: '0.5rem'
        }}>
          MODULE 15 &middot; SCRIPTING
        </div>
        <h1 style={{
          fontFamily: mono, fontSize: '2rem', fontWeight: 700, color: accent,
          margin: '0.5rem 0', lineHeight: 1.1, textShadow: '0 0 20px rgba(255,209,102,0.4)'
        }}>
          PYTHON &amp; BASH FOR SECURITY
        </h1>
        <p style={{ color: '#7a7a5a', fontFamily: mono, fontSize: '0.75rem', lineHeight: 1.6 }}>
          Automation mindset &middot; Bash &middot; grep / awk / jq &middot; Python &middot; Sockets &amp; APIs &middot; Parsing &amp; IOCs &middot; cron &amp; alerting &middot; PowerShell &middot; Shipping tools
        </p>
      </div>

      {/* Chapter overview stats */}
      <div className="module-stat-grid">
        {[
          ['9', 'CHAPTERS'],
          ['~3hr', 'TOTAL READ'],
          ['BEGINNER', 'DIFFICULTY'],
          ['MOD-15', 'IDENTIFIER'],
        ].map(([val, label], i) => (
          <div key={i} style={{ background: 'rgba(255,209,102,0.04)', border: '1px solid rgba(255,209,102,0.15)', borderRadius: '6px', padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontFamily: mono, fontSize: '1.2rem', fontWeight: 700, color: accent }}>{val}</div>
            <div style={{ fontFamily: mono, fontSize: '0.6rem', color: '#5a4a1a', letterSpacing: '0.15em', marginTop: '2px' }}>{label}</div>
          </div>
        ))}
      </div>

      <ModuleCodex moduleId="scripting" accent={accent} chapters={chapters} />

      {/* Bottom navigation */}
      <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid #2a2410' }}>
        <div style={{ background: 'rgba(255,209,102,0.04)', border: '1px solid rgba(255,209,102,0.2)', borderRadius: '8px', padding: '2rem', textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontFamily: mono, fontSize: '0.65rem', color: '#5a4a1a', letterSpacing: '0.25em', marginBottom: '0.5rem' }}>READY TO PRACTICE?</div>
          <div style={{ fontFamily: mono, fontSize: '1rem', color: accent, marginBottom: '0.5rem', fontWeight: 600 }}>MOD-15 Interactive Lab: Automate the Night Shift</div>
          <div style={{ fontFamily: mono, fontSize: '0.75rem', color: '#5a4a1a', marginBottom: '1.5rem' }}>18 steps &middot; 360 XP &middot; Real commands &middot; Flag captures</div>
          <Link href="/modules/scripting/lab" style={{ textDecoration: 'none', fontFamily: mono, fontSize: '0.85rem', color: accent, padding: '12px 32px', border: '1px solid rgba(255,209,102,0.6)', borderRadius: '6px', background: 'rgba(255,209,102,0.1)', fontWeight: 700, letterSpacing: '0.12em', boxShadow: '0 0 20px rgba(255,209,102,0.15)', display: 'inline-block' }}>
            LAUNCH LAB &#8594;
          </Link>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Link href="/" style={{ textDecoration: 'none', fontFamily: mono, fontSize: '0.75rem', color: '#5a4a1a' }}>ALL MODULES &#8594;</Link>
        </div>
      </div>
    </div>
  )
}
