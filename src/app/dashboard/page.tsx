import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

const roleTaglines: Record<string, string> = {
  FOUNDER:  'Keep building. Every great company started with an idea and one person.',
  INVESTOR: 'The next breakout company is out there. Go find it.',
  STUDENT:  'Ideas are free. Execution is everything. Start now.',
  BUILDER:  'Your skills are someone\'s missing piece.',
  GENERAL:  'Welcome to India\'s startup ecosystem.',
}

const roleActions: Record<string, { label: string; href: string; desc: string }[]> = {
  FOUNDER: [
    { label: 'List Your Startup', href: '/startups/new', desc: 'Create your startup profile and go live in 5 minutes' },
    { label: 'Browse Startups',  href: '/startups',     desc: 'See what others are building across India' },
    { label: 'My Connections',   href: '/connections',  desc: 'View requests and replies from your network' },
  ],
  INVESTOR: [
    { label: 'Browse Startups', href: '/startups',    desc: 'Discover early-stage founders looking for backing' },
    { label: 'My Connections',  href: '/connections', desc: 'Review connection requests you\'ve sent' },
  ],
  STUDENT: [
    { label: 'Browse Startups', href: '/startups',    desc: 'See what people are building' },
    { label: 'List Your Idea',  href: '/startups/new', desc: 'Post your idea and get community feedback' },
    { label: 'My Connections',  href: '/connections', desc: 'View your network activity' },
  ],
  BUILDER: [
    { label: 'Browse Startups',  href: '/startups',    desc: 'Find projects that need your skills' },
    { label: 'Post Your Skills', href: '/startups/new', desc: 'List what you can do and who you want to work with' },
    { label: 'My Connections',   href: '/connections', desc: 'View collaboration requests' },
  ],
  GENERAL: [
    { label: 'Browse Startups',    href: '/startups',    desc: 'Explore the platform' },
    { label: 'Complete Onboarding', href: '/onboarding', desc: 'Tell us who you are to unlock the full experience' },
  ],
}

const stageBadgeClass: Record<string, string> = {
  IDEA:       'badge badge-idea',
  VALIDATION: 'badge badge-validation',
  MVP:        'badge badge-mvp',
  GROWTH:     'badge badge-growth',
  SCALING:    'badge badge-scaling',
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
    <main style={{ minHeight: '100vh', background: '#F7F7F7' }}>
      <Navbar userName={firstName} />

      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '64px 6%' }}>

        {/* PAGE HEADER */}
        <div style={{ marginBottom: 56, paddingBottom: 40, borderBottom: '1px solid #E5E7EB' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#E84A00', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 16 }}>
            {dbUser.role}
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 900, letterSpacing: -1.5, lineHeight: 1.05, marginBottom: 12, color: '#111' }}>
            {firstName ? `Welcome back, ${firstName}.` : 'Welcome back.'}
          </h1>
          <p style={{ fontSize: 16, color: '#4B5563', maxWidth: 480, lineHeight: 1.6 }}>{tagline}</p>
        </div>

        {/* MY STARTUPS */}
        {dbUser.startups.length > 0 && (
          <section style={{ marginBottom: 56 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#E84A00', letterSpacing: 3, textTransform: 'uppercase' }}>
                My Startups
              </div>
              <Link href="/startups/new" style={{ fontSize: 12, fontWeight: 700, color: '#E84A00', textDecoration: 'none', letterSpacing: 1, textTransform: 'uppercase' }}>
                + New
              </Link>
            </div>
            <div style={{ display: 'grid', gap: 1, background: '#E5E7EB' }} className="grid-dash-startups">
              {dbUser.startups.map(startup => (
                <Link
                  key={startup.id}
                  href={`/startups/${startup.id}`}
                  style={{
                    background: '#fff',
                    padding: '28px 32px',
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'block',
                    transition: 'background 0.1s',
                  }}
                  className="startup-row"
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 16, fontWeight: 800, color: '#111', letterSpacing: -0.3 }}>
                          {startup.name}
                        </span>
                        <span className={stageBadgeClass[startup.stage]}>
                          {startup.stage.charAt(0) + startup.stage.slice(1).toLowerCase()}
                        </span>
                      </div>
                      <div style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.5 }}>{startup.tagline}</div>
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', letterSpacing: 1, textTransform: 'uppercase', whiteSpace: 'nowrap', flexShrink: 0 }}>
                      View &amp; Edit →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* QUICK ACTIONS */}
        <section style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#E84A00', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 24 }}>
            Quick Actions
          </div>
          <div style={{ display: 'grid', gap: 1, background: '#E5E7EB' }} className="grid-dash-actions">
            {actions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                style={{
                  background: '#fff',
                  padding: '28px 32px',
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'block',
                  transition: 'background 0.1s',
                }}
                className="action-row"
              >
                <div style={{ fontSize: 15, fontWeight: 700, color: '#111', marginBottom: 6, letterSpacing: -0.2 }}>
                  {action.label}
                </div>
                <div style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.5 }}>{action.desc}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* PROFILE STRIP */}
        <section>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#E84A00', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 24 }}>
            Your Profile
          </div>
          <div style={{ background: '#fff', border: '1px solid #E5E7EB', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 0 }}>
            {[
              { label: 'Name', value: dbUser.name ?? '—' },
              { label: 'Role', value: dbUser.role.charAt(0) + dbUser.role.slice(1).toLowerCase() },
              { label: 'City', value: dbUser.city ?? 'Not set' },
              { label: 'Email', value: dbUser.email },
            ].map((field, i) => (
              <div
                key={field.label}
                style={{
                  padding: '24px 28px',
                  borderRight: i < 3 ? '1px solid #E5E7EB' : 'none',
                  borderBottom: '1px solid #E5E7EB',
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>
                  {field.label}
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>{field.value}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ACTIVITY PLACEHOLDER */}
        <section style={{ marginTop: 56 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#E84A00', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 24 }}>
            Recent Activity
          </div>
          <div style={{ background: '#fff', border: '1px solid #E5E7EB', padding: '40px 32px', textAlign: 'center' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#111', marginBottom: 6, letterSpacing: -0.2 }}>
              Activity feed coming soon
            </div>
            <div style={{ fontSize: 13, color: '#9CA3AF' }}>
              Connection requests, profile views, and updates will appear here.
            </div>
          </div>
        </section>
      </div>

      <style>{`
        .grid-dash-startups, .grid-dash-actions { grid-template-columns: 1fr; }
        @media (min-width: 640px) {
          .grid-dash-startups { grid-template-columns: repeat(2, 1fr); }
          .grid-dash-actions  { grid-template-columns: repeat(3, 1fr); }
        }
        .startup-row:hover, .action-row:hover { background: #FAFAFA !important; }
      `}</style>
    </main>
  )
}