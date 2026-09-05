'use client';
import { motion, Variants } from 'framer-motion';
import { Share2, BadgeCheck } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import AnimatedBackground from '@/components/AnimatedBackground';
import SocialLinks from '@/components/SocialLinks';
import ContactButtons from '@/components/ContactButtons';
import AddContact from '@/components/AddContact';
import Footer from '@/components/Footer';
import LoadingScreen from '@/components/LoadingScreen';

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
    transition: { staggerChildren: 0.12, delayChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95, filter: 'blur(10px)' },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

export default function Home() {
  return (
    <main className="relative min-h-screen w-full bg-[#050812] text-foreground flex flex-col items-center overflow-x-hidden selection:bg-primary-glow/30">
      <LoadingScreen />
      <AnimatedBackground />
      <VisitorCounter />
      <div className="absolute top-3 right-3 flex gap-2 z-20">
        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.06)" }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: 'Tanmay Barik',
                text: 'Hi! I\'m Tanmay Barik. Connect with me using my Digital Visiting Card.',
                url: 'https://tanmaybarik.netlify.app'
              });
            }
          }}
          className="w-11 h-11 rounded-full bg-white/[0.03] backdrop-blur-[60px] border border-white/[0.08] flex items-center justify-center transition-all shadow-[0_8px_32px_rgba(0,0,0,0.25)]"
          style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05), 0 8px 32px rgba(0,0,0,0.25)' }}
        >
          <Share2 className="w-[18px] h-[18px] text-white opacity-90" />
        </motion.button>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="z-10 mx-auto w-full max-w-[430px] min-w-0 flex flex-col gap-6 items-center px-3 sm:px-4 py-[20px] pt-[72px] mb-10"
      >

        {/* Hero Section */}
        <motion.section
          variants={itemVariants}
          className="w-full pt-8 pb-7 px-5 rounded-[40px] border border-white/[0.08] bg-white/[0.03] backdrop-blur-[60px] flex flex-col items-center justify-center text-center shadow-[0_8px_32px_rgba(0,0,0,0.25)] relative overflow-hidden"
          style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05), 0 8px 32px rgba(0,0,0,0.25)' }}
        >
          {/* Blue radial light behind avatar */}
          <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[180px] h-[180px] bg-[#3B82F6] rounded-full opacity-20 blur-[40px]"></div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 20 }}
            className="relative z-10 w-24 h-24 sm:w-32 sm:h-32 mx-auto rounded-full p-[3px] bg-gradient-to-b from-[#3B82F6] to-transparent shadow-[0_0_30px_rgba(59,130,246,0.4)] mb-4"
          >
            {/* Animated Neon Pulse */}
            <motion.div
              animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.05, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-[-4px] rounded-full border-2 border-[#3B82F6] opacity-30"
            />

            <div className="w-full h-full rounded-full overflow-hidden border-[3px] border-[#090B14] bg-[#090B14]">
              <Image
                src="/profile_pic.jpg"
                alt="Tanmay Barik"
                width={128}
                height={128}
                priority
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          <div className="relative z-10 mt-2 w-full flex flex-col items-center justify-center text-center px-1">
            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
              <span className="text-[28px] sm:text-[38px] font-extrabold tracking-[0.1em] sm:tracking-[0.15em] bg-gradient-to-r from-white to-[#A2C7EE] bg-clip-text text-transparent uppercase leading-none">
                TANMAY
              </span>
              <span className="text-[28px] sm:text-[38px] font-extrabold tracking-[0.1em] sm:tracking-[0.15em] bg-gradient-to-r from-[#A2C7EE] to-[#5A9EE0] bg-clip-text text-transparent uppercase leading-none flex items-center gap-1.5">
                BARIK
                <BadgeCheck className="w-6 h-6 sm:w-8 sm:h-8 drop-shadow-[0_0_8px_rgba(29,161,242,0.8)] shrink-0" fill="#1DA1F2" stroke="white" />
              </span>
            </div>
          </div>
          <div className="relative z-10 flex flex-col items-center gap-1 mt-1 w-full px-2">
            <p className="text-[14px] text-[#8F9BB3] font-medium break-words text-center w-full">Computer Science Engineering Student</p>
            <p className="text-[11px] text-[#6B7A99] mt-0.5 break-words text-center w-full">Developer • Creator • Technology Enthusiast</p>
          </div>
        </motion.section>

        <motion.div variants={itemVariants} className="w-full flex justify-center">
          <SocialLinks />
        </motion.div>

        <motion.div variants={itemVariants} className="w-full flex justify-center">
          <ContactButtons />
        </motion.div>

        <motion.div variants={itemVariants} className="w-full flex justify-center">
          <AddContact />
        </motion.div>

        <motion.div variants={itemVariants} className="w-full grid grid-cols-2 gap-3">
          <div className="w-full overflow-hidden">
            <WorldClock />
          </div>
          <div className="w-full overflow-hidden">
            <MusicPlayer />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="w-full flex flex-col gap-3">
          <div className="w-full"><AboutSection /></div>
          <div className="w-full"><GamesHub /></div>
        </motion.div>

        <motion.div variants={itemVariants} className="w-full">
          <Footer />
        </motion.div>
      </motion.div>
    </main>
  );
}
