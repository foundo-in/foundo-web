import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import StartupsClient from '@/components/StartupsClient'

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

        <StartupsClient startups={startups} stageColors={stageColors} />
      </div>
    </main>
  )
}