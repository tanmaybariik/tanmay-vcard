'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Dices } from 'lucide-react';

const TRACK_LENGTH = 28;
// Generate an 8x8 perimeter track
const generateTrack = () => {
  const track = [];
  for (let x = 0; x <= 7; x++) track.push({x, y: 0}); // Top
  for (let y = 1; y <= 7; y++) track.push({x: 7, y}); // Right
  for (let x = 6; x >= 0; x--) track.push({x, y: 7}); // Bottom
  for (let y = 6; y >= 1; y--) track.push({x: 0, y}); // Left
  return track;
};
const TRACK = generateTrack();

type Player = 'red' | 'blue';

export default function LudoGame() {
  const [redProgress, setRedProgress] = useState(0);
  const [blueProgress, setBlueProgress] = useState(0);
  const [turn, setTurn] = useState<Player>('red');
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [winner, setWinner] = useState<Player | null>(null);

  const getBoardIndex = (player: Player, progress: number) => {
    if (progress === 0 || progress >= TRACK_LENGTH) return -1; // -1 means in base or finished
    return player === 'red' ? progress % TRACK_LENGTH : (progress + 14) % TRACK_LENGTH;
  };

  const redIndex = getBoardIndex('red', redProgress);
  const blueIndex = getBoardIndex('blue', blueProgress);

  const rollDice = async () => {
    if (isRolling || winner) return;
    setIsRolling(true);
    
    // Fast flash animation for dice
    for (let i = 0; i < 10; i++) {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      await new Promise(r => setTimeout(r, 50));
    }
    
    const finalRoll = Math.floor(Math.random() * 6) + 1;
    setDiceValue(finalRoll);
    setIsRolling(false);

    // Apply movement
    setTimeout(() => handleMovement(finalRoll), 400);
  };

  const handleMovement = (roll: number) => {
    if (turn === 'red') {
      // Need exactly the right roll to finish, or just simple overshoot?
      // Let's keep it simple: stop exactly at TRACK_LENGTH, ignore if overshoot.
      if (redProgress + roll <= TRACK_LENGTH) {
        let newProgress = redProgress + roll;
        const newBoardIndex = newProgress === TRACK_LENGTH ? -1 : newProgress % TRACK_LENGTH;
        
        // Capture blue?
        if (newBoardIndex !== -1 && newBoardIndex === blueIndex) {
          setBlueProgress(0); // Blue sent back to base
          // Keep turn if capture? Let's just switch turn for simplicity unless they rolled a 6.
        }
        
        setRedProgress(newProgress);
        if (newProgress === TRACK_LENGTH) {
          setWinner('red');
          return;
        }
      }
      setTurn(roll === 6 ? 'red' : 'blue'); // 6 gives another turn
    } else {
      if (blueProgress + roll <= TRACK_LENGTH) {
        let newProgress = blueProgress + roll;
        const newBoardIndex = newProgress === TRACK_LENGTH ? -1 : (newProgress + 14) % TRACK_LENGTH;
        
        // Capture red?
        if (newBoardIndex !== -1 && newBoardIndex === redIndex) {
          setRedProgress(0); // Red sent back to base
        }
        
        setBlueProgress(newProgress);
        if (newProgress === TRACK_LENGTH) {
          setWinner('blue');
          return;
        }
      }
      setTurn(roll === 6 ? 'blue' : 'red');
    }
  };

  const resetGame = () => {
    setRedProgress(0);
    setBlueProgress(0);
    setTurn('red');
    setDiceValue(null);
    setWinner(null);
    setIsRolling(false);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full max-w-sm mx-auto p-4 font-sans relative">
      
      {/* Status Bar */}
      <div className="flex items-center justify-between w-full mb-6 bg-white/[0.03] border border-white/10 rounded-2xl p-4 shadow-lg">
        <div className="flex flex-col">
          <span className="text-[10px] text-[#8F9BB3] font-bold tracking-widest uppercase mb-1">Turn</span>
          <div className={`text-sm font-bold ${turn === 'red' ? 'text-red-400' : 'text-blue-400'}`}>
            {winner ? `${winner.toUpperCase()} WINS!` : `${turn.toUpperCase()}'s Turn`}
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

      {/* Board */}
      <div className="w-full aspect-square bg-white/[0.02] border border-white/10 rounded-3xl p-4 shadow-[inset_0_0_30px_rgba(255,255,255,0.02)] relative mb-8">
        
        {/* Render Track */}
        <div className="absolute inset-4 grid gap-1" style={{ gridTemplateColumns: 'repeat(8, 1fr)', gridTemplateRows: 'repeat(8, 1fr)' }}>
          {TRACK.map((pos, idx) => (
            <div 
              key={idx} 
              className={`bg-white/[0.04] rounded-md flex items-center justify-center shadow-inner relative
                ${idx === 0 ? 'border-2 border-red-500/50' : ''}
                ${idx === 14 ? 'border-2 border-blue-500/50' : ''}
              `}
              style={{ gridColumn: pos.x + 1, gridRow: pos.y + 1 }}
            >
              <span className="text-[8px] text-white/10">{idx}</span>
            </div>
          ))}
          
          {/* Inner decorative cross */}
          <div className="col-start-2 col-end-8 row-start-2 row-end-8 flex items-center justify-center p-2 opacity-10">
            <div className="w-full h-full border-4 border-white rounded-2xl" />
          </div>
        </div>

        {/* Tokens Container overlay */}
        <div className="absolute inset-4 grid gap-1" style={{ gridTemplateColumns: 'repeat(8, 1fr)', gridTemplateRows: 'repeat(8, 1fr)', pointerEvents: 'none' }}>
          
          {/* Red Token */}
          <AnimatePresence>
            {redIndex !== -1 && (
              <motion.div
                layoutId="red-token"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="w-full h-full flex items-center justify-center relative z-20"
                style={{ gridColumn: TRACK[redIndex].x + 1, gridRow: TRACK[redIndex].y + 1 }}
              >
                <div className="w-3/4 h-3/4 bg-red-500 rounded-full border-2 border-white shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Blue Token */}
          <AnimatePresence>
            {blueIndex !== -1 && (
              <motion.div
                layoutId="blue-token"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="w-full h-full flex items-center justify-center relative z-10"
                style={{ gridColumn: TRACK[blueIndex].x + 1, gridRow: TRACK[blueIndex].y + 1 }}
              >
                <div className="w-3/4 h-3/4 bg-blue-500 rounded-full border-2 border-white shadow-[0_0_15px_rgba(59,130,246,0.8)]" />
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>

      {/* Dice & Controls */}
      <div className="flex items-center justify-between w-full bg-white/[0.02] border border-white/5 rounded-2xl p-4">
        
        {/* Bases (Wait room) */}
        <div className="flex flex-col gap-2">
           <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center">
               {redIndex === -1 && redProgress === 0 && <div className="w-4 h-4 bg-red-500 rounded-full border border-white" />}
             </div>
             <span className="text-[10px] text-[#8F9BB3] font-bold">P1 BASE</span>
           </div>
           <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
               {blueIndex === -1 && blueProgress === 0 && <div className="w-4 h-4 bg-blue-500 rounded-full border border-white" />}
             </div>
             <span className="text-[10px] text-[#8F9BB3] font-bold">P2 BASE</span>
           </div>
        </div>

        {/* The Dice */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={rollDice}
          disabled={isRolling || winner !== null}
          className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center shadow-xl border-2 transition-colors relative overflow-hidden
            ${turn === 'red' ? 'bg-red-500/20 border-red-500/50 hover:bg-red-500/30' : 'bg-blue-500/20 border-blue-500/50 hover:bg-blue-500/30'}
            ${isRolling ? 'animate-pulse' : ''}
          `}
        >
          {diceValue ? (
            <span className={`text-4xl font-bold ${turn === 'red' ? 'text-red-400' : 'text-blue-400'}`}>
              {diceValue}
            </span>
          ) : (
            <>
              <Dices className={`w-8 h-8 mb-1 ${turn === 'red' ? 'text-red-400' : 'text-blue-400'}`} />
              <span className={`text-[10px] font-bold tracking-widest ${turn === 'red' ? 'text-red-400' : 'text-blue-400'}`}>ROLL</span>
            </>
          )}
        </motion.button>

      </div>

      {/* Game Over Screen */}
      <AnimatePresence>
        {winner && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-md px-8 py-6 rounded-3xl border border-white/10 text-center shadow-2xl z-50 w-3/4 max-w-[250px]"
          >
            <h3 className={`${winner === 'red' ? 'text-red-400' : 'text-blue-400'} text-xl font-bold mb-4 uppercase`}>
              {winner} WINS!
            </h3>
            <button
              onClick={resetGame}
              className="w-full py-3 bg-white/10 text-white rounded-xl font-bold text-sm tracking-wider hover:bg-white/20 transition-colors"
            >
              PLAY AGAIN
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
