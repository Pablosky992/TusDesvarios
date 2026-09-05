'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { EndingType } from '@/types/story';
import { RotateCcw, Home, Sparkles, Skull, Compass, ShieldCheck, Trophy, CheckCircle2 } from 'lucide-react';
import { getSavedProgress } from '@/lib/storage';
import confetti from 'canvas-confetti';

interface EndingScreenProps {
  storySlug?: string;
  totalFinales?: number;
  tipoFinal?: EndingType;
  mensajeFinal?: string;
  onRestart: () => void;
}

export function EndingScreen({
  storySlug,
  totalFinales = 6,
  tipoFinal = 'neutro',
  mensajeFinal,
  onRestart,
}: EndingScreenProps) {
  const [discoveredCount, setDiscoveredCount] = useState<number>(1);

  useEffect(() => {
    if (storySlug) {
      const saved = getSavedProgress(storySlug);
      if (saved?.finalesDescubiertos) {
        setDiscoveredCount(saved.finalesDescubiertos.length);
      }
    }

    // Disparar efecto de confeti
    if (tipoFinal === 'bueno' || (storySlug && discoveredCount >= totalFinales)) {
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#10b981', '#ffffff', '#fbbf24', '#38bdf8'],
        });
      } catch {}
    }
  }, [tipoFinal, storySlug, discoveredCount, totalFinales]);

  const getEndingMeta = () => {
    switch (tipoFinal) {
      case 'bueno':
        return {
          label: 'Final Bueno — Supervivencia',
          icon: <ShieldCheck size={16} />,
          className: 'bueno',
          badgeText: 'Victoria',
        };
      case 'malo':
        return {
          label: 'Final Trágico — Perdición',
          icon: <Skull size={16} />,
          className: 'malo',
          badgeText: 'Muerte / Desaparición',
        };
      case 'neutro':
      default:
        return {
          label: 'Final Neutro — Destino Ineludible',
          icon: <Compass size={16} />,
          className: 'neutro',
          badgeText: 'Condena Eterna',
        };
    }
  };

  const meta = getEndingMeta();
  const allUnlocked = totalFinales > 0 && discoveredCount >= totalFinales;
  const pct = totalFinales > 0 ? Math.min(100, Math.round((discoveredCount / totalFinales) * 100)) : 0;

  return (
    <div className={`ending-banner ${meta.className}`}>
      <div className={`ending-pill ${meta.className}`}>
        {meta.icon}
        <span>{meta.label}</span>
      </div>

      {mensajeFinal && (
        <p className="ending-moral">
          &ldquo;{mensajeFinal}&rdquo;
        </p>
      )}

      {/* Discovered Endings Counter */}
      <div
        style={{
          maxWidth: '460px',
          margin: '1.25rem auto 1.5rem',
          padding: '0.85rem 1.15rem',
          borderRadius: '12px',
          background: 'rgba(0, 0, 0, 0.45)',
          border: allUnlocked ? '1.5px solid rgba(245, 158, 11, 0.6)' : '1px solid rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(8px)',
          textAlign: 'left',
          boxShadow: allUnlocked ? '0 0 25px rgba(245, 158, 11, 0.3)' : '0 4px 15px rgba(0,0,0,0.3)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem', fontSize: '0.85rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: allUnlocked ? '#fbbf24' : '#f8fafc' }}>
            <Trophy size={16} style={{ color: allUnlocked ? '#fbbf24' : 'var(--accent-amber)' }} />
            <span>Finales de esta historia:</span>
          </span>
          <span style={{ fontWeight: 800, color: allUnlocked ? '#fbbf24' : '#34d399' }}>
            {discoveredCount} de {totalFinales} ({pct}%)
          </span>
        </div>

        <div style={{ width: '100%', height: '7px', background: 'rgba(255,255,255,0.1)', borderRadius: '9999px', overflow: 'hidden' }}>
          <div
            style={{
              width: `${pct}%`,
              height: '100%',
              background: allUnlocked
                ? 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)'
                : 'linear-gradient(90deg, #f59e0b 0%, #10b981 100%)',
              borderRadius: '9999px',
              transition: 'width 0.4s ease',
            }}
          />
        </div>

        {allUnlocked ? (
          <div style={{ marginTop: '0.55rem', fontSize: '0.78rem', color: '#fbbf24', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Sparkles size={13} />
            <span>¡Enhorabuena! Has desbloqueado todos los desenlaces posibles de esta historia.</span>
          </div>
        ) : (
          <div style={{ marginTop: '0.45rem', fontSize: '0.74rem', color: 'rgba(255,255,255,0.65)' }}>
            Rejuega y explora decisiones diferentes para descubrir los {totalFinales - discoveredCount} finales restantes.
          </div>
        )}
      </div>

      <div className="ending-actions">
        <button onClick={onRestart} className="btn-primary">
          <RotateCcw size={16} />
          <span>Jugar de nuevo (Explorar otros caminos)</span>
        </button>

        <Link href="/crea-tu-historia" className="btn-secondary" style={{ padding: '0.75rem 1.4rem' }}>
          <Home size={16} />
          <span>Volver a Aventuras</span>
        </Link>
      </div>

      {/* Apoyo al creador / Donaciones PayPal */}
      <div
        style={{
          marginTop: '1.75rem',
          paddingTop: '1.35rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.12)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.65rem',
          textAlign: 'center',
        }}
      >
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0, maxWidth: '480px', lineHeight: 1.5 }}>
          ☕ <strong>¿Has disfrutado de la aventura?</strong> Apoya este proyecto independiente invitando a un café al creador para inspirar nuevas tramas y misterios.
        </p>
        <a
          href="https://www.paypal.com/donate/?hosted_button_id=V8PZNYKGXBCLG&locale.x=es_ES"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-paypal-donate"
          title="Invitar a un café con PayPal"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.6rem 1.3rem',
            borderRadius: '9999px',
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: '#0b0f19',
            fontWeight: 800,
            fontSize: '0.85rem',
            textDecoration: 'none',
            boxShadow: '0 4px 16px rgba(245, 158, 11, 0.35)',
            transition: 'all 0.2s ease',
          }}
        >
          <span>☕ Invitar a un café</span>
          <span>➜</span>
        </a>
      </div>
    </div>
  );
}
