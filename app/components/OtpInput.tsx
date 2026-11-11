'use client'
import React, { useEffect, useRef } from 'react'

/** Six separate digit boxes: auto-advance, backspace, arrow keys, paste a whole code, auto-submit on the sixth digit. */
export default function OtpInput({ value, onChange, onComplete, disabled, error, accent = '#00ff41' }: {
  value: string
  onChange: (v: string) => void
  onComplete?: (v: string) => void
  disabled?: boolean
  error?: boolean
  accent?: string
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([])
  const digits = Array.from({ length: 6 }, (_, i) => value[i] || '')

  useEffect(() => { refs.current[0]?.focus() }, [])
  useEffect(() => { if (error) refs.current[Math.min(value.length, 5)]?.focus() }, [error, value.length])

  function set(next: string) {
    const clean = next.replace(/\D/g, '').slice(0, 6)
    onChange(clean)
    if (clean.length === 6) onComplete?.(clean)
  }

  return (
    <div style={{ display: 'flex', gap: 'clamp(6px, 2vw, 10px)', justifyContent: 'center' }} role="group" aria-label="6-digit code">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={el => { refs.current[i] = el }}
          value={d}
          disabled={disabled}
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          aria-label={'Digit ' + (i + 1)}
          maxLength={6}
          onChange={e => {
            const v = e.target.value.replace(/\D/g, '')
            if (v.length > 1) { set(v); refs.current[Math.min(v.length, 5)]?.focus(); return }
            const arr = digits.slice()
            arr[i] = v
            set(arr.join(''))
            if (v && i < 5) refs.current[i + 1]?.focus()
          }}
          onKeyDown={e => {
            if (e.key === 'Backspace' && !digits[i] && i > 0) { refs.current[i - 1]?.focus(); const arr = digits.slice(); arr[i - 1] = ''; set(arr.join('')) }
            if (e.key === 'ArrowLeft' && i > 0) refs.current[i - 1]?.focus()
            if (e.key === 'ArrowRight' && i < 5) refs.current[i + 1]?.focus()
          }}
          onPaste={e => { e.preventDefault(); const t = e.clipboardData.getData('text'); set(t); refs.current[Math.min(t.replace(/\D/g, '').length, 5)]?.focus() }}
          onFocus={e => e.target.select()}
          className={'gn-otp' + (error ? ' gn-otp-err' : '') + (d ? ' gn-otp-filled' : '')}
          style={{
            width: 'clamp(40px, 11vw, 52px)', height: 'clamp(50px, 13vw, 62px)', textAlign: 'center',
            fontFamily: 'JetBrains Mono, monospace', fontSize: 'clamp(1.3rem, 5vw, 1.7rem)', fontWeight: 700,
            color: error ? '#ff4136' : accent, background: 'rgba(0,20,4,0.7)',
            border: '1px solid ' + (error ? 'rgba(255,65,54,0.7)' : d ? accent : 'rgba(0,255,65,0.22)'),
            borderRadius: '6px', outline: 'none', caretColor: accent,
            boxShadow: d ? '0 0 16px ' + accent + '33, inset 0 0 12px ' + accent + '14' : 'none',
            transition: 'border-color .15s, box-shadow .15s, transform .15s',
          }}
        />
      ))}
    </div>
  )
}
