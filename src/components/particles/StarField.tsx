'use client'

import { useEffect, useRef } from 'react'

interface Star {
  x: number
  y: number
  r: number
  baseOpacity: number
  color: string
  twinkleOffset: number
  twinkleSpeed: number
}

interface Drift {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  life: number
  maxLife: number
  shape: 'square' | 'dot'
}

const STAR_COLORS = ['#f5f0e1', '#d4c5a0', '#5eead4', '#a78bfa']
const DRIFT_COLORS = ['#5eead4', '#a78bfa', '#d4c5a0']

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef<number>(0)
  const starsRef = useRef<Star[]>([])
  const driftsRef = useRef<Drift[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initStars()
    }

    function initStars() {
      const count = Math.floor((canvas!.width * canvas!.height) / 9000)
      starsRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * canvas!.width,
        y: Math.random() * canvas!.height,
        r: Math.random() * 0.9 + 0.2,
        baseOpacity: Math.random() * 0.35 + 0.1,
        color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
        twinkleOffset: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.4 + 0.2,
      }))
    }

    function spawnDrift() {
      if (Math.random() > 0.012) return
      const isSquare = Math.random() > 0.55
      driftsRef.current.push({
        x: Math.random() * canvas!.width,
        y: canvas!.height + 8,
        vx: (Math.random() - 0.5) * 0.18,
        vy: -(Math.random() * 0.5 + 0.18),
        size: isSquare ? Math.random() * 2 + 1.2 : Math.random() * 1.6 + 0.6,
        color: DRIFT_COLORS[Math.floor(Math.random() * DRIFT_COLORS.length)],
        life: 0,
        maxLife: Math.random() * 480 + 320,
        shape: isSquare ? 'square' : 'dot',
      })
    }

    let t = 0
    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)
      t += reduce ? 0.002 : 0.006

      starsRef.current.forEach(star => {
        const twinkle = Math.sin(t * star.twinkleSpeed + star.twinkleOffset) * 0.25 + 0.75
        ctx!.beginPath()
        ctx!.arc(star.x, star.y, star.r, 0, Math.PI * 2)
        ctx!.fillStyle = star.color
        ctx!.globalAlpha = star.baseOpacity * twinkle
        ctx!.fill()
      })

      if (!reduce) spawnDrift()
      driftsRef.current = driftsRef.current.filter(d => d.life < d.maxLife && d.y > -20)
      driftsRef.current.forEach(d => {
        d.x += d.vx
        d.y += d.vy
        d.life++
        const fade = Math.min(d.life / 60, 1) * Math.max(0, 1 - d.life / d.maxLife)
        ctx!.globalAlpha = fade * 0.32
        ctx!.fillStyle = d.color
        if (d.shape === 'square') {
          ctx!.fillRect(d.x - d.size, d.y - d.size, d.size * 2, d.size * 2)
        } else {
          ctx!.beginPath()
          ctx!.arc(d.x, d.y, d.size, 0, Math.PI * 2)
          ctx!.fill()
        }
      })

      ctx!.globalAlpha = 1
      frameRef.current = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    draw()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(frameRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  )
}
