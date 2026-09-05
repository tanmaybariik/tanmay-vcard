'use client';
import { Contact } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AddContact() {
  return (
    <div className="w-full mt-1">
      <motion.a 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        href="/tanmay.vcf" 
        download="Tanmay_Barik.vcf"
        className="group relative flex items-center justify-center w-full h-14 bg-[#1C2333]/80 backdrop-blur-xl border border-[#3B82F6]/30 hover:border-[#3B82F6]/70 rounded-[24px] text-white font-bold tracking-[0.1em] text-[14px] sm:text-[15px] shadow-[0_8px_32px_rgba(59,130,246,0.15)] transition-all overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#3B82F6]/0 via-[#3B82F6]/10 to-[#3B82F6]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <Contact className="absolute left-5 w-5 h-5 text-[#3B82F6] drop-shadow-md group-hover:scale-110 transition-transform duration-300" />
        <span className="relative z-10 text-[#E2E8F0] group-hover:text-white transition-colors">ADD TO CONTACTS</span>
      </motion.a>
    </div>
  );
}
