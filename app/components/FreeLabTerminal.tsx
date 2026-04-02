'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react'

const mono = 'JetBrains Mono, monospace'

// ─── Simulated command responses ──────────────────────────────────────────────
// Each module gets a command library. Unknown commands get a realistic fallback.

interface CommandLib {
  [cmd: string]: string | ((args: string) => string)
}

const UNIVERSAL_COMMANDS: CommandLib = {
  help:    () => `Available commands: help, clear, whoami, pwd, ls, echo, date, uname, history\nType any real security command to see simulated output.\nUse this terminal to experiment freely — no wrong answers.`,
  clear:   '__CLEAR__',
  whoami:  'ghost',
  pwd:     '/home/ghost',
  date:    () => new Date().toUTCString(),
  uname:   'Linux ghost-lab 5.15.0-kali3-amd64 #1 SMP Debian 5.15.15-2kali1 x86_64 GNU/Linux',
  echo:    (args) => args || '',
  history: '1  nmap -sS target\n2  gobuster dir -u http://target -w /usr/share/wordlists/dirb/common.txt\n3  sqlmap -u "http://target/login" --dbs\n4  msfconsole\n5  history',
  ls:      'Desktop  Documents  Downloads  labs  tools  wordlists',
  'ls -la': 'total 48\ndrwxr-xr-x  8 ghost ghost 4096 Jan 15 09:22 .\ndrwxr-xr-x 22 ghost ghost 4096 Jan 15 08:00 ..\n-rw-r--r--  1 ghost ghost  220 Jan 15 08:00 .bash_logout\n-rw-r--r--  1 ghost ghost 3526 Jan 15 08:00 .bashrc\ndrwxrwxr-x  3 ghost ghost 4096 Jan 15 09:22 labs\ndrwxrwxr-x  2 ghost ghost 4096 Jan 15 08:30 tools\ndrwxrwxr-x  4 ghost ghost 4096 Jan 15 08:30 wordlists',
}

const MODULE_COMMANDS: Record<string, CommandLib> = {
  tor: {
    'systemctl status tor':         'active (running) since Mon 2025-01-13 09:00:00 UTC; 2h 14min ago\n  Main PID: 1337 (tor)\nJan 13 09:00:00 tor[1337]: Bootstrapped 100% (done): Done',
    'systemctl start tor':          'Starting tor.service - Anonymizing overlay network for TCP... OK',
    'curl --socks5 localhost:9050 https://check.torproject.org/api/ip': '{"IsTor":true,"IP":"185.220.101.47"}',
    'torsocks curl https://ifconfig.me': '185.220.101.47',
    'cat /etc/tor/torrc':           '# Tor config\nSocksPort 9050\nSocksPolicy accept 127.0.0.1\nLog notice file /var/log/tor/notices.log\nRunAsDaemon 1\nDataDirectory /var/lib/tor',
    'torsocks wget https://target.onion': 'Connecting via Tor... 200 OK\nDownloading: target.onion/index.html',
    'tor --version':                'Tor version 0.4.8.10.',
    'nyx':                          '[nyx TUI - Tor relay monitor]\nBandwidth: 1.2 MB/s in, 0.8 MB/s out\nCircuits: 3 active\n[Press q to quit]',
  },
  osint: {
    'dnsenum target.com':           'dnsenum VERSION:1.2.6\nHost addresses: 93.184.216.34\nName Servers: a.iana-servers.net, b.iana-servers.net\nMX Records: 10 mail.target.com\nZone Transfer: AXFR for target.com failed',
    'subfinder -d target.com':      '[INF] Enumerating subdomains for target.com\nmail.target.com\nwww.target.com\nstatic.target.com\napi.target.com\ndev.target.com\n[INF] Found 5 subdomains',
    'theHarvester -d target.com -b google': 'Harvesting emails from google...\n  admin@target.com\n  info@target.com\n  support@target.com\n[*] Total emails: 3',
    'exiftool image.jpg':           'ExifTool Version Number         : 12.65\nFile Name                       : image.jpg\nGPS Latitude                    : 51 deg 30 min 26.45 sec N\nGPS Longitude                   : 0 deg 7 min 39.87 sec W\nCreate Date                     : 2024:03:15 14:22:11\nCamera Model Name               : iPhone 14 Pro',
    'whois target.com':             'Domain Name: TARGET.COM\nRegistrar: GoDaddy.com, LLC\nCreation Date: 2001-01-01\nName Server: A.IANA-SERVERS.NET\nRegistrant Country: US',
    'shodan search "apache 2.4.49"':'Results: 892\n192.168.1.100  443  Apache httpd 2.4.49\n10.10.10.50    80   Apache httpd 2.4.49 (CVE-2021-41773)',
  },
  malware: {
    'file malware.exe':             'malware.exe: PE32+ executable (GUI) x86-64, for MS Windows, 7 sections',
    'strings malware.exe | head':   'This program cannot be run in DOS mode\nCreateRemoteThread\nVirtualAllocEx\nWriteProcessMemory\nC:\\Windows\\System32\\cmd.exe\nhttp://c2.evil.com/beacon',
    'strings malware.exe | grep -i http': 'http://c2.evil.com/beacon\nhttp://update.evil.com/payload.dll',
    'strace -p 1337':               'execve("/bin/sh", ["sh", "-c", "cmd.exe"], ...) = 0\nopen("/etc/passwd", O_RDONLY) = 3\nread(3, "root:x:0:0:root:/root:/bin/bash", ...) = 1024\nconnect(4, {AF_INET, "185.220.101.1", 4444}) = 0',
    'tcpdump -i eth0':              'tcpdump: listening on eth0\n10.0.0.5.49152 > 185.220.101.1.4444: Flags [S], seq 0\n185.220.101.1.4444 > 10.0.0.5.49152: Flags [S.]\n[C2 beacon traffic detected]',
    'clamav malware.exe':           '/tmp/malware.exe: Trojan.GenericKD.46329173 FOUND\n----------- SCAN SUMMARY -----------\nScanned files: 1   Infected files: 1',
    'pecheck malware.exe':          'PE header info:\n  Timestamp: 2024-03-15\n  Sections: .text .rdata .data .reloc\n  Imports: kernel32.dll, ws2_32.dll, advapi32.dll\n  Suspicious: VirtualAllocEx, CreateRemoteThread',
  },
  'active-directory': {
    'enum4linux -a 10.10.10.100':   'Starting enum4linux...\n[+] Domain: GHOSTCORP\n[+] Users: administrator, svc_backup, john.doe\n[+] Shares: ADMIN$, C$, IPC$, Backup\n[+] Password policy: min 7 chars, lockout after 5',
    'GetUserSPNs.py GHOSTCORP/john.doe:Password123 -request': 'ServicePrincipalName: MSSQLSvc/dc01.ghostcorp.local:1433\nName: svc_mssql\n$krb5tgs$23$*svc_mssql$GHOSTCORP.LOCAL*$a2b3c4...[HASH]',
    'hashcat -m 13100 hash.txt rockyou.txt': 'Session.........: hashcat\nStatus..........: Cracked\n$krb5tgs$23:P@ssw0rd2024',
    'crackmapexec smb 10.10.10.100 -u administrator -H aad3b435b51404eeaad3b435b51404ee:e10adc3949ba59abbe56e057f20f883e': '[+] 10.10.10.100:445 GHOSTCORP\\administrator (Pwn3d!)',
    'secretsdump.py GHOSTCORP/administrator@10.10.10.100': 'Dumping NTDS.dit...\nadministrator:500:aad3b435:e10adc3949::: \nkrbtgt:502:aad3b435:f4e37e57f97:::',
    'bloodhound-python -u john.doe -p Password123 -d ghostcorp.local -c all': 'INFO: Found AD domain: GHOSTCORP.LOCAL\nINFO: Connecting to LDAP server: dc01.ghostcorp.local\nINFO: Found 47 users, 12 computers, 8 groups\nINFO: Done in 00M 03S',
  },
  'web-attacks': {
    'sqlmap -u "http://target.com/login?id=1" --dbs': 'sqlmap/1.7.12\n[*] testing connection to target\n[*] testing SQL injection on parameter id\n[+] DBMS: MySQL 8.0.32\navailable databases: information_schema, webapp_db, users',
    'sqlmap -u "http://target.com/login?id=1" -D webapp_db --tables': 'tables: users, products, orders, sessions\n[3 tables]',
    'gobuster dir -u http://target.com -w /usr/share/wordlists/dirb/common.txt': '/admin               (Status: 301)\n/backup              (Status: 200)\n/.git                (Status: 200)\n/uploads             (Status: 200)\n/config.php          (Status: 200)',
    'nikto -h http://target.com':   '+ Server: Apache/2.4.49\n+ CVE-2021-41773: Path traversal possible\n+ /admin: Admin login panel\n+ robots.txt found: /backup, /admin, /api',
    'wfuzz -w wordlist.txt -u http://target.com/FUZZ': '000000001: 301 "admin"\n000000002: 200 "backup"\n000000003: 403 ".git"',
  },
  network: {
    'nmap -sS 10.10.10.0/24':       'Starting Nmap 7.94...\nNmap scan report for 10.10.10.1\nPORT   STATE SERVICE\n22/tcp open  ssh\n80/tcp open  http\n443/tcp open https',
    'arpspoof -i eth0 -t 10.10.10.1 10.10.10.254': 'arpspoof: enabling forwarding between 10.10.10.1 and 10.10.10.254\n0:c:29:a:b:c 0:c:29:d:e:f 0806 60: arp reply 10.10.10.254 is-at 0:c:29:a:b:c',
    'tcpdump -i eth0 -A': 'tcpdump: listening on eth0, link-type EN10MB\n10.10.10.5.80 > 10.10.10.100.50234: HTTP/1.1 200 OK\nAuthorization: Basic dXNlcjpwYXNz (user:pass)',
    'bettercap':                    'bettercap v2.32.0\ntype help for available commands\nbettercap > net.probe on\nbettercap > arp.spoof on\nbettercap > net.sniff on',
  },
  wireless: {
    'airmon-ng start wlan0':        'Found 3 processes that could cause trouble.\nProcess with PID 1234 (NetworkManager) has been killed\nPHY     Interface   Driver  Chipset\nphy0    wlan0mon    ath9k   Atheros AR9462',
    'airodump-ng wlan0mon':         'BSSID              PWR  Beacons  #Data  CH  ENC  ESSID\nAA:BB:CC:DD:EE:FF  -42       128     14   6  WPA2 TargetNetwork\n11:22:33:44:55:66  -78        56      2  11  WPA2 NeighborNet',
    'airodump-ng --bssid AA:BB:CC:DD:EE:FF -c 6 -w capture wlan0mon': 'Capturing on channel 6...\nHandshake captured: capture-01.cap',
    'hashcat -m 22000 capture.hc22000 rockyou.txt': 'Status: Cracked\nHash: AA:BB:CC:DD:EE:FF:password123',
    'hcitool scan':                 'Scanning ...\n  00:1A:7D:DA:71:13  iPhone 14 Pro\n  AC:37:43:5D:8E:4F  MacBook Pro\n  88:66:5A:3A:5C:5F  GalaxyBuds',
  },
  mobile: {
    'adb devices':                  'List of devices attached\nemulator-5554  device',
    'adb shell':                    'OnePlus9:/ $',
    'adb shell pm list packages':   'package:com.android.settings\npackage:com.example.targetapp\npackage:com.google.android.gms',
    'frida-ps -U':                  'PID   Name\n1234  com.example.targetapp\n5678  com.android.settings',
    'objection -g com.example.targetapp explore': 'Using USB device `OnePlus9`\nAgent injected and running on pid: 1234\ncom.example.targetapp on (Android: 12)> ',
    'jadx -d output/ app.apk':      'INFO  - loading ...\nINFO  - processing ...\nINFO  - done\nDECOMPILED: output/sources/com/example/targetapp/MainActivity.java',
  },
  cloud: {
    'aws sts get-caller-identity':  '{\n  "UserId": "AIDIODR4TAW7CSEXAMPLE",\n  "Account": "123456789012",\n  "Arn": "arn:aws:iam::123456789012:user/ghost-operator"\n}',
    'aws s3 ls --no-sign-request':  '2024-01-15 09:00:00 target-backup-bucket\n2024-01-14 15:30:00 dev-config-bucket\n[WARNING] Public bucket exposed',
    'aws s3 ls s3://target-backup-bucket --no-sign-request': '2024-01-15  database_backup.sql\n2024-01-14  config.env\n2024-01-13  credentials.json',
    'curl http://169.254.169.254/latest/meta-data/': 'ami-id\nami-launch-index\nhostname\niam/security-credentials/\nidentity-credentials/\nlocal-ipv4',
    'enumerate-iam --access-key AKIA... --secret-key ...': 'Attempting to get role and policy info...\n[+] sts:GetCallerIdentity\n[+] s3:ListAllMyBuckets\n[+] ec2:DescribeInstances\n[!] No admin privs — but s3:GetObject on backup bucket',
  },
}

function getCommandOutput(moduleId: string, cmd: string): string | null {
  const trimmed = cmd.trim()
  const lower = trimmed.toLowerCase()

  // Universal commands first
  const universal = UNIVERSAL_COMMANDS[lower] || UNIVERSAL_COMMANDS[trimmed]
  if (universal !== undefined) {
    if (universal === '__CLEAR__') return '__CLEAR__'
    return typeof universal === 'function' ? universal(trimmed.split(' ').slice(1).join(' ')) : universal
  }

  // Module-specific
  const modKey = moduleId.replace('active-directory', 'active-directory').replace('network-attacks', 'network').replace('wireless-attacks', 'wireless').replace('mobile-security', 'mobile').replace('cloud-security', 'cloud').replace('social-engineering', 'social').replace('red-team', 'red')
  const modLib = MODULE_COMMANDS[modKey] || MODULE_COMMANDS[moduleId] || {}

  // Exact match
  if (modLib[trimmed]) {
    const v = modLib[trimmed]
    return typeof v === 'function' ? v(trimmed.split(' ').slice(1).join(' ')) : v
  }

  // Prefix match (e.g. "nmap -sS" in any nmap command)
  for (const [key, val] of Object.entries(modLib)) {
    if (lower.startsWith(key.toLowerCase().split(' ')[0]) && lower.includes(key.toLowerCase().split(' ')[1] || '')) {
      return typeof val === 'function' ? val(trimmed.split(' ').slice(1).join(' ')) : val
    }
  }

  return null
}

// ─── Generic fallback responses ───────────────────────────────────────────────

function genericResponse(cmd: string): string {
  const lower = cmd.toLowerCase().trim()
  if (lower.startsWith('nmap')) return `Starting Nmap 7.94...\nNote: Use nmap in a real environment for actual results.\nSimulated: Host is up. Open ports: 22, 80, 443`
  if (lower.startsWith('msfconsole') || lower === 'msf6 >') return `Metasploit Framework Console v6.3.44\n\n       =[ metasploit v6.3.44-dev                          ]\n+ -- --=[ 2361 exploits - 1232 auxiliary - 414 post       ]\n+ -- --=[ 1110 payloads - 45 encoders - 11 nops           ]\nmsf6 > `
  if (lower.startsWith('python') || lower.startsWith('python3')) return `Python 3.11.5 (main)\n>>> [Python interpreter - type commands]`
  if (lower.startsWith('sudo')) return `[sudo] password for ghost: \n${lower.replace('sudo ', '')} executed with elevated privileges`
  if (lower.startsWith('wget') || lower.startsWith('curl')) return `--2025-01-15 09:22:11--  ${cmd.split(' ').pop()}\nConnecting... connected.\nHTTP request sent, awaiting response... 200 OK\nLength: 4096 [text/html]`
  if (lower.startsWith('cat')) return `[Contents of ${cmd.split(' ').pop() || 'file'}]\n# Config file\nkey=value\npassword=changeme123`
  if (lower.startsWith('grep')) return `[grep] matching lines from input`
  if (lower.startsWith('cd')) return '' // silent
  if (lower.startsWith('mkdir') || lower.startsWith('touch')) return '' // silent
  if (lower.startsWith('ping')) return `PING ${cmd.split(' ').pop()} 56(84) bytes of data.\n64 bytes from ${cmd.split(' ').pop()}: icmp_seq=1 ttl=64 time=0.521 ms`
  return `ghost@lab: command executed\n[In a real environment: ${cmd}]`
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  moduleId: string
  moduleName: string
  accent: string
  onClose?: () => void
}

export default function FreeLabTerminal({ moduleId, moduleName, accent, onClose }: Props) {
  const [lines, setLines] = useState<{ text: string; type: 'cmd' | 'out' | 'err' | 'sys' | 'info' }[]>([])
  const [input, setInput] = useState('')
  const [cmdHistory, setCmdHistory] = useState<string[]>([])
  const [histIdx, setHistIdx] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setLines([
      { text: '╔══════════════════════════════════════════════════════╗', type: 'sys' },
      { text: '║  GHOSTNET FREE LAB ENVIRONMENT — ' + moduleName.padEnd(20) + '║', type: 'sys' },
      { text: '╚══════════════════════════════════════════════════════╝', type: 'sys' },
      { text: '', type: 'sys' },
      { text: 'Module: ' + moduleName, type: 'info' },
      { text: 'Mode: FREE PRACTICE — no wrong answers, experiment freely', type: 'info' },
      { text: 'Type "help" for commands. Use this to test real scenarios.', type: 'info' },
      { text: '', type: 'sys' },
      { text: 'ghost@' + moduleId + '-lab:~$ ', type: 'sys' },
    ])
    inputRef.current?.focus()
  }, [moduleId, moduleName])

  useEffect(() => {
    if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight
  }, [lines])

  const addLine = useCallback((text: string, type: 'cmd' | 'out' | 'err' | 'sys' | 'info') => {
    setLines(prev => [...prev, { text, type }])
  }, [])

  const handleCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim()
    if (!trimmed) return

    addLine('ghost@' + moduleId + '-lab:~$ ' + trimmed, 'cmd')
    setCmdHistory(prev => [trimmed, ...prev.slice(0, 49)])
    setHistIdx(-1)

    if (trimmed.toLowerCase() === 'clear') {
      setLines([{ text: 'ghost@' + moduleId + '-lab:~$ ', type: 'sys' }])
      return
    }

    if (trimmed.toLowerCase() === 'exit' || trimmed.toLowerCase() === 'quit') {
      addLine('Type "close" to exit the lab environment.', 'info')
      return
    }

    if (trimmed.toLowerCase() === 'close') {
      onClose?.()
      return
    }

    // Try module-specific response
    const modOutput = getCommandOutput(moduleId, trimmed)
    if (modOutput) {
      modOutput.split('\n').forEach(line => addLine(line, 'out'))
    } else {
      genericResponse(trimmed).split('\n').forEach(line => addLine(line, 'out'))
    }

    addLine('', 'sys')
  }, [moduleId, addLine, onClose])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input)
      setInput('')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const newIdx = Math.min(histIdx + 1, cmdHistory.length - 1)
      setHistIdx(newIdx)
      setInput(cmdHistory[newIdx] || '')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const newIdx = Math.max(histIdx - 1, -1)
      setHistIdx(newIdx)
      setInput(newIdx === -1 ? '' : cmdHistory[newIdx])
    } else if (e.key === 'Tab') {
      e.preventDefault()
      // Simple tab completion from command list
      const partial = input.toLowerCase()
      const modLib = MODULE_COMMANDS[moduleId] || {}
      const all = [...Object.keys(UNIVERSAL_COMMANDS), ...Object.keys(modLib)]
      const match = all.find(c => c.startsWith(partial))
      if (match) setInput(match)
    }
  }

  const lineColor = (type: string) => {
    if (type === 'cmd') return '#ffffff'
    if (type === 'out') return '#00ff41'
    if (type === 'err') return '#ff4136'
    if (type === 'info') return accent
    return '#3a7a3a'
  }

  return (
    <div style={{ fontFamily: mono, display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Terminal header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 14px', background: '#0a140a', borderBottom: '1px solid ' + accent + '30', borderRadius: '8px 8px 0 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: accent, boxShadow: '0 0 8px ' + accent }} />
          <span style={{ fontSize: '8px', color: accent, letterSpacing: '0.2em', fontWeight: 700 }}>FREE LAB ENVIRONMENT — {moduleName.toUpperCase()}</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '7px', color: '#2a6a2a', letterSpacing: '0.1em' }}>TAB: autocomplete &nbsp;·&nbsp; ↑↓: history</span>
          {onClose && (
            <button onClick={onClose} style={{ background: 'rgba(255,65,54,0.1)', border: '1px solid rgba(255,65,54,0.3)', borderRadius: '3px', padding: '2px 8px', cursor: 'pointer', fontFamily: mono, fontSize: '7px', color: '#ff4136', letterSpacing: '0.1em' }}>
              CLOSE ✕
            </button>
          )}
        </div>
      </div>

      {/* Output area */}
      <div
        ref={outputRef}
        onClick={() => inputRef.current?.focus()}
        style={{ flex: 1, background: '#030803', padding: '14px 16px', overflowY: 'auto', cursor: 'text', minHeight: '320px', maxHeight: '480px' }}
      >
        {lines.map((l, i) => (
          <div key={i} style={{ fontSize: '0.76rem', color: lineColor(l.type), lineHeight: 1.65, whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontFamily: mono }}>
            {l.text || '\u00a0'}
          </div>
        ))}
        {/* Live input echo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
          <span style={{ fontSize: '0.76rem', color: '#00ff41', fontFamily: mono }}>ghost@{moduleId}-lab:~$</span>
          <span style={{ fontSize: '0.76rem', color: '#fff', fontFamily: mono }}>{input}</span>
          <span style={{ display: 'inline-block', width: '8px', height: '14px', background: accent, animation: 'blink 1s step-end infinite', opacity: 0.9 }} />
          <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
        </div>
      </div>

      {/* Input bar */}
      <div style={{ display: 'flex', background: '#050a05', border: '1px solid ' + accent + '30', borderTop: 'none', borderRadius: '0 0 8px 8px', overflow: 'hidden' }}>
        <span style={{ padding: '10px 12px', fontSize: '0.76rem', color: '#00ff41', flexShrink: 0, fontFamily: mono }}>ghost@{moduleId}-lab:~$</span>
        <input
          ref={inputRef}
          autoFocus
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontFamily: mono, fontSize: '0.76rem', color: '#fff', padding: '10px 0' }}
          placeholder="Type a command and press Enter..."
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
        />
        <button
          onClick={() => { handleCommand(input); setInput('') }}
          style={{ padding: '0 16px', background: accent + '12', border: 'none', borderLeft: '1px solid ' + accent + '20', cursor: 'pointer', fontFamily: mono, fontSize: '8px', color: accent, letterSpacing: '0.12em' }}
        >
          RUN
        </button>
      </div>
    </div>
  )
}
