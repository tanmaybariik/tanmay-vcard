'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';

const EMOJIS = ['🚀', '💻', '⚛️', '🔥', '🎮', '📱', '🎨', '🎧'];

type Card = {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
};

export default function MemoryMatch() {
  const [cards, setCards] = useState<Card[]>(() => {
    return [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));
  });
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  // Initialize game
  const initGame = () => {
    const shuffled = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffled);
    setFlippedIndices([]);
    setMoves(0);
    setIsLocked(false);
  };

  const handleCardClick = (index: number) => {
    if (isLocked || cards[index].isFlipped || cards[index].isMatched) return;

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    setCards((prev) => 
      prev.map((c, i) => (i === index ? { ...c, isFlipped: true } : c))
    );

    if (newFlipped.length === 2) {
      setIsLocked(true);
      setMoves((m) => m + 1);
      
      const [first, second] = newFlipped;
      if (cards[first].emoji === cards[second].emoji) {
        setCards((prev) =>
          prev.map((c, i) =>
            i === first || i === second ? { ...c, isMatched: true } : c
          )
        );
        setFlippedIndices([]);
        setIsLocked(false);
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, i) =>
              i === first || i === second ? { ...c, isFlipped: false } : c
            )
          );
          setFlippedIndices([]);
          setIsLocked(false);
        }, 1000);
      }
    }
  };

  const isWon = cards.length > 0 && cards.every((card) => card.isMatched);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full max-w-sm mx-auto p-4 font-sans">
      
      {/* Status Bar */}
      <div className="flex items-center justify-between w-full mb-8 bg-white/[0.03] border border-white/10 rounded-2xl p-4 shadow-lg">
        <div className="flex flex-col">
          <span className="text-[10px] text-[#8F9BB3] font-bold tracking-widest uppercase mb-1">Status</span>
          <div className="text-sm font-bold text-white">
            {isWon ? (
              <span className="text-[#3B82F6]">You Won in {moves} moves!</span>
            ) : (
              <span>Moves: {moves}</span>
            )}
          </div>
        </div>
        <button 
          onClick={initGame}
          className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors"
          title="Restart Game"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Game Board */}
      <div className="grid grid-cols-4 gap-2 w-full aspect-square" style={{ perspective: 1000 }}>
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            onClick={() => handleCardClick(index)}
            className="w-full h-full relative cursor-pointer group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="w-full h-full"
              initial={false}
              animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Front of card (hidden, shows back pattern) */}
              <div 
                className="absolute inset-0 bg-white/[0.05] border border-white/10 rounded-xl flex items-center justify-center shadow-lg"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <div className="w-6 h-6 rounded-full border-2 border-dashed border-white/20" />
              </div>
              
              {/* Back of card (the emoji) */}
              <div 
                className="absolute inset-0 bg-[#3B82F6]/20 border border-[#3B82F6]/30 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                <span className="text-3xl filter drop-shadow-md">{card.emoji}</span>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

    </div>
  );
}
