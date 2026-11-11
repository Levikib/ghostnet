'use client'
import React, { useMemo } from 'react'

/**
 * Procedural operator sigil: a mirrored 5x5 glyph inside a hexagon, generated
 * from a seed string, so every operator gets a unique, recognisable mark
 * without uploading a photo.
 */
function hash(s: string): number[] {
  let h1 = 0x811c9dc5, h2 = 0x1b873593
  const out: number[] = []
  for (let round = 0; round < 4; round++) {
    for (let i = 0; i < s.length; i++) {
      h1 = Math.imul(h1 ^ s.charCodeAt(i), 16777619)
      h2 = Math.imul(h2 ^ (s.charCodeAt(i) + round), 2246822519)
    }
    out.push((h1 ^ h2) >>> 0)
  }
  return out
}

export const AVATAR_COLORS = ['#00ff41', '#00d4ff', '#ffb347', '#bf5fff', '#ff4136', '#ff6ec7', '#aaff00', '#7c4dff']

export default function OperatorAvatar({ seed, color, size = 64, glow = true, title }: { seed: string; color?: string | null; size?: number; glow?: boolean; title?: string }) {
  const { cells, c } = useMemo(() => {
    const h = hash(seed || 'ghost')
    const bits: boolean[] = []
    for (let i = 0; i < 15; i++) bits.push(((h[i % 4] >>> (i * 2)) & 3) > 1)
    const grid: boolean[][] = []
    for (let y = 0; y < 5; y++) {
      const row: boolean[] = []
      for (let x = 0; x < 3; x++) row.push(bits[y * 3 + x])
      grid.push([row[0], row[1], row[2], row[1], row[0]])
    }
    return { cells: grid, c: color || AVATAR_COLORS[h[0] % AVATAR_COLORS.length] }
  }, [seed, color])

  const hex = '50,3 93,27 93,73 50,97 7,73 7,27'
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={title || 'Operator sigil'} style={{ display: 'block', filter: glow ? 'drop-shadow(0 0 ' + Math.round(size / 10) + 'px ' + c + '66)' : undefined }}>
      <defs>
        <clipPath id={'hx-' + size}><polygon points={hex} /></clipPath>
      </defs>
      <polygon points={hex} fill="#020a02" stroke={c} strokeWidth="2.5" />
      <g clipPath={'url(#hx-' + size + ')'}>
        <rect x="0" y="0" width="100" height="100" fill={c} opacity="0.06" />
        {cells.map((row, y) => row.map((on, x) => on ? (
          <rect key={x + '-' + y} x={22 + x * 11.2} y={22 + y * 11.2} width="10.2" height="10.2" fill={c} opacity={0.55 + ((x + y) % 3) * 0.15} />
        ) : null))}
      </g>
      <polygon points="50,12 82,30 82,70 50,88 18,70 18,30" fill="none" stroke={c} strokeOpacity="0.25" strokeWidth="1" />
    </svg>
  )
}
