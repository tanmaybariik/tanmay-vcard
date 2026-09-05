'use client';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Volume2, Play, Pause, SkipForward, SkipBack, AlignLeft, ListMusic } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import YouTube, { YouTubeProps, YouTubePlayer } from 'react-youtube';
import Image from 'next/image';

const initialPlaylists = {
  Bengali: [
    { id: 'b1', title: 'Ekla Cholo Re', artist: 'Kishore Kumar', ytId: '1wP_eH1n8Qc', lyrics: "Jodi tor dak shune keu na ashe tobe ekla cholo re...\n\nEkla cholo, ekla cholo, ekla cholo, ekla cholo re.\nJodi keu kotha na koy, ore ore o obhaga,\nJodi sobai thake mukh phiraye sobai kore bhoy—\nTobe poran khule\nO tui mukh phute tor moner kotha ekla bolo re." },
    { id: 'b2', title: 'Ami Je Tomar', artist: 'Shreya Ghoshal', ytId: 'bB4g8lM9M1c', lyrics: "Ami je tomar, shudhu je tomar...\nAmi je tomar.\n\nMeri chaahatein toh fiza mein bahengi,\nZinda rahengi hoke fanaa.\nTana dere na, tana dere na..." },
    { id: 'b3', title: 'Boba Tunnel', artist: 'Anupam Roy', ytId: '5Z13V0vYI7g', lyrics: "Hashte dekho gaite dekho,\nAnek kothay mukhor amay dekho.\nDekho na keu hasir seshe nirobota...\n\nBoba tunnel er bhetor amay dekho na,\nJekhane ondhokar aar shudhu hothat kanna." },
  ],
  Hindi: [
    { id: 'h1', title: 'Tum Hi Ho', artist: 'Arijit Singh', ytId: 'Umqb9KENgmk', lyrics: "Hum tere bin ab reh nahi sakte\nTere bina kya wajood mera\n\nTujhse juda gar ho jaayenge\nToh khud se hi ho jaayenge judaa\n\nKyunki tum hi ho\nAb tum hi ho\nZindagi ab tum hi ho" },
    { id: 'h2', title: 'Channa Mereya', artist: 'Arijit Singh', ytId: 'bzSTpdcs-EI', lyrics: "Acha chalta hoon\nDuaaon mein yaad rakhna\nMere zikr ka zubaan pe swaad rakhna\n\nDil ke sandookon mein\nMere acche kaam rakhna\nChitthi taaron mein bhi\nMera tu salaam rakhna\n\nAndhera tera maine le liya\nMera ujla sitaara tere naam kiya\nChanna mereya mereya\nChanna mereya mereya\nChanna mereya mereya beliya\nO piya..." },
    { id: 'h3', title: 'Apna Bana Le', artist: 'Arijit Singh', ytId: 'cdqA4QzC0fI', lyrics: "Tu mera koi na\nHoke bhi kuch laage\nTu mera koi na\nHoke bhi kuch laage\n\nKiya re jo bhi toone\nKaise kiya re\nJiya ko mere baandh\nAise liya re\nSamajh ke bhi na\nSamajh main saku\n\nApna bana le piya\nApna bana le piya" },
  ],
  English: [
    { id: 'e1', title: 'Shape of You', artist: 'Ed Sheeran', ytId: 'JGwWNGJdvx8', lyrics: "The club isn't the best place to find a lover\nSo the bar is where I go\nMe and my friends at the table doing shots\nDrinking fast and then we talk slow\n\nI'm in love with the shape of you\nWe push and pull like a magnet do\nAlthough my heart is falling too\nI'm in love with your body" },
    { id: 'e2', title: 'Blinding Lights', artist: 'The Weeknd', ytId: '4NRXx6U8ABQ', lyrics: "I've been tryna call\nI've been on my own for long enough\nMaybe you can show me how to love, maybe\n\nI'm blinded by the lights\nNo, I can't sleep until I feel your touch\nI said, ooh, I'm drowning in the night\nOh, when I'm like this, you're the one I trust" },
    { id: 'e3', title: 'Starboy', artist: 'The Weeknd', ytId: '34Na4j8HLjc', lyrics: "I'm tryna put you in the worst mood, ah\nP1 cleaner than your church shoes, ah\nMilli point two just to hurt you, ah\nAll red Lamb' just to tease you, ah\n\nLook what you've done\nI'm a motherfuckin' starboy" },
  ]
};

type Language = keyof typeof initialPlaylists;

export default function MusicPlayer() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeLang, setActiveLang] = useState<Language>('Hindi');
  const [playlists, setPlaylists] = useState(initialPlaylists);
  const [currentSong, setCurrentSong] = useState(playlists['Hindi'][0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const [linkInput, setLinkInput] = useState('');
  const [isAddingSong, setIsAddingSong] = useState(false);

  const handleAddLink = async (url: string) => {
    setLinkInput(url);
    if (!url.trim()) return;
    
    // Extract ID
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    const ytId = match ? match[1] : null;
    
    if (ytId) {
      setIsAddingSong(true);
      try {
        const res = await fetch(`/api/youtube?id=${ytId}`);
        const data = await res.json();
        
        if (data && data.title) {
          const newSong = {
            id: 'custom_' + Date.now(),
            title: data.title,
            artist: data.author_name || 'Unknown Artist',
            ytId: ytId,
            lyrics: "Lyrics not available for custom added songs."
          };
          
          setPlaylists(prev => ({
            ...prev,
            [activeLang]: [newSong, ...prev[activeLang]]
          }));
          
          setLinkInput(''); // clear input
          setCurrentSong(newSong);
          setIsPlaying(true);
          setCurrentTime(0);
          setDuration(0);
        }
      } catch (err) {
        console.error("Failed to add song", err);
      }
      setIsAddingSong(false);
    }
  };

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Poll for current time when playing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && player) {
      interval = setInterval(async () => {
        try {
          const time = await player.getCurrentTime();
          const dur = await player.getDuration();
          if (time !== undefined) setCurrentTime(time);
          if (dur !== undefined && dur > 0) setDuration(dur);
        } catch {
          // ignore
        }
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, player]);

  const handlePlay = (song: typeof currentSong) => {
    if (currentSong.id === song.id) {
      if (isPlaying) {
        player?.pauseVideo();
        setIsPlaying(false);
      } else {
        player?.playVideo();
        setIsPlaying(true);
      }
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
      setCurrentTime(0);
      setDuration(0);
    }
  };

  const onReady: YouTubeProps['onReady'] = (event) => {
    setPlayer(event.target);
  };

  const onStateChange: YouTubeProps['onStateChange'] = (event) => {
    // 1 is playing, 2 is paused, 0 is ended
    if (event.data === 1) setIsPlaying(true);
    if (event.data === 2) setIsPlaying(false);
    if (event.data === 0) {
      // Auto-play next song
      const list = playlists[activeLang];
      const currentIndex = list.findIndex(s => s.id === currentSong.id);
      const nextSong = list[(currentIndex + 1) % list.length];
      setCurrentSong(nextSong);
      setIsPlaying(true);
    }
  };

  const formatTime = (time: number) => {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (player) {
      player.seekTo(newTime, true);
    }
  };

  const opts: YouTubeProps['opts'] = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: isPlaying ? 1 : 0,
      controls: 0, // hide yt controls
      disablekb: 1,
      modestbranding: 1,
      rel: 0,
      showinfo: 0,
    },
  };

  return (
    <>
      <motion.div 
        whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.06)" }}
        whileTap={{ scale: 0.94 }}
        onClick={(e) => {
          if (!(e.target as HTMLElement).closest('button')) {
            setIsOpen(true);
          }
        }}
        className="w-full aspect-[1/1] bg-white/[0.03] backdrop-blur-[60px] border border-white/[0.08] rounded-[24px] flex flex-col items-center justify-center relative transition-all cursor-pointer overflow-hidden p-4 shadow-[0_8px_32px_rgba(0,0,0,0.25)]"
        style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05), 0 8px 32px rgba(0,0,0,0.25)' }}
      >
        <div className="flex flex-col items-center mb-4 mt-2">
          <div className="w-16 h-16 rounded-full overflow-hidden relative shadow-[0_0_15px_rgba(0,0,0,0.3)]">
            <motion.div
              animate={{ rotate: isPlaying ? 360 : 0 }} 
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              className="w-full h-full relative"
            >
              <Image 
                src={`https://i.ytimg.com/vi/${currentSong.ytId}/hqdefault.jpg`} 
                alt="Album Art"
                fill
                sizes="64px"
                className="object-cover"
              />
            </motion.div>
            <div className="absolute inset-0 m-auto w-4 h-4 bg-[#141A2E] rounded-full border border-white/20 shadow-inner" />
          </div>
        </div>
        
        <div className="flex flex-col items-center mb-6 w-full px-2 overflow-hidden">
          <div className="w-full relative overflow-hidden whitespace-nowrap mb-1 flex justify-center">
             <motion.span 
               animate={isPlaying ? { x: [20, -20, 20] } : { x: 0 }}
               transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
               className="text-[13px] font-bold text-white tracking-wide inline-block"
             >
               {currentSong.title}
             </motion.span>
          </div>
          <span className="text-[12px] text-[#8F9BB3] truncate w-full text-center">{currentSong.artist}</span>
        </div>
        
        <div className="flex items-center justify-between w-full px-2 mt-auto gap-2">
          <button 
            onClick={(e) => { 
              e.stopPropagation();
              const list = playlists[activeLang];
              const currentIndex = list.findIndex(s => s.id === currentSong.id);
              const prevSong = list[(currentIndex - 1 + list.length) % list.length];
              handlePlay(prevSong);
            }}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <SkipBack className="w-4 h-4 text-white" fill="currentColor" />
          </button>

          <button 
            onClick={(e) => { 
              e.stopPropagation(); 
              if (isPlaying) {
                player?.pauseVideo();
                setIsPlaying(false);
              } else {
                player?.playVideo();
                setIsPlaying(true);
              }
            }}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors shadow-sm"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-white" fill="currentColor" />
            ) : (
              <Play className="w-5 h-5 text-white ml-[2px]" fill="currentColor" />
            )}
          </button>
          
          <button 
            onClick={(e) => { 
              e.stopPropagation();
              const list = playlists[activeLang];
              const currentIndex = list.findIndex(s => s.id === currentSong.id);
              const nextSong = list[(currentIndex + 1) % list.length];
              handlePlay(nextSong);
            }}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <SkipForward className="w-4 h-4 text-white" fill="currentColor" />
          </button>
        </div>
      </motion.div>

      {/* Always render the full-screen player but hide it visually and disable pointer events when closed */}
      {typeof window !== 'undefined' && createPortal(
        <div 
          className={`fixed inset-0 z-[100] flex items-center justify-center transition-colors duration-500 ${
            isOpen ? 'bg-transparent pointer-events-auto' : 'bg-transparent pointer-events-none'
          }`}
        >
          <motion.div 
            initial={false}
            animate={{ 
              y: isOpen ? 0 : "100%",
              opacity: isOpen ? 1 : 0 
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 35, mass: 0.8 }}
            className="w-full h-full bg-[#0a0a0c]/80 backdrop-blur-[60px] relative flex flex-col overflow-y-auto overflow-x-hidden max-w-[500px] mx-auto shadow-2xl pointer-events-auto custom-scrollbar"
            style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
          >
            
            <div className="relative z-10 flex flex-col h-full w-full px-6 pt-12 pb-8">
              
              {/* Top Bar */}
              <div className="flex justify-between items-center w-full mb-8">
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  <ChevronDown className="w-6 h-6" />
                </button>
                <div className="flex flex-col items-center">
                  <h2 className="text-[10px] font-bold tracking-[0.2em] text-[#8F9BB3] uppercase">
                    NOW PLAYING
                  </h2>
                </div>
                <button 
                  onClick={() => setShowLyrics(!showLyrics)}
                  className={`p-2 rounded-full transition-colors ${showLyrics ? 'bg-white/20 text-white' : 'bg-white/5 text-[#8F9BB3] hover:text-white hover:bg-white/10'}`}
                >
                  {showLyrics ? <ListMusic className="w-5 h-5" /> : <AlignLeft className="w-5 h-5" />}
                </button>
              </div>
  
              {/* Album Art (YouTube Video Player) */}
              <div className={`w-full transition-all duration-500 ease-in-out ${showLyrics ? 'h-[120px] mb-4' : 'aspect-square mb-8'} rounded-[32px] overflow-hidden bg-black/40 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5 relative shrink-0`}>
                <YouTube 
                  videoId={currentSong.ytId}
                  opts={opts}
                  onReady={onReady}
                  onStateChange={onStateChange}
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  iframeClassName="w-full h-full"
                />
                {/* Overlay to prevent clicking iframe directly */}
                <div className="absolute inset-0 z-10 bg-transparent cursor-pointer" onClick={() => {
                  if (isPlaying) {
                    player?.pauseVideo();
                    setIsPlaying(false);
                  } else {
                    player?.playVideo();
                    setIsPlaying(true);
                  }
                }} />
              </div>
  
              {/* Song Info & Progress */}
              <div className="w-full flex flex-col mb-6 px-2 overflow-hidden shrink-0">
                <div className="flex justify-between items-end mb-4">
                  <div className="flex flex-col overflow-hidden">
                    <motion.h1 
                      animate={isPlaying ? { x: [10, -10, 10] } : { x: 0 }}
                      transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                      className="text-2xl sm:text-3xl font-bold text-white mb-1 whitespace-nowrap"
                    >
                      {currentSong.title}
                    </motion.h1>
                    <p className="text-[#3B82F6] text-lg font-medium tracking-wide truncate">{currentSong.artist}</p>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="flex flex-col gap-2 w-full mt-2">
                  <input 
                    type="range" 
                    min={0} 
                    max={duration || 100} 
                    value={currentTime} 
                    onChange={handleSeek}
                    className="w-full h-1.5 bg-white/20 rounded-full appearance-none outline-none overflow-hidden cursor-pointer accent-white"
                    style={{
                      background: `linear-gradient(to right, white ${(currentTime / (duration || 1)) * 100}%, rgba(255,255,255,0.2) ${(currentTime / (duration || 1)) * 100}%)`
                    }}
                  />
                  <div className="flex justify-between text-[11px] font-medium text-white/50">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
              </div>
  
              {/* Playback Controls (Full Screen) */}
              <div className="flex items-center justify-center gap-8 mb-6 w-full shrink-0">
                <button 
                  onClick={(e) => { 
                    e.stopPropagation();
                    const list = playlists[activeLang];
                    const currentIndex = list.findIndex(s => s.id === currentSong.id);
                    const prevSong = list[(currentIndex - 1 + list.length) % list.length];
                    handlePlay(prevSong);
                  }}
                  className="p-3 rounded-full hover:bg-white/10 transition-colors"
                >
                  <SkipBack className="w-8 h-8 text-white" fill="currentColor" />
                </button>
                
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    if (isPlaying) {
                      player?.pauseVideo();
                      setIsPlaying(false);
                    } else {
                      player?.playVideo();
                      setIsPlaying(true);
                    }
                  }}
                  className="p-5 rounded-full bg-white text-black hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8" fill="currentColor" />
                  ) : (
                    <Play className="w-8 h-8 ml-1" fill="currentColor" />
                  )}
                </button>
                
                <button 
                  onClick={(e) => { 
                    e.stopPropagation();
                    const list = playlists[activeLang];
                    const currentIndex = list.findIndex(s => s.id === currentSong.id);
                    const nextSong = list[(currentIndex + 1) % list.length];
                    handlePlay(nextSong);
                  }}
                  className="p-3 rounded-full hover:bg-white/10 transition-colors"
                >
                  <SkipForward className="w-8 h-8 text-white" fill="currentColor" />
                </button>
              </div>
  
              {/* Dynamic Bottom Area: Lyrics OR Up Next */}
              <div className="flex-1 w-full overflow-hidden flex flex-col min-h-[300px] bg-white/[0.02] border border-white/5 rounded-3xl p-4">
                <AnimatePresence mode="wait">
                  {showLyrics ? (
                    <motion.div
                      key="lyrics"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="w-full h-full overflow-y-auto custom-scrollbar pr-2"
                    >
                      <h3 className="text-sm font-bold text-white mb-4">Lyrics</h3>
                      <p className="text-[#8F9BB3] text-lg font-medium leading-relaxed whitespace-pre-wrap">
                        {currentSong.lyrics}
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="upnext"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="w-full h-full flex flex-col"
                    >
                      {/* Language Tabs */}
                      <div className="flex w-full bg-white/5 rounded-full p-1 mb-4 border border-white/5 shrink-0">
                        {(Object.keys(playlists) as Language[]).map(lang => (
                          <button
                            key={lang}
                            onClick={() => setActiveLang(lang)}
                            className={`flex-1 py-2 text-[14px] font-bold tracking-wider uppercase rounded-full transition-all ${
                              activeLang === lang 
                                ? 'bg-white/20 text-white shadow-sm' 
                                : 'text-[#8F9BB3] hover:text-white'
                            }`}
                          >
                            {lang}
                          </button>
                        ))}
                      </div>
                      
                      {/* Add Custom Link Input */}
                      <div className="w-full mb-3 shrink-0 relative">
                        <input 
                          type="text" 
                          value={linkInput}
                          onChange={(e) => handleAddLink(e.target.value)}
                          placeholder="Paste YouTube Link here..."
                          className="w-full bg-white/[0.03] border border-white/10 rounded-full py-2.5 px-4 text-[13px] text-white placeholder-white/40 outline-none focus:border-[#3B82F6]/50 transition-colors shadow-inner"
                        />
                        {isAddingSong && (
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-[#3B82F6] border-t-transparent rounded-full animate-spin" />
                        )}
                      </div>
  
                      {/* Up Next List */}
                      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                        <div className="flex flex-col gap-2">
                          {playlists[activeLang].map((song) => {
                            const isActive = currentSong.id === song.id;
                            return (
                              <div 
                                key={song.id}
                                onClick={() => handlePlay(song)}
                                className={`group flex items-center p-3 rounded-2xl cursor-pointer transition-all border ${
                                  isActive 
                                    ? 'bg-white/[0.08] border-white/20 shadow-lg' 
                                    : 'bg-transparent border-transparent hover:bg-white/[0.04]'
                                }`}
                              >
                                <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 mr-4 overflow-hidden relative shadow-md transition-transform group-hover:scale-105 ${isActive ? 'ring-2 ring-white/50' : ''}`}>
                                  <Image 
                                    src={`https://i.ytimg.com/vi/${song.ytId}/hqdefault.jpg`} 
                                    alt="Thumbnail"
                                    fill
                                    sizes="56px"
                                    className="object-cover"
                                  />
                                  {isActive && isPlaying && (
                                    <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center">
                                      <Volume2 className="w-5 h-5 text-white drop-shadow-md" />
                                    </div>
                                  )}
                                  {(!isActive || !isPlaying) && (
                                     <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                       <Play className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md ml-0.5" fill="currentColor" />
                                     </div>
                                  )}
                                </div>
                                <div className="flex flex-col flex-1 min-w-0">
                                  <span className={`text-[15px] font-bold truncate tracking-wide transition-colors ${isActive ? 'text-white' : 'text-[#E2E8F0] group-hover:text-white'}`}>{song.title}</span>
                                  <span className="text-[13px] text-[#8F9BB3] truncate mt-0.5">{song.artist}</span>
                                </div>
                                
                                {isActive && isPlaying && (
                                  <div className="flex gap-[4px] items-end h-4 ml-3 shrink-0">
                                    <motion.div animate={{ height: ["4px", "12px", "4px"] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1 bg-white rounded-t-sm shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                                    <motion.div animate={{ height: ["4px", "8px", "4px"] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.2 }} className="w-1 bg-white rounded-t-sm shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                                    <motion.div animate={{ height: ["4px", "16px", "4px"] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1 bg-white rounded-t-sm shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
  
            </div>
          </motion.div>
        </div>,
        document.body
      )}
    </>
  );
}
