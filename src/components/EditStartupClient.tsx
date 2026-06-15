'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const stages = ['IDEA', 'VALIDATION', 'MVP', 'GROWTH', 'SCALING']
const lookingForOptions = [
  'Co-founder', 'Tech Co-founder', 'Investor', 'Mentor',
  'Designer', 'Marketer', 'Developer', 'Business Partner'
]

type Startup = {
  id: string
  name: string
  tagline: string
  description: string
  stage: string
  city: string | null
  tags: string[]
  lookingFor: string[]
  website: string | null
  linkedin: string | null
}

export default function EditStartupClient({ startup }: { startup: Startup }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tagInput, setTagInput] = useState('')
  const [form, setForm] = useState({
    name: startup.name,
    tagline: startup.tagline,
    description: startup.description,
    stage: startup.stage,
    city: startup.city ?? '',
    tags: startup.tags,
    lookingFor: startup.lookingFor,
    website: startup.website ?? '',
    linkedin: startup.linkedin ?? '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function addTag(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      if (!form.tags.includes(tagInput.trim())) {
        setForm(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }))
      }
      setTagInput('')
    }
  }

  function removeTag(tag: string) {
    setForm(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))
  }

  function toggleLookingFor(item: string) {
    setForm(prev => ({
      ...prev,
      lookingFor: prev.lookingFor.includes(item)
        ? prev.lookingFor.filter(i => i !== item)
        : [...prev.lookingFor, item]
    }))
  }

  async function handleSave() {
    if (!form.name || !form.tagline || !form.description) {
      setError('Name, tagline and description are required.')
      return
    }
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/startups/${startup.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Failed to update')
      router.push(`/startups/${startup.id}`)
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this startup? This cannot be undone.')) return
    setDeleting(true)

    try {
      const res = await fetch(`/api/startups/${startup.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      router.push('/dashboard')
    } catch {
      setError('Failed to delete. Please try again.')
      setDeleting(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      <nav className="bg-white border-b border-[#E5E7EB] px-[6%] h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#E84A00] flex items-center justify-center text-white font-black text-base">F</div>
          <span className="text-lg font-black tracking-tight">Foundo<span className="text-[#E84A00]">.in</span></span>
        </div>
        <button onClick={() => router.push(`/startups/${startup.id}`)} className="text-sm text-[#4B5563] hover:text-[#1A1A1A]">
          ← Back
        </button>
      </nav>

      <div className="max-w-2xl mx-auto px-[6%] py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight mb-1">Edit Startup</h1>
            <p className="text-[#4B5563]">Update your startup profile.</p>
          </div>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-sm text-red-500 hover:text-red-700 font-semibold transition-colors disabled:opacity-40"
          >
            {deleting ? 'Deleting...' : 'Delete startup'}
          </button>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-xl p-8 space-y-6">
          <div>
            <label className="block text-xs font-bold text-[#374151] uppercase tracking-wide mb-2">Startup Name *</label>
            <input name="name" value={form.name} onChange={handleChange} className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#E84A00] transition-colors" />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#374151] uppercase tracking-wide mb-2">Tagline *</label>
            <input name="tagline" value={form.tagline} onChange={handleChange} className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#E84A00] transition-colors" />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#374151] uppercase tracking-wide mb-2">Description *</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={4} className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#E84A00] transition-colors resize-none" />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#374151] uppercase tracking-wide mb-2">Stage</label>
            <select name="stage" value={form.stage} onChange={handleChange} className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#E84A00] transition-colors">
              {stages.map(s => <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#374151] uppercase tracking-wide mb-2">City</label>
            <input name="city" value={form.city} onChange={handleChange} placeholder="e.g. Jaipur" className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#E84A00] transition-colors" />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#374151] uppercase tracking-wide mb-2">Tags</label>
            <input
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={addTag}
              placeholder="Type a tag and press Enter"
              className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#E84A00] transition-colors"
            />
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {form.tags.map(tag => (
                  <span key={tag} className="bg-[#FFF0E8] text-[#E84A00] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    {tag}
                    <button onClick={() => removeTag(tag)} className="ml-1 hover:opacity-70">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-[#374151] uppercase tracking-wide mb-3">Looking For</label>
            <div className="flex flex-wrap gap-2">
              {lookingForOptions.map(item => (
                <button
                  key={item}
                  onClick={() => toggleLookingFor(item)}
                  className={`text-xs font-semibold px-3 py-2 rounded-lg border transition-all ${
                    form.lookingFor.includes(item)
                      ? 'bg-[#E84A00] text-white border-[#E84A00]'
                      : 'bg-white text-[#4B5563] border-[#E5E7EB] hover:border-[#E84A00]'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#374151] uppercase tracking-wide mb-2">Website</label>
            <input name="website" value={form.website} onChange={handleChange} placeholder="https://" className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#E84A00] transition-colors" />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#374151] uppercase tracking-wide mb-2">LinkedIn</label>
            <input name="linkedin" value={form.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/..." className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#E84A00] transition-colors" />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-[#E84A00] text-white py-4 rounded-xl font-bold text-base hover:bg-[#cf4000] transition-colors disabled:opacity-40"
          >
            {loading ? 'Saving...' : 'Save Changes →'}
          </button>
        </div>
      </div>
    </main>
  )
}