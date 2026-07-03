import React, { useState } from 'react';
import { Question } from '@/data/questions';
import { Edit3, Check, X, ChevronDown, ChevronUp } from 'lucide-react';

interface QuestionEditorProps {
    questions: Question[];
    onSave: (questionId: string, updatedQuestion: Question) => void;
}

export function QuestionEditor({ questions, onSave }: QuestionEditorProps) {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    return (
        <div className="space-y-4">
            {questions.map((q, idx) => (
                <QuestionEditorCard 
                    key={q.id} 
                    idx={idx} 
                    question={q} 
                    isExpanded={expandedId === q.id}
                    onToggle={() => setExpandedId(expandedId === q.id ? null : q.id)}
                    onSave={(updated) => {
                        onSave(q.id, updated);
                        setExpandedId(null);
                    }}
                />
            ))}
        </div>
    );
}

function QuestionEditorCard({ 
    idx, 
    question, 
    isExpanded, 
    onToggle, 
    onSave 
}: { 
    idx: number; 
    question: Question; 
    isExpanded: boolean; 
    onToggle: () => void;
    onSave: (q: Question) => void;
}) {
    const [draft, setDraft] = useState<Question>(question);

    const handleSave = () => {
        onSave(draft);
    };

    const handleCancel = () => {
        setDraft(question);
        onToggle();
    };

    return (
        <div className="site-panel rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
            {/* Header / Summary */}
            <button 
                onClick={onToggle}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
                <div className="flex items-center gap-4 text-left">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-black text-sm shrink-0">
                        {idx + 1}
                    </span>
                    <div>
                        <p className="font-bold site-text-strong text-sm line-clamp-1 break-all">
                            {question.passage ? question.passage.slice(0, 80) + '...' : (question.question || '').slice(0, 80) + '...'}
                        </p>
                        <p className="text-xs site-text-muted mt-0.5">
                            {question.type} • {question.difficulty}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    <div className="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 dark:bg-slate-800 site-text-muted hidden sm:block">
                        Answer: {typeof question.answer === 'number' ? String.fromCharCode(65 + question.answer) : question.answer}
                    </div>
                    {isExpanded ? <ChevronUp className="w-5 h-5 site-text-muted" /> : <ChevronDown className="w-5 h-5 site-text-muted" />}
                </div>
            </button>

            {/* Editor Body */}
            {isExpanded && (
                <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 space-y-5">
                    
                    {/* Passage Editor */}
                    {(draft.passage !== undefined) && (
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider site-text-muted mb-2">Passage</label>
                            <textarea 
                                value={draft.passage}
                                onChange={(e) => setDraft({ ...draft, passage: e.target.value })}
                                className="w-full h-40 p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 site-text text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-y"
                            />
                        </div>
                    )}

                    {/* Image Editor */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider site-text-muted mb-2">Image URL (Optional)</label>
                        <input 
                            type="text"
                            value={draft.image || ''}
                            onChange={(e) => setDraft({ ...draft, image: e.target.value })}
                            placeholder="https://example.com/image.png"
                            className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 site-text text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                        {draft.image && (
                            <div className="mt-3 p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 inline-block">
                                <img src={draft.image} alt="Preview" className="max-h-32 object-contain" />
                            </div>
                        )}
                    </div>

                    {/* Question Text Editor */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider site-text-muted mb-2">Question Text</label>
                        <textarea 
                            value={draft.question}
                            onChange={(e) => setDraft({ ...draft, question: e.target.value })}
                            className="w-full h-24 p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 site-text text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-y"
                        />
                    </div>

                    {/* Options Editor */}
                    {draft.options && draft.options.length > 0 && (
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider site-text-muted mb-2">Answer Choices</label>
                            <div className="space-y-3">
                                {draft.options.map((opt, i) => (
                                    <div key={i} className="flex gap-3 items-start">
                                        <div className="w-8 h-8 shrink-0 flex items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-800 font-bold text-sm">
                                            {String.fromCharCode(65 + i)}
                                        </div>
                                        <textarea
                                            value={opt}
                                            onChange={(e) => {
                                                const newOpts = [...draft.options!];
                                                newOpts[i] = e.target.value;
                                                setDraft({ ...draft, options: newOpts });
                                            }}
                                            className="w-full h-16 p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 site-text text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Correct Answer Editor */}
                    <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between pt-2">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider site-text-muted mb-2">Correct Answer</label>
                            {draft.options && draft.options.length > 0 ? (
                                <select 
                                    value={draft.answer}
                                    onChange={(e) => setDraft({ ...draft, answer: parseInt(e.target.value) })}
                                    className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 site-text text-sm focus:ring-2 focus:ring-indigo-500 outline-none min-w-[120px]"
                                >
                                    {draft.options.map((_, i) => (
                                        <option key={i} value={i}>Choice {String.fromCharCode(65 + i)}</option>
                                    ))}
                                </select>
                            ) : (
                                <input 
                                    type="text"
                                    value={draft.answer}
                                    onChange={(e) => setDraft({ ...draft, answer: e.target.value })}
                                    className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 site-text text-sm focus:ring-2 focus:ring-indigo-500 outline-none min-w-[120px]"
                                />
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={handleCancel}
                                className="px-4 py-2 rounded-xl font-bold text-sm site-text-muted hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSave}
                                className="px-5 py-2 rounded-xl font-bold text-sm bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-md"
                            >
                                <Check className="w-4 h-4" /> Save Changes
                            </button>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}
