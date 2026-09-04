'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

const GRID_SIZE = 15;
const INITIAL_SNAKE = [{ x: 7, y: 7 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const INITIAL_SPEED = 150;

type Point = { x: number; y: number };

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Use a ref to track the latest direction to prevent rapid double-turns causing self-collision
  const directionRef = useRef(direction);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Ensure food doesn't spawn on snake
      const onSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!onSnake) break;
    }
    setFood(newFood);
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
    generateFood(INITIAL_SNAKE);
  };

  const handleDirectionChange = (newDir: Point) => {
    // Prevent 180 degree turns
    const currentDir = directionRef.current;
    if (
      (newDir.x !== 0 && currentDir.x === -newDir.x) ||
      (newDir.y !== 0 && currentDir.y === -newDir.y)
    ) {
      return;
    }
    setDirection(newDir);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying || gameOver) return;
      switch (e.key) {
        case 'ArrowUp': handleDirectionChange({ x: 0, y: -1 }); break;
        case 'ArrowDown': handleDirectionChange({ x: 0, y: 1 }); break;
        case 'ArrowLeft': handleDirectionChange({ x: -1, y: 0 }); break;
        case 'ArrowRight': handleDirectionChange({ x: 1, y: 0 }); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, gameOver]);

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    directionRef.current = direction; // Update ref when tick happens

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        // Check wall collision
        if (
          newHead.x < 0 || 
          newHead.x >= GRID_SIZE || 
          newHead.y < 0 || 
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          setIsPlaying(false);
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          setIsPlaying(false);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          generateFood(newSnake);
        } else {
          newSnake.pop(); // Remove tail if no food eaten
        }

        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, INITIAL_SPEED);
    return () => clearInterval(interval);
  }, [direction, food, isPlaying, gameOver, generateFood]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full max-w-sm mx-auto p-4 font-sans relative">
      
      {/* Status Bar */}
      <div className="flex items-center justify-between w-full mb-6 bg-white/[0.03] border border-white/10 rounded-2xl p-4 shadow-lg">
        <div className="flex flex-col">
          <span className="text-[10px] text-[#8F9BB3] font-bold tracking-widest uppercase mb-1">Score</span>
          <div className="text-xl font-bold text-[#3B82F6]">
            {score}
          </div>
        </div>
        <button 
          onClick={resetGame}
          className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors"
          title="Restart Game"
        >
          {isPlaying || gameOver ? <RotateCcw className="w-4 h-4" /> : <PlayIcon />}
        </button>
      </div>

      {/* Game Board */}
      <div className="w-full aspect-square bg-white/[0.02] border border-white/10 rounded-2xl p-2 shadow-[inset_0_0_20px_rgba(255,255,255,0.01)] relative overflow-hidden">
        
        {/* Grid overlay */}
        <div 
          className="absolute inset-2 grid gap-px" 
          style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`, gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)` }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
            <div key={i} className="bg-white/[0.01] rounded-[2px]" />
          ))}
        </div>

        {/* Entities container */}
        <div className="absolute inset-2">
          {/* Food */}
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="absolute bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.8)]"
            style={{
              width: `${100 / GRID_SIZE}%`,
              height: `${100 / GRID_SIZE}%`,
              left: `${(food.x / GRID_SIZE) * 100}%`,
              top: `${(food.y / GRID_SIZE) * 100}%`,
            }}
          />

          {/* Snake */}
          {snake.map((segment, index) => (
            <motion.div
              key={`${segment.x}-${segment.y}-${index}`}
              layout
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute"
              style={{
                width: `${100 / GRID_SIZE}%`,
                height: `${100 / GRID_SIZE}%`,
                left: `${(segment.x / GRID_SIZE) * 100}%`,
                top: `${(segment.y / GRID_SIZE) * 100}%`,
                padding: '1px' // small gap between segments
              }}
            >
              <div className={`w-full h-full rounded-[4px] ${index === 0 ? 'bg-[#3B82F6] shadow-[0_0_15px_rgba(59,130,246,0.6)]' : 'bg-[#3B82F6]/70'}`} />
            </motion.div>
          ))}
        </div>

        {/* Game Over / Start Screen */}
        <AnimatePresence>
          {(!isPlaying || gameOver) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center"
            >
              <div className="text-center">
                <h3 className="text-white text-xl font-bold mb-4">{gameOver ? 'GAME OVER' : 'READY?'}</h3>
                <button
                  onClick={resetGame}
                  className="px-6 py-2 bg-[#3B82F6] text-white rounded-full font-bold text-sm tracking-wider hover:bg-blue-600 transition-colors shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                >
                  {gameOver ? 'PLAY AGAIN' : 'START GAME'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* D-Pad controls for mobile */}
      <div className="mt-8 grid grid-cols-3 gap-2 w-[180px]">
        <div />
        <ControlBtn onClick={() => handleDirectionChange({ x: 0, y: -1 })} icon={<ArrowUp className="w-6 h-6" />} />
        <div />
        <ControlBtn onClick={() => handleDirectionChange({ x: -1, y: 0 })} icon={<ArrowLeft className="w-6 h-6" />} />
        <ControlBtn onClick={() => handleDirectionChange({ x: 0, y: 1 })} icon={<ArrowDown className="w-6 h-6" />} />
        <ControlBtn onClick={() => handleDirectionChange({ x: 1, y: 0 })} icon={<ArrowRight className="w-6 h-6" />} />
      </div>

    </div>
  );
}

function ControlBtn({ onClick, icon }: { onClick: () => void, icon: React.ReactNode }) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="bg-white/5 border border-white/10 rounded-2xl aspect-square flex items-center justify-center text-white/70 hover:bg-white/10 hover:text-white transition-colors"
    >
      {icon}
    </motion.button>
  );
}

function PlayIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}
