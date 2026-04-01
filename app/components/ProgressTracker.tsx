'use client'
import React, { useState, useEffect } from 'react'

interface Progress {
  completedLabs: string[]
  xp: number
  streak: number
  lastActivity: string
  notes: Record<string, string>
}

const LABS = [
  { id: 'tor-1', module: 'MOD-01', label: 'Tor Installation & Verification', xp: 100 },
  { id: 'tor-2', module: 'MOD-01', label: 'Circuit Analysis with Nyx', xp: 150 },
  { id: 'tor-3', module: 'MOD-01', label: 'Deploy Hidden Service', xp: 200 },
  { id: 'tor-4', module: 'MOD-01', label: 'Opsec Verification', xp: 150 },
  { id: 'tor-5', module: 'MOD-01', label: 'Traffic Analysis', xp: 200 },
  { id: 'osint-1', module: 'MOD-02', label: 'Domain Footprinting', xp: 100 },
  { id: 'osint-2', module: 'MOD-02', label: 'Shodan Recon', xp: 150 },
  { id: 'osint-3', module: 'MOD-02', label: 'Google Dorking', xp: 100 },
  { id: 'osint-4', module: 'MOD-02', label: 'Social Media Intel', xp: 150 },
  { id: 'osint-5', module: 'MOD-02', label: 'Metadata Forensics', xp: 200 },
  { id: 'osint-6', module: 'MOD-02', label: 'Full Target Profile', xp: 300 },
  { id: 'crypto-1', module: 'MOD-03', label: 'Transaction Tracing', xp: 200 },
  { id: 'crypto-2', module: 'MOD-03', label: 'Wallet Forensics', xp: 200 },
  { id: 'crypto-3', module: 'MOD-03', label: 'Smart Contract Vuln Lab', xp: 300 },
  { id: 'crypto-4', module: 'MOD-03', label: 'Flash Loan Lab', xp: 300 },
  { id: 'crypto-5', module: 'MOD-03', label: 'On-Chain Forensics', xp: 250 },
  { id: 'crypto-6', module: 'MOD-03', label: 'Mini Audit Report', xp: 400 },
  { id: 'off-1', module: 'MOD-04', label: 'Nmap Recon', xp: 100 },
  { id: 'off-2', module: 'MOD-04', label: 'Web App Enumeration', xp: 150 },
  { id: 'off-3', module: 'MOD-04', label: 'SQL Injection', xp: 200 },
  { id: 'off-4', module: 'MOD-04', label: 'Password Attacks', xp: 150 },
  { id: 'off-5', module: 'MOD-04', label: 'Metasploit Chain', xp: 300 },
  { id: 'off-6', module: 'MOD-04', label: 'Privilege Escalation + Report', xp: 400 },
  { id: 'ad-1', module: 'MOD-05', label: 'Enumerate AD with BloodHound', xp: 150 },
  { id: 'ad-2', module: 'MOD-05', label: 'Kerberoasting Attack', xp: 200 },
  { id: 'ad-3', module: 'MOD-05', label: 'Pass-the-Hash Lateral Movement', xp: 250 },
  { id: 'ad-4', module: 'MOD-05', label: 'DCSync and Domain Dominance', xp: 300 },
  { id: 'ad-5', module: 'MOD-05', label: 'Golden Ticket Persistence', xp: 350 },
  { id: 'web-1', module: 'MOD-06', label: 'Advanced SQL Injection', xp: 150 },
  { id: 'web-2', module: 'MOD-06', label: 'Stored XSS Chain', xp: 200 },
  { id: 'web-3', module: 'MOD-06', label: 'SSRF to Cloud Creds', xp: 250 },
  { id: 'web-4', module: 'MOD-06', label: 'Deserialization Exploit', xp: 300 },
  { id: 'web-5', module: 'MOD-06', label: 'GraphQL Attack', xp: 200 },
  { id: 'mal-1', module: 'MOD-07', label: 'Static Analysis with Ghidra', xp: 200 },
  { id: 'mal-2', module: 'MOD-07', label: 'Dynamic Sandbox Analysis', xp: 200 },
  { id: 'mal-3', module: 'MOD-07', label: 'Ransomware Anatomy Lab', xp: 300 },
  { id: 'mal-4', module: 'MOD-07', label: 'YARA Rule Writing', xp: 250 },
  { id: 'mal-5', module: 'MOD-07', label: 'Memory Forensics', xp: 300 },
  { id: 'net-1', module: 'MOD-08', label: 'Wireshark Traffic Analysis', xp: 100 },
  { id: 'net-2', module: 'MOD-08', label: 'ARP Spoofing MITM', xp: 200 },
  { id: 'net-3', module: 'MOD-08', label: 'DNS Poisoning', xp: 200 },
  { id: 'net-4', module: 'MOD-08', label: 'Packet Crafting with Scapy', xp: 250 },
  { id: 'net-5', module: 'MOD-08', label: 'Lateral Movement with CrackMapExec', xp: 300 },
  { id: 'cloud-1', module: 'MOD-09', label: 'AWS CLI Enumeration', xp: 150 },
  { id: 'cloud-2', module: 'MOD-09', label: 'S3 Bucket Exploitation', xp: 200 },
  { id: 'cloud-3', module: 'MOD-09', label: 'IMDS Credential Theft', xp: 300 },
  { id: 'cloud-4', module: 'MOD-09', label: 'IAM Privilege Escalation', xp: 350 },
  { id: 'cloud-5', module: 'MOD-09', label: 'Container Escape', xp: 400 },
  { id: 'se-1', module: 'MOD-10', label: 'OSINT Target Profiling', xp: 150 },
  { id: 'se-2', module: 'MOD-10', label: 'Gophish Phishing Campaign', xp: 250 },
  { id: 'se-3', module: 'MOD-10', label: 'Spear Phishing Email', xp: 200 },
  { id: 'se-4', module: 'MOD-10', label: 'Vishing Script and Call', xp: 200 },
  { id: 'se-5', module: 'MOD-10', label: 'Physical Intrusion Scenario', xp: 300 },
  { id: 'rt-1', module: 'MOD-11', label: 'C2 with Sliver Setup', xp: 250 },
  { id: 'rt-2', module: 'MOD-11', label: 'AV and EDR Evasion', xp: 350 },
  { id: 'rt-3', module: 'MOD-11', label: 'Persistence Mechanisms', xp: 300 },
  { id: 'rt-4', module: 'MOD-11', label: 'Lateral Movement Campaign', xp: 400 },
  { id: 'rt-5', module: 'MOD-11', label: 'Full Exfiltration Simulation', xp: 500 },
  { id: 'wl-1', module: 'MOD-12', label: 'Monitor Mode and Capture', xp: 100 },
  { id: 'wl-2', module: 'MOD-12', label: 'WPA2 Handshake Crack', xp: 200 },
  { id: 'wl-3', module: 'MOD-12', label: 'PMKID Attack', xp: 250 },
  { id: 'wl-4', module: 'MOD-12', label: 'Evil Twin AP', xp: 300 },
  { id: 'wl-5', module: 'MOD-12', label: 'WPS Pixie Dust', xp: 250 },
  { id: 'mob-1', module: 'MOD-13', label: 'APK Static Analysis', xp: 150 },
  { id: 'mob-2', module: 'MOD-13', label: 'MobSF Automated Scan', xp: 150 },
  { id: 'mob-3', module: 'MOD-13', label: 'Frida SSL Pinning Bypass', xp: 300 },
  { id: 'mob-4', module: 'MOD-13', label: 'Drozer Component Attack', xp: 250 },
  { id: 'mob-5', module: 'MOD-13', label: 'ADB Runtime Exploitation', xp: 200 },
]

const RANKS = [
  { title: 'Script Kiddie', minXp: 0, color: '#5a7a5a' },
  { title: 'Recon Agent', minXp: 500, color: '#00d4ff' },
  { title: 'Threat Hunter', minXp: 1500, color: '#00ff41' },
  { title: 'Exploit Dev', minXp: 3000, color: '#ffb347' },
  { title: 'Red Operator', minXp: 5000, color: '#ff4136' },
  { title: 'Ghost Tier', minXp: 8000, color: '#bf5fff' },
  { title: 'Ghost Operative', minXp: 12000, color: '#bf5fff' },
  { title: 'Phantom', minXp: 18000, color: '#ff6ec7' },
  { title: 'Wraith', minXp: 26000, color: '#ff3333' },
  { title: 'Shadow God', minXp: 36000, color: '#ff9500' },
]

const MOD_COLORS: Record<string, string> = {
  'MOD-01': '#00ff41',
  'MOD-02': '#00d4ff',
  'MOD-03': '#ffb347',
  'MOD-04': '#bf5fff',
  'MOD-05': '#ff4136',
  'MOD-06': '#00d4ff',
  'MOD-07': '#00ff41',
  'MOD-08': '#00ffff',
  'MOD-09': '#ff9500',
  'MOD-10': '#ff6ec7',
  'MOD-11': '#ff3333',
  'MOD-12': '#aaff00',
  'MOD-13': '#7c4dff',
}

function getRank(xp: number) {
  return [...RANKS].reverse().find(r => xp >= r.minXp) || RANKS[0]
}

function getNextRank(xp: number) {
  return RANKS.find(r => xp < r.minXp) || null
}

const defaultProgress: Progress = {
  completedLabs: [],
  xp: 0,
  streak: 0,
  lastActivity: '',
  notes: {},
}

export default function ProgressTracker() {
  const [open, setOpen] = useState(false)
  const [progress, setProgress] = useState<Progress>(defaultProgress)
  const [tab, setTab] = useState<'progress' | 'notes'>('progress')
  const [noteText, setNoteText] = useState('')
  const [noteModule, setNoteModule] = useState('MOD-01')
  const [justEarned, setJustEarned] = useState(0)

  useEffect(() => {
    const saved = localStorage.getItem('ghostnet_progress')
    if (saved) setProgress(JSON.parse(saved))
  }, [])

  const save = (p: Progress) => {
    setProgress(p)
    localStorage.setItem('ghostnet_progress', JSON.stringify(p))
  }

  const toggleLab = (labId: string, labXp: number) => {
    const completed = progress.completedLabs.includes(labId)
    const newCompleted = completed
      ? progress.completedLabs.filter(id => id !== labId)
      : [...progress.completedLabs, labId]
    const newXp = completed ? progress.xp - labXp : progress.xp + labXp
    if (!completed) setJustEarned(labXp)
    setTimeout(() => setJustEarned(0), 2000)
    save({ ...progress, completedLabs: newCompleted, xp: Math.max(0, newXp), lastActivity: new Date().toISOString() })
  }

  const saveNote = () => {
    save({ ...progress, notes: { ...progress.notes, [noteModule]: noteText } })
  }

  const rank = getRank(progress.xp)
  const nextRank = getNextRank(progress.xp)
  const xpToNext = nextRank ? nextRank.minXp - progress.xp : 0
  const progressPct = nextRank ? Math.round(((progress.xp - getRank(progress.xp).minXp) / (nextRank.minXp - getRank(progress.xp).minXp)) * 100) : 100

  const modules = ['MOD-01','MOD-02','MOD-03','MOD-04','MOD-05','MOD-06','MOD-07','MOD-08','MOD-09','MOD-10','MOD-11','MOD-12','MOD-13']

  const totalLabs = LABS.length
  const doneLabs = progress.completedLabs.length

  return (
    <>
      {justEarned > 0 && (
        <div style={{ position: 'fixed', top: '80px', right: '24px', zIndex: 9500, background: 'rgba(0,255,65,0.12)', border: '1px solid rgba(0,255,65,0.4)', borderRadius: '6px', padding: '8px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: '#00ff41', animation: 'fadeUp 2s ease forwards' }}>
          +{justEarned} XP
          <style>{`@keyframes fadeUp{0%{opacity:1;transform:translateY(0)}100%{opacity:0;transform:translateY(-30px)}}`}</style>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        style={{
          position: 'fixed', bottom: '62px', left: '24px', zIndex: 9000,
          background: 'rgba(0,255,65,0.08)', border: '1px solid rgba(0,255,65,0.3)',
          borderRadius: '6px', padding: '4px 10px', cursor: 'pointer',
          fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', color: '#00ff41',
          letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '5px',
          height: '32px', boxSizing: 'border-box' as const,
        }}
      >
        <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#00ff41', flexShrink: 0 }} />
        {progress.xp} XP · {rank.title.toUpperCase()}
      </button>

      {open && (
        <div style={{
          position: 'fixed', bottom: '100px', left: '24px', zIndex: 9001,
          width: '320px', maxHeight: '40vh',
          background: '#080c0a', border: '1px solid rgba(0,255,65,0.2)',
          borderRadius: '10px', display: 'flex', flexDirection: 'column',
          fontFamily: 'JetBrains Mono, monospace', overflow: 'hidden',
        }}>
          <div style={{ padding: '10px 14px', borderBottom: '1px solid #1a2e1e', background: 'rgba(0,255,65,0.04)', flexShrink: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '10px', color: '#00ff41', fontWeight: 700, letterSpacing: '0.15em' }}>PROGRESS TRACKER</span>
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: '#2a5a2a', cursor: 'pointer', fontSize: '16px', lineHeight: 1 }}>×</button>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '4px' }}>
              <span style={{ fontSize: '20px', fontWeight: 700, color: rank.color }}>{progress.xp.toLocaleString()}</span>
              <span style={{ fontSize: '8px', color: '#3a6a3a', letterSpacing: '0.1em' }}>XP</span>
              <span style={{ fontSize: '9px', color: rank.color, marginLeft: 'auto', letterSpacing: '0.1em' }}>{rank.title.toUpperCase()}</span>
            </div>
            <div style={{ fontSize: '7px', color: '#3a6a3a', marginBottom: '4px' }}>{doneLabs}/{totalLabs} labs complete</div>
            {nextRank && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                  <span style={{ fontSize: '7px', color: '#3a6a3a' }}>{xpToNext} XP to {nextRank.title}</span>
                  <span style={{ fontSize: '7px', color: '#3a6a3a' }}>{progressPct}%</span>
                </div>
                <div style={{ height: '3px', background: '#1a2e1e', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: progressPct + '%', background: '#00ff41', borderRadius: '2px', transition: 'width 0.3s' }} />
                </div>
              </div>
            )}
            <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
              {(['progress', 'notes'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)} style={{ background: tab === t ? 'rgba(0,255,65,0.1)' : 'transparent', border: '1px solid ' + (tab === t ? 'rgba(0,255,65,0.3)' : '#1a2e1e'), borderRadius: '3px', padding: '2px 8px', cursor: 'pointer', fontSize: '7px', color: tab === t ? '#00ff41' : '#3a6a3a', letterSpacing: '0.1em' }}>{t.toUpperCase()}</button>
              ))}
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '8px 10px' }}>
            {tab === 'progress' && modules.map(mod => {
              const modLabs = LABS.filter(l => l.module === mod)
              const modDone = modLabs.filter(l => progress.completedLabs.includes(l.id)).length
              const color = MOD_COLORS[mod] || '#5a7a5a'
              return (
                <div key={mod} style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                    <span style={{ fontSize: '8px', color, letterSpacing: '0.1em', fontWeight: 700 }}>{mod}</span>
                    <span style={{ fontSize: '7px', color: '#3a6a3a' }}>{modDone}/{modLabs.length}</span>
                  </div>
                  {modLabs.map(lab => {
                    const done = progress.completedLabs.includes(lab.id)
                    return (
                      <div key={lab.id} onClick={() => toggleLab(lab.id, lab.xp)} style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '4px 5px', borderRadius: '3px', cursor: 'pointer', marginBottom: '2px', background: done ? 'rgba(0,255,65,0.04)' : 'transparent', border: '1px solid ' + (done ? 'rgba(0,255,65,0.15)' : 'transparent') }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '2px', border: '1px solid ' + (done ? color : '#1a2e1e'), background: done ? color + '22' : 'transparent', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {done && <span style={{ fontSize: '7px', color }}>✓</span>}
                        </div>
                        <span style={{ fontSize: '0.65rem', color: done ? '#8a9a8a' : '#3a6a3a', flex: 1 }}>{lab.label}</span>
                        <span style={{ fontSize: '7px', color: done ? color : '#2a4a2a' }}>+{lab.xp}</span>
                      </div>
                    )
                  })}
                </div>
              )
            })}

            {tab === 'notes' && (
              <div>
                <div style={{ display: 'flex', gap: '3px', marginBottom: '8px', flexWrap: 'wrap' as const }}>
                  {modules.map(m => (
                    <button key={m} onClick={() => { setNoteModule(m); setNoteText(progress.notes[m] || '') }} style={{ background: noteModule === m ? (MOD_COLORS[m] || '#5a7a5a') + '15' : 'transparent', border: '1px solid ' + (noteModule === m ? (MOD_COLORS[m] || '#5a7a5a') + '44' : '#1a2e1e'), borderRadius: '3px', padding: '2px 6px', cursor: 'pointer', fontSize: '7px', color: noteModule === m ? (MOD_COLORS[m] || '#5a7a5a') : '#3a6a3a', letterSpacing: '0.08em' }}>{m}</button>
                  ))}
                </div>
                <textarea
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                  placeholder={'Notes for ' + noteModule + '...\n\nMarkdown supported.'}
                  rows={8}
                  style={{ width: '100%', background: 'rgba(0,255,65,0.03)', border: '1px solid #1a2e1e', borderRadius: '4px', padding: '6px', color: '#8a9a8a', fontSize: '0.68rem', fontFamily: 'JetBrains Mono, monospace', resize: 'vertical' as const, outline: 'none', lineHeight: 1.6, boxSizing: 'border-box' as const }}
                />
                <button onClick={saveNote} style={{ marginTop: '5px', background: 'rgba(0,255,65,0.08)', border: '1px solid rgba(0,255,65,0.3)', borderRadius: '3px', padding: '4px 12px', cursor: 'pointer', fontSize: '7px', color: '#00ff41', letterSpacing: '0.1em', width: '100%' }}>SAVE NOTES</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
