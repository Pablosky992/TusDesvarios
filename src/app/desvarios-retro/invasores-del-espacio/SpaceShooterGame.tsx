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
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Invader {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 0 | 1 | 2; // 0: Comandante (30p), 1: Destructor (20p), 2: Drone (10p)
  points: number;
  color: string;
  alive: boolean;
}

interface Bullet {
  x: number;
  y: number;
  vy: number;
  isEnemy: boolean;
}

interface BunkerBlock {
  x: number;
  y: number;
  width: number;
  height: number;
  hp: number; // 3 max
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

interface MysteryShip {
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  active: boolean;
}

const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 480;

export default function SpaceShooterGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Estados reactivos
  const [gameState, setGameState] = useState<'start' | 'playing' | 'paused' | 'game_over' | 'wave_clear'>('start');
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [wave, setWave] = useState<number>(1);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Referencias para el ciclo a 60 FPS
  const playerRef = useRef({
    x: (CANVAS_WIDTH - 36) / 2,
    y: CANVAS_HEIGHT - 32,
    width: 36,
    height: 18,
    speed: 6.5,
    cooldown: 0,
  });

  const invadersRef = useRef<Invader[]>([]);
  const invaderDirRef = useRef<number>(1);
  const invaderStepTimerRef = useRef<number>(0);
  const invaderAnimFrameRef = useRef<number>(0);
  const marchNoteIndexRef = useRef<number>(0);

  const bulletsRef = useRef<Bullet[]>([]);
  const bunkersRef = useRef<BunkerBlock[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const mysteryShipRef = useRef<MysteryShip>({
    x: -50,
    y: 35,
    width: 44,
    height: 18,
    vx: 2.2,
    active: false,
  });
  const mysterySpawnTimerRef = useRef<number>(0);

  const keysRef = useRef<{ left: boolean; right: boolean; space: boolean; mouseDown: boolean }>({
    left: false,
    right: false,
    space: false,
    mouseDown: false,
  });

  const audioCtxRef = useRef<AudioContext | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Cargar récord
  useEffect(() => {
    try {
      const saved = localStorage.getItem('invasores_high_score');
      if (saved) setHighScore(parseInt(saved, 10));
    } catch {}
  }, []);

  // Sintetizador de audio 8-bit
  const playSound = useCallback(
    (type: 'shoot' | 'invader_hit' | 'player_hit' | 'ufo' | 'march' | 'win' | 'game_over') => {
      if (!soundEnabled) return;
      try {
        const AudioCtxClass =
          window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!audioCtxRef.current) audioCtxRef.current = new AudioCtxClass();
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') ctx.resume();

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        if (type === 'shoot') {
          osc.type = 'square';
          osc.frequency.setValueAtTime(880, now);
          osc.frequency.exponentialRampToValueAtTime(110, now + 0.09);
          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
          osc.start(now);
          osc.stop(now + 0.09);
        } else if (type === 'invader_hit') {
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(320, now);
          osc.frequency.linearRampToValueAtTime(60, now + 0.08);
          gain.gain.setValueAtTime(0.18, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
          osc.start(now);
          osc.stop(now + 0.08);
        } else if (type === 'player_hit') {
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(150, now);
          osc.frequency.exponentialRampToValueAtTime(40, now + 0.35);
          gain.gain.setValueAtTime(0.25, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
          osc.start(now);
          osc.stop(now + 0.35);
        } else if (type === 'march') {
          const notes = [165, 147, 131, 116];
          const freq = notes[marchNoteIndexRef.current % notes.length];
          marchNoteIndexRef.current++;
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now);
          gain.gain.setValueAtTime(0.14, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
          osc.start(now);
          osc.stop(now + 0.06);
        } else if (type === 'ufo') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(580, now);
          osc.frequency.linearRampToValueAtTime(880, now + 0.12);
          gain.gain.setValueAtTime(0.1, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
          osc.start(now);
          osc.stop(now + 0.12);
        } else if (type === 'win') {
          const notes = [440, 554, 659, 880];
          notes.forEach((freq, idx) => {
            const nOsc = ctx.createOscillator();
            const nGain = ctx.createGain();
            nOsc.type = 'triangle';
            nOsc.frequency.setValueAtTime(freq, now + idx * 0.08);
            nGain.gain.setValueAtTime(0.18, now + idx * 0.08);
            nGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.18);
            nOsc.connect(nGain);
            nGain.connect(ctx.destination);
            nOsc.start(now + idx * 0.08);
            nOsc.stop(now + idx * 0.08 + 0.18);
          });
        } else if (type === 'game_over') {
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(260, now);
          osc.frequency.exponentialRampToValueAtTime(65, now + 0.45);
          gain.gain.setValueAtTime(0.25, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
          osc.start(now);
          osc.stop(now + 0.45);
        }
      } catch {}
    },
    [soundEnabled]
  );

  // Inicializar búnkeres de plasma defensivos
  const initBunkers = useCallback(() => {
    const blocks: BunkerBlock[] = [];
    const bunkerCount = 4;
    const bunkerWidth = 48;
    const bunkerHeight = 32;
    const blockRows = 4;
    const blockCols = 6;
    const blockW = bunkerWidth / blockCols;
    const blockH = bunkerHeight / blockRows;

    const spacing = (CANVAS_WIDTH - bunkerCount * bunkerWidth) / (bunkerCount + 1);
    const startY = CANVAS_HEIGHT - 95;

    for (let b = 0; b < bunkerCount; b++) {
      const bx = spacing + b * (bunkerWidth + spacing);
      for (let r = 0; r < blockRows; r++) {
        for (let c = 0; c < blockCols; c++) {
          // Crear forma de cúpula protectora con arco inferior
          if (r === 0 && (c === 0 || c === blockCols - 1)) continue;
          if (r === blockRows - 1 && (c === 2 || c === 3)) continue; // Hueco inferior

          blocks.push({
            x: bx + c * blockW,
            y: startY + r * blockH,
            width: blockW,
            height: blockH,
            hp: 3,
          });
        }
      }
    }
    bunkersRef.current = blocks;
  }, []);

  // Inicializar oleada de invasores
  const initWave = useCallback(
    (currentWave: number) => {
      const rows = 5;
      const cols = 9;
      const invWidth = 26;
      const invHeight = 18;
      const padX = 14;
      const padY = 14;
      const startX = (CANVAS_WIDTH - (cols * (invWidth + padX) - padX)) / 2;
      const startY = 65 + Math.min(30, (currentWave - 1) * 8);

      const list: Invader[] = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          let type: 0 | 1 | 2 = 2; // Drones
          let points = 10;
          let color = '#4ade80'; // Verde

          if (r === 0) {
            type = 0; // Comandante
            points = 30;
            color = '#ec4899'; // Magenta
          } else if (r === 1 || r === 2) {
            type = 1; // Destructor
            points = 20;
            color = '#06b6d4'; // Cyan
          }

          list.push({
            x: startX + c * (invWidth + padX),
            y: startY + r * (invHeight + padY),
            width: invWidth,
            height: invHeight,
            type,
            points,
            color,
            alive: true,
          });
        }
      }

      invadersRef.current = list;
      invaderDirRef.current = 1;
      invaderStepTimerRef.current = 0;
      invaderAnimFrameRef.current = 0;
      bulletsRef.current = [];
      particlesRef.current = [];
      mysteryShipRef.current.active = false;
      mysterySpawnTimerRef.current = 0;
      initBunkers();
    },
    [initBunkers]
  );

  // Iniciar nuevo juego completo
  const startNewGame = useCallback(() => {
    setScore(0);
    setLives(3);
    setWave(1);
    playerRef.current.x = (CANVAS_WIDTH - 36) / 2;
    initWave(1);
    setGameState('start');
  }, [initWave]);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  // Teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') keysRef.current.left = true;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') keysRef.current.right = true;
      if (e.code === 'Space') {
        e.preventDefault();
        keysRef.current.space = true;
        if (gameState === 'start') setGameState('playing');
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
  }, [gameState]);

  // Disparar proyectil de jugador
  const shootPlayerBullet = useCallback(() => {
    const player = playerRef.current;
    if (player.cooldown <= 0) {
      bulletsRef.current.push({
        x: player.x + player.width / 2,
        y: player.y - 6,
        vy: -7.5,
        isEnemy: false,
      });
      player.cooldown = 14;
      playSound('shoot');
    }
  }, [playSound]);

  // Explosión de partículas
  const createExplosion = (x: number, y: number, color: string, count = 10) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3.5 + 1;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        alpha: 1,
        size: Math.random() * 3 + 1.5,
      });
    }
  };

  // Ciclo a 60 FPS
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let localScore = score;

    const loop = () => {
      const player = playerRef.current;
      const invaders = invadersRef.current;
      const bullets = bulletsRef.current;
      const bunkers = bunkersRef.current;
      const particles = particlesRef.current;
      const mystery = mysteryShipRef.current;

      // 1. FÍSICAS Y ACTUALIZACIONES
      if (gameState === 'playing') {
        // Movimiento jugador
        if (keysRef.current.left) player.x = Math.max(10, player.x - player.speed);
        if (keysRef.current.right) player.x = Math.min(CANVAS_WIDTH - player.width - 10, player.x + player.speed);

        // Disparo continuo
        if (keysRef.current.space || keysRef.current.mouseDown) {
          shootPlayerBullet();
        }
        if (player.cooldown > 0) player.cooldown--;

        // Movimiento de la horda invasora
        const aliveInvaders = invaders.filter((inv) => inv.alive);
        const aliveCount = aliveInvaders.length;

        if (aliveCount === 0) {
          // Oleada superada
          playSound('win');
          try {
            confetti({
              particleCount: 90,
              spread: 80,
              origin: { y: 0.6 },
              colors: ['#06b6d4', '#ec4899', '#4ade80', '#fbbf24', '#ffffff'],
            });
          } catch {}
          setWave((w) => {
            const nw = w + 1;
            initWave(nw);
            return nw;
          });
        } else {
          // Velocidad según invasores restantes (marcha más rápida con menos invasores)
          const stepInterval = Math.max(4, Math.floor((aliveCount / 45) * 32));

          invaderStepTimerRef.current++;
          if (invaderStepTimerRef.current >= stepInterval) {
            invaderStepTimerRef.current = 0;
            invaderAnimFrameRef.current = 1 - invaderAnimFrameRef.current;
            playSound('march');

            let hitEdge = false;
            for (const inv of aliveInvaders) {
              if (
                (invaderDirRef.current > 0 && inv.x + inv.width >= CANVAS_WIDTH - 20) ||
                (invaderDirRef.current < 0 && inv.x <= 20)
              ) {
                hitEdge = true;
                break;
              }
            }

            if (hitEdge) {
              invaderDirRef.current *= -1;
              for (const inv of aliveInvaders) {
                inv.y += 14;
                // Si tocan la línea defensiva -> Invasión completa
                if (inv.y + inv.height >= player.y - 10) {
                  playSound('game_over');
                  setGameState('game_over');
                  if (localScore > highScore) {
                    setHighScore(localScore);
                    try {
                      localStorage.setItem('invasores_high_score', localScore.toString());
                    } catch {}
                  }
                }
              }
            } else {
              for (const inv of aliveInvaders) {
                inv.x += invaderDirRef.current * 8;
              }
            }
          }

          // Disparo aleatorio de bombas enemigas
          if (Math.random() < 0.035 && bullets.filter((b) => b.isEnemy).length < 5) {
            const shootingInvader = aliveInvaders[Math.floor(Math.random() * aliveInvaders.length)];
            bullets.push({
              x: shootingInvader.x + shootingInvader.width / 2,
              y: shootingInvader.y + shootingInvader.height,
              vy: 3.5,
              isEnemy: true,
            });
          }
        }

        // Nave Nodriza Misteriosa
        mysterySpawnTimerRef.current++;
        if (mysterySpawnTimerRef.current > 750 && !mystery.active) {
          mysterySpawnTimerRef.current = 0;
          if (Math.random() < 0.5) {
            mystery.active = true;
            mystery.x = -mystery.width;
            mystery.vx = 2.2;
            playSound('ufo');
          }
        }

        if (mystery.active) {
          mystery.x += mystery.vx;
          if (mystery.x > CANVAS_WIDTH + 20) {
            mystery.active = false;
          }
        }

        // Balas (jugador y enemigas)
        for (let i = bullets.length - 1; i >= 0; i--) {
          const b = bullets[i];
          b.y += b.vy;

          // Fuera de pantalla
          if (b.y < 0 || b.y > CANVAS_HEIGHT) {
            bullets.splice(i, 1);
            continue;
          }

          // Colisión bala con búnkeres
          let hitBunker = false;
          for (let k = bunkers.length - 1; k >= 0; k--) {
            const blk = bunkers[k];
            if (
              b.x >= blk.x &&
              b.x <= blk.x + blk.width &&
              b.y >= blk.y &&
              b.y <= blk.y + blk.height
            ) {
              blk.hp--;
              if (blk.hp <= 0) bunkers.splice(k, 1);
              createExplosion(blk.x + blk.width / 2, blk.y + blk.height / 2, '#06b6d4', 4);
              bullets.splice(i, 1);
              hitBunker = true;
              break;
            }
          }
          if (hitBunker) continue;

          // Bala de jugador
          if (!b.isEnemy) {
            // Impacto en Invasor
            let hitInvader = false;
            for (const inv of invaders) {
              if (
                inv.alive &&
                b.x >= inv.x &&
                b.x <= inv.x + inv.width &&
                b.y >= inv.y &&
                b.y <= inv.y + inv.height
              ) {
                inv.alive = false;
                bullets.splice(i, 1);
                localScore += inv.points;
                setScore(localScore);
                createExplosion(inv.x + inv.width / 2, inv.y + inv.height / 2, inv.color, 12);
                playSound('invader_hit');
                hitInvader = true;
                break;
              }
            }
            if (hitInvader) continue;

            // Impacto en Nave Nodriza
            if (
              mystery.active &&
              b.x >= mystery.x &&
              b.x <= mystery.x + mystery.width &&
              b.y >= mystery.y &&
              b.y <= mystery.y + mystery.height
            ) {
              mystery.active = false;
              bullets.splice(i, 1);
              const mysteryPts = [100, 150, 200, 300][Math.floor(Math.random() * 4)];
              localScore += mysteryPts;
              setScore(localScore);
              createExplosion(mystery.x + mystery.width / 2, mystery.y + mystery.height / 2, '#f43f5e', 20);
              playSound('invader_hit');
              continue;
            }
          } else {
            // Bala enemiga impacta en el jugador
            if (
              b.x >= player.x &&
              b.x <= player.x + player.width &&
              b.y >= player.y &&
              b.y <= player.y + player.height
            ) {
              bullets.splice(i, 1);
              createExplosion(player.x + player.width / 2, player.y + player.height / 2, '#06b6d4', 24);
              playSound('player_hit');

              setLives((l) => {
                const nextL = l - 1;
                if (nextL <= 0) {
                  playSound('game_over');
                  setGameState('game_over');
                  if (localScore > highScore) {
                    setHighScore(localScore);
                    try {
                      localStorage.setItem('invasores_high_score', localScore.toString());
                    } catch {}
                  }
                } else {
                  player.x = (CANVAS_WIDTH - 36) / 2;
                }
                return nextL;
              });
              continue;
            }
          }
        }
      }

      // Partículas
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.028;
        if (p.alpha <= 0) particles.splice(i, 1);
      }

      // 2. RENDERIZADO EN CANVAS
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Fondo Espacial con estrellas estáticas/sutiles
      const bgGrad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
      bgGrad.addColorStop(0, '#060913');
      bgGrad.addColorStop(1, '#0e1422');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Rejilla synthwave en la base
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.12)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, CANVAS_HEIGHT - 12);
      ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT - 12);
      ctx.stroke();

      // Dibujar Búnkeres
      bunkers.forEach((blk) => {
        const alpha = blk.hp === 3 ? 1.0 : blk.hp === 2 ? 0.7 : 0.4;
        ctx.fillStyle = `rgba(6, 182, 212, ${alpha})`;
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 4;
        ctx.fillRect(blk.x, blk.y, blk.width, blk.height);
      });
      ctx.shadowBlur = 0;

      // Dibujar Invasores
      const animFrame = invaderAnimFrameRef.current;
      invaders.forEach((inv) => {
        if (!inv.alive) return;
        ctx.fillStyle = inv.color;
        ctx.shadowColor = inv.color;
        ctx.shadowBlur = 8;

        const ix = inv.x;
        const iy = inv.y;
        const iw = inv.width;
        const ih = inv.height;

        if (inv.type === 0) {
          // Comandante (Magenta): Cuernos, cuerpo central y alas
          ctx.beginPath();
          ctx.roundRect(ix + 4, iy + 2, iw - 8, ih - 4, 3);
          ctx.fill();
          // Cuernos
          ctx.fillRect(ix + 2, iy, 4, 4);
          ctx.fillRect(ix + iw - 6, iy, 4, 4);
          // Ojos
          ctx.fillStyle = '#000';
          ctx.fillRect(ix + 7, iy + 6, 3, 3);
          ctx.fillRect(ix + iw - 10, iy + 6, 3, 3);
          // Brazos/patas animadas
          ctx.fillStyle = inv.color;
          if (animFrame === 0) {
            ctx.fillRect(ix, iy + ih - 4, 4, 4);
            ctx.fillRect(ix + iw - 4, iy + ih - 4, 4, 4);
          } else {
            ctx.fillRect(ix, iy + 4, 4, 4);
            ctx.fillRect(ix + iw - 4, iy + 4, 4, 4);
          }
        } else if (inv.type === 1) {
          // Destructor (Cyan): Pinzas y núcleo
          ctx.beginPath();
          ctx.roundRect(ix + 3, iy + 3, iw - 6, ih - 5, 2);
          ctx.fill();
          // Ojos
          ctx.fillStyle = '#000';
          ctx.fillRect(ix + 6, iy + 6, 3, 3);
          ctx.fillRect(ix + iw - 9, iy + 6, 3, 3);
          // Patas
          ctx.fillStyle = inv.color;
          if (animFrame === 0) {
            ctx.fillRect(ix + 1, iy + ih - 3, 4, 4);
            ctx.fillRect(ix + iw - 5, iy + ih - 3, 4, 4);
          } else {
            ctx.fillRect(ix + 3, iy + ih - 2, 4, 3);
            ctx.fillRect(ix + iw - 7, iy + ih - 2, 4, 3);
          }
        } else {
          // Drone (Verde): Cuerpo estilizado
          ctx.beginPath();
          ctx.roundRect(ix + 5, iy + 2, iw - 10, ih - 4, 4);
          ctx.fill();
          // Antena central
          ctx.fillRect(ix + iw / 2 - 2, iy, 4, 3);
          // Ojos
          ctx.fillStyle = '#000';
          ctx.fillRect(ix + 8, iy + 5, 2, 3);
          ctx.fillRect(ix + iw - 10, iy + 5, 2, 3);
          // Tentáculos
          ctx.fillStyle = inv.color;
          if (animFrame === 0) {
            ctx.fillRect(ix + 3, iy + ih - 3, 3, 4);
            ctx.fillRect(ix + iw - 6, iy + ih - 3, 3, 4);
          } else {
            ctx.fillRect(ix + 6, iy + ih - 3, 3, 4);
            ctx.fillRect(ix + iw - 9, iy + ih - 3, 3, 4);
          }
        }
      });
      ctx.shadowBlur = 0;

      // Dibujar Nave Nodriza Misteriosa
      if (mystery.active) {
        ctx.fillStyle = '#f43f5e';
        ctx.shadowColor = '#f43f5e';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.roundRect(mystery.x, mystery.y + 4, mystery.width, mystery.height - 4, 6);
        ctx.fill();
        // Cúpula superior
        ctx.fillStyle = '#facc15';
        ctx.fillRect(mystery.x + 12, mystery.y, mystery.width - 24, 6);
        ctx.shadowBlur = 0;
      }

      // Dibujar Nave del Jugador
      ctx.fillStyle = '#06b6d4';
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.roundRect(player.x, player.y + 6, player.width, player.height - 6, 4);
      ctx.fill();
      // Cañón central
      ctx.fillStyle = '#fff';
      ctx.fillRect(player.x + player.width / 2 - 2, player.y, 4, 8);
      // Cabina
      ctx.fillStyle = '#ec4899';
      ctx.fillRect(player.x + player.width / 2 - 5, player.y + 6, 10, 4);
      ctx.shadowBlur = 0;

      // Dibujar Balas
      bullets.forEach((b) => {
        if (!b.isEnemy) {
          ctx.fillStyle = '#fff';
          ctx.shadowColor = '#06b6d4';
          ctx.shadowBlur = 10;
          ctx.fillRect(b.x - 1.5, b.y, 3, 10);
        } else {
          ctx.fillStyle = '#fb923c';
          ctx.shadowColor = '#f43f5e';
          ctx.shadowBlur = 8;
          ctx.fillRect(b.x - 1.5, b.y, 3, 8);
        }
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

      animFrameIdRef.current = requestAnimationFrame(loop);
    };

    animFrameIdRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [gameState, highScore, initWave, playSound, shootPlayerBullet]);

  // Controles de ratón y táctil
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const mouseX = (e.clientX - rect.left) * scaleX;
    playerRef.current.x = Math.max(10, Math.min(CANVAS_WIDTH - playerRef.current.width - 10, mouseX - playerRef.current.width / 2));
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || e.touches.length === 0) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const touchX = (e.touches[0].clientX - rect.left) * scaleX;
    playerRef.current.x = Math.max(10, Math.min(CANVAS_WIDTH - playerRef.current.width - 10, touchX - playerRef.current.width / 2));
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button !== 0) return;
    keysRef.current.mouseDown = true;
    if (gameState === 'start') setGameState('playing');
    shootPlayerBullet();
  };

  const handleCanvasMouseUp = () => {
    keysRef.current.mouseDown = false;
  };

  const handleCanvasTouchStart = () => {
    if (gameState === 'start') setGameState('playing');
    shootPlayerBullet();
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
            background: 'rgba(6, 182, 212, 0.12)',
            border: '1px solid rgba(6, 182, 212, 0.35)',
            borderRadius: '9999px',
            color: '#06b6d4',
            fontSize: '0.82rem',
            fontWeight: 700,
            marginBottom: '0.75rem',
          }}
        >
          <span>👾</span>
          <span>Acción Arcade Matamarcianos Retro</span>
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-title), serif',
            fontSize: 'clamp(2rem, 4vw, 2.75rem)',
            fontWeight: 900,
            letterSpacing: '0.04em',
            marginBottom: '0.5rem',
            background: 'linear-gradient(135deg, #fff 40%, #06b6d4 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Invasores del Espacio (Defensa Cósmica)
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '580px', margin: '0 auto' }}>
          Defiende la órbita de las oleadas alienígenas, utiliza los búnkeres de plasma y derriba la nave nodriza de bonificación.
        </p>
      </header>

      {/* Controls Bar: Vidas, Oleada, Puntos, Récord y Audio */}
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
        {/* Vidas & Oleada */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }} title={`${lives} naves restantes`}>
            {Array.from({ length: 3 }).map((_, i) => (
              <span
                key={i}
                style={{
                  fontSize: '1.15rem',
                  opacity: i < lives ? 1 : 0.2,
                  filter: i < lives ? 'drop-shadow(0 0 6px rgba(6,182,212,0.8))' : 'none',
                }}
              >
                🚀
              </span>
            ))}
          </div>

          <div
            style={{
              fontSize: '0.85rem',
              fontWeight: 800,
              color: '#06b6d4',
              background: 'rgba(6, 182, 212, 0.12)',
              padding: '0.25rem 0.65rem',
              borderRadius: '6px',
              border: '1px solid rgba(6, 182, 212, 0.3)',
            }}
          >
            Oleada {wave}
          </div>
        </div>

        {/* Puntuación y Récord */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>PUNTOS</div>
            <div style={{ fontFamily: 'monospace', fontSize: '1.25rem', fontWeight: 900, color: '#06b6d4' }}>
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

      {/* Arcade Canvas Frame */}
      <div
        style={{
          position: 'relative',
          margin: '0 auto',
          padding: '12px',
          borderRadius: '16px',
          background: 'linear-gradient(180deg, #181c24 0%, #0d1117 100%)',
          border: '2px solid rgba(6, 182, 212, 0.35)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6), 0 0 35px rgba(6, 182, 212, 0.15)',
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

        {/* Start Overlay */}
        {gameState === 'start' && (
          <div
            onClick={() => setGameState('playing')}
            style={{
              position: 'absolute',
              top: '60%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'rgba(11, 15, 25, 0.88)',
              border: '1.5px solid #06b6d4',
              borderRadius: '12px',
              padding: '0.85rem 1.5rem',
              color: '#06b6d4',
              fontWeight: 800,
              fontSize: '0.95rem',
              cursor: 'pointer',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 0 25px rgba(6, 182, 212, 0.4)',
              textAlign: 'center',
            }}
          >
            🚀 Haz clic o pulsa [Espacio] para iniciar la defensa
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
              💥 INVASIÓN COMPLETADA
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Puntuación final: <strong>{score} puntos</strong> (Oleada {wave})
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
      </div>

      {/* Mobile Touch Fire Button */}
      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
        <button
          type="button"
          onClick={shootPlayerBullet}
          style={{
            width: '100%',
            maxWidth: '664px',
            padding: '0.75rem 1rem',
            borderRadius: '10px',
            background: 'rgba(6, 182, 212, 0.15)',
            border: '1.5px solid #06b6d4',
            color: '#06b6d4',
            fontWeight: 800,
            fontSize: '0.92rem',
            cursor: 'pointer',
            boxShadow: '0 0 15px rgba(6, 182, 212, 0.3)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
          }}
        >
          <Zap size={18} />
          <span>Disparar Cañón Láser</span>
        </button>
      </div>

      {/* Guide & Scoring Legend */}
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
            color: '#06b6d4',
          }}
        >
          <HelpCircle size={18} />
          <span>Tabla de Invasores y Defensas</span>
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            fontSize: '0.86rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
          }}
        >
          <div>
            <strong style={{ color: '#ec4899' }}>👾 Comandante Cósmico:</strong> 30 puntos. Fila superior, dispara ráfagas de plasma.
          </div>
          <div>
            <strong style={{ color: '#06b6d4' }}>🛸 Destructor de Plasma:</strong> 20 puntos. Filas intermedias con blindaje reforzado.
          </div>
          <div>
            <strong style={{ color: '#4ade80' }}>⚡ Drone de Vanguardia:</strong> 10 puntos. Filas de asalto frontal.
          </div>
          <div>
            <strong style={{ color: '#f43f5e' }}>🛸 Nave Nodriza Misteriosa:</strong> 100 a 300 puntos de bonificación secreta al derribarla.
          </div>
        </div>
      </section>
    </div>
  );
}
