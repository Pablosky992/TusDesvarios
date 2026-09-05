'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  RotateCcw,
  Trophy,
  Play,
  Pause,
  Flame,
  Clock,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';

export type GameMode = 'classic' | 'portals' | 'timed';
export type SpeedMode = 'cadete' | 'hacker' | 'ninja';

interface Point {
  x: number;
  y: number;
}

interface BonusItem {
  x: number;
  y: number;
  type: 'crystal' | 'overclock';
  timeLeft: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
}

const GRID_SIZE = 20;

const SPEED_CONFIG: Record<SpeedMode, { tickMs: number; label: string; color: string }> = {
  cadete: { tickMs: 140, label: '🟢 Cadete (Normal)', color: '#34d399' },
  hacker: { tickMs: 90, label: '🟡 Hacker (Rápido)', color: '#fbbf24' },
  ninja: { tickMs: 55, label: '🔴 Cyber Ninja (Extremo)', color: '#f87171' },
};

const MODE_CONFIG: Record<GameMode, { label: string; icon: string; desc: string }> = {
  classic: { label: 'Clásico (Paredes)', icon: '🧱', desc: 'Muros perimetrales sólidos' },
  portals: { label: 'Portales (Sin Fin)', icon: '🌀', desc: 'Atraviesa los bordes libremente' },
  timed: { label: 'Sobrecarga (30s)', icon: '⏱️', desc: '30s contrarreloj (+3s por nodo)' },
};

export default function SnakeGame() {
  const [gameMode, setGameMode] = useState<GameMode>('classic');
  const [speedMode, setSpeedMode] = useState<SpeedMode>('hacker');
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [snakeLength, setSnakeLength] = useState<number>(3);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [timeRemaining, setTimeRemaining] = useState<number>(30);
  const [overclockTicks, setOverclockTicks] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Engine coordinates and simulation references
  const snakeRef = useRef<Point[]>([
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ]);
  const dirRef = useRef<Point>({ x: 1, y: 0 });
  const nextDirRef = useRef<Point>({ x: 1, y: 0 });
  const foodRef = useRef<Point>({ x: 15, y: 10 });
  const bonusRef = useRef<BonusItem | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const modeRef = useRef<GameMode>('classic');
  const speedRef = useRef<SpeedMode>('hacker');

  // Load high score from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('tusdesvarios_snake_highscore');
      if (saved) setHighScore(parseInt(saved, 10));
    } catch {
      // Ignore
    }
  }, []);

  // Web Audio Synthesizer
  const playSynth = useCallback(
    (type: 'eat' | 'bonus' | 'crash' | 'powerup' | 'click') => {
      if (!soundEnabled) return;
      try {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioCtx) return;
        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioCtx();
        }
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        if (type === 'eat') {
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(320, now);
          osc.frequency.exponentialRampToValueAtTime(640, now + 0.08);
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.linearRampToValueAtTime(0.01, now + 0.1);
          osc.start(now);
          osc.stop(now + 0.1);
        } else if (type === 'bonus') {
          const freqs = [523.25, 659.25, 783.99, 1046.5];
          freqs.forEach((f, i) => {
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.connect(g);
            g.connect(ctx.destination);
            o.type = 'square';
            o.frequency.setValueAtTime(f, now + i * 0.06);
            g.gain.setValueAtTime(0.12, now + i * 0.06);
            g.gain.linearRampToValueAtTime(0.01, now + i * 0.06 + 0.1);
            o.start(now + i * 0.06);
            o.stop(now + i * 0.06 + 0.1);
          });
        } else if (type === 'powerup') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(440, now);
          osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
          gain.gain.setValueAtTime(0.18, now);
          gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
          osc.start(now);
          osc.stop(now + 0.2);
        } else if (type === 'crash') {
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(160, now);
          osc.frequency.linearRampToValueAtTime(40, now + 0.35);
          gain.gain.setValueAtTime(0.25, now);
          gain.gain.linearRampToValueAtTime(0.01, now + 0.4);
          osc.start(now);
          osc.stop(now + 0.4);
        } else if (type === 'click') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(500, now);
          gain.gain.setValueAtTime(0.06, now);
          gain.gain.linearRampToValueAtTime(0.01, now + 0.04);
          osc.start(now);
          osc.stop(now + 0.04);
        }
      } catch {
        // Ignore audio errors
      }
    },
    [soundEnabled]
  );

  // Spawn normal food
  const spawnFood = useCallback((): Point => {
    let newX: number;
    let newY: number;
    let collision = true;
    while (collision) {
      newX = Math.floor(Math.random() * GRID_SIZE);
      newY = Math.floor(Math.random() * GRID_SIZE);
      collision = snakeRef.current.some((segment) => segment.x === newX && segment.y === newY);
    }
    return { x: newX!, y: newY! };
  }, []);

  // Spawn bonus item randomly
  const trySpawnBonus = useCallback(() => {
    if (bonusRef.current) return;
    if (Math.random() < 0.28) {
      const type = Math.random() < 0.6 ? 'crystal' : 'overclock';
      let newX: number;
      let newY: number;
      let collision = true;
      while (collision) {
        newX = Math.floor(Math.random() * GRID_SIZE);
        newY = Math.floor(Math.random() * GRID_SIZE);
        collision =
          snakeRef.current.some((segment) => segment.x === newX && segment.y === newY) ||
          (foodRef.current.x === newX && foodRef.current.y === newY);
      }
      bonusRef.current = {
        x: newX!,
        y: newY!,
        type,
        timeLeft: 45,
      };
    }
  }, []);

  // Add particle burst
  const addParticles = (x: number, y: number, color: string, count = 12) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cellSize = canvas.width / GRID_SIZE;
    const px = (x + 0.5) * cellSize;
    const py = (y + 0.5) * cellSize;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 1.5;
      particlesRef.current.push({
        x: px,
        y: py,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 4 + 2,
        color,
        alpha: 1,
        decay: Math.random() * 0.03 + 0.02,
      });
    }
  };

  // Change direction safely
  const changeDirection = useCallback((newDir: Point) => {
    const current = dirRef.current;
    if (newDir.x !== 0 && current.x !== 0) return;
    if (newDir.y !== 0 && current.y !== 0) return;
    nextDirRef.current = newDir;
  }, []);

  // Reset / Start Game
  const resetGame = (targetMode = gameMode, targetSpeed = speedMode) => {
    setGameMode(targetMode);
    setSpeedMode(targetSpeed);
    modeRef.current = targetMode;
    speedRef.current = targetSpeed;

    snakeRef.current = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ];
    dirRef.current = { x: 1, y: 0 };
    nextDirRef.current = { x: 1, y: 0 };
    foodRef.current = { x: 15, y: 10 };
    bonusRef.current = null;
    particlesRef.current = [];
    setScore(0);
    setSnakeLength(3);
    setIsGameOver(false);
    setIsPaused(false);
    setTimeRemaining(30);
    setOverclockTicks(0);
  };

  // Mode Selection Handler
  const handleSelectMode = (selectedMode: GameMode) => {
    playSynth('click');
    resetGame(selectedMode, speedMode);
  };

  // Speed Selection Handler
  const handleSelectSpeed = (selectedSpeed: SpeedMode) => {
    playSynth('click');
    resetGame(gameMode, selectedSpeed);
  };

  // Countdown timer in timed mode
  useEffect(() => {
    if (gameMode !== 'timed' || isPaused || isGameOver) return;
    const interval = setInterval(() => {
      setTimeRemaining((t) => {
        if (t <= 1) {
          setIsGameOver(true);
          playSynth('crash');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [gameMode, isPaused, isGameOver, playSynth]);

  // Main game tick loop
  useEffect(() => {
    if (isPaused || isGameOver) return;

    const gameTick = () => {
      dirRef.current = nextDirRef.current;
      const currentDir = dirRef.current;
      const head = snakeRef.current[0];
      const currentMode = modeRef.current;

      let newHead: Point = {
        x: head.x + currentDir.x,
        y: head.y + currentDir.y,
      };

      // Collision checks based on active mode
      if (currentMode === 'portals') {
        // Wrap around borders
        if (newHead.x < 0) newHead.x = GRID_SIZE - 1;
        else if (newHead.x >= GRID_SIZE) newHead.x = 0;
        if (newHead.y < 0) newHead.y = GRID_SIZE - 1;
        else if (newHead.y >= GRID_SIZE) newHead.y = 0;
      } else {
        // Wall collision
        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
          setIsGameOver(true);
          playSynth('crash');
          addParticles(head.x, head.y, '#f87171', 20);
          return;
        }
      }

      // Self collision
      if (snakeRef.current.some((seg) => seg.x === newHead.x && seg.y === newHead.y)) {
        setIsGameOver(true);
        playSynth('crash');
        addParticles(newHead.x, newHead.y, '#f87171', 20);
        return;
      }

      // Move snake
      const newSnake = [newHead, ...snakeRef.current];

      // Check food collision
      if (newHead.x === foodRef.current.x && newHead.y === foodRef.current.y) {
        playSynth('eat');
        addParticles(newHead.x, newHead.y, '#10b981', 14);
        const multiplier = overclockTicks > 0 ? 2 : 1;
        const pts = 10 * multiplier;
        setScore((s) => {
          const next = s + pts;
          if (next > highScore) {
            setHighScore(next);
            try {
              localStorage.setItem('tusdesvarios_snake_highscore', next.toString());
            } catch {}
          }
          return next;
        });
        setSnakeLength(newSnake.length);
        foodRef.current = spawnFood();
        trySpawnBonus();
        if (currentMode === 'timed') {
          setTimeRemaining((t) => Math.min(60, t + 3));
        }
      } else {
        newSnake.pop();
      }

      // Check bonus item collision
      if (bonusRef.current) {
        if (newHead.x === bonusRef.current.x && newHead.y === bonusRef.current.y) {
          if (bonusRef.current.type === 'crystal') {
            playSynth('bonus');
            addParticles(newHead.x, newHead.y, '#06b6d4', 20);
            const pts = 50 * (overclockTicks > 0 ? 2 : 1);
            setScore((s) => s + pts);
          } else {
            playSynth('powerup');
            addParticles(newHead.x, newHead.y, '#f59e0b', 20);
            setOverclockTicks(50);
          }
          bonusRef.current = null;
        } else {
          bonusRef.current.timeLeft -= 1;
          if (bonusRef.current.timeLeft <= 0) {
            bonusRef.current = null;
          }
        }
      }

      if (overclockTicks > 0) {
        setOverclockTicks((t) => t - 1);
      }

      snakeRef.current = newSnake;
    };

    const intervalMs = SPEED_CONFIG[speedMode].tickMs;
    const tickTimer = setInterval(gameTick, intervalMs);

    return () => clearInterval(tickTimer);
  }, [
    isPaused,
    isGameOver,
    speedMode,
    highScore,
    overclockTicks,
    playSynth,
    spawnFood,
    trySpawnBonus,
  ]);

  // Canvas drawing loop (60 FPS smooth rendering)
  useEffect(() => {
    let animFrame: number;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;
      const cellSize = width / GRID_SIZE;

      // Clear background
      ctx.fillStyle = '#0a0e1a';
      ctx.fillRect(0, 0, width, height);

      // Draw subtle grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(width, i * cellSize);
        ctx.stroke();
      }

      // Draw perimeter portal border if in portal mode
      if (gameMode === 'portals') {
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.45)';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(1, 1, width - 2, height - 2);
        ctx.setLineDash([]);
      } else {
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.35)';
        ctx.lineWidth = 3;
        ctx.strokeRect(0, 0, width, height);
      }

      // Draw food (pulsing green cyber node)
      const food = foodRef.current;
      const fx = food.x * cellSize + cellSize / 2;
      const fy = food.y * cellSize + cellSize / 2;
      const time = Date.now() * 0.005;
      const pulseRadius = cellSize / 2.3 + Math.sin(time) * 1.5;

      ctx.save();
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 12;
      ctx.fillStyle = '#34d399';
      ctx.beginPath();
      ctx.arc(fx, fy, pulseRadius, 0, Math.PI * 2);
      ctx.fill();

      // Inner food core
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(fx, fy, pulseRadius * 0.45, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Draw bonus item if active
      if (bonusRef.current) {
        const bonus = bonusRef.current;
        const bx = bonus.x * cellSize + cellSize / 2;
        const by = bonus.y * cellSize + cellSize / 2;
        const bColor = bonus.type === 'crystal' ? '#06b6d4' : '#f59e0b';

        ctx.save();
        ctx.shadowColor = bColor;
        ctx.shadowBlur = 16;
        ctx.fillStyle = bColor;

        if (bonus.type === 'crystal') {
          // Diamond shape
          ctx.beginPath();
          ctx.moveTo(bx, by - cellSize / 2.2);
          ctx.lineTo(bx + cellSize / 2.2, by);
          ctx.lineTo(bx, by + cellSize / 2.2);
          ctx.lineTo(bx - cellSize / 2.2, by);
          ctx.closePath();
          ctx.fill();
        } else {
          // Lightning circle
          ctx.beginPath();
          ctx.arc(bx, by, cellSize / 2.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 12px monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('⚡', bx, by);
        }

        // Circular timer indicator
        const progress = bonus.timeLeft / 45;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(bx, by, cellSize / 1.7, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
        ctx.stroke();
        ctx.restore();
      }

      // Draw Snake Body
      const snake = snakeRef.current;
      snake.forEach((seg, index) => {
        const sx = seg.x * cellSize;
        const sy = seg.y * cellSize;
        const isHead = index === 0;

        ctx.save();
        if (isHead) {
          // Snake head glow
          ctx.shadowColor = overclockTicks > 0 ? '#f59e0b' : '#34d399';
          ctx.shadowBlur = 16;
          ctx.fillStyle = overclockTicks > 0 ? '#fbbf24' : '#10b981';
          ctx.beginPath();
          ctx.roundRect(sx + 1, sy + 1, cellSize - 2, cellSize - 2, 6);
          ctx.fill();

          // Cyber Eyes
          ctx.fillStyle = '#0b0f19';
          const dir = dirRef.current;
          let eye1X = sx + 5;
          let eye1Y = sy + 5;
          let eye2X = sx + cellSize - 8;
          let eye2Y = sy + 5;

          if (dir.x === 1) {
            eye1X = sx + cellSize - 6;
            eye2X = sx + cellSize - 6;
            eye1Y = sy + 4;
            eye2Y = sy + cellSize - 7;
          } else if (dir.x === -1) {
            eye1X = sx + 4;
            eye2X = sx + 4;
            eye1Y = sy + 4;
            eye2Y = sy + cellSize - 7;
          } else if (dir.y === 1) {
            eye1X = sx + 4;
            eye2X = sx + cellSize - 7;
            eye1Y = sy + cellSize - 6;
            eye2Y = sy + cellSize - 6;
          }

          ctx.beginPath();
          ctx.arc(eye1X, eye1Y, 2.2, 0, Math.PI * 2);
          ctx.arc(eye2X, eye2Y, 2.2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Snake gradient body segments
          const ratio = index / snake.length;
          const r = Math.round(16 * (1 - ratio) + 6 * ratio);
          const g = Math.round(185 * (1 - ratio) + 182 * ratio);
          const b = Math.round(129 * (1 - ratio) + 212 * ratio);
          ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
          ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.5)`;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.roundRect(sx + 2, sy + 2, cellSize - 4, cellSize - 4, 4);
          ctx.fill();
        }
        ctx.restore();
      });

      // Draw and update particles
      particlesRef.current.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particlesRef.current.splice(idx, 1);
        } else {
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });

      animFrame = requestAnimationFrame(render);
    };

    animFrame = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animFrame);
  }, [gameMode, overclockTicks]);

  // Keyboard navigation listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          changeDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          changeDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          changeDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          changeDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused((p) => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [changeDirection]);

  // Touch / Swipe controls on canvas
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (Math.max(absX, absY) > 20) {
      if (absX > absY) {
        changeDirection({ x: dx > 0 ? 1 : -1, y: 0 });
      } else {
        changeDirection({ x: 0, y: dy > 0 ? 1 : -1 });
      }
    }
    touchStartRef.current = null;
  };

  const toggleSound = () => {
    setSoundEnabled((s) => !s);
    playSynth('click');
  };

  return (
    <div className="home-container" style={{ maxWidth: '820px' }}>
      {/* Top Header & Breadcrumbs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem',
          flexWrap: 'wrap',
          gap: '0.8rem',
        }}
      >
        <Link
          href="/desvarios-retro"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            transition: 'color 0.2s',
          }}
          className="breadcrumb-link"
        >
          <ArrowLeft size={14} />
          Volver a Desvaríos Retro
        </Link>

        {/* Stats bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.3rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#34d399',
              fontSize: '0.82rem',
              fontWeight: 700,
            }}
          >
            <Trophy size={13} />
            <span>{score} Puntos</span>
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.3rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              color: '#fbbf24',
              fontSize: '0.82rem',
              fontWeight: 700,
            }}
          >
            <Flame size={13} />
            <span>Récord: {highScore}</span>
          </div>

          {gameMode === 'timed' && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.3rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                background: timeRemaining <= 5 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(6, 182, 212, 0.12)',
                border: `1px solid ${timeRemaining <= 5 ? '#f87171' : 'rgba(6, 182, 212, 0.3)'}`,
                color: timeRemaining <= 5 ? '#f87171' : '#38bdf8',
                fontSize: '0.82rem',
                fontWeight: 700,
              }}
            >
              <Clock size={13} />
              <span>{timeRemaining}s</span>
            </div>
          )}

          <button
            onClick={toggleSound}
            className="btn-secondary"
            style={{ padding: '0.3rem 0.6rem' }}
            title={soundEnabled ? 'Silenciar sonidos 8-bit' : 'Activar sonidos 8-bit'}
            aria-label="Silenciar sonido"
          >
            {soundEnabled ? (
              <Volume2 size={14} style={{ color: '#38bdf8' }} />
            ) : (
              <VolumeX size={14} style={{ color: 'var(--text-muted)' }} />
            )}
          </button>
        </div>
      </div>

      {/* Main Arcade Frame */}
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem 1.5rem',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(16, 185, 129, 0.15)',
          position: 'relative',
        }}
      >
        {/* Game Mode & Speed Selector Bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            paddingBottom: '1.25rem',
            borderBottom: '1px solid var(--border-subtle)',
            marginBottom: '1.5rem',
          }}
        >
          {/* Game Mode Selection */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Modo:
            </span>
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              {(['classic', 'portals', 'timed'] as GameMode[]).map((m) => {
                const isActive = gameMode === m;
                return (
                  <button
                    key={m}
                    onClick={() => handleSelectMode(m)}
                    className={`cat-filter-btn ${isActive ? 'cat-filter-btn-active' : ''}`}
                    style={{
                      padding: '0.3rem 0.75rem',
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      background: isActive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                      borderColor: isActive ? '#34d399' : 'var(--border-subtle)',
                      color: isActive ? '#34d399' : 'var(--text-secondary)',
                      fontWeight: isActive ? 700 : 500,
                    }}
                    title={MODE_CONFIG[m].desc}
                  >
                    <span>{MODE_CONFIG[m].icon}</span>
                    <span>{MODE_CONFIG[m].label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Speed Selection */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Velocidad:
            </span>
            <div style={{ display: 'flex', gap: '0.3rem' }}>
              {(['cadete', 'hacker', 'ninja'] as SpeedMode[]).map((s) => {
                const isActive = speedMode === s;
                return (
                  <button
                    key={s}
                    onClick={() => handleSelectSpeed(s)}
                    style={{
                      fontSize: '0.78rem',
                      padding: '0.28rem 0.68rem',
                      borderRadius: 'var(--radius-full)',
                      background: isActive ? 'rgba(255, 255, 255, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                      color: isActive ? SPEED_CONFIG[s].color : 'var(--text-muted)',
                      border: `1.5px solid ${isActive ? SPEED_CONFIG[s].color : 'var(--border-subtle)'}`,
                      boxShadow: isActive ? `0 0 10px ${SPEED_CONFIG[s].color}40` : 'none',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {s.toUpperCase()}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Canvas Game Stage */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'relative',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              boxShadow: '0 0 25px rgba(16, 185, 129, 0.25)',
              border: '2px solid rgba(16, 185, 129, 0.4)',
            }}
          >
            <canvas
              ref={canvasRef}
              width={400}
              height={400}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              style={{
                display: 'block',
                maxWidth: '100%',
                aspectRatio: '1/1',
                background: '#090d16',
                cursor: 'pointer',
              }}
            />

            {/* Overclock active badge */}
            {overclockTicks > 0 && (
              <div
                style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  padding: '0.25rem 0.65rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(245, 158, 11, 0.25)',
                  border: '1px solid #fbbf24',
                  color: '#fbbf24',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  animation: 'pulse 1s infinite',
                }}
              >
                ⚡ OVERCLOCK X2
              </div>
            )}

            {/* Pause Overlay */}
            {isPaused && !isGameOver && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(11, 15, 25, 0.85)',
                  backdropFilter: 'blur(4px)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '1rem',
                }}
              >
                <div style={{ fontSize: '2rem' }}>⏸️</div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38bdf8' }}>
                  JUEGO PAUSADO
                </h3>
                <button onClick={() => setIsPaused(false)} className="btn-primary">
                  <Play size={15} />
                  <span>Reanudar (Espacio)</span>
                </button>
              </div>
            )}

            {/* Game Over Overlay */}
            {isGameOver && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(11, 15, 25, 0.92)',
                  backdropFilter: 'blur(6px)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '1.5rem',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>💥</div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#f87171', marginBottom: '0.5rem' }}>
                  SISTEMA COLAPSADO
                </h3>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                  Puntuación final: <strong style={{ color: '#34d399' }}>{score}</strong> | Longitud:{' '}
                  <strong>{snakeLength}</strong>
                </p>
                <button
                  onClick={() => resetGame()}
                  className="btn-primary"
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
                  }}
                >
                  <RotateCcw size={15} />
                  <span>Reiniciar Misión</span>
                </button>
              </div>
            )}
          </div>

          {/* Quick Action Controls (Pause & Restart) */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button
              onClick={() => setIsPaused((p) => !p)}
              className="btn-secondary"
              style={{ fontSize: '0.85rem' }}
            >
              {isPaused ? <Play size={14} /> : <Pause size={14} />}
              <span>{isPaused ? 'Reanudar' : 'Pausar (Espacio)'}</span>
            </button>
            <button onClick={() => resetGame()} className="btn-secondary" style={{ fontSize: '0.85rem' }}>
              <RotateCcw size={14} />
              <span>Reiniciar</span>
            </button>
          </div>

          {/* Mobile D-Pad Virtual Controller */}
          <div
            style={{
              marginTop: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <button
              onClick={() => changeDirection({ x: 0, y: -1 })}
              className="btn-secondary"
              style={{
                width: '56px',
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
              }}
              aria-label="Arriba"
            >
              <ArrowUp size={22} style={{ color: '#34d399' }} />
            </button>

            <div style={{ display: 'flex', gap: '2.5rem' }}>
              <button
                onClick={() => changeDirection({ x: -1, y: 0 })}
                className="btn-secondary"
                style={{
                  width: '56px',
                  height: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                }}
                aria-label="Izquierda"
              >
                <ArrowLeft size={22} style={{ color: '#34d399' }} />
              </button>

              <button
                onClick={() => changeDirection({ x: 1, y: 0 })}
                className="btn-secondary"
                style={{
                  width: '56px',
                  height: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                }}
                aria-label="Derecha"
              >
                <ArrowRight size={22} style={{ color: '#34d399' }} />
              </button>
            </div>

            <button
              onClick={() => changeDirection({ x: 0, y: 1 })}
              className="btn-secondary"
              style={{
                width: '56px',
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
              }}
              aria-label="Abajo"
            >
              <ArrowDown size={22} style={{ color: '#34d399' }} />
            </button>
          </div>
        </div>
      </div>

      {/* Guide Section */}
      <section
        style={{
          marginTop: '3.5rem',
          padding: '2rem 1.5rem',
          background: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
          <HelpCircle size={22} style={{ color: '#10b981' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>
            Guía de Hackeo: Snake Cyberpunk 2084
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>🟩 Nodo de Datos</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Otorga <strong>+10 puntos</strong> y extiende el cuerpo cibernético de tu serpiente en 1 unidad.
            </p>
          </div>

          <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>💎 Cristal Cuántico</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Aparición temporal fugaz. Otorga <strong>+50 puntos</strong> antes de que expire su temporizador.
            </p>
          </div>

          <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>⚡ Modo Overclock</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Duplica todos los puntos obtenidos durante su periodo de sobrecarga energética.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
