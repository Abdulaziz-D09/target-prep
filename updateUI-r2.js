const fs = require('fs');
const path = require('path');

const pageFile = path.resolve(__dirname, 'src/app/practice/test/[id]/page.tsx');
let pageCode = fs.readFileSync(pageFile, 'utf8');

// 1. Save & Exit Alignment
pageCode = pageCode.replace(
    `<button
                        onClick={() => { if (confirm('Are you sure you want to Save and Exit?')) { resetTest(); router.push('/practice'); } }}
                        className="flex flex-col items-center justify-center gap-1.5 w-[84px] h-[64px] rounded-lg hover:bg-black/5 text-slate-700 transition-colors ml-2 mr-2"
                    >
                        <span className="bg-[#111827] text-white rounded-[4px] text-[13px] px-[8px] py-[2px] font-bold leading-tight flex items-center justify-center">X</span>
                        <span className="font-bold text-[12px] leading-none">Save & Exit</span>
                    </button>`,
    `<button
                        onClick={() => { if (confirm('Are you sure you want to Save and Exit?')) { resetTest(); router.push('/practice'); } }}
                        className="flex flex-col items-center justify-center gap-1.5 w-[80px] h-[64px] rounded-lg hover:bg-black/5 text-slate-700 transition-colors mr-2 ml-2"
                    >
                        <span className="bg-[#111827] text-white rounded-[4px] text-[15px] px-[10px] py-[1px] font-bold leading-none flex items-center justify-center text-center">X</span>
                        <span className="font-bold text-[12px] leading-none">Save & Exit</span>
                    </button>`
);

// 2. ABC Eliminate circles logic (Only show when isEliminationMode is true)
pageCode = pageCode.replace(
    `{/* Eliminate/Undo button absolutely positioned outside the box on the right */}
                                        <div className="w-[50px] flex items-center justify-start flex-shrink-0">
                                            <button`,
    `{/* Eliminate/Undo button absolutely positioned outside the box on the right */}
                                        <div className="w-[50px] flex items-center justify-start flex-shrink-0">
                                            {isEliminationMode && (
                                                <button`
);

// Close the button
pageCode = pageCode.replace(
    `<div className="absolute w-[38px] h-[1.5px] bg-slate-900 rotate-0"></div>
                                                    </div>
                                                )}
                                            </button>
                                        </div>`,
    `<div className="absolute w-[38px] h-[1.5px] bg-slate-900 rotate-0"></div>
                                                        </div>
                                                    )}
                                                </button>
                                            )}
                                        </div>`
);


// 3. Question X of Y Button repositioning to bottom left (under the line)
pageCode = pageCode.replace(
    `<footer className="bg-white border-t border-[#D1D5DB] px-6 h-[70px] flex items-center justify-between shrink-0 absolute bottom-0 left-0 right-0 z-40">
                <div className="w-48"></div>

                {!showCheckWork && (
                    <div className="flex-1 flex justify-center absolute left-1/2 -translate-x-1/2 -top-[23px]">
                        <button
                            onClick={() => setIsNavPanelOpen(true)}
                            className="flex items-center justify-center gap-2 px-6 h-[44px] rounded-[6px] font-bold text-white bg-[#222222] hover:bg-[#333333] transition-colors relative shadow-sm"
                        >
                            <span className="text-[15px] tracking-wide">Question {currentQuestionIndex + 1} of {totalQuestions}</span>
                            <ChevronUp className="w-[18px] h-[18px]" />
                        </button>
                    </div>
                )}`,
    `<footer className="bg-white border-t border-[#D1D5DB] px-6 h-[70px] flex items-center justify-between shrink-0 absolute bottom-0 left-0 right-0 z-40">
                <div className="w-48">
                    {!showCheckWork && (
                        <button
                            onClick={() => setIsNavPanelOpen(true)}
                            className="flex items-center justify-center gap-2 px-4 h-[44px] rounded-[6px] font-bold text-white bg-[#222222] hover:bg-[#333333] transition-colors shadow-sm"
                        >
                            <span className="text-[15px] tracking-wide">Question {currentQuestionIndex + 1} of {totalQuestions}</span>
                            <ChevronUp className="w-[18px] h-[18px]" />
                        </button>
                    )}
                </div>`
);

// 4. Desmos Iframe: add embed parameter and pointerEvents none when dragging 
pageCode = pageCode.replace(
    `<iframe src="https://www.desmos.com/calculator" width="100%" height="100%" frameBorder={0} style={{ border: 'none' }} className="absolute inset-0 z-10"></iframe>`,
    `<iframe src="https://www.desmos.com/calculator?embed" width="100%" height="100%" frameBorder={0} style={{ border: 'none', pointerEvents: isDragging ? 'none' : 'auto' }} className="absolute inset-0 z-10"></iframe>`
);
fs.writeFileSync(pageFile, pageCode);


// 5. Grid View and Data updates
const practicePagePath = path.resolve(__dirname, 'src/app/practice/page.tsx');
let practicePageCode = fs.readFileSync(practicePagePath, 'utf8');

// Change grid columns to 5 and set card height to full-stretch
practicePageCode = practicePageCode.replace(
    `<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">`,
    `<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">`
);

practicePageCode = practicePageCode.replace(
    `<div key={test.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">`,
    `<div key={test.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">`
);

practicePageCode = practicePageCode.replace(
    `<div className="p-6">`,
    `<div className="p-5 flex flex-col flex-1">`
);

practicePageCode = practicePageCode.replace(
    `<Link href={\`/practice/test/\${test.id}\`} className={\`w-full \${colorClass} \${bgHoverClass} text-white py-2.5 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2\`}>`,
    `<div className="mt-auto pt-4">
                                    <Link href={\`/practice/test/\${test.id}\`} className={\`w-full \${colorClass} \${bgHoverClass} text-white py-2.5 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2\`}>`
);
practicePageCode = practicePageCode.replace(
    `</Link>
                            </div>`,
    `</Link>
                                </div>
                            </div>`
);
fs.writeFileSync(practicePagePath, practicePageCode);


// 6. Data: Update texts strictly in src/data/questions.ts
const dataFile = path.resolve(__dirname, 'src/data/questions.ts');
let dataCode = fs.readFileSync(dataFile, 'utf8');

// The first 5 tests (English)
for (let i = 1; i <= 5; i++) {
    dataCode = dataCode.replace(
        `"title": "Practice Test ${i}",
        "description": "Full English SAT test",
        "type": "Full Section 1",
        "duration": "1h 4m",`,
        `"title": "Practice Test ${i}",
        "description": "Full English SAT test",
        "type": "Full English",
        "duration": "1h 4m",`
    );
}

// The next 5 tests (Math)
for (let i = 6; i <= 10; i++) {
    dataCode = dataCode.replace(
        `id: ${i},
        title: 'Practice Test ${i}',
        description: 'Full Section 2',`,
        `id: ${i},
        title: 'Practice Test ${i}',
        description: 'Full Section 2',
        type: 'Full Math',
        duration: '1h 10m',
        totalQuestions: 44,
        moduleCount: 2,
        color: 'orange',`
    );
}

fs.writeFileSync(dataFile, dataCode);

console.log('UI Fixes Round 2 complete.');
