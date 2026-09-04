'use client';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Globe } from 'lucide-react';

const ClockFace = ({ time, timeZone, label }: { time: Date, timeZone: string, label: string }) => {
  // Convert current time to the target timezone
  const tzString = new Intl.DateTimeFormat('en-US', { timeZone, hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false }).format(time);
  const [hourStr, minStr, secStr] = tzString.split(':');
  
  // Parse manually since DateTimeFormat might return formats like '24:00:00'
  let hours = parseInt(hourStr, 10);
  const minutes = parseInt(minStr, 10);
  const seconds = parseInt(secStr, 10);
  
  if (hours === 24) hours = 0;

  const hourDegrees = (hours % 12) * 30 + minutes * 0.5;
  const minuteDegrees = minutes * 6 + seconds * 0.1;
  const secondDegrees = seconds * 6;

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className="flex flex-col items-center justify-center p-6 bg-white/[0.03] backdrop-blur-[60px] border border-white/[0.08] rounded-[28px] shadow-[0_8px_32px_rgba(0,0,0,0.25)] relative overflow-hidden group cursor-default"
      style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05), 0 8px 32px rgba(0,0,0,0.25)' }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#3B82F6]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative w-[80px] h-[80px] rounded-full border-2 border-[rgba(255,255,255,0.15)] flex items-center justify-center mb-5 group-hover:border-[rgba(255,255,255,0.3)] transition-colors duration-500">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-full"
            style={{ transform: `rotate(${i * 30}deg)` }}
          >
            <div className={`mx-auto w-[2px] ${i % 3 === 0 ? 'h-[6px] bg-white' : 'h-[3px] bg-[rgba(255,255,255,0.4)]'} rounded-full`} />
          </div>
        ))}
        
        <div 
          className="absolute w-[3px] h-[20px] bg-white rounded-full origin-bottom"
          style={{ transform: `translateY(-10px) rotate(${hourDegrees}deg)` }}
        />
        <div 
          className="absolute w-[2px] h-[30px] bg-[rgba(255,255,255,0.9)] rounded-full origin-bottom"
          style={{ transform: `translateY(-15px) rotate(${minuteDegrees}deg)` }}
        />
        <div 
          className="absolute w-[1.5px] h-[34px] bg-[#3B82F6] rounded-full origin-bottom shadow-[0_0_8px_rgba(59,130,246,0.8)]"
          style={{ transform: `translateY(-17px) rotate(${secondDegrees}deg)` }}
        />
        <div className="absolute w-[8px] h-[8px] bg-[#3B82F6] rounded-full z-10 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
      </div>
      <div className="text-[11px] font-bold tracking-[0.2em] text-[#8F9BB3] mb-1.5 relative z-10 group-hover:text-white transition-colors duration-300">{label}</div>
      <div className="text-[14px] font-bold text-white tracking-wider relative z-10">{formatter.format(time)}</div>
    </motion.div>
  );
};

export default function WorldClock() {
  const [time, setTime] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const hourDegrees = (time.getHours() % 12) * 30 + time.getMinutes() * 0.5;
  const minuteDegrees = time.getMinutes() * 6 + time.getSeconds() * 0.1;
  const secondDegrees = time.getSeconds() * 6;

  return (
    <>
      <motion.div 
        whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.06)" }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setIsOpen(true)}
        className="w-full aspect-[1/1] bg-white/[0.03] backdrop-blur-[60px] border border-white/[0.08] rounded-[24px] flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden p-4 shadow-[0_8px_32px_rgba(0,0,0,0.25)] group"
        style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05), 0 8px 32px rgba(0,0,0,0.25)' }}
      >
        <div className="relative w-[70px] h-[70px] rounded-full border-2 border-[rgba(255,255,255,0.1)] flex items-center justify-center mb-5 group-hover:border-[rgba(255,255,255,0.25)] transition-colors duration-300">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-full h-full"
              style={{ transform: `rotate(${i * 30}deg)` }}
            >
              <div className={`mx-auto w-[2px] ${i % 3 === 0 ? 'h-[5px] bg-white' : 'h-[3px] bg-[rgba(255,255,255,0.3)]'} rounded-full`} />
            </div>
          ))}
          <div className="absolute w-[3px] h-[18px] bg-white rounded-full origin-bottom" style={{ transform: `translateY(-9px) rotate(${hourDegrees}deg)` }} />
          <div className="absolute w-[2px] h-[26px] bg-[rgba(255,255,255,0.8)] rounded-full origin-bottom" style={{ transform: `translateY(-13px) rotate(${minuteDegrees}deg)` }} />
          <div className="absolute w-[1.5px] h-[30px] bg-[#3B82F6] rounded-full origin-bottom shadow-[0_0_8px_rgba(59,130,246,0.6)]" style={{ transform: `translateY(-15px) rotate(${secondDegrees}deg)` }} />
          <div className="absolute w-[6px] h-[6px] bg-[#3B82F6] rounded-full z-10 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
        </div>
        
        <div className="text-[10px] font-bold tracking-[0.15em] text-[#8F9BB3] mb-1 group-hover:text-white transition-colors duration-300">LOCAL TIME</div>
        <div className="text-[14px] font-bold text-white tracking-wider uppercase">{new Intl.DateTimeFormat('en-US', { weekday: 'short', day: 'numeric', month: 'short' }).format(time)}</div>
      </motion.div>

      {typeof window !== 'undefined' && createPortal(
        <AnimatePresence>
          {isOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050812]">
              <motion.div 
                initial={{ opacity: 0, y: "100%" }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: "100%" }}
                transition={{ type: 'spring', stiffness: 400, damping: 35, mass: 0.8 }}
                className="w-full h-full bg-[#0a0a0c]/60 backdrop-blur-[60px] relative flex flex-col overflow-y-auto overflow-x-hidden max-w-[500px] mx-auto shadow-2xl custom-scrollbar"
              >
              
              <div className="relative z-10 flex flex-col h-full w-full px-6 pt-12 pb-8">
                
                {/* Top Bar */}
                <div className="flex justify-between items-center w-full mb-10">
                  <button 
                    onClick={() => setIsOpen(false)} 
                    className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                  <div className="flex flex-col items-center">
                    <h2 className="text-[10px] font-bold tracking-[0.2em] text-[#8F9BB3] uppercase flex items-center gap-2">
                      <Globe className="w-3 h-3 text-[#3B82F6]" /> WORLD CLOCKS
                    </h2>
                  </div>
                  <div className="w-10 h-10" /> {/* Spacer */}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar -mx-2 px-2 flex flex-col justify-center pb-20">
                  <motion.div 
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: {
                        opacity: 1,
                        transition: { staggerChildren: 0.1 }
                      }
                    }}
                    className="grid grid-cols-2 gap-4"
                  >
                    <motion.div variants={{ hidden: { opacity: 0, scale: 0.9, y: 20 }, visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } } }}>
                      <ClockFace time={time} timeZone="Asia/Kolkata" label="INDIA" />
                    </motion.div>
                    <motion.div variants={{ hidden: { opacity: 0, scale: 0.9, y: 20 }, visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } } }}>
                      <ClockFace time={time} timeZone="America/New_York" label="NEW YORK" />
                    </motion.div>
                    <motion.div variants={{ hidden: { opacity: 0, scale: 0.9, y: 20 }, visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } } }}>
                      <ClockFace time={time} timeZone="Europe/London" label="LONDON" />
                    </motion.div>
                    <motion.div variants={{ hidden: { opacity: 0, scale: 0.9, y: 20 }, visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } } }}>
                      <ClockFace time={time} timeZone="Asia/Tokyo" label="TOKYO" />
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
