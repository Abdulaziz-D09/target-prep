const fs = require('fs');
const content = fs.readFileSync('src/components/HighlightableText.tsx', 'utf-8');

const newContent = content.replace(
    /className=\{\`highlight-popover-container fixed.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?<\/div>/s,
    `className={\`highlight-popover-container fixed z-[100] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.12)] flex flex-col transition-all duration-200 \${popover.isNoteMode ? 'rounded-[4px] min-w-[280px] p-2 border border-slate-300 gap-2' : 'rounded-[4px] min-w-fit px-[6px] py-[6px] border border-slate-300'}\`}
                    style={{
                        top: Math.max(10, popover.rect.top - (popover.isNoteMode ? 100 : 64)),
                        left: Math.max(10, Math.min(window.innerWidth - 300, popover.rect.left + (popover.rect.width / 2) - 140)),
                    }}
                >
                    <div className={\`flex items-center justify-between \${popover.isNoteMode ? 'px-1' : ''}\`}>
                        <div className="flex items-center gap-2 pr-2">
                            <button onClick={() => handleColorClick('yellow')} className={\`w-[34px] h-[34px] rounded-[4px] bg-[#FCE883] transition-transform flex items-center justify-center border \${popover.color === 'yellow' ? 'border-[#111827] border-[2px]' : 'border-slate-400 hover:scale-105'}\`} title="Yellow"></button>
                            <button onClick={() => handleColorClick('blue')} className={\`w-[34px] h-[34px] rounded-[4px] bg-[#B2DFFC] transition-transform flex items-center justify-center border \${popover.color === 'blue' ? 'border-[#111827] border-[2px]' : 'border-slate-400 hover:scale-105'}\`} title="Blue"></button>
                            <button onClick={() => handleColorClick('pink')} className={\`w-[34px] h-[34px] rounded-[4px] bg-[#F8BBD0] transition-transform flex items-center justify-center border \${popover.color === 'pink' ? 'border-[#111827] border-[2px]' : 'border-slate-400 hover:scale-105'}\`} title="Pink"></button>
                        </div>

                        <div className="flex items-center gap-2 pl-2">
                            <button onClick={handleUnderlineClick} className="w-[42px] h-[34px] rounded-[4px] hover:bg-slate-100 transition-colors flex items-center justify-center border border-slate-400" title="Underline">
                                <Underline className="w-[18px] h-[18px] text-[#111827] stroke-[2]" />
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#111827]"><path d="m6 9 6 6 6-6"/></svg>
                            </button>
                            <button onClick={handleDelete} className="w-[34px] h-[34px] rounded-[4px] hover:bg-slate-100 transition-colors flex items-center justify-center border border-slate-400" title="Delete">
                                <Trash2 className="w-[18px] h-[18px] text-[#111827] stroke-[1.5]" />
                            </button>
                            
                            <div className="w-px h-6 bg-slate-300 mx-1"></div>
                            
                            <button onClick={() => setPopover(prev => prev ? { ...prev, isNoteMode: true } : null)} className="w-[34px] h-[34px] rounded-[4px] hover:bg-slate-100 transition-colors flex items-center justify-center border border-slate-400" title="Add Note">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="#FCE883" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8Z" />
                                  <path d="M15 3v4a2 2 0 0 0 2 2h4" />
                                  <path d="M10 9v6" />
                                  <path d="M7 12h6" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    
                    {popover.isNoteMode && (
                        <div className="px-2 pb-1 pt-1 mt-1 border-t border-slate-100">
                            <input 
                                type="text" 
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                                placeholder="Add a note..." 
                                className="w-full text-[16px] outline-none placeholder:text-slate-400 text-[#111827] bg-transparent py-1 font-medium" 
                                autoFocus
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSaveNote();
                                    }
                                }}
                            />
                        </div>
                    )}
                </div>`
);

fs.writeFileSync('src/components/HighlightableText.tsx', newContent);
