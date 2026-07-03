'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { GraduationCap, ClipboardList, ArrowRight, Plus, Users, Sparkles, Activity, FileText, BarChart3, Clock, Zap, Calendar } from 'lucide-react';
import {
    FloatingPageShapes, itemRevealVariants, pageRevealVariants, staggerContainerVariants, sectionRevealVariants
} from '@/components/SiteMotion';
import { useClassroomStore } from '@/store/classroomStore';

export default function TeacherHomePage() {
    const shouldReduceMotion = useReducedMotion();
    const classrooms = useClassroomStore(state => state.classrooms);
    const students = useClassroomStore(state => state.students);
    const assignments = useClassroomStore(state => state.assignments);
    const mockSessions = useClassroomStore(state => state.mockSessions);
    const seed = useClassroomStore(state => state.seed);
    const [todayLabel, setTodayLabel] = useState('');

    const syncWithSupabase = useClassroomStore(state => state.syncWithSupabase);

    useEffect(() => { 
        seed(); 
        syncWithSupabase();
        setTodayLabel(
            new Intl.DateTimeFormat('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            }).format(new Date())
        );
    }, [seed, syncWithSupabase]);

    const totalStudents    = students.length;
    const totalAssignments = assignments.length;
    const activeMocks = mockSessions.filter(m => m.status === 'active');

    const quickLinks = [
        {
          title: 'Classrooms',
          body: 'Manage your student rosters, view class-wide performance, and handle join codes.',
          href: '/teacher/classes',
          icon: GraduationCap,
          accent: 'from-sky-500 via-blue-600 to-indigo-700',
        },
        {
          title: 'Assignments',
          body: 'Upload PDFs, curate question banks, and dispatch targeted homework to students.',
          href: '/teacher/assignments',
          icon: ClipboardList,
          accent: 'from-amber-400 via-orange-500 to-red-500',
        },
        {
          title: 'Analytics & Mocks',
          body: 'Track detailed score trajectories, run live mock exams, and identify weak spots.',
          href: '/teacher/analytics',
          icon: BarChart3,
          accent: 'from-emerald-400 via-emerald-500 to-teal-600',
        },
    ];

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
                        <motion.div className="flex flex-col" variants={itemRevealVariants}>
                            <div className="site-hero-chip inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.24em]">
                                <Sparkles className="h-3.5 w-3.5" />
                                Teacher control center
                            </div>

                            <div className="mt-5 max-w-3xl">
                                <p className="site-hero-kicker text-sm font-medium">{todayLabel}</p>
                                <h1 className="site-hero-title mt-3 max-w-2xl text-4xl font-black leading-[1.02] tracking-[-0.04em] sm:text-5xl lg:text-[4.3rem]">
                                    Empower your students to succeed.
                                </h1>
                                <p className="site-hero-body mt-4 font-semibold text-indigo-600 dark:text-indigo-400">
                                    Manage your classes, track progress effortlessly, and assign coursework with AI-driven insights from a single dashboard.
                                </p>
                            </div>

                            <div className="mt-8 flex flex-wrap gap-3">
                                <Link
                                    href="/teacher/assignments/create"
                                    className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#6366f1,#4f46e5)] px-5 py-2.5 text-sm font-bold text-white transition hover:scale-[1.02] hover:brightness-110 shadow-lg shadow-indigo-500/20"
                                >
                                    New Assignment
                                    <Plus className="h-4 w-4" />
                                </Link>
                                <Link
                                    href="/teacher/classes"
                                    className="site-hero-secondary-btn inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition hover:scale-[1.02] shadow-sm"
                                >
                                    View Classes
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>

                            <motion.div className="mt-10" variants={staggerContainerVariants}>
                                <div className="grid gap-4 sm:grid-cols-3">
                                    <motion.div className="site-hero-stat rounded-[26px] p-4" variants={itemRevealVariants}>
                                        <p className="site-hero-kicker text-[11px] font-bold uppercase tracking-[0.22em]">Classes</p>
                                        <p className="site-hero-title mt-3 text-3xl font-black tracking-[-0.04em]">{classrooms.length}</p>
                                        <p className="site-hero-body mt-1 text-sm">Active classrooms</p>
                                    </motion.div>
                                    <motion.div className="site-hero-stat rounded-[26px] p-4" variants={itemRevealVariants}>
                                        <p className="site-hero-kicker text-[11px] font-bold uppercase tracking-[0.22em]">Students</p>
                                        <p className="site-hero-title mt-3 text-3xl font-black tracking-[-0.04em]">{totalStudents}</p>
                                        <p className="site-hero-body mt-1 text-sm">Total enrolled students</p>
                                    </motion.div>
                                    <motion.div className="site-hero-stat rounded-[26px] p-4" variants={itemRevealVariants}>
                                        <p className="site-hero-kicker text-[11px] font-bold uppercase tracking-[0.22em]">Assignments</p>
                                        <p className="site-hero-title mt-3 text-3xl font-black tracking-[-0.04em]">{totalAssignments}</p>
                                        <p className="site-hero-body mt-1 text-sm">Created & dispatched</p>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </motion.div>

                        <motion.div className="flex flex-col gap-5" variants={staggerContainerVariants}>
                            <motion.div className="site-panel flex min-h-[220px] flex-col rounded-[32px] p-6" variants={itemRevealVariants}>
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="site-hero-kicker text-[11px] font-bold uppercase tracking-[0.24em]">Productivity</p>
                                        <h2 className="site-hero-title mt-2 text-2xl font-black tracking-[-0.03em]">Quick Actions</h2>
                                        <p className="site-hero-body mt-2 text-sm leading-6">
                                            Jump straight into your most common tasks.
                                        </p>
                                    </div>
                                    <div className="site-chip rounded-2xl p-3 bg-indigo-50 dark:bg-indigo-500/10">
                                        <Zap className="h-5 w-5 text-indigo-500" />
                                    </div>
                                </div>
                                <div className="mt-auto pt-6 flex flex-col gap-3">
                                    <Link 
                                        href="/teacher/assignments/create"
                                        className="w-full flex items-center justify-between site-subpanel rounded-xl px-5 py-3.5 hover:scale-[1.02] transition shadow-sm group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
                                                <Plus className="w-4 h-4" />
                                            </div>
                                            <span className="font-bold text-[14px] site-text-strong">Create New Assignment</span>
                                        </div>
                                        <ArrowRight className="w-4 h-4 site-text-muted transition group-hover:text-indigo-500 group-hover:translate-x-1" />
                                    </Link>
                                    <Link 
                                        href="/teacher/mocks/create"
                                        className="w-full flex items-center justify-between site-subpanel rounded-xl px-5 py-3.5 hover:scale-[1.02] transition shadow-sm group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                                                <Calendar className="w-4 h-4" />
                                            </div>
                                            <span className="font-bold text-[14px] site-text-strong">Schedule Mock Exam</span>
                                        </div>
                                        <ArrowRight className="w-4 h-4 site-text-muted transition group-hover:text-emerald-500 group-hover:translate-x-1" />
                                    </Link>
                                </div>
                            </motion.div>

                            <motion.div className="site-panel rounded-[32px] p-6" variants={itemRevealVariants}>
                                <div className="flex items-center gap-3">
                                    <div className="rounded-2xl bg-indigo-100 p-3 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                                        <Users className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Your network</p>
                                        <h3 className="site-text-strong text-lg font-black tracking-[-0.03em]">Global Reach</h3>
                                    </div>
                                </div>
                                <p className="site-text mt-4 text-sm leading-6">
                                    You have {totalStudents} students engaging with your material. Keep the momentum going by dropping fresh assignments every week.
                                </p>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </motion.section>

                <motion.section className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]" variants={sectionRevealVariants}>
                    <motion.div className="site-panel rounded-[32px] p-6 sm:p-7" variants={itemRevealVariants}>
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="site-text-faint text-[11px] font-bold uppercase tracking-[0.24em]">Primary paths</p>
                                <h2 className="site-text-strong mt-2 text-3xl font-black tracking-[-0.04em]">Manage Your Space</h2>
                            </div>
                        </div>

                        <motion.div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3" variants={staggerContainerVariants}>
                            {quickLinks.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <motion.div key={item.title} variants={itemRevealVariants} whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}>
                                    <Link
                                        key={item.title}
                                        href={item.href}
                                        className="site-card-strong group relative block w-full overflow-hidden rounded-[28px] p-5 transition hover:scale-[1.02] shadow-[0_12px_24px_rgba(0,0,0,0.12)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] hover:brightness-105 h-full"
                                    >
                                        <div className={`pointer-events-none absolute -right-10 top-1/2 h-24 w-24 -translate-y-1/2 bg-gradient-to-br ${item.accent} opacity-20 blur-2xl rotate-45 mix-blend-screen`} />
                                        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                                        <div className="flex items-start justify-between gap-4">
                                            <div className={`rounded-[20px] bg-gradient-to-br ${item.accent} p-3 text-white shadow-[0_8px_16px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.4)]`}>
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <ArrowRight className="site-text-faint h-5 w-5 transition group-hover:scale-110" />
                                        </div>
                                        <h3 className="site-text-strong mt-4 text-xl font-black tracking-[-0.03em]">{item.title}</h3>
                                        <p className="mt-2 max-w-xl text-sm leading-6 site-text">{item.body}</p>
                                    </Link>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </motion.div>

                    <motion.div className="site-panel rounded-[32px] p-6 sm:p-7 flex flex-col" variants={itemRevealVariants}>
                        <div className="flex items-center justify-between gap-4 mb-6">
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400">Recent Activity</p>
                                <h2 className="site-text-strong mt-2 text-3xl font-black tracking-[-0.04em]">Latest Assignments</h2>
                            </div>
                            <Clock className="h-5 w-5 text-slate-400" />
                        </div>

                        {assignments.length === 0 ? (
                            <div className="site-subpanel rounded-[22px] px-6 py-8 text-center flex flex-col items-center justify-center flex-1">
                                <FileText className="h-8 w-8 text-slate-300 mb-3" />
                                <p className="text-sm font-semibold site-text-muted mb-2">No assignments yet</p>
                                <Link href="/teacher/assignments/create" className="text-indigo-500 font-bold text-sm hover:underline">Create your first</Link>
                            </div>
                        ) : (
                            <motion.div className="space-y-3" variants={staggerContainerVariants}>
                                {assignments.slice(0, 4).map((a, index) => (
                                    <motion.div
                                        key={a.id}
                                        variants={itemRevealVariants}
                                        className="site-subpanel rounded-[24px] border border-slate-200 dark:border-slate-700 p-4 transition hover:border-indigo-500/30 hover:shadow-[0_12px_20px_rgba(99,102,241,0.06)] group"
                                    >
                                        <Link href={`/teacher/assignments/${a.id}`} className="flex gap-4">
                                            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-[18px] bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 group-hover:bg-indigo-600 group-hover:text-white transition-colors shadow-sm">
                                                <FileText className="h-5 w-5" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <p className="site-text-strong text-[15px] font-black tracking-[-0.02em] group-hover:text-indigo-600 transition-colors">{a.title}</p>
                                                    <p className="text-[10px] font-bold site-text-muted uppercase tracking-wider">{new Date(a.createdAt).toLocaleDateString()}</p>
                                                </div>
                                                <p className="site-text-muted mt-1 text-sm font-medium">
                                                    {a.subject} &middot; <span className="site-text-strong">{(a.questions || []).length}</span> questions
                                                </p>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                                <Link href="/teacher/assignments" className="block w-full py-3 text-center text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition mt-2">
                                    View All Assignments
                                </Link>
                            </motion.div>
                        )}
                    </motion.div>
                </motion.section>
            </motion.div>
        </div>
    );
}
