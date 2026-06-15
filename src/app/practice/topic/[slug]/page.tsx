'use client';

import { useState, useEffect, use, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, ChevronRight, XCircle, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { LatexRenderer } from '@/components/LatexRenderer';
import { FloatingPageShapes } from '@/components/SiteMotion';
import { saveToHistory } from '@/lib/userHistory';

type Question = {
    id: number;
    passage: string | null;
    stem: string;
    options: string[];
    answer: string;
    explanation: string;
};

export default function TopicPracticePage({ params }: { params: Promise<{ slug: string }> }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // Resolve params using React.use()
    const resolvedParams = use(params);
    const titleParam = searchParams.get('title') || resolvedParams.slug.replace(/-/g, ' ');

    const [questions, setQuestions] = useState<Question[]>([]);
    const [topicType, setTopicType] = useState<'Math' | 'English' | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
    const [isFinished, setIsFinished] = useState(false);

    const savedRef = useRef(false);

    useEffect(() => {
        async function loadQuestions() {
            try {
                const res = await fetch('/api/generate-topic-practice', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ topic: titleParam })
                });

                const data = await res.json();
                if (!res.ok || !data.success) {
                    throw new Error(data.error || 'Failed to generate questions');
                }

                setQuestions(data.data.questions);
                setTopicType(data.data.type || 'English');
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        loadQuestions();
    }, [titleParam]);

    useEffect(() => {
        if (isFinished && questions.length > 0 && !savedRef.current) {
            savedRef.current = true;
            const correctCount = questions.filter((q, i) => selectedAnswers[i] === q.answer).length;
            saveToHistory('complete_topic_practice', {
                topic: titleParam,
                slug: resolvedParams.slug,
                correct: correctCount,
                total: questions.length,
                accuracy: Math.round((correctCount / questions.length) * 100),
            });
        }
    }, [isFinished, questions, selectedAnswers, titleParam, resolvedParams.slug]);

    const handleSelectOption = (option: string) => {
        if (isFinished) return;
        setSelectedAnswers({ ...selectedAnswers, [currentIndex]: option });
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setIsFinished(true);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f8f9fa] text-slate-900 flex flex-col items-center justify-center p-6 relative">
                <FloatingPageShapes theme="practice" />
                <div className="z-10 flex flex-col items-center max-w-md text-center">
                    <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/20">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                    </div>
                    <h2 className="text-2xl font-black mb-2">Generating Questions...</h2>
                    <p className="text-slate-500 font-medium">
                        Our AI is crafting 5 authentic SAT practice questions tailored to <strong>{titleParam}</strong>.
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#f8f9fa] text-slate-900 flex flex-col items-center justify-center p-6 relative">
                <FloatingPageShapes theme="practice" />
                <div className="z-10 bg-white rounded-[32px] p-8 max-w-md text-center border-red-500/20 shadow-red-500/10 border">
                    <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 mx-auto text-red-500 border border-red-500/20">
                        <XCircle className="w-8 h-8" />
                    </div>
                    <h2 className="text-xl font-black mb-2 text-red-600">Generation Failed</h2>
                    <p className="text-slate-500 font-medium mb-8 text-sm">{error}</p>
                    <button 
                        onClick={() => router.push('/study-plan')}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-xl font-bold transition"
                    >
                        Return to Study Plan
                    </button>
                </div>
            </div>
        );
    }

    if (isFinished) {
        const correctCount = questions.filter((q, i) => selectedAnswers[i] === q.answer).length;
        
        return (
            <div className="min-h-screen bg-[#f8f9fa] text-slate-900 pt-4 pb-12 px-4 sm:px-6 relative">
                <FloatingPageShapes theme="practice" />
                <div className="max-w-4xl mx-auto z-10 relative">
                    <button 
                        onClick={() => router.push('/study-plan')}
                        className="mb-6 flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Study Plan
                    </button>

                    <div className="bg-white rounded-[32px] p-8 sm:p-12 mb-8 text-center border-emerald-500/20 shadow-emerald-500/10 shadow-2xl relative overflow-hidden border">
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mb-6 text-emerald-500 border border-emerald-500/20 shadow-inner">
                                <Sparkles className="w-10 h-10" />
                            </div>
                            <h1 className="text-4xl font-black mb-3">Topic Mastered!</h1>
                            <p className="text-lg text-slate-500 font-medium mb-8">You scored {correctCount} out of {questions.length} on {titleParam}</p>
                            
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={() => window.location.reload()}
                                    className="bg-[linear-gradient(135deg,#2563eb,#3b82f6)] text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:scale-105 transition"
                                >
                                    Generate New Set
                                </button>
                            </div>
                        </div>
                    </div>

                    <h3 className="text-2xl font-black mb-6 px-2">Review Answers</h3>
                    <div className="space-y-6">
                        {questions.map((q, i) => {
                            const isCorrect = selectedAnswers[i] === q.answer;
                            return (
                                <div key={i} className={`bg-white rounded-[24px] overflow-hidden border-2 transition-all ${isCorrect ? 'border-emerald-500/30 shadow-emerald-500/5' : 'border-red-500/30 shadow-red-500/5'}`}>
                                    <div className={`px-6 py-3 border-b flex items-center justify-between ${isCorrect ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                                        <div className="flex items-center gap-2">
                                            {isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
                                            <span className={`font-bold ${isCorrect ? 'text-emerald-600' : 'text-red-600'}`}>Question {i + 1}</span>
                                        </div>
                                    </div>
                                    <div className="p-6 md:p-8">
                                        {q.passage && (
                                            <div className="mb-6 p-5 bg-slate-50 rounded-2xl border border-slate-200/50">
                                                <LatexRenderer text={q.passage} />
                                            </div>
                                        )}
                                        <div className="font-semibold text-lg mb-6">
                                            <LatexRenderer text={q.stem} />
                                        </div>
                                        
                                        <div className="grid gap-3 mb-8">
                                            {q.options.map((opt, j) => {
                                                const letter = ['A', 'B', 'C', 'D'][j];
                                                let style = "border-slate-200 bg-white shadow-sm text-slate-600";
                                                if (opt === q.answer) {
                                                    style = "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm";
                                                } else if (opt === selectedAnswers[i]) {
                                                    style = "border-red-500 bg-red-50 text-red-700 shadow-sm";
                                                }

                                                return (
                                                    <div key={j} className={`flex items-start gap-4 p-4 rounded-xl border-2 ${style}`}>
                                                        <div className={`w-8 h-8 flex-shrink-0 rounded-lg flex items-center justify-center font-bold text-sm ${opt === q.answer ? 'bg-emerald-500 text-white' : opt === selectedAnswers[i] ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                                            {letter}
                                                        </div>
                                                        <div className="pt-1">
                                                            <LatexRenderer text={opt} />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100">
                                            <h4 className="font-bold text-sm text-blue-600 uppercase tracking-wider mb-2">Explanation</h4>
                                            <div className="text-slate-700 leading-relaxed text-[15px]">
                                                <LatexRenderer text={q.explanation} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentIndex];
    const isAnswered = !!selectedAnswers[currentIndex];

    return (
        <div className="min-h-screen bg-[#f8f9fa] text-slate-900 flex flex-col transition-colors duration-300 relative">
            {/* Header */}
            <header className="h-[70px] border-b border-slate-200 flex items-center justify-between px-8 shrink-0 bg-white/90 backdrop-blur-xl z-20 sticky top-0 shadow-sm">
                <button 
                    onClick={() => router.push('/study-plan')}
                    className="flex items-center gap-2 text-[15px] font-bold text-slate-500 hover:text-slate-800 transition bg-slate-100 px-4 py-2 rounded-full"
                >
                    <ArrowLeft className="w-5 h-5" /> Exit
                </button>
                <div className="font-black text-[15px] tracking-wide text-slate-800 uppercase">
                    {titleParam}
                </div>
                <div className="font-bold text-[15px] text-slate-500 bg-slate-100 px-4 py-1.5 rounded-full">
                    Question {currentIndex + 1} of {questions.length}
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 flex overflow-hidden">
                {topicType === 'English' ? (
                    <div className="flex-1 flex w-full">
                        {/* Left Pane (Passage) */}
                        <div className="w-1/2 border-r border-slate-200 overflow-y-auto px-10 py-8 bg-white/60">
                            {currentQuestion.passage ? (
                                <div className="text-[17px] leading-[1.8] text-slate-800 font-serif">
                                    <LatexRenderer text={currentQuestion.passage} />
                                </div>
                            ) : (
                                <p className="text-[15px] text-slate-400 font-medium">No passage for this question.</p>
                            )}
                        </div>

                        {/* Right Pane (Question & Options) */}
                        <div className="w-1/2 overflow-y-auto px-10 py-8 relative">
                            <motion.div 
                                key={currentIndex}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="max-w-xl mx-auto relative pl-12"
                            >
                                <div className="absolute left-0 top-0 bg-slate-900 text-white inline-flex items-center justify-center min-w-[28px] h-[28px] rounded px-2 text-[15px] font-bold shadow-sm mt-0.5">
                                    {currentIndex + 1}
                                </div>
                                <h2 className="text-[18px] font-semibold mb-8 text-slate-900 leading-relaxed">
                                    <LatexRenderer text={currentQuestion.stem} />
                                </h2>

                                <motion.div 
                                    className="space-y-4 mt-8"
                                    initial="hidden"
                                    animate="visible"
                                    variants={{
                                        hidden: { opacity: 0 },
                                        visible: {
                                            opacity: 1,
                                            transition: { staggerChildren: 0.1 }
                                        }
                                    }}
                                >
                                    {currentQuestion.options.map((opt, i) => {
                                        const isSelected = selectedAnswers[currentIndex] === opt;
                                        const letter = ['A', 'B', 'C', 'D'][i];
                                        return (
                                            <motion.button
                                                key={i}
                                                variants={{
                                                    hidden: { opacity: 0, y: 10 },
                                                    visible: { opacity: 1, y: 0 }
                                                }}
                                                onClick={() => handleSelectOption(opt)}
                                                className={`w-full flex items-start p-5 rounded-[20px] border-2 transition-all duration-300 text-left group bg-white ${
                                                    isSelected 
                                                        ? 'border-blue-500 bg-blue-50/50 shadow-[0_0_20px_rgba(59,130,246,0.15)] ring-1 ring-blue-500/50' 
                                                        : 'border-slate-200 hover:border-blue-400/50 hover:bg-slate-50'
                                                }`}
                                            >
                                                <div className={`w-8 h-8 flex-shrink-0 rounded-full border-2 flex items-center justify-center font-bold mr-4 ${
                                                    isSelected 
                                                        ? 'border-blue-600 bg-blue-600 text-white' 
                                                        : 'border-slate-300 text-slate-600'
                                                }`}>
                                                    {letter}
                                                </div>
                                                <div className="pt-1 flex-1 text-[16px] text-slate-700">
                                                    <LatexRenderer text={opt} />
                                                </div>
                                            </motion.button>
                                        );
                                    })}
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto px-6 py-8">
                        <motion.div 
                            key={currentIndex}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="max-w-3xl mx-auto"
                        >
                            {currentQuestion.passage && (
                                <div className="text-[17px] leading-[1.8] text-slate-800 font-serif mb-8 border-l-4 border-slate-300 pl-6 bg-white/60 py-4 pr-4 rounded-r-2xl">
                                    <LatexRenderer text={currentQuestion.passage} />
                                </div>
                            )}

                            <div className="relative pl-12">
                                <div className="absolute left-0 top-0 bg-slate-900 text-white inline-flex items-center justify-center min-w-[28px] h-[28px] rounded px-2 text-[15px] font-bold shadow-sm mt-0.5">
                                    {currentIndex + 1}
                                </div>
                                <h2 className="text-[18px] font-semibold mb-8 text-slate-900 leading-relaxed">
                                    <LatexRenderer text={currentQuestion.stem} />
                                </h2>

                            <motion.div 
                                className="space-y-4 max-w-xl"
                                initial="hidden"
                                animate="visible"
                                variants={{
                                    hidden: { opacity: 0 },
                                    visible: {
                                        opacity: 1,
                                        transition: { staggerChildren: 0.1 }
                                    }
                                }}
                            >
                                {currentQuestion.options.map((opt, i) => {
                                    const isSelected = selectedAnswers[currentIndex] === opt;
                                    const letter = ['A', 'B', 'C', 'D'][i];
                                    return (
                                        <motion.button
                                            key={i}
                                            variants={{
                                                hidden: { opacity: 0, y: 10 },
                                                visible: { opacity: 1, y: 0 }
                                            }}
                                            onClick={() => handleSelectOption(opt)}
                                            className={`w-full flex items-start p-5 rounded-[20px] border-2 transition-all duration-300 text-left group bg-white ${
                                                isSelected 
                                                    ? 'border-blue-500 bg-blue-50/50 shadow-[0_0_20px_rgba(59,130,246,0.15)] ring-1 ring-blue-500/50' 
                                                    : 'border-slate-200 hover:border-blue-400/50 hover:bg-slate-50'
                                            }`}
                                        >
                                            <div className={`w-8 h-8 flex-shrink-0 rounded-full border-2 flex items-center justify-center font-bold mr-4 ${
                                                isSelected 
                                                    ? 'border-blue-600 bg-blue-600 text-white' 
                                                    : 'border-slate-300 text-slate-600'
                                            }`}>
                                                {letter}
                                            </div>
                                            <div className="pt-1 flex-1 text-[16px] text-slate-700">
                                                <LatexRenderer text={opt} />
                                            </div>
                                        </motion.button>
                                    );
                                })}
                            </motion.div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="h-[80px] border-t border-slate-200 bg-white/90 px-8 flex items-center justify-end shrink-0 backdrop-blur-xl z-20 sticky bottom-0 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
                <button
                    onClick={handleNext}
                    disabled={!isAnswered}
                    className={`flex items-center justify-center px-10 h-14 rounded-full font-bold text-[16px] transition-all duration-300 shadow-sm ${
                        isAnswered
                            ? 'bg-[linear-gradient(135deg,#2563eb,#3b82f6)] text-white hover:scale-105 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] cursor-pointer'
                            : 'bg-slate-200/50 text-slate-400 cursor-not-allowed'
                    }`}
                >
                    {currentIndex === questions.length - 1 ? 'Finish Practice' : 'Next'}
                </button>
            </footer>
        </div>
    );
}
