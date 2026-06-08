'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CheckCircle, Upload, FileText, X, Loader2, BookOpen, Calculator } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useClassroomStore } from '@/store/classroomStore';
import { createClient } from '@/lib/supabase/client';

import {
    FloatingPageShapes,
    staggerContainerVariants,
    itemRevealVariants,
    sectionRevealVariants,
    pageRevealVariants
} from '@/components/SiteMotion';
import Link from 'next/link';
import { LatexRenderer } from '@/components/LatexRenderer';
import { PassageRenderer } from '@/components/PassageRenderer';

export default function TeacherMocksCreatePage() {
    const router = useRouter();
    const { createMockSession, seed } = useClassroomStore();

    // Form state
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [place, setPlace] = useState('');
    const [maxStudents, setMaxStudents] = useState('20');
    const [timeLimit, setTimeLimit] = useState('120');
    const [subject, setSubject] = useState<'Full' | 'English' | 'Math'>('Full');
    const [strictMode, setStrictMode] = useState(false);
    const [host, setHost] = useState('');
    const [customTests, setCustomTests] = useState<{ file: File; id: string; name: string; questions: any[] }[]>([]);
    
    // Document Scanning & Parsing State
    const [inputTab, setInputTab] = useState<'upload' | 'paste'>('upload');
    const [pastedText, setPastedText] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [scanError, setScanError] = useState('');
    const [reviewingTest, setReviewingTest] = useState<{ file: File, questions: any[] } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        seed();
        const supabase = createClient();
        supabase.auth.getUser().then(({ data }) => {
            if (data?.user) {
                const meta = data.user.user_metadata;
                const firstName = meta?.first_name || '';
                const lastName = meta?.last_name || meta?.surname || '';
                const fullNameFallback = `${firstName} ${lastName}`.trim();
                const displayName = meta?.full_name || meta?.name || fullNameFallback || data.user.email?.split('@')[0] || 'Teacher';
                setHost(displayName);
            }
        });
    }, [seed]);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file && (file.type === 'application/pdf' || file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.pdf'))) {
            scanFile(file);
        }
    };

    const scanText = async () => {
        if (!pastedText.trim()) {
            setScanError('Please paste some text before scanning.');
            return;
        }

        setIsScanning(true);
        setScanError('');
        try {
            const res = await fetch('/api/scan-pdf', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: pastedText }),
            });
            const data = await res.json();
            if (!res.ok) {
                setScanError(data.error || 'Scan failed');
                return;
            }
            if (data.questions) {
                const qs = data.questions.map((q: any, i: number) => {
                    const optionsArray = [
                        q.options?.A || '',
                        q.options?.B || '',
                        q.options?.C || '',
                        q.options?.D || ''
                    ];
                    return {
                        id: `mock-q-${Date.now()}-${i}`,
                        passage: q.passage || null,
                        question: q.stem || q.question || '',
                        options: optionsArray,
                        answer: null
                    };
                });
                setReviewingTest({ file: new File([pastedText], "Pasted Text Document", { type: "text/plain" }), questions: qs });
                setPastedText(''); // Clear on success
            } else {
                setScanError('No questions found in text.');
            }
        } catch (err) {
            setScanError('An error occurred during scanning. ' + String(err));
        } finally {
            setIsScanning(false);
        }
    };

    const scanFile = async (file: File) => {
        if (file.size > 20 * 1024 * 1024) {
            setScanError(`File "${file.name}" is too large. Maximum allowed size is 20MB.`);
            return;
        }

        setIsScanning(true);
        setScanError('');
        try {
            const fd = new FormData();
            fd.append('file', file);
            const res = await fetch('/api/scan-pdf', { method: 'POST', body: fd });
            const data = await res.json();
            if (!res.ok) {
                setScanError(data.error || 'Scan failed');
                return;
            }
            if (data.questions) {
                const qs = data.questions.map((q: any, i: number) => {
                    const optionsArray = [
                        q.options?.A || '',
                        q.options?.B || '',
                        q.options?.C || '',
                        q.options?.D || ''
                    ];
                    return {
                        id: `mock-q-${Date.now()}-${i}`,
                        passage: q.passage || null,
                        question: q.stem || q.question || '',
                        options: optionsArray,
                        answer: null
                    };
                });
                setReviewingTest({ file, questions: qs });
            } else {
                setScanError('No questions found in document.');
            }
        } catch (err) {
            setScanError('Failed to scan document.');
        } finally {
            setIsScanning(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (customTests.length === 0) {
            setScanError('Please attach at least one test file before creating a session.');
            return;
        }

        if (isScanning || isSaving) return;
        setIsSaving(true);
        setScanError('');

        let formattedDate = date;
        if (date) {
            const d = new Date(date);
            formattedDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
        }

        createMockSession({
            title,
            date: formattedDate,
            place,
            maxStudents: parseInt(maxStudents) || 20,
            timeLimitMinutes: parseInt(timeLimit) || 120,
            attachedTestIds: ['1'],
            subject,
            strictMode,
            host,
            customTests: customTests.length > 0 ? customTests.map(t => ({ id: t.id, name: t.name, questions: t.questions })) : undefined
        });

        await new Promise(r => setTimeout(r, 400));
        router.push('/teacher/mocks');
    };

    return (
        <div className="relative min-h-screen pt-4 pb-12 px-4 sm:px-6 lg:px-8 max-w-[1320px] mx-auto">
            <FloatingPageShapes theme="home" />
            <motion.div
                className="relative z-10"
                initial="hidden"
                animate="visible"
                variants={pageRevealVariants}
            >

                {/* Hero */}
                <motion.section
                    className="site-hero-shell site-hero--home relative mb-7 overflow-hidden rounded-[36px] px-6 py-8 sm:px-8 lg:px-10"
                    variants={sectionRevealVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="absolute -left-16 top-10 h-56 w-56 rounded-full bg-blue-300/10 blur-3xl" />
                    <div className="absolute bottom-0 right-0 h-48 w-64 translate-x-10 translate-y-10 rounded-full bg-indigo-300/10 blur-3xl" />

                    <motion.div className="relative grid gap-8 xl:grid-cols-[1.15fr_0.85fr] xl:items-center" variants={staggerContainerVariants}>
                        <motion.div variants={itemRevealVariants}>
                            <div className="site-hero-chip inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.24em]">
                                <Sparkles className="h-3.5 w-3.5" />
                                Teacher Portal
                            </div>

                            <h1 className="site-hero-title mt-4 text-4xl font-black leading-[1.04] tracking-[-0.04em] sm:text-5xl">
                                Create Mock Session
                            </h1>
                            <p className="site-hero-body mt-4 max-w-2xl text-[15px] leading-7 sm:text-[17px]">
                                Set up a new in-person mock exam for your students.
                            </p>
                        </motion.div>
                    </motion.div>
                </motion.section>

                <motion.div variants={sectionRevealVariants} className="site-panel rounded-[32px] overflow-hidden">
                    <div className="p-6">
                        <form id="create-mock-form" onSubmit={handleCreate} className="space-y-5">
                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-bold site-text-strong mb-2">Session Title</label>
                                    <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-transparent border-2 border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 font-medium transition site-text-strong" placeholder="e.g. Saturday Grand Mock" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold site-text-strong mb-2">Host / Teacher Name</label>
                                    <input type="text" value={host} readOnly className="w-full bg-transparent border-2 border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:outline-none font-medium transition site-text-strong opacity-70 cursor-not-allowed" placeholder="e.g. Mr. Smith" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-bold site-text-strong mb-2">Date & Time</label>
                                    <input required type="datetime-local" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-transparent border-2 border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 font-medium transition site-text-strong" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold site-text-strong mb-2">Location</label>
                                    <input required type="text" value={place} onChange={e => setPlace(e.target.value)} className="w-full bg-transparent border-2 border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 font-medium transition site-text-strong" placeholder="e.g. Room 302" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-bold site-text-strong mb-2">Max Students</label>
                                    <input type="number" value={maxStudents} onChange={e => setMaxStudents(e.target.value)} className="w-full bg-transparent border-2 border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 font-medium transition site-text-strong" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold site-text-strong mb-2">Time Limit (mins)</label>
                                    <input type="number" value={timeLimit} onChange={e => setTimeLimit(e.target.value)} className="w-full bg-transparent border-2 border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 font-medium transition site-text-strong" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold site-text-strong mb-3">Mock Subject Type</label>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {[
                                        { id: 'Full', label: 'Full Mock', desc: 'Both EBRW & Math', icon: <Sparkles className="w-5 h-5" /> },
                                        { id: 'English', label: 'English Only', desc: 'Reading & Writing only', icon: <BookOpen className="w-5 h-5" /> },
                                        { id: 'Math', label: 'Math Only', desc: 'Math section only', icon: <Calculator className="w-5 h-5" /> },
                                    ].map((opt) => {
                                        const isSelected = subject === opt.id;
                                        return (
                                            <button
                                                key={opt.id}
                                                type="button"
                                                onClick={() => setSubject(opt.id as any)}
                                                className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${isSelected
                                                        ? 'border-blue-500 bg-blue-500/5 dark:bg-blue-500/10 shadow-sm'
                                                        : 'border-slate-200 dark:border-slate-800 site-subpanel hover:border-slate-300 dark:hover:border-slate-700'
                                                    }`}
                                            >
                                                <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-500/20 text-blue-500' : 'bg-slate-100 dark:bg-slate-800'}`}>
                                                    {opt.icon}
                                                </div>
                                                <div>
                                                    <p className={`font-bold text-[14px] ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'site-text-strong'}`}>{opt.label}</p>
                                                    <p className="text-[11px] site-text-muted mt-0.5 leading-relaxed">{opt.desc}</p>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold site-text-strong mb-3">Strict Mode</label>
                                <button
                                    type="button"
                                    onClick={() => setStrictMode(!strictMode)}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all ${strictMode
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                                            : 'border-slate-200 dark:border-slate-700 site-subpanel site-text hover:border-slate-300'
                                        }`}
                                >
                                    <div className="flex flex-col items-start text-left">
                                        <span className="font-bold text-[14px]">Require Full Screen</span>
                                        <span className={`text-[12px] mt-0.5 ${strictMode ? 'text-blue-600/80 dark:text-blue-400/80' : 'site-text-muted'}`}>Lock the student's screen and hide exit controls</span>
                                    </div>
                                    <div className={`w-11 h-6 rounded-full flex items-center px-1 transition-colors ${strictMode ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'}`}>
                                        <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${strictMode ? 'translate-x-5' : 'translate-x-0'}`} />
                                    </div>
                                </button>
                            </div>

                            <div>
                                <label className="block text-sm font-bold site-text-strong mb-3">Add Questions</label>
                                
                                {/* Input Tabs */}
                                <div className="flex gap-2 mb-4">
                                    {(['upload', 'paste'] as const).map((tab) => (
                                        <button
                                            key={tab}
                                            type="button"
                                            onClick={() => { setInputTab(tab); setScanError(''); }}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition ${
                                                inputTab === tab
                                                    ? 'bg-blue-600 text-white shadow'
                                                    : 'site-subpanel site-text hover:scale-[1.02]'
                                            }`}
                                        >
                                            {tab === 'upload' ? <Upload className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                                            {tab === 'upload' ? 'Upload PDF' : 'Paste Text'}
                                        </button>
                                    ))}
                                </div>

                                {/* Paste Tab Content */}
                                {inputTab === 'paste' && (
                                    <div className="flex flex-col gap-4">
                                        <textarea
                                            placeholder="Paste your questions here — e.g. from a practice test, quiz, or textbook. The AI will extract all multiple-choice questions automatically."
                                            value={pastedText}
                                            onChange={(e) => setPastedText(e.target.value)}
                                            rows={8}
                                            className="w-full px-4 py-4 rounded-2xl site-subpanel bg-transparent outline-none border-2 border-slate-200 dark:border-slate-800 focus:border-blue-500 transition text-[14px] site-text resize-none placeholder:site-text-muted leading-relaxed"
                                        />
                                        <button
                                            type="button"
                                            onClick={scanText}
                                            disabled={isScanning || !pastedText.trim()}
                                            className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-[15px] shadow-sm transition hover:scale-[1.01]"
                                        >
                                            {isScanning ? (
                                                <><Loader2 className="h-5 w-5 animate-spin" /> Scanning text...</>
                                            ) : (
                                                <><Sparkles className="h-5 w-5" /> Scan with AI</>
                                            )}
                                        </button>
                                    </div>
                                )}

                                {/* Upload Tab Content */}
                                {inputTab === 'upload' && (
                                    <div
                                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                        onDragLeave={() => setIsDragging(false)}
                                        onDrop={handleDrop}
                                        onClick={() => fileInputRef.current?.click()}
                                        className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 cursor-pointer transition-all ${isDragging
                                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                : 'border-slate-300 dark:border-slate-700 hover:border-blue-400'
                                            }`}
                                    >
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept=".pdf,.txt"
                                            className="hidden"
                                            onChange={(e) => {
                                                const f = e.target.files?.[0];
                                                if (f) { scanFile(f); }
                                            }}
                                        />
                                        {isScanning ? (
                                            <>
                                                <div className="h-14 w-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-3">
                                                    <Loader2 className="h-7 w-7 text-blue-500 animate-spin" />
                                                </div>
                                                <p className="font-bold site-text-strong text-[15px]">Scanning document...</p>
                                                <p className="text-[13px] site-text-muted mt-1">Extracting mock test questions</p>
                                            </>
                                        ) : (
                                            <>
                                                <div className="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                                                    <Upload className="h-7 w-7 site-text-muted" />
                                                </div>
                                                <p className="font-bold site-text-strong text-[15px]">Drop your PDF or TXT files here</p>
                                                <p className="text-[13px] site-text-muted mt-1 mb-2">Upload multiple files to randomize tests (Max 20MB per file)</p>
                                                <p className="text-[11px] text-orange-500 font-medium">Note: The AI scanner cannot extract pictures/images from documents.</p>
                                            </>
                                        )}
                                    </div>
                                )}
                                {customTests.length > 0 && (
                                    <div className="mt-4 space-y-3">
                                        {customTests.map((t, idx) => (
                                            <div key={t.id} className="flex items-center justify-between p-3 border-2 border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/30">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                                                        <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold site-text-strong text-[14px]">{t.name}</p>
                                                        <p className="text-[12px] site-text-muted mt-0.5">{t.questions.length} questions parsed</p>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setCustomTests(prev => prev.filter(test => test.id !== t.id));
                                                    }}
                                                    className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition text-rose-500"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {scanError && (
                                    <p className="text-red-500 text-sm mt-2 font-bold">{scanError}</p>
                                )}
                            </div>
                        </form>
                    </div>

                    <div className="p-6 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-900/50 flex justify-end gap-3">
                        <Link href="/teacher/mocks" className="px-5 py-3 font-bold site-text-muted hover:site-text-strong transition">Cancel</Link>
                        <button disabled={isScanning || isSaving} form="create-mock-form" type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-bold shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed">
                            {isSaving ? 'Creating...' : isScanning ? 'Wait for Scan...' : 'Create Session'}
                        </button>
                    </div>
                </motion.div>
            </motion.div>

            {/* Answer Key Review Modal */}
            <AnimatePresence>
                {reviewingTest && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col relative z-10 overflow-hidden"
                        >
                            <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-white/10">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-800 dark:text-white">Review Answer Key</h2>
                                    <p className="text-sm site-text-muted mt-1">Set correct answers for: {reviewingTest.file.name}</p>
                                </div>
                                <button onClick={() => setReviewingTest(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full text-slate-400 transition">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                {reviewingTest.questions.map((q, idx) => (
                                    <div key={idx} className={`p-5 rounded-xl border-2 ${q.answer === null ? 'border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-900/30' : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30'}`}>
                                        {/* Question header: number + stem */}
                                        <div className="flex items-start gap-3 mb-4">
                                            <div className="h-8 w-8 flex-shrink-0 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
                                                {idx + 1}
                                            </div>
                                            <div className="w-full">
                                                {q.passage && (
                                                    <div className="mb-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800/60 overflow-hidden">
                                                        <PassageRenderer
                                                            text={q.passage}
                                                            highlights={[]}
                                                            onAddHighlight={() => {}}
                                                            onRemoveHighlight={() => {}}
                                                            onUpdateHighlight={() => {}}
                                                            isHighlightModeActive={false}
                                                        />
                                                    </div>
                                                )}
                                                <div className="font-semibold site-text-strong text-[15px] leading-relaxed">
                                                    {q.question ? <LatexRenderer text={q.question} /> : '(No question text)'}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Answer choices listed vertically — click to mark correct */}
                                        <div className="space-y-2 ml-11">
                                            {['A', 'B', 'C', 'D'].map((letter, optIdx) => (
                                                <button
                                                    key={letter}
                                                    type="button"
                                                    onClick={() => {
                                                        const newQs = [...reviewingTest.questions];
                                                        newQs[idx].answer = optIdx;
                                                        setReviewingTest({ ...reviewingTest, questions: newQs });
                                                    }}
                                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all ${
                                                        q.answer === optIdx
                                                            ? 'bg-emerald-50 border-emerald-500 dark:bg-emerald-900/20 dark:border-emerald-500'
                                                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-emerald-400'
                                                    }`}
                                                >
                                                    <span className={`w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                                                        q.answer === optIdx
                                                            ? 'bg-emerald-500 text-white'
                                                            : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                                                    }`}>{letter}</span>
                                                    <span className={`text-[14px] font-medium ${
                                                        q.answer === optIdx ? 'text-emerald-700 dark:text-emerald-300' : 'site-text-strong'
                                                    }`}>
                                                        <LatexRenderer text={q.options?.[optIdx] || `Option ${letter}`} />
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                        {q.answer === null && <p className="text-xs text-red-500 font-bold ml-11 mt-2">Please select the correct answer.</p>}
                                    </div>
                                ))}
                            </div>

                            <div className="p-6 border-t border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-slate-900 flex justify-end gap-3">
                                <button type="button" onClick={() => setReviewingTest(null)} className="px-5 py-3 font-bold site-text-muted hover:site-text-strong transition">Cancel</button>
                                <button
                                    type="button"
                                    disabled={reviewingTest.questions.some(q => q.answer === null)}
                                    onClick={() => {
                                        const newTestId = Date.now().toString();
                                        setCustomTests(prev => [...prev, {
                                            file: reviewingTest.file,
                                            id: newTestId,
                                            name: reviewingTest.file.name,
                                            questions: reviewingTest.questions
                                        }]);
                                        setReviewingTest(null);
                                    }}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-full font-bold shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Save Test File
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
