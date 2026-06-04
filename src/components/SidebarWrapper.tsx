'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { Suspense } from 'react';

export default function SidebarWrapper() {
  const pathname = usePathname();
  
  // Do not render the sidebar on auth, landing, or full-screen test pages
  if (
    pathname === '/' || 
    pathname.startsWith('/login') || 
    pathname.startsWith('/signup') || 
    pathname.startsWith('/forgot-password') || 
    pathname.startsWith('/verify-code') ||
    pathname.startsWith('/verify-reset-code') ||
    pathname.startsWith('/practice/test')
  ) {
    return null;
  }
  
  return (
    <Suspense fallback={null}>
      <Sidebar />
    </Suspense>
  );
}
