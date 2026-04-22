'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ClipboardList, Plus, Trash2, GraduationCap, CalendarDays, ArrowRight, Clock3 } from 'lucide-react';
import {
    FloatingPageShapes, itemRevealVariants, pageRevealVariants, staggerContainerVariants,
} from '@/components/SiteMotion';
import { useClassroomStore, seedOnce } from '@/store/classroomStore';

// Seed synchronously so assignments are available on first render
seedOnce();

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function AssignmentsPage() {
    const shouldReduceMotion = useReducedMotion();
    const { assignments, classrooms, deleteAssignment, seed } = useClassroomStore();

    useEffect(() => { seed(); }, [seed]);

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
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-600 text-white dark:bg-indigo-500/20 dark:text-indigo-400 rounded-full text-xs font-bold uppercase tracking-widest mb-3 shadow-sm border border-transparent dark:border-indigo-500/20">
                            Teacher Portal
                        </div>
                        <h1 className="text-3xl font-black tracking-[-0.03em] site-text-strong">Assignments</h1>
                        <p className="mt-1 text-sm site-text-muted">Create and manage assignments for your classes.</p>
                    </div>
                    <Link
                        href="/teacher/assignments/create"
                        className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white transition hover:scale-[1.03] shadow-md bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 shrink-0"
                    >
                        <Plus className="h-4 w-4" />
                        New Assignment
                    </Link>
                </motion.div>

                {/* List */}
                {assignments.length === 0 ? (
                    <motion.div variants={itemRevealVariants}>
                        <div className="site-panel rounded-[24px] p-12 flex flex-col items-center text-center" style={{ border: '2px dashed' }}>
                            <ClipboardList className="h-12 w-12 site-text-muted mb-4 opacity-30" />
                            <p className="font-bold site-text-strong text-lg">No assignments yet</p>
                            <p className="site-text-muted text-sm mt-1 mb-5">Use the AI scanner to create your first assignment from a PDF or pasted text.</p>
                            <Link
                                href="/teacher/assignments/create"
                                className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition hover:scale-[1.02] shadow-md"
                            >
                                <Plus className="h-4 w-4" /> New Assignment
                            </Link>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div className="flex flex-col gap-3" variants={staggerContainerVariants}>
                        {assignments.map((asgn) => {
                            const assignedClassrooms = classrooms.filter((c) => asgn.classroomIds.includes(c.id));
                            const subjectColor = asgn.subject === 'Math'
                                ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400'
                                : 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
                            return (
                                <motion.div key={asgn.id} variants={itemRevealVariants}>
                                    <div className="site-panel rounded-[20px] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:scale-[1.005] transition-transform">
                                        <Link href={`/teacher/assignments/${asgn.id}`} className="flex items-start gap-4 min-w-0 flex-1">
                                            <div className="h-11 w-11 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
                                                <ClipboardList className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                                    <h2 className="font-bold text-[15px] site-text-strong leading-tight">{asgn.title}</h2>
                                                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${subjectColor}`}>
                                                        {asgn.subject}
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
                                                    <span className="flex items-center gap-1 text-[12px] site-text-muted">
                                                        <CalendarDays className="h-3.5 w-3.5" />
                                                        {formatDate(asgn.createdAt)}
                                                    </span>
                                                    <span className="text-[12px] site-text-muted">
                                                        {asgn.questions.length} question{asgn.questions.length !== 1 ? 's' : ''}
                                                    </span>
                                                    <span className="flex items-center gap-1 text-[12px] site-text-muted">
                                                        <Clock3 className="h-3.5 w-3.5" />
                                                        {asgn.timeLimitMinutes} min
                                                    </span>
                                                </div>
                                                {assignedClassrooms.length > 0 && (
                                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                                        {assignedClassrooms.map((c) => (
                                                            <span
                                                                key={c.id}
                                                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-[11px] font-bold"
                                                            >
                                                                <GraduationCap className="h-2.5 w-2.5" />
                                                                {c.name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </Link>

                                        <div className="flex items-center gap-2 sm:ml-auto pl-[52px] sm:pl-0">
                                            <Link
                                                href={`/teacher/assignments/${asgn.id}`}
                                                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition"
                                            >
                                                Open
                                                <ArrowRight className="h-3.5 w-3.5" />
                                            </Link>
                                            <button
                                                onClick={(event) => {
                                                    event.preventDefault();
                                                    event.stopPropagation();
                                                    deleteAssignment(asgn.id);
                                                }}
                                                className="h-9 w-9 rounded-full site-subpanel flex items-center justify-center hover:scale-[1.1] transition text-rose-500"
                                                title="Delete Assignment"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
