'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ExternalLink,
  FileText,
  LayoutGrid,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
} from 'lucide-react';
import { satDates } from '@/data/questions';
import {
  FloatingPageShapes,
  itemRevealVariants,
  pageRevealVariants,
  sectionRevealVariants,
  staggerContainerVariants,
} from '@/components/SiteMotion';

type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

type ProgressSnapshot = {
  completedTests?: Array<{ totalScore?: number; date?: string }>;
  streak?: number;
  totalQuestionsAnswered?: number;
};

const PAGE_LOAD_TIME = Date.now();

const EMPTY_COUNTDOWN: Countdown = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
};

function getCountdown(targetMs: number): Countdown {
  const distance = Math.max(targetMs - Date.now(), 0);

  return {
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((distance % (1000 * 60)) / 1000),
  };
}

export default function HomePage() {
  const shouldReduceMotion = useReducedMotion();
  const [todayLabel, setTodayLabel] = useState('');
  const [countdown, setCountdown] = useState<Countdown>(EMPTY_COUNTDOWN);
  const [stats, setStats] = useState({
    streak: 0,
    avgScore: 0,
    completed: 0,
    answered: 0,
  });

  const nextTest = useMemo(() => {
    return satDates.find((date) => new Date(date.target).getTime() > PAGE_LOAD_TIME) ?? satDates[satDates.length - 1];
  }, []);

  const upcomingDates = useMemo(
    () => satDates.filter((date) => new Date(date.target).getTime() >= PAGE_LOAD_TIME).slice(0, 4),
    []
  );

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setTodayLabel(
        new Intl.DateTimeFormat('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }).format(new Date())
      );

      try {
        const raw = localStorage.getItem('targetprep_progress');
        if (!raw) return;

        const progress = JSON.parse(raw) as ProgressSnapshot;
        const completedTests = progress.completedTests ?? [];
        const avgScore =
          completedTests.length > 0
            ? Math.round(
                completedTests.reduce((sum, test) => sum + (test.totalScore ?? 0), 0) / completedTests.length
              )
            : 0;

        setStats({
          streak: progress.streak ?? 0,
          avgScore,
          completed: completedTests.length,
          answered: progress.totalQuestionsAnswered ?? 0,
        });
      } catch {
        setStats({
          streak: 0,
          avgScore: 0,
          completed: 0,
          answered: 0,
        });
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const targetMs = new Date(nextTest.target).getTime();
    const update = () => setCountdown(getCountdown(targetMs));

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [nextTest]);

  const quickLinks = [
    {
      title: 'Practice Tests',
      body: 'Timed section work with real SAT pacing and module structure.',
      href: '/practice',
      icon: FileText,
      accent: 'from-sky-500 via-blue-600 to-indigo-700',
    },
    {
      title: 'Question Bank',
      body: 'Browse drills by domain, skill, and difficulty when you want targeted reps.',
      href: '/question-bank',
      icon: LayoutGrid,
      accent: 'from-amber-400 via-orange-500 to-red-500',
    },
    {
      title: 'Progress',
      body: 'Track scores, streaks, and how your practice is compounding over time.',
      href: '/progress',
      icon: TrendingUp,
      accent: 'from-emerald-400 via-emerald-500 to-teal-600',
    },
  ];

  return (
    <div className="relative min-h-screen pt-4 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="site-atmosphere site-atmosphere--home" />
      <FloatingPageShapes theme="home" />

      <motion.div
        className="relative z-10 mx-auto max-w-[1320px]"
        initial={shouldReduceMotion ? undefined : 'hidden'}
        animate={shouldReduceMotion ? undefined : 'visible'}
        variants={pageRevealVariants}
      >
        <motion.section
          className="site-hero-shell site-hero--home relative overflow-hidden rounded-[36px] px-6 py-8 sm:px-8 lg:px-10"
          variants={sectionRevealVariants}
        >
          <div className="absolute -left-16 top-10 h-56 w-56 rounded-full bg-sky-300/10 dark:bg-cyan-500/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-48 w-64 translate-x-10 translate-y-10 rounded-full bg-rose-300/10 dark:bg-amber-500/10 blur-3xl" />

          <motion.div className="relative grid gap-8 xl:grid-cols-[1.15fr_0.85fr]" variants={staggerContainerVariants}>
            <motion.div variants={itemRevealVariants}>
              <div className="site-hero-chip inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.24em]">
                <Sparkles className="h-3.5 w-3.5" />
                SAT control center
              </div>

              <div className="mt-5 max-w-3xl">
                <p className="site-hero-kicker text-sm font-medium">{todayLabel}</p>
                <h1 className="site-hero-title mt-3 max-w-2xl text-4xl font-black leading-[1.02] tracking-[-0.04em] sm:text-5xl lg:text-[4.3rem]">
                  Practice with structure, not guesswork.
                </h1>
                <p className="site-hero-body mt-5 max-w-2xl text-[15px] leading-7 sm:text-[17px]">
                  Train the real SAT flow from one place: full practice tests, focused question-bank reps,
                  and a clean scoreboard for what is actually moving.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/practice"
                  className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#2563eb,#3b82f6)] px-5 py-2.5 text-sm font-bold text-white transition hover:scale-[1.02] hover:brightness-110 shadow-lg shadow-blue-500/20"
                >
                  Start Practice
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/question-bank"
                  className="site-hero-secondary-btn inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition hover:scale-[1.02] shadow-sm"
                >
                  Open Question Bank
                  <LayoutGrid className="h-4 w-4" />
                </Link>
              </div>

              <motion.div className="mt-10 grid gap-4 sm:grid-cols-3" variants={staggerContainerVariants}>
                <motion.div className="site-hero-stat rounded-[26px] p-4" variants={itemRevealVariants}>
                  <p className="site-hero-kicker text-[11px] font-bold uppercase tracking-[0.22em]">Completed</p>
                  <p className="site-hero-title mt-3 text-3xl font-black tracking-[-0.04em]">{stats.completed}</p>
                  <p className="site-hero-body mt-1 text-sm">Finished tests stored in progress.</p>
                </motion.div>
                <motion.div className="site-hero-stat rounded-[26px] p-4" variants={itemRevealVariants}>
                  <p className="site-hero-kicker text-[11px] font-bold uppercase tracking-[0.22em]">Average score</p>
                  <p className="site-hero-title mt-3 text-3xl font-black tracking-[-0.04em]">{stats.avgScore || '--'}</p>
                  <p className="site-hero-body mt-1 text-sm">Based on saved completed tests.</p>
                </motion.div>
                <motion.div className="site-hero-stat rounded-[26px] p-4" variants={itemRevealVariants}>
                  <p className="site-hero-kicker text-[11px] font-bold uppercase tracking-[0.22em]">Questions logged</p>
                  <p className="site-hero-title mt-3 text-3xl font-black tracking-[-0.04em]">{stats.answered}</p>
                  <p className="site-hero-body mt-1 text-sm">All answered reps tracked in progress.</p>
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div className="flex flex-col justify-between gap-5" variants={staggerContainerVariants}>
              <motion.div
                className="site-panel flex min-h-[340px] flex-col rounded-[32px] p-6"
                variants={itemRevealVariants}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="site-hero-kicker text-[11px] font-bold uppercase tracking-[0.24em]">Next official date</p>
                    <h2 className="site-hero-title mt-2 text-2xl font-black tracking-[-0.03em]">{nextTest.date}</h2>
                    <p className="site-hero-body mt-2 text-sm leading-6">
                      Registration deadline: {nextTest.registrationDeadline}
                    </p>
                  </div>
                  <div className="site-chip rounded-2xl p-3">
                    <Clock3 className="h-5 w-5 site-text-strong" />
                  </div>
                </div>

                <a
                  href="https://satreg.collegeboard.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex w-fit items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
                >
                  Register for SAT
                  <ExternalLink className="h-4 w-4" />
                </a>

                <div className="mt-auto pt-6">
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { label: 'Days', value: countdown.days },
                      { label: 'Hours', value: countdown.hours },
                      { label: 'Minutes', value: countdown.minutes },
                      { label: 'Seconds', value: countdown.seconds },
                    ].map((item) => (
                      <div key={item.label} className="site-subpanel rounded-[22px] px-3 py-4 text-center">
                        <p className="site-hero-title text-3xl font-black tracking-[-0.05em] text-amber-500 dark:text-amber-400 drop-shadow-sm">{item.value.toString().padStart(2, '0')}</p>
                        <p className="site-hero-kicker mt-2 text-[10px] font-bold uppercase tracking-[0.22em] text-amber-600/70 dark:text-amber-400/70">
                          {item.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div className="grid gap-4 sm:grid-cols-2" variants={staggerContainerVariants}>
                <motion.div className="site-panel rounded-[28px] p-6" variants={itemRevealVariants}>
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
                      <Target className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">This week</p>
                      <h3 className="site-text-strong text-lg font-black tracking-[-0.03em]">Suggested run</h3>
                    </div>
                  </div>
                  <ul className="site-text mt-4 space-y-3 text-sm leading-6">
                    <li className="flex gap-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500" />
                      One timed practice test
                    </li>
                    <li className="flex gap-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500" />
                      Two focused question-bank drill blocks
                    </li>
                    <li className="flex gap-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500" />
                      Review wrong answers on progress page
                    </li>
                  </ul>
                </motion.div>

                <motion.div className="site-panel rounded-2xl p-6" variants={itemRevealVariants}>
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-blue-100 p-2.5 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                      <Trophy className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Streak</p>
                      <h3 className="site-text-strong text-lg font-black tracking-[-0.03em]">{stats.streak} day run</h3>
                    </div>
                  </div>
                  <p className="site-text mt-4 text-sm leading-6">
                    Small sessions still count. Keep the site warm with short question-bank sets when you do not
                    have time for a full module.
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.section>

        <motion.section className="mt-6 grid gap-6 xl:grid-cols-[1.08fr_0.92fr]" variants={sectionRevealVariants}>
          <motion.div className="site-panel rounded-[32px] p-6 sm:p-7" variants={itemRevealVariants}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="site-text-faint text-[11px] font-bold uppercase tracking-[0.24em]">Primary paths</p>
                <h2 className="site-text-strong mt-2 text-3xl font-black tracking-[-0.04em]">Where you train next</h2>
              </div>
            </div>

            <motion.div className="mt-6 grid gap-4" variants={staggerContainerVariants}>
              {quickLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.div key={item.title} variants={itemRevealVariants} whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}>
                  <Link
                    key={item.title}
                    href={item.href}
                    className="site-card-strong group relative block w-full overflow-hidden rounded-[28px] p-5 transition hover:scale-[1.02] shadow-[0_12px_24px_rgba(0,0,0,0.12)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] hover:brightness-105"
                  >
                    <div className={`pointer-events-none absolute -right-10 top-1/2 h-24 w-24 -translate-y-1/2 bg-gradient-to-br ${item.accent} opacity-20 blur-2xl rotate-45 mix-blend-screen`} />
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    <div className="flex items-start justify-between gap-4">
                      <div className={`rounded-[20px] bg-gradient-to-br ${item.accent} p-3 text-white shadow-[0_8px_16px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.4)]`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <ArrowRight className="site-text-faint h-5 w-5 transition group-hover:scale-110" />
                    </div>
                    <h3 className="site-text-strong mt-4 text-xl font-black tracking-[-0.03em]">{item.title}</h3>
                    <p className="mt-2 max-w-xl text-sm leading-6 site-text">{item.body}</p>
                  </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>

          <motion.div className="site-panel rounded-[32px] p-6 sm:p-7" variants={itemRevealVariants}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400">Official schedule</p>
                <h2 className="site-text-strong mt-2 text-3xl font-black tracking-[-0.04em]">Upcoming SAT dates</h2>
              </div>
              <CalendarDays className="h-5 w-5 text-slate-400" />
            </div>

            <motion.div className="mt-6 space-y-4" variants={staggerContainerVariants}>
              {upcomingDates.map((date, index) => {
                const isPrimary = date.date === nextTest.date;
                return (
                  <motion.div
                    key={date.date}
                    variants={itemRevealVariants}
                    className={`rounded-[24px] border p-4 transition ${
                      isPrimary
                        ? 'site-subpanel border-blue-500/30 shadow-[0_12px_20px_rgba(37,99,235,0.06)]'
                        : 'site-subpanel border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-4">
                        <div
                          className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-[18px] text-sm font-black ${
                            isPrimary ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
                          }`}
                        >
                          {date.month}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="site-text-strong text-lg font-black tracking-[-0.03em]">{date.date}</p>
                            {index === 0 && (
                              <span className="rounded-full bg-sky-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-sky-700">
                                Next
                              </span>
                            )}
                          </div>
                          <p className="site-text-muted mt-2 text-sm">
                            Registration deadline: <span className="site-text font-semibold">{date.registrationDeadline}</span>
                          </p>
                          <p className="site-text-faint mt-1 text-sm">
                            Late registration: {date.lateRegistrationDeadline}
                          </p>
                        </div>
                        </div>
                      </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </motion.section>
      </motion.div>
    </div>
  );
}
