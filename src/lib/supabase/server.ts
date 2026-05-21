import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        flowType: 'pkce',
        detectSessionInUrl: false,
        persistSession: true,
        autoRefreshToken: false,
        storage: {
          getItem: (key) => cookieStore.get(key)?.value ?? null,
          setItem: (key, value) => {
            try {
              cookieStore.set(key, value)
            } catch (error) {
              // Ignored when called from Server Component
            }
          },
          removeItem: (key) => {
            try {
              cookieStore.delete(key)
            } catch (error) {
              // Ignored when called from Server Component
            }
          },
        },
      },
    }
  )
}
