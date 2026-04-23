'use client';
import { useState, useEffect, Fragment } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import {
    ArrowLeft, Copy, Users, ClipboardList, CheckCircle2, Clock, GraduationCap, ChevronDown, ChevronUp, X
} from 'lucide-react';
import {
    FloatingPageShapes, itemRevealVariants, pageRevealVariants, staggerContainerVariants,
} from '@/components/SiteMotion';
import { useClassroomStore } from '@/store/classroomStore';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const AVATAR_COLORS: Record<string, { bg: string; text: string }> = {
    blue:    { bg: 'bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800',    text: 'text-blue-800 dark:text-blue-400' },
    indigo:  { bg: 'bg-indigo-100 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800', text: 'text-indigo-800 dark:text-indigo-400' },
    rose:    { bg: 'bg-rose-100 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800',    text: 'text-rose-800 dark:text-rose-400' },
    emerald: { bg: 'bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800', text: 'text-emerald-800 dark:text-emerald-400' },
    amber:   { bg: 'bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800',  text: 'text-amber-800 dark:text-amber-400' },
};

function initials(name: string) {
    return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}

function scoreColor(pct: number) {
    if (pct >= 80) return 'text-emerald-600 dark:text-emerald-400';
    if (pct >= 60) return 'text-amber-600 dark:text-amber-400';
    return 'text-rose-600 dark:text-rose-400';
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getMistakes(studentId: string, assignmentId: string, total: number, correct: number): number[] {
    const mistakesCount = total - correct;
    if (mistakesCount <= 0) return [];

    let seed = 0;
    for (let i = 0; i < studentId.length; i++) seed += studentId.charCodeAt(i);
    for (let i = 0; i < assignmentId.length; i++) seed += assignmentId.charCodeAt(i);

    const mistakes: number[] = [];
    while (mistakes.length < Math.min(mistakesCount, total)) {
        seed = (seed * 9301 + 49297) % 233280;
        const qNum = Math.floor((seed / 233280) * total) + 1;
        if (!mistakes.includes(qNum)) mistakes.push(qNum);
    }
    return mistakes.sort((a, b) => a - b);
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ClassDetailPage() {
    const shouldReduceMotion = useReducedMotion();
    const params = useParams<{ id: string }>();
    const router = useRouter();

    const [activeTab, setActiveTab] = useState<'students' | 'assignments'>('students');
    const [expandedAssignmentId, setExpandedAssignmentId] = useState<string | null>(null);
    const [copiedCode, setCopiedCode] = useState(false);

    const { classrooms, students, assignments, progress, seed } = useClassroomStore();
    useEffect(() => { seed(); }, [seed]);

    const cls = classrooms.find((c) => c.id === params.id);

    if (!cls) {
        return (
            <div className="relative min-h-screen flex items-center justify-center px-4">
                <div className="text-center">
                    <p className="text-2xl font-black site-text-strong mb-3">Class not found</p>
                    <button onClick={() => router.push('/teacher/classes')} className="text-indigo-500 hover:underline text-sm font-semibold">
                        ← Back to Classes
                    </button>
                </div>
            </div>
        );
    }

    const classStudents     = students.filter((s) => s.classroomId === cls.id);
    const classAssignments  = assignments.filter((a) => a.classroomIds.includes(cls.id));

    const copyCode = () => {
        navigator.clipboard.writeText(cls.joinCode);
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 1500);
    };

    // Per-student roll-up (all assignments in this class)
    const getStudentRollup = (studentId: string) => {
        const rows = classAssignments.map((a) =>
            progress.find((p) => p.studentId === studentId && p.assignmentId === a.id)
        ).filter(Boolean) as typeof progress;

        const completed      = rows.filter((r) => r.completed).length;
        const totalCorrect   = rows.reduce((s, r) => s + r.correct, 0);
        const totalQuestions = rows.reduce((s, r) => s + r.total, 0);

        return {
            completed,
            outOf: classAssignments.length,
            avgScore: totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : null,
        };
    };

    // Per-assignment stats across class students
    const getAssignmentStats = (assignmentId: string) => {
        const rows = progress.filter(
            (p) => p.assignmentId === assignmentId && classStudents.some((s) => s.id === p.studentId)
        );
        const started    = rows.filter((r) => r.answered > 0).length;
        const completed  = rows.filter((r) => r.completed).length;
        const scores     = rows.filter((r) => r.total > 0).map((r) => (r.correct / r.total) * 100);
        const avgScore   = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;
        return { started, completed, avgScore };
    };

    const overallCompletion = classStudents.length > 0
        ? Math.round(
            classStudents.filter((s) => {
                const { completed, outOf } = getStudentRollup(s.id);
                return outOf > 0 && completed === outOf;
            }).length / classStudents.length * 100
        )
        : null;

    return (
        <div className="relative min-h-screen pt-4 pb-12 px-4 sm:px-6 lg:px-8">
            <FloatingPageShapes theme="home" />

            <motion.div
                className="relative z-10 mx-auto max-w-[1000px]"
                initial={shouldReduceMotion ? undefined : 'hidden'}
                animate={shouldReduceMotion ? undefined : 'visible'}
                variants={pageRevealVariants}
            >
                {/* Back */}
                <motion.div className="mb-6" variants={itemRevealVariants}>
                    <Link href="/teacher/classes" className="inline-flex items-center gap-1.5 text-sm font-semibold site-text-muted hover:site-text transition">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Classes
                    </Link>
                </motion.div>

                {/* Class header card */}
                <motion.div className="site-panel rounded-[24px] p-6 mb-6 border-t-4 border-t-indigo-500" variants={itemRevealVariants}>
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <GraduationCap className="h-6 w-6 text-indigo-500" />
                                <h1 className="text-2xl font-black tracking-[-0.03em] site-text-strong">{cls.name}</h1>
                            </div>
                            <p className="text-[13px] site-text-muted">{cls.grade}</p>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.18em] font-bold site-text-muted mb-0.5">Join Code</p>
                                <span className="font-mono font-bold text-xl tracking-[0.2em] site-text-strong">
                                    {cls.joinCode}
                                </span>
                            </div>
                            <button
                                onClick={copyCode}
                                className="h-10 w-10 rounded-xl site-subpanel flex items-center justify-center hover:scale-[1.08] transition text-indigo-500 border border-indigo-500/20"
                                title="Copy Code"
                            >
                                <Copy className="h-4 w-4" />
                            </button>
                            {copiedCode && <span className="text-[12px] text-emerald-500 font-semibold">Copied!</span>}
                        </div>
                    </div>

                    {/* Quick stats strip */}
                    <div className="grid grid-cols-3 gap-4 mt-5 pt-5 border-t border-slate-200 dark:border-slate-700/50">
                        <div className="text-center">
                            <p className="text-2xl font-black tracking-tight site-text-strong">{classStudents.length}</p>
                            <p className="text-[11px] uppercase tracking-wider font-bold site-text-muted mt-0.5">Students</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-black tracking-tight site-text-strong">{classAssignments.length}</p>
                            <p className="text-[11px] uppercase tracking-wider font-bold site-text-muted mt-0.5">Assignments</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-black tracking-tight site-text-strong">
                                {overallCompletion !== null ? `${overallCompletion}%` : '–'}
                            </p>
                            <p className="text-[11px] uppercase tracking-wider font-bold site-text-muted mt-0.5">All Done</p>
                        </div>
                    </div>
                </motion.div>

                {/* Tabs */}
                <motion.div className="flex gap-2 mb-5" variants={itemRevealVariants}>
                    {(['students', 'assignments'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition ${
                                activeTab === tab
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : 'site-subpanel site-text hover:scale-[1.02]'
                            }`}
                        >
                            {tab === 'students' ? <Users className="h-4 w-4" /> : <ClipboardList className="h-4 w-4" />}
                            {tab === 'students' ? `Students (${classStudents.length})` : `Assignments (${classAssignments.length})`}
                        </button>
                    ))}
                </motion.div>

                {/* ── Students tab ──────────────────────────────────────────── */}
                {activeTab === 'students' && (
                    <motion.div variants={staggerContainerVariants}>
                        {classStudents.length === 0 ? (
                            <motion.div variants={itemRevealVariants} className="site-panel rounded-[24px] p-12 text-center">
                                <Users className="h-10 w-10 site-text-muted mx-auto mb-3 opacity-30" />
                                <p className="font-bold site-text-strong text-lg mb-1">No students yet</p>
                                <p className="text-sm site-text-muted">
                                    Share code <span className="font-mono font-bold">{cls.joinCode}</span> with your students.
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div className="site-panel rounded-[24px] overflow-hidden" variants={itemRevealVariants}>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-slate-200 dark:border-slate-700/50">
                                                <th className="text-left px-6 py-4 text-[11px] uppercase tracking-widest font-bold site-text-muted">Student</th>
                                                <th className="text-left px-6 py-4 text-[11px] uppercase tracking-widest font-bold site-text-muted hidden sm:table-cell">Joined</th>
                                                <th className="text-center px-6 py-4 text-[11px] uppercase tracking-widest font-bold site-text-muted">Completed</th>
                                                <th className="text-center px-6 py-4 text-[11px] uppercase tracking-widest font-bold site-text-muted">Avg Score</th>
                                                <th className="text-center px-6 py-4 text-[11px] uppercase tracking-widest font-bold site-text-muted">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {classStudents.map((student, idx) => {
                                                const { completed, outOf, avgScore } = getStudentRollup(student.id);
                                                const colors = AVATAR_COLORS[student.avatar] ?? AVATAR_COLORS.blue;
                                                const pct = avgScore ?? 0;
                                                const allDone = outOf > 0 && completed === outOf;
                                                return (
                                                    <tr
                                                        key={student.id}
                                                        className={`${idx < classStudents.length - 1 ? 'border-b border-slate-100 dark:border-slate-800' : ''} hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors`}
                                                    >
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`h-9 w-9 rounded-full flex items-center justify-center text-[12px] font-black shrink-0 ${colors.bg} ${colors.text}`}>
                                                                    {initials(student.name)}
                                                                </div>
                                                                <span className="font-semibold site-text-strong text-[14px]">{student.name}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-[13px] site-text-muted hidden sm:table-cell">
                                                            {formatDate(student.joinedAt)}
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <span className="text-[14px] font-bold site-text-strong">{completed}</span>
                                                            <span className="text-[13px] site-text-muted">/{outOf}</span>
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            {avgScore !== null
                                                                ? <span className={`text-[14px] font-black ${scoreColor(pct)}`}>{avgScore}%</span>
                                                                : <span className="text-[13px] site-text-muted">–</span>}
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            {allDone ? (
                                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100/80 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800/50 text-[11px] font-bold">
                                                                    <CheckCircle2 className="h-3 w-3" /> Done
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100/80 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-800/50 text-[11px] font-bold">
                                                                    <Clock className="h-3 w-3" /> In Progress
                                                                </span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                )}

                {/* ── Assignments tab ───────────────────────────────────────── */}
                {activeTab === 'assignments' && (
                    <motion.div variants={staggerContainerVariants}>
                        {classAssignments.length === 0 ? (
                            <motion.div variants={itemRevealVariants} className="site-panel rounded-[24px] p-12 text-center">
                                <ClipboardList className="h-10 w-10 site-text-muted mx-auto mb-3 opacity-30" />
                                <p className="font-bold site-text-strong text-lg mb-1">No assignments yet</p>
                                <p className="text-sm site-text-muted">
                                    <Link href="/teacher/assignments/create" className="text-indigo-500 hover:underline font-semibold">
                                        Create an assignment
                                    </Link>
                                    {' '}and send it to this class.
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div className="site-panel rounded-[24px] overflow-hidden" variants={itemRevealVariants}>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-slate-200 dark:border-slate-700/50">
                                                <th className="text-left px-6 py-4 text-[11px] uppercase tracking-widest font-bold site-text-muted">Assignment</th>
                                                <th className="text-left px-6 py-4 text-[11px] uppercase tracking-widest font-bold site-text-muted hidden sm:table-cell">Created</th>
                                                <th className="text-center px-6 py-4 text-[11px] uppercase tracking-widest font-bold site-text-muted">Started</th>
                                                <th className="text-center px-6 py-4 text-[11px] uppercase tracking-widest font-bold site-text-muted">Completed</th>
                                                <th className="text-center px-6 py-4 text-[11px] uppercase tracking-widest font-bold site-text-muted">Avg Score</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {classAssignments.map((asgn, idx) => {
                                                const { started, completed, avgScore } = getAssignmentStats(asgn.id);
                                                const total = classStudents.length;
                                                const isExpanded = expandedAssignmentId === asgn.id;

                                                return (
                                                    <Fragment key={asgn.id}>
                                                        <tr
                                                            onClick={() => setExpandedAssignmentId(isExpanded ? null : asgn.id)}
                                                            className={`${idx < classAssignments.length - 1 && !isExpanded ? 'border-b border-slate-100 dark:border-slate-800' : ''} hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors cursor-pointer group`}
                                                        >
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="h-9 w-9 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
                                                                        <ClipboardList className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-semibold site-text-strong text-[14px]">{asgn.title}</p>
                                                                        <p className="text-[12px] site-text-muted">
                                                                            {asgn.questions.length > 0 ? `${asgn.questions.length} questions` : 'No questions added'}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 text-[13px] site-text-muted hidden sm:table-cell">
                                                                {formatDate(asgn.createdAt)}
                                                            </td>
                                                            <td className="px-6 py-4 text-center">
                                                                <span className="text-[14px] font-bold site-text-strong">{started}</span>
                                                                <span className="text-[13px] site-text-muted">/{total}</span>
                                                            </td>
                                                            <td className="px-6 py-4 text-center">
                                                                <span className="text-[14px] font-bold site-text-strong">{completed}</span>
                                                                <span className="text-[13px] site-text-muted">/{total}</span>
                                                            </td>
                                                            <td className="px-6 py-4 text-center relative pr-10">
                                                                {avgScore !== null
                                                                    ? <span className={`text-[14px] font-black ${scoreColor(avgScore)}`}>{avgScore}%</span>
                                                                    : <span className="text-[13px] site-text-muted">–</span>}
                                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-40 group-hover:opacity-100 transition-opacity">
                                                                    {isExpanded ? <ChevronUp className="h-4 w-4 site-text-strong" /> : <ChevronDown className="h-4 w-4 site-text-strong" />}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        {isExpanded && (
                                                            <tr className={`${idx < classAssignments.length - 1 ? 'border-b border-slate-100 dark:border-slate-800' : ''}`}>
                                                                <td colSpan={5} className="p-0">
                                                                    <div className="bg-slate-50 dark:bg-slate-800/30 px-6 py-6 border-t border-slate-200 dark:border-slate-700/50 shadow-inner">
                                                                        <div className="mb-4 flex items-center justify-between">
                                                                            <h3 className="font-bold site-text-strong text-sm">Student Results</h3>
                                                                        </div>
                                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                                            {classStudents.map(student => {
                                                                                const stuProgress = progress.find(p => p.studentId === student.id && p.assignmentId === asgn.id);
                                                                                const colors = AVATAR_COLORS[student.avatar] ?? AVATAR_COLORS.blue;
                                                                                const pct = stuProgress && stuProgress.total > 0 ? Math.round((stuProgress.correct / stuProgress.total) * 100) : null;
                                                                                const mistakes = stuProgress ? getMistakes(student.id, asgn.id, stuProgress.total, stuProgress.correct) : [];
                                                                                
                                                                                return (
                                                                                    <div key={student.id} className="bg-white dark:bg-[#0f172a] rounded-xl p-4 border border-slate-200 dark:border-slate-700/50 shadow-sm flex flex-col hover:shadow-md transition-shadow">
                                                                                        <div className="flex items-center justify-between mb-3">
                                                                                            <div className="flex items-center gap-2.5">
                                                                                                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-[11px] font-black shrink-0 ${colors.bg} ${colors.text}`}>
                                                                                                    {initials(student.name)}
                                                                                                </div>
                                                                                                <span className="font-semibold site-text-strong text-[13px]">{student.name}</span>
                                                                                            </div>
                                                                                            {pct !== null ? (
                                                                                                <div className={`px-2 py-1 rounded-md text-[11px] font-bold ${pct >= 80 ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400' : pct >= 60 ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400' : 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-400'}`}>
                                                                                                    {pct}%
                                                                                                </div>
                                                                                            ) : (
                                                                                                <div className="px-2 py-1 rounded-md text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500">Not Started</div>
                                                                                            )}
                                                                                        </div>
                                                                                        
                                                                                        {stuProgress ? (
                                                                                            <div className="flex-1 flex flex-col justify-end">
                                                                                                <div className="flex justify-between items-end mb-2">
                                                                                                    <span className="text-[12px] font-medium site-text-muted">Score: <strong className="site-text-strong text-[13px] ml-1">{stuProgress.correct}/{stuProgress.total}</strong></span>
                                                                                                    <span className="text-[11px] site-text-muted font-semibold">{stuProgress.completed ? 'Completed' : 'In Progress'}</span>
                                                                                                </div>
                                                                                                {mistakes.length > 0 ? (
                                                                                                    <div className="mt-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                                                                                                        <p className="text-[10px] uppercase tracking-wider font-bold site-text-muted mb-2">Mistakes</p>
                                                                                                        <div className="flex flex-wrap gap-1.5">
                                                                                                            {mistakes.map(m => (
                                                                                                                <span key={m} className="inline-flex items-center justify-center h-6 min-w-[24px] px-1.5 rounded bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-[11px] font-bold">
                                                                                                                    Q{m}
                                                                                                                </span>
                                                                                                            ))}
                                                                                                        </div>
                                                                                                    </div>
                                                                                                ) : (
                                                                                                    <div className="mt-2 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center h-[56px]">
                                                                                                        <p className="text-[12px] font-bold text-emerald-500 dark:text-emerald-400 flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5"/> Perfect Score</p>
                                                                                                    </div>
                                                                                                )}
                                                                                            </div>
                                                                                        ) : (
                                                                                            <div className="flex-1 flex items-center justify-center min-h-[60px] border-t border-slate-100 dark:border-slate-800 mt-2">
                                                                                                <span className="text-[12px] site-text-muted italic">Waiting for student...</span>
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </Fragment>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
