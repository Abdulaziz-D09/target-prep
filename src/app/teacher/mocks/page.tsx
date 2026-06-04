'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Plus, Calendar, MapPin, Users, PlayCircle, CheckCircle, X } from 'lucide-react';
import Link from 'next/link';
import { useClassroomStore } from '@/store/classroomStore';
import { practiceCards as practiceCatalog } from '@/lib/practiceCatalog';
import {
    FloatingPageShapes,
    staggerContainerVariants,
    itemRevealVariants,
    sectionRevealVariants,
    pageRevealVariants
} from '@/components/SiteMotion';

export default function TeacherMocksPage() {
    const { mockSessions, seed } = useClassroomStore();
    
    useEffect(() => { seed(); }, [seed]);

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
                    <div className="absolute -left-16 top-10 h-56 w-56 rounded-full bg-blue-300/10 blur-3xl" />
                    <div className="absolute bottom-0 right-0 h-48 w-64 translate-x-10 translate-y-10 rounded-full bg-indigo-300/10 blur-3xl" />

                    <motion.div className="relative grid gap-8 xl:grid-cols-[1.15fr_0.85fr] xl:items-center" variants={staggerContainerVariants}>
                        <motion.div variants={itemRevealVariants}>
                            <div className="site-hero-chip inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.24em]">
                                <Sparkles className="h-3.5 w-3.5" />
                                Teacher Portal
                            </div>

                            <h1 className="site-hero-title mt-4 text-4xl font-black leading-[1.04] tracking-[-0.04em] sm:text-5xl">
                                Mock Exams
                            </h1>
                            <p className="site-hero-body mt-4 max-w-2xl text-[15px] leading-7 sm:text-[17px]">
                                Create and manage in-person mock exam sessions.
                            </p>
                        </motion.div>
                    </motion.div>
                </motion.section>

                <div className="site-panel rounded-[32px] p-6 sm:p-8">
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {mockSessions.filter(m => m.status !== 'completed').length === 0 ? (
                        <div className="col-span-full site-panel rounded-[24px] p-16 flex flex-col items-center text-center border-2 border-slate-200 dark:border-slate-800">
                            <Users className="h-12 w-12 site-text-muted mb-4 opacity-30" />
                            <p className="font-bold site-text-strong text-lg">No mock sessions yet</p>
                            <p className="site-text-muted text-sm mt-1 mb-5">Create your first mock session to get started.</p>
                            <Link href="/teacher/mocks/create" className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-full transition shadow-md">
                                <Plus className="h-4 w-4" /> Create Mock
                            </Link>
                        </div>
                    ) : mockSessions.filter(m => m.status !== 'completed').map(mock => (
                        <Link key={mock.id} href={`/teacher/mocks/${mock.id}`}>
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm hover:shadow-md transition cursor-pointer relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-bold site-text-strong">{mock.title}</h3>
                                    <span className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full ${mock.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : mock.status === 'upcoming' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                                        {mock.status}
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
                                        <Users className="w-4 h-4 opacity-70" /> Max {mock.maxStudents} students
                                    </div>
                                </div>
                                
                                
                                <div className="grid grid-cols-2 gap-3 mt-4">
                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700/50 col-span-2">
                                        <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Join Code</p>
                                        <p className="text-lg font-mono font-bold text-slate-800 dark:text-white tracking-[0.1em]">{mock.joinCode}</p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
