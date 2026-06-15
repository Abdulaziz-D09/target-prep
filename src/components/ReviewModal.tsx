'use client';
import { useState, useMemo } from 'react';
import { X, CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PracticeTest } from '@/data/questions';
import { cleanOCR } from '@/components/PassageRenderer';
import DesmosCalculator from '@/components/DesmosCalculator';
import 'katex/dist/katex.min.css';
import renderMathInElement from 'katex/contrib/auto-render';
import { useEffect, useRef } from 'react';
import { LatexRenderer } from '@/components/LatexRenderer';

// Very basic markdown bold renderer for the rationale
function formatRationale(text: string) {
    return text.split('\n').map((line, i) => {
        const parts = line.split(/(\*\*.*?\*\*|\*.*?\*)/g).map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={j}>{part.slice(2, -2)}</strong>;
            }
            if (part.startsWith('*') && part.endsWith('*')) {
                return <em key={j}>{part.slice(1, -1)}</em>;
            }
            return part;
        });
        return <p key={i} className="mb-2">{parts}</p>;
    });
}

export interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    questionKey: string;
    testData: PracticeTest;
    userAnswers: Record<string, number | string>;
    onNavigate: (newKey: string) => void;
    allKeys: string[];
    testDate?: string;
}

export function ReviewModal({ isOpen, onClose, questionKey, testData, userAnswers, onNavigate, allKeys, testDate }: ReviewModalProps) {
    const [showExplanation, setShowExplanation] = useState(true);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (contentRef.current) {
            renderMathInElement(contentRef.current, {
                delimiters: [
                    { left: '$$', right: '$$', display: true },
                    { left: '$', right: '$', display: false },
                    { left: '\\(', right: '\\)', display: false },
                    { left: '\\[', right: '\\]', display: true }
                ],
                throwOnError: false
            });
        }
    }, [questionKey, showExplanation]);

    const qData = useMemo(() => {
        if (!questionKey) return null;
        const [sIdx, mIdx, qIdx] = questionKey.split('-').map(Number);
        const section = testData.sections[sIdx];
        const module = section?.modules[mIdx];
        const q = module?.questions[qIdx];
        if (!q) return null;
        return {
            sectionName: section.name,
            qNum: qIdx + 1,
            q,
            userAnswer: userAnswers[questionKey],
        };
    }, [questionKey, testData, userAnswers]);

    if (!isOpen || !qData) return null;

    const { q, sectionName, qNum, userAnswer } = qData;
    const isCorrect = userAnswer === q.answer;
    const isOmitted = userAnswer === undefined;
    const hasNext = allKeys.indexOf(questionKey) < allKeys.length - 1;
    const hasPrev = allKeys.indexOf(questionKey) > 0;

    const handleNext = () => {
        const idx = allKeys.indexOf(questionKey);
        if (idx < allKeys.length - 1) onNavigate(allKeys[idx + 1]);
    };

    const handlePrev = () => {
        const idx = allKeys.indexOf(questionKey);
        if (idx > 0) onNavigate(allKeys[idx - 1]);
    };

    const answerLetter = (idx: number) => String.fromCharCode(65 + idx);

    return (
        <AnimatePresence>
            <motion.div 
                className="fixed inset-0 z-50 bg-white flex flex-col font-sans"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.2 }}
            >
                {/* Header */}
                <header className="h-14 border-b border-slate-200 flex items-center justify-between px-6 shrink-0 bg-white">
                    <h1 className="font-bold text-[18px] text-slate-900">
                        {testData.title} {testDate ? `- ${testDate}` : ''}
                    </h1>
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col items-end">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-black">Knowledge and Skills: {sectionName}</span>
                            <div className="flex gap-0.5 mt-0.5">
                                {[...Array(7)].map((_, i) => (
                                    <div key={i} className={`h-1.5 w-6 rounded-sm ${i < (q.difficulty === 'Hard' ? 6 : q.difficulty === 'Medium' ? 4 : 2) ? 'bg-blue-600' : 'bg-slate-200'}`} />
                                ))}
                            </div>
                            <span className="text-[10px] text-black mt-0.5">Difficulty level: <span className="text-blue-600 font-bold">{q.difficulty || 'Medium'}</span></span>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </header>

                {/* Main Content */}
                <div className="flex-1 flex overflow-hidden bg-white" ref={contentRef}>
                    {/* Left Pane: Passage & Question */}
                    <div className="w-1/2 border-r border-slate-200 p-8 overflow-y-auto custom-scrollbar">
                        <h2 className="font-bold text-[17px] text-slate-900 mb-6">{sectionName}: Question {qNum}</h2>
                        
                        {q.passage && (
                            <div className="prose prose-sm max-w-none text-slate-600 mb-6">
                                <LatexRenderer text={cleanOCR(q.passage || '')} />
                            </div>
                        )}
                        {q.image && (
                            <div className="mb-4 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center">
                                <img src={q.image} alt="Question figure" className="max-w-full max-h-[200px] object-contain p-2" />
                            </div>
                        )}
                        <h4 className="text-[15px] font-medium text-slate-900 mb-4">
                            <LatexRenderer text={cleanOCR(q.question || '')} />
                        </h4>

                        <div className="space-y-3">
                            {q.options.map((opt, i) => (
                                <div key={i} className="flex text-[16px]">
                                    <span className="font-bold mr-3 text-black">{answerLetter(i)}.</span>
                                    <span className="text-black"><LatexRenderer text={cleanOCR(opt)} /></span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Pane: Rationale */}
                    <div className="w-1/2 p-8 overflow-y-auto custom-scrollbar bg-slate-50/50">
                        <h3 className="font-bold text-[16px] text-slate-900 mb-4">Answer</h3>
                        
                        {isOmitted ? (
                            <div className="bg-red-600 text-white px-5 py-3 rounded-lg font-medium text-[15px] mb-8">
                                You omitted this question. The correct answer is {typeof q.answer === 'number' ? answerLetter(q.answer) : q.answer}.
                            </div>
                        ) : (
                            <div className={`text-white px-5 py-3 rounded-lg font-medium text-[15px] mb-8 ${isCorrect ? 'bg-emerald-700' : 'bg-red-600'}`}>
                                You selected answer {typeof userAnswer === 'number' ? answerLetter(userAnswer) : userAnswer}. The correct answer is {typeof q.answer === 'number' ? answerLetter(q.answer) : q.answer}.
                            </div>
                        )}

                        {showExplanation && q.explanation && (
                            <>
                                <h3 className="font-bold text-[16px] text-slate-900 mb-4">Rationale</h3>
                                <div className="text-[15px] text-black leading-[1.7] whitespace-pre-wrap">
                                    {formatRationale(q.explanation)}
                                </div>
                            </>
                        )}
                        {showExplanation && !q.explanation && (
                            <p className="text-slate-900 italic">Detailed explanation not available.</p>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <footer className="h-16 border-t border-slate-200 flex items-center justify-between px-6 shrink-0 bg-white">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={showExplanation}
                            onChange={(e) => setShowExplanation(e.target.checked)}
                            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-[14px] text-black font-medium">Show correct answer and explanation</span>
                    </label>
                    <div className="flex gap-3">
                        <button 
                            onClick={handlePrev}
                            disabled={!hasPrev}
                            className="px-6 py-2 rounded-full font-bold text-[14px] bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            Previous
                        </button>
                        <button 
                            onClick={handleNext}
                            disabled={!hasNext}
                            className="px-6 py-2 rounded-full font-bold text-[14px] bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
                        >
                            Next
                        </button>
                    </div>
                </footer>
            </motion.div>
        </AnimatePresence>
    );
}
