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
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #05070d 0%, #0b1120 100%)',
        color: '#f8fafc',
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        padding: '1.25rem 1rem 3.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        userSelect: 'none',
      }}
    >
      {/* 1. Barra Superior de Navegación y Acciones Rápidas */}
      <div
        style={{
          width: '100%',
          maxWidth: '640px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.85rem',
        }}
      >
        <Link
          href="/desvarios-retro"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            color: '#94a3b8',
            textDecoration: 'none',
            fontSize: '0.85rem',
            fontWeight: 700,
            padding: '0.45rem 0.85rem',
            borderRadius: '10px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            transition: 'all 0.2s',
          }}
        >
          <ArrowLeft size={16} /> Volver a Arcade
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Botón Silenciar/Sonido */}
          <button
            onClick={() => setSoundEnabled((s) => !s)}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              color: soundEnabled ? '#38bdf8' : '#64748b',
              padding: '0.45rem 0.6rem',
              borderRadius: '9px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title={soundEnabled ? 'Silenciar sonido' : 'Activar sonido'}
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>

          {/* Botón Pausa */}
          <button
            onClick={() => setIsPaused((p) => !p)}
            style={{
              background: isPaused ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.06)',
              border: isPaused ? '1px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.14)',
              color: isPaused ? '#facc15' : '#cbd5e1',
              padding: '0.45rem 0.75rem',
              borderRadius: '9px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.82rem',
              fontWeight: 700,
            }}
            title="Pausar partida"
          >
            {isPaused ? <Play size={16} /> : <Pause size={16} />}
            <span>{isPaused ? 'Reanudar' : 'Pausa'}</span>
          </button>

          {/* Botón Ayuda */}
          <button
            onClick={() => setShowHelp(true)}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              color: '#94a3b8',
              padding: '0.45rem 0.6rem',
              borderRadius: '9px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Reglas del juego"
          >
            <HelpCircle size={18} />
          </button>
        </div>
      </div>

      {/* 2. Cabecera del Juego */}
      <div style={{ textAlign: 'center', marginBottom: '0.85rem' }}>
        <h1
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 'clamp(1.6rem, 3.8vw, 2.2rem)',
            fontWeight: 900,
            color: '#f8fafc',
            letterSpacing: '1px',
            marginBottom: '0.2rem',
            textShadow: '0 2px 14px rgba(255, 255, 255, 0.25)',
          }}
        >
          Tenis Retro 1972
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.82rem' }}>
          Duelo de Palas y Pelota a 60 FPS · Física Angular · Sonido Procedural 8-bit
        </p>
      </div>

      {/* 3. Panel de Control y Configuración de Partida */}
      <div
        style={{
          width: '100%',
          maxWidth: '640px',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(148, 163, 184, 0.22)',
          borderRadius: '14px',
          padding: '0.85rem 1rem',
          marginBottom: '0.85rem',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}
      >
        {/* Fila A: Marcador de Peloteo y Récord + Botón Reiniciar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '0.5rem',
            paddingBottom: '0.65rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: '0.88rem',
                fontWeight: 800,
                color: '#4ade80',
                background: 'rgba(34, 197, 94, 0.12)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                padding: '0.25rem 0.6rem',
                borderRadius: '8px',
                letterSpacing: '0.5px',
              }}
            >
              PELOTEO: {rallyCount}
            </span>
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#fbbf24',
                background: 'rgba(245, 158, 11, 0.12)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                padding: '0.25rem 0.55rem',
                borderRadius: '8px',
              }}
            >
              RÉCORD: {maxRally}
            </span>
          </div>

          <button
            onClick={restartGame}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              color: '#f8fafc',
              fontSize: '0.78rem',
              fontWeight: 700,
              padding: '0.35rem 0.75rem',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'all 0.15s',
            }}
            title="Reiniciar saque y partida"
          >
            <RotateCcw size={13} /> Reiniciar
          </button>
        </div>

        {/* Fila B: Selectores de Modo (1P / 2P) y Dificultad (Novato / Arcade / Maestro) */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '0.65rem',
          }}
        >
          {/* Selector de Modo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700 }}>Modo:</span>
            <button
              onClick={() => {
                setGameMode('1P');
                restartGame();
              }}
              style={{
                background: gameMode === '1P' ? '#2563eb' : 'rgba(255, 255, 255, 0.06)',
                border: gameMode === '1P' ? '1px solid #60a5fa' : '1px solid rgba(255, 255, 255, 0.12)',
                color: gameMode === '1P' ? '#ffffff' : '#94a3b8',
                padding: '0.35rem 0.7rem',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                boxShadow: gameMode === '1P' ? '0 0 12px rgba(37, 99, 235, 0.4)' : 'none',
                transition: 'all 0.15s',
              }}
            >
              <User size={13} /> 1 Jugador
            </button>
            <button
              onClick={() => {
                setGameMode('2P');
                restartGame();
              }}
              style={{
                background: gameMode === '2P' ? '#9333ea' : 'rgba(255, 255, 255, 0.06)',
                border: gameMode === '2P' ? '1px solid #c084fc' : '1px solid rgba(255, 255, 255, 0.12)',
                color: gameMode === '2P' ? '#ffffff' : '#94a3b8',
                padding: '0.35rem 0.7rem',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                boxShadow: gameMode === '2P' ? '0 0 12px rgba(147, 51, 234, 0.4)' : 'none',
                transition: 'all 0.15s',
              }}
            >
              <Users size={13} /> 2 Jugadores
            </button>
          </div>

          {/* Selector de Dificultad (Solo en 1P) */}
          {gameMode === '1P' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700 }}>IA:</span>
              {(['novato', 'arcade', 'maestro'] as Difficulty[]).map((d) => {
                const isActive = difficulty === d;
                const colors = {
                  novato: { bg: '#15803d', border: '#4ade80', text: '#ffffff' },
                  arcade: { bg: '#d97706', border: '#fde047', text: '#ffffff' },
                  maestro: { bg: '#dc2626', border: '#f87171', text: '#ffffff' },
                }[d];

                return (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    style={{
                      background: isActive ? colors.bg : 'rgba(255, 255, 255, 0.05)',
                      border: isActive ? `1px solid ${colors.border}` : '1px solid rgba(255, 255, 255, 0.1)',
                      color: isActive ? colors.text : '#94a3b8',
                      padding: '0.3rem 0.6rem',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      textTransform: 'capitalize',
                      boxShadow: isActive ? `0 0 10px ${colors.border}44` : 'none',
                      transition: 'all 0.15s',
                    }}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Fila C: Monitor CRT y Objetivo de Puntos */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '0.65rem',
            paddingTop: '0.4rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          {/* Selector de Monitor CRT */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700 }}>Pantalla:</span>
            <button
              onClick={() => {
                const keys = Object.keys(PALETTES) as Palette[];
                const nextIdx = (keys.indexOf(palette) + 1) % keys.length;
                setPalette(keys[nextIdx]);
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.07)',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                color: '#38bdf8',
                padding: '0.35rem 0.75rem',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                transition: 'all 0.15s',
              }}
              title="Cambiar monitor CRT retro"
            >
              <Monitor size={14} />
              <span>{PALETTES[palette].label}</span>
            </button>
          </div>

          {/* Selector de Puntos Objetivo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700 }}>Meta:</span>
            {[5, 7, 11].map((pts) => {
              const isActive = targetScore === pts;
              return (
                <button
                  key={pts}
                  onClick={() => {
                    setTargetScore(pts);
                    restartGame();
                  }}
                  style={{
                    background: isActive ? '#f8fafc' : 'rgba(255, 255, 255, 0.06)',
                    border: isActive ? '1px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.12)',
                    color: isActive ? '#020617' : '#94a3b8',
                    padding: '0.28rem 0.55rem',
                    borderRadius: '7px',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: isActive ? '0 0 10px rgba(255, 255, 255, 0.4)' : 'none',
                    transition: 'all 0.15s',
                  }}
                >
                  {pts} pts
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Marco del Canvas de Juego */}
      <main
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '640px',
          aspectRatio: '16 / 10',
          background: PALETTES[palette].bg,
          borderRadius: '16px',
          border: '2px solid rgba(148, 163, 184, 0.3)',
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.8), inset 0 0 30px rgba(0, 0, 0, 0.6)',
          overflow: 'hidden',
          touchAction: 'none',
          cursor: 'ns-resize',
        }}
      >
        <canvas
          ref={canvasRef}
          width={WIDTH}
          height={HEIGHT}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          style={{ width: '100%', height: '100%', display: 'block' }}
        />

        {/* Modal de Pausa */}
        {isPaused && !isGameOver && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.82)',
              backdropFilter: 'blur(5px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              zIndex: 20,
              padding: '1.5rem',
              textAlign: 'center',
            }}
          >
            <h2
              style={{
                fontSize: '1.8rem',
                fontWeight: 900,
                color: '#facc15',
                fontFamily: 'monospace',
                letterSpacing: '2px',
              }}
            >
              PARTIDA EN PAUSA
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
              Presiona <strong>[P]</strong> o <strong>[Espacio]</strong> para reanudar
            </p>
            <button
              onClick={() => setIsPaused(false)}
              style={{
                marginTop: '0.5rem',
                background: '#f59e0b',
                color: '#000000',
                fontWeight: 900,
                fontSize: '0.92rem',
                padding: '0.65rem 1.6rem',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 18px rgba(245, 158, 11, 0.5)',
                transition: 'all 0.2s',
              }}
            >
              Reanudar
            </button>
          </div>
        )}

        {/* Modal de Fin de Partida */}
        {isGameOver && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.88)',
              backdropFilter: 'blur(6px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.65rem',
              zIndex: 30,
              padding: '1.5rem',
              textAlign: 'center',
            }}
          >
            <Trophy size={46} color="#fbbf24" style={{ marginBottom: '0.2rem' }} />
            <h2
              style={{
                fontSize: '1.6rem',
                fontWeight: 900,
                fontFamily: 'monospace',
                letterSpacing: '1px',
                color: winner === 'p1' ? '#4ade80' : '#f87171',
              }}
            >
              {gameMode === '1P'
                ? winner === 'p1'
                  ? '¡VICTORIA ARROLLADORA!'
                  : 'DERROTA ANTE LA IA'
                : winner === 'p1'
                ? '¡JUGADOR 1 GANA!'
                : '¡JUGADOR 2 GANA!'}
            </h2>
            <p
              style={{
                fontSize: '1.3rem',
                fontWeight: 900,
                fontFamily: 'monospace',
                color: '#f8fafc',
              }}
            >
              Marcador Final: {score1} — {score2}
            </p>
            <p
              style={{
                fontSize: '0.85rem',
                fontFamily: 'monospace',
                color: '#4ade80',
              }}
            >
              Peloteo más largo de la partida: {maxRally} golpes
            </p>
            <button
              onClick={restartGame}
              style={{
                marginTop: '0.8rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                background: '#ffffff',
                color: '#000000',
                fontWeight: 900,
                fontSize: '0.92rem',
                padding: '0.7rem 1.6rem',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(255, 255, 255, 0.4)',
                transition: 'all 0.2s',
              }}
            >
              <RotateCcw size={16} /> Jugar Otra Partida
            </button>
          </div>
        )}
      </main>

      {/* 5. Instrucciones de Control */}
      <footer
        style={{
          width: '100%',
          maxWidth: '640px',
          marginTop: '0.85rem',
          padding: '0.65rem 0.85rem',
          background: 'rgba(15, 23, 42, 0.65)',
          border: '1px solid rgba(148, 163, 184, 0.15)',
          borderRadius: '10px',
          fontSize: '0.76rem',
          color: '#94a3b8',
          lineHeight: '1.6',
          textAlign: 'center',
        }}
      >
        <div>
          ⌨️ <strong>Teclado:</strong> J1: <code style={{ color: '#38bdf8' }}>[W / S]</code> · J2 (2P): <code style={{ color: '#f43f5e' }}>[↑ / ↓]</code> · <code style={{ color: '#fbbf24' }}>[Espacio / P]</code>: Pausa
        </div>
        <div style={{ marginTop: '0.2rem' }}>
          🖱️ <strong>Ratón:</strong> Desplaza el cursor verticalmente sobre la pantalla · 📱 <strong>Táctil:</strong> Desliza el dedo arriba y abajo
        </div>
      </footer>

      {/* 6. Modal de Ayuda y Reglas */}
      {showHelp && (
        <div
          onClick={() => setShowHelp(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.78)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            zIndex: 100,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '16px',
              maxWidth: '460px',
              width: '100%',
              padding: '1.5rem',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.8)',
              color: '#cbd5e1',
            }}
          >
            <h3
              style={{
                fontSize: '1.2rem',
                fontWeight: 900,
                color: '#ffffff',
                marginBottom: '0.8rem',
                fontFamily: 'monospace',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              🏓 Reglas de Tenis Retro 1972
            </h3>
            <ul
              style={{
                fontSize: '0.82rem',
                lineHeight: '1.6',
                paddingLeft: '1.2rem',
                marginBottom: '1.2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.45rem',
              }}
            >
              <li>
                <strong style={{ color: '#f8fafc' }}>Física Angular:</strong> Golpear con los extremos de la pala desvía la bola en ángulo agudo; el centro produce un tiro directo y veloz.
              </li>
              <li>
                <strong style={{ color: '#f8fafc' }}>Aceleración por Peloteo:</strong> Cada devolución exitosa aumenta la velocidad de la bola hasta un tope de 13 px/frame.
              </li>
              <li>
                <strong style={{ color: '#f8fafc' }}>Modos:</strong> Juega contra la IA (3 dificultades ajustables) o reta a un amigo en local compartiendo teclado o táctil.
              </li>
              <li>
                <strong style={{ color: '#f8fafc' }}>Monitores CRT:</strong> Elige entre Blanco y Negro 1972, Fósforo Verde, Fósforo Ámbar y Ciber Neón.
              </li>
            </ul>
            <button
              onClick={() => setShowHelp(false)}
              style={{
                width: '100%',
                padding: '0.65rem',
                borderRadius: '10px',
                background: '#ffffff',
                color: '#000000',
                fontWeight: 800,
                fontSize: '0.88rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              ¡Entendido, a jugar!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
