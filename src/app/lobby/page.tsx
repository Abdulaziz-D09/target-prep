'use client';
import { useState, useEffect, useRef, KeyboardEvent, ClipboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Clock, X } from 'lucide-react';
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
    const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);

    const mockSessions = useClassroomStore((state) => state.mockSessions);
    const session = mockSessions.find((s) => s.id === mockId);
    const students = useClassroomStore((state) => state.students);
    const registeredStudents = students.filter(st => st.mockSessionId === mockId);

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
            // Record that the student successfully entered the lobby code and started the exam
            useClassroomStore.getState().submitAssignmentProgress(studentId, res.session.id, 0, 0, 0, false);
            
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
                <div className="text-center mb-10 space-y-4">
                    <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                        Registration Successful
                    </h1>
                    <p className="text-lg text-slate-500 dark:text-slate-400 font-medium max-w-xl mx-auto leading-relaxed">
                        You are locked in! Wait for your instructor to launch the exam{session?.status === 'active' ? ', then enter the 6-character session code below to begin.' : '.'}
                    </p>
                    
                    {registeredStudents.length > 0 && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-center gap-3 pt-2 cursor-pointer hover:scale-105 transition-transform"
                            onClick={() => setIsStudentModalOpen(true)}
                        >
                            <div className="flex -space-x-2.5">
                                {registeredStudents.slice(0, 5).map(student => (
                                    <div key={student.id} className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px] font-bold border-2 border-slate-50 dark:border-[#0B1120] shadow-sm relative z-10" title={student.name}>
                                        {student.name.charAt(0).toUpperCase()}
                                    </div>
                                ))}
                                {registeredStudents.length > 5 && (
                                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center text-[10px] font-bold border-2 border-slate-50 dark:border-[#0B1120] shadow-sm relative z-0">
                                        +{registeredStudents.length - 5}
                                    </div>
                                )}
                            </div>
                            <span className="text-[13px] font-bold text-slate-500 dark:text-slate-400">
                                {registeredStudents.length} in Lobby
                            </span>
                        </motion.div>
                    )}
                </div>

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
                ) : session?.status === 'upcoming' ? (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="w-full flex flex-col items-center"
                    >
                        <div className="relative mb-12 p-10 bg-slate-50/50 dark:bg-slate-800/20 border border-slate-200/50 dark:border-slate-700/50 rounded-[32px] flex flex-col items-center text-center gap-4 max-w-lg w-full mx-auto shadow-2xl shadow-blue-500/5 backdrop-blur-sm overflow-hidden">
                            {/* Decorative background pulses */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-32 bg-gradient-to-b from-blue-500/10 to-transparent blur-3xl opacity-50" />
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-400/5 via-transparent to-transparent opacity-70 animate-pulse" />
                            
                            <div className="relative mb-4 flex items-center justify-center">
                                <motion.div 
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 rounded-full border-[3px] border-dashed border-blue-200 dark:border-blue-900/50"
                                />
                                <motion.div 
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                    className="w-20 h-20 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 z-10"
                                >
                                    <Clock className="w-10 h-10 text-white drop-shadow-md" />
                                </motion.div>
                            </div>
                            
                            <div className="relative z-10">
                                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">
                                    Mock Starts Soon
                                </h2>
                                <p className="text-slate-500 dark:text-slate-400 text-[15px] leading-relaxed max-w-sm mx-auto">
                                    Your teacher is preparing the session. 
                                    Hang tight, the 6-digit access code will be revealed shortly!
                                </p>
                            </div>
                            
                            <div className="mt-4 flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                </span>
                                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">Waiting for Host</span>
                            </div>
                        </div>
                        
                        <button 
                            type="button" 
                            onClick={() => router.push('/dashboard/mocks')} 
                            className="px-8 py-3 rounded-full font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 hover:text-slate-800 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-700 transition-all w-full sm:w-auto"
                        >
                            Return to Dashboard
                        </button>
                    </motion.div>
                ) : (
                    <form id="code-form" onSubmit={handleJoinCodeSubmit} className="w-full flex flex-col items-center">
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                                className="mb-8 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl flex items-start gap-3 text-red-600 dark:text-red-400 max-w-md w-full mx-auto"
                            >
                                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                <p className="font-bold text-sm">{error}</p>
                            </motion.div>
                        )}
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

            {/* Registered Students Modal */}
            <AnimatePresence>
                {isStudentModalOpen && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                            onClick={() => setIsStudentModalOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-md bg-white dark:bg-[#0B1120] border-2 border-slate-200 dark:border-slate-800 rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[80vh]"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                                <div>
                                    <h2 className="text-xl font-black text-slate-900 dark:text-white">In Lobby</h2>
                                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mt-1">{registeredStudents.length} {registeredStudents.length === 1 ? 'Student' : 'Students'}</p>
                                </div>
                                <button 
                                    onClick={() => setIsStudentModalOpen(false)}
                                    className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="overflow-y-auto p-4 custom-scrollbar space-y-3">
                                {registeredStudents.map(student => (
                                    <div key={student.id} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/60">
                                        <div className="w-12 h-12 shrink-0 rounded-full bg-indigo-500 text-white flex items-center justify-center text-lg font-black shadow-sm">
                                            {student.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-[15px] text-slate-800 dark:text-white">{student.name}</p>
                                            <p className="text-[12px] font-bold text-slate-400 dark:text-slate-500 mt-0.5">{student.school || 'Unknown School'} • {student.gradeLevel || 'Unknown Grade'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
