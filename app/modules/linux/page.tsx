'use client'
import React from 'react'
import Link from 'next/link'
import ModuleCodex, { CodexChapter } from '@/app/components/ModuleCodex'
import { Local } from '@/app/components/learn/Mtaani'

const mono = 'JetBrains Mono, monospace'
const accent = '#73c991'

// Authoring rule for this module (GHOSTNET CLAUDE.md): code samples live in Pre backtick
// strings, so they never contain a dollar sign followed by an opening brace and never contain
// backslashes or backticks. Shell variables are written as $VAR or "$VAR". Paths use forward
// slashes. In JSX prose, apostrophes are written &apos; and ampersands &amp;.

const Pre = ({ label, children }: { label?: string; children: string }) => (
  <div style={{ margin: '1rem 0 1.5rem' }}>
    {label && (
      <div style={{ fontFamily: mono, fontSize: '9px', color: '#5f7d67', letterSpacing: '0.15em', marginBottom: '4px', paddingLeft: '4px' }}>
        {label}
      </div>
    )}
    <pre style={{
      background: '#060a07', border: '1px solid #17271b', borderRadius: '4px',
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
    color: '#8fd6ab', marginTop: '2rem', marginBottom: '0.75rem'
  }}>
    &#9658; {children}
  </h3>
)

const P = ({ children }: { children: React.ReactNode }) => (
  <p style={{ color: '#8a9a8e', lineHeight: 1.8, marginBottom: '1rem', fontSize: '0.9rem' }}>
    {children}
  </p>
)

const Note = ({ type, children }: { type?: 'info' | 'warn' | 'danger' | 'tip'; children: React.ReactNode }) => {
  const configs: Record<string, [string, string, string]> = {
    info: ['#73c991', 'rgba(115,201,145,0.05)', 'NOTE'],
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
      <div style={{ color: '#8a9a8e', fontSize: '0.85rem', lineHeight: 1.7 }}>{children}</div>
    </div>
  )
}

const Table = ({ headers, rows }: { headers: string[]; rows: string[][] }) => (
  <div style={{ overflowX: 'auto', margin: '1rem 0 1.5rem' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: mono, fontSize: '0.75rem' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid #17271b' }}>
          {headers.map((h, i) => (
            <th key={i} style={{ textAlign: 'left', padding: '8px 12px', color: '#8fd6ab', fontWeight: 600, letterSpacing: '0.1em', fontSize: '0.7rem' }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} style={{ borderBottom: '1px solid #0e1a11', background: i % 2 === 0 ? 'transparent' : 'rgba(115,201,145,0.02)' }}>
            {row.map((cell, j) => (
              <td key={j} style={{ padding: '8px 12px', color: '#8a9a8e', verticalAlign: 'top' }}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

const chapters: CodexChapter[] = [
  // ─────────────────────────── CHAPTER 1 ───────────────────────────
  {
    id: 'why-linux',
    title: 'Why Linux Runs the World',
    difficulty: 'BEGINNER',
    readTime: '18 min',
    labLink: '/modules/linux/lab',
    takeaways: [
      'Linux is a kernel; a distribution bundles that kernel with tools, a package manager and a desktop to make a usable operating system.',
      'Linux powers the vast majority of web servers, all of the top supercomputers, most of the public cloud and, through Android, billions of phones.',
      'Open source means you can read, audit, modify and redistribute the code - a property that makes Linux trustworthy for security work.',
      'Security tooling targets Linux first because the OS exposes raw sockets, ptrace, /proc and a scriptable shell without fighting you.',
      'Learning Linux is learning the machine itself: nearly every other topic on this platform runs on top of it.',
    ],
    content: (
      <div>
        <H3>The Operating System Underneath Everything</H3>
        <P>
          Before you can attack, defend, or even understand a modern computer system, you need to understand the software that sits between every program and the hardware: the operating system. On the internet, in the cloud, and inside most of the devices around you, that operating system is Linux. If you are coming from Windows or macOS, this module is where the real picture of computing opens up, because Linux does not hide the machine from you. It hands you the controls.
        </P>
        <P>
          An operating system has one core job: to share a computer&apos;s hardware (CPU, memory, disks, network cards) safely between many running programs. It decides which program runs on the processor right now, stops one program from reading another&apos;s memory, and turns a request like &quot;open this file&quot; into the exact electrical signals a disk understands. The piece of software that does this lowest-level work is called the kernel, and the Linux kernel is the beating heart of every Linux system.
        </P>

        <H3>Kernel vs Distribution - The Most Important Distinction</H3>
        <P>
          People say &quot;Linux&quot; loosely, but precisely speaking Linux is only the kernel, first released by Linus Torvalds in 1991. A kernel on its own is not something you can use day to day - it is an engine with no car around it. To get a usable system you need a shell to type commands into, utilities like a text editor and a file copier, a way to install new software, and usually a graphical desktop. A distribution (a &quot;distro&quot;) is a complete, curated bundle of the Linux kernel plus all of that surrounding software, assembled and maintained by a project or company.
        </P>
        <Table
          headers={['Layer', 'What it is', 'Examples']}
          rows={[
            ['Kernel', 'Manages CPU, memory, devices, filesystems, networking', 'Linux (the kernel)'],
            ['Core utilities', 'Basic commands: ls, cp, bash, coreutils, GNU tools', 'GNU userland, systemd'],
            ['Package manager', 'Installs and updates software, resolves dependencies', 'apt, dnf, pacman'],
            ['Desktop environment', 'The graphical shell: windows, menus, settings', 'GNOME, KDE, XFCE'],
            ['Distribution', 'All of the above, packaged together', 'Ubuntu, Fedora, Kali, Arch'],
          ]}
        />
        <Note type="info">
          When you &quot;install Linux&quot; you are really installing a distribution. The same kernel can sit under Ubuntu, Fedora, and Kali - what differs is the choice of tools, defaults, release cadence and polish layered on top.
        </Note>

        <H3>What Open Source Actually Means</H3>
        <P>
          Linux is free and open source software. &quot;Free&quot; here means freedom, not just price: you are legally allowed to run the software for any purpose, read its complete source code, modify it, and share your modified version. The Linux kernel is licensed under the GNU General Public License version 2 (GPLv2). This is not a technicality - it is the reason Linux is trustworthy infrastructure. When the code is public, thousands of engineers, companies, and independent researchers can inspect it for bugs and backdoors. A closed operating system asks you to trust a vendor; an open one lets you verify.
        </P>
        <P>
          For a security professional this matters enormously. You can read exactly how the kernel handles a network packet, instrument it, patch it, and recompile it. There is no hidden layer you are forbidden from examining. This same transparency is why the global community of developers can respond to a serious vulnerability within hours rather than waiting for a quarterly patch cycle.
        </P>

        <H3>Where Linux Actually Runs</H3>
        <P>
          It is easy to underestimate Linux because it rarely sits on the laptop in front of you. But step back and look at the whole of computing, and Linux is nearly everywhere that matters.
        </P>
        <Table
          headers={['Domain', 'Linux presence', 'Why']}
          rows={[
            ['Web servers', 'The large majority of public web servers', 'Stable, scriptable, free to deploy at scale'],
            ['Cloud', 'Most instances on AWS, Azure, GCP are Linux', 'Lightweight, automatable, no per-seat licensing'],
            ['Supercomputers', 'All of the TOP500 run Linux', 'Total control over hardware and scheduling'],
            ['Mobile', 'Android (billions of devices) is built on Linux', 'The Android kernel is a Linux kernel'],
            ['Embedded / IoT', 'Routers, TVs, cars, cameras, industrial controllers', 'Small, free, endlessly customisable'],
            ['Containers', 'Docker and Kubernetes are Linux technologies', 'Namespaces and cgroups are kernel features'],
          ]}
        />
        <P>
          When you connect to almost any website, your request is answered by a Linux server. When you open an app on an Android phone, a Linux kernel schedules it. When a company spins up computing power in the cloud, it is overwhelmingly renting Linux machines. The desktop is the one place Windows and macOS dominate - and even there, Microsoft now ships a real Linux kernel inside Windows through WSL2, which you will meet in Chapter 3.
        </P>

        <H3>Why Hackers and Defenders Live in Linux</H3>
        <P>
          Security work gravitates to Linux for concrete, practical reasons, not fashion. First, the tools are built for it: the industry-standard offensive distributions Kali and Parrot are Linux, and the vast majority of open-source security tooling - nmap, Wireshark, Metasploit, John the Ripper, Burp Suite, aircrack-ng - is written for and best supported on Linux. Second, the operating system gives you direct access to the primitives attacks and analysis depend on: raw network sockets for crafting packets, ptrace for debugging and instrumenting other processes, the /proc filesystem that exposes the live state of every process, and packet capture that just works.
        </P>
        <P>
          Third, and perhaps most important, Linux is scriptable to the core. Every action you can take through a window, you can also take by typing a command - which means you can automate it, chain it, and repeat it a thousand times. An attacker who can script is an attacker who can move at machine speed; a defender who can script is a defender who can watch a thousand servers at once. The shell is not an afterthought bolted onto Linux; it is the native language of the system.
        </P>
        <Pre label="THE SHELL IS THE NATIVE LANGUAGE - A TASTE">
{`# Count how many unique IP addresses hit a web server today,
# sorted by how many requests each one made - one line, no app needed:
cat /var/log/nginx/access.log | awk '{print $1}' | sort | uniq -c | sort -rn | head

# Find every world-writable file on the system (a classic misconfiguration):
find / -type f -perm -0002 2>/dev/null

# Watch new network connections open in real time:
watch -n1 "ss -tunp"`}
        </Pre>
        <Note type="tip">
          Do not try to memorise those commands yet - you will build up to all of them in this module. The point is to feel the difference: on Linux, operating the machine and programming the machine are the same act.
        </Note>

        <H3>The Mindset Shift</H3>
        <P>
          Coming from Windows or macOS, the hardest adjustment is not learning commands - it is accepting that the system expects you to be in charge. It will let you delete critical files, change how the kernel behaves, and rebuild the operating system while it runs. That power is exactly why professionals use it, and exactly why you will spend the next chapter learning to work inside disposable virtual machines and snapshots, so that mistakes cost you seconds, not days.
        </P>
        <P>
          Everything else on this platform - web attacks, network attacks, Active Directory, malware analysis, red teaming - runs on top of the knowledge in this module. Linux is the core infrastructure. Master it here, and the rest of the curriculum stops feeling like magic and starts feeling like engineering.
        </P>
      </div>
    ),
  },

  // ─────────────────────────── CHAPTER 2 ───────────────────────────
  {
    id: 'choosing-distro',
    title: 'Choosing Your Distribution',
    difficulty: 'BEGINNER',
    readTime: '17 min',
    labLink: '/modules/linux/lab',
    takeaways: [
      'Distributions fall into families - Debian/Ubuntu, Red Hat/Fedora, and Arch - that differ in package format, release model and philosophy.',
      'Beginners should start with Ubuntu or Linux Mint: huge community, sensible defaults, enormous documentation.',
      'Kali and Parrot are specialised offensive distributions - use them as tools in a lab, not as your daily operating system.',
      'Release models matter: fixed/LTS releases prize stability; rolling releases prize fresh software at the cost of more change.',
      'The desktop environment (GNOME, KDE, XFCE) is a separable choice that controls look, feel and resource usage.',
    ],
    content: (
      <div>
        <H3>Why There Are Hundreds of Distros</H3>
        <P>
          Newcomers are often baffled that &quot;Linux&quot; comes in hundreds of versions. The reason follows directly from the last chapter: because anyone can legally take the kernel and build a distribution around it, many groups have, each with different goals. A distro aimed at servers makes different choices than one aimed at artists, which differs again from one built for penetration testers. Rather than memorising all of them, you only need to understand the three great families they descend from, because a distro&apos;s family tells you how you install software and how the system is maintained.
        </P>
        <Table
          headers={['Family', 'Package format', 'Package manager', 'Notable members']}
          rows={[
            ['Debian', '.deb', 'apt / dpkg', 'Debian, Ubuntu, Mint, Kali, Parrot'],
            ['Red Hat', '.rpm', 'dnf / rpm', 'Fedora, RHEL, Rocky, AlmaLinux'],
            ['Arch', '.pkg.tar.zst', 'pacman', 'Arch, Manjaro, EndeavourOS'],
            ['SUSE', '.rpm', 'zypper', 'openSUSE, SLE'],
          ]}
        />
        <P>
          The Debian family is by far the most common, and it is the family this module uses for every example. If you learn Debian/Ubuntu conventions - the apt command, the /etc layout, how services are managed - that knowledge transfers directly to Kali and Parrot, because they are built on Debian too.
        </P>

        <H3>The Beginner-Friendly Choices</H3>
        <P>
          <strong style={{ color: '#a8c8b2' }}>Ubuntu</strong> is the right first distribution for most people. Backed by the company Canonical, it has the largest desktop community, the most beginner-oriented documentation, and the broadest hardware and software support. When you search an error message, Ubuntu is the distro most answers assume. Its Long Term Support (LTS) releases arrive every two years - the current one being Ubuntu 24.04 LTS - and receive five years of free security updates, which makes them an excellent stable base.
        </P>
        <P>
          <strong style={{ color: '#a8c8b2' }}>Linux Mint</strong> is built on top of Ubuntu and is arguably even gentler for someone arriving from Windows. Its default Cinnamon desktop has a familiar taskbar-and-menu layout, it avoids some of Ubuntu&apos;s more controversial choices, and it is light on resources. Mint is a superb choice for reviving an older laptop into a Linux learning machine.
        </P>
        <P>
          <strong style={{ color: '#a8c8b2' }}>Debian</strong> itself sits underneath both. It prizes stability and software freedom above all, with a slower release cycle. It is a fantastic server operating system and a rock-solid base, though its defaults are more spartan than Ubuntu&apos;s. Many professionals run Debian on servers and Ubuntu or Mint on the desktop.
        </P>

        <H3>Fedora and the Red Hat World</H3>
        <P>
          <strong style={{ color: '#a8c8b2' }}>Fedora</strong>, sponsored by Red Hat, is the other mainstream desktop distribution worth knowing. It ships newer software than Ubuntu and is where many technologies that later reach the enterprise are first proven. It uses the dnf package manager and .rpm packages. Its enterprise cousin, Red Hat Enterprise Linux (RHEL), and the free rebuilds Rocky Linux and AlmaLinux, dominate corporate data centres - so if you plan to work as a sysadmin or in cloud operations, Red Hat family knowledge is valuable alongside Debian.
        </P>

        <H3>Arch - Power at the Cost of Hand-Holding</H3>
        <P>
          <strong style={{ color: '#a8c8b2' }}>Arch Linux</strong> follows a &quot;do it yourself&quot; philosophy: you assemble the system from minimal parts, which teaches you how Linux fits together but demands patience. Its wiki is one of the best technical resources on the internet regardless of which distro you run. Arch is a rolling release (more on that below). It is a superb second or third distro once you are comfortable, but a frustrating first one. Manjaro and EndeavourOS make Arch more approachable with installers and sensible defaults.
        </P>
        <Note type="tip">
          A common and healthy path: start on Ubuntu or Mint to get productive fast, then later spin up Arch or Fedora in a virtual machine to broaden your understanding. There is no single &quot;best&quot; distro - there is the best one for your current goal.
        </Note>

        <H3>The Security Distributions: Kali and Parrot</H3>
        <P>
          <strong style={{ color: '#a8c8b2' }}>Kali Linux</strong>, maintained by Offensive Security, is the best-known penetration testing distribution. It is built on Debian and comes with hundreds of security tools preinstalled and categorised - reconnaissance, exploitation, wireless, forensics, and more. <strong style={{ color: '#a8c8b2' }}>Parrot Security OS</strong> is a close alternative, also Debian-based, with a similar toolset plus a stronger emphasis on privacy and a lighter default desktop.
        </P>
        <Note type="warn">
          Kali and Parrot are specialist tools, not daily drivers. They are designed to run many services as root-adjacent, assume you know what you are doing, and are tuned for engagements rather than everyday browsing and email. Treat them the way a mechanic treats a lift and a torque wrench: brought out for the job, in a controlled space - which for you means a virtual machine in an isolated lab, exactly as you will build in Chapter 12.
        </Note>
        <Table
          headers={['Distro', 'Best role', 'Base', 'Who should use it']}
          rows={[
            ['Ubuntu / Mint', 'Daily driver, learning', 'Debian', 'Beginners, most people'],
            ['Debian', 'Servers, stable base', 'Debian (itself)', 'Sysadmins, server hosts'],
            ['Fedora', 'Modern desktop, enterprise prep', 'Red Hat', 'Developers, RHEL-bound'],
            ['Arch', 'Learning internals, customisation', 'Arch (itself)', 'Intermediate+ tinkerers'],
            ['Kali', 'Offensive security engagements', 'Debian', 'Pentesters (in a lab)'],
            ['Parrot', 'Offensive + privacy focus', 'Debian', 'Pentesters, privacy-minded'],
          ]}
        />

        <H3>Release Models: Fixed, LTS and Rolling</H3>
        <P>
          Distros differ not just in their software but in how that software changes over time. In a <strong style={{ color: '#a8c8b2' }}>fixed release</strong> model (Ubuntu, Debian, Fedora), the distro ships a version, then holds most software at that version - delivering only security and bug fixes - until the next scheduled release. This means stability: the system you tested last month behaves the same today. An <strong style={{ color: '#a8c8b2' }}>LTS (Long Term Support)</strong> release extends that stability for years, which is why servers run LTS.
        </P>
        <P>
          In a <strong style={{ color: '#a8c8b2' }}>rolling release</strong> model (Arch, and Kali by default), there are no big version jumps; software is continuously updated to the latest upstream versions. You always have the newest tools - valuable for security work where a fresh exploit module matters - but you accept more frequent change and the small risk that an update breaks something. For a pentesting lab, Kali&apos;s rolling model is a feature; for a production server, a fixed LTS is the responsible choice.
        </P>

        <H3>Desktop Environments - A Separate Choice</H3>
        <P>
          A detail that confuses newcomers: the look and feel of the graphical interface is not fixed by the distro. It is provided by a separate layer called the desktop environment, and most distros let you pick or swap it. The desktop environment controls your panels, menus, window decorations, settings app, and how much memory the interface consumes.
        </P>
        <Table
          headers={['Desktop', 'Character', 'Resource use', 'Good for']}
          rows={[
            ['GNOME', 'Modern, minimal, opinionated', 'Heavier', 'Ubuntu/Fedora defaults'],
            ['KDE Plasma', 'Feature-rich, highly configurable', 'Moderate', 'Power users who love options'],
            ['XFCE', 'Lightweight, traditional', 'Light', 'Older hardware, VMs, Kali'],
            ['Cinnamon', 'Familiar Windows-like layout', 'Moderate', 'Mint, Windows switchers'],
            ['MATE / LXQt', 'Very light, classic', 'Very light', 'Low-spec machines'],
          ]}
        />
        <P>
          For a virtual machine or a lab box, a light desktop like XFCE is ideal - it leaves more of your host&apos;s CPU and memory for the actual work. Kali ships XFCE by default for exactly this reason. For a comfortable daily desktop on capable hardware, GNOME and KDE are both excellent. None of this is permanent: you can install a second desktop and choose between them at the login screen, so experimenting costs nothing.
        </P>
        <Note type="info">
          Decision shortcut: if you just want to get started and follow this module, install Ubuntu 24.04 LTS (or Mint) in a virtual machine. For the hands-on offensive labs later in the platform, add a Kali virtual machine. You do not have to choose only one - the whole point of virtual machines, which you will meet next, is that you can run several at once.
        </Note>
      </div>
    ),
  },

  // ─────────────────────────── CHAPTER 3 ───────────────────────────
  {
    id: 'getting-linux-running',
    title: 'Getting Linux Running - Every Option',
    difficulty: 'BEGINNER',
    readTime: '24 min',
    labLink: '/modules/linux/lab',
    takeaways: [
      'A virtual machine is the safest way to run Linux: fully isolated, disposable, and snapshot-able so mistakes cost seconds.',
      'Always take a snapshot before any risky experiment - restoring rolls the entire machine back to a known-good state instantly.',
      'WSL2 gives Windows a real Linux kernel and is ideal for command-line work, with limits around GUIs, networking and hardware access.',
      'Dual-boot and bare-metal give full performance but put your real data at risk - back up first and understand UEFI/Secure Boot.',
      'For labs, isolate networks (host-only/internal) so target machines can never touch the real internet or your home network.',
    ],
    content: (
      <div>
        <H3>The Decision That Comes First</H3>
        <P>
          There are many ways to run Linux, and they trade off three things: how isolated Linux is from your real system, how much hardware performance you get, and how much risk you take with your existing data. For learning and for security work, isolation and safety almost always win, which is why this chapter spends the most time on virtual machines. Read the whole chapter, then use the decision table at the end to pick.
        </P>
        <Table
          headers={['Your goal', 'Best option', 'Why']}
          rows={[
            ['Learn Linux safely, keep Windows/Mac', 'VirtualBox VM', 'Isolated, free, snapshots'],
            ['Command-line work on Windows', 'WSL2', 'Fast, integrated, no reboot'],
            ['Build a hacking lab', 'VMs on a host-only network', 'Isolation + multiple machines'],
            ['Maximum performance, commit fully', 'Bare-metal install', 'Native speed, all hardware'],
            ['Keep Windows but run Linux natively', 'Dual-boot', 'Native speed, choose at boot'],
            ['Try without installing anything', 'Live USB', 'Runs from RAM, no changes'],
            ['A server reachable from anywhere', 'Cloud VPS', 'Always on, public, cheap'],
          ]}
        />

        <H3>(a) VirtualBox - The Recommended Starting Point</H3>
        <P>
          A virtual machine (VM) is a complete computer simulated in software. The program that runs it - a hypervisor - pretends to be hardware, so a full Linux distribution installs and runs inside a window on your existing Windows or Mac, believing it has its own CPU, disk and network card. Nothing it does touches your real operating system. Oracle VirtualBox is free, cross-platform, and the easiest hypervisor to start with.
        </P>
        <P>
          The workflow is always the same: download VirtualBox and install it; download the distribution&apos;s ISO file (a disk image, e.g. the Ubuntu 24.04 installer); then create a new VM and point it at the ISO.
        </P>
        <Pre label="VIRTUALBOX - CREATE AND INSTALL (CONCEPTUAL STEPS)">
{`1. Install VirtualBox + the Extension Pack (USB, better video).
2. Machine -> New:
     Name:    ubuntu-24-04
     Type:    Linux
     Version: Ubuntu (64-bit)
3. Allocate resources (rule of thumb, never exceed ~50% of host):
     CPU:   2 vCPUs   (host has 4+)
     RAM:   4096 MB   (host has 8 GB+); 2048 MB minimum
     Disk:  25 GB, dynamically allocated (grows as needed)
4. Settings -> Storage -> attach the downloaded .iso to the optical drive.
5. Start the VM -> the installer boots -> follow it:
     keyboard, timezone, "Erase disk" (this means the VIRTUAL disk only),
     create your user, set a password.
6. Reboot, remove the ISO, log in. You now have Linux.`}
        </Pre>
        <P>
          After installation, install <strong style={{ color: '#a8c8b2' }}>Guest Additions</strong> - a package of drivers that lets the VM resize its window smoothly, share the clipboard, and perform better graphically. In VirtualBox the menu is Devices then &quot;Insert Guest Additions CD image&quot;, after which you run its installer inside the guest. <strong style={{ color: '#a8c8b2' }}>Shared folders</strong> let a folder on your host appear inside the VM, which is handy for moving files in and out without a network transfer.
        </P>
        <Pre label="INSTALL GUEST ADDITIONS INSIDE AN UBUNTU GUEST">
{`# Prerequisites the build needs, then mount and run the installer:
sudo apt update
sudo apt install -y build-essential dkms linux-headers-$(uname -r)
# Devices -> Insert Guest Additions CD image, then:
sudo mount /dev/cdrom /mnt
sudo /mnt/VBoxLinuxAdditions.run
sudo reboot
# Add yourself to the shared-folder group so mounts are readable:
sudo usermod -aG vboxsf $USER`}
        </Pre>
        <Note type="danger">
          Snapshots are the single most important habit in this entire module. A snapshot saves the exact state of the whole VM - disk and memory - so you can return to it later with one click. Before installing a risky tool, detonating malware, or trying a dangerous command, take a snapshot. If anything breaks, restore it and you are back to a clean machine in seconds. In VirtualBox: the Snapshots tab, &quot;Take&quot;. Name them clearly, e.g. &quot;clean-install&quot;, &quot;tools-installed&quot;.
        </Note>

        <H3>(b) VMware and Apple Silicon Options</H3>
        <P>
          <strong style={{ color: '#a8c8b2' }}>VMware Workstation Pro</strong> (Windows/Linux) and <strong style={{ color: '#a8c8b2' }}>VMware Fusion</strong> (Mac) are mature, polished hypervisors that are now free for personal use. Many professionals prefer VMware for smoother performance and better snapshots. The concepts are identical to VirtualBox: create a VM, allocate CPU/RAM/disk, boot an ISO, install VMware Tools (the equivalent of Guest Additions), and use snapshots.
        </P>
        <P>
          If you are on an <strong style={{ color: '#a8c8b2' }}>Apple Silicon Mac</strong> (M1/M2/M3/M4), remember the CPU is ARM-based, not Intel x86. You must run ARM builds of Linux (for example the ARM64 ISO of Ubuntu or Kali). <strong style={{ color: '#a8c8b2' }}>UTM</strong> is a free, friendly hypervisor for Apple Silicon, and VMware Fusion also supports ARM guests. Running x86-only tools may require emulation, which is slower - plan your lab around ARM-native images where possible.
        </P>

        <H3>(c) WSL2 on Windows - Linux Without a VM</H3>
        <P>
          The Windows Subsystem for Linux version 2 (WSL2) is Microsoft&apos;s built-in way to run a genuine Linux kernel inside Windows. Unlike a full VM, it integrates tightly: Linux files and Windows files are mutually accessible, and you launch a Linux shell as just another window. For command-line development, scripting, and learning the shell, WSL2 is excellent and fast.
        </P>
        <Pre label="INSTALL WSL2 (RUN IN AN ADMIN POWERSHELL)">
{`# One command installs WSL2 and Ubuntu by default:
wsl --install

# List distributions you can install, then pick one:
wsl --list --online
wsl --install -d kali-linux
wsl --install -d Debian

# Manage installed distros:
wsl --list --verbose          # shows name, state, WSL version
wsl --set-default Ubuntu      # choose the default
wsl --shutdown                # stop all distros
# First launch of a distro asks you to create a Linux username + password.`}
        </Pre>
        <P>
          WSL2 has real limits you must understand. Historically it ran without full systemd, though modern WSL2 now supports systemd when enabled in /etc/wsl.conf. Graphical Linux apps work through WSLg but it is not a full desktop environment. Networking is translated through a virtual adapter, so some low-level operations - raw packet capture on the real network interface, promiscuous-mode wireless attacks, or anything needing direct hardware - either do not work or behave differently than on bare metal or a bridged VM. For everyday shell work WSL2 is ideal; for wireless attacks and certain network labs you still want a proper VM or hardware.
        </P>
        <Note type="tip">
          Enable systemd in WSL2 by creating /etc/wsl.conf with a [boot] section that sets systemd=true, then run wsl --shutdown and reopen. This makes services like ssh behave the way they do on a normal Linux box.
        </Note>

        <H3>(d) Dual-Boot Alongside Windows</H3>
        <P>
          Dual-booting installs Linux onto your real disk next to Windows, and a boot menu lets you choose which to start. You get full native performance and real hardware access - but you are now editing the partition layout of the disk that holds your data, which carries genuine risk.
        </P>
        <Note type="danger">
          Back up everything before you begin. Repartitioning can go wrong, and a mistake can make Windows unbootable or erase data. Do not dual-boot a machine whose data you cannot afford to lose without a verified backup.
        </Note>
        <P>
          Modern PCs boot with UEFI firmware rather than the old BIOS, and most have <strong style={{ color: '#a8c8b2' }}>Secure Boot</strong> enabled, which only allows signed boot loaders. Mainstream distros (Ubuntu, Fedora) are signed and boot fine with Secure Boot on; some others require you to disable it in firmware settings. The practical steps: shrink the Windows partition from within Windows Disk Management to free space, disable Windows &quot;Fast Startup&quot; (it locks the disk), boot the Linux installer, and choose &quot;Install alongside&quot; so the installer sets up partitions and the GRUB boot menu for you. Install Linux after Windows, not before, so GRUB can detect and offer both.
        </P>

        <H3>(e) Full Bare-Metal Install</H3>
        <P>
          A bare-metal install wipes the disk and dedicates the whole machine to Linux. This gives maximum performance and the simplest configuration - no boot menu, no shared disk - and is the right choice for a dedicated lab machine, an old laptop you are repurposing, or a server. The process is the same as any installer, except you let it use the entire disk. Because there is nothing else on the machine, there is no data to endanger once you have moved anything you need off it.
        </P>

        <H3>(f) Live USB and Persistent USB</H3>
        <P>
          A live USB boots a complete Linux system directly from a flash drive, running in your computer&apos;s RAM without touching the internal disk at all. It is the perfect way to try a distro, rescue a broken system, or run a known-clean environment for sensitive work. You write the ISO to a USB stick with a tool, then boot from it.
        </P>
        <Table
          headers={['Tool', 'Platform', 'Strength']}
          rows={[
            ['Rufus', 'Windows', 'Fast, reliable, handles UEFI options'],
            ['balenaEtcher', 'Win/Mac/Linux', 'Simple, hard to get wrong'],
            ['Ventoy', 'Win/Mac/Linux', 'Copy many ISOs onto one stick, pick at boot'],
            ['dd', 'Linux/Mac', 'Built-in, powerful, unforgiving'],
          ]}
        />
        <P>
          <strong style={{ color: '#a8c8b2' }}>Ventoy</strong> deserves special mention: you install it once onto a USB drive, then simply copy ISO files onto the drive like ordinary files. At boot it shows a menu of every ISO present. One stick can carry Ubuntu, Kali, and a rescue tool at once. A <strong style={{ color: '#a8c8b2' }}>persistent</strong> live USB adds a writable area so your changes and files survive reboots, turning the stick into a portable, bootable Linux system.
        </P>
        <Pre label="WRITE AN ISO TO USB WITH dd (LINUX/MAC - DANGEROUS)">
{`# First IDENTIFY the USB device - get this wrong and you wipe the WRONG disk:
lsblk                               # Linux: find e.g. /dev/sdb (NOT a partition like sdb1)
# Then write (replace /dev/sdX with the real device):
sudo dd if=ubuntu-24.04.iso of=/dev/sdX bs=4M status=progress conv=fsync
sync`}
        </Pre>
        <Note type="danger">
          dd does exactly what you tell it with no confirmation - its nickname is &quot;disk destroyer&quot;. Triple-check the of= target is the USB stick and not your system disk. For beginners, balenaEtcher or Ventoy are far safer.
        </Note>

        <H3>(g) A Cloud VPS over SSH</H3>
        <P>
          A Virtual Private Server (VPS) is a Linux machine rented from a cloud provider - DigitalOcean, AWS Lightsail, Linode, Hetzner - that runs continuously in a data centre and that you control remotely over SSH (covered fully in Chapter 11). It costs a few dollars a month, is always on, and has a real public IP address, which makes it the natural home for a personal website, a practice server, or infrastructure you want reachable from anywhere.
        </P>
        <Pre label="SPIN UP AND CONNECT TO A VPS">
{`# After creating a droplet/instance in the provider's console and adding your
# SSH public key, connect from your own machine:
ssh root@203.0.113.10

# First things on any new public server (see Chapter 12 for the full hardening):
apt update && apt upgrade -y
adduser analyst && usermod -aG sudo analyst   # a non-root user
# then log in as that user and lock down SSH.`}
        </Pre>
        <Note type="warn">
          A cloud VPS is exposed to the entire internet the moment it boots, and automated attacks will probe it within minutes. Never use a public VPS as your vulnerable lab target - keep deliberately insecure machines on an isolated private network, as the next section and Chapter 12 explain.
        </Note>

        <H3>Best Practices for Any Lab</H3>
        <P>
          Whichever option you choose, three habits separate people who learn safely from people who lose work and wreck machines. First, <strong style={{ color: '#a8c8b2' }}>always snapshot</strong> before anything risky - it is free and it is your undo button for the entire operating system. Second, <strong style={{ color: '#a8c8b2' }}>isolate lab networks</strong>: when you run vulnerable targets, put them on a VirtualBox/VMware host-only or internal network so they can reach your attacker VM but never the internet or your home LAN. Third, <strong style={{ color: '#a8c8b2' }}>never test on hardware you cannot restore</strong> - the whole discipline of virtualisation exists so that a destroyed machine is a thirty-second rebuild rather than a disaster.
        </P>
        <Table
          headers={['VM network mode', 'Can reach internet?', 'Can reach host?', 'Use for']}
          rows={[
            ['NAT (default)', 'Yes', 'No (by default)', 'Updating a VM, general use'],
            ['Host-only', 'No', 'Yes', 'Isolated lab targets'],
            ['Internal', 'No', 'No', 'VM-to-VM only, fully sealed labs'],
            ['Bridged', 'Yes (as a LAN peer)', 'Yes', 'VM visible on your real network'],
          ]}
        />
        <P>
          A typical safe lab, which you will assemble in Chapter 12, is a Kali attacker VM and one or more deliberately vulnerable target VMs, all joined by a host-only network. The targets get updated once over NAT, then switched to host-only and snapshotted, after which nothing you do inside the lab can escape to the wider world. Build that habit now and every later module becomes a place to play rather than a place to fear.
        </P>
      </div>
    ),
  },

  // ─────────────────────────── CHAPTER 4 ───────────────────────────
  {
    id: 'first-contact',
    title: 'First Contact: Desktop, Terminal and Getting Help',
    difficulty: 'BEGINNER',
    readTime: '16 min',
    labLink: '/modules/linux/lab',
    takeaways: [
      'The shell is a program that reads your typed commands and runs them; the terminal is the window the shell runs in.',
      'The prompt tells you who you are, which machine, and where you are - and whether you are root ($ vs #).',
      'A command is a program name followed by options (flags) and arguments; learning this grammar unlocks every tool.',
      'man, --help and tldr are your built-in teachers - reach for them before searching the web.',
      'The GUI and the terminal are both valid; professionals lean on the terminal because it is precise, scriptable and remote-friendly.',
    ],
    content: (
      <div>
        <H3>Two Ways to Drive the Same Machine</H3>
        <P>
          Every Linux system offers two ways to give it instructions. The graphical user interface (GUI) is the desktop you click around in - windows, icons, menus - and it is perfectly good for browsing, writing, and configuration. The command-line interface (CLI) is where you type commands as text and the system types results back. Both control the same underlying system. The reason this module, and the security field as a whole, lives in the CLI is that text commands are precise, repeatable, scriptable, and work over a remote connection to a server that has no screen at all. A server in a data centre has no monitor; you reach it by typing.
        </P>

        <H3>Shell vs Terminal - A Clear Distinction</H3>
        <P>
          Two words get confused constantly. The <strong style={{ color: '#a8c8b2' }}>terminal</strong> (or terminal emulator) is the application window that shows text and accepts your keystrokes - think of it as the screen and keyboard. The <strong style={{ color: '#a8c8b2' }}>shell</strong> is the program running inside that window which actually reads your commands, runs the right program, and shows the output - think of it as the interpreter. The most common shell on Linux is <strong style={{ color: '#a8c8b2' }}>Bash</strong> (the Bourne Again Shell); another popular one is Zsh. When people say &quot;open a terminal&quot;, they mean start that window so a shell is ready for you.
        </P>
        <P>
          You open a terminal from the applications menu (it is called Terminal, Konsole, or similar), or on most desktops with the shortcut Ctrl+Alt+T. On a server reached by SSH, the shell is what greets you the instant you connect.
        </P>

        <H3>Anatomy of the Prompt</H3>
        <P>
          Before the cursor, the shell prints a prompt that is packed with information. Reading it fluently is the first real skill. A typical default prompt looks like this:
        </P>
        <Pre label="READING THE PROMPT">
{`analyst@ghost-lab:~/projects$
|       |         |       |
|       |         |       +--  $ = normal user   (a # here means ROOT)
|       |         +----------  current directory  (~ = your home folder)
|       +--------------------  hostname  (the machine's name)
+----------------------------  username  (who you are logged in as)

# The same machine, but now you are root - note the # :
root@ghost-lab:/etc#`}
        </Pre>
        <Note type="warn">
          The final character is the one to watch. A dollar sign ($) means you are a normal, limited user. A hash/pound sign (#) means you are root - the all-powerful administrator who can change or destroy anything. Seeing # should make you slow down and read the command twice before pressing Enter.
        </Note>

        <H3>The Grammar of a Command</H3>
        <P>
          Nearly every command follows the same three-part grammar: the command name, then options (also called flags), then arguments. The command name is the program to run. Options, usually starting with a dash, adjust how it behaves. Arguments are the things it acts on, such as a filename. Learn this pattern once and every tool in Linux becomes readable.
        </P>
        <Pre label="COMMAND GRAMMAR">
{`ls -l -a /etc
|  |  |  |
|  |  |  +--- argument: WHAT to act on (the /etc directory)
|  |  +------ option: -a  (also show hidden files)
|  +--------- option: -l  (long format, one per line with details)
+------------ command: ls (list directory contents)

# Short options can usually be combined:
ls -la /etc        # same as -l -a

# Long options are spelled out with two dashes and are self-documenting:
ls --all --human-readable /etc`}
        </Pre>
        <P>
          Options come in two styles you will see side by side: short options are a single dash and a letter (-l), and can be bundled (-la). Long options are two dashes and a readable word (--all), which make scripts easier to understand later. Arguments without a leading dash are the targets - the file, directory, user, or value the command works on.
        </P>

        <H3>Your Built-In Teachers: man, --help, tldr</H3>
        <P>
          You do not need to memorise commands, and you certainly should not guess. Linux documents itself. Three tools answer almost any &quot;how does this work&quot; question without leaving the terminal, and reaching for them first is a mark of competence.
        </P>
        <Pre label="GETTING HELP">
{`man ls          # the full MANUAL page for ls - authoritative, thorough
                # navigate: arrows / Space to page, /word to search, q to quit

ls --help       # a quick summary of options, printed right in the terminal
                # most commands support --help; faster than man for a reminder

tldr ls         # community "too long; didn't read" page: just practical examples
                # install with:  sudo apt install tldr   (then: tldr <command>)

apropos copy    # search the manuals by keyword - "which command copies files?"
type ls         # what IS this command - a program, alias, or shell builtin?`}
        </Pre>
        <Note type="tip">
          A good loop when you meet a new command: run tldr COMMAND for instant examples, then man COMMAND when you need the exact meaning of an option. Only after those fail should you search the web - and even then you will understand the answers better for having read the manual.
        </Note>

        <H3>Manual Sections and Why They Matter</H3>
        <P>
          Manual pages are organised into numbered sections, because the same name can mean different things. For example, there is a command called passwd (section 1) and a configuration file called passwd (section 5). When you need the file, not the command, you ask for the section explicitly.
        </P>
        <Table
          headers={['Section', 'Contents', 'Example']}
          rows={[
            ['1', 'User commands (the programs you run)', 'man 1 passwd'],
            ['5', 'File formats and configuration files', 'man 5 passwd'],
            ['8', 'System administration commands', 'man 8 mount'],
            ['2', 'System calls (kernel interface)', 'man 2 open'],
            ['3', 'Library functions (for programmers)', 'man 3 printf'],
          ]}
        />

        <H3>When to Use the GUI</H3>
        <P>
          None of this means the graphical desktop is wrong. The GUI is genuinely better for some tasks: reading a web page, comparing images, laying out a document, or doing something once that you will never repeat. A wise operator uses the right tool for each job rather than proving a point. The reason professionals still live in the terminal is that their work is repetitive, remote, and precise - exactly the conditions where typing beats clicking. As you progress, you will find yourself preferring the terminal not out of obligation but because it is faster for the things you do often.
        </P>
        <P>
          For the rest of this module, keep a terminal open and type every command you read. Reading about the shell builds no skill; typing in it builds all of it. In the next chapter you will start moving around the filesystem, which is the ground every other command stands on.
        </P>
      </div>
    ),
  },

  // ─────────────────────────── CHAPTER 5 ───────────────────────────
  {
    id: 'filesystem',
    title: 'The Filesystem Hierarchy and Navigation',
    difficulty: 'BEGINNER',
    readTime: '18 min',
    labLink: '/modules/linux/lab',
    takeaways: [
      'Linux has one unified tree starting at the root, /, with no drive letters - every disk is mounted somewhere inside it.',
      'The Filesystem Hierarchy Standard gives each top-level directory a defined job: /etc for config, /var for changing data, /home for users.',
      'An absolute path starts at / and is unambiguous; a relative path starts from where you currently are.',
      'pwd, ls, cd and tree are the four verbs of navigation - print location, list, change, visualise.',
      'In Linux almost everything is a file, including devices and live kernel state under /dev and /proc.',
    ],
    content: (
      <div>
        <H3>One Tree, No Drive Letters</H3>
        <P>
          If you come from Windows, the biggest structural surprise in Linux is that there are no drive letters - no C:, no D:. Instead there is a single tree of directories that begins at one place called the root, written simply as a forward slash: <strong style={{ color: '#a8c8b2' }}>/</strong>. Every file and every directory on the system hangs somewhere beneath that root. When you plug in a USB stick or add a second disk, it does not become a new letter; it is attached (&quot;mounted&quot;) into the existing tree at some directory, for example /media/usb. This unified model is elegant: there is exactly one way to name any file, a path from the root down to it.
        </P>
        <Pre label="THE TOP OF THE TREE">
{`/                     the root of everything
|-- bin   -> usr/bin  essential user commands (ls, cp, cat)
|-- boot              the kernel and bootloader files
|-- dev               device files (disks, terminals, random)
|-- etc               system-wide configuration (text files)
|-- home              users' personal directories
|   '-- analyst       your files live here  (shortcut: ~ )
|-- lib   -> usr/lib  shared libraries
|-- media             removable media mount points (USB, CD)
|-- mnt               temporary mount points
|-- opt               optional, self-contained third-party software
|-- proc              live kernel + process state (not real files)
|-- root              the root user's home (NOT the same as / )
|-- sbin  -> usr/sbin system administration binaries
|-- tmp               temporary files, wiped on reboot
|-- usr               the bulk of installed programs and data
|-- var               data that changes: logs, mail, databases, caches`}
        </Pre>

        <H3>The Filesystem Hierarchy Standard</H3>
        <P>
          That layout is not arbitrary. It follows the Filesystem Hierarchy Standard (FHS), a shared agreement across distributions about what each top-level directory is for. Knowing these meanings turns a confusing tree into a map you can navigate by intuition - when something breaks, you know where to look.
        </P>
        <Table
          headers={['Directory', 'Purpose', 'You go here to...']}
          rows={[
            ['/etc', 'System-wide configuration files (all text)', 'Change how services and the system behave'],
            ['/home', 'Personal files and settings for each user', 'Keep your own documents, downloads, configs'],
            ['/var', 'Variable data that grows and changes', 'Read logs (/var/log), inspect caches, spool'],
            ['/usr', 'Installed programs, libraries, docs', 'Find installed binaries (/usr/bin) and shared data'],
            ['/tmp', 'Short-lived temporary files', 'Scratch space; assume it is wiped on reboot'],
            ['/proc', 'Live kernel and process information', 'Inspect running processes and kernel settings'],
            ['/dev', 'Device files representing hardware', 'Address disks, terminals, random sources'],
            ['/boot', 'Kernel image and bootloader', 'Troubleshoot or configure booting'],
          ]}
        />
        <Note type="info">
          A memory aid for the three you will touch most: /etc is where you <em>configure</em>, /var is where the system <em>writes as it runs</em> (logs above all), and /home is where <em>you</em> live. A huge fraction of real administration and investigation is reading files in /etc and /var/log.
        </Note>

        <H3>Absolute vs Relative Paths</H3>
        <P>
          A path is the address of a file or directory. There are two ways to write one, and confusing them is a classic beginner stumble. An <strong style={{ color: '#a8c8b2' }}>absolute path</strong> starts at the root with a leading slash and spells out the full route, so it means the same thing no matter where you are standing: /home/analyst/notes.txt is that exact file, always. A <strong style={{ color: '#a8c8b2' }}>relative path</strong> starts from your current location (your &quot;working directory&quot;) and has no leading slash: if you are already in /home/analyst, then notes.txt and projects/plan.md are relative paths to files near you.
        </P>
        <Pre label="PATH SHORTCUTS EVERY LINUX USER KNOWS">
{`/            the root directory
~            your home directory          (/home/analyst)
.            the current directory
..           the parent directory (one level up)
-            the previous directory you were in

# Examples, assuming you are in /home/analyst/projects :
cat ./plan.md            # ./ means "here" - same as cat plan.md
cd ..                    # go up to /home/analyst
cd ../Downloads          # up one, then into Downloads
cd ~                     # jump home from anywhere
cd /etc/ssh              # absolute: go there regardless of where you are
cd -                     # bounce back to wherever you just were`}
        </Pre>

        <H3>The Four Verbs of Navigation</H3>
        <P>
          Moving around the tree takes just a handful of commands, used constantly. Master these and you can explore any Linux system with confidence.
        </P>
        <Pre label="pwd, ls, cd, tree">
{`pwd                     # Print Working Directory - "where am I?"
                        # -> /home/analyst

ls                      # list the current directory
ls -l                   # long listing: permissions, owner, size, date
ls -la                  # long + hidden files (names starting with a dot)
ls -lh                  # long + human-readable sizes (4.0K, 2.3M)
ls -lt                  # sort by time, newest first
ls /var/log            # list a different directory without going there

cd /var/log            # Change Directory to an absolute path
cd ssh                 # into a subdirectory (relative)
cd                     # with no argument, go to your home directory

tree                   # draw the directory as a tree (install: apt install tree)
tree -L 2 /etc         # limit to 2 levels deep so output stays readable
tree -a                # include hidden files`}
        </Pre>
        <Note type="tip">
          Hidden files in Linux are simply files whose names begin with a dot, like .bashrc. They are not secret - ls -a reveals them. Configuration for your account lives in these dotfiles inside your home directory, which is why the final lab asks you to go hunting in one.
        </Note>

        <H3>Everything Is a File</H3>
        <P>
          One of the deepest ideas in Linux - inherited from Unix - is that almost everything is represented as a file. Ordinary documents are files, of course, but so are your hardware devices, your terminals, and even live information about the running kernel. This uniformity is powerful: the same commands that read a text file can read from a device or a stream of system data, because to the tools they all look alike.
        </P>
        <Pre label="EVERYTHING-IS-A-FILE IN ACTION">
{`# /dev holds device files - reading and writing them touches hardware:
cat /dev/null           # the "black hole" - discards anything written to it
head -c 16 /dev/urandom | xxd   # read 16 random bytes from the kernel's RNG

# /proc exposes live kernel and process state as virtual files:
cat /proc/cpuinfo       # details of every CPU core
cat /proc/meminfo       # current memory usage
cat /proc/uptime        # seconds the system has been running
ls /proc/self           # a view of the very process reading this

# Because they are "files", ordinary tools work on them:
grep MemTotal /proc/meminfo
wc -l /proc/cpuinfo`}
        </Pre>
        <P>
          This is not a gimmick - it is why Linux is so scriptable and so transparent to a security analyst. Want to know what network connections a process has open, what files it holds, or what environment it was launched with? It is all exposed as readable files under /proc. The investigative power you will use in later modules rests on this single idea. For now, practise moving around: run pwd, wander with cd, look with ls -la, and read a few files under /proc. The ground will quickly feel familiar, and the next chapter builds on it by actually creating and changing files.
        </P>
      </div>
    ),
  },

  // ─────────────────────────── CHAPTER 6 ───────────────────────────
  {
    id: 'files-and-text',
    title: 'Working with Files and Text',
    difficulty: 'BEGINNER',
    readTime: '19 min',
    labLink: '/modules/linux/lab',
    takeaways: [
      'cp, mv, rm, mkdir and touch are the core file-manipulation verbs; rm has no undo, so treat it with respect.',
      'find searches the live filesystem by name, type, size, time and permissions; locate reads a fast prebuilt index.',
      'cat, less, head and tail read files; less is the comfortable pager and tail -f follows a growing log live.',
      'nano is the friendly editor to start with; a handful of vim survival commands get you out of trouble.',
      'Redirection (>, >>, 2>) sends output to files, and pipes (|) chain one command&apos;s output into the next.',
    ],
    content: (
      <div>
        <H3>Creating, Copying, Moving, Deleting</H3>
        <P>
          Now that you can move through the filesystem, you will shape it. A small set of commands creates and rearranges files and directories, and they come up in almost every session. The two creation commands are mkdir, which makes a directory, and touch, which makes an empty file (or updates a file&apos;s timestamp if it already exists). Copying is cp, moving or renaming is mv - there is no separate &quot;rename&quot; command because renaming is just moving within the same directory.
        </P>
        <Pre label="CORE FILE OPERATIONS">
{`mkdir project                 # make a directory
mkdir -p a/b/c                # make nested directories, creating parents as needed
touch notes.txt              # create an empty file (or update its timestamp)

cp notes.txt backup.txt      # copy a file
cp -r project project-copy   # copy a directory and everything inside it (-r = recursive)
cp -i a.txt b.txt            # -i prompts before overwriting an existing file

mv notes.txt archive/        # MOVE a file into the archive directory
mv oldname.txt newname.txt   # RENAME (move within the same directory)

rm backup.txt                # remove a file
rm -r project-copy           # remove a directory and its contents (recursive)
rm -i important.txt          # -i asks for confirmation first`}
        </Pre>
        <Note type="danger">
          rm deletes permanently. There is no recycle bin on the command line - a removed file is gone. The command rm -rf / (recursive, forced, from the root) would try to erase the entire system; never run rm with a path you have not read twice. Beginners should get into the habit of rm -i, and of pausing whenever -r and -f appear together.
        </Note>

        <H3>Finding Things: find and locate</H3>
        <P>
          Sooner or later you will need to find a file you cannot see. Two tools do this with different trade-offs. <strong style={{ color: '#a8c8b2' }}>find</strong> walks the live filesystem right now, which makes it always accurate and extremely flexible - it can match by name, type, size, modification time, owner, and permissions, and even run a command on each result. <strong style={{ color: '#a8c8b2' }}>locate</strong> is near-instant because it consults a database built earlier by the system, at the cost of being only as fresh as that database.
        </P>
        <Pre label="SEARCHING THE FILESYSTEM">
{`# find: precise and live. Syntax: find WHERE CRITERIA
find . -name "notes.txt"            # by exact name, under the current directory
find /etc -name "*.conf"            # wildcard: every .conf file under /etc
find . -iname "readme*"             # -iname = case-insensitive
find /var -type d -name "log"       # -type d = directories only (f = files)
find . -size +10M                   # files larger than 10 megabytes
find /home -mtime -1                # modified in the last 1 day
find . -type f -perm -4000          # files with the SUID bit (see Chapter 7!)
find . -name "*.log" -delete        # act on matches (here, delete them)

# locate: fast index lookup (install + build the db first):
sudo apt install plocate
sudo updatedb                        # refresh the index
locate sshd_config                   # instant results from the database`}
        </Pre>
        <Note type="tip">
          That find command with -perm -4000 is a real-world technique: hunting for SUID binaries is one of the first things a pentester does on a new box, because a misconfigured one can grant root. You will understand exactly why in the next chapter.
        </Note>

        <H3>Reading Files: cat, less, head, tail</H3>
        <P>
          There are four classic ways to look inside a text file, chosen by how big the file is and what part of it you want. <strong style={{ color: '#a8c8b2' }}>cat</strong> dumps the whole file to the screen - fine for short files, overwhelming for long ones. <strong style={{ color: '#a8c8b2' }}>less</strong> opens a scrollable pager so you can move through a large file comfortably and search it. <strong style={{ color: '#a8c8b2' }}>head</strong> and <strong style={{ color: '#a8c8b2' }}>tail</strong> show just the beginning or end.
        </P>
        <Pre label="VIEWING FILE CONTENTS">
{`cat notes.txt               # print the whole file
cat -n notes.txt            # with line numbers

less /var/log/syslog        # scrollable pager: arrows/Space to move,
                            # /word to search, n for next match, q to quit

head file.txt               # first 10 lines
head -n 20 file.txt         # first 20 lines
tail file.txt               # last 10 lines
tail -n 50 file.txt         # last 50 lines

tail -f /var/log/syslog     # FOLLOW the file: keep printing new lines as they
                            # are written - essential for watching logs live`}
        </Pre>
        <P>
          That last one, tail -f, is a tool you will reach for constantly: it keeps a log on screen and shows each new line the moment it is written, so you can watch a service as it works or an attack as it lands. Press Ctrl+C to stop following.
        </P>

        <H3>Editing in the Terminal: nano First</H3>
        <P>
          You will frequently need to edit a text file - a config in /etc, a script, a note. The friendliest terminal editor is <strong style={{ color: '#a8c8b2' }}>nano</strong>, and it is the right one to start with because its commands are printed along the bottom of the screen at all times. The caret symbol in those hints means the Control key, so &quot;^O&quot; means Ctrl+O.
        </P>
        <Pre label="NANO - THE BEGINNER EDITOR">
{`nano notes.txt         # open (or create) the file

# While editing, type normally. The key commands (^ = Ctrl):
#   Ctrl+O   write Out (save) - then press Enter to confirm the name
#   Ctrl+X   eXit
#   Ctrl+K   cut the current line
#   Ctrl+U   paste (Uncut)
#   Ctrl+W   Where is - search
#   Ctrl+G   Get help`}
        </Pre>

        <H3>A Vim Survival Guide</H3>
        <P>
          Sooner or later a system will drop you into <strong style={{ color: '#a8c8b2' }}>vim</strong> (or vi) - it is installed nearly everywhere, and some commands open it by default. Vim is extraordinarily powerful but famously confusing to newcomers, because it is <em>modal</em>: it starts in a mode where letters are commands, not text. The single most common beginner crisis is &quot;I cannot type, and I cannot quit.&quot; Here is enough to survive and leave calmly.
        </P>
        <Pre label="VIM - JUST ENOUGH TO NOT PANIC">
{`vim notes.txt

# Vim starts in NORMAL mode (keys are commands, not text).
# To type text, enter INSERT mode:
#   i            start inserting before the cursor
#   Esc          leave insert mode, back to NORMAL mode

# From NORMAL mode (press Esc first if unsure), type a colon then a command:
#   :w           write (save)
#   :q           quit
#   :wq          write and quit
#   :q!          quit WITHOUT saving (discard changes) - the panic exit
#   :x           save and quit (like :wq)

# Movement in NORMAL mode: arrow keys work; so do h j k l (left down up right).
# dd deletes a line, u undoes, /word searches.`}
        </Pre>
        <Note type="tip">
          If you are ever stuck in vim: press Esc, then type :q! and Enter to leave without saving. That one sequence has rescued every Linux user alive. Use nano for comfort; learn a little vim because it is always there.
        </Note>

        <H3>Redirection and Pipes - The Big Idea</H3>
        <P>
          Here is where the command line becomes genuinely powerful. By default a command reads from your keyboard (standard input) and writes to your screen (standard output), with errors going to a separate channel (standard error). <strong style={{ color: '#a8c8b2' }}>Redirection</strong> lets you send those streams to or from files instead, and a <strong style={{ color: '#a8c8b2' }}>pipe</strong> lets you feed one command&apos;s output straight into the next command&apos;s input. Combining small tools this way is the essence of the Unix philosophy: each program does one thing well, and you assemble them.
        </P>
        <Pre label="REDIRECTION AND PIPES">
{`# Redirect standard output to a file:
ls -l > listing.txt          #  >  creates/overwrites the file
echo "new line" >> listing.txt   #  >> appends instead of overwriting

# Redirect errors (stream 2) and both streams:
find / -name secret 2> errors.txt        # send errors to a file
find / -name secret > out.txt 2>&1       # send output AND errors to one file
command 2>/dev/null                      # discard errors entirely

# Pipe: feed one command's output into another's input with |
cat /etc/passwd | grep analyst           # lines of passwd that mention analyst
ls -l | wc -l                            # count files by counting lines
cat access.log | sort | uniq -c | sort -rn | head
#   read the log -> sort lines -> count duplicates -> sort by count -> top 10`}
        </Pre>
        <P>
          Read that last pipeline left to right: it is four simple tools strung together to answer a real question (which lines appear most often in a log). No single program named &quot;top-log-lines&quot; exists, and none needs to - you built it from pieces. This composability is why a fluent Linux user can answer questions in one line that would be a whole program elsewhere. You will use redirection and pipes in nearly every command from here on, including the scripting module later in the platform.
        </P>
      </div>
    ),
  },

  // ─────────────────────────── CHAPTER 7 ───────────────────────────
  {
    id: 'permissions',
    title: 'Permissions, Ownership and Links',
    difficulty: 'INTERMEDIATE',
    readTime: '20 min',
    labLink: '/modules/linux/lab',
    takeaways: [
      'Every file has an owner, a group, and three permission sets - owner, group, others - each with read, write and execute bits.',
      'Permissions read as rwx triples or as octal digits (r=4, w=2, x=1); chmod sets them, chown and chgrp set ownership.',
      'On a directory, execute means "may enter"; on a file, execute means "may run" - the same bit, different meaning.',
      'SUID, SGID and the sticky bit are special bits with real security weight - a SUID root binary runs as root no matter who starts it.',
      'Symbolic links point to a path and can span filesystems; hard links are extra names for the same underlying data.',
    ],
    content: (
      <div>
        <Local>Linux permissions (<strong>rwx</strong> for owner / group / others) are a matatu SACCO&apos;s rules. The <strong>owner</strong> can do anything with the vehicle; <strong>SACCO members</strong> (the group) may drive it; the <strong>public</strong> (others) can only ride. <strong>chmod</strong> is moving someone between those three lists, and <strong>chown</strong> is signing the logbook over to a new owner. Almost every Linux privilege-escalation trick is somebody quietly promoting themselves from &quot;public&quot; to &quot;owner&quot;.</Local>
        <H3>Why Permissions Exist</H3>
        <P>
          Linux is a multi-user system from the ground up: many people (and many services) can use one machine, and the system must stop them from reading or wrecking each other&apos;s files. The permission model is how it does that, and it is one of the most important things a security practitioner understands, because a huge share of real-world attacks and misconfigurations come down to the wrong permissions on the wrong file. The good news is that the model is small and regular once you see its shape.
        </P>

        <H3>Owner, Group, Others</H3>
        <P>
          Every file and directory has an <strong style={{ color: '#a8c8b2' }}>owner</strong> (a user) and a <strong style={{ color: '#a8c8b2' }}>group</strong>. Permissions are then defined for three classes of people: the owner, the members of the file&apos;s group, and everyone else (&quot;others&quot;). For each class there are three independent permissions: read (r), write (w), and execute (x). That is the whole model - three classes, three permissions each, nine bits in total, plus a few specials we will meet shortly.
        </P>
        <Pre label="READING ls -l OUTPUT">
{`$ ls -l script.sh
-rwxr-xr--  1  analyst  devs   482  Nov 11 09:14  script.sh
|[-][-][-]      |        |
| |  |  |       |        '--- group that owns the file (devs)
| |  |  |       '------------ user that owns the file (analyst)
| |  |  '--- OTHERS: r-- (read only)
| |  '------ GROUP:  r-x (read and execute)
| '--------- OWNER:  rwx (read, write, execute)
'----------- file type: - = regular file, d = directory, l = symlink`}
        </Pre>
        <P>
          Read that first column as four parts: one type character, then three triples. The triples are always in the order owner, group, others, and within each triple the order is always r, w, x, with a dash where the permission is absent. So rwxr-xr-- means the owner can read/write/execute, the group can read and execute, and others can only read.
        </P>

        <H3>What r, w, x Mean - and the Directory Twist</H3>
        <P>
          For a regular file the three permissions are intuitive: read lets you view the contents, write lets you change them, and execute lets you run the file as a program. For a <strong style={{ color: '#a8c8b2' }}>directory</strong>, the same three bits mean something different and this trips people up. On a directory, read lets you list the names inside it, write lets you create and delete entries within it, and execute lets you <em>enter</em> it and access items by name. A directory you can read but not execute is nearly useless; you can see the names but not go in.
        </P>
        <Table
          headers={['Permission', 'On a file', 'On a directory']}
          rows={[
            ['read (r)', 'View the contents', 'List the names inside'],
            ['write (w)', 'Change the contents', 'Create / delete / rename entries'],
            ['execute (x)', 'Run it as a program', 'Enter it / access items by name'],
          ]}
        />

        <H3>Octal: The Numeric Shorthand</H3>
        <P>
          Because each triple is three yes/no bits, it fits neatly into a single digit from 0 to 7. This octal notation is how permissions are most often set and discussed. Read is worth 4, write 2, execute 1; you add them up per class. So rwx is 4+2+1 = 7, r-x is 4+1 = 5, r-- is 4, and rw- is 6. Three classes give three digits.
        </P>
        <Pre label="OCTAL PERMISSIONS">
{`  r = 4     w = 2     x = 1       (add them per class)

  rwx = 4+2+1 = 7
  rw- = 4+2   = 6
  r-x = 4+1   = 5
  r-- = 4     = 4
  --- = 0

Common whole-file values:
  755  rwxr-xr-x   owner full; group+others read/execute  (programs, dirs)
  644  rw-r--r--   owner read/write; everyone else read    (normal files)
  600  rw-------   owner read/write; no one else           (private files, keys)
  700  rwx------   owner only, full                          (private directory)
  777  rwxrwxrwx   everyone full - almost always a mistake`}
        </Pre>
        <Note type="warn">
          Seeing 777 on a file should raise an alarm. World-writable files let any user - or any compromised service - modify them, and world-writable executables are a classic privilege-escalation path. Granting broad permissions to &quot;just make it work&quot; is one of the most common and most dangerous habits in system administration.
        </Note>

        <H3>Changing Permissions and Ownership</H3>
        <P>
          Three commands manage all of this. <strong style={{ color: '#a8c8b2' }}>chmod</strong> (change mode) sets permissions, accepting either octal or a symbolic form. <strong style={{ color: '#a8c8b2' }}>chown</strong> (change owner) sets the owning user, and optionally the group. <strong style={{ color: '#a8c8b2' }}>chgrp</strong> sets just the group.
        </P>
        <Pre label="chmod, chown, chgrp">
{`# chmod with octal (set the whole thing at once):
chmod 755 script.sh
chmod 600 ~/.ssh/id_ed25519      # a private key MUST be owner-only

# chmod with symbolic form (adjust specific bits):
chmod +x script.sh               # add execute for everyone
chmod u+x script.sh              # add execute just for the owner (user)
chmod g-w report.txt             # remove write from the group
chmod o= secret.txt              # remove ALL permissions for others
chmod -R 750 project/            # -R applies recursively to a whole tree

# chown / chgrp (usually need sudo to give files away):
sudo chown analyst file.txt            # change owner
sudo chown analyst:devs file.txt       # change owner AND group
sudo chgrp devs file.txt               # change only the group
sudo chown -R analyst:analyst /srv/app # recursive ownership fix`}
        </Pre>

        <H3>umask - Default Permissions</H3>
        <P>
          When you create a new file, where do its starting permissions come from? From the <strong style={{ color: '#a8c8b2' }}>umask</strong>, a setting that <em>subtracts</em> permissions from a base. New files start from 666 and new directories from 777, and the umask removes bits. A typical umask of 022 removes write from group and others, yielding 644 for files and 755 for directories - exactly the sensible defaults you saw above.
        </P>
        <Pre label="umask">
{`umask            # show the current mask, e.g. 0022
# Files:       666 - 022 = 644  (rw-r--r--)
# Directories: 777 - 022 = 755  (rwxr-xr-x)

umask 077        # stricter: new files 600, new dirs 700 - owner only
                 # good for a machine where privacy matters by default`}
        </Pre>

        <H3>The Special Bits: SUID, SGID, Sticky</H3>
        <P>
          Beyond the nine basic bits are three special bits, and these carry real security weight - they are a favourite target in privilege escalation. The <strong style={{ color: '#a8c8b2' }}>SUID</strong> (Set User ID) bit on an executable makes it run with the permissions of the file&apos;s owner rather than the user who launched it. The classic example is /usr/bin/passwd: an ordinary user must change their own password, which means writing to a root-owned file, so passwd is SUID root and runs as root for everyone - but only to do its one careful job.
        </P>
        <Pre label="SPECIAL BITS IN THE WILD">
{`$ ls -l /usr/bin/passwd
-rwsr-xr-x 1 root root 68208 ... /usr/bin/passwd
   ^
   's' where the owner's x would be = SUID bit set, owner is root
   => this program runs as ROOT no matter who starts it

# Set / clear the special bits:
chmod u+s program     # set SUID  (octal: a leading 4, e.g. 4755)
chmod g+s program     # set SGID  (octal: a leading 2, e.g. 2755)
chmod +t directory    # set sticky bit (octal: a leading 1, e.g. 1777)

# The hunt a pentester runs on a new box - find SUID-root binaries:
find / -perm -4000 -user root -type f 2>/dev/null`}
        </Pre>
        <P>
          <strong style={{ color: '#a8c8b2' }}>SGID</strong> (Set Group ID) works the same way for the group, and on a directory it causes new files to inherit the directory&apos;s group - useful for shared project folders. The <strong style={{ color: '#a8c8b2' }}>sticky bit</strong> on a directory means only a file&apos;s owner can delete it, even if others can write to the directory; this is why /tmp is mode 1777 - everyone can create files there, but you cannot delete someone else&apos;s.
        </P>
        <Note type="danger">
          Why this matters for security: if an attacker finds or creates a SUID-root binary that can be abused - say one that lets them run a shell or overwrite a file - they gain root. Auditing SUID/SGID binaries is a core defensive task, and finding a vulnerable one is a core offensive technique. The lab for this module includes a step on exactly this, because recognising that telltale &quot;s&quot; in a listing is a skill every operator needs.
        </Note>

        <H3>Symbolic vs Hard Links</H3>
        <P>
          A link is a second name for a file, and Linux has two kinds. A <strong style={{ color: '#a8c8b2' }}>symbolic link</strong> (symlink) is a small file that simply contains a path pointing at another location - like a shortcut. It can point at a directory, can cross between different disks, and becomes a dangling &quot;broken&quot; link if its target is deleted. A <strong style={{ color: '#a8c8b2' }}>hard link</strong> is more fundamental: it is an additional directory entry pointing at the exact same underlying data on disk, so the file has two equal names and the data survives until the last name is removed. Hard links cannot cross filesystems or point at directories.
        </P>
        <Pre label="ln - CREATING LINKS">
{`# Symbolic link (the common one): ln -s TARGET LINKNAME
ln -s /var/log/syslog ~/syslog-link
ls -l ~/syslog-link
# lrwxrwxrwx ... syslog-link -> /var/log/syslog    (the 'l' and the arrow)

# Hard link (same data, second name): ln TARGET LINKNAME
echo "data" > original.txt
ln original.txt second-name.txt
# Both names now refer to ONE piece of data; edit either, both change.
# Deleting original.txt leaves second-name.txt fully intact.

ls -li original.txt second-name.txt   # -i shows the inode number:
                                       # identical inode = same underlying file`}
        </Pre>
        <P>
          Symlinks are everywhere in a real system - /bin is often a symlink to /usr/bin, and services use them to switch between versions of a program. Understanding them prevents confusion when a file seems to be in two places, and matters for security because carelessly following attacker-planted symlinks is a real class of vulnerability. Permissions, ownership, and links together form the access-control bedrock that the next chapter - users and privilege - builds directly upon.
        </P>
      </div>
    ),
  },

  // ─────────────────────────── CHAPTER 8 ───────────────────────────
  {
    id: 'users-privilege',
    title: 'Users, Groups and Privilege',
    difficulty: 'INTERMEDIATE',
    readTime: '18 min',
    labLink: '/modules/linux/lab',
    takeaways: [
      'root (UID 0) is the all-powerful administrator; everyday work should happen as a normal, limited user.',
      'sudo runs a single command with elevated rights and logs it; su switches to another user entirely - prefer sudo.',
      'User accounts live in /etc/passwd, group memberships in /etc/group, and password hashes in the protected /etc/shadow.',
      'The sudoers file controls exactly who may run what as whom; edit it only with visudo, which checks syntax.',
      'Least privilege - giving each user and service only what it needs - limits the blast radius of any single compromise.',
    ],
    content: (
      <div>
        <Local><strong>root</strong> is the SACCO chairman who can overrule any rule. Running as root all day is like driving around town with the chairman&apos;s master key left in the ignition &mdash; one wrong move and the entire fleet is gone. That is why you work as a normal user and use <strong>sudo</strong>: you borrow the master key for one specific trip, the system notes it in the register, and you hand it straight back.</Local>
        <H3>root - The One Account That Can Do Anything</H3>
        <P>
          On every Linux system there is one supremely powerful account: <strong style={{ color: '#a8c8b2' }}>root</strong>, also called the superuser, with user ID 0. root bypasses the permission checks of the previous chapter entirely - it can read, change, or delete any file, kill any process, reconfigure the kernel, and add or remove other users. This power is necessary for administering the system, and it is exactly why you should not spend your day logged in as root. A mistyped command as a normal user affects your own files; the same mistake as root can destroy the whole machine, and a browser or program exploited while you are root hands the attacker the entire system.
        </P>
        <Note type="info">
          The guiding principle is <strong>least privilege</strong>: operate with the minimum power needed for the task, and reach for root only for the specific moment you truly need it. Everything in this chapter is machinery for doing exactly that.
        </Note>

        <H3>su vs sudo</H3>
        <P>
          There are two ways to gain elevated privileges, and modern practice strongly favours one. <strong style={{ color: '#a8c8b2' }}>su</strong> (substitute user) switches your shell to become another user - su with no name becomes root, after which every command runs as root until you exit. <strong style={{ color: '#a8c8b2' }}>sudo</strong> (superuser do) instead runs a single command with elevated rights and then drops you straight back to your normal self. sudo is preferred for three reasons: it limits elevation to one command rather than a whole session, it authenticates you with your <em>own</em> password rather than requiring the root password to be shared, and it logs every use, creating an audit trail.
        </P>
        <Pre label="su AND sudo">
{`sudo apt update            # run ONE command as root, then back to normal
sudo systemctl restart ssh # the everyday pattern for admin tasks
sudo !!                    # re-run your PREVIOUS command with sudo (a lifesaver)

sudo -l                    # list exactly what sudo rights YOU have
sudo -u analyst whoami     # run a command as a specific other user (-> analyst)
sudo -i                    # start a full root login shell (use sparingly)

su                         # switch to root (needs the root password)
su - analyst               # become analyst with their full environment
exit                       # leave the su session, back to who you were`}
        </Pre>
        <Note type="tip">
          Many distributions (Ubuntu among them) disable the root password entirely by default, so su to root does not even work - you are expected to use sudo. This is a deliberate, healthy design: there is no shared root password to leak, and every privileged action is tied to a named human.
        </Note>

        <H3>Where Accounts Actually Live</H3>
        <P>
          Users and groups are not stored in some hidden database - they are plain text files in /etc, which you can read (and which tools edit for you). Three files matter. <strong style={{ color: '#a8c8b2' }}>/etc/passwd</strong> lists every account; despite its name it holds no passwords today. <strong style={{ color: '#a8c8b2' }}>/etc/shadow</strong> holds the actual password hashes and is readable only by root. <strong style={{ color: '#a8c8b2' }}>/etc/group</strong> defines groups and their members.
        </P>
        <Pre label="/etc/passwd - ONE LINE PER ACCOUNT">
{`$ grep analyst /etc/passwd
analyst:x:1000:1000:Analyst User:/home/analyst:/bin/bash
   |    | |    |        |             |            |
   |    | |    |        |             |            '-- login shell
   |    | |    |        |             '--------------- home directory
   |    | |    |        '----------------------------- comment / full name
   |    | |    '-------------------------------------- primary group ID (GID)
   |    | '------------------------------------------- user ID (UID)
   |    '--------------------------------------------- 'x' = password is in /etc/shadow
   '-------------------------------------------------- username

# UID 0 is root. System/service accounts use low UIDs; real humans start at 1000.
# A shell of /usr/sbin/nologin means the account cannot log in interactively.`}
        </Pre>
        <Pre label="/etc/shadow AND /etc/group (root-readable)">
{`$ sudo grep analyst /etc/shadow
analyst:$y$j9T$kQ....hashed....:19700:0:99999:7:::
         |   |     |
         |   |     '-- the password HASH (never the plaintext)
         |   '-------- hashing scheme ($y$ = yescrypt, $6$ = SHA-512)
         '------------ fields for password ageing and expiry follow

$ grep devs /etc/group
devs:x:1001:analyst,sam        # group name, GID, and its member list`}
        </Pre>
        <Note type="warn">
          /etc/shadow being readable only by root is a security boundary, not a detail. If an attacker can read /etc/shadow, they can take the hashes away and crack them offline at their leisure (the Cryptography module covers exactly how). Any misconfiguration that exposes it is serious.
        </Note>

        <H3>Creating and Managing Users</H3>
        <P>
          You add, modify, and remove accounts with a small set of commands. On Debian/Ubuntu the friendly wrapper adduser is preferred for interactive use because it prompts for everything and sets up the home directory; the lower-level useradd exists too and is used in scripts.
        </P>
        <Pre label="USER AND GROUP ADMINISTRATION">
{`sudo adduser sam                 # create user 'sam' (prompts for password, etc.)
sudo passwd sam                  # set or reset sam's password
sudo usermod -aG sudo sam        # ADD sam to the 'sudo' group (grants admin rights)
                                 # -a = append; forgetting it REPLACES all groups!
sudo deluser sam                 # remove the user (add --remove-home to wipe files)

sudo groupadd devs               # create a group
sudo usermod -aG devs sam        # add sam to it
groups sam                       # show which groups sam belongs to
id sam                           # show sam's UID, GID and all group memberships
whoami                           # who am I right now?
id                               # my own UID/GID/groups`}
        </Pre>
        <P>
          Group membership is how privileges are granted in practice. On Ubuntu, being in the <strong style={{ color: '#a8c8b2' }}>sudo</strong> group is what lets a user run sudo at all; other groups like docker, adm, or dialout grant access to particular capabilities. Adding a user to a powerful group is a privilege grant - the docker group, for instance, is effectively root-equivalent because of what Docker can do, a subtlety attackers exploit.
        </P>

        <H3>The sudoers File</H3>
        <P>
          Who may run sudo, and for which commands, is governed by <strong style={{ color: '#a8c8b2' }}>/etc/sudoers</strong> and the drop-in files in /etc/sudoers.d/. You can grant a user full admin rights, or narrowly permit only specific commands - for example, letting a backup operator restart one service and nothing else. Crucially, you never edit this file with an ordinary editor; you use <strong style={{ color: '#a8c8b2' }}>visudo</strong>, which checks the syntax before saving so a typo cannot lock everyone out of administration.
        </P>
        <Pre label="sudoers - EDIT ONLY WITH visudo">
{`sudo visudo                      # opens /etc/sudoers with a syntax check on save

# Lines inside sudoers:
#   user  host = (runas) commands
root    ALL=(ALL:ALL) ALL        # root may run anything, anywhere, as anyone
%sudo   ALL=(ALL:ALL) ALL        # any member of the 'sudo' group: full rights
analyst ALL=(ALL) NOPASSWD: /usr/bin/systemctl restart nginx
#   analyst may restart nginx via sudo WITHOUT a password - and nothing else extra

# A '%' prefix means a group. NOPASSWD skips the password prompt for that rule.`}
        </Pre>
        <Note type="danger">
          Over-broad sudo rules are a leading cause of privilege escalation. A rule that lets a user run an editor, a scripting language, or a file-writing command as root can often be turned into a full root shell. When granting sudo, grant the narrowest command possible, and audit existing rules with sudo -l and by reading /etc/sudoers.d/. &quot;Give them sudo on vi&quot; sounds harmless and is in fact a handing-over of root.
        </Note>

        <H3>Least Privilege in Practice</H3>
        <P>
          Pulling the chapter together: a well-run Linux machine has no one logging in as root day to day, a small number of named humans in the sudo group, service accounts that cannot log in interactively (shell set to nologin) and own only the files their service needs, and sudo rules scoped as tightly as the work allows. The payoff is containment. When something does go wrong - a cracked password, an exploited service, a careless command - least privilege ensures the damage stays small: a compromised low-privilege service cannot read everyone&apos;s files or reconfigure the system, because it was never given the power to. Every later module&apos;s attacks are, in a sense, attempts to escape these boundaries; understanding how the boundaries are built is what lets you both attack and defend them intelligently.
        </P>
      </div>
    ),
  },

  // ─────────────────────────── CHAPTER 9 ───────────────────────────
  {
    id: 'processes-services',
    title: 'Processes, Jobs and Services',
    difficulty: 'INTERMEDIATE',
    readTime: '19 min',
    labLink: '/modules/linux/lab',
    takeaways: [
      'A process is a running program with its own PID; ps and top/htop show you what is running and what it consumes.',
      'Signals control processes: kill sends them, with SIGTERM (15) asking politely and SIGKILL (9) forcing the issue.',
      'The shell runs jobs in the foreground or background; &, jobs, fg, bg and nohup manage long-running work.',
      'systemd is the modern init system and service manager; systemctl starts, stops, enables and inspects services.',
      'journalctl reads systemd&apos;s logs, and classic logs live as text under /var/log - both are first stops when debugging.',
    ],
    content: (
      <div>
        <H3>What a Process Is</H3>
        <P>
          When you run a program, the kernel creates a <strong style={{ color: '#a8c8b2' }}>process</strong>: a running instance of that program with its own slice of memory, its own open files, an owner, and a unique number called the PID (process ID). The same program can run as many separate processes at once. The kernel&apos;s scheduler rapidly switches the CPU between all the ready processes, creating the illusion that everything runs simultaneously. Understanding processes is essential for both operations and security - a strange process is often the first sign of malware, and managing processes is daily work for any administrator.
        </P>

        <H3>Seeing What Is Running: ps, top, htop</H3>
        <P>
          Two complementary tools show you processes. <strong style={{ color: '#a8c8b2' }}>ps</strong> takes a one-time snapshot of processes, ideal for scripting and for grepping. <strong style={{ color: '#a8c8b2' }}>top</strong> (and the nicer <strong style={{ color: '#a8c8b2' }}>htop</strong>) give a live, continuously updating view sorted by resource use, like a task manager in the terminal.
        </P>
        <Pre label="INSPECTING PROCESSES">
{`ps aux                  # every process on the system, with owner, CPU, memory
                        #   a = all users, u = user-friendly columns, x = incl.
                        #   processes with no terminal (services)
ps aux | grep nginx     # find a specific process by name
ps -ef                  # another common full listing (shows parent PIDs - PPID)
pstree                  # processes as a tree, showing who started whom

top                     # live view; press q to quit, M to sort by memory,
                        #   P to sort by CPU, k to kill a PID
htop                    # friendlier live view (install: sudo apt install htop)
                        #   arrows to select, F9 to kill, F6 to sort, colour bars

pgrep sshd              # just the PID(s) of processes matching a name
pidof nginx             # PID(s) of a named program`}
        </Pre>
        <P>
          The columns in ps aux repay study: USER (owner), PID (the number you act on), %CPU and %MEM (resource use), and COMMAND (what is running). When investigating a possibly compromised machine, ps aux is often the very first command - unexpected processes, processes owned by the wrong user, or odd command lines are immediate red flags.
        </P>

        <H3>Signals and kill</H3>
        <P>
          You control a running process by sending it a <strong style={{ color: '#a8c8b2' }}>signal</strong> - a small, standardised message the kernel delivers. The command to send one is confusingly named <strong style={{ color: '#a8c8b2' }}>kill</strong>, but most signals do not kill anything; they ask a process to do something. The two you use most are SIGTERM, a polite request to shut down cleanly, and SIGKILL, an unstoppable termination the process cannot catch or ignore.
        </P>
        <Pre label="SIGNALS">
{`kill 1234              # send SIGTERM (15) to PID 1234 - "please exit cleanly"
kill -15 1234          # the same thing, stated explicitly
kill -9 1234           # send SIGKILL (9) - forced, immediate, uncatchable
kill -HUP 1234         # SIGHUP (1) - many services reload their config on this

killall firefox        # signal every process named firefox (by name)
pkill -f "python3 bot" # signal processes whose full command line matches

# Key signals:
#   SIGTERM (15)  polite shutdown    - ALWAYS TRY THIS FIRST
#   SIGKILL (9)   forced kill        - last resort; no cleanup happens
#   SIGHUP  (1)   hang up / reload   - often triggers a config reload
#   SIGSTOP/SIGCONT  pause / resume a process`}
        </Pre>
        <Note type="warn">
          Reach for kill -9 only when SIGTERM has failed. SIGKILL gives the process no chance to save data, close files, or release resources cleanly, which can leave corruption behind. The disciplined order is: try kill (SIGTERM), wait a moment, and only then escalate to kill -9.
        </Note>

        <H3>Foreground, Background and Jobs</H3>
        <P>
          A command you run normally occupies your shell until it finishes - it runs in the <strong style={{ color: '#a8c8b2' }}>foreground</strong>. For long tasks you can push work into the <strong style={{ color: '#a8c8b2' }}>background</strong> so the shell is free again. Append an ampersand to start a command in the background, suspend a running one with Ctrl+Z, and use jobs, fg, and bg to juggle them. For work that must outlive the terminal itself, nohup (or better, a terminal multiplexer like tmux) keeps it running after you disconnect.
        </P>
        <Pre label="JOB CONTROL">
{`long-task &             # start it in the background immediately
                        #   shell prints:  [1] 4521   (job number, PID)
jobs                    # list background/suspended jobs in this shell
fg %1                   # bring job 1 back to the FOREGROUND
bg %1                   # resume a suspended job IN the background

# While a foreground command runs:
#   Ctrl+C   interrupt (send SIGINT) - stop it
#   Ctrl+Z   suspend it (it pauses; resume with fg or bg)

nohup long-task &       # keep running even after you log out;
                        #   output goes to nohup.out by default
tmux                    # better: a terminal multiplexer whose sessions persist
                        #   detach with Ctrl+b then d; reattach: tmux attach`}
        </Pre>
        <Note type="tip">
          On a remote server reached by SSH, run anything long-lived inside tmux (or screen). If your connection drops, a plain background job can die with the session, but a tmux session keeps running and you simply reattach when you reconnect. This single habit prevents a lot of lost work.
        </Note>

        <H3>systemd and systemctl</H3>
        <P>
          Beyond the processes you start by hand, a Linux machine runs many long-lived background programs - a web server, the SSH daemon, a database, the networking stack. These are <strong style={{ color: '#a8c8b2' }}>services</strong> (also called daemons), and on virtually every modern distribution they are managed by <strong style={{ color: '#a8c8b2' }}>systemd</strong>, the first process to start (PID 1) and the manager of everything else. You control services through its command, <strong style={{ color: '#a8c8b2' }}>systemctl</strong>. The crucial distinction is between <em>start</em> (run it now) and <em>enable</em> (run it automatically at every boot) - they are separate actions and you usually want both.
        </P>
        <Pre label="systemctl - MANAGING SERVICES">
{`sudo systemctl start ssh        # start the service NOW
sudo systemctl stop ssh         # stop it now
sudo systemctl restart ssh      # stop then start (apply new config)
sudo systemctl reload ssh       # reload config without dropping connections

sudo systemctl enable ssh       # start automatically at every boot
sudo systemctl disable ssh      # do not start at boot
sudo systemctl enable --now ssh # enable AND start in one go

systemctl status ssh            # is it running? recent log lines, PID, uptime
systemctl is-active ssh         # just: active / inactive
systemctl list-units --type=service          # all loaded services
systemctl list-unit-files --state=enabled    # everything set to start at boot`}
        </Pre>
        <P>
          The output of systemctl status is one of the most useful screens in Linux: it tells you whether the service is active, its PID, how long it has run, whether it is enabled at boot, and the last several log lines - often enough to see immediately why something failed. For security, systemctl list-unit-files --state=enabled answers a vital question on any machine: what starts automatically? An unexpected enabled service can be a persistence mechanism left by an attacker.
        </P>

        <H3>Logs: journalctl and /var/log</H3>
        <P>
          When something misbehaves, the answer is almost always in the logs. systemd collects logs from services into a unified journal read with <strong style={{ color: '#a8c8b2' }}>journalctl</strong>. Alongside it, the traditional plain-text logs still live under <strong style={{ color: '#a8c8b2' }}>/var/log</strong>, where you can read them with the same cat/less/grep/tail tools from Chapter 6.
        </P>
        <Pre label="READING LOGS">
{`journalctl -u ssh               # all log entries for the ssh service
journalctl -u ssh -n 50         # the last 50 lines for that service
journalctl -u ssh -f            # FOLLOW live (like tail -f) - watch as it happens
journalctl -b                   # everything since the last boot
journalctl -p err               # only error-priority and worse
journalctl --since "10 min ago" # time-filtered

# The classic text logs under /var/log:
sudo tail -f /var/log/syslog          # general system messages (Debian/Ubuntu)
sudo tail -f /var/log/auth.log        # authentication: logins, sudo, SSH attempts
ls /var/log                           # see what a given system records`}
        </Pre>
        <Note type="info">
          /var/log/auth.log deserves a bookmark. Every login, every sudo, and every SSH connection attempt is recorded there. Watching it with tail -f while something tries to authenticate is the fastest way to understand access problems - and reviewing it is how you spot brute-force attempts against a server, which is exactly the threat the hardening chapter addresses with fail2ban.
        </Note>
        <P>
          Processes, services, and logs are the live pulse of a running system. Being able to see what runs, control it with signals and job control, manage services with systemd, and read the logs when things go wrong is the heart of system administration - and the foundation of incident response, where the same skills become the tools for finding and evicting an intruder.
        </P>
      </div>
    ),
  },

  // ─────────────────────────── CHAPTER 10 ───────────────────────────
  {
    id: 'package-management',
    title: 'Software and Package Management',
    difficulty: 'INTERMEDIATE',
    readTime: '18 min',
    labLink: '/modules/linux/lab',
    takeaways: [
      'Package managers install software and resolve dependencies from trusted, signed repositories - the safe default on Linux.',
      'On Debian/Ubuntu, apt update refreshes the catalogue and apt upgrade installs the new versions; they are two distinct steps.',
      'dnf (Fedora) and pacman (Arch) do the same job with different commands; the concepts transfer directly.',
      'snap and flatpak distribute self-contained, sandboxed apps that work across distributions at the cost of size.',
      'Add third-party repositories and .deb files only from sources you trust, verify keys, and keep the whole system patched.',
    ],
    content: (
      <div>
        <Local>A <strong>package manager</strong> (<strong>apt</strong>, <strong>dnf</strong>, <strong>pacman</strong>) is M-Pesa for software. Instead of hawking around town for a CD, you request a program by name; it fetches that program <em>and</em> everything it depends on from a trusted till (the repository), installs it, and can reverse the whole transaction just as cleanly. Downloading random software off the open web to install by hand is the digital version of buying goods from a stranger in a dark alley.</Local>
        <H3>Why Package Managers Exist</H3>
        <P>
          On Windows or macOS you install software by downloading an installer from a website and running it, trusting each vendor individually. Linux took a different, safer path decades ago: the <strong style={{ color: '#a8c8b2' }}>package manager</strong>. Software is pre-built into <em>packages</em> and published in <em>repositories</em> - central, curated catalogues maintained by your distribution. One command searches them, installs software, automatically pulls in every other package it depends on, and later updates everything at once. The packages are cryptographically signed, so your system verifies they genuinely came from the distribution and were not tampered with in transit. This is both more convenient and more secure than hunting down installers.
        </P>
        <Table
          headers={['Distro family', 'Package manager', 'Package format']}
          rows={[
            ['Debian / Ubuntu / Kali', 'apt (dpkg underneath)', '.deb'],
            ['Fedora / RHEL / Rocky', 'dnf (rpm underneath)', '.rpm'],
            ['Arch / Manjaro', 'pacman', '.pkg.tar.zst'],
            ['openSUSE', 'zypper', '.rpm'],
          ]}
        />

        <H3>apt in Depth</H3>
        <P>
          Because this module targets Debian/Ubuntu, apt is the tool to know well. The single most important concept is that <strong style={{ color: '#a8c8b2' }}>update</strong> and <strong style={{ color: '#a8c8b2' }}>upgrade</strong> are different. apt update does not install anything - it refreshes your local copy of the repository catalogue so apt knows what versions are available. apt upgrade then actually downloads and installs the newer versions. You almost always run update immediately before upgrade or install, so your view of what exists is current.
        </P>
        <Pre label="apt - THE ESSENTIALS">
{`sudo apt update                 # refresh the catalogue (installs NOTHING)
sudo apt upgrade                # install available updates for installed packages
sudo apt full-upgrade           # upgrade, allowing removals when needed
sudo apt update && sudo apt upgrade -y    # the routine one-liner; -y = assume yes

sudo apt install nmap           # install a package (and its dependencies)
sudo apt install nmap tcpdump git   # several at once
sudo apt remove nmap            # uninstall, but keep its config files
sudo apt purge nmap             # uninstall AND delete its config files
sudo apt autoremove             # remove orphaned dependencies no longer needed

apt search wireshark            # search the catalogue by keyword
apt show wireshark              # detailed info: version, size, description, deps
dpkg -l                         # list everything currently installed
dpkg -L nmap                    # list the files a package installed, and where
apt list --installed           # another view of installed packages`}
        </Pre>
        <Note type="tip">
          The habit to build is to start sessions on a lab machine with sudo apt update &amp;&amp; sudo apt upgrade -y. An up-to-date system has the known security fixes applied, which is the single most effective and most overlooked piece of host security.
        </Note>

        <H3>dnf and pacman at a Glance</H3>
        <P>
          You will meet the other families eventually, and the commands map almost one-to-one onto apt. Learning the pattern once means you are never lost on an unfamiliar distro.
        </P>
        <Table
          headers={['Task', 'apt (Debian)', 'dnf (Fedora)', 'pacman (Arch)']}
          rows={[
            ['Refresh catalogue', 'apt update', '(automatic)', 'pacman -Sy'],
            ['Upgrade all', 'apt upgrade', 'dnf upgrade', 'pacman -Su'],
            ['Install a package', 'apt install X', 'dnf install X', 'pacman -S X'],
            ['Remove a package', 'apt remove X', 'dnf remove X', 'pacman -R X'],
            ['Search', 'apt search X', 'dnf search X', 'pacman -Ss X'],
          ]}
        />

        <H3>snap and flatpak - The Universal Formats</H3>
        <P>
          Traditional packages are built specifically for each distribution and version. Two newer systems break from that: <strong style={{ color: '#a8c8b2' }}>snap</strong> (from Canonical) and <strong style={{ color: '#a8c8b2' }}>flatpak</strong> (community-driven). Both bundle an application together with its dependencies into one self-contained, sandboxed package that runs on any distribution. This solves the problem of an app needing a library newer than your distro ships, and the sandbox limits what the app can touch. The trade-offs are larger downloads, more disk use, and slightly slower startup, since each app carries its own copy of its dependencies.
        </P>
        <Pre label="snap AND flatpak">
{`# snap (preinstalled on Ubuntu):
snap find chromium            # search
sudo snap install chromium    # install
snap list                     # installed snaps
sudo snap refresh             # update all snaps

# flatpak (add the Flathub source first):
sudo apt install flatpak
flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo
flatpak install flathub org.gimp.GIMP
flatpak list
flatpak update`}
        </Pre>

        <H3>Adding Repositories and PPAs - Carefully</H3>
        <P>
          Sometimes the software you want is not in the default repositories, or you need a newer version. You can add third-party repositories, and on Ubuntu a common form is a PPA (Personal Package Archive). Doing so extends the set of sources your system will trust and automatically install from - which is powerful and therefore requires caution. You are telling your machine to trust a new publisher&apos;s signing key; add only sources you have reason to trust, because a malicious or compromised repository can push software straight onto your system.
        </P>
        <Pre label="ADDING SOURCES SAFELY">
{`# The modern, explicit way: download the publisher's signing key to a keyring,
# then add a source line that references THAT key only.
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://example.com/key.gpg | sudo gpg --dearmor -o /etc/apt/keyrings/example.gpg
echo "deb [signed-by=/etc/apt/keyrings/example.gpg] https://example.com/apt stable main" \
  | sudo tee /etc/apt/sources.list.d/example.list
sudo apt update

# Ubuntu PPAs (convenient, but trust the maintainer):
sudo add-apt-repository ppa:somemaintainer/ppa
sudo apt update && sudo apt install theirpackage`}
        </Pre>
        <Note type="warn">
          Every repository you add is a party you have chosen to trust with the ability to install software as root on your machine. Treat adding one as a security decision. Prefer official repositories, read what a PPA actually provides, and remove sources you no longer use. The convenience of &quot;just add this PPA&quot; from a random forum post has compromised plenty of machines.
        </Note>

        <H3>Installing a Standalone .deb</H3>
        <P>
          Some vendors (Chrome, VS Code, Zoom) distribute a single .deb file to download. You can install it directly, and the right tool pulls in any missing dependencies automatically.
        </P>
        <Pre label="INSTALLING A .deb FILE">
{`# apt can install a local file AND resolve its dependencies:
sudo apt install ./google-chrome-stable_current_amd64.deb

# The lower-level dpkg installs but does NOT fetch dependencies:
sudo dpkg -i package.deb
sudo apt install -f        # -f = fix: pull in anything dpkg left missing`}
        </Pre>

        <H3>Compiling from Source</H3>
        <P>
          Occasionally software is not packaged at all, and you build it from its source code. The classic sequence is configure, make, make install - the first adapts the build to your system, the second compiles it, and the third copies the result into place. Security tools and cutting-edge research code often come this way. Be aware that software installed from source bypasses the package manager, so it will not be updated automatically and you must track it yourself.
        </P>
        <Pre label="BUILDING FROM SOURCE">
{`sudo apt install build-essential git   # compiler toolchain + make + headers
git clone https://github.com/example/tool.git
cd tool
./configure            # (if present) detect the system and prepare the build
make                   # compile the source into binaries
sudo make install      # install into /usr/local (needs root to write there)

# Many modern projects use cmake instead of ./configure:
mkdir build && cd build && cmake .. && make && sudo make install`}
        </Pre>
        <Note type="info">
          Software you build and install from source lives outside apt&apos;s knowledge, usually under /usr/local, and apt upgrade will never touch it. That is fine, but it means the responsibility to watch for its security updates is now yours. Prefer packaged versions when they exist; compile from source when you must, and keep a note of what you built so you can update it later.
        </Note>
        <P>
          Package management is, quietly, one of the most security-relevant topics in this whole module. A system kept current through its package manager has its known holes closed; a neglected one accumulates them. Knowing how to install the tools you need, from sources you trust, and how to keep everything patched, is the difference between a machine that is an asset and one that is a liability.
        </P>
      </div>
    ),
  },

  // ─────────────────────────── CHAPTER 11 ───────────────────────────
  {
    id: 'networking',
    title: 'Networking on Linux',
    difficulty: 'INTERMEDIATE',
    readTime: '21 min',
    labLink: '/modules/linux/lab',
    takeaways: [
      'The modern ip command shows and configures addresses and routes; ss shows listening ports and live connections.',
      'ping, traceroute, dig, curl and wget diagnose reachability, path, DNS resolution and HTTP from the terminal.',
      'Name resolution flows through /etc/hosts and /etc/resolv.conf; knowing them explains most "it will not resolve" problems.',
      'SSH is the backbone of remote administration; key-based authentication is both more convenient and far more secure than passwords.',
      'scp and rsync move files over SSH, and ufw gives you a simple, safe front end to the kernel firewall.',
    ],
    content: (
      <div>
        <H3>Seeing Your Network: ip and ss</H3>
        <P>
          Networking is where Linux security work truly begins, and it starts with two questions: what is my machine&apos;s place on the network, and what is it talking to? The modern tool for addresses and routes is <strong style={{ color: '#a8c8b2' }}>ip</strong> (it replaced the old ifconfig and route, which you may still see in tutorials). For sockets - the ports your machine is listening on and the connections it has open - the modern tool is <strong style={{ color: '#a8c8b2' }}>ss</strong> (which replaced netstat).
        </P>
        <Pre label="ip AND ss">
{`ip a                    # show all interfaces and their IP addresses (ip addr)
ip -br a                # brief, one line per interface - quick and readable
ip r                    # the routing table (ip route) - where traffic goes
ip r get 1.1.1.1        # which route/interface would reach a given address
ip link                 # the interfaces themselves (up/down, MAC addresses)

ss -tulpn               # the essential one: TCP+UDP Listening ports, with the
                        #   Program and Numeric ports - "what is open on me?"
#   -t TCP  -u UDP  -l listening  -p program  -n numeric (no name lookups)
ss -tp                  # established TCP connections and their owning programs
ss -s                   # summary counts of sockets by state`}
        </Pre>
        <Note type="tip">
          Commit ss -tulpn to memory. On any machine it answers &quot;what services are listening, on which ports, run by which program?&quot; - the first thing to check when hardening a host (every open port is attack surface) and when investigating one (an unexpected listener can be a backdoor).
        </Note>

        <H3>Diagnostics: ping, traceroute, dig, curl, wget</H3>
        <P>
          A handful of tools answer the common &quot;why can I not reach this?&quot; questions, each probing a different layer. <strong style={{ color: '#a8c8b2' }}>ping</strong> tests basic reachability. <strong style={{ color: '#a8c8b2' }}>traceroute</strong> reveals the hops along the path. <strong style={{ color: '#a8c8b2' }}>dig</strong> queries DNS to turn names into addresses. <strong style={{ color: '#a8c8b2' }}>curl</strong> and <strong style={{ color: '#a8c8b2' }}>wget</strong> speak HTTP(S) to fetch pages and files and to inspect responses.
        </P>
        <Pre label="NETWORK DIAGNOSTICS">
{`ping -c 4 1.1.1.1            # 4 packets to an IP - is the host reachable at all?
ping -c 4 example.com       # name works too (this also tests DNS implicitly)

traceroute example.com      # the router hops between you and the destination
                            #   (install: sudo apt install traceroute)
mtr example.com             # live, continuously updating traceroute - excellent

dig example.com             # full DNS answer for a name
dig +short example.com      # just the IP address(es)
dig MX example.com          # a specific record type (mail servers here)
dig @1.1.1.1 example.com    # ask a specific DNS server

curl -I https://example.com         # headers only - status code, server, redirects
curl https://api.example.com/data   # fetch and print a response body
curl -L -o page.html https://ex.com # follow redirects (-L), save to a file (-o)
wget https://example.com/file.iso   # download a file (resumable with -c)`}
        </Pre>

        <H3>How Names Become Addresses</H3>
        <P>
          When you use a name like example.com, Linux must resolve it to an IP address, and knowing the path it takes explains most resolution problems. The resolver first consults the local file <strong style={{ color: '#a8c8b2' }}>/etc/hosts</strong>, a manual map of names to addresses that overrides everything else. If the name is not there, it queries the DNS servers listed (directly or indirectly) in <strong style={{ color: '#a8c8b2' }}>/etc/resolv.conf</strong>. On many modern desktops resolv.conf is managed automatically by systemd-resolved, so you edit network settings rather than the file directly - but reading it still tells you which servers are in play.
        </P>
        <Pre label="NAME RESOLUTION FILES">
{`cat /etc/hosts
# 127.0.0.1    localhost
# 127.0.1.1    ghost-lab
# 10.10.10.5   target.lab          <- a manual entry you can add for a lab host

cat /etc/resolv.conf
# nameserver 127.0.0.53            <- systemd-resolved stub, or a real DNS server
# nameserver 1.1.1.1

resolvectl status                  # what systemd-resolved is actually using
getent hosts example.com           # resolve a name the way the system really does`}
        </Pre>
        <Note type="info">
          Adding a line to /etc/hosts is a simple, powerful lab trick: it lets you give a memorable name to a target VM&apos;s IP address, so you can type target.lab instead of an address. Because /etc/hosts is checked first, it also lets you override or pin a name during testing.
        </Note>

        <H3>SSH - The Remote Administration Backbone</H3>
        <P>
          The Secure Shell, <strong style={{ color: '#a8c8b2' }}>SSH</strong>, is how you log into and run commands on remote Linux machines over an encrypted connection. It is the single most important networking tool for an operator - nearly all server administration happens through it. The client, ssh, connects to a server running the sshd service (which you start with systemctl, as in Chapter 9). You can authenticate with a password, but the professional standard is <strong style={{ color: '#a8c8b2' }}>key-based authentication</strong>, which is both more convenient (no password typing) and dramatically more secure (no password to guess or brute-force).
        </P>
        <Pre label="SSH CLIENT, SERVER AND KEYS">
{`# Connect with a password (works, but not the best way):
ssh analyst@203.0.113.10
ssh -p 2222 analyst@host        # a non-default port
ssh analyst@host 'uptime'       # run one command remotely and return

# Key-based auth - generate a modern keypair ONCE on your own machine:
ssh-keygen -t ed25519 -C "analyst@ghost-lab"
#   creates ~/.ssh/id_ed25519 (PRIVATE - never share) and id_ed25519.pub (public)

# Copy your PUBLIC key to the server so it will trust your private key:
ssh-copy-id analyst@203.0.113.10
# ...now this logs in with no password prompt:
ssh analyst@203.0.113.10

# On the SERVER, the sshd service must be installed and running:
sudo apt install openssh-server
sudo systemctl enable --now ssh`}
        </Pre>
        <Note type="danger">
          Your private key (id_ed25519, no .pub) is the secret that proves your identity - guard it like a password and never copy it to a server or share it. Only the public key (.pub) is distributed. This is also why Chapter 7 insisted that key files be mode 600: SSH will refuse to use a private key that others can read, as a safety check.
        </Note>

        <H3>Moving Files: scp and rsync</H3>
        <P>
          Because SSH already provides an encrypted channel, the natural tools for copying files to and from remote machines ride on top of it. <strong style={{ color: '#a8c8b2' }}>scp</strong> copies files much like cp but across the network. <strong style={{ color: '#a8c8b2' }}>rsync</strong> is smarter: it transfers only the differences between source and destination, making it ideal for repeated syncs and large directories, and it can resume interrupted transfers.
        </P>
        <Pre label="scp AND rsync">
{`# scp - simple remote copy over SSH:
scp report.pdf analyst@host:/home/analyst/      # local -> remote
scp analyst@host:/var/log/syslog ./             # remote -> local
scp -r project/ analyst@host:/srv/              # a whole directory (-r)

# rsync - efficient, resumable, mirror-capable (also over SSH):
rsync -avz project/ analyst@host:/srv/project/  # -a archive, -v verbose, -z compress
rsync -avz --progress bigfile analyst@host:/srv/   # show progress on big transfers
rsync -avz --delete src/ host:/dst/             # make dst an exact mirror of src`}
        </Pre>

        <H3>Firewalling with ufw (and a Note on the Layers Below)</H3>
        <P>
          A firewall controls which network traffic is allowed in and out. The Linux kernel&apos;s firewall engine today is <strong style={{ color: '#a8c8b2' }}>nftables</strong> (which succeeded the long-dominant iptables; you will still meet iptables commands everywhere, and they now typically drive nftables underneath). Both are powerful but fiddly. For everyday host protection, <strong style={{ color: '#a8c8b2' }}>ufw</strong> (the Uncomplicated Firewall) is a simple front end that generates the right rules for you, and it is the right tool for securing a single machine.
        </P>
        <Pre label="ufw - THE UNCOMPLICATED FIREWALL">
{`sudo apt install ufw
sudo ufw default deny incoming       # block all inbound by default (the safe base)
sudo ufw default allow outgoing      # allow the machine to reach out
sudo ufw allow 22/tcp                # permit SSH so you do not lock yourself out
sudo ufw allow 80,443/tcp            # permit web traffic if this is a web server
sudo ufw limit 22/tcp                # rate-limit SSH to blunt brute-force attempts
sudo ufw enable                      # turn the firewall on
sudo ufw status verbose              # review the active rules
sudo ufw delete allow 80/tcp         # remove a rule you no longer want

# The layers underneath ufw, for awareness:
sudo nft list ruleset                # the raw nftables rules ufw generated
sudo iptables -L -n                  # the classic view (often nft-backed now)`}
        </Pre>
        <Note type="danger">
          On a remote machine, always allow SSH (port 22) <em>before</em> you enable the firewall or set a default-deny inbound policy. More people have locked themselves out of a cloud server by enabling ufw without an SSH rule than by almost any other mistake. If it happens, you need console access through the provider to recover.
        </Note>
        <P>
          Networking ties the whole module together: addresses and ports from this chapter, services and logs from Chapter 9, permissions on key files from Chapter 7, and the packages that provide all these tools from Chapter 10. With ip, ss, SSH, and a firewall in hand, you can stand up, reach, and defend a Linux machine across a network - which is precisely what the final chapter asks you to do as you harden a box and build a lab.
        </P>
      </div>
    ),
  },

  // ─────────────────────────── CHAPTER 12 ───────────────────────────
  {
    id: 'hardening-lab',
    title: 'Hardening Your Box and Building Your Hacking Lab',
    difficulty: 'INTERMEDIATE',
    readTime: '22 min',
    labLink: '/modules/linux/lab',
    takeaways: [
      'Hardening is layered: patch promptly, use a non-root user, lock down SSH to keys only, disable unused services, and firewall.',
      'Key-only SSH plus fail2ban removes password brute-forcing as a threat and auto-blocks IPs that keep trying.',
      'Every listening service is attack surface - audit with ss -tulpn and disable what you do not need.',
      'A safe lab uses isolated host-only/internal networks and snapshots so experiments can never escape or cause lasting harm.',
      'Only ever attack systems you own or are explicitly authorised to test - the law does not care that it was "just practice".',
    ],
    content: (
      <div>
        <H3>Hardening as Layers</H3>
        <P>
          You now know enough to make a Linux machine meaningfully secure. Hardening is not one trick; it is a set of layers, each shrinking what an attacker can do. No single layer is perfect, but together they turn an easy target into a frustrating one, and frustrating targets get skipped. Everything here reuses skills from earlier chapters - packages, users, services, SSH, firewall - which is the point: hardening is just applying the fundamentals deliberately.
        </P>

        <H3>Layer 1: Keep It Patched</H3>
        <P>
          The most effective security measure is also the dullest: install updates. The majority of real-world compromises exploit known vulnerabilities for which a fix already existed. A machine that applies its security updates promptly has already closed the doors most attackers try first.
        </P>
        <Pre label="PATCHING AND UNATTENDED UPGRADES">
{`sudo apt update && sudo apt upgrade -y        # apply updates now

# Make security updates automatic on a server so you never fall behind:
sudo apt install unattended-upgrades
sudo dpkg-reconfigure --priority=low unattended-upgrades
# This installs security patches on a schedule without manual intervention.`}
        </Pre>

        <H3>Layer 2: A Non-Root User for Daily Work</H3>
        <P>
          As Chapter 8 argued, do not operate as root. Create a normal user, give it sudo for the moments admin rights are genuinely needed, and use it for everything else. This single habit means a mistake or an exploited program starts with limited power rather than total control.
        </P>
        <Pre label="A PROPER DAILY USER">
{`sudo adduser analyst              # create the account
sudo usermod -aG sudo analyst     # grant admin rights via the sudo group
# log out, log back in as analyst, and use 'sudo' only when needed.`}
        </Pre>

        <H3>Layer 3: Lock Down SSH</H3>
        <P>
          SSH is the most exposed service on most servers, so it earns the most attention. The high-value changes are: disable direct root login, disable password authentication entirely in favour of keys (which you set up in Chapter 11), and consider moving off the default port to cut down automated noise. These are set in the SSH server&apos;s config file and applied by reloading the service.
        </P>
        <Pre label="HARDENING sshd_config">
{`sudo nano /etc/ssh/sshd_config

# Set (or uncomment and change) these directives:
#   PermitRootLogin no                 # never log in directly as root
#   PasswordAuthentication no          # keys only - no password guessing possible
#   PubkeyAuthentication yes           # allow key-based auth
#   PermitEmptyPasswords no
#   X11Forwarding no                   # off unless you truly need GUI forwarding

sudo sshd -t                           # TEST the config for syntax errors first
sudo systemctl reload ssh              # apply without dropping your session`}
        </Pre>
        <Note type="danger">
          Before setting PasswordAuthentication no, confirm that key-based login already works from a second terminal. If you disable passwords without a working key, you will lock yourself out. Always keep one logged-in session open while changing SSH settings, so you can revert if something is wrong.
        </Note>

        <H3>Layer 4: fail2ban - Automatic Blocking</H3>
        <P>
          Even with keys, services get hammered by automated login attempts. <strong style={{ color: '#a8c8b2' }}>fail2ban</strong> watches logs like /var/log/auth.log (Chapter 9) and, when it sees repeated failures from an address, automatically adds a firewall rule to block that address for a while. It turns a constant background attack into a non-event. The concept is simple and the defaults are sensible: too many failures in too short a time earns a temporary ban.
        </P>
        <Pre label="fail2ban">
{`sudo apt install fail2ban
sudo systemctl enable --now fail2ban

# Configure in a local override (never edit the shipped jail.conf directly):
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo nano /etc/fail2ban/jail.local
#   [sshd]
#   enabled  = true
#   maxretry = 5           # ban after 5 failures
#   bantime  = 1h          # for one hour
#   findtime = 10m         # counted within a 10-minute window

sudo systemctl restart fail2ban
sudo fail2ban-client status sshd        # see who is currently banned`}
        </Pre>

        <H3>Layer 5: Disable Unused Services and Firewall</H3>
        <P>
          Every listening service is a door; doors you do not use should be shut. Audit what is listening with ss -tulpn, and for anything you do not need, stop and disable it with systemctl. Then put a default-deny firewall in front with ufw, allowing only the ports your machine genuinely serves. Attack surface you remove is attack surface no one can exploit.
        </P>
        <Pre label="SHRINK THE ATTACK SURFACE">
{`ss -tulpn                               # what is listening? audit every line
systemctl list-unit-files --state=enabled   # what starts at boot?

sudo systemctl disable --now cups       # example: no need for printing on a server
sudo systemctl disable --now avahi-daemon   # example: no need for mDNS discovery

sudo ufw default deny incoming
sudo ufw allow 22/tcp                   # keep SSH (adjust if you changed the port)
sudo ufw enable
sudo ufw status verbose`}
        </Pre>
        <Table
          headers={['Layer', 'Action', 'What it stops']}
          rows={[
            ['Patching', 'apt upgrade, unattended-upgrades', 'Exploits of known, already-fixed bugs'],
            ['Least privilege', 'Non-root user + scoped sudo', 'A mistake/exploit becoming total control'],
            ['SSH keys only', 'PasswordAuthentication no', 'Password guessing and brute force'],
            ['fail2ban', 'Auto-ban repeat offenders', 'Sustained automated login attacks'],
            ['Service audit', 'Disable unused daemons', 'Exploitation of software you never use'],
            ['Firewall', 'ufw default-deny', 'Access to everything you did not permit'],
          ]}
        />

        <H3>Building a Safe Hacking Lab</H3>
        <P>
          With a hardened host understood, the other half of this chapter is the reason you came: a lab where you can safely practise attacks. The architecture is simple and the safety comes from isolation. You run an <strong style={{ color: '#a8c8b2' }}>attacker VM</strong> - Kali or Parrot - and one or more deliberately <strong style={{ color: '#a8c8b2' }}>vulnerable target VMs</strong>, all connected by a private virtual network (host-only or internal, from Chapter 3) so they can reach each other but nothing else. You snapshot every machine in a clean state, so any experiment is one click away from being undone.
        </P>
        <Table
          headers={['Target', 'What it teaches', 'Where to get it']}
          rows={[
            ['Metasploitable 2', 'A box full of classic vulnerabilities', 'Rapid7 / SourceForge (free VM)'],
            ['DVWA', 'Damn Vulnerable Web App - web flaws, tunable', 'Docker image or install'],
            ['OWASP Juice Shop', 'Modern web vulnerabilities, gamified', 'Docker / npm (free)'],
            ['VulnHub boxes', 'Full capture-the-flag machines to defeat', 'VulnHub.com (free downloads)'],
            ['HackTheBox', 'Online labs, retired boxes with writeups', 'hackthebox.com (online)'],
            ['TryHackMe', 'Guided online rooms for beginners up', 'tryhackme.com (online)'],
          ]}
        />
        <Pre label="A MINIMAL ISOLATED LAB - THE RECIPE">
{`1. Create a host-only (or internal) network in VirtualBox/VMware.
     VirtualBox: File -> Tools -> Network Manager -> Host-only, create one.
2. Attacker VM: install Kali or Parrot. Attach its network adapter to the
   host-only network (and, briefly, NAT to update it, then remove NAT).
3. Target VM: import Metasploitable 2 (or run DVWA/Juice Shop in Docker on a
   small Linux VM). Attach ONLY the host-only network - no NAT, no bridged.
4. Confirm isolation from the target:
     ip a                      # note the lab address, e.g. 10.0.x.x
     ping -c2 8.8.8.8          # this SHOULD FAIL - the target cannot reach out
     ping -c2 <attacker-ip>    # this SHOULD WORK - they can see each other
5. SNAPSHOT every VM now, labelled "clean". Snapshot again before each session.
6. From Kali, discover and probe the target (previewing later modules):
     ip a; ping -c2 <target-ip>
     nmap -sV <target-ip>      # the target's open ports and service versions`}
        </Pre>
        <Note type="tip">
          Running DVWA or Juice Shop as a Docker container on a single small Linux VM is often the fastest path to a web-app target - one VM, several vulnerable apps, torn down and rebuilt in seconds. Keep that VM on the same isolated network and snapshot it like any other.
        </Note>

        <H3>Isolation, Snapshots, and Why They Are Non-Negotiable</H3>
        <P>
          Two rules keep a lab both useful and safe. First, <strong style={{ color: '#a8c8b2' }}>isolate the network</strong>: vulnerable machines are, by definition, insecure, and a vulnerable VM bridged to your real network or the internet is a genuine hazard - it can be found and compromised by someone other than you, and become a foothold into your actual systems. Host-only or internal networking ensures the lab is a sealed room. Second, <strong style={{ color: '#a8c8b2' }}>snapshot relentlessly</strong>: before every experiment, snapshot; when a box is wrecked or infected (especially during malware analysis), restore. This is what makes fearless practice possible.
        </P>

        <H3>The Legal and Ethical Line</H3>
        <Note type="danger">
          Only ever attack systems you own or have explicit, written authorisation to test. Running these techniques against a website, server, network, or device you do not own is a crime in essentially every jurisdiction - under laws such as the US Computer Fraud and Abuse Act and the UK Computer Misuse Act - regardless of your intentions, whether you caused damage, or whether you call it &quot;just practice&quot;. The skills in this platform are powerful precisely because they are real.
        </Note>
        <P>
          This is not a disclaimer to skim; it is the single most important boundary in the entire field, and it is what separates a security professional from a criminal. The lab you just built exists so you never need to cross that line: your attacker VM and your target VMs are yours, isolated, and snapshotted, giving you unlimited permission to attack unlimited times with zero risk to anyone. Online platforms like HackTheBox and TryHackMe extend that permission to purpose-built targets they own and invite you to break. Authorised bug-bounty programs let you test real systems within published rules. There is an abundance of legal places to practise - use them, and keep every technique you learn pointed only at those.
        </P>
        <P>
          You have reached the end of the core infrastructure. You can now install, run, navigate, operate, and secure a Linux system, and you have a safe place to practise everything that follows. From here the platform&apos;s offensive and defensive modules all build on this ground - the shell, the filesystem, permissions, processes, packages, and the network you now understand. Take a snapshot, open the lab, and keep going.
        </P>
      </div>
    ),
  },
]

export default function LinuxPage() {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Breadcrumb */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem',
        fontFamily: mono, fontSize: '0.7rem', color: '#5f7d67'
      }}>
        <Link href="/" style={{ color: '#5f7d67', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>&#8250;</span>
        <span style={{ color: accent }}>MOD &middot; LINUX</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link href="/modules/scripting" style={{
            fontFamily: mono, fontSize: '0.65rem', color: '#5f7d67',
            textDecoration: 'none', letterSpacing: '0.05em'
          }}>
            SCRIPTING: PYTHON &amp; BASH &#8594;
          </Link>
        </div>
      </div>

      {/* Page header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{
          fontFamily: mono, fontSize: '9px', letterSpacing: '0.2em',
          color: '#5f7d67', textTransform: 'uppercase', marginBottom: '0.5rem'
        }}>
          MODULE &middot; LINUX
        </div>
        <h1 style={{
          fontFamily: mono, fontSize: '2rem', fontWeight: 700, color: accent,
          margin: '0.5rem 0', lineHeight: 1.1, textShadow: '0 0 20px rgba(115,201,145,0.4)'
        }}>
          LINUX MASTERY: THE OPERATOR&apos;S OS
        </h1>
        <p style={{ color: '#5f7d67', fontFamily: mono, fontSize: '0.75rem', lineHeight: 1.6 }}>
          Install &amp; run &middot; The shell &middot; Filesystem &middot; Files &amp; text &middot; Permissions &middot; Users &amp; privilege &middot; Processes &amp; services &middot; Packages &middot; Networking &middot; Hardening &amp; lab building
        </p>
      </div>

      {/* Chapter overview stats */}
      <div className="module-stat-grid">
        {[
          ['12', 'CHAPTERS'],
          ['~4hr', 'TOTAL READ'],
          ['BEGINNER', 'DIFFICULTY'],
          ['CORE', 'IDENTIFIER'],
        ].map(([val, label], i) => (
          <div key={i} style={{ background: 'rgba(115,201,145,0.04)', border: '1px solid rgba(115,201,145,0.15)', borderRadius: '6px', padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontFamily: mono, fontSize: '1.2rem', fontWeight: 700, color: accent }}>{val}</div>
            <div style={{ fontFamily: mono, fontSize: '0.6rem', color: '#38603f', letterSpacing: '0.15em', marginTop: '2px' }}>{label}</div>
          </div>
        ))}
      </div>

      <ModuleCodex moduleId="linux" accent={accent} chapters={chapters} />

      {/* Bottom navigation */}
      <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid #0e2012' }}>
        <div style={{ background: 'rgba(115,201,145,0.04)', border: '1px solid rgba(115,201,145,0.2)', borderRadius: '8px', padding: '2rem', textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontFamily: mono, fontSize: '0.65rem', color: '#38603f', letterSpacing: '0.25em', marginBottom: '0.5rem' }}>READY TO PRACTICE?</div>
          <div style={{ fontFamily: mono, fontSize: '1rem', color: accent, marginBottom: '0.5rem', fontWeight: 600 }}>Linux Interactive Lab: First Boot</div>
          <div style={{ fontFamily: mono, fontSize: '0.75rem', color: '#38603f', marginBottom: '1.5rem' }}>22 steps &middot; 330 XP &middot; Real commands &middot; Flag captures</div>
          <Link href="/modules/linux/lab" style={{ textDecoration: 'none', fontFamily: mono, fontSize: '0.85rem', color: accent, padding: '12px 32px', border: '1px solid rgba(115,201,145,0.6)', borderRadius: '6px', background: 'rgba(115,201,145,0.1)', fontWeight: 700, letterSpacing: '0.12em', boxShadow: '0 0 20px rgba(115,201,145,0.15)', display: 'inline-block' }}>
            LAUNCH LAB &#8594;
          </Link>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Link href="/modules/scripting" style={{ textDecoration: 'none', fontFamily: mono, fontSize: '0.75rem', color: '#38603f' }}>SCRIPTING: PYTHON &amp; BASH &#8594;</Link>
        </div>
      </div>
    </div>
  )
}
