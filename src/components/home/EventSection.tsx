import PixelCard from '@/components/ui/PixelCard'
import { Music, Blocks, Sparkles, Gamepad2, Users, Trophy } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface Feature {
  icon: LucideIcon
  title: string
  desc: string
  accent: string
}

const FEATURES: Feature[] = [
  {
    icon: Music,
    title: 'Live Performance',
    desc: 'Experience the greatest hits live in a custom-built Minecraft concert arena with stunning visuals and immersive sound.',
    accent: 'var(--accent-teal)',
  },
  {
    icon: Blocks,
    title: 'Minecraft World',
    desc: 'Explore an immersive world built by 200+ Minecraft architects over 18 months. Every block tells a story.',
    accent: 'var(--accent-emerald)',
  },
  {
    icon: Sparkles,
    title: 'Light Show',
    desc: 'Real-time synchronized light effects, fireworks, and particle explosions matching every beat.',
    accent: 'var(--accent-beige)',
  },
  {
    icon: Gamepad2,
    title: 'Interactive Zones',
    desc: 'Pre-show exploration zones. Solve puzzles, find hidden easter eggs, unlock exclusive content.',
    accent: 'var(--accent-purple)',
  },
  {
    icon: Users,
    title: 'Band Intros',
    desc: 'Get up close and personal with the band in exclusive pre-show sessions.',
    accent: 'var(--accent-teal)',
  },
  {
    icon: Trophy,
    title: 'Collectibles',
    desc: 'Exclusive in-game drops, digital collectibles, and limited-edition Minecraft skins for all attendees.',
    accent: 'var(--accent-beige)',
  },
]

export default function EventSection() {
  return (
    <section
      id="event"
      className="relative z-10 py-[var(--space-section)] px-4"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="eyebrow-line" />
            <span className="eyebrow">
              <span className="eyebrow-dot" />
              The Experience
            </span>
            <span className="eyebrow-line" />
          </div>
          <h2 className="section-heading gradient-text-primary mb-4">
            More Than a Concert
          </h2>
          <p className="font-body text-[var(--text-muted)] max-w-xl mx-auto text-base leading-relaxed">
            Two worlds collide in an unprecedented event. Where chart-topping
            anthems meet the infinite creativity of Minecraft.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => {
            const Icon = f.icon
            return (
              <PixelCard key={f.title} glow="none" className="group">
                <div className="flex flex-col gap-4">
                  <div
                    className="feature-icon"
                    style={{ borderColor: `color-mix(in srgb, ${f.accent} 30%, transparent)` }}
                  >
                    <Icon
                      style={{ color: f.accent }}
                      strokeWidth={1.5}
                      size={22}
                    />
                  </div>
                  <h3
                    className="font-body text-sm font-medium tracking-wide uppercase"
                    style={{ color: f.accent }}
                  >
                    {f.title}
                  </h3>
                  <p className="font-body text-sm text-[var(--text-muted)] leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </PixelCard>
            )
          })}
        </div>

        {/* Stats bar */}
        <div
          className="mt-16 grid grid-cols-2 md:grid-cols-2 gap-px"
          style={{ background: 'var(--border-subtle)' }}
        >
          {[
            { value: '1',      label: 'Night Only' },
            { value: '\u221E',  label: 'Memories' },
          ].map(stat => (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center py-10 gap-2"
              style={{ background: 'var(--bg-card)' }}
            >
              <span
                className="font-display"
                style={{
                  fontSize: 'clamp(1.5rem, 1rem + 2vw, 2.5rem)',
                  color: 'var(--accent-teal)',
                  fontWeight: 500,
                }}
              >
                {stat.value}
              </span>
              <span className="eyebrow text-[var(--text-faint)]">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
