'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

const STAGES = ['All', 'IDEA', 'VALIDATION', 'MVP', 'GROWTH', 'SCALING']

const stageBadgeClass: Record<string, string> = {
  IDEA:       'badge badge-idea',
  VALIDATION: 'badge badge-validation',
  MVP:        'badge badge-mvp',
  GROWTH:     'badge badge-growth',
  SCALING:    'badge badge-scaling',
}

type Startup = {
  id: string
  name: string
  tagline: string
  stage: string
  city: string | null
  tags: string[]
  lookingFor: string[]
  user: { name: string | null; city: string | null }
}

export default function StartupsClient({ startups }: { startups: Startup[] }) {
  const [search, setSearch] = useState('')
  const [stage, setStage] = useState('All')

  const filtered = useMemo(() => {
    return startups.filter(s => {
      const matchesSearch =
        search === '' ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.tagline.toLowerCase().includes(search.toLowerCase()) ||
        s.tags.some(t => t.toLowerCase().includes(search.toLowerCase())) ||
        s.city?.toLowerCase().includes(search.toLowerCase())

      const matchesStage = stage === 'All' || s.stage === stage
      return matchesSearch && matchesStage
    })
  }, [startups, search, stage])

  return (
    <div>
      {/* FILTERS */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap' }} className="filter-row">
        <input
          type="text"
          placeholder="Search by name, tag, or city..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            flex: 1, minWidth: 200,
            border: '1px solid #E5E7EB',
            background: '#fff',
            padding: '10px 16px',
            fontSize: 14,
            color: '#111',
            outline: 'none',
            borderRadius: 0,
            fontFamily: 'inherit',
            transition: 'border-color 0.15s',
          }}
          onFocus={e => (e.target.style.borderColor = '#E84A00')}
          onBlur={e => (e.target.style.borderColor = '#E5E7EB')}
        />
        <div style={{ display: 'flex', gap: 0, border: '1px solid #E5E7EB', background: '#fff' }}>
          {STAGES.map(s => (
            <button
              key={s}
              onClick={() => setStage(s)}
              style={{
                padding: '10px 16px',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1.5,
                textTransform: 'uppercase',
                cursor: 'pointer',
                border: 'none',
                borderRight: s !== 'SCALING' ? '1px solid #E5E7EB' : 'none',
                background: stage === s ? '#E84A00' : 'transparent',
                color: stage === s ? '#fff' : '#6B7280',
                transition: 'all 0.1s',
                fontFamily: 'inherit',
              }}
            >
              {s === 'All' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* RESULT COUNT */}
      <div style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 24 }}>
        {filtered.length} {filtered.length === 1 ? 'startup' : 'startups'}
      </div>

      {/* GRID */}
      {filtered.length === 0 ? (
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', padding: '64px 32px', textAlign: 'center' }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#111', marginBottom: 8 }}>No results found</div>
          <p style={{ fontSize: 13, color: '#9CA3AF' }}>Try a different search or stage filter.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 1, background: '#E5E7EB' }} className="grid-startups">
          {filtered.map((startup) => (
            <Link
              href={`/startups/${startup.id}`}
              key={startup.id}
              style={{
                background: '#fff',
                padding: '28px 32px',
                textDecoration: 'none',
                color: 'inherit',
                display: 'block',
                transition: 'background 0.1s',
              }}
              className="startup-card"
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10, gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0, flexWrap: 'wrap' }}>
                  <div style={{
                    width: 36, height: 36,
                    background: '#FFF0E8',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#E84A00', fontWeight: 900, fontSize: 15, flexShrink: 0,
                    borderRadius: 2,
                  }}>
                    {startup.name.charAt(0)}
                  </div>
                  <span style={{ fontSize: 16, fontWeight: 800, color: '#111', letterSpacing: -0.3 }}>
                    {startup.name}
                  </span>
                </div>
                <span className={stageBadgeClass[startup.stage]} style={{ flexShrink: 0 }}>
                  {startup.stage.charAt(0) + startup.stage.slice(1).toLowerCase()}
                </span>
              </div>

              <p style={{ fontSize: 13, color: '#4B5563', lineHeight: 1.6, marginBottom: 16, marginLeft: 48 }}>
                {startup.tagline}
              </p>

              {startup.tags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginLeft: 48, marginBottom: 16 }}>
                  {startup.tags.slice(0, 4).map(tag => (
                    <span key={tag} style={{
                      fontSize: 11, fontWeight: 700, color: '#6B7280',
                      border: '1px solid #E5E7EB', padding: '2px 8px',
                      letterSpacing: 0.5, textTransform: 'uppercase',
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginLeft: 48, paddingTop: 12, borderTop: '1px solid #F3F4F6' }}>
                <span style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 500 }}>
                  {startup.user.name}
                </span>
                {startup.city && (
                  <span style={{ fontSize: 12, color: '#9CA3AF' }}>
                    {startup.city}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      <style>{`
        .grid-startups { grid-template-columns: 1fr; }
        @media (min-width: 768px)  { .grid-startups { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { .grid-startups { grid-template-columns: repeat(3, 1fr); } }
        .startup-card:hover { background: #FAFAFA !important; }
        @media (max-width: 639px) { .filter-row { flex-direction: column; } }
      `}</style>
    </div>
  )
}