'use client'
import React from 'react'
import Link from 'next/link'

const Tag = ({ children }: { children: React.ReactNode }) => (
  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', letterSpacing: '0.2em', color: '#5a7a5a', textTransform: 'uppercase' as const }}>{children}</span>
)
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
    {label && <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5a7a5a', letterSpacing: '0.15em', marginBottom: '4px', paddingLeft: '4px' }}>{label}</div>}
    <pre style={{ background: '#050805', border: '1px solid #1a2e1e', borderRadius: '4px', padding: '1.25rem', overflow: 'auto', color: '#00d4ff', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', lineHeight: 1.7, whiteSpace: 'pre' as const }}>{children}</pre>
  </div>
)
const Alert = ({ type, children }: { type: 'info' | 'warn' | 'danger' | 'tip' | 'beginner'; children: React.ReactNode }) => {
  const configs: Record<string, [string, string, string]> = {
    info:     ['#00d4ff', 'rgba(0,212,255,0.05)', 'NOTE'],
    warn:     ['#ffb347', 'rgba(255,179,71,0.05)', 'WARNING'],
    danger:   ['#ff4136', 'rgba(255,65,54,0.05)',  'CRITICAL'],
    tip:      ['#00ff41', 'rgba(0,255,65,0.04)',   'PRO TIP'],
    beginner: ['#00d4ff', 'rgba(0,212,255,0.05)',  'BEGINNER NOTE'],
  }
  const [color, bg, label] = configs[type]
  return (
    <div style={{ background: bg, borderLeft: '3px solid ' + color, padding: '1rem 1.25rem', borderRadius: '0 4px 4px 0', margin: '1.5rem 0', border: '1px solid ' + color + '33', borderLeftColor: color }}>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color, letterSpacing: '0.2em', marginBottom: '6px' }}>{label}</div>
      <div style={{ color: '#8a9a8a', fontSize: '0.85rem', lineHeight: 1.7 }}>{children}</div>
    </div>
  )
}
const Table = ({ headers, rows }: { headers: string[]; rows: string[][] }) => (
  <div style={{ overflowX: 'auto', margin: '1rem 0 1.5rem' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid #1a2e1e' }}>
          {headers.map((h, i) => <th key={i} style={{ textAlign: 'left', padding: '8px 12px', color: '#0099bb', fontWeight: 600, letterSpacing: '0.1em', fontSize: '0.7rem' }}>{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} style={{ borderBottom: '1px solid #0e1a10', background: i % 2 === 0 ? 'transparent' : 'rgba(0,212,255,0.015)' }}>
            {row.map((cell, j) => <td key={j} style={{ padding: '8px 12px', color: '#8a9a8a', verticalAlign: 'top' }}>{cell}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

export default function OSINTModule() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#5a7a5a' }}>
        <Link href="/" style={{ color: '#5a7a5a', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>›</span>
        <span style={{ color: '#00d4ff' }}>MOD-02 // OSINT & SURVEILLANCE</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <span style={{ padding: '3px 10px', background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.3)', borderRadius: '3px', color: '#00d4ff', fontSize: '8px', letterSpacing: '0.15em' }}>CONCEPT</span>
          <Link href="/modules/osint/lab" style={{ textDecoration: 'none', padding: '3px 10px', background: 'transparent', border: '1px solid #1a2e1e', borderRadius: '3px', color: '#5a7a5a', fontSize: '8px', letterSpacing: '0.15em' }}>LAB →</Link>
        </div>
      </div>

      <div style={{ marginBottom: '2.5rem' }}>
        <Tag>MODULE 02 · CONCEPT PAGE</Tag>
        <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '2rem', fontWeight: 700, color: '#00d4ff', margin: '0.5rem 0', lineHeight: 1.1, textShadow: '0 0 20px rgba(0,212,255,0.4)' }}>OSINT & SURVEILLANCE</h1>
        <p style={{ color: '#5a7a5a', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', lineHeight: 1.6 }}>Passive recon · Footprinting · Shodan · Maltego · SOCMINT · Metadata · Digital footprint mapping</p>
      </div>

      <div style={{ background: '#0e1410', border: '1px solid #1a2e1e', borderRadius: '6px', padding: '1.25rem', marginBottom: '2.5rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5a7a5a', letterSpacing: '0.2em', marginBottom: '0.75rem' }}>TABLE OF CONTENTS</div>
        {['01 — OSINT Fundamentals & Intelligence Cycle', '02 — Passive vs Active Reconnaissance', '03 — Domain & IP Footprinting', '04 — Shodan: The Internet of Everything', '05 — Google Dorking', '06 — Social Media Intelligence (SOCMINT)', '07 — Email & Username Enumeration', '08 — Metadata Extraction & Analysis', '09 — Maltego: Relationship Mapping', '10 — theHarvester, Recon-ng & SpiderFoot', '11 — People Search & Breach Data', '12 — Investigator Opsec'].map((item, i) => (
          <div key={i} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#5a7a5a', padding: '3px 0', display: 'flex', gap: '8px' }}>
            <span style={{ color: '#003a4a' }}>›</span><span>{item}</span>
          </div>
        ))}
      </div>

      <H2>01 — OSINT Fundamentals & Intelligence Cycle</H2>
      <Alert type="beginner">
        In plain English: OSINT means gathering information about a target using only publicly available sources — things anyone with internet access can find. No hacking, no special access required. A Google search is OSINT. Looking up a company on LinkedIn is OSINT. Checking who owns a domain on WHOIS is OSINT. The skill is knowing where to look, what to look for, and how to connect the dots across different sources.
      </Alert>
      <P>Open Source Intelligence (OSINT) is the collection and analysis of information from publicly available sources. The term "open source" refers to the data being openly accessible — not to open-source software. It encompasses anything legally obtainable without hacking: websites, social media, public records, metadata, satellite imagery, and more.</P>
      <P>OSINT is the foundation of nearly every intelligence operation — criminal, corporate, journalistic, and state-level. Before any technical attack, a threat actor spends significant time on OSINT. Understanding this phase is critical for both offensive security and defense.</P>

      <Pre label="// THE OSINT INTELLIGENCE CYCLE">{`PLANNING
  Define: What do you need to know? Who is the target?
  Scope:  Organisation, individual, infrastructure, or all?
         ↓
COLLECTION
  Passive: No direct contact with target systems
  Active:  Direct interaction (scanning, crawling)
  Sources: Web, social media, WHOIS, DNS, leaked DBs
         ↓
PROCESSING
  Filter noise, remove duplicates, correlate data
  Connect: emails → usernames → social profiles → IPs
         ↓
ANALYSIS
  Pattern recognition, timeline construction, network mapping
         ↓
DISSEMINATION
  Structured report + visualisations → client/team`}</Pre>

      <Table headers={['TARGET TYPE', 'DATA TO COLLECT', 'PRIMARY SOURCES']} rows={[
        ['Organisation', 'Domains, IPs, employees, tech stack, office locations', 'WHOIS, LinkedIn, Shodan, job postings'],
        ['Individual', 'Email, phone, username, social profiles, location history', 'Social media, data brokers, leaked DBs'],
        ['Infrastructure', 'Open ports, services, SSL certs, cloud assets', 'Shodan, Censys, crt.sh'],
        ['Domain/IP', 'Registrant, DNS history, subdomains, hosting', 'WHOIS, PassiveDNS, SecurityTrails'],
      ]} />

      <H2>02 — Passive vs Active Reconnaissance</H2>
      <Alert type="beginner">
        The key distinction: passive recon means you never send a packet to the target — you are only reading what others have already published. Like reading a company&apos;s Wikipedia page. Active recon means directly probing the target — their server sees your traffic. Like knocking on every door in a building to see which ones open. Passive is always legal; active requires written permission from the target.
      </Alert>
      <Table headers={['TYPE', 'DEFINITION', 'EXAMPLE', 'DETECTABILITY', 'LEGAL RISK']} rows={[
        ['Passive', 'No direct contact with target systems', 'Reading public WHOIS records', 'Zero', 'None'],
        ['Semi-passive', 'Normal-looking traffic to target', 'Visiting their website once', 'Minimal', 'None'],
        ['Active', 'Direct probing of target systems', 'Port scanning their servers', 'High — appears in logs', 'Requires written authorisation'],
      ]} />

      <Alert type="warn">Port scanning, vulnerability scanning, and directly probing systems without written authorisation is illegal in most jurisdictions regardless of intent. Passive OSINT — reading publicly available data — carries no legal risk. Know exactly which category your action falls into.</Alert>

      <H2>03 — Domain & IP Footprinting</H2>
      <P>Domain footprinting maps the full technical surface of a target — their domains, subdomains, IP ranges, DNS records, and hosting infrastructure. This is always the first phase of any assessment.</P>

      <H3>WHOIS Enumeration</H3>
      <Pre label="// WHOIS">{`whois example.com
whois 93.184.216.34

# Key fields:
# Registrant Email → often reveals real identity
# Name Servers     → reveals hosting provider / CDN
# Creation Date    → domain age
# Expiry Date      → watch for upcoming expiry

# WHOIS history (records before privacy guards):
# https://whoishistory.com
# https://domaintools.com

# RDAP (modern WHOIS):
curl https://rdap.org/domain/example.com | python3 -m json.tool`}</Pre>

      <H3>DNS Enumeration</H3>
      <Pre label="// DNS RECORDS">{`dig example.com ANY          # All records
dig example.com A            # IPv4
dig example.com MX           # Mail servers (reveals email provider)
dig example.com TXT          # SPF, DKIM, domain verification tokens
dig example.com NS           # Name servers
dig -x 93.184.216.34         # Reverse DNS

# Zone transfer attempt (often blocked, worth trying):
dig axfr example.com @ns1.example.com
# If successful: reveals ALL subdomains and internal IPs

# Visual DNS map: https://dnsdumpster.com`}</Pre>

      <H3>Subdomain Enumeration</H3>
      <Pre label="// SUBDOMAIN DISCOVERY">{`sudo apt install -y amass subfinder

# Amass — most comprehensive
amass enum -d example.com -passive

# Subfinder — fast, passive
subfinder -d example.com

# Certificate Transparency logs — every SSL cert is publicly logged
curl "https://crt.sh/?q=%25.example.com&output=json" | \
  python3 -c "import json,sys; [print(r['name_value']) for r in json.load(sys.stdin)]" | sort -u

# Online: https://crt.sh  |  https://securitytrails.com`}</Pre>

      <H2>04 — Shodan: The Internet of Everything</H2>
      <Alert type="beginner">
        Think of Shodan as Google, but instead of indexing web pages, it indexes every internet-connected device — servers, webcams, databases, routers, industrial equipment. When Shodan &quot;crawls&quot; the internet, it connects to every IP address and records what responds on each port. The result: a searchable database of what software is running, what version, and whether it is misconfigured. Security researchers use this to find exposed services before attackers do.
      </Alert>
      <P>Shodan indexes the banners and responses of services running on open ports across the entire internet — servers, databases, webcams, industrial control systems, anything with an IP. For security researchers it is the single most powerful passive recon tool available.</P>

      <Table headers={['OPERATOR', 'FUNCTION', 'EXAMPLE']} rows={[
        ['hostname:', 'Search within a hostname', 'hostname:example.com'],
        ['org:', 'Filter by organisation', 'org:"Safaricom"'],
        ['net:', 'Search IP range', 'net:93.184.216.0/24'],
        ['port:', 'Specific port', 'port:27017'],
        ['product:', 'Software name', 'product:"Apache httpd"'],
        ['version:', 'Software version', 'version:"2.4.49"'],
        ['country:', 'Country code', 'country:KE'],
        ['http.title:', 'HTML page title', 'http.title:"Admin Login"'],
        ['ssl.cert.subject.cn:', 'SSL cert name', 'ssl.cert.subject.cn:"*.example.com"'],
      ]} />

      <Pre label="// HIGH-VALUE SHODAN SEARCHES">{`# Exposed MongoDB (no auth)
port:27017 product:MongoDB -authentication

# Exposed Elasticsearch
port:9200 product:Elasticsearch all:search

# Open directory listings
http.title:"Index of /"

# Default admin panels
http.title:"Admin Panel" http.status:200

# Find all assets for a target org:
org:"Example Corp" port:22
org:"Example Corp" port:3389

# All subdomains via SSL certs:
ssl.cert.subject.cn:"*.example.com"

# CLI (pip install shodan):
shodan search 'org:"Example Corp" port:22'
shodan host 93.184.216.34`}</Pre>

      <H2>05 — Google Dorking</H2>
      <Table headers={['OPERATOR', 'FUNCTION', 'EXAMPLE']} rows={[
        ['site:', 'Restrict to domain', 'site:example.com'],
        ['intitle:', 'Page title contains', 'intitle:"admin login"'],
        ['inurl:', 'URL contains', 'inurl:"/admin"'],
        ['filetype:', 'File type', 'filetype:pdf'],
        ['ext:', 'File extension', 'ext:sql'],
        ['"..."', 'Exact phrase', '"internal use only"'],
        ['-', 'Exclude term', 'site:example.com -www'],
      ]} />

      <Pre label="// ESSENTIAL DORK PATTERNS">{`# Exposed config / env files
site:example.com ext:env
site:example.com ext:config
site:example.com inurl:".git"

# Credentials in files
site:example.com filetype:log intext:password
site:example.com ext:sql intext:"INSERT INTO"

# Open directories
site:example.com intitle:"Index of /"

# Sensitive documents
site:example.com filetype:pdf "confidential"
site:example.com filetype:xlsx "salary"

# Login portals
site:example.com inurl:login
site:example.com intitle:"Sign In" inurl:admin

# Full database: https://www.exploit-db.com/google-hacking-database`}</Pre>

      <H2>06 — Social Media Intelligence (SOCMINT)</H2>
      <P>Social media is the richest OSINT source for individuals — and increasingly for organisations. People voluntarily publish location data, workplace info, relationships, daily routines, and operational security failures.</P>

      <H3>Twitter / X Intelligence</H3>
      <Pre label="// TWITTER OSINT">{`# Advanced search operators:
from:username keyword         # tweets from user with keyword
geocode:-1.286,36.817,5km    # tweets from GPS coords + radius (Nairobi)
since:2024-01-01 until:2024-12-31

# twint — scrape without API key:
pip install twint
twint -u username --tweets
twint -u username --following
twint -u username -s "keyword"`}</Pre>

      <H3>LinkedIn — Corporate Intelligence</H3>
      <Pre label="// LINKEDIN OSINT">{`# LinkedIn reveals:
# - Employee names, job titles, departments
# - Tech stack (from job postings)
# - Org chart structure
# - Recent hires/departures
# - Office locations

# Google dorks for LinkedIn:
site:linkedin.com/in "example corp" "software engineer"
site:linkedin.com/in "example corp" "security"

# Job postings reveal tech stack:
site:linkedin.com/jobs "example corp" "engineer"
# Look for: AWS, Azure, Kubernetes, database names`}</Pre>

      <H2>07 — Email & Username Enumeration</H2>
      <Pre label="// EMAIL FORMAT + USERNAME HUNT">{`# Find email format for a domain:
# https://hunter.io/domain-search

# Hunter.io API:
curl "https://api.hunter.io/v2/domain-search?domain=example.com&api_key=KEY"

# Sherlock — username across 300+ platforms:
pip install sherlock-project
sherlock username
sherlock username --output results.txt

# Maigret — more comprehensive:
pip install maigret
maigret username --report-dir ./reports`}</Pre>

      <H2>08 — Metadata Extraction & Analysis</H2>
      <Alert type="beginner">
        Every file you create with software contains invisible background data called metadata. A Word document stores the author&apos;s username, their company name, the file path on their computer, and how long they edited it. A photo taken on a smartphone stores the exact GPS coordinates of where it was taken. This data travels with the file when you share it — and most people have no idea it is there. For investigators, this can reveal internal usernames, office locations, and server paths from a single publicly downloaded PDF.
      </Alert>
      <P>Every digital file contains metadata — author, creation time, GPS coordinates, software version, editing history. This data is often overlooked and can be devastating for opsec.</P>

      <Pre label="// EXIFTOOL — EXTRACT METADATA">{`sudo apt install libimage-exiftool-perl

# Extract all metadata:
exiftool document.pdf
exiftool image.jpg
exiftool -r ./folder/    # recursive

# Key fields:
# Author              → real name of creator
# GPS Latitude/Long   → exact photo location
# Last Modified By    → Windows username
# Template            → internal server path
# Company             → org name

# Bulk extraction from a domain:
# 1. Google: site:example.com filetype:pdf
# 2. wget -r -A pdf,docx -l 2 https://example.com/
# 3. exiftool -csv *.pdf > metadata.csv
# 4. grep "Author" metadata.csv | sort | uniq -c | sort -rn`}</Pre>

      <H2>09 — Maltego: Relationship Mapping</H2>
      <P>Maltego transforms raw OSINT data into visual relationship graphs — connecting domains, IPs, emails, social profiles, and organisations to reveal hidden connections.</P>

      <Table headers={['CONCEPT', 'DESCRIPTION']} rows={[
        ['Entity', 'A data point: domain, IP, email, person, org'],
        ['Transform', 'A query: domain → IP, email → social profile'],
        ['Graph', 'Visual map of all entities and relationships'],
        ['Machine', 'Automated sequence of transforms'],
        ['Hub node', 'Entity with many connections — key pivot point'],
      ]} />

      <Pre label="// MALTEGO WORKFLOW">{`# Workflow for domain investigation:
Domain → DNS Name         → subdomains
Domain → IP Address       → server IPs
Domain → Email Address    → harvested emails
Email  → Social Profile   → associated social accounts
IP     → Organisation     → hosting company

# Result: full connected surface of target
# Hub nodes (many connections) = highest value targets

# Maltego CE = free (12 results per transform)
# Key transforms: Shodan, HaveIBeenPwned, FullContact`}</Pre>

      <H2>10 — theHarvester, Recon-ng & SpiderFoot</H2>
      <Pre label="// THEHARVESTER">{`sudo apt install theharvester

theHarvester -d example.com -b all
theHarvester -d example.com -b google
theHarvester -d example.com -b linkedin
theHarvester -d example.com -b shodan
theHarvester -d example.com -b all -f report`}</Pre>

      <Pre label="// RECON-NG">{`sudo apt install recon-ng && recon-ng

[recon-ng] > marketplace install all
[recon-ng] > workspaces create target_co
[recon-ng] > db insert domains
[recon-ng] > modules load recon/domains-hosts/brute_hosts
[recon-ng] > options set SOURCE example.com
[recon-ng] > run
[recon-ng] > show hosts
[recon-ng] > show contacts`}</Pre>

      <Pre label="// SPIDERFOOT — FULL AUTOMATION">{`pip install spiderfoot

# Web UI:
python3 sf.py -l 127.0.0.1:5001
# → Open http://127.0.0.1:5001

# CLI:
python3 sf.py -s example.com -t INTERNET_NAME -m all -o json > results.json
# Runs 200+ modules: DNS, WHOIS, Shodan, HaveIBeenPwned, LinkedIn, PasteBin...`}</Pre>

      <H2>11 — People Search & Breach Data</H2>
      <Table headers={['SOURCE', 'DATA TYPE', 'ACCESS']} rows={[
        ['HaveIBeenPwned (haveibeenpwned.com)', 'Email/password breach data', 'Free API'],
        ['IntelX (intelx.io)', 'Leaked data, dark web, public sources', 'Freemium'],
        ['Dehashed (dehashed.com)', 'Breach DB — email, username, password hashes', 'Paid'],
        ['Pipl (pipl.com)', 'Deep web people search', 'Paid API'],
        ['Hunter.io', 'Email format + verification', 'Freemium'],
        ['Pastebin', 'Leaked data dumps', 'Free — Google dork it'],
      ]} />

      <Pre label="// BREACH DATA QUERIES">{`# HaveIBeenPwned API:
curl https://haveibeenpwned.com/api/v3/breachedaccount/email@example.com \
  -H "hibp-api-key: YOUR_KEY"

# Search Pastebin via Google:
# site:pastebin.com "target@email.com"
# site:pastebin.com "example.com" password`}</Pre>

      <H2>12 — Investigator Opsec</H2>
      <Table headers={['RISK', 'SOURCE', 'MITIGATION']} rows={[
        ['LinkedIn profile view', 'Target sees you viewed their profile', 'Browse in private mode, set profile to anonymous'],
        ['Google search history', 'Google logs searches tied to account/IP', 'Use DuckDuckGo, or search via Tor'],
        ['Direct website visit', 'Server logs your IP', 'Use VPN or Tor for target website visits'],
        ['Email tracking pixels', 'Opening email pings back your IP', 'Disable image loading in email client'],
        ['Social media', 'Target tracks profile visitors', 'Create dedicated research sock puppet accounts'],
      ]} />

      <Pre label="// INVESTIGATOR OPSEC STACK">{`# Layer 1: Separate browser profile
# Firefox Multi-Account Containers — one per target

# Layer 2: VPN for semi-passive research
# Paid, no-logs VPN only — never free VPNs

# Layer 3: Tor for target website visits
torsocks curl https://target.com

# Layer 4: Sock puppet accounts
# Separate email, phone, created from VPN/Tor
# Age accounts before use — looks more legitimate

# Layer 5: Sandboxed VM
# Dedicated VM per investigation, revert snapshot after

# Layer 6: Strip metadata before sharing
exiftool -all= screenshot.png`}</Pre>

      <Alert type="tip">Create a dedicated browser profile, VPN connection, and research accounts before beginning any serious investigation. Strict separation between research identity and personal identity protects both the investigation and you.</Alert>

      <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid #1a2e1e', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/modules/tor" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5a7a5a' }}>← MOD-01: TOR</Link>
        <Link href="/modules/osint/lab" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#00d4ff', padding: '8px 20px', border: '1px solid rgba(0,212,255,0.4)', borderRadius: '4px', background: 'rgba(0,212,255,0.06)' }}>
          PROCEED TO LAB → MOD-02-LAB
        </Link>
      </div>
    </div>
  )
}
