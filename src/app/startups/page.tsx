import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import StartupsClient from '@/components/StartupsClient'
import Navbar from '@/components/Navbar'

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
      <Navbar showAuth />

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