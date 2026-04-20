'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Moon, SunMedium } from 'lucide-react';
import { useSyncExternalStore } from 'react';
import { siteEase } from '@/components/SiteMotion';
import { applySiteTone, readSiteTone, subscribeToSiteTone } from '@/lib/siteTone';

export default function SiteToneDock({ className = '' }: { className?: string }) {
  const shouldReduceMotion = useReducedMotion();
  const siteTone = useSyncExternalStore(subscribeToSiteTone, readSiteTone, () => 'light');
  const isLightTone = siteTone === 'light';
  const Icon = isLightTone ? Moon : SunMedium;

  const shellClass = isLightTone
    ? 'border border-slate-200 bg-white/95 text-slate-700 shadow-[0_12px_30px_rgba(15,23,42,0.14)] hover:bg-white hover:text-blue-600'
    : 'border border-white/15 bg-slate-900/90 text-slate-100 shadow-[0_14px_35px_rgba(0,0,0,0.45)] hover:bg-slate-800/95 hover:text-blue-300';

  return (
    <motion.button
      type="button"
      onClick={() => applySiteTone(isLightTone ? 'dark' : 'light')}
      aria-label={isLightTone ? 'Switch to dark mode' : 'Switch to light mode'}
      className={`fixed bottom-4 left-4 z-[68] inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-bold tracking-wide backdrop-blur-xl transition ${shellClass} ${className}`}
      initial={shouldReduceMotion ? undefined : { opacity: 0, y: 10 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
      transition={shouldReduceMotion ? undefined : { duration: 0.24, ease: siteEase }}
    >
      <Icon className="h-4 w-4" />
      <span>{isLightTone ? 'Dark mode' : 'Light mode'}</span>
    </motion.button>
  );
}
