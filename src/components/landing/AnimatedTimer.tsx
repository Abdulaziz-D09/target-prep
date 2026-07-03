'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function AnimatedTimer() {
  const [seconds, setSeconds] = useState(35 * 60);
  const [answered, setAnswered] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(s => (s <= 0 ? 35 * 60 : s - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');

  const handleAnswer = (idx: number) => {
    setAnswered(idx);
    setShowFeedback(true);
  };

  const correctIdx = 2; // C is correct
  const options = [
    { letter: 'A', text: '8x + 4y = 32' },
    { letter: 'B', text: '8x − 4y = 32' },
    { letter: 'C', text: '4x + 10y = 32' },
    { letter: 'D', text: '4x − 10y = 32' },
  ];

  return (
    <div className="relative rounded-2xl border border-white/10 overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)' }}>
      {/* Top Bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/10" style={{ background: 'rgba(255,255,255,0.03)' }}>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500/80" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          <span className="ml-3 text-slate-400 text-xs font-medium">Target Prep · Math Module 2</span>
        </div>
        {/* Timer */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-sm font-bold text-white tabular-nums">{mins}:{secs}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 bg-white/5">
        <motion.div
          className="h-full"
          style={{ background: 'linear-gradient(90deg, #4F46E5, #7C3AED)' }}
          initial={{ width: '0%' }}
          animate={{ width: '45%' }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.16,1,0.3,1] }}
        />
      </div>

      {/* Question */}
      <div className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">Question 16 of 22</span>
          <span className="text-xs text-slate-500">Hard · Algebra</span>
        </div>

        <p className="text-slate-200 text-sm leading-relaxed mb-5">
          A line in the <em>xy</em>-plane passes through the points <span className="text-indigo-300 font-mono">(0, 8)</span> and <span className="text-indigo-300 font-mono">(8, 0)</span>. Which of the following equations represents this line?
        </p>

        <div className="space-y-2">
          {options.map((opt, i) => {
            const isSelected = answered === i;
            const isCorrect = i === correctIdx;
            let borderColor = 'border-white/10';
            let bgColor = 'rgba(255,255,255,0.02)';
            let textColor = 'text-slate-300';

            if (showFeedback) {
              if (isCorrect) { borderColor = 'border-emerald-500/50'; bgColor = 'rgba(16,185,129,0.1)'; textColor = 'text-emerald-300'; }
              else if (isSelected && !isCorrect) { borderColor = 'border-rose-500/50'; bgColor = 'rgba(239,68,68,0.1)'; textColor = 'text-rose-300'; }
            } else if (isSelected) {
              borderColor = 'border-indigo-500/60'; bgColor = 'rgba(79,70,229,0.15)'; textColor = 'text-indigo-200';
            }

            return (
              <motion.button
                key={i}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleAnswer(i)}
                className={`w-full text-left px-4 py-3 rounded-xl border ${borderColor} transition-all text-sm flex items-center gap-3 cursor-pointer`}
                style={{ background: bgColor }}
              >
                <span className={`font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${isSelected || (showFeedback && isCorrect) ? 'bg-indigo-500/30 text-indigo-300' : 'text-slate-500'}`}>
                  {opt.letter}
                </span>
                <span className={`font-mono text-sm ${textColor}`}>{opt.text}</span>
                {showFeedback && isCorrect && (
                  <span className="ml-auto text-emerald-400 text-xs font-semibold">✓ Correct</span>
                )}
                {showFeedback && isSelected && !isCorrect && (
                  <span className="ml-auto text-rose-400 text-xs font-semibold">✗ Incorrect</span>
                )}
              </motion.button>
            );
          })}
        </div>

        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 rounded-xl border border-emerald-500/20 text-sm text-slate-300 leading-relaxed"
            style={{ background: 'rgba(16,185,129,0.05)' }}
          >
            <span className="text-emerald-400 font-semibold">Explanation: </span>
            The line passes through (0,8) and (8,0), so slope = −1, y-intercept = 8. Equation: x + y = 8, or 4x + 10y = 32 when rewritten in standard form.
          </motion.div>
        )}
      </div>
    </div>
  );
}
