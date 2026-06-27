'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, MapPin, Users, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useClassroomStore } from '@/store/classroomStore';
import {
    FloatingPageShapes,
    staggerContainerVariants,
    itemRevealVariants,
    sectionRevealVariants,
    pageRevealVariants
} from '@/components/SiteMotion';

export default function TeacherMocksHistoryPage() {
    const mockSessions = useClassroomStore(state => state.mockSessions);
    const mockResults = useClassroomStore(state => state.mockResults);
    const seed = useClassroomStore(state => state.seed);
    const [isClient, setIsClient] = useState(false);
    
    useEffect(() => { 
        seed(); 
        setIsClient(true);
    }, [seed]);

    if (!isClient) return null;

    const completedMocks = mockSessions.filter(m => m.status === 'completed').sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return (
        <div className="relative min-h-screen w-full pt-4 pb-12 px-4 sm:px-6 lg:px-8">
            <FloatingPageShapes theme="home" />
            <motion.div
                className="relative z-10 w-full mx-auto max-w-[1320px]"
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
                    <div className="absolute -left-16 top-10 h-56 w-56 rounded-full bg-blue-300/10 blur-3xl" />
                    <div className="absolute bottom-0 right-0 h-48 w-64 translate-x-10 translate-y-10 rounded-full bg-indigo-300/10 blur-3xl" />

                    <motion.div className="relative grid gap-8 xl:grid-cols-[1.15fr_0.85fr] xl:items-center" variants={staggerContainerVariants}>
                        <motion.div variants={itemRevealVariants}>
                            <div className="site-hero-chip inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.24em]">
                                <Sparkles className="h-3.5 w-3.5" />
                                Teacher Portal
                            </div>

                            <h1 className="site-hero-title mt-4 text-4xl font-black leading-[1.04] tracking-[-0.04em] sm:text-5xl">
                                Completed Mocks
                            </h1>
                            <p className="site-hero-body mt-4 max-w-2xl text-[15px] leading-7 sm:text-[17px]">
                                Review past mock exams and analyze student performance.
                            </p>
                        </motion.div>
                    </motion.div>
                </motion.section>

                <div className="site-panel rounded-[32px] p-6 sm:p-8">
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {completedMocks.length === 0 ? (
                        <div className="col-span-full site-panel rounded-[24px] p-16 flex flex-col items-center text-center border-2 border-slate-200 dark:border-slate-800">
                            <BookOpen className="h-12 w-12 site-text-muted mb-4 opacity-30" />
                            <h3 className="text-xl font-bold site-text-strong mb-2">No Completed Mocks Yet</h3>
                            <p className="site-text-muted">Once an active mock session is marked as completed, it will appear here.</p>
                        </div>
                    ) : completedMocks.map(mock => {
                        const resultsCount = mockResults.filter(r => r.mockId === mock.id).length;
                        return (
                        <Link key={mock.id} href={`/teacher/mocks/${mock.id}`}>
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm hover:shadow-md transition cursor-pointer relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-bold site-text-strong">{mock.title}</h3>
                                    <span className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                        Completed
                                    </span>
                                </div>
                                
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-3 site-text-muted text-[14px]">
                                        <Calendar className="w-4 h-4 opacity-70" /> {mock.date || 'TBD'}
                                    </div>
                                    <div className="flex items-center gap-3 site-text-muted text-[14px]">
                                        <MapPin className="w-4 h-4 opacity-70" /> {mock.place}
                                    </div>
                                    <div className="flex items-center gap-3 site-text-muted text-[14px]">
                                        <Users className="w-4 h-4 opacity-70" /> {resultsCount} {resultsCount === 1 ? 'Submission' : 'Submissions'}
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-3 mt-4">
                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700/50 col-span-2">
                                        <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Avg Score</p>
                                        <p className="text-lg font-black text-slate-800 dark:text-white">{resultsCount > 0 ? Math.round(mockResults.filter(r => r.mockId === mock.id).reduce((a, r) => a + r.score, 0) / resultsCount) : '--'}</p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    )})}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
