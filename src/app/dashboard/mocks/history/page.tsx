'use client';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, Clock, Trophy, ArrowRight, BarChart2 } from 'lucide-react';
import {
    FloatingPageShapes,
    staggerContainerVariants,
    itemRevealVariants,
    sectionRevealVariants,
    pageRevealVariants
} from '@/components/SiteMotion';
import { useClassroomStore } from '@/store/classroomStore';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function StudentMocksHistoryPage() {
    const [isClient, setIsClient] = useState(false);
    const { mockResults, mockSessions } = useClassroomStore();
    const router = useRouter();

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null;

    // Filter results for current student (hardcoded 's1' and dynamic student IDs)
    const myResults = mockResults.filter(r => r.studentId === 's1' || r.studentId.startsWith('stu-')).sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());

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
                    <div className="absolute -left-16 top-10 h-56 w-56 rounded-full bg-indigo-300/10 blur-3xl" />
                    <div className="absolute bottom-0 right-0 h-48 w-64 translate-x-10 translate-y-10 rounded-full bg-purple-300/10 blur-3xl" />

                    <motion.div className="relative grid gap-8 xl:grid-cols-[1.15fr_0.85fr] xl:items-center" variants={staggerContainerVariants}>
                        <motion.div variants={itemRevealVariants}>
                            <div className="site-hero-chip inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.24em]">
                                <Sparkles className="h-3.5 w-3.5" />
                                SAT Mocks
                            </div>

                            <h1 className="site-hero-title mt-4 text-4xl font-black leading-[1.04] tracking-[-0.04em] sm:text-5xl">
                                Mock History
                            </h1>
                            <p className="site-hero-body mt-4 max-w-2xl text-[15px] leading-7 sm:text-[17px]">
                                Review your past mock exam performance and results.
                            </p>
                        </motion.div>
                    </motion.div>
                </motion.section>

                <motion.div variants={sectionRevealVariants} className="space-y-6">
                    {myResults.length === 0 ? (
                        <div className="site-panel rounded-[32px] p-12 text-center flex flex-col items-center justify-center">
                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                <Trophy className="w-8 h-8 text-slate-400" />
                            </div>
                            <h3 className="text-xl font-bold site-text-strong mb-2">No Mocks Completed Yet</h3>
                            <p className="site-text-muted mb-6">You haven't completed any mock exams yet. Join an active mock session to get started!</p>
                            <Link href="/dashboard/mocks" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition">
                                View Active Mocks
                            </Link>
                        </div>
                    ) : (
                        myResults.map((result, idx) => {
                            const session = mockSessions.find(s => s.id === result.mockId);
                            const formattedDate = new Date(result.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                            const timeSpentMinutes = result.timeSpent ? Math.floor(result.timeSpent / 60) : 0;

                            return (
                                <div key={idx} className="site-panel rounded-[24px] p-6 sm:p-8 flex flex-col md:flex-row items-center gap-8 justify-between hover:border-blue-200 transition-colors cursor-pointer group" onClick={() => router.push(`/progress/review?testId=${result.assignedTestId || 1}&mockId=${result.mockId}&date=${result.completedAt}`)}>
                                    <div className="flex-1 w-full">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="bg-emerald-100 text-emerald-700 font-bold text-xs px-2.5 py-1 rounded-md uppercase tracking-wider">Completed</span>
                                            <span className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-md ${
                                                session?.subject === 'English'
                                                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400'
                                                    : session?.subject === 'Math'
                                                    ? 'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-400'
                                                    : 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400'
                                            }`}>
                                                {session?.subject === 'English' ? 'English Only' : session?.subject === 'Math' ? 'Math Only' : 'Full Mock'}
                                            </span>
                                            <span className="flex items-center gap-1.5 text-sm site-text-muted font-medium">
                                                <Calendar className="w-4 h-4" /> {formattedDate}
                                            </span>
                                        </div>
                                        <h3 className="text-2xl font-bold site-text-strong mb-2 group-hover:text-blue-600 transition-colors">
                                            {session?.title || 'Unknown Mock Session'}
                                        </h3>
                                        <div className="flex items-center gap-4 text-sm site-text-muted">
                                            <span className="flex items-center gap-1.5">
                                                <Clock className="w-4 h-4" /> {timeSpentMinutes} min spent
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-6 w-full md:w-auto bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
                                        <div className="text-center">
                                            <p className="text-[11px] uppercase tracking-widest font-bold site-text-muted mb-1">Score</p>
                                            <p className="text-3xl font-black text-blue-600">
                                                {result.totalCorrect ?? 0} <span className="text-lg text-slate-400">/ {result.totalQuestions ?? 0}</span>
                                            </p>
                                        </div>
                                        <div className="ml-2 w-10 h-10 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all border border-slate-200 dark:border-slate-600">
                                            <ArrowRight className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </motion.div>
            </motion.div>
        </div>
    );
}
