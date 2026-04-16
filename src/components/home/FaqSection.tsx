'use client'

import { useState } from 'react'

interface Faq {
  q: string
  a: string
}

const FAQS: Faq[] = [
  {
    q: 'How do I access the concert?',
    a: 'After purchasing your ticket, you will receive an email with a unique Minecraft server IP and access code. A live stream link is also included with every ticket tier.',
  },
  {
    q: 'Which version of Minecraft is required?',
    a: 'Java Edition 1.20 or newer is required for server access. Bedrock Edition players can join via the live stream or a Bedrock-compatible IP included in your confirmation email.',
  },
  {
    q: 'Is there a refund policy?',
    a: 'Refunds are available up to seven days before the event (September 13, 2025). After that, tickets are non-refundable but transferable. Reach support@coldplaymc.com for help.',
  },
  {
    q: 'What is included in the Golden Beacon tier?',
    a: 'The Golden Beacon includes a private pre-show meet and greet with the world builders, custom in-game skin creation, a post-concert private world tour, and a signed physical ticket.',
  },
  {
    q: 'Is there a minimum age?',
    a: 'No minimum age, but attendees under thirteen need parental consent. All content is family-friendly.',
  },
  {
    q: 'Will the concert be recorded?',
    a: 'A highlight reel is released seventy-two hours after the event. A full replay is available for thirty days to ticket holders only.',
  },
]

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className="flex-shrink-0 transition-transform duration-400"
      style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
      aria-hidden="true"
    >
      <path
        d="M3 5L7 9L11 5"
        stroke="var(--accent-teal)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section
      id="faq"
      className="relative z-10 py-[var(--space-section)] px-4"
    >
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="eyebrow-line" />
            <span className="eyebrow">
              <span className="eyebrow-dot" style={{ background: 'var(--accent-beige)' }} />
              Frequently Asked
            </span>
            <span className="eyebrow-line" />
          </div>
          <h2 className="section-heading">
            <span className="section-heading-italic text-secondary">Your</span>{' '}
            <span className="gradient-text-coldplay">questions</span>
          </h2>
        </div>

        <div className="divide-y divide-[var(--border-subtle)] border-y border-[var(--border-subtle)]">
          {FAQS.map((faq, i) => {
            const isOpen = open === i
            return (
              <div key={faq.q}>
                <button
                  className="w-full text-left py-6 flex items-center justify-between gap-6 group"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span
                    className={`font-display text-lg md:text-xl tracking-tight transition-colors duration-300 ${
                      isOpen ? 'text-primary' : 'text-secondary group-hover:text-primary'
                    }`}
                    style={{ letterSpacing: '-0.01em' }}
                  >
                    {faq.q}
                  </span>
                  <Chevron open={isOpen} />
                </button>

                <div
                  className="grid transition-all duration-400"
                  style={{
                    gridTemplateRows: isOpen ? '1fr' : '0fr',
                  }}
                >
                  <div className="overflow-hidden">
                    <p className="pb-6 font-body text-[var(--text-muted)] leading-relaxed max-w-2xl">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
