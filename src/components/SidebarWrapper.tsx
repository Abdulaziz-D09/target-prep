'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

export default function SidebarWrapper() {
  const pathname = usePathname();
  
  // Do not render the sidebar on auth, landing, or full-screen test pages
  if (
    pathname === '/' || 
    pathname.startsWith('/login') || 
    pathname.startsWith('/signup') || 
    pathname.startsWith('/forgot-password') || 
    pathname.startsWith('/verify-code') ||
    pathname.startsWith('/practice/test')
  ) {
    return null;
  }
  
  return <Sidebar />;
}
