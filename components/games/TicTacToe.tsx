'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw } from 'lucide-react';

type Player = 'X' | 'O' | null;

export default function TicTacToe() {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState<boolean>(true);

  const calculateWinner = (squares: Player[]) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const winner = calculateWinner(board);
  const isDraw = !winner && board.every((square) => square !== null);
  const currentPlayer: Player = xIsNext ? 'X' : 'O';

  const handleClick = (index: number) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full max-w-sm mx-auto p-4 font-sans">
      
      {/* Status Bar */}
      <div className="flex items-center justify-between w-full mb-8 bg-white/[0.03] border border-white/10 rounded-2xl p-4 shadow-lg">
        <div className="flex flex-col">
          <span className="text-[10px] text-[#8F9BB3] font-bold tracking-widest uppercase mb-1">Status</span>
          <div className="text-sm font-bold text-white">
            {winner ? (
              <span className="text-[#3B82F6]">Player {winner} Wins!</span>
            ) : isDraw ? (
              <span className="text-yellow-400">It's a Draw!</span>
            ) : (
              <span>Player {currentPlayer}'s Turn</span>
            )}
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

      {/* Game Board */}
      <div className="grid grid-cols-3 gap-3 w-full aspect-square">
        {board.map((cell, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: cell || winner ? 1 : 1.05 }}
            whileTap={{ scale: cell || winner ? 1 : 0.95 }}
            onClick={() => handleClick(index)}
            className="bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-center cursor-pointer shadow-[inset_0_0_20px_rgba(255,255,255,0.01)] hover:bg-white/[0.04] transition-colors relative overflow-hidden"
          >
            <AnimatePresence>
              {cell === 'X' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ type: 'spring', damping: 15, stiffness: 300 }}
                  className="w-1/2 h-1/2 relative"
                >
                  <div className="absolute top-1/2 left-0 w-full h-1 bg-[#3B82F6] rounded-full -translate-y-1/2 rotate-45 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                  <div className="absolute top-1/2 left-0 w-full h-1 bg-[#3B82F6] rounded-full -translate-y-1/2 -rotate-45 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                </motion.div>
              )}
              {cell === 'O' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ type: 'spring', damping: 15, stiffness: 300 }}
                  className="w-1/2 h-1/2 rounded-full border-4 border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.5),inset_0_0_15px_rgba(52,211,153,0.5)]"
                />
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

    </div>
  );
}
