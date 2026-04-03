'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import LabTerminal, { LabStep } from '../../../components/LabTerminal'
import FreeLabTerminal from '../../../components/FreeLabTerminal'

const accent = '#ff6ec7'
const moduleId = 'social-engineering'
const moduleName = 'Social Engineering'
const moduleNum = '10'

const steps: LabStep[] = [
  {
    id: 'se-01',
    title: 'SPF / DKIM / DMARC Analysis',
    objective: `You receive a suspicious email claiming to be from hr@acmecorp.com. Before forwarding it to the security team you want to verify the sending domain's authentication records.

SPF (Sender Policy Framework) defines which mail servers are authorised to send email on behalf of a domain. DKIM (DomainKeys Identified Mail) adds a cryptographic signature that proves the message body was not altered in transit. DMARC (Domain-based Message Authentication, Reporting and Conformance) ties both together and tells receiving servers what to do when either check fails.

Run a DNS lookup to retrieve all three records for acmecorp.com. What DNS record type holds SPF and DMARC policy data?`,
    hint: 'Both SPF and DMARC are stored in DNS. SPF lives at the domain apex; DMARC lives at _dmarc.domain.com. Both use the same DNS record type. Try: dig TXT acmecorp.com',
    answers: ['txt', 'TXT', 'dns txt', 'txt record', 'text record'],
    xp: 15,
    explanation: `SPF and DMARC are published as DNS TXT records. A typical SPF record looks like: v=spf1 include:_spf.google.com ip4:203.0.113.5 -all. The qualifier at the end matters: -all (hardfail) rejects mail not matching the policy; ~all (softfail) tags it as suspicious but delivers it; +all means any server can send, which is effectively no protection.

DKIM uses a public key stored in a TXT record at a selector subdomain, e.g. default._domainkey.acmecorp.com. The private key lives on the sending mail server and signs outgoing headers. Recipients retrieve the public key from DNS and verify the signature.

DMARC is always at _dmarc.domain.com. It specifies the policy (p=none|quarantine|reject), where to send aggregate reports (rua=), and the alignment requirement. Alignment means the From: domain must match the SPF-authenticated domain or the DKIM signing domain. A domain with p=reject and full SPF/DKIM alignment is extremely difficult to spoof in ways that reach the inbox.

Commands to remember:
  dig TXT acmecorp.com | grep spf
  dig TXT _dmarc.acmecorp.com
  dig TXT default._domainkey.acmecorp.com
  nslookup -type=TXT _dmarc.acmecorp.com`
  },
  {
    id: 'se-02',
    title: 'Phishing Email Header Forensics',
    objective: `A user receives an email appearing to come from payroll@acmecorp.com announcing a bonus payment. The email looks legitimate but you suspect it is a phishing attempt. The security team asks you to analyse the raw email headers to establish the true origin of the message.

Email headers are read bottom-up: each Received: header records one hop the message took, with the originating server appearing lowest. The From: header is freely writable by the sender and is what users see. The Return-Path: (also called Envelope-From or MAIL FROM) is where delivery failure notices go and often exposes the real sending domain.

Which email header records every mail server the message passed through on its journey to your inbox, and is the primary forensic field used to trace the true origin?`,
    hint: 'This header is added by each mail server that handles the message. You will see multiple of them in one email, read from bottom to top. It starts with the word "Received".',
    answers: ['received', 'received:', 'received from', 'received header', 'x-received'],
    xp: 20,
    flag: 'FLAG{header_forensics_unlocked}',
    explanation: `The Received: chain is the most reliable forensic trail in email. Each mail transfer agent (MTA) prepends a Received: line before passing the message on. Reading from bottom to top you see: the original SMTP client that injected the message, each relay server, and finally your mail server.

Key fields in a Received: header:
  from — hostname and IP the previous server claimed
  by   — the server that received it
  via  — transport protocol (SMTP, ESMTPS, HTTP)
  with — cipher and protocol version
  id   — the message ID on that hop
  for  — the envelope recipient
  date — timestamp on that server

Red flags: IP address in the from clause resolves to a country inconsistent with the sender, the IP is in a residential or VPN range, the claimed hostname does not match a reverse DNS lookup of the IP, or there is an unexpected hop through a bulletproof hosting provider.

Supporting headers to check:
  Return-Path:  — real bounce address, often reveals attacker domain
  X-Originating-IP: — set by some webmail providers, shows the client IP
  Authentication-Results: — your server's SPF/DKIM/DMARC verdict
  X-Spam-Status: — spam score and reasons

Online tools: MXToolbox Header Analyzer, Google Admin Toolbox messageheader, mail-tester.com. For bulk analysis use email-header-analyzer Python scripts or Splunk with email log ingestion.`
  },
  {
    id: 'se-03',
    title: 'Email Spoofing Mechanics',
    objective: `Your red team engagement scope includes testing whether acmecorp.com can be spoofed. The domain has SPF with ~all (softfail) and no DMARC record. You want to send a test email that appears to come from ceo@acmecorp.com to an internal test mailbox to demonstrate the risk before the client hardens their configuration.

SWAKS (Swiss Army Knife SMTP) is the go-to command-line tool for crafting and sending arbitrary SMTP messages. It supports TLS, authentication, custom headers, and can connect to any SMTP server.

A spoofed SWAKS command sets the envelope MAIL FROM (--from) and the header From: field (--h-From) separately. The envelope From is what SPF checks; the header From is what the email client displays.

What flag does SWAKS use to specify the message recipient (the RCPT TO envelope address)?`,
    hint: 'SWAKS flags mirror SMTP commands. The recipient flag is short: --to followed by the email address. Try: swaks --help | grep -i recipient',
    answers: ['--to', 'to', '--rcpt', 'rcpt', '--recipient'],
    xp: 20,
    explanation: `A basic spoofed test with SWAKS:
  swaks --to testbox@acmecorp.com --from spoof@attacker.com --h-From "CEO Name <ceo@acmecorp.com>" --server mail.acmecorp.com --body "Urgent wire transfer needed." --header "Subject: Urgent — Action Required"

The SMTP MAIL FROM (--from) is the envelope sender — what SPF validates. The MIME From: header (--h-From) is what Outlook and Gmail display to the user. With ~all SPF and no DMARC, the spoofed message may reach the inbox with a warning, or reach it cleanly if the receiving server does not enforce SPF failures.

Why domains get spoofed:
  1. SPF missing — any server can claim to be the domain
  2. SPF softfail (~all) — treated as suspicious but not blocked
  3. No DMARC — no instruction to receiving servers on enforcement
  4. DMARC p=none — monitors but does not reject

Remediation path: deploy SPF with -all, add DKIM signing, set DMARC p=quarantine then escalate to p=reject after monitoring rua= aggregate reports for two weeks. Tools: dmarcian.com, DMARC Analyser, Google Postmaster Tools.

Important: Only test against systems you own or have written authorisation to test. Unauthorised email spoofing is illegal under computer fraud and abuse laws in most jurisdictions.`
  },
  {
    id: 'se-04',
    title: 'GoPhish Setup and Campaigns',
    objective: `Your red team is running a phishing simulation for a 500-person organisation. Management has approved the engagement and you have been asked to set up the infrastructure using GoPhish, the leading open-source phishing simulation framework.

GoPhish separates the attack into composable components: Sending Profiles (SMTP configuration), Email Templates (the email body, subject, and tracking pixel), Landing Pages (the credential-capture site or awareness page), and Campaigns that combine these components and target user Groups.

After installing GoPhish on your server with ./gophish, the admin panel starts on a non-standard HTTPS port. You manage the entire campaign from this web interface. The phishing listener (what victims connect to when they click a link) runs on a separate port, typically 80 or 8080.

What is the default port number for the GoPhish admin panel?`,
    hint: 'The port is 3333 and the panel uses HTTPS by default. You would visit https://localhost:3333 to manage campaigns.',
    answers: ['3333', ':3333', 'port 3333', 'https://localhost:3333', 'localhost:3333'],
    xp: 20,
    flag: 'FLAG{gophish_deployed}',
    explanation: `GoPhish quickstart:
  wget https://github.com/gophish/gophish/releases/latest/...
  unzip gophish-linux-64bit.zip
  chmod +x gophish
  ./gophish
  # Admin panel: https://localhost:3333  (default creds in terminal output)

Campaign workflow:
  1. Sending Profile — add your SMTP server (Postfix, SendGrid, AWS SES). Set the From address, display name, and test SMTP connectivity.
  2. Email Template — import an existing email or build from scratch. Add {{.URL}} as the tracking link. GoPhish automatically appends a unique token per recipient to track individual clicks.
  3. Landing Page — clone the target's real login page with the Import Website feature. Add credential capture. Configure a redirect URL for after submission (e.g. the real site or an awareness page).
  4. Users and Groups — import CSV of targets: First Name, Last Name, Email, Position.
  5. Campaign — select all components, set launch time, schedule, and send.

GoPhish tracks: emails sent, emails opened (via tracking pixel), links clicked, credentials submitted, and email reports by users. Export results as CSV for client reporting.

OPSEC for phishing infrastructure:
  - Use a purpose-registered domain aged at least 30 days
  - Configure rDNS, HELO hostname, and MX records
  - Use a valid TLS certificate (Let's Encrypt)
  - Route through a redirector (Apache mod_rewrite or Nginx) so the GoPhish server IP is not directly exposed
  - Categorise the domain with Bluecoat/McAfee before launch`
  },
  {
    id: 'se-05',
    title: 'Evilginx2 Reverse Proxy Phishing (2FA Bypass)',
    objective: `A target organisation uses Microsoft 365 with MFA enabled. Standard credential-harvest pages fail because even with a stolen password the attacker cannot log in without the second factor. Evilginx2 solves this by acting as a transparent reverse proxy between the victim and the real Microsoft login portal.

When a victim clicks the phishing link and enters credentials on the evilginx2 proxy, the proxy forwards the request to Microsoft in real time. Microsoft completes the entire authentication flow including MFA prompts. Evilginx2 intercepts the session cookies that Microsoft sets after successful authentication. The attacker can import these session cookies into a browser and access the victim's account without knowing the password or needing the second factor.

This technique defeats TOTP (Google Authenticator, Microsoft Authenticator) and SMS-based 2FA. It does NOT defeat phishing-resistant MFA like FIDO2/WebAuthn hardware tokens (YubiKey, passkeys) because those bind the key to the legitimate origin domain.

What type of MFA is immune to this reverse-proxy phishing technique because it cryptographically binds authentication to the legitimate website's origin?`,
    hint: 'The key standard is FIDO2 or WebAuthn. Hardware tokens like YubiKey implement this. The answer could be FIDO2, WebAuthn, passkeys, or hardware token.',
    answers: ['fido2', 'webauthn', 'passkey', 'passkeys', 'hardware token', 'yubikey', 'hardware key', 'phishing resistant mfa', 'fido'],
    xp: 20,
    explanation: `Evilginx2 phishlets are YAML config files that define how to proxy a specific website. Phishlets exist for Microsoft 365, Google, LinkedIn, GitHub, and dozens of other platforms.

Basic evilginx2 flow:
  evilginx2 -p ./phishlets/
  # In evilginx2 console:
  phishlets hostname o365 login.attacker-domain.com
  phishlets enable o365
  lures create o365
  lures get-url 0

When the victim clicks the lure URL:
  1. Their browser connects to evilginx2 (TLS termination)
  2. Evilginx2 opens a connection to login.microsoft.com
  3. All requests and responses are proxied in real time
  4. Login completes including MFA — victim sees real Microsoft pages
  5. Evilginx2 captures session cookies with the auth_token
  6. Attacker imports cookies: EditThisCookie or cookie-editor extension

Why FIDO2/WebAuthn is immune: The authenticator creates a key pair bound to the RP ID (the legitimate domain's origin). When evilginx2 forwards the WebAuthn challenge, the browser checks that the RP ID matches the page's origin. Since the victim is technically on attacker-domain.com, not login.microsoft.com, the authenticator refuses to sign the challenge. The authentication fails and no session cookie is created for the attacker.

Defensive guidance: Enforce FIDO2/WebAuthn for all privileged accounts and ideally all users. As an interim measure, use Microsoft Conditional Access with location and device compliance policies to reduce exposure from stolen session tokens. Implement token lifetime policies and continuous access evaluation.`
  },
  {
    id: 'se-06',
    title: 'Vishing and Caller ID Spoofing',
    objective: `Your physical social engineering engagement includes a vishing component. You need to call the target company's help desk and impersonate a senior manager to request a password reset for an account you have already enumerated via OSINT.

To make the call convincing the caller ID must display the manager's internal extension or direct-dial number. VoIP services and software PBX systems allow setting an arbitrary caller ID, known as CLI (Calling Line Identification) spoofing.

Asterisk is an open-source PBX (Private Branch Exchange) that runs on Linux. Attackers configure Asterisk with a SIP trunk from a cheap VoIP provider that allows custom CALLERID settings. Alternatively, commercial spoofing services like SpoofCard allow one-off spoof calls without infrastructure setup.

What open-source software PBX is commonly used to implement CLI spoofing in vishing attacks?`,
    hint: 'It is one of the most widely deployed open-source PBX systems. The name relates to a star symbol. Hint: Aster*sk.',
    answers: ['asterisk', 'asterix', 'freepbx', 'opensips', 'kamailio', 'voip pbx'],
    xp: 20,
    explanation: `Asterisk CLI spoofing configuration (dialplan excerpt):
  [vishing-outbound]
  exten => _X.,1,Set(CALLERID(all)=John Smith <+15551234567>)
  exten => _X.,n,Dial(SIP/voip-trunk/${EXTEN})
  exten => _X.,n,Hangup()

An Asterisk server with a permissive SIP trunk provider passes the manipulated caller ID to the PSTN. The receiving phone displays the spoofed number. Most caller ID displays are cosmetic only — they can show any string the originating carrier allows.

Vishing pretext tips:
  - Research the target's internal phone directory via OSINT (LinkedIn, company website)
  - Know the manager's name, team, and a plausible reason for calling
  - Use authority ("This is urgent, the CEO needs access before the board meeting")
  - Create time pressure ("Our systems are locked, I need this in the next 10 minutes")
  - Match the company's internal terminology (ticketing system name, IT team name)

Defensive training points:
  - Never reset passwords based on caller ID alone — caller ID can be spoofed
  - Always call back using a number from the company directory, not the inbound number
  - Use a shared secret or out-of-band verification for sensitive requests
  - Establish a verbal challenge-response code for known high-value callers
  - Log all password reset requests with a ticket number and escalate anomalies

Detection: Review help desk ticket patterns for unusual reset requests, especially for executive accounts or out-of-hours calls claiming urgency.`
  },
  {
    id: 'se-07',
    title: 'Physical Pretexting and Tailgating',
    objective: `The engagement scope includes physical access testing of the client's main office. Your objective is to reach the server room on the third floor without a valid access badge. You plan to use tailgating combined with a convincing pretext.

Tailgating (also called piggybacking) means following an authorised person through a secure door before it closes. A strong pretext reduces suspicion: delivery person, IT contractor, fire safety inspector, or corporate auditor are classic roles.

Before the engagement you research the company: you learn they use a managed print services provider called "FastPrint Solutions" and their IT department is on the second floor. You create a fake FastPrint Solutions vendor badge, carry a toolbox, and arrive at the reception wearing a uniform with the FastPrint logo.

In social engineering theory, what term describes the fabricated scenario, false identity, and backstory that an attacker creates to manipulate a target into complying with a request?`,
    hint: 'The word comes from the idea of creating a false premise or background story. It is also used in journalism to describe a deceptive interview scenario. The term starts with "pretext".',
    answers: ['pretext', 'pretexting', 'social pretext', 'cover story', 'legend'],
    xp: 20,
    flag: 'FLAG{physical_se_complete}',
    explanation: `A well-constructed pretext has several layers:

  Identity: Name, company, role, and a reason to be there that the target can mentally verify (even if they do not actually call to check)
  Artefacts: Badge, uniform, business cards, a work order printout, a branded vehicle
  Knowledge: Insider terminology, names of real staff, knowledge of their systems or vendors
  Behaviour: Confident body language, purposeful movement, not asking for directions to sensitive areas

Physical attack chain example:
  1. OSINT — find vendor names from job postings, LinkedIn, the company website's "Partners" page
  2. Pretext construction — create fake vendor identity matching a real supplier
  3. Reconnaissance — visit lobby on a different day as a "job applicant" to observe badge design, door mechanisms, reception behaviour
  4. Entry — arrive at a busy time (9:00-9:30 AM, post-lunch), tailgate through the main door behind a group
  5. Internal movement — use confident purposeful walking, avoid eye contact with security cameras, stay near busy areas
  6. Target access — access the server room, drop a network implant or photograph sensitive assets
  7. Exit — leave before anyone has a chance to verify credentials

Defences: Mantrap/airlock entry at all secure zones, mandatory visitor escort policies, security awareness training showing employees how to politely challenge unfamiliar people, anti-tailgating turnstiles, CCTV with motion analytics, clear badge colour-coding for visitors vs staff.

The critical human element: Most tailgating succeeds because employees feel awkward challenging someone who looks like they belong. Training must specifically address the social discomfort of saying "Excuse me, can I see your badge?" to a confident-looking stranger.`
  },
  {
    id: 'se-08',
    title: "Cialdini's Principles in Social Engineering",
    objective: `Robert Cialdini's book "Influence: The Psychology of Persuasion" (1984) identified six core principles of persuasion that social engineers weaponise. Understanding these principles lets you both craft more effective attacks and design defences that inoculate employees against them.

The six principles are: Reciprocity, Commitment and Consistency, Social Proof, Authority, Liking, and Scarcity. A seventh — Unity — was added in the 2021 edition.

In a BEC (Business Email Compromise) attack the attacker impersonates the CFO and sends an urgent email to accounts payable: "I need you to process a wire transfer of USD 47,000 immediately. Our auditors are closing the books today and this vendor will charge a 10% late fee if not paid by 3 PM. Do not use the normal approval process — I will sign off retrospectively. Do not discuss this with anyone as it is confidential."

This email weaponises three Cialdini principles simultaneously. One of them is the principle that makes people comply with requests from perceived experts or people in positions of power.

Name that specific Cialdini principle (the one related to power and expertise).`,
    hint: 'The CFO is the authority figure in this scenario. The principle is named after the concept of obeying someone with perceived power, expertise, or legitimacy. It is one word.',
    answers: ['authority', 'authority principle', 'cialdini authority', 'perceived authority'],
    xp: 20,
    explanation: `All three principles in the BEC example:

  Authority: The email comes from the CFO — a C-level executive with power over accounts payable. Employees are conditioned to comply with requests from leadership without question. Attackers exploit this by spoofing executive email addresses, creating lookalike domains (acmec0rp.com), or compromising the actual executive account.

  Scarcity: "Auditors closing today", "3 PM deadline", "10% late fee". Artificial time pressure prevents the target from following normal verification procedures. Scarcity in SE is always fake — real urgent transfers still follow approval workflows.

  Commitment and Consistency: "I will sign off retrospectively" — this preemptively frames the target as someone who would have approved this anyway, making refusal feel inconsistent with their role.

Other Cialdini principles in SE contexts:
  Reciprocity: An attacker sends a small gift or does a small favour before the request ("I covered for you last week, can you just forward me that document?")
  Social Proof: "Everyone on the exec team uses this cloud service" — lowers suspicion by implying normal behaviour
  Liking: Attackers research the target on social media and reference shared interests, mutual connections, or pay genuine compliments before the ask
  Scarcity (continued): Limited-time phishing lures ("Your account will be suspended in 24 hours")

Defensive training: Teach employees to pause when they feel urgency, always verify financial requests via a separate channel (phone call to a known number), and that real executives do not ask employees to bypass controls. Create a "slow down" culture where verifying unusual requests is praised, not punished.`
  },
  {
    id: 'se-09',
    title: 'Cognitive Biases in Social Engineering',
    objective: `Beyond Cialdini's persuasion principles, social engineers exploit deeper cognitive biases — systematic errors in human thinking identified by behavioural psychology. These biases are involuntary and affect even security-aware individuals.

The most commonly exploited bias in phishing is the tendency to believe information that confirms what we already expect. When an employee receives an email that looks like it is from their bank at a time they are already stressed about finances, they are primed to accept it as legitimate because it fits their current mental model.

A second critical bias is the tendency to focus on the information we are given and ignore what we are not given. A phishing page that shows a convincing logo, familiar colour scheme, and a plausible URL path may fool users even when the domain name itself is clearly wrong — because users anchor to the visual elements they expect to see and do not scrutinise the URL carefully.

The bias where people rely too heavily on the first piece of information they encounter — for example, seeing the word "Security" in a domain like security-microsoft-update.com and feeling it is legitimate — is named after what cognitive process?`,
    hint: 'This bias involves "anchoring" to an initial piece of information. The term used in behavioural economics and psychology for this specific effect is "anchoring" or "anchoring bias". It was described by Kahneman and Tversky.',
    answers: ['anchoring', 'anchoring bias', 'anchor bias', 'anchoring effect', 'confirmation bias', 'cognitive bias'],
    xp: 20,
    explanation: `Key cognitive biases exploited in social engineering:

  Anchoring Bias: The first piece of information seen dominates judgement. Attackers place trusted brand names early in domain names (microsoft-support-update.com) or subject lines ("Microsoft Security Alert") so users anchor to the trusted word.

  Confirmation Bias: People seek information that confirms their existing beliefs. An employee expecting a package delivery is primed to trust a FedEx phishing email. Attackers research targets to time attacks when the target is most receptive.

  Authority Bias (halo effect): Titles and credentials increase compliance. An email from "Dr. James Mitchell, CISO" gets more trust even from sophisticated users.

  Automation Bias: Over-reliance on automated systems. Users trust that spam filters, AV, and email security gateways have already vetted the message. "It got through so it must be OK."

  Inattentional Blindness: When focused on one task, people miss obvious anomalies. A user carefully reading the email body fails to notice the spoofed From: address.

  Optimism Bias: "Phishing won't happen to me — I'm smart enough to spot it." This false confidence reduces vigilance. Training should be humbling: show click rates from real campaigns including IT staff.

  Hyperbolic Discounting: People prefer immediate rewards over delayed benefits. "Click here to claim your Amazon gift card" exploits the immediate reward instinct; the cost (data theft) is abstract and future.

Defensive interventions: Spaced repetition phishing simulations (not just annual training), contextual warnings in email clients ("This sender is external"), and post-click interventions that explain what the red flags were rather than just flagging "you fell for phishing".`
  },
  {
    id: 'se-10',
    title: 'Security Awareness Training Design',
    objective: `After completing a phishing simulation that showed a 34% click rate across 500 employees, you are asked to design a security awareness programme that will measurably reduce this rate within six months. The client currently sends a single annual e-learning module that takes 45 minutes to complete.

Effective security awareness training is not a compliance checkbox but a behaviour-change programme. Research shows that single-event training has minimal long-term effect. Spaced repetition, contextual feedback, and positive reinforcement are significantly more effective than lecture-based or video-only approaches.

The simulated phishing platform GoPhish allows you to redirect users who click the phishing link to an immediate awareness page that explains the red flags they missed. This immediate post-click feedback is the single most impactful intervention in phishing simulation programmes.

What pedagogical technique, involving short repeated practice sessions spaced out over time rather than one large training block, is recommended for retention of security awareness knowledge?`,
    hint: 'The term comes from educational psychology. Hermann Ebbinghaus described the "forgetting curve" in 1885. The antidote to the forgetting curve involves spacing learning over time. The technique is called "spaced repetition" or "spaced learning".',
    answers: ['spaced repetition', 'spaced learning', 'spaced practice', 'microlearning', 'distributed practice', 'spaced training'],
    xp: 15,
    explanation: `A high-impact security awareness programme blueprint:

  Month 1: Baseline phishing simulation (no warning). Record click rate, credential submission rate, and report rate. Segment by department and role.

  Month 1-2: Short (5-10 minute) targeted modules addressing the specific themes used in the simulation (e.g. invoice fraud, IT help desk impersonation). Use video, not just text. Include the actual red flags from your own simulation.

  Month 2-3: Second phishing simulation with a different template. Immediate post-click awareness page. Employees who click receive a 2-minute micro-module on the red flags they missed — delivered in context, not weeks later.

  Month 3-6: Repeat the cycle with new templates. Track improvement. Recognise departments with the highest report rates (not just lowest click rates — reporting is the goal behaviour).

  Ongoing: Monthly one-page security newsletter. Quarterly tabletop exercises for executives. Lunch-and-learn sessions covering real-world recent incidents.

NIST SP 800-50 and SANS Security Awareness Maturity Model provide frameworks. Key metrics to track:
  - Phishing simulation click rate (target: below 5%)
  - Credential submission rate
  - Report rate (employees who forward suspicious emails to security team)
  - Mean time to report
  - Repeat offenders (same person clicks multiple simulations)

Tools: KnowBe4, Proofpoint Security Awareness, Cofense, Wizer, GoPhish (self-hosted free option).`
  },
  {
    id: 'se-11',
    title: 'BEC Detection and Response',
    objective: `Business Email Compromise (BEC) is the most financially devastating form of social engineering. The FBI IC3 reports BEC losses exceeding USD 2.7 billion annually. Unlike mass phishing, BEC is targeted: attackers spend weeks researching the organisation, its personnel, and its financial processes before striking.

BEC attack patterns:
  CEO Fraud: Attacker impersonates the CEO to request a wire transfer to a "new vendor" account
  Invoice Fraud: Attacker impersonates a real vendor and sends a convincing invoice with updated banking details
  Attorney Impersonation: Caller claims to be a lawyer involved in a confidential acquisition requiring an urgent transfer
  Account Compromise: Attacker actually gains access to a legitimate executive email account and uses it to redirect future payments

Your SOC team receives an alert: accounts payable processed a USD 85,000 wire transfer yesterday after receiving an email from what appeared to be your CFO. The email came from the domain acmec0rp.com (zero replacing the letter O). The wire went to a bank account in Hong Kong.

What is the term for this domain spoofing technique where a character is replaced with a visually similar one to create a convincing fake domain?`,
    hint: 'The technique involves substituting letters with visually similar characters (like 0 for O, or rn for m). It is named after a combination of "homograph" and "phishing". The common short term is "typosquatting" or a more specific term for visually similar characters.',
    answers: ['typosquatting', 'homograph attack', 'homoglyph attack', 'lookalike domain', 'unicode attack', 'IDN homograph', 'punycode attack', 'domain spoofing'],
    xp: 15,
    explanation: `BEC incident response checklist:

  Immediate (first hour):
  1. Preserve evidence — do not delete the malicious email; export headers and raw source
  2. Contact the bank that sent the wire — request a recall. Success rate drops sharply after 24 hours
  3. File an FBI IC3 complaint (for US organisations) and contact your national cyber crime unit
  4. Identify all email threads involving the attacker domain — are there other compromised conversations?
  5. Check if the CFO account itself is compromised or if this was purely spoofing

  Investigation:
  - Pull email gateway logs for all traffic from acmec0rp.com and related infrastructure
  - Check DMARC reports for your domain — did acmecorp.com have p=reject that the attacker had to spoof around?
  - Review accounts payable process — was the transfer request verified via a second channel?
  - Examine the attacker domain registration date (often registered days before the attack)

  Lookalike domain detection tools:
  - dnstwist: python3 dnstwist.py acmecorp.com  (generates hundreds of typosquatting variants, checks which are registered)
  - URLCrazy
  - PhishTank API integration
  - Passive DNS monitoring services (DNSDB, RiskIQ)

  BEC prevention architecture:
  - DMARC p=reject with strict alignment
  - Email banner warnings for external senders
  - Register common typosquatting variants of your own domain
  - Two-person authorisation for all wire transfers above a threshold
  - Callback verification procedure using a pre-established phone number for any banking change requests`
  },
  {
    id: 'se-12',
    title: 'Sock Puppets and OSINT Counter-SE',
    objective: `Nation-state actors and sophisticated threat groups use sock puppet accounts — fake online personas — to conduct long-term social engineering campaigns. A sock puppet is a fictitious identity with a believable backstory, profile pictures (often AI-generated), social connections, and months of activity history before it is used for the actual attack.

Targets are cultivated over weeks: the attacker befriends them on LinkedIn, engages with their posts, shares relevant industry content, and eventually reaches out with a pretext — "I'm a researcher at MIT working on a paper in your field, can we chat?" — that leads to credential phishing, malware delivery, or sensitive information disclosure.

As a defender you can use OSINT techniques to identify sock puppets. Reverse image search on profile photos can reveal AI-generated images or photos stolen from other accounts. Account creation date, posting history consistency, and connection graph analysis are further signals.

What free online tool can detect whether a profile photo is AI-generated by analysing pixel-level artefacts and GAN (Generative Adversarial Network) fingerprints?`,
    hint: 'Several tools exist. The most widely referenced is from Hive Moderation or the website "whichfaceisreal.com". Another approach is using FotoForensics for ELA (Error Level Analysis). The common answer expected is "FotoForensics" or "Hive Moderation" or "reverse image search".',
    answers: ['fotoforensics', 'hive moderation', 'reverse image search', 'tineye', 'google image search', 'fake image detector', 'sensity', 'whichfaceisreal', 'ela analysis'],
    xp: 15,
    flag: 'FLAG{counter_se_mastered}',
    explanation: `Sock puppet detection methodology:

  Profile photo analysis:
  - Reverse image search: images.google.com, TinEye, Yandex Images
  - AI face detection: Hive Moderation API, Sensity.ai, FaceCheck.ID
  - ELA (Error Level Analysis): FotoForensics.com — AI faces have characteristic compression patterns
  - Look for GAN artefacts: asymmetric earrings, blurry background transitions, strange hair edges, unnatural reflections in eyes, garbled text in the background

  Account behaviour signals:
  - Account creation date vs. activity volume (very new account with hundreds of connections)
  - Posting at times inconsistent with the claimed time zone
  - No posts about personal life milestones, only professional content
  - Connection graph skewed toward one industry or geography
  - Username matches a recently expired real account
  - Profile details conflict (says London, UK but mutual connections are all from Tehran)

  OSINT counter-SE for organisations:
  - Educate employees about LinkedIn social engineering: unsolicited connection requests from attractive or impressive profiles are a known attack vector
  - Brief executives and researchers who are likely targets
  - Establish a reporting channel for suspicious LinkedIn/email outreach
  - Use OSINT to monitor for sock puppets targeting your organisation: search for employees' names and email addresses on Pastebin, breach databases, dark web forums

  Nation-state sock puppet campaigns on record: Operation Newscaster (Iran/APT42 targeting journalists), Ghostwriter (Russia targeting NATO officials), and LinkedIn campaigns attributed to Lazarus Group (North Korea) targeting cryptocurrency professionals. These campaigns ran for months before the first malicious payload was delivered.`
  }
]

const xpTotal = steps.reduce((sum, s) => sum + s.xp, 0)

const sections = [
  {
    num: '01',
    label: 'Email Security',
    steps: ['se-01', 'se-02', 'se-03'],
    desc: 'SPF/DKIM/DMARC analysis, phishing email header forensics, email spoofing mechanics'
  },
  {
    num: '02',
    label: 'Phishing Infrastructure',
    steps: ['se-04', 'se-05'],
    desc: 'GoPhish campaign setup, evilginx2 reverse proxy phishing and 2FA bypass'
  },
  {
    num: '03',
    label: 'Voice and Physical',
    steps: ['se-06', 'se-07'],
    desc: 'Vishing caller ID spoofing, physical pretexting and tailgating techniques'
  },
  {
    num: '04',
    label: 'Psychology of SE',
    steps: ['se-08', 'se-09'],
    desc: "Cialdini's principles (authority, urgency, scarcity), cognitive biases exploited in attacks"
  },
  {
    num: '05',
    label: 'Defence',
    steps: ['se-10', 'se-11', 'se-12'],
    desc: 'Security awareness training design, BEC detection and response, sock puppet OSINT counter-SE'
  }
]

export default function SocialEngineeringLab() {
  const [guidedDone, setGuidedDone] = useState(false)
  const [freeLaunched, setFreeLaunched] = useState(false)
  const [earnedXp, setEarnedXp] = useState(0)
  const [showKeywords, setShowKeywords] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('lab_social-engineering-lab')
    if (saved) {
      const d = JSON.parse(saved)
      if (d.done) { setGuidedDone(true); setEarnedXp(d.xp || 0) }
    }
  }, [])

  const onComplete = (xp: number) => { setGuidedDone(true); setEarnedXp(xp) }
  const onRestart = () => { setGuidedDone(false); setFreeLaunched(false); setEarnedXp(0) }

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#7a2a5a' }}>
        <Link href="/" style={{ color: '#7a2a5a', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>&#8250;</span>
        <Link href="/modules/social-engineering" style={{ color: '#7a2a5a', textDecoration: 'none' }}>SOCIAL ENGINEERING</Link>
        <span>&#8250;</span>
        <span style={{ color: accent }}>LAB</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px', alignItems: 'center' }}>
          <Link href="/modules/social-engineering" style={{ textDecoration: 'none', padding: '3px 10px', border: '1px solid #3a0a2a', borderRadius: '3px', color: '#7a2a5a', fontSize: '7.5px', letterSpacing: '0.1em' }}>&#8592; CONCEPT</Link>
          <span style={{ padding: '3px 10px', background: 'rgba(255,110,199,0.1)', border: '1px solid rgba(255,110,199,0.4)', borderRadius: '3px', color: accent, fontSize: '7.5px', letterSpacing: '0.1em', fontWeight: 700 }}>LAB ACTIVE</span>
        </div>
      </div>

      {/* Progress banner */}
      <div style={{ background: 'rgba(255,110,199,0.04)', border: '1px solid rgba(255,110,199,0.15)', borderRadius: '6px', padding: '10px 16px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {[{ label: 'PHASE 1', done: true, active: !guidedDone }, { label: 'PHASE 2', done: guidedDone, active: guidedDone }].map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.done ? accent : '#3a0a2a', border: p.active ? '2px solid ' + accent : '1px solid #3a0a2a', boxShadow: p.active ? '0 0 6px ' + accent : 'none' }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: p.done ? accent : '#5a2a4a', letterSpacing: '0.1em' }}>{p.label}</span>
              {i === 0 && <span style={{ fontSize: '7px', color: '#3a0a2a', margin: '0 2px' }}>&#8212;</span>}
            </div>
          ))}
        </div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#8a4a6a' }}>
          MOD-{moduleNum} &nbsp;&#183;&nbsp; {moduleName.toUpperCase()} &nbsp;&#183;&nbsp; {xpTotal} XP AVAILABLE &nbsp;&#183;&nbsp; 12 STEPS &nbsp;&#183;&nbsp; 5 SECTIONS
        </div>
        {guidedDone && (
          <div style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: accent, fontWeight: 700 }}>
            &#10003; GUIDED PHASE COMPLETE &#8212; LAUNCH FREE LAB BELOW
          </div>
        )}
      </div>

      {/* Section index cards */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: '#3a0a2a', letterSpacing: '0.25em', marginBottom: '10px' }}>LAB SECTIONS &#8212; 5 TOPIC AREAS</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '8px' }}>
          {sections.map((sec) => (
            <div key={sec.num} style={{ background: 'rgba(255,110,199,0.03)', border: '1px solid rgba(255,110,199,0.12)', borderRadius: '6px', padding: '10px 12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: accent, letterSpacing: '0.15em', background: 'rgba(255,110,199,0.1)', padding: '2px 6px', borderRadius: '3px' }}>SEC {sec.num}</span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: accent, fontWeight: 700 }}>{sec.label}</span>
              </div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.68rem', color: '#7a4a6a', lineHeight: 1.5 }}>{sec.desc}</div>
              <div style={{ marginTop: '6px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {sec.steps.map((sid) => (
                  <span key={sid} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '6.5px', color: '#5a2a4a', background: 'rgba(255,110,199,0.06)', border: '1px solid rgba(255,110,199,0.1)', padding: '1px 5px', borderRadius: '2px' }}>{sid.toUpperCase()}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PHASE 1 */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(255,110,199,0.1)', border: '1px solid rgba(255,110,199,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: accent, fontWeight: 700 }}>1</span>
          </div>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#5a2a4a', letterSpacing: '0.2em', marginBottom: '2px' }}>PHASE 1 &#8212; GUIDED LEARNING</div>
            <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.4rem', fontWeight: 700, color: accent, margin: 0 }}>Social Engineering Lab</h1>
          </div>
          {guidedDone && (
            <button onClick={onRestart} style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: '#5a2a4a', background: 'transparent', border: '1px solid #3a0a2a', borderRadius: '3px', padding: '3px 8px', cursor: 'pointer', letterSpacing: '0.1em' }}>
              &#8635; RESTART
            </button>
          )}
        </div>

        <p style={{ color: '#8a6a7a', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: 1.7, fontFamily: 'JetBrains Mono, monospace' }}>
          Email authentication forensics, phishing infrastructure, vishing and physical social engineering, the psychology of persuasion, and defensive countermeasures.
          Type answers, earn XP, and capture flags. Complete all 12 steps to unlock Phase 2.
        </p>

        <div style={{ background: 'rgba(255,110,199,0.03)', border: '1px solid rgba(255,110,199,0.12)', borderRadius: '6px', padding: '1rem 1.25rem', marginBottom: '1.25rem', fontFamily: 'JetBrains Mono, monospace' }}>
          <div style={{ fontSize: '7px', color: '#3a0a2a', letterSpacing: '0.25em', marginBottom: '8px' }}>KEY CONCEPTS COVERED IN THIS LAB</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {['SPF / DKIM / DMARC', 'Email header forensics', 'Email spoofing', 'GoPhish campaigns', 'Evilginx2 / 2FA bypass', 'Vishing / CLI spoofing', 'Physical pretexting', 'Tailgating', "Cialdini's principles", 'Cognitive biases', 'Security awareness', 'BEC detection', 'Sock puppets', 'OSINT counter-SE'].map(c => (
              <span key={c} style={{ fontSize: '7.5px', color: '#8a4a6a', background: 'rgba(255,110,199,0.06)', border: '1px solid rgba(255,110,199,0.12)', padding: '2px 8px', borderRadius: '3px' }}>{c}</span>
            ))}
          </div>
        </div>

        <LabTerminal
          labId="social-engineering-lab"
          moduleId={moduleId}
          title="Social Engineering Lab"
          accent={accent}
          steps={steps}
          onComplete={onComplete}
        />
      </div>

      {/* PHASE 2 */}
      <div id="free-lab" style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: guidedDone ? 'rgba(255,110,199,0.15)' : 'rgba(0,0,0,0.3)', border: '1px solid ' + (guidedDone ? 'rgba(255,110,199,0.4)' : '#3a0a2a'), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: guidedDone ? accent : '#5a2a4a', fontWeight: 700 }}>2</span>
          </div>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: guidedDone ? '#8a4a6a' : '#5a2a4a', letterSpacing: '0.2em', marginBottom: '2px' }}>PHASE 2 &#8212; FREE LAB ENVIRONMENT</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.1rem', fontWeight: 700, color: guidedDone ? accent : '#5a2a4a' }}>Full Social Engineering Practice Sandbox</div>
          </div>
          {guidedDone && !freeLaunched && (
            <div style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#ffb347', background: 'rgba(255,179,71,0.08)', border: '1px solid rgba(255,179,71,0.2)', padding: '3px 10px', borderRadius: '3px' }}>
              GUIDED PHASE COMPLETE
            </div>
          )}
        </div>

        {!freeLaunched ? (
          <div style={{ background: guidedDone ? 'rgba(255,110,199,0.04)' : '#080208', border: '1px solid ' + (guidedDone ? 'rgba(255,110,199,0.25)' : '#1a0515'), borderRadius: '10px', padding: '2.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            {guidedDone && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, ' + accent + ', transparent)' }} />}
            <div style={{ fontSize: '7px', color: guidedDone ? '#8a4a6a' : '#3a0a2a', letterSpacing: '0.3em', marginBottom: '1rem' }}>
              {guidedDone ? 'READY FOR COMPREHENSIVE TESTING' : 'COMPLETE GUIDED PHASE TO UNLOCK'}
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.2rem', color: guidedDone ? accent : '#5a2a4a', fontWeight: 700, marginBottom: '0.5rem' }}>
              LAUNCH FULL LAB ENVIRONMENT
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', color: '#8a4a6a', marginBottom: '0.75rem', lineHeight: 1.7 }}>
              Free-form terminal sandbox for Social Engineering
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#5a2a4a', marginBottom: '2rem', lineHeight: 1.7 }}>
              Command history &nbsp;&#183;&nbsp; Tab autocomplete &nbsp;&#183;&nbsp; Real command simulation &nbsp;&#183;&nbsp; No restrictions
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
              {['GoPhish campaigns', 'Evilginx2 proxy', 'Email header analysis', 'SPF/DKIM checking', 'dnstwist enumeration', 'SET framework', 'OSINT sock puppets', 'Vishing scripts'].map(feat => (
                <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: guidedDone ? accent : '#3a0a2a' }} />
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: guidedDone ? '#8a4a6a' : '#3a0a2a' }}>{feat}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => guidedDone && setFreeLaunched(true)}
              disabled={!guidedDone}
              style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.15em', padding: '14px 40px', border: '1px solid ' + (guidedDone ? 'rgba(255,110,199,0.6)' : '#3a0a2a'), borderRadius: '6px', background: guidedDone ? 'rgba(255,110,199,0.12)' : 'transparent', color: guidedDone ? accent : '#3a0a2a', cursor: guidedDone ? 'pointer' : 'not-allowed', boxShadow: guidedDone ? '0 0 24px rgba(255,110,199,0.18)' : 'none', transition: 'all 0.2s' }}
            >
              {guidedDone ? '&#9658; LAUNCH FREE LAB ENVIRONMENT' : '&#128274; COMPLETE GUIDED PHASE FIRST'}
            </button>
            {!guidedDone && <div style={{ marginTop: '1rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: '#3a0a2a' }}>Complete all 12 guided steps above to unlock the free lab environment</div>}
          </div>
        ) : (
          <div style={{ border: '1px solid rgba(255,110,199,0.3)', borderRadius: '10px', overflow: 'hidden', background: '#080208' }}>
            <FreeLabTerminal moduleId={moduleId} moduleName={moduleName} accent={accent} onClose={() => setFreeLaunched(false)} />
            <div style={{ padding: '8px 16px', background: '#0a030a', borderTop: '1px solid rgba(255,110,199,0.15)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: accent, boxShadow: '0 0 5px ' + accent }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#5a2a4a' }}>
                You are in free practice mode. Ask <span style={{ color: accent }}>GHOST AGENT</span> (bottom-right) for hints on any social engineering technique.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Quick reference */}
      <div style={{ marginBottom: '2rem' }}>
        <button onClick={() => setShowKeywords(!showKeywords)} style={{ background: 'transparent', border: '1px solid #3a0a2a', borderRadius: '5px', padding: '8px 16px', cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#5a2a4a', letterSpacing: '0.1em', marginBottom: showKeywords ? '12px' : 0 }}>
          {showKeywords ? '&#9660;' : '&#9654;'} QUICK REFERENCE &#8212; SE TOOLS AND COMMANDS
        </button>
        {showKeywords && (
          <div style={{ background: '#080208', border: '1px solid #1a0515', borderRadius: '6px', padding: '1.25rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '8px' }}>
              {[
                ['dig TXT domain.com | grep spf', 'Check SPF record'],
                ['dig TXT _dmarc.domain.com', 'Check DMARC policy'],
                ['dig TXT default._domainkey.domain.com', 'Check DKIM selector record'],
                ['swaks --to victim@target.com --from spoof@target.com --h-From "CEO <ceo@target.com>" --server mail.target.com', 'Test email spoofing with SWAKS'],
                ['gophish', 'Start GoPhish phishing platform (https port 3333)'],
                ['evilginx2 -p ./phishlets/', 'Start evilginx2 reverse proxy phishing framework'],
                ['setoolkit', 'Social Engineering Toolkit (SET)'],
                ['dnstwist acmecorp.com', 'Generate and check typosquatting domain variants'],
                ['mxtoolbox.com', 'Online email header and blacklist checker'],
                ['hunter.io', 'Find email patterns and addresses for a domain'],
                ['holehe email@example.com', 'Check which sites an email is registered on'],
                ['emailrep.io', 'Email reputation and risk scoring API'],
                ['fotoforensics.com', 'ELA analysis to detect AI-generated or manipulated images'],
                ['images.google.com', 'Reverse image search for sock puppet profile photos'],
              ].map(([cmd, desc]) => (
                <div key={cmd} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '6px 8px', background: '#060106', borderRadius: '4px' }}>
                  <code style={{ color: accent, fontSize: '0.72rem', flexShrink: 0 }}>{cmd}</code>
                  <span style={{ color: '#8a4a6a', fontSize: '0.7rem' }}>{desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer nav */}
      <div style={{ paddingTop: '2rem', borderTop: '1px solid #1a0515', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <Link href="/modules/social-engineering" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5a2a4a' }}>&#8592; BACK TO CONCEPT</Link>
        <Link href="/modules/red-team/lab" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5a2a4a' }}>MOD-11 RED TEAM LAB &#8594;</Link>
      </div>
    </div>
  )
}
