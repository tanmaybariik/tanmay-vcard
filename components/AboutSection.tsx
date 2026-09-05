'use client';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowRight, GraduationCap, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PortfolioLock from '@/components/PortfolioLock';

export default function AboutSection() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="w-full flex flex-col">
        <motion.div 
          whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.06)" }}
          whileTap={{ scale: 0.94 }}
          onClick={() => setIsOpen(true)}
          className="w-full h-14 bg-white/[0.03] backdrop-blur-[60px] border border-white/[0.08] rounded-[20px] px-4 flex justify-center items-center transition-all cursor-pointer group shadow-[0_8px_32px_rgba(0,0,0,0.25)]"
          style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05), 0 8px 32px rgba(0,0,0,0.25)' }}
        >
          <h2 className="text-[13px] font-bold tracking-[0.15em] text-white uppercase">ABOUT ME</h2>
        </motion.div>
      </div>

      {typeof window !== 'undefined' && createPortal(
        <AnimatePresence>
          {isOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050812]">
              <motion.div 
                initial={{ opacity: 0, y: "100%" }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: "100%" }}
                transition={{ type: 'spring', stiffness: 400, damping: 35, mass: 0.8 }}
                className="w-full h-full bg-[#0a0a0c]/60 backdrop-blur-[60px] relative flex flex-col overflow-hidden max-w-[500px] mx-auto shadow-2xl"
              >
                
              <div className="relative z-10 flex flex-col h-full w-full px-6 pt-12 pb-8">
                
                {/* Top Bar */}
                <div className="flex justify-between items-center w-full mb-8">
                  <button 
                    onClick={() => setIsOpen(false)} 
                    className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                  <div className="flex flex-col items-center">
                    <h2 className="text-[10px] font-bold tracking-[0.2em] text-[#8F9BB3] uppercase flex items-center gap-2">
                      <User className="w-3 h-3 text-[#3B82F6]" /> ABOUT ME
                    </h2>
                  </div>
                  <div className="w-10 h-10" /> {/* Spacer */}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar -mx-2 px-2">
                  <motion.div 
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: {
                        opacity: 1,
                        transition: { staggerChildren: 0.15 }
                      }
                    }}
                    className="flex flex-col gap-8 pb-10"
                  >
                    
                    {/* Bio */}
                    <motion.div 
                      variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 200 } } }} 
                      className="bg-white/[0.03] border border-white/5 p-6 rounded-[24px]"
                    >
                      <span className="block text-[10px] font-bold tracking-[0.2em] text-[#8F9BB3] mb-4 uppercase">Biography</span>
                      <p className="text-[14px] leading-relaxed text-[#E2E8F0]">
                        I am a passionate Computer Science student focused on building beautiful, professional digital experiences. I love blending design and technology to create something new, creative, and amazing.
                      </p>
                    </motion.div>
                    
                    {/* Education */}
                    <motion.div 
                      variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 200 } } }}
                      className="bg-white/[0.03] border border-white/5 rounded-[24px] p-6"
                    >
                      <span className="block text-[10px] font-bold tracking-[0.2em] text-[#8F9BB3] mb-4 uppercase">Education</span>
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#3B82F6]/20 border border-[#3B82F6]/30 flex items-center justify-center shrink-0">
                          <GraduationCap className="w-5 h-5 text-[#3B82F6]" />
                        </div>
                        <div>
                          <h3 className="text-[15px] font-bold text-white tracking-wide mb-1">B.Tech in Computer Science</h3>
                          <p className="text-[13px] text-[#8F9BB3] leading-relaxed">Currently pursuing degree with a focus on full-stack development and design engineering.</p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Bengali Section */}
                    <motion.div 
                      variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 200 } } }}
                      className="bg-white/[0.03] border border-white/5 rounded-[24px] p-6 relative overflow-hidden group cursor-pointer shadow-sm hover:shadow-md transition-all"
                      onClick={() => window.open('https://your-website-link-here.com', '_blank')}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <span className="relative block text-[10px] font-bold tracking-[0.2em] text-[#8F9BB3] mb-2 uppercase">Hey, You Are Bengali?</span>
                      <div className="relative flex items-center justify-between">
                        <p className="text-[14px] leading-relaxed text-[#E2E8F0] font-medium">
                          Click here to visit my special Bengali website!
                        </p>
                        <ArrowRight className="w-5 h-5 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0 ml-4" />
                      </div>
                    </motion.div>

                    {/* Portfolio Lock */}
                    <motion.div 
                      variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { type: 'spring', damping: 20, stiffness: 300 } } }}
                      className="mt-4 w-full mx-auto"
                    >
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
