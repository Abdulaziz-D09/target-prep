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
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute z-[100] mt-2 w-full min-w-[200px] right-0 rounded-2xl bg-white dark:bg-slate-800 p-2 shadow-xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden"
                    >
                        <div className="max-h-64 overflow-y-auto pr-1 custom-scrollbar">
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
                                        className={`flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-left text-[14px] font-medium transition-all ${
                                            isSelected 
                                                ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold' 
                                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                                        }`}
                                    >
                                        <span className="truncate mr-3">{option.label}</span>
                                        {isSelected && <Check className="h-4 w-4 shrink-0" />}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
