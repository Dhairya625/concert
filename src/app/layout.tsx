import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Coldplay: A Head Full of Dreams — Minecraft Edition',
  description:
    'Experience the most immersive concert in history. Coldplay performs live inside Minecraft. Get your tickets now.',
  openGraph: {
    title: 'Coldplay × Minecraft Live Concert',
    description: 'The world inside the world. One night only.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--bg-void)] text-[var(--text-primary)] antialiased mc-grid">
        {children}
      </body>
    </html>
  )
}
