import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { SignOutButton } from '@clerk/nextjs'

export default async function DashboardPage() {
  const user = await currentUser()
  if (!user) redirect('/sign-in')

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  })

  if (!dbUser) redirect('/onboarding')

  const roleConfig = {
    FOUNDER: {
      greeting: 'Welcome, Founder!',
      desc: 'Find co-founders, collaborators, and early investors.',
      actions: ['Create Startup Profile', 'Browse Investors', 'Find Co-founders'],
      color: '#E84A00',
    },
    INVESTOR: {
      greeting: 'Welcome, Investor!',
      desc: 'Discover and connect with credible early-stage founders.',
      actions: ['Browse Startups', 'View Founder Profiles', 'Express Interest'],
      color: '#0070F3',
    },
    STUDENT: {
      greeting: 'Welcome!',
      desc: 'Validate your idea and find mentors and co-builders.',
      actions: ['Post Your Idea', 'Find a Mentor', 'Browse Projects'],
      color: '#7C3AED',
    },
    BUILDER: {
      greeting: 'Welcome, Builder!',
      desc: 'Find exciting projects to collaborate on across India.',
      actions: ['Browse Collab Requests', 'Post Your Skills', 'Find a Team'],
      color: '#059669',
    },
    GENERAL: {
      greeting: 'Welcome!',
      desc: 'Tell us more about yourself to get started.',
      actions: ['Complete Profile'],
      color: '#E84A00',
    },
  }

  const config = roleConfig[dbUser.role]

  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      {/* TOPBAR */}
      <nav className="bg-white border-b border-[#E5E7EB] px-[6%] h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#E84A00] flex items-center justify-center text-white font-black text-base">F</div>
          <span className="text-lg font-black tracking-tight">Foundo<span className="text-[#E84A00]">.in</span></span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-[#4B5563]">{dbUser.name || user.firstName}</span>
          <SignOutButton>
            <button className="text-sm text-[#4B5563] hover:text-[#1A1A1A] transition-colors cursor-pointer">
              Sign out
            </button>
          </SignOutButton>
        </div>
      </nav>

      <div className="max-w-[1080px] mx-auto px-[6%] py-12">
        {/* HEADER */}
        <div className="mb-10">
          <div className="inline-block bg-[#FFF0E8] text-[#E84A00] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-3">
            {dbUser.role}
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-2">{config.greeting}</h1>
          <p className="text-[#4B5563] text-lg">{config.desc}</p>
        </div>

        {/* QUICK ACTIONS */}
        <div className="mb-10">
          <h2 className="text-xs font-bold text-[#9CA3AF] uppercase tracking-widest mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {config.actions.map((action) => (
              <button
                key={action}
                className="bg-white border-[1.5px] border-[#E5E7EB] rounded-xl p-6 text-left hover:border-[#E84A00] transition-all group"
              >
                <div className="text-base font-bold mb-1 group-hover:text-[#E84A00] transition-colors">{action}</div>
                <div className="text-sm text-[#9CA3AF]">Coming soon</div>
              </button>
            ))}
          </div>
        </div>

        {/* PROFILE COMPLETION */}
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