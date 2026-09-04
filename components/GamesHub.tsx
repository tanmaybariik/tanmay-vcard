'use client';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Gamepad2, ArrowRight, X, Play, ArrowLeft, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import Image from 'next/image';

const TicTacToe = dynamic(() => import('./games/TicTacToe'), { ssr: false });
const MemoryMatch = dynamic(() => import('./games/MemoryMatch'), { ssr: false });
const SnakeGame = dynamic(() => import('./games/SnakeGame'), { ssr: false });
const SimonGame = dynamic(() => import('./games/SimonGame'), { ssr: false });
const DiceGame = dynamic(() => import('./games/DiceGame'), { ssr: false });
const LudoGame = dynamic(() => import('./games/LudoGame'), { ssr: false });

const games = [
  { id: 'ludo', name: 'Mini Ludo', desc: '1v1 Track Race', image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=400&auto=format&fit=crop' },
  { id: 'dice', name: 'High / Low', desc: 'Roll the Dice', image: 'https://images.unsplash.com/photo-1570303345338-e1f0eddf4946?q=80&w=400&auto=format&fit=crop' },
  { id: 'simon', name: 'Simon Says', desc: 'Memory Sequence', image: 'https://images.unsplash.com/photo-1614294149010-950b698f72c0?q=80&w=400&auto=format&fit=crop' },
  { id: 'snake', name: 'Snake', desc: 'Classic Retro Snake', image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=400&auto=format&fit=crop' },
  { id: 'tictactoe', name: 'Tic Tac Toe', desc: 'Player vs Player', image: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?q=80&w=400&auto=format&fit=crop' },
  { id: 'memory', name: 'Memory Match', desc: 'Find the pairs', image: 'https://images.unsplash.com/photo-1606503153255-59d8b8b82176?q=80&w=400&auto=format&fit=crop' },
];

const GamesHub = React.memo(function GamesHub() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeGame, setActiveGame] = useState<typeof games[0] | null>(null);

  return (
    <>
      <div className="w-full flex flex-col">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="w-full py-2 flex justify-center items-center gap-2 cursor-pointer group"
        >
          <Gamepad2 className="w-4 h-4 text-[#8F9BB3] group-hover:text-white transition-colors" />
          <h2 className="text-[11px] font-bold tracking-[0.2em] text-[#8F9BB3] group-hover:text-white transition-colors uppercase">PLAY A GAME</h2>
        </motion.button>
      </div>
      {typeof window !== 'undefined' && createPortal(
        <AnimatePresence>
          {isOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050812]">
              <motion.div 
                initial={{ opacity: 0, y: "100%" }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: "100%" }}
                transition={{ type: 'spring', stiffness: 400, damping: 35, mass: 0.8 }}
                className="w-full h-full bg-[#0a0a0c]/60 backdrop-blur-[60px] relative flex flex-col overflow-hidden max-w-[500px] mx-auto shadow-2xl"
              >
              
              <div className="relative z-10 flex flex-col h-full w-full px-6 pt-12 pb-8">
                
                {/* Header */}
                <div className="flex justify-between items-center w-full mb-8">
                  <button 
                    onClick={() => {
                      if (activeGame) {
                        setActiveGame(null);
                      } else {
                        setIsOpen(false);
                      }
                    }} 
                    className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors flex items-center justify-center"
                  >
                    {activeGame ? <ArrowLeft className="w-6 h-6" /> : <X className="w-6 h-6" />}
                  </button>
                  <div className="flex flex-col items-center">
                    <h2 className="text-[10px] font-bold tracking-[0.2em] text-[#8F9BB3] uppercase flex items-center gap-2">
                      <Gamepad2 className="w-3 h-3 text-[#3B82F6]" /> {activeGame ? activeGame.name : "GAMES HUB"}
                    </h2>
                  </div>
                  <div className="w-10 h-10" /> {/* Spacer */}
                </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto custom-scrollbar -mx-2 px-2 pb-10">
                {activeGame ? (
                  <div className="w-full h-full min-h-[400px] flex items-center justify-center rounded-[24px] bg-white/[0.02] border border-white/5 overflow-hidden">
                    {activeGame.id === 'tictactoe' && <TicTacToe />}
                    {activeGame.id === 'memory' && <MemoryMatch />}
                    {activeGame.id === 'snake' && <SnakeGame />}
                    {activeGame.id === 'simon' && <SimonGame />}
                    {activeGame.id === 'dice' && <DiceGame />}
                    {activeGame.id === 'ludo' && <LudoGame />}
                  </div>
                ) : (
                  <motion.div 
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: {
                        opacity: 1,
                        transition: { staggerChildren: 0.1 }
                      }
                    }}
                    className="grid grid-cols-2 gap-4"
                  >
                    {games.map((game) => (
                      <motion.div 
                        variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1, transition: { type: 'spring', damping: 12, stiffness: 400 } } }}
                        onClick={() => setActiveGame(game)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.94 }}
                        key={game.id}
                        className="w-full aspect-square h-auto bg-white/[0.03] backdrop-blur-[30px] border border-white/[0.08] rounded-[24px] overflow-hidden flex flex-col cursor-pointer transition-all group relative"
                        style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05), 0 8px 32px rgba(0,0,0,0.25)' }}
                      >
                        <div className="absolute inset-0 w-full h-[65%]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <Image 
                            src={game.image} 
                            alt={game.name} 
                            fill
                            sizes="(max-width: 500px) 50vw, 200px"
                            className="object-cover opacity-60 group-hover:opacity-100 transition-opacity" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#080B15]"></div>
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white shadow-lg">
                              <Play className="w-4 h-4 ml-1" />
                            </div>
                          </div>
                        </div>
                        <div className="relative z-10 flex flex-col justify-end p-4 h-full">
                          <h3 className="text-[14px] font-bold text-white tracking-wide group-hover:text-[#3B82F6] transition-colors leading-tight">{game.name}</h3>
                          <p className="text-[10px] text-[#8F9BB3] mt-1">{game.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
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
});

export default GamesHub;
