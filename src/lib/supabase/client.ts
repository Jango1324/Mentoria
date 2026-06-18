// Browser-side Supabase client — use only in Client Components ('use client').
// For Server Components and Server Actions, use src/lib/supabase/server.ts instead.
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
