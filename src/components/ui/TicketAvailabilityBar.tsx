interface Props {
  available: number
  total: number
  color?: string
}

export default function TicketAvailabilityBar({ available, total, color = 'var(--accent-teal)' }: Props) {
  const pct = Math.max(0, Math.min(100, (available / total) * 100))
  const sold = total - available
  const isLow = pct < 20

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="eyebrow text-[var(--text-faint)]">
          Availability
        </span>
        <span
          className="eyebrow"
          style={{ color: isLow ? 'var(--accent-rose)' : color }}
        >
          {available > 0 ? `${available} left` : 'SOLD OUT'}
        </span>
      </div>

      <div className="pixel-progress w-full">
        <div
          className="pixel-progress-bar"
          style={{
            width: `${pct}%`,
            background: isLow
              ? `linear-gradient(90deg, rgba(253, 164, 175, 0.5), var(--accent-rose))`
              : `linear-gradient(90deg, var(--accent-purple), ${color})`,
          }}
        />
      </div>

      <p className="font-body text-xs text-[var(--text-faint)]">
        {sold} of {total} sold
      </p>
    </div>
  )
}
