import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function ConnectionsPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  })
  if (!user) redirect('/onboarding')

  const received = await prisma.connection.findMany({
    where: { toUserId: user.id },
    include: {
      fromUser: { select: { name: true, email: true, city: true, role: true } },
      startup: { select: { name: true, id: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  const sent = await prisma.connection.findMany({
    where: { fromUserId: user.id },
    include: {
      startup: { select: { name: true, id: true } },
      toUser: { select: { name: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    ACCEPTED: 'bg-green-100 text-green-700',
    DECLINED: 'bg-red-100 text-red-700',
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      <nav className="bg-white border-b border-[#E5E7EB] px-[6%] h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#E84A00] flex items-center justify-center text-white font-black text-base">F</div>
          <span className="text-lg font-black tracking-tight">Foundo<span className="text-[#E84A00]">.in</span></span>
        </div>
        <Link href="/dashboard" className="text-sm text-[#4B5563] hover:text-[#1A1A1A]">← Dashboard</Link>
      </nav>

      <div className="max-w-[720px] mx-auto px-[6%] py-12">
        <h1 className="text-3xl font-black tracking-tight mb-2">Connections</h1>
        <p className="text-[#4B5563] mb-10">People who want to connect with you, and requests you've sent.</p>

        {/* RECEIVED */}
        <div className="mb-12">
          <h2 className="text-xs font-bold text-[#9CA3AF] uppercase tracking-widest mb-4">
            Received · {received.length}
          </h2>
          {received.length === 0 ? (
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-8 text-center text-[#9CA3AF] text-sm">
              No requests yet. Share your startup to get noticed.
            </div>
          ) : (
            <div className="space-y-4">
              {received.map(c => (
                <div key={c.id} className="bg-white border border-[#E5E7EB] rounded-xl p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-bold text-[#1A1A1A]">{c.fromUser.name}</div>
                      <div className="text-sm text-[#9CA3AF]">
                        {c.fromUser.role} {c.fromUser.city ? `· ${c.fromUser.city}` : ''}
                      </div>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusColors[c.status]}`}>
                      {c.status.charAt(0) + c.status.slice(1).toLowerCase()}
                    </span>
                  </div>
                  {c.message && (
                    <p className="text-sm text-[#4B5563] bg-[#FAFAFA] rounded-lg p-3 mb-4 leading-relaxed">
                      "{c.message}"
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-[#9CA3AF]">
                      Re: <Link href={`/startups/${c.startup.id}`} className="text-[#E84A00] font-semibold hover:underline">{c.startup.name}</Link>
                    </div>
                    
                    <a href={`mailto:${c.fromUser.email}`} className="bg-[#E84A00] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#cf4000] transition-colors">Reply via Email</a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SENT */}
        <div>
          <h2 className="text-xs font-bold text-[#9CA3AF] uppercase tracking-widest mb-4">
            Sent · {sent.length}
          </h2>
          {sent.length === 0 ? (
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-8 text-center text-[#9CA3AF] text-sm">
              You haven't reached out to anyone yet. <Link href="/startups" className="text-[#E84A00] font-semibold">Browse startups</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {sent.map(c => (
                <div key={c.id} className="bg-white border border-[#E5E7EB] rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-[#1A1A1A]">{c.startup.name}</div>
                      <div className="text-sm text-[#9CA3AF]">by {c.toUser.name}</div>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusColors[c.status]}`}>
                      {c.status.charAt(0) + c.status.slice(1).toLowerCase()}
                    </span>
                  </div>
                  {c.message && (
                    <p className="text-sm text-[#4B5563] bg-[#FAFAFA] rounded-lg p-3 mt-3 leading-relaxed">
                      "{c.message}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}