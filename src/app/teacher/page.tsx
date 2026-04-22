'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { GraduationCap, ClipboardList, ArrowRight, Plus, Users } from 'lucide-react';
import {
    FloatingPageShapes, itemRevealVariants, pageRevealVariants, staggerContainerVariants,
} from '@/components/SiteMotion';
import { useClassroomStore, seedOnce } from '@/store/classroomStore';

// Seed data synchronously before first render to avoid blank flash
seedOnce();

export default function TeacherHomePage() {
    const shouldReduceMotion = useReducedMotion();
    const { classrooms, students, assignments, seed } = useClassroomStore();

    useEffect(() => { seed(); }, [seed]);

    const totalStudents    = students.length;
    const totalAssignments = assignments.length;

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
                <motion.div className="mb-10" variants={itemRevealVariants}>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-600 text-white dark:bg-indigo-500/20 dark:text-indigo-400 rounded-full text-xs font-bold uppercase tracking-widest mb-3 shadow-sm border border-transparent dark:border-indigo-500/20">
                        Teacher Portal
                    </div>
                    <h1 className="text-3xl font-black tracking-[-0.03em] site-text-strong">Teacher Dashboard</h1>
                    <p className="mt-2 text-[15px] site-text-muted">
                        Manage your classes, track student progress, and assign coursework.
                    </p>
                </motion.div>

                {/* Stats strip */}
                <motion.div className="grid gap-4 grid-cols-3 mb-8" variants={staggerContainerVariants}>
                    {[
                        { label: 'Classes', value: classrooms.length, icon: GraduationCap, color: 'text-indigo-500' },
                        { label: 'Students', value: totalStudents, icon: Users, color: 'text-blue-500' },
                        { label: 'Assignments', value: totalAssignments, icon: ClipboardList, color: 'text-emerald-500' },
                    ].map(({ label, value, icon: Icon, color }) => (
                        <motion.div key={label} variants={itemRevealVariants}>
                            <div className="site-panel rounded-[20px] p-5 text-center">
                                <Icon className={`h-6 w-6 ${color} mx-auto mb-2`} />
                                <p className="text-2xl font-black tracking-tight site-text-strong">{value}</p>
                                <p className="text-[12px] uppercase tracking-wider font-bold site-text-muted mt-0.5">{label}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

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
