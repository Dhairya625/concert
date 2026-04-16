import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Check if localStorage is available
  let persistSession = false
  if (typeof window !== 'undefined') {
    try {
      const test = '__storage_test__'
      window.localStorage.setItem(test, test)
      window.localStorage.removeItem(test)
      persistSession = true
    } catch {
      persistSession = false
    }
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession,
        storage: persistSession ? localStorage : undefined,
      },
    }
  )
}
