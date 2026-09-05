'use client';
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Gamepad2, X, ArrowLeft, Dices, Puzzle, Activity, Hash, Brain, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import Image from 'next/image';

const TicTacToe = dynamic(() => import('./games/TicTacToe'), { ssr: false });
const MemoryMatch = dynamic(() => import('./games/MemoryMatch'), { ssr: false });
const SnakeGame = dynamic(() => import('./games/SnakeGame'), { ssr: false });
const SimonGame = dynamic(() => import('./games/SimonGame'), { ssr: false });
const DiceGame = dynamic(() => import('./games/DiceGame'), { ssr: false });
const LudoGame = dynamic(() => import('./games/LudoGame'), { ssr: false });

const gameIcons: Record<string, React.ReactNode> = {
  'ludo': <Gamepad2 className="w-4 h-4 text-[#8B5CF6]" />,
  'dice': <Dices className="w-4 h-4 text-[#3B82F6]" />,
  'simon': <Puzzle className="w-4 h-4 text-[#8B5CF6]" />,
  'snake': <Activity className="w-4 h-4 text-[#3B82F6]" />,
  'tictactoe': <Hash className="w-4 h-4 text-[#8B5CF6]" />,
  'memory': <Brain className="w-4 h-4 text-[#3B82F6]" />
};

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
          className="w-full py-2 flex justify-center items-center gap-2 cursor-pointer transition-all group opacity-80 hover:opacity-100"
        >
          <Gamepad2 className="w-5 h-5 text-[#3B82F6] group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.8)] transition-all" />
          <h2 className="text-[12px] font-bold tracking-[0.15em] text-white uppercase">PLAY A GAME</h2>
        </motion.button>
      </div>

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
                
                {/* Background ambient glow */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-[#3B82F6]/10 blur-[100px] rounded-full" />
                  <div className="absolute top-[40%] -right-[10%] w-[50%] h-[50%] bg-[#8B5CF6]/10 blur-[100px] rounded-full" />
                </div>
              
                <div className="relative z-10 flex flex-col h-full w-full px-4 pt-10 pb-8">
                  
                  {/* Header */}
                  <div className="flex justify-between items-center w-full mb-2">
                    <button 
                      onClick={() => {
                        if (activeGame) {
                          setActiveGame(null);
                        } else {
                          setIsOpen(false);
                        }
                      }} 
                      className="w-10 h-10 rounded-full border border-[#3B82F6]/30 bg-[#1C2333]/60 text-white hover:bg-white/10 transition-colors flex items-center justify-center backdrop-blur-md shrink-0"
                      aria-label="Close"
                    >
                      {activeGame ? <ArrowLeft className="w-5 h-5" /> : <X className="w-5 h-5" />}
                    </button>
                    
                    <div className="flex flex-col items-center justify-center flex-1">
                      <h2 className="text-[14px] font-bold tracking-[0.2em] text-white uppercase flex items-center gap-2">
                        <Gamepad2 className="w-4 h-4 text-[#3B82F6]" /> {activeGame ? activeGame.name : "GAMES HUB"}
                      </h2>
                    </div>
                    
                    <div className="w-10 h-10 shrink-0" /> {/* Spacer */}
                  </div>
                  
                  {!activeGame && (
                    <div className="w-full text-center mb-8 flex items-center justify-center">
                      <div className="h-[1px] w-4 bg-[#3B82F6]/50 rounded-full mr-3"></div>
                      <span className="text-[12px] bg-clip-text text-transparent bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6]">
                        Choose your game and play now
                      </span>
                      <div className="h-[1px] w-4 bg-[#8B5CF6]/50 rounded-full ml-3"></div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 w-full">
                    {activeGame ? (
                      <div className="w-full h-full min-h-[400px] flex items-center justify-center rounded-[24px] bg-[#1C2333]/40 border border-[#3B82F6]/20 backdrop-blur-md overflow-hidden mt-4 shadow-[0_8px_32px_rgba(0,0,0,0.15)]">
                        {activeGame.id === 'tictactoe' && <TicTacToe />}
                        {activeGame.id === 'memory' && <MemoryMatch />}
                        {activeGame.id === 'snake' && <SnakeGame />}
                        {activeGame.id === 'simon' && <SimonGame />}
                        {activeGame.id === 'dice' && <DiceGame />}
                        {activeGame.id === 'ludo' && <LudoGame />}
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3 w-full">
                        {games.map((game) => (
                          <div 
                            onClick={() => setActiveGame(game)}
                            key={game.id}
                            className="w-full flex flex-col bg-[#1C2333]/40 backdrop-blur-md border border-[#3B82F6]/20 rounded-[20px] overflow-hidden cursor-pointer transition-all active:scale-[0.98] group shadow-[0_4px_16px_rgba(0,0,0,0.1)] hover:border-[#8B5CF6]/40 hover:shadow-[0_8px_24px_rgba(139,92,246,0.15)]"
                          >
                            <div className="relative w-full aspect-square">
                              <Image 
                                src={game.image} 
                                alt={game.name} 
                                fill
                                loading="lazy"
                                sizes="(max-width: 480px) 50vw, 200px"
                                className="object-cover transition-transform duration-500 group-hover:scale-105" 
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-[#090D1A] via-[#090D1A]/40 to-transparent"></div>
                            </div>
                            
                            <div className="flex items-center justify-between p-3 bg-[#090D1A]">
                              <div className="flex items-center gap-2 overflow-hidden flex-1">
                                <div className="w-7 h-7 rounded-full bg-[#1C2333] border border-white/10 flex items-center justify-center shrink-0">
                                  {gameIcons[game.id]}
                                </div>
                                <div className="flex flex-col overflow-hidden">
                                  <h3 className="text-[13px] font-semibold text-white truncate leading-tight">{game.name}</h3>
                                  <p className="text-[10px] text-[#8F9BB3] truncate">{game.desc}</p>
                                </div>
                              </div>
                              <div className="w-6 h-6 rounded-full border border-[#3B82F6]/40 bg-[#1C2333] flex items-center justify-center shrink-0 ml-1 transition-all group-hover:bg-[#3B82F6]/20 group-hover:border-[#3B82F6]">
                                <ChevronRight className="w-3 h-3 text-[#3B82F6]" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {!activeGame && (
                    <div className="w-full h-8 mt-4" />
                  )}

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

