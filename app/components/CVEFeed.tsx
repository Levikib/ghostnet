'use client'
import React, { useState, useEffect } from 'react'

interface CVE {
  id: string
  description: string
  severity: string
  score: number
  published: string
  url: string
}

const SEVERITY_COLOR: Record<string, string> = {
  CRITICAL: '#ff4136',
  HIGH: '#ffb347',
  MEDIUM: '#00d4ff',
  LOW: '#00ff41',
  NONE: '#5a7a5a',
}

export default function CVEFeed() {
  const [open, setOpen] = useState(false)
  const [cves, setCves] = useState<CVE[]>([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState<string>('ALL')
  const [error, setError] = useState('')

  const fetchCVEs = async () => {
    setLoading(true)
    setError('')
    try {
      const url = `https://services.nvd.nist.gov/rest/json/cves/2.0?resultsPerPage=20&startIndex=0`
      const res = await fetch(url)
      const data = await res.json()
      const parsed: CVE[] = (data.vulnerabilities || []).map((v: Record<string, unknown>) => {
        const cve = v.cve as Record<string, unknown>
        const desc = (cve.descriptions as Array<{lang: string; value: string}>)?.find((d) => d.lang === 'en')?.value || 'No description'
        const metrics = cve.metrics as Record<string, unknown>
        const cvssV31 = (metrics?.cvssMetricV31 as Array<Record<string, unknown>>)?.[0]
        const cvssV30 = (metrics?.cvssMetricV30 as Array<Record<string, unknown>>)?.[0]
        const cvssV2 = (metrics?.cvssMetricV2 as Array<Record<string, unknown>>)?.[0]
        const cvssData = (cvssV31?.cvssData || cvssV30?.cvssData || cvssV2?.cvssData) as Record<string, unknown> | undefined
        const score = (cvssData?.baseScore as number) || 0
        const severity = (cvssData?.baseSeverity as string) || (cvssV2?.baseSeverity as string) || 'NONE'
        return {
          id: cve.id as string,
          description: desc.length > 120 ? desc.slice(0, 120) + '...' : desc,
          severity: severity.toUpperCase(),
          score,
          published: new Date(cve.published as string).toLocaleDateString(),
          url: `https://nvd.nist.gov/vuln/detail/${cve.id}`,
        }
      })
      setCves(parsed)
    } catch {
      setError('Failed to fetch CVEs — NVD API may be rate-limited. Try again in 30s.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open && cves.length === 0) fetchCVEs()
  }, [open])

  const filtered = filter === 'ALL' ? cves : cves.filter(c => c.severity === filter)

  return (
    <>
      <style>{`
        @keyframes pulse-red{0%,100%{box-shadow:0 0 4px #ff4136}50%{box-shadow:0 0 12px #ff4136}}
        .cve-btn{position:fixed;bottom:62px;right:24px;z-index:9000}
        .cve-panel{position:fixed;bottom:100px;right:24px;z-index:9001;width:320px;max-height:40vh}
        @media(max-width:768px){
          .cve-btn{bottom:54px;right:8px}
          .cve-panel{bottom:96px;right:8px;left:8px;width:auto;max-height:55vh}
        }
      `}</style>
      <button onClick={() => setOpen(!open)} className="cve-btn" style={{ background: 'rgba(255,65,54,0.08)', border: '1px solid rgba(255,65,54,0.3)', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', color: '#ff4136', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '5px', height: '32px', boxSizing: 'border-box' as const }}>
        <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#ff4136', animation: 'pulse-red 2s infinite', flexShrink: 0 }} />
        LIVE CVE FEED
      </button>

      {open && (
        <div className="cve-panel" style={{ background: '#080c0a', border: '1px solid rgba(255,65,54,0.2)', borderRadius: '10px', display: 'flex', flexDirection: 'column', fontFamily: 'JetBrains Mono, monospace', overflow: 'hidden' }}>
          <div style={{ padding: '10px 14px', borderBottom: '1px solid #1a2e1e', background: 'rgba(255,65,54,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#ff4136', fontWeight: 700, letterSpacing: '0.15em' }}>LIVE CVE FEED</div>
              <div style={{ fontSize: '8px', color: '#3a2020', marginTop: '2px', letterSpacing: '0.1em' }}>SOURCE: NVD / NIST</div>
            </div>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <button onClick={fetchCVEs} style={{ background: 'rgba(255,65,54,0.08)', border: '1px solid rgba(255,65,54,0.2)', borderRadius: '3px', padding: '3px 8px', cursor: 'pointer', fontSize: '7px', color: '#ff4136', letterSpacing: '0.1em' }}>{loading ? '...' : 'REFRESH'}</button>
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: '#3a2020', cursor: 'pointer', fontSize: '16px' }}>×</button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '3px', padding: '6px 10px', borderBottom: '1px solid #1a2e1e' }}>
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{ background: filter === f ? `${SEVERITY_COLOR[f] || '#5a7a5a'}15` : 'transparent', border: `1px solid ${filter === f ? (SEVERITY_COLOR[f] || '#5a7a5a') + '44' : '#1a2e1e'}`, borderRadius: '3px', padding: '2px 7px', cursor: 'pointer', fontSize: '7px', color: filter === f ? (SEVERITY_COLOR[f] || '#5a7a5a') : '#3a5a3a', letterSpacing: '0.08em' }}>{f}</button>
            ))}
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '6px 8px' }}>
            {loading && <div style={{ padding: '20px', textAlign: 'center', fontSize: '0.7rem', color: '#3a5a3a' }}>Fetching latest CVEs from NVD...</div>}
            {error && <div style={{ padding: '12px', fontSize: '0.7rem', color: '#ff4136', background: 'rgba(255,65,54,0.05)', borderRadius: '4px', margin: '8px' }}>{error}</div>}
            {!loading && filtered.map(cve => (
              <a key={cve.id} href={cve.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block' }}>
                <div style={{ padding: '8px 10px', borderRadius: '4px', marginBottom: '4px', background: 'rgba(255,65,54,0.02)', border: '1px solid #1a2e1e', cursor: 'pointer' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,65,54,0.25)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#1a2e1e' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '9px', color: '#ff4136', fontWeight: 700 }}>{cve.id}</span>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <span style={{ fontSize: '8px', color: SEVERITY_COLOR[cve.severity] || '#5a7a5a', background: `${SEVERITY_COLOR[cve.severity] || '#5a7a5a'}15`, padding: '1px 6px', borderRadius: '2px' }}>{cve.severity}</span>
                      {cve.score > 0 && <span style={{ fontSize: '9px', color: SEVERITY_COLOR[cve.severity] || '#5a7a5a', fontWeight: 700 }}>{cve.score.toFixed(1)}</span>}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#5a7a5a', lineHeight: 1.5 }}>{cve.description}</div>
                  <div style={{ fontSize: '7px', color: '#2a4a2a', marginTop: '4px' }}>{cve.published}</div>
                </div>
              </a>
            ))}
            {!loading && filtered.length === 0 && cves.length > 0 && (
              <div style={{ padding: '12px', textAlign: 'center', fontSize: '0.7rem', color: '#3a5a3a' }}>No {filter} severity CVEs in current batch</div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
