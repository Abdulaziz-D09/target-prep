'use client';
import { useState, useEffect, useRef, KeyboardEvent, ClipboardEvent } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useClassroomStore } from '@/store/classroomStore';
import { FloatingPageShapes, pageRevealVariants } from '@/components/SiteMotion';

export default function StudentMockLobbyPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const mockId = searchParams.get('mockId');
    const studentId = searchParams.get('studentId');

    const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);
    const inputRefs = [
        useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)
    ];
    const [error, setError] = useState('');

    const mockSessions = useClassroomStore((state) => state.mockSessions);
    const session = mockSessions.find((s) => s.id === mockId);

    useEffect(() => {
        if (!mockId || !studentId) {
            router.push('/dashboard/mocks');
        }
    }, [mockId, studentId, router]);

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace') {
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
        newCode[index] = val.substring(val.length - 1).toUpperCase();
        setCode(newCode);
        
        if (index < 5) {
            inputRefs[index + 1].current?.focus();
        }
    };

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/[^a-zA-Z0-9]/g, '').slice(0, 6).toUpperCase();
        if (!pastedData) return;
        
        const newCode = [...code];
        for (let i = 0; i < pastedData.length; i++) {
            newCode[i] = pastedData[i];
        }
        setCode(newCode);
        
        const focusIndex = Math.min(pastedData.length, 5);
        if (focusIndex < 6) {
            inputRefs[focusIndex].current?.focus();
        }
    };

    const handleJoinCodeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!mockId || !studentId) return;
        setError('');
        
        const joinCode = code.join('');
        if (joinCode.length !== 6) {
            setError('Please enter a 6-character code.');
            return;
        }

        const res = useClassroomStore.getState().joinMock(joinCode, studentId);

        if (res.success && res.session) {
            if (res.assignedTestId) {
                if (res.session.strictMode) {
                    document.documentElement.requestFullscreen().catch((err) => console.log('Fullscreen failed:', err));
                }
                router.push(`/practice/test/${res.assignedTestId}?mockId=${res.session.id}&studentId=${studentId}`);
            } else {
                setError('No test assigned yet.');
            }
        } else {
            setError(res.error || 'Failed to join mock session.');
        }
    };

    if (!mockId || !studentId) return null;

    return (
        <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-8 overflow-hidden bg-slate-50 dark:bg-[#0B1120]">
            {/* Ambient Background Glows */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />

            <motion.div
                className="relative z-10 w-full max-w-3xl flex flex-col items-center"
                initial="hidden"
                animate="visible"
                variants={pageRevealVariants}
            >
                {/* Header Graphic */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    className="relative mb-12 flex justify-center items-center"
                >
                    <div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-[40px] animate-pulse" />
                    <div className="bg-emerald-50 dark:bg-emerald-500/10 border-2 border-emerald-100 dark:border-emerald-500/20 w-24 h-24 rounded-full flex items-center justify-center relative z-10 shadow-2xl">
                        <CheckCircle className="w-12 h-12 text-emerald-500 dark:text-emerald-400" />
                    </div>
                </motion.div>

                {/* Text Context */}
                <div className="text-center mb-12 space-y-4">
                    <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                        Registration Successful
                    </h1>
                    <p className="text-lg text-slate-500 dark:text-slate-400 font-medium max-w-xl mx-auto leading-relaxed">
                        You are locked in! Wait for your instructor to launch the exam, then enter the <strong className="text-slate-700 dark:text-slate-200">6-character session code</strong> below to begin.
                    </p>
                </div>

                {error && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                        className="mb-8 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl flex items-start gap-3 text-red-600 dark:text-red-400 max-w-md w-full mx-auto"
                    >
                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                        <p className="font-bold text-sm">{error}</p>
                    </motion.div>
                )}

                {session?.joinLocked ? (
                    <div className="w-full flex flex-col items-center">
                        <div className="mb-8 p-6 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col items-center text-center gap-3 max-w-md w-full mx-auto shadow-sm">
                            <div className="w-12 h-12 bg-red-100 dark:bg-red-500/10 rounded-full flex items-center justify-center mb-2">
                                <AlertCircle className="w-6 h-6 text-red-500 dark:text-red-400" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Session Locked</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                                Your instructor has locked this session. You cannot join the exam at this time.
                            </p>
                        </div>
                        <button 
                            type="button" 
                            onClick={() => router.push('/dashboard/mocks')} 
                            className="px-8 py-4 font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition w-full sm:w-auto"
                        >
                            Return to Dashboard
                        </button>
                    </div>
                ) : (
                    <form id="code-form" onSubmit={handleJoinCodeSubmit} className="w-full flex flex-col items-center">
                        <div className="flex gap-3 sm:gap-5 justify-center w-full mb-12">
                            {code.map((digit, index) => (
                                <motion.input
                                    key={index}
                                    ref={inputRefs[index]}
                                    type="text"
                                    inputMode="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleInput(e, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    onPaste={handlePaste}
                                    whileFocus={{ scale: 1.05, y: -4 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                    className="w-16 h-20 sm:w-20 sm:h-24 bg-white dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 rounded-2xl text-center text-[32px] sm:text-[40px] font-black text-slate-900 dark:text-white uppercase focus:outline-none focus:border-blue-500 focus:ring-[4px] focus:ring-blue-500/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-colors"
                                />
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
                            <button 
                                type="button" 
                                onClick={() => router.push('/dashboard/mocks')} 
                                className="px-8 py-4 font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition w-full sm:w-auto"
                            >
                                Return to Dashboard
                            </button>
                            <button 
                                form="code-form" 
                                type="submit" 
                                disabled={code.join('').length !== 6} 
                                className="bg-blue-600 hover:bg-blue-500 text-white px-12 py-4 rounded-full text-lg font-black shadow-[0_0_40px_rgba(37,99,235,0.3)] hover:shadow-[0_0_60px_rgba(37,99,235,0.4)] hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none w-full sm:w-auto"
                            >
                                Start Exam
                            </button>
                        </div>
                    </form>
                )}
            </motion.div>
        </div>
    );
}
