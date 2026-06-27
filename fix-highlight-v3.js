const fs = require('fs');
let content = fs.readFileSync('src/components/HighlightableText.tsx', 'utf-8');

// Add underline menu state
content = content.replace(
    /const \[noteText, setNoteText\] = useState\(''\);/,
    `const [noteText, setNoteText] = useState('');
    const [showUnderlineMenu, setShowUnderlineMenu] = useState(false);`
);

// Update underline click handler
content = content.replace(
    /const handleUnderlineClick = \(\) => {[\s\S]*?};/,
    `const handleUnderlineClick = (style: 'solid' | 'dashed' | 'dotted' | 'none') => {
        if (!popover || !popover.highlightId) return;
        if (style === 'none') {
            onRemoveHighlight(popover.highlightId);
            setPopover(null);
        } else {
            onUpdateHighlight(popover.highlightId, { color: 'transparent', isUnderline: true, underlineStyle: style, note: undefined });
            setPopover({ ...popover, isNoteMode: false });
        }
        setShowUnderlineMenu(false);
    };`
);

// Replace the buttons with the new underline dropdown
content = content.replace(
    /<button onClick=\{handleUnderlineClick\}.*?<\/button>/s,
    `<div className="relative">
                                <button onClick={() => setShowUnderlineMenu(!showUnderlineMenu)} className="w-[52px] h-[34px] rounded-[14px] hover:bg-slate-100 transition-colors flex items-center justify-center border border-slate-400" title="Underline">
                                    <div className="flex flex-col items-center justify-center mt-1">
                                        <span className="font-bold text-[16px] leading-none text-[#111827]">U</span>
                                        <div className="w-[14px] flex flex-col gap-[1px] mt-[1px]">
                                            <div className="w-full border-b-[1.5px] border-[#111827]"></div>
                                            <div className="w-full border-b-[1.5px] border-dashed border-[#111827]"></div>
                                            <div className="w-full border-b-[1.5px] border-dotted border-[#111827]"></div>
                                        </div>
                                    </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#111827] ml-[2px]"><path d="m18 15-6-6-6 6"/></svg>
                                </button>
                                {showUnderlineMenu && (
                                    <div className="absolute top-full mt-1 left-0 bg-white border border-slate-300 rounded-[14px] shadow-lg py-1 flex flex-col z-[101] min-w-[60px]">
                                        <button onClick={() => handleUnderlineClick('solid')} className="px-3 py-2 hover:bg-slate-100 flex items-center justify-center">
                                            <div className="flex flex-col items-center"><span className="font-bold text-[16px] leading-none text-[#111827]">U</span><div className="w-[14px] border-b-[2px] border-[#111827] mt-[2px]"></div></div>
                                        </button>
                                        <button onClick={() => handleUnderlineClick('dashed')} className="px-3 py-2 hover:bg-slate-100 flex items-center justify-center">
                                            <div className="flex flex-col items-center"><span className="font-bold text-[16px] leading-none text-[#111827]">U</span><div className="w-[14px] border-b-[2px] border-dashed border-[#111827] mt-[2px]"></div></div>
                                        </button>
                                        <button onClick={() => handleUnderlineClick('dotted')} className="px-3 py-2 hover:bg-slate-100 flex items-center justify-center">
                                            <div className="flex flex-col items-center"><span className="font-bold text-[16px] leading-none text-[#111827]">U</span><div className="w-[14px] border-b-[2px] border-dotted border-[#111827] mt-[2px]"></div></div>
                                        </button>
                                        <button onClick={() => handleUnderlineClick('none')} className="px-3 py-2 hover:bg-slate-100 text-[14px] font-medium text-[#111827]">None</button>
                                    </div>
                                )}
                            </div>`
);

// Replace the useEffect that applies highlights
content = content.replace(
    /useEffect\(\(\) => \{\n\s*if \(\!containerRef\.current[\s\S]*?\}, \[contentKey, highlights, popover\?\.highlightId\]\);/s,
    `useEffect(() => {
        if (!containerRef.current) return;

        // 1. Cleanup all existing highlight spans to prevent nesting and fix React reconciliation wipes
        const existingSpans = containerRef.current.querySelectorAll('span[data-highlight-id]');
        existingSpans.forEach(span => {
            const parent = span.parentNode;
            if (!parent) return;
            while (span.firstChild) {
                parent.insertBefore(span.firstChild, span);
            }
            parent.removeChild(span);
        });
        containerRef.current.normalize(); // Merge adjacent text nodes back together

        if (!highlights || highlights.length === 0) return;

        // 2. Walk the pristine text nodes
        const walker = document.createTreeWalker(containerRef.current, NodeFilter.SHOW_TEXT);
        const textNodes: { node: Text, start: number, end: number }[] = [];
        let offset = 0;
        let n: Node | null;
        
        while ((n = walker.nextNode())) {
            const len = n.textContent?.length || 0;
            if (len > 0) {
                textNodes.push({ node: n as Text, start: offset, end: offset + len });
                offset += len;
            }
        }

        const sortedHighlights = [...highlights].sort((a, b) => b.start - a.start);

        sortedHighlights.forEach(h => {
            const overlaps = textNodes.filter(tn => tn.end > h.start && tn.start < h.end);
            
            overlaps.reverse().forEach(tn => {
                const relStart = Math.max(0, h.start - tn.start);
                const relEnd = Math.min(tn.node.length, h.end - tn.start);
                
                if (relStart >= relEnd) return;

                try {
                    const range = document.createRange();
                    range.setStart(tn.node, relStart);
                    range.setEnd(tn.node, relEnd);

                    const span = document.createElement('span');
                    span.className = 'relative group cursor-pointer transition-colors duration-200';
                    
                    if (h.isUnderline) {
                        const style = (h as any).underlineStyle || 'solid';
                        span.style.textDecoration = 'underline';
                        span.style.textDecorationColor = '#ef4444';
                        span.style.textDecorationThickness = '2px';
                        span.style.textDecorationStyle = style;
                    } else if (h.color && h.color !== 'transparent') {
                        span.classList.add(\`highlight-\${h.color}\`);
                    } else if (h.note) {
                        span.classList.add('border-b-2', 'border-dashed', 'border-slate-400', 'bg-slate-50');
                    }
                    
                    if (popover?.highlightId === h.id) {
                        span.classList.add('brightness-95');
                    }

                    span.setAttribute('data-highlight-id', h.id);
                    
                    if (h.note) {
                        const noteInd = document.createElement('span');
                        noteInd.className = "absolute -top-1.5 -right-1 bg-[#111827] text-white w-3 h-3 rounded-full flex items-center justify-center shadow-sm opacity-90";
                        span.appendChild(noteInd);
                    }

                    range.surroundContents(span);
                } catch (e) {
                    console.warn("Could not apply highlight to range", e);
                }
            });
        });
    }); // Run on EVERY render to ensure spans are always present even if React wipes them`
);

fs.writeFileSync('src/components/HighlightableText.tsx', content);
