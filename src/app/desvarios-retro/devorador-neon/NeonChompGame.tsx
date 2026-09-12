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
  Heart,
} from 'lucide-react';
import confetti from 'canvas-confetti';

// 19 columnas x 21 filas (0 dead-ends, outer track fully loopable)
// 1 = Pared, 2 = Píldora de datos, 3 = Nodo EMP (Power Pellet), 0 = Vacío, 4 = Base Cortafuegos, 5 = Puerta
const MAZE_MAP = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 3, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 3, 1],
  [1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1],
  [1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 2, 1, 1, 1, 0, 1, 0, 1, 1, 1, 2, 1, 1, 1, 1],
  [0, 0, 0, 1, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 1, 0, 0, 0], // Fila 8: Vía conectada con avenidas laterales
  [1, 1, 1, 1, 2, 1, 0, 1, 1, 5, 1, 1, 0, 1, 2, 1, 1, 1, 1],
  [0, 0, 0, 0, 2, 0, 0, 1, 4, 4, 4, 1, 0, 0, 2, 0, 0, 0, 0], // Fila 10: Túnel de teletransporte lateral
  [1, 1, 1, 1, 2, 1, 0, 1, 1, 1, 1, 1, 0, 1, 2, 1, 1, 1, 1],
  [0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0],
  [1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1],
  [1, 3, 2, 2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 2, 3, 1],
  [1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1],
  [1, 2, 1, 1, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const COLS = 19;
const ROWS = 21;
const TILE_SIZE = 22; // Ancho/Alto de cada celda en el canvas (418 x 462 px)

interface Enemy {
  name: string;
  color: string;
  x: number;
  y: number;
  dirX: number;
  dirY: number;
  lastTileX: number;
  lastTileY: number;
  baseX: number;
  baseY: number;
  isFrightened: boolean;
  isDead: boolean;
  speed: number;
  state: 'in_house' | 'exiting' | 'active' | 'dead';
  exitDelay: number;
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

export default function NeonChompGame() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showHelp, setShowHelp] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Estado del jugador (avanza de continuo por defecto)
  const playerRef = useRef({
    x: 9,
    y: 16,
    subX: 9,
    subY: 16,
    dirX: -1,
    dirY: 0,
    nextDirX: -1,
    nextDirY: 0,
    mouthAngle: 0.2,
    mouthDir: 1,
    angle: Math.PI,
    speed: 0.11,
  });

  // Estado del laberinto
  const mapRef = useRef<number[][]>([]);
  const dotsRemainingRef = useRef(0);

  // Cortafuegos (Enemigos con máquina de estados e IA por celda)
  const enemiesRef = useRef<Enemy[]>([
    { name: 'Cerbero', color: '#f43f5e', x: 9, y: 8, dirX: -1, dirY: 0, lastTileX: 9, lastTileY: 8, baseX: 9, baseY: 8, isFrightened: false, isDead: false, speed: 0.082, state: 'active', exitDelay: 0 },
    { name: 'Vórtice', color: '#ec4899', x: 8, y: 10, dirX: 0, dirY: -1, lastTileX: -1, lastTileY: -1, baseX: 8, baseY: 10, isFrightened: false, isDead: false, speed: 0.078, state: 'in_house', exitDelay: 1200 },
    { name: 'Glitch', color: '#06b6d4', x: 9, y: 10, dirX: 0, dirY: -1, lastTileX: -1, lastTileY: -1, baseX: 9, baseY: 10, isFrightened: false, isDead: false, speed: 0.076, state: 'in_house', exitDelay: 3200 },
    { name: 'Spectro', color: '#f59e0b', x: 10, y: 10, dirX: -1, dirY: 0, lastTileX: -1, lastTileY: -1, baseX: 10, baseY: 10, isFrightened: false, isDead: false, speed: 0.074, state: 'in_house', exitDelay: 5500 },
  ]);

  const frightenedTimerRef = useRef(0);
  const comboMultiplierRef = useRef(1);
  const particlesRef = useRef<Particle[]>([]);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const lastTimeRef = useRef(0);

  const isPausedRef = useRef(false);
  const isGameOverRef = useRef(false);
  const livesRef = useRef(3);
  const scoreRef = useRef(0);

  isPausedRef.current = isPaused;
  isGameOverRef.current = isGameOver;

  // Cargar Highscore
  useEffect(() => {
    try {
      const saved = localStorage.getItem('desvarios_devorador_neon_highscore');
      if (saved) setHighScore(parseInt(saved, 10));
    } catch {}
  }, []);

  // Web Audio Synth procedural
  const playSound = useCallback(
    (type: 'chomp' | 'emp' | 'eatGhost' | 'death' | 'levelClear') => {
      if (!soundEnabled) return;
      try {
        if (!audioCtxRef.current) {
          const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          audioCtxRef.current = new AudioContextClass();
        }
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') ctx.resume();
        const now = ctx.currentTime;

        if (type === 'chomp') {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(260 + Math.random() * 40, now);
          osc.frequency.exponentialRampToValueAtTime(120, now + 0.04);
          gain.gain.setValueAtTime(0.06, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.04);
        } else if (type === 'emp') {
          [440, 554, 659, 880].forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(freq, now + idx * 0.05);
            gain.gain.setValueAtTime(0.12, now + idx * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.2);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + idx * 0.05);
            osc.stop(now + idx * 0.05 + 0.2);
          });
        } else if (type === 'eatGhost') {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(600, now);
          osc.frequency.exponentialRampToValueAtTime(1200, now + 0.15);
          gain.gain.setValueAtTime(0.15, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.15);
        } else if (type === 'death') {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(320, now);
          osc.frequency.exponentialRampToValueAtTime(40, now + 0.4);
          gain.gain.setValueAtTime(0.22, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.4);
        } else if (type === 'levelClear') {
          [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + idx * 0.08);
            gain.gain.setValueAtTime(0.16, now + idx * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + idx * 0.08);
            osc.stop(now + idx * 0.08 + 0.25);
          });
        }
      } catch {}
    },
    [soundEnabled]
  );

  // Inicializar mapa y conteo de puntos
  const initMap = useCallback(() => {
    let count = 0;
    const cloned = MAZE_MAP.map((row) =>
      row.map((cell) => {
        if (cell === 2 || cell === 3) count++;
        return cell;
      })
    );
    mapRef.current = cloned;
    dotsRemainingRef.current = count;
  }, []);

  // Reiniciar posiciones tras pérdida de vida o nuevo nivel
  const resetPositions = useCallback(() => {
    playerRef.current = {
      x: 9,
      y: 16,
      subX: 9,
      subY: 16,
      dirX: -1, // Empieza moviéndose a la izquierda
      dirY: 0,
      nextDirX: -1,
      nextDirY: 0,
      mouthAngle: 0.2,
      mouthDir: 1,
      angle: Math.PI,
      speed: 0.11 + (level - 1) * 0.01,
    };

    enemiesRef.current = [
      { name: 'Cerbero', color: '#f43f5e', x: 9, y: 8, dirX: -1, dirY: 0, lastTileX: 9, lastTileY: 8, baseX: 9, baseY: 8, isFrightened: false, isDead: false, speed: 0.08 + (level - 1) * 0.008, state: 'active', exitDelay: 0 },
      { name: 'Vórtice', color: '#ec4899', x: 8, y: 10, dirX: 0, dirY: -1, lastTileX: -1, lastTileY: -1, baseX: 8, baseY: 10, isFrightened: false, isDead: false, speed: 0.076 + (level - 1) * 0.008, state: 'in_house', exitDelay: 1200 },
      { name: 'Glitch', color: '#06b6d4', x: 9, y: 10, dirX: 0, dirY: -1, lastTileX: -1, lastTileY: -1, baseX: 9, baseY: 10, isFrightened: false, isDead: false, speed: 0.074 + (level - 1) * 0.008, state: 'in_house', exitDelay: 3200 },
      { name: 'Spectro', color: '#f59e0b', x: 10, y: 10, dirX: -1, dirY: 0, lastTileX: -1, lastTileY: -1, baseX: 10, baseY: 10, isFrightened: false, isDead: false, speed: 0.072 + (level - 1) * 0.008, state: 'in_house', exitDelay: 5500 },
    ];
    frightenedTimerRef.current = 0;
  }, [level]);

  // Reiniciar juego completo
  const restartGame = useCallback(() => {
    initMap();
    setScore(0);
    scoreRef.current = 0;
    setLives(3);
    livesRef.current = 3;
    setLevel(1);
    setIsGameOver(false);
    isGameOverRef.current = false;
    setIsPaused(false);
    isPausedRef.current = false;
    particlesRef.current = [];
    resetPositions();
  }, [initMap, resetPositions]);

  // Manejador central de cambio de dirección
  const handleDirection = useCallback((dx: number, dy: number) => {
    if (isPausedRef.current || isGameOverRef.current) return;
    const p = playerRef.current;
    p.nextDirX = dx;
    p.nextDirY = dy;

    // Actualizar orientación visual de inmediato
    if (dx === 1) p.angle = 0;
    else if (dx === -1) p.angle = Math.PI;
    else if (dy === 1) p.angle = Math.PI / 2;
    else if (dy === -1) p.angle = -Math.PI / 2;

    // Giro 180° inmediato
    if (dx === -p.dirX && dy === -p.dirY) {
      p.dirX = dx;
      p.dirY = dy;
    } else if (p.dirX === 0 && p.dirY === 0) {
      // Si estaba detenido, intentar arrancar de inmediato si el paso está despejado
      const cellX = Math.round(p.subX);
      const cellY = Math.round(p.subY);
      const val = mapRef.current[cellY + dy]?.[cellX + dx];
      if (val !== 1 && val !== 5) {
        p.dirX = dx;
        p.dirY = dy;
        p.subX = cellX;
        p.subY = cellY;
      }
    }
  }, []);

  // Manejador de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
        setIsPaused((prev) => !prev);
        return;
      }
      if (isPausedRef.current || isGameOverRef.current) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          handleDirection(0, -1);
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          handleDirection(0, 1);
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          handleDirection(-1, 0);
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          handleDirection(1, 0);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDirection]);

  // Gestos táctiles Swipe
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let touchStartX = 0;
    let touchStartY = 0;

    const onTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (isPausedRef.current || isGameOverRef.current) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      if (Math.max(absDx, absDy) < 18) return; // Umbral de swipe

      if (absDx > absDy) {
        handleDirection(dx > 0 ? 1 : -1, 0);
      } else {
        handleDirection(0, dy > 0 ? 1 : -1);
      }
    };

    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    canvas.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchend', onTouchEnd);
    };
  }, [handleDirection]);

  // Inicializar juego al montar
  useEffect(() => {
    restartGame();
  }, [restartGame]);

  // Bucle principal de juego a 60 FPS
  useEffect(() => {
    let animId: number;

    const isWall = (cellX: number, cellY: number) => {
      if (cellY === 10 && (cellX < 0 || cellX >= COLS)) return false; // Túnel
      if (cellX < 0 || cellX >= COLS || cellY < 0 || cellY >= ROWS) return true;
      const val = mapRef.current[cellY]?.[cellX];
      return val === 1 || val === 5;
    };

    const createParticles = (x: number, y: number, color: string, count = 12) => {
      for (let i = 0; i < count; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = Math.random() * 3 + 1;
        particlesRef.current.push({
          x: x * TILE_SIZE + TILE_SIZE / 2,
          y: y * TILE_SIZE + TILE_SIZE / 2,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          color,
          alpha: 1,
          size: Math.random() * 2.5 + 1.5,
        });
      }
    };

    const gameLoop = (time: number) => {
      animId = requestAnimationFrame(gameLoop);

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dt = time - lastTimeRef.current;
      lastTimeRef.current = time;

      // 1. LÓGICA DE ACTUALIZACIÓN (Si no está en pausa ni terminado)
      if (!isPausedRef.current && !isGameOverRef.current) {
        const p = playerRef.current;

        // Temporizador de EMP
        if (frightenedTimerRef.current > 0) {
          frightenedTimerRef.current -= dt;
          if (frightenedTimerRef.current <= 0) {
            enemiesRef.current.forEach((en) => {
              en.isFrightened = false;
            });
            comboMultiplierRef.current = 1;
          }
        }

        // Posición y celda actual del jugador
        const cellX = Math.round(p.subX);
        const cellY = Math.round(p.subY);
        const distX = p.subX - cellX;
        const distY = p.subY - cellY;

        // Comprobar cambio a nextDir
        if (p.nextDirX !== 0 || p.nextDirY !== 0) {
          if (p.nextDirX === -p.dirX && p.nextDirY === -p.dirY) {
            p.dirX = p.nextDirX;
            p.dirY = p.nextDirY;
            if (p.dirX === 1) p.angle = 0;
            else if (p.dirX === -1) p.angle = Math.PI;
            else if (p.dirY === 1) p.angle = Math.PI / 2;
            else if (p.dirY === -1) p.angle = -Math.PI / 2;
          } else if (p.dirX === 0 && p.dirY === 0) {
            if (!isWall(cellX + p.nextDirX, cellY + p.nextDirY)) {
              p.dirX = p.nextDirX;
              p.dirY = p.nextDirY;
              p.subX = cellX;
              p.subY = cellY;
              if (p.dirX === 1) p.angle = 0;
              else if (p.dirX === -1) p.angle = Math.PI;
              else if (p.dirY === 1) p.angle = Math.PI / 2;
              else if (p.dirY === -1) p.angle = -Math.PI / 2;
            }
          } else {
            // Giro perpendicular en cruce o intersección
            const turningHorizontal = p.dirY !== 0 && p.nextDirX !== 0;
            const turningVertical = p.dirX !== 0 && p.nextDirY !== 0;

            if (turningHorizontal && Math.abs(distY) < p.speed * 1.5) {
              if (!isWall(cellX + p.nextDirX, cellY)) {
                p.subY = cellY;
                p.dirX = p.nextDirX;
                p.dirY = 0;
                p.angle = p.dirX === 1 ? 0 : Math.PI;
              }
            } else if (turningVertical && Math.abs(distX) < p.speed * 1.5) {
              if (!isWall(cellX, cellY + p.nextDirY)) {
                p.subX = cellX;
                p.dirX = 0;
                p.dirY = p.nextDirY;
                p.angle = p.dirY === 1 ? Math.PI / 2 : -Math.PI / 2;
              }
            }
          }
        }

        // Movimiento continuo del jugador y detección de esquinas
        if (p.dirX !== 0 || p.dirY !== 0) {
          const nextCellX = cellX + p.dirX;
          const nextCellY = cellY + p.dirY;
          const isApproachingWall = isWall(nextCellX, nextCellY);

          if (isApproachingWall) {
            const distToCenter = p.dirX !== 0 ? (p.subX - cellX) * p.dirX : (p.subY - cellY) * p.dirY;

            if (distToCenter >= 0) {
              // Ha alcanzado el centro de la celda y de frente hay pared:
              // Comprobar si es un giro único (esquina en L) para auto-doblar
              const possibleTurns: { dx: number; dy: number }[] = [];
              if (p.dirX !== 0) {
                if (!isWall(cellX, cellY - 1)) possibleTurns.push({ dx: 0, dy: -1 });
                if (!isWall(cellX, cellY + 1)) possibleTurns.push({ dx: 0, dy: 1 });
              } else {
                if (!isWall(cellX - 1, cellY)) possibleTurns.push({ dx: -1, dy: 0 });
                if (!isWall(cellX + 1, cellY)) possibleTurns.push({ dx: 1, dy: 0 });
              }

              if (possibleTurns.length === 1 && p.nextDirX === 0 && p.nextDirY === 0) {
                p.subX = cellX;
                p.subY = cellY;
                p.dirX = possibleTurns[0].dx;
                p.dirY = possibleTurns[0].dy;
                if (p.dirX === 1) p.angle = 0;
                else if (p.dirX === -1) p.angle = Math.PI;
                else if (p.dirY === 1) p.angle = Math.PI / 2;
                else if (p.dirY === -1) p.angle = -Math.PI / 2;
              } else {
                // Detenerse en seco en el centro de la celda
                p.subX = cellX;
                p.subY = cellY;
                p.dirX = 0;
                p.dirY = 0;
              }
            } else {
              p.subX += p.dirX * p.speed;
              p.subY += p.dirY * p.speed;
            }
          } else {
            p.subX += p.dirX * p.speed;
            p.subY += p.dirY * p.speed;
          }

          // Túnel de teletransporte lateral (Fila 10)
          if (Math.round(p.subY) === 10) {
            if (p.subX < -0.5) p.subX = COLS - 0.5;
            else if (p.subX > COLS - 0.5) p.subX = -0.5;
          }

          // Animación de boca al avanzar
          p.mouthAngle += 0.05 * p.mouthDir;
          if (p.mouthAngle > 0.45 || p.mouthAngle < 0.05) p.mouthDir *= -1;
        } else {
          // Si está detenido contra una pared, mantener postura normal
          p.mouthAngle = 0.15;
        }

        p.x = Math.round(p.subX);
        p.y = Math.round(p.subY);

        // Comer píldora de datos o EMP
        if (mapRef.current[p.y] && mapRef.current[p.y][p.x]) {
          const cell = mapRef.current[p.y][p.x];
          if (cell === 2) {
            // Píldora normal
            mapRef.current[p.y][p.x] = 0;
            dotsRemainingRef.current--;
            playSound('chomp');
            setScore((s) => {
              const next = s + 10;
              scoreRef.current = next;
              return next;
            });
          } else if (cell === 3) {
            // Nodo EMP Cuántico
            mapRef.current[p.y][p.x] = 0;
            dotsRemainingRef.current--;
            playSound('emp');
            frightenedTimerRef.current = 7500; // 7.5 segundos
            comboMultiplierRef.current = 1;
            enemiesRef.current.forEach((en) => {
              if (!en.isDead) en.isFrightened = true;
            });
            setScore((s) => {
              const next = s + 50;
              scoreRef.current = next;
              return next;
            });
          }

          // Comprobar si se completó el laberinto
          if (dotsRemainingRef.current <= 0) {
            playSound('levelClear');
            confetti({ particleCount: 50, spread: 80, origin: { y: 0.6 } });
            setLevel((l) => l + 1);
            initMap();
            resetPositions();
          }
        }

        const isGhostWall = (cellX: number, cellY: number) => {
          if (cellY === 10 && (cellX < 0 || cellX >= COLS)) return false; // Túnel lateral
          if (cellX < 0 || cellX >= COLS || cellY < 0 || cellY >= ROWS) return true;
          const val = mapRef.current[cellY]?.[cellX];
          return val === 1 || val === 5 || val === 4;
        };

        // Movimiento de Cortafuegos (Máquina de estados retro e IA táctica por celda)
        enemiesRef.current.forEach((enemy) => {
          // 1. Estado en espera dentro de la bahía (animación de balanceo vertical neón)
          if (enemy.state === 'in_house') {
            enemy.y = enemy.baseY + Math.sin(time * 0.005 + enemy.baseX) * 0.15;
            enemy.exitDelay -= dt;
            if (enemy.exitDelay <= 0) {
              enemy.state = 'exiting';
            }
            return;
          }

          // 2. Estado saliendo de la bahía central
          if (enemy.state === 'exiting') {
            if (Math.abs(enemy.x - 9) > 0.06) {
              enemy.x += (enemy.x < 9 ? 1 : -1) * 0.06;
            } else {
              enemy.x = 9;
              enemy.y -= 0.06;
              if (enemy.y <= 8.0) {
                enemy.y = 8.0;
                enemy.state = 'active';
                enemy.dirX = (enemy.name === 'Vórtice' || enemy.name === 'Spectro') ? 1 : -1;
                enemy.dirY = 0;
                enemy.lastTileX = 9;
                enemy.lastTileY = 8;
              }
            }
            return;
          }

          // 3. Estado derrotado: Ojos regresan a la base para reiniciarse
          if (enemy.state === 'dead' || enemy.isDead) {
            const dx = 9 - enemy.x;
            const dy = 8 - enemy.y;
            const dist = Math.hypot(dx, dy);
            if (dist < 0.3) {
              enemy.x = 9;
              enemy.y = 10;
              enemy.isDead = false;
              enemy.isFrightened = false;
              enemy.state = 'exiting';
            } else {
              enemy.x += (dx / dist) * 0.18;
              enemy.y += (dy / dist) * 0.18;
            }
            return;
          }

          // 4. Estado activo: Navegación e IA táctica en intersecciones
          const currentCellX = Math.round(enemy.x);
          const currentCellY = Math.round(enemy.y);

          // Comprobar si ha entrado a una nueva celda y alcanzado el centro
          const distToCenter = enemy.dirX !== 0
            ? (enemy.x - currentCellX) * enemy.dirX
            : (enemy.y - currentCellY) * enemy.dirY;

          const isNewTile = currentCellX !== enemy.lastTileX || currentCellY !== enemy.lastTileY;

          if (isNewTile && distToCenter >= -0.01) {
            enemy.lastTileX = currentCellX;
            enemy.lastTileY = currentCellY;

            // Alinear eje perpendicular para evitar desvíos
            if (enemy.dirX !== 0) enemy.y = currentCellY;
            if (enemy.dirY !== 0) enemy.x = currentCellX;

            const possibleDirs: { dx: number; dy: number }[] = [];
            const dirs = [
              { dx: 1, dy: 0 },
              { dx: -1, dy: 0 },
              { dx: 0, dy: 1 },
              { dx: 0, dy: -1 },
            ];

            dirs.forEach((d) => {
              // No permitir giro de 180° en cruces normales
              if (d.dx !== -enemy.dirX || d.dy !== -enemy.dirY) {
                if (!isGhostWall(currentCellX + d.dx, currentCellY + d.dy)) {
                  possibleDirs.push(d);
                }
              }
            });

            // Callejón sin salida: permitir dar la vuelta
            if (possibleDirs.length === 0) {
              if (!isGhostWall(currentCellX - enemy.dirX, currentCellY - enemy.dirY)) {
                possibleDirs.push({ dx: -enemy.dirX, dy: -enemy.dirY });
              }
            }

            if (possibleDirs.length > 0) {
              let chosen = possibleDirs[0];

              if (enemy.isFrightened) {
                // Modo huida: maximizar distancia
                let maxDist = -1;
                possibleDirs.forEach((d) => {
                  const dist = Math.hypot(currentCellX + d.dx - p.x, currentCellY + d.dy - p.y);
                  if (dist > maxDist) {
                    maxDist = dist;
                    chosen = d;
                  }
                });
              } else {
                let targetX = p.x;
                let targetY = p.y;

                if (enemy.name === 'Vórtice') {
                  targetX += p.dirX * 3;
                  targetY += p.dirY * 3;
                } else if (enemy.name === 'Spectro') {
                  if (Math.hypot(currentCellX - p.x, currentCellY - p.y) < 4) {
                    targetX = 1;
                    targetY = 19;
                  }
                }

                let minDist = 9999;
                possibleDirs.forEach((d) => {
                  const dist = Math.hypot(currentCellX + d.dx - targetX, currentCellY + d.dy - targetY);
                  if (dist < minDist) {
                    minDist = dist;
                    chosen = d;
                  }
                });
              }

              // Al girar en 90°, asegurar centrado en la intersección
              if (chosen.dx !== enemy.dirX || chosen.dy !== enemy.dirY) {
                enemy.x = currentCellX;
                enemy.y = currentCellY;
              }

              enemy.dirX = chosen.dx;
              enemy.dirY = chosen.dy;
            }
          }

          const currentSpeed = enemy.isFrightened ? enemy.speed * 0.6 : enemy.speed;
          enemy.x += enemy.dirX * currentSpeed;
          enemy.y += enemy.dirY * currentSpeed;

          // Túnel lateral
          if (Math.round(enemy.y) === 10) {
            if (enemy.x < -0.5) enemy.x = COLS - 0.5;
            else if (enemy.x > COLS - 0.5) enemy.x = -0.5;
          }

          // Detección de colisión Jugador <-> Cortafuegos (solo con enemigos activos)
          const distToPlayer = Math.hypot(enemy.x - p.subX, enemy.y - p.subY);
          if (distToPlayer < 0.65) {
            if (enemy.isFrightened) {
              playSound('eatGhost');
              enemy.isDead = true;
              enemy.isFrightened = false;
              enemy.state = 'dead';
              createParticles(enemy.x, enemy.y, '#38bdf8', 15);
              const points = 200 * comboMultiplierRef.current;
              comboMultiplierRef.current *= 2;
              setScore((s) => {
                const next = s + points;
                scoreRef.current = next;
                return next;
              });
            } else if (!enemy.isDead) {
              playSound('death');
              createParticles(p.subX, p.subY, '#10b981', 20);
              const nextLives = livesRef.current - 1;
              livesRef.current = nextLives;
              setLives(nextLives);

              if (nextLives <= 0) {
                setIsGameOver(true);
                isGameOverRef.current = true;
                setHighScore((h) => {
                  const max = Math.max(h, scoreRef.current);
                  try {
                    localStorage.setItem('desvarios_devorador_neon_highscore', max.toString());
                  } catch {}
                  return max;
                });
              } else {
                resetPositions();
              }
            }
          }
        });
      }

      // 2. RENDERIZADO EN CANVAS
      ctx.fillStyle = '#060911';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Dibujar laberinto
      const map = mapRef.current;
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const val = map[r]?.[c];
          const px = c * TILE_SIZE;
          const py = r * TILE_SIZE;

          if (val === 1) {
            ctx.save();
            ctx.fillStyle = '#0e1628';
            ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
            ctx.strokeStyle = '#1d4ed8';
            ctx.lineWidth = 1.5;
            ctx.shadowColor = '#38bdf8';
            ctx.shadowBlur = 4;
            ctx.strokeRect(px + 1, py + 1, TILE_SIZE - 2, TILE_SIZE - 2);
            ctx.restore();
          } else if (val === 5) {
            ctx.fillStyle = 'rgba(244, 63, 94, 0.4)';
            ctx.fillRect(px, py + TILE_SIZE / 2 - 2, TILE_SIZE, 4);
          } else if (val === 2) {
            ctx.save();
            ctx.fillStyle = '#38bdf8';
            ctx.shadowColor = '#38bdf8';
            ctx.shadowBlur = 6;
            ctx.beginPath();
            ctx.arc(px + TILE_SIZE / 2, py + TILE_SIZE / 2, 2.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          } else if (val === 3) {
            const pulse = 1 + Math.sin(time * 0.008) * 0.25;
            ctx.save();
            ctx.fillStyle = '#facc15';
            ctx.shadowColor = '#facc15';
            ctx.shadowBlur = 12;
            ctx.beginPath();
            ctx.arc(px + TILE_SIZE / 2, py + TILE_SIZE / 2, 5.5 * pulse, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }
      }

      // Dibujar Cortafuegos
      enemiesRef.current.forEach((enemy) => {
        const ex = enemy.x * TILE_SIZE + TILE_SIZE / 2;
        const ey = enemy.y * TILE_SIZE + TILE_SIZE / 2;
        const rad = TILE_SIZE * 0.45;

        ctx.save();
        if (enemy.isDead) {
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(ex - 3, ey, 2.5, 0, Math.PI * 2);
          ctx.arc(ex + 3, ey, 2.5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          const isBlinking = enemy.isFrightened && frightenedTimerRef.current < 2000 && Math.floor(time / 180) % 2 === 0;
          const bodyColor = enemy.isFrightened ? (isBlinking ? '#ffffff' : '#3b82f6') : enemy.color;

          ctx.fillStyle = bodyColor;
          ctx.shadowColor = bodyColor;
          ctx.shadowBlur = 10;

          ctx.beginPath();
          ctx.arc(ex, ey - 2, rad, Math.PI, 0, false);
          ctx.lineTo(ex + rad, ey + rad - 2);
          ctx.lineTo(ex + rad * 0.5, ey + rad - 6);
          ctx.lineTo(ex, ey + rad - 2);
          ctx.lineTo(ex - rad * 0.5, ey + rad - 6);
          ctx.lineTo(ex - rad, ey + rad - 2);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(ex - 3, ey - 3, 2.5, 0, Math.PI * 2);
          ctx.arc(ex + 3, ey - 3, 2.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#0f172a';
          ctx.beginPath();
          ctx.arc(ex - 3 + enemy.dirX * 1.2, ey - 3 + enemy.dirY * 1.2, 1.2, 0, Math.PI * 2);
          ctx.arc(ex + 3 + enemy.dirX * 1.2, ey - 3 + enemy.dirY * 1.2, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      // Dibujar Devorador Neón
      if (!isGameOverRef.current) {
        const p = playerRef.current;
        const px = p.subX * TILE_SIZE + TILE_SIZE / 2;
        const py = p.subY * TILE_SIZE + TILE_SIZE / 2;
        const rad = TILE_SIZE * 0.48;

        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(p.angle);

        ctx.fillStyle = '#10b981';
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = 14;

        ctx.beginPath();
        ctx.arc(0, 0, rad, p.mouthAngle * Math.PI, (2 - p.mouthAngle) * Math.PI);
        ctx.lineTo(0, 0);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#022c22';
        ctx.beginPath();
        ctx.arc(1, -rad * 0.5, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      // Dibujar partículas
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const part = particles[i];
        part.x += part.vx;
        part.y += part.vy;
        part.alpha -= 0.03;
        if (part.alpha <= 0) {
          particles.splice(i, 1);
        } else {
          ctx.save();
          ctx.globalAlpha = part.alpha;
          ctx.fillStyle = part.color;
          ctx.shadowColor = part.color;
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(part.x, part.y, part.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [initMap, playSound, resetPositions]);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #070a12 0%, #0c1220 100%)',
        color: '#f8fafc',
        fontFamily: "'Inter', sans-serif",
        padding: '1.25rem 1rem 3rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Barra superior de navegación */}
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
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
            fontSize: '0.88rem',
            fontWeight: 600,
            padding: '0.4rem 0.8rem',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            transition: 'all 0.2s',
          }}
        >
          <ArrowLeft size={16} /> Volver a Arcade
        </Link>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setSoundEnabled((s) => !s)}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: soundEnabled ? '#10b981' : '#64748b',
              padding: '0.45rem',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
            title={soundEnabled ? 'Silenciar' : 'Activar sonido'}
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
          <button
            onClick={() => setShowHelp(true)}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#94a3b8',
              padding: '0.45rem',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
            title="Cómo jugar"
          >
            <HelpCircle size={18} />
          </button>
          <button
            onClick={() => setIsPaused((p) => !p)}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: isPaused ? '#facc15' : '#94a3b8',
              padding: '0.45rem 0.75rem',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.84rem',
              fontWeight: 600,
            }}
          >
            {isPaused ? <Play size={16} /> : <Pause size={16} />}
            {isPaused ? 'Reanudar' : 'Pausa'}
          </button>
        </div>
      </div>

      {/* Cabecera */}
      <header style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <h1
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 'clamp(1.5rem, 3.5vw, 2.1rem)',
            fontWeight: 800,
            color: '#10b981',
            textShadow: '0 0 25px rgba(16, 185, 129, 0.4)',
            marginBottom: '0.2rem',
          }}
        >
          Devorador Neón: Fuga en la Red
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.86rem' }}>
          Devora los nodos cuánticos, activa el EMP y burla a los cortafuegos centinela.
        </p>
      </header>

      {/* Tablero y Estadísticas */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.75rem',
          maxWidth: '460px',
          width: '100%',
        }}
      >
        {/* Marcador Superior */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'rgba(18, 24, 38, 0.88)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '12px',
            padding: '0.6rem 1rem',
          }}
        >
          <div>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>PUNTOS</span>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff' }}>{score}</div>
          </div>

          <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
            {Array.from({ length: 3 }).map((_, idx) => (
              <Heart
                key={idx}
                size={18}
                color={idx < lives ? '#f43f5e' : '#334155'}
                fill={idx < lives ? '#f43f5e' : 'transparent'}
              />
            ))}
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.72rem', color: '#facc15', fontWeight: 700 }}>RÉCORD</span>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#facc15' }}>{highScore}</div>
          </div>
        </div>

        {/* Canvas del Laberinto */}
        <div
          style={{
            position: 'relative',
            background: '#060911',
            border: '2px solid rgba(16, 185, 129, 0.4)',
            borderRadius: '14px',
            overflow: 'hidden',
            boxShadow: '0 0 35px rgba(16, 185, 129, 0.2), inset 0 0 20px rgba(0,0,0,0.8)',
            maxWidth: '100%',
          }}
        >
          <canvas
            ref={canvasRef}
            width={COLS * TILE_SIZE}
            height={ROWS * TILE_SIZE}
            style={{ display: 'block', maxWidth: '100%', height: 'auto' }}
          />

          {/* Modal Pausa */}
          {isPaused && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(7, 10, 18, 0.88)',
                backdropFilter: 'blur(6px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
              }}
            >
              <h2 style={{ fontSize: '1.6rem', color: '#facc15', fontWeight: 800 }}>PAUSA</h2>
              <button
                onClick={() => setIsPaused(false)}
                style={{
                  background: '#10b981',
                  color: '#070a12',
                  border: 'none',
                  padding: '0.6rem 1.5rem',
                  borderRadius: '9999px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Reanudar
              </button>
            </div>
          )}

          {/* Modal Game Over */}
          {isGameOver && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(7, 10, 18, 0.92)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.5rem',
                textAlign: 'center',
                gap: '0.75rem',
              }}
            >
              <span style={{ fontSize: '2.5rem' }}>💀</span>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f43f5e' }}>SISTEMA INTERCEPTADO</h2>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Puntuación alcanzada</p>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#ffffff' }}>{score}</div>
              {score >= highScore && score > 0 && (
                <div style={{ color: '#facc15', fontSize: '0.82rem', fontWeight: 700 }}>
                  🌟 ¡Nuevo Récord Personal!
                </div>
              )}
              <button
                onClick={restartGame}
                style={{
                  marginTop: '0.5rem',
                  background: '#10b981',
                  color: '#070a12',
                  border: 'none',
                  padding: '0.75rem 1.6rem',
                  borderRadius: '9999px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                }}
              >
                <RotateCcw size={16} /> Jugar de Nuevo
              </button>
            </div>
          )}
        </div>

        {/* Controles Táctiles (D-Pad para Móvil) */}
        <div
          style={{
            marginTop: '0.8rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.4rem',
            width: '240px',
          }}
        >
          <button
            type="button"
            onClick={() => handleDirection(0, -1)}
            style={dpadButtonStyle()}
          >
            ▲
          </button>
          <div style={{ display: 'flex', gap: '0.8rem' }}>
            <button
              type="button"
              onClick={() => handleDirection(-1, 0)}
              style={dpadButtonStyle()}
            >
              ◀
            </button>
            <button
              type="button"
              onClick={() => handleDirection(0, 1)}
              style={dpadButtonStyle()}
            >
              ▼
            </button>
            <button
              type="button"
              onClick={() => handleDirection(1, 0)}
              style={dpadButtonStyle()}
            >
              ▶
            </button>
          </div>
        </div>

        <p style={{ color: '#64748b', fontSize: '0.78rem', textAlign: 'center', marginTop: '0.5rem' }}>
          ⌨️ <strong>Teclado:</strong> Flechas o [WASD] para moverte · [P] Pausa · 📱 Desliza con el dedo (Swipe) o usa el D-pad táctil.
        </p>
      </div>

      {/* Modal Cómo Jugar */}
      {showHelp && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            zIndex: 100,
          }}
          onClick={() => setShowHelp(false)}
        >
          <div
            style={{
              background: '#121826',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '16px',
              padding: '1.75rem',
              maxWidth: '480px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1.3rem', color: '#10b981', marginBottom: '0.8rem', fontWeight: 800 }}>
              Reglas de Devorador Neón
            </h3>
            <ul style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: '1.6', paddingLeft: '1.2rem', marginBottom: '1.2rem' }}>
              <li><strong>Objetivo:</strong> Devora todos los nodos de datos cyan del laberinto para pasar de nivel.</li>
              <li><strong>Nodos EMP:</strong> Las esferas doradas en las cuatro esquinas vuelven vulnerables a los cortafuegos durante 7,5 segundos. ¡Aprovecha para absorberlos y ganar puntos multiplicados!</li>
              <li><strong>Portales de Salto:</strong> En la fila central hay túneles laterales que te teletransportan instantáneamente de un extremo al otro.</li>
              <li><strong>Cortafuegos:</strong> Cada uno tiene un patrón de rastreo diferente. ¡Anticípate a sus giros!</li>
            </ul>
            <button
              onClick={() => setShowHelp(false)}
              style={{
                width: '100%',
                background: '#10b981',
                color: '#0b0f19',
                border: 'none',
                padding: '0.65rem',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              ¡Entendido!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function dpadButtonStyle(): React.CSSProperties {
  return {
    background: 'rgba(18, 24, 38, 0.9)',
    border: '1px solid rgba(16, 185, 129, 0.4)',
    color: '#10b981',
    width: '56px',
    height: '46px',
    borderRadius: '10px',
    fontWeight: 800,
    fontSize: '1.1rem',
    cursor: 'pointer',
    touchAction: 'manipulation',
    userSelect: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 10px rgba(16, 185, 129, 0.15)',
  };
}
