import { login } from './actions'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { SubmitButton } from './SubmitButton'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>
}) {
  const unwrappedParams = await searchParams
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
            Prepare for the SAT <span className="text-indigo-400">effectively</span>.
          </h1>
          <p className="text-slate-400 text-base lg:text-lg mb-6 leading-relaxed max-w-md">
            Practice with realistic tests and improve your score with targeted preparation.
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
              <h2 className="text-2xl font-bold mb-1">Log in to your account</h2>
              <p className="text-slate-400 text-sm">Enter your credentials to access the platform.</p>
            </div>

            {unwrappedParams?.message && (
              <div className={`mb-6 p-4 rounded-xl border text-sm text-center ${
                unwrappedParams.message.includes('created') || unwrappedParams.message.includes('success') 
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
                  : 'bg-red-500/10 border-red-500/20 text-red-500'
              }`}>
                {unwrappedParams.message}
              </div>
            )}

            <form action={login} className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
                <div className="relative">
                  <input 
                    name="email"
                    type="email" 
                    required
                    placeholder="you@example.com"
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5 pb-1 relative">
                <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
                <div className="relative">
                  <input 
                    name="password"
                    type="password" 
                    required
                    placeholder="••••••••"
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                  />
                </div>
                <div className="flex justify-end mt-1.5">
                  <Link href="/forgot-password" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">Forgot password?</Link>
                </div>
              </div>

              <div className="pt-2">
                <SubmitButton />
              </div>
            </form>


            <p className="mt-6 text-center text-sm text-slate-400">
              New account?{' '}
              <Link href="/signup" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                Sign Up
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  )
}
