'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { TICKET_TYPES } from '@/lib/tickets'
import type { TicketType, BookingFormData } from '@/types'
import PixelButton from '@/components/ui/PixelButton'
import TicketAvailabilityBar from '@/components/ui/TicketAvailabilityBar'
import { createClient } from '@/lib/supabase/client'
import { PAYMENT_CONFIG } from '@/lib/payment-config'

function FormField({
  label, id, error, ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; id: string; error?: string }) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label htmlFor={id} className="eyebrow text-[var(--text-muted)] text-left">
        {label}
      </label>
      <input id={id} className="pixel-input" {...props} />
      {error && <p className="font-body text-xs text-[var(--accent-rose)] text-left">{error}</p>}
    </div>
  )
}

function TicketCard({
  ticket,
  selected,
  onSelect,
}: {
  ticket: TicketType
  selected: boolean
  onSelect: () => void
}) {
  return (
    <article
      className={`ticket-card tier-${ticket.tier} rounded-none cursor-pointer p-6 md:p-8 transition-all duration-300 ${selected ? 'selected' : ''}`}
      onClick={onSelect}
      aria-pressed={selected}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onSelect()}
    >
      {/* Top accent stripe */}
      <div className="tier-stripe" style={{ background: ticket.color }} />

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <span
            className="pixel-badge mb-3 inline-block"
            style={{ color: ticket.color, borderColor: `color-mix(in srgb, ${ticket.color} 40%, transparent)` }}
          >
            {ticket.badgeLabel}
          </span>
          <h3
            className="font-body text-sm font-medium tracking-wide uppercase"
            style={{ color: ticket.color }}
          >
            {ticket.name}
          </h3>
        </div>

        {/* Selected indicator */}
        <div
          className="w-6 h-6 border flex items-center justify-center flex-shrink-0 mt-1 transition-all duration-300 rounded-sm"
          style={{
            borderColor: selected ? ticket.color : 'var(--border-default)',
            background: selected ? `color-mix(in srgb, ${ticket.color} 12%, transparent)` : 'transparent',
          }}
        >
          {selected && (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2 6L5 9L10 3" stroke={ticket.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
      </div>

      {/* Price */}
      <div className="mb-4">
        <span
          className="font-display font-semibold"
          style={{
            fontSize: 'clamp(2rem, 1.5rem + 2vw, 3rem)',
            color: ticket.color,
          }}
        >
          {ticket.priceDisplay}
        </span>
        <span className="font-body text-xs text-[var(--text-faint)] ml-2">per person</span>
      </div>

      <p className="font-body text-sm text-[var(--text-muted)] mb-6 leading-relaxed">
        {ticket.description}
      </p>

      {/* Perks */}
      <ul className="space-y-2 mb-8">
        {ticket.perks.map(perk => (
          <li key={perk} className="flex items-start gap-2">
            <svg
              className="mt-1 flex-shrink-0"
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              aria-hidden="true"
            >
              <path d="M1 5H9" stroke={ticket.color} strokeWidth="1" strokeLinecap="round" />
              <path d="M5 1L9 5L5 9" stroke={ticket.color} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-body text-sm text-[var(--text-secondary)]">{perk}</span>
          </li>
        ))}
      </ul>

      {/* Availability */}
      <TicketAvailabilityBar
        available={ticket.available}
        total={ticket.total}
        color={ticket.color}
      />
    </article>
  )
}

export default function TicketsPageClient() {
  const router = useRouter()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)

  const [form, setForm] = useState<BookingFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    quantity: 1,
    ticketTypeId: '',
    guestCheckout: true,
  })

  const [errors, setErrors] = useState<Partial<BookingFormData>>({})
  const [loading, setLoading] = useState(false)
  const [showQRCode, setShowQRCode] = useState(false)
  const [bookingCode, setBookingCode] = useState('')

  useEffect(() => {
    const prefillFromSession = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const fullName = user.user_metadata?.name || ''
          const nameParts = fullName.split(' ')
          const firstName = nameParts[0] || ''
          const lastName = nameParts.slice(1).join(' ') || ''
          setForm(f => ({
            ...f,
            firstName: firstName || '',
            lastName: lastName,
            email: user.email || '',
            phone: user.user_metadata?.phone || '',
            guestCheckout: false,
          }))
        }
      } catch (err) {
        console.error('Session prefill error:', err)
      }
    }
    prefillFromSession()
  }, [])

  const selected = TICKET_TYPES.find(t => t.id === selectedId)
  const total = selected ? (selected.price / 100) * quantity : 0

  function update(field: keyof BookingFormData, value: string) {
    setForm(f => ({ ...f, [field]: value }))
    setErrors(e => ({ ...e, [field]: undefined }))
  }

  function validate(): boolean {
    const errs: Partial<Record<keyof BookingFormData, string>> = {}
    if (!form.firstName.trim()) errs.firstName = 'Required'
    if (!form.lastName.trim()) errs.lastName = 'Required'
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = 'Valid email required'
    if (!form.phone.match(/^\+?[0-9]{10,13}$/)) errs.phone = 'Valid phone required'
    setErrors(errs as Partial<BookingFormData>)
    return Object.keys(errs).length === 0
  }

  async function handlePayment() {
    if (!selected || !validate()) return
    setLoading(true)

    try {
      const bookingRes = await fetch('/api/book-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketTypeId: selected.id,
          quantity: quantity,
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          amount: selected.price * quantity,
        }),
      })

      const bookingResult = await bookingRes.json()
      if (!bookingRes.ok || !bookingResult.success) {
        throw new Error(bookingResult.error ?? 'Booking creation failed')
      }

      setBookingCode(bookingResult.data.bookingCode)
      setShowQRCode(true)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Booking failed. Please try again.'
      console.error('Booking error:', err)
      alert(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  function handlePaymentComplete() {
    if (bookingCode) {
      router.push(`/confirmation?code=${bookingCode}`)
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page header */}
      <div className="text-center mb-14">
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="eyebrow-line" />
          <span className="eyebrow">
            <span className="eyebrow-dot" />
            Step 1 of 3 — Get Ticket
          </span>
          <span className="eyebrow-line" />
        </div>
        <h1 className="section-heading gradient-text-coldplay mb-3">
          Concert Ticket
        </h1>
        <p className="font-body text-[var(--text-muted)] max-w-xl mx-auto text-sm">
          Single ticket price for the Coldplay Minecraft concert.
          Includes full concert access and a digital commemorative collectible.
        </p>
      </div>

      {/* Ticket grid */}
      <div className="flex justify-center mb-10">
        <div className="w-full max-w-md">
          {TICKET_TYPES.map(ticket => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              selected={selectedId === ticket.id}
              onSelect={() => setSelectedId(ticket.id)}
            />
          ))}
        </div>
      </div>

      {/* Quantity + checkout bar */}
      {selected && (
        <div
          className="pixel-card p-6 md:p-8 animate-slide-up"
          style={{ borderColor: `color-mix(in srgb, ${selected.color} 40%, transparent)` }}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            {/* Quantity */}
            <div className="flex flex-col gap-3">
              <label className="eyebrow text-[var(--text-muted)]">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <button
                  className="pixel-btn pixel-btn-secondary w-10 h-10 flex items-center justify-center text-lg"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="font-display text-xl text-[var(--text-primary)] w-8 text-center">
                  {quantity}
                </span>
                <button
                  className="pixel-btn pixel-btn-secondary w-10 h-10 flex items-center justify-center text-lg"
                  onClick={() => setQuantity(q => Math.min(10, q + 1))}
                  aria-label="Increase quantity"
                >
                  +
                </button>
                <span className="font-body text-xs text-[var(--text-faint)] ml-2">max 10</span>
              </div>
            </div>

            {/* Summary */}
            <div className="flex flex-col items-start md:items-end gap-1">
              <span className="eyebrow text-[var(--text-faint)]">
                Total
              </span>
              <span
                className="font-display font-semibold"
                style={{
                  fontSize: 'clamp(1.5rem, 1rem + 2vw, 2.5rem)',
                  color: selected.color,
                }}
              >
                ₹{total.toLocaleString('en-IN')}
              </span>
              <span className="font-body text-xs text-[var(--text-faint)]">
                {quantity} x {selected.priceDisplay} ({selected.name})
              </span>
            </div>

          </div>

          {/* Form details section */}
          <div className="mt-8 pt-8 border-t border-[var(--border-subtle)]">
            <h3 className="eyebrow text-[var(--text-secondary)] mb-6 text-left" style={{ color: selected.color }}>
              Passenger Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
              <FormField
                label="First Name"
                id="firstName"
                type="text"
                placeholder="Chris"
                value={form.firstName}
                onChange={e => update('firstName', e.target.value)}
                error={errors.firstName}
              />
              <FormField
                label="Last Name"
                id="lastName"
                type="text"
                placeholder="Martin"
                value={form.lastName}
                onChange={e => update('lastName', e.target.value)}
                error={errors.lastName}
              />
              <FormField
                label="Email Address"
                id="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => update('email', e.target.value)}
                error={errors.email}
              />
              <FormField
                label="Phone Number"
                id="phone"
                type="tel"
                placeholder="+91 98765 43210"
                value={form.phone}
                onChange={e => update('phone', e.target.value)}
                error={errors.phone}
              />
            </div>
            
            <div className="flex justify-end">
              <PixelButton
                size="lg"
                loading={loading}
                onClick={handlePayment}
                style={{
                  borderColor: `color-mix(in srgb, ${selected.color} 50%, transparent)`,
                  boxShadow: `0 0 24px color-mix(in srgb, ${selected.color} 18%, transparent)`,
                }}
              >
                {loading ? 'Processing...' : 'Buy Tickets'}
              </PixelButton>
            </div>
          </div>
        </div>
      )}

      {!selected && (
        <p className="text-center eyebrow text-[var(--text-faint)] mt-6">
          Select a ticket tier above to continue
        </p>
      )}

      {/* QR Code Modal Overlay */}
      {showQRCode && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg p-8 max-w-md w-full space-y-6 text-center shadow-2xl">
            <div>
              <h2 className="section-heading gradient-text-coldplay mb-2">Payment</h2>
              <p className="font-body text-sm text-[var(--text-secondary)]">Scan this QR code to complete your booking</p>
            </div>

            <div className="bg-white p-6 rounded-lg flex items-center justify-center mx-auto w-fit">
              <div className="relative w-56 h-56">
                <Image
                  src={PAYMENT_CONFIG.qrCodeImagePath}
                  alt="Payment QR Code"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            <div className="bg-[var(--bg-subtle)] border border-[var(--border-subtle)] rounded p-4">
              <p className="font-body text-xs text-[var(--text-muted)] mb-1">Booking Reference</p>
              <p className="font-display text-lg font-mono font-bold text-[var(--accent-teal)]">{bookingCode}</p>
            </div>

            <div className="text-left bg-[var(--bg-subtle)] p-4 rounded-md">
              <p className="font-body text-sm font-semibold text-[var(--text-primary)] mb-2">Instructions:</p>
              <ul className="font-body text-sm text-[var(--text-secondary)] space-y-1 list-disc list-inside">
                {PAYMENT_CONFIG.instructions.map((inst, i) => (
                  <li key={i}>{inst}</li>
                ))}
              </ul>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  setShowQRCode(false)
                }}
                className="flex-1 px-4 py-2 border border-[var(--border-default)] rounded font-body text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] transition-colors"
              >
                Cancel
              </button>
              <PixelButton
                onClick={handlePaymentComplete}
                className="flex-1 justify-center"
                size="sm"
              >
                I have paid
              </PixelButton>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
