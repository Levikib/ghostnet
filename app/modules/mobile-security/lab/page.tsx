'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import LabTerminal, { LabStep } from '../../../components/LabTerminal'
import FreeLabTerminal from '../../../components/FreeLabTerminal'

const accent = '#7c4dff'
const moduleId = 'mobile-security'
const moduleName = 'Mobile Security'
const moduleNum = '13'

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
    hint: 'The command is "adb shell" - simple and direct.',
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
  },
  {
    id: 'mobile-06',
    title: 'Android Intent Exploitation',
    objective: 'An exported Activity has no permission check. What ADB command launches an arbitrary Activity on a connected device?',
    hint: 'Use adb shell with the am (Activity Manager) tool. The -n flag specifies the component as package/class.',
    answers: [
      'adb shell am start -n com.package/.ActivityName',
      'am start -n',
      'adb shell am start'
    ],
    xp: 20,
    explanation: 'am start -n com.package/.ActivityName launches Android activities directly from the shell or via ADB. When an Activity is declared with android:exported="true" and has no android:permission attribute in AndroidManifest.xml, any app on the device - or an attacker with ADB access - can invoke it directly, bypassing authentication flows. This is a common misconfiguration that exposes password reset screens, admin panels, and deep link handlers. Beyond activities: am broadcast -a com.package.ACTION sends intents to exported broadcast receivers (useful for triggering hidden functionality). Content provider attacks use adb shell content query --uri content://com.package.provider/data to read provider data without going through the app UI. Drozer automates intent fuzzing: run app.activity.start --component com.package .ActivityName and scanner.activity.browsable to map all exported and browsable attack surface systematically.'
  },
  {
    id: 'mobile-07',
    title: 'Traffic Interception',
    objective: 'Intercept HTTPS traffic from a mobile app using Burp Suite as a proxy. What must you install on the device to trust Burp\'s certificate?',
    hint: 'Burp Suite acts as a man-in-the-middle and presents its own certificate. The device must trust it at the system level.',
    answers: [
      'burp ca certificate',
      'ca certificate',
      'burp certificate',
      'system certificate'
    ],
    xp: 20,
    explanation: 'Burp Suite intercepts HTTPS by presenting its own CA certificate to the client. Android 7 (Nougat) and above introduced a change where apps no longer trust user-installed CA certificates by default - only system CAs are trusted. This means simply installing Burp\'s cert to the user store no longer works for most modern apps. To bypass this: on rooted devices, push the cert as a system CA with adb push burp.cer /system/etc/security/cacerts/ (requires remounting /system as writable). Alternatively, decompile the APK with apktool, add a network_security_config.xml that trusts user CAs, repack and reinstall with apktool b and apksigner. The Magisk module MagiskTrustUserCerts automates the system cert installation on rooted devices. Some apps add additional certificate pinning on top of this - those require Frida or Objection bypass as a separate step.'
  },
  {
    id: 'mobile-08',
    title: 'Binary Protections Analysis',
    objective: 'Check what binary protections are enabled on an iOS binary. What tool checks for PIE, stack canary, ARC, and binary encryption in iOS apps?',
    hint: 'A standard macOS/iOS toolchain utility. Also used with the -l flag to inspect load commands.',
    answers: [
      'otool',
      'checksec',
      'class-dump',
      'otool -vh',
      'otool -l'
    ],
    flag: 'FLAG{binary_protections_audited}',
    xp: 25,
    explanation: 'otool is the macOS/iOS object file analysis tool. otool -vh BINARY shows the Mach-O header and whether PIE (Position Independent Executable) is enabled - without PIE, memory addresses are predictable making ROP chain construction easier. otool -l BINARY | grep crypt checks the LC_ENCRYPTION_INFO load command: cryptid 1 means the binary is FairPlay-encrypted (App Store build), cryptid 0 means it is decrypted (already dumped or sideloaded). checksec --file BINARY reports all protections in a structured format including PIE, stack canary, ARC, and RELRO. Missing stack canary means a stack buffer overflow can directly control the return address. Missing ARC (Automatic Reference Counting) leaves the binary vulnerable to manual memory management bugs. class-dump extracts all Objective-C class definitions, method signatures, and property lists from the binary - this is the starting point for understanding an app\'s internal architecture without source code.'
  },
  {
    id: 'mobile-09',
    title: 'Deep Link Hijacking',
    objective: 'Android apps register URL schemes as deep links. What Android file declares which URL schemes an app handles?',
    hint: 'This XML configuration file at the root of every Android app declares all app components, permissions, and intent filters.',
    answers: [
      'androidmanifest.xml',
      'androidmanifest',
      'manifest.xml'
    ],
    xp: 20,
    explanation: 'AndroidManifest.xml contains intent-filter declarations that register URL schemes as deep links. An Activity with action android.intent.action.VIEW and a data element with scheme="myapp" will receive all myapp:// URLs opened on the device. The vulnerability: malicious apps can register identical URL schemes. On Android, the last installed app that handles a scheme wins (or the user is prompted to choose). Testing deep links directly: adb shell am start -a android.intent.action.VIEW -d "myapp://reset?token=TESTVALUE" sends a crafted deep link and observes how the app handles the parameters. Common vulnerabilities include parameter injection where the token parameter is used directly in a request without validation, CSRF where a deep link triggers an authenticated action without re-confirming identity, and path traversal in deep link handlers that load local files based on a path in the URL. Always check if deep link parameters flow into WebView.loadUrl() calls, which can lead to JavaScript injection.'
  },
  {
    id: 'mobile-10',
    title: 'OWASP Mobile Top 10',
    objective: 'What OWASP Mobile Top 10 category covers hardcoded credentials and insecure key storage in mobile apps?',
    hint: 'Look at M5 (Insufficient Cryptography) and M2 (Insecure Data Storage) - hardcoded keys and weak storage both appear in the top 10.',
    answers: [
      'm10',
      'insufficient cryptography',
      'm9',
      'insecure data storage',
      'm2'
    ],
    flag: 'FLAG{mobile_owasp_complete}',
    xp: 25,
    explanation: 'The OWASP Mobile Top 10 is the definitive taxonomy for mobile application vulnerabilities. M1 Improper Platform Usage - misusing platform APIs or permissions. M2 Insecure Data Storage - sensitive data in SharedPreferences, SQLite databases, external storage, log files, or temp files without encryption. M3 Insecure Communication - cleartext HTTP, improper TLS validation, weak cipher suites. M4 Insecure Authentication - broken session handling, weak PIN policies, missing biometric protection. M5 Insufficient Cryptography - hardcoded encryption keys in source code or resources, use of deprecated algorithms like DES or MD5 for sensitive data. M6 Insecure Authorization - failing to verify permissions server-side, relying only on client-side checks. M7 Client Code Quality - buffer overflows, format string bugs, memory leaks in native code. M8 Code Tampering - missing root and tamper detection, unsigned update mechanisms. M9 Reverse Engineering - missing obfuscation, debug symbols left in release builds, easy class-dump extraction. M10 Extraneous Functionality - hidden debug backdoors, test credentials, admin endpoints left in production builds. Primary testing tools: MobSF (automated static and dynamic analysis), AndroBugs (Android-specific issue scanner), QARK (source code and APK analysis), and Drozer (runtime exploitation framework).'
  },
  {
    id: 'mobile-11',
    title: 'Android Root Detection Bypass',
    objective: 'Banking apps detect rooted devices and refuse to run. What Frida/Objection command disables root detection checks at runtime?',
    hint: 'Use Objection after attaching to the target process. The command namespace is "android root".',
    answers: ['android root disable', 'objection android root disable', 'frida rootdetection'],
    xp: 25,
    explanation: 'objection -g com.target.app explore then "android root disable" patches common root detection methods at runtime. What gets bypassed: su binary existence checks, Superuser.apk/SuperSU package detection, build.prop ro.build.tags=test-keys check, /system/xbin/su path check, native library checks. Manual Frida script: Java.perform to hook RootBeer.isRooted() and return false. MagiskHide (older Magisk) hides root from specific apps. Zygisk DenyList is the modern equivalent. SafetyNet/Play Integrity API: hardware-backed attestation is harder to bypass and requires leaked device keys or a modified OS. Practical use: testing banking apps, MDM bypass, game anti-cheat research. Detection note: some apps use native code for root detection and require Frida native hooks with Interceptor.attach().'
  },
  {
    id: 'mobile-12',
    title: 'Android Content Provider Exploitation',
    objective: 'An exported content provider exposes user data without access controls. What ADB command queries a content provider URI to extract its data?',
    hint: 'Use "adb shell content query" with the --uri flag followed by the content:// URI.',
    answers: ['adb shell content query --uri', 'content query --uri', 'adb shell content query'],
    xp: 20,
    explanation: 'adb shell content query --uri content://com.target.app.provider/users returns all rows. Insert: adb shell content insert --uri content://PROVIDER/table --bind column:s:value. Update: content update --uri content://PROVIDER/table --bind col:s:newval. Delete: content delete --uri content://PROVIDER/table --where "id=1". Finding providers: aapt dump xmltree app.apk AndroidManifest.xml | grep provider, or use jadx and search for ContentProvider subclasses. SQL injection via content URI: content query --uri with a crafted --where clause - if the provider builds raw SQL queries. Drozer automation: run app.provider.info -a com.target.app, run app.provider.query content://PROVIDER/table, run scanner.provider.injection for automated SQLi scanning. Real finding: many older Android apps expose SMS, call logs, and contacts via misconfigured providers.'
  },
  {
    id: 'mobile-13',
    title: 'iOS Jailbreak Detection Bypass',
    objective: 'What Frida script bypasses common iOS jailbreak detection checks by hooking NSFileManager and returning false for sensitive path existence checks?',
    hint: 'Objection has a built-in command under the "ios jailbreak" namespace.',
    answers: ['frida jailbreak bypass', 'ios jailbreak disable', 'objection ios jailbreak disable', 'android jailbreak disable'],
    xp: 25,
    explanation: 'objection -g com.target.app explore then "ios jailbreak disable" hooks common detection methods. What it patches: [NSFileManager fileExistsAtPath:] for /Applications/Cydia.app, /bin/bash, /usr/sbin/sshd, /etc/apt. fork() return value (jailed apps cannot fork). system() call (should fail in a sandboxed app). String obfuscation bypass: apps encode paths as Base64 or build them dynamically, requiring a manual Frida script. iOS Integrity attestation: DeviceCheck API and App Attest use hardware keys and are extremely difficult to bypass without Apple signing keys. Manual hook example: ObjC.classes.NSFileManager["- fileExistsAtPath:"].implementation patched to return false for Cydia/substrate paths. Practical: testing mobile banking security controls, MDM compliance bypass research, game cheating analysis.'
  },
  {
    id: 'mobile-14',
    title: 'APK Repackaging - Patching and Resigning',
    objective: 'To inject a Frida gadget or modify app behavior permanently, you repackage the APK. What tool reassembles smali code back into a new APK after modification?',
    hint: 'The same tool used to disassemble the APK. Use the "b" (build) subcommand.',
    answers: ['apktool b', 'apktool build', 'apktool b app/', 'apktool'],
    flag: 'FLAG{apk_repackaged}',
    xp: 25,
    explanation: 'Full repackaging workflow: 1) Disassemble: apktool d app.apk -o app/. 2) Modify smali code or resources. 3) Reassemble: apktool b app/ -o app_patched.apk. 4) Generate keystore: keytool -genkey -v -keystore my.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias mykey. 5) Sign: jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my.keystore app_patched.apk mykey. 6) Zipalign: zipalign -v 4 app_patched.apk app_final.apk. 7) Install: adb install app_final.apk. What to inject: Frida gadget (libfrida-gadget.so in lib/arm64-v8a/, gadget config JSON, load call in smali). Certificate pinning removal: find OkHttp/TrustManager smali, patch return-void or return true. Network security config: modify res/xml/network_security_config.xml to allow all traffic. Tamper detection: some apps check their own signature at runtime - patch the signature check too. APK signing scheme v2/v3: modern apps use v2+ signing that covers the whole file, requiring apksigner instead of jarsigner.'
  },
  {
    id: 'mobile-15',
    title: 'Mobile App Memory Analysis',
    objective: 'Frida can dump memory from a running app to extract secrets that are only present in RAM (decrypted keys, tokens, passwords). What Frida API reads a specific memory address range?',
    hint: 'The Frida Memory module has a readByteArray function. Process.enumerateRanges finds candidate regions first.',
    answers: ['Memory.readByteArray', 'Memory.readUtf8String', 'frida memory dump', 'Process.enumerateRanges'],
    xp: 25,
    explanation: 'Process.enumerateRanges("r--") lists all readable memory regions. Memory.readByteArray(ptr("ADDR_HERE"), 256) reads 256 bytes from an address. Full memory dump script: Process.enumerateRanges("r--").forEach iterating each region and calling Memory.readByteArray(r.base, r.size) inside a try/catch. Search for strings: grep through regions for "Bearer ", "password", "token". Fridump tool automates memory dumping. iOS: similar approach with ObjC runtime - [NSString stringValue] hooks capture decrypted strings as they are created. Practical findings: JWT tokens in memory after authentication, AES keys before encryption, username/password before sending to server, crypto material after TLS decryption. Android Keystore: keys stored in TEE (Trusted Execution Environment) cannot be extracted via memory - this is by design. Memory analysis complements static analysis and catches runtime-only secrets.'
  },
  {
    id: 'mobile-16',
    title: 'Android WebView Security Issues',
    objective: 'A WebView has JavaScript enabled and addJavascriptInterface() exposes a Java object to JavaScript. What is this vulnerability called that allows JavaScript to invoke Java methods?',
    hint: 'The name comes directly from the Android API method used to create the bridge between JavaScript and Java.',
    answers: ['javascript interface', 'addjavascriptinterface', 'java bridge', 'jsbridge', 'javascript bridge'],
    xp: 20,
    explanation: 'addJavascriptInterface(obj, "Android") makes obj accessible as window.Android in JavaScript. If JS can run arbitrary code (e.g., via XSS), it can call any public method. Pre-Android 4.2: ALL public methods are accessible including via reflection, giving full RCE. Post-Android 4.2: only @JavascriptInterface annotated methods are exposed. Exploitation: if WebView loads untrusted URLs or has XSS, inject a script tag calling Android.sensitiveMethod(). WebView misconfigurations: setAllowFileAccess(true) plus setJavaScriptEnabled(true) allows reading file:///data/data/com.app/shared_prefs/. setAllowUniversalAccessFromFileURLs(true) enables full cross-origin file read. DeepLink to WebView: an intent passes an attacker-controlled URL to WebView without validation. Testing: MSTG WebView checklist, check for file:// scheme handling, check addJavascriptInterface usage in jadx output. Defence: never load untrusted URLs in WebViews with sensitive interfaces, use WebViewClient.shouldOverrideUrlLoading() to validate all URLs.'
  },
  {
    id: 'mobile-17',
    title: 'iOS Keychain Security and Extraction',
    objective: 'On a jailbroken iOS device, what tool dumps all keychain items including passwords stored by apps?',
    hint: 'A standalone binary tool that runs on-device and uses entitlement wildcards to access all keychain items.',
    answers: ['keychain-dumper', 'keychaineditor', 'objection ios keychain dump', 'frida keychain'],
    xp: 25,
    explanation: 'keychain-dumper dumps all keychain items accessible with an entitlement wildcard. Objection: "ios keychain dump" hooks SecItemCopyMatching via Frida. What is stored in the keychain: passwords (kSecClassGenericPassword, kSecClassInternetPassword), certificates (kSecClassCertificate), cryptographic keys (kSecClassKey). Protection classes: kSecAttrAccessibleWhenUnlocked (accessible when device is unlocked), kSecAttrAccessibleAfterFirstUnlock (accessible after first unlock, survives reboot - a common mistake), kSecAttrAccessibleAlways (NEVER USE - accessible even when device is locked), kSecAttrAccessibleWhenUnlockedThisDeviceOnly (hardware-bound, not included in backups). Backup attack: items WITHOUT ThisDeviceOnly are included in iTunes backups and accessible via iMazing without jailbreak. Testing checklist: verify sensitive items use ThisDeviceOnly, verify correct accessibility level for each item type. Frida script: hook SecItemCopyMatching directly for non-jailbroken testing scenarios.'
  },
  {
    id: 'mobile-18',
    title: 'Mobile Pentest - Full Methodology',
    objective: 'What industry standard provides the most comprehensive mobile application security testing guide used by professional mobile pentesters?',
    hint: 'An OWASP project with both a testing guide (MSTG/MASTG) and a verification standard (MASVS).',
    answers: ['owasp mstg', 'mstg', 'mobile security testing guide', 'owasp mastg', 'mastg'],
    flag: 'FLAG{mobile_pentest_complete}',
    xp: 30,
    explanation: 'OWASP MASTG (Mobile Application Security Testing Guide) plus MASVS (Mobile Application Security Verification Standard) is the definitive reference for mobile security testing. MASVS levels: L1 (standard security), L2 (defence in depth), R (resiliency against reverse engineering). Full pentest workflow - STATIC ANALYSIS: 1) APK/IPA collection via gplaycli or ipatool. 2) Automated scan: MobSF upload, review findings. 3) Manual decompile: jadx (Android), Hopper/Ghidra (iOS). 4) Secrets search: grep for password, api_key, secret, token in decompiled output. 5) Manifest review: exported components, permissions, backup settings. DYNAMIC ANALYSIS: 1) Proxy setup: Burp plus device cert. 2) Launch app with Frida/Objection attached. 3) Walk all functionality, capture traffic. 4) Test authentication: session tokens, biometric bypass. 5) Test business logic: parameter tampering via Burp. REPORTING: Critical findings: hardcoded credentials, unencrypted sensitive data, authentication bypass. High: SSL pinning bypassable without jailbreak, exported components leaking data. Medium: weak crypto, insecure random. Low: missing certificate transparency, verbose errors. Tools summary: MobSF (static+dynamic), Frida (instrumentation), Objection (automation), Drozer (Android attack framework), Burp Suite (traffic), jadx (decompile), Ghidra (binary analysis), Corellium (cloud iOS/Android).'
  }
]

const xpTotal = steps.reduce((sum, s) => sum + s.xp, 0)

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
              {i === 0 && <span style={{ fontSize: '7px', color: '#1a0a3a', margin: '0 2px' }}>-</span>}
            </div>
          ))}
        </div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: '#4a3a8a' }}>
          MOD-{moduleNum} &nbsp;·&nbsp; {moduleName.toUpperCase()} &nbsp;·&nbsp; {xpTotal} XP AVAILABLE
        </div>
        {guidedDone && (
          <div style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: '7.5px', color: accent, fontWeight: 700 }}>
            &#10003; GUIDED PHASE COMPLETE - LAUNCH FREE LAB BELOW
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
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: '#2a1a5a', letterSpacing: '0.2em', marginBottom: '2px' }}>PHASE 1 - GUIDED LEARNING</div>
            <h1 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.4rem', fontWeight: 700, color: accent, margin: 0 }}>Mobile Security Lab</h1>
          </div>
        </div>

        <p style={{ color: '#6a5a8a', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: 1.7, fontFamily: 'JetBrains Mono, monospace' }}>
          APK decompilation, ADB shell, Frida instrumentation, SSL pinning bypass, iOS data storage, Android intent exploitation, traffic interception, binary protections, deep link hijacking, OWASP Mobile Top 10, root detection bypass, content provider attacks, jailbreak bypass, APK repackaging, memory analysis, WebView exploitation, iOS Keychain extraction, and full pentest methodology.
          Type real commands, earn XP, and capture flags. Complete all 18 steps to unlock Phase 2.
        </p>

        <div style={{ background: 'rgba(124,77,255,0.03)', border: '1px solid rgba(124,77,255,0.12)', borderRadius: '6px', padding: '1rem 1.25rem', marginBottom: '1.25rem', fontFamily: 'JetBrains Mono, monospace' }}>
          <div style={{ fontSize: '7px', color: '#1a0a3a', letterSpacing: '0.25em', marginBottom: '8px' }}>KEY CONCEPTS COVERED IN THIS LAB</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {['APK decompilation', 'Dalvik bytecode', 'ADB commands', 'Frida hooking', 'SSL pinning bypass', 'OWASP Mobile Top 10', 'iOS Keychain', 'Objection framework', 'Root detection bypass', 'Content providers', 'APK repackaging', 'Memory analysis', 'WebView security', 'MASTG methodology'].map(c => (
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
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: guidedDone ? '#4a3a8a' : '#2a1a5a', letterSpacing: '0.2em', marginBottom: '2px' }}>PHASE 2 - FREE LAB ENVIRONMENT</div>
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
            {!guidedDone && <div style={{ marginTop: '1rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '7px', color: '#1a0a3a' }}>Complete all 18 guided steps above to unlock the free lab environment</div>}
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
          {showKeywords ? '▼' : '▶'} QUICK REFERENCE - MOBILE SECURITY COMMANDS
        </button>
        {showKeywords && (
          <div style={{ background: '#040208', border: '1px solid #0d0520', borderRadius: '6px', padding: '1.25rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '8px' }}>
              {[
                ['jadx -d output/ app.apk', 'Decompile APK to Java source'],
                ['apktool d app.apk', 'Disassemble APK to smali'],
                ['apktool b app/ -o patched.apk', 'Reassemble modified APK'],
                ['adb devices', 'List connected Android devices'],
                ['adb shell pm list packages', 'List all installed apps'],
                ['adb shell pm dump com.target.app', 'Get app info and permissions'],
                ['adb shell am start -n com.app/.MainActivity', 'Launch a specific activity'],
                ['adb shell content query --uri content://PROVIDER/table', 'Query a content provider'],
                ['frida-ps -Ua', 'List all running apps (USB)'],
                ['frida -U -n "App Name" -l bypass-ssl.js', 'Attach Frida with SSL bypass script'],
                ['objection -g com.app explore', 'Start Objection interactive shell'],
                ['android sslpinning disable', 'Disable SSL pinning (in Objection)'],
                ['android root disable', 'Disable root detection (in Objection)'],
                ['ios jailbreak disable', 'Disable jailbreak detection (in Objection)'],
                ['ios keychain dump', 'Dump iOS keychain items (in Objection)'],
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
