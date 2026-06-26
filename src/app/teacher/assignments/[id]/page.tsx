'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ClipboardList, GraduationCap, Users, CheckCircle2, Clock } from 'lucide-react';
import { FloatingPageShapes } from '@/components/SiteMotion';
import { QuestionEditor } from '@/components/QuestionEditor';
import { useClassroomStore, seedOnce } from '@/store/classroomStore';

seedOnce();

const AVATAR_COLORS: Record<string, { bg: string; text: string }> = {
    blue:    { bg: 'bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800',    text: 'text-blue-800 dark:text-blue-400' },
    indigo:  { bg: 'bg-indigo-100 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800', text: 'text-indigo-800 dark:text-indigo-400' },
    rose:    { bg: 'bg-rose-100 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800',    text: 'text-rose-800 dark:text-rose-400' },
    emerald: { bg: 'bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800', text: 'text-emerald-800 dark:text-emerald-400' },
    amber:   { bg: 'bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800',  text: 'text-amber-800 dark:text-amber-400' },
};

function initials(name: string) { return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(); }
function scoreColor(pct: number) {
    if (pct >= 80) return 'text-emerald-600 dark:text-emerald-400';
    if (pct >= 60) return 'text-amber-600 dark:text-amber-400';
    return 'text-rose-600 dark:text-rose-400';
}
function scoreBg(pct: number) {
    if (pct >= 80) return 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400';
    if (pct >= 60) return 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400';
    return 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-400';
}
function getMistakes(studentId: string, assignmentId: string, total: number, correct: number): number[] {
    const count = total - correct;
    if (count <= 0) return [];
    let seed = 0;
    for (let i = 0; i < studentId.length; i++) seed += studentId.charCodeAt(i);
    for (let i = 0; i < assignmentId.length; i++) seed += assignmentId.charCodeAt(i);
    const mistakes: number[] = [];
    while (mistakes.length < Math.min(count, total)) {
        seed = (seed * 9301 + 49297) % 233280;
        const q = Math.floor((seed / 233280) * total) + 1;
        if (!mistakes.includes(q)) mistakes.push(q);
    }
    return mistakes.sort((a, b) => a - b);
}

export default function AssignmentDetailPage() {
    const params = useParams<{ id: string }>();
    const { assignments, classrooms, students, progress } = useClassroomStore();
    const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'progress' | 'questions'>('progress');

    const asgn = assignments.find(a => a.id === params.id);

    if (!asgn) {
        return (
            <div className="relative min-h-screen flex items-center justify-center px-4">
                <div className="text-center">
                    <p className="text-2xl font-black site-text-strong mb-3">Assignment not found</p>
                    <Link href="/teacher/assignments" className="text-indigo-500 hover:underline text-sm font-semibold">← Back to Assignments</Link>
                </div>
            </div>
        );
    }

    const assignedClassrooms = classrooms.filter(c => asgn.classroomIds.includes(c.id));
    const activeClass = selectedClassId ? assignedClassrooms.find(c => c.id === selectedClassId) : null;

    // Students to show
    const displayStudents = activeClass
        ? students.filter(s => s.classroomId === activeClass.id)
        : students.filter(s => asgn.classroomIds.includes(s.classroomId));

    const displayRows = progress.filter(p => p.assignmentId === asgn.id && displayStudents.some(s => s.id === p.studentId));

    // Overall stats (all classes)
    const allStudents = students.filter(s => asgn.classroomIds.includes(s.classroomId));
    const allRows = progress.filter(p => p.assignmentId === asgn.id && allStudents.some(s => s.id === p.studentId));
    const totalCompleted = allRows.filter(r => r.completed).length;
    const scores = allRows.filter(r => r.total > 0).map(r => (r.correct / r.total) * 100);
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;

    return (
        <div className="relative min-h-screen pt-4 pb-12 px-4 sm:px-6 lg:px-8">
            <FloatingPageShapes theme="home" />
            <div className="relative z-10 mx-auto max-w-[1320px]">

                {/* Back */}
                <div className="mb-6">
                    <Link href="/teacher/assignments" className="inline-flex items-center gap-1.5 text-sm font-semibold site-text-muted hover:site-text transition">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Assignments
                    </Link>
                </div>

                {/* Assignment header */}
                <div className="site-panel rounded-[24px] p-6 mb-6 border-t-4 border-t-indigo-500">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                            <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center shrink-0 border border-indigo-200 dark:border-indigo-800/50 mt-0.5">
                                <ClipboardList className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-[2rem] font-black tracking-[-0.04em] site-text-strong leading-tight">{asgn.title}</h1>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {assignedClassrooms.map(c => (
                                        <span key={c.id} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-bold">
                                            <GraduationCap className="h-2.5 w-2.5" />{c.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Meta strip */}
                        <div className="flex gap-6 shrink-0 flex-wrap">
                            <div className="text-center">
                                <p className="text-[10px] uppercase tracking-widest font-bold site-text-muted mb-0.5">Subject</p>
                                <p className="font-black text-[15px] site-text-strong">{asgn.subject}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] uppercase tracking-widest font-bold site-text-muted mb-0.5">Questions</p>
                                <p className="font-black text-[15px] site-text-strong">{asgn.questions.length}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] uppercase tracking-widest font-bold site-text-muted mb-0.5">Completion</p>
                                <p className="font-black text-[15px] site-text-strong">{totalCompleted}/{allStudents.length}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] uppercase tracking-widest font-bold site-text-muted mb-0.5">Avg Score</p>
                                {avgScore !== null
                                    ? <p className={`font-black text-[15px] ${scoreColor(avgScore)}`}>{avgScore}%</p>
                                    : <p className="font-black text-[15px] site-text-muted">–</p>}
                            </div>
                            {asgn.timeLimitMinutes > 0 && (
                                <div className="text-center">
                                    <p className="text-[10px] uppercase tracking-widest font-bold site-text-muted mb-0.5">Time Limit</p>
                                    <p className="font-black text-[15px] site-text-strong">{asgn.timeLimitMinutes} min</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                
                {/* Tabs */}
                <div className="flex items-center gap-2 mb-6 border-b border-slate-200 dark:border-slate-800 pb-2">
                    <button 
                        onClick={() => setActiveTab('progress')}
                        className={`px-4 py-2 font-bold text-sm transition-colors border-b-2 ${activeTab === 'progress' ? 'border-indigo-600 text-indigo-600' : 'border-transparent site-text-muted hover:site-text-strong'}`}
                    >
                        Student Progress
                    </button>
                    <button 
                        onClick={() => setActiveTab('questions')}
                        className={`px-4 py-2 font-bold text-sm transition-colors border-b-2 ${activeTab === 'questions' ? 'border-indigo-600 text-indigo-600' : 'border-transparent site-text-muted hover:site-text-strong'}`}
                    >
                        View & Edit Questions
                    </button>
                </div>

                {activeTab === 'progress' ? (
                <>
                {/* Class filter pills */}
                <div className="flex flex-wrap gap-2 mb-6">
                    <button
                        onClick={() => setSelectedClassId(null)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-bold transition ${!selectedClassId ? 'bg-indigo-600 text-white shadow-md' : 'site-subpanel site-text hover:scale-[1.02]'}`}
                    >
                        <Users className="h-3.5 w-3.5" /> All Classes
                    </button>
                    {assignedClassrooms.map(c => (
                        <button
                            key={c.id}
                            onClick={() => setSelectedClassId(c.id === selectedClassId ? null : c.id)}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-bold transition ${selectedClassId === c.id ? 'bg-indigo-600 text-white shadow-md' : 'site-subpanel site-text hover:scale-[1.02]'}`}
                        >
                            <GraduationCap className="h-3.5 w-3.5" />{c.name}
                        </button>
                    ))}
                </div>

                {/* Student cards */}
                <div className="mb-3">
                    <h2 className="text-[12px] uppercase tracking-[0.18em] font-bold site-text-muted">
                        {displayStudents.length} Student{displayStudents.length !== 1 ? 's' : ''}{activeClass ? ` — ${activeClass.name}` : ' across all classes'}
                    </h2>
                </div>

                {displayStudents.length === 0 ? (
                    <div className="site-panel rounded-[24px] p-12 text-center">
                        <Users className="h-10 w-10 mx-auto mb-3 opacity-20 site-text-muted" />
                        <p className="font-bold site-text-strong">No students in this class yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {displayStudents.map(student => {
                            const stuProgress = displayRows.find(p => p.studentId === student.id);
                            const colors = AVATAR_COLORS[student.avatar] ?? AVATAR_COLORS.blue;
                            const pct = stuProgress && stuProgress.total > 0 ? Math.round((stuProgress.correct / stuProgress.total) * 100) : null;
                            const mistakes = stuProgress ? getMistakes(student.id, asgn.id, stuProgress.total, stuProgress.correct) : [];
                            // Which class does this student belong to?
                            const studentClass = classrooms.find(c => c.id === student.classroomId);

                            return (
                                <div key={student.id} className="site-panel rounded-[20px] p-5 flex flex-col border border-slate-200 dark:border-slate-800/60 hover:shadow-md transition-shadow">
                                    {/* Student header */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`h-10 w-10 rounded-full flex items-center justify-center text-[12px] font-black shrink-0 ${colors.bg} ${colors.text}`}>
                                                {initials(student.name)}
                                            </div>
                                            <div>
                                                <p className="font-black text-[14px] site-text-strong leading-tight">{student.name}</p>
                                                {!activeClass && studentClass && (
                                                    <p className="text-[11px] site-text-muted font-semibold">{studentClass.name}</p>
                                                )}
                                            </div>
                                        </div>
                                        {pct !== null
                                            ? <div className={`px-2.5 py-1 rounded-lg text-[12px] font-black ${scoreBg(pct)}`}>{pct}%</div>
                                            : <div className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500">Not Started</div>
                                        }
                                    </div>

                                    {/* Progress */}
                                    {stuProgress ? (
                                        <div className="flex-1 flex flex-col justify-end border-t border-slate-100 dark:border-slate-800 pt-3">
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="text-[13px] font-semibold site-text-muted">
                                                    Score: <strong className="site-text-strong">{stuProgress.correct}/{stuProgress.total}</strong>
                                                </span>
                                                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${stuProgress.completed ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'}`}>
                                                    {stuProgress.completed ? <><CheckCircle2 className="h-3 w-3" /> Done</> : <><Clock className="h-3 w-3" /> In Progress</>}
                                                </span>
                                            </div>

                                            {/* Progress bar */}
                                            <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 mb-3">
                                                <div
                                                    className={`h-full rounded-full transition-all ${pct !== null && pct >= 80 ? 'bg-emerald-500' : pct !== null && pct >= 60 ? 'bg-amber-500' : 'bg-rose-500'}`}
                                                    style={{ width: `${stuProgress.total > 0 ? (stuProgress.correct / stuProgress.total) * 100 : 0}%` }}
                                                />
                                            </div>

                                            {mistakes.length > 0 ? (
                                                <div>
                                                    <p className="text-[10px] uppercase tracking-widest font-bold site-text-muted mb-2">Mistakes</p>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {mistakes.map(m => (
                                                            <span key={m} className="inline-flex items-center justify-center h-6 min-w-[24px] px-1.5 rounded-md bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-[11px] font-black">
                                                                Q{m}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center py-2">
                                                    <p className="text-[12px] font-bold text-emerald-500 flex items-center gap-1.5">
                                                        <CheckCircle2 className="w-4 h-4" /> Perfect Score
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="flex-1 flex items-center justify-center min-h-[60px] border-t border-slate-100 dark:border-slate-800 mt-2 pt-4">
                                            <span className="text-[13px] site-text-muted italic">Waiting for student...</span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
                            </>
                ) : (
                    <QuestionEditor questions={asgn.questions} onSave={(qId, newQ) => useClassroomStore.getState().updateAssignmentQuestion(asgn.id, qId, newQ)} />
                )}
            </div>
        </div>
    );
}
