import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import Link from 'next/link'
import ConnectButton from '@/components/ConnectButton'
import Navbar from '@/components/Navbar'

const stageLabel: Record<string, string> = {
  IDEA: 'Idea', VALIDATION: 'Validation', MVP: 'MVP', GROWTH: 'Growth', SCALING: 'Scaling',
}
const stageBadge: Record<string, string> = {
  IDEA: 'badge badge-idea', VALIDATION: 'badge badge-validation',
  MVP: 'badge badge-mvp', GROWTH: 'badge badge-growth', SCALING: 'badge badge-scaling',
}

export default async function StartupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { userId } = await auth()

  const startup = await prisma.startup.findUnique({
    where: { id },
    include: { user: { select: { name: true, city: true, email: true, clerkId: true, id: true } } },
  })
  if (!startup) notFound()

  const isOwner = userId === startup.user.clerkId

  let alreadyConnected = false
  if (userId && !isOwner) {
    const me = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (me) {
      const existing = await prisma.connection.findFirst({ where: { fromUserId: me.id, startupId: startup.id } })
      alreadyConnected = !!existing
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--ground)' }}>
      <Navbar showAuth />

      <div className="page-wrap-sm">

        {/* ── HEADER CARD ────────────────────────────────── */}
        <div className="card slide-up" style={{ padding: '32px', marginBottom: 14 }}>

          {/* Back link */}
          <Link
            href="/startups"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 13, color: 'var(--muted)', fontWeight: 500,
              textDecoration: 'none', marginBottom: 24,
              transition: 'color 0.15s ease',
            }}
            className="back-link"
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Browse Startups
          </Link>

          {/* Top: avatar + name + badge */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18, marginBottom: 24 }}>
            <div style={{
              width: 60, height: 60, flexShrink: 0,
              borderRadius: 14,
              background: 'var(--brand-light)',
              color: 'var(--brand)',
              fontWeight: 900, fontSize: 24,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {startup.name.charAt(0)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 8 }}>
                <h1 style={{
                  fontSize: 'clamp(20px, 3.5vw, 30px)',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  color: 'var(--ink)',
                  lineHeight: 1.2,
                }}>
                  {startup.name}
                </h1>
                <span className={stageBadge[startup.stage]}>{stageLabel[startup.stage]}</span>
              </div>
              <p style={{ fontSize: 15, color: 'var(--body)', lineHeight: 1.6 }}>{startup.tagline}</p>
            </div>
          </div>

          {/* Tags */}
          {startup.tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, paddingTop: 20, borderTop: '1px solid var(--n100)' }}>
              {startup.tags.map(tag => <span key={tag} className="chip">{tag}</span>)}
            </div>
          )}
        </div>

        {/* ── ABOUT ──────────────────────────────────────── */}
        <div className="card slide-up anim-delay-1" style={{ padding: '28px 32px', marginBottom: 14 }}>
          <h2 className="eyebrow" style={{ marginBottom: 14 }}>About</h2>
          <p style={{ fontSize: 15, color: 'var(--ink)', lineHeight: 1.8, fontWeight: 400 }}>
            {startup.description}
          </p>
        </div>

        {/* ── LOOKING FOR ────────────────────────────────── */}
        {startup.lookingFor.length > 0 && (
          <div className="card slide-up anim-delay-2" style={{ padding: '28px 32px', marginBottom: 14 }}>
            <h2 className="eyebrow" style={{ marginBottom: 16 }}>Looking For</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {startup.lookingFor.map(item => (
                <span key={item} style={{
                  fontSize: 13, fontWeight: 500,
                  color: 'var(--n700)',
                  background: 'var(--n50)',
                  border: '1px solid var(--n200)',
                  borderRadius: 'var(--r-3)',
                  padding: '8px 16px',
                  lineHeight: 1.4,
                }}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── FOUNDER + CTA ──────────────────────────────── */}
        <div className="card slide-up anim-delay-3" style={{ padding: '28px 32px', marginBottom: (startup.website || startup.linkedin) ? 14 : 0 }}>
          <h2 className="eyebrow" style={{ marginBottom: 18 }}>Founded By</h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 42, height: 42, flexShrink: 0,
                borderRadius: '50%',
                background: 'var(--n100)',
                color: 'var(--n600)',
                fontWeight: 700, fontSize: 15,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1px solid var(--n200)',
              }}>
                {startup.user.name?.charAt(0) ?? '?'}
              </div>
              <div>
                <Link
                  href={`/profile/${startup.userId}`}
                  style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', textDecoration: 'none', display: 'block', marginBottom: 2 }}
                  className="founder-link"
                >
                  {startup.user.name}
                </Link>
                {startup.city && (
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>{startup.city}</div>
                )}
              </div>
            </div>

            <div>
              {isOwner ? (
                <Link href={`/startups/${startup.id}/edit`} className="btn btn-secondary">
                  Edit Startup
                </Link>
              ) : userId ? (
                <ConnectButton startupId={startup.id} alreadyConnected={alreadyConnected} />
              ) : (
                <Link href="/sign-up" className="btn btn-primary">
                  Sign up to Connect
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* ── LINKS ──────────────────────────────────────── */}
        {(startup.website || startup.linkedin) && (
          <div className="card slide-up anim-delay-4" style={{ padding: '20px 32px' }}>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.9px' }}>
                Links
              </span>
              {startup.website && (
                <a href={startup.website} target="_blank" rel="noopener noreferrer" className="ext-link">
                  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ display: 'inline', marginRight: 5, verticalAlign: 'middle' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6m0 0v6m0-6L10 14" />
                  </svg>
                  Website
                </a>
              )}
              {startup.linkedin && (
                <a href={startup.linkedin} target="_blank" rel="noopener noreferrer" className="ext-link">
                  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ display: 'inline', marginRight: 5, verticalAlign: 'middle' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6m0 0v6m0-6L10 14" />
                  </svg>
                  LinkedIn
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .back-link:hover { color: var(--ink) !important; }
        .founder-link:hover { color: var(--brand) !important; }
        .ext-link {
          display: inline-flex;
          align-items: center;
          font-size: 13px;
          font-weight: 600;
          color: var(--brand);
          text-decoration: none;
          transition: opacity 0.15s ease;
        }
        .ext-link:hover { opacity: 0.72; }
      `}</style>
    </main>
  )
}