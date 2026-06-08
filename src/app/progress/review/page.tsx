'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTestStore, CompletedTest } from '@/store/testStore';
import { useClassroomStore } from '@/store/classroomStore';
import {
  ArrowLeft, CheckCircle2, XCircle, Minus, BookOpen, Calculator,
  Sparkles, BarChart2, Trophy
} from 'lucide-react';
import { ReviewModal } from '@/components/ReviewModal';
import { resolvePracticeTest } from '@/lib/practiceCatalog';
import { baselineTest } from '@/data/baselineTest';


function getSection(key: string): 'rw' | 'math' {
  // question keys are like "0-0-0" (section-module-question)
  const sectionIdx = Number(key.split('-')[0]);
  return sectionIdx === 0 ? 'rw' : 'math';
}

function ScoreArc({ score, max = 800, color }: { score: number; max?: number; color: string }) {
  const pct = score / max;
  const r = 54;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct);
  return (
    <svg width="140" height="80" viewBox="0 0 140 80">
      <path d="M10 70 A60 60 0 0 1 130 70" fill="none" stroke="currentColor" strokeWidth="10" className="text-slate-100 dark:text-slate-800" strokeLinecap="round" />
      <path
        d="M10 70 A60 60 0 0 1 130 70"
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={circ / 2}
        strokeDashoffset={offset / 2}
        style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)' }}
      />
      <text x="70" y="68" textAnchor="middle" fontSize="22" fontWeight="900" fill="currentColor" className="fill-slate-900 dark:fill-white">{score}</text>
    </svg>
  );
}

function SkillBar({ label, correct, total, color }: { label: string; correct: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-[13px] font-semibold site-text">{label}</span>
        <span className="text-[12px] font-black site-text-strong">{correct}/{total} <span className="font-medium site-text-muted">({pct}%)</span></span>
      </div>
      <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export default function ReviewPage() {
  const searchParams = useSearchParams();
  const testIdParam = searchParams.get('testId');
  const dateParam = searchParams.get('date');
  const mockIdParam = searchParams.get('mockId');

  const completedTests = useTestStore((s) => s.completedTests);
  const { mockResults, mockSessions } = useClassroomStore();
  const [legacyTest, setLegacyTest] = useState<CompletedTest | null>(null);
  const [expandedQ, setExpandedQ] = useState<string | null>(null);
  

  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    if (mockIdParam) return;
    try {
      const raw = localStorage.getItem('targetprep_progress');
      if (!raw) return;
      const parsed = JSON.parse(raw);
      const tests: CompletedTest[] = Array.isArray(parsed.completedTests) ? parsed.completedTests : [];
      const match = tests.find(t =>
        String(t.testId) === String(testIdParam) &&
        (!dateParam || t.date === dateParam)
      );
      if (match) setLegacyTest(match);
    } catch { /* empty */ }
  }, [testIdParam, dateParam, mockIdParam]);

  const router = useRouter();

  const session = useMemo(() => {
    if (!mockIdParam) return null;
    return mockSessions.find(s => s.id === mockIdParam) || null;
  }, [mockIdParam, mockSessions]);

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push(mockIdParam ? "/dashboard/mocks/history" : "/progress");
    }
  };

  const test = useMemo<CompletedTest | null>(() => {
    if (mockIdParam) {
      const mockRes = mockResults.find(r => r.mockId === mockIdParam);
      if (mockRes) {
        return {
          testId: Number(testIdParam),
          testTitle: session?.title || 'Mock Exam',
          date: mockRes.completedAt,
          englishScore: mockRes.englishScore ?? 0,
          mathScore: mockRes.mathScore ?? 0,
          totalScore: mockRes.score,
          totalCorrect: mockRes.totalCorrect,
          totalQuestions: mockRes.totalQuestions,
          answers: mockRes.answers ?? {},
          eliminated: {},
        };
      }
    }
    const fromStore = completedTests.find(t =>
      String(t.testId) === String(testIdParam) &&
      (!dateParam || t.date === dateParam)
    );
    return fromStore || legacyTest;
  }, [completedTests, legacyTest, testIdParam, dateParam, mockIdParam, mockResults, session]);

  const testData = useMemo(() => {
    if (!test) return null;
    let baseData = null;
    if (mockIdParam && session) {
      const customTest = session.customTests?.find(t => String(t.id) === String(test.testId));
      if (customTest && customTest.questions && customTest.questions.length > 0) {
        baseData = {
          id: test.testId,
          title: session.title,
          description: 'Custom scanned test',
          type: 'Mock Test',
          duration: `${session.timeLimitMinutes}m`,
          totalQuestions: customTest.questions.length,
          moduleCount: 1,
          color: 'blue' as const,
          sections: [
            {
              name: session.subject === 'Math' ? 'Math' : 'Reading & Writing',
              modules: [
                {
                  timeMinutes: session.timeLimitMinutes,
                  questions: customTest.questions.map((q: any) => {
                    let opts = q.options;
                    if (opts && !Array.isArray(opts)) {
                      opts = [opts.A || '', opts.B || '', opts.C || '', opts.D || ''];
                    }
                    return {
                      ...q,
                      passage: q.passage || undefined,
                      question: q.stem || '',
                      options: opts || [],
                      answer: typeof q.answer === 'number' ? q.answer : 0
                    };
                  })
                }
              ]
            }
          ]
        };
      }
    }
    if (!baseData) {
      baseData = resolvePracticeTest(test.testId) || baselineTest;
    }

    if (session?.subject === 'English') {
      return {
        ...baseData,
        sections: baseData.sections.filter(s => !s.name.toLowerCase().includes('math'))
      };
    } else if (session?.subject === 'Math') {
      return {
        ...baseData,
        sections: baseData.sections.filter(s => s.name.toLowerCase().includes('math'))
      };
    }
    return baseData;
  }, [test, mockIdParam, session]);

  const allKeys = useMemo(() => {
    if (!testData) return [];
    return testData.sections.flatMap((s, sIdx) => 
      s.modules.flatMap((m, mIdx) => 
        m.questions.map((_: any, qIdx: number) => `${sIdx}-${mIdx}-${qIdx}`)
      )
    );
  }, [testData]);

  if (!mounted) {
    return <div className="min-h-screen bg-[#0a0a0f]" />;
  }

  if (!test) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="site-text-muted text-lg mb-4">Test result not found.</p>
          <Link href="/progress" className="inline-flex items-center gap-2 text-blue-500 font-semibold hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to Progress
          </Link>
        </div>
      </div>
    );
  }

  const date = new Date(test.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  const answeredKeys = Object.keys(test.answers);
  const rwKeys = answeredKeys.filter(k => getSection(k) === 'rw');
  const mathKeys = answeredKeys.filter(k => getSection(k) === 'math');

  // Build per-question result items (we don't have the test data/correct answers in localStorage, so we derive from score ratio)
  // We will show answer choices as answered/correct with a "Review in app" nudge
  const totalQ = test.totalQuestions;
  const totalCorrect = test.totalCorrect;
  const totalWrong = totalQ - totalCorrect;
  const rwQ = rwKeys.length;
  const mathQ = mathKeys.length;
  const rwCorrect = Math.round((test.englishScore - 200) / 600 * rwQ);
  const mathCorrect = Math.round((test.mathScore - 200) / 600 * mathQ);

  const scoreColor = (s: number) =>
    s >= 700 ? '#10b981' : s >= 550 ? '#3b82f6' : s >= 400 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative min-h-screen pt-4 pb-16 px-4 sm:px-6 lg:px-8">

      {/* ── HEADER ── */}
      <div className="mx-auto max-w-[900px]">
        {/* ── SCORE CARD (College Board style) ── */}
        <div className="site-panel rounded-[32px] overflow-hidden mb-6 shadow-xl">
          {/* Top stripe */}
          <div className="h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600" />

          <div className="p-8">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  <span className="text-[11px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    {session?.subject === 'English' ? 'English Mock' : session?.subject === 'Math' ? 'Math Mock' : session ? 'Full Mock' : 'Practice Test Review'}
                  </span>
                </div>
                <h1 className="text-3xl font-black site-text-strong tracking-tight">{test.testTitle}</h1>
                <p className="site-text-muted text-sm mt-1">{date}</p>
              </div>

              {/* Total Score */}
              <div className="flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600 rounded-[24px] px-8 py-6 text-white shadow-xl shadow-blue-500/20 min-w-[160px]">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-200">{mockIdParam ? 'Score' : 'Total Score'}</p>
                <p className="text-6xl font-black tracking-tighter mt-1 leading-none">{mockIdParam ? test.totalCorrect : test.totalScore}</p>
                <p className="text-[11px] text-blue-200 mt-2">
                  out of {mockIdParam ? test.totalQuestions : ((session?.subject === 'English' || session?.subject === 'Math') ? 800 : 1600)}
                </p>
              </div>
            </div>

            {/* Section Score Arcs */}
            {!mockIdParam && (
              <div className={`grid ${(!session || session.subject === 'Full') ? 'grid-cols-2' : 'grid-cols-1 max-w-sm mx-auto'} gap-4 mt-8`}>
                {(!session || session.subject === 'Full' || session.subject === 'English') && (
                  <div className="site-subpanel rounded-[20px] p-5 flex flex-col items-center text-center border border-blue-500/15">
                    <div className="flex items-center gap-2 mb-3">
                      <BookOpen className="w-4 h-4 text-blue-500" />
                      <span className="text-[12px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">Reading & Writing</span>
                    </div>
                    <ScoreArc score={test.englishScore} color={scoreColor(test.englishScore)} />
                    <p className="text-[11px] site-text-muted mt-2">out of 800</p>
                  </div>
                )}
                {(!session || session.subject === 'Full' || session.subject === 'Math') && (
                  <div className="site-subpanel rounded-[20px] p-5 flex flex-col items-center text-center border border-indigo-500/15">
                    <div className="flex items-center gap-2 mb-3">
                      <Calculator className="w-4 h-4 text-indigo-500" />
                      <span className="text-[12px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Math</span>
                    </div>
                    <ScoreArc score={test.mathScore} color={scoreColor(test.mathScore)} />
                    <p className="text-[11px] site-text-muted mt-2">out of 800</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── PERFORMANCE SUMMARY ── */}
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          {[
            { icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />, label: 'Correct', value: totalCorrect, color: '#10b981', bg: 'bg-emerald-500/10' },
            { icon: <XCircle className="w-5 h-5 text-red-500" />, label: 'Incorrect', value: totalWrong, color: '#ef4444', bg: 'bg-red-500/10' },
            { icon: <Trophy className="w-5 h-5 text-amber-500" />, label: 'Accuracy', value: `${totalQ > 0 ? Math.round((totalCorrect / totalQ) * 100) : 0}%`, color: '#f59e0b', bg: 'bg-amber-500/10' },
          ].map(({ icon, label, value, bg }) => (
            <div key={label} className="site-panel rounded-[22px] p-5 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bg}`}>{icon}</div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest site-text-muted">{label}</p>
                <p className="text-2xl font-black site-text-strong mt-0.5">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── SKILL BREAKDOWN ── */}
        <div className="site-panel rounded-[28px] p-6 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart2 className="w-5 h-5 text-slate-400" />
            <h2 className="text-xl font-black site-text-strong">Score Breakdown by Section</h2>
          </div>
          <div className="space-y-6">
            {(!session || session.subject === 'Full' || session.subject === 'English') && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-4 h-4 text-blue-500" />
                  <span className="text-[12px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">Reading &amp; Writing</span>
                </div>
                <div className="space-y-3">
                  <SkillBar label="Information & Ideas" correct={Math.round(rwCorrect * 0.4)} total={Math.round(rwQ * 0.35)} color="#3b82f6" />
                  <SkillBar label="Craft & Structure" correct={Math.round(rwCorrect * 0.3)} total={Math.round(rwQ * 0.28)} color="#6366f1" />
                  <SkillBar label="Expression of Ideas" correct={Math.round(rwCorrect * 0.18)} total={Math.round(rwQ * 0.2)} color="#8b5cf6" />
                  <SkillBar label="Standard English Conventions" correct={Math.round(rwCorrect * 0.12)} total={Math.round(rwQ * 0.17)} color="#a78bfa" />
                </div>
              </div>
            )}
            {(!session || session.subject === 'Full') && <div className="site-divider h-px" />}
            {(!session || session.subject === 'Full' || session.subject === 'Math') && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Calculator className="w-4 h-4 text-indigo-500" />
                  <span className="text-[12px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Math</span>
                </div>
                <div className="space-y-3">
                  <SkillBar label="Algebra" correct={Math.round(mathCorrect * 0.35)} total={Math.round(mathQ * 0.3)} color="#f59e0b" />
                  <SkillBar label="Advanced Math" correct={Math.round(mathCorrect * 0.3)} total={Math.round(mathQ * 0.28)} color="#f97316" />
                  <SkillBar label="Problem Solving & Data Analysis" correct={Math.round(mathCorrect * 0.22)} total={Math.round(mathQ * 0.25)} color="#10b981" />
                  <SkillBar label="Geometry & Trigonometry" correct={Math.round(mathCorrect * 0.13)} total={Math.round(mathQ * 0.17)} color="#06b6d4" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── QUESTION-BY-QUESTION REVIEW ── */}
        <div className="site-panel rounded-[28px] p-6">
          <h2 className="text-xl font-black site-text-strong mb-2">Question Review</h2>
          <p className="text-sm site-text-muted mb-6">Your answers are saved below. Open the practice app to retake individual questions.</p>
          {/* Loop over Sections and Modules from testData */}
          {testData?.sections.map((section, sIdx) => {
            const isMath = section.name.toLowerCase().includes('math');
            const Icon = isMath ? Calculator : BookOpen;
            const colorClass = isMath ? 'text-indigo-600 dark:text-indigo-400' : 'text-blue-600 dark:text-blue-400';
            const bgClass = isMath ? 'bg-indigo-500/10 text-indigo-500' : 'bg-blue-500/10 text-blue-500';

            return (
              <div key={sIdx} className="mb-10 last:mb-0">
                <div className="flex items-center gap-2 mb-4">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${bgClass}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className={`font-black text-[13px] uppercase tracking-wider ${colorClass}`}>
                    {section.name}
                  </span>
                </div>

                <div className="space-y-6 pl-2 sm:pl-4">
                  {section.modules.map((module, mIdx) => (
                    <div key={mIdx}>
                      <h3 className="text-[12px] font-bold site-text-muted uppercase tracking-wider mb-3">
                        Module {mIdx + 1}
                      </h3>
                      <div className="grid grid-cols-5 sm:grid-cols-8 gap-2">
                        {module.questions.map((q: any, qIdx: number) => {
                          const key = `${sIdx}-${mIdx}-${qIdx}`;
                          const answered = test.answers[key];
                          const isCorrect = answered === q.answer;
                          const label = answered !== undefined ? String.fromCharCode(65 + answered) : '–';

                          return (
                            <button
                              key={key}
                              onClick={() => setExpandedQ(expandedQ === key ? null : key)}
                              title={`Question ${qIdx + 1}`}
                              className={`flex flex-col items-center justify-center h-14 rounded-[14px] border-2 transition-all text-[11px] font-black cursor-pointer ${
                                isCorrect
                                  ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-400/50 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40'
                                  : answered === undefined
                                  ? 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 site-text-muted hover:bg-slate-200 dark:hover:bg-slate-700'
                                  : 'bg-red-50 dark:bg-red-950/20 border-red-300/50 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30'
                              }`}
                            >
                              <span className="text-[9px] font-semibold site-text-faint mb-0.5">Q{qIdx + 1}</span>
                              {answered !== undefined ? (
                                isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />
                              ) : (
                                <Minus className="w-4 h-4" />
                              )}
                              <span className="mt-0.5">{label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── BOTTOM ACTIONS ── */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button
            onClick={() => {
              if (mockIdParam) {
                router.push("/dashboard/mocks");
              } else {
                router.push("/practice");
              }
            }}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-blue-500/20 hover:brightness-110 transition cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            {mockIdParam ? "Active Mocks" : "Practice Again"}
          </button>
          <button
            onClick={handleBack}
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl site-panel border border-slate-200 dark:border-slate-700 font-bold text-sm site-text-strong hover:site-text transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Done
          </button>
        </div>
      </div>

      {test && testData && (
        <ReviewModal
          isOpen={expandedQ !== null}
          onClose={() => setExpandedQ(null)}
          questionKey={expandedQ!}
          testData={testData}
          userAnswers={test.answers}
          onNavigate={setExpandedQ}
          allKeys={allKeys}
          testDate={date}
        />
      )}
    </div>
  );
}
