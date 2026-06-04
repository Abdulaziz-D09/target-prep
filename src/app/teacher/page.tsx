'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { GraduationCap, ClipboardList, ArrowRight, Plus, Users, Sparkles } from 'lucide-react';
import {
    FloatingPageShapes, itemRevealVariants, pageRevealVariants, staggerContainerVariants, sectionRevealVariants
} from '@/components/SiteMotion';
import { useClassroomStore } from '@/store/classroomStore';

export default function TeacherHomePage() {
    const shouldReduceMotion = useReducedMotion();
    const { classrooms, students, assignments, seed } = useClassroomStore();

    useEffect(() => { seed(); }, [seed]);

    const totalStudents    = students.length;
    const totalAssignments = assignments.length;

    return (
        <div className="relative min-h-screen pt-4 pb-12 px-4 sm:px-6 lg:px-8">
            <FloatingPageShapes theme="home" />

            <motion.div
                className="relative z-10 mx-auto max-w-[1320px]"
                initial={shouldReduceMotion ? undefined : 'hidden'}
                animate={shouldReduceMotion ? undefined : 'visible'}
                variants={pageRevealVariants}
            >
                {/* Hero */}
                <motion.section
                    className="site-hero-shell site-hero--home relative mb-7 overflow-hidden rounded-[36px] px-6 py-8 sm:px-8 lg:px-10"
                    variants={sectionRevealVariants}
                >
                    <div className="absolute -left-16 top-10 h-56 w-56 rounded-full bg-indigo-300/10 blur-3xl" />
                    <div className="absolute bottom-0 right-0 h-48 w-64 translate-x-10 translate-y-10 rounded-full bg-blue-300/10 blur-3xl" />

                    <motion.div className="relative grid gap-8 xl:grid-cols-[1.15fr_0.85fr]" variants={staggerContainerVariants}>
                        <motion.div variants={itemRevealVariants}>
                            <div className="site-hero-chip inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.24em]">
                                <Sparkles className="h-3.5 w-3.5" />
                                Teacher Portal
                            </div>

                            <h1 className="site-hero-title mt-4 text-4xl font-black leading-[1.04] tracking-[-0.04em] sm:text-5xl">
                                Teacher Dashboard
                            </h1>
                            <p className="site-hero-body mt-4 max-w-2xl text-[15px] leading-7 sm:text-[17px]">
                                Manage your classes, track student progress, and assign coursework.
                            </p>
                        </motion.div>

                        <motion.div className="grid gap-3 sm:grid-cols-3 xl: xl:justify-self-end" variants={staggerContainerVariants}>
                            {[
                                { label: 'Classes', value: classrooms.length },
                                { label: 'Students', value: totalStudents },
                                { label: 'Assignments', value: totalAssignments },
                            ].map(({ label, value }) => (
                                <motion.div key={label} className="site-hero-stat rounded-[24px] px-4 py-4" variants={itemRevealVariants}>
                                    <p className="site-hero-kicker text-[10px] font-bold uppercase tracking-[0.22em]">{label}</p>
                                    <p className="site-hero-title mt-2 text-3xl font-black tracking-[-0.05em]">{value}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </motion.section>

                {/* Quick action cards */}
                <motion.div className="grid gap-5 md:grid-cols-2" variants={staggerContainerVariants}>
                    {/* Classes card */}
                    <motion.div variants={itemRevealVariants}>
                        <div className="site-panel rounded-[24px] p-6 border-t-4 border-t-indigo-500 h-full flex flex-col">
                            <div className="flex items-center gap-2 mb-2">
                                <GraduationCap className="h-6 w-6 text-indigo-500" />
                                <h2 className="text-xl font-bold site-text-strong tracking-[-0.02em]">Classes</h2>
                            </div>
                            <p className="text-[14px] site-text-muted mb-5 leading-relaxed">
                                Create and manage your classrooms. Students join with a unique code. Click a class to see the full roster and assignment progress.
                            </p>
                            <div className="mt-auto flex flex-col gap-2">
                                <Link
                                    href="/teacher/classes"
                                    className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition hover:scale-[1.01] shadow-md"
                                >
                                    View Classes <ArrowRight className="h-4 w-4" />
                                </Link>
                                <Link
                                    href="/teacher/classes"
                                    className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold site-text site-subpanel transition hover:scale-[1.01]"
                                >
                                    <Plus className="h-4 w-4" /> Create New Class
                                </Link>
                            </div>
                        </div>
                    </motion.div>

                    {/* Assignments card */}
                    <motion.div variants={itemRevealVariants} className="flex flex-col gap-4">
                        <div className="site-panel rounded-[24px] p-6 border-t-4 border-t-emerald-500 flex-1 flex flex-col">
                            <div className="flex items-center gap-2 mb-2">
                                <ClipboardList className="h-6 w-6 text-emerald-500" />
                                <h2 className="text-xl font-bold site-text-strong tracking-[-0.02em]">Assignments</h2>
                            </div>
                            <p className="text-[14px] site-text-muted mb-5 leading-relaxed">
                                Upload a PDF or paste text. Our AI extracts every multiple-choice question so you can review each one and set the correct answers before sending to your class.
                            </p>
                            <div className="mt-auto flex flex-col gap-2">
                                <Link
                                    href="/teacher/assignments/create"
                                    className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition hover:scale-[1.01] shadow-md"
                                >
                                    <Plus className="h-4 w-4" /> New Assignment
                                </Link>
                                <Link
                                    href="/teacher/assignments"
                                    className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold site-text site-subpanel transition hover:scale-[1.01]"
                                >
                                    View All <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
}
