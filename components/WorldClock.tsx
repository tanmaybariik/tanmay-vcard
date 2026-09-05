'use client';
import { useEffect, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Globe, MapPin, Clock } from 'lucide-react';

// City mapping with flags and IANA timezones
const CITIES = [
  { id: 'in', name: 'INDIA', timeZone: 'Asia/Kolkata', flag: '🇮🇳' },
  { id: 'us', name: 'NEW YORK', timeZone: 'America/New_York', flag: '🇺🇸' },
  { id: 'uk', name: 'LONDON', timeZone: 'Europe/London', flag: '🇬🇧' },
  { id: 'jp', name: 'TOKYO', timeZone: 'Asia/Tokyo', flag: '🇯🇵' },
];

const ClockFace = ({ time, timeZone, label, flag, isLocal = false }: { time: Date, timeZone: string, label: string, flag: string, isLocal?: boolean }) => {
  // Use Intl.DateTimeFormat to reliably extract local hour, minute, second for the given timezone
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false
  });

  const parts = formatter.formatToParts(time);
  let hours = parseInt(parts.find(p => p.type === 'hour')?.value || '0', 10);
  const minutes = parseInt(parts.find(p => p.type === 'minute')?.value || '0', 10);
  const seconds = parseInt(parts.find(p => p.type === 'second')?.value || '0', 10);

  if (hours === 24) hours = 0;

  // Degrees
  const hourDegrees = (hours % 12) * 30 + minutes * 0.5;
  const minuteDegrees = minutes * 6 + seconds * 0.1;
  const secondDegrees = seconds * 6;

  // Digital formatting
  const digitalFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const digitalTimeStr = digitalFormatter.format(time);
  const [timeDigit, ampm] = digitalTimeStr.split(' ');

  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div
      className={`flex flex-col items-center p-5 bg-[#1C2333]/40 backdrop-blur-md border rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.15)] relative overflow-hidden transition-all active:scale-[0.98] ${isLocal ? 'border-[#3B82F6]/40' : 'border-[#3B82F6]/20 hover:border-[#8B5CF6]/40'}`}
    >
      {/* Glow for local */}
      {isLocal && <div className="absolute inset-0 bg-[#3B82F6]/5 pointer-events-none" />}

      {/* Analog Clock */}
      <div className="relative w-full aspect-square max-w-[120px] rounded-full border border-white/10 flex items-center justify-center mb-5 bg-[#090D1A]/50">

        {/* Subtle Map Background (optional detail) */}
        <div className="absolute inset-2 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_100%)] rounded-full pointer-events-none" />

        {/* Tick Marks */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-full"
            style={{ transform: `rotate(${i * 30}deg)` }}
          >
            <div className={`mx-auto w-[1.5px] ${i % 3 === 0 ? 'h-[6px] bg-white/80' : 'h-[4px] bg-white/30'} rounded-full mt-1.5`} />
          </div>
        ))}

        {/* Hands */}
        <div
          className="absolute w-[2.5px] h-[25%] bg-white rounded-full origin-bottom"
          style={{ transform: `translateY(-50%) rotate(${hourDegrees}deg)` }}
        />
        <div
          className="absolute w-[1.5px] h-[35%] bg-white/90 rounded-full origin-bottom"
          style={{ transform: `translateY(-50%) rotate(${minuteDegrees}deg)` }}
        />
        <div
          className="absolute w-[1.5px] h-[40%] bg-[#3B82F6] rounded-full origin-bottom shadow-[0_0_8px_rgba(59,130,246,0.8)] transition-transform duration-1000 ease-linear"
          style={{ transform: `translateY(-50%) rotate(${secondDegrees}deg)` }}
        />

        {/* Center Point */}
        <div className="absolute w-[6px] h-[6px] bg-[#3B82F6] rounded-full z-10 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
      </div>

      {/* City Label */}
      <div className="flex items-center gap-2 mb-2 relative z-10">
        <span className="text-[14px] leading-none">{flag}</span>
        <span className="text-[12px] font-bold tracking-[0.15em] text-[#8F9BB3] uppercase">{label}</span>
      </div>

      {/* Digital Time */}
      <div className="flex items-center gap-2 relative z-10">
        <span className="text-[26px] font-bold text-white tracking-wider tabular-nums leading-none">{timeDigit}</span>
        <div className="px-2 py-0.5 rounded-md bg-[#3B82F6]/10 border border-[#3B82F6]/30 text-[#3B82F6] text-[10px] font-bold uppercase mt-1">
          {ampm}
        </div>
      </div>

      {/* Date (for Local Time primarily) */}
      {isLocal && (
        <div className="text-[10px] text-[#8F9BB3] mt-2 text-center uppercase tracking-wider relative z-10">
          {dateFormatter.format(time)}
        </div>
      )}
    </div>
  );
};

export default function WorldClock() {
  const [time, setTime] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [localTimeZone, setLocalTimeZone] = useState('UTC');

  useEffect(() => {
    setLocalTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    // Use an interval for general update. Since we use CSS transition for the second hand, 1s interval is perfect.
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
      {/* Trigger Button inside Page */}
      <motion.div
        whileHover={{ scale: 1.02, backgroundColor: "rgba(28,35,51,0.6)", borderColor: "rgba(59,130,246,0.5)" }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setIsOpen(true)}
        className="w-full aspect-[1/1] bg-[#1C2333]/40 backdrop-blur-md border border-[#3B82F6]/20 rounded-[24px] flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden p-4 shadow-[0_8px_32px_rgba(0,0,0,0.15)] group"
      >
        <div className="relative w-[55px] h-[55px] rounded-full border border-white/10 flex items-center justify-center mb-3 bg-[#090D1A]/50 transition-colors duration-300">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-full h-full"
              style={{ transform: `rotate(${i * 30}deg)` }}
            >
              <div className={`mx-auto w-[1.5px] ${i % 3 === 0 ? 'h-[4px] bg-white' : 'h-[2px] bg-white/30'} rounded-full mt-1`} />
            </div>
          ))}
          <div className="absolute w-[2px] h-[25%] bg-white rounded-full origin-bottom" style={{ transform: `translateY(-50%) rotate(${hourDegrees}deg)` }} />
          <div className="absolute w-[1.5px] h-[35%] bg-white/90 rounded-full origin-bottom" style={{ transform: `translateY(-50%) rotate(${minuteDegrees}deg)` }} />
          <div className="absolute w-[1px] h-[40%] bg-[#3B82F6] rounded-full origin-bottom shadow-[0_0_8px_rgba(59,130,246,0.6)] transition-transform duration-1000 ease-linear" style={{ transform: `translateY(-50%) rotate(${secondDegrees}deg)` }} />
          <div className="absolute w-[4px] h-[4px] bg-[#3B82F6] rounded-full z-10 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
        </div>

        <div className="flex flex-col items-center mt-auto">
          <div className="text-[10px] font-bold tracking-[0.15em] text-[#8F9BB3] mb-1 group-hover:text-white transition-colors duration-300">LOCAL TIME</div>
          <div className="text-[12px] font-bold text-white tracking-wider uppercase">{new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).format(time)}</div>
        </div>
      </motion.div>

      {/* Fullscreen Portal */}
      {typeof window !== 'undefined' && createPortal(
        <AnimatePresence>
          {isOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#030712] pointer-events-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="w-full h-full relative flex flex-col overflow-y-auto overflow-x-hidden max-w-[430px] mx-auto custom-scrollbar"
              >

                {/* Ambient Background Glow */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[40%] bg-[#3B82F6]/10 blur-[100px] rounded-full" />
                  <div className="absolute top-[40%] -right-[10%] w-[50%] h-[50%] bg-[#8B5CF6]/5 blur-[100px] rounded-full" />
                </div>

                <div className="relative z-10 flex flex-col h-full w-full px-4 pt-10 pb-8">

                  {/* Header */}
                  <div className="flex justify-between items-center w-full mb-2">
                    <button
                      onClick={() => setIsOpen(false)}
                      className="w-10 h-10 rounded-full border border-[#3B82F6]/30 bg-[#1C2333]/60 text-white hover:bg-white/10 transition-colors flex items-center justify-center backdrop-blur-md shrink-0"
                      aria-label="Close"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    <div className="flex flex-col items-center justify-center flex-1">
                      <h2 className="text-[14px] font-bold tracking-[0.2em] text-white uppercase flex items-center gap-2">
                        <Globe className="w-4 h-4 text-[#3B82F6]" /> WORLD CLOCKS
                      </h2>
                    </div>

                    <div className="w-10 h-10 shrink-0" /> {/* Spacer */}
                  </div>

                  <div className="w-full text-center mb-6 flex items-center justify-center">
                    <div className="h-[1px] w-4 bg-[#3B82F6]/50 rounded-full mr-3"></div>
                    <span className="text-[12px] bg-clip-text text-transparent bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6]">
                      Track time around the world
                    </span>
                    <div className="h-[1px] w-4 bg-[#8B5CF6]/50 rounded-full ml-3"></div>
                  </div>

                  {/* Content Grid */}
                  <div className="flex-1 w-full flex flex-col gap-6 pb-10">

                    {/* Your Location */}
                    <div className="w-full flex flex-col gap-3">
                      <div className="flex items-center gap-2 px-1">
                        <MapPin className="w-4 h-4 text-[#3B82F6]" />
                        <span className="text-[11px] font-bold tracking-widest text-[#8F9BB3] uppercase">YOUR LOCATION</span>
                      </div>
                      <div className="w-full">
                        <ClockFace time={time} timeZone={localTimeZone} label="LOCAL TIME" flag="📍" isLocal={true} />
                      </div>
                    </div>

                    {/* Global Grid */}
                    <div className="w-full flex flex-col gap-3">
                      <div className="flex items-center gap-2 px-1">
                        <Clock className="w-4 h-4 text-[#8B5CF6]" />
                        <span className="text-[11px] font-bold tracking-widest text-[#8F9BB3] uppercase">GLOBAL CLOCKS</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {CITIES.map((city) => (
                          <ClockFace
                            key={city.id}
                            time={time}
                            timeZone={city.timeZone}
                            label={city.name}
                            flag={city.flag}
                          />
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Footer */}
                  <div className="w-full text-center mt-auto pt-4 flex flex-col items-center gap-1">
                    <Clock className="w-3 h-3 text-[#8F9BB3]/50" />
                    <p className="text-[10px] text-[#8F9BB3] uppercase tracking-wider">All times are shown in local time</p>
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
