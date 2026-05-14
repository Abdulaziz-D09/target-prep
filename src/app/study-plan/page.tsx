'use client';

import { useState, useEffect, useCallback, useDeferredValue } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FloatingPageShapes, pageRevealVariants, itemRevealVariants, staggerContainerVariants } from '@/components/SiteMotion';
import { Target, ArrowRight, PlayCircle, FileText, CheckCircle2, Lock, Sparkles, BookOpen, Calculator, Video, UploadCloud, X, Crosshair, Minus, Plus } from 'lucide-react';

const PLAN_NODES = [
  { id: 1, title: 'Algebra Fundamentals', type: 'Math', duration: '45 mins', status: 'completed' },
  { id: 2, title: 'Command of Evidence', type: 'English', duration: '30 mins', status: 'completed' },
  { id: 3, title: 'Advanced Math', type: 'Math', duration: '60 mins', status: 'current' },
  { id: 4, title: 'Reading Comprehension', type: 'English', duration: '45 mins', status: 'locked' },
  { id: 5, title: 'Geometry & Trig', type: 'Math', duration: '60 mins', status: 'locked' },
  { id: 6, title: 'Standard English', type: 'English', duration: '30 mins', status: 'locked' },
  { id: 7, title: 'Data Analysis', type: 'Math', duration: '45 mins', status: 'locked' },
  { id: 8, title: 'Practice Test 1', type: 'Mixed', duration: '140 mins', status: 'locked' },
];

const PLACEMENT_TOPICS = [
  'Algebra', 'Advanced Math', 'Geometry', 'Statistics', 'Word Problems', 
  'Reading Comprehension', 'Vocabulary in Context', 'Command of Evidence', 
  'Transitions', 'Rhetorical Purpose', 'Standard English', 'Data Analysis'
];

export default function StudyPlanPage() {
  const [activeTab, setActiveTab] = useState<'plan' | 'vault'>('plan');
  const [planState, setPlanState] = useState<'loading' | 'onboarding' | 'placement' | 'test' | 'active'>('loading');
  
  // Onboarding state
  const [examDate, setExamDate] = useState('');
  const [targetScore, setTargetScore] = useState('1500');
  const [hours, setHours] = useState('3-5 hrs');

  // Placement Test state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  
  // Node Modal
  const [selectedNode, setSelectedNode] = useState<any>(null);

  // Score Calculator State (Module Based)
  const [readingMod1, setReadingMod1] = useState(14);
  const [readingMod2, setReadingMod2] = useState(14);
  const [mathMod1, setMathMod1] = useState(11);
  const [mathMod2, setMathMod2] = useState(11);

  useEffect(() => {
    const savedPlan = localStorage.getItem('targetprep_plan_state');
    const savedDate = localStorage.getItem('targetprep_exam_date');
    const savedScore = localStorage.getItem('targetprep_target_score');
    
    if (savedDate) setExamDate(savedDate);
    if (savedScore) setTargetScore(savedScore);

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

  const handleBuildPlan = () => saveState('placement');
  const handleSkipTest = () => saveState('active');
  const handleStartTest = () => saveState('test');
  
  const handleNextQuestion = () => {
    if (currentQuestion < PLACEMENT_TOPICS.length - 1) {
      setCurrentQuestion(c => c + 1);
    } else {
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

  // Winding path math
  const ySpacing = 110;
  const xOffsets = [0, 60, 90, 60, 0, -60, -90, -60];

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
                className="w-full"
              >
                <div className="mb-8">
                  <h1 className="text-3xl sm:text-[2.6rem] font-black tracking-[-0.05em] mb-2 site-text-strong">Study Plan</h1>
                  <p className="site-text-muted font-medium text-[15px]">Your personalized path to a higher score.</p>
                </div>

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
                        className="w-full mt-4 flex items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#2563eb,#3b82f6)] px-4 py-4 text-base font-bold text-white transition hover:scale-[1.02] shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:hover:scale-100"
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
                        className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#2563eb,#3b82f6)] px-4 py-4 text-base font-bold text-white transition hover:scale-[1.02] shadow-lg shadow-blue-500/20"
                      >
                        Take 10-minute placement test
                      </button>
                      <button 
                        onClick={handleSkipTest}
                        className="w-full py-4 text-sm font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 transition"
                      >
                        Skip, use a general plan
                      </button>
                    </div>
                  </motion.div>
                )}

                {planState === 'test' && (
                  <motion.div className="max-w-2xl mx-auto site-panel rounded-[32px] p-8" variants={itemRevealVariants} initial="hidden" animate="visible">
                    <div className="flex items-center justify-between mb-8">
                      <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                        Question {currentQuestion + 1} of {PLACEMENT_TOPICS.length}
                      </span>
                      <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                        {PLACEMENT_TOPICS[currentQuestion]}
                      </span>
                    </div>
                    
                    <div className="min-h-[200px] flex items-center justify-center bg-slate-100 dark:bg-slate-800/50 rounded-3xl mb-8 p-6">
                      <p className="text-lg font-medium text-center text-slate-600 dark:text-slate-300">
                        [ Mock Question Content for {PLACEMENT_TOPICS[currentQuestion]} ]
                      </p>
                    </div>

                    <div className="grid gap-3">
                      {['A', 'B', 'C', 'D'].map(opt => (
                        <button key={opt} onClick={handleNextQuestion} className="w-full text-left px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition font-medium">
                          {opt}. [ Mock Option ]
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {planState === 'active' && (
                  <motion.div className="w-full" variants={staggerContainerVariants} initial="hidden" animate="visible">
                    {/* Path Header */}
                    {/* Path Header */}
                    <motion.div className="flex items-center justify-center gap-6 mb-8 p-5 site-panel rounded-[24px]" variants={itemRevealVariants}>
                      <div className="text-center">
                        <p className="text-[11px] font-bold uppercase text-slate-500 tracking-widest">Exam</p>
                        <p className="font-black text-lg">{examDate ? new Date(examDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Not set'}</p>
                      </div>
                      <div className="w-px h-10 bg-slate-200 dark:bg-slate-700" />
                      <div className="text-center">
                        <p className="text-[11px] font-bold uppercase text-slate-500 tracking-widest">Target</p>
                        <p className="font-black text-lg text-blue-600 dark:text-blue-400">{targetScore || '1500'}</p>
                      </div>
                      <div className="w-px h-10 bg-slate-200 dark:bg-slate-700" />
                      <div className="text-center">
                        <p className="text-[11px] font-bold uppercase text-slate-500 tracking-widest">Days Left</p>
                        <p className="font-black text-lg text-amber-500">
                           {examDate ? Math.max(0, Math.ceil((new Date(examDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24))) : '--'}
                        </p>
                      </div>
                    </motion.div>

                    {/* Winding Path - framed container with sky gradient + clouds */}
                    <div className="relative w-full overflow-hidden rounded-[32px] border-2 border-slate-200 dark:border-slate-700/60 bg-[linear-gradient(180deg,#bae6fd_0%,#e0f2fe_40%,#f0f9ff_100%)] dark:bg-[linear-gradient(180deg,#0c1a3a_0%,#0f2d6b_50%,#1e3a8a_100%)] py-16 flex justify-center">
                      {/* Decorative clouds */}
                      <div className="absolute top-8 left-4 w-40 h-20 bg-white/80 dark:bg-white/5 rounded-full blur-lg" />
                      <div className="absolute top-20 right-6 w-56 h-28 bg-white/70 dark:bg-white/5 rounded-full blur-xl" />
                      <div className="absolute top-60 left-8 w-48 h-24 bg-white/60 dark:bg-white/5 rounded-full blur-lg" />
                      <div className="absolute bottom-24 right-4 w-44 h-20 bg-white/70 dark:bg-white/5 rounded-full blur-lg" />
                      
                      {/* Nodes Container */}
                      <div className="relative" style={{ height: `${(PLAN_NODES.length) * 90 + 100}px`, width: '300px' }}>
                        {PLAN_NODES.map((node, i) => {
                          const isCompleted = node.status === 'completed';
                          const isCurrent = node.status === 'current';
                          const isLocked = node.status === 'locked';

                          // snaking logic (bottom to top)
                          const isLeftToRight = Math.floor(i / 2) % 2 === 0;
                          const xPos = isLeftToRight ? -40 + (i % 2) * 80 : 40 - (i % 2) * 80;
                          const yPos = i * 90;

                          return (
                            <motion.div
                              key={node.id}
                              variants={itemRevealVariants}
                              className="absolute w-24 h-24 -ml-12 -mb-12 flex flex-col items-center justify-center cursor-pointer group z-10"
                              style={{
                                bottom: `${yPos}px`,
                                left: `calc(50% + ${xPos}px)`,
                                zIndex: PLAN_NODES.length - i,
                              }}
                              onClick={() => setSelectedNode(node)}
                            >
                              {/* Figure sitting on top */}
                              {isCurrent && (
                                 <div className="absolute -top-14 z-30 animate-bounce flex flex-col items-center">
                                    <div className="bg-white text-slate-800 text-[12px] font-black px-3 py-1.5 rounded-[12px] shadow-lg border border-slate-200/60 mb-2 relative whitespace-nowrap">
                                      You are here!
                                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white rotate-45 border-b border-r border-slate-200/60" />
                                    </div>
                                    <div className="bg-[linear-gradient(135deg,#38bdf8,#3b82f6)] p-3 rounded-full shadow-[0_8px_16px_rgba(59,130,246,0.4)] border-2 border-white dark:border-slate-800 scale-110">
                                      <Target className="w-7 h-7 text-white" />
                                    </div>
                                 </div>
                              )}
                              
                              {/* Node Isometric Tile */}
                              <div className="relative w-[64px] h-[64px] group-hover:-translate-y-2 transition-transform duration-300">
                                {/* Bottom Shadow / Thickness */}
                                <div className={`absolute inset-0 translate-y-3 rounded-[12px] rotate-45 ${
                                  isCompleted ? 'bg-green-600' :
                                  isCurrent ? 'bg-slate-400 dark:bg-slate-600' :
                                  'bg-blue-600 dark:bg-blue-800'
                                }`} />
                                
                                {/* Top Face */}
                                <div className={`absolute inset-0 rounded-[12px] rotate-45 border-2 flex items-center justify-center shadow-inner ${
                                  isCompleted ? 'bg-[linear-gradient(135deg,#4ade80,#22c55e)] border-white shadow-green-300' :
                                  isCurrent ? 'bg-[linear-gradient(135deg,#e2e8f0,#cbd5e1)] dark:bg-[linear-gradient(135deg,#475569,#334155)] border-white dark:border-slate-400 shadow-slate-300' :
                                  'bg-[linear-gradient(135deg,#93c5fd,#3b82f6)] dark:bg-[linear-gradient(135deg,#3b82f6,#1d4ed8)] border-white dark:border-blue-400 shadow-blue-300'
                                }`}>
                                  <div className="-rotate-45 flex items-center justify-center w-full h-full">
                                    {isCompleted && <CheckCircle2 className="w-8 h-8 text-white drop-shadow-md" />}
                                    {isLocked && <span className="text-white font-black text-2xl drop-shadow-md">{i + 1}</span>}
                                  </div>
                                </div>
                              </div>

                              {/* Tooltip on Hover */}
                              {!isCurrent && (
                                <div className="absolute -top-12 bg-slate-900 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-40 shadow-lg">
                                  {node.title}
                                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45" />
                                </div>
                              )}
                            </motion.div>
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
                className="w-full space-y-8"
              >
                <div className="mb-8">
                  <h1 className="text-3xl sm:text-[2.6rem] font-black tracking-[-0.05em] mb-2 site-text-strong">Study Vault</h1>
                  <p className="site-text-muted font-medium text-[15px]">Tools, cheat sheets, and videos to boost your score.</p>
                </div>

                {/* Vault Section: Score Calculator (Redesigned) */}
                <section className="site-panel rounded-[24px] p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-black">Score Calculator</h2>
                  </div>
                  <p className="site-text-muted mb-8 font-medium">Estimate your final score based on practice modules.</p>
                  <style>{`
                    .calc-slider { -webkit-appearance: none; appearance: none; outline: none; }
                    .calc-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 20px; height: 20px; border-radius: 50%; background: white; border: 3px solid currentColor; box-shadow: 0 2px 6px rgba(0,0,0,0.25); cursor: pointer; }
                    .calc-slider::-moz-range-thumb { width: 20px; height: 20px; border-radius: 50%; background: white; border: 3px solid currentColor; box-shadow: 0 2px 6px rgba(0,0,0,0.25); cursor: pointer; }
                    .calc-slider-blue { color: #3b82f6; }
                    .calc-slider-indigo { color: #6366f1; }
                  `}</style>
                  
                  <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
                    {/* Left: Module sliders - albert.io exact layout */}
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
                                <button className="w-9 h-9 flex-shrink-0 rounded-full border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition" onClick={() => set(Math.max(0, val - 1))}><Minus className="w-4 h-4" /></button>
                                <input
                                  type="range" min="0" max={max} value={val}
                                  onChange={e => set(Number(e.target.value))}
                                  className="calc-slider calc-slider-blue flex-1 h-2 rounded-full cursor-pointer"
                                  style={{ background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(val/max)*100}%, #334155 ${(val/max)*100}%, #334155 100%)` }}
                                />
                                <button className="w-9 h-9 flex-shrink-0 rounded-full border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition" onClick={() => set(Math.min(max, val + 1))}><Plus className="w-4 h-4" /></button>
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
                                <button className="w-9 h-9 flex-shrink-0 rounded-full border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition" onClick={() => set(Math.max(0, val - 1))}><Minus className="w-4 h-4" /></button>
                                <input
                                  type="range" min="0" max={max} value={val}
                                  onChange={e => set(Number(e.target.value))}
                                  className="calc-slider calc-slider-indigo flex-1 h-2 rounded-full cursor-pointer"
                                  style={{ background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${(val/max)*100}%, #334155 ${(val/max)*100}%, #334155 100%)` }}
                                />
                                <button className="w-9 h-9 flex-shrink-0 rounded-full border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition" onClick={() => set(Math.min(max, val + 1))}><Plus className="w-4 h-4" /></button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right: Results Panel - albert.io style */}
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
                      {/* TargetPrep logo + dynamic percentile */}
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
                    <div className="rounded-xl bg-purple-100 p-2.5 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <h2 className="text-2xl font-black">Cheat Sheets</h2>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="p-6 border border-slate-200 dark:border-slate-800 rounded-[24px] hover:border-purple-500 transition cursor-pointer group bg-slate-50 dark:bg-slate-900/50">
                      <FileText className="w-8 h-8 text-slate-400 group-hover:text-purple-500 mb-4 transition" />
                      <h3 className="font-bold text-lg site-text-strong">Math Formulas</h3>
                      <p className="text-sm site-text-muted mt-1 font-medium">Quick reference for Algebra, Geo, and Trig.</p>
                    </div>
                    <div className="p-6 border border-slate-200 dark:border-slate-800 rounded-[24px] hover:border-purple-500 transition cursor-pointer group bg-slate-50 dark:bg-slate-900/50">
                      <FileText className="w-8 h-8 text-slate-400 group-hover:text-purple-500 mb-4 transition" />
                      <h3 className="font-bold text-lg site-text-strong">English Grammar Rules</h3>
                      <p className="text-sm site-text-muted mt-1 font-medium">Punctuation, transitions, and structure.</p>
                    </div>
                  </div>
                </section>

                {/* Vault Section: Videos */}
                <section className="site-panel rounded-[24px] p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-rose-100 p-2.5 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400">
                        <Video className="h-6 w-6" />
                      </div>
                      <h2 className="text-2xl font-black">Video Lessons</h2>
                    </div>
                    <button className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl transition">
                      <UploadCloud className="w-4 h-4" /> Upload
                    </button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="aspect-video bg-slate-200 dark:bg-slate-800 rounded-[24px] flex items-center justify-center cursor-pointer group overflow-hidden relative border border-slate-200 dark:border-slate-700/50">
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition z-10" />
                        <PlayCircle className="w-12 h-12 text-white opacity-90 group-hover:scale-110 transition z-20 drop-shadow-md" />
                      </div>
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
              <button onClick={() => setSelectedNode(null)} className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition">
                <X className="w-4 h-4" />
              </button>
              
              <div className="mb-8 mt-2">
                <span className="inline-block px-3 py-1.5 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                  {selectedNode.type} &middot; {selectedNode.duration}
                </span>
                <h2 className="text-3xl font-black tracking-tight leading-tight">{selectedNode.title}</h2>
              </div>
              
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition">
                  <PlayCircle className="w-5 h-5" /> Watch Lesson
                </button>
                <button className={`w-full flex items-center justify-center gap-2 px-4 py-4 rounded-2xl font-bold transition shadow-lg ${
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
