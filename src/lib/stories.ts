import fs from 'fs';
import path from 'path';
import { Story, StoryNode } from '@/types/story';
import faroStory from '@/data/stories/la-ultima-guardia-faro.json';

// Fallback estático en caso de entornos donde fs esté restringido
const fallbackStories: Record<string, Story> = {
  [faroStory.slug]: faroStory as unknown as Story,
};

/**
 * Carga todas las historias disponibles desde la carpeta /data/stories/ o /src/data/stories/
 * Permite que añadir un nuevo archivo JSON registre automáticamente la historia sin tocar código.
 */
export async function getAllStories(): Promise<Story[]> {
  try {
    const storiesDir = path.join(process.cwd(), 'data', 'stories');

    if (fs.existsSync(storiesDir)) {
      const files = fs.readdirSync(storiesDir).filter((file) => file.endsWith('.json'));
      const stories: Story[] = [];

      for (const file of files) {
        const filePath = path.join(storiesDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        try {
          const storyData = JSON.parse(fileContent) as Story;
          if (storyData.slug && storyData.nodos) {
            stories.push(storyData);
          }
        } catch (err) {
          console.error(`Error al parsear la historia "${file}":`, err);
        }
      }

      if (stories.length > 0) {
        return stories;
      }
    }
  } catch {
    // Si estamos en un entorno donde fs no está disponible, usamos el registro fallback
  }

  return Object.values(fallbackStories);
}

/**
 * Obtiene una historia completa a partir de su slug.
 */
export async function getStoryBySlug(slug: string): Promise<Story | null> {
  try {
    const storiesDir = path.join(process.cwd(), 'data', 'stories');
    const filePath = path.join(storiesDir, `${slug}.json`);

    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const storyData = JSON.parse(fileContent) as Story;
      return storyData;
    }
  } catch {
    // Fallback
  }

  return fallbackStories[slug] || null;
}

/**
 * Obtiene un nodo específico dentro de una historia.
 */
export function getStoryNode(story: Story, nodeId: string): StoryNode | null {
  return story.nodos[nodeId] || null;
}

/**
 * Valida la integridad del grafo de una historia (detecta destinos huérfanos).
 */
export function validateStoryIntegrity(story: Story): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  const nodeIds = new Set(Object.keys(story.nodos));

  if (!nodeIds.has(story.nodoInicialId)) {
    errors.push(`El nodo inicial "${story.nodoInicialId}" no existe en el catálogo de nodos.`);
  }

  for (const [nodeId, node] of Object.entries(story.nodos)) {
    if (!node.esFinal && node.opciones) {
      for (const opt of node.opciones) {
        if (!nodeIds.has(opt.destinoId)) {
          errors.push(`Nodo "${nodeId}" tiene opción con destino inexistente "${opt.destinoId}".`);
        }
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
