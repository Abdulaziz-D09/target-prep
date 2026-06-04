'use client';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import {
    FloatingPageShapes,
    staggerContainerVariants,
    itemRevealVariants,
    sectionRevealVariants,
    pageRevealVariants
} from '@/components/SiteMotion';

export default function TeacherMocksAnalyticsPage() {
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
                                Mock Analytics
                            </h1>
                            <p className="site-hero-body mt-4 max-w-2xl text-[15px] leading-7 sm:text-[17px]">
                                Analyze student performance across all mock exam sessions.
                            </p>
                        </motion.div>
                    </motion.div>
                </motion.section>

                <motion.div variants={sectionRevealVariants} className="site-panel rounded-[32px] p-8 text-center">
                    <p className="site-text-muted">Coming soon...</p>
                </motion.div>
            </motion.div>
        </div>
    );
}
