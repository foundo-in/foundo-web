import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import EditProfileClient from './EditProfileClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Edit Profile — Foundo.in',
  description: 'Update your city, bio, and what you are looking for on Foundo.',
}

export default async function EditProfilePage() {
  const user = await currentUser()
  if (!user) redirect('/sign-in')

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    include: { profile: true },
  })
  if (!dbUser) redirect('/onboarding')

  const profile = dbUser.profile
  const firstName = dbUser.name?.split(' ')[0] ?? user.firstName ?? ''

  const initial = {
    city:       dbUser.city      ?? '',
    bio:        profile?.bio     ?? '',
    lookingFor: profile?.lookingFor ?? [],
    linkedin:   profile?.linkedin ?? '',
    twitter:    profile?.twitter  ?? '',
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--ground)' }}>
      <Navbar userName={firstName} />

      <div className="page-wrap-sm">

        {/* ── Page header ──────────────────────────────── */}
        <div className="slide-up" style={{ marginBottom: 40 }}>
          <p className="eyebrow" style={{ marginBottom: 10 }}>Your Profile</p>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <h1 style={{
                fontSize: 'clamp(24px, 4vw, 36px)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
                color: 'var(--ink)',
                marginBottom: 8,
              }}>
                Edit Profile
              </h1>
              <p style={{ fontSize: 14, color: 'var(--body)', lineHeight: 1.6 }}>
                Fill this out so investors, founders, and builders can find you.
              </p>
            </div>
            <Link href="/dashboard" className="btn btn-secondary btn-sm" style={{ flexShrink: 0 }}>
              ← Back to Dashboard
            </Link>
          </div>
        </div>

        {/* ── Profile identity header ───────────────────── */}
        <div className="card" style={{ padding: '20px 24px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
            background: 'var(--brand-light)', color: 'var(--brand)',
            fontWeight: 800, fontSize: 20,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {firstName.charAt(0).toUpperCase() || '?'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>{dbUser.name}</div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>{dbUser.email}</div>
          </div>
          <span className="badge badge-brand">
            {dbUser.role.charAt(0) + dbUser.role.slice(1).toLowerCase()}
          </span>
        </div>

        {/* ── Form ─────────────────────────────────────── */}
        <EditProfileClient initial={initial} />

      </div>
    </main>
  )
}
