import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'GHOSTNET: hands-on cybersecurity labs'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px', background: '#000', color: '#00ff41', fontFamily: 'monospace' }}>
        <div style={{ fontSize: 28, color: '#00d4ff', letterSpacing: 6 }}>SECURITY RESEARCH PLATFORM</div>
        <div style={{ fontSize: 120, fontWeight: 700, letterSpacing: 12, marginTop: 24 }}>GHOSTNET</div>
        <div style={{ fontSize: 34, color: '#e6e6e6', marginTop: 24, maxWidth: 980 }}>13 hands-on modules: OSINT, Tor, cryptography, web attacks, Active Directory, cloud, red team and more.</div>
        <div style={{ display: 'flex', marginTop: 40, fontSize: 26, color: '#ffb347' }}>Guided labs · XP ranks · AI guide</div>
      </div>
    ),
    size,
  )
}
