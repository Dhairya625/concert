import { type HTMLAttributes } from 'react'
import { clsx } from 'clsx'

interface PixelCardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: 'teal' | 'purple' | 'beige' | 'emerald' | 'none'
  hoverable?: boolean
}

const glowMap = {
  teal: 'hover:border-[var(--accent-teal)]',
  purple: 'hover:border-[var(--accent-purple)]',
  beige: 'hover:border-[var(--accent-beige)]',
  emerald: 'hover:border-[var(--accent-emerald)]',
  none: '',
}

export default function PixelCard({
  glow = 'teal',
  hoverable = true,
  className,
  children,
  ...props
}: PixelCardProps) {
  return (
    <div
      className={clsx(
        'pixel-card p-6',
        hoverable && glowMap[glow],
        hoverable && 'cursor-pointer transition-all duration-300',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
