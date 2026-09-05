'use client';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ArrowRight, GraduationCap, X, User, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PortfolioLock from '@/components/PortfolioLock';

export default function AboutSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Prevent body scroll when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      <div className="w-full flex flex-col">
        <motion.button 
          whileHover={{ scale: 1.02, backgroundColor: "rgba(28,35,51,0.6)", borderColor: "rgba(59,130,246,0.5)" }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsOpen(true)}
          className="w-full h-14 bg-[#1C2333]/40 backdrop-blur-xl border border-[#3B82F6]/20 rounded-[24px] px-4 flex justify-center items-center transition-all group shadow-[0_8px_32px_rgba(0,0,0,0.15)]"
        >
          <h2 className="text-[13px] font-bold tracking-[0.15em] text-white uppercase">ABOUT ME</h2>
        </motion.button>
      </div>

      {mounted && createPortal(
        <AnimatePresence>
          {isOpen && (
            <div className="fixed inset-0 z-[100] flex justify-center bg-[#090B14]">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="w-full h-full max-w-[430px] mx-auto relative flex flex-col overflow-hidden box-border"
              >
                {/* Ambient Glow */}
                <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-[#3B82F6] rounded-full opacity-10 blur-[80px] pointer-events-none"></div>
                <div className="absolute bottom-[10%] right-0 w-[200px] h-[200px] bg-[#8B5CF6] rounded-full opacity-10 blur-[80px] pointer-events-none"></div>

                <div className="relative z-10 flex flex-col h-full w-full px-5 pt-10 pb-8 box-border">
                  
                  {/* Top Navigation */}
                  <div className="flex justify-between items-center w-full mb-8 shrink-0">
                    <button 
                      onClick={() => setIsOpen(false)} 
                      className="w-10 h-10 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center hover:bg-white/10 active:scale-90 transition-all"
                    >
                      <X className="w-5 h-5 text-white" />
                    </button>
                    <h2 className="text-[14px] font-bold tracking-[0.2em] text-white uppercase flex items-center gap-2">
                      <User className="w-4 h-4 text-[#3B82F6]" /> ABOUT ME
                    </h2>
                    <div className="w-10 h-10" /> {/* Spacer for centering */}
                  </div>

                  {/* Scrollable Content */}
                  <div className="flex-1 overflow-y-auto w-full custom-scrollbar pr-1">
                    <motion.div 
                      initial="hidden"
                      animate="visible"
                      variants={{
                        hidden: { opacity: 0 },
                        visible: {
                          opacity: 1,
                          transition: { staggerChildren: 0.08 }
                        }
                      }}
                      className="flex flex-col w-full pb-8 gap-8"
                    >
                      
                      {/* Biography */}
                      <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} className="w-full">
                        <span className="block text-[12px] font-bold tracking-[0.2em] text-[#8F9BB3] mb-4 uppercase pl-2">Biography</span>
                        <div className="w-full bg-[#1C2333]/40 border border-[#3B82F6]/20 p-5 sm:p-6 rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.15)] backdrop-blur-md">
                          <div className="flex items-start gap-4">
                            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#3B82F6]/20 border border-[#3B82F6]/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(59,130,246,0.2)] mt-1">
                              <User className="w-5 h-5 sm:w-6 sm:h-6 text-[#3B82F6]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[14px] leading-[1.7] text-[#E2E8F0] font-medium break-words">
                                I am a passionate Computer Science student focused on building beautiful, professional digital experiences. I love blending design and technology to create something new, creative, and amazing.
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                      
                      {/* Education */}
                      <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} className="w-full">
                        <span className="block text-[12px] font-bold tracking-[0.2em] text-[#8F9BB3] mb-4 uppercase pl-2">Education</span>
                        <div className="w-full bg-[#1C2333]/40 border border-[#3B82F6]/20 p-5 sm:p-6 rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.15)] backdrop-blur-md">
                          <div className="flex items-start gap-4">
                            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#3B82F6]/20 border border-[#3B82F6]/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(59,130,246,0.2)] mt-0.5">
                              <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-[#3B82F6]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-[15px] sm:text-[16px] font-bold text-white tracking-wide mb-1.5 truncate">B.Tech in Computer Science</h3>
                              <p className="text-[13px] sm:text-[14px] text-[#8F9BB3] leading-[1.6] break-words">Currently pursuing degree with a focus on full-stack development and design engineering.</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Bengali Website */}
                      <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} className="w-full">
                        <span className="block text-[12px] font-bold tracking-[0.2em] text-[#8F9BB3] mb-4 uppercase pl-2">Hey, You Are Bengali?</span>
                        <a 
                          href="https://your-website-link-here.com" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="group block w-full bg-[#1C2333]/40 border border-[#8B5CF6]/20 hover:border-[#8B5CF6]/50 p-5 sm:p-6 rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.15)] backdrop-blur-md transition-all active:scale-[0.98]"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                              <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-[#8B5CF6]" />
                            </div>
                            <div className="flex-1 min-w-0 pr-2">
                              <p className="text-[14px] sm:text-[15px] leading-[1.6] text-white font-semibold break-words">
                                Click here to visit my special Bengali website!
                              </p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors">
                              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white/70 group-hover:text-white transition-colors" />
                            </div>
                          </div>
                        </a>
                      </motion.div>

                      {/* Professional Life */}
                      <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} className="w-full">
                        <span className="block text-[12px] font-bold tracking-[0.2em] text-[#8F9BB3] mb-4 uppercase pl-2">Professional Life</span>
                        <PortfolioLock />
                      </motion.div>
                      
                    </motion.div>
                  </div>

                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
