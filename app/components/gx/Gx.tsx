'use client'
import React from 'react'

/**
 * GHOSTNET learner design system: "2079 HUD x dark clay".
 * Rule: round means touch (clay: buttons, chips, cards you press, your progress),
 * square means read (HUD frames: code, terminal, data, intel).
 */

export const T = {
  ink: '#04070a', s1: '#0a1218', s2: '#101b23', s3: '#17242e', s4: '#1e2e39',
  tx: '#e8f3f6', body: '#c9d9df', dim: '#7d93a0', dimHi: '#93a8b4', line: '#33444f', lineHi: '#5b6f7b',
  cyan: '#00d4ff', green: '#00ff41', amber: '#ffb347', red: '#ff4136', redTx: '#ff6b5e', purple: '#bf5fff', purpleTx: '#cf8bff',
  mono: 'JetBrains Mono, ui-monospace, monospace', sans: 'DM Sans, system-ui, sans-serif',
}

/** Accent colours that are too dark for small text get a lighter text variant. */
export function accentText(c: string) {
  const map: Record<string, string> = { '#7c4dff': '#a68bff', '#bf5fff': '#cf8bff', '#ff4136': '#ff6b5e', '#ff3333': '#ff6b5e' }
  return map[c.toLowerCase()] || c
}

/** Progress ring on a clay disc. */
export function Ring({ value, size = 72, width = 7, color = T.cyan, label, children }: {
  value: number; size?: number; width?: number; color?: string; label?: string; children?: React.ReactNode
}) {
  const v = Math.max(0, Math.min(100, Math.round(value)))
  return (
    <div className="gx-ring" role="progressbar" aria-valuenow={v} aria-valuemin={0} aria-valuemax={100} aria-label={label || v + '% complete'}
      style={{ ['--size' as string]: size + 'px', ['--w' as string]: width + 'px', ['--accent' as string]: color, ['--p' as string]: v } as React.CSSProperties}>
      <b>{children ?? v + '%'}</b>
    </div>
  )
}

/** Clay progress bar. */
export function Bar({ value, color = T.cyan, label, height = 12 }: { value: number; color?: string; label?: string; height?: number }) {
  const v = Math.max(0, Math.min(100, value))
  return (
    <div className="gx-bar" role="progressbar" aria-valuenow={Math.round(v)} aria-valuemin={0} aria-valuemax={100} aria-label={label}
      style={{ ['--accent' as string]: color, height } as React.CSSProperties}>
      <i style={{ width: v + '%' }} />
    </div>
  )
}

export function Eyebrow({ children, color = T.cyan, style }: { children: React.ReactNode; color?: string; style?: React.CSSProperties }) {
  return <div style={{ fontFamily: T.mono, fontSize: '11px', fontWeight: 600, letterSpacing: '.22em', textTransform: 'uppercase', color, ...style }}>{children}</div>
}

/** Paste-once stylesheet for the learner UI. */
export function GxStyles() {
  return (
    <style>{`
      :root {
        --ink:#04070a; --s1:#0a1218; --s2:#101b23; --s3:#17242e; --s4:#1e2e39;
        --tx:#e8f3f6; --tx-body:#c9d9df; --tx-dim:#7d93a0; --tx-dim-hi:#93a8b4; --line:#33444f; --line-hi:#5b6f7b;
        --cyan:#00d4ff; --green:#00ff41; --amber:#ffb347; --red:#ff4136; --red-tx:#ff6b5e;
        --accent: var(--cyan);
        --mono:'JetBrains Mono', ui-monospace, monospace; --sans:'DM Sans', system-ui, sans-serif;
        --ease-out:cubic-bezier(.2,.8,.2,1); --ease-spring:cubic-bezier(.34,1.56,.64,1);
        --clay-face: linear-gradient(160deg,#1c2a35 0%,#141f28 50%,#0f1820 100%);
        --clay-face-hi: linear-gradient(160deg,#21313d 0%,#172430 50%,#111c25 100%);
        --e-clay: inset 0 1px 0 rgba(255,255,255,.09), inset 0 10px 18px -10px rgba(255,255,255,.06), inset 0 -4px 8px rgba(0,0,0,.38), 0 2px 3px rgba(0,0,0,.55), 0 14px 28px -10px rgba(0,0,0,.75);
        --e-clay-hi: inset 0 1px 0 rgba(255,255,255,.11), inset 0 12px 20px -10px rgba(255,255,255,.08), inset 0 -4px 8px rgba(0,0,0,.4), 0 4px 6px rgba(0,0,0,.5), 0 22px 40px -12px rgba(0,0,0,.8);
        --e-pressed: inset 0 3px 8px rgba(0,0,0,.6), inset 0 -1px 0 rgba(255,255,255,.05), 0 1px 0 rgba(255,255,255,.04);
        --e-well: inset 0 2px 6px rgba(0,0,0,.65), inset 0 -1px 0 rgba(255,255,255,.06);
      }
      .gx-clay { position: relative; border-radius: 20px; background: var(--clay-face); border: 1px solid rgba(232,243,246,.05); box-shadow: var(--e-clay); color: var(--tx); isolation: isolate; }
      .gx-clay::after { content: ''; position: absolute; inset: 0; border-radius: inherit; pointer-events: none; z-index: -1;
        background: radial-gradient(120% 80% at 0% 0%, color-mix(in srgb, var(--accent) 10%, transparent), transparent 60%); }
      .gx-hit { cursor: pointer; text-decoration: none; transition: transform .24s var(--ease-out), box-shadow .24s var(--ease-out), background .24s; }
      .gx-hit:hover { transform: translateY(-2px); background: var(--clay-face-hi); box-shadow: var(--e-clay-hi), 0 0 0 1px color-mix(in srgb, var(--accent) 28%, transparent); }
      .gx-hit:active { transform: translateY(1px); box-shadow: var(--e-pressed); transition-duration: 90ms; }
      .gx-hit:focus-visible, .gx-btn:focus-visible, .gx-chip:focus-visible { outline: 2px solid var(--cyan); outline-offset: 3px; }

      .gx-btn { position: relative; isolation: isolate; display: inline-flex; align-items: center; justify-content: center; gap: 10px; min-height: 44px; padding: 0 22px;
        border: 0; background: none; cursor: pointer; text-decoration: none; font: 700 12.5px/1 var(--mono); letter-spacing: .18em; text-transform: uppercase; transition: transform .16s var(--ease-out), filter .24s, color .16s; }
      .gx-btn--primary { color: var(--ink); min-height: 48px; padding: 0 28px; filter: drop-shadow(0 2px 2px rgba(0,0,0,.6)) drop-shadow(0 10px 18px rgba(0,212,255,.18)); }
      .gx-btn--primary::before { content: ''; position: absolute; inset: 0; z-index: -1; clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
        background: linear-gradient(180deg,#f6fcfe 0%,#d3e5eb 100%); box-shadow: inset 0 2px 0 rgba(255,255,255,.95), inset 0 -4px 0 rgba(4,7,10,.2); transition: background .16s; }
      .gx-btn--primary:hover::before { background: linear-gradient(180deg,#6ee8ff 0%,#00bfe6 100%); }
      .gx-btn--primary:hover { transform: translateY(-1px); filter: drop-shadow(0 3px 3px rgba(0,0,0,.6)) drop-shadow(0 14px 26px rgba(0,212,255,.35)); }
      .gx-btn--primary:active { transform: translateY(1px); }
      .gx-btn--secondary { color: var(--tx); border-radius: 14px; background: var(--clay-face); box-shadow: var(--e-clay); border: 1px solid color-mix(in srgb, var(--accent) 25%, transparent); }
      .gx-btn--secondary:hover { transform: translateY(-1px); box-shadow: var(--e-clay-hi); color: #fff; }
      .gx-btn--secondary:active { transform: translateY(1px); box-shadow: var(--e-pressed); }
      .gx-btn--ghost { color: var(--tx-dim-hi); border: 1px solid var(--line-hi); font-size: 11.5px; min-height: 40px; }
      .gx-btn--ghost:hover { color: var(--tx); border-color: var(--cyan); background: rgba(0,212,255,.05); }

      .gx-chip { display: inline-flex; align-items: center; gap: 6px; height: 34px; padding: 0 14px; border-radius: 999px; font: 600 11px/1 var(--mono); letter-spacing: .14em; text-transform: uppercase;
        color: var(--tx-dim-hi); background: var(--clay-face); box-shadow: var(--e-clay); border: 1px solid rgba(232,243,246,.05); cursor: pointer; transition: all .16s var(--ease-out); text-decoration: none; }
      .gx-chip:hover { color: var(--tx); transform: translateY(-1px); }
      .gx-chip[aria-pressed="true"] { color: var(--cyan); box-shadow: var(--e-pressed); background: var(--s1); transform: none; }

      .gx-bar { border-radius: 999px; background: var(--s1); box-shadow: var(--e-well); overflow: hidden; padding: 2px; box-sizing: border-box; }
      .gx-bar > i { display: block; height: 100%; border-radius: inherit;
        background: linear-gradient(180deg, color-mix(in srgb, var(--accent) 70%, #fff) 0%, var(--accent) 55%, color-mix(in srgb, var(--accent) 70%, #000) 100%);
        box-shadow: inset 0 1px 0 rgba(255,255,255,.5), 0 0 12px color-mix(in srgb, var(--accent) 45%, transparent); transition: width .42s var(--ease-spring); }

      @property --p { syntax: '<number>'; inherits: true; initial-value: 0; }
      .gx-ring { width: var(--size); aspect-ratio: 1; border-radius: 50%; position: relative; display: grid; place-items: center; flex: none;
        background: var(--clay-face); box-shadow: var(--e-clay); transition: --p .7s var(--ease-out); }
      .gx-ring::before { content: ''; position: absolute; inset: 5px; border-radius: 50%;
        background: conic-gradient(var(--accent) calc(var(--p) * 1%), rgba(255,255,255,.07) 0);
        -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - var(--w)), #000 calc(100% - var(--w) + 1px));
                mask: radial-gradient(farthest-side, transparent calc(100% - var(--w)), #000 calc(100% - var(--w) + 1px));
        filter: drop-shadow(0 0 6px color-mix(in srgb, var(--accent) 50%, transparent)); }
      .gx-ring > b { font: 700 calc(var(--size) * .2)/1 var(--mono); font-variant-numeric: tabular-nums; color: var(--tx); position: relative; }

      .hx-tag { display: inline-block; font-family: var(--mono); font-size: 10.5px; font-weight: 600; letter-spacing: .18em; padding: 4px 8px; border: 1px solid currentColor; line-height: 1; }
      .gx-hud { position: relative; border: 1px solid rgba(232,243,246,.08); background: linear-gradient(180deg, rgba(10,18,24,.85), rgba(4,7,10,.9)); }
      .gx-hud::before, .gx-hud::after { content: ''; position: absolute; width: 12px; height: 12px; border: 0 solid var(--accent); pointer-events: none; }
      .gx-hud::before { top: -1px; left: -1px; border-top-width: 2px; border-left-width: 2px; }
      .gx-hud::after { bottom: -1px; right: -1px; border-bottom-width: 2px; border-right-width: 2px; }

      @media (prefers-reduced-motion: reduce) {
        .gx-hit, .gx-btn, .gx-chip, .gx-bar > i, .gx-ring { transition-duration: .01ms !important; }
        .gx-hit:hover, .gx-btn:hover, .gx-chip:hover { transform: none !important; }
      }
    `}</style>
  )
}
