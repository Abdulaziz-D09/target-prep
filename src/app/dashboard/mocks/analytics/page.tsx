'use client';
import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles, Trophy, Calendar, Target, Activity, Calculator, BookOpen, ArrowUpRight } from 'lucide-react';
import {
    FloatingPageShapes,
    staggerContainerVariants,
    itemRevealVariants,
    sectionRevealVariants,
    pageRevealVariants
} from '@/components/SiteMotion';
import { useClassroomStore } from '@/store/classroomStore';
import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';

export default function StudentMocksAnalyticsPage() {
    const shouldReduceMotion = useReducedMotion();
    const { mockResults, mockSessions } = useClassroomStore();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Extract current student's results (assuming logged in student is s1 or stu- prefix)
    const myResults = useMemo(() => {
        return mockResults
            .filter(r => r.studentId === 's1' || r.studentId.startsWith('stu-'))
            .sort((a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime());
    }, [mockResults]);

    const stats = useMemo(() => {
        if (myResults.length === 0) return { total: 0, avg: 0, highest: 0, mathAvg: 0, readingAvg: 0 };
        const total = myResults.length;
        const sum = myResults.reduce((acc, r) => acc + (r.score || 0), 0);
        const mathSum = myResults.reduce((acc, r) => acc + (r.mathScore || 0), 0);
        const englishSum = myResults.reduce((acc, r) => acc + (r.englishScore || 0), 0);
        
        return {
            total,
            avg: Math.round(sum / total),
            mathAvg: Math.round(mathSum / total),
            readingAvg: Math.round(englishSum / total),
            highest: Math.max(...myResults.map(r => r.score || 0))
        };
    }, [myResults]);

    if (!isClient) return null;

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
                                Mock Analytics
                            </h1>
                            <p className="site-hero-body mt-4 max-w-2xl text-[15px] leading-7 sm:text-[17px]">
                                Track your progress and analyze your mock exam performance over time.
                            </p>
                        </motion.div>

                        {myResults.length > 0 && (
                            <motion.div className="grid gap-3 sm:grid-cols-2 xl:max-w-[390px] xl:justify-self-end" variants={staggerContainerVariants}>
                                <motion.div className="site-hero-stat rounded-[24px] px-4 py-4" variants={itemRevealVariants}>
                                    <p className="site-hero-kicker text-[10px] font-bold uppercase tracking-[0.22em]">Mocks Taken</p>
                                    <p className="site-hero-title mt-2 text-3xl font-black tracking-[-0.05em]">{stats.total}</p>
                                </motion.div>
                                <motion.div className="site-hero-stat rounded-[24px] px-4 py-4" variants={itemRevealVariants}>
                                    <p className="site-hero-kicker text-[10px] font-bold uppercase tracking-[0.22em]">Average Score</p>
                                    <p className="site-hero-title mt-2 text-3xl font-black tracking-[-0.05em]">{stats.avg}</p>
                                </motion.div>
                                <motion.div className="site-hero-stat rounded-[24px] px-4 py-4" variants={itemRevealVariants}>
                                    <p className="site-hero-kicker text-[10px] font-bold uppercase tracking-[0.22em]">High Score</p>
                                    <p className="site-hero-title mt-2 text-3xl font-black tracking-[-0.05em]">{stats.highest}</p>
                                </motion.div>
                                <motion.div className="site-hero-stat rounded-[24px] px-4 py-4" variants={itemRevealVariants}>
                                    <p className="site-hero-kicker text-[10px] font-bold uppercase tracking-[0.22em]">Latest Score</p>
                                    <p className="site-hero-title mt-2 text-3xl font-black tracking-[-0.05em] text-blue-600 dark:text-blue-400">
                                        {myResults[myResults.length - 1].score}
                                    </p>
                                </motion.div>
                            </motion.div>
                        )}
                    </motion.div>
                </motion.section>

                {myResults.length === 0 ? (
                    <motion.div variants={sectionRevealVariants} className="site-panel rounded-[32px] p-12 text-center flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                            <Activity className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-bold site-text-strong mb-2">No Analytics Data Yet</h3>
                        <p className="site-text-muted mb-6">Complete a mock exam to see your analytics and performance trajectory.</p>
                        <Link href="/dashboard/mocks" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition">
                            View Active Mocks
                        </Link>
                    </motion.div>
                ) : (
                    <div className="space-y-6">
                        {/* Section Breakdowns */}
                        <motion.section className="grid gap-4 grid-cols-2" variants={staggerContainerVariants}>
                            {[
                                { label: 'Mocks Taken', value: stats.totalMocks, icon: FileText },
                                { label: 'Average Score', value: stats.averageScore || '--', icon: Target },
                                { label: 'High Score', value: stats.highScore || '--', icon: Trophy },
                                { label: 'Latest Score', value: stats.latestScore || '--', icon: Activity },
                            ].map((stat) => (
                                <motion.article key={stat.label} className="site-panel rounded-[28px] p-5 sm:p-6 flex flex-col justify-between aspect-[4/3] sm:aspect-auto sm:min-h-[140px]" variants={itemRevealVariants}>
                                    <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] site-text-muted self-start">
                                        {stat.label}
                                    </div>
                                    <p className="site-text-strong text-3xl sm:text-4xl font-black tracking-[-0.05em] self-start">{stat.value}</p>
                                </motion.article>
                            ))}
                        </motion.section>

                        {/* Chart Area */}
                        <motion.div variants={itemRevealVariants} className="site-panel rounded-[32px] p-8">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-xl font-black site-text-strong">Score Trajectory</h3>
                                    <p className="site-text-muted text-sm mt-1">Your total mock scores over time</p>
                                </div>
                            </div>
                            
                            <div className="relative h-64 w-full flex items-end justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                                {/* Grid lines */}
                                <div className="absolute inset-0 pointer-events-none flex flex-col justify-between pt-4 pb-2">
                                    {[1600, 1200, 800, 400].map(score => (
                                        <div key={score} className="w-full border-t border-slate-200/50 dark:border-slate-800/50 relative">
                                            <span className="absolute -top-3 -left-1 text-[10px] font-bold text-slate-400">{score}</span>
                                        </div>
                                    ))}
                                </div>
                                
                                {/* Bars */}
                                {myResults.map((res, i) => {
                                    const heightPct = ((res.score || 0) / 1600) * 100;
                                    const session = mockSessions.find(s => s.id === res.mockId);
                                    const dateStr = new Date(res.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                                    
                                    return (
                                        <div key={i} className="relative z-10 w-full max-w-[48px] mx-1 flex flex-col items-center group cursor-pointer">
                                            <div 
                                                className="w-full bg-[linear-gradient(to_top,#3b82f6,#60a5fa)] rounded-t-lg transition-all duration-300 relative hover:bg-[linear-gradient(to_top,#2563eb,#3b82f6)]"
                                                style={{ height: `${Math.max(heightPct, 5)}%` }}
                                            >
                                                {/* Tooltip */}
                                                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-xl border border-slate-700 pointer-events-none">
                                                    {res.score} pts
                                                    <div className="text-[10px] text-slate-400 font-medium">{session?.title || 'Mock Test'}</div>
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-bold site-text-muted mt-3 uppercase tracking-wider">{dateStr}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
