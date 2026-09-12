'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  RotateCcw,
  Trophy,
  HelpCircle,
  Pause,
  Play,
  Users,
  User,
  Monitor,
} from 'lucide-react';
import confetti from 'canvas-confetti';

type GameMode = '1P' | '2P';
type Difficulty = 'novato' | 'arcade' | 'maestro';
type Palette = 'classic' | 'green' | 'amber' | 'neon';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  size: number;
}

const WIDTH = 640;
const HEIGHT = 400;
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 64;
const BALL_SIZE = 12;

const PALETTES: Record<Palette, { bg: string; primary: string; p1: string; p2: string; ball: string; net: string; label: string }> = {
  classic: {
    label: 'B/N 1972',
    bg: '#05070d',
    primary: '#f8fafc',
    p1: '#ffffff',
    p2: '#ffffff',
    ball: '#ffffff',
    net: 'rgba(255, 255, 255, 0.45)',
  },
  green: {
    label: 'Fósforo Verde',
    bg: '#021206',
    primary: '#22c55e',
    p1: '#4ade80',
    p2: '#4ade80',
    ball: '#86efac',
    net: 'rgba(34, 197, 94, 0.45)',
  },
  amber: {
    label: 'Fósforo Ámbar',
    bg: '#140a02',
    primary: '#f59e0b',
    p1: '#fbbf24',
    p2: '#fbbf24',
    ball: '#fde68a',
    net: 'rgba(245, 158, 11, 0.45)',
  },
  neon: {
    label: 'Ciber Neón',
    bg: '#070a14',
    primary: '#38bdf8',
    p1: '#38bdf8',
    p2: '#f43f5e',
    ball: '#facc15',
    net: 'rgba(56, 189, 248, 0.35)',
  },
};

export default function RetroTennisGame() {
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [targetScore, setTargetScore] = useState(7);
  const [gameMode, setGameMode] = useState<GameMode>('1P');
  const [difficulty, setDifficulty] = useState<Difficulty>('arcade');
  const [palette, setPalette] = useState<Palette>('classic');
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState<'p1' | 'p2' | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showHelp, setShowHelp] = useState(false);
  const [rallyCount, setRallyCount] = useState(0);
  const [maxRally, setMaxRally] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Palas
  const p1Ref = useRef({
    x: 28,
    y: HEIGHT / 2 - PADDLE_HEIGHT / 2,
    vy: 0,
    speed: 6.5,
  });

  const p2Ref = useRef({
    x: WIDTH - 28 - PADDLE_WIDTH,
    y: HEIGHT / 2 - PADDLE_HEIGHT / 2,
    vy: 0,
    speed: 6.5,
  });

  // Pelota
  const ballRef = useRef({
    x: WIDTH / 2 - BALL_SIZE / 2,
    y: HEIGHT / 2 - BALL_SIZE / 2,
    vx: 5.0,
    vy: 2.0,
    speed: 5.2,
    serving: true,
    serveTimer: 60, // Frames antes del saque
  });

  // Teclas activas
  const keysRef = useRef<{ [key: string]: boolean }>({});

  const particlesRef = useRef<Particle[]>([]);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const rallyRef = useRef(0);
  const maxRallyRef = useRef(0);
  const isPausedRef = useRef(false);
  const isGameOverRef = useRef(false);
  const score1Ref = useRef(0);
  const score2Ref = useRef(0);

  isPausedRef.current = isPaused;
  isGameOverRef.current = isGameOver;

  // Cargar récord de peloteo
  useEffect(() => {
    try {
      const saved = localStorage.getItem('desvarios_tenis_retro_max_rally');
      if (saved) {
        const val = parseInt(saved, 10);
        setMaxRally(val);
        maxRallyRef.current = val;
      }
    } catch {}
  }, []);

  // Audio Procedural con Web Audio API
  const playSound = useCallback(
    (type: 'hitPaddle' | 'hitWall' | 'score' | 'win') => {
      if (!soundEnabled) return;
      try {
        if (!audioCtxRef.current) {
          const AudioContextClass =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          audioCtxRef.current = new AudioContextClass();
        }
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') ctx.resume();
        const now = ctx.currentTime;

        if (type === 'hitPaddle') {
          // 'Bop' seco retro
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(240, now);
          osc.frequency.exponentialRampToValueAtTime(160, now + 0.05);
          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.05);
        } else if (type === 'hitWall') {
          // 'Bip' agudo de rebote
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(460, now);
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.04);
        } else if (type === 'score') {
          // Tono de punto
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(140, now);
          gain.gain.setValueAtTime(0.14, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.25);
        } else if (type === 'win') {
          // Fanfarria 8-bit retro
          [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(freq, now + idx * 0.08);
            gain.gain.setValueAtTime(0.12, now + idx * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.16);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + idx * 0.08);
            osc.stop(now + idx * 0.08 + 0.16);
          });
        }
      } catch {}
    },
    [soundEnabled]
  );

  // Reiniciar saque de pelota
  const resetBall = useCallback((towardsPlayer: 1 | 2 = 1) => {
    const angle = (Math.random() * 0.6 - 0.3); // ±17 grados
    const dir = towardsPlayer === 1 ? -1 : 1;
    const initialSpeed = 5.2;

    ballRef.current = {
      x: WIDTH / 2 - BALL_SIZE / 2,
      y: HEIGHT / 2 - BALL_SIZE / 2,
      vx: Math.cos(angle) * initialSpeed * dir,
      vy: Math.sin(angle) * initialSpeed,
      speed: initialSpeed,
      serving: true,
      serveTimer: 45, // 0.75s de pausa previa al servicio
    };

    rallyRef.current = 0;
    setRallyCount(0);
  }, []);

  // Reiniciar partida completa
  const restartGame = useCallback(() => {
    setScore1(0);
    setScore2(0);
    score1Ref.current = 0;
    score2Ref.current = 0;
    setIsGameOver(false);
    isGameOverRef.current = false;
    setWinner(null);
    setIsPaused(false);
    isPausedRef.current = false;
    particlesRef.current = [];
    p1Ref.current.y = HEIGHT / 2 - PADDLE_HEIGHT / 2;
    p2Ref.current.y = HEIGHT / 2 - PADDLE_HEIGHT / 2;
    resetBall(1);
  }, [resetBall]);

  // Teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
        setIsPaused((prev) => !prev);
        return;
      }
      if (e.key === ' ') {
        e.preventDefault();
        setIsPaused((prev) => !prev);
        return;
      }
      keysRef.current[e.key] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Control con Ratón sobre el canvas
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isPausedRef.current || isGameOverRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleY = HEIGHT / rect.height;
    const mouseY = (e.clientY - rect.top) * scaleY;

    // Centrar la pala izquierda con el cursor
    p1Ref.current.y = Math.max(0, Math.min(HEIGHT - PADDLE_HEIGHT, mouseY - PADDLE_HEIGHT / 2));
  }, []);

  // Control Táctil sobre el canvas
  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    if (isPausedRef.current || isGameOverRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = WIDTH / rect.width;
    const scaleY = HEIGHT / rect.height;

    for (let i = 0; i < e.touches.length; i++) {
      const touch = e.touches[i];
      const touchX = (touch.clientX - rect.left) * scaleX;
      const touchY = (touch.clientY - rect.top) * scaleY;

      if (touchX < WIDTH / 2) {
        // Mitad izquierda: P1
        p1Ref.current.y = Math.max(0, Math.min(HEIGHT - PADDLE_HEIGHT, touchY - PADDLE_HEIGHT / 2));
      } else {
        // Mitad derecha: P2 (en modo 2 jugadores)
        p2Ref.current.y = Math.max(0, Math.min(HEIGHT - PADDLE_HEIGHT, touchY - PADDLE_HEIGHT / 2));
      }
    }
  }, []);

  // Partículas de impacto
  const createSparks = useCallback((x: number, y: number, color: string, count = 8) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = Math.random() * 3 + 1;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        color,
        alpha: 1,
        size: Math.random() * 2.5 + 1.5,
      });
    }
  }, []);

  // Loop de juego a 60 FPS
  useEffect(() => {
    let animId: number;

    const gameLoop = () => {
      animId = requestAnimationFrame(gameLoop);

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const colors = PALETTES[palette];

      // 1. ACTUALIZACIÓN DE ESTADO
      if (!isPausedRef.current && !isGameOverRef.current) {
        const p1 = p1Ref.current;
        const p2 = p2Ref.current;
        const ball = ballRef.current;
        const keys = keysRef.current;

        // Movimiento teclado P1 (W / S)
        if (keys['w'] || keys['W']) {
          p1.y = Math.max(0, p1.y - p1.speed);
        }
        if (keys['s'] || keys['S']) {
          p1.y = Math.min(HEIGHT - PADDLE_HEIGHT, p1.y + p1.speed);
        }

        // Movimiento P2: Teclado si es 2P, o IA si es 1P
        if (gameMode === '2P') {
          if (keys['ArrowUp']) {
            p2.y = Math.max(0, p2.y - p2.speed);
          }
          if (keys['ArrowDown']) {
            p2.y = Math.min(HEIGHT - PADDLE_HEIGHT, p2.y + p2.speed);
          }
        } else {
          // IA de Player 2
          const p2Center = p2.y + PADDLE_HEIGHT / 2;
          const ballCenter = ball.y + BALL_SIZE / 2;
          let targetY = ballCenter;

          let aiSpeed = 4.2;
          let reactionDistance = WIDTH * 0.35;

          if (difficulty === 'novato') {
            aiSpeed = 3.6;
            reactionDistance = WIDTH * 0.45;
            targetY += Math.sin(Date.now() * 0.003) * 16; // Margen de error
          } else if (difficulty === 'arcade') {
            aiSpeed = 5.2;
            reactionDistance = WIDTH * 0.25;
            targetY += Math.sin(Date.now() * 0.002) * 6;
          } else {
            // Maestro
            aiSpeed = 7.0;
            reactionDistance = 0; // Reacciona de inmediato
            // Predicción si la bola viene hacia la CPU
            if (ball.vx > 0) {
              const timeToReach = (p2.x - ball.x) / ball.vx;
              let predictedY = ball.y + ball.vy * timeToReach;
              // Ajustar rebotes en paredes superior e inferior
              while (predictedY < 0 || predictedY > HEIGHT - BALL_SIZE) {
                if (predictedY < 0) predictedY = -predictedY;
                else if (predictedY > HEIGHT - BALL_SIZE) predictedY = 2 * (HEIGHT - BALL_SIZE) - predictedY;
              }
              targetY = predictedY + BALL_SIZE / 2;
            }
          }

          // Solo rastrear si la bola está dentro de la distancia de reacción y viene hacia la CPU
          if (ball.vx > 0 || ball.x > reactionDistance) {
            const diff = targetY - p2Center;
            if (Math.abs(diff) > 4) {
              const move = Math.min(aiSpeed, Math.abs(diff)) * Math.sign(diff);
              p2.y = Math.max(0, Math.min(HEIGHT - PADDLE_HEIGHT, p2.y + move));
            }
          }
        }

        // Gestión de Saque
        if (ball.serving) {
          ball.serveTimer--;
          if (ball.serveTimer <= 0) {
            ball.serving = false;
          }
        } else {
          // Mover bola
          ball.x += ball.vx;
          ball.y += ball.vy;

          // Rebote en paredes superior e inferior
          if (ball.y <= 0) {
            ball.y = 0;
            ball.vy = Math.abs(ball.vy);
            playSound('hitWall');
            createSparks(ball.x + BALL_SIZE / 2, 0, colors.primary, 6);
          } else if (ball.y + BALL_SIZE >= HEIGHT) {
            ball.y = HEIGHT - BALL_SIZE;
            ball.vy = -Math.abs(ball.vy);
            playSound('hitWall');
            createSparks(ball.x + BALL_SIZE / 2, HEIGHT, colors.primary, 6);
          }

          // Impacto con Pala 1 (Izquierda)
          if (
            ball.vx < 0 &&
            ball.x <= p1.x + PADDLE_WIDTH &&
            ball.x + BALL_SIZE >= p1.x &&
            ball.y + BALL_SIZE >= p1.y &&
            ball.y <= p1.y + PADDLE_HEIGHT
          ) {
            // Calcular ángulo de salida según el punto de impacto
            const hitOffset = (ball.y + BALL_SIZE / 2) - (p1.y + PADDLE_HEIGHT / 2);
            const normalizedHit = hitOffset / (PADDLE_HEIGHT / 2); // -1.0 a 1.0
            const maxBounceAngle = Math.PI / 3.4; // ~52 grados
            const bounceAngle = normalizedHit * maxBounceAngle;

            // Incrementar velocidad por peloteo
            ball.speed = Math.min(13.0, ball.speed + 0.28);
            ball.vx = Math.cos(bounceAngle) * ball.speed;
            ball.vy = Math.sin(bounceAngle) * ball.speed;
            ball.x = p1.x + PADDLE_WIDTH + 1; // Evitar atascos

            rallyRef.current++;
            setRallyCount(rallyRef.current);
            if (rallyRef.current > maxRallyRef.current) {
              maxRallyRef.current = rallyRef.current;
              setMaxRally(rallyRef.current);
              try {
                localStorage.setItem('desvarios_tenis_retro_max_rally', rallyRef.current.toString());
              } catch {}
            }

            playSound('hitPaddle');
            createSparks(ball.x, ball.y + BALL_SIZE / 2, colors.p1, 10);
          }

          // Impacto con Pala 2 (Derecha)
          if (
            ball.vx > 0 &&
            ball.x + BALL_SIZE >= p2.x &&
            ball.x <= p2.x + PADDLE_WIDTH &&
            ball.y + BALL_SIZE >= p2.y &&
            ball.y <= p2.y + PADDLE_HEIGHT
          ) {
            const hitOffset = (ball.y + BALL_SIZE / 2) - (p2.y + PADDLE_HEIGHT / 2);
            const normalizedHit = hitOffset / (PADDLE_HEIGHT / 2);
            const maxBounceAngle = Math.PI / 3.4;
            const bounceAngle = normalizedHit * maxBounceAngle;

            ball.speed = Math.min(13.0, ball.speed + 0.28);
            ball.vx = -Math.cos(bounceAngle) * ball.speed;
            ball.vy = Math.sin(bounceAngle) * ball.speed;
            ball.x = p2.x - BALL_SIZE - 1;

            rallyRef.current++;
            setRallyCount(rallyRef.current);
            if (rallyRef.current > maxRallyRef.current) {
              maxRallyRef.current = rallyRef.current;
              setMaxRally(rallyRef.current);
              try {
                localStorage.setItem('desvarios_tenis_retro_max_rally', rallyRef.current.toString());
              } catch {}
            }

            playSound('hitPaddle');
            createSparks(ball.x + BALL_SIZE, ball.y + BALL_SIZE / 2, colors.p2, 10);
          }

          // Anotación: Punto para P2 (sale por la izquierda)
          if (ball.x < -BALL_SIZE) {
            playSound('score');
            const nextScore = score2Ref.current + 1;
            score2Ref.current = nextScore;
            setScore2(nextScore);

            if (nextScore >= targetScore) {
              setIsGameOver(true);
              isGameOverRef.current = true;
              setWinner('p2');
              playSound('win');
            } else {
              resetBall(1); // Saque hacia P1
            }
          }

          // Anotación: Punto para P1 (sale por la derecha)
          if (ball.x > WIDTH) {
            playSound('score');
            const nextScore = score1Ref.current + 1;
            score1Ref.current = nextScore;
            setScore1(nextScore);

            if (nextScore >= targetScore) {
              setIsGameOver(true);
              isGameOverRef.current = true;
              setWinner('p1');
              playSound('win');
              confetti({ particleCount: 70, spread: 90, origin: { y: 0.6 } });
            } else {
              resetBall(2); // Saque hacia P2
            }
          }
        }
      }

      // 2. RENDERIZADO EN CANVAS
      ctx.fillStyle = colors.bg;
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      // Red central discontinua clásica
      ctx.strokeStyle = colors.net;
      ctx.lineWidth = 6;
      ctx.setLineDash([12, 12]);
      ctx.beginPath();
      ctx.moveTo(WIDTH / 2, 0);
      ctx.lineTo(WIDTH / 2, HEIGHT);
      ctx.stroke();
      ctx.setLineDash([]); // Reset dash

      // Marcador Digital estilo 7 segmentos de 1972
      const drawDigitalNumber = (num: number, x: number, y: number, color: string) => {
        ctx.fillStyle = color;
        ctx.font = '900 54px "Courier New", Courier, monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.shadowColor = color;
        ctx.shadowBlur = palette === 'classic' ? 0 : 8;
        ctx.fillText(num.toString(), x, y);
        ctx.shadowBlur = 0;
      };

      drawDigitalNumber(score1Ref.current, WIDTH / 2 - 80, 24, colors.p1);
      drawDigitalNumber(score2Ref.current, WIDTH / 2 + 80, 24, colors.p2);

      // Dibujar Pala 1
      ctx.fillStyle = colors.p1;
      ctx.shadowColor = colors.p1;
      ctx.shadowBlur = palette === 'classic' ? 0 : 8;
      ctx.fillRect(p1Ref.current.x, p1Ref.current.y, PADDLE_WIDTH, PADDLE_HEIGHT);

      // Dibujar Pala 2
      ctx.fillStyle = colors.p2;
      ctx.shadowColor = colors.p2;
      ctx.shadowBlur = palette === 'classic' ? 0 : 8;
      ctx.fillRect(p2Ref.current.x, p2Ref.current.y, PADDLE_WIDTH, PADDLE_HEIGHT);

      // Dibujar Pelota Cuadrada
      const ball = ballRef.current;
      ctx.fillStyle = colors.ball;
      ctx.shadowColor = colors.ball;
      ctx.shadowBlur = palette === 'classic' ? 0 : 10;
      ctx.fillRect(ball.x, ball.y, BALL_SIZE, BALL_SIZE);
      ctx.shadowBlur = 0;

      // Partículas
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const part = particles[i];
        part.x += part.vx;
        part.y += part.vy;
        part.alpha -= 0.04;
        if (part.alpha <= 0) {
          particles.splice(i, 1);
        } else {
          ctx.save();
          ctx.globalAlpha = part.alpha;
          ctx.fillStyle = part.color;
          ctx.fillRect(part.x, part.y, part.size, part.size);
          ctx.restore();
        }
      }
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [palette, gameMode, difficulty, targetScore, playSound, resetBall, createSparks]);

  return (
    <div className="w-full flex flex-col items-center select-none">
      {/* Barra de Herramientas y Estado */}
      <header className="w-full max-w-[640px] flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border border-slate-700/80 backdrop-blur-md rounded-xl px-4 py-3 mb-4 shadow-xl">
        <div className="flex items-center gap-2">
          <Link
            href="/desvarios-retro"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1.5 rounded-lg transition-colors"
          >
            <ArrowLeft size={14} /> Arcade
          </Link>
          <span className="text-xs font-bold text-slate-400 hidden sm:inline">|</span>
          <span className="text-xs font-mono font-bold text-emerald-400">
            PELOTEO: {rallyCount}
          </span>
          <span className="text-xs font-mono text-slate-400">
            (RÉCORD: {maxRally})
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Selector 1P / 2P */}
          <button
            onClick={() => {
              setGameMode((m) => (m === '1P' ? '2P' : '1P'));
              restartGame();
            }}
            className="flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600/60 transition-colors"
            title="Cambiar modo de juego"
          >
            {gameMode === '1P' ? <User size={13} /> : <Users size={13} />}
            <span>{gameMode}</span>
          </button>

          {/* Dificultad (si 1P) */}
          {gameMode === '1P' && (
            <button
              onClick={() => {
                setDifficulty((d) =>
                  d === 'novato' ? 'arcade' : d === 'arcade' ? 'maestro' : 'novato'
                );
              }}
              className="text-xs font-bold px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 transition-colors capitalize"
              title="Dificultad IA"
            >
              {difficulty}
            </button>
          )}

          {/* Selector de Paleta */}
          <button
            onClick={() => {
              const keys = Object.keys(PALETTES) as Palette[];
              const nextIdx = (keys.indexOf(palette) + 1) % keys.length;
              setPalette(keys[nextIdx]);
            }}
            className="flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 transition-colors"
            title="Cambiar monitor CRT retro"
          >
            <Monitor size={13} />
            <span className="hidden md:inline">{PALETTES[palette].label}</span>
          </button>

          {/* Audio */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title={soundEnabled ? 'Silenciar sonido' : 'Activar sonido'}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          {/* Pausa */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Pausa"
          >
            {isPaused ? <Play size={16} /> : <Pause size={16} />}
          </button>

          {/* Ayuda */}
          <button
            onClick={() => setShowHelp(true)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Reglas"
          >
            <HelpCircle size={16} />
          </button>
        </div>
      </header>

      {/* Contenedor del Canvas de Juego */}
      <main className="relative w-full max-w-[640px] aspect-[16/10] bg-[#05070d] rounded-2xl border-2 border-slate-700 shadow-2xl overflow-hidden touch-none cursor-ns-resize">
        <canvas
          ref={canvasRef}
          width={WIDTH}
          height={HEIGHT}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          className="w-full h-full block"
        />

        {/* Modal de Pausa */}
        {isPaused && !isGameOver && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-20">
            <h2 className="text-2xl font-black text-amber-400 font-mono tracking-wider">
              PARTIDA EN PAUSA
            </h2>
            <p className="text-xs text-slate-300">Presiona [P] o [Espacio] para reanudar</p>
            <button
              onClick={() => setIsPaused(false)}
              className="mt-2 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm shadow-lg transition-all"
            >
              Reanudar
            </button>
          </div>
        )}

        {/* Modal de Fin de Partida */}
        {isGameOver && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center gap-3 z-30 animate-in fade-in">
            <Trophy size={42} className="text-amber-400 animate-bounce" />
            <h2 className="text-2xl font-black font-mono tracking-widest text-white">
              {gameMode === '1P'
                ? winner === 'p1'
                  ? '¡VICTORIA ARROLLADORA!'
                  : 'DERROTA ANTE LA IA'
                : winner === 'p1'
                ? '¡JUGADOR 1 GANA!'
                : '¡JUGADOR 2 GANA!'}
            </h2>
            <p className="text-slate-300 text-sm font-mono">
              Resultado final: <strong className="text-white text-lg">{score1}</strong> —{' '}
              <strong className="text-white text-lg">{score2}</strong>
            </p>
            <p className="text-xs text-emerald-400 font-mono">
              Peloteo más largo de la partida: {maxRally} golpes
            </p>
            <button
              onClick={restartGame}
              className="mt-3 flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white hover:bg-slate-200 text-black font-black text-sm shadow-xl transition-all"
            >
              <RotateCcw size={15} /> Jugar Otra Partida
            </button>
          </div>
        )}
      </main>

      {/* Controles Auxiliares para Móviles */}
      <div className="w-full max-w-[640px] flex items-center justify-between gap-4 mt-3 px-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400">Objetivo:</span>
          {[5, 7, 11].map((pts) => (
            <button
              key={pts}
              onClick={() => {
                setTargetScore(pts);
                restartGame();
              }}
              className={`text-xs font-bold px-2 py-1 rounded ${
                targetScore === pts
                  ? 'bg-slate-200 text-black'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {pts} pts
            </button>
          ))}
        </div>

        {/* Botón de reinicio rápido */}
        <button
          onClick={restartGame}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-lg transition-colors"
        >
          <RotateCcw size={13} /> Reiniciar
        </button>
      </div>

      {/* Instrucciones de control */}
      <footer className="w-full max-w-[640px] text-center text-[11px] text-slate-400 mt-2.5 leading-relaxed">
        ⌨️ <strong>Teclado:</strong> J1: [W / S] · J2 (2P): [Flecha Arriba / Abajo] · [Espacio/P]: Pausa · 🖱️ <strong>Ratón:</strong> Mueve el cursor arriba/abajo sobre la pantalla · 📱 <strong>Táctil:</strong> Desliza el dedo verticalmente.
      </footer>

      {/* Modal de Reglas */}
      {showHelp && (
        <div
          className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setShowHelp(false)}
        >
          <div
            className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl text-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-black text-white mb-2 font-mono flex items-center gap-2">
              🏓 Reglas de Tenis Retro 1972
            </h3>
            <ul className="text-xs space-y-2 text-slate-300 list-disc pl-4 mb-5 leading-relaxed">
              <li>
                <strong>Física Angular:</strong> La pelota rebota con mayor ángulo hacia arriba o abajo si impacta en los extremos de la pala. Golpear en el centro produce un tiro directo y rápido.
              </li>
              <li>
                <strong>Aceleración por Peloteo:</strong> Cada devolución incrementa ligeramente la velocidad de la bola, aumentando la tensión dramática del punto.
              </li>
              <li>
                <strong>Modos:</strong> Juega en solitario contra la IA (3 dificultades) o reta a un amigo en local compartiendo teclado o pantalla táctil.
              </li>
              <li>
                <strong>Paletas Retro:</strong> Alterna entre el clásico blanco y negro de 1972, fósforo verde, fósforo ámbar o ciber neón.
              </li>
            </ul>
            <button
              onClick={() => setShowHelp(false)}
              className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-200 text-black font-extrabold text-xs transition-colors"
            >
              ¡Entendido, a jugar!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
