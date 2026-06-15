'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'

const STAGES = ['IDEA', 'VALIDATION', 'MVP', 'GROWTH', 'SCALING']
const STAGE_LABELS: Record<string, string> = {
  IDEA: 'Idea', VALIDATION: 'Validation', MVP: 'MVP', GROWTH: 'Growth', SCALING: 'Scaling',
}
const LOOKING_FOR_OPTIONS = [
  'Co-founder', 'Tech Co-founder', 'Investor', 'Mentor',
  'Designer', 'Marketer', 'Developer', 'Business Partner',
]

function focusOn(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
  e.target.style.borderColor = 'var(--brand)'
  e.target.style.boxShadow = '0 0 0 3px rgba(232,74,0,0.09)'
}
function blurOn(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
  e.target.style.borderColor = 'var(--n200)'
  e.target.style.boxShadow = 'none'
}

function FormSection({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="form-section">
      <div className="form-section-header">
        <span className="form-section-title">{title}</span>
        {description && (
          <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4, lineHeight: 1.5 }}>{description}</p>
        )}
      </div>
      <div className="form-section-body">
        {children}
      </div>
    </div>
  )
}

function FieldGroup({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="label">
        {label}
        {required && <span style={{ color: 'var(--brand)', marginLeft: 3 }}>*</span>}
      </label>
      {children}
      {hint && <p className="hint">{hint}</p>}
    </div>
  )
}

export default function NewStartupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tagInput, setTagInput] = useState('')
  const [form, setForm] = useState({
    name: '', tagline: '', description: '',
    stage: 'IDEA', city: '',
    tags: [] as string[], lookingFor: [] as string[],
    website: '', linkedin: '',
  })

  const set = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }))
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    set(e.target.name, e.target.value)

  function addTag(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== 'Enter') return
    e.preventDefault()
    const t = tagInput.trim()
    if (t && !form.tags.includes(t)) set('tags', [...form.tags, t])
    setTagInput('')
  }

  function toggleLookingFor(item: string) {
    set('lookingFor', form.lookingFor.includes(item)
      ? form.lookingFor.filter(i => i !== item)
      : [...form.lookingFor, item])
  }

  async function handleSubmit() {
    if (!form.name.trim() || !form.tagline.trim() || !form.description.trim()) {
      setError('Startup name, tagline, and description are all required.')
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
      if (!res.ok) throw new Error('Failed to create startup. Please try again.')
      router.push('/dashboard')
    } catch (e: any) {
      setError(e.message)
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', height: 40, padding: '0 12px',
    fontSize: 14, fontFamily: 'inherit',
    color: 'var(--ink)', background: '#fff',
    border: '1px solid var(--n200)', borderRadius: 8,
    outline: 'none', transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
  }

  const textareaStyle: React.CSSProperties = {
    width: '100%', padding: '12px 14px',
    fontSize: 14, fontFamily: 'inherit',
    color: 'var(--ink)', background: '#fff',
    border: '1px solid var(--n200)', borderRadius: 8,
    outline: 'none', resize: 'none',
    lineHeight: 1.65, transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--ground)' }}>
      <Navbar showAuth />

      <div className="page-wrap-sm">
        {/* Header */}
        <div className="slide-up" style={{ marginBottom: 40 }}>
          <p className="eyebrow" style={{ marginBottom: 14 }}>New Startup</p>
          <h1 style={{
            fontSize: 'clamp(24px, 4vw, 38px)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            color: 'var(--ink)',
            marginBottom: 10,
          }}>
            List your startup
          </h1>
          <p style={{ fontSize: 15, color: 'var(--body)', lineHeight: 1.65 }}>
            Tell people what you're building and who you need on your team.
          </p>
        </div>

        {/* ── SECTION 1: Basics ── */}
        <FormSection title="Basics">
          <FieldGroup label="Startup name" required>
            <input
              name="name" value={form.name} onChange={handleChange}
              placeholder="e.g. Foundo"
              style={inputStyle} onFocus={focusOn} onBlur={blurOn}
            />
          </FieldGroup>

          <FieldGroup
            label="Tagline" required
            hint="Keep it under 100 characters. This appears on your public card."
          >
            <input
              name="tagline" value={form.tagline} onChange={handleChange}
              placeholder="One compelling line that describes what you do"
              style={inputStyle} onFocus={focusOn} onBlur={blurOn}
            />
          </FieldGroup>

          <div style={{ display: 'grid', gap: 16 }} className="form-two-col">
            <FieldGroup label="Stage">
              <select
                name="stage" value={form.stage} onChange={handleChange}
                style={{ ...inputStyle, cursor: 'pointer' }}
                onFocus={focusOn} onBlur={blurOn}
              >
                {STAGES.map(s => <option key={s} value={s}>{STAGE_LABELS[s]}</option>)}
              </select>
            </FieldGroup>

            <FieldGroup label="City">
              <input
                name="city" value={form.city} onChange={handleChange}
                placeholder="e.g. Bangalore"
                style={inputStyle} onFocus={focusOn} onBlur={blurOn}
              />
            </FieldGroup>
          </div>
        </FormSection>

        {/* ── SECTION 2: Details ── */}
        <FormSection title="Details">
          <FieldGroup
            label="Description" required
            hint="Be specific — this is what founders and investors will read first."
          >
            <textarea
              name="description" value={form.description} onChange={handleChange} rows={5}
              placeholder="What problem are you solving? Who is it for? What makes you different?"
              style={textareaStyle} onFocus={focusOn} onBlur={blurOn}
            />
          </FieldGroup>

          <FieldGroup label="Tags">
            <input
              value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={addTag}
              placeholder="Type a tag and press Enter (e.g. Fintech, SaaS, EdTech)"
              style={inputStyle} onFocus={focusOn} onBlur={blurOn}
            />
            {form.tags.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                {form.tags.map(t => (
                  <span key={t} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    fontSize: 12, fontWeight: 600,
                    color: 'var(--brand)',
                    background: 'var(--brand-light)',
                    border: '1px solid var(--brand-border)',
                    borderRadius: 5, padding: '4px 10px',
                  }}>
                    {t}
                    <button
                      onClick={() => set('tags', form.tags.filter(x => x !== t))}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: 'inherit', padding: 0, lineHeight: 1,
                        fontSize: 15, fontWeight: 700,
                        display: 'flex', alignItems: 'center',
                        opacity: 0.7,
                      }}
                      aria-label={`Remove ${t}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </FieldGroup>
        </FormSection>

        {/* ── SECTION 3: Looking For ── */}
        <FormSection
          title="Looking For"
          description="Select everyone you're currently looking for. This helps the right people find you."
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {LOOKING_FOR_OPTIONS.map(item => {
              const sel = form.lookingFor.includes(item)
              return (
                <button key={item} onClick={() => toggleLookingFor(item)} style={{
                  height: 38, padding: '0 16px',
                  fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
                  borderRadius: 'var(--r-full)', cursor: 'pointer',
                  border: sel ? '1.5px solid var(--brand)' : '1px solid var(--n200)',
                  background: sel ? 'var(--brand-light)' : '#fff',
                  color: sel ? 'var(--brand)' : 'var(--n600)',
                  transition: 'all 0.15s ease',
                  boxShadow: sel ? '0 0 0 2px rgba(232,74,0,0.08)' : 'var(--sh-xs)',
                }}>
                  {sel && <span style={{ marginRight: 5, fontSize: 11 }}>✓</span>}
                  {item}
                </button>
              )
            })}
          </div>
        </FormSection>

        {/* ── SECTION 4: Links ── */}
        <FormSection title="Links">
          <FieldGroup label="Website">
            <input
              name="website" value={form.website} onChange={handleChange}
              placeholder="https://"
              style={inputStyle} onFocus={focusOn} onBlur={blurOn}
            />
          </FieldGroup>
          <FieldGroup label="LinkedIn">
            <input
              name="linkedin" value={form.linkedin} onChange={handleChange}
              placeholder="https://linkedin.com/company/…"
              style={inputStyle} onFocus={focusOn} onBlur={blurOn}
            />
          </FieldGroup>
        </FormSection>

        {/* ── SUBMIT ── */}
        {error && (
          <div style={{
            fontSize: 13, color: 'var(--red)',
            background: '#FEF2F2', border: '1px solid #FECACA',
            borderRadius: 8, padding: '12px 16px', marginBottom: 16,
            lineHeight: 1.55,
          }}>
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit} disabled={loading}
          className="btn btn-primary btn-lg"
          style={{ width: '100%', fontFamily: 'inherit' }}
        >
          {loading ? (
            <>
              <span className="spinner" style={{ width: 15, height: 15, borderWidth: '1.75px' }} />
              Publishing…
            </>
          ) : 'Publish Startup'}
        </button>

        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--muted)', marginTop: 14, lineHeight: 1.6 }}>
          You can edit or unpublish your startup at any time.
        </p>
      </div>

      <style>{`
        @media (min-width: 560px) { .form-two-col { grid-template-columns: 1fr 1fr; } }
      `}</style>
    </main>
  )
}