'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import PixelButton from '@/components/ui/PixelButton'

export default function SignupClient() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const supabase = createClient()

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) { setError('Password must be at least 8 characters'); return }
    setLoading(true)
    setError(null)

    const { error: err } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${location.origin}/tickets` },
    })

    if (err) { setError(err.message); setLoading(false) }
    else      { setDone(true); setLoading(false) }
  }

  if (done) {
    return (
      <div className="pixel-card p-10 w-full max-w-md text-center">
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className="mx-auto mb-4" aria-hidden="true">
          <path d="M8 18L15 25L28 11" stroke="var(--accent-emerald)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="18" cy="18" r="15" stroke="var(--accent-emerald)" strokeWidth="1.5" />
        </svg>
        <h2 className="eyebrow text-[var(--accent-emerald)] mb-3">Account Created</h2>
        <p className="font-body text-sm text-[var(--text-muted)]">
          Check your email <strong className="text-[var(--text-primary)]">{email}</strong> for the confirmation link.
        </p>
      </div>
    )
  }

  return (
    <div className="pixel-card p-8 md:p-10 w-full max-w-md">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="eyebrow-line" />
          <span className="eyebrow">
            <span className="eyebrow-dot" style={{ background: 'var(--accent-purple)' }} />
            New Account
          </span>
          <span className="eyebrow-line" />
        </div>
        <h1 className="section-heading" style={{ fontSize: 'clamp(1.4rem, 1rem + 2vw, 2rem)' }}>
          Create Account
        </h1>
      </div>

      <form onSubmit={handleSignup} className="space-y-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="eyebrow text-[var(--text-muted)]">Email</label>
          <input
            id="email"
            type="email"
            className="pixel-input"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="eyebrow text-[var(--text-muted)]">Password</label>
          <input
            id="password"
            type="password"
            className="pixel-input"
            placeholder="Min. 8 characters"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>

        {error && (
          <p className="font-body text-xs text-[var(--accent-rose)] bg-[rgba(253,164,175,0.06)] border border-[rgba(253,164,175,0.2)] px-3 py-2 rounded-sm">
            {error}
          </p>
        )}

        <PixelButton
          type="submit"
          variant="primary"
          className="w-full justify-center"
          loading={loading}
        >
          Create Account
        </PixelButton>
      </form>

      <p className="mt-6 text-center font-body text-xs text-[var(--text-faint)]">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-[var(--accent-teal)] hover:underline">Log in</Link>
        {' '}/{' '}
        <Link href="/tickets" className="text-[var(--text-faint)] hover:text-[var(--text-secondary)] transition-colors">Continue as guest</Link>
      </p>
    </div>
  )
}
