'use client';

import { AlertTriangle, useEffect, useState, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import {
    X, Clock, ArrowRight, Check, CheckCircle,
    Bookmark, Calculator, BookOpen, ChevronDown, ChevronUp,
    LayoutGrid, Home, Maximize2, FileText, AlertCircle, Highlighter,
    CheckCircle2, XCircle, Minus, Trophy, BarChart2, ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useClassroomStore, seedOnce } from '@/store/classroomStore';
import { createClient } from '@/lib/supabase/client';
import {
    readStudentAssignmentProgress,
    StudentAssignmentOption,
    upsertStudentAssignmentSnapshot,
} from '@/lib/studentAssignmentProgress';
import DesmosCalculator from '@/components/DesmosCalculator';
import { ReferenceSheet } from '@/components/ReferenceSheet';
import { PassageRenderer } from '@/components/PassageRenderer';
import { LatexRenderer } from '@/components/LatexRenderer';
import { HighlightableText } from '@/components/HighlightableText';

// Seed synchronously — prevents blank page on first open
seedOnce();

const OPTION_LABELS: StudentAssignmentOption[] = ['A', 'B', 'C', 'D'];

export default function ClassroomAssignmentDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const searchParams = useSearchParams();
    const testId = searchParams.get('testId');

    const assignments = useClassroomStore(state => state.assignments);
    const students = useClassroomStore(state => state.students);
    const submitAssignmentProgress = useClassroomStore(state => state.submitAssignmentProgress);
    const seed = useClassroomStore(state => state.seed);
    useEffect(() => { seed(); }, [seed]);

    const [userId, setUserId] = useState<string | null>(null);
    useEffect(() => {
        const supabase = createClient();
        supabase.auth.getUser().then(({ data }) => {
            if (data?.user) {
                setUserId(data.user.id);
            }
        });
    }, []);

    const assignment = assignments.find((item) => item.id === id);
    const subject = assignment?.subject ?? 'English';
    const isMath = subject === 'Math';

    const [currentIdx, setCurrentIdx] = useState(0);
    const [answers, setAnswers] = useState<Record<string, StudentAssignmentOption>>({});
    const [eliminatedAnswers, setEliminatedAnswers] = useState<Record<string, StudentAssignmentOption[]>>({});
    const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});

    const [timeRemaining, setTimeRemaining] = useState(0);
    const [mode, setMode] = useState<'intro' | 'test' | 'review' | 'complete'>('intro');
    const [hasHydrated, setHasHydrated] = useState(false);
    const [fsWarningCountdown, setFsWarningCountdown] = useState<number | null>(null);
    const [isKickedOut, setIsKickedOut] = useState(false);
    const fsCountdownRef = useRef<NodeJS.Timeout | null>(null);

    // UI state — identical to practice test
    const [isTimerHidden, setIsTimerHidden] = useState(false);
    const [isHighlightActive, setIsHighlightActive] = useState(false);
    const [isDesmosOpen, setIsDesmosOpen] = useState(false);
    const [isReferenceOpen, setIsReferenceOpen] = useState(false);
    const [isDirectionsOpen, setIsDirectionsOpen] = useState(false);
    const [leftPanelWidth, setLeftPanelWidth] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const [isNavPanelOpen, setIsNavPanelOpen] = useState(false);
    const [isExitModalOpen, setIsExitModalOpen] = useState(false);
    const [isEliminationMode, setIsEliminationMode] = useState(false);
    const [calcMode, setCalcMode] = useState<'graphing' | 'scientific'>('graphing');
    const [highlights, setHighlights] = useState<Record<string, any[]>>({});
    const [defaultHighlightColor, setDefaultHighlightColor] = useState<string>('yellow');

    const addHighlight = (qId: string, h: any) => {
        setHighlights(prev => ({ ...prev, [qId]: [...(prev[qId] || []), h] }));
    };
    const updateHighlight = (qId: string, hId: string, updates: any) => {
        setHighlights(prev => ({
            ...prev,
            [qId]: (prev[qId] || []).map(h => h.id === hId ? { ...h, ...updates } : h)
        }));
    };
    const removeHighlight = (qId: string, hId: string) => {
        setHighlights(prev => ({
            ...prev,
            [qId]: (prev[qId] || []).filter(h => h.id !== hId)
        }));
    };

    const test = assignment?.customTests?.find((t) => t.id === testId);
    const questions = test?.questions || assignment?.questions || [];
    
    const totalQuestions = questions.length;
    const totalTimeSeconds = Math.max(5, assignment?.timeLimitMinutes ?? 60) * 60;

    // ── Hydration ─────────────────────────────────────────────────────────────

    useEffect(() => {
        if (!assignment) return;

        const progressMap = readStudentAssignmentProgress();
        const progressId = testId ? `${assignment.id}_${testId}` : assignment.id;
        const saved = progressMap[progressId];

        if (saved) {
            const safeIndex = Math.max(0, Math.min(saved.currentIndex ?? 0, Math.max(assignment.questions.length - 1, 0)));
            const safeTime = Math.max(0, Number(saved.timeRemaining) || totalTimeSeconds);
            setAnswers(saved.answers ?? {});
            setCurrentIdx(safeIndex);
            setTimeRemaining(safeTime);
            setMode(saved.completed ? 'review' : (saved.hasStarted ? 'test' : 'intro'));
            setHighlights(saved.highlights ?? {});
        } else {
            setAnswers({});
            setCurrentIdx(0);
            setTimeRemaining(totalTimeSeconds);
            setMode('intro');
            setHighlights({});
        }

        setHasHydrated(true);
    }, [assignment, totalTimeSeconds]);

    // ── Timer ────────────────────────────────────────────────────────────────

    useEffect(() => {
        if (mode !== 'test') return;

        const timer = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) { clearInterval(timer); setMode('complete'); return 0; }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [mode]);

    // ── Persist ──────────────────────────────────────────────────────────────

    useEffect(() => {
        if (!assignment || !hasHydrated || totalQuestions === 0) return;

        const progressId = testId ? `${assignment.id}_${testId}` : assignment.id;

        upsertStudentAssignmentSnapshot(progressId, {
            answers,
            currentIndex: currentIdx,
            completed: mode === 'complete' || mode === 'review',
            timeRemaining,
            hasStarted: mode === 'test' || mode === 'complete' || mode === 'review',
            updatedAt: new Date().toISOString(),
            highlights
        });

        // Trigger store & Supabase progress sync
        const currentStudent = students.find(s => 
            s.user_id === userId && 
            assignment.classroomIds.includes(s.classroomId)
        );
        const resolvedStudentId = currentStudent?.id || 'guest-student';
        const answeredCount = Object.keys(answers).length;
        const correctCount = questions.filter((q, idx) => answers[String(idx)] === q.answer).length;
        const isCompleted = mode === 'complete' || mode === 'review';

        if (resolvedStudentId !== 'guest-student') {
            submitAssignmentProgress(
                resolvedStudentId,
                assignment.id,
                answeredCount,
                correctCount,
                questions.length,
                isCompleted,
                testId ? {
                    [testId]: {
                        answered: answeredCount,
                        correct: correctCount,
                        completed: isCompleted
                    }
                } : undefined
            );
        }
    }, [assignment, hasHydrated, totalQuestions, answers, currentIdx, mode, timeRemaining, userId, students, submitAssignmentProgress, testId, questions]);

    // ── Drag divider ─────────────────────────────────────────────────────────

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;
            requestAnimationFrame(() => {
                const newWidth = (e.clientX / window.innerWidth) * 100;
                if (newWidth > 10 && newWidth < 90) setLeftPanelWidth(newWidth);
            });
        };
        const handleMouseUp = () => {
            setIsDragging(false);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    // ── Strict Mode Listener ──────────────────────────────────────────────────

    useEffect(() => {
        if (assignment?.allowExit !== false || mode !== 'test') return;

        // Enter fullscreen on mount
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
        }

        let lostComplianceAt: number | null = null;

        const checkCompliance = () => {
            const isCompliant = !!document.fullscreenElement;

            if (!isCompliant) {
                if (!fsCountdownRef.current) {
                    lostComplianceAt = Date.now();
                    setFsWarningCountdown(assignment.strictToleranceSeconds ?? 5);
                    fsCountdownRef.current = setInterval(() => {
                        if (!lostComplianceAt) return;
                        const elapsed = Math.floor((Date.now() - lostComplianceAt) / 1000);
                        const remaining = (assignment.strictToleranceSeconds ?? 5) - elapsed;

                        if (remaining <= 0) {
                            clearInterval(fsCountdownRef.current!);
                            fsCountdownRef.current = null;
                            setFsWarningCountdown(null);
                            setIsKickedOut(true);
                            setMode('complete'); // Force submission
                        } else {
                            setFsWarningCountdown(remaining);
                        }
                    }, 500);
                }
            } else {
                if (lostComplianceAt && (Date.now() - lostComplianceAt) >= ((assignment.strictToleranceSeconds ?? 5) * 1000)) {
                    if (fsCountdownRef.current) clearInterval(fsCountdownRef.current);
                    fsCountdownRef.current = null;
                    setFsWarningCountdown(null);
                    setIsKickedOut(true);
                    setMode('complete');
                    return;
                }

                if (fsCountdownRef.current) {
                    clearInterval(fsCountdownRef.current);
                    fsCountdownRef.current = null;
                    setFsWarningCountdown(null);
                    lostComplianceAt = null;
                }
            }
        };

        const interval = setInterval(checkCompliance, 500);
        
        // Also bind to events for immediate reaction
        document.addEventListener('fullscreenchange', checkCompliance);
        document.addEventListener('visibilitychange', checkCompliance);
        window.addEventListener('blur', checkCompliance);
        window.addEventListener('focus', checkCompliance);

        return () => {
            clearInterval(interval);
            if (fsCountdownRef.current) clearInterval(fsCountdownRef.current);
            document.removeEventListener('fullscreenchange', checkCompliance);
            document.removeEventListener('visibilitychange', checkCompliance);
            window.removeEventListener('blur', checkCompliance);
            window.removeEventListener('focus', checkCompliance);
        };
    }, [assignment?.allowExit, assignment?.strictToleranceSeconds, mode]);

    // ── Handlers ─────────────────────────────────────────────────────────────

    const startStrictAssignment = async () => {
        try {
            await document.documentElement.requestFullscreen();
            setMode('test');
        } catch (e) {
            alert('Full screen is required to start this assignment.');
        }
    };

    const handleSelectAnswer = (letter: string) => {
        if (mode === 'review') return;
        setAnswers(prev => ({ ...prev, [String(currentIdx)]: letter }));
    };

    const toggleElimination = (e: React.MouseEvent, letter: StudentAssignmentOption) => {
        e.stopPropagation();
        if (mode === 'review') return;
        setEliminatedAnswers(s => {
            const currentElim = s[currentIdx] || [];
            const isElim = currentElim.includes(letter);
            const nextElim = isElim ? currentElim.filter(l => l !== letter) : [...currentElim, letter];
            if (!isElim && answers[currentIdx] === letter) {
                const next = { ...answers };
                delete next[currentIdx];
                setAnswers(next);
            }
            return { ...s, [currentIdx]: nextElim };
        });
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
        } else {
            document.exitFullscreen?.();
        }
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    // ── Guards ────────────────────────────────────────────────────────────────

    // Show loading while hydrating — but never return null permanently
    if (!hasHydrated) {
        if (!assignment) {
            // Still waiting for store to populate — show spinner
            return (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
                    <div className="w-8 h-8 rounded-full border-[3px] border-slate-200 border-t-slate-800 animate-spin" />
                </div>
            );
        }
    }

    if (!assignment || questions.length === 0) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-200">
                <div className="text-center max-w-md mx-auto">
                    <h2 className="text-xl font-bold mb-3">Assignment Not Found</h2>
                    <p className="text-slate-500">This assignment or test could not be loaded.</p>
                </div>
            </div>
        );
    }

    // ── Intro screen ─────────────────────────────────────────────────────────

    if (mode === 'intro') {
        const sectionLabel = isMath ? 'Section 2: Math' : 'Section 1: English (Reading and Writing)';

        return (
            <div className="flex items-center justify-center bg-white p-8 fixed inset-0 z-50 fade-in">
                <div className="max-w-3xl w-full">
                    <h1 className="text-[2.15rem] font-bold text-slate-900 mb-8 pb-4 border-b border-slate-200">
                        {sectionLabel}
                        <span className="block text-[1.1rem] font-medium text-slate-500 mt-1">{test ? test.name : assignment.title}</span>
                    </h1>

                    <div className="space-y-8 mb-12">
                        <div className="flex gap-4">
                            <Clock className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="font-bold text-xl text-slate-900 mb-1">Timing</h3>
                                <p className="text-slate-600 leading-relaxed text-[17px]">
                                    You have {assignment.timeLimitMinutes} minutes to complete {questions.length} question{questions.length !== 1 ? 's' : ''}.
                                </p>
                            </div>
                        </div>

                        {isMath ? (
                            <div className="flex gap-4">
                                <Calculator className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-bold text-xl text-slate-900 mb-1">Calculator Available</h3>
                                    <p className="text-slate-600 leading-relaxed text-[17px]">
                                        A built-in graphing calculator is available during the assignment. You can also access the reference sheet for common formulas.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex gap-4">
                                <BookOpen className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-bold text-xl text-slate-900 mb-1">Passage-Based Questions</h3>
                                    <p className="text-slate-600 leading-relaxed text-[17px]">
                                        Read each passage carefully and choose the best answer based on evidence from the text.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-6 flex justify-end px-12 z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
                    <button
                        onClick={() => {
                            if (assignment.allowExit === false) {
                                startStrictAssignment();
                            } else {
                                setMode('test');
                            }
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-3 rounded-full font-bold text-lg transition-all shadow-lg shadow-blue-200 flex items-center gap-2"
                    >
                        Begin Assignment <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        );
    }

    // ── Complete screen ───────────────────────────────────────────────────────

    if (mode === 'complete') {
        return (
            <div className="flex items-center justify-center bg-white p-8 fixed inset-0 z-50 fade-in">
                <div className="max-w-md w-full text-center">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8">
                        <CheckCircle className="w-10 h-10 text-emerald-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">Assignment Complete</h2>
                    <p className="text-slate-500 mb-8 leading-relaxed text-[16px]">
                        Your answers have been saved and logged into the classroom.
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => router.push('/classroom')}
                            className="bg-white border-2 border-slate-200 text-slate-700 py-3.5 rounded-xl font-bold hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2"
                        >
                            <Home className="w-4 h-4" /> Classroom
                        </button>
                        <button
                            onClick={() => { setCurrentIdx(0); setMode('review'); }}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3.5 rounded-xl font-bold transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
                        >
                            <BookOpen className="w-4 h-4" /> Review Answers
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ── Review Interface ───────────────────────────────────────────────────────
    if (mode === 'review') {
        const totalQ = questions.length;
        const totalCorrect = questions.filter((q, idx) => answers[String(idx)] === q.answer).length;
        const totalWrong = totalQ - totalCorrect;
        const accuracyPct = totalQ > 0 ? Math.round((totalCorrect / totalQ) * 100) : 0;
        
        const dateString = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

        return (
            <div className="relative min-h-screen pt-4 pb-16 px-4 sm:px-6 lg:px-8 bg-slate-50 font-[system-ui,-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,sans-serif] overflow-y-auto absolute inset-0 z-50">
                <div className="mx-auto max-w-[1320px]">
                    <button onClick={() => router.push('/classroom')} className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-6 text-sm font-semibold">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Classroom
                    </button>

                    {/* Score Card */}
                    <div className="site-panel rounded-[32px] overflow-hidden mb-6 shadow-xl">
                        <div className="bg-[#111827] text-white p-8 sm:p-10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                                <Trophy className="w-64 h-64 rotate-12" />
                            </div>
                            <div className="relative z-10 flex flex-col sm:flex-row gap-8 items-center justify-between">
                                <div>
                                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">Assignment Review</h1>
                                    <p className="text-slate-400 font-medium text-lg">{test ? test.name : assignment.title} • {dateString}</p>
                                </div>
                                <div className="text-center bg-white/10 backdrop-blur-md rounded-3xl p-6 min-w-[200px] border border-white/10">
                                    <p className="text-slate-300 font-bold uppercase tracking-widest text-xs mb-2">Final Score</p>
                                    <div className="text-6xl font-black text-emerald-400 tracking-tighter">
                                        {accuracyPct}%
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Performance Summary */}
                    <div className="grid sm:grid-cols-3 gap-4 mb-6">
                        {[
                            { icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />, label: 'Correct', value: totalCorrect, color: '#10b981', bg: 'bg-emerald-500/10' },
                            { icon: <XCircle className="w-5 h-5 text-red-500" />, label: 'Incorrect', value: totalWrong, color: '#ef4444', bg: 'bg-red-500/10' },
                            { icon: <Trophy className="w-5 h-5 text-amber-500" />, label: 'Accuracy', value: `${accuracyPct}%`, color: '#f59e0b', bg: 'bg-amber-500/10' },
                        ].map(({ icon, label, value, bg }) => (
                            <div key={label} className="site-panel rounded-[22px] p-5 flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bg}`}>{icon}</div>
                                <div>
                                    <p className="text-[11px] font-bold uppercase tracking-widest site-text-muted">{label}</p>
                                    <p className="text-2xl font-black site-text-strong mt-0.5">{value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Question Review Details */}
                    <div className="site-panel rounded-[28px] p-6">
                        <h2 className="text-xl font-black site-text-strong mb-2">Question Breakdown</h2>
                        <p className="text-sm site-text-muted mb-6">Review your answers and the question details below.</p>
                        
                        <div className="space-y-8">
                            {questions.map((q, qIdx) => {
                                const ans = answers[String(qIdx)];
                                const isSPR = q.type === 'Math (SPR)';
                                const isCorrect = isSPR ? String(ans || '').trim() === String(q.answer || '').trim() : ans === q.answer;
                                
                                return (
                                    <div key={qIdx} className={`p-6 rounded-2xl border-2 ${isCorrect ? 'border-emerald-100 bg-emerald-50/30' : 'border-rose-100 bg-rose-50/30'}`}>
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${isCorrect ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                                                {qIdx + 1}
                                            </div>
                                            <span className={`font-black uppercase tracking-widest text-xs ${isCorrect ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                {isCorrect ? 'Correct' : 'Incorrect'}
                                            </span>
                                        </div>
                                        
                                        <div className="grid lg:grid-cols-2 gap-8">
                                            {/* Question Prompt */}
                                            <div className="bg-white rounded-xl p-5 border border-slate-200/60 shadow-sm">
                                                <div className="text-[13px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                                    Question {qIdx + 1} of {questions.length}
                                </div>
                                                {q.passage && (
                                                    <div className="mb-4 text-[15px] leading-relaxed text-slate-800">
                                                        <PassageRenderer text={q.passage} />
                                                    </div>
                                                )}
                                                <div className="text-[15px] font-medium leading-relaxed text-slate-900">
                                                    <LatexRenderer latex={q.prompt} />
                                                </div>
                                            </div>
                                            
                                            {/* Options or SPR Answer */}
                                            <div className="space-y-3">
                                                <h3 className="font-bold text-slate-400 text-xs uppercase tracking-wider mb-2 lg:mb-4">
                                                    {isSPR ? 'Your Answer' : 'Options'}
                                                </h3>
                                                {isSPR ? (
                                                    <div className={`p-4 rounded-xl border-2 flex flex-col gap-2 text-[15px] transition-all bg-white ${isCorrect ? 'border-emerald-500 bg-emerald-50/50' : 'border-rose-400 bg-rose-50/50'}`}>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-semibold text-slate-500">You answered:</span>
                                                            <span className={`font-mono font-bold ${isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>{ans || '(blank)'}</span>
                                                        </div>
                                                        {!isCorrect && (
                                                            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-200">
                                                                <span className="font-semibold text-slate-500">Correct answer:</span>
                                                                <span className="font-mono font-bold text-emerald-700">{q.answer}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    OPTION_LABELS.map((letter) => {
                                                        const optionContent = q.options[letter as keyof typeof q.options];
                                                        if (!optionContent) return null;
                                                        
                                                        const isThisOptionCorrect = letter === q.answer;
                                                        const isThisOptionSelected = letter === ans;
                                                        
                                                        let optionClass = "p-4 rounded-xl border-2 flex gap-4 text-[15px] transition-all bg-white ";
                                                        
                                                        if (isThisOptionCorrect) {
                                                            optionClass += "border-emerald-500 ring-1 ring-emerald-500 bg-emerald-50/50";
                                                        } else if (isThisOptionSelected && !isThisOptionCorrect) {
                                                            optionClass += "border-rose-400 bg-rose-50/50";
                                                        } else {
                                                            optionClass += "border-slate-200 opacity-60";
                                                        }

                                                        return (
                                                            <div key={letter} className={optionClass}>
                                                                <div className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center font-bold text-xs border-2 ${
                                                                    isThisOptionCorrect ? 'bg-emerald-500 border-emerald-500 text-white' :
                                                                    isThisOptionSelected ? 'bg-rose-500 border-rose-500 text-white' :
                                                                    'border-slate-300 text-slate-500'
                                                                }`}>
                                                                    {letter}
                                                                </div>
                                                                <div className={`leading-relaxed ${
                                                                    isThisOptionCorrect ? 'font-semibold text-emerald-900' :
                                                                    isThisOptionSelected ? 'font-semibold text-rose-900' :
                                                                    'text-slate-600'
                                                                }`}>
                                                                    <LatexRenderer latex={optionContent} />
                                                                </div>
                                                            </div>
                                                        );
                                                    })
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ── Test interface ───────────────────────────────────────────────

    const currentQuestion = questions[currentIdx];
    const isLastQuestion = currentIdx === questions.length - 1;
    const currentEliminations = eliminatedAnswers[currentIdx] || [];
    const hasPassage = !isMath && !!currentQuestion?.passage;
    const showLeftPane = hasPassage || (isMath && isDesmosOpen);

    return (
        <div className="h-[100dvh] flex flex-col bg-slate-50 font-['Verdana',_sans-serif] overflow-hidden fixed inset-0 z-50">
            {/* Strict Mode Fullscreen Warning */}
            {fsWarningCountdown !== null && mode === 'test' && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-red-900/90 backdrop-blur-md">
                    <div className="bg-white rounded-3xl p-10 max-w-lg w-full text-center shadow-2xl">
                        <AlertCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
                        <h2 className="text-3xl font-black text-slate-900 mb-4">Return to Fullscreen</h2>
                        <p className="text-lg text-slate-600 mb-8 font-medium">
                            This exam is in strict mode. You must remain in fullscreen at all times.
                            If you do not return to fullscreen, your exam will be automatically submitted in:
                        </p>
                        <div className="text-6xl font-black text-red-600 mb-8 font-mono">
                            {fsWarningCountdown}
                        </div>
                        <button
                            onClick={() => document.documentElement.requestFullscreen().catch(() => {})}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold text-lg px-8 py-4 rounded-full w-full transition-colors"
                        >
                            Click Here to Return to Fullscreen
                        </button>
                    </div>
                </div>
            )}

            {/* ── Header — matches practice test exactly ── */}
            <header className="bg-white/90 backdrop-blur-xl border-b border-slate-200/80 px-6 py-2.5 flex items-center justify-between z-30 shrink-0 relative shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                {/* Left: section label + directions */}
                <div className="flex-1">
                    <div className="flex flex-col ml-4">
                        <span className="font-bold text-[#111827] text-[15px] leading-snug">
                            {isMath ? 'Section 2, Module 1: Math' : 'Section 1, Module 1: Reading and Writing'}
                        </span>
                        <button
                            onClick={() => setIsDirectionsOpen(!isDirectionsOpen)}
                            className="flex items-center gap-1.5 text-[#374151] font-bold text-[13px] hover:bg-black/5 py-1 rounded transition-colors -ml-1 pl-1 w-fit pr-2"
                        >
                            Directions
                            <ChevronDown className={`w-[14px] h-[14px] transition-transform ${isDirectionsOpen ? 'rotate-180' : ''}`} />
                        </button>
                    </div>

                    {isDirectionsOpen && (
                        <div className="absolute top-[100%] left-4 w-[500px] bg-white border border-[#E5E7EB] shadow-[0_4px_20px_rgba(0,0,0,0.1)] rounded-b-lg p-5 z-50">
                            {isMath ? (
                                <p className="text-[16px] text-[#4B5563] leading-relaxed">
                                    The questions in this section cover algebra, advanced math, problem-solving, data analysis, and geometry. Some are multiple choice and some may require you to enter your answer. A calculator is available for every question.
                                </p>
                            ) : (
                                <>
                                    <p className="text-[16px] text-[#4B5563] leading-relaxed mb-4">
                                        The questions in this section address a number of important reading and writing skills. Each question includes one or more passages, which may include a table or graph. Read each passage and question carefully, and then choose the best answer to the question based on the passage(s).
                                    </p>
                                    <p className="text-[16px] text-[#4B5563] leading-relaxed">
                                        All questions in this section are multiple-choice with four answer choices. Each question has a single best answer.
                                    </p>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Center: Timer */}
                <div className="flex flex-col items-center justify-center flex-1 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[180px]">
                    {!isTimerHidden ? (
                        <div className="font-bold text-[17px] tracking-wide text-slate-800 flex items-center justify-center gap-2 bg-slate-100/80 backdrop-blur-sm px-5 py-1.5 rounded-full border border-slate-200 shadow-inner">
                            {formatTime(timeRemaining)}
                        </div>
                    ) : (
                        <div className="font-bold text-[22px] tracking-tight flex items-center justify-center gap-2 opacity-50 mb-1">
                            <Clock className="w-5 h-5 text-slate-400" />
                        </div>
                    )}
                    {mode !== 'review' && (
                        <button
                            onClick={() => setIsTimerHidden(!isTimerHidden)}
                            className="text-[11px] font-bold tracking-widest uppercase text-slate-500 hover:text-indigo-600 bg-transparent px-4 py-1.5 rounded-full transition-colors mt-0.5"
                        >
                            {isTimerHidden ? 'Show Timer' : 'Hide Timer'}
                        </button>
                    )}
                    {mode === 'review' && (
                        <span className="text-[11px] font-bold tracking-widest uppercase text-amber-600 bg-amber-50 px-3 py-1 rounded-full mt-0.5">Review</span>
                    )}
                </div>

                {/* Right Controls */}
                <div className="flex items-center justify-end flex-1 gap-2">
                    {mode === 'review' && (
                        <button
                            onClick={() => setMode('complete')}
                            className="text-sm font-bold text-white bg-slate-900 hover:bg-black px-4 py-2 rounded-full mr-1"
                        >
                            Exit Review
                        </button>
                    )}
                    {isMath && (
                        <>
                            <button
                                onClick={() => setIsDesmosOpen(!isDesmosOpen)}
                                className={`flex flex-col items-center justify-center gap-1.5 w-[80px] h-[64px] rounded-lg transition-colors border border-transparent ${isDesmosOpen ? 'bg-slate-200 text-slate-900 shadow-inner' : 'hover:bg-black/5 text-slate-700'}`}
                            >
                                <Calculator className="w-[24px] h-[24px]" />
                                <span className="font-bold text-[12px] leading-none">Calculator</span>
                            </button>
                            <button
                                onClick={() => setIsReferenceOpen(true)}
                                className="flex flex-col items-center justify-center gap-1.5 w-[80px] h-[64px] rounded-lg hover:bg-black/5 text-slate-700 transition-colors"
                            >
                                <FileText className="w-[24px] h-[24px]" />
                                <span className="font-bold text-[12px] leading-none">Reference</span>
                            </button>
                        </>
                    )}
                    {!isMath && (
                        <button
                            onClick={() => setIsHighlightActive(!isHighlightActive)}
                            className={`flex flex-col items-center justify-center gap-1.5 w-[80px] h-[64px] rounded-lg transition-colors border border-transparent ${isHighlightActive ? 'bg-slate-200 text-slate-900 shadow-inner' : 'hover:bg-black/5 text-slate-700'}`}
                        >
                            <Highlighter className="w-[24px] h-[24px]" />
                            <span className="font-bold text-[12px] leading-none">Highlight</span>
                        </button>
                    )}
                    {assignment.allowExit !== false && (
                        <button
                            onClick={toggleFullscreen}
                            className="flex flex-col items-center justify-center gap-1.5 w-[80px] h-[64px] rounded-lg hover:bg-black/5 text-slate-700 transition-colors"
                        >
                            <Maximize2 className="w-[24px] h-[24px]" />
                            <span className="font-bold text-[12px] leading-none">Fullscreen</span>
                        </button>
                    )}
                    {assignment.allowExit !== false && (
                        <button
                            onClick={() => router.push('/classroom')}
                            className="flex flex-col items-center justify-center gap-1.5 w-[80px] h-[64px] rounded-lg hover:bg-black/5 text-slate-700 transition-colors"
                        >
                            <div className="flex items-center justify-center w-6 h-6 bg-slate-800 rounded text-white">
                                <X className="w-3.5 h-3.5" />
                            </div>
                            <span className="font-bold text-[12px] leading-none">Save & Exit</span>
                        </button>
                    )}

                </div>
            </header>

            {/* ── Body ── */}
            <div className="flex-1 flex overflow-hidden relative">

                
                {/* ── Left Pane (Passage or Desmos) ── */}
                {isMath ? (
                    <div className={`overflow-hidden bg-[#FAFAFA] border-r border-[#E5E7EB] flex flex-col ${!isDragging ? 'transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]' : ''} ${isDesmosOpen ? '' : 'pointer-events-none'}`} style={{ width: isDesmosOpen ? `${leftPanelWidth}%` : '0%', opacity: isDesmosOpen ? 1 : 0 }}>
                        {/* Custom Calculator Header */}
                        <div className="h-[46px] bg-[#F9FAFB] border-b border-[#D1D5DB] flex items-center justify-between px-4 shrink-0 relative z-20">
                            <div className="w-[80px]">
                                <span className="font-bold text-[15px] text-[#111827]">Calculator</span>
                            </div>
                            <div className="flex bg-[#F3F4F6] rounded-[6px] p-[2px] border border-[#E5E7EB]">
                                <button
                                    onClick={() => setCalcMode('graphing')}
                                    className={`px-5 py-1 text-[13px] font-bold rounded-[4px] transition-colors ${calcMode === 'graphing' ? 'bg-[#111827] text-white shadow-sm' : 'text-[#6B7280] hover:text-[#374151]'}`}
                                >Graphing</button>
                                <button
                                    onClick={() => setCalcMode('scientific')}
                                    className={`px-5 py-1 text-[13px] font-bold rounded-[4px] transition-colors ${calcMode === 'scientific' ? 'bg-[#111827] text-white shadow-sm' : 'text-[#6B7280] hover:text-[#374151]'}`}
                                >Scientific</button>
                            </div>
                            <div className="w-[80px]"></div>
                        </div>
                        <DesmosCalculator mode={calcMode} isDragging={isDragging} />
                    </div>
                ) : (
                    <div className="overflow-y-auto p-4 lg:p-10 pr-4 lg:pr-6 flex justify-center bg-white border-r border-[#E5E7EB]" style={{ width: `${leftPanelWidth}%` }}>
                        <div className="w-full max-w-[800px] relative mt-2">
                            {/* English question: show image above passage in left pane only if no explicit imagePosition is set */}
                            {currentQuestion?.imageUrl && !isMath && (!currentQuestion?.imagePosition || currentQuestion?.imagePosition === 'before-stem') && (
                                <div className="mb-5 flex items-center justify-center">
                                    <img
                                        src={currentQuestion.imageUrl}
                                        alt="Question figure"
                                        className="max-w-full max-h-[400px] object-contain cursor-pointer hover:opacity-90 transition-opacity"
                                    />
                                </div>
                            )}
                            {currentQuestion?.passage ? (
                                <PassageRenderer
                                    text={currentQuestion.passage}
                                    highlights={highlights[`passage-${currentIdx}`] || []}
                                    onAddHighlight={(h) => addHighlight(`passage-${currentIdx}`, h)}
                                    onRemoveHighlight={(id) => removeHighlight(`passage-${currentIdx}`, id)}
                                    onUpdateHighlight={(id, updates) => updateHighlight(`passage-${currentIdx}`, id, updates)}
                                    isHighlightModeActive={isHighlightActive}
                                    defaultHighlightColor={defaultHighlightColor}
                                    onChangeDefaultColor={setDefaultHighlightColor}
                                />
                            ) : (
                                <div className="text-[17px] text-[#6B7280] leading-[1.8] font-serif italic text-center mt-20">
                                    No passage for this question.
                                </div>
                            )}
                            {currentQuestion?.imageUrl && !isMath && currentQuestion?.imagePosition === 'after-stem' && (
                                <div className="mt-5 flex items-center justify-center">
                                    <img
                                        src={currentQuestion.imageUrl}
                                        alt="Question figure"
                                        className="max-w-full max-h-[400px] object-contain cursor-pointer hover:opacity-90 transition-opacity"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ── Resizable Divider ── */}
                {((isMath && isDesmosOpen) || !isMath) && (
                    <div
                        onMouseDown={() => setIsDragging(true)}
                        className="w-[3px] bg-[#E5E7EB] hover:bg-[#D1D5DB] cursor-col-resize flex items-center justify-center flex-shrink-0 transition-colors z-20 relative group"
                    >
                        {/* The handle with triangles */}
                        <div className="h-[36px] w-[16px] bg-[#111827] rounded-[4px] flex items-center justify-center absolute left-1/2 -translate-x-1/2 pointer-events-none shadow-sm gap-[2px]">
                            <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-r-[4px] border-r-white"></div>
                            <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[4px] border-l-white"></div>
                        </div>
                    </div>
                )}
{/* ── Right pane: question + answers ── */}
                <div
                    className={`overflow-y-auto p-4 lg:p-10 pl-4 lg:pl-8 bg-white ${!isDragging && isMath ? 'transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]' : ''}`}
                    style={{ width: (isMath && !isDesmosOpen) ? '100%' : `${100 - leftPanelWidth}%` }}
                >
                    <div className="w-full max-w-[800px] mx-auto flex flex-col">
                        {/* Header: Connected Question Number & Mark for Review & ABC */}
                        <div className="flex items-center w-full h-[54px] mb-4 mt-2">
                            {/* Number - standalone rounded square */}
                            <div className="bg-[#111827] text-white font-bold text-[16px] w-[54px] h-[54px] rounded-[10px] flex-shrink-0 flex items-center justify-center relative z-10 shadow-sm">
                                {currentIdx + 1}
                            </div>

                            {/* Mark for Review - middle bar with top/bottom border connecting exactly to the squares */}
                            <button
                                onClick={() => setFlaggedQuestions(s => ({ ...s, [currentIdx]: !s[currentIdx] }))}
                                className="flex flex-1 items-center gap-2 px-6 h-[54px] text-[#4B5563] transition-colors justify-start bg-white border-t border-b border-[#D1D5DB] group/mfr hover:bg-slate-50 relative z-0 -mx-[12px]"
                            >
                                <Bookmark className={`w-[14px] h-[14px] transition-colors ${flaggedQuestions[currentIdx] ? 'fill-slate-600 text-slate-600' : 'text-slate-400 group-hover/mfr:text-slate-600'}`} />
                                <span className={flaggedQuestions[currentIdx] ? 'font-bold text-[14px]' : 'font-medium text-[14px] group-hover/mfr:font-bold'}>Mark for Review</span>
                            </button>

                            {/* ABC - standalone rounded square */}
                            <div className="w-[54px] h-[54px] flex-shrink-0 flex items-center justify-center rounded-[10px] border border-[#D1D5DB] bg-white relative z-10 shadow-sm">
                                <button
                                    onClick={() => setIsEliminationMode(!isEliminationMode)}
                                    className={`flex items-center justify-center w-full h-full font-bold text-[14px] transition-colors rounded-[10px] ${isEliminationMode ? 'bg-[#111827] text-white' : 'text-slate-700 hover:bg-slate-50'}`}
                                >
                                    <span className="line-through decoration-[#ef4444] decoration-[2px]">ABC</span>
                                </button>
                            </div>
                        </div>

                        {/* Question Content */}
                        <div className="text-[18px] text-[#111827] mb-6 leading-relaxed">
                            <div className="space-y-8">
                                {/* Image before stem */}
                                {questions[currentIdx]?.imageUrl && questions[currentIdx]?.imagePosition !== 'after-stem' && (
                                    <div className="w-full flex justify-center mb-6">
                                        <img src={questions[currentIdx].imageUrl} alt="Question figure" className="max-w-full h-auto rounded-lg shadow-sm border border-slate-200" />
                                    </div>
                                )}

                                <div className="text-[1.1rem] leading-relaxed text-slate-800 font-medium whitespace-pre-wrap">
                                    <HighlightableText
                                        text={questions[currentIdx]?.stem || ''}
                                        highlights={highlights[`stem-${currentIdx}`] || []}
                                        onAddHighlight={(h) => addHighlight(`stem-${currentIdx}`, h)}
                                        onRemoveHighlight={(id) => removeHighlight(`stem-${currentIdx}`, id)}
                                        onUpdateHighlight={(id, updates) => updateHighlight(`stem-${currentIdx}`, id, updates)}
                                        isHighlightModeActive={isHighlightActive}
                                        defaultHighlightColor={defaultHighlightColor}
                                        onChangeDefaultColor={setDefaultHighlightColor}
                                    />
                                </div>

                                {/* Image after stem */}
                                {questions[currentIdx]?.imageUrl && questions[currentIdx]?.imagePosition === 'after-stem' && (
                                    <div className="w-full flex justify-center mt-6 mb-6">
                                        <img src={questions[currentIdx].imageUrl} alt="Question figure" className="max-w-full h-auto rounded-lg shadow-sm border border-slate-200" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Answer Options */}
                        {/* Answer Options or SPR Input */}
                        <div className="space-y-2 w-full relative pl-[2px] pt-[2px]">
                            {questions[currentIdx]?.type === 'Math (SPR)' ? (
                                <div className="flex flex-col gap-2">
                                    <input
                                        type="text"
                                        id="spr-answer-input"
                                        value={typeof answers[String(currentIdx)] === 'string' ? answers[String(currentIdx)] as string : typeof answers[String(currentIdx)] === 'number' ? String(answers[String(currentIdx)]) : ''}
                                        onChange={(e) => handleSelectAnswer(e.target.value)}
                                        className="w-[280px] h-[52px] border-2 border-[#D1D5DB] rounded-[8px] px-4 text-[17px] font-mono font-bold text-[#111827] text-left focus:outline-none focus:border-[#111827] transition-colors bg-white"
                                        autoComplete="off"
                                        spellCheck={false}
                                        disabled={mode === 'review'}
                                        placeholder="Enter your answer"
                                    />
                                    {mode === 'review' && (
                                        <div className="mt-2 text-[15px] font-medium">
                                            {String(answers[String(currentIdx)] || '').trim() === String(questions[currentIdx]?.answer || '').trim() ? (
                                                <span className="text-emerald-600">Correct!</span>
                                            ) : (
                                                <span className="text-red-500">Incorrect. The correct answer is: {questions[currentIdx]?.answer}</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ) : OPTION_LABELS.map((letter) => {
                                const optText = (questions[currentIdx]?.options as any)?.[letter];
                                if (!optText) return null;

                                const isSelected = answers[String(currentIdx)] === letter;
                                const isEliminated = currentEliminations.includes(letter);
                                const isCorrectAnswer = mode === 'review' && currentQuestion.answer === letter;
                                const isWrongSelection = mode === 'review' && isSelected && !isCorrectAnswer;

                                // If review is allowed to show correct/wrong
                                let overrideBox = '';
                                if (isCorrectAnswer) overrideBox = 'border-emerald-500 bg-emerald-50/50';
                                if (isWrongSelection) overrideBox = 'border-red-400 bg-red-50/50';

                                return (
                                    <div key={letter} className="flex items-center gap-4 relative w-full group">
                                        <label
                                            onClick={(e) => {
                                                if (isEliminationMode) {
                                                    e.preventDefault();
                                                    toggleElimination(e, letter);
                                                }
                                            }}
                                            htmlFor={`opt-${letter}`}
                                            className={`relative w-full border h-auto min-h-[56px] rounded-[10px] flex items-stretch cursor-pointer transition-all duration-200 overflow-hidden ${isSelected ? 'border-[#111827] shadow-[inset_0_0_0_1px_#111827] z-10' : 'border-[#E5E7EB] hover:border-slate-400 shadow-sm'} ${overrideBox}`}
                                        >
                                            <input
                                                type="radio"
                                                name="answer"
                                                id={`opt-${letter}`}
                                                className="sr-only"
                                                checked={isSelected}
                                                onChange={() => {
                                                    if (!isEliminated) handleSelectAnswer(letter);
                                                }}
                                            />

                                            {/* Letter Box (Circular) */}
                                            <div className="w-[52px] flex-shrink-0 flex items-center justify-center bg-transparent">
                                                <div className={`w-[30px] h-[30px] rounded-full flex items-center justify-center font-bold text-[14px] border-[1.5px] transition-all ${isSelected ? 'border-[#111827] bg-[#111827] text-white shadow-md' : 'border-[#D1D5DB] text-[#4B5563] bg-white group-hover:border-[#9CA3AF] group-hover:text-[#111827]'}`}>
                                                    {letter}
                                                </div>
                                            </div>

                                            {/* Answer Text */}
                                            <div className="flex-1 px-3 py-3 flex items-center bg-transparent">
                                                <span className={`text-[16px] ${isEliminated ? 'text-slate-400' : 'text-[#111827]'}`}>
                                                    <HighlightableText
                                                        text={optText}
                                                        className=""
                                                        highlights={highlights[`opt-${currentIdx}-${letter}`] || []}
                                                        onAddHighlight={(h) => addHighlight(`opt-${currentIdx}-${letter}`, h)}
                                                        onRemoveHighlight={(id) => removeHighlight(`opt-${currentIdx}-${letter}`, id)}
                                                        onUpdateHighlight={(id, updates) => updateHighlight(`opt-${currentIdx}-${letter}`, id, updates)}
                                                        isHighlightModeActive={isHighlightActive}
                                                    />
                                                </span>
                                            </div>

                                            {isEliminated && (
                                                <div className="absolute top-1/2 left-0 w-full h-[1.5px] bg-slate-500 pointer-events-none -translate-y-[50%]"></div>
                                            )}
                                        </label>

                                        <div className="w-[50px] flex items-center justify-start flex-shrink-0">
                                            {isEliminationMode && (
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        toggleElimination(e, letter);
                                                    }}
                                                    className="flex items-center justify-center transition-colors z-20 group/btn"
                                                    title={isEliminated ? "Undo Elimination" : "Eliminate Option"}
                                                >
                                                    {isEliminated ? (
                                                        <span className="font-bluebook text-[14px] font-bold text-[#111827] underline decoration-[#111827] decoration-[1.5px] underline-offset-[3px] hover:text-slate-700">Undo</span>
                                                    ) : (
                                                        <div className="w-[28px] h-[28px] rounded-full border-[1px] border-slate-900 flex items-center justify-center relative bg-white transition-colors group-hover/btn:bg-slate-100 opacity-50 hover:opacity-100">
                                                            <span className="font-bold text-slate-900 text-[12px]">{letter}</span>
                                                            <div className="absolute w-[38px] h-[1.5px] bg-slate-900 rotate-0"></div>
                                                        </div>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}

                            
                            {/* Spacer to prevent Option D from touching footer due to flex overflow bugs */}
                            <div className="h-24 shrink-0 w-full"></div>
                        </div>
                    </div>
                </div>
                {isNavPanelOpen && (
                    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setIsNavPanelOpen(false)}>
                        <div
                            className="bg-white w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="border-b border-[#E5E7EB] p-6 flex justify-between items-center bg-[#F9FAFB]">
                                <h3 className="font-bold text-lg text-[#111827]">
                                    {isMath ? 'Section 2: Math' : 'Section 1: Reading and Writing'}
                                </h3>
                                <button onClick={() => setIsNavPanelOpen(false)} className="p-2 rounded-md hover:bg-[#E5E7EB] text-[#4B5563] transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-8 max-h-[60vh] overflow-y-auto">
                                <div className="mb-6 pb-6 border-b border-[#E5E7EB]">
                                    <div className="flex flex-wrap items-center gap-6 mb-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-dashed border-[#9CA3AF] rounded-sm"></div>
                                            <span className="text-[13px] font-bold text-[#4B5563]">Unanswered</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 bg-[#111827] rounded-sm"></div>
                                            <span className="text-[13px] font-bold text-[#4B5563]">Answered</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Bookmark className="w-[14px] h-[14px] fill-red-600 text-red-600" />
                                            <span className="text-[13px] font-bold text-[#4B5563]">For Review</span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
                                        <div className="bg-indigo-500 h-2 rounded-full transition-all duration-500" style={{ width: `${(Object.keys(answers).length / questions.length) * 100}%` }} />
                                    </div>
                                    <p className="text-sm font-bold text-slate-600 text-center">
                                        {Object.keys(answers).length} of {questions.length} Questions Answered
                                    </p>
                                </div>
                                <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-11 gap-4 gap-y-6 justify-items-center">
                                    {questions.map((_, idx) => {
                                        const isAnswered = answers[String(idx)] !== undefined;
                                        const isFlagged = flaggedQuestions[idx];
                                        const isActive = idx === currentIdx;

                                        let boxClass = 'cursor-pointer font-bold text-[15px] flex items-center justify-center relative transition-all w-10 h-10 ';

                                        if (isActive && isAnswered) {
                                            boxClass += 'border-[#2563EB] bg-[#111827] text-white shadow-[inset_0_0_0_2px_#2563EB]';
                                        } else if (isActive) {
                                            boxClass += 'border-[#2563EB] bg-[#EFF6FF] text-[#1E3A8A] shadow-[inset_0_0_0_2px_#2563EB]';
                                        } else if (isAnswered) {
                                            boxClass += 'bg-[#111827] text-white hover:bg-[#374151]';
                                        } else {
                                            boxClass += 'border-[1.5px] border-dashed border-[#9CA3AF] text-[#4B5563] bg-white hover:bg-slate-50';
                                        }

                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => {
                                                    setCurrentIdx(idx);
                                                    setIsNavPanelOpen(false);
                                                }}
                                                className={boxClass}
                                            >
                                                {idx + 1}
                                                {isFlagged && (
                                                    <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                                                        <Bookmark className="w-[12px] h-[12px] fill-red-600 text-red-600" />
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            
            {/* Premium Bottom Navigation Bar */}
            <footer className="bg-white/80 backdrop-blur-lg border-t border-slate-200/80 px-8 h-[76px] flex items-center justify-between shrink-0 z-40 shadow-[0_-2px_15px_rgba(0,0,0,0.03)]">
                <div className="w-48"></div>

                <div className="absolute left-1/2 -translate-x-1/2">
                    <button
                        onClick={() => setIsNavPanelOpen(true)}
                        className="flex items-center justify-center gap-2 px-6 h-[44px] rounded-[6px] font-bold text-white bg-[#222222] hover:bg-[#333333] transition-colors shadow-sm"
                    >
                        <span className="text-[15px] tracking-wide">Question {currentIdx + 1} of {questions.length}</span>
                        <ChevronUp className="w-[18px] h-[18px]" />
                    </button>
                </div>

                <div className="flex gap-4 w-48 justify-end">
                    <button
                        onClick={() => setCurrentIdx(p => Math.max(0, p - 1))}
                        disabled={currentIdx === 0}
                        className="bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 px-8 py-2.5 rounded-full font-bold text-[15px] transition-all disabled:opacity-40 disabled:hover:border-slate-200 disabled:cursor-not-allowed shadow-sm hover:shadow-md hover:bg-slate-50"
                    >
                        Back
                    </button>
                    {isLastQuestion ? (
                        <button
                            onClick={() => setMode('complete')}
                            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-9 py-2.5 rounded-full font-bold text-[15px] transition-all shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30 hover:scale-[1.02]"
                        >
                            Submit
                        </button>
                    ) : (
                        <button
                            onClick={() => setCurrentIdx(p => Math.min(questions.length - 1, p + 1))}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-9 py-2.5 rounded-full font-bold text-[15px] transition-all shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02]"
                        >
                            Next
                        </button>
                    )}
                </div>
            </footer>
{/* Reference sheet (Math only) */}
            {isReferenceOpen && (
                <ReferenceSheet isOpen={isReferenceOpen} onClose={() => setIsReferenceOpen(false)} />
            )}

            {/* Custom Exit Modal */}
            <AnimatePresence>
                {isExitModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                            onClick={() => setIsExitModalOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="relative w-full max-w-[420px] overflow-hidden rounded-[24px] bg-white shadow-[0_24px_50px_rgba(0,0,0,0.2)] p-7"
                        >
                            <h2 className="text-2xl font-black tracking-tight text-slate-800 mb-2">Save & Exit?</h2>
                            <p className="text-[14px] text-slate-500 mb-8 leading-6">
                                Your progress is automatically saved to your device. You can resume this session later from the dashboard.
                            </p>
                            <div className="flex items-center gap-3 justify-end">
                                <button
                                    onClick={() => setIsExitModalOpen(false)}
                                    className="px-5 py-2.5 rounded-full text-sm font-bold text-slate-600 hover:bg-slate-100 transition"
                                >
                                    Continue Testing
                                </button>
                                <button
                                    onClick={() => {
                                        setIsExitModalOpen(false);
                                        router.push('/classroom');
                                    }}
                                    className="px-6 py-2.5 rounded-full text-sm font-bold bg-[#111827] text-white hover:bg-slate-800 shadow-md transition"
                                >
                                    Save & Exit
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Strict Mode Warning Overlay */}
            <AnimatePresence>
                {fsWarningCountdown !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] bg-rose-600/95 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white rounded-3xl p-10 max-w-lg shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] flex flex-col items-center border border-rose-100"
                        >
                            <AlertCircle className="w-20 h-20 text-rose-500 mb-6 animate-pulse" />
                            <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Return to Full Screen</h2>
                            <p className="text-lg text-slate-600 mb-8 font-medium leading-relaxed">
                                You must remain in full screen to continue. Your assignment will automatically submit in:
                            </p>
                            <div className="text-[5rem] font-black text-rose-600 leading-none mb-10 tabular-nums drop-shadow-sm">
                                {fsWarningCountdown}
                            </div>
                            <button
                                onClick={async () => {
                                    try {
                                        await document.documentElement.requestFullscreen();
                                    } catch (e) {
                                        // Ignore
                                    }
                                }}
                                className="w-full bg-slate-900 text-white font-bold text-lg py-4 rounded-xl hover:bg-black transition-colors shadow-xl"
                            >
                                Enter Full Screen
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
