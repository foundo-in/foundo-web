'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SignOutButton } from '@clerk/nextjs'
import { useState, useEffect } from 'react'

export default function Navbar({
  userName,
  showAuth = false,
}: {
  userName?: string
  showAuth?: boolean
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false) }, [pathname])

  const navLink = (href: string, label: string) => {
    const active = pathname === href || pathname.startsWith(href + '/')
    return (
      <Link
        href={href}
        style={{
          fontSize: 14,
          fontWeight: active ? 600 : 500,
          textDecoration: 'none',
          color: active ? 'var(--ink)' : 'var(--n500)',
          padding: '4px 0',
          letterSpacing: '-0.1px',
          transition: 'color 0.15s ease',
          position: 'relative',
        }}
        className={active ? 'nav-link nav-link-active' : 'nav-link'}
      >
        {label}
      </Link>
    )
  }

  return (
    <>
      <nav
        suppressHydrationWarning
        className={scrolled ? 'site-nav site-nav--scrolled' : 'site-nav'}
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          height: 60,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div style={{
          maxWidth: 1080,
          margin: '0 auto',
          padding: '0 6%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          gap: 24,
        }}>
          {/* Logo */}
          <Link
            href={userName ? '/dashboard' : '/'}
            style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none', flexShrink: 0 }}
          >
            <div style={{
              width: 28, height: 28,
              borderRadius: '50%',
              background: 'var(--brand)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 900, fontSize: 14, letterSpacing: -0.5,
              flexShrink: 0,
            }}>F</div>
            <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: -0.5, color: 'var(--ink)' }}>
              Foundo<span style={{ color: 'var(--brand)' }}>.in</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 32, flex: 1 }} className="nav-desktop">
            <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
              {navLink('/startups', 'Browse')}
              {userName && navLink('/connections', 'Connections')}
            </div>

            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
              {userName ? (
                <>
                  <Link
                    href="/profile/edit"
                    className="btn btn-ghost btn-sm"
                    style={{ fontFamily: 'inherit', color: 'var(--n600)' }}
                  >
                    Edit Profile
                  </Link>
                  <Link
                    href="/dashboard"
                    className="nav-user-pill"
                    style={{
                      fontSize: 13, fontWeight: 600,
                      color: 'var(--n700)', textDecoration: 'none',
                      background: 'var(--n100)',
                      padding: '5px 12px 5px 7px',
                      borderRadius: 'var(--r-full)',
                      display: 'flex', alignItems: 'center', gap: 7,
                      border: '1px solid var(--n200)',
                      transition: 'background 0.15s ease, border-color 0.15s ease',
                    }}
                  >
                    <span style={{
                      width: 22, height: 22, borderRadius: '50%',
                      background: 'var(--brand)', color: '#fff',
                      fontSize: 10, fontWeight: 800,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      {userName.charAt(0).toUpperCase()}
                    </span>
                    {userName}
                  </Link>
                  <SignOutButton>
                    <button className="btn btn-ghost btn-sm" style={{ fontFamily: 'inherit' }}>
                      Sign out
                    </button>
                  </SignOutButton>
                </>
              ) : showAuth ? (
                <>
                  <Link href="/sign-in" className="btn btn-ghost btn-sm">
                    Sign in
                  </Link>
                  <Link href="/sign-up" className="btn btn-primary btn-sm">
                    Get Access
                  </Link>
                </>
              ) : null}
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            className="nav-mobile-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '6px',
              display: 'none',
              color: 'var(--n700)',
              borderRadius: 'var(--r-2)',
              transition: 'background 0.15s ease',
            }}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu — smooth slide-down */}
      <div
        className="mobile-menu-wrap"
        style={{
          overflow: 'hidden',
          maxHeight: menuOpen ? '400px' : '0',
          opacity: menuOpen ? 1 : 0,
          transition: 'max-height 0.3s cubic-bezier(0.16,1,0.3,1), opacity 0.2s ease',
          borderBottom: menuOpen ? '1px solid var(--n100)' : 'none',
          background: 'rgba(255,255,255,0.97)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          position: 'relative',
          zIndex: 99,
        }}
      >
        <div style={{ padding: '8px 6% 20px', display: 'flex', flexDirection: 'column' }}>
          <Link href="/startups" style={mobileLink} onClick={() => setMenuOpen(false)}>Browse Startups</Link>
          {userName && <Link href="/connections" style={mobileLink} onClick={() => setMenuOpen(false)}>Connections</Link>}
          {userName ? (
            <>
              <Link href="/dashboard" style={mobileLink} onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <Link href="/profile/edit" style={mobileLink} onClick={() => setMenuOpen(false)}>Edit Profile</Link>
              <SignOutButton>
                <button style={{ ...mobileLink, background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', color: 'var(--muted)', fontFamily: 'inherit', width: '100%', fontSize: 14 }}>
                  Sign out
                </button>
              </SignOutButton>
            </>
          ) : (
            <>
              <Link href="/sign-in" style={mobileLink} onClick={() => setMenuOpen(false)}>Sign in</Link>
              <Link
                href="/sign-up"
                onClick={() => setMenuOpen(false)}
                style={{
                  display: 'block', marginTop: 12,
                  background: 'var(--brand)', color: '#fff',
                  padding: '12px 16px', borderRadius: 'var(--r-3)',
                  fontSize: 14, fontWeight: 600,
                  textDecoration: 'none', textAlign: 'center',
                }}
              >
                Get Early Access
              </Link>
            </>
          )}
        </div>
      </div>

      <style>{`
        .site-nav {
          background: rgba(255,255,255,0.98);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(229,231,235,0.6);
          box-shadow: none;
          transition: background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
        }
        .site-nav--scrolled {
          background: rgba(255,255,255,0.88);
          border-bottom: 1px solid rgba(229,231,235,0.8);
          box-shadow: 0 1px 12px rgba(0,0,0,0.06);
        }
        @media (max-width: 767px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-btn { display: flex !important; align-items: center; justify-content: center; }
          .nav-mobile-btn:hover { background: var(--n100); }
        }
        .nav-link { display: inline-block; position: relative; }
        .nav-link:hover { color: var(--ink) !important; }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          height: 2px;
          background: var(--brand);
          border-radius: 2px;
          opacity: 0;
          transform: scaleX(0.5);
          transition: opacity 0.15s ease, transform 0.15s ease;
        }
        .nav-link-active::after {
          opacity: 1;
          transform: scaleX(1);
        }
        .nav-user-pill:hover { background: var(--n200) !important; border-color: var(--n300) !important; }
        @media (min-width: 768px) {
          .mobile-menu-wrap { display: none !important; }
        }
      `}</style>
    </>
  )
}

const mobileLink: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 500,
  color: 'var(--n700)',
  textDecoration: 'none',
  padding: '12px 0',
  borderBottom: '1px solid var(--n100)',
  display: 'block',
}