'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    X, Clock, ArrowRight, Check, CheckCircle,
    Bookmark, Calculator, BookOpen, ChevronDown, ChevronUp,
    LayoutGrid, Home,
} from 'lucide-react';

import { useClassroomStore } from '@/store/classroomStore';
import {
    readStudentAssignmentProgress,
    StudentAssignmentOption,
    upsertStudentAssignmentSnapshot,
} from '@/lib/studentAssignmentProgress';
import DesmosCalculator from '@/components/DesmosCalculator';
import { ReferenceSheet } from '@/components/ReferenceSheet';

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

    // ── Drag divider (for split-pane) ────────────────────────────────────────

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

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    // ── Guards ────────────────────────────────────────────────────────────────

    if (!hasHydrated || !assignment) return null;

    // ── Intro screen ─────────────────────────────────────────────────────────

    if (mode === 'intro') {
        return (
            <div className="flex items-center justify-center bg-white p-8 fixed inset-0 z-50 fade-in">
                <div className="max-w-3xl w-full">
                    <h1 className="text-[2.15rem] font-bold text-slate-900 mb-8 pb-4 border-b border-slate-200">
                        {isMath ? 'Section 2: Math' : 'Section 1: English (Reading and Writing)'}
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
                    <div className="space-y-3">
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
            </div>
        );
    }

    // ── Test / Review interface ───────────────────────────────────────────────

    const currentQuestion = assignment.questions[currentIdx];
    const isLastQuestion = currentIdx === totalQuestions - 1;
    const currentEliminations = eliminatedAnswers[currentIdx] || [];

    return (
        <div className="h-[100dvh] flex flex-col bg-slate-50 font-[system-ui,-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,sans-serif] overflow-hidden fixed inset-0 z-50">

            {/* ── Header — identical to practice test ── */}
            <header className="bg-white/90 backdrop-blur-xl border-b border-slate-200/80 px-6 py-3 flex items-center justify-between z-30 shrink-0 relative shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                {/* Left: section label + directions */}
                <div className="flex-1">
                    <div className="flex flex-col ml-4">
                        <span className="font-bold text-[#111827] text-[15px] leading-snug">
                            {isMath ? 'Section 2, Module 1: Math' : 'Section 1, Module 1: Reading and Writing'}
                        </span>
                        <button
                            onClick={() => setIsDirectionsOpen(!isDirectionsOpen)}
                            className="flex items-center gap-1.5 text-[#374151] font-bold text-[13px] hover:bg-black/5 py-1 rounded transition-colors -ml-1 pl-1"
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
                            {isTimerHidden ? 'Show' : 'Hide'}
                        </button>
                    )}
                    {mode === 'review' && (
                        <span className="text-[11px] font-bold tracking-widest uppercase text-amber-600 bg-amber-50 px-3 py-1 rounded-full mt-0.5">Review</span>
                    )}
                </div>

                {/* Right: tool buttons */}
                <div className="flex items-center justify-end flex-1 gap-2">
                    {mode === 'review' && (
                        <button
                            onClick={() => setMode('complete')}
                            className="text-sm font-bold text-white bg-slate-900 hover:bg-black px-4 py-2 rounded-full mr-2"
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
                                <BookOpen className="w-[24px] h-[24px]" />
                                <span className="font-bold text-[12px] leading-none text-slate-500">Reference</span>
                            </button>
                        </>
                    )}
                </div>
            </header>

            {/* ── Body ── */}
            <div className="flex-1 flex overflow-hidden relative">

                {/* ── English: passage left pane ── */}
                {!isMath && currentQuestion?.passage && (
                    <>
                        <div
                            className="h-full overflow-y-auto border-r border-slate-200/80 bg-white flex flex-col shrink-0"
                            style={{ width: `${leftPanelWidth}%` }}
                        >
                            <div className="p-8 lg:p-10 flex-1">
                                <p className="text-[17px] leading-[1.85] text-[#111827] font-normal tracking-[-0.01em] select-text">
                                    {currentQuestion.passage}
                                </p>
                            </div>
                        </div>

                        {/* Drag divider */}
                        <div
                            className="w-2 cursor-col-resize hover:bg-blue-400 bg-slate-200 flex flex-col justify-center items-center h-full active:bg-blue-600 flex-shrink-0 shadow-inner"
                            onMouseDown={() => {
                                setIsDragging(true);
                                document.body.style.cursor = 'col-resize';
                                document.body.style.userSelect = 'none';
                            }}
                        >
                            <div className="h-8 w-1 bg-white/60 rounded-full mb-1" />
                            <div className="h-8 w-1 bg-white/60 rounded-full" />
                        </div>
                    </>
                )}

                {/* ── Math: Desmos left pane ── */}
                {isMath && isDesmosOpen && (
                    <>
                        <div
                            className="bg-[#F9FAFB] border-r border-[#E5E7EB] overflow-hidden flex flex-col h-full relative shrink-0"
                            style={{ width: `${leftPanelWidth}%` }}
                        >
                            <div className="p-3 border-b flex justify-between items-center bg-white">
                                <span className="font-bold text-sm text-slate-700 uppercase tracking-widest pl-2">Calculator</span>
                            </div>
                            <div className="flex-1 overflow-hidden relative"><DesmosCalculator mode="graphing" /></div>
                        </div>

                        <div
                            className="w-2 cursor-col-resize hover:bg-blue-400 bg-slate-200 flex flex-col justify-center items-center h-full active:bg-blue-600 flex-shrink-0 shadow-inner"
                            onMouseDown={() => {
                                setIsDragging(true);
                                document.body.style.cursor = 'col-resize';
                                document.body.style.userSelect = 'none';
                            }}
                        >
                            <div className="h-8 w-1 bg-white/60 rounded-full mb-1" />
                            <div className="h-8 w-1 bg-white/60 rounded-full" />
                        </div>
                    </>
                )}

                {/* ── Right pane: question + answers ── */}
                <div
                    className="overflow-y-auto bg-[#fafafa] flex justify-center"
                    style={{ width: (!isMath && currentQuestion?.passage) || (isMath && isDesmosOpen) ? `${100 - leftPanelWidth}%` : '100%' }}
                >
                    <div className="max-w-2xl w-full px-8 lg:px-12 py-8 pb-28 text-[#111827]">
                        {/* Question number + flag */}
                        <div className="flex items-center gap-3 mb-6 bg-white py-1.5 px-3 rounded-md w-max border border-slate-200 shadow-sm">
                            <span className="bg-[#111827] text-white text-sm font-bold w-6 h-6 flex items-center justify-center rounded-sm shadow-sm">
                                {currentIdx + 1}
                            </span>
                            <button
                                onClick={() => setFlaggedQuestions(s => ({ ...s, [currentIdx]: !s[currentIdx] }))}
                                className="focus:outline-none transition-transform hover:scale-110 flex items-center gap-1.5"
                            >
                                <Bookmark className={`w-4 h-4 ${flaggedQuestions[currentIdx] ? 'fill-red-500 text-red-500' : 'text-slate-400 fill-transparent'}`} />
                                <span className={`text-[12px] font-bold ${flaggedQuestions[currentIdx] ? 'text-red-500' : 'text-slate-500'}`}>
                                    Mark for Review
                                </span>
                            </button>
                        </div>

                        {/* Passage inline for Math or when no left pane */}
                        {(!isMath && !currentQuestion?.passage && currentQuestion?.passage !== undefined) && null}

                        {/* Question stem */}
                        <div className="text-[19px] leading-[1.8] font-normal tracking-[-0.01em] opacity-90 pl-1 mb-10">
                            <p>{currentQuestion?.stem}</p>
                        </div>

                        {/* Answer options */}
                        <div className="space-y-3.5 isolate max-w-xl">
                            {OPTION_LABELS.map((letter) => {
                                const optText = currentQuestion?.options[letter];
                                if (!optText) return null;

                                const isSelected = answers[String(currentIdx)] === letter;
                                const isEliminated = currentEliminations.includes(letter);
                                const isCorrectAnswer = mode === 'review' && currentQuestion.answer === letter;
                                const isWrongSelection = mode === 'review' && isSelected && !isCorrectAnswer;

                                let borderClass = isSelected
                                    ? 'border-[#3b82f6] shadow-[0_0_0_1px_rgba(59,130,246,0.35)]'
                                    : 'border-[#D1D5DB] hover:border-blue-400';
                                if (isEliminated) borderClass = 'border-[#E5E7EB] border-dashed opacity-50 bg-[#F9FAFB]';
                                if (isCorrectAnswer) borderClass = 'border-emerald-500 bg-emerald-50/50';
                                if (isWrongSelection) borderClass = 'border-red-400 bg-red-50/50';

                                let textClass = 'text-[#111827]';
                                if (isEliminated) textClass = 'text-[#9ca3af] line-through';
                                else if (isCorrectAnswer) textClass = 'text-emerald-900 font-medium';
                                else if (isWrongSelection) textClass = 'text-red-900 font-medium';

                                let numClass = isSelected
                                    ? 'bg-[#3b82f6] text-white border-[#3b82f6]'
                                    : 'border-[#9CA3AF] text-[#4B5563]';
                                if (isEliminated) numClass = 'border-[#D1D5DB] text-[#9CA3AF] line-through';
                                if (isCorrectAnswer) numClass = 'bg-emerald-500 text-white border-emerald-500';
                                if (isWrongSelection) numClass = 'bg-red-500 text-white border-red-500';

                                return (
                                    <div key={letter} className="flex items-center group relative z-10">
                                        <button
                                            onClick={() => handleSelectAnswer(letter)}
                                            className={`flex items-center gap-4 py-[13px] px-5 border rounded-xl w-full text-left transition-all bg-white relative overflow-hidden group-hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)] ${borderClass}`}
                                        >
                                            <div className={`w-[26px] h-[26px] flex items-center justify-center rounded-full border border-b-[2px] font-bold text-[13px] flex-shrink-0 transition-all z-10 ${numClass}`}>
                                                {letter}
                                            </div>
                                            <span className={`text-[17px] leading-snug relative z-10 font-[400] tracking-[-0.01em] opacity-95 ${textClass}`}>
                                                {optText}
                                            </span>
                                            {isCorrectAnswer && <Check className="ml-auto text-emerald-600 w-5 h-5 shrink-0" />}
                                            {isWrongSelection && <X className="ml-auto text-red-500 w-5 h-5 shrink-0" />}
                                        </button>
                                        {mode !== 'review' && (
                                            <button
                                                onClick={(e) => toggleElimination(e, letter)}
                                                className="pl-4 pr-2 text-slate-400 hover:text-red-500 transition-colors"
                                                aria-label="Eliminate answer"
                                            >
                                                <div className="w-7 h-7 flex items-center justify-center rounded-full border-2 border-dashed border-current opacity-0 group-hover:opacity-100 font-mono text-[14px] font-bold">
                                                    {letter}
                                                </div>
                                            </button>
                                        )}
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

            {/* ── Footer — identical to practice test ── */}
            <footer className="bg-[#111827] text-[#D1D5DB] px-6 py-[14px] flex items-center justify-between border-t flex-shrink-0 z-40 relative">
                <div className="flex-1 flex gap-2 w-full">
                    <h1 className="font-bold text-[16px] text-white tracking-wide">Target Prep</h1>
                </div>

                <div className="flex gap-4 items-center flex-1 justify-center relative">
                    <span className="text-[13px] font-bold px-3 py-1 bg-white/10 rounded-full tracking-wide">
                        Question {currentIdx + 1} of {totalQuestions}
                    </span>
                </div>

                <div className="flex-1 flex justify-end gap-3 w-full">
                    <button
                        onClick={() => setCurrentIdx(p => Math.max(0, p - 1))}
                        disabled={currentIdx === 0}
                        className="w-[85px] py-1.5 md:py-2.5 rounded-full border border-white/20 font-bold text-white text-sm hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-inner tracking-wide flex items-center justify-center"
                    >
                        Back
                    </button>
                    <button
                        onClick={() => setIsNavPanelOpen(!isNavPanelOpen)}
                        className="w-[85px] py-1.5 md:py-2.5 rounded-full border border-white/20 font-bold text-white text-sm hover:bg-white/10 transition-all shadow-inner relative flex flex-col items-center justify-center mt-[-6px]"
                    >
                        <LayoutGrid className="w-[18px] h-[18px] mb-[-2px] opacity-80" />
                        <span className="text-[9px] tracking-widest uppercase opacity-60 font-bold mt-1 absolute bottom-1.5">Nav</span>
                    </button>
                    {isLastQuestion ? (
                        <button
                            onClick={() => setMode('complete')}
                            className="w-[85px] py-1.5 md:py-2.5 rounded-full bg-[linear-gradient(135deg,#ef4444,#dc2626)] hover:brightness-110 font-bold text-white text-sm shadow-inner tracking-wide flex items-center justify-center"
                        >
                            End
                        </button>
                    ) : (
                        <button
                            onClick={() => setCurrentIdx(p => Math.min(totalQuestions - 1, p + 1))}
                            className="w-[85px] py-1.5 md:py-2.5 rounded-full bg-[linear-gradient(135deg,#2563eb,#3b82f6)] hover:brightness-110 font-bold text-white text-sm shadow-inner tracking-wide flex items-center justify-center"
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
        </div>
    );
}
