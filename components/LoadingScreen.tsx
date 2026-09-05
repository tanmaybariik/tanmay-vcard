'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { BadgeCheck } from 'lucide-react';
import Image from 'next/image';

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600); // reduced from 1800 to 600
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {typeof window !== 'undefined' && createPortal(
        <AnimatePresence>
          {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(10px)", scale: 1.05 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} // reduced from 0.8 to 0.3
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050812]"
        >
          {/* Blue radial light behind logo */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-[#3B82F6] rounded-full opacity-10 blur-[50px]"></div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.5, type: 'spring', stiffness: 200, damping: 20 }}
            className="relative z-10 flex flex-col items-center"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 mb-6 rounded-full p-[2px] bg-gradient-to-b from-[#3B82F6] to-transparent shadow-[0_0_30px_rgba(59,130,246,0.3)] relative">
              {/* Pulsing border effect */}
              <motion.div
                animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-[-4px] rounded-full border border-[#3B82F6] opacity-30"
              />
              <div className="w-full h-full rounded-full overflow-hidden border-[2px] border-[#090B14] bg-[#090B14] relative z-10">
                <Image
                  src="/profile_pic.jpg"
                  alt="Loading"
                  width={96}
                  height={96}
                  priority
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 mb-10">
              <span className="text-[24px] sm:text-[32px] font-extrabold tracking-[0.1em] sm:tracking-[0.15em] bg-gradient-to-r from-white to-[#A2C7EE] bg-clip-text text-transparent uppercase leading-none">
                TANMAY
              </span>
              <span className="text-[24px] sm:text-[32px] font-extrabold tracking-[0.1em] sm:tracking-[0.15em] bg-gradient-to-r from-[#A2C7EE] to-[#5A9EE0] bg-clip-text text-transparent uppercase leading-none flex items-center gap-1.5">
                BARIK
                <BadgeCheck className="w-5 h-5 sm:w-7 sm:h-7 drop-shadow-[0_0_8px_rgba(29,161,242,0.8)] shrink-0" fill="#1DA1F2" stroke="white" />
              </span>
            </div>

            {/* Apple style loading bar */}
            <div className="w-[140px] h-[2px] bg-white/10 rounded-full overflow-hidden relative">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="absolute inset-y-0 left-0 h-full bg-gradient-to-r from-[#3B82F6] to-white rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
    )}
    </>
  );
}
