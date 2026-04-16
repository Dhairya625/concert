'use client'

import { useEffect, useState } from 'react'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

// Concert date: September 20, 2025
const CONCERT_DATE = new Date('2025-09-20T20:00:00+05:30')

function getTimeLeft(): TimeLeft {
  const diff = CONCERT_DATE.getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }

  return {
    days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  if (!mounted) return null

  const units = [
    { label: 'DAYS',    value: timeLeft.days },
    { label: 'HOURS',   value: timeLeft.hours },
    { label: 'MINS',    value: timeLeft.minutes },
    { label: 'SECS',    value: timeLeft.seconds },
  ]

  return (
    <div className="flex items-end gap-4 md:gap-6" role="timer" aria-live="polite">
      {units.map(({ label, value }, i) => (
        <div key={label} className="flex items-end gap-1">
          <div className="flex flex-col items-center">
            <span className="countdown-digit">{pad(value)}</span>
            <span
              className="eyebrow text-[var(--text-faint)] mt-1"
              style={{ fontSize: '0.6rem' }}
              aria-hidden="true"
            >
              {label}
            </span>
          </div>
          {i < units.length - 1 && (
            <span
              className="countdown-digit mb-3 opacity-40"
              aria-hidden="true"
            >
              :
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
