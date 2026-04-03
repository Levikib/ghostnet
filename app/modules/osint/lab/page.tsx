'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import LabTerminal, { LabStep } from '../../../components/LabTerminal'
import FreeLabTerminal from '../../../components/FreeLabTerminal'

const accent = '#00d4ff'
const moduleId = 'osint'
const moduleName = 'OSINT Reconnaissance'
const moduleNum = '02'

const steps: LabStep[] = [

  // ── SECTION 1: Passive Footprinting ──────────────────────────────────────
  {
    id: 'osint-01',
    title: 'WHOIS — Reading the Registration Record',
    objective: `You are beginning reconnaissance on a target organisation. Your first passive step is looking up domain registration data without touching the target's servers at all.

Run a WHOIS lookup on example.com. What command do you use, and what field in the output reveals the date the domain was first registered?`,
    hint: 'The command is "whois" followed by the domain. The date field contains the word "Creation".',
    answers: ['whois', 'whois example.com', 'creation date', 'created', 'whois creation date'],
    xp: 15,
    explanation: `whois example.com queries the domain registry for registration data. Key fields to read:

  Registrar:           Who manages the domain (GoDaddy, Namecheap, etc.)
  Creation Date:       When the domain was first registered — old domains are harder to spoof
  Updated Date:        Recent update may mean new ownership or infrastructure change
  Expiry Date:         Domains near expiry are sometimes hijacked (domain squatting)
  Registrant:          Owner details — often privacy-protected but sometimes real names/emails
  Name Servers:        Which DNS infrastructure they use (AWS Route53, Cloudflare, etc.)
  Status:              clientTransferProhibited = normal; clientHold = suspended

What WHOIS reveals about attack surface:
  • Privacy service? (PrivacyGuard, WhoisGuard) — org wants to hide ownership
  • Small registrar? — may have weaker account security for hijacking
  • Name servers on AWS Route53? — org is likely cloud-native
  • Multiple domains registered same day? — may be a phishing campaign infrastructure
  • Registrant email not privacy-protected? — direct contact point for social engineering

Tools that go further:
  whois -h whois.arin.net IP_ADDRESS    — IP block ownership
  amass intel -whois -d example.com     — recursive WHOIS on discovered domains
  DomainTools, SecurityTrails           — historical WHOIS data (paid)`
  },
  {
    id: 'osint-02',
    title: 'DNS Record Anatomy — Every Record Type',
    objective: `DNS holds far more than just IP addresses. A thorough recon pulls every record type because each one reveals something different about the organisation's infrastructure.

What dig command retrieves ALL DNS record types for a domain at once?`,
    hint: 'Use "dig" with the record type "ANY". Syntax: dig example.com ANY',
    answers: ['dig example.com any', 'dig any', 'dig example.com ANY', 'dig +noall +answer example.com ANY'],
    xp: 20,
    explanation: `dig example.com ANY retrieves all available record types. Here is what each record type reveals:

  A      → IPv4 address of the domain — the primary web server IP
  AAAA   → IPv6 address — confirms modern infrastructure
  MX     → Mail servers — reveals if they use Google Workspace, O365, ProofPoint, Mimecast
  NS     → Authoritative name servers — who controls DNS (Cloudflare = CDN, Route53 = AWS)
  TXT    → Treasure trove: SPF policy, DKIM public keys, DMARC policy, domain verification
           tokens for Google/AWS/Atlassian that reveal what services they use
  CNAME  → Canonical name — maps subdomains to other domains, reveals SaaS usage
           (mail.corp.com → aspmx.l.google.com confirms Google Workspace)
  SOA    → Start of Authority — serial number, primary NS, admin email (sometimes real)
  SRV    → Service records — reveals internal services: _ldap._tcp, _kerberos._tcp
           confirms Active Directory domain structure
  CAA    → Certificate Authority Authorization — which CAs can issue certs for this domain

Intelligence you can infer:
  MX → Google = Google Workspace → spear phish via google.com lookalike
  TXT → "MS=ms..." token = Microsoft 365 tenant confirmed
  SRV → _ldap._tcp.domain.com = AD domain, reveals internal domain name
  NS → Cloudflare = they use CDN, real IP may be hidden behind it

Extracting the admin email from SOA:
  dig SOA example.com    → "hostmaster.example.com" = hostmaster@example.com`
  },
  {
    id: 'osint-03',
    title: 'Certificate Transparency — Subdomain Discovery Without Touching the Target',
    objective: `Every TLS certificate issued by a public CA is logged to Certificate Transparency (CT) logs — a public, searchable record. This means you can discover subdomains just by searching for certificates issued to a domain, with zero network contact to the target.

What is the URL to search crt.sh for all certificates issued to subdomains of example.com?`,
    hint: 'The crt.sh query uses the % wildcard. The URL pattern is: https://crt.sh/?q=%.example.com',
    answers: [
      'https://crt.sh/?q=%.example.com',
      'crt.sh/?q=%.example.com',
      'crt.sh',
      '%.example.com',
    ],
    flag: 'FLAG{ct_logs_searched}',
    xp: 25,
    explanation: `Certificate Transparency logs are publicly auditable records of every certificate issued. All major CAs (Let's Encrypt, DigiCert, Sectigo) are required to submit to CT logs.

crt.sh query types:
  https://crt.sh/?q=%.example.com          — all subdomains
  https://crt.sh/?q=example.com            — exact domain only
  https://crt.sh/?q=%25.example.com&output=json  — JSON for scripting

What you find in CT logs:
  • Internal subdomains accidentally given public certs (vpn.internal.corp.com)
  • Development/staging environments (dev.corp.com, staging-api.corp.com)
  • Old infrastructure not publicly advertised (legacy.corp.com)
  • Acquisitions and subsidiaries (newacquisition.corp.com)
  • Third-party service subdomains (mail.corp.com → reveals email provider)

Automating CT log searches:
  # Get all unique subdomains from crt.sh
  curl -s "https://crt.sh/?q=%.example.com&output=json" | jq -r '.[].name_value' | sort -u

  # subfinder uses CT logs among many sources
  subfinder -d example.com -all -silent

Other CT log search engines:
  censys.io/certificates    — richer search, requires free account
  transparencyreport.google.com/https/certificates  — Google's CT search
  Facebook's CT monitor at developers.facebook.com/tools/ct  — notifies on new certs`
  },

  // ── SECTION 2: Active DNS Recon ───────────────────────────────────────────
  {
    id: 'osint-04',
    title: 'Zone Transfer — AXFR Attack',
    objective: `A DNS zone transfer (AXFR) lets a secondary name server request the complete zone file from a primary server. When misconfigured to allow transfers from any IP, an attacker gets the entire DNS database in one request — every subdomain, internal hostname, and IP address the organisation has registered.

Write the dig command to attempt a zone transfer of example.com from its name server ns1.example.com.`,
    hint: 'Use "dig" with the AXFR record type, specifying the name server with @. Format: dig axfr @nameserver domain',
    answers: [
      'dig axfr @ns1.example.com example.com',
      'dig AXFR @ns1.example.com example.com',
      'dig axfr example.com @ns1.example.com',
    ],
    xp: 20,
    explanation: `dig axfr @ns1.example.com example.com requests the full zone transfer.

A successful transfer returns every record in the zone:
  example.com.          IN SOA   ns1.example.com. ...
  www.example.com.      IN A     93.184.216.34
  mail.example.com.     IN A     93.184.216.50
  dev.example.com.      IN A     10.0.1.5        ← internal IP leaked!
  vpn.example.com.      IN A     93.184.216.99
  db-backup.example.com IN A     10.0.2.10       ← sensitive hostname exposed

Most modern organisations have fixed this — but:
  • Legacy infrastructure frequently still allows AXFR
  • Internal DNS servers sometimes have AXFR open if assumed network-unreachable
  • Misconfigured split-horizon DNS setups can leak internal zone data

dnsenum automates this:
  dnsenum example.com
  → tries zone transfer against all NS records automatically
  → also performs subdomain brute force using a wordlist

fierce also attempts zone transfers:
  fierce --domain example.com

If AXFR is blocked, the response is:
  ; Transfer failed.
  ; Communication with ns1.example.com#53 failed: connection refused`
  },
  {
    id: 'osint-05',
    title: 'Subdomain Enumeration — Tools, Sources, and Strategy',
    objective: `You've exhausted passive CT log data. Now you need to go broader. Different subdomain tools use different data sources — choosing the right one matters.

Amass is the most comprehensive open-source subdomain enumeration tool. What amass subcommand runs a full passive + active enumeration against a target domain?`,
    hint: 'Amass has subcommands: intel, enum, db, viz, track. The one for active enumeration is "enum".',
    answers: ['amass enum', 'amass enum -d', 'amass enum -d example.com', 'amass'],
    xp: 20,
    explanation: `amass enum -d example.com runs the full enumeration engine.

Tool comparison — choose based on your situation:

  subfinder -d example.com
    → Pure passive, queries 50+ sources (Shodan, Censys, VirusTotal, GitHub, etc.)
    → Fast, stealthy, no brute force — good for initial passive pass
    → subfinder -d example.com -all -o subdomains.txt

  amass enum -d example.com
    → Passive + active DNS brute force + scraping
    → Most comprehensive but slower, more detectable
    → amass enum -passive -d example.com  for passive only
    → Stores results in a graph database for relationship mapping

  gobuster dns -d example.com -w wordlist.txt
    → Pure brute force DNS — queries each word in list as subdomain
    → Fast but noisy — DNS queries visible in logs
    → gobuster dns -d example.com -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt

  dnsx -l subdomains.txt -a -resp
    → Takes a list of subdomains, resolves them, filters live ones
    → Good for post-processing combined results from multiple tools

Best wordlists for DNS brute force:
  /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt   — top 5k
  /usr/share/seclists/Discovery/DNS/bitquark-subdomains-top100000.txt — deep
  assetnote.io/resources/data  — fresh wordlists built from real web crawl data

Combining results:
  cat subfinder.txt amass.txt | sort -u | dnsx -silent > live_subdomains.txt`
  },

  // ── SECTION 3: Shodan & Search Engine Recon ───────────────────────────────
  {
    id: 'osint-06',
    title: 'Shodan — Deep Dorking and the Attack Surface',
    objective: `Shodan is a search engine for internet-connected devices. Unlike Google which indexes web pages, Shodan indexes the services themselves — banners, TLS certificates, SSH host keys, HTTP response headers.

You want to find all internet-facing assets belonging to a specific organisation. What Shodan filter finds all hosts where the TLS certificate was issued to a specific organisation name, e.g. "Example Corp"?`,
    hint: 'The Shodan filter for certificate organisation is ssl.cert.subject.cn or ssl.cert.subject.o. Use: ssl.cert.subject.o:"Example Corp"',
    answers: [
      'ssl.cert.subject.o:"example corp"',
      'ssl.cert.subject.o',
      'ssl.cert.subject.cn',
      'org:"example corp"',
      'ssl:"example corp"',
    ],
    flag: 'FLAG{shodan_deep_recon}',
    xp: 25,
    explanation: `Shodan search syntax — building a comprehensive picture:

BASIC FILTERS:
  org:"Target Corp"              → all hosts where ASN/org name matches
  hostname:example.com           → all hosts where reverse DNS contains the domain
  ssl.cert.subject.o:"Corp"      → all certs issued to this organisation name
  ssl.cert.subject.cn:*.corp.com → wildcard cert search for all subdomains on Shodan
  net:192.168.0.0/24             → scan a specific IP range (use real ranges)

FINDING SPECIFIC VULNERABILITIES:
  vuln:CVE-2021-44228            → Log4Shell vulnerable hosts
  vuln:CVE-2019-0708             → BlueKeep RDP vulnerable hosts
  product:"Apache httpd" version:"2.4.49"  → specific vulnerable version

EXPOSED SERVICES OF INTEREST:
  port:3389 country:US           → RDP exposed to internet (US only)
  port:445 os:"Windows"         → SMB on Windows — potential EternalBlue
  port:6379 "redis_version"      → Unauthenticated Redis instances
  port:27017 "MongoDB"           → Unauthenticated MongoDB
  http.title:"Jenkins"           → Exposed Jenkins servers (often no auth)
  http.title:"Kibana"            → Exposed Kibana (may contain sensitive logs)
  "default password"             → Devices showing default credential prompts

SHODAN CLI:
  shodan init API_KEY
  shodan search --fields ip_str,port,org 'ssl.cert.subject.o:"Corp"'
  shodan host 1.2.3.4            → full details on a specific IP
  shodan count 'apache'          → how many results without downloading all

Shodan monitors (paid):
  shodan alert create "org:TargetCorp"  → get notified when new assets appear`
  },
  {
    id: 'osint-07',
    title: 'Google Dorking — Extracting Intelligence from Search Indices',
    objective: `Google has indexed parts of the internet that organisations didn't intend to make public. Google dorks use advanced search operators to find exposed files, login panels, and sensitive information.

You want to find PDF documents hosted on a target's domain that aren't linked from the main site. What Google dork searches for PDF files specifically on example.com?`,
    hint: 'Use the "site:" operator to restrict to a domain and "filetype:" to filter by extension.',
    answers: [
      'site:example.com filetype:pdf',
      'site:example.com filetype:pdf -www',
      'filetype:pdf site:example.com',
    ],
    xp: 20,
    explanation: `Google dork operators — essential toolkit:

SCOPE OPERATORS:
  site:example.com              → restrict results to this domain
  -site:www.example.com         → exclude www — find subdomains only
  site:*.example.com            → only subdomains
  inurl:admin                   → URL must contain "admin"
  intitle:"index of"            → directory listings
  intext:"confidential"         → body text contains word

FILE DISCOVERY:
  site:example.com filetype:pdf            → PDF documents
  site:example.com filetype:xls OR xlsx    → spreadsheets (often contain data)
  site:example.com filetype:sql            → SQL dumps (critical finding)
  site:example.com filetype:env            → .env files with credentials
  site:example.com filetype:log            → log files
  site:example.com ext:bak OR ext:old      → backup files

CREDENTIAL AND CONFIG EXPOSURE:
  site:example.com inurl:config            → configuration pages
  site:example.com "password" filetype:txt
  site:example.com inurl:.git              → exposed .git directory
  site:pastebin.com "example.com" "password"  → credential pastes

INFRASTRUCTURE DISCOVERY:
  site:example.com inurl:login             → login pages
  site:example.com inurl:wp-admin          → WordPress admin
  site:example.com inurl:phpmyadmin        → phpMyAdmin
  site:example.com "powered by"            → technology disclosure

GITHUB DORKING (github.com):
  org:ExampleCorp "api_key"                → API keys in public repos
  org:ExampleCorp "BEGIN RSA PRIVATE KEY"  → private keys
  org:ExampleCorp filename:.env            → .env files

The Google Hacking Database (GHDB) at exploit-db.com/google-hacking-database
has 7000+ pre-built dorks organised by category.`
  },

  // ── SECTION 4: People & Email Intelligence ────────────────────────────────
  {
    id: 'osint-08',
    title: 'Email Harvesting & Validation',
    objective: `You need to build a target email list for a spear phishing campaign assessment. theHarvester is the standard tool for automated email discovery from public sources.

Write the theHarvester command to enumerate emails and hosts for example.com using all available sources.`,
    hint: 'The flags are -d for domain and -b for data source. Use "all" to query every source.',
    answers: [
      'theHarvester -d example.com -b all',
      'theharvester -d example.com -b all',
      'theHarvester -d example.com -b google',
      'theHarvester -d example.com',
    ],
    xp: 20,
    explanation: `theHarvester -d example.com -b all queries every configured source and returns emails, subdomains, and IPs.

Key sources and what they return:
  google, bing, yahoo    → emails indexed in search results, forum posts, PDFs
  linkedin               → employee names and roles (powerful for targeting)
  shodan                 → subdomains and hosts seen by Shodan
  hunter                 → professional email addresses via Hunter.io API
  virustotal             → subdomains from passive DNS data
  github                 → emails in public commits and profiles
  securitytrails         → historical DNS and subdomain data

After harvesting — validation pipeline:
  1. hunter.io             → verify email format pattern (first.last@domain.com?)
  2. holehe email@corp.com → check if email is registered on 120+ services
                             holehe confirms accounts on: GitHub, Twitter, LinkedIn,
                             Adobe, Spotify, Dropbox — builds a profile of the person
  3. haveibeenpwned.com    → check if email appears in known data breaches
  4. SMTP validation       → RCPT TO: verification (if server allows, not recommended
                             without auth — many servers now block this)

Email format discovery (when you have names but not addresses):
  # Common patterns: first.last, first_last, flast, firstl, first
  # Test each against MX server with SMTP RCPT TO or use hunter.io verify

Building the target list:
  LinkedIn + theHarvester → employee names + email format → full address list
  This is the standard path to a targeted phishing assessment`
  },
  {
    id: 'osint-09',
    title: 'LinkedIn OSINT Without an Account',
    objective: `LinkedIn rate-limits and blocks unauthenticated access, but Google has indexed enormous amounts of LinkedIn data. You can extract employee information without a LinkedIn account using Google dorks.

What Google dork finds LinkedIn employee profiles for people who work at Example Corp?`,
    hint: 'Use site:linkedin.com/in/ combined with the company name in quotes.',
    answers: [
      'site:linkedin.com/in "example corp"',
      'site:linkedin.com "example corp"',
      'site:linkedin.com/in/ "example corp"',
      'site:linkedin.com intitle:"example corp"',
    ],
    xp: 15,
    explanation: `LinkedIn OSINT without an account — full toolkit:

GOOGLE DORKING FOR LINKEDIN:
  site:linkedin.com/in "Example Corp"              → employee profiles
  site:linkedin.com/in "Example Corp" "engineer"  → filter by role
  site:linkedin.com/in "Example Corp" "CISO"      → find security leadership
  site:linkedin.com/company/example-corp/people   → company people page (sometimes cached)

WHAT TO EXTRACT FROM PROFILES:
  • Full name → email address inference
  • Job title → who handles what (finance = BEC target, IT admin = elevated access)
  • Technologies listed → "AWS, Terraform, Kubernetes" tells you their stack
  • Previous employers → may have retained access or use same passwords
  • Certifications → CISSP = security-aware target, vs non-security = easier target
  • Education → graduation year estimates age, shared contacts reveal org chart

TOOLS THAT AUTOMATE LINKEDIN RECON:
  linkedin2username   → generates username lists from LinkedIn company page
  CrossLinked         → scrapes LinkedIn with Google/Bing to avoid LinkedIn detection
  ScrapedIn           → uses LinkedIn API endpoints (requires valid session cookie)

ORG CHART RECONSTRUCTION WITHOUT LINKEDIN:
  GitHub org page     → github.com/ExampleCorp — lists public contributors, bio data
  Twitter/X           → many employees list employer in bio
  Conference talks    → "speaker from Example Corp" on YouTube/SlideShare reveals experts
  Email signature     → job boards, conference registrations, academic papers

This intelligence feeds directly into:
  • Password spray (knowing names → guessing usernames)
  • Spear phishing (knowing roles → targeted pretexts)
  • Vishing (knowing org structure → impersonating real people)`
  },

  // ── SECTION 5: Metadata & Image Intelligence ─────────────────────────────
  {
    id: 'osint-10',
    title: 'ExifTool — Deep Metadata Extraction',
    objective: `A target organisation publishes PDF reports and press release images on their website. These files contain metadata that reveals internal infrastructure details, employee names, and sometimes GPS coordinates.

What ExifTool command extracts all metadata from a file called report.pdf and shows every field?`,
    hint: 'exiftool with no flags on a filename shows all metadata. For verbose output add -v.',
    answers: [
      'exiftool report.pdf',
      'exiftool -v report.pdf',
      'exiftool -a -u report.pdf',
      'exiftool',
    ],
    xp: 20,
    explanation: `exiftool report.pdf outputs every metadata field the file contains.

HIGH-VALUE FIELDS TO LOOK FOR:

FROM PDF FILES:
  Author:           Real name of the document author → targets for social engineering
  Creator:          Software used (Microsoft Word 2016 → Windows, older Office version)
  Producer:         PDF generator (Adobe Acrobat Pro 2020 → license key sometimes in here)
  Company:          Organisation name — confirms target, sometimes subsidiary name
  Last Modified By: Last person who edited — different from Author, reveals internal name
  Template:         Internal template path — e.g. C:\Users\jsmith\Templates\Report.dotx
                    → reveals username "jsmith", local file structure

FROM IMAGES (JPEG/PNG/TIFF):
  GPS Latitude/Longitude:  Where the photo was taken → office location, employee home
  GPS DateStamp:           When taken → confirms timeframe, timezone
  Make/Model:              Camera or phone model (iPhone 14 → iOS target)
  Software:                Photo editing software version
  Artist:                  Photographer name

FROM OFFICE DOCUMENTS:
  Last Printed:     When document was last printed
  Revision Number:  How many edits — frequently revised = sensitive/evolving document
  Total Edit Time:  Hours spent on document

BATCH PROCESSING:
  # Extract metadata from all files in a directory
  exiftool -csv /path/to/downloads/ > metadata.csv

  # Find all files with GPS data
  exiftool -if '$gpslatitude' -filename -gpslatitude -gpslongitude /path/

  # Strip metadata before sharing your own files
  exiftool -all= yourfile.jpg    → removes all metadata
  mat2 yourfile.pdf              → alternative metadata stripping tool`
  },
  {
    id: 'osint-11',
    title: 'Geolocation from Images — GEOINT',
    objective: `A threat actor has posted photos online claiming to be at an undisclosed location. You need to determine the physical location from the image content itself — not EXIF (which has been stripped).

What is the systematic name for the intelligence discipline of determining location from visual analysis of imagery?`,
    hint: 'It combines "geo" (geography) and "int" (intelligence). Used by Bellingcat and open-source investigators.',
    answers: ['geoint', 'geospatial intelligence', 'geo-osint', 'geolocating', 'geolocation'],
    xp: 20,
    explanation: `GEOINT (Geospatial Intelligence) — locating subjects from image content:

EXIF GPS (when available):
  exiftool image.jpg | grep -i gps    → extract coordinates directly
  Convert DMS to decimal: 51°30'26.4"N → 51.507333
  Plug into Google Maps or maps.google.com?q=LAT,LON

VISUAL GEOLOCATION (when EXIF is stripped):
  Landmarks:    Buildings, monuments, distinctive architecture
  Signage:      Road signs (language, style reveals country/region)
  Vegetation:   Flora type narrows geographic region
  Road markings: Left vs right-hand traffic, paint colour, style
  Sun/shadow:   Shadow direction + angle → compass bearing + approximate time of day
  Power lines:  Insulator style varies by country
  License plates: Visible plates confirm region

TOOLS FOR VISUAL GEOLOCATION:
  Google Street View    → manually search areas matching visual clues
  Google Earth Pro      → historical imagery, 3D terrain matching
  Yandex Maps           → better coverage of Russia, Eastern Europe, Central Asia
  Bing Maps Bird's Eye  → oblique aerial view helps match rooftops
  Overpass Turbo        → OpenStreetMap query for specific features (eg: all churches
                          in a 5km radius with a specific tower shape)
  SunCalc.org           → input date+time+shadow direction → get location on Earth

REVERSE IMAGE SEARCH:
  Google Images (images.google.com)   → drag and drop image
  TinEye (tineye.com)                 → finds exact/near-exact copies, tracks usage
  Yandex Images (yandex.com/images)   → best for faces, often outperforms Google
  Bing Visual Search                  → good for landmarks and products

CASE STUDY — Bellingcat methods:
  The Bellingcat investigation group used GEOINT to geolocate MH17 missile launcher
  photos from social media by matching building shapes and road intersections in Kursk,
  Russia — entirely from public imagery with no classified data.`
  },

  // ── SECTION 6: Frameworks, Pivoting & Investigator Opsec ─────────────────
  {
    id: 'osint-12',
    title: 'Maltego — Relationship Graph and Transform Chains',
    objective: `Maltego is the industry-standard OSINT visualisation tool. It uses "transforms" — automated lookups — to pivot between entities (domain → IP → email → person → organisation) and builds a graph of relationships.

In Maltego, what is the term for the automated data lookups that take one entity as input and return related entities as output?`,
    hint: 'In Maltego, these automated lookups are called "transforms" — they transform one entity into related ones.',
    answers: ['transforms', 'transform', 'maltego transforms'],
    xp: 15,
    explanation: `Maltego entity types and what transforms you run on them:

  DOMAIN ENTITY:
    → DNS to IP (A record lookup)
    → DNS to MX, NS records
    → To Subdomains (passive DNS, Shodan, crt.sh transforms)
    → To Related Domains (same registrant, similar name)
    → To Email Addresses (theHarvester, Hunter.io transforms)

  IP ADDRESS ENTITY:
    → To Autonomous System (who owns the IP block)
    → To Domains on Same IP (shared hosting pivot)
    → Shodan lookup (what services are running)
    → Geolocation

  EMAIL ADDRESS ENTITY:
    → To Person (name inference)
    → Have I Been Pwned (breach check)
    → Social media accounts (holehe-style lookup)
    → PGP key servers (may have public key with real name)

  PERSON ENTITY:
    → To Email addresses
    → To Phone numbers
    → To Social media profiles
    → To Organisations

TRANSFORM HUBS (sources of transforms):
  Maltego Community Transforms  → free, basic transforms
  VirusTotal API transforms      → threat intelligence pivoting
  Shodan transforms              → infrastructure discovery
  Have I Been Pwned transforms   → breach data
  Social Links transforms        → social media intelligence (paid)

The power is in chaining:
  Domain → Subdomains → IPs → Open Ports (Shodan) → Banner → CVEs
  Domain → Emails → Breaches → Passwords → Password Spray

Maltego CE (Community Edition) is free with limitations:
  12 transforms per entity, 10,000 entities per graph`
  },
  {
    id: 'osint-13',
    title: 'Building a Target Dossier — Structuring Findings',
    objective: `After running all your recon tools you have raw data from WHOIS, DNS, Shodan, theHarvester, LinkedIn, crt.sh, and ExifTool. The next step is converting noise into actionable intelligence.

In structured intelligence reporting, what term describes the likelihood that a piece of information is accurate — typically expressed as a scale from "confirmed" down to "speculative"?`,
    hint: 'Intelligence analysts use "confidence levels" — high/medium/low confidence — to grade reliability of findings.',
    answers: ['confidence level', 'confidence', 'confidence rating', 'analytic confidence', 'reliability'],
    xp: 15,
    explanation: `A target dossier should be structured and graded — not a raw dump of tool output.

DOSSIER STRUCTURE:
  1. Executive Summary       → 3–5 bullets: who the target is, key findings, risk level
  2. Infrastructure          → IP ranges, ASN, hosting providers, CDN, DNS architecture
  3. Personnel               → key employees, roles, contact info, social profiles
  4. Technology Stack        → OS, web tech, email provider, cloud platform, languages
  5. Exposed Attack Surface  → open ports, exposed services, S3 buckets, leaked docs
  6. Credential Exposure     → breached emails, reused passwords in HIBP
  7. Relationship Map        → subsidiaries, partners, suppliers (supply chain vectors)

CONFIDENCE LEVELS (NATO/intelligence standard):
  Confirmed (5/5)    → verified from multiple independent reliable sources
  Probable (4/5)     → likely true, one strong source or multiple weak ones
  Possible (3/5)     → could be true, single source or derived from inference
  Doubtful (2/5)     → probably false but can't rule out
  Improbable (1/5)   → almost certainly false

GRADING SOURCES:
  A = Completely reliable    (your own verified scan result)
  B = Usually reliable       (reputable public database like Shodan)
  C = Fairly reliable        (single secondary source)
  D = Not usually reliable   (anonymous tip, single social media post)
  F = Cannot be judged

SEPARATING FACT FROM INFERENCE:
  FACT:    "Port 445/TCP is open on 203.0.113.5" (direct observation)
  INFERENCE: "This host is likely running Windows" (derived — could be Samba)
  SPECULATION: "This may be their main file server" (no direct evidence)

Always tag inferences clearly. Acting on speculation as fact is how engagements fail.`
  },
  {
    id: 'osint-14',
    title: 'Sock Puppet Accounts — Investigator Opsec',
    objective: `When you access a target's LinkedIn profile, visit their GitHub, or view their public Twitter — you can leave traces. LinkedIn shows "who viewed your profile." GitHub logs access. Your browser fingerprint is trackable.

What is the term for a fabricated online identity used by investigators and intelligence officers to conduct research without revealing their real identity?`,
    hint: 'A fake online persona used for investigations. The term comes from a hand puppet made from a sock.',
    answers: ['sock puppet', 'sockpuppet', 'sock puppet account', 'fake persona', 'alternate persona'],
    xp: 15,
    explanation: `A sock puppet is a fabricated online identity — separate from your real identity — used for research without attribution.

CREATING A CLEAN SOCK PUPPET:
  1. Separate device or VM (never mix sock puppet and real accounts on same browser)
  2. Dedicated VPN or Tor for all sock puppet activity — never your real IP
  3. New email address (ProtonMail, Tutanota) created via Tor
  4. Consistent backstory: name, location, profession, interests
  5. Aged account: LinkedIn profiles < 2 months old get low trust
  6. Profile photo: use ThisPersonDoesNotExist.com — AI-generated face,
     not a real person's photo (reverse image search proof)
  7. Some plausible activity history before using for recon

BROWSER ISOLATION:
  Tails OS               → amnesic, no persistent state
  Firefox containers     → compartmentalise by identity
  Separate Firefox profiles (about:profiles) → different cookies, storage
  Disable JavaScript where possible → prevents fingerprinting
  Use a different timezone → browser JS can leak timezone even via VPN

WHAT EXPOSES INVESTIGATORS:
  Viewing a LinkedIn profile while logged into your real account
  Accessing GitHub repos that notify the owner on star/fork
  Visiting a canary token URL embedded in a document
  Clicking a tracking pixel in a document download
  Your real name in document metadata when downloading and re-uploading

CANARYTOKENS.ORG:
  Free tool to embed invisible tracking in documents, URLs, and images
  When the canary fires, you get notified — defenders use this to detect
  reconnaissance of their infrastructure. Be aware of this as an investigator.`
  },
  {
    id: 'osint-15',
    title: 'Reverse Image Search — Finding the Source',
    objective: `A target has posted a profile photo that you want to verify — checking if the photo is stolen from someone else, or finding other accounts they use with the same photo.

Which reverse image search engine is generally considered the best for finding faces and matching photos of people — often outperforming Google on facial recognition quality?`,
    hint: 'It is the Russian search engine that has particularly strong image matching capabilities.',
    answers: ['yandex', 'yandex images', 'yandex.com/images'],
    xp: 15,
    explanation: `Reverse image search tool comparison:

  YANDEX IMAGES (yandex.com/images)
    Best for:  Face matching, finding similar faces, Eastern European/Russian content
    Strength:  Most powerful facial similarity matching of all free tools
    Use when:  Trying to find other social media accounts using the same photo

  GOOGLE IMAGES (images.google.com)
    Best for:  Exact image matches, widely indexed content, products, landmarks
    Strength:  Largest index, best for finding reposts of exact images
    Use when:  Finding where an image originated or has been reused

  TINEYE (tineye.com)
    Best for:  Exact and near-exact duplicate detection across time
    Strength:  Shows you WHEN and WHERE the image first appeared — timeline of usage
    Use when:  Proving an image was published before a certain date, tracking usage

  BING VISUAL SEARCH
    Best for:  Product identification, landmark matching
    Strength:  Good OCR on embedded text in images

WORKFLOW FOR SOCK PUPPET PHOTO VERIFICATION:
  1. Download the target's profile photo
  2. Run through Yandex — if the face appears on other accounts → fake account
  3. Run through Google — if results show a different person's name → stolen photo
  4. Run through TinEye — if earliest hit predates the account → not original

AI-GENERATED FACE DETECTION:
  hivemoderation.com/demo    → AI image detector
  illuminarty.ai             → AI art detector
  Tell-tale signs of AI faces: ear asymmetry, background artifacts, teeth geometry,
  hair/glasses edge blending, accessories merging into skin`
  },
  {
    id: 'osint-16',
    title: 'Passive DNS — Historical Infrastructure Analysis',
    objective: `Current DNS tells you where a domain points now. But what if the target moved their server 6 months ago — and the old IP is still running something? Passive DNS databases store historical resolution data, letting you pivot back through time.

What is the term for DNS databases that store historical resolution records — showing what IP a domain pointed to in the past?`,
    hint: 'These databases are called "passive DNS" — they passively collect DNS query results over time.',
    answers: ['passive dns', 'passive dns database', 'pdns', 'historical dns', 'dns history'],
    flag: 'FLAG{osint_complete}',
    xp: 25,
    explanation: `Passive DNS (pDNS) databases collect DNS query responses from sensors worldwide and store them with timestamps — letting you see what a domain resolved to at any point in the past.

WHAT PASSIVE DNS REVEALS:
  • Old IP addresses that may still be running services (infrastructure rarely fully decommissioned)
  • The real origin IP of a Cloudflare-protected site (if the domain was ever pointed there directly)
  • Infrastructure relationships: multiple domains resolving to the same IP = same operator
  • Bulletproof hosting: known bad IPs that have hosted multiple malicious domains
  • Phishing kit reuse: same C2 IP used across many campaigns

FREE PASSIVE DNS SOURCES:
  SecurityTrails (securitytrails.com)   → historical DNS, IP history, reverse DNS
  RiskIQ/Microsoft Defender (free tier) → passive DNS + infrastructure pivoting
  VirusTotal (virustotal.com/graph)     → pivot from domain → IPs → other domains
  CIRCL.lu pDNS (https://www.circl.lu/services/passive-dns/) → open passive DNS API
  Robtex (robtex.com)                  → reverse DNS, AS info, passive DNS
  DNSlytics (dnslytics.com)            → reverse IP, forward/reverse DNS history

FINDING REAL IPs BEHIND CLOUDFLARE:
  1. Query passive DNS for historical A records (pre-Cloudflare period)
  2. Search Shodan/Censys for the SSL cert serial number — cert is served from origin IP
     censys.io query: parsed.extensions.subject_alt_name.dns_names: "example.com"
  3. Look for MX record IP — mail servers often bypass CDN
  4. Check subdomains — direct.example.com, mail.example.com, ftp.example.com often
     resolve directly to origin

PIVOTING WORKFLOW:
  Domain → passive DNS → old IP → Shodan/Censys → what else was on that IP
  → reverse DNS on that IP → other domains → common infrastructure → operator identity`
  },
]

const xpTotal = steps.reduce((sum, s) => sum + s.xp, 0)

export default function OsintLab() {
  const [guidedDone, setGuidedDone] = useState(false)
  const [freeLaunched, setFreeLaunched] = useState(false)
  const [earnedXp, setEarnedXp] = useState(0)
  const [showKeywords, setShowKeywords] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('lab_osint-lab')
    if (saved) {
      const d = JSON.parse(saved)
      if (d.done) { setGuidedDone(true); setEarnedXp(d.xp || 0) }
    }
  }, [])

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#006a7a' }}>
        <Link href="/" style={{ color: '#006a7a', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>&#8250;</span>
        <Link href="/modules/osint" style={{ color: '#006a7a', textDecoration: 'none' }}>OSINT</Link>
        <span>&#8250;</span>
        <span style={{ color: accent }}>LAB</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px', alignItems: 'center' }}>
          <Link href="/modules/osint" style={{ textDecoration: 'none', padding: '3px 10px', border: '1px solid #003a4a', borderRadius: '3px', color: '#006a7a', fontSize: '7.5px', letterSpacing: '0.1em' }}>&#8592; CONCEPT</Link>
          <span style={{ padding: '3px 10px', background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.4)', borderRadius: '3px', color: accent, fontSize: '7.5px', letterSpacing: '0.1em', fontWeight: 700 }}>LAB ACTIVE</span>
        </div>
      </div>

      {/* Progress banner */}
      <div style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.15)', borderRadius: '6px', padding: '10px 16px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' as const }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {[{ label: 'PHASE 1', done: true, active: !guidedDone }, { label: 'PHASE 2', done: guidedDone, active: guidedDone }].map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.done ? accent : '#003a4a', border: p.active ? '2px solid ' + accent : '1px solid #003a4a', boxShadow: p.active ? '0 0 6px ' + accent : 'none' }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: p.done ? accent : '#005a6a', letterSpacing: '0.1em' }}>{p.label}</span>
              {i === 0 && <span style={{ fontSize: '7px', color: '#003a4a', margin: '0 2px' }}>—</span>}
            </div>
          ))}
        </div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#4a8a9a' }}>
          MOD-{moduleNum} &nbsp;·&nbsp; {moduleName.toUpperCase()} &nbsp;·&nbsp; {xpTotal} XP &nbsp;·&nbsp; {steps.length} STEPS
        </div>
        {guidedDone && (
          <div style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: accent, fontWeight: 700 }}>
            &#10003; GUIDED PHASE COMPLETE — LAUNCH FREE LAB BELOW
          </div>
        )}
      </div>

      {/* Section index */}
      <div style={{ background: 'rgba(0,212,255,0.02)', border: '1px solid rgba(0,212,255,0.08)', borderRadius: '6px', padding: '12px 16px', marginBottom: '1.5rem', fontFamily: 'JetBrains Mono, monospace' }}>
        <div style={{ fontSize: '7px', color: '#003a4a', letterSpacing: '0.25em', marginBottom: '10px' }}>LAB SECTIONS</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '6px' }}>
          {[
            { section: '01–03', title: 'Passive Footprinting', steps: 'WHOIS · DNS anatomy · CT logs' },
            { section: '04–05', title: 'Active DNS Recon', steps: 'Zone transfer · Subdomain tools' },
            { section: '06–07', title: 'Shodan & Google Dorking', steps: 'Deep filters · Document exposure' },
            { section: '08–09', title: 'People & Email Intel', steps: 'theHarvester · LinkedIn OSINT' },
            { section: '10–11', title: 'Metadata & GEOINT', steps: 'ExifTool · Image geolocation' },
            { section: '12–16', title: 'Frameworks & Opsec', steps: 'Maltego · Dossier · Sock puppets · Passive DNS' },
          ].map(s => (
            <div key={s.section} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '7px', color: accent + '66', flexShrink: 0, minWidth: '30px' }}>{s.section}</span>
              <div>
                <div style={{ fontSize: '7.5px', color: '#4a8a9a' }}>{s.title}</div>
                <div style={{ fontSize: '6.5px', color: '#2a5a6a', marginTop: '1px' }}>{s.steps}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PHASE 1 */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: accent, fontWeight: 700 }}>1</span>
          </div>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#005a6a', letterSpacing: '0.2em', marginBottom: '2px' }}>PHASE 1 — GUIDED LEARNING</div>
            <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.4rem', fontWeight: 700, color: accent, margin: 0 }}>OSINT Reconnaissance Lab</h1>
          </div>
        </div>

        <p style={{ color: '#5a8a9a', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: 1.7, fontFamily: 'JetBrains Mono, monospace' }}>
          {steps.length} steps covering passive footprinting, DNS zone transfers, certificate transparency, Shodan dorking,
          Google dorks, email harvesting, LinkedIn recon, metadata forensics, image geolocation, Maltego transforms,
          dossier construction, sock puppet opsec, and passive DNS pivoting.
        </p>

        <div style={{ background: 'rgba(0,212,255,0.03)', border: '1px solid rgba(0,212,255,0.12)', borderRadius: '6px', padding: '1rem 1.25rem', marginBottom: '1.25rem', fontFamily: 'JetBrains Mono, monospace' }}>
          <div style={{ fontSize: '7px', color: '#003a4a', letterSpacing: '0.25em', marginBottom: '8px' }}>SKILLS DEVELOPED</div>
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '6px' }}>
            {[
              'WHOIS registration analysis',
              'DNS record type intelligence',
              'Certificate Transparency mining',
              'AXFR zone transfer attacks',
              'Subdomain enumeration strategy',
              'Shodan advanced dorking',
              'Google dork operators',
              'Email harvesting & validation',
              'LinkedIn OSINT without account',
              'ExifTool metadata forensics',
              'GEOINT image geolocation',
              'Maltego transform chains',
              'Intelligence dossier structure',
              'Sock puppet account creation',
              'Investigator opsec',
              'Passive DNS historical analysis',
            ].map(c => (
              <span key={c} style={{ fontSize: '7.5px', color: '#3a7a8a', background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.12)', padding: '2px 8px', borderRadius: '3px' }}>{c}</span>
            ))}
          </div>
        </div>

        <LabTerminal
          labId="osint-lab"
          moduleId={moduleId}
          title="OSINT Reconnaissance Lab"
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
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: guidedDone ? accent : '#005a6a', fontWeight: 700 }}>2</span>
          </div>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: guidedDone ? '#4a8a9a' : '#005a6a', letterSpacing: '0.2em', marginBottom: '2px' }}>PHASE 2 — FREE LAB ENVIRONMENT</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.1rem', fontWeight: 700, color: guidedDone ? accent : '#005a6a' }}>Full OSINT Practice Sandbox</div>
          </div>
          {guidedDone && !freeLaunched && (
            <div style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#ffb347', background: 'rgba(255,179,71,0.08)', border: '1px solid rgba(255,179,71,0.2)', padding: '3px 10px', borderRadius: '3px' }}>
              GUIDED PHASE COMPLETE
            </div>
          )}
        </div>

        {!freeLaunched ? (
          <div style={{ background: guidedDone ? 'rgba(0,212,255,0.04)' : '#020608', border: '1px solid ' + (guidedDone ? 'rgba(0,212,255,0.25)' : '#001a2a'), borderRadius: '10px', padding: '2.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            {guidedDone && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, ' + accent + ', transparent)' }} />}
            <div style={{ fontSize: '7px', color: guidedDone ? '#3a7a8a' : '#003a4a', letterSpacing: '0.3em', marginBottom: '1rem' }}>
              {guidedDone ? 'READY FOR COMPREHENSIVE TESTING' : 'COMPLETE GUIDED PHASE TO UNLOCK'}
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.2rem', color: guidedDone ? accent : '#005a6a', fontWeight: 700, marginBottom: '0.5rem' }}>
              LAUNCH FULL LAB ENVIRONMENT
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', color: '#4a8a9a', marginBottom: '2rem', lineHeight: 1.7 }}>
              Free-form OSINT sandbox — no guided prompts, no restrictions
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' as const, marginBottom: '2rem' }}>
              {[
                'Full DNS enumeration suite',
                'Subdomain & CT log recon',
                'Shodan + Google dorking',
                'Email harvesting pipeline',
                'Metadata extraction',
                'Passive DNS pivoting',
              ].map(feat => (
                <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: guidedDone ? accent : '#003a4a' }} />
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: guidedDone ? '#4a8a9a' : '#003a4a' }}>{feat}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => guidedDone && setFreeLaunched(true)}
              disabled={!guidedDone}
              style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.15em', padding: '14px 40px', border: '1px solid ' + (guidedDone ? 'rgba(0,212,255,0.6)' : '#003a4a'), borderRadius: '6px', background: guidedDone ? 'rgba(0,212,255,0.12)' : 'transparent', color: guidedDone ? accent : '#003a4a', cursor: guidedDone ? 'pointer' : 'not-allowed', boxShadow: guidedDone ? '0 0 24px rgba(0,212,255,0.18)' : 'none', transition: 'all 0.2s' }}
            >
              {guidedDone ? '&#9658; LAUNCH FREE LAB ENVIRONMENT' : '&#128274; COMPLETE GUIDED PHASE FIRST'}
            </button>
            {!guidedDone && <div style={{ marginTop: '1rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: '#003a4a' }}>Complete all {steps.length} guided steps above to unlock the free lab environment</div>}
          </div>
        ) : (
          <div style={{ border: '1px solid ' + accent + '30', borderRadius: '10px', overflow: 'hidden', background: '#020608' }}>
            <FreeLabTerminal moduleId={moduleId} moduleName={moduleName} accent={accent} onClose={() => setFreeLaunched(false)} />
            <div style={{ padding: '8px 16px', background: '#020a0e', borderTop: '1px solid ' + accent + '15', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: accent, boxShadow: '0 0 5px ' + accent }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#3a7a8a' }}>
                Free practice mode. Ask <span style={{ color: accent }}>GHOST AGENT</span> (bottom-right) for guidance on any OSINT technique or tool.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Quick reference */}
      <div style={{ marginBottom: '2rem' }}>
        <button onClick={() => setShowKeywords(!showKeywords)} style={{ background: 'transparent', border: '1px solid #003a4a', borderRadius: '5px', padding: '8px 16px', cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#3a7a8a', letterSpacing: '0.1em', marginBottom: showKeywords ? '12px' : 0 }}>
          {showKeywords ? '▼' : '▶'} QUICK REFERENCE — OSINT COMMANDS & TOOLS
        </button>
        {showKeywords && (
          <div style={{ background: '#020608', border: '1px solid #001a2a', borderRadius: '6px', padding: '1.25rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '8px' }}>
              {[
                ['whois example.com', 'Domain registration data, registrar, expiry'],
                ['dig example.com ANY', 'All DNS record types at once'],
                ['dig axfr @ns1.example.com example.com', 'Attempt zone transfer'],
                ['curl -s "https://crt.sh/?q=%.example.com&output=json" | jq -r ".[].name_value" | sort -u', 'CT log subdomain harvest'],
                ['subfinder -d example.com -all -silent', 'Fast passive subdomain enumeration'],
                ['amass enum -d example.com', 'Comprehensive subdomain + DNS brute force'],
                ['gobuster dns -d example.com -w wordlist.txt', 'DNS brute force with wordlist'],
                ['theHarvester -d example.com -b all', 'Email and host harvesting'],
                ['holehe email@example.com', 'Check email on 120+ services'],
                ['shodan search ssl.cert.subject.o:"Corp"', 'Find all assets by TLS cert org'],
                ['shodan host 1.2.3.4', 'Full details on a specific IP'],
                ['exiftool -csv /path/to/files/', 'Batch metadata extraction to CSV'],
                ['exiftool -all= file.jpg', 'Strip all metadata from file'],
                ['site:example.com filetype:pdf', 'Google dork: find PDFs on domain'],
                ['site:linkedin.com/in "Example Corp"', 'LinkedIn employees via Google'],
                ['dnsx -l subdomains.txt -a -resp', 'Resolve and filter live subdomains'],
              ].map(([cmd, desc]) => (
                <div key={cmd} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '6px 8px', background: '#010408', borderRadius: '4px' }}>
                  <code style={{ color: accent, fontSize: '0.68rem', flexShrink: 0 }}>{cmd}</code>
                  <span style={{ color: '#4a8a9a', fontSize: '0.68rem' }}>{desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer nav */}
      <div style={{ paddingTop: '2rem', borderTop: '1px solid #001a2a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' as const, gap: '10px' }}>
        <Link href="/modules/osint" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#3a7a8a' }}>&#8592; BACK TO CONCEPT</Link>
        <Link href="/modules/crypto/lab" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#3a7a8a' }}>MOD-03 CRYPTO LAB &#8594;</Link>
      </div>
    </div>
  )
}
