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
  Map,
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

const STUDY_PLAN_DAYS = [
  {
    day: 1,
    title: 'Algebra Fundamentals',
    subject: 'Math',
    color: 'amber',
    gradient: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-500',
    glow: 'rgba(245,158,11,0.15)',
    description: 'Linear equations in one variable, systems, and core algebraic manipulation.',
    tip: 'Focus on isolating variables and recognizing equation types quickly.',
  },
  {
    day: 2,
    title: 'Command of Evidence',
    subject: 'English',
    color: 'blue',
    gradient: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
    glow: 'rgba(59,130,246,0.15)',
    description: 'Textual and quantitative evidence, inference chains, and claim support.',
    tip: 'Read the claim first, then scan for the option that directly matches it.',
  },
  {
    day: 3,
    title: 'Advanced Math',
    subject: 'Math',
    color: 'orange',
    gradient: 'from-orange-500 to-red-500',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    text: 'text-orange-400',
    glow: 'rgba(249,115,22,0.15)',
    description: 'Nonlinear functions, polynomials, abstract constants, and equation systems.',
    tip: 'When you see a constant like k or c, plug in numbers to test behavior.',
  },
  {
    day: 4,
    title: 'Reading Comprehension',
    subject: 'English',
    color: 'indigo',
    gradient: 'from-indigo-500 to-purple-600',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/30',
    text: 'text-indigo-400',
    glow: 'rgba(99,102,241,0.15)',
    description: 'Central ideas, words in context, author purpose, and passage structure.',
    tip: 'The correct answer to "main idea" is almost never the first sentence alone.',
  },
  {
    day: 5,
    title: 'Geometry & Trig',
    subject: 'Math',
    color: 'cyan',
    gradient: 'from-cyan-500 to-blue-500',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    text: 'text-cyan-400',
    glow: 'rgba(6,182,212,0.15)',
    description: 'Circles, triangles, angle relationships, and trigonometric ratios.',
    tip: 'Memorize the unit circle and the special right triangle ratios before test day.',
  },
  {
    day: 6,
    title: 'Standard English',
    subject: 'English',
    color: 'rose',
    gradient: 'from-rose-500 to-pink-500',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    text: 'text-rose-400',
    glow: 'rgba(244,63,94,0.15)',
    description: 'Sentence boundaries, transitions, punctuation, and grammatical agreement.',
    tip: 'If you can split the blank into two full sentences, a semicolon always works.',
  },
  {
    day: 7,
    title: 'Data Analysis',
    subject: 'Math',
    color: 'emerald',
    gradient: 'from-emerald-500 to-teal-500',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    glow: 'rgba(16,185,129,0.15)',
    description: 'Scatterplots, two-way tables, rates, percent change, and statistical claims.',
    tip: 'Always look at axis labels and units before choosing an answer on chart questions.',
  },
];

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

const SCORE_RELEASE_DATES = [
  { name: 'June SAT', date: 'June 22, 2026', target: '2026-06-22T16:30:00+05:00', testTarget: '2026-06-06T08:00:00' },
  { name: 'August SAT', date: 'September 5, 2026', target: '2026-09-05T16:30:00+05:00', testTarget: '2026-08-22T08:00:00' },
  { name: 'September SAT', date: 'September 25, 2026', target: '2026-09-25T16:30:00+05:00', testTarget: '2026-09-12T08:00:00' },
  { name: 'October SAT', date: 'October 17, 2026', target: '2026-10-17T16:30:00+05:00', testTarget: '2026-10-03T08:00:00' },
  { name: 'November SAT', date: 'November 20, 2026', target: '2026-11-20T16:30:00+05:00', testTarget: '2026-11-07T08:00:00' },
  { name: 'December SAT', date: 'December 19, 2026', target: '2026-12-19T16:30:00+05:00', testTarget: '2026-12-05T08:00:00' },
];

export default function HomePage() {
  const shouldReduceMotion = useReducedMotion();
  const [todayLabel, setTodayLabel] = useState('');
  const [countdown, setCountdown] = useState<Countdown>(EMPTY_COUNTDOWN);
  const [scoreCountdown, setScoreCountdown] = useState<Countdown>(EMPTY_COUNTDOWN);
  const [stats, setStats] = useState({
    streak: 0,
    avgScore: 0,
    completed: 0,
    answered: 0,
  });
  const [hasPlan, setHasPlan] = useState(false);
  const [todayPlanDay, setTodayPlanDay] = useState<typeof STUDY_PLAN_DAYS[0] | null>(null);

  const nextTest = useMemo(() => {
    return satDates.find((date) => new Date(date.target).getTime() > PAGE_LOAD_TIME) ?? satDates[satDates.length - 1];
  }, []);

  const nextScoreRelease = useMemo(() => {
    // Find a test that has happened but whose scores are not yet released
    const pendingRelease = SCORE_RELEASE_DATES.find(d => new Date(d.testTarget).getTime() <= PAGE_LOAD_TIME && new Date(d.target).getTime() > PAGE_LOAD_TIME);
    
    if (pendingRelease) {
      return { ...pendingRelease, status: 'counting_down' as const };
    }
    
    // If no such test exists, find the next upcoming test
    const nextTestToHappen = SCORE_RELEASE_DATES.find(d => new Date(d.testTarget).getTime() > PAGE_LOAD_TIME);
    if (nextTestToHappen) {
      return { ...nextTestToHappen, status: 'waiting_for_test' as const };
    }
    
    return { ...SCORE_RELEASE_DATES[SCORE_RELEASE_DATES.length - 1], status: 'waiting_for_test' as const };
  }, []);

  const upcomingDates = useMemo(
    () => satDates.filter((date) => new Date(date.target).getTime() >= PAGE_LOAD_TIME),
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

      // Always show a random study plan focus day
      setHasPlan(true);
      const randomIndex = Math.floor(Math.random() * STUDY_PLAN_DAYS.length);
      setTodayPlanDay(STUDY_PLAN_DAYS[randomIndex]);

      try {
        const raw = localStorage.getItem('targetprep_progress');
        if (!raw) return;

        const progress = JSON.parse(raw) as ProgressSnapshot;
        const rawTests = progress.completedTests ?? [];
        const completedTests = rawTests.map(t => {
            const roundedEnglish = Math.max(200, Math.min(800, Math.round(((t as any).englishScore || 200) / 10) * 10));
            const roundedMath = Math.max(200, Math.min(800, Math.round(((t as any).mathScore || 200) / 10) * 10));
            return {
                ...t,
                englishScore: roundedEnglish,
                mathScore: roundedMath,
                totalScore: roundedEnglish + roundedMath
            };
        });

        const rawAvgScore =
          completedTests.length > 0
            ? completedTests.reduce((sum, test) => sum + (test.totalScore ?? 0), 0) / completedTests.length
            : 0;
        const avgScore = Math.round(rawAvgScore / 10) * 10;

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

  useEffect(() => {
    const targetMs = new Date(nextScoreRelease.target).getTime();
    const update = () => setScoreCountdown(getCountdown(targetMs));

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [nextScoreRelease]);

  // Mock predicted score
  const predictedScoreRange = stats.avgScore > 0 ? `${Math.max(400, stats.avgScore - 30)}–${Math.min(1600, stats.avgScore + 30)}` : '--';
  const mathRange = stats.avgScore > 0 ? `${Math.max(200, Math.round(((stats.avgScore / 2) - 10) / 10) * 10)}–${Math.min(800, Math.round(((stats.avgScore / 2) + 20) / 10) * 10)}` : '';
  const engRange = stats.avgScore > 0 ? `${Math.max(200, Math.round(((stats.avgScore / 2) - 20) / 10) * 10)}–${Math.min(800, Math.round(((stats.avgScore / 2) + 10) / 10) * 10)}` : '';

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
      title: 'Performance History',
      body: 'Track your mock scores, question bank accuracy, and specific choices.',
      href: '/dashboard/history',
      icon: TrendingUp,
      accent: 'from-emerald-400 via-emerald-500 to-teal-600',
    },
  ];

  return (
    <div className="relative min-h-screen pt-4 pb-12 px-4 sm:px-6 lg:px-8">
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
            <motion.div className="flex flex-col" variants={itemRevealVariants}>
              <div className="site-hero-chip inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.24em]">
                <Sparkles className="h-3.5 w-3.5" />
                SAT control center
              </div>

              <div className="mt-5 max-w-3xl">
                <p className="site-hero-kicker text-sm font-medium">{todayLabel}</p>
                <h1 className="site-hero-title mt-3 max-w-2xl text-4xl font-black leading-[1.02] tracking-[-0.04em] sm:text-5xl lg:text-[4.3rem]">
                  Practice with structure, not guesswork.
                </h1>
                <p className="site-hero-body mt-4 font-semibold text-blue-600 dark:text-blue-400">
                  Train the real SAT flow from one place: full practice tests, focused question-bank reps, and a clean scoreboard for what is actually moving.
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
                  href="/study-plan"
                  className="site-hero-secondary-btn inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition hover:scale-[1.02] shadow-sm"
                >
                  View Study Vault
                  <Map className="h-4 w-4" />
                </Link>
              </div>

              <motion.div className="mt-10" variants={staggerContainerVariants}>
                <div className="grid gap-4 sm:grid-cols-3">
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
                </div>
                
                {/* Score Predictor */}
                <motion.div className="site-hero-stat mt-4 rounded-[24px] p-5 border-2 border-blue-500/20 bg-blue-50/50 dark:bg-blue-950/20" variants={itemRevealVariants}>
                  <div className="flex items-center gap-2">
                    <p className="site-hero-kicker text-[11px] font-bold uppercase tracking-[0.22em] text-blue-600 dark:text-blue-400">Score Predictor</p>
                    <Sparkles className="h-3.5 w-3.5 text-blue-500" />
                  </div>
                  {stats.completed > 0 ? (
                    <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <p className="text-3xl font-black tracking-[-0.04em] text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                        {predictedScoreRange}
                      </p>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-[10px] font-bold uppercase tracking-widest site-text-muted mb-1">Math</p>
                          <p className="text-lg font-bold text-blue-700 dark:text-blue-400">{mathRange}</p>
                        </div>
                        <div className="w-px h-8 bg-blue-500/20" />
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest site-text-muted mb-1">English</p>
                          <p className="text-lg font-bold text-blue-700 dark:text-blue-400">{engRange}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <p className="text-3xl font-black tracking-[-0.04em] text-slate-300 dark:text-slate-700">
                        --
                      </p>
                      <p className="text-sm font-medium site-text-muted">Complete a practice test to unlock your prediction.</p>
                    </div>
                  )}
                </motion.div>

                {/* Score Release Dates */}
                <motion.div
                  className="site-panel flex flex-col rounded-[28px] p-5 mt-4"
                  variants={itemRevealVariants}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="site-hero-kicker text-[11px] font-bold uppercase tracking-[0.24em]">Score release dates</p>
                      <h2 className="site-hero-title mt-2 text-2xl font-black tracking-[-0.03em]">{nextScoreRelease.name}</h2>
                      <p className="site-hero-body mt-2 text-sm leading-6">
                        {nextScoreRelease.date}
                      </p>
                    </div>
                    <div className="site-chip rounded-2xl p-3">
                      <Clock3 className="h-5 w-5 site-text-strong" />
                    </div>
                  </div>

                  <div className="mt-auto pt-4">
                    {nextScoreRelease.status === 'counting_down' ? (
                      <div className="grid grid-cols-4 gap-3">
                        {[
                          { label: 'Days', value: scoreCountdown.days },
                          { label: 'Hours', value: scoreCountdown.hours },
                          { label: 'Minutes', value: scoreCountdown.minutes },
                          { label: 'Seconds', value: scoreCountdown.seconds },
                        ].map((item) => (
                          <div key={item.label} className="site-subpanel rounded-[16px] px-2 py-3 text-center flex flex-col items-center justify-center">
                            <p className="site-hero-title text-2xl font-black tracking-[-0.05em] text-amber-500 dark:text-amber-400 drop-shadow-sm">{item.value.toString().padStart(2, '0')}</p>
                            <p className="site-hero-kicker mt-1 text-[9px] font-bold uppercase tracking-[0.22em] text-amber-600/70 dark:text-amber-400/70">
                              {item.label}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="site-subpanel rounded-[22px] px-6 py-8 text-center flex flex-col items-center justify-center min-h-[110px]">
                        <p className="text-sm font-semibold text-amber-600/80 dark:text-amber-500/80 uppercase tracking-[0.15em] mb-2">Pending</p>
                        <p className="text-[17px] font-bold text-slate-700 dark:text-slate-300">Test has not occurred yet</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div className="flex flex-col gap-5" variants={staggerContainerVariants}>
              
              {/* Big Countdown Restored */}
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
                      <div key={item.label} className="site-subpanel rounded-[22px] px-3 py-3 text-center flex flex-col items-center justify-center aspect-square">
                        <p className="site-hero-title text-3xl font-black tracking-[-0.05em] text-amber-500 dark:text-amber-400 drop-shadow-sm">{item.value.toString().padStart(2, '0')}</p>
                        <p className="site-hero-kicker mt-2 text-[10px] font-bold uppercase tracking-[0.22em] text-amber-600/70 dark:text-amber-400/70">
                          {item.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Today's Focus — Dynamic Study Plan Day */}
              <motion.div
                className="site-panel flex flex-col rounded-[32px] p-6 overflow-hidden relative"
                variants={itemRevealVariants}
              >
                {/* Background glow wash */}
                {hasPlan && todayPlanDay && (
                  <div
                    className="absolute inset-0 pointer-events-none rounded-[32px]"
                    style={{ background: `radial-gradient(ellipse at 0% 50%, ${todayPlanDay.glow}, transparent 65%)` }}
                  />
                )}

                <div className="relative z-10">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="site-hero-kicker text-[10px] font-bold uppercase tracking-[0.24em]">Today&apos;s Focus</p>
                        {hasPlan && todayPlanDay && (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${todayPlanDay.bg} ${todayPlanDay.text} border ${todayPlanDay.border}`}>
                            {todayPlanDay.subject}
                          </span>
                        )}
                      </div>
                      <h2 className="site-hero-title text-2xl font-black tracking-[-0.03em]">
                        {hasPlan && todayPlanDay ? todayPlanDay.title : 'No Active Plan'}
                      </h2>
                    </div>
                    <div className={`shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center ${hasPlan && todayPlanDay ? `${todayPlanDay.bg} border ${todayPlanDay.border}` : 'bg-slate-100 dark:bg-slate-800'}`}>
                      <Target className={`h-5 w-5 ${hasPlan && todayPlanDay ? todayPlanDay.text : 'text-slate-400'}`} />
                    </div>
                  </div>

                  {hasPlan && todayPlanDay ? (
                    <>
                      <p className="site-hero-body text-sm leading-6 mt-3">{todayPlanDay.description}</p>

                      {/* Day badge + tip */}
                      <div className={`mt-4 rounded-2xl p-3 border ${todayPlanDay.bg} ${todayPlanDay.border}`}>
                        <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${todayPlanDay.text}`}>💡 Quick Tip</p>
                        <p className="text-[12px] site-text font-medium leading-relaxed">{todayPlanDay.tip}</p>
                      </div>

                      {/* 7-day progress dots */}
                      <div className="mt-4 flex items-center gap-1.5">
                        {STUDY_PLAN_DAYS.map((d) => (
                          <div
                            key={d.day}
                            title={`Day ${d.day}: ${d.title}`}
                            className={`h-1.5 flex-1 rounded-full transition-all ${
                              d.day === todayPlanDay.day
                                ? `bg-gradient-to-r ${todayPlanDay.gradient}`
                                : d.day < todayPlanDay.day
                                ? 'bg-emerald-500/60'
                                : 'bg-slate-200 dark:bg-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-[10px] site-text-muted font-semibold mt-1.5">Day {todayPlanDay.day} of 7</p>
                    </>
                  ) : (
                    <p className="site-hero-body mt-2 text-sm leading-6">
                      Check out your daily focus topics and tips in the Study Vault.
                    </p>
                  )}

                  <div className="mt-5">
                    <Link
                      href="/study-plan"
                      className={`inline-flex w-full justify-center items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white transition hover:scale-[1.02] shadow-lg ${
                        hasPlan && todayPlanDay
                          ? `bg-gradient-to-r ${todayPlanDay.gradient} shadow-amber-500/10`
                          : 'bg-[linear-gradient(135deg,#10b981,#059669)] shadow-emerald-500/20'
                      }`}
                    >
                      {hasPlan ? 'Go to Study Vault' : 'Go to Study Vault'}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>

              {/* Big Countdown Restored - REMOVED FROM HERE, MOVED ABOVE */}

              <motion.div className="grid gap-4 sm:grid-cols-2 items-start" variants={staggerContainerVariants}>
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

        <motion.section className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]" variants={sectionRevealVariants}>
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

            <motion.div className="mt-6 space-y-3 max-h-[560px] overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} variants={staggerContainerVariants}>
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
