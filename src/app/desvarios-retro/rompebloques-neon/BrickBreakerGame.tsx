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
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  stuckToPaddle?: boolean;
  stuckOffset?: number;
}

interface Brick {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  hits: number;
  maxHits: number;
  points: number;
  powerUp?: 'expand' | 'multiball' | 'laser' | 'shield' | 'slow' | 'life';
  isUnbreakable?: boolean;
}

interface PowerUpItem {
  x: number;
  y: number;
  vy: number;
  type: 'expand' | 'multiball' | 'laser' | 'shield' | 'slow' | 'life';
  symbol: string;
  color: string;
}

interface Bullet {
  x: number;
  y: number;
  vy: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  size: number;
}

const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 480;

const LEVEL_CONFIGS = [
  // Nivel 1: El Muro Inicial
  {
    name: 'Nivel 1 — El Muro Inicial',
    rows: 5,
    cols: 10,
    layout: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // Magenta (3 hits)
      [2, 2, 2, 2, 2, 2, 2, 2, 2, 2], // Naranja (2 hits)
      [3, 3, 3, 3, 3, 3, 3, 3, 3, 3], // Amarillo (1 hit)
      [4, 4, 4, 4, 4, 4, 4, 4, 4, 4], // Verde (1 hit)
      [5, 5, 5, 5, 5, 5, 5, 5, 5, 5], // Cyan (1 hit)
    ],
  },
  // Nivel 2: La Fortaleza Piramidal
  {
    name: 'Nivel 2 — Fortaleza Piramidal',
    rows: 6,
    cols: 10,
    layout: [
      [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
      [0, 0, 0, 2, 1, 1, 2, 0, 0, 0],
      [0, 0, 3, 2, 2, 2, 2, 3, 0, 0],
      [0, 4, 3, 3, 3, 3, 3, 3, 4, 0],
      [5, 4, 4, 4, 4, 4, 4, 4, 4, 5],
      [5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    ],
  },
  // Nivel 3: El Núcleo de Titanes
  {
    name: 'Nivel 3 — Núcleo de Titanes',
    rows: 7,
    cols: 10,
    layout: [
      [1, 9, 1, 1, 9, 9, 1, 1, 9, 1], // 9 = indestructible
      [2, 2, 9, 2, 2, 2, 2, 9, 2, 2],
      [3, 3, 3, 9, 3, 3, 9, 3, 3, 3],
      [4, 4, 4, 4, 9, 9, 4, 4, 4, 4],
      [5, 9, 5, 5, 5, 5, 5, 5, 9, 5],
      [0, 5, 5, 0, 0, 0, 0, 5, 5, 0],
      [0, 0, 5, 5, 0, 0, 5, 5, 0, 0],
    ],
  },
];

export default function BrickBreakerGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Estados reactivos de juego
  const [gameState, setGameState] = useState<'start' | 'playing' | 'paused' | 'game_over' | 'victory'>('start');
  const [levelIndex, setLevelIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [activeShield, setActiveShield] = useState<boolean>(false);
  const [hasLaser, setHasLaser] = useState<boolean>(false);

  // Referencias mutables para el ciclo de animación a 60 FPS
  const paddleRef = useRef({
    x: (CANVAS_WIDTH - 90) / 2,
    y: CANVAS_HEIGHT - 28,
    width: 90,
    height: 12,
    speed: 8,
    hasLaser: false,
  });

  const ballsRef = useRef<Ball[]>([]);
  const bricksRef = useRef<Brick[]>([]);
  const powerUpsRef = useRef<PowerUpItem[]>([]);
  const bulletsRef = useRef<Bullet[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const keysRef = useRef<{ left: boolean; right: boolean; space: boolean; mouseDown: boolean }>({
    left: false,
    right: false,
    space: false,
    mouseDown: false,
  });

  const audioCtxRef = useRef<AudioContext | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const laserCooldownRef = useRef<number>(0);

  // Cargar récord
  useEffect(() => {
    try {
      const saved = localStorage.getItem('rompebloques_high_score');
      if (saved) setHighScore(parseInt(saved, 10));
    } catch {}
  }, []);

  // Sintetizador de audio 8-bit
  const playSound = useCallback(
    (type: 'bounce' | 'paddle' | 'brick' | 'powerup' | 'laser' | 'lose' | 'win') => {
      if (!soundEnabled) return;
      try {
        const AudioCtxClass =
          window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioCtxClass();
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

        if (type === 'bounce') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(440, now);
          osc.frequency.exponentialRampToValueAtTime(220, now + 0.04);
          gain.gain.setValueAtTime(0.1, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
          osc.start(now);
          osc.stop(now + 0.04);
        } else if (type === 'paddle') {
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(320, now);
          osc.frequency.exponentialRampToValueAtTime(540, now + 0.06);
          gain.gain.setValueAtTime(0.15, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
          osc.start(now);
          osc.stop(now + 0.06);
        } else if (type === 'brick') {
          osc.type = 'square';
          osc.frequency.setValueAtTime(520, now);
          osc.frequency.exponentialRampToValueAtTime(780, now + 0.05);
          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
          osc.start(now);
          osc.stop(now + 0.05);
        } else if (type === 'powerup') {
          const notes = [440, 554.37, 659.25, 880];
          notes.forEach((freq, idx) => {
            const nOsc = ctx.createOscillator();
            const nGain = ctx.createGain();
            nOsc.type = 'triangle';
            nOsc.frequency.setValueAtTime(freq, now + idx * 0.06);
            nGain.gain.setValueAtTime(0.18, now + idx * 0.06);
            nGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.15);
            nOsc.connect(nGain);
            nGain.connect(ctx.destination);
            nOsc.start(now + idx * 0.06);
            nOsc.stop(now + idx * 0.06 + 0.15);
          });
        } else if (type === 'laser') {
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(900, now);
          osc.frequency.exponentialRampToValueAtTime(250, now + 0.08);
          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
          osc.start(now);
          osc.stop(now + 0.08);
        } else if (type === 'lose') {
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(350, now);
          osc.frequency.exponentialRampToValueAtTime(80, now + 0.3);
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
          osc.start(now);
          osc.stop(now + 0.3);
        } else if (type === 'win') {
          const notes = [523.25, 659.25, 783.99, 1046.5];
          notes.forEach((freq, idx) => {
            const nOsc = ctx.createOscillator();
            const nGain = ctx.createGain();
            nOsc.type = 'triangle';
            nOsc.frequency.setValueAtTime(freq, now + idx * 0.09);
            nGain.gain.setValueAtTime(0.2, now + idx * 0.09);
            nGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.22);
            nOsc.connect(nGain);
            nGain.connect(ctx.destination);
            nOsc.start(now + idx * 0.09);
            nOsc.stop(now + idx * 0.09 + 0.22);
          });
        }
      } catch {}
    },
    [soundEnabled]
  );

  // Inicializar nivel
  const initLevel = useCallback((lvlIndex: number) => {
    const config = LEVEL_CONFIGS[lvlIndex % LEVEL_CONFIGS.length];
    const brickWidth = 56;
    const brickHeight = 18;
    const paddingX = 7;
    const paddingY = 7;
    const offsetX = (CANVAS_WIDTH - (config.cols * (brickWidth + paddingX) - paddingX)) / 2;
    const offsetY = 50;

    const newBricks: Brick[] = [];
    const possiblePowerUps: ('expand' | 'multiball' | 'laser' | 'shield' | 'slow' | 'life')[] = [
      'expand',
      'multiball',
      'laser',
      'shield',
      'slow',
      'life',
    ];

    for (let r = 0; r < config.rows; r++) {
      for (let c = 0; c < config.cols; c++) {
        const type = config.layout[r][c];
        if (type === 0) continue;

        let color = '#38bdf8';
        let hits = 1;
        let points = 10;
        let isUnbreakable = false;

        if (type === 1) {
          color = '#ec4899'; // Magenta
          hits = 3;
          points = 80;
        } else if (type === 2) {
          color = '#fb923c'; // Naranja
          hits = 2;
          points = 50;
        } else if (type === 3) {
          color = '#facc15'; // Amarillo
          hits = 1;
          points = 30;
        } else if (type === 4) {
          color = '#4ade80'; // Verde
          hits = 1;
          points = 20;
        } else if (type === 5) {
          color = '#38bdf8'; // Cyan
          hits = 1;
          points = 10;
        } else if (type === 9) {
          color = '#94a3b8'; // Titanio indestructible
          hits = 999;
          points = 0;
          isUnbreakable = true;
        }

        let powerUp: Brick['powerUp'];
        if (!isUnbreakable && Math.random() < 0.22) {
          powerUp = possiblePowerUps[Math.floor(Math.random() * possiblePowerUps.length)];
        }

        newBricks.push({
          x: offsetX + c * (brickWidth + paddingX),
          y: offsetY + r * (brickHeight + paddingY),
          width: brickWidth,
          height: brickHeight,
          color,
          hits,
          maxHits: hits,
          points,
          powerUp,
          isUnbreakable,
        });
      }
    }

    bricksRef.current = newBricks;

    paddleRef.current = {
      x: (CANVAS_WIDTH - 90) / 2,
      y: CANVAS_HEIGHT - 28,
      width: 90,
      height: 12,
      speed: 8,
      hasLaser: false,
    };
    setHasLaser(false);

    ballsRef.current = [
      {
        x: CANVAS_WIDTH / 2,
        y: CANVAS_HEIGHT - 40,
        vx: 4 * (Math.random() > 0.5 ? 1 : -1),
        vy: -5,
        radius: 6,
        stuckToPaddle: true,
        stuckOffset: 0,
      },
    ];

    powerUpsRef.current = [];
    bulletsRef.current = [];
    particlesRef.current = [];
    setActiveShield(false);
  }, []);

  // Iniciar / Reiniciar juego completo
  const startNewGame = useCallback(() => {
    setLevelIndex(0);
    setScore(0);
    setLives(3);
    initLevel(0);
    setGameState('start');
  }, [initLevel]);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  // Manejo de teclado y ventana
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') keysRef.current.left = true;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') keysRef.current.right = true;
      if (e.code === 'Space') {
        e.preventDefault();
        keysRef.current.space = true;
        // Lanzar bola si está pegada
        if (ballsRef.current.some((b) => b.stuckToPaddle)) {
          ballsRef.current.forEach((b) => {
            b.stuckToPaddle = false;
          });
          setGameState('playing');
        }
      }
      if (e.code === 'KeyP') {
        setGameState((st) => (st === 'playing' ? 'paused' : st === 'paused' ? 'playing' : st));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') keysRef.current.left = false;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') keysRef.current.right = false;
      if (e.code === 'Space') keysRef.current.space = false;
    };

    const handleWindowMouseUp = () => {
      keysRef.current.mouseDown = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mouseup', handleWindowMouseUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mouseup', handleWindowMouseUp);
    };
  }, []);

  // Disparar láser
  const shootLaser = useCallback(() => {
    if (!paddleRef.current.hasLaser) return;
    const p = paddleRef.current;
    bulletsRef.current.push({ x: p.x + 8, y: p.y - 4, vy: -7 });
    bulletsRef.current.push({ x: p.x + p.width - 8, y: p.y - 4, vy: -7 });
    playSound('laser');
  }, [playSound]);

  // Generar partículas de explosión de bloque
  const createExplosion = (x: number, y: number, color: string) => {
    for (let i = 0; i < 8; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3 + 1;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        alpha: 1,
        size: Math.random() * 3 + 2,
      });
    }
  };

  // Activar Power-Up al recogerlo
  const applyPowerUp = (type: PowerUpItem['type']) => {
    playSound('powerup');
    const paddle = paddleRef.current;

    if (type === 'expand') {
      paddle.width = 130;
      setTimeout(() => {
        paddle.width = 90;
      }, 10000);
    } else if (type === 'multiball') {
      const existing = ballsRef.current[0] || {
        x: paddle.x + paddle.width / 2,
        y: paddle.y - 10,
        vx: 4,
        vy: -5,
        radius: 6,
      };
      ballsRef.current.push(
        { x: existing.x, y: existing.y, vx: existing.vx - 2, vy: existing.vy, radius: 6 },
        { x: existing.x, y: existing.y, vx: existing.vx + 2, vy: existing.vy, radius: 6 }
      );
    } else if (type === 'laser') {
      paddle.hasLaser = true;
      setHasLaser(true);
      setTimeout(() => {
        paddle.hasLaser = false;
        setHasLaser(false);
      }, 9000);
    } else if (type === 'shield') {
      setActiveShield(true);
    } else if (type === 'slow') {
      ballsRef.current.forEach((b) => {
        b.vx *= 0.7;
        b.vy *= 0.7;
      });
    } else if (type === 'life') {
      setLives((l) => Math.min(5, l + 1));
    }
  };

  // Ciclo principal del juego
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let localScore = score;

    const gameLoop = () => {
      const paddle = paddleRef.current;
      const balls = ballsRef.current;
      const bricks = bricksRef.current;
      const powerUps = powerUpsRef.current;
      const bullets = bulletsRef.current;
      const particles = particlesRef.current;

      // 1. ACTUALIZAR FÍSICAS
      if (gameState === 'playing' || gameState === 'start') {
        if (keysRef.current.left) paddle.x = Math.max(0, paddle.x - paddle.speed);
        if (keysRef.current.right) paddle.x = Math.min(CANVAS_WIDTH - paddle.width, paddle.x + paddle.speed);

        // Disparo láser continuo (Espacio o manteniendo pulsado ratón)
        if (paddle.hasLaser && (keysRef.current.space || keysRef.current.mouseDown)) {
          if (laserCooldownRef.current <= 0) {
            shootLaser();
            laserCooldownRef.current = 14; // frames
          }
        }
        if (laserCooldownRef.current > 0) laserCooldownRef.current--;

        // Movimiento de balas láser
        for (let i = bullets.length - 1; i >= 0; i--) {
          const b = bullets[i];
          b.y += b.vy;
          if (b.y < 0) {
            bullets.splice(i, 1);
            continue;
          }

          // Impacto bala con ladrillo
          for (let j = bricks.length - 1; j >= 0; j--) {
            const brick = bricks[j];
            if (
              b.x >= brick.x &&
              b.x <= brick.x + brick.width &&
              b.y >= brick.y &&
              b.y <= brick.y + brick.height
            ) {
              bullets.splice(i, 1);
              if (!brick.isUnbreakable) {
                brick.hits--;
                if (brick.hits <= 0) {
                  localScore += brick.points;
                  setScore(localScore);
                  createExplosion(brick.x + brick.width / 2, brick.y + brick.height / 2, brick.color);
                  if (brick.powerUp) {
                    spawnPowerUp(brick.x + brick.width / 2, brick.y + brick.height / 2, brick.powerUp);
                  }
                  bricks.splice(j, 1);
                }
              }
              break;
            }
          }
        }

        // Movimiento de bolas
        for (let i = balls.length - 1; i >= 0; i--) {
          const ball = balls[i];

          if (ball.stuckToPaddle) {
            ball.x = paddle.x + paddle.width / 2 + (ball.stuckOffset || 0);
            ball.y = paddle.y - ball.radius;
            continue;
          }

          ball.x += ball.vx;
          ball.y += ball.vy;

          // Rebote paredes laterales
          if (ball.x - ball.radius < 0) {
            ball.x = ball.radius;
            ball.vx = Math.abs(ball.vx);
            playSound('bounce');
          } else if (ball.x + ball.radius > CANVAS_WIDTH) {
            ball.x = CANVAS_WIDTH - ball.radius;
            ball.vx = -Math.abs(ball.vx);
            playSound('bounce');
          }

          // Rebote techo
          if (ball.y - ball.radius < 0) {
            ball.y = ball.radius;
            ball.vy = Math.abs(ball.vy);
            playSound('bounce');
          }

          // Rebote con la pala
          if (
            ball.y + ball.radius >= paddle.y &&
            ball.y - ball.radius <= paddle.y + paddle.height &&
            ball.x >= paddle.x - ball.radius &&
            ball.x <= paddle.x + paddle.width + ball.radius &&
            ball.vy > 0
          ) {
            const hitPos = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
            const speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
            const maxAngle = Math.PI / 2.7;
            const angle = hitPos * maxAngle;

            ball.vx = Math.sin(angle) * speed;
            ball.vy = -Math.cos(angle) * speed;
            ball.y = paddle.y - ball.radius;
            playSound('paddle');
          }

          // Colisión con ladrillos
          for (let j = bricks.length - 1; j >= 0; j--) {
            const brick = bricks[j];
            if (
              ball.x + ball.radius >= brick.x &&
              ball.x - ball.radius <= brick.x + brick.width &&
              ball.y + ball.radius >= brick.y &&
              ball.y - ball.radius <= brick.y + brick.height
            ) {
              const overlapLeft = ball.x + ball.radius - brick.x;
              const overlapRight = brick.x + brick.width - (ball.x - ball.radius);
              const overlapTop = ball.y + ball.radius - brick.y;
              const overlapBottom = brick.y + brick.height - (ball.y - ball.radius);

              const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

              if (minOverlap === overlapLeft || minOverlap === overlapRight) {
                ball.vx = -ball.vx;
              } else {
                ball.vy = -ball.vy;
              }

              playSound('brick');

              if (!brick.isUnbreakable) {
                brick.hits--;
                if (brick.hits <= 0) {
                  localScore += brick.points;
                  setScore(localScore);
                  createExplosion(brick.x + brick.width / 2, brick.y + brick.height / 2, brick.color);
                  if (brick.powerUp) {
                    spawnPowerUp(brick.x + brick.width / 2, brick.y + brick.height / 2, brick.powerUp);
                  }
                  bricks.splice(j, 1);
                }
              }
              break;
            }
          }

          // Salida por la parte inferior (Caída de bola)
          if (ball.y - ball.radius > CANVAS_HEIGHT) {
            if (activeShield) {
              ball.y = CANVAS_HEIGHT - ball.radius - 8;
              ball.vy = -Math.abs(ball.vy);
              setActiveShield(false);
              playSound('bounce');
              continue;
            }

            balls.splice(i, 1);
          }
        }

        // Si se quedan sin bolas en pantalla
        if (balls.length === 0 && (gameState === 'playing' || gameState === 'start')) {
          playSound('lose');
          setLives((l) => {
            const nextL = l - 1;
            if (nextL <= 0) {
              setGameState('game_over');
              if (localScore > highScore) {
                setHighScore(localScore);
                try {
                  localStorage.setItem('rompebloques_high_score', localScore.toString());
                } catch {}
              }
            } else {
              ballsRef.current = [
                {
                  x: paddle.x + paddle.width / 2,
                  y: paddle.y - 6,
                  vx: 4 * (Math.random() > 0.5 ? 1 : -1),
                  vy: -5,
                  radius: 6,
                  stuckToPaddle: true,
                  stuckOffset: 0,
                },
              ];
              setGameState('start');
            }
            return nextL;
          });
        }

        // Movimiento de cápsulas de power-up
        for (let i = powerUps.length - 1; i >= 0; i--) {
          const pu = powerUps[i];
          pu.y += pu.vy;

          if (
            pu.y + 10 >= paddle.y &&
            pu.y - 10 <= paddle.y + paddle.height &&
            pu.x + 12 >= paddle.x &&
            pu.x - 12 <= paddle.x + paddle.width
          ) {
            applyPowerUp(pu.type);
            powerUps.splice(i, 1);
            continue;
          }

          if (pu.y > CANVAS_HEIGHT) {
            powerUps.splice(i, 1);
          }
        }

        // Comprobar si se ha limpiado el nivel
        const breakablesLeft = bricks.filter((b) => !b.isUnbreakable).length;
        if (breakablesLeft === 0 && gameState === 'playing') {
          playSound('win');
          try {
            confetti({
              particleCount: 90,
              spread: 80,
              origin: { y: 0.6 },
              colors: ['#ec4899', '#38bdf8', '#fbbf24', '#4ade80', '#ffffff'],
            });
          } catch {}

          if (levelIndex + 1 < LEVEL_CONFIGS.length) {
            const nextLvl = levelIndex + 1;
            setLevelIndex(nextLvl);
            initLevel(nextLvl);
            setGameState('start');
          } else {
            setGameState('victory');
            if (localScore > highScore) {
              setHighScore(localScore);
              try {
                localStorage.setItem('rompebloques_high_score', localScore.toString());
              } catch {}
            }
          }
        }
      }

      // Actualizar partículas
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.025;
        if (p.alpha <= 0) particles.splice(i, 1);
      }

      // 2. RENDERIZAR FRAME EN CANVAS
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      const bgGrad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
      bgGrad.addColorStop(0, '#0a0e17');
      bgGrad.addColorStop(1, '#121824');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
      ctx.lineWidth = 1;
      for (let x = 0; x < CANVAS_WIDTH; x += 32) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, CANVAS_HEIGHT);
        ctx.stroke();
      }
      for (let y = 0; y < CANVAS_HEIGHT; y += 32) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(CANVAS_WIDTH, y);
        ctx.stroke();
      }

      if (activeShield) {
        ctx.fillStyle = 'rgba(6, 182, 212, 0.5)';
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 12;
        ctx.fillRect(0, CANVAS_HEIGHT - 6, CANVAS_WIDTH, 6);
        ctx.shadowBlur = 0;
      }

      // Dibujar Ladrillos
      bricks.forEach((brick) => {
        ctx.fillStyle = brick.color;
        ctx.shadowColor = brick.color;
        ctx.shadowBlur = brick.isUnbreakable ? 2 : 8;

        ctx.beginPath();
        ctx.roundRect(brick.x, brick.y, brick.width, brick.height, 3);
        ctx.fill();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.fillRect(brick.x + 2, brick.y + 2, brick.width - 4, 3);

        if (brick.hits > 1 && !brick.isUnbreakable) {
          ctx.fillStyle = '#fff';
          ctx.font = 'bold 10px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(`${brick.hits}`, brick.x + brick.width / 2, brick.y + brick.height / 2 + 3);
        }
      });
      ctx.shadowBlur = 0;

      // Dibujar Cápsulas de Power-Up
      powerUps.forEach((pu) => {
        ctx.fillStyle = pu.color;
        ctx.shadowColor = pu.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.roundRect(pu.x - 12, pu.y - 7, 24, 14, 7);
        ctx.fill();

        ctx.fillStyle = '#000';
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(pu.symbol, pu.x, pu.y + 3);
      });
      ctx.shadowBlur = 0;

      // Dibujar Balas Láser
      bullets.forEach((b) => {
        ctx.fillStyle = '#f43f5e';
        ctx.shadowColor = '#f43f5e';
        ctx.shadowBlur = 8;
        ctx.fillRect(b.x - 2, b.y, 4, 10);
      });
      ctx.shadowBlur = 0;

      // Dibujar Pala
      ctx.fillStyle = paddle.hasLaser ? '#f43f5e' : '#ec4899';
      ctx.shadowColor = paddle.hasLaser ? '#f43f5e' : '#ec4899';
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.roundRect(paddle.x, paddle.y, paddle.width, paddle.height, 6);
      ctx.fill();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.fillRect(paddle.x + 6, paddle.y + 2, paddle.width - 12, 3);

      if (paddle.hasLaser) {
        ctx.fillStyle = '#fff';
        ctx.fillRect(paddle.x + 4, paddle.y - 3, 4, 4);
        ctx.fillRect(paddle.x + paddle.width - 8, paddle.y - 3, 4, 4);
      }
      ctx.shadowBlur = 0;

      // Dibujar Bolas
      balls.forEach((ball) => {
        ctx.fillStyle = '#fff';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.shadowBlur = 0;

      // Dibujar Partículas
      particles.forEach((p) => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      animFrameIdRef.current = requestAnimationFrame(gameLoop);
    };

    animFrameIdRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [gameState, levelIndex, score, highScore, activeShield, applyPowerUp, playSound, shootLaser]);

  const spawnPowerUp = (x: number, y: number, type: Brick['powerUp']) => {
    if (!type) return;
    const metaMap = {
      expand: { symbol: '⚡', color: '#38bdf8' },
      multiball: { symbol: '🎾', color: '#4ade80' },
      laser: { symbol: '🔫', color: '#f43f5e' },
      shield: { symbol: '🛡️', color: '#06b6d4' },
      slow: { symbol: '🐌', color: '#facc15' },
      life: { symbol: '❤️', color: '#ec4899' },
    };
    const meta = metaMap[type];
    powerUpsRef.current.push({
      x,
      y,
      vy: 2.2,
      type,
      symbol: meta.symbol,
      color: meta.color,
    });
  };

  // Manejo de ratón y táctil en Canvas
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const mouseX = (e.clientX - rect.left) * scaleX;
    paddleRef.current.x = Math.max(0, Math.min(CANVAS_WIDTH - paddleRef.current.width, mouseX - paddleRef.current.width / 2));
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || e.touches.length === 0) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const touchX = (e.touches[0].clientX - rect.left) * scaleX;
    paddleRef.current.x = Math.max(0, Math.min(CANVAS_WIDTH - paddleRef.current.width, touchX - paddleRef.current.width / 2));
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button !== 0) return;
    keysRef.current.mouseDown = true;

    if (ballsRef.current.some((b) => b.stuckToPaddle)) {
      ballsRef.current.forEach((b) => {
        b.stuckToPaddle = false;
      });
      setGameState('playing');
    } else if (paddleRef.current.hasLaser) {
      if (laserCooldownRef.current <= 0) {
        shootLaser();
        laserCooldownRef.current = 14;
      }
    }
  };

  const handleCanvasMouseUp = () => {
    keysRef.current.mouseDown = false;
  };

  const handleCanvasTouchStart = () => {
    if (ballsRef.current.some((b) => b.stuckToPaddle)) {
      ballsRef.current.forEach((b) => {
        b.stuckToPaddle = false;
      });
      setGameState('playing');
    } else if (paddleRef.current.hasLaser) {
      if (laserCooldownRef.current <= 0) {
        shootLaser();
        laserCooldownRef.current = 14;
      }
    }
  };

  const handleLaunchBall = () => {
    if (ballsRef.current.some((b) => b.stuckToPaddle)) {
      ballsRef.current.forEach((b) => {
        b.stuckToPaddle = false;
      });
      setGameState('playing');
    } else if (paddleRef.current.hasLaser) {
      if (laserCooldownRef.current <= 0) {
        shootLaser();
        laserCooldownRef.current = 14;
      }
    }
  };

  return (
    <div className="home-container" style={{ maxWidth: '920px', margin: '0 auto', paddingBottom: '4rem' }}>
      {/* Breadcrumb */}
      <div className="breadcrumb-nav" style={{ marginBottom: '1.25rem' }}>
        <Link href="/desvarios-retro" className="breadcrumb-link">
          <ArrowLeft size={16} />
          <span>Volver a Desvaríos Retro</span>
        </Link>
      </div>

      {/* Header */}
      <header className="hero-section" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 0.9rem',
            background: 'rgba(236, 72, 153, 0.12)',
            border: '1px solid rgba(236, 72, 153, 0.35)',
            borderRadius: '9999px',
            color: '#ec4899',
            fontSize: '0.82rem',
            fontWeight: 700,
            marginBottom: '0.75rem',
          }}
        >
          <span>🧱</span>
          <span>Acción Arcade Rompebloques Neón</span>
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-title), serif',
            fontSize: 'clamp(2rem, 4vw, 2.75rem)',
            fontWeight: 900,
            letterSpacing: '0.04em',
            marginBottom: '0.5rem',
            background: 'linear-gradient(135deg, #fff 40%, #ec4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Rompebloques Neón
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '580px', margin: '0 auto' }}>
          Destruye los ladrillos cósmicos, recolecta cápsulas de energía y supera las 3 fases sin perder tus esferas de plasma.
        </p>
      </header>

      {/* Controls Bar: Vidas, Nivel, Puntos, Récord y Audio */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          marginBottom: '1rem',
          padding: '0.75rem 1.25rem',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
        }}
      >
        {/* Vidas & Nivel */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }} title={`${lives} vidas restantes`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                style={{
                  fontSize: '1.15rem',
                  opacity: i < lives ? 1 : 0.2,
                  filter: i < lives ? 'drop-shadow(0 0 6px rgba(236,72,153,0.7))' : 'none',
                }}
              >
                ❤️
              </span>
            ))}
          </div>

          <div
            style={{
              fontSize: '0.85rem',
              fontWeight: 800,
              color: '#38bdf8',
              background: 'rgba(56, 189, 248, 0.12)',
              padding: '0.25rem 0.65rem',
              borderRadius: '6px',
              border: '1px solid rgba(56, 189, 248, 0.3)',
            }}
          >
            {LEVEL_CONFIGS[levelIndex]?.name || 'Nivel 1'}
          </div>
        </div>

        {/* Puntuación y Récord */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>PUNTOS</div>
            <div style={{ fontFamily: 'monospace', fontSize: '1.25rem', fontWeight: 900, color: '#ec4899' }}>
              {String(score).padStart(5, '0')}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>RÉCORD</div>
            <div style={{ fontFamily: 'monospace', fontSize: '1.25rem', fontWeight: 900, color: '#fbbf24' }}>
              {String(highScore).padStart(5, '0')}
            </div>
          </div>

          <button
            onClick={() => setSoundEnabled((s) => !s)}
            style={{
              padding: '0.45rem 0.75rem',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.15)',
              background: soundEnabled ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.05)',
              color: soundEnabled ? '#34d399' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.82rem',
              fontWeight: 600,
            }}
          >
            {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
            <span>{soundEnabled ? 'Sonido' : 'Mute'}</span>
          </button>
        </div>
      </div>

      {/* Canvas Arcade Cabinet Frame */}
      <div
        style={{
          position: 'relative',
          margin: '0 auto',
          padding: '12px',
          borderRadius: '16px',
          background: 'linear-gradient(180deg, #181c24 0%, #0d1117 100%)',
          border: '2px solid rgba(236, 72, 153, 0.35)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6), 0 0 35px rgba(236, 72, 153, 0.15)',
          maxWidth: '664px',
        }}
      >
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          onMouseDown={handleCanvasMouseDown}
          onMouseUp={handleCanvasMouseUp}
          onTouchStart={handleCanvasTouchStart}
          onClick={handleLaunchBall}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          style={{
            display: 'block',
            width: '100%',
            height: 'auto',
            borderRadius: '10px',
            border: '2px solid #232b3b',
            cursor: 'crosshair',
            touchAction: 'none',
          }}
        />

        {/* Start / Launch Prompt Overlay */}
        {gameState === 'start' && (
          <div
            onClick={handleLaunchBall}
            style={{
              position: 'absolute',
              top: '60%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'rgba(11, 15, 25, 0.85)',
              border: '1.5px solid #38bdf8',
              borderRadius: '12px',
              padding: '0.85rem 1.5rem',
              color: '#38bdf8',
              fontWeight: 800,
              fontSize: '0.95rem',
              cursor: 'pointer',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 0 25px rgba(56, 189, 248, 0.4)',
              textAlign: 'center',
            }}
          >
            🚀 Haz clic o pulsa [Espacio] para lanzar la bola
          </div>
        )}

        {/* Game Over Overlay */}
        {gameState === 'game_over' && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'rgba(15, 10, 20, 0.92)',
              border: '2px solid #ef4444',
              borderRadius: '16px',
              padding: '1.5rem 2rem',
              textAlign: 'center',
              color: '#fff',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 0 40px rgba(239, 68, 68, 0.4)',
              maxWidth: '380px',
              width: '90%',
            }}
          >
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#f87171', marginBottom: '0.4rem' }}>
              💥 GAME OVER
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Puntuación final: <strong>{score} puntos</strong>
            </p>
            <button
              onClick={startNewGame}
              className="btn-primary"
              style={{
                background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
                color: '#fff',
                padding: '0.65rem 1.4rem',
              }}
            >
              <RotateCcw size={16} />
              <span>Jugar de nuevo</span>
            </button>
          </div>
        )}

        {/* Victory Overlay */}
        {gameState === 'victory' && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'rgba(10, 25, 20, 0.92)',
              border: '2px solid #10b981',
              borderRadius: '16px',
              padding: '1.5rem 2rem',
              textAlign: 'center',
              color: '#fff',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 0 40px rgba(16, 185, 129, 0.4)',
              maxWidth: '380px',
              width: '90%',
            }}
          >
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#34d399', marginBottom: '0.4rem' }}>
              🏆 ¡VICTORIA ABSOLUTA!
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Has demolido todas las barreras de los 3 niveles con <strong>{score} puntos</strong>.
            </p>
            <button
              onClick={startNewGame}
              className="btn-primary"
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#fff',
                padding: '0.65rem 1.4rem',
              }}
            >
              <RotateCcw size={16} />
              <span>Jugar de nuevo</span>
            </button>
          </div>
        )}
      </div>

      {/* Mobile Virtual Buttons */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          marginTop: '1rem',
          maxWidth: '664px',
          margin: '1rem auto 0',
        }}
      >
        <button
          type="button"
          onClick={handleLaunchBall}
          style={{
            flex: 1,
            padding: '0.6rem 1rem',
            borderRadius: '8px',
            background: 'rgba(56, 189, 248, 0.15)',
            border: '1.5px solid rgba(56, 189, 248, 0.4)',
            color: '#38bdf8',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
          }}
        >
          🚀 Lanzar Bola
        </button>

        {hasLaser && (
          <button
            type="button"
            onClick={shootLaser}
            style={{
              flex: 1,
              padding: '0.6rem 1rem',
              borderRadius: '8px',
              background: 'rgba(244, 63, 94, 0.2)',
              border: '1.5px solid #f43f5e',
              color: '#f43f5e',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer',
              boxShadow: '0 0 15px rgba(244, 63, 94, 0.4)',
            }}
          >
            🔫 Disparar Láser
          </button>
        )}
      </div>

      {/* Guide & Power-ups Legend */}
      <section
        style={{
          marginTop: '2.5rem',
          padding: '1.5rem',
          borderRadius: '12px',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <h3
          style={{
            fontSize: '1.1rem',
            fontWeight: 800,
            marginBottom: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            color: '#ec4899',
          }}
        >
          <HelpCircle size={18} />
          <span>Cápsulas de Energía y Power-Ups</span>
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
            fontSize: '0.86rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
          }}
        >
          <div>
            <strong style={{ color: '#38bdf8' }}>⚡ Pala Ancha:</strong> Duplica el tamaño de tu pala para una defensa casi infranqueable.
          </div>
          <div>
            <strong style={{ color: '#4ade80' }}>🎾 Multibola:</strong> Genera dos bolas extra simultáneas para multiplicar tu poder de destrucción.
          </div>
          <div>
            <strong style={{ color: '#f43f5e' }}>🔫 Láser:</strong> Equipa cañones a la pala para disparar y reventar ladrillos con clic, toque o barra espaciadora.
          </div>
          <div>
            <strong style={{ color: '#06b6d4' }}>🛡️ Barrera Plasma:</strong> Levanta un suelo de energía que salva una bola caída.
          </div>
        </div>
      </section>
    </div>
  );
}
