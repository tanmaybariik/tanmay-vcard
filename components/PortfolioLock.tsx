'use client';
import { useState } from 'react';
import { Lock, Unlock, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PortfolioLock() {
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleUnlock = () => {
    if (password === 'riik') {
      setSuccess(true);
      setError(false);
      setTimeout(() => {
        window.location.href = 'https://tanmaybarik.netlify.app';
      }, 1000);
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="group block w-full bg-[#1C2333]/40 border border-[#3B82F6]/20 hover:border-[#3B82F6]/50 p-5 sm:p-6 rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.15)] backdrop-blur-md transition-all active:scale-[0.98] text-left"
      >
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#3B82F6]/20 border border-[#3B82F6]/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
            <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-[#3B82F6]" />
          </div>
          <div className="flex-1 min-w-0 pr-2">
            <h3 className="text-[15px] sm:text-[16px] font-bold text-white tracking-wide mb-1.5 truncate">PROFESSIONAL LIFE</h3>
            <p className="text-[13px] sm:text-[14px] text-[#8F9BB3] leading-[1.6] break-words">Enter password to unlock my portfolio</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors">
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white/70 group-hover:text-white transition-colors" />
          </div>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#050812]/90 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-[#0A0D18]/95 border border-[#3B82F6]/20 rounded-[32px] p-8 w-full max-w-[340px] shadow-[0_20px_40px_rgba(0,0,0,0.4)] relative"
            >
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 active:scale-95 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="w-16 h-16 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/20 flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                {success ? <Unlock className="w-7 h-7 text-[#22C55E]" /> : <Lock className="w-7 h-7 text-[#3B82F6]" />}
              </div>
              
              <h3 className="text-center text-[18px] font-bold text-white tracking-wide mb-6">Unlock Portfolio</h3>
              
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className={`w-full bg-[#050812]/50 border ${error ? 'border-[#EA4335] animate-pulse' : 'border-white/10'} rounded-[16px] px-5 py-4 text-[14px] text-white focus:outline-none focus:border-[#3B82F6]/50 transition-colors mb-4 placeholder-[#6B7A99]`}
              />
              
              <div className="h-4 mb-4 flex items-center justify-center">
                {error && <p className="text-[12px] font-medium text-[#EA4335]">Incorrect Password</p>}
                {success && <p className="text-[12px] font-medium text-[#22C55E]">Unlocked!</p>}
              </div>
              
              <button 
                onClick={handleUnlock}
                className="w-full bg-[#3B82F6]/20 border border-[#3B82F6]/30 text-white font-bold tracking-widest text-[13px] rounded-[16px] py-4 hover:bg-[#3B82F6]/30 hover:border-[#3B82F6]/50 active:scale-[0.98] transition-all shadow-[0_0_15px_rgba(59,130,246,0.15)]"
              >
                UNLOCK
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
