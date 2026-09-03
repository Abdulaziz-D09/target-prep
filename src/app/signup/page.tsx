'use client'

import { useState, use } from 'react'
import { signup, signInWithGoogle } from '../login/actions'
import { ArrowRight, GraduationCap, Briefcase, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>
}) {
  const unwrappedParams = use(searchParams)
  const [accountType, setAccountType] = useState<'student' | 'teacher'>('student')
  const [errorMsg, setErrorMsg] = useState<string>(unwrappedParams?.message || '')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg('')
    
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('classroom-storage');
      window.localStorage.removeItem('targetprep_test_storage');
    }

    const formData = new FormData(e.currentTarget)
    const result = await signup(formData)
    
    if (result?.error) {
      setErrorMsg(result.error)
      setIsSubmitting(false)
    } else if (result?.redirect) {
      window.location.href = result.redirect
    }
  }

  return (
    <div className="min-h-screen w-full flex bg-[#121826] text-white overflow-hidden relative selection:bg-indigo-500/30">
      
      {/* Clean Background Atmosphere */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-slate-900">
        <div className="absolute top-[30%] left-[40%] w-[40%] h-[40%] bg-indigo-500/10 blur-[150px] rounded-full mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 w-full min-h-screen grid lg:grid-cols-2 p-4 md:p-8">
        
        {/* Left Side: Branding / Marketing */}
        <div className="hidden lg:flex flex-col justify-center w-full max-w-xl mx-auto lg:ml-auto lg:mr-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-16 w-16 flex items-center justify-center rounded-2xl overflow-hidden shadow-lg shadow-indigo-500/20">
              <img src="/logo.png" alt="Target Prep Icon" className="w-full h-full object-cover rounded-2xl" />
            </div>
            <span className="text-4xl font-extrabold tracking-tight text-white">Target Prep</span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
            Begin your journey to a <span className="text-indigo-400">higher score</span>.
          </h1>
          <p className="text-slate-400 text-base lg:text-lg mb-6 leading-relaxed max-w-md">
            Create your account to unlock practice tests, performance analytics, and a clear study plan.
          </p>
        </div>

        {/* Right Side: Auth Form */}
        <div className="flex flex-col justify-center w-full max-w-[480px] mx-auto lg:mr-auto lg:ml-12 my-8 lg:my-0">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
            {/* Top Shine */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-[2px] bg-gradient-to-r from-transparent via-indigo-400/50 to-transparent" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
            
            <div className="md:hidden flex items-center justify-center gap-4 mb-6">
              <div className="h-14 w-14 flex items-center justify-center rounded-2xl overflow-hidden shadow-lg shadow-indigo-500/20">
                <img src="/logo.png" alt="Target Prep Icon" className="w-full h-full object-cover rounded-2xl" />
              </div>
              <span className="text-3xl font-extrabold tracking-tight text-white">Target Prep</span>
            </div>

            <div className="mb-6 text-center md:text-left">
              <h2 className="text-2xl font-bold mb-1">Create new account</h2>
              <p className="text-slate-400 text-sm">Tell us a bit about yourself to personalize your experience.</p>
            </div>

            {errorMsg && (
              <div className={`mb-6 p-4 rounded-xl border text-sm text-center ${
                errorMsg.includes('created') || errorMsg.includes('success') 
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
                  : 'bg-red-500/10 border-red-500/20 text-red-500'
              }`}>
                {errorMsg}
              </div>
            )}

            {/* Account Type Toggle */}
            <div className="flex bg-black/20 p-1.5 rounded-xl mb-6 border border-white/10">
              <button 
                type="button" 
                onClick={() => setAccountType('student')} 
                className={`flex-1 py-2 flex items-center justify-center gap-2 text-sm font-medium rounded-lg transition-all ${accountType === 'student' ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                <GraduationCap className="w-4 h-4" />
                Student
              </button>
              <button 
                type="button" 
                onClick={() => setAccountType('teacher')} 
                className={`flex-1 py-2 flex items-center justify-center gap-2 text-sm font-medium rounded-lg transition-all ${accountType === 'teacher' ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                <Briefcase className="w-4 h-4" />
                Teacher
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="hidden" name="role" value={accountType} />
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300 ml-1">First Name</label>
                  <input 
                    name="firstName"
                    type="text" 
                    required
                    placeholder="Jane"
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300 ml-1">Surname</label>
                  <input 
                    name="lastName"
                    type="text" 
                    required
                    placeholder="Doe"
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                  />
                </div>
              </div>


              <div className="space-y-1.5 mt-4">
                <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
                <input 
                  name="email"
                  type="email" 
                  required
                  placeholder="you@example.com"
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                />
              </div>

              <div className="space-y-1.5 pb-1">
                <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
                <input 
                  name="password"
                  type="password" 
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                  onChange={(e) => {
                    const el = e.target;
                    if (el.value.length > 0 && el.value.length < 6) {
                      el.setCustomValidity('Password must be at least 6 characters long.');
                    } else {
                      el.setCustomValidity('');
                    }
                  }}
                />
                <p className="text-xs text-slate-400 ml-1 mt-1">Minimum 6 characters</p>
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl px-4 py-3.5 shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 group hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      {`Create ${accountType === 'student' ? 'Student' : 'Teacher'} Account`} 
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 py-1 bg-[#1a2235] text-slate-400 rounded-full border border-white/10 text-xs font-medium">
                  Or continue with
                </span>
              </div>
            </div>

            <form action={signInWithGoogle}>
              <input type="hidden" name="role" value={accountType} />
              <button
                type="submit"
                className="w-full bg-white text-slate-900 font-bold rounded-xl px-4 py-3 shadow-lg hover:bg-slate-100 transition-all flex items-center justify-center gap-3 hover:-translate-y-0.5 active:translate-y-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                Google
              </button>
            </form>




            <p className="mt-6 text-center text-sm text-slate-400">
              Already have an account?{' '}
              <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                Log In
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  )
}
