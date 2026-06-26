import { resetPassword } from '../login/actions'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { SubmitButton } from '../login/SubmitButton'

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; success?: string }>
}) {
  const unwrappedParams = await searchParams
  return (
    <div className="min-h-screen w-full flex bg-[#121826] text-white overflow-hidden relative selection:bg-indigo-500/30">
      
      {/* Background Atmosphere */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <div className="relative z-10 w-full min-h-screen flex items-center justify-center p-4 md:p-8">
        
        {/* Auth Form */}
        <div className="w-full max-w-[480px]">
          <Link href="/login" className="inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 font-medium mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to login
          </Link>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
            {/* Top Shine */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
            
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-14 w-14 flex items-center justify-center rounded-2xl overflow-hidden shadow-lg shadow-indigo-500/20">
                <img src="/logo.jpg" alt="Target Prep Icon" className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold mb-1">Reset your password</h2>
              <p className="text-slate-400 text-sm">Enter your email and we'll send you a link to securely log in and reset your password.</p>
            </div>

            {unwrappedParams?.message && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
                {unwrappedParams.message}
              </div>
            )}

            {unwrappedParams?.success && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm text-center">
                {unwrappedParams.success}
              </div>
            )}

            <form action={resetPassword} className="space-y-4">
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

              <div className="pt-2">
                <SubmitButton text="Send Reset Link" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
