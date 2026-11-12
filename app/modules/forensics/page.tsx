'use client'
import React from 'react'
import Link from 'next/link'
import ModuleCodex, { CodexChapter } from '@/app/components/ModuleCodex'
import { Local, Watch } from '@/app/components/learn/Mtaani'

const mono = 'JetBrains Mono, monospace'
const accent = '#5ccfe0'

// NOTE: Windows registry keys and file paths are shown with forward slashes inside
// code blocks. On a live Windows system they use backslashes; forward slashes are
// used here only so the paths render cleanly.

const Pre = ({ label, children }: { label?: string; children: string }) => (
  <div style={{ margin: '1rem 0 1.5rem' }}>
    {label && (
      <div style={{ fontFamily: mono, fontSize: '9px', color: '#5a8a92', letterSpacing: '0.15em', marginBottom: '4px', paddingLeft: '4px' }}>
        {label}
      </div>
    )}
    <pre style={{
      background: '#050a0c', border: '1px solid #16303a', borderRadius: '4px',
      padding: '1.25rem', overflow: 'auto', color: accent,
      fontFamily: mono, fontSize: '0.78rem', lineHeight: 1.7, whiteSpace: 'pre'
    }}>
      {children}
    </pre>
  </div>
)

const H3 = ({ children }: { children: React.ReactNode }) => (
  <h3 style={{
    fontFamily: mono, fontSize: '0.85rem', fontWeight: 600,
    color: '#3fa9bd', marginTop: '2rem', marginBottom: '0.75rem'
  }}>
    &#9658; {children}
  </h3>
)

const P = ({ children }: { children: React.ReactNode }) => (
  <p style={{ color: '#9aa8ac', lineHeight: 1.8, marginBottom: '1rem', fontSize: '0.9rem' }}>
    {children}
  </p>
)

const Note = ({ type, children }: { type?: 'info' | 'warn' | 'danger' | 'tip'; children: React.ReactNode }) => {
  const configs: Record<string, [string, string, string]> = {
    info: ['#5ccfe0', 'rgba(92,207,224,0.05)', 'NOTE'],
    warn: ['#ffb347', 'rgba(255,179,71,0.05)', 'WARNING'],
    danger: ['#ff4136', 'rgba(255,65,54,0.05)', 'CRITICAL'],
    tip: ['#00d4ff', 'rgba(0,212,255,0.05)', 'TIP'],
  }
  const [color, bg, label] = configs[type || 'info']
  return (
    <div style={{
      background: bg, borderLeft: '3px solid ' + color,
      padding: '1rem 1.25rem', borderRadius: '0 4px 4px 0',
      margin: '1.5rem 0', border: '1px solid ' + color + '33', borderLeftColor: color
    }}>
      <div style={{ fontFamily: mono, fontSize: '9px', color, letterSpacing: '0.2em', marginBottom: '6px' }}>{label}</div>
      <div style={{ color: '#9aa8ac', fontSize: '0.85rem', lineHeight: 1.7 }}>{children}</div>
    </div>
  )
}

const Table = ({ headers, rows }: { headers: string[]; rows: string[][] }) => (
  <div style={{ overflowX: 'auto', margin: '1rem 0 1.5rem' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: mono, fontSize: '0.75rem' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid #16303a' }}>
          {headers.map((h, i) => (
            <th key={i} style={{ textAlign: 'left', padding: '8px 12px', color: '#3fa9bd', fontWeight: 600, letterSpacing: '0.1em', fontSize: '0.7rem' }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} style={{ borderBottom: '1px solid #0d1c22', background: i % 2 === 0 ? 'transparent' : 'rgba(92,207,224,0.015)' }}>
            {row.map((cell, j) => (
              <td key={j} style={{ padding: '8px 12px', color: '#9aa8ac', verticalAlign: 'top' }}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

const chapters: CodexChapter[] = [
  // ─────────────────────────── CHAPTER 1 ───────────────────────────
  {
    id: 'forensic-principles',
    title: 'Forensic Principles & Process',
    difficulty: 'BEGINNER',
    readTime: '14 min',
    labLink: '/modules/forensics/lab',
    takeaways: [
      'Locard’s exchange principle is the philosophical core of forensics: every interaction leaves a trace, and your job is to find and interpret it.',
      'The order of volatility dictates acquisition sequence - capture RAM, network state and running processes before you ever touch disk.',
      'Chain of custody is a documented, unbroken record of who handled evidence, when, and why - break it and your evidence is inadmissible.',
      'Forensic soundness means working on verified copies, using write blockers, and proving with hashes that the original was never altered.',
      'Admissibility (Daubert, Frye, ISO 17025) depends on validated tools, repeatable method and a defensible documented process - not just a correct answer.',
      'Anti-forensics (timestomping, wiping, encryption, log tampering) is now routine; the examiner must expect it and hunt for the absence of evidence.',
    ],
    content: (
      <div>
        <Local>
          Think of the <em>watchman&apos;s gate register</em> at an estate, backed by the CCTV above it. When something goes missing, the register tells you who entered, when, and who signed them in; the camera footage shows what actually happened. Digital forensics is exactly this for computers &mdash; reconstructing who did what and when from the traces left behind. And there is one golden rule the estate learned the hard way: if a guard scribbles over the register or someone edits the footage, it is worthless in a <em>baraza</em> or a court. The evidence only counts if you can prove nobody tampered with it.
        </Local>
        <H3>What Digital Forensics Actually Is</H3>
        <P>
          Digital forensics is the application of scientific method to digital evidence so that findings survive scrutiny - in a courtroom, a disciplinary hearing, an insurance dispute or an internal incident review. The discipline splits into closely related sub-fields: disk (dead-box) forensics, memory forensics, mobile forensics, network forensics, cloud forensics and multimedia forensics. DFIR - Digital Forensics and Incident Response - fuses the evidentiary rigour of forensics with the speed of incident response, because in a live breach you rarely have the luxury of a pristine lab and unlimited time.
        </P>
        <P>
          The examiner&apos;s mindset is adversarial toward their own conclusions. You do not set out to prove a theory; you set out to test every reasonable hypothesis against the artifacts and let the evidence falsify the wrong ones. A single artifact rarely proves anything on its own - Prefetch shows a program ran, but not who ran it or why. You corroborate, cross-reference and build a weight-of-evidence case where multiple independent artifacts point to the same conclusion.
        </P>

        <H3>Locard&apos;s Exchange Principle</H3>
        <P>
          Edmond Locard, a pioneer of physical forensic science, observed that &quot;every contact leaves a trace.&quot; In the digital world this is almost absurdly true. Running a program writes a Prefetch file, updates the Amcache registry hive, touches the filesystem $MFT, and may leave an entry in the SRUM database and the UserAssist key. Plugging in a USB device writes to the SYSTEM and software hives, the setupapi logs and the Windows event log. Opening a document creates an LNK shortcut, a JumpList entry and a Recent item. Your task is to recognise which traces a given action produces, and - just as importantly - to notice when an expected trace is missing, because absence is itself evidence of tampering.
        </P>

        <H3>The Order of Volatility</H3>
        <P>
          RFC 3227 codifies the order in which evidence should be collected, from most to least volatile. Memory and ephemeral state vanish on power-off; disks persist. If you pull the power to &quot;preserve&quot; a machine you destroy every piece of volatile evidence - running malware, decryption keys, network connections, clipboard contents and injected code that exists only in RAM. Conversely, if you fumble around a live system you alter timestamps and overwrite slack. The order of volatility resolves the conflict: capture the most volatile first.
        </P>
        <Table
          headers={['Priority', 'Evidence source', 'Lifetime', 'Capture method']}
          rows={[
            ['1', 'CPU registers, cache', 'Nanoseconds', 'Generally not captured'],
            ['2', 'RAM (processes, keys, network, clipboard)', 'Until power-off', 'winpmem, DumpIt, LiME, AVML'],
            ['3', 'Network state, ARP, routing, sockets', 'Seconds to minutes', 'netstat, ss, arp -a'],
            ['4', 'Running processes, loaded modules', 'Until reboot', 'Live triage (KAPE, Velociraptor)'],
            ['5', 'Disk (filesystem, slack, unallocated)', 'Persistent', 'dd, dc3dd, FTK Imager, E01'],
            ['6', 'Remote logs, archival backups', 'Long term', 'Log pull, legal request'],
            ['7', 'Physical config, media labels', 'Static', 'Photography, notes'],
          ]}
        />

        <H3>Chain of Custody</H3>
        <P>
          Chain of custody is the documented, continuous record of everyone who handled a piece of evidence, from seizure to presentation. Every transfer is logged: who had it, when, what they did and why. A single unexplained gap lets opposing counsel argue the evidence was altered or substituted, and a judge may exclude it entirely. Each item gets a unique exhibit number, is sealed in tamper-evident packaging, and is tracked on a custody form. For digital evidence the hash of the acquired image is recorded at seizure and re-verified at every stage, so the chain is not just a signature trail but a cryptographic one.
        </P>
        <Pre label="CHAIN OF CUSTODY RECORD (EXCERPT)">
{`Exhibit:    GN-2026-0042-HDD1  (Seagate 1TB, S/N 5XW3QZ8K)
Seized:     2026-11-03 09:14 UTC by J. Mensah, warrant #2026-118
Acquired:   2026-11-03 11:02 UTC  image GN-0042-HDD1.E01
  sha256:   9f2c...e41a  (verified against source)
Transfers:
  2026-11-03 11:40  evidence locker A-7   (seal 00318)  J. Mensah
  2026-11-04 08:20  examiner bench 2      (seal broken)  A. Owusu
  2026-11-04 17:55  evidence locker A-7   (seal 00412)  A. Owusu
Hash re-verified at each custody change: MATCH`}
        </Pre>

        <H3>Write Blockers and Forensic Soundness</H3>
        <P>
          Forensic soundness is the principle that your examination must not alter the original evidence, and that you can prove it. The physical guarantee is the write blocker - a hardware or software device placed between the suspect drive and your workstation that passes read commands through but silently drops or rejects every write command. Simply mounting a disk on a modern OS can update last-access times, replay a dirty journal, or auto-run indexing services, so you never attach suspect media directly. Hardware write blockers (Tableau, WiebeTech) are preferred for court work; software blockers and read-only loopback mounts suffice for triage when documented. The proof of soundness is the hash: compute it on the source before acquisition, on the image after, and they must match.
        </P>
        <Note type="danger">
          Never work on original evidence. Acquire a verified image, hash it, and examine a working copy. If your tool crashes mid-analysis you re-copy from the image, never from the drive. The original is sealed and touched only to re-verify the hash if challenged.
        </Note>

        <H3>Legal Admissibility</H3>
        <P>
          A technically correct finding is worthless if a court will not hear it. In US federal practice the Daubert standard asks whether a technique is testable, peer-reviewed, has a known error rate, and is generally accepted; older Frye jurisdictions ask only about general acceptance. Internationally, ISO/IEC 17025 accreditation of the lab and ISO/IEC 27037 guidance on handling digital evidence carry weight. Practically this means you use validated tools (NIST&apos;s Computer Forensics Tool Testing program tests imagers and carvers), you document every step so the analysis is repeatable by an independent examiner, and you can explain in plain language what each artifact means and how confident you are.
        </P>

        <H3>Anti-Forensics: Expecting an Adversary</H3>
        <P>
          Modern subjects fight back. Timestomping rewrites MACB timestamps so a malicious binary looks years old; full-disk encryption (BitLocker, LUKS, FileVault) renders a powered-off image useless without the key, which is one more reason to capture RAM while the machine is live; secure-delete tools and SSD TRIM destroy unallocated data; log cleaning (wevtutil cl, shred of auth.log) erases the obvious trail. The experienced examiner treats anti-forensics as a signal, not a dead end. A file whose $STANDARD_INFORMATION timestamps predate its $FILE_NAME timestamps is almost certainly timestomped. A conspicuously empty Security event log on a server that should be noisy is itself an indicator of compromise. You hunt for the shadow the adversary forgot to erase - a Prefetch file for the wiping tool, a USN journal entry, a VSS snapshot taken before the cleanup.
        </P>
        <Note type="info">
          The forensic process in one line: Identify, Preserve, Acquire, Analyse, Document, Present. Every chapter that follows is a deep dive into one or two of those verbs - but the principles here govern all of them.
        </Note>
      </div>
    ),
  },

  // ─────────────────────────── CHAPTER 2 ───────────────────────────
  {
    id: 'acquisition',
    title: 'Acquisition & Imaging',
    difficulty: 'BEGINNER',
    readTime: '14 min',
    labLink: '/modules/forensics/lab',
    takeaways: [
      'A forensic image is a bit-for-bit copy including slack and unallocated space - a logical file copy is not an image.',
      'E01 (EnCase Expert Witness) stores metadata, compression and an internal CRC/hash per block; raw dd is a plain mirror with no container.',
      'Hash the source before, the image after, and store both - a matching sha256/md5 is your proof of integrity.',
      'Live (order-of-volatility) acquisition captures RAM and running state; dead acquisition images a powered-off disk through a write blocker.',
      'Capture memory with winpmem, DumpIt, AVML or LiME before anything else - decryption keys and fileless malware live only in RAM.',
      'Cloud and mobile acquisition are API- and chip-bound: you often get logical/filesystem extractions, not a true physical image.',
    ],
    content: (
      <div>
        <Local>
          You would never scribble your working notes onto the original gate register &mdash; you&apos;d take it to the shop, make a <em>certified photocopy</em>, stamp it, and only ever write on the copy. Forensic imaging is that photocopy, but perfect down to the last smudge: a bit-for-bit duplicate of the whole disk, even the blank-looking pages. The hash you compute is like the shopkeeper stamping &quot;this copy matches the original, page for page&quot; &mdash; so months later nobody can claim you added or erased a line.
        </Local>
        <H3>What a Forensic Image Is</H3>
        <P>
          A forensic image is a complete, bit-for-bit duplicate of a storage device: every sector, allocated or not, including the slack space at the end of files and the unallocated space that holds deleted data. This is fundamentally different from copying files. Copying files with the operating system gives you only what the filesystem currently references; it skips deleted files, slack, the journal, shadow copies and the boot areas. Carving deleted data, recovering timestamps and proving nothing was changed all depend on having the raw bitstream, so forensic acquisition always works at the physical device level.
        </P>

        <H3>dd, dc3dd and dcfldd</H3>
        <P>
          The classic Unix imager is dd, which simply reads one device and writes to another. For forensics the specialised forks dc3dd (DoD Cyber Crime Center) and dcfldd (DoD Computer Forensics Lab) add what dd lacks: on-the-fly hashing, progress output, error logging and verification. You image the whole physical device (for example /dev/sda), not a partition, so you capture the partition table and any hidden areas.
        </P>
        <Watch
          reads={<>Two commands and their output. The first (<code>lsblk</code>) just lists the disks so you can confirm which one is the suspect &mdash; like reading the serial number off the register before photocopying it. The second (<code>dc3dd</code>) makes the bit-for-bit copy and hashes it as it reads. The last line, <em>device verified: yes</em>, is the shopkeeper&apos;s stamp.</>}
          later={<>You&apos;ll run this against a practice disk image in the lab, write blocker and all.</>}
        >
        <Pre label="DISK IMAGING WITH dc3dd">
{`# Identify the suspect disk (behind a write blocker)
lsblk -o NAME,SIZE,MODEL,SERIAL
  sda   931.5G  ST1000LM035-1RK172  5XW3QZ8K

# Image the whole physical device, hashing as we read
dc3dd if=/dev/sda of=/evidence/GN-0042.raw hash=sha256
      log=/evidence/GN-0042.log hofs=/evidence/GN-0042.hashes bs=4M

  input  results for device /dev/sda:
   1953525168 sectors in
   sha256: 9f2c0b7d41e2...e41a
   device verified : yes`}
        </Pre>
        </Watch>
        <Note type="warn">
          Long commands are wrapped across lines for readability. Always confirm if= points at the physical device and of= points at your evidence drive - transposing them wipes the evidence. Many examiners physically label the write-blocked source and the destination before running anything.
        </Note>

        <H3>Raw vs E01 Containers</H3>
        <P>
          A raw image (dd, .raw, .dd, .img) is a plain mirror of the device with no wrapper - simple, universally readable, but large and carrying no embedded metadata. The Expert Witness Format (E01), introduced by EnCase, wraps the bitstream in a container that compresses the data, splits it into segment files, stores case metadata (examiner, notes, acquisition date) and embeds a CRC for every 32 KB block plus an overall MD5/SHA hash. Because E01 verifies itself block by block, bit-rot or a bad transfer is detected rather than silently corrupting the evidence. AFF4 is a newer open container supporting sparse images and cloud-scale evidence.
        </P>
        <Table
          headers={['Property', 'Raw (dd)', 'E01 (EWF)', 'AFF4']}
          rows={[
            ['Compression', 'None', 'Yes (adaptive)', 'Yes'],
            ['Embedded metadata', 'None', 'Case + examiner info', 'Rich, extensible'],
            ['Integrity', 'External hash only', 'Per-block CRC + image hash', 'Per-block hashes'],
            ['Tool support', 'Universal', 'Near-universal', 'Growing'],
            ['Typical use', 'Quick triage, Linux', 'Court / EnCase workflow', 'Large / cloud evidence'],
          ]}
        />

        <H3>FTK Imager and GUI Acquisition</H3>
        <P>
          On Windows the free FTK Imager is the de-facto standard for acquisition. It images physical or logical drives to raw, E01 or SMART format, mounts images read-only, previews filesystems, and - crucially for live response - can capture memory and protected files like the registry hives while the system runs. Guymager on Linux fills the same role with a clean GUI and parallel hashing. Whatever the tool, the workflow is identical: select the physical source, choose a format, enter case metadata, and let the tool hash during acquisition and verify afterwards.
        </P>

        <H3>Hashing for Integrity</H3>
        <P>
          Hashing is the mathematical backbone of forensic integrity. You compute a cryptographic digest of the source, acquire the image, compute the digest of the image, and compare. A match proves the copy is identical to the original. MD5 and SHA-1 are cryptographically broken against deliberate collision attacks, but for integrity verification of a specific acquired image - where no adversary is crafting a colliding disk during your acquisition - they remain in wide use; best practice is to record SHA-256 as well so the integrity proof survives future scrutiny.
        </P>
        <Watch
          reads={<>This is the &quot;does my copy still match?&quot; check. It computes a fresh fingerprint of the image and compares it to the one recorded when the copy was made. If the two strings match, the evidence is intact; if a single character differs, something changed. Read it as proof, not a task to do now.</>}
          later={<>You&apos;ll verify a hash and catch a deliberately tampered image in the lab.</>}
        >
        <Pre label="VERIFYING AN ACQUIRED IMAGE">
{`# Hash the image after acquisition
sha256sum /evidence/GN-0042.raw
  9f2c0b7d41e2c8a60f1b...e41a  /evidence/GN-0042.raw

# Compare against the value dc3dd recorded from the source
#   source sha256: 9f2c0b7d41e2c8a60f1b...e41a  -> MATCH

# For E01, let the tool re-verify the embedded hashes
ewfverify GN-0042.E01
  MD5 hash stored in file:   d41d8cd9...  (matches calculated)
  SHA256 hash calculated:    9f2c0b7d...  verified : success`}
        </Pre>
        </Watch>

        <H3>Live vs Dead Acquisition</H3>
        <P>
          Dead acquisition powers the machine off (or never powers it on), removes or write-blocks the disk, and images it cold. It is the most forensically sound approach because the evidence cannot change. But it destroys everything volatile and is useless against full-disk encryption when you lack the key. Live acquisition captures a running system in order of volatility - memory first, then network and process state, then disk - accepting that your tools leave a small, documented footprint. On an encrypted laptop found powered on and logged in, live acquisition is the only way to recover the plaintext before the screen locks and the keys leave RAM.
        </P>

        <H3>Memory Capture</H3>
        <P>
          RAM holds what disk never will: running processes, injected and fileless malware, decryption keys, clipboard data, open network connections, command history and unencrypted copies of documents. Capture it first and capture it with a tool that reads physical memory directly.
        </P>
        <Pre label="MEMORY ACQUISITION TOOLS">
{`# Windows - winpmem (open source, Rekall lineage)
winpmem_mini.exe -o E:/evidence/mem.raw

# Windows - Magnet DumpIt (one-click raw or crash dump)
DumpIt.exe /OUTPUT E:/evidence/host01.dmp

# Linux - AVML (Microsoft, works across kernels, no compile)
avml /evidence/host01.lime

# Linux - LiME kernel module
insmod lime.ko "path=/evidence/host01.lime format=lime"

# macOS - use a vetted agent; SIP restricts raw /dev/mem access`}
        </Pre>
        <Note type="tip">
          Record the exact acquisition time, tool name and version in your notes. Memory is a snapshot of a single instant; a Volatility analysis three weeks later is only meaningful relative to when the capture was taken.
        </Note>

        <H3>Cloud and Mobile Challenges</H3>
        <P>
          You cannot put a write blocker on an iPhone or an S3 bucket. Mobile acquisition ranges from a logical backup (what the device will hand over via its sync protocol), through a filesystem extraction (more data, often needing an exploit or a vendor tool), to a full physical image (chip-off or a bootrom exploit like checkm8 on older iPhones). Cloud acquisition is almost entirely API- and log-driven: you preserve the account, pull CloudTrail/Azure Activity/GCP Audit logs, snapshot volumes with the provider&apos;s own API, and request data through legal process. In both worlds you rarely get a classic physical image, so you document precisely what the extraction did and did not capture, and what it may have changed.
        </P>
      </div>
    ),
  },

  // ─────────────────────────── CHAPTER 3 ───────────────────────────
  {
    id: 'filesystem-forensics',
    title: 'Filesystem Forensics',
    difficulty: 'INTERMEDIATE',
    readTime: '16 min',
    labLink: '/modules/forensics/lab',
    takeaways: [
      'The partition scheme (MBR or GPT) tells you where volumes start; mmls maps them before you ever mount a filesystem.',
      'NTFS stores everything, including small files, inside the $MFT - one 1024-byte record per file with resident or non-resident data.',
      'MACB timestamps live in both $STANDARD_INFORMATION and $FILE_NAME; a mismatch between them is the classic sign of timestomping.',
      '$LogFile and $UsnJrnl record filesystem changes and let you reconstruct creates, renames and deletes even after the files are gone.',
      'Deleted data persists in unallocated space and file slack until overwritten; carvers like photorec and scalpel recover it by signature.',
      'ext4 (inodes, journal) and exFAT (FAT chains) need their own mental model - never assume NTFS semantics on a Linux or removable volume.',
    ],
    content: (
      <div>
        <Local>
          A disk is organised like a busy <em>duka</em>&apos;s store room. There is an index book at the front listing which shelf holds what (the partition table), the shelves themselves (the filesystem), and &mdash; the part investigators love &mdash; the back corner where &quot;finished&quot; stock is tossed. The shopkeeper crossed it out of the index book, so to a customer it looks gone, but the actual cartons are still sitting there until new stock is physically stacked on top. That back corner is slack and unallocated space, and deleted files live there long after someone thinks they threw them away.
        </Local>
        <H3>Partition Schemes: MBR and GPT</H3>
        <P>
          Before you can parse a filesystem you must find it. The Master Boot Record (MBR), used since the 1980s, sits in the first 512-byte sector and holds a four-entry partition table plus bootstrap code; it caps disks at 2 TB and four primary partitions. The GUID Partition Table (GPT), part of UEFI, replaces it on modern systems with a protective MBR, a primary GPT header, up to 128 partition entries and a backup table at the end of the disk. The Sleuth Kit&apos;s mmls reads either scheme and prints the layout so you know the byte offset of each volume.
        </P>
        <Pre label="MAPPING PARTITIONS WITH mmls (The Sleuth Kit)">
{`mmls GN-0042.raw

GUID Partition Table (EFI)
      Slot      Start        End          Length       Description
000:  Meta      0000000000   0000000000   0000000001   Safety Table
001:  -------   0000000000   0000002047   0000002048   Unallocated
002:  Meta      0000000001   0000000001   0000000001   GPT Header
003:  000       0000002048   0001085439   0001083392   EFI System Partition
004:  001       0001085440   0001292287   0000206848   Microsoft reserved
005:  002       0001310720   1953521663   1952210944   Basic data partition

# Point later tools at the NTFS volume with: -o 1310720 (its start sector)`}
        </Pre>

        <H3>NTFS Internals: The $MFT</H3>
        <P>
          NTFS is a database masquerading as a filesystem, and the Master File Table ($MFT) is that database. Every file and directory has at least one 1024-byte MFT record identified by an entry number. The record is a sequence of attributes: $STANDARD_INFORMATION (timestamps, flags), $FILE_NAME (name plus a second set of timestamps and the parent reference), $DATA (the content itself), and for directories $INDEX_ROOT / $INDEX_ALLOCATION. Small files are resident - their content lives inside the MFT record. Larger files are non-resident, and the record instead stores data runs pointing to clusters on disk. The first sixteen MFT records are metadata files: $MFT itself, $MFTMirr, $LogFile, $Volume, $Bitmap, $UsnJrnl and others, each prefixed with a dollar sign.
        </P>
        <Pre label="PARSING THE $MFT WITH analyzeMFT / MFTECmd">
{`# Eric Zimmerman's MFTECmd - the standard modern parser
MFTECmd.exe -f C:/mount/$MFT --csv out/ --csvf mft.csv

# One record, decoded:
Entry-Seq : 94213-3
InUse     : False            <- record marked deleted
FileName  : /Users/j.doe/AppData/Local/Temp/svvhost.exe
Size      : 71680
SI Created: 2019-04-11 03:12:44    <- $STANDARD_INFORMATION
FN Created: 2026-11-02 23:51:08    <- $FILE_NAME  (the real creation)
Parent    : /Users/j.doe/AppData/Local/Temp`}
        </Pre>

        <H3>MACB Timestamps and Timestomping</H3>
        <P>
          NTFS keeps four timestamps - Modified, Accessed, metadata-Changed and Born (created), remembered as MACB. Crucially they appear twice: once in $STANDARD_INFORMATION (SI), which user-space APIs and most tools can rewrite freely, and once in $FILE_NAME (FN), which is updated only by the kernel during create, move and rename and cannot be set through the normal SetFileTime API. Timestomping tools alter the SI timestamps to disguise a file&apos;s age, but usually leave the FN timestamps intact. When SI predates FN, or SI has suspiciously round values (all zeros in the sub-second field, or a date that predates the OS install), you are almost certainly looking at a stomped file.
        </P>
        <Table
          headers={['Letter', 'Meaning', 'Set when', 'Rewritable from user space?']}
          rows={[
            ['M', 'Modified (content changed)', 'File data written', 'Yes (SI)'],
            ['A', 'Accessed', 'File read/opened', 'Yes (SI), often disabled'],
            ['C', 'Changed (MFT record changed)', 'Any attribute change', 'Not directly'],
            ['B', 'Born / Created', 'File created', 'Yes (SI), not FN'],
          ]}
        />
        <Note type="danger">
          A binary with SI-Created of 2009 but FN-Created of last Tuesday did not time-travel. Compare SI vs FN on every suspect file; the $UsnJrnl and $LogFile often preserve the true creation moment even after a stomp.
        </Note>

        <H3>$LogFile and $UsnJrnl</H3>
        <P>
          NTFS is a journaling filesystem, and its journals are a forensic goldmine. $LogFile is the transaction log that guarantees metadata consistency after a crash; it records low-level redo/undo operations and can reveal file creations, deletions and renames that happened recently, including the before-and-after state. The Update Sequence Number journal, $Extend/$UsnJrnl:$J, is a higher-level change log: for every modified file it records the entry number, parent, filename and a reason code (DataOverwrite, FileCreate, FileDelete, RenameOldName, RenameNewName). Parsing the USN journal lets you reconstruct exactly what an attacker&apos;s tool created and deleted, with timestamps, even after the files themselves are gone.
        </P>
        <Pre label="USN JOURNAL ENTRIES (parsed with MFTECmd -f $J)">
{`Timestamp            Entry   Name                  Reason
2026-11-02 23:51:08  94213   svvhost.exe           FileCreate
2026-11-02 23:51:09  94213   svvhost.exe           DataExtend+Close
2026-11-02 23:58:42  94213   svvhost.exe           RenameOldName
2026-11-02 23:58:42  94213   update.exe            RenameNewName
2026-11-03 00:17:55  94213   update.exe            FileDelete+Close
# The binary was created, renamed to hide, then deleted - all reconstructable.`}
        </Pre>

        <H3>FAT, exFAT and ext4</H3>
        <P>
          Removable media and non-Windows systems demand other mental models. FAT32 and exFAT track files through a File Allocation Table - a linked list of clusters - with directory entries holding the name and a single set of timestamps (no FN/SI split, no journal in FAT32; exFAT adds an allocation bitmap and a basic transaction log). Deleted FAT entries simply flip the first filename byte to 0xE5 and free the chain, so recovery is often trivial if clusters are intact. Linux ext4 uses inodes (owner, mode, timestamps including crtime, and extent trees) referenced by directory entries, plus a journal (jbd2). Deleting a file on ext4 zeroes the extent pointers in the inode, which makes metadata-based recovery harder than on FAT and pushes you toward content carving.
        </P>

        <H3>Slack Space and Unallocated Space</H3>
        <P>
          Disks allocate storage in clusters (commonly 4 KB). A 5 KB file occupies two clusters but only fills 1 KB of the second - the remaining 3 KB is file slack, and it still contains whatever data previously lived in those sectors. Unallocated space is every cluster the filesystem does not currently assign to a live file, and it is where deleted files linger until overwritten. Both are invisible to the operating system and to a logical file copy, which is exactly why forensics works on full physical images. Hidden flags, deleted fragments and planted markers routinely survive in slack long after the parent file is gone.
        </P>

        <H3>File Carving</H3>
        <P>
          When the filesystem metadata is gone, you recover files by their content. Carving scans unallocated space and slack for known header and footer signatures - FF D8 FF for JPEG, 25 50 44 46 for PDF, PK for ZIP/Office - and extracts the bytes in between. foremost and scalpel are header/footer carvers driven by a signature config; PhotoRec is more sophisticated, understanding dozens of formats and internal structure, and is the go-to for recovering photos and documents from formatted or damaged media. Carving ignores filenames and timestamps (that metadata is gone), so recovered files are named by offset and must be identified by content.
        </P>
        <Pre label="CARVING DELETED FILES">
{`# PhotoRec - interactive, format-aware, recovers from unallocated
photorec /d /evidence/recovered /cmd GN-0042.raw partition_none,fileopt,search

# foremost - signature carving to typed subfolders
foremost -t jpg,pdf,doc,zip -i GN-0042.raw -o /evidence/carved
  Processing: GN-0042.raw
  jpg:= 142   pdf:= 37   doc:= 9   zip:= 21
  # output in /evidence/carved/jpg, .../pdf, with an audit.txt index

# scalpel - fast, config-driven header/footer carver
scalpel -c /etc/scalpel/scalpel.conf -o /evidence/scalpel GN-0042.raw`}
        </Pre>
      </div>
    ),
  },

  // ─────────────────────────── CHAPTER 4 ───────────────────────────
  {
    id: 'windows-execution',
    title: 'Windows Artifacts I — Execution & Persistence',
    difficulty: 'INTERMEDIATE',
    readTime: '16 min',
    labLink: '/modules/forensics/lab',
    takeaways: [
      'Prefetch files prove a program executed, how many times, and when it last ran - the single strongest execution artifact on a workstation.',
      'Amcache and Shimcache (AppCompatCache) record programs the system has seen, often including ones that never left a Prefetch file.',
      'SRUM aggregates per-application network and resource usage by hour - it can show a tool that beaconed even after it was deleted.',
      'UserAssist (ROT13-encoded) records GUI program launches per user, with run counts and last-run times.',
      'Persistence hides in Run keys, Services, Scheduled Tasks, WMI subscriptions and startup folders - each leaves a distinct, datable artifact.',
      'No single execution artifact is conclusive; correlate Prefetch, Amcache, SRUM and the event log to build a defensible timeline.',
    ],
    content: (
      <div>
        <H3>Why Execution Evidence Matters</H3>
        <P>
          A central question in almost every intrusion investigation is: what ran, when, and did it run more than once? Windows is unusually generous here, scattering execution evidence across the filesystem and registry for performance and compatibility reasons that long predate anyone thinking of them as forensic artifacts. The examiner&apos;s craft is knowing which artifact answers which question, and understanding each one&apos;s limits - because an attacker who deletes a malicious binary rarely cleans every trace that it executed.
        </P>

        <H3>Prefetch</H3>
        <P>
          The Windows prefetcher accelerates application start-up by recording, in C:/Windows/Prefetch, which files and directories a program touches in its first ten seconds. Each run writes a file named like CHROME.EXE-2A33C44B.pf, where the hash encodes the executable path. For the examiner this is gold: the .pf stores the executable name, the run count, and up to the last eight execution timestamps (one on Windows 7, up to eight on Windows 8 and later), plus a list of referenced files and volumes. Prefetch therefore proves not just that a program existed but that it actually executed, when, and roughly how often. Note that Prefetch is often disabled on SSD-only servers, and that the filename hash is based on the full path, so the same executable run from two locations yields two .pf files.
        </P>
        <Pre label="PARSING PREFETCH WITH PECmd (Eric Zimmerman)">
{`PECmd.exe -f C:/mount/Windows/Prefetch/SVVHOST.EXE-9B1F2C07.pf

Executable name : SVVHOST.EXE
Run count       : 4
Last run        : 2026-11-03 00:05:12
Other run times : 2026-11-02 23:51:11, 23:55:40, 23:59:03
Volume          : VOLUME{01d7...}  C:  Serial AE42-9C11
Referenced files: ...Temp/svvhost.exe, ...System32/ws2_32.dll,
                  ...System32/wininet.dll, ...Temp/exfil.dat
# ws2_32 + wininet referenced -> the binary used network APIs.`}
        </Pre>

        <H3>Amcache and Shimcache</H3>
        <P>
          Two application-compatibility caches record programs the system has encountered. Amcache.hve (under C:/Windows/AppCompat/Programs) is a registry hive that stores, per executable, the full path, file size, compilation timestamp and - most valuably - a SHA-1 of the first bytes of the file, which you can pivot on against threat-intel feeds. Shimcache, also called AppCompatCache and stored in the SYSTEM hive, records the path, last-modified time and a flag indicating execution, holding up to ~1024 entries in a specific order. The key subtlety: Shimcache presence proves the file existed and was seen by the shim engine, not necessarily that it executed, while Amcache entries strongly indicate the file was present on disk. Together they frequently catch tools that ran once and were deleted before Prefetch could matter.
        </P>
        <Table
          headers={['Artifact', 'Location', 'Key data', 'Proves execution?']}
          rows={[
            ['Prefetch', 'Windows/Prefetch/*.pf', 'Run count, last 8 run times', 'Yes (strong)'],
            ['Amcache', 'Windows/AppCompat/Programs/Amcache.hve', 'Path, size, SHA-1, compile time', 'Presence (strong)'],
            ['Shimcache', 'SYSTEM hive AppCompatCache', 'Path, last-modified, exec flag', 'Presence, sometimes exec'],
            ['SRUM', 'Windows/System32/sru/SRUDB.dat', 'Per-app network + CPU by hour', 'Yes (ran and used resources)'],
            ['UserAssist', 'NTUSER.DAT per user', 'GUI launches, count, last run', 'Yes (per-user GUI)'],
          ]}
        />

        <H3>SRUM - The System Resource Usage Monitor</H3>
        <P>
          SRUM is one of the most underused yet powerful artifacts. Windows maintains SRUDB.dat, an ESE database, recording per-application resource usage in roughly hourly buckets: bytes sent and received per application, CPU time, and which network profile was active. Because it aggregates by application and persists for weeks, SRUM can show that a now-deleted binary transferred megabytes of data out of the network at 02:00 on a specific night - direct evidence of exfiltration that survives the deletion of the tool itself. SrumECmd parses it into readable CSVs tying application, user SID, network interface and byte counts to timestamps.
        </P>
        <Pre label="SRUM NETWORK USAGE (SrumECmd output excerpt)">
{`Timestamp            Application              SentBytes   RecvBytes
2026-11-03 00:00:00  Temp/svvhost.exe         48,112,640     204,800
2026-11-03 01:00:00  Temp/svvhost.exe         61,204,992     189,440
2026-11-03 02:00:00  chrome.exe                1,204,224   8,110,592
# svvhost.exe pushed ~100 MB outbound overnight -> exfiltration candidate.`}
        </Pre>

        <H3>UserAssist and RunMRU</H3>
        <P>
          Within each user&apos;s NTUSER.DAT hive, the UserAssist key records programs the user launched through the GUI (Explorer, Start menu), with a run count and last-execution time. The value names are ROT13-encoded - a trivial obfuscation that every parser decodes automatically. UserAssist is per-user and GUI-only, so it complements Prefetch (which is system-wide and includes command-line launches). RunMRU records the most-recently-used entries from the Run dialog (Win+R), preserving commands a user typed to launch programs - often a window into exactly what an attacker executed interactively.
        </P>

        <H3>Persistence Mechanisms</H3>
        <P>
          Having established what ran, you must find how the adversary survives a reboot. Persistence is where attackers reveal themselves, because every mechanism writes a durable, datable artifact. The registry Run and RunOnce keys (in both HKLM software and the per-user NTUSER.DAT) launch a program at logon and are the oldest trick in the book. Windows Services (stored in the SYSTEM hive under CurrentControlSet/Services) start code at boot with high privilege. Scheduled Tasks live as XML in C:/Windows/System32/Tasks with a matching registry entry and fire on triggers. WMI event subscriptions (a __EventFilter bound to a CommandLineEventConsumer) are a stealthier, fileless technique favoured by advanced actors. The Startup folder and the registry&apos;s Winlogon and Image File Execution Options keys round out the common set.
        </P>
        <Pre label="COMMON PERSISTENCE LOCATIONS (shown with forward slashes)">
{`# Registry autoruns
HKLM/SOFTWARE/Microsoft/Windows/CurrentVersion/Run
HKCU/SOFTWARE/Microsoft/Windows/CurrentVersion/Run
HKLM/SOFTWARE/Microsoft/Windows/CurrentVersion/RunOnce

# Services
HKLM/SYSTEM/CurrentControlSet/Services/<svc>/ImagePath

# Scheduled tasks
C:/Windows/System32/Tasks/<taskname>            (XML definition)

# WMI persistence (fileless)
ROOT/subscription:__EventFilter + CommandLineEventConsumer

# Startup folder
C:/Users/<user>/AppData/Roaming/Microsoft/Windows/
   Start Menu/Programs/Startup/`}
        </Pre>
        <Note type="tip">
          RegRipper and Eric Zimmerman&apos;s Registry Explorer plus RECmd automate extraction of Run keys, services and UserAssist. Autoruns (Sysinternals) in offline-hive mode scans a mounted image for every autostart location at once - run it first to triage persistence quickly.
        </Note>

        <H3>Correlating the Picture</H3>
        <P>
          None of these artifacts is conclusive alone, and each has a failure mode: Prefetch can be disabled, Shimcache does not timestamp execution, Amcache can carry stale entries. The defensible finding comes from convergence. When Prefetch shows svvhost.exe ran four times, Amcache gives its SHA-1 matching a known RAT, SRUM shows 100 MB exfiltrated under its name, a Run key points at its path, and the Security log records the process creation (event 4688) - the conclusion that a specific tool executed and stole data is beyond reasonable dispute. That convergence is exactly what the next chapter&apos;s user-activity artifacts and Chapter 7&apos;s timeline work are built to produce.
        </P>
      </div>
    ),
  },

  // ─────────────────────────── CHAPTER 5 ───────────────────────────
  {
    id: 'windows-user-activity',
    title: 'Windows Artifacts II — User Activity',
    difficulty: 'INTERMEDIATE',
    readTime: '15 min',
    labLink: '/modules/forensics/lab',
    takeaways: [
      'LNK files and JumpLists record which files a user opened, from where, and often the target’s size and timestamps - even after the file is deleted.',
      'ShellBags prove a user browsed a specific folder (including on removable or deleted volumes) and preserve its view settings and timestamps.',
      'Browser history, cache and downloads (SQLite) reconstruct web activity, searches, and exactly what was downloaded and when.',
      'The Recycle Bin $I / $R pair preserves a deleted file’s original path, size and deletion time alongside its recoverable content.',
      'A handful of event-log IDs (4624/4625 logon, 4688 process, 4634 logoff, 1149 RDP, 7045 service install) carry most forensic weight.',
      'User-activity artifacts attribute actions to a specific account - the bridge from "something happened" to "this user did it".',
    ],
    content: (
      <div>
        <H3>From Execution to Attribution</H3>
        <P>
          Chapter 4 established what ran on a machine. This chapter answers who did what: which files a user opened, which folders they browsed, what they searched for and downloaded, and which account was logged on at the time. These artifacts are the bridge from &quot;a program executed&quot; to &quot;this user, at this console, opened this document and copied it to this USB stick.&quot; They are per-user, stored largely in the user&apos;s profile and NTUSER.DAT / UsrClass.dat hives, and they are what turns a technical timeline into a human narrative.
        </P>

        <H3>LNK Files and JumpLists</H3>
        <P>
          Windows creates a shortcut (.lnk) automatically whenever a user opens a file, storing it under Recent. The LNK is a rich structure: it embeds the target&apos;s full path, its size, its MACB timestamps at the time of access, the volume serial number and type (fixed or removable), and sometimes a NetBIOS/MAC trail for network targets. Because the LNK persists after the target is deleted or the USB stick is unplugged, it proves a file existed and was opened even when the file itself is long gone. JumpLists extend this: the AutomaticDestinations and CustomDestinations files (under Recent/AutomaticDestinations-ms) record, per application, the recently and frequently used items, each an embedded LNK with its own timestamps and an application ID (AppID) identifying the program.
        </P>
        <Pre label="PARSING AN LNK WITH LECmd (Eric Zimmerman)">
{`LECmd.exe -f "C:/mount/Users/j.doe/.../Recent/Q4_payroll.lnk"

Target path      : E:/exfil/Q4_payroll.xlsx
Target created   : 2026-11-02 22:40:11
Target modified  : 2026-11-02 22:41:03
Target size      : 2,118,144 bytes
Drive type       : Removable storage media      <- opened from a USB stick
Volume label     : KINGSTON    Serial: 8C41-02FF
Machine ID       : fin-ws-14`}
        </Pre>
        <Note type="info">
          The combination of an LNK pointing at a removable drive, a matching USBSTOR registry entry, and a JumpList for Excel referencing the same file is strong evidence that a user copied a sensitive spreadsheet onto a named USB device at a precise time.
        </Note>

        <H3>ShellBags</H3>
        <P>
          ShellBags are registry structures (in UsrClass.dat under Local Settings/Software/Microsoft/Windows/Shell/Bags and BagMRU) that remember the view settings - window size, column layout, sort order - for every folder a user has browsed in Explorer. Their forensic value is a side effect: to remember a folder&apos;s preferences, Windows must record that the folder was visited at all. ShellBags therefore prove a user navigated into a specific path, including folders on removable media, network shares, ZIP archives and even volumes that have since been deleted or wiped. Each bag carries timestamps, so you can place a user inside a particular directory at a particular moment, which is powerful when the directory or its contents no longer exist.
        </P>

        <H3>Browser Forensics</H3>
        <P>
          Web activity is reconstructed almost entirely from SQLite databases in the browser profile. Chromium browsers (Chrome, Edge, Brave) store the History database with urls and visits tables (visit time in WebKit epoch), a Cookies store, Login Data, Web Data (autofill) and a Downloads list recording each file&apos;s source URL, target path, size and start/end time. Firefox uses places.sqlite (moz_places, moz_historyvisits) and downloads metadata in the same store. The browser cache holds copies of actually-rendered content, letting you prove a page was not just requested but seen. Private/incognito sessions deliberately avoid writing history, but artifacts can still surface in memory (Chapter 6) and in DNS caches.
        </P>
        <Pre label="QUERYING BROWSER HISTORY (SQLite)">
{`sqlite3 "C:/mount/Users/j.doe/AppData/Local/Google/Chrome/
         User Data/Default/History"

sqlite> SELECT datetime(last_visit_time/1000000-11644473600,
        'unixepoch') AS visited, url
        FROM urls ORDER BY last_visit_time DESC LIMIT 4;

2026-11-02 22:35:49 | https://anonfiles-mirror.example/upload
2026-11-02 22:31:10 | https://www.google.com/search?q=exfiltrate+data+usb
2026-11-02 21:58:03 | https://mail.example.com/
# Chrome time is microseconds since 1601 -> the epoch math above converts it.`}
        </Pre>

        <H3>The Recycle Bin</H3>
        <P>
          Deleting a file to the Recycle Bin does not erase it; it relocates it into C:/$Recycle.Bin/&lt;user-SID&gt;/ as a pair of files. The $I file (for example $IABC123.xlsx) is metadata: the original full path, the original size and the deletion timestamp. The $R file ($RABC123.xlsx) holds the actual recoverable content. This pairing is a gift to the examiner: it preserves the original location and name of a deleted file (which carving cannot recover) plus the exact moment of deletion, and the content can often be restored intact. Even after a user empties the bin, the $I/$R entries may survive in unallocated space to be carved back.
        </P>

        <H3>Event Logs That Matter</H3>
        <P>
          Windows writes hundreds of event types; a small subset carries most forensic weight. The Security log records authentication and process activity; the System log records service and driver events; dedicated channels record RDP and PowerShell. Logs are stored as .evtx files under C:/Windows/System32/winevt/Logs and parsed with EvtxECmd, python-evtx or Chainsaw/Hayabusa for rule-based triage.
        </P>
        <Table
          headers={['Event ID', 'Log / channel', 'Meaning', 'Forensic use']}
          rows={[
            ['4624', 'Security', 'Successful logon (Type 2/3/10)', 'Who logged on, how, from where'],
            ['4625', 'Security', 'Failed logon', 'Brute force, password spray'],
            ['4634 / 4647', 'Security', 'Logoff', 'Session duration'],
            ['4688', 'Security', 'Process creation (+ cmdline if enabled)', 'What executed, parent-child'],
            ['4672', 'Security', 'Special privileges assigned', 'Admin / SYSTEM logon'],
            ['7045', 'System', 'New service installed', 'Persistence, lateral movement'],
            ['1149', 'RDP (TerminalServices)', 'RDP auth succeeded', 'Remote interactive access'],
            ['4104', 'PowerShell/Operational', 'Script block logging', 'Decoded attacker PowerShell'],
          ]}
        />
        <Note type="warn">
          Logon Type matters: Type 2 is interactive at the console, Type 3 is network (SMB/shares), Type 10 is RemoteInteractive (RDP). An attacker&apos;s 4624 Type 10 from an unusual source IP at 02:00, followed by a 7045 service install, is a textbook lateral-movement signature.
        </Note>

        <H3>Building the User Narrative</H3>
        <P>
          Stitched together, these artifacts tell a human story. A 4624 Type 2 logon places j.doe at the console at 21:55. Browser history shows a search for data-exfiltration techniques and a visit to an upload site at 22:35. A ShellBag and an LNK show a USB volume KINGSTON (serial 8C41-02FF) browsed and a payroll spreadsheet opened from it at 22:40. SRUM and the JumpList corroborate the file&apos;s movement. A $I/$R pair records the local copy deleted at 23:05, and a 4634 logoff closes the session. That chain - each link an independent artifact - is precisely the kind of corroborated account that withstands cross-examination, and it is assembled formally using the timeline techniques of Chapter 7.
        </P>
      </div>
    ),
  },

  // ─────────────────────────── CHAPTER 6 ───────────────────────────
  {
    id: 'memory-forensics',
    title: 'Memory Forensics (Volatility 3)',
    difficulty: 'ADVANCED',
    readTime: '16 min',
    labLink: '/modules/forensics/lab',
    takeaways: [
      'RAM holds what disk never does: running and fileless malware, injected code, decryption keys, network state and command history.',
      'Volatility 3 drops the profile system - it uses symbol tables (ISF/PDB) and auto-detects the OS, with plugins namespaced windows./linux./mac.',
      'pslist walks the active process list; psscan carves EPROCESS pool tags to find hidden and terminated processes pslist misses.',
      'malfind locates injected/unmapped executable memory (classic process injection); netscan recovers sockets and connections.',
      'dlllist, handles, cmdline and hashdump extract loaded modules, open handles, full command lines and credential hashes from the dump.',
      'Memory analysis is comparative: hunt for the process that lies - a name that mismatches its parent, path, or signed-module expectations.',
    ],
    content: (
      <div>
        <H3>Why Memory Is Irreplaceable</H3>
        <P>
          Disk forensics can be defeated by encryption, deletion and fileless techniques - but all of those still have to exist in RAM to run. A packed malware sample is unpacked in memory; a PowerShell empire beacon that never writes to disk still has a process and network socket; BitLocker&apos;s volume key sits in RAM while the machine is unlocked. Memory forensics analyses a physical memory image (captured per Chapter 2) to recover exactly this volatile truth. The dominant tool is the Volatility Framework, and since 2020 the actively developed version is Volatility 3, a ground-up rewrite in Python 3.
        </P>

        <H3>Volatility 3: No More Profiles</H3>
        <P>
          Volatility 2 required you to specify a profile - the exact OS build - which was a constant source of friction. Volatility 3 abolishes profiles. It relies on symbol tables: for Windows it fetches the right PDB debug symbols automatically keyed off the kernel; for Linux and macOS you supply an ISF (Intermediate Symbol Format) JSON built from the kernel&apos;s debug info. Plugins are namespaced by OS - windows.pslist, linux.pslist, mac.pslist - and the framework auto-detects the layer and architecture. The invocation is simply the image via -f and the plugin name.
        </P>
        <Pre label="VOLATILITY 3 - ORIENTATION">
{`# Basic form
vol -f host01.raw windows.info

Kernel Base    : 0xf80267a00000
DTB            : 0x1aa000
Is64Bit        : True
NtSystemRoot   : C:/Windows
SystemTime     : 2026-11-03 00:22:41
NtProductType  : NtProductWinNt  (Windows 10 19045)
# windows.info confirms the OS and the capture time - always run it first.`}
        </Pre>

        <H3>pslist vs psscan</H3>
        <P>
          Two plugins enumerate processes by different means, and the difference is the whole point. windows.pslist walks the doubly-linked list of active EPROCESS structures that the kernel maintains - fast and accurate for live processes, but a rootkit can unlink its process from that list (DKOM) to hide. windows.psscan ignores the list and scans physical memory for the pool tags that mark EPROCESS allocations, so it finds processes that have been unlinked or have already exited but whose structure has not yet been overwritten. Diffing the two lists is a classic hunt: a process that psscan sees but pslist does not is either terminated or deliberately hidden.
        </P>
        <Pre label="PROCESS ENUMERATION AND THE pslist/psscan DIFF">
{`vol -f host01.raw windows.pslist

PID    PPID   ImageFileName    CreateTime
4      0      System           2026-11-02 19:03:10
612    4      smss.exe         2026-11-02 19:03:14
848    740    svchost.exe      2026-11-02 19:03:19
5120   848    svvhost.exe      2026-11-02 23:51:11   <- lives under svchost
6710   5120   cmd.exe          2026-11-03 00:04:55

# psscan finds one more that pslist does not list:
vol -f host01.raw windows.psscan | grep -i beacon
8044   5120   beacon.exe       2026-11-03 00:09:02  (exited/unlinked)`}
        </Pre>
        <Note type="tip">
          windows.pstree renders the parent-child hierarchy so lineage anomalies jump out: a svvhost.exe whose parent is svchost but which itself spawns cmd.exe and then a network tool is a beacon-and-hands-on-keyboard pattern worth escalating immediately.
        </Note>

        <H3>malfind - Finding Injected Code</H3>
        <P>
          Process injection is the most common way malware hides inside a legitimate process. windows.malfind scans each process&apos;s virtual address space for memory regions that are private, committed, and marked executable (PAGE_EXECUTE_READWRITE) but are not backed by a file on disk - the signature of injected shellcode, a reflectively-loaded DLL or a hollowed process. malfind dumps the suspicious region and shows a disassembly of its start; an MZ header (4D 5A) at the top of an unbacked RWX region inside explorer.exe is a reflectively-loaded PE and almost always malicious.
        </P>
        <Pre label="malfind - INJECTED EXECUTABLE MEMORY">
{`vol -f host01.raw windows.malfind --pid 848

Process: svchost.exe  PID: 848
Address: 0x1f2a0000  Protection: PAGE_EXECUTE_READWRITE
Vad Tag: VadS   CommitCharge: 33   PrivateMemory: 1

0x1f2a0000  4d 5a 90 00 03 00 00 00   MZ......     <- PE header in RWX
0x1f2a0008  04 00 00 00 ff ff 00 00   ........
0x1f2a0010  b8 00 00 00 00 00 00 00   ........
# Unbacked, private, RWX, MZ at offset 0 -> injected PE. Dump and triage.`}
        </Pre>

        <H3>netscan, cmdline, dlllist and handles</H3>
        <P>
          A cluster of plugins reconstructs what a process was doing. windows.netscan carves network objects out of the pool to recover TCP/UDP endpoints - local and remote address, port, state and owning PID - revealing C2 connections that no longer appear in a live netstat because the socket has closed. windows.cmdline extracts each process&apos;s full command line from its PEB, often exposing the exact flags, URLs or encoded payloads an attacker passed. windows.dlllist shows the modules each process loaded (an unusual DLL loaded from a user Temp folder is a red flag), and windows.handles enumerates open handles - files, registry keys, mutexes and events - where a distinctive mutex name can fingerprint a malware family.
        </P>
        <Pre label="netscan - RECOVERED CONNECTIONS">
{`vol -f host01.raw windows.netscan

Proto  LocalAddr        LocalPort  ForeignAddr      FPort  State        PID
TCPv4  10.0.14.22       49771      185.220.101.17   443    ESTABLISHED  5120
TCPv4  10.0.14.22       49772      185.220.101.17   8443   CLOSE_WAIT   8044
UDPv4  10.0.14.22       57333      *                *      -            5120
# PID 5120 (svvhost.exe) holds a beacon to 185.220.101.17:443.`}
        </Pre>

        <H3>hashdump and Credential Recovery</H3>
        <P>
          Memory contains credentials in several forms. windows.hashdump extracts the SAM database&apos;s NT hashes for local accounts straight from the dump, ready for cracking (Chapter on crypto) or pass-the-hash attribution. The broader lesson is that RAM is where secrets are unavoidably exposed: cached domain credentials, Kerberos tickets, plaintext passwords left in process memory by careless applications, and the LSASS process - whose dump is the memory-forensics equivalent of mimikatz - all surface here. Recovering them helps you understand how far an attacker could have pivoted and which accounts need resetting.
        </P>

        <H3>Rootkits, Drivers and the Comparative Method</H3>
        <P>
          Kernel-level threats hide from user-space tools, so memory forensics drops into the kernel. windows.modules and windows.modscan list loaded drivers (diffing them exposes an unlinked malicious driver); windows.ssdt can reveal hooked system calls; windows.driverirp inspects driver dispatch tables for hooks. The unifying technique across all of memory forensics is comparison: you are hunting for the structure that lies. A process whose in-memory image name disagrees with its on-disk path, a connection owned by a PID that pslist cannot see, a thread whose start address points into unbacked memory, a driver present in physical memory but absent from the module list - each is an inconsistency that honest software does not produce, and that is what you escalate.
        </P>
        <Table
          headers={['Volatility 3 plugin', 'Recovers', 'Hunts for']}
          rows={[
            ['windows.pslist / psscan', 'Active / carved processes', 'Hidden or exited processes'],
            ['windows.pstree', 'Process lineage', 'Anomalous parent-child'],
            ['windows.malfind', 'RWX unbacked memory', 'Injected code / hollowing'],
            ['windows.netscan', 'Sockets + connections', 'C2 channels'],
            ['windows.cmdline', 'Process command lines', 'Encoded payloads, flags'],
            ['windows.dlllist / ldrmodules', 'Loaded modules', 'DLLs from odd paths, unlinked'],
            ['windows.hashdump / lsadump', 'Credential hashes/secrets', 'Compromised accounts'],
          ]}
        />
      </div>
    ),
  },

  // ─────────────────────────── CHAPTER 7 ───────────────────────────
  {
    id: 'timeline-analysis',
    title: 'Timeline Analysis & Super-Timelines',
    difficulty: 'ADVANCED',
    readTime: '15 min',
    labLink: '/modules/forensics/lab',
    takeaways: [
      'A timeline turns scattered artifacts into one chronological account - the backbone of every intrusion narrative.',
      'mactime builds a filesystem (MACB) timeline from a body file; it is fast but sees only timestamps the filesystem records.',
      'Plaso / log2timeline builds a super-timeline, fusing filesystem, registry, event logs, browser, Prefetch and more into one store.',
      'psort filters and renders the Plaso store; always constrain by a time window and timezone or you will drown in millions of events.',
      'Pivoting from one known event (a logon, a Prefetch run) to everything around it is how you find the first and last malicious action.',
      'Beware timestamp pitfalls: timezone skew, clock tampering, FAT local time vs NTFS UTC, and artifacts that record set time, not event time.',
    ],
    content: (
      <div>
        <H3>Why Timelines Win Cases</H3>
        <P>
          Individual artifacts answer narrow questions; a timeline answers the question the client actually asked: what happened, in what order, and when did it start and stop? Timeline analysis places every datable artifact - filesystem timestamps, registry key write times, event-log records, Prefetch runs, browser visits, LNK accesses - onto a single chronological axis. The payoff is twofold: you establish the initial compromise (the earliest malicious event, which scopes the breach and the data at risk) and you reconstruct the attacker&apos;s sequence of actions in a form a non-technical reader can follow. A good timeline is the difference between &quot;malware was present&quot; and &quot;at 23:51 on 2 November a phishing attachment executed, which at 00:04 spawned a C2 beacon, which at 02:00 exfiltrated payroll data.&quot;
        </P>

        <H3>The Filesystem Timeline: body files and mactime</H3>
        <P>
          The lightweight approach, from The Sleuth Kit, is a two-step pipeline. fls walks the filesystem and emits a body file - a pipe-delimited intermediate listing every file with its MACB times, size, ownership and inode/MFT reference. mactime then sorts that body file chronologically and renders it, collapsing the four MACB timestamps per file into discrete timeline events. This is fast and needs only the disk image, but its blind spot is fundamental: it sees only what the filesystem records. It knows a file&apos;s timestamps but nothing of the registry, the event logs or browser history, and it inherits any timestomping in the underlying MACB values.
        </P>
        <Pre label="BUILDING A FILESYSTEM TIMELINE WITH fls + mactime">
{`# 1. Walk the NTFS volume (offset from mmls) into a body file
fls -r -m C: -o 1310720 GN-0042.raw > bodyfile.txt

# 2. Render a chronological timeline for a specific day
mactime -b bodyfile.txt -d -z UTC 2026-11-02 > timeline.csv

Date,Time,Size,Activity,Permissions,Path
2026-11-02,23:51:08,71680,.a.b,-/-rwxrwxrwx,C:/.../Temp/svvhost.exe
2026-11-02,23:58:42,71680,m...,-/-rwxrwxrwx,C:/.../Temp/update.exe
# 'macb' columns show which timestamp fired: here creation, then rename.`}
        </Pre>

        <H3>Super-Timelines with Plaso</H3>
        <P>
          The comprehensive approach is the super-timeline, built with Plaso and its engine log2timeline. Plaso runs dozens of parsers across the image - NTFS $MFT and $UsnJrnl, registry hives, EVTX event logs, Prefetch, SRUM, browser SQLite, LNK and JumpLists, and many more - and writes every extracted event, with its source and a normalised timestamp, into a single storage file (.plaso). The result fuses filesystem and application artifacts into one timeline, so a Prefetch run, the Run key that launched it, the 4688 process-creation event and the resulting network connection all line up to the second. The cost is volume: a workstation image yields millions of events, so filtering is mandatory.
        </P>
        <Pre label="PLASO: log2timeline then psort">
{`# 1. Extract everything into a Plaso storage file
log2timeline.py --storage-file gn0042.plaso GN-0042.raw

[INFO] Processing completed.
  Events extracted : 4,318,662
  Parsers used     : winreg, winevtx, prefetch, srum, sqlite/chrome,
                     lnk, usnjrnl, mft, filestat ...

# 2. Filter + render to CSV for a tight window and timezone
psort.py -z UTC -o l2tcsv -w breach.csv gn0042.plaso
  "date > '2026-11-02 23:00:00' AND date < '2026-11-03 03:00:00'"`}
        </Pre>
        <Note type="tip">
          Run Plaso with a targeted parser list or a date filter from the start on large images. A full parse of a 1 TB disk can take many hours and produce an unmanageable store; triage first, then go deep where the signal is.
        </Note>

        <H3>Reading and Pivoting a Timeline</H3>
        <P>
          A rendered super-timeline is a table sorted by time, each row carrying the timestamp, the timestamp&apos;s meaning (the source and a description like &quot;Content Modification Time&quot; or &quot;Last Run Time&quot;), the source artifact, and the detail. You rarely read it top to bottom. Instead you pivot: anchor on one known event - a suspicious logon, a Prefetch run, a malware file&apos;s creation - and expand outward to see what happened in the seconds and minutes around it. Timeline Explorer (Eric Zimmerman) makes this interactive, letting you sort, filter and colour-tag the Plaso CSV so clusters of attacker activity stand out. The analytic move is always the same: find a foothold event, examine its neighbourhood, and let each new event become the next pivot.
        </P>
        <Pre label="SUPER-TIMELINE EXCERPT (fused sources, one window)">
{`Time (UTC)           Source    Description
23:51:08  2026-11-02 FILE      svvhost.exe created (FN born) Temp/
23:51:11  2026-11-02 PREFETCH  SVVHOST.EXE first run (run count 1)
23:51:12  2026-11-02 EVT       4688 process create svvhost.exe ppid=848
23:52:40  2026-11-02 REG       Run key 'Updater' set -> Temp/svvhost.exe
00:04:55  2026-11-03 EVT       4688 cmd.exe spawned by svvhost.exe
00:09:02  2026-11-03 PREFETCH  BEACON.EXE first run
02:00:00  2026-11-03 SRUM      svvhost.exe 100MB sent on Ethernet
02:07:31  2026-11-03 EVT       4634 logoff  j.doe
# One axis, six artifact sources: initial exec -> persistence -> C2 -> exfil.`}
        </Pre>

        <H3>The Forensic Narrative</H3>
        <P>
          The timeline is raw material; the narrative is the product. From the fused events above you can write a defensible account: a binary was created in a user Temp folder at 23:51 and executed immediately; within a minute a Run key established persistence; a few minutes later it dropped into an interactive command shell and launched a second-stage beacon; two hours later roughly 100 MB left the host, and the user session ended shortly after. Every clause is anchored to a specific artifact from a specific source, with a timestamp. That traceability - claim, artifact, timestamp - is what makes a narrative hold up under challenge, and it is the deliverable that feeds directly into the report of Chapter 10.
        </P>

        <H3>Timestamp Pitfalls</H3>
        <P>
          Timelines are only as trustworthy as their timestamps, and timestamps lie in predictable ways. Timezones are the first trap: NTFS stores UTC but FAT/exFAT store local time, event logs render in the system&apos;s zone, and browsers use their own epochs - always normalise everything to UTC and record the source zone. Clock tampering (an attacker setting the system clock back) and NTP skew can shift whole swathes of events; corroborate against externally-timed sources like server or firewall logs. Remember that many artifacts record when a value was set, not when the underlying event happened - a Shimcache entry&apos;s timestamp is the file&apos;s last-modified time, not its execution time. And timestomped files (Chapter 3) inject deliberate lies, which is why the $UsnJrnl and event logs, harder to forge, are weighted more heavily when accounts conflict.
        </P>
      </div>
    ),
  },

  // ─────────────────────────── CHAPTER 8 ───────────────────────────
  {
    id: 'network-log-forensics',
    title: 'Network & Log Forensics',
    difficulty: 'ADVANCED',
    readTime: '15 min',
    labLink: '/modules/forensics/lab',
    takeaways: [
      'Packet captures are ground truth but expensive to store; flow records (NetFlow/IPFIX) scale to retain who-talked-to-whom for months.',
      'Zeek turns raw pcap into structured, queryable logs (conn, dns, http, ssl, files) that are the backbone of practical network forensics.',
      'Reconstructing a session means following a TCP stream, extracting transferred files, and decoding the application protocol.',
      'Encrypted traffic still leaks: SNI, JA3/JA3S TLS fingerprints, certificate details, timing and volume reveal a great deal without decryption.',
      'DNS, proxy and firewall logs are often the only surviving record of C2 and exfiltration after the packets are long gone.',
      'Correlate network evidence with host artifacts (Chapters 4-7) - a netscan connection plus a firewall log plus SRUM bytes is a complete exfil story.',
    ],
    content: (
      <div>
        <H3>The Spectrum of Network Evidence</H3>
        <P>
          Network forensics works with data at very different resolutions, and choosing the right one is half the discipline. Full packet capture (pcap) is ground truth - every byte on the wire - but storing it at any scale is enormous, so it is usually a short rolling buffer or triggered capture. Flow records (NetFlow, sFlow, IPFIX) summarise each conversation to its metadata - source, destination, ports, protocol, byte and packet counts, start and end - which is tiny by comparison and therefore retained for months, making it the usual source for &quot;who did this host talk to three weeks ago?&quot; Between them sit the structured logs produced by sensors like Zeek, and the application logs from DNS resolvers, proxies and firewalls.
        </P>

        <H3>pcap Analysis for Incident Response</H3>
        <P>
          When you do have packets, Wireshark and its command-line sibling tshark are the primary tools. The forensic workflow is rarely &quot;read every packet&quot;; it is filter, follow and extract. You filter to the conversation of interest, follow the TCP stream to see the application-layer exchange in order, and extract transferred objects - an executable pulled over HTTP, a document exfiltrated, a certificate presented in a TLS handshake. tshark scripts the same operations for large captures and lets you pull specific fields across millions of packets.
        </P>
        <Pre label="EXTRACTING EVIDENCE FROM A PCAP WITH tshark">
{`# Top talkers by bytes - find the exfil conversation
tshark -r capture.pcap -q -z conv,tcp | sort -k9 -n | tail

10.0.14.22:49771 <-> 185.220.101.17:443  2114  112MB  <- large outbound

# Follow and extract the objects carried over HTTP
tshark -r capture.pcap --export-objects http,/evidence/http_objs

# Pull every DNS query name (C2 domains, DGA patterns)
tshark -r capture.pcap -Y dns.flags.response==0
  -T fields -e frame.time -e dns.qry.name | sort -u`}
        </Pre>

        <H3>Zeek: Structured Network Logs</H3>
        <P>
          Zeek (formerly Bro) is the workhorse of scalable network forensics. Fed a pcap or a live tap, it does not store packets; it interprets them and emits structured, tab-separated logs by protocol. conn.log records every connection (the five-tuple, duration, bytes each way, state); dns.log every query and answer; http.log every request with method, host, URI, user-agent and status; ssl.log every TLS handshake with versions, SNI and the JA3 fingerprint; files.log every file seen crossing the wire with its hashes. Because these are queryable text (or fed into a SIEM), you can answer investigative questions across huge traffic volumes that would be hopeless at the packet level.
        </P>
        <Pre label="ZEEK conn.log AND dns.log (field excerpt)">
{`# conn.log - the beacon's heartbeat, regular small connections
ts                 id.orig_h    id.resp_h        resp_p  duration  orig_bytes
00:09:02  11-03    10.0.14.22   185.220.101.17   443     0.41      820
00:14:03  11-03    10.0.14.22   185.220.101.17   443     0.39      816
00:19:03  11-03    10.0.14.22   185.220.101.17   443     0.40      820
# ~5-min interval, near-identical size -> automated C2 beacon.

# dns.log - resolution that preceded the connections
ts                 query                         answers
00:08:58  11-03    cdn-telemetry.example.net     185.220.101.17`}
        </Pre>

        <H3>NetFlow and IPFIX: Months of Who-Talked-to-Whom</H3>
        <P>
          When the question reaches back further than any packet buffer, flow records are the answer. Routers and firewalls export NetFlow (v5/v9) or its IETF successor IPFIX to a collector, summarising each unidirectional conversation into a handful of fields: source and destination address and port, protocol, start and end time, and the packet and byte counts. Because a record is a few dozen bytes regardless of how much data the flow carried, organisations keep flow data for months or years. Tools such as nfdump, SiLK and the flow views in a SIEM let you ask &quot;which internal hosts spoke to 185.220.101.17, when did it start, and how much left?&quot; across the whole estate. Flow cannot show content, but it establishes scope - every other host that touched the same C2 - and anchors the first contact date for the incident timeline.
        </P>
        <Pre label="nfdump: SCOPING THE C2 ACROSS THE ESTATE">
{`nfdump -R /flows/2026/11 -o extended 'dst ip 185.220.101.17'

Date first seen      Duration  Src IP:Port         Dst IP:Port          Bytes
2026-10-29 14:12:08  0.412     10.0.14.22:49102    185.220.101.17:443   818
2026-10-29 14:17:09  0.398     10.0.14.22:49118    185.220.101.17:443   820
2026-11-01 09:40:51  0.405     10.0.14.31:51220    185.220.101.17:443   816
# First contact was 29 October, not 2 November - and a second host, .31,
# is beaconing too. Flow data just widened the scope of the incident.`}
        </Pre>

        <H3>Encrypted Traffic Still Talks</H3>
        <P>
          Most traffic is TLS-encrypted, but encryption hides content, not metadata. The TLS handshake is in the clear: the Server Name Indication (SNI) reveals the intended hostname, the certificate carries issuer, subject and validity, and the precise ordering of cipher suites and extensions in the Client Hello forms a JA3 hash that fingerprints the client software - many malware families and C2 frameworks have well-known JA3/JA3S values. Beyond the handshake, the rhythm of a conversation betrays it: a connection every five minutes of near-identical size is a beacon regardless of what is inside it. So even without a decryption key you can identify the tool, the destination and the behaviour.
        </P>
        <Note type="info">
          JA3 fingerprints the client&apos;s TLS Client Hello; JA3S fingerprints the server&apos;s response. A beacon&apos;s JA3 often matches a public threat-intel entry for a specific C2 framework, giving you attribution from encrypted traffic alone. Newer sensors add JA4+ fingerprints, which are more robust to TLS changes.
        </Note>

        <H3>Log Forensics: DNS, Proxy and Firewall</H3>
        <P>
          By the time you investigate, the packets are usually gone - but the logs remain, and often they are the only network record left. DNS logs are disproportionately valuable: nearly every connection starts with a lookup, so a resolver log captures C2 domains, DGA (domain-generation-algorithm) patterns and DNS-tunnelling (abnormally long or high-entropy query names carrying data). Web proxy logs record every HTTP(S) request with URL, bytes, user-agent and the authenticated user, tying activity to a person. Firewall logs record allowed and denied connections with the five-tuple and timestamps, establishing which outbound sessions actually left the network. These are also the logs an attacker most wants to clear, so their absence or a conspicuous gap is itself evidence.
        </P>
        <Pre label="DNS AND FIREWALL LOG EVIDENCE">
{`# Suspicious DNS: long, high-entropy labels = tunnelling/exfil
2026-11-03 00:31:02  10.0.14.22  A  k7f2x9q1z.a8h3.exfil.example.net
2026-11-03 00:31:03  10.0.14.22  A  m2p9w4t0r.a8h3.exfil.example.net

# Firewall accept log: the outbound session that carried the data
2026-11-03 02:00:04  ACCEPT  10.0.14.22:49771 -> 185.220.101.17:443
  proto=TCP sent=104,857,600 rcvd=210,944 rule=allow-https-out`}
        </Pre>

        <H3>Reconstructing the Session and Correlating with the Host</H3>
        <P>
          The power of network forensics is realised when it meets the host evidence of the previous chapters. On the host, Volatility&apos;s netscan (Chapter 6) showed svvhost.exe (PID 5120) holding a connection to 185.220.101.17:443; SRUM (Chapter 4) attributed ~100 MB of outbound bytes to that binary at 02:00; the timeline (Chapter 7) placed its execution at 23:51. On the network, Zeek&apos;s conn.log shows the five-minute beacon to the same IP, dns.log shows the domain that resolved to it, and the firewall accept log confirms a 104 MB outbound session at exactly 02:00. Two independent vantage points - host and network - converge on one address, one volume and one timestamp. That cross-domain corroboration is the strongest form of forensic proof, and it is only possible because you gathered both.
        </P>
      </div>
    ),
  },

  // ─────────────────────────── CHAPTER 9 ───────────────────────────
  {
    id: 'mobile-cloud-forensics',
    title: 'Mobile & Cloud Forensics',
    difficulty: 'ADVANCED',
    readTime: '15 min',
    labLink: '/modules/forensics/lab',
    takeaways: [
      'Mobile acquisition is tiered: logical backup, filesystem extraction, then full physical - each needing more access and yielding more data.',
      'Almost all app evidence on Android and iOS lives in SQLite databases - messages, location, call logs and app state are rows, not files.',
      'Android (APK sandboxes, /data/data, keystore) and iOS (APFS, Data Protection, Keychain) have different storage and encryption models.',
      'Commercial kits (Cellebrite UFED, Magnet GRAYKEY, Oxygen) handle locks, encryption and parsing that manual methods cannot.',
      'Cloud forensics is log-and-API forensics: CloudTrail, Azure Activity/Entra and GCP Audit logs reconstruct identity-driven attacker actions.',
      'Modern evidence is federated - a case spans the phone, the laptop, the cloud tenant and the chat/email service, and must be correlated across all.',
    ],
    content: (
      <div>
        <H3>The Shift to Phones and the Cloud</H3>
        <P>
          For most people the richest record of their life is now a phone and a set of cloud accounts, not a desktop hard drive. Mobile and cloud forensics are where the majority of modern evidence lives, and both break the comfortable assumptions of dead-box disk forensics. You cannot write-block a phone or an S3 bucket; you often cannot get a true physical image at all; and encryption is pervasive and tied to hardware or identity. The discipline adapts by working through the platform&apos;s own mechanisms - backup protocols, extraction exploits, provider APIs - and by documenting exactly what each method captured and what it could not.
        </P>

        <H3>Mobile Acquisition Tiers</H3>
        <P>
          Mobile acquisition is best understood as a ladder of increasing access and yield. A logical acquisition uses the device&apos;s own backup/sync interface (iTunes/Finder backup on iOS, ADB backup or a vendor protocol on Android) to pull what the OS is willing to export - usually contacts, messages, call logs and some app data, but not deleted content or protected keystores. A filesystem (or &quot;advanced logical&quot;) acquisition reaches the application sandboxes and SQLite databases directly, often requiring an agent, a jailbreak/root, or a vendor exploit. A full physical acquisition images the flash storage bit-for-bit - the most complete, able to recover deleted data from unallocated space - but on modern devices it demands a bootrom/bootloader exploit (for example checkm8 on A5-A11 iPhones) or chip-off, and is defeated on newer hardware by file-based encryption.
        </P>
        <Table
          headers={['Tier', 'Method', 'Recovers', 'Access needed']}
          rows={[
            ['Logical', 'Backup / sync protocol', 'Contacts, SMS, call log, some app data', 'Unlocked or backup password'],
            ['Filesystem', 'Agent / jailbreak / exploit', 'App sandboxes, SQLite, caches', 'Root/jailbreak or vendor tool'],
            ['Physical', 'Bootrom exploit / chip-off', 'Full flash incl. deleted data', 'Hardware exploit, often blocked'],
            ['Cloud-side', 'iCloud/Google account pull', 'Synced backups, photos, location', 'Credentials or legal process'],
          ]}
        />

        <H3>Android Artifacts</H3>
        <P>
          Android gives each app a sandbox under /data/data/&lt;package&gt; (and external storage under /sdcard). The forensic payload is overwhelmingly SQLite: SMS and MMS in mmssms.db, call history in calllog.db, contacts in contacts2.db, and each messaging app&apos;s own store (WhatsApp&apos;s msgstore.db, Signal&apos;s encrypted database). App state, caches, shared-preferences XML and the WebView history round it out. Full-disk or file-based encryption (FBE, standard since Android 10) protects data at rest keyed to the user credential and hardware keystore, so a powered-off, locked modern device is a hard target without the PIN. Deleted SQLite rows frequently persist in the database&apos;s freelist and in write-ahead-log (-wal) files, so recovering &quot;deleted&quot; messages is often a matter of parsing the unused pages.
        </P>
        <Pre label="RECOVERING DELETED SMS FROM AN ANDROID SQLite STORE">
{`# Live rows
sqlite3 mmssms.db "SELECT datetime(date/1000,'unixepoch'),
  address, body FROM sms ORDER BY date DESC LIMIT 3;"
2026-11-01 20:14:07 | +254700000000 | meet at the usual place
2026-11-01 19:02:55 | +254711111111 | did you wipe the laptop

# Deleted rows linger in freelist pages and the WAL
#   carve them with a tool that reads unallocated SQLite pages:
undark -i mmssms.db -t sms --freespace > deleted_sms.csv
# Forensic suites (Cellebrite Physical Analyzer) do this automatically.`}
        </Pre>

        <H3>iOS Artifacts</H3>
        <P>
          iOS stores app data under /private/var/mobile/Containers on an APFS volume, again dominated by SQLite. Key stores include sms.db (iMessage/SMS), the Call History (CallHistory.storedata), the address book, Safari history, photos metadata (Photos.sqlite) and the consolidated location caches. iOS Data Protection encrypts files by class, with keys wrapped by the passcode and the hardware Secure Enclave, so acquisition hinges on unlocking or exploiting the device; the Keychain holds credentials and tokens under the same protection. A crucial iOS artifact is the KnowledgeC database (knowledgeC.db), which records a detailed stream of device and app usage events - app in focus, device locked/unlocked, Bluetooth connections - that can place a user interacting with the phone at precise moments.
        </P>

        <H3>Cellebrite, GrayKey and the Commercial Reality</H3>
        <P>
          Manual methods take you only so far against modern locks and encryption, which is why mobile forensics is dominated by commercial platforms. Cellebrite UFED and Physical Analyzer, Magnet GRAYKEY, and Oxygen Forensic Detective combine acquisition (including lock-bypass and brute-force capabilities that exploit specific chipset or OS vulnerabilities) with parsing that decodes hundreds of app formats into a reviewable timeline. Their value is twofold: access to data that is otherwise locked, and automated normalisation of thousands of SQLite schemas into consistent, court-ready output. The examiner still must understand the underlying artifacts - these tools can misattribute or miss recently-changed app formats - but they are indispensable at scale.
        </P>
        <Note type="warn">
          Device-unlock capabilities exploit specific, patchable vulnerabilities and are a moving target; what a tool can acquire depends on the exact model, chipset and OS version. Always record the device identifiers, OS build and the tool/method used, because reproducibility and the limits of the extraction are part of the finding.
        </Note>

        <H3>Cloud Forensics</H3>
        <P>
          Cloud forensics inverts the disk model: there is rarely a disk to image, and the evidence is the audit trail of identity-driven API calls. In AWS, CloudTrail logs every API action with the caller identity, source IP, parameters and timestamp; VPC Flow Logs add network metadata; GuardDuty and config history add context. Azure provides the Activity Log, Entra ID (formerly Azure AD) sign-in and audit logs, and Microsoft 365&apos;s Unified Audit Log; GCP provides Cloud Audit Logs (Admin Activity, Data Access). The investigative questions change accordingly: not &quot;what file was opened?&quot; but &quot;which identity assumed which role, from which IP, and what did it touch?&quot; You preserve the logs first (attackers disable CloudTrail or delete log buckets early), snapshot affected volumes through the provider API for any disk-level analysis, and reconstruct the attacker&apos;s path through the control plane.
        </P>
        <Pre label="AWS CloudTrail: RECONSTRUCTING AN IDENTITY ATTACK">
{`# A single CloudTrail record (fields trimmed)
eventTime        : 2026-11-03T00:41:12Z
eventName        : AssumeRole
sourceIPAddress  : 185.220.101.17
userIdentity     : arn:aws:iam::acct:user/ci-deploy
requestParameters: roleArn = arn:aws:iam::acct:role/AdminRole

# Follow the assumed role's actions:
eventName        : GetSecretValue        (SecretsManager, 9 secrets)
eventName        : CreateAccessKey        (new persistence key)
eventName        : StopLogging            (CloudTrail!) <- anti-forensics
# Same source IP as the on-prem beacon in Chapter 8 -> one campaign.`}
        </Pre>

        <H3>Chat, Email and the Federated Case</H3>
        <P>
          The last piece is communications, which now span host, mobile and cloud at once. Email forensics still turns on message headers - the Received chain, originating IP, SPF/DKIM/DMARC results and Message-ID - to establish provenance and detect spoofing, whether the mailbox is a local PST/OST or a cloud tenant pulled via eDiscovery. Chat evidence lives in app SQLite stores on devices and in provider-side exports (Slack, Teams, WhatsApp). The defining feature of a modern investigation is that it is federated: the same actor appears as a process in a laptop&apos;s memory, a beacon in the firewall logs, an assumed role in CloudTrail, and a message in a chat export. The forensic task - and the through-line of this whole module - is to correlate those vantage points into one coherent, timestamped account of what happened.
        </P>
      </div>
    ),
  },

  // ─────────────────────────── CHAPTER 10 ───────────────────────────
  {
    id: 'reporting-career',
    title: 'Reporting, the Courtroom & the DFIR Career',
    difficulty: 'ADVANCED',
    readTime: '15 min',
    labLink: '/modules/forensics/lab',
    takeaways: [
      'The report is the deliverable - a finding no one can read, reproduce or defend has no value, however brilliant the analysis.',
      'A defensible report separates fact from opinion, states confidence honestly, and lets an independent examiner reproduce every conclusion.',
      'Expert testimony demands you explain complex artifacts in plain language and concede the limits of your evidence under cross-examination.',
      'SOPs and validated, documented tooling make your lab’s work repeatable and admissible - process is as important as skill.',
      'Triage tooling (KAPE for artifact collection, Velociraptor for fleet-scale hunting) is how modern DFIR scales beyond one disk at a time.',
      'The field rewards continuous learning: certifications (GCFA, GCFE, GNFA, GX-FA/GREM) map the body of knowledge and a home lab builds the reps.',
    ],
    content: (
      <div>
        <H3>The Report Is the Product</H3>
        <P>
          Every technique in this module exists to produce one thing: a report that a decision-maker can rely on. Judges, juries, HR panels, insurers and executives do not watch you work; they read your conclusions. An examination that recovers the smoking-gun artifact but is written up ambiguously, overstates its certainty, or cannot be reproduced is worse than useless - it can collapse under cross-examination and discredit the whole case. The report is therefore not an afterthought; it is the deliverable, and the discipline of writing it well shapes how you conduct the analysis in the first place.
        </P>

        <H3>Anatomy of a Defensible Report</H3>
        <P>
          A forensic report has a predictable, deliberate structure. It opens with an executive summary written for a non-technical reader - what was asked, what was found, and what it means in one page. It states the scope and authorisation, the evidence items with their hashes and chain-of-custody references, and the tools and versions used. The body presents findings, each as a claim supported by specific artifacts and timestamps, with screenshots or extracts as exhibits. Crucially it separates fact from interpretation: &quot;Prefetch records four executions of svvhost.exe&quot; is a fact; &quot;this indicates the attacker ran the tool repeatedly&quot; is an interpretation, and the two must never blur. It states confidence levels honestly and records what was not found or could not be determined. An appendix lists the full methodology so an independent examiner can reproduce the work.
        </P>
        <Pre label="FINDING STRUCTURE: CLAIM - EVIDENCE - CONFIDENCE">
{`Finding 3 - Data exfiltration of payroll records

  Claim      : ~100 MB was transferred from FIN-WS-14 to
               185.220.101.17 between 02:00-02:08 on 2026-11-03.
  Evidence   : SRUM SRUDB.dat (svvhost.exe, 104,857,600 bytes sent);
               firewall accept log 02:00:04 matching five-tuple;
               Zeek conn.log session; Volatility netscan PID 5120.
  Timestamps : all normalised to UTC; sources cross-verified.
  Confidence : High - four independent artifacts agree.
  Caveats    : Exact file contents not recoverable from network
               data (TLS-encrypted); contents inferred from the
               payroll LNK and ShellBag on the host.`}
        </Pre>
        <Note type="info">
          Write for the reader who will challenge you. Every sentence of fact should trace to an artifact in your evidence; every sentence of opinion should be labelled as such and carry a confidence level. Hedge where the evidence is thin and commit where it is strong - mis-calibrated certainty, in either direction, is what opposing experts attack.
        </Note>

        <H3>The Courtroom and Expert Testimony</H3>
        <P>
          When a case goes to court the examiner may testify, as a fact witness to what they did or an expert witness offering opinion. The skills are different from analysis. You must translate $MFT FN-vs-SI timestamp discrepancies into language a jury understands, without dumbing it down to the point of inaccuracy. You must concede the limits of your evidence honestly - a Prefetch file proves a program ran, not who sat at the keyboard - because an expert who overclaims is dismantled on cross-examination and takes the case down with them. Preparation means knowing your report cold, anticipating the opposing expert&apos;s challenges (timezone handling, tool validation, anti-forensics), and being able to show that your method is reproducible and your tools are tested. Credibility, once lost on the stand, does not come back.
        </P>

        <H3>SOPs, Validation and Quality</H3>
        <P>
          Reproducibility is engineered, not hoped for. Mature labs run on Standard Operating Procedures: documented, version-controlled steps for acquisition, analysis and reporting so that two examiners handle the same evidence the same way and a reviewer can audit the work. Tools are validated against known datasets (NIST&apos;s CFTT, the Hacking Case and other reference images) so you can state a tool&apos;s error characteristics. Dual-tool verification - confirming a key finding with a second, independent tool - guards against a single tool&apos;s parsing bug. Peer review of reports catches overstatement and gaps before they reach a client or a court. ISO/IEC 17025 accreditation formalises all of this. None of it is glamorous, and all of it is what separates a defensible finding from an unprovable assertion.
        </P>

        <H3>Triage at Scale: KAPE and Velociraptor</H3>
        <P>
          Full imaging of every machine does not scale to a 10,000-endpoint enterprise, so modern DFIR leans on targeted triage. KAPE (Kroll Artifact Parser and Extractor) uses Targets to collect just the high-value artifacts from a live or mounted system - $MFT, registry hives, EVTX, Prefetch, SRUM, browser stores - in minutes, then Modules to run parsers (the Eric Zimmerman tools and others) across them automatically. Velociraptor goes further: an open-source endpoint platform that hunts across an entire fleet at once using its VQL query language, collecting artifacts, running Volatility, and answering &quot;which of my 10,000 hosts has this IOC?&quot; in one sweep. These tools do not replace deep single-image analysis; they tell you which images are worth analysing deeply.
        </P>
        <Pre label="RAPID TRIAGE COLLECTION WITH KAPE">
{`# Collect key artifacts from a mounted image to an output tree,
# then run the parser modules over what was collected.
kape.exe --tsource C: --tdest E:/triage/FIN-WS-14
  --target KapeTriage
  --mdest E:/triage/FIN-WS-14/out --module !EZParser

  Collected : $MFT, $J, SYSTEM, SOFTWARE, NTUSER.DAT, *.evtx,
              Prefetch, SRUDB.dat, Amcache.hve, browser stores
  Parsed    : MFTECmd, PECmd, SrumECmd, RECmd, EvtxECmd -> CSV
# Minutes per host instead of hours; feeds straight into a timeline.`}
        </Pre>

        <H3>Building a Career and a Lab</H3>
        <P>
          Digital forensics rewards methodical, curious people who enjoy reconstructing events from fragments, and it is a field of continuous learning because the artifacts change with every OS and app release. Certifications map the body of knowledge and signal competence: SANS/GIAC&apos;s GCFA (advanced incident-response forensics), GCFE (Windows examiner), GNFA (network forensics) and GREM (malware reverse engineering), alongside the GX-FA and vendor tracks from Cellebrite, Magnet and others. But certifications only frame the reps; skill comes from doing. Build a home lab - a few VMs, free tools (The Sleuth Kit, Autopsy, Volatility 3, Plaso, the Eric Zimmerman suite, Zeek, Velociraptor), and the public reference images and CTF-style challenges (DFIR CTFs, the SANS reading-room cases, published memory and disk images) to practise on.
        </P>
        <Table
          headers={['Area', 'Free / open tools', 'Certification', 'Practice material']}
          rows={[
            ['Disk / filesystem', 'Sleuth Kit, Autopsy, EZ tools', 'GCFE', 'NIST CFReDS, Hacking Case'],
            ['Memory', 'Volatility 3, MemProcFS', 'GCFA', 'Public memory samples, CTFs'],
            ['Timeline', 'Plaso, Timeline Explorer', 'GCFA', 'Intrusion disk images'],
            ['Network', 'Zeek, Wireshark, Arkime', 'GNFA', 'Malware-Traffic-Analysis pcaps'],
            ['Triage / fleet', 'KAPE, Velociraptor', 'GX-FA / vendor', 'Lab VMs, enterprise sims'],
            ['Malware RE', 'Ghidra, x64dbg, YARA', 'GREM', 'Sandboxed samples'],
          ]}
        />
        <P>
          The through-line of this entire module is that forensics is a chain of corroboration ending in a defensible account: acquire soundly, preserve integrity, analyse each artifact for what it truly proves, fuse them on a timeline across host, network, mobile and cloud, and write it up so that an independent examiner - or a hostile one - reaches the same conclusion. Master that discipline and the specific tools, which will keep changing, become details. The method endures.
        </P>
      </div>
    ),
  },
]

export default function ForensicsPage() {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Breadcrumb */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem',
        fontFamily: mono, fontSize: '0.7rem', color: '#5a8a92'
      }}>
        <Link href="/" style={{ color: '#5a8a92', textDecoration: 'none' }}>GHOSTNET</Link>
        <span>&#8250;</span>
        <span style={{ color: accent }}>MOD-18 // DIGITAL FORENSICS</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link href="/modules/forensics/lab" style={{
            fontFamily: mono, fontSize: '0.65rem', color: '#5a8a92',
            textDecoration: 'none', letterSpacing: '0.05em'
          }}>
            THE EVIDENCE ROOM LAB &#8594;
          </Link>
        </div>
      </div>

      {/* Page header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{
          fontFamily: mono, fontSize: '9px', letterSpacing: '0.2em',
          color: '#5a8a92', textTransform: 'uppercase', marginBottom: '0.5rem'
        }}>
          MODULE 18 &middot; FORENSICS
        </div>
        <h1 style={{
          fontFamily: mono, fontSize: '2rem', fontWeight: 700, color: accent,
          margin: '0.5rem 0', lineHeight: 1.1, textShadow: '0 0 20px rgba(92,207,224,0.4)'
        }}>
          DIGITAL FORENSICS: FOLLOW THE EVIDENCE
        </h1>
        <p style={{ color: '#5a8a92', fontFamily: mono, fontSize: '0.75rem', lineHeight: 1.6 }}>
          Acquisition &middot; Filesystem &middot; Windows artifacts &middot; Memory (Volatility 3) &middot; Timelines (Plaso) &middot; Network &amp; logs &middot; Mobile &amp; cloud &middot; Reporting
        </p>
      </div>

      {/* Chapter overview stats */}
      <div className="module-stat-grid">
        {[
          ['10', 'CHAPTERS'],
          ['~3.5hr', 'TOTAL READ'],
          ['ADVANCED', 'DIFFICULTY'],
          ['MOD-18', 'IDENTIFIER'],
        ].map(([val, label], i) => (
          <div key={i} style={{ background: 'rgba(92,207,224,0.04)', border: '1px solid rgba(92,207,224,0.15)', borderRadius: '6px', padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontFamily: mono, fontSize: '1.2rem', fontWeight: 700, color: accent }}>{val}</div>
            <div style={{ fontFamily: mono, fontSize: '0.6rem', color: '#1d4852', letterSpacing: '0.15em', marginTop: '2px' }}>{label}</div>
          </div>
        ))}
      </div>

      <ModuleCodex moduleId="forensics" accent={accent} chapters={chapters} />

      {/* Bottom navigation */}
      <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid #0a2028' }}>
        <div style={{ background: 'rgba(92,207,224,0.04)', border: '1px solid rgba(92,207,224,0.2)', borderRadius: '8px', padding: '2rem', textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontFamily: mono, fontSize: '0.65rem', color: '#1d4852', letterSpacing: '0.25em', marginBottom: '0.5rem' }}>READY TO PRACTICE?</div>
          <div style={{ fontFamily: mono, fontSize: '1rem', color: accent, marginBottom: '0.5rem', fontWeight: 600 }}>MOD-18 Interactive Lab — The Evidence Room</div>
          <div style={{ fontFamily: mono, fontSize: '0.75rem', color: '#1d4852', marginBottom: '1.5rem' }}>20 steps &middot; 420 XP &middot; Real tools &middot; Flag captures</div>
          <Link href="/modules/forensics/lab" style={{ textDecoration: 'none', fontFamily: mono, fontSize: '0.85rem', color: accent, padding: '12px 32px', border: '1px solid rgba(92,207,224,0.6)', borderRadius: '6px', background: 'rgba(92,207,224,0.1)', fontWeight: 700, letterSpacing: '0.12em', boxShadow: '0 0 20px rgba(92,207,224,0.15)', display: 'inline-block' }}>
            LAUNCH LAB &#8594;
          </Link>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Link href="/modules/forensics/lab" style={{ textDecoration: 'none', fontFamily: mono, fontSize: '0.75rem', color: '#1d4852' }}>THE EVIDENCE ROOM &#8594;</Link>
        </div>
      </div>
    </div>
  )
}
