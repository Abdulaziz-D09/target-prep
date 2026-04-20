import React, { useState, useRef, useEffect } from 'react';
import { X, GripHorizontal } from 'lucide-react';

interface ReferenceSheetProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ReferenceSheet({ isOpen, onClose }: ReferenceSheetProps) {
    const [position, setPosition] = useState({ x: 100, y: 100 });
    const [isDragging, setIsDragging] = useState(false);
    const dragStartPos = useRef({ x: 0, y: 0 });
    const modalRef = useRef<HTMLDivElement>(null);

    // Only set initial centered position once when opened
    useEffect(() => {
        if (isOpen && position.x === 100 && position.y === 100) {
            const x = window.innerWidth > 600 ? (window.innerWidth - 600) / 2 : 10;
            const y = (window.innerHeight - 600) / 2;
            setPosition({ x: Math.max(0, x), y: Math.max(0, y) });
        }
    }, [isOpen, position.x, position.y]);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        dragStartPos.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y
        };
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;
            
            // Constrain to window bounds roughly
            let newX = e.clientX - dragStartPos.current.x;
            let newY = e.clientY - dragStartPos.current.y;
            
            // Basic bounds checking
            if (newX < 0) newX = 0;
            if (newY < 0) newY = 0;
            if (newX > window.innerWidth - 200) newX = window.innerWidth - 200;
            if (newY > window.innerHeight - 100) newY = window.innerHeight - 100;
            
            setPosition({ x: newX, y: newY });
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    if (!isOpen) return null;

    return (
        <div 
            ref={modalRef}
            className="fixed z-[100] bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] border border-slate-200 flex flex-col overflow-hidden"
            style={{ 
                left: position.x, 
                top: position.y,
                width: 'min(90vw, 550px)',
                height: 'min(85vh, 600px)',
                userSelect: isDragging ? 'none' : 'auto'
            }}
            onClick={e => e.stopPropagation()}
        >
            {/* Draggable Header */}
            <div 
                className="flex items-center justify-between p-3 border-b border-slate-200 bg-slate-50 cursor-grab active:cursor-grabbing"
                onMouseDown={handleMouseDown}
            >
                <div className="flex items-center gap-2 px-2 text-slate-400">
                    <GripHorizontal className="w-5 h-5" />
                    <h2 className="text-[15px] leading-none font-bold text-slate-800 tracking-tight">Reference Sheet</h2>
                </div>
                <button 
                    onClick={onClose} 
                    className="p-1.5 hover:bg-slate-200 text-slate-500 rounded-md transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto p-6 bg-white flex-1">
                <div className="grid grid-cols-2 gap-x-6 gap-y-8 items-center justify-items-center">
                    {/* Circle */}
                    <div className="text-center flex flex-col items-center">
                        <div className="w-20 h-20 rounded-full border-[1.5px] border-black flex items-center justify-center relative mb-3">
                            <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                            <div className="absolute top-1/2 left-1/2 w-10 h-[1.5px] bg-black origin-left"></div>
                            <span className="absolute top-1/2 right-3 -translate-y-[18px] text-[14px] italic">r</span>
                        </div>
                        <p className="text-[17px] italic"><span className="not-italic">A = </span>πr²</p>
                        <p className="text-[16px] italic mt-1"><span className="not-italic">C = </span>2πr</p>
                    </div>
                    {/* Rectangle */}
                    <div className="text-center flex flex-col items-center">
                        <div className="w-28 h-14 border-[1.5px] border-black relative mb-5 mt-3">
                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[14px] italic">ℓ</span>
                            <span className="absolute top-1/2 -right-5 -translate-y-1/2 text-[14px] italic">w</span>
                        </div>
                        <p className="text-[20px] italic"><span className="not-italic">A = </span>ℓw</p>
                    </div>
                    {/* Triangle */}
                    <div className="text-center flex flex-col items-center">
                        <svg width="80" height="65" viewBox="0 0 100 80" className="mb-3">
                            <polygon points="10,70 90,70 40,10" fill="none" stroke="black" strokeWidth="1.5" />
                            <line x1="40" y1="10" x2="40" y2="70" stroke="black" strokeDasharray="4,4" strokeWidth="1.5" />
                            <rect x="40" y="60" width="10" height="10" fill="none" stroke="black" strokeWidth="1.5" />
                            <text x="50" y="45" fontStyle="italic" fontSize="16">h</text>
                            <text x="40" y="86" fontStyle="italic" fontSize="16" textAnchor="middle">b</text>
                        </svg>
                        <p className="text-[17px] italic">
                            <span className="not-italic">A = </span>½bh
                        </p>
                    </div>
                    {/* Right Triangle */}
                    <div className="text-center flex flex-col items-center">
                        <svg width="100" height="65" viewBox="0 0 120 80" className="mb-3">
                            <polygon points="20,10 20,70 100,70" fill="none" stroke="black" strokeWidth="1.5" />
                            <rect x="20" y="60" width="10" height="10" fill="none" stroke="black" strokeWidth="1.5" />
                            <text x="6" y="45" fontStyle="italic" fontSize="16">a</text>
                            <text x="60" y="86" fontStyle="italic" fontSize="16">b</text>
                            <text x="65" y="32" fontStyle="italic" fontSize="16">c</text>
                        </svg>
                        <p className="text-[17px] italic">c² = a² + b²</p>
                    </div>
                    {/* Rectangular Prism */}
                    <div className="text-center flex flex-col items-center">
                        <svg width="100" height="65" viewBox="0 0 120 80" className="mb-3">
                            <polygon points="10,40 70,40 90,20 30,20" fill="none" stroke="black" strokeWidth="1.5" />
                            <rect x="10" y="40" width="60" height="30" fill="none" stroke="black" strokeWidth="1.5" />
                            <polygon points="70,40 90,20 90,50 70,70" fill="none" stroke="black" strokeWidth="1.5" />
                            <text x="35" y="86" fontStyle="italic" fontSize="16">ℓ</text>
                            <text x="85" y="68" fontStyle="italic" fontSize="16">w</text>
                            <text x="102" y="38" fontStyle="italic" fontSize="16">h</text>
                        </svg>
                        <p className="text-[20px] italic"><span className="not-italic">V = </span>ℓwh</p>
                    </div>
                    {/* Cylinder */}
                    <div className="text-center flex flex-col items-center">
                        <svg width="80" height="65" viewBox="0 0 100 80" className="mb-3 mt-1">
                            <ellipse cx="50" cy="20" rx="40" ry="10" fill="none" stroke="black" strokeWidth="1.5" />
                            <path d="M 10,20 L 10,60 A 40 10 0 0 0 90,60 L 90,20" fill="none" stroke="black" strokeWidth="1.5" />
                            <circle cx="50" cy="20" r="2" fill="black" />
                            <line x1="50" y1="20" x2="90" y2="20" stroke="black" strokeWidth="1.5" />
                            <text x="68" y="15" fontStyle="italic" fontSize="16">r</text>
                            <text x="95" y="45" fontStyle="italic" fontSize="16">h</text>
                        </svg>
                        <p className="text-[18px] italic"><span className="not-italic">V = </span>πr²h</p>
                    </div>
                    {/* Sphere */}
                    <div className="text-center flex flex-col items-center mt-2">
                        <svg width="65" height="65" viewBox="0 0 80 80" className="mb-3">
                            <circle cx="40" cy="40" r="35" fill="none" stroke="black" strokeWidth="1.5" />
                            <ellipse cx="40" cy="40" rx="35" ry="10" fill="none" stroke="black" strokeWidth="1.5" strokeDasharray="4,4" />
                            <circle cx="40" cy="40" r="2" fill="black" />
                            <line x1="40" y1="40" x2="75" y2="40" stroke="black" strokeWidth="1.5" />
                            <text x="55" y="35" fontStyle="italic" fontSize="16">r</text>
                        </svg>
                        <p className="text-[17px] italic">
                            <span className="not-italic">V = </span>⁴⁄₃πr³
                        </p>
                    </div>
                    {/* Cone */}
                    <div className="text-center flex flex-col items-center mt-2">
                        <svg width="65" height="75" viewBox="0 0 80 90" className="mb-3">
                            <ellipse cx="40" cy="70" rx="30" ry="8" fill="none" stroke="black" strokeWidth="1.5" strokeDasharray="4,4" />
                            <path d="M 10,70 L 40,10 L 70,70 A 30 8 0 0 1 10,70" fill="none" stroke="black" strokeWidth="1.5" />
                            <line x1="40" y1="10" x2="40" y2="70" stroke="black" strokeDasharray="4,4" strokeWidth="1.5" />
                            <rect x="40" y="64" width="6" height="6" fill="none" stroke="black" strokeWidth="1.5" />
                            <line x1="40" y1="70" x2="70" y2="70" stroke="black" strokeDasharray="4,4" strokeWidth="1.5" />
                            <text x="55" y="64" fontStyle="italic" fontSize="16">r</text>
                            <text x="45" y="45" fontStyle="italic" fontSize="16">h</text>
                        </svg>
                        <p className="text-[17px] italic">
                            <span className="not-italic">V = </span>⅓πr²h
                        </p>
                    </div>
                    {/* Pyramid */}
                    <div className="text-center flex flex-col items-center mt-2">
                        <svg width="80" height="75" viewBox="0 0 100 90" className="mb-3">
                            <line x1="10" y1="70" x2="40" y2="50" stroke="black" strokeWidth="1.5" strokeDasharray="4,4" />
                            <line x1="40" y1="50" x2="90" y2="50" stroke="black" strokeWidth="1.5" strokeDasharray="4,4" />
                            <line x1="10" y1="70" x2="60" y2="70" stroke="black" strokeWidth="1.5" />
                            <line x1="60" y1="70" x2="90" y2="50" stroke="black" strokeWidth="1.5" />
                            <line x1="10" y1="70" x2="50" y2="10" stroke="black" strokeWidth="1.5" />
                            <line x1="60" y1="70" x2="50" y2="10" stroke="black" strokeWidth="1.5" />
                            <line x1="90" y1="50" x2="50" y2="10" stroke="black" strokeWidth="1.5" />
                            <line x1="40" y1="50" x2="50" y2="10" stroke="black" strokeWidth="1.5" strokeDasharray="4,4" />
                            <line x1="50" y1="10" x2="50" y2="60" stroke="black" strokeWidth="1.5" strokeDasharray="4,4" />
                            <polyline points="50,54 56,54 56,60" fill="none" stroke="black" strokeWidth="1.5" />
                            <text x="35" y="86" fontStyle="italic" fontSize="16">ℓ</text>
                            <text x="80" y="72" fontStyle="italic" fontSize="16">w</text>
                            <text x="38" y="45" fontStyle="italic" fontSize="16">h</text>
                        </svg>
                        <p className="text-[17px] italic">
                            <span className="not-italic">V = </span>⅓ℓwh
                        </p>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-200">
                    <p className="text-[16px] text-slate-800 leading-relaxed mb-4">
                        The number of degrees of arc in a circle is 360.
                    </p>
                    <p className="text-[16px] text-slate-800 leading-relaxed mb-4">
                        The number of radians of arc in a circle is 2π.
                    </p>
                    <p className="text-[16px] text-slate-800 leading-relaxed">
                        The sum of the measures in degrees of the angles of a triangle is 180.
                    </p>
                </div>
            </div>
        </div>
    );
}
