import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'

const stageColors: Record<string, string> = {
  IDEA: 'bg-purple-100 text-purple-700',
  VALIDATION: 'bg-blue-100 text-blue-700',
  MVP: 'bg-yellow-100 text-yellow-700',
  GROWTH: 'bg-green-100 text-green-700',
  SCALING: 'bg-orange-100 text-orange-700',
}

export default async function StartupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const startup = await prisma.startup.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, city: true, email: true } },
    },
  })

  if (!startup) notFound()

  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      <nav className="bg-white border-b border-[#E5E7EB] px-[6%] h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#E84A00] flex items-center justify-center text-white font-black text-base">F</div>
          <span className="text-lg font-black tracking-tight">Foundo<span className="text-[#E84A00]">.in</span></span>
        </div>
        <Link href="/startups" className="text-sm text-[#4B5563] hover:text-[#1A1A1A]">
          ← Browse Startups
        </Link>
      </nav>

      <div className="max-w-[720px] mx-auto px-[6%] py-12">
        {/* HEADER */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="w-16 h-16 rounded-xl bg-[#FFF0E8] flex items-center justify-center text-[#E84A00] font-black text-3xl">
              {startup.name.charAt(0)}
            </div>
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${stageColors[startup.stage]}`}>
              {startup.stage.charAt(0) + startup.stage.slice(1).toLowerCase()}
            </span>
          </div>

          <h1 className="text-3xl font-black tracking-tight mb-2">{startup.name}</h1>
          <p className="text-lg text-[#4B5563] mb-6">{startup.tagline}</p>

          {startup.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {startup.tags.map(tag => (
                <span key={tag} className="bg-[#FFF0E8] text-[#E84A00] text-xs font-bold px-3 py-1 rounded-full">{tag}</span>
              ))}
            </div>
          )}

          <div className="border-t border-[#F3F4F6] pt-6">
            <h2 className="text-xs font-bold text-[#9CA3AF] uppercase tracking-widest mb-3">About</h2>
            <p className="text-[#1A1A1A] leading-relaxed">{startup.description}</p>
          </div>
        </div>

        {/* LOOKING FOR */}
        {startup.lookingFor.length > 0 && (
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-8 mb-6">
            <h2 className="text-xs font-bold text-[#9CA3AF] uppercase tracking-widest mb-4">Looking For</h2>
            <div className="flex flex-wrap gap-2">
              {startup.lookingFor.map(item => (
                <span key={item} className="bg-[#F3F4F6] text-[#1A1A1A] text-sm font-semibold px-4 py-2 rounded-lg">{item}</span>
              ))}
            </div>
          </div>
        )}

        {/* FOUNDER */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-8 mb-6">
          <h2 className="text-xs font-bold text-[#9CA3AF] uppercase tracking-widest mb-4">Founded By</h2>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold text-[#1A1A1A]">{startup.user.name}</div>
              {startup.city && <div className="text-sm text-[#9CA3AF] mt-0.5">📍 {startup.city}</div>}
            </div>
            <a href={`mailto:${startup.user.email}`} className="bg-[#E84A00] text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-[#cf4000] transition-colors">Get in Touch</a>
          </div>
        </div>

        {/* LINKS */}
        {(startup.website || startup.linkedin) && (
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-8">
            <h2 className="text-xs font-bold text-[#9CA3AF] uppercase tracking-widest mb-4">Links</h2>
            <div className="flex gap-4">
              {startup.website && (
                <a href={startup.website} target="_blank" rel="noopener noreferrer" className="text-[#E84A00] font-semibold text-sm hover:underline">
                  🌐 Website
                </a>
              )}
              {startup.linkedin && (
                <a href={startup.linkedin} target="_blank" rel="noopener noreferrer" className="text-[#E84A00] font-semibold text-sm hover:underline">
                  💼 LinkedIn
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}