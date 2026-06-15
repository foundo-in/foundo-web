import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

const roleTaglines: Record<string, string> = {
  FOUNDER:  'Keep building. Every great company started with a single idea.',
  INVESTOR: 'The next breakout company is out there. Go find it.',
  STUDENT:  'Ideas are free. Execution is everything. Start now.',
  BUILDER:  'Your skills are someone\'s missing piece.',
  GENERAL:  'Welcome to India\'s startup ecosystem.',
}

const roleActions: Record<string, { label: string; href: string; desc: string; icon: string }[]> = {
  FOUNDER: [
    { label: 'List Your Startup', href: '/startups/new', desc: 'Go live in 5 minutes', icon: '＋' },
    { label: 'Browse Startups',   href: '/startups',     desc: 'See what others are building', icon: '⊞' },
    { label: 'Connections',       href: '/connections',  desc: 'View requests & replies', icon: '↔' },
  ],
  INVESTOR: [
    { label: 'Browse Startups', href: '/startups',    desc: 'Discover early-stage founders', icon: '⊞' },
    { label: 'Connections',     href: '/connections', desc: 'Review requests you\'ve sent', icon: '↔' },
  ],
  STUDENT: [
    { label: 'Browse Startups', href: '/startups',    desc: 'See what people are building', icon: '⊞' },
    { label: 'List Your Idea',  href: '/startups/new', desc: 'Post your idea for feedback', icon: '＋' },
    { label: 'Connections',     href: '/connections', desc: 'View your network activity', icon: '↔' },
  ],
  BUILDER: [
    { label: 'Browse Startups',  href: '/startups',    desc: 'Find projects that need you', icon: '⊞' },
    { label: 'Post Your Skills', href: '/startups/new', desc: 'Show what you can do', icon: '＋' },
    { label: 'Connections',      href: '/connections', desc: 'View collaboration requests', icon: '↔' },
  ],
  GENERAL: [
    { label: 'Browse Startups',    href: '/startups',    desc: 'Explore the platform', icon: '⊞' },
    { label: 'Complete Onboarding', href: '/onboarding', desc: 'Tell us who you are', icon: '→' },
  ],
}

const stageLabel: Record<string, string> = {
  IDEA: 'Idea', VALIDATION: 'Validation', MVP: 'MVP', GROWTH: 'Growth', SCALING: 'Scaling',
}
const stageBadge: Record<string, string> = {
  IDEA: 'badge badge-idea', VALIDATION: 'badge badge-validation',
  MVP: 'badge badge-mvp', GROWTH: 'badge badge-growth', SCALING: 'badge badge-scaling',
}

export default async function DashboardPage() {
  const user = await currentUser()
  if (!user) redirect('/sign-in')

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    include: { startups: { orderBy: { createdAt: 'desc' } } }
  })
  if (!dbUser) redirect('/onboarding')

  const actions = roleActions[dbUser.role] ?? roleActions.GENERAL
  const tagline = roleTaglines[dbUser.role] ?? roleTaglines.GENERAL
  const firstName = dbUser.name?.split(' ')[0] ?? user.firstName ?? ''

  return (
    <main style={{ minHeight: '100vh', background: 'var(--ground)' }}>
      <Navbar userName={firstName} />

      <div className="page-wrap">

        {/* ── PAGE HEADER ─────────────────────────────── */}
        <div className="slide-up" style={{ marginBottom: 56 }}>
          <p className="eyebrow" style={{ marginBottom: 12 }}>{dbUser.role}</p>
          <h1 style={{
            fontSize: 'clamp(26px, 4vw, 40px)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            color: 'var(--ink)',
            marginBottom: 10,
          }}>
            {firstName ? `Welcome back, ${firstName}.` : 'Welcome back.'}
          </h1>
          <p style={{ fontSize: 16, color: 'var(--body)', lineHeight: 1.65 }}>{tagline}</p>
        </div>

        {/* ── MY STARTUPS ─────────────────────────────── */}
        {dbUser.startups.length > 0 && (
          <section style={{ marginBottom: 56 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <span className="section-label">My Startups</span>
              <Link href="/startups/new" className="btn btn-secondary btn-sm">
                + New Startup
              </Link>
            </div>

            <div className="dash-startups-grid">
              {dbUser.startups.map(s => (
                <Link
                  key={s.id}
                  href={`/startups/${s.id}`}
                  className="card card-interactive"
                  style={{ padding: '24px', textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', gap: 16 }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{
                        width: 40, height: 40, flexShrink: 0,
                        borderRadius: 10,
                        background: 'var(--brand-light)',
                        color: 'var(--brand)',
                        fontWeight: 800, fontSize: 16,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {s.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)', lineHeight: 1.35 }}>{s.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{s.city ?? 'No location'}</div>
                      </div>
                    </div>
                    <span className={stageBadge[s.stage]}>{stageLabel[s.stage]}</span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--body)', lineHeight: 1.6, borderTop: '1px solid var(--n100)', paddingTop: 14, margin: 0 }}>
                    {s.tagline}
                  </p>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--brand)', letterSpacing: '0.1px' }}>
                    View & Edit →
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── QUICK ACTIONS ────────────────────────────── */}
        <section style={{ marginBottom: 56 }}>
          <span className="section-label" style={{ display: 'block', marginBottom: 20 }}>Quick Actions</span>
          <div className="dash-actions-grid">
            {actions.map(a => (
              <Link key={a.label} href={a.href} className="action-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{
                    width: 38, height: 38, flexShrink: 0,
                    borderRadius: 10,
                    background: 'var(--brand-light)',
                    color: 'var(--brand)',
                    fontSize: 17,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {a.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', marginBottom: 2 }}>{a.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>{a.desc}</div>
                  </div>
                </div>
                <svg width="16" height="16" fill="none" stroke="var(--n400)" strokeWidth="1.8" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </section>

        {/* ── ACCOUNT OVERVIEW ─────────────────────────── */}
        <section>
          <span className="section-label" style={{ display: 'block', marginBottom: 20 }}>Account</span>
          <div className="card" style={{ overflow: 'hidden' }}>
            {/* Profile row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '24px 28px', borderBottom: '1px solid var(--n100)' }}>
              <div style={{
                width: 48, height: 48, flexShrink: 0,
                borderRadius: '50%',
                background: 'var(--brand-light)',
                color: 'var(--brand)',
                fontWeight: 800, fontSize: 20,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {firstName.charAt(0) || '?'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', lineHeight: 1.3 }}>{dbUser.name}</div>
                <div style={{ fontSize: 13, color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2 }}>
                  {dbUser.email}
                </div>
              </div>
              <span className="badge badge-brand" style={{ flexShrink: 0 }}>
                {dbUser.role.charAt(0) + dbUser.role.slice(1).toLowerCase()}
              </span>
            </div>
            {/* Meta fields */}
            <div className="account-grid">
              {[
                { label: 'City',     value: dbUser.city ?? '—' },
                { label: 'Startups', value: String(dbUser.startups.length) },
              ].map(f => (
                <div key={f.label} style={{ padding: '18px 28px', borderRight: '1px solid var(--n100)' }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 6 }}>
                    {f.label}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>{f.value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>

      <style>{`
        .dash-startups-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
        }
        @media (min-width: 600px) {
          .dash-startups-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 900px) {
          .dash-startups-grid { grid-template-columns: repeat(3, 1fr); }
        }

        .dash-actions-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
        }
        @media (min-width: 640px) {
          .dash-actions-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 900px) {
          .dash-actions-grid { grid-template-columns: repeat(3, 1fr); }
        }

        .account-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
        }
        @media (max-width: 480px) {
          .account-grid { grid-template-columns: 1fr; }
          .account-grid > div { border-right: none !important; border-bottom: 1px solid var(--n100); }
        }
      `}</style>
    </main>
  )
}