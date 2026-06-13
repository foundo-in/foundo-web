'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const roles = [
  {
    id: 'FOUNDER',
    title: 'Founder',
    desc: 'I have an idea or startup and need co-founders, team, or investors.',
    icon: '🚀',
  },
  {
    id: 'INVESTOR',
    title: 'Investor',
    desc: 'I want to discover and back early-stage startups in India.',
    icon: '💰',
  },
  {
    id: 'STUDENT',
    title: 'Student',
    desc: 'I want to validate my idea and find mentors or co-builders.',
    icon: '🎓',
  },
  {
    id: 'BUILDER',
    title: 'Builder',
    desc: 'I have skills and want to collaborate on exciting projects.',
    icon: '🛠️',
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
    } catch (e) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-10">
          <div className="w-12 h-12 rounded-full bg-[#E84A00] flex items-center justify-center text-white font-black text-2xl mx-auto mb-4">F</div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Who are you?</h1>
          <p className="text-[#4B5563]">We'll personalise your experience from day one.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => setSelected(role.id)}
              className={`text-left border-[1.5px] rounded-xl p-6 transition-all ${
                selected === role.id
                  ? 'border-[#E84A00] bg-[#FFF9F7]'
                  : 'border-[#E5E7EB] bg-white hover:border-[#E84A00]'
              }`}
            >
              <div className="text-3xl mb-3">{role.icon}</div>
              <h3 className="text-lg font-bold mb-1">{role.title}</h3>
              <p className="text-sm text-[#4B5563] leading-relaxed">{role.desc}</p>
            </button>
          ))}
        </div>

        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        <button
          onClick={handleContinue}
          disabled={!selected || loading}
          className="w-full bg-[#E84A00] text-white py-4 rounded-xl font-bold text-base hover:bg-[#cf4000] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : 'Continue →'}
        </button>
      </div>
    </main>
  )
}