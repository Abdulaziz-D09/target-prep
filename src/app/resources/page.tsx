'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Sparkles, BookOpen } from 'lucide-react';
import {
    FloatingPageShapes,
    itemRevealVariants,
    pageRevealVariants,
    sectionRevealVariants,
    staggerContainerVariants,
} from '@/components/SiteMotion';

export default function ResourcesPage() {
    const shouldReduceMotion = useReducedMotion();

    return (
        <div className="relative min-h-screen pt-4 pb-12 px-4 sm:px-6 lg:px-8">
            <FloatingPageShapes theme="neutral" />

            <motion.div
                className="relative z-10 mx-auto max-w-[1320px]"
                initial={shouldReduceMotion ? undefined : 'hidden'}
                animate={shouldReduceMotion ? undefined : 'visible'}
                variants={pageRevealVariants}
            >
                <motion.section
                    className="site-hero-shell site-hero--question-bank relative mb-7 overflow-hidden rounded-[36px] px-6 py-8 sm:px-8 lg:px-10"
                    variants={sectionRevealVariants}
                >
                    <div className="absolute -left-16 top-10 h-56 w-56 rounded-full bg-sky-300/10 blur-3xl" />
                    <div className="absolute bottom-0 right-0 h-48 w-64 translate-x-10 translate-y-10 rounded-full bg-amber-300/10 blur-3xl" />

                    <motion.div className="relative grid gap-8 xl:grid-cols-[1.15fr_0.85fr]" variants={staggerContainerVariants}>
                        <motion.div variants={itemRevealVariants}>
                            <div className="site-hero-chip inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.24em]">
                                <Sparkles className="h-3.5 w-3.5" />
                                Playbook
                            </div>

                            <h1 className="site-hero-title mt-4 text-4xl font-black leading-[1.04] tracking-[-0.04em] sm:text-5xl">
                                Coming Soon
                            </h1>
                            <p className="site-hero-body mt-4 max-w-2xl text-[15px] leading-7 sm:text-[17px]">
                                The Playbook page is being built with the same premium experience as your other pages.
                            </p>

                            <div className="mt-7 flex flex-wrap gap-3">
                                <Link
                                    href="/question-bank"
                                    className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#2563eb,#3b82f6)] px-5 py-2.5 text-sm font-bold text-white transition hover:scale-[1.02] hover:brightness-110 shadow-lg shadow-blue-500/20"
                                >
                                    Open Question Bank
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </motion.div>

                        <motion.div className="grid gap-3 sm:grid-cols-2 xl:max-w-[390px] xl:justify-self-end" variants={staggerContainerVariants}>
                            <motion.div className="site-hero-stat rounded-[24px] px-4 py-4 sm:col-span-2" variants={itemRevealVariants}>
                                <p className="site-hero-kicker text-[10px] font-bold uppercase tracking-[0.22em]">Status</p>
                                <p className="site-hero-title mt-2 text-2xl font-black tracking-[-0.04em]">Coming Soon</p>
                                <p className="site-hero-body mt-2 text-sm leading-6">
                                    This section will launch as a focused SAT guide deck.
                                </p>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </motion.section>

                <motion.section className="site-panel rounded-[34px] p-8 sm:p-10" variants={sectionRevealVariants}>
                    <motion.div variants={itemRevealVariants} className="mx-auto max-w-3xl text-center">
                        <div className="mx-auto inline-flex rounded-2xl site-subpanel p-3">
                            <BookOpen className="h-6 w-6 site-text-strong" />
                        </div>
                        <h2 className="site-text-strong mt-5 text-3xl font-black tracking-[-0.04em]">Playbook</h2>
                        <p className="site-text mt-3 text-[17px] leading-8">
                            Coming soon.
                        </p>
                    </motion.div>
                </motion.section>
            </motion.div>
        </div>
    );
}
