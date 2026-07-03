import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PracticeTest } from '@/data/questions';
import { MockResult } from '@/store/classroomStore';

export function StudentMockResultModal({ isOpen, onClose, result, studentName, testData }: { isOpen: boolean, onClose: () => void, result: MockResult | null, studentName: string, testData: PracticeTest | null }) {
    if (!isOpen || !result || !testData) return null;

    const getAnswerLetter = (ans: any) => {
        if (typeof ans === 'number') return String.fromCharCode(65 + ans);
        return ans;
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden"
                >
                    <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
                        <div>
                            <h2 className="text-xl font-black site-text-strong">{studentName}'s Results</h2>
                            <p className="text-sm site-text-muted mt-1">{testData.title} • {result.score} points • {result.totalCorrect}/{result.totalQuestions} correct</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    
                    <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                            {(() => {
                                const isCustomTest = !testData.sections;
                                const testDataAny = testData as any;
                                const flatQuestions = isCustomTest 
                                    ? (testDataAny.questions || []).map((q: any, i: number) => ({ q, qKey: String(q.id || i), qIdx: i }))
                                    : testData.sections.flatMap((sec: any, sIdx: number) => 
                                        sec.modules.flatMap((mod: any, mIdx: number) => 
                                            mod.questions.map((q: any, qIdx: number) => ({ q, qKey: `${sIdx}-${mIdx}-${qIdx}`, qIdx }))
                                        )
                                    );

                                return flatQuestions.map(({ q, qKey, qIdx }: any) => {
                                    const userAnswer = result.answers?.[qKey];
                                    const isCorrect = userAnswer === q.answer;
                                    const isOmitted = userAnswer === undefined;
                                    
                                    return (
                                        <div key={qKey} className={`flex flex-col p-3 rounded-lg border ${isCorrect ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800/50' : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800/50'}`}>
                                            <div className="flex justify-between items-center mb-2">
                                                    <span className="font-bold text-xs site-text-muted">Q{qIdx + 1}</span>
                                                    {isCorrect ? (
                                                        <span className="text-[10px] uppercase font-black tracking-wider text-emerald-600 dark:text-emerald-400">Correct</span>
                                                    ) : (
                                                        <span className="text-[10px] uppercase font-black tracking-wider text-red-600 dark:text-red-400">Incorrect</span>
                                                    )}
                                                </div>
                                                <div className="flex justify-between text-sm font-medium">
                                                    <span className="site-text-strong">
                                                        <span className="site-text-muted text-xs mr-1">Student:</span> 
                                                        {isOmitted ? '--' : getAnswerLetter(userAnswer)}
                                                    </span>
                                                    <span className="site-text-strong text-emerald-600 dark:text-emerald-400">
                                                        <span className="site-text-muted text-xs mr-1">Ans:</span> 
                                                        {getAnswerLetter(q.answer)}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    });
                            })()}
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
