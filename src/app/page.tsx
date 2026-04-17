import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import StarField from '@/components/particles/StarField'
import HeroSection from '@/components/home/HeroSection'
import EventSection from '@/components/home/EventSection'
import Link from 'next/link'
import PixelButton from '@/components/ui/PixelButton'

export default function HomePage() {
  return (
    <>
      <StarField />
      <Navbar />

      <main className="relative z-10 flex-1">
        <HeroSection />
        <EventSection />

        {/* CTA Banner */}
        <section className="relative z-10 py-20 px-4">
          <div
            className="max-w-4xl mx-auto pixel-card p-12 text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.08), rgba(94, 234, 212, 0.05))',
              borderColor: 'var(--border-strong)',
            }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="eyebrow-line" />
              <span className="eyebrow">
                <span className="eyebrow-dot" />
                Limited Seats
              </span>
              <span className="eyebrow-line" />
            </div>
            <h2
              className="font-display gradient-text-primary mb-6"
              style={{ fontSize: 'clamp(1.5rem, 1rem + 2.5vw, 2.8rem)' }}
            >
              Don&apos;t miss your block
            </h2>
            {/* <p className="font-body text-[var(--text-muted)] mb-8 max-w-lg mx-auto">
              750 tickets total. When they&apos;re gone, they&apos;re gone forever.
              VIP spots are already 60% sold.
            </p> */}
            <Link href="/tickets">
              <PixelButton size="lg">
                Secure Your Ticket
              </PixelButton>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
