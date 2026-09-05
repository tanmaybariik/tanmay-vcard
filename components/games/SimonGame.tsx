'use client';
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw } from 'lucide-react';

const COLORS = ['blue', 'red', 'green', 'yellow'] as const;
type Color = typeof COLORS[number];

const COLOR_STYLES: Record<Color, string> = {
  blue: 'bg-blue-500 shadow-[0_0_30px_rgba(59,130,246,0)] active:bg-blue-400',
  red: 'bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0)] active:bg-red-400',
  green: 'bg-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0)] active:bg-emerald-400',
  yellow: 'bg-amber-400 shadow-[0_0_30px_rgba(251,191,36,0)] active:bg-amber-300',
};

const ACTIVE_COLOR_STYLES: Record<Color, string> = {
  blue: 'bg-blue-400 shadow-[0_0_40px_rgba(59,130,246,0.8)] scale-[1.05]',
  red: 'bg-red-400 shadow-[0_0_40px_rgba(239,68,68,0.8)] scale-[1.05]',
  green: 'bg-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.8)] scale-[1.05]',
  yellow: 'bg-amber-300 shadow-[0_0_40px_rgba(251,191,36,0.8)] scale-[1.05]',
};

export default function SimonGame() {
  const [sequence, setSequence] = useState<Color[]>([]);
  const [playerStep, setPlayerStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [activeColor, setActiveColor] = useState<Color | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const addNextColor = useCallback((currentSeq: Color[]) => {
    const nextColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    const newSeq = [...currentSeq, nextColor];
    setSequence(newSeq);
    return newSeq;
  }, []);

  const playSequence = useCallback(async (seq: Color[]) => {
    setIsPlayerTurn(false);
    // Wait a moment before starting
    await new Promise(r => setTimeout(r, 600));

    for (let i = 0; i < seq.length; i++) {
      setActiveColor(seq[i]);
      // Play beep sound here if desired
      await new Promise(r => setTimeout(r, 400));
      setActiveColor(null);
      await new Promise(r => setTimeout(r, 200));
    }
    
    setIsPlayerTurn(true);
    setPlayerStep(0);
  }, []);

  const startGame = () => {
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
    const newSeq = addNextColor([]);
    playSequence(newSeq);
  };

  const handleColorClick = (color: Color) => {
    if (!isPlayerTurn || gameOver) return;

    // Flash the button temporarily when clicked
    setActiveColor(color);
    setTimeout(() => setActiveColor(null), 200);

    const expectedColor = sequence[playerStep];

    if (color === expectedColor) {
      const nextStep = playerStep + 1;
      setPlayerStep(nextStep);

      if (nextStep === sequence.length) {
        // Player finished the sequence correctly
        setScore(sequence.length);
        setIsPlayerTurn(false);
        const newSeq = addNextColor(sequence);
        playSequence(newSeq);
      }
    } else {
      // Wrong! Game over
      setGameOver(true);
      setIsPlaying(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full max-w-sm mx-auto p-4 font-sans relative">
      
      {/* Status Bar */}
      <div className="flex items-center justify-between w-full mb-8 bg-white/[0.03] border border-white/10 rounded-2xl p-4 shadow-lg">
        <div className="flex flex-col">
          <span className="text-[10px] text-[#8F9BB3] font-bold tracking-widest uppercase mb-1">Score</span>
          <div className="text-xl font-bold text-white">
            {score}
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-[#8F9BB3] font-bold tracking-widest uppercase mb-1">Turn</span>
          <div className={`text-xs font-bold ${isPlayerTurn ? 'text-emerald-400' : 'text-[#3B82F6]'}`}>
            {gameOver ? 'GAME OVER' : !isPlaying ? 'READY' : isPlayerTurn ? 'YOUR TURN' : 'WATCH'}
          </div>
        </div>
      </div>

      {/* Game Board */}
      <div className="w-full aspect-square relative rounded-full overflow-hidden p-2 bg-white/[0.02] border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        
        {/* The 4 pads */}
        <div className="absolute inset-2 rounded-full overflow-hidden grid grid-cols-2 grid-rows-2 gap-2">
          {/* Top Left - Blue */}
          <button
            onPointerDown={() => handleColorClick('blue')}
            disabled={!isPlayerTurn}
            className={`w-full h-full rounded-tl-full transition-all duration-150 border-r border-b border-black/20
              ${activeColor === 'blue' ? ACTIVE_COLOR_STYLES.blue : COLOR_STYLES.blue}
              ${!isPlayerTurn && activeColor !== 'blue' ? 'opacity-50' : 'opacity-90'}
            `}
          />
          {/* Top Right - Red */}
          <button
            onPointerDown={() => handleColorClick('red')}
            disabled={!isPlayerTurn}
            className={`w-full h-full rounded-tr-full transition-all duration-150 border-l border-b border-black/20
              ${activeColor === 'red' ? ACTIVE_COLOR_STYLES.red : COLOR_STYLES.red}
              ${!isPlayerTurn && activeColor !== 'red' ? 'opacity-50' : 'opacity-90'}
            `}
          />
          {/* Bottom Left - Yellow */}
          <button
            onPointerDown={() => handleColorClick('yellow')}
            disabled={!isPlayerTurn}
            className={`w-full h-full rounded-bl-full transition-all duration-150 border-r border-t border-black/20
              ${activeColor === 'yellow' ? ACTIVE_COLOR_STYLES.yellow : COLOR_STYLES.yellow}
              ${!isPlayerTurn && activeColor !== 'yellow' ? 'opacity-50' : 'opacity-90'}
            `}
          />
          {/* Bottom Right - Green */}
          <button
            onPointerDown={() => handleColorClick('green')}
            disabled={!isPlayerTurn}
            className={`w-full h-full rounded-br-full transition-all duration-150 border-l border-t border-black/20
              ${activeColor === 'green' ? ACTIVE_COLOR_STYLES.green : COLOR_STYLES.green}
              ${!isPlayerTurn && activeColor !== 'green' ? 'opacity-50' : 'opacity-90'}
            `}
          />
        </div>

        {/* Center circle */}
        <div className="absolute inset-0 m-auto w-1/3 h-1/3 bg-[#080B15] border-4 border-white/5 rounded-full flex items-center justify-center shadow-xl z-10">
          <button 
            onClick={startGame}
            className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors border border-white/10"
            title="Start / Restart"
          >
            {isPlaying && !gameOver ? <RotateCcw className="w-5 h-5" /> : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            )}
          </button>
        </div>

      </div>

      {/* Game Over Screen */}
      <AnimatePresence>
        {gameOver && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-md px-8 py-6 rounded-3xl border border-white/10 text-center shadow-2xl z-20"
          >
            <h3 className="text-white text-2xl font-bold mb-2">GAME OVER</h3>
            <p className="text-[#8F9BB3] mb-6">Final Score: <span className="text-white font-bold text-xl">{score}</span></p>
            <button
              onClick={startGame}
              className="px-6 py-2 bg-[#3B82F6] text-white rounded-full font-bold text-sm tracking-wider hover:bg-blue-600 transition-colors shadow-[0_0_20px_rgba(59,130,246,0.5)]"
            >
              PLAY AGAIN
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
