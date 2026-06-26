with open('src/app/login/actions.ts', 'r') as f:
    content = f.read()

new_content = """'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  try {
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
  } catch (err: any) {
    if (err.message === 'NEXT_REDIRECT') {
      throw err;
    }
    console.error("Login Error:", err);
    redirect('/login?message=An unexpected error occurred. Please try again.')
  }
}
"""

content = new_content + content.split("export async function signup(formData: FormData) {")[1]
content = content.replace("content = new_content + content.split", "") # cleanup just in case
with open('src/app/login/actions.ts', 'w') as f:
    f.write("export async function signup(formData: FormData) {" + content) # wait, python string manipulation
