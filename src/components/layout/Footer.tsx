import Link from 'next/link'

export default function Footer() {
  return (
    <footer
      className="relative z-10 mt-auto"
      style={{ borderTop: '1px solid var(--border-subtle)' }}
    >
      <div
        className="max-w-7xl mx-auto px-4 md:px-8 py-12"
        style={{ background: 'rgba(7, 8, 13, 0.92)' }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <h3 className="eyebrow text-[var(--accent-teal)] mb-4">
              <span className="eyebrow-dot" />
              Coldplay x Minecraft
            </h3>
            <p className="font-body text-sm text-[var(--text-muted)] leading-relaxed">
              A Head Full of Dreams inside a world of blocks. One night. Forever.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="eyebrow text-[var(--text-secondary)] mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                { href: '/', label: 'Home' },
                { href: '/tickets', label: 'Buy Tickets' },
                { href: '/#faq', label: 'FAQ' },
                { href: '/auth/login', label: 'My Account' },
              ].map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-[var(--text-faint)] hover:text-[var(--accent-teal)] transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="eyebrow text-[var(--text-secondary)] mb-4">
              Legal
            </h4>
            <ul className="space-y-2">
              {['Terms of Service', 'Privacy Policy', 'Refund Policy'].map(t => (
                <li key={t}>
                  <span className="font-body text-sm text-[var(--text-faint)]">{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid var(--border-subtle)' }}
        >
          <p className="eyebrow text-[var(--text-faint)]">
            2025 Coldplay x Minecraft. All blocks reserved.
          </p>
          <p className="font-body text-xs text-[var(--text-faint)]">
            Powered by Razorpay · Supabase · Next.js
          </p>
        </div>
      </div>
    </footer>
  )
}
