'use client';
import { motion, useReducedMotion } from 'framer-motion';
import { BookOpen, Target, ChevronDown, CheckCircle, Activity, Sparkles } from 'lucide-react';
import { CustomSelect } from '@/components/CustomSelect';
import {
    FloatingPageShapes,
    staggerContainerVariants,
    itemRevealVariants,
    sectionRevealVariants,
    pageRevealVariants
} from '@/components/SiteMotion';
import { useClassroomStore } from '@/store/classroomStore';
import { useMemo, useState, useEffect } from 'react';

export default function TeacherMocksAnalyticsPage() {
    const shouldReduceMotion = useReducedMotion();
    const { mockSessions, mockResults, students } = useClassroomStore();
    const [isClient, setIsClient] = useState(false);
    
    // Sort mock sessions descending by date
    const sortedSessions = useMemo(() => {
        return [...mockSessions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [mockSessions]);

    const [selectedSessionId, setSelectedSessionId] = useState<string>('all');

    useEffect(() => {
        setIsClient(true);
    }, []);

    const filteredResults = useMemo(() => {
        if (selectedSessionId === 'all') return mockResults;
        return mockResults.filter(r => r.mockId === selectedSessionId);
    }, [mockResults, selectedSessionId]);

    const stats = useMemo(() => {
        if (filteredResults.length === 0) return { totalStudents: 0, avg: 0, highest: 0, lowest: 0 };
        
        const sum = filteredResults.reduce((acc, r) => acc + (r.score || 0), 0);
        return {
            totalStudents: filteredResults.length,
            avg: Math.round(sum / filteredResults.length),
            highest: Math.max(...filteredResults.map(r => r.score || 0)),
            lowest: Math.min(...filteredResults.map(r => r.score || 0))
        };
    }, [filteredResults]);

    // Score distribution (Buckets: <1000, 1000-1190, 1200-1390, 1400-1600)
    const distribution = useMemo(() => {
        const buckets = [
            { label: '< 1000', count: 0, color: 'bg-rose-500' },
            { label: '1000-1190', count: 0, color: 'bg-amber-500' },
            { label: '1200-1390', count: 0, color: 'bg-blue-500' },
            { label: '1400-1600', count: 0, color: 'bg-emerald-500' }
        ];

        filteredResults.forEach(r => {
            const s = r.score || 0;
            if (s < 1000) buckets[0].count++;
            else if (s < 1200) buckets[1].count++;
            else if (s < 1400) buckets[2].count++;
            else buckets[3].count++;
        });

        return buckets;
    }, [filteredResults]);

    const maxBucketCount = Math.max(...distribution.map(b => b.count), 1);

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
                    className="site-hero-shell site-hero--home relative mb-7 rounded-[36px] px-6 py-8 sm:px-8 lg:px-10 z-[50]"
                    variants={sectionRevealVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="absolute inset-0 overflow-hidden rounded-[36px] pointer-events-none">
                        <div className="absolute -left-16 top-10 h-56 w-56 rounded-full bg-blue-300/10 blur-3xl" />
                        <div className="absolute bottom-0 right-0 h-48 w-64 translate-x-10 translate-y-10 rounded-full bg-indigo-300/10 blur-3xl" />
                    </div>

                    <motion.div className="relative grid gap-8 xl:grid-cols-[1.15fr_0.85fr] xl:items-center" variants={staggerContainerVariants}>
                        <motion.div variants={itemRevealVariants}>
                            <div className="site-hero-chip inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.24em]">
                                <Sparkles className="h-3.5 w-3.5" />
                                Teacher Portal
                            </div>

                            <h1 className="site-hero-title mt-4 text-4xl font-black leading-[1.04] tracking-[-0.04em] sm:text-5xl">
                                Mock Analytics
                            </h1>
                            <p className="site-hero-body mt-4 max-w-2xl text-[15px] leading-7 sm:text-[17px]">
                                Analyze student performance across your mock exam sessions.
                            </p>
                        </motion.div>
                        
                        <motion.div className="flex flex-col sm:flex-row gap-3 xl:justify-end" variants={itemRevealVariants}>
                                <CustomSelect
                                    value={selectedSessionId}
                                    onChange={setSelectedSessionId}
                                    options={[
                                        { value: 'all', label: 'All Mock Sessions' },
                                        ...sortedSessions.map(s => ({ value: String(s.id), label: `${s.title} (${new Date(s.date).toLocaleDateString()})` }))
                                    ]}
                                    className="sm:w-72 z-[90]"
                                />
                        </motion.div>
                    </motion.div>
                </motion.section>

                {filteredResults.length === 0 ? (
                    <motion.div variants={sectionRevealVariants} className="site-panel rounded-[32px] p-12 text-center flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                            <BarChart2 className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-bold site-text-strong mb-2">No Results Found</h3>
                        <p className="site-text-muted">No students have completed the selected mock session(s) yet.</p>
                    </motion.div>
                ) : (
                    <motion.div variants={staggerContainerVariants} className="space-y-6">
                        {/* KPI Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="site-panel rounded-[24px] p-5">
                                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] site-text-muted mb-2">
                                    <Target className="w-4 h-4 text-indigo-500" />
                                    Avg Score
                                </div>
                                <p className="text-3xl font-black site-text-strong">{stats.avg}</p>
                            </div>
                            <div className="site-panel rounded-[24px] p-5">
                                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] site-text-muted mb-2">
                                    <Users className="w-4 h-4 text-blue-500" />
                                    Completed
                                </div>
                                <p className="text-3xl font-black site-text-strong">{stats.totalStudents}</p>
                            </div>
                            <div className="site-panel rounded-[24px] p-5">
                                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] site-text-muted mb-2">
                                    <Sparkles className="w-4 h-4 text-emerald-500" />
                                    Highest
                                </div>
                                <p className="text-3xl font-black site-text-strong">{stats.highest}</p>
                            </div>
                            <div className="site-panel rounded-[24px] p-5">
                                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] site-text-muted mb-2">
                                    <Target className="w-4 h-4 text-amber-500" />
                                    Lowest
                                </div>
                                <p className="text-3xl font-black site-text-strong">{stats.lowest}</p>
                            </div>
                        </div>

                        {/* Chart & Detailed Table Area */}
                        <div className="grid lg:grid-cols-[1fr_2fr] gap-6">
                            
                            {/* Distribution Chart */}
                            <div className="site-panel rounded-[32px] p-8 flex flex-col">
                                <h3 className="text-xl font-black site-text-strong mb-1">Score Distribution</h3>
                                <p className="site-text-muted text-sm mb-8">Performance spread of students</p>

                                <div className="flex-1 flex items-end justify-between gap-4 relative w-full h-[250px]">
                                    {distribution.map((bucket, idx) => {
                                        const heightPct = (bucket.count / maxBucketCount) * 100;
                                        return (
                                            <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full group">
                                                <div 
                                                    className={`w-full max-w-[60px] ${bucket.color} rounded-t-lg transition-all duration-300 relative shadow-sm opacity-90 group-hover:opacity-100 group-hover:scale-105`}
                                                    style={{ height: `${Math.max(heightPct, 4)}%` }}
                                                >
                                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[11px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                        {bucket.count} students
                                                    </div>
                                                </div>
                                                <div className="mt-3 text-[10px] font-bold uppercase tracking-wider site-text-muted text-center leading-tight">
                                                    {bucket.label.replace(' ', '\n')}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Student Results Table */}
                            <div className="site-panel rounded-[32px] overflow-hidden flex flex-col">
                                <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                                    <h3 className="text-xl font-black site-text-strong">Individual Results</h3>
                                </div>
                                <div className="overflow-x-auto flex-1">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50 dark:bg-slate-900/50">
                                                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.2em] site-text-muted">Student</th>
                                                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.2em] site-text-muted">Score</th>
                                                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.2em] site-text-muted hidden md:table-cell">Accuracy</th>
                                                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.2em] site-text-muted hidden sm:table-cell">Time Spent</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                                            {filteredResults.map((res, i) => {
                                                const student = students.find(s => s.id === res.studentId);
                                                const accuracy = res.totalQuestions > 0 ? Math.round((res.totalCorrect / res.totalQuestions) * 100) : 0;
                                                const timeMins = res.timeSpent ? Math.floor(res.timeSpent / 60) : 0;
                                                
                                                return (
                                                    <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                                        <td className="px-6 py-4 font-semibold site-text-strong flex items-center gap-3">
                                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm bg-${student?.avatar || 'blue'}-500`}>
                                                                {student?.name?.charAt(0) || 'S'}
                                                            </div>
                                                            {student?.name || 'Unknown Student'}
                                                        </td>
                                                        <td className="px-6 py-4 font-black text-blue-600 dark:text-blue-400">
                                                            {res.score}
                                                        </td>
                                                        <td className="px-6 py-4 hidden md:table-cell">
                                                            <div className="flex items-center gap-2">
                                                                <div className="flex-1 max-w-[100px] h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${accuracy}%` }} />
                                                                </div>
                                                                <span className="text-[13px] font-bold site-text-muted">{accuracy}%</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm font-medium site-text-muted hidden sm:table-cell">
                                                            <div className="flex items-center gap-1.5">
                                                                <Clock className="w-3.5 h-3.5" />
                                                                {timeMins} min
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
