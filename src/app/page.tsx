import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function Home() {
  return (
    <main style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", background: '#fff', color: '#111', overflowX: 'hidden' }}>

      {/* NAV */}
      <Navbar userName="" showAuth />

      {/* HERO */}
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '96px 6% 80px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#E84A00', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 28 }}>
          India · 2026 · Early Access
        </div>
        <h1 style={{ fontSize: 'clamp(44px, 7vw, 88px)', fontWeight: 900, lineHeight: 1.02, letterSpacing: -3, marginBottom: 28, maxWidth: 760 }}>
          The right people<br />
          are out there.<br />
          <span style={{ color: '#E84A00' }}>Find them.</span>
        </h1>
        <p style={{ fontSize: 18, color: '#4B5563', maxWidth: 440, lineHeight: 1.7, marginBottom: 40 }}>
          Foundo connects founders, investors, students, and builders — the people who make startups happen in India.
        </p>
        <Link href="/sign-up" style={{ display: 'inline-block', background: '#E84A00', color: '#fff', padding: '14px 36px', borderRadius: 8, fontSize: 16, fontWeight: 700, textDecoration: 'none' }}>
          Join Free — Early Access
        </Link>
        <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 14 }}>No payment · No waitlist · Just show up</div>

        {/* STAT STRIP */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, borderTop: '1px solid #E5E7EB', borderLeft: '1px solid #E5E7EB', marginTop: 72 }}>
          {[
            { n: '5Cr+', l: 'students with no startup access' },
            { n: '90%', l: 'founders struggle to find co-founders' },
            { n: '₹20L', l: 'idle investment, no trusted outlet' },
          ].map(s => (
            <div key={s.n} style={{ borderRight: '1px solid #E5E7EB', borderBottom: '1px solid #E5E7EB', padding: '28px 24px' }}>
              <div style={{ fontSize: 34, fontWeight: 900, letterSpacing: -1, color: '#111' }}>{s.n}</div>
              <div style={{ fontSize: 13, color: '#6B7280', marginTop: 6, lineHeight: 1.5 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* THE GAP — full bleed dark section */}
      <div style={{ background: '#111', padding: '96px 6%', margin: '0' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#E84A00', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 24 }}>The problem</div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 900, letterSpacing: -1.5, color: '#fff', maxWidth: 640, lineHeight: 1.1, marginBottom: 64 }}>
            The talent exists.<br />The capital exists.<br />
            <span style={{ color: '#4B5563' }}>The connection doesn't.</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 1, background: '#222' }}>
            {[
              { who: 'The Student', pain: 'Has an idea. Has time. Has drive. Has no one to talk to about it.' },
              { who: 'The Investor', pain: 'Has ₹5–20L sitting idle. Wants to back something real. Doesn\'t know who to trust.' },
              { who: 'The Founder', pain: 'Building alone. Needs a co-founder, a first hire, or someone who just gets it.' },
            ].map(p => (
              <div key={p.who} style={{ background: '#111', padding: '36px 32px' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#E84A00', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>{p.who}</div>
                <p style={{ fontSize: 16, color: '#9CA3AF', lineHeight: 1.7 }}>{p.pain}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* WHAT FOUNDO DOES */}
      <div style={{ padding: '96px 6%', maxWidth: 1080, margin: '0 auto' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#E84A00', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 24 }}>What we do</div>
        <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, letterSpacing: -1.5, marginBottom: 16, lineHeight: 1.1 }}>
          One place.<br />Every person you need.
        </h2>
        <p style={{ fontSize: 16, color: '#4B5563', maxWidth: 480, lineHeight: 1.7, marginBottom: 64 }}>
          Post your startup. Browse investors. Find co-founders. Validate ideas. All in one platform built specifically for India's startup ecosystem.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          {[
            { tag: 'Founders', title: 'Startup Profiles', body: 'List your idea and what you need. Live in 5 minutes.' },
            { tag: 'Investors', title: 'Direct Access', body: 'No agents. Browse real founders. Connect directly.' },
            { tag: 'Builders', title: 'Collab Board', body: 'Find your team. Share skills. Build together.' },
            { tag: 'Students', title: 'Idea Validation', body: 'Real feedback before you spend a single rupee.' },
          ].map(f => (
            <div key={f.tag} style={{ border: '1.5px solid #E5E7EB', borderRadius: 12, padding: '28px 24px' }}>
              <div style={{ display: 'inline-block', background: '#FFF0E8', color: '#E84A00', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 4, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 16 }}>{f.tag}</div>
              <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.65 }}>{f.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* SOCIAL PROOF */}
      <div style={{ background: '#E84A00', padding: '72px 6%' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 40 }}>
          {[
            { q: '8 months looking for a co-founder. Every platform I tried was useless for this.', by: 'Founder, Bengaluru' },
            { q: 'I want to invest in real ideas. I just don\'t know who to trust or where to go.', by: 'IT professional, Lucknow' },
            { q: '200 students in our college working on projects. None know how to take it forward.', by: 'Professor, Hyderabad' },
          ].map(q => (
            <div key={q.by}>
              <blockquote style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.7, color: '#fff', marginBottom: 12, fontStyle: 'italic', opacity: 0.95 }}>"{q.q}"</blockquote>
              <cite style={{ fontSize: 12, color: '#fff', opacity: 0.6, fontStyle: 'normal' }}>— {q.by}</cite>
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM CTA */}
      <div style={{ padding: '112px 6%', textAlign: 'center' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#E84A00', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 20 }}>Free · Early Access · 2026</div>
        <h2 style={{ fontSize: 'clamp(32px, 5vw, 64px)', fontWeight: 900, letterSpacing: -2, marginBottom: 16, lineHeight: 1.05 }}>
          Your people are<br />already here.
        </h2>
        <p style={{ fontSize: 17, color: '#4B5563', marginBottom: 40 }}>Be among the first 1000 members on Foundo.in.</p>
        <Link href="/sign-up" style={{ display: 'inline-block', background: '#E84A00', color: '#fff', padding: '16px 48px', borderRadius: 8, fontSize: 17, fontWeight: 700, textDecoration: 'none' }}>
          Join Now — It's Free
        </Link>
      </div>

      {/* FOOTER */}
      <footer style={{ background: '#111', padding: '48px 6% 32px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#E84A00', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 16 }}>F</div>
              <span style={{ fontSize: 18, fontWeight: 900, color: '#fff', letterSpacing: -0.5 }}>Foundo<span style={{ color: '#E84A00' }}>.in</span></span>
            </div>
            <div style={{ display: 'flex', gap: 24 }}>
              <Link href="/startups" style={{ fontSize: 13, color: '#6B7280', textDecoration: 'none' }}>Browse Startups</Link>
              <Link href="/sign-up" style={{ fontSize: 13, color: '#6B7280', textDecoration: 'none' }}>Join</Link>
              <a href="mailto:contact@foundo.in" style={{ fontSize: 13, color: '#6B7280', textDecoration: 'none' }}>Contact</a>
            </div>
          </div>
          <div style={{ borderTop: '1px solid #222', paddingTop: 24, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <span style={{ fontSize: 12, color: '#4B5563' }}>© 2026 Foundo.in · All rights reserved</span>
            <span style={{ fontSize: 12, color: '#4B5563' }}>Built for India 🇮🇳</span>
          </div>
        </div>
      </footer>

    </main>
  )
}