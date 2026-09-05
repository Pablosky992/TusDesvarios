'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  RotateCcw,
  Trophy,
  Flag,
  HelpCircle,
  Sparkles,
  Zap,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export type Difficulty = 'facil' | 'medio' | 'dificil';

interface DifficultyConfig {
  name: string;
  rows: number;
  cols: number;
  mines: number;
  label: string;
  color: string;
}

const DIFFICULTIES: Record<Difficulty, DifficultyConfig> = {
  facil: {
    name: 'Principiante',
    rows: 9,
    cols: 9,
    mines: 10,
    label: '🟢 Principiante (9×9 · 10 minas)',
    color: '#34d399',
  },
  medio: {
    name: 'Intermedio',
    rows: 16,
    cols: 16,
    mines: 40,
    label: '🟡 Intermedio (16×16 · 40 minas)',
    color: '#fbbf24',
  },
  dificil: {
    name: 'Experto',
    rows: 16,
    cols: 30,
    mines: 99,
    label: '🔴 Experto (16×30 · 99 minas)',
    color: '#f87171',
  },
};

interface Cell {
  row: number;
  col: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  isQuestion: boolean;
  neighborMines: number;
  exploded?: boolean;
}

const NUMBER_COLORS: Record<number, string> = {
  1: '#38bdf8', // Cyan brillante
  2: '#4ade80', // Verde
  3: '#f87171', // Rojo suave
  4: '#818cf8', // Azul índigo
  5: '#fb923c', // Naranja
  6: '#2dd4bf', // Turquesa
  7: '#e879f9', // Magenta
  8: '#cbd5e1', // Blanco plata
};

export default function BuscaminasGame() {
  const [difficulty, setDifficulty] = useState<Difficulty>('facil');
  const config = DIFFICULTIES[difficulty];

  const [grid, setGrid] = useState<Cell[][]>([]);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isVictory, setIsVictory] = useState<boolean>(false);
  const [isPressing, setIsPressing] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);
  const [flagsCount, setFlagsCount] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [mobileTool, setMobileTool] = useState<'dig' | 'flag'>('dig');
  const [bestTime, setBestTime] = useState<number | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Cargar récord de LocalStorage al cambiar dificultad
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`buscaminas_best_${difficulty}`);
      if (saved) {
        setBestTime(parseInt(saved, 10));
      } else {
        setBestTime(null);
      }
    } catch {}
  }, [difficulty]);

  // Sintetizador de audio 8-bit con Web Audio API
  const playSound = useCallback(
    (type: 'click' | 'flag' | 'cascade' | 'explode' | 'win') => {
      if (!soundEnabled) return;
      try {
        const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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

        if (type === 'click') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(600, now);
          osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
          osc.start(now);
          osc.stop(now + 0.05);
        } else if (type === 'flag') {
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(440, now);
          osc.frequency.setValueAtTime(880, now + 0.04);
          gain.gain.setValueAtTime(0.15, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
          osc.start(now);
          osc.stop(now + 0.1);
        } else if (type === 'cascade') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(350, now);
          osc.frequency.exponentialRampToValueAtTime(700, now + 0.12);
          gain.gain.setValueAtTime(0.1, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
          osc.start(now);
          osc.stop(now + 0.12);
        } else if (type === 'explode') {
          // Ruido de explosión retro
          const bufferSize = ctx.sampleRate * 0.4;
          const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
          }
          const noise = ctx.createBufferSource();
          noise.buffer = buffer;
          const noiseFilter = ctx.createBiquadFilter();
          noiseFilter.type = 'lowpass';
          noiseFilter.frequency.setValueAtTime(800, now);
          noiseFilter.frequency.exponentialRampToValueAtTime(50, now + 0.4);

          const noiseGain = ctx.createGain();
          noiseGain.gain.setValueAtTime(0.3, now);
          noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

          noise.connect(noiseFilter);
          noiseFilter.connect(noiseGain);
          noiseGain.connect(ctx.destination);
          noise.start(now);
          noise.stop(now + 0.4);
        } else if (type === 'win') {
          // Fanfarria arpegiada de victoria
          const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
          notes.forEach((freq, idx) => {
            const noteOsc = ctx.createOscillator();
            const noteGain = ctx.createGain();
            noteOsc.type = 'triangle';
            noteOsc.frequency.setValueAtTime(freq, now + idx * 0.1);
            noteGain.gain.setValueAtTime(0.2, now + idx * 0.1);
            noteGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.25);
            noteOsc.connect(noteGain);
            noteGain.connect(ctx.destination);
            noteOsc.start(now + idx * 0.1);
            noteOsc.stop(now + idx * 0.1 + 0.25);
          });
        }
      } catch {}
    },
    [soundEnabled]
  );

  // Inicializar cuadrícula vacía
  const createEmptyGrid = useCallback((rows: number, cols: number): Cell[][] => {
    const newGrid: Cell[][] = [];
    for (let r = 0; r < rows; r++) {
      const row: Cell[] = [];
      for (let c = 0; c < cols; c++) {
        row.push({
          row: r,
          col: c,
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          isQuestion: false,
          neighborMines: 0,
        });
      }
      newGrid.push(row);
    }
    return newGrid;
  }, []);

  // Reiniciar partida
  const resetGame = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setGrid(createEmptyGrid(config.rows, config.cols));
    setIsStarted(false);
    setIsGameOver(false);
    setIsVictory(false);
    setIsPressing(false);
    setTimer(0);
    setFlagsCount(0);
  }, [config.rows, config.cols, createEmptyGrid]);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  // Manejador del cronómetro
  useEffect(() => {
    if (isStarted && !isGameOver && !isVictory) {
      timerRef.current = setInterval(() => {
        setTimer((t) => Math.min(999, t + 1));
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isStarted, isGameOver, isVictory]);

  // Plantar minas garantizando primer clic 100% seguro con zona libre
  const plantMines = (initialRow: number, initialCol: number, baseGrid: Cell[][]): Cell[][] => {
    const rows = config.rows;
    const cols = config.cols;
    const totalMines = config.mines;

    // Crear lista de coordenadas candidatas excluyendo la casilla inicial y sus 8 vecinas
    const safeCoords = new Set<string>();
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const nr = initialRow + dr;
        const nc = initialCol + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          safeCoords.add(`${nr},${nc}`);
        }
      }
    }

    const candidates: [number, number][] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!safeCoords.has(`${r},${c}`)) {
          candidates.push([r, c]);
        }
      }
    }

    // Mezclar candidatos (Fisher-Yates)
    for (let i = candidates.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
    }

    const newGrid = baseGrid.map((row) => row.map((cell) => ({ ...cell })));

    // Colocar minas
    const placedMines = Math.min(totalMines, candidates.length);
    for (let i = 0; i < placedMines; i++) {
      const [r, c] = candidates[i];
      newGrid[r][c].isMine = true;
    }

    // Calcular números de minas vecinas
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!newGrid[r][c].isMine) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr;
              const nc = c + dc;
              if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && newGrid[nr][nc].isMine) {
                count++;
              }
            }
          }
          newGrid[r][c].neighborMines = count;
        }
      }
    }

    return newGrid;
  };

  // Comprobar si se ha ganado
  const checkVictory = (currentGrid: Cell[][]): boolean => {
    let unrevealedSafeCells = 0;
    for (let r = 0; r < config.rows; r++) {
      for (let c = 0; c < config.cols; c++) {
        const cell = currentGrid[r][c];
        if (!cell.isMine && !cell.isRevealed) {
          unrevealedSafeCells++;
        }
      }
    }
    return unrevealedSafeCells === 0;
  };

  // Revelar celda y apertura en cascada (Flood Fill)
  const revealCell = (r: number, c: number) => {
    if (isGameOver || isVictory) return;

    let activeGrid = grid;

    // Primer clic: generar minas y arrancar
    if (!isStarted) {
      activeGrid = plantMines(r, c, grid);
      setIsStarted(true);
    }

    const targetCell = activeGrid[r][c];
    if (targetCell.isRevealed || targetCell.isFlagged) return;

    // Si es mina: ¡Derrota!
    if (targetCell.isMine) {
      playSound('explode');
      setIsGameOver(true);
      const revealedGrid = activeGrid.map((row) =>
        row.map((cell) => {
          if (cell.row === r && cell.col === c) {
            return { ...cell, isRevealed: true, exploded: true };
          }
          if (cell.isMine) {
            return { ...cell, isRevealed: true };
          }
          return cell;
        })
      );
      setGrid(revealedGrid);
      return;
    }

    // Apertura en cascada mediante cola BFS
    const nextGrid = activeGrid.map((row) => row.map((cell) => ({ ...cell })));
    const queue: [number, number][] = [[r, c]];
    nextGrid[r][c].isRevealed = true;
    let openedZero = false;

    while (queue.length > 0) {
      const [currR, currC] = queue.shift()!;
      const currCell = nextGrid[currR][currC];

      if (currCell.neighborMines === 0) {
        openedZero = true;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = currR + dr;
            const nc = currC + dc;
            if (nr >= 0 && nr < config.rows && nc >= 0 && nc < config.cols) {
              const neighbor = nextGrid[nr][nc];
              if (!neighbor.isRevealed && !neighbor.isFlagged && !neighbor.isMine) {
                neighbor.isRevealed = true;
                if (neighbor.neighborMines === 0) {
                  queue.push([nr, nc]);
                }
              }
            }
          }
        }
      }
    }

    if (openedZero) {
      playSound('cascade');
    } else {
      playSound('click');
    }

    // Comprobar si se ha ganado
    if (checkVictory(nextGrid)) {
      setIsVictory(true);
      playSound('win');
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#10b981', '#38bdf8', '#fbbf24', '#ffffff'],
        });
      } catch {}

      // Guardar récord de tiempo
      const finalTime = timer;
      if (bestTime === null || finalTime < bestTime) {
        setBestTime(finalTime);
        try {
          localStorage.setItem(`buscaminas_best_${difficulty}`, finalTime.toString());
        } catch {}
      }

      // Marcar todas las minas restantes con bandera
      for (let row = 0; row < config.rows; row++) {
        for (let col = 0; col < config.cols; col++) {
          if (nextGrid[row][col].isMine) {
            nextGrid[row][col].isFlagged = true;
          }
        }
      }
      setFlagsCount(config.mines);
    }

    setGrid(nextGrid);
  };

  // Alternar bandera / duda
  const toggleFlag = (r: number, c: number) => {
    if (isGameOver || isVictory) return;
    const cell = grid[r][c];
    if (cell.isRevealed) return;

    playSound('flag');
    const nextGrid = grid.map((row) => row.map((cCell) => ({ ...cCell })));
    const target = nextGrid[r][c];

    if (!target.isFlagged && !target.isQuestion) {
      target.isFlagged = true;
      setFlagsCount((f) => f + 1);
    } else if (target.isFlagged) {
      target.isFlagged = false;
      target.isQuestion = true;
      setFlagsCount((f) => Math.max(0, f - 1));
    } else {
      target.isQuestion = false;
    }

    setGrid(nextGrid);
  };

  // Chording: doble clic / clic en número ya revelado con banderas coincidentes
  const handleChording = (r: number, c: number) => {
    if (isGameOver || isVictory) return;
    const cell = grid[r][c];
    if (!cell.isRevealed || cell.neighborMines === 0) return;

    // Contar banderas alrededor
    let adjacentFlags = 0;
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < config.rows && nc >= 0 && nc < config.cols) {
          if (grid[nr][nc].isFlagged) adjacentFlags++;
        }
      }
    }

    // Si coinciden las banderas con el número, abrir las demás
    if (adjacentFlags === cell.neighborMines) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < config.rows && nc >= 0 && nc < config.cols) {
            if (!grid[nr][nc].isRevealed && !grid[nr][nc].isFlagged) {
              revealCell(nr, nc);
            }
          }
        }
      }
    }
  };

  // Manejador de clics de ratón
  const handleCellClick = (r: number, c: number, e: React.MouseEvent) => {
    e.preventDefault();
    if (mobileTool === 'flag') {
      toggleFlag(r, c);
    } else {
      if (grid[r][c].isRevealed) {
        handleChording(r, c);
      } else {
        revealCell(r, c);
      }
    }
  };

  const handleCellContextMenu = (r: number, c: number, e: React.MouseEvent) => {
    e.preventDefault();
    toggleFlag(r, c);
  };

  // Pulsación táctil larga para móviles
  const handleTouchStart = (r: number, c: number) => {
    longPressTimerRef.current = setTimeout(() => {
      toggleFlag(r, c);
      if (navigator.vibrate) navigator.vibrate(40);
    }, 400);
  };

  const handleTouchEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
  };

  const remainingMines = config.mines - flagsCount;

  // Carita emoticono
  const getFaceEmoji = () => {
    if (isVictory) return '😎';
    if (isGameOver) return '💀';
    if (isPressing) return '😮';
    return '🙂';
  };

  return (
    <div className="home-container" style={{ maxWidth: '1080px', margin: '0 auto', paddingBottom: '4rem' }}>
      {/* Breadcrumb */}
      <div className="breadcrumb-nav" style={{ marginBottom: '1.25rem' }}>
        <Link href="/desvarios-retro" className="breadcrumb-link">
          <ArrowLeft size={16} />
          <span>Volver a Desvaríos Retro</span>
        </Link>
      </div>

      {/* Header */}
      <header className="hero-section" style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 0.9rem',
            background: 'rgba(245, 158, 11, 0.12)',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            borderRadius: '9999px',
            color: '#fbbf24',
            fontSize: '0.82rem',
            fontWeight: 700,
            marginBottom: '0.75rem',
          }}
        >
          <span>💣</span>
          <span>Desafío de Lógica Deductiva</span>
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-cinzel), serif',
            fontSize: 'clamp(2rem, 4vw, 2.75rem)',
            fontWeight: 900,
            letterSpacing: '0.04em',
            marginBottom: '0.5rem',
            background: 'linear-gradient(135deg, #fff 40%, #fbbf24 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Buscaminas Desvariado
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '580px', margin: '0 auto' }}>
          Desactiva todas las anomalías de la cuadrícula. Clic izquierdo para explorar, clic derecho o botón táctil para marcar banderas.
        </p>
      </header>

      {/* Controls Bar: Difficulty & Audio */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          marginBottom: '1.25rem',
          padding: '0.75rem 1.25rem',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {(Object.keys(DIFFICULTIES) as Difficulty[]).map((diffKey) => {
            const isSelected = difficulty === diffKey;
            const diff = DIFFICULTIES[diffKey];
            return (
              <button
                key={diffKey}
                onClick={() => setDifficulty(diffKey)}
                style={{
                  padding: '0.45rem 0.9rem',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  border: isSelected ? `1.5px solid ${diff.color}` : '1px solid rgba(255,255,255,0.12)',
                  background: isSelected ? `${diff.color}22` : 'rgba(255,255,255,0.04)',
                  color: isSelected ? diff.color : 'var(--text-secondary)',
                  boxShadow: isSelected ? `0 0 15px ${diff.color}33` : 'none',
                }}
              >
                {diff.name}
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {bestTime !== null && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.8rem',
                color: '#fbbf24',
                background: 'rgba(245, 158, 11, 0.12)',
                padding: '0.3rem 0.65rem',
                borderRadius: '6px',
                border: '1px solid rgba(245, 158, 11, 0.3)',
              }}
              title="Tu mejor récord en esta dificultad"
            >
              <Trophy size={14} />
              <span>Récord: {bestTime}s</span>
            </div>
          )}

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
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span>{soundEnabled ? 'Sonido ON' : 'Mute'}</span>
          </button>
        </div>
      </div>

      {/* Main Arcade Frame */}
      <div
        style={{
          margin: '0 auto',
          padding: '1.25rem',
          borderRadius: '16px',
          background: 'linear-gradient(180deg, #181c24 0%, #0d1117 100%)',
          border: '2px solid rgba(245, 158, 11, 0.35)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6), 0 0 35px rgba(245, 158, 11, 0.12)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Score & Displays Header (Windows 95 / Retro LED Style) */}
        <div
          style={{
            width: '100%',
            maxWidth: difficulty === 'dificil' ? '920px' : difficulty === 'medio' ? '540px' : '360px',
            marginBottom: '1rem',
            padding: '0.75rem 1.25rem',
            background: 'linear-gradient(180deg, #222734 0%, #171b26 100%)',
            borderRadius: '10px',
            border: '2px solid #333d4e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.6)',
          }}
        >
          {/* LED Mines Counter */}
          <div
            style={{
              background: '#0a0d14',
              border: '2px solid #202738',
              borderRadius: '6px',
              padding: '0.35rem 0.65rem',
              fontFamily: 'monospace',
              fontSize: '1.5rem',
              fontWeight: 900,
              color: '#ef4444',
              letterSpacing: '0.1em',
              minWidth: '72px',
              textAlign: 'center',
              boxShadow: 'inset 0 0 10px rgba(239, 68, 68, 0.3)',
              textShadow: '0 0 8px rgba(239, 68, 68, 0.7)',
            }}
            title="Minas restantes"
          >
            {String(Math.max(-99, Math.min(999, remainingMines))).padStart(3, '0')}
          </div>

          {/* Reset Face Button */}
          <button
            onClick={resetGame}
            title="Reiniciar partida"
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              fontSize: '1.6rem',
              background: 'linear-gradient(145deg, #333d4e, #202633)',
              border: '2px solid #fbbf24',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.1s ease, box-shadow 0.2s',
              boxShadow: '0 4px 12px rgba(0,0,0,0.4), 0 0 15px rgba(245, 158, 11, 0.3)',
            }}
            onMouseDown={() => setIsPressing(true)}
            onMouseUp={() => setIsPressing(false)}
          >
            {getFaceEmoji()}
          </button>

          {/* LED Timer Display */}
          <div
            style={{
              background: '#0a0d14',
              border: '2px solid #202738',
              borderRadius: '6px',
              padding: '0.35rem 0.65rem',
              fontFamily: 'monospace',
              fontSize: '1.5rem',
              fontWeight: 900,
              color: '#ef4444',
              letterSpacing: '0.1em',
              minWidth: '72px',
              textAlign: 'center',
              boxShadow: 'inset 0 0 10px rgba(239, 68, 68, 0.3)',
              textShadow: '0 0 8px rgba(239, 68, 68, 0.7)',
            }}
            title="Tiempo en segundos"
          >
            {String(timer).padStart(3, '0')}
          </div>
        </div>

        {/* Mobile Action Mode Switcher */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.85rem',
          }}
        >
          <button
            type="button"
            onClick={() => setMobileTool('dig')}
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              border: mobileTool === 'dig' ? '1.5px solid #38bdf8' : '1px solid rgba(255,255,255,0.1)',
              background: mobileTool === 'dig' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255,255,255,0.04)',
              color: mobileTool === 'dig' ? '#38bdf8' : 'var(--text-secondary)',
              boxShadow: mobileTool === 'dig' ? '0 0 14px rgba(56, 189, 248, 0.3)' : 'none',
            }}
          >
            <span>⛏️</span>
            <span>Descubrir</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileTool('flag')}
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              border: mobileTool === 'flag' ? '1.5px solid #f87171' : '1px solid rgba(255,255,255,0.1)',
              background: mobileTool === 'flag' ? 'rgba(248, 113, 113, 0.2)' : 'rgba(255,255,255,0.04)',
              color: mobileTool === 'flag' ? '#f87171' : 'var(--text-secondary)',
              boxShadow: mobileTool === 'flag' ? '0 0 14px rgba(248, 113, 113, 0.3)' : 'none',
            }}
          >
            <Flag size={14} />
            <span>Poner Bandera</span>
          </button>
        </div>

        {/* Scrollable Board Wrapper */}
        <div
          style={{
            maxWidth: '100%',
            overflowX: 'auto',
            padding: '0.5rem',
            background: '#12161f',
            borderRadius: '10px',
            border: '2px solid #232a38',
            boxShadow: 'inset 0 4px 15px rgba(0,0,0,0.5)',
          }}
          onMouseDown={() => setIsPressing(true)}
          onMouseUp={() => setIsPressing(false)}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${config.cols}, 30px)`,
              gridTemplateRows: `repeat(${config.rows}, 30px)`,
              gap: '2px',
              userSelect: 'none',
              touchAction: 'manipulation',
            }}
          >
            {grid.map((row, r) =>
              row.map((cell, c) => {
                const isCellRevealed = cell.isRevealed;
                const isCellMine = cell.isMine;
                const isCellFlagged = cell.isFlagged;
                const isCellQuestion = cell.isQuestion;
                const num = cell.neighborMines;

                let cellBackground = 'linear-gradient(180deg, #2b3345 0%, #1f2533 100%)';
                let cellBorder = '1px solid #3d475d';
                let cellShadow = 'inset 1px 1px 0 rgba(255,255,255,0.15), 0 2px 4px rgba(0,0,0,0.3)';

                if (isCellRevealed) {
                  cellBackground = cell.exploded
                    ? 'radial-gradient(circle, #ef4444 0%, #991b1b 100%)'
                    : '#141822';
                  cellBorder = cell.exploded ? '1.5px solid #ef4444' : '1px solid #1a202c';
                  cellShadow = 'inset 0 1px 4px rgba(0,0,0,0.7)';
                }

                return (
                  <button
                    key={`${r}-${c}`}
                    type="button"
                    onClick={(e) => handleCellClick(r, c, e)}
                    onContextMenu={(e) => handleCellContextMenu(r, c, e)}
                    onTouchStart={() => handleTouchStart(r, c)}
                    onTouchEnd={handleTouchEnd}
                    style={{
                      width: '30px',
                      height: '30px',
                      padding: 0,
                      margin: 0,
                      borderRadius: '4px',
                      background: cellBackground,
                      border: cellBorder,
                      boxShadow: cellShadow,
                      fontSize: '0.92rem',
                      fontWeight: 900,
                      cursor: isCellRevealed ? (num > 0 ? 'pointer' : 'default') : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background 0.1s',
                      color: isCellRevealed && num > 0 ? NUMBER_COLORS[num] : '#f8fafc',
                    }}
                  >
                    {isCellRevealed ? (
                      isCellMine ? (
                        <span>{cell.exploded ? '💥' : '💣'}</span>
                      ) : num > 0 ? (
                        <span>{num}</span>
                      ) : null
                    ) : isCellFlagged ? (
                      <span style={{ color: '#ef4444' }}>🚩</span>
                    ) : isCellQuestion ? (
                      <span style={{ color: '#fbbf24' }}>❓</span>
                    ) : null}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Victory / Game Over Overlay Notice */}
        {(isVictory || isGameOver) && (
          <div
            style={{
              marginTop: '1.25rem',
              padding: '1rem 1.5rem',
              borderRadius: '12px',
              maxWidth: '460px',
              width: '100%',
              textAlign: 'center',
              border: isVictory ? '1.5px solid #10b981' : '1.5px solid #ef4444',
              background: isVictory ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
              backdropFilter: 'blur(8px)',
              boxShadow: isVictory ? '0 0 25px rgba(16, 185, 129, 0.25)' : '0 0 25px rgba(239, 68, 68, 0.25)',
            }}
          >
            {isVictory ? (
              <>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#34d399', marginBottom: '0.35rem' }}>
                  🏆 ¡VICTORIA! MINAS DESACTIVADAS
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                  Has completado el modo {config.name} en <strong>{timer} segundos</strong> con precisión impecable.
                </p>
              </>
            ) : (
              <>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#f87171', marginBottom: '0.35rem' }}>
                  💥 ¡BOOM! HAS DETONADO UNA MINA
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                  Una anomalía estalló bajo tus pies. Respira hondo y vuelve a intentarlo.
                </p>
              </>
            )}

            <button
              onClick={resetGame}
              className="btn-primary"
              style={{ padding: '0.6rem 1.4rem', fontSize: '0.88rem' }}
            >
              <RotateCcw size={16} />
              <span>Jugar de nuevo</span>
            </button>
          </div>
        )}
      </div>

      {/* Instructions & Help */}
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
            color: '#fbbf24',
          }}
        >
          <HelpCircle size={18} />
          <span>¿Cómo jugar al Buscaminas?</span>
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1rem',
            fontSize: '0.86rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
          }}
        >
          <div>
            <strong style={{ color: '#fff' }}>🎯 Objetivo:</strong> Descubrir todas las casillas seguras sin pisar ninguna mina oculta en el tablero.
          </div>
          <div>
            <strong style={{ color: '#fff' }}>🛡️ Primer Clic Seguro:</strong> Tu primera casilla siempre estará despejada y abrirá una zona inicial cómoda.
          </div>
          <div>
            <strong style={{ color: '#fff' }}>🔢 Los Números:</strong> Cada número indica cuántas minas hay en las 8 casillas circundantes (adyacentes).
          </div>
          <div>
            <strong style={{ color: '#fff' }}>🚩 Banderas:</strong> Usa el botón derecho del ratón o el modo bandera en móvil para señalar las casillas donde sospechas que hay minas.
          </div>
        </div>
      </section>
    </div>
  );
}
