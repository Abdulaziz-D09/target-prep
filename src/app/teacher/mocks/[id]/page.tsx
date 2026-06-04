'use client';
import { useParams, useRouter } from 'next/navigation';
import { useClassroomStore } from '@/store/classroomStore';
import { ArrowLeft, Users, FileText, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import { practiceCards as practiceCatalog } from '@/lib/practiceCatalog';

export default function TeacherMockDetailPage() {
    const params = useParams();
    const router = useRouter();
    const mockId = params.id as string;
    
    const { mockSessions, mockResults, students, updateMockSessionStatus, deleteMockSession } = useClassroomStore();
    
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
                            <button onClick={() => updateMockSessionStatus(session.id, 'active')} className="text-[13px] font-bold text-blue-600 hover:underline">Start Session</button>
                        )}
                        {session.status === 'active' && (
                            <button onClick={() => updateMockSessionStatus(session.id, 'completed')} className="text-[13px] font-bold text-amber-600 hover:underline">End Session</button>
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
                        <p className="text-[12px] font-bold site-text-muted uppercase tracking-widest mb-1">Join Code</p>
                        <p className="text-2xl font-mono font-black text-slate-600 dark:text-slate-300 tracking-widest">{session.joinCode}</p>
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

            <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] items-start">
                {/* Left Side: Live Activity Monitor */}
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <span className="relative flex h-3.5 w-3.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
                        </span>
                        <h2 className="text-xl font-black site-text-strong">Live Monitoring ({activeStudentsList.length} Testing)</h2>
                    </div>
                    <div className="site-panel rounded-[32px] overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800/50">
                                    <th className="px-6 py-4 text-[13px] font-bold site-text-muted uppercase tracking-widest">Student</th>
                                    <th className="px-6 py-4 text-[13px] font-bold site-text-muted uppercase tracking-widest">School & Grade</th>
                                    <th className="px-6 py-4 text-[13px] font-bold site-text-muted uppercase tracking-widest text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                                {activeStudentsList.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-12 text-center site-text-muted">No students are currently taking this mock exam.</td>
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
                                        <td className="px-6 py-4 text-right">
                                            <span className="inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[11px] px-2.5 py-1 rounded-full uppercase tracking-wider animate-pulse">
                                                Testing...
                                            </span>
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
        </div>
    );
}
