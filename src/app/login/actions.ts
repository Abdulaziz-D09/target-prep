'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
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
    if (error.message.includes('Invalid login credentials')) {
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
  const birthdate = formData.get('birthdate') as string
  const school = formData.get('school') as string
  const graduationDate = formData.get('graduationDate') as string
  const role = formData.get('role') as string || 'student'

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        birthdate,
        school,
        graduation_date: graduationDate,
        role: role,
      }
    }
  })

  if (error) {
    if (error.message.toLowerCase().includes('already registered')) {
      redirect('/login?message=Account already created. Please log in.')
    }
    redirect(`/signup?message=${encodeURIComponent(error.message)}`)
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

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback?next=/dashboard`,
  })

  if (error) {
    redirect(`/forgot-password?message=${encodeURIComponent(error.message)}`)
  }

  redirect('/forgot-password?success=Check your email for the reset link.')
}

export async function signInWithGoogle() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
    },
  })

  if (error) {
    redirect(`/login?message=${encodeURIComponent(error.message)}`)
  }

  if (data.url) {
    redirect(data.url)
  }
}

