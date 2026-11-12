'use client'
import React from 'react'
import Link from 'next/link'
import ModuleCodex, { CodexChapter } from '@/app/components/ModuleCodex'

const mono = 'JetBrains Mono, monospace'
const accent = '#7fdbff'

const Pre = ({ label, children }: { label?: string; children: string }) => (
  <div style={{ margin: '1rem 0 1.5rem' }}>
    {label && (
      <div style={{ fontFamily: mono, fontSize: '9px', color: '#4a7080', letterSpacing: '0.15em', marginBottom: '4px', paddingLeft: '4px' }}>
        {label}
      </div>
    )}
    <pre style={{
      background: '#04090c', border: '1px solid #12303a', borderRadius: '4px',
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
    color: '#5cc8f0', marginTop: '2rem', marginBottom: '0.75rem'
  }}>
    &#9658; {children}
  </h3>
)

const P = ({ children }: { children: React.ReactNode }) => (
  <p style={{ color: '#8fa3ab', lineHeight: 1.8, marginBottom: '1rem', fontSize: '0.9rem' }}>
    {children}
  </p>
)

const C = ({ children }: { children: React.ReactNode }) => (
  <code style={{ fontFamily: mono, fontSize: '0.8rem', color: accent, background: 'rgba(127,219,255,0.07)', padding: '1px 5px', borderRadius: '3px' }}>
    {children}
  </code>
)

const Note = ({ type, children }: { type?: 'info' | 'warn' | 'danger' | 'tip'; children: React.ReactNode }) => {
  const configs: Record<string, [string, string, string]> = {
    info: [accent, 'rgba(127,219,255,0.05)', 'NOTE'],
    warn: ['#ffb347', 'rgba(255,179,71,0.05)', 'WARNING'],
    danger: ['#ff4136', 'rgba(255,65,54,0.05)', 'CRITICAL'],
    tip: ['#00ff41', 'rgba(0,255,65,0.05)', 'TIP'],
  }
  const [color, bg, label] = configs[type || 'info']
  return (
    <div style={{
      background: bg, borderLeft: '3px solid ' + color,
      padding: '1rem 1.25rem', borderRadius: '0 4px 4px 0',
      margin: '1.5rem 0', border: '1px solid ' + color + '33', borderLeftColor: color
    }}>
      <div style={{ fontFamily: mono, fontSize: '9px', color, letterSpacing: '0.2em', marginBottom: '6px' }}>{label}</div>
      <div style={{ color: '#8fa3ab', fontSize: '0.85rem', lineHeight: 1.7 }}>{children}</div>
    </div>
  )
}

const Table = ({ headers, rows }: { headers: string[]; rows: string[][] }) => (
  <div style={{ overflowX: 'auto', margin: '1rem 0 1.5rem' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: mono, fontSize: '0.75rem' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid #12303a' }}>
          {headers.map((h, i) => (
            <th key={i} style={{ textAlign: 'left', padding: '8px 12px', color: '#5cc8f0', fontWeight: 600, letterSpacing: '0.1em', fontSize: '0.7rem' }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} style={{ borderBottom: '1px solid #0b1d24', background: i % 2 === 0 ? 'transparent' : 'rgba(127,219,255,0.02)' }}>
            {row.map((cell, j) => (
              <td key={j} style={{ padding: '8px 12px', color: '#8fa3ab', verticalAlign: 'top' }}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

// Scannable "must-know" box — lead each section with these so a reader can take notes fast.
const Key = ({ title, items }: { title?: string; items: React.ReactNode[] }) => (
  <div style={{ background: 'rgba(127,219,255,0.05)', border: '1px solid rgba(127,219,255,0.2)', borderLeft: '3px solid ' + accent, borderRadius: '6px', padding: '0.85rem 1.1rem', margin: '1rem 0 1.5rem' }}>
    <div style={{ fontFamily: mono, fontSize: '9px', color: accent, letterSpacing: '0.18em', marginBottom: '0.55rem' }}>{title || 'KEY POINTS'}</div>
    <ul style={{ margin: 0, paddingLeft: '1.05rem', display: 'grid', gap: '0.5rem' }}>
      {items.map((it, i) => <li key={i} style={{ color: '#b6c3cb', fontSize: '0.855rem', lineHeight: 1.6, fontFamily: 'sans-serif' }}>{it}</li>)}
    </ul>
  </div>
)

// "Picture it" — a relatable, everyday analogy in plain language (African/Kenyan context).
const Local = ({ children }: { children: React.ReactNode }) => (
  <div style={{ background: 'rgba(115,201,145,0.06)', border: '1px solid rgba(115,201,145,0.26)', borderRadius: '6px', padding: '0.85rem 1.1rem', margin: '1rem 0 1.5rem' }}>
    <div style={{ fontFamily: mono, fontSize: '9px', color: '#73c991', letterSpacing: '0.15em', marginBottom: '6px' }}>&#9672; PICTURE IT &#8212; MTAANI EDITION</div>
    <p style={{ color: '#aeb9b2', fontSize: '0.85rem', lineHeight: 1.75, margin: 0, fontFamily: 'sans-serif' }}>{children}</p>
  </div>
)

const chapters: CodexChapter[] = [
  {
    id: 'computers-and-operating-systems',
    title: 'How Computers and Operating Systems Work',
    difficulty: 'BEGINNER',
    readTime: '11 min',
    takeaways: [
      'A computer is a CPU executing instructions on data held in memory; storage keeps data when the power is off, RAM does not.',
      'The kernel is the privileged core of the OS. Programs run in user space and must ask the kernel, through system calls, to touch hardware, files or the network.',
      'A process is a running program with its own virtual memory, a PID, an owner and a set of open files. Threads share one process\'s memory.',
      'Every process runs as some user, and that user\'s identity decides what it may read, write and execute. Root (UID 0) on Linux and SYSTEM on Windows sit above normal checks.',
      'Most attacks are about changing which user your code runs as, or reaching memory and files you were never meant to see. Understanding this model is the foundation for everything else.',
    ],
    content: (
      <div>
        <Key title="WHAT YOU'LL OWN BY THE END" items={[
          <>What a <strong>CPU, RAM and storage</strong> each do &mdash; and why it matters to an attacker</>,
          <>What an <strong>operating system</strong> and its <strong>kernel</strong> actually manage</>,
          <>What a <strong>system call</strong> is &mdash; the single gate between your program and the hardware</>,
          <>How <strong>processes, memory and files</strong> work, and where attacks hide inside them</>,
          <>The <strong>user and permission model</strong> &mdash; the lock-and-key system behind every hack and every defence</>,
        ]} />
        <H3>Why Start Here</H3>
        <P>
          Every hack is just a computer doing exactly what it was told. Attackers win when they understand the machine better than the people who set it up. So before any tool, get the mental model: what a computer is, what the OS does, and how it decides who is allowed to do what.
        </P>

        <H3>The Hardware in Plain Terms</H3>
        <P>
          Think of a computer as a kitchen. The <strong>CPU</strong> (Central Processing Unit) is the chef: it can only do simple things, such as add two numbers, compare them, copy a value from one place to another, or jump to a different instruction, but it does billions of them per second. Each simple operation is an <strong>instruction</strong>, and a program is just a long list of instructions. A modern CPU has several <strong>cores</strong>, which are independent chefs working in parallel, and each core holds a handful of tiny, ultra-fast storage slots called <strong>registers</strong>. One register, the instruction pointer, always holds the address of the next instruction to run. Remember that: much of exploit development (MOD-04) is about seizing control of that one register.
        </P>
        <P>
          <strong>RAM</strong> (Random Access Memory) is the kitchen counter. It is fast, the chef can reach anything on it instantly, and it is wiped clean when the power goes off. <strong>Storage</strong> (an SSD or hard disk) is the pantry: much larger, much slower, and it keeps its contents without power. When you open a program, its instructions are copied from storage into RAM so the CPU can run them. Between the CPU and RAM sit several layers of <strong>cache</strong>, small pockets of very fast memory that keep recently used data close to the chef. Attacks such as Spectre and Meltdown abused the way caches and speculative execution leak timing information, so even these details matter to security.
        </P>
        <Table
          headers={['Component', 'Analogy', 'Speed', 'Survives Power Off?', 'Security Relevance']}
          rows={[
            ['CPU registers', 'The chef\'s hands', 'Fastest', 'No', 'Hijacking the instruction pointer = code execution'],
            ['CPU cache', 'Spice rack beside the stove', 'Very fast', 'No', 'Side-channel attacks (Spectre, Meltdown)'],
            ['RAM', 'The counter', 'Fast', 'No', 'Holds passwords, keys, tokens while in use; memory forensics'],
            ['SSD / HDD', 'The pantry', 'Slow', 'Yes', 'Files, logs, deleted-data recovery, disk forensics'],
          ]}
        />
        <Local>Think of <strong>RAM</strong> like the cash in a duka&apos;s till during the day: fast to reach, but counted out and emptied every closing time. <strong>Storage</strong> is the owner&apos;s bank account &mdash; slower to get to, but your money is still there tomorrow. Opening an app just carries it from the &quot;bank&quot; (storage) to the &quot;till&quot; (RAM) so the CPU can work fast. Cut the power and RAM vanishes like the till at closing &mdash; which is exactly why investigators rush to capture a machine&apos;s memory <em>while it is still on</em> (MOD-18).</Local>

        <H3>What an Operating System Does</H3>
        <P>
          Hardware on its own is useless to a normal program. A web browser does not know how to talk to a specific Wi-Fi chip or a specific SSD controller, and it should not have to. The <strong>operating system</strong> (OS) is the software layer that manages hardware and offers programs a clean, consistent interface to it. Linux, Windows, macOS, Android and iOS are all operating systems.
        </P>
        <P>
          The heart of the OS is the <strong>kernel</strong>. The kernel runs in a privileged CPU mode (often called ring 0 or kernel mode) where it can touch any memory and any device. Everything else, including your browser, your shell and even most system tools, runs in <strong>user space</strong> (ring 3), where the CPU itself blocks direct hardware access. When a user-space program wants to open a file, send a network packet or start another program, it must politely ask the kernel through a <strong>system call</strong> (syscall). The kernel checks whether the request is allowed, does the work, and returns the result. This boundary is the single most important security wall in a computer: a bug that lets user code run inside the kernel gives the attacker total control.
        </P>
        <Pre label="THE LAYERS OF A RUNNING SYSTEM">
{`+-----------------------------------------------------------+
|  USER SPACE  (ring 3)                                     |
|    bash    firefox    sshd    python3    nginx            |
|       |        |        |        |         |              |
|       +--------+---- system calls ---------+              |
|                (open, read, write, execve, socket ...)    |
+-----------------------------------------------------------+
|  KERNEL SPACE  (ring 0)                                   |
|    process scheduler   memory manager   file systems      |
|    network stack       device drivers   security checks   |
+-----------------------------------------------------------+
|  HARDWARE                                                 |
|    CPU cores    RAM    SSD    network card    USB         |
+-----------------------------------------------------------+`}
        </Pre>
        <P>
          You can watch system calls happen. On Linux, the <C>strace</C> tool prints every syscall a program makes. Running it against a simple command shows that even printing a file is a conversation with the kernel.
        </P>
        <Pre label="WATCHING SYSCALLS WITH STRACE (TRIMMED)">
{`$ strace -e trace=openat,read,write cat /etc/hostname
openat(AT_FDCWD, "/etc/hostname", O_RDONLY) = 3
read(3, "ghost-lab\\n", 131072)              = 10
write(1, "ghost-lab\\n", 10)                 = 10
ghost-lab
+++ exited with 0 +++

# openat -> ask the kernel to open the file, it returns file descriptor 3
# read   -> read bytes from descriptor 3
# write  -> write those bytes to descriptor 1 (standard output, your screen)`}
        </Pre>

        <H3>Processes, Threads and Virtual Memory</H3>
        <P>A <strong>program</strong> is a file on disk; a <strong>process</strong> is that program actually running. Same recipe, different meals.</P>
        <Key items={[
          <><strong>PID</strong> &mdash; every process has a unique Process ID. Open three terminals and you get three bash processes from one file</>,
          <><strong>Owner</strong> &mdash; every process runs as some user, and that decides what it may touch</>,
          <><strong>Thread</strong> &mdash; a separate line of work inside a process; threads share memory (fast, but one can corrupt the others)</>,
          <><strong>Virtual memory</strong> &mdash; each process thinks it owns all the RAM; the kernel keeps them walled off from one another</>,
          <><strong>Stack / heap / code</strong> &mdash; the regions of a process&apos;s memory. Overwrite the stack&apos;s saved <em>return address</em> and you control where the CPU jumps next &mdash; that one sentence is the whole classic buffer overflow (MOD-04)</>,
          <>Dumping another process&apos;s memory (e.g. Windows LSASS, MOD-05) needs high privilege: you must ask the kernel to break the wall for you</>,
        ]} />
        <Local>A matatu <strong>route</strong> &mdash; say Route 46 to Ng&apos;ando &mdash; is the <strong>program</strong>: the plan, written down. A specific matatu actually plying that route right now is the <strong>process</strong>. Ten matatus can run Route 46 at once, just like ten processes run from one program file &mdash; each with its own passengers (memory) and its own conductor deciding who boards (the user it runs as). Forcing your way onto someone else&apos;s matatu to see their passengers is memory dumping; the kernel is the traffic marshal who normally won&apos;t allow it.</Local>
        <Pre label="INSPECTING PROCESSES ON LINUX">
{`$ ps -o pid,ppid,user,cmd -p $$
    PID    PPID USER     CMD
   2314    2301 ghost    -bash

$ ls /proc/2314/
cmdline  cwd  environ  exe  fd  maps  status  ...

$ cat /proc/2314/status | grep -E 'Name|Uid'
Name:   bash
Uid:    1000    1000    1000    1000

# /proc is a virtual file system: the kernel shows live process
# information as if it were ordinary files.`}
        </Pre>

        <H3>Files and File Systems</H3>
        <P>
          A <strong>file system</strong> is the scheme the OS uses to organise data on storage into named files and folders (directories). Linux commonly uses ext4, XFS or Btrfs; Windows uses NTFS; macOS uses APFS. Underneath the names, a file system keeps <strong>metadata</strong> about every file: its size, owner, permissions, and timestamps for when it was created, modified and accessed. On Linux each file is described by an <strong>inode</strong>, a record holding that metadata and pointers to the data blocks.
        </P>
        <P>
          Linux follows a famous design idea: <strong>everything is a file</strong>. Ordinary documents are files, but so are devices (your disk is <C>/dev/sda</C> or <C>/dev/nvme0n1</C>), kernel information (<C>/proc</C> and <C>/sys</C>), and even network connections, which a process holds through numbered handles called <strong>file descriptors</strong>. Descriptors 0, 1 and 2 are always standard input, standard output and standard error. This uniformity is powerful: the same small tools that read text files can read process details or device information, which is why the command line (next chapter) is so effective.
        </P>
        <Note type="tip">
          Timestamps are evidence. Defenders build timelines from file modification and access times, and attackers sometimes alter them (a technique called timestomping). You will see both sides in the malware and red team modules.
        </Note>

        <H3>Users and the Permission Model</H3>
        <P>An OS is a shared building; the permission model is its lock-and-key system.</P>
        <Key items={[
          <><strong>User account</strong> &mdash; every person or service has one, identified by a number: <strong>UID</strong> on Linux, <strong>SID</strong> on Windows</>,
          <><strong>Groups</strong> &mdash; bundle users so you can grant access to many at once</>,
          <>Every <strong>process runs as a user</strong>; every <strong>file is owned by a user and group</strong></>,
          <>On each access the <strong>kernel checks identity against the file&apos;s permissions</strong> and allows or denies &mdash; millions of times a day</>,
          <><strong>Super-user</strong> skips most checks: <C>root</C> (UID 0) on Linux; <strong>Administrator</strong> and the even-higher <strong>SYSTEM</strong> account on Windows</>,
          <><strong>Services</strong> run as low-privilege accounts (like <C>www-data</C>) so a hacked service only hands over limited rights</>,
        ]} />
        <Local>Picture a plot (apartment block). Each tenant has a key to their own door only &mdash; that is a <strong>user</strong> and their <strong>permissions</strong>. The caretaker holds a master key to the shared areas &mdash; a <strong>group</strong> privilege. The landlord has every key and answers to no one &mdash; that is <strong>root</strong> / <strong>SYSTEM</strong>. Nearly every attack in the later modules is one quiet move: a tenant trying to become the landlord.</Local>
        <Table
          headers={['Concept', 'Linux', 'Windows']}
          rows={[
            ['User identifier', 'UID (number, root = 0)', 'SID (e.g. S-1-5-21-...-1001)'],
            ['Super-user', 'root', 'Administrator, and above it SYSTEM'],
            ['Account database', '/etc/passwd and /etc/shadow', 'SAM registry hive (local), Active Directory (domain)'],
            ['Typical service account', 'www-data, mysql, nobody', 'LocalService, NetworkService, virtual service accounts'],
            ['Run one command as admin', 'sudo', 'Run as administrator (UAC prompt)'],
            ['Kernel', 'Linux kernel (monolithic, modules)', 'NT kernel (ntoskrnl.exe)'],
          ]}
        />

        <H3>How This Maps to Attacks</H3>
        <P>With just this model, you can already describe most of offensive security &mdash; one line each:</P>
        <Key title="THE WHOLE GAME, IN FIVE MOVES" items={[
          <><strong>Initial access</strong> &mdash; get your code running as <em>some</em> user on the target</>,
          <><strong>Privilege escalation</strong> &mdash; climb from a low user (like <C>www-data</C>) to root/SYSTEM via a misconfig or kernel bug</>,
          <><strong>Credential access</strong> &mdash; read secrets from files or memory you should not reach</>,
          <><strong>Persistence</strong> &mdash; arrange to run again after a reboot (for example, as a service)</>,
          <><strong>Defenders</strong> watch processes, files, users and syscalls for exactly these moves &mdash; every later module goes deep on one</>,
        ]} />
        <Note type="info">
          Keep three questions in your head on every system you touch: Who am I running as? What can this user read, write and execute? Which processes run as someone more powerful than me? The lab for this module trains exactly those reflexes.
        </Note>
      </div>
    ),
  },

  {
    id: 'linux-command-line-1',
    title: 'The Linux Command Line I: Navigation, Files and Pipes',
    difficulty: 'BEGINNER',
    readTime: '12 min',
    labLink: '/modules/foundations/lab',
    takeaways: [
      'The shell reads a command, finds the program, runs it with your arguments and prints its output. Commands follow the pattern: command, options, arguments.',
      'Linux has one directory tree starting at /. Absolute paths start with /, relative paths start from your current directory. ~ is your home, . is here, .. is one level up.',
      'Files starting with a dot are hidden; ls -la shows everything, including permissions, owners and sizes.',
      'Pipes (|) send one command\'s output into the next command. Redirection (>, >>, 2>) sends output to files. Combining small tools is the core Linux skill.',
      'man, --help and tab completion answer most questions faster than a web search.',
    ],
    content: (
      <div>
        <Key items={[
          <>The <strong>shell</strong> (bash, zsh) turns typed commands into kernel actions; the <strong>terminal</strong> is the window it runs in</>,
          <><strong>Move around:</strong> <C>pwd</C> (where am I), <C>ls</C> (list), <C>cd</C> (change dir). Paths are absolute (<C>/home</C>) or relative (<C>../</C>)</>,
          <><strong>Read files:</strong> <C>cat</C>, <C>less</C>, <C>head</C>/<C>tail</C>; <strong>search</strong> with <C>grep</C>; <strong>locate</strong> with <C>find</C></>,
          <><strong>Pipes</strong> (<C>|</C>) chain tools: one command&apos;s output becomes the next&apos;s input &mdash; the Unix superpower</>,
          <><strong>Redirects</strong> (<C>&gt;</C>, <C>&gt;&gt;</C>) send output to files; big jobs are built from small tools joined together</>,
        ]} />
        <Local>Pipes are a jua kali assembly line: each fundi does one small job well and passes the piece to the next. <C>cat log | grep error | wc -l</C> is three fundis &mdash; fetch the log, keep only the errors, count them &mdash; and you just built a tool in one line.</Local>
        <H3>Terminal, Shell and Prompt</H3>
        <P>
          Security work happens at the command line. Servers rarely have a graphical desktop, exploits usually hand you a text shell, and most security tools are command-line programs. Three words get mixed up, so let us separate them. The <strong>terminal</strong> (or terminal emulator) is the window that shows text and takes your keystrokes. The <strong>shell</strong> is the program inside it that interprets what you type; on most Linux systems that is <strong>bash</strong>, while Kali has defaulted to <strong>zsh</strong> since 2020. The <strong>prompt</strong> is the text the shell prints while waiting for you, such as <C>ghost@lab:~$</C>. It tells you the user (ghost), the host (lab), the current directory (~, meaning home) and your privilege level: <C>$</C> for a normal user and <C>#</C> for root.
        </P>
        <P>
          Every command follows the same grammar: the <strong>command</strong> name, then <strong>options</strong> (also called flags, which change behaviour and usually start with a dash), then <strong>arguments</strong> (what to act on). In <C>ls -l /etc</C>, <C>ls</C> is the command, <C>-l</C> asks for the long format, and <C>/etc</C> is the directory to list. Short options can be combined, so <C>ls -l -a</C> and <C>ls -la</C> are identical. Long options use two dashes and whole words, like <C>--all</C>. Linux is case-sensitive: <C>File.txt</C> and <C>file.txt</C> are two different files.
        </P>

        <H3>The Directory Tree</H3>
        <P>
          Windows gives each drive its own letter (C:, D:). Linux has a single tree whose top is the <strong>root directory</strong>, written <C>/</C>. Every disk, USB stick and network share is attached (mounted) somewhere inside that tree. The Filesystem Hierarchy Standard defines what lives where, and knowing it by heart tells you where to look for passwords, configuration and evidence on any Linux box you land on.
        </P>
        <Table
          headers={['Path', 'Contents', 'Why an Attacker or Defender Cares']}
          rows={[
            ['/etc', 'System-wide configuration files', 'passwd, shadow, sudoers, ssh config, cron jobs, service configs'],
            ['/home', 'Users\' personal directories', 'SSH keys, shell history, notes, saved credentials'],
            ['/root', 'Home directory of root', 'The prize on most CTF boxes; normally unreadable to others'],
            ['/var', 'Variable data: logs, mail, web roots, databases', '/var/log for evidence, /var/www for web app source'],
            ['/tmp', 'Temporary files, writable by everyone', 'Common place for attackers to drop tools'],
            ['/opt', 'Optional third-party software', 'Custom apps, often with weaker permissions'],
            ['/bin, /usr/bin', 'Programs for all users', 'Where commands like ls and cat live'],
            ['/sbin, /usr/sbin', 'System administration programs', 'Tools usually run by root'],
            ['/proc, /sys', 'Virtual files exposed by the kernel', 'Live process, network and hardware information'],
            ['/dev', 'Device files', 'Disks, terminals, /dev/null (the black hole)'],
          ]}
        />
        <P>
          A <strong>path</strong> is the address of a file. An <strong>absolute path</strong> starts at the root, like <C>/home/ghost/notes.txt</C>, and means the same thing wherever you are. A <strong>relative path</strong> starts from your <strong>current working directory</strong>, so if you are in <C>/home/ghost</C>, the path <C>notes.txt</C> points to the same file. Three shortcuts appear constantly: <C>~</C> is your home directory, <C>.</C> is the current directory, and <C>..</C> is the parent directory one level up.
        </P>

        <H3>Moving Around</H3>
        <Pre label="NAVIGATION ESSENTIALS">
{`$ pwd                      # print working directory: where am I?
/home/ghost

$ ls                       # list the current directory
labs  notes.txt  tools

$ ls -la                   # long format (-l) including hidden files (-a)
total 32
drwxr-x--- 5 ghost ghost 4096 Nov 11 09:12 .
drwxr-xr-x 4 root  root  4096 Nov 02 14:01 ..
-rw------- 1 ghost ghost  812 Nov 11 09:10 .bash_history
-rw-r--r-- 1 ghost ghost 3771 Nov 02 14:01 .bashrc
drwx------ 2 ghost ghost 4096 Nov 03 10:44 .ssh
drwxrwxr-x 2 ghost ghost 4096 Nov 10 16:20 labs
-rw-rw-r-- 1 ghost ghost  245 Nov 10 16:22 notes.txt
drwxrwxr-x 2 ghost ghost 4096 Nov 10 16:20 tools

$ cd labs                  # change directory (relative path)
$ cd /var/log              # absolute path
$ cd ..                    # up one level, now in /var
$ cd ~                     # home (plain 'cd' does the same)
$ cd -                     # back to the previous directory`}
        </Pre>
        <P>
          Read the long listing carefully, because you will do it thousands of times. The first column shows the file type and permissions (a <C>d</C> means directory, a dash means a normal file; Chapter 3 decodes the rest). Then come the number of links, the owner, the group, the size in bytes, the modification time and the name. Any name starting with a dot is <strong>hidden</strong>: plain <C>ls</C> skips it, which is exactly why configuration files, SSH keys (<C>.ssh</C>) and shell history (<C>.bash_history</C>) are easy to overlook and worth checking first.
        </P>

        <H3>Working With Files</H3>
        <Pre label="CREATE, COPY, MOVE, DELETE">
{`$ mkdir -p loot/web        # make directories (-p creates parents too)
$ touch report.md          # create an empty file or update its timestamp
$ cp notes.txt loot/       # copy
$ cp -r labs/ backup/      # copy a directory recursively
$ mv report.md final.md    # move or rename
$ rm final.md              # delete a file (no recycle bin!)
$ rm -r backup/            # delete a directory and its contents
$ file /usr/bin/ls         # identify a file's real type
/usr/bin/ls: ELF 64-bit LSB pie executable, x86-64, dynamically linked ...`}
        </Pre>
        <Note type="danger">
          There is no undo for <C>rm</C>. A command like <C>rm -rf</C> with a mistyped path can erase a system in seconds. Read destructive commands twice before pressing Enter, and never run commands copied from the internet that you do not understand.
        </Note>
        <P>
          To read files, use <C>cat</C> to print a whole file, <C>less</C> to scroll through a long one (press <C>q</C> to quit and <C>/</C> to search), and <C>head</C> or <C>tail</C> for the first or last ten lines. <C>tail -f</C> follows a file as it grows, which makes it the classic way to watch a log in real time. The <C>file</C> command inspects the actual content rather than trusting the extension, which matters because a file called <C>invoice.pdf</C> can easily be an executable.
        </P>

        <H3>Finding Things: grep and find</H3>
        <P>
          <strong>grep</strong> searches inside files for lines matching a pattern. It is probably the command you will type most in your career. <C>-i</C> ignores case, <C>-r</C> searches recursively through directories, <C>-n</C> shows line numbers, <C>-v</C> inverts the match (show lines that do NOT match), and <C>-E</C> enables extended regular expressions. <strong>find</strong> searches for files themselves by name, type, size, owner, permissions or age, and is the go-to tool for spotting hidden or unusual files.
        </P>
        <Pre label="SEARCHING">
{`$ grep -i "password" config.php
$db_password = "Summer2026!";

$ grep -rn "api_key" /var/www/ 2>/dev/null
/var/www/app/.env:7:API_KEY=sk_live_51H...

$ find /home -name "*.kdbx" 2>/dev/null      # KeePass databases
$ find / -type f -name ".*" -user ghost 2>/dev/null   # hidden files owned by ghost
$ find /var/log -mmin -10                     # files changed in the last 10 minutes
$ find / -perm -4000 -type f 2>/dev/null      # SUID binaries (Chapter 3)`}
        </Pre>

        <H3>Pipes and Redirection</H3>
        <P>
          This is where the command line becomes a superpower. Every command has three standard streams: <strong>standard input</strong> (stdin, descriptor 0), <strong>standard output</strong> (stdout, descriptor 1) and <strong>standard error</strong> (stderr, descriptor 2, where error messages go). A <strong>pipe</strong>, the vertical bar <C>|</C>, connects the stdout of one command to the stdin of the next, like joining garden hoses. Small single-purpose tools snap together into powerful one-liners.
        </P>
        <P>
          <strong>Redirection</strong> sends a stream to a file instead of the screen. A single greater-than sign overwrites the file, a double one appends to it, <C>{'2>'}</C> redirects only errors, and <C>{'2>&1'}</C> merges errors into normal output. The special file <C>/dev/null</C> discards anything written to it, so <C>{'2>/dev/null'}</C> hides the flood of permission-denied messages you get when searching the whole disk as a normal user.
        </P>
        <Pre label="PIPES AND REDIRECTION IN PRACTICE">
{`# Count lines in a web log that contain a 404 status
$ grep " 404 " access.log | wc -l
37

# Top 5 IP addresses hitting the server
$ cut -d' ' -f1 access.log | sort | uniq -c | sort -rn | head -5
    912 203.0.113.50
    140 198.51.100.7
     88 192.0.2.44
     21 10.10.0.15
      9 10.10.0.22

$ ls -la /etc > etc_listing.txt          # stdout to a new file (overwrite)
$ echo "checked /etc" >> notes.txt       # append
$ find / -name "*.bak" 2>/dev/null       # throw errors away
$ ./scan.sh > scan.log 2>&1              # stdout AND stderr into one file
$ cat urls.txt | sort -u | tee unique.txt  # tee: write to file and screen`}
        </Pre>
        <Table
          headers={['Tool', 'What It Does', 'Typical Use']}
          rows={[
            ['wc -l', 'Count lines', 'How many results?'],
            ['sort / sort -u', 'Sort lines / sort and remove duplicates', 'Clean up wordlists and IP lists'],
            ['uniq -c', 'Collapse repeated adjacent lines with counts', 'Frequency analysis (use after sort)'],
            ['cut -d -f', 'Pick fields by delimiter', 'Extract usernames from /etc/passwd'],
            ['awk', 'Field-aware text processing language', 'awk -F: \'{print $1}\' /etc/passwd'],
            ['sed', 'Stream editor: find and replace', 'sed \'s/http/https/g\' urls.txt'],
            ['tr', 'Translate or delete characters', 'tr \'a-z\' \'A-Z\''],
            ['xargs', 'Turn input lines into command arguments', 'find . -name "*.log" | xargs grep error'],
          ]}
        />

        <H3>Getting Help Without Leaving the Terminal</H3>
        <P>
          Nobody memorises every option. Professionals know where to look. <C>man ls</C> opens the manual page for a command; man pages are divided into sections, so <C>man 5 passwd</C> describes the file format of <C>/etc/passwd</C> while <C>man 1 passwd</C> describes the command. Inside man, press <C>/</C> to search and <C>q</C> to quit. Most programs also accept <C>--help</C> for a quick summary, and the community tool <C>tldr</C> shows practical examples. <C>apropos</C> (or <C>man -k</C>) searches man page descriptions when you do not know a command&apos;s name.
        </P>
        <P>
          Two habits will save you hours. First, press <strong>Tab</strong> constantly: the shell completes command names and paths, which prevents typos and reveals what exists. Second, use your history. The up arrow recalls previous commands, <C>history</C> lists them, and <strong>Ctrl+R</strong> searches backwards through them. Other useful keys: Ctrl+C stops the running command, Ctrl+L clears the screen, and Ctrl+D ends input or logs you out.
        </P>
        <Note type="warn">
          Shell history is also a goldmine for attackers. Administrators sometimes type passwords directly on the command line (for example in <C>mysql -p</C> or <C>curl -u</C> commands), and those end up in <C>~/.bash_history</C> or <C>~/.zsh_history</C>. Checking history files is a standard step after landing on a box.
        </Note>
      </div>
    ),
  },

  {
    id: 'linux-command-line-2',
    title: 'Linux II: Users, Permissions, Processes, Services and Logs',
    difficulty: 'BEGINNER',
    readTime: '13 min',
    labLink: '/modules/foundations/lab',
    takeaways: [
      'Accounts live in /etc/passwd; password hashes live in /etc/shadow, readable only by root. id and groups show who you are.',
      'Permissions are read, write and execute for owner, group and others. Octal 755 = rwxr-xr-x, 644 = rw-r--r--, 600 = rw-------.',
      'SUID binaries run as their owner, not as you. A root-owned SUID program with a flaw is a classic route to root.',
      'sudo -l lists what you may run as another user. It is one of the first commands to run after landing on a box.',
      'systemd manages services (systemctl) and logs (journalctl). Authentication events land in /var/log/auth.log on Debian/Ubuntu or /var/log/secure on RHEL-family systems.',
      'Package managers (apt, dnf, pacman) install signed software from trusted repositories; outdated packages are a common source of vulnerabilities.',
    ],
    content: (
      <div>
        <Key items={[
          <><strong>Accounts</strong> live in <C>/etc/passwd</C>; password <strong>hashes</strong> in <C>/etc/shadow</C> (root-only to read)</>,
          <><strong>Permissions</strong> are <C>rwx</C> for owner / group / others. <C>chmod</C> changes them, <C>chown</C> changes the owner</>,
          <><strong>SUID</strong> bits and sudo rules are prime <strong>privilege-escalation</strong> targets (MOD-04/05)</>,
          <><strong>Processes:</strong> <C>ps</C>, <C>top</C>, <C>kill</C> &mdash; each has a PID and an owner</>,
          <><strong>Services</strong> are managed by <C>systemd</C> (<C>systemctl start/status/enable</C>); <strong>logs</strong> live in <C>/var/log</C> and <C>journalctl</C></>,
        ]} />
        <Local>Think of <C>systemd</C> as the duka&apos;s night-watchman roster: it decides which services clock in at boot, keeps them running, and restarts any that collapse at 3am. And <C>/var/log</C> is the gate register &mdash; the first place a defender reads to see who came and went, and the first place an attacker tries to erase.</Local>
        <H3>Where Accounts Live</H3>
        <P>
          In Chapter 1 we saw that every process runs as a user and every file has an owner. Now we look at how Linux stores and enforces that. User accounts are listed in <C>/etc/passwd</C>, a plain text file that every user can read. Despite its name, it no longer contains passwords. Each line has seven fields separated by colons: username, a placeholder <C>x</C>, UID, primary GID (group ID), a comment (often the full name), the home directory and the login shell. Accounts with a shell like <C>/usr/sbin/nologin</C> are service accounts that cannot log in interactively.
        </P>
        <P>
          The actual password <strong>hashes</strong> live in <C>/etc/shadow</C>, which only root can read. A hash is a one-way fingerprint of the password: the system hashes what you type at login and compares fingerprints, so it never needs to store the password itself. Modern distributions such as Debian 12+, Ubuntu 22.04+ and current Kali use the <strong>yescrypt</strong> algorithm (hashes beginning with <C>$y$</C>), while older systems used SHA-512 crypt (<C>$6$</C>). If you can read shadow, you can try to crack those hashes offline, which is why a readable shadow file is a critical finding. Groups are defined in <C>/etc/group</C>.
        </P>
        <Pre label="ACCOUNT FILES AND IDENTITY COMMANDS">
{`$ grep -E '^(root|ghost|www-data)' /etc/passwd
root:x:0:0:root:/root:/bin/bash
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
ghost:x:1000:1000:Ghost Operator:/home/ghost:/bin/bash

$ sudo grep ghost /etc/shadow
ghost:$y$j9T$Qf2...trimmed...$Nn8.:20403:0:99999:7:::

$ id
uid=1000(ghost) gid=1000(ghost) groups=1000(ghost),4(adm),27(sudo)

$ whoami
ghost`}
        </Pre>
        <P>
          Notice the groups in that <C>id</C> output. Membership of <C>sudo</C> (or <C>wheel</C> on Red Hat-family systems) means the user can become root. Membership of <C>adm</C> allows reading most logs. Membership of <C>docker</C> or <C>lxd</C> is effectively root too, because those tools can mount the host&apos;s file system into a container. Group memberships are one of the first things to check on any system.
        </P>

        <H3>Reading Permissions: rwx</H3>
        <P>
          Every file carries three sets of permissions for three classes of people: the <strong>owner</strong> (user), the <strong>group</strong>, and <strong>others</strong> (everyone else). Each set contains three bits. <strong>r</strong> (read) lets you view a file&apos;s contents; <strong>w</strong> (write) lets you change it; <strong>x</strong> (execute) lets you run it as a program. On directories the meanings shift slightly: r lets you list the names inside, w lets you create, rename or delete entries, and x lets you enter the directory and reach files within it. A directory with x but no r is like a dark room: you can walk in and grab a file if you know its exact name, but you cannot see what is there.
        </P>
        <Pre label="DECODING A PERMISSION STRING">
{`-rwxr-x---  1  ghost  devs  8192  Nov 11 09:00  deploy.sh
|\\_/\\_/\\_/
| |  |  |
| |  |  +--- others: ---  no access
| |  +------ group (devs): r-x  read and execute
| +--------- owner (ghost): rwx  read, write, execute
+----------- type: - file, d directory, l symbolic link

Octal: each bit has a value   r = 4   w = 2   x = 1
  rwx = 4+2+1 = 7     r-x = 4+0+1 = 5     --- = 0
  so rwxr-x--- = 750`}
        </Pre>
        <Table
          headers={['Octal', 'Symbolic', 'Typical Use']}
          rows={[
            ['755', 'rwxr-xr-x', 'Programs and public directories'],
            ['644', 'rw-r--r--', 'Normal readable files, web pages'],
            ['700', 'rwx------', 'Private directories, personal scripts'],
            ['600', 'rw-------', 'Secrets: SSH private keys, .env files'],
            ['640', 'rw-r-----', 'Logs and configs readable by a group (e.g. /etc/shadow is 640 root:shadow)'],
            ['777', 'rwxrwxrwx', 'Everyone can do everything: almost always a misconfiguration'],
          ]}
        />

        <H3>Changing Permissions and Ownership</H3>
        <P>
          <C>chmod</C> changes permissions. You can use octal numbers (<C>chmod 600 id_rsa</C>) or symbolic notation, which names the class (u, g, o or a for all), an operator (+ to add, - to remove, = to set) and the bits: <C>chmod u+x script.sh</C> adds execute for the owner, <C>chmod go-w file</C> removes write from group and others. <C>chown</C> changes the owner and group (<C>chown alice:devs report.txt</C>) and normally requires root. The <C>umask</C> setting controls the default permissions new files receive; a common default of 022 produces 644 files and 755 directories.
        </P>
        <Note type="tip">
          SSH refuses to use a private key that other users can read. If you see the error &quot;UNPROTECTED PRIVATE KEY FILE&quot;, fix it with <C>chmod 600</C> on the key. You will hit this constantly when using keys found during engagements.
        </Note>

        <H3>Special Bits: SUID, SGID and Sticky</H3>
        <P>
          Three extra bits change the rules. <strong>SUID</strong> (set user ID) on an executable makes it run with the permissions of the file&apos;s <em>owner</em> rather than the person running it. The <C>passwd</C> command is SUID root so that normal users can update their own entry in the root-only shadow file. It shows as an <C>s</C> in the owner&apos;s execute slot: <C>-rwsr-xr-x</C>. <strong>SGID</strong> does the same with the group, and on a directory it makes new files inherit the directory&apos;s group. The <strong>sticky bit</strong> on a directory, shown as a <C>t</C>, means users can only delete their own files there; it is why everyone can write to <C>/tmp</C> but cannot delete each other&apos;s files.
        </P>
        <P>
          SUID is a double-edged sword. If a root-owned SUID program can be tricked into running a shell, reading arbitrary files or writing where it should not, any user becomes root. The community project GTFOBins catalogues how ordinary programs (find, vim, python, tar and many more) can be abused when they are SUID or allowed through sudo. Searching for SUID files is a standard privilege escalation check.
        </P>
        <Pre label="SPECIAL BITS">
{`$ ls -l /usr/bin/passwd
-rwsr-xr-x 1 root root 68208 Feb  6  2026 /usr/bin/passwd     # SUID root

$ ls -ld /tmp
drwxrwxrwt 18 root root 4096 Nov 11 09:30 /tmp                 # sticky bit

$ find / -perm -4000 -type f 2>/dev/null                       # list all SUID files
/usr/bin/passwd
/usr/bin/sudo
/usr/bin/mount
/usr/bin/su
/opt/backup/backup_tool        <-- unusual: investigate this one`}
        </Pre>

        <H3>sudo: Borrowing Root, Carefully</H3>
        <P>
          Logging in directly as root is discouraged; instead administrators use <strong>sudo</strong> (&quot;superuser do&quot;) to run individual commands with elevated rights. sudo asks for <em>your own</em> password, checks the rules in <C>/etc/sudoers</C> (edited safely with <C>visudo</C>) and files in <C>/etc/sudoers.d/</C>, then runs the command as root and logs it. Rules can be broad (<C>ghost ALL=(ALL:ALL) ALL</C>, meaning anything as anyone) or narrow (allow only <C>/usr/bin/systemctl restart nginx</C>). The <C>NOPASSWD</C> tag skips the password prompt.
        </P>
        <P>
          The command <C>sudo -l</C> lists exactly what the current user is allowed to run. For a penetration tester it is one of the first commands to type after gaining a shell, because a single permissive rule, such as allowing <C>vim</C>, <C>less</C>, <C>find</C> or a script the user can edit, often leads straight to root. For defenders, the same command is a quick audit of who holds which powers. Note that recent Ubuntu releases have begun shipping sudo-rs, a memory-safe Rust rewrite, but the commands and sudoers syntax you use remain the same.
        </P>
        <Pre label="SUDO IN PRACTICE">
{`$ sudo -l
Matching Defaults entries for ghost on ghost-lab:
    env_reset, mail_badpass, secure_path=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin

User ghost may run the following commands on ghost-lab:
    (root) NOPASSWD: /usr/bin/systemctl status *
    (root) NOPASSWD: /usr/bin/journalctl

$ sudo -i            # open a root shell (only if your rules allow it)
$ su - alice         # switch to another user (needs alice's password)`}
        </Pre>

        <H3>Processes and Signals</H3>
        <P>
          Building on Chapter 1, you inspect processes with <C>ps</C>. The incantation <C>ps aux</C> shows every process on the system with its owner, PID, CPU and memory usage and the full command line; <C>ps -ef</C> is the equivalent in a different style, and <C>ps auxf</C> draws the parent-child tree. <C>top</C> and the friendlier <C>htop</C> show a live view. Look for processes running as root that execute scripts you can write, processes with credentials in their command-line arguments, and anything running from odd places such as <C>/tmp</C> or <C>/dev/shm</C>.
        </P>
        <P>
          You control processes by sending <strong>signals</strong>. <C>kill PID</C> sends SIGTERM (15), a polite request to shut down cleanly. <C>kill -9 PID</C> sends SIGKILL, which the kernel enforces immediately and the process cannot catch. Ctrl+C sends SIGINT and Ctrl+Z sends SIGTSTP to pause a foreground job, which you can resume with <C>fg</C> or send to the background with <C>bg</C>. Appending <C>&amp;</C> to a command starts it in the background.
        </P>

        <H3>Services and systemd</H3>
        <P>
          A <strong>service</strong> (or daemon) is a long-running background process such as a web server, SSH server or database. Almost every mainstream distribution now uses <strong>systemd</strong> as its init system: the first process started by the kernel (PID 1), responsible for starting and supervising everything else. Services are defined in <strong>unit files</strong> under <C>/etc/systemd/system/</C> and <C>/usr/lib/systemd/system/</C>. A writable unit file, or a unit that runs a script you can modify, is a reliable path to root and a popular persistence spot for attackers. Scheduled tasks run through cron (<C>/etc/crontab</C>, <C>/etc/cron.d/</C>, <C>crontab -l</C>) or systemd timers (<C>systemctl list-timers</C>).
        </P>
        <Pre label="MANAGING SERVICES">
{`$ systemctl status ssh               # is it running? recent log lines
$ sudo systemctl start nginx         # start now
$ sudo systemctl enable nginx        # start at every boot
$ sudo systemctl stop apache2
$ systemctl list-units --type=service --state=running
$ systemctl cat ssh                  # show the unit file

$ journalctl -u ssh --since "1 hour ago"   # logs for one service
$ journalctl -p err -b                     # errors since this boot
$ journalctl -f                            # follow all logs live`}
        </Pre>

        <H3>Installing Software: Package Managers</H3>
        <P>
          Linux software is installed from <strong>repositories</strong>, curated online collections of signed packages, by a <strong>package manager</strong>. The manager resolves dependencies, verifies cryptographic signatures and tracks every file it installs, which makes updating the whole system a single command. Keeping packages current is one of the most effective security controls there is, because a large share of real-world compromises exploit vulnerabilities that already have a patch.
        </P>
        <Table
          headers={['Family', 'Distributions', 'Update Everything', 'Install', 'Search']}
          rows={[
            ['apt (.deb)', 'Debian, Ubuntu, Kali, Parrot', 'sudo apt update && sudo apt full-upgrade', 'sudo apt install nmap', 'apt search nmap'],
            ['dnf (.rpm)', 'Fedora, RHEL, Rocky, Alma', 'sudo dnf upgrade', 'sudo dnf install nmap', 'dnf search nmap'],
            ['pacman', 'Arch, BlackArch', 'sudo pacman -Syu', 'sudo pacman -S nmap', 'pacman -Ss nmap'],
            ['apk', 'Alpine (common in containers)', 'apk update && apk upgrade', 'apk add nmap', 'apk search nmap'],
          ]}
        />

        <H3>Logs: The System&apos;s Memory</H3>
        <P>
          Logs record what happened, and they are the defender&apos;s primary evidence. Traditionally, text logs are written under <C>/var/log</C> by a syslog daemon (rsyslog), while systemd keeps its own binary journal that you read with <C>journalctl</C>. Be aware that some distributions, including Debian 12 and later, no longer install rsyslog by default, so files like <C>auth.log</C> may not exist and the journal is the source of truth. Reading most logs requires root or membership of the <C>adm</C> group.
        </P>
        <Table
          headers={['Log', 'Contents']}
          rows={[
            ['/var/log/auth.log (Debian/Ubuntu)', 'Logins, SSH attempts, sudo usage, su, user changes'],
            ['/var/log/secure (RHEL family)', 'The same authentication events on Red Hat-style systems'],
            ['/var/log/syslog or /var/log/messages', 'General system messages'],
            ['/var/log/kern.log', 'Kernel messages'],
            ['/var/log/apache2/, /var/log/nginx/', 'Web server access and error logs'],
            ['/var/log/wtmp, /var/log/btmp', 'Binary records of logins and failed logins (read with last and lastb)'],
          ]}
        />
        <Pre label="READING AUTHENTICATION EVIDENCE">
{`$ sudo grep "Failed password" /var/log/auth.log | tail -3
Nov 11 03:14:07 ghost-lab sshd[4410]: Failed password for root from 203.0.113.50 port 51122 ssh2
Nov 11 03:14:09 ghost-lab sshd[4410]: Failed password for root from 203.0.113.50 port 51122 ssh2
Nov 11 03:14:12 ghost-lab sshd[4412]: Failed password for invalid user admin from 203.0.113.50 port 51130 ssh2

$ journalctl -u ssh | grep "Accepted"          # the journal equivalent
$ last -n 5                                    # recent successful logins`}
        </Pre>
        <Note type="warn">
          Attackers know logs are evidence, so clearing or editing them is a common anti-forensics move. That is why serious environments ship logs off the machine in real time to a SIEM. A suddenly empty <C>auth.log</C> is itself a red flag.
        </Note>
      </div>
    ),
  },

  {
    id: 'networking-1',
    title: 'Networking I: Models, Addresses, Subnets and Routing',
    difficulty: 'BEGINNER',
    readTime: '13 min',
    takeaways: [
      'Networking is layered. The OSI model has 7 conceptual layers; the TCP/IP model that the internet actually runs on has 4. Each layer wraps the one above it (encapsulation).',
      'An IPv4 address is 32 bits. CIDR notation like /24 says how many bits identify the network; a /24 holds 256 addresses, 254 usable for hosts.',
      'Private ranges (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16) are not routable on the internet; NAT translates them to a public address.',
      'MAC addresses identify network cards on the local link. ARP maps IP addresses to MAC addresses and has no authentication, which enables ARP spoofing.',
      'Routers forward packets between networks using routing tables. Traffic for any network you do not have a specific route for goes to the default gateway.',
    ],
    content: (
      <div>
        <Key items={[
          <><strong>Layers</strong> (TCP/IP model): each wraps the one above &mdash; link &rarr; IP &rarr; transport &rarr; application</>,
          <><strong>IP address</strong> identifies a host (IPv4 like <C>192.168.1.10</C>, plus IPv6); private vs public ranges matter</>,
          <><strong>Subnets + CIDR</strong> (<C>/24</C>) split a network; the <strong>mask</strong> says which part is network vs host</>,
          <><strong>Routing</strong> moves packets between networks through gateways; your <strong>default gateway</strong> is the way out</>,
          <><strong>MAC</strong> (layer 2) vs <strong>IP</strong> (layer 3); <strong>ARP</strong> maps IP&rarr;MAC on the local network</>,
        ]} />
        <Local>An <strong>IP address</strong> is like a postal address &mdash; &quot;House 12, Juja Road&quot;. A <strong>MAC address</strong> is the specific person who physically lives at that gate. <strong>ARP</strong> is shouting down the street &quot;who actually stays at House 12?&quot; before you hand over the parcel &mdash; which is exactly why ARP can be spoofed (MOD-08): lie about who lives there and the parcels come to you.</Local>
        <H3>Why Networking Is Non-Negotiable</H3>
        <P>
          Almost every attack crosses a network. Scanning, phishing, web exploitation, lateral movement and data exfiltration are all network events, and most defensive tooling (firewalls, intrusion detection, packet capture) lives there too. If you cannot say how a packet gets from your laptop to a server, you will not understand why a scan result looks the way it does, why a firewall rule failed, or how an attacker pivoted through a network. These two networking chapters give you that model.
        </P>

        <H3>Layers: OSI and TCP/IP</H3>
        <P>
          Networking is complicated, so engineers split it into <strong>layers</strong>, each solving one problem and relying on the layer below. The postal system is a good analogy. You write a letter (the application data), put it in an envelope with an address (network layer), the post office puts that envelope in a sack for a particular truck (data link layer), and the truck drives on a road (physical layer). Each stage only cares about its own job.
        </P>
        <P>
          The <strong>OSI model</strong> is a seven-layer teaching framework. The internet actually runs on the simpler <strong>TCP/IP model</strong>, which merges some OSI layers. You need to know both, because people say things like &quot;a layer 2 attack&quot; (meaning the local link, MAC addresses and switches) or &quot;a layer 7 firewall&quot; (meaning one that understands application protocols like HTTP).
        </P>
        <Table
          headers={['OSI Layer', 'TCP/IP Layer', 'Unit', 'Examples', 'Security Examples']}
          rows={[
            ['7 Application', 'Application', 'Data', 'HTTP, DNS, SMTP, SSH, SMB', 'SQL injection, phishing, DNS tunnelling'],
            ['6 Presentation', 'Application', 'Data', 'Encoding, TLS encryption, compression', 'Weak TLS configuration'],
            ['5 Session', 'Application', 'Data', 'Session setup and teardown', 'Session hijacking'],
            ['4 Transport', 'Transport', 'Segment / Datagram', 'TCP, UDP, ports', 'Port scanning, SYN floods'],
            ['3 Network', 'Internet', 'Packet', 'IP, ICMP, routing', 'IP spoofing, ICMP tunnelling'],
            ['2 Data Link', 'Link', 'Frame', 'Ethernet, Wi-Fi, MAC, ARP, switches', 'ARP spoofing, MAC flooding, VLAN hopping'],
            ['1 Physical', 'Link', 'Bits', 'Cables, radio, fibre', 'Wiretapping, jamming, rogue devices'],
          ]}
        />
        <P>
          As data travels down the layers on the sender, each layer adds its own <strong>header</strong> in front of what it received. This wrapping is called <strong>encapsulation</strong>. The receiver strips the headers off in reverse order. When you open a packet in Wireshark (MOD-08), you see exactly these nested headers.
        </P>
        <Pre label="ENCAPSULATION OF ONE WEB REQUEST">
{`Application:   [ HTTP: GET /index.html Host: example.com ]
Transport:     [ TCP hdr: src port 51544 -> dst port 443 ][ HTTP data ]
Internet:      [ IP hdr: 192.168.1.20 -> 203.0.113.10 ][ TCP ][ HTTP ]
Link:          [ Ethernet hdr: aa:bb:cc:11:22:33 -> router MAC ][ IP ][ TCP ][ HTTP ][ FCS ]
Physical:      0110100101110010...  (electrical signals or radio waves)`}
        </Pre>

        <H3>IP Addresses</H3>
        <P>
          An <strong>IP address</strong> identifies a device&apos;s network interface, like a postal address identifies a house. An <strong>IPv4</strong> address is a 32-bit number, written for humans as four decimal numbers from 0 to 255 separated by dots, called <strong>octets</strong> because each is 8 bits: <C>192.168.1.20</C>. 32 bits allows about 4.3 billion addresses, which the world ran out of years ago. <strong>IPv6</strong> uses 128 bits, written in hexadecimal groups such as <C>2001:db8::1</C>, and provides an effectively unlimited supply. IPv6 now carries a large share of internet traffic, and attackers like it because defenders often forget to filter or monitor it.
        </P>
        <Table
          headers={['Range', 'Purpose']}
          rows={[
            ['10.0.0.0/8', 'Private (RFC 1918): large organisations, VPNs, cloud VPCs'],
            ['172.16.0.0/12', 'Private (172.16.0.0 to 172.31.255.255): Docker uses 172.17.0.0/16 by default'],
            ['192.168.0.0/16', 'Private: home and small office networks'],
            ['127.0.0.0/8', 'Loopback: 127.0.0.1 is always this machine ("localhost")'],
            ['169.254.0.0/16', 'Link-local: self-assigned when DHCP fails; also the cloud metadata address 169.254.169.254'],
            ['100.64.0.0/10', 'Carrier-grade NAT: used by ISPs and mobile networks, and by Tailscale'],
            ['192.0.2.0/24, 198.51.100.0/24, 203.0.113.0/24', 'Reserved for documentation and examples, never on the real internet'],
          ]}
        />
        <Note type="info">
          The address <C>169.254.169.254</C> deserves special attention. In AWS, Azure and GCP it serves instance metadata, sometimes including temporary credentials. Server-side request forgery (MOD-06) and cloud attacks (MOD-09) frequently target it.
        </Note>

        <H3>Subnets and CIDR</H3>
        <P>
          An IP address has two parts: the <strong>network</strong> portion, shared by every device on the same subnet, and the <strong>host</strong> portion, unique to each device. Think of it as a street name and a house number. The <strong>subnet mask</strong> says where the split falls. Modern notation is <strong>CIDR</strong> (Classless Inter-Domain Routing): a slash followed by the number of network bits. <C>192.168.1.0/24</C> means the first 24 bits (the first three octets) are the network, leaving 8 bits for hosts.
        </P>
        <P>
          The arithmetic is simple. A subnet with <C>n</C> network bits has 32 minus n host bits, and 2 to the power of that many addresses. In each IPv4 subnet, the first address is the <strong>network address</strong> and the last is the <strong>broadcast address</strong> (which reaches every host on the subnet), so usable hosts are the total minus 2. You will calculate this constantly when scoping scans: scanning a /16 means 65,536 addresses, a very different job from a /24.
        </P>
        <Pre label="WORKING OUT A /24 AND A /26">
{`192.168.1.0/24
  mask:        255.255.255.0
  host bits:   32 - 24 = 8   ->  2^8 = 256 addresses
  network:     192.168.1.0
  usable:      192.168.1.1  -  192.168.1.254   (254 hosts)
  broadcast:   192.168.1.255

10.10.5.64/26
  mask:        255.255.255.192
  host bits:   32 - 26 = 6   ->  2^6 = 64 addresses
  network:     10.10.5.64
  usable:      10.10.5.65   -  10.10.5.126     (62 hosts)
  broadcast:   10.10.5.127

$ ipcalc 10.10.5.64/26      # or let a tool do it`}
        </Pre>
        <Table
          headers={['CIDR', 'Mask', 'Addresses', 'Usable Hosts', 'Typical Use']}
          rows={[
            ['/32', '255.255.255.255', '1', '1 (single host)', 'Firewall rule for one IP'],
            ['/30', '255.255.255.252', '4', '2', 'Point-to-point link between routers'],
            ['/28', '255.255.255.240', '16', '14', 'Small server segment, DMZ'],
            ['/24', '255.255.255.0', '256', '254', 'Typical office or home LAN'],
            ['/16', '255.255.0.0', '65,536', '65,534', 'Large site, cloud VPC'],
            ['/8', '255.0.0.0', '16,777,216', '16,777,214', 'The whole 10.x private range'],
          ]}
        />

        <H3>MAC Addresses and ARP</H3>
        <P>
          IP addresses get packets across networks, but on the local link (one Ethernet segment or one Wi-Fi network) devices actually deliver frames using <strong>MAC addresses</strong>. A MAC address is a 48-bit hardware identifier written as six hex pairs, such as <C>3c:22:fb:9a:10:4e</C>. The first three bytes, the <strong>OUI</strong>, identify the manufacturer, which helps when fingerprinting devices on a network. MACs are not secret and are easy to change in software; modern phones and laptops randomise them on Wi-Fi for privacy. A <strong>switch</strong> learns which MAC sits on which port and forwards frames only where they need to go.
        </P>
        <P>
          When your laptop wants to send to <C>192.168.1.1</C> on the same subnet, it needs that device&apos;s MAC. It broadcasts an <strong>ARP</strong> (Address Resolution Protocol) request, &quot;who has 192.168.1.1?&quot;, and the owner replies with its MAC. The answer is cached. Crucially, ARP has <strong>no authentication</strong>: any device can claim to be any IP. An attacker who sends forged ARP replies claiming to be the gateway can sit in the middle of everyone&apos;s traffic. This is <strong>ARP spoofing</strong>, a classic man-in-the-middle attack covered in MOD-08. (IPv6 replaces ARP with Neighbour Discovery, which has the same weakness.)
        </P>
        <Pre label="SEEING ADDRESSES AND THE ARP CACHE">
{`$ ip a
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 state UP
    link/ether 08:00:27:4e:66:a1 brd ff:ff:ff:ff:ff:ff
    inet 10.10.0.15/24 brd 10.10.0.255 scope global dynamic eth0
    inet6 fe80::a00:27ff:fe4e:66a1/64 scope link

$ ip neigh                       # the ARP / neighbour cache
10.10.0.1 dev eth0 lladdr 52:54:00:12:35:02 REACHABLE
10.10.0.53 dev eth0 lladdr 52:54:00:9c:41:07 STALE`}
        </Pre>

        <H3>Routing and the Default Gateway</H3>
        <P>
          If the destination is on your own subnet, your machine delivers directly using ARP. If not, it hands the packet to a <strong>router</strong>, a device connected to several networks whose job is to forward packets toward their destination. Every host has a <strong>routing table</strong>, a list of rules saying which networks are reachable through which interface or next hop. The catch-all entry is the <strong>default route</strong> (0.0.0.0/0), pointing at the <strong>default gateway</strong>, usually your home router or the office firewall. Each router along the path makes its own decision, hop by hop, until the packet arrives. The IP header carries a <strong>TTL</strong> (time to live) that every router decreases by one; when it hits zero the packet is dropped, which stops packets looping forever and, as we will see, makes traceroute possible.
        </P>
        <Pre label="THE ROUTING TABLE">
{`$ ip route
default via 10.10.0.1 dev eth0 proto dhcp metric 100
10.10.0.0/24 dev eth0 proto kernel scope link src 10.10.0.15
172.17.0.0/16 dev docker0 proto kernel scope link src 172.17.0.1

# 10.10.0.x       -> delivered directly on eth0
# 172.17.0.x      -> Docker containers on this host
# everything else -> sent to the gateway 10.10.0.1`}
        </Pre>
        <P>
          For attackers, routing tables reveal what a compromised machine can reach. A server with a second interface into an internal network becomes a <strong>pivot point</strong>, a bridge into networks you cannot reach directly. MOD-08 covers pivoting and tunnelling in detail.
        </P>

        <H3>NAT: Sharing One Public Address</H3>
        <P>
          Private addresses cannot travel on the public internet, yet your home devices browse the web. The trick is <strong>NAT</strong> (Network Address Translation). Your router has one public IP from your ISP. When a device sends traffic out, the router rewrites the source address to its public IP and a unique source port, records the mapping in a table, and reverses the translation for the replies. This port-based form is called PAT or NAT overload. Many ISPs and most mobile networks add another layer, carrier-grade NAT, so dozens of customers share one public address.
        </P>
        <P>
          NAT has a side effect that matters for security: devices behind it cannot be reached from outside unless someone deliberately creates a <strong>port forward</strong>. That is why attackers usually rely on <strong>reverse shells</strong>, where the victim connects outward to the attacker, rather than connecting inward. It is also why NAT is often mistaken for a firewall. It is not one: it hides addresses but does not inspect traffic, and outbound connections from compromised hosts pass through freely.
        </P>
        <Pre label="NAT TRANSLATION TABLE (CONCEPTUAL)">
{`Inside host          Inside port   ->  Public IP        Public port   Destination
192.168.1.20         51544             41.90.12.7       40001         203.0.113.10:443
192.168.1.33         60210             41.90.12.7       40002         142.250.72.14:443
192.168.1.20         51545             41.90.12.7       40003         1.1.1.1:53

Reply arrives at 41.90.12.7:40002  ->  router looks up table  ->  192.168.1.33:60210`}
        </Pre>
      </div>
    ),
  },

  {
    id: 'networking-2',
    title: 'Networking II: TCP, UDP, Ports, DNS and the Tools',
    difficulty: 'BEGINNER',
    readTime: '13 min',
    labLink: '/modules/foundations/lab',
    takeaways: [
      'TCP is connection-oriented and reliable (handshake, ordering, retransmission); UDP is connectionless and fast. DNS queries, DHCP, VoIP and QUIC use UDP.',
      'A port (0 to 65535) identifies a service on a host. An IP plus a port plus a protocol is a socket. Ports below 1024 are well-known.',
      'The TCP three-way handshake is SYN, SYN-ACK, ACK. Port scanners read these replies: SYN-ACK means open, RST means closed, silence usually means filtered.',
      'DNS translates names to addresses through a chain of resolvers and authoritative servers. Record types (A, AAAA, MX, TXT, CNAME, NS, PTR) leak a lot of useful information.',
      'DHCP hands out addresses automatically (Discover, Offer, Request, Acknowledge) and is unauthenticated, enabling rogue DHCP attacks.',
      'Core tools: ip, ping, traceroute, ss, dig, curl and nc. Learn what their output means and you can diagnose almost anything.',
    ],
    content: (
      <div>
        <Key items={[
          <><strong>TCP</strong> = reliable, ordered, connection-based (3-way handshake: SYN &rarr; SYN-ACK &rarr; ACK). Used for web, SSH, email</>,
          <><strong>UDP</strong> = fast, no guarantees, no handshake. Used for DNS, voice/video, games</>,
          <><strong>Ports</strong> (0&ndash;65535) pick the service: 80 HTTP, 443 HTTPS, 22 SSH, 53 DNS, 3389 RDP</>,
          <><strong>DNS</strong> turns names (<C>example.com</C>) into IPs &mdash; the internet&apos;s phonebook</>,
          <><strong>Tools:</strong> <C>ping</C>, <C>traceroute</C>, <C>ss</C>/<C>netstat</C>, <C>dig</C>/<C>nslookup</C>, and <C>nmap</C> for scanning</>,
        ]} />
        <Local>Asking <strong>DNS</strong> to resolve a name is like asking a boda rider for a place by landmark: you say &quot;Naivas, Kilimani&quot; and he instantly knows the exact plot and road. Poison that answer (MOD-08) and the rider cheerfully drops you at the wrong gate &mdash; which is how phishing and man-in-the-middle attacks begin.</Local>
        <H3>The Transport Layer: TCP and UDP</H3>
        <P>
          IP gets a packet to the right machine. But a single machine may run a web server, an SSH server and a database at the same time, and the operating system needs to know which program each packet is for. That is the job of the transport layer, and it offers two main protocols with very different personalities.
        </P>
        <P>
          <strong>TCP</strong> (Transmission Control Protocol) is like a phone call. Before any data flows, both sides set up a connection. Every byte is numbered with a <strong>sequence number</strong>, the receiver acknowledges what arrived, lost data is retransmitted, and the application receives everything in order. That reliability costs time and overhead, but it is exactly what you want for web pages, file transfers, email and remote shells. <strong>UDP</strong> (User Datagram Protocol) is like posting postcards. Each message (a datagram) is sent on its own with no connection, no acknowledgement and no guarantee of delivery or order. It is fast and lightweight, ideal for DNS lookups, voice and video calls, online games and DHCP. <strong>QUIC</strong>, the transport beneath HTTP/3, runs over UDP and builds its own reliability and encryption on top, so a growing share of web traffic now travels over UDP port 443.
        </P>
        <Table
          headers={['Property', 'TCP', 'UDP']}
          rows={[
            ['Connection', 'Yes: three-way handshake first', 'No: just send'],
            ['Reliability', 'Acknowledgements and retransmission', 'None built in'],
            ['Ordering', 'Guaranteed', 'Not guaranteed'],
            ['Header size', '20 to 60 bytes', '8 bytes'],
            ['Typical uses', 'HTTP/1.1 and HTTP/2, SSH, SMTP, SMB, RDP, databases', 'DNS, DHCP, NTP, SNMP, VoIP, QUIC/HTTP3'],
            ['Scanning', 'Fast and reliable to scan', 'Slow and ambiguous to scan (no reply can mean open or filtered)'],
          ]}
        />

        <H3>Ports and Sockets</H3>
        <P>
          A <strong>port</strong> is a 16-bit number, from 0 to 65535, that identifies a specific service on a host. If an IP address is the address of an office building, the port is the room number. Servers <strong>listen</strong> on fixed, well-known ports so clients know where to knock: web servers on 80 and 443, SSH on 22. Clients use a random high <strong>ephemeral port</strong> (on Linux typically 32768 to 60999) as their return address. The combination of IP address, port and protocol is called a <strong>socket</strong>, and a connection is uniquely identified by the source IP and port plus the destination IP and port.
        </P>
        <P>
          Ports 0 to 1023 are the <strong>well-known ports</strong>, and on Linux binding to them traditionally requires root. 1024 to 49151 are registered ports used by many applications. Services can run on any port, so never assume a port number proves what is listening: SSH on port 2222 or a web admin panel on 8443 are both common. Tools like nmap probe the service itself to identify it.
        </P>
        <Table
          headers={['Port', 'Protocol', 'Service', 'Why It Matters']}
          rows={[
            ['21', 'TCP', 'FTP', 'Cleartext credentials; anonymous login misconfigurations'],
            ['22', 'TCP', 'SSH', 'Remote shell; brute-force target; key-based access'],
            ['23', 'TCP', 'Telnet', 'Cleartext remote shell; still found on IoT and network gear'],
            ['25 / 587', 'TCP', 'SMTP', 'Email sending; open relays; user enumeration'],
            ['53', 'UDP/TCP', 'DNS', 'Name resolution; zone transfers over TCP; tunnelling'],
            ['67 / 68', 'UDP', 'DHCP', 'Address assignment; rogue DHCP servers'],
            ['80 / 443', 'TCP (443 also UDP)', 'HTTP / HTTPS', 'The web: the biggest attack surface on the internet'],
            ['88', 'TCP/UDP', 'Kerberos', 'Active Directory authentication (MOD-05)'],
            ['110 / 143', 'TCP', 'POP3 / IMAP', 'Mailbox access'],
            ['135 / 139 / 445', 'TCP', 'MS-RPC / NetBIOS / SMB', 'Windows file sharing; historic worms like WannaCry'],
            ['161', 'UDP', 'SNMP', 'Device management; default community strings like "public"'],
            ['389 / 636', 'TCP', 'LDAP / LDAPS', 'Directory queries; AD enumeration'],
            ['1433 / 3306 / 5432', 'TCP', 'MSSQL / MySQL / PostgreSQL', 'Databases that should never face the internet'],
            ['3389', 'TCP/UDP', 'RDP', 'Windows remote desktop; heavily brute-forced'],
            ['5985 / 5986', 'TCP', 'WinRM', 'PowerShell remoting; lateral movement'],
            ['6379', 'TCP', 'Redis', 'Often exposed without authentication'],
            ['8080 / 8443', 'TCP', 'Alternate HTTP(S)', 'Admin panels, proxies, dev servers'],
          ]}
        />

        <H3>The TCP Three-Way Handshake</H3>
        <P>
          Every TCP connection starts with the same three-message exchange. The client sends a <strong>SYN</strong> (synchronise) segment with a random starting sequence number. The server replies with <strong>SYN-ACK</strong>, acknowledging the client&apos;s number and offering its own. The client answers with an <strong>ACK</strong>, and the connection is established. Connections end with <strong>FIN</strong> segments for a graceful close, or abruptly with an <strong>RST</strong> (reset). These one-bit signals in the TCP header are called <strong>flags</strong>.
        </P>
        <Pre label="HANDSHAKE AND WHAT A SCANNER LEARNS">
{`  Client 10.10.0.15:51544                     Server 10.10.0.80:22
        |  ---- SYN  seq=1000 ------------------->  |
        |  <--- SYN-ACK  seq=5000 ack=1001 -------  |
        |  ---- ACK  ack=5001 ------------------->  |
        |       connection ESTABLISHED              |

Port scanner logic (nmap -sS, the "half-open" SYN scan):
  send SYN  ->  SYN-ACK back   =  port OPEN      (scanner sends RST, never completes)
  send SYN  ->  RST back       =  port CLOSED    (host is up, nothing listening)
  send SYN  ->  no reply       =  FILTERED       (a firewall dropped it)`}
        </Pre>
        <P>
          This is why understanding the handshake is the foundation of scanning. It also explains the <strong>SYN flood</strong>, a denial-of-service attack that sends huge numbers of SYNs without completing the handshake, filling the server&apos;s table of half-open connections. SYN cookies are the standard defence.
        </P>

        <H3>DNS: The Internet&apos;s Phone Book</H3>
        <P>
          Humans remember names like <C>example.com</C>; computers route by IP address. The <strong>Domain Name System</strong> translates between them. Names form a hierarchy read from right to left: the root (an invisible dot at the end), then a top-level domain (TLD) such as <C>.com</C> or <C>.ke</C>, then a domain like <C>example.com</C>, then subdomains like <C>mail.example.com</C>.
        </P>
        <P>
          When you look up a name, your machine asks a <strong>recursive resolver</strong>, usually run by your ISP, your company or a public service such as 1.1.1.1 or 8.8.8.8. If the answer is not cached, the resolver walks the hierarchy: it asks a <strong>root server</strong> who handles <C>.com</C>, asks the <C>.com</C> TLD servers who handles <C>example.com</C>, then asks that domain&apos;s <strong>authoritative name server</strong> for the final answer. Each answer carries a <strong>TTL</strong> saying how long it may be cached. Classic DNS travels unencrypted over UDP port 53, so anyone on the path can see and potentially tamper with lookups. DNS over HTTPS (DoH) and DNS over TLS (DoT) encrypt queries, and DNSSEC adds signatures that prove answers are authentic.
        </P>
        <Table
          headers={['Record', 'Meaning', 'Example Value', 'Recon Value']}
          rows={[
            ['A', 'Name to IPv4 address', '203.0.113.10', 'Where the host lives'],
            ['AAAA', 'Name to IPv6 address', '2001:db8::10', 'IPv6 hosts often have weaker filtering'],
            ['CNAME', 'Alias to another name', 'shop -> shops.myshopify.com', 'Reveals third-party services; subdomain takeover'],
            ['MX', 'Mail servers for the domain', '10 mail.example.com', 'Email provider, phishing targets'],
            ['TXT', 'Free text', 'v=spf1 include:_spf.google.com ~all', 'SPF, DMARC, domain verification tokens'],
            ['NS', 'Authoritative name servers', 'ns1.cloudflare.com', 'DNS provider, zone transfer attempts'],
            ['PTR', 'Reverse lookup: IP to name', '10.113.0.203.in-addr.arpa -> web01', 'Naming conventions inside networks'],
            ['SOA', 'Zone authority and settings', 'serial, refresh, admin contact', 'Admin email, zone metadata'],
          ]}
        />
        <Pre label="QUERYING DNS WITH DIG">
{`$ dig example.com A +short
203.0.113.10

$ dig example.com MX +short
10 mail.example.com.

$ dig @1.1.1.1 example.com TXT        # ask a specific resolver
$ dig -x 203.0.113.10 +short          # reverse lookup
$ dig axfr @ns1.example.com example.com   # zone transfer: should be refused`}
        </Pre>
        <Note type="warn">
          A successful zone transfer (AXFR) hands an attacker every record in the zone, a full map of internal hostnames. It is a misconfiguration that still turns up in real assessments. OSINT (MOD-02) relies heavily on DNS reconnaissance.
        </Note>

        <H3>DHCP: Getting an Address Automatically</H3>
        <P>
          When you join a network you never type an IP address; <strong>DHCP</strong> (Dynamic Host Configuration Protocol) assigns one. The exchange has four steps, remembered as <strong>DORA</strong>: the client broadcasts a <strong>Discover</strong>, a server replies with an <strong>Offer</strong>, the client sends a <strong>Request</strong> for that offer, and the server confirms with an <strong>Acknowledge</strong>. Along with the IP address, DHCP supplies the subnet mask, the default gateway and the DNS servers, and the address is leased for a limited time. Like ARP, DHCP has no authentication. A <strong>rogue DHCP server</strong> on a network can hand out itself as the gateway or DNS server and quietly redirect victims&apos; traffic. Switches defend against this with a feature called DHCP snooping.
        </P>

        <H3>The Diagnostic Toolkit</H3>
        <P>
          <strong>ping</strong> sends ICMP echo requests and reports whether replies come back and how long the round trip took. A reply proves the host is up; no reply proves nothing, because many firewalls block ICMP. On Linux, ping runs forever until Ctrl+C, so use <C>-c 4</C> to send four packets. <strong>traceroute</strong> (or <C>tracepath</C>, and <C>tracert</C> on Windows) maps the routers along a path by sending packets with TTL 1, 2, 3 and so on, and recording which router reports each expiry.
        </P>
        <Pre label="PING AND TRACEROUTE">
{`$ ping -c 4 10.10.0.1
PING 10.10.0.1 (10.10.0.1) 56(84) bytes of data.
64 bytes from 10.10.0.1: icmp_seq=1 ttl=64 time=0.412 ms
64 bytes from 10.10.0.1: icmp_seq=2 ttl=64 time=0.388 ms
64 bytes from 10.10.0.1: icmp_seq=3 ttl=64 time=0.401 ms
64 bytes from 10.10.0.1: icmp_seq=4 ttl=64 time=0.395 ms
--- 10.10.0.1 ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3004ms

# TTL hint: replies near 64 usually mean Linux/macOS, near 128 Windows,
# near 255 network equipment (the starting value minus hops travelled)

$ traceroute -n 1.1.1.1
 1  10.10.0.1      0.5 ms
 2  41.90.12.1     4.1 ms
 3  196.49.14.2    6.8 ms
 4  1.1.1.1        7.2 ms`}
        </Pre>
        <P>
          <strong>ss</strong> (socket statistics) shows which ports your machine is listening on and which connections are open. It replaced the older <strong>netstat</strong>, which still works on many systems and is the standard tool on Windows (<C>netstat -ano</C>). The flags <C>-tulpn</C> are worth memorising: TCP, UDP, listening sockets only, show the owning process, and numeric output instead of names. Showing processes owned by other users requires sudo. A service listening on <C>0.0.0.0</C> accepts connections on every interface, while <C>127.0.0.1</C> means local only, a distinction that matters enormously for exposure.
        </P>
        <Pre label="WHAT IS LISTENING?">
{`$ sudo ss -tulpn
Netid State  Local Address:Port  Peer Address:Port Process
udp   UNCONN 127.0.0.53%lo:53         0.0.0.0:*     users:(("systemd-resolve",pid=512,fd=13))
tcp   LISTEN 0.0.0.0:22               0.0.0.0:*     users:(("sshd",pid=801,fd=3))
tcp   LISTEN 127.0.0.1:3306           0.0.0.0:*     users:(("mysqld",pid=944,fd=21))
tcp   LISTEN 0.0.0.0:8000             0.0.0.0:*     users:(("python3",pid=1337,fd=3))

# sshd on all interfaces: expected
# MySQL on localhost only: good, not reachable from the network
# python3 on 0.0.0.0:8000: who started that, and why?`}
        </Pre>
        <P>
          <strong>curl</strong> makes requests to URLs and prints the response; with <C>-I</C> it fetches only headers, with <C>-v</C> it shows the whole conversation, including the TLS handshake. <strong>nc</strong> (netcat) opens raw TCP or UDP connections and is nicknamed the Swiss Army knife of networking: it can test whether a port is open, grab a service banner, transfer files or catch a reverse shell.
        </P>
        <Pre label="CURL AND NETCAT">
{`$ curl -I https://example.com
HTTP/2 200
content-type: text/html; charset=UTF-8
server: nginx
...

$ nc -vz 10.10.0.80 22          # is port 22 open?
Connection to 10.10.0.80 22 port [tcp/ssh] succeeded!

$ nc 10.10.0.80 22              # grab the banner
SSH-2.0-OpenSSH_9.6p1 Ubuntu-3ubuntu13.5`}
        </Pre>
        <Table
          headers={['Task', 'Linux', 'Windows']}
          rows={[
            ['Show my IP addresses', 'ip a', 'ipconfig /all'],
            ['Show routes', 'ip route', 'route print'],
            ['ARP / neighbour cache', 'ip neigh', 'arp -a'],
            ['Listening ports', 'ss -tulpn', 'netstat -ano'],
            ['DNS lookup', 'dig, host', 'nslookup, Resolve-DnsName'],
            ['Trace route', 'traceroute, tracepath', 'tracert'],
            ['Test a TCP port', 'nc -vz host port', 'Test-NetConnection host -Port port'],
          ]}
        />
      </div>
    ),
  },

  {
    id: 'how-the-web-works',
    title: 'How the Web Works: HTTP, Cookies, Sessions and TLS',
    difficulty: 'BEGINNER',
    readTime: '12 min',
    labLink: '/modules/foundations/lab',
    takeaways: [
      'HTTP is a text-based request/response protocol. A request has a method, a path, headers and an optional body; a response has a status code, headers and a body.',
      'Status code families: 2xx success, 3xx redirect, 4xx client error, 5xx server error. 401 means not authenticated, 403 means authenticated but not allowed.',
      'HTTP is stateless. Cookies, usually holding a session ID or a token, are how a site remembers you, which makes stealing them equivalent to stealing the login.',
      'Cookie flags matter: HttpOnly blocks JavaScript access, Secure forces HTTPS, SameSite limits cross-site sending.',
      'HTTPS is HTTP inside TLS. TLS gives confidentiality, integrity and server authentication through certificates signed by trusted CAs. It does not make the application itself safe.',
      'Browser devtools (F12) let you see and modify every request, cookie and response, and they are the first web-hacking tool you should master.',
    ],
    content: (
      <div>
        <Key items={[
          <><strong>HTTP</strong> is request &rarr; response: methods (<C>GET</C>, <C>POST</C>), status codes (200, 404, 500), and headers</>,
          <>The web is <strong>stateless</strong> &mdash; <strong>cookies</strong> + <strong>sessions</strong> are what remember you between requests</>,
          <>A <strong>session token</strong> in a cookie is your temporary ID card; stealing it = impersonation (MOD-06)</>,
          <><strong>TLS</strong> (the <C>s</C> in https) encrypts the channel so nobody on the path can read or tamper</>,
          <><strong>URL</strong> = <C>scheme://host/path?query</C> &mdash; every part is attacker-relevant</>,
        ]} />
        <Local>A <strong>session cookie</strong> is the wristband you get at a concert. After the gate checks your ticket once, the guards only glance at the band every time you re-enter &mdash; not your ID. That is convenient, but it means anyone who slips off your band walks in <em>as you</em>. Session hijacking is exactly that: steal the band, skip the ticket.</Local>
        <H3>Clients, Servers and URLs</H3>
        <P>
          The web is a conversation between <strong>clients</strong> (usually browsers, but also apps, scripts and curl) and <strong>servers</strong>. The client asks for a resource; the server answers. Every resource has a <strong>URL</strong> (Uniform Resource Locator), and every part of a URL is something an attacker may manipulate.
        </P>
        <Pre label="ANATOMY OF A URL">
{`https://shop.example.com:443/products/view?id=42&sort=price#reviews
\\___/   \\______________/ \\_/\\____________/ \\______________/ \\_____/
scheme      host        port     path          query        fragment

scheme    protocol to use (http, https)
host      the server's name, resolved through DNS
port      optional; 443 is the default for https, 80 for http
path      which resource on the server
query     parameters sent to the server: key=value pairs joined by &
fragment  stays in the browser; never sent to the server`}
        </Pre>
        <P>
          Query parameters are the most common place attackers inject input: change <C>id=42</C> to <C>id=43</C> and you may see someone else&apos;s order (an access control flaw called IDOR), or add a quote character and you may trigger a database error (SQL injection). Special characters in URLs are <strong>percent-encoded</strong>: a space becomes <C>%20</C>, a slash <C>%2F</C>. You will encode and decode constantly in web testing.
        </P>

        <H3>The HTTP Request</H3>
        <P>
          <strong>HTTP</strong> (Hypertext Transfer Protocol) is plain text at heart, even though HTTP/2 and HTTP/3 send it in a binary framing for speed. A request starts with a <strong>request line</strong>: the method, the path and the protocol version. Then come <strong>headers</strong>, which are name-value pairs carrying metadata, then a blank line, then an optional <strong>body</strong> holding data such as form fields or JSON.
        </P>
        <Pre label="A LOGIN REQUEST">
{`POST /api/login HTTP/1.1
Host: shop.example.com
User-Agent: Mozilla/5.0 (X11; Linux x86_64) Firefox/140.0
Accept: application/json
Content-Type: application/json
Content-Length: 44
Origin: https://shop.example.com
Cookie: theme=dark

{"username":"wanjiru","password":"S3cure!pass"}`}
        </Pre>
        <Table
          headers={['Method', 'Meaning', 'Has Body?', 'Security Notes']}
          rows={[
            ['GET', 'Retrieve a resource', 'No', 'Parameters appear in URLs, logs and browser history; never put secrets here'],
            ['POST', 'Submit data, create something', 'Yes', 'Logins, forms, uploads, API calls'],
            ['PUT', 'Replace a resource', 'Yes', 'If enabled carelessly, may allow uploading files'],
            ['PATCH', 'Partially update a resource', 'Yes', 'Mass-assignment bugs (setting role=admin)'],
            ['DELETE', 'Remove a resource', 'Optional', 'Must check authorisation on every call'],
            ['HEAD', 'Like GET but headers only', 'No', 'Quick fingerprinting (curl -I sends this)'],
            ['OPTIONS', 'Ask which methods are allowed', 'No', 'Used by CORS preflight requests'],
          ]}
        />

        <H3>The HTTP Response</H3>
        <P>
          The server replies with a <strong>status line</strong> (version, a three-digit status code and a reason phrase), headers, a blank line and the body, usually HTML, JSON, an image or a file. Status codes are grouped by their first digit, and reading them quickly is a core skill: during directory brute-forcing, for example, a 403 on <C>/admin</C> tells you the folder exists even though you cannot open it.
        </P>
        <Pre label="A RESPONSE THAT SETS A SESSION">
{`HTTP/1.1 200 OK
Date: Wed, 11 Nov 2026 09:41:07 GMT
Server: nginx/1.24.0
Content-Type: application/json
Set-Cookie: session=8f14e45fceea167a5a36dedd4bea2543; Path=/; HttpOnly; Secure; SameSite=Lax
Strict-Transport-Security: max-age=63072000; includeSubDomains
Content-Security-Policy: default-src 'self'
X-Content-Type-Options: nosniff

{"ok":true,"user":"wanjiru","role":"customer"}`}
        </Pre>
        <Table
          headers={['Code', 'Meaning', 'What It Tells a Tester']}
          rows={[
            ['200 OK', 'Success', 'The request worked'],
            ['201 Created', 'A resource was created', 'Typical after a POST to an API'],
            ['301 / 302', 'Moved permanently / temporarily', 'Check the Location header; open redirects'],
            ['304 Not Modified', 'Use your cached copy', 'Caching behaviour'],
            ['400 Bad Request', 'Malformed input', 'Your payload broke the parser: interesting'],
            ['401 Unauthorized', 'Not authenticated', 'You need to log in or supply a valid token'],
            ['403 Forbidden', 'Authenticated (or not) but not allowed', 'The resource exists; try other access paths'],
            ['404 Not Found', 'No such resource', 'Or the server hides existence behind 404'],
            ['405 Method Not Allowed', 'Wrong method', 'Try other methods; the endpoint exists'],
            ['429 Too Many Requests', 'Rate limited', 'Brute force is being throttled'],
            ['500 Internal Server Error', 'Server crashed handling your input', 'Often a sign of injectable input'],
            ['502 / 503 / 504', 'Gateway or availability problems', 'Reverse proxy or back-end issues'],
          ]}
        />
        <P>
          Headers carry security policy. <C>Server</C> and <C>X-Powered-By</C> often leak software versions, useful for finding known vulnerabilities. Defensive headers include <C>Strict-Transport-Security</C> (HSTS: always use HTTPS for this site), <C>Content-Security-Policy</C> (restricts where scripts may load from, the main browser-side defence against XSS), <C>X-Content-Type-Options</C> and <C>X-Frame-Options</C> or CSP frame-ancestors against clickjacking. The absence of these headers is a common finding in web assessments.
        </P>

        <H3>Statelessness, Cookies and Sessions</H3>
        <P>
          HTTP is <strong>stateless</strong>: every request stands alone, and the server does not inherently remember that the request a second ago came from you. To keep you logged in, sites use <strong>cookies</strong>, small name-value pairs the server sets with a <C>Set-Cookie</C> header and the browser automatically sends back in a <C>Cookie</C> header on every later request to that site. Think of it as a cloakroom ticket: after you log in, the server hands you a ticket (a long random <strong>session ID</strong>) and keeps a record of whose ticket it is. Whoever presents the ticket gets the coat.
        </P>
        <P>
          This is why session cookies are so valuable to attackers. Steal one, through cross-site scripting, malware on the victim&apos;s machine, or an unencrypted connection, and you become that user without ever knowing their password; even multi-factor authentication is bypassed, because MFA happened at login and the cookie represents a login that already succeeded. Infostealer malware harvesting browser cookies is now one of the most common causes of account takeover. Some applications use <strong>tokens</strong> instead, often <strong>JWTs</strong> (JSON Web Tokens), which carry signed claims about the user and are sent in an <C>Authorization: Bearer</C> header. The principle is the same: possession equals identity.
        </P>
        <Table
          headers={['Cookie Attribute', 'Effect', 'Protects Against']}
          rows={[
            ['HttpOnly', 'JavaScript cannot read the cookie', 'Theft of the session through XSS'],
            ['Secure', 'Only sent over HTTPS', 'Interception on plain HTTP'],
            ['SameSite=Lax / Strict', 'Limits sending on cross-site requests', 'Cross-site request forgery (CSRF)'],
            ['Domain / Path', 'Which hosts and paths receive it', 'Over-broad sharing across subdomains'],
            ['Expires / Max-Age', 'Lifetime; without it the cookie ends with the browser session', 'Long-lived stolen sessions'],
          ]}
        />

        <H3>HTTPS and TLS at a High Level</H3>
        <P>
          Plain HTTP travels as readable text, so anyone on the path (a coffee-shop Wi-Fi operator, a compromised router, an ISP) can read passwords and cookies or alter pages. <strong>HTTPS</strong> is simply HTTP carried inside <strong>TLS</strong> (Transport Layer Security). TLS provides three guarantees: <strong>confidentiality</strong> (traffic is encrypted), <strong>integrity</strong> (tampering is detected), and <strong>authentication</strong> (you are really talking to the server named in the URL). TLS 1.3 is the current version and TLS 1.2 is still acceptable; SSL and TLS 1.0/1.1 are obsolete and should be disabled.
        </P>
        <P>
          Authentication relies on <strong>certificates</strong>. A server&apos;s certificate binds its domain name to a public key and is signed by a <strong>Certificate Authority</strong> (CA) that your browser or OS already trusts. During the handshake, the client and server agree on algorithms, perform a key exchange (typically elliptic-curve Diffie-Hellman, increasingly combined with a post-quantum algorithm such as ML-KEM in modern browsers) and the server proves it owns the private key for its certificate. From then on, data is encrypted with fast symmetric keys. Certificate lifetimes are shrinking: under CA/Browser Forum rules, maximum validity dropped to 200 days in March 2026 and is scheduled to fall to 47 days by 2029, which is why automated issuance through services like Let&apos;s Encrypt is now the norm. MOD-03 explains the cryptography in depth.
        </P>
        <Pre label="TLS 1.3 HANDSHAKE (SIMPLIFIED)">
{`Client                                              Server
  | -- ClientHello: TLS versions, cipher suites,       |
  |    key share, SNI = shop.example.com ------------> |
  | <------------ ServerHello: chosen suite, key share |
  | <------------ {Certificate, CertificateVerify,     |
  |                Finished}   (already encrypted)     |
  | -- {Finished} -----------------------------------> |
  | ====== encrypted HTTP requests and responses ===== |

The client checks: is the certificate valid, unexpired, for this
hostname, and signed by a CA it trusts? If not, the browser warns.`}
        </Pre>
        <Note type="danger">
          The padlock means the connection is encrypted to whoever owns that domain. It does not mean the site is legitimate or the application is secure. Phishing sites routinely have valid certificates, and every injection flaw in MOD-06 works perfectly over HTTPS.
        </Note>

        <H3>Your First Web Hacking Tool: Browser Devtools</H3>
        <P>
          Press F12 (or Ctrl+Shift+I) in any modern browser. The <strong>Network</strong> tab records every request the page makes, with full headers, cookies, bodies, timings and status codes, and lets you replay or copy any request as a curl command. The <strong>Application</strong> tab (Storage in Firefox) shows cookies, localStorage and sessionStorage, and you can edit them live. The <strong>Elements</strong> (Inspector) tab shows the current page structure and lets you modify it, which teaches a vital lesson: anything enforced only in the browser, such as a disabled button, a hidden field or a client-side price check, can be bypassed by the user. Real security must be enforced on the server. The <strong>Console</strong> runs JavaScript in the page&apos;s context. Professional testers then move to an intercepting proxy such as Burp Suite or OWASP ZAP, which sits between browser and server so every request can be paused and edited, but devtools teach the same model for free.
        </P>
        <Pre label="SEEING THE WHOLE CONVERSATION WITH CURL">
{`$ curl -v https://example.com/ -o /dev/null
*   Trying 203.0.113.10:443...
* Connected to example.com (203.0.113.10) port 443
* SSL connection using TLSv1.3 / TLS_AES_256_GCM_SHA384
* Server certificate:
*  subject: CN=example.com
*  expire date: Feb  9 23:59:59 2027 GMT
*  issuer: C=US; O=Let's Encrypt; CN=R11
> GET / HTTP/2
> Host: example.com
> User-Agent: curl/8.11.1
> Accept: */*
>
< HTTP/2 200
< content-type: text/html
< cache-control: max-age=3600`}
        </Pre>
      </div>
    ),
  },

  {
    id: 'windows-essentials',
    title: 'Windows Essentials for Security',
    difficulty: 'BEGINNER',
    readTime: '13 min',
    takeaways: [
      'Windows identifies accounts by SID. RID 500 is the built-in Administrator; SYSTEM (S-1-5-18) is more powerful than any administrator and is what the OS and many services run as.',
      'UAC gives administrators a filtered, medium-integrity token until they approve elevation. Privileges such as SeDebugPrivilege and SeImpersonatePrivilege are often enough to reach SYSTEM.',
      'The registry is a hierarchical configuration database (HKLM, HKCU and others). Run keys and service keys are classic persistence locations.',
      'Services run in the background, often as SYSTEM. Weak service permissions and unquoted paths are common privilege escalation routes.',
      'The Security event log is the defender\'s core evidence: 4624/4625 logons, 4688 process creation, 4720 user created, 7045 service installed, 1102 log cleared.',
      'PowerShell is an object-based shell built on .NET. Active Directory centralises identity for a whole organisation, which is why it is the primary target in enterprise attacks.',
    ],
    content: (
      <div>
        <Key items={[
          <>Most organisations run <strong>Windows + Active Directory</strong> &mdash; the biggest real-world attack surface</>,
          <>The <strong>Registry</strong> stores config and secrets; the <strong>SAM</strong> hive holds local password hashes</>,
          <><C>lsass.exe</C> keeps credentials in memory &mdash; the prime target for credential theft (MOD-05)</>,
          <><strong>PowerShell</strong> is the admin&apos;s &mdash; and the attacker&apos;s &mdash; power tool; logging it is essential</>,
          <><strong>Administrator</strong> is powerful, but <strong>SYSTEM</strong> sits even higher; UAC is the prompt between you and it</>,
        ]} />
        <Local>Active Directory is the estate&apos;s central management office that keeps a copy of every tenant&apos;s key. One receptionist on the front desk is a normal user; the office safe is a Domain Controller. Crack the office and you hold every door on the estate at once &mdash; which is why MOD-05 spends so long there.</Local>
        <H3>Why Windows Matters</H3>
        <P>
          Linux runs most servers and the cloud, but Windows runs most corporate desktops, and Active Directory still underpins identity in the large majority of organisations. Ransomware gangs, red teams and incident responders all spend much of their time on Windows. The concepts from Chapter 1 carry over directly (processes, users, permissions, a kernel boundary), but the names and tools differ. This chapter gives you the vocabulary you will need for MOD-05 (Active Directory), MOD-07 (Malware) and MOD-11 (Red Team). Note that Windows 10 reached end of support in October 2025, so current enterprise estates are moving to Windows 11 and Windows Server 2022/2025; unsupported Windows 10 machines that remain are a growing risk.
        </P>

        <H3>Accounts, SIDs and Groups</H3>
        <P>
          Where Linux uses a UID, Windows uses a <strong>Security Identifier</strong> (SID), a structured string such as <C>S-1-5-21-3623811015-3361044348-30300820-1013</C>. The long middle section identifies the computer or domain, and the final number, the <strong>RID</strong> (relative identifier), identifies the account within it. RID 500 is always the built-in Administrator and RID 501 the Guest account, which is why renaming the Administrator account does not hide it from an attacker who enumerates by SID. Windows checks SIDs, not names, when deciding access.
        </P>
        <P>
          <strong>Local accounts</strong> exist only on one machine and are stored in the <strong>SAM</strong> (Security Account Manager) database. <strong>Domain accounts</strong> live in Active Directory and work on every machine in the domain. Membership of the local <strong>Administrators</strong> group gives full control of a machine; in a domain, <strong>Domain Admins</strong> controls every machine. Microsoft accounts and Entra ID (formerly Azure AD) accounts add a cloud layer on top.
        </P>

        <H3>Administrator vs SYSTEM, and UAC</H3>
        <P>
          Beginners assume Administrator is the top. It is not. <strong>NT AUTHORITY\SYSTEM</strong> (SID S-1-5-18, also called LocalSystem) is the identity of the operating system itself. It owns the kernel-adjacent processes, has unrestricted access to the local machine, and is what many services run as. Some actions, such as reading the SAM hashes directly from the registry or the memory of the LSASS process with full rights, are smoothest as SYSTEM, which is why attackers who reach Administrator usually take the short extra step to SYSTEM. Two lesser built-in identities, LocalService and NetworkService, exist so that services can run with fewer rights.
        </P>
        <P>
          <strong>User Account Control</strong> (UAC) means that even an administrator normally runs with a filtered, standard-user token at <strong>medium integrity</strong>. When a program needs admin rights, UAC prompts for consent and launches it with the full token at <strong>high integrity</strong>. Microsoft does not treat UAC as a hard security boundary, and many bypass techniques exist, but it does stop silent elevation. Each user&apos;s token also lists <strong>privileges</strong>: special rights such as <C>SeDebugPrivilege</C> (open any process, including LSASS) and <C>SeImpersonatePrivilege</C> (impersonate other users&apos; tokens). Service accounts commonly hold SeImpersonate, and the &quot;Potato&quot; family of exploits turns it into SYSTEM. <C>whoami /priv</C> is therefore a standard first command on Windows, just as <C>sudo -l</C> is on Linux.
        </P>
        <Table
          headers={['Integrity Level', 'Who Runs There', 'Can Write To']}
          rows={[
            ['System', 'SYSTEM, core services', 'Everything on the local machine'],
            ['High', 'Elevated administrator processes', 'Program Files, HKLM, other users\' data'],
            ['Medium', 'Normal user programs (and non-elevated admins)', 'The user\'s own profile and HKCU'],
            ['Low', 'Sandboxed processes, some browser components', 'Very little: special low-integrity folders'],
          ]}
        />
        <Pre label="WHO AM I ON WINDOWS?">
{`C:\\> whoami
corp\\wanjiru.k

C:\\> whoami /groups | findstr /i "admin integrity"
BUILTIN\\Administrators          Alias  S-1-5-32-544  Group used for deny only
Mandatory Label\\Medium Mandatory Level   Label  S-1-16-8192

C:\\> whoami /priv
Privilege Name                Description                               State
============================= ========================================= ========
SeShutdownPrivilege           Shut down the system                      Disabled
SeChangeNotifyPrivilege       Bypass traverse checking                  Enabled
SeImpersonatePrivilege        Impersonate a client after authentication Enabled

# "deny only" + Medium = an admin running WITHOUT elevation (UAC filtered)
# SeImpersonatePrivilege enabled = a likely route to SYSTEM`}
        </Pre>

        <H3>The Registry</H3>
        <P>
          The <strong>registry</strong> is a hierarchical database holding configuration for Windows and its applications, a single structured replacement for the scattered text files Linux keeps in <C>/etc</C>. It is organised into <strong>hives</strong>, which contain <strong>keys</strong> (like folders), which hold <strong>values</strong> (named data of types such as REG_SZ strings and REG_DWORD numbers). Hives are stored as files: the machine-wide ones in <C>C:\Windows\System32\config\</C> (SAM, SECURITY, SOFTWARE, SYSTEM) and each user&apos;s in <C>NTUSER.DAT</C> in their profile. You browse it with <C>regedit</C>, the <C>reg</C> command or PowerShell.
        </P>
        <Table
          headers={['Hive', 'Contents', 'Security Interest']}
          rows={[
            ['HKEY_LOCAL_MACHINE (HKLM)', 'Machine-wide settings, services, installed software', 'Services key, machine Run keys, SAM and SECURITY (SYSTEM-only)'],
            ['HKEY_CURRENT_USER (HKCU)', 'Settings for the logged-in user', 'User Run keys: persistence without admin rights'],
            ['HKEY_USERS (HKU)', 'All loaded user profiles', 'Other users\' settings'],
            ['HKEY_CLASSES_ROOT (HKCR)', 'File associations and COM objects', 'COM hijacking'],
            ['HKEY_CURRENT_CONFIG (HKCC)', 'Current hardware profile', 'Rarely relevant'],
          ]}
        />
        <Pre label="REGISTRY QUERIES ATTACKERS AND DEFENDERS BOTH RUN">
{`C:\\> reg query HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run
    OneDrive    REG_SZ    "C:\\Users\\wanjiru.k\\AppData\\Local\\Microsoft\\OneDrive\\OneDrive.exe" /background
    Updater     REG_SZ    C:\\Users\\Public\\upd.exe        <-- suspicious

PS C:\\> Get-ItemProperty 'HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run'

# Programs listed in Run keys start automatically at logon.
# Attackers add entries for persistence; defenders audit them (Autoruns).`}
        </Pre>

        <H3>Services</H3>
        <P>
          Windows <strong>services</strong> are the equivalent of Linux daemons: background programs managed by the Service Control Manager, configured under <C>HKLM\SYSTEM\CurrentControlSet\Services</C>, and often running as SYSTEM. Each service has a binary path, a start type (automatic, manual, disabled) and an account. They are attractive to attackers for two reasons. First, misconfigurations are common: if a low-privilege user can modify a service&apos;s configuration or replace its executable, they can make SYSTEM run their code. An <strong>unquoted service path</strong> containing spaces, such as <C>C:\Program Files\Acme Agent\agent.exe</C> without quotes, can make Windows try <C>C:\Program.exe</C> first. Second, installing a new service is a classic persistence and lateral movement technique (PsExec works this way), and it leaves a distinctive event 7045 in the System log.
        </P>
        <Pre label="INSPECTING SERVICES">
{`C:\\> sc query state= all | findstr SERVICE_NAME
C:\\> sc qc AcmeAgent
        BINARY_PATH_NAME   : C:\\Program Files\\Acme Agent\\agent.exe
        SERVICE_START_NAME : LocalSystem

PS C:\\> Get-Service | Where-Object Status -eq 'Running'
PS C:\\> Get-CimInstance Win32_Service | Select-Object Name, StartName, PathName`}
        </Pre>

        <H3>Event Logs</H3>
        <P>
          Windows records activity in <strong>event logs</strong>, viewed with Event Viewer (<C>eventvwr.msc</C>) or PowerShell&apos;s <C>Get-WinEvent</C>. The three classic logs are Application, System and <strong>Security</strong>; dozens more live under Applications and Services Logs, including PowerShell&apos;s operational log. Each event has a numeric <strong>Event ID</strong>, and memorising the important ones is a core SOC analyst skill. Many organisations also deploy <strong>Sysmon</strong>, a free Microsoft Sysinternals tool that logs far richer detail (process creation with hashes and command lines, network connections, registry changes) and forward everything to a SIEM.
        </P>
        <Table
          headers={['Event ID', 'Log', 'Meaning', 'Why Analysts Care']}
          rows={[
            ['4624', 'Security', 'Successful logon (with logon type: 2 interactive, 3 network, 10 RDP)', 'Who logged in, from where, how'],
            ['4625', 'Security', 'Failed logon', 'Brute force and password spraying'],
            ['4672', 'Security', 'Special privileges assigned to a new logon', 'Admin-equivalent logons'],
            ['4688', 'Security', 'Process created (command line if enabled)', 'What ran, and who started it'],
            ['4720 / 4732', 'Security', 'User account created / added to a local group', 'Attacker creating backdoor accounts'],
            ['4769', 'Security', 'Kerberos service ticket requested', 'Kerberoasting detection (MOD-05)'],
            ['7045', 'System', 'A new service was installed', 'PsExec, persistence, lateral movement'],
            ['1102', 'Security', 'The audit log was cleared', 'Almost always worth an immediate investigation'],
            ['4104', 'PowerShell Operational', 'Script block logged', 'The actual PowerShell code that ran, even if obfuscated'],
          ]}
        />

        <H3>PowerShell Basics</H3>
        <P>
          <strong>PowerShell</strong> is Microsoft&apos;s shell and scripting language. Windows ships with Windows PowerShell 5.1, while the cross-platform PowerShell 7 (<C>pwsh</C>) is installed separately and also runs on Linux and macOS. Its key difference from bash is that the pipeline passes <strong>objects</strong>, not text. When <C>Get-Process</C> sends output down the pipe, the next command receives structured process objects with properties such as Name, Id and CPU, so you filter by property instead of cutting columns of text. Commands, called <strong>cmdlets</strong>, follow a <strong>Verb-Noun</strong> naming pattern, which makes them guessable: Get-Service, Stop-Process, New-LocalUser.
        </P>
        <Pre label="POWERSHELL ESSENTIALS">
{`PS> Get-Help Get-Process -Examples        # built-in help (run Update-Help once)
PS> Get-Command *firewall*                # discover cmdlets by name
PS> Get-Process | Get-Member              # see an object's properties and methods

PS> Get-Process | Where-Object CPU -gt 100 | Sort-Object CPU -Descending | Select-Object -First 5 Name, Id, CPU
PS> Get-LocalUser | Select-Object Name, Enabled, LastLogon
PS> Get-NetTCPConnection -State Listen | Select-Object LocalAddress, LocalPort, OwningProcess
PS> Get-ChildItem C:\\Users -Recurse -Filter *.kdbx -ErrorAction SilentlyContinue
PS> Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4625} -MaxEvents 10

# Familiar aliases exist: ls, cd, cat, ps, cp, mv, rm, pwd all work`}
        </Pre>
        <P>
          Because PowerShell can download and run code in memory and talk to every part of Windows, it is a favourite attacker tool (MITRE ATT&amp;CK technique T1059.001). The <strong>execution policy</strong> that blocks unsigned scripts is explicitly not a security boundary; it is a safety net against accidents and is trivially bypassed. Real controls are script block logging, the AMSI scanning interface, Constrained Language Mode and application control such as WDAC or AppLocker.
        </P>

        <H3>Active Directory in One Section</H3>
        <P>
          Imagine a company with 5,000 employees and 6,000 computers. Creating every account on every machine would be impossible. <strong>Active Directory Domain Services</strong> (AD DS) solves this by centralising identity. A <strong>domain</strong> (for example <C>corp.local</C>) is a security boundary containing users, groups and computers. <strong>Domain Controllers</strong> (DCs) are the servers that hold the directory database, <C>NTDS.dit</C>, which contains every account and its password hash, and they answer authentication requests. Objects are organised into <strong>Organisational Units</strong> (OUs), and <strong>Group Policy Objects</strong> (GPOs) push settings, scripts and software to thousands of machines at once. Several domains can form a <strong>tree</strong>, and trees form a <strong>forest</strong>, the true security boundary.
        </P>
        <P>
          Authentication inside a domain mainly uses <strong>Kerberos</strong> (port 88), a ticket-based protocol where users prove their identity once to the DC and receive tickets to access services, with the older <strong>NTLM</strong> challenge-response protocol as a fallback. Directory queries use <strong>LDAP</strong> (389/636). The special <C>krbtgt</C> account signs all Kerberos tickets, which is why stealing its hash allows forging &quot;golden tickets&quot;. Many organisations now run hybrid identity, syncing AD with <strong>Microsoft Entra ID</strong> in the cloud. The security consequence is simple: compromise AD and you control the entire organisation. That is why MOD-05 is devoted to it.
        </P>
        <Note type="info">
          Every authenticated domain user can, by default, read most of the directory: users, groups, computers, group memberships. This is a feature, not a bug, and it is why tools like BloodHound can map attack paths from a single low-privilege account.
        </Note>
      </div>
    ),
  },

  {
    id: 'core-security-concepts',
    title: 'Core Security Concepts',
    difficulty: 'BEGINNER',
    readTime: '12 min',
    takeaways: [
      'The CIA triad, Confidentiality, Integrity and Availability, describes what security protects. Every attack violates at least one of the three.',
      'Authentication proves who you are; authorisation decides what you may do. Broken authorisation is consistently the most common serious web flaw.',
      'Least privilege and defence in depth are the two design principles behind almost every good control. Assume each layer will fail sometimes.',
      'A threat exploits a vulnerability to create risk. Risk is roughly likelihood multiplied by impact, and it is what organisations actually manage.',
      'CVE gives each public vulnerability an ID; CVSS scores its severity from 0 to 10; CISA KEV and EPSS help decide what to patch first.',
      'The Cyber Kill Chain and MITRE ATT&CK describe how attacks unfold. ATT&CK\'s tactics and technique IDs are the shared language of red and blue teams.',
    ],
    content: (
      <div>
        <Key items={[
          <><strong>CIA triad</strong> &mdash; Confidentiality (secrecy), Integrity (not tampered), Availability (reachable)</>,
          <><strong>Authentication</strong> (who you are) is not <strong>Authorization</strong> (what you may do) &mdash; attacks abuse both</>,
          <>Vocabulary: <strong>threat</strong>, <strong>vulnerability</strong>, <strong>risk</strong>, <strong>exploit</strong> &mdash; know the difference</>,
          <><strong>Defence in depth:</strong> layers, least privilege, fail secure &mdash; no single wall is enough</>,
          <>The attacker&apos;s and defender&apos;s jobs are mirror images of each other</>,
        ]} />
        <Local>The <strong>CIA triad</strong> is just M-Pesa in three words. <strong>Confidentiality:</strong> only you should see your balance. <strong>Integrity:</strong> nobody should be able to quietly change it. <strong>Availability:</strong> you must be able to send money the moment you need to. Break any one &mdash; a leaked balance, an altered figure, a service that is down on payday &mdash; and the whole system has failed you.</Local>
        <H3>What Are We Protecting? The CIA Triad</H3>
        <P>
          Security can feel like a sprawl of tools and acronyms, but almost all of it serves three goals, known as the <strong>CIA triad</strong>. <strong>Confidentiality</strong> means information is seen only by those authorised to see it: a data breach, a sniffed password or a leaked database violates it, and encryption and access control protect it. <strong>Integrity</strong> means information and systems are not altered without authorisation: a tampered bank transfer, a defaced website or a backdoored software update violates it, and hashes, digital signatures and change control protect it. <strong>Availability</strong> means systems and data are accessible when needed: ransomware and denial-of-service attacks violate it, and backups, redundancy and DDoS protection defend it.
        </P>
        <P>
          The goals pull against each other, and security is the art of balancing them. Encrypting everything with keys only one person holds maximises confidentiality but risks availability if that person disappears. Two further properties are often added: <strong>authenticity</strong> (data really comes from who it claims) and <strong>non-repudiation</strong> (someone cannot later deny an action, typically achieved with digital signatures and good logging).
        </P>
        <Table
          headers={['Incident', 'C', 'I', 'A', 'Explanation']}
          rows={[
            ['Customer database stolen and leaked', 'X', '', '', 'Data seen by unauthorised people'],
            ['Ransomware encrypts file servers', '(X)', 'X', 'X', 'Files unusable; modern gangs also steal data first (double extortion)'],
            ['Attacker changes payment details in an invoice email', '', 'X', '', 'Business email compromise alters data in transit'],
            ['DDoS takes an M-Pesa-style payment API offline', '', '', 'X', 'Service unavailable to legitimate users'],
            ['Malicious code inserted into a software update', '', 'X', '', 'Supply chain compromise: trusted code altered'],
          ]}
        />

        <H3>Authentication vs Authorisation</H3>
        <P>
          These two words sound alike and are constantly confused, but the difference is critical. <strong>Authentication</strong> (AuthN) answers &quot;who are you?&quot;. <strong>Authorisation</strong> (AuthZ) answers &quot;what are you allowed to do?&quot;. At an airport, showing your passport is authentication; your boarding pass deciding which plane and seat you may board is authorisation. A system can authenticate you perfectly and still fail at authorisation, for example by letting any logged-in user view any other user&apos;s invoice by changing a number in the URL. Broken access control has sat at the top of the OWASP Top 10 web risks since 2021.
        </P>
        <P>
          Authentication relies on <strong>factors</strong>: something you know (a password or PIN), something you have (a phone, a hardware security key) and something you are (a fingerprint or face). <strong>Multi-factor authentication</strong> (MFA) combines two or more categories. Not all MFA is equal. SMS codes can be stolen through SIM swapping, which is a well-known problem in Kenya and elsewhere, and push notifications can be abused by spamming the victim until they approve (MFA fatigue). Phishing-resistant methods such as FIDO2 security keys and <strong>passkeys</strong>, which use public-key cryptography bound to the real website&apos;s domain, are now the recommended standard because a fake login page simply cannot use them. Authorisation is typically implemented through models like <strong>RBAC</strong> (role-based access control), where permissions attach to roles such as &quot;finance clerk&quot; and users are assigned roles.
        </P>

        <H3>Least Privilege and Defence in Depth</H3>
        <P>
          The <strong>principle of least privilege</strong> says every user, program and service should have only the access it needs to do its job, and only for as long as it needs it. A receptionist does not need access to the payroll database; a web server process does not need to run as root; a backup script does not need domain admin rights. Least privilege does not prevent the first compromise, but it limits the <strong>blast radius</strong>: when an account is breached, the attacker inherits only that account&apos;s rights. Almost every privilege escalation you will perform is possible because someone violated this principle.
        </P>
        <P>
          <strong>Defence in depth</strong> means layering independent controls so that no single failure leads to disaster. A medieval castle had a moat, walls, gates, guards and a keep; an attacker had to defeat all of them. A modern equivalent might combine email filtering, user awareness training, endpoint detection, application allow-listing, network segmentation, MFA, least privilege, logging with alerting, and offline backups. Each layer will fail sometimes. The goal is that they fail independently. A related modern idea is <strong>zero trust</strong>: never trust a request simply because it comes from inside the network; verify identity, device health and authorisation on every access.
        </P>
        <Pre label="DEFENCE IN DEPTH AGAINST A PHISHING ATTACK">
{`Attacker sends malicious email
   |
   +-- [Email gateway]        blocks known-bad attachments and links   -- may miss new ones
   +-- [User training]        user spots the lure and reports it       -- some users click
   +-- [Endpoint protection]  EDR blocks the payload on execution      -- may be evaded
   +-- [Least privilege]      user is not a local admin                -- limits damage
   +-- [Segmentation]         workstation cannot reach the database    -- limits movement
   +-- [MFA / passkeys]       stolen password alone is useless         -- stops reuse
   +-- [Logging + SOC]        suspicious behaviour raises an alert     -- enables response
   +-- [Offline backups]      ransomware cannot destroy recovery       -- restores availability`}
        </Pre>

        <H3>Threat, Vulnerability, Risk</H3>
        <P>
          Three more words that are often blurred. A <strong>vulnerability</strong> is a weakness: an unpatched server, a default password, an employee who will click anything. A <strong>threat</strong> is something that could exploit a weakness: a ransomware gang, a disgruntled insider, a flood in the server room. The person or group behind it is a <strong>threat actor</strong>, and the path they use is an <strong>attack vector</strong>. An <strong>exploit</strong> is the specific code or technique that takes advantage of a vulnerability. <strong>Risk</strong> is the potential for loss when a threat meets a vulnerability, commonly estimated as <strong>likelihood multiplied by impact</strong>. An unpatched flaw on an isolated test machine is low risk; the same flaw on an internet-facing payment server is critical.
        </P>
        <P>
          Organisations cannot eliminate risk, so they manage it. They can <strong>mitigate</strong> it (patch, add controls), <strong>transfer</strong> it (insurance, outsourcing), <strong>avoid</strong> it (stop doing the risky activity) or <strong>accept</strong> it (a documented decision that the cost of fixing exceeds the expected loss). Security professionals who can explain findings in terms of risk to the business, rather than just technical severity, are the ones whose recommendations get funded.
        </P>

        <H3>CVE, CVSS and Prioritising Patches</H3>
        <P>
          When a vulnerability in public software is disclosed, it receives a <strong>CVE</strong> (Common Vulnerabilities and Exposures) identifier such as <C>CVE-2021-44228</C> (Log4Shell): the year, then a sequence number. CVE IDs are assigned by CVE Numbering Authorities under the programme run by MITRE, and give everyone, vendors, scanners and defenders, a common name for the same flaw. The US National Vulnerability Database (NVD) enriches CVEs with additional data, though it has struggled with large backlogs since 2024, so many teams also rely on vendor advisories and other sources.
        </P>
        <P>
          <strong>CVSS</strong> (Common Vulnerability Scoring System) rates severity from 0.0 to 10.0 based on factors such as attack vector (network or local?), attack complexity, privileges required, user interaction and impact on confidentiality, integrity and availability. CVSS v4.0 was released in late 2023, though v3.1 scores remain very common. A high CVSS score does not automatically mean high risk for you, so mature teams combine it with two other signals: the <strong>CISA Known Exploited Vulnerabilities</strong> (KEV) catalogue, which lists flaws confirmed to be exploited in the wild, and <strong>EPSS</strong> (Exploit Prediction Scoring System), which estimates the probability that a CVE will be exploited in the next 30 days.
        </P>
        <Table
          headers={['CVSS Score', 'Severity', 'Famous Example']}
          rows={[
            ['0.0', 'None', '-'],
            ['0.1 - 3.9', 'Low', 'Minor information disclosure'],
            ['4.0 - 6.9', 'Medium', 'Many reflected XSS bugs'],
            ['7.0 - 8.9', 'High', 'Heartbleed, CVE-2014-0160 (7.5); EternalBlue, CVE-2017-0144 (8.1, exploited by WannaCry)'],
            ['9.0 - 10.0', 'Critical', 'Log4Shell, CVE-2021-44228 (10.0)'],
          ]}
        />
        <Pre label="READING A CVSS VECTOR (v3.1)">
{`CVE-2021-44228  CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H  = 10.0

AV:N   Attack Vector: Network       exploitable remotely over the internet
AC:L   Attack Complexity: Low        no special conditions needed
PR:N   Privileges Required: None     no account needed
UI:N   User Interaction: None        no victim has to click anything
S:C    Scope: Changed                impact spreads beyond the vulnerable component
C:H / I:H / A:H                      total loss of confidentiality, integrity, availability`}
        </Pre>

        <H3>How Attacks Unfold: Kill Chain and MITRE ATT&amp;CK</H3>
        <P>
          Real intrusions are not a single exploit; they are campaigns with stages. Lockheed Martin&apos;s <strong>Cyber Kill Chain</strong> (2011) describes seven: reconnaissance, weaponisation, delivery, exploitation, installation, command and control, and actions on objectives. Its key insight for defenders is that breaking any link stops the chain. Its weakness is that it is very perimeter-focused and says little about what happens once an attacker is inside.
        </P>
        <P>
          <strong>MITRE ATT&amp;CK</strong> (Adversarial Tactics, Techniques and Common Knowledge) fills that gap and has become the industry&apos;s shared language. It is a free, continuously updated knowledge base built from real-world intrusions. <strong>Tactics</strong> are the attacker&apos;s goals (the &quot;why&quot;, such as Persistence), <strong>techniques</strong> are how they achieve them (the &quot;how&quot;, such as Scheduled Task, T1053), and sub-techniques add detail. Red teams use ATT&amp;CK to plan realistic emulations, blue teams map their detections against it to find gaps, and threat intelligence reports tag adversary behaviour with technique IDs. The Enterprise matrix currently groups techniques under 14 tactics; it is revised roughly twice a year, so check attack.mitre.org for the current version.
        </P>
        <Table
          headers={['Tactic (ID)', 'Attacker Goal', 'Example Technique']}
          rows={[
            ['Reconnaissance (TA0043)', 'Gather information to plan', 'T1593 Search Open Websites/Domains'],
            ['Resource Development (TA0042)', 'Set up infrastructure and tools', 'T1583 Acquire Infrastructure'],
            ['Initial Access (TA0001)', 'Get into the network', 'T1566 Phishing'],
            ['Execution (TA0002)', 'Run malicious code', 'T1059 Command and Scripting Interpreter'],
            ['Persistence (TA0003)', 'Keep access across reboots', 'T1053 Scheduled Task/Job'],
            ['Privilege Escalation (TA0004)', 'Gain higher permissions', 'T1548 Abuse Elevation Control Mechanism'],
            ['Defense Evasion (TA0005)', 'Avoid detection', 'T1070 Indicator Removal (e.g. clearing logs)'],
            ['Credential Access (TA0006)', 'Steal account credentials', 'T1003 OS Credential Dumping'],
            ['Discovery (TA0007)', 'Learn the environment', 'T1087 Account Discovery'],
            ['Lateral Movement (TA0008)', 'Move to other systems', 'T1021 Remote Services'],
            ['Collection (TA0009)', 'Gather target data', 'T1005 Data from Local System'],
            ['Command and Control (TA0011)', 'Communicate with compromised systems', 'T1071 Application Layer Protocol'],
            ['Exfiltration (TA0010)', 'Steal data out', 'T1041 Exfiltration Over C2 Channel'],
            ['Impact (TA0040)', 'Disrupt, destroy or extort', 'T1486 Data Encrypted for Impact'],
          ]}
        />
        <Note type="tip">
          From now on, whenever you learn an attack technique in GHOSTNET, ask two questions: which ATT&amp;CK tactic does it serve, and what evidence would it leave for a defender? Thinking from both sides is what separates a professional from a tool operator.
        </Note>
      </div>
    ),
  },

  {
    id: 'lab-environment-and-law',
    title: 'Your Lab Environment, Safely and Legally',
    difficulty: 'BEGINNER',
    readTime: '12 min',
    labLink: '/modules/foundations/lab',
    takeaways: [
      'Practise inside virtual machines. A hypervisor (VirtualBox, VMware Workstation, Hyper-V, UTM on Apple Silicon) lets you run attacker and target systems on one computer.',
      'Take a snapshot before every risky change. Restoring a snapshot is faster than fixing a broken VM.',
      'Keep vulnerable targets on host-only or internal networks. Never bridge a deliberately vulnerable machine onto your home or office network.',
      'Unauthorised access is a crime almost everywhere: Kenya\'s Computer Misuse and Cybercrimes Act 2018, the UK Computer Misuse Act 1990 and the US CFAA all apply, even to "just looking".',
      'Written permission and a defined scope are what separate a penetration tester from a criminal. Without both, do not touch the system.',
      'CTFs, intentionally vulnerable machines and bug bounty programmes with safe-harbour terms are the legal ways to practise.',
    ],
    content: (
      <div>
        <Key items={[
          <>Build an <strong>isolated lab</strong> (VirtualBox/VMware, or a cloud VM) &mdash; never practise on systems you do not own</>,
          <><strong>Attacker box:</strong> Kali or Parrot. <strong>Targets:</strong> deliberately vulnerable VMs (Metasploitable, DVWA, VulnHub)</>,
          <><strong>Snapshots</strong> let you break things and reset in seconds</>,
          <><strong>The law is the line:</strong> unauthorised access is a crime &mdash; in Kenya, the Computer Misuse and Cybercrimes Act, 2018</>,
          <><strong>Legal practice ranges:</strong> HackTheBox, TryHackMe, PortSwigger Web Security Academy</>,
        ]} />
        <Local>Your lab is your own shamba: dig it, burn it, plant whatever you like &mdash; it is yours. Reaching into someone else&apos;s system without permission is breaking into a neighbour&apos;s plot. Calling it &quot;research&quot; changes nothing; under the Computer Misuse and Cybercrimes Act (2018) it is an offence. The whole skill is doing real things in a place where real is still safe and legal.</Local>
        <H3>Why a Lab Comes First</H3>
        <P>
          Reading about security only gets you so far. You learn by running the commands, breaking things and fixing them. But practising on real systems you do not own is illegal, and experimenting on your main computer risks wrecking it or exposing it to the very malware and vulnerable services you are studying. The answer is a <strong>home lab</strong>: an isolated set of virtual machines where you can attack, defend, crash and rebuild as often as you like. Every professional maintains one, and building yours is the first practical project of your security career.
        </P>

        <H3>Virtual Machines and Hypervisors</H3>
        <P>
          A <strong>virtual machine</strong> (VM) is a complete computer simulated in software: it has its own virtual CPU, memory, disk and network card, and runs its own operating system, called the <strong>guest</strong>, on top of your real computer, the <strong>host</strong>. The software that creates and runs VMs is the <strong>hypervisor</strong>. <strong>Type 1</strong> hypervisors run directly on hardware and power data centres and clouds (VMware ESXi, Microsoft Hyper-V, Proxmox VE, KVM). <strong>Type 2</strong> hypervisors run as applications on your normal OS and are what most people use at home.
        </P>
        <Table
          headers={['Hypervisor', 'Host OS', 'Cost', 'Notes']}
          rows={[
            ['VirtualBox', 'Windows, Linux, macOS (Intel and Apple Silicon)', 'Free, open source', 'The usual starting point; huge community'],
            ['VMware Workstation Pro / Fusion Pro', 'Windows, Linux / macOS', 'Free for personal and commercial use since 2024', 'Polished, strong networking features'],
            ['Hyper-V', 'Windows Pro / Enterprise', 'Included', 'Type 1 under the hood; can conflict with other hypervisors'],
            ['UTM / Parallels', 'macOS (Apple Silicon)', 'UTM free; Parallels paid', 'Run ARM64 guests on M-series Macs'],
            ['Proxmox VE', 'Dedicated machine', 'Free, open source', 'Type 1 for a permanent lab on an old PC or mini PC'],
          ]}
        />
        <P>
          Hardware matters. Enable <strong>hardware virtualisation</strong> (Intel VT-x or AMD-V) in your BIOS/UEFI settings. A comfortable lab needs at least 16 GB of RAM and an SSD with 150 GB or more free; 8 GB works if you run one or two small VMs at a time. Apple Silicon Macs run ARM64 guests: Kali and Parrot publish ARM images, but some Windows targets and x86-only tools will not run natively, so check before you rely on them.
        </P>

        <H3>Choosing an Attacker Distribution</H3>
        <P>
          <strong>Kali Linux</strong>, maintained by OffSec, is the most widely used penetration testing distribution, a Debian-based system preloaded with hundreds of tools (nmap, Burp Suite Community, Metasploit, Wireshark, Hashcat and more) and released quarterly. <strong>Parrot Security OS</strong> is a comparable Debian-based alternative with a lighter desktop and a privacy focus. Both provide ready-made VM images, which is the fastest way to start. Neither is magic: they are ordinary Linux with tools pre-installed, and everything you learned in Chapters 2 and 3 applies. Since 2020 Kali uses a normal unprivileged user by default rather than root, which is good practice you should keep.
        </P>
        <Note type="warn">
          Do not install Kali as your everyday operating system, and do not run your browser for personal banking inside it. It is a toolkit, not a hardened desktop. Keep work, study and personal life in separate machines or VMs.
        </Note>

        <H3>Snapshots: Your Undo Button</H3>
        <P>
          A <strong>snapshot</strong> records the complete state of a VM (its disk and optionally its memory) at a moment in time. Before you install a risky tool, run malware, attempt a kernel exploit or make big configuration changes, take a snapshot. If something breaks, you revert in seconds instead of rebuilding for an hour. Name snapshots clearly (&quot;clean-install-updated&quot;, &quot;before-AD-lab&quot;) and delete old ones, because snapshot chains consume disk space and can slow a VM. Snapshots are not backups: if the underlying disk file is lost, the snapshots go with it. Keep a copy of important notes and configurations elsewhere.
        </P>
        <Pre label="SNAPSHOTS FROM THE COMMAND LINE (VIRTUALBOX)">
{`$ VBoxManage list vms
"kali-2026"     {3f1c...}
"metasploitable2" {9a2e...}

$ VBoxManage snapshot "kali-2026" take "clean-updated" --description "fresh install + full-upgrade"
$ VBoxManage snapshot "kali-2026" list
$ VBoxManage snapshot "kali-2026" restore "clean-updated"     # VM must be powered off`}
        </Pre>

        <H3>Network Isolation</H3>
        <P>
          The single most important lab safety decision is how your VMs connect to networks. Intentionally vulnerable machines are designed to be easy to compromise. Bridge one onto your home Wi-Fi and anyone on that network, or any worm that reaches it, can compromise it and use it as a foothold into your real devices. Malware samples must be isolated even more strictly, with no internet access at all. Hypervisors offer several network modes, and you should choose deliberately.
        </P>
        <Table
          headers={['Mode', 'VM Can Reach Internet?', 'Reachable From LAN?', 'VMs See Each Other?', 'Use For']}
          rows={[
            ['NAT', 'Yes', 'No', 'No (each VM isolated)', 'Attacker VM that needs updates'],
            ['NAT Network', 'Yes', 'No', 'Yes', 'Attacker plus targets that need internet'],
            ['Host-only', 'No', 'Only from your host', 'Yes', 'Vulnerable targets: the safe default'],
            ['Internal network', 'No', 'No', 'Yes (same named network)', 'Fully isolated labs, malware analysis'],
            ['Bridged', 'Yes', 'Yes: VM is a full LAN device', 'Yes', 'Avoid for vulnerable machines'],
          ]}
        />
        <Pre label="A SAFE STARTER LAB LAYOUT">
{`   Internet
      |
  [ Host laptop ]  (your real OS; keep it patched)
      |
      +-- NAT ---------- [ Kali / Parrot ]  eth0: updates and tools
      |                         |
      |                   eth1: host-only 192.168.56.0/24
      |                         |
      +-- host-only -----+------+------------------+
                         |                         |
               [ Metasploitable 2 ]       [ DVWA / OWASP Juice Shop ]
                192.168.56.101              192.168.56.102
                (no internet access)        (no internet access)`}
        </Pre>
        <P>
          Good starter targets include <strong>Metasploitable 2</strong> (an old, deliberately vulnerable Linux server), <strong>DVWA</strong> and <strong>OWASP Juice Shop</strong> (vulnerable web applications), machines from <strong>VulnHub</strong>, and a small Windows evaluation VM, which Microsoft offers free for a limited trial period, for building an Active Directory lab later. Online platforms such as <strong>TryHackMe</strong> and <strong>Hack The Box</strong> host targets for you over a VPN, which removes the setup burden entirely and is an excellent complement to a local lab.
        </P>

        <H3>The Law: Unauthorised Access Is a Crime</H3>
        <P>
          This is the part beginners skip and later regret. Accessing a computer system without permission is a criminal offence in nearly every country, regardless of your intent. &quot;I was only testing&quot;, &quot;I did not change anything&quot; and &quot;their security was terrible anyway&quot; are not defences. Scanning, logging in with a guessed or leaked password, exploiting a vulnerability or even using credentials someone gave you, beyond what the owner authorised, can all qualify. The summaries below are educational, not legal advice, and laws are amended over time, so read the current official text for your jurisdiction.
        </P>
        <Table
          headers={['Jurisdiction', 'Law', 'Key Offences (summary)']}
          rows={[
            ['Kenya', 'Computer Misuse and Cybercrimes Act, 2018', 's.14 unauthorised access (fine up to KES 5 million and/or up to 3 years); s.15 access with intent to commit a further offence (up to KES 10 million and/or 10 years); s.16 unauthorised interference; s.17 unauthorised interception; s.18 illegal devices and access codes'],
            ['United Kingdom', 'Computer Misuse Act 1990', 's.1 unauthorised access (up to 2 years); s.2 with intent to commit further offences (up to 5 years); s.3 unauthorised acts impairing a computer (up to 10 years); s.3ZA serious damage (up to 14 years, or life); s.3A making or supplying tools for these offences'],
            ['United States', 'Computer Fraud and Abuse Act, 18 U.S.C. 1030', 'Accessing a protected computer without authorisation or exceeding authorised access; damage; trafficking in passwords. Civil suits are also possible. State laws add further offences'],
          ]}
        />
        <P>
          Some nuances are worth knowing. In the United States, the Supreme Court&apos;s 2021 decision in <em>Van Buren v. United States</em> narrowed &quot;exceeds authorized access&quot; to entering parts of a system that are off-limits to you, rather than misusing data you are entitled to see, and in 2022 the Department of Justice announced it would not charge good-faith security research under the CFAA. In the UK, there has been a long campaign to add a public-interest defence for security researchers to the CMA. Neither development is a licence: good faith is judged by prosecutors and courts after the fact, and you do not want to be the test case. In Kenya, the Act is enforced alongside the Data Protection Act 2019, which adds separate obligations whenever personal data is involved.
        </P>
        <Note type="danger">
          Never test a system you do not own without explicit written permission from someone with the authority to grant it. Not your employer&apos;s network &quot;to impress them&quot;, not your university portal, not the café Wi-Fi, not a friend&apos;s website without their written consent. Ethical hacking is defined by authorisation, not by intent.
        </Note>

        <H3>Scope, Permission and Rules of Engagement</H3>
        <P>
          Professional penetration testers work under a signed contract and a <strong>scope</strong> document that states exactly what may be tested: specific IP ranges, domains and applications, which techniques are allowed (is social engineering in scope? denial of service? physical entry?), the testing window, and emergency contacts. These are called the <strong>rules of engagement</strong>. Anything outside scope is off-limits even if you discover it mid-test; a third-party cloud service or a supplier&apos;s system usually needs that third party&apos;s permission too. Testers often carry a signed authorisation letter, sometimes nicknamed a &quot;get out of jail free&quot; letter, for exactly the moment someone asks what they are doing.
        </P>
        <P>
          <strong>Bug bounty</strong> programmes on platforms such as HackerOne, Bugcrowd and Intigriti, and companies&apos; own vulnerability disclosure policies, publish a scope and <strong>safe-harbour</strong> terms that authorise good-faith testing within published rules. Read those rules completely before you start, follow them precisely, and report through the official channel. If you stumble on a vulnerability somewhere with no programme, stop, do not exploit it further, and report it responsibly to the owner, or through a national CERT such as the National KE-CIRT/CC in Kenya.
        </P>

        <H3>CTFs: Legal Practice That Feels Like the Real Thing</H3>
        <P>
          <strong>Capture the Flag</strong> (CTF) competitions are the security world&apos;s sport. In <strong>jeopardy-style</strong> CTFs you solve standalone challenges in categories such as web, cryptography, forensics, reverse engineering and binary exploitation, each hiding a flag string that proves you solved it. In <strong>attack-defence</strong> CTFs teams protect their own services while attacking others&apos;. Beginner-friendly options include picoCTF (designed for students), TryHackMe and Hack The Box rooms and machines, and OverTheWire&apos;s Bandit wargame, which teaches the Linux command line through levels. CTFtime.org lists upcoming public events worldwide, including competitions run by African security communities. CTFs are fully legal, collaborative, and the source of many professionals&apos; first job referrals.
        </P>
        <Pre label="YOUR FIRST LEGAL PRACTICE SESSION (OVERTHEWIRE BANDIT)">
{`$ ssh bandit0@bandit.labs.overthewire.org -p 2220
# password for level 0: bandit0
bandit0@bandit:~$ ls -la
bandit0@bandit:~$ cat readme
# each level's file holds the password for the next level`}
        </Pre>
      </div>
    ),
  },

  {
    id: 'how-to-learn-cybersecurity',
    title: 'How to Learn Cybersecurity, and How GHOSTNET Fits Together',
    difficulty: 'BEGINNER',
    readTime: '11 min',
    takeaways: [
      'Pick a direction early (SOC analyst, penetration tester, cloud security, red team) but build the same foundations first: Linux, networking, Windows, web and scripting.',
      'Certifications open doors to interviews; skills and a visible portfolio win the job. Security+ and CySA+ suit defensive roles; eJPT then OSCP suit offensive ones.',
      'Take structured notes from day one. Your notes become your personal knowledge base, your methodology and, later, your report templates.',
      'Learn actively: build a home lab, solve machines, then read write-ups to see how others solved them, and write your own.',
      'GHOSTNET modules build on each other: Foundations, then networking and web, then the specialist tracks.',
    ],
    content: (
      <div>
        <Key items={[
          <><strong>No single path</strong> &mdash; pick a direction (offensive, defensive, or GRC), go deep, then broaden</>,
          <><strong>Learn by doing:</strong> labs beat videos. Build it, break it, write it down</>,
          <><strong>Spaced repetition beats cramming</strong> &mdash; use GHOSTNET&apos;s Review system (it schedules recall for you)</>,
          <><strong>Build a portfolio:</strong> write-ups, a home lab, CTFs &mdash; proof beats certificates alone</>,
          <><strong>Consistency over intensity</strong> &mdash; small daily reps compound into mastery</>,
        ]} />
        <Local>Learning cybersecurity is like learning to drive in Nairobi traffic: no amount of watching clips replaces hours behind the wheel with a patient instructor. The labs are your driving lessons, GHOST is the instructor in the passenger seat, and the Review cards are the Highway Code you keep in your head. Zero to operator is just enough laps of the roundabout.</Local>
        <H3>There Is No Single Path</H3>
        <P>
          &quot;Cybersecurity&quot; is not one job; it is dozens. Some people spend their days hunting for threats in logs, others break into applications for a living, others design cloud architectures, investigate incidents, reverse engineer malware, write policy or teach. The good news is that nearly every path starts from the same foundations you have just covered: operating systems, the command line, networking, the web and core security concepts. The second piece of good news is that the field still has more open roles than qualified people, and employers increasingly hire on demonstrated skill rather than degrees alone.
        </P>

        <H3>Four Common Career Paths</H3>
        <Table
          headers={['Path', 'What You Do', 'Key Skills', 'Typical Entry Route', 'GHOSTNET Modules']}
          rows={[
            ['SOC Analyst (blue team)', 'Monitor alerts, triage incidents, investigate suspicious activity, escalate and respond', 'Logs, SIEM queries, Windows events, networking, phishing analysis, ATT&CK mapping', 'Help desk or IT support, then Tier 1 SOC', 'MOD-00, 07, 08, 10, then defensive chapters across modules'],
            ['Penetration Tester', 'Legally attack networks, web apps and systems, then write reports with fixes', 'Linux, networking, web vulnerabilities, Windows/AD, scripting, clear report writing', 'Labs, CTFs and certifications, often via sysadmin, developer or SOC roles', 'MOD-00, 06, 08, 05, 04, 03'],
            ['Cloud Security Engineer', 'Secure AWS, Azure and GCP environments, identity, containers and infrastructure as code', 'Cloud IAM, networking, Linux, Kubernetes, Terraform, scripting', 'Cloud engineering or DevOps, plus security specialisation', 'MOD-00, 09, 06, 03'],
            ['Red Team Operator', 'Emulate real adversaries end to end, testing detection and response', 'Everything a pentester knows, plus evasion, C2, OPSEC, social engineering', 'Experienced pentesters move into red teaming', 'MOD-11 after most other modules'],
          ]}
        />
        <P>
          Other paths are worth knowing: <strong>digital forensics and incident response</strong> (DFIR), <strong>malware analysis</strong> and reverse engineering, <strong>application security</strong> (working with developers to build secure software), <strong>governance, risk and compliance</strong> (GRC), and <strong>threat intelligence</strong>. For a first role, SOC analyst is the most common entry point, because organisations need many analysts and the job teaches you how attacks look from the defender&apos;s side, which makes you a better attacker later too.
        </P>

        <H3>Certifications: What They Are Worth</H3>
        <P>
          Certifications are not a substitute for skill, but they get your CV past HR filters, give your study structure, and some are explicitly required for government or contractor roles. Choose them to match your target role, and avoid collecting expensive certificates you cannot back up in an interview. Exam versions, prices and formats change, so always check the vendor&apos;s site before booking.
        </P>
        <Table
          headers={['Certification', 'Vendor', 'Level', 'Style', 'Best For']}
          rows={[
            ['Security+', 'CompTIA', 'Entry', 'Multiple choice plus performance-based questions', 'Broad foundation; often required for government roles; good first cert for any path'],
            ['CySA+', 'CompTIA', 'Intermediate', 'Multiple choice plus performance-based', 'SOC analyst, threat detection and vulnerability management'],
            ['eJPT', 'INE', 'Entry (practical)', 'Hands-on exam in a lab environment', 'First offensive cert; proves you can actually run an assessment'],
            ['OSCP (OSCP+)', 'OffSec', 'Intermediate to advanced (practical)', 'Long hands-on exam plus a professional report', 'The best-known pentest cert; OSCP+ adds a three-year validity period'],
            ['PNPT', 'TCM Security', 'Intermediate (practical)', 'Multi-day external-to-internal engagement plus report and debrief', 'Realistic pentest experience including Active Directory'],
            ['BTL1', 'Security Blue Team', 'Entry to intermediate (practical)', 'Hands-on incident response exam', 'SOC and DFIR candidates'],
            ['Cloud security certs', 'AWS, Microsoft, Google', 'Intermediate', 'Multiple choice and labs', 'Cloud security engineers (e.g. AWS Security Specialty)'],
          ]}
        />
        <Note type="tip">
          A sensible offensive sequence is: GHOSTNET foundations and labs, Security+ (optional but useful), eJPT, then TryHackMe or Hack The Box practice until you are rooting medium machines regularly, then OSCP. For defence: foundations, Security+, a SIEM and log analysis practice lab, then CySA+ or BTL1.
        </Note>

        <H3>How to Take Notes</H3>
        <P>
          You will forget most commands within weeks unless you write them down, and the professionals you admire all rely on extensive personal notes. Start now. Use a tool that supports markdown, code blocks and fast search: <strong>Obsidian</strong>, <strong>Joplin</strong> and <strong>CherryTree</strong> are popular, free choices, and Notion works if you are comfortable with cloud storage. Keep notes on the material you study, not just on the machines you hack.
        </P>
        <P>
          Organise notes so you can find a technique under pressure. A proven structure has three parts: <strong>concept notes</strong> (what is Kerberos? what is SUID?), <strong>methodology checklists</strong> (what do I check first on a Linux box? on a web app?), and <strong>engagement or machine notes</strong> (what I found on target X, with commands and output). Always record the exact command, what it did and why you ran it. When you later write professional reports, those habits are exactly what clients pay for.
        </P>
        <Pre label="A MINIMAL MACHINE NOTE TEMPLATE">
{`# Target: 10.10.11.42  (HTB "Example")       Date: 2026-11-11
## Recon
nmap -sC -sV -oN nmap/initial 10.10.11.42
  22/tcp  OpenSSH 9.6p1
  80/tcp  nginx 1.24.0  -> redirects to http://example.htb
## Enumeration
- added example.htb to /etc/hosts
- gobuster: /admin (403), /backup (200) -> config.bak with DB password
## Foothold
- password reuse: ssh dev@10.10.11.42 with DB password
## Privilege escalation
- sudo -l -> (root) NOPASSWD: /usr/bin/find  -> GTFOBins
## Lessons learned
- always try found passwords against every service
- check sudo -l immediately after landing`}
        </Pre>

        <H3>Build, Break, Read, Repeat</H3>
        <P>
          The most effective learning loop in this field has four steps. <strong>Build</strong> something: set up a web server, a small Active Directory domain, a SIEM, a vulnerable app. Building teaches you how systems work and how they are usually misconfigured. <strong>Break</strong> it: attack your own lab, or solve a CTF machine. Struggle for a while before seeking help, because the struggle is where learning happens. <strong>Read</strong> how others did it: after you finish (or get truly stuck), read write-ups and watch walkthroughs. Well-known resources include 0xdf&apos;s blog and IppSec&apos;s videos for Hack The Box, the official TryHackMe room guides, and conference talks on YouTube. Note every technique you did not know. <strong>Repeat</strong> and teach: write your own write-ups (for retired machines only, respecting platform rules), explain concepts to others, and publish on a blog or GitHub. Teaching exposes gaps in your understanding, and a public portfolio is often more persuasive to employers than any certificate.
        </P>
        <P>
          Two more habits compound over time. Learn a scripting language early: <strong>Python</strong> for automation and tooling, and <strong>bash</strong> and <strong>PowerShell</strong> for working on systems. Even 50-line scripts that parse output or automate a repetitive check will set you apart. And stay current: follow a few reliable news sources, read vendor advisories and incident reports, and join a community, whether a local meetup, an OWASP chapter, a university club or an online Discord. Kenya and the wider region have active security communities and conferences, and showing up is how many people find mentors and their first opportunity.
        </P>
        <Note type="info">
          Use AI assistants, including GHOST in this platform, as a tutor rather than an answer machine. Ask them to explain why a command works, to quiz you, or to review your notes. Copying answers you do not understand leaves you stuck the first time you face something new, which in this field is every day.
        </Note>

        <H3>The GHOSTNET Map</H3>
        <P>
          GHOSTNET is designed as a progression. Foundations (this module) gives you the vocabulary. The networking and web modules then teach the two attack surfaces you will meet everywhere, and cryptography explains the protections you will see on both. From there, specialist tracks branch out. You can follow your interests, but the arrows below show which modules assume knowledge from others. Each module has concept chapters followed by a guided lab and a free practice terminal, and your progress, XP and rank follow you across them.
        </P>
        <Pre label="HOW THE MODULES CONNECT">
{`                         MOD-00  FOUNDATIONS  (you are here)
                                      |
        +-----------------+-----------+-----------+------------------+
        |                 |                       |                  |
  MOD-08 NETWORK     MOD-06 WEB             MOD-03 CRYPTO      MOD-02 OSINT
  ATTACKS            ATTACKS                      |                  |
        |                 |                       |            MOD-01 TOR &
        |                 |                       |            DARK WEB
        +--------+--------+                       |                  |
                 |                                |            MOD-10 SOCIAL
        +--------+---------+----------------------+            ENGINEERING
        |                  |                      |
  MOD-05 ACTIVE      MOD-04 OFFENSIVE &     MOD-09 CLOUD
  DIRECTORY          EXPLOIT DEV            SECURITY
        |                  |                      |
        |            MOD-07 MALWARE         MOD-13 MOBILE
        |            ANALYSIS               SECURITY
        |                  |
        +--------+---------+------- MOD-12 WIRELESS ATTACKS (needs MOD-08)
                 |
          MOD-11 RED TEAM OPERATIONS   (capstone: uses everything above)`}
        </Pre>
        <Table
          headers={['If You Want To...', 'Go Next', 'Then']}
          rows={[
            ['Understand how attackers find targets', 'MOD-02 OSINT', 'MOD-10 Social Engineering'],
            ['Become a penetration tester', 'MOD-08 Network Attacks', 'MOD-06 Web, MOD-05 Active Directory, MOD-04 Offensive'],
            ['Become a SOC analyst', 'MOD-08 Network Attacks', 'MOD-07 Malware Analysis, MOD-05 detection sections'],
            ['Work in cloud security', 'MOD-06 Web Attacks', 'MOD-09 Cloud Security, MOD-03 Cryptography'],
            ['Understand privacy and anonymity', 'MOD-01 Tor & Dark Web', 'MOD-03 Cryptography'],
            ['Do it all, eventually', 'Work through MOD-01 to MOD-10', 'MOD-11 Red Team as the capstone'],
          ]}
        />
        <P>
          Before moving on, complete the Foundations lab. It drops you onto a fresh Linux box and walks you through the reflexes every operator uses on day one: orienting yourself, reading files, searching, checking permissions and privileges, inspecting processes and network services, querying DNS and HTTP, reading authentication logs, and decoding and verifying data. When those twenty commands feel natural, you are ready for MOD-01.
        </P>
      </div>
    ),
  },
]

export default function FoundationsPage() {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Breadcrumb */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem',
        fontFamily: mono, fontSize: '0.7rem', color: '#4a7080'
      }}>
        <Link href="/" style={{ color: '#4a7080', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>&#8250;</span>
        <span style={{ color: accent }}>MOD-00 // FOUNDATIONS</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link href="/modules/tor" style={{
            fontFamily: mono, fontSize: '0.65rem', color: '#4a7080',
            textDecoration: 'none', letterSpacing: '0.05em'
          }}>
            MOD-01: TOR &amp; DARK WEB &#8594;
          </Link>
        </div>
      </div>

      {/* Page header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{
          fontFamily: mono, fontSize: '9px', letterSpacing: '0.2em',
          color: '#4a7080', textTransform: 'uppercase', marginBottom: '0.5rem'
        }}>
          MODULE 00 &middot; FOUNDATIONS
        </div>
        <h1 style={{
          fontFamily: mono, fontSize: '2rem', fontWeight: 700, color: accent,
          margin: '0.5rem 0', lineHeight: 1.1, textShadow: '0 0 20px rgba(127,219,255,0.4)'
        }}>
          FOUNDATIONS: ZERO TO OPERATOR
        </h1>
        <p style={{ color: '#4a7080', fontFamily: mono, fontSize: '0.75rem', lineHeight: 1.6 }}>
          Operating systems &middot; Linux command line &middot; Networking &middot; The web &middot; Windows &middot; Security concepts &middot; Safe labs &amp; the law &middot; Learning paths
        </p>
      </div>

      {/* Chapter overview stats */}
      <div className="module-stat-grid">
        {[
          ['10', 'CHAPTERS'],
          ['~3hr', 'TOTAL READ'],
          ['BEGINNER', 'DIFFICULTY'],
          ['MOD-00', 'IDENTIFIER'],
        ].map(([val, label], i) => (
          <div key={i} style={{ background: 'rgba(127,219,255,0.04)', border: '1px solid rgba(127,219,255,0.15)', borderRadius: '6px', padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontFamily: mono, fontSize: '1.2rem', fontWeight: 700, color: accent }}>{val}</div>
            <div style={{ fontFamily: mono, fontSize: '0.6rem', color: '#2a5566', letterSpacing: '0.15em', marginTop: '2px' }}>{label}</div>
          </div>
        ))}
      </div>

      <ModuleCodex moduleId="foundations" accent={accent} chapters={chapters} />

      {/* Bottom navigation */}
      <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid #0b2530' }}>
        <div style={{ background: 'rgba(127,219,255,0.04)', border: '1px solid rgba(127,219,255,0.2)', borderRadius: '8px', padding: '2rem', textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontFamily: mono, fontSize: '0.65rem', color: '#2a5566', letterSpacing: '0.25em', marginBottom: '0.5rem' }}>READY TO PRACTICE?</div>
          <div style={{ fontFamily: mono, fontSize: '1rem', color: accent, marginBottom: '0.5rem', fontWeight: 600 }}>MOD-00 Interactive Lab</div>
          <div style={{ fontFamily: mono, fontSize: '0.75rem', color: '#2a5566', marginBottom: '1.5rem' }}>20 steps &middot; 300 XP &middot; Real commands &middot; Flag captures</div>
          <Link href="/modules/foundations/lab" style={{ textDecoration: 'none', fontFamily: mono, fontSize: '0.85rem', color: accent, padding: '12px 32px', border: '1px solid rgba(127,219,255,0.6)', borderRadius: '6px', background: 'rgba(127,219,255,0.1)', fontWeight: 700, letterSpacing: '0.12em', boxShadow: '0 0 20px rgba(127,219,255,0.15)', display: 'inline-block' }}>
            LAUNCH LAB &#8594;
          </Link>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Link href="/modules/tor" style={{ textDecoration: 'none', fontFamily: mono, fontSize: '0.75rem', color: '#2a5566' }}>MOD-01: TOR &amp; DARK WEB &#8594;</Link>
        </div>
      </div>
    </div>
  )
}
