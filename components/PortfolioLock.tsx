'use client';
import { useState } from 'react';
import { Lock, Unlock, X } from 'lucide-react';
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
      <motion.div 
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.06)" }}
        whileTap={{ scale: 0.94 }}
        className="w-full bg-white/[0.03] backdrop-blur-[60px] border border-white/[0.08] rounded-[20px] p-[18px] cursor-pointer transition-all flex items-center justify-between group shadow-[0_8px_32px_rgba(0,0,0,0.25)]"
        style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05), 0 8px 32px rgba(0,0,0,0.25)' }}
      >
        <div>
          <h2 className="text-[12px] font-bold tracking-[0.15em] text-white flex items-center gap-2 uppercase">
            <Lock className="w-4 h-4 text-[#8F9BB3] group-hover:text-white transition-colors" />
            Professional Life
          </h2>
          <p className="text-[11px] text-[#6B7A99] mt-1.5">Enter password to unlock my portfolio</p>
        </div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0a0c]/60 backdrop-blur-[60px]"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white/[0.03] backdrop-blur-[60px] border border-white/[0.1] rounded-[32px] p-8 w-full max-w-[340px] shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative"
            >
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full bg-[rgba(255,255,255,0.05)] text-white hover:bg-[rgba(255,255,255,0.1)] transition"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="w-16 h-16 rounded-full bg-[rgba(59,130,246,0.15)] border border-[rgba(59,130,246,0.3)] flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(59,130,246,0.4)]">
                {success ? <Unlock className="w-7 h-7 text-[#22C55E]" /> : <Lock className="w-7 h-7 text-[#3B82F6]" />}
              </div>
              
              <h3 className="text-center text-[18px] font-bold text-white tracking-wide mb-6">Unlock Portfolio</h3>
              
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className={`w-full bg-[rgba(0,0,0,0.3)] border ${error ? 'border-[#EA4335] animate-pulse' : 'border-[rgba(255,255,255,0.1)]'} rounded-[16px] px-5 py-4 text-[14px] text-white focus:outline-none focus:border-[#3B82F6] transition-colors mb-4`}
              />
              
              <div className="h-4 mb-4 flex items-center justify-center">
                {error && <p className="text-[12px] font-medium text-[#EA4335]">Incorrect Password</p>}
                {success && <p className="text-[12px] font-medium text-[#22C55E]">Unlocked!</p>}
              </div>
              
              <button 
                onClick={handleUnlock}
                className="w-full bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white font-bold tracking-widest text-[13px] rounded-[16px] py-4 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all"
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
