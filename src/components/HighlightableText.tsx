import React, { useState, useRef, useEffect } from 'react';
import { Highlight } from '@/store/testStore';
import { Underline, Trash2, StickyNote } from 'lucide-react';
import { LatexRenderer } from './LatexRenderer';

interface HighlightableTextProps {
    text: string;
    highlights: Highlight[];
    onAddHighlight: (highlight: Highlight) => void;
    onRemoveHighlight: (id: string) => void;
    onUpdateHighlight: (id: string, updates: Partial<Highlight>) => void;
    isHighlightModeActive: boolean;
    className?: string;
    defaultHighlightColor?: string;
    onChangeDefaultColor?: (color: string) => void;
}

type PopoverState = {
    rect: DOMRect;
    highlightId: string;
    isNoteMode: boolean;
    color: string;
};

export function HighlightableText({
    text,
    highlights,
    onAddHighlight,
    onRemoveHighlight,
    onUpdateHighlight,
    isHighlightModeActive,
    className,
    defaultHighlightColor = 'yellow',
    onChangeDefaultColor,
}: HighlightableTextProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [popover, setPopover] = useState<PopoverState | null>(null);
    const [noteText, setNoteText] = useState('');
    const [showUnderlineMenu, setShowUnderlineMenu] = useState(false);

    useEffect(() => {
        const handleSelection = () => {
            if (!isHighlightModeActive) {
                setPopover(null);
                return;
            }

            const selection = window.getSelection();
            if (!selection || selection.isCollapsed || !containerRef.current?.contains(selection.anchorNode)) {
                return;
            }

            const range = selection.getRangeAt(0);

            let startOffset = 0;
            const offsetWalker = document.createTreeWalker(containerRef.current, NodeFilter.SHOW_TEXT);
            let nNode;
            while ((nNode = offsetWalker.nextNode())) {
                if (nNode === range.startContainer) {
                    startOffset += range.startOffset;
                    break;
                }
                startOffset += nNode.textContent?.length || 0;
            }
            const selectedText = range.toString();

            if (selectedText.trim().length === 0) return;

            const rect = range.getBoundingClientRect();
            const id = Math.random().toString(36).substring(2, 11);
            
            // Automatically add highlight when selected
            onAddHighlight({
                id,
                start: startOffset,
                end: startOffset + selectedText.length,
                text: selectedText,
                color: defaultHighlightColor,
                isUnderline: false,
            });

            setPopover({
                rect,
                highlightId: id,
                isNoteMode: false,
                color: defaultHighlightColor
            });
            setNoteText('');
            
            window.getSelection()?.removeAllRanges();
        };

        document.addEventListener('mouseup', handleSelection);
        return () => document.removeEventListener('mouseup', handleSelection);
    }, [isHighlightModeActive, text, defaultHighlightColor]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest('.highlight-popover-container')) return;
            if (target.closest('[data-highlight-id]')) return;
            
            setPopover(null);
            window.getSelection()?.removeAllRanges();
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleContainerClick = (e: React.MouseEvent) => {
        if (!isHighlightModeActive) return;
        const target = e.target as HTMLElement;
        const highlightSpan = target.closest('[data-highlight-id]');
        if (highlightSpan) {
            const id = highlightSpan.getAttribute('data-highlight-id');
            const highlight = highlights.find(h => h.id === id);
            if (highlight) {
                const rect = highlightSpan.getBoundingClientRect();
                setPopover({
                    rect,
                    highlightId: highlight.id,
                    isNoteMode: !!highlight.note,
                    color: highlight.color || 'yellow'
                });
                setNoteText(highlight.note || '');
                window.getSelection()?.removeAllRanges();
            }
        }
    };

    const handleColorClick = (color: string) => {
        if (!popover || !popover.highlightId) return;
        
        onUpdateHighlight(popover.highlightId, { color, isUnderline: false, note: undefined });
        setPopover({ ...popover, color, isNoteMode: false });
        if (onChangeDefaultColor) {
            onChangeDefaultColor(color);
        }
    };

    const handleUnderlineClick = (style: 'solid' | 'dashed' | 'dotted' | 'none') => {
        if (!popover || !popover.highlightId) return;
        if (style === 'none') {
            onRemoveHighlight(popover.highlightId);
            setPopover(null);
        } else {
            onUpdateHighlight(popover.highlightId, { color: 'transparent', isUnderline: true, underlineStyle: style, note: undefined });
            setPopover({ ...popover, isNoteMode: false });
        }
        setShowUnderlineMenu(false);
    };

    const handleSaveNote = () => {
        if (!popover || !popover.highlightId) return;
        if (noteText.trim() === '') return;
        
        onUpdateHighlight(popover.highlightId, { color: 'transparent', isUnderline: false, note: noteText });
        setPopover(null);
        window.getSelection()?.removeAllRanges();
    };

    const handleDelete = () => {
        if (!popover || !popover.highlightId) return;
        onRemoveHighlight(popover.highlightId);
        setPopover(null);
        window.getSelection()?.removeAllRanges();
    };

    const contentKey = React.useMemo(() => {
        return highlights.map(h => `${h.id}-${h.color}-${h.isUnderline ? 'u' : 'n'}-${h.note ? 'm' : ''}`).join('|') + text.length;
    }, [highlights, text]);

    useEffect(() => {
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
                        span.classList.add(`highlight-${h.color}`);
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
    }); // Run on EVERY render to ensure spans are always present even if React wipes them

    return (
        <div className={`relative break-words whitespace-normal [text-wrap:pretty] ${className ?? ''}`}>
            <div ref={containerRef} className={`${isHighlightModeActive ? (defaultHighlightColor === 'blue' ? 'selection:bg-[#B2DFFC]/60 selection:text-[#111827] cursor-text' : defaultHighlightColor === 'pink' ? 'selection:bg-[#F8BBD0]/60 selection:text-[#111827] cursor-text' : 'selection:bg-[#FCE883]/60 selection:text-[#111827] cursor-text') : ''}`} onClick={handleContainerClick}>
                <div key={contentKey}>
                    <LatexRenderer text={text} />
                </div>
            </div>

            {popover && isHighlightModeActive && (
                <div
                    className={`highlight-popover-container fixed z-[100] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.12)] flex flex-col transition-all duration-200 ${popover.isNoteMode ? 'rounded-[14px] min-w-[280px] p-2 border border-slate-300 gap-2' : 'rounded-[14px] min-w-fit px-[6px] py-[6px] border border-slate-300'}`}
                    style={{
                        top: Math.max(10, popover.rect.top - (popover.isNoteMode ? 100 : 64)),
                        left: Math.max(10, Math.min(window.innerWidth - 300, popover.rect.left + (popover.rect.width / 2) - 140)),
                    }}
                >
                    <div className={`flex items-center justify-between ${popover.isNoteMode ? 'px-1' : ''}`}>
                        <div className="flex items-center gap-2 pr-2">
                            <button onClick={() => handleColorClick('yellow')} className={`w-[34px] h-[34px] rounded-[14px] bg-[#FCE883] transition-transform flex items-center justify-center border ${popover.color === 'yellow' ? 'border-[#111827] border-[2px]' : 'border-slate-400 hover:scale-105'}`} title="Yellow"></button>
                            <button onClick={() => handleColorClick('blue')} className={`w-[34px] h-[34px] rounded-[14px] bg-[#B2DFFC] transition-transform flex items-center justify-center border ${popover.color === 'blue' ? 'border-[#111827] border-[2px]' : 'border-slate-400 hover:scale-105'}`} title="Blue"></button>
                            <button onClick={() => handleColorClick('pink')} className={`w-[34px] h-[34px] rounded-[14px] bg-[#F8BBD0] transition-transform flex items-center justify-center border ${popover.color === 'pink' ? 'border-[#111827] border-[2px]' : 'border-slate-400 hover:scale-105'}`} title="Pink"></button>
                        </div>

                        <div className="flex items-center gap-2 pl-2">
                            <div className="relative">
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
                            </div>
                            <button onClick={handleDelete} className="w-[34px] h-[34px] rounded-[14px] hover:bg-slate-100 transition-colors flex items-center justify-center border border-slate-400" title="Delete">
                                <Trash2 className="w-[18px] h-[18px] text-[#111827] stroke-[1.5]" />
                            </button>
                            
                            <div className="w-px h-6 bg-slate-300 mx-1"></div>
                            
                            <button onClick={() => setPopover(prev => prev ? { ...prev, isNoteMode: true } : null)} className="w-[34px] h-[34px] rounded-[14px] hover:bg-slate-100 transition-colors flex items-center justify-center border border-slate-400" title="Add Note">
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
                </div>
            )}
        </div>
    );
}
