'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const roles = [
  {
    id: 'FOUNDER',
    label: 'Founder',
    headline: 'I\'m building something.',
    desc: 'List your startup, find co-founders and investors, get noticed by the right people.',
    icon: '⚡',
  },
  {
    id: 'INVESTOR',
    label: 'Investor',
    headline: 'I want to back the next big thing.',
    desc: 'Discover early-stage startups and connect directly with founders — no middlemen.',
    icon: '💡',
  },
  {
    id: 'STUDENT',
    label: 'Student',
    headline: 'I have an idea and want to move fast.',
    desc: 'Validate your idea, find mentors, and connect with people building things that matter.',
    icon: '🚀',
  },
  {
    id: 'BUILDER',
    label: 'Builder',
    headline: 'I have skills and want to collaborate.',
    desc: 'Find projects that need you. Showcase what you can do. Build something real.',
    icon: '🛠',
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
      if (!res.ok) throw new Error('Failed to save. Please try again.')
      router.push('/dashboard')
    } catch (e: any) {
      setError(e.message)
      setLoading(false)
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--ground)', display: 'flex', flexDirection: 'column' }}>

      {/* Brand bar */}
      <div style={{
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--n100)',
        height: 60,
        display: 'flex',
        alignItems: 'center',
        padding: '0 6%',
        justifyContent: 'space-between',
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: 'var(--brand)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 900, fontSize: 14,
          }}>F</div>
          <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: '-0.5px', color: 'var(--ink)' }}>
            Foundo<span style={{ color: 'var(--brand)' }}>.in</span>
          </span>
        </Link>
        <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 500 }}>Step 1 of 1</span>
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '64px 6% 96px' }}>
        <div style={{ width: '100%', maxWidth: 560 }} className="slide-up">

          {/* Heading */}
          <div style={{ marginBottom: 40 }}>
            <p className="eyebrow" style={{ marginBottom: 14 }}>Getting started</p>
            <h1 style={{
              fontSize: 'clamp(28px, 4vw, 40px)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              color: 'var(--ink)',
              marginBottom: 12,
            }}>
              Who are you?
            </h1>
            <p style={{ fontSize: 15, color: 'var(--body)', lineHeight: 1.65 }}>
              We'll personalise your Foundo experience based on your role.
            </p>
          </div>

          {/* Role cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
            {roles.map(role => {
              const active = selected === role.id
              return (
                <button
                  key={role.id}
                  id={`role-${role.id.toLowerCase()}`}
                  onClick={() => setSelected(role.id)}
                  style={{
                    textAlign: 'left',
                    padding: '20px 24px',
                    background: active ? 'var(--brand-light)' : '#fff',
                    border: active ? '1.5px solid var(--brand)' : '1px solid var(--n200)',
                    borderRadius: 12,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    boxShadow: active
                      ? '0 0 0 3px rgba(232,74,0,0.09), var(--sh-sm)'
                      : 'var(--sh-xs)',
                    transition: 'all 0.18s var(--ease-out)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 18,
                  }}
                  className={active ? '' : 'role-card-inactive'}
                >
                  {/* Icon */}
                  <div style={{
                    width: 44, height: 44, flexShrink: 0,
                    borderRadius: 10,
                    background: active ? 'rgba(232,74,0,0.1)' : 'var(--n100)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 20,
                    transition: 'background 0.18s ease',
                  }}>
                    {role.icon}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: active ? 'var(--brand)' : 'var(--ink)',
                      marginBottom: 4,
                      letterSpacing: '-0.1px',
                      transition: 'color 0.15s ease',
                    }}>
                      {role.label}
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--body)', lineHeight: 1.55, margin: 0 }}>
                      {role.desc}
                    </p>
                  </div>

                  {/* Selected indicator */}
                  <div style={{
                    width: 20, height: 20, flexShrink: 0,
                    borderRadius: '50%',
                    border: active ? '6px solid var(--brand)' : '2px solid var(--n300)',
                    background: active ? 'var(--brand-light)' : '#fff',
                    transition: 'all 0.18s ease',
                  }} />
                </button>
              )
            })}
          </div>

          {error && (
            <div style={{
              fontSize: 13, color: 'var(--red)',
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: 8,
              padding: '12px 16px',
              marginBottom: 16,
              lineHeight: 1.5,
            }}>
              {error}
            </div>
          )}

          <button
            id="onboarding-continue"
            onClick={handleContinue}
            disabled={!selected || loading}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', fontFamily: 'inherit' }}
          >
            {loading ? (
              <>
                <span className="spinner" style={{ width: 15, height: 15, borderWidth: '1.75px' }} />
                Setting up your account…
              </>
            ) : 'Continue'}
          </button>

          <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--muted)', marginTop: 18, lineHeight: 1.6 }}>
            You can update your role anytime from your profile settings.
          </p>
        </div>
      </div>

      <style>{`
        .role-card-inactive:hover {
          border-color: var(--n300) !important;
          box-shadow: var(--sh-sm) !important;
          background: var(--n50) !important;
        }
      `}</style>
    </main>
  )
}