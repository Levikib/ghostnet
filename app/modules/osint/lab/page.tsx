'use client'
import React from 'react'
import Link from 'next/link'
import LabTerminal, { LabStep } from '../../../components/LabTerminal'

const accent = '#00d4ff'

const steps: LabStep[] = [
  {
    id: 'osint-01',
    title: 'DNS Enumeration',
    objective: 'Start reconnaissance by enumerating DNS records for a target domain. What tool performs DNS enumeration and zone transfers?',
    hint: 'The tool is called "dnsenum" or you can use "dig". Try: dnsenum example.com',
    answers: ['dnsenum', 'dig', 'nslookup', 'host', 'fierce'],
    xp: 20,
    explanation: 'DNS enumeration reveals subdomains, mail servers (MX), name servers (NS), and IP ranges. Zone transfers (AXFR) can dump the entire DNS database if misconfigured — a goldmine of targets.'
  },
  {
    id: 'osint-02',
    title: 'Subdomain Discovery',
    objective: 'Find subdomains of a target using passive reconnaissance. What popular subdomain bruteforce/enumeration tool uses a wordlist?',
    hint: 'Starts with "sub" — a Python tool for subdomain enumeration.',
    answers: ['sublist3r', 'subfinder', 'amass', 'gobuster dns', 'gobuster'],
    xp: 25,
    explanation: 'Sublist3r, Subfinder, and Amass use OSINT sources (crt.sh, VirusTotal, Shodan) plus brute force to find subdomains. Subdomains often reveal dev/staging environments with weaker security than production.'
  },
  {
    id: 'osint-03',
    title: 'Shodan Dork',
    objective: 'Shodan indexes internet-connected devices. What Shodan filter would you use to find Apache servers in a specific country (e.g., Germany)?',
    hint: 'Shodan filters use key:value syntax. Product filter is "product:" and country is "country:"',
    answers: ['product:apache country:de', 'apache country:de', 'product:"apache" country:de'],
    flag: 'FLAG{shodan_recon_complete}',
    xp: 30,
    explanation: 'Shodan dorks combine filters to find exposed services. product:apache country:DE org:"Deutsche Telekom" gives you Apache servers in Germany on a specific ISP. Add "vuln:CVE-2021-41773" to find exploitable targets.'
  },
  {
    id: 'osint-04',
    title: 'Email OSINT',
    objective: 'Harvesting email addresses for phishing or credential stuffing. What tool collects emails from public sources for a target domain?',
    hint: 'The "Harvester" — its full name is "theHarvester".',
    answers: ['theharvester', 'theHarvester', 'hunter.io', 'holehe'],
    xp: 25,
    explanation: 'theHarvester queries search engines, LinkedIn, Hunter.io, and other sources to enumerate email addresses and employee names. These feed directly into spear phishing campaigns or password spray attacks.'
  },
  {
    id: 'osint-05',
    title: 'Metadata Extraction',
    objective: 'Documents and images contain hidden metadata (EXIF) that reveals author names, GPS coordinates, and software versions. What tool extracts metadata from files?',
    hint: 'A Perl-based tool starting with "exif" — very widely used.',
    answers: ['exiftool', 'exif', 'mat2', 'metagoofil'],
    flag: 'FLAG{metadata_extracted}',
    xp: 30,
    explanation: 'ExifTool extracts metadata from PDFs, images, Office documents, and more. A Word doc might reveal the author\'s real name, company name, local file path, and creation date — all useful for targeted social engineering.'
  }
]

export default function OsintLab() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#006a7a' }}>
        <Link href="/" style={{ color: '#006a7a', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>&#8250;</span>
        <Link href="/modules/osint" style={{ color: '#006a7a', textDecoration: 'none' }}>OSINT</Link>
        <span>&#8250;</span>
        <span style={{ color: accent }}>LAB</span>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#006a7a', letterSpacing: '0.2em', marginBottom: '0.5rem' }}>MOD-02 &#8250; INTERACTIVE LAB</div>
        <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.6rem', fontWeight: 700, color: accent, margin: 0 }}>OSINT Reconnaissance Lab</h1>
        <p style={{ color: '#5a8a9a', fontSize: '0.85rem', marginTop: '0.75rem', lineHeight: 1.7 }}>
          DNS enumeration, subdomain discovery, Shodan dorking, email harvesting, and metadata extraction.
          Complete all 5 steps to earn 130 XP.
        </p>
        <div style={{ marginTop: '1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid #00d4ff22', borderRadius: '6px', padding: '1rem 1.25rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5a8a5a', lineHeight: 1.8 }}>
          <span style={{ color: accent, fontWeight: 600 }}>HOW TO USE THIS LAB:</span> Read each step objective, type the command or answer in the terminal below, and press Enter. Type <span style={{ color: '#ffb347' }}>hint</span> if you get stuck. Earn XP and capture flags on key steps. Progress saves automatically.
        </div>
      </div>

      <LabTerminal
        labId="osint-lab"
        moduleId="osint"
        title="OSINT Reconnaissance Lab"
        accent={accent}
        steps={steps}
      />
    </div>
  )
}
