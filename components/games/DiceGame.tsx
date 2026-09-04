'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, ChevronUp, ChevronDown, Minus } from 'lucide-react';

type Guess = 'higher' | 'lower' | 'equal' | null;

export default function DiceGame() {
  const [diceValue, setDiceValue] = useState<number>(3);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isRolling, setIsRolling] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const rollDice = async (guess: Guess) => {
    if (gameOver || isRolling) return;
    setIsRolling(true);

    // Spin animation values
    const newRotX = rotation.x + 720 + Math.floor(Math.random() * 360);
    const newRotY = rotation.y + 720 + Math.floor(Math.random() * 360);
    setRotation({ x: newRotX, y: newRotY });

    // Wait for spin to finish
    await new Promise(r => setTimeout(r, 800));

    const newValue = Math.floor(Math.random() * 6) + 1;
    setDiceValue(newValue);
    setIsRolling(false);

    // Evaluate guess
    let correct = false;
    if (guess === 'higher' && newValue > diceValue) correct = true;
    if (guess === 'lower' && newValue < diceValue) correct = true;
    if (guess === 'equal' && newValue === diceValue) correct = true;

    if (correct) {
      setScore(s => s + 1);
    } else {
      setGameOver(true);
    }
  };

  const resetGame = () => {
    setScore(0);
    setGameOver(false);
    setDiceValue(3);
    setRotation({ x: 0, y: 0 });
  };

  // Helper to render dots on the dice face
  const renderDots = (value: number) => {
    const dotMap: Record<number, number[]> = {
      1: [4],
      2: [0, 8],
      3: [0, 4, 8],
      4: [0, 2, 6, 8],
      5: [0, 2, 4, 6, 8],
      6: [0, 2, 3, 5, 6, 8],
    };
    const activeDots = dotMap[value];

    return (
      <div className="grid grid-cols-3 grid-rows-3 w-full h-full p-3 gap-1">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="w-full h-full flex items-center justify-center">
            {activeDots.includes(i) && (
              <div className="w-3.5 h-3.5 bg-white rounded-full shadow-[inset_0_-2px_4px_rgba(0,0,0,0.4)]" />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full max-w-sm mx-auto p-4 font-sans relative">
      
      {/* Status Bar */}
      <div className="flex items-center justify-between w-full mb-8 bg-white/[0.03] border border-white/10 rounded-2xl p-4 shadow-lg">
        <div className="flex flex-col">
          <span className="text-[10px] text-[#8F9BB3] font-bold tracking-widest uppercase mb-1">Score Streak</span>
          <div className="text-xl font-bold text-[#3B82F6]">
            {score}
          </div>
        </div>
        <button 
          onClick={resetGame}
          className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors"
          title="Restart Game"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* 3D Dice Container */}
      <div className="w-full aspect-square flex items-center justify-center relative mb-8 perspective-[1000px]">
        <motion.div
          animate={{ rotateX: rotation.x, rotateY: rotation.y }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-32 h-32 relative preserve-3d"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front Face */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl border-2 border-white/20 shadow-[inset_0_0_20px_rgba(255,255,255,0.3)] backface-hidden" style={{ transform: 'translateZ(64px)' }}>
            {renderDots(diceValue)}
          </div>
          {/* Back Face (Opposite of current) */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl border-2 border-white/20 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]" style={{ transform: 'rotateY(180deg) translateZ(64px)' }}>
             {renderDots(7 - diceValue)}
          </div>
          {/* Right Face */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl border-2 border-white/20" style={{ transform: 'rotateY(90deg) translateZ(64px)' }}>
            {renderDots(diceValue === 6 ? 2 : 6)}
          </div>
          {/* Left Face */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-700 to-blue-900 rounded-2xl border-2 border-white/20" style={{ transform: 'rotateY(-90deg) translateZ(64px)' }}>
            {renderDots(diceValue === 6 ? 5 : 1)}
          </div>
          {/* Top Face */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-300 to-blue-500 rounded-2xl border-2 border-white/20" style={{ transform: 'rotateX(90deg) translateZ(64px)' }}>
            {renderDots(diceValue === 3 ? 1 : 3)}
          </div>
          {/* Bottom Face */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-800 to-black rounded-2xl border-2 border-white/20" style={{ transform: 'rotateX(-90deg) translateZ(64px)' }}>
            {renderDots(diceValue === 3 ? 6 : 4)}
          </div>
        </motion.div>
      </div>

      {/* Controls */}
      <div className="flex flex-col w-full gap-3">
        <h3 className="text-center text-[#8F9BB3] text-xs font-bold tracking-widest uppercase mb-2">Will the next roll be...</h3>
        <div className="grid grid-cols-3 gap-2 w-full">
          <ControlButton 
            onClick={() => rollDice('lower')} 
            disabled={isRolling || gameOver}
            icon={<ChevronDown className="w-5 h-5 text-red-400" />}
            label="LOWER"
          />
          <ControlButton 
            onClick={() => rollDice('equal')} 
            disabled={isRolling || gameOver}
            icon={<Minus className="w-5 h-5 text-gray-400" />}
            label="EQUAL"
          />
          <ControlButton 
            onClick={() => rollDice('higher')} 
            disabled={isRolling || gameOver}
            icon={<ChevronUp className="w-5 h-5 text-emerald-400" />}
            label="HIGHER"
          />
        </div>
      </div>

      {/* Game Over Screen */}
      <AnimatePresence>
        {gameOver && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-md px-8 py-6 rounded-3xl border border-white/10 text-center shadow-2xl z-20 w-3/4 max-w-[250px]"
          >
            <h3 className="text-red-400 text-xl font-bold mb-2">WRONG GUESS</h3>
            <p className="text-[#8F9BB3] mb-6 text-sm">Streak ended at: <span className="text-white font-bold">{score}</span></p>
            <button
              onClick={resetGame}
              className="w-full py-3 bg-white/10 text-white rounded-xl font-bold text-sm tracking-wider hover:bg-white/20 transition-colors"
            >
              TRY AGAIN
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

function ControlButton({ onClick, disabled, icon, label }: { onClick: () => void, disabled: boolean, icon: React.ReactNode, label: string }) {
  return (
    <motion.button
      whileTap={disabled ? {} : { scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-colors ${
        disabled 
          ? 'bg-white/[0.02] border-white/5 opacity-50 cursor-not-allowed' 
          : 'bg-white/5 border-white/10 hover:bg-white/10 active:bg-white/20'
      }`}
    >
      {icon}
      <span className="text-[9px] font-bold tracking-wider text-white/70 mt-1">{label}</span>
    </motion.button>
  );
}
