import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import StartupsClient from '@/components/StartupsClient'
import Navbar from '@/components/Navbar'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Browse Startups — Foundo.in',
  description: 'Discover early-stage startups being built across India. Connect with founders, investors, and builders.',
}

export default async function StartupsPage() {
  const { userId } = await auth()

  const [startups, me] = await Promise.all([
    prisma.startup.findMany({
      where: { isPublished: true },
      include: { user: { select: { name: true, city: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    userId
      ? prisma.user.findUnique({ where: { clerkId: userId }, select: { name: true } })
      : null,
  ])

  const userName = me?.name?.split(' ')[0] ?? ''

  return (
    <main style={{ minHeight: '100vh', background: 'var(--ground)' }}>
      <Navbar userName={userName} showAuth />

      <div className="page-wrap">
        {/* Page header */}
        <div style={{ marginBottom: 36 }}>
          <p className="eyebrow" style={{ marginBottom: 10 }}>Discover</p>
          <h1 style={{
            fontSize: 'clamp(26px, 4vw, 38px)',
            fontWeight: 800, letterSpacing: -0.8,
            lineHeight: 1.15, color: 'var(--ink)', marginBottom: 8,
          }}>
            Browse Startups
          </h1>
          <p style={{ fontSize: 15, color: 'var(--body)', lineHeight: 1.6, maxWidth: 480 }}>
            {startups.length > 0
              ? `${startups.length} startup${startups.length !== 1 ? 's' : ''} being built across India.`
              : 'No startups yet — be the first to list yours.'}
          </p>
        </div>

        <StartupsClient startups={startups} />
      </div>
    </main>
  )
}