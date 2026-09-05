'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AnyTest, PersonalityTest, ScoreTest, EnigmaTest } from '@/lib/tests';
import { ArrowLeft, RotateCcw, CheckCircle2, XCircle, Lightbulb } from 'lucide-react';

function formatMarkdown(text: string): string {
  if (!text) return '';
  const blocks = text.split(/\n\s*\n/);
  return blocks
    .map((block) => {
      const trimmed = block.trim();
      let formatted = trimmed
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br />');

      if (trimmed.startsWith('>')) {
        const quote = formatted.replace(/^>\s*/gm, '');
        return `<blockquote style="border-left: 3px solid #06b6d4; padding: 0.75rem 1.25rem; margin: 1rem 0; background: rgba(6,182,212,0.08); border-radius: 0 8px 8px 0; font-style: italic; color: #e0f2fe;">${quote}</blockquote>`;
      }
      if (trimmed.startsWith('- ') || trimmed.startsWith('• ') || trimmed.startsWith('* ')) {
        const items = trimmed
          .split(/\n/)
          .map((line) => {
            const clean = line
              .replace(/^[-•*]\s*/, '')
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              .replace(/\*(.*?)\*/g, '<em>$1</em>');
            return `<li style="margin-bottom: 0.4rem;">${clean}</li>`;
          })
          .join('');
        return `<ul style="margin: 0.75rem 0; padding-left: 1.4rem; list-style-type: disc; color: #cbd5e1;">${items}</ul>`;
      }
      return `<p style="margin-bottom: 0.85rem; line-height: 1.7;">${formatted}</p>`;
    })
    .join('');
}

export default function TestRunner({ test }: { test: AnyTest }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [userAnswers, setUserAnswers] = useState<any[]>([]);
  const [revealedClues, setRevealedClues] = useState<Record<number, number>>({});
  const [enigmaAnswers, setEnigmaAnswers] = useState<
    Record<number, { selectedId: string; isCorrect: boolean }>
  >({});
  const [isCompleted, setIsCompleted] = useState(false);

  // --- Handlers ---
  const handleAnswerPersonality = (option: any) => {
    const nextAnswers = [...userAnswers, option];
    setUserAnswers(nextAnswers);
    const pTest = test as PersonalityTest;

    if (currentStep + 1 < pTest.preguntas.length) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsCompleted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAnswerScore = (option: any) => {
    const nextAnswers = [...userAnswers, option];
    setUserAnswers(nextAnswers);
    const sTest = test as ScoreTest;

    if (currentStep + 1 < sTest.preguntas.length) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsCompleted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleToggleClue = (stepIdx: number) => {
    setRevealedClues((prev) => ({
      ...prev,
      [stepIdx]: (prev[stepIdx] || 0) + 1,
    }));
  };

  const handleSelectEnigmaOption = (stepIdx: number, optionId: string) => {
    if (enigmaAnswers[stepIdx]) return;
    const eTest = test as EnigmaTest;
    const enigma = eTest.enigmas[stepIdx];
    const selectedOpt = enigma.opciones.find((o) => o.id === optionId);

    setEnigmaAnswers((prev) => ({
      ...prev,
      [stepIdx]: {
        selectedId: optionId,
        isCorrect: !!(selectedOpt && selectedOpt.correcta),
      },
    }));
  };

  const handleNextEnigma = () => {
    const eTest = test as EnigmaTest;
    if (currentStep + 1 < eTest.enigmas.length) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsCompleted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setUserAnswers([]);
    setRevealedClues({});
    setEnigmaAnswers({});
    setIsCompleted(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- Render Result View ---
  if (isCompleted) {
    if (test.tipo === 'personalidad') {
      const pTest = test as PersonalityTest;
      const counts: Record<string, number> = {};
      userAnswers.forEach((opt) => {
        counts[opt.arquetipo] = (counts[opt.arquetipo] || 0) + 1;
      });

      const keys = Object.keys(pTest.resultados);
      const topArquetipo = keys.reduce(
        (a, b) => ((counts[a] || 0) > (counts[b] || 0) ? a : b),
        keys[0]
      );
      const res = pTest.resultados[topArquetipo] || pTest.resultados[keys[0]];

      return (
        <div className="runner-wrapper">
          <div className="result-card" style={{ borderColor: res.color }}>
            <span className="result-icon-large">{res.icono}</span>
            <div>
              <span
                className="result-badge"
                style={{
                  background: `${res.color}22`,
                  color: res.color,
                  border: `1px solid ${res.color}55`,
                }}
              >
                Tu Resultado
              </span>
            </div>
            <h1 className="result-title">{res.nombre}</h1>
            <div className="result-subtitle">«{res.tituloCorto}»</div>

            <div
              className="result-desc"
              dangerouslySetInnerHTML={{ __html: formatMarkdown(res.descripcion) }}
            />

            <div className="result-traits-grid">
              <div className="result-trait-box">
                <div className="result-trait-label">⚔️ Mayor Fortaleza</div>
                <div className="result-trait-val">{res.fortaleza}</div>
              </div>
              <div className="result-trait-box">
                <div className="result-trait-label">🌀 Tu Desvarío Oculto</div>
                <div className="result-trait-val">{res.desvario}</div>
              </div>
            </div>

            <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              ✨ {res.afinidad}
            </div>

            <div className="result-actions">
              <button className="btn-result-main" onClick={handleRestart}>
                <RotateCcw size={16} /> Repetir Test
              </button>
              <Link href="/desvarios-mentales" className="btn-secondary" style={{ padding: '0.85rem 1.4rem' }}>
                🧪 Explorar más tests
              </Link>
            </div>
          </div>
        </div>
      );
    }

    if (test.tipo === 'puntuacion') {
      const sTest = test as ScoreTest;
      const totalPoints = userAnswers.reduce((sum, opt) => sum + (opt.puntos || 0), 0);
      const range =
        sTest.rangos.find((r) => totalPoints >= r.min && totalPoints <= r.max) || sTest.rangos[0];

      return (
        <div className="runner-wrapper">
          <div className="result-card" style={{ borderColor: range.color }}>
            <span className="result-icon-large">{range.icono}</span>
            <div>
              <span
                className="result-badge"
                style={{
                  background: `${range.color}22`,
                  color: range.color,
                  border: `1px solid ${range.color}55`,
                }}
              >
                {range.nivel} — {totalPoints} Puntos
              </span>
            </div>
            <h1 className="result-title">{range.titulo}</h1>

            <div
              className="result-desc"
              dangerouslySetInnerHTML={{ __html: formatMarkdown(range.descripcion) }}
            />

            <div className="result-traits-grid">
              <div className="result-trait-box" style={{ gridColumn: '1 / -1' }}>
                <div className="result-trait-label">💡 Consejo de los Sabios</div>
                <div className="result-trait-val">{range.consejo}</div>
              </div>
            </div>

            <div className="result-actions">
              <button className="btn-result-main" onClick={handleRestart}>
                <RotateCcw size={16} /> Volver a diagnosticar
              </button>
              <Link href="/desvarios-mentales" className="btn-secondary" style={{ padding: '0.85rem 1.4rem' }}>
                🧪 Otros tests
              </Link>
            </div>
          </div>
        </div>
      );
    }

    if (test.tipo === 'enigma') {
      const eTest = test as EnigmaTest;
      const total = eTest.enigmas.length;
      let correctCount = 0;
      for (let i = 0; i < total; i++) {
        if (enigmaAnswers[i] && enigmaAnswers[i].isCorrect) {
          correctCount++;
        }
      }

      const pctScore = Math.round((correctCount / total) * 100);
      let rankTitle = 'Mente Curiosa';
      let rankIcon = '🧐';
      let rankColor = '#f59e0b';
      let rankDesc = 'Has superado varios retos, aunque algunas trampas han conseguido despistarte.';

      if (pctScore === 100) {
        rankTitle = 'Gran Maestro de la Sabiduría';
        rankIcon = '👑';
        rankColor = '#10b981';
        rankDesc = `¡Puntuación perfecta! Has resuelto los ${total} retos sin caer en ninguna trampa. Tu agudeza mental es prodigiosa.`;
      } else if (pctScore >= 60) {
        rankTitle = 'Erudito Sagaz';
        rankIcon = '⚡';
        rankColor = '#06b6d4';
        rankDesc = `Muy buen desempeño analítico (${correctCount} de ${total} aciertos). Posees un pensamiento lateral agudo y gran capacidad deductiva.`;
      }

      return (
        <div className="runner-wrapper">
          <div className="result-card" style={{ borderColor: rankColor }}>
            <span className="result-icon-large">{rankIcon}</span>
            <div>
              <span
                className="result-badge"
                style={{
                  background: `${rankColor}22`,
                  color: rankColor,
                  border: `1px solid ${rankColor}55`,
                }}
              >
                Puntuación: {correctCount} de {total} Aciertos ({pctScore}%)
              </span>
            </div>
            <h1 className="result-title">{rankTitle}</h1>

            <div
              className="result-desc"
              dangerouslySetInnerHTML={{ __html: formatMarkdown(rankDesc) }}
            />

            <div className="result-actions">
              <button className="btn-result-main" onClick={handleRestart}>
                <RotateCcw size={16} /> Reintentar Reto
              </button>
              <Link href="/desvarios-mentales" className="btn-secondary" style={{ padding: '0.85rem 1.4rem' }}>
                🧪 Más Desvaríos Mentales
              </Link>
            </div>
          </div>
        </div>
      );
    }
  }

  // --- Render Enigma Step ---
  if (test.tipo === 'enigma') {
    const eTest = test as EnigmaTest;
    const total = eTest.enigmas.length;
    const enigma = eTest.enigmas[currentStep];
    const pct = Math.round(((currentStep + 1) / total) * 100);
    const answered = enigmaAnswers[currentStep];
    const clueCount = revealedClues[currentStep] || 0;
    const visibleClues = enigma.pistas.slice(0, clueCount);

    return (
      <div className="runner-wrapper">
        <div className="breadcrumb-nav">
          <Link href="/desvarios-mentales" className="breadcrumb-link">
            <ArrowLeft size={14} /> Volver al catálogo de tests
          </Link>
        </div>

        <div className="runner-header-card">
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            🧩 {enigma.titulo}
          </span>
          <div className="runner-progress-track">
            <div className="runner-progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {currentStep + 1} / {total}
          </span>
        </div>

        <div className="question-card">
          <div
            className="question-text"
            style={{
              fontFamily: 'var(--font-reading)',
              fontSize: '1.25rem',
              fontWeight: 400,
              lineHeight: 1.7,
              color: '#e2e8f0',
            }}
            dangerouslySetInnerHTML={{ __html: formatMarkdown(enigma.planteamiento) }}
          />

          {/* Clues */}
          {enigma.pistas && enigma.pistas.length > 0 && (
            <div style={{ marginTop: '1.25rem' }}>
              {clueCount < enigma.pistas.length && !answered && (
                <button className="clue-toggle-btn" onClick={() => handleToggleClue(currentStep)}>
                  <Lightbulb size={14} />
                  <span>Revelar Pista ({clueCount + 1}/{enigma.pistas.length})</span>
                </button>
              )}
              {visibleClues.map((c, i) => (
                <div
                  key={i}
                  className="clue-box"
                  dangerouslySetInnerHTML={{ __html: `🔍 ${formatMarkdown(c)}` }}
                />
              ))}
            </div>
          )}

          {/* Options */}
          <div className="options-grid" style={{ marginTop: '1rem' }}>
            {enigma.opciones.map((opt, idx) => {
              let extraStyle = {};
              if (answered) {
                if (opt.correcta) {
                  extraStyle = { borderColor: '#10b981', background: 'rgba(16,185,129,0.15)' };
                } else if (answered.selectedId === opt.id) {
                  extraStyle = { borderColor: '#ef4444', background: 'rgba(239,68,68,0.15)' };
                } else {
                  extraStyle = { opacity: 0.5 };
                }
              }

              return (
                <button
                  key={opt.id}
                  className="option-btn"
                  style={extraStyle}
                  onClick={() => handleSelectEnigmaOption(currentStep, opt.id)}
                  disabled={!!answered}
                >
                  <span className="option-indicator">{idx + 1}</span>
                  <span>{opt.texto}</span>
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {answered && (
            <div className={`feedback-box ${answered.isCorrect ? 'correct' : 'incorrect'}`}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  marginBottom: '0.5rem',
                  color: answered.isCorrect ? '#34d399' : '#f87171',
                }}
              >
                {answered.isCorrect ? (
                  <>
                    <CheckCircle2 size={18} /> ¡Respuesta Correcta!
                  </>
                ) : (
                  <>
                    <XCircle size={18} /> Respuesta Incorrecta
                  </>
                )}
              </div>
              <div
                style={{ fontSize: '0.95rem', lineHeight: 1.6 }}
                dangerouslySetInnerHTML={{ __html: formatMarkdown(enigma.explicacion) }}
              />
              <button className="btn-result-main" style={{ marginTop: '1.25rem' }} onClick={handleNextEnigma}>
                <span>{currentStep + 1 < total ? 'Siguiente Enigma ➜' : 'Ver Puntuación Final 🏆'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- Render Questions for Personality or Score Test ---
  const qTest = test as PersonalityTest | ScoreTest;
  const total = qTest.preguntas.length;
  const q = qTest.preguntas[currentStep];
  const pct = Math.round(((currentStep + 1) / total) * 100);

  return (
    <div className="runner-wrapper">
      <div className="breadcrumb-nav">
        <Link href="/desvarios-mentales" className="breadcrumb-link">
          <ArrowLeft size={14} /> Volver al catálogo de tests
        </Link>
      </div>

      <div className="runner-header-card">
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          {test.icono} {test.titulo}
        </span>
        <div className="runner-progress-track">
          <div className="runner-progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {currentStep + 1} / {total}
        </span>
      </div>

      <div className="question-card">
        <div className="question-step-badge">Pregunta {currentStep + 1} de {total}</div>
        <div
          className="question-text"
          dangerouslySetInnerHTML={{ __html: formatMarkdown(q.texto) }}
        />

        <div className="options-grid">
          {q.opciones.map((opt, idx) => {
            const letter = String.fromCharCode(65 + idx);
            return (
              <button
                key={idx}
                className="option-btn"
                onClick={() =>
                  test.tipo === 'personalidad'
                    ? handleAnswerPersonality(opt)
                    : handleAnswerScore(opt)
                }
              >
                <span className="option-indicator">{letter}</span>
                <span>{opt.texto}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
