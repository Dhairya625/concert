import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import StarField from '@/components/particles/StarField'
import TicketsPageClient from './TicketsPageClient'

export const metadata = {
  title: 'Buy Tickets — Coldplay × Minecraft',
  description: 'Choose your ticket tier and secure your spot at the Coldplay Minecraft concert.',
}

export default function TicketsPage() {
  return (
    <>
      <StarField />
      <Navbar />
      <main className="relative z-10 flex-1 pt-24 pb-20 px-4">
        <TicketsPageClient />
      </main>
      <Footer />
    </>
  )
}
