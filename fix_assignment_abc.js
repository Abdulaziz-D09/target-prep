const fs = require('fs');
const file = 'src/app/classroom/assignment/[id]/page.tsx';

let content = fs.readFileSync(file, 'utf8');

// The assignment page had this connected header
const oldHeaderStart = `                        {/* Header: Connected Question Number & Mark for Review & ABC */}
                        <div className="flex items-center mb-6 mt-4 w-full  bg-white border border-[#E5E7EB] rounded-[12px] shadow-sm h-[44px]">
                            {/* Number */}
                            <div className="bg-[#111827] text-white font-bold text-[15px] w-[58px] h-[44px] flex flex-shrink-0 items-center justify-center rounded-l-[11px]">
                                {currentIdx + 1}
                            </div>

                            {/* Mark for Review (Middle) */}
                            <button
                                onClick={() => setFlaggedQuestions(s => ({ ...s, [currentIdx]: !s[currentIdx] }))}
                                className="flex flex-1 items-center gap-2 px-4 h-full text-[#4B5563] text-[15px] transition-colors justify-start bg-transparent group/mfr hover:bg-slate-50"
                            >
                                <Bookmark className={\`w-[16px] h-[16px] transition-colors \${flaggedQuestions[currentIdx] ? 'fill-slate-600 text-slate-600' : 'text-slate-400 group-hover/mfr:text-slate-600'}\`} />
                                <span className={flaggedQuestions[currentIdx] ? 'font-bold' : 'font-medium group-hover/mfr:font-bold'}>Mark for Review</span>
                            </button>

                            {/* ABC Elimination (Right) */}
                            <div className="w-[58px] h-[44px] flex flex-shrink-0 items-center justify-center border-l border-[#E5E7EB] rounded-r-[11px] bg-transparent">
                                <button
                                    onClick={() => setIsEliminationMode(!isEliminationMode)}
                                    className={\`flex items-center justify-center w-full h-full font-bold text-[14px] transition-colors rounded-r-[11px] \${isEliminationMode ? 'bg-[#111827] text-white' : 'text-slate-700 hover:bg-slate-50'}\`}
                                >
                                    <span className="line-through decoration-[#ef4444] decoration-[2px]">ABC</span>
                                </button>
                            </div>
                        </div>`;


const newHeaderStart = `                        {/* Header: Connected Question Number & Mark for Review & ABC */}
                        <div className="flex items-center w-full h-[54px] mb-4 mt-2">
                            {/* Number - standalone rounded square */}
                            <div className="bg-[#111827] text-white font-bold text-[16px] w-[54px] h-[54px] rounded-[10px] flex-shrink-0 flex items-center justify-center relative z-10 shadow-sm">
                                {currentIdx + 1}
                            </div>

                            {/* Mark for Review - middle bar with top/bottom border connecting exactly to the squares */}
                            <button
                                onClick={() => setFlaggedQuestions(s => ({ ...s, [currentIdx]: !s[currentIdx] }))}
                                className="flex flex-1 items-center gap-2 px-6 h-[54px] text-[#4B5563] transition-colors justify-start bg-white border-t border-b border-[#D1D5DB] group/mfr hover:bg-slate-50 relative z-0 -mx-[12px]"
                            >
                                <Bookmark className={\`w-[14px] h-[14px] transition-colors \${flaggedQuestions[currentIdx] ? 'fill-slate-600 text-slate-600' : 'text-slate-400 group-hover/mfr:text-slate-600'}\`} />
                                <span className={flaggedQuestions[currentIdx] ? 'font-bold text-[14px]' : 'font-medium text-[14px] group-hover/mfr:font-bold'}>Mark for Review</span>
                            </button>

                            {/* ABC - standalone rounded square */}
                            <div className="w-[54px] h-[54px] flex-shrink-0 flex items-center justify-center rounded-[10px] border border-[#D1D5DB] bg-white relative z-10 shadow-sm">
                                <button
                                    onClick={() => setIsEliminationMode(!isEliminationMode)}
                                    className={\`flex items-center justify-center w-full h-full font-bold text-[14px] transition-colors rounded-[10px] \${isEliminationMode ? 'bg-[#111827] text-white' : 'text-slate-700 hover:bg-slate-50'}\`}
                                >
                                    <span className="line-through decoration-[#ef4444] decoration-[2px]">ABC</span>
                                </button>
                            </div>
                        </div>`;

content = content.replace(oldHeaderStart, newHeaderStart);

// Change Answer choice spacing to match practice
const spaceY4 = `<div className="space-y-4 w-full relative pl-[2px] pt-[2px]">`;
const spaceY2 = `<div className="space-y-2 w-full relative pl-[2px] pt-[2px]">`;
content = content.replace(spaceY4, spaceY2);

fs.writeFileSync(file, content);
