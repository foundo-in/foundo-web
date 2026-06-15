'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

const STAGES = ['All', 'IDEA', 'VALIDATION', 'MVP', 'GROWTH', 'SCALING']

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

export default function StartupsClient({
  startups,
  stageColors,
}: {
  startups: Startup[]
  stageColors: Record<string, string>
}) {
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
      {/* SEARCH + FILTERS */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Search by name, tag, or city..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 border border-[#E5E7EB] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#E84A00] transition-colors bg-white"
        />
        <div className="flex gap-2 flex-wrap">
          {STAGES.map(s => (
            <button
              key={s}
              onClick={() => setStage(s)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                stage === s
                  ? 'bg-[#E84A00] text-white'
                  : 'bg-white border border-[#E5E7EB] text-[#4B5563] hover:border-[#E84A00]'
              }`}
            >
              {s === 'All' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* RESULTS COUNT */}
      <div className="text-xs text-[#9CA3AF] font-semibold uppercase tracking-widest mb-6">
        {filtered.length} {filtered.length === 1 ? 'startup' : 'startups'}
      </div>

      {/* GRID */}
      {filtered.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="text-2xl font-black mb-2">No results</h2>
          <p className="text-[#4B5563]">Try a different search or filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((startup) => (
            <Link
              href={`/startups/${startup.id}`}
              key={startup.id}
              className="bg-white border border-[#E5E7EB] rounded-xl p-6 hover:border-[#E84A00] transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#FFF0E8] flex items-center justify-center text-[#E84A00] font-black text-lg">
                  {startup.name.charAt(0)}
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${stageColors[startup.stage]}`}>
                  {startup.stage.charAt(0) + startup.stage.slice(1).toLowerCase()}
                </span>
              </div>
              <h3 className="text-lg font-black mb-1 group-hover:text-[#E84A00] transition-colors">{startup.name}</h3>
              <p className="text-sm text-[#4B5563] mb-3">{startup.tagline}</p>
              {startup.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {startup.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="bg-[#F3F4F6] text-[#4B5563] text-xs px-2 py-0.5 rounded-full">{tag}</span>
                  ))}
                </div>
              )}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#F3F4F6]">
                <span className="text-xs text-[#9CA3AF]">{startup.user.name}</span>
                {startup.city && <span className="text-xs text-[#9CA3AF]">📍 {startup.city}</span>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}