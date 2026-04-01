'use client'
import React from 'react'
import Link from 'next/link'

const accent = '#7c4dff'
const dim = '#4a3a6a'
const border = '#200038'

const Pre = ({ label, children }: { label?: string; children: string }) => (
  <div style={{ margin: '1rem 0 1.5rem' }}>
    {label && <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: dim, letterSpacing: '0.15em', marginBottom: '4px' }}>{label}</div>}
    <pre style={{ background: '#040404', border: '1px solid ' + border, borderRadius: '4px', padding: '1.25rem', overflow: 'auto', color: accent, fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', lineHeight: 1.7, whiteSpace: 'pre' as const }}>{children}</pre>
  </div>
)

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.1rem', fontWeight: 600, color: accent, marginTop: '2.5rem', marginBottom: '0.75rem' }}>
    <span style={{ color: border, marginRight: '8px' }}>//</span>{children}
  </h2>
)

const P = ({ children }: { children: React.ReactNode }) => (
  <p style={{ color: '#8a9a8a', lineHeight: 1.8, marginBottom: '1rem', fontSize: '0.9rem' }}>{children}</p>
)

const Note = ({ children }: { children: React.ReactNode }) => (
  <div style={{ background: 'rgba(124,77,255, 0.06)', border: '1px solid rgba(124,77,255, 0.25)', borderRadius: '6px', padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: accent, letterSpacing: '0.15em', marginBottom: '6px' }}>BEGINNER NOTE</div>
    <p style={{ color: '#8a9a9a', fontSize: '0.82rem', lineHeight: 1.7, margin: 0 }}>{children}</p>
  </div>
)

export default function MobileSecurityLab() {
  return (
    <div style={{ minHeight: '100vh', background: '#04000c', color: '#b8b0c8', fontFamily: 'system-ui, sans-serif', padding: '2rem' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>

        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: dim, marginBottom: '2rem', letterSpacing: '0.1em' }}>
          <Link href="/" style={{ color: dim, textDecoration: 'none' }}>GHOSTNET</Link>
          <span style={{ margin: '0 0.5rem' }}>&gt;</span>
          <Link href="/modules/mobile-security" style={{ color: dim, textDecoration: 'none' }}>MOBILE SECURITY</Link>
          <span style={{ margin: '0 0.5rem' }}>&gt;</span>
          <span style={{ color: accent }}>LAB</span>
        </div>

        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: dim, letterSpacing: '0.2em', marginBottom: '0.5rem' }}>HANDS-ON LAB</div>
          <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '2rem', fontWeight: 700, color: accent, margin: 0 }}>Mobile Security Lab</h1>
          <p style={{ color: '#5a4a7a', marginTop: '0.75rem', fontSize: '0.9rem' }}>
            Static analysis, MobSF scanning, ADB runtime analysis, Frida SSL bypass, Drozer component testing, and OWASP audit.{' '}
            <Link href="/modules/mobile-security" style={{ color: accent, textDecoration: 'none' }}>Back to Concept &rarr;</Link>
          </p>
        </div>

        <div style={{ background: '#040010', border: '1px solid ' + border, borderRadius: '8px', padding: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: dim, letterSpacing: '0.15em', marginBottom: '0.75rem' }}>LAB OVERVIEW</div>
          <P>All exercises use DIVA Android (Damn Insecure and Vulnerable App) as the target — a deliberately vulnerable Android application designed for learning. Download it from the official repository before starting:</P>
          <a href="https://github.com/payatu/diva-android" target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', color: accent, textDecoration: 'none', display: 'block', marginBottom: '0.75rem' }}>
            &rarr; https://github.com/payatu/diva-android
          </a>
          <P>You will also need: Android Studio (for the emulator AVD), ADB (Android Debug Bridge), apktool, jadx, MobSF (via Docker), Frida, objection, and Drozer.</P>
        </div>

        <H2>01 — Static Analysis with apktool and jadx</H2>
        <P>Static analysis examines the APK without running it. By decompiling the APK you can read the AndroidManifest.xml, inspect permissions, find hardcoded secrets in source code, and map exported components — all before the app ever executes.</P>
        <Note>An APK is just a ZIP archive. You can rename DIVA.apk to DIVA.zip and open it to see the raw files. However, the code inside classes.dex is in Dalvik bytecode — you need jadx to convert it to readable Java. apktool decodes resources and the manifest into a human-readable form.</Note>
        <Pre label="// EXERCISE 1 — DECOMPILE AND ANALYSE DIVA APK">{`# Install required tools:
sudo apt install apktool default-jdk
# jadx (download latest release from GitHub):
wget https://github.com/skylot/jadx/releases/download/v1.4.7/jadx-1.4.7.zip
unzip jadx-1.4.7.zip -d jadx/

# Download DIVA APK:
wget https://github.com/payatu/diva-android/raw/master/DivaApplication.apk

# Step 1: Decode APK with apktool (resources + manifest):
apktool d DivaApplication.apk -o diva_decoded

# Examine the manifest — find permissions and exported components:
cat diva_decoded/AndroidManifest.xml

# Look for exported activities (accessible without authentication):
grep -n "exported=\"true\"" diva_decoded/AndroidManifest.xml

# Look for dangerous permissions:
grep -n "uses-permission" diva_decoded/AndroidManifest.xml

# Step 2: Decompile Java code with jadx:
./jadx/bin/jadx -d diva_java DivaApplication.apk

# Step 3: Search for hardcoded secrets:
grep -rn "password\|passwd\|secret\|api_key\|apikey" diva_java/
grep -rn "hardcoded\|HARDCODED" diva_java/
grep -rn "http://\|https://" diva_java/ | grep -v "schema\|xmlns"

# Search for SQLite queries (may reveal database structure):
grep -rn "rawQuery\|execSQL\|SQLiteDatabase" diva_java/

# Step 4: Look for insecure data storage patterns:
grep -rn "getSharedPreferences\|MODE_WORLD_READABLE" diva_java/
grep -rn "openFileOutput\|getExternalStorage" diva_java/`}</Pre>

        <H2>02 — MobSF Automated Security Scan</H2>
        <P>Mobile Security Framework (MobSF) performs automated static and dynamic analysis of Android APKs. It generates a scored security report covering permissions, security misconfigs, hardcoded secrets, API misuse, and manifest issues.</P>
        <Note>MobSF is easiest to run via Docker — it handles all Java and Python dependencies automatically. The web interface runs on port 8000. After uploading the APK, the scan takes about 60-90 seconds. Pay attention to the Security Score and the Findings sections — they map to OWASP Mobile Top 10.</Note>
        <Pre label="// EXERCISE 2 — AUTOMATED SECURITY SCAN WITH MOBSF">{`# Pull and run MobSF via Docker:
docker pull opensecurity/mobile-security-framework-mobsf:latest
docker run -it --rm -p 8000:8000 opensecurity/mobile-security-framework-mobsf:latest

# Open in browser: http://localhost:8000

# Upload DIVA via the web interface:
# Drag and drop DivaApplication.apk onto the upload area
# MobSF will automatically begin static analysis

# Or upload via API:
curl -F "file=@DivaApplication.apk" http://localhost:8000/api/v1/upload \
  -H "Authorization: YOUR_MOBSF_API_KEY"

# Retrieve the scan report as JSON:
curl "http://localhost:8000/api/v1/report_json" \
  -H "Authorization: YOUR_MOBSF_API_KEY" \
  -d "hash=APK_MD5_HASH"

# Key sections to review in the MobSF HTML report:
# [1] Security Score — overall rating out of 100
# [2] Permissions — dangerous vs normal permissions
# [3] Manifest Analysis — exported components, backup flags, debuggable
# [4] Code Analysis — hardcoded secrets, insecure API usage
# [5] Network Security — cleartext traffic, certificate pinning
# [6] Binary Analysis — protections like PIE, stack canary, RELRO

# Common DIVA findings MobSF will identify:
# - debuggable=true in manifest
# - allowBackup=true (allows ADB backup of all app data)
# - Hardcoded credentials in source code
# - Use of SQLite without parameterized queries (SQLi vulnerable)
# - World-readable file storage`}</Pre>

        <H2>03 — ADB Dynamic Analysis</H2>
        <P>ADB (Android Debug Bridge) connects to a running Android emulator or device to inspect the live application at runtime. You can read log output, access the filesystem, install apps, and extract databases.</P>
        <Note>Start an Android Virtual Device (AVD) in Android Studio's AVD Manager before running ADB commands. Choose an emulator image without Google Play (the "x86" images labeled without "Google Play") as they have root access available, which is needed for many analysis commands.</Note>
        <Pre label="// EXERCISE 3 — RUNTIME ANALYSIS WITH ADB">{`# Start your Android emulator in Android Studio (AVD Manager)
# Then verify ADB can see it:
adb devices
# Expected: emulator-5554   device

# Install DIVA on the emulator:
adb install DivaApplication.apk

# Launch DIVA directly:
adb shell am start -n jakhar.asura.diva/.MainActivity

# Step 1: Monitor real-time log output:
adb logcat | grep -i "diva\|jakhar"

# Step 2: Get a shell on the emulator:
adb shell

# Inside the shell — navigate to app data directory:
# cd /data/data/jakhar.asura.diva/
# ls -la

# Step 3: Find app files — shared preferences, databases, files:
adb shell run-as jakhar.asura.diva ls -la /data/data/jakhar.asura.diva/
adb shell run-as jakhar.asura.diva ls -la /data/data/jakhar.asura.diva/shared_prefs/
adb shell run-as jakhar.asura.diva ls -la /data/data/jakhar.asura.diva/databases/

# Step 4: Pull the SQLite database from the device:
adb pull /data/data/jakhar.asura.diva/databases/ids2 ./diva_ids.db

# Step 5: Open and query the database:
sqlite3 diva_ids.db
.tables
SELECT * FROM android_metadata;
.quit

# Step 6: Read shared preferences (XML credential storage):
adb shell run-as jakhar.asura.diva cat /data/data/jakhar.asura.diva/shared_prefs/jakhar.asura.diva_preferences.xml

# Step 7: Check for world-readable files:
adb shell ls -la /sdcard/ | grep jakhar
adb shell find /sdcard -name "*.txt" 2>/dev/null`}</Pre>

        <H2>04 — Frida SSL Pinning Bypass</H2>
        <P>Many apps implement SSL certificate pinning to prevent traffic interception. Frida is a dynamic instrumentation toolkit that lets you inject JavaScript into running processes to hook functions and modify behavior — including disabling SSL pinning checks at runtime.</P>
        <Pre label="// EXERCISE 4 — BYPASS SSL PINNING WITH FRIDA">{`# Step 1: Install Frida and objection on your host machine:
pip install frida-tools objection

# Step 2: Download frida-server for Android x86 emulator:
# Check your Frida version first:
frida --version

# Download matching frida-server from GitHub releases:
# https://github.com/frida/frida/releases
# File: frida-server-VERSION-android-x86.xz

xz -d frida-server-VERSION-android-x86.xz

# Step 3: Push frida-server to emulator and make it executable:
adb push frida-server-VERSION-android-x86 /data/local/tmp/frida-server
adb shell chmod 755 /data/local/tmp/frida-server

# Step 4: Start frida-server on the emulator (as root):
adb shell "/data/local/tmp/frida-server &"

# Verify Frida can see the emulator:
frida-ps -U

# Step 5: Use objection to bypass SSL pinning automatically:
# Launch DIVA on the emulator first, then:
objection -g jakhar.asura.diva explore

# Inside the objection shell:
# android sslpinning disable

# Step 6: Configure Burp Suite as proxy:
# In Burp: Proxy -> Options -> Add listener on 0.0.0.0:8080
# On emulator: Settings -> WiFi -> Proxy -> Manual -> Host: YOUR_HOST_IP Port: 8080

# Install Burp CA certificate on emulator:
# Download from http://burp (via proxy) or http://YOUR_HOST_IP:8080
# Settings -> Security -> Install certificate -> DER format

# Now intercept DIVA traffic in Burp even with pinning enabled in code

# Manual Frida hook to disable a specific pinning check:
# frida -U -n jakhar.asura.diva -l ssl_bypass.js`}</Pre>

        <H2>05 — Drozer Component Testing</H2>
        <P>Drozer is an Android security assessment framework that lets you interact with app components (Activities, Services, Content Providers, Broadcast Receivers) as if you were another app on the device — testing what exported components expose without requiring source code access.</P>
        <Note>Drozer has two parts: the drozer console on your host machine, and the drozer agent APK on the Android device. The agent acts as a bridge. Install the agent APK first, start the agent, then connect from your host over ADB port forwarding.</Note>
        <Pre label="// EXERCISE 5 — ATTACK ANDROID COMPONENTS WITH DROZER">{`# Install drozer on Kali:
pip install drozer

# Download the drozer agent APK:
# https://github.com/WithSecureLabs/drozer/releases
# File: drozer-agent-VERSION.apk

# Install the agent on the emulator:
adb install drozer-agent-VERSION.apk

# On the emulator: launch drozer agent app, tap Embedded Server -> Enable

# On your host: set up ADB port forwarding:
adb forward tcp:31415 tcp:31415

# Connect drozer console to the agent:
drozer console connect

# Inside the drozer console:

# List all packages:
# run app.package.list

# Get attack surface for DIVA:
# run app.package.attacksurface jakhar.asura.diva
# Expected output shows: activities, content providers, broadcast receivers, services

# List all activities (screens) in DIVA:
# run app.activity.info -a jakhar.asura.diva

# Launch an exported activity directly (bypasses login if applicable):
# run app.activity.start --component jakhar.asura.diva jakhar.asura.diva.SomeActivity

# List content providers:
# run app.provider.info -a jakhar.asura.diva

# Query a content provider (may expose database rows):
# run app.provider.query content://jakhar.asura.diva.provider/divanotes/

# Test for SQL injection in a content provider:
# run app.provider.query content://jakhar.asura.diva.provider/divanotes/ --selection "1=1 or 1=1"

# Scan all content providers for SQL injection automatically:
# run scanner.provider.injection -a jakhar.asura.diva

# Scan for path traversal in file providers:
# run scanner.provider.traversal -a jakhar.asura.diva`}</Pre>

        <H2>06 — OWASP Mobile Top 10 Audit Checklist</H2>
        <P>Map all findings from the previous exercises to the OWASP Mobile Top 10 risk categories. This checklist can be applied to any Android application as a structured security audit.</P>
        <Pre label="// EXERCISE 6 — AUDIT AN APP AGAINST OWASP MOBILE TOP 10">{`# OWASP MOBILE TOP 10 — AUDIT CHECKLIST FOR DIVA ANDROID
# =========================================================

# M1: Improper Credential Usage
# -----------------------------------------------------------------------
# [ ] Search source code for hardcoded usernames and passwords
#     jadx output: grep -rn "password\|passwd" diva_java/
# [ ] Check if credentials are logged to logcat
#     adb logcat | grep -i "password\|token\|key"
# [ ] Verify no credentials stored in plain text SharedPreferences
#     adb shell run-as PACKAGE cat shared_prefs/*.xml

# M2: Inadequate Supply Chain Security
# -----------------------------------------------------------------------
# [ ] Check third-party libraries for known CVEs
#     MobSF report -> Libraries section
# [ ] Verify APK signature and certificate
#     apksigner verify --verbose DivaApplication.apk

# M3: Insecure Authentication and Authorization
# -----------------------------------------------------------------------
# [ ] Test if exported activities can be launched without logging in
#     drozer: run app.activity.start --component PACKAGE ACTIVITY
# [ ] Check for missing authentication on API endpoints
#     Burp: replay requests without auth token
# [ ] Verify session tokens expire appropriately

# M4: Insufficient Input and Output Validation
# -----------------------------------------------------------------------
# [ ] Test SQLite queries for injection
#     drozer: run scanner.provider.injection -a PACKAGE
# [ ] Test content provider queries with malformed input
#     drozer: run app.provider.query CONTENT_URI --selection "1=1--"
# [ ] Check WebView for JavaScript injection
#     jadx: grep -rn "setJavaScriptEnabled(true)" diva_java/

# M5: Insecure Communication
# -----------------------------------------------------------------------
# [ ] Check if app uses HTTP (cleartext) traffic
#     Burp proxy: observe any http:// requests
#     MobSF report -> Network Security section
# [ ] Verify TLS certificate validation is not disabled
#     jadx: grep -rn "TrustAllCerts\|ALLOW_ALL_HOSTNAME" diva_java/
# [ ] Confirm SSL pinning is implemented (if required)
#     Frida: attempt to bypass; if bypass succeeds, no pinning

# M6: Inadequate Privacy Controls
# -----------------------------------------------------------------------
# [ ] Check what data is stored on external storage (world-readable)
#     adb shell find /sdcard -name "*.db" -o -name "*.txt"
# [ ] Check if backup is enabled (allowBackup=true in manifest)
#     adb backup -apk -nosystem PACKAGE_NAME
# [ ] Check for PII in log output
#     adb logcat | grep -iE "email|phone|ssn|dob"

# M7: Insufficient Binary Protections
# -----------------------------------------------------------------------
# [ ] Check if app is debuggable in production
#     AndroidManifest.xml: android:debuggable="true"
# [ ] Verify code obfuscation is applied
#     jadx: look for meaningful class/method names (no obfuscation = fail)
# [ ] Check for root detection and emulator detection logic
#     jadx: grep -rn "RootBeer\|isRooted\|isEmulator" diva_java/

# M8: Security Misconfiguration
# -----------------------------------------------------------------------
# [ ] Check network security config allows cleartext
#     res/xml/network_security_config.xml
# [ ] Check exported components do not expose sensitive functionality
#     drozer: run app.package.attacksurface PACKAGE
# [ ] Verify android:exported is explicitly set on all components

# M9: Insecure Data Storage
# -----------------------------------------------------------------------
# [ ] Pull and inspect all SQLite databases
#     adb pull /data/data/PACKAGE/databases/
# [ ] Check SharedPreferences for sensitive values
#     adb shell run-as PACKAGE cat shared_prefs/*.xml
# [ ] Look for world-readable files created by the app
#     MobSF: Code Analysis -> Insecure File Permissions

# M10: Insufficient Cryptography
# -----------------------------------------------------------------------
# [ ] Check for use of MD5 or SHA1 for password hashing
#     jadx: grep -rn "MD5\|SHA-1\|SHA1" diva_java/
# [ ] Check for hardcoded encryption keys
#     jadx: grep -rn "AES\|DES\|SecretKey" diva_java/
# [ ] Verify random number generation uses SecureRandom not Random
#     jadx: grep -rn "new Random()" diva_java/`}</Pre>

        <H2>Check Your Understanding</H2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
          {[
            '1. What is the difference between apktool and jadx — what does each tool decode, and when would you use both?',
            '2. What does android:debuggable="true" in a production APK allow an attacker to do?',
            '3. Why is SSL pinning important for mobile apps, and what does objection use to bypass it at runtime?',
            '4. What is the difference between a Content Provider and an Activity in Android, and how does Drozer test each?',
            '5. Which OWASP Mobile Top 10 category does hardcoded API keys in source code fall under?',
          ].map((q, i) => (
            <div key={i} style={{ background: '#040010', border: '1px solid ' + border, borderRadius: '4px', padding: '0.85rem 1rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', color: '#7a6a9a' }}>{q}</div>
          ))}
        </div>

        <H2>Further Practice</H2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '3rem' }}>
          {[
            { label: 'TryHackMe — Android Hacking 101', url: 'https://tryhackme.com/room/androidhacking101' },
            { label: 'TryHackMe — OWASP Mobile Top 10', url: 'https://tryhackme.com/room/owasptop10mobile' },
            { label: 'DIVA Android — Official Repo (payatu)', url: 'https://github.com/payatu/diva-android' },
            { label: 'InsecureBankv2 — Advanced Android Vulnerable App', url: 'https://github.com/dineshshetty/Android-InsecureBankv2' },
          ].map((r, i) => (
            <a key={i} href={r.url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', background: '#040010', border: '1px solid ' + border, borderRadius: '4px', padding: '0.75rem 1rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', color: accent, textDecoration: 'none' }}>
              &rarr; {r.label}
            </a>
          ))}
        </div>

        <div style={{ borderTop: '1px solid ' + border, paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/modules/mobile-security" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', color: dim, textDecoration: 'none' }}>&larr; Back to Concept</Link>
          <Link href="/modules" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', color: accent, textDecoration: 'none' }}>All Modules &rarr;</Link>
        </div>

      </div>
    </div>
  )
}
