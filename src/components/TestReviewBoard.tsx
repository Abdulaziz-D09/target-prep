'use client';
import React, { useState } from 'react';
import { Check, X, BookOpen, Target, ChevronDown, ChevronUp, AlertCircle, ArrowLeft, CheckCircle2, XCircle, Lightbulb, ChevronRight, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cleanOCR, PassageRenderer } from '@/components/PassageRenderer';
import { LatexRenderer } from '@/components/LatexRenderer';
import { CompletedTest } from '@/store/testStore';

interface TestReviewBoardProps {
    test: CompletedTest;
    onExit: () => void;
    title?: string;
}

export const BeautifulExplanation = ({ text }: { text: string }) => {
    if (!text) return null;

    const isStructured = text.includes('✅ Why') && text.includes('❌ Why');
    
    if (!isStructured) {
        const paragraphs = text.split('\n\n').filter(p => p.trim() !== '');
        return (
            <div className="space-y-4">
                {paragraphs.map((p, i) => {
                    const isCorrectParagraph = p.startsWith('Choice') && p.includes('best answer');
                    const isIncorrectParagraph = p.startsWith('Choice') && p.includes('incorrect');
                    
                    if (isCorrectParagraph) {
                        return (
                            <div key={i} className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 p-4 rounded-2xl relative overflow-hidden shadow-sm">
                                <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>
                                <div className="flex gap-3">
                                    <div className="mt-0.5"><CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /></div>
                                    <div className="text-emerald-900 dark:text-emerald-100 text-[15px] leading-relaxed"><LatexRenderer text={cleanOCR(p)} /></div>
                                </div>
                            </div>
                        );
                    } else if (isIncorrectParagraph) {
                        return (
                            <div key={i} className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 p-4 rounded-2xl relative overflow-hidden shadow-sm">
                                <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500"></div>
                                <div className="flex gap-3">
                                    <div className="mt-0.5"><XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" /></div>
                                    <div className="text-rose-900 dark:text-rose-100 text-[15px] leading-relaxed"><LatexRenderer text={cleanOCR(p)} /></div>
                                </div>
                            </div>
                        );
                    } else {
                        return (
                            <div key={i} className="text-slate-700 dark:text-slate-300 text-[15px] leading-relaxed px-4">
                                <LatexRenderer text={cleanOCR(p)} />
                            </div>
                        );
                    }
                })}
            </div>
        );
    }

    const lines = text.split('\n').filter(l => l.trim() !== '');
    
    let headerText = '';
    let answerText = '';
    let coreLogic = '';
    let correctSection: string[] = [];
    let incorrectSection: string[] = [];
    
    let currentMode = 'header';
    
    for (const line of lines) {
        if (line.includes('✅ Why')) {
            currentMode = 'correct';
            continue;
        } else if (line.includes('❌ Why')) {
            currentMode = 'incorrect';
            continue;
        } else if (line.startsWith('Core Logic:')) {
            coreLogic = line.replace('Core Logic:', '').trim();
            currentMode = 'skip';
            continue;
        } else if (line.startsWith('Answer:')) {
            answerText = line.replace('Answer:', '').trim();
            currentMode = 'skip';
            continue;
        }
        
        if (currentMode === 'header' && !line.startsWith('Answer:') && !line.startsWith('Core Logic:')) {
            headerText = line.trim();
        } else if (currentMode === 'correct') {
            correctSection.push(line);
        } else if (currentMode === 'incorrect') {
            incorrectSection.push(line);
        }
    }

    return (
        <div className="space-y-6">
            {(headerText || answerText || coreLogic) && (
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/40 dark:to-blue-900/20 border border-indigo-100 dark:border-indigo-800/60 rounded-3xl p-6 sm:p-8 shadow-sm">
                    {headerText && (
                        <div className="flex items-center gap-2 mb-4">
                            <GraduationCap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            <h4 className="font-bold text-indigo-900 dark:text-indigo-200 uppercase tracking-wider text-xs">{headerText}</h4>
                        </div>
                    )}
                    
                    {answerText && (
                        <div className="mb-5">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-xl border border-indigo-100 dark:border-indigo-800/50 shadow-sm">
                                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Correct Answer</span>
                                <span className="font-bold text-indigo-700 dark:text-indigo-400">{answerText}</span>
                            </div>
                        </div>
                    )}
                    
                    {coreLogic && (
                        <div className="flex gap-4">
                            <div className="shrink-0 mt-1">
                                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                                    <Lightbulb className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                </div>
                            </div>
                            <div>
                                <h5 className="font-bold text-indigo-900 dark:text-indigo-200 text-sm mb-1">Core Logic</h5>
                                <p className="text-indigo-800/80 dark:text-indigo-200/70 text-[15px] leading-relaxed">
                                    <LatexRenderer text={cleanOCR(coreLogic)} />
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {correctSection.length > 0 && (
                    <div className="bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-500/20 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-400 to-emerald-500"></div>
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center shrink-0">
                                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <h4 className="font-bold text-slate-900 dark:text-white text-lg">Why it's correct</h4>
                        </div>
                        <div className="space-y-3">
                            {correctSection.map((line, i) => (
                                <p key={i} className="text-slate-600 dark:text-slate-300 text-[15px] leading-relaxed">
                                    <LatexRenderer text={cleanOCR(line)} />
                                </p>
                            ))}
                        </div>
                    </div>
                )}
                
                {incorrectSection.length > 0 && (
                    <div className="bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-500/20 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-rose-400 to-rose-500"></div>
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center shrink-0">
                                <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                            </div>
                            <h4 className="font-bold text-slate-900 dark:text-white text-lg">Why others are wrong</h4>
                        </div>
                        <div className="space-y-4">
                            {incorrectSection.map((line, i) => (
                                <div key={i} className="flex gap-3">
                                    <div className="mt-1">
                                        <ChevronRight className="w-4 h-4 text-rose-400" />
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-300 text-[14px] leading-relaxed">
                                        <LatexRenderer text={cleanOCR(line)} />
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export function TestReviewBoard({ test, onExit, title = "Test Review" }: TestReviewBoardProps) {
    const [expandedImage, setExpandedImage] = useState<string | null>(null);
    const [expandedExplanations, setExpandedExplanations] = useState<Record<string, boolean>>({});

    const toggleExplanation = (id: string) => {
        setExpandedExplanations(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    return (
        <div className="min-h-screen bg-slate-50 relative">
            {/* Expanded Image Modal */}
            <AnimatePresence>
                {expandedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-12 cursor-zoom-out"
                        onClick={() => setExpandedImage(null)}
                    >
                        <motion.img
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.95 }}
                            src={expandedImage}
                            alt="Expanded view"
                            className="max-w-full max-h-full rounded-2xl shadow-2xl object-contain bg-white"
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onExit}
                            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h2 className="font-black text-slate-900 text-lg sm:text-xl tracking-tight">{title}</h2>
                    </div>
                    <div className="flex items-center gap-3 bg-indigo-50/50 px-4 py-1.5 rounded-full border border-indigo-100">
                        <Target className="w-4 h-4 text-indigo-600" />
                        <span className="font-bold text-indigo-900 text-sm">{test.totalScore} Score</span>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="space-y-16">
                    {((test as any).sections || []).map((sec: any, sIdx: number) => (
                                    <div key={sIdx} className="space-y-10">
                            {/* Section Header */}
                            <div className="flex items-center gap-4">
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight">{sec.name}</h3>
                                <div className="h-px flex-1 bg-slate-200"></div>
                            </div>

                            {sec.modules.map((mod: any, mIdx: number) => (
                                <div key={mIdx} className="space-y-8">
                                    <div className="inline-flex items-center gap-2 bg-slate-800 text-white px-4 py-1.5 rounded-lg font-bold text-sm shadow-md">
                                        Module {mIdx + 1}
                                    </div>

                                    {mod.questions.map((q: any, qIdx: number) => {
                                        const key = `${sIdx}-${mIdx}-${qIdx}`;
                                        const userAnswer = test.answers[key];
                                        const isNumeric = q.answerType === 'numeric';
                                        
                                        // For SPR (numeric), userAnswer is a string. For MC, it's a number.
                                        let isCorrect = false;
                                        let isOmitted = userAnswer === undefined || userAnswer === '';

                                        if (isNumeric) {
                                            if (Array.isArray(q.acceptableAnswers) && q.acceptableAnswers.length > 0) {
                                                isCorrect = !isOmitted && q.acceptableAnswers.includes(String(userAnswer).trim());
                                            } else {
                                                isCorrect = !isOmitted && String(userAnswer).trim() === String(q.answerText || q.answer).trim();
                                            }
                                        } else {
                                            isCorrect = userAnswer === q.answer;
                                        }

                                        const explanationOpen = expandedExplanations[q.id] || false;

                                        return (
                                            <div key={q.id} className={`bg-white rounded-3xl border-2 p-6 sm:p-8 shadow-sm transition-all duration-300 ${isCorrect ? 'border-emerald-100 hover:border-emerald-200 hover:shadow-emerald-100/50' : 'border-rose-100 hover:border-rose-200 hover:shadow-rose-100/50'}`}>
                                                
                                                {/* Status Bar */}
                                                <div className="flex flex-wrap gap-3 justify-between items-start mb-6">
                                                    <div className="flex items-center gap-3">
                                                        <span className="bg-slate-100 text-slate-600 font-extrabold px-3 py-1 rounded-md text-sm">Question {qIdx + 1}</span>
                                                        {isCorrect ? (
                                                            <span className="flex items-center gap-1.5 text-emerald-700 font-bold text-sm bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200 shadow-sm"><Check className="w-4 h-4" /> Correct</span>
                                                        ) : isOmitted ? (
                                                            <span className="flex items-center gap-1.5 text-slate-600 font-bold text-sm bg-slate-100 px-3 py-1 rounded-md border border-slate-200 shadow-sm"><AlertCircle className="w-4 h-4" /> Omitted</span>
                                                        ) : (
                                                            <span className="flex items-center gap-1.5 text-rose-700 font-bold text-sm bg-rose-50 px-3 py-1 rounded-md border border-rose-200 shadow-sm"><X className="w-4 h-4" /> Incorrect</span>
                                                        )}
                                                    </div>
                                                    {(q.domain || q.skill) && (
                                                        <div className="flex items-center gap-2">
                                                            {q.domain && <span className="text-xs font-bold uppercase tracking-wider text-indigo-500 bg-indigo-50 px-2 py-1 rounded-md">{q.domain}</span>}
                                                            {q.skill && <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-50 border border-slate-100 px-2 py-1 rounded-md">{q.skill}</span>}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Content Area */}
                                                <div className="grid lg:grid-cols-[1fr_minmax(400px,1fr)] gap-8 mb-8">
                                                    {/* Left: Passage / Images */}
                                                    {(q.passage || q.image) && (
                                                        <div className="space-y-6">
                                                            {q.passage && (
                                                                <div className="p-6 bg-slate-50/80 rounded-2xl border border-slate-200/60 site-text-reading prose max-w-none">
                                                                    <PassageRenderer text={q.passage} />
                                                                </div>
                                                            )}
                                                            {q.image && (
                                                                <div className="flex items-center justify-center">
                                                                    <img 
                                                                        src={q.image && !q.image.includes('.') ? q.image + '.png' : q.image} 
                                                                        alt="Question figure" 
                                                                        className="max-w-full max-h-[300px] object-contain cursor-zoom-in hover:opacity-90 transition-opacity" 
                                                                        onClick={() => setExpandedImage(q.image || null)}
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Right: Question Text & Options */}
                                                    <div className={`space-y-6 ${(q.passage || q.image) ? '' : 'lg:col-span-2'}`}>
                                                        <div className="prose max-w-none text-slate-900 font-medium text-lg leading-relaxed">
                                                            <LatexRenderer text={cleanOCR(q.question || '')} />
                                                        </div>

                                                        {/* Options / Answer */}
                                                        {isNumeric ? (
                                                            <div className="space-y-4 pt-4">
                                                                <div className="flex items-center gap-4 p-4 rounded-xl border-2 bg-slate-50 border-slate-200">
                                                                    <span className="font-bold text-slate-500">Your Answer:</span>
                                                                    <span className={`font-bold text-lg ${isCorrect ? 'text-emerald-600' : isOmitted ? 'text-slate-400' : 'text-rose-600'}`}>
                                                                        {isOmitted ? '(None)' : String(userAnswer)}
                                                                    </span>
                                                                </div>
                                                                {!isCorrect && (
                                                                    <div className="flex items-center gap-4 p-4 rounded-xl border-2 bg-emerald-50 border-emerald-200">
                                                                        <span className="font-bold text-emerald-700">Correct Answer:</span>
                                                                        <span className="font-bold text-lg text-emerald-800">
                                                                            {q.answerText || q.answer}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div className="space-y-3 pt-2">
                                                                {q.options?.map((opt: any, oIdx: number) => {
                                                                    const isThisCorrect = oIdx === q.answer;
                                                                    const isThisSelected = oIdx === userAnswer;
                                                                    
                                                                    let bgClass = "bg-white border-slate-200 text-slate-600";
                                                                    let dotClass = "bg-slate-100 border-slate-300 text-slate-500";

                                                                    if (isThisCorrect) {
                                                                        bgClass = "bg-emerald-50 border-emerald-500 text-emerald-900 shadow-[0_0_15px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500";
                                                                        dotClass = "bg-emerald-500 border-emerald-600 text-white shadow-sm";
                                                                    } else if (isThisSelected) {
                                                                        bgClass = "bg-rose-50 border-rose-400 text-rose-900";
                                                                        dotClass = "bg-rose-500 border-rose-600 text-white";
                                                                    }

                                                                    return (
                                                                        <div key={oIdx} className={`p-4 border-2 rounded-2xl flex items-start sm:items-center gap-4 transition-all ${bgClass}`}>
                                                                            <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border mt-0.5 sm:mt-0 ${dotClass}`}>
                                                                                {String.fromCharCode(65 + oIdx)}
                                                                            </div>
                                                                            <div className="font-medium flex-1 overflow-x-auto">
                                                                                <LatexRenderer text={cleanOCR(opt || '')} />
                                                                            </div>
                                                                            {isThisCorrect && (
                                                                                <div className="shrink-0 flex items-center gap-1.5 text-emerald-600 text-sm font-bold bg-white px-2 py-1 rounded-md border border-emerald-200/60 shadow-sm">
                                                                                    <Check className="w-4 h-4" /> <span className="hidden sm:inline">Correct</span>
                                                                                </div>
                                                                            )}
                                                                            {(isThisSelected && !isThisCorrect) && (
                                                                                <div className="shrink-0 flex items-center justify-center bg-white rounded-full p-1 border border-rose-200/60 shadow-sm">
                                                                                    <X className="text-rose-500 w-4 h-4" />
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Explanation Toggle */}
                                                {q.explanation && (
                                                    <div className="border-t border-slate-100 pt-6">
                                                        <button 
                                                            onClick={() => toggleExplanation(q.id)}
                                                            className="flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-700 transition-colors"
                                                        >
                                                            <BookOpen className="w-5 h-5" />
                                                            {explanationOpen ? 'Hide Explanation' : 'View Explanation'}
                                                            {explanationOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                                        </button>

                                                        <AnimatePresence>
                                                            {explanationOpen && (
                                                                <motion.div
                                                                    initial={{ height: 0, opacity: 0 }}
                                                                    animate={{ height: 'auto', opacity: 1 }}
                                                                    exit={{ height: 0, opacity: 0 }}
                                                                    transition={{ duration: 0.2 }}
                                                                    className="overflow-hidden"
                                                                >
                                                                    <div className="mt-4">
                                                                        <div className="max-w-none">
                                                                            <BeautifulExplanation text={q.explanation || ''} />
                                                                        </div>
                                                                    </div>
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
