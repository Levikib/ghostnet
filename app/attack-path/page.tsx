'use client'

import { useState, useRef, useEffect } from 'react'

const accent = '#00ff41'
const accentDim = 'rgba(0,255,65,0.08)'
const accentBorder = 'rgba(0,255,65,0.3)'

const PHASE_COLORS: Record<string, string> = {
  'Recon':               '#00d4ff',
  'Initial Access':      '#ffb347',
  'Execution':           '#bf5fff',
  'Persistence':         '#ff4136',
  'Privilege Escalation':'#ff6ec7',
  'Lateral Movement':    '#aaff00',
  'Collection':          '#7c4dff',
  'Exfiltration':        '#ff9500',
  'Impact':              '#ff3333',
}

const PHASE_IDS: Record<string, string> = {
  'Recon':               'TA0043',
  'Initial Access':      'TA0001',
  'Execution':           'TA0002',
  'Persistence':         'TA0003',
  'Privilege Escalation':'TA0004',
  'Lateral Movement':    'TA0008',
  'Collection':          'TA0009',
  'Exfiltration':        'TA0010',
  'Impact':              'TA0040',
}

const TECHNIQUES: Record<string, { id: string; name: string; description: string }[]> = {
  'Recon': [
    { id: 'T1595', name: 'Active Scanning', description: 'Port scanning, vulnerability scanning, fingerprinting of target services.' },
    { id: 'T1592', name: 'Gather Victim Host Info', description: 'Collect OS, hardware, software, firmware details about target hosts.' },
    { id: 'T1589', name: 'Gather Victim Identity Info', description: 'Employee names, emails, credentials from public sources (LinkedIn, OSINT).' },
    { id: 'T1590', name: 'Gather Victim Network Info', description: 'IP ranges, domain names, network topology, DNS records.' },
    { id: 'T1596', name: 'Search Open Technical Databases', description: 'Shodan, Censys, WHOIS, DNS databases, certificate transparency logs.' },
  ],
  'Initial Access': [
    { id: 'T1566', name: 'Phishing', description: 'Spearphishing emails or links to deliver malicious payloads or harvest credentials.' },
    { id: 'T1190', name: 'Exploit Public-Facing Application', description: 'Exploit vulnerabilities in internet-facing apps (web, VPN, RDP).' },
    { id: 'T1133', name: 'External Remote Services', description: 'Abuse VPN, RDP, Citrix, or other remote access with valid credentials.' },
    { id: 'T1078', name: 'Valid Accounts', description: 'Use stolen/default credentials to log into systems legitimately.' },
    { id: 'T1091', name: 'Replication Through Removable Media', description: 'Spread via USB drives and other physical media left in target environment.' },
  ],
  'Execution': [
    { id: 'T1059', name: 'Command and Scripting Interpreter', description: 'Execute commands via cmd.exe, PowerShell, bash, Python, etc.' },
    { id: 'T1204', name: 'User Execution', description: 'Trick user into running malicious file (macro, JS, executable).' },
    { id: 'T1053', name: 'Scheduled Task/Job', description: 'Create cron jobs or Windows Scheduled Tasks to execute code.' },
    { id: 'T1569', name: 'System Services', description: 'Execute via Windows services or Unix init scripts.' },
    { id: 'T1072', name: 'Software Deployment Tools', description: 'Abuse SCCM, Ansible, or other management tools to run code.' },
  ],
  'Persistence': [
    { id: 'T1547', name: 'Boot or Logon Autostart', description: 'Registry run keys, startup folders, init scripts for persistence.' },
    { id: 'T1543', name: 'Create or Modify System Process', description: 'Install malicious services or daemons that start automatically.' },
    { id: 'T1136', name: 'Create Account', description: 'Add local or domain accounts to maintain access.' },
    { id: 'T1505', name: 'Server Software Component', description: 'Install web shells, IIS modules, or SQL procedures for backdoor.' },
    { id: 'T1546', name: 'Event Triggered Execution', description: 'Hijack system events (screensaver, COM objects, AppInit DLLs).' },
  ],
  'Privilege Escalation': [
    { id: 'T1068', name: 'Exploitation for Privilege Escalation', description: 'Exploit kernel bugs, SUID binaries, or service vulnerabilities for root/SYSTEM.' },
    { id: 'T1548', name: 'Abuse Elevation Control Mechanism', description: 'Bypass UAC, sudo misconfigs, or setuid/setgid to elevate.' },
    { id: 'T1134', name: 'Access Token Manipulation', description: 'Impersonate or duplicate tokens to run as higher-privileged user (Windows).' },
    { id: 'T1611', name: 'Escape to Host', description: 'Break out of containers (Docker escape) to compromise the host.' },
    { id: 'T1484', name: 'Domain Policy Modification', description: 'Modify GPOs to gain domain-level privileges.' },
  ],
  'Lateral Movement': [
    { id: 'T1021', name: 'Remote Services', description: 'Move via RDP, SSH, SMB, WinRM, VNC to other hosts.' },
    { id: 'T1550', name: 'Use Alternate Authentication Material', description: 'Pass-the-Hash, Pass-the-Ticket, Golden Ticket attacks.' },
    { id: 'T1534', name: 'Internal Spearphishing', description: 'Phish internal users from a compromised account.' },
    { id: 'T1570', name: 'Lateral Tool Transfer', description: 'Copy tools (Mimikatz, impacket) to new hosts via SMB or RDP.' },
    { id: 'T1563', name: 'Remote Service Session Hijacking', description: 'Hijack existing RDP or SSH sessions.' },
  ],
  'Collection': [
    { id: 'T1005', name: 'Data from Local System', description: 'Collect files, databases, credentials from compromised hosts.' },
    { id: 'T1039', name: 'Data from Network Shared Drive', description: 'Access and stage data from file shares.' },
    { id: 'T1113', name: 'Screen Capture', description: 'Take screenshots to spy on user activity.' },
    { id: 'T1056', name: 'Input Capture', description: 'Keyloggers to capture credentials and sensitive input.' },
    { id: 'T1560', name: 'Archive Collected Data', description: 'Compress/encrypt data (zip, 7z) before exfiltration.' },
  ],
  'Exfiltration': [
    { id: 'T1041', name: 'Exfiltration Over C2 Channel', description: 'Send data back over the same channel used for command-and-control.' },
    { id: 'T1048', name: 'Exfiltration Over Alternative Protocol', description: 'Use DNS, ICMP, or SMTP tunneling to bypass DLP.' },
    { id: 'T1567', name: 'Exfiltration Over Web Service', description: 'Upload to Dropbox, Google Drive, Pastebin, GitHub.' },
    { id: 'T1052', name: 'Exfiltration Over Physical Medium', description: 'Copy data to USB drives.' },
    { id: 'T1029', name: 'Scheduled Transfer', description: 'Exfiltrate at specific times to blend with normal traffic.' },
  ],
  'Impact': [
    { id: 'T1486', name: 'Data Encrypted for Impact', description: 'Ransomware — encrypt files and demand payment.' },
    { id: 'T1490', name: 'Inhibit System Recovery', description: 'Delete shadow copies, disable backups to prevent recovery.' },
    { id: 'T1485', name: 'Data Destruction', description: 'Wipe disks, delete databases, destroy configs.' },
    { id: 'T1489', name: 'Service Stop', description: 'Stop critical services (AD, databases, backups) to cause outage.' },
    { id: 'T1491', name: 'Defacement', description: 'Modify websites or internal systems for visibility or disruption.' },
  ],
}

interface Step {
  id: string
  phase: string
  techniqueId: string
  techniqueName: string
  notes: string
  asset: string
}

const PHASES = Object.keys(PHASE_COLORS)

let stepCounter = 0
const newStep = (phase: string): Step => {
  const t = TECHNIQUES[phase]?.[0]
  return {
    id: 'step-' + (++stepCounter),
    phase,
    techniqueId: t?.id || '',
    techniqueName: t?.name || '',
    notes: '',
    asset: '',
  }
}

const PRESET_PATHS: { name: string; steps: Omit<Step, 'id'>[] }[] = [
  {
    name: 'Classic External Pentest',
    steps: [
      { phase: 'Recon', techniqueId: 'T1596', techniqueName: 'Search Open Technical Databases', notes: 'Shodan + Censys scan of external IP range', asset: 'External IPs' },
      { phase: 'Recon', techniqueId: 'T1595', techniqueName: 'Active Scanning', notes: 'Nmap full port scan, service fingerprinting', asset: 'Target subnet' },
      { phase: 'Initial Access', techniqueId: 'T1190', techniqueName: 'Exploit Public-Facing Application', notes: 'SQL injection on login form → RCE via INTO OUTFILE', asset: 'web01.corp.local' },
      { phase: 'Execution', techniqueId: 'T1059', techniqueName: 'Command and Scripting Interpreter', notes: 'Bash reverse shell via web RCE', asset: 'web01.corp.local' },
      { phase: 'Persistence', techniqueId: 'T1505', techniqueName: 'Server Software Component', notes: 'Dropped PHP web shell at /var/www/html/.cache/up.php', asset: 'web01.corp.local' },
      { phase: 'Privilege Escalation', techniqueId: 'T1068', techniqueName: 'Exploitation for Privilege Escalation', notes: 'Dirty COW (CVE-2016-5195) → root', asset: 'web01.corp.local' },
      { phase: 'Lateral Movement', techniqueId: 'T1021', techniqueName: 'Remote Services', notes: 'SSH key found in /root/.ssh/id_rsa → pivot to db01', asset: 'db01.corp.local' },
      { phase: 'Collection', techniqueId: 'T1005', techniqueName: 'Data from Local System', notes: 'Dumped MySQL database containing 50k customer records', asset: 'db01.corp.local' },
      { phase: 'Exfiltration', techniqueId: 'T1048', techniqueName: 'Exfiltration Over Alternative Protocol', notes: 'DNS tunneling via iodine to exfil database dump', asset: 'Attacker C2' },
    ],
  },
  {
    name: 'Phishing → Domain Compromise',
    steps: [
      { phase: 'Recon', techniqueId: 'T1589', techniqueName: 'Gather Victim Identity Info', notes: 'LinkedIn scrape, theHarvester for emails', asset: 'target.com' },
      { phase: 'Initial Access', techniqueId: 'T1566', techniqueName: 'Phishing', notes: 'Spearphish to finance team with malicious Excel macro', asset: 'finance-user@target.com' },
      { phase: 'Execution', techniqueId: 'T1204', techniqueName: 'User Execution', notes: 'User enabled macros → Cobalt Strike beacon dropped', asset: 'WKST-FIN01' },
      { phase: 'Persistence', techniqueId: 'T1547', techniqueName: 'Boot or Logon Autostart', notes: 'Registry run key: HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run', asset: 'WKST-FIN01' },
      { phase: 'Privilege Escalation', techniqueId: 'T1548', techniqueName: 'Abuse Elevation Control Mechanism', notes: 'UAC bypass via fodhelper.exe → local admin', asset: 'WKST-FIN01' },
      { phase: 'Lateral Movement', techniqueId: 'T1550', techniqueName: 'Use Alternate Authentication Material', notes: 'Mimikatz lsadump → Pass-the-Hash to DC01', asset: 'DC01.target.local' },
      { phase: 'Collection', techniqueId: 'T1039', techniqueName: 'Data from Network Shared Drive', notes: 'Accessed \\\\file01\\hr share, staged sensitive docs', asset: 'FILE01.target.local' },
      { phase: 'Exfiltration', techniqueId: 'T1567', techniqueName: 'Exfiltration Over Web Service', notes: 'Uploaded staged archive to attacker-controlled Dropbox', asset: 'Attacker Dropbox' },
    ],
  },
]

export default function AttackPathPage() {
  const [steps, setSteps] = useState<Step[]>([newStep('Recon')])
  const [expandedStep, setExpandedStep] = useState<string | null>(steps[0].id)
  const [pathName, setPathName] = useState('Untitled Attack Path')
  const [loadingAI, setLoadingAI] = useState(false)
  const [aiNarrative, setAiNarrative] = useState('')
  const [showNarrative, setShowNarrative] = useState(false)
  const [copied, setCopied] = useState(false)
  const [narrativeCopied, setNarrativeCopied] = useState(false)
  const narrativeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (showNarrative && narrativeRef.current) {
      narrativeRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [showNarrative, aiNarrative])

  const addStep = (phase: string) => {
    const s = newStep(phase)
    setSteps(prev => [...prev, s])
    setExpandedStep(s.id)
  }

  const removeStep = (id: string) => {
    setSteps(prev => prev.filter(s => s.id !== id))
    setExpandedStep(null)
  }

  const updateStep = (id: string, field: keyof Step, value: string) => {
    setSteps(prev => prev.map(s => {
      if (s.id !== id) return s
      if (field === 'techniqueName') {
        const t = TECHNIQUES[s.phase]?.find(t => t.name === value)
        return { ...s, techniqueName: value, techniqueId: t?.id || '' }
      }
      return { ...s, [field]: value }
    }))
  }

  const loadPreset = (preset: typeof PRESET_PATHS[0]) => {
    const loaded = preset.steps.map(s => ({ ...s, id: 'step-' + (++stepCounter) }))
    setSteps(loaded)
    setPathName(preset.name)
    setExpandedStep(loaded[0].id)
    setAiNarrative('')
    setShowNarrative(false)
  }

  const moveStep = (id: string, dir: -1 | 1) => {
    setSteps(prev => {
      const idx = prev.findIndex(s => s.id === id)
      if (idx < 0) return prev
      const next = idx + dir
      if (next < 0 || next >= prev.length) return prev
      const arr = [...prev]
      ;[arr[idx], arr[next]] = [arr[next], arr[idx]]
      return arr
    })
  }

  const generateNarrative = async () => {
    if (steps.length === 0 || loadingAI) return
    setLoadingAI(true)
    setShowNarrative(true)
    setAiNarrative('')
    const summary = steps.map((s, i) =>
      (i + 1) + '. [' + s.phase + '] ' + s.techniqueId + ' — ' + s.techniqueName +
      (s.asset ? ' on ' + s.asset : '') +
      (s.notes ? ' — ' + s.notes : '')
    ).join('\n')
    try {
      const res = await fetch('/api/ghost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt: 'You are a senior red team operator writing attack path narratives for penetration test reports. Given a numbered sequence of MITRE ATT&CK techniques with target assets and notes, write a clear, technically accurate, third-person prose narrative describing the full attack chain. Write one paragraph per step. For each step explain: what the attacker did, the specific technique used, why it succeeded (what misconfiguration or weakness enabled it), and what defensive control failed or was absent. Use precise security terminology. Do not use bullet points — write flowing paragraphs. Be thorough but concise.',
          messages: [{ role: 'user', content: 'Write an attack narrative for a pentest report. Path title: "' + pathName + '"\n\nSteps:\n' + summary }],
        }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setAiNarrative(data.text || 'No response received.')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      setAiNarrative('Error: ' + msg)
    } finally {
      setLoadingAI(false)
    }
  }

  const exportPath = () => {
    const lines = [
      '# ' + pathName,
      '# Generated by GHOSTNET Attack Path Visualizer',
      '# ' + new Date().toISOString(),
      '',
      ...steps.map((s, i) =>
        'Step ' + (i + 1) + ': [' + s.phase + '] ' + s.techniqueId + ' — ' + s.techniqueName + '\n' +
        'Asset: ' + (s.asset || 'N/A') + '\n' +
        'Notes: ' + (s.notes || 'N/A')
      ),
      '',
      aiNarrative ? '## AI Narrative\n' + aiNarrative : '',
    ].join('\n')
    navigator.clipboard.writeText(lines).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const phaseCounts = PHASES.reduce<Record<string, number>>((acc, p) => {
    acc[p] = steps.filter(s => s.phase === p).length
    return acc
  }, {})

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#e0e0e0', fontFamily: 'JetBrains Mono, monospace', padding: '32px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <span style={{ color: accent, fontSize: '20px' }}>⚔</span>
          <span style={{ color: '#555', fontSize: '12px' }}>TOOL-07</span>
          <span style={{ color: '#333' }}>|</span>
          <span style={{ color: '#555', fontSize: '12px' }}>MITRE ATT&CK</span>
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: accent, margin: 0, letterSpacing: '2px' }}>
          ATTACK PATH VISUALIZER
        </h1>
        <p style={{ color: '#888', fontSize: '13px', marginTop: '6px' }}>
          Build attack chains using MITRE ATT&CK techniques. Visualize kill chains, generate narratives for reports.
        </p>
        <div style={{ marginTop: '12px', background: 'rgba(0,255,65,0.05)', border: '1px solid rgba(0,255,65,0.15)', borderRadius: '4px', padding: '10px 14px' }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: accent, letterSpacing: '0.1em', marginRight: '8px' }}>HOW TO USE</span>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: '#666', lineHeight: 1.6 }}>
            MITRE ATT&CK is the industry-standard framework for describing how attackers operate — each technique has a unique ID (e.g. T1566 = Phishing). Use this tool to map out what happened during a pentest or red team engagement. <strong style={{ color: '#aaa' }}>Load a preset</strong> to see an example, or <strong style={{ color: '#aaa' }}>click a phase button</strong> at the bottom to add steps. Fill in the target asset and notes for each step, then click <strong style={{ color: '#aaa' }}>✦ AI NARRATIVE</strong> to generate a professional report-ready description of the full attack chain. Use EXPORT to copy everything to your clipboard.
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'start' }}>
        {/* Left — Builder */}
        <div>
          {/* Path name + presets */}
          <div style={{ background: '#111', border: '1px solid #222', borderRadius: '6px', padding: '20px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
              <input
                value={pathName}
                onChange={e => setPathName(e.target.value)}
                style={{ flex: 1, minWidth: '200px', background: '#0a0a0a', border: '1px solid #333', borderRadius: '4px', color: accent, padding: '8px 12px', fontFamily: 'JetBrains Mono, monospace', fontSize: '14px', fontWeight: 700 }}
                placeholder="Attack path name..."
              />
              <button onClick={exportPath} style={{ background: copied ? 'rgba(0,255,65,0.2)' : '#1a1a1a', border: '1px solid ' + accentBorder, color: accent, padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', whiteSpace: 'nowrap' }}>
                {copied ? '✓ COPIED' : '⎘ EXPORT'}
              </button>
              <button onClick={generateNarrative} disabled={loadingAI} style={{ background: loadingAI ? '#1a1a1a' : accentDim, border: '1px solid ' + accentBorder, color: accent, padding: '8px 16px', borderRadius: '4px', cursor: loadingAI ? 'not-allowed' : 'pointer', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', whiteSpace: 'nowrap', opacity: loadingAI ? 0.6 : 1 }}>
                {loadingAI ? '⟳ GENERATING...' : '✦ AI NARRATIVE'}
              </button>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ color: '#555', fontSize: '11px', alignSelf: 'center' }}>PRESETS:</span>
              {PRESET_PATHS.map(p => (
                <button key={p.name} onClick={() => loadPreset(p)} style={{ background: '#0a0a0a', border: '1px solid #333', color: '#aaa', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px' }}>
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
            {steps.map((step, idx) => {
              const color = PHASE_COLORS[step.phase] || accent
              const isOpen = expandedStep === step.id
              const techniques = TECHNIQUES[step.phase] || []
              const selectedTech = techniques.find(t => t.name === step.techniqueName)

              return (
                <div key={step.id} style={{ background: '#111', border: '1px solid ' + (isOpen ? color + '44' : '#1e1e1e'), borderRadius: '6px', overflow: 'hidden', transition: 'border-color 0.2s' }}>
                  {/* Step header */}
                  <div
                    onClick={() => setExpandedStep(isOpen ? null : step.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', cursor: 'pointer', background: isOpen ? 'rgba(255,255,255,0.02)' : 'transparent' }}
                  >
                    <span style={{ color: '#444', fontSize: '11px', minWidth: '20px' }}>{String(idx + 1).padStart(2, '0')}</span>
                    <span style={{ background: color + '22', color: color, padding: '2px 8px', borderRadius: '3px', fontSize: '10px', fontWeight: 700, whiteSpace: 'nowrap' }}>
                      {step.phase.toUpperCase()}
                    </span>
                    <span style={{ color: color, fontSize: '11px', fontWeight: 700, minWidth: '60px' }}>{step.techniqueId}</span>
                    <span style={{ color: '#ccc', fontSize: '12px', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{step.techniqueName}</span>
                    {step.asset && <span style={{ color: '#555', fontSize: '11px', whiteSpace: 'nowrap' }}>→ {step.asset}</span>}
                    <span style={{ color: '#444', fontSize: '10px' }}>{isOpen ? '▲' : '▼'}</span>
                  </div>

                  {isOpen && (
                    <div style={{ padding: '0 16px 16px', borderTop: '1px solid #1e1e1e' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
                        <div>
                          <label style={{ color: '#555', fontSize: '10px', display: 'block', marginBottom: '4px' }}>PHASE</label>
                          <select
                            value={step.phase}
                            onChange={e => updateStep(step.id, 'phase', e.target.value)}
                            style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', borderRadius: '4px', color: color, padding: '6px 8px', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px' }}
                          >
                            {PHASES.map(p => <option key={p} value={p}>{p}</option>)}
                          </select>
                        </div>
                        <div>
                          <label style={{ color: '#555', fontSize: '10px', display: 'block', marginBottom: '4px' }}>TECHNIQUE</label>
                          <select
                            value={step.techniqueName}
                            onChange={e => updateStep(step.id, 'techniqueName', e.target.value)}
                            style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', borderRadius: '4px', color: '#ccc', padding: '6px 8px', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px' }}
                          >
                            {techniques.map(t => <option key={t.id} value={t.name}>{t.id} — {t.name}</option>)}
                          </select>
                        </div>
                        <div>
                          <label style={{ color: '#555', fontSize: '10px', display: 'block', marginBottom: '4px' }}>TARGET ASSET</label>
                          <input
                            value={step.asset}
                            onChange={e => updateStep(step.id, 'asset', e.target.value)}
                            placeholder="e.g. web01.corp.local"
                            style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', borderRadius: '4px', color: '#ccc', padding: '6px 8px', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', boxSizing: 'border-box' }}
                          />
                        </div>
                        <div>
                          <label style={{ color: '#555', fontSize: '10px', display: 'block', marginBottom: '4px' }}>TECHNIQUE ID</label>
                          <div style={{ background: '#0a0a0a', border: '1px solid #222', borderRadius: '4px', color: color, padding: '6px 8px', fontSize: '12px' }}>
                            {step.techniqueId || '—'}
                          </div>
                        </div>
                      </div>

                      {selectedTech && (
                        <div style={{ marginTop: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid #1e1e1e', borderRadius: '4px', padding: '8px 12px' }}>
                          <p style={{ color: '#666', fontSize: '11px', margin: 0 }}>{selectedTech.description}</p>
                        </div>
                      )}

                      <div style={{ marginTop: '12px' }}>
                        <label style={{ color: '#555', fontSize: '10px', display: 'block', marginBottom: '4px' }}>NOTES / EVIDENCE</label>
                        <textarea
                          value={step.notes}
                          onChange={e => updateStep(step.id, 'notes', e.target.value)}
                          placeholder="What happened? How did it work? What tool / CVE / payload?"
                          rows={2}
                          style={{ width: '100%', background: '#0a0a0a', border: '1px solid #333', borderRadius: '4px', color: '#ccc', padding: '8px', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', resize: 'vertical', boxSizing: 'border-box' }}
                        />
                      </div>

                      <div style={{ display: 'flex', gap: '8px', marginTop: '10px', justifyContent: 'flex-end' }}>
                        <button onClick={() => moveStep(step.id, -1)} disabled={idx === 0} style={{ background: '#0a0a0a', border: '1px solid #222', color: '#555', padding: '4px 10px', borderRadius: '4px', cursor: idx === 0 ? 'not-allowed' : 'pointer', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', opacity: idx === 0 ? 0.4 : 1 }}>↑</button>
                        <button onClick={() => moveStep(step.id, 1)} disabled={idx === steps.length - 1} style={{ background: '#0a0a0a', border: '1px solid #222', color: '#555', padding: '4px 10px', borderRadius: '4px', cursor: idx === steps.length - 1 ? 'not-allowed' : 'pointer', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', opacity: idx === steps.length - 1 ? 0.4 : 1 }}>↓</button>
                        <button onClick={() => removeStep(step.id)} style={{ background: '#0a0a0a', border: '1px solid #ff413644', color: '#ff4136', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px' }}>REMOVE</button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Add step buttons */}
          <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '6px', padding: '16px' }}>
            <p style={{ color: '#555', fontSize: '11px', marginBottom: '12px' }}>ADD STEP BY PHASE:</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {PHASES.map(p => (
                <button
                  key={p}
                  onClick={() => addStep(p)}
                  style={{ background: PHASE_COLORS[p] + '18', border: '1px solid ' + PHASE_COLORS[p] + '44', color: PHASE_COLORS[p], padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', fontWeight: 700 }}
                >
                  + {p}
                </button>
              ))}
            </div>
          </div>

          {/* AI Narrative */}
          {showNarrative && (
            <div ref={narrativeRef} style={{ marginTop: '20px', background: '#111', border: '1px solid ' + accentBorder, borderRadius: '6px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ color: accent, fontSize: '12px', fontWeight: 700 }}>✦ AI ATTACK NARRATIVE</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {aiNarrative && !loadingAI && (
                    <button
                      onClick={() => { navigator.clipboard.writeText(aiNarrative).then(() => { setNarrativeCopied(true); setTimeout(() => setNarrativeCopied(false), 2000) }) }}
                      style={{ background: narrativeCopied ? 'rgba(0,255,65,0.2)' : '#1a1a1a', border: '1px solid ' + accentBorder, color: accent, padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', fontSize: '10px' }}
                    >
                      {narrativeCopied ? '✓ COPIED' : '⎘ COPY'}
                    </button>
                  )}
                  <button onClick={() => { setShowNarrative(false); setAiNarrative('') }} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '14px', padding: '0 4px' }}>✕</button>
                </div>
              </div>
              {loadingAI ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: accent, animation: 'pulse 1.2s ease-in-out infinite' }} />
                  <span style={{ color: '#555', fontSize: '12px' }}>Generating narrative...</span>
                  <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
                </div>
              ) : (
                <p style={{ color: '#ccc', fontSize: '13px', lineHeight: '1.8', margin: 0, whiteSpace: 'pre-wrap' }}>{aiNarrative}</p>
              )}
            </div>
          )}
        </div>

        {/* Right — Visual timeline */}
        <div style={{ position: 'sticky', top: '24px' }}>
          {/* Phase coverage */}
          <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '6px', padding: '20px', marginBottom: '16px' }}>
            <p style={{ color: '#555', fontSize: '11px', marginBottom: '16px' }}>PHASE COVERAGE</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {PHASES.map(p => {
                const count = phaseCounts[p] || 0
                const color = PHASE_COLORS[p]
                return (
                  <div key={p} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: count > 0 ? color : '#222', flexShrink: 0 }} />
                    <span style={{ color: count > 0 ? color : '#333', fontSize: '11px', flex: 1, transition: 'color 0.2s' }}>{p}</span>
                    <span style={{ color: '#333', fontSize: '10px' }}>{PHASE_IDS[p]}</span>
                    {count > 0 && <span style={{ background: color + '22', color: color, padding: '1px 6px', borderRadius: '10px', fontSize: '10px' }}>{count}</span>}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Kill chain visual */}
          <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '6px', padding: '20px', marginBottom: '16px' }}>
            <p style={{ color: '#555', fontSize: '11px', marginBottom: '16px' }}>KILL CHAIN</p>
            {steps.length === 0 ? (
              <p style={{ color: '#333', fontSize: '12px' }}>No steps added yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {steps.map((step, idx) => {
                  const color = PHASE_COLORS[step.phase] || accent
                  return (
                    <div key={step.id} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: color, marginTop: '3px' }} />
                        {idx < steps.length - 1 && <div style={{ width: '1px', height: '20px', background: '#222', marginTop: '2px' }} />}
                      </div>
                      <div style={{ flex: 1, paddingBottom: idx < steps.length - 1 ? '4px' : 0 }}>
                        <span style={{ color: color, fontSize: '10px', fontWeight: 700 }}>{step.techniqueId}</span>
                        <span style={{ color: '#777', fontSize: '10px' }}> {step.techniqueName}</span>
                        {step.asset && <div style={{ color: '#444', fontSize: '10px' }}>→ {step.asset}</div>}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Stats */}
          <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '6px', padding: '20px' }}>
            <p style={{ color: '#555', fontSize: '11px', marginBottom: '12px' }}>PATH STATS</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ textAlign: 'center', background: '#0a0a0a', borderRadius: '4px', padding: '12px' }}>
                <div style={{ color: accent, fontSize: '24px', fontWeight: 700 }}>{steps.length}</div>
                <div style={{ color: '#555', fontSize: '10px' }}>TOTAL STEPS</div>
              </div>
              <div style={{ textAlign: 'center', background: '#0a0a0a', borderRadius: '4px', padding: '12px' }}>
                <div style={{ color: '#00d4ff', fontSize: '24px', fontWeight: 700 }}>{PHASES.filter(p => phaseCounts[p] > 0).length}</div>
                <div style={{ color: '#555', fontSize: '10px' }}>PHASES USED</div>
              </div>
            </div>
            <div style={{ marginTop: '12px', background: '#0a0a0a', borderRadius: '4px', padding: '10px' }}>
              <div style={{ color: '#555', fontSize: '10px', marginBottom: '6px' }}>TECHNIQUE IDS</div>
              <div style={{ color: '#888', fontSize: '11px', lineHeight: '1.6' }}>
                {steps.length > 0
                  ? steps.map(s => s.techniqueId).filter(Boolean).join(' · ')
                  : '—'
                }
              </div>
            </div>
          </div>

          {/* MITRE link */}
          <div style={{ marginTop: '12px', background: accentDim, border: '1px solid ' + accentBorder, borderRadius: '6px', padding: '12px' }}>
            <p style={{ color: '#555', fontSize: '10px', margin: '0 0 4px' }}>REFERENCE</p>
            <p style={{ color: accent, fontSize: '11px', margin: 0 }}>attack.mitre.org</p>
            <p style={{ color: '#555', fontSize: '10px', margin: '4px 0 0' }}>Browse all techniques by tactic on the MITRE ATT&CK framework website.</p>
          </div>
        </div>
      </div>

      {/* Nav footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '48px', paddingTop: '24px', borderTop: '1px solid #1e1e1e' }}>
        <a href="/report-generator" style={{ color: '#555', fontSize: '12px', textDecoration: 'none' }}>← Report Generator</a>
        <a href="/" style={{ color: '#555', fontSize: '12px', textDecoration: 'none' }}>Dashboard →</a>
      </div>
    </div>
  )
}
