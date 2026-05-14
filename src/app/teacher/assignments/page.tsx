'use client';
import Link from 'next/link';
import { ClipboardList, Plus, ChevronRight, GraduationCap, Trash2 } from 'lucide-react';
import { FloatingPageShapes } from '@/components/SiteMotion';
import { useClassroomStore, seedOnce } from '@/store/classroomStore';

seedOnce();

function scoreColor(pct: number) {
    if (pct >= 80) return 'text-emerald-500';
    if (pct >= 60) return 'text-amber-500';
    return 'text-rose-500';
}

export default function AssignmentsPage() {
    const { assignments, classrooms, students, progress, deleteAssignment } = useClassroomStore();

    return (
        <div className="relative min-h-screen pt-4 pb-12 px-4 sm:px-6 lg:px-8">
            <FloatingPageShapes theme="home" />
            <div className="relative z-10 mx-auto max-w-[1320px]">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-600 text-white rounded-full text-xs font-bold uppercase tracking-widest mb-3 shadow-sm">
                            Teacher Portal
                        </div>
                        <h1 className="text-3xl sm:text-[2.6rem] font-black tracking-[-0.05em] site-text-strong">Assignments</h1>
                        <p className="mt-1 text-[15px] site-text-muted">Click an assignment to view class results and student breakdown.</p>
                    </div>
                    <Link
                        href="/teacher/assignments/create"
                        className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white transition hover:scale-[1.03] shadow-md bg-indigo-600 hover:bg-indigo-700 shrink-0"
                    >
                        <Plus className="h-4 w-4" />
                        New Assignment
                    </Link>
                </div>

                {/* List */}
                {assignments.length === 0 ? (
                    <div className="site-panel rounded-[24px] p-14 flex flex-col items-center text-center border-2 border-dashed border-slate-200 dark:border-slate-800">
                        <ClipboardList className="h-12 w-12 site-text-muted mb-4 opacity-30" />
                        <p className="font-bold site-text-strong text-lg">No assignments yet</p>
                        <p className="site-text-muted text-sm mt-1 mb-5">Create your first assignment to get started.</p>
                        <Link href="/teacher/assignments/create" className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-full transition">
                            <Plus className="h-4 w-4" /> Create Assignment
                        </Link>
                    </div>
                ) : (
                    <div className="site-panel rounded-[24px] overflow-hidden">
                        {assignments.map((asgn, idx) => {
                            const assignedClassrooms = classrooms.filter(c => asgn.classroomIds.includes(c.id));
                            const allStudents = students.filter(s => asgn.classroomIds.includes(s.classroomId));
                            const allRows = progress.filter(p => p.assignmentId === asgn.id && allStudents.some(s => s.id === p.studentId));
                            const totalCompleted = allRows.filter(r => r.completed).length;
                            const scores = allRows.filter(r => r.total > 0).map(r => (r.correct / r.total) * 100);
                            const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;
                            const isLast = idx === assignments.length - 1;

                            return (
                                <div key={asgn.id} className={`${!isLast ? 'border-b border-slate-100 dark:border-slate-800/60' : ''}`}>
                                    <div className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                                        {/* Icon */}
                                        <div className="h-11 w-11 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center shrink-0 border border-indigo-200 dark:border-indigo-800/50">
                                            <ClipboardList className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                        </div>

                                        {/* Title + class pills — clickable area */}
                                        <Link href={`/teacher/assignments/${asgn.id}`} className="flex-1 min-w-0 py-1">
                                            <h2 className="font-black text-[17px] site-text-strong leading-tight group-hover:text-indigo-500 transition truncate">{asgn.title}</h2>
                                            <div className="flex flex-wrap gap-1.5 mt-1.5">
                                                {assignedClassrooms.map(c => (
                                                    <span key={c.id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-bold">
                                                        <GraduationCap className="h-2.5 w-2.5" />{c.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </Link>

                                        {/* Stats */}
                                        <div className="flex items-center gap-8 shrink-0">
                                            <div className="text-center hidden sm:block">
                                                <p className="text-[10px] uppercase tracking-widest font-bold site-text-muted mb-0.5">Completion</p>
                                                <p className="font-black text-[15px] site-text-strong">{totalCompleted}/{allStudents.length}</p>
                                            </div>
                                            <div className="text-center hidden sm:block w-20">
                                                <p className="text-[10px] uppercase tracking-widest font-bold site-text-muted mb-0.5">Avg Score</p>
                                                {avgScore !== null
                                                    ? <p className={`font-black text-[15px] ${scoreColor(avgScore)}`}>{avgScore}%</p>
                                                    : <p className="font-black text-[15px] site-text-muted">–</p>}
                                            </div>
                                            {/* Delete */}
                                            <button
                                                onClick={() => { if (confirm('Delete this assignment?')) deleteAssignment(asgn.id); }}
                                                className="p-2 rounded-full text-slate-300 dark:text-slate-600 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                            {/* Arrow */}
                                            <Link href={`/teacher/assignments/${asgn.id}`} className="h-9 w-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                <ChevronRight className="h-4 w-4" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
