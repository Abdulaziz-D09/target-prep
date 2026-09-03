'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    if (error?.message?.includes('Invalid login credentials')) {
      redirect('/login?message=Invalid login credentials. Please check your email and password.')
    }
    redirect('/login?message=Could not authenticate user')
  }

  const { data: { user } } = await supabase.auth.getUser()
  const role = user?.user_metadata?.role || 'student'
  const destination = role === 'teacher' ? '/teacher' : '/dashboard'

  revalidatePath('/', 'layout')
  redirect(destination)
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  const role = formData.get('role') as string || 'student'

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        role: role,
      }
    }
  })

  if (error) {
    if (error?.message?.toLowerCase().includes('already registered')) {
      return { redirect: '/login?message=Account already created. Please log in.' }
    }
    return { error: error.message }
  }

  if (!data.session) {
    redirect(`/verify-code?email=${encodeURIComponent(email)}`)
  }

  const destination = role === 'teacher' ? '/teacher' : '/dashboard'

  revalidatePath('/', 'layout')
  redirect(destination)
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function verifyOtp(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const token = formData.get('token') as string

  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'signup'
  })

  if (error) {
    redirect(`/verify-code?email=${encodeURIComponent(email)}&message=${encodeURIComponent(error.message)}`)
  }

  const role = data.user?.user_metadata?.role || 'student'
  const destination = role === 'teacher' ? '/teacher' : '/dashboard'

  revalidatePath('/', 'layout')
  redirect(destination)
}

export async function resendOtp(email: string) {
  const supabase = await createClient()
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: email,
  })

  if (error) {
    return { success: false, message: error.message }
  }
  return { success: true }
}


export async function resetPassword(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string

  const { error } = await supabase.auth.resetPasswordForEmail(email)

  if (error) {
    redirect(`/forgot-password?message=${encodeURIComponent(error.message)}`)
  }

  redirect(`/verify-reset-code?email=${encodeURIComponent(email)}`)
}

export async function verifyResetOtp(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const token = formData.get('token') as string

  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'recovery'
  })

  if (error) {
    return { error: error.message }
  }

  // After successful OTP verification for recovery, the user is logged in
  // We can redirect them to the update password page
  return { redirect: '/update-password' }
}

export async function resendResetOtp(email: string) {
  const supabase = await createClient()
  const { error } = await supabase.auth.resend({
    type: 'signup', // Wait, Supabase doesn't support resend for recovery directly via resend api, it's just calling resetPasswordForEmail again
    email: email,
  })
  if (error) {
    return { success: false, message: error.message }
  }
  return { success: true }
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient()
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (password !== confirmPassword) {
    redirect('/update-password?message=Passwords do not match')
  }

  const { error } = await supabase.auth.updateUser({
    password: password
  })

  if (error) {
    redirect(`/update-password?message=${encodeURIComponent(error.message)}`)
  }

  // Optionally sign out the user or just keep them logged in
  await supabase.auth.signOut()
  
  redirect('/login?message=Password updated successfully. Please log in with your new password.')
}

export async function signInWithGoogle(formData?: FormData) {
  const supabase = await createClient()
  const headersList = await headers()
  const host = headersList.get('host')
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
  const origin = `${protocol}://${host}`
  
  let callbackUrl = `${origin}/auth/callback`
  
  if (formData) {
    const role = formData.get('role') as string
    if (role) {
      callbackUrl += `?role=${role}`
    }
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: callbackUrl,
    },
  })

  if (data.url) {
    redirect(data.url)
  }
}
