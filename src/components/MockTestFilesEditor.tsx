import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Save, X } from 'lucide-react';

export function MockTestFilesEditor({ initialTests, onSave, onChange, hideSaveButton }: { initialTests: any[], onSave: (tests: any[]) => void, onChange?: (tests: any[]) => void, hideSaveButton?: boolean }) {
    const [customTests, setCustomTests] = useState(initialTests || []);
    
    useEffect(() => {
        setCustomTests(initialTests || []);
    }, [initialTests]);

    const handleUpdate = (updater: (prev: any[]) => any[]) => {
        const next = updater(customTests);
        setCustomTests(next);
        if (onChange) onChange(next);
    };

    const [expandedTestId, setExpandedTestId] = useState<string | null>(null);
    const prevLengthRef = useRef(initialTests?.length || 0);

    useEffect(() => {
        if (customTests.length > prevLengthRef.current) {
            setExpandedTestId(customTests[customTests.length - 1].id);
        }
        prevLengthRef.current = customTests.length;
    }, [customTests.length]);

    const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);
    const [uploadingImageId, setUploadingImageId] = useState<string | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const updateQuestionAnswer = (testId: string, questionId: string, newAnswerIdx: number) => {
        handleUpdate(prev => prev.map(test => {
            if (test.id !== testId) return test;
            return {
                ...test,
                questions: test.questions.map((q: any) => 
                    q.id === questionId ? { ...q, answer: newAnswerIdx } : q
                )
            };
        }));
    };

    const updateQuestionContent = (testId: string, questionId: string, field: string, value: any) => {
        handleUpdate(prev => prev.map(test => {
            if (test.id !== testId) return test;
            return {
                ...test,
                questions: test.questions.map((q: any) => 
                    q.id === questionId ? { ...q, [field]: value } : q
                )
            };
        }));
    };

    const updateQuestionOption = (testId: string, questionId: string, optionIndex: number, newValue: string) => {
        handleUpdate(prev => prev.map(test => {
            if (test.id !== testId) return test;
            return {
                ...test,
                questions: test.questions.map((q: any) => {
                    if (q.id !== questionId) return q;
                    const newOptions = [...(q.options || ['', '', '', ''])];
                    newOptions[optionIndex] = newValue;
                    return { ...q, options: newOptions };
                })
            };
        }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, testId: string, questionId: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadError(null);
        setUploadingImageId(`${testId}-${questionId}`);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload-image', {
                method: 'POST',
                body: formData
            });

            if (!res.ok) {
                let errMsg = `Upload failed (server error ${res.status})`;
                try {
                    const errData = await res.json();
                    if (errData.error) errMsg = errData.error;
                } catch (_) {}
                setUploadError(errMsg);
                return;
            }

            const data = await res.json();
            
            if (data.url) {
                updateQuestionContent(testId, questionId, 'imageUrl', data.url);
                updateQuestionContent(testId, questionId, 'imagePosition', 'before-stem');
                setUploadError(null);
            } else {
                setUploadError('Upload succeeded but no URL was returned. Please try again.');
            }
        } catch (err) {
            console.error('Failed to upload image', err);
            setUploadError('Network error — could not reach the server. Please check your connection.');
        } finally {
            setUploadingImageId(null);
            if (e.target) e.target.value = '';
        }
    };

    const addQuestion = (testId: string) => {
        handleUpdate(prev => prev.map(test => {
            if (test.id !== testId) return test;
            return {
                ...test,
                questions: [...test.questions, {
                    id: `mock-q-${Date.now()}-${test.questions.length}`,
                    passage: '',
                    question: '',
                    options: ['', '', '', ''],
                    answer: null
                }]
            };
        }));
    };

    const deleteQuestion = (testId: string, questionId: string) => {
        handleUpdate(prev => prev.map(test => {
            if (test.id !== testId) return test;
            return {
                ...test,
                questions: test.questions.filter((q: any) => q.id !== questionId)
            };
        }));
    };

    const deleteTest = (testId: string) => {
        handleUpdate(prev => prev.filter(test => test.id !== testId));
    };

    let expandedTestData: any = null;
    let expandedQuestionData: any = null;
    let expandedQuestionIdx = -1;

    if (expandedQuestionId) {
        for (const test of customTests) {
            if (!test.questions) continue;
            const qIdx = test.questions.findIndex((q: any) => `${test.id}-${q.id}` === expandedQuestionId);
            if (qIdx !== -1) {
                expandedTestData = test;
                expandedQuestionData = test.questions[qIdx];
                expandedQuestionIdx = qIdx;
                break;
            }
        }
    }

    if (customTests.length === 0) {
        return (
            <div className="p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-slate-500">
                No custom tests assigned to this mock session yet.
            </div>
        );
    }

    return (
        <div className="site-panel rounded-[32px] p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">
                <div>
                    <h3 className="text-xl font-black site-text-strong mb-1">Review & Edit Test Files</h3>
                    <p className="text-sm site-text-muted">Click on a test to edit the correct answers and content for its questions.</p>
                </div>
                {!hideSaveButton && <button type="button" onClick={() => onSave(customTests)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-bold shadow-md shadow-blue-500/20 transition flex items-center gap-2">
                    <Save className="w-4 h-4" /> Save Changes
                </button>}
            </div>
            
            <div className="space-y-4">
                {customTests.map((test: any) => {
                    const isMultiple = customTests.length > 1;
                    const isExpanded = !isMultiple || expandedTestId === test.id;

                    return (
                    <div key={test.id} className="border-2 border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                        <div 
                            className={`w-full px-6 py-4 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 ${isMultiple ? 'cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800' : ''}`}
                            onClick={() => isMultiple && setExpandedTestId(isExpanded ? null : test.id)}
                        >
                            <span className="font-bold site-text-strong">{test.name} <span className="text-sm font-normal site-text-muted ml-2">({test.questions?.length || 0} questions)</span></span>
                            <div className="flex items-center gap-3">
                                <button 
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); deleteTest(test.id); }}
                                    className="text-xs px-3 py-1.5 rounded-lg font-bold bg-red-500 hover:bg-red-600 text-white transition-colors"
                                >
                                    Delete Test
                                </button>
                                {isMultiple && (isExpanded ? <ChevronUp className="w-5 h-5 site-text-muted" /> : <ChevronDown className="w-5 h-5 site-text-muted" />)}
                            </div>
                        </div>
                        
                        <AnimatePresence>
                        {isExpanded && test.questions && (
                            <motion.div 
                                key={`content-${test.id}`}
                                initial={{ height: 0 }}
                                animate={{ height: 'auto' }}
                                exit={{ height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden bg-white dark:bg-slate-900"
                            >
                                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 items-start border-t border-slate-200 dark:border-slate-700">
                                        {test.questions.map((q: any, idx: number) => {
                                            const isExpanded = expandedQuestionId === `${test.id}-${q.id}`;
                                            
                                            return (
                                                <motion.div 
                                                    key={q.id} 
                                                    onClick={() => setExpandedQuestionId(isExpanded ? null : `${test.id}-${q.id}`)}
                                                    className={`flex flex-col bg-slate-50 dark:bg-slate-800 rounded-lg border overflow-hidden cursor-pointer transition-all hover:shadow-md self-start ${isExpanded ? 'border-blue-500 ring-2 ring-blue-500 shadow-blue-500/20' : 'border-slate-200 dark:border-slate-700 hover:border-blue-400'}`}
                                                    style={{ alignSelf: 'start' }}
                                                >
                                                    <div className="flex items-center justify-between px-4 py-3">
                                                        <span className="font-bold text-sm site-text-muted">Q{idx + 1}</span>
                                                        <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                                                            {q.type === 'Math (SPR)' ? (
                                                                <span className="text-xs font-bold px-3 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-500 rounded-md">SPR</span>
                                                            ) : (
                                                                ['A', 'B', 'C', 'D'].map((opt, optIdx) => (
                                                                    <button
                                                                        type="button"
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
                                                                ))
                                                            )}
                                                        </div>
                                                    </div>
                                                    
                                                    
                                                </motion.div>
                                            );
                                        })}
                                        
                                        <button
                                            type="button"
                                            onClick={() => addQuestion(test.id)}
                                            className="flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 cursor-pointer transition-colors hover:border-slate-400 dark:hover:border-slate-500 min-h-[80px]"
                                        >
                                            <span className="font-bold text-sm site-text-muted mb-1">+ Add Question</span>
                                        </button>
                                </div>
                            </motion.div>
                        )}
                        </AnimatePresence>
                    </div>
                );
                })}
            </div>

            {/* Expanded Question Modal Overlay */}
            <AnimatePresence>
                {expandedQuestionData && expandedTestData && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                            onClick={() => setExpandedQuestionId(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-200 dark:border-slate-800"
                        >
                            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900 shrink-0">
                                <h3 className="font-black text-lg site-text-strong">
                                    Edit Question {expandedQuestionIdx + 1}
                                </h3>
                                <button onClick={() => setExpandedQuestionId(null)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
                                    <X className="w-5 h-5 site-text-muted" />
                                </button>
                            </div>
                            <div className="p-6 overflow-y-auto">
<div className="space-y-4 site-text text-sm">
                                                                    <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-colors">
                                                                        <h4 className="font-bold text-[10px] uppercase tracking-wider site-text-muted mb-2">Passage</h4>
                                                                        <textarea 
                                                                            value={expandedQuestionData.passage || ''} 
                                                                            onChange={e => updateQuestionContent(expandedTestData.id, expandedQuestionData.id, 'passage', e.target.value)}
                                                                            placeholder="Enter passage text here..."
                                                                            className="w-full bg-transparent resize-y min-h-[80px] focus:outline-none site-text-strong leading-relaxed"
                                                                        />
                                                                    </div>
                                                                    
                                                                    <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 transition-colors">
                                                                        <div className="flex items-center justify-between mb-2">
                                                                            <h4 className="font-bold text-[10px] uppercase tracking-wider site-text-muted">Image (Optional)</h4>
                                                                        </div>
                                                                        <div className="flex items-center gap-4">
                                                                            <label className="cursor-pointer relative overflow-hidden px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-sm font-bold rounded-lg transition-colors site-text-strong inline-block">
                                                                                {uploadingImageId === `${expandedTestData.id}-${expandedQuestionData.id}` ? 'Uploading...' : 'Upload Image'}
                                                                                <input 
                                                                                    type="file" 
                                                                                    accept="image/*"
                                                                                    onChange={e => handleImageUpload(e, expandedTestData.id, expandedQuestionData.id)}
                                                                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                                                                    disabled={uploadingImageId === `${expandedTestData.id}-${expandedQuestionData.id}`}
                                                                                />
                                                                            </label>
                                                                            {expandedQuestionData.imageUrl && (
                                                                                <button 
                                                                                    type="button"
                                                                                    onClick={() => updateQuestionContent(expandedTestData.id, expandedQuestionData.id, 'imageUrl', null)}
                                                                                    className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors"
                                                                                >
                                                                                    Remove Image
                                                                                </button>
                                                                            )}
                                                                        </div>
                                                                        {uploadError && uploadingImageId === null && (
                                                                            <p className="mt-2 text-xs font-bold text-red-500 bg-red-50 dark:bg-red-500/10 px-3 py-2 rounded-lg border border-red-200 dark:border-red-500/20">{uploadError}</p>
                                                                        )}
                                                                        {expandedQuestionData.imageUrl && (
                                                                            <>
                                                                                <img src={expandedQuestionData.imageUrl && !expandedQuestionData.imageUrl.includes('.') ? expandedQuestionData.imageUrl + '.png' : expandedQuestionData.imageUrl} alt="Question figure" className="max-w-full rounded-lg max-h-48 object-contain mt-3 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50" />
                                                                                <div className="mt-2 flex items-center gap-2">
                                                                                    <span className="text-[11px] font-bold uppercase tracking-wider site-text-muted">Image position:</span>
                                                                                    {(['before-stem', 'after-stem'] as const).map((pos) => (
                                                                                        <button
                                                                                            key={pos}
                                                                                            type="button"
                                                                                            onClick={() => updateQuestionContent(expandedTestData.id, expandedQuestionData.id, 'imagePosition', pos)}
                                                                                            className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-colors ${
                                                                                                (expandedQuestionData.imagePosition || 'before-stem') === pos
                                                                                                    ? 'bg-blue-600 text-white'
                                                                                                    : 'bg-slate-100 dark:bg-slate-700 site-text-muted hover:bg-slate-200 dark:hover:bg-slate-600'
                                                                                            }`}
                                                                                        >
                                                                                            {pos === 'before-stem' ? 'Before Question' : 'After Question'}
                                                                                        </button>
                                                                                    ))}
                                                                                </div>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                    
                                                                    <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-colors">
                                                                        <h4 className="font-bold text-[10px] uppercase tracking-wider site-text-muted mb-2">Question</h4>
                                                                        <textarea 
                                                                            value={expandedQuestionData.question || expandedQuestionData.stem || ''} 
                                                                            onChange={e => updateQuestionContent(expandedTestData.id, expandedQuestionData.id, 'question', e.target.value)}
                                                                            placeholder="Enter question text here..."
                                                                            className="w-full bg-transparent resize-y min-h-[60px] focus:outline-none site-text-strong leading-relaxed"
                                                                        />
                                                                    </div>
                                                                    <div className="flex items-center justify-between mt-4 mb-2">
                                                                        <label className="flex items-center gap-2 cursor-pointer text-sm site-text-muted">
                                                                            <input 
                                                                                type="checkbox" 
                                                                                checked={expandedQuestionData.type === 'Math (SPR)'}
                                                                                onChange={(e) => updateQuestionContent(expandedTestData.id, expandedQuestionData.id, 'type', e.target.checked ? 'Math (SPR)' : 'Multiple Choice')}
                                                                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                                            />
                                                                            Student-Produced Response (Grid-in)
                                                                        </label>
                                                                    </div>
                                                                    
                                                                    {expandedQuestionData.type === 'Math (SPR)' ? (
                                                                        <div className="mt-4">
                                                                            <input 
                                                                                type="text"
                                                                                value={expandedQuestionData.answer !== null && typeof expandedQuestionData.answer !== 'number' ? expandedQuestionData.answer : ''}
                                                                                onChange={e => updateQuestionContent(expandedTestData.id, expandedQuestionData.id, 'answer', e.target.value)}
                                                                                placeholder="Enter correct answer (e.g. 5, 1/2, 3.14)"
                                                                                className="w-full sm:w-1/2 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono font-bold"
                                                                            />
                                                                            <p className="text-xs text-slate-500 mt-2">Students will type this answer instead of choosing options.</p>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                                                                            {(Array.isArray(expandedQuestionData.options) ? expandedQuestionData.options : ['', '', '', '']).map((opt: string, optIdx: number) => (
                                                                                <div key={optIdx} className={`p-3 rounded-xl border text-sm flex gap-3 transition-colors ${expandedQuestionData.answer === optIdx ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-800 dark:text-blue-300 ring-1 ring-blue-500' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus-within:border-slate-400 focus-within:ring-1 focus-within:ring-slate-400'}`}>
                                                                                    <span className={`font-bold shrink-0 w-7 h-7 flex items-center justify-center rounded-lg cursor-pointer ${expandedQuestionData.answer === optIdx ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'}`} onClick={() => updateQuestionAnswer(expandedTestData.id, expandedQuestionData.id, optIdx)}>
                                                                                        {String.fromCharCode(65 + optIdx)}
                                                                                    </span>
                                                                                    <textarea 
                                                                                        value={opt || ''} 
                                                                                        onChange={e => updateQuestionOption(expandedTestData.id, expandedQuestionData.id, optIdx, e.target.value)}
                                                                                        placeholder={`Option ${String.fromCharCode(65 + optIdx)} text...`}
                                                                                        className="w-full bg-transparent resize-none focus:outline-none pt-1"
                                                                                        rows={2}
                                                                                    />
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    )}

                                                                    <button 
                                                                        type="button"
                                                                        onClick={() => deleteQuestion(expandedTestData.id, expandedQuestionData.id)}
                                                                        className="w-full mt-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-lg transition-colors shadow-sm"
                                                                    >
                                                                        Delete Question
                                                                    </button>
                                                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

