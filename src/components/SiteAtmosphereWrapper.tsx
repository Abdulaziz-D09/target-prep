'use client';

import { usePathname } from 'next/navigation';

export default function SiteAtmosphereWrapper() {
  const pathname = usePathname();

  let modifier = 'site-atmosphere--home';

  if (pathname.startsWith('/practice')) {
    modifier = 'site-atmosphere--practice';
  } else if (pathname.startsWith('/question-bank')) {
    modifier = 'site-atmosphere--question-bank';
  } else if (pathname.startsWith('/teacher')) {
    modifier = 'site-atmosphere--home';
  }

  return <div className={`site-atmosphere ${modifier}`} />;
}
