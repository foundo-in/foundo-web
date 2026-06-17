import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

const stageLabel: Record<string, string> = {
  IDEA: 'Idea', VALIDATION: 'Validation', MVP: 'MVP', GROWTH: 'Growth', SCALING: 'Scaling',
}
const stageBadge: Record<string, string> = {
  IDEA: 'badge badge-idea', VALIDATION: 'badge badge-validation',
  MVP: 'badge badge-mvp', GROWTH: 'badge badge-growth', SCALING: 'badge badge-scaling',
}

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { userId } = await auth()

  const [user, me] = await Promise.all([
    prisma.user.findUnique({
      where: { id },
      include: {
        startups: { where: { isPublished: true }, orderBy: { createdAt: 'desc' } },
        profile: true,
      },
    }),
    userId
      ? prisma.user.findUnique({ where: { clerkId: userId }, select: { name: true } })
      : null,
  ])
  if (!user) notFound()

  const currentUserName = me?.name?.split(' ')[0] ?? ''

  const initials = user.name
    ?.split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase() ?? '?'

  return (
    <main style={{ minHeight: '100vh', background: 'var(--ground)' }}>
      <Navbar userName={currentUserName} showAuth />

      <div className="page-wrap-sm">

        {/* ── PROFILE CARD ─────────────────────────────── */}
        <div className="card" style={{ padding: '28px', marginBottom: 12 }}>

          {/* Avatar + name row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, marginBottom: 20 }}>
            <div style={{
              width: 60, height: 60, flexShrink: 0,
              borderRadius: '50%',
              background: 'var(--brand-light)',
              color: 'var(--brand)',
              fontWeight: 800, fontSize: 22,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px solid var(--brand-border)',
            }}>
              {initials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
                <h1 style={{ fontSize: 'clamp(18px, 3vw, 24px)', fontWeight: 800, letterSpacing: -0.4, color: 'var(--ink)', lineHeight: 1.2 }}>
                  {user.name}
                </h1>
                <span className="badge badge-brand">
                  {user.role.charAt(0) + user.role.slice(1).toLowerCase()}
                </span>
              </div>
              {user.city && (
                <div style={{ fontSize: 13, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {user.city}
                </div>
              )}
            </div>
          </div>

          {/* Bio */}
          {user.profile?.bio && (
            <p style={{
              fontSize: 14, color: 'var(--body)', lineHeight: 1.75,
              paddingTop: 20, borderTop: '1px solid var(--n100)',
              marginBottom: 20,
            }}>
              {user.profile.bio}
            </p>
          )}

          {/* Looking for */}
          {user.profile?.lookingFor && user.profile.lookingFor.length > 0 && (
            <div style={{ marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid var(--n100)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
                Looking For
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {user.profile.lookingFor.map(item => (
                  <span key={item} style={{
                    fontSize: 13, fontWeight: 500,
                    color: 'var(--n700)',
                    background: 'var(--n50)',
                    border: '1px solid var(--n200)',
                    borderRadius: 6,
                    padding: '5px 12px',
                  }}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Links + contact */}
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
            {user.profile?.linkedin && (
              <a href={user.profile.linkedin} target="_blank" rel="noopener noreferrer"
                className="btn btn-secondary btn-sm">
                LinkedIn ↗
              </a>
            )}
            {user.profile?.twitter && (
              <a href={user.profile.twitter} target="_blank" rel="noopener noreferrer"
                className="btn btn-secondary btn-sm">
                Twitter ↗
              </a>
            )}
            <a href={`mailto:${user.email}`} className="btn btn-primary btn-sm">
              Get in Touch
            </a>
          </div>
        </div>

        {/* ── STARTUPS ─────────────────────────────────── */}
        {user.startups.length > 0 && (
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '32px 0 16px' }}>
              <h2 style={{ fontSize: 13, fontWeight: 700, color: 'var(--n700)' }}>Startups</h2>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', background: 'var(--n100)', borderRadius: 99, padding: '1px 8px' }}>
                {user.startups.length}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {user.startups.map(s => (
                <Link
                  key={s.id}
                  href={`/startups/${s.id}`}
                  className="card card-interactive"
                  style={{ padding: '20px 24px', textDecoration: 'none', color: 'inherit', display: 'block' }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: s.tagline ? 10 : 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 34, height: 34, flexShrink: 0,
                        borderRadius: 8,
                        background: 'var(--brand-light)',
                        color: 'var(--brand)',
                        fontWeight: 800, fontSize: 14,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {s.name.charAt(0)}
                      </div>
                      <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)', letterSpacing: -0.2 }}>
                        {s.name}
                      </h3>
                    </div>
                    <span className={stageBadge[s.stage]} style={{ flexShrink: 0 }}>{stageLabel[s.stage]}</span>
                  </div>
                  {s.tagline && (
                    <p style={{ fontSize: 13, color: 'var(--body)', lineHeight: 1.55, marginBottom: s.tags.length > 0 ? 12 : 0 }}>
                      {s.tagline}
                    </p>
                  )}
                  {s.tags.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                      {s.tags.slice(0, 4).map(t => <span key={t} className="chip">{t}</span>)}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}

        {user.startups.length === 0 && (
          <div className="card empty-state" style={{ marginTop: 24 }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--n700)', marginBottom: 4 }}>No public startups yet</p>
            <p style={{ fontSize: 13, color: 'var(--muted)' }}>This member hasn't listed any startups.</p>
          </div>
        )}
      </div>
    </main>
  )
}