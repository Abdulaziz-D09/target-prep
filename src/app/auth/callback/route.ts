import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error, data } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // If a role was provided (e.g. from Google Sign Up), update the user's metadata
      const roleParam = searchParams.get('role')
      if (roleParam && (roleParam === 'student' || roleParam === 'teacher')) {
        await supabase.auth.updateUser({
          data: { role: roleParam }
        })
      }

      // Determine redirect based on role
      const { data: { user } } = await supabase.auth.getUser()
      const role = user?.user_metadata?.role || 'student'
      const finalDestination = searchParams.has('next') ? next : (role === 'teacher' ? '/teacher' : '/dashboard')

      return NextResponse.redirect(`${origin}${finalDestination}`)
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=Could not authenticate with Google`)
}
