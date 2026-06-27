'use client';
import { useState, useEffect, useRef, KeyboardEvent, ClipboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Calendar, MapPin, Users, Play, X, KeyRound, AlertCircle, CheckCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useClassroomStore } from '@/store/classroomStore';
import { createClient } from '@/lib/supabase/client';
import { 
    FloatingPageShapes,
    staggerContainerVariants,
    itemRevealVariants,
    sectionRevealVariants,
    pageRevealVariants 
} from '@/components/SiteMotion';

export default function StudentMocksPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const mockSessions = useClassroomStore(state => state.mockSessions);
    const mockResults = useClassroomStore(state => state.mockResults);
    const joinMock = useClassroomStore(state => state.joinMock);
    const deleteMockResult = useClassroomStore(state => state.deleteMockResult);
    const seed = useClassroomStore(state => state.seed);
    const [activeTab, setActiveTab] = useState<'available' | 'completed'>(
        searchParams.get('tab') === 'completed' ? 'completed' : 'available'
    );
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState('');
    
    // Auto-fill form state
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        school: '',
        grade: '11th Grade',
        joinCode: ''
    });

    const [user, setUser] = useState<any>(null);

    useEffect(() => { 
        seed(); 
        const supabase = createClient();
        supabase.auth.getUser().then(({ data }) => {
            if (data?.user) {
                setUser(data.user);
                setFormData(prev => ({
                    ...prev,
                    name: data.user.user_metadata?.first_name || '',
                    surname: data.user.user_metadata?.last_name || data.user.user_metadata?.surname || '',
                    school: data.user.user_metadata?.school || ''
                }));
            }
        });
    }, [seed]);

    useEffect(() => {
        // Sync once on mount to get fresh data
        useClassroomStore.getState().syncWithSupabase();
    }, []);

    const students = useClassroomStore(state => state.students);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        createClient().auth.getUser().then(({ data }) => {
            if (data?.user) setUserId(data.user.id);
        });
    }, []);

    const studentFullName = `${formData.name} ${formData.surname}`.trim();
    const myStudentRecords = students.filter(s => 
        (userId && s.user_id === userId) || 
        (s.name === studentFullName && (!s.school || s.school === formData.school))
    );
    const myStudentRecordIds = new Set(myStudentRecords.map(s => s.id));

    // Get completed mocks specific to this user based on store mockResults and user data
    const myResults = mockResults
        .filter(r => myStudentRecordIds.has(r.studentId) || r.studentId === 's1')
        .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());

    // Get all session IDs the student already completed using myResults
    const completedSessionIds = new Set(myResults.map(r => r.mockId));
    
    const activeMocks = mockSessions
        .filter(s => s.status === 'active' || s.status === 'upcoming')
        // Hide mocks the student already finished
        .filter(s => !completedSessionIds.has(s.id))
        // Filter by search query
        .filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()));

    const filteredMyResults = myResults.filter(r => {
        const session = mockSessions.find(s => s.id === r.mockId);
        return session?.title.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const handleRegister = (mockId: string) => {
        setError('');
        const fullName = `${formData.name} ${formData.surname}`.trim();
        const res = useClassroomStore.getState().registerForMock(mockId, {
            name: fullName || 'Student',
            school: formData.school,
            grade: formData.grade
        });
        if (res.success && res.student) {
            router.push(`/lobby?mockId=${mockId}&studentId=${res.student.id}`);
        } else {
            setError(res.error || 'Failed to register.');
        }
    };


    return (
        <div className="relative min-h-screen w-full pt-4 pb-12 px-4 sm:px-6 lg:px-8">
            <FloatingPageShapes theme="home" />

            <motion.div
                className="relative z-10 w-full mx-auto max-w-[1320px]"
                initial="hidden"
                animate="visible"
                variants={pageRevealVariants}
            >

                {/* Hero */}
                <motion.section
                    className="site-hero-shell site-hero--home relative mb-7 overflow-hidden rounded-[36px] px-6 py-8 sm:px-8 lg:px-10"
                    variants={sectionRevealVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="absolute -left-16 top-10 h-56 w-56 rounded-full bg-indigo-300/10 blur-3xl" />
                    <div className="absolute bottom-0 right-0 h-48 w-64 translate-x-10 translate-y-10 rounded-full bg-purple-300/10 blur-3xl" />

                    <motion.div className="relative grid gap-8 xl:grid-cols-[1.15fr_0.85fr] xl:items-center" variants={staggerContainerVariants}>
                        <motion.div variants={itemRevealVariants}>
                            <div className="site-hero-chip inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.24em]">
                                <Sparkles className="h-3.5 w-3.5" />
                                SAT Mocks
                            </div>

                            <h1 className="site-hero-title mt-4 text-4xl font-black leading-[1.04] tracking-[-0.04em] sm:text-5xl">
                                Mock Exams
                            </h1>
                            <p className="site-hero-body mt-4 max-w-2xl text-[15px] leading-7 sm:text-[17px]">
                                Join in-person or live proctored mock sessions.
                            </p>
                        </motion.div>
                        <motion.div className="flex xl:justify-end items-end" variants={itemRevealVariants}>
                            <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-full w-full max-w-[300px]">
                                <button 
                                    onClick={() => setActiveTab('available')}
                                    className={`flex-1 rounded-full py-2.5 text-sm font-bold transition ${activeTab === 'available' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
                                >
                                    Available
                                </button>
                                <button 
                                    onClick={() => setActiveTab('completed')}
                                    className={`flex-1 rounded-full py-2.5 text-sm font-bold transition ${activeTab === 'completed' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
                                >
                                    Completed
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.section>

                <motion.div variants={sectionRevealVariants} className="relative z-10">
                <div className="mb-6 max-w-md">
                    <input
                        type="text"
                        placeholder="Search mocks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none text-slate-800 dark:text-white transition-all font-medium"
                    />
                </div>
                <div className="site-panel rounded-[32px] p-6 sm:p-8">
                {activeTab === 'available' && (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {activeMocks.length === 0 ? (
                            <div className="col-span-full site-panel rounded-[24px] p-16 flex flex-col items-center text-center border-2 border-slate-200 dark:border-slate-800">
                                <Users className="h-12 w-12 site-text-muted mb-4 opacity-30" />
                                <p className="font-bold site-text-strong text-lg">No Active Mocks</p>
                                <p className="site-text-muted text-sm mt-1">There are no live mock exams available right now. Check back later!</p>
                            </div>
                        ) : activeMocks.map(mock => (
                            <motion.div 
                                key={mock.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white dark:bg-[var(--site-shell-bg)] border border-slate-200 dark:border-white/10 p-6 rounded-3xl shadow-sm hover:shadow-md transition relative overflow-hidden group flex flex-col h-full"
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
                                <div className="flex justify-between items-start mb-5">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-800 dark:text-white">{mock.title}</h3>
                                        <div className="flex gap-1.5 mt-1.5 flex-wrap">
                                            <span className={`px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-md ${
                                                mock.subject === 'English'
                                                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400'
                                                    : mock.subject === 'Math'
                                                    ? 'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-400'
                                                    : 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400'
                                            }`}>
                                                {mock.subject === 'English' ? 'English Only' : mock.subject === 'Math' ? 'Math Only' : 'Full Mock'}
                                            </span>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full shrink-0 ${mock.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400'}`}>
                                        {mock.status === 'active' ? 'Live Now' : 'Upcoming'}
                                    </span>
                                </div>
                                
                                <div className="space-y-3 mb-8 flex-1">
                                    {mock.host && (
                                        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 text-[14px]">
                                            <Users className="w-4 h-4 text-slate-400" /> Hosted by {mock.host}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 text-[14px]">
                                        <Calendar className="w-4 h-4 text-slate-400" /> {mock.date || 'TBD'}
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 text-[14px]">
                                        <MapPin className="w-4 h-4 text-slate-400" /> {mock.place}
                                    </div>
                                </div>
                                
                                {(() => {
                                    const isRegistered = myStudentRecords.some(s => s.mockSessionId === mock.id);
                                    const studentRecord = myStudentRecords.find(s => s.mockSessionId === mock.id);

                                    return (
                                        <button 
                                            onClick={() => {
                                                if (isRegistered && studentRecord) {
                                                    router.push(`/lobby?mockId=${mock.id}&studentId=${studentRecord.id}`);
                                                } else {
                                                    handleRegister(mock.id);
                                                }
                                            }}
                                            disabled={mock.joinLocked}
                                            className={`w-full flex items-center justify-center gap-2 py-3 rounded-full font-bold transition ${(!mock.joinLocked) ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200' : 'bg-slate-200 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 cursor-not-allowed'}`}
                                        >
                                            {mock.joinLocked ? <AlertCircle className="w-4 h-4" /> : <Play className="w-4 h-4" />} 
                                            {mock.joinLocked ? 'Locked' : isRegistered ? 'Enter Lobby' : 'Register'}
                                        </button>
                                    );
                                })()}
                            </motion.div>
                        ))}
                    </div>
                )}
                
                {activeTab === 'completed' && (
                    <div className="bg-white dark:bg-[var(--site-shell-bg)] border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10">
                                    <th className="px-6 py-4 text-[12px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Mock Session</th>
                                    <th className="px-6 py-4 text-[12px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Date Completed</th>
                                    <th className="px-6 py-4 text-[12px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Score</th>
                                    <th className="px-6 py-4 text-[12px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                {filteredMyResults.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-16 text-center text-slate-500 dark:text-slate-400">
                                            {searchQuery ? 'No completed mocks match your search.' : "You haven't completed any mock exams yet."}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredMyResults.map((result, idx) => {
                                        const session = mockSessions.find(s => s.id === result.mockId);
                                        const formattedDate = new Date(result.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                                        return (
                                            <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-slate-800 dark:text-white">{session?.title || 'Unknown Mock Session'}</div>
                                                    <span className={`inline-block mt-1 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-md ${
                                                        session?.subject === 'English'
                                                            ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400'
                                                            : session?.subject === 'Math'
                                                            ? 'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-400'
                                                            : 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400'
                                                    }`}>
                                                        {session?.subject === 'English' ? 'English Only' : session?.subject === 'Math' ? 'Math Only' : 'Full Mock'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                                                    {formattedDate}
                                                </td>
                                                <td className="px-6 py-4 font-black text-blue-600">
                                                    {result.totalCorrect ?? 0} <span className="text-sm font-medium text-slate-400">/ {result.totalQuestions ?? 0}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <button 
                                                            onClick={() => window.location.href = `/progress/review?testId=${result.assignedTestId || 1}&mockId=${result.mockId}&date=${result.completedAt}`}
                                                            className="text-xs bg-slate-100 hover:bg-blue-600 hover:text-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold px-3.5 py-1.5 rounded-lg transition-all"
                                                        >
                                                            View Results
                                                        </button>
                                                        <button
                                                            onClick={() => deleteMockResult(result.id)}
                                                            className="text-xs bg-red-50 hover:bg-red-600 hover:text-white dark:bg-red-500/10 text-red-600 dark:text-red-400 font-bold px-3.5 py-1.5 rounded-lg transition-all"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
                </div>
            </motion.div>
            </motion.div>
        </div>
    );
}
