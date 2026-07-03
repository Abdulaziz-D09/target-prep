'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CheckCircle, AlertCircle, Upload, FileText, X, Loader2, BookOpen, Calculator, Image as ImageIcon } from 'lucide-react';
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
import { MockTestFilesEditor } from '@/components/MockTestFilesEditor';
import { uploadFileToSupabase } from '@/lib/supabaseUpload';

export default function TeacherMocksCreatePage() {
    const router = useRouter();
    const createMockSession = useClassroomStore(state => state.createMockSession);
    const seed = useClassroomStore(state => state.seed);

    // Form state
    const [title, setTitle] = useState('');
    const [titleError, setTitleError] = useState('');
    const [isCheckingTitle, setIsCheckingTitle] = useState(false);
    const [date, setDate] = useState('');
    const [place, setPlace] = useState('');
    const [maxStudents, setMaxStudents] = useState('20');
    const [timeLimit, setTimeLimit] = useState('120');
    const [subject, setSubject] = useState<'Full' | 'English' | 'Math'>('Full');
    const [strictMode, setStrictMode] = useState(false);
    const [strictToleranceSeconds, setStrictToleranceSeconds] = useState(5);
    const [host, setHost] = useState('');
    const [customTests, setCustomTests] = useState<{ file?: File; pdfUrl?: string; id: string; name: string; questions: any[] }[]>([]);
    const [distributionMode, setDistributionMode] = useState<'random' | 'manual'>('random');

    useEffect(() => {
        const saved = localStorage.getItem('create-mock-state');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.title) setTitle(parsed.title);
                if (parsed.date) setDate(parsed.date);
                if (parsed.place) setPlace(parsed.place);
                if (parsed.maxStudents) setMaxStudents(parsed.maxStudents);
                if (parsed.timeLimit) setTimeLimit(parsed.timeLimit);
                if (parsed.subject) setSubject(parsed.subject);
                if (parsed.strictMode !== undefined) setStrictMode(parsed.strictMode);
                if (parsed.strictToleranceSeconds) setStrictToleranceSeconds(parsed.strictToleranceSeconds);
                if (parsed.distributionMode) setDistributionMode(parsed.distributionMode);
                if (parsed.customTests && Array.isArray(parsed.customTests)) {
                    setCustomTests(parsed.customTests);
                }
            } catch (e) {}
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('create-mock-state', JSON.stringify({
            title, date, place, maxStudents, timeLimit, subject, strictMode, strictToleranceSeconds, distributionMode, customTests: customTests.map(t => ({ ...t, file: undefined }))
        }));
    }, [title, date, place, maxStudents, timeLimit, subject, strictMode, strictToleranceSeconds, distributionMode, customTests]);
    
    // Document Scanning & Parsing State
    const [isDragging, setIsDragging] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [scanError, setScanError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const [uploadingImageIdx, setUploadingImageIdx] = useState<number | null>(null);

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

    useEffect(() => {
        const checkTitle = async () => {
            if (!title.trim()) {
                setTitleError('');
                setIsCheckingTitle(false);
                return;
            }
            setIsCheckingTitle(true);
            const supabase = createClient();
            const { data } = await supabase
                .from('mock_sessions')
                .select('id, title')
                .ilike('title', title.trim())
                .neq('status', 'completed')
                .limit(1);
            
            if (data && data.length > 0) {
                setTitleError('This name is already in use by another active session.');
            } else {
                setTitleError('');
            }
            setIsCheckingTitle(false);
        };

        const timeoutId = setTimeout(checkTitle, 500);
        return () => clearTimeout(timeoutId);
    }, [title]);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file && (file.type.startsWith('image/') || file.type === 'application/pdf')) {
            scanFile(file);
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
            // 1. First, upload the original PDF to Supabase so students can access it
            let uploadedPdfUrl = '';
            try {
                uploadedPdfUrl = await uploadFileToSupabase(file, 'uploads');
            } catch (uploadErr) {
                console.error('Failed to upload PDF to Supabase, but continuing to extract questions...', uploadErr);
            }

            // 2. Then, send it to the AI to extract questions
            const fd = new FormData();
            fd.append('file', file);
            const res = await fetch('/api/scan-pdf', { method: 'POST', body: fd });
            
            if (!res.ok) {
                if (res.status === 413) {
                    setScanError(`File is too large for the server to process. Please compress the PDF or split it into smaller files.`);
                    return;
                }
                
                try {
                    const errorData = await res.json();
                    setScanError(errorData.error || `Server error: ${res.status}`);
                } catch (e) {
                    setScanError(`Server error (${res.status}). The server refused the file.`);
                }
                return;
            }

            const data = await res.json();
            if (data.questions) {
                const qs = data.questions.map((q: any, i: number) => {
                    const isSPR = !q.options || (typeof q.options === 'object' && Object.values(q.options).every(v => !v));
                    
                    const optionsArray = isSPR ? [] : [
                        q.options?.A || '',
                        q.options?.B || '',
                        q.options?.C || '',
                        q.options?.D || ''
                    ];
                    return {
                        id: `mock-q-${Date.now()}-${i}`,
                        type: isSPR ? 'Math (SPR)' : 'Math',
                        passage: q.passage || null,
                        question: q.stem || q.question || '',
                        options: optionsArray,
                        answer: null
                    };
                });
                setCustomTests(prev => [...prev, { file, pdfUrl: uploadedPdfUrl, id: `mock-test-${Date.now()}`, name: file.name, questions: qs }]);
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

        if (titleError || isCheckingTitle) {
            setScanError('Please resolve the session title error before creating.');
            return;
        }

        if (customTests.length === 0) {
            setScanError('Please attach at least one test file before creating a session.');
            return;
        }

        // Validate that all questions have an answer
        let hasMissingAnswer = false;
        for (const test of customTests) {
            for (const q of test.questions) {
                if (q.answer === null || q.answer === undefined || q.answer === '') {
                    hasMissingAnswer = true;
                    break;
                }
            }
            if (hasMissingAnswer) break;
        }

        if (hasMissingAnswer) {
            setScanError('Please ensure all questions have a correct answer selected/entered before creating.');
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

        // Format custom tests mapping exactly to Question type
        const formattedTests = customTests.length > 0 ? customTests.map(test => ({
            id: test.id,
            name: test.name,
            pdfUrl: test.pdfUrl,
            questions: test.questions.map((q: any) => ({
                id: q.id,
                passage: q.passage,
                stem: q.question,
                options: {
                    A: q.options[0] || '',
                    B: q.options[1] || '',
                    C: q.options[2] || '',
                    D: q.options[3] || ''
                },
                answer: typeof q.answer === 'number' ? ['A', 'B', 'C', 'D'][q.answer] : q.answer,
                imageUrl: q.imageUrl,
                imagePosition: q.imagePosition,
                type: q.type || 'Multiple Choice'
            }))
        })) : undefined;

        useClassroomStore.getState().createMockSession({
            title,
            date: formattedDate,
            place,
            maxStudents: parseInt(maxStudents) || 20,
            timeLimitMinutes: parseInt(timeLimit) || 120,
            attachedTestIds: ['1'],
            subject,
            strictMode,
            host,
            customTests: formattedTests,
            strictToleranceSeconds: strictMode ? strictToleranceSeconds : undefined,
            distributionMode: customTests.length > 1 ? distributionMode : 'random'
        });

        localStorage.removeItem('create-mock-state');
        setTimeout(() => {
            router.push('/teacher/mocks');
        }, 100);
    };

    return (
        <div className="relative min-h-screen w-full pt-4 pb-12 px-4 sm:px-6 lg:px-8">
            <FloatingPageShapes theme="home" />
            <motion.div
                className="relative z-10 w-full mx-auto max-w-[1320px]"
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
                                    <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className={`w-full bg-transparent border-2 rounded-xl px-4 py-3 focus:outline-none font-medium transition site-text-strong ${titleError ? 'border-rose-500 focus:border-rose-600' : 'border-slate-200 dark:border-slate-800 focus:border-blue-500'}`} placeholder="e.g. Saturday Grand Mock" />
                                    {isCheckingTitle ? (
                                        <p className="text-[12px] text-blue-500 mt-1.5 font-bold animate-pulse">Checking availability...</p>
                                    ) : titleError ? (
                                        <p className="text-[12px] text-rose-500 mt-1.5 font-bold">{titleError}</p>
                                    ) : null}
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
                                
                                <div className="px-4 py-2 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30 flex items-center h-[84px] gap-4 overflow-hidden">
                                    <div className="flex flex-1 items-center gap-3">
                                        <div className="flex flex-col items-start text-left flex-1 min-w-0">
                                            <span className="font-bold text-[15px] site-text-strong truncate w-full">Require Full Screen</span>
                                            <span className={`text-[12px] sm:text-[13px] mt-0.5 ${strictMode ? 'text-indigo-600 dark:text-indigo-400' : 'site-text-muted'} leading-snug line-clamp-2`}>Lock the student's screen and hide exit controls</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setStrictMode(!strictMode)}
                                            className={`w-12 h-7 shrink-0 rounded-full flex items-center px-1 transition-colors duration-300 ${strictMode ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'}`}
                                        >
                                            <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${strictMode ? 'translate-x-5' : 'translate-x-0'}`} />
                                        </button>
                                    </div>

                                    <AnimatePresence>
                                        {strictMode && (
                                            <motion.div
                                                initial={{ width: 0, opacity: 0, scale: 0.95 }}
                                                animate={{ width: 'auto', opacity: 1, scale: 1 }}
                                                exit={{ width: 0, opacity: 0, scale: 0.95 }}
                                                transition={{ duration: 0.25, ease: 'easeInOut' }}
                                                className="flex-shrink-0 overflow-hidden"
                                            >
                                                <div className="flex flex-col items-start px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 w-[140px] ml-1">
                                                    <label className="block text-[11px] font-bold uppercase tracking-widest site-text-muted mb-1 whitespace-nowrap">Tolerance Timer</label>
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="number"
                                                            min={1}
                                                            value={strictToleranceSeconds || ''}
                                                            onChange={(e) => {
                                                                const raw = Number(e.target.value);
                                                                setStrictToleranceSeconds(Math.max(1, Math.round(raw)));
                                                            }}
                                                            className="w-[54px] pl-3 pr-1 py-0.5 rounded-lg bg-transparent outline-none border border-slate-300 dark:border-slate-600 focus:border-indigo-500 transition text-[15px] font-bold site-text-strong text-center"
                                                        />
                                                        <span className="text-[12px] font-bold site-text-muted">sec</span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold site-text-strong mb-3">Add Questions</label>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Upload Area */}
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
                                            accept="image/*,.pdf"
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
                                                <div className="mt-4 px-4 py-2 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200/50 dark:border-amber-500/20">
                                                    <p className="text-[12px] font-bold text-amber-700 dark:text-amber-400 text-center">
                                                        The AI needs about a minute to analyze and extract the questions. Please don't close this page.
                                                    </p>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                                                    <Upload className="h-7 w-7 site-text-muted" />
                                                </div>
                                                <p className="font-bold site-text-strong text-[15px]">Upload or drop your test files here</p>
                                                <p className="text-[13px] site-text-muted mt-1 mb-2 text-center">Upload picture of a test or PDF to extract questions (Max 20MB per file)</p>
                                            </>
                                        )}
                                    </div>

                                    {/* Create Manually Area */}
                                    <div 
                                        onClick={() => {
                                            const newTest = {
                                                id: `manual-test-${Date.now()}`,
                                                name: `Manual Test ${customTests.length + 1}`,
                                                questions: [{
                                                    id: `mock-q-${Date.now()}-0`,
                                                    passage: '',
                                                    question: '',
                                                    options: ['', '', '', ''],
                                                    answer: null
                                                }]
                                            };
                                            setCustomTests(prev => [...prev, newTest]);
                                        }}
                                        className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 cursor-pointer transition-all border-slate-300 dark:border-slate-700 hover:border-blue-400"
                                    >
                                        <div className="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                                            <FileText className="h-7 w-7 site-text-muted" />
                                        </div>
                                        <p className="font-bold site-text-strong text-[15px]">Create Manually</p>
                                        <p className="text-[13px] site-text-muted mt-1 mb-2 text-center">Write questions without uploading</p>
                                    </div>
                                </div>

                                {customTests.length > 0 && (
                                    <div className="mt-6">
                                        <MockTestFilesEditor 
                                            initialTests={customTests}
                                            onSave={() => {}}
                                            onChange={(updatedTests) => setCustomTests(updatedTests)}
                                            hideSaveButton={true}
                                        />
                                    </div>
                                )}
                                

                                {customTests.length > 1 && (
                                    <div className="mt-6 p-5 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30">
                                        <label className="block text-sm font-bold site-text-strong mb-3">Test Distribution Mode</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <button
                                                type="button"
                                                onClick={() => setDistributionMode('random')}
                                                className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${distributionMode === 'random'
                                                        ? 'border-blue-500 bg-blue-500/5 dark:bg-blue-500/10 shadow-sm'
                                                        : 'border-slate-200 dark:border-slate-800 site-subpanel hover:border-slate-300'
                                                    }`}
                                            >
                                                <div className={`p-2 rounded-lg ${distributionMode === 'random' ? 'bg-blue-500/20 text-blue-500' : 'bg-slate-100 dark:bg-slate-800'}`}>
                                                    <Sparkles className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className={`font-bold text-[14px] ${distributionMode === 'random' ? 'text-blue-600 dark:text-blue-400' : 'site-text-strong'}`}>Randomize</p>
                                                    <p className="text-[11px] site-text-muted mt-0.5 leading-relaxed">Students get a random test when joining.</p>
                                                </div>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setDistributionMode('manual')}
                                                className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${distributionMode === 'manual'
                                                        ? 'border-blue-500 bg-blue-500/5 dark:bg-blue-500/10 shadow-sm'
                                                        : 'border-slate-200 dark:border-slate-800 site-subpanel hover:border-slate-300'
                                                    }`}
                                            >
                                                <div className={`p-2 rounded-lg ${distributionMode === 'manual' ? 'bg-blue-500/20 text-blue-500' : 'bg-slate-100 dark:bg-slate-800'}`}>
                                                    <CheckCircle className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className={`font-bold text-[14px] ${distributionMode === 'manual' ? 'text-blue-600 dark:text-blue-400' : 'site-text-strong'}`}>Manual Assignment</p>
                                                    <p className="text-[11px] site-text-muted mt-0.5 leading-relaxed">Choose which student gets which test.</p>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </form>
                    </div>

                    <div className="p-6 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-900/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex-1">
                            {scanError && (
                                <motion.div 
                                    initial={{ opacity: 0, x: -10 }} 
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center gap-2 text-rose-500 bg-rose-50 dark:bg-rose-500/10 px-4 py-2 rounded-xl border border-rose-200 dark:border-rose-500/20"
                                >
                                    <AlertCircle className="w-5 h-5 shrink-0" />
                                    <p className="text-[14px] font-bold">{scanError}</p>
                                </motion.div>
                            )}
                        </div>
                        <div className="flex gap-3 items-center shrink-0">
                            <Link href="/teacher/mocks" className="px-5 py-3 font-bold site-text-muted hover:site-text-strong transition">Cancel</Link>
                            {(() => {
                                const isReady = title.trim() && !titleError && !isCheckingTitle && customTests.length > 0 && !isScanning && !isSaving;
                                return (
                                    <button 
                                        disabled={isScanning || isSaving} 
                                        form="create-mock-form" 
                                        type="submit" 
                                        className={`px-8 py-3 rounded-full font-bold transition-all ${isReady ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] hover:-translate-y-0.5' : 'bg-slate-800 text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed'}`}
                                    >
                                        {isSaving ? 'Creating...' : isScanning ? 'Wait for Scan...' : 'Create Session'}
                                    </button>
                                );
                            })()}
                        </div>
                    </div>
                </motion.div>
            </motion.div>

        </div>
    );
}
