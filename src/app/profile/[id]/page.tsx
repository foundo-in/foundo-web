import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

const roleColors: Record<string, string> = {
  FOUNDER: 'bg-orange-100 text-orange-700',
  INVESTOR: 'bg-blue-100 text-blue-700',
  STUDENT: 'bg-purple-100 text-purple-700',
  BUILDER: 'bg-green-100 text-green-700',
  GENERAL: 'bg-gray-100 text-gray-700',
}

const stageColors: Record<string, string> = {
  IDEA: 'bg-purple-100 text-purple-700',
  VALIDATION: 'bg-blue-100 text-blue-700',
  MVP: 'bg-yellow-100 text-yellow-700',
  GROWTH: 'bg-green-100 text-green-700',
  SCALING: 'bg-orange-100 text-orange-700',
}

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      startups: {
        where: { isPublished: true },
        orderBy: { createdAt: 'desc' },
      },
      profile: true,
    },
  })

  if (!user) notFound()

  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      <Navbar showAuth />

      <div className="max-w-[720px] mx-auto px-4 sm:px-[6%] py-8 sm:py-12">
        {/* PROFILE HEADER */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="w-16 h-16 rounded-full bg-[#FFF0E8] flex items-center justify-center text-[#E84A00] font-black text-2xl">
              {user.name?.charAt(0) ?? '?'}
            </div>
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${roleColors[user.role]}`}>
              {user.role.charAt(0) + user.role.slice(1).toLowerCase()}
            </span>
          </div>

          <h1 className="text-3xl font-black tracking-tight mb-1">{user.name}</h1>
          {user.city && <p className="text-[#9CA3AF] text-sm mb-4">📍 {user.city}</p>}

          {user.profile?.bio && (
            <p className="text-[#4B5563] leading-relaxed mb-6">{user.profile.bio}</p>
          )}

          {user.profile?.lookingFor && user.profile.lookingFor.length > 0 && (
            <div className="mb-6">
              <div className="text-xs font-bold text-[#9CA3AF] uppercase tracking-widest mb-3">Looking For</div>
              <div className="flex flex-wrap gap-2">
                {user.profile.lookingFor.map(item => (
                  <span key={item} className="bg-[#F3F4F6] text-[#1A1A1A] text-sm font-semibold px-3 py-1.5 rounded-lg">{item}</span>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4 pt-4 border-t border-[#F3F4F6]">
            {user.profile?.linkedin && (
              <a href={user.profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-[#E84A00] text-sm font-semibold hover:underline">💼 LinkedIn</a>
            )}
            {user.profile?.twitter && (
              <a href={user.profile.twitter} target="_blank" rel="noopener noreferrer" className="text-[#E84A00] text-sm font-semibold hover:underline">🐦 Twitter</a>
            )}
            <a href={`mailto:${user.email}`} className="text-[#E84A00] text-sm font-semibold hover:underline">✉ Get in Touch</a>
          </div>
        </div>

        {/* STARTUPS */}
        {user.startups.length > 0 && (
          <div>
            <h2 className="text-xs font-bold text-[#9CA3AF] uppercase tracking-widest mb-4">Startups</h2>
            <div className="space-y-4">
              {user.startups.map(startup => (
                <Link
                  key={startup.id}
                  href={`/startups/${startup.id}`}
                  className="block bg-white border border-[#E5E7EB] rounded-xl p-6 hover:border-[#E84A00] transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-black">{startup.name}</h3>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${stageColors[startup.stage]}`}>
                      {startup.stage.charAt(0) + startup.stage.slice(1).toLowerCase()}
                    </span>
                  </div>
                  <p className="text-sm text-[#4B5563]">{startup.tagline}</p>
                  {startup.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {startup.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="bg-[#F3F4F6] text-[#4B5563] text-xs px-2 py-0.5 rounded-full">{tag}</span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}