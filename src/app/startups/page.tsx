import { prisma } from '@/lib/prisma'
import Link from 'next/link'

const stageColors: Record<string, string> = {
  IDEA: 'bg-purple-100 text-purple-700',
  VALIDATION: 'bg-blue-100 text-blue-700',
  MVP: 'bg-yellow-100 text-yellow-700',
  GROWTH: 'bg-green-100 text-green-700',
  SCALING: 'bg-orange-100 text-orange-700',
}

export default async function StartupsPage() {
  const startups = await prisma.startup.findMany({
    where: { isPublished: true },
    include: {
      user: { select: { name: true, city: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      <nav className="bg-white border-b border-[#E5E7EB] px-[6%] h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#E84A00] flex items-center justify-center text-white font-black text-base">F</div>
          <span className="text-lg font-black tracking-tight">Foundo<span className="text-[#E84A00]">.in</span></span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-sm text-[#4B5563] hover:text-[#1A1A1A]">Dashboard</Link>
          <Link href="/startups/new" className="bg-[#E84A00] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#cf4000] transition-colors">
            + List Startup
          </Link>
        </div>
      </nav>

      <div className="max-w-[1080px] mx-auto px-[6%] py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-black tracking-tight mb-2">Startups</h1>
          <p className="text-[#4B5563]">Discover what people are building across India.</p>
        </div>

        {startups.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🚀</div>
            <h2 className="text-2xl font-black mb-2">No startups yet</h2>
            <p className="text-[#4B5563] mb-6">Be the first to list yours.</p>
            <Link href="/startups/new" className="bg-[#E84A00] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#cf4000] transition-colors">
              List Your Startup
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {startups.map((startup) => (
              <Link href={`/startups/${startup.id}`} key={startup.id} className="bg-white border border-[#E5E7EB] rounded-xl p-6 hover:border-[#E84A00] transition-all group">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[#FFF0E8] flex items-center justify-center text-[#E84A00] font-black text-lg">
                    {startup.name.charAt(0)}
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${stageColors[startup.stage]}`}>
                    {startup.stage.charAt(0) + startup.stage.slice(1).toLowerCase()}
                  </span>
                </div>
                <h3 className="text-lg font-black mb-1 group-hover:text-[#E84A00] transition-colors">{startup.name}</h3>
                <p className="text-sm text-[#4B5563] mb-3">{startup.tagline}</p>
                {startup.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {startup.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="bg-[#F3F4F6] text-[#4B5563] text-xs px-2 py-0.5 rounded-full">{tag}</span>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#F3F4F6]">
                  <span className="text-xs text-[#9CA3AF]">{startup.user.name}</span>
                  {startup.city && <span className="text-xs text-[#9CA3AF]">📍 {startup.city}</span>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}