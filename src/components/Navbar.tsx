'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SignOutButton } from '@clerk/nextjs'
import { useState } from 'react'

export default function Navbar({
  userName,
  showAuth = false,
}: {
  userName?: string
  showAuth?: boolean
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <nav style={{
      background: '#fff',
      borderBottom: '1px solid #E5E7EB',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 6%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
        {/* Logo */}
        <Link
          href={userName ? '/dashboard' : '/'}
          style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}
        >
          <div style={{
            width: 30, height: 30,
            borderRadius: '50%',
            background: '#E84A00',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 900, fontSize: 15,
          }}>F</div>
          <span style={{ fontSize: 17, fontWeight: 900, letterSpacing: -0.5, color: '#111' }}>
            Foundo<span style={{ color: '#E84A00' }}>.in</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="nav-desktop">
          <Link
            href="/startups"
            style={{
              fontSize: 13, fontWeight: 600, textDecoration: 'none',
              color: pathname === '/startups' ? '#E84A00' : '#4B5563',
              letterSpacing: 0.2,
            }}
          >
            Browse
          </Link>
          {userName && (
            <Link
              href="/connections"
              style={{
                fontSize: 13, fontWeight: 600, textDecoration: 'none',
                color: pathname === '/connections' ? '#E84A00' : '#4B5563',
                letterSpacing: 0.2,
              }}
            >
              Connections
            </Link>
          )}
          {userName ? (
            <>
              <Link
                href="/dashboard"
                style={{ fontSize: 13, fontWeight: 600, color: '#4B5563', textDecoration: 'none' }}
              >
                {userName}
              </Link>
              <SignOutButton>
                <button style={{
                  fontSize: 13, fontWeight: 600, color: '#9CA3AF',
                  background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                }}>
                  Sign out
                </button>
              </SignOutButton>
            </>
          ) : showAuth ? (
            <>
              <Link
                href="/sign-in"
                style={{ fontSize: 13, fontWeight: 600, color: '#4B5563', textDecoration: 'none' }}
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                style={{
                  fontSize: 13, fontWeight: 700, color: '#fff',
                  background: '#E84A00', padding: '8px 20px',
                  borderRadius: 6, textDecoration: 'none',
                  letterSpacing: 0.2,
                }}
              >
                Get Access
              </Link>
            </>
          ) : null}
        </div>

        {/* Mobile hamburger */}
        <button
          className="nav-mobile-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, display: 'none' }}
        >
          <div style={{ width: 20, height: 1.5, background: '#111', marginBottom: 5, transition: 'all 0.2s', transform: menuOpen ? 'rotate(45deg) translateY(6.5px)' : 'none' }} />
          <div style={{ width: 20, height: 1.5, background: '#111', marginBottom: 5, transition: 'all 0.2s', opacity: menuOpen ? 0 : 1 }} />
          <div style={{ width: 20, height: 1.5, background: '#111', transition: 'all 0.2s', transform: menuOpen ? 'rotate(-45deg) translateY(-6.5px)' : 'none' }} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          borderTop: '1px solid #E5E7EB',
          padding: '16px 6%',
          display: 'flex', flexDirection: 'column', gap: 4,
          background: '#fff',
        }}>
          <Link href="/startups" style={{ fontSize: 14, color: '#4B5563', textDecoration: 'none', padding: '10px 0', borderBottom: '1px solid #F3F4F6' }} onClick={() => setMenuOpen(false)}>Browse Startups</Link>
          {userName && <Link href="/connections" style={{ fontSize: 14, color: '#4B5563', textDecoration: 'none', padding: '10px 0', borderBottom: '1px solid #F3F4F6' }} onClick={() => setMenuOpen(false)}>Connections</Link>}
          {userName ? (
            <>
              <Link href="/dashboard" style={{ fontSize: 14, color: '#4B5563', textDecoration: 'none', padding: '10px 0', borderBottom: '1px solid #F3F4F6' }} onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <SignOutButton>
                <button style={{ fontSize: 14, color: '#9CA3AF', background: 'none', border: 'none', textAlign: 'left', padding: '10px 0', cursor: 'pointer' }}>Sign out</button>
              </SignOutButton>
            </>
          ) : (
            <>
              <Link href="/sign-in" style={{ fontSize: 14, color: '#4B5563', textDecoration: 'none', padding: '10px 0', borderBottom: '1px solid #F3F4F6' }} onClick={() => setMenuOpen(false)}>Sign in</Link>
              <Link href="/sign-up" style={{ fontSize: 14, fontWeight: 700, color: '#fff', background: '#E84A00', textDecoration: 'none', padding: '12px 0', textAlign: 'center', borderRadius: 6, marginTop: 8 }} onClick={() => setMenuOpen(false)}>Get Early Access</Link>
            </>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 767px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-btn { display: block !important; }
        }
      `}</style>
    </nav>
  )
}