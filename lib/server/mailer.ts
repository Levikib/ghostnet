import tls from 'node:tls'
import { randomBytes } from 'node:crypto'

/**
 * Tiny SMTP client (implicit TLS, port 465) so GHOSTNET can send through
 * Gmail with an app password and no extra npm dependency.
 *
 * Env: SMTP_USER (the Gmail address), SMTP_PASS (16-char app password),
 * optional SMTP_HOST (default smtp.gmail.com), SMTP_PORT (465), MAIL_FROM_NAME.
 */

type Mail = { to: string; subject: string; html: string; text: string }

function enc(s: string): string {
  return '=?UTF-8?B?' + Buffer.from(s, 'utf8').toString('base64') + '?='
}

function wrap76(b64: string): string {
  return b64.replace(/.{1,76}/g, '$&\r\n')
}

export async function sendMail(mail: Mail): Promise<void> {
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS?.replace(/\s+/g, '')
  if (!user || !pass) throw new Error('SMTP_USER / SMTP_PASS not set')
  const host = process.env.SMTP_HOST || 'smtp.gmail.com'
  const port = Number(process.env.SMTP_PORT || 465)
  const fromName = process.env.MAIL_FROM_NAME || 'GHOSTNET'

  const boundary = 'gn_' + randomBytes(12).toString('hex')
  const msgId = '<' + randomBytes(16).toString('hex') + '@ghostnet>'
  const body = [
    'From: ' + enc(fromName) + ' <' + user + '>',
    'To: <' + mail.to + '>',
    'Subject: ' + enc(mail.subject),
    'Date: ' + new Date().toUTCString(),
    'Message-ID: ' + msgId,
    'MIME-Version: 1.0',
    'Content-Type: multipart/alternative; boundary="' + boundary + '"',
    '',
    '--' + boundary,
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    wrap76(Buffer.from(mail.text, 'utf8').toString('base64')),
    '--' + boundary,
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    wrap76(Buffer.from(mail.html, 'utf8').toString('base64')),
    '--' + boundary + '--',
    '',
  ].join('\r\n')

  await new Promise<void>((resolve, reject) => {
    const socket = tls.connect({ host, port, servername: host })
    let buf = ''
    const queue: { expect: number; send?: string }[] = [
      { expect: 220, send: 'EHLO ghostnet' },
      { expect: 250, send: 'AUTH LOGIN' },
      { expect: 334, send: Buffer.from(user).toString('base64') },
      { expect: 334, send: Buffer.from(pass).toString('base64') },
      { expect: 235, send: 'MAIL FROM:<' + user + '>' },
      { expect: 250, send: 'RCPT TO:<' + mail.to + '>' },
      { expect: 250, send: 'DATA' },
      { expect: 354, send: body.replace(/^\./gm, '..') + '\r\n.' },
      { expect: 250, send: 'QUIT' },
    ]
    const timer = setTimeout(() => { socket.destroy(); reject(new Error('SMTP timeout')) }, 15000)
    const fail = (e: Error) => { clearTimeout(timer); socket.destroy(); reject(e) }
    socket.setEncoding('utf8')
    socket.on('error', fail)
    socket.on('data', (chunk: string) => {
      buf += chunk
      // A complete reply ends with a line "NNN text" (space after the code, not '-').
      const lines = buf.split('\r\n')
      const last = lines.filter(Boolean).pop() || ''
      if (!/^\d{3} /.test(last)) return
      buf = ''
      const code = Number(last.slice(0, 3))
      const step = queue.shift()
      if (!step) { clearTimeout(timer); socket.end(); resolve(); return }
      if (code !== step.expect) { fail(new Error('SMTP ' + code + ': ' + last.slice(4, 200))); return }
      if (step.send === 'QUIT') { socket.write('QUIT\r\n'); clearTimeout(timer); resolve(); socket.end(); return }
      if (step.send) socket.write(step.send + '\r\n')
    })
  })
}

// ── Templates ───────────────────────────────────────────────────

const SITE = () => process.env.NEXT_PUBLIC_SITE_URL || 'https://ghostnet-nine.vercel.app'

function shell(title: string, inner: string): string {
  return '<!doctype html><html><body style="margin:0;background:#020602;padding:32px 12px;font-family:Menlo,Consolas,monospace">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">' +
    '<table role="presentation" width="100%" style="max-width:520px;background:#040d04;border:1px solid #124012;border-radius:10px" cellpadding="0" cellspacing="0">' +
    '<tr><td style="padding:22px 28px;border-bottom:1px solid #0d2a0d">' +
    '<span style="display:inline-block;border:1px solid #00ff41;color:#00ff41;font-weight:700;font-size:12px;padding:5px 7px;border-radius:4px">GN</span>' +
    '<span style="color:#00ff41;font-weight:700;letter-spacing:4px;font-size:14px;margin-left:10px">GHOSTNET</span></td></tr>' +
    '<tr><td style="padding:28px">' +
    '<div style="color:#5f9f5f;font-size:11px;letter-spacing:3px;margin-bottom:10px">' + title + '</div>' + inner +
    '</td></tr>' +
    '<tr><td style="padding:16px 28px;border-top:1px solid #0d2a0d;color:#3f6f3f;font-size:11px;line-height:1.6">' +
    'GHOSTNET · hands-on cybersecurity labs · <a href="' + SITE() + '" style="color:#00d4ff">' + SITE().replace(/^https?:\/\//, '') + '</a></td></tr>' +
    '</table></td></tr></table></body></html>'
}

function codeBlock(code: string): string {
  return '<div style="font-size:34px;letter-spacing:12px;color:#00ff41;font-weight:700;background:#020a02;border:1px dashed #1f5f1f;border-radius:8px;padding:18px;text-align:center;margin:18px 0">' + code + '</div>'
}

const p = (s: string) => '<p style="color:#b8d8b8;font-size:14px;line-height:1.7;margin:0 0 12px">' + s + '</p>'
const muted = (s: string) => '<p style="color:#5f8f5f;font-size:12px;line-height:1.6;margin:14px 0 0">' + s + '</p>'

export function verifyEmailMail(to: string, username: string, code: string): Mail {
  return {
    to,
    subject: code + ' is your GHOSTNET access code',
    text: 'Operator ' + username + ',\n\nYour GHOSTNET verification code is ' + code + '. It expires in 10 minutes.\n\nIf you did not create a GHOSTNET account, ignore this email.',
    html: shell('IDENTITY VERIFICATION', p('Operator <b style="color:#00ff41">' + username + '</b>, enter this code to activate your GHOSTNET identity:') + codeBlock(code) + muted('It expires in 10 minutes. If you did not create a GHOSTNET account, you can ignore this email.')),
  }
}

export function resetMail(to: string, code: string): Mail {
  return {
    to,
    subject: code + ' is your GHOSTNET reset code',
    text: 'Your GHOSTNET password reset code is ' + code + '. It expires in 10 minutes. If you did not ask to reset your password, ignore this email; your password has not changed.',
    html: shell('PASSWORD RESET', p('Use this code to set a new password:') + codeBlock(code) + muted('It expires in 10 minutes. If you did not ask for this, ignore this email; your password has not changed.')),
  }
}

export function loginAlertMail(to: string, username: string, device: string, location: string, ip: string, when: Date): Mail {
  const row = (k: string, v: string) => '<tr><td style="color:#5f8f5f;font-size:12px;padding:4px 14px 4px 0">' + k + '</td><td style="color:#d8f0d8;font-size:13px">' + v + '</td></tr>'
  return {
    to,
    subject: 'New sign-in to your GHOSTNET account',
    text: 'Operator ' + username + ', your account was signed in from a new device.\n\nDevice: ' + device + '\nLocation: ' + location + '\nIP: ' + ip + '\nTime: ' + when.toUTCString() + '\n\nIf this was you, no action is needed. If not, reset your password and sign out all sessions from your profile: ' + SITE() + '/profile',
    html: shell('NEW DEVICE DETECTED', p('Operator <b style="color:#00ff41">' + username + '</b>, your account was just signed in from a device we have not seen before.') +
      '<table role="presentation" style="margin:14px 0">' + row('Device', device) + row('Location', location) + row('IP address', ip) + row('Time', when.toUTCString()) + '</table>' +
      p('If this was you, no action is needed.') +
      p('If it was not, <a href="' + SITE() + '/auth?mode=forgot" style="color:#ff4136">reset your password</a> and sign out every session from <a href="' + SITE() + '/profile" style="color:#00d4ff">your profile</a>.')),
  }
}

export function existingAccountMail(to: string): Mail {
  return {
    to,
    subject: 'GHOSTNET: someone tried to register with your email',
    text: 'Someone tried to create a GHOSTNET account with this email address, which already has an account. If it was you, sign in or reset your password at ' + SITE() + '/auth. If not, you can ignore this email.',
    html: shell('REGISTRATION ATTEMPT', p('Someone tried to create a GHOSTNET account with this email address, which already has one.') + p('If it was you, <a href="' + SITE() + '/auth" style="color:#00d4ff">sign in</a> or <a href="' + SITE() + '/auth?mode=forgot" style="color:#00d4ff">reset your password</a>. If not, you can ignore this email.')),
  }
}

export function securityNoticeMail(to: string, what: string): Mail {
  return {
    to,
    subject: 'GHOSTNET security notice: ' + what,
    text: 'Security change on your GHOSTNET account: ' + what + '. If this was not you, reset your password immediately at ' + SITE() + '/auth?mode=forgot',
    html: shell('SECURITY NOTICE', p('A security setting on your account just changed: <b style="color:#00ff41">' + what + '</b>.') + p('If this was not you, <a href="' + SITE() + '/auth?mode=forgot" style="color:#ff4136">reset your password</a> right away.')),
  }
}
