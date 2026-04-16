import { Suspense } from 'react'
import Navbar from '@/components/layout/Navbar'
import StarField from '@/components/particles/StarField'
import SignupClient from './SignupClient'

export const metadata = { title: 'Sign Up — Coldplay × Minecraft' }

export default function SignupPage() {
  return (
    <>
      <StarField />
      <Navbar />
      <main className="relative z-10 flex-1 min-h-screen flex items-center justify-center px-4 pt-20">
        <Suspense fallback={<div className="eyebrow text-[var(--accent-teal)] animate-pulse-soft">Loading...</div>}>
          <SignupClient />
        </Suspense>
      </main>
    </>
  )
}
