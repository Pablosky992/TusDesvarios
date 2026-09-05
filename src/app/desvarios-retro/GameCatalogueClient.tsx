'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { GameMetadata } from '@/lib/games';
import { Sparkles, Play, Clock, Award, Gamepad2 } from 'lucide-react';

interface GameCatalogueClientProps {
  games: GameMetadata[];
}

const CATEGORIES = [
  { id: 'all', label: '🌟 Todos los Juegos' },
  { id: 'palabras', label: '🔤 Palabras & Letras' },
  { id: 'logica', label: '🧩 Lógica & Tablero' },
  { id: 'arcade', label: '🕹️ Acción Arcade' },
];

export default function GameCatalogueClient({ games }: GameCatalogueClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredGames = games.filter((g) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'logica') return g.categoria === 'logica' || g.categoria === 'tablero';
    return g.categoria === selectedCategory;
  });

  return (
    <div>
      {/* Filter Tabs */}
      <div className="cat-filters-wrap" style={{ marginBottom: '2.5rem' }}>
        {CATEGORIES.map((cat) => {
          const count =
            cat.id === 'all'
              ? games.length
              : games.filter((g) =>
                  cat.id === 'logica'
                    ? g.categoria === 'logica' || g.categoria === 'tablero'
                    : g.categoria === cat.id
                ).length;
          const isActive = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`cat-filter-btn ${isActive ? 'cat-filter-btn-active' : ''}`}
            >
              <span>{cat.label}</span>
              <span className="cat-filter-count">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Grid header info */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem',
          paddingBottom: '0.75rem',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <h2 style={{ fontSize: '1.15rem', fontWeight: 600 }}>
          {selectedCategory === 'all'
            ? 'Máquinas Arcade Disponibles'
            : CATEGORIES.find((c) => c.id === selectedCategory)?.label}
        </h2>
        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          {filteredGames.length} {filteredGames.length === 1 ? 'juego' : 'juegos'}
        </span>
      </div>

      {/* Games Grid */}
      <div className="tests-grid">
        {filteredGames.map((game) => {
          const cardContent = (
            <article
              className="test-card"
              style={
                {
                  '--card-accent': game.color,
                  cursor: game.disponible ? 'pointer' : 'default',
                  opacity: game.disponible ? 1 : 0.82,
                  overflow: 'hidden',
                } as React.CSSProperties
              }
            >
              {game.portada && (
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '165px',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    marginBottom: '1rem',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
                  }}
                >
                  <img
                    src={`/${game.portada.replace(/^\//, '')}`}
                    alt={`Portada de ${game.titulo}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                    loading="lazy"
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(10, 6, 20, 0.7) 0%, transparent 65%)',
                      pointerEvents: 'none',
                    }}
                  />
                </div>
              )}

              <div className="test-card-header">
                <span className="test-card-icon" style={{ fontSize: '2rem' }}>
                  {game.icono}
                </span>
                <span
                  className="test-card-type-tag"
                  style={{
                    background: game.disponible
                      ? 'rgba(16, 185, 129, 0.15)'
                      : 'rgba(245, 158, 11, 0.15)',
                    color: game.disponible ? '#34d399' : '#fbbf24',
                    border: `1px solid ${
                      game.disponible
                        ? 'rgba(16, 185, 129, 0.35)'
                        : 'rgba(245, 158, 11, 0.35)'
                    }`,
                  }}
                >
                  {game.etiqueta || (game.disponible ? '🟢 Disponible' : '⏳ Próximamente')}
                </span>
              </div>

              <h2 className="test-card-title" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                {game.titulo}
              </h2>

              <p className="test-card-desc" style={{ fontSize: '0.88rem', lineHeight: 1.6 }}>
                {game.descripcionCorta}
              </p>

              <div className="test-card-meta">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Clock size={13} /> {game.tiempoMin} min
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Award size={13} /> {game.categoriaLabel}
                </span>
              </div>

              {game.disponible ? (
                <div
                  className="test-card-btn"
                  style={{
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.45rem',
                    background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
                    color: '#fff',
                    fontWeight: 700,
                  }}
                >
                  <Play size={14} />
                  <span>Jugar Ahora</span>
                </div>
              ) : (
                <div
                  className="test-card-btn"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'var(--text-muted)',
                    border: '1px solid var(--border-subtle)',
                    cursor: 'not-allowed',
                    textAlign: 'center',
                  }}
                >
                  <span>En Desarrollo</span>
                </div>
              )}
            </article>
          );

          if (game.disponible) {
            return (
              <Link
                key={game.id}
                href={`/desvarios-retro/${game.slug}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                {cardContent}
              </Link>
            );
          }

          return <div key={game.id}>{cardContent}</div>;
        })}
      </div>
    </div>
  );
}
