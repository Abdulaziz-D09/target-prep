'use client';

import { useState, useEffect, useDeferredValue, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FloatingPageShapes, pageRevealVariants, itemRevealVariants, staggerContainerVariants, sectionRevealVariants } from '@/components/SiteMotion';
import { Target, ArrowRight, PlayCircle, FileText, CheckCircle2, Sparkles, BookOpen, Calculator, Video, X, Minus, Plus, PenLine, ChevronLeft, ChevronRight } from 'lucide-react';

const CHAPTER_THEMES: Record<string, { gradient: string; borderColorClass: string; bgColorClass: string; glowColorClass: string; washColorClass: string; bgBadge: string; textAccent: string }> = {
  // English
  'Craft and Structure': {
    gradient: 'from-blue-600 to-cyan-500',
    borderColorClass: 'border-blue-600 dark:border-blue-400',
    bgColorClass: 'bg-blue-600 dark:bg-blue-500',
    glowColorClass: 'shadow-[0_0_15px_rgba(37,99,235,0.2)] dark:shadow-[0_0_15px_rgba(96,165,250,0.2)]',
    washColorClass: 'from-blue-600/10 dark:from-blue-400/20',
    bgBadge: 'bg-blue-600/10 text-blue-700 dark:text-blue-400 border border-blue-600/20 dark:border-blue-400/20',
    textAccent: 'text-blue-700 dark:text-blue-400'
  },
  'Expression of Ideas': {
    gradient: 'from-indigo-600 to-purple-500',
    borderColorClass: 'border-indigo-600 dark:border-indigo-400',
    bgColorClass: 'bg-indigo-600 dark:bg-indigo-500',
    glowColorClass: 'shadow-[0_0_15px_rgba(79,70,229,0.2)] dark:shadow-[0_0_15px_rgba(129,140,248,0.2)]',
    washColorClass: 'from-indigo-600/10 dark:from-indigo-400/20',
    bgBadge: 'bg-indigo-600/10 text-indigo-700 dark:text-indigo-400 border border-indigo-600/20 dark:border-indigo-400/20',
    textAccent: 'text-indigo-700 dark:text-indigo-400'
  },
  'Information and Ideas': {
    gradient: 'from-fuchsia-600 to-rose-500',
    borderColorClass: 'border-fuchsia-600 dark:border-fuchsia-400',
    bgColorClass: 'bg-fuchsia-600 dark:bg-fuchsia-500',
    glowColorClass: 'shadow-[0_0_15px_rgba(217,70,239,0.2)] dark:shadow-[0_0_15px_rgba(232,121,249,0.2)]',
    washColorClass: 'from-fuchsia-600/10 dark:from-fuchsia-400/20',
    bgBadge: 'bg-fuchsia-600/10 text-fuchsia-700 dark:text-fuchsia-400 border border-fuchsia-600/20 dark:border-fuchsia-400/20',
    textAccent: 'text-fuchsia-700 dark:text-fuchsia-400'
  },
  'Standard English Conventions': {
    gradient: 'from-rose-600 to-pink-500',
    borderColorClass: 'border-rose-600 dark:border-rose-400',
    bgColorClass: 'bg-rose-600 dark:bg-rose-500',
    glowColorClass: 'shadow-[0_0_15px_rgba(244,63,94,0.2)] dark:shadow-[0_0_15px_rgba(251,113,133,0.2)]',
    washColorClass: 'from-rose-600/10 dark:from-rose-400/20',
    bgBadge: 'bg-rose-600/10 text-rose-700 dark:text-rose-400 border border-rose-600/20 dark:border-rose-400/20',
    textAccent: 'text-rose-700 dark:text-rose-400'
  },
  // Math
  'Algebra': {
    gradient: 'from-amber-600 to-orange-500',
    borderColorClass: 'border-amber-600 dark:border-amber-400',
    bgColorClass: 'bg-amber-600 dark:bg-amber-500',
    glowColorClass: 'shadow-[0_0_15px_rgba(217,119,6,0.2)] dark:shadow-[0_0_15px_rgba(251,191,36,0.2)]',
    washColorClass: 'from-amber-600/10 dark:from-amber-400/20',
    bgBadge: 'bg-amber-600/10 text-amber-700 dark:text-amber-400 border border-amber-600/20 dark:border-amber-400/20',
    textAccent: 'text-amber-700 dark:text-amber-400'
  },
  'Advanced Math': {
    gradient: 'from-orange-600 to-red-500',
    borderColorClass: 'border-orange-600 dark:border-orange-400',
    bgColorClass: 'bg-orange-600 dark:bg-orange-500',
    glowColorClass: 'shadow-[0_0_15px_rgba(234,88,12,0.2)] dark:shadow-[0_0_15px_rgba(251,146,60,0.2)]',
    washColorClass: 'from-orange-600/10 dark:from-orange-400/20',
    bgBadge: 'bg-orange-600/10 text-orange-700 dark:text-orange-400 border border-orange-600/20 dark:border-orange-400/20',
    textAccent: 'text-orange-700 dark:text-orange-400'
  },
  'Problem-Solving and Data Analysis': {
    gradient: 'from-emerald-600 to-teal-500',
    borderColorClass: 'border-emerald-600 dark:border-emerald-400',
    bgColorClass: 'bg-emerald-600 dark:bg-emerald-500',
    glowColorClass: 'shadow-[0_0_15px_rgba(5,150,105,0.2)] dark:shadow-[0_0_15px_rgba(52,211,153,0.2)]',
    washColorClass: 'from-emerald-600/10 dark:from-emerald-400/20',
    bgBadge: 'bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 border border-emerald-600/20 dark:border-emerald-400/20',
    textAccent: 'text-emerald-700 dark:text-emerald-400'
  },
  'Geometry and Trigonometry': {
    gradient: 'from-cyan-600 to-blue-500',
    borderColorClass: 'border-cyan-600 dark:border-cyan-400',
    bgColorClass: 'bg-cyan-600 dark:bg-cyan-500',
    glowColorClass: 'shadow-[0_0_15px_rgba(6,182,212,0.2)] dark:shadow-[0_0_15px_rgba(34,211,238,0.2)]',
    washColorClass: 'from-cyan-600/10 dark:from-cyan-400/20',
    bgBadge: 'bg-cyan-600/10 text-cyan-700 dark:text-cyan-400 border border-cyan-600/20 dark:border-cyan-400/20',
    textAccent: 'text-cyan-700 dark:text-cyan-400'
  }
};

const CURRICULUM = {
  English: [
    { chapter: 'Craft and Structure', questions: 413, topics: [{ name: 'Cross-Text Connections', q: 53 }, { name: 'Text Structure and Purpose', q: 133 }, { name: 'Words in Context', q: 227 }] },
    { chapter: 'Expression of Ideas', questions: 461, topics: [{ name: 'Rhetorical Synthesis', q: 300 }, { name: 'Transitions', q: 161 }] },
    { chapter: 'Information and Ideas', questions: 356, topics: [{ name: 'Central Ideas and Details', q: 56 }, { name: 'Command of Evidence', q: 127 }, { name: 'Inferences', q: 173 }] },
    { chapter: 'Standard English Conventions', questions: 370, topics: [{ name: 'Boundaries', q: 343 }, { name: 'Form, Structure, and Sense', q: 27 }] }
  ],
  Math: [
    { chapter: 'Algebra', questions: 0, topics: [{ name: 'Linear equations in one variable', q: 0 }, { name: 'Linear functions', q: 0 }, { name: 'Linear equations in two variables', q: 0 }, { name: 'Systems of two linear equations in two variables', q: 0 }, { name: 'Linear inequalities in one or two variables', q: 0 }] },
    { chapter: 'Advanced Math', questions: 0, topics: [{ name: 'Equivalent expressions', q: 0 }, { name: 'Nonlinear equations in one variable and systems of equations in two variables', q: 0 }, { name: 'Nonlinear functions', q: 0 }] },
    { chapter: 'Problem-Solving and Data Analysis', questions: 0, topics: [{ name: 'Ratios, rates, proportional relationships, and units', q: 0 }, { name: 'Percentages', q: 0 }, { name: 'One-variable data: Distributions and measures of center and spread', q: 0 }, { name: 'Two-variable data: Models and scatterplots', q: 0 }, { name: 'Probability and conditional probability', q: 0 }, { name: 'Inference from sample statistics and margin of error', q: 0 }, { name: 'Evaluating statistical claims: Observational studies and experiments', q: 0 }] },
    { chapter: 'Geometry and Trigonometry', questions: 0, topics: [{ name: 'Area and volume', q: 0 }, { name: 'Lines, angles, and triangles', q: 0 }, { name: 'Right triangles and trigonometry', q: 0 }, { name: 'Circles', q: 0 }] }
  ]
};

const PLACEMENT_TOPICS = [
  'Algebra', 'Advanced Math', 'Geometry', 'Statistics', 'Word Problems', 
  'Reading Comprehension', 'Vocabulary in Context', 'Command of Evidence', 
  'Transitions', 'Rhetorical Purpose', 'Standard English', 'Data Analysis'
];

export default function StudyPlanPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'plan' | 'vault'>('plan');
  const [planState, setPlanState] = useState<'loading' | 'onboarding' | 'placement' | 'test' | 'active'>('loading');
  
  const englishScrollRef = useRef<HTMLDivElement>(null);
  const mathScrollRef = useRef<HTMLDivElement>(null);

  const scrollRoadmap = (subject: 'english' | 'math', direction: 'left' | 'right') => {
    const ref = subject === 'english' ? englishScrollRef : mathScrollRef;
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -460 : 460;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Onboarding state
  const [examDate, setExamDate] = useState('');
  const [targetScore, setTargetScore] = useState('1500');
  const [hours, setHours] = useState('3-5 hrs');

  // Placement Test state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  
  // Node Modal
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [masteredTopics, setMasteredTopics] = useState<string[]>([]);

  // Score Calculator State (Module Based)
  const [readingMod1, setReadingMod1] = useState(14);
  const [readingMod2, setReadingMod2] = useState(14);
  const [mathMod1, setMathMod1] = useState(11);
  const [mathMod2, setMathMod2] = useState(11);

  useEffect(() => {
    const savedPlan = localStorage.getItem('targetprep_plan_state');
    const savedDate = localStorage.getItem('targetprep_exam_date');
    const savedScore = localStorage.getItem('targetprep_target_score');
    const savedMastered = localStorage.getItem('targetprep_mastered_topics');
    
    if (savedDate) setExamDate(savedDate);
    if (savedScore) setTargetScore(savedScore);
    if (savedMastered) {
      try {
        setMasteredTopics(JSON.parse(savedMastered));
      } catch (e) {
        console.error(e);
      }
    }

    if (savedPlan) {
      setPlanState(savedPlan as any);
    } else {
      setPlanState('onboarding');
    }
  }, []);

  const saveState = (state: string) => {
    setPlanState(state as any);
    localStorage.setItem('targetprep_plan_state', state);
    if (examDate) localStorage.setItem('targetprep_exam_date', examDate);
    if (targetScore) localStorage.setItem('targetprep_target_score', targetScore);

    if (state === 'active') {
      localStorage.setItem('targetprep_plan', 'true');
    }
  };

  const setAndSaveMastered = (topics: string[]) => {
    setMasteredTopics(topics);
    localStorage.setItem('targetprep_mastered_topics', JSON.stringify(topics));
  };

  const handleBuildPlan = () => saveState('placement');
  
  const handleSkipTest = () => {
    setAndSaveMastered([
      'Linear functions', 
      'Boundaries', 
      'Transitions', 
      'Area and volume', 
      'Cross-Text Connections'
    ]);
    saveState('active');
  };
  
  const handleStartTest = () => {
    router.push('/practice/test/baseline');
  };
  
  const handleNextQuestion = () => {
    if (currentQuestion < PLACEMENT_TOPICS.length - 1) {
      setCurrentQuestion(c => c + 1);
    } else {
      setAndSaveMastered([
        'Linear functions', 
        'Boundaries', 
        'Transitions', 
        'Area and volume', 
        'Cross-Text Connections'
      ]);
      saveState('active');
    }
  };

  // Render Vault Calculator Score — use deferred values for smooth dragging
  const dReadingMod1 = useDeferredValue(readingMod1);
  const dReadingMod2 = useDeferredValue(readingMod2);
  const dMathMod1 = useDeferredValue(mathMod1);
  const dMathMod2 = useDeferredValue(mathMod2);
  const calcMathScore = Math.min(800, 200 + ((dMathMod1 + dMathMod2) * 13.6));
  const calcReadingScore = Math.min(800, 200 + ((dReadingMod1 + dReadingMod2) * 11.1));
  const calcTotalScore = Math.round((calcMathScore + calcReadingScore) / 10) * 10;

  return (
    <div className="relative min-h-screen pt-4 pb-12 px-4 sm:px-6 lg:px-8">
      <FloatingPageShapes theme="home" />

      <div className="relative z-10 mx-auto max-w-[1320px]">
        
        {/* Tabs Header — flush left, same position as hero chip on other pages */}
        <div className="flex mb-6">
          <div className="flex gap-2 p-1.5 site-subpanel rounded-[20px] shadow-sm border border-slate-200 dark:border-slate-800/60">
            <button
              onClick={() => setActiveTab('plan')}
              className={`px-8 py-2.5 text-sm font-bold rounded-xl transition-all ${
                activeTab === 'plan' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
              }`}
            >
              Plan
            </button>
            <button
              onClick={() => setActiveTab('vault')}
              className={`px-8 py-2.5 text-sm font-bold rounded-xl transition-all ${
                activeTab === 'vault' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
              }`}
            >
              Vault
            </button>
          </div>
        </div>

        {planState !== 'loading' && (
          <AnimatePresence mode="wait">
            {activeTab === 'plan' ? (
              <motion.div
                key="tab-plan"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full animate-fade-in"
              >
                {/* Premium glowing site-hero-shell Box wrapping Study Plan header */}
                <motion.section
                  className="site-hero-shell site-hero--home relative mb-7 overflow-hidden rounded-[36px] px-6 py-8 sm:px-8 lg:px-10"
                  variants={sectionRevealVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="absolute -left-8 top-8 h-40 w-40 rounded-full bg-blue-500/8 blur-3xl pointer-events-none" />
                  <div className="absolute right-8 top-8 h-36 w-36 rounded-full bg-indigo-500/7 blur-3xl pointer-events-none" />
                  <div className="absolute bottom-0 left-1/3 h-28 w-28 rounded-full bg-rose-500/6 blur-3xl pointer-events-none" />

                  <motion.div className="relative grid gap-8 xl:grid-cols-[1.15fr_0.85fr] xl:items-end animate-fade-in" variants={staggerContainerVariants}>
                    <motion.div variants={itemRevealVariants}>
                      <p className="site-hero-chip inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em]">
                        <Sparkles className="h-3.5 w-3.5" />
                        Study Center
                      </p>
                      <h1 className="site-hero-title mt-4 text-3xl font-black tracking-[-0.05em] sm:text-[2.6rem]">
                        Study Plan
                      </h1>
                      <p className="site-hero-body mt-3 max-w-2xl text-sm leading-6 sm:text-[15px]">
                        Your personalized path to a higher score.
                      </p>
                    </motion.div>

                    {planState === 'active' && (
                      <motion.div className="grid gap-3 grid-cols-3 xl:max-w-[500px] xl:justify-self-end w-full" variants={staggerContainerVariants}>
                        <motion.div className="site-hero-stat rounded-[22px] px-4 py-4 text-center" variants={itemRevealVariants}>
                          <p className="site-hero-kicker text-[10px] font-bold uppercase tracking-[0.22em]">Exam</p>
                          <p className="site-hero-title mt-2 text-[15px] sm:text-base font-black tracking-[-0.03em] whitespace-nowrap">
                            {examDate ? new Date(examDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Not set'}
                          </p>
                        </motion.div>
                        <motion.div className="site-hero-stat rounded-[22px] px-4 py-4 text-center" variants={itemRevealVariants}>
                          <p className="site-hero-kicker text-[10px] font-bold uppercase tracking-[0.22em]">Target</p>
                          <p className="site-hero-title mt-2 text-xl sm:text-2xl font-black tracking-[-0.05em] text-blue-400">{targetScore || '1500'}</p>
                        </motion.div>
                        <motion.div className="site-hero-stat rounded-[22px] px-4 py-4 text-center" variants={itemRevealVariants}>
                          <p className="site-hero-kicker text-[10px] font-bold uppercase tracking-[0.22em]">Days Left</p>
                          <p className="site-hero-title mt-2 text-xl sm:text-2xl font-black tracking-[-0.05em] text-amber-400">
                            {examDate ? Math.max(0, Math.ceil((new Date(examDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24))) : '--'}
                          </p>
                        </motion.div>
                      </motion.div>
                    )}
                    {planState === 'active' && (
                      <motion.div className="flex justify-end xl:justify-self-end" variants={itemRevealVariants}>
                        <button
                          onClick={() => { localStorage.removeItem('targetprep_plan'); setPlanState('onboarding'); }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-300/40 dark:border-slate-600/40 text-[11px] font-bold site-text-muted hover:site-text-strong hover:border-slate-400/60 transition cursor-pointer"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
                          Retake Placement
                        </button>
                      </motion.div>
                    )}
                  </motion.div>
                </motion.section>

                {planState === 'onboarding' && (
                  <motion.div className="max-w-xl mx-auto site-panel rounded-[32px] p-8" variants={itemRevealVariants} initial="hidden" animate="visible">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="rounded-2xl bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                        <Target className="h-6 w-6" />
                      </div>
                      <h2 className="text-2xl font-black">Set up your study plan</h2>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">When is your exam?</label>
                        <input 
                          type="date" 
                          value={examDate}
                          onChange={(e) => setExamDate(e.target.value)}
                          className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">Target Score (400-1600)</label>
                        <input 
                          type="number" 
                          min="400" max="1600"
                          value={targetScore}
                          onChange={(e) => setTargetScore(e.target.value)}
                          className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">Hours per week?</label>
                        <div className="flex gap-3">
                          {['1-2 hrs', '3-5 hrs', '6+ hrs'].map(opt => (
                            <button 
                              key={opt}
                              onClick={() => setHours(opt)}
                              className={`flex-1 py-3 rounded-2xl text-sm font-semibold transition ${
                                hours === opt 
                                  ? 'bg-blue-600 text-white shadow-md' 
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <button 
                        onClick={handleBuildPlan}
                        disabled={!examDate || !targetScore}
                        className="w-full mt-4 flex items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#2563eb,#3b82f6)] px-4 py-4 text-base font-bold text-white transition hover:scale-[1.02] shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:hover:scale-100 cursor-pointer"
                      >
                        Build My Plan <ArrowRight className="h-5 w-5" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {planState === 'placement' && (
                  <motion.div className="max-w-xl mx-auto site-panel rounded-[32px] p-8 text-center" variants={itemRevealVariants} initial="hidden" animate="visible">
                    <div className="mx-auto w-16 h-16 rounded-3xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400">
                      <Sparkles className="w-8 h-8" />
                    </div>
                    <h2 className="text-3xl font-black mb-4">Your plan is ready.</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg">
                      But first, let's check your starting level so we can personalize it perfectly to your needs.
                    </p>
                    
                    <div className="flex flex-col gap-4">
                      <button 
                        onClick={handleStartTest}
                        className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#2563eb,#3b82f6)] px-4 py-4 text-base font-bold text-white transition hover:scale-[1.02] shadow-lg shadow-blue-500/20 cursor-pointer"
                      >
                        Take 35-minute diagnostic test
                      </button>
                      <button 
                        onClick={handleSkipTest}
                        className="w-full py-4 text-sm font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 transition cursor-pointer"
                      >
                        Skip, use a general plan
                      </button>
                    </div>
                  </motion.div>
                )}



                {planState === 'active' && (
                  <motion.div className="w-full space-y-12 mt-6" variants={staggerContainerVariants} initial="hidden" animate="visible">
                    
                    {/* English (Upper) Track */}
                    <div className="site-panel rounded-[32px] p-6 relative overflow-hidden shadow-2xl">
                      <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                            <BookOpen className="w-5 h-5 text-blue-400" />
                          </div>
                          <div>
                            <h2 className="text-xl font-black site-text-strong tracking-tight">Reading &amp; Writing Roadmap</h2>
                            <p className="text-[13px] site-text-muted font-semibold mt-0.5">Master Craft, Expression, Information, and Conventions</p>
                          </div>
                        </div>
                        
                        {/* Scroll Controls */}
                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          <button 
                            onClick={() => scrollRoadmap('english', 'left')}
                            className="w-10 h-10 rounded-xl site-subpanel site-text-muted hover:site-text-strong flex items-center justify-center transition shadow-md cursor-pointer"
                            aria-label="Scroll Left"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => scrollRoadmap('english', 'right')}
                            className="w-10 h-10 rounded-xl site-subpanel site-text-muted hover:site-text-strong flex items-center justify-center transition shadow-md cursor-pointer"
                            aria-label="Scroll Right"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Horizontal Scrolling English Roadmap Area */}
                      <div 
                        ref={englishScrollRef}
                        className="overflow-x-auto flex flex-row items-stretch gap-4 pb-4 pr-10 scroll-smooth snap-x"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                      >
                        {CURRICULUM.English.map((chapter, i) => {
                          const theme = CHAPTER_THEMES[chapter.chapter] || CHAPTER_THEMES['Craft and Structure'];
                          return (
                            <div key={i} className="flex flex-row items-center flex-shrink-0">
                              <div className="site-subpanel rounded-[28px] p-8 shadow-xl relative min-h-[230px] flex items-center transition-all min-w-[560px] snap-start overflow-hidden">
                                {/* Left color wash — soft blend from theme color into card background */}
                                <div 
                                  className={`absolute left-0 top-0 bottom-0 w-[45%] rounded-l-[28px] pointer-events-none z-0 bg-gradient-to-r ${theme.washColorClass} to-transparent`}
                                />
                                {/* Left Big Sign Column */}
                                <div className="flex flex-col justify-center min-w-[200px] border-r border-slate-200/30 dark:border-slate-700/40 pr-6 mr-6 h-full relative z-10">
                                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3 ${theme.bgBadge} w-max`}>
                                    <Sparkles className="w-3 h-3" />
                                    Domain
                                  </span>
                                  <h4 className="text-[15px] font-black site-text-strong leading-snug tracking-tight">
                                    {chapter.chapter}
                                  </h4>
                                </div>
                                
                                {/* Right Subtopic Nodes Row */}
                                <div className="flex items-center gap-4 relative z-10">
                                  {chapter.topics.map((topic, j) => {
                                    const isMastered = masteredTopics.includes(topic.name);
                                    return (
                                      <div key={topic.name} className="flex items-center flex-shrink-0">
                                        <div 
                                          onClick={() => setSelectedNode({ ...topic, title: topic.name, type: 'Topic Practice', chapter: chapter.chapter, duration: '15 mins', status: 'active', mastered: isMastered })}
                                          className={`relative flex items-center justify-center p-4 rounded-[20px] border transition-all cursor-pointer min-w-[150px] max-w-[200px] ${
                                            isMastered 
                                              ? 'bg-emerald-500 dark:bg-emerald-950/30 border-emerald-600 dark:border-emerald-600/60 text-white dark:text-emerald-400 shadow-lg' 
                                              : 'site-panel site-text hover:border-blue-500/40'
                                          }`}
                                        >
                                          <div className="flex flex-col items-center text-center gap-2">
                                            {isMastered ? (
                                              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                            ) : (
                                              <div className="w-5 h-5 rounded-full border border-slate-400/40 flex items-center justify-center text-[10px] font-bold site-text-muted">
                                                {j + 1}
                                              </div>
                                            )}
                                            <span className="font-semibold text-[12px] leading-snug max-w-[130px] line-clamp-2 site-text">
                                              {topic.name}
                                            </span>
                                          </div>
                                        </div>
                                        
                                        {/* Connector line inside chapter */}
                                        {j < chapter.topics.length - 1 && (
                                          <div className="flex items-center gap-1 flex-shrink-0 px-1">
                                            <div className={`h-[2px] w-6 rounded-full ${masteredTopics.includes(chapter.topics[j+1].name) && isMastered ? 'bg-emerald-500' : 'bg-slate-300/30 dark:bg-slate-700'}`} />
                                            <ArrowRight className={`w-4 h-4 flex-shrink-0 ${masteredTopics.includes(chapter.topics[j+1].name) && isMastered ? 'text-emerald-500' : 'site-text-faint'}`} />
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                              
                              {/* Connector between chapters */}
                              {i < CURRICULUM.English.length - 1 && (
                                <div className="flex items-center gap-1 px-2 flex-shrink-0">
                                  <div className="h-[2px] w-8 rounded-full bg-indigo-500/30" />
                                  <ArrowRight className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                                  <div className="h-[2px] w-8 rounded-full bg-indigo-500/30" />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    {/* Math (Lower) Track */}
                    <div className="site-panel rounded-[32px] p-6 relative overflow-hidden shadow-2xl">
                      <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                            <Calculator className="w-5 h-5 text-amber-400" />
                          </div>
                          <div>
                            <h2 className="text-xl font-black site-text-strong tracking-tight">Math Roadmap</h2>
                            <p className="text-[13px] site-text-muted font-semibold mt-0.5">Master Algebra, Advanced Math, Word Problems, and Geometry</p>
                          </div>
                        </div>

                        {/* Scroll Controls */}
                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          <button
                            onClick={() => scrollRoadmap('math', 'left')}
                            className="w-10 h-10 rounded-xl site-subpanel site-text-muted hover:site-text-strong flex items-center justify-center transition shadow-md cursor-pointer"
                            aria-label="Scroll Left"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => scrollRoadmap('math', 'right')}
                            className="w-10 h-10 rounded-xl site-subpanel site-text-muted hover:site-text-strong flex items-center justify-center transition shadow-md cursor-pointer"
                            aria-label="Scroll Right"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Horizontal Scrolling Math Roadmap Area */}
                      <div 
                        ref={mathScrollRef}
                        className="overflow-x-auto flex flex-row items-stretch gap-4 pb-4 pr-10 scroll-smooth snap-x"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                      >
                        {CURRICULUM.Math.map((chapter, i) => {
                          const theme = CHAPTER_THEMES[chapter.chapter] || CHAPTER_THEMES['Algebra'];
                          return (
                            <div key={i} className="flex flex-row items-center flex-shrink-0">
                              <div className="site-subpanel rounded-[28px] p-8 shadow-xl relative min-h-[230px] flex items-center transition-all min-w-[560px] snap-start overflow-hidden">
                                {/* Left color wash — soft blend from theme color into card background */}
                                <div
                                  className={`absolute left-0 top-0 bottom-0 w-[45%] rounded-l-[28px] pointer-events-none z-0 bg-gradient-to-r ${theme.washColorClass} to-transparent`}
                                />
                                {/* Left Big Sign Column */}
                                <div className="flex flex-col justify-center min-w-[200px] border-r border-slate-200/30 dark:border-slate-700/40 pr-6 mr-6 h-full relative z-10">
                                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3 ${theme.bgBadge} w-max`}>
                                    <Sparkles className="w-3 h-3" />
                                    Domain
                                  </span>
                                  <h4 className="text-[15px] font-black site-text-strong leading-snug tracking-tight">
                                    {chapter.chapter}
                                  </h4>
                                </div>
                                
                                {/* Right Subtopic Nodes Row */}
                                <div className="flex items-center gap-4 relative z-10">
                                  {chapter.topics.map((topic, j) => {
                                    const isMastered = masteredTopics.includes(topic.name);
                                    return (
                                      <div key={topic.name} className="flex items-center flex-shrink-0">
                                        <div 
                                          onClick={() => setSelectedNode({ ...topic, title: topic.name, type: 'Topic Practice', chapter: chapter.chapter, duration: '15 mins', status: 'active', mastered: isMastered })}
                                          className={`relative flex items-center justify-center p-4 rounded-[20px] border transition-all cursor-pointer min-w-[150px] max-w-[200px] ${
                                            isMastered 
                                              ? 'bg-emerald-500 dark:bg-emerald-950/30 border-emerald-600 dark:border-emerald-600/60 text-white dark:text-emerald-400 shadow-lg' 
                                              : 'site-panel site-text hover:border-amber-500/40'
                                          }`}
                                        >
                                          <div className="flex flex-col items-center text-center gap-2">
                                            {isMastered ? (
                                              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                            ) : (
                                              <div className="w-5 h-5 rounded-full border border-slate-400/40 flex items-center justify-center text-[10px] font-bold site-text-muted">
                                                {j + 1}
                                              </div>
                                            )}
                                            <span className="font-semibold text-[12px] leading-snug max-w-[130px] line-clamp-2 site-text">
                                              {topic.name}
                                            </span>
                                          </div>
                                        </div>
                                        
                                        {/* Connector line inside chapter */}
                                        {j < chapter.topics.length - 1 && (
                                          <div className="flex items-center gap-1 flex-shrink-0 px-1">
                                            <div className={`h-[2px] w-6 rounded-full ${masteredTopics.includes(chapter.topics[j+1].name) && isMastered ? 'bg-emerald-500' : 'bg-slate-300/30 dark:bg-slate-700'}`} />
                                            <ArrowRight className={`w-4 h-4 flex-shrink-0 ${masteredTopics.includes(chapter.topics[j+1].name) && isMastered ? 'text-emerald-500' : 'site-text-faint'}`} />
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                              
                              {/* Connector between chapters */}
                              {i < CURRICULUM.Math.length - 1 && (
                                <div className="flex items-center gap-1 px-2 flex-shrink-0">
                                  <div className="h-[2px] w-8 rounded-full bg-amber-500/30" />
                                  <ArrowRight className="w-5 h-5 text-amber-400 flex-shrink-0" />
                                  <div className="h-[2px] w-8 rounded-full bg-amber-500/30" />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="tab-vault"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full space-y-8 animate-fade-in"
              >
                {/* Premium glowing site-hero-shell Box wrapping Study Vault header */}
                <motion.section
                  className="site-hero-shell site-hero--home relative mb-7 overflow-hidden rounded-[36px] px-6 py-8 sm:px-8 lg:px-10"
                  variants={sectionRevealVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="absolute -left-8 top-8 h-40 w-40 rounded-full bg-blue-500/8 blur-3xl pointer-events-none" />
                  <div className="absolute right-8 top-8 h-36 w-36 rounded-full bg-indigo-500/7 blur-3xl pointer-events-none" />
                  <div className="absolute bottom-0 left-1/3 h-28 w-28 rounded-full bg-rose-500/6 blur-3xl pointer-events-none" />

                  <motion.div className="relative grid gap-8 xl:grid-cols-[1.15fr_0.85fr] xl:items-end animate-fade-in" variants={staggerContainerVariants}>
                    <motion.div variants={itemRevealVariants}>
                      <p className="site-hero-chip inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em]">
                        <Sparkles className="h-3.5 w-3.5" />
                        Resources Vault
                      </p>
                      <h1 className="site-hero-title mt-4 text-3xl font-black tracking-[-0.05em] sm:text-[2.6rem]">
                        Study Vault
                      </h1>
                      <p className="site-hero-body mt-3 max-w-2xl text-sm leading-6 sm:text-[15px]">
                        Tools, cheat sheets, and videos to boost your score.
                      </p>
                    </motion.div>
                  </motion.div>
                </motion.section>

                {/* Vault Section: Score Calculator (Redesigned) */}
                <section className="site-panel rounded-[24px] p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-black">Score Calculator</h2>
                  </div>
                  <p className="site-text-muted mb-8 font-medium">Estimate your final score based on practice modules.</p>
                  <style>{`
                    .calc-slider { -webkit-appearance: none; appearance: none; outline: none; --track-bg: #e2e8f0; }
                    :global(.dark) .calc-slider, .dark .calc-slider { --track-bg: #334155; }
                    .calc-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 20px; height: 20px; border-radius: 50%; background: white; border: 3px solid currentColor; box-shadow: 0 2px 6px rgba(0,0,0,0.25); cursor: pointer; }
                    .calc-slider::-moz-range-thumb { width: 20px; height: 20px; border-radius: 50%; background: white; border: 3px solid currentColor; box-shadow: 0 2px 6px rgba(0,0,0,0.25); cursor: pointer; }
                    .calc-slider-blue { color: #3b82f6; }
                    .calc-slider-indigo { color: #6366f1; }
                  `}</style>
                  
                  <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
                    {/* Left: Module sliders */}
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-[11px] font-bold uppercase tracking-[0.22em] text-blue-500 mb-3 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                          Reading and Writing
                        </h3>
                        <div className="space-y-3">
                          {[{val: readingMod1, set: setReadingMod1, max: 27, label: 'Module 1'}, {val: readingMod2, set: setReadingMod2, max: 27, label: 'Module 2'}].map(({val, set, max, label}) => (
                            <div key={label} className="site-subpanel border border-slate-200 dark:border-slate-800/60 rounded-[20px] px-5 py-4">
                              <div className="flex items-center justify-between mb-4">
                                <p className="font-black text-[17px] site-text-strong">{label}</p>
                                <div className="flex items-baseline gap-0.5">
                                  <span className="text-[22px] font-black site-text-strong">{val}</span>
                                  <span className="text-slate-400 font-bold text-sm ml-1">/ {max}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <button className="w-9 h-9 flex-shrink-0 rounded-full border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer" onClick={() => set(Math.max(0, val - 1))}><Minus className="w-4 h-4" /></button>
                                <input
                                  type="range" min="0" max={max} value={val}
                                  onChange={e => set(Number(e.target.value))}
                                  className="calc-slider calc-slider-blue flex-1 h-2 rounded-full cursor-pointer"
                                  style={{ background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(val/max)*100}%, var(--track-bg) ${(val/max)*100}%, var(--track-bg) 100%)` }}
                                />
                                <button className="w-9 h-9 flex-shrink-0 rounded-full border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer" onClick={() => set(Math.min(max, val + 1))}><Plus className="w-4 h-4" /></button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-[11px] font-bold uppercase tracking-[0.22em] text-indigo-500 mb-3 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" />
                          Math
                        </h3>
                        <div className="space-y-3">
                          {[{val: mathMod1, set: setMathMod1, max: 22, label: 'Module 1'}, {val: mathMod2, set: setMathMod2, max: 22, label: 'Module 2'}].map(({val, set, max, label}) => (
                            <div key={label} className="site-subpanel border border-slate-200 dark:border-slate-800/60 rounded-[20px] px-5 py-4">
                              <div className="flex items-center justify-between mb-4">
                                <p className="font-black text-[17px] site-text-strong">{label}</p>
                                <div className="flex items-baseline gap-0.5">
                                  <span className="text-[22px] font-black site-text-strong">{val}</span>
                                  <span className="text-slate-400 font-bold text-sm ml-1">/ {max}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <button className="w-9 h-9 flex-shrink-0 rounded-full border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer" onClick={() => set(Math.max(0, val - 1))}><Minus className="w-4 h-4" /></button>
                                <input
                                  type="range" min="0" max={max} value={val}
                                  onChange={e => set(Number(e.target.value))}
                                  className="calc-slider calc-slider-indigo flex-1 h-2 rounded-full cursor-pointer"
                                  style={{ background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${(val/max)*100}%, var(--track-bg) ${(val/max)*100}%, var(--track-bg) 100%)` }}
                                />
                                <button className="w-9 h-9 flex-shrink-0 rounded-full border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer" onClick={() => set(Math.min(max, val + 1))}><Plus className="w-4 h-4" /></button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right: Results Panel */}
                    <div className="flex flex-col rounded-[28px] overflow-hidden bg-[linear-gradient(160deg,#0f2d6b,#1e40af,#1d4ed8)] text-white shadow-2xl shadow-blue-900/30 sticky top-8">
                      <div className="px-7 pt-7 pb-5 border-b border-white/10">
                        <p className="text-[11px] font-black uppercase tracking-[0.25em] text-blue-200 text-center">Results</p>
                      </div>
                      <div className="px-6 pt-5 space-y-3">
                        <div className="flex items-center justify-between rounded-[16px] bg-white/8 px-5 py-4">
                          <span className="font-semibold text-[15px] text-blue-100">Reading and Writing</span>
                          <span className="text-[22px] font-black bg-white text-blue-700 rounded-xl px-3 py-1 shadow">{Math.round(calcReadingScore/10)*10}</span>
                        </div>
                        <div className="flex items-center justify-between rounded-[16px] bg-white/8 px-5 py-4">
                          <span className="font-semibold text-[15px] text-blue-100">Math</span>
                          <span className="text-[22px] font-black bg-white text-blue-700 rounded-xl px-3 py-1 shadow">{Math.round(calcMathScore/10)*10}</span>
                        </div>
                      </div>
                      <div className="mx-6 my-5 border-t border-white/10" />
                      <div className="px-6 text-center">
                        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-300 mb-2">Predicted Total Score</p>
                        <p className="text-[72px] font-black tracking-tighter leading-none text-white drop-shadow-xl">{calcTotalScore}</p>
                      </div>
                      
                      <div className="flex flex-col items-center gap-3 px-6 pb-8 pt-6">
                        <div className="w-24 h-24 rounded-[22px] overflow-hidden shadow-xl">
                          <img src="/logo.jpg" alt="TargetPrep" className="w-full h-full object-cover" />
                        </div>
                        <p className="text-sm text-blue-200 text-center leading-relaxed">
                          Based on your scores, you'd be in approximately the{' '}
                          <strong className="text-white font-black">
                            {calcTotalScore >= 1550 ? '99th' :
                              calcTotalScore >= 1500 ? '98th' :
                              calcTotalScore >= 1450 ? '97th' :
                              calcTotalScore >= 1400 ? '94th' :
                              calcTotalScore >= 1350 ? '91st' :
                              calcTotalScore >= 1300 ? '87th' :
                              calcTotalScore >= 1250 ? '81st' :
                              calcTotalScore >= 1200 ? '74th' :
                              calcTotalScore >= 1150 ? '67th' :
                              calcTotalScore >= 1100 ? '58th' :
                              calcTotalScore >= 1050 ? '49th' :
                              calcTotalScore >= 1000 ? '40th' :
                              calcTotalScore >= 950  ? '32nd' :
                              calcTotalScore >= 900  ? '24th' :
                              calcTotalScore >= 850  ? '17th' :
                              calcTotalScore >= 800  ? '11th' :
                              '5th'} percentile
                          </strong>{' '}
                          of TargetPrep practice exam takers.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Vault Section: Cheat Sheets */}
                <section className="site-panel rounded-[24px] p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="rounded-xl bg-amber-100 p-2.5 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                      <FileText className="h-6 w-6" />
                    </div>
                    <h2 className="text-2xl font-black">Cheat Sheets</h2>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* Formula Sheet Pack Card */}
                    <div className="relative p-6 rounded-[20px] border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-[#111827] shadow-sm hover:shadow-md hover:border-amber-500/50 dark:hover:border-amber-500/40 transition-all cursor-pointer group">
                      <div className="flex items-start justify-between mb-5">
                        <div className="w-11 h-11 rounded-[14px] bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                          <Calculator className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                        </div>
                      </div>
                      <h3 className="font-black text-[17px] site-text-strong mb-1.5">Formula Sheet Pack</h3>
                      <p className="text-[13px] site-text-muted font-medium leading-relaxed">Essential SAT math formulas with quick examples and visual memory cues.</p>
                      <div className="mt-5">
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                          Preparing
                        </span>
                      </div>
                    </div>

                    {/* Grammar Rules Card */}
                    <div className="relative p-6 rounded-[20px] border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-[#111827] shadow-sm hover:shadow-md hover:border-amber-500/50 dark:hover:border-amber-500/40 transition-all cursor-pointer group">
                      <div className="flex items-start justify-between mb-5">
                        <div className="w-11 h-11 rounded-[14px] bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                          <PenLine className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                        </div>
                      </div>
                      <h3 className="font-black text-[17px] site-text-strong mb-1.5">Grammar Rules</h3>
                      <p className="text-[13px] site-text-muted font-medium leading-relaxed">High-impact grammar rules mapped to Standard English Convention question types.</p>
                      <div className="mt-5">
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                          Preparing
                        </span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Vault Section: Videos */}
                <section className="site-panel rounded-[24px] p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="rounded-xl bg-rose-100 p-2.5 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400">
                      <Video className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black">Video Lessons</h2>
                      <p className="text-sm site-text-muted font-medium mt-0.5">Curated Khan Academy & YouTube lessons mapped to each roadmap topic</p>
                    </div>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {[
                      { id: 'kPxQfGU6Keg', title: 'Linear Equations — SAT Algebra', day: 'Day 1', subject: 'Math', duration: '12 min', source: 'Khan Academy', color: 'amber' },
                      { id: 'n-os2ArEFiA', title: 'SAT Reading: Main Ideas & Details', day: 'Day 4', subject: 'English', duration: '10 min', source: 'Khan Academy', color: 'indigo' },
                      { id: '5nC5c46TA_s', title: 'Advanced Math: Quadratics', day: 'Day 3', subject: 'Math', duration: '14 min', source: 'Khan Academy', color: 'orange' },
                      { id: 'OmJ-4B-mS-Y', title: 'Command of Evidence — SAT Reading', day: 'Day 2', subject: 'English', duration: '9 min', source: 'Khan Academy', color: 'blue' },
                      { id: 'rAMNe-NsQyA', title: 'Geometry & Trig — Circles & Angles', day: 'Day 5', subject: 'Math', duration: '11 min', source: 'Khan Academy', color: 'cyan' },
                      { id: 'Z0_FNd8qgB8', title: 'Standard English Conventions', day: 'Day 6', subject: 'English', duration: '8 min', source: 'Khan Academy', color: 'rose' },
                    ].map((v) => {
                      const colorMap: Record<string, { bg: string; text: string; badge: string }> = {
                        amber: { bg: 'bg-amber-500/10', text: 'text-amber-500', badge: 'bg-amber-500/15 text-amber-600 dark:text-amber-400' },
                        indigo: { bg: 'bg-indigo-500/10', text: 'text-indigo-500', badge: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400' },
                        orange: { bg: 'bg-orange-500/10', text: 'text-orange-500', badge: 'bg-orange-500/15 text-orange-600 dark:text-orange-400' },
                        blue: { bg: 'bg-blue-500/10', text: 'text-blue-500', badge: 'bg-blue-500/15 text-blue-600 dark:text-blue-400' },
                        cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-500', badge: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400' },
                        rose: { bg: 'bg-rose-500/10', text: 'text-rose-500', badge: 'bg-rose-500/15 text-rose-600 dark:text-rose-400' },
                      };
                      const c = colorMap[v.color];
                      return (
                        <a
                          key={v.id}
                          href={`https://www.youtube.com/watch?v=${v.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group block rounded-[22px] overflow-hidden border border-slate-200 dark:border-slate-700/50 hover:border-rose-400/50 dark:hover:border-rose-500/40 transition-all shadow-sm hover:shadow-md"
                        >
                          {/* Thumbnail */}
                          <div className="relative aspect-video bg-slate-200 dark:bg-slate-800 overflow-hidden">
                            <img
                              src={`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`}
                              alt={v.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition" />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <svg className="w-5 h-5 text-rose-600 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                              </div>
                            </div>
                            <div className="absolute top-2.5 left-2.5">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${c.badge} backdrop-blur-sm`}>
                                {v.day}
                              </span>
                            </div>
                            <div className="absolute bottom-2.5 right-2.5">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/60 text-white backdrop-blur-sm">
                                {v.duration}
                              </span>
                            </div>
                          </div>
                          {/* Info */}
                          <div className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`text-[10px] font-black uppercase tracking-wider ${c.text}`}>{v.subject}</span>
                              <span className="text-slate-300 dark:text-slate-600">·</span>
                              <span className="text-[10px] font-semibold text-slate-400">{v.source}</span>
                            </div>
                            <p className="font-black text-[14px] site-text-strong leading-snug group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">{v.title}</p>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </section>

                {/* Vault Section: Practice Tests */}
                <section className="site-panel rounded-[24px] p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="rounded-xl bg-blue-100 p-2.5 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black">Official Practice Tests</h2>
                      <p className="text-sm site-text-muted font-medium mt-0.5">Full-length Digital SAT practice tests from College Board</p>
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      { num: 1, title: 'Digital SAT Practice Test 1', questions: 98, time: '134 min', href: 'https://satsuite.collegeboard.org/media/pdf/digital-sat-practice-test-1.pdf', new: false },
                      { num: 2, title: 'Digital SAT Practice Test 2', questions: 98, time: '134 min', href: 'https://satsuite.collegeboard.org/media/pdf/digital-sat-practice-test-2.pdf', new: false },
                      { num: 3, title: 'Digital SAT Practice Test 3', questions: 98, time: '134 min', href: 'https://satsuite.collegeboard.org/media/pdf/digital-sat-practice-test-3.pdf', new: false },
                      { num: 4, title: 'Digital SAT Practice Test 4', questions: 98, time: '134 min', href: 'https://satsuite.collegeboard.org/media/pdf/digital-sat-practice-test-4.pdf', new: true },
                    ].map((test) => (
                      <a
                        key={test.num}
                        href={test.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between gap-4 p-5 rounded-[20px] border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-[#111827] hover:border-blue-400/50 dark:hover:border-blue-500/40 hover:shadow-md transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-[14px] bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-lg font-black text-blue-600 dark:text-blue-400">#{test.num}</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-black text-[15px] site-text-strong">{test.title}</h3>
                              {test.new && <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase tracking-wider">New</span>}
                            </div>
                            <p className="text-[12px] site-text-muted mt-0.5">{test.time}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[11px] font-semibold site-text-muted group-hover:text-blue-500 transition">Download PDF</span>
                          <svg className="w-4 h-4 site-text-muted group-hover:text-blue-500 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        </div>
                      </a>
                    ))}
                  </div>
                </section>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Node Modal */}
      <AnimatePresence>
        {selectedNode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedNode(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-white dark:bg-[#0f111a] rounded-[32px] p-8 shadow-2xl border border-slate-200 dark:border-slate-800"
            >
              <button onClick={() => setSelectedNode(null)} className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer">
                <X className="w-4 h-4" />
              </button>
              
              <div className="mb-8 mt-2">
                <span className="inline-block px-3 py-1.5 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                  {selectedNode.type} &middot; {selectedNode.duration}
                </span>
                <h2 className="text-3xl font-black tracking-tight leading-tight">{selectedNode.title}</h2>
              </div>
              
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer">
                  <PlayCircle className="w-5 h-5" /> Watch Lesson
                </button>
                <button className={`w-full flex items-center justify-center gap-2 px-4 py-4 rounded-2xl font-bold transition shadow-lg cursor-pointer ${
                  selectedNode.status === 'locked' 
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 shadow-none cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20'
                }`}>
                  <FileText className="w-5 h-5" /> Practice
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
