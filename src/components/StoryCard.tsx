'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Story, StoryProgress } from '@/types/story';
import { getSavedProgress, resetStoryProgress, toggleStoryRead } from '@/lib/storage';
import { BookOpen, Clock, Layers, Play, RotateCcw, Trophy, CheckCircle2 } from 'lucide-react';

interface StoryCardProps {
  story: Story;
  basePath?: string;
}

export function StoryCard({ story, basePath = '/crea-tu-historia/historia' }: StoryCardProps) {
  const [progress, setProgress] = useState<StoryProgress | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = getSavedProgress(story.slug);
    setProgress(saved);

    const handleStorage = () => {
      setProgress(getSavedProgress(story.slug));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [story.slug]);

  const handleResetProgress = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    resetStoryProgress(story.slug);
    setProgress(getSavedProgress(story.slug));
  };

  const handleToggleRead = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleStoryRead(story.slug);
    setProgress(getSavedProgress(story.slug));
  };

  const totalFinales = Object.values(story.nodos || {}).filter((n) => n.esFinal).length || (story.slug === 'la-ultima-guardia-faro' ? 6 : 8);
  const finalesDescubiertos = progress?.finalesDescubiertos || [];
  const countFinales = finalesDescubiertos.length;
  const allFinalesUnlocked = mounted && totalFinales > 0 && countFinales >= totalFinales;
  const endingPct = totalFinales > 0 ? Math.min(100, Math.round((countFinales / totalFinales) * 100)) : 0;

  const isRead = mounted && (progress?.leida !== undefined ? progress.leida : (progress?.completada || false));
  const hasProgress = mounted && progress && progress.historialNodos?.length > 1 && !progress.completada;
  const isCompleted = mounted && progress && progress.completada;

  return (
    <article
      className="story-card"
      style={{
        border: allFinalesUnlocked ? '1.5px solid rgba(245, 158, 11, 0.55)' : undefined,
        boxShadow: allFinalesUnlocked ? '0 8px 30px rgba(245, 158, 11, 0.25)' : undefined,
      }}
    >
      <div className="story-card-image-wrapper">
        <Image
          src={story.portada}
          alt={story.titulo}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className="story-card-image"
          priority
        />
        <div className="story-card-overlay" />
        <div
          style={{
            position: 'absolute',
            top: '0.75rem',
            left: '0.75rem',
            right: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 2,
          }}
        >
          <span className="story-card-badge" style={{ position: 'static' }}>
            {story.genero}
          </span>
          {isRead && (
            <button
              type="button"
              onClick={handleToggleRead}
              title="Hacer clic para quitar y desmarcar como leída"
              style={{
                cursor: 'pointer',
                fontSize: '0.72rem',
                fontWeight: 800,
                background: 'rgba(16, 185, 129, 0.28)',
                border: '1px solid rgba(16, 185, 129, 0.65)',
                color: '#34d399',
                padding: '0.22rem 0.65rem',
                borderRadius: '9999px',
                boxShadow: '0 0 14px rgba(16, 185, 129, 0.35)',
                backdropFilter: 'blur(8px)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
            >
              <span>✅ Leída</span>
              <span style={{ fontSize: '0.65rem', opacity: 0.8 }}>(quitar ✕)</span>
            </button>
          )}
        </div>
      </div>

      <div className="story-card-content">
        <h2 className="story-card-title">{story.titulo}</h2>
        <p className="story-card-desc">{story.descripcionCorta}</p>

        <div className="story-card-meta">
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Clock size={14} />
            {story.tiempoLecturaMin} min lectura
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Layers size={14} />
            ~{story.totalNodosEstimados} nodos
          </span>
        </div>

        {/* 100% Endings Master Badge */}
        {allFinalesUnlocked && (
          <div
            style={{
              background: 'linear-gradient(90deg, rgba(245,158,11,0.2) 0%, rgba(217,119,6,0.25) 100%)',
              border: '1.5px solid rgba(245,158,11,0.5)',
              borderRadius: '8px',
              padding: '0.45rem 0.75rem',
              marginTop: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              color: '#fbbf24',
              fontSize: '0.8rem',
              fontWeight: 800,
              boxShadow: '0 0 18px rgba(245,158,11,0.25)',
            }}
          >
            <span>🌟</span>
            <span>¡Todos los finales descubiertos! ({countFinales}/{totalFinales})</span>
          </div>
        )}

        {/* Endings Discovered Counter & Bar */}
        <div
          style={{
            marginTop: '0.85rem',
            padding: '0.65rem 0.85rem',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.45rem',
              fontSize: '0.8rem',
            }}
          >
            <span
              style={{
                color: 'var(--text-secondary)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontWeight: 600,
              }}
            >
              <Trophy size={14} style={{ color: allFinalesUnlocked ? '#fbbf24' : 'var(--accent-amber)' }} />
              <span>Finales descubiertos:</span>
            </span>
            <span style={{ fontWeight: 800, color: allFinalesUnlocked ? '#fbbf24' : '#34d399' }}>
              {countFinales} de {totalFinales} ({endingPct}%)
            </span>
          </div>
          <div
            style={{
              width: '100%',
              height: '6px',
              background: 'rgba(255,255,255,0.08)',
              borderRadius: '9999px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${endingPct}%`,
                height: '100%',
                background: allFinalesUnlocked
                  ? 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)'
                  : 'linear-gradient(90deg, #f59e0b 0%, #10b981 100%)',
                borderRadius: '9999px',
                transition: 'width 0.4s ease',
              }}
            />
          </div>
        </div>

        {/* Actions Row */}
        {hasProgress ? (
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <Link
              href={`${basePath}/${story.slug}`}
              className="story-card-btn resume"
              style={{ flex: 1, marginTop: 0 }}
            >
              <Play size={15} />
              <span>Continuar (Paso {progress.historialNodos.length})</span>
            </Link>
            <button
              onClick={handleResetProgress}
              className="btn-secondary"
              title="Reiniciar partida conservando finales desbloqueados"
              style={{ padding: '0 0.85rem' }}
            >
              <RotateCcw size={15} />
            </button>
          </div>
        ) : isCompleted ? (
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <Link
              href={`${basePath}/${story.slug}`}
              className="story-card-btn"
              style={{ flex: 1, marginTop: 0 }}
            >
              <RotateCcw size={15} />
              <span>Rejugar historia</span>
            </Link>
          </div>
        ) : (
          <Link href={`${basePath}/${story.slug}`} className="story-card-btn">
            <BookOpen size={16} />
            <span>Comenzar aventura</span>
          </Link>
        )}

        {/* Read / Unread 1-Click Toggle */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
          <button
            type="button"
            onClick={handleToggleRead}
            title={isRead ? 'Hacer clic para quitar y desmarcar como leída' : 'Marcar historia como leída'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.35rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.76rem',
              fontWeight: 600,
              border: isRead ? '1px solid rgba(16, 185, 129, 0.55)' : '1px solid rgba(255, 255, 255, 0.18)',
              background: isRead ? 'rgba(16, 185, 129, 0.18)' : 'rgba(255, 255, 255, 0.05)',
              color: isRead ? '#34d399' : 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: isRead ? '0 0 12px rgba(16, 185, 129, 0.25)' : 'none',
            }}
          >
            <span>{isRead ? '✅' : '⚪'}</span>
            <span>{isRead ? 'Leída (clic para quitar)' : 'Marcar como leída'}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
