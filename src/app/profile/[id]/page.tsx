import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

const stageBadgeClass: Record<string, string> = {
  IDEA:       'badge badge-idea',
  VALIDATION: 'badge badge-validation',
  MVP:        'badge badge-mvp',
  GROWTH:     'badge badge-growth',
  SCALING:    'badge badge-scaling',
}

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      startups: { where: { isPublished: true }, orderBy: { createdAt: 'desc' } },
      profile: true,
    },
  })

  if (!user) notFound()

  return (
    <main style={{ minHeight: '100vh', background: '#F7F7F7' }}>
      <Navbar showAuth />

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '64px 6%' }}>

        {/* PROFILE HEADER */}
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', padding: '40px', marginBottom: 1 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24, marginBottom: 24, flexWrap: 'wrap' }}>
            <div style={{
              width: 64, height: 64,
              background: '#FFF0E8',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#E84A00', fontWeight: 900, fontSize: 26,
              flexShrink: 0, borderRadius: 2,
            }}>
              {user.name?.charAt(0) ?? '?'}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#E84A00', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 }}>
                {user.role.charAt(0) + user.role.slice(1).toLowerCase()}
              </div>
              <h1 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 900, letterSpacing: -1, lineHeight: 1.05, color: '#111', marginBottom: 4 }}>
                {user.name}
              </h1>
              {user.city && (
                <div style={{ fontSize: 13, color: '#9CA3AF', fontWeight: 500 }}>{user.city}</div>
              )}
            </div>
          </div>

          {user.profile?.bio && (
            <p style={{ fontSize: 15, color: '#4B5563', lineHeight: 1.8, marginBottom: 24, paddingTop: 24, borderTop: '1px solid #F3F4F6' }}>
              {user.profile.bio}
            </p>
          )}

          {user.profile?.lookingFor && user.profile.lookingFor.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
                Looking For
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {user.profile.lookingFor.map(item => (
                  <span key={item} style={{
                    fontSize: 13, fontWeight: 600, color: '#111',
                    border: '1.5px solid #E5E7EB', padding: '6px 14px',
                    background: '#FAFAFA',
                  }}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 20, paddingTop: 24, borderTop: '1px solid #F3F4F6', flexWrap: 'wrap', alignItems: 'center' }}>
            {user.profile?.linkedin && (
              <a href={user.profile.linkedin} target="_blank" rel="noopener noreferrer"
                 style={{ fontSize: 12, fontWeight: 700, color: '#E84A00', textDecoration: 'none', letterSpacing: 1, textTransform: 'uppercase' }}>
                LinkedIn
              </a>
            )}
            {user.profile?.twitter && (
              <a href={user.profile.twitter} target="_blank" rel="noopener noreferrer"
                 style={{ fontSize: 12, fontWeight: 700, color: '#E84A00', textDecoration: 'none', letterSpacing: 1, textTransform: 'uppercase' }}>
                Twitter
              </a>
            )}
            <a
              href={`mailto:${user.email}`}
              className="btn-primary"
              style={{ fontSize: 13 }}
            >
              Get in Touch
            </a>
          </div>
        </div>

        {/* STARTUPS */}
        {user.startups.length > 0 && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#E84A00', letterSpacing: 3, textTransform: 'uppercase', margin: '40px 0 24px' }}>
              Startups
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: '#E5E7EB' }}>
              {user.startups.map(startup => (
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
                  className="profile-startup-row"
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 8 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: '#111', letterSpacing: -0.3 }}>
                      {startup.name}
                    </h3>
                    <span className={stageBadgeClass[startup.stage]} style={{ flexShrink: 0 }}>
                      {startup.stage.charAt(0) + startup.stage.slice(1).toLowerCase()}
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: '#4B5563', lineHeight: 1.5, marginBottom: startup.tags.length > 0 ? 12 : 0 }}>
                    {startup.tagline}
                  </p>
                  {startup.tags.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {startup.tags.slice(0, 4).map(tag => (
                        <span key={tag} style={{
                          fontSize: 11, fontWeight: 700, color: '#6B7280',
                          border: '1px solid #E5E7EB', padding: '2px 8px',
                          letterSpacing: 0.5, textTransform: 'uppercase',
                        }}>{tag}</span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .profile-startup-row:hover { background: #FAFAFA !important; }
      `}</style>
    </main>
  )
}