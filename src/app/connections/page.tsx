import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

const statusBadge: Record<string, { cls: string; label: string }> = {
  PENDING:  { cls: 'badge badge-amber', label: 'Pending' },
  ACCEPTED: { cls: 'badge badge-green', label: 'Accepted' },
  DECLINED: { cls: 'badge badge-red',   label: 'Declined' },
}

export default async function ConnectionsPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) redirect('/onboarding')

  const [received, sent] = await Promise.all([
    prisma.connection.findMany({
      where: { toUserId: user.id },
      include: {
        fromUser: { select: { name: true, email: true, city: true, role: true } },
        startup: { select: { name: true, id: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.connection.findMany({
      where: { fromUserId: user.id },
      include: {
        startup: { select: { name: true, id: true } },
        toUser:  { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
  ])

  return (
    <main style={{ minHeight: '100vh', background: 'var(--ground)' }}>
      <Navbar userName={user.name?.split(' ')[0] ?? ''} />

      <div className="page-wrap-sm">

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <p className="eyebrow" style={{ marginBottom: 10 }}>Network</p>
          <h1 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, letterSpacing: -0.5, color: 'var(--ink)', marginBottom: 8, lineHeight: 1.2 }}>
            Connections
          </h1>
          <p style={{ fontSize: 14, color: 'var(--body)' }}>
            Manage incoming requests and track who you've reached out to.
          </p>
        </div>

        {/* ── RECEIVED ───────────────────────────────────── */}
        <section style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <h2 style={{ fontSize: 13, fontWeight: 700, color: 'var(--n700)' }}>Received</h2>
            <span style={{
              fontSize: 11, fontWeight: 700, color: received.length > 0 ? 'var(--brand)' : 'var(--muted)',
              background: received.length > 0 ? 'var(--brand-light)' : 'var(--n100)',
              borderRadius: 99, padding: '1px 8px',
            }}>
              {received.length}
            </span>
          </div>

          {received.length === 0 ? (
            <div className="card empty-state">
              <svg width="32" height="32" fill="none" stroke="var(--n300)" strokeWidth="1.5" viewBox="0 0 24 24" style={{ marginBottom: 12 }}>
                <path strokeLinecap="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--n700)', marginBottom: 4 }}>No requests yet</p>
              <p style={{ fontSize: 13, color: 'var(--muted)' }}>Share your startup to start getting connection requests.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {received.map(c => {
                const sb = statusBadge[c.status] ?? statusBadge.PENDING
                return (
                  <div key={c.id} className="card" style={{
                    padding: '20px 24px',
                    borderLeft: '3px solid #16A34A',
                    borderRadius: 8,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: c.message ? 14 : 16, flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                          width: 36, height: 36, flexShrink: 0,
                          borderRadius: '50%',
                          background: 'var(--n100)',
                          color: 'var(--n600)', fontWeight: 700, fontSize: 14,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          {c.fromUser.name?.charAt(0) ?? '?'}
                        </div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>{c.fromUser.name}</div>
                          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 1 }}>
                            {c.fromUser.role.charAt(0) + c.fromUser.role.slice(1).toLowerCase()}
                            {c.fromUser.city ? ` · ${c.fromUser.city}` : ''}
                          </div>
                        </div>
                      </div>
                      <span className={sb.cls}>{sb.label}</span>
                    </div>

                    {c.message && (
                      <div style={{
                        fontSize: 13, color: 'var(--body)', lineHeight: 1.6,
                        fontStyle: 'italic',
                        background: 'var(--n50)',
                        border: '1px solid var(--n200)',
                        borderRadius: 6,
                        padding: '10px 14px',
                        marginBottom: 16,
                      }}>
                        "{c.message}"
                      </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                      <span style={{ fontSize: 12, color: 'var(--muted)' }}>
                        Re:{' '}
                        <Link href={`/startups/${c.startup.id}`} style={{ color: 'var(--brand)', fontWeight: 600, textDecoration: 'none' }}>
                          {c.startup.name}
                        </Link>
                      </span>
                      <a href={`mailto:${c.fromUser.email}`} className="btn btn-primary btn-sm">
                        Reply via Email
                      </a>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* ── SENT ───────────────────────────────────────── */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <h2 style={{ fontSize: 13, fontWeight: 700, color: 'var(--n700)' }}>Sent</h2>
            <span style={{
              fontSize: 11, fontWeight: 700,
              color: 'var(--muted)', background: 'var(--n100)',
              borderRadius: 99, padding: '1px 8px',
            }}>
              {sent.length}
            </span>
          </div>

          {sent.length === 0 ? (
            <div className="card empty-state">
              <svg width="32" height="32" fill="none" stroke="var(--n300)" strokeWidth="1.5" viewBox="0 0 24 24" style={{ marginBottom: 12 }}>
                <path strokeLinecap="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
              </svg>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--n700)', marginBottom: 4 }}>No outgoing requests yet</p>
              <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>Browse startups and reach out to founders.</p>
              <Link href="/startups" className="btn btn-primary btn-sm">
                Browse Startups
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {sent.map(c => {
                const sb = statusBadge[c.status] ?? statusBadge.PENDING
                return (
                  <div key={c.id} className="card" style={{ padding: '20px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: c.message ? 14 : 0, flexWrap: 'wrap' }}>
                      <div>
                        <Link href={`/startups/${c.startup.id}`} style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)', textDecoration: 'none', display: 'block', marginBottom: 2 }}>
                          {c.startup.name}
                        </Link>
                        <div style={{ fontSize: 12, color: 'var(--muted)' }}>by {c.toUser.name}</div>
                      </div>
                      <span className={sb.cls}>{sb.label}</span>
                    </div>
                    {c.message && (
                      <div style={{
                        fontSize: 13, color: 'var(--body)', lineHeight: 1.6,
                        fontStyle: 'italic',
                        background: 'var(--n50)',
                        border: '1px solid var(--n200)',
                        borderRadius: 6,
                        padding: '10px 14px',
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