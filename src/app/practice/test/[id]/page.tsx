'use client';
import { useEffect, useState, use, useMemo, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { X, Clock, ArrowLeft, ArrowRight, Check, CheckCircle, Coffee, Trophy, Flag, BookOpen, ChevronDown, ChevronUp, Highlighter, Maximize2, MoreHorizontal, ArrowLeftCircle, Bookmark, LayoutGrid, FileText, Calculator, Home, BarChart3, LogOut, AlertCircle } from 'lucide-react';
import { useTestStore, Highlight } from '@/store/testStore';
import { useClassroomStore } from '@/store/classroomStore';
import { resolvePracticeTest } from '@/lib/practiceCatalog';
import { HighlightableText } from '@/components/HighlightableText';
import DesmosCalculator from '@/components/DesmosCalculator';
import { ReferenceSheet } from '@/components/ReferenceSheet';
import { cleanOCR, PassageRenderer } from '@/components/PassageRenderer';
import { MathText } from '@/components/MathText';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';

const ACTIVE_TEST_SESSION_KEY = 'targetprep_active_test';

type ActiveTestSession = {
    testId: number;
    moduleKey: string | null;
    currentSectionIndex: number;
    currentModuleIndex: number;
    currentQuestionIndex: number;
    userAnswers: Record<string, number | string>;
    flaggedQuestions: Record<string, boolean>;
    eliminatedAnswers: Record<string, number[]>;
    highlights: Record<string, Highlight[]>;
    timeRemaining: number;
    savedAt: string;
};

export default function TestInterfacePage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { id } = use(params);
    const testId = parseInt(id, 10);
    const moduleKey = searchParams.get('module');
    const resumeRequested = searchParams.get('resume') === '1';
    const isFullTest = !moduleKey;
    const mockId = searchParams.get('mockId');
    const mockSessions = useClassroomStore(state => state.mockSessions);
    const mockSession = mockSessions.find(s => s.id === mockId);
    const isStrictMode = !!mockSession?.strictMode;
    
    let test = resolvePracticeTest(testId, moduleKey);

    if (!test && mockId) {
        const session = mockSessions.find(s => s.id === mockId);
        if (session && session.customTests) {
            const customTest = session.customTests.find(t => t.id === id);
            if (customTest) {
                test = {
                    id: customTest.id as any,
                    title: customTest.name,
                    sections: [
                        {
                            name: 'Full Test',
                            modules: [
                                {
                                    timeMinutes: session.timeLimitMinutes || 120,
                                    questions: customTest.questions.map((q, idx) => ({
                                        id: q.id,
                                        question: q.question || q.text || q.stem || '',
                                        passage: q.passage || undefined,
                                        image: q.image || undefined,
                                        options: q.options,
                                        answer: q.answer,
                                        explanation: q.explanation || 'No explanation provided.',
                                        difficulty: 'Medium',
                                        skill: 'Custom',
                                        domain: 'Custom'
                                    }))
                                }
                            ]
                        }
                    ]
                } as any;
            }
        }
    }

    const {
        currentTestId, currentSectionIndex, currentModuleIndex, currentQuestionIndex,
        userAnswers, flaggedQuestions, eliminatedAnswers, highlights, timeRemaining, showResults, isTestActive, isIntroScreen,
        startTest, beginTimer, selectAnswer, toggleFlag, toggleElimination,
        addHighlight, removeHighlight, updateHighlight,
        nextQuestion, prevQuestion, setTimeRemaining, goToModule, endTest, resetTest
    } = useTestStore();

    const [transitionState, setTransitionState] = useState<'none' | 'englishIntro' | 'moduleEnd' | 'break' | 'mathIntro'>('none');
    const [breakTimeRemaining, setBreakTimeRemaining] = useState(600); // 10 minutes
    const [isReviewing, setIsReviewing] = useState(false);
    const isExternalReview = searchParams.get('review') === 'true';
    const reviewDateStr = searchParams.get('date');

    const externalReviewTestParam = useMemo(() => {
        if (!isExternalReview) return null;
        const state = useTestStore.getState();
        const tests = state.completedTests.filter(t => t.testId === Number(id));
        if (reviewDateStr) {
            const match = tests.find(t => t.date === reviewDateStr);
            if (match) return match;
        }
        return tests[tests.length - 1] || null;
    }, [isExternalReview, id, reviewDateStr]);
    const [isTimerHidden, setIsTimerHidden] = useState(false);
    const [isDirectionsOpen, setIsDirectionsOpen] = useState(false);
    const [isEliminationMode, setIsEliminationMode] = useState(false);
    const [isHighlightActive, setIsHighlightActive] = useState(false);
    const [leftPanelWidth, setLeftPanelWidth] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const [isNavPanelOpen, setIsNavPanelOpen] = useState(false);
    const [showCheckWork, setShowCheckWork] = useState(false);
    const [isDesmosOpen, setIsDesmosOpen] = useState(false);
    const [isReferenceOpen, setIsReferenceOpen] = useState(false);
    const [calcMode, setCalcMode] = useState<'graphing' | 'scientific'>('graphing');
    const [hasInitialized, setHasInitialized] = useState(false);
    const [isExitModalOpen, setIsExitModalOpen] = useState(false);
    const [fsWarningCountdown, setFsWarningCountdown] = useState<number | null>(null);
    const [isKickedOut, setIsKickedOut] = useState(false);
    const [isExiting, setIsExiting] = useState(false);
    const fsCountdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const [expandedImage, setExpandedImage] = useState<string | null>(null);

    const clearActiveSession = () => {
        if (typeof window === 'undefined') return;
        window.localStorage.removeItem(ACTIVE_TEST_SESSION_KEY);
    };

    const readActiveSession = (): ActiveTestSession | null => {
        if (typeof window === 'undefined') return null;
        try {
            const raw = window.localStorage.getItem(ACTIVE_TEST_SESSION_KEY);
            if (!raw) return null;
            const parsed = JSON.parse(raw) as Partial<ActiveTestSession>;
            if (typeof parsed.testId !== 'number') return null;
            return {
                testId: parsed.testId,
                moduleKey: parsed.moduleKey ?? null,
                currentSectionIndex: parsed.currentSectionIndex ?? 0,
                currentModuleIndex: parsed.currentModuleIndex ?? 0,
                currentQuestionIndex: parsed.currentQuestionIndex ?? 0,
                userAnswers: parsed.userAnswers ?? {},
                flaggedQuestions: parsed.flaggedQuestions ?? {},
                eliminatedAnswers: parsed.eliminatedAnswers ?? {},
                highlights: parsed.highlights ?? {},
                timeRemaining: parsed.timeRemaining ?? 0,
                savedAt: parsed.savedAt ?? new Date().toISOString(),
            };
        } catch {
            return null;
        }
    };

    const persistActiveSession = () => {
        if (typeof window === 'undefined') return;

        const snapshot: ActiveTestSession = {
            testId,
            moduleKey: moduleKey ?? null,
            currentSectionIndex,
            currentModuleIndex,
            currentQuestionIndex,
            userAnswers,
            flaggedQuestions,
            eliminatedAnswers,
            highlights,
            timeRemaining,
            savedAt: new Date().toISOString(),
        };

        window.localStorage.setItem(ACTIVE_TEST_SESSION_KEY, JSON.stringify(snapshot));
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => console.log(err));
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;
            // Native DOM event prevents React re-render lag queueing
            requestAnimationFrame(() => {
                const newWidth = (e.clientX / window.innerWidth) * 100;
                if (newWidth > 10 && newWidth < 90) setLeftPanelWidth(newWidth);
            });
        };

        const handleMouseUp = () => setIsDragging(false);

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    // ─── Strict Mode Fullscreen Enforcement ──────────────────────────────────────
    useEffect(() => {
        if (!isStrictMode || !isTestActive) return;

        // Enter fullscreen on mount
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
        }

        let lostComplianceAt: number | null = null;

        const checkCompliance = () => {
            const isCompliant = !!document.fullscreenElement && !document.hidden && document.hasFocus();

            if (!isCompliant) {
                // Out of compliance
                if (!fsCountdownRef.current) {
                    lostComplianceAt = Date.now();
                    setFsWarningCountdown(5);
                    fsCountdownRef.current = setInterval(() => {
                        if (!lostComplianceAt) return;
                        const elapsed = Math.floor((Date.now() - lostComplianceAt) / 1000);
                        const remaining = 5 - elapsed;

                        if (remaining <= 0) {
                            clearInterval(fsCountdownRef.current!);
                            fsCountdownRef.current = null;
                            setFsWarningCountdown(null);
                            setIsKickedOut(true);
                            finishTest(true);
                        } else {
                            setFsWarningCountdown(remaining);
                        }
                    }, 500); // Check every 500ms so it updates snappily even if throttled
                }
            } else {
                // Returned to compliance
                // First check if they were out of compliance for more than 5 seconds while backgrounded
                if (lostComplianceAt && (Date.now() - lostComplianceAt) >= 5000) {
                    if (fsCountdownRef.current) clearInterval(fsCountdownRef.current);
                    fsCountdownRef.current = null;
                    setFsWarningCountdown(null);
                    setIsKickedOut(true);
                    finishTest(true);
                    return;
                }

                // If they made it back in time, cancel the warning
                if (fsCountdownRef.current) {
                    clearInterval(fsCountdownRef.current);
                    fsCountdownRef.current = null;
                }
                setFsWarningCountdown(null);
                lostComplianceAt = null;
            }
        };

        document.addEventListener('fullscreenchange', checkCompliance);
        document.addEventListener('visibilitychange', checkCompliance);
        window.addEventListener('blur', checkCompliance);
        window.addEventListener('focus', checkCompliance);
        
        // Initial check just in case
        checkCompliance();

        return () => {
            document.removeEventListener('fullscreenchange', checkCompliance);
            document.removeEventListener('visibilitychange', checkCompliance);
            window.removeEventListener('blur', checkCompliance);
            window.removeEventListener('focus', checkCompliance);
            if (fsCountdownRef.current) clearInterval(fsCountdownRef.current);
        };
    }, [isStrictMode, isTestActive, endTest]);

    const students = useClassroomStore(state => state.students);
    const studentIdStr = searchParams.get('studentId');
    // Use a ref to skip the very first render (students not yet loaded)
    const kickCheckMountedRef = useRef(false);
    
    useEffect(() => {
        if (!mockId || !studentIdStr || isKickedOut) return;
        // Skip kick check on first mount — store is still hydrating
        if (!kickCheckMountedRef.current) {
            kickCheckMountedRef.current = true;
            return;
        }
        const student = students.find(s => s.id === studentIdStr);
        if (!student || student.mockSessionId !== mockId) {
            clearActiveSession();
            setIsKickedOut(true);
        }
    }, [students, mockId, studentIdStr, isKickedOut]);

    useEffect(() => {
        if (!test || hasInitialized) return;

        const saved = readActiveSession();
        if (saved && saved.testId === testId && (saved.moduleKey ?? null) === (moduleKey ?? null)) {
            const section = test.sections[saved.currentSectionIndex] ?? test.sections[0];
            const module = section?.modules[saved.currentModuleIndex] ?? section?.modules[0];
            const maxQuestionIndex = Math.max((module?.questions.length ?? 1) - 1, 0);

            useTestStore.setState({
                currentTestId: testId,
                currentSectionIndex: Math.max(0, Math.min(saved.currentSectionIndex, test.sections.length - 1)),
                currentModuleIndex: Math.max(0, Math.min(saved.currentModuleIndex, (section?.modules.length ?? 1) - 1)),
                currentQuestionIndex: Math.max(0, Math.min(saved.currentQuestionIndex, maxQuestionIndex)),
                userAnswers: saved.userAnswers,
                flaggedQuestions: saved.flaggedQuestions,
                eliminatedAnswers: saved.eliminatedAnswers,
                highlights: saved.highlights,
                timeRemaining: saved.timeRemaining > 0 ? saved.timeRemaining : (module?.timeMinutes ?? 1) * 60,
                isIntroScreen: false,
                isTestActive: true,
                showResults: false,
            });
            setHasInitialized(true);
            return;
        }

        useTestStore.setState({
            currentTestId: testId,
            currentSectionIndex: 0,
            currentModuleIndex: 0,
            currentQuestionIndex: 0,
            userAnswers: {},
            flaggedQuestions: {},
            eliminatedAnswers: {},
            highlights: {},
            timeRemaining: (test.sections[0]?.modules[0]?.timeMinutes ?? 1) * 60,
            isIntroScreen: isFullTest,
            isTestActive: !isFullTest,
            showResults: false,
        });
        setHasInitialized(true);
    }, [test, hasInitialized, resumeRequested, testId, moduleKey, isFullTest]);

    useEffect(() => {
        if (currentTestId === testId && test && !isTestActive && !showResults && !isIntroScreen && transitionState === 'none') {
            beginTimer();
            setTimeRemaining(test.sections[0].modules[0].timeMinutes * 60);
        }
    }, [currentTestId, testId, test, isTestActive, isIntroScreen, showResults, transitionState, beginTimer, setTimeRemaining]);

    useEffect(() => {
        if (transitionState !== 'none' || showResults || !test) return;

        const timer = setInterval(() => {
            useTestStore.setState((s) => {
                if (s.timeRemaining <= 1) {
                    handleNext();
                    return { timeRemaining: 0 };
                }
                return { timeRemaining: s.timeRemaining - 1 };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [transitionState, showResults, currentModuleIndex, currentSectionIndex, test]);

    // Break countdown timer
    useEffect(() => {
        if (transitionState !== 'break') return;
        const timer = setInterval(() => {
            setBreakTimeRemaining(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [transitionState]);

    useEffect(() => {
        if (!hasInitialized || !isFullTest || currentTestId !== testId) return;

        if (showResults) {
            clearActiveSession();
            return;
        }

        const shouldPersistSession =
            isIntroScreen || isTestActive || transitionState !== 'none' || showCheckWork;

        if (!shouldPersistSession) return;

        persistActiveSession();
    }, [
        hasInitialized,
        isFullTest,
        showResults,
        isIntroScreen,
        isTestActive,
        transitionState,
        showCheckWork,
        testId,
        currentTestId,
        moduleKey,
        currentSectionIndex,
        currentModuleIndex,
        currentQuestionIndex,
        userAnswers,
        flaggedQuestions,
        eliminatedAnswers,
        highlights,
        timeRemaining,
    ]);

    if (isExiting) {
        return (
            <div className="h-full flex items-center justify-center bg-slate-50 fixed inset-0 z-[9999]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 rounded-full border-[3px] border-slate-200 border-t-blue-600 animate-spin"></div>
                    <p className="text-slate-500 font-medium animate-pulse">Loading...</p>
                </div>
            </div>
        );
    }

    if (!test) return <div className="p-8 text-slate-800">Test not found</div>;

    const currentSection = test.sections[currentSectionIndex];
    const currentModule = currentSection?.modules[currentModuleIndex];
    const currentQuestion = currentModule?.questions[currentQuestionIndex];
    const totalQuestions = currentModule?.questions.length || 0;

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleNext = () => {
        if (showCheckWork) {
            setShowCheckWork(false);
            if (currentModuleIndex < currentSection.modules.length - 1) {
                setTransitionState('moduleEnd');
            } else if (currentSectionIndex < test.sections.length - 1) {
                setBreakTimeRemaining(600);
                setTransitionState('break');
            } else {
                finishTest(false);
            }
            return;
        }

        if (currentQuestionIndex < totalQuestions - 1) {
            nextQuestion();
        } else {
            setShowCheckWork(true);
        }
    };

    const startNextPart = () => {
        if (transitionState === 'moduleEnd') {
            goToModule(currentSectionIndex, currentModuleIndex + 1);
            setTimeRemaining(test.sections[currentSectionIndex].modules[currentModuleIndex + 1].timeMinutes * 60);
            setTransitionState('none');
            setShowCheckWork(false);
        } else if (transitionState === 'break') {
            setTransitionState('mathIntro');
        } else if (transitionState === 'mathIntro') {
            goToModule(currentSectionIndex + 1, 0);
            setTimeRemaining(test.sections[currentSectionIndex + 1].modules[0].timeMinutes * 60);
            setTransitionState('none');
            setShowCheckWork(false);
        }
    };

    const finishTest = (kickedOut: boolean = false) => {
        let englishCorrect = 0, mathCorrect = 0, englishTotal = 0, mathTotal = 0;
        test.sections.forEach((sec, sIdx) => {
            sec.modules.forEach((mod, mIdx) => {
                mod.questions.forEach((q, qIdx) => {
                    const key = `${sIdx}-${mIdx}-${qIdx}`;
                    const isCorrect = userAnswers[key] === q.answer;
                    if (sec.name === 'Math') {
                        mathTotal++;
                        if (isCorrect) mathCorrect++;
                    } else {
                        englishTotal++;
                        if (isCorrect) englishCorrect++;
                    }
                });
            });
        });

        const engRaw = englishTotal ? 200 + (englishCorrect / englishTotal) * 600 : 200;
        const mthRaw = mathTotal ? 200 + (mathCorrect / mathTotal) * 600 : 200;
        
        const engScore = Math.round(engRaw / 10) * 10;
        const mthScore = Math.round(mthRaw / 10) * 10;
        const totalScore = engScore + mthScore;

        const mockId = searchParams.get('mockId');
        const studentId = searchParams.get('studentId');

        if (mockId && studentId) {
            import('@/store/classroomStore').then(({ useClassroomStore }) => {
                useClassroomStore.getState().submitMockResult({
                    mockId,
                    studentId,
                    assignedTestId: String(test.id),
                    score: totalScore,
                    englishScore: engScore,
                    mathScore: mthScore,
                    totalCorrect: englishCorrect + mathCorrect,
                    totalQuestions: englishTotal + mathTotal,
                    answers: userAnswers,
                    kickedOut,
                });
            });
        }

        endTest({
            testId: test.id,
            testTitle: test.title,
            date: new Date().toISOString(),
            englishScore: engScore,
            mathScore: mthScore,
            totalScore,
            totalCorrect: englishCorrect + mathCorrect,
            totalQuestions: englishTotal + mathTotal,
            answers: userAnswers,
            eliminated: eliminatedAnswers,
        });
    };

    const questionKey = `${currentSectionIndex}-${currentModuleIndex}-${currentQuestionIndex}`;
    const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
    const isFinalStep = currentModuleIndex === currentSection?.modules.length - 1 && currentSectionIndex === test.sections.length - 1;

    if (showResults || isExternalReview) {
        const r = isExternalReview ? externalReviewTestParam : useTestStore.getState().completedTests.slice(-1)[0];

        if (!r) {
            return (
                <div className="h-full flex items-center justify-center p-8">
                    <p className="text-slate-500 font-medium">Test attempt not found.</p>
                    <button onClick={() => router.push('/progress')} className="ml-4 text-blue-600 underline">Go Back</button>
                </div>
            );
        }

        if (isReviewing || isExternalReview) {
            return (
                <div className="h-full flex flex-col bg-[#fafafa]">
                    {/* Modal for expanded image */}
                    {expandedImage && (
                        <div 
                            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-8 cursor-pointer"
                            onClick={() => setExpandedImage(null)}
                        >
                            <div className="relative max-w-5xl w-full max-h-full flex items-center justify-center cursor-default" onClick={e => e.stopPropagation()}>
                                <button 
                                    onClick={() => setExpandedImage(null)}
                                    className="absolute -top-12 right-0 md:-right-12 md:top-0 w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-800 hover:bg-slate-200 transition-colors z-[100] shadow-lg border border-slate-200"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                                <img 
                                    src={expandedImage} 
                                    alt="Expanded question figure" 
                                    className="max-w-full max-h-[85vh] object-contain bg-white rounded-xl shadow-2xl p-4"
                                />
                            </div>
                        </div>
                    )}
                    <header className="bg-white border-b border-black/5 px-6 sm:px-10 py-4 flex items-center justify-between shadow-sm sticky top-0 z-20">
                        <div className="flex items-center gap-4">
                            <button onClick={() => {
                                if (isExternalReview) { setIsExiting(true); router.push('/progress'); }
                                else setIsReviewing(false);
                            }} className="text-slate-500 hover:text-slate-900 flex items-center gap-2 font-medium bg-slate-50 px-3 py-1.5 rounded-md transition-colors">
                                <ArrowLeft className="w-4 h-4" /> Back
                            </button>
                            <h2 className="font-bold text-slate-900 text-lg">Test Review</h2>
                        </div>
                    </header>
                    <main className="flex-1 overflow-y-auto p-4 sm:p-8">
                        <div className="max-w-4xl mx-auto space-y-12 pb-24">
                            {test.sections.map((sec, sIdx) => (
                                <div key={sIdx} className="space-y-8">
                                    <h3 className="text-2xl font-bold border-b border-slate-200 pb-2 text-slate-800">{sec.name}</h3>
                                    {sec.modules.map((mod, mIdx) => (
                                        <div key={mIdx} className="space-y-6">
                                            <h4 className="text-lg font-semibold text-slate-600 bg-slate-100 px-4 py-2 rounded-md">Module {mIdx + 1}</h4>
                                            {mod.questions.map((q, qIdx) => {
                                                const key = `${sIdx}-${mIdx}-${qIdx}`;
                                                const userAnswer = r.answers[key];
                                                const isCorrect = userAnswer === q.answer;
                                                const isOmitted = userAnswer === undefined;

                                                return (
                                                    <div key={q.id} className={`bg-white rounded-2xl border-2 p-6 sm:p-8 shadow-sm ${isCorrect ? 'border-emerald-100' : 'border-red-100'}`}>
                                                        <div className="flex justify-between items-start mb-4">
                                                            <div className="flex items-center gap-3">
                                                                <span className="bg-slate-100 text-slate-600 font-bold px-3 py-1 rounded-md text-sm">Question {qIdx + 1}</span>
                                                                {isCorrect ? (
                                                                    <span className="flex items-center gap-1 text-emerald-600 font-bold text-sm bg-emerald-50 px-2 py-1 rounded-md"><Check className="w-4 h-4" /> Correct</span>
                                                                ) : isOmitted ? (
                                                                    <span className="flex items-center gap-1 text-red-600 font-bold text-sm bg-red-50 px-2 py-1 rounded-md"><X className="w-4 h-4" /> Omitted</span>
                                                                ) : (
                                                                    <span className="flex items-center gap-1 text-red-600 font-bold text-sm bg-red-50 px-2 py-1 rounded-md"><X className="w-4 h-4" /> Incorrect</span>
                                                                )}
                                                            </div>
                                                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{q.difficulty}</span>
                                                        </div>

                                                        {q.passage && (
                                                            <div className="mb-6 p-5 bg-slate-50 border-l-4 border-slate-300 text-slate-700 italic">
                                                                {q.passage}
                                                            </div>
                                                        )}
                                                        {q.image && (
                                                            <div className="mb-6 border border-slate-200 rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center p-4">
                                                                <img 
                                                                    src={q.image} 
                                                                    alt="Question figure" 
                                                                    className="max-w-full max-h-[250px] object-contain cursor-pointer hover:opacity-90 transition-opacity" 
                                                                    onClick={() => setExpandedImage(q.image || null)}
                                                                />
                                                            </div>
                                                        )}
                                                        <h4 className="text-lg font-medium text-slate-900 mb-6">{cleanOCR(q.question || '')}</h4>

                                                        <div className="space-y-3 mb-6">
                                                            {q.options.map((opt, oIdx) => {
                                                                const isThisCorrect = oIdx === q.answer;
                                                                const isThisSelected = oIdx === userAnswer;
                                                                let bgClass = "bg-white border-slate-200 text-slate-600";

                                                                if (isThisCorrect) {
                                                                    bgClass = "bg-emerald-50 border-emerald-500 text-emerald-900 shadow-[0_0_10px_rgba(16,185,129,0.1)]";
                                                                } else if (isThisSelected || isOmitted) {
                                                                    bgClass = "bg-red-50 border-red-400 text-red-900";
                                                                }

                                                                return (
                                                                    <div key={oIdx} className={`p-4 border-2 rounded-xl flex items-center gap-4 ${bgClass}`}>
                                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border ${isThisCorrect ? 'bg-emerald-500 border-emerald-600 text-white' : isThisSelected ? 'bg-red-500 border-red-600 text-white' : 'bg-slate-100 border-slate-300'}`}>
                                                                            {String.fromCharCode(65 + oIdx)}
                                                                        </div>
                                                                        <span className="font-medium">{cleanOCR(opt || '')}</span>
                                                                        {isThisCorrect && (
                                                                            <span className="ml-auto flex items-center gap-1 text-emerald-600 text-sm font-bold">
                                                                                <Check className="w-5 h-5" /> {isCorrect ? '' : 'Correct Answer'}
                                                                            </span>
                                                                        )}
                                                                        {(isThisSelected || (isOmitted && !isThisCorrect)) && <X className="ml-auto text-red-500 w-5 h-5" />}
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>

                                                        <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5">
                                                            <h5 className="flex items-center gap-2 text-blue-800 font-bold mb-2">
                                                                <BookOpen className="w-4 h-4" /> Explanation
                                                            </h5>
                                                            <p className="text-blue-900/80 leading-relaxed text-sm">{cleanOCR(q.explanation || '')}</p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </main>
                </div>
            );
        }

        return (
            <div className="flex items-center justify-center bg-white p-8 fade-in fixed inset-0 z-50">
                <div className="max-w-md w-full text-center">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8">
                        <CheckCircle className="w-10 h-10 text-emerald-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Your {searchParams.get('mockId') ? 'Mock' : 'Practice'} Test Is Complete</h2>
                    <p className="text-slate-500 mb-4 leading-relaxed text-[16px]">Congratulations! You have finished all sections of this {searchParams.get('mockId') ? 'mock' : 'practice'} test. Your answers have been saved.</p>
                    <p className="text-slate-500 mb-10 leading-relaxed text-[16px]">
                        {searchParams.get('mockId') ? (
                            <>To view your score and rank, head to your <strong className="text-slate-700">Mock History</strong> page.</>
                        ) : (
                            <>To view your estimated score, score breakdown, and detailed answer explanations, head to your <strong className="text-slate-700">Progress</strong> page.</>
                        )}
                    </p>

                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => { setIsExiting(true); router.push('/dashboard'); setTimeout(() => resetTest(), 500); }} className="bg-white border-2 border-slate-200 text-slate-700 py-3.5 rounded-xl font-bold hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2">
                                <Home className="w-4 h-4" /> Home
                            </button>
                            <button onClick={() => { setIsExiting(true); router.push(searchParams.get('mockId') ? '/dashboard/mocks?tab=completed' : '/progress'); setTimeout(() => resetTest(), 500); }} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3.5 rounded-xl font-bold transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2">
                                <BarChart3 className="w-4 h-4" /> {searchParams.get('mockId') ? 'Mock History' : 'Progress'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (isIntroScreen && !isExternalReview) {
        return (
            <div className="flex items-center justify-center bg-white p-8 fade-in fixed inset-0 z-50">
                <div className="max-w-3xl w-full">
                    <h1 className="text-[2.15rem] font-bold text-slate-900 mb-8 pb-4 border-b border-slate-200">
                        {mockId ? 'Target Prep Mock Exam' : 'Target Prep Full-length Practice Test'}
                    </h1>

                    <div className="space-y-8 mb-12">
                        <div className="flex gap-4">
                            <Clock className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="font-bold text-xl text-slate-900 mb-1">Timing</h3>
                                <p className="text-slate-600 leading-relaxed text-[17px]">
                                    {mockId ? 'Mock exams are strictly timed. Make sure you complete the sections before the time runs out.' : 'Practice tests are timed, but you can exit at any time and your answers and remaining time will be saved.'}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <Trophy className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="font-bold text-xl text-slate-900 mb-1">Scores</h3>
                                <p className="text-slate-600 leading-relaxed text-[17px]">
                                    {mockId ? 'When you finish the mock exam, your score will be sent to your instructor.' : 'When you finish the practice test, you will be taken to the results page to see your estimated score.'}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <BookOpen className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="font-bold text-xl text-slate-900 mb-1">No Device Lock</h3>
                                <p className="text-slate-600 leading-relaxed text-[17px]">
                                    {mockId ? 'During the mock exam, do not leave the browser or open other applications. Stay focused on the test.' : 'We don\'t lock your device during practice. On test day, you\'ll be blocked from using other programs or apps.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-6 flex justify-end px-12 z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
                    <button
                        onClick={() => {
                            useTestStore.setState({ isIntroScreen: false, isTestActive: false });
                            setTransitionState('englishIntro');
                            setShowCheckWork(false);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-3 rounded-full font-bold text-lg transition-all shadow-lg shadow-blue-200 flex items-center gap-2"
                    >
                        Start Test <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        );
    }

    if (transitionState !== 'none') {
        if (transitionState === 'englishIntro') {
            const firstSection = test.sections[0];
            const firstModuleTime = firstSection?.modules[0]?.timeMinutes || 32;
            const firstModuleQCount = firstSection?.modules[0]?.questions.length || 27;

            return (
                <div className="flex items-center justify-center bg-white p-8 fade-in fixed inset-0 z-50">
                    <div className="max-w-3xl w-full">
                        <h1 className="text-3xl font-bold text-slate-900 mb-8 pb-4 border-b border-slate-200">
                            Section 1: English (Reading and Writing)
                        </h1>

                        <div className="space-y-8 mb-12">
                            <div className="flex gap-4">
                                <BookOpen className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900 mb-1">Passage-Based Questions</h3>
                                    <p className="text-slate-600 leading-relaxed text-[17px]">
                                        Read each short passage carefully and choose the best answer based on evidence from the text.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Clock className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900 mb-1">Timing</h3>
                                    <p className="text-slate-600 leading-relaxed text-[17px]">
                                        Module 1 has {firstModuleQCount} questions and is {firstModuleTime} minutes long. A second adaptive module follows.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Flag className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900 mb-1">Test Tools</h3>
                                    <p className="text-slate-600 leading-relaxed text-[17px]">
                                        You can mark questions for review and highlight text while you work through the section.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-6 flex justify-end px-12 z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
                        <button
                            onClick={() => {
                                beginTimer();
                                setTimeRemaining(firstModuleTime * 60);
                                setTransitionState('none');
                                setShowCheckWork(false);
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-3 rounded-full font-bold text-lg transition-all shadow-lg shadow-blue-200 flex items-center gap-2"
                        >
                            Start English Section <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            );
        }

        // Auto-advance for moduleEnd (within same section)
        if (transitionState === 'moduleEnd') {
            setTimeout(() => {
                startNextPart();
            }, 3000);
            return (
                <div className="flex flex-col items-center justify-center bg-white p-8 fade-in fixed inset-0 z-50">
                    <h2 className="text-[26px] font-normal text-[#3b82f6] mb-6">This Module Is Over</h2>
                    <div className="text-center text-[#111827] space-y-3 mb-10 text-[15px]">
                        <p>All your work has been saved.</p>
                        <p>You&apos;ll move on automatically in just a moment.</p>
                        <p>Do not refresh this page or quit the app.</p>
                    </div>
                    <div className="w-8 h-8 rounded-full border-[3px] border-slate-200 border-t-slate-800 animate-spin"></div>
                </div>
            );
        }

        // 10-minute break between English and Math (matching real SAT)
        if (transitionState === 'break') {
            const breakMins = Math.floor(breakTimeRemaining / 60);
            const breakSecs = breakTimeRemaining % 60;
            const breakFormatted = `${breakMins}:${breakSecs.toString().padStart(2, '0')}`;

            return (
                <div className="flex bg-[#1a1a1a] text-white fade-in fixed inset-0 z-50">
                    {/* Left Side — Timer */}
                    <div className="w-[45%] flex flex-col items-center justify-center relative">
                        <div className="border border-white/30 rounded-lg px-10 py-8 text-center mb-8">
                            <p className="text-white/70 text-sm font-medium tracking-wider uppercase mb-3">Remaining Break Time:</p>
                            <p className="timer-digits text-6xl font-black tracking-tight">{breakFormatted}</p>
                        </div>
                        <button
                            onClick={startNextPart}
                            className="bg-[#f5c518] hover:bg-[#e6b800] text-black font-bold text-lg px-10 py-3 rounded-full transition-colors shadow-lg"
                        >
                            Resume Testing
                        </button>
                    </div>

                    {/* Right Side — Instructions */}
                    <div className="w-[55%] flex flex-col justify-center pr-16 pl-8">
                        <h2 className="text-3xl font-bold mb-4">Practice Test Break</h2>
                        <p className="text-white/70 leading-relaxed mb-8 text-[15px]">
                            You can resume this practice test as soon as you&apos;re ready to move on. On test day, you&apos;ll wait until the clock counts down. Read below to see how breaks work on test day.
                        </p>

                        <hr className="border-white/20 mb-8" />

                        <h3 className="text-2xl font-bold mb-2">Take a Break: Do Not Close Your Device</h3>
                        <p className="text-white/70 leading-relaxed mb-6 text-[15px]">
                            After the break, a <strong className="text-white">Resume Testing Now</strong> button will appear and you&apos;ll start the next section.
                        </p>

                        <p className="font-bold text-white mb-4">Follow these rules during the break:</p>
                        <ol className="space-y-3 text-white/70 text-[15px] list-decimal list-inside">
                            <li>Do not disturb students who are still testing.</li>
                            <li>Do not exit the app or close your laptop.</li>
                            <li>Do not access phones, smartwatches, textbooks, notes, or the internet.</li>
                            <li>Do not eat or drink near any testing device.</li>
                            <li>Do not speak in the testing room; outside the room, do not discuss the exam with anyone.</li>
                        </ol>
                    </div>
                </div>
            );
        }

        // Math section intro (after break)
        if (transitionState === 'mathIntro') {
            const nextSection = test.sections[currentSectionIndex + 1];
            const nextModuleTime = nextSection?.modules[0]?.timeMinutes || 35;
            const nextModuleQCount = nextSection?.modules[0]?.questions.length || 22;

            return (
                <div className="flex items-center justify-center bg-white p-8 fade-in fixed inset-0 z-50">
                    <div className="max-w-3xl w-full">
                        <h1 className="text-3xl font-bold text-slate-900 mb-8 pb-4 border-b border-slate-200">Section 2: Math</h1>

                        <div className="space-y-8 mb-12">
                            <div className="flex gap-4">
                                <Calculator className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900 mb-1">Calculator Available</h3>
                                    <p className="text-slate-600 leading-relaxed text-[17px]">A built-in graphing calculator is available for all math questions. You can also use the reference sheet for common formulas.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Clock className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900 mb-1">Timing</h3>
                                    <p className="text-slate-600 leading-relaxed text-[17px]">Module 1 has {nextModuleQCount} questions and is {nextModuleTime} minutes long. A second module will follow.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <BookOpen className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900 mb-1">Question Types</h3>
                                    <p className="text-slate-600 leading-relaxed text-[17px]">Questions cover algebra, advanced math, problem-solving, data analysis, and geometry. Some are multiple choice and some may require you to enter your answer.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-6 flex justify-end px-12 z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
                        <button
                            onClick={startNextPart}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-3 rounded-full font-bold text-lg transition-all shadow-lg shadow-blue-200 flex items-center gap-2"
                        >
                            Start Math Section <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            );
        }
    }

    const formatBluebookTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const currentEliminations = eliminatedAnswers[questionKey] || [];

    return (
        <>
            {/* Modal for expanded image */}
            {expandedImage && (
                <div 
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-8 cursor-pointer"
                    onClick={() => setExpandedImage(null)}
                >
                    <div className="relative max-w-5xl w-full max-h-full flex items-center justify-center cursor-default" onClick={e => e.stopPropagation()}>
                        <button 
                            onClick={() => setExpandedImage(null)}
                            className="absolute -top-12 right-0 md:-right-12 md:top-0 w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-800 hover:bg-slate-200 transition-colors z-[100] shadow-lg border border-slate-200"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <img 
                            src={expandedImage} 
                            alt="Expanded question figure" 
                            className="max-w-full max-h-[85vh] object-contain bg-white rounded-xl shadow-2xl p-4"
                        />
                    </div>
                </div>
            )}
            
            <div className="absolute inset-0 z-50 bg-[#F3F4F6] font-sans overflow-hidden flex flex-col">
            {/* Strict Mode Fullscreen Warning */}
            {fsWarningCountdown !== null && !isKickedOut && (
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

            {/* Kicked Out Overlay */}
            {isKickedOut && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-red-900/95 backdrop-blur-md">
                    <div className="bg-white rounded-3xl p-10 max-w-lg w-full text-center shadow-2xl">
                        <LogOut className="w-20 h-20 text-red-500 mx-auto mb-6" />
                        <h2 className="text-3xl font-black text-slate-900 mb-4">You Have Been Removed</h2>
                        <p className="text-lg text-slate-600 mb-8 font-medium">
                            The instructor has removed you from this mock session. You are no longer permitted to continue this exam.
                        </p>
                        <button
                            onClick={() => router.push('/dashboard/mocks')}
                            className="bg-slate-900 hover:bg-black text-white font-bold text-lg px-8 py-4 rounded-full w-full transition-colors"
                        >
                            Return to Dashboard
                        </button>
                    </div>
                </div>
            )}

            {/* Bluebook Official Header */}
            <header className="bg-white/90 backdrop-blur-xl border-b border-slate-200/80 px-6 py-2.5 flex items-center justify-between z-30 shrink-0 relative shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                {/* Left: Directions Dropdown */}
                <div className="flex-1">
                    <div className="flex flex-col ml-4">
                        <span className="font-bold text-[#111827] text-[15px] leading-snug">Section {currentSection?.name === 'Math' ? 2 : 1}, Module {currentModuleIndex + 1}: {currentSection?.name}</span>
                        <button
                            onClick={() => setIsDirectionsOpen(!isDirectionsOpen)}
                            className="flex items-center gap-1.5 text-[#374151] font-bold text-[13px] hover:bg-black/5 py-1 rounded transition-colors -ml-1 pl-1 w-fit pr-2"
                        >
                            Directions
                            <ChevronDown className={`w-[14px] h-[14px] transition-transform ${isDirectionsOpen ? 'rotate-180' : ''}`} />
                        </button>
                    </div>

                    {/* Directions Panel */}
                    {isDirectionsOpen && (
                        <div className="absolute top-[100%] left-4 w-[500px] bg-white border border-[#E5E7EB] shadow-[0_4px_20px_rgba(0,0,0,0.1)] rounded-b-lg p-5 z-50">
                            <p className="text-[16px] text-[#4B5563] leading-relaxed mb-4">
                                The questions in this section address a number of important reading and writing skills. Each question includes one or more passages, which may include a table or graph. Read each passage and question carefully, and then choose the best answer to the question based on the passage(s).
                            </p>
                            <p className="text-[16px] text-[#4B5563] leading-relaxed">
                                All questions in this section are multiple-choice with four answer choices. Each question has a single best answer.
                            </p>
                        </div>
                    )}
                </div>

                {/* Center: Timer */}
                <div className="flex flex-col items-center justify-center flex-1 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[180px]">
                    {!isTimerHidden ? (
                        <div className="timer-digits font-bold text-[20px] tracking-wider text-slate-800 flex items-center justify-center gap-2 bg-slate-100/80 backdrop-blur-sm px-5 py-1.5 rounded-full border border-slate-200 shadow-inner">
                            {formatBluebookTime(timeRemaining)}
                        </div>
                    ) : (
                        <div className="font-bold text-[22px] tracking-tight flex items-center justify-center gap-2 opacity-50 mb-1">
                            <Clock className="w-5 h-5 text-slate-400" />
                        </div>
                    )}
                    <button
                        onClick={() => setIsTimerHidden(!isTimerHidden)}
                        className="text-[11px] font-bold tracking-widest uppercase text-slate-500 hover:text-indigo-600 bg-transparent px-4 py-1.5 rounded-full transition-colors mt-0.5"
                    >
                        {isTimerHidden ? 'Show Timer' : 'Hide Timer'}
                    </button>
                </div>

                {/* Right Controls */}
                <div className="flex items-center justify-end flex-1 gap-2">
                    {currentSection?.name === 'Math' ? (
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
                                <span className="font-bold text-[12px] leading-none text-slate-500">Reference</span>
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setIsHighlightActive(!isHighlightActive)}
                            className={`flex flex-col items-center justify-center gap-1.5 w-[80px] h-[64px] rounded-lg transition-colors border border-transparent ${isHighlightActive ? 'bg-slate-200 text-slate-900 shadow-inner' : 'hover:bg-black/5 text-slate-700'}`}
                        >
                            <Highlighter className="w-[24px] h-[24px]" />
                            <span className="font-bold text-[12px] leading-none">Highlight</span>
                        </button>
                    )}
                    {!isStrictMode && (
                        <button
                            onClick={toggleFullscreen}
                            className="flex flex-col items-center justify-center gap-1.5 w-[80px] h-[64px] rounded-lg hover:bg-black/5 text-slate-700 transition-colors"
                        >
                            <Maximize2 className="w-[24px] h-[24px]" />
                            <span className="font-bold text-[12px] leading-none">Fullscreen</span>
                        </button>
                    )}
                    <button
                        onClick={() => { setIsExitModalOpen(true); setIsReferenceOpen(false); }}
                        className="flex flex-col items-center justify-center gap-1.5 w-[80px] h-[64px] rounded-lg hover:bg-black/5 text-slate-700 transition-colors"
                    >
                        <div className="flex items-center justify-center w-6 h-6 bg-slate-800 rounded text-white">
                            <X className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-bold text-[12px] leading-none">Save & Exit</span>
                    </button>
                </div>
            </header>

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
                                        if (isFullTest) {
                                            persistActiveSession();
                                        }
                                        setIsExiting(true);
                                        setTimeout(() => resetTest(), 500);
                                        if (mockId) {
                                            router.push('/dashboard/mocks');
                                        } else {
                                            router.push('/practice');
                                        }
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


            {/* Split Pane Content Area */}
            <main className="flex-1 flex overflow-hidden bg-white">
                {!showCheckWork ? (
                    <div className="w-full bg-white flex overflow-hidden relative">

                        {/* Left Pane (Passage or Desmos) */}
                        {currentSection?.name === 'Math' ? (
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
                            <div className="overflow-y-auto bg-white" style={{ width: `${leftPanelWidth}%` }}>
                                <div className="p-4 lg:p-10 pr-4 lg:pr-8 max-w-[800px] w-full mx-auto">
                                    {(() => {
                                        if (!currentQuestion?.passage) return false;
                                        const cleanP = cleanOCR(currentQuestion.passage);
                                        const cleanQ = cleanOCR(currentQuestion.question || '');
                                        // If passage is identical to question, or heavily overlaps, don't show it twice.
                                        const isDuplicate = cleanP === cleanQ || 
                                                            (cleanP.length > 20 && cleanQ.includes(cleanP)) || 
                                                            (cleanQ.length > 20 && cleanP.includes(cleanQ));
                                        
                                        if (isDuplicate) return false;
                                        
                                        return true;
                                    })() ? (
                                        <PassageRenderer
                                            text={currentQuestion.passage!}
                                            highlights={highlights[questionKey] || []}
                                            onAddHighlight={(h) => addHighlight(questionKey, { ...h, id: Math.random().toString(36).substring(2, 11) })}
                                            onRemoveHighlight={(id) => removeHighlight(questionKey, id)}
                                            onUpdateHighlight={(id, updates) => updateHighlight(questionKey, id, updates)}
                                            isHighlightModeActive={isHighlightActive}
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-center pt-16">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                                                <BookOpen className="w-5 h-5 text-slate-400" />
                                            </div>
                                            <p className="text-[15px] text-slate-400 font-medium">No passage for this question.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Resizable Divider */}
                        {((currentSection?.name === 'Math' && isDesmosOpen) || currentSection?.name !== 'Math') && (
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

                        {/* Right Pane (Question Area) */}
                        <div className={`overflow-y-auto p-4 lg:p-10 pl-4 lg:pl-8 bg-white ${!isDragging && currentSection?.name === 'Math' ? 'transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]' : ''}`} style={{ width: (currentSection?.name === 'Math' && !isDesmosOpen) ? '100%' : `${100 - leftPanelWidth}%` }}>
                            <div className="w-full max-w-[800px] mx-auto flex flex-col pb-10">

                                {/* Header: Connected Question Number & Mark for Review & ABC */}
                                <div className="flex items-center mb-6 mt-4 w-full bg-white border border-[#E5E7EB] rounded-[12px] shadow-sm h-[54px]">
                                    {/* Number */}
                                    <div className="bg-[#111827] text-white font-bold text-[16px] w-[64px] h-[54px] flex flex-shrink-0 items-center justify-center rounded-l-[11px]">
                                        {currentQuestionIndex + 1}
                                    </div>

                                    {/* Mark for Review (Middle) */}
                                    <button
                                        onClick={() => toggleFlag(questionKey)}
                                        className="flex flex-1 items-center gap-2 px-4 h-full text-[#4B5563] text-[15px] transition-colors justify-start bg-transparent group/mfr hover:bg-slate-50"
                                    >
                                        <Bookmark className={`w-[16px] h-[16px] transition-colors ${flaggedQuestions[questionKey] ? 'fill-slate-600 text-slate-600' : 'text-slate-400 group-hover/mfr:text-slate-600'}`} />
                                        <span className={flaggedQuestions[questionKey] ? 'font-bold' : 'font-medium group-hover/mfr:font-bold'}>Mark for Review</span>
                                    </button>

                                    {/* ABC Elimination (Right) */}
                                    <div className="w-[64px] h-[54px] flex flex-shrink-0 items-center justify-center border-l border-[#E5E7EB] rounded-r-[11px] bg-transparent">
                                        <button
                                            onClick={() => setIsEliminationMode(!isEliminationMode)}
                                            className={`flex items-center justify-center w-full h-full font-bold text-[14px] transition-colors rounded-r-[11px] ${isEliminationMode ? 'bg-[#111827] text-white' : 'text-slate-700 hover:bg-slate-50'}`}
                                        >
                                            <span className="line-through decoration-[#ef4444] decoration-[2px]">ABC</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Question Content */}
                                {/* Math question image/graph */}
                                {currentQuestion?.image && (
                                    <div className="mb-5 flex items-center justify-center">
                                        <img
                                            src={currentQuestion.image}
                                            alt="Question figure"
                                            className="max-w-full max-h-[200px] object-contain cursor-pointer hover:opacity-90 transition-opacity"
                                            onClick={() => setExpandedImage(currentQuestion.image || null)}
                                        />
                                    </div>
                                )}
                                <div className="text-[18px] text-[#111827] mb-6 leading-relaxed">
                                    {currentSection?.name === 'Math' ? (
                                        <MathText
                                            text={cleanOCR(
                                                currentQuestion?.question || currentQuestion?.passage || ''
                                            ).replace(/^\s*\d+[\.\)]\s*/, '')}
                                            style={{ fontSize: 18, lineHeight: 1.7, display: 'block' }}
                                        />
                                    ) : (
                                        <HighlightableText
                                            text={cleanOCR(currentQuestion?.question || '').replace(/^\s*\d+[\.\)]\s*/, '')}
                                            highlights={highlights[`q-${questionKey}`] || []}
                                            onAddHighlight={(h) => addHighlight(`q-${questionKey}`, { ...h, id: Math.random().toString(36).substring(2, 11) })}
                                            onRemoveHighlight={(id) => removeHighlight(`q-${questionKey}`, id)}
                                            onUpdateHighlight={(id, updates) => updateHighlight(`q-${questionKey}`, id, updates)}
                                            isHighlightModeActive={isHighlightActive}
                                        />
                                    )}
                                </div>

                                {/* Answer Options or SPR Input */}
                                <div className="space-y-4 w-full relative pl-[2px] pt-[2px]">
                                    {currentQuestion?.type === 'Math (SPR)' || (currentQuestion?.options && currentQuestion.options.length === 0) ? (
                                        <div className="flex flex-col gap-2">
                                            <input
                                                type="text"
                                                id="spr-answer-input"
                                                value={typeof userAnswers[questionKey] === 'string' ? userAnswers[questionKey] as string : typeof userAnswers[questionKey] === 'number' ? String(userAnswers[questionKey]) : ''}
                                                onChange={(e) => selectAnswer(questionKey, e.target.value)}
                                                className="w-[200px] h-[52px] border-2 border-[#D1D5DB] rounded-[8px] px-4 text-[18px] font-mono font-bold text-[#111827] focus:outline-none focus:border-[#111827] transition-colors bg-white"
                                                autoComplete="off"
                                                spellCheck={false}
                                            />

                                        </div>
                                    ) : null}
                                    {currentQuestion?.options.map((opt, i) => {
                                        const isSelected = userAnswers[questionKey] === i;
                                        const isEliminated = currentEliminations.includes(i);
                                        const letter = String.fromCharCode(65 + i);

                                        return (
                                            <div key={i} className="flex items-center gap-4 relative w-full group">
                                                {/* The box itself */}
                                                <label
                                                    onClick={(e) => {
                                                        if (isEliminationMode) {
                                                            e.preventDefault();
                                                            toggleElimination(questionKey, i);
                                                        }
                                                    }}
                                                    htmlFor={`opt-${i}`}
                                                    className={`relative w-full border h-auto min-h-[64px] rounded-[12px] flex items-stretch cursor-pointer transition-all duration-200 overflow-hidden ${isSelected ? 'border-[#111827] shadow-[inset_0_0_0_1px_#111827] z-10' : 'border-[#E5E7EB] hover:border-slate-400 shadow-sm'}`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="answer"
                                                        id={`opt-${i}`}
                                                        className="sr-only"
                                                        checked={isSelected}
                                                        onChange={() => {
                                                            if (!isEliminated) selectAnswer(questionKey, i);
                                                        }}
                                                    />

                                                    {/* Letter Box (Circular) */}
                                                    <div className="w-[60px] flex-shrink-0 flex items-center justify-center bg-transparent">
                                                        <div className={`w-[34px] h-[34px] rounded-full flex items-center justify-center font-bold text-[15px] border-[1.5px] transition-all ${isSelected ? 'border-[#111827] bg-[#111827] text-white shadow-md' : 'border-[#D1D5DB] text-[#4B5563] bg-white group-hover:border-[#9CA3AF] group-hover:text-[#111827]'}`}>
                                                            {letter}
                                                        </div>
                                                    </div>

                                                    {/* Answer Text */}
                                                    <div className="flex-1 p-4 flex items-center bg-transparent">
                                                        <span className={`text-[17px] font-sans ${isEliminated ? 'text-slate-400' : 'text-[#111827]'}`}>
                                                            {currentSection?.name === 'Math' ? (
                                                                <MathText text={cleanOCR(opt || '').replace(/^\s*[A-D][\.\)]\s*/, '')} />
                                                            ) : (
                                                                cleanOCR(opt || '').replace(/^\s*[A-D][\.\)]\s*/, '')
                                                            )}
                                                        </span>
                                                    </div>

                                                    {/* Strike-through line */}
                                                    {isEliminated && (
                                                        <div className="absolute top-1/2 left-0 w-full h-[1.5px] bg-slate-500 pointer-events-none -translate-y-[50%]"></div>
                                                    )}
                                                </label>

                                                {/* Eliminate/Undo button absolutely positioned outside the box on the right */}
                                                <div className="w-[50px] flex items-center justify-start flex-shrink-0">
                                                    {isEliminationMode && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                toggleElimination(questionKey, i);
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
                                </div>
                                
                                {/* Spacer to prevent Option D from touching footer due to flex overflow bugs */}
                                <div className="h-24 shrink-0 w-full"></div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="w-full flex justify-center py-10 fade-in bg-[#FAFAFA] h-full relative">
                        <div className="w-full max-w-4xl flex flex-col items-center">
                            <h2 className="text-[28px] font-normal text-[#111827] mb-4">Check Your Work</h2>
                            <p className="text-[#4B5563] text-center mb-1 text-[15px]">On test day, you won&apos;t be able to move on to the next module until time expires.</p>
                            <p className="text-[#4B5563] text-center mb-8 text-[15px]">For these practice questions, you can click <strong>Next</strong> when you&apos;re ready to move on.</p>

                            <div className="bg-white border border-[#E5E7EB] rounded-lg shadow-sm w-full p-6 max-h-[60vh] overflow-y-auto">
                                <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#E5E7EB]">
                                    <h3 className="font-bold text-[16px] text-[#111827]">{currentSection?.name} Questions</h3>
                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-[1.5px] border-dashed border-[#9CA3AF]"></div>
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
                                </div>
                                <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-11 gap-4 gap-y-6 justify-items-center">
                                    {Array.from({ length: totalQuestions }).map((_, idx) => {
                                        const key = `${currentSectionIndex}-${currentModuleIndex}-${idx}`;
                                        const isAnswered = userAnswers[key] !== undefined;
                                        const isFlagged = flaggedQuestions[key];

                                        let boxClass = 'cursor-pointer font-bold text-[15px] flex items-center justify-center relative transition-all w-10 h-10 rounded-md ';

                                        if (isAnswered) {
                                            boxClass += 'bg-[#111827] text-white hover:bg-[#374151]';
                                        } else {
                                            boxClass += 'border-[1.5px] border-dashed border-[#9CA3AF] text-[#4B5563] bg-white hover:bg-slate-50';
                                        }

                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => {
                                                    useTestStore.setState({ currentQuestionIndex: idx });
                                                    setShowCheckWork(false);
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
            </main>

            {/* Premium Bottom Navigation Bar */}
            <footer className="bg-white/80 backdrop-blur-lg border-t border-slate-200/80 px-8 h-[76px] flex items-center justify-between shrink-0 z-40 shadow-[0_-2px_15px_rgba(0,0,0,0.03)]">
                <div className="w-48"></div>

                {!showCheckWork && (
                    <div className="absolute left-1/2 -translate-x-1/2">
                        <button
                            onClick={() => setIsNavPanelOpen(true)}
                            className="flex items-center justify-center gap-2 px-6 h-[44px] rounded-[6px] font-bold text-white bg-[#222222] hover:bg-[#333333] transition-colors shadow-sm"
                        >
                            <span className="text-[15px] tracking-wide">Question {currentQuestionIndex + 1} of {totalQuestions}</span>
                            <ChevronUp className="w-[18px] h-[18px]" />
                        </button>
                    </div>
                )}

                <div className="flex gap-4 w-48 justify-end">
                    <button
                        onClick={() => {
                            if (showCheckWork) {
                                setShowCheckWork(false);
                            } else {
                                prevQuestion();
                            }
                        }}
                        disabled={currentQuestionIndex === 0 && !showCheckWork}
                        className="bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 px-8 py-2.5 rounded-full font-bold text-[15px] transition-all disabled:opacity-40 disabled:hover:border-slate-200 disabled:cursor-not-allowed shadow-sm hover:shadow-md hover:bg-slate-50"
                    >
                        Back
                    </button>
                    <button
                        onClick={handleNext}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-9 py-2.5 rounded-full font-bold text-[15px] transition-all disabled:opacity-50 disabled:from-slate-400 disabled:to-slate-500 shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02]"
                    >
                        {showCheckWork ? 'Submit' : 'Next'}
                    </button>
                </div>
            </footer>

            {/* Question Navigation Panel Overlay */}
            {isNavPanelOpen && (
                <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setIsNavPanelOpen(false)}>
                    <div
                        className="bg-white w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="border-b border-[#E5E7EB] p-6 flex justify-between items-center bg-[#F9FAFB]">
                            <h3 className="font-bold text-lg text-[#111827]">
                                Section {currentSection?.name === 'Math' ? 2 : 1}, Module {currentModuleIndex + 1}: {currentSection?.name}
                            </h3>
                            <button onClick={() => setIsNavPanelOpen(false)} className="p-2 rounded-md hover:bg-[#E5E7EB] text-[#4B5563] transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6">
                            {/* Legend */}
                            <div className="flex flex-wrap gap-6 mb-8 mt-2 justify-center bg-[#F3F4F6] py-3 rounded-md">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-dashed border-[#9CA3AF] rounded-sm"></div>
                                    <span className="text-sm font-semibold text-[#6B7280]">Unanswered</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-[#111827] rounded-sm"></div>
                                    <span className="text-sm font-semibold text-[#4B5563]">Answered</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Bookmark className="w-4 h-4 fill-red-500 text-red-500" />
                                    <span className="text-sm font-semibold text-[#4B5563]">For Review</span>
                                </div>
                            </div>

                            {/* Grid */}
                            <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-10 gap-3">
                                {Array.from({ length: totalQuestions }).map((_, idx) => {
                                    const key = `${currentSectionIndex}-${currentModuleIndex}-${idx}`;
                                    const isAnswered = userAnswers[key] !== undefined;
                                    const isFlagged = flaggedQuestions[key];
                                    const isActive = idx === currentQuestionIndex;

                                    let boxClass = 'border-2 cursor-pointer font-bold text-[14px] w-12 h-12 flex items-center justify-center relative transition-all rounded-md ';

                                    if (isActive && isAnswered) {
                                        boxClass += 'border-[#2563EB] bg-[#111827] text-white shadow-[inset_0_0_0_2px_#2563EB]';
                                    } else if (isActive) {
                                        boxClass += 'border-[#2563EB] bg-[#EFF6FF] text-[#1E3A8A] shadow-[inset_0_0_0_2px_#2563EB]';
                                    } else if (isAnswered) {
                                        boxClass += 'border-[#111827] bg-[#111827] text-white hover:bg-[#374151]';
                                    } else {
                                        boxClass += 'border-dashed border-[#9CA3AF] text-[#6B7280] bg-white hover:bg-[#F3F4F6]';
                                    }

                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                useTestStore.setState({ currentQuestionIndex: idx });
                                                setIsNavPanelOpen(false);
                                            }}
                                            className={boxClass}
                                        >
                                            {idx + 1}
                                            {isFlagged && (
                                                <div className="absolute -top-1.5 -right-1.5 bg-white rounded-full">
                                                    <Bookmark className="w-4 h-4 fill-red-500 text-red-500" />
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

            <ReferenceSheet isOpen={isReferenceOpen} onClose={() => setIsReferenceOpen(false)} />
        </div>
    );
        </>
    );
}
