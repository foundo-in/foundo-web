import { prisma } from '@/lib/prisma'
import StartupsClient from '@/components/StartupsClient'
import Navbar from '@/components/Navbar'

export default async function StartupsPage() {
  const startups = await prisma.startup.findMany({
    where: { isPublished: true },
    include: {
      user: { select: { name: true, city: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <main style={{ minHeight: '100vh', background: '#F7F7F7' }}>
      <Navbar showAuth />

      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '64px 6%' }}>
        <div style={{ marginBottom: 48, paddingBottom: 40, borderBottom: '1px solid #E5E7EB' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#E84A00', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 16 }}>
            Discover
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 900, letterSpacing: -1.5, lineHeight: 1.05, marginBottom: 12, color: '#111' }}>
            Startups
          </h1>
          <p style={{ fontSize: 16, color: '#4B5563', maxWidth: 480, lineHeight: 1.6 }}>
            Discover what people are building across India.
          </p>
        </div>

        <StartupsClient startups={startups} />
      </div>
    </main>
  )
}