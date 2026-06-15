import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

const statusStyle: Record<string, { color: string; border: string }> = {
  PENDING:  { color: '#A16207', border: '#A16207' },
  ACCEPTED: { color: '#15803D', border: '#15803D' },
  DECLINED: { color: '#B91C1C', border: '#B91C1C' },
}

export default async function ConnectionsPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) redirect('/onboarding')

  const received = await prisma.connection.findMany({
    where: { toUserId: user.id },
    include: {
      fromUser: { select: { name: true, email: true, city: true, role: true } },
      startup: { select: { name: true, id: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  const sent = await prisma.connection.findMany({
    where: { fromUserId: user.id },
    include: {
      startup: { select: { name: true, id: true } },
      toUser: { select: { name: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <main style={{ minHeight: '100vh', background: '#F7F7F7' }}>
      <Navbar />

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '64px 6%' }}>

        {/* PAGE HEADER */}
        <div style={{ marginBottom: 48, paddingBottom: 40, borderBottom: '1px solid #E5E7EB' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#E84A00', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 16 }}>
            Network
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 900, letterSpacing: -1.5, lineHeight: 1.05, marginBottom: 12, color: '#111' }}>
            Connections
          </h1>
          <p style={{ fontSize: 16, color: '#4B5563', lineHeight: 1.6 }}>
            People who want to connect with you, and requests you've sent.
          </p>
        </div>

        {/* RECEIVED */}
        <section style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#E84A00', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 24 }}>
            Received · {received.length}
          </div>

          {received.length === 0 ? (
            <div style={{ background: '#fff', border: '1px solid #E5E7EB', padding: '40px 32px', textAlign: 'center' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#111', marginBottom: 6 }}>No requests yet</div>
              <div style={{ fontSize: 13, color: '#9CA3AF' }}>Share your startup to get noticed.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: '#E5E7EB' }}>
              {received.map(c => {
                const st = statusStyle[c.status] ?? statusStyle.PENDING
                return (
                  <div
                    key={c.id}
                    style={{
                      background: '#fff',
                      borderLeft: '4px solid #16A34A',
                      padding: '28px 32px',
                    }}
                  >
                    {/* Top row */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16, gap: 16, flexWrap: 'wrap' }}>
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 800, color: '#111', letterSpacing: -0.3, marginBottom: 4 }}>
                          {c.fromUser.name}
                        </div>
                        <div style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 600, letterSpacing: 0.5 }}>
                          {c.fromUser.role.charAt(0) + c.fromUser.role.slice(1).toLowerCase()}
                          {c.fromUser.city ? ` · ${c.fromUser.city}` : ''}
                        </div>
                      </div>
                      <span style={{
                        fontSize: 11, fontWeight: 700, letterSpacing: 1.5,
                        textTransform: 'uppercase',
                        color: st.color,
                        border: `1.5px solid ${st.border}`,
                        padding: '4px 12px',
                        flexShrink: 0,
                      }}>
                        {c.status.charAt(0) + c.status.slice(1).toLowerCase()}
                      </span>
                    </div>

                    {/* Message */}
                    {c.message && (
                      <div style={{
                        borderLeft: '3px solid #E5E7EB',
                        paddingLeft: 16,
                        marginBottom: 20,
                        fontSize: 14,
                        color: '#4B5563',
                        lineHeight: 1.7,
                        fontStyle: 'italic',
                      }}>
                        "{c.message}"
                      </div>
                    )}

                    {/* Footer */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                      <div style={{ fontSize: 12, color: '#9CA3AF' }}>
                        Re:{' '}
                        <Link href={`/startups/${c.startup.id}`} style={{ color: '#E84A00', fontWeight: 700, textDecoration: 'none' }}>
                          {c.startup.name}
                        </Link>
                      </div>
                      <a
                        href={`mailto:${c.fromUser.email}`}
                        className="btn-primary"
                        style={{ fontSize: 12, padding: '9px 20px', letterSpacing: 0.5 }}
                      >
                        Reply via Email
                      </a>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* SENT */}
        <section>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#E84A00', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 24 }}>
            Sent · {sent.length}
          </div>

          {sent.length === 0 ? (
            <div style={{ background: '#fff', border: '1px solid #E5E7EB', padding: '40px 32px', textAlign: 'center' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#111', marginBottom: 8 }}>No outgoing requests yet</div>
              <Link href="/startups" className="btn-primary" style={{ fontSize: 13 }}>
                Browse Startups
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: '#E5E7EB' }}>
              {sent.map(c => {
                const st = statusStyle[c.status] ?? statusStyle.PENDING
                return (
                  <div key={c.id} style={{ background: '#fff', padding: '28px 32px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: c.message ? 16 : 0, flexWrap: 'wrap' }}>
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 800, color: '#111', letterSpacing: -0.3, marginBottom: 4 }}>
                          <Link href={`/startups/${c.startup.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                            {c.startup.name}
                          </Link>
                        </div>
                        <div style={{ fontSize: 12, color: '#9CA3AF' }}>by {c.toUser.name}</div>
                      </div>
                      <span style={{
                        fontSize: 11, fontWeight: 700, letterSpacing: 1.5,
                        textTransform: 'uppercase',
                        color: st.color,
                        border: `1.5px solid ${st.border}`,
                        padding: '4px 12px',
                        flexShrink: 0,
                      }}>
                        {c.status.charAt(0) + c.status.slice(1).toLowerCase()}
                      </span>
                    </div>
                    {c.message && (
                      <div style={{
                        borderLeft: '3px solid #E5E7EB',
                        paddingLeft: 16,
                        fontSize: 14,
                        color: '#4B5563',
                        lineHeight: 1.7,
                        fontStyle: 'italic',
                      }}>
                        "{c.message}"
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}