const fs = require('fs');

const code = `
'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CheckCircle, Upload, FileText, X, Loader2, BookOpen, Calculator, Image as ImageIcon, GraduationCap, Check, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useClassroomStore } from '@/store/classroomStore';

import {
    FloatingPageShapes,
    staggerContainerVariants,
    itemRevealVariants,
    sectionRevealVariants,
    pageRevealVariants
} from '@/components/SiteMotion';
import Link from 'next/link';
import { MockTestFilesEditor } from '@/components/MockTestFilesEditor';

export default function CreateAssignmentPage() {
    const router = useRouter();
    const classrooms = useClassroomStore(state => state.classrooms);
    const addAssignment = useClassroomStore(state => state.addAssignment);
    const seed = useClassroomStore(state => state.seed);

    useEffect(() => {
        seed();
    }, [seed]);

    // Form state
    const [title, setTitle] = useState('');
    const [subject, setSubject] = useState<'English' | 'Math' | 'Both'>('English');
    const [selectedClassroomIds, setSelectedClassroomIds] = useState<string[]>([]);
    const [timeLimitMinutes, setTimeLimitMinutes] = useState(60);
    const [allowExit, setAllowExit] = useState(false);
    const [strictToleranceSeconds, setStrictToleranceSeconds] = useState(5);
    const [customTests, setCustomTests] = useState<{ file?: File; id: string; name: string; questions: any[] }[]>([]);
    
    // Document Scanning State
    const [isDragging, setIsDragging] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [scanError, setScanError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const toggleClassroom = (id: string) => {
        setSelectedClassroomIds(prev => 
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        );
    };

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
            setScanError(\`File "\${file.name}" is too large. Maximum allowed size is 20MB.\`);
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
                        id: \`assign-q-\${Date.now()}-\${i}\`,
                        passage: q.passage || null,
                        question: q.stem || q.question || '',
                        options: optionsArray,
                        answer: null
                    };
                });
                setCustomTests(prev => [...prev, { file, id: \`assign-test-\${Date.now()}\`, name: file.name, questions: qs }]);
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
            setScanError('Please attach at least one test file or create manually before saving.');
            return;
        }
        
        if (selectedClassroomIds.length === 0) {
            setScanError('Please select at least one classroom.');
            return;
        }

        if (isScanning || isSaving) return;
        
        setIsSaving(true);
        setScanError('');

        // Map questions back to ParsedQuestion format
        const allQuestions = customTests.flatMap(test => 
            test.questions.map(q => ({
                id: q.id,
                passage: q.passage,
                stem: q.question,
                options: {
                    A: q.options[0] || '',
                    B: q.options[1] || '',
                    C: q.options[2] || '',
                    D: q.options[3] || '',
                },
                answer: q.answer === 0 ? 'A' : q.answer === 1 ? 'B' : q.answer === 2 ? 'C' : q.answer === 3 ? 'D' : null,
                imageUrl: q.imageUrl,
            }))
        );

        addAssignment({
            title: title.trim(),
            subject,
            classrooms: selectedClassroomIds,
            status: 'draft',
            questions: allQuestions as any,
            timeLimitMinutes,
            allowExit,
            strictToleranceSeconds
        });

        await new Promise(r => setTimeout(r, 400));
        router.push('/teacher/assignments');
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
                                ASSIGNMENT BUILDER
                            </div>

                            <h1 className="site-hero-title mt-4 text-4xl font-black leading-[1.04] tracking-[-0.04em] sm:text-5xl">
                                New Assignment
                            </h1>
                            <p className="site-hero-body mt-4 max-w-2xl text-[15px] leading-7 sm:text-[17px]">
                                AI scans your text or PDF and extracts every multiple-choice question.
                            </p>
                        </motion.div>
                    </motion.div>
                </motion.section>

                <motion.div variants={sectionRevealVariants} className="site-panel rounded-[32px] overflow-hidden">
                    <div className="p-6">
                        <form id="create-assignment-form" onSubmit={handleCreate} className="space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-bold site-text-strong mb-2">Assignment Title</label>
                                    <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-transparent border-2 border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 font-medium transition site-text-strong" placeholder="e.g. Unit 3 Math Review" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold site-text-strong mb-2">Time Limit (mins)</label>
                                    <input required type="number" min={1} value={timeLimitMinutes} onChange={e => setTimeLimitMinutes(Number(e.target.value))} className="w-full bg-transparent border-2 border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 font-medium transition site-text-strong" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-bold site-text-strong mb-3">Subject Type</label>
                                    <div className="flex gap-4">
                                        {[
                                            { id: 'Both', label: 'Both' },
                                            { id: 'English', label: 'English' },
                                            { id: 'Math', label: 'Math' },
                                        ].map((opt) => {
                                            const isSelected = subject === opt.id;
                                            return (
                                                <button
                                                    key={opt.id}
                                                    type="button"
                                                    onClick={() => setSubject(opt.id as any)}
                                                    className={\`flex-1 p-3 rounded-xl border-2 text-center transition-all cursor-pointer \${isSelected
                                                            ? 'border-indigo-500 bg-indigo-500/5 dark:bg-indigo-500/10 shadow-sm'
                                                            : 'border-slate-200 dark:border-slate-800 site-subpanel hover:border-slate-300'
                                                        }\`}
                                                >
                                                    <p className={\`font-bold text-[14px] \${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'site-text-strong'}\`}>{opt.label}</p>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                                
                                <div className="p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30">
                                    <button
                                        type="button"
                                        onClick={() => setAllowExit(!allowExit)}
                                        className="w-full flex justify-between items-center text-left"
                                    >
                                        <div className="flex flex-col items-start text-left">
                                            <span className="font-bold text-[14px] site-text-strong">Require Full Screen</span>
                                            <span className={\`text-[12px] mt-0.5 \${!allowExit ? 'text-indigo-600 dark:text-indigo-400' : 'site-text-muted'}\`}>Auto-submit if student exits</span>
                                        </div>
                                        <div className={\`w-11 h-6 rounded-full flex items-center px-1 transition-colors \${!allowExit ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'}\`}>
                                            <div className={\`w-4 h-4 rounded-full bg-white shadow-sm transition-transform \${!allowExit ? 'translate-x-5' : 'translate-x-0'}\`} />
                                        </div>
                                    </button>
                                    {!allowExit && (
                                        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800">
                                            <label className="block text-[11px] font-bold uppercase tracking-widest site-text-muted mb-2">Tolerance Timer (seconds)</label>
                                            <input
                                                type="number"
                                                min={1}
                                                value={strictToleranceSeconds || ''}
                                                onChange={(e) => {
                                                    const raw = Number(e.target.value);
                                                    setStrictToleranceSeconds(Math.max(1, Math.round(raw)));
                                                }}
                                                className="w-full px-4 py-2 rounded-xl site-subpanel bg-transparent outline-none border-2 border-slate-200 dark:border-slate-700 focus:border-indigo-500 transition text-[14px] font-bold site-text-strong"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {classrooms.length > 0 ? (
                                <div className="mt-6">
                                    <label className="block text-sm font-bold site-text-strong mb-3">Send to Classes</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                        {classrooms.map((cls) => {
                                            const checked = selectedClassroomIds.includes(cls.id);
                                            return (
                                                <button
                                                    key={cls.id}
                                                    type="button"
                                                    onClick={() => toggleClassroom(cls.id)}
                                                    className={\`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all \${
                                                        checked
                                                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                                                            : 'border-slate-200 dark:border-slate-700 site-subpanel hover:border-indigo-300'
                                                    }\`}
                                                >
                                                    <div className={\`h-8 w-8 rounded-full flex items-center justify-center shrink-0 transition \${
                                                        checked ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'
                                                    }\`}>
                                                        {checked
                                                            ? <Check className="h-4 w-4 text-white" />
                                                            : <GraduationCap className="h-4 w-4 site-text-muted" />}
                                                    </div>
                                                    <div>
                                                        <p className={\`text-[13px] font-bold \${checked ? 'text-indigo-700 dark:text-indigo-300' : 'site-text-strong'}\`}>
                                                            {cls.name}
                                                        </p>
                                                        <p className="text-[11px] site-text-muted">{cls.grade}</p>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : (
                                <div className="site-subpanel rounded-[20px] px-5 py-4 flex items-center gap-3 mt-4">
                                    <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />
                                    <p className="text-[13px] site-text-muted">
                                        You have no classes yet.{' '}
                                        <Link href="/teacher/classes" className="text-indigo-500 hover:underline font-semibold">Create a class first.</Link>
                                    </p>
                                </div>
                            )}

                            <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
                                <label className="block text-sm font-bold site-text-strong mb-3">Add Questions</label>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Upload Area */}
                                    <div
                                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                        onDragLeave={() => setIsDragging(false)}
                                        onDrop={handleDrop}
                                        onClick={() => fileInputRef.current?.click()}
                                        className={\`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 cursor-pointer transition-all \${isDragging
                                                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                                                : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400'
                                            }\`}
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
                                                <div className="h-14 w-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center mb-3">
                                                    <Loader2 className="h-7 w-7 text-indigo-500 animate-spin" />
                                                </div>
                                                <p className="font-bold site-text-strong text-[15px]">Scanning document...</p>
                                                <p className="text-[13px] site-text-muted mt-1">Extracting questions...</p>
                                            </>
                                        ) : (
                                            <>
                                                <div className="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                                                    <Upload className="h-7 w-7 site-text-muted" />
                                                </div>
                                                <p className="font-bold site-text-strong text-[15px]">Upload or drop your test files here</p>
                                                <p className="text-[13px] site-text-muted mt-1 mb-2 text-center">Upload picture of a test or PDF to extract questions</p>
                                            </>
                                        )}
                                    </div>

                                    {/* Create Manually Area */}
                                    <div 
                                        onClick={() => {
                                            const newTest = {
                                                id: \`manual-test-\${Date.now()}\`,
                                                name: \`Manual Test \${customTests.length + 1}\`,
                                                questions: [{
                                                    id: \`assign-q-\${Date.now()}-0\`,
                                                    passage: '',
                                                    question: '',
                                                    options: ['', '', '', ''],
                                                    answer: null
                                                }]
                                            };
                                            setCustomTests(prev => [...prev, newTest]);
                                        }}
                                        className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 cursor-pointer transition-all border-slate-300 dark:border-slate-700 hover:border-indigo-400"
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

                                {scanError && (
                                    <p className="text-red-500 text-sm mt-2 font-bold">{scanError}</p>
                                )}
                            </div>
                        </form>
                    </div>

                    <div className="p-6 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-900/50 flex justify-end gap-3">
                        <Link href="/teacher/assignments" className="px-5 py-3 font-bold site-text-muted hover:site-text-strong transition">Cancel</Link>
                        <button disabled={isScanning || isSaving || selectedClassroomIds.length === 0} form="create-assignment-form" type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full font-bold shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed">
                            {isSaving ? 'Creating...' : isScanning ? 'Wait for Scan...' : 'Create Assignment'}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
`

fs.writeFileSync('src/app/teacher/assignments/create/page.tsx', code);
