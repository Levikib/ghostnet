'use client'
import React from 'react'
import Link from 'next/link'
import LabTerminal, { LabStep } from '../../../components/LabTerminal'

const accent = '#00d4ff'

const steps: LabStep[] = [
  {
    id: 'web-01',
    title: 'SQL Injection Detection',
    objective: 'Test a login form for SQL injection by breaking out of the SQL string context. What single character is the classic first test for SQLi?',
    hint: 'It\'s the SQL string delimiter — the character that closes a string literal.',
    answers: ["'", "' --", "single quote", "apostrophe"],
    xp: 15,
    explanation: 'A single quote breaks out of the SQL string context. If the app returns an error like "syntax error near \'\'" it\'s almost certainly vulnerable. The next step is: \' OR \'1\'=\'1 to bypass authentication or use sqlmap for automated exploitation.'
  },
  {
    id: 'web-02',
    title: 'SQLMap Automation',
    objective: 'Automate SQL injection exploitation with sqlmap. What flag extracts all database names from a vulnerable URL?',
    hint: 'The flag is --dbs (databases). Basic usage: sqlmap -u "url" --dbs',
    answers: ['--dbs', 'sqlmap --dbs', '-u url --dbs'],
    xp: 25,
    explanation: 'sqlmap -u "http://target/page?id=1" --dbs enumerates all databases. Then --tables -D dbname lists tables. --dump -D dbname -T tablename extracts data. Add --level=5 --risk=3 for more aggressive detection of complex injections.'
  },
  {
    id: 'web-03',
    title: 'XSS Payload',
    objective: 'Test for reflected XSS. What is the simplest JavaScript alert payload to test if a site is vulnerable?',
    hint: 'It opens a JavaScript alert dialog. Classic CTF/pentest test.',
    answers: ['<script>alert(1)</script>', '<script>alert(1)</script>', 'alert(1)', '<script>alert("xss")</script>'],
    flag: 'FLAG{xss_confirmed}',
    xp: 25,
    explanation: 'If <script>alert(1)</script> executes in the browser, the site reflects unsanitized input directly into the HTML. Real impact: steal session cookies (document.cookie), redirect to phishing pages, or load malicious scripts via src attribute.'
  },
  {
    id: 'web-04',
    title: 'Directory Brute Force',
    objective: 'Discover hidden directories and files on a web server. What tool performs directory and file brute forcing?',
    hint: 'Popular tools: gobuster, feroxbuster, dirb, dirbuster. Any of these are valid.',
    answers: ['gobuster', 'feroxbuster', 'dirb', 'dirbuster', 'ffuf', 'wfuzz'],
    xp: 20,
    explanation: 'gobuster dir -u http://target -w /usr/share/wordlists/dirb/common.txt -x php,html,txt finds hidden paths. Common discoveries: /admin, /backup, /config, /.git, /api/v1. Add -b 404 to filter false positives.'
  },
  {
    id: 'web-05',
    title: 'Burp Suite Intercept',
    objective: 'Burp Suite is the essential web app testing proxy. What keyboard shortcut in Burp forwards an intercepted request?',
    hint: 'Check the Intercept tab — there\'s a "Forward" button. The shortcut is Ctrl+F.',
    answers: ['ctrl+f', 'ctrl f', 'forward', 'ctrl+f or forward button'],
    flag: 'FLAG{burp_configured}',
    xp: 35,
    explanation: 'Ctrl+F forwards the intercepted request in Burp Suite. Workflow: enable intercept > modify request (change parameters, headers, cookies) > Ctrl+F to send. Right-click > Send to Repeater (Ctrl+R) to replay modified requests without re-intercepting.'
  }
]

export default function WebAttacksLab() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#006a7a' }}>
        <Link href="/" style={{ color: '#006a7a', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>&#8250;</span>
        <Link href="/modules/web-attacks" style={{ color: '#006a7a', textDecoration: 'none' }}>WEB ATTACKS</Link>
        <span>&#8250;</span>
        <span style={{ color: accent }}>LAB</span>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#006a7a', letterSpacing: '0.2em', marginBottom: '0.5rem' }}>MOD-06 &#8250; INTERACTIVE LAB</div>
        <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.6rem', fontWeight: 700, color: accent, margin: 0 }}>Web Attacks Lab</h1>
        <p style={{ color: '#5a8a9a', fontSize: '0.85rem', marginTop: '0.75rem', lineHeight: 1.7 }}>
          SQL injection, XSS exploitation, directory brute forcing, and Burp Suite workflow.
          Complete all 5 steps to earn 120 XP.
        </p>
        <div style={{ marginTop: '1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid #00d4ff22', borderRadius: '6px', padding: '1rem 1.25rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5a8a5a', lineHeight: 1.8 }}>
          <span style={{ color: accent, fontWeight: 600 }}>HOW TO USE THIS LAB:</span> Read each step objective, type the command or answer in the terminal below, and press Enter. Type <span style={{ color: '#ffb347' }}>hint</span> if you get stuck. Earn XP and capture flags on key steps. Progress saves automatically.
        </div>
      </div>

      <LabTerminal
        labId="web-attacks-lab"
        moduleId="web-attacks"
        title="Web Attacks Lab"
        accent={accent}
        steps={steps}
      />
    </div>
  )
}
