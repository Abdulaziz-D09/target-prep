'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    X, Clock, ArrowRight, Check, CheckCircle,
    Bookmark, Calculator, BookOpen, ChevronDown, ChevronUp,
    LayoutGrid, Home, Maximize2, FileText,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useClassroomStore, seedOnce } from '@/store/classroomStore';
import {
    readStudentAssignmentProgress,
    StudentAssignmentOption,
    upsertStudentAssignmentSnapshot,
} from '@/lib/studentAssignmentProgress';
import DesmosCalculator from '@/components/DesmosCalculator';
import { ReferenceSheet } from '@/components/ReferenceSheet';

// Seed synchronously — prevents blank page on first open
seedOnce();

const OPTION_LABELS: StudentAssignmentOption[] = ['A', 'B', 'C', 'D'];

export default function ClassroomAssignmentDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const { assignments, seed } = useClassroomStore();
    useEffect(() => { seed(); }, [seed]);

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

    // UI state — identical to practice test
    const [isTimerHidden, setIsTimerHidden] = useState(false);
    const [isDesmosOpen, setIsDesmosOpen] = useState(false);
    const [isReferenceOpen, setIsReferenceOpen] = useState(false);
    const [isDirectionsOpen, setIsDirectionsOpen] = useState(false);
    const [leftPanelWidth, setLeftPanelWidth] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const [isNavPanelOpen, setIsNavPanelOpen] = useState(false);
    const [isExitModalOpen, setIsExitModalOpen] = useState(false);
    const [isEliminationMode, setIsEliminationMode] = useState(false);
    const [calcMode, setCalcMode] = useState<'graphing' | 'scientific'>('graphing');

    const totalQuestions = assignment?.questions.length ?? 0;
    const totalTimeSeconds = Math.max(5, assignment?.timeLimitMinutes ?? 60) * 60;

    // ── Hydration ─────────────────────────────────────────────────────────────

    useEffect(() => {
        if (!assignment) return;

        const progressMap = readStudentAssignmentProgress();
        const saved = progressMap[assignment.id];

        if (saved) {
            const safeIndex = Math.max(0, Math.min(saved.currentIndex ?? 0, Math.max(assignment.questions.length - 1, 0)));
            const safeTime = Math.max(0, Number(saved.timeRemaining) || totalTimeSeconds);
            setAnswers(saved.answers ?? {});
            setCurrentIdx(safeIndex);
            setTimeRemaining(safeTime);
            setMode(saved.completed ? 'complete' : 'intro');
        } else {
            setAnswers({});
            setCurrentIdx(0);
            setTimeRemaining(totalTimeSeconds);
            setMode('intro');
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

        upsertStudentAssignmentSnapshot(assignment.id, {
            answers,
            currentIndex: currentIdx,
            completed: mode === 'complete',
            timeRemaining,
            hasStarted: mode !== 'intro',
            updatedAt: new Date().toISOString(),
        });
    }, [assignment, hasHydrated, totalQuestions, answers, currentIdx, mode, timeRemaining]);

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

    // ── Handlers ─────────────────────────────────────────────────────────────

    const handleSelectAnswer = (letter: StudentAssignmentOption) => {
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

    if (!assignment) {
        return (
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white gap-4">
                <p className="text-slate-600 font-medium">Assignment not found.</p>
                <button
                    onClick={() => router.push('/classroom')}
                    className="bg-indigo-600 text-white px-6 py-2.5 rounded-full font-bold hover:bg-indigo-700 transition"
                >
                    Back to Classroom
                </button>
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
                        <span className="block text-[1.1rem] font-medium text-slate-500 mt-1">{assignment.title}</span>
                    </h1>

                    <div className="space-y-8 mb-12">
                        <div className="flex gap-4">
                            <Clock className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="font-bold text-xl text-slate-900 mb-1">Timing</h3>
                                <p className="text-slate-600 leading-relaxed text-[17px]">
                                    You have {assignment.timeLimitMinutes} minutes to complete {totalQuestions} question{totalQuestions !== 1 ? 's' : ''}.
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
                        onClick={() => setMode('test')}
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

    // ── Test / Review interface ───────────────────────────────────────────────

    const currentQuestion = assignment.questions[currentIdx];
    const isLastQuestion = currentIdx === totalQuestions - 1;
    const currentEliminations = eliminatedAnswers[currentIdx] || [];
    const hasPassage = !isMath && !!currentQuestion?.passage;
    const showLeftPane = hasPassage || (isMath && isDesmosOpen);

    return (
        <div className="h-[100dvh] flex flex-col bg-slate-50 font-[system-ui,-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,sans-serif] overflow-hidden fixed inset-0 z-50">

            {/* ── Header — matches practice test exactly ── */}
            <header className="bg-white/90 backdrop-blur-xl border-b border-slate-200/80 px-6 py-3 flex items-center justify-between z-30 shrink-0 relative shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
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

                    {/* Directions panel */}
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

                {/* Center: timer */}
                <div className="flex flex-col items-center justify-center flex-1 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[180px]">
                    {!isTimerHidden ? (
                        <div className={`timer-digits font-bold text-[20px] tracking-wider flex items-center justify-center gap-2 bg-slate-100/80 backdrop-blur-sm px-5 py-1.5 rounded-full border border-slate-200 shadow-inner ${timeRemaining < 300 ? 'text-red-600' : 'text-slate-800'}`}>
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

                {/* Right: tool buttons — identical to practice test */}
                <div className="flex items-center justify-end flex-1 gap-1">
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
                                <span className="font-bold text-[12px] leading-none text-slate-500">Reference</span>
                            </button>
                        </>
                    )}
                    <button
                        onClick={toggleFullscreen}
                        className="flex flex-col items-center justify-center gap-1.5 w-[80px] h-[64px] rounded-lg hover:bg-black/5 text-slate-700 transition-colors"
                    >
                        <Maximize2 className="w-[24px] h-[24px]" />
                        <span className="font-bold text-[12px] leading-none">Fullscreen</span>
                    </button>
                    <button
                        onClick={() => setIsExitModalOpen(true)}
                        className="flex flex-col items-center justify-center gap-1.5 w-[80px] h-[64px] rounded-lg hover:bg-black/5 text-slate-700 transition-colors"
                    >
                        <div className="flex items-center justify-center w-6 h-6 bg-slate-800 rounded text-white">
                            <X className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-bold text-[12px] leading-none">Save & Exit</span>
                    </button>
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
                            {currentQuestion?.passage ? (
                                <p className="text-[17px] leading-[1.85] text-[#111827] font-normal tracking-[-0.01em] select-text">
                                    {currentQuestion.passage}
                                </p>
                            ) : (
                                <div className="text-[17px] text-[#6B7280] leading-[1.8] font-serif italic text-center mt-20">
                                    No passage for this question.
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
                    className={`overflow-y-auto p-4 lg:p-10 pl-4 lg:pl-8 flex justify-center bg-white ${!isDragging && isMath ? 'transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]' : ''}`}
                    style={{ width: (isMath && !isDesmosOpen) ? '100%' : `${100 - leftPanelWidth}%` }}
                >
                    <div className="w-full max-w-[800px] flex flex-col">
                        {/* Header: Connected Question Number & Mark for Review & ABC */}
                        <div className="flex mb-6 mt-4 shadow-sm w-full">
                            {/* Number */}
                            <div className="bg-[#111827] text-white font-bold text-[15px] w-[50px] flex flex-shrink-0 items-center justify-center">
                                {currentIdx + 1}
                            </div>

                            {/* Mark for Review (Middle) */}
                            <button
                                onClick={() => setFlaggedQuestions(s => ({ ...s, [currentIdx]: !s[currentIdx] }))}
                                className="flex flex-1 items-center gap-2 px-4 py-2.5 bg-white border-b border-[#E5E7EB] group/mfr text-[#4B5563] text-[15px] transition-colors justify-start"
                            >
                                <Bookmark className={`w-[14px] h-[14px] transition-colors ${flaggedQuestions[currentIdx] ? 'fill-slate-600 text-slate-600' : 'text-slate-400 group-hover/mfr:text-slate-600'}`} />
                                <span className={flaggedQuestions[currentIdx] ? 'font-bold' : 'font-medium group-hover/mfr:font-bold'}>Mark for Review</span>
                            </button>

                            {/* ABC Elimination (Right) */}
                            <div className="bg-[#F3F4F6] flex items-center pr-2">
                                <button
                                    onClick={() => setIsEliminationMode(!isEliminationMode)}
                                    className={`flex items-center justify-center px-3 py-1 ml-2 font-bold text-[14px] transition-colors rounded ${isEliminationMode ? 'bg-[#111827] text-white' : 'bg-transparent text-slate-700 hover:bg-slate-200'}`}
                                >
                                    <span className="line-through decoration-[#ef4444] decoration-[2px]">ABC</span>
                                </button>
                            </div>
                        </div>

                        {/* Question Content */}
                        <div className="text-[18px] text-[#111827] mb-6 leading-relaxed">
                            <p className="font-bluebook break-words whitespace-pre-wrap [text-wrap:pretty]">{currentQuestion?.stem}</p>
                        </div>

                        {/* Answer Options */}
                        <div className="space-y-4 w-full relative pl-[2px] pt-[2px]">
                            {OPTION_LABELS.map((letter) => {
                                const optText = currentQuestion?.options[letter];
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
                                            className={`relative flex-1 p-3 px-4 border min-h-[58px] rounded-[10px] flex items-center cursor-pointer transition-all duration-200 overflow-hidden ${isSelected ? 'border-indigo-600 shadow-[inset_0_0_0_1px_#4f46e5,0_2px_8px_rgba(79,70,229,0.15)] bg-indigo-50/30' : 'border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 hover:shadow-sm'} ${overrideBox}`}
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

                                            <div className={`w-[28px] h-[28px] rounded-full border-[1.5px] flex-shrink-0 flex items-center justify-center font-bold text-[13px] mr-4 transition-colors ${isSelected ? 'border-indigo-600 text-white bg-indigo-600 shadow-sm' : 'border-slate-400 text-slate-700'}`}>
                                                {letter}
                                            </div>

                                            <span className={`text-[17px] font-sans flex-1 ${isEliminated ? 'text-slate-400' : 'text-[#111827]'}`}>
                                                {optText}
                                            </span>

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
                        </div>
                    </div>
                </div>
{/* ── Nav panel (bottom-right overlay) ── */}
                {isNavPanelOpen && (
                    <div className="absolute bottom-0 right-0 w-full md:w-96 bg-white border-l border-[#E5E7EB] shadow-2xl z-30 flex flex-col transform transition-transform border-t h-[350px]">
                        <div className="border-b border-[#E5E7EB] p-6 flex justify-between items-center bg-[#F9FAFB]">
                            <h3 className="font-bold text-lg text-[#111827]">Questions</h3>
                            <button onClick={() => setIsNavPanelOpen(false)} className="p-2 rounded-md hover:bg-[#E5E7EB] text-[#4B5563] transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto grid grid-cols-4 sm:grid-cols-5 gap-3 h-full content-start">
                            {assignment.questions.map((_, idx) => {
                                const isFlagged = flaggedQuestions[idx];
                                const isAnswered = answers[String(idx)] !== undefined;
                                const isCurrent = currentIdx === idx;
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => { setCurrentIdx(idx); setIsNavPanelOpen(false); }}
                                        className={`relative flex items-center justify-center h-12 rounded-lg text-[15px] font-bold border-2 transition-all hover:-translate-y-0.5 hover:shadow-md ${isCurrent ? 'bg-blue-50 border-blue-600 text-blue-700' : isAnswered ? 'bg-slate-900 text-white border-slate-900 border-b-4' : 'bg-white border-[#D1D5DB] text-[#4B5563] hover:border-[#9CA3AF]'}`}
                                    >
                                        <div className="flex items-center justify-center w-full h-full relative font-mono">
                                            {idx + 1}
                                            {isFlagged && <Bookmark className="w-4 h-4 text-red-500 absolute -top-2 -right-2 bg-white rounded-full shadow-sm" fill="currentColor" />}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            
            {/* Premium Bottom Navigation Bar */}
            <footer className="bg-white/80 backdrop-blur-lg border-t border-slate-200/80 px-8 h-[76px] flex items-center justify-between shrink-0 absolute bottom-0 left-0 right-0 z-40 shadow-[0_-2px_15px_rgba(0,0,0,0.03)]">
                <div className="w-48"></div>

                <div className="absolute left-1/2 -translate-x-1/2">
                    <button
                        onClick={() => setIsNavPanelOpen(true)}
                        className="flex items-center justify-center gap-2 px-6 h-[44px] rounded-[6px] font-bold text-white bg-[#222222] hover:bg-[#333333] transition-colors shadow-sm"
                    >
                        <span className="text-[15px] tracking-wide">Question {currentIdx + 1} of {totalQuestions}</span>
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
                            onClick={() => setCurrentIdx(p => Math.min(totalQuestions - 1, p + 1))}
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
        </div>
    );
}
