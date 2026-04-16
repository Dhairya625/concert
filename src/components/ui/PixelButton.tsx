import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
}

const variantClass: Record<Variant, string> = {
  primary: 'pixel-btn pixel-btn-primary',
  secondary: 'pixel-btn pixel-btn-secondary',
  danger: 'pixel-btn pixel-btn-danger',
  ghost: 'pixel-btn border-transparent text-[var(--accent-teal)] hover:border-[var(--accent-teal)]',
}

const sizeClass: Record<Size, string> = {
  sm: 'text-[0.68rem] px-4 py-2.5 tracking-[0.16em]',
  md: 'text-[0.72rem] px-6 py-3 tracking-[0.18em]',
  lg: 'text-[0.78rem] px-8 py-4 tracking-[0.2em]',
}

const PixelButton = forwardRef<HTMLButtonElement, PixelButtonProps>(
  ({ variant = 'primary', size = 'md', loading = false, className, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={clsx(
          variantClass[variant],
          sizeClass[size],
          'transition-all duration-300',
          (disabled || loading) && 'opacity-50 cursor-not-allowed',
          className
        )}
        {...props}
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-current animate-ping" />
            Loading...
          </span>
        ) : (
          children
        )}
      </button>
    )
  }
)

PixelButton.displayName = 'PixelButton'
export default PixelButton
