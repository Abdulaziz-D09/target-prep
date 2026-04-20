'use client';

import { motion, useReducedMotion, type MotionStyle, type Variants } from 'framer-motion';

export const siteEase = [0.22, 1, 0.36, 1] as const;

export const pageRevealVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 14,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.36,
      ease: siteEase,
      staggerChildren: 0.045,
      delayChildren: 0.01,
    },
  },
};

export const sectionRevealVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 14,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.34,
      ease: siteEase,
    },
  },
};

export const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.01,
    },
  },
};

export const itemRevealVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
    scale: 0.992,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.28,
      ease: siteEase,
    },
  },
};

type FloatingTheme = 'home' | 'practice' | 'question-bank' | 'neutral';

type FloatingGlow = {
  className: string;
  style: MotionStyle;
  animate: Record<string, number[]>;
  transition: {
    duration: number;
    repeat: number;
    ease: 'easeInOut';
    delay?: number;
  };
};

const floatingThemes: Record<FloatingTheme, FloatingGlow[]> = {
  home: [
    {
      className: 'right-[6rem] top-[5rem] h-[220px] w-[220px] rounded-full blur-[95px]',
      style: { background: 'rgba(109, 96, 102, 0.12)' },
      animate: { y: [0, -10, 0], x: [0, 8, 0], opacity: [0.5, 0.82, 0.5] },
      transition: { duration: 12, repeat: Infinity, ease: 'easeInOut' },
    },
    {
      className: 'left-[3rem] top-[13rem] h-[160px] w-[160px] rounded-full blur-[85px]',
      style: { background: 'rgba(142, 31, 61, 0.11)' },
      animate: { y: [0, 9, 0], x: [0, -6, 0], opacity: [0.3, 0.56, 0.3] },
      transition: { duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 0.6 },
    },
    {
      className: 'left-[7rem] bottom-[2rem] h-[130px] w-[130px] rounded-full blur-[70px]',
      style: { background: 'rgba(134, 122, 112, 0.08)' },
      animate: { y: [0, -6, 0], x: [0, 4, 0], opacity: [0.26, 0.46, 0.26] },
      transition: { duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1.1 },
    },
  ],
  practice: [
    {
      className: 'right-[7rem] top-[4rem] h-[240px] w-[240px] rounded-full blur-[100px]',
      style: { background: 'rgba(108, 96, 102, 0.11)' },
      animate: { y: [0, -10, 0], x: [0, 8, 0], opacity: [0.46, 0.76, 0.46] },
      transition: { duration: 12, repeat: Infinity, ease: 'easeInOut' },
    },
    {
      className: 'right-[1rem] top-[16rem] h-[170px] w-[170px] rounded-full blur-[90px]',
      style: { background: 'rgba(124, 88, 102, 0.09)' },
      animate: { y: [0, 10, 0], x: [0, -5, 0], opacity: [0.26, 0.5, 0.26] },
      transition: { duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 0.6 },
    },
    {
      className: 'left-[4rem] bottom-[2rem] h-[140px] w-[140px] rounded-full blur-[75px]',
      style: { background: 'rgba(128, 109, 103, 0.07)' },
      animate: { y: [0, -6, 0], x: [0, 4, 0], opacity: [0.22, 0.42, 0.22] },
      transition: { duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1.1 },
    },
  ],
  'question-bank': [
    {
      className: 'right-[5rem] top-[5rem] h-[230px] w-[230px] rounded-full blur-[100px]',
      style: { background: 'rgba(108, 96, 102, 0.11)' },
      animate: { y: [0, -10, 0], x: [0, 8, 0], opacity: [0.44, 0.74, 0.44] },
      transition: { duration: 12, repeat: Infinity, ease: 'easeInOut' },
    },
    {
      className: 'right-[2rem] top-[14rem] h-[170px] w-[170px] rounded-full blur-[90px]',
      style: { background: 'rgba(142, 31, 61, 0.12)' },
      animate: { y: [0, 10, 0], x: [0, -4, 0], opacity: [0.26, 0.52, 0.26] },
      transition: { duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 0.6 },
    },
    {
      className: 'left-[6rem] bottom-[2rem] h-[130px] w-[130px] rounded-full blur-[70px]',
      style: { background: 'rgba(134, 122, 112, 0.08)' },
      animate: { y: [0, -6, 0], x: [0, 4, 0], opacity: [0.22, 0.42, 0.22] },
      transition: { duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1.1 },
    },
  ],
  neutral: [
    {
      className: 'right-[6rem] top-[5rem] h-[220px] w-[220px] rounded-full blur-[95px]',
      style: { background: 'rgba(108, 96, 102, 0.1)' },
      animate: { y: [0, -10, 0], x: [0, 8, 0], opacity: [0.38, 0.66, 0.38] },
      transition: { duration: 12, repeat: Infinity, ease: 'easeInOut' },
    },
    {
      className: 'left-[4rem] top-[14rem] h-[150px] w-[150px] rounded-full blur-[80px]',
      style: { background: 'rgba(142, 31, 61, 0.08)' },
      animate: { y: [0, 9, 0], x: [0, -6, 0], opacity: [0.22, 0.42, 0.22] },
      transition: { duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 0.6 },
    },
    {
      className: 'left-[7rem] bottom-[2rem] h-[130px] w-[130px] rounded-full blur-[70px]',
      style: { background: 'rgba(134, 122, 112, 0.07)' },
      animate: { y: [0, -6, 0], x: [0, 4, 0], opacity: [0.2, 0.36, 0.2] },
      transition: { duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1.1 },
    },
  ],
};

export function FloatingPageShapes({ theme = 'neutral' }: { theme?: FloatingTheme }) {
  const shouldReduceMotion = useReducedMotion();
  const palette = floatingThemes[theme];

  const shapes = [
    ...palette,
  ];

  return (
    <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
      {shapes.map((shape, index) => (
        <motion.div
          key={index}
          className={`absolute ${shape.className}`}
          initial={false}
          animate={shouldReduceMotion ? undefined : shape.animate}
          transition={shouldReduceMotion ? undefined : shape.transition}
        />
      ))}
    </div>
  );
}
