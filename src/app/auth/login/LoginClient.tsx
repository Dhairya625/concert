'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import PixelButton from '@/components/ui/PixelButton'

export default function LoginClient() {
  const router = useRouter()
  const params = useSearchParams()
  const redirectTo = params.get('redirectTo') ?? '/tickets'

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [magicSent, setMagicSent] = useState(false)

  const supabase = createClient()

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault()
    if (!email) { setError('Enter your email first'); return }
    setLoading(true)
    setError(null)

    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}${redirectTo}` },
    })

    if (err) { setError(err.message); setLoading(false) }
    else      { setMagicSent(true); setLoading(false) }
  }

  if (magicSent) {
    return (
      <div className="pixel-card p-10 w-full max-w-md text-center">
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className="mx-auto mb-4" aria-hidden="true">
          <rect x="4" y="8" width="28" height="20" rx="2" stroke="var(--accent-teal)" strokeWidth="1.5" />
          <path d="M4 10L18 22L32 10" stroke="var(--accent-teal)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <h2 className="eyebrow text-[var(--accent-teal)] mb-3">Check Your Email</h2>
        <p className="font-body text-sm text-[var(--text-muted)]">Magic link sent to <strong className="text-[var(--text-primary)]">{email}</strong>. Click it to log in.</p>
      </div>
    )
  }

  return (
    <div className="pixel-card p-8 md:p-10 w-full max-w-md">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="eyebrow-line" />
          <span className="eyebrow">
            <span className="eyebrow-dot" />
            Account
          </span>
          <span className="eyebrow-line" />
        </div>
        <h1 className="section-heading" style={{ fontSize: 'clamp(1.4rem, 1rem + 2vw, 2rem)' }}>
          Enter the World
        </h1>
      </div>

      <form onSubmit={handleMagicLink} className="space-y-5">
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

        {error && (
          <p className="font-body text-xs text-[var(--accent-rose)] bg-[rgba(253,164,175,0.06)] border border-[rgba(253,164,175,0.2)] px-3 py-2 rounded-sm">
            {error}
          </p>
        )}

        <PixelButton type="submit" variant="primary" className="w-full justify-center" loading={loading}>
          Send Magic Link
        </PixelButton>
      </form>

      <p className="mt-6 text-center font-body text-xs text-[var(--text-faint)]">
        <Link href="/tickets" className="text-[var(--text-faint)] hover:text-[var(--text-secondary)] transition-colors">Continue as guest</Link>
      </p>
    </div>
  )
}

