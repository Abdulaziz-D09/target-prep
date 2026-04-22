'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { GraduationCap, Plus, Trash2, Copy, ChevronRight, X, Users, ClipboardList } from 'lucide-react';
import {
    FloatingPageShapes,
    itemRevealVariants,
    pageRevealVariants,
    staggerContainerVariants,
} from '@/components/SiteMotion';
import { useClassroomStore, seedOnce } from '@/store/classroomStore';

// Seed synchronously so classes are visible on first render
seedOnce();

const GRADES = ['9th Grade', '10th Grade', '11th Grade', '12th Grade', 'Mixed'];

export default function ClassesPage() {
    const shouldReduceMotion = useReducedMotion();
    const router = useRouter();
    const { classrooms, students, assignments, seed, addClassroom, deleteClassroom } = useClassroomStore();

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [newName, setNewName] = useState('');
    const [newGrade, setNewGrade] = useState('11th Grade');
    const [copiedId, setCopiedId] = useState<string | null>(null);

    useEffect(() => { seed(); }, [seed]);


    const handleCreate = () => {
        if (!newName.trim()) return;
        addClassroom(newName.trim(), newGrade);
        setNewName('');
        setNewGrade('11th Grade');
        setIsCreateOpen(false);
    };

    const handleCopyCode = (e: React.MouseEvent, code: string, id: string) => {
        e.stopPropagation();
        navigator.clipboard.writeText(code);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 1500);
    };

    const handleDeleteClick = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setConfirmDeleteId(id);
    };

    return (
        <div className="relative min-h-screen pt-4 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="site-atmosphere site-atmosphere--home" />
            <FloatingPageShapes theme="home" />

            <motion.div
                className="relative z-10 mx-auto max-w-[1000px]"
                initial={shouldReduceMotion ? undefined : 'hidden'}
                animate={shouldReduceMotion ? undefined : 'visible'}
                variants={pageRevealVariants}
            >
                {/* Header */}
                <motion.div
                    className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8"
                    variants={itemRevealVariants}
                >
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 rounded-full text-xs font-bold uppercase tracking-widest mb-3 border border-indigo-500/20">
                            Teacher Portal
                        </div>
                        <h1 className="text-3xl font-black tracking-[-0.03em] site-text-strong">My Classes</h1>
                        <p className="mt-1 text-sm site-text-muted">Manage your classrooms and student groups.</p>
                    </div>
                    <button
                        onClick={() => setIsCreateOpen(true)}
                        className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white transition hover:scale-[1.03] shadow-md bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 shrink-0"
                    >
                        <Plus className="h-4 w-4" />
                        Create Class
                    </button>
                </motion.div>

                {/* Grid */}
                {classrooms.length === 0 ? (
                    <motion.div variants={itemRevealVariants}>
                        <div className="site-panel rounded-[24px] p-12 flex flex-col items-center text-center" style={{ border: '2px dashed' }}>
                            <GraduationCap className="h-12 w-12 site-text-muted mb-4 opacity-30" />
                            <p className="font-bold site-text-strong text-lg">No classes yet</p>
                            <p className="site-text-muted text-sm mt-1 mb-5">Click &ldquo;Create Class&rdquo; to get started.</p>
                            <button
                                onClick={() => setIsCreateOpen(true)}
                                className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition hover:scale-[1.02] shadow-md"
                            >
                                <Plus className="h-4 w-4" /> Create Class
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div className="grid gap-5 sm:grid-cols-2" variants={staggerContainerVariants}>
                        {classrooms.map((cls) => {
                            const studentCount = students.filter((s) => s.classroomId === cls.id).length;
                            const assignmentCount = assignments.filter((a) => a.classroomIds.includes(cls.id)).length;
                            return (
                                <motion.div key={cls.id} variants={itemRevealVariants}>
                                    <div
                                        className="site-panel rounded-[24px] p-6 border-t-4 border-t-indigo-500 cursor-pointer hover:scale-[1.015] transition-transform group"
                                        onClick={() => router.push(`/teacher/classes/${cls.id}`)}
                                    >
                                        {/* Card header */}
                                        <div className="flex items-start justify-between gap-3 mb-2">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <GraduationCap className="h-5 w-5 text-indigo-500 shrink-0" />
                                                <h2 className="text-[17px] font-bold site-text-strong tracking-tight truncate">{cls.name}</h2>
                                            </div>
                                            <div className="flex items-center gap-1 shrink-0">
                                                <button
                                                    onClick={(e) => handleCopyCode(e, cls.joinCode, cls.id)}
                                                    className="h-8 w-8 rounded-lg site-subpanel flex items-center justify-center hover:scale-[1.1] transition text-indigo-500"
                                                    title="Copy Class Code"
                                                >
                                                    <Copy className="h-3.5 w-3.5" />
                                                </button>
                                                <button
                                                    onClick={(e) => handleDeleteClick(e, cls.id)}
                                                    className="h-8 w-8 rounded-lg site-subpanel flex items-center justify-center hover:scale-[1.1] transition text-rose-500"
                                                    title="Delete Class"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </div>

                                        <p className="text-[13px] site-text-muted mb-4">{cls.grade}</p>

                                        {/* Stats pills */}
                                        <div className="flex flex-wrap gap-2 mb-5">
                                            <div className="flex items-center gap-1.5 site-subpanel rounded-full px-3 py-1.5 text-[12px] font-semibold site-text">
                                                <Users className="h-3.5 w-3.5 text-blue-500" />
                                                {studentCount} student{studentCount !== 1 ? 's' : ''}
                                            </div>
                                            <div className="flex items-center gap-1.5 site-subpanel rounded-full px-3 py-1.5 text-[12px] font-semibold site-text">
                                                <ClipboardList className="h-3.5 w-3.5 text-emerald-500" />
                                                {assignmentCount} assignment{assignmentCount !== 1 ? 's' : ''}
                                            </div>
                                        </div>

                                        {/* Join Code footer */}
                                        <div className="border-t border-slate-200 dark:border-slate-700/50 pt-4 flex items-center justify-between">
                                            <div>
                                                <p className="text-[10px] uppercase tracking-[0.18em] font-bold site-text-muted mb-0.5">Join Code</p>
                                                <span className="font-mono font-bold text-xl tracking-[0.18em] site-text-strong">
                                                    {copiedId === cls.id ? '✓ Copied!' : cls.joinCode}
                                                </span>
                                            </div>
                                            <ChevronRight className="h-5 w-5 site-text-muted group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}
            </motion.div>

            {/* ── Create Modal ─────────────────────────────────────────────── */}
            <AnimatePresence>
                {isCreateOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                            onClick={() => setIsCreateOpen(false)}
                        />
                        <motion.div
                            initial={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.94, y: 12 }}
                            animate={shouldReduceMotion ? undefined : { opacity: 1, scale: 1, y: 0 }}
                            exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.94, y: 12 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="relative w-full max-w-md rounded-[24px] site-panel shadow-2xl p-7"
                        >
                            <button onClick={() => setIsCreateOpen(false)} className="absolute right-5 top-5 p-2 rounded-full site-subpanel hover:scale-105 transition">
                                <X className="w-4 h-4 site-text" />
                            </button>
                            <h2 className="text-2xl font-black tracking-[-0.03em] site-text-strong mb-1">Create New Class</h2>
                            <p className="text-[14px] site-text-muted mb-6">A unique join code is generated automatically.</p>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[11px] font-bold uppercase tracking-widest site-text-muted mb-2">Class Name</label>
                                    <input
                                        autoFocus
                                        type="text"
                                        placeholder="e.g. SAT March–May 2026"
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                                        className="w-full px-4 py-3 rounded-xl site-subpanel bg-transparent outline-none border-2 border-transparent focus:border-indigo-500 transition text-[15px] font-semibold site-text-strong placeholder:font-normal placeholder:site-text-muted"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold uppercase tracking-widest site-text-muted mb-2">Grade Level</label>
                                    <select
                                        value={newGrade}
                                        onChange={(e) => setNewGrade(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl site-subpanel bg-transparent outline-none border-2 border-transparent focus:border-indigo-500 transition text-[15px] font-semibold site-text-strong cursor-pointer"
                                    >
                                        {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
                                    </select>
                                </div>
                            </div>

                            <button
                                onClick={handleCreate}
                                disabled={!newName.trim()}
                                className="mt-6 w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-[15px] shadow-md transition hover:scale-[1.01]"
                            >
                                <Plus className="h-4 w-4" />
                                Create Class
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ── Confirm Delete Modal ───────────────────────────────────────── */}
            <AnimatePresence>
                {confirmDeleteId && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                            onClick={() => setConfirmDeleteId(null)}
                        />
                        <motion.div
                            initial={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.94, y: 12 }}
                            animate={shouldReduceMotion ? undefined : { opacity: 1, scale: 1, y: 0 }}
                            exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.94, y: 12 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="relative w-full max-w-sm rounded-[24px] site-panel shadow-2xl p-7 text-center"
                        >
                            <div className="h-12 w-12 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center mx-auto mb-4">
                                <Trash2 className="h-5 w-5 text-rose-500" />
                            </div>
                            <h2 className="text-xl font-black site-text-strong mb-2">Delete Class?</h2>
                            <p className="text-[14px] site-text-muted mb-6">
                                All associated student data will be removed. This cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setConfirmDeleteId(null)}
                                    className="flex-1 py-3 rounded-xl site-subpanel font-bold text-[14px] site-text transition hover:scale-[1.01]"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => { deleteClassroom(confirmDeleteId!); setConfirmDeleteId(null); }}
                                    className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-[14px] shadow-md transition hover:scale-[1.01]"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
