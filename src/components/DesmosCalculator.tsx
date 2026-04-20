'use client';
import { useEffect, useRef, useState } from 'react';

declare global {
    interface Window {
        Desmos: {
            GraphingCalculator: (el: HTMLElement, opts?: Record<string, unknown>) => DesmosCalc;
            ScientificCalculator: (el: HTMLElement, opts?: Record<string, unknown>) => DesmosCalc;
        };
    }
}

interface DesmosCalc {
    destroy: () => void;
    resize: () => void;
}

interface DesmosCalculatorProps {
    mode: 'graphing' | 'scientific';
    isDragging?: boolean;
}

export default function DesmosCalculator({ mode, isDragging }: DesmosCalculatorProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const calcRef = useRef<DesmosCalc | null>(null);
    const [isLoaded, setIsLoaded] = useState(() => typeof window !== 'undefined' && !!window.Desmos);
    const [error, setError] = useState(false);
    const currentModeRef = useRef(mode);

    // Load the Desmos API script once
    useEffect(() => {
        if (window.Desmos) return;

        const existingScript = document.querySelector('script[src*="desmos.com/api"]');
        if (existingScript) {
            const handleLoad = () => setIsLoaded(true);
            existingScript.addEventListener('load', handleLoad);
            return () => existingScript.removeEventListener('load', handleLoad);
        }

        const script = document.createElement('script');
        script.src = 'https://www.desmos.com/api/v1.11/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6';
        script.async = true;
        script.onload = () => setIsLoaded(true);
        script.onerror = () => setError(true);
        document.head.appendChild(script);
    }, []);

    // Create / recreate calculator when mode changes or API loads
    useEffect(() => {
        if (!isLoaded || !containerRef.current || !window.Desmos) return;

        // Destroy previous instance
        if (calcRef.current) {
            calcRef.current.destroy();
            calcRef.current = null;
        }

        // Clear container
        containerRef.current.innerHTML = '';

        const opts = {
            fontSize: 14,
            border: false,
            settingsMenu: false,
            zoomButtons: true,
            expressionsTopbar: mode === 'graphing',
            lockViewport: false,
        };

        if (mode === 'graphing') {
            calcRef.current = window.Desmos.GraphingCalculator(containerRef.current, opts);
        } else {
            calcRef.current = window.Desmos.ScientificCalculator(containerRef.current, {
                ...opts,
                expressionsTopbar: false,
            });
        }

        currentModeRef.current = mode;

        return () => {
            if (calcRef.current) {
                calcRef.current.destroy();
                calcRef.current = null;
            }
        };
    }, [isLoaded, mode]);

    // Resize the calculator when the panel size changes
    useEffect(() => {
        if (!isDragging && calcRef.current) {
            // Give DOM time to settle if dragging finished
            const t = setTimeout(() => calcRef.current?.resize(), 50);
            return () => clearTimeout(t);
        }
    }, [isDragging]);

    // Use ResizeObserver to ensure it handles hiding/showing correctly
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        
        const observer = new ResizeObserver(() => {
            if (calcRef.current) {
                calcRef.current.resize();
            }
        });
        
        observer.observe(container);
        
        return () => {
            observer.disconnect();
        };
    }, []);

    if (error) {
        return (
            <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
                Failed to load Desmos. Please check your internet connection.
            </div>
        );
    }

    if (!isLoaded) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 rounded-full border-[3px] border-slate-200 border-t-blue-600 animate-spin"></div>
                    <span className="text-sm text-slate-500 font-medium">Loading Calculator...</span>
                </div>
            </div>
        );
    }

    return (
        <>
            {isDragging && (
                <div className="absolute inset-0 z-30 cursor-col-resize" />
            )}
            <div ref={containerRef} className="flex-1 w-full" style={{ minHeight: 0 }} />
        </>
    );
}
