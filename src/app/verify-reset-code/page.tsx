'use client'

import { useState, useRef, KeyboardEvent, ClipboardEvent, use } from 'react'
import { verifyResetOtp } from '../login/actions'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function VerifyResetCodePage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; message?: string }>
}) {
  const unwrappedParams = use(searchParams)
  const email = unwrappedParams?.email || ''
  
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [errorMsg, setErrorMsg] = useState(unwrappedParams?.message || '');
  const [isVerifying, setIsVerifying] = useState(false);

  const inputRefs = [
      useRef<HTMLInputElement>(null),
      useRef<HTMLInputElement>(null),
      useRef<HTMLInputElement>(null),
      useRef<HTMLInputElement>(null),
      useRef<HTMLInputElement>(null),
      useRef<HTMLInputElement>(null),
  ];

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
      if (e.key === 'Backspace') {
          e.preventDefault();
          const newCode = [...code];
          if (code[index]) {
              newCode[index] = '';
              setCode(newCode);
          } else if (index > 0) {
              newCode[index - 1] = '';
              setCode(newCode);
              inputRefs[index - 1].current?.focus();
          }
      } else if (e.key === 'ArrowLeft' && index > 0) {
          inputRefs[index - 1].current?.focus();
      } else if (e.key === 'ArrowRight' && index < 5) {
          inputRefs[index + 1].current?.focus();
      }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
      const value = e.target.value.toUpperCase();
      if (!/^[A-Z0-9]*$/.test(value)) return;
      
      const newCode = [...code];
      newCode[index] = value.slice(-1);
      setCode(newCode);
      
      if (value && index < 5) {
          inputRefs[index + 1].current?.focus();
      }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pastedData = e.clipboardData.getData('text').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
      if (pastedData) {
          const newCode = [...code];
          for (let i = 0; i < pastedData.length; i++) {
              newCode[i] = pastedData[i];
          }
          setCode(newCode);
          const nextIndex = Math.min(pastedData.length, 5);
          inputRefs[nextIndex].current?.focus();
      }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsVerifying(true);
    setErrorMsg('');

    const token = code.join('');
    const formData = new FormData();
    formData.append('email', email);
    formData.append('token', token);

    const result = await verifyResetOtp(formData);
    
    if (result?.error) {
      setErrorMsg(result.error);
      setIsVerifying(false);
    } else if (result?.redirect) {
      window.location.href = result.redirect;
    }
  }

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
                <img src="/logo.png" alt="Target Prep Icon" className="w-full h-full object-cover rounded-full" />
              </div>
            </div>

            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold mb-1">Verify Reset Code</h2>
              <p className="text-slate-400 text-sm">Enter the code sent to your email to reset your password.</p>
            </div>

            {errorMsg && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3 flex flex-col items-center">
                <label className="text-sm font-medium text-slate-300">Verification Code</label>
                <div className="flex gap-2 sm:gap-3 justify-center w-full">
                    {code.map((digit, index) => (
                        <input
                            key={index}
                            ref={inputRefs[index]}
                            type="text"
                            inputMode="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleInput(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            onPaste={handlePaste}
                            className="w-12 h-14 sm:w-[52px] sm:h-[60px] bg-black/20 border-2 border-white/10 rounded-xl text-center text-[22px] font-black text-white uppercase focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm"
                        />
                    ))}
                </div>
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  disabled={code.join('').length !== 6 || isVerifying}
                  className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-xl px-4 py-3 shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isVerifying ? 'Verifying...' : 'Verify Code'} {!isVerifying && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
