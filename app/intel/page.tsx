'use client'
import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

interface CVE {
  id: string
  description: string
  severity: string
  score: number
  published: string
  references: string[]
  vendor: string
}

interface ExploitNews {
  title: string
  amount: string
  protocol: string
  date: string
  vector: string
  url: string
}

const DEFI_EXPLOITS: ExploitNews[] = [
  { title: 'Bybit Exchange', amount: '$1.46B', protocol: 'CEX / Safe Multisig', date: '2025-02', vector: 'North Korea (Lazarus) — malicious Safe UI injection, blind multisig signing', url: 'https://rekt.news/bybit-rekt/' },
  { title: 'Infini Protocol', amount: '$49.5M', protocol: 'Stablecoin Yield', date: '2025-02', vector: 'Rogue developer retained admin rights post-audit, drained vault', url: 'https://rekt.news' },
  { title: 'zkLend', amount: '$9.6M', protocol: 'StarkNet Lending', date: '2025-02', vector: 'Rounding error in accumulator — flash loan amplified precision exploit', url: 'https://rekt.news' },
  { title: 'Ionic Money', amount: '$8.6M', protocol: 'Cross-chain Lending', date: '2025-01', vector: 'Fake collateral — fraudulent token listed as legitimate asset', url: 'https://rekt.news' },
  { title: 'Radiant Capital', amount: '$50M', protocol: 'DeFi Lending', date: '2024-10', vector: 'Compromised developer devices + malicious multisig transaction injection', url: 'https://rekt.news/radiant-capital-rekt2/' },
  { title: 'Munchables', amount: '$62.5M', protocol: 'NFT/Gaming', date: '2024-03', vector: 'Rogue developer — storage slot manipulation to set own balance', url: 'https://rekt.news/munchables-rekt/' },
  { title: 'Prisma Finance', amount: '$11.6M', protocol: 'CDP Protocol', date: '2024-03', vector: 'Flash loan + reentrancy in migration contract', url: 'https://rekt.news/prisma-finance-rekt/' },
  { title: 'Orbit Bridge', amount: '$82M', protocol: 'Cross-chain Bridge', date: '2024-01', vector: 'Compromised validator keys — 7 of 10 multisig signers targeted', url: 'https://rekt.news/orbit-bridge-rekt/' },
  { title: 'Euler Finance', amount: '$197M', protocol: 'Lending Protocol', date: '2023-03', vector: 'Flash loan + donation attack bypassing health check — donateToReserves()', url: 'https://rekt.news/euler-rekt/' },
]

const SEVERITY_COLOR: Record<string, string> = {
  CRITICAL: '#ff4136',
  HIGH: '#ff6b35',
  MEDIUM: '#ffb347',
  LOW: '#00d4ff',
  NONE: '#5a7a5a',
}

const CATEGORY_KEYWORDS = {
  network:  ['network', 'tcp', 'udp', 'ssh', 'ftp', 'smb', 'dns', 'vpn', 'firewall', 'router', 'cisco', 'juniper', 'fortinet', 'palo alto'],
  web:      ['http', 'xss', 'csrf', 'injection', 'sql', 'rce', 'lfi', 'rfi', 'apache', 'nginx', 'php', 'wordpress', 'oauth', 'jwt', 'api'],
  crypto:   ['bitcoin', 'ethereum', 'blockchain', 'wallet', 'cryptographic', 'ssl', 'tls', 'openssl', 'certificate', 'defi', 'smart contract'],
  osint:    ['information disclosure', 'exposure', 'leak', 'enumeration', 'directory traversal', 'path traversal'],
  privilege:['privilege', 'escalation', 'sudo', 'kernel', 'local', 'elevation', 'root', 'admin', 'bypass'],
}

function severityBadge(severity: string, score: number) {
  const color = SEVERITY_COLOR[severity] || SEVERITY_COLOR.NONE
  return (
    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', letterSpacing: '0.1em', padding: '2px 8px', borderRadius: '2px', background: `${color}18`, border: `1px solid ${color}44`, color }}>
      {severity} {score > 0 ? score.toFixed(1) : ''}
    </span>
  )
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  const hours = Math.floor(diff / 3600000)
  if (hours < 24) return `${hours}h ago`
  if (days < 30) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export default function IntelPage() {
  const [cves, setCves] = useState<CVE[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<'cve' | 'defi' | 'darkweb'>('cve')
  const [lastUpdated, setLastUpdated] = useState('')

  const fetchCVEs = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const endDate = new Date().toISOString().split('.')[0] + '.000'
      const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('.')[0] + '.000'
      const url = `https://services.nvd.nist.gov/rest/json/cves/2.0?pubStartDate=${startDate}&pubEndDate=${endDate}&resultsPerPage=40`
      const res = await fetch(url)
      const data = await res.json()

      const parsed: CVE[] = (data.vulnerabilities || []).map((v: Record<string, unknown>) => {
        const cve = v.cve as Record<string, unknown>
        const metrics = cve.metrics as Record<string, unknown>
        const cvssData = (
          (metrics?.cvssMetricV31 as Array<Record<string, unknown>>)?.[0] ||
          (metrics?.cvssMetricV30 as Array<Record<string, unknown>>)?.[0] ||
          (metrics?.cvssMetricV2 as Array<Record<string, unknown>>)?.[0]
        )
        const cvssScore = (cvssData?.cvssData as Record<string, unknown>)
        const severity = (cvssData?.baseSeverity as string) ||
          (cvssScore?.baseSeverity as string) || 'NONE'
        const score = (cvssScore?.baseScore as number) || 0
        const descriptions = cve.descriptions as Array<Record<string, unknown>>
        const desc = descriptions?.find((d: Record<string, unknown>) => d.lang === 'en')?.value as string || ''
        const refs = cve.references as Array<Record<string, unknown>>

        return {
          id: cve.id as string,
          description: desc,
          severity: severity.toUpperCase(),
          score,
          published: cve.published as string,
          references: (refs || []).slice(0, 2).map((r: Record<string, unknown>) => r.url as string),
          vendor: desc.split(' ').slice(0, 3).join(' '),
        }
      })

      parsed.sort((a, b) => b.score - a.score)
      setCves(parsed)
      setLastUpdated(new Date().toLocaleTimeString())
    } catch {
      setError('NVD API rate limited — refreshing in 30s')
      setTimeout(fetchCVEs, 30000)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchCVEs() }, [fetchCVEs])

  const filteredCVEs = cves.filter(cve => {
    const text = (cve.description + cve.id).toLowerCase()
    const matchSearch = search === '' || text.includes(search.toLowerCase())
    if (!matchSearch) return false
    if (filter === 'all') return true
    if (filter === 'critical') return cve.severity === 'CRITICAL'
    if (filter === 'high') return cve.severity === 'HIGH'
    const keywords = CATEGORY_KEYWORDS[filter as keyof typeof CATEGORY_KEYWORDS] || []
    return keywords.some(k => text.includes(k))
  })

  const critCount = cves.filter(c => c.severity === 'CRITICAL').length
  const highCount = cves.filter(c => c.severity === 'HIGH').length

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5a7a5a', letterSpacing: '0.25em', marginBottom: '0.5rem' }}>GHOSTNET // LIVE INTELLIGENCE</div>
        <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '2rem', fontWeight: 700, color: '#ff4136', margin: '0.5rem 0', textShadow: '0 0 20px rgba(255,65,54,0.3)' }}>
          THREAT INTELLIGENCE
        </h1>
        <p style={{ color: '#5a7a5a', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem' }}>
          Live CVE feed · DeFi exploit tracker · Updated {lastUpdated || 'loading...'}
        </p>
        <div style={{ marginTop: '12px', background: 'rgba(255,65,54,0.04)', border: '1px solid rgba(255,65,54,0.15)', borderRadius: '4px', padding: '10px 14px' }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#ff4136', letterSpacing: '0.1em', marginRight: '8px' }}>WHAT IS THIS</span>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#5a6a5a', lineHeight: 1.6 }}>
            A live feed of real security vulnerabilities published this week. CVE = a publicly disclosed software flaw with a severity score (0–10). Use the <strong style={{ color: '#8a9a8a' }}>CVE tab</strong> to see what is actively being exploited. Use <strong style={{ color: '#8a9a8a' }}>DeFi tab</strong> for recent crypto hacks. Use <strong style={{ color: '#8a9a8a' }}>DARK WEB tab</strong> for underground intelligence. Filter by severity to focus on what matters most. Ask GHOST Agent to explain any entry.
          </span>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ display: 'flex', gap: '1px', marginBottom: '1.5rem', background: '#1a2e1e', borderRadius: '6px', overflow: 'hidden', border: '1px solid #1a2e1e' }}>
        {[
          { label: 'CVEs this week', value: cves.length, color: '#00ff41' },
          { label: 'Critical', value: critCount, color: '#ff4136' },
          { label: 'High', value: highCount, color: '#ff6b35' },
          { label: 'DeFi exploits tracked', value: DEFI_EXPLOITS.length, color: '#ffb347' },
          { label: 'Last refresh', value: lastUpdated || '...', color: '#00d4ff' },
        ].map((s, i) => (
          <div key={i} style={{ flex: 1, background: '#0e1410', padding: '12px 16px' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#3a5a3a', letterSpacing: '0.15em', marginBottom: '4px' }}>{s.label}</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.1rem', fontWeight: 700, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Tab selector */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '1.5rem' }}>
        {(['cve', 'defi', 'darkweb'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', letterSpacing: '0.15em',
            padding: '6px 16px', borderRadius: '3px', cursor: 'pointer',
            background: activeTab === tab ? 'rgba(255,65,54,0.1)' : 'transparent',
            border: `1px solid ${activeTab === tab ? 'rgba(255,65,54,0.4)' : '#1a2e1e'}`,
            color: activeTab === tab ? '#ff4136' : '#3a5a3a',
          }}>
            {tab === 'cve' ? 'CVE FEED' : tab === 'defi' ? 'DEFI EXPLOITS' : 'DARK WEB INTEL'}
          </button>
        ))}
      </div>

      {/* CVE TAB */}
      {activeTab === 'cve' && (
        <div>
          {/* Filters */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem', flexWrap: 'wrap' as const }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="search CVEs..."
              style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', background: '#0e1410', border: '1px solid #1a2e1e', borderRadius: '4px', padding: '6px 12px', color: '#c8d8c8', outline: 'none', flex: 1, minWidth: '200px' }}
            />
            {['all', 'critical', 'high', 'network', 'web', 'crypto', 'privilege', 'osint'].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', letterSpacing: '0.1em',
                padding: '5px 10px', borderRadius: '3px', cursor: 'pointer',
                background: filter === f ? 'rgba(255,65,54,0.1)' : 'transparent',
                border: `1px solid ${filter === f ? 'rgba(255,65,54,0.3)' : '#1a2e1e'}`,
                color: filter === f ? '#ff4136' : '#3a5a3a',
              }}>{f.toUpperCase()}</button>
            ))}
            <button onClick={fetchCVEs} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', letterSpacing: '0.1em', padding: '5px 12px', borderRadius: '3px', cursor: 'pointer', background: 'rgba(0,255,65,0.05)', border: '1px solid rgba(0,255,65,0.2)', color: '#00ff41' }}>
              REFRESH
            </button>
          </div>

          {loading && (
            <div style={{ textAlign: 'center', padding: '3rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', color: '#3a5a3a' }}>
              QUERYING NVD API...
            </div>
          )}

          {error && (
            <div style={{ padding: '1rem', background: 'rgba(255,65,54,0.05)', border: '1px solid rgba(255,65,54,0.2)', borderRadius: '4px', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#ff4136', marginBottom: '1rem' }}>
              {error}
            </div>
          )}

          {/* CVE List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#1a2e1e', borderRadius: '6px', overflow: 'hidden', border: '1px solid #1a2e1e' }}>
            {filteredCVEs.length === 0 && !loading && (
              <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#3a5a3a', background: '#0e1410' }}>
                No CVEs matching filter
              </div>
            )}
            {filteredCVEs.map((cve, i) => (
              <div key={i} style={{ background: '#0e1410', padding: '14px 16px', borderLeft: `3px solid ${SEVERITY_COLOR[cve.severity] || '#1a2e1e'}` }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' as const }}>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', fontWeight: 700, color: '#00ff41' }}>{cve.id}</span>
                    {severityBadge(cve.severity, cve.score)}
                  </div>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', color: '#3a5a3a', flexShrink: 0 }}>{timeAgo(cve.published)}</span>
                </div>
                <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#8a9a8a', lineHeight: 1.6, margin: '0 0 8px' }}>
                  {cve.description.length > 220 ? cve.description.slice(0, 220) + '...' : cve.description}
                </p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' as const }}>
                  {cve.references.map((ref, j) => (
                    <a key={j} href={ref} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', color: '#3a6a8a', textDecoration: 'none', letterSpacing: '0.05em' }}>
                      → {new URL(ref).hostname}
                    </a>
                  ))}
                  <a href={`https://nvd.nist.gov/vuln/detail/${cve.id}`} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', color: '#2a5a3a', textDecoration: 'none' }}>
                    NVD →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DEFI EXPLOITS TAB */}
      {activeTab === 'defi' && (
        <div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5a7a5a', letterSpacing: '0.2em', marginBottom: '1rem' }}>
            RECENT HIGH-VALUE DeFi EXPLOITS — STUDY THESE ATTACK VECTORS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#2e1e00', borderRadius: '6px', overflow: 'hidden', border: '1px solid #2e1e00' }}>
            {DEFI_EXPLOITS.map((e, i) => (
              <div key={i} style={{ background: '#0e1005', padding: '16px', borderLeft: '3px solid #ff4136' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.9rem', fontWeight: 700, color: '#ffb347' }}>{e.title}</span>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', color: '#5a7a5a', marginLeft: '12px', letterSpacing: '0.1em' }}>{e.protocol}</span>
                  </div>
                  <div style={{ textAlign: 'right' as const }}>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1rem', fontWeight: 700, color: '#ff4136' }}>{e.amount}</div>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', color: '#3a5a3a' }}>{e.date}</div>
                  </div>
                </div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#8a9a8a', marginBottom: '8px' }}>
                  <span style={{ color: '#cc7a00' }}>VECTOR: </span>{e.vector}
                </div>
                <a href={e.url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', color: '#3a4a8a', textDecoration: 'none' }}>
                  READ POST-MORTEM →
                </a>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '1rem', padding: '1rem', background: '#0e1410', border: '1px solid #1a2e1e', borderRadius: '4px', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#5a7a5a' }}>
            Total tracked: <span style={{ color: '#ff4136' }}>$178M+</span> in exploits above · Full database: <a href="https://rekt.news" target="_blank" rel="noopener noreferrer" style={{ color: '#3a5a8a' }}>rekt.news</a> · <a href="https://defillama.com/hacks" target="_blank" rel="noopener noreferrer" style={{ color: '#3a5a8a' }}>DefiLlama Hacks</a>
          </div>
        </div>
      )}

      {/* DARK WEB INTEL TAB */}
      {activeTab === 'darkweb' && (
        <div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5a7a5a', letterSpacing: '0.2em', marginBottom: '1rem' }}>
            DARK WEB INTELLIGENCE SOURCES — MONITOR THESE FOR OPERATIONAL AWARENESS
          </div>

          {/* Ransomware tracker */}
          <div style={{ background: '#0e1410', border: '1px solid #1a2e1e', borderRadius: '6px', padding: '1.25rem', marginBottom: '1rem' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#ff4136', letterSpacing: '0.2em', marginBottom: '0.75rem' }}>RANSOMWARE TRACKER — LIVE FEEDS</div>
            {[
              { name: 'Ransomware.live', url: 'https://ransomware.live', desc: 'Live tracking of ransomware gang activity — victim posts, group status, negotiation leaks' },
              { name: 'ID Ransomware', url: 'https://id-ransomware.malwarehunterteam.com', desc: 'Identify ransomware by sample — 1,000+ variants catalogued' },
              { name: 'Ransomlook', url: 'https://www.ransomlook.io', desc: 'Aggregates victim posts from 80+ ransomware groups in near-real-time' },
              { name: 'DarkFeed', url: 'https://darkfeed.io', desc: 'Commercial — dark web threat intelligence API and dashboard' },
            ].map((s, i) => (
              <div key={i} style={{ padding: '10px 0', borderBottom: '1px solid #0a1208', display: 'flex', gap: '12px' }}>
                <div style={{ flexShrink: 0, width: '160px' }}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#00ff41', fontWeight: 600, textDecoration: 'none' }}>{s.name}</a>
                </div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#5a7a5a', lineHeight: 1.5 }}>{s.desc}</div>
              </div>
            ))}
          </div>

          {/* Leaked data monitors */}
          <div style={{ background: '#0e1410', border: '1px solid #1a2e1e', borderRadius: '6px', padding: '1.25rem', marginBottom: '1rem' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#ffb347', letterSpacing: '0.2em', marginBottom: '0.75rem' }}>LEAKED DATA & BREACH MONITORING</div>
            {[
              { name: 'HaveIBeenPwned', url: 'https://haveibeenpwned.com', desc: 'Email/domain breach monitoring — free API, 14B+ accounts indexed' },
              { name: 'IntelX', url: 'https://intelx.io', desc: 'Search leaked data, pastes, dark web — supports email, domain, IP, Bitcoin addr, IBAN' },
              { name: 'Dehashed', url: 'https://dehashed.com', desc: 'Breach database search — credentials, usernames, addresses, names, phone numbers' },
              { name: 'LeakIX', url: 'https://leakix.net', desc: 'Search exposed services and data leaks — like Shodan but focused on data exposure' },
              { name: 'BreachDirectory', url: 'https://breachdirectory.org', desc: 'Free breach data search — 10B+ records, shows partial password hashes' },
            ].map((s, i) => (
              <div key={i} style={{ padding: '10px 0', borderBottom: '1px solid #0a1208', display: 'flex', gap: '12px' }}>
                <div style={{ flexShrink: 0, width: '160px' }}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#ffb347', fontWeight: 600, textDecoration: 'none' }}>{s.name}</a>
                </div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#5a7a5a', lineHeight: 1.5 }}>{s.desc}</div>
              </div>
            ))}
          </div>

          {/* Crypto tracking */}
          <div style={{ background: '#0e1410', border: '1px solid #1a2e1e', borderRadius: '6px', padding: '1.25rem', marginBottom: '1rem' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#00d4ff', letterSpacing: '0.2em', marginBottom: '0.75rem' }}>CRYPTO INTELLIGENCE</div>
            {[
              { name: 'Rekt.news', url: 'https://rekt.news', desc: 'DeFi exploit post-mortems — every major hack dissected in technical detail' },
              { name: 'DefiLlama Hacks', url: 'https://defillama.com/hacks', desc: 'Live tracker of all DeFi exploits with amounts, dates, and protocol data' },
              { name: 'MistTrack', url: 'https://misttrack.io', desc: 'Crypto address risk scoring and on-chain tracing — by SlowMist' },
              { name: 'Breadcrumbs', url: 'https://www.breadcrumbs.app', desc: 'Free visual on-chain investigation tool — trace funds across addresses' },
              { name: 'Chainalysis Reactor', url: 'https://www.chainalysis.com/chainalysis-reactor/', desc: 'Enterprise blockchain investigation — used by FBI, IRS-CI, Europol' },
              { name: 'DeFiYield REKT DB', url: 'https://defiyield.app/rekt-database', desc: 'Comprehensive database of DeFi hacks — filterable by type, chain, protocol' },
            ].map((s, i) => (
              <div key={i} style={{ padding: '10px 0', borderBottom: '1px solid #0a1208', display: 'flex', gap: '12px' }}>
                <div style={{ flexShrink: 0, width: '160px' }}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#00d4ff', fontWeight: 600, textDecoration: 'none' }}>{s.name}</a>
                </div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#5a7a5a', lineHeight: 1.5 }}>{s.desc}</div>
              </div>
            ))}
          </div>

          {/* Exploit databases */}
          <div style={{ background: '#0e1410', border: '1px solid #1a2e1e', borderRadius: '6px', padding: '1.25rem' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#bf5fff', letterSpacing: '0.2em', marginBottom: '0.75rem' }}>EXPLOIT & VULNERABILITY DATABASES</div>
            {[
              { name: 'Exploit-DB', url: 'https://www.exploit-db.com', desc: 'Offensive Security\'s public exploit archive — searchable by CVE, platform, type' },
              { name: 'Packet Storm', url: 'https://packetstormsecurity.com', desc: 'Exploits, tools, advisories — one of the oldest security resources online' },
              { name: 'VulnHub', url: 'https://www.vulnhub.com', desc: 'Downloadable vulnerable VMs for practice — full offensive security lab setup' },
              { name: 'Nuclei Templates', url: 'https://github.com/projectdiscovery/nuclei-templates', desc: '6,000+ community vulnerability templates — run against authorised targets' },
              { name: '0day.today', url: 'https://0day.today', desc: 'Zero-day exploit marketplace and database — research only, many commercial' },
            ].map((s, i) => (
              <div key={i} style={{ padding: '10px 0', borderBottom: '1px solid #0a1208', display: 'flex', gap: '12px' }}>
                <div style={{ flexShrink: 0, width: '160px' }}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#bf5fff', fontWeight: 600, textDecoration: 'none' }}>{s.name}</a>
                </div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#5a7a5a', lineHeight: 1.5 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid #1a2e1e', display: 'flex', gap: '1rem' }}>
        <Link href="/tools" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#00ff41', padding: '8px 20px', border: '1px solid rgba(0,255,65,0.3)', borderRadius: '4px', background: 'rgba(0,255,65,0.05)' }}>
          TOOL REFERENCE →
        </Link>
        <Link href="/" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5a7a5a', padding: '8px 20px', border: '1px solid #1a2e1e', borderRadius: '4px' }}>
          ← DASHBOARD
        </Link>
      </div>
    </div>
  )
}
