'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

export default function VisitorCounter() {
  const [count, setCount] = useState(28452);

  useEffect(() => {
    // Simulate live visitors increasing
    const interval = setInterval(() => {
      if (Math.random() > 0.3) { // 70% chance to increase
        setCount(prev => prev + Math.floor(Math.random() * 3) + 1);
      }
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="absolute left-3 top-3 z-20 flex items-center justify-center gap-1.5 bg-white/[0.03] backdrop-blur-[60px] border border-white/[0.08] rounded-full px-2.5 h-[28px] w-auto shadow-sm"
      style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05), 0 2px 8px rgba(0,0,0,0.1)' }}
    >
      <div className="relative flex items-center justify-center w-3 h-3 shrink-0">
        <Users className="w-2.5 h-2.5 text-[#EF4444] relative z-10" />
        <motion.div
          animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-[#EF4444] rounded-full"
        />
      </div>
      <div className="flex items-center leading-none">
        <motion.span
          key={count}
          initial={{ opacity: 0.5, y: -2 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[11px] font-bold text-white tracking-wide"
        >
          {count.toLocaleString()}
        </motion.span>
        <span className="text-[10px] font-bold text-[#EF4444] ml-0.5 shrink-0"></span>
      </div>
    </motion.div>
  );
}
