'use client';
import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { BarChart2, ChevronDown, Activity, Target, Sparkles } from 'lucide-react';
import {
    FloatingPageShapes, itemRevealVariants, pageRevealVariants, staggerContainerVariants, sectionRevealVariants
} from '@/components/SiteMotion';
import { useClassroomStore, seedOnce } from '@/store/classroomStore';

// Seed synchronously so classrooms are available on first render
seedOnce();

// ─── Mock Data Generators ──────────────────────────────────────────────────────

function getMockAccuracyData(classroomId: string) {
    // Generate some deterministic but realistic looking data based on ID length
    const base = classroomId === 'all' ? 65 : 60 + (classroomId.length % 15);
    return [
        { week: 'Week 1', score: base },
        { week: 'Week 2', score: base + 4 },
        { week: 'Week 3', score: base + 7 },
        { week: 'Week 4', score: base + 12 },
        { week: 'Week 5', score: base + 15 },
        { week: 'Week 6', score: base + 19 > 100 ? 100 : base + 19 },
    ];
}

function getMockEngagementData(classroomId: string) {
    const mult = classroomId === 'all' ? 3 : 1;
    const base = 120 * mult + (classroomId.length * 10 * mult);
    return [
        { week: 'Week 1', qs: base },
        { week: 'Week 2', qs: base + 45 * mult },
        { week: 'Week 3', qs: base - 20 * mult },
        { week: 'Week 4', qs: base + 80 * mult },
        { week: 'Week 5', qs: base + 150 * mult },
        { week: 'Week 6', qs: base + 210 * mult },
    ];
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
    const shouldReduceMotion = useReducedMotion();
    const { classrooms, seed } = useClassroomStore();

    const [classFilter, setClassFilter] = useState<string>('all');

    useEffect(() => { seed(); }, [seed]);

    const accuracyData = getMockAccuracyData(classFilter);
    const engagementData = getMockEngagementData(classFilter);

    const latestAccuracy = accuracyData[accuracyData.length - 1].score;
    const latestEngagement = engagementData[engagementData.length - 1].qs;

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

                    <motion.div className="relative grid gap-8 xl:grid-cols-[1.15fr_0.85fr] xl:items-center" variants={staggerContainerVariants}>
                        <motion.div variants={itemRevealVariants}>
                            <div className="site-hero-chip inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.24em]">
                                <Sparkles className="h-3.5 w-3.5" />
                                Teacher Portal
                            </div>

                            <h1 className="site-hero-title mt-4 text-4xl font-black leading-[1.04] tracking-[-0.04em] sm:text-5xl">
                                Analytics
                            </h1>
                            <p className="site-hero-body mt-4 max-w-2xl text-[15px] leading-7 sm:text-[17px]">
                                Class-level insights and performance trends.
                            </p>
                        </motion.div>
                        
                        <motion.div className="flex xl:justify-end" variants={itemRevealVariants}>
                            <div className="relative inline-block w-full sm:w-64">
                                <select
                                    value={classFilter}
                                    onChange={(e) => setClassFilter(e.target.value)}
                                    className="w-full appearance-none rounded-full bg-white dark:bg-slate-800/80 px-5 py-3 pr-10 text-[15px] font-bold site-text-strong focus:outline-none focus:ring-2 focus:ring-indigo-500 transition shadow-sm cursor-pointer border border-slate-200/50 dark:border-slate-700/50"
                                >
                                    <option value="all">All Classes</option>
                                    {classrooms.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 site-text-muted pointer-events-none" />
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.section>

                {/* KPI Cards */}
                <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8" variants={staggerContainerVariants}>
                    <motion.div variants={itemRevealVariants} className="site-panel rounded-[24px] p-6 flex items-center gap-5">
                        <div className="h-14 w-14 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center shrink-0 border border-indigo-200 dark:border-indigo-800/50">
                            <Target className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <p className="text-[12px] uppercase tracking-widest font-bold site-text-muted mb-0.5">Current Avg Accuracy</p>
                            <div className="flex items-end gap-2">
                                <p className="text-3xl font-black site-text-strong leading-none">{latestAccuracy}%</p>
                                <span className="text-sm font-bold text-emerald-500 mb-0.5">+4% this week</span>
                            </div>
                        </div>
                    </motion.div>
                    
                    <motion.div variants={itemRevealVariants} className="site-panel rounded-[24px] p-6 flex items-center gap-5">
                        <div className="h-14 w-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-800/50">
                            <Activity className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-[12px] uppercase tracking-widest font-bold site-text-muted mb-0.5">Questions Answered</p>
                            <div className="flex items-end gap-2">
                                <p className="text-3xl font-black site-text-strong leading-none">{latestEngagement}</p>
                                <span className="text-sm font-bold text-emerald-500 mb-0.5">this week</span>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Charts */}
                <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-6" variants={staggerContainerVariants}>
                    
                    {/* Accuracy Growth Chart */}
                    <motion.div variants={itemRevealVariants} className="site-panel rounded-[24px] p-6 sm:p-8">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
                                <BarChart2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div>
                                <h2 className="font-bold text-[17px] site-text-strong leading-tight mb-0.5">Class Average Accuracy</h2>
                                <p className="text-[13px] site-text-muted">Accuracy over time across all assignments.</p>
                            </div>
                        </div>

                        <div className="relative h-[250px] w-full mt-4 flex items-end gap-3">
                            {/* Grid Lines */}
                            <div className="absolute inset-0 pointer-events-none flex flex-col justify-between py-8">
                                {[100, 75, 50, 25, 0].map((val) => (
                                    <div key={val} className="w-full border-t border-slate-200/50 dark:border-slate-800/50 relative">
                                        <span className="absolute -top-2.5 -left-1 text-[10px] font-bold text-slate-400 dark:text-slate-600">{val}%</span>
                                    </div>
                                ))}
                            </div>
                            
                            {/* Chart Bars */}
                            <div className="relative w-full h-full flex items-end justify-between px-6 z-10 pt-2 pb-6">
                                {accuracyData.map((pt, i) => (
                                    <div key={i} className="flex flex-col items-center group w-full px-1 sm:px-3">
                                        <div 
                                            className="w-full max-w-[40px] bg-[linear-gradient(to_top,#4f46e5,#6366f1)] rounded-t-lg transition-all duration-500 ease-out relative group-hover:bg-[linear-gradient(to_top,#4338ca,#4f46e5)] shadow-sm"
                                            style={{ height: `${pt.score}%` }}
                                        >
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[11px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                {pt.score}%
                                            </div>
                                        </div>
                                        <span className="text-[11px] font-bold site-text-muted mt-3 absolute bottom-0">{pt.week}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Engagement Chart */}
                    <motion.div variants={itemRevealVariants} className="site-panel rounded-[24px] p-6 sm:p-8">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                                <Activity className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <h2 className="font-bold text-[17px] site-text-strong leading-tight mb-0.5">Overall Engagement</h2>
                                <p className="text-[13px] site-text-muted">Total questions answered per week.</p>
                            </div>
                        </div>

                        <div className="relative h-[250px] w-full mt-4 flex items-end gap-3">
                            {/* Grid Lines */}
                            <div className="absolute inset-0 pointer-events-none flex flex-col justify-between py-8">
                                {[4, 3, 2, 1, 0].map((val) => {
                                    const maxVal = Math.max(...engagementData.map(d => d.qs));
                                    // Round maxVal up to nearest 100 for clean grid
                                    const gridMax = Math.ceil(maxVal / 100) * 100;
                                    const gridLabel = (gridMax / 4) * val;
                                    return (
                                        <div key={val} className="w-full border-t border-slate-200/50 dark:border-slate-800/50 relative">
                                            <span className="absolute -top-2.5 -left-1 text-[10px] font-bold text-slate-400 dark:text-slate-600">{gridLabel}</span>
                                        </div>
                                    )
                                })}
                            </div>
                            
                            {/* Chart Bars */}
                            <div className="relative w-full h-full flex items-end justify-between px-6 z-10 pt-2 pb-6">
                                {engagementData.map((pt, i) => {
                                    const maxVal = Math.max(...engagementData.map(d => d.qs));
                                    const gridMax = Math.ceil(maxVal / 100) * 100;
                                    const heightPct = (pt.qs / gridMax) * 100;

                                    return (
                                        <div key={i} className="flex flex-col items-center group w-full px-1 sm:px-3">
                                            <div 
                                                className="w-full max-w-[40px] bg-[linear-gradient(to_top,#10b981,#34d399)] rounded-t-lg transition-all duration-500 ease-out relative group-hover:bg-[linear-gradient(to_top,#059669,#10b981)] shadow-sm"
                                                style={{ height: `${Math.max(heightPct, 2)}%` }} // give at least 2% so empty isn't invisible
                                            >
                                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[11px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                    {pt.qs} Qs
                                                </div>
                                            </div>
                                            <span className="text-[11px] font-bold site-text-muted mt-3 absolute bottom-0">{pt.week}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </motion.div>

                </motion.div>
            </motion.div>
        </div>
    );
}
