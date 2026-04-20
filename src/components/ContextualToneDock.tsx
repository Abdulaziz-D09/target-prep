'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import SiteToneDock from '@/components/SiteToneDock';

export default function ContextualToneDock() {
  const pathname = usePathname();
  const [isTemporarilyHidden, setIsTemporarilyHidden] = useState(false);
  const shouldShowDock = pathname === '/practice' || pathname.startsWith('/question-bank');

  useEffect(() => {
    const hide = () => setIsTemporarilyHidden(true);
    const show = () => setIsTemporarilyHidden(false);

    window.addEventListener('hide-sidebar', hide);
    window.addEventListener('show-sidebar', show);

    return () => {
      window.removeEventListener('hide-sidebar', hide);
      window.removeEventListener('show-sidebar', show);
    };
  }, []);

  if (!shouldShowDock || isTemporarilyHidden) return null;

  return <SiteToneDock className="z-[95]" />;
}
