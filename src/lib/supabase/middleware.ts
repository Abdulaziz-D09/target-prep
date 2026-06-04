import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        flowType: 'pkce',
        detectSessionInUrl: false,
        persistSession: true,
        autoRefreshToken: true,
        storage: {
          getItem: (key) => request.cookies.get(key)?.value ?? null,
          setItem: (key, value) => {
            request.cookies.set(key, value)
            supabaseResponse = NextResponse.next({ request })
            supabaseResponse.cookies.set(key, value)
          },
          removeItem: (key) => {
            request.cookies.delete(key)
            supabaseResponse = NextResponse.next({ request })
            supabaseResponse.cookies.delete(key)
          },
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const protectedRoutes = ['/dashboard', '/classroom', '/practice', '/teacher', '/study-plan', '/question-bank']
  const isProtectedRoute = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))
  const isAuthPage = request.nextUrl.pathname.startsWith('/login')

  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user && isAuthPage) {
    const url = request.nextUrl.clone()
    if (user.user_metadata?.role === 'teacher') {
      url.pathname = '/teacher'
    } else {
      url.pathname = '/dashboard'
    }
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
