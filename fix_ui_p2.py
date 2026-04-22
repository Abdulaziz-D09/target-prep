import re

with open("src/app/classroom/assignment/[id]/page.tsx", "r") as f:
    assignment = f.read()

# Let's replace the right pane inside assignment
new_right_pane = """
                {/* ── Right pane: question + answers ── */}
                <div
                    className={`overflow-y-auto p-4 lg:p-10 pl-4 lg:pl-8 flex justify-center bg-white ${!isDragging && isMath ? 'transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]' : ''}`}
                    style={{ width: (isMath && !isDesmosOpen) ? '100%' : `${100 - leftPanelWidth}%` }}
                >
                    <div className="w-full max-w-[800px] flex flex-col">
                        {/* Header: Connected Question Number & Mark for Review & ABC */}
                        <div className="flex mb-6 mt-4 shadow-sm w-full">
                            {/* Number */}
                            <div className="bg-[#111827] text-white font-bold text-[15px] w-[50px] flex flex-shrink-0 items-center justify-center">
                                {currentIdx + 1}
                            </div>

                            {/* Mark for Review (Middle) */}
                            <button
                                onClick={() => setFlaggedQuestions(s => ({ ...s, [currentIdx]: !s[currentIdx] }))}
                                className="flex flex-1 items-center gap-2 px-4 py-2.5 bg-white border-b border-[#E5E7EB] group/mfr text-[#4B5563] text-[15px] transition-colors justify-start"
                            >
                                <Bookmark className={`w-[14px] h-[14px] transition-colors ${flaggedQuestions[currentIdx] ? 'fill-slate-600 text-slate-600' : 'text-slate-400 group-hover/mfr:text-slate-600'}`} />
                                <span className={flaggedQuestions[currentIdx] ? 'font-bold' : 'font-medium group-hover/mfr:font-bold'}>Mark for Review</span>
                            </button>

                            {/* ABC Elimination (Right) */}
                            <div className="bg-[#F3F4F6] flex items-center pr-2">
                                <button
                                    onClick={() => setIsEliminationMode(!isEliminationMode)}
                                    className={`flex items-center justify-center px-3 py-1 ml-2 font-bold text-[14px] transition-colors rounded ${isEliminationMode ? 'bg-[#111827] text-white' : 'bg-transparent text-slate-700 hover:bg-slate-200'}`}
                                >
                                    <span className="line-through decoration-[#ef4444] decoration-[2px]">ABC</span>
                                </button>
                            </div>
                        </div>

                        {/* Question Content */}
                        <div className="text-[18px] text-[#111827] mb-6 leading-relaxed">
                            <p>{currentQuestion?.stem}</p>
                        </div>

                        {/* Answer Options */}
                        <div className="space-y-4 w-full relative pl-[2px] pt-[2px]">
                            {OPTION_LABELS.map((letter) => {
                                const optText = currentQuestion?.options[letter];
                                if (!optText) return null;

                                const isSelected = answers[String(currentIdx)] === letter;
                                const isEliminated = currentEliminations.includes(letter);
                                const isCorrectAnswer = mode === 'review' && currentQuestion.answer === letter;
                                const isWrongSelection = mode === 'review' && isSelected && !isCorrectAnswer;

                                // If review is allowed to show correct/wrong
                                let overrideBox = '';
                                if (isCorrectAnswer) overrideBox = 'border-emerald-500 bg-emerald-50/50';
                                if (isWrongSelection) overrideBox = 'border-red-400 bg-red-50/50';

                                return (
                                    <div key={letter} className="flex items-center gap-4 relative w-full group">
                                        <label
                                            onClick={(e) => {
                                                if (isEliminationMode) {
                                                    e.preventDefault();
                                                    toggleElimination(e, letter);
                                                }
                                            }}
                                            htmlFor={`opt-${letter}`}
                                            className={`relative flex-1 p-3 px-4 border min-h-[58px] rounded-[10px] flex items-center cursor-pointer transition-all duration-200 overflow-hidden ${isSelected ? 'border-indigo-600 shadow-[inset_0_0_0_1px_#4f46e5,0_2px_8px_rgba(79,70,229,0.15)] bg-indigo-50/30' : 'border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 hover:shadow-sm'} ${overrideBox}`}
                                        >
                                            <input
                                                type="radio"
                                                name="answer"
                                                id={`opt-${letter}`}
                                                className="sr-only"
                                                checked={isSelected}
                                                onChange={() => {
                                                    if (!isEliminated) handleSelectAnswer(letter);
                                                }}
                                            />

                                            <div className={`w-[28px] h-[28px] rounded-full border-[1.5px] flex-shrink-0 flex items-center justify-center font-bold text-[13px] mr-4 transition-colors ${isSelected ? 'border-indigo-600 text-white bg-indigo-600 shadow-sm' : 'border-slate-400 text-slate-700'}`}>
                                                {letter}
                                            </div>

                                            <span className={`text-[17px] font-serif flex-1 ${isEliminated ? 'text-slate-400' : 'text-[#111827]'}`}>
                                                {optText}
                                            </span>

                                            {isEliminated && (
                                                <div className="absolute top-1/2 left-0 w-full h-[1.5px] bg-slate-500 pointer-events-none -translate-y-[50%]"></div>
                                            )}
                                        </label>

                                        <div className="w-[50px] flex items-center justify-start flex-shrink-0">
                                            {isEliminationMode && (
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        toggleElimination(e, letter);
                                                    }}
                                                    className="flex items-center justify-center transition-colors z-20 group/btn"
                                                    title={isEliminated ? "Undo Elimination" : "Eliminate Option"}
                                                >
                                                    {isEliminated ? (
                                                        <span className="font-bluebook text-[14px] font-bold text-[#111827] underline decoration-[#111827] decoration-[1.5px] underline-offset-[3px] hover:text-slate-700">Undo</span>
                                                    ) : (
                                                        <div className="w-[28px] h-[28px] rounded-full border-[1px] border-slate-900 flex items-center justify-center relative bg-white transition-colors group-hover/btn:bg-slate-100 opacity-50 hover:opacity-100">
                                                            <span className="font-bold text-slate-900 text-[12px]">{letter}</span>
                                                            <div className="absolute w-[38px] h-[1.5px] bg-slate-900 rotate-0"></div>
                                                        </div>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
"""

old_right_pane_start = "{/* ── Right pane: question + answers ── */}"
old_right_pane_end = "{/* ── Nav panel (bottom-right overlay) ── */}"

start_idx = assignment.find(old_right_pane_start)
end_idx = assignment.find(old_right_pane_end)

if start_idx != -1 and end_idx != -1:
    assignment = assignment[:start_idx] + new_right_pane + assignment[end_idx:]
else:
    print("Could not find right pane")
    exit(1)

# Now Let's replace the Footer as well to match Practice UI exactly.
new_footer = """
            {/* Premium Bottom Navigation Bar */}
            <footer className="bg-white/80 backdrop-blur-lg border-t border-slate-200/80 px-8 h-[76px] flex items-center justify-between shrink-0 absolute bottom-0 left-0 right-0 z-40 shadow-[0_-2px_15px_rgba(0,0,0,0.03)]">
                <div className="w-48"></div>

                <div className="absolute left-1/2 -translate-x-1/2">
                    <button
                        onClick={() => setIsNavPanelOpen(true)}
                        className="flex items-center justify-center gap-2 px-6 h-[44px] rounded-[6px] font-bold text-white bg-[#222222] hover:bg-[#333333] transition-colors shadow-sm"
                    >
                        <span className="text-[15px] tracking-wide">Question {currentIdx + 1} of {totalQuestions}</span>
                        <ChevronUp className="w-[18px] h-[18px]" />
                    </button>
                </div>

                <div className="flex gap-4 w-48 justify-end">
                    <button
                        onClick={() => setCurrentIdx(p => Math.max(0, p - 1))}
                        disabled={currentIdx === 0}
                        className="bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 px-8 py-2.5 rounded-full font-bold text-[15px] transition-all disabled:opacity-40 disabled:hover:border-slate-200 disabled:cursor-not-allowed shadow-sm hover:shadow-md hover:bg-slate-50"
                    >
                        Back
                    </button>
                    {isLastQuestion ? (
                        <button
                            onClick={() => setMode('complete')}
                            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-9 py-2.5 rounded-full font-bold text-[15px] transition-all shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30 hover:scale-[1.02]"
                        >
                            Submit
                        </button>
                    ) : (
                        <button
                            onClick={() => setCurrentIdx(p => Math.min(totalQuestions - 1, p + 1))}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-9 py-2.5 rounded-full font-bold text-[15px] transition-all shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02]"
                        >
                            Next
                        </button>
                    )}
                </div>
            </footer>
"""

old_footer_start = "{/* ── Footer — identical to practice test ── */}"
old_footer_end = "{/* Reference sheet (Math only) */}"

start_idx2 = assignment.find(old_footer_start)
end_idx2 = assignment.find(old_footer_end)

if start_idx2 != -1 and end_idx2 != -1:
    assignment = assignment[:start_idx2] + new_footer + assignment[end_idx2:]
else:
    print("Could not find footer")
    exit(1)


# Also we need to replace the Left Pane divider and left pane logic.
new_left_pane = """
                {/* ── Left Pane (Passage or Desmos) ── */}
                {isMath ? (
                    <div className={`overflow-hidden bg-[#FAFAFA] border-r border-[#E5E7EB] flex flex-col ${!isDragging ? 'transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]' : ''} ${isDesmosOpen ? '' : 'pointer-events-none'}`} style={{ width: isDesmosOpen ? `${leftPanelWidth}%` : '0%', opacity: isDesmosOpen ? 1 : 0 }}>
                        {/* Custom Calculator Header */}
                        <div className="h-[46px] bg-[#F9FAFB] border-b border-[#D1D5DB] flex items-center justify-between px-4 shrink-0 relative z-20">
                            <div className="w-[80px]">
                                <span className="font-bold text-[15px] text-[#111827]">Calculator</span>
                            </div>
                            <div className="flex bg-[#F3F4F6] rounded-[6px] p-[2px] border border-[#E5E7EB]">
                                <button
                                    onClick={() => setCalcMode('graphing')}
                                    className={`px-5 py-1 text-[13px] font-bold rounded-[4px] transition-colors ${calcMode === 'graphing' ? 'bg-[#111827] text-white shadow-sm' : 'text-[#6B7280] hover:text-[#374151]'}`}
                                >Graphing</button>
                                <button
                                    onClick={() => setCalcMode('scientific')}
                                    className={`px-5 py-1 text-[13px] font-bold rounded-[4px] transition-colors ${calcMode === 'scientific' ? 'bg-[#111827] text-white shadow-sm' : 'text-[#6B7280] hover:text-[#374151]'}`}
                                >Scientific</button>
                            </div>
                            <div className="w-[80px]"></div>
                        </div>
                        <DesmosCalculator mode={calcMode} isDragging={isDragging} />
                    </div>
                ) : (
                    <div className="overflow-y-auto p-4 lg:p-10 pr-4 lg:pr-6 flex justify-center bg-white border-r border-[#E5E7EB]" style={{ width: `${leftPanelWidth}%` }}>
                        <div className="w-full max-w-[800px] relative mt-2">
                            {currentQuestion?.passage ? (
                                <p className="text-[17px] leading-[1.85] text-[#111827] font-normal tracking-[-0.01em] select-text">
                                    {currentQuestion.passage}
                                </p>
                            ) : (
                                <div className="text-[17px] text-[#6B7280] leading-[1.8] font-serif italic text-center mt-20">
                                    No passage for this question.
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ── Resizable Divider ── */}
                {((isMath && isDesmosOpen) || !isMath) && (
                    <div
                        onMouseDown={() => setIsDragging(true)}
                        className="w-[3px] bg-[#E5E7EB] hover:bg-[#D1D5DB] cursor-col-resize flex items-center justify-center flex-shrink-0 transition-colors z-20 relative group"
                    >
                        {/* The handle with triangles */}
                        <div className="h-[36px] w-[16px] bg-[#111827] rounded-[4px] flex items-center justify-center absolute left-1/2 -translate-x-1/2 pointer-events-none shadow-sm gap-[2px]">
                            <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-r-[4px] border-r-white"></div>
                            <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[4px] border-l-white"></div>
                        </div>
                    </div>
                )}
"""

old_left_pane_start = "{/* ── English: passage left pane ── */}"
old_left_pane_end = "{/* ── Right pane: question + answers ── */}"

start_idx3 = assignment.find(old_left_pane_start)
end_idx3 = assignment.find(old_left_pane_end)

if start_idx3 != -1 and end_idx3 != -1:
    assignment = assignment[:start_idx3] + new_left_pane + assignment[end_idx3:]
else:
    print("Could not find left pane")
    exit(1)

with open("src/app/classroom/assignment/[id]/page.tsx", "w") as f:
    f.write(assignment)

print("Done")
