'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ClipboardList, GraduationCap, Check } from 'lucide-react';
import {
    FloatingPageShapes,
    itemRevealVariants,
    pageRevealVariants,
    sectionRevealVariants,
    staggerContainerVariants,
} from '@/components/SiteMotion';
import { useClassroomStore } from '@/store/classroomStore';

const OPTION_LABELS = ['A', 'B', 'C', 'D'] as const;

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function TeacherAssignmentDetailPage() {
    const shouldReduceMotion = useReducedMotion();
    const { id } = useParams<{ id: string }>();

    const { assignments, classrooms, seed } = useClassroomStore();
    useEffect(() => { seed(); }, [seed]);

    const assignment = assignments.find((item) => item.id === id);

    if (!assignment) {
        return (
            <div className="relative min-h-screen pt-4 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="site-atmosphere site-atmosphere--home" />
                <FloatingPageShapes theme="home" />
                <div className="relative z-10 mx-auto max-w-[920px]">
                    <div className="site-panel rounded-[24px] p-8 text-center mt-20">
                        <p className="text-2xl font-black site-text-strong mb-3">Assignment not found</p>
                        <Link href="/teacher/assignments" className="text-indigo-500 hover:underline text-sm font-semibold">
                            Back to assignments
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const assignedClassrooms = classrooms.filter((cls) => assignment.classroomIds.includes(cls.id));

    return (
        <div className="relative min-h-screen pt-4 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="site-atmosphere site-atmosphere--home" />
            <FloatingPageShapes theme="home" />

            <motion.div
                className="relative z-10 mx-auto max-w-[980px]"
                initial={shouldReduceMotion ? undefined : 'hidden'}
                animate={shouldReduceMotion ? undefined : 'visible'}
                variants={pageRevealVariants}
            >
                <motion.div className="mb-6" variants={itemRevealVariants}>
                    <Link href="/teacher/assignments" className="inline-flex items-center gap-1.5 text-sm font-semibold site-text-muted hover:site-text transition">
                        <ArrowLeft className="h-4 w-4" />
                        Back to assignments
                    </Link>
                </motion.div>

                <motion.section className="site-panel rounded-[24px] p-6 mb-6" variants={sectionRevealVariants}>
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.22em] mb-3 bg-indigo-500/10 dark:bg-white/10 border border-indigo-500/30 dark:border-white/25 text-indigo-700 dark:text-white">
                                <ClipboardList className="h-3.5 w-3.5" />
                                Assignment
                            </div>
                            <h1 className="text-3xl font-black tracking-[-0.03em] site-text-strong">{assignment.title}</h1>
                            <p className="text-sm site-text-muted mt-2">
                                Created {formatDate(assignment.createdAt)} • {assignment.questions.length} question{assignment.questions.length === 1 ? '' : 's'} • {assignment.timeLimitMinutes} min
                            </p>
                        </div>

                        {assignedClassrooms.length > 0 && (
                            <div className="flex flex-wrap gap-2 justify-end">
                                {assignedClassrooms.map((cls) => (
                                    <span
                                        key={cls.id}
                                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full site-chip text-[11px] font-bold"
                                    >
                                        <GraduationCap className="h-3 w-3" />
                                        {cls.name}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.section>

                <motion.section variants={staggerContainerVariants} className="space-y-4">
                    {assignment.questions.length === 0 ? (
                        <motion.div variants={itemRevealVariants} className="site-panel rounded-[24px] p-8 text-center">
                            <p className="font-bold site-text-strong text-lg">No questions attached yet</p>
                            <p className="site-text-muted text-sm mt-2">
                                This assignment was created without a scanned question list.
                            </p>
                        </motion.div>
                    ) : (
                        assignment.questions.map((question, index) => (
                            <motion.article
                                key={question.id}
                                variants={itemRevealVariants}
                                className="site-panel rounded-[24px] p-5 sm:p-6"
                            >
                                <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
                                    <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] site-text-muted">
                                        Question {index + 1}
                                    </div>
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-500 text-[11px] font-bold">
                                        <Check className="h-3.5 w-3.5" />
                                        Correct: {question.answer}
                                    </span>
                                </div>

                                <p className="site-text-strong text-[17px] leading-relaxed mb-5">{question.stem}</p>

                                <div className="space-y-2.5">
                                    {OPTION_LABELS.map((label) => {
                                        const isCorrect = label === question.answer;

                                        return (
                                            <div
                                                key={label}
                                                className={`site-subpanel rounded-[16px] px-4 py-3 flex items-start gap-3 ${isCorrect ? 'ring-1 ring-emerald-500/45' : ''}`}
                                            >
                                                <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-black shrink-0 ${isCorrect ? 'bg-emerald-500/15 text-emerald-500' : 'bg-indigo-500/15 text-indigo-500'}`}>
                                                    {label}
                                                </span>
                                                <span className="site-text text-[15px] leading-relaxed">{question.options[label]}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.article>
                        ))
                    )}
                </motion.section>
            </motion.div>
        </div>
    );
}
