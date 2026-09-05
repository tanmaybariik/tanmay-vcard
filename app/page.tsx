'use client';
import { motion, Variants } from 'framer-motion';
import { Share2, BadgeCheck } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import AnimatedBackground from '@/components/AnimatedBackground';
import SocialLinks from '@/components/SocialLinks';
import AddContact from '@/components/AddContact';
import Footer from '@/components/Footer';
import ContactButtons from '@/components/ContactButtons';

// Lazy loaded heavy components
const WorldClock = dynamic(() => import('@/components/WorldClock'), { ssr: false });
const MusicPlayer = dynamic(() => import('@/components/MusicPlayer'), { ssr: false });
const AboutSection = dynamic(() => import('@/components/AboutSection'), { ssr: false });
const GamesHub = dynamic(() => import('@/components/GamesHub'), { ssr: false });
const VisitorCounter = dynamic(() => import('@/components/VisitorCounter'), { ssr: false });

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.98, filter: 'blur(5px)' },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] }
  }
};

export default function Home() {
  return (
    <main className="relative min-h-screen w-full bg-[#050812] text-foreground flex flex-col items-center overflow-x-hidden selection:bg-primary-glow/30">
      <AnimatedBackground />
      <VisitorCounter />

        <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="z-10 mx-auto w-full max-w-[430px] min-w-0 flex flex-col items-center px-3 sm:px-4 py-[20px] pt-[72px] mb-10 box-border gap-7 sm:gap-8"
      >
        {/* Hero Section */}
        <motion.section
          variants={itemVariants}
          className="w-full pt-5 pb-8 px-4 sm:px-5 rounded-[40px] border border-white/[0.08] bg-white/[0.03] backdrop-blur-[60px] flex flex-col items-center justify-center text-center shadow-[0_8px_32px_rgba(0,0,0,0.25)] relative overflow-hidden"
          style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05), 0 8px 32px rgba(0,0,0,0.25)' }}
        >
          {/* Top Info Bar (Share) */}
          <div className="w-full flex justify-end items-start z-20 mb-6">
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'Tanmay Barik',
                    text: 'Hi! I\'m Tanmay Barik. Connect with me using my Digital Visiting Card.',
                    url: 'https://tanmaybarik.netlify.app'
                  });
                }
              }}
              className="w-9 h-9 rounded-full bg-white/[0.05] backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all shadow-sm"
            >
              <Share2 className="w-4 h-4 text-white/90" />
            </button>
          </div>

          {/* Blue radial light behind avatar */}
          <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] bg-[#3B82F6] rounded-full opacity-20 blur-[50px] pointer-events-none"></div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 300, damping: 20 }}
            className="relative z-10 w-[130px] h-[130px] sm:w-[160px] sm:h-[160px] mx-auto rounded-full p-[3px] bg-gradient-to-b from-[#3B82F6] to-[#3B82F6]/20 shadow-[0_0_30px_rgba(59,130,246,0.3)] mb-5"
          >
            {/* Animated Neon Pulse */}
            <motion.div
              animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.05, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-[-4px] rounded-full border-2 border-[#3B82F6] opacity-30 pointer-events-none"
            />

            <div className="w-full h-full rounded-full overflow-hidden border-[3px] border-[#090B14] bg-[#090B14]">
              <Image
                src="/profile_pic.jpg"
                alt="Tanmay Barik"
                width={160}
                height={160}
                priority
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          <div className="relative z-10 w-full flex flex-col items-center justify-center text-center px-1 mb-2">
            <div className="flex flex-row flex-nowrap items-center justify-center gap-1.5 w-full">
              <span className="text-[clamp(22px,7vw,32px)] font-black tracking-widest text-white uppercase leading-none whitespace-nowrap">
                TANMAY
              </span>
              <span className="text-[clamp(22px,7vw,32px)] font-black tracking-widest text-[#5A9EE0] uppercase leading-none whitespace-nowrap">
                BARIK
              </span>
              <BadgeCheck className="w-[clamp(20px,6vw,26px)] h-[clamp(20px,6vw,26px)] drop-shadow-[0_0_8px_rgba(29,161,242,0.8)] shrink-0 ml-0.5" fill="#1DA1F2" stroke="white" />
            </div>
          </div>

          <div className="relative z-10 flex flex-col items-center w-full px-2">
            <p className="text-[14px] sm:text-[15px] text-white/90 font-medium break-words text-center w-full mb-1.5">
              Computer Science Engineering Student
            </p>
            <p className="text-[11.5px] sm:text-[12.5px] text-[#8F9BB3] break-words text-center w-full">
              Developer • Creator • Technology Enthusiast
            </p>
          </div>
        </motion.section>

        <motion.div variants={itemVariants} className="w-full">
          <SocialLinks />
        </motion.div>

        <motion.div variants={itemVariants} className="w-full">
          <ContactButtons />
        </motion.div>

        <motion.div variants={itemVariants} className="w-full">
          <AddContact />
        </motion.div>

        <motion.div variants={itemVariants} className="w-full grid grid-cols-2 gap-4">
          <div className="w-full overflow-hidden">
            <WorldClock />
          </div>
          <div className="w-full overflow-hidden">
            <MusicPlayer />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="w-full">
          <AboutSection />
        </motion.div>
        
        <motion.div variants={itemVariants} className="w-full">
          <GamesHub />
        </motion.div>

        <motion.div variants={itemVariants} className="w-full mt-4">
          <Footer />
        </motion.div>
      </motion.div>
    </main>
  );
}
