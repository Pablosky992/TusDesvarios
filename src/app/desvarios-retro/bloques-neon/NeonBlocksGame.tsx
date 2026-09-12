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
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Dimensiones de la matriz
const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 28; // píxeles por bloque en el canvas principal

// Módulos geométricos (Poliominós cuánticos)
// Cada pieza tiene su matriz y su color neón característico
interface PieceDefinition {
  name: string;
  shape: number[][];
  color: string;
  glow: string;
  isBomb?: boolean;
}

const PIECES: PieceDefinition[] = [
  {
    name: 'I',
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    color: '#00f0ff',
    glow: 'rgba(0, 240, 255, 0.7)',
  },
  {
    name: 'O',
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: '#facc15',
    glow: 'rgba(250, 204, 21, 0.7)',
  },
  {
    name: 'T',
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: '#c084fc',
    glow: 'rgba(192, 132, 252, 0.7)',
  },
  {
    name: 'S',
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    color: '#4ade80',
    glow: 'rgba(74, 222, 128, 0.7)',
  },
  {
    name: 'Z',
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    color: '#f43f5e',
    glow: 'rgba(244, 63, 94, 0.7)',
  },
  {
    name: 'J',
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: '#38bdf8',
    glow: 'rgba(56, 189, 248, 0.7)',
  },
  {
    name: 'L',
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: '#fb923c',
    glow: 'rgba(251, 146, 60, 0.7)',
  },
  // Módulo Cuántico Especial (Aparece cada ciertas piezas)
  {
    name: 'BOMB',
    shape: [[2]],
    color: '#e11d48',
    glow: 'rgba(225, 29, 72, 0.95)',
    isBomb: true,
  },
];

interface ActivePiece {
  definition: PieceDefinition;
  shape: number[][];
  x: number;
  y: number;
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

export default function NeonBlocksGame() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showHelp, setShowHelp] = useState(false);
  const [quantumPulseReady, setQuantumPulseReady] = useState(false);

  // Canvases
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const nextCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const holdCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Refs de estado de juego
  const gridRef = useRef<(string | null)[][]>(
    Array.from({ length: ROWS }, () => Array(COLS).fill(null))
  );
  const activePieceRef = useRef<ActivePiece | null>(null);
  const nextPieceRef = useRef<PieceDefinition>(PIECES[0]);
  const holdPieceRef = useRef<PieceDefinition | null>(null);
  const canHoldRef = useRef(true);
  const piecesCountRef = useRef(0);
  const dropCounterRef = useRef(0);
  const lastTimeRef = useRef(0);
  const particlesRef = useRef<Particle[]>([]);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const isPausedRef = useRef(false);
  const isGameOverRef = useRef(false);
  const scoreRef = useRef(0);
  const linesRef = useRef(0);
  const levelRef = useRef(1);

  isPausedRef.current = isPaused;
  isGameOverRef.current = isGameOver;

  // Cargar Highscore
  useEffect(() => {
    try {
      const saved = localStorage.getItem('desvarios_bloques_neon_highscore');
      if (saved) setHighScore(parseInt(saved, 10));
    } catch {}
  }, []);

  // Web Audio Synth
  const playSound = useCallback(
    (type: 'move' | 'rotate' | 'drop' | 'hardDrop' | 'clear' | 'tetris' | 'bomb' | 'gameover') => {
      if (!soundEnabled) return;
      try {
        if (!audioCtxRef.current) {
          const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          audioCtxRef.current = new AudioContextClass();
        }
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') {
          ctx.resume();
        }
        const now = ctx.currentTime;

        if (type === 'move') {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(220, now);
          osc.frequency.exponentialRampToValueAtTime(280, now + 0.03);
          gain.gain.setValueAtTime(0.06, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.03);
        } else if (type === 'rotate') {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(440, now);
          osc.frequency.exponentialRampToValueAtTime(660, now + 0.05);
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.05);
        } else if (type === 'drop') {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(140, now);
          osc.frequency.exponentialRampToValueAtTime(50, now + 0.06);
          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.06);
        } else if (type === 'hardDrop') {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(400, now);
          osc.frequency.exponentialRampToValueAtTime(70, now + 0.1);
          gain.gain.setValueAtTime(0.15, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.1);
        } else if (type === 'clear') {
          [523.25, 659.25, 783.99].forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + idx * 0.04);
            gain.gain.setValueAtTime(0.1, now + idx * 0.04);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.15);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + idx * 0.04);
            osc.stop(now + idx * 0.04 + 0.15);
          });
        } else if (type === 'tetris' || type === 'bomb') {
          [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((freq, idx) => {
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
        } else if (type === 'gameover') {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(280, now);
          osc.frequency.exponentialRampToValueAtTime(45, now + 0.4);
          gain.gain.setValueAtTime(0.25, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.4);
        }
      } catch {}
    },
    [soundEnabled]
  );

  // Generador de piezas (Bolsa de 7 piezas + pieza cuántica ocasional)
  const getRandomPiece = useCallback((): PieceDefinition => {
    piecesCountRef.current++;
    // Cada 18 piezas aparece el Módulo Cuántico / Bomba
    if (piecesCountRef.current % 18 === 0) {
      return PIECES[7]; // Bomba
    }
    const standardPieces = PIECES.slice(0, 7);
    return standardPieces[Math.floor(Math.random() * standardPieces.length)];
  }, []);

  // Comprobar colisiones
  const checkCollision = useCallback(
    (shape: number[][], offsetX: number, offsetY: number, grid: (string | null)[][]) => {
      for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
          if (shape[r][c] !== 0) {
            const targetX = offsetX + c;
            const targetY = offsetY + r;

            // Fuera de límites horizontales o fondo
            if (targetX < 0 || targetX >= COLS || targetY >= ROWS) {
              return true;
            }
            // Colisión con bloque existente (si targetY >= 0)
            if (targetY >= 0 && grid[targetY][targetX] !== null) {
              return true;
            }
          }
        }
      }
      return false;
    },
    []
  );

  // Rotar matriz 90 grados
  const rotateMatrix = (matrix: number[][]): number[][] => {
    const N = matrix.length;
    const result: number[][] = Array.from({ length: N }, () => Array(N).fill(0));
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        result[c][N - 1 - r] = matrix[r][c];
      }
    }
    return result;
  };

  // Crear partículas
  const createExplosion = (x: number, y: number, color: string, count = 16) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 1.5;
      particlesRef.current.push({
        x: x * BLOCK_SIZE + BLOCK_SIZE / 2,
        y: y * BLOCK_SIZE + BLOCK_SIZE / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        alpha: 1,
        size: Math.random() * 3 + 2,
      });
    }
  };

  // Fijar pieza y procesar líneas / bomba
  const lockPiece = useCallback(() => {
    const current = activePieceRef.current;
    if (!current) return;

    const grid = gridRef.current;

    // Si es la bomba cuántica, detona y desintegra un radio de 3x3
    if (current.definition.isBomb) {
      playSound('bomb');
      const centerX = current.x;
      const centerY = current.y;

      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const tx = centerX + dx;
          const ty = centerY + dy;
          if (tx >= 0 && tx < COLS && ty >= 0 && ty < ROWS) {
            if (grid[ty][tx] !== null) {
              createExplosion(tx, ty, '#e11d48', 8);
              grid[ty][tx] = null;
            }
          }
        }
      }
      setScore((s) => {
        const n = s + 350;
        scoreRef.current = n;
        return n;
      });
    } else {
      // Bloquear pieza normal en la cuadrícula
      for (let r = 0; r < current.shape.length; r++) {
        for (let c = 0; c < current.shape[r].length; c++) {
          if (current.shape[r][c] !== 0) {
            const targetY = current.y + r;
            const targetX = current.x + c;
            if (targetY >= 0 && targetY < ROWS && targetX >= 0 && targetX < COLS) {
              grid[targetY][targetX] = current.definition.color;
            }
          }
        }
      }
      playSound('drop');
    }

    // Comprobación de líneas completadas
    let cleared = 0;
    for (let r = ROWS - 1; r >= 0; r--) {
      const isFull = grid[r].every((cell) => cell !== null);
      if (isFull) {
        cleared++;
        for (let c = 0; c < COLS; c++) {
          createExplosion(c, r, grid[r][c] || '#00f0ff', 4);
        }
        // Desplazar filas superiores hacia abajo
        grid.splice(r, 1);
        grid.unshift(Array(COLS).fill(null));
        r++; // Re-comprobar la misma fila tras el desplazamiento
      }
    }

    if (cleared > 0) {
      if (cleared >= 4) {
        playSound('tetris');
        confetti({
          particleCount: 45,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00f0ff', '#facc15', '#c084fc', '#f43f5e'],
        });
      } else {
        playSound('clear');
      }

      // Puntos: 1: 100, 2: 300, 3: 500, 4: 800 (x Nivel)
      const pointsTable = [0, 100, 300, 500, 800];
      const pointsWon = (pointsTable[cleared] || cleared * 200) * levelRef.current;
      setScore((s) => {
        const nextScore = s + pointsWon;
        scoreRef.current = nextScore;
        return nextScore;
      });

      setLines((l) => {
        const nextLines = l + cleared;
        linesRef.current = nextLines;
        // Subir de nivel cada 10 líneas
        const nextLevel = Math.floor(nextLines / 10) + 1;
        if (nextLevel !== levelRef.current) {
          setLevel(nextLevel);
          levelRef.current = nextLevel;
          setQuantumPulseReady(true);
        }
        return nextLines;
      });
    }

    // Permitir retener de nuevo
    canHoldRef.current = true;

    // Engendrar siguiente pieza
    const next = nextPieceRef.current;
    const startX = Math.floor((COLS - next.shape[0].length) / 2);
    const startY = 0;

    // Comprobar si al engendrar hay colisión -> GAME OVER
    if (checkCollision(next.shape, startX, startY, grid)) {
      setIsGameOver(true);
      isGameOverRef.current = true;
      playSound('gameover');
      setHighScore((h) => {
        const highest = Math.max(h, scoreRef.current);
        try {
          localStorage.setItem('desvarios_bloques_neon_highscore', highest.toString());
        } catch {}
        return highest;
      });
      return;
    }

    activePieceRef.current = {
      definition: next,
      shape: next.shape,
      x: startX,
      y: startY,
    };
    nextPieceRef.current = getRandomPiece();
  }, [checkCollision, getRandomPiece, playSound]);

  // Movimientos
  const moveLeft = useCallback(() => {
    if (isPausedRef.current || isGameOverRef.current) return;
    const p = activePieceRef.current;
    if (!p) return;
    if (!checkCollision(p.shape, p.x - 1, p.y, gridRef.current)) {
      p.x -= 1;
      playSound('move');
    }
  }, [checkCollision, playSound]);

  const moveRight = useCallback(() => {
    if (isPausedRef.current || isGameOverRef.current) return;
    const p = activePieceRef.current;
    if (!p) return;
    if (!checkCollision(p.shape, p.x + 1, p.y, gridRef.current)) {
      p.x += 1;
      playSound('move');
    }
  }, [checkCollision, playSound]);

  const moveDown = useCallback(() => {
    if (isPausedRef.current || isGameOverRef.current) return;
    const p = activePieceRef.current;
    if (!p) return;
    if (!checkCollision(p.shape, p.x, p.y + 1, gridRef.current)) {
      p.y += 1;
      setScore((s) => s + 1);
    } else {
      lockPiece();
    }
  }, [checkCollision, lockPiece]);

  const rotate = useCallback(() => {
    if (isPausedRef.current || isGameOverRef.current) return;
    const p = activePieceRef.current;
    if (!p || p.definition.isBomb) return; // La bomba 1x1 no necesita rotar
    const rotated = rotateMatrix(p.shape);

    // Detección de colisión con patada de pared (wall kick básico)
    let offset = 0;
    if (checkCollision(rotated, p.x, p.y, gridRef.current)) {
      if (!checkCollision(rotated, p.x - 1, p.y, gridRef.current)) offset = -1;
      else if (!checkCollision(rotated, p.x + 1, p.y, gridRef.current)) offset = 1;
      else if (!checkCollision(rotated, p.x - 2, p.y, gridRef.current)) offset = -2;
      else if (!checkCollision(rotated, p.x + 2, p.y, gridRef.current)) offset = 2;
      else return; // No se puede rotar
    }

    p.x += offset;
    p.shape = rotated;
    playSound('rotate');
  }, [checkCollision, playSound]);

  const hardDrop = useCallback(() => {
    if (isPausedRef.current || isGameOverRef.current) return;
    const p = activePieceRef.current;
    if (!p) return;

    let dropDist = 0;
    while (!checkCollision(p.shape, p.x, p.y + dropDist + 1, gridRef.current)) {
      dropDist++;
    }
    p.y += dropDist;
    setScore((s) => s + dropDist * 2);
    playSound('hardDrop');
    lockPiece();
  }, [checkCollision, lockPiece, playSound]);

  const holdPiece = useCallback(() => {
    if (isPausedRef.current || isGameOverRef.current || !canHoldRef.current) return;
    const p = activePieceRef.current;
    if (!p) return;

    canHoldRef.current = false;
    playSound('move');

    if (holdPieceRef.current === null) {
      holdPieceRef.current = p.definition;
      const next = nextPieceRef.current;
      activePieceRef.current = {
        definition: next,
        shape: next.shape,
        x: Math.floor((COLS - next.shape[0].length) / 2),
        y: 0,
      };
      nextPieceRef.current = getRandomPiece();
    } else {
      const temp = holdPieceRef.current;
      holdPieceRef.current = p.definition;
      activePieceRef.current = {
        definition: temp,
        shape: temp.shape,
        x: Math.floor((COLS - temp.shape[0].length) / 2),
        y: 0,
      };
    }
  }, [getRandomPiece, playSound]);

  // Disparar Pulso Cuántico especial (destruye la fila inferior más llena)
  const triggerQuantumPulse = useCallback(() => {
    if (!quantumPulseReady || isPausedRef.current || isGameOverRef.current) return;
    playSound('bomb');
    setQuantumPulseReady(false);

    // Destruir la fila no vacía más baja
    const grid = gridRef.current;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (grid[r].some((c) => c !== null)) {
        for (let c = 0; c < COLS; c++) {
          createExplosion(c, r, '#38bdf8', 6);
        }
        grid.splice(r, 1);
        grid.unshift(Array(COLS).fill(null));
        setScore((s) => s + 500);
        break;
      }
    }
  }, [playSound, quantumPulseReady]);

  // Reiniciar juego
  const restartGame = useCallback(() => {
    gridRef.current = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    particlesRef.current = [];
    piecesCountRef.current = 0;
    setScore(0);
    scoreRef.current = 0;
    setLines(0);
    linesRef.current = 0;
    setLevel(1);
    levelRef.current = 1;
    setIsGameOver(false);
    isGameOverRef.current = false;
    setIsPaused(false);
    isPausedRef.current = false;
    holdPieceRef.current = null;
    canHoldRef.current = true;
    setQuantumPulseReady(false);

    const first = getRandomPiece();
    nextPieceRef.current = getRandomPiece();
    activePieceRef.current = {
      definition: first,
      shape: first.shape,
      x: Math.floor((COLS - first.shape[0].length) / 2),
      y: 0,
    };
  }, [getRandomPiece]);

  // Teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        setIsPaused((p) => !p);
        return;
      }
      if (isPausedRef.current || isGameOverRef.current) return;

      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          moveLeft();
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          moveRight();
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          moveDown();
          break;
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          rotate();
          break;
        case ' ':
          e.preventDefault();
          hardDrop();
          break;
        case 'c':
        case 'C':
        case 'Shift':
          e.preventDefault();
          holdPiece();
          break;
        case 'q':
        case 'Q':
          if (quantumPulseReady) triggerQuantumPulse();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hardDrop, holdPiece, moveDown, moveLeft, moveRight, quantumPulseReady, rotate, triggerQuantumPulse]);

  // Inicialización de la primera pieza
  useEffect(() => {
    restartGame();
  }, [restartGame]);

  // Bucle principal de animación y render a 60 FPS
  useEffect(() => {
    let animId: number;

    const gameLoop = (time: number) => {
      animId = requestAnimationFrame(gameLoop);

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const deltaTime = time - lastTimeRef.current;
      lastTimeRef.current = time;

      // Velocidad de caída calculada por nivel (en ms)
      const dropInterval = Math.max(100, 800 - (levelRef.current - 1) * 65);

      if (!isPausedRef.current && !isGameOverRef.current) {
        dropCounterRef.current += deltaTime;
        if (dropCounterRef.current > dropInterval) {
          dropCounterRef.current = 0;
          const p = activePieceRef.current;
          if (p) {
            if (!checkCollision(p.shape, p.x, p.y + 1, gridRef.current)) {
              p.y += 1;
            } else {
              lockPiece();
            }
          }
        }
      }

      // 1. Limpiar canvas y fondo synthwave
      ctx.fillStyle = '#0b0f19';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Cuadrícula sutil
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      for (let c = 0; c <= COLS; c++) {
        ctx.beginPath();
        ctx.moveTo(c * BLOCK_SIZE, 0);
        ctx.lineTo(c * BLOCK_SIZE, ROWS * BLOCK_SIZE);
        ctx.stroke();
      }
      for (let r = 0; r <= ROWS; r++) {
        ctx.beginPath();
        ctx.moveTo(0, r * BLOCK_SIZE);
        ctx.lineTo(COLS * BLOCK_SIZE, r * BLOCK_SIZE);
        ctx.stroke();
      }

      // 2. Renderizar bloques estáticos fijados
      const grid = gridRef.current;
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const color = grid[r][c];
          if (color) {
            drawNeonBlock(ctx, c * BLOCK_SIZE, r * BLOCK_SIZE, color);
          }
        }
      }

      // 3. Renderizar pieza fantasma (Ghost Piece)
      const active = activePieceRef.current;
      if (active && !isGameOverRef.current) {
        let ghostDist = 0;
        while (!checkCollision(active.shape, active.x, active.y + ghostDist + 1, grid)) {
          ghostDist++;
        }
        if (ghostDist > 0) {
          ctx.save();
          ctx.strokeStyle = active.definition.glow;
          ctx.lineWidth = 1.5;
          ctx.setLineDash([3, 3]);
          for (let r = 0; r < active.shape.length; r++) {
            for (let c = 0; c < active.shape[r].length; c++) {
              if (active.shape[r][c] !== 0) {
                const gx = (active.x + c) * BLOCK_SIZE;
                const gy = (active.y + ghostDist + r) * BLOCK_SIZE;
                ctx.strokeRect(gx + 2, gy + 2, BLOCK_SIZE - 4, BLOCK_SIZE - 4);
              }
            }
          }
          ctx.restore();
        }

        // 4. Renderizar pieza activa
        for (let r = 0; r < active.shape.length; r++) {
          for (let c = 0; c < active.shape[r].length; c++) {
            if (active.shape[r][c] !== 0) {
              const px = (active.x + c) * BLOCK_SIZE;
              const py = (active.y + r) * BLOCK_SIZE;
              drawNeonBlock(ctx, px, py, active.definition.color, active.definition.isBomb);
            }
          }
        }
      }

      // 5. Renderizar partículas
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.025;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
        } else {
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      // 6. Renderizar preview de siguiente pieza y hold
      renderMiniPreview(nextCanvasRef.current, nextPieceRef.current);
      renderMiniPreview(holdCanvasRef.current, holdPieceRef.current);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [checkCollision, lockPiece]);

  // Dibujar bloque neón con bisel y sombreado luminoso
  const drawNeonBlock = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: string,
    isBomb = false
  ) => {
    ctx.save();
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;

    // Relleno principal
    ctx.fillStyle = color;
    ctx.fillRect(x + 2, y + 2, BLOCK_SIZE - 4, BLOCK_SIZE - 4);

    // Bisel superior iluminado
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillRect(x + 2, y + 2, BLOCK_SIZE - 4, 3);
    ctx.fillRect(x + 2, y + 2, 3, BLOCK_SIZE - 4);

    // Bisel inferior oscuro
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(x + 2, y + BLOCK_SIZE - 5, BLOCK_SIZE - 4, 3);
    ctx.fillRect(x + BLOCK_SIZE - 5, y + 2, 3, BLOCK_SIZE - 4);

    // Si es la bomba, dibujar icono cuántico
    if (isBomb) {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(x + BLOCK_SIZE / 2, y + BLOCK_SIZE / 2, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  };

  // Renderizar vistas previas (Next & Hold)
  const renderMiniPreview = (canvas: HTMLCanvasElement | null, piece: PieceDefinition | null) => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!piece) return;

    const miniSize = 18;
    const shape = piece.shape;
    const offX = (canvas.width - shape[0].length * miniSize) / 2;
    const offY = (canvas.height - shape.length * miniSize) / 2;

    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c] !== 0) {
          ctx.save();
          ctx.fillStyle = piece.color;
          ctx.shadowColor = piece.color;
          ctx.shadowBlur = 6;
          ctx.fillRect(offX + c * miniSize + 1, offY + r * miniSize + 1, miniSize - 2, miniSize - 2);
          ctx.restore();
        }
      }
    }
  };

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
          maxWidth: '820px',
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
              color: soundEnabled ? '#38bdf8' : '#64748b',
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

      {/* Cabecera del Juego */}
      <header style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
        <h1
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)',
            fontWeight: 800,
            color: '#38bdf8',
            textShadow: '0 0 25px rgba(56, 189, 248, 0.4)',
            marginBottom: '0.2rem',
          }}
        >
          Bloques Neón: Matriz Cuántica
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>
          Alinea los módulos poliominós, desata combos de luz y pulveriza tu récord.
        </p>
      </header>

      {/* Contenedor Principal: Paneles laterales + Tablero */}
      <div
        style={{
          display: 'flex',
          gap: '1.25rem',
          alignItems: 'flex-start',
          justifyContent: 'center',
          flexWrap: 'wrap',
          maxWidth: '840px',
          width: '100%',
        }}
      >
        {/* Panel Izquierdo: Hold & Estadísticas */}
        <aside
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
            width: '125px',
          }}
        >
          {/* Reserva (Hold) */}
          <div
            style={{
              background: 'rgba(18, 24, 38, 0.85)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              borderRadius: '12px',
              padding: '0.75rem',
              textAlign: 'center',
              boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
            }}
          >
            <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
              Reserva (C)
            </span>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.4rem' }}>
              <canvas
                ref={holdCanvasRef}
                width={80}
                height={70}
                style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '6px' }}
              />
            </div>
          </div>

          {/* Récord */}
          <div
            style={{
              background: 'rgba(18, 24, 38, 0.85)',
              border: '1px solid rgba(250, 204, 21, 0.3)',
              borderRadius: '12px',
              padding: '0.75rem',
              textAlign: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', color: '#facc15' }}>
              <Trophy size={14} />
              <span style={{ fontSize: '0.72rem', fontWeight: 700 }}>RÉCORD</span>
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', marginTop: '0.2rem' }}>
              {highScore}
            </div>
          </div>

          {/* Nivel */}
          <div
            style={{
              background: 'rgba(18, 24, 38, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '0.75rem',
              textAlign: 'center',
            }}
          >
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>NIVEL</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#38bdf8', marginTop: '0.2rem' }}>
              {level}
            </div>
          </div>

          {/* Pulso Cuántico (Power-up) */}
          {quantumPulseReady && (
            <button
              onClick={triggerQuantumPulse}
              style={{
                background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
                border: 'none',
                color: '#ffffff',
                padding: '0.6rem 0.5rem',
                borderRadius: '10px',
                fontWeight: 800,
                fontSize: '0.74rem',
                cursor: 'pointer',
                boxShadow: '0 0 15px rgba(56, 189, 248, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.3rem',
                animation: 'pulse 1.5s infinite',
              }}
            >
              <Zap size={14} /> PULSO [Q]
            </button>
          )}
        </aside>

        {/* Tablero de Juego Central */}
        <main
          style={{
            position: 'relative',
            background: 'rgba(11, 15, 25, 0.95)',
            border: '2px solid rgba(56, 189, 248, 0.4)',
            borderRadius: '14px',
            overflow: 'hidden',
            boxShadow: '0 0 35px rgba(56, 189, 248, 0.25), inset 0 0 20px rgba(0,0,0,0.8)',
          }}
        >
          <canvas
            ref={canvasRef}
            width={COLS * BLOCK_SIZE}
            height={ROWS * BLOCK_SIZE}
            style={{ display: 'block' }}
          />

          {/* Modal de Pausa */}
          {isPaused && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(7, 10, 18, 0.85)',
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
                  background: '#38bdf8',
                  color: '#070a12',
                  border: 'none',
                  padding: '0.6rem 1.5rem',
                  borderRadius: '9999px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: '0.92rem',
                }}
              >
                Reanudar
              </button>
            </div>
          )}

          {/* Modal de Game Over */}
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
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f43f5e' }}>MATRIZ SATURADA</h2>
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
                  background: '#38bdf8',
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
        </main>

        {/* Panel Derecho: Siguiente Módulo & Puntos */}
        <aside
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
            width: '125px',
          }}
        >
          {/* Siguiente pieza */}
          <div
            style={{
              background: 'rgba(18, 24, 38, 0.85)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              borderRadius: '12px',
              padding: '0.75rem',
              textAlign: 'center',
              boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
            }}
          >
            <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
              Siguiente
            </span>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.4rem' }}>
              <canvas
                ref={nextCanvasRef}
                width={80}
                height={70}
                style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '6px' }}
              />
            </div>
          </div>

          {/* Puntos */}
          <div
            style={{
              background: 'rgba(18, 24, 38, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '0.75rem',
              textAlign: 'center',
            }}
          >
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>PUNTOS</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginTop: '0.2rem' }}>
              {score}
            </div>
          </div>

          {/* Líneas */}
          <div
            style={{
              background: 'rgba(18, 24, 38, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '0.75rem',
              textAlign: 'center',
            }}
          >
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>LÍNEAS</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#4ade80', marginTop: '0.2rem' }}>
              {lines}
            </div>
          </div>
        </aside>
      </div>

      {/* Controles Táctiles en Pantalla (Mobile / Responsive) */}
      <div
        style={{
          marginTop: '1.5rem',
          maxWidth: '420px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.6rem',
          padding: '0 0.5rem',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={holdPiece}
            style={touchButtonStyle('#c084fc')}
          >
            📥 Hold
          </button>
          <button
            type="button"
            onClick={rotate}
            style={touchButtonStyle('#facc15')}
          >
            ↻ Rotar
          </button>
          <button
            type="button"
            onClick={hardDrop}
            style={touchButtonStyle('#38bdf8')}
          >
            ⚡ Drop
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={moveLeft}
            style={touchButtonStyle('#00f0ff')}
          >
            ◀ Izq
          </button>
          <button
            type="button"
            onClick={moveDown}
            style={touchButtonStyle('#4ade80')}
          >
            ▼ Suave
          </button>
          <button
            type="button"
            onClick={moveRight}
            style={touchButtonStyle('#00f0ff')}
          >
            Der ▶
          </button>
        </div>
      </div>

      {/* Instrucciones de teclado para Desktop */}
      <div
        style={{
          marginTop: '1.25rem',
          color: '#64748b',
          fontSize: '0.78rem',
          textAlign: 'center',
          maxWidth: '540px',
          lineHeight: '1.5',
        }}
      >
        ⌨️ <strong>Teclado:</strong> [← / →] Mover · [↑ / W] Rotar · [↓ / S] Caída suave · [Espacio] Caída rápida · [C] Reservar pieza · [P] Pausa
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
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: '16px',
              padding: '1.75rem',
              maxWidth: '480px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1.3rem', color: '#38bdf8', marginBottom: '0.8rem', fontWeight: 800 }}>
              Cómo Jugar a Bloques Neón
            </h3>
            <ul style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: '1.6', paddingLeft: '1.2rem', marginBottom: '1.2rem' }}>
              <li><strong>Objetivo:</strong> Rellena filas horizontales completas para desintegrarlas antes de que los bloques alcancen el techo.</li>
              <li><strong>Módulo Bomba:</strong> Cada 18 piezas aparece un núcleo rojo pulsante que hace explotar un área de 3x3 al impactar.</li>
              <li><strong>Reserva Cuántica (Hold):</strong> Pulsa <code>C</code> o el botón Hold para guardar una pieza para el momento óptimo.</li>
              <li><strong>Nivel y Velocidad:</strong> Cada 10 líneas la gravedad se incrementa y se desbloquea un Pulso Cuántico [Q].</li>
            </ul>
            <button
              onClick={() => setShowHelp(false)}
              style={{
                width: '100%',
                background: '#38bdf8',
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

function touchButtonStyle(color: string): React.CSSProperties {
  return {
    background: 'rgba(18, 24, 38, 0.9)',
    border: `1px solid ${color}55`,
    color: color,
    padding: '0.75rem 0.4rem',
    borderRadius: '10px',
    fontWeight: 700,
    fontSize: '0.84rem',
    cursor: 'pointer',
    touchAction: 'manipulation',
    userSelect: 'none',
    boxShadow: `0 2px 8px ${color}18`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };
}
