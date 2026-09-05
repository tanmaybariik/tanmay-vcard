'use client';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronDown, Volume2, Play, Pause, SkipForward, SkipBack, AlignLeft, ListMusic, MoreVertical, Heart, Repeat, Shuffle, Music, Menu, Plus, Link as LinkIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import YouTube, { YouTubeProps, YouTubePlayer } from 'react-youtube';
import Image from 'next/image';
import { Bengali } from '../bengali_playlist';
import { English } from '../english_playlist';
import { Hindi } from '../hindi_playlist';

const initialPlaylists = {
  Bengali: Bengali,
  Hindi: Hindi,
  English: English
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

  // Media Session API for lock screen controls
  useEffect(() => {
    if ('mediaSession' in navigator && window.MediaMetadata) {
      try {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: currentSong.title,
          artist: currentSong.artist,
          album: 'Tanmay V-Card',
          artwork: [
            { src: `https://i.ytimg.com/vi/${currentSong.ytId}/hqdefault.jpg`, sizes: '480x360', type: 'image/jpeg' }
          ]
        });

        navigator.mediaSession.setActionHandler('play', () => {
          player?.playVideo();
          setIsPlaying(true);
        });
        navigator.mediaSession.setActionHandler('pause', () => {
          player?.pauseVideo();
          setIsPlaying(false);
        });
        navigator.mediaSession.setActionHandler('previoustrack', () => {
          const list = playlists[activeLang];
          const currentIndex = list.findIndex(s => s.id === currentSong.id);
          const prevSong = list[(currentIndex - 1 + list.length) % list.length];
          if (currentSong.id !== prevSong.id) {
            setCurrentSong(prevSong);
            setIsPlaying(true);
          }
        });
        navigator.mediaSession.setActionHandler('nexttrack', () => {
          const list = playlists[activeLang];
          const currentIndex = list.findIndex(s => s.id === currentSong.id);
          const nextSong = list[(currentIndex + 1) % list.length];
          if (currentSong.id !== nextSong.id) {
            setCurrentSong(nextSong);
            setIsPlaying(true);
          }
        });
      } catch (e) {
        console.error("MediaSession error", e);
      }
    }
  }, [currentSong, player, activeLang, playlists]);

  const handlePlay = (song: typeof currentSong) => {
    const silentAudio = document.getElementById('silent-audio') as HTMLAudioElement;

    if (currentSong.id === song.id) {
      if (isPlaying) {
        player?.pauseVideo();
        setIsPlaying(false);
        silentAudio?.pause();
      } else {
        player?.playVideo();
        setIsPlaying(true);
        silentAudio?.play().catch(() => {});
      }
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
      setCurrentTime(0);
      setDuration(0);
      silentAudio?.play().catch(() => {});
    }
  };

  const onReady: YouTubeProps['onReady'] = (event) => {
    setPlayer(event.target);
  };

  const onStateChange: YouTubeProps['onStateChange'] = (event) => {
    const silentAudio = document.getElementById('silent-audio') as HTMLAudioElement;
    // 1 is playing, 2 is paused, 0 is ended
    if (event.data === 1) {
      setIsPlaying(true);
      silentAudio?.play().catch(() => {});
    }
    if (event.data === 2) {
      setIsPlaying(false);
      silentAudio?.pause();
    }
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
      playsinline: 1,
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
          className={`fixed inset-0 z-[100] flex items-end justify-center transition-opacity duration-200 ${isOpen ? 'bg-black/50 backdrop-blur-sm pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <motion.div
            initial={false}
            animate={{
              y: isOpen ? 0 : "100%",
            }}
            transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
            className="w-full h-[92vh] bg-[#1c1c1e] rounded-t-[32px] relative flex flex-col overflow-hidden max-w-[500px] mx-auto shadow-2xl pointer-events-auto border-t border-white/10"
            style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
          >
            {/* Draggable indicator / Header */}
            <div className="w-full flex justify-center pt-4 pb-2 shrink-0 cursor-pointer" onClick={() => setIsOpen(false)}>
              <div className="w-10 h-1.5 bg-white/20 rounded-full" />
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 pb-8 custom-scrollbar">
              {/* Album Art / YouTube Player */}
              <div className="w-full aspect-square rounded-[12px] overflow-hidden bg-black shadow-[0_20px_40px_rgba(0,0,0,0.4)] relative shrink-0 mt-4 mb-8">
                <YouTube
                  videoId={currentSong.ytId}
                  opts={{ ...opts, width: '100%', height: '100%' }}
                  onReady={onReady}
                  onStateChange={onStateChange}
                  className="absolute inset-0 w-full h-full pointer-events-none flex items-center justify-center" 
                  iframeClassName="w-[180%] h-[180%] max-w-none"
                />
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

              {/* Track Info & Controls */}
              <div className="w-full flex flex-col mb-8">
                <div className="flex justify-between items-center w-full mb-6">
                  <div className="flex flex-col overflow-hidden min-w-0 pr-4">
                    <h1 className="text-[22px] font-bold text-white mb-0.5 truncate tracking-tight">{currentSong.title}</h1>
                    <p className="text-[16px] text-white/60 truncate">{currentSong.artist}</p>
                  </div>
                  <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-colors shrink-0">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="flex flex-col w-full mb-8">
                  <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1.5 bg-white/20 rounded-full appearance-none outline-none cursor-pointer accent-white mb-2"
                    style={{
                      background: `linear-gradient(to right, white 0%, white ${(currentTime / (duration || 1)) * 100}%, rgba(255,255,255,0.2) ${(currentTime / (duration || 1)) * 100}%)`
                    }}
                  />
                  <div className="flex justify-between w-full">
                    <span className="text-[11px] font-medium text-white/50">{formatTime(currentTime)}</span>
                    <span className="text-[11px] font-medium text-white/50">-{formatTime(duration - currentTime > 0 ? duration - currentTime : 0)}</span>
                  </div>
                </div>

                {/* Playback Controls */}
                <div className="flex items-center justify-center gap-12 w-full mb-8">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const list = playlists[activeLang];
                      const currentIndex = list.findIndex(s => s.id === currentSong.id);
                      const prevSong = list[(currentIndex - 1 + list.length) % list.length];
                      handlePlay(prevSong);
                    }}
                    className="text-white hover:text-white/70 transition-colors active:scale-90"
                  >
                    <SkipBack className="w-10 h-10" fill="currentColor" />
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
                    className="w-[72px] h-[72px] flex items-center justify-center rounded-full bg-white text-[#1c1c1e] hover:scale-105 active:scale-95 transition-all shadow-lg"
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
                    className="text-white hover:text-white/70 transition-colors active:scale-90"
                  >
                    <SkipForward className="w-10 h-10" fill="currentColor" />
                  </button>
                </div>
              </div>

              {/* Language Tabs / iOS Segmented Control */}
              <div className="flex w-full bg-black/40 rounded-[12px] p-1 shrink-0 mb-6 relative overflow-hidden">
                {(Object.keys(playlists) as Language[]).map(lang => (
                  <button
                    key={lang}
                    onClick={() => setActiveLang(lang)}
                    className={`flex-1 py-3 text-[16px] font-bold tracking-wide rounded-[10px] transition-all relative z-10 ${activeLang === lang
                        ? 'text-white shadow-sm'
                        : 'text-white/60 hover:text-white'
                      }`}
                  >
                    {lang}
                  </button>
                ))}
                {/* Active pill background */}
                <div
                  className="absolute top-1 bottom-1 rounded-[10px] bg-[#3B3B3B] transition-all duration-300 ease-out z-0"
                  style={{
                    width: `calc(100% / ${Object.keys(playlists).length} - 8px)`,
                    transform: `translateX(calc(${Object.keys(playlists).indexOf(activeLang)} * 100% + ${Object.keys(playlists).indexOf(activeLang) * 8}px))`
                  }}
                />
              </div>

              {/* Playlist items */}
              <div className="flex flex-col gap-1 w-full pb-8">
                {playlists[activeLang].map((song) => {
                  const isActive = currentSong.id === song.id;
                  return (
                    <div
                      key={song.id}
                      onClick={() => handlePlay(song)}
                      className={`group flex items-center py-2 px-1 rounded-xl cursor-pointer transition-all ${isActive ? 'bg-white/5' : 'hover:bg-white/5'}`}
                    >
                      <div className="w-12 h-12 rounded-[6px] flex items-center justify-center shrink-0 mr-3 overflow-hidden relative shadow-sm">
                        <Image
                          src={`https://i.ytimg.com/vi/${song.ytId}/hqdefault.jpg`}
                          alt="Thumbnail"
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                        {isActive && isPlaying && (
                          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                            <motion.div className="flex gap-[2px] items-end h-3">
                              <motion.div animate={{ height: ["3px", "8px", "3px"] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-0.5 bg-white rounded-t-sm" />
                              <motion.div animate={{ height: ["3px", "6px", "3px"] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.2 }} className="w-0.5 bg-white rounded-t-sm" />
                              <motion.div animate={{ height: ["3px", "10px", "3px"] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-0.5 bg-white rounded-t-sm" />
                            </motion.div>
                          </div>
                        )}
                        {(!isActive || !isPlaying) && (
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                            <Play className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity ml-0.5" fill="currentColor" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col flex-1 min-w-0 pr-2 border-b border-white/5 pb-1 pt-1 group-hover:border-transparent">
                        <span className={`text-[15px] font-medium truncate transition-colors ${isActive ? 'text-white' : 'text-white'}`}>{song.title}</span>
                        <span className={`text-[13px] truncate transition-colors ${isActive ? 'text-white/60' : 'text-white/40'}`}>{song.artist}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add Custom Song */}
              <div className="w-full flex gap-2 pt-2 pb-8">
                <div className="flex-1 relative">
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    value={linkInput}
                    onChange={(e) => handleAddLink(e.target.value)}
                    placeholder="Add YouTube Link..."
                    className="w-full h-[40px] bg-white/5 rounded-[8px] pl-10 pr-4 text-[13px] text-white placeholder-white/30 outline-none focus:bg-white/10 transition-colors"
                  />
                  {isAddingSong && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-white/50 border-t-transparent rounded-full animate-spin" />
                  )}
                </div>
                <button
                  onClick={() => handleAddLink(linkInput)}
                  className="w-[40px] h-[40px] flex items-center justify-center rounded-[8px] bg-white text-black hover:opacity-90 transition-opacity shrink-0"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

            </div>
          </motion.div>
        </div>,
        document.body
      )}

      {/* Silent Audio element to keep the Audio context active for iOS/Android when screen is locked */}
      <audio 
        id="silent-audio" 
        loop 
        playsInline 
        src="data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=" 
      />
    </>
  );
}
