'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { Press_Start_2P } from 'next/font/google'
import { ImageTrail } from '@/components/ui/image-trail'
import PixelButton from '@/components/ui/PixelButton'
import CountdownTimer from '@/components/ui/CountdownTimer'

const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
})


export default function HeroSection() {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

  const TRAIL_IMAGES = [
    '/images/grp1.jpg',
    '/images/grp2.jpg',
    '/images/grp3.jpg',
  ]

  useEffect(() => {
    const heading = headingRef.current
    if (!heading) return
    const onScroll = () => {
      const y = window.scrollY
      heading.style.transform = `translateY(${y * 0.08}px)`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Interactive Image Trail Backdrop */}
      <div className="absolute inset-0 z-0 opacity-40">
        <ImageTrail containerRef={sectionRef}>
          {TRAIL_IMAGES.map((url, idx) => (
            <div
              key={idx}
              className="relative overflow-hidden w-[40vw] h-[30vw] sm:w-[25vw] sm:h-[18vw] md:w-64 md:h-48 rounded-[4px]"
              style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)' }}
            >
              <Image 
                src={url}
                alt={`Concert preview trailing image ${idx}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </div>
          ))}
        </ImageTrail>
      </div>

      {/* Minecraft character elements — flanking the hero text */}

      {/* Top-left: floating island */}
      <div
        className="absolute hidden lg:block z-30 animate-float-gentle pointer-events-none"
        style={{ bottom: '20%', left: '65%', transform: 'translateX(calc(-100% - 80px))', animationDelay: '0s', opacity: 0.8, mixBlendMode: 'multiply' }}
        aria-hidden="true"
      >
        <Image
          src="/images/image1.png"
          alt=""
          width={200}
          height={200}
          className="drop-shadow-[0_12px_28px_rgba(0,0,0,0.8)]"
          placeholder="empty"
        />
      </div>

      {/* Bottom-left: grass block */}
      <div
        className="absolute hidden lg:block z-30 animate-float-gentle pointer-events-none"
        style={{ bottom: '25%', left: '74%', transform: 'translateX(calc(-100% - 70px))', animationDelay: '1.8s', opacity: 0.8, mixBlendMode: 'multiply' }}
        aria-hidden="true"
      >
        <Image
          src="/images/image2.png"
          alt=""
          width={160}
          height={160}
          className="drop-shadow-[0_12px_28px_rgba(0,0,0,0.8)]"
          placeholder="empty"
        />
      </div>

      {/* Top-right: Steve */}
      <div
        className="absolute hidden lg:block z-30 animate-float-gentle pointer-events-none"
        style={{ bottom: '20%', right: '67%', transform: 'translateX(calc(100% + 80px))', animationDelay: '0.9s', opacity: 0.8, mixBlendMode: 'multiply' }}
        aria-hidden="true"
      >
        <Image
          src="/images/image3.png"
          alt=""
          width={180}
          height={180}
          className="drop-shadow-[0_12px_28px_rgba(0,0,0,0.8)]"
          placeholder="empty"
        />
      </div>

      {/* Bottom-right: characters group */}
      <div
        className="absolute hidden lg:block z-30 animate-float-gentle pointer-events-none"
        style={{ bottom: '25%', right: '74%', transform: 'translateX(calc(100% + 70px))', animationDelay: '2.4s', opacity: 0.8, mixBlendMode: 'multiply' }}
        aria-hidden="true"
      >
        <Image
          src="/images/image4.png"
          alt=""
          width={210}
          height={210}
          className="drop-shadow-[0_12px_28px_rgba(0,0,0,0.8)]"
          placeholder="empty"
        />
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto pt-24">
        <h1
          id="hero-heading"
          ref={headingRef}
          className="section-heading animate-slide-up"
          style={{
            fontSize: 'clamp(2.75rem, 1.5rem + 7vw, 7rem)',
            lineHeight: 1.02,
            letterSpacing: '-0.03em',
          }}
        >
          <span className="block gradient-text-coldplay">Experience</span>
          <span className="block section-heading-italic text-secondary mt-2" style={{ fontSize: '0.55em' }}>
            a head full of dreams
          </span>
          <span className="block font-body text-[var(--text-faint)] lowercase tracking-widest text-[0.45em] mt-8 mb-2">
            inside
          </span>
          <span 
            className={`block ${pressStart2P.className} text-white`} 
            style={{ 
              fontSize: '0.85em',
              textShadow: '0 4px 12px rgba(255,255,255,0.25), 0 2px 4px rgba(0,0,0,0.8)'
            }}
          >
            MINECRAFT
          </span>
        </h1>

        <p
          className="font-body text-secondary mt-10 max-w-xl mx-auto leading-relaxed animate-fade-in"
          style={{ fontSize: 'clamp(1rem, 0.95rem + 0.3vw, 1.15rem)', animationDelay: '0.3s', animationFillMode: 'both' }}
        >
          The first concert performed inside a world of blocks. Coldplay&apos;s greatest hits, rebuilt
          inside Minecraft&apos;s most breathtaking landscapes. One night. One dimension.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 animate-fade-in" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
          <Link href="/tickets">
            <PixelButton size="lg" variant="primary">
              Reserve a seat
            </PixelButton>
          </Link>
          <Link href="/#event">
            <PixelButton variant="secondary" size="lg">
              Explore the show
            </PixelButton>
          </Link>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-50">
        <span className="eyebrow text-faint">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-[var(--accent-teal)] to-transparent opacity-60" />
      </div>
    </section>
  )
}
