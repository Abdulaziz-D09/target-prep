'use client';
import Link from 'next/link';
import { useState } from 'react';
import { ClipboardList, Plus, ChevronRight, GraduationCap, Trash2, Sparkles } from 'lucide-react';
import {
    FloatingPageShapes,
    staggerContainerVariants,
    itemRevealVariants,
    sectionRevealVariants,
    pageRevealVariants
} from '@/components/SiteMotion';
import { motion } from 'framer-motion';
import { useClassroomStore, seedOnce } from '@/store/classroomStore';

seedOnce();

function scoreColor(pct: number) {
    if (pct >= 80) return 'text-emerald-500';
    if (pct >= 60) return 'text-amber-500';
    return 'text-rose-500';
}

export default function AssignmentsPage() {
    const assignments = useClassroomStore(state => state.assignments);
    const classrooms = useClassroomStore(state => state.classrooms);
    const students = useClassroomStore(state => state.students);
    const progress = useClassroomStore(state => state.progress);
    const deleteAssignment = useClassroomStore(state => state.deleteAssignment);
    const [deleteId, setDeleteId] = useState<string | null>(null);

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
                    <div className="absolute -left-16 top-10 h-56 w-56 rounded-full bg-indigo-300/10 blur-3xl" />
                    <div className="absolute bottom-0 right-0 h-48 w-64 translate-x-10 translate-y-10 rounded-full bg-blue-300/10 blur-3xl" />

                    <motion.div className="relative grid gap-8 xl:grid-cols-[1.15fr_0.85fr] xl:items-center" variants={staggerContainerVariants}>
                        <motion.div variants={itemRevealVariants}>
                            <div className="site-hero-chip inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.24em]">
                                <Sparkles className="h-3.5 w-3.5" />
                                Teacher Portal
                            </div>

                            <h1 className="site-hero-title mt-4 text-4xl font-black leading-[1.04] tracking-[-0.04em] sm:text-5xl">
                                Assignments
                            </h1>
                            <p className="site-hero-body mt-4 max-w-2xl text-[15px] leading-7 sm:text-[17px]">
                                Click an assignment to view class results and student breakdown.
                            </p>
                        </motion.div>
                        <motion.div className="flex flex-col sm:flex-row gap-3 xl:justify-end" variants={itemRevealVariants}>
                            <Link
                                href="/teacher/assignments/create"
                                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-bold text-white transition hover:scale-[1.03] shadow-md bg-indigo-600 hover:bg-indigo-700 shrink-0"
                            >
                                <Plus className="h-5 w-5" />
                                New Assignment
                            </Link>
                        </motion.div>
                    </motion.div>
                </motion.section>

                {/* List Container */}
                <motion.section 
                    className="site-panel rounded-[34px] p-5 sm:p-6 mb-6" 
                    variants={sectionRevealVariants}
                    initial="hidden"
                    animate="visible"
                >
                {assignments.length === 0 ? (
                    <div className="site-panel rounded-[24px] p-16 flex flex-col items-center text-center border-2 border-slate-200 dark:border-slate-800">
                        <ClipboardList className="h-12 w-12 site-text-muted mb-4 opacity-30" />
                        <p className="font-bold site-text-strong text-lg">No assignments yet</p>
                        <p className="site-text-muted text-sm mt-1 mb-5">Create your first assignment to get started.</p>
                        <Link href="/teacher/assignments/create" className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-full transition">
                            <Plus className="h-4 w-4" /> Create Assignment
                        </Link>
                    </div>
                ) : (
                    <div className="site-panel rounded-[24px] overflow-hidden">
                        {assignments.map((asgn, idx) => {
                            const assignedClassrooms = classrooms.filter(c => asgn.classroomIds.includes(c.id));
                            const allStudents = students.filter(s => asgn.classroomIds.includes(s.classroomId));
                            const allRows = progress.filter(p => p.assignmentId === asgn.id && allStudents.some(s => s.id === p.studentId));
                            const totalCompleted = allRows.filter(r => r.completed).length;
                            const scores = allRows.filter(r => r.total > 0).map(r => (r.correct / r.total) * 100);
                            const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;
                            const isLast = idx === assignments.length - 1;

                            return (
                                <div key={asgn.id} className={`${!isLast ? 'border-b border-slate-100 dark:border-slate-800/60' : ''}`}>
                                    <div className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                                        {/* Icon */}
                                        <div className="h-11 w-11 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center shrink-0 border border-indigo-200 dark:border-indigo-800/50">
                                            <ClipboardList className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                        </div>

                                        {/* Title + class pills — clickable area */}
                                        <Link href={`/teacher/assignments/${asgn.id}`} className="flex-1 min-w-0 py-1">
                                            <h2 className="font-black text-[17px] site-text-strong leading-tight group-hover:text-indigo-500 transition truncate">{asgn.title}</h2>
                                            <div className="flex flex-wrap gap-1.5 mt-1.5">
                                                {assignedClassrooms.map(c => (
                                                    <span key={c.id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-bold">
                                                        <GraduationCap className="h-2.5 w-2.5" />{c.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </Link>

                                        {/* Stats */}
                                        <div className="flex items-center gap-8 shrink-0">
                                            <div className="text-center hidden sm:block">
                                                <p className="text-[10px] uppercase tracking-widest font-bold site-text-muted mb-0.5">Completion</p>
                                                <p className="font-black text-[15px] site-text-strong">{totalCompleted}/{allStudents.length}</p>
                                            </div>
                                            <div className="text-center hidden sm:block w-20">
                                                <p className="text-[10px] uppercase tracking-widest font-bold site-text-muted mb-0.5">Avg Score</p>
                                                {avgScore !== null
                                                    ? <p className={`font-black text-[15px] ${scoreColor(avgScore)}`}>{avgScore}%</p>
                                                    : <p className="font-black text-[15px] site-text-muted">–</p>}
                                            </div>
                                            {/* Delete */}
                                            <button
                                                onClick={() => setDeleteId(asgn.id)}
                                                className="p-2 rounded-full text-slate-300 dark:text-slate-600 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                            {/* Arrow */}
                                            <Link href={`/teacher/assignments/${asgn.id}`} className="h-9 w-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                <ChevronRight className="h-4 w-4" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
                </motion.section>
            </motion.div>

            {/* Custom Delete Confirmation Modal */}
            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={() => setDeleteId(null)}>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 p-6 max-w-sm w-full animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                        <h3 className="font-bold text-lg site-text-strong mb-2">Delete Assignment</h3>
                        <p className="site-text-muted mb-6 text-sm">Are you sure you want to delete this assignment? This action cannot be undone.</p>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setDeleteId(null)} className="px-5 py-2.5 text-sm font-bold site-text-muted hover:site-text-strong transition">
                                Cancel
                            </button>
                            <button onClick={() => { deleteAssignment(deleteId); setDeleteId(null); }} className="px-5 py-2.5 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-full transition shadow-sm">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
