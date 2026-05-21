import { createClient as createSupabaseClient } from '@supabase/supabase-js'

let supabase: ReturnType<typeof createSupabaseClient> | null = null

export function createClient() {
  if (!supabase) {
    supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          flowType: 'pkce',
          detectSessionInUrl: true,
          storage: {
            getItem: (key) => {
              if (typeof document === 'undefined') return null;
              const match = document.cookie.match(new RegExp('(^| )' + key + '=([^;]+)'));
              return match ? decodeURIComponent(match[2]) : null;
            },
            setItem: (key, value) => {
              if (typeof document === 'undefined') return;
              document.cookie = `${key}=${encodeURIComponent(value)}; path=/; max-age=31536000; SameSite=Lax; secure`;
            },
            removeItem: (key) => {
              if (typeof document === 'undefined') return;
              document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
            }
          }
        }
      }
    )
  }
  return supabase
}
