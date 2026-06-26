'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function RouteTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const prevPathnameRef = useRef(pathname);

  const prevPath = prevPathnameRef.current;
  const currentPath = pathname;

  const isSatToMock = (prevPath === '/dashboard' && currentPath === '/dashboard/mocks') || 
                      (prevPath === '/teacher' && currentPath === '/teacher/mocks');
                      
  const isMockToSat = (prevPath === '/dashboard/mocks' && currentPath === '/dashboard') || 
                      (prevPath === '/teacher/mocks' && currentPath === '/teacher');

  let initialX = 0;
  if (isSatToMock) {
      initialX = 40; // Slide in from right
  } else if (isMockToSat) {
      initialX = -40; // Slide in from left
  }

  useEffect(() => {
    prevPathnameRef.current = pathname;
  }, [pathname]);

  return (
    <motion.div
      key={pathname}
      initial={shouldReduceMotion ? undefined : { opacity: 0, x: initialX }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
      transition={shouldReduceMotion ? undefined : { duration: 0.35, ease: 'easeOut' }}
      className="flex-1 flex flex-col w-full h-full min-h-full"
    >
      {children}
    </motion.div>
  );
}
