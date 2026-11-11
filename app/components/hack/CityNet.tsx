'use client'
import React, { useEffect, useRef } from 'react'

/**
 * Background "city network": a top-down street grid of devices (cameras,
 * routers, phones, ATMs) linked along the streets, with data packets
 * running between them and profiler tags popping up on random nodes.
 * Canvas, paused when the tab is hidden, a single still frame for reduced motion.
 */

type Node = { x: number; y: number; kind: number; pulse: number; owned: number }
type Edge = { a: number; b: number }
type Packet = { e: number; t: number; v: number; dir: 1 | -1; c: string }
type Tag = { n: number; life: number; text: string; sub: string }

const KINDS = ['CAM', 'RTR', 'PHN', 'ATM', 'IOT', 'SRV']
const SUBS = ['PORT 554 OPEN', 'WPA2 · WEAK KEY', 'BATTERY 41%', 'FIRMWARE 2019', 'TELNET ENABLED', 'DEFAULT CREDS', 'TLS 1.0', 'UPnP EXPOSED']

export default function CityNet({ intensity = 1, accent = '#00d4ff', style }: { intensity?: number; accent?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const intensityRef = useRef(intensity)
  intensityRef.current = intensity

  useEffect(() => {
    const cv = ref.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    if (!ctx) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let W = 0, H = 0, dpr = 1
    let nodes: Node[] = [], edges: Edge[] = [], adj: number[][] = []
    let blocks: { x: number; y: number; w: number; h: number }[] = []
    const packets: Packet[] = []
    const tags: Tag[] = []
    let raf = 0, last = 0, running = true, tagTimer = 0

    function build() {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      W = cv!.clientWidth; H = cv!.clientHeight
      cv!.width = Math.floor(W * dpr); cv!.height = Math.floor(H * dpr)
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      const cell = W < 640 ? 64 : 84
      const cols = Math.ceil(W / cell) + 2, rows = Math.ceil(H / cell) + 2
      nodes = []; edges = []; blocks = []
      const idx: number[][] = []
      for (let r = 0; r < rows; r++) {
        idx[r] = []
        for (let c = 0; c < cols; c++) {
          // Building footprint inside each block
          if (Math.random() < 0.8) {
            const pad = 8 + Math.random() * 10
            blocks.push({ x: (c - 1) * cell + pad, y: (r - 1) * cell + pad, w: cell - pad * 2 - Math.random() * 18, h: cell - pad * 2 - Math.random() * 18 })
          }
          if (Math.random() < 0.42) {
            idx[r][c] = nodes.length
            nodes.push({ x: (c - 1) * cell + (Math.random() < 0.5 ? 0 : cell / 2), y: (r - 1) * cell, kind: Math.floor(Math.random() * KINDS.length), pulse: Math.random() * 6, owned: 0 })
          } else idx[r][c] = -1
        }
      }
      // Link along streets: nearest node to the right and below.
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const a = idx[r][c]
        if (a < 0) continue
        for (let k = c + 1; k < Math.min(cols, c + 4); k++) if (idx[r][k] >= 0) { edges.push({ a, b: idx[r][k] }); break }
        for (let k = r + 1; k < Math.min(rows, r + 4); k++) if (idx[k][c] >= 0) { edges.push({ a, b: idx[k][c] }); break }
      }
      adj = nodes.map(() => [])
      edges.forEach((e, i) => { adj[e.a].push(i); adj[e.b].push(i) })
      packets.length = 0
      const n = Math.min(70, Math.floor(edges.length * 0.25))
      for (let i = 0; i < n; i++) spawn()
    }

    function spawn() {
      if (!edges.length) return
      const r = Math.random()
      packets.push({ e: Math.floor(Math.random() * edges.length), t: Math.random(), v: 0.25 + Math.random() * 0.6, dir: Math.random() < 0.5 ? 1 : -1, c: r < 0.12 ? '#ff4136' : r < 0.3 ? '#00ff41' : accent })
    }

    function edgePath(e: Edge) {
      const A = nodes[e.a], B = nodes[e.b]
      return { ax: A.x, ay: A.y, bx: B.x, by: B.y }
    }

    function draw(now: number) {
      const dt = Math.min(0.05, (now - (last || now)) / 1000)
      last = now
      const I = intensityRef.current
      ctx!.clearRect(0, 0, W, H)
      ctx!.save()

      // Buildings
      ctx!.strokeStyle = 'rgba(232,243,246,0.045)'
      ctx!.lineWidth = 1
      for (const b of blocks) ctx!.strokeRect(b.x + 0.5, b.y + 0.5, b.w, b.h)

      // Links
      ctx!.strokeStyle = 'rgba(0,212,255,' + (0.07 + 0.05 * I) + ')'
      ctx!.beginPath()
      for (const e of edges) { const p = edgePath(e); ctx!.moveTo(p.ax, p.ay); ctx!.lineTo(p.bx, p.by) }
      ctx!.stroke()

      // Packets with short trails
      for (const pk of packets) {
        pk.t += pk.dir * pk.v * dt * (0.6 + I)
        if (pk.t > 1 || pk.t < 0) {
          // Arrived at a node: light it up and hop onto one of its links.
          const node = pk.t > 1 ? edges[pk.e].b : edges[pk.e].a
          nodes[node].pulse = 0
          const opts = adj[node]
          const ne = opts[Math.floor(Math.random() * opts.length)]
          pk.e = ne
          pk.dir = edges[ne].a === node ? 1 : -1
          pk.t = pk.dir === 1 ? 0 : 1
        }
        const p = edgePath(edges[pk.e])
        const x = p.ax + (p.bx - p.ax) * pk.t, y = p.ay + (p.by - p.ay) * pk.t
        const tl = 0.18 * pk.dir
        const tx = p.ax + (p.bx - p.ax) * Math.max(0, Math.min(1, pk.t - tl)), ty = p.ay + (p.by - p.ay) * Math.max(0, Math.min(1, pk.t - tl))
        const g = ctx!.createLinearGradient(tx, ty, x, y)
        g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, pk.c)
        ctx!.strokeStyle = g; ctx!.lineWidth = 1.6
        ctx!.beginPath(); ctx!.moveTo(tx, ty); ctx!.lineTo(x, y); ctx!.stroke()
        ctx!.fillStyle = pk.c
        ctx!.fillRect(x - 1.5, y - 1.5, 3, 3)
      }

      // Nodes
      for (const n of nodes) {
        n.pulse += dt
        const glow = Math.max(0, 1 - n.pulse * 1.6)
        ctx!.fillStyle = 'rgba(232,243,246,' + (0.22 + glow * 0.6) + ')'
        ctx!.fillRect(n.x - 2, n.y - 2, 4, 4)
        if (glow > 0) {
          ctx!.strokeStyle = 'rgba(0,212,255,' + glow * 0.5 + ')'
          const s = 4 + (1 - glow) * 10
          ctx!.strokeRect(n.x - s, n.y - s, s * 2, s * 2)
        }
      }

      // Profiler tags
      tagTimer -= dt
      if (tagTimer <= 0 && nodes.length) {
        tagTimer = 1.1 + Math.random() * 1.6
        const ni = Math.floor(Math.random() * nodes.length)
        const nd = nodes[ni]
        if (nd.x > 20 && nd.x < W - 180 && nd.y > 40 && nd.y < H - 40) {
          tags.push({ n: ni, life: 3.2, text: KINDS[nd.kind] + '_' + Math.floor(1000 + Math.random() * 8999), sub: SUBS[Math.floor(Math.random() * SUBS.length)] })
          if (tags.length > 4) tags.shift()
        }
      }
      ctx!.font = '10px JetBrains Mono, monospace'
      for (let i = tags.length - 1; i >= 0; i--) {
        const tg = tags[i]
        tg.life -= dt
        if (tg.life <= 0) { tags.splice(i, 1); continue }
        const n = nodes[tg.n]
        const a = Math.min(1, tg.life * 2, (3.2 - tg.life) * 4)
        const lx = n.x + 26, ly = n.y - 26
        ctx!.strokeStyle = 'rgba(232,243,246,' + a * 0.7 + ')'
        ctx!.lineWidth = 1
        ctx!.beginPath(); ctx!.moveTo(n.x, n.y); ctx!.lineTo(lx, ly); ctx!.lineTo(lx + 120, ly); ctx!.stroke()
        ctx!.strokeRect(n.x - 7, n.y - 7, 14, 14)
        ctx!.fillStyle = 'rgba(232,243,246,' + a + ')'
        ctx!.fillText(tg.text, lx + 2, ly - 5)
        ctx!.fillStyle = 'rgba(255,179,71,' + a * 0.9 + ')'
        ctx!.fillText(tg.sub, lx + 2, ly + 12)
      }
      ctx!.restore()
    }

    function loop(now: number) {
      if (!running) return
      draw(now)
      raf = requestAnimationFrame(loop)
    }

    build()
    if (reduced) draw(performance.now())
    else raf = requestAnimationFrame(loop)

    const onVis = () => {
      if (reduced) return
      if (document.hidden) { running = false; cancelAnimationFrame(raf) }
      else if (!running) { running = true; last = 0; raf = requestAnimationFrame(loop) }
    }
    let rt: ReturnType<typeof setTimeout>
    const onResize = () => { clearTimeout(rt); rt = setTimeout(() => { build(); if (reduced) draw(performance.now()) }, 150) }
    document.addEventListener('visibilitychange', onVis)
    window.addEventListener('resize', onResize)
    return () => { running = false; cancelAnimationFrame(raf); document.removeEventListener('visibilitychange', onVis); window.removeEventListener('resize', onResize); clearTimeout(rt) }
  }, [accent])

  return <canvas ref={ref} aria-hidden="true" style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', ...style }} />
}
