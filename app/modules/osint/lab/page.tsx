'use client'
import React from 'react'
import Link from 'next/link'

const accent = '#00d4ff'
const accentDim = 'rgba(0,212,255,0.1)'
const accentBorder = 'rgba(0,212,255,0.3)'

const H2 = ({ num, children }: { num: string; children: React.ReactNode }) => (
  <h2 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1rem', fontWeight: 600, color: accent, marginTop: '3rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
    <span style={{ background: accentDim, border: '1px solid ' + accentBorder, padding: '2px 8px', borderRadius: '3px', fontSize: '0.65rem', letterSpacing: '0.15em' }}>LAB-{num}</span>
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
    {label && <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#2a5a6a', letterSpacing: '0.15em', marginBottom: '4px', paddingLeft: '4px' }}>{label}</div>}
    <pre style={{ background: '#050805', border: '1px solid #1a2e1e', borderRadius: '4px', padding: '1.25rem', overflow: 'auto', color: accent, fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', lineHeight: 1.7, whiteSpace: 'pre' as const }}>{children}</pre>
  </div>
)

const Alert = ({ type, children }: { type: 'info' | 'warn' | 'objective' | 'note'; children: React.ReactNode }) => {
  const configs: Record<string, [string, string, string]> = {
    info: ['#00d4ff', 'rgba(0,212,255,0.05)', 'INFO'],
    warn: ['#ff4136', 'rgba(255,65,54,0.05)', 'IMPORTANT'],
    objective: [accent, accentDim, 'OBJECTIVE'],
    note: ['#ffb347', 'rgba(255,179,71,0.05)', 'BEGINNER NOTE'],
  }
  const [color, bg, label] = configs[type]
  return (
    <div style={{ background: bg, borderLeft: '3px solid ' + color, padding: '1rem 1.25rem', borderRadius: '0 4px 4px 0', margin: '1.25rem 0', border: '1px solid ' + color + '33', borderLeftColor: color }}>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color, letterSpacing: '0.2em', marginBottom: '6px' }}>{label}</div>
      <div style={{ color: '#8a9a8a', fontSize: '0.85rem', lineHeight: 1.7 }}>{children}</div>
    </div>
  )
}

const CheckItem = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '6px 0', borderBottom: '1px solid #0e1a10' }}>
    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#1a4a1a', marginTop: '2px', flexShrink: 0 }}>[ ]</span>
    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5a7a5a', lineHeight: 1.6 }}>{children}</span>
  </div>
)

export default function OSINTLab() {
  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#5a7a5a' }}>
        <Link href="/" style={{ color: '#5a7a5a', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>›</span>
        <Link href="/modules/osint" style={{ color: '#5a7a5a', textDecoration: 'none' }}>MOD-02 // OSINT</Link>
        <span>›</span>
        <span style={{ color: accent }}>LAB</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <Link href="/modules/osint" style={{ textDecoration: 'none', padding: '3px 10px', background: 'transparent', border: '1px solid #1a2e1e', borderRadius: '3px', color: '#5a7a5a', fontSize: '8px', letterSpacing: '0.15em' }}>← CONCEPT</Link>
          <span style={{ padding: '3px 10px', background: accentDim, border: '1px solid ' + accentBorder, borderRadius: '3px', color: accent, fontSize: '8px', letterSpacing: '0.15em' }}>LAB</span>
        </div>
      </div>

      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#2a5a6a', letterSpacing: '0.25em', marginBottom: '0.5rem' }}>MODULE 02 · LAB ENVIRONMENT</div>
        <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.8rem', fontWeight: 700, color: accent, margin: '0.5rem 0', lineHeight: 1.1, textShadow: '0 0 20px rgba(0,212,255,0.3)' }}>
          OSINT & SURVEILLANCE — LAB
        </h1>
        <p style={{ color: '#5a7a5a', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', lineHeight: 1.6 }}>
          6 exercises: domain footprinting · Shodan recon · Google dorking · social media intel · metadata forensics · full target profile
        </p>
      </div>

      {/* Lab Environment Setup */}
      <div style={{ background: '#0a1318', border: '1px solid #1a2e1e', borderRadius: '6px', padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#2a5a6a', letterSpacing: '0.2em', marginBottom: '1rem' }}>LAB ENVIRONMENT SETUP</div>
        <P>These labs use entirely passive techniques — you never send packets directly to the target. All data comes from public sources: DNS, search engines, certificate logs, and Shodan. A standard Linux terminal with internet access is all you need.</P>
        <div className="grid-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ background: '#050805', border: '1px solid #1a2e1e', borderRadius: '4px', padding: '1rem' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: accent, letterSpacing: '0.15em', marginBottom: '8px' }}>REQUIRED TOOLS</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#5a7a5a', lineHeight: 1.8 }}>
              whois · dnsutils (dig)<br />
              curl · python3 · exiftool<br />
              subfinder · amass<br />
              sherlock · theHarvester
            </div>
          </div>
          <div style={{ background: '#050805', border: '1px solid #1a2e1e', borderRadius: '4px', padding: '1rem' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: accent, letterSpacing: '0.15em', marginBottom: '8px' }}>FREE ACCOUNTS NEEDED</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#5a7a5a', lineHeight: 1.8 }}>
              Shodan: shodan.io<br />
              Hunter.io: hunter.io<br />
              HaveIBeenPwned: haveibeenpwned.com<br />
              (all free tier sufficient)
            </div>
          </div>
        </div>
        <div style={{ marginTop: '1rem' }}>
          <CheckItem>Linux environment with internet access and terminal</CheckItem>
          <CheckItem>Python 3 and pip installed</CheckItem>
          <CheckItem>Read MOD-02 Concept page — understand passive vs active recon</CheckItem>
          <CheckItem>Only use active recon techniques on systems you own or have written permission to test</CheckItem>
          <CheckItem>For practice: use your own domain, or scanme.nmap.org (explicitly permitted)</CheckItem>
        </div>
      </div>

      <Alert type="warn">
        OSINT uses publicly available data. However, active scanning (sending packets to a target) crosses into legal territory without permission. In this lab, Labs 01-05 are fully passive. Lab 06 combines techniques — only run the active portions against authorised targets.
      </Alert>

      {/* LAB 01 */}
      <H2 num="01">Domain Footprinting — Full Passive Recon</H2>
      <Alert type="objective">
        Build a complete picture of a target domain using only public data sources: WHOIS registration, DNS records, subdomains via certificate transparency, and IP range ownership.
      </Alert>
      <Alert type="note">
        &quot;Footprinting&quot; means gathering information without touching the target. You are asking public databases, not the target server. A WHOIS lookup goes to a registrar database; a DNS query goes to public nameservers — the target never knows you looked.
      </Alert>

      <H3>Step 1: Install OSINT Tools</H3>
      <Pre label="// INSTALL RECON TOOLKIT">{`sudo apt update && sudo apt install -y whois dnsutils curl wget exiftool python3-pip

# Python-based tools
pip3 install subfinder theHarvester shodan sherlock-project

# Verify installations
whois --version
dig -v
subfinder -version 2>/dev/null || echo "subfinder ready"
exiftool -ver`}</Pre>

      <H3>Step 2: WHOIS and DNS Records</H3>
      <P>WHOIS reveals who registered a domain, when it expires, and which nameservers it uses. DNS records expose the full infrastructure: mail servers, web IPs, SPF policies, and verification tokens.</P>
      <Pre label="// DOMAIN RECON — use scanme.nmap.org as practice target">{`TARGET="scanme.nmap.org"

# WHOIS registration info
echo "=== WHOIS ===" && whois $TARGET | grep -E "Registrant|Admin|Tech|Name Server|Creation|Expiry"

# All DNS records at once
echo "=== DNS ALL ===" && dig $TARGET ANY +short

# Specific record types:
echo "=== A RECORDS ===" && dig $TARGET A +short
echo "=== MX ===" && dig $TARGET MX +short
echo "=== TXT ===" && dig $TARGET TXT +short
echo "=== NS ===" && dig $TARGET NS +short
echo "=== SOA ===" && dig $TARGET SOA +short

# Reverse DNS on the IP (PTR record)
IP=$(dig +short $TARGET A | head -1)
echo "=== PTR for $IP ===" && dig -x $IP +short`}</Pre>

      <H3>Step 3: Subdomain Enumeration via Certificate Transparency</H3>
      <P>When an HTTPS certificate is issued for any subdomain, it is logged publicly in Certificate Transparency (CT) logs. These logs are searchable — giving you a free, passive list of subdomains without scanning anything.</P>
      <Pre label="// SUBDOMAIN DISCOVERY — PASSIVE ONLY">{`TARGET="nmap.org"

# Method 1: crt.sh (Certificate Transparency — no account needed)
curl -s "https://crt.sh/?q=%.$TARGET&output=json" | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    names = set()
    for r in data:
        for name in r['name_value'].split():
            names.add(name.strip())
    for n in sorted(names):
        print(n)
except:
    print('No results or API error')
" | head -40

# Method 2: subfinder (combines 40+ passive sources)
subfinder -d $TARGET -silent 2>/dev/null | head -30

# Combine and deduplicate
subfinder -d $TARGET -silent 2>/dev/null > /tmp/subs1.txt
curl -s "https://crt.sh/?q=%.$TARGET&output=json" | python3 -c "
import json, sys
try:
    [print(r['name_value']) for r in json.load(sys.stdin)]
except: pass
" 2>/dev/null > /tmp/subs2.txt

sort -u /tmp/subs1.txt /tmp/subs2.txt > subdomains.txt
echo "Total unique subdomains found: $(wc -l < subdomains.txt)"
head -20 subdomains.txt`}</Pre>

      <H3>Step 4: IP Range and ASN Mapping</H3>
      <Pre label="// MAP IP OWNERSHIP AND RANGES">{`TARGET="nmap.org"

# Resolve domain to IP
IP=$(dig +short $TARGET A | head -1)
echo "Main IP: $IP"

# WHOIS the IP (find owning org and IP range)
whois $IP | grep -E "NetRange|CIDR|OrgName|Organisation|country|inetnum"

# BGPView API — find all IP prefixes for the organisation
curl -s "https://api.bgpview.io/ip/$IP" | python3 -c "
import json, sys
try:
    d = json.load(sys.stdin).get('data', {})
    print('Country:', d.get('country_code', 'unknown'))
    for p in d.get('prefixes', []):
        print('Prefix:', p.get('prefix'), '-', p.get('name', ''))
except Exception as e:
    print('Error:', e)
"

# Resolve all subdomains to IPs
while read subdomain; do
  ip=$(dig +short $subdomain A 2>/dev/null | head -1)
  if [ -n "$ip" ]; then
    echo "$subdomain -> $ip"
  fi
done < subdomains.txt | head -20`}</Pre>

      {/* LAB 02 */}
      <H2 num="02">Shodan Recon — Mapping Exposed Services</H2>
      <Alert type="objective">
        Use Shodan to find open ports, running services, software versions, and potential misconfigurations on a target. Shodan scans the internet continuously — you are querying its database, not scanning anything yourself.
      </Alert>
      <Alert type="note">
        Shodan is a search engine for internet-connected devices and services. It passively crawls all public IP addresses and indexes what services are running on each port. When you search Shodan, you are querying its database — completely passive, no packets sent to any target.
      </Alert>

      <H3>Step 1: Shodan CLI Setup</H3>
      <Pre label="// CONFIGURE SHODAN CLI">{`# Install Shodan CLI
pip3 install shodan

# Register at https://shodan.io for a free account
# Get your API key from: https://account.shodan.io

# Configure the CLI with your key
shodan init YOUR_API_KEY_HERE

# Test it works
shodan info

# Basic host lookup by IP
shodan host 45.33.32.156
# 45.33.32.156 = scanme.nmap.org (explicitly public test target)`}</Pre>

      <H3>Step 2: Search by Domain and Organisation</H3>
      <Pre label="// SHODAN SEARCH QUERIES">{`# Find all Shodan results for a hostname
shodan search "hostname:scanme.nmap.org" --limit 10

# Search for services in a specific country
shodan search "country:KE port:22" --limit 10
shodan search "country:KE product:nginx" --limit 10

# Get a count before fetching results (saves query credits)
shodan count "country:KE port:27017"

# Find exposed databases
shodan search "port:27017 country:KE" --limit 5    # MongoDB
shodan search "port:9200 country:KE" --limit 5     # Elasticsearch

# Search by certificate domain (finds all assets for a company)
shodan search "ssl.cert.subject.cn:example.com" --limit 20

# Download results as JSON for analysis
shodan download osint_results "country:KE port:22" --limit 50
shodan parse --fields ip_str,port,org,product,version osint_results.json.gz`}</Pre>

      <H3>Step 3: Web-Based Shodan Dorks</H3>
      <Pre label="// SHODAN WEB SEARCH — VISIT SHODAN.IO">{`# Open https://shodan.io and try these searches:

# Exposed admin panels in Kenya:
http.title:"Admin Panel" http.status:200 country:KE

# Open directory listings (files browseable without auth):
http.title:"Index of /" country:KE

# Find all SSL certs for a domain (reveals all subdomains with HTTPS):
ssl.cert.subject.cn:"*.example.com"

# Devices running a specific software version:
product:Apache http.status:200 version:2.4.49

# For each result document:
# IP address, open port, service name, software version,
# hostname, organisation, banner text, last seen date`}</Pre>

      {/* LAB 03 */}
      <H2 num="03">Google Dorking — Finding Exposed Files</H2>
      <Alert type="objective">
        Use Google advanced search operators to discover configuration files, credentials, admin panels, and sensitive data that should not be publicly indexed. All passive — Google has already crawled it.
      </Alert>
      <Alert type="note">
        Google indexes the public web continuously. &quot;Dorking&quot; means using Google&apos;s advanced operators to narrow results. &quot;site:&quot; limits to a domain, &quot;filetype:&quot; limits to file extensions, &quot;intitle:&quot; searches page titles. None of this contacts the target — you are searching Google&apos;s index.
      </Alert>

      <H3>Step 1: Core Dork Operators</H3>
      <Pre label="// GOOGLE DORK OPERATORS">{`# Replace example.com with your authorised target

# site: — limit to a specific domain
site:example.com

# filetype: — find specific file types
site:example.com filetype:pdf
site:example.com filetype:env
site:example.com filetype:sql
site:example.com filetype:config
site:example.com filetype:log
site:example.com filetype:xlsx

# intitle: — match page title
site:example.com intitle:"Index of /"
site:example.com intitle:"Admin"

# inurl: — match URL path
site:example.com inurl:admin
site:example.com inurl:login
site:example.com inurl:.git
site:example.com inurl:backup

# intext: — match page body
site:example.com intext:password
site:example.com intext:"api_key"

# Combine operators:
site:example.com filetype:log intext:password
site:example.com inurl:admin intitle:"Login"`}</Pre>

      <H3>Step 2: Systematic Dorking Workflow</H3>
      <Pre label="// STRUCTURED DORK CHECKLIST">{`# Run these against an authorised target or bug bounty scope:

# 1. Configuration and credentials
site:TARGET ext:env
site:TARGET ext:config
site:TARGET "DB_PASSWORD"
site:TARGET "SECRET_KEY"
site:TARGET "api_key"

# 2. Source code exposure
site:TARGET inurl:".git"
site:TARGET filetype:php
site:TARGET "<?php"

# 3. Backup files
site:TARGET inurl:backup
site:TARGET ext:bak
site:TARGET ext:old
site:TARGET ext:swp

# 4. Sensitive documents
site:TARGET filetype:pdf "confidential"
site:TARGET filetype:xlsx "salary"
site:TARGET filetype:docx "internal"

# 5. Infrastructure exposure
site:TARGET inurl:phpinfo.php
site:TARGET inurl:server-status
site:TARGET intitle:"phpMyAdmin"`}</Pre>

      <H3>Step 3: Google Hacking Database</H3>
      <Pre label="// EXPLOIT-DB GHDB — 4000+ DORK PATTERNS">{`# Google Hacking Database: https://www.exploit-db.com/google-hacking-database

# Key categories:
# - Files Containing Passwords       (highest impact)
# - Sensitive Directories            (backup folders, admin areas)
# - Web Server Detection             (fingerprint the stack)
# - Vulnerable Files                 (known vulnerable file paths)
# - Error Messages                   (stack traces revealing internals)
# - Network or Vulnerability Data    (config files, diagrams)
# - Pages Containing Login Portals   (attack surface)

# Exercise:
# 1. Visit the GHDB
# 2. Pick 3 dorks from "Files Containing Passwords"
# 3. Run them against your authorised target
# 4. Document: what was found, risk level, how to fix it`}</Pre>

      {/* LAB 04 */}
      <H2 num="04">Social Media Intelligence — Digital Footprint Mapping</H2>
      <Alert type="objective">
        Map the public digital footprint of a target using SOCMINT tools. Find linked accounts, email addresses, employee data, and public posts that reveal internal information.
      </Alert>
      <Alert type="note">
        SOCMINT (social media intelligence) uses only publicly available posts and profiles. You are not hacking accounts — you are reading what people and companies chose to make public. This is the same data a recruiter, journalist, or attacker would access.
      </Alert>

      <H3>Step 1: Username Hunting with Sherlock</H3>
      <Pre label="// SHERLOCK — CROSS-PLATFORM USERNAME SEARCH">{`# Sherlock searches 300+ platforms for a username
pip3 install sherlock-project

# Basic search
sherlock target_username

# With timeout (avoids slow sites hanging the scan)
sherlock target_username --timeout 10

# Save results to file
sherlock target_username --output username_hunt.txt
cat username_hunt.txt

# Multiple usernames at once
sherlock username1 username2 username3

# What to look for:
# - Platforms where the username exists (consistent = same person)
# - Profile URLs to investigate further
# - Profile photos (use reverse image search to confirm identity)
# - Bio text that reveals location, employer, interests`}</Pre>

      <H3>Step 2: Email to Profile Mapping</H3>
      <Pre label="// FIND SOCIAL PROFILES FROM AN EMAIL ADDRESS">{`# Holehe — check if an email is registered on 120+ platforms
pip3 install holehe
holehe target@example.com
# Lists platforms where this email is registered

# Hunter.io — find email addresses for a domain (free tier: 25/month)
# Visit: https://hunter.io/domain-search
# Enter a company domain
# Returns: all public email addresses found for that domain

# theHarvester — automated email and name harvesting
theHarvester -d example.com -b google,bing -l 100

# LinkedIn OSINT (manual):
# Search: site:linkedin.com "example company" "current"
# Lists employees who mentioned the company in their profile`}</Pre>

      <H3>Step 3: Mapping Connections and Relationships</H3>
      <Pre label="// BUILD AN ORG CHART FROM PUBLIC DATA">{`# From theHarvester results + LinkedIn + Twitter, build:
# - Employee names and roles
# - Email format (firstname.lastname@company.com pattern)
# - Technology stack (job listings reveal tech used)
# - Office locations (event check-ins, tagged photos)

# Job listings are gold for OSINT:
# site:linkedin.com jobs "example company" developer
# Reveals: internal tools, frameworks, cloud providers, team structure

# Twitter/X advanced search:
# from:username                       — all their tweets
# to:username                         — replies to them
# from:username since:2024-01-01 until:2024-06-30
# geocode:LAT,LON,RADIUSkm            — location-tagged tweets

# Wayback Machine for deleted content:
# https://web.archive.org/web/*/twitter.com/username`}</Pre>

      {/* LAB 05 */}
      <H2 num="05">Metadata Forensics — Extract Hidden Data from Files</H2>
      <Alert type="objective">
        Download public documents from a target domain and extract hidden metadata: author names, internal usernames, server paths, creation times, GPS coordinates from photos, and software version strings.
      </Alert>
      <Alert type="note">
        Every file created by software embeds invisible metadata — who created it, when, on what computer, with what software version. Office documents often contain the author&apos;s Windows username, company name, and the template file path. Photos taken on phones embed GPS coordinates by default.
      </Alert>

      <H3>Step 1: Find and Download Public Documents</H3>
      <Pre label="// LOCATE DOCUMENTS VIA GOOGLE">{`# Use Google dorks to find public documents on a target domain
# site:example.com filetype:pdf
# site:example.com filetype:docx
# site:example.com filetype:xlsx
# site:example.com filetype:pptx

# Download found documents
mkdir osint_docs && cd osint_docs

wget "https://example.com/annual_report_2024.pdf"
wget "https://example.com/company_presentation.pptx"
# (replace with actual URLs from your Google dork results)

ls -lh`}</Pre>

      <H3>Step 2: Extract Metadata with ExifTool</H3>
      <Pre label="// EXTRACT ALL METADATA">{`# Extract metadata from all files at once
exiftool *.pdf *.docx *.pptx *.xlsx 2>/dev/null

# Focus on the most revealing fields:
exiftool *.pdf | grep -E "Author|Creator|Producer|Company|Last Modified By|Template|Software|GPS|Create Date"

# What each field reveals:
# Creator/Author       — the person's full name
# Last Modified By     — who last edited (may differ from creator)
# Company              — the organisation name as set in Office
# Template             — full internal file path including username:
#                        e.g. C:\Users\jsmith\AppData\Roaming\Microsoft\Templates\
#                        This reveals: Windows username, internal drive structure
# Software             — Office version
# Create Date          — when document was originally created

# Export to CSV for easy analysis
exiftool -csv *.pdf *.docx *.pptx > metadata_report.csv
cat metadata_report.csv`}</Pre>

      <H3>Step 3: GPS Data Extraction from Images</H3>
      <Pre label="// EXTRACT GPS FROM PHOTOS">{`# Download a public image from target social media or website
wget "https://example.com/team_photo.jpg"

# Extract GPS metadata
exiftool team_photo.jpg | grep -E "GPS|Latitude|Longitude|Location|Altitude"

# If GPS found:
# GPS Latitude  : 1 deg 17' 23.40" S
# GPS Longitude : 36 deg 49' 12.60" E

# Convert to decimal degrees for Google Maps:
python3 -c "
lat_d, lat_m, lat_s, lat_ref = 1, 17, 23.40, 'S'
lon_d, lon_m, lon_s, lon_ref = 36, 49, 12.60, 'E'
lat = lat_d + lat_m/60 + lat_s/3600
lon = lon_d + lon_m/60 + lon_s/3600
if lat_ref == 'S': lat = -lat
if lon_ref == 'W': lon = -lon
print('Decimal:', lat, lon)
print('Maps: https://maps.google.com/?q=' + str(lat) + ',' + str(lon))
"`}</Pre>

      {/* LAB 06 */}
      <H2 num="06">Full Target Profile — Structured Intelligence Report</H2>
      <Alert type="objective">
        Combine all five techniques into a single structured OSINT report. This replicates the pre-engagement intelligence phase of a real penetration test.
      </Alert>

      <H3>Automated Collection Script</H3>
      <Pre label="// FULL OSINT PIPELINE — AUTHORISED TARGETS ONLY">{`#!/bin/bash
TARGET_DOMAIN="example.com"
OUTPUT_DIR="osint_report_$(date +%Y%m%d_%H%M)"
mkdir -p "$OUTPUT_DIR"

echo "GHOSTNET OSINT REPORT" > "$OUTPUT_DIR/report.md"
echo "Target: $TARGET_DOMAIN" >> "$OUTPUT_DIR/report.md"
echo "Date: $(date)" >> "$OUTPUT_DIR/report.md"
echo "---" >> "$OUTPUT_DIR/report.md"

# 1. WHOIS
echo "## WHOIS" >> "$OUTPUT_DIR/report.md"
whois "$TARGET_DOMAIN" 2>/dev/null >> "$OUTPUT_DIR/report.md"

# 2. DNS Records
echo "## DNS" >> "$OUTPUT_DIR/report.md"
dig "$TARGET_DOMAIN" ANY +short >> "$OUTPUT_DIR/report.md"
dig "$TARGET_DOMAIN" MX +short >> "$OUTPUT_DIR/report.md"
dig "$TARGET_DOMAIN" TXT +short >> "$OUTPUT_DIR/report.md"

# 3. Subdomains
echo "## Subdomains" >> "$OUTPUT_DIR/report.md"
subfinder -d "$TARGET_DOMAIN" -silent 2>/dev/null >> "$OUTPUT_DIR/report.md"

# 4. IP Ownership
echo "## IP Ranges" >> "$OUTPUT_DIR/report.md"
IP=$(dig +short "$TARGET_DOMAIN" A | head -1)
whois "$IP" 2>/dev/null | grep -E "NetRange|CIDR|OrgName" >> "$OUTPUT_DIR/report.md"

# 5. theHarvester email harvest
echo "## Emails and Names" >> "$OUTPUT_DIR/report.md"
theHarvester -d "$TARGET_DOMAIN" -b google,bing 2>/dev/null >> "$OUTPUT_DIR/report.md"

echo "Report saved to: $OUTPUT_DIR/report.md"
wc -l "$OUTPUT_DIR/report.md"`}</Pre>

      <H3>Professional Report Structure</H3>
      <Pre label="// OSINT REPORT SECTIONS">{`# 1. EXECUTIVE SUMMARY
#    Target overview, key findings, overall risk level
#    Top 3-5 most critical exposures with impact description

# 2. DOMAIN AND DNS INFRASTRUCTURE
#    Registrant details (if not privacy-protected)
#    Hosting provider and IP ranges
#    All discovered subdomains + resolution status
#    MX/SPF/DKIM/DMARC configuration

# 3. EXPOSED SERVICES (from Shodan)
#    Open ports per IP
#    Software versions (map to known CVEs)
#    Misconfigurations found

# 4. HUMAN INTELLIGENCE
#    Identified employees + roles
#    Email address format discovered
#    Technology stack inferred from job listings

# 5. DOCUMENT METADATA
#    Internal usernames discovered
#    Software versions from Office metadata
#    GPS coordinates found (if any)
#    Internal file paths and server names

# 6. RECOMMENDATIONS
#    WHOIS privacy protection
#    Remove sensitive files from public web
#    Strip metadata from published documents
#    Shodan remediation
#    Review social media disclosure policies`}</Pre>

      {/* Check Your Understanding */}
      <div style={{ marginTop: '3rem', background: '#0a1318', border: '1px solid ' + accentBorder, borderRadius: '6px', padding: '1.5rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: accent, letterSpacing: '0.2em', marginBottom: '1rem' }}>CHECK YOUR UNDERSTANDING</div>
        <P>You should be able to answer all of these before moving to the next module.</P>
        {[
          'What is the difference between passive OSINT and active reconnaissance? Give an example of each.',
          'Why are Certificate Transparency logs so useful for subdomain enumeration? Who publishes them?',
          'You found a Word document with Template: C:\\Users\\jsmith\\AppData\\... — what exactly does this reveal?',
          'A Shodan result shows "MongoDB 3.4.0 — no authentication required" on port 27017. What does this mean and what is the risk?',
          'What metadata fields should every organisation strip from documents before publishing them publicly?',
        ].map((q, i) => (
          <div key={i} style={{ display: 'flex', gap: '10px', padding: '8px 0', borderBottom: '1px solid #0a1208', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem' }}>
            <span style={{ color: accent, flexShrink: 0 }}>{String(i + 1).padStart(2, '0')}.</span>
            <span style={{ color: '#5a7a5a' }}>{q}</span>
          </div>
        ))}
      </div>

      {/* Recommended Practice */}
      <div style={{ marginTop: '2rem', background: '#0a1318', border: '1px solid #1a2e1e', borderRadius: '6px', padding: '1.5rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#2a5a6a', letterSpacing: '0.2em', marginBottom: '1rem' }}>RECOMMENDED PRACTICE</div>
        {[
          { platform: 'TryHackMe', name: 'OhSINT', note: 'Classic OSINT challenge — start with a photo and find everything about a target using only public sources' },
          { platform: 'TryHackMe', name: 'Searchlight - OSINT', note: 'Geolocation from images, username hunting, Google dorking — all core OSINT skills in one room' },
          { platform: 'TryHackMe', name: 'Google Dorking', note: 'Dedicated room for learning Google dork operators and the Google Hacking Database' },
          { platform: 'HackTheBox', name: 'Starting Point — Recon Challenges', note: 'OSINT challenges in HTB CTF format — subdomain enumeration, metadata forensics, Shodan queries' },
        ].map((r, i) => (
          <div key={i} style={{ padding: '10px 0', borderBottom: '1px solid #0a1208' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', color: accent, background: accentDim, border: '1px solid ' + accentBorder, padding: '1px 6px', borderRadius: '2px' }}>{r.platform}</span>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#8a9a8a', fontWeight: 600 }}>{r.name}</span>
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.68rem', color: '#2a5a6a', paddingLeft: '4px' }}>{r.note}</div>
          </div>
        ))}
      </div>

      {/* Footer nav */}
      <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #1a2e1e', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/modules/osint" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5a7a5a' }}>← BACK TO CONCEPT</Link>
        <Link href="/" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#3a6a6a' }}>DASHBOARD</Link>
        <Link href="/modules/crypto/lab" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: accent, padding: '8px 20px', border: '1px solid ' + accentBorder, borderRadius: '4px', background: accentDim }}>
          NEXT: MOD-03 CRYPTO LAB →
        </Link>
      </div>
    </div>
  )
}
