'use client'

import { useState } from 'react'

const accent = '#00d4ff'
const accentDim = 'rgba(0,212,255,0.08)'
const accentBorder = 'rgba(0,212,255,0.3)'

interface FilterField {
  key: string
  label: string
  placeholder: string
  example: string
}

const FILTER_GROUPS: { label: string; color: string; filters: FilterField[] }[] = [
  {
    label: 'Network',
    color: '#00d4ff',
    filters: [
      { key: 'ip', label: 'IP / CIDR', placeholder: '192.168.1.0/24', example: '192.168.1.0/24' },
      { key: 'port', label: 'Port', placeholder: '22, 80, 443, 8080', example: '22' },
      { key: 'net', label: 'Network (CIDR)', placeholder: '198.20.0.0/16', example: '198.20.0.0/16' },
      { key: 'asn', label: 'ASN', placeholder: 'AS15169', example: 'AS15169' },
    ],
  },
  {
    label: 'Location',
    color: '#ffb347',
    filters: [
      { key: 'country', label: 'Country (ISO)', placeholder: 'US, DE, CN, RU', example: 'US' },
      { key: 'city', label: 'City', placeholder: 'London, Tokyo', example: 'London' },
      { key: 'region', label: 'Region / State', placeholder: 'California', example: 'California' },
      { key: 'org', label: 'Organization', placeholder: 'Google, Amazon', example: 'Google' },
    ],
  },
  {
    label: 'Service',
    color: '#00ff41',
    filters: [
      { key: 'product', label: 'Product / Software', placeholder: 'Apache, nginx, OpenSSH', example: 'Apache' },
      { key: 'version', label: 'Version', placeholder: '2.4.49, 7.9', example: '2.4.49' },
      { key: 'os', label: 'Operating System', placeholder: 'Windows 10, Linux', example: 'Windows 10' },
      { key: 'hostname', label: 'Hostname', placeholder: '*.example.com', example: '*.shodan.io' },
    ],
  },
  {
    label: 'SSL / TLS',
    color: '#bf5fff',
    filters: [
      { key: 'ssl.cert.subject.cn', label: 'SSL Common Name', placeholder: '*.google.com', example: '*.google.com' },
      { key: 'ssl.cert.issuer.cn', label: 'SSL Issuer', placeholder: "Let's Encrypt", example: "Let's Encrypt" },
      { key: 'ssl.cipher.name', label: 'SSL Cipher', placeholder: 'AES256-GCM-SHA384', example: 'AES256-GCM-SHA384' },
      { key: 'has_ssl', label: 'Has SSL', placeholder: 'true / false', example: 'true' },
    ],
  },
  {
    label: 'HTTP',
    color: '#ff6ec7',
    filters: [
      { key: 'http.title', label: 'Page Title', placeholder: 'Login, Dashboard', example: 'Admin Panel' },
      { key: 'http.status', label: 'HTTP Status', placeholder: '200, 401, 403', example: '200' },
      { key: 'http.html', label: 'HTML Content', placeholder: 'password, admin', example: 'password' },
      { key: 'http.server', label: 'Server Header', placeholder: 'Apache/2.4', example: 'Apache' },
    ],
  },
  {
    label: 'ICS / IoT',
    color: '#ff4136',
    filters: [
      { key: 'device', label: 'Device Type', placeholder: 'router, webcam, printer', example: 'webcam' },
      { key: 'tag', label: 'Tag', placeholder: 'ics, scada, camera, vpn', example: 'ics' },
      { key: 'category', label: 'Category', placeholder: 'ics, malware, industrial', example: 'ics' },
      { key: 'cpe', label: 'CPE', placeholder: 'cpe:/a:apache:http_server', example: 'cpe:/a:apache' },
    ],
  },
]

const EXAMPLE_QUERIES = [
  { label: 'Default Cisco login', query: 'title:"Cisco" "Please login" port:443', color: '#00d4ff' },
  { label: 'Exposed Webcams', query: 'product:"Webcam" has_screenshot:true', color: '#ff6ec7' },
  { label: 'Open Elasticsearch', query: 'product:elastic port:9200 -authentication', color: '#ffb347' },
  { label: 'Exposed MongoDB', query: 'product:"MongoDB" port:27017 -authentication', color: '#ff4136' },
  { label: 'RDP servers (US)', query: 'port:3389 country:US os:"Windows"', color: '#00d4ff' },
  { label: 'Apache 2.4.49 (CVE-2021-41773)', query: 'product:Apache version:2.4.49', color: '#ff4136' },
  { label: 'Misconfigured S3 via Shodan', query: 'http.title:"S3 Bucket Listing"', color: '#ffb347' },
  { label: 'ICS / SCADA systems', query: 'tag:ics country:US', color: '#ff4136' },
  { label: 'Jenkins CI servers', query: 'http.title:"Dashboard [Jenkins]"', color: '#00ff41' },
  { label: 'Palo Alto GlobalProtect', query: 'http.title:"GlobalProtect Portal" port:443', color: '#bf5fff' },
  { label: 'Fortinet SSL-VPN', query: 'http.title:"/remote/login" product:FortiGate', color: '#bf5fff' },
  { label: 'Printers with open access', query: 'device:printer has_screenshot:true', color: '#ff6ec7' },
  { label: 'Kubernetes dashboards', query: 'http.title:"Kubernetes Dashboard"', color: '#aaff00' },
  { label: 'Redis no-auth', query: 'product:"Redis" port:6379 -authentication', color: '#ffb347' },
  { label: 'FTP Anonymous login', query: 'port:21 "230 Login successful" "Anonymous"', color: '#00d4ff' },
  { label: 'MQTT brokers (IoT)', query: 'port:1883 product:mosquitto', color: '#ff6ec7' },
  { label: 'VMware vCenter', query: 'http.title:"vSphere Web Client"', color: '#7c4dff' },
  { label: 'Citrix NetScaler', query: 'http.title:"Citrix Gateway" port:443', color: '#7c4dff' },
  { label: 'Exposed phpMyAdmin', query: 'http.title:"phpMyAdmin" http.status:200', color: '#00ff41' },
  { label: 'OT: Modbus devices', query: 'port:502 product:Modbus', color: '#ff4136' },
]

type FilterValues = Record<string, string>
type BooleanOp = 'AND' | 'OR'

export default function ShodanPage() {
  const [filters, setFilters] = useState<FilterValues>({})
  const [freeText, setFreeText] = useState('')
  const [boolOp] = useState<BooleanOp>('AND')
  const [negated, setNegated] = useState<Set<string>>(new Set())
  const [copiedQuery, setCopiedQuery] = useState(false)
  const [activeGroup, setActiveGroup] = useState<string | null>('Network')

  const updateFilter = (key: string, value: string) => {
    setFilters(prev => {
      if (!value.trim()) {
        const next = { ...prev }
        delete next[key]
        return next
      }
      return { ...prev, [key]: value }
    })
  }

  const toggleNegate = (key: string) => {
    setNegated(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const buildQuery = (): string => {
    const parts: string[] = []
    if (freeText.trim()) parts.push(freeText.trim())

    FILTER_GROUPS.forEach(group => {
      group.filters.forEach(f => {
        const val = filters[f.key]?.trim()
        if (!val) return
        const prefix = negated.has(f.key) ? '-' : ''
        // Special keys that are bare (no colon syntax)
        if (f.key === 'ip') {
          parts.push(prefix + val)
        } else if (val.includes(' ') && !val.startsWith('"')) {
          parts.push(prefix + f.key + ':"' + val + '"')
        } else {
          parts.push(prefix + f.key + ':' + val)
        }
      })
    })

    return parts.join(' ' + boolOp + ' ').replace(/ AND /g, ' ')
  }

  const query = buildQuery()
  const isEmpty = query.trim().length === 0
  const tokenCount = Object.keys(filters).length + (freeText.trim() ? 1 : 0)

  const copyQuery = () => {
    navigator.clipboard.writeText(query).then(() => {
      setCopiedQuery(true)
      setTimeout(() => setCopiedQuery(false), 2000)
    })
  }

  const loadExample = (q: string) => {
    setFilters({})
    setFreeText(q)
    setNegated(new Set())
  }

  const clearAll = () => {
    setFilters({})
    setFreeText('')
    setNegated(new Set())
  }

  const openShodan = () => {
    if (!isEmpty) {
      window.open('https://www.shodan.io/search?query=' + encodeURIComponent(query), '_blank')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#e0e0e0', fontFamily: 'JetBrains Mono, monospace', padding: '32px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <span style={{ color: accent, fontSize: '20px' }}>◈</span>
          <span style={{ color: '#555', fontSize: '12px' }}>TOOL-08</span>
          <span style={{ color: '#333' }}>|</span>
          <span style={{ color: '#555', fontSize: '12px' }}>RECON</span>
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: accent, margin: 0, letterSpacing: '2px' }}>
          SHODAN QUERY BUILDER
        </h1>
        <p style={{ color: '#888', fontSize: '13px', marginTop: '6px' }}>
          Build Shodan search queries with point-and-click filters. Live preview assembles the query as you type.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '24px', alignItems: 'start' }}>
        {/* Left — Filter builder */}
        <div>
          {/* Free text + controls */}
          <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '6px', padding: '20px', marginBottom: '16px' }}>
            <label style={{ color: '#555', fontSize: '10px', display: 'block', marginBottom: '6px' }}>FREE-TEXT SEARCH</label>
            <input
              value={freeText}
              onChange={e => setFreeText(e.target.value)}
              placeholder='e.g.  "default password"  or paste a full query here'
              style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', borderRadius: '4px', color: '#ccc', padding: '10px 12px', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', boxSizing: 'border-box' }}
            />
            <p style={{ color: '#444', fontSize: '11px', margin: '6px 0 0' }}>
              Quoted strings search banner/HTML content. Combine with filters below.
            </p>
          </div>

          {/* Filter groups */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
            {FILTER_GROUPS.map(g => (
              <button
                key={g.label}
                onClick={() => setActiveGroup(activeGroup === g.label ? null : g.label)}
                style={{ background: activeGroup === g.label ? g.color + '22' : '#111', border: '1px solid ' + (activeGroup === g.label ? g.color + '55' : '#1e1e1e'), color: activeGroup === g.label ? g.color : '#666', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', fontWeight: 700, transition: 'all 0.15s' }}
              >
                {g.label}
                {Object.keys(filters).some(k => g.filters.some(f => f.key === k)) && (
                  <span style={{ marginLeft: '6px', background: g.color, color: '#000', borderRadius: '10px', padding: '1px 5px', fontSize: '9px' }}>
                    {g.filters.filter(f => filters[f.key]).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {FILTER_GROUPS.filter(g => g.label === activeGroup).map(group => (
            <div key={group.label} style={{ background: '#111', border: '1px solid ' + group.color + '33', borderRadius: '6px', padding: '20px', marginBottom: '16px' }}>
              <p style={{ color: group.color, fontSize: '11px', fontWeight: 700, margin: '0 0 16px' }}>{group.label.toUpperCase()} FILTERS</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {group.filters.map(f => {
                  const hasValue = !!filters[f.key]?.trim()
                  const isNeg = negated.has(f.key)
                  return (
                    <div key={f.key}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <label style={{ color: hasValue ? group.color : '#555', fontSize: '10px', transition: 'color 0.2s' }}>
                          {f.label}
                          {hasValue && <span style={{ marginLeft: '4px', color: '#555', fontSize: '9px' }}>({f.key}:)</span>}
                        </label>
                        {hasValue && (
                          <button
                            onClick={() => toggleNegate(f.key)}
                            title="Toggle NOT"
                            style={{ background: isNeg ? '#ff413622' : 'none', border: '1px solid ' + (isNeg ? '#ff413666' : '#333'), color: isNeg ? '#ff4136' : '#444', padding: '1px 5px', borderRadius: '3px', cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', fontSize: '9px' }}
                          >
                            {isNeg ? 'NOT' : 'NOT?'}
                          </button>
                        )}
                      </div>
                      <input
                        value={filters[f.key] || ''}
                        onChange={e => updateFilter(f.key, e.target.value)}
                        placeholder={f.placeholder}
                        style={{ width: '100%', background: '#0a0a0a', border: '1px solid ' + (hasValue ? group.color + '55' : '#222'), borderRadius: '4px', color: hasValue ? '#ccc' : '#555', padding: '6px 8px', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          ))}

          {/* Example queries */}
          <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '6px', padding: '20px' }}>
            <p style={{ color: '#555', fontSize: '11px', margin: '0 0 14px' }}>EXAMPLE QUERIES — click to load</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {EXAMPLE_QUERIES.map(ex => (
                <button
                  key={ex.label}
                  onClick={() => loadExample(ex.query)}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '4px', padding: '8px 12px', cursor: 'pointer', textAlign: 'left', fontFamily: 'JetBrains Mono, monospace' }}
                >
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: ex.color, flexShrink: 0 }} />
                  <span style={{ color: '#aaa', fontSize: '11px', minWidth: '200px' }}>{ex.label}</span>
                  <span style={{ color: '#444', fontSize: '11px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{ex.query}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Live preview */}
        <div style={{ position: 'sticky', top: '24px' }}>
          <div style={{ background: '#111', border: '1px solid ' + accentBorder, borderRadius: '6px', padding: '20px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ color: accent, fontSize: '11px', fontWeight: 700 }}>LIVE QUERY PREVIEW</span>
              <span style={{ color: '#444', fontSize: '10px' }}>{tokenCount} token{tokenCount !== 1 ? 's' : ''}</span>
            </div>

            <div style={{ background: '#0a0a0a', border: '1px solid #1e1e1e', borderRadius: '4px', padding: '14px', minHeight: '80px', marginBottom: '12px' }}>
              {isEmpty ? (
                <span style={{ color: '#333', fontSize: '12px', fontStyle: 'italic' }}>// Add filters or free text to build query</span>
              ) : (
                <span style={{ color: accent, fontSize: '13px', lineHeight: '1.6', wordBreak: 'break-all' }}>{query}</span>
              )}
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={copyQuery}
                disabled={isEmpty}
                style={{ flex: 1, background: isEmpty ? '#0a0a0a' : accentDim, border: '1px solid ' + (isEmpty ? '#222' : accentBorder), color: isEmpty ? '#333' : accent, padding: '10px', borderRadius: '4px', cursor: isEmpty ? 'not-allowed' : 'pointer', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', fontWeight: 700 }}
              >
                {copiedQuery ? '✓ COPIED' : '⎘ COPY'}
              </button>
              <button
                onClick={openShodan}
                disabled={isEmpty}
                style={{ flex: 1, background: isEmpty ? '#0a0a0a' : 'rgba(0,212,255,0.15)', border: '1px solid ' + (isEmpty ? '#222' : accentBorder), color: isEmpty ? '#333' : accent, padding: '10px', borderRadius: '4px', cursor: isEmpty ? 'not-allowed' : 'pointer', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', fontWeight: 700 }}
              >
                ↗ OPEN SHODAN
              </button>
            </div>

            {!isEmpty && (
              <button onClick={clearAll} style={{ width: '100%', marginTop: '8px', background: 'none', border: '1px solid #1e1e1e', color: '#444', padding: '6px', borderRadius: '4px', cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px' }}>
                CLEAR ALL
              </button>
            )}
          </div>

          {/* Active filters summary */}
          {tokenCount > 0 && (
            <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '6px', padding: '16px', marginBottom: '16px' }}>
              <p style={{ color: '#555', fontSize: '10px', margin: '0 0 10px' }}>ACTIVE FILTERS</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {freeText.trim() && (
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ color: '#555', fontSize: '10px', minWidth: '70px' }}>free-text</span>
                    <span style={{ color: '#ccc', fontSize: '11px', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{freeText}</span>
                    <button onClick={() => setFreeText('')} style={{ background: 'none', border: 'none', color: '#444', cursor: 'pointer', fontSize: '12px', padding: 0 }}>✕</button>
                  </div>
                )}
                {FILTER_GROUPS.flatMap(g => g.filters).filter(f => filters[f.key]).map(f => {
                  const group = FILTER_GROUPS.find(g => g.filters.some(ff => ff.key === f.key))
                  const isNeg = negated.has(f.key)
                  return (
                    <div key={f.key} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      {isNeg && <span style={{ color: '#ff4136', fontSize: '9px' }}>NOT</span>}
                      <span style={{ color: group?.color || '#555', fontSize: '10px', minWidth: '70px' }}>{f.key}</span>
                      <span style={{ color: '#ccc', fontSize: '11px', flex: 1 }}>{filters[f.key]}</span>
                      <button onClick={() => updateFilter(f.key, '')} style={{ background: 'none', border: 'none', color: '#444', cursor: 'pointer', fontSize: '12px', padding: 0 }}>✕</button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Shodan tips */}
          <div style={{ background: accentDim, border: '1px solid ' + accentBorder, borderRadius: '6px', padding: '16px' }}>
            <p style={{ color: accent, fontSize: '11px', fontWeight: 700, margin: '0 0 10px' }}>SHODAN TIPS</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                ['Quotes', '"default password" — search exact banner text'],
                ['Negation', '-country:US — exclude matching results'],
                ['Wildcards', 'hostname:*.gov — wildcard hostnames'],
                ['Facets', 'Use Shodan\'s sidebar to facet by country, org, port'],
                ['API', 'shodan search --fields ip_str,port,org "{query}"'],
                ['Credits', 'Complex filters require a Shodan account/API key'],
              ].map(([title, desc]) => (
                <div key={title}>
                  <span style={{ color: accent, fontSize: '10px' }}>{title}: </span>
                  <span style={{ color: '#666', fontSize: '10px' }}>{desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ethical note */}
          <div style={{ marginTop: '12px', background: 'rgba(255,65,54,0.06)', border: '1px solid rgba(255,65,54,0.2)', borderRadius: '6px', padding: '12px' }}>
            <p style={{ color: '#ff4136', fontSize: '10px', fontWeight: 700, margin: '0 0 4px' }}>LEGAL REMINDER</p>
            <p style={{ color: '#664', fontSize: '10px', margin: 0, lineHeight: '1.5' }}>
              Shodan only shows passively collected data. Do not attempt to access any discovered systems without explicit written authorization. Unauthorized access is illegal.
            </p>
          </div>
        </div>
      </div>

      {/* Nav footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '48px', paddingTop: '24px', borderTop: '1px solid #1e1e1e' }}>
        <a href="/attack-path" style={{ color: '#555', fontSize: '12px', textDecoration: 'none' }}>← Attack Path Visualizer</a>
        <a href="/" style={{ color: '#555', fontSize: '12px', textDecoration: 'none' }}>Dashboard →</a>
      </div>
    </div>
  )
}
