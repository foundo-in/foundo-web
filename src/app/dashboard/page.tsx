import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { SignOutButton } from '@clerk/nextjs'
import Link from 'next/link'

export default async function DashboardPage() {
  const user = await currentUser()
  if (!user) redirect('/sign-in')

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    include: {
      startups: { orderBy: { createdAt: 'desc' } }
    }
  })

  if (!dbUser) redirect('/onboarding')

  const roleActions: Record<string, { label: string; href: string; desc: string }[]> = {
    FOUNDER: [
      { label: 'List Your Startup', href: '/startups/new', desc: 'Create your startup profile' },
      { label: 'Browse Startups', href: '/startups', desc: 'See what others are building' },
      { label: 'Find Investors', href: '/startups?filter=investor', desc: 'Coming soon' },
    ],
    INVESTOR: [
      { label: 'Browse Startups', href: '/startups', desc: 'Discover early-stage founders' },
      { label: 'View Profiles', href: '/startups', desc: 'Find credible founders' },
      { label: 'My Interests', href: '/connections', desc: 'Coming soon' },
    ],
    STUDENT: [
      { label: 'Browse Startups', href: '/startups', desc: 'See what people are building' },
      { label: 'List Your Idea', href: '/startups/new', desc: 'Get community feedback' },
      { label: 'Find a Mentor', href: '/startups', desc: 'Coming soon' },
    ],
    BUILDER: [
      { label: 'Browse Startups', href: '/startups', desc: 'Find projects to join' },
      { label: 'Post Your Skills', href: '/startups/new', desc: 'List what you can do' },
      { label: 'My Collabs', href: '/connections', desc: 'Coming soon' },
    ],
    GENERAL: [
      { label: 'Browse Startups', href: '/startups', desc: 'Explore the platform' },
      { label: 'Complete Onboarding', href: '/onboarding', desc: 'Tell us who you are' },
    ],
  }

  const actions = roleActions[dbUser.role]

  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      {/* TOPBAR */}
      <nav className="bg-white border-b border-[#E5E7EB] px-[6%] h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#E84A00] flex items-center justify-center text-white font-black text-base">F</div>
          <span className="text-lg font-black tracking-tight">Foundo<span className="text-[#E84A00]">.in</span></span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/startups" className="text-sm text-[#4B5563] hover:text-[#1A1A1A] transition-colors">Browse</Link>
          <Link href="/connections" className="text-sm text-[#4B5563] hover:text-[#1A1A1A] transition-colors">Connections</Link>
          <span className="text-sm text-[#4B5563]">{dbUser.name || user.firstName}</span>
          <SignOutButton>
            <button className="text-sm text-[#4B5563] hover:text-[#1A1A1A] transition-colors cursor-pointer">Sign out</button>
          </SignOutButton>
        </div>
      </nav>

      <div className="max-w-[1080px] mx-auto px-[6%] py-12">
        {/* HEADER */}
        <div className="mb-10">
          <div className="inline-block bg-[#FFF0E8] text-[#E84A00] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-3">
            {dbUser.role}
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-2">
            Welcome back{dbUser.name ? `, ${dbUser.name.split(' ')[0]}` : ''}!
          </h1>
          <p className="text-[#4B5563] text-base">Here's what you can do today.</p>
        </div>

        {/* QUICK ACTIONS */}
        <div className="mb-10">
          <h2 className="text-xs font-bold text-[#9CA3AF] uppercase tracking-widest mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {actions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="bg-white border-[1.5px] border-[#E5E7EB] rounded-xl p-6 hover:border-[#E84A00] transition-all group"
              >
                <div className="text-base font-bold mb-1 group-hover:text-[#E84A00] transition-colors">{action.label}</div>
                <div className="text-sm text-[#9CA3AF]">{action.desc}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* MY STARTUPS */}
        {dbUser.startups.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xs font-bold text-[#9CA3AF] uppercase tracking-widest mb-4">My Startups</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {dbUser.startups.map(startup => (
                <Link
                  key={startup.id}
                  href={`/startups/${startup.id}`}
                  className="bg-white border border-[#E5E7EB] rounded-xl p-6 hover:border-[#E84A00] transition-all"
                >
                  <div className="font-black text-lg mb-1">{startup.name}</div>
                  <div className="text-sm text-[#4B5563] mb-3">{startup.tagline}</div>
                  <div className="inline-block bg-[#FFF0E8] text-[#E84A00] text-xs font-bold px-2.5 py-1 rounded-full">
                    {startup.stage.charAt(0) + startup.stage.slice(1).toLowerCase()}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* PROFILE */}
        <div className="bg-white border-[1.5px] border-[#E5E7EB] rounded-xl p-8">
          <h2 className="text-xs font-bold text-[#9CA3AF] uppercase tracking-widest mb-6">Your Profile</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { label: 'Name', value: dbUser.name },
              { label: 'Email', value: dbUser.email },
              { label: 'City', value: dbUser.city || 'Not set' },
              { label: 'Role', value: dbUser.role },
            ].map((field) => (
              <div key={field.label}>
                <div className="text-xs font-bold text-[#9CA3AF] uppercase tracking-widest mb-1">{field.label}</div>
                <div className="text-base font-semibold text-[#1A1A1A]">{field.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}