import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Edit3, ChevronDown, ChevronUp } from 'lucide-react';
import { MockSession } from '@/store/classroomStore';

interface EditMockModalProps {
    session: MockSession;
    isOpen: boolean;
    onClose: () => void;
    onSave: (id: string, updates: Partial<MockSession>) => void;
}

export default function EditMockModal({ session, isOpen, onClose, onSave }: EditMockModalProps) {
    const [title, setTitle] = useState(session.title);
    const [place, setPlace] = useState(session.place);
    const [date, setDate] = useState(session.date);
    const [timeLimit, setTimeLimit] = useState(session.timeLimitMinutes);
    const [maxStudents, setMaxStudents] = useState(session.maxStudents);
    const [customTests, setCustomTests] = useState(session.customTests || []);
    const [joinDeadlineMinutes, setJoinDeadlineMinutes] = useState<string>('');
    
    const [expandedTestId, setExpandedTestId] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            setTitle(session.title);
            setPlace(session.place);
            setDate(session.date);
            setTimeLimit(session.timeLimitMinutes);
            setMaxStudents(session.maxStudents);
            setCustomTests(session.customTests || []);
            setExpandedTestId(null);
            
            if (session.joinDeadline) {
                const diffMs = new Date(session.joinDeadline).getTime() - Date.now();
                if (diffMs > 0) {
                    setJoinDeadlineMinutes(Math.ceil(diffMs / 60000).toString());
                } else {
                    setJoinDeadlineMinutes('');
                }
            } else {
                setJoinDeadlineMinutes('');
            }
        }
    }, [isOpen, session]);

    if (!isOpen) return null;

    const handleSave = () => {
        let newJoinDeadline = session.joinDeadline;
        if (joinDeadlineMinutes) {
            const mins = parseInt(joinDeadlineMinutes);
            if (!isNaN(mins) && mins > 0) {
                newJoinDeadline = new Date(Date.now() + mins * 60000).toISOString();
            }
        } else {
            newJoinDeadline = undefined;
        }

        onSave(session.id, {
            title,
            place,
            date,
            timeLimitMinutes: timeLimit,
            maxStudents,
            customTests,
            joinDeadline: newJoinDeadline
        });
        onClose();
    };

    const updateQuestionAnswer = (testId: string, questionId: string, newAnswerIdx: number) => {
        setCustomTests(prev => prev.map(test => {
            if (test.id !== testId) return test;
            return {
                ...test,
                questions: test.questions.map(q => 
                    q.id === questionId ? { ...q, answer: newAnswerIdx } : q
                )
            };
        }));
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-white dark:bg-slate-900 rounded-[32px] max-w-3xl w-full shadow-2xl overflow-hidden border border-slate-100 dark:border-white/10 my-8"
                >
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white dark:bg-slate-900 z-10">
                        <h2 className="text-2xl font-black site-text-strong flex items-center gap-2">
                            <Edit3 className="w-6 h-6 text-blue-600" />
                            Edit Session Settings
                        </h2>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                            <X className="w-6 h-6 site-text-muted" />
                        </button>
                    </div>

                    <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold site-text-strong mb-2">Session Title</label>
                                <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-xl px-4 py-3 font-medium focus:outline-none focus:border-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold site-text-strong mb-2">Location / Place</label>
                                <input type="text" value={place} onChange={e => setPlace(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-xl px-4 py-3 font-medium focus:outline-none focus:border-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold site-text-strong mb-2">Date & Time</label>
                                <input type="text" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-xl px-4 py-3 font-medium focus:outline-none focus:border-blue-500" placeholder="e.g. June 8, 10:15 AM" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold site-text-strong mb-2">Time Limit (Minutes)</label>
                                <input type="number" value={timeLimit} onChange={e => setTimeLimit(parseInt(e.target.value) || 0)} className="w-full bg-slate-50 border-2 border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-xl px-4 py-3 font-medium focus:outline-none focus:border-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold site-text-strong mb-2">Max Students</label>
                                <input type="number" value={maxStudents} onChange={e => setMaxStudents(parseInt(e.target.value) || 0)} className="w-full bg-slate-50 border-2 border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-xl px-4 py-3 font-medium focus:outline-none focus:border-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold site-text-strong mb-2">Auto-Lock Joins In (Mins)</label>
                                <input type="number" value={joinDeadlineMinutes} onChange={e => setJoinDeadlineMinutes(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-xl px-4 py-3 font-medium focus:outline-none focus:border-blue-500" placeholder="e.g. 15 (leave empty for no limit)" />
                            </div>
                        </div>

                        {/* Test Files & Answers */}
                        {customTests.length > 0 && (
                            <div>
                                <h3 className="text-xl font-black site-text-strong mb-4 pt-4 border-t border-slate-200 dark:border-slate-800">Review & Edit Test Files</h3>
                                <p className="text-sm site-text-muted mb-4">Click on a test to edit the correct answers for its questions.</p>
                                
                                <div className="space-y-4">
                                    {customTests.map((test) => (
                                        <div key={test.id} className="border-2 border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                                            <button 
                                                onClick={() => setExpandedTestId(expandedTestId === test.id ? null : test.id)}
                                                className="w-full px-6 py-4 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                            >
                                                <span className="font-bold site-text-strong">{test.name} <span className="text-sm font-normal site-text-muted ml-2">({test.questions.length} questions)</span></span>
                                                {expandedTestId === test.id ? <ChevronUp className="w-5 h-5 site-text-muted" /> : <ChevronDown className="w-5 h-5 site-text-muted" />}
                                            </button>
                                            
                                            <AnimatePresence>
                                                {expandedTestId === test.id && (
                                                    <motion.div 
                                                        initial={{ height: 0 }}
                                                        animate={{ height: 'auto' }}
                                                        exit={{ height: 0 }}
                                                        className="overflow-hidden bg-white dark:bg-slate-900"
                                                    >
                                                        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 border-t border-slate-200 dark:border-slate-700">
                                                            {test.questions.map((q, idx) => (
                                                                <div key={q.id} className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700">
                                                                    <span className="font-bold text-sm site-text-muted">Q{idx + 1}</span>
                                                                    <div className="flex gap-1">
                                                                        {['A', 'B', 'C', 'D'].map((opt, optIdx) => (
                                                                            <button
                                                                                key={opt}
                                                                                onClick={() => updateQuestionAnswer(test.id, q.id, optIdx)}
                                                                                className={`w-8 h-8 rounded text-sm font-bold flex items-center justify-center transition-colors ${
                                                                                    q.answer === optIdx 
                                                                                        ? 'bg-blue-600 text-white' 
                                                                                        : 'bg-white dark:bg-slate-700 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-600'
                                                                                }`}
                                                                            >
                                                                                {opt}
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-end gap-3 sticky bottom-0">
                        <button onClick={onClose} className="px-6 py-3 font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 transition-colors">
                            Cancel
                        </button>
                        <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-bold shadow-md shadow-blue-500/20 transition flex items-center gap-2">
                            <Save className="w-5 h-5" /> Save Changes
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
