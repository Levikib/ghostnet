'use client'
import React from 'react'
import Link from 'next/link'

const mono = 'JetBrains Mono, monospace'
const sans = 'DM Sans, sans-serif'

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: '2.5rem' }}>
    <h2 style={{ fontFamily: mono, fontSize: '0.8rem', color: '#00ff41', letterSpacing: '0.15em', marginBottom: '0.75rem', textTransform: 'uppercase' as const }}>
      {title}
    </h2>
    <div style={{ fontFamily: sans, fontSize: '0.9rem', color: '#8a9a8a', lineHeight: 1.8 }}>
      {children}
    </div>
  </div>
)

export default function PrivacyPage() {
  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '2rem 1rem' }}>

      {/* Header */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ fontFamily: mono, fontSize: '0.6rem', color: '#3a6a3a', letterSpacing: '0.25em', marginBottom: '0.5rem' }}>
          LEGAL · PRIVACY
        </div>
        <h1 style={{ fontFamily: mono, fontSize: '1.8rem', fontWeight: 700, color: '#00ff41', marginBottom: '0.5rem' }}>
          Privacy Policy
        </h1>
        <p style={{ fontFamily: mono, fontSize: '0.7rem', color: '#3a6a3a' }}>
          Last updated: April 2026 · Effective immediately
        </p>
      </div>

      <Section title="1. Who We Are">
        <p>GHOSTNET is a cybersecurity research and education platform operated by ShanGhost Admin. We provide interactive security training modules, lab environments, and research tools for educational and authorised use only.</p>
        <p style={{ marginTop: '0.75rem' }}>For questions about this policy, contact us through the platform profile page.</p>
      </Section>

      <Section title="2. What Data We Collect">
        <p><strong style={{ color: '#c8d8c8' }}>Account data:</strong> Email address, username, and hashed password — collected when you register. Your password is never stored in plaintext; it is hashed by Supabase Auth before storage.</p>
        <p style={{ marginTop: '0.75rem' }}><strong style={{ color: '#c8d8c8' }}>Platform activity:</strong> Lab completion records, XP earned per lab, rank achieved, streak days, and progress notes you choose to save.</p>
        <p style={{ marginTop: '0.75rem' }}><strong style={{ color: '#c8d8c8' }}>Technical data:</strong> Session tokens stored in httpOnly cookies (not accessible to JavaScript). Browser localStorage is used for offline progress caching — this data never leaves your device unless you are authenticated.</p>
        <p style={{ marginTop: '0.75rem' }}><strong style={{ color: '#c8d8c8' }}>AI interactions:</strong> Messages sent to the GHOST AI Agent are forwarded to Groq&apos;s API for processing. We do not persistently store your AI conversation history on our servers; history is stored in your browser&apos;s localStorage only.</p>
      </Section>

      <Section title="3. What We Do NOT Collect">
        <ul style={{ paddingLeft: '1.25rem' }}>
          <li>IP addresses (beyond transient server logs which expire automatically)</li>
          <li>Device fingerprints or tracking pixels</li>
          <li>Third-party advertising cookies</li>
          <li>Biometric data of any kind</li>
          <li>Payment information (the platform is free)</li>
        </ul>
      </Section>

      <Section title="4. How We Use Your Data">
        <ul style={{ paddingLeft: '1.25rem' }}>
          <li>To authenticate you and maintain your session</li>
          <li>To track and display your learning progress, XP, and rank on the leaderboard</li>
          <li>To personalise the GHOST AI Agent with your operator identity and skill context</li>
          <li>To display the public leaderboard (username and XP only — email is never shown publicly)</li>
          <li>To administer the platform and diagnose technical issues</li>
        </ul>
        <p style={{ marginTop: '0.75rem' }}>We do not sell, rent, or share your personal data with third parties for marketing purposes.</p>
      </Section>

      <Section title="5. Data Sharing">
        <p><strong style={{ color: '#c8d8c8' }}>Supabase:</strong> Our database and authentication provider. Data is stored on Supabase-managed infrastructure. See <a href="https://supabase.com/privacy" style={{ color: '#00d4ff' }} target="_blank" rel="noopener noreferrer">supabase.com/privacy</a>.</p>
        <p style={{ marginTop: '0.75rem' }}><strong style={{ color: '#c8d8c8' }}>Groq:</strong> AI inference provider for the GHOST Agent. Messages you send to the agent are processed by Groq. See <a href="https://groq.com/privacy-policy" style={{ color: '#00d4ff' }} target="_blank" rel="noopener noreferrer">groq.com/privacy-policy</a>.</p>
        <p style={{ marginTop: '0.75rem' }}>No other third parties receive your personal data.</p>
      </Section>

      <Section title="6. Data Retention">
        <p>Your data is retained for as long as your account exists. When you delete your account, all associated data — profile, lab history, XP, badges, and AI memory — is permanently and irreversibly deleted within 24 hours.</p>
      </Section>

      <Section title="7. Your Rights">
        <p>Depending on your jurisdiction you may have the right to:</p>
        <ul style={{ paddingLeft: '1.25rem', marginTop: '0.5rem' }}>
          <li><strong style={{ color: '#c8d8c8' }}>Access:</strong> Request a copy of the data we hold about you</li>
          <li><strong style={{ color: '#c8d8c8' }}>Rectification:</strong> Correct inaccurate data (username can be updated in your profile)</li>
          <li><strong style={{ color: '#c8d8c8' }}>Erasure:</strong> Delete your account and all associated data at any time via your profile page — no email required, takes effect immediately</li>
          <li><strong style={{ color: '#c8d8c8' }}>Portability:</strong> Export your progress data on request</li>
          <li><strong style={{ color: '#c8d8c8' }}>Objection:</strong> Object to any processing where our legitimate interests are the legal basis</li>
        </ul>
        <p style={{ marginTop: '0.75rem' }}>To exercise any right, use the account deletion feature in your profile or contact us directly.</p>
      </Section>

      <Section title="8. Security">
        <p>GHOSTNET is built with security as a primary concern — as you&apos;d expect from a platform teaching it. We implement: HTTPS-only with HSTS, httpOnly session cookies with 20-minute inactivity timeout, strict Content Security Policy headers, server-side authentication on every API endpoint, and row-level security on all database tables. However, no system is 100% immune. If you discover a vulnerability, please report it responsibly rather than exploiting it.</p>
      </Section>

      <Section title="9. Cookies">
        <p>We use a single session cookie set by Supabase Auth. It is:</p>
        <ul style={{ paddingLeft: '1.25rem', marginTop: '0.5rem' }}>
          <li>httpOnly — not accessible to JavaScript</li>
          <li>Secure — only sent over HTTPS in production</li>
          <li>SameSite: Lax — CSRF protection</li>
          <li>Expires after 20 minutes of inactivity (sliding timeout)</li>
        </ul>
        <p style={{ marginTop: '0.75rem' }}>No advertising, analytics, or tracking cookies are used.</p>
      </Section>

      <Section title="10. Children">
        <p>GHOSTNET is intended for users aged 16 and over. We do not knowingly collect data from children under 16. If you believe a child has registered, contact us immediately and we will delete the account.</p>
      </Section>

      <Section title="11. Changes to This Policy">
        <p>We may update this policy as the platform evolves. The &quot;Last updated&quot; date at the top reflects the most recent revision. Continued use of the platform after changes constitutes acceptance of the updated policy.</p>
      </Section>

      {/* Footer nav */}
      <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid #0d1f0d', display: 'flex', gap: '1.5rem', fontFamily: mono, fontSize: '0.7rem' }}>
        <Link href="/terms" style={{ color: '#3a6a3a', textDecoration: 'none' }}>Terms of Service →</Link>
        <Link href="/auth" style={{ color: '#3a6a3a', textDecoration: 'none' }}>Back to Login →</Link>
        <Link href="/" style={{ color: '#3a6a3a', textDecoration: 'none' }}>Dashboard →</Link>
      </div>

    </div>
  )
}
