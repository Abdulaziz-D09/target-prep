'use client';
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ZoomableImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}

export function ZoomableImage({ src, alt, className, style }: ZoomableImageProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      <img
        src={src}
        alt={alt}
        className={`cursor-zoom-in ${className || ''}`}
        style={style}
        onClick={() => setIsOpen(true)}
      />

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-zoom-out"
              onClick={() => setIsOpen(false)}
            />

            {/* Content Container */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative z-10 w-full h-full flex flex-col p-4 md:p-8"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the container itself
            >
              {/* Header with Exit Button */}
              <div className="flex justify-end mb-4 flex-shrink-0">
                <button
                  onClick={() => setIsOpen(false)}
                  className="bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors cursor-pointer"
                  aria-label="Close image"
                >
                  <X className="w-6 h-6 md:w-8 md:h-8" />
                </button>
              </div>
              
              {/* Image Area */}
              <div 
                className="flex-1 w-full h-full flex items-center justify-center cursor-zoom-out min-h-0"
                onClick={() => setIsOpen(false)}
              >
                <img
                  src={src}
                  alt={alt}
                  className="max-w-full max-h-full object-contain rounded-md select-none"
                  draggable={false}
                  onClick={(e) => {
                    // Stop propagation so clicking the image itself doesn't close it,
                    // OR let it bubble up if we want clicking the large image to also close it.
                    // The Bluebook app usually lets clicking the image close the modal too.
                  }}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
