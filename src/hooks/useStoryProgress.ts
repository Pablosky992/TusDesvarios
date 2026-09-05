'use client';

import { useState, useEffect, useCallback } from 'react';
import { Story, StoryProgress, StoryNode, EndingType } from '@/types/story';
import { getSavedProgress, saveProgress, resetStoryProgress } from '@/lib/storage';

export function useStoryProgress(story: Story) {
  const [currentNodeId, setCurrentNodeId] = useState<string>(story.nodoInicialId);
  const [historyTrail, setHistoryTrail] = useState<string[]>([story.nodoInicialId]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  // Inicializar estado desde LocalStorage al montar en el cliente
  useEffect(() => {
    const saved = getSavedProgress(story.slug);
    if (saved && saved.nodoActualId && story.nodos[saved.nodoActualId]) {
      setCurrentNodeId(saved.nodoActualId);
      setHistoryTrail(saved.historialNodos?.length ? saved.historialNodos : [saved.nodoActualId]);
    }
    setIsLoaded(true);
  }, [story.slug, story.nodos]);

  // Avanzar a un nuevo nodo de decisión
  const selectOption = useCallback(
    (targetNodeId: string) => {
      if (!story.nodos[targetNodeId]) {
        console.error(`El nodo de destino "${targetNodeId}" no existe.`);
        return;
      }

      setIsTransitioning(true);

      setTimeout(() => {
        const nextNode = story.nodos[targetNodeId];
        const nextHistory = [...historyTrail, targetNodeId];

        setCurrentNodeId(targetNodeId);
        setHistoryTrail(nextHistory);
        setIsTransitioning(false);

        // Guardar progreso en LocalStorage acumulando finales descubiertos
        saveProgress(
          story.slug,
          targetNodeId,
          nextHistory,
          nextNode.esFinal ? nextNode.tipo_final : undefined,
          nextNode.esFinal ? targetNodeId : undefined
        );

        // Scroll suave al inicio del lector
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 250);
    },
    [story, historyTrail]
  );

  // Reiniciar la historia desde el nodo inicial conservando finales descubiertos
  const restartStory = useCallback(() => {
    setIsTransitioning(true);

    setTimeout(() => {
      resetStoryProgress(story.slug);
      setCurrentNodeId(story.nodoInicialId);
      setHistoryTrail([story.nodoInicialId]);
      setIsTransitioning(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 200);
  }, [story.slug, story.nodoInicialId]);

  // Retroceder un paso en el historial
  const goBackOneStep = useCallback(() => {
    if (historyTrail.length <= 1) return;

    setIsTransitioning(true);

    setTimeout(() => {
      const newHistory = historyTrail.slice(0, -1);
      const previousNodeId = newHistory[newHistory.length - 1];
      const previousNode = story.nodos[previousNodeId];

      setCurrentNodeId(previousNodeId);
      setHistoryTrail(newHistory);
      setIsTransitioning(false);

      saveProgress(
        story.slug,
        previousNodeId,
        newHistory,
        previousNode.esFinal ? previousNode.tipo_final : undefined
      );

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 200);
  }, [story, historyTrail]);

  const currentNode: StoryNode = story.nodos[currentNodeId] || story.nodos[story.nodoInicialId];

  return {
    currentNode,
    currentNodeId,
    historyTrail,
    isLoaded,
    isTransitioning,
    selectOption,
    restartStory,
    goBackOneStep,
    stepCount: historyTrail.length,
    totalEstimatedSteps: story.totalNodosEstimados || 10,
  };
}
