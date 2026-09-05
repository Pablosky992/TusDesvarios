'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Relato } from '@/lib/literarios';
import { ArrowRight, Clock, Dices, Feather } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: '🌟 Todos los Relatos', color: '#f59e0b' },
  { id: 'unread', label: '📖 Pendientes', color: '#38bdf8' },
  { id: 'read', label: '✅ Leídos', color: '#10b981' },
  { id: 'terror', label: '👻 Terror & Gótico', color: '#f59e0b' },
  { id: 'scifi', label: '🚀 Ciencia Ficción', color: '#06b6d4' },
  { id: 'fantasia', label: '🕯️ Fantasía Oscura', color: '#8b5cf6' },
  { id: 'surrealismo', label: '🫙 Realismo Mágico', color: '#10b981' },
  { id: 'microrrelato', label: '⚡ Microrrelatos', color: '#ec4899' },
];

const STORAGE_KEY = 'tusdesvarios_relatos_leidos';

export default function LiterariosClient({ relatos }: { relatos: Relato[] }) {
  const [selectedGen, setSelectedGen] = useState('all');
  const [isRoulette, setIsRoulette] = useState(false);
  const [rouletteText, setRouletteText] = useState('');
  const [readSlugs, setReadSlugs] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setReadSlugs(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }

    const handleStorage = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setReadSlugs(JSON.parse(stored));
        } else {
          setReadSlugs([]);
        }
      } catch (e) {}
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const toggleRead = (slug: string) => {
    setReadSlugs((prev) => {
      const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const filteredRelatos = relatos.filter((r) => {
    if (selectedGen === 'all') return true;
    if (selectedGen === 'unread') return !readSlugs.includes(r.slug);
    if (selectedGen === 'read') return readSlugs.includes(r.slug);
    return r.genero === selectedGen;
  });

  const handleRandomStory = () => {
    if (relatos.length === 0 || isRoulette) return;
    setIsRoulette(true);

    let count = 0;
    const interval = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * relatos.length);
      setRouletteText(relatos[randomIdx].titulo);
      count++;

      if (count >= 10) {
        clearInterval(interval);
        const finalRelato = relatos[Math.floor(Math.random() * relatos.length)];
        setRouletteText(`📖 ¡Abriendo: ${finalRelato.titulo}!`);
        setTimeout(() => {
          router.push(`/desvarios-literarios/relato/${finalRelato.slug}`);
        }, 500);
      }
    }, 90);
  };

  const readCount = readSlugs.length;
  const readPct = relatos.length > 0 ? Math.round((readCount / relatos.length) * 100) : 0;

  return (
    <section className="stories-catalog-section" style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Actions & Filters */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.25rem',
          marginBottom: '2.5rem',
        }}
      >
        {/* Random Story Button */}
        <button
          onClick={handleRandomStory}
          disabled={isRoulette}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.65rem',
            padding: '0.75rem 2rem',
            borderRadius: 'var(--radius-full)',
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)',
            color: '#ffffff',
            fontSize: '1rem',
            fontWeight: 800,
            border: 'none',
            cursor: isRoulette ? 'default' : 'pointer',
            boxShadow: '0 0 25px rgba(245, 158, 11, 0.4), 0 4px 15px rgba(0, 0, 0, 0.3)',
            transition: 'all 0.25s ease',
            transform: isRoulette ? 'scale(0.98)' : 'scale(1)',
          }}
          onMouseEnter={(e) => {
            if (!isRoulette) {
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 0 35px rgba(245, 158, 11, 0.6), 0 8px 25px rgba(0, 0, 0, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isRoulette) {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 0 25px rgba(245, 158, 11, 0.4), 0 4px 15px rgba(0, 0, 0, 0.3)';
            }
          }}
        >
          <Dices size={20} className={isRoulette ? 'animate-spin' : ''} />
          <span>{isRoulette ? (rouletteText || 'Buscando lectura...') : '🎲 ¿Indeciso? Lee un Relato al Azar'}</span>
        </button>

        {/* Reading Progress Card */}
        <div
          style={{
            maxWidth: '620px',
            width: '100%',
            padding: '1rem 1.4rem',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.55rem',
              fontSize: '0.86rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 700, color: '#f8fafc' }}>
              <span>📚</span> <span>Tu Progreso de Lectura:</span>
              <span style={{ color: '#fbbf24', fontWeight: 700 }}>
                {readCount} de {relatos.length} leídos
              </span>
            </div>
            <span
              style={{
                fontWeight: 800,
                fontSize: '0.78rem',
                background: 'rgba(245,158,11,0.18)',
                border: '1px solid rgba(245,158,11,0.35)',
                color: '#fbbf24',
                padding: '0.15rem 0.55rem',
                borderRadius: '9999px',
              }}
            >
              {readPct}%
            </span>
          </div>
          <div
            style={{
              width: '100%',
              height: '7px',
              background: 'rgba(255,255,255,0.08)',
              borderRadius: '9999px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${readPct}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #f59e0b 0%, #10b981 100%)',
                borderRadius: '9999px',
                transition: 'width 0.4s ease',
              }}
            />
          </div>
        </div>

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
            let count = 0;
            if (cat.id === 'all') count = relatos.length;
            else if (cat.id === 'unread') count = relatos.filter((r) => !readSlugs.includes(r.slug)).length;
            else if (cat.id === 'read') count = readSlugs.length;
            else count = relatos.filter((r) => r.genero === cat.id).length;

            const isActive = selectedGen === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedGen(cat.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.48rem 1rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.86rem',
                  fontWeight: isActive ? 700 : 500,
                  border: isActive
                    ? `1.5px solid ${cat.color}`
                    : '1px solid var(--border-subtle)',
                  background: isActive
                    ? `${cat.color}25`
                    : 'var(--bg-surface)',
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive
                    ? `0 0 15px ${cat.color}25`
                    : 'none',
                }}
              >
                <span>{cat.label}</span>
                <span
                  style={{
                    fontSize: '0.74rem',
                    opacity: 0.8,
                    background: isActive ? `${cat.color}40` : 'rgba(255, 255, 255, 0.1)',
                    color: isActive ? '#ffffff' : 'inherit',
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
          {selectedGen === 'all'
            ? 'Obras y Antologías Literarias'
            : CATEGORIES.find((c) => c.id === selectedGen)?.label}
        </h2>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {filteredRelatos.length} {filteredRelatos.length === 1 ? 'obra' : 'obras'}
        </span>
      </div>

      {/* Grid of Story Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.75rem',
        }}
      >
        {filteredRelatos.map((r) => {
          let imageName = 'el-susurro-relojes.jpg';
          if (r.slug === 'el-ultimo-eco-de-andromeda') imageName = 'el-ultimo-eco-andromeda.jpg';
          if (r.slug === 'la-taberna-del-cuervo-ciego') imageName = 'la-taberna-cuervo-ciego.jpg';
          if (r.slug === 'el-coleccionista-de-silencios') imageName = 'el-coleccionista-silencios.jpg';
          if (r.slug === 'microrrelatos-de-impacto') imageName = 'microrrelatos-impacto.jpg';

          const isRead = readSlugs.includes(r.slug);

          return (
            <Link
              key={r.slug}
              href={`/desvarios-literarios/relato/${r.slug}`}
              style={{ display: 'block', textDecoration: 'none' }}
            >
              <article
                className={`cat-card cat-card-active ${isRead ? 'is-read' : ''}`}
                style={
                  {
                    '--card-accent': r.color,
                    '--card-glow': isRead ? 'rgba(16, 185, 129, 0.25)' : `${r.color}33`,
                    '--card-border': isRead ? 'rgba(16, 185, 129, 0.5)' : `${r.color}55`,
                    '--icon-bg': `${r.color}18`,
                    '--icon-border': `${r.color}44`,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderColor: isRead ? 'rgba(16, 185, 129, 0.5)' : undefined,
                  } as React.CSSProperties
                }
              >
                <div className="cat-card-glow-circle" />

                {/* Card Thumbnail Wrap */}
                <div className="cat-card-thumb-wrap" style={{ height: '185px' }}>
                  <img
                    src={`/images/literarios/${imageName}`}
                    alt={r.titulo}
                    className="cat-card-thumb"
                    loading="lazy"
                  />
                  <div className="cat-card-thumb-overlay" />
                  <div className="cat-card-header-badge">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <div className="cat-card-icon-box" style={{ fontSize: '1.4rem', width: '42px', height: '42px' }}>
                        {r.icono}
                      </div>
                      {isRead && (
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            background: 'rgba(16, 185, 129, 0.25)',
                            border: '1px solid rgba(16, 185, 129, 0.6)',
                            color: '#34d399',
                            padding: '0.22rem 0.65rem',
                            borderRadius: '9999px',
                            boxShadow: '0 0 14px rgba(16, 185, 129, 0.35)',
                          }}
                        >
                          ✅ Leído
                        </span>
                      )}
                    </div>
                    <span
                      className="cat-pill"
                      style={{
                        background: `${r.color}25`,
                        borderColor: `${r.color}60`,
                        color: '#ffffff',
                        fontWeight: 700,
                        boxShadow: `0 0 12px ${r.color}30`,
                      }}
                    >
                      {r.generoNombre}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="cat-card-body" style={{ padding: '1.35rem 1.4rem 1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {r.autor && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', color: '#fbbf24', marginBottom: '0.35rem' }}>
                      <Feather size={12} />
                      <span>{r.autor}</span>
                    </div>
                  )}

                  <h3 className="cat-card-title" style={{ fontSize: '1.3rem', marginBottom: '0.45rem' }}>
                    {r.titulo}
                  </h3>
                  
                  <p className="cat-card-desc" style={{ fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '1.1rem', flex: 1 }}>
                    {r.descripcionCorta}
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
                      <Clock size={13} /> {r.tiempoLecturaMin} min de lectura
                    </span>
                    <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>~{r.palabras} palabras</span>
                  </div>

                  {/* Bottom Action Row */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: '0.85rem',
                      paddingTop: '0.65rem',
                      borderTop: '1px dashed rgba(255,255,255,0.09)',
                    }}
                  >
                    <div className="cat-card-cta" style={{ color: r.color, fontSize: '0.88rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span>{isRead ? 'Releer Relato' : 'Leer Relato'}</span>
                      <ArrowRight size={15} />
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleRead(r.slug);
                      }}
                      title={isRead ? 'Hacer clic para desmarcar como leído' : 'Marcar como leído'}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.35rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.76rem',
                        fontWeight: 600,
                        border: isRead ? '1px solid rgba(16, 185, 129, 0.55)' : '1px solid rgba(255, 255, 255, 0.18)',
                        background: isRead ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                        color: isRead ? '#34d399' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: isRead ? '0 0 12px rgba(16, 185, 129, 0.25)' : 'none',
                      }}
                    >
                      <span>{isRead ? '✅' : '⚪'}</span>
                      <span>{isRead ? 'Leído' : 'Marcar leído'}</span>
                    </button>
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
