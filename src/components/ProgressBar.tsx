'use client';

import React from 'react';
import { ArrowLeft, RotateCcw, Compass } from 'lucide-react';

interface ProgressBarProps {
  currentStep: number;
  totalEstimatedSteps: number;
  onBack?: () => void;
  onRestart?: () => void;
  canGoBack: boolean;
  isEnding?: boolean;
}

export function ProgressBar({
  currentStep,
  totalEstimatedSteps,
  onBack,
  onRestart,
  canGoBack,
  isEnding = false,
}: ProgressBarProps) {
  // Porcentaje acotado al 100%
  const percentage = isEnding
    ? 100
    : Math.min(Math.round((currentStep / totalEstimatedSteps) * 100), 95);

  return (
    <div className="reader-progress-container">
      <div className="progress-info">
        {canGoBack && onBack ? (
          <button
            onClick={onBack}
            className="btn-secondary"
            style={{ padding: '0.3rem 0.6rem', fontSize: '0.78rem' }}
            title="Volver a la decisión anterior"
          >
            <ArrowLeft size={13} />
            <span>Atrás</span>
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Compass size={15} style={{ color: 'var(--accent-amber)' }} />
            <span>Progreso</span>
          </div>
        )}
      </div>

      <div className="progress-bar-track">
        <div
          className="progress-bar-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {isEnding ? 'Final alcanzado' : `Nodo ${currentStep} de ~${totalEstimatedSteps}`}
        </span>

        {onRestart && (
          <button
            onClick={onRestart}
            className="btn-secondary"
            style={{ padding: '0.3rem 0.5rem', fontSize: '0.78rem' }}
            title="Reiniciar historia"
          >
            <RotateCcw size={12} />
          </button>
        )}
      </div>
    </div>
  );
}
