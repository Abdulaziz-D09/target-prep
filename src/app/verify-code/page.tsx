'use client'

import { use, useState, useRef, useEffect, KeyboardEvent, ClipboardEvent } from 'react'
import { verifyOtp, resendOtp } from '../login/actions'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function VerifyCodePage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; message?: string }>
}) {
  const unwrappedParams = use(searchParams);
  const email = unwrappedParams?.email || '';
  const initialMessage = unwrappedParams?.message;

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [resendStatus, setResendStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [isResending, setIsResending] = useState(false);
  
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleResend = async () => {
    if (timer > 0 || isResending) return;
    setResendStatus(null);
    setIsResending(true);
    const result = await resendOtp(email);
    setIsResending(false);
    if (result.success) {
      setResendStatus({ success: true, message: 'Verification code resent successfully!' });
      setTimer(60);
    } else {
      setResendStatus({ success: false, message: result.message || 'Failed to resend code.' });
    }
  };

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
    const val = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
    if (!val) return;
    
    const newCode = [...code];
    newCode[index] = val.substring(val.length - 1);
    setCode(newCode);
    
    if (index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^a-zA-Z0-9]/g, '').slice(0, 6);
    if (!pastedData) return;
    
    const newCode = [...code];
    for (let i = 0; i < pastedData.length; i++) {
      newCode[i] = pastedData[i];
    }
    setCode(newCode);
    
    const focusIndex = Math.min(pastedData.length, 5);
    inputRefs[focusIndex].current?.focus();
  };

  const combinedCode = code.join('');

  return (
    <div className="min-h-screen w-full flex bg-[#0A0D14] text-white overflow-hidden relative selection:bg-indigo-500/30">

      <div className="relative z-10 w-full min-h-screen flex items-center justify-center p-4 md:p-8">
        
        {/* Auth Form */}
        <div className="w-full max-w-[480px]">
          <Link href="/login" className="inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 font-medium mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to login
          </Link>

          <div className="bg-[#12151D] border border-white/5 rounded-[24px] p-8 shadow-2xl relative overflow-hidden flex flex-col items-center text-center">
            
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-16 w-16 flex items-center justify-center rounded-[16px] overflow-hidden bg-[#1A1D24]">
                <img src="/logo.jpg" alt="Target Prep Icon" className="w-10 h-10 object-contain" />
              </div>
            </div>

            <div className="mb-8 text-center">
              <h2 className="text-3xl font-extrabold mb-2 tracking-tight text-white">Verify your email</h2>
              <p className="text-slate-400 text-[15px]">Enter the code sent to <span className="text-white font-medium">{email}</span></p>
            </div>

            {(initialMessage || resendStatus?.message) && (
              <div className={`mb-8 w-full p-4 rounded-xl text-sm text-center font-medium border ${
                resendStatus?.success 
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                  : 'bg-red-500/10 border-red-500/20 text-red-500'
              }`}>
                {resendStatus?.message || initialMessage}
              </div>
            )}

            <form className="space-y-8 w-full flex flex-col items-center">
              <input type="hidden" name="email" value={email} />
              <input type="hidden" name="token" value={combinedCode} />
              
              <div className="flex gap-2 sm:gap-3 justify-center w-full max-w-[360px]">
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
                    className="w-12 h-14 sm:w-[52px] sm:h-[60px] bg-[#1A1D24] border border-transparent rounded-lg text-center text-[22px] font-semibold text-white focus:outline-none focus:border-[#5A67FF] transition-all"
                  />
                ))}
              </div>

              <div className="text-sm text-slate-400 font-medium">
                {timer > 0 ? (
                  <span>Resend code in <span className="text-white font-semibold">{timer}s</span></span>
                ) : (
                  <span>Didn't receive a code?{' '}
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={isResending}
                      className="inline-flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isResending ? (
                        <>
                          <svg className="w-3.5 h-3.5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Sending...
                        </>
                      ) : (
                        'Resend code'
                      )}
                    </button>
                  </span>
                )}
              </div>

              <div className="w-full">
                <button 
                  formAction={verifyOtp}
                  disabled={combinedCode.length !== 6}
                  className="w-full bg-[#5A67FF] hover:bg-[#4c58df] disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold rounded-[12px] px-4 py-[14px] transition-all flex items-center justify-center gap-2 group text-[15px]"
                >
                  Verify Account <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              
              <div className="text-sm text-slate-400 font-medium pt-2">
                Wrong email? <Link href="/signup" className="text-white hover:text-indigo-300 ml-1 transition-colors">Go back</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
