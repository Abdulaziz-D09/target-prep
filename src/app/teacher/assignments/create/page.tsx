'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
    Upload, FileText, Sparkles, ChevronLeft, ChevronRight, Check,
    AlertCircle, ArrowLeft, GraduationCap, Loader2, X, Send,
} from 'lucide-react';
import Link from 'next/link';
import { FloatingPageShapes, itemRevealVariants, pageRevealVariants } from '@/components/SiteMotion';
import { useClassroomStore } from '@/store/classroomStore';

// ─── Types ────────────────────────────────────────────────────────────────────

type Option = 'A' | 'B' | 'C' | 'D';

type ParsedQuestion = {
    id: string;
    stem: string;
    options: { A: string; B: string; C: string; D: string };
    answer: Option | null;
};

type WizardStep = 1 | 2 | 3 | 4;

const OPTION_LABELS: Option[] = ['A', 'B', 'C', 'D'];

// ─── Step indicator ───────────────────────────────────────────────────────────

const STEPS = [
    { n: 1, label: 'Upload' },
    { n: 2, label: 'Review' },
    { n: 3, label: 'Answer Key' },
    { n: 4, label: 'Save & Send' },
] as const;

function StepIndicator({ current }: { current: WizardStep }) {
    return (
        <div className="relative mb-12 sm:mb-14">
            <div className="absolute top-[22px] left-[5%] right-[5%] h-1 bg-slate-200 dark:bg-slate-700/50 rounded-full z-0 hidden sm:block">
                <div 
                   className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                   style={{ width: `${((current - 1) / (STEPS.length - 1)) * 100}%` }}
                />
            </div>
            
            <div className="flex items-start justify-between relative z-10 px-2 sm:px-0">
                {STEPS.map(({ n, label }, i) => {
                    const done   = n < current;
                    const active = n === current;
                    return (
                        <div key={n} className="flex flex-col items-center w-[70px]">
                            <div className={`h-12 w-12 rounded-[14px] flex items-center justify-center text-[16px] font-black transition-all ${
                                done   ? 'bg-indigo-600 text-white shadow-md border-2 border-indigo-600'
                                       : active ? 'bg-indigo-600 text-white shadow-[0_4px_14px_rgba(99,102,241,0.35)] border-2 border-indigo-600 scale-[1.05]'
                                       : 'bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 site-text-muted'
                            }`}>
                                {done ? <Check className="h-6 w-6 stroke-[3]" /> : n}
                            </div>
                            <span className={`mt-3.5 text-[11px] font-bold uppercase tracking-[0.2em] whitespace-nowrap hidden sm:block transition-all ${
                                active ? 'text-indigo-600 dark:text-indigo-400' : 'site-text-muted'
                            }`}>{label}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ─── Answer option card (practice-test style) ─────────────────────────────────

function OptionCard({ letter, text, selected, onSelect }: {
    letter: Option; text: string; selected: boolean; onSelect: () => void;
}) {
    return (
        <button
            onClick={onSelect}
            className={`w-full text-left flex items-center gap-4 px-5 py-4 rounded-2xl border-2 transition-all duration-150 ${
                selected
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-[0_0_0_4px_rgba(99,102,241,0.12)]'
                    : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 site-subpanel'
            }`}
        >
            <span className={`flex-shrink-0 h-9 w-9 rounded-full border-2 flex items-center justify-center text-sm font-black transition-all ${
                selected
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : 'border-slate-300 dark:border-slate-600 site-text-muted'
            }`}>
                {letter}
            </span>
            <span className={`text-[15px] leading-snug ${selected ? 'font-semibold text-indigo-700 dark:text-indigo-300' : 'site-text'}`}>
                {text}
            </span>
        </button>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CreateAssignmentPage() {
    const shouldReduceMotion = useReducedMotion();
    const router = useRouter();
    const { classrooms, addAssignment, seed } = useClassroomStore();
    useEffect(() => { seed(); }, [seed]);

    // ── Wizard state ──────────────────────────────────────────────────────────
    const [step, setStep] = useState<WizardStep>(1);

    // Step 1
    const [inputTab, setInputTab]         = useState<'paste' | 'upload'>('paste');
    const [pastedText, setPastedText]     = useState('');
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [isDragging, setIsDragging]     = useState(false);
    const [isScanning, setIsScanning]     = useState(false);
    const [scanError, setScanError]       = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Step 2
    const [questions, setQuestions]   = useState<ParsedQuestion[]>([]);
    const [currentIdx, setCurrentIdx] = useState(0);

    // Step 4
    const [title, setTitle]                           = useState('');
    const [subject, setSubject]                       = useState<'English' | 'Math'>('English');
    const [selectedClassroomIds, setSelectedClassroomIds] = useState<string[]>([]);
    const [timeLimitMinutes, setTimeLimitMinutes] = useState(60);
    const [isSaving, setIsSaving]                     = useState(false);

    // ── Step 1: Scan ──────────────────────────────────────────────────────────

    const handleScan = useCallback(async () => {
        setScanError('');

        if (inputTab === 'paste' && !pastedText.trim()) {
            setScanError('Please paste some text before scanning.');
            return;
        }
        if (inputTab === 'upload' && !uploadedFile) {
            setScanError('Please upload a PDF file before scanning.');
            return;
        }

        setIsScanning(true);
        try {
            let res: Response;

            if (inputTab === 'upload' && uploadedFile) {
                const fd = new FormData();
                fd.append('file', uploadedFile);
                res = await fetch('/api/scan-pdf', { method: 'POST', body: fd });
            } else {
                res = await fetch('/api/scan-pdf', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: pastedText }),
                });
            }

            const data = await res.json();

            if (!res.ok) {
                setScanError(data.error ?? 'Scan failed. Please try again.');
                setIsScanning(false);
                return;
            }

            if (!data.questions || data.questions.length === 0) {
                setScanError('No multiple-choice questions found. Make sure your text contains questions with A/B/C/D options.');
                setIsScanning(false);
                return;
            }

            const parsed: ParsedQuestion[] = data.questions.map(
                (q: { stem: string; options: { A: string; B: string; C: string; D: string } }, i: number) => ({
                    id: `q-${i}`,
                    stem: q.stem,
                    options: q.options,
                    answer: null,
                })
            );

            setQuestions(parsed);
            setCurrentIdx(0);
            setTimeLimitMinutes(Math.max(20, Math.ceil(parsed.length * 1.5)));
            setStep(2);
        } catch {
            setScanError('Network error. Check your connection and try again.');
        } finally {
            setIsScanning(false);
        }
    }, [inputTab, pastedText, uploadedFile]);

    // ── Step 2: answer selection ──────────────────────────────────────────────

    const handleSelectAnswer = (answer: Option) => {
        setQuestions((prev) =>
            prev.map((q, i) => (i === currentIdx ? { ...q, answer } : q))
        );
    };

    const currentQ      = questions[currentIdx];
    const answeredCount = questions.filter((q) => q.answer !== null).length;

    // ── Step 4: save ──────────────────────────────────────────────────────────

    const handleSave = async () => {
        if (!title.trim()) return;
        setIsSaving(true);
        await new Promise((r) => setTimeout(r, 350));

        addAssignment({
            title: title.trim(),
            subject,
            classroomIds: selectedClassroomIds,
            timeLimitMinutes,
            questions: questions.map((q) => ({
                id: q.id,
                stem: q.stem,
                options: q.options,
                answer: q.answer ?? 'A',
            })),
        });
        router.push('/teacher/assignments');
    };

    // ── Drag & drop ───────────────────────────────────────────────────────────

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file?.type === 'application/pdf') setUploadedFile(file);
    };

    const toggleClassroom = (id: string) => {
        setSelectedClassroomIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    // ─────────────────────────────────────────────────────────────────────────

    return (
        <div className="relative min-h-screen pt-4 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="site-atmosphere site-atmosphere--home" />
            <FloatingPageShapes theme="home" />

            <motion.div
                className="relative z-10 mx-auto max-w-[780px]"
                initial={shouldReduceMotion ? undefined : 'hidden'}
                animate={shouldReduceMotion ? undefined : 'visible'}
                variants={pageRevealVariants}
            >
                {/* Back */}
                <motion.div className="mb-6" variants={itemRevealVariants}>
                    <Link href="/teacher/assignments" className="inline-flex items-center gap-1.5 text-sm font-semibold site-text-muted hover:site-text transition">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Assignments
                    </Link>
                </motion.div>

                {/* Header */}
                <motion.div className="mb-6" variants={itemRevealVariants}>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 rounded-full text-xs font-bold uppercase tracking-widest mb-3 border border-indigo-500/20">
                        Assignment Builder
                    </div>
                    <h1 className="text-3xl font-black tracking-[-0.03em] site-text-strong">New Assignment</h1>
                    <p className="mt-1 text-sm site-text-muted">AI scans your text or PDF and extracts every multiple-choice question.</p>
                </motion.div>

                {/* Steps */}
                <motion.div variants={itemRevealVariants}>
                    <StepIndicator current={step} />
                </motion.div>

                {/* ── STEP 1 ─────────────────────────────────────────────────── */}
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 16 }}
                            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                            exit={shouldReduceMotion ? undefined : { opacity: 0, y: -10 }}
                            transition={{ duration: 0.25 }}
                        >
                            <div className="site-panel rounded-[16px] p-6 sm:p-8">
                                {/* Input tabs */}
                                <div className="flex gap-2 mb-6">
                                    {(['paste', 'upload'] as const).map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => { setInputTab(tab); setScanError(''); }}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition ${
                                                inputTab === tab
                                                    ? 'bg-indigo-600 text-white shadow'
                                                    : 'site-subpanel site-text hover:scale-[1.02]'
                                            }`}
                                        >
                                            {tab === 'paste' ? <FileText className="h-4 w-4" /> : <Upload className="h-4 w-4" />}
                                            {tab === 'paste' ? 'Paste Text' : 'Upload PDF'}
                                        </button>
                                    ))}
                                </div>

                                {inputTab === 'paste' && (
                                    <textarea
                                        placeholder="Paste your questions here — e.g. from a practice test, quiz, or textbook. The AI will extract all multiple-choice questions automatically."
                                        value={pastedText}
                                        onChange={(e) => setPastedText(e.target.value)}
                                        rows={12}
                                        className="w-full px-4 py-3 rounded-xl site-subpanel bg-transparent outline-none border-2 border-transparent focus:border-indigo-500 transition text-[14px] site-text resize-none placeholder:site-text-muted leading-relaxed"
                                    />
                                )}

                                {inputTab === 'upload' && (
                                    <div
                                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                        onDragLeave={() => setIsDragging(false)}
                                        onDrop={handleDrop}
                                        onClick={() => fileInputRef.current?.click()}
                                        className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 cursor-pointer transition-all ${
                                            isDragging
                                                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                                                : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400'
                                        }`}
                                    >
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept=".pdf"
                                            className="hidden"
                                            onChange={(e) => {
                                                const f = e.target.files?.[0];
                                                if (f) { setUploadedFile(f); setScanError(''); }
                                            }}
                                        />
                                        {uploadedFile ? (
                                            <>
                                                <div className="h-14 w-14 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center mb-3">
                                                    <FileText className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
                                                </div>
                                                <p className="font-bold site-text-strong text-[15px]">{uploadedFile.name}</p>
                                                <p className="text-[13px] site-text-muted mt-1">{(uploadedFile.size / 1024).toFixed(0)} KB</p>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setUploadedFile(null); }}
                                                    className="mt-3 flex items-center gap-1 text-[12px] text-rose-500 font-semibold hover:underline"
                                                >
                                                    <X className="h-3.5 w-3.5" /> Remove
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <div className="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                                                    <Upload className="h-7 w-7 site-text-muted" />
                                                </div>
                                                <p className="font-bold site-text-strong text-[15px]">Drop your PDF here</p>
                                                <p className="text-[13px] site-text-muted mt-1">or click to browse</p>
                                            </>
                                        )}
                                    </div>
                                )}

                                {/* Error */}
                                {scanError && (
                                    <div className="mt-4 flex items-start gap-2.5 px-4 py-3 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-700/50">
                                        <AlertCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-[13px] text-rose-700 dark:text-rose-400 font-medium">{scanError}</p>
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={handleScan}
                                    disabled={isScanning}
                                    className="mt-6 w-full flex items-center justify-center gap-2.5 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-[15px] shadow-md transition hover:scale-[1.01]"
                                >
                                    {isScanning
                                        ? <><Loader2 className="h-5 w-5 animate-spin" /> Scanning with AI…</>
                                        : <><Sparkles className="h-5 w-5" /> Scan with AI</>}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* ── STEP 2: Question Review ────────────────────────────── */}
                    {step === 2 && currentQ && (
                        <motion.div
                            key={`step2-${currentIdx}`}
                            initial={shouldReduceMotion ? undefined : { opacity: 0, x: 24 }}
                            animate={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
                            exit={shouldReduceMotion ? undefined : { opacity: 0, x: -24 }}
                            transition={{ duration: 0.22 }}
                        >
                            <div className="site-panel rounded-[16px] overflow-hidden">
                                {/* Progress bar */}
                                <div className="px-6 pt-6 pb-0">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[12px] font-bold uppercase tracking-wider site-text-muted">
                                            Question {currentIdx + 1} of {questions.length}
                                        </span>
                                        <span className="text-[12px] font-bold site-text-muted">
                                            {answeredCount} answered
                                        </span>
                                    </div>
                                    <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                                            style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Question stem */}
                                <div className="px-6 py-6 border-b border-slate-100 dark:border-slate-800">
                                    <p className="text-[17px] leading-[1.7] site-text-strong font-[450]">
                                        {currentQ.stem}
                                    </p>
                                </div>

                                {/* Options */}
                                <div className="px-6 pb-6 pt-4 space-y-3">
                                    <p className="text-[11px] font-bold uppercase tracking-widest site-text-muted mb-3">
                                        Mark the correct answer:
                                    </p>
                                    {OPTION_LABELS.map((letter) => (
                                        <OptionCard
                                            key={letter}
                                            letter={letter}
                                            text={currentQ.options[letter]}
                                            selected={currentQ.answer === letter}
                                            onSelect={() => handleSelectAnswer(letter)}
                                        />
                                    ))}
                                </div>

                                {/* Navigation */}
                                <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-800">
                                    <button
                                        onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
                                        disabled={currentIdx === 0}
                                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-full site-subpanel font-bold text-[14px] site-text disabled:opacity-30 transition hover:scale-[1.02]"
                                    >
                                        <ChevronLeft className="h-4 w-4" /> Prev
                                    </button>

                                    {/* Dot navigation */}
                                    <div className="flex gap-1">
                                        {questions.map((q, i) => (
                                            <button
                                                key={q.id}
                                                onClick={() => setCurrentIdx(i)}
                                                className={`rounded-full transition-all ${
                                                    i === currentIdx
                                                        ? 'h-2.5 w-2.5 bg-indigo-600 scale-125'
                                                        : q.answer
                                                            ? 'h-2.5 w-2.5 bg-indigo-300 dark:bg-indigo-700'
                                                            : 'h-2.5 w-2.5 bg-slate-300 dark:bg-slate-600'
                                                }`}
                                            />
                                        ))}
                                    </div>

                                    {currentIdx < questions.length - 1 ? (
                                        <button
                                            onClick={() => setCurrentIdx((i) => i + 1)}
                                            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[14px] shadow-sm transition hover:scale-[1.02]"
                                        >
                                            Next <ChevronRight className="h-4 w-4" />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => setStep(3)}
                                            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[14px] shadow-sm transition hover:scale-[1.02]"
                                        >
                                            Done <Check className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="mt-4 flex gap-3">
                                <button onClick={() => { setQuestions([]); setStep(1); }} className="flex items-center gap-1.5 px-4 py-2.5 rounded-full site-subpanel font-bold text-[13px] site-text-muted hover:site-text transition">
                                    <ArrowLeft className="h-3.5 w-3.5" /> Re-scan
                                </button>
                                <button onClick={() => setStep(3)} className="flex items-center gap-1.5 px-4 py-2.5 rounded-full site-subpanel font-bold text-[13px] site-text transition hover:scale-[1.01]">
                                    Skip to answer key →
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* ── STEP 3: Answer Key Table ─────────────────────────── */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 16 }}
                            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                            exit={shouldReduceMotion ? undefined : { opacity: 0, y: -10 }}
                            transition={{ duration: 0.25 }}
                        >
                            <div className="site-panel rounded-[16px] overflow-hidden">
                                <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800">
                                    <h2 className="text-lg font-black site-text-strong">Answer Key</h2>
                                    <p className="text-[13px] site-text-muted mt-0.5">Review and set the correct answer for each question.</p>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-slate-200 dark:border-slate-700/50">
                                                <th className="text-left px-5 py-3.5 text-[11px] uppercase tracking-widest font-bold site-text-muted w-12">#</th>
                                                <th className="text-left px-5 py-3.5 text-[11px] uppercase tracking-widest font-bold site-text-muted">Question</th>
                                                <th className="text-center px-5 py-3.5 text-[11px] uppercase tracking-widest font-bold site-text-muted w-28">Answer</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {questions.map((q, idx) => (
                                                <tr
                                                    key={q.id}
                                                    className={`${idx < questions.length - 1 ? 'border-b border-slate-100 dark:border-slate-800' : ''} hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors`}
                                                >
                                                    <td className="px-5 py-3.5">
                                                        <span className="text-[13px] font-bold site-text-muted">{idx + 1}</span>
                                                    </td>
                                                    <td className="px-5 py-3.5">
                                                        <p className="text-[13px] site-text leading-snug line-clamp-2">{q.stem}</p>
                                                    </td>
                                                    <td className="px-5 py-3.5 text-center">
                                                        <select
                                                            value={q.answer ?? ''}
                                                            onChange={(e) => {
                                                                const val = e.target.value as Option;
                                                                setQuestions((prev) =>
                                                                    prev.map((item, i) => i === idx ? { ...item, answer: val } : item)
                                                                );
                                                            }}
                                                            className={`px-3 py-1.5 rounded-full text-sm font-black border-2 outline-none cursor-pointer transition-all ${
                                                                q.answer
                                                                    ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-400 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300'
                                                                    : 'site-subpanel border-slate-200 dark:border-slate-700 site-text-muted'
                                                            }`}
                                                        >
                                                            <option value="">–</option>
                                                            {OPTION_LABELS.map((l) => <option key={l} value={l}>{l}</option>)}
                                                        </select>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="flex justify-between mt-5">
                                <button
                                    onClick={() => { setCurrentIdx(0); setStep(2); }}
                                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-full site-subpanel font-bold text-[14px] site-text transition hover:scale-[1.01]"
                                >
                                    <ChevronLeft className="h-4 w-4" /> Back to Review
                                </button>
                                <button
                                    onClick={() => setStep(4)}
                                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[14px] shadow-md transition hover:scale-[1.01]"
                                >
                                    Continue <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* ── STEP 4: Save & Send ──────────────────────────────── */}
                    {step === 4 && (
                        <motion.div
                            key="step4"
                            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 16 }}
                            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                            exit={shouldReduceMotion ? undefined : { opacity: 0, y: -10 }}
                            transition={{ duration: 0.25 }}
                            className="space-y-5"
                        >
                            {/* Title */}
                            <div className="site-panel rounded-[16px] p-6">
                                <h2 className="text-lg font-black site-text-strong mb-1">Assignment Details</h2>
                                <p className="text-[13px] site-text-muted mb-5">{questions.length} question{questions.length !== 1 ? 's' : ''} ready.</p>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    {/* Subject toggle */}
                                    <div className="sm:col-span-2">
                                        <label className="block text-[11px] font-bold uppercase tracking-widest site-text-muted mb-2">Subject</label>
                                        <div className="flex gap-2">
                                            {(['English', 'Math'] as const).map((s) => (
                                                <button
                                                    key={s}
                                                    type="button"
                                                    onClick={() => setSubject(s)}
                                                    className={`flex-1 py-2.5 rounded-xl border-2 font-bold text-[14px] transition-all ${
                                                        subject === s
                                                            ? s === 'English'
                                                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                                                                : 'border-violet-500 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300'
                                                            : 'border-slate-200 dark:border-slate-700 site-subpanel site-text hover:border-slate-300'
                                                    }`}
                                                >
                                                    {s === 'English' ? '📖 English' : '🔢 Math'}
                                                </button>
                                            ))}
                                        </div>
                                        <p className="mt-1.5 text-[12px] site-text-muted">Determines the test layout students see: split-pane passage view for English, full-width formula view for Math.</p>
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="block text-[11px] font-bold uppercase tracking-widest site-text-muted mb-2">Assignment Title</label>
                                        <input
                                            autoFocus
                                            type="text"
                                            placeholder="e.g. Reading Practice — March Week 2"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl site-subpanel bg-transparent outline-none border-2 border-transparent focus:border-indigo-500 transition text-[15px] font-semibold site-text-strong placeholder:font-normal placeholder:site-text-muted"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold uppercase tracking-widest site-text-muted mb-2">Time Limit (minutes)</label>
                                        <input
                                            type="number"
                                            min={5}
                                            max={240}
                                            step={5}
                                            value={timeLimitMinutes}
                                            onChange={(e) => {
                                                const raw = Number(e.target.value);
                                                if (!Number.isFinite(raw)) return;
                                                setTimeLimitMinutes(Math.min(240, Math.max(5, Math.round(raw))));
                                            }}
                                            className="w-full px-4 py-3 rounded-xl site-subpanel bg-transparent outline-none border-2 border-transparent focus:border-indigo-500 transition text-[15px] font-semibold site-text-strong"
                                        />
                                        <p className="mt-1 text-[12px] site-text-muted">Students will see this before starting.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Classroom picker */}
                            {classrooms.length > 0 ? (
                                <div className="site-panel rounded-[16px] p-6">
                                    <h2 className="text-[15px] font-black site-text-strong mb-1">
                                        {classrooms.length === 1 ? 'Send to Class' : 'Send to Classes'}
                                    </h2>
                                    <p className="text-[13px] site-text-muted mb-4">
                                        {classrooms.length === 1
                                            ? 'This assignment will be visible to your class.'
                                            : 'Choose which classes receive this assignment.'}
                                    </p>

                                    <div className="space-y-2.5">
                                        {classrooms.map((cls) => {
                                            const checked = selectedClassroomIds.includes(cls.id);
                                            return (
                                                <button
                                                    key={cls.id}
                                                    onClick={() => toggleClassroom(cls.id)}
                                                    className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl border-2 text-left transition-all ${
                                                        checked
                                                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                                                            : 'border-slate-200 dark:border-slate-700 site-subpanel hover:border-indigo-300'
                                                    }`}
                                                >
                                                    <div className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 transition ${
                                                        checked ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'
                                                    }`}>
                                                        {checked
                                                            ? <Check className="h-4 w-4 text-white" />
                                                            : <GraduationCap className="h-4 w-4 site-text-muted" />}
                                                    </div>
                                                    <div>
                                                        <p className={`text-[14px] font-bold ${checked ? 'text-indigo-700 dark:text-indigo-300' : 'site-text-strong'}`}>
                                                            {cls.name}
                                                        </p>
                                                        <p className="text-[12px] site-text-muted">{cls.grade}</p>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : (
                                <div className="site-subpanel rounded-[20px] px-5 py-4 flex items-center gap-3">
                                    <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />
                                    <p className="text-[13px] site-text-muted">
                                        You have no classes yet.{' '}
                                        <Link href="/teacher/classes" className="text-indigo-500 hover:underline font-semibold">Create a class first.</Link>
                                    </p>
                                </div>
                            )}

                            <div className="flex justify-between">
                                <button
                                    onClick={() => setStep(3)}
                                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-full site-subpanel font-bold text-[14px] site-text transition hover:scale-[1.01]"
                                >
                                    <ChevronLeft className="h-4 w-4" /> Back
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={!title.trim() || isSaving}
                                    className="flex items-center gap-2 px-7 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-[15px] shadow-md transition hover:scale-[1.01]"
                                >
                                    {isSaving
                                        ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</>
                                        : <><Send className="h-4 w-4" /> Save Assignment</>}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
