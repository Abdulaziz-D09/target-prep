'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, BookOpen, Calculator, ChevronDown, ChevronUp, Clock3, Layers3, Sparkles, X } from 'lucide-react';
import { practiceCards } from '@/lib/practiceCatalog';
import { useTestStore } from '@/store/testStore';
import {
  FloatingPageShapes,
  itemRevealVariants,
  pageRevealVariants,
  sectionRevealVariants,
  siteEase,
  staggerContainerVariants,
} from '@/components/SiteMotion';

const ACTIVE_TEST_SESSION_KEY = 'targetprep_active_test';

type ActiveTestSession = {
  testId: number;
  moduleKey: string | null;
};

const practiceThemes = [
  {
    accentGlow: 'bg-sky-300/14',
    accentChip: 'practice-chip practice-chip--sky',
    statIcon: 'practice-icon--sky',
    fullTestButton: 'bg-[linear-gradient(135deg,#1b4cb3,#2563eb)] text-white hover:brightness-105',
  },
  {
    accentGlow: 'bg-rose-300/14',
    accentChip: 'practice-chip practice-chip--rose',
    statIcon: 'practice-icon--rose',
    fullTestButton: 'bg-[linear-gradient(135deg,#b91c1c,#dc2626)] text-white hover:brightness-105',
  },
  {
    accentGlow: 'bg-indigo-300/14',
    accentChip: 'practice-chip practice-chip--indigo',
    statIcon: 'practice-icon--indigo',
    fullTestButton: 'bg-[linear-gradient(135deg,#3730a3,#4f46e5)] text-white hover:brightness-105',
  },
  {
    accentGlow: 'bg-teal-300/14',
    accentChip: 'practice-chip practice-chip--teal',
    statIcon: 'practice-icon--teal',
    fullTestButton: 'bg-[linear-gradient(135deg,#0f766e,#0d9488)] text-white hover:brightness-105',
  },
  {
    accentGlow: 'bg-emerald-300/14',
    accentChip: 'practice-chip practice-chip--emerald',
    statIcon: 'practice-icon--emerald',
    fullTestButton: 'bg-[linear-gradient(135deg,#0f766e,#059669)] text-white hover:brightness-105',
  },
] as const;

export default function PracticePage() {
  const shouldReduceMotion = useReducedMotion();
  const router = useRouter();
  const { startTest } = useTestStore();
  const [openCardId, setOpenCardId] = useState<number | null>(null);
  const [resumePromptTestId, setResumePromptTestId] = useState<number | null>(null);

  const getActiveSession = (): ActiveTestSession | null => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = window.localStorage.getItem(ACTIVE_TEST_SESSION_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as Partial<ActiveTestSession>;
      if (typeof parsed.testId !== 'number') return null;
      return { testId: parsed.testId, moduleKey: parsed.moduleKey ?? null };
    } catch {
      return null;
    }
  };

  const startFreshFullTest = (testId: number) => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(ACTIVE_TEST_SESSION_KEY);
    }
    startTest(testId);
    router.push(`/practice/test/${testId}`);
  };

  const handleFullTestPress = (testId: number) => {
    const active = getActiveSession();
    if (active && active.testId === testId && !active.moduleKey) {
      setResumePromptTestId(testId);
      return;
    }
    startFreshFullTest(testId);
  };

  const continueFullTest = (testId: number) => {
    setResumePromptTestId(null);
    router.push(`/practice/test/${testId}?resume=1`);
  };

  return (
    <div className="relative min-h-screen pt-4 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="site-atmosphere site-atmosphere--practice" />
      <FloatingPageShapes theme="practice" />

      <motion.div
        className="relative z-10 mx-auto max-w-[1320px]"
        initial={shouldReduceMotion ? undefined : 'hidden'}
        animate={shouldReduceMotion ? undefined : 'visible'}
        variants={pageRevealVariants}
      >
        <motion.section
          className="site-hero-shell site-hero--practice relative mb-7 overflow-hidden rounded-[36px] px-6 py-8 sm:px-8 lg:px-10"
          variants={sectionRevealVariants}
        >
          <div className="absolute -left-8 top-8 h-40 w-40 rounded-full bg-sky-300/8 blur-3xl" />
          <div className="absolute right-8 top-8 h-36 w-36 rounded-full bg-indigo-300/7 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-28 w-28 rounded-full bg-rose-300/6 blur-3xl" />

          <motion.div className="relative grid gap-8 xl:grid-cols-[1.15fr_0.85fr] xl:items-end" variants={staggerContainerVariants}>
            <motion.div variants={itemRevealVariants}>
              <p className="site-hero-chip inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em]">
                <Sparkles className="h-3.5 w-3.5" />
                Practice Center
              </p>
              <h1 className="site-hero-title mt-4 text-3xl font-black tracking-[-0.05em] sm:text-[2.6rem]">
                Practice Tests
              </h1>
              <p className="site-hero-body mt-3 max-w-2xl text-sm leading-6 sm:text-[15px]">
                Start a full SAT practice test or jump straight into one module when you want a quicker session.
              </p>
            </motion.div>

            <motion.div className="grid gap-3 sm:grid-cols-2 xl:max-w-[360px] xl:justify-self-end" variants={staggerContainerVariants}>
              <motion.div className="site-hero-stat rounded-[22px] px-4 py-4" variants={itemRevealVariants}>
                <p className="site-hero-kicker text-[10px] font-bold uppercase tracking-[0.22em]">Available tests</p>
                <p className="site-hero-title mt-2 text-3xl font-black tracking-[-0.05em]">{practiceCards.length}</p>
              </motion.div>
              <motion.div className="site-hero-stat rounded-[22px] px-4 py-4" variants={itemRevealVariants}>
                <p className="site-hero-kicker text-[10px] font-bold uppercase tracking-[0.22em]">Module paths</p>
                <p className="site-hero-title mt-2 text-3xl font-black tracking-[-0.05em]">6</p>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.section>

        <motion.section className="grid gap-6 md:grid-cols-2" variants={staggerContainerVariants}>
          {practiceCards.map((card) => {
            const isOpen = openCardId === card.id;
            const theme = practiceThemes[(card.id - 1) % practiceThemes.length];

            return (
              <motion.article
                key={card.id}
                variants={itemRevealVariants}
                whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                className="site-panel relative overflow-hidden rounded-[32px] p-5 sm:p-6"
              >
                <div className={`absolute left-12 top-8 h-24 w-24 rounded-full blur-2xl ${theme.accentGlow}`} />
                <div className="absolute right-6 top-6 h-24 w-24 rounded-full bg-white/8 blur-3xl" />

                <div className="relative flex items-start gap-4">
                  <div className={`flex h-[86px] w-[86px] flex-shrink-0 flex-col items-center justify-center rounded-[24px] ${theme.statIcon} text-center shadow-sm`}>
                      <p className="text-[10px] font-bold uppercase tracking-[0.24em] opacity-70">Test</p>
                      <p className="mt-1 text-3xl font-black tracking-[-0.06em]">{card.id}</p>
                  </div>

                  <div className="max-w-[30rem]">
                      <p className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] ${theme.accentChip}`}>
                        <Sparkles className="h-3.5 w-3.5" />
                        {card.label}
                      </p>
                      <h2 className="site-text-strong mt-4 text-[2rem] font-black tracking-[-0.045em]">
                        {card.title}
                      </h2>
                      <p className="site-text mt-3 max-w-[30rem] text-[16px] leading-7">
                        {card.summary}
                      </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <div className="site-subpanel rounded-[22px] px-4 py-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${theme.statIcon}`}>
                      <Clock3 className="h-4 w-4" />
                    </div>
                    <p className="site-text-faint mt-4 text-[11px] font-bold uppercase tracking-[0.2em]">Timing</p>
                    <p className="site-text-strong mt-1 text-xl font-black tracking-[-0.03em]">{card.duration}</p>
                  </div>

                  <div className="site-subpanel rounded-[22px] px-4 py-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${theme.statIcon}`}>
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <p className="site-text-faint mt-4 text-[11px] font-bold uppercase tracking-[0.2em]">Questions</p>
                    <p className="site-text-strong mt-1 text-xl font-black tracking-[-0.03em]">{card.totalQuestions}</p>
                  </div>

                  <div className="site-subpanel rounded-[22px] px-4 py-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${theme.statIcon}`}>
                      <Layers3 className="h-4 w-4" />
                    </div>
                    <p className="site-text-faint mt-4 text-[11px] font-bold uppercase tracking-[0.2em]">Modules</p>
                    <p className="site-text-strong mt-1 text-xl font-black tracking-[-0.03em]">{card.moduleCount}</p>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => handleFullTestPress(card.id)}
                    className={`inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-base font-bold transition ${theme.fullTestButton}`}
                  >
                    Full Test
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setOpenCardId(isOpen ? null : card.id)}
                    className="site-button-secondary inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-base font-bold transition"
                  >
                    Individual Module
                    {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </div>

                <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    className="mt-5 overflow-hidden"
                    initial={shouldReduceMotion ? undefined : { height: 0, opacity: 0 }}
                    animate={shouldReduceMotion ? undefined : { height: 'auto', opacity: 1 }}
                    exit={shouldReduceMotion ? undefined : { height: 0, opacity: 0 }}
                    transition={shouldReduceMotion ? undefined : { duration: 0.42, ease: siteEase }}
                  >
                  <div className="site-panel-soft grid gap-4 rounded-[28px] p-4 sm:p-5 lg:grid-cols-2">
                    <motion.div className="site-subpanel rounded-[24px] p-4" initial={shouldReduceMotion ? undefined : { opacity: 0, y: 12 }} animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }} exit={shouldReduceMotion ? undefined : { opacity: 0, y: 12 }} transition={shouldReduceMotion ? undefined : { duration: 0.35, ease: siteEase }}>
                      <div className="flex items-center gap-3">
                        <div className="practice-icon--sky flex h-11 w-11 items-center justify-center rounded-2xl">
                          <BookOpen className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="site-text-faint text-[11px] font-bold uppercase tracking-[0.22em]">
                            Reading &amp; Writing
                          </p>
                          <p className="site-text text-[15px] font-semibold leading-6">Choose one module start point</p>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-2">
                        {card.englishButtons.map((button) =>
                          button.available && button.href ? (
                            <Link
                              key={button.key}
                              href={button.href}
                              className="inline-flex h-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,#1e3a8a,#2563eb)] px-4 text-sm font-bold text-white transition hover:brightness-105"
                            >
                              {button.label}
                            </Link>
                          ) : (
                            <span
                              key={button.key}
                              className="site-button-secondary inline-flex h-11 items-center justify-center rounded-full border border-dashed px-4 text-sm font-bold site-text-faint"
                            >
                              {button.label}
                            </span>
                          )
                        )}
                      </div>
                    </motion.div>

                    <motion.div className="site-subpanel rounded-[24px] p-4" initial={shouldReduceMotion ? undefined : { opacity: 0, y: 12 }} animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }} exit={shouldReduceMotion ? undefined : { opacity: 0, y: 12 }} transition={shouldReduceMotion ? undefined : { duration: 0.35, ease: siteEase, delay: 0.04 }}>
                      <div className="flex items-center gap-3">
                        <div className="practice-icon--rose flex h-11 w-11 items-center justify-center rounded-2xl">
                          <Calculator className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="site-text-faint text-[11px] font-bold uppercase tracking-[0.22em]">
                            Math
                          </p>
                          <p className="site-text text-[15px] font-semibold leading-6">Jump straight into a selected module</p>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-2">
                        {card.mathButtons.map((button) =>
                          button.available && button.href ? (
                            <Link
                              key={button.key}
                              href={button.href}
                              className="inline-flex h-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,#9f1239,#dc2626)] px-4 text-sm font-bold text-white transition hover:brightness-105"
                            >
                              {button.label}
                            </Link>
                          ) : (
                            <span
                              key={button.key}
                              className="site-button-secondary inline-flex h-11 items-center justify-center rounded-full border border-dashed px-4 text-sm font-bold site-text-faint"
                            >
                              {button.label}
                            </span>
                          )
                        )}
                      </div>
                    </motion.div>
                  </div>
                  </motion.div>
                )}
                </AnimatePresence>
              </motion.article>
            );
          })}
        </motion.section>
      </motion.div>

      <AnimatePresence>
        {resumePromptTestId !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm"
              onClick={() => setResumePromptTestId(null)}
            />
            <motion.div
              initial={shouldReduceMotion ? undefined : { opacity: 0, y: 14, scale: 0.96 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, y: 10, scale: 0.97 }}
              className="relative w-full max-w-lg rounded-[28px] site-panel p-6 sm:p-7"
            >
              <button
                type="button"
                onClick={() => setResumePromptTestId(null)}
                className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full site-button-secondary"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>

              <p className="site-text-faint text-[11px] font-bold uppercase tracking-[0.24em]">Resume Test</p>
              <h2 className="site-text-strong mt-2 text-2xl font-black tracking-[-0.03em]">Continue where you left off?</h2>
              <p className="site-text mt-3 text-[16px] leading-7">
                You already have an in-progress full test. Continue from your last question, or start over from Section 1.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => continueFullTest(resumePromptTestId)}
                  className="inline-flex items-center justify-center rounded-full bg-[linear-gradient(135deg,#1b4cb3,#2563eb)] px-5 py-2.5 text-sm font-bold text-white transition hover:brightness-110"
                >
                  Continue
                </button>
                <button
                  type="button"
                  onClick={() => startFreshFullTest(resumePromptTestId)}
                  className="site-button-secondary inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-bold transition"
                >
                  Start Again
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
