'use client'
import React from 'react'
import Link from 'next/link'
import LabTerminal, { LabStep } from '../../../components/LabTerminal'

const accent = '#7c4dff'

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
    hint: 'The frida command-line tool with -U for USB and -l or the frida-ps command.',
    answers: ['frida-ps -U', 'frida-ps', 'frida -U --no-pause -l script.js -f com.app', 'frida-ps -Ua'],
    flag: 'FLAG{frida_instrumentation_ready}',
    xp: 30,
    explanation: 'frida-ps -U lists all processes on the USB-connected device. Attach to an app: frida -U -n "App Name" -l script.js. Scripts use Java.perform() to hook methods, bypass SSL pinning, log crypto operations, and modify return values at runtime.'
  },
  {
    id: 'mobile-04',
    title: 'SSL Pinning Bypass',
    objective: 'Apps with SSL pinning reject Burp Suite\'s certificate. What Frida script resource contains pre-built SSL pinning bypass hooks for common Android frameworks?',
    hint: 'A popular GitHub repo by frida-apk contains universal bypass scripts. The project name includes "ssl-pinning".',
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
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#3a1a7a' }}>
        <Link href="/" style={{ color: '#3a1a7a', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>&#8250;</span>
        <Link href="/modules/mobile-security" style={{ color: '#3a1a7a', textDecoration: 'none' }}>MOBILE SECURITY</Link>
        <span>&#8250;</span>
        <span style={{ color: accent }}>LAB</span>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#3a1a7a', letterSpacing: '0.2em', marginBottom: '0.5rem' }}>MOD-13 &#8250; INTERACTIVE LAB</div>
        <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.6rem', fontWeight: 700, color: accent, margin: 0 }}>Mobile Security Lab</h1>
        <p style={{ color: '#6a5a8a', fontSize: '0.85rem', marginTop: '0.75rem', lineHeight: 1.7 }}>
          APK decompilation, ADB shell, Frida instrumentation, SSL pinning bypass, and iOS data storage analysis.
          Complete all 5 steps to earn 130 XP.
        </p>
        <div style={{ marginTop: '1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid #7c4dff22', borderRadius: '6px', padding: '1rem 1.25rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5a8a5a', lineHeight: 1.8 }}>
          <span style={{ color: accent, fontWeight: 600 }}>HOW TO USE THIS LAB:</span> Read each step objective, type the command or answer in the terminal below, and press Enter. Type <span style={{ color: '#ffb347' }}>hint</span> if you get stuck. Earn XP and capture flags on key steps. Progress saves automatically.
        </div>
      </div>

      <LabTerminal
        labId="mobile-security-lab"
        moduleId="mobile-security"
        title="Mobile Security Lab"
        accent={accent}
        steps={steps}
      />
    </div>
  )
}
