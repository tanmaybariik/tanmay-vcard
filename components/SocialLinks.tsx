'use client';
import { Mail } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

const FacebookIcon = ({ className, style }: { className?: string, style?: React.CSSProperties }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} style={style} viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>;
const InstagramIcon = ({ className, style }: { className?: string, style?: React.CSSProperties }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} style={style} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>;
const SnapchatIcon = ({ className, style }: { className?: string, style?: React.CSSProperties }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} style={style} viewBox="0 0 24 24" fill="currentColor"><path d="M12.062 1.41c-3.15-.04-4.707 1.83-4.84 4.67-.04.84-.04 1.77.21 2.58.05.15.14.3.06.45-.1.17-.38.16-.57.17-1.12.07-1.55.57-1.4 1.63.1.75.76 1.35 1.5 1.51.57.12.91.43.91.95 0 .28-.15.54-.3.79-.69 1.15-1.57 2.1-2.47 3.06-.52.55-1.07 1.05-1.66 1.54-.2.17-.4.32-.61.48-.48.36-.6.82-.44 1.34.1.33.34.58.62.77.67.45 1.41.6 2.21.57 1.2-.04 2.39-.12 3.59-.14 1.16-.01 2.14.33 2.97 1.08.18.16.32.35.47.54.12.16.29.35.53.38.19.03.35-.15.48-.28.16-.17.31-.35.48-.5.73-.66 1.6-.96 2.59-.97 1.25-.01 2.51 0 3.76.07.64.04 1.28 0 1.88-.24.57-.23.82-.67.85-1.25.03-.52-.25-.97-.67-1.3-.39-.31-.77-.61-1.14-.94-.82-.72-1.65-1.43-2.43-2.19-.85-.82-1.54-1.74-2.05-2.82-.25-.52-.39-1.03-.31-1.6.09-.64.55-.99 1.18-1.09.79-.13 1.47-.63 1.57-1.47.09-.76-.23-1.22-1.02-1.32-.39-.05-.8-.11-.85-.56-.05-.44-.06-.9-.05-1.35.03-2.44-1.17-4.14-3.63-4.52C12.87 1.43 12.46 1.4 12.06 1.4z"/></svg>;
const TelegramIcon = ({ className, style }: { className?: string, style?: React.CSSProperties }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} style={style} viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.223-.548.223l.188-2.85 5.18-4.686c.223-.195-.054-.304-.346-.11l-6.4 4.02-2.76-.89c-.6-.188-.612-.6.126-.89l10.814-4.17c.502-.18.948.115.76.81z"/></svg>;
const TwitterIcon = ({ className, style }: { className?: string, style?: React.CSSProperties }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} style={style} viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
const LinkedinIcon = ({ className, style }: { className?: string, style?: React.CSSProperties }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} style={style} viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;

const links = [
  { name: 'Facebook', icon: FacebookIcon, url: 'https://www.facebook.com/share/1A9JixVxY3/', color: '#1877F2' },
  { name: 'Instagram', icon: InstagramIcon, url: 'https://instagram.com/tanmaybariik', color: '#E4405F' },
  { name: 'Snapchat', icon: SnapchatIcon, url: '#', color: '#FFFC00' },
  { name: 'Telegram', icon: TelegramIcon, url: '#', color: '#229ED9' },
  { name: 'X (Twitter)', icon: TwitterIcon, url: 'https://twitter.com/tanmaybariik', color: '#FFFFFF' },
  { name: 'LinkedIn', icon: LinkedinIcon, url: 'https://linkedin.com/in/tanmaybariik', color: '#0A66C2' },
  { name: 'Email', icon: Mail, url: 'mailto:tanmaybaarik@gmail.com', color: '#EA4335' }
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.4 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

export default function SocialLinks() {
  return (
    <div className="w-full">
      <h2 className="text-[10px] font-bold tracking-[0.1em] text-[#6B7A99] mb-[10px] pl-4 uppercase">CONNECT WITH ME</h2>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-[12px]"
      >
        {links.map((link) => (
          <motion.a
            variants={itemVariants}
            whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.06)" }}
            whileTap={{ scale: 0.94 }}
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-14 px-4 rounded-[20px] flex items-center justify-start group bg-white/[0.03] border border-white/[0.08] backdrop-blur-[60px] transition-all overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.25)]"
            style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05), 0 8px 32px rgba(0,0,0,0.25)' }}
          >
            <div className="flex items-center gap-4 overflow-hidden min-w-0 w-full">
              <div className="w-8 min-w-[32px] flex items-center justify-start shrink-0">
                <link.icon 
                  className="w-[22px] h-[22px] transition-colors duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]" 
                  style={{ color: link.color }} 
                />
              </div>
              <span className="text-[15px] font-medium text-white group-hover:text-white transition-colors truncate">{link.name}</span>
            </div>
          </motion.a>
        ))}
      </motion.div>
    </div>
  );
}
