'use client';
import { useParams, useRouter } from 'next/navigation';
import { useClassroomStore } from '@/store/classroomStore';
import { ArrowLeft, Users, FileText, CheckCircle, Clock, Settings, X } from 'lucide-react';
import { CustomSelect } from '@/components/CustomSelect';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { practiceCards as practiceCatalog } from '@/lib/practiceCatalog';
import EditMockModal from '@/components/EditMockModal';
import { useState } from 'react';
import { QuestionEditor } from '@/components/QuestionEditor';
import { practiceTests, Question } from '@/data/questions';


export default function TeacherMockDetailPage() {
    const params = useParams();
    const router = useRouter();
    const mockId = params.id as string;
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [studentToRemove, setStudentToRemove] = useState<{ id: string, name: string } | null>(null);
    const [activeTab, setActiveTab] = useState<'progress' | 'questions'>('progress');
    
    const { mockSessions, mockResults, students, updateMockSessionStatus, deleteMockSession, assignTestToStudent, updateMockSession, removeStudent } = useClassroomStore();
    
    
    // Calculate custom questions
    const mockQuestions: Question[] = [];
    const sessionToUse = mockSessions.find(s => s.id === mockId);
    if (sessionToUse) {
        sessionToUse.attachedTestIds.forEach(testId => {
            const test = practiceTests.find(pt => pt.id === testId);
            if (test) {
                test.modules.forEach(m => {
                    m.questions.forEach(q => {
                        // Override with custom question if exists
                        const customQ = sessionToUse.customQuestions?.[q.id];
                        mockQuestions.push(customQ || q);
                    });
                });
            }
        });
    }

    const session = mockSessions.find(s => s.id === mockId);
    if (!session) {
        return <div className="p-12 text-center text-slate-500">Mock session not found.</div>;
    }

    const sessionResults = mockResults.filter(r => r.mockId === mockId);
    const completedStudentsCount = sessionResults.length;
    const avgScore = completedStudentsCount > 0 
        ? Math.round(sessionResults.reduce((acc, r) => acc + r.score, 0) / completedStudentsCount) 
        : 0;

    // Students associated with this mock session
    const sessionStudents = students.filter(s => s.mockSessionId === mockId);
    // Filter active students currently taking the exam (joined but haven't submitted results yet)
    const activeStudentsList = sessionStudents.filter(s => !sessionResults.some(r => r.studentId === s.id));
    const totalJoinedCount = sessionStudents.length;
    const availableTests = session.customTests || [];

    return (
        <div className="relative min-h-screen pt-4 pb-12 px-4 sm:px-6 lg:px-8 max-w-[1320px] mx-auto">
            <Link href="/teacher/mocks" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold mb-6 transition">
                <ArrowLeft className="w-4 h-4" /> Back to Mocks
            </Link>
            
            <div className="site-panel rounded-[32px] p-8 mb-8">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-3xl font-black site-text-strong mb-2">{session.title}</h1>
                        <p className="site-text-muted flex items-center gap-2">
                            <Clock className="w-4 h-4" /> {session.date} • {session.place}
                        </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <span className={`px-4 py-1.5 text-[12px] font-bold uppercase tracking-wider rounded-full ${session.status === 'active' ? 'bg-emerald-100 text-emerald-700' : session.status === 'upcoming' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                            {session.status}
                        </span>
                        {session.status === 'upcoming' && (
                            <div className="flex items-center gap-4 mt-2">
                                <button onClick={() => setIsEditModalOpen(true)} className="text-[13px] font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 transition">
                                    <Settings className="w-4 h-4" /> Edit Settings
                                </button>
                                <button onClick={() => updateMockSessionStatus(session.id, 'active')} className="text-[13px] font-bold text-blue-600 hover:underline">Start Session</button>
                            </div>
                        )}
                        {session.status === 'active' && (
                            <div className="flex items-center gap-4 mt-2">
                                <button onClick={() => setIsEditModalOpen(true)} className="text-[13px] font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 transition">
                                    <Settings className="w-4 h-4" /> Edit Settings
                                </button>
                                <button onClick={() => updateMockSession(session.id, { joinLocked: !session.joinLocked })} className={`text-[13px] font-bold ${session.joinLocked ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-800'} transition`}>
                                    {session.joinLocked ? 'Unlock Joins' : 'Lock Joins'}
                                </button>
                                <button onClick={() => updateMockSessionStatus(session.id, 'completed')} className="text-[13px] font-bold text-amber-600 hover:underline">End Session</button>
                            </div>
                        )}
                        {session.status === 'completed' && (
                            <button onClick={() => {
                                deleteMockSession(session.id);
                                router.push('/teacher/mocks');
                            }} className="text-[13px] font-bold text-red-600 hover:underline">Delete Session</button>
                        )}
                    </div>
                </div>
                
                <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-200 dark:border-slate-800/60">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <p className="text-[12px] font-bold site-text-muted uppercase tracking-widest">Join Code</p>
                            {session.joinLocked && (
                                <span className="text-[9px] font-bold uppercase bg-red-100 text-red-600 px-1.5 py-0.5 rounded tracking-wider">Locked</span>
                            )}
                        </div>
                        <p className={`text-2xl font-mono font-black tracking-widest ${session.joinLocked ? 'text-slate-400 line-through' : 'text-slate-600 dark:text-slate-300'}`}>{session.joinCode}</p>
                    </div>
                    <div>
                        <p className="text-[12px] font-bold site-text-muted uppercase tracking-widest mb-1">Students Joined</p>
                        <p className="text-2xl font-black site-text-strong">{totalJoinedCount} / {session.maxStudents}</p>
                    </div>
                    <div>
                        <p className="text-[12px] font-bold site-text-muted uppercase tracking-widest mb-1">Avg Score</p>
                        <p className="text-2xl font-black site-text-strong">{avgScore || '--'}</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 mb-6 border-b border-slate-200 dark:border-slate-800 pb-2 mt-6">
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
            <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] items-start">
                {/* Left Side: Live Activity Monitor */}
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <span className="relative flex h-3.5 w-3.5">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${session.status === 'upcoming' ? 'bg-blue-400' : 'bg-emerald-400'}`}></span>
                            <span className={`relative inline-flex rounded-full h-3.5 w-3.5 ${session.status === 'upcoming' ? 'bg-blue-500' : 'bg-emerald-500'}`}></span>
                        </span>
                        <h2 className="text-xl font-black site-text-strong">
                            {session.status === 'upcoming' ? `Lobby (${activeStudentsList.length} Waiting)` : `Live Monitoring (${activeStudentsList.length} Testing)`}
                        </h2>
                    </div>
                    <div className="site-panel rounded-[32px] overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800/50">
                                    <th className="px-6 py-4 text-[13px] font-bold site-text-muted uppercase tracking-widest">Student</th>
                                    <th className="px-6 py-4 text-[13px] font-bold site-text-muted uppercase tracking-widest">School & Grade</th>
                                    {session.status === 'upcoming' && availableTests.length > 1 && session.distributionMode === 'manual' && (
                                        <th className="px-6 py-4 text-[13px] font-bold site-text-muted uppercase tracking-widest">Assign Test</th>
                                    )}
                                    <th className="px-6 py-4 text-[13px] font-bold site-text-muted uppercase tracking-widest text-right">Status</th>
                                    <th className="px-6 py-4 text-[13px] font-bold site-text-muted uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                                {activeStudentsList.length === 0 ? (
                                    <tr>
                                        <td colSpan={session.status === 'upcoming' && availableTests.length > 1 && session.distributionMode === 'manual' ? 5 : 4} className="px-6 py-12 text-center site-text-muted">
                                            {session.status === 'upcoming' ? 'No students have joined the lobby yet.' : 'No students are currently taking this mock exam.'}
                                        </td>
                                    </tr>
                                ) : activeStudentsList.map(student => (
                                    <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition">
                                        <td className="px-6 py-4">
                                            <div className="font-bold site-text-strong">{student.name}</div>
                                            <div className="text-[11px] site-text-muted">Joined {new Date(student.joinedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                        </td>
                                        <td className="px-6 py-4 text-[14px] site-text-muted">
                                            {student.school || '--'} • {student.gradeLevel || '--'}
                                        </td>
                                        {session.status === 'upcoming' && availableTests.length > 1 && session.distributionMode === 'manual' && (
                                            <td className="px-6 py-4">
                                                <CustomSelect
                                                    value={session.studentAssignments?.[student.id] || ''}
                                                    onChange={(val) => assignTestToStudent(session.id, student.id, val)}
                                                    placeholder="Select Test..."
                                                    options={availableTests.map(t => ({ value: String(t.id), label: t.name }))}
                                                    buttonClassName="w-full max-w-[200px] flex items-center justify-between gap-2 bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-1.5 text-sm font-bold text-slate-700 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500"
                                                />
                                            </td>
                                        )}
                                        <td className="px-6 py-4 text-right">
                                            {session.status === 'upcoming' ? (
                                                <span className="inline-flex items-center gap-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-[11px] px-2.5 py-1 rounded-full uppercase tracking-wider">
                                                    In Lobby
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[11px] px-2.5 py-1 rounded-full uppercase tracking-wider animate-pulse">
                                                    Testing...
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => setStudentToRemove({ id: student.id, name: student.name })}
                                                className="text-[12px] font-bold text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition"
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Side: Completed Results */}
                <div>
                    <h2 className="text-xl font-black site-text-strong mb-6">Completed Results ({sessionResults.length})</h2>
                    <div className="site-panel rounded-[32px] overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800/50">
                                    <th className="px-6 py-4 text-[13px] font-bold site-text-muted uppercase tracking-widest">Student</th>
                                    <th className="px-6 py-4 text-[13px] font-bold site-text-muted uppercase tracking-widest">Test Assigned</th>
                                    <th className="px-6 py-4 text-[13px] font-bold site-text-muted uppercase tracking-widest text-right">Score</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                                {sessionResults.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-12 text-center site-text-muted">No students have completed this mock yet.</td>
                                    </tr>
                                ) : sessionResults.map(result => {
                                    const student = students.find(s => s.id === result.studentId);
                                    const test = practiceCatalog.find(t => t.id.toString() === result.assignedTestId);
                                    return (
                                        <tr key={result.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition">
                                            <td className="px-6 py-4">
                                                <div className="font-bold site-text-strong">{student?.name || 'Unknown Student'}</div>
                                                <div className="text-[11px] site-text-muted">{student?.school || '--'} • {student?.gradeLevel || '--'}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-3 py-1 rounded-full text-[13px] font-bold">
                                                    <FileText className="w-3.5 h-3.5" />
                                                    {test?.title || `Test ${result.assignedTestId}`}
                                                </div>
                                                {result.kickedOut && (
                                                    <div className="mt-2 inline-flex items-center gap-1.5 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider">
                                                        <X className="w-3 h-3" />
                                                        Kicked out (Left Fullscreen)
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="font-black text-[18px] text-blue-600">{result.score}</div>
                                                <div className="text-[11px] site-text-muted">{result.totalCorrect}/{result.totalQuestions} correct</div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            ) : (
                <QuestionEditor questions={mockQuestions} onSave={(qId, newQ) => useClassroomStore.getState().updateMockQuestion(session.id, "none", qId, newQ)} />
            )}

            {isEditModalOpen && (
                <EditMockModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    session={session}
                    onSave={updateMockSession}
                />
            )}

            {/* Remove Student Confirmation Modal */}
            <AnimatePresence>
                {studentToRemove && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                            onClick={() => setStudentToRemove(null)}
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="bg-white dark:bg-slate-900 rounded-[24px] shadow-2xl w-full max-w-sm relative z-10 overflow-hidden"
                        >
                            <div className="p-6 text-center">
                                <div className="w-16 h-16 bg-red-100 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <X className="w-8 h-8 text-red-600 dark:text-red-400" />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Remove Student?</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-[15px] leading-relaxed">
                                    Are you sure you want to remove <strong className="text-slate-700 dark:text-slate-200">{studentToRemove.name}</strong> from this mock session? They will not be able to join using the code.
                                </p>
                            </div>
                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 flex gap-3 border-t border-slate-100 dark:border-white/5">
                                <button
                                    onClick={() => setStudentToRemove(null)}
                                    className="flex-1 py-2.5 font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        removeStudent(studentToRemove.id);
                                        setStudentToRemove(null);
                                    }}
                                    className="flex-1 py-2.5 font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl transition shadow-sm"
                                >
                                    Remove
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
