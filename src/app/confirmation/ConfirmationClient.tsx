'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import PixelButton from '@/components/ui/PixelButton'

export default function ConfirmationClient() {
  const params = useSearchParams()
  const code = params.get('code') ?? 'CLD-MC-XXXXXX'

  return (
    <div className="max-w-2xl mx-auto text-center">
      {/* Success badge */}
      <div className="inline-flex flex-col items-center gap-6 mb-12">
        {/* Animated checkmark block */}
        <div
          className="w-24 h-24 border flex items-center justify-center animate-float-gentle"
          style={{
            borderColor: 'var(--accent-emerald)',
            background: 'linear-gradient(135deg, rgba(110, 231, 183, 0.10), rgba(110, 231, 183, 0.04))',
            boxShadow: 'var(--glow-soft-emerald)',
          }}
        >
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
            <path d="M8 18L15 25L28 11" stroke="var(--accent-emerald)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div className="flex items-center justify-center gap-3">
          <span className="eyebrow-line" />
          <span className="eyebrow text-[var(--accent-emerald)]">
            <span className="eyebrow-dot" style={{ background: 'var(--accent-emerald)' }} />
            Booking Confirmed
          </span>
          <span className="eyebrow-line" />
        </div>
      </div>

      <h1
        className="font-display gradient-text-mc mb-4"
        style={{ fontSize: 'clamp(1.5rem, 1rem + 3vw, 3rem)', lineHeight: 1.2 }}
      >
        You&apos;re in the<br />Minecraft
      </h1>

      <p className="font-body text-[var(--text-muted)] mb-10 max-w-md mx-auto leading-relaxed">
        Your ticket is confirmed. A confirmation email has been sent to your inbox
        with access instructions and your Minecraft server details.
      </p>

      {/* Booking code */}
      <div
        className="pixel-card p-8 mb-10 inline-block"
        style={{
          borderColor: 'color-mix(in srgb, var(--accent-emerald) 30%, transparent)',
          boxShadow: 'var(--glow-soft-emerald)',
        }}
      >
        <p className="eyebrow text-[var(--text-faint)] mb-3">
          Your Booking Code
        </p>
        <p
          className="font-mono"
          style={{
            fontSize: 'clamp(1rem, 0.8rem + 1.5vw, 1.6rem)',
            color: 'var(--accent-emerald)',
            letterSpacing: '0.1em',
          }}
        >
          {code}
        </p>
        <p className="font-body text-xs text-[var(--text-faint)] mt-3">
          Save this code. You&apos;ll need it for entry.
        </p>
      </div>

      {/* What's next */}
      <div className="pixel-card p-6 text-left mb-10">
        <h2 className="eyebrow text-[var(--accent-teal)] mb-5">
          <span className="eyebrow-dot" />
          What Happens Next
        </h2>
        <ol className="space-y-4">
          {[
            { n: '01', text: 'Check your email for the confirmation and server access details.' },
            { n: '02', text: 'Download Minecraft Java Edition 1.20+ (if you haven\'t already).' },
            { n: '03', text: 'On the day of the event, use the server IP from your email.' },
            { n: '04', text: 'Enter the gate with your booking code and enjoy the show.' },
          ].map(step => (
            <li key={step.n} className="flex items-start gap-4">
              <span
                className="font-mono text-sm w-8 flex-shrink-0 pt-0.5"
                style={{ color: 'var(--accent-teal)' }}
              >
                {step.n}
              </span>
              <span className="font-body text-sm text-[var(--text-secondary)] leading-relaxed">{step.text}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link href="/">
          <PixelButton variant="secondary" size="md">Back to Home</PixelButton>
        </Link>
        <Link href="/tickets">
          <PixelButton size="md">Buy More Tickets</PixelButton>
        </Link>
      </div>

      {/* Share nudge */}
      <p className="mt-10 font-body text-xs text-[var(--text-faint)]">
        Share with friends — Tell them to grab their tickets before they sell out
      </p>
    </div>
  )
}
