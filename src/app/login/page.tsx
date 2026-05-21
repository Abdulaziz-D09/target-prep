import { login, signInWithGoogle } from './actions'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

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
            Master the SAT with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">precision</span>.
          </h1>
          <p className="text-slate-400 text-base lg:text-lg mb-6 leading-relaxed max-w-md">
            Join the elite platform designed to adapt, challenge, and elevate your performance. The most intelligent way to prepare.
          </p>

          <div className="flex items-center gap-4 text-sm text-slate-500 font-medium">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`w-8 h-8 rounded-full border-2 border-[#121826] bg-slate-800 flex items-center justify-center text-xs overflow-hidden`}>
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}&backgroundColor=6366f1`} alt="avatar" />
                </div>
              ))}
            </div>
            <p>Trusted by 10,000+ students</p>
          </div>
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

            <form className="space-y-3">
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
                <button 
                  formAction={login}
                  className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-xl px-4 py-3 shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 group"
                >
                  Log In <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </form>

            <div className="mt-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/10"></div>
              <span className="text-xs text-slate-400 font-medium">Or continue with</span>
              <div className="h-px flex-1 bg-white/10"></div>
            </div>

            <div className="mt-5">
              <form action={signInWithGoogle}>
                <button type="submit" className="w-full bg-white text-slate-900 hover:bg-slate-100 font-medium rounded-xl px-4 py-2.5 transition-all flex items-center justify-center gap-3">
                  <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google
                </button>
              </form>
            </div>

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
