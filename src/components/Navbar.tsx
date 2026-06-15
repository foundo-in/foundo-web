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
    <nav className="bg-white border-b border-[#E5E7EB] px-[6%] sticky top-0 z-50">
      <div className="max-w-[1080px] mx-auto flex items-center justify-between h-16">
        <Link href={userName ? '/dashboard' : '/'} className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#E84A00] flex items-center justify-center text-white font-black text-base">F</div>
          <span className="text-lg font-black tracking-tight">Foundo<span className="text-[#E84A00]">.in</span></span>
        </Link>

        {/* DESKTOP */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/startups" className={`text-sm transition-colors ${pathname === '/startups' ? 'text-[#E84A00] font-semibold' : 'text-[#4B5563] hover:text-[#1A1A1A]'}`}>Browse</Link>
          {userName && (
            <Link href="/connections" className={`text-sm transition-colors ${pathname === '/connections' ? 'text-[#E84A00] font-semibold' : 'text-[#4B5563] hover:text-[#1A1A1A]'}`}>Connections</Link>
          )}
          {userName ? (
            <>
              <Link href="/dashboard" className="text-sm text-[#4B5563] hover:text-[#1A1A1A] transition-colors">{userName}</Link>
              <SignOutButton>
                <button className="text-sm text-[#4B5563] hover:text-[#1A1A1A] transition-colors cursor-pointer">Sign out</button>
              </SignOutButton>
            </>
          ) : showAuth ? (
            <>
              <Link href="/sign-in" className="text-sm text-[#4B5563] hover:text-[#1A1A1A]">Sign in</Link>
              <Link href="/sign-up" className="bg-[#E84A00] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#cf4000] transition-colors">Get Access</Link>
            </>
          ) : null}
        </div>

        {/* MOBILE HAMBURGER */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className={`block w-5 h-0.5 bg-[#1A1A1A] transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-0.5 bg-[#1A1A1A] transition-all ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-[#1A1A1A] transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden border-t border-[#E5E7EB] py-4 space-y-3">
          <Link href="/startups" className="block text-sm text-[#4B5563] py-2" onClick={() => setMenuOpen(false)}>Browse Startups</Link>
          {userName && (
            <Link href="/connections" className="block text-sm text-[#4B5563] py-2" onClick={() => setMenuOpen(false)}>Connections</Link>
          )}
          {userName ? (
            <>
              <Link href="/dashboard" className="block text-sm text-[#4B5563] py-2" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <SignOutButton>
                <button className="block text-sm text-[#4B5563] py-2 cursor-pointer">Sign out</button>
              </SignOutButton>
            </>
          ) : (
            <>
              <Link href="/sign-in" className="block text-sm text-[#4B5563] py-2" onClick={() => setMenuOpen(false)}>Sign in</Link>
              <Link href="/sign-up" className="block bg-[#E84A00] text-white px-4 py-2.5 rounded-lg text-sm font-bold text-center" onClick={() => setMenuOpen(false)}>Get Early Access</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}