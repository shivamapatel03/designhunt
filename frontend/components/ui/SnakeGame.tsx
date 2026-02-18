
"use client";

import { useEffect, useRef, useState } from "react";
import { Play, RotateCcw, Home } from "lucide-react";
import { motion } from "framer-motion";

const GRID_SIZE = 20;
const SPEED = 100;

type Point = { x: number; y: number };

export function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 10 });
  const [direction, setDirection] = useState<Point>({ x: 1, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [highScore, setHighScore] = useState(0);

  // Initialize High Score
  useEffect(() => {
    const saved = localStorage.getItem("snake_highscore");
    if (saved) setHighScore(parseInt(saved));
  }, []);

  // Game Loop
  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const newHead = {
            x: prevSnake[0].x + direction.x,
            y: prevSnake[0].y + direction.y
        };

        // Check Wall Collision
        if (
            newHead.x < 0 || 
            newHead.x >= 30 || // Width / GridSize (approx)
            newHead.y < 0 || 
            newHead.y >= 20    // Height / GridSize (approx)
        ) {
            handleGameOver();
            return prevSnake;
        }

        // Check Self Collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
            handleGameOver();
            return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check Food
        if (newHead.x === food.x && newHead.y === food.y) {
            setScore(s => s + 1);
            generateFood();
            // Don't pop tail
        } else {
            newSnake.pop();
        }

        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, SPEED);
    return () => clearInterval(interval);
  }, [isPlaying, gameOver, direction, food]);

  // Input Handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case "ArrowDown":
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case "ArrowLeft":
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case "ArrowRight":
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction]);

  // Drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear
    ctx.fillStyle = "#F3F4F6"; // Gray-100
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Grid (Optional)
    ctx.strokeStyle = "#E5E7EB";
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }

    // Draw Food
    ctx.fillStyle = "#FFD700"; // Accent Yellow
    ctx.beginPath();
    ctx.roundRect(food.x * GRID_SIZE, food.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2, 4);
    ctx.fill();
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw Snake
    ctx.fillStyle = "#000";
    snake.forEach((segment, index) => {
        ctx.beginPath();
        ctx.roundRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2, 4);
        ctx.fill();
    });

  }, [snake, food]);

  const handleGameOver = () => {
    setGameOver(true);
    setIsPlaying(false);
    if (score > highScore) {
        setHighScore(score);
        localStorage.setItem("snake_highscore", score.toString());
    }
  };

  const generateFood = () => {
    // Simple random logic 
    // In a real app ensure it doesn't spawn on snake
    const x = Math.floor(Math.random() * 30);
    const y = Math.floor(Math.random() * 20);
    setFood({ x, y });
  };

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection({ x: 1, y: 0 });
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
    generateFood();
  };

  return (
    <div className="flex flex-col items-center gap-6">
        <div className="relative border-4 border-black rounded-xl overflow-hidden shadow-[8px_8px_0px_0px_#000] bg-white">
            <canvas 
                ref={canvasRef} 
                width={600} 
                height={400} 
                className="block"
            />
            
            {/* Overlay */}
            {(!isPlaying && !gameOver) && (
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white p-6 text-center">
                    <h3 className="text-2xl font-black uppercase mb-4">404 Snake</h3>
                    <p className="mb-6 font-bold">Use Arrow Keys to Collect Ideas</p>
                    <button 
                        onClick={() => setIsPlaying(true)}
                        className="flex items-center gap-2 bg-accent-yellow text-black px-6 py-3 rounded-full font-black uppercase tracking-widest hover:scale-105 transition-transform"
                    >
                        <Play className="w-5 h-5" /> Start Game
                    </button>
                </div>
            )}

            {gameOver && (
                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white p-6 text-center">
                    <h3 className="text-3xl font-black uppercase mb-2 text-red-500">Game Over</h3>
                    <p className="text-xl font-bold mb-6">Score: {score}</p>
                    <button 
                        onClick={resetGame}
                        className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-black uppercase tracking-widest hover:scale-105 transition-transform"
                    >
                        <RotateCcw className="w-5 h-5" /> Try Again
                    </button>
                </div>
            )}

            <div className="absolute top-4 left-4 bg-white/90 border-2 border-black px-3 py-1 rounded-full font-mono font-bold text-sm">
                Score: {score}
            </div>
            <div className="absolute top-4 right-4 bg-white/90 border-2 border-black px-3 py-1 rounded-full font-mono font-bold text-sm">
                High: {highScore}
            </div>
        </div>
        
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs animate-pulse">
            Page Not Found... But High Scores Are Found Here
        </p>
    </div>
  );
}
