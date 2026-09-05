'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { HangmanGameData, HangmanWord } from '@/lib/games';
import {
  Sparkles,
  ArrowLeft,
  Volume2,
  VolumeX,
  HelpCircle,
  RotateCcw,
  Trophy,
  Flame,
  Zap,
  CheckCircle2,
  XCircle,
  BookOpen,
} from 'lucide-react';

interface HangmanGameProps {
  gameData: HangmanGameData;
}

type Difficulty = 'facil' | 'normal' | 'dificil';

const DIFFICULTY_CONFIG: Record<Difficulty, { maxErrors: number; label: string; pistasInit: number; color: string }> = {
  facil: { maxErrors: 8, label: '🟢 Fácil (8 vidas)', pistasInit: 2, color: '#34d399' },
  normal: { maxErrors: 6, label: '🟡 Normal (6 vidas)', pistasInit: 1, color: '#fbbf24' },
  dificil: { maxErrors: 4, label: '🔴 Difícil (4 vidas)', pistasInit: 0, color: '#f87171' },
};

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
];

export default function HangmanGame({ gameData }: HangmanGameProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [difficulty, setDifficulty] = useState<Difficulty>('normal');
  const [currentWordObj, setCurrentWordObj] = useState<HangmanWord | null>(null);
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [clueRevealed, setClueRevealed] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');

  const audioCtxRef = useRef<AudioContext | null>(null);

  // Initialize best streak from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('tusdesvarios_ahorcado_best');
      if (saved) setBestStreak(parseInt(saved, 10));
    } catch {
      // Ignore
    }
  }, []);

  // Web Audio Synth
  const playSynth = useCallback(
    (type: 'hit' | 'miss' | 'win' | 'lose' | 'click') => {
      if (!soundEnabled) return;
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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

        if (type === 'hit') {
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(587.33, now); // D5
          osc.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5
          gain.gain.setValueAtTime(0.18, now);
          gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
          osc.start(now);
          osc.stop(now + 0.15);
        } else if (type === 'miss') {
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(180, now);
          osc.frequency.linearRampToValueAtTime(110, now + 0.22);
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
          osc.start(now);
          osc.stop(now + 0.25);
        } else if (type === 'win') {
          // Arpeggio
          const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
          notes.forEach((freq, idx) => {
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.connect(g);
            g.connect(ctx.destination);
            o.type = 'square';
            o.frequency.setValueAtTime(freq, now + idx * 0.1);
            g.gain.setValueAtTime(0.15, now + idx * 0.1);
            g.gain.linearRampToValueAtTime(0.01, now + idx * 0.1 + 0.18);
            o.start(now + idx * 0.1);
            o.stop(now + idx * 0.1 + 0.18);
          });
        } else if (type === 'lose') {
          // Descending slide
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(320, now);
          osc.frequency.linearRampToValueAtTime(80, now + 0.5);
          gain.gain.setValueAtTime(0.22, now);
          gain.gain.linearRampToValueAtTime(0.01, now + 0.55);
          osc.start(now);
          osc.stop(now + 0.55);
        } else if (type === 'click') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(440, now);
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.linearRampToValueAtTime(0.01, now + 0.05);
          osc.start(now);
          osc.stop(now + 0.05);
        }
      } catch {
        // Ignore audio errors
      }
    },
    [soundEnabled]
  );

  // Pick a random word
  const pickNewWord = useCallback(
    (catId = selectedCategory, diff = difficulty) => {
      let pool = gameData.palabras;
      if (catId !== 'all') {
        pool = pool.filter((w) => w.categoria === catId);
      }
      if (pool.length === 0) pool = gameData.palabras;

      const randomWord = pool[Math.floor(Math.random() * pool.length)];
      setCurrentWordObj(randomWord);
      setGuessedLetters(new Set());
      setClueRevealed(false);
      setGameStatus('playing');
    },
    [gameData.palabras, selectedCategory, difficulty]
  );

  // Initial pick
  useEffect(() => {
    pickNewWord();
  }, [pickNewWord]);

  // Compute game metrics
  const cleanWord = currentWordObj ? currentWordObj.palabra.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') : '';
  const wordLetters = new Set(cleanWord.split('').filter((c) => /[A-ZÑ]/.test(c)));

  const wrongGuesses = Array.from(guessedLetters).filter((l) => !cleanWord.includes(l));
  const maxErrors = DIFFICULTY_CONFIG[difficulty].maxErrors;
  const errorsLeft = Math.max(0, maxErrors - wrongGuesses.length);

  // Handle letter guess
  const guessLetter = useCallback(
    (letter: string) => {
      if (gameStatus !== 'playing' || !currentWordObj) return;
      const upper = letter.toUpperCase();
      if (guessedLetters.has(upper)) return;

      const newGuessed = new Set(guessedLetters);
      newGuessed.add(upper);
      setGuessedLetters(newGuessed);

      if (cleanWord.includes(upper)) {
        playSynth('hit');
        // Check win
        const allFound = Array.from(wordLetters).every((l) => newGuessed.has(l));
        if (allFound) {
          setGameStatus('won');
          playSynth('win');
          const pointsEarned = (errorsLeft + 1) * 50 * (difficulty === 'dificil' ? 2 : difficulty === 'normal' ? 1.5 : 1);
          setScore((s) => s + Math.round(pointsEarned));
          setStreak((st) => {
            const next = st + 1;
            if (next > bestStreak) {
              setBestStreak(next);
              try {
                localStorage.setItem('tusdesvarios_ahorcado_best', next.toString());
              } catch {}
            }
            return next;
          });
        }
      } else {
        playSynth('miss');
        // Check loss
        if (wrongGuesses.length + 1 >= maxErrors) {
          setGameStatus('lost');
          playSynth('lose');
          setStreak(0);
        }
      }
    },
    [gameStatus, currentWordObj, guessedLetters, cleanWord, wordLetters, wrongGuesses.length, maxErrors, errorsLeft, difficulty, bestStreak, playSynth]
  );

  // Listen to physical keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const key = e.key.toUpperCase();
      if (/^[A-ZÑ]$/.test(key)) {
        guessLetter(key);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [guessLetter]);

  const toggleSound = () => {
    setSoundEnabled((prev) => !prev);
    playSynth('click');
  };

  const currentCategoryInfo = gameData.categorias.find((c) => c.id === currentWordObj?.categoria);

  return (
    <div className="home-container" style={{ maxWidth: '820px' }}>
      {/* Top bar & Breadcrumbs */}
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

        {/* Score & Streak counter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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
              background: streak > 0 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255, 255, 255, 0.05)',
              border: streak > 0 ? '1px solid rgba(239, 68, 68, 0.35)' : '1px solid var(--border-subtle)',
              color: streak > 0 ? '#f87171' : 'var(--text-muted)',
              fontSize: '0.82rem',
              fontWeight: 700,
            }}
          >
            <Flame size={13} />
            <span>Racha: {streak}</span>
            {bestStreak > 0 && <span style={{ opacity: 0.7, fontSize: '0.75rem' }}>(Récord: {bestStreak})</span>}
          </div>

          <button
            onClick={toggleSound}
            className="btn-secondary"
            style={{ padding: '0.3rem 0.6rem' }}
            title={soundEnabled ? 'Silenciar sonidos 8-bit' : 'Activar sonidos 8-bit'}
            aria-label="Silenciar sonido"
          >
            {soundEnabled ? <Volume2 size={14} style={{ color: '#38bdf8' }} /> : <VolumeX size={14} style={{ color: 'var(--text-muted)' }} />}
          </button>
        </div>
      </div>

      {/* Main Arcade Frame */}
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid rgba(168, 85, 247, 0.35)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem 1.5rem',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(168, 85, 247, 0.15)',
          position: 'relative',
        }}
      >
        {/* Category & Difficulty Selector Bar */}
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
          {/* Category Dropdown/Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Temática:
            </span>
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  pickNewWord('all', difficulty);
                }}
                className={`cat-filter-btn ${selectedCategory === 'all' ? 'cat-filter-btn-active' : ''}`}
                style={{ padding: '0.25rem 0.65rem', fontSize: '0.78rem' }}
              >
                🎲 Aleatorio
              </button>
              {gameData.categorias.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    pickNewWord(cat.id, difficulty);
                  }}
                  className={`cat-filter-btn ${selectedCategory === cat.id ? 'cat-filter-btn-active' : ''}`}
                  style={{ padding: '0.25rem 0.65rem', fontSize: '0.78rem' }}
                >
                  <span>{cat.icono}</span> <span>{cat.nombre.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Vidas:
            </span>
            <div style={{ display: 'flex', gap: '0.3rem' }}>
              {(['facil', 'normal', 'dificil'] as Difficulty[]).map((d) => (
                <button
                  key={d}
                  onClick={() => {
                    setDifficulty(d);
                    pickNewWord(selectedCategory, d);
                  }}
                  style={{
                    fontSize: '0.78rem',
                    padding: '0.25rem 0.65rem',
                    borderRadius: 'var(--radius-full)',
                    background: difficulty === d ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                    color: difficulty === d ? DIFFICULTY_CONFIG[d].color : 'var(--text-muted)',
                    border: `1px solid ${difficulty === d ? DIFFICULTY_CONFIG[d].color : 'var(--border-subtle)'}`,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {d.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Word info card badge */}
        <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
          <span
            className="hero-badge"
            style={{
              background: 'rgba(168, 85, 247, 0.12)',
              borderColor: 'rgba(168, 85, 247, 0.35)',
              color: '#c084fc',
              fontSize: '0.78rem',
              padding: '0.25rem 0.75rem',
            }}
          >
            {currentCategoryInfo ? `${currentCategoryInfo.icono} ${currentCategoryInfo.nombre}` : '🎲 Categoría Variada'}
          </span>
        </div>

        {/* Visual Gallow / Scaffold Area */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '1.75rem',
          }}
        >
          <div
            style={{
              width: '240px',
              height: '190px',
              background: 'rgba(0, 0, 0, 0.45)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(168, 85, 247, 0.25)',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg viewBox="0 0 200 180" width="200" height="180" style={{ filter: 'drop-shadow(0 0 8px rgba(168, 85, 247, 0.5))' }}>
              {/* Base */}
              <line x1="20" y1="160" x2="180" y2="160" stroke="#a855f7" strokeWidth="4" strokeLinecap="round" />
              {/* Vertical Pole */}
              <line x1="60" y1="160" x2="60" y2="20" stroke="#a855f7" strokeWidth="4" strokeLinecap="round" />
              {/* Top Beam */}
              <line x1="58" y1="20" x2="135" y2="20" stroke="#a855f7" strokeWidth="4" strokeLinecap="round" />
              {/* Support Diagonal */}
              <line x1="60" y1="50" x2="90" y2="20" stroke="#a855f7" strokeWidth="3" />
              {/* Rope */}
              <line x1="135" y1="20" x2="135" y2="45" stroke="#fbbf24" strokeWidth="3" strokeDasharray="3 2" />

              {/* Character parts based on errors */}
              {/* 1. Head */}
              {wrongGuesses.length >= (maxErrors === 4 ? 1 : maxErrors === 6 ? 1 : 2) && (
                <circle cx="135" cy="60" r="14" stroke="#06b6d4" strokeWidth="3.5" fill="rgba(6, 182, 212, 0.15)" />
              )}
              {/* 2. Torso */}
              {wrongGuesses.length >= (maxErrors === 4 ? 2 : maxErrors === 6 ? 2 : 4) && (
                <line x1="135" y1="74" x2="135" y2="115" stroke="#06b6d4" strokeWidth="3.5" strokeLinecap="round" />
              )}
              {/* 3. Left Arm */}
              {wrongGuesses.length >= (maxErrors === 4 ? 3 : maxErrors === 6 ? 3 : 5) && (
                <line x1="135" y1="85" x2="112" y2="102" stroke="#06b6d4" strokeWidth="3.5" strokeLinecap="round" />
              )}
              {/* 4. Right Arm */}
              {wrongGuesses.length >= (maxErrors === 4 ? 3 : maxErrors === 6 ? 4 : 6) && (
                <line x1="135" y1="85" x2="158" y2="102" stroke="#06b6d4" strokeWidth="3.5" strokeLinecap="round" />
              )}
              {/* 5. Left Leg */}
              {wrongGuesses.length >= (maxErrors === 4 ? 4 : maxErrors === 6 ? 5 : 7) && (
                <line x1="135" y1="115" x2="115" y2="148" stroke="#06b6d4" strokeWidth="3.5" strokeLinecap="round" />
              )}
              {/* 6. Right Leg (Final) */}
              {wrongGuesses.length >= maxErrors && (
                <line x1="135" y1="115" x2="155" y2="148" stroke="#06b6d4" strokeWidth="3.5" strokeLinecap="round" />
              )}

              {/* Dead Face (X eyes) on Loss */}
              {gameStatus === 'lost' && (
                <>
                  <line x1="129" y1="56" x2="133" y2="60" stroke="#f87171" strokeWidth="2" />
                  <line x1="133" y1="56" x2="129" y2="60" stroke="#f87171" strokeWidth="2" />
                  <line x1="137" y1="56" x2="141" y2="60" stroke="#f87171" strokeWidth="2" />
                  <line x1="141" y1="56" x2="137" y2="60" stroke="#f87171" strokeWidth="2" />
                </>
              )}
            </svg>

            {/* Error Counter Badge */}
            <div
              style={{
                position: 'absolute',
                bottom: '8px',
                right: '10px',
                fontSize: '0.75rem',
                color: errorsLeft <= 2 ? '#f87171' : 'var(--text-muted)',
                fontWeight: 700,
                fontFamily: 'monospace',
              }}
            >
              Vidas: {errorsLeft} / {maxErrors}
            </div>
          </div>
        </div>

        {/* Word Display (Hidden / Revealed Letters) */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '0.6rem',
            margin: '1.5rem 0 2rem',
            minHeight: '60px',
          }}
        >
          {cleanWord.split('').map((char, index) => {
            const isGuessed = guessedLetters.has(char);
            const isRevealedOnLoss = gameStatus === 'lost';
            const showChar = isGuessed || isRevealedOnLoss;

            return (
              <div
                key={index}
                style={{
                  width: '38px',
                  height: '48px',
                  borderBottom: `3px solid ${
                    isGuessed
                      ? '#34d399'
                      : isRevealedOnLoss
                      ? '#f87171'
                      : 'rgba(255, 255, 255, 0.4)'
                  }`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.6rem',
                  fontWeight: 800,
                  fontFamily: 'monospace',
                  color: isGuessed ? '#34d399' : isRevealedOnLoss ? '#f87171' : '#fff',
                  textShadow: isGuessed ? '0 0 10px rgba(52, 211, 153, 0.6)' : 'none',
                }}
              >
                {showChar ? char : ''}
              </div>
            );
          })}
        </div>

        {/* Clue Section */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          {clueRevealed ? (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.55rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(245, 158, 11, 0.12)',
                border: '1px solid rgba(245, 158, 11, 0.35)',
                color: '#fde68a',
                fontSize: '0.88rem',
                maxWidth: '90%',
                margin: '0 auto',
                animation: 'fadeIn 0.3s ease',
              }}
            >
              <HelpCircle size={16} style={{ color: '#fbbf24', flexShrink: 0 }} />
              <span><strong>Pista:</strong> {currentWordObj?.pista}</span>
            </div>
          ) : (
            <button
              onClick={() => {
                setClueRevealed(true);
                playSynth('click');
              }}
              className="btn-secondary"
              style={{ fontSize: '0.82rem', padding: '0.4rem 0.85rem' }}
            >
              <HelpCircle size={14} style={{ color: '#fbbf24' }} />
              <span>Pedir Pista</span>
            </button>
          )}
        </div>

        {/* Game End Banner (Won or Lost) */}
        {gameStatus !== 'playing' && (
          <div
            style={{
              padding: '1.5rem',
              borderRadius: 'var(--radius-md)',
              background:
                gameStatus === 'won'
                  ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)'
                  : 'rgba(239, 68, 68, 0.15)',
              border: `1px solid ${gameStatus === 'won' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
              textAlign: 'center',
              marginBottom: '1.75rem',
              animation: 'fadeIn 0.3s ease',
            }}
          >
            <div style={{ fontSize: '1.8rem', marginBottom: '0.35rem' }}>
              {gameStatus === 'won' ? '🎉 ¡VICTORIA ARCADE!' : '💀 ¡EL CADALSO RECLAMA TU ALMA!'}
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: gameStatus === 'won' ? '#34d399' : '#f87171', marginBottom: '0.5rem' }}>
              {gameStatus === 'won' ? `¡Has descifrado "${cleanWord}" con éxito!` : `La palabra secreta era: "${cleanWord}"`}
            </h3>

            {currentWordObj?.curiosidad && (
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', maxWidth: '580px', margin: '0 auto 1.25rem', lineHeight: 1.5 }}>
                💡 <strong>Dato curioso:</strong> {currentWordObj.curiosidad}
              </p>
            )}

            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
              <button
                onClick={() => pickNewWord()}
                className="btn-primary"
                style={{
                  background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
                  padding: '0.65rem 1.3rem',
                  fontSize: '0.9rem',
                  boxShadow: '0 4px 15px rgba(168, 85, 247, 0.4)',
                }}
              >
                <RotateCcw size={15} />
                <span>Siguiente Palabra</span>
              </button>
            </div>
          </div>
        )}

        {/* Virtual Keyboard */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', alignItems: 'center' }}>
          {KEYBOARD_ROWS.map((row, rowIdx) => (
            <div key={rowIdx} style={{ display: 'flex', gap: '0.35rem', justifyContent: 'center', width: '100%' }}>
              {row.map((letter) => {
                const isGuessed = guessedLetters.has(letter);
                const isCorrect = isGuessed && cleanWord.includes(letter);
                const isWrong = isGuessed && !cleanWord.includes(letter);

                return (
                  <button
                    key={letter}
                    disabled={isGuessed || gameStatus !== 'playing'}
                    onClick={() => guessLetter(letter)}
                    style={{
                      width: 'clamp(28px, 8vw, 44px)',
                      height: 'clamp(38px, 9vw, 48px)',
                      borderRadius: 'var(--radius-sm)',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      fontFamily: 'monospace',
                      cursor: isGuessed || gameStatus !== 'playing' ? 'not-allowed' : 'pointer',
                      border: `1px solid ${
                        isCorrect
                          ? 'rgba(52, 211, 153, 0.5)'
                          : isWrong
                          ? 'rgba(239, 68, 68, 0.4)'
                          : 'rgba(255, 255, 255, 0.15)'
                      }`,
                      background: isCorrect
                        ? 'rgba(16, 185, 129, 0.25)'
                        : isWrong
                        ? 'rgba(239, 68, 68, 0.15)'
                        : 'rgba(255, 255, 255, 0.05)',
                      color: isCorrect
                        ? '#34d399'
                        : isWrong
                        ? 'rgba(248, 113, 113, 0.5)'
                        : 'var(--text-primary)',
                      opacity: isWrong ? 0.4 : 1,
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: isCorrect ? '0 0 10px rgba(52, 211, 153, 0.3)' : 'none',
                    }}
                  >
                    {letter}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
