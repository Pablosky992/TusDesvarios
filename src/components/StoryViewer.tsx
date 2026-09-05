'use client';

import React from 'react';
import Image from 'next/image';
import { Story } from '@/types/story';
import { useStoryProgress } from '@/hooks/useStoryProgress';
import { MarkdownRenderer } from './MarkdownRenderer';
import { DecisionButton } from './DecisionButton';
import { ProgressBar } from './ProgressBar';
import { EndingScreen } from './EndingScreen';
import { Compass, Sparkles } from 'lucide-react';

interface StoryViewerProps {
  story: Story;
  backPath?: string;
}

export function StoryViewer({ story, backPath = '/crea-tu-historia' }: StoryViewerProps) {
  const {
    currentNode,
    historyTrail,
    isLoaded,
    isTransitioning,
    selectOption,
    restartStory,
    goBackOneStep,
    stepCount,
    totalEstimatedSteps,
  } = useStoryProgress(story);

  if (!isLoaded) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <div className="hero-badge" style={{ animation: 'pulse 1.5s infinite' }}>
          <Sparkles size={14} />
          <span>Cargando pergamino...</span>
        </div>
      </div>
    );
  }

  const isEnding = !!currentNode.esFinal;
  const nodeImage = currentNode.imagen || story.portada;

  return (
    <div className="reader-wrapper">
      {/* Barra de progreso interactiva */}
      <ProgressBar
        currentStep={stepCount}
        totalEstimatedSteps={totalEstimatedSteps}
        onBack={goBackOneStep}
        onRestart={restartStory}
        canGoBack={historyTrail.length > 1 && !isEnding}
        isEnding={isEnding}
      />

      {/* Contenedor del nodo actual */}
      <div
        className="reader-node-card"
        style={{
          opacity: isTransitioning ? 0.2 : 1,
          transform: isTransitioning ? 'scale(0.985)' : 'scale(1)',
          transition: 'opacity 0.25s ease, transform 0.25s ease',
        }}
      >
        {/* Imagen del nodo si existe */}
        {nodeImage && (
          <div className="reader-image-container">
            <Image
              src={nodeImage}
              alt={currentNode.titulo || story.titulo}
              fill
              sizes="(max-width: 768px) 100vw, 800px"
              className="reader-image"
              priority
            />
            <div className="reader-image-gradient" />
          </div>
        )}

        <div className="reader-body">
          {currentNode.titulo && (
            <h1 className="reader-node-title">{currentNode.titulo}</h1>
          )}

          {/* Texto de la narrativa con formato */}
          <MarkdownRenderer content={currentNode.texto} />

          {/* Decisiones o Desenlace */}
          {isEnding ? (
            <EndingScreen
              storySlug={story.slug}
              totalFinales={Object.values(story.nodos || {}).filter((n) => n.esFinal).length}
              tipoFinal={currentNode.tipo_final}
              mensajeFinal={currentNode.mensaje_final}
              onRestart={restartStory}
            />
          ) : (
            <div className="decisions-container">
              <div className="decisions-heading">
                <Compass size={16} style={{ color: 'var(--accent-amber)' }} />
                <span>¿Qué decides hacer?</span>
              </div>

              {currentNode.opciones && currentNode.opciones.length > 0 ? (
                currentNode.opciones.map((option, index) => (
                  <DecisionButton
                    key={option.id || index}
                    option={option}
                    index={index}
                    onClick={selectOption}
                    disabled={isTransitioning}
                  />
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)' }}>
                  No hay más caminos disponibles.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
