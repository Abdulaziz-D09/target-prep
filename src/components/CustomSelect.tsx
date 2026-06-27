'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Option {
    value: string;
    label: string;
}

interface CustomSelectProps {
    value: string;
    onChange: (val: string) => void;
    options: Option[];
    placeholder?: string;
    className?: string;
    buttonClassName?: string;
}

export function CustomSelect({ value, onChange, options, placeholder = "Select...", className = "", buttonClassName }: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(o => String(o.value) === String(value));

    const defaultBtnClass = `w-full flex items-center justify-between rounded-full bg-white dark:bg-slate-800 px-5 py-3 text-[15px] font-bold site-text-strong transition shadow-sm border border-slate-200/50 dark:border-slate-700/50 hover:border-indigo-500/30 ${isOpen ? 'ring-2 ring-indigo-500 border-indigo-500' : 'focus:outline-none focus:ring-2 focus:ring-indigo-500/50'}`;
    
    return (
        <div className={`relative inline-block w-full ${className}`} ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={buttonClassName || defaultBtnClass}
            >
                <span className="truncate pr-4">{selectedOption ? selectedOption.label : placeholder}</span>
                <ChevronDown className={`h-4 w-4 site-text-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            transition={{ type: "spring", duration: 0.3 }}
                            className="relative w-full max-w-xs rounded-[20px] bg-white dark:bg-slate-800 shadow-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden flex flex-col max-h-[60vh]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="px-4 pt-4 pb-2">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{placeholder}</p>
                            </div>
                            <div className="overflow-y-auto px-2 pb-2 custom-scrollbar">
                                {options.map((option) => {
                                    const isSelected = String(option.value) === String(value);
                                    return (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => {
                                                onChange(option.value);
                                                setIsOpen(false);
                                            }}
                                            className={`flex w-full items-center justify-between rounded-xl px-4 py-2.5 my-0.5 text-left text-[13px] transition-all ${
                                                isSelected 
                                                    ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-black' 
                                                    : 'text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-700/50'
                                            }`}
                                        >
                                            <span className="truncate mr-3">{option.label}</span>
                                            {isSelected && <Check className="h-4 w-4 shrink-0" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
