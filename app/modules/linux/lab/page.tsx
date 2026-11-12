'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import LabTerminal, { LabStep } from '../../../components/LabTerminal'
import FreeLabTerminal from '../../../components/FreeLabTerminal'

const accent = '#73c991'
const moduleId = 'linux'
const moduleName = 'Linux Mastery'
const moduleNum = '14'

// Authoring rule (GHOSTNET CLAUDE.md): these are template literals, so they never contain
// a dollar sign followed by an opening brace, and never contain backslashes or backticks.
// Shell variables are written $VAR or "$VAR"; command substitution is $(...).

const steps: LabStep[] = [
  // ── SECTION 1: First Steps & Orientation ──────────────────────────────────
  {
    id: 'linux-01',
    title: 'Who Am I?',
    objective: `You have just logged into a freshly installed Linux box for the first time. The prompt reads  analyst@ghost-lab:~$  — but before you touch anything, confirm which account you are actually operating as. Getting this wrong (acting as root by accident) is how beginners wreck machines.

What single command prints the username you are currently logged in as?`,
    hint: 'Three words squashed into one: "who am i" — but as a single command.',
    answers: ['whoami', 'id -un', 'echo $USER'],
    xp: 12,
    explanation: `$ whoami
analyst

whoami prints the effective username — here, the normal user "analyst", not root. The $ at the end of your prompt confirms it; a # would mean you are root.

Why it matters: your identity decides what you are allowed to do. Every file operation, every service action is permitted or denied based on who you are. Checking before you act is a professional reflex, especially right after an "su" or inside someone else's session.`,
  },
  {
    id: 'linux-02',
    title: 'Where Am I?',
    objective: `You know who you are; now find out where you are standing in the filesystem. The ~ in the prompt is a shortcut, but you want the full, unambiguous path.

What command Prints the Working Directory — your current location in the directory tree?`,
    hint: 'Three letters. It literally stands for "print working directory".',
    answers: ['pwd', '/bin/pwd'],
    xp: 12,
    explanation: `$ pwd
/home/analyst

pwd resolves the ~ shortcut to an absolute path: /home/analyst, your home directory. An absolute path starts at the root / and means the same thing from anywhere on the system.

Why it matters: relative commands (like  cat notes.txt ) act on wherever you currently are. Knowing your working directory prevents the classic mistake of deleting or editing the right-named file in the wrong place.`,
  },
  {
    id: 'linux-03',
    title: 'List Everything, Including Hidden',
    objective: `Look at what is in your home directory. A plain listing hides the dotfiles — files whose names start with a dot — and those are exactly where configuration (and sometimes secrets) live.

Write the command that lists directory contents in long format AND includes hidden files.`,
    hint: 'The command is ls. You want the -l (long) and -a (all) options — they combine.',
    answers: ['ls -la', 'ls -al', 'ls -l -a', 'ls -a -l'],
    xp: 14,
    explanation: `$ ls -la
total 32
drwxr-xr-x 4 analyst analyst 4096 Nov 12 09:02 .
drwxr-xr-x 3 root    root    4096 Nov 12 08:55 ..
-rw-r--r-- 1 analyst analyst  220 Nov 12 08:55 .bash_logout
-rw-r--r-- 1 analyst analyst 3771 Nov 12 08:55 .bashrc
drwxr-xr-x 2 analyst analyst 4096 Nov 12 09:01 projects

-l gives the long view: permissions, owner, group, size, date. -a reveals the dotfiles (.bashrc, and the . and .. entries for "here" and "up one").

Why it matters: an attacker's persistence and a user's real configuration both live in dotfiles. "ls -la" is the single most-used listing in all of Linux — make it muscle memory.`,
  },
  {
    id: 'linux-04',
    title: 'Change Directory',
    objective: `You spotted a "projects" directory in the listing. Move into it so your subsequent commands run from inside it.

What command changes your current directory into the "projects" folder?`,
    hint: 'Two letters — "change directory" — followed by the folder name.',
    answers: ['cd projects', 'cd ./projects', 'cd projects/', 'cd /home/analyst/projects'],
    xp: 14,
    explanation: `$ cd projects
$ pwd
/home/analyst/projects

cd moves you through the directory tree. "projects" is a relative path (no leading slash), so it means "projects, starting from here". Useful shortcuts: cd with no argument jumps home, cd .. goes up one level, and cd - bounces back to the previous directory.

Why it matters: navigating confidently is the foundation of everything else. On a real engagement you move through dozens of directories a minute; fumbling cd slows everything down.`,
  },
  {
    id: 'linux-05',
    title: 'Identify the Operating System',
    objective: `You have landed on an unfamiliar box and need to know exactly what distribution and version it is — the answer shapes which package manager and which tools you will use.

What command reads the standard file that describes the Linux distribution and release?`,
    hint: 'cat the file /etc/os-release — it is the standard, machine-readable identity file.',
    answers: ['cat /etc/os-release', 'cat /etc/os-release.txt', 'less /etc/os-release'],
    flag: 'GHOST{you_know_your_distro}',
    xp: 14,
    explanation: `$ cat /etc/os-release
PRETTY_NAME="Ubuntu 24.04 LTS"
NAME="Ubuntu"
VERSION_ID="24.04"
ID=ubuntu
ID_LIKE=debian

This box is Ubuntu 24.04 LTS — ID_LIKE=debian tells you it uses apt and the Debian layout, so everything in this module applies directly.

Why it matters: the first job on any new system is fingerprinting it. Distro and version determine the package manager (apt vs dnf vs pacman), default paths, and which vulnerabilities and exploits are relevant. Other clues: uname -a (kernel), lsb_release -a, hostnamectl.`,
  },

  // ── SECTION 2: Files & Finding ────────────────────────────────────────────
  {
    id: 'linux-06',
    title: 'Create and Edit a File',
    objective: `You want to keep notes during this session. Create and open a text file called notes.txt in a friendly terminal editor so you can type into it right away.

What command opens (creating it if needed) notes.txt in the beginner-friendly nano editor?`,
    hint: 'The editor is nano. Just name it, then the file.',
    answers: ['nano notes.txt', 'nano ./notes.txt', 'vim notes.txt', 'vi notes.txt'],
    xp: 14,
    explanation: `$ nano notes.txt
# nano opens a full-screen editor. Type your notes, then:
#   Ctrl+O  write Out (save) -> press Enter to confirm
#   Ctrl+X  eXit

nano prints its key commands along the bottom, which is why it is the right first editor. If a system drops you into vim instead and you are stuck, press  Esc  then type  :q!  and Enter to leave without saving.

Why it matters: editing config files in /etc and writing scripts are daily tasks. You can also create an empty file with  touch notes.txt  or write one line with  echo "text" > notes.txt .`,
  },
  {
    id: 'linux-07',
    title: 'Copy, Move, Remove',
    objective: `Before you experiment on notes.txt, make a safety copy called notes.bak so you can restore it if you mangle the original.

What command copies notes.txt to a new file named notes.bak?`,
    hint: 'Two letters for "copy": cp SOURCE DESTINATION.',
    answers: ['cp notes.txt notes.bak', 'cp ./notes.txt ./notes.bak', 'cp -i notes.txt notes.bak'],
    xp: 14,
    explanation: `$ cp notes.txt notes.bak
$ ls
notes.bak  notes.txt

cp copies a file. Its siblings complete the set:  mv notes.txt archive/  moves (or renames) a file, and  rm notes.bak  deletes one. Add -r to cp and rm to work on whole directories, and -i to be prompted before overwriting or deleting.

Why it matters: rm has NO undo on the command line — a removed file is gone. Making a .bak copy before editing, and using rm -i when unsure, are habits that save real work. rm -rf with the wrong path has ended many careers.`,
  },
  {
    id: 'linux-08',
    title: 'Find a File',
    objective: `Somewhere under your home directory is a file named flag.txt that a previous operator left behind. You do not know which subfolder it is in.

Write a find command that searches the current directory (and everything below it) for a file named exactly flag.txt.`,
    hint: 'find WHERE CRITERIA — here, find . -name "flag.txt"',
    answers: ['find . -name flag.txt', 'find . -name "flag.txt"', "find . -name 'flag.txt'", 'find ./ -name flag.txt'],
    flag: 'GHOST{find_walks_the_whole_tree}',
    xp: 16,
    explanation: `$ find . -name "flag.txt"
./projects/archive/flag.txt

find walks the live filesystem right now, so its results are always current. The . means "start here", -name matches the filename (use -iname to ignore case). find can also match by -type, -size, -mtime, and -perm, and can run a command on each hit with -exec.

Why it matters: on a new box you are constantly locating config files, SSH keys, writable directories, and interesting data. find is the precise tool; locate is a faster index-based alternative when freshness does not matter.`,
  },

  // ── SECTION 3: Permissions & Privilege ────────────────────────────────────
  {
    id: 'linux-09',
    title: 'Make a Script Executable',
    objective: `The projects folder contains deploy.sh, a shell script. You try to run it with  ./deploy.sh  and get "Permission denied" — it is not marked executable yet.

What command adds the execute permission to deploy.sh so you can run it?`,
    hint: 'chmod changes permissions. +x adds the execute bit.',
    answers: ['chmod +x deploy.sh', 'chmod u+x deploy.sh', 'chmod 755 deploy.sh', 'chmod a+x deploy.sh'],
    xp: 16,
    explanation: `$ chmod +x deploy.sh
$ ls -l deploy.sh
-rwxr-xr-x 1 analyst analyst 184 Nov 12 09:10 deploy.sh
$ ./deploy.sh
[deploy] starting...

chmod +x sets the execute bit (note the new "x" in the listing). You then run the script with  ./deploy.sh  — the ./ is required because the current directory is not on your PATH, a deliberate safety feature so a stray "ls" in your folder cannot hijack the real command.

Why it matters: the execute bit is what separates data from program. Octal 755 (rwxr-xr-x) is the normal mode for a script others may run; 700 keeps it private to you.`,
  },
  {
    id: 'linux-10',
    title: 'Spot a SUID Binary',
    objective: `You are hunting for privilege-escalation paths. The program /usr/bin/passwd must edit a root-owned file even when a normal user runs it — which means it carries a special permission bit.

What command shows the detailed long-format permissions of /usr/bin/passwd so you can see that bit?`,
    hint: 'ls -l on the full path:  ls -l /usr/bin/passwd',
    answers: ['ls -l /usr/bin/passwd', 'ls -la /usr/bin/passwd', 'ls -l /usr/bin/passwd/', 'stat /usr/bin/passwd'],
    flag: 'GHOST{the_s_bit_runs_as_owner}',
    xp: 18,
    explanation: `$ ls -l /usr/bin/passwd
-rwsr-xr-x 1 root root 68208 ... /usr/bin/passwd
   ^
   's' sits where the owner's execute 'x' would be = the SUID bit is set.

SUID (Set User ID) means the program runs with the permissions of its OWNER (root here), not of the user who launched it. That is why any user can change their own password: passwd briefly runs as root to write /etc/shadow.

Why it matters: SUID-root binaries are a top target in privilege escalation. A misconfigured or abusable one can hand an attacker root. The classic enumeration sweep is:  find / -perm -4000 -type f 2>/dev/null  — learn to recognise that "s".`,
  },
  {
    id: 'linux-11',
    title: 'What Can I Run as Root?',
    objective: `You are the user "analyst" and you want to know exactly which commands you are permitted to run with elevated privileges via sudo — without guessing or triggering failures.

What command lists your own sudo privileges?`,
    hint: 'sudo with the -l (list) option.',
    answers: ['sudo -l', 'sudo --list', 'sudo -ll'],
    xp: 16,
    explanation: `$ sudo -l
Matching Defaults entries for analyst on ghost-lab: ...
User analyst may run the following commands on ghost-lab:
    (ALL : ALL) ALL

Here analyst has full sudo — (ALL : ALL) ALL means any command, as any user. A narrower box might show only  (root) /usr/bin/systemctl restart nginx , telling you precisely what is permitted.

Why it matters: sudo -l is the first thing to check both when administering a box (what am I allowed to do?) and when attacking one (what can this account escalate with?). An over-broad sudo rule on an editor or interpreter is often a direct path to root.`,
  },
  {
    id: 'linux-12',
    title: 'Full Identity Context',
    objective: `whoami gave you a username, but you want the complete picture: your numeric user ID, your primary group, and every group you belong to — group membership is how privileges like sudo and docker are granted.

What single command prints your UID, GID and all group memberships at once?`,
    hint: 'Two letters: id (with no arguments shows your own).',
    answers: ['id', 'id analyst', 'id -a'],
    xp: 14,
    explanation: `$ id
uid=1000(analyst) gid=1000(analyst) groups=1000(analyst),27(sudo),999(docker)

id shows everything: UID 1000 (a real human; root is 0), the primary group, and the supplementary groups. Membership in "sudo" is what grants admin rights here; membership in "docker" is effectively root-equivalent because of what Docker can do.

Why it matters: privileges in Linux flow through group membership. Reading id on a compromised account instantly tells you what it can reach. A surprise group (sudo, docker, adm, lxd) is often the escalation route.`,
  },

  // ── SECTION 4: Processes, Services & Packages ─────────────────────────────
  {
    id: 'linux-13',
    title: 'Find a Running Process',
    objective: `You need to confirm the SSH daemon is actually running and see its process details. Rather than scroll through every process, filter the full list for lines mentioning ssh.

Write the command that lists all processes and pipes the output into grep to show only lines containing "ssh".`,
    hint: 'ps aux gives every process; pipe it into grep:  ps aux | grep ssh',
    answers: ['ps aux | grep ssh', 'ps -ef | grep ssh', 'ps aux | grep sshd', 'ps aux|grep ssh'],
    xp: 16,
    explanation: `$ ps aux | grep ssh
root       812  0.0  0.1  12176  6900 ?  Ss  09:00  0:00 sshd: /usr/sbin/sshd -D
analyst   1544  0.0  0.0   6momentarily  ... grep --color=auto ssh

ps aux snapshots every process (a=all users, u=readable columns, x=incl. non-terminal daemons). The pipe | feeds that into grep, which keeps only matching lines. The second line is your own grep catching itself — a normal artefact.

Why it matters: this pipeline is the everyday way to confirm a service is up, find a rogue process, or get a PID to act on. Columns to read: USER (owner), PID (the number you kill or inspect), and COMMAND.`,
  },
  {
    id: 'linux-14',
    title: 'Check a Service with systemd',
    objective: `Processes come and go, but services are managed by systemd. You want the authoritative status of the ssh service: is it active, is it enabled at boot, what is its PID, and what did it last log?

What systemctl command shows the full status of the ssh service?`,
    hint: 'systemctl status SERVICE — the service unit is "ssh".',
    answers: ['systemctl status ssh', 'systemctl status sshd', 'systemctl status ssh.service', 'sudo systemctl status ssh'],
    xp: 14,
    explanation: `$ systemctl status ssh
  ssh.service - OpenBSD Secure Shell server
     Loaded: loaded (/lib/systemd/system/ssh.service; enabled; preset: enabled)
     Active: active (running) since Thu 09:00:01; 12min ago
   Main PID: 812 (sshd)

The two words to read are "enabled" (it starts at every boot) and "active (running)" (it is up now). start/enable are separate: start = run now, enable = run at boot. You usually want both, via  systemctl enable --now ssh .

Why it matters: systemctl is how you control every background service. On an unfamiliar box,  systemctl list-unit-files --state=enabled  reveals what starts automatically — a frequent hiding place for attacker persistence.`,
  },
  {
    id: 'linux-15',
    title: 'Read a Service Log',
    objective: `systemctl status showed only the last few lines for ssh. You need the full, filtered log for that service to investigate failed login attempts.

What journalctl command shows the log entries specifically for the ssh service unit?`,
    hint: 'journalctl with -u (unit) and the service name:  journalctl -u ssh',
    answers: ['journalctl -u ssh', 'journalctl -u sshd', 'journalctl -u ssh.service', 'sudo journalctl -u ssh'],
    xp: 14,
    explanation: `$ journalctl -u ssh
Nov 12 09:00:01 ghost-lab sshd[812]: Server listening on 0.0.0.0 port 22.
Nov 12 09:14:33 ghost-lab sshd[1544]: Failed password for invalid user admin from 203.0.113.9
Nov 12 09:14:40 ghost-lab sshd[1544]: Accepted publickey for analyst from 10.0.2.2

journalctl reads systemd's unified journal. -u filters to one unit. Add -n 50 for the last 50 lines, -f to follow live (like tail -f), -b for this boot, or -p err for errors only.

Why it matters: logs are where you find out what actually happened. Those "Failed password" lines are a brute-force attempt in progress — exactly the signal fail2ban watches for. The classic text logs live under /var/log (auth.log, syslog) too.`,
  },
  {
    id: 'linux-16',
    title: 'Install a Package',
    objective: `You need the network scanner nmap for later work, and it is not installed. You are on Ubuntu, so you use apt — and because you want admin rights for the install, you prefix it with sudo.

Write the command that installs the nmap package with apt.`,
    hint: 'sudo apt install PACKAGE — the package is nmap.',
    answers: ['sudo apt install nmap', 'sudo apt-get install nmap', 'sudo apt install -y nmap', 'apt install nmap'],
    xp: 14,
    explanation: `$ sudo apt install nmap
Reading package lists... Done
The following NEW packages will be installed: nmap
...
Setting up nmap (7.94+dfsg-...) ...

apt install fetches the package and every dependency from the signed Ubuntu repositories, then installs it. Run  sudo apt update  first to refresh the catalogue so you get current versions. Remove with apt remove, search with  apt search nmap .

Why it matters: the package manager is the safe, signed way to get software on Linux — far better than downloading random installers. Keeping the whole system current with  sudo apt update && sudo apt upgrade  is the single most effective host-security habit.`,
  },

  // ── SECTION 5: Networking & Firewall ──────────────────────────────────────
  {
    id: 'linux-17',
    title: 'Show Your Network Addresses',
    objective: `You need this machine's IP address and its network interfaces — to know your place on the lab network and which address a target will see you coming from.

What is the modern command that shows all interfaces and their IP addresses? (The old ifconfig has been replaced.)`,
    hint: 'The modern tool is "ip". For addresses:  ip a  (short for ip addr).',
    answers: ['ip a', 'ip addr', 'ip address', 'ip -br a'],
    xp: 14,
    explanation: `$ ip a
1: lo: <LOOPBACK,UP> ... inet 127.0.0.1/8 scope host lo
2: eth0: <BROADCAST,MULTICAST,UP> ... inet 10.0.2.15/24 brd 10.0.2.255 scope global eth0

ip a lists every interface: lo is loopback (the machine talking to itself, 127.0.0.1), eth0 is the real network card with address 10.0.2.15. The /24 is the subnet mask. Companion commands:  ip r  shows the routing table,  ip link  shows interface state.

Why it matters: ip replaced ifconfig and route on modern Linux. Knowing your address, subnet, and gateway is step one of any network task — reconnaissance, pivoting, or just confirming a lab VM is on the isolated network you intended.`,
  },
  {
    id: 'linux-18',
    title: 'What Ports Are Listening?',
    objective: `Every open port is attack surface. You want to see which TCP and UDP ports this machine is listening on, with the program behind each one and numeric port numbers (no slow name lookups).

Write the ss command that shows TCP + UDP listening sockets, with the owning program, numerically.`,
    hint: 'ss with the flags -tulpn (TCP, UDP, listening, program, numeric).',
    answers: ['ss -tulpn', 'ss -tulnp', 'ss -tlnp', 'sudo ss -tulpn'],
    flag: 'GHOST{every_open_port_is_a_door}',
    xp: 18,
    explanation: `$ sudo ss -tulpn
Netid State  Local Address:Port   Process
tcp   LISTEN 0.0.0.0:22           users:(("sshd",pid=812))
tcp   LISTEN 127.0.0.1:631        users:(("cupsd",pid=701))

ss -tulpn decodes to: -t TCP, -u UDP, -l listening, -p the program, -n numeric ports. Here sshd listens on 22 for the whole network (0.0.0.0), while cupsd listens only on localhost (127.0.0.1) — far less exposed.

Why it matters: this one command answers "what is reachable on this host?" — the first question in both hardening (close what you do not need) and investigation (an unexpected listener is often a backdoor). ss replaced the older netstat.`,
  },
  {
    id: 'linux-19',
    title: 'Generate an SSH Key Pair',
    objective: `You want to log into servers securely without passwords. The professional standard is key-based authentication, which starts by generating a modern Ed25519 key pair on your own machine.

Write the ssh-keygen command that creates a new Ed25519 key pair.`,
    hint: 'ssh-keygen with -t ed25519 selects the key type.',
    answers: ['ssh-keygen -t ed25519', 'ssh-keygen -t ed25519 -C analyst', 'ssh-keygen -t ed25519 -C "analyst@ghost-lab"'],
    xp: 16,
    explanation: `$ ssh-keygen -t ed25519
Generating public/private ed25519 key pair.
Enter file in which to save the key (/home/analyst/.ssh/id_ed25519):
Your identification has been saved in /home/analyst/.ssh/id_ed25519
Your public key has been saved in /home/analyst/.ssh/id_ed25519.pub

This creates two files: id_ed25519 (the PRIVATE key — never share it) and id_ed25519.pub (the public key, which you copy to servers with ssh-copy-id). After that,  ssh analyst@server  logs you in with no password prompt.

Why it matters: key auth removes password guessing as a threat entirely. Guard the private key like a password; SSH will even refuse a private key that others can read (mode must be 600), which is why file permissions matter.`,
  },
  {
    id: 'linux-20',
    title: 'Check the Firewall',
    objective: `Before you consider this box safe, confirm the state of its firewall and which rules are active. On Ubuntu the simple front end to the kernel firewall is ufw.

What command shows the current status and rules of the ufw firewall? (It needs root.)`,
    hint: 'sudo ufw status — add "verbose" for the full detail.',
    answers: ['sudo ufw status', 'sudo ufw status verbose', 'ufw status', 'sudo ufw status numbered'],
    xp: 16,
    explanation: `$ sudo ufw status verbose
Status: active
Default: deny (incoming), allow (outgoing)
To                         Action      From
--                         ------      ----
22/tcp                     LIMIT       Anywhere

A healthy posture: default deny incoming, allow outgoing, and only the ports you truly serve opened. "LIMIT" on 22 rate-limits SSH to blunt brute force. ufw is a friendly front end that writes the underlying nftables rules for you.

Why it matters: a default-deny firewall means anything you did not explicitly permit is blocked. On a remote box, ALWAYS allow SSH before enabling ufw, or you will lock yourself out — the most common self-inflicted lockout there is.`,
  },

  // ── SECTION 6: Capture the Flag ───────────────────────────────────────────
  {
    id: 'linux-21',
    title: 'Hunt the Hidden Dotfile',
    objective: `A previous operator left you a message hidden in a dotfile in your home directory. From ls -la you can see a file named  .ghost_profile  that you did not create.

Snapshot your VM first if this were real work — then read it. What command prints the contents of the hidden file .ghost_profile in your home directory?`,
    hint: 'cat the dotfile:  cat ~/.ghost_profile  (the ~ is your home directory).',
    answers: ['cat ~/.ghost_profile', 'cat /home/analyst/.ghost_profile', 'cat ./.ghost_profile', 'less ~/.ghost_profile'],
    flag: 'GHOST{dotfiles_hide_in_plain_sight}',
    xp: 16,
    explanation: `$ cat ~/.ghost_profile
# left for the next operator - decode me:
R0hPU1R7YmFzZTY0X2lzX2VuY29kaW5nX25vdF9lbmNyeXB0aW9ufQ==

The file holds a base64 string, not plaintext. Dotfiles (names starting with a dot) are hidden from a plain  ls  but revealed by  ls -la  — they are where real configuration, SSH keys, shell history (.bash_history) and, as here, left-behind secrets live.

Why it matters: on any box you investigate, the dotfiles in home directories are gold — credentials, tokens, and history hide there in plain sight. The reflex to snapshot before poking at unknown artefacts is also what keeps a lab safe.`,
  },
  {
    id: 'linux-22',
    title: 'Decode and Verify',
    objective: `The .ghost_profile contained a base64 blob:
R0hPU1R7YmFzZTY0X2lzX2VuY29kaW5nX25vdF9lbmNyeXB0aW9ufQ==

Decode it to reveal the final flag. base64 is an encoding, not encryption — anyone can reverse it.

Write the command that decodes that base64 string back to readable text. (Assume it is saved in .ghost_profile, or pipe the string into base64.)`,
    hint: 'base64 with the -d (decode) flag:  base64 -d ~/.ghost_profile  — or  echo STRING | base64 -d',
    answers: ['base64 -d ~/.ghost_profile', 'base64 --decode ~/.ghost_profile', 'cat ~/.ghost_profile | base64 -d', 'base64 -d .ghost_profile'],
    flag: 'GHOST{base64_is_encoding_not_encryption}',
    xp: 18,
    explanation: `$ base64 -d ~/.ghost_profile
GHOST{base64_is_encoding_not_encryption}

base64 -d reverses base64 encoding instantly — it scrambles bytes into safe text for transport but provides ZERO confidentiality. Never treat base64 as protection.

To prove a file is genuine and untampered you use a cryptographic hash, which base64 is not:
  $ sha256sum ~/.ghost_profile
  3b1f...e9a2  /home/analyst/.ghost_profile
A matching sha256 confirms integrity; a changed byte produces a completely different hash.

Why it matters: distinguishing encoding (reversible, no secrecy — base64, hex, URL-encoding) from hashing (one-way, for integrity — sha256sum) from encryption (reversible only with a key) is a foundational security concept. Confusing them is a classic, costly mistake. You have finished First Boot — you can now operate a Linux box from a cold start.`,
  },
]

const xpTotal = steps.reduce((sum, s) => sum + s.xp, 0)

export default function LinuxLab() {
  const [guidedDone, setGuidedDone] = useState(false)
  const [freeLaunched, setFreeLaunched] = useState(false)
  const [earnedXp, setEarnedXp] = useState(0)
  const [showKeywords, setShowKeywords] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('lab_linux-lab')
    if (saved) {
      const d = JSON.parse(saved)
      if (d.done) { setGuidedDone(true); setEarnedXp(d.xp || 0) }
    }
  }, [])

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#4f7a5a' }}>
        <Link href="/" style={{ color: '#4f7a5a', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>&#8250;</span>
        <Link href="/modules/linux" style={{ color: '#4f7a5a', textDecoration: 'none' }}>LINUX MASTERY</Link>
        <span>&#8250;</span>
        <span style={{ color: accent }}>LAB</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px', alignItems: 'center' }}>
          <Link href="/modules/linux" style={{ textDecoration: 'none', padding: '3px 10px', border: '1px solid #1a3a24', borderRadius: '3px', color: '#4f7a5a', fontSize: '7.5px', letterSpacing: '0.1em' }}>&#8592; CONCEPT</Link>
          <span style={{ padding: '3px 10px', background: 'rgba(115,201,145,0.1)', border: '1px solid rgba(115,201,145,0.4)', borderRadius: '3px', color: accent, fontSize: '7.5px', letterSpacing: '0.1em', fontWeight: 700 }}>LAB ACTIVE</span>
        </div>
      </div>

      {/* Progress banner */}
      <div style={{ background: 'rgba(115,201,145,0.04)', border: '1px solid rgba(115,201,145,0.15)', borderRadius: '6px', padding: '10px 16px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' as const }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {[{ label: 'PHASE 1', done: true, active: !guidedDone }, { label: 'PHASE 2', done: guidedDone, active: guidedDone }].map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.done ? accent : '#1a3a24', border: p.active ? '2px solid ' + accent : '1px solid #1a3a24', boxShadow: p.active ? '0 0 6px ' + accent : 'none' }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: p.done ? accent : '#2a5a38', letterSpacing: '0.1em' }}>{p.label}</span>
              {i === 0 && <span style={{ fontSize: '7px', color: '#1a3a24', margin: '0 2px' }}>&#8212;</span>}
            </div>
          ))}
        </div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#4f7a5a' }}>
          MOD-{moduleNum} &nbsp;&middot;&nbsp; {moduleName.toUpperCase()} &nbsp;&middot;&nbsp; {xpTotal} XP &nbsp;&middot;&nbsp; {steps.length} STEPS
        </div>
        {guidedDone && (
          <div style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: accent, fontWeight: 700 }}>
            &#10003; GUIDED PHASE COMPLETE &#8212; LAUNCH FREE LAB BELOW
          </div>
        )}
      </div>

      {/* Section index */}
      <div style={{ background: 'rgba(115,201,145,0.02)', border: '1px solid rgba(115,201,145,0.08)', borderRadius: '6px', padding: '12px 16px', marginBottom: '1.5rem', fontFamily: 'JetBrains Mono, monospace' }}>
        <div style={{ fontSize: '7px', color: '#2a5a38', letterSpacing: '0.25em', marginBottom: '10px' }}>LAB SECTIONS</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '6px' }}>
          {[
            { section: '01-05', title: 'First Steps & Orientation', steps: '5 steps' },
            { section: '06-08', title: 'Files & Finding', steps: '3 steps' },
            { section: '09-12', title: 'Permissions & Privilege', steps: '4 steps' },
            { section: '13-16', title: 'Processes, Services & Packages', steps: '4 steps' },
            { section: '17-20', title: 'Networking & Firewall', steps: '4 steps' },
            { section: '21-22', title: 'Capture the Flag', steps: '2 steps' },
          ].map(s => (
            <div key={s.section} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '7px', color: accent + '66', flexShrink: 0, minWidth: '34px' }}>{s.section}</span>
              <div>
                <div style={{ fontSize: '7.5px', color: '#4f8a5a' }}>{s.title}</div>
                <div style={{ fontSize: '6.5px', color: '#2a5a38', marginTop: '1px' }}>{s.steps}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── PHASE 1: Guided Learning ── */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(115,201,145,0.1)', border: '1px solid rgba(115,201,145,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: accent, fontWeight: 700 }}>1</span>
          </div>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#2a5a38', letterSpacing: '0.2em', marginBottom: '2px' }}>PHASE 1 &#8212; GUIDED LEARNING</div>
            <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.4rem', fontWeight: 700, color: accent, margin: 0 }}>First Boot</h1>
          </div>
        </div>

        <p style={{ color: '#6a8a74', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: 1.7, fontFamily: 'JetBrains Mono, monospace' }}>
          {steps.length} steps that walk a complete first session on a fresh Linux box: find your identity and location, navigate and
          read files, create and edit, manage permissions and privilege, inspect processes and services, install software, map the
          network, check the firewall, and finish by capturing a hidden flag. Read every explanation &#8212; each goes beyond the answer.
        </p>

        <div style={{ background: 'rgba(115,201,145,0.03)', border: '1px solid rgba(115,201,145,0.12)', borderRadius: '6px', padding: '1rem 1.25rem', marginBottom: '1.25rem', fontFamily: 'JetBrains Mono, monospace' }}>
          <div style={{ fontSize: '7px', color: '#2a5a38', letterSpacing: '0.25em', marginBottom: '8px' }}>SKILLS DEVELOPED</div>
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '6px' }}>
            {[
              'Identity & context (whoami, id)',
              'Filesystem navigation (pwd, cd, ls)',
              'Hidden files & dotfiles',
              'Distro fingerprinting',
              'Creating & editing files',
              'Copy / move / remove safely',
              'Searching with find',
              'chmod & the execute bit',
              'SUID binary recognition',
              'sudo privilege enumeration',
              'Process inspection (ps, grep)',
              'systemd service management',
              'Reading logs with journalctl',
              'apt package installation',
              'Network addressing (ip)',
              'Listening ports (ss -tulpn)',
              'SSH key generation',
              'ufw firewall basics',
              'base64 decode vs hashing',
              'Snapshot discipline',
            ].map(c => (
              <span key={c} style={{ fontSize: '7.5px', color: '#3a7a4a', background: 'rgba(115,201,145,0.06)', border: '1px solid rgba(115,201,145,0.12)', padding: '2px 8px', borderRadius: '3px' }}>{c}</span>
            ))}
          </div>
        </div>

        <LabTerminal
          labId="linux-lab"
          moduleId={moduleId}
          title="First Boot"
          accent={accent}
          steps={steps}
          onComplete={(xp) => { setGuidedDone(true); setEarnedXp(xp) }}
          onRestart={() => { setGuidedDone(false); setFreeLaunched(false); setEarnedXp(0) }}
        />
      </div>

      {/* ── PHASE 2: Free Lab ── */}
      <div id="free-lab" style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: guidedDone ? 'rgba(115,201,145,0.15)' : 'rgba(0,0,0,0.3)', border: '1px solid ' + (guidedDone ? 'rgba(115,201,145,0.4)' : '#1a3a24'), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: guidedDone ? accent : '#2a5a38', fontWeight: 700 }}>2</span>
          </div>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: guidedDone ? '#4f8a5a' : '#2a5a38', letterSpacing: '0.2em', marginBottom: '2px' }}>PHASE 2 &#8212; FREE LAB ENVIRONMENT</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.1rem', fontWeight: 700, color: guidedDone ? accent : '#2a5a38' }}>Full Linux Practice Sandbox</div>
          </div>
          {guidedDone && !freeLaunched && (
            <div style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#ffb347', background: 'rgba(255,179,71,0.08)', border: '1px solid rgba(255,179,71,0.2)', padding: '3px 10px', borderRadius: '3px' }}>
              GUIDED PHASE COMPLETE
            </div>
          )}
        </div>

        {!freeLaunched ? (
          <div style={{ background: guidedDone ? 'rgba(115,201,145,0.04)' : '#020603', border: '1px solid ' + (guidedDone ? 'rgba(115,201,145,0.25)' : '#0a1a10'), borderRadius: '10px', padding: '2.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            {guidedDone && (
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, ' + accent + ', transparent)' }} />
            )}
            <div style={{ fontSize: '7px', color: guidedDone ? '#3a7a4a' : '#1a3a24', letterSpacing: '0.3em', marginBottom: '1rem' }}>
              {guidedDone ? 'READY FOR FREE-FORM PRACTICE' : 'COMPLETE GUIDED PHASE TO UNLOCK'}
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.2rem', color: guidedDone ? accent : '#2a5a38', fontWeight: 700, marginBottom: '0.5rem' }}>
              LAUNCH FULL LAB ENVIRONMENT
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', color: '#4f7a5a', marginBottom: '0.75rem', lineHeight: 1.7 }}>
              Free-form terminal sandbox &#8212; no guided prompts, no restrictions
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' as const, marginBottom: '2rem' }}>
              {[
                'Navigate the filesystem',
                'Permissions & ownership',
                'Processes & systemd',
                'apt package management',
                'Networking: ip, ss, ssh',
                'ufw firewall rules',
              ].map(feat => (
                <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: guidedDone ? accent : '#1a3a24' }} />
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: guidedDone ? '#4f8a5a' : '#1a3a24' }}>{feat}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => guidedDone && setFreeLaunched(true)}
              disabled={!guidedDone}
              style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.15em',
                padding: '14px 40px', border: '1px solid ' + (guidedDone ? 'rgba(115,201,145,0.6)' : '#1a3a24'),
                borderRadius: '6px', background: guidedDone ? 'rgba(115,201,145,0.12)' : 'transparent',
                color: guidedDone ? accent : '#1a3a24', cursor: guidedDone ? 'pointer' : 'not-allowed',
                boxShadow: guidedDone ? '0 0 24px rgba(115,201,145,0.18)' : 'none', transition: 'all 0.2s',
              }}
            >
              {guidedDone ? '▸ LAUNCH FREE LAB ENVIRONMENT' : 'COMPLETE THE GUIDED PHASE FIRST'}
            </button>
            {!guidedDone && (
              <div style={{ marginTop: '1rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: '#1a3a24' }}>
                Complete all {steps.length} guided steps above to unlock the free lab environment
              </div>
            )}
          </div>
        ) : (
          <div style={{ border: '1px solid ' + accent + '30', borderRadius: '10px', overflow: 'hidden', background: '#020802' }}>
            <FreeLabTerminal moduleId={moduleId} moduleName={moduleName} accent={accent} onClose={() => setFreeLaunched(false)} />
            <div style={{ padding: '8px 16px', background: '#030a05', borderTop: '1px solid ' + accent + '15', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: accent, boxShadow: '0 0 5px ' + accent }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#3a7a4a' }}>
                Free practice mode. Ask <span style={{ color: accent }}>GHOST AGENT</span> (bottom-right) for deeper explanations on any Linux command or concept.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Quick reference */}
      <div style={{ marginBottom: '2rem' }}>
        <button
          onClick={() => setShowKeywords(!showKeywords)}
          style={{ background: 'transparent', border: '1px solid #1a3a24', borderRadius: '5px', padding: '8px 16px', cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#3a6a44', letterSpacing: '0.1em', marginBottom: showKeywords ? '12px' : 0, transition: 'all 0.15s' }}
        >
          {showKeywords ? '▼' : '▶'} QUICK REFERENCE &#8212; LINUX COMMANDS
        </button>
        {showKeywords && (
          <div style={{ background: '#030a05', border: '1px solid #0d1f12', borderRadius: '6px', padding: '1.25rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '8px' }}>
              {[
                ['whoami', 'Print the current username'],
                ['pwd', 'Print the working directory (absolute path)'],
                ['ls -la', 'Long listing including hidden dotfiles'],
                ['cd DIR', 'Change into a directory (cd alone = home)'],
                ['cat /etc/os-release', 'Identify the distribution and version'],
                ['nano FILE', 'Edit a file in the beginner-friendly editor'],
                ['cp SRC DST', 'Copy a file (cp -r for directories)'],
                ['mv SRC DST', 'Move or rename a file'],
                ['rm FILE', 'Delete a file (no undo! rm -i to confirm)'],
                ['find . -name NAME', 'Search the tree for a filename'],
                ['chmod +x FILE', 'Add the execute permission bit'],
                ['ls -l /usr/bin/passwd', 'Spot the SUID (s) bit'],
                ['sudo -l', 'List your own sudo privileges'],
                ['id', 'Show UID, GID and all group memberships'],
                ['ps aux | grep NAME', 'Find a running process by name'],
                ['systemctl status ssh', 'Check a service: active + enabled'],
                ['journalctl -u ssh', 'Read a service log (-f to follow)'],
                ['sudo apt install PKG', 'Install a package with apt'],
                ['ip a', 'Show interfaces and IP addresses'],
                ['sudo ss -tulpn', 'List listening TCP/UDP ports + program'],
                ['ssh-keygen -t ed25519', 'Generate an SSH key pair'],
                ['sudo ufw status verbose', 'Show firewall rules and defaults'],
                ['base64 -d FILE', 'Decode base64 (encoding, not encryption)'],
                ['sha256sum FILE', 'Hash a file to verify integrity'],
              ].map(([cmd, desc]) => (
                <div key={cmd} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '6px 8px', background: '#020602', borderRadius: '4px' }}>
                  <code style={{ color: accent, fontSize: '0.7rem', flexShrink: 0 }}>{cmd}</code>
                  <span style={{ color: '#4f7a5a', fontSize: '0.68rem' }}>{desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer nav */}
      <div style={{ paddingTop: '2rem', borderTop: '1px solid #0d1f12', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' as const, gap: '10px' }}>
        <Link href="/modules/linux" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#3a6a44' }}>&#8592; BACK TO CONCEPT</Link>
        <Link href="/modules/scripting/lab" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#3a6a44' }}>SCRIPTING LAB &#8594;</Link>
      </div>
    </div>
  )
}
