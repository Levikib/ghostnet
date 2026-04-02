'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import LabTerminal, { LabStep } from '../../../components/LabTerminal'
import FreeLabTerminal from '../../../components/FreeLabTerminal'

const accent = '#7c4dff'
const moduleId = 'mobile-security'
const moduleName = 'Mobile Security'
const moduleNum = '13'
const xpTotal = 130

const steps: LabStep[] = [
  {
    id: 'mobile-01',
    title: 'APK Static Analysis',
    objective: 'Decompile an Android APK to inspect its source code. What tool decompiles APKs back to near-original Java source?',
    hint: 'The most popular tool combines jadx or apktool. "jadx" gives you Java source directly.',
    answers: ['jadx', 'jadx-gui', 'apktool', 'dex2jar', 'jadx-cli'],
    xp: 20,
    explanation: 'jadx app.apk decompiles Dalvik bytecode to readable Java. jadx-gui provides a graphical interface. Look for: hardcoded API keys, insecure SharedPreferences, exported activities without permission checks, and custom URL schemes with no validation.'
  },
  {
    id: 'mobile-02',
    title: 'ADB Shell Access',
    objective: 'Android Debug Bridge (ADB) lets you interact with a device. What ADB command opens a shell on a connected Android device?',
    hint: 'The command is "adb shell" — simple and direct.',
    answers: ['adb shell', 'adb -d shell', 'adb shell /system/bin/sh'],
    xp: 20,
    explanation: 'adb shell drops you into an Android shell. Useful commands: pm list packages (list apps), pm dump com.app (app info), am start -n com.app/.Activity (launch activities), content query (read content providers). Root access: adb shell su.'
  },
  {
    id: 'mobile-03',
    title: 'Frida Dynamic Instrumentation',
    objective: 'Frida hooks into running processes to inspect and modify behavior at runtime. What Frida command lists running processes on a connected Android device?',
    hint: 'The frida command-line tool with -U for USB and the frida-ps command.',
    answers: ['frida-ps -U', 'frida-ps', 'frida -U --no-pause -l script.js -f com.app', 'frida-ps -Ua'],
    flag: 'FLAG{frida_instrumentation_ready}',
    xp: 30,
    explanation: 'frida-ps -U lists all processes on the USB-connected device. Attach to an app: frida -U -n "App Name" -l script.js. Scripts use Java.perform() to hook methods, bypass SSL pinning, log crypto operations, and modify return values at runtime.'
  },
  {
    id: 'mobile-04',
    title: 'SSL Pinning Bypass',
    objective: 'Apps with SSL pinning reject Burp Suite\'s certificate. What tool bypasses SSL pinning at runtime using Frida under the hood?',
    hint: 'A popular framework that wraps Frida for mobile testing. It includes "android sslpinning disable".',
    answers: ['frida-universal-ssl-pinning-bypass', 'ssl pinning bypass', 'objection', 'frida-ssl-bypass'],
    xp: 25,
    explanation: 'objection -g com.target.app explore then "android sslpinning disable" bypasses SSL pinning at runtime using Frida under the hood. It patches OkHttp, TrustManager, WebView, and others. Alternative: patch the APK with apktool to remove certificate validation.'
  },
  {
    id: 'mobile-05',
    title: 'iOS Data Storage',
    objective: 'iOS apps commonly misstore sensitive data. What iOS storage location is accessible without jailbreak via an iTunes/iMazing backup?',
    hint: 'The storage readable in backups includes NSUserDefaults and app documents directory, but NOT the Keychain.',
    answers: ['nsuserdefaults', 'documents directory', 'app sandbox', 'plist files', 'documents'],
    flag: 'FLAG{mobile_storage_analysed}',
    xp: 35,
    explanation: 'NSUserDefaults (.plist files) and the app Documents directory are included in iTunes backups and readable by backup tools like iMazing. Sensitive data here is accessible to anyone with physical device + iTunes backup password. The Keychain is NOT included in standard backups and is hardware-encrypted.'
  }
]

export default function MobileSecurityLab() {
  const [guidedDone, setGuidedDone] = useState(false)
  const [freeLaunched, setFreeLaunched] = useState(false)
  const [earnedXp, setEarnedXp] = useState(0)
  const [showKeywords, setShowKeywords] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('lab_mobile-security-lab')
    if (saved) {
      const d = JSON.parse(saved)
      if (d.done) { setGuidedDone(true); setEarnedXp(d.xp || 0) }
    }
  }, [])

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#3a1a7a' }}>
        <Link href="/" style={{ color: '#3a1a7a', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>&#8250;</span>
        <Link href="/modules/mobile-security" style={{ color: '#3a1a7a', textDecoration: 'none' }}>MOBILE SECURITY</Link>
        <span>&#8250;</span>
        <span style={{ color: accent }}>LAB</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px', alignItems: 'center' }}>
          <Link href="/modules/mobile-security" style={{ textDecoration: 'none', padding: '3px 10px', border: '1px solid #1a0a3a', borderRadius: '3px', color: '#3a1a7a', fontSize: '7.5px', letterSpacing: '0.1em' }}>&#8592; CONCEPT</Link>
          <span style={{ padding: '3px 10px', background: 'rgba(124,77,255,0.1)', border: '1px solid rgba(124,77,255,0.4)', borderRadius: '3px', color: accent, fontSize: '7.5px', letterSpacing: '0.1em', fontWeight: 700 }}>LAB ACTIVE</span>
        </div>
      </div>

      {/* Progress banner */}
      <div style={{ background: 'rgba(124,77,255,0.04)', border: '1px solid rgba(124,77,255,0.15)', borderRadius: '6px', padding: '10px 16px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {[{ label: 'PHASE 1', done: true, active: !guidedDone }, { label: 'PHASE 2', done: guidedDone, active: guidedDone }].map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.done ? accent : '#1a0a3a', border: p.active ? '2px solid ' + accent : '1px solid #1a0a3a', boxShadow: p.active ? '0 0 6px ' + accent : 'none' }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: p.done ? accent : '#2a1a5a', letterSpacing: '0.1em' }}>{p.label}</span>
              {i === 0 && <span style={{ fontSize: '7px', color: '#1a0a3a', margin: '0 2px' }}>—</span>}
            </div>
          ))}
        </div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#4a3a8a' }}>
          MOD-{moduleNum} &nbsp;·&nbsp; {moduleName.toUpperCase()} &nbsp;·&nbsp; {xpTotal} XP AVAILABLE
        </div>
        {guidedDone && (
          <div style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: accent, fontWeight: 700 }}>
            &#10003; GUIDED PHASE COMPLETE — LAUNCH FREE LAB BELOW
          </div>
        )}
      </div>

      {/* PHASE 1 */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(124,77,255,0.1)', border: '1px solid rgba(124,77,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: accent, fontWeight: 700 }}>1</span>
          </div>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#2a1a5a', letterSpacing: '0.2em', marginBottom: '2px' }}>PHASE 1 — GUIDED LEARNING</div>
            <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.4rem', fontWeight: 700, color: accent, margin: 0 }}>Mobile Security Lab</h1>
          </div>
        </div>

        <p style={{ color: '#6a5a8a', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: 1.7, fontFamily: 'JetBrains Mono, monospace' }}>
          APK decompilation, ADB shell, Frida instrumentation, SSL pinning bypass, and iOS data storage analysis.
          Type real commands, earn XP, and capture flags. Complete all 5 steps to unlock Phase 2.
        </p>

        <div style={{ background: 'rgba(124,77,255,0.03)', border: '1px solid rgba(124,77,255,0.12)', borderRadius: '6px', padding: '1rem 1.25rem', marginBottom: '1.25rem', fontFamily: 'JetBrains Mono, monospace' }}>
          <div style={{ fontSize: '7px', color: '#1a0a3a', letterSpacing: '0.25em', marginBottom: '8px' }}>KEY CONCEPTS COVERED IN THIS LAB</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {['APK decompilation', 'Dalvik bytecode', 'ADB commands', 'Frida hooking', 'SSL pinning bypass', 'OWASP Mobile Top 10', 'iOS Keychain', 'Objection framework'].map(c => (
              <span key={c} style={{ fontSize: '7.5px', color: '#4a3a8a', background: 'rgba(124,77,255,0.06)', border: '1px solid rgba(124,77,255,0.12)', padding: '2px 8px', borderRadius: '3px' }}>{c}</span>
            ))}
          </div>
        </div>

        <LabTerminal
          labId="mobile-security-lab"
          moduleId={moduleId}
          title="Mobile Security Lab"
          accent={accent}
          steps={steps}
          onComplete={(xp) => { setGuidedDone(true); setEarnedXp(xp) }}
        />
      </div>

      {/* PHASE 2 */}
      <div id="free-lab" style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.25rem' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: guidedDone ? 'rgba(124,77,255,0.15)' : 'rgba(0,0,0,0.3)', border: '1px solid ' + (guidedDone ? 'rgba(124,77,255,0.4)' : '#1a0a3a'), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: guidedDone ? accent : '#2a1a5a', fontWeight: 700 }}>2</span>
          </div>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: guidedDone ? '#4a3a8a' : '#2a1a5a', letterSpacing: '0.2em', marginBottom: '2px' }}>PHASE 2 — FREE LAB ENVIRONMENT</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.1rem', fontWeight: 700, color: guidedDone ? accent : '#2a1a5a' }}>Full Mobile Security Practice Sandbox</div>
          </div>
          {guidedDone && !freeLaunched && (
            <div style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#ffb347', background: 'rgba(255,179,71,0.08)', border: '1px solid rgba(255,179,71,0.2)', padding: '3px 10px', borderRadius: '3px' }}>
              GUIDED PHASE COMPLETE
            </div>
          )}
        </div>

        {!freeLaunched ? (
          <div style={{ background: guidedDone ? 'rgba(124,77,255,0.04)' : '#040208', border: '1px solid ' + (guidedDone ? 'rgba(124,77,255,0.25)' : '#0d0520'), borderRadius: '10px', padding: '2.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            {guidedDone && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, ' + accent + ', transparent)' }} />}
            <div style={{ fontSize: '7px', color: guidedDone ? '#4a3a8a' : '#1a0a3a', letterSpacing: '0.3em', marginBottom: '1rem' }}>
              {guidedDone ? 'READY FOR COMPREHENSIVE TESTING' : 'COMPLETE GUIDED PHASE TO UNLOCK'}
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.2rem', color: guidedDone ? accent : '#2a1a5a', fontWeight: 700, marginBottom: '0.5rem' }}>
              LAUNCH FULL LAB ENVIRONMENT
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', color: '#4a3a8a', marginBottom: '0.75rem', lineHeight: 1.7 }}>
              Free-form terminal sandbox for Mobile Security
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#2a1a5a', marginBottom: '2rem', lineHeight: 1.7 }}>
              Command history &nbsp;·&nbsp; Tab autocomplete &nbsp;·&nbsp; Real command simulation &nbsp;·&nbsp; No restrictions
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
              {['jadx decompilation', 'ADB shell commands', 'Frida scripting', 'Objection framework', 'APK patching', 'iOS backup analysis'].map(feat => (
                <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: guidedDone ? accent : '#1a0a3a' }} />
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: guidedDone ? '#4a3a8a' : '#1a0a3a' }}>{feat}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => guidedDone && setFreeLaunched(true)}
              disabled={!guidedDone}
              style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.15em', padding: '14px 40px', border: '1px solid ' + (guidedDone ? 'rgba(124,77,255,0.6)' : '#1a0a3a'), borderRadius: '6px', background: guidedDone ? 'rgba(124,77,255,0.12)' : 'transparent', color: guidedDone ? accent : '#1a0a3a', cursor: guidedDone ? 'pointer' : 'not-allowed', boxShadow: guidedDone ? '0 0 24px rgba(124,77,255,0.18)' : 'none', transition: 'all 0.2s' }}
            >
              {guidedDone ? '&#9658; LAUNCH FREE LAB ENVIRONMENT' : '&#128274; COMPLETE GUIDED PHASE FIRST'}
            </button>
            {!guidedDone && <div style={{ marginTop: '1rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: '#1a0a3a' }}>Complete all 5 guided steps above to unlock the free lab environment</div>}
          </div>
        ) : (
          <div style={{ border: '1px solid ' + accent + '30', borderRadius: '10px', overflow: 'hidden', background: '#040208' }}>
            <FreeLabTerminal moduleId={moduleId} moduleName={moduleName} accent={accent} onClose={() => setFreeLaunched(false)} />
            <div style={{ padding: '8px 16px', background: '#060310', borderTop: '1px solid ' + accent + '15', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: accent, boxShadow: '0 0 5px ' + accent }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#2a1a5a' }}>
                You are in free practice mode. Ask <span style={{ color: accent }}>GHOST AGENT</span> (bottom-right) for hints on any mobile security technique.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Quick reference */}
      <div style={{ marginBottom: '2rem' }}>
        <button onClick={() => setShowKeywords(!showKeywords)} style={{ background: 'transparent', border: '1px solid #1a0a3a', borderRadius: '5px', padding: '8px 16px', cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#2a1a5a', letterSpacing: '0.1em', marginBottom: showKeywords ? '12px' : 0 }}>
          {showKeywords ? '▼' : '▶'} QUICK REFERENCE — MOBILE SECURITY COMMANDS
        </button>
        {showKeywords && (
          <div style={{ background: '#040208', border: '1px solid #0d0520', borderRadius: '6px', padding: '1.25rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '8px' }}>
              {[
                ['jadx -d output/ app.apk', 'Decompile APK to Java source'],
                ['apktool d app.apk', 'Disassemble APK to smali'],
                ['adb devices', 'List connected Android devices'],
                ['adb shell pm list packages', 'List all installed apps'],
                ['adb shell pm dump com.target.app', 'Get app info and permissions'],
                ['adb shell am start -n com.app/.MainActivity', 'Launch a specific activity'],
                ['frida-ps -Ua', 'List all running apps (USB)'],
                ['frida -U -n "App Name" -l bypass-ssl.js', 'Attach Frida with SSL bypass script'],
                ['objection -g com.app explore', 'Start Objection interactive shell'],
                ['android sslpinning disable', 'Disable SSL pinning (in Objection)'],
                ['mobsf', 'Mobile Security Framework static/dynamic analysis'],
                ['drozer console connect', 'Android attack framework'],
              ].map(([cmd, desc]) => (
                <div key={cmd} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '6px 8px', background: '#020106', borderRadius: '4px' }}>
                  <code style={{ color: accent, fontSize: '0.72rem', flexShrink: 0 }}>{cmd}</code>
                  <span style={{ color: '#4a3a8a', fontSize: '0.7rem' }}>{desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer nav */}
      <div style={{ paddingTop: '2rem', borderTop: '1px solid #0d0520', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <Link href="/modules/mobile-security" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#2a1a5a' }}>&#8592; BACK TO CONCEPT</Link>
        <Link href="/modules/tor/lab" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#2a1a5a' }}>&#8592; MOD-01 TOR LAB (START OVER)</Link>
      </div>
    </div>
  )
}
