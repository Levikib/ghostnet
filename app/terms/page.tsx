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

export default function TermsPage() {
  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '2rem 1rem' }}>

      {/* Header */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ fontFamily: mono, fontSize: '0.6rem', color: '#3a6a3a', letterSpacing: '0.25em', marginBottom: '0.5rem' }}>
          LEGAL · TERMS
        </div>
        <h1 style={{ fontFamily: mono, fontSize: '1.8rem', fontWeight: 700, color: '#00ff41', marginBottom: '0.5rem' }}>
          Terms of Service
        </h1>
        <p style={{ fontFamily: mono, fontSize: '0.7rem', color: '#3a6a3a' }}>
          Last updated: April 2026 · Effective immediately
        </p>
      </div>

      <div style={{ background: 'rgba(255,179,71,0.05)', border: '1px solid rgba(255,179,71,0.25)', borderLeft: '3px solid #ffb347', padding: '1rem 1.25rem', borderRadius: '0 4px 4px 0', marginBottom: '2.5rem' }}>
        <p style={{ fontFamily: mono, fontSize: '0.7rem', color: '#ffb347', letterSpacing: '0.1em', marginBottom: '4px' }}>IMPORTANT</p>
        <p style={{ fontFamily: sans, fontSize: '0.85rem', color: '#8a9a8a', lineHeight: 1.7 }}>
          GHOSTNET is an educational platform for authorised security research and learning only. All techniques, tools, and knowledge provided are for defensive understanding and legal penetration testing with explicit permission. Misuse is a criminal offence in most jurisdictions.
        </p>
      </div>

      <Section title="1. Acceptance of Terms">
        <p>By creating an account on GHOSTNET, you agree to be bound by these Terms of Service and our <Link href="/privacy" style={{ color: '#00d4ff' }}>Privacy Policy</Link>. If you do not agree, do not use the platform.</p>
      </Section>

      <Section title="2. Authorised Use Only">
        <p>All content on GHOSTNET — including lab exercises, commands, payloads, and techniques — is provided strictly for:</p>
        <ul style={{ paddingLeft: '1.25rem', marginTop: '0.5rem' }}>
          <li>Educational study of cybersecurity concepts</li>
          <li>Practising techniques in isolated lab environments with your own equipment</li>
          <li>Authorised penetration testing where you have explicit written permission from the system owner</li>
          <li>Defensive security research and threat analysis</li>
          <li>Capture-the-Flag (CTF) competitions</li>
        </ul>
        <p style={{ marginTop: '0.75rem' }}>You must never apply knowledge gained on this platform to systems, networks, or devices you do not own or do not have explicit written authorisation to test.</p>
      </Section>

      <Section title="3. Prohibited Conduct">
        <p>You agree NOT to:</p>
        <ul style={{ paddingLeft: '1.25rem', marginTop: '0.5rem' }}>
          <li>Use GHOSTNET content to attack, compromise, or disrupt systems without authorisation</li>
          <li>Attempt to manipulate the platform&apos;s XP, rank, or leaderboard through unauthorised means</li>
          <li>Share your account credentials with others</li>
          <li>Attempt to reverse-engineer, scrape, or extract platform content in bulk</li>
          <li>Impersonate other users or platform administrators</li>
          <li>Use the GHOST AI Agent to generate content for actual attacks or illegal purposes</li>
          <li>Circumvent authentication, rate limits, or any security control on the platform itself</li>
          <li>Register accounts using false identities or disposable emails to evade bans</li>
        </ul>
      </Section>

      <Section title="4. Account Responsibility">
        <p>You are responsible for all activity that occurs under your account. You must:</p>
        <ul style={{ paddingLeft: '1.25rem', marginTop: '0.5rem' }}>
          <li>Keep your credentials confidential</li>
          <li>Use a strong, unique password</li>
          <li>Notify us immediately if you suspect unauthorised access to your account</li>
          <li>Not share, sell, or transfer your account</li>
        </ul>
      </Section>

      <Section title="5. Intellectual Property">
        <p>All platform content — module text, lab designs, tool implementations, UI, and code — is the intellectual property of GHOSTNET. You may use the knowledge for personal learning and authorised professional work. You may not reproduce, redistribute, or resell platform content without written permission.</p>
        <p style={{ marginTop: '0.75rem' }}>Open-source tools and techniques referenced in the curriculum remain the property of their respective authors and are subject to their own licences.</p>
      </Section>

      <Section title="6. Disclaimer of Warranties">
        <p>GHOSTNET is provided &quot;as is&quot; without warranty of any kind. We do not warrant that:</p>
        <ul style={{ paddingLeft: '1.25rem', marginTop: '0.5rem' }}>
          <li>The platform will be uninterrupted or error-free</li>
          <li>All techniques demonstrated will work in every real-world environment</li>
          <li>Completion of labs guarantees employment or certification outcomes</li>
        </ul>
      </Section>

      <Section title="7. Limitation of Liability">
        <p>GHOSTNET and its operators are not liable for any damages arising from misuse of knowledge obtained on the platform, including but not limited to: criminal prosecution, civil liability, data loss, or system damage resulting from unauthorised testing activities.</p>
        <p style={{ marginTop: '0.75rem' }}>You accept full legal and moral responsibility for how you apply what you learn here.</p>
      </Section>

      <Section title="8. Account Termination">
        <p>We reserve the right to suspend or permanently terminate accounts that violate these terms, without notice and without refund (the platform is free). You may also delete your own account at any time from your profile page.</p>
      </Section>

      <Section title="9. Governing Law">
        <p>These terms are governed by applicable law. Any disputes will be resolved in the jurisdiction where the platform operator is based. By using the platform you consent to this jurisdiction.</p>
      </Section>

      <Section title="10. Changes to Terms">
        <p>We may update these terms as the platform evolves. The &quot;Last updated&quot; date reflects the current version. Continued use after changes constitutes acceptance.</p>
      </Section>

      <Section title="11. Contact">
        <p>For questions about these terms, account issues, or to report a security vulnerability, contact us through your profile page or open an issue on the platform&apos;s GitHub repository.</p>
      </Section>

      {/* Footer nav */}
      <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid #0d1f0d', display: 'flex', gap: '1.5rem', fontFamily: mono, fontSize: '0.7rem' }}>
        <Link href="/privacy" style={{ color: '#3a6a3a', textDecoration: 'none' }}>Privacy Policy →</Link>
        <Link href="/auth" style={{ color: '#3a6a3a', textDecoration: 'none' }}>Back to Login →</Link>
        <Link href="/" style={{ color: '#3a6a3a', textDecoration: 'none' }}>Dashboard →</Link>
      </div>

    </div>
  )
}
