'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import PixelButton from '@/components/ui/PixelButton'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
      } catch (err) {
        console.error('Auth check error:', err)
      }
    }
    checkAuth()
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Frosted glass bar */}
      <div
        className="border-b"
        style={{
          background: 'rgba(7, 8, 13, 0.96)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <nav
          className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group"
            aria-label="Concert x Minecraft — Home"
          >
            <div className="w-8 h-8 relative">
              {/* Minecraft-style logo block */}
              <div
                className="w-full h-full border flex items-center justify-center"
                style={{
                  borderColor: 'var(--accent-teal)',
                  background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.2), rgba(94, 234, 212, 0.15))',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M7 1L13 7L7 13L1 7L7 1Z" stroke="var(--accent-teal)" strokeWidth="1.2" />
                  <path d="M7 4L10 7L7 10L4 7L7 4Z" fill="var(--accent-teal)" opacity="0.5" />
                </svg>
              </div>
            </div>
            <span
              className="font-display text-lg tracking-tight text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors"
              style={{ letterSpacing: '-0.01em' }}
            >
              Concert <span className="text-[var(--accent-teal)] italic">×</span> Minecraft
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/#event" className="nav-link">Event</Link>
            <Link href="/tickets" className="nav-link">Tickets</Link>
            {user ? (
              <span className="nav-link cursor-default">
                {user.user_metadata?.name || user.email?.split('@')[0] || 'Account'}
              </span>
            ) : (
              <Link href="/auth/login" className="nav-link">Login</Link>
            )}
            <Link href="/tickets">
              <PixelButton size="sm">
                Get Tickets
              </PixelButton>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-[var(--accent-teal)] p-2"
            onClick={() => setOpen(o => !o)}
            aria-expanded={open}
            aria-label="Toggle menu"
          >
            <div className="space-y-1">
              <span className={`block w-5 h-0.5 bg-current transition-transform ${open ? 'rotate-45 translate-y-1.5' : ''}`} />
              <span className={`block w-5 h-0.5 bg-current transition-opacity ${open ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-0.5 bg-current transition-transform ${open ? '-rotate-45 -translate-y-1.5' : ''}`} />
            </div>
          </button>
        </nav>

        {/* Mobile menu */}
        {open && (
          <div
            className="md:hidden px-4 py-6 flex flex-col gap-4"
            style={{ borderTop: '1px solid var(--border-subtle)' }}
          >
            <Link href="/#event"  className="nav-link" onClick={() => setOpen(false)}>Event</Link>
            <Link href="/tickets" className="nav-link" onClick={() => setOpen(false)}>Tickets</Link>
            {user ? (
              <span className="nav-link cursor-default">
                {user.user_metadata?.name || user.email?.split('@')[0] || 'Account'}
              </span>
            ) : (
              <Link href="/auth/login" className="nav-link" onClick={() => setOpen(false)}>Login</Link>
            )}
            <Link href="/tickets" onClick={() => setOpen(false)}>
              <PixelButton size="sm" className="w-full justify-center">Get Tickets</PixelButton>
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
