'use client'
import React, { useState } from 'react'
import Link from 'next/link'

const accent = '#00ff41'
const accentDim = 'rgba(0,255,65,0.08)'
const accentBorder = 'rgba(0,255,65,0.3)'

const Label = ({ children }: { children: React.ReactNode }) => (
  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#3a6a3a', letterSpacing: '0.2em', marginBottom: '6px' }}>{children}</div>
)

const Input = ({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) => (
  <input
    value={value}
    onChange={e => onChange(e.target.value)}
    placeholder={placeholder}
    style={{ width: '100%', background: '#050805', border: '1px solid #1a2e1e', borderRadius: '4px', padding: '8px 12px', color: '#c8d8c8', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', outline: 'none', boxSizing: 'border-box' as const }}
  />
)

const Select = ({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) => (
  <select
    value={value}
    onChange={e => onChange(e.target.value)}
    style={{ width: '100%', background: '#050805', border: '1px solid #1a2e1e', borderRadius: '4px', padding: '8px 12px', color: '#c8d8c8', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', outline: 'none', boxSizing: 'border-box' as const }}
  >
    {options.map(o => <option key={o} value={o}>{o}</option>)}
  </select>
)

const Textarea = ({ value, onChange, placeholder, rows }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) => (
  <textarea
    value={value}
    onChange={e => onChange(e.target.value)}
    placeholder={placeholder}
    rows={rows || 4}
    style={{ width: '100%', background: '#050805', border: '1px solid #1a2e1e', borderRadius: '4px', padding: '8px 12px', color: '#c8d8c8', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', outline: 'none', resize: 'vertical', boxSizing: 'border-box' as const, lineHeight: 1.6 }}
  />
)

interface Finding {
  id: number
  title: string
  severity: string
  cvss: string
  asset: string
  description: string
  impact: string
  recommendation: string
}

const SEVERITY_COLORS: Record<string, string> = {
  CRITICAL: '#ff4136',
  HIGH: '#ffb347',
  MEDIUM: '#00d4ff',
  LOW: '#00ff41',
  INFO: '#5a7a5a',
}

export default function ReportGenerator() {
  const [engagementName, setEngagementName] = useState('')
  const [clientName, setClientName] = useState('')
  const [testerName, setTesterName] = useState('')
  const [testDate, setTestDate] = useState('')
  const [scope, setScope] = useState('')
  const [methodology, setMethodology] = useState('Black Box')
  const [executiveSummary, setExecutiveSummary] = useState('')
  const [findings, setFindings] = useState<Finding[]>([
    { id: 1, title: '', severity: 'HIGH', cvss: '', asset: '', description: '', impact: '', recommendation: '' }
  ])
  const [loading, setLoading] = useState(false)
  const [aiSection, setAiSection] = useState<'summary' | 'finding' | null>(null)
  const [aiTarget, setAiTarget] = useState<number | null>(null)
  const [aiError, setAiError] = useState('')
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)

  const addFinding = () => {
    setFindings(prev => [...prev, {
      id: prev.length + 1,
      title: '', severity: 'HIGH', cvss: '', asset: '',
      description: '', impact: '', recommendation: ''
    }])
  }

  const removeFinding = (id: number) => {
    setFindings(prev => prev.filter(f => f.id !== id))
  }

  const updateFinding = (id: number, field: keyof Finding, value: string) => {
    setFindings(prev => prev.map(f => f.id === id ? { ...f, [field]: value } : f))
  }

  const callAI = async (
    prompt: string,
    onResult: (text: string) => void,
    onDone: () => void
  ) => {
    setLoading(true)
    setAiError('')
    try {
      const res = await fetch('/api/ghost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt: 'You are a senior penetration tester writing professional security assessment reports. Write concise, accurate, technically precise content. Use plain professional language — no marketing fluff. Do not add preamble, do not explain what you are about to write, do not add a closing sentence. Output only the requested content.',
          messages: [{ role: 'user', content: prompt }],
        }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      onResult(data.text || '')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      setAiError(msg)
    } finally {
      setLoading(false)
      onDone()
    }
  }

  const generateSummary = () => {
    if (loading) return
    setAiSection('summary')
    const sevCounts = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'].map(s => {
      const n = findings.filter(f => f.severity === s).length
      return n > 0 ? n + ' ' + s : null
    }).filter(Boolean).join(', ')
    const findingsList = findings
      .filter(f => f.title.trim())
      .map(f => '- ' + f.title + ' [' + f.severity + ']' + (f.asset ? ' on ' + f.asset : ''))
      .join('\n')
    const prompt = [
      'Write a professional executive summary for a penetration test report. Use 2-3 paragraphs.',
      'Client: ' + (clientName || 'the client'),
      'Engagement: ' + (engagementName || 'Security Assessment'),
      'Methodology: ' + methodology,
      'Scope: ' + (scope || 'network and web applications'),
      'Findings (' + (sevCounts || 'none recorded') + '):',
      findingsList || '(no findings entered yet)',
      '',
      'Paragraph 1: overall security posture and engagement purpose.',
      'Paragraph 2: summary of key findings and their business risk.',
      'Paragraph 3: high-level remediation priority and recommended next steps.',
      'Write in third person. No bullet points. No heading labels.',
    ].join('\n')
    callAI(prompt, text => setExecutiveSummary(text), () => setAiSection(null))
  }

  const generateFindingDesc = (f: Finding) => {
    if (loading) return
    setAiSection('finding')
    setAiTarget(f.id)
    const prompt = [
      'Write a penetration test finding description. Three paragraphs, no headings, no bullet points.',
      'Finding: ' + f.title,
      'Severity: ' + f.severity,
      'Affected asset: ' + (f.asset || 'target system'),
      f.impact ? 'Known impact context: ' + f.impact : '',
      '',
      'Paragraph 1: Technical explanation of the vulnerability — what it is, the root cause, and the relevant CWE or vulnerability class.',
      'Paragraph 2: How the vulnerability was discovered and reproduced during testing — specific evidence or steps taken.',
      'Paragraph 3: What an attacker could achieve by exploiting it, and why the severity rating is appropriate.',
    ].filter(Boolean).join('\n')
    callAI(prompt, text => updateFinding(f.id, 'description', text), () => { setAiSection(null); setAiTarget(null) })
  }

  const generateRecommendation = (f: Finding) => {
    if (loading) return
    setAiSection('finding')
    setAiTarget(f.id)
    const prompt = [
      'Write a remediation recommendation for this penetration test finding.',
      'Finding: ' + f.title,
      'Severity: ' + f.severity,
      'Affected asset: ' + (f.asset || 'target system'),
      f.description ? 'Description context: ' + f.description.slice(0, 300) : '',
      '',
      'Write exactly 3 sentences:',
      '1. Immediate mitigation step the team can take right now to reduce exposure.',
      '2. Long-term fix — the proper architectural or configuration change to permanently remediate.',
      '3. Reference standard: cite the specific CWE, CVE, or OWASP item that applies.',
      'Be specific and actionable. No bullet points. No headings.',
    ].filter(Boolean).join('\n')
    callAI(prompt, text => updateFinding(f.id, 'recommendation', text), () => { setAiSection(null); setAiTarget(null) })
  }

  const buildReport = () => {
    const date = testDate || new Date().toISOString().split('T')[0]
    const sevOrder = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO']
    const sorted = [...findings].sort((a, b) => sevOrder.indexOf(a.severity) - sevOrder.indexOf(b.severity))

    const riskSummary = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'].map(s => {
      const count = findings.filter(f => f.severity === s).length
      return count > 0 ? s + ': ' + count : null
    }).filter(Boolean).join(' | ')

    let report = '================================================================\n'
    report += 'PENETRATION TEST REPORT\n'
    report += '================================================================\n'
    report += 'Engagement:   ' + (engagementName || 'Security Assessment') + '\n'
    report += 'Client:       ' + (clientName || 'Confidential') + '\n'
    report += 'Tester:       ' + (testerName || 'ShanGhost Admin') + '\n'
    report += 'Date:         ' + date + '\n'
    report += 'Methodology:  ' + methodology + '\n'
    report += 'Scope:        ' + (scope || 'See engagement letter') + '\n'
    report += 'Risk Summary: ' + (riskSummary || 'No findings recorded') + '\n'
    report += '================================================================\n\n'

    report += 'EXECUTIVE SUMMARY\n'
    report += '----------------\n'
    report += (executiveSummary || '[Executive summary not yet generated. Click "AI: Generate Summary" above.]') + '\n\n'

    report += '================================================================\n'
    report += 'TECHNICAL FINDINGS\n'
    report += '================================================================\n\n'

    if (sorted.filter(f => f.title.trim()).length === 0) {
      report += '[No findings recorded.]\n'
    } else {
      sorted.filter(f => f.title.trim()).forEach((f, i) => {
        report += '----------------------------------------------------------------\n'
        report += 'FINDING ' + String(i + 1).padStart(3, '0') + '\n'
        report += 'Title:          ' + f.title + '\n'
        report += 'Severity:       ' + f.severity + '\n'
        report += 'CVSS Score:     ' + (f.cvss || 'N/A') + '\n'
        report += 'Affected Asset: ' + (f.asset || 'N/A') + '\n'
        report += '\nDescription:\n' + (f.description || '[Not yet documented.]') + '\n'
        report += '\nImpact:\n' + (f.impact || '[Not yet documented.]') + '\n'
        report += '\nRemediation:\n' + (f.recommendation || '[Not yet documented.]') + '\n\n'
      })
    }

    report += '================================================================\n'
    report += 'END OF REPORT\n'
    report += 'Generated by GHOSTNET Report Generator\n'
    report += '================================================================\n'

    setOutput(report)
  }

  const copyReport = () => {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#5a7a5a' }}>
        <Link href="/" style={{ color: '#5a7a5a', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>›</span>
        <span style={{ color: accent }}>REPORT GENERATOR</span>
      </div>

      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#3a6a3a', letterSpacing: '0.25em', marginBottom: '0.5rem' }}>TOOL · AI-POWERED</div>
        <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.8rem', fontWeight: 700, color: accent, margin: '0.5rem 0', lineHeight: 1.1, textShadow: '0 0 20px rgba(0,255,65,0.3)' }}>
          PENTEST REPORT GENERATOR
        </h1>
        <p style={{ color: '#5a7a5a', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', lineHeight: 1.6 }}>
          Fill in engagement details and findings · Use AI to draft descriptions · Export formatted report
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>

        {/* LEFT COLUMN — form */}
        <div>

          {/* ENGAGEMENT DETAILS */}
          <div style={{ background: '#0a130a', border: '1px solid #1a2e1e', borderRadius: '6px', padding: '1.25rem', marginBottom: '1.5rem' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: accent, letterSpacing: '0.2em', marginBottom: '1rem' }}>ENGAGEMENT DETAILS</div>

            <div style={{ marginBottom: '12px' }}>
              <Label>ENGAGEMENT NAME</Label>
              <Input value={engagementName} onChange={setEngagementName} placeholder="External Pentest — Q2 2026" />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <Label>CLIENT NAME</Label>
              <Input value={clientName} onChange={setClientName} placeholder="Acme Corp" />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <Label>TESTER NAME</Label>
              <Input value={testerName} onChange={setTesterName} placeholder="ShanGhost Admin" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <Label>TEST DATE</Label>
                <Input value={testDate} onChange={setTestDate} placeholder="2026-04-01" />
              </div>
              <div>
                <Label>METHODOLOGY</Label>
                <Select value={methodology} onChange={setMethodology} options={['Black Box', 'Grey Box', 'White Box', 'Red Team', 'Web App Only', 'Internal Network']} />
              </div>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <Label>SCOPE</Label>
              <Input value={scope} onChange={setScope} placeholder="192.168.0.0/24, *.example.com" />
            </div>
          </div>

          {/* EXECUTIVE SUMMARY */}
          <div style={{ background: '#0a130a', border: '1px solid #1a2e1e', borderRadius: '6px', padding: '1.25rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: accent, letterSpacing: '0.2em' }}>EXECUTIVE SUMMARY</div>
              <button
                onClick={generateSummary}
                disabled={loading}
                style={{ background: accentDim, border: '1px solid ' + accentBorder, borderRadius: '3px', padding: '4px 10px', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', color: accent, letterSpacing: '0.1em', opacity: loading ? 0.5 : 1 }}
              >
                {loading && aiSection === 'summary' ? '⟳ GENERATING...' : 'AI: GENERATE SUMMARY'}
              </button>
            </div>
            <Textarea value={executiveSummary} onChange={setExecutiveSummary} placeholder="Write or AI-generate an executive summary..." rows={5} />
          </div>

          {/* AI ERROR BANNER */}
          {aiError && (
            <div style={{ background: 'rgba(255,65,54,0.06)', border: '1px solid rgba(255,65,54,0.3)', borderRadius: '4px', padding: '10px 14px', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#ff4136' }}>AI Error: {aiError}</span>
              <button onClick={() => setAiError('')} style={{ background: 'none', border: 'none', color: '#ff4136', cursor: 'pointer', fontSize: '14px', padding: '0 4px' }}>✕</button>
            </div>
          )}

          {/* FINDINGS */}
          <div style={{ background: '#0a130a', border: '1px solid #1a2e1e', borderRadius: '6px', padding: '1.25rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: accent, letterSpacing: '0.2em' }}>FINDINGS ({findings.length})</div>
              <button
                onClick={addFinding}
                style={{ background: accentDim, border: '1px solid ' + accentBorder, borderRadius: '3px', padding: '4px 10px', cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', color: accent, letterSpacing: '0.1em' }}
              >
                + ADD FINDING
              </button>
            </div>

            {findings.map((f, idx) => (
              <div key={f.id} style={{ background: '#050805', border: '1px solid #1a2e1e', borderRadius: '4px', padding: '1rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: SEVERITY_COLORS[f.severity] || '#5a7a5a', letterSpacing: '0.15em' }}>
                    FINDING {String(idx + 1).padStart(3, '0')}
                  </div>
                  {findings.length > 1 && (
                    <button onClick={() => removeFinding(f.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3a2020', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem' }}>✕</button>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                  <div>
                    <Label>TITLE</Label>
                    <Input value={f.title} onChange={v => updateFinding(f.id, 'title', v)} placeholder="SQL Injection in login form" />
                  </div>
                  <div>
                    <Label>SEVERITY</Label>
                    <Select value={f.severity} onChange={v => updateFinding(f.id, 'severity', v)} options={['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO']} />
                  </div>
                  <div>
                    <Label>CVSS</Label>
                    <Input value={f.cvss} onChange={v => updateFinding(f.id, 'cvss', v)} placeholder="9.8" />
                  </div>
                </div>

                <div style={{ marginBottom: '8px' }}>
                  <Label>AFFECTED ASSET</Label>
                  <Input value={f.asset} onChange={v => updateFinding(f.id, 'asset', v)} placeholder="192.168.1.10:80 /login.php" />
                </div>

                <div style={{ marginBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <Label>DESCRIPTION</Label>
                    <button
                      onClick={() => generateFindingDesc(f)}
                      disabled={loading}
                      style={{ background: 'transparent', border: '1px solid #1a2e1e', borderRadius: '3px', padding: '2px 7px', cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: '#3a6a3a', letterSpacing: '0.1em', opacity: loading && aiTarget === f.id ? 0.5 : 1 }}
                    >
                      {loading && aiTarget === f.id && aiSection === 'finding' ? '⟳ WRITING...' : 'AI DRAFT'}
                    </button>
                  </div>
                  <Textarea value={f.description} onChange={v => updateFinding(f.id, 'description', v)} placeholder="Describe the vulnerability, how it was found, and reproduction steps..." rows={3} />
                </div>

                <div style={{ marginBottom: '8px' }}>
                  <Label>IMPACT</Label>
                  <Textarea value={f.impact} onChange={v => updateFinding(f.id, 'impact', v)} placeholder="What can an attacker achieve by exploiting this?" rows={2} />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <Label>RECOMMENDATION</Label>
                    <button
                      onClick={() => generateRecommendation(f)}
                      disabled={loading}
                      style={{ background: 'transparent', border: '1px solid #1a2e1e', borderRadius: '3px', padding: '2px 7px', cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: '#3a6a3a', letterSpacing: '0.1em', opacity: loading ? 0.5 : 1 }}
                    >
                      {loading && aiTarget === f.id && aiSection === 'finding' ? '⟳ WRITING...' : 'AI DRAFT'}
                    </button>
                  </div>
                  <Textarea value={f.recommendation} onChange={v => updateFinding(f.id, 'recommendation', v)} placeholder="How should this be fixed? Immediate and long-term steps." rows={2} />
                </div>
              </div>
            ))}
          </div>

          {/* Generate button */}
          <button
            onClick={buildReport}
            style={{ width: '100%', background: accentDim, border: '1px solid ' + accentBorder, borderRadius: '4px', padding: '12px', cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', color: accent, letterSpacing: '0.15em', fontWeight: 700 }}
          >
            GENERATE REPORT
          </button>
        </div>

        {/* RIGHT COLUMN — output */}
        <div style={{ position: 'sticky', top: '70px', alignSelf: 'start' }}>
          <div style={{ background: '#0a130a', border: '1px solid #1a2e1e', borderRadius: '6px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderBottom: '1px solid #1a2e1e', background: accentDim }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: accent, letterSpacing: '0.2em' }}>REPORT OUTPUT</div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={buildReport}
                  style={{ background: 'transparent', border: '1px solid #1a2e1e', borderRadius: '3px', padding: '3px 8px', cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: '#3a6a3a', letterSpacing: '0.1em' }}
                >
                  REFRESH
                </button>
                {output && (
                  <button
                    onClick={copyReport}
                    style={{ background: copied ? accentDim : 'transparent', border: '1px solid ' + (copied ? accentBorder : '#1a2e1e'), borderRadius: '3px', padding: '3px 8px', cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: copied ? accent : '#3a6a3a', letterSpacing: '0.1em' }}
                  >
                    {copied ? 'COPIED!' : 'COPY'}
                  </button>
                )}
              </div>
            </div>

            {output ? (
              <pre style={{ background: '#050805', padding: '1.25rem', overflow: 'auto', color: '#8a9a8a', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', lineHeight: 1.7, whiteSpace: 'pre-wrap' as const, maxHeight: '80vh', margin: 0 }}>
                {output}
              </pre>
            ) : (
              <div style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#2a4a2a', lineHeight: 1.8 }}>
                  <div style={{ fontSize: '2rem', marginBottom: '1rem', opacity: 0.3 }}>▤</div>
                  Fill in engagement details<br />
                  Add findings on the left<br />
                  Use AI to draft descriptions<br />
                  Click GENERATE REPORT<br />
                  <br />
                  <span style={{ color: accent, opacity: 0.5 }}>→ formatted report appears here</span>
                </div>
              </div>
            )}
          </div>

          {/* Risk summary */}
          {findings.some(f => f.title.trim()) && (
            <div style={{ background: '#0a130a', border: '1px solid #1a2e1e', borderRadius: '6px', padding: '1rem', marginTop: '1rem' }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#3a6a3a', letterSpacing: '0.2em', marginBottom: '10px' }}>RISK SUMMARY</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' as const }}>
                {['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'].map(sev => {
                  const count = findings.filter(f => f.severity === sev && f.title.trim()).length
                  if (count === 0) return null
                  return (
                    <div key={sev} style={{ background: SEVERITY_COLORS[sev] + '15', border: '1px solid ' + SEVERITY_COLORS[sev] + '44', borderRadius: '3px', padding: '4px 10px', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: SEVERITY_COLORS[sev] }}>
                      {sev}: {count}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Tips */}
          <div style={{ background: '#0a130a', border: '1px solid #1a2e1e', borderRadius: '6px', padding: '1rem', marginTop: '1rem' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#3a6a3a', letterSpacing: '0.2em', marginBottom: '8px' }}>USAGE TIPS</div>
            {[
              'Use "AI: Generate Summary" after adding all findings for the most accurate summary',
              'AI Draft buttons on each finding write description and recommendation from the title + severity',
              'CVSS scores: 9.0-10.0 = Critical, 7.0-8.9 = High, 4.0-6.9 = Medium, 0.1-3.9 = Low',
              'Copy the output and paste into Word / Google Docs for final formatting',
            ].map((tip, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', padding: '4px 0', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.68rem', color: '#3a5a3a', lineHeight: 1.6, borderBottom: '1px solid #0e1a10' }}>
                <span style={{ color: accent, flexShrink: 0 }}>›</span>
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #1a2e1e', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5a7a5a' }}>← DASHBOARD</Link>
        <Link href="/attack-path" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: accent, padding: '8px 20px', border: '1px solid ' + accentBorder, borderRadius: '4px', background: accentDim }}>
          ATTACK PATH VISUALIZER →
        </Link>
      </div>
    </div>
  )
}
