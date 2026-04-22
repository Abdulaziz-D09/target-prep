'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
    GraduationCap,
    Plus,
    Clock,
    CheckCircle2,
    ClipboardList,
    X,
    ChevronRight,
    Sparkles,
    ListChecks,
    Play,
    Users,
} from 'lucide-react';
import {
    FloatingPageShapes,
    itemRevealVariants,
    pageRevealVariants,
    sectionRevealVariants,
    staggerContainerVariants,
} from '@/components/SiteMotion';
import { useClassroomStore, seedOnce } from '@/store/classroomStore';
import {
    readStudentAssignmentProgress,
    StudentAssignmentProgressMap,
} from '@/lib/studentAssignmentProgress';

// Seed synchronously so assignments appear immediately
seedOnce();

function dueLabel(createdAt: string) {
    const createdDate = new Date(createdAt);
    const diffMs = Date.now() - createdDate.getTime();
    const diffDays = Math.max(Math.floor(diffMs / (1000 * 60 * 60 * 24)), 0);

    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due 1 day ago';
    if (diffDays < 30) return `Due ${diffDays} days ago`;

    const months = Math.round(diffDays / 30);
    return `Due about ${months} month${months === 1 ? '' : 's'} ago`;
}

const AVATAR_COLORS: Record<string, { bg: string; text: string }> = {
    blue:    { bg: 'bg-blue-100 dark:bg-blue-900/30',    text: 'text-blue-600 dark:text-blue-400' },
    indigo:  { bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-600 dark:text-indigo-400' },
    rose:    { bg: 'bg-rose-100 dark:bg-rose-900/30',    text: 'text-rose-600 dark:text-rose-400' },
    emerald: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-600 dark:text-emerald-400' },
    amber:   { bg: 'bg-amber-100 dark:bg-amber-900/30',  text: 'text-amber-600 dark:text-amber-400' },
};

function initials(name: string) {
    return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}

export default function ClassroomPage() {
    const shouldReduceMotion = useReducedMotion();
    const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
    const [viewMembersClassroomId, setViewMembersClassroomId] = useState<string | null>(null);
    const [joinCode, setJoinCode] = useState('');
    const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');
    const [studentProgressMap, setStudentProgressMap] = useState<StudentAssignmentProgressMap>({});

    const { classrooms, assignments, progress, students, seed } = useClassroomStore();
    useEffect(() => { seed(); }, [seed]);
    useEffect(() => {
        setStudentProgressMap(readStudentAssignmentProgress());
    }, []);

    // Build enriched assignment items — across ALL classrooms
    const assignmentItems = useMemo(() => {
        return assignments.map((assignment) => {
            const progressRow = progress.find((row) => row.assignmentId === assignment.id);

            const total = assignment.questions.length > 0
                ? assignment.questions.length
                : progressRow?.total ?? 0;
            const localProgress = studentProgressMap[assignment.id];
            const localAnswered = localProgress ? Object.keys(localProgress.answers ?? {}).length : null;
            const localCompleted = localProgress?.completed ?? false;
            const hasLocalProgress = localProgress !== undefined;

            // Find which classroom(s) this assignment belongs to
            const assignedClassrooms = classrooms.filter((c) => assignment.classroomIds.includes(c.id));
            const classroomLabel = assignedClassrooms.map((c) => c.name).join(', ') || 'Classroom';

            return {
                assignment,
                total,
                classroomLabel,
                answered: hasLocalProgress ? (localAnswered ?? 0) : (progressRow?.answered ?? 0),
                completed: hasLocalProgress ? localCompleted : (progressRow?.completed ?? false),
            };
        });
    }, [assignments, progress, studentProgressMap, classrooms]);

    const pendingAssignments = assignmentItems.filter((item) => !item.completed);
    const completedAssignments = assignmentItems.filter((item) => item.completed);
    const visibleAssignments = activeTab === 'pending' ? pendingAssignments : completedAssignments;

    // Classroom overview items
    const classroomItems = useMemo(() => {
        return classrooms.map((classroom) => {
            const classAssignments = assignments.filter((a) => a.classroomIds.includes(classroom.id));
            const latestAssignment = [...classAssignments]
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
            const classmates = students.filter(s => s.classroomId === classroom.id);

            return {
                classroom,
                assignmentCount: classAssignments.length,
                latestAssignmentTitle: latestAssignment?.title ?? 'No assignments yet',
                classmates,
            };
        });
    }, [classrooms, assignments, students]);

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
                {/* Hero */}
                <motion.section
                    className="site-hero-shell site-hero--home relative mb-7 overflow-hidden rounded-[36px] px-6 py-8 sm:px-8 lg:px-10"
                    variants={sectionRevealVariants}
                >
                    <div className="absolute -left-16 top-10 h-56 w-56 rounded-full bg-sky-300/10 blur-3xl" />
                    <div className="absolute bottom-0 right-0 h-48 w-64 translate-x-10 translate-y-10 rounded-full bg-rose-300/10 blur-3xl" />

                    <motion.div className="relative grid gap-8 xl:grid-cols-[1.15fr_0.85fr]" variants={staggerContainerVariants}>
                        <motion.div variants={itemRevealVariants}>
                            <div className="site-hero-chip inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.24em]">
                                <Sparkles className="h-3.5 w-3.5" />
                                Student Hub
                            </div>

                            <h1 className="site-hero-title mt-4 text-4xl font-black leading-[1.04] tracking-[-0.04em] sm:text-5xl">
                                Classroom Command
                            </h1>
                            <p className="site-hero-body mt-4 max-w-2xl text-[15px] leading-7 sm:text-[17px]">
                                Keep every assignment, deadline, and class update in one place with the same clean flow as practice mode.
                            </p>
                        </motion.div>

                        <motion.div className="grid gap-3 sm:grid-cols-2 xl:max-w-[390px] xl:justify-self-end" variants={staggerContainerVariants}>
                            <motion.div className="site-hero-stat rounded-[24px] px-4 py-4" variants={itemRevealVariants}>
                                <p className="site-hero-kicker text-[10px] font-bold uppercase tracking-[0.22em]">Classes</p>
                                <p className="site-hero-title mt-2 text-3xl font-black tracking-[-0.05em]">{classrooms.length}</p>
                            </motion.div>
                            <motion.div className="site-hero-stat rounded-[24px] px-4 py-4" variants={itemRevealVariants}>
                                <p className="site-hero-kicker text-[10px] font-bold uppercase tracking-[0.22em]">Pending</p>
                                <p className="site-hero-title mt-2 text-3xl font-black tracking-[-0.05em]">{pendingAssignments.length}</p>
                            </motion.div>
                            <motion.div className="site-hero-stat rounded-[24px] px-4 py-4" variants={itemRevealVariants}>
                                <p className="site-hero-kicker text-[10px] font-bold uppercase tracking-[0.22em]">Completed</p>
                                <p className="site-hero-title mt-2 text-3xl font-black tracking-[-0.05em]">{completedAssignments.length}</p>
                            </motion.div>
                            <motion.div className="site-hero-stat rounded-[24px] px-4 py-4" variants={itemRevealVariants}>
                                <p className="site-hero-kicker text-[10px] font-bold uppercase tracking-[0.22em]">Total</p>
                                <p className="site-hero-title mt-2 text-3xl font-black tracking-[-0.05em]">{assignments.length}</p>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </motion.section>

                {/* My Classes */}
                <motion.section className="site-panel rounded-[34px] p-5 sm:p-6 mb-6" variants={sectionRevealVariants}>
                    <motion.div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between" variants={itemRevealVariants}>
                        <div>
                            <h2 className="site-text-strong text-2xl font-black tracking-[-0.03em]">My Classes</h2>
                            <p className="site-text-muted mt-1 text-sm">Your enrolled classes.</p>
                        </div>
                        <div className="flex items-center gap-3 mt-4 md:mt-0">
                            <span className="site-chip w-fit rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] site-text-strong">
                                {classroomItems.length} Total
                            </span>
                            <button
                                onClick={() => setIsJoinModalOpen(true)}
                                className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#2563eb,#3b82f6)] px-4 py-1.5 text-[13px] font-bold text-white transition hover:scale-[1.02] hover:brightness-110 shadow-lg shadow-blue-500/20"
                            >
                                <Plus className="h-3.5 w-3.5" />
                                Join Class
                            </button>
                        </div>
                    </motion.div>

                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                        {classroomItems.length === 0 ? (
                            <div className="site-subpanel rounded-[24px] p-8 text-center md:col-span-2 xl:col-span-3">
                                <GraduationCap className="mx-auto mb-3 h-9 w-9 site-text-muted" />
                                <p className="site-text-strong text-lg font-bold">No classes yet</p>
                                <p className="site-text-muted mt-2 text-sm">Join a class to unlock assignments and progress tracking here.</p>
                            </div>
                        ) : (
                            classroomItems.map(({ classroom, assignmentCount, latestAssignmentTitle, classmates }) => (
                                <article 
                                    key={classroom.id} 
                                    className="site-panel-soft rounded-[26px] p-5 sm:p-6 cursor-pointer hover:scale-[1.015] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-all"
                                    onClick={() => setViewMembersClassroomId(classroom.id)}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="site-subpanel rounded-2xl p-3">
                                            <GraduationCap className="h-5 w-5 site-text-strong" />
                                        </div>
                                        <div>
                                            <p className="site-text-faint text-[11px] font-bold uppercase tracking-[0.2em]">{classroom.grade}</p>
                                            <h3 className="site-text-strong mt-1 text-[1.12rem] font-black tracking-[-0.02em]">{classroom.name}</h3>
                                        </div>
                                    </div>

                                    <p className="site-text mt-4 line-clamp-2 text-[13px] leading-6">
                                        Latest: {latestAssignmentTitle}
                                    </p>

                                    <div className="mt-4 grid grid-cols-2 gap-2">
                                        <div className="site-subpanel rounded-xl px-3 py-2">
                                            <p className="site-text-faint text-[10px] font-bold uppercase tracking-[0.18em]">Assignments</p>
                                            <p className="site-text-strong mt-1 text-lg font-black tracking-[-0.03em]">{assignmentCount}</p>
                                        </div>
                                        <div className="site-subpanel rounded-xl px-3 py-2">
                                            <p className="site-text-faint text-[10px] font-bold uppercase tracking-[0.18em]">Code</p>
                                            <p className="site-text-strong mt-1 text-sm font-black tracking-[0.04em]">{classroom.joinCode}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-4">
                                        <div className="flex -space-x-2">
                                            {classmates.slice(0, 5).map(student => {
                                                const color = AVATAR_COLORS[student.avatar] || AVATAR_COLORS.blue;
                                                return (
                                                    <div key={student.id} title={student.name} className={`h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ring-2 ring-white dark:ring-[#1e293b] ${color.bg} ${color.text} shadow-sm group-hover:-translate-y-1 transition-transform cursor-default z-10`}>
                                                        {initials(student.name)}
                                                    </div>
                                                )
                                            })}
                                            {classmates.length > 5 && (
                                                <div className="h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 ring-2 ring-white dark:ring-[#1e293b] shadow-sm z-0">
                                                    +{classmates.length - 5}
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-[12px] font-medium site-text-muted">{classmates.length} Groupmates</p>
                                    </div>
                                </article>
                            ))
                        )}
                    </div>
                </motion.section>

                {/* Assignments */}
                <motion.section className="site-panel rounded-[34px] p-5 sm:p-6" variants={sectionRevealVariants}>
                    <motion.div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-6" variants={itemRevealVariants}>
                        <div>
                            <h2 className="site-text-strong text-2xl font-black tracking-[-0.03em]">Assignments</h2>
                            <p className="site-text-muted mt-1 text-sm">Tap any card to launch assignment mode.</p>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setActiveTab('pending')}
                                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition ${
                                    activeTab === 'pending'
                                        ? 'bg-indigo-600 text-white shadow-md'
                                        : 'site-button-secondary site-text'
                                }`}
                            >
                                <Clock className="h-4 w-4" />
                                Pending ({pendingAssignments.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('completed')}
                                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition ${
                                    activeTab === 'completed'
                                        ? 'bg-indigo-600 text-white shadow-md'
                                        : 'site-button-secondary site-text'
                                }`}
                            >
                                <CheckCircle2 className="h-4 w-4" />
                                Completed ({completedAssignments.length})
                            </button>
                        </div>
                    </motion.div>

                    <div className="space-y-3">
                        {visibleAssignments.length === 0 ? (
                            <div className="site-subpanel rounded-[24px] p-10 text-center">
                                <ClipboardList className="w-9 h-9 mx-auto mb-3 site-text-muted" />
                                <p className="site-text-strong font-bold text-lg">No assignments in this tab</p>
                                <p className="site-text-muted text-sm mt-2">
                                    {activeTab === 'pending'
                                        ? 'Everything in your classroom is completed right now.'
                                        : 'Completed assignments will appear here as you finish them.'}
                                </p>
                            </div>
                        ) : (
                            visibleAssignments.map(({ assignment, total, answered, completed, classroomLabel }) => {
                                const isMath = assignment.subject === 'Math';
                                const subjectChipClass = isMath
                                    ? 'bg-teal-500/15 text-teal-600 dark:text-teal-400'
                                    : 'bg-blue-500/15 text-blue-600 dark:text-blue-400';

                                return (
                                    <Link key={assignment.id} href={`/classroom/assignment/${assignment.id}`} className="block">
                                        <article className="site-panel-soft rounded-[26px] p-5 sm:p-6 transition hover:scale-[1.01] hover:shadow-[0_18px_45px_rgba(15,23,42,0.18)]">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-5 justify-between">
                                                <div className="flex items-start gap-4">
                                                    <div className="site-subpanel rounded-2xl p-3 shrink-0">
                                                        <ClipboardList className="w-5 h-5 site-text-strong" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <h3 className="font-black text-[1.18rem] tracking-[-0.02em] site-text-strong">{assignment.title}</h3>
                                                            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${subjectChipClass}`}>
                                                                {assignment.subject}
                                                            </span>
                                                        </div>
                                                        <p className="text-[13px] site-text-muted mt-1">{classroomLabel}</p>

                                                        <div className="mt-3 flex flex-wrap items-center gap-2.5">
                                                            <span className="site-chip rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.2em] site-text-strong">
                                                                <ListChecks className="h-3.5 w-3.5 inline mr-1" />
                                                                {total > 0 ? `${total} Questions` : 'Assignment'}
                                                            </span>
                                                            <span className="site-chip rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.2em] site-text-strong">
                                                                <Clock className="h-3.5 w-3.5 inline mr-1" />
                                                                {assignment.timeLimitMinutes} Min
                                                            </span>
                                                            <span className="text-[12px] site-text-muted">{dueLabel(assignment.createdAt)}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3 sm:pl-0 pl-[52px]">
                                                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${
                                                        completed
                                                            ? 'bg-emerald-500/15 text-emerald-500'
                                                            : 'bg-indigo-500/15 text-indigo-500'
                                                    }`}>
                                                        {completed ? 'Completed' : `${answered}/${Math.max(total, answered)} done`}
                                                    </span>

                                                    <span className="inline-flex items-center gap-1 text-[13px] font-bold text-indigo-500">
                                                        {completed ? 'Review' : answered > 0 ? 'Continue' : 'Start'}
                                                        <ChevronRight className="w-4 h-4" />
                                                    </span>
                                                </div>
                                            </div>
                                        </article>
                                    </Link>
                                );
                            })
                        )}
                    </div>
                </motion.section>
            </motion.div>

            <AnimatePresence>
                {isJoinModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/45 backdrop-blur-sm"
                            onClick={() => setIsJoinModalOpen(false)}
                        />
                        <motion.div
                            initial={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.95, y: 10 }}
                            animate={shouldReduceMotion ? undefined : { opacity: 1, scale: 1, y: 0 }}
                            exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.95, y: 10 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="relative w-full max-w-md overflow-hidden rounded-[24px] site-panel shadow-2xl p-7 border"
                        >
                            <button
                                onClick={() => setIsJoinModalOpen(false)}
                                className="absolute right-5 top-5 p-2 rounded-full site-subpanel hover:scale-[1.05] transition"
                            >
                                <X className="w-5 h-5 site-text" />
                            </button>

                            <h2 className="text-2xl font-black tracking-[-0.03em] site-text-strong mb-2">Join a Class</h2>
                            <p className="text-[15px] site-text-muted mb-7">
                                Enter the class code provided by your teacher.
                            </p>

                            <div className="mb-6">
                                <input
                                    type="text"
                                    placeholder="Enter join code (e.g., ABC123)"
                                    value={joinCode}
                                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                                    className={`w-full text-center text-lg tracking-widest font-mono p-4 rounded-xl site-subpanel bg-transparent border-2 outline-none transition uppercase placeholder:text-slate-400 placeholder:normal-case placeholder:tracking-normal placeholder:font-sans ${joinCode ? 'border-indigo-600' : 'border-transparent'}`}
                                />
                            </div>

                            <button
                                onClick={() => {
                                    if (joinCode) {
                                        setIsJoinModalOpen(false);
                                        setJoinCode('');
                                    }
                                }}
                                disabled={!joinCode}
                                className="w-full flex items-center justify-center p-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-white font-bold text-[16px] shadow-md transition hover:scale-[1.02]"
                            >
                                Join Class
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Class Members Modal */}
            <AnimatePresence>
                {viewMembersClassroomId && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/45 backdrop-blur-sm"
                            onClick={() => setViewMembersClassroomId(null)}
                        />
                        <motion.div
                            initial={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.95, y: 10 }}
                            animate={shouldReduceMotion ? undefined : { opacity: 1, scale: 1, y: 0 }}
                            exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.95, y: 10 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="relative w-full max-w-sm max-h-[80vh] flex flex-col overflow-hidden rounded-[24px] site-panel shadow-2xl border"
                        >
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800/80 shrink-0 relative">
                                <button
                                    onClick={() => setViewMembersClassroomId(null)}
                                    className="absolute right-5 top-5 p-2 rounded-full site-subpanel hover:scale-[1.05] transition"
                                >
                                    <X className="w-5 h-5 site-text" />
                                </button>
                                
                                {(() => {
                                    const activeClass = classroomItems.find(c => c.classroom.id === viewMembersClassroomId);
                                    if (!activeClass) return null;
                                    return (
                                        <>
                                            <h2 className="text-xl font-black tracking-[-0.03em] site-text-strong mb-1 pr-8">
                                                {activeClass.classroom.name}
                                            </h2>
                                            <p className="text-[13px] site-text-muted font-bold flex items-center gap-1.5 uppercase tracking-wider">
                                                <Users className="w-3.5 h-3.5" />
                                                {activeClass.classmates.length} Members
                                            </p>
                                        </>
                                    );
                                })()}
                            </div>

                            <div className="p-2 overflow-y-auto">
                                {(() => {
                                    const activeClass = classroomItems.find(c => c.classroom.id === viewMembersClassroomId);
                                    if (!activeClass) return null;
                                    return activeClass.classmates.map(student => {
                                        const color = AVATAR_COLORS[student.avatar] || AVATAR_COLORS.blue;
                                        return (
                                            <div key={student.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                                                <div className={`h-10 w-10 rounded-full flex flex-shrink-0 items-center justify-center text-[13px] font-black ${color.bg} ${color.text}`}>
                                                    {initials(student.name)}
                                                </div>
                                                <p className="font-semibold site-text-strong text-[15px]">{student.name}</p>
                                            </div>
                                        );
                                    });
                                })()}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
