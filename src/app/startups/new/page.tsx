'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const stages = ['IDEA', 'VALIDATION', 'MVP', 'GROWTH', 'SCALING']
const lookingForOptions = [
  'Co-founder', 'Tech Co-founder', 'Investor', 'Mentor',
  'Designer', 'Marketer', 'Developer', 'Business Partner'
]

export default function NewStartupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tagInput, setTagInput] = useState('')
  const [form, setForm] = useState({
    name: '',
    tagline: '',
    description: '',
    stage: 'IDEA',
    city: '',
    tags: [] as string[],
    lookingFor: [] as string[],
    website: '',
    linkedin: '',
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

  async function handleSubmit() {
    if (!form.name || !form.tagline || !form.description) {
      setError('Name, tagline and description are required.')
      return
    }
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/startups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) throw new Error('Failed to create startup')
      router.push('/startups')
    } catch (e) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      <nav className="bg-white border-b border-[#E5E7EB] px-[6%] h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#E84A00] flex items-center justify-center text-white font-black text-base">F</div>
          <span className="text-lg font-black tracking-tight">Foundo<span className="text-[#E84A00]">.in</span></span>
        </div>
        <button onClick={() => router.push('/dashboard')} className="text-sm text-[#4B5563] hover:text-[#1A1A1A]">
          ← Back to Dashboard
        </button>
      </nav>

      <div className="max-w-2xl mx-auto px-[6%] py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight mb-2">List your startup</h1>
          <p className="text-[#4B5563]">Tell people what you're building and who you're looking for.</p>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-xl p-8 space-y-6">
          {/* NAME */}
          <div>
            <label className="block text-xs font-bold text-[#374151] uppercase tracking-wide mb-2">Startup Name *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Foundo"
              className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#E84A00] transition-colors"
            />
          </div>

          {/* TAGLINE */}
          <div>
            <label className="block text-xs font-bold text-[#374151] uppercase tracking-wide mb-2">Tagline *</label>
            <input
              name="tagline"
              value={form.tagline}
              onChange={handleChange}
              placeholder="One line that says what you do"
              className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#E84A00] transition-colors"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-xs font-bold text-[#374151] uppercase tracking-wide mb-2">Description *</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="What problem are you solving? Who is it for? What's your approach?"
              rows={4}
              className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#E84A00] transition-colors resize-none"
            />
          </div>

          {/* STAGE */}
          <div>
            <label className="block text-xs font-bold text-[#374151] uppercase tracking-wide mb-2">Stage</label>
            <select
              name="stage"
              value={form.stage}
              onChange={handleChange}
              className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#E84A00] transition-colors"
            >
              {stages.map(s => (
                <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>
              ))}
            </select>
          </div>

          {/* CITY */}
          <div>
            <label className="block text-xs font-bold text-[#374151] uppercase tracking-wide mb-2">City</label>
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="e.g. Jaipur"
              className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#E84A00] transition-colors"
            />
          </div>

          {/* TAGS */}
          <div>
            <label className="block text-xs font-bold text-[#374151] uppercase tracking-wide mb-2">Tags</label>
            <input
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={addTag}
              placeholder="Type a tag and press Enter (e.g. Fintech, SaaS, EdTech)"
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

          {/* LOOKING FOR */}
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

          {/* WEBSITE */}
          <div>
            <label className="block text-xs font-bold text-[#374151] uppercase tracking-wide mb-2">Website</label>
            <input
              name="website"
              value={form.website}
              onChange={handleChange}
              placeholder="https://"
              className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#E84A00] transition-colors"
            />
          </div>

          {/* LINKEDIN */}
          <div>
            <label className="block text-xs font-bold text-[#374151] uppercase tracking-wide mb-2">LinkedIn</label>
            <input
              name="linkedin"
              value={form.linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/..."
              className="w-full border border-[#E5E7EB] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#E84A00] transition-colors"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-[#E84A00] text-white py-4 rounded-xl font-bold text-base hover:bg-[#cf4000] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? 'Publishing...' : 'Publish Startup →'}
          </button>
        </div>
      </div>
    </main>
  )
}