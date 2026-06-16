'use client'

import { useState, use } from 'react'
import { signup } from '../login/actions'
import { ArrowRight, GraduationCap, Briefcase } from 'lucide-react'
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
      
      {/* Background Atmosphere */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <div className="relative z-10 w-full min-h-screen grid lg:grid-cols-2 p-4 md:p-8">
        
        {/* Left Side: Branding / Marketing */}
        <div className="hidden lg:flex flex-col justify-center w-full max-w-xl mx-auto lg:ml-auto lg:mr-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-16 w-16 flex items-center justify-center rounded-2xl overflow-hidden shadow-lg shadow-indigo-500/20">
              <img src="/logo.jpg" alt="Target Prep Icon" className="w-full h-full object-cover" />
            </div>
            <span className="text-4xl font-extrabold tracking-tight text-white">Target Prep</span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
            Begin your journey to a <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">higher score</span>.
          </h1>
          <p className="text-slate-400 text-base lg:text-lg mb-6 leading-relaxed max-w-md">
            Create your account to unlock practice tests, performance analytics, and a clear study plan.
          </p>
        </div>

        {/* Right Side: Auth Form */}
        <div className="flex flex-col justify-center w-full max-w-[480px] mx-auto lg:mr-auto lg:ml-12 my-8 lg:my-0">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
            {/* Top Shine */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
            
            <div className="md:hidden flex items-center justify-center gap-4 mb-6">
              <div className="h-14 w-14 flex items-center justify-center rounded-2xl overflow-hidden shadow-lg shadow-indigo-500/20">
                <img src="/logo.jpg" alt="Target Prep Icon" className="w-full h-full object-cover" />
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

              {accountType === 'student' && (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300 ml-1">Birthdate</label>
                  <input 
                    name="birthdate"
                    type="date" 
                    required
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all [color-scheme:dark]"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 gap-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300 ml-1">{accountType === 'student' ? 'Current School' : 'School / Institution'}</label>
                  <input 
                    name="school"
                    type="text" 
                    required
                    placeholder="High School Name"
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                  />
                </div>
              </div>

              {accountType === 'student' && (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300 ml-1">Graduation Date</label>
                  <input 
                    name="graduationDate"
                    type="month" 
                    required
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all [color-scheme:dark]"
                  />
                </div>
              )}

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
                  className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-xl px-4 py-3 shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Creating Account...' : `Create ${accountType === 'student' ? 'Student' : 'Teacher'} Account`} 
                  {!isSubmitting && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                </button>
              </div>
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
