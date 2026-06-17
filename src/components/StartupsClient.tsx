'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

const STAGES = ['All', 'IDEA', 'VALIDATION', 'MVP', 'GROWTH', 'SCALING']
const STAGE_LABELS: Record<string, string> = {
  All: 'All', IDEA: 'Idea', VALIDATION: 'Validation', MVP: 'MVP', GROWTH: 'Growth', SCALING: 'Scaling'
}

const stageBadge: Record<string, string> = {
  IDEA: 'badge badge-idea', VALIDATION: 'badge badge-validation',
  MVP: 'badge badge-mvp', GROWTH: 'badge badge-growth', SCALING: 'badge badge-scaling',
}

type Startup = {
  id: string; name: string; tagline: string; stage: string
  city: string | null; tags: string[]; lookingFor: string[]
  user: { name: string | null; city: string | null }
}

export default function StartupsClient({ startups }: { startups: Startup[] }) {
  const searchParams  = useSearchParams()

  const [search,     setSearch]     = useState('')
  const [stage,      setStage]      = useState('All')
  const [lookingFor, setLookingFor] = useState('All')

  // Seed filter from URL param (e.g. /startups?lookingFor=Investor)
  useEffect(() => {
    const lf = searchParams.get('lookingFor')
    if (lf) setLookingFor(lf)
  }, [searchParams])

  // Build the deduplicated list of all lookingFor values across startups
  const lookingForOptions = useMemo(() => {
    const all = startups.flatMap(s => s.lookingFor)
    const unique = Array.from(new Set(all)).sort()
    return ['All', ...unique]
  }, [startups])

  const filtered = useMemo(() => startups.filter(s => {
    const q = search.toLowerCase()
    const matchSearch = !q ||
      s.name.toLowerCase().includes(q) ||
      s.tagline.toLowerCase().includes(q) ||
      s.tags.some(t => t.toLowerCase().includes(q)) ||
      (s.city ?? '').toLowerCase().includes(q)
    const matchStage     = stage      === 'All' || s.stage === stage
    const matchLookingFor = lookingFor === 'All' || s.lookingFor.includes(lookingFor)
    return matchSearch && matchStage && matchLookingFor
  }), [startups, search, stage, lookingFor])

  const hasActiveFilter = search || stage !== 'All' || lookingFor !== 'All'

  return (
    <div>
      {/* ── FILTER BAR ───────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 36 }}>

        {/* Search */}
        <div style={{ position: 'relative' }}>
          <svg
            style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--n400)', pointerEvents: 'none' }}
            width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8"/><path strokeLinecap="round" d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search by name, tag, or city…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%',
              height: 44,
              paddingLeft: 40, paddingRight: 14,
              fontSize: 14, fontFamily: 'inherit',
              background: '#fff',
              border: '1px solid var(--n200)',
              borderRadius: 10,
              outline: 'none',
              color: 'var(--ink)',
              transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
              boxShadow: 'var(--sh-xs)',
            }}
            onFocus={e => {
              e.target.style.borderColor = 'var(--brand)'
              e.target.style.boxShadow = '0 0 0 3px rgba(232,74,0,0.09)'
            }}
            onBlur={e => {
              e.target.style.borderColor = 'var(--n200)'
              e.target.style.boxShadow = 'var(--sh-xs)'
            }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{
                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                background: 'var(--n200)', border: 'none', cursor: 'pointer',
                width: 20, height: 20, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--n600)', fontSize: 12, fontWeight: 700,
              }}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        {/* Stage pills */}
        <div>
          <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', letterSpacing: '0.7px', textTransform: 'uppercase', marginBottom: 8 }}>Stage</p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {STAGES.map(s => {
              const active = stage === s
              return (
                <button
                  key={s}
                  onClick={() => setStage(s)}
                  style={{
                    height: 32,
                    padding: '0 14px',
                    fontSize: 12,
                    fontWeight: 600,
                    fontFamily: 'inherit',
                    borderRadius: 'var(--r-full)',
                    border: active ? '1px solid var(--brand)' : '1px solid var(--n200)',
                    background: active ? 'var(--brand)' : '#fff',
                    color: active ? '#fff' : 'var(--n600)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: active ? '0 1px 4px rgba(232,74,0,0.2)' : 'var(--sh-xs)',
                    letterSpacing: '0.1px',
                  }}
                >
                  {STAGE_LABELS[s]}
                </button>
              )
            })}
          </div>
        </div>

        {/* Looking For pills */}
        {lookingForOptions.length > 1 && (
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', letterSpacing: '0.7px', textTransform: 'uppercase', marginBottom: 8 }}>Looking For</p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {lookingForOptions.map(opt => {
                const active = lookingFor === opt
                return (
                  <button
                    key={opt}
                    onClick={() => setLookingFor(opt)}
                    style={{
                      height: 32,
                      padding: '0 14px',
                      fontSize: 12,
                      fontWeight: 600,
                      fontFamily: 'inherit',
                      borderRadius: 'var(--r-full)',
                      border: active ? '1.5px solid var(--brand)' : '1px solid var(--n200)',
                      background: active ? 'var(--brand-light)' : '#fff',
                      color: active ? 'var(--brand)' : 'var(--n600)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: active ? '0 0 0 3px rgba(232,74,0,0.09)' : 'var(--sh-xs)',
                      letterSpacing: '0.1px',
                    }}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── RESULT META ──────────────────────────────── */}
      <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 500, marginBottom: 20, letterSpacing: '0.2px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <span>
          {filtered.length === startups.length
            ? `${filtered.length} ${filtered.length === 1 ? 'startup' : 'startups'}`
            : `${filtered.length} of ${startups.length} startups`}
        </span>
        {hasActiveFilter && (
          <button
            onClick={() => { setSearch(''); setStage('All'); setLookingFor('All') }}
            style={{
              fontSize: 11, fontWeight: 600, color: 'var(--brand)',
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              fontFamily: 'inherit', letterSpacing: '0.1px',
            }}
          >
            Clear filters ×
          </button>
        )}
      </div>

      {/* ── EMPTY STATE ──────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="card empty-state" style={{ padding: '80px 32px' }}>
          <div style={{
            width: 56, height: 56,
            background: 'var(--n100)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 20,
          }}>
            <svg width="24" height="24" fill="none" stroke="var(--n400)" strokeWidth="1.75" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path strokeLinecap="round" d="M21 21l-4.35-4.35"/>
            </svg>
          </div>
          <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--n700)', marginBottom: 6 }}>No startups found</p>
          <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 24 }}>
            {search ? `No results for "${search}". Try a different search.` : 'Try a different filter combination.'}
          </p>
          {hasActiveFilter && (
            <button
              onClick={() => { setSearch(''); setStage('All'); setLookingFor('All') }}
              className="btn btn-secondary btn-sm"
              style={{ fontFamily: 'inherit' }}
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        /* ── CARD GRID ─────────────────────────────── */
        <div className="startups-grid">
          {filtered.map(s => (
            <Link
              key={s.id}
              href={`/startups/${s.id}`}
              className="card card-interactive"
              style={{
                display: 'flex', flexDirection: 'column',
                padding: '24px', textDecoration: 'none', color: 'inherit',
                gap: 0,
              }}
            >
              {/* Card header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 13, minWidth: 0 }}>
                  <div style={{
                    width: 38, height: 38, flexShrink: 0,
                    borderRadius: 10,
                    background: 'var(--brand-light)',
                    color: 'var(--brand)',
                    fontWeight: 800, fontSize: 16,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {s.name.charAt(0)}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)', lineHeight: 1.35, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {s.name}
                    </div>
                    {s.city && (
                      <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{s.city}</div>
                    )}
                  </div>
                </div>
                <span className={stageBadge[s.stage]} style={{ flexShrink: 0 }}>
                  {STAGE_LABELS[s.stage]}
                </span>
              </div>

              {/* Tagline */}
              <p style={{ fontSize: 13, color: 'var(--body)', lineHeight: 1.65, marginBottom: 16, flex: 1 }}>
                {s.tagline}
              </p>

              {/* Tags */}
              {s.tags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 16 }}>
                  {s.tags.slice(0, 4).map(t => (
                    <span key={t} className="chip">{t}</span>
                  ))}
                  {s.tags.length > 4 && (
                    <span className="chip" style={{ color: 'var(--muted)' }}>+{s.tags.length - 4}</span>
                  )}
                </div>
              )}

              {/* Footer */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                paddingTop: 14, borderTop: '1px solid var(--n100)',
              }}>
                <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 500 }}>
                  {s.user.name ?? 'Anonymous'}
                </span>
                {s.lookingFor.length > 0 && (
                  <span style={{ fontSize: 11, color: 'var(--brand)', fontWeight: 600 }}>
                    Needs {s.lookingFor.length > 1 ? `${s.lookingFor.length} roles` : s.lookingFor[0]}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      <style>{`
        .startups-grid {
          display: grid;
          gap: 14px;
          grid-template-columns: 1fr;
        }
        @media (min-width: 640px)  { .startups-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { .startups-grid { grid-template-columns: repeat(3, 1fr); } }
      `}</style>
    </div>
  )
}