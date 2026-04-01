'use client'
import React from 'react'
import Link from 'next/link'

const accent = '#ff6ec7'
const dim = '#6a4a5a'
const border = '#3a0028'

const Pre = ({ label, children }: { label?: string; children: string }) => (
  <div style={{ margin: '1rem 0 1.5rem' }}>
    {label && <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: dim, letterSpacing: '0.15em', marginBottom: '4px' }}>{label}</div>}
    <pre style={{ background: '#040404', border: '1px solid ' + border, borderRadius: '4px', padding: '1.25rem', overflow: 'auto', color: accent, fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', lineHeight: 1.7, whiteSpace: 'pre' as const }}>{children}</pre>
  </div>
)

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.1rem', fontWeight: 600, color: accent, marginTop: '2.5rem', marginBottom: '0.75rem' }}>
    <span style={{ color: border, marginRight: '8px' }}>//</span>{children}
  </h2>
)

const P = ({ children }: { children: React.ReactNode }) => (
  <p style={{ color: '#8a9a8a', lineHeight: 1.8, marginBottom: '1rem', fontSize: '0.9rem' }}>{children}</p>
)

const Note = ({ children }: { children: React.ReactNode }) => (
  <div style={{ background: 'rgba(255,110,199, 0.06)', border: '1px solid rgba(255,110,199, 0.25)', borderRadius: '6px', padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: accent, letterSpacing: '0.15em', marginBottom: '6px' }}>BEGINNER NOTE</div>
    <p style={{ color: '#8a9a9a', fontSize: '0.82rem', lineHeight: 1.7, margin: 0 }}>{children}</p>
  </div>
)

export default function SocialEngineeringLab() {
  return (
    <div style={{ minHeight: '100vh', background: '#0c0008', color: '#c8b8c8', fontFamily: 'system-ui, sans-serif', padding: '2rem' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>

        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: dim, marginBottom: '2rem', letterSpacing: '0.1em' }}>
          <Link href="/" style={{ color: dim, textDecoration: 'none' }}>GHOSTNET</Link>
          <span style={{ margin: '0 0.5rem' }}>&gt;</span>
          <Link href="/modules/social-engineering" style={{ color: dim, textDecoration: 'none' }}>SOCIAL ENGINEERING</Link>
          <span style={{ margin: '0 0.5rem' }}>&gt;</span>
          <span style={{ color: accent }}>LAB</span>
        </div>

        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: dim, letterSpacing: '0.2em', marginBottom: '0.5rem' }}>HANDS-ON LAB</div>
          <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '2rem', fontWeight: 700, color: accent, margin: 0 }}>Social Engineering Lab</h1>
          <p style={{ color: '#7a4a6a', marginTop: '0.75rem', fontSize: '0.9rem' }}>
            OSINT profiling, phishing framework setup, email header analysis, and awareness training.{' '}
            <Link href="/modules/social-engineering" style={{ color: accent, textDecoration: 'none' }}>Back to Concept &rarr;</Link>
          </p>
        </div>

        <div style={{ background: 'rgba(255,80,80,0.07)', border: '1px solid rgba(255,80,80,0.3)', borderRadius: '8px', padding: '1.25rem 1.5rem', marginBottom: '2rem' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#ff5050', letterSpacing: '0.15em', marginBottom: '0.5rem' }}>ETHICS AND AUTHORIZATION NOTICE</div>
          <p style={{ fontSize: '0.85rem', color: '#9a7a7a', lineHeight: 1.7, margin: 0 }}>All exercises on this page are designed for defensive awareness and authorized red team engagements only. Sending phishing emails, cloning sites, or making vishing calls against real people or organizations without written permission is illegal under the Computer Fraud and Abuse Act, the UK Computer Misuse Act, and equivalent laws worldwide. All lab work must be performed in isolated, self-contained environments.</p>
        </div>

        <H2>01 — OSINT Target Profiling for Spear Phishing</H2>
        <P>Before any social engineering engagement, a red teamer builds a detailed profile of the target. This exercise demonstrates the reconnaissance methodology using open-source tools. Understanding this process helps defenders know what attackers already know about their employees.</P>
        <Note>theHarvester is pre-installed on Kali Linux. It queries search engines, LinkedIn, GitHub, and other public sources for email addresses and names associated with a domain. This is entirely passive — no contact with the target organization's systems at all.</Note>
        <Pre label="// EXERCISE 1 — BUILD A TARGET PROFILE FOR SPEAR PHISHING">{`# Install theHarvester (pre-installed on Kali):
pip3 install theHarvester

# Harvest emails and names from a domain (use your own domain for testing):
theHarvester -d example.com -b google,bing,linkedin

# Save output to file:
theHarvester -d example.com -b all -f harvest_output

# Use hunter.io API for email pattern discovery (free tier available):
# Replace API_KEY with your hunter.io API key
curl "https://api.hunter.io/v2/domain-search?domain=example.com&api_key=API_KEY"

# The response reveals:
# - Email format (e.g. firstname.lastname@company.com)
# - Confidence scores per address
# - Names attached to addresses

# LinkedIn OSINT without an account — use Google dorks:
# site:linkedin.com/in "Example Corp" "Security"
# site:linkedin.com/in "Example Corp" "IT Administrator"

# Build a profile document from gathered intel:
# Name, title, email, phone (if public), interests, recent posts
# This feeds directly into a personalized spear phishing pretext

# Check for data breaches (use HaveIBeenPwned API):
curl "https://haveibeenpwned.com/api/v3/breachedaccount/target@example.com" \
  -H "hibp-api-key: YOUR_HIBP_KEY"`}</Pre>

        <H2>02 — Set Up Gophish Lab Environment</H2>
        <P>Gophish is an open-source phishing framework used by authorized red teams. This exercise walks through setting up Gophish locally for a controlled internal test — never against external targets without an engagement contract.</P>
        <Note>Gophish runs a web admin panel on port 3333 by default and an SMTP listener on port 8080. For real engagements, you would configure it with a legitimate-looking domain and sending infrastructure. For this lab, localhost only.</Note>
        <Pre label="// EXERCISE 2 — CONFIGURE GOPHISH PHISHING FRAMEWORK">{`# Download Gophish from GitHub releases:
wget https://github.com/gophish/gophish/releases/download/v0.12.1/gophish-v0.12.1-linux-64bit.zip

# Extract:
unzip gophish-v0.12.1-linux-64bit.zip
cd gophish-v0.12.1-linux-64bit

# Make executable and launch:
chmod +x gophish
./gophish

# On first run, it prints the admin password to stdout:
# msg="Please login with the username admin and the password: GENERATED_PASS"

# Open the admin UI:
# https://localhost:3333
# Login: admin / GENERATED_PASS (change immediately)

# Gophish configuration sections:
# Sending Profiles — SMTP server configuration for sending emails
# Landing Pages — HTML pages users land on after clicking links
# Email Templates — the phishing email body and subject
# Users & Groups — target email lists
# Campaigns — combine template + landing page + group + schedule

# For local testing, use a local SMTP server:
python3 -m smtpd -n -c DebuggingServer localhost:25

# In Gophish, set sending profile to localhost:25

# Export campaign results as CSV after running a test:
# Dashboard -> Campaign -> Export Results`}</Pre>

        <H2>03 — Clone a Login Page for Analysis</H2>
        <P>Understand how phishing pages are constructed by analysing and building a clone in a lab environment. This knowledge is used defensively to train users to spot subtle URL and content differences.</P>
        <Pre label="// EXERCISE 3 — CREDENTIAL HARVESTER PAGE ANALYSIS">{`# Method 1: wget site clone (for local analysis only)
# Clone a page structure to understand it:
wget --mirror --page-requisites --no-parent https://localhost/login

# Method 2: Using SET (Social Engineer Toolkit) — on Kali:
# Launch SET:
sudo setoolkit

# Navigate menus:
# 1) Social-Engineering Attacks
# 2) Website Attack Vectors
# 3) Credential Harvester Attack Method
# 2) Site Cloner
# Enter your Kali IP when prompted
# Enter the URL to clone (use your own test site)

# Method 3: Manual approach — inspect and recreate:
# Open browser DevTools on a test login page you own
# Copy the HTML form structure
# Modify the action= attribute to point to a local PHP handler

# Example minimal credential capture handler (for lab analysis):
# File: capture.php
# <?php
# $user = $_POST['username'];
# $pass = $_POST['password'];
# file_put_contents('creds.txt', $user . ':' . $pass . PHP_EOL, FILE_APPEND);
# header('Location: https://legitimate-site.com/login');
# ?>

# Host locally with PHP:
# php -S 0.0.0.0:8080

# What defenders look for in a phishing page:
# - Domain name differs from legitimate site (typosquatting)
# - SSL certificate issued to wrong organization
# - Form action URL pointing to a different domain
# - JavaScript redirecting after credential capture`}</Pre>

        <H2>04 — Email Header Analysis</H2>
        <P>Phishing emails often arrive with spoofed From addresses. Email headers contain a detailed trail of every server the message passed through — learning to read them reveals whether an email is legitimate.</P>
        <Note>The Received headers are added in reverse order — the bottom-most Received line is where the email originated. Work upward through the chain to trace the path from sender to your inbox. A spoofed From address does not affect the Received chain.</Note>
        <Pre label="// EXERCISE 4 — ANALYSE PHISHING EMAIL HEADERS">{`# Save a raw email with headers as email.eml
# In Gmail: three-dot menu -> Show original -> Copy to file
# In Outlook: File -> Properties -> Internet Headers

# Parse headers with Python (built-in email library):
python3 - << 'PYEOF'
import email
with open('email.eml', 'r') as f:
    msg = email.message_from_file(f)
print("From:", msg['From'])
print("Reply-To:", msg['Reply-To'])
print("Return-Path:", msg['Return-Path'])
print("Message-ID:", msg['Message-ID'])
received = msg.get_all('Received')
for i, hop in enumerate(received):
    print(f"Hop {i+1}: {hop[:120]}")
PYEOF

# Check SPF, DKIM, DMARC results (look in Authentication-Results header):
grep -i "spf\|dkim\|dmarc" email.eml

# SPF pass = sending server is authorized for the domain
# DKIM pass = message body has not been modified
# DMARC pass = both SPF and DKIM aligned with From domain
# Any FAIL result is a strong phishing indicator

# Extract all URLs from the email body:
grep -oE "https?://[a-zA-Z0-9./?=_&%-]+" email.eml | sort -u

# Check each URL against VirusTotal (requires API key):
curl "https://www.virustotal.com/api/v3/urls" \
  -X POST \
  -H "x-apikey: YOUR_VT_API_KEY" \
  -d "url=http://suspicious-url-here.com"

# Use mxtoolbox for header analysis (web tool, no install needed):
# https://mxtoolbox.com/EmailHeaders.aspx`}</Pre>

        <H2>05 — Vishing Scenario Analysis</H2>
        <P>Voice phishing (vishing) relies on psychological manipulation rather than technical exploits. This exercise analyses published transcripts of known vishing attacks to identify the techniques used — building defensive recognition skills without any real phone calls.</P>
        <Pre label="// EXERCISE 5 — VISHING SCENARIO ANALYSIS">{`# This exercise analyses transcripts — no actual calls are made.
# Study the following documented vishing scenarios:

# SCENARIO A — IT Help Desk Impersonation
# ----------------------------------------
# Attacker: "Hi, this is Mark from IT. We're seeing some unusual
# login activity on your account. I need to verify your identity
# before we lock you out. Can you confirm your employee ID?"
#
# Manipulation techniques identified:
# [1] URGENCY: "unusual activity", "before we lock you out"
# [2] AUTHORITY: claiming to be from IT department
# [3] RECIPROCITY: framing it as helping the victim
# [4] FEAR: threat of losing account access

# SCENARIO B — Bank Fraud Department
# ------------------------------------
# "This is an automated security alert from First National Bank.
# We have detected a fraudulent transaction of $847 on your account.
# Press 1 to speak with a fraud specialist to reverse this charge."
#
# Manipulation techniques identified:
# [1] FEAR: fraudulent transaction
# [2] SPECIFICITY: exact dollar amount builds false credibility
# [3] CALL TO ACTION: press 1 (removes victim decision-making)
# [4] TIME PRESSURE: implied immediate action required

# SCENARIO C — CEO Fraud (BEC)
# -----------------------------
# "Hey, it's David from the executive office. I'm in a meeting
# and I need you to process an urgent wire transfer. I'll send
# the details by email — don't discuss this with anyone yet."
#
# Manipulation techniques identified:
# [1] AUTHORITY: CEO impersonation
# [2] SECRECY: "don't discuss with anyone" prevents verification
# [3] URGENCY: meeting context creates pressure
# [4] FAMILIARITY: informal tone ("Hey") bypasses skepticism

# Red flags to document in awareness training:
# - Caller creates urgency or fear
# - Requests credentials, codes, or financial actions
# - Asks you not to verify with others
# - Unexpected contact out of normal workflow`}</Pre>

        <H2>06 — Build Security Awareness Training Content</H2>
        <P>Apply what you have learned in exercises 1-5 to create a practical employee awareness guide. Red team knowledge directly informs the best defensive training content.</P>
        <Pre label="// EXERCISE 6 — CREATE EMPLOYEE AWARENESS MATERIAL">{`# Security Awareness Guide Template
# Generated from red team reconnaissance findings
# ================================================

# SECTION 1: WHAT ATTACKERS ALREADY KNOW ABOUT YOU
# --------------------------------------------------
# Before contacting you, attackers will have found:
# - Your full name, title, and email address (LinkedIn, company website)
# - Your email format (e.g. first.last@company.com)
# - Your manager and team members (org chart inference)
# - Projects you are working on (GitHub, conference talks, press releases)
# - Whether your email appeared in a data breach
#
# Action: Review what your public LinkedIn profile reveals.
# Consider what a stranger would know about you from it.

# SECTION 2: PHISHING EMAIL RED FLAGS CHECKLIST
# -----------------------------------------------
# [ ] Does the From address match the display name exactly?
# [ ] Does the sending domain match the company it claims to be from?
# [ ] Does the email create urgency or threaten negative consequences?
# [ ] Are there hover-links that do not match the visible URL text?
# [ ] Does the email ask for credentials, codes, or wire transfers?
# [ ] Did you receive this email unexpectedly without prior context?
# [ ] Does the greeting use your name but feel impersonal otherwise?

# SECTION 3: PHONE CALL (VISHING) RED FLAGS
# -------------------------------------------
# [ ] Caller claims to be IT, HR, finance, or executive
# [ ] Caller asks you not to verify with your manager
# [ ] Call involves urgency or a threat (account locked, fraud detected)
# [ ] Caller asks for a password, OTP code, or to install software
# [ ] Caller uses your name but you cannot verify their identity
#
# ALWAYS: Hang up and call back on a verified number from the company directory

# SECTION 4: SAFE VERIFICATION PROCEDURES
# -----------------------------------------
# Email asking for action: Forward to security@company.com before acting
# Urgent call from IT: Hang up, call IT directly using internal directory
# Request for wire transfer: Verify in person or by known phone number
# Suspicious attachment: Do not open — submit to security team

# SECTION 5: REPORTING PROCEDURE
# --------------------------------
# Report phishing: phishing@company.com or internal ticketing system
# Report vishing calls: security@company.com with call time and number
# Report lost devices: contact IT security immediately
# No blame culture — reporting is encouraged and rewarded`}</Pre>

        <H2>Check Your Understanding</H2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
          {[
            '1. What three DNS mechanisms (SPF, DKIM, DMARC) protect against email spoofing, and what does each check?',
            '2. In the Received header chain of an email, do you read top-to-bottom or bottom-to-top to trace the origin?',
            '3. What psychological principle does "I need to verify your identity before we lock you out" exploit?',
            '4. Why does a phishing email using your correct name and company name feel more convincing than a generic one?',
            '5. What is the single most effective action an employee can take when receiving an unexpected urgent request by phone?',
          ].map((q, i) => (
            <div key={i} style={{ background: '#0a0005', border: '1px solid ' + border, borderRadius: '4px', padding: '0.85rem 1rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', color: '#9a7a8a' }}>{q}</div>
          ))}
        </div>

        <H2>Further Practice</H2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '3rem' }}>
          {[
            { label: 'TryHackMe — Phishing Analysis Fundamentals', url: 'https://tryhackme.com/room/phishingemails1tryoe' },
            { label: 'TryHackMe — Phishing Prevention', url: 'https://tryhackme.com/room/phishingemails5fgjlzxc' },
            { label: 'TryHackMe — Social Engineering (Red Team Path)', url: 'https://tryhackme.com/room/socialengineering' },
            { label: 'SANS Security Awareness Training Resources', url: 'https://www.sans.org/security-awareness-training/' },
          ].map((r, i) => (
            <a key={i} href={r.url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', background: '#0a0005', border: '1px solid ' + border, borderRadius: '4px', padding: '0.75rem 1rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', color: accent, textDecoration: 'none' }}>
              &rarr; {r.label}
            </a>
          ))}
        </div>

        <div style={{ borderTop: '1px solid ' + border, paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/modules/social-engineering" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', color: dim, textDecoration: 'none' }}>&larr; Back to Concept</Link>
          <Link href="/modules" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', color: accent, textDecoration: 'none' }}>All Modules &rarr;</Link>
        </div>

      </div>
    </div>
  )
}
