'use client';
import { useEffect, useState } from 'react';
import { useClassroomStore } from '@/store/classroomStore';
import { createClient } from '@/lib/supabase/client';
import { FloatingPageShapes, pageRevealVariants, sectionRevealVariants, staggerContainerVariants, itemRevealVariants } from '@/components/SiteMotion';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle, XCircle, Clock, ArrowLeft, Activity } from 'lucide-react';
import Link from 'next/link';
import { LatexRenderer } from '@/components/LatexRenderer';

export default function StudentHistoryPage() {
    const { questionHistory, mockResults, syncWithSupabase } = useClassroomStore();
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const supabase = createClient();
        supabase.auth.getUser().then(({ data }) => {
            if (data?.user) setUserId(data.user.id);
        });
        syncWithSupabase();
    }, [syncWithSupabase]);

    // Filter history for current user
    const userHistory = questionHistory.filter(q => q.studentId === userId).sort((a, b) => new Date(b.answeredAt).getTime() - new Date(a.answeredAt).getTime());
    const userMocks = mockResults.filter(m => m.studentId === userId).sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());

    const totalQuestions = userHistory.length;
    const correctQuestions = userHistory.filter(q => q.isCorrect).length;
    const accuracy = totalQuestions > 0 ? Math.round((correctQuestions / totalQuestions) * 100) : 0;

    return (
        <div className="relative min-h-screen pt-4 pb-12 px-4 sm:px-6 lg:px-8 max-w-[1320px] mx-auto">
            <FloatingPageShapes theme="home" />
            
            <motion.div initial="hidden" animate="visible" variants={pageRevealVariants} className="relative z-10">
                <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold mb-6 transition">
                    <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </Link>

                <motion.section className="site-hero-shell relative mb-8 overflow-hidden rounded-[36px] px-8 py-10" variants={sectionRevealVariants}>
                    <div className="absolute -left-16 top-10 h-56 w-56 rounded-full bg-blue-300/10 blur-3xl" />
                    <div className="absolute bottom-0 right-0 h-48 w-64 translate-x-10 translate-y-10 rounded-full bg-indigo-300/10 blur-3xl" />

                    <motion.div className="relative" variants={staggerContainerVariants}>
                        <motion.div variants={itemRevealVariants}>
                            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.24em] bg-blue-500/10 text-blue-600">
                                <Activity className="h-3.5 w-3.5" /> Performance History
                            </div>
                            <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl site-text-strong">
                                Your Learning Journey
                            </h1>
                            <p className="mt-4 max-w-2xl text-[16px] leading-relaxed site-text-muted">
                                Track your progress over time, review your past mock scores, and analyze your question bank accuracy.
                            </p>
                        </motion.div>
                        
                        <motion.div variants={itemRevealVariants} className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                                <p className="text-[12px] font-bold site-text-muted uppercase tracking-widest mb-1">Overall Accuracy</p>
                                <p className="text-3xl font-black text-blue-600">{accuracy}%</p>
                            </div>
                            <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                                <p className="text-[12px] font-bold site-text-muted uppercase tracking-widest mb-1">Questions Answered</p>
                                <p className="text-3xl font-black site-text-strong">{totalQuestions}</p>
                            </div>
                            <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                                <p className="text-[12px] font-bold site-text-muted uppercase tracking-widest mb-1">Mocks Completed</p>
                                <p className="text-3xl font-black text-indigo-600">{userMocks.length}</p>
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.section>

                <div className="grid lg:grid-cols-[1fr_1.5fr] gap-8">
                    {/* Mock Exams List */}
                    <motion.div variants={sectionRevealVariants}>
                        <h2 className="text-xl font-black site-text-strong mb-4 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-indigo-500" /> Past Mocks
                        </h2>
                        <div className="space-y-4">
                            {userMocks.length === 0 ? (
                                <div className="p-8 text-center site-panel rounded-3xl site-text-muted">No mocks completed yet.</div>
                            ) : userMocks.map(mock => (
                                <div key={mock.id} className="site-panel p-5 rounded-2xl hover:border-indigo-400 transition cursor-default">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold site-text-strong text-[15px]">Score: <span className="text-indigo-600">{mock.score}</span></h3>
                                        <span className="text-[11px] site-text-muted bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded font-bold uppercase tracking-wider">
                                            {new Date(mock.completedAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="text-[13px] site-text-muted">
                                        {mock.totalCorrect} out of {mock.totalQuestions} correct
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Question Bank History */}
                    <motion.div variants={sectionRevealVariants}>
                        <h2 className="text-xl font-black site-text-strong mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-emerald-500" /> Recent Questions
                        </h2>
                        <div className="site-panel rounded-[32px] overflow-hidden">
                            {userHistory.length === 0 ? (
                                <div className="p-12 text-center site-text-muted">You haven't answered any questions yet. Start a practice session!</div>
                            ) : (
                                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {userHistory.slice(0, 50).map(q => (
                                        <div key={q.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center gap-2">
                                                    {q.isCorrect ? (
                                                        <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 px-2 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">
                                                            <CheckCircle className="w-3.5 h-3.5" /> Correct
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-1.5 bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400 px-2 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">
                                                            <XCircle className="w-3.5 h-3.5" /> Incorrect
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-[12px] site-text-muted font-medium">
                                                    {new Date(q.answeredAt).toLocaleString()}
                                                </div>
                                            </div>
                                            <p className="text-[14px] site-text-strong mb-2 font-medium">
                                                <LatexRenderer text={`Question ID: ${q.questionId}`} />
                                            </p>
                                            <p className="text-[13px] site-text-muted">
                                                Your Choice: <strong className="site-text-strong">{q.chosenOption}</strong>
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
