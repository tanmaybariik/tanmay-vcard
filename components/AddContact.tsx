'use client';
import { Contact } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AddContact() {
  return (
    <div className="w-full">
      <motion.a 
        whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.06)" }}
        whileTap={{ scale: 0.94 }}
        href="/tanmay.vcf" 
        download 
        className="relative flex items-center justify-center w-full h-14 bg-white/[0.03] border border-white/[0.08] backdrop-blur-[60px] rounded-[20px] text-white font-bold tracking-[0.1em] text-[14px] sm:text-[15px] shadow-[0_8px_32px_rgba(0,0,0,0.25)] transition-all overflow-hidden"
        style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05), 0 8px 32px rgba(0,0,0,0.25)' }}
      >
        <Contact className="absolute left-4 sm:left-5 w-5 h-5 text-white drop-shadow-md" />
        ADD TO CONTACT
      </motion.a>
    </div>
  );
}
