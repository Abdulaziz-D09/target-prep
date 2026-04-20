'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

export default function SidebarWrapper() {
  const pathname = usePathname();
  
  // Do not render the sidebar on the root portal page
  if (pathname === '/') {
    return null;
  }
  
  return <Sidebar />;
}
