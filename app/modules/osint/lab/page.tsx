'use client'
import React from 'react'
import Link from 'next/link'

const H2 = ({ num, children }: { num: string; children: React.ReactNode }) => (
  <h2 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1rem', fontWeight: 600, color: '#00d4ff', marginTop: '3rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
    <span style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)', padding: '2px 8px', borderRadius: '3px', fontSize: '0.65rem', letterSpacing: '0.15em' }}>LAB-{num}</span>
    {children}
  </h2>
)
const H3 = ({ children }: { children: React.ReactNode }) => (
  <h3 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.82rem', fontWeight: 600, color: '#0088aa', marginTop: '1.75rem', marginBottom: '0.6rem' }}>▸ {children}</h3>
)
const P = ({ children }: { children: React.ReactNode }) => (
  <p style={{ color: '#8a9a8a', lineHeight: 1.8, marginBottom: '1rem', fontSize: '0.88rem' }}>{children}</p>
)
const Pre = ({ label, children }: { label?: string; children: string }) => (
  <div style={{ margin: '1rem 0 1.5rem' }}>
    {label && <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5a7a5a', letterSpacing: '0.15em', marginBottom: '4px', paddingLeft: '4px' }}>{label}</div>}
    <pre style={{ background: '#050805', border: '1px solid #1a2e1e', borderRadius: '4px', padding: '1.25rem', overflow: 'auto', color: '#00d4ff', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', lineHeight: 1.7, whiteSpace: 'pre' as const }}>{children}</pre>
  </div>
)
const Alert = ({ type, children }: { type: 'info' | 'warn' | 'objective'; children: React.ReactNode }) => {
  const configs: Record<string, [string, string, string]> = {
    info:      ['#00d4ff', 'rgba(0,212,255,0.05)', 'INFO'],
    warn:      ['#ff4136', 'rgba(255,65,54,0.05)',  'IMPORTANT'],
    objective: ['#00d4ff', 'rgba(0,212,255,0.05)', 'OBJECTIVE'],
  }
  const [color, bg, label] = configs[type]
  return (
    <div style={{ background: bg, borderLeft: `3px solid ${color}`, padding: '1rem 1.25rem', borderRadius: '0 4px 4px 0', margin: '1.25rem 0', border: `1px solid ${color}33`, borderLeftColor: color }}>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color, letterSpacing: '0.2em', marginBottom: '6px' }}>{label}</div>
      <div style={{ color: '#8a9a8a', fontSize: '0.85rem', lineHeight: 1.7 }}>{children}</div>
    </div>
  )
}
const Check = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '6px 0', borderBottom: '1px solid #0e1a10' }}>
    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#1a4a1a', marginTop: '2px', flexShrink: 0 }}>[ ]</span>
    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5a7a5a', lineHeight: 1.6 }}>{children}</span>
  </div>
)

export default function OSINTLab() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#5a7a5a' }}>
        <Link href="/" style={{ color: '#5a7a5a', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>›</span>
        <Link href="/modules/osint" style={{ color: '#5a7a5a', textDecoration: 'none' }}>MOD-02 // OSINT</Link>
        <span>›</span>
        <span style={{ color: '#00d4ff' }}>LAB</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <Link href="/modules/osint" style={{ textDecoration: 'none', padding: '3px 10px', background: 'transparent', border: '1px solid #1a2e1e', borderRadius: '3px', color: '#5a7a5a', fontSize: '8px', letterSpacing: '0.15em' }}>← CONCEPT</Link>
          <span style={{ padding: '3px 10px', background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.3)', borderRadius: '3px', color: '#00d4ff', fontSize: '8px', letterSpacing: '0.15em' }}>LAB</span>
        </div>
      </div>

      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5a7a5a', letterSpacing: '0.25em', marginBottom: '0.5rem' }}>MODULE 02 · LAB ENVIRONMENT</div>
        <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.8rem', fontWeight: 700, color: '#00d4ff', margin: '0.5rem 0', lineHeight: 1.1, textShadow: '0 0 20px rgba(0,212,255,0.3)' }}>OSINT LAB — PRACTICAL EXERCISES</h1>
        <p style={{ color: '#5a7a5a', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', lineHeight: 1.6 }}>6 labs: domain footprinting · Shodan · Google dorking · social intel · metadata forensics · full target profile</p>
      </div>

      <div style={{ background: '#0e1410', border: '1px solid #1a2e1e', borderRadius: '6px', padding: '1.25rem', marginBottom: '2rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5a7a5a', letterSpacing: '0.2em', marginBottom: '0.75rem' }}>PREREQUISITES</div>
        <Check>Linux / WSL terminal access</Check>
        <Check>sudo apt access for installing tools</Check>
        <Check>Read MOD-02 Concept page before starting</Check>
        <Check>Free Shodan account: shodan.io (for search queries)</Check>
        <Check>Free Hunter.io account: hunter.io (for email intel)</Check>
      </div>

      <Alert type="warn">All labs use publicly available data only. Practice on your own domains/infrastructure, or use explicitly designated practice targets like scanme.nmap.org. Never run active scans against systems you do not own or have written permission to test.</Alert>

      {/* LAB 01 */}
      <H2 num="01">Domain Footprinting — Full Recon on a Target Domain</H2>
      <Alert type="objective">Build a complete picture of a domain: registrant, DNS records, subdomains, IP ranges, tech stack. Use only passive methods.</Alert>

      <H3>Step 1: Install Tools</H3>
      <Pre label="// INSTALL RECON TOOLKIT">{`sudo apt update && sudo apt install -y \
  whois dnsutils curl wget amass \
  libimage-exiftool-perl python3-pip

pip install subfinder theHarvester shodan 2>/dev/null || true

# Verify:
whois --version
dig -v
amass --version`}</Pre>

      <H3>Step 2: WHOIS + DNS Baseline</H3>
      <Pre label="// TARGET: use a domain you own or scanme.nmap.org">{`TARGET="scanme.nmap.org"

# WHOIS
echo "=== WHOIS ===" && whois $TARGET

# All DNS records
echo "=== DNS ===" && dig $TARGET ANY +short

# Name servers (reveals hosting provider)
echo "=== NS ===" && dig $TARGET NS +short

# Mail servers (reveals email provider)
echo "=== MX ===" && dig $TARGET MX +short

# TXT records (SPF, DKIM, verification tokens)
echo "=== TXT ===" && dig $TARGET TXT +short

# SOA (admin contact + serial)
echo "=== SOA ===" && dig $TARGET SOA +short`}</Pre>

      <H3>Step 3: Subdomain Enumeration</H3>
      <Pre label="// FIND ALL SUBDOMAINS">{`TARGET="nmap.org"

# Method 1: Certificate Transparency (no tools needed)
curl -s "https://crt.sh/?q=%25.$TARGET&output=json" | \
  python3 -c "
import json, sys
data = json.load(sys.stdin)
names = set()
for r in data:
    for name in r['name_value'].split('\n'):
        names.add(name.strip())
for n in sorted(names):
    print(n)
" 2>/dev/null | head -50

# Method 2: Subfinder
subfinder -d $TARGET -silent 2>/dev/null | head -30

# Method 3: Amass passive
amass enum -d $TARGET -passive -timeout 2 2>/dev/null | head -30

# Combine and deduplicate:
{ subfinder -d $TARGET -silent; \
  curl -s "https://crt.sh/?q=%25.$TARGET&output=json" | \
  python3 -c "import json,sys; [print(r['name_value']) for r in json.load(sys.stdin)]"; \
} | sort -u > subdomains.txt

echo "Found: $(wc -l < subdomains.txt) unique subdomains"
cat subdomains.txt`}</Pre>

      <H3>Step 4: IP Range Mapping</H3>
      <Pre label="// MAP IP RANGES">{`TARGET="nmap.org"

# Resolve main domain to IP
IP=$(dig +short $TARGET A | head -1)
echo "Main IP: $IP"

# WHOIS on IP (find owning organisation + IP range)
whois $IP | grep -E "NetRange|CIDR|OrgName|Organisation|country" 

# BGPView API — find all prefixes for the organisation
curl -s "https://api.bgpview.io/ip/$IP" | \
  python3 -c "
import json, sys
d = json.load(sys.stdin)
data = d.get('data', {})
print('IP:', data.get('ip'))
for prefix in data.get('prefixes', []):
    print('Prefix:', prefix.get('prefix'), '|', prefix.get('name'))
"`}</Pre>

      {/* LAB 02 */}
      <H2 num="02">Shodan Recon — Expose What's Running</H2>
      <Alert type="objective">Use Shodan to map open services, identify software versions, and find potential misconfigurations on a target. All passive — no direct contact with target.</Alert>

      <Pre label="// SHODAN CLI SETUP">{`# Install and configure:
pip install shodan
shodan init YOUR_API_KEY   # get free key at shodan.io

# Basic host lookup:
shodan host 45.33.32.156   # scanme.nmap.org

# What you see:
# Open ports
# Running services + banners
# Software versions
# Last scan time
# Hostnames + org`}</Pre>

      <Pre label="// SHODAN SEARCH PATTERNS — PRACTICE">{`# Search for services in a country:
shodan search "country:KE port:22" --limit 10
shodan search "country:KE product:nginx" --limit 10

# Find exposed databases:
shodan search "port:27017 country:KE" --limit 5   # MongoDB
shodan search "port:9200 country:KE" --limit 5    # Elasticsearch

# Search by organisation:
# (replace with an org you have permission to research)
shodan search 'org:"Safaricom" port:443' --limit 10

# Get count before full search:
shodan count 'port:27017 product:MongoDB'

# Download results as JSON:
shodan download results 'port:27017 -authentication' --limit 100
shodan parse --fields ip_str,port,org results.json.gz`}</Pre>

      <Pre label="// WEB-BASED SHODAN SEARCHES (no CLI needed)">{`# Open https://shodan.io and try these queries:

# 1. Exposed admin panels:
http.title:"Admin Panel" http.status:200 country:KE

# 2. Open directory listings:
http.title:"Index of /" country:KE

# 3. SSL cert enumeration for a domain:
ssl.cert.subject.cn:"*.your-target.com"

# 4. Find all assets for an org:
org:"Your Org Name"

# Document findings:
# For each result: IP, port, service, version, hostname, banner
# This is what a real attack surface map looks like`}</Pre>

      {/* LAB 03 */}
      <H2 num="03">Google Dorking — Find What Shouldn't Be Public</H2>
      <Alert type="objective">Use Google dorks to discover exposed files, credentials, admin panels, and sensitive data on a target domain. All passive — Google has already crawled it.</Alert>

      <Pre label="// SYSTEMATIC DORKING METHODOLOGY">{`# Target: use your own domain, or a CTF/bug bounty target

TARGET="example.com"  # replace with authorised target

# Run these in Google one at a time:

# 1. Find ALL indexed pages
site:$TARGET

# 2. Exposed configuration files
# site:$TARGET ext:env
# site:$TARGET ext:config  
# site:$TARGET ext:cfg
# site:$TARGET inurl:".git"

# 3. Database files
# site:$TARGET ext:sql
# site:$TARGET ext:db
# site:$TARGET ext:sqlite

# 4. Log files (may contain credentials)
# site:$TARGET ext:log
# site:$TARGET filetype:log intext:password

# 5. Open directories
# site:$TARGET intitle:"Index of /"
# site:$TARGET intitle:"Index of" inurl:/backup

# 6. Admin portals
# site:$TARGET inurl:admin
# site:$TARGET inurl:login intitle:"Admin"
# site:$TARGET inurl:wp-admin

# 7. Sensitive documents
# site:$TARGET filetype:pdf "confidential"
# site:$TARGET filetype:xlsx OR filetype:csv "email"

# Document everything found — screenshot + URL + data type`}</Pre>

      <Pre label="// EXPLOIT-DB GHDB — EXPLORE THE FULL DATABASE">{`# Google Hacking Database: https://www.exploit-db.com/google-hacking-database
# 4,000+ categorised dork patterns

# Categories:
# - Files Containing Passwords
# - Sensitive Directories
# - Web Server Detection
# - Vulnerable Files
# - Error Messages (revealing stack info)
# - Network or Vulnerability Data
# - Pages Containing Login Portals

# Exercise: pick 5 dorks from each category
# Run them against a target you have permission to test
# Document what you find`}</Pre>

      {/* LAB 04 */}
      <H2 num="04">Social Media Intelligence — Build a Target Profile</H2>
      <Alert type="objective">Map the digital footprint of a public figure or organisation using SOCMINT tools. Practice using open data only — Twitter, LinkedIn, Instagram public posts.</Alert>

      <H3>Sherlock — Username Hunt</H3>
      <Pre label="// SHERLOCK INSTALLATION & USAGE">{`pip install sherlock-project

# Hunt a username across 300+ platforms:
sherlock TARGET_USERNAME

# With timeout (faster):
sherlock TARGET_USERNAME --timeout 10

# Save results:
sherlock TARGET_USERNAME --output username_results.txt

# Multiple usernames:
sherlock user1 user2 user3

# What to look for in results:
# - Platforms where username is registered
# - Profile URLs to investigate further
# - Consistent username = likely same person
# - Different content across platforms = different personas`}</Pre>

      <H3>Email → Social Profile Mapping</H3>
      <Pre label="// FIND SOCIAL PROFILES FROM EMAIL">{`# Tools for email → profile lookup:

# 1. GHunt (Google account OSINT)
pip install ghunt
ghunt login  # authenticate with a Google account
ghunt email target@gmail.com
# Returns: Google account ID, profile photo, connected services, maps activity

# 2. Holehe — check email registration across platforms
pip install holehe
holehe email@example.com
# Checks 120+ platforms: Twitter, Instagram, GitHub, Spotify...

# 3. Social-Analyzer
pip install social-analyzer
social-analyzer --username "target_username" --websites all`}</Pre>

      <H3>Twitter / X Advanced Search</H3>
      <Pre label="// BUILD A TIMELINE FROM PUBLIC TWEETS">{`# Advanced search URL pattern:
# https://twitter.com/search?q=QUERY&f=live

# Find tweets from a user in a location:
from:username geocode:-1.286389,36.817223,10km

# Find tweets mentioning a company in a date range:
"example corp" since:2024-01-01 until:2024-06-01

# Find deleted tweets (cached):
# https://web.archive.org/web/*/twitter.com/username
# https://cacheview.nl

# twint — scrape without API (may need workarounds):
pip install twint
twint -u username --tweets --limit 100
twint -u username --followers
twint -u username --following
twint -u username -g "-1.286389,36.817223,10km" --since 2024-01-01`}</Pre>

      {/* LAB 05 */}
      <H2 num="05">Metadata Forensics — Extract Hidden Data</H2>
      <Alert type="objective">Download public documents from a target domain and extract metadata to reveal internal usernames, software versions, server paths, and GPS coordinates.</Alert>

      <Pre label="// BULK METADATA EXTRACTION">{`# Step 1: Find documents on a target domain via Google:
# site:example.com filetype:pdf
# site:example.com filetype:docx OR filetype:xlsx

# Step 2: Download all found documents
mkdir target_docs && cd target_docs

wget "https://example.com/annual_report.pdf"
wget "https://example.com/presentation.pptx"
# (replace with real URLs found in Google)

# Step 3: Extract metadata from everything
exiftool *.pdf *.docx *.pptx *.xlsx 2>/dev/null

# Step 4: Focus on key fields
exiftool *.pdf | grep -E "Author|Creator|Producer|Company|Last Modified By|Template|GPS"

# Step 5: Export to CSV for analysis
exiftool -csv *.pdf *.docx > metadata_report.csv
cat metadata_report.csv`}</Pre>

      <Pre label="// IMAGE METADATA — GPS EXTRACTION">{`# Download a public image from target (e.g. from their social media)
# Many older uploads retain GPS data

wget "https://example.com/team_photo.jpg"
exiftool team_photo.jpg | grep -E "GPS|Latitude|Longitude|Location"

# If GPS found:
# GPS Latitude  : 52 deg 30' 26.35" N
# GPS Longitude : 13 deg 24' 20.96" E

# Convert to decimal degrees for Google Maps:
python3 -c "
lat_d, lat_m, lat_s = 52, 30, 26.35
lon_d, lon_m, lon_s = 13, 24, 20.96
lat = lat_d + lat_m/60 + lat_s/3600
lon = lon_d + lon_m/60 + lon_s/3600
print(f'https://maps.google.com/?q={lat},{lon}')
"

# If no GPS in image — check surrounding context:
# Background details, visible landmarks, street signs`}</Pre>

      {/* LAB 06 */}
      <H2 num="06">Full Target Profile — Bringing It All Together</H2>
      <Alert type="objective">Combine all previous techniques into a structured intelligence report on a single target. This simulates a real security assessment pre-engagement OSINT phase.</Alert>

      <Pre label="// OSINT REPORT TEMPLATE">{`#!/bin/bash
# Full OSINT workflow — run against authorised target

TARGET_DOMAIN="example.com"
OUTPUT_DIR="./osint_report_$(date +%Y%m%d)"
mkdir -p $OUTPUT_DIR

echo "=== GHOSTNET OSINT REPORT ===" > $OUTPUT_DIR/report.txt
echo "Target: $TARGET_DOMAIN" >> $OUTPUT_DIR/report.txt
echo "Date: $(date)" >> $OUTPUT_DIR/report.txt
echo "" >> $OUTPUT_DIR/report.txt

# 1. WHOIS
echo "--- WHOIS ---" >> $OUTPUT_DIR/report.txt
whois $TARGET_DOMAIN >> $OUTPUT_DIR/report.txt

# 2. DNS
echo "--- DNS RECORDS ---" >> $OUTPUT_DIR/report.txt
dig $TARGET_DOMAIN ANY +short >> $OUTPUT_DIR/report.txt

# 3. Subdomains via cert transparency
echo "--- SUBDOMAINS ---" >> $OUTPUT_DIR/report.txt
curl -s "https://crt.sh/?q=%25.$TARGET_DOMAIN&output=json" | \
  python3 -c "import json,sys; [print(r['name_value']) for r in json.load(sys.stdin)]" 2>/dev/null | \
  sort -u >> $OUTPUT_DIR/report.txt

# 4. IP resolution
echo "--- IPs ---" >> $OUTPUT_DIR/report.txt
dig +short $TARGET_DOMAIN A >> $OUTPUT_DIR/report.txt

# 5. theHarvester
echo "--- THEHARVESTER ---" >> $OUTPUT_DIR/report.txt
theHarvester -d $TARGET_DOMAIN -b google,bing 2>/dev/null >> $OUTPUT_DIR/report.txt

echo "Report saved: $OUTPUT_DIR/report.txt"
wc -l $OUTPUT_DIR/report.txt`}</Pre>

      <Pre label="// STRUCTURED REPORT SECTIONS">{`# A professional OSINT report covers:

# 1. EXECUTIVE SUMMARY
#    - Target overview
#    - Key findings (top 5 most critical)
#    - Risk level assessment

# 2. TECHNICAL FINDINGS
#    a. Domain & DNS infrastructure
#    b. Exposed services (Shodan)
#    c. Employee/contact information
#    d. Technology stack
#    e. Public document metadata

# 3. SOCIAL MEDIA PRESENCE
#    - Platform profiles found
#    - Key employee profiles
#    - Information disclosure risks

# 4. BREACH DATA
#    - Email addresses found in breaches
#    - Passwords/hashes discovered
#    - Risk to credential stuffing attacks

# 5. RECOMMENDATIONS
#    - Remove exposed files
#    - Implement privacy for WHOIS
#    - Remove sensitive metadata from docs
#    - Configure SPF/DMARC properly
#    - Review Shodan exposure`}</Pre>

      {/* Challenge */}
      <div style={{ marginTop: '3rem', background: '#0e1410', border: '1px solid rgba(0,212,255,0.2)', borderRadius: '6px', padding: '1.5rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#0088aa', letterSpacing: '0.2em', marginBottom: '1rem' }}>LAB CHALLENGE — SELF ASSESSMENT</div>
        {[
          'What is the difference between WHOIS and RDAP? When would you use each?',
          'Why are Certificate Transparency logs so valuable for subdomain enumeration?',
          'What does an MX record reveal about a target beyond just their mail server?',
          'You find a document with Template: C:\\Users\\jsmith\\AppData\\... — what does this tell you?',
          'How would you find all IP ranges owned by a target company with no prior knowledge?',
          'What metadata fields should you strip before publishing documents publicly?',
          'Run theHarvester against your own domain — what does it find about you?',
        ].map((q, i) => (
          <div key={i} style={{ display: 'flex', gap: '10px', padding: '8px 0', borderBottom: '1px solid #0a1208', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem' }}>
            <span style={{ color: '#00d4ff', flexShrink: 0 }}>{String(i + 1).padStart(2, '0')}.</span>
            <span style={{ color: '#5a7a5a' }}>{q}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #1a2e1e', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/modules/osint" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5a7a5a' }}>← BACK TO CONCEPT</Link>
        <Link href="/modules/crypto" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#00d4ff', padding: '8px 20px', border: '1px solid rgba(0,212,255,0.4)', borderRadius: '4px', background: 'rgba(0,212,255,0.06)' }}>
          NEXT MODULE: CRYPTO & BLOCKCHAIN →
        </Link>
      </div>
    </div>
  )
}
