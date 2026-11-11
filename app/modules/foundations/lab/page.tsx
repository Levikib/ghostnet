'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import LabTerminal, { LabStep } from '../../../components/LabTerminal'
import FreeLabTerminal from '../../../components/FreeLabTerminal'

const accent = '#7fdbff'
const moduleId = 'foundations'
const moduleName = 'Foundations'
const moduleNum = '00'

// Scenario: first day as a junior analyst at Savanna Logistics (fictional), Nairobi.
// The Linux server ghost-lab was flagged overnight. Orient, investigate, report.
const steps: LabStep[] = [
  // ── SECTION 1: Orientation ─────────────────────────────────────────────────
  {
    id: 'fnd-01',
    title: 'Who Am I?',
    objective: `Day one as a junior security analyst at Savanna Logistics in Nairobi. Your lead, Achieng, has given you SSH access to ghost-lab, a Linux server that raised alerts overnight.

The first reflex on any system: confirm which user account your shell is running as. Which command prints your current username?`,
    hint: 'The command is literally the question "who am I", written as one word.',
    answers: ['whoami', 'id -un', 'id -u -n'],
    xp: 10,
    explanation: `
ghost

whoami prints the effective username of your shell. Your identity decides everything you can read, write and run.
id gives more detail: uid=1000(ghost) gid=1000(ghost) groups=1000(ghost),4(adm). Note the adm group: it can read most logs, which you will need later.`,
  },
  {
    id: 'fnd-02',
    title: 'Where Am I?',
    objective: `Good, you are the user ghost. Before touching anything, find out where in the file system your shell has started.

Which command prints the full path of your current working directory?`,
    hint: 'Three letters: print working directory.',
    answers: ['pwd', 'echo $PWD'],
    xp: 10,
    explanation: `
/home/ghost

pwd prints the absolute path of your current directory. SSH logins start in your home directory, which the shell also calls ~.
Relative paths you type from now on are resolved from here.`,
  },
  {
    id: 'fnd-03',
    title: 'List Everything, Including Hidden Files',
    objective: `Achieng said she left material for you in your home directory. A plain ls skips hidden files (names starting with a dot), and those are often the interesting ones.

List the contents of your home directory in long format, including hidden files.`,
    hint: 'ls with two options combined: -l for long format and -a for all files.',
    answers: ['ls -la', 'ls -al', 'ls -l -a', 'ls -a -l'],
    xp: 15,
    explanation: `
total 36
drwxr-x--- 5 ghost ghost 4096 Nov 11 07:58 .
drwxr-xr-x 5 root  root  4096 Oct 30 12:00 ..
-rw------- 1 ghost ghost  611 Nov 11 07:40 .bash_history
-rw-r--r-- 1 ghost ghost 3771 Oct 30 12:00 .bashrc
drwx------ 2 ghost ghost 4096 Oct 30 12:05 .ssh
drwxr-xr-x 2 ghost ghost 4096 Nov 11 07:58 mission

Columns: permissions, links, owner, group, size, modified time, name. A leading d means directory.
Hidden entries (.bash_history, .ssh) would not appear without -a. The mission directory is your brief.`,
  },

  // ── SECTION 2: Files, Search and Permissions ───────────────────────────────
  {
    id: 'fnd-04',
    title: 'Change Directory',
    objective: `There is a directory called mission in your home directory. Move into it.`,
    hint: 'cd followed by the directory name. A relative path is fine because you are already in /home/ghost.',
    answers: ['cd mission', 'cd ~/mission', 'cd /home/ghost/mission', 'cd ./mission'],
    xp: 10,
    explanation: `
ghost@ghost-lab:~/mission$

cd changes your working directory; the prompt now shows ~/mission. "cd .." goes up one level, "cd" alone returns home, and "cd -" jumps back to the previous directory.
Use Tab to auto-complete names: it prevents typos and shows you what exists.`,
  },
  {
    id: 'fnd-05',
    title: 'Read the Briefing',
    objective: `Inside mission there is a text file called briefing.txt. Print its contents to the terminal.`,
    hint: 'The command that concatenates and prints files is three letters long.',
    answers: ['cat briefing.txt', 'cat ./briefing.txt', 'cat ~/mission/briefing.txt', 'less briefing.txt'],
    flag: 'GHOST{0r13nt4t10n_c0mpl3t3}',
    xp: 10,
    explanation: `
SAVANNA LOGISTICS - SECURITY BRIEFING (ghost-lab)
-------------------------------------------------
Overnight alerts: unusual outbound traffic and many SSH failures.
1. Check config.bak: a developer may have left credentials in it.
2. access.log is the web log from the portal. Count the 404s.
3. scan.sh is our audit script. It will not run yet.
4. Verify agent-v2.4.1.tar.gz before it is deployed. Vendor SHA-256:
   9e1eb7d4121751137087808fba3b5d1d35b409a80574706a9a2068aec298e3c7
Orientation token: GHOST{0r13nt4t10n_c0mpl3t3}

cat prints a whole file. For long files use less (q to quit, / to search), or head and tail for the first or last lines.
You now have a task list: work through it in order.`,
  },
  {
    id: 'fnd-06',
    title: 'Search for Credentials with grep',
    objective: `Task 1: config.bak is a long configuration backup. Developers name variables inconsistently (password, Password, DB_PASSWORD), so your search must ignore case.

Use grep to show every line in config.bak that contains the word "password", case-insensitively.`,
    hint: 'grep takes an option, a pattern and a file. The option for ignoring case is -i.',
    answers: ['grep -i password config.bak', 'grep -i "password" config.bak', "grep -i 'password' config.bak", 'grep -in password config.bak'],
    xp: 15,
    explanation: `
DB_PASSWORD=Mombasa#2026
smtp_password = "Wn7!kq2Lr"
# Password policy: rotate every 90 days

grep prints matching lines; -i ignores case. Add -n for line numbers, -r to search whole directories, -v to invert the match.
Credentials left in backups are a classic finding: report them, and remember attackers try found passwords against every service (password reuse).`,
  },
  {
    id: 'fnd-07',
    title: 'Chain Tools with a Pipe',
    objective: `Task 2: access.log contains thousands of web requests. You do not want to read them; you want a number.

Build a pipeline that finds the lines containing 404 in access.log and counts them.`,
    hint: 'grep finds the lines, then | sends them to wc -l, which counts lines.',
    answers: ['grep 404 access.log | wc -l', 'cat access.log | grep 404 | wc -l', 'grep " 404 " access.log | wc -l', 'grep -c 404 access.log'],
    xp: 20,
    explanation: `
412

The pipe | sends the output of one command into the input of the next. grep filters, wc -l counts.
412 "not found" responses in one night usually means automated directory brute-forcing. Next questions: from which IPs? Try
  grep " 404 " access.log | cut -d' ' -f1 | sort | uniq -c | sort -rn | head`,
  },
  {
    id: 'fnd-08',
    title: 'Make the Audit Script Executable',
    objective: `Task 3: running ./scan.sh fails with "Permission denied". ls -l shows:
  -rw-r--r-- 1 ghost ghost 1840 Nov 10 18:22 scan.sh

Nobody has execute permission. Give execute permission to the file's owner (you) without giving anyone write access.`,
    hint: 'chmod changes permissions. Symbolic form adds execute with +x (or u+x for owner only). Octal 755 or 700 also work.',
    answers: ['chmod +x scan.sh', 'chmod u+x scan.sh', 'chmod 755 scan.sh', 'chmod 700 scan.sh'],
    xp: 15,
    explanation: `
$ ls -l scan.sh
-rwxr--r-- 1 ghost ghost 1840 Nov 10 18:22 scan.sh

r = 4, w = 2, x = 1 for owner, group and others. u+x adds execute for the owner only; +x adds it for everyone; 755 = rwxr-xr-x.
Always read a script before running it. Executable scripts that root runs but you can edit are a classic privilege escalation path.`,
  },

  // ── SECTION 3: Privileges and Processes ────────────────────────────────────
  {
    id: 'fnd-09',
    title: 'What Can I Run with sudo?',
    objective: `Before investigating further, find out what extra powers your account has. sudo can grant specific commands as root without granting full root.

Which command lists the commands your user is allowed to run with sudo?`,
    hint: 'sudo with the option for "list".',
    answers: ['sudo -l', 'sudo --list', 'sudo -ll'],
    xp: 15,
    explanation: `
User ghost may run the following commands on ghost-lab:
    (root) NOPASSWD: /usr/bin/journalctl
    (root) NOPASSWD: /usr/bin/ss

sudo -l reads /etc/sudoers and shows your rules. Here you may read logs and list sockets as root, which is useful for this investigation.
Attackers run this first: journalctl opens a pager, and GTFOBins documents how a pager run as root can spawn a root shell. Even "harmless" sudo rules need review.`,
  },
  {
    id: 'fnd-10',
    title: 'List Every Running Process',
    objective: `The alert mentioned unusual outbound traffic, so something is running that should not be. List all processes on the system, for every user, with their owners and full command lines.`,
    hint: 'ps with the BSD-style options a, u and x (no dash needed). ps -ef is the System V equivalent.',
    answers: ['ps aux', 'ps -ef', 'ps auxf', 'ps -aux'],
    xp: 15,
    explanation: `
USER       PID %CPU %MEM COMMAND
root         1  0.0  0.3 /sbin/init
root       801  0.0  0.2 sshd: /usr/sbin/sshd -D
mysql      944  0.4  4.1 /usr/sbin/mysqld
www-data  1337  0.1  0.6 python3 -m http.server 8000 --directory /tmp/.cache
ghost     2314  0.0  0.1 -bash

PID 1337 stands out: the web-server account is serving files from a hidden directory in /tmp with Python's built-in HTTP server.
Attackers commonly stage tools in /tmp or /dev/shm and use quick servers like this to move files in and out. Note the PID for the next step.`,
  },
  {
    id: 'fnd-11',
    title: 'Which Ports Are Listening?',
    objective: `Confirm whether PID 1337 is reachable from the network. Show all listening TCP and UDP sockets, numerically, with the process that owns each one.`,
    hint: 'ss with -t (TCP), -u (UDP), -l (listening), -p (process), -n (numeric). Your sudo rule allows ss, which you need to see other users\' processes.',
    answers: ['ss -tulpn', 'ss -tulnp', 'ss -tlnp', 'netstat -tulpn'],
    xp: 15,
    explanation: `
Netid State  Local Address:Port   Process
udp   UNCONN 127.0.0.53%lo:53     users:(("systemd-resolve",pid=512))
tcp   LISTEN 0.0.0.0:22           users:(("sshd",pid=801))
tcp   LISTEN 127.0.0.1:3306       users:(("mysqld",pid=944))
tcp   LISTEN 0.0.0.0:8000         users:(("python3",pid=1337))

0.0.0.0 means every interface: port 8000 is exposed to the whole network. 127.0.0.1 (MySQL) is local only, which is correct.
Without sudo, ss hides the Process column for other users' sockets. netstat -tulpn is the older equivalent.`,
  },

  // ── SECTION 4: Networking and the Web ──────────────────────────────────────
  {
    id: 'fnd-12',
    title: 'Identify Your Network Interfaces',
    objective: `For your report you need this server's IP address and subnet. Show the network interfaces and their addresses using the modern iproute2 tool.`,
    hint: 'The ip command with the address object, which can be shortened to a single letter.',
    answers: ['ip a', 'ip addr', 'ip address', 'ip addr show'],
    xp: 10,
    explanation: `
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536
    inet 127.0.0.1/8 scope host lo
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500
    link/ether 08:00:27:4e:66:a1 brd ff:ff:ff:ff:ff:ff
    inet 10.10.0.15/24 brd 10.10.0.255 scope global eth0

The server is 10.10.0.15 on 10.10.0.0/24: 254 usable hosts, broadcast 10.10.0.255. link/ether is the MAC address.
ifconfig is deprecated on modern distributions; ip a, ip route and ip neigh replace it.`,
  },
  {
    id: 'fnd-13',
    title: 'Test Reachability with ping',
    objective: `Check that the default gateway, 10.10.0.1, is reachable. On Linux ping runs forever, so send exactly 4 echo requests and stop.`,
    hint: 'ping with -c and a count, followed by the IP address.',
    answers: ['ping -c 4 10.10.0.1', 'ping -c4 10.10.0.1', 'ping 10.10.0.1 -c 4'],
    xp: 15,
    explanation: `
64 bytes from 10.10.0.1: icmp_seq=1 ttl=64 time=0.41 ms
64 bytes from 10.10.0.1: icmp_seq=2 ttl=64 time=0.39 ms
64 bytes from 10.10.0.1: icmp_seq=3 ttl=64 time=0.40 ms
64 bytes from 10.10.0.1: icmp_seq=4 ttl=64 time=0.39 ms
4 packets transmitted, 4 received, 0% packet loss

ping uses ICMP echo request and reply. Replies prove the host is up; silence proves nothing, because firewalls often drop ICMP.
A TTL near 64 suggests Linux, near 128 Windows, near 255 network equipment.`,
  },
  {
    id: 'fnd-14',
    title: 'Resolve a Name with dig',
    objective: `The web log belongs to the internal portal, portal.savanna.lan. Find which IP address that name resolves to, using the standard DNS query tool.`,
    hint: 'dig followed by the hostname. A records (IPv4) are the default query type.',
    answers: ['dig portal.savanna.lan', 'dig portal.savanna.lan a', 'dig a portal.savanna.lan', 'nslookup portal.savanna.lan'],
    xp: 15,
    explanation: `
;; QUESTION SECTION:
;portal.savanna.lan.        IN  A
;; ANSWER SECTION:
portal.savanna.lan.  300    IN  A   10.10.0.80
;; SERVER: 10.10.0.53#53(10.10.0.53) (UDP)

The A record maps the name to 10.10.0.80 with a TTL of 300 seconds. The answer came from the internal resolver 10.10.0.53 over UDP port 53.
Add +short for just the address, or query MX, TXT and NS records to learn more about a domain.`,
  },
  {
    id: 'fnd-15',
    title: 'Fingerprint the Portal with curl',
    objective: `Request only the HTTP response headers from http://portal.savanna.lan. Headers often reveal the server software, framework versions and debugging leftovers.`,
    hint: 'curl with the capital -I option (a HEAD request), followed by the URL.',
    answers: ['curl -I http://portal.savanna.lan', 'curl -I portal.savanna.lan', 'curl --head http://portal.savanna.lan', 'curl -I http://10.10.0.80'],
    flag: 'GHOST{h34d3rs_t3ll_t4l3s}',
    xp: 15,
    explanation: `
HTTP/1.1 200 OK
Server: nginx/1.18.0 (Ubuntu)
X-Powered-By: PHP/7.4.3
Set-Cookie: PHPSESSID=9k2l1d0q7v; path=/
X-Debug-Token: GHOST{h34d3rs_t3ll_t4l3s}

Three findings: version disclosure in Server and X-Powered-By (PHP 7.4 has been end-of-life since 2022), a session cookie without HttpOnly, Secure or SameSite, and a debug header left in production.
Each one goes in your report. curl -v shows the full request and response, including TLS details on HTTPS.`,
  },

  // ── SECTION 5: Logs ────────────────────────────────────────────────────────
  {
    id: 'fnd-16',
    title: 'Hunt Failed Logins in auth.log',
    objective: `The alert also reported many SSH failures. On Debian/Ubuntu, authentication events are written to /var/log/auth.log, and your adm group membership lets you read it.

Search that log for the phrase "Failed password".`,
    hint: 'grep with the phrase in quotes (it contains a space), then the full path to the log.',
    answers: ['grep "Failed password" /var/log/auth.log', "grep 'Failed password' /var/log/auth.log", 'grep -i "failed password" /var/log/auth.log', 'journalctl -u ssh | grep "Failed password"'],
    flag: 'GHOST{brut3_f0rc3_d3t3ct3d}',
    xp: 20,
    explanation: `
Nov 11 02:51:12 ghost-lab sshd[4401]: Failed password for root from 203.0.113.50 port 50122 ssh2
Nov 11 02:51:15 ghost-lab sshd[4401]: Failed password for invalid user admin from 203.0.113.50 port 50130 ssh2
... 1,284 similar lines ...
Nov 11 03:02:47 ghost-lab sshd[4630]: Failed password for backup from 203.0.113.50 port 51877 ssh2
Nov 11 03:02:51 ghost-lab sshd[4632]: Accepted password for backup from 203.0.113.50 port 51881 ssh2
GHOST{brut3_f0rc3_d3t3ct3d}

A brute-force attack from 203.0.113.50 ended in a successful login as backup: an incident, not just noise. Next: grep "Accepted" to list every successful login.
Your sudo journalctl rule also works: journalctl -u ssh. Some distributions (Debian 12+) log only to the journal.`,
  },

  // ── SECTION 6: Hidden Data and Integrity ───────────────────────────────────
  {
    id: 'fnd-17',
    title: 'Find Hidden Files with find',
    objective: `The backup account's home is /opt/backup. Attackers like hidden files because ls does not show them by default.

Use find to search /opt for files whose names start with a dot.`,
    hint: 'find, a starting directory, then -name with a quoted pattern: ".*". Quote it so the shell does not expand it.',
    answers: ['find /opt -name ".*"', "find /opt -name '.*'", 'find /opt -type f -name ".*"', "find /opt -type f -name '.*'"],
    xp: 15,
    explanation: `
/opt/backup/.profile
/opt/backup/.vault_note

find walks a directory tree and tests each entry: -name matches names, -type f limits to files, -user, -perm and -mmin filter further.
.profile is a normal shell startup file. .vault_note is not standard, and ls -l shows it was modified at 03:04, two minutes after the attacker logged in.`,
  },
  {
    id: 'fnd-18',
    title: 'Read the Hidden Note',
    objective: `Print the contents of /opt/backup/.vault_note.`,
    hint: 'Same command you used for the briefing, with the full path.',
    answers: ['cat /opt/backup/.vault_note', 'less /opt/backup/.vault_note', 'head /opt/backup/.vault_note'],
    xp: 15,
    explanation: `
QmFja3VwIHJvdGF0aW9uIGNvbXBsZXRlLiBSZWNvdmVyeSB0b2tlbjogR0hPU1R7YjRzMzY0XzFzXzNuYzBkMW5nX24wdF8zbmNyeXB0MTBufQo=

Only A-Z, a-z, 0-9, + and / characters, ending in = padding: the signature of Base64 encoding.
Base64 turns arbitrary bytes into safe text for emails, URLs and configs. It has no key, so it hides nothing from anyone who recognises it.`,
  },
  {
    id: 'fnd-19',
    title: 'Decode Base64',
    objective: `Decode the contents of /opt/backup/.vault_note from Base64 back to readable text.`,
    hint: 'The base64 tool encodes by default. Add -d (or --decode) and give it the file path, or pipe cat into it.',
    answers: ['base64 -d /opt/backup/.vault_note', 'base64 --decode /opt/backup/.vault_note', 'cat /opt/backup/.vault_note | base64 -d', 'cat /opt/backup/.vault_note | base64 --decode'],
    flag: 'GHOST{b4s364_1s_3nc0d1ng_n0t_3ncrypt10n}',
    xp: 20,
    explanation: `
Backup rotation complete. Recovery token: GHOST{b4s364_1s_3nc0d1ng_n0t_3ncrypt10n}

Encoding changes representation (anyone can reverse it). Encryption needs a key. Hashing is one-way.
Confusing the three is one of the most common mistakes in real systems: "encrypted" passwords that turn out to be Base64 appear in assessments all the time.`,
  },
  {
    id: 'fnd-20',
    title: 'Verify Integrity with sha256sum',
    objective: `Final task: the briefing gave the vendor's SHA-256 for agent-v2.4.1.tar.gz:
  9e1eb7d4121751137087808fba3b5d1d35b409a80574706a9a2068aec298e3c7

Given the intrusion, verify the package in ~/mission before anyone deploys it. Compute its SHA-256 hash.`,
    hint: 'sha256sum followed by the file name. You are still in ~/mission.',
    answers: ['sha256sum agent-v2.4.1.tar.gz', 'sha256sum ~/mission/agent-v2.4.1.tar.gz', 'sha256sum /home/ghost/mission/agent-v2.4.1.tar.gz', 'sha256sum ./agent-v2.4.1.tar.gz'],
    flag: 'GHOST{1nt3gr1ty_v10l4t3d}',
    xp: 25,
    explanation: `
47dd12d38906a125192706d59e607d5605ce0a3038d33bf30d8e7cd9066f1469  agent-v2.4.1.tar.gz
expected: 9e1eb7d4121751137087808fba3b5d1d35b409a80574706a9a2068aec298e3c7
GHOST{1nt3gr1ty_v10l4t3d}

The hashes do not match: the package was modified after the vendor published it. Do not deploy it; preserve it as evidence.
A hash is a fingerprint: change one bit and the output changes completely. Your report: brute-forced backup account, rogue HTTP server, leaked credentials, tampered package.`,
  },
]

const xpTotal = steps.reduce((sum, s) => sum + s.xp, 0)

export default function FoundationsLab() {
  const [guidedDone, setGuidedDone] = useState(false)
  const [freeLaunched, setFreeLaunched] = useState(false)
  const [earnedXp, setEarnedXp] = useState(0)
  const [showKeywords, setShowKeywords] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('lab_foundations-lab')
    if (saved) {
      const d = JSON.parse(saved)
      if (d.done) { setGuidedDone(true); setEarnedXp(d.xp || 0) }
    }
  }, [])

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#4a7080' }}>
        <Link href="/" style={{ color: '#4a7080', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>&#8250;</span>
        <Link href="/modules/foundations" style={{ color: '#4a7080', textDecoration: 'none' }}>FOUNDATIONS</Link>
        <span>&#8250;</span>
        <span style={{ color: accent }}>LAB</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px', alignItems: 'center' }}>
          <Link href="/modules/foundations" style={{ textDecoration: 'none', padding: '3px 10px', border: '1px solid #12303a', borderRadius: '3px', color: '#4a7080', fontSize: '7.5px', letterSpacing: '0.1em' }}>&#8592; CONCEPT</Link>
          <span style={{ padding: '3px 10px', background: 'rgba(127,219,255,0.1)', border: '1px solid rgba(127,219,255,0.4)', borderRadius: '3px', color: accent, fontSize: '7.5px', letterSpacing: '0.1em', fontWeight: 700 }}>LAB ACTIVE</span>
        </div>
      </div>

      {/* Progress banner */}
      <div style={{ background: 'rgba(127,219,255,0.04)', border: '1px solid rgba(127,219,255,0.15)', borderRadius: '6px', padding: '10px 16px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' as const }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {[{ label: 'PHASE 1', done: true, active: !guidedDone }, { label: 'PHASE 2', done: guidedDone, active: guidedDone }].map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.done ? accent : '#12303a', border: p.active ? '2px solid ' + accent : '1px solid #12303a', boxShadow: p.active ? '0 0 6px ' + accent : 'none' }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: p.done ? accent : '#2a5566', letterSpacing: '0.1em' }}>{p.label}</span>
              {i === 0 && <span style={{ fontSize: '7px', color: '#12303a', margin: '0 2px' }}>—</span>}
            </div>
          ))}
        </div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#4a7080' }}>
          MOD-{moduleNum} &nbsp;·&nbsp; {moduleName.toUpperCase()} &nbsp;·&nbsp; {xpTotal} XP &nbsp;·&nbsp; {steps.length} STEPS
        </div>
        {guidedDone && (
          <div style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: accent, fontWeight: 700 }}>
            &#10003; GUIDED PHASE COMPLETE{earnedXp > 0 ? ' (+' + earnedXp + ' XP)' : ''} — LAUNCH FREE LAB BELOW
          </div>
        )}
      </div>

      {/* Section index */}
      <div style={{ background: 'rgba(127,219,255,0.02)', border: '1px solid rgba(127,219,255,0.08)', borderRadius: '6px', padding: '12px 16px', marginBottom: '1.5rem', fontFamily: 'JetBrains Mono, monospace' }}>
        <div style={{ fontSize: '7px', color: '#1f4a5a', letterSpacing: '0.25em', marginBottom: '10px' }}>LAB SECTIONS</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '6px' }}>
          {[
            { section: '01–03', title: 'Orientation: identity, location, listing', steps: '3 steps' },
            { section: '04–08', title: 'Files, grep, pipes and permissions', steps: '5 steps' },
            { section: '09–11', title: 'Privileges, processes and listening ports', steps: '3 steps' },
            { section: '12–15', title: 'Interfaces, ping, DNS and HTTP headers', steps: '4 steps' },
            { section: '16',    title: 'Authentication logs', steps: '1 step' },
            { section: '17–20', title: 'Hidden files, Base64 and integrity', steps: '4 steps' },
          ].map(s => (
            <div key={s.section} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '7px', color: accent + '66', flexShrink: 0, minWidth: '30px' }}>{s.section}</span>
              <div>
                <div style={{ fontSize: '7.5px', color: '#4a8a9a' }}>{s.title}</div>
                <div style={{ fontSize: '6.5px', color: '#2a5566', marginTop: '1px' }}>{s.steps}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── PHASE 1: Guided Learning ── */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(127,219,255,0.1)', border: '1px solid rgba(127,219,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: accent, fontWeight: 700 }}>1</span>
          </div>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#2a5566', letterSpacing: '0.2em', marginBottom: '2px' }}>PHASE 1 — GUIDED LEARNING</div>
            <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.4rem', fontWeight: 700, color: accent, margin: 0 }}>First Day on the Box</h1>
          </div>
        </div>

        <p style={{ color: '#6a8a96', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: 1.7, fontFamily: 'JetBrains Mono, monospace' }}>
          {steps.length} steps on a freshly assigned Linux server that raised alerts overnight. Orient yourself, read the briefing,
          search files, fix permissions, check your privileges, inspect processes and ports, query the network, read the
          authentication log, uncover a hidden note and verify a suspicious package. Each explanation shows realistic output: read it.
        </p>

        <div style={{ background: 'rgba(127,219,255,0.03)', border: '1px solid rgba(127,219,255,0.12)', borderRadius: '6px', padding: '1rem 1.25rem', marginBottom: '1.25rem', fontFamily: 'JetBrains Mono, monospace' }}>
          <div style={{ fontSize: '7px', color: '#1f4a5a', letterSpacing: '0.25em', marginBottom: '8px' }}>SKILLS DEVELOPED</div>
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '6px' }}>
            {[
              'Situational awareness (whoami, pwd)',
              'Reading long listings and hidden files',
              'Navigating the file system',
              'grep searching',
              'Pipes and counting',
              'chmod and the rwx model',
              'sudo -l privilege review',
              'Process inspection',
              'Listening socket analysis',
              'Interfaces and subnets',
              'ICMP reachability',
              'DNS queries with dig',
              'HTTP header fingerprinting',
              'Auth log triage',
              'find for hidden files',
              'Base64 decoding',
              'SHA-256 integrity checks',
              'Writing up findings',
            ].map(c => (
              <span key={c} style={{ fontSize: '7.5px', color: '#3a7a8a', background: 'rgba(127,219,255,0.06)', border: '1px solid rgba(127,219,255,0.12)', padding: '2px 8px', borderRadius: '3px' }}>{c}</span>
            ))}
          </div>
        </div>

        <LabTerminal
          labId="foundations-lab"
          moduleId={moduleId}
          title="Foundations: First Day on the Box"
          accent={accent}
          steps={steps}
          onComplete={(xp) => { setGuidedDone(true); setEarnedXp(xp) }}
          onRestart={() => { setGuidedDone(false); setFreeLaunched(false); setEarnedXp(0) }}
        />
      </div>

      {/* ── PHASE 2: Free Lab ── */}
      <div id="free-lab" style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: guidedDone ? 'rgba(127,219,255,0.15)' : 'rgba(0,0,0,0.3)', border: '1px solid ' + (guidedDone ? 'rgba(127,219,255,0.4)' : '#12303a'), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: guidedDone ? accent : '#2a5566', fontWeight: 700 }}>2</span>
          </div>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: guidedDone ? '#4a8a9a' : '#2a5566', letterSpacing: '0.2em', marginBottom: '2px' }}>PHASE 2 — FREE LAB ENVIRONMENT</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.1rem', fontWeight: 700, color: guidedDone ? accent : '#2a5566' }}>Linux Practice Sandbox</div>
          </div>
          {guidedDone && !freeLaunched && (
            <div style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#ffb347', background: 'rgba(255,179,71,0.08)', border: '1px solid rgba(255,179,71,0.2)', padding: '3px 10px', borderRadius: '3px' }}>
              GUIDED PHASE COMPLETE
            </div>
          )}
        </div>

        {!freeLaunched ? (
          <div style={{ background: guidedDone ? 'rgba(127,219,255,0.04)' : '#02070a', border: '1px solid ' + (guidedDone ? 'rgba(127,219,255,0.25)' : '#0a1a20'), borderRadius: '10px', padding: '2.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            {guidedDone && (
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, ' + accent + ', transparent)' }} />
            )}
            <div style={{ fontSize: '7px', color: guidedDone ? '#3a7a8a' : '#12303a', letterSpacing: '0.3em', marginBottom: '1rem' }}>
              {guidedDone ? 'READY FOR FREE PRACTICE' : 'COMPLETE GUIDED PHASE TO UNLOCK'}
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.2rem', color: guidedDone ? accent : '#2a5566', fontWeight: 700, marginBottom: '0.5rem' }}>
              LAUNCH FULL LAB ENVIRONMENT
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', color: '#4a7080', marginBottom: '0.75rem', lineHeight: 1.7 }}>
              Free-form terminal sandbox — no guided prompts, no restrictions
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' as const, marginBottom: '2rem' }}>
              {[
                'Navigation and listing',
                'Reading and searching files',
                'Identity and privileges',
                'Process and port checks',
                'Network diagnostics',
                'Ask GHOST about any command',
              ].map(feat => (
                <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: guidedDone ? accent : '#12303a' }} />
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: guidedDone ? '#4a8a9a' : '#12303a' }}>{feat}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => guidedDone && setFreeLaunched(true)}
              disabled={!guidedDone}
              style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.15em',
                padding: '14px 40px', border: '1px solid ' + (guidedDone ? 'rgba(127,219,255,0.6)' : '#12303a'),
                borderRadius: '6px', background: guidedDone ? 'rgba(127,219,255,0.12)' : 'transparent',
                color: guidedDone ? accent : '#12303a', cursor: guidedDone ? 'pointer' : 'not-allowed',
                boxShadow: guidedDone ? '0 0 24px rgba(127,219,255,0.18)' : 'none', transition: 'all 0.2s',
              }}
            >
              {guidedDone ? '▸ LAUNCH FREE LAB ENVIRONMENT' : 'COMPLETE THE GUIDED PHASE FIRST'}
            </button>
            {!guidedDone && (
              <div style={{ marginTop: '1rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: '#12303a' }}>
                Complete all {steps.length} guided steps above to unlock the free lab environment
              </div>
            )}
          </div>
        ) : (
          <div style={{ border: '1px solid ' + accent + '30', borderRadius: '10px', overflow: 'hidden', background: '#02080a' }}>
            <FreeLabTerminal moduleId={moduleId} moduleName={moduleName} accent={accent} onClose={() => setFreeLaunched(false)} />
            <div style={{ padding: '8px 16px', background: '#030a0d', borderTop: '1px solid ' + accent + '15', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: accent, boxShadow: '0 0 5px ' + accent }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#3a7a8a' }}>
                Free practice mode. Ask <span style={{ color: accent }}>GHOST AGENT</span> (bottom-right) to explain any command, flag or output you meet.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Quick reference */}
      <div style={{ marginBottom: '2rem' }}>
        <button
          onClick={() => setShowKeywords(!showKeywords)}
          style={{ background: 'transparent', border: '1px solid #12303a', borderRadius: '5px', padding: '8px 16px', cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#3a6a7a', letterSpacing: '0.1em', marginBottom: showKeywords ? '12px' : 0, transition: 'all 0.15s' }}
        >
          {showKeywords ? '▼' : '▶'} QUICK REFERENCE — FIRST-DAY COMMANDS
        </button>
        {showKeywords && (
          <div style={{ background: '#030a0d', border: '1px solid #0d1f26', borderRadius: '6px', padding: '1.25rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '8px' }}>
              {[
                ['whoami / id', 'Current user, UID and groups'],
                ['pwd', 'Print working directory'],
                ['ls -la', 'Long listing including hidden files'],
                ['cd <dir> / cd .. / cd -', 'Change, go up, go back'],
                ['cat / less / head / tail -f', 'Read, page, first lines, follow'],
                ['grep -rin <pattern> <path>', 'Recursive, case-insensitive search with line numbers'],
                ['cmd1 | cmd2', 'Pipe output into the next command'],
                ['> file / >> file / 2>/dev/null', 'Overwrite, append, discard errors'],
                ['chmod u+x f / chmod 600 f', 'Add execute / private file'],
                ['sudo -l', 'List your sudo rights'],
                ['ps aux', 'All processes with owners'],
                ['ss -tulpn', 'Listening ports and owning processes'],
                ['ip a / ip route / ip neigh', 'Addresses, routes, ARP cache'],
                ['ping -c 4 <host>', 'Four ICMP echo requests'],
                ['dig <name> +short', 'DNS lookup'],
                ['curl -I <url>', 'HTTP response headers only'],
                ['grep "Failed password" /var/log/auth.log', 'SSH brute-force evidence'],
                ['find / -name ".*" -type f 2>/dev/null', 'Hidden files'],
                ['find / -perm -4000 -type f 2>/dev/null', 'SUID binaries'],
                ['base64 -d <file>', 'Decode Base64'],
                ['sha256sum <file>', 'Integrity fingerprint'],
              ].map(([cmd, desc]) => (
                <div key={cmd} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '6px 8px', background: '#02070a', borderRadius: '4px' }}>
                  <code style={{ color: accent, fontSize: '0.7rem', flexShrink: 0 }}>{cmd}</code>
                  <span style={{ color: '#4a7080', fontSize: '0.68rem' }}>{desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer nav */}
      <div style={{ paddingTop: '2rem', borderTop: '1px solid #0d1f26', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' as const, gap: '10px' }}>
        <Link href="/modules/foundations" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#3a6a7a' }}>&#8592; BACK TO CONCEPT</Link>
        <Link href="/modules/tor/lab" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#3a6a7a' }}>MOD-01 TOR LAB &#8594;</Link>
      </div>
    </div>
  )
}
