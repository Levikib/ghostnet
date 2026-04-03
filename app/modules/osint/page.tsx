'use client'
import React from 'react'
import Link from 'next/link'
import ModuleCodex, { CodexChapter } from '@/app/components/ModuleCodex'

const accent = '#00d4ff'
const mono = 'JetBrains Mono, monospace'

const H3 = ({ children }: { children: React.ReactNode }) => (
  <h3 style={{ fontFamily: mono, fontSize: '0.85rem', fontWeight: 600, color: '#0099bb', marginTop: '2rem', marginBottom: '0.75rem' }}>&#9658; {children}</h3>
)

const P = ({ children }: { children: React.ReactNode }) => (
  <p style={{ color: '#8a9a8a', lineHeight: 1.8, marginBottom: '1rem', fontSize: '0.9rem' }}>{children}</p>
)

const Pre = ({ label, children }: { label?: string; children: string }) => (
  <div style={{ margin: '1rem 0 1.5rem' }}>
    {label && <div style={{ fontFamily: mono, fontSize: '9px', color: '#1a6a8a', letterSpacing: '0.15em', marginBottom: '4px', paddingLeft: '4px' }}>{label}</div>}
    <pre style={{ background: '#020608', border: '1px solid #0a2030', borderRadius: '4px', padding: '1.25rem', overflow: 'auto', color: '#00d4ff', fontFamily: mono, fontSize: '0.78rem', lineHeight: 1.7, whiteSpace: 'pre' as const }}>{children}</pre>
  </div>
)

const Note = ({ type, children }: { type: 'info' | 'warn' | 'danger' | 'tip' | 'beginner'; children: React.ReactNode }) => {
  const configs: Record<string, [string, string, string]> = {
    info:     ['#00d4ff', 'rgba(0,212,255,0.05)', 'NOTE'],
    warn:     ['#ffb347', 'rgba(255,179,71,0.05)',  'WARNING'],
    danger:   ['#ff4136', 'rgba(255,65,54,0.05)',   'CRITICAL'],
    tip:      ['#00ff41', 'rgba(0,255,65,0.04)',    'PRO TIP'],
    beginner: ['#00d4ff', 'rgba(0,212,255,0.05)',   'BEGINNER NOTE'],
  }
  const [color, bg, lbl] = configs[type]
  return (
    <div style={{ background: bg, borderLeft: '3px solid ' + color, padding: '1rem 1.25rem', borderRadius: '0 4px 4px 0', margin: '1.5rem 0', border: '1px solid ' + color + '33', borderLeftColor: color }}>
      <div style={{ fontFamily: mono, fontSize: '9px', color, letterSpacing: '0.2em', marginBottom: '6px' }}>{lbl}</div>
      <div style={{ color: '#8a9a8a', fontSize: '0.85rem', lineHeight: 1.7 }}>{children}</div>
    </div>
  )
}

const Table = ({ headers, rows }: { headers: string[]; rows: string[][] }) => (
  <div style={{ overflowX: 'auto', margin: '1rem 0 1.5rem' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: mono, fontSize: '0.75rem' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid #0a2030' }}>
          {headers.map((h, i) => <th key={i} style={{ textAlign: 'left', padding: '8px 12px', color: '#0099bb', fontWeight: 600, letterSpacing: '0.1em', fontSize: '0.7rem' }}>{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} style={{ borderBottom: '1px solid #060e14', background: i % 2 === 0 ? 'transparent' : 'rgba(0,212,255,0.015)' }}>
            {row.map((cell, j) => <td key={j} style={{ padding: '8px 12px', color: '#8a9a8a', verticalAlign: 'top' }}>{cell}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

const chapters: CodexChapter[] = [
  {
    id: 'ch01-fundamentals',
    title: 'OSINT Fundamentals & Intelligence Cycle',
    difficulty: 'BEGINNER',
    readTime: '18 min',
    content: (
      <div>
        <Note type="beginner">
          OSINT means gathering information about a target using only publicly available sources. No hacking required. A Google search is OSINT. Looking up a domain on WHOIS is OSINT. Checking someone on LinkedIn is OSINT. The skill is knowing where to look, what to look for, and how to connect information across many sources into a coherent picture.
        </Note>

        <H3>Intelligence Disciplines: OSINT in Context</H3>
        <P>Intelligence collection is categorised by source type. Understanding where OSINT sits within the broader intelligence landscape clarifies both its power and its limits.</P>
        <Table
          headers={['DISCIPLINE', 'FULL NAME', 'SOURCE', 'OSINT ROLE']}
          rows={[
            ['OSINT', 'Open Source Intelligence', 'Publicly available: web, social, records, media', 'Primary discipline covered here'],
            ['HUMINT', 'Human Intelligence', 'Human sources, informants, interviews', 'Social engineering overlaps here'],
            ['SIGINT', 'Signals Intelligence', 'Intercepted communications, RF signals', 'Govt/military domain, some WiFi overlap'],
            ['IMINT', 'Imagery Intelligence', 'Satellite, aerial photography', 'Commercial sat imagery is now OSINT'],
            ['GEOINT', 'Geospatial Intelligence', 'Location data, mapping, terrain analysis', 'Flight/ship tracking, geo-verification'],
            ['TECHINT', 'Technical Intelligence', 'Analysis of foreign technology/equipment', 'Malware analysis, firmware analysis'],
          ]}
        />

        <H3>The Intelligence Cycle</H3>
        <P>Professional intelligence work follows a structured cycle. This prevents wasted effort, keeps investigations focused, and ensures findings are usable. Skipping planning is the most common beginner mistake.</P>
        <Pre label="// OSINT INTELLIGENCE CYCLE">{`PHASE 1: PLANNING & DIRECTION
  - Define the intelligence requirement (PIR - Priority Intelligence Requirement)
  - Scope: What exactly do you need to know?
  - Target: Organisation, individual, infrastructure, or combination?
  - Legal check: Do you have authorisation for active recon?
  - Output format: Report, briefing, graph, timeline?
               |
               v
PHASE 2: COLLECTION
  - Passive: Reading public data (WHOIS, social media, news)
  - Semi-passive: Normal user-level traffic (visiting their homepage once)
  - Active: Direct probing (scanning, crawling) - requires authorisation
  - Sources: Web, social media, DNS, leaked databases, satellite imagery
               |
               v
PHASE 3: PROCESSING
  - Normalise and structure raw data
  - Deduplicate: remove redundant hits
  - Correlate: email -> username -> social profile -> IP
  - Filter noise: distinguish signal from background
               |
               v
PHASE 4: ANALYSIS
  - Pattern recognition: behaviours, timelines, relationships
  - Network mapping: who connects to whom?
  - Gap analysis: what is missing and why?
  - Confidence levels: high / medium / low confidence per finding
               |
               v
PHASE 5: DISSEMINATION
  - Structured report with citations for every claim
  - Visualisations: link graphs, timelines, maps
  - Executive summary + technical appendix
  - Recommendations for follow-up`}</Pre>

        <H3>Passive vs Active Reconnaissance</H3>
        <P>This distinction is legally and operationally critical. Passive recon means you never send a packet to the target. Active recon means the target's systems see your traffic.</P>
        <Table
          headers={['TYPE', 'CONTACT WITH TARGET?', 'EXAMPLE', 'DETECTABILITY', 'LEGAL RISK']}
          rows={[
            ['Passive', 'None - third-party data only', 'Reading WHOIS, searching Google, checking crt.sh', 'Zero', 'None - always legal'],
            ['Semi-passive', 'Normal user-level traffic', 'Visiting their public homepage, LinkedIn', 'Minimal - normal web traffic', 'None'],
            ['Active', 'Direct probing of target systems', 'Port scanning, banner grabbing, dir fuzzing', 'High - appears in server logs', 'Illegal without written authorisation'],
          ]}
        />

        <Note type="warn">
          Port scanning, directory brute forcing, vulnerability scanning, and any direct probing of systems without written authorisation is illegal in most jurisdictions under laws like the Computer Fraud and Abuse Act (US) and the Computer Misuse Act (UK) - regardless of your intent. Always know which category your action falls into before proceeding.
        </Note>

        <H3>OSINT Target Categories</H3>
        <Table
          headers={['CATEGORY', 'WHAT TO COLLECT', 'PRIMARY SOURCES']}
          rows={[
            ['People (individuals)', 'Full name, email, phone, username, social profiles, location, relationships', 'Social media, data brokers, breach databases, people search engines'],
            ['Organisations', 'Domains, IPs, employees, org structure, tech stack, locations, subsidiaries', 'WHOIS, LinkedIn, Shodan, job postings, Companies House / SEC filings'],
            ['Infrastructure', 'Open ports, running services, SSL certs, cloud assets, network ranges', 'Shodan, Censys, crt.sh, BGP databases, cloud storage scanners'],
            ['Geospatial', 'Physical locations, building layouts, movement patterns, vehicle routes', 'Satellite imagery, Google Maps, flight/ship tracking, social media geotagging'],
            ['Dark web', 'Leaked credentials, breach data, threat actor chatter, stolen data', 'Tor browser, paste sites, dark web search engines, breach monitoring services'],
          ]}
        />

        <H3>Legal Framework</H3>
        <P>OSINT practitioners must understand the legal boundaries of their work. The law differs by jurisdiction but two frameworks are most relevant globally.</P>
        <Pre label="// LEGAL FRAMEWORK OVERVIEW">{`COMPUTER FRAUD AND ABUSE ACT (CFAA) - United States
  - Prohibits accessing computer systems without authorisation
  - "Without authorisation" includes exceeding permitted access
  - Passive OSINT (reading public data) is not covered
  - Active scanning of systems you do not own = potential violation
  - Civil and criminal liability

GDPR - European Union (and UK equivalent)
  - Collecting personal data requires a lawful basis (Art. 6)
  - Legitimate interest can justify OSINT in professional contexts
  - Storing and processing EU personal data has strict requirements
  - Data minimisation: collect only what is necessary
  - Right to erasure applies even to OSINT-collected data

COMPUTER MISUSE ACT - United Kingdom
  - Section 1: Unauthorised access to computer material (up to 2 years)
  - Section 3: Unauthorised acts with intent to impair systems (up to 10 years)
  - Applies to any UK-connected system regardless of your location

PRACTICAL RULE: If a human could manually read the data by visiting
a public webpage without logging in, it is almost always legal to
collect. If it requires authentication, bypassing controls, or
automated mass collection of personal data, get legal advice first.`}</Pre>

        <H3>OPSEC for Investigators</H3>
        <P>Investigators can expose themselves while conducting research. LinkedIn notifies people when you view their profile. Websites log your IP. Google tracks search history. OPSEC is not paranoia - it is professionalism.</P>
        <Pre label="// INVESTIGATOR OPSEC STACK">{`LAYER 1: Dedicated browser profile
  Firefox Multi-Account Containers - one container per target
  Never mix research with personal browsing

LAYER 2: VPN for semi-passive research
  Paid, no-logs VPN (Mullvad, ProtonVPN)
  Never free VPNs - they sell your data

LAYER 3: Tor for visiting target websites
  torsocks curl https://TARGET_SITE
  Changes exit IP on each circuit

LAYER 4: Sock puppet accounts
  Separate email + phone per research persona
  Created from VPN/Tor, never from personal IP
  Age accounts 30-60 days before use

LAYER 5: Isolated VM per investigation
  Whonix, Tails, or TraceLabs OSINT VM
  Revert snapshot after each investigation

LAYER 6: Strip metadata before sharing
  exiftool -all= screenshot.png`}</Pre>

        <H3>Sock Puppet Account Methodology</H3>
        <P>Sock puppets are research personas used to access platforms without revealing your identity. Creating believable sock puppets is an art that requires patience and consistency.</P>
        <Pre label="// SOCK PUPPET CREATION CHECKLIST">{`1. PERSONA PLANNING
   - Choose a realistic name (use name generators + census data)
   - Pick age, location, profession consistent with target audience
   - Design backstory: where did they study? What do they like?
   - Prepare profile photos (AI-generated faces: thispersondoesnotexist.com)

2. ACCOUNT INFRASTRUCTURE
   - Dedicated email via ProtonMail or Tutanota (from VPN/Tor)
   - Prepaid SIM or virtual number (MySudo, Google Voice) for 2FA
   - Create from a VPN IP you do not use for anything personal

3. ACCOUNT AGING (minimum 30 days before use)
   - Post generic content: news shares, hobby comments
   - Follow public figures, join communities relevant to persona
   - Build realistic follower/following ratio
   - Vary posting times to match persona's timezone

4. OPERATIONAL SECURITY
   - Never access sock puppet from personal IP
   - Never link to your real identity in any way
   - Use different browsers per persona
   - Log out and clear cookies between sessions

5. RETIREMENT
   - When investigation ends, stop using the account
   - Do not delete immediately - dormant accounts look natural
   - Delete after 6 months of inactivity`}</Pre>

        <H3>OSINT Tools Landscape</H3>
        <Table
          headers={['CATEGORY', 'FREE TOOLS', 'COMMERCIAL TOOLS']}
          rows={[
            ['Domain recon', 'whois, dig, amass, subfinder, crt.sh', 'DomainTools, SecurityTrails, PassiveTotal'],
            ['Internet scanning', 'Shodan (free tier), ZoomEye (free)', 'Shodan Enterprise, Censys Teams, BinaryEdge'],
            ['Social media', 'Sherlock, Maigret, Twint, Osintgram', 'Pipl, Maltego commercial, SocialLinks'],
            ['Email OSINT', 'Hunter.io (free tier), HaveIBeenPwned', 'Dehashed, Snusbase, IntelligenceX'],
            ['Link analysis', 'Maltego CE (limited), Spiderfoot', 'Maltego Pro/Enterprise, Spiderfoot HX'],
            ['Automated', 'Recon-ng, theHarvester, Spiderfoot', 'Recorded Future, DarkOwl, Flashpoint'],
          ]}
        />
      </div>
    ),
    takeaways: [
      'OSINT uses only publicly available data - passive collection is always legal, active probing requires authorisation.',
      'The intelligence cycle (Plan, Collect, Process, Analyse, Disseminate) prevents wasted effort and keeps investigations focused.',
      'OSINT covers five major target categories: people, organisations, infrastructure, geospatial, and dark web.',
      'Investigator OPSEC requires layered defences: dedicated VMs, VPNs, Tor, and sock puppet accounts - never research from your personal identity.',
      'Sock puppets need 30+ days of aging with realistic posting patterns before they are usable for sensitive research.',
    ],
  },

  {
    id: 'ch02-domain-recon',
    title: 'Domain & Infrastructure Reconnaissance',
    difficulty: 'BEGINNER',
    readTime: '22 min',
    content: (
      <div>
        <Note type="beginner">
          Domain reconnaissance means mapping everything attached to a target's internet presence: their domain names, the servers behind them, all subdomains, SSL certificates, and the company information in registration records. Think of it as drawing a complete map of a building's entrances before deciding which door to try. You are not touching anything - you are reading public records that anyone can access.
        </Note>

        <H3>WHOIS Lookups</H3>
        <P>WHOIS is a public database of domain registration records. Before privacy guards became common (~2018), it often contained registrant names, email addresses, phone numbers, and physical addresses. Historical WHOIS data still reveals this pre-privacy information.</P>
        <Pre label="// WHOIS ENUMERATION">{`# Basic WHOIS lookup
whois TARGET_DOMAIN
whois TARGET_IP_ADDRESS

# Key fields to extract:
# Registrant Email    -> often real identity pre-GDPR
# Name Servers        -> reveals hosting provider or CDN
# Creation Date       -> domain age (old = more trusted)
# Expiry Date         -> watch for imminent expiry (takeover risk)
# Registrar           -> which registrar they use

# RDAP (modern JSON-based WHOIS):
curl https://rdap.org/domain/TARGET_DOMAIN | python3 -m json.tool

# Historical WHOIS (pre-privacy guard data):
# https://whoishistory.com
# https://domaintools.com (commercial, most complete)
# https://who.is (free web interface)

# Reverse WHOIS: find all domains registered by same email
# domaintools.com/reverse-whois/
# viewdns.info/reversewhois/`}</Pre>

        <H3>DNS Record Enumeration</H3>
        <P>DNS records reveal the full technical infrastructure of a target. MX records expose their email provider. TXT records contain SPF, DKIM, and third-party service verification tokens. NS records reveal their DNS hosting provider.</P>
        <Pre label="// DNS RECORD TYPES">{`# Query all record types:
dig TARGET_DOMAIN ANY
dig TARGET_DOMAIN +short

# Individual record types:
dig TARGET_DOMAIN A            # IPv4 address(es)
dig TARGET_DOMAIN AAAA         # IPv6 address(es)
dig TARGET_DOMAIN MX           # Mail servers -> email provider
dig TARGET_DOMAIN TXT          # SPF, DKIM, domain verification tokens
dig TARGET_DOMAIN NS           # Authoritative name servers
dig TARGET_DOMAIN SOA          # Zone authority (serial, refresh, TTL)
dig TARGET_DOMAIN CNAME        # Canonical name aliases
dig -x TARGET_IP               # Reverse DNS (PTR record)
dig TARGET_DOMAIN CAA          # Certificate Authority Authorisation

# Using nslookup:
nslookup -type=MX TARGET_DOMAIN
nslookup -type=TXT TARGET_DOMAIN

# Using host:
host -a TARGET_DOMAIN          # All records
host -t MX TARGET_DOMAIN

# Online visual DNS map:
# https://dnsdumpster.com
# https://securitytrails.com`}</Pre>

        <H3>Zone Transfer Attempts</H3>
        <P>A DNS zone transfer (AXFR) is designed to replicate DNS records from a primary to a secondary nameserver. When misconfigured, it returns all DNS records for a domain to any requester - instantly revealing every subdomain and internal IP address.</P>
        <Pre label="// ZONE TRANSFER (AXFR)">{`# Identify nameservers first:
dig TARGET_DOMAIN NS +short

# Attempt zone transfer against each nameserver:
dig axfr TARGET_DOMAIN @ns1.TARGET_DOMAIN
dig axfr TARGET_DOMAIN @ns2.TARGET_DOMAIN

# Using dnsrecon:
dnsrecon -d TARGET_DOMAIN -t axfr

# If successful - you get ALL records:
# Internal hostnames, admin panels, dev/staging servers
# Internal IP ranges, mail servers, legacy systems
# Virtually unmissable subdomain enumeration

# Most organisations block AXFR from external IPs
# But it is always worth attempting - misconfigurations exist`}</Pre>

        <H3>Subdomain Enumeration</H3>
        <P>Subdomains often expose forgotten development servers, admin panels, staging environments, and internal tools. A main website might be hardened while dev.target.com runs an unpatched application.</P>
        <Pre label="// SUBDOMAIN DISCOVERY - PASSIVE">{`# Subfinder - fast passive enumeration
subfinder -d TARGET_DOMAIN
subfinder -d TARGET_DOMAIN -o subdomains.txt
subfinder -d TARGET_DOMAIN -all   # All sources

# Amass - most comprehensive passive+active
amass enum -d TARGET_DOMAIN -passive
amass enum -d TARGET_DOMAIN -passive -o amass_results.txt
amass enum -d TARGET_DOMAIN          # Active mode (slower, more results)
amass enum -d TARGET_DOMAIN -brute   # Add brute force

# assetfinder - fast, minimal
assetfinder TARGET_DOMAIN
assetfinder --subs-only TARGET_DOMAIN

# Certificate Transparency (passive, very effective):
curl "https://crt.sh/?q=%.TARGET_DOMAIN&output=json" | \
  python3 -c "import json,sys; [print(r['name_value']) for r in json.load(sys.stdin)]" \
  | sort -u | tee ct_results.txt

# Online CT search:
# https://crt.sh/?q=%.TARGET_DOMAIN`}</Pre>

        <Pre label="// SUBDOMAIN BRUTE FORCING (ACTIVE)">{`# gobuster dns mode:
gobuster dns -d TARGET_DOMAIN -w /usr/share/wordlists/seclists/Discovery/DNS/subdomains-top1million-5000.txt

# dnsrecon brute force:
dnsrecon -d TARGET_DOMAIN -t brt -D /usr/share/wordlists/dnsmap.txt

# massdns - high-speed resolver:
massdns -r resolvers.txt -t A -o S wordlist.txt | grep "TARGET_DOMAIN"

# shuffledns - wrapper around massdns:
shuffledns -d TARGET_DOMAIN -list subdomains.txt -r resolvers.txt

# Merge and resolve all found subdomains:
cat amass_results.txt ct_results.txt subdomains.txt | sort -u | \
  dnsx -silent -a -resp > resolved_hosts.txt`}</Pre>

        <H3>Certificate Transparency</H3>
        <P>Every SSL/TLS certificate issued by a public CA is logged to public Certificate Transparency logs. These logs are searchable and reveal every subdomain that has ever had a certificate issued - including forgotten staging environments, internal tools exposed via certificates, and historical subdomains.</P>
        <Pre label="// CERTIFICATE TRANSPARENCY SOURCES">{`# crt.sh - most used CT search
https://crt.sh/?q=%.TARGET_DOMAIN
https://crt.sh/?q=TARGET_DOMAIN&output=json

# Certspotter API:
curl https://api.certspotter.com/v1/issuances?domain=TARGET_DOMAIN&include_subdomains=true&expand=dns_names

# Censys certificates (requires free account):
# Search: parsed.subject_dn:"TARGET_DOMAIN"
# or: parsed.names:"TARGET_DOMAIN"

# Facebook CT API (fast, comprehensive):
curl "https://graph.facebook.com/certificates?query=TARGET_DOMAIN&fields=domains,issuer_name,valid_from&access_token=APP_TOKEN"

# Process raw CT output:
cat ct_raw.txt | sed 's/\*\.//g' | sort -u > ct_clean.txt`}</Pre>

        <H3>BGP and ASN Intelligence</H3>
        <P>Autonomous System Numbers (ASNs) define the IP ranges owned by an organisation. Finding a company's ASN reveals their entire owned IP space - far more than just the IPs attached to their domains.</P>
        <Pre label="// BGP / ASN LOOKUPS">{`# Find ASN for an organisation:
# https://bgp.he.net (search by org name)
# https://ipinfo.io/AS15169 (replace AS number)

# whois on an IP shows ASN:
whois TARGET_IP | grep -i "asn\|as number\|origin"

# Using Python ipwhois:
python3 -c "from ipwhois import IPWhois; r=IPWhois('TARGET_IP').lookup_rdap(); print(r['asn'], r['asn_cidr'])"

# ASN to all owned IP ranges:
# https://bgp.he.net/AS12345#_prefixes (replace 12345 with ASN number)
# https://ipinfo.io/AS12345 -> shows all CIDRs

# Expand CIDR to IP list:
prips 93.184.216.0/24 > all_ips.txt

# Then feed to Shodan or masscan for port scanning (with authorisation)`}</Pre>

        <H3>WAF, CDN Detection and Web Technology Fingerprinting</H3>
        <Pre label="// WEB TECH FINGERPRINTING">{`# WhatWeb - technology detection:
whatweb TARGET_DOMAIN
whatweb -a 3 TARGET_DOMAIN    # aggression level 3 (more requests)
whatweb TARGET_DOMAIN --log-json=results.json

# wafw00f - WAF detection:
wafw00f https://TARGET_DOMAIN
wafw00f -a https://TARGET_DOMAIN    # detect all WAFs

# Online fingerprinting:
# https://builtwith.com/TARGET_DOMAIN
# https://www.wappalyzer.com (browser extension)
# retire.js (browser extension for JS library versions)

# Manual fingerprinting via headers:
curl -sI https://TARGET_DOMAIN | grep -i "x-powered-by\|server\|x-generator\|x-drupal\|x-wordpress"

# Favicon hash for Shodan (powerful technique):
# 1. Get favicon:
curl -s https://TARGET_DOMAIN/favicon.ico | python3 -c "
import sys, base64, hashlib, struct
data = sys.stdin.buffer.read()
favicon_hash = hashlib.md5(base64.b64encode(data)).hexdigest()
print('MD5:', favicon_hash)
"
# 2. Search in Shodan:
# http.favicon.hash:HASH_VALUE`}</Pre>

        <H3>Historical DNS and Passive DNS</H3>
        <Pre label="// HISTORICAL DNS SOURCES">{`# SecurityTrails (best historical DNS):
# https://securitytrails.com/domain/TARGET_DOMAIN/history/a

# Passive DNS databases:
# https://passivedns.mnemonic.no
# https://www.virustotal.com/gui/domain/TARGET_DOMAIN/resolutions

# Why historical DNS matters:
# - Find real IP behind Cloudflare (old A records before CDN migration)
# - Discover decommissioned subdomains still running
# - Track infrastructure changes over time
# - Identify hosting provider before CDN

# RiskIQ PassiveTotal (now Microsoft Defender TI):
# Commercial but powerful - years of DNS history`}</Pre>
      </div>
    ),
    takeaways: [
      'Historical WHOIS data (pre-2018) often contains real registrant names and emails that are valuable for attribution.',
      'DNS records expose critical infrastructure details: MX shows email provider, TXT reveals third-party services, SOA shows zone management.',
      'Zone transfer (AXFR) is often blocked but always worth attempting - a misconfigured nameserver reveals every subdomain instantly.',
      'Certificate Transparency logs are comprehensive and passive - every SSL cert ever issued is searchable at crt.sh.',
      'BGP/ASN lookups reveal an organisation\'s entire owned IP space, not just the IPs attached to their public domains.',
    ],
  },

  {
    id: 'ch03-shodan-censys',
    title: 'Shodan, Censys & Internet Scanning',
    difficulty: 'INTERMEDIATE',
    readTime: '20 min',
    content: (
      <div>
        <Note type="beginner">
          Shodan is a search engine for internet-connected devices. Instead of indexing web pages like Google, it continuously scans every IP address on the internet, connects to each port, records the response, and makes that data searchable. When a server runs MongoDB with no password, Shodan finds it and anyone can search for it. Security researchers use Shodan to find exposed services before attackers do - and to map an organisation's entire internet-facing infrastructure in seconds.
        </Note>

        <H3>Shodan Search Operators: Full Reference</H3>
        <Table
          headers={['OPERATOR', 'FUNCTION', 'EXAMPLE']}
          rows={[
            ['hostname:', 'Filter by hostname/subdomain', 'hostname:TARGET_DOMAIN'],
            ['org:', 'Organisation name (ISP/company)', 'org:"Target Company Name"'],
            ['net:', 'CIDR IP range search', 'net:192.168.0.0/24'],
            ['port:', 'Specific open port', 'port:27017'],
            ['product:', 'Software/service name', 'product:"Apache httpd"'],
            ['version:', 'Software version string', 'version:"2.4.49"'],
            ['country:', 'ISO country code', 'country:US'],
            ['city:', 'City name', 'city:"New York"'],
            ['http.title:', 'HTML page title content', 'http.title:"Admin Login"'],
            ['http.html:', 'Content in HTTP response body', 'http.html:"powered by WordPress"'],
            ['http.favicon.hash:', 'Favicon MD5 hash', 'http.favicon.hash:HASH_VALUE'],
            ['http.status:', 'HTTP response status code', 'http.status:200'],
            ['ssl:', 'SSL certificate content', 'ssl:"TARGET_DOMAIN"'],
            ['ssl.cert.subject.cn:', 'SSL common name', 'ssl.cert.subject.cn:"*.TARGET_DOMAIN"'],
            ['ssl.cert.issuer.cn:', 'Certificate issuer', 'ssl.cert.issuer.cn:"Let\'s Encrypt"'],
            ['before:', 'Results before date', 'before:2024-01-01'],
            ['after:', 'Results after date', 'after:2023-01-01'],
            ['os:', 'Operating system', 'os:"Windows Server 2012"'],
            ['asn:', 'Autonomous System Number', 'asn:AS15169'],
          ]}
        />

        <H3>Shodan Dorking for Exposed Services</H3>
        <Pre label="// HIGH-VALUE SHODAN SEARCHES">{`# Exposed databases (no authentication):
port:27017 product:MongoDB -authentication
port:9200 product:Elasticsearch
port:6379 product:Redis -auth
port:5432 product:PostgreSQL

# Admin panels and management interfaces:
http.title:"Admin Panel" http.status:200
http.title:"Kibana" port:5601
http.title:"Grafana" http.status:200
http.title:"Jenkins" http.status:200
http.title:"JupyterHub" port:8000
http.title:"phpMyAdmin"

# Exposed remote access:
port:3389 os:"Windows"                # RDP
port:5900 product:"VNC"               # VNC
port:5901 has_screenshot:true         # VNC with screenshot

# Industrial/SCADA systems:
product:"Siemens S7" port:102
port:44818 product:"Rockwell"         # Allen-Bradley PLCs

# Organisation-specific search:
org:"TARGET_COMPANY" port:22
org:"TARGET_COMPANY" port:3389
org:"TARGET_COMPANY" http.status:200

# All certs for a domain (finds subdomains):
ssl.cert.subject.cn:"*.TARGET_DOMAIN"
ssl:"TARGET_DOMAIN"

# Favicon hash (find all servers with same favicon):
http.favicon.hash:HASH_VALUE

# Open directory listings:
http.title:"Index of /"

# Find all IP ranges for an ASN:
asn:AS_NUMBER`}</Pre>

        <H3>Shodan API and Python Integration</H3>
        <Pre label="// SHODAN PYTHON API">{`pip install shodan

# Initialise:
import shodan
api = shodan.Shodan('YOUR_API_KEY')

# Basic search:
results = api.search('org:"Target Company" port:22')
for result in results['matches']:
    print(result['ip_str'], result['port'], result.get('org', 'N/A'))

# Host lookup (full details for one IP):
host = api.host('TARGET_IP')
print(host['org'], host['country_code'])
for item in host['data']:
    print(item['port'], item.get('product', ''), item.get('version', ''))

# Bulk IP lookup (count only - free):
total = api.count('org:"Target Company"')['total']

# Search with facets (aggregate stats):
results = api.search('product:nginx', facets=[('country', 5)])
for facet in results['facets']['country']:
    print(facet['value'], facet['count'])

# CLI equivalents:
# shodan search 'org:"Target Company" port:22'
# shodan host TARGET_IP
# shodan count 'port:3389 os:"Windows"'`}</Pre>

        <H3>Censys Search Syntax</H3>
        <P>Censys indexes similar data to Shodan but with stronger certificate data and a different query language. Censys is particularly valuable for certificate-based searches.</P>
        <Pre label="// CENSYS SEARCH OPERATORS">{`# Services search (censys.io/search):
services.port:443
services.service_name:HTTP
services.tls.certificates.leaf_data.subject_dn:"TARGET_DOMAIN"
services.http.response.html_title:"Admin"

# Host search:
ip:"TARGET_IP"
autonomous_system.name:"TARGET_ORG"
autonomous_system.asn:12345

# Certificate search (certificates tab):
parsed.subject_dn:"TARGET_DOMAIN"
parsed.names:"TARGET_DOMAIN"
parsed.subject.organization:"TARGET_COMPANY"
parsed.issuer.organization:"Let's Encrypt"

# Find all certs issued to an org:
parsed.subject.organization:"TARGET_COMPANY"

# Python API:
pip install censys
from censys.search import CensysHosts
h = CensysHosts()
for host in h.search("services.port:9200"):
    print(host["ip"])`}</Pre>

        <H3>FOFA, ZoomEye, GreyNoise, BinaryEdge</H3>
        <Table
          headers={['PLATFORM', 'UNIQUE ADVANTAGE', 'QUERY EXAMPLE']}
          rows={[
            ['FOFA (fofa.info)', 'Largest Chinese-language dataset, unique Asian infrastructure data', 'domain="TARGET_DOMAIN"'],
            ['ZoomEye (zoomeye.org)', 'Alternative to Shodan, good CVE correlation', 'hostname:"TARGET_DOMAIN"'],
            ['GreyNoise (greynoise.io)', 'Classifies IPs as mass-scanner vs targeted - removes noise from alerts', 'classification:malicious'],
            ['BinaryEdge (binaryedge.io)', 'Attack surface mapping, vulnerability correlation, historical data', 'domain:"TARGET_DOMAIN"'],
            ['Natlas', 'Self-hosted internet scanning platform', 'Open source, run your own'],
          ]}
        />

        <H3>Full-Internet Scanning with masscan and zmap</H3>
        <Pre label="// MASSCAN + ZMAP (AUTHORISED USE ONLY)">{`# masscan - fastest internet scanner (10M packets/sec):
# WARNING: Only scan IP ranges you own or have written authorisation for

# Scan specific range for a port:
masscan 10.0.0.0/8 -p22,80,443,3389 --rate=10000 -oJ output.json

# Scan from file of IP ranges:
masscan -iL targets.txt -p80,443,8080,8443 --rate=5000

# Slow scan to avoid detection:
masscan 10.0.0.0/24 -p22 --rate=100 --wait 5

# zmap - alternative, single-port optimised:
zmap -p 80 10.0.0.0/24 -o results.txt

# Responsible use:
# - Always have written authorisation
# - Rate limit aggressively on shared networks
# - Contact NOC/security teams before external scans
# - Never scan the full internet without coordination`}</Pre>

        <H3>Exposed Cloud Storage Discovery</H3>
        <Pre label="// CLOUD STORAGE OSINT">{`# S3Scanner - enumerate S3 buckets:
pip install s3scanner
s3scanner scan --bucket TARGET_BUCKET_NAME
s3scanner scan --bucket-file bucket_names.txt

# GrayhatWarfare - searchable public bucket database:
# https://buckets.grayhatwarfare.com/

# AWSBucketDump - automated S3 content extraction:
python AWSBucketDump.py -l bucket_names.txt -g interesting_files.txt

# cloud_enum - multi-cloud (AWS, Azure, GCP):
python3 cloud_enum.py -k TARGET_NAME --disable-brute

# Azure blob storage:
# https://ACCOUNT_NAME.blob.core.windows.net/CONTAINER_NAME/
# If public: lists files in XML format

# GCP buckets:
# https://storage.googleapis.com/BUCKET_NAME
# gsutil ls gs://BUCKET_NAME (if public)

# Common naming patterns to try:
# TARGET_NAME, TARGET_NAME-backup, TARGET_NAME-dev
# TARGET_NAME-prod, TARGET_NAME-assets, TARGET_NAME-media`}</Pre>
      </div>
    ),
    takeaways: [
      'Shodan indexes every internet-connected device - use org:, ssl:, and http.favicon.hash: operators to map an organisation\'s entire attack surface passively.',
      'Favicon hash searching in Shodan finds all servers running the same application, even on non-standard ports or unexpected IP ranges.',
      'Censys excels at certificate-based OSINT - searching parsed.subject.organization reveals all certs issued to a company across any domain they control.',
      'GreyNoise is essential context when analysing Shodan results - it tells you whether an IP is a mass scanner or a targeted actor.',
      'Cloud storage (S3, Azure Blob, GCS) is a rich target - naming conventions based on company name often find publicly accessible buckets containing sensitive data.',
    ],
  },

  {
    id: 'ch04-google-dorking',
    title: 'Google Dorking & Web OSINT',
    difficulty: 'BEGINNER',
    readTime: '18 min',
    content: (
      <div>
        <Note type="beginner">
          Google Dorking means using Google's advanced search operators to find information that is technically public but not prominently displayed. A company might accidentally expose their database backup file or their internal configuration on a publicly accessible web server - Google will index it. Knowing the right search syntax lets you find these exposures without ever touching the target's systems. You are just using Google.
        </Note>

        <H3>Google Search Operators: Full Reference</H3>
        <Table
          headers={['OPERATOR', 'FUNCTION', 'EXAMPLE']}
          rows={[
            ['site:', 'Restrict results to a domain', 'site:TARGET_DOMAIN'],
            ['filetype:', 'Results with specific file extension', 'filetype:pdf site:TARGET_DOMAIN'],
            ['ext:', 'Alternative to filetype:', 'ext:sql site:TARGET_DOMAIN'],
            ['intitle:', 'Page title contains term', 'intitle:"admin login"'],
            ['allintitle:', 'All terms must be in title', 'allintitle:admin login panel'],
            ['inurl:', 'URL contains term', 'inurl:"/admin"'],
            ['allinurl:', 'All terms in URL', 'allinurl:admin panel login'],
            ['intext:', 'Page body contains term', 'intext:"internal use only"'],
            ['allintext:', 'All terms in body', 'allintext:password username'],
            ['cache:', 'Google\'s cached version of page', 'cache:TARGET_DOMAIN'],
            ['related:', 'Sites related to domain', 'related:TARGET_DOMAIN'],
            ['before:', 'Results before date (YYYY-MM-DD)', 'site:TARGET_DOMAIN before:2022-01-01'],
            ['after:', 'Results after date', 'site:TARGET_DOMAIN after:2023-01-01'],
            ['"..."', 'Exact phrase match', '"internal use only" site:TARGET_DOMAIN'],
            ['-', 'Exclude term from results', 'site:TARGET_DOMAIN -www'],
            ['OR', 'Either term', 'site:TARGET_DOMAIN filetype:pdf OR filetype:docx'],
            ['*', 'Wildcard placeholder', 'site:TARGET_DOMAIN inurl:"/api/*"'],
          ]}
        />

        <H3>High-Value Dork Combinations</H3>
        <Pre label="// CONFIGURATION AND CREDENTIAL FILES">{`# Environment files (often contain API keys, DB passwords):
site:TARGET_DOMAIN ext:env
site:TARGET_DOMAIN inurl:".env"
site:TARGET_DOMAIN intitle:"index of" ".env"

# Configuration files:
site:TARGET_DOMAIN ext:config
site:TARGET_DOMAIN ext:cfg
site:TARGET_DOMAIN ext:ini
site:TARGET_DOMAIN ext:xml inurl:config
site:TARGET_DOMAIN inurl:"wp-config.php"

# Git exposed:
site:TARGET_DOMAIN inurl:"/.git/config"
site:TARGET_DOMAIN intitle:"index of /.git"

# Log files (may contain credentials, errors, paths):
site:TARGET_DOMAIN ext:log
site:TARGET_DOMAIN inurl:"/logs/" filetype:log
site:TARGET_DOMAIN intitle:"index of" "error.log"

# Database files:
site:TARGET_DOMAIN ext:sql
site:TARGET_DOMAIN ext:sql intext:"INSERT INTO"
site:TARGET_DOMAIN ext:db
site:TARGET_DOMAIN ext:sqlite`}</Pre>

        <Pre label="// SENSITIVE DOCUMENTS">{`# Credentials in documents:
site:TARGET_DOMAIN filetype:pdf "confidential"
site:TARGET_DOMAIN filetype:xlsx "salary"
site:TARGET_DOMAIN filetype:docx "password"

# Internal docs accidentally public:
site:TARGET_DOMAIN filetype:pdf "internal use only"
site:TARGET_DOMAIN filetype:doc "do not distribute"
site:TARGET_DOMAIN intext:"proprietary and confidential"

# Login portals (useful for mapping attack surface):
site:TARGET_DOMAIN inurl:login
site:TARGET_DOMAIN inurl:/admin
site:TARGET_DOMAIN intitle:"Sign In" inurl:admin
site:TARGET_DOMAIN inurl:"/portal/"
site:TARGET_DOMAIN inurl:"/dashboard/"

# Exposed directory listings:
site:TARGET_DOMAIN intitle:"Index of /"
site:TARGET_DOMAIN intitle:"Directory listing"

# API documentation (reveals endpoints):
site:TARGET_DOMAIN inurl:"/api/swagger"
site:TARGET_DOMAIN intitle:"Swagger UI"
site:TARGET_DOMAIN inurl:"/api/docs"`}</Pre>

        <H3>Google Hacking Database (GHDB)</H3>
        <P>The Exploit Database maintains the Google Hacking Database - a categorised collection of thousands of proven dork patterns. It is the authoritative reference for Google dorking.</P>
        <Pre label="// GHDB CATEGORIES">{`# Full database: https://www.exploit-db.com/google-hacking-database

# Key categories:
# - Files Containing Passwords
# - Sensitive Online Shopping Info
# - Network or Vulnerability Data
# - Pages Containing Login Portals
# - Various Online Devices
# - Advisories and Server Vulnerabilities
# - Error Messages
# - Files Containing Juicy Info
# - Files Containing Usernames

# Example high-value GHDB dorks:
intitle:"phpMyAdmin" "Welcome to phpMyAdmin"
intitle:"Outlook Web Access" inurl:"/owa/"
intext:"sql syntax near" intext:"syntax error has occurred"
ext:pwd inurl:(service | authors | administrators | users)`}</Pre>

        <H3>Alternative Search Engines</H3>
        <P>Different search engines index different content. For comprehensive coverage, especially on non-English targets or censored content, use multiple engines.</P>
        <Table
          headers={['ENGINE', 'UNIQUE ADVANTAGE', 'USEFUL FOR']}
          rows={[
            ['Bing', 'Different index, some operators: site:, filetype:, ip:', 'Content Google doesn\'t index, IP-based searches'],
            ['DuckDuckGo', 'site:, filetype: operators work, privacy-focused', 'Basic dorking without personalisation'],
            ['Yandex', 'Superior reverse image search (face recognition), Russian-language index', 'Russian targets, finding photos of people'],
            ['Baidu', 'Largest Chinese-language index', 'Chinese-language targets, Chinese-hosted content'],
            ['Startpage', 'Google results without tracking', 'Privacy-preserving Google results'],
          ]}
        />

        <H3>Wayback Machine and Historical Web</H3>
        <Pre label="// ARCHIVE.ORG OSINT">{`# Direct URL access:
https://web.archive.org/web/*/TARGET_DOMAIN/*

# Find all archived pages for a domain:
https://web.archive.org/web/20230101000000*/TARGET_DOMAIN

# CDX API (programmatic access to archive index):
curl "http://web.archive.org/cdx/search/cdx?url=TARGET_DOMAIN&output=json&fl=timestamp,original,statuscode"

# Find old login pages (may have different auth):
https://web.archive.org/web/*/TARGET_DOMAIN/admin/*

# What to look for in archived pages:
# - Old login portals with different authentication
# - Previous employee names/emails in contact pages
# - Historical API documentation
# - Exposed config files that were later removed
# - Old subdomains that no longer resolve
# - Company org structure from old About pages

# waybackurls - extract all historical URLs:
waybackurls TARGET_DOMAIN | tee historical_urls.txt
cat historical_urls.txt | grep -i "admin\|login\|config\|\.env\|\.sql"

# Common Crawl - petabyte-scale web archive:
# https://commoncrawl.org - useful for large-scale analysis`}</Pre>

        <H3>Paste Site Monitoring</H3>
        <Pre label="// PASTE SITE OSINT">{`# Google dork approach:
site:pastebin.com "TARGET_DOMAIN"
site:pastebin.com "TARGET_EMAIL"
site:pastebin.com "TARGET_COMPANY" password

# Dedicated paste search:
# https://psbdmp.ws (Pastebin search engine)
# https://paste.cf

# Pastehunter - automated paste monitoring:
git clone https://github.com/kevthehermit/PastHunter
# Monitors multiple paste sites for keywords
# Alerts when keywords appear in new pastes

# Sites to monitor:
# pastebin.com, paste.ee, ghostbin.com
# hastebin.com, privatebin.net
# GitHub Gists (also indexed by Google)`}</Pre>

        <H3>Code Repository OSINT</H3>
        <Pre label="// GITHUB OSINT">{`# GitHub search operators:
# filename: - search by filename
# extension: - search by file extension
# org: - within an organisation
# user: - within a user's repos
# path: - file path contains
# language: - programming language

# High-value GitHub dorks:
filename:.env "TARGET_DOMAIN"
filename:config.json "TARGET_DOMAIN"
filename:credentials TARGET_COMPANY
filename:secrets.yml

# Find AWS keys:
"ACCESS_KEY" extension:env TARGET_COMPANY
"aws_access_key_id" org:TARGET_ORG

# Find passwords:
filename:.htpasswd TARGET_DOMAIN
filename:password.txt TARGET_DOMAIN

# Automated credential hunting:
# truffleHog - scans git history for secrets:
trufflehog git https://github.com/TARGET_ORG/TARGET_REPO

# gitleaks - fast secret scanning:
gitleaks detect --source=TARGET_REPO --verbose

# Gitdorker - automated GitHub dork runner:
python3 gitdorker.py -tf tokens.txt -q TARGET_DOMAIN -p 10 -d dorks.txt

# Job posting intelligence (reveals tech stack):
# Search LinkedIn/Indeed: "TARGET_COMPANY" "software engineer"
# Job descriptions list: AWS, Azure, Kubernetes, specific databases
# This maps their entire infrastructure without touching a single system`}</Pre>
      </div>
    ),
    takeaways: [
      'Google dorking finds publicly exposed sensitive files using search operators - no target interaction required, entirely passive.',
      'The Google Hacking Database at exploit-db.com maintains thousands of proven dork patterns categorised by data type.',
      'The Wayback Machine reveals deleted content, old login portals, and historical configuration files that may still be live on the target.',
      'GitHub dorking with filename: and extension: operators finds accidentally committed credentials, API keys, and configuration files.',
      'Job postings are a goldmine - they map a company\'s entire tech stack (cloud provider, databases, frameworks) without touching their systems.',
    ],
  },

  {
    id: 'ch05-socmint',
    title: 'People & Social Media OSINT (SOCMINT)',
    difficulty: 'INTERMEDIATE',
    readTime: '22 min',
    content: (
      <div>
        <Note type="beginner">
          Social media is the most information-rich OSINT source for individuals. People voluntarily publish their location, workplace, relationships, daily routines, and sometimes operational security failures. SOCMINT - Social Media Intelligence - is the discipline of systematically collecting and analysing this data. The goal is building a complete profile of a person or organisation from what they have publicly shared, then connecting those dots across platforms.
        </Note>

        <H3>Username Enumeration Across Platforms</H3>
        <P>People reuse usernames across platforms. Finding one username often leads to discovery of all a person's social media presence, forums, dating sites, and gaming accounts.</P>
        <Pre label="// USERNAME ENUMERATION TOOLS">{`# Sherlock - 300+ platforms:
pip install sherlock-project
sherlock TARGET_USERNAME
sherlock TARGET_USERNAME --output results.txt
sherlock TARGET_USERNAME --timeout 10

# Maigret - more comprehensive (2000+ sites):
pip install maigret
maigret TARGET_USERNAME
maigret TARGET_USERNAME --report-dir ./reports --html

# WhatsMyName - community-maintained platform list:
# https://whatsmyname.app (web interface)
git clone https://github.com/WebBreacher/WhatsMyName

# namecheckr.com - quick visual check
# checkusernames.com - 160+ platforms

# After finding profiles, note:
# - Profile creation dates (platform timeline)
# - Posting patterns (time zone clues)
# - Language/vocabulary patterns
# - Cross-references to other platforms
# - Location check-ins or tagged photos
# - Followers/following for relationship mapping`}</Pre>

        <H3>Email OSINT</H3>
        <Pre label="// EMAIL INTELLIGENCE GATHERING">{`# Hunter.io - email format + discovery:
curl "https://api.hunter.io/v2/domain-search?domain=TARGET_DOMAIN&api_key=YOUR_KEY"
curl "https://api.hunter.io/v2/email-finder?domain=TARGET_DOMAIN&first_name=John&last_name=Smith&api_key=YOUR_KEY"

# Phonebook.cz - email search:
# https://phonebook.cz (search by domain or name)

# EmailRep - email reputation:
curl "https://emailrep.io/TARGET_EMAIL"

# HaveIBeenPwned API - breach check:
curl "https://haveibeenpwned.com/api/v3/breachedaccount/TARGET_EMAIL" \
  -H "hibp-api-key: YOUR_KEY"

# Email validation (check if active):
# hunter.io/email-verifier
# neverbounce.com
# zerobounce.net

# email2phonenumber - correlate email to phone:
# https://github.com/martinvigo/email2phonenumber

# Construct email permutations for a name:
# firstname.lastname@TARGET_DOMAIN
# f.lastname@TARGET_DOMAIN
# firstnamelastname@TARGET_DOMAIN
# flastname@TARGET_DOMAIN`}</Pre>

        <H3>Breach Data and Credential Intelligence</H3>
        <Pre label="// BREACH DATA SOURCES">{`# HaveIBeenPwned (HIBP):
# https://haveibeenpwned.com
curl "https://haveibeenpwned.com/api/v3/breachedaccount/TARGET_EMAIL" \
  -H "hibp-api-key: YOUR_HIBP_KEY"

# Check password hash exposure (k-anonymity model):
# Hash password SHA1, send first 5 chars:
echo -n "TARGET_PASSWORD" | sha1sum
curl https://api.pwnedpasswords.com/range/FIRST_5_OF_SHA1_HASH

# Dehashed - full breach database search:
curl "https://api.dehashed.com/search?query=email:TARGET_EMAIL" \
  -H "Authorization: Basic BASE64_CREDENTIALS"

# Intelligence X (intelx.io):
# Web interface: https://intelx.io
# Searches paste sites, dark web leaks, public data

# Snusbase - breach database:
# https://snusbase.com

# What to do with breach data (ethical uses):
# - Notify affected individuals/organisation
# - Verify if credentials are still active (do NOT log in)
# - Build understanding of password patterns for security research
# - Assess scope of a breach for incident response`}</Pre>

        <H3>LinkedIn Intelligence</H3>
        <Pre label="// LINKEDIN OSINT">{`# Google dorks for LinkedIn:
site:linkedin.com/in "TARGET_COMPANY" "software engineer"
site:linkedin.com/in "TARGET_COMPANY" "security"
site:linkedin.com/in "TARGET_COMPANY" "IT" OR "infrastructure"
site:linkedin.com/in "TARGET_COMPANY" "former"

# LinkedInt - LinkedIn enumeration:
# https://github.com/vysecurity/LinkedInt

# linkedin2username - generate username lists from company:
python3 linkedin2username.py -c "Target Company Name" -n 100

# CrossLinked - OSINT from LinkedIn search results:
python3 crosslinked.py -f "{first}.{last}@TARGET_DOMAIN" "Target Company Name"

# What LinkedIn reveals:
# - Full org chart (who reports to whom)
# - Complete employee list with names and roles
# - Tech stack from job postings
# - Recent hires/departures (security team turnover = risk)
# - Office locations from employee profiles
# - Security team size and seniority (defender capability assessment)
# - External contractors and third-party vendors`}</Pre>

        <H3>Twitter/X, Instagram, TikTok OSINT</H3>
        <Pre label="// TWITTER / X INTELLIGENCE">{`# Advanced search operators (search.twitter.com):
from:TARGET_USERNAME keyword        # Tweets from user with keyword
to:TARGET_USERNAME                  # Replies to user
geocode:LAT,LONG,RADIUSkm          # Tweets near location
since:2024-01-01 until:2024-12-31  # Date range
filter:media TARGET_USERNAME        # Only posts with media

# Nitter instances (Twitter without login):
# https://nitter.net/TARGET_USERNAME (if still running)
# Alternative: use Twitter API v2

# Twint (archived but still useful for historical data):
pip install twint
twint -u TARGET_USERNAME --tweets
twint -u TARGET_USERNAME --following
twint -u TARGET_USERNAME -s "keyword" --since 2024-01-01

# Instagram OSINT:
# Osintgram (requires Instagram account):
git clone https://github.com/Datalux/Osintgram
python3 main.py TARGET_USERNAME
# Commands: followers, following, photos, locations, hashtags

# TikTok OSINT:
# Profile analysis: https://www.tiktok.com/@TARGET_USERNAME
# Bio links often reveal other platforms
# Video location tags, branded content disclosures`}</Pre>

        <H3>Discord, Telegram and Dark Social</H3>
        <Pre label="// DISCORD AND TELEGRAM OSINT">{`# Discord user ID lookup:
# User IDs are visible in Discord (enable Developer Mode)
# https://discord.id/ - profile lookup by user ID
# Disboard.org - public server directory

# Discord OSINT:
# - Invite links reveal server names and member counts
# - Member lists visible on public servers
# - Shared servers visible on profile (mutual servers)
# - Username history not publicly available but can be scraped historically

# Telegram public channel search:
# https://t.me/s/CHANNEL_NAME (public channels readable without account)
# https://tgstat.com - Telegram analytics
# https://telemetrio.com - channel search

# Telegram user lookup:
# Phone number -> Telegram username (if not hidden in privacy settings)
# @username search in Telegram app

# Phone number OSINT:
# TrueCaller - crowd-sourced phone book
# NumVerify API - carrier and line type lookup
# carrier lookup: identify VoIP vs landline vs mobile
# Reverse phone: https://www.whitepages.com/phone/TARGET_NUMBER`}</Pre>

        <H3>People Search Engines and Data Brokers</H3>
        <Table
          headers={['PLATFORM', 'DATA TYPES', 'NOTES']}
          rows={[
            ['Spokeo (spokeo.com)', 'Address, relatives, social media, email, phone', 'US-focused, paid for full results'],
            ['Pipl (pipl.com)', 'Deep web + social + public records, professional depth', 'Paid API, most comprehensive globally'],
            ['Whitepages (whitepages.com)', 'Phone, address, relatives, background', 'US-focused, partial free results'],
            ['BeenVerified', 'Criminal records, address history, social profiles', 'US-focused, subscription'],
            ['TruthFinder', 'Background checks, dark web scan, social profiles', 'US-focused, subscription'],
            ['FastPeopleSearch', 'Basic address and phone, free', 'US-focused, aggregated public records'],
          ]}
        />

        <Note type="warn">
          People search engine data is collected and sold without individual consent. Using it for legitimate security research, threat intelligence, or authorised investigations is generally legal. Using it to stalk, harass, or target individuals is illegal and unethical. Always consider proportionality and purpose before accessing detailed personal profiles.
        </Note>
      </div>
    ),
    takeaways: [
      'Username reuse means finding one account often leads to discovery of a person\'s entire online presence across hundreds of platforms.',
      'LinkedIn is the most powerful corporate OSINT source - it reveals org structure, tech stack, and employee data that would otherwise require active reconnaissance.',
      'Breach data from HIBP and Dehashed reveals whether a target\'s email appears in known data breaches - valuable for threat intelligence and incident response.',
      'Telegram public channels are readable without an account and contain significant intelligence on communities, threat actors, and leaked data.',
      'Data brokers aggregate public records into comprehensive profiles - useful for investigations but must be used proportionately and ethically.',
    ],
  },

  {
    id: 'ch06-geospatial-image',
    title: 'Geospatial & Image OSINT',
    difficulty: 'INTERMEDIATE',
    readTime: '20 min',
    content: (
      <div>
        <Note type="beginner">
          A single photograph can reveal where it was taken (GPS metadata), when it was taken (shadow analysis, sun position), what device took it (camera model in EXIF data), and who took it (faces, reflections). Geospatial OSINT combines image analysis, satellite imagery, and mapping tools to physically locate people, verify events, and understand movements. Bellingcat - the open source investigative journalism group - pioneered many of these techniques to document war crimes and track down wanted individuals.
        </Note>

        <H3>Reverse Image Search</H3>
        <P>Reverse image search finds where else on the internet a specific image appears - useful for finding the original source of a photo, identifying where someone has reposted content, and finding earlier versions of manipulated images.</P>
        <Pre label="// REVERSE IMAGE SEARCH PLATFORMS">{`# Google Images (best for landmarks, objects, logos):
# images.google.com -> drag and drop or upload
# Keyboard shortcut: right-click image -> "Search image with Google"

# TinEye (exact and near-duplicate detection):
# https://www.tineye.com
# API: https://api.tineye.com

# Yandex Images (best for faces - uses facial recognition):
# https://yandex.com/images/
# Upload: click camera icon in search bar
# Most effective for finding who a person is from photos

# Bing Visual Search:
# https://www.bing.com/visualsearch
# Good for products and landmarks

# Search workflow for unknown person:
# 1. Try Yandex first (facial recognition is most capable)
# 2. Try Google Images (broader web coverage)
# 3. Try TinEye (finds exact copies and modified versions)
# 4. Try PimEyes if Yandex fails (commercial facial search)`}</Pre>

        <H3>EXIF Metadata Extraction</H3>
        <Pre label="// EXIFTOOL FULL REFERENCE">{`# Install:
sudo apt install libimage-exiftool-perl

# Extract all metadata:
exiftool TARGET_FILE.jpg
exiftool TARGET_FILE.pdf
exiftool TARGET_FILE.docx

# Recursive extraction from directory:
exiftool -r ./FOLDER/

# Export to CSV for analysis:
exiftool -csv *.jpg > metadata.csv
exiftool -csv *.pdf > doc_metadata.csv

# Key fields of interest:
# GPS Latitude / GPS Longitude    -> exact photo location
# GPS Date/Time                   -> when photo was taken (UTC)
# Make / Model                    -> camera or phone model
# Software                        -> editing software used (Photoshop version etc)
# Author / Creator                -> document author (often Windows username)
# Last Modified By                -> username of last editor
# Company                         -> organisation name from Office settings
# Template                        -> internal server path (e.g. \\\\server\\share\\doc.dotm)
# GPS Img Direction               -> direction camera was pointing

# Extract GPS and format as decimal degrees:
exiftool -gpslatitude -gpslongitude -n TARGET_FILE.jpg

# Strip all metadata (before sharing files):
exiftool -all= TARGET_FILE.jpg

# Web-based analysis:
# Jeffrey's Exif Viewer: https://exif.regex.info/exif.cgi`}</Pre>

        <H3>Geolocation from Images</H3>
        <P>When GPS data is absent, images can still be geolocated using environmental clues. This is a complex skill that requires methodical analysis of multiple indicators.</P>
        <Pre label="// IMAGE GEOLOCATION METHODOLOGY">{`STEP 1: METADATA CHECK
  exiftool image.jpg | grep -i "gps\|location\|coordinate"

STEP 2: VISUAL CLUE ANALYSIS
  - Language on signs (narrows country/region)
  - Driving side (left vs right - narrows to ~50 countries)
  - License plate design and colour
  - Power line/electrical infrastructure style
  - Architecture: roof style, window design, building materials
  - Vegetation type: tropical, temperate, arid
  - Road markings and traffic signal design
  - Currency/brand logos on storefronts

STEP 3: SHADOW ANALYSIS (SunCalc)
  - Open https://www.suncalc.org
  - Shadows tell you the time of day AND compass direction
  - Combined with image metadata date, verify or disprove claimed time/location

STEP 4: GOOGLE STREET VIEW VERIFICATION
  - https://maps.google.com - drag yellow person icon to verify location
  - Historical Street View: clock icon shows images from multiple dates
  - Verify scene matches claimed time period

STEP 5: SATELLITE VERIFICATION
  - Google Earth (historical imagery from the slider)
  - https://www.sentinel-hub.com (Sentinel-2, free, recent)
  - https://www.planet.com (commercial, daily imagery)
  - Maxar Technologies (highest resolution commercial)

GEOLOCATION TOOLS:
  # GeoGuessr (training tool for visual geolocation)
  # https://geospy.ai (AI-assisted image geolocation)
  # Bellingcat geolocation guide: bellingcat.com/resources/`}</Pre>

        <H3>Satellite and Aerial Imagery OSINT</H3>
        <Pre label="// SATELLITE IMAGERY SOURCES">{`# Free sources:
# Google Earth Pro (free): decades of historical imagery
# https://earthengine.google.com - cloud-based analysis
# https://apps.sentinel-hub.com/eo-browser/ - Sentinel-2 (10m res, recent)
# https://www.nasa.gov/earth - NASA imagery
# https://earthexplorer.usgs.gov - USGS Landsat archive

# Commercial sources (high resolution):
# Maxar Technologies (30cm resolution, most recent)
# Planet Labs (daily global coverage, 3m resolution)
# Airbus Defence and Space

# Use cases:
# - Verify military equipment movements (Ukraine conflict)
# - Count vehicles in parking lots (retail activity)
# - Monitor construction progress at facilities
# - Verify attack damage claims in conflict zones
# - Locate hidden infrastructure

# Google Earth historical imagery workflow:
# 1. Open Google Earth Pro (free download)
# 2. Navigate to location
# 3. Click clock icon -> slide timeline
# 4. Compare imagery across years`}</Pre>

        <H3>Flight, Ship and Vehicle Tracking</H3>
        <Pre label="// TRANSPORT TRACKING OSINT">{`# Flight tracking:
# FlightAware (flightaware.com) - commercial and private jets
# FlightRadar24 (flightradar24.com) - real-time global flights
# ADS-B Exchange (adsbexchange.com) - UNFILTERED (includes military)
#   -> Most platforms remove military/government aircraft on request
#   -> ADS-B Exchange does NOT remove aircraft - most complete dataset

# Historical flight data:
# flightaware.com/live/flight/TAIL_NUMBER - last 3 months free
# FlightAware history for private jets reveals executive movements

# Ship tracking (AIS data):
# MarineTraffic (marinetraffic.com) - real-time vessel positions
# VesselFinder (vesselfinder.com) - alternative source
# AIS Hub (aishub.net) - raw AIS data feed
# Global Fishing Watch - fishing vessel monitoring

# Why ship OSINT matters:
# - Track sanctions-evading vessels
# - Monitor arms shipments
# - Verify cargo claims in insurance fraud cases

# Vehicle OSINT:
# License plate lookup (country-specific, varying legality):
# US: DMV records, RunIt, PlateReader API
# VIN lookup: https://www.vehiclehistory.com
# Google Street View for vehicle at addresses`}</Pre>

        <H3>Case Study: Strava Heatmap Military Base Exposure</H3>
        <P>In 2018, Strava published a global activity heatmap showing aggregated routes of all fitness tracker users. In remote areas with no civilians, bright lines revealed the jogging routes of military personnel - exposing undisclosed bases and patrol patterns in Syria, Afghanistan, and Africa. This demonstrates how seemingly innocuous public data becomes sensitive intelligence when aggregated.</P>
        <Note type="tip">
          The Strava case illustrates a fundamental OSINT principle: data that appears harmless in isolation becomes sensitive when aggregated. Fitness app routes, food delivery geotags, and photos with location metadata combine to create detailed movement profiles that individuals would never knowingly share.
        </Note>
      </div>
    ),
    takeaways: [
      'Yandex reverse image search uses facial recognition and is the most effective tool for identifying people from photographs.',
      'EXIF metadata in photos contains GPS coordinates, device model, and timestamp - most people share photos with this data intact.',
      'Shadow analysis using SunCalc can verify or disprove the claimed time and location of a photograph without GPS data.',
      'ADS-B Exchange is the only major flight tracker that does not remove military and government aircraft, making it uniquely valuable for sensitive investigations.',
      'The Strava heatmap case demonstrates that aggregating innocuous public data can reveal highly sensitive operational information.',
    ],
  },

  {
    id: 'ch07-maltego-link',
    title: 'Maltego & Link Analysis',
    difficulty: 'INTERMEDIATE',
    readTime: '18 min',
    content: (
      <div>
        <Note type="beginner">
          When you have dozens of data points from different OSINT sources - emails, IPs, domains, social profiles, phone numbers - the challenge is seeing how they connect. Maltego turns this data into a visual graph where each data point is a node and each discovered relationship is a line connecting them. You can literally see the network of connections around a target. Spiderfoot and Recon-ng do similar things but from the command line and with automation.
        </Note>

        <H3>Maltego Architecture</H3>
        <Table
          headers={['CONCEPT', 'DEFINITION', 'EXAMPLE']}
          rows={[
            ['Entity', 'A data point in the graph', 'Domain, IP address, email, person, organisation'],
            ['Transform', 'A query that expands an entity into related entities', 'Domain -> IP Addresses, Email -> Social Profile'],
            ['Graph', 'The visual map of all entities and their relationships', 'The full investigation canvas'],
            ['Machine', 'Automated sequence of transforms run against an entity', 'Full domain investigation machine'],
            ['Hub node', 'An entity with many connections - high value pivot point', 'An email address linked to 10 domains'],
            ['Transform Hub', 'Marketplace of transform sources and data providers', 'Shodan, VirusTotal, HIBP, FullContact'],
          ]}
        />

        <H3>Maltego CE vs Commercial</H3>
        <Pre label="// MALTEGO EDITIONS">{`MALTEGO CE (Community Edition):
  - Free, requires registration
  - 12 results per transform (limited pivot depth)
  - Most transforms available
  - Great for learning and small investigations
  - Download: https://www.maltego.com/downloads/

MALTEGO PRO/ENTERPRISE:
  - Unlimited transform results
  - Collaboration features
  - Custom entity types
  - API integration
  - Suitable for professional investigations

TRANSFORM HUB (available in both editions):
  - Shodan        -> IP/port/service data
  - VirusTotal    -> malware/reputation data
  - HaveIBeenPwned -> breach data
  - PassiveTotal  -> DNS/certificate/WHOIS history
  - FullContact   -> social profile data
  - Pipl          -> people search data
  - SocialLinks   -> social media intelligence
  - Recorded Future -> threat intelligence`}</Pre>

        <H3>Building Transform Chains</H3>
        <Pre label="// MALTEGO INVESTIGATION WORKFLOW">{`# Domain investigation chain:
Domain
  -> DNS Name [all subdomains discovered]
     -> IP Address [resolve each subdomain]
        -> ASN [organisation owning the IP]
        -> Open Ports [Shodan integration]
           -> Vulnerabilities [known CVEs for service]
  -> MX Record [email infrastructure]
     -> Email Address [harvested emails]
        -> Breach Data [HIBP check]
        -> Social Profile [FullContact lookup]
           -> Twitter, LinkedIn, Facebook profiles
  -> WHOIS Record
     -> Phone Number [registrant contact]
     -> Organisation [company entity]

# Person investigation chain:
Person
  -> Email Address [search email databases]
     -> Breach Data [HIBP, Dehashed]
     -> Social Profile [FullContact, Pipl]
  -> Username [from email prefix or known handle]
     -> Social Media Profile [Sherlock-equivalent transforms]
  -> Phone Number [if found]
     -> Social Profile [TrueCaller-equivalent]
     -> Address [carrier lookup]

# Key insight: Hub nodes
# An entity connecting to many others is a pivot point
# Example: email appearing in 5 domains AND 3 social profiles
# -> This is the identity anchor point of the target`}</Pre>

        <H3>Custom Transforms with Python TRX</H3>
        <Pre label="// CUSTOM MALTEGO TRANSFORM (PYTHON TRX)">{`pip install maltego-trx

# Basic transform structure:
from maltego_trx.entities import MaltegoEntity
from maltego_trx.maltego import UIM_TYPES
from maltego_trx.transform import DiscoverableTransform

class DomainToSubdomains(DiscoverableTransform):
    @classmethod
    def create_entities(cls, request, response):
        domain = request.Value
        # Your OSINT logic here (call subfinder, crt.sh, etc.)
        subdomains = run_subfinder(domain)
        for sub in subdomains:
            entity = response.addEntity('maltego.Domain', sub)
            entity.addProperty('fqdn', 'FQDN', 'loose', sub)

# Run local transform server:
# python3 project.py runserver -d`}</Pre>

        <H3>Spiderfoot: Automated OSINT</H3>
        <Pre label="// SPIDERFOOT SETUP AND USAGE">{`pip install spiderfoot

# Web UI mode (recommended for beginners):
python3 sf.py -l 127.0.0.1:5001
# Open http://127.0.0.1:5001 in browser
# New Scan -> enter target -> select modules -> run

# CLI mode:
python3 sf.py -s TARGET_DOMAIN -t INTERNET_NAME -m all -o json > results.json
python3 sf.py -s TARGET_EMAIL -t EMAILADDR -m sfp_haveibeenpwned,sfp_hunter -o json

# Module categories (200+ total):
# Footprint: DNS, WHOIS, SSL certs, subdomains, AS/BGP data
# Social: LinkedIn, Twitter, Instagram, Reddit
# Leaks: HaveIBeenPwned, Dehashed, paste sites
# Threat Intel: Shodan, Censys, VirusTotal, ThreatCrowd
# Dark Web: Tor services, dark web search engines

# Spiderfoot HX (commercial):
# Hosted version, additional data sources, collaboration`}</Pre>

        <H3>Recon-ng: Modular Framework</H3>
        <Pre label="// RECON-NG WORKFLOW">{`sudo apt install recon-ng
recon-ng

# Setup workspace:
[recon-ng] > workspaces create TARGET_COMPANY
[recon-ng] > workspaces load TARGET_COMPANY

# Install all marketplace modules:
[recon-ng] > marketplace install all

# Seed initial data:
[recon-ng] > db insert domains
domain (TEXT): TARGET_DOMAIN

# Key modules:
[recon-ng] > modules load recon/domains-hosts/brute_hosts
[recon-ng] > options set SOURCE TARGET_DOMAIN
[recon-ng] > run

[recon-ng] > modules load recon/domains-hosts/hackertarget
[recon-ng] > run

[recon-ng] > modules load recon/hosts-hosts/bing_ip
[recon-ng] > modules load recon/domains-contacts/whois_pocs

# View results:
[recon-ng] > show hosts
[recon-ng] > show contacts
[recon-ng] > show vulnerabilities

# Generate report:
[recon-ng] > modules load reporting/html
[recon-ng] > options set FILENAME /tmp/report.html
[recon-ng] > run`}</Pre>

        <H3>theHarvester</H3>
        <Pre label="// THEHARVESTER - EMAIL + SUBDOMAIN HARVEST">{`sudo apt install theharvester

# Harvest from all sources:
theHarvester -d TARGET_DOMAIN -b all

# Specific sources:
theHarvester -d TARGET_DOMAIN -b google
theHarvester -d TARGET_DOMAIN -b bing
theHarvester -d TARGET_DOMAIN -b linkedin
theHarvester -d TARGET_DOMAIN -b shodan
theHarvester -d TARGET_DOMAIN -b crtsh
theHarvester -d TARGET_DOMAIN -b dnsx

# Limit results:
theHarvester -d TARGET_DOMAIN -b google -l 200

# Save to HTML report:
theHarvester -d TARGET_DOMAIN -b all -f report

# Outputs:
# - Email addresses (often with name format)
# - Subdomains
# - IP addresses
# - Hosts
# - URLs`}</Pre>

        <H3>Building Automated OSINT Pipelines</H3>
        <Pre label="// PYTHON OSINT PIPELINE SKELETON">{`import subprocess, json, requests

def domain_pipeline(target):
    results = {}

    # 1. Subdomain enumeration
    subs = subprocess.run(
        ['subfinder', '-d', target, '-silent'],
        capture_output=True, text=True
    ).stdout.strip().split('\n')
    results['subdomains'] = subs

    # 2. DNS resolution
    resolved = subprocess.run(
        ['dnsx', '-silent', '-a', '-resp', '-l', '-'],
        input='\n'.join(subs),
        capture_output=True, text=True
    ).stdout.strip().split('\n')
    results['resolved'] = resolved

    # 3. Certificate transparency
    ct = requests.get(
        'https://crt.sh/?q=%.TARGET_DOMAIN&output=json'.replace('TARGET_DOMAIN', target)
    ).json()
    ct_names = list(set(r['name_value'] for r in ct))
    results['cert_transparency'] = ct_names

    # 4. WHOIS
    whois_raw = subprocess.run(
        ['whois', target], capture_output=True, text=True
    ).stdout
    results['whois'] = whois_raw

    return results`}</Pre>
      </div>
    ),
    takeaways: [
      'Maltego visualises the relationships between OSINT data points - hub nodes with many connections are the highest-value investigation targets.',
      'Custom Maltego transforms using Python TRX let you integrate any OSINT tool or API into the visual graph framework.',
      'Spiderfoot automates 200+ OSINT modules in a single scan - useful for comprehensive initial reconnaissance before deeper manual investigation.',
      'Recon-ng\'s workspace system keeps data organised by target and its module marketplace provides a wide range of automated collection techniques.',
      'Building Python OSINT pipelines that chain subfinder, dnsx, and API queries produces consistent, repeatable, automated reconnaissance.',
    ],
  },

  {
    id: 'ch08-dark-web-breach',
    title: 'Dark Web & Breach Data OSINT',
    difficulty: 'ADVANCED',
    readTime: '20 min',
    content: (
      <div>
        <Note type="warn">
          Dark web access for legitimate OSINT requires strict OPSEC. Use the Tor Browser configured for maximum security, never from your personal computer or IP address. Never download files from dark web sources without sandboxed analysis environments. This chapter covers intelligence gathering and monitoring techniques for security professionals, journalists, and researchers - not participation in criminal activity.
        </Note>

        <H3>Dark Web Search Engines</H3>
        <P>The dark web lacks a single comprehensive search engine. Effective coverage requires using multiple search engines and knowing their respective strengths and coverage areas.</P>
        <Pre label="// DARK WEB SEARCH ENGINES">{`# Access these via Tor Browser only:

Ahmia (ahmia.fi) - also accessible on clearnet
  -> Filters out abusive content, good starting point
  -> Indexes .onion sites, search by keyword

Torch (historical, various .onion addresses)
  -> Oldest dark web search engine
  -> No filtering, raw results

Haystak (haystak5njsmn2hqkewecpaxetahtwhsbsa64jom2k22z5afxhnpxfid.onion)
  -> Large index, premium features for registered users

DarkSearch (darksearch.io - also on clearnet)
  -> API available for automated searching
  -> curl "https://darksearch.io/api/search?query=SEARCH_TERM&page=1"

# Finding .onion addresses:
dark.fail - curated list of verified .onion sites
# Lists forums, markets, resources with uptime monitoring

# OnionScan - scan .onion services for vulnerabilities:
go get github.com/s-rah/onionscan
./onionscan TARGET_ONION_ADDRESS`}</Pre>

        <H3>Breach Data Sources</H3>
        <Pre label="// BREACH DATABASE INTELLIGENCE">{`# Tier 1: Legitimate monitoring services
HaveIBeenPwned (haveibeenpwned.com)
  - 14 billion+ accounts from known breaches
  - Free API for single email checks
  - Notification service for future breaches
  - Domain search for organisations (paid)

Intelligence X (intelx.io)
  - Indexes paste sites, dark web, public leaks
  - Email, domain, phone search
  - Freemium with paid tiers for more results
  - API available

# Tier 2: Commercial breach intelligence
Dehashed (dehashed.com)
  - Search by email, username, IP, hash, name, address, phone
  - Shows plaintext or hashed passwords from breach data
  - Paid subscription, API available

Snusbase (snusbase.com)
  - Similar to Dehashed
  - Large breach database

Hudson Rock Cavalier (cavalier.hudsonrock.com)
  - Infostealer malware logs
  - Compromised credentials from Redline, Vidar, Raccoon stealers
  - Corporate access credentials sold on dark web markets

# Tier 3: Dark web forums (accessed via Tor, monitoring only)
BreachForums (current successor forums - addresses change)
  - Where breaches are first announced and sold
  - Monitor for mentions of your organisation's name
  - Do not download or purchase breach data`}</Pre>

        <H3>Dehashed API for Automated Lookup</H3>
        <Pre label="// DEHASHED API USAGE">{`# Authentication: Basic auth with email:api_key base64 encoded

# Single email lookup:
curl "https://api.dehashed.com/search?query=email:TARGET_EMAIL&size=100" \
  -H "Authorization: Basic BASE64_OF_EMAIL_COLON_API_KEY" \
  -H "Accept: application/json"

# Domain search (finds all emails for a domain):
curl "https://api.dehashed.com/search?query=email:@TARGET_DOMAIN&size=100" \
  -H "Authorization: Basic BASE64_AUTH"

# Username search:
curl "https://api.dehashed.com/search?query=username:TARGET_USERNAME" \
  -H "Authorization: Basic BASE64_AUTH"

# Response includes: email, username, password (hash or plaintext), name, address
# Use findings for:
# - Breach notification and remediation
# - Understanding credential exposure scope
# - Threat intelligence for defensive purposes`}</Pre>

        <H3>Infostealer Log Intelligence</H3>
        <P>Infostealer malware (Redline, Vidar, Raccoon, Aurora) silently harvests credentials, session cookies, browser saved passwords, and system information from infected machines. The logs are sold in bulk on dark web markets and provide extraordinarily detailed access to compromised systems.</P>
        <Pre label="// INFOSTEALER LOG ANALYSIS">{`# What infostealer logs contain:
# - All browser saved passwords (Chrome, Firefox, Edge)
# - All session cookies (can replay sessions without password)
# - Credit card numbers saved in browsers
# - Cryptocurrency wallet files
# - Screenshots taken at time of infection
# - System information (OS, hardware, installed software)
# - VPN configuration files
# - Gaming client credentials
# - Browsing history
# - Autofill data

# Hudson Rock Cavalier:
# https://cavalier.hudsonrock.com
# Search by domain: finds employees infected by infostealers
# Shows which corporate logins were compromised

# Why this matters for defenders:
# - Infected employees may have valid corporate session cookies
# - Attackers with cookie data bypass 2FA
# - Understand scope before attackers exploit access

# Monitoring for your organisation:
# Hudson Rock, Flare.io, Recorded Future, DarkOwl
# All offer corporate exposure monitoring services`}</Pre>

        <H3>Paste Site Monitoring</H3>
        <Pre label="// AUTOMATED PASTE MONITORING">{`# Paste sites to monitor:
# pastebin.com - most common
# paste.ee - alternative
# privatebin.net - encrypted pastes (harder to monitor)
# hastebin.com - developer-focused
# GitHub Gists - indexed by Google, very common for leaks

# Pastehunter - open source monitoring tool:
git clone https://github.com/kevthehermit/PastHunter
cd PastHunter
pip install -r requirements.txt
# Configure config.yaml with your keywords:
# keywords: ["TARGET_DOMAIN", "TARGET_EMAIL", "@TARGET_COMPANY"]
python3 pastehunter.py

# Google monitoring (manual):
site:pastebin.com "TARGET_DOMAIN"
site:pastebin.com "@TARGET_EMAIL_DOMAIN"
site:pastebin.com "TARGET_COMPANY" "password"
site:github.com/gist "TARGET_DOMAIN" "password"

# Dumpmon (Twitter-based paste monitoring):
# Historical: @dumpmon Twitter bot posted paste highlights

# CIRCL AIL (Analysis Information Leak framework):
# Full open-source paste monitoring and analysis platform
# https://github.com/ail-project/ail-framework`}</Pre>

        <H3>Telegram Breach Data Channels</H3>
        <Pre label="// TELEGRAM BREACH MONITORING">{`# Many breach data dumps first appear on Telegram before dark web forums
# Public Telegram channels post:
# - Combolists (email:password pairs)
# - Database dumps from hacked sites
# - Infostealer log shares
# - Doxing information

# Monitoring methodology:
# 1. Create research Telegram account (sock puppet)
# 2. Join public channels related to leaks (search "leaks", "combolist")
# 3. Configure keyword alerts for your organisation
# 4. Monitor without engaging (passive collection only)

# Telegram search tools:
# https://tgstat.com - channel analytics and search
# https://telemetrio.com - message search across channels

# Processing combolists responsibly:
# If you find your organisation's credentials:
# 1. Document the source, date, and scope
# 2. Do NOT use or redistribute the credentials
# 3. Reset affected accounts immediately
# 4. Notify affected users
# 5. Review for active session compromise`}</Pre>
      </div>
    ),
    takeaways: [
      'Dark web OSINT for investigators must always use Tor Browser from a dedicated research VM - never from a personal machine or IP.',
      'Infostealer logs sold on dark web markets contain session cookies that bypass 2FA - understanding this threat is critical for corporate defenders.',
      'Paste sites are often the first place breach data appears - automated monitoring with Pastehunter or manual Google dorks provides early warning.',
      'Dehashed and Intelligence X provide searchable access to billions of breach records - valuable for threat intelligence and breach scope assessment.',
      'Telegram has largely replaced dark web forums for initial breach data distribution - monitoring public leak channels is now essential for threat intelligence.',
    ],
  },

  {
    id: 'ch09-metadata-docs',
    title: 'Metadata & Document Analysis',
    difficulty: 'INTERMEDIATE',
    readTime: '16 min',
    content: (
      <div>
        <Note type="beginner">
          Every file you create with software carries invisible background data. A Word document stores the author's real username (their Windows login name), their company name, sometimes the internal server path where templates are stored, and a full revision history. A photo from a smartphone stores exact GPS coordinates. This invisible data travels with the file when shared, and most people have no idea it exists. For investigators, a single publicly downloadable PDF can reveal internal usernames, server paths, and office locations.
        </Note>

        <H3>ExifTool: Complete Reference</H3>
        <Pre label="// EXIFTOOL COMMAND REFERENCE">{`sudo apt install libimage-exiftool-perl

# Basic extraction:
exiftool FILE.jpg          # Image metadata
exiftool FILE.pdf          # PDF metadata
exiftool FILE.docx         # Office document metadata
exiftool FILE.mp4          # Video metadata
exiftool FILE.mp3          # Audio metadata

# Recursive (entire directory tree):
exiftool -r /FOLDER/

# Export to CSV (good for bulk analysis):
exiftool -csv *.pdf > pdf_metadata.csv
exiftool -csv -r /FOLDER/ > all_metadata.csv

# Extract specific fields only:
exiftool -Author -Creator -LastModifiedBy FILE.docx
exiftool -GPSLatitude -GPSLongitude -n FILE.jpg
exiftool -CreateDate -ModifyDate FILE.pdf

# Verbose output (shows raw tag names):
exiftool -v FILE.jpg

# Write/modify metadata (for sanitisation testing):
exiftool -Author="New Name" FILE.docx
exiftool -all= FILE.jpg    # Strip ALL metadata`}</Pre>

        <H3>Office Document Metadata Forensics</H3>
        <P>Microsoft Office documents (docx, xlsx, pptx) are ZIP archives. Inside are XML files containing metadata. ExifTool reads these, but understanding what to look for is the skill.</P>
        <Pre label="// OFFICE DOCUMENT INTELLIGENCE">{`# Key fields in Office documents:
# Author           -> original creator's Windows username
# Last Modified By -> most recent editor's username
# Company          -> org name from Office settings
# Template         -> internal network path to template file
#                    e.g.: \\\\fileserver01\\templates\\report.dotm
# Revision Number  -> how many times saved (tracks editing)
# Total Edit Time  -> total minutes spent editing
# Application      -> version of Office used
# Content Status   -> e.g., "Draft", "Final"

# Real-world finds:
# Template: \\\\CORP-FS01\\HR\\Templates\\employment_template.dotx
# -> reveals hostname of internal file server

# Author: jsmith
# Last Modified By: a.jones
# -> reveals two internal usernames

# Company: Acme Corp Ltd
# -> confirms or reveals org identity

# Extracting from bulk downloads:
# 1. Dork: site:TARGET_DOMAIN filetype:docx OR filetype:pdf
# 2. wget -r -A docx,pdf -l 2 https://TARGET_DOMAIN/
# 3. exiftool -csv -r *.docx *.pdf > metadata.csv
# 4. grep -i "author\|modified\|company\|template" metadata.csv

# Unzip and inspect XML directly:
unzip -o TARGET_FILE.docx -d docx_extracted/
cat docx_extracted/docProps/core.xml
cat docx_extracted/docProps/app.xml`}</Pre>

        <H3>PDF Analysis</H3>
        <Pre label="// PDF METADATA AND CONTENT ANALYSIS">{`# Basic PDF info:
pdfinfo TARGET_FILE.pdf
# Shows: Title, Subject, Author, Creator, Producer, CreationDate, ModDate

# Creator = application used to create original doc (e.g., Microsoft Word 16.0)
# Producer = PDF converter (e.g., Adobe PDF Library, Mac OS X PDF)

# ExifTool for PDF:
exiftool TARGET_FILE.pdf
# Additional fields: XMP metadata, page count, permissions

# pdfextract - extract embedded resources:
# gem install pdf-reader pdfextract
pdfextract TARGET_FILE.pdf

# peepdf - PDF analysis tool (finds JS, embedded objects):
pip install peepdf
peepdf TARGET_FILE.pdf
# Useful for malicious PDF analysis

# Extract text from PDF:
pdftotext TARGET_FILE.pdf -

# Find embedded URLs in PDF:
python3 -c "
import fitz  # pip install pymupdf
doc = fitz.open('TARGET_FILE.pdf')
for page in doc:
    links = page.get_links()
    for link in links:
        if 'uri' in link:
            print(link['uri'])
"`}</Pre>

        <H3>metagoofil and FOCA</H3>
        <Pre label="// AUTOMATED METADATA EXTRACTION">{`# metagoofil - automated public document harvesting + metadata:
sudo apt install metagoofil

# Harvest documents from a domain and extract metadata:
metagoofil -d TARGET_DOMAIN -t pdf,doc,docx,xls,xlsx,ppt,pptx -l 50 -o output_dir

# Output:
# - Lists all discovered documents
# - Extracts usernames from metadata
# - Extracts software versions
# - Extracts server paths from templates

# FOCA (Fingerprinting Organisations with Collected Archives):
# Windows-only GUI tool
# Download: https://www.elevenpaths.com/labstools/foca/
# Automates: Google/Bing search, download, metadata extraction, analysis
# Excels at: mapping internal usernames from bulk document metadata

# Manual bulk analysis workflow:
# 1. Site crawl: wget --spider -r https://TARGET_DOMAIN/ 2>&1 | grep "\.pdf\|\.docx"
# 2. Download: wget -r -A pdf,doc,docx,xls -l 2 https://TARGET_DOMAIN/
# 3. Extract: exiftool -csv -r . > metadata.csv
# 4. Analyse: sort + unique count of Author field
sort -t, -k2 metadata.csv | uniq -c | sort -rn`}</Pre>

        <H3>Video, Audio and Binary Metadata</H3>
        <Pre label="// MULTIMEDIA METADATA ANALYSIS">{`# Video metadata (ffprobe):
ffprobe -v quiet -print_format json -show_format TARGET_VIDEO.mp4
# Shows: Duration, encoder, creation_time, GPS (some cameras), camera model

# mediainfo - comprehensive multimedia analysis:
sudo apt install mediainfo
mediainfo TARGET_VIDEO.mp4
# Shows: codec details, recording device, GPS coordinates if present

# Audio metadata (ID3 tags):
exiftool TARGET_AUDIO.mp3
# Shows: Artist, Album, Year, Comment, Recording software (Adobe Audition, GarageBand)
# Recording software fingerprinting can identify content creator's platform

# Binary strings extraction:
strings TARGET_BINARY | less
strings -n 8 TARGET_BINARY | grep -i "password\|key\|secret\|api\|token"

# FLOSS (FireEye FLOSS) - deobfuscates strings in malware:
pip install flare-floss
floss TARGET_BINARY

# PNG tEXt chunks (hidden metadata in PNG):
python3 -c "
from PIL import Image
img = Image.open('TARGET_FILE.png')
print(img.info)  # Shows all metadata chunks
"

# JPEG comments:
exiftool -Comment TARGET_FILE.jpg
exiv2 -pa TARGET_FILE.jpg | grep Comment`}</Pre>

        <H3>Microsoft Office Telemetry Leakage</H3>
        <Note type="info">
          Microsoft Office embeds telemetry data in documents including the Revision Save ID (a unique GUID that can track document history), the user's SID (security identifier, unique per Windows user), and sometimes network printer paths that reveal internal network structure. These are extractable from the raw XML within any docx/xlsx file and can be used to correlate documents to specific machines and users.
        </Note>
        <Pre label="// OFFICE XML FORENSICS">{`# All docx/xlsx/pptx files are ZIP archives
# Inspect XML directly:
mkdir extracted && cp TARGET_FILE.docx extracted/TARGET_FILE.zip
cd extracted && unzip TARGET_FILE.zip

# docProps/core.xml  -> title, author, modified date, revision
# docProps/app.xml   -> application version, company, document stats
# word/settings.xml  -> mail merge data sources, printer paths, template paths
# word/document.xml  -> full document content including tracked changes

# Find revision save ID (tracks document lineage):
grep -r "rsidRoot\|rsidR" extracted/ | head -5

# Find printer paths (reveals internal hostnames):
grep -r "printer\|\\\\\\\\\\\\\\\\server" extracted/ | grep -i "print"

# Find template paths (reveals internal file servers):
grep -r "Template\|AttachedTemplate" extracted/`}</Pre>
      </div>
    ),
    takeaways: [
      'Office document templates embed internal server UNC paths - a single downloaded PDF can reveal internal hostnames like \\\\CORP-SERVER01\\Templates.',
      'ExifTool extracts metadata from virtually every file format - always run it on files found during OSINT before deeper analysis.',
      'metagoofil automates bulk document download and metadata extraction from a target domain - extracting a list of internal usernames from public documents.',
      'Video files from cameras and phones often contain GPS coordinates in their metadata, just like photos.',
      'Microsoft Office documents are ZIP archives - unzipping them exposes raw XML containing telemetry, tracked changes, comments, and embedded data sources.',
    ],
  },

  {
    id: 'ch10-opsec-legal',
    title: 'Investigator OPSEC & Legal Considerations',
    difficulty: 'ADVANCED',
    readTime: '18 min',
    content: (
      <div>
        <Note type="beginner">
          OPSEC for investigators means protecting your identity and your investigation while conducting research. Every action you take online leaves traces - your IP address, your browser fingerprint, your search queries, your profile views. A professional investigator builds a layered system of protections that separates research activities from personal identity and prevents the target from detecting that they are being investigated.
        </Note>

        <H3>Virtual Machine Setup for OSINT</H3>
        <P>A dedicated, isolated virtual machine is non-negotiable for professional OSINT investigations. It prevents accidental data contamination between investigations and provides a clean slate after each operation.</P>
        <Pre label="// OSINT VM OPTIONS">{`# Option 1: TraceLabs OSINT VM (purpose-built for OSINT)
# Download: https://www.tracelabs.org/initiatives/osint-vm
# Based on Kali Linux, pre-installed OSINT tools:
# - Maltego CE, Recon-ng, theHarvester, Sherlock
# - Spiderfoot, Osintgram, ExifTool, metagoofil

# Option 2: Whonix (strong anonymity)
# Download: https://www.whonix.org
# Two-VM architecture:
# - Whonix-Gateway: all traffic forced through Tor
# - Whonix-Workstation: completely isolated, cannot access internet directly
# Best for investigations requiring strong anonymity

# Option 3: Tails OS (amnesic)
# Download: https://tails.boum.org
# Runs from USB, leaves zero traces on host machine
# All traffic through Tor, RAM-only (no disk persistence)
# Best for investigations where leaving no trace on hardware is critical

# VM workflow per investigation:
# 1. Create fresh VM (or revert to clean snapshot)
# 2. Connect VPN before starting VM networking
# 3. Conduct investigation
# 4. Export findings/notes to encrypted external storage
# 5. Revert VM to clean snapshot
# 6. Never reuse the same VM state for different targets`}</Pre>

        <H3>Browser Fingerprinting Defences</H3>
        <P>Your browser leaks a unique fingerprint even without cookies - screen resolution, installed fonts, timezone, canvas rendering, WebGL signature, and hardware identifiers combine to identify you across sites.</P>
        <Pre label="// BROWSER HARDENING">{`# Firefox hardening (about:config):
privacy.resistFingerprinting = true
geo.enabled = false
media.navigator.enabled = false
network.http.sendRefererHeader = 0
webgl.disabled = true

# Essential Firefox extensions:
# uBlock Origin - ad/tracker blocking
# CanvasBlocker - blocks canvas fingerprinting
# Firefox Multi-Account Containers - isolate by target

# Test your fingerprint:
# https://coveryourtracks.eff.org
# https://browserleaks.com
# https://fingerprintjs.com/demo

# Brave Browser:
# Built-in fingerprinting protection
# Randomises canvas, WebGL, audio fingerprinting per session
# Good alternative to hardened Firefox

# Tor Browser:
# Maximum fingerprint resistance
# All users appear identical (same window size, fonts, timezone)
# Use for target website visits during active investigations`}</Pre>

        <H3>VPN Selection for Investigators</H3>
        <Table
          headers={['PROVIDER', 'JURISDICTION', 'PAYMENT OPTIONS', 'NOTES']}
          rows={[
            ['Mullvad', 'Sweden', 'Cash, Monero, crypto - no account email needed', 'Best privacy: account number only, no personal data'],
            ['ProtonVPN', 'Switzerland', 'Credit card, PayPal, Bitcoin', 'Strong privacy policy, open source clients'],
            ['IVPN', 'Gibraltar', 'Cash, Monero, crypto', 'Privacy-focused, audited, no logs verified'],
            ['ExpressVPN', 'British Virgin Islands', 'Card, crypto', 'Good speeds, audited but owned by Kape Technologies'],
            ['NordVPN', 'Panama', 'Card, crypto', 'Popular but owned by Tesonet - use with awareness'],
          ]}
        />
        <Note type="warn">
          Never use free VPNs for investigative work. Free VPN services monetise through logging and selling your traffic data. Some free VPN providers have been caught injecting ads, selling browsing data, or cooperating with law enforcement despite no-log claims. Paid, privacy-focused VPNs with independent audits are the only acceptable choice for sensitive investigations.
        </Note>

        <H3>Tor and VPN - Which Order?</H3>
        <Pre label="// TOR + VPN CONFIGURATION OPTIONS">{`# Option A: VPN -> Tor (most common, recommended)
# Your traffic: You -> VPN -> Tor Network -> Target
# Advantages:
# - VPN hides Tor usage from your ISP
# - VPN provider sees only that you use Tor, not which sites
# - If Tor is blocked at ISP level, VPN bypasses the block
# Disadvantages:
# - VPN provider knows your real IP (choose carefully)

# Option B: Tor -> VPN
# Your traffic: You -> Tor -> VPN -> Target
# Advantages:
# - VPN provider sees exit node IP, not your real IP
# - Target sees VPN IP, not Tor exit node (bypasses Tor blocks)
# Disadvantages:
# - Requires VPN that accepts Tor connections (AirVPN supports this)
# - Tor still routes all traffic (speed penalty)

# Using torsocks for CLI:
torsocks curl https://TARGET_SITE/
torsocks wget https://TARGET_SITE/file.pdf
torsocks python3 osint_script.py

# Check your Tor exit IP:
torsocks curl https://check.torproject.org/api/ip`}</Pre>

        <H3>Sock Puppet Lifecycle Management</H3>
        <Pre label="// SOCK PUPPET OPERATIONAL LIFECYCLE">{`PHASE 1: CREATION (from VPN/Tor, never personal IP)
  - Email: ProtonMail or Tutanota, no real info
  - Phone for 2FA: prepaid SIM, MySudo, or Google Voice
  - Profile photo: thispersondoesnotexist.com (AI-generated)
  - Bio: consistent with persona age, location, interests

PHASE 2: AGING (minimum 30 days, ideally 60-90 days)
  - Post 2-5 times per week on natural topics
  - Follow public figures, brands, news accounts
  - Like and comment on others' posts
  - Build realistic follower/following ratio (40-60% ratio)
  - Join communities relevant to persona
  - DO NOT follow security researchers or OSINT accounts

PHASE 3: DEPLOYMENT (investigation phase)
  - Access only from VPN/Tor
  - Only one active persona per browser profile
  - Clear cookies and cache between sessions
  - Access target profiles only when necessary
  - Screenshot evidence, do not save to personal devices

PHASE 4: RETIREMENT
  - Stop posting after investigation closes
  - Do not immediately delete (deletion looks suspicious)
  - Leave dormant for 3-6 months
  - Delete via Tor connection

CRITICAL ERRORS TO AVOID:
  - Accessing sock puppet from personal IP even once
  - Cross-posting content between persona and personal accounts
  - Following or interacting with your real accounts
  - Using same device for persona and personal access`}</Pre>

        <H3>Legal Framework by Jurisdiction</H3>
        <Table
          headers={['LAW', 'JURISDICTION', 'KEY PROVISIONS', 'OSINT RELEVANCE']}
          rows={[
            ['Computer Fraud and Abuse Act (CFAA)', 'United States', 'Prohibits unauthorised computer access, exceeding authorised access', 'Active scanning without permission = potential violation'],
            ['Computer Misuse Act 1990', 'United Kingdom', 'S.1 unauthorised access (2yr), S.3 impairment (10yr)', 'Applies to UK-connected systems from anywhere in the world'],
            ['GDPR Article 6', 'European Union', 'Lawful basis required for personal data collection', 'Collecting and storing EU personal data has strict requirements'],
            ['GDPR Article 17', 'European Union', 'Right to erasure ("right to be forgotten")', 'Even OSINT-collected data may be subject to erasure requests'],
            ['NIS Directive', 'European Union', 'Security requirements for operators of essential services', 'Relevant for critical infrastructure OSINT'],
          ]}
        />

        <H3>Ethical Lines and Professional Responsibilities</H3>
        <Pre label="// ETHICAL FRAMEWORK FOR OSINT INVESTIGATORS">{`LEGITIMATE OSINT USE CASES:
  - Authorised penetration testing pre-engagement reconnaissance
  - Threat intelligence for defensive security
  - Due diligence and background checks (with subject consent where required)
  - Journalism (public interest standard applies)
  - Law enforcement with appropriate authority
  - Missing persons investigations
  - Brand monitoring and executive protection

GREY AREAS (seek legal advice):
  - Investigating private individuals without clear public interest
  - Using breach data for any purpose
  - Deep profiling of individuals beyond investigation scope
  - Cross-border investigations where laws conflict

CLEAR VIOLATIONS:
  - Stalking or harassment (collecting data to intimidate)
  - Doxing (publishing personal data to incite harassment)
  - Purchasing stolen data (even for "research")
  - Active scanning without authorisation
  - Impersonating law enforcement to obtain data

RESPONSIBLE DISCLOSURE:
  - If you find exposed credentials, notify the organisation
  - Do not exploit or test credentials you find
  - If you find evidence of a serious crime, consult legal counsel
  - Document your methodology to demonstrate good faith

DEFENSIVE OSINT APPLICATIONS:
  - Brand monitoring: what is being said about your organisation?
  - Executive protection: monitor public exposure of C-suite
  - Threat intelligence: track threat actor TTPs in your sector
  - Attack surface management: find your own exposed assets`}</Pre>

        <H3>Counter-OSINT: Avoiding Traces While Investigating</H3>
        <Pre label="// COUNTER-DETECTION CHECKLIST">{`BEFORE INVESTIGATION:
  [ ] VM reverted to clean snapshot
  [ ] VPN connected and verified (check IP with ipinfo.io)
  [ ] Tor Browser opened AFTER VPN is confirmed active
  [ ] Research browser profile is empty (no cookies, history)
  [ ] Sock puppet accounts ready if social media access needed
  [ ] LinkedIn set to anonymous browsing (Settings -> Visibility)

DURING INVESTIGATION:
  [ ] Never open target website from personal browser
  [ ] Disable auto-loading of images in email client
  [ ] Do not right-click/save images from target sites (referrer header)
  [ ] Use archive.org cached versions instead of live pages where possible
  [ ] Screenshot instead of download where possible
  [ ] Avoid downloading files to research VM (malware risk)
  [ ] Do not log into any personal accounts in research browser

AFTER INVESTIGATION:
  [ ] Export encrypted notes before reverting VM
  [ ] Revert VM snapshot
  [ ] Disconnect VPN
  [ ] Clear any browser history on host machine
  [ ] Secure storage of findings (encrypted drive or vault)`}</Pre>
      </div>
    ),
    takeaways: [
      'TraceLabs OSINT VM and Whonix provide purpose-built isolated environments for investigations - always use a dedicated, reverted VM per target.',
      'Browser fingerprinting bypasses cookies - use Firefox with resistFingerprinting enabled, CanvasBlocker, and separate containers per target.',
      'VPN before Tor is the standard configuration - it hides Tor usage from your ISP while still providing Tor anonymity for target interactions.',
      'GDPR creates obligations even for OSINT investigators - collecting and storing EU personal data requires a lawful basis and data minimisation.',
      'The ethical boundary for OSINT is proportionality and purpose - legitimate security research and journalism are protected, stalking and doxing are not.',
    ],
  },
]

export default function OSINTModule() {
  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: mono, fontSize: '0.7rem', color: '#5a7a5a' }}>
        <Link href="/" style={{ color: '#5a7a5a', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>&#8250;</span>
        <span style={{ color: accent }}>MOD-02 // OSINT &amp; SURVEILLANCE</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <span style={{ padding: '3px 10px', background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.3)', borderRadius: '3px', color: accent, fontSize: '8px', letterSpacing: '0.15em' }}>CONCEPT</span>
          <Link href="/modules/osint/lab" style={{ textDecoration: 'none', padding: '3px 10px', background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.5)', borderRadius: '3px', color: accent, fontSize: '8px', letterSpacing: '0.15em', fontWeight: 700 }}>LAB &#8594;</Link>
        </div>
      </div>

      {/* Page header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <span style={{ fontFamily: mono, fontSize: '9px', letterSpacing: '0.2em', color: '#1a6a8a', textTransform: 'uppercase' as const }}>MODULE 02 &middot; CONCEPT PAGE</span>
        <h1 style={{ fontFamily: mono, fontSize: '2rem', fontWeight: 700, color: accent, margin: '0.5rem 0', lineHeight: 1.1, textShadow: '0 0 20px rgba(0,212,255,0.4)' }}>
          OSINT &amp; SURVEILLANCE
        </h1>
        <p style={{ color: '#1a6a8a', fontFamily: mono, fontSize: '0.75rem', lineHeight: 1.6 }}>
          Intelligence cycle &middot; Domain recon &middot; Shodan &middot; Google dorking &middot; SOCMINT &middot; Geospatial &middot; Maltego &middot; Dark web &middot; Metadata &middot; Investigator OPSEC
        </p>
      </div>

      {/* Chapter overview stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '2.5rem' }}>
        {[
          ['10', 'CHAPTERS'],
          ['50', 'TAKEAWAYS'],
          ['~3.2hr', 'TOTAL READ'],
          ['MOD-02', 'IDENTIFIER'],
        ].map(([val, label], i) => (
          <div key={i} style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.15)', borderRadius: '6px', padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontFamily: mono, fontSize: '1.2rem', fontWeight: 700, color: accent }}>{val}</div>
            <div style={{ fontFamily: mono, fontSize: '0.6rem', color: '#1a6a8a', letterSpacing: '0.15em', marginTop: '2px' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* ModuleCodex component */}
      <ModuleCodex moduleId="osint" accent={accent} chapters={chapters} />

      {/* Bottom navigation */}
      <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid #0a2030' }}>
        <div style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: '8px', padding: '2rem', textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontFamily: mono, fontSize: '0.65rem', color: '#1a4a5a', letterSpacing: '0.25em', marginBottom: '0.5rem' }}>READY TO PRACTICE?</div>
          <div style={{ fontFamily: mono, fontSize: '1rem', color: accent, marginBottom: '0.5rem', fontWeight: 600 }}>MOD-02 Interactive Lab</div>
          <div style={{ fontFamily: mono, fontSize: '0.75rem', color: '#1a6a8a', marginBottom: '1.5rem' }}>5 steps &middot; 130 XP &middot; Real commands &middot; Flag captures</div>
          <Link href="/modules/osint/lab" style={{ textDecoration: 'none', fontFamily: mono, fontSize: '0.85rem', color: accent, padding: '12px 32px', border: '1px solid rgba(0,212,255,0.6)', borderRadius: '6px', background: 'rgba(0,212,255,0.1)', fontWeight: 700, letterSpacing: '0.12em', boxShadow: '0 0 20px rgba(0,212,255,0.15)', display: 'inline-block' }}>
            LAUNCH LAB &#8594;
          </Link>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Link href="/modules/tor" style={{ textDecoration: 'none', fontFamily: mono, fontSize: '0.75rem', color: '#1a6a8a' }}>&#8592; MOD-01: TOR</Link>
          <Link href="/modules/crypto" style={{ textDecoration: 'none', fontFamily: mono, fontSize: '0.75rem', color: '#1a6a8a' }}>MOD-03: CRYPTOGRAPHY &#8594;</Link>
        </div>
      </div>
    </div>
  )
}
