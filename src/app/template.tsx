'use client'

import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

export default function RootTemplate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // If navigating into a test environment, don't use this general transition.
  // The test has its own special templates for a seamless transition from the dark lobby.
  if (pathname.includes('/practice/test/')) {
    return <>{children}</>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
      className="flex-1 flex flex-col min-h-screen"
    >
      {children}
    </motion.div>
  )
}
