'use client';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { BarChart2, Calendar, Sparkles, ArrowRight, Trophy, BookOpen, Calculator } from 'lucide-react';
import { CompletedTest, useTestStore } from '@/store/testStore';
import {
    FloatingPageShapes,
    itemRevealVariants,
    pageRevealVariants,
    sectionRevealVariants,
    staggerContainerVariants,
} from '@/components/SiteMotion';

function readLegacyHistoryFromStorage(): CompletedTest[] {
    if (typeof window === 'undefined') return [];

    try {
        const raw = localStorage.getItem('targetprep_progress');
        if (!raw) return [];

        const parsed = JSON.parse(raw) as { completedTests?: CompletedTest[] };
        return Array.isArray(parsed.completedTests) ? parsed.completedTests : [];
    } catch {
        return [];
    }
}

export default function ProgressPage() {
    const shouldReduceMotion = useReducedMotion();
    const completedTests = useTestStore((state) => state.completedTests);
    const [legacyHistory, setLegacyHistory] = useState<CompletedTest[]>(() => readLegacyHistoryFromStorage());

    useEffect(() => {
        if (completedTests.length > 0) return;

        const handleStorageChange = () => {
            setLegacyHistory(readLegacyHistoryFromStorage());
        };

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [completedTests.length]);

    const history = useMemo(() => (completedTests.length > 0 ? completedTests : legacyHistory), [completedTests, legacyHistory]);

    const stats = useMemo(() => {
        if (history.length === 0) return { total: 0, avg: 0, highest: 0, readingAvg: 0, mathAvg: 0 };

        const total = history.length;
        const avg = Math.round(history.reduce((acc, test) => acc + test.totalScore, 0) / total);
        const highest = Math.max(...history.map((test) => test.totalScore));
        const readingAvg = Math.round(history.reduce((acc, test) => acc + test.englishScore, 0) / total);
        const mathAvg = Math.round(history.reduce((acc, test) => acc + test.mathScore, 0) / total);
        return { total, avg, highest, readingAvg, mathAvg };
    }, [history]);

    return (
        <div className="relative min-h-screen pt-4 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="site-atmosphere site-atmosphere--home" />
            <FloatingPageShapes theme="neutral" />

            <motion.div
                className="relative z-10 mx-auto max-w-[1320px]"
                initial={shouldReduceMotion ? undefined : 'hidden'}
                animate={shouldReduceMotion ? undefined : 'visible'}
                variants={pageRevealVariants}
            >
                <motion.section
                    className="site-hero-shell site-hero--home relative mb-7 overflow-hidden rounded-[36px] px-6 py-8 sm:px-8 lg:px-10"
                    variants={sectionRevealVariants}
                >
                    <div className="absolute -left-16 top-10 h-56 w-56 rounded-full bg-emerald-300/10 blur-3xl" />
                    <div className="absolute bottom-0 right-0 h-48 w-64 translate-x-10 translate-y-10 rounded-full bg-blue-300/10 blur-3xl" />

                    <motion.div className="relative grid gap-8 xl:grid-cols-[1.15fr_0.85fr]" variants={staggerContainerVariants}>
                        <motion.div variants={itemRevealVariants}>
                            <div className="site-hero-chip inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.24em]">
                                <Sparkles className="h-3.5 w-3.5" />
                                Performance Desk
                            </div>

                            <h1 className="site-hero-title mt-4 text-4xl font-black leading-[1.04] tracking-[-0.04em] sm:text-5xl">
                                Progress Analytics
                            </h1>
                            <p className="site-hero-body mt-4 max-w-2xl text-[15px] leading-7 sm:text-[17px]">
                                Track the exact score movement from every practice test and keep your prep momentum measurable.
                            </p>

                            {history.length === 0 && (
                                <div className="mt-7 flex flex-wrap gap-3">
                                    <Link
                                        href="/practice"
                                        className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#2563eb,#3b82f6)] px-5 py-2.5 text-sm font-bold text-white transition hover:scale-[1.02] hover:brightness-110 shadow-lg shadow-blue-500/20"
                                    >
                                        Start First Test
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            )}
                        </motion.div>

                        <motion.div className="grid gap-3 sm:grid-cols-2 xl:max-w-[390px] xl:justify-self-end" variants={staggerContainerVariants}>
                            <motion.div className="site-hero-stat rounded-[24px] px-4 py-4" variants={itemRevealVariants}>
                                <p className="site-hero-kicker text-[10px] font-bold uppercase tracking-[0.22em]">Completed</p>
                                <p className="site-hero-title mt-2 text-3xl font-black tracking-[-0.05em]">{stats.total}</p>
                            </motion.div>
                            <motion.div className="site-hero-stat rounded-[24px] px-4 py-4" variants={itemRevealVariants}>
                                <p className="site-hero-kicker text-[10px] font-bold uppercase tracking-[0.22em]">Average</p>
                                <p className="site-hero-title mt-2 text-3xl font-black tracking-[-0.05em]">{stats.avg || '--'}</p>
                            </motion.div>
                            <motion.div className="site-hero-stat rounded-[24px] px-4 py-4" variants={itemRevealVariants}>
                                <p className="site-hero-kicker text-[10px] font-bold uppercase tracking-[0.22em]">Highest</p>
                                <p className="site-hero-title mt-2 text-3xl font-black tracking-[-0.05em]">{stats.highest || '--'}</p>
                            </motion.div>
                            <motion.div className="site-hero-stat rounded-[24px] px-4 py-4" variants={itemRevealVariants}>
                                <p className="site-hero-kicker text-[10px] font-bold uppercase tracking-[0.22em]">Latest</p>
                                <p className="site-hero-title mt-2 text-3xl font-black tracking-[-0.05em]">
                                    {history.length > 0 ? history[history.length - 1].totalScore : '--'}
                                </p>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </motion.section>

                {history.length === 0 ? (
                    <motion.section className="site-panel rounded-[32px] p-10 text-center" variants={itemRevealVariants}>
                        <div className="mb-5 mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-500/10 border border-blue-400/20">
                            <BarChart2 className="h-9 w-9 text-blue-300" />
                        </div>
                        <h2 className="site-text-strong text-3xl font-black tracking-[-0.03em]">No Data Yet</h2>
                        <p className="site-text-muted text-lg mt-3 max-w-xl mx-auto leading-relaxed">
                            Finish your first full practice test to unlock score trends and reading-vs-math breakdowns.
                        </p>
                    </motion.section>
                ) : (
                    <>
                        <motion.section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-7" variants={staggerContainerVariants}>
                            <motion.article className="site-panel rounded-[28px] p-5" variants={itemRevealVariants}>
                                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] site-text-muted">
                                    <BookOpen className="h-4 w-4" />
                                    Reading Avg
                                </div>
                                <p className="site-text-strong mt-3 text-4xl font-black tracking-[-0.05em]">{stats.readingAvg}</p>
                            </motion.article>

                            <motion.article className="site-panel rounded-[28px] p-5" variants={itemRevealVariants}>
                                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] site-text-muted">
                                    <Calculator className="h-4 w-4" />
                                    Math Avg
                                </div>
                                <p className="site-text-strong mt-3 text-4xl font-black tracking-[-0.05em]">{stats.mathAvg}</p>
                            </motion.article>

                            <motion.article className="site-panel rounded-[28px] p-5" variants={itemRevealVariants}>
                                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] site-text-muted">
                                    <Trophy className="h-4 w-4" />
                                    Score Spread
                                </div>
                                <p className="site-text-strong mt-3 text-4xl font-black tracking-[-0.05em]">{Math.max(stats.highest - stats.avg, 0)}</p>
                                <p className="site-text-muted mt-1 text-sm">Difference between highest and average</p>
                            </motion.article>
                        </motion.section>

                        <motion.section variants={sectionRevealVariants}>
                            <h3 className="site-text-strong font-black text-2xl tracking-[-0.03em] mb-4 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-slate-400" />
                                Test History
                            </h3>
                            <motion.div className="space-y-4" variants={staggerContainerVariants}>
                                {history.slice().reverse().map((test, i) => {
                                    const date = new Date(test.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                                    return (
                                        <motion.article
                                            key={`${test.testId}-${test.date}-${i}`}
                                            className="site-panel-soft rounded-[28px] p-5 sm:p-6 flex flex-col gap-5 md:flex-row md:items-center md:justify-between"
                                            variants={itemRevealVariants}
                                        >
                                            <div>
                                                <h4 className="site-text-strong font-black text-xl tracking-[-0.03em]">{test.testTitle}</h4>
                                                <p className="site-text-muted text-sm mt-1">{date}</p>
                                            </div>

                                            <div className="flex items-center gap-4 sm:gap-8">
                                                <div className="text-center">
                                                    <p className="text-[10px] site-text-faint font-bold uppercase tracking-[0.2em] mb-1">Reading</p>
                                                    <p className="site-text-strong font-black text-xl">{test.englishScore}</p>
                                                </div>

                                                <div className="h-10 w-px site-divider" />

                                                <div className="text-center">
                                                    <p className="text-[10px] site-text-faint font-bold uppercase tracking-[0.2em] mb-1">Math</p>
                                                    <p className="site-text-strong font-black text-xl">{test.mathScore}</p>
                                                </div>

                                                <div className="h-10 w-px site-divider" />

                                                <div className="flex flex-col gap-2">
                                                    <div className="text-center rounded-2xl px-5 py-2 bg-blue-500/12 border border-blue-500/25">
                                                        <p className="text-[10px] text-blue-500 font-bold uppercase tracking-[0.2em] mb-0.5">Total</p>
                                                        <p className="text-3xl font-black text-blue-500 tracking-[-0.04em]">{test.totalScore}</p>
                                                    </div>
                                                    <Link 
                                                        href={`/practice/test/${test.testId}?review=true&date=${encodeURIComponent(test.date)}`}
                                                        className="w-full py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold uppercase tracking-wider text-center transition-colors dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10"
                                                    >
                                                        Review
                                                    </Link>
                                                </div>
                                            </div>
                                        </motion.article>
                                    );
                                })}
                            </motion.div>
                        </motion.section>
                    </>
                )}
            </motion.div>
        </div>
    );
}
