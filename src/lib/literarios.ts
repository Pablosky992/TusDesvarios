import fs from 'fs';
import path from 'path';

export interface Relato {
  slug: string;
  titulo: string;
  subtitulo: string;
  autor?: string;
  genero: 'terror' | 'scifi' | 'fantasia' | 'surrealismo' | 'microrrelato';
  generoNombre: string;
  icono: string;
  color: string;
  tiempoLecturaMin: number;
  palabras: number;
  descripcionCorta: string;
  fecha: string;
  citasDestacadas: string[];
  etiquetas: string[];
  contenido: string;
}

const dataFilePath = path.join(process.cwd(), 'data', 'literarios', 'relatos.json');

export async function getAllRelatos(): Promise<Relato[]> {
  try {
    if (!fs.existsSync(dataFilePath)) {
      return [];
    }
    const fileContent = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(fileContent) as Relato[];
  } catch (error) {
    console.error('Error reading relatos.json:', error);
    return [];
  }
}

export async function getRelatoBySlug(slug: string): Promise<Relato | null> {
  const relatos = await getAllRelatos();
  return relatos.find((r) => r.slug === slug) || null;
}
