'use client'

import { motion } from 'framer-motion'

export default function TestTransitionTemplate({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* 
        This overlay simulates a smooth transition from the dark lobby/dashboard 
        by starting fully dark and fading out, revealing the light test UI.
      */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-0 z-[99999] bg-[#121826] pointer-events-none"
      />
      
      {/* Snappy entrance for the test content itself */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1], delay: 0.1 }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </>
  )
}
