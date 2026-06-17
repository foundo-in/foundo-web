import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function Home() {
  return (
    <main style={{ background: '#fff', color: '#111', overflowX: 'hidden' }}>

      {/* NAV */}
      <Navbar userName="" showAuth />

      {/* ── HERO ──────────────────────────────────────── */}
      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '104px 6% 88px' }}>

        <div className="slide-up" style={{ fontSize: 11, fontWeight: 700, color: 'var(--brand)', letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: 32 }}>
          India · 2026 · Early Access
        </div>

        <h1
          className="slide-up anim-delay-1"
          style={{
            fontSize: 'clamp(44px, 7.5vw, 92px)',
            fontWeight: 900,
            lineHeight: 1.0,
            letterSpacing: '-0.04em',
            marginBottom: 32,
            maxWidth: 780,
            color: '#0D0D0D',
          }}
        >
          Every big dream<br />
          needs the right<br />
          <span style={{ color: 'var(--brand)' }}>people.</span>
        </h1>

        <p
          className="slide-up anim-delay-2"
          style={{
            fontSize: 19,
            color: 'var(--body)',
            maxWidth: 460,
            lineHeight: 1.7,
            marginBottom: 44,
            fontWeight: 400,
          }}
        >
          Foundo connects founders, investors, students, and builders — the people who make startups happen in India.
        </p>

        <div className="slide-up anim-delay-3" style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <Link
            href="/sign-up"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'var(--brand)',
              color: '#fff',
              padding: '15px 36px',
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 700,
              textDecoration: 'none',
              letterSpacing: '-0.2px',
              boxShadow: '0 2px 8px rgba(232,74,0,0.3)',
              transition: 'background 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease',
            }}
            className="hero-cta"
          >
            Join Free — Early Access
          </Link>
          <span style={{ fontSize: 13, color: 'var(--muted)' }}>No payment · No waitlist</span>
        </div>

        {/* STAT STRIP */}
        <div
          className="slide-up anim-delay-4"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 0,
            marginTop: 80,
            paddingTop: 48,
            borderTop: '1px solid var(--n200)',
          }}
        >
          {[
            { n: '5Cr+', l: 'college students with no startup ecosystem access' },
            { n: '90%',  l: 'founders say finding a co-founder is their #1 challenge' },
            { n: '₹5–50L', l: 'idle mid-class investment with no trusted channel' },
          ].map((s, i) => (
            <div
              key={s.n}
              style={{
                paddingRight: i < 2 ? '5%' : 0,
                paddingLeft: i > 0 ? '5%' : 0,
                borderLeft: i > 0 ? '1px solid var(--n200)' : 'none',
              }}
            >
              <div style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 900, letterSpacing: '-0.03em', color: '#0D0D0D', lineHeight: 1, marginBottom: 10 }}>
                {s.n}
              </div>
              <div style={{ fontSize: 14, color: 'var(--body)', lineHeight: 1.55 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── THE PROBLEM — dark editorial section ─────── */}
      <section style={{ background: '#0D0D0D', padding: '104px 6%' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--brand)', letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: 28 }}>
            The problem
          </div>
          <h2 style={{
            fontSize: 'clamp(30px, 4.5vw, 56px)',
            fontWeight: 900,
            letterSpacing: '-0.03em',
            color: '#fff',
            maxWidth: 600,
            lineHeight: 1.08,
            marginBottom: 72,
          }}>
            The talent exists.<br />The money exists.<br />
            <span style={{ color: 'var(--n600)' }}>The gap is connection.</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 1, background: '#1A1A1A', borderRadius: 12, overflow: 'hidden' }}>
            {[
              { who: 'Students, stuck alone',     pain: 'College students with innovative ideas have zero access to mentors, funds, or co-builders.' },
              { who: 'Investors, idle money',     pain: 'Mid-level investors want to back early ideas but don\'t know where to find credible founders.' },
              { who: 'Founders, can\'t find each other', pain: 'A developer in Jaipur and a marketer in Pune are building the same thing — separately.' },
            ].map(p => (
              <div key={p.who} style={{ background: '#0D0D0D', padding: '40px 36px' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--brand)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 20 }}>
                  {p.who}
                </div>
                <p style={{ fontSize: 17, color: '#9CA3AF', lineHeight: 1.75, fontWeight: 400 }}>{p.pain}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE SOLUTION ──────────────────────────────── */}
      <section style={{ padding: '104px 6%' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--brand)', letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: 28 }}>
            The solution
          </div>
          <h2 style={{
            fontSize: 'clamp(30px, 4vw, 52px)',
            fontWeight: 900,
            letterSpacing: '-0.03em',
            marginBottom: 20,
            lineHeight: 1.08,
            color: '#0D0D0D',
          }}>
            India's first startup<br />connection platform.
          </h2>
          <p style={{ fontSize: 17, color: 'var(--body)', maxWidth: 500, lineHeight: 1.7, marginBottom: 72, fontWeight: 400 }}>
            One platform built for real startup connections — for every person who wants to build something in India.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 16 }}>
            {[
              { tag: 'Founders',  title: 'Startup Profiles',   body: 'List your idea, stage, and what you need. Go live in under 5 minutes.' },
              { tag: 'Investors', title: 'Investor Matching',  body: 'Browse real startups. No agents. No gatekeepers. Direct connect.' },
              { tag: 'Builders',  title: 'Collab Requests',    body: 'Find co-builders across India to share skills, resources, and market access.' },
              { tag: 'Students',  title: 'Idea Validation',    body: 'Get real community feedback before spending a single rupee.' },
            ].map(f => (
              <div
                key={f.tag}
                style={{
                  border: '1px solid var(--n200)',
                  borderRadius: 14,
                  padding: '32px 28px',
                  background: '#fff',
                  transition: 'border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease',
                  boxShadow: 'var(--sh-xs)',
                }}
                className="feature-card"
              >
                <div style={{
                  display: 'inline-flex',
                  background: 'var(--brand-light)',
                  color: 'var(--brand)',
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '3px 10px',
                  borderRadius: 4,
                  letterSpacing: '1.2px',
                  textTransform: 'uppercase',
                  marginBottom: 20,
                }}>
                  {f.tag}
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 10, color: '#0D0D0D', letterSpacing: '-0.2px' }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: 14, color: 'var(--body)', lineHeight: 1.65 }}>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF — editorial dark ────────────── */}
      <section style={{ background: '#0D0D0D', padding: '88px 6%' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--brand)', letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: 56 }}>
            Real people, real gaps
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 40 }}>
            {[
              { q: 'I\'ve been looking for a co-founder for 8 months. Every platform I tried was useless for this.', by: 'Startup founder, Bengaluru' },
              { q: 'I want to invest in real ideas. I just don\'t know who to trust or where to go.', by: 'IT professional, Lucknow' },
              { q: '200 students in our college working on projects — none know how to take it forward.', by: 'College professor, Hyderabad' },
            ].map(q => (
              <div key={q.by} style={{ borderTop: '1px solid #2A2A2A', paddingTop: 28 }}>
                <blockquote style={{
                  fontSize: 16,
                  fontWeight: 400,
                  lineHeight: 1.75,
                  color: '#D1D5DB',
                  marginBottom: 16,
                  fontStyle: 'italic',
                }}>
                  "{q.q}"
                </blockquote>
                <cite style={{ fontSize: 12, color: 'var(--n500)', fontStyle: 'normal', fontWeight: 500, letterSpacing: '0.5px' }}>
                  — {q.by}
                </cite>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ───────────────────────────────── */}
      <section style={{ padding: '120px 6%', textAlign: 'center' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--brand)', letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: 24 }}>
            Free · Early Access · 2026
          </div>
          <h2 style={{
            fontSize: 'clamp(36px, 5.5vw, 72px)',
            fontWeight: 900,
            letterSpacing: '-0.04em',
            marginBottom: 20,
            lineHeight: 1.0,
            color: '#0D0D0D',
          }}>
            Your people are<br />already here.
          </h2>
          <p style={{ fontSize: 18, color: 'var(--body)', marginBottom: 48, lineHeight: 1.6, fontWeight: 400 }}>
            No payment. No long form. Just tell us you're in.<br />
            Be among the first 1,000 members on Foundo.in.
          </p>
          <Link
            href="/sign-up"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'var(--brand)',
              color: '#fff',
              padding: '17px 52px',
              borderRadius: 10,
              fontSize: 16,
              fontWeight: 700,
              textDecoration: 'none',
              letterSpacing: '-0.2px',
              boxShadow: '0 2px 12px rgba(232,74,0,0.25)',
              transition: 'background 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease',
            }}
            className="hero-cta"
          >
            I'm In — Join the List
          </Link>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────── */}
      <footer style={{ background: '#0D0D0D', padding: '52px 6% 36px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20, marginBottom: 36 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 15 }}>F</div>
              <span style={{ fontSize: 17, fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>
                Foundo<span style={{ color: 'var(--brand)' }}>.in</span>
              </span>
            </div>
            <div style={{ display: 'flex', gap: 28 }}>
              <Link href="/startups" className="footer-link">Browse Startups</Link>
              <Link href="/sign-up" className="footer-link">Join</Link>
              <a href="mailto:contact@foundo.in" className="footer-link">Contact</a>
            </div>
          </div>
          <div style={{ borderTop: '1px solid #1E1E1E', paddingTop: 24, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <span style={{ fontSize: 12, color: 'var(--n600)' }}>© 2026 Foundo.in · All rights reserved</span>
            <span style={{ fontSize: 12, color: 'var(--n600)' }}>Built for India 🇮🇳</span>
          </div>
        </div>
      </footer>

      <style>{`
        .hero-cta:hover {
          background: var(--brand-dark) !important;
          box-shadow: 0 4px 16px rgba(232,74,0,0.35) !important;
          transform: translateY(-1px);
        }
        .hero-cta:active { transform: translateY(0); }
        .feature-card:hover {
          border-color: var(--n300) !important;
          box-shadow: var(--sh-md) !important;
          transform: translateY(-2px);
        }
        .footer-link {
          font-size: 13px;
          color: var(--n600);
          text-decoration: none;
          transition: color 0.15s ease;
        }
        .footer-link:hover { color: var(--n300); }
      `}</style>
    </main>
  )
}