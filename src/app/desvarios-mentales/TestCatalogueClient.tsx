'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnyTest } from '@/lib/tests';
import { ArrowRight, Clock, Dices, Sparkles } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: '🌟 Todos', emoji: '🌟' },
  { id: 'personalidad', label: '🧙 Personalidad & Arquetipos', emoji: '🧙' },
  { id: 'logica', label: '🧩 Lógica & Paradojas', emoji: '🧩' },
  { id: 'humor', label: '🤪 Humor & Supervivencia', emoji: '🤪' },
  { id: 'curiosidades', label: '🌍 Curiosidades & Trivia', emoji: '🌍' },
];

export default function TestCatalogueClient({ tests }: { tests: AnyTest[] }) {
  const [selectedCat, setSelectedCat] = useState('all');
  const [isRoulette, setIsRoulette] = useState(false);
  const [rouletteText, setRouletteText] = useState('');
  const router = useRouter();

  const filteredTests = tests.filter((t) => {
    if (selectedCat === 'all') return true;
    return t.categoria === selectedCat;
  });

  const handleRandomTest = () => {
    if (tests.length === 0 || isRoulette) return;
    setIsRoulette(true);

    let count = 0;
    const interval = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * tests.length);
      setRouletteText(tests[randomIdx].titulo);
      count++;

      if (count >= 10) {
        clearInterval(interval);
        const finalTest = tests[Math.floor(Math.random() * tests.length)];
        setRouletteText(`🎯 ¡Seleccionado: ${finalTest.titulo}!`);
        setTimeout(() => {
          router.push(`/desvarios-mentales/${finalTest.slug}`);
        }, 500);
      }
    }, 90);
  };

  return (
    <section className="stories-catalog-section" style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Action Bar: Random Test Button & Category Filters */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.25rem',
          marginBottom: '2.5rem',
        }}
      >
        {/* Random Test Button */}
        <button
          onClick={handleRandomTest}
          disabled={isRoulette}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.65rem',
            padding: '0.75rem 2rem',
            borderRadius: 'var(--radius-full)',
            background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%)',
            color: '#ffffff',
            fontSize: '1rem',
            fontWeight: 800,
            border: 'none',
            cursor: isRoulette ? 'default' : 'pointer',
            boxShadow: '0 0 25px rgba(6, 182, 212, 0.4), 0 4px 15px rgba(0, 0, 0, 0.3)',
            transition: 'all 0.25s ease',
            transform: isRoulette ? 'scale(0.98)' : 'scale(1)',
          }}
          onMouseEnter={(e) => {
            if (!isRoulette) {
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 0 35px rgba(6, 182, 212, 0.6), 0 8px 25px rgba(0, 0, 0, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isRoulette) {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 0 25px rgba(6, 182, 212, 0.4), 0 4px 15px rgba(0, 0, 0, 0.3)';
            }
          }}
        >
          <Dices size={20} className={isRoulette ? 'animate-spin' : ''} />
          <span>{isRoulette ? (rouletteText || 'Erigiendo desafío...') : '🎲 ¿Indeciso? Prueba un Test Aleatorio'}</span>
        </button>

        {/* Filter Pills */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.6rem',
            justifyContent: 'center',
          }}
        >
          {CATEGORIES.map((cat) => {
            const count =
              cat.id === 'all'
                ? tests.length
                : tests.filter((t) => t.categoria === cat.id).length;

            const isActive = selectedCat === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.48rem 1rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.86rem',
                  fontWeight: isActive ? 700 : 500,
                  border: isActive
                    ? '1.5px solid var(--accent-cyan)'
                    : '1px solid var(--border-subtle)',
                  background: isActive
                    ? 'rgba(6, 182, 212, 0.18)'
                    : 'var(--bg-surface)',
                  color: isActive ? '#38bdf8' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive
                    ? '0 0 15px rgba(6, 182, 212, 0.25)'
                    : 'none',
                }}
              >
                <span>{cat.label}</span>
                <span
                  style={{
                    fontSize: '0.74rem',
                    opacity: 0.8,
                    background: 'rgba(255, 255, 255, 0.1)',
                    padding: '0.1rem 0.45rem',
                    borderRadius: '10px',
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Catalog Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
          paddingBottom: '0.75rem',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>
          {selectedCat === 'all'
            ? 'Todos los Desvaríos Mentales Disponibles'
            : CATEGORIES.find((c) => c.id === selectedCat)?.label}
        </h2>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {filteredTests.length} {filteredTests.length === 1 ? 'experiencia' : 'experiencias'}
        </span>
      </div>

      {/* Grid of Cards with High-Res Images */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
          gap: '1.75rem',
        }}
      >
        {filteredTests.map((t) => {
          let badgeText = 'Test de Personalidad';
          if (t.tipo === 'puntuacion') badgeText = 'Diagnóstico Cómico';
          if (t.slug === 'supervivencia-apocalipsis') badgeText = 'Supervivencia';
          if (t.slug === 'dilemas-morales') badgeText = 'Dilemas Éticos';
          if (t.slug === 'trampas-mentales') badgeText = 'Sesgos & Paradojas';
          if (t.slug === 'curiosidades-insolitas') badgeText = 'Mito o Realidad';
          if (t.slug === 'enigmas-logica') badgeText = 'Acertijos de Lógica';

          let stepCount = 'preguntas' in t ? `${t.preguntas.length} Preguntas` : '';
          if (t.slug === 'enigmas-logica') stepCount = '5 Acertijos';
          if (t.slug === 'trampas-mentales') stepCount = '6 Paradojas';
          if (t.slug === 'curiosidades-insolitas') stepCount = '8 Curiosidades';
          if (t.slug === 'dilemas-morales') stepCount = '6 Dilemas';

          return (
            <Link
              key={t.slug}
              href={`/desvarios-mentales/${t.slug}`}
              style={{ display: 'block', textDecoration: 'none' }}
            >
              <article
                className="cat-card cat-card-active"
                style={
                  {
                    '--card-accent': t.color,
                    '--card-glow': `${t.color}33`,
                    '--card-border': `${t.color}55`,
                    '--icon-bg': `${t.color}18`,
                    '--icon-border': `${t.color}44`,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  } as React.CSSProperties
                }
              >
                <div className="cat-card-glow-circle" />

                {/* Card Thumbnail Wrap */}
                <div className="cat-card-thumb-wrap" style={{ height: '175px' }}>
                  <img
                    src={`/images/tests/${t.slug}.jpg`}
                    alt={t.titulo}
                    className="cat-card-thumb"
                    loading="lazy"
                  />
                  <div className="cat-card-thumb-overlay" />
                  <div className="cat-card-header-badge">
                    <div className="cat-card-icon-box" style={{ fontSize: '1.4rem', width: '42px', height: '42px' }}>
                      {t.icono}
                    </div>
                    <span className="cat-pill cat-pill-live" style={{ fontSize: '0.74rem' }}>
                      {badgeText}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="cat-card-body" style={{ padding: '1.25rem 1.4rem 1.5rem', flex: 1 }}>
                  <h3 className="cat-card-title" style={{ fontSize: '1.25rem', marginBottom: '0.4rem' }}>
                    {t.titulo}
                  </h3>
                  <p className="cat-card-desc" style={{ fontSize: '0.92rem', lineHeight: '1.55', marginBottom: '1rem' }}>
                    {t.descripcionCorta}
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '0.75rem',
                      borderTop: '1px solid var(--border-subtle)',
                      fontSize: '0.82rem',
                      color: 'var(--text-muted)',
                      marginTop: 'auto',
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Clock size={13} /> {t.tiempoMin} min
                    </span>
                    <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{stepCount}</span>
                  </div>

                  <div className="cat-card-cta" style={{ color: t.color, marginTop: '0.75rem' }}>
                    <span>Comenzar Desafío</span>
                    <ArrowRight size={15} />
                  </div>
                </div>
              </article>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
