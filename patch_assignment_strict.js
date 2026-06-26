const fs = require('fs');
const file = 'src/app/classroom/assignment/[id]/page.tsx';

let content = fs.readFileSync(file, 'utf8');

// 1. Add new state variables for fsWarningCountdown and isKickedOut
const stateVarsOld = `    const [warningCountdown, setWarningCountdown] = useState<number | null>(null);`;
const stateVarsNew = `    const [fsWarningCountdown, setFsWarningCountdown] = useState<number | null>(null);
    const [isKickedOut, setIsKickedOut] = useState(false);
    const fsCountdownRef = useRef<NodeJS.Timeout | null>(null);`;
content = content.replace(stateVarsOld, stateVarsNew);

// Add useRef import if not there
if (!content.includes('useRef')) {
    content = content.replace("import React, { useState, useEffect", "import React, { useState, useEffect, useRef");
}

// Add AlertTriangle icon if not there
if (!content.includes('AlertTriangle')) {
    content = content.replace("import { ", "import { AlertTriangle, ");
}


// 2. Fix hydration mode bug
content = content.replace(
    "setMode(saved.completed ? 'complete' : 'intro');",
    "setMode(saved.completed ? 'complete' : (saved.hasStarted ? 'test' : 'intro'));"
);


// 3. Replace the Strict Mode Listener
const oldListener = `    // ── Strict Mode Listener ──────────────────────────────────────────────────

    useEffect(() => {
        if (assignment?.allowExit !== false || mode !== 'test') return;

        const handleFullscreenChange = () => {
            if (!document.fullscreenElement) {
                setWarningCountdown(assignment.strictToleranceSeconds ?? 5);
            } else {
                setWarningCountdown(null);
            }
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, [assignment?.allowExit, mode]);

    useEffect(() => {
        if (warningCountdown === null) return;

        if (warningCountdown <= 0) {
            setWarningCountdown(null);
            setMode('complete');
            return;
        }

        const timer = setTimeout(() => {
            setWarningCountdown(prev => (prev !== null ? prev - 1 : null));
        }, 1000);

        return () => clearTimeout(timer);
    }, [warningCountdown]);`;

const newListener = `    // ── Strict Mode Listener ──────────────────────────────────────────────────

    useEffect(() => {
        if (assignment?.allowExit !== false || mode !== 'test') return;

        // Enter fullscreen on mount
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
        }

        let lostComplianceAt: number | null = null;

        const checkCompliance = () => {
            const isCompliant = !!document.fullscreenElement && !document.hidden && document.hasFocus();

            if (!isCompliant) {
                if (!fsCountdownRef.current) {
                    lostComplianceAt = Date.now();
                    setFsWarningCountdown(assignment.strictToleranceSeconds ?? 5);
                    fsCountdownRef.current = setInterval(() => {
                        if (!lostComplianceAt) return;
                        const elapsed = Math.floor((Date.now() - lostComplianceAt) / 1000);
                        const remaining = (assignment.strictToleranceSeconds ?? 5) - elapsed;

                        if (remaining <= 0) {
                            clearInterval(fsCountdownRef.current!);
                            fsCountdownRef.current = null;
                            setFsWarningCountdown(null);
                            setIsKickedOut(true);
                            setMode('complete'); // Force submission
                        } else {
                            setFsWarningCountdown(remaining);
                        }
                    }, 500);
                }
            } else {
                if (lostComplianceAt && (Date.now() - lostComplianceAt) >= ((assignment.strictToleranceSeconds ?? 5) * 1000)) {
                    if (fsCountdownRef.current) clearInterval(fsCountdownRef.current);
                    fsCountdownRef.current = null;
                    setFsWarningCountdown(null);
                    setIsKickedOut(true);
                    setMode('complete');
                    return;
                }

                if (fsCountdownRef.current) {
                    clearInterval(fsCountdownRef.current);
                    fsCountdownRef.current = null;
                    setFsWarningCountdown(null);
                    lostComplianceAt = null;
                }
            }
        };

        const interval = setInterval(checkCompliance, 500);
        
        // Also bind to events for immediate reaction
        document.addEventListener('fullscreenchange', checkCompliance);
        document.addEventListener('visibilitychange', checkCompliance);
        window.addEventListener('blur', checkCompliance);
        window.addEventListener('focus', checkCompliance);

        return () => {
            clearInterval(interval);
            if (fsCountdownRef.current) clearInterval(fsCountdownRef.current);
            document.removeEventListener('fullscreenchange', checkCompliance);
            document.removeEventListener('visibilitychange', checkCompliance);
            window.removeEventListener('blur', checkCompliance);
            window.removeEventListener('focus', checkCompliance);
        };
    }, [assignment?.allowExit, assignment?.strictToleranceSeconds, mode]);`;

content = content.replace(oldListener, newListener);

// 4. Inject the overlay JSX
const overlayJSX = `
            {/* Fullscreen Warning Overlay */}
            {fsWarningCountdown !== null && !isKickedOut && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-red-600">
                    <div className="bg-white rounded-3xl p-10 max-w-xl w-full text-center shadow-2xl animate-in zoom-in-95 duration-300">
                        <AlertTriangle className="w-24 h-24 text-red-500 mx-auto mb-6 animate-pulse" />
                        <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Return to Full Screen</h2>
                        <p className="text-xl text-slate-600 mb-8 font-medium leading-relaxed">
                            Strict Mode is enabled. You must return to full screen immediately or your exam will be automatically submitted.
                        </p>
                        <div className="bg-red-50 border-4 border-red-100 rounded-2xl p-8 mb-8">
                            <p className="text-sm font-bold text-red-400 uppercase tracking-widest mb-2">Time Remaining</p>
                            <div className="text-8xl font-black text-red-600 tabular-nums leading-none">
                                {fsWarningCountdown}
                            </div>
                        </div>
                        <button
                            onClick={async () => {
                                try {
                                    await document.documentElement.requestFullscreen();
                                } catch (e) {
                                    console.error("Could not enter fullscreen:", e);
                                }
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white font-black text-xl px-12 py-5 rounded-full w-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                        >
                            RETURN TO EXAM
                        </button>
                    </div>
                </div>
            )}

            {/* Kicked Out Overlay */}
            {isKickedOut && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-red-900/95 backdrop-blur-md">
                    <div className="bg-white rounded-3xl p-10 max-w-lg w-full text-center shadow-2xl">
                        <LogOut className="w-20 h-20 text-red-500 mx-auto mb-6" />
                        <h2 className="text-3xl font-black text-slate-900 mb-4">You Have Been Removed</h2>
                        <p className="text-lg text-slate-600 mb-8 font-medium">
                            The instructor has removed you from this assignment session. You are no longer permitted to continue this exam.
                        </p>
                        <button
                            onClick={() => router.push('/dashboard/classes')}
                            className="bg-slate-900 hover:bg-black text-white font-bold text-lg px-8 py-4 rounded-full w-full transition-colors"
                        >
                            Return to Dashboard
                        </button>
                    </div>
                </div>
            )}`;

content = content.replace("{/* ── Header ── */}", overlayJSX + "\n\n            {/* ── Header ── */}");

fs.writeFileSync(file, content);
