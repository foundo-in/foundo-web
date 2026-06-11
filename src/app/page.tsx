import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-[#1A1A1A] font-sans">
      {/* NAV */}
      <nav className="border-b border-[#E5E7EB] px-[6%] sticky top-0 bg-white z-50">
        <div className="max-w-[1080px] mx-auto flex items-center justify-between h-16 gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#E84A00] flex items-center justify-center text-white font-black text-lg">F</div>
            <span className="text-xl font-black tracking-tight">Foundo<span className="text-[#E84A00]">.in</span></span>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-[#9CA3AF]">
            <span>✉</span>
            <a href="mailto:contact@foundo.in" className="text-[#E84A00] font-semibold hover:underline">contact@foundo.in</a>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#4B5563] cursor-pointer hover:text-[#1A1A1A]">Solutions</span>
            <span className="text-sm text-[#4B5563] cursor-pointer hover:text-[#1A1A1A]">Who It's For</span>
            <Link href="/sign-up" className="bg-[#E84A00] text-white px-5 py-2 rounded-md text-sm font-bold hover:bg-[#cf4000] transition-colors">
              Get Access
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <div className="max-w-[1080px] mx-auto px-[6%] pt-24 pb-20">
        <div className="text-xs font-semibold text-[#E84A00] tracking-widest uppercase mb-6">India's Startup Connection Platform · 2026</div>
        <h1 className="text-6xl md:text-7xl font-black leading-[1.05] tracking-[-2px] mb-6">
          Every Big Dream<br />Needs <em className="not-italic text-[#E84A00]">the Right</em><br />People.
        </h1>
        <p className="text-lg text-[#4B5563] max-w-[500px] leading-relaxed mb-9">
          Connecting founders, investors, students, and builders — in one place. Built for India.
        </p>
        <div className="flex gap-3 flex-wrap mb-6">
          <Link href="/sign-up" className="bg-[#E84A00] text-white px-7 py-3 rounded-lg text-base font-bold hover:bg-[#cf4000] transition-colors">
            Join Early Access
          </Link>
          <button className="border border-[#D1D5DB] px-6 py-3 rounded-lg text-base font-semibold hover:border-[#9CA3AF] transition-colors">
            Find your role →
          </button>
        </div>
        <p className="text-sm text-[#9CA3AF]">No payment required · Free early access</p>

        {/* METRICS */}
        <div className="flex flex-col md:flex-row border-t border-l border-[#E5E7EB] mt-12">
          {[
            { val: '5Cr+', desc: 'College students with no startup ecosystem access' },
            { val: '90%', desc: 'Founders say finding co-founders is #1 challenge' },
            { val: '₹2–20L', desc: 'Idle mid-class investment with no trusted channel' },
          ].map((m) => (
            <div key={m.val} className="flex-1 p-6 border-r border-b border-[#E5E7EB]">
              <div className="text-3xl font-black tracking-tight text-[#E84A00]">{m.val}</div>
              <div className="text-sm text-[#4B5563] mt-1 leading-snug">{m.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* PROBLEM */}
      <section className="bg-[#FAFAFA] border-y border-[#E5E7EB] px-[6%] py-20">
        <div className="max-w-[1080px] mx-auto">
          <div className="text-xs font-bold text-[#E84A00] tracking-[2px] uppercase mb-2 flex items-center gap-2">The Problem <span className="w-8 h-px bg-[#E84A00] inline-block" /></div>
          <h2 className="text-4xl font-black tracking-tight mb-12">The talent exists.<br />The money exists.<br />The gap is connection.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#E5E7EB] border border-[#E5E7EB]">
            {[
              { n: '01', title: 'Students stuck alone', desc: 'College students with innovative ideas have zero access to mentors, funds, or co-builders.' },
              { n: '02', title: 'Investors with idle money', desc: 'Mid-level investors want to back early ideas but don\'t know where to find credible founders.' },
              { n: '03', title: 'Founders can\'t find each other', desc: 'A developer in Jaipur and a marketer in Pune are building the same thing — separately.' },
            ].map((p) => (
              <div key={p.n} className="bg-white p-8">
                <div className="text-5xl font-black text-[#F3F4F6] leading-none mb-4">{p.n}</div>
                <h3 className="text-base font-bold mb-2">{p.title}</h3>
                <p className="text-sm text-[#4B5563] leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUTIONS */}
      <section className="px-[6%] py-20">
        <div className="max-w-[1080px] mx-auto">
          <div className="text-xs font-bold text-[#E84A00] tracking-[2px] uppercase mb-2 flex items-center gap-2">The Solution <span className="w-8 h-px bg-[#E84A00] inline-block" /></div>
          <h2 className="text-4xl font-black tracking-tight mb-3">India's First Startup<br />Connection Platform.</h2>
          <p className="text-base text-[#4B5563] max-w-[480px] leading-relaxed mb-12">One platform built for real startup connections — every person who wants to build something in India.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { tag: 'Founders', title: 'Startup Profiles', desc: 'List your idea, stage, and what you need. Go live in under 5 minutes.', cta: 'Get listed →' },
              { tag: 'Investors', title: 'Investor Matching', desc: 'Browse real startups. No agents. No gatekeepers. Direct connect.', cta: 'Start investing →' },
              { tag: 'Builders', title: 'Collab Requests', desc: 'Find co-builders across India to share skills, resources, and market access.', cta: 'Find your team →' },
              { tag: 'Students', title: 'Idea Validation', desc: 'Get real community feedback before spending a single rupee.', cta: 'Validate idea →' },
            ].map((s) => (
              <Link href="/sign-up" key={s.tag} className="border-[1.5px] border-[#E5E7EB] rounded-xl p-6 hover:border-[#E84A00] hover:bg-[#FFF9F7] transition-all cursor-pointer group">
                <div className="inline-block bg-[#FFF0E8] text-[#E84A00] text-xs font-bold px-2.5 py-1 rounded mb-4 tracking-wide uppercase">{s.tag}</div>
                <h3 className="text-base font-bold mb-2">{s.title}</h3>
                <p className="text-sm text-[#4B5563] leading-relaxed">{s.desc}</p>
                <div className="text-[#E84A00] text-sm font-semibold mt-4">{s.cta}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* WHO */}
      <section className="bg-[#FAFAFA] border-y border-[#E5E7EB] px-[6%] py-20">
        <div className="max-w-[1080px] mx-auto">
          <div className="text-xs font-bold text-[#E84A00] tracking-[2px] uppercase mb-2 flex items-center gap-2">Who It's For <span className="w-8 h-px bg-[#E84A00] inline-block" /></div>
          <h2 className="text-4xl font-black tracking-tight mb-3">Tell us who you are.</h2>
          <p className="text-base text-[#4B5563] max-w-[480px] leading-relaxed mb-12">We'll personalise your experience and match you with the right people from day one.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { role: 'For Students & Builders', title: 'Build something real', desc: 'Have an idea but no network? Find mentors, co-founders, and early feedback.', btn: "I'm a Student / Builder" },
              { role: 'For Investors', title: 'Back the right idea', desc: '₹2L–20L ready to invest? Discover credible founders before everyone else.', btn: "I'm an Investor" },
              { role: 'For Founders', title: 'Find the right people', desc: 'Need a co-founder, collaborator, or first investor? They\'re here.', btn: "I'm a Founder" },
            ].map((w) => (
              <div key={w.role} className="border-[1.5px] border-[#E5E7EB] rounded-xl p-8 hover:border-[#E84A00] transition-all">
                <div className="text-xs font-bold text-[#4B5563] tracking-widest uppercase mb-3">{w.role}</div>
                <h3 className="text-xl font-extrabold mb-2">{w.title}</h3>
                <p className="text-sm text-[#4B5563] leading-relaxed mb-6">{w.desc}</p>
                <Link href="/sign-up" className="block w-full bg-[#E84A00] text-white text-center py-3 rounded-lg text-sm font-bold hover:bg-[#cf4000] transition-colors">{w.btn}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUOTES */}
      <div className="bg-[#E84A00] px-[6%] py-16">
        <div className="max-w-[1080px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { q: "I've been looking for a co-founder for 8 months. Every platform I tried was useless for this.", by: "Startup founder, Bengaluru" },
            { q: "I want to invest in real ideas. I just don't know who to trust or where to go.", by: "IT professional, Lucknow" },
            { q: "200 students in our college working on projects — none know how to take it forward.", by: "College professor, Hyderabad" },
          ].map((q) => (
            <div key={q.by}>
              <blockquote className="text-white text-base leading-relaxed italic opacity-95 mb-3">"{q.q}"</blockquote>
              <cite className="text-white text-sm opacity-70 not-italic">— {q.by}</cite>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <section className="px-[6%] py-24 text-center">
        <h2 className="text-5xl font-black tracking-tight mb-3">Join <span className="text-[#E84A00]">Foundo.in</span><br />Early Access</h2>
        <p className="text-lg text-[#4B5563] mb-9">No payment. No long form. Just tell us you're in.<br />Be among the first 1000 members.</p>
        <Link href="/sign-up" className="inline-block bg-[#E84A00] text-white px-9 py-4 rounded-lg text-base font-bold hover:bg-[#cf4000] transition-colors">
          I'm In — Join the List
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#111] px-[6%] pt-12 pb-8">
        <div className="max-w-[1080px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-9 h-9 rounded-full bg-[#E84A00] flex items-center justify-center text-white font-black text-lg">F</div>
                <span className="text-xl font-black tracking-tight text-white">Foundo<span className="text-[#E84A00]">.in</span></span>
              </div>
              <p className="text-sm text-[#9CA3AF] leading-relaxed max-w-[280px] mb-5">India doesn't need more noise — it needs better connections.</p>
              <a href="mailto:contact@foundo.in" className="text-sm text-[#9CA3AF] hover:text-[#E84A00] transition-colors">contact@foundo.in</a>
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#6B7280] uppercase tracking-widest mb-4">Platform</h4>
              {['Startup Profiles', 'Investor Matching', 'Collab Requests', 'Idea Validation'].map(l => (
                <Link key={l} href="/sign-up" className="block text-sm text-[#9CA3AF] hover:text-white transition-colors mb-2.5">{l}</Link>
              ))}
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#6B7280] uppercase tracking-widest mb-4">Join As</h4>
              {['Student / Builder', 'Investor', 'Founder', 'Get Early Access'].map(l => (
                <Link key={l} href="/sign-up" className="block text-sm text-[#9CA3AF] hover:text-white transition-colors mb-2.5">{l}</Link>
              ))}
            </div>
          </div>
          <div className="border-t border-[#222] pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <span className="text-sm text-[#4B5563]">© 2026 <span className="text-[#E84A00] font-bold">Foundo.in</span> · All rights reserved</span>
            <span className="text-sm text-[#4B5563]">Made with purpose · Built for India 🇮🇳</span>
          </div>
        </div>
      </footer>
    </main>
  )
}