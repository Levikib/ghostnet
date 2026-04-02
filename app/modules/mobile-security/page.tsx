'use client'
import React from 'react'
import Link from 'next/link'

const accent = '#7c4dff'
const Pre = ({ label, children }: { label?: string; children: string }) => (
  <div style={{ margin: '1rem 0 1.5rem' }}>
    {label && <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#4a3a6a', letterSpacing: '0.15em', marginBottom: '4px' }}>{label}</div>}
    <pre style={{ background: '#040208', border: '1px solid #200038', borderRadius: '4px', padding: '1.25rem', overflow: 'auto', color: accent, fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', lineHeight: 1.7, whiteSpace: 'pre' as const }}>{children}</pre>
  </div>
)
const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.1rem', fontWeight: 600, color: accent, marginTop: '3rem', marginBottom: '1rem' }}>
    <span style={{ color: '#200038', marginRight: '8px' }}>//</span>{children}
  </h2>
)
const H3 = ({ children }: { children: React.ReactNode }) => (
  <h3 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', fontWeight: 600, color: '#6040cc', marginTop: '2rem', marginBottom: '0.75rem' }}>
    &#9658; {children}
  </h3>
)
const P = ({ children }: { children: React.ReactNode }) => <p style={{ color: '#8a8a9a', lineHeight: 1.8, marginBottom: '1rem', fontSize: '0.9rem' }}>{children}</p>
const Note = ({ children }: { children: React.ReactNode }) => (
  <div style={{ background: 'rgba(124,77,255,0.05)', border: '1px solid rgba(124,77,255,0.2)', borderRadius: '6px', padding: '1rem 1.25rem', marginBottom: '1.5rem', marginTop: '0.5rem' }}>
    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#7c4dff', letterSpacing: '0.15em', marginBottom: '6px' }}>BEGINNER NOTE</div>
    <p style={{ color: '#8a9a9a', fontSize: '0.82rem', lineHeight: 1.7, margin: 0, fontFamily: 'sans-serif' }}>{children}</p>
  </div>
)
const Table = ({ headers, rows }: { headers: string[]; rows: string[][] }) => (
  <div style={{ overflowX: 'auto', margin: '1rem 0 1.5rem' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem' }}>
      <thead><tr style={{ borderBottom: '1px solid #200038' }}>{headers.map((h, i) => <th key={i} style={{ textAlign: 'left', padding: '8px 12px', color: accent, fontWeight: 600, fontSize: '0.7rem' }}>{h}</th>)}</tr></thead>
      <tbody>{rows.map((row, i) => <tr key={i} style={{ borderBottom: '1px solid #100020', background: i % 2 === 0 ? 'transparent' : 'rgba(124,77,255,0.02)' }}>{row.map((cell, j) => <td key={j} style={{ padding: '8px 12px', color: '#8a8a9a', verticalAlign: 'top' }}>{cell}</td>)}</tr>)}</tbody>
    </table>
  </div>
)

export default function MobileSecurity() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#4a3a6a' }}>
        <Link href="/" style={{ color: '#4a3a6a', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>&#8250;</span><span style={{ color: accent }}>MOD-13 // MOBILE SECURITY</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <span style={{ padding: '3px 10px', background: 'rgba(124,77,255,0.08)', border: '1px solid rgba(124,77,255,0.3)', borderRadius: '3px', color: accent, fontSize: '8px' }}>CONCEPT</span>
          <Link href="/modules/mobile-security/lab" style={{ textDecoration: 'none', padding: '3px 10px', background: 'rgba(124,77,255,0.1)', border: '1px solid rgba(124,77,255,0.5)', borderRadius: '3px', color: '#7c4dff', fontSize: '8px', letterSpacing: '0.15em', fontWeight: 700 }}>LAB &#8594;</Link>
        </div>
      </div>

      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#4a3a6a', letterSpacing: '0.25em', marginBottom: '0.5rem' }}>MODULE 13 &middot; CONCEPT PAGE</div>
        <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '2rem', fontWeight: 700, color: accent, margin: '0.5rem 0', textShadow: 'rgba(124,77,255,0.35) 0 0 20px' }}>MOBILE SECURITY</h1>
        <p style={{ color: '#4a3a6a', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem' }}>Android APK analysis &middot; iOS security &middot; Frida hooking &middot; SSL unpinning &middot; Drozer &middot; MobSF &middot; ADB &middot; OWASP Mobile Top 10 &middot; Full pentest methodology</p>
      </div>

      {/* TOC */}
      <div style={{ background: '#050210', border: '1px solid #200038', borderRadius: '6px', padding: '1.25rem', marginBottom: '2.5rem' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#4a3a6a', letterSpacing: '0.2em', marginBottom: '0.75rem' }}>TABLE OF CONTENTS</div>
        {[
          '01 — Android Architecture & Attack Surface',
          '02 — Static Analysis (APK)',
          '03 — Dynamic Analysis with ADB',
          '04 — Frida — Dynamic Instrumentation',
          '05 — SSL Pinning Bypass',
          '06 — Drozer — Android Framework Testing',
          '07 — iOS Security Architecture',
          '08 — iOS Static & Dynamic Analysis',
          '09 — Network Traffic Interception (Both Platforms)',
          '10 — Mobile Application Pentest Methodology',
          '11 — OWASP Mobile Top 10 (2024)',
          '12 — Mobile Malware Analysis',
          '13 — Tools Reference',
        ].map((item, i) => (
          <div key={i} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#4a3a6a', padding: '3px 0', display: 'flex', gap: '8px' }}>
            <span style={{ color: '#200038' }}>&#9002;</span>
            <span>{item}</span>
          </div>
        ))}
      </div>

      <H2>01 — Android Architecture & Attack Surface</H2>
      <P>Mobile application security is a distinct discipline from web security. Apps are distributed as compiled binaries (APKs on Android, IPAs on iOS), can be decompiled and analyzed offline, run on user-controlled hardware (which may be rooted or jailbroken), and communicate over networks that the attacker may also control. The attack surface spans static analysis, dynamic analysis, network interception, and physical device access.</P>
      <Note>An APK file is essentially a ZIP file containing your app compiled code, resources, and manifest. When security researchers say they &apos;decompile an APK&apos;, they mean converting the compiled bytecode back into readable Java/Kotlin code using tools like jadx. This lets you read the source code of any Android app, looking for hardcoded secrets, weak authentication, or vulnerable code paths — even without access to the original source.</Note>

      <Pre label="// ANDROID ATTACK SURFACE MAP">{`# APK structure (rename .apk to .zip to explore):
# AndroidManifest.xml — permissions, components, exported activities
# classes.dex        — compiled Java/Kotlin bytecode
# res/               — resources, layouts, sometimes hardcoded strings
# lib/               — native libraries (.so files, compiled C/C++)
# assets/            — raw files, sometimes config files with API keys
# META-INF/          — signing certificate info

# Key attack areas ranked by frequency of vulnerabilities:
# 1. Exported Activities      — accessible without authentication
# 2. Hardcoded secrets        — in source, assets, strings.xml, native libs
# 3. Insecure data storage    — SharedPrefs, SQLite, external storage
# 4. Insecure communication   — HTTP, no cert pinning, weak TLS
# 5. Improper auth checks     — client-side enforcement (bypassed by Frida)
# 6. Vulnerable WebView       — JS enabled, file access, addJavascriptInterface
# 7. Broadcast receivers      — missing permission checks
# 8. Content providers        — SQL injection, path traversal
# 9. Deep links               — improper input validation
#10. Third-party SDKs         — analytics, ads, auth SDKs with their own vulns`}</Pre>

      <H3>Android Security Model</H3>
      <Table
        headers={['SECURITY LAYER', 'MECHANISM', 'BYPASS METHOD']}
        rows={[
          ['App sandbox', 'Each app runs as unique Linux UID', 'Root access removes sandbox entirely'],
          ['Permission model', 'Runtime permissions for sensitive APIs', 'Exported components bypass permission checks'],
          ['Keystore', 'Hardware-backed key storage', 'Memory extraction on rooted devices'],
          ['SELinux', 'Mandatory access control for processes', 'Kernel exploits, known CVEs'],
          ['App signing', 'APK must be signed to install', 'Install unsigned via ADB or resigned APK'],
          ['Play Protect', 'Google malware scanning', 'Sideloaded apps bypass Play Protect'],
          ['SafetyNet/Play Integrity', 'Device integrity attestation', 'Root cloaking tools (Magisk, MagiskHide)'],
        ]}
      />

      <H2>02 — Static Analysis (APK)</H2>
      <P>Static analysis means examining the app without running it — reading the code, configurations, and resources. This is where most obvious vulnerabilities are found: hardcoded API keys, cleartext HTTP URLs, debug flags left on, and exported components that bypass authentication.</P>

      <Pre label="// COMPLETE APK STATIC ANALYSIS WORKFLOW">{`# Step 1: Download APK from device or APKPure/APKMirror
adb shell pm list packages -f | grep "target"  # find package path
adb pull /data/app/com.target.app/base.apk .   # pull from device

# Step 2: Decompile with apktool (get resources + smali):
sudo apt install apktool
apktool d target.apk -o target_decoded/
# Smali = human-readable Dalvik bytecode (assembly-level)
# AndroidManifest.xml decoded to readable XML

# Step 3: Decompile to Java with jadx (more readable):
# Download: https://github.com/skylot/jadx/releases
jadx target.apk -d target_java/
jadx-gui target.apk  # graphical interface, easier to navigate

# Step 4: Hunt for secrets:
grep -r "api_key\|apikey\|secret\|password\|token\|AWS\|AKIA" target_decoded/ 2>/dev/null
grep -r "http://" target_decoded/    # cleartext HTTP endpoints
grep -r "firebase\|amazonaws\|azure\|supabase" target_decoded/
grep -r "private_key\|private key\|-----BEGIN" target_decoded/
# Check strings.xml:
cat target_decoded/res/values/strings.xml | grep -i "key\|secret\|pass\|token"
# Check assets folder:
find target_decoded/assets/ -type f -exec strings {} \; | grep -iE "http|key|pass|secret"

# Step 5: Check AndroidManifest.xml:
cat target_decoded/AndroidManifest.xml
# Critical findings:
# android:exported="true"       → component accessible from other apps or ADB
# android:debuggable="true"     → attach debugger in production — serious
# android:allowBackup="true"    → adb backup can dump all app data
# android:networkSecurityConfig → custom cert rules (or lack thereof)
# Uses permissions: READ_CONTACTS, RECORD_AUDIO, SEND_SMS — justify each

# Step 6: Check network security config:
cat target_decoded/res/xml/network_security_config.xml
# cleartextTrafficPermitted="true" → HTTP allowed → intercept easily

# Step 7: Automated analysis with MobSF:
docker pull opensecurity/mobile-security-framework-mobsf
docker run -it --rm -p 8000:8000 opensecurity/mobile-security-framework-mobsf:latest
# Visit http://localhost:8000
# Upload APK → comprehensive automated analysis:
# Hardcoded secrets, permission analysis, code issues, network calls, CVSS score`}</Pre>

      <H3>Native Library Analysis</H3>
      <Pre label="// ANALYSE .SO FILES IN APK">{`# Native libraries in lib/ may contain secrets or vulnerabilities
# They are compiled ARM/x86 binaries — need to disassemble

# Strings in native lib:
strings target_decoded/lib/arm64-v8a/libnative.so | grep -iE "key|secret|pass|http"

# Disassemble with Ghidra or radare2:
r2 -A target_decoded/lib/arm64-v8a/libnative.so
# afl   → list all functions
# pdf @ sym.Java_com_target_Native_getKey  → disassemble JNI function

# With Ghidra:
# Import the .so file → auto-analyse → decompile JNI functions
# JNI functions are named: Java_packagename_classname_methodname`}</Pre>

      <H2>03 — Dynamic Analysis with ADB</H2>
      <P>ADB (Android Debug Bridge) is a command-line tool that lets you communicate with an Android device or emulator. For security testing, it lets you install apps, execute shell commands, interact with the filesystem, monitor logs in real-time, and start activities directly — bypassing any in-app authentication flows.</P>
      <Note>A key insight in Android security: activities (screens) in an app can be started directly from the command line with ADB if they are exported. If the developer forgot to add permission checks to an admin screen and left it exported, you can jump directly to it, completely bypassing the login screen entirely. This requires no special privileges — just USB access to the device.</Note>

      <Pre label="// ADB SECURITY TESTING COMMANDS">{`# Enable USB debugging: Settings → Developer Options → USB debugging
sudo apt install adb
adb devices  # list connected devices (authorize on device if prompted)

# Install APK:
adb install target.apk
adb install -r target.apk  # reinstall preserving data

# Launch specific activity (bypass login screens):
adb shell am start -n com.target.app/.MainActivity
adb shell am start -n com.target.app/.AdminPanel  # exported admin screen
# With extras (deep link style):
adb shell am start -n com.target.app/.DeepLinkActivity -d "app://internal/admin"

# Send intents to exported broadcast receivers:
adb shell am broadcast -a com.target.ADMIN_ACTION
adb shell am broadcast -a com.target.RESET_PASSWORD --es email "admin@test.com"

# Monitor logs in real-time (treasure trove):
adb logcat -v brief | grep -i "com.target.app"
adb logcat | grep -iE "password|token|auth|error|exception|credential"
# Many apps log sensitive data in debug builds

# File system access (rooted device needed for /data):
adb shell
su  # escalate to root

# App's private storage:
ls /data/data/com.target.app/
ls /data/data/com.target.app/shared_prefs/    # often contains tokens
ls /data/data/com.target.app/databases/       # SQLite databases
ls /data/data/com.target.app/files/

# Read SharedPreferences (often stores auth tokens):
cat /data/data/com.target.app/shared_prefs/auth_prefs.xml
cat /data/data/com.target.app/shared_prefs/*.xml

# Query SQLite database:
sqlite3 /data/data/com.target.app/databases/app.db ".tables"
sqlite3 /data/data/com.target.app/databases/app.db "SELECT * FROM users;"
sqlite3 /data/data/com.target.app/databases/app.db "SELECT * FROM sessions;"

# Pull all app data:
adb backup -noapk com.target.app
# Convert: java -jar android-backup-extractor.jar backup.ab backup.tar
# Extract: tar xf backup.tar

# Monkey testing (automated random input):
adb shell monkey -p com.target.app -v 1000  # 1000 random events
# Useful for crashing apps and finding unexpected states`}</Pre>

      <H2>04 — Frida — Dynamic Instrumentation</H2>
      <Note>Frida works by injecting a JavaScript runtime into a running process. Your scripts can then hook any function — intercepting calls, reading arguments, changing return values, or logging behaviour. This is how SSL pinning is bypassed: you hook the certificate validation function and make it always return valid, regardless of the actual certificate. It is one of the most powerful security research tools available.</Note>

      <Pre label="// FRIDA SETUP AND CORE USAGE">{`# Install Frida tools:
pip install frida-tools

# On Android device (must be rooted):
# Find your device arch: adb shell getprop ro.product.cpu.abi
# Download matching frida-server from: https://github.com/frida/frida/releases
# Example: frida-server-16.x.x-android-arm64
adb push frida-server /data/local/tmp/frida-server
adb shell chmod 755 /data/local/tmp/frida-server
adb shell /data/local/tmp/frida-server &

# List running processes:
frida-ps -U  # USB device
frida-ps -U | grep "target"  # find your app's name

# Attach to running app:
frida -U -n "App Name" -l script.js
# Or by package name:
frida -U -f com.target.app -l script.js  # spawn fresh

# Essential Frida script patterns:

// 1. Hook a method and bypass auth:
Java.perform(function() {
  var AuthManager = Java.use('com.target.app.AuthManager');
  AuthManager.isLoggedIn.implementation = function() {
    console.log('[*] isLoggedIn() bypassed → returning true');
    return true;
  };
});

// 2. Log method arguments and return value:
Java.perform(function() {
  var CryptoHelper = Java.use('com.target.app.CryptoHelper');
  CryptoHelper.encrypt.implementation = function(plaintext) {
    console.log('[*] encrypt() called with: ' + plaintext);
    var result = this.encrypt(plaintext);
    console.log('[*] encrypt() returned: ' + result);
    return result;
  };
});

// 3. Bypass root detection:
Java.perform(function() {
  ['isRooted', 'detectRootManagementApps', 'detectPotentiallyDangerousApps',
   'detectRootCloakingApps', 'checkForBusyBoxBinaries'].forEach(function(method) {
    try {
      var RootBeer = Java.use('com.scottyab.rootbeer.RootBeer');
      RootBeer[method].implementation = function() { return false; };
    } catch(e) {}
  });
});

// 4. Log all network requests (OkHttp):
Java.perform(function() {
  var OkHttpClient = Java.use('okhttp3.OkHttpClient');
  var Interceptor = Java.use('okhttp3.Interceptor');
  // Hook proceed method → log request/response
});`}</Pre>

      <H3>Frida for Crypto Analysis</H3>
      <Pre label="// INTERCEPT ENCRYPTION OPERATIONS">{`# crypto_logger.js — log all Android crypto operations
Java.perform(function() {

  // Hook SecretKeySpec (symmetric key creation)
  var SecretKeySpec = Java.use('javax.crypto.spec.SecretKeySpec');
  SecretKeySpec.$init.overload('[B', 'java.lang.String').implementation = function(key, algo) {
    console.log('[CRYPTO] New ' + algo + ' key: ' + bytesToHex(key));
    return this.$init(key, algo);
  };

  // Hook Cipher.doFinal (actual encryption/decryption)
  var Cipher = Java.use('javax.crypto.Cipher');
  Cipher.doFinal.overload('[B').implementation = function(input) {
    console.log('[CIPHER] ' + this.getAlgorithm() + ' input: ' + bytesToHex(input));
    var output = this.doFinal(input);
    console.log('[CIPHER] output: ' + bytesToHex(output));
    return output;
  };

  function bytesToHex(bytes) {
    return Array.from(bytes).map(b => ('0' + (b & 0xFF).toString(16)).slice(-2)).join('');
  }
});

# Run it:
frida -U com.target.app -l crypto_logger.js
# All encryption/decryption now logged to console`}</Pre>

      <H2>05 — SSL Pinning Bypass</H2>
      <P>SSL pinning is an app-level defense that validates not just that a certificate is valid, but that it matches a specific expected certificate or key hash. It prevents proxy interception even if you install a custom CA certificate on the device. Bypassing it is almost always the first step in any serious mobile app penetration test.</P>

      <Pre label="// SSL PINNING BYPASS — ALL METHODS">{`# First: set up Burp Suite as proxy:
# Burp → Proxy → Options → Add listener → all interfaces, port 8080
# On Android: WiFi → long press → Modify network → Advanced → Manual proxy
# Enter your machine IP:8080
# Install Burp cert: http://burpsuite (from device browser) → install as CA

# For apps WITH SSL pinning → still get SSL error → need to bypass

# METHOD 1: Objection (easiest, Frida-based):
pip install objection
objection -g com.target.app explore
# In objection shell:
android sslpinning disable
# This hooks most common pinning implementations automatically

# METHOD 2: Frida universal unpinner:
# Download: https://github.com/httptoolkit/frida-android-unpinning
frida -U com.target.app -l ./frida-android-unpinning.js
# Hooks: OkHttp, Retrofit, Conscrypt, Android TrustManager, etc.

# METHOD 3: Xposed Framework + TrustMeAlready / SSLUnpinning:
# Install Xposed + module on rooted device
# Module hooks SSL validation system-wide
# No frida needed, persists across app restarts

# METHOD 4: Patch APK (works on non-rooted devices):
# Decompile APK:
apktool d target.apk
# Find SSL pinning code in smali files:
grep -r "CertificatePinner\|TrustManager\|checkServerTrusted" target/smali/ -l
# Edit smali to remove/NOP the check
# Recompile:
apktool b target/ -o patched.apk
# Sign (required to install):
java -jar uber-apk-signer.jar -a patched.apk
# Install:
adb install patched-aligned-signed.apk

# METHOD 5: Network Security Config override:
# Add to AndroidManifest.xml: android:networkSecurityConfig="@xml/nsc"
# Create res/xml/network_security_config.xml:
echo '<network-security-config>
  <base-config cleartextTrafficPermitted="true">
    <trust-anchors>
      <certificates src="system"/>
      <certificates src="user"/>
    </trust-anchors>
  </base-config>
</network-security-config>' > target_decoded/res/xml/network_security_config.xml
# Recompile and sign`}</Pre>

      <H2>06 — Drozer — Android Framework Testing</H2>
      <Pre label="// SYSTEMATIC ANDROID COMPONENT TESTING">{`# Drozer tests ALL exported components comprehensively
# Setup:
pip install drozer
# Install drozer-agent.apk on Android device
adb install drozer-agent.apk
# Enable agent, then forward port:
adb forward tcp:31415 tcp:31415
drozer console connect

# === IN DROZER CONSOLE ===

# List all packages:
run app.package.list -f "target"

# Get package info:
run app.package.info -a com.target.app

# Find complete attack surface:
run app.package.attacksurface com.target.app
# Output shows: N activities exported, N services exported, N providers, N receivers

# === ACTIVITIES ===
run app.activity.info -a com.target.app
# List all exported activities

# Start exported activity directly (bypass auth):
run app.activity.start --component com.target.app com.target.app.AdminActivity

# === CONTENT PROVIDERS ===
run app.provider.info -a com.target.app
# List all providers and their URIs

# Query provider:
run app.provider.query content://com.target.app.provider/users
# SQL injection test:
run app.provider.query content://com.target.app.provider/users \
  --selection "1=1--"
run app.provider.query content://com.target.app.provider/users \
  --projection "* FROM users--"
# Path traversal:
run app.provider.read content://com.target.app.fileprovider/../../../../etc/passwd

# === BROADCAST RECEIVERS ===
run app.broadcast.info -a com.target.app
run app.broadcast.send --action com.target.ADMIN_ACTION
run app.broadcast.send --action com.target.RESET --es email "test@test.com"

# === SERVICES ===
run app.service.info -a com.target.app
run app.service.start --action com.target.BACKGROUND_SERVICE \
  --component com.target.app com.target.app.AdminService`}</Pre>

      <H2>07 — iOS Security Architecture</H2>
      <P>iOS has a fundamentally different security model from Android. The closed ecosystem, mandatory code signing, and App Store review create a harder baseline. But signed apps can still be vulnerable to the same logical flaws, insecure data storage, and network vulnerabilities as Android apps.</P>

      <Table
        headers={['LAYER', 'iOS MECHANISM', 'BYPASS/WEAKNESS']}
        rows={[
          ['Code signing', 'All code must be signed by Apple-issued cert', 'Jailbreak removes enforcement; enterprise certs can be abused'],
          ['App sandbox', 'Strict per-app isolation, no direct FS access', 'Jailbreak or iCloud backup extraction'],
          ['Secure Enclave', 'Hardware crypto for keys (Face/Touch ID)', 'Physical hardware attack; key extraction on very old devices'],
          ['ASLR + PIE', 'Randomised memory layout', 'Info leaks + ROP chains (kernel exploits)'],
          ['App Store review', 'Manual + automated malware scanning', 'Dynamic code loading, obfuscated behaviour, enterprise certs'],
          ['Data Protection', 'File encryption with device passcode', 'Accessible when device unlocked (most of the time)'],
        ]}
      />

      <Pre label="// iOS JAILBREAK AND SETUP">{`# Popular jailbreaks (version-dependent):
# checkra1n — iPhone X and older, permanent (exploit in bootrom)
# Palera1n — A8-A11 devices, iOS 15-17
# Dopamine — A12+ devices, iOS 15-16
# Check compatibility: canijailbreak.com

# After jailbreak — install research tools:
# Via Cydia/Sileo:
# OpenSSH — remote access
# Frida — dynamic instrumentation
# cycript — runtime manipulation (older, less maintained)
# A-Bypass — jailbreak detection bypass

# Connect via SSH:
ssh root@DEVICE_IP  # default password: alpine (CHANGE THIS)

# Frida on iOS (same API as Android):
# Install frida-server via Cydia/Sileo
# USB connection:
frida -U -n "AppName" -l script.js

# iOS-specific Frida hooks:
// Objective-C method hooking:
ObjC.schedule(ObjC.mainQueue, function() {
  var NSURLSession = ObjC.classes.NSURLSession;
  // Hook specific method
  Interceptor.attach(NSURLSession['- dataTaskWithRequest:completionHandler:'].implementation, {
    onEnter: function(args) {
      var request = ObjC.Object(args[2]);
      console.log('URL: ' + request.URL().absoluteString());
    }
  });
});`}</Pre>

      <H2>08 — iOS Static & Dynamic Analysis</H2>
      <Pre label="// IPA ANALYSIS">{`# IPA = iOS app archive (ZIP containing the app binary + resources)
# Extract:
unzip target.ipa -d target_ipa/
# Binary is in: Payload/AppName.app/AppName

# Strings in binary:
strings target_ipa/Payload/AppName.app/AppName | grep -iE "http|key|secret|pass"

# Class dump — extract Objective-C headers:
class-dump -H target_ipa/Payload/AppName.app/AppName -o headers/
# Shows all classes, methods, properties → understand app structure

# Swift decompilation:
# Swift binary: harder to decompile than ObjC (name mangling)
# Tool: ghidra (with Swift demangling scripts)
# Tool: retdec-decompiler for basic decompilation

# Automated analysis with MobSF (iOS):
# Same MobSF setup, upload IPA instead of APK
# Checks: binary protections, plist analysis, string extraction

# Binary protections check:
otool -Vh target_ipa/Payload/AppName.app/AppName
# Look for:
# PIE: DYLD_NO_PIE → PIE enabled is good
# Stack canary: __stack_chk_guard symbol
# ARC: automatic reference counting (memory safety)

# Check Info.plist for interesting data:
cat target_ipa/Payload/AppName.app/Info.plist
# Keys to look for:
# NSAllowsArbitraryLoads = true  → HTTP allowed
# ATS exceptions            → specific domain exemptions
# NSLocalNetworkUsageDescription, NSFaceIDUsageDescription
# Custom URL schemes → deep link attack surface`}</Pre>

      <H3>iOS Data Storage Locations</H3>
      <Pre label="// WHERE iOS APPS STORE DATA">{`# On jailbroken device or via iCloud backup:
# App sandbox: /var/mobile/Containers/Data/Application/[UUID]/

# Keychain (most secure, but misconfigured accessibility = readable):
# Tool: keychain-dumper
./keychain-dumper
# Shows all keychain items accessible to tools running as root

# NSUserDefaults (plist, often stores tokens):
cat Library/Preferences/com.target.app.plist

# SQLite databases:
find . -name "*.sqlite" -o -name "*.db"
sqlite3 Library/Application\ Support/app.sqlite ".tables"

# Core Data (ORM on top of SQLite):
# Same location as SQLite, .sqlite extension

# Cache files:
ls Library/Caches/
# URL cache: may contain intercepted network responses with sensitive data

# Logs (often verbose in dev builds):
ls Library/Logs/

# Photos, documents, pasteboard:
# Check if app reads pasteboard on launch (clipboard hijacking)
# iOS pasteboard is accessible to all apps → passwords copied = exposed

# iCloud backup extraction (without jailbreak):
# If app allows backup (default) → iTunes/iMazing can extract app data
# iMazing: commercial tool, extracts per-app data from backup
# libimobiledevice: open-source, requires USB`}</Pre>

      <H2>09 — Network Traffic Interception (Both Platforms)</H2>
      <Pre label="// FULL MITM SETUP FOR MOBILE APPS">{`# Prerequisites:
# - Burp Suite (Community or Pro)
# - Device and laptop on same WiFi network
# - OR Android emulator (easier proxy setup)

# === ANDROID SETUP ===
# 1. Configure Burp listener: Proxy → Options → 0.0.0.0:8080
# 2. WiFi proxy on device: Settings → WiFi → [network] → Proxy → Manual
#    Host: your laptop IP, Port: 8080
# 3. Install Burp CA cert:
#    Visit http://burpsuite on device browser → install cert
#    Settings → Security → Install from storage
# 4. For Android 7+: user certs no longer trusted by default
#    Either: patch apk (add network_security_config), or use rooted device
#    On rooted: move cert to system store:
adb push cacert.der /system/etc/security/cacerts/
adb shell chmod 644 /system/etc/security/cacerts/cacert.der

# === iOS SETUP ===
# 1. Same Burp listener setup
# 2. WiFi proxy on iPhone: WiFi → [network] → Configure Proxy → Manual
# 3. Install Burp CA: visit http://your-ip:8080 on Safari → install profile
#    Settings → General → VPN & Device Management → install
#    Settings → General → About → Certificate Trust Settings → trust it

# === ANDROID EMULATOR (simplest) ===
# Android Studio emulator with proxy flag:
emulator -avd Pixel_6 -http-proxy localhost:8080
# All traffic automatically through Burp

# Useful Burp extensions for mobile:
# - Autorize: tests IDOR/access control automatically
# - JSON Web Tokens: decode and attack JWT tokens
# - Active Scan++: enhanced scanning rules
# - Upload Scanner: test file upload endpoints`}</Pre>

      <H2>10 — Mobile Application Pentest Methodology</H2>
      <Pre label="// STRUCTURED MOBILE PENTEST PROCESS">{`# Phase 1: RECON & SETUP (30 min)
# ✓ Download APK/IPA — device or APKPure
# ✓ Identify: app name, version, package ID, permissions
# ✓ Set up proxy, install CA cert
# ✓ Set up MobSF for automated analysis

# Phase 2: STATIC ANALYSIS (1-2 hours)
# ✓ MobSF automated scan → review findings
# ✓ jadx decompile → search for hardcoded secrets
# ✓ AndroidManifest.xml → exported components, permissions
# ✓ Strings search → API keys, URLs, credentials
# ✓ Check: HTTP vs HTTPS endpoints in code
# ✓ Review authentication logic (is it client-side?)
# ✓ Review cryptographic primitives (weak algos?)

# Phase 3: DYNAMIC ANALYSIS (2-3 hours)
# ✓ Proxy traffic → Burp → review all requests/responses
# ✓ Try SSL pinning bypass (objection/frida unpinner)
# ✓ ADB logcat → monitor for sensitive data in logs
# ✓ Launch exported activities → bypass auth if possible
# ✓ Check data storage: prefs, databases, files
# ✓ Drozer attack surface scan → test all components

# Phase 4: API TESTING (1-2 hours)
# ✓ Map all API endpoints from traffic capture
# ✓ Test authentication: no token, expired token, other user's token
# ✓ Test authorisation: IDOR — change user IDs in requests
# ✓ Test input validation: SQLi, XSS in WebView, command injection
# ✓ Test rate limiting on auth endpoints

# Phase 5: ADVANCED (as time allows)
# ✓ Frida hooks → bypass specific checks
# ✓ Decompile native libraries → look for memory safety issues
# ✓ Third-party SDK analysis
# ✓ Backend infrastructure recon from API responses

# Phase 6: REPORTING
# ✓ Document each finding: title, severity, CWE, steps to reproduce, impact, fix
# ✓ Map to OWASP Mobile Top 10
# ✓ Screenshot or video PoC for each issue`}</Pre>

      <H2>11 — OWASP Mobile Top 10 (2024)</H2>
      <Table
        headers={['RANK', 'CATEGORY', 'EXAMPLE', 'TEST METHOD']}
        rows={[
          ['M1', 'Improper Credential Usage', 'Hardcoded API keys, credentials in URLs, weak encryption', 'Static analysis, strings search'],
          ['M2', 'Inadequate Supply Chain Security', 'Vulnerable SDKs, malicious dependencies', 'Dependency audit, version checks'],
          ['M3', 'Insecure Authentication/Authorization', 'Client-side auth checks, missing endpoint auth', 'Frida bypass, IDOR in APIs, drozer'],
          ['M4', 'Insufficient Input/Output Validation', 'SQLi in local DB, XSS in WebView, path traversal', 'Drozer provider queries, proxy testing'],
          ['M5', 'Insecure Communication', 'HTTP, no cert validation, weak TLS', 'Proxy interception, SSL bypass'],
          ['M6', 'Inadequate Privacy Controls', 'Excessive permissions, sensitive data in logs', 'logcat analysis, permission audit'],
          ['M7', 'Insufficient Binary Protections', 'No obfuscation, debuggable production build', 'apktool manifest check, jadx analysis'],
          ['M8', 'Security Misconfiguration', 'Exported components, open Firebase, debug mode', 'Drozer, AndroidManifest review, Firebase check'],
          ['M9', 'Insecure Data Storage', 'Cleartext in SharedPrefs, unencrypted SQLite', 'ADB file system analysis, backup extraction'],
          ['M10', 'Insufficient Cryptography', 'MD5/SHA1 for passwords, ECB mode, hardcoded keys', 'Static analysis, Frida crypto logger'],
        ]}
      />

      <H2>12 — Mobile Malware Analysis</H2>
      <P>Android malware analysis follows the same principles as desktop malware — static analysis to understand structure, dynamic analysis to observe behaviour. The open Android ecosystem means malware APKs are readily available for research, and analysis tools are the same jadx/MobSF/Frida stack used for legitimate app testing.</P>

      <Pre label="// ANDROID MALWARE INDICATORS">{`# Common Android malware capabilities and their indicators:

# Banking Trojan / Overlay Attack:
# → Draws fake login screen over legitimate bank app
# → android.permission.SYSTEM_ALERT_WINDOW
# → AccessibilityService abuse for keylogging
# → Code: WindowManager.addView() with TYPE_SYSTEM_OVERLAY
# Examples: Anubis, Cerberus, Hydra

# SMS Stealer:
# → Intercepts 2FA codes for account takeover
# → android.permission.RECEIVE_SMS + READ_SMS
# → Silently forwards incoming SMS to C2
# Examples: FluBot, MoqHao

# Spyware/Stalkerware:
# → Location tracking, call recording, microphone access
# → android.permission.ACCESS_FINE_LOCATION + RECORD_AUDIO
# → Usually disguised as parental control or device tracker
# → Hides from launcher (android:name hidden from app list)

# RAT (Remote Access Trojan):
# → Full device control, camera, mic, files, SMS, calls
# → android.permission.CAMERA + RECORD_AUDIO + READ_CONTACTS
# → AhMyth, SpyNote RAT families

# Cryptominer:
# → Runs XMRig or similar in background
# → High CPU usage, battery drain
# → Often bundled with legitimate apps
# → android.permission.RECEIVE_BOOT_COMPLETED (persistence)

# Detection approach:
# 1. Hash → MalwareBazaar / VirusTotal
# 2. MobSF static → finds malicious permissions, behaviours
# 3. Sandbox: Any.run Android or Joe Sandbox Android
# 4. Dynamic: Frida hooks → observe actual runtime behaviour
# 5. Network: capture traffic → find C2 server
# 6. YARA rules for mobile:
#    rules targeting smali patterns, known malware strings`}</Pre>

      <H2>13 — Tools Reference</H2>
      <Table
        headers={['TOOL', 'PLATFORM', 'PURPOSE', 'INSTALL']}
        rows={[
          ['jadx', 'Android', 'Decompile APK to Java/Kotlin', 'github.com/skylot/jadx'],
          ['apktool', 'Android', 'Decode/rebuild APK, get smali', 'apt install apktool'],
          ['MobSF', 'Android/iOS', 'Automated static + dynamic analysis', 'docker pull opensecurity/mobsf'],
          ['Frida', 'Android/iOS', 'Dynamic instrumentation, runtime hooking', 'pip install frida-tools'],
          ['Objection', 'Android/iOS', 'Frida wrapper, SSL bypass, runtime exploration', 'pip install objection'],
          ['Drozer', 'Android', 'Android component security testing', 'pip install drozer'],
          ['ADB', 'Android', 'Device communication, shell access', 'apt install adb'],
          ['Burp Suite', 'Both', 'HTTP proxy, API testing', 'portswigger.net/burp'],
          ['class-dump', 'iOS', 'Extract ObjC class headers from binary', 'brew install class-dump'],
          ['iMazing', 'iOS', 'iCloud/iTunes backup extraction', 'imazing.com (commercial)'],
          ['Cycript', 'iOS', 'Runtime manipulation (Obj-C/JS hybrid)', 'Cydia/Sileo on jailbroken'],
          ['checkra1n/palera1n', 'iOS', 'Jailbreak tools', 'checkra1n.com'],
          ['Ghidra', 'Both', 'Disassemble native .so/.dylib libraries', 'ghidra-sre.org'],
          ['apkleaks', 'Android', 'Fast secret/URL/token scanner for APKs', 'pip install apkleaks'],
        ]}
      />

      <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid #1a2e1e' }}>
        <div style={{ background: 'rgba(124,77,255,0.04)', border: '1px solid rgba(124,77,255,0.2)', borderRadius: '8px', padding: '2rem', textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#2a1a4a', letterSpacing: '0.25em', marginBottom: '0.5rem' }}>READY TO PRACTICE?</div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1rem', color: '#7c4dff', marginBottom: '0.5rem', fontWeight: 600 }}>MOD-13 Interactive Lab</div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#5a7a5a', marginBottom: '1.5rem' }}>5 steps &middot; 130 XP &middot; Real commands &middot; Flag captures</div>
          <Link href="/modules/mobile-security/lab" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', color: '#7c4dff', padding: '12px 32px', border: '1px solid rgba(124,77,255,0.6)', borderRadius: '6px', background: 'rgba(124,77,255,0.1)', fontWeight: 700, letterSpacing: '0.12em', boxShadow: '0 0 20px rgba(124,77,255,0.15)', display: 'inline-block' }}>
            LAUNCH LAB &#8594;
          </Link>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Link href="/modules/wireless-attacks" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#3a6a3a' }}>&#8592; MOD-12: WIRELESS ATTACKS</Link>
          <Link href="/" style={{ textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#3a6a3a' }}>&#8592; BACK TO DASHBOARD</Link>
        </div>
      </div>
    </div>
  )
}
