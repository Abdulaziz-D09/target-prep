import React, { useState, useRef, useEffect } from 'react';
import { Highlight } from '@/store/testStore';
import { Underline, MessageSquarePlus, X, Trash2 } from 'lucide-react';

interface HighlightableTextProps {
    text: string;
    highlights: Highlight[];
    onAddHighlight: (highlight: Omit<Highlight, 'id'>) => void;
    onRemoveHighlight: (id: string) => void;
    onUpdateHighlight: (id: string, updates: Partial<Highlight>) => void;
    isHighlightModeActive: boolean;
    className?: string;
}

export function HighlightableText({
    text,
    highlights,
    onAddHighlight,
    onRemoveHighlight,
    onUpdateHighlight,
    isHighlightModeActive,
    className,
}: HighlightableTextProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [selectionRect, setSelectionRect] = useState<DOMRect | null>(null);
    const [selectionRange, setSelectionRange] = useState<{ start: number, end: number, text: string } | null>(null);
    const [activeNoteHighlightId, setActiveNoteHighlightId] = useState<string | null>(null);
    const [noteText, setNoteText] = useState('');

    useEffect(() => {
        const handleSelection = () => {
            if (!isHighlightModeActive) {
                setSelectionRect(null);
                setSelectionRange(null);
                return;
            }

            const selection = window.getSelection();
            if (!selection || selection.isCollapsed || !containerRef.current?.contains(selection.anchorNode)) {
                setSelectionRect(null);
                setSelectionRange(null);
                return;
            }

            const range = selection.getRangeAt(0);

            // Calculate relative offset based on text content
            const preSelectionRange = range.cloneRange();
            preSelectionRange.selectNodeContents(containerRef.current);
            preSelectionRange.setEnd(range.startContainer, range.startOffset);
            const startOffset = preSelectionRange.toString().length;
            const selectedText = range.toString();

            if (selectedText.trim().length === 0) {
                setSelectionRect(null);
                setSelectionRange(null);
                return;
            }

            const rect = range.getBoundingClientRect();
            setSelectionRect(rect);
            setSelectionRange({
                start: startOffset,
                end: startOffset + selectedText.length,
                text: selectedText
            });
        };

        document.addEventListener('mouseup', handleSelection);
        return () => document.removeEventListener('mouseup', handleSelection);
    }, [isHighlightModeActive, text]);

    const handleApplyHighlight = (color: string, isUnderline: boolean = false) => {
        if (!selectionRange) return;

        onAddHighlight({
            start: selectionRange.start,
            end: selectionRange.end,
            text: selectionRange.text,
            color,
            isUnderline
        });

        // Clear selection
        window.getSelection()?.removeAllRanges();
        setSelectionRect(null);
        setSelectionRange(null);
    };

    // Render text with highlights
    const renderContent = () => {
        if (!highlights || highlights.length === 0) return <span>{text}</span>;

        // Sort highlights by start offset
        const sorted = [...highlights].sort((a, b) => a.start - b.start);

        const nodes: React.ReactNode[] = [];
        let currentIndex = 0;

        sorted.forEach((h) => {
            // Add unhighlighted text before this highlight
            if (h.start > currentIndex) {
                nodes.push(<span key={`text-${currentIndex}`}>{text.substring(currentIndex, h.start)}</span>);
            }

            // Draw highlight
            if (h.start < text.length && h.end > currentIndex) {
                const highlightText = text.substring(Math.max(currentIndex, h.start), Math.min(text.length, h.end));
                const highlightClass = h.isUnderline ? 'highlight-underline' : `highlight-${h.color}`;

                nodes.push(
                    <span
                        key={`hl-${h.id}`}
                        className={`relative group cursor-pointer ${highlightClass}`}
                        onClick={() => h.note ? setActiveNoteHighlightId(h.id) : null}
                    >
                        {highlightText}

                        {/* Note Indicator Indicator */}
                        {h.note && (
                            <span className="absolute -top-3 -right-2 bg-blue-500 text-white w-4 h-4 rounded-full flex items-center justify-center text-[10px] shadow-sm">
                                !
                            </span>
                        )}

                        {/* Hover Tools */}
                        {!activeNoteHighlightId && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 pb-1 hidden group-hover:flex z-50">
                                <div className="flex items-center gap-1 bg-[#111827] text-white p-1 rounded-md shadow-lg whitespace-nowrap">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setActiveNoteHighlightId(h.id); setNoteText(h.note || ''); }}
                                        className="p-1.5 hover:bg-slate-700 rounded transition-colors text-xs flex items-center gap-1"
                                    >
                                        <MessageSquarePlus className="w-3 h-3" /> Note
                                    </button>
                                    <div className="w-px h-4 bg-slate-600 mx-1"></div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onRemoveHighlight(h.id); }}
                                        className="p-1.5 hover:bg-red-500 hover:text-white rounded transition-colors text-xs flex items-center gap-1 text-red-400"
                                    >
                                        <Trash2 className="w-3 h-3" /> Remove
                                    </button>
                                </div>
                            </div>
                        )}
                    </span>
                );
                currentIndex = h.end;
            }
        });

        // Add remaining text
        if (currentIndex < text.length) {
            nodes.push(<span key={`text-${currentIndex}`}>{text.substring(currentIndex)}</span>);
        }

        return nodes;
    };

    return (
        <div className={`relative break-words whitespace-pre-wrap font-sans text-base leading-relaxed text-[#374151] [text-wrap:pretty] ${className ?? ''}`}>
            {/* The Text Container */}
            <div ref={containerRef} className={`${isHighlightModeActive ? 'selection:bg-slate-200 selection:text-black cursor-text' : ''}`}>
                {renderContent()}
            </div>

            {/* Selection Popover */}
            {selectionRect && isHighlightModeActive && (
                <div
                    className="fixed z-50 bg-[#111827] text-white p-1.5 rounded-lg shadow-xl flex items-center gap-1 animate-in zoom-in-95 duration-200"
                    style={{
                        top: selectionRect.top - 60,
                        left: selectionRect.left + (selectionRect.width / 2) - 100,
                    }}
                >
                    <button onClick={() => handleApplyHighlight('yellow')} className="w-8 h-8 rounded-md bg-yellow-300 hover:scale-110 transition-transform flex items-center justify-center border border-slate-700" title="Yellow Highlight"></button>
                    <button onClick={() => handleApplyHighlight('blue')} className="w-8 h-8 rounded-md bg-blue-300 hover:scale-110 transition-transform flex items-center justify-center border border-slate-700" title="Blue Highlight"></button>
                    <button onClick={() => handleApplyHighlight('pink')} className="w-8 h-8 rounded-md bg-pink-300 hover:scale-110 transition-transform flex items-center justify-center border border-slate-700" title="Pink Highlight"></button>

                    <div className="w-px h-6 bg-slate-600 mx-1"></div>

                    <button onClick={() => handleApplyHighlight('yellow', true)} className="w-8 h-8 rounded-md hover:bg-slate-700 transition-colors flex items-center justify-center" title="Underline">
                        <Underline className="w-4 h-4 text-white" />
                    </button>
                    <button onClick={() => {
                        handleApplyHighlight('yellow'); // Apply yellow by default when adding note directly
                        // We would need to grab the ID immediately, which is tricky since it's generated in the store. 
                        // So a slightly better UX: It just highlights, they click the highlight to add a note.
                    }} className="w-8 h-8 rounded-md hover:bg-slate-700 transition-colors flex items-center justify-center" title="Highlight & Add Note">
                        <MessageSquarePlus className="w-4 h-4 text-white" />
                    </button>
                </div>
            )}

            {/* Note Editor Dialog */}
            {activeNoteHighlightId && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setActiveNoteHighlightId(null)}>
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                <MessageSquarePlus className="w-4 h-4 text-blue-600" />
                                Add Note
                            </h3>
                            <button onClick={() => setActiveNoteHighlightId(null)} className="text-slate-500 hover:bg-slate-200 p-1 rounded-md">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="p-4">
                            <textarea
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                                placeholder="Type your notes here..."
                                className="w-full h-32 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none text-sm"
                                autoFocus
                            />
                        </div>
                        <div className="p-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50">
                            <button
                                onClick={() => setActiveNoteHighlightId(null)}
                                className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    onUpdateHighlight(activeNoteHighlightId, { note: noteText });
                                    setActiveNoteHighlightId(null);
                                }}
                                className="px-4 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
                            >
                                Save Note
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
