'use client'
import React from 'react'
import Link from 'next/link'

const accent = '#ff6ec7'
const Pre = ({ label, children }: { label?: string; children: string }) => (
  <div style={{ margin: '1rem 0 1.5rem' }}>
    {label && <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#6a4a5a', letterSpacing: '0.15em', marginBottom: '4px' }}>{label}</div>}
    <pre style={{ background: '#080408', border: '1px solid #3a0028', borderRadius: '4px', padding: '1.25rem', overflow: 'auto', color: accent, fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', lineHeight: 1.7, whiteSpace: 'pre' as const }}>{children}</pre>
  </div>
)
const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.1rem', fontWeight: 600, color: accent, marginTop: '3rem', marginBottom: '1rem' }}>
    <span style={{ color: '#3a0028', marginRight: '8px' }}>//</span>{children}
  </h2>
)
const H3 = ({ children }: { children: React.ReactNode }) => (
  <h3 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', fontWeight: 600, color: '#cc55a0', marginTop: '2rem', marginBottom: '0.75rem' }}>
    &#9658; {children}
  </h3>
)
const P = ({ children }: { children: React.ReactNode }) => <p style={{ color: '#9a8a9a', lineHeight: 1.8, marginBottom: '1rem', fontSize: '0.9rem' }}>{children}</p>
const Note = ({ children }: { children: React.ReactNode }) => (
  <div style={{ background: 'rgba(255,110,199,0.05)', border: '1px solid rgba(255,110,199,0.2)', borderRadius: '6px', padding: '1rem 1.25rem', marginBottom: '1.5rem', marginTop: '0.5rem' }}>
    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#ff6ec7', letterSpacing: '0.15em', marginBottom: '6px' }}>BEGINNER NOTE</div>
    <p style={{ color: '#8a9a9a', fontSize: '0.82rem', lineHeight: 1.7, margin: 0, fontFamily: 'sans-serif' }}>{children}</p>
  </div>
)
const Warn = ({ children }: { children: React.ReactNode }) => (
  <div style={{ background: 'rgba(255,65,54,0.05)', borderLeft: '3px solid #ff4136', padding: '1rem 1.25rem', borderRadius: '0 4px 4px 0', margin: '1.5rem 0', border: '1px solid rgba(255,65,54,0.2)', borderLeftColor: '#ff4136' }}>
    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#ff4136', letterSpacing: '0.2em', marginBottom: '6px' }}>WARNING</div>
    <div style={{ color: '#9a8a9a', fontSize: '0.85rem', lineHeight: 1.7 }}>{children}</div>
  </div>
)
const Table = ({ headers, rows }: { headers: string[]; rows: string[][] }) => (
  <div style={{ overflowX: 'auto', margin: '1rem 0 1.5rem' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem' }}>
      <thead><tr style={{ borderBottom: '1px solid #3a0028' }}>{headers.map((h, i) => <th key={i} style={{ textAlign: 'left', padding: '8px 12px', color: accent, fontWeight: 600, fontSize: '0.7rem' }}>{h}</th>)}</tr></thead>
      <tbody>{rows.map((row, i) => <tr key={i} style={{ borderBottom: '1px solid #1a0014', background: i % 2 === 0 ? 'transparent' : 'rgba(255,110,199,0.02)' }}>{row.map((cell, j) => <td key={j} style={{ padding: '8px 12px', color: '#9a8a9a', verticalAlign: 'top' }}>{cell}</td>)}</tr>)}</tbody>
    </table>
  </div>
)

export default function SocialEngineering() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#6a4a5a' }}>
        <Link href="/" style={{ color: '#6a4a5a', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>&#8250;</span><span style={{ color: accent }}>MOD-10 // SOCIAL ENGINEERING</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <span style={{ padding: '3px 10px', background: 'rgba(255,110,199,0.08)', border: '1px solid rgba(255,110,199,0.3)', borderRadius: '3px', color: accent, fontSize: '8px' }}>CONCEPT</span>
          <Link href="/modules/social-engineering/lab" style={{ textDecoration: 'none', padding: '3px 10px', background: 'rgba(255,110,199,0.1)', border: '1px solid rgba(255,110,199,0.5)', borderRadius: '3px', color: '#ff6ec7', fontSize: '8px', letterSpacing: '0.15em', fontWeight: 700 }}>LAB &#8594;</Link>
        </div>
      </div>

      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#6a4a5a', letterSpacing: '0.25em', marginBottom: '0.5rem' }}>MODULE 10 &middot; CONCEPT PAGE</div>
        <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '2rem', fontWeight: 700, color: accent, margin: '0.5rem 0', textShadow: 'rgba(255,110,199,0.35) 0 0 20px' }}>SOCIAL ENGINEERING</h1>
        <p style={{ color: '#6a4a5a', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem' }}>Phishing &middot; Vishing &middot; Pretexting &middot; Spear phishing &middot; BEC &middot; MFA bypass &middot; Smishing &middot; Physical intrusion &middot; Deepfakes</p>
      </div>

      {/* TOC */}
      <div style={{ background: '#090408', border: '1px solid #3a0028', borderRadius: '6px', padding: '1.25rem', marginBottom: '2.5rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#6a4a5a', letterSpacing: '0.2em', marginBottom: '0.75rem' }}>TABLE OF CONTENTS</div>
        {[
          '01 — Psychology of Manipulation',
          '02 — Phishing Infrastructure',
          '03 — Spear Phishing — Targeted Attacks',
          '04 — Vishing (Voice Phishing) & MFA Bypass',
          '05 — Smishing & Mobile Attacks',
          '06 — Business Email Compromise (BEC)',
          '07 — SET — Social Engineer Toolkit',
          '08 — Physical Social Engineering',
          '09 — Deepfakes & AI-Assisted SE',
          '10 — Campaign Planning & Red Team SE Ops',
          '11 — Defence & Awareness Training',
        ].map((item, i) => (
          <div key={i} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#6a4a5a', padding: '3px 0', display: 'flex', gap: '8px' }}>
            <span style={{ color: '#3a0028' }}>&#9002;</span>
            <span>{item}</span>
          </div>
        ))}
      </div>

      <H2>01 — Psychology of Manipulation</H2>
      <P>Social engineering is the art of manipulating people into taking actions they would not normally take. Unlike hacking software, it targets the human operating the software. It is consistently the number one initial access vector in real-world breaches — because a person can be tricked even when the technology is perfectly secure.</P>
      <Note>Understanding social engineering psychology is both how attackers think and what defenders must teach. The same principles that make SE attacks so effective are the ones that security awareness training must address. An attack works because of human wiring — not stupidity. Anyone can be manipulated by a sufficiently well-crafted pretext.</Note>

      <Pre label="// CIALDINI'S 6 PRINCIPLES — HOW ATTACKERS USE THEM">{`# 1. AUTHORITY
# People comply with those they perceive as having power or expertise
# Impersonate: IT department, CEO, auditor, government, vendor
# "This is Sarah from IT Security — we detected a breach on your account"
# "The CFO needs this wire transferred by end of day"

# 2. SCARCITY / URGENCY
# People act fast when they think they have little time or may miss out
# "Your account will be locked in 24 hours — click here to prevent"
# "This approval needs to happen before the board meeting in 30 minutes"
# Creates panic → bypasses rational thinking → skips verification

# 3. SOCIAL PROOF
# People follow what others are doing, especially in uncertain situations
# "Your colleagues have already updated their credentials"
# "All other team members completed this mandatory security check"
# Normalizes the malicious action → removes the victim's hesitation

# 4. LIKING / RAPPORT
# People are more easily persuaded by those they like or feel connected to
# Spend time building relationship BEFORE the ask
# Mirror speech patterns, reference common interests, compliment
# "I noticed on LinkedIn you went to X — I know people there"

# 5. RECIPROCITY
# People feel obligated to return favours
# Give something first: "helpful" document, useful information, a favour
# Victim feels obligated to comply with subsequent request
# Malicious attachment inside a genuinely helpful email

# 6. COMMITMENT / CONSISTENCY
# Once people commit to something, they act in ways consistent with that commitment
# Get small commitments first, escalate gradually
# "Can you confirm your department?" → "Can you confirm your username?"
# → "I need you to verify the reset code that just came to your phone"

# EMOTIONAL LEVERS MOST EXPLOITED:
# Fear (your account is compromised)
# Greed (you have a pending payment)
# Curiosity (see what was said about you)
# Urgency (time-limited action required)
# Helpfulness (the attacker "needs" your help)
# Embarrassment avoidance (prevent a problem being your fault)`}</Pre>

      <H3>Attack Surface: The Human Layer</H3>
      <Table
        headers={['TARGET ROLE', 'WHY TARGETED', 'COMMON PRETEXT']}
        rows={[
          ['Help Desk / IT Support', 'Trained to help, process password resets', 'Password reset request, account lockout'],
          ['Finance / Accounts Payable', 'Can transfer money, access payment systems', 'CEO wire transfer request, vendor invoice'],
          ['Executive Assistants', 'Access to executive calendars and systems', 'Scheduling request from "CEO contact"'],
          ['New Employees', 'Unfamiliar with procedures, eager to please', 'Onboarding request, IT setup'],
          ['Executives (C-Suite)', 'High value targets, access to decisions/money', 'Vendor impersonation, board-level urgency'],
          ['Developers', 'Access to code, credentials, CI/CD systems', 'Package/dependency notice, security alert'],
        ]}
      />

      <H2>02 — Phishing Infrastructure</H2>
      <Note>Phishing is sending fake emails (or messages) designed to look legitimate. The goal is to steal credentials, install malware, or trick someone into transferring money. The infrastructure — domains, mail servers, tracking pixels — is what separates a crude attack from a professional campaign that defeats email security controls.</Note>

      <Pre label="// BUILD A PROFESSIONAL PHISHING CAMPAIGN">{`# Gophish — open-source phishing framework
# Download: https://getgophish.com

wget https://github.com/gophish/gophish/releases/latest/download/gophish-v0.12.1-linux-64bit.zip
unzip gophish*.zip && chmod +x gophish
./gophish
# Dashboard: https://localhost:3333 (admin/gophish — change immediately)

# Campaign setup flow:
# 1. Sending Profile → SMTP server to send from
# 2. Landing Page → clone a real login page
# 3. Email Template → craft phishing email
# 4. Users & Groups → import target CSV list
# 5. Campaign → combine above, set schedule, click tracking

# Clone a legitimate login page:
# In Gophish: Landing Pages → New Page → Import Site
# URL: https://accounts.google.com
# ✓ Capture submitted data
# ✓ Capture passwords
# Redirect to: https://accounts.google.com (after capture — user sees real site)

# Domain setup (critical for deliverability):
# Register lookalike domain: m1crosoft.com, micros0ft-helpdesk.com
# SSL certificate (free): certbot certonly --standalone -d DOMAIN.com
# DNS records for email deliverability:
# SPF: v=spf1 ip4:YOUR_VPS_IP -all
# DKIM: generate with opendkim, add TXT record
# DMARC: v=DMARC1; p=none; rua=mailto:admin@DOMAIN.com
# MX: mail.DOMAIN.com pointing to your mail server

# Postfix SMTP server:
sudo apt install postfix
# Send test: echo "Test" | mail -s "Subject" target@company.com
# Check: mail-tester.com (spam score) before sending campaign

# Track metrics:
# Open rate: who opened the email (tracking pixel)
# Click rate: who clicked the phishing link
# Credential rate: who submitted credentials
# Time from send to click (urgency effectiveness)
# Which departments/roles are most susceptible`}</Pre>

      <H3>Email Header Spoofing</H3>
      <Pre label="// MAKE EMAILS LOOK LEGITIMATE">{`# WITHOUT your own SMTP server, can you spoof headers?
# Answer: Sometimes — depends on target's email security

# Check if target validates DMARC/DKIM/SPF:
# Strict DMARC (p=reject): very hard to spoof
# No DMARC or p=none: can spoof From header

# Check target's DMARC:
dig TXT _dmarc.targetcompany.com
# "v=DMARC1; p=reject..." → strong, hard to spoof
# "v=DMARC1; p=none..." or no record → weak, easier to spoof

# Swaks — SMTP testing:
sudo apt install swaks
swaks --to target@company.com \
  --from "IT Security <security@company.com>" \
  --header "Subject: Urgent: Password Reset Required" \
  --body "Click here to reset" \
  --server mail.company.com

# HTML email crafting:
# Match exact email template of IT department
# Same logo, same fonts, same footer
# Inspect real emails from target org (if available)
# Copy headers, branding, legal disclaimers`}</Pre>

      <H2>03 — Spear Phishing — Targeted Attacks</H2>
      <P>Generic phishing casts a wide net — millions of emails with obvious red flags. Spear phishing is the sniper version: one email, one target, customized with real details from their LinkedIn, company website, and social media. Detection rates for spear phishing are much lower because the email looks completely legitimate to the recipient.</P>

      <Pre label="// OSINT → CUSTOM TARGETED EMAIL">{`# Step 1: Reconnaissance on specific target
# LinkedIn:
#   Job title, department, manager, direct reports
#   Technologies listed (tools they use daily)
#   Recent activity (what they are working on)
#   Connections (who do they know at company)
#
# Company website:
#   Team page photos + names + titles
#   Press releases (projects, partners, events)
#   Job postings (what tools/tech they use internally)
#   Events they attend or speak at
#
# Social media:
#   Twitter/X: recent complaints, opinions, pet projects
#   GitHub: code they wrote, open source contributions
#   Conference talks: what topics they care about

# Step 2: Build a compelling pretext
# BAD pretext: "Click here to verify your account"
# GOOD pretext:
# "Hi Alex — following up from the Salesforce migration meeting
#  last Tuesday. As discussed with Emma, here is the updated Q3
#  reporting template. I have also attached the API credentials for
#  the staging environment that Mike mentioned were needed before EOD."
#
# Uses: real names from LinkedIn, real project name from job posting,
#       real tool (Salesforce), realistic internal urgency

# Step 3: Weaponize the attachment
# Malicious Word doc (macro-enabled):
# Office 2016+ requires macro enable → "Enable editing" + "Enable content"
# Many organisations still have this attack vector open

# HTML smuggling (modern, bypasses many email gateways):
# JavaScript assembles payload in browser memory
# < Antivirus cannot scan what is not a file on disk
# Highly effective against signature-based email security

# Step 4: Send from correct identity
# Register similar domain: alex@company-IT.com vs it@company.com
# Match company email signature exactly (check their email footer online)
# Warm up the sending domain before campaign

# OSINT Tools:
# TheHarvester: find employee emails by domain
# Hunter.io: find and verify email addresses
# LinkedIn Sales Navigator: detailed employee mapping
# OSINT Framework: osintframework.com`}</Pre>

      <H2>04 — Vishing (Voice Phishing) & MFA Bypass</H2>
      <Note>Vishing (voice phishing) uses phone calls instead of email. It is extremely effective because most people are conditioned to be helpful on the phone and feel social pressure not to challenge an authority figure. Real-time MFA bypass — where the attacker calls while simultaneously logging in, and asks the victim to read back the OTP code — is one of the most damaging modern attack variants. It bypasses hardware MFA if the attacker is quick enough.</Note>

      <Pre label="// VISHING SCRIPTS AND MFA BYPASS">{`# Caller ID spoofing:
# Twilio: programmatic caller ID control ($0.01/min)
# SpoofCard: consumer spoofing service
# Goal: display company internal number or trusted vendor number

# IT Helpdesk pretext (classic MFA bypass):
"""
"Hi, this is Mark from IT Security Operations. We have detected
some unusual login activity on your account from an IP in Russia.
I need to verify your identity before we lock the account as a
precaution.

Can you confirm your username for me? Great. I am going to trigger
a verification code to your phone right now. When you receive the
text, can you read it back to me so I can confirm it is you?"
"""
# → Attacker has already entered victim's username + password (from prior phish)
# → Entering TOTP code in real-time → bypasses 2FA completely

# Executive impersonation (BEC via phone):
"""
"Hi Sarah, it is [CEO first name] here. I am in a board meeting
and I cannot go through the normal channels right now.
I need you to process an urgent wire transfer — I will explain
the full context later. This is extremely time-sensitive and
needs to stay confidential until the deal closes."
"""

# Vendor impersonation (technical support):
"""
"Hi, this is David calling from Microsoft 365 support.
We have detected that your organisation's email domain is about
to be suspended due to a DMARC compliance issue.
I need to walk you through a quick fix — can you go to your
admin portal while we are on the call?"
"""

# Effective vishing tactics:
# 1. Never give victim time to think — maintain control of conversation
# 2. Use urgency throughout — time pressure prevents rational decisions
# 3. Name-drop real employees and projects (from OSINT)
# 4. Have a backup story ready if challenged
# 5. Show caller ID as internal or known number
# 6. Call at busy times (Monday morning, just before lunch) — lower guard`}</Pre>

      <H2>05 — Smishing & Mobile Attacks</H2>
      <P>Smishing (SMS phishing) exploits the fact that people are more trusting of text messages and mobile notifications than email. SMS lacks the filtering infrastructure of email, and short URLs on mobile make it impossible to preview the destination. Mobile OS notifications from fake apps compound the problem.</P>

      <Pre label="// SMS AND MOBILE SOCIAL ENGINEERING">{`# Smishing attack types:
# 1. Package delivery: "Your parcel could not be delivered — update address"
#    → Links to fake Royal Mail / FedEx / DHL page → steals card details
#
# 2. Bank alerts: "Suspicious transaction detected on your account"
#    → Fake bank login page → steals credentials + MFA bypass
#
# 3. Government impersonation: "HMRC: You have a tax refund pending"
#    → Fake HMRC portal → collects NI number, bank details
#
# 4. Two-factor intercept: "Your verification code is XXXXX — never share this"
#    → Urgency framing → "Support" calls asking for it immediately after

# SMS sending tools for authorised testing:
# Twilio API (programmable SMS)
# AWS SNS (mass SMS)
# TextNow / Google Voice (disposable numbers)

# iMessage / WhatsApp impersonation:
# Create account with company name in profile
# WhatsApp "Business" API allows verified business names
# iMessage: sender ID spoofing not possible but display name manipulation
# Telegram: bots with company-looking names

# QR code phishing (Quishing):
# Embed malicious URL in QR code instead of link
# QR codes bypass URL-checking in email gateways
# Most AV cannot scan inside QR images
# "Scan to access the meeting" → credential harvest page
# Physical: place QR stickers over legitimate ones in public spaces`}</Pre>

      <H2>06 — Business Email Compromise (BEC)</H2>
      <P>BEC is one of the most financially damaging attack types globally. The FBI IC3 report consistently shows BEC losses exceeding all other cybercrime categories combined. It targets the financial transfer process specifically, often without any malware involved — purely social engineering combined with legitimate email access or domain spoofing.</P>

      <Table
        headers={['BEC TYPE', 'METHOD', 'AVERAGE LOSS']}
        rows={[
          ['CEO Fraud', 'Impersonate CEO requesting urgent wire transfer to finance team', '$125,000+'],
          ['Vendor Impersonation', 'Spoof vendor email, change payment bank account details', '$50,000-$500,000'],
          ['Account Takeover', 'Compromise real email account, monitor for payment conversations', 'Varies'],
          ['Attorney Impersonation', 'Impersonate lawyer during deal closing, redirect funds', '$250,000+'],
          ['Real Estate Wire Fraud', 'Intercept and redirect closing cost wire transfers', '$300,000+'],
        ]}
      />

      <Pre label="// BEC ATTACK CHAIN">{`# Full BEC campaign workflow:

# Phase 1: Reconnaissance
# Target: company processing a significant payment
# Sources: LinkedIn, company website, news (acquisitions, expansions)
# Identify: CFO, Controller, accounts payable staff names and emails
# Find CEO name for impersonation

# Phase 2: Initial access (optional but increases success)
# Phish a mailbox to read real email threads
# Monitor for: invoice approval chains, wire transfer requests
# Wait for real transaction in progress → perfect timing

# Phase 3: The ask
# From: ceo-lookalike-domain.com or compromised CEO mailbox
# To: Finance director or CFO
# Subject: Confidential - Urgent Wire Transfer Required
#
# Email body:
# - Reference real event (acquisition in news, real project name)
# - Explain why normal process cannot be followed
# - Create urgency and time pressure
# - Ask for specific amount to specific account
# - Explicitly ask them not to discuss with others

# Phase 4: Handle objections
# "Our auditors need a W9" → "They can follow up next week"
# "Can I call you to confirm?" → "I'm in back-to-back meetings"
# "This doesn't match our process" → "Legal has cleared it, just needs to happen"

# Defence:
# Callback verification via KNOWN phone number (not one in email)
# Dual approval above threshold
# Email gateway flags external domains pretending to be internal
# DMARC enforcement on own domain (p=reject)
# Out-of-band confirmation for any change to payment details`}</Pre>

      <H2>07 — SET — Social Engineer Toolkit</H2>
      <Pre label="// AUTOMATED SOCIAL ENGINEERING WITH SET">{`# Install (Kali included, others):
git clone https://github.com/trustedsec/social-engineer-toolkit
cd social-engineer-toolkit && pip install -r requirements.txt
python3 setup.py

# Launch:
sudo setoolkit

# Main menu:
# 1) Social-Engineering Attacks
# 2) Penetration Testing (Fast-Track)
# 3) Third Party Modules

# Credential Harvester Attack (most common):
# 1 → 2 (Website Attack Vectors) → 3 (Credential Harvester)
# Enter target URL → SET clones it → serves on your IP
# Send victim: http://YOUR_IP (looks like real site)
# Credentials printed in terminal as submitted

# Spear Phishing with SET:
# 1 → 1 (Spear-Phishing Attack Vectors) → 1 (Perform a Mass Email Attack)
# Choose payload (Metasploit backdoor)
# SET creates malicious attachment
# Sends to target emails via configured SMTP

# Create malicious HTA (HTML Application):
# 1 → 2 → 5 (HTA Attack)
# Victim visits URL → browser downloads and runs .hta
# Executes embedded PowerShell → reverse shell

# PowerShell injection (bypasses many AV):
# 1 → 2 → 4 (Tabnabbing Attack)
# Switches tab content when user returns to it
# Or: 1 → 2 → 6 (Web Jacking Attack) → DNS hijack variant`}</Pre>

      <H2>08 — Physical Social Engineering</H2>
      <P>Physical social engineering means bypassing physical security through deception rather than technology. Tailgating (following someone through a secure door), badge cloning, and USB drops have compromised organizations with multi-million dollar technical security stacks. Humans are trained to be polite, helpful, and non-confrontational — all of which attackers exploit.</P>

      <Pre label="// PHYSICAL INTRUSION TECHNIQUES">{`# Tailgating:
# Follow authorized person through secure door
# Carry boxes (people instinctively hold doors for those with loads)
# Dress as delivery person, HVAC tech, electrician, cleaner
# Act confident — hesitation triggers suspicion more than presence

# Badge cloning:
# HID/EM4100 proximity cards can be cloned with cheap readers
# Flipper Zero: reads most low-frequency RFID in < 1 second
# Range: 5-10cm through clothing (e.g. badge on lanyard)
# Clone to writeable card → access building
# Long-range reader: ACR122U modified — 30-40cm in ideal conditions

# USB drops:
# Label USB: "Q4 Salary Review — Confidential" or "Board Meeting Notes"
# Drop in company parking lot, bathroom, reception, printer area
# Employee finds → curiosity overcomes security training
# Plug in → AutoRun (if enabled) or victim manually opens files → payload

# Rubber Ducky / O.MG Cable / Bash Bunny:
# Rubber Ducky: keyboard emulation device — looks like USB stick
# Types commands at 1000 WPM before user can react
# Script: sleep 2s, open PowerShell, download and execute payload, close
# O.MG Cable: standard looking USB-C cable with WiFi-enabled implant inside
# bash bunny: versatile multi-attack USB device by Hak5

# Dumpster diving:
# Employee handbooks → internal terminology, org structure
# Org charts → names for spear phishing
# Old hardware → may contain data recoverable by forensics tools
# Client lists, contracts → business intelligence for pretexting
# Shredded documents → can be reassembled (cross-cut is more secure)

# Physical pretexts that work:
# "I'm from the fire marshal's office for a routine inspection"
# "IT is upgrading your workstation — I need 10 minutes"
# "I'm a new employee, my badge activation is delayed"
# "I'm here for the 2pm meeting with [name from LinkedIn]"
# "Delivery for [name from company website]"`}</Pre>

      <H2>09 — Deepfakes & AI-Assisted Social Engineering</H2>
      <P>Generative AI has fundamentally changed the economics of social engineering. What previously required skilled actors, expensive audio equipment, or extensive writing ability can now be produced in minutes by anyone with an API key. The barrier to high-quality social engineering has collapsed.</P>

      <Pre label="// AI-ENHANCED SOCIAL ENGINEERING">{`# Voice cloning (available 2024):
# ElevenLabs: clone voice from 1 minute of audio
# OpenVoice: open-source, local
# Source material: YouTube videos, podcast appearances, conference talks
# Application: vishing calls using executive's own voice signature

# Video deepfakes:
# HeyGen, D-ID: generate talking-head video from image + script
# Application: fake video "verification" calls
# Real incidents: $25M wire transfer fraud via deepfake video call (2024)
# Hong Kong: finance employee approved transfer after "CFO" video call

# AI-generated phishing:
# GPT-4 + LinkedIn scraping = highly personalised spear phishing at scale
# Previous bottleneck was writing quality → now removed
# No more grammar errors, no more generic templates
# Targeted to specific person, role, project, writing style

# OSINT + AI workflow:
# 1. Gather: LinkedIn profile, Twitter posts, conference talks, GitHub
# 2. Feed to LLM: "Write a phishing email as if from this person's manager"
# 3. Result: highly convincing, personalised email at scale

# Detection:
# Audio deepfake: background noise consistency, micro-pause patterns
# Video deepfake: blink rate, facial boundary artifacts, lighting direction
# AI text: overly formal, consistent tone, lacks personal quirks
# But: detection is arms race and defenders are currently behind

# Defensive measures against AI SE:
# Code words pre-arranged with executives for verification
# Video call verification with specific challenge questions
# Out-of-band confirmation channels for large transfers
# AI detection tools (imperfect but improving)`}</Pre>

      <H2>10 — Campaign Planning & Red Team SE Ops</H2>
      <Pre label="// STRUCTURED SE RED TEAM ENGAGEMENT">{`# Pre-engagement requirements:
# - Written authorisation specifying scope (who can be targeted)
# - Define: email phishing, vishing, physical access — each needs separate auth
# - Out-of-scope: targeting personal devices, family members, medical staff
# - Get-out-of-jail letter for physical operations

# Rules of engagement:
# - No malware on personal devices
# - Stop if victim shows genuine distress
# - Do not capture real credentials (use fake landing page, discard)
# - Report any real security issues found during ops

# Campaign phases:
# Phase 1: OSINT and reconnaissance (1-2 weeks)
#   Build target list, identify high-value targets
#   Map org structure, email format, key personnel

# Phase 2: Infrastructure (3-5 days)
#   Register lookalike domain
#   Set up email infrastructure (SMTP + SPF/DKIM/DMARC)
#   Clone target landing pages
#   Set up Gophish or similar

# Phase 3: Execution (as per scope)
#   Phishing campaign: track clicks, creds, open rates
#   Vishing: document success rates per pretext
#   Physical: document access achieved, duration

# Phase 4: Reporting
#   Click rate, credential submission rate per department
#   Most successful pretexts
#   Recommended training priorities
#   Detection gap (did blue team notice? how long?)
#   Recommendations: technical + human`}</Pre>

      <H2>11 — Defence & Awareness Training</H2>
      <Note>The most effective defence against social engineering is a culture where employees feel empowered to challenge unusual requests, verify identities through a second channel, and report suspicious contacts without fear of embarrassment. Technical controls like DMARC and hardware MFA help, but the human layer is what ultimately stops these attacks.</Note>

      <Pre label="// BUILDING THE HUMAN FIREWALL">{`# Red flags to teach employees:
# 1. Urgency — real IT never demands instant action
# 2. Unusual requests — IT will NEVER ask for your password
# 3. Unknown sender — verify via second channel (phone, Teams)
# 4. Too good to be true — prize, refund, unexpected win
# 5. Pressure to bypass normal process — "don't tell your manager"
# 6. Request to disable security software — never legitimate
# 7. Suspicious attachment — unexpected .exe, .zip, .doc, .iso

# Verification protocol (teach this process):
# Received call from "IT"? Hang up, call back on KNOWN internal number
# Received email requesting action? Call sender via phone book, not email reply
# Wire transfer request from "CEO"? In-person or video verify + dual approval
# Any change to payment details? Out-of-band verification required

# Phishing simulation programmes:
# KnowBe4, Proofpoint Security Awareness Training, Cofense
# Run monthly simulations → track click/credential rates
# Reward employees who report suspicious emails (no punishment)
# Training click clickers immediately — while still fresh

# Technical controls:
# DMARC p=reject on YOUR domain → prevents spoofing of your domain
# Email gateway → blocks known phishing domains, sandboxes attachments
# Browser isolation → malicious links opened in disposable sandbox
# Hardware MFA (YubiKey) → defeats credential phishing (not vishing)
# Zero-trust architecture → even authenticated users limited access
# Conditional access → unusual location/device requires re-verification`}</Pre>

      <H3>MFA Types vs SE Resistance</H3>
      <Table
        headers={['MFA TYPE', 'DEFEATS PHISHING?', 'DEFEATS VISHING MFA BYPASS?', 'NOTES']}
        rows={[
          ['SMS OTP', 'Partially', 'No — easily intercepted in real-time', 'Better than nothing but weakest MFA'],
          ['TOTP (Authenticator app)', 'No — code phishable', 'No — caller asks for code', 'Still better than SMS'],
          ['Push notification', 'Partially', 'Susceptible to MFA fatigue attack', 'Attacker spams push — user accidentally approves'],
          ['Hardware key (FIDO2/WebAuthn)', 'Yes — domain-bound', 'Yes — cannot be intercepted', 'Gold standard — key validates actual domain'],
          ['Passkeys', 'Yes — domain-bound', 'Yes — device validates domain', 'Modern FIDO2 — best user experience'],
        ]}
      />

      <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid #1a2e1e' }}>
        <div style={{ background: 'rgba(255,110,199,0.04)', border: '1px solid rgba(255,110,199,0.2)', borderRadius: '8px', padding: '2rem', textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#5a1a3a', letterSpacing: '0.25em', marginBottom: '0.5rem' }}>READY TO PRACTICE?</div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1rem', color: '#ff6ec7', marginBottom: '0.5rem', fontWeight: 600 }}>MOD-10 Interactive Lab</div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5a7a5a', marginBottom: '1.5rem' }}>5 steps &middot; 120 XP &middot; Real commands &middot; Flag captures</div>
          <Link href="/modules/social-engineering/lab" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', color: '#ff6ec7', padding: '12px 32px', border: '1px solid rgba(255,110,199,0.6)', borderRadius: '6px', background: 'rgba(255,110,199,0.1)', fontWeight: 700, letterSpacing: '0.12em', boxShadow: '0 0 20px rgba(255,110,199,0.15)', display: 'inline-block' }}>
            LAUNCH LAB &#8594;
          </Link>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Link href="/modules/cloud-security" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#3a6a3a' }}>&#8592; MOD-09: CLOUD SECURITY</Link>
          <Link href="/modules/red-team" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#3a6a3a' }}>MOD-11: RED TEAM &#8594;</Link>
        </div>
      </div>
    </div>
  )
}
