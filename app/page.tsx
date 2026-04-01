'use client'
import Link from 'next/link'

const modules = [
  {
    code: 'MOD-01',
    href: '/modules/tor',
    title: 'Tor & Dark Web',
    subtitle: 'Onion routing · Hidden services · Opsec',
    status: 'ACTIVE',
    progress: 0,
    topics: ['Tor Architecture', 'Circuit Building', 'Hidden Services', 'Opsec', 'Deanonymization Risks'],
    color: '#00ff41',
  },
  {
    code: 'MOD-02',
    href: '/modules/osint',
    title: 'OSINT & Surveillance',
    subtitle: 'Reconnaissance · Data aggregation · Footprinting',
    status: 'ACTIVE',
    progress: 0,
    topics: ['Passive Recon', 'Maltego', 'Shodan', 'Social Media Intel', 'Metadata Analysis'],
    color: '#00d4ff',
  },
  {
    code: 'MOD-03',
    href: '/modules/crypto',
    title: 'Crypto & Blockchain',
    subtitle: 'Forensics · Smart contracts · DeFi security',
    status: 'ACTIVE',
    progress: 0,
    topics: ['Blockchain Forensics', 'Smart Contract Auditing', 'DeFi Exploits', 'Chainalysis', 'Privacy Coins'],
    color: '#ffb347',
  },
  {
    code: 'MOD-04',
    href: '/modules/offensive',
    title: 'Offensive Security',
    subtitle: 'Pen testing · Vulnerability research · Exploitation',
    status: 'ACTIVE',
    progress: 0,
    topics: ['Pen Test Methodology', 'Nmap & Enumeration', 'Web App Attacks', 'Privilege Escalation', 'Active Directory', 'Reporting'],
    color: '#bf5fff',
  },
]

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <div style={{ marginBottom: '3rem', paddingBottom: '2rem', borderBottom: '1px solid #1a2e1e' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#5a7a5a', letterSpacing: '0.25em', marginBottom: '1rem' }}>
          INITIALISING GHOSTNET // LEVI KIBIRIE // SECURITY RESEARCH PLATFORM
        </div>
        <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '2.5rem', fontWeight: 700, color: '#00ff41', lineHeight: 1.1, marginBottom: '1rem', textShadow: '0 0 20px rgba(0,255,65,0.5)' }}>
          GHOSTNET
        </h1>
        <p style={{ color: '#5a7a5a', fontSize: '1rem', maxWidth: '540px', lineHeight: 1.7, fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem' }}>
          A private security research knowledge base. Four modules. Every technique, concept, tool and command — documented from first principles to advanced application.
        </p>
        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1.5rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#5a7a5a' }}>
          <span>// 4 MODULES</span>
          <span>// 20+ SUBPAGES</span>
          <span>// CONCEPT + LAB FORMAT</span>
          <span>// CONTINUOUSLY UPDATED</span>
        </div>
      </div>

      {/* Module Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1px', background: '#1a2e1e', border: '1px solid #1a2e1e', borderRadius: '6px', overflow: 'hidden', marginBottom: '3rem' }}>
        {modules.map((mod) => (
          <Link key={mod.code} href={mod.href} style={{ textDecoration: 'none' }}>
            <div style={{
              background: '#0e1410',
              padding: '1.75rem',
              height: '100%',
              transition: 'background 0.2s',
              cursor: 'pointer',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#111a12')}
            onMouseLeave={e => (e.currentTarget.style.background = '#0e1410')}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: mod.color, letterSpacing: '0.2em', opacity: 0.7 }}>{mod.code}</span>
                <span style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '8px',
                  letterSpacing: '0.15em',
                  padding: '2px 8px',
                  borderRadius: '2px',
                  background: mod.status === 'ACTIVE' ? 'rgba(0,255,65,0.1)' : 'rgba(90,122,90,0.1)',
                  color: mod.status === 'ACTIVE' ? '#00ff41' : '#5a7a5a',
                  border: `1px solid ${mod.status === 'ACTIVE' ? 'rgba(0,255,65,0.3)' : '#1a2e1e'}`,
                }}>{mod.status}</span>
              </div>

              {/* Title */}
              <h2 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1rem', fontWeight: 600, color: mod.color, marginBottom: '0.4rem', lineHeight: 1.3 }}>{mod.title}</h2>
              <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#5a7a5a', marginBottom: '1.25rem', letterSpacing: '0.05em' }}>{mod.subtitle}</p>

              {/* Topics */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {mod.topics.map((topic, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: mod.color, opacity: 0.4, fontSize: '10px' }}>›</span>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#5a7a5a' }}>{topic}</span>
                  </div>
                ))}
              </div>

              {/* Enter link */}
              <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #1a2e1e', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: mod.color, opacity: mod.status === 'ACTIVE' ? 1 : 0.3 }}>
                {mod.status === 'ACTIVE' ? '[ ENTER MODULE → ]' : '[ COMING SOON ]'}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Terminal boot log */}
      <div style={{ background: '#050805', border: '1px solid #1a2e1e', borderRadius: '6px', padding: '1.25rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#5a7a5a', lineHeight: 2 }}>
        <div style={{ color: '#2a4a2a', marginBottom: '0.5rem' }}>// SYSTEM LOG</div>
        <div><span style={{ color: '#00ff41' }}>✓</span> ghostnet kernel loaded</div>
        <div><span style={{ color: '#00ff41' }}>✓</span> MOD-01 [tor_darkweb] mounted — concept + lab pages ready</div>
        <div><span style={{ color: '#5a7a5a' }}>○</span> MOD-02 [osint_surveillance] scheduled</div>
        <div><span style={{ color: '#5a7a5a' }}>○</span> MOD-03 [crypto_blockchain] scheduled</div>
        <div><span style={{ color: '#5a7a5a' }}>○</span> MOD-04 [offensive_security] scheduled</div>
        <div style={{ marginTop: '0.5rem' }}>
          <span style={{ color: '#00ff41' }}>$</span> <span style={{ color: '#c8d8c8' }}>navigate to /modules/tor to begin_</span>
          <span style={{ animation: 'blink 1s step-end infinite', color: '#00ff41' }}>█</span>
        </div>
      </div>
    </div>
  )
}
