'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

function CountUp({ target, duration = 1.5, suffix = '' }: { target: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const start = Date.now();
    const step = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

interface ScorePoint {
  month: string;
  score: number;
}

const data: ScorePoint[] = [
  { month: 'Jan', score: 1180 },
  { month: 'Feb', score: 1220 },
  { month: 'Mar', score: 1275 },
  { month: 'Apr', score: 1320 },
  { month: 'May', score: 1390 },
  { month: 'Jun', score: 1450 },
];

function SparkLine() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true });
  const min = 1100, max = 1600;
  const W = 280, H = 80;
  const pts = data.map((d, i) => ({
    x: (i / (data.length - 1)) * W,
    y: H - ((d.score - min) / (max - min)) * H,
  }));
  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const fill = `${path} L ${pts[pts.length - 1].x} ${H} L 0 ${H} Z`;
  const totalLen = 400;

  return (
    <div className="relative">
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} width="100%" height="80" className="overflow-visible">
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>
          <linearGradient id="fillGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#4F46E5" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path d={fill} fill="url(#fillGrad)" initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.5, duration: 0.8 }} />
        <motion.path
          d={path}
          fill="none"
          stroke="url(#lineGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : {}}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        />
        {pts.map((p, i) => (
          <motion.circle
            key={i}
            cx={p.x} cy={p.y} r="4"
            fill="#4F46E5"
            stroke="#1e1b4b"
            strokeWidth="2"
            initial={{ scale: 0 }}
            animate={inView ? { scale: 1 } : {}}
            transition={{ delay: 0.9 + i * 0.07, duration: 0.3 }}
          />
        ))}
      </svg>
      <div className="flex justify-between mt-2">
        {data.map(d => (
          <span key={d.month} className="text-[10px] text-slate-500">{d.month}</span>
        ))}
      </div>
    </div>
  );
}

function AccuracyRing({ pct, color, label }: { pct: number; color: string; label: string }) {
  const ref = useRef<SVGCircleElement>(null);
  const inView = useInView(ref, { once: true });
  const R = 30, C = 2 * Math.PI * R;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="80" height="80" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
        <motion.circle
          ref={ref}
          cx="40" cy="40" r={R}
          fill="none"
          stroke={color}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={C}
          initial={{ strokeDashoffset: C }}
          animate={inView ? { strokeDashoffset: C * (1 - pct / 100) } : {}}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          transform="rotate(-90 40 40)"
        />
        <text x="40" y="44" textAnchor="middle" fontSize="14" fontWeight="700" fill="white">{pct}%</text>
      </svg>
      <span className="text-xs text-slate-400 text-center leading-tight">{label}</span>
    </div>
  );
}

export function DashboardMockup() {
  return (
    <div className="space-y-4">
      {/* Score card */}
      <div className="rounded-2xl border border-white/10 p-5" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-slate-500 font-medium">Score over time</span>
          <span className="text-xs font-bold text-emerald-400">+270 pts</span>
        </div>
        <div className="text-2xl font-black text-white mb-3 font-mono">
          <CountUp target={1450} duration={1.8} />
        </div>
        <SparkLine />
        <div className="flex justify-between mt-4 pt-4 border-t border-white/5">
          {data.map((d, i) => (
            <div key={d.month} className="text-center">
              <div className="text-xs font-mono font-bold text-slate-300">{d.score}</div>
              <div className="text-[10px] text-slate-600">{d.month}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Accuracy rings */}
      <div className="rounded-2xl border border-white/10 p-5" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <p className="text-xs text-slate-500 mb-4 font-medium">Accuracy by Domain</p>
        <div className="flex items-center justify-around">
          <AccuracyRing pct={91} color="#818cf8" label="Algebra" />
          <AccuracyRing pct={78} color="#c084fc" label="Advanced Math" />
          <AccuracyRing pct={84} color="#34d399" label="Reading" />
          <AccuracyRing pct={72} color="#f59e0b" label="Grammar" />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Questions Done', value: 847, suffix: '' },
          { label: 'Tests Completed', value: 6, suffix: '' },
          { label: 'Avg Accuracy', value: 81, suffix: '%' },
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-white/10 p-3 text-center" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <div className="text-lg font-black text-white font-mono">
              <CountUp target={s.value} duration={1.5} suffix={s.suffix} />
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
