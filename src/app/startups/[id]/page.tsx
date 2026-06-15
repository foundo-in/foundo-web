import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import Link from 'next/link'
import ConnectButton from '@/components/ConnectButton'
import Navbar from '@/components/Navbar'

const stageBadgeClass: Record<string, string> = {
  IDEA:       'badge badge-idea',
  VALIDATION: 'badge badge-validation',
  MVP:        'badge badge-mvp',
  GROWTH:     'badge badge-growth',
  SCALING:    'badge badge-scaling',
}

export default async function StartupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { userId } = await auth()

  const startup = await prisma.startup.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, city: true, email: true, clerkId: true, id: true } },
    },
  })

  if (!startup) notFound()

  const isOwner = userId === startup.user.clerkId

  let alreadyConnected = false
  if (userId && !isOwner) {
    const currentUser = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (currentUser) {
      const existing = await prisma.connection.findFirst({
        where: { fromUserId: currentUser.id, startupId: startup.id }
      })
      alreadyConnected = !!existing
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: '#F7F7F7' }}>
      <Navbar showAuth />

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '64px 6%' }}>

        {/* HEADER */}
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', padding: '40px 40px 0', marginBottom: 1 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 32, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 52, height: 52,
                background: '#FFF0E8',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#E84A00', fontWeight: 900, fontSize: 22,
                flexShrink: 0, borderRadius: 2,
              }}>
                {startup.name.charAt(0)}
              </div>
              <div>
                <h1 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 900, letterSpacing: -1, lineHeight: 1.05, color: '#111', marginBottom: 4 }}>
                  {startup.name}
                </h1>
                <p style={{ fontSize: 15, color: '#4B5563', lineHeight: 1.5 }}>{startup.tagline}</p>
              </div>
            </div>
            <span className={stageBadgeClass[startup.stage]} style={{ flexShrink: 0 }}>
              {startup.stage.charAt(0) + startup.stage.slice(1).toLowerCase()}
            </span>
          </div>

          {startup.tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, paddingBottom: 24, borderBottom: '1px solid #F3F4F6' }}>
              {startup.tags.map(tag => (
                <span key={tag} style={{
                  fontSize: 11, fontWeight: 700, color: '#6B7280',
                  border: '1px solid #E5E7EB', padding: '3px 10px',
                  letterSpacing: 0.5, textTransform: 'uppercase',
                }}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* ABOUT */}
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderTop: 'none', padding: '32px 40px', marginBottom: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#E84A00', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 16 }}>
            About
          </div>
          <p style={{ fontSize: 15, color: '#111', lineHeight: 1.8 }}>{startup.description}</p>
        </div>

        {/* LOOKING FOR */}
        {startup.lookingFor.length > 0 && (
          <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderTop: 'none', padding: '32px 40px', marginBottom: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#E84A00', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 16 }}>
              Looking For
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {startup.lookingFor.map(item => (
                <span key={item} style={{
                  fontSize: 13, fontWeight: 600, color: '#111',
                  border: '1.5px solid #E5E7EB', padding: '8px 16px',
                  background: '#FAFAFA',
                }}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* FOUNDER + CTA */}
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderTop: 'none', padding: '32px 40px', marginBottom: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#E84A00', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 16 }}>
            Founded By
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <Link href={`/profile/${startup.userId}`} className="founder-link">
                {startup.user.name}
              </Link>
              {startup.city && (
                <div style={{ fontSize: 13, color: '#9CA3AF', marginTop: 4 }}>{startup.city}</div>
              )}
            </div>
            {isOwner ? (
              <Link href={`/startups/${startup.id}/edit`} className="btn-outline">
                Edit Startup
              </Link>
            ) : userId ? (
              <ConnectButton startupId={startup.id} alreadyConnected={alreadyConnected} />
            ) : (
              <Link href="/sign-up" className="btn-primary">
                Sign up to Connect
              </Link>
            )}
          </div>
        </div>

        {/* LINKS */}
        {(startup.website || startup.linkedin) && (
          <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderTop: 'none', padding: '24px 40px' }}>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              {startup.website && (
                <a href={startup.website} target="_blank" rel="noopener noreferrer" className="ext-link">
                  Website
                </a>
              )}
              {startup.linkedin && (
                <a href={startup.linkedin} target="_blank" rel="noopener noreferrer" className="ext-link">
                  LinkedIn
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .founder-link { font-weight: 700; font-size: 16px; color: #111; text-decoration: none; transition: color 0.15s; }
        .founder-link:hover { color: #E84A00; }
        .ext-link { font-size: 13px; font-weight: 700; color: #E84A00; text-decoration: none; letter-spacing: 0.5px; text-transform: uppercase; }
        .ext-link:hover { text-decoration: underline; }
      `}</style>
    </main>
  )
}