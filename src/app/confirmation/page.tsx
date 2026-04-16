import { Suspense } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import StarField from '@/components/particles/StarField'
import ConfirmationClient from './ConfirmationClient'

export const metadata = { title: 'Booking Confirmed — Coldplay × Minecraft' }

export default function ConfirmationPage() {
  return (
    <>
      <StarField />
      <Navbar />
      <main className="relative z-10 flex-1 pt-24 pb-20 px-4">
        <Suspense fallback={<div className="eyebrow text-[var(--accent-teal)] animate-pulse-soft text-center mt-20">Loading...</div>}>
          <ConfirmationClient />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
