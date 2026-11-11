// Single source of truth for GHOSTNET's public SEO: site URL, names, module catalogue.
// Topics come from each module's chapter titles (app/modules/*/page.tsx).

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://ghostnet-nine.vercel.app').replace(/\/$/, '')
export const SITE_NAME = 'GHOSTNET'
export const SITE_DESCRIPTION =
  'Hands-on cybersecurity training: 13 modules from OSINT, Tor and cryptography to Active Directory, cloud and red team operations, each with a guided lab, XP ranks and an AI guide.'

export type SeoModule = { slug: string; code: string; title: string; topics: string[] }

export const MODULES: SeoModule[] = [
  { slug: "tor", code: "01", title: "Tor & Dark Web", topics: ["How Tor Works", "Tor Browser & Configuration", "Bridges & Censorship Circumvention", "Hidden Services (.onion)", "Operational Security for Tor Users", "Running Tor Relays & Exit Nodes", "Dark Web Research & Threat Intelligence", "Tor Attacks & Limitations"] },
  { slug: "osint", code: "02", title: "OSINT & Surveillance", topics: ["OSINT Fundamentals & Intelligence Cycle", "Domain & Infrastructure Reconnaissance", "Shodan, Censys & Internet Scanning", "Google Dorking & Web OSINT", "People & Social Media OSINT (SOCMINT)", "Geospatial & Image OSINT", "Maltego & Link Analysis", "Dark Web & Breach Data OSINT"] },
  { slug: "crypto", code: "03", title: "Cryptography", topics: ["Cryptography Fundamentals", "Symmetric Encryption", "Asymmetric Encryption & Key Exchange", "Hash Functions & MACs", "Password Hashing & Key Derivation", "Digital Signatures & PKI", "TLS & Network Cryptography", "Cryptographic Attacks"] },
  { slug: "offensive", code: "04", title: "Offensive Security & Exploit Development", topics: ["Vulnerability Research Methodology", "Exploitation Fundamentals", "Stack Buffer Overflows", "Modern Exploit Mitigations and Bypasses", "Return-Oriented Programming", "Heap Exploitation", "Web and Network Exploitation", "Fuzzing and Vulnerability Discovery"] },
  { slug: "active-directory", code: "05", title: "Active Directory Attacks", topics: ["Active Directory Architecture", "Enumeration: BloodHound & LDAP", "Kerberoasting & AS-REP Roasting", "Pass-the-Hash & Pass-the-Ticket", "DCSync & Credential Dumping", "Golden & Silver Tickets", "LLMNR Poisoning & SMB Relay", "Lateral Movement & Persistence"] },
  { slug: "web-attacks", code: "06", title: "Advanced Web Attacks", topics: ["Web Application Testing Methodology", "SQL Injection - Complete Guide", "XSS - All Variants and Exploitation", "CSRF, SSRF and Request Forgery", "Authentication and Session Attacks", "Injection Attacks Beyond SQL", "File Inclusion, Upload and Path Traversal", "Deserialization, Prototype Pollution and Advanced"] },
  { slug: "malware", code: "07", title: "Malware Analysis", topics: ["Analysis Methodology & Lab Setup", "Static Analysis: Strings & Imports", "Dynamic Analysis with Procmon & Wireshark", "Ghidra & Reverse Engineering", "YARA Rules & Threat Detection", "Ransomware Anatomy", "Evasion Techniques & Memory Forensics"] },
  { slug: "network-attacks", code: "08", title: "Network Attacks", topics: ["Network Fundamentals for Attackers", "Reconnaissance and Scanning", "Wireshark and Packet Analysis", "MITM and Layer 2 Attacks", "Protocol-Specific Attacks", "Firewall and IDS Evasion", "Denial of Service - Understanding and Defense", "Network Pivoting and Tunneling"] },
  { slug: "cloud-security", code: "09", title: "Cloud Security", topics: ["Cloud Security Fundamentals", "AWS Security and Attacks", "Azure Security and Attacks", "GCP Security and Attacks", "Container and Kubernetes Security", "Serverless and IaC Security", "Cloud Lateral Movement and Privilege Escalation", "Cloud Detection and Incident Response"] },
  { slug: "social-engineering", code: "10", title: "Social Engineering", topics: ["Psychology of Manipulation", "Phishing - Complete Methodology", "Vishing and Phone-Based Attacks", "Physical Social Engineering", "OSINT for Social Engineering", "Digital Social Engineering Tools", "Smishing and Mobile Social Engineering", "AI-Enhanced Social Engineering"] },
  { slug: "red-team", code: "11", title: "Red Team Operations", topics: ["Red Team vs Pentest vs Bug Bounty", "Campaign Planning & Rules of Engagement", "Initial Access Techniques", "C2 Frameworks & Infrastructure", "AV / EDR Evasion", "Internal Recon & Lateral Movement", "Persistence & Privilege Escalation", "Exfiltration & Avoiding Detection"] },
  { slug: "wireless-attacks", code: "12", title: "Wireless Attacks", topics: ["Wireless Fundamentals & Standards", "WPA2 Attacks - Complete Guide", "WPA3 & Advanced Protocol Attacks", "WPA Enterprise & 802.1X Attacks", "Rogue AP & MITM Attacks", "Bluetooth & BLE Attacks", "RFID, NFC & Physical Layer Attacks", "SDR & RF Signal Analysis"] },
  { slug: "mobile-security", code: "13", title: "Mobile Security", topics: ["Mobile Security Fundamentals", "Android Static Analysis", "Android Dynamic Analysis & Runtime Manipulation", "Android Vulnerability Classes", "iOS Static Analysis", "iOS Dynamic Analysis & Runtime Manipulation", "Mobile Malware & Spyware Analysis", "Mobile Network Attacks"] },
]

export function moduleDescription(m: SeoModule): string {
  return "Learn " + m.title.toLowerCase() + " step by step: " + m.topics.slice(0, 5).join(", ") + ". Concept chapters plus a guided hands-on lab on GHOSTNET."
}

/** JSON-LD for a <script type="application/ld+json">: escapes < so the payload can't close the tag. */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}
