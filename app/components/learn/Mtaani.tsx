import React from 'react'

// Shared "Picture it — Mtaani edition" callout: an everyday, African/Kenyan analogy in
// plain language. Fixed green identity so it reads consistently across every module.
export function Local({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: 'rgba(115,201,145,0.06)', border: '1px solid rgba(115,201,145,0.26)', borderRadius: '6px', padding: '0.85rem 1.1rem', margin: '1rem 0 1.5rem' }}>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#73c991', letterSpacing: '0.15em', marginBottom: '6px' }}>&#9672; PICTURE IT &#8212; MTAANI EDITION</div>
      <p style={{ color: '#aeb9b2', fontSize: '0.85rem', lineHeight: 1.75, margin: 0, fontFamily: 'sans-serif' }}>{children}</p>
    </div>
  )
}

// "Watch this" — wraps a code/output block a beginner should READ, not run yet.
// It removes the morale hit of a scary code dump: a clear badge sets the expectation,
// `reads` explains the output in plain language, and `later` says where you'll do it yourself.
export function Watch({ reads, later, children }: { reads?: React.ReactNode; later?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ margin: '1.25rem 0 1.5rem', border: '1px solid rgba(0,255,65,0.18)', borderRadius: '8px', overflow: 'hidden' }}>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#00ff41', letterSpacing: '0.14em', background: 'rgba(0,255,65,0.05)', padding: '7px 12px', borderBottom: '1px solid rgba(0,255,65,0.14)' }}>
        &#128065; WATCH THIS &#183; you don&apos;t need to run it yet &mdash; just read along
      </div>
      <div style={{ padding: '2px 12px 0' }}>{children}</div>
      {reads && (
        <div style={{ padding: '0 14px 12px', color: '#9fb0a6', fontSize: '0.82rem', lineHeight: 1.7, fontFamily: 'sans-serif' }}>
          <strong style={{ color: '#cfe8d6' }}>What you&apos;re seeing:</strong> {reads}
        </div>
      )}
      {later && (
        <div style={{ padding: '10px 14px', background: 'rgba(0,255,65,0.04)', borderTop: '1px solid rgba(0,255,65,0.1)', color: '#8bbf97', fontSize: '0.78rem', fontFamily: 'JetBrains Mono, monospace', lineHeight: 1.6 }}>
          &#8618; {later}
        </div>
      )}
    </div>
  )
}

// Inline cross-chapter signpost, e.g. <Ref>You'll do this hands-on in MOD-02</Ref>.
export function Ref({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ display: 'inline-block', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#7fdbff', background: 'rgba(127,219,255,0.08)', border: '1px solid rgba(127,219,255,0.2)', borderRadius: '5px', padding: '1px 7px', margin: '0 2px' }}>
      &#8618; {children}
    </span>
  )
}

export default Local
