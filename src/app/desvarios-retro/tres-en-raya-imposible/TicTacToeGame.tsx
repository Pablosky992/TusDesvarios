'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  RotateCcw,
  Trophy,
  Users,
  Bot,
  Sparkles,
  Zap,
  HelpCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export type GameMode = 'ai' | 'pvp';
export type Difficulty = 'facil' | 'medio' | 'imposible';
export type PlayerSymbol = 'X' | 'O';
export type BoardCell = PlayerSymbol | null;

const WINNING_COMBOS: [number, number, number][] = [
  [0, 1, 2], // Fila 1
  [3, 4, 5], // Fila 2
  [6, 7, 8], // Fila 3
  [0, 3, 6], // Columna 1
  [1, 4, 7], // Columna 2
  [2, 5, 8], // Columna 3
  [0, 4, 8], // Diagonal principal
  [2, 4, 6], // Diagonal inversa
];

interface ScoreState {
  player1: number;
  draws: number;
  player2: number;
}

export default function TicTacToeGame() {
  const [mode, setMode] = useState<GameMode>('ai');
  const [difficulty, setDifficulty] = useState<Difficulty>('imposible');
  const [playerSymbol, setPlayerSymbol] = useState<PlayerSymbol>('X');
  const aiSymbol: PlayerSymbol = playerSymbol === 'X' ? 'O' : 'X';

  const [board, setBoard] = useState<BoardCell[]>(Array(9).fill(null));
  const [currentTurn, setCurrentTurn] = useState<PlayerSymbol>('X');
  const [winner, setWinner] = useState<PlayerSymbol | 'tie' | null>(null);
  const [winningCombo, setWinningCombo] = useState<number[] | null>(null);
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const [scores, setScores] = useState<ScoreState>({ player1: 0, draws: 0, player2: 0 });

  const audioCtxRef = useRef<AudioContext | null>(null);

  // Cargar puntuaciones de LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('tres_en_raya_scores');
      if (saved) {
        setScores(JSON.parse(saved));
      }
    } catch {}
  }, []);

  // Guardar puntuaciones en LocalStorage
  const updateScores = (updater: (prev: ScoreState) => ScoreState) => {
    setScores((prev) => {
      const next = updater(prev);
      try {
        localStorage.setItem('tres_en_raya_scores', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const resetScores = () => {
    const fresh: ScoreState = { player1: 0, draws: 0, player2: 0 };
    setScores(fresh);
    try {
      localStorage.setItem('tres_en_raya_scores', JSON.stringify(fresh));
    } catch {}
  };

  // Sintetizador 8-bit de audio
  const playSound = useCallback(
    (type: 'x' | 'o' | 'win' | 'lose' | 'tie') => {
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

        if (type === 'x') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(587.33, now); // D5
          osc.frequency.exponentialRampToValueAtTime(880, now + 0.08); // A5
          gain.gain.setValueAtTime(0.18, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
          osc.start(now);
          osc.stop(now + 0.08);
        } else if (type === 'o') {
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(440, now); // A4
          osc.frequency.exponentialRampToValueAtTime(330, now + 0.08); // E4
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
          osc.start(now);
          osc.stop(now + 0.08);
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
        } else if (type === 'lose') {
          const notes = [440, 392, 349.23, 293.66];
          notes.forEach((freq, idx) => {
            const nOsc = ctx.createOscillator();
            const nGain = ctx.createGain();
            nOsc.type = 'sawtooth';
            nOsc.frequency.setValueAtTime(freq, now + idx * 0.1);
            nGain.gain.setValueAtTime(0.15, now + idx * 0.1);
            nGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.2);
            nOsc.connect(nGain);
            nGain.connect(ctx.destination);
            nOsc.start(now + idx * 0.1);
            nOsc.stop(now + idx * 0.1 + 0.2);
          });
        } else if (type === 'tie') {
          osc.type = 'square';
          osc.frequency.setValueAtTime(350, now);
          osc.frequency.setValueAtTime(250, now + 0.08);
          gain.gain.setValueAtTime(0.15, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
          osc.start(now);
          osc.stop(now + 0.18);
        }
      } catch {}
    },
    [soundEnabled]
  );

  // Comprobar ganador en un tablero dado
  const checkWinner = useCallback((currentBoard: BoardCell[]) => {
    for (const combo of WINNING_COMBOS) {
      const [a, b, c] = combo;
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        return { winner: currentBoard[a], combo };
      }
    }
    if (currentBoard.every((cell) => cell !== null)) {
      return { winner: 'tie' as const, combo: null };
    }
    return null;
  }, []);

  // Reiniciar partida
  const resetGame = useCallback(() => {
    setBoard(Array(9).fill(null));
    setCurrentTurn('X');
    setWinner(null);
    setWinningCombo(null);
    setIsAiThinking(false);
  }, []);

  // Algoritmo Minimax para IA invencible
  const minimax = useCallback(
    (currentBoard: BoardCell[], depth: number, isMaximizing: boolean): number => {
      const result = checkWinner(currentBoard);
      if (result) {
        if (result.winner === aiSymbol) return 10 - depth;
        if (result.winner === playerSymbol) return depth - 10;
        if (result.winner === 'tie') return 0;
      }

      if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
          if (currentBoard[i] === null) {
            currentBoard[i] = aiSymbol;
            const score = minimax(currentBoard, depth + 1, false);
            currentBoard[i] = null;
            bestScore = Math.max(score, bestScore);
          }
        }
        return bestScore;
      } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
          if (currentBoard[i] === null) {
            currentBoard[i] = playerSymbol;
            const score = minimax(currentBoard, depth + 1, true);
            currentBoard[i] = null;
            bestScore = Math.min(score, bestScore);
          }
        }
        return bestScore;
      }
    },
    [aiSymbol, playerSymbol, checkWinner]
  );

  // Obtener mejor movimiento de la IA
  const getAiMove = useCallback(
    (currentBoard: BoardCell[]): number => {
      const availableMoves: number[] = [];
      for (let i = 0; i < 9; i++) {
        if (currentBoard[i] === null) availableMoves.push(i);
      }
      if (availableMoves.length === 0) return -1;

      // Nivel Fácil: 100% Aleatorio
      if (difficulty === 'facil') {
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
      }

      // Nivel Medio: 40% Aleatorio, 60% Minimax / Inteligente
      if (difficulty === 'medio') {
        const isRandom = Math.random() < 0.4;
        if (isRandom) {
          return availableMoves[Math.floor(Math.random() * availableMoves.length)];
        }
      }

      // Nivel Imposible / Medio restante: Algoritmo Minimax Óptimo
      let bestScore = -Infinity;
      let move = availableMoves[0];

      // Optimización primer movimiento si el centro está libre
      if (currentBoard[4] === null && Math.random() < 0.8) {
        return 4;
      }

      for (const i of availableMoves) {
        currentBoard[i] = aiSymbol;
        const score = minimax(currentBoard, 0, false);
        currentBoard[i] = null;
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
      return move;
    },
    [difficulty, aiSymbol, minimax]
  );

  // Turno de la IA automático
  useEffect(() => {
    if (mode === 'ai' && currentTurn === aiSymbol && !winner && !isAiThinking) {
      setIsAiThinking(true);
      const timer = setTimeout(() => {
        const aiIndex = getAiMove(board);
        if (aiIndex !== -1) {
          const nextBoard = [...board];
          nextBoard[aiIndex] = aiSymbol;
          playSound(aiSymbol === 'X' ? 'x' : 'o');

          const winResult = checkWinner(nextBoard);
          if (winResult) {
            setBoard(nextBoard);
            setWinner(winResult.winner);
            setWinningCombo(winResult.combo);
            if (winResult.winner === aiSymbol) {
              playSound('lose');
              updateScores((s) => ({ ...s, player2: s.player2 + 1 }));
            } else if (winResult.winner === 'tie') {
              playSound('tie');
              updateScores((s) => ({ ...s, draws: s.draws + 1 }));
            }
          } else {
            setBoard(nextBoard);
            setCurrentTurn(playerSymbol);
          }
        }
        setIsAiThinking(false);
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [mode, currentTurn, aiSymbol, winner, isAiThinking, board, getAiMove, checkWinner, playSound, playerSymbol]);

  // Manejar clic en celda por jugador
  const handleCellClick = (index: number) => {
    if (board[index] !== null || winner !== null || isAiThinking) return;
    if (mode === 'ai' && currentTurn !== playerSymbol) return;

    const currentSymbol = currentTurn;
    const nextBoard = [...board];
    nextBoard[index] = currentSymbol;
    playSound(currentSymbol === 'X' ? 'x' : 'o');

    const winResult = checkWinner(nextBoard);
    if (winResult) {
      setBoard(nextBoard);
      setWinner(winResult.winner);
      setWinningCombo(winResult.combo);

      if (winResult.winner === 'tie') {
        playSound('tie');
        updateScores((s) => ({ ...s, draws: s.draws + 1 }));
      } else {
        playSound('win');
        try {
          confetti({
            particleCount: 90,
            spread: 75,
            origin: { y: 0.6 },
            colors: ['#06b6d4', '#ec4899', '#f59e0b', '#34d399', '#ffffff'],
          });
        } catch {}

        if (mode === 'ai') {
          if (winResult.winner === playerSymbol) {
            updateScores((s) => ({ ...s, player1: s.player1 + 1 }));
          } else {
            updateScores((s) => ({ ...s, player2: s.player2 + 1 }));
          }
        } else {
          if (winResult.winner === 'X') {
            updateScores((s) => ({ ...s, player1: s.player1 + 1 }));
          } else {
            updateScores((s) => ({ ...s, player2: s.player2 + 1 }));
          }
        }
      }
    } else {
      setBoard(nextBoard);
      setCurrentTurn(currentSymbol === 'X' ? 'O' : 'X');
    }
  };

  const isCellWinning = (index: number) => winningCombo?.includes(index);

  return (
    <div className="home-container" style={{ maxWidth: '880px', margin: '0 auto', paddingBottom: '4rem' }}>
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
            background: 'rgba(6, 182, 212, 0.12)',
            border: '1px solid rgba(6, 182, 212, 0.35)',
            borderRadius: '9999px',
            color: '#06b6d4',
            fontSize: '0.82rem',
            fontWeight: 700,
            marginBottom: '0.75rem',
          }}
        >
          <span>❌⭕</span>
          <span>Tablero de Estrategia Clásica</span>
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
          Tres en Raya Imposible
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '560px', margin: '0 auto' }}>
          Enfréntate al motor matemático Minimax invencible o desafía a un amigo en local en una cuadrícula arcade de neón synthwave.
        </p>
      </header>

      {/* Mode & Difficulty Selector Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          marginBottom: '1.25rem',
          padding: '0.85rem 1.25rem',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
        }}
      >
        {/* Game Mode (AI vs 2P) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={() => {
              setMode('ai');
              resetGame();
            }}
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              border: mode === 'ai' ? '1.5px solid #06b6d4' : '1px solid rgba(255,255,255,0.12)',
              background: mode === 'ai' ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255,255,255,0.04)',
              color: mode === 'ai' ? '#06b6d4' : 'var(--text-secondary)',
              boxShadow: mode === 'ai' ? '0 0 14px rgba(6, 182, 212, 0.3)' : 'none',
            }}
          >
            <Bot size={15} />
            <span>Vs Inteligencia Artificial</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMode('pvp');
              resetGame();
            }}
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              border: mode === 'pvp' ? '1.5px solid #ec4899' : '1px solid rgba(255,255,255,0.12)',
              background: mode === 'pvp' ? 'rgba(236, 72, 153, 0.2)' : 'rgba(255,255,255,0.04)',
              color: mode === 'pvp' ? '#ec4899' : 'var(--text-secondary)',
              boxShadow: mode === 'pvp' ? '0 0 14px rgba(236, 72, 153, 0.3)' : 'none',
            }}
          >
            <Users size={15} />
            <span>2 Jugadores Local</span>
          </button>
        </div>

        {/* AI Difficulty Buttons */}
        {mode === 'ai' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {(['facil', 'medio', 'imposible'] as Difficulty[]).map((d) => {
              const isSelected = difficulty === d;
              const labels = {
                facil: '🟢 Fácil',
                medio: '🟡 Medio',
                imposible: '🔴 Imposible',
              };
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => {
                    setDifficulty(d);
                    resetGame();
                  }}
                  style={{
                    padding: '0.35rem 0.7rem',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: isSelected ? '1px solid #fbbf24' : '1px solid rgba(255,255,255,0.1)',
                    background: isSelected ? 'rgba(245, 158, 11, 0.2)' : 'transparent',
                    color: isSelected ? '#fbbf24' : 'var(--text-muted)',
                  }}
                >
                  {labels[d]}
                </button>
              );
            })}
          </div>
        )}

        {/* Audio Toggle */}
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
          <span>{soundEnabled ? 'Sonido ON' : 'Mute'}</span>
        </button>
      </div>

      {/* Main Arcade Frame */}
      <div
        style={{
          margin: '0 auto',
          padding: '1.75rem',
          borderRadius: '16px',
          background: 'linear-gradient(180deg, #181c24 0%, #0d1117 100%)',
          border: '2px solid rgba(6, 182, 212, 0.35)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6), 0 0 35px rgba(6, 182, 212, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: '520px',
        }}
      >
        {/* Scoreboard LED Header */}
        <div
          style={{
            width: '100%',
            marginBottom: '1.5rem',
            padding: '0.75rem 1.25rem',
            background: 'linear-gradient(180deg, #222734 0%, #171b26 100%)',
            borderRadius: '10px',
            border: '2px solid #333d4e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.6)',
          }}
        >
          {/* Player 1 / Human */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.78rem', color: '#06b6d4', fontWeight: 700, marginBottom: '0.2rem' }}>
              {mode === 'ai' ? 'Tú (❌)' : 'Jugador 1 (❌)'}
            </div>
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: '1.4rem',
                fontWeight: 900,
                color: '#06b6d4',
                textShadow: '0 0 8px rgba(6, 182, 212, 0.6)',
              }}
            >
              {scores.player1}
            </div>
          </div>

          {/* Ties */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.2rem' }}>
              Empates
            </div>
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: '1.4rem',
                fontWeight: 900,
                color: 'var(--text-secondary)',
              }}
            >
              {scores.draws}
            </div>
          </div>

          {/* Player 2 / AI */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.78rem', color: '#ec4899', fontWeight: 700, marginBottom: '0.2rem' }}>
              {mode === 'ai' ? 'IA (⭕)' : 'Jugador 2 (⭕)'}
            </div>
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: '1.4rem',
                fontWeight: 900,
                color: '#ec4899',
                textShadow: '0 0 8px rgba(236, 72, 153, 0.6)',
              }}
            >
              {scores.player2}
            </div>
          </div>
        </div>

        {/* Status Indicator */}
        <div
          style={{
            marginBottom: '1.25rem',
            fontSize: '0.92rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            color: winner
              ? winner === 'tie'
                ? '#fbbf24'
                : winner === 'X'
                ? '#06b6d4'
                : '#ec4899'
              : currentTurn === 'X'
              ? '#06b6d4'
              : '#ec4899',
          }}
        >
          {winner ? (
            winner === 'tie' ? (
              <span>🤝 ¡Partida en Tablas / Empate!</span>
            ) : mode === 'ai' ? (
              winner === playerSymbol ? (
                <span>🎉 ¡Victoria magistral! Has vencido</span>
              ) : (
                <span>💀 La IA ha ganado la partida</span>
              )
            ) : (
              <span>🎉 ¡Victoria para el Jugador {winner === 'X' ? '1 (❌)' : '2 (⭕)'}!</span>
            )
          ) : isAiThinking ? (
            <span style={{ color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Zap size={15} />
              <span>La IA está calculando el movimiento perfecto...</span>
            </span>
          ) : (
            <span>
              Turno de: <strong>{currentTurn === 'X' ? '❌ (Azul)' : '⭕ (Rosa)'}</strong>
            </span>
          )}
        </div>

        {/* 3x3 Grid Board */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 96px)',
            gridTemplateRows: 'repeat(3, 96px)',
            gap: '10px',
            padding: '12px',
            background: '#121620',
            borderRadius: '14px',
            border: '2px solid #232b3b',
            boxShadow: 'inset 0 4px 18px rgba(0,0,0,0.6)',
            userSelect: 'none',
          }}
        >
          {board.map((cell, index) => {
            const isWinning = isCellWinning(index);
            const isX = cell === 'X';
            const isO = cell === 'O';

            return (
              <button
                key={index}
                type="button"
                onClick={() => handleCellClick(index)}
                disabled={cell !== null || winner !== null || isAiThinking}
                style={{
                  width: '96px',
                  height: '96px',
                  borderRadius: '10px',
                  background: isWinning
                    ? isX
                      ? 'rgba(6, 182, 212, 0.25)'
                      : 'rgba(236, 72, 153, 0.25)'
                    : 'linear-gradient(145deg, #242b3a 0%, #171c26 100%)',
                  border: isWinning
                    ? isX
                      ? '2px solid #06b6d4'
                      : '2px solid #ec4899'
                    : '1px solid #333c50',
                  fontSize: '3rem',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: cell === null && !winner && !isAiThinking ? 'pointer' : 'default',
                  transition: 'all 0.18s ease',
                  boxShadow: isWinning
                    ? isX
                      ? '0 0 20px rgba(6, 182, 212, 0.5)'
                      : '0 0 20px rgba(236, 72, 153, 0.5)'
                    : '0 4px 10px rgba(0,0,0,0.4)',
                  color: isX ? '#06b6d4' : '#ec4899',
                  textShadow: isX
                    ? '0 0 12px rgba(6, 182, 212, 0.7)'
                    : isO
                    ? '0 0 12px rgba(236, 72, 153, 0.7)'
                    : 'none',
                }}
              >
                {cell}
              </button>
            );
          })}
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1.5rem' }}>
          <button
            onClick={resetGame}
            className="btn-primary"
            style={{
              padding: '0.65rem 1.4rem',
              fontSize: '0.88rem',
              background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
              color: '#fff',
              boxShadow: '0 4px 15px rgba(6, 182, 212, 0.35)',
            }}
          >
            <RotateCcw size={16} />
            <span>Nueva Partida</span>
          </button>

          <button
            onClick={resetScores}
            style={{
              padding: '0.65rem 1rem',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'rgba(255,255,255,0.05)',
              color: 'var(--text-muted)',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
            title="Poner a cero el marcador"
          >
            Reiniciar Marcador
          </button>
        </div>
      </div>

      {/* Guide & Rules */}
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
          <span>El Desafío del Tres en Raya Imposible</span>
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
            <strong style={{ color: '#fff' }}>🤖 ¿Por qué es &ldquo;Imposible&rdquo;?</strong> El nivel Imposible utiliza el algoritmo minimax completo: evalúa cada posible desenlace del árbol de juego. La máquina nunca comete fallos y jugará siempre la respuesta matemáticamente óptima.
          </div>
          <div>
            <strong style={{ color: '#fff' }}>🎯 ¿Se puede ganar?</strong> Según la teoría de juegos, si ambos jugadores juegan de manera óptima, el Tres en Raya siempre termina en empate. ¡Conseguir empatar contra el modo Imposible demuestra juego perfecto!
          </div>
          <div>
            <strong style={{ color: '#fff' }}>🟢 Modos Alternativos:</strong> Prueba el nivel Fácil o Medio para partidas más dinámicas y con margen para la victoria, o utiliza el modo 2 Jugadores en local para retar a quien tengas al lado.
          </div>
        </div>
      </section>
    </div>
  );
}
