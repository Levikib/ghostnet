'use client'
import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '../components/AuthProvider'
import { api } from '../../lib/client/api'
import { PATHS, LearningPath, pathModules } from '../../lib/paths'
import { CATALOG } from '../../lib/learning'
import { moduleReadiness } from '../../lib/assess/engine'
import { Eyebrow, GxStyles, Ring, T, accentText } from '../components/gx/Gx'
import { Decode, HackStyles } from '../components/hack/Hack'
import CityNet from '../components/hack/CityNet'

const READY_LABEL: Record<string, { t: string; c: string }> = {
  skip: { t: 'SKIP', c: T.green },
  review: { t: 'SKIM', c: T.amber },
  learn: { t: 'LEARN', c: T.dimHi },
}

export default function PathsPage() {
  const router = useRouter()
  const { profile, loading, refreshProfile } = useAuth()
  const [selected, setSelected] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const modById = useMemo(() => new Map((profile?.modules || []).map(m => [m.id, m])), [profile])
  const catById = useMemo(() => new Map(CATALOG.map(m => [m.id, m])), [])
  const readiness = useMemo(
    () => (profile?.placement_done && profile.placement_results ? moduleReadiness(profile.placement_results) : null),
    [profile],
  )

  if (loading) return <div style={{ minHeight: '50vh' }} />

  const chosen = profile?.chosen_path || null
  const open = selected ? PATHS.find(p => p.id === selected) : null

  function pathProgress(p: LearningPath) {
    const mods = pathModules(p)
    const done = mods.filter(id => modById.get(id)?.labCompleted && (modById.get(id)?.percent || 0) >= 100).length
    const pct = mods.length ? Math.round((mods.reduce((a, id) => a + (modById.get(id)?.percent || 0), 0)) / mods.length) : 0
    return { done, total: mods.length, pct }
  }

  async function choosePath(id: string) {
    if (!profile) { router.push('/auth?mode=login&from=/paths'); return }
    setSaving(true)
    await api('/api/path', { pathId: id }, 'POST')
    await refreshProfile()
    setSaving(false)
  }

  function startNext(p: LearningPath) {
    const mods = pathModules(p)
    const next = mods.find(id => !(modById.get(id)?.labCompleted && (modById.get(id)?.percent || 0) >= 100)) || mods[0]
    router.push('/modules/' + next)
  }

  return (
    <div className="pa-root">
      <GxStyles /><HackStyles />
      <CityNet intensity={0.3} style={{ opacity: 0.4, zIndex: 0 }} />
      <div className="pa-wrap">
        <header style={{ marginBottom: '22px' }}>
          <Eyebrow>{'// LEARNING PATHS'}</Eyebrow>
          <h1 className="pa-h1"><Decode text={open ? open.title.toUpperCase() : 'CHOOSE YOUR PATH'} duration={600} /></h1>
          {!open && (
            <p className="pa-lead">
              A path is an ordered route to a goal — zero to operator. Pick one and your dashboard guides you step by step.
              {profile?.placement_done
                ? ' Based on your calibration, modules are marked skip, skim or learn.'
                : ' '}
              {!profile?.placement_done && <> <Link href="/assess" style={{ color: T.cyan }}>Take the 10-minute placement</Link> to mark what you can skip.</>}
            </p>
          )}
          {open && <button className="gx-btn gx-btn--ghost" style={{ marginTop: '14px' }} onClick={() => setSelected(null)}>◂ ALL PATHS</button>}
        </header>

        {!open && (
          <div className="pa-grid">
            {PATHS.map(p => {
              const pr = pathProgress(p)
              const isMine = chosen === p.id
              return (
                <div key={p.id} className={'gx-clay pa-card' + (isMine ? ' mine' : '')} style={{ ['--accent' as string]: p.color } as React.CSSProperties}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                    <div style={{ minWidth: 0 }}>
                      <h2 className="pa-title" style={{ color: accentText(p.color) }}>{p.title}</h2>
                      <p className="pa-tag">{p.tagline}</p>
                    </div>
                    {isMine && <span className="hx-tag" style={{ color: T.green, flex: 'none' }}>YOUR PATH</span>}
                  </div>
                  <p className="pa-for">{p.forWho}</p>
                  <div className="pa-stages">
                    {p.stages.map((s, idx) => <span key={idx} className="pa-stage">{s.title}</span>)}
                  </div>
                  <div className="pa-meta">
                    <span>{pr.total} MODULES</span>
                    {p.cert && <span>{p.cert}</span>}
                    {pr.pct > 0 && <span style={{ color: T.cyan }}>{pr.pct}% DONE</span>}
                  </div>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '16px', flexWrap: 'wrap' }}>
                    <button className="gx-btn gx-btn--secondary" style={{ ['--accent' as string]: p.color } as React.CSSProperties} onClick={() => setSelected(p.id)}>VIEW PATH</button>
                    {isMine
                      ? <button className="gx-btn gx-btn--ghost" onClick={() => startNext(p)}>CONTINUE ▸</button>
                      : <button className="gx-btn gx-btn--ghost" disabled={saving} onClick={() => choosePath(p.id)}>CHOOSE</button>}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {open && (
          <div className="hx-in">
            <div className="gx-clay pa-card" style={{ ['--accent' as string]: open.color, marginBottom: '20px' } as React.CSSProperties}>
              <p style={{ fontFamily: T.sans, fontSize: '15px', color: T.body, lineHeight: 1.6, margin: 0 }}>{open.forWho}</p>
              <p style={{ fontFamily: T.sans, fontSize: '14px', color: T.dim, margin: '8px 0 0' }}><b style={{ color: accentText(open.color) }}>Outcome:</b> {open.outcome}{open.cert ? ' · Aligns toward ' + open.cert : ''}</p>
              <div style={{ display: 'flex', gap: '10px', marginTop: '18px', flexWrap: 'wrap' }}>
                {chosen === open.id
                  ? <button className="gx-btn gx-btn--primary" onClick={() => startNext(open)}>CONTINUE THIS PATH ▸</button>
                  : <button className="gx-btn gx-btn--primary" disabled={saving} onClick={() => choosePath(open.id)}>{saving ? 'SAVING…' : 'MAKE THIS MY PATH ▸'}</button>}
                {!profile?.placement_done && <Link href="/assess" className="gx-btn gx-btn--ghost">CALIBRATE FIRST</Link>}
              </div>
            </div>

            <div className="pa-stages-full">
              {open.stages.map((stage, si) => (
                <div key={si} className="pa-stage-block">
                  <div className="pa-stage-head">
                    <span className="pa-stage-num" style={{ color: accentText(open.color) }}>{String(si + 1).padStart(2, '0')}</span>
                    <div>
                      <div className="pa-stage-title">{stage.title}</div>
                      <div className="pa-stage-blurb">{stage.blurb}</div>
                    </div>
                  </div>
                  <div className="pa-mods">
                    {stage.modules.map(id => {
                      const cat = catById.get(id)
                      const mp = modById.get(id)
                      if (!cat) return null
                      const rd = readiness?.[id]
                      const done = mp?.labCompleted && (mp?.percent || 0) >= 100
                      return (
                        <Link key={id} href={'/modules/' + id} className="pa-mod" style={{ ['--accent' as string]: cat.color } as React.CSSProperties}>
                          <Ring value={mp?.percent || 0} size={44} width={5} color={done ? T.green : cat.color} />
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div className="pa-mod-title">{cat.title}</div>
                            <div className="pa-mod-sub">MOD-{cat.code} · {cat.level}</div>
                          </div>
                          {done
                            ? <span className="hx-tag" style={{ color: T.green }}>OWNED</span>
                            : rd && <span className="hx-tag" style={{ color: READY_LABEL[rd].c }}>{READY_LABEL[rd].t}</span>}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .pa-root { position: relative; min-height: 100%; color: var(--tx); }
        .pa-root > :not(canvas) { position: relative; z-index: 1; }
        .pa-wrap { max-width: 1100px; margin: 0 auto; padding: 24px 0 60px; }
        .pa-h1 { font-family: var(--mono); font-weight: 800; font-size: clamp(26px, 5vw, 40px); letter-spacing: .06em; color: var(--tx); margin: 10px 0 14px; }
        .pa-lead { font-family: var(--sans); font-size: 15.5px; line-height: 1.65; color: var(--tx-body); max-width: 72ch; margin: 0; }
        .pa-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 320px), 1fr)); gap: 18px; }
        .pa-card { padding: 22px; }
        .pa-card.mine { box-shadow: var(--e-clay), 0 0 0 1px rgba(0,255,65,.3); }
        .pa-title { font-family: var(--mono); font-size: 19px; font-weight: 700; letter-spacing: .03em; margin: 0; }
        .pa-tag { font-family: var(--sans); font-size: 14px; color: var(--tx-body); margin: 6px 0 0; line-height: 1.45; }
        .pa-for { font-family: var(--sans); font-size: 13.5px; color: var(--tx-dim); margin: 12px 0 0; line-height: 1.5; }
        .pa-stages { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 14px; }
        .pa-stage { font-family: var(--mono); font-size: 10.5px; letter-spacing: .1em; color: var(--tx-dim-hi); background: rgba(232,243,246,.05); padding: 4px 8px; border-radius: 6px; }
        .pa-meta { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 14px; font-family: var(--mono); font-size: 10.5px; letter-spacing: .12em; color: var(--tx-dim); }
        .pa-stages-full { display: grid; gap: 14px; }
        .pa-stage-block { border-left: 2px solid rgba(232,243,246,.1); padding-left: 16px; }
        .pa-stage-head { display: flex; gap: 12px; align-items: baseline; margin-bottom: 12px; }
        .pa-stage-num { font-family: var(--mono); font-size: 18px; font-weight: 800; }
        .pa-stage-title { font-family: var(--sans); font-weight: 650; font-size: 17px; color: var(--tx); }
        .pa-stage-blurb { font-family: var(--sans); font-size: 13.5px; color: var(--tx-dim); margin-top: 2px; }
        .pa-mods { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 260px), 1fr)); gap: 10px; }
        .pa-mod { display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 12px; text-decoration: none; background: var(--clay-face); box-shadow: var(--e-clay); border: 1px solid rgba(232,243,246,.05); transition: transform .14s, box-shadow .14s; }
        .pa-mod:hover { transform: translateY(-2px); box-shadow: var(--e-clay-hi), 0 0 0 1px color-mix(in srgb, var(--accent) 30%, transparent); }
        .pa-mod-title { font-family: var(--sans); font-weight: 600; font-size: 14.5px; color: var(--tx); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .pa-mod-sub { font-family: var(--mono); font-size: 10.5px; color: var(--tx-dim); margin-top: 3px; letter-spacing: .06em; }
      `}</style>
    </div>
  )
}
