'use client'
import React, { useState } from 'react'
import Link from 'next/link'

interface TxNode {
  address: string
  label: string
  balance: string
  txCount: number
  risk: 'clean' | 'medium' | 'high' | 'exchange' | 'mixer'
  chain: string
}

interface TxEdge {
  from: string
  to: string
  amount: string
  hash: string
  timestamp: string
  token: string
}

interface TraceResult {
  nodes: TxNode[]
  edges: TxEdge[]
  summary: string
  riskScore: number
  flags: string[]
}

const RISK_COLORS = {
  clean: '#00ff41',
  medium: '#ffb347',
  high: '#ff4136',
  exchange: '#00d4ff',
  mixer: '#bf5fff',
}

const RISK_LABELS = {
  clean: 'CLEAN',
  medium: 'MEDIUM RISK',
  high: 'HIGH RISK',
  exchange: 'EXCHANGE',
  mixer: 'MIXER/TUMBLER',
}

// Demo traces for known addresses
const DEMO_TRACES: Record<string, TraceResult> = {
  '1f1tAaz5x1HUXrCNLbtMDqcw6o5GNn4xqX': {
    riskScore: 0,
    summary: 'Bitcoin Genesis Block address — Satoshi Nakamoto. Coins have never moved. ~50 BTC from mining reward. One of the most watched addresses on the blockchain.',
    flags: ['Genesis block coinbase', 'Never spent', 'Historically significant'],
    nodes: [
      { address: '1f1tAaz5x1HUXrCNLbtMDqcw6o5GNn4xqX', label: 'Genesis Block (Satoshi)', balance: '50 BTC', txCount: 1, risk: 'clean', chain: 'Bitcoin' },
      { address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7Divf8N', label: 'Block 1 Reward', balance: '50 BTC', txCount: 0, risk: 'clean', chain: 'Bitcoin' },
    ],
    edges: [
      { from: '1f1tAaz5x1HUXrCNLbtMDqcw6o5GNn4xqX', to: '1A1zP1eP5QGefi2DMPTfTL5SLmv7Divf8N', amount: '50 BTC', hash: '4a5e1e4baab89f3...', timestamp: '2009-01-03', token: 'BTC' },
    ]
  },
  '0xbb9bc244d798123fde783fcc1c72d3bb8c189413': {
    riskScore: 95,
    summary: 'The DAO Attacker (2016). Drained 3.6M ETH ($60M) using reentrancy exploit. Led to Ethereum hard fork creating ETH/ETC split. Funds were traced and ultimately returned via fork.',
    flags: ['Reentrancy exploit', 'DAO hack 2016', 'Led to ETH hard fork', 'High risk'],
    nodes: [
      { address: '0xbb9bc244d798123fde783fcc1c72d3bb8c189413', label: 'The DAO Contract', balance: '0 ETH', txCount: 12000, risk: 'high', chain: 'Ethereum' },
      { address: '0xb656b2a9c3b2416437a811e07466ca712f5a5b5a', label: 'Attacker Address', balance: '3.6M ETH', txCount: 1, risk: 'high', chain: 'Ethereum' },
      { address: '0x4f4ede3b0f31b0e1b6e2f2b2e0b4e3e2e1e0d4f', label: 'Child DAO (holding)', balance: '3.6M ETH', txCount: 5, risk: 'high', chain: 'Ethereum' },
    ],
    edges: [
      { from: '0xbb9bc244d798123fde783fcc1c72d3bb8c189413', to: '0xb656b2a9c3b2416437a811e07466ca712f5a5b5a', amount: '3,641,694 ETH', hash: '0x0ec3f2488a93839...', timestamp: '2016-06-17', token: 'ETH' },
      { from: '0xb656b2a9c3b2416437a811e07466ca712f5a5b5a', to: '0x4f4ede3b0f31b0e1b6e2f2b2e0b4e3e2e1e0d4f', amount: '3,641,694 ETH', hash: '0x1f2a3b4c5d6e7f8...', timestamp: '2016-06-17', token: 'ETH' },
    ]
  },
  'demo_mixer': {
    riskScore: 78,
    summary: 'Typical mixer/tumbler transaction pattern. Funds enter from multiple sources, consolidate, pass through mixing contract, then exit to fresh addresses. Each hop reduces traceability.',
    flags: ['Mixer interaction', 'Multiple input addresses', 'Uniform output amounts', 'Address consolidation', 'Chain hopping suspected'],
    nodes: [
      { address: '0xSource1...', label: 'Source Wallet 1', balance: '1.0 ETH', txCount: 3, risk: 'medium', chain: 'Ethereum' },
      { address: '0xSource2...', label: 'Source Wallet 2', balance: '1.0 ETH', txCount: 2, risk: 'medium', chain: 'Ethereum' },
      { address: '0xMixer...', label: 'Tornado Cash (OFAC sanctioned)', balance: '0 ETH', txCount: 50000, risk: 'mixer', chain: 'Ethereum' },
      { address: '0xFresh1...', label: 'Fresh Address 1', balance: '0.9 ETH', txCount: 1, risk: 'medium', chain: 'Ethereum' },
      { address: '0xFresh2...', label: 'Fresh Address 2', balance: '0.9 ETH', txCount: 1, risk: 'medium', chain: 'Ethereum' },
      { address: '0xBinance...', label: 'Binance Hot Wallet', balance: '—', txCount: 999999, risk: 'exchange', chain: 'Ethereum' },
    ],
    edges: [
      { from: '0xSource1...', to: '0xMixer...', amount: '1.0 ETH', hash: '0xabc...', timestamp: '2024-01-15 14:22', token: 'ETH' },
      { from: '0xSource2...', to: '0xMixer...', amount: '1.0 ETH', hash: '0xdef...', timestamp: '2024-01-15 14:23', token: 'ETH' },
      { from: '0xMixer...', to: '0xFresh1...', amount: '0.9 ETH', hash: '0x111...', timestamp: '2024-01-15 18:40', token: 'ETH' },
      { from: '0xMixer...', to: '0xFresh2...', amount: '0.9 ETH', hash: '0x222...', timestamp: '2024-01-15 18:41', token: 'ETH' },
      { from: '0xFresh1...', to: '0xBinance...', amount: '0.9 ETH', hash: '0x333...', timestamp: '2024-01-16 09:12', token: 'ETH' },
    ]
  }
}

const QUICK_EXAMPLES = [
  { label: 'Genesis Block', addr: '1f1tAaz5x1HUXrCNLbtMDqcw6o5GNn4xqX', chain: 'Bitcoin', desc: 'Satoshi\'s first address' },
  { label: 'The DAO Hack', addr: '0xbb9bc244d798123fde783fcc1c72d3bb8c189413', chain: 'Ethereum', desc: '$60M reentrancy exploit 2016' },
  { label: 'Mixer Pattern', addr: 'demo_mixer', chain: 'Ethereum', desc: 'Tornado Cash flow example' },
]

const HEURISTICS = [
  { name: 'Common Input Ownership', desc: 'Multiple inputs in one transaction → likely same entity controls all input addresses', color: '#00d4ff' },
  { name: 'Change Address Detection', desc: 'Smaller output returning to sender pattern — identifies which output is "change" vs payment', color: '#00d4ff' },
  { name: 'Peel Chain', desc: 'Sequential transactions moving slightly decreasing amounts — consistent with mixing or layering', color: '#ffb347' },
  { name: 'Exchange Deposit', desc: 'Funds reaching a known exchange hot wallet — KYC data can be subpoenaed', color: '#00ff41' },
  { name: 'Dust Attack', desc: 'Tiny amounts sent to wallet — forces owner to consolidate, linking addresses on spend', color: '#ffb347' },
  { name: 'Mixer Interaction', desc: 'Any interaction with known mixing contracts (Tornado Cash etc) — flagged by all analytics platforms', color: '#bf5fff' },
  { name: 'Uniform Output Amounts', desc: 'All outputs exactly the same amount — strong indicator of mixing or structured deposits', color: '#bf5fff' },
  { name: 'Timed Withdrawal', desc: 'Deposit and withdrawal from mixer at specific time intervals — reduces anonymity set', color: '#ff4136' },
]

const TOOLS_LIST = [
  { name: 'Blockchair', url: 'https://blockchair.com', free: true, desc: 'Multi-chain explorer with graph view — Bitcoin, Ethereum, 10+ chains' },
  { name: 'OXT', url: 'https://oxt.me', free: true, desc: 'Bitcoin UTXO graph — best free tool for BTC address clustering' },
  { name: 'Etherscan', url: 'https://etherscan.io', free: true, desc: 'Ethereum explorer — labelled addresses, token transfers, contract interactions' },
  { name: 'Breadcrumbs', url: 'https://www.breadcrumbs.app', free: true, desc: 'Visual on-chain investigation — trace and annotate fund flows' },
  { name: 'MistTrack', url: 'https://misttrack.io', free: true, desc: 'Address risk scoring by SlowMist — free basic plan' },
  { name: 'Tenderly', url: 'https://tenderly.co', free: true, desc: 'EVM transaction debugger — full call trace for smart contract interactions' },
  { name: 'Phalcon', url: 'https://explorer.phalcon.xyz', free: true, desc: 'DeFi transaction decoder — fund flow + call tree in one view' },
  { name: 'Chainalysis Reactor', url: 'https://www.chainalysis.com', free: false, desc: 'Enterprise — used by FBI, IRS-CI, Europol for criminal investigations' },
  { name: 'TRM Labs', url: 'https://www.trmlabs.com', free: false, desc: 'Enterprise — risk scoring + investigation, used by major exchanges' },
  { name: 'Crystal Blockchain', url: 'https://crystalblockchain.com', free: false, desc: 'Enterprise — compliance and investigation platform' },
]

export default function CryptoTracerPage() {
  const [address, setAddress] = useState('')
  const [chain, setChain] = useState('ethereum')
  const [result, setResult] = useState<TraceResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'trace' | 'heuristics' | 'tools'>('trace')

  const trace = () => {
    if (!address.trim()) return
    setLoading(true)
    setTimeout(() => {
      const addr = address.toLowerCase().replace('0x', '')
      const demo = DEMO_TRACES[address] ||
        DEMO_TRACES['0x' + addr] ||
        DEMO_TRACES[address.toLowerCase()]
      if (demo) {
        setResult(demo)
      } else {
        // Generic result for unknown addresses
        setResult({
          riskScore: Math.floor(Math.random() * 40),
          summary: `Address ${address.slice(0, 12)}... — No pre-loaded data available for this address. For real tracing, use the tools listed in the Tools tab. Copy this address into Blockchair, Etherscan (for ETH), or OXT (for BTC) to see actual transaction history.`,
          flags: ['No cached data — use live tools'],
          nodes: [
            { address: address, label: 'Target Address', balance: 'Query live tool', txCount: 0, risk: 'clean', chain: chain },
          ],
          edges: []
        })
      }
      setLoading(false)
    }, 1200)
  }

  const riskColor = (score: number) => score > 70 ? '#ff4136' : score > 40 ? '#ffb347' : '#00ff41'

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5a7a5a', letterSpacing: '0.25em', marginBottom: '0.5rem' }}>GHOSTNET // CRYPTO FORENSICS</div>
        <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '2rem', fontWeight: 700, color: '#ffb347', margin: '0.5rem 0', textShadow: '0 0 20px rgba(255,179,71,0.3)' }}>TRANSACTION TRACER</h1>
        <p style={{ color: '#5a7a5a', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem' }}>On-chain fund flow analysis · Address clustering · Risk scoring · Heuristics</p>
        <div style={{ marginTop: '12px', background: 'rgba(255,179,71,0.04)', border: '1px solid rgba(255,179,71,0.15)', borderRadius: '4px', padding: '10px 14px' }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#ffb347', letterSpacing: '0.1em', marginRight: '8px' }}>HOW TO USE</span>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#5a6a5a', lineHeight: 1.6 }}>
            Simulates the methodology used by blockchain investigators to follow money on-chain. <strong style={{ color: '#8a9a8a' }}>TRACE tab:</strong> paste a wallet address or transaction hash, select Bitcoin or Ethereum, and hit TRACE to see a simulated fund-flow graph with risk labels (mixer, exchange, high-risk). <strong style={{ color: '#8a9a8a' }}>HEURISTICS tab:</strong> learn the real techniques used to de-anonymise wallets. <strong style={{ color: '#8a9a8a' }}>TOOLS tab:</strong> links to free on-chain investigation tools. Pairs with MOD-03 Crypto lab.
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '1.5rem' }}>
        {(['trace', 'heuristics', 'tools'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', letterSpacing: '0.15em',
            padding: '6px 16px', borderRadius: '3px', cursor: 'pointer',
            background: activeTab === tab ? 'rgba(255,179,71,0.1)' : 'transparent',
            border: `1px solid ${activeTab === tab ? 'rgba(255,179,71,0.4)' : '#1a2e1e'}`,
            color: activeTab === tab ? '#ffb347' : '#3a5a3a',
          }}>{tab.toUpperCase()}</button>
        ))}
      </div>

      {/* TRACE TAB */}
      {activeTab === 'trace' && (
        <div>
          {/* Input */}
          <div style={{ background: '#0e1005', border: '1px solid #2e1e00', borderRadius: '6px', padding: '1.25rem', marginBottom: '1.5rem' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5a7a5a', letterSpacing: '0.2em', marginBottom: '0.75rem' }}>TRACE ADDRESS</div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
              <input
                value={address}
                onChange={e => setAddress(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && trace()}
                placeholder="0x... or Bitcoin address"
                style={{ flex: 1, fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', background: '#080c05', border: '1px solid #2e1e00', borderRadius: '4px', padding: '8px 12px', color: '#ffb347', outline: 'none' }}
              />
              <select value={chain} onChange={e => setChain(e.target.value)} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', background: '#080c05', border: '1px solid #2e1e00', borderRadius: '4px', padding: '8px 12px', color: '#cc7a00', outline: 'none' }}>
                <option value="ethereum">Ethereum</option>
                <option value="bitcoin">Bitcoin</option>
                <option value="bsc">BSC</option>
                <option value="polygon">Polygon</option>
                <option value="tron">Tron</option>
              </select>
              <button onClick={trace} disabled={loading || !address.trim()} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', letterSpacing: '0.1em', padding: '8px 20px', borderRadius: '4px', cursor: 'pointer', background: 'rgba(255,179,71,0.15)', border: '1px solid rgba(255,179,71,0.4)', color: '#ffb347' }}>
                {loading ? 'TRACING...' : 'TRACE'}
              </button>
            </div>

            {/* Quick examples */}
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', color: '#3a5a3a', letterSpacing: '0.1em', marginBottom: '6px' }}>DEMO ADDRESSES:</div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' as const }}>
              {QUICK_EXAMPLES.map(ex => (
                <button key={ex.addr} onClick={() => { setAddress(ex.addr); setChain(ex.chain.toLowerCase()) }} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.68rem', padding: '4px 10px', borderRadius: '3px', cursor: 'pointer', background: 'transparent', border: '1px solid #2e1e00', color: '#5a7a5a' }}>
                  {ex.label} <span style={{ color: '#3a4a3a' }}>— {ex.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Result */}
          {result && (
            <div>
              {/* Risk score */}
              <div style={{ display: 'flex', gap: '1px', marginBottom: '1rem', background: '#2e1e00', borderRadius: '6px', overflow: 'hidden', border: '1px solid #2e1e00' }}>
                <div style={{ flex: 1, background: '#0e1005', padding: '16px' }}>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#3a5a3a', letterSpacing: '0.15em', marginBottom: '4px' }}>RISK SCORE</div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '2rem', fontWeight: 700, color: riskColor(result.riskScore) }}>{result.riskScore}/100</div>
                </div>
                <div style={{ flex: 2, background: '#0e1005', padding: '16px' }}>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#3a5a3a', letterSpacing: '0.15em', marginBottom: '6px' }}>FLAGS DETECTED</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '6px' }}>
                    {result.flags.map((flag, i) => (
                      <span key={i} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.68rem', padding: '2px 8px', borderRadius: '2px', background: 'rgba(255,179,71,0.1)', border: '1px solid rgba(255,179,71,0.2)', color: '#cc7a00' }}>{flag}</span>
                    ))}
                  </div>
                </div>
                <div style={{ flex: 2, background: '#0e1005', padding: '16px' }}>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#3a5a3a', letterSpacing: '0.15em', marginBottom: '4px' }}>INTELLIGENCE SUMMARY</div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#8a9a8a', lineHeight: 1.6 }}>{result.summary}</div>
                </div>
              </div>

              {/* Nodes */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5a7a5a', letterSpacing: '0.2em', marginBottom: '8px' }}>ADDRESS ENTITIES</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#2e1e00', borderRadius: '6px', overflow: 'hidden', border: '1px solid #2e1e00' }}>
                  {result.nodes.map((node, i) => (
                    <div key={i} style={{ background: '#0e1005', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', borderLeft: `3px solid ${RISK_COLORS[node.risk]}` }}>
                      <div style={{ flexShrink: 0 }}>
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', letterSpacing: '0.1em', padding: '2px 6px', borderRadius: '2px', background: `${RISK_COLORS[node.risk]}18`, color: RISK_COLORS[node.risk] }}>{RISK_LABELS[node.risk]}</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', fontWeight: 700, color: '#ffb347', marginBottom: '2px' }}>{node.label}</div>
                        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#3a5a3a', wordBreak: 'break-all' as const }}>{node.address}</div>
                      </div>
                      <div style={{ textAlign: 'right' as const, flexShrink: 0 }}>
                        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#cc7a00' }}>{node.balance}</div>
                        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#3a5a3a' }}>{node.chain}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Transaction edges */}
              {result.edges.length > 0 && (
                <div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5a7a5a', letterSpacing: '0.2em', marginBottom: '8px' }}>TRANSACTION FLOW</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#2e1e00', borderRadius: '6px', overflow: 'hidden', border: '1px solid #2e1e00' }}>
                    {result.edges.map((edge, i) => (
                      <div key={i} style={{ background: '#0e1005', padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' as const }}>
                          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#3a5a3a' }}>{edge.from.slice(0, 16)}...</span>
                          <span style={{ color: '#ffb347', fontSize: '12px' }}>→</span>
                          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#3a5a3a' }}>{edge.to.slice(0, 16)}...</span>
                          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.82rem', fontWeight: 700, color: '#ffb347', marginLeft: 'auto' }}>{edge.amount}</span>
                          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '8px', color: '#cc7a00', padding: '1px 6px', border: '1px solid #2e1e00', borderRadius: '2px' }}>{edge.token}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '16px' }}>
                          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#2a4a2a' }}>tx: {edge.hash}</span>
                          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#2a4a2a' }}>{edge.timestamp}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Live tool links */}
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#0e1005', border: '1px solid #2e1e00', borderRadius: '4px' }}>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#3a5a3a', letterSpacing: '0.15em', marginBottom: '8px' }}>TRACE LIVE WITH FREE TOOLS</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' as const }}>
                  {[
                    { name: 'Blockchair', url: `https://blockchair.com/search?q=${address}` },
                    { name: 'Etherscan', url: `https://etherscan.io/address/${address}` },
                    { name: 'Breadcrumbs', url: `https://www.breadcrumbs.app/reports/${address}` },
                    { name: 'MistTrack', url: `https://misttrack.io/aml_risks/ETH/${address}` },
                  ].map(t => (
                    <a key={t.name} href={t.url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#cc7a00', padding: '4px 12px', border: '1px solid #2e1e00', borderRadius: '3px', textDecoration: 'none' }}>
                      {t.name} →
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* HEURISTICS TAB */}
      {activeTab === 'heuristics' && (
        <div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5a7a5a', letterSpacing: '0.2em', marginBottom: '1rem' }}>
            BLOCKCHAIN FORENSICS HEURISTICS — HOW INVESTIGATORS TRACE FUNDS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#2e1e00', borderRadius: '6px', overflow: 'hidden', border: '1px solid #2e1e00' }}>
            {HEURISTICS.map((h, i) => (
              <div key={i} style={{ background: '#0e1005', padding: '16px', borderLeft: `3px solid ${h.color}` }}>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.82rem', fontWeight: 700, color: h.color, marginBottom: '6px' }}>{h.name}</div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#8a9a8a', lineHeight: 1.6 }}>{h.desc}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1.5rem', background: '#0e1005', border: '1px solid #2e1e00', borderRadius: '6px', padding: '1.25rem' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5a7a5a', letterSpacing: '0.2em', marginBottom: '0.75rem' }}>WHY BLOCKCHAIN IS NOT ANONYMOUS</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#8a9a8a', lineHeight: 1.9 }}>
              Every transaction is permanently public. Every address is pseudonymous — not anonymous.
              The moment a pseudonymous address is linked to a real identity (via exchange KYC, IP address leak,
              social media mention, or operational mistake), the entire transaction history becomes attributable.
              <br /><br />
              Most cryptocurrency-related arrests come not from breaking the cryptography, but from:
              <br />— Exchange KYC at the on/off ramp
              <br />— IP address exposure when broadcasting transactions
              <br />— Reusing addresses or usernames across platforms
              <br />— Blockchain analytics correlating timing and amounts through mixers
              <br />— Social engineering and undercover law enforcement operations
            </div>
          </div>
        </div>
      )}

      {/* TOOLS TAB */}
      {activeTab === 'tools' && (
        <div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5a7a5a', letterSpacing: '0.2em', marginBottom: '1rem' }}>
            BLOCKCHAIN FORENSICS TOOLING — FREE AND COMMERCIAL
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#2e1e00', borderRadius: '6px', overflow: 'hidden', border: '1px solid #2e1e00' }}>
            {TOOLS_LIST.map((tool, i) => (
              <div key={i} style={{ background: '#0e1005', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px', borderLeft: `3px solid ${tool.free ? '#00ff41' : '#ffb347'}` }}>
                <div style={{ flexShrink: 0, width: '160px' }}>
                  <a href={tool.url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', fontWeight: 700, color: tool.free ? '#00ff41' : '#ffb347', textDecoration: 'none' }}>{tool.name}</a>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: tool.free ? '#2a5a2a' : '#5a3a00', letterSpacing: '0.1em', marginTop: '2px' }}>{tool.free ? 'FREE' : 'PAID/ENTERPRISE'}</div>
                </div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#5a7a5a', lineHeight: 1.5 }}>{tool.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #1a2e1e', display: 'flex', gap: '1rem' }}>
        <Link href="/payload" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#bf5fff', padding: '8px 20px', border: '1px solid rgba(191,95,255,0.3)', borderRadius: '4px', background: 'rgba(191,95,255,0.05)' }}>
          PAYLOAD GENERATOR →
        </Link>
        <Link href="/intel" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#ff4136', padding: '8px 20px', border: '1px solid rgba(255,65,54,0.3)', borderRadius: '4px', background: 'rgba(255,65,54,0.05)' }}>
          THREAT INTEL →
        </Link>
        <Link href="/" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5a7a5a', padding: '8px 20px', border: '1px solid #1a2e1e', borderRadius: '4px' }}>
          ← DASHBOARD
        </Link>
      </div>
    </div>
  )
}
