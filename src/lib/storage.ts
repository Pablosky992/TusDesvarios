import { StoryProgress, EndingType } from '@/types/story';

const STORAGE_PREFIX = 'crea_tu_historia_progress_';

/**
 * Obtiene el estado de guardado de una historia en LocalStorage.
 */
export function getSavedProgress(slug: string): StoryProgress | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${slug}`);
    if (!raw) return null;
    return JSON.parse(raw) as StoryProgress;
  } catch (err) {
    console.error('Error al leer el progreso de la historia desde LocalStorage:', err);
    return null;
  }
}

/**
 * Guarda el nodo actual y el rastro de decisiones en LocalStorage,
 * acumulando los finales descubiertos sin duplicados.
 */
export function saveProgress(
  slug: string,
  nodeId: string,
  history: string[],
  ending?: EndingType,
  endingNodeId?: string
): void {
  if (typeof window === 'undefined') return;

  try {
    const existing = getSavedProgress(slug);
    let finales: string[] = existing?.finalesDescubiertos || [];
    if (endingNodeId && !finales.includes(endingNodeId)) {
      finales = [...finales, endingNodeId];
    }

    const isEndingReached = !!ending || !!endingNodeId;

    const progress: StoryProgress = {
      nodoActualId: nodeId,
      historialNodos: history,
      finalAlcanzado: ending || existing?.finalAlcanzado,
      finalesDescubiertos: finales,
      fechaUltimoAcceso: new Date().toISOString(),
      completada: isEndingReached ? true : (existing?.completada ?? false),
      leida: isEndingReached ? true : (existing?.leida ?? existing?.completada ?? false),
    };
    localStorage.setItem(`${STORAGE_PREFIX}${slug}`, JSON.stringify(progress));
  } catch (err) {
    console.error('Error al guardar el progreso en LocalStorage:', err);
  }
}

/**
 * Alterna el estado de lectura (leída o pendiente) de una historia.
 */
export function toggleStoryRead(slug: string): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const existing = getSavedProgress(slug);
    const isCurrentlyRead = existing ? (existing.leida !== undefined ? existing.leida : (existing.completada || false)) : false;
    const newReadState = !isCurrentlyRead;

    const updated: StoryProgress = existing ? {
      ...existing,
      leida: newReadState,
      completada: newReadState,
      fechaUltimoAcceso: new Date().toISOString(),
    } : {
      nodoActualId: '',
      historialNodos: [],
      finalesDescubiertos: [],
      fechaUltimoAcceso: new Date().toISOString(),
      completada: newReadState,
      leida: newReadState,
    };

    localStorage.setItem(`${STORAGE_PREFIX}${slug}`, JSON.stringify(updated));
    return newReadState;
  } catch (err) {
    console.error('Error al alternar estado de lectura:', err);
    return false;
  }
}

/**
 * Reinicia la partida activa pero conservando los finales ya descubiertos y el estado de lectura.
 */
export function resetStoryProgress(slug: string): void {
  if (typeof window === 'undefined') return;

  try {
    const existing = getSavedProgress(slug);
    if (existing) {
      const resetData: StoryProgress = {
        nodoActualId: '',
        historialNodos: [],
        finalAlcanzado: undefined,
        finalesDescubiertos: existing.finalesDescubiertos || [],
        fechaUltimoAcceso: new Date().toISOString(),
        completada: existing.completada,
        leida: existing.leida ?? existing.completada,
      };
      localStorage.setItem(`${STORAGE_PREFIX}${slug}`, JSON.stringify(resetData));
    }
  } catch (err) {
    console.error('Error al reiniciar progreso:', err);
  }
}

/**
 * Elimina por completo el progreso guardado.
 */
export function clearProgress(slug: string): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(`${STORAGE_PREFIX}${slug}`);
  } catch (err) {
    console.error('Error al limpiar el progreso en LocalStorage:', err);
  }
}

/**
 * Obtiene un resumen de todas las historias que tienen progreso guardado.
 */
export function getAllSavedProgress(): Record<string, StoryProgress> {
  if (typeof window === 'undefined') return {};

  const allProgress: Record<string, StoryProgress> = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_PREFIX)) {
        const slug = key.replace(STORAGE_PREFIX, '');
        const data = getSavedProgress(slug);
        if (data) allProgress[slug] = data;
      }
    }
  } catch (err) {
    console.error('Error al recuperar progresos guardados:', err);
  }
  return allProgress;
}
