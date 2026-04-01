'use client'
import React from 'react'
import Link from 'next/link'

const MODULES = [
  {
    code: '01', href: '/modules/tor', color: '#00ff41',
    title: 'Tor & Dark Web',
    subtitle: 'Anonymity · Hidden Services · Opsec',
    desc: 'Master anonymous communication. Understand how Tor routes traffic through layered encryption, operate hidden services, and practice airtight operational security to stay undetected.',
    topics: ['Tor Architecture', 'Circuit Building', 'Hidden Services', '.onion Hosting', 'Opsec Frameworks', 'Deanonymisation Risks'],
    difficulty: 'BEGINNER',
  },
  {
    code: '02', href: '/modules/osint', color: '#00d4ff',
    title: 'OSINT & Surveillance',
    subtitle: 'Reconnaissance · Intel Gathering · Footprinting',
    desc: 'Find everything about anyone using only public data. Maltego relationship graphs, Shodan device discovery, social media profiling, and metadata extraction — all without touching the target.',
    topics: ['Passive Recon', 'Maltego', 'Shodan & Censys', 'Social Media Intel', 'Metadata Analysis', 'Google Dorking'],
    difficulty: 'BEGINNER',
  },
  {
    code: '03', href: '/modules/crypto', color: '#ffb347',
    title: 'Crypto & Blockchain',
    subtitle: 'Forensics · Smart Contract Audits · DeFi Security',
    desc: 'Trace anonymous blockchain transactions. Audit smart contracts for exploitable vulnerabilities. Understand DeFi attack vectors like flash loans and reentrancy that drain millions from protocols.',
    topics: ['Blockchain Forensics', 'Smart Contract Auditing', 'DeFi Exploits', 'Chainalysis Techniques', 'Privacy Coins', 'MEV & Flash Loans'],
    difficulty: 'INTERMEDIATE',
  },
  {
    code: '04', href: '/modules/offensive', color: '#bf5fff',
    title: 'Offensive Security',
    subtitle: 'Pentesting · Exploitation · Privilege Escalation',
    desc: 'The full penetration testing lifecycle from methodology to reporting. Nmap enumeration, Metasploit exploitation, privilege escalation on Linux and Windows, and building professional pentest reports.',
    topics: ['Pentest Methodology', 'Nmap & Enumeration', 'Metasploit', 'Priv Escalation', 'Web App Attacks', 'Reporting'],
    difficulty: 'INTERMEDIATE',
  },
  {
    code: '05', href: '/modules/active-directory', color: '#ff4136',
    title: 'Active Directory',
    subtitle: 'Kerberoasting · BloodHound · Domain Takeover',
    desc: 'AD is the crown jewel of every enterprise. Learn Kerberoasting, Pass-the-Hash, BloodHound attack path analysis, and the techniques that lead to full domain compromise in real engagements.',
    topics: ['Kerberoasting', 'BloodHound', 'Pass-the-Hash', 'DCSync', 'Golden Ticket', 'Domain Dominance'],
    difficulty: 'ADVANCED',
  },
  {
    code: '06', href: '/modules/web-attacks', color: '#00d4ff',
    title: 'Web Attacks Advanced',
    subtitle: 'SQLi · XSS · SSRF · Deserialization · API Hacking',
    desc: 'Beyond the OWASP basics. Advanced injection techniques, blind SQLi, stored XSS chains, SSRF to cloud credential theft, deserialization exploits, and modern API attack methodologies.',
    topics: ['Advanced SQLi', 'XSS Chains', 'SSRF', 'Deserialization', 'API Security', 'GraphQL Attacks'],
    difficulty: 'ADVANCED',
  },
  {
    code: '07', href: '/modules/malware', color: '#00ff41',
    title: 'Malware Analysis',
    subtitle: 'Static · Dynamic · Reverse Engineering · Sandbox',
    desc: 'Dissect malware without getting infected. Set up isolated analysis environments, use Ghidra for reverse engineering, examine memory dumps, and understand how ransomware, trojans, and rootkits work.',
    topics: ['Static Analysis', 'Dynamic Analysis', 'Ghidra Basics', 'Sandbox Evasion', 'Ransomware Anatomy', 'YARA Rules'],
    difficulty: 'ADVANCED',
  },
  {
    code: '08', href: '/modules/network-attacks', color: '#00ffff',
    title: 'Network Attacks',
    subtitle: 'ARP Spoofing · MITM · DNS Poisoning · Packet Crafting',
    desc: 'Own the network layer. Wireshark deep-dives, ARP spoofing to intercept traffic, SSL stripping, DNS poisoning, VLAN hopping, and building custom packets from scratch with Scapy.',
    topics: ['Wireshark Mastery', 'ARP Spoofing', 'SSL Stripping', 'DNS Poisoning', 'VLAN Hopping', 'Scapy Packet Crafting'],
    difficulty: 'INTERMEDIATE',
  },
  {
    code: '09', href: '/modules/cloud-security', color: '#ff9500',
    title: 'Cloud Security',
    subtitle: 'AWS IAM · S3 Misconfigs · IMDS · Container Escape',
    desc: 'The highest-demand skill in modern security. AWS IAM privilege escalation, stealing credentials from IMDS metadata APIs via SSRF, S3 bucket enumeration, and breaking out of Docker containers.',
    topics: ['AWS Enumeration', 'IAM Priv Escalation', 'IMDS Exploitation', 'S3 Misconfigs', 'Container Escape', 'GCP & Azure Attacks'],
    difficulty: 'ADVANCED',
  },
  {
    code: '10', href: '/modules/social-engineering', color: '#ff6ec7',
    title: 'Social Engineering',
    subtitle: 'Phishing · Vishing · Pretexting · Physical Intrusion',
    desc: 'The human firewall is always the weakest link. Gophish phishing campaigns, vishing scripts, spear-phishing with OSINT context, physical tailgating, and how to build organisations that resist manipulation.',
    topics: ['Psychology of Manipulation', 'Gophish Campaigns', 'Spear Phishing', 'Vishing Scripts', 'Physical Intrusion', 'Awareness Training'],
    difficulty: 'INTERMEDIATE',
  },
  {
    code: '11', href: '/modules/red-team', color: '#ff3333',
    title: 'Red Team Ops',
    subtitle: 'C2 Frameworks · AV Evasion · Persistence · Exfil',
    desc: 'Full adversary simulation. Deploy Cobalt Strike and Sliver C2 infrastructure, bypass AV and EDR detection, establish persistence, move laterally through networks, and exfiltrate data without triggering alerts.',
    topics: ['Campaign Planning', 'C2 with Sliver/CS', 'AV & EDR Evasion', 'LOLBins', 'Persistence Techniques', 'Covert Exfiltration'],
    difficulty: 'EXPERT',
  },
  {
    code: '12', href: '/modules/wireless-attacks', color: '#aaff00',
    title: 'Wireless Attacks',
    subtitle: 'WPA2 Cracking · Evil Twin · PMKID · Bluetooth',
    desc: 'No cable needed. Crack WPA2 handshakes and PMKID without a connected client, deploy evil twin access points to harvest credentials, exploit WPS in seconds, and attack Bluetooth and BLE devices.',
    topics: ['WPA2 Cracking', 'PMKID Attack', 'Evil Twin AP', 'WPS Exploitation', 'Bluetooth Hacking', 'Captive Portal Bypass'],
    difficulty: 'INTERMEDIATE',
  },
  {
    code: '13', href: '/modules/mobile-security', color: '#7c4dff',
    title: 'Mobile Security',
    subtitle: 'APK Analysis · Frida Hooking · SSL Unpinning · ADB',
    desc: 'Attack and defend mobile apps. Decompile APKs with JADX, hook runtime functions with Frida to bypass auth and SSL pinning, exploit exported Android components with Drozer, and analyse iOS security controls.',
    topics: ['APK Static Analysis', 'Frida Instrumentation', 'SSL Pinning Bypass', 'Drozer Framework', 'ADB Exploitation', 'OWASP Mobile Top 10'],
    difficulty: 'ADVANCED',
  },
]

const TOOLS = [
  { href: '/intel',         label: 'THREAT INTEL',     color: '#ff4136', icon: '⚠', desc: 'Live CVE feed & security advisories' },
  { href: '/tools',         label: 'TOOL REFERENCE',   color: '#00ff41', icon: '⌨', desc: '200+ security commands & syntax' },
  { href: '/terminal',      label: 'RESEARCH TERMINAL', color: '#00d4ff', icon: '>', desc: 'Interactive command runner' },
  { href: '/payload',       label: 'PAYLOAD GEN',      color: '#bf5fff', icon: '◉', desc: '40+ attack payloads, ready to fire' },
  { href: '/crypto-tracer', label: 'BLOCKCHAIN TRACER', color: '#ffb347', icon: '⬡', desc: 'Trace crypto transactions on-chain' },
  { href: '/ctf',           label: 'CTF TOOLKIT',      color: '#00ffff', icon: '⚑', desc: 'Tools and writeups for competitions' },
]

const DIFF_COLOR: Record<string, string> = {
  BEGINNER: '#00ff41', INTERMEDIATE: '#ffb347', ADVANCED: '#ff4136', EXPERT: '#ff3333'
}

export default function Dashboard() {
  return (
    <div>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#1a4a1a', letterSpacing: '0.3em', marginBottom: '1rem' }}>
          INITIALISING GHOSTNET // SHANGHOST ADMIN // SECURITY RESEARCH PLATFORM
        </div>

        <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '3.5rem', fontWeight: 800, color: '#00ff41', margin: '0 0 1rem', textShadow: '0 0 40px rgba(0,255,65,0.3)', letterSpacing: '-0.02em', lineHeight: 1 }}>
          GHOSTNET
        </h1>

        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.9rem', color: '#3a6a3a', lineHeight: 1.8, maxWidth: '680px', marginBottom: '1.5rem' }}>
          A private cybersecurity research platform. 13 modules. Every technique, every tool, every
          concept — documented from first principles to advanced application. Built for those who
          want to understand how systems are broken, so they can learn to defend them.
        </p>

        {/* STATS BAR */}
        <div style={{ display: 'flex', gap: '2px', flexWrap: 'wrap' }}>
          {[
            { label: '13 MODULES', color: '#00ff41' },
            { label: '80+ LABS', color: '#00d4ff' },
            { label: '6 TOOLS', color: '#bf5fff' },
            { label: 'CONCEPT + LAB FORMAT', color: '#ffb347' },
            { label: 'AI GHOST AGENT', color: '#ff6ec7' },
            { label: 'CONTINUOUSLY UPDATED', color: '#00ff41' },
          ].map(s => (
            <span key={s.label} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', letterSpacing: '0.12em', padding: '4px 12px', border: `1px solid ${s.color}25`, borderRadius: '3px', color: s.color, background: `${s.color}08` }}>
              // {s.label}
            </span>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <div style={{ background: '#030a03', border: '1px solid #0d1f0d', borderRadius: '8px', padding: '1.75rem 2rem', marginBottom: '3rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', color: '#1a4a1a', letterSpacing: '0.25em', marginBottom: '1.25rem' }}>HOW THIS PLATFORM WORKS</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
          {[
            { num: '01', title: 'PICK A MODULE', body: 'Choose from 13 topics across the full offensive security spectrum — from beginner anonymity to expert red team ops.', color: '#00ff41' },
            { num: '02', title: 'READ THE CONCEPT', body: 'Deep-dive documentation: theory, tools, commands, and real-world examples. Understand the why, not just the how.', color: '#00d4ff' },
            { num: '03', title: 'HIT THE LAB', body: 'Practice-first exercises. Set up your environment, work through challenges, and document your findings.', color: '#ffb347' },
            { num: '04', title: 'USE THE TOOLS', body: '6 interactive tools live alongside the modules: payload generator, blockchain tracer, CVE feed, and more.', color: '#bf5fff' },
          ].map(s => (
            <div key={s.num} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.4rem', color: s.color, fontWeight: 700, opacity: 0.3 }}>{s.num}</div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: s.color, letterSpacing: '0.15em', fontWeight: 600 }}>{s.title}</div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#2a5a2a', lineHeight: 1.7 }}>{s.body}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── MODULE GRID ─────────────────────────────────────── */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', color: '#1a4a1a', letterSpacing: '0.25em', marginBottom: '4px' }}>KNOWLEDGE BASE</div>
            <h2 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1rem', color: '#00ff41', margin: 0, fontWeight: 600, letterSpacing: '0.1em' }}>ALL 13 MODULES</h2>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {Object.entries(DIFF_COLOR).map(([d, c]) => (
              <div key={d} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: c }} />
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: '#2a4a2a', letterSpacing: '0.1em' }}>{d}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {MODULES.map(m => (
            <div key={m.href} style={{ background: '#030a03', border: `1px solid ${m.color}18`, borderRadius: '8px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '10px', transition: 'border-color 0.2s', position: 'relative', overflow: 'hidden' }}>
              {/* top glow line */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: `linear-gradient(90deg, transparent, ${m.color}40, transparent)` }} />

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#1a3a1a', letterSpacing: '0.1em' }}>MOD-{m.code}</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', letterSpacing: '0.12em', padding: '1px 7px', border: `1px solid ${DIFF_COLOR[m.difficulty]}28`, borderRadius: '2px', color: DIFF_COLOR[m.difficulty], background: `${DIFF_COLOR[m.difficulty]}08` }}>{m.difficulty}</span>
                </div>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: '#1a4a1a', letterSpacing: '0.1em', background: 'rgba(0,255,65,0.05)', border: '1px solid #0d1f0d', padding: '1px 6px', borderRadius: '2px' }}>ACTIVE</span>
              </div>

              <div>
                <h3 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1rem', color: m.color, margin: '0 0 4px', fontWeight: 600, textShadow: `0 0 15px ${m.color}30` }}>{m.title}</h3>
                <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#1a4a1a', margin: 0, letterSpacing: '0.05em' }}>{m.subtitle}</p>
              </div>

              <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#2a5a2a', lineHeight: 1.7, margin: 0, flex: 1 }}>{m.desc}</p>

              {/* TOPICS */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {m.topics.map(t => (
                  <span key={t} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '6.5px', color: '#1a4a1a', background: '#050d05', border: '1px solid #0d1f0d', borderRadius: '2px', padding: '2px 6px', letterSpacing: '0.05em' }}>{t}</span>
                ))}
              </div>

              {/* CTA */}
              <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                <Link href={m.href} style={{ textDecoration: 'none', flex: 1, textAlign: 'center', fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', letterSpacing: '0.12em', padding: '8px', borderRadius: '4px', color: m.color, border: `1px solid ${m.color}33`, background: `${m.color}08`, transition: 'all 0.15s' }}>
                  [ CONCEPT ]
                </Link>
                <Link href={`${m.href}/lab`} style={{ textDecoration: 'none', flex: 1, textAlign: 'center', fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', letterSpacing: '0.12em', padding: '8px', borderRadius: '4px', color: '#1a4a1a', border: '1px solid #0d1f0d', background: 'transparent', transition: 'all 0.15s' }}>
                  [ LAB → ]
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── TOOLS SECTION ──────────────────────────────────── */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', color: '#1a4a1a', letterSpacing: '0.25em', marginBottom: '4px' }}>LIVE TOOLS</div>
        <h2 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1rem', color: '#00ff41', margin: '0 0 1.25rem', fontWeight: 600, letterSpacing: '0.1em' }}>INTERACTIVE ARSENAL</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {TOOLS.map(t => (
            <Link key={t.href} href={t.href} style={{ textDecoration: 'none', background: '#030a03', border: `1px solid ${t.color}18`, borderRadius: '8px', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '14px', transition: 'border-color 0.2s' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '6px', background: `${t.color}10`, border: `1px solid ${t.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: '16px', color: t.color }}>{t.icon}</span>
              </div>
              <div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: t.color, letterSpacing: '0.12em', fontWeight: 600, marginBottom: '3px' }}>{t.label}</div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#1a4a1a', lineHeight: 1.5 }}>{t.desc}</div>
              </div>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#1a3a1a', marginLeft: 'auto', flexShrink: 0 }}>→</span>
            </Link>
          ))}
        </div>
      </div>

      {/* ── LEARNING PATH ──────────────────────────────────── */}
      <div style={{ background: '#030a03', border: '1px solid #0d1f0d', borderRadius: '8px', padding: '1.75rem 2rem', marginBottom: '3rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', color: '#1a4a1a', letterSpacing: '0.25em', marginBottom: '4px' }}>WHERE TO START</div>
        <h2 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1rem', color: '#00ff41', margin: '0 0 1.25rem', fontWeight: 600, letterSpacing: '0.1em' }}>RECOMMENDED LEARNING PATHS</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
          {[
            {
              title: 'COMPLETE BEGINNER',
              color: '#00ff41',
              steps: ['Start: MOD-01 Tor & Dark Web', 'Then: MOD-02 OSINT & Surveillance', 'Explore: /tools Tool Reference', 'Practice: CTF Toolkit', 'Next: MOD-04 Offensive Security'],
            },
            {
              title: 'WEB DEVELOPER → SECURITY',
              color: '#00d4ff',
              steps: ['Start: MOD-06 Web Attacks Advanced', 'Then: MOD-04 Offensive Security', 'Then: MOD-09 Cloud Security', 'Practice: Payload Generator', 'Next: MOD-05 Active Directory'],
            },
            {
              title: 'ASPIRING RED TEAMER',
              color: '#ff3333',
              steps: ['Start: MOD-04 Offensive Security', 'Then: MOD-05 Active Directory', 'Then: MOD-08 Network Attacks', 'Then: MOD-11 Red Team Ops', 'Master: All modules + CTF'],
            },
          ].map(p => (
            <div key={p.title}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '8.5px', color: p.color, letterSpacing: '0.12em', fontWeight: 600, marginBottom: '10px' }}>{p.title}</div>
              {p.steps.map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', padding: '5px 0', borderBottom: '1px solid #0a170a' }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: p.color, opacity: 0.4, flexShrink: 0 }}>{String(i + 1).padStart(2, '0')}</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#2a5a2a' }}>{s}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── FOOTER CTA ─────────────────────────────────────── */}
      <div style={{ textAlign: 'center', padding: '2rem', background: '#030a03', border: '1px solid rgba(0,255,65,0.12)', borderRadius: '8px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 100%, rgba(0,255,65,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', color: '#1a4a1a', letterSpacing: '0.25em', marginBottom: '0.75rem' }}>READY TO BEGIN?</div>
        <h3 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.4rem', color: '#00ff41', margin: '0 0 0.75rem', fontWeight: 700, textShadow: '0 0 20px rgba(0,255,65,0.25)' }}>PICK YOUR FIRST MODULE AND GO DEEP.</h3>
        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', color: '#2a5a2a', maxWidth: '500px', margin: '0 auto 1.5rem', lineHeight: 1.7 }}>
          Everything is documented. Everything is practisable. The GHOST Agent is here to answer questions. There is no wrong starting point — just start.
        </p>
        <Link href="/modules/tor" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', letterSpacing: '0.15em', padding: '12px 32px', borderRadius: '5px', color: '#00ff41', border: '1px solid rgba(0,255,65,0.4)', background: 'rgba(0,255,65,0.08)', display: 'inline-block' }}>
          [ ENTER THE GRID → ]
        </Link>
      </div>
    </div>
  )
}
