const fs = require('fs');

const path = 'src/app/practice/test/[id]/page.tsx';
let code = fs.readFileSync(path, 'utf8');

// 1. Imports
code = code.replace(
    `import { X, Clock, ArrowLeft, ArrowRight, Check, CheckCircle, Coffee, Trophy, Flag, BookOpen, ChevronDown, Highlighter, Maximize2, MoreHorizontal, ArrowLeftCircle, Bookmark, LayoutGrid } from 'lucide-react';`,
    `import { X, Clock, ArrowLeft, ArrowRight, Check, CheckCircle, Coffee, Trophy, Flag, BookOpen, ChevronDown, ChevronUp, Highlighter, Maximize2, MoreHorizontal, ArrowLeftCircle, Bookmark, LayoutGrid, FileText, Calculator } from 'lucide-react';`
);

// Add isReferenceOpen state
code = code.replace(
    `const [isDesmosOpen, setIsDesmosOpen] = useState(false);`,
    `const [isDesmosOpen, setIsDesmosOpen] = useState(false);\n    const [isReferenceOpen, setIsReferenceOpen] = useState(false);`
);

// 2. Adjust Module Name and Directions alignment
code = code.replace(
    `<span className="font-bold text-[#111827] text-[15px] mr-4 ml-4">{currentSection?.name}: Module {currentModuleIndex + 1}</span>
                    <button
                        onClick={() => setIsDirectionsOpen(!isDirectionsOpen)}
                        className="flex items-center gap-1.5 text-[#374151] font-bold text-[13px] hover:bg-black/5 px-2 py-1 rounded transition-colors"
                    >
                        Directions
                        <ChevronDown className={\`w-[14px] h-[14px] transition-transform \${isDirectionsOpen ? 'rotate-180' : ''}\`} />
                    </button>`,
    `<div className="flex flex-col ml-4">
                        <span className="font-bold text-[#111827] text-[15px] leading-snug">Section {currentSectionIndex + 1}, Module {currentModuleIndex + 1}: {currentSection?.name}</span>
                        <button
                            onClick={() => setIsDirectionsOpen(!isDirectionsOpen)}
                            className="flex items-center gap-1.5 text-[#374151] font-bold text-[13px] hover:bg-black/5 py-1 rounded transition-colors -ml-1 pl-1"
                        >
                            Directions
                            <ChevronDown className={\`w-[14px] h-[14px] transition-transform \${isDirectionsOpen ? 'rotate-180' : ''}\`} />
                        </button>
                    </div>`
);

// 3. Add Reference Button & change More to Save & Exit
code = code.replace(
    `{currentSection?.name === 'Math' ? (
                        <button
                            onClick={() => setIsDesmosOpen(!isDesmosOpen)}
                            className={\`flex flex-col items-center justify-center gap-1.5 w-[80px] h-[64px] rounded-lg transition-colors border border-transparent \${isDesmosOpen ? 'bg-slate-200 text-slate-900 shadow-inner' : 'hover:bg-black/5 text-slate-700'}\`}
                        >
                            <Calculator className="w-[24px] h-[24px]" />
                            <span className="font-bold text-[12px] leading-none">Calculator</span>
                        </button>
                    ) : (
                        <button
                            onClick={() => setIsHighlightActive(!isHighlightActive)}
                            className={\`flex flex-col items-center justify-center gap-1.5 w-[80px] h-[64px] rounded-lg transition-colors border border-transparent \${isHighlightActive ? 'bg-slate-200 text-slate-900 shadow-inner' : 'hover:bg-black/5 text-slate-700'}\`}
                        >
                            <Highlighter className="w-[24px] h-[24px]" />
                            <span className="font-bold text-[12px] leading-none">Highlight</span>
                        </button>
                    )}
                    <button
                        onClick={toggleFullscreen}`,
    `{currentSection?.name === 'Math' ? (
                        <>
                            <button
                                onClick={() => setIsDesmosOpen(!isDesmosOpen)}
                                className={\`flex flex-col items-center justify-center gap-1.5 w-[80px] h-[64px] rounded-lg transition-colors border border-transparent \${isDesmosOpen ? 'bg-slate-200 text-slate-900 shadow-inner' : 'hover:bg-black/5 text-slate-700'}\`}
                            >
                                <Calculator className="w-[24px] h-[24px]" />
                                <span className="font-bold text-[12px] leading-none">Calculator</span>
                            </button>
                            <button
                                onClick={() => setIsReferenceOpen(true)}
                                className="flex flex-col items-center justify-center gap-1.5 w-[80px] h-[64px] rounded-lg hover:bg-black/5 text-slate-700 transition-colors"
                            >
                                <FileText className="w-[24px] h-[24px]" />
                                <span className="font-bold text-[12px] leading-none text-slate-500">Reference</span>
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setIsHighlightActive(!isHighlightActive)}
                            className={\`flex flex-col items-center justify-center gap-1.5 w-[80px] h-[64px] rounded-lg transition-colors border border-transparent \${isHighlightActive ? 'bg-slate-200 text-slate-900 shadow-inner' : 'hover:bg-black/5 text-slate-700'}\`}
                        >
                            <Highlighter className="w-[24px] h-[24px]" />
                            <span className="font-bold text-[12px] leading-none">Highlight</span>
                        </button>
                    )}
                    <button
                        onClick={toggleFullscreen}`
);

code = code.replace(
    `{/* More Button (Replaces Save & Exit) */}
                    <button
                        onClick={() => { if (confirm('Are you sure you want to Save and Exit?')) { resetTest(); router.push('/practice'); } }}
                        className="flex flex-col items-center justify-center gap-1.5 w-[84px] h-[64px] rounded-lg hover:bg-black/5 text-slate-700 transition-colors ml-2 mr-4"
                    >
                        <MoreHorizontal className="w-[24px] h-[24px]" />
                        <span className="font-bold text-[12px] leading-none">More</span>
                    </button>`,
    `<button
                        onClick={() => { if (confirm('Are you sure you want to Save and Exit?')) { resetTest(); router.push('/practice'); } }}
                        className="flex flex-col items-center justify-center gap-1.5 w-[84px] h-[64px] rounded-lg hover:bg-black/5 text-slate-700 transition-colors ml-2 mr-2"
                    >
                        <span className="bg-[#111827] text-white rounded-[4px] text-[13px] px-[8px] py-[2px] font-bold leading-tight flex items-center justify-center">X</span>
                        <span className="font-bold text-[12px] leading-none">Save & Exit</span>
                    </button>`
);

// 4. White background instead of grey + max-width
code = code.replace(
    `<main className="flex-1 flex overflow-hidden justify-center bg-[#F3F4F6] pb-[70px]">
                {!showCheckWork ? (
                <div className="w-full max-w-[1400px] bg-white mx-4 mt-2 mb-2 rounded border border-slate-200 shadow-sm flex overflow-hidden relative">`,
    `<main className="flex-1 flex overflow-hidden bg-white pb-[70px]">
                {!showCheckWork ? (
                <div className="w-full bg-white flex overflow-hidden relative">`
);

code = code.replace(
    `<div className="w-full flex justify-center py-10 fade-in bg-white h-full relative">`,
    `<div className="w-full flex justify-center py-10 fade-in bg-[#FAFAFA] h-full relative">`
);

// 5. Update split pane divider
code = code.replace(
    `{/* The handle with triangles */}
                        <div className="h-[50px] w-[14px] bg-white border border-[#D1D5DB] rounded-full flex flex-col items-center justify-center shadow-sm absolute left-1/2 -translate-x-1/2 group-hover:bg-[#F3F4F6]">
                            <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-r-[5px] border-r-slate-400 mb-1 pointer-events-none"></div>
                            <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[5px] border-l-slate-400 pointer-events-none"></div>
                        </div>`,
    `{/* The handle with triangles */}
                        <div className="h-[36px] w-[12px] bg-[#111827] rounded-[3px] flex flex-col items-center justify-center absolute left-1/2 -translate-x-1/2 pointer-events-none shadow-sm">
                            <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-r-[5px] border-r-white mb-1"></div>
                            <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[5px] border-l-white"></div>
                        </div>`
);


// 6. Fix ABC Elimination (add onClick to the label itself to hijack the flow)
code = code.replace(
    `<label
                                            htmlFor={\`opt-\${i}\`}`,
    `<label
                                            onClick={(e) => {
                                                if (isEliminationMode) {
                                                    e.preventDefault();
                                                    toggleElimination(questionKey, i);
                                                }
                                            }}
                                            htmlFor={\`opt-\${i}\`}`
);


// 7. Footer: Remove dashed line filler, remove Name, restore Question X of Y
code = code.replace(
    `{/* Bluebook Bottom Navigation Bar */}
            <div className="w-full flex justify-center w-full px-6 bg-[#F3F4F6] border-t border-slate-300 border-dashed absolute bottom-[68px]"></div>
            <footer className="bg-[#E5E7EB] border-t border-[#D1D5DB] px-6 h-[70px] flex items-center justify-between shrink-0 absolute bottom-0 left-0 right-0 z-40">
                <div className="text-[#111827] font-bold text-[13px] w-48">
                    Abdulaziz Davronov
                </div>`,
    `{/* Bluebook Bottom Navigation Bar */}
            <footer className="bg-white border-t border-[#D1D5DB] px-6 h-[70px] flex items-center justify-between shrink-0 absolute bottom-0 left-0 right-0 z-40">
                <div className="w-48"></div>`
);

code = code.replace(
    `className="group flex flex-col items-center justify-center gap-0 w-[180px] h-[46px] rounded-[5px] font-bold text-white bg-[#222222] hover:bg-[#333333] transition-colors relative shadow-sm"
                        >
                            <span className="text-[14px] tracking-wide mt-1">Question {currentQuestionIndex + 1} of {totalQuestions}</span>
                            <ChevronDown className="w-[18px] h-[18px] mb-1" />
                            <div className="absolute -bottom-[8px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-[#222222] group-hover:border-t-[#333333]"></div>
                        </button>`,
    `className="flex items-center justify-center gap-2 px-6 h-[44px] rounded-[6px] font-bold text-white bg-[#222222] hover:bg-[#333333] transition-colors relative shadow-sm"
                        >
                            <span className="text-[15px] tracking-wide">Question {currentQuestionIndex + 1} of {totalQuestions}</span>
                            <ChevronUp className="w-[18px] h-[18px]" />
                        </button>`
);

// 8. Add returning Reference Modal before the end of the root div
const referenceModalHTML = `
            {/* Reference Sheet Modal Overlay */}
            {isReferenceOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setIsReferenceOpen(false)}>
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col relative" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-4 border-b border-slate-200">
                            <h2 className="text-xl font-bold font-serif ml-2">Reference Sheet</h2>
                            <button onClick={() => setIsReferenceOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="overflow-y-auto p-8 pt-6">
                            <div className="grid grid-cols-2 gap-x-8 gap-y-10 items-center justify-items-center">
                                {/* Circle */}
                                <div className="text-center font-serif flex flex-col items-center">
                                    <div className="w-24 h-24 rounded-full border-[1.5px] border-black flex items-center justify-center relative mb-4">
                                        <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                                        <div className="absolute top-1/2 left-1/2 w-12 h-[1.5px] bg-black origin-left"></div>
                                        <span className="absolute top-1/2 right-4 -translate-y-[20px] text-[15px] italic">r</span>
                                    </div>
                                    <p className="text-[17px] mb-1 italic">A = πr²</p>
                                    <p className="text-[17px] italic">C = 2πr</p>
                                </div>
                                {/* Rectangle */}
                                <div className="text-center font-serif flex flex-col items-center">
                                    <div className="w-32 h-16 border-[1.5px] border-black relative mb-6 mt-4">
                                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[15px] italic">l</span>
                                        <span className="absolute top-1/2 -right-6 -translate-y-1/2 text-[15px] italic">w</span>
                                    </div>
                                    <p className="text-[20px] italic">A = lw</p>
                                </div>
                                {/* Triangle */}
                                <div className="text-center font-serif flex flex-col items-center">
                                    <svg width="100" height="80" viewBox="0 0 100 80" className="mb-4">
                                        <polygon points="10,70 90,70 40,10" fill="none" stroke="black" strokeWidth="1.5" />
                                        <line x1="40" y1="10" x2="40" y2="70" stroke="black" strokeDasharray="4,4" strokeWidth="1" />
                                        <rect x="40" y="60" width="10" height="10" fill="none" stroke="black" strokeWidth="1" />
                                        <text x="50" y="45" fontStyle="italic" fontSize="15">h</text>
                                        <text x="50" y="85" fontStyle="italic" fontSize="15">b</text>
                                    </svg>
                                    <p className="text-[17px] italic">A = ½bh</p>
                                </div>
                                {/* Right Triangle */}
                                <div className="text-center font-serif flex flex-col items-center">
                                    <svg width="120" height="80" viewBox="0 0 120 80" className="mb-4">
                                        <polygon points="20,10 20,70 100,70" fill="none" stroke="black" strokeWidth="1.5" />
                                        <rect x="20" y="60" width="10" height="10" fill="none" stroke="black" strokeWidth="1" />
                                        <text x="10" y="45" fontStyle="italic" fontSize="15">a</text>
                                        <text x="60" y="85" fontStyle="italic" fontSize="15">b</text>
                                        <text x="65" y="35" fontStyle="italic" fontSize="15">c</text>
                                    </svg>
                                    <p className="text-[18px] italic mt-2">c² = a² + b²</p>
                                </div>
                                {/* Rectangular Prism */}
                                <div className="text-center font-serif flex flex-col items-center">
                                    <svg width="120" height="80" viewBox="0 0 120 80" className="mb-4">
                                        <polygon points="10,40 70,40 90,20 30,20" fill="none" stroke="black" strokeWidth="1.5" />
                                        <rect x="10" y="40" width="60" height="30" fill="none" stroke="black" strokeWidth="1.5" />
                                        <polygon points="70,40 90,20 90,50 70,70" fill="none" stroke="black" strokeWidth="1.5" />
                                        <text x="40" y="85" fontStyle="italic" fontSize="15">l</text>
                                        <text x="85" y="70" fontStyle="italic" fontSize="15">w</text>
                                        <text x="100" y="40" fontStyle="italic" fontSize="15">h</text>
                                    </svg>
                                    <p className="text-[20px] italic">V = lwh</p>
                                </div>
                                {/* Cylinder */}
                                <div className="text-center font-serif flex flex-col items-center">
                                    <svg width="100" height="80" viewBox="0 0 100 80" className="mb-4 mt-2">
                                        <ellipse cx="50" cy="20" rx="40" ry="10" fill="none" stroke="black" strokeWidth="1.5" />
                                        <path d="M 10,20 L 10,60 A 40 10 0 0 0 90,60 L 90,20" fill="none" stroke="black" strokeWidth="1.5" />
                                        <circle cx="50" cy="20" r="1.5" fill="black" />
                                        <line x1="50" y1="20" x2="90" y2="20" stroke="black" strokeWidth="1.5" />
                                        <text x="70" y="15" fontStyle="italic" fontSize="15">r</text>
                                        <text x="95" y="50" fontStyle="italic" fontSize="15">h</text>
                                    </svg>
                                    <p className="text-[20px] italic">V = πr²h</p>
                                </div>
                                {/* Sphere */}
                                <div className="text-center font-serif flex flex-col items-center mt-4">
                                    <svg width="80" height="80" viewBox="0 0 80 80" className="mb-4">
                                        <circle cx="40" cy="40" r="35" fill="none" stroke="black" strokeWidth="1.5" />
                                        <ellipse cx="40" cy="40" rx="35" ry="10" fill="none" stroke="black" strokeWidth="1.5" strokeDasharray="4,4" />
                                        <circle cx="40" cy="40" r="1.5" fill="black" />
                                        <line x1="40" y1="40" x2="75" y2="40" stroke="black" strokeWidth="1.5" />
                                        <text x="55" y="35" fontStyle="italic" fontSize="15">r</text>
                                    </svg>
                                    <p className="text-[17px] italic">V = ⁴⁄₃πr³</p>
                                </div>
                                {/* Cone */}
                                <div className="text-center font-serif flex flex-col items-center mt-4">
                                    <svg width="80" height="90" viewBox="0 0 80 90" className="mb-4">
                                        <ellipse cx="40" cy="70" rx="30" ry="8" fill="none" stroke="black" strokeWidth="1.5" strokeDasharray="4,4" />
                                        <path d="M 10,70 L 40,10 L 70,70 A 30 8 0 0 1 10,70" fill="none" stroke="black" strokeWidth="1.5" />
                                        <line x1="40" y1="10" x2="40" y2="70" stroke="black" strokeDasharray="4,4" strokeWidth="1" />
                                        <rect x="40" y="65" width="5" height="5" fill="none" stroke="black" strokeWidth="1" />
                                        <line x1="40" y1="70" x2="70" y2="70" stroke="black" strokeDasharray="4,4" strokeWidth="1" />
                                        <text x="55" y="65" fontStyle="italic" fontSize="15">r</text>
                                        <text x="45" y="45" fontStyle="italic" fontSize="15">h</text>
                                    </svg>
                                    <p className="text-[17px] italic">V = ⅓πr²h</p>
                                </div>
                            </div>
                            
                            {/* Facts at the bottom */}
                            <div className="mt-14 font-serif text-[18px] text-slate-800 space-y-4 max-w-xl mx-auto border-t border-slate-200 pt-8">
                                <p>The number of degrees of arc in a circle is 360.</p>
                                <p>The number of radians of arc in a circle is 2π.</p>
                                <p>The sum of the measures in degrees of the angles of a triangle is 180.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Ensure the modal replaces the final return block properly
`;
code = code.replace(
    `        </div>
    );
}`,
    referenceModalHTML
);

fs.writeFileSync(path, code);
console.log("Updated UI script executed successfully!");
