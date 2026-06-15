'use client'
import Navbar from '@/components/Navbar'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const stages = ['IDEA', 'VALIDATION', 'MVP', 'GROWTH', 'SCALING']
const lookingForOptions = [
  'Co-founder', 'Tech Co-founder', 'Investor', 'Mentor',
  'Designer', 'Marketer', 'Developer', 'Business Partner'
]

const inputStyle: React.CSSProperties = {
  width: '100%',
  border: '1px solid #E5E7EB',
  padding: '12px 14px',
  fontSize: 14,
  outline: 'none',
  background: '#fff',
  color: '#111',
  fontFamily: 'inherit',
  transition: 'border-color 0.15s',
  borderRadius: 0,
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 11,
  fontWeight: 700,
  color: '#9CA3AF',
  textTransform: 'uppercase',
  letterSpacing: 2,
  marginBottom: 8,
}

const helperStyle: React.CSSProperties = {
  fontSize: 12,
  color: '#9CA3AF',
  marginTop: 6,
  lineHeight: 1.5,
}

type Startup = {
  id: string; name: string; tagline: string; description: string
  stage: string; city: string | null; tags: string[]; lookingFor: string[]
  website: string | null; linkedin: string | null
}

export default function EditStartupClient({ startup }: { startup: Startup }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tagInput, setTagInput] = useState('')
  const [form, setForm] = useState({
    name: startup.name, tagline: startup.tagline, description: startup.description,
    stage: startup.stage, city: startup.city ?? '',
    tags: startup.tags, lookingFor: startup.lookingFor,
    website: startup.website ?? '', linkedin: startup.linkedin ?? '',
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
    <main style={{ minHeight: '100vh', background: '#F7F7F7' }}>
      <Navbar showAuth />

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '64px 6%' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 48, paddingBottom: 40, borderBottom: '1px solid #E5E7EB', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#E84A00', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 16 }}>Edit</div>
            <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, letterSpacing: -1.2, lineHeight: 1.05, color: '#111', marginBottom: 8 }}>
              Edit Startup
            </h1>
            <p style={{ fontSize: 15, color: '#4B5563' }}>Update your startup profile.</p>
          </div>
          <button onClick={handleDelete} disabled={deleting} style={{
            fontSize: 12, fontWeight: 700, color: '#B91C1C', background: 'none',
            border: '1px solid #B91C1C', padding: '8px 16px', cursor: 'pointer',
            opacity: deleting ? 0.4 : 1, fontFamily: 'inherit', letterSpacing: 0.5,
            textTransform: 'uppercase',
          }}>
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>

        {/* GROUP 1 */}
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', marginBottom: 1 }}>
          <div style={{ padding: '20px 28px', borderBottom: '1px solid #E5E7EB' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#111', letterSpacing: 2, textTransform: 'uppercase' }}>Basic Info</span>
          </div>
          <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <label style={labelStyle}>Startup Name *</label>
              <input name="name" value={form.name} onChange={handleChange} style={inputStyle}
                onFocus={e => (e.target.style.borderColor = '#E84A00')} onBlur={e => (e.target.style.borderColor = '#E5E7EB')} />
            </div>
            <div>
              <label style={labelStyle}>Tagline *</label>
              <input name="tagline" value={form.tagline} onChange={handleChange} style={inputStyle}
                onFocus={e => (e.target.style.borderColor = '#E84A00')} onBlur={e => (e.target.style.borderColor = '#E5E7EB')} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={labelStyle}>Stage</label>
                <select name="stage" value={form.stage} onChange={handleChange} style={inputStyle}>
                  {stages.map(s => <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>City</label>
                <input name="city" value={form.city} onChange={handleChange} placeholder="e.g. Bangalore" style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = '#E84A00')} onBlur={e => (e.target.style.borderColor = '#E5E7EB')} />
              </div>
            </div>
          </div>
        </div>

        {/* GROUP 2 */}
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', marginBottom: 1 }}>
          <div style={{ padding: '20px 28px', borderBottom: '1px solid #E5E7EB' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#111', letterSpacing: 2, textTransform: 'uppercase' }}>Details</span>
          </div>
          <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <label style={labelStyle}>Description *</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={5}
                style={{ ...inputStyle, resize: 'none' }}
                onFocus={e => (e.target.style.borderColor = '#E84A00')} onBlur={e => (e.target.style.borderColor = '#E5E7EB')} />
              <p style={helperStyle}>Explain the problem, your approach, and who you're building for.</p>
            </div>
            <div>
              <label style={labelStyle}>Tags</label>
              <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={addTag}
                placeholder="Type a tag and press Enter" style={inputStyle}
                onFocus={e => (e.target.style.borderColor = '#E84A00')} onBlur={e => (e.target.style.borderColor = '#E5E7EB')} />
              <p style={helperStyle}>Press Enter after each tag. E.g. Fintech, SaaS, EdTech.</p>
              {form.tags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
                  {form.tags.map(tag => (
                    <span key={tag} style={{ fontSize: 11, fontWeight: 700, color: '#E84A00', border: '1.5px solid #E84A00', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 6, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                      {tag}
                      <button onClick={() => removeTag(tag)} style={{ background: 'none', border: 'none', color: '#E84A00', cursor: 'pointer', fontWeight: 900, padding: 0, fontSize: 13, lineHeight: 1 }}>×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* GROUP 3 */}
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', marginBottom: 1 }}>
          <div style={{ padding: '20px 28px', borderBottom: '1px solid #E5E7EB' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#111', letterSpacing: 2, textTransform: 'uppercase' }}>Looking For</span>
          </div>
          <div style={{ padding: '28px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {lookingForOptions.map(item => {
              const isSelected = form.lookingFor.includes(item)
              return (
                <button key={item} onClick={() => toggleLookingFor(item)} style={{
                  padding: '10px 18px', minHeight: 44,
                  border: isSelected ? '1.5px solid #E84A00' : '1px solid #E5E7EB',
                  background: isSelected ? '#FFF0E8' : '#fff',
                  color: isSelected ? '#E84A00' : '#4B5563',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  transition: 'all 0.1s', fontFamily: 'inherit',
                }}>
                  {item}
                </button>
              )
            })}
          </div>
        </div>

        {/* GROUP 4 */}
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', marginBottom: 32 }}>
          <div style={{ padding: '20px 28px', borderBottom: '1px solid #E5E7EB' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#111', letterSpacing: 2, textTransform: 'uppercase' }}>Links</span>
          </div>
          <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <label style={labelStyle}>Website</label>
              <input name="website" value={form.website} onChange={handleChange} placeholder="https://" style={inputStyle}
                onFocus={e => (e.target.style.borderColor = '#E84A00')} onBlur={e => (e.target.style.borderColor = '#E5E7EB')} />
            </div>
            <div>
              <label style={labelStyle}>LinkedIn</label>
              <input name="linkedin" value={form.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/..." style={inputStyle}
                onFocus={e => (e.target.style.borderColor = '#E84A00')} onBlur={e => (e.target.style.borderColor = '#E5E7EB')} />
            </div>
          </div>
        </div>

        {error && <p style={{ color: '#B91C1C', fontSize: 13, textAlign: 'center', marginBottom: 16 }}>{error}</p>}

        <button onClick={handleSave} disabled={loading} style={{
          width: '100%', background: '#E84A00', color: '#fff', border: 'none',
          padding: '16px', fontSize: 15, fontWeight: 700, cursor: 'pointer',
          transition: 'background 0.15s', fontFamily: 'inherit', letterSpacing: 0.3,
        }}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </main>
  )
}