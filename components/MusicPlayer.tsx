'use client';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronDown, Volume2, Play, Pause, SkipForward, SkipBack, AlignLeft, ListMusic, MoreVertical, Heart, Repeat, Shuffle, Music, Menu, Plus, Link as LinkIcon } from 'lucide-react';
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
        whileHover={{ scale: 1.02, backgroundColor: "rgba(28,35,51,0.6)", borderColor: "rgba(59,130,246,0.5)" }}
        whileTap={{ scale: 0.94 }}
        onClick={(e) => {
          if (!(e.target as HTMLElement).closest('button')) {
            setIsOpen(true);
          }
        }}
        className="w-full aspect-[1/1] bg-[#1C2333]/40 backdrop-blur-md border border-[#3B82F6]/20 rounded-[24px] flex flex-col items-center justify-center relative transition-all cursor-pointer overflow-hidden p-4 shadow-[0_8px_32px_rgba(0,0,0,0.15)]"
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

        <div className="flex flex-col items-center mb-2 w-full px-2 overflow-hidden mt-auto">
          <div className="w-full relative overflow-hidden whitespace-nowrap mb-0.5 flex justify-center">
            <motion.span
              animate={isPlaying ? { x: [20, -20, 20] } : { x: 0 }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              className="text-[12px] font-bold text-white tracking-wide inline-block"
            >
              {currentSong.title}
            </motion.span>
          </div>
          <span className="text-[10px] text-[#8F9BB3] truncate w-full text-center">{currentSong.artist}</span>
        </div>

        <div className="flex items-center justify-center w-full mt-auto gap-4">
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

      {typeof window !== 'undefined' && createPortal(
        <div
          className={`fixed inset-0 z-[100] flex items-center justify-center transition-colors duration-500 ${isOpen ? 'bg-black/40 pointer-events-auto' : 'bg-transparent pointer-events-none'
            }`}
        >
          <motion.div
            initial={false}
            animate={{
              y: isOpen ? 0 : "100%",
              opacity: isOpen ? 1 : 0
            }}
            transition={{ type: 'spring', stiffness: 200, damping: 30, mass: 1 }}
            className="w-full h-full bg-[#030712] relative flex flex-col overflow-y-auto overflow-x-hidden max-w-[430px] mx-auto shadow-2xl pointer-events-auto custom-scrollbar"
            style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
          >
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-[#3B82F6]/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-0 w-[250px] h-[250px] bg-[#8B5CF6]/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 flex flex-col h-full w-full px-5 pt-10 pb-8">

              {/* Top Header */}
              <div className="flex justify-between items-center w-full mb-6 shrink-0">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2">
                  <Music className="w-4 h-4 text-[#3B82F6]" />
                  <h2 className="text-[11px] font-bold tracking-[0.2em] text-[#8F9BB3] uppercase">
                    NOW PLAYING
                  </h2>
                </div>
                <button
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
                >
                  <AlignLeft className="w-5 h-5" />
                </button>
              </div>

              {/* Main Player Card */}
              <div className="w-full flex flex-col rounded-[24px] bg-[#1C2333]/40 border border-[#3B82F6]/30 shadow-[0_0_30px_rgba(59,130,246,0.1)] p-4 mb-6 shrink-0 backdrop-blur-md">

                {/* Internal Card Header */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden relative border border-white/10 shadow-sm shrink-0">
                      <Image
                        src={`https://i.ytimg.com/vi/${currentSong.ytId}/hqdefault.jpg`}
                        alt="Tiny Art"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col min-w-0 pr-2">
                      <span className="text-white text-[13px] font-bold leading-tight truncate">{currentSong.title}</span>
                      <span className="text-white/50 text-[10px] leading-tight truncate">YouTube Audio</span>
                    </div>
                  </div>
                  <button className="text-white/60 hover:text-white transition-colors shrink-0">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                {/* Album Art / YouTube Video Player */}
                <div className="w-full aspect-video rounded-[16px] overflow-hidden bg-black shadow-inner relative shrink-0 mb-4">
                  <YouTube
                    videoId={currentSong.ytId}
                    opts={{ ...opts, width: '100%', height: '100%' }}
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

                {/* Track Info */}
                <div className="flex justify-between items-center w-full">
                  <div className="flex flex-col overflow-hidden pr-4 min-w-0">
                    <motion.h1
                      className="text-[22px] font-bold text-white mb-1 whitespace-nowrap truncate"
                    >
                      {currentSong.title}
                    </motion.h1>
                    <p className="text-[#3B82F6] text-[14px] font-medium tracking-wide truncate">{currentSong.artist}</p>
                  </div>
                  <button className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 text-white/70 hover:bg-white/5 hover:text-white transition-colors shrink-0">
                    <Heart className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="flex items-center gap-3 w-full mb-8 shrink-0 px-1">
                <span className="text-[11px] font-medium text-[#8F9BB3] w-8 text-right shrink-0">{formatTime(currentTime)}</span>
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeek}
                  className="flex-1 h-1 bg-white/10 rounded-full appearance-none outline-none overflow-hidden cursor-pointer accent-[#3B82F6]"
                  style={{
                    background: `linear-gradient(to right, #8B5CF6 0%, #3B82F6 ${(currentTime / (duration || 1)) * 100}%, rgba(255,255,255,0.1) ${(currentTime / (duration || 1)) * 100}%)`
                  }}
                />
                <span className="text-[11px] font-medium text-[#8F9BB3] w-8 shrink-0">{formatTime(duration)}</span>
              </div>

              {/* Playback Controls */}
              <div className="flex items-center justify-between px-2 mb-8 w-full shrink-0">
                <button className="text-[#8F9BB3] hover:text-white transition-colors">
                  <Shuffle className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-6">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const list = playlists[activeLang];
                      const currentIndex = list.findIndex(s => s.id === currentSong.id);
                      const prevSong = list[(currentIndex - 1 + list.length) % list.length];
                      handlePlay(prevSong);
                    }}
                    className="p-2 text-white hover:text-[#3B82F6] transition-colors active:scale-90"
                  >
                    <SkipBack className="w-7 h-7" fill="currentColor" />
                  </button>

                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#3B82F6] to-[#8B5CF6] rounded-full blur-[8px] opacity-60 pointer-events-none" />
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
                      className="relative w-16 h-16 flex items-center justify-center rounded-full bg-[#1C2333] border-2 border-[#3B82F6]/50 text-white hover:scale-105 active:scale-95 transition-all shadow-lg"
                    >
                      {isPlaying ? (
                        <Pause className="w-7 h-7" fill="currentColor" />
                      ) : (
                        <Play className="w-7 h-7 ml-1" fill="currentColor" />
                      )}
                    </button>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const list = playlists[activeLang];
                      const currentIndex = list.findIndex(s => s.id === currentSong.id);
                      const nextSong = list[(currentIndex + 1) % list.length];
                      handlePlay(nextSong);
                    }}
                    className="p-2 text-white hover:text-[#3B82F6] transition-colors active:scale-90"
                  >
                    <SkipForward className="w-7 h-7" fill="currentColor" />
                  </button>
                </div>

                <button className="text-[#8F9BB3] hover:text-white transition-colors">
                  <Repeat className="w-5 h-5" />
                </button>
              </div>

              {/* Language Tabs */}
              <div className="flex w-full bg-white/[0.03] rounded-full p-1 border border-white/5 shrink-0 mb-6 relative overflow-hidden">
                {(Object.keys(playlists) as Language[]).map(lang => (
                  <button
                    key={lang}
                    onClick={() => setActiveLang(lang)}
                    className={`flex-1 py-2.5 text-[12px] font-bold tracking-wider uppercase rounded-full transition-all relative z-10 ${activeLang === lang
                        ? 'text-white shadow-sm'
                        : 'text-[#8F9BB3] hover:text-white/80'
                      }`}
                  >
                    {lang}
                  </button>
                ))}
                {/* Active pill background */}
                <div
                  className="absolute top-1 bottom-1 rounded-full bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] transition-all duration-300 ease-out shadow-[0_0_15px_rgba(59,130,246,0.3)] z-0"
                  style={{
                    width: `calc(100% / ${Object.keys(playlists).length} - 8px)`,
                    transform: `translateX(calc(${Object.keys(playlists).indexOf(activeLang)} * 100% + ${Object.keys(playlists).indexOf(activeLang) * 8}px))`
                  }}
                />
              </div>

              {/* Custom Link Input */}
              <div className="w-full mb-8 shrink-0 flex gap-2">
                <div className="flex-1 relative">
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8F9BB3]" />
                  <input
                    type="text"
                    value={linkInput}
                    onChange={(e) => handleAddLink(e.target.value)}
                    placeholder="Paste YouTube Link here..."
                    className="w-full h-[48px] bg-[#1C2333]/40 border border-white/10 rounded-[16px] pl-11 pr-4 text-[13px] text-white placeholder-[#8F9BB3] outline-none focus:border-[#3B82F6]/50 transition-colors shadow-inner backdrop-blur-sm"
                  />
                  {isAddingSong && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-[#3B82F6] border-t-transparent rounded-full animate-spin" />
                  )}
                </div>
                <button
                  onClick={() => handleAddLink(linkInput)}
                  className="w-[48px] h-[48px] flex items-center justify-center rounded-[16px] bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(59,130,246,0.3)] shrink-0"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {/* Playlist Section Header */}
              <div className="flex justify-between items-center w-full mb-4 px-1 shrink-0">
                <span className="text-[11px] font-bold tracking-[0.2em] text-[#8F9BB3] uppercase">PLAYLIST</span>
                <div className="flex items-center gap-1">
                  <div className="flex gap-[2px] items-end h-3">
                    <motion.div animate={{ height: ["3px", "8px", "3px"] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-[2px] bg-[#3B82F6] rounded-t-sm" />
                    <motion.div animate={{ height: ["3px", "6px", "3px"] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.2 }} className="w-[2px] bg-[#3B82F6] rounded-t-sm" />
                    <motion.div animate={{ height: ["3px", "10px", "3px"] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-[2px] bg-[#3B82F6] rounded-t-sm" />
                    <motion.div animate={{ height: ["3px", "7px", "3px"] }} transition={{ repeat: Infinity, duration: 0.7, delay: 0.1 }} className="w-[2px] bg-[#3B82F6] rounded-t-sm" />
                  </div>
                  <span className="text-[10px] font-bold tracking-[0.1em] text-[#3B82F6] uppercase ml-1">NOW PLAYING</span>
                </div>
              </div>

              {/* Up Next List */}
              <div className="flex-1 flex flex-col gap-2 pb-6">
                {playlists[activeLang].map((song) => {
                  const isActive = currentSong.id === song.id;
                  return (
                    <div
                      key={song.id}
                      onClick={() => handlePlay(song)}
                      className={`group flex items-center p-3 rounded-2xl cursor-pointer transition-all border ${isActive
                          ? 'bg-[#1C2333]/60 border-[#3B82F6]/30 shadow-[0_0_15px_rgba(59,130,246,0.1)] backdrop-blur-md'
                          : 'bg-transparent border-transparent hover:bg-white/[0.04]'
                        }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 mr-4 overflow-hidden relative shadow-md transition-transform group-hover:scale-105 ${isActive ? 'ring-1 ring-[#3B82F6]/50' : ''}`}>
                        <Image
                          src={`https://i.ytimg.com/vi/${song.ytId}/hqdefault.jpg`}
                          alt="Thumbnail"
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                        {isActive && isPlaying && (
                          <div className="absolute inset-0 bg-[#3B82F6]/20 backdrop-blur-[2px] flex items-center justify-center">
                            <Play className="w-4 h-4 text-white drop-shadow-md ml-0.5" fill="currentColor" />
                          </div>
                        )}
                        {(!isActive || !isPlaying) && (
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                            <Play className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md ml-0.5" fill="currentColor" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col flex-1 min-w-0 pr-2">
                        <span className={`text-[14px] font-bold truncate tracking-wide transition-colors ${isActive ? 'text-white' : 'text-[#E2E8F0] group-hover:text-white'}`}>{song.title}</span>
                        <span className={`text-[12px] truncate mt-0.5 transition-colors ${isActive ? 'text-[#3B82F6]' : 'text-[#8F9BB3]'}`}>{song.artist}</span>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {isActive && (
                          <div className="flex gap-[3px] items-end h-3 mr-2">
                            <motion.div animate={{ height: ["3px", "8px", "3px"] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-0.5 bg-[#3B82F6] rounded-t-sm shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                            <motion.div animate={{ height: ["3px", "6px", "3px"] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.2 }} className="w-0.5 bg-[#3B82F6] rounded-t-sm shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                            <motion.div animate={{ height: ["3px", "10px", "3px"] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-0.5 bg-[#3B82F6] rounded-t-sm shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                          </div>
                        )}
                        <span className="text-[11px] font-medium text-[#8F9BB3]">
                          {isActive ? formatTime(duration) : '0:00'}
                        </span>
                        <button className="text-[#8F9BB3] hover:text-white transition-colors p-1">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* Padding at the bottom */}
                <div className="w-full h-6" />
              </div>
            </div>
          </motion.div>
        </div>,
        document.body
      )}
    </>
  );
}
