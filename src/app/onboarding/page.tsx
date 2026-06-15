'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const roles = [
  {
    id: 'FOUNDER',
    tag: 'Founder',
    headline: 'I\'m building something.',
    desc: 'List your startup, find co-founders and investors, get noticed by the right people.',
  },
  {
    id: 'INVESTOR',
    tag: 'Investor',
    headline: 'I want to back the next big thing.',
    desc: 'Discover early-stage startups, connect directly with founders. No middlemen.',
  },
  {
    id: 'STUDENT',
    tag: 'Student',
    headline: 'I have an idea and want to move fast.',
    desc: 'Validate your idea, find mentors, connect with people building things that matter.',
  },
  {
    id: 'BUILDER',
    tag: 'Builder',
    headline: 'I have skills and want to collaborate.',
    desc: 'Find projects that need you. Showcase what you can do. Build something real.',
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [selected, setSelected] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleContinue() {
    if (!selected) return
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: selected }),
      })
      if (!res.ok) throw new Error('Failed to save role')
      router.push('/dashboard')
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: '#fff', display: 'flex', flexDirection: 'column' }}>

      {/* Top brand bar */}
      <div style={{ borderBottom: '1px solid #E5E7EB', padding: '0 6%', height: 60, display: 'flex', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 30, height: 30, borderRadius: '50%',
            background: '#E84A00', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 900, fontSize: 15,
          }}>F</div>
          <span style={{ fontSize: 17, fontWeight: 900, letterSpacing: -0.5, color: '#111' }}>
            Foundo<span style={{ color: '#E84A00' }}>.in</span>
          </span>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '64px 6%' }}>
        <div style={{ width: '100%', maxWidth: 680 }}>

          {/* Heading */}
          <div style={{ marginBottom: 48 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#E84A00', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 20 }}>
              Step 1 of 1
            </div>
            <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 900, letterSpacing: -1.5, lineHeight: 1.05, color: '#111', marginBottom: 12 }}>
              Who are you?
            </h1>
            <p style={{ fontSize: 16, color: '#4B5563', lineHeight: 1.6 }}>
              We'll personalise your experience from day one.
            </p>
          </div>

          {/* Role grid */}
          <div style={{ display: 'grid', gap: 1, background: '#E5E7EB', marginBottom: 32 }} className="role-grid">
            {roles.map((role) => {
              const isSelected = selected === role.id
              return (
                <button
                  key={role.id}
                  id={`role-${role.id.toLowerCase()}`}
                  onClick={() => setSelected(role.id)}
                  style={{
                    textAlign: 'left',
                    padding: '28px 32px',
                    background: isSelected ? '#FFF0E8' : '#fff',
                    border: 'none',
                    borderLeft: isSelected ? '4px solid #E84A00' : '4px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.1s',
                    fontFamily: 'inherit',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: isSelected ? '#E84A00' : '#9CA3AF', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>
                        {role.tag}
                      </div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: '#111', letterSpacing: -0.3, marginBottom: 8, lineHeight: 1.3 }}>
                        {role.headline}
                      </div>
                      <div style={{ fontSize: 13, color: '#4B5563', lineHeight: 1.6 }}>
                        {role.desc}
                      </div>
                    </div>
                    {isSelected && (
                      <div style={{
                        width: 20, height: 20, borderRadius: '50%',
                        background: '#E84A00', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontSize: 11, fontWeight: 900,
                      }}>
                        ✓
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {error && (
            <p style={{ color: '#B91C1C', fontSize: 13, textAlign: 'center', marginBottom: 16 }}>{error}</p>
          )}

          <button
            id="onboarding-continue"
            onClick={handleContinue}
            disabled={!selected || loading}
            style={{
              width: '100%',
              background: selected ? '#E84A00' : '#E5E7EB',
              color: selected ? '#fff' : '#9CA3AF',
              border: 'none',
              padding: '16px 32px',
              fontSize: 15,
              fontWeight: 700,
              cursor: selected ? 'pointer' : 'not-allowed',
              letterSpacing: 0.3,
              transition: 'all 0.15s',
              fontFamily: 'inherit',
            }}
          >
            {loading ? 'Setting up your account...' : 'Set up my account'}
          </button>
        </div>
      </div>
    </main>
  )
}