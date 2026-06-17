'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/Toast'

/* ── What a user can look for ─────────────────────────────── */
const LOOKING_FOR_OPTIONS = [
  'Co-founder', 'Investor', 'Tech Co-founder', 'Developer',
  'Designer', 'Marketer', 'Business Partner', 'Mentor',
  'Advisor', 'Intern', 'Contractor',
]

type ProfileData = {
  city:       string
  bio:        string
  lookingFor: string[]
  linkedin:   string
  twitter:    string
}

export default function EditProfileClient({
  initial,
}: {
  initial: ProfileData
}) {
  const router  = useRouter()
  const toast   = useToast()

  const [city,       setCity]       = useState(initial.city)
  const [bio,        setBio]        = useState(initial.bio)
  const [lookingFor, setLookingFor] = useState<string[]>(initial.lookingFor)
  const [linkedin,   setLinkedin]   = useState(initial.linkedin)
  const [twitter,    setTwitter]    = useState(initial.twitter)
  const [saving,     setSaving]     = useState(false)

  function toggleLookingFor(opt: string) {
    setLookingFor(prev =>
      prev.includes(opt) ? prev.filter(x => x !== opt) : [...prev, opt]
    )
  }

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city, bio, lookingFor, linkedin, twitter }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Save failed')
      toast.success('Profile saved ✓')
      router.refresh()
    } catch (e: any) {
      toast.error(e.message || 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── About ─────────────────────────────────────────── */}
      <div className="form-section">
        <div className="form-section-header">
          <p className="form-section-title">About you</p>
        </div>
        <div className="form-section-body">

          {/* City */}
          <div>
            <label className="label" htmlFor="city">City</label>
            <input
              id="city"
              type="text"
              value={city}
              onChange={e => setCity(e.target.value)}
              placeholder="e.g. Bengaluru, Mumbai, Delhi…"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="label" htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="Tell people who you are, what you're working on, what you bring to the table…"
              rows={4}
              style={{ resize: 'vertical' }}
            />
            <p className="hint">{bio.length}/400 characters</p>
          </div>
        </div>
      </div>

      {/* ── Looking For ───────────────────────────────────── */}
      <div className="form-section">
        <div className="form-section-header">
          <p className="form-section-title">What are you looking for?</p>
          <p className="hint" style={{ marginTop: 4 }}>
            Select everything that applies — this helps people find you.
          </p>
        </div>
        <div className="form-section-body">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {LOOKING_FOR_OPTIONS.map(opt => {
              const active = lookingFor.includes(opt)
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => toggleLookingFor(opt)}
                  style={{
                    height: 34,
                    padding: '0 14px',
                    fontSize: 13,
                    fontWeight: 600,
                    fontFamily: 'inherit',
                    borderRadius: 'var(--r-full)',
                    border: active ? '1.5px solid var(--brand)' : '1px solid var(--n200)',
                    background: active ? 'var(--brand-light)' : '#fff',
                    color: active ? 'var(--brand)' : 'var(--n600)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: active ? '0 0 0 3px rgba(232,74,0,0.09)' : 'var(--sh-xs)',
                  }}
                >
                  {active && <span style={{ marginRight: 5 }}>✓</span>}
                  {opt}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Links ─────────────────────────────────────────── */}
      <div className="form-section">
        <div className="form-section-header">
          <p className="form-section-title">Links</p>
        </div>
        <div className="form-section-body">

          {/* LinkedIn */}
          <div>
            <label className="label" htmlFor="linkedin">LinkedIn URL</label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                fontSize: 13, color: 'var(--muted)', pointerEvents: 'none', userSelect: 'none',
              }}>
                linkedin.com/in/
              </span>
              <input
                id="linkedin"
                type="text"
                value={linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//i, '')}
                onChange={e => setLinkedin(
                  e.target.value ? `https://linkedin.com/in/${e.target.value.replace(/^.*linkedin\.com\/in\//i, '')}` : ''
                )}
                placeholder="yourhandle"
                style={{ paddingLeft: 130 }}
              />
            </div>
          </div>

          {/* Twitter */}
          <div>
            <label className="label" htmlFor="twitter">Twitter / X handle</label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                fontSize: 13, color: 'var(--muted)', pointerEvents: 'none', userSelect: 'none',
              }}>
                @
              </span>
              <input
                id="twitter"
                type="text"
                value={twitter.replace(/^https?:\/\/(www\.)?(twitter|x)\.com\/@?/i, '').replace(/^@/, '')}
                onChange={e => setTwitter(
                  e.target.value ? `https://x.com/${e.target.value.replace(/^@/, '')}` : ''
                )}
                placeholder="yourhandle"
                style={{ paddingLeft: 28 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Save ──────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={() => router.back()}
          className="btn btn-secondary"
          style={{ fontFamily: 'inherit' }}
        >
          Cancel
        </button>
        <button
          id="save-profile"
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="btn btn-primary"
          style={{ fontFamily: 'inherit', minWidth: 110 }}
        >
          {saving ? (
            <>
              <span className="spinner" style={{ width: 14, height: 14, borderWidth: '1.75px' }} />
              Saving…
            </>
          ) : 'Save Profile'}
        </button>
      </div>
    </div>
  )
}
