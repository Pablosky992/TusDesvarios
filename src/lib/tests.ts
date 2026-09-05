import fs from 'fs';
import path from 'path';

export interface BaseTest {
  id: string;
  slug: string;
  titulo: string;
  subtitulo: string;
  descripcionCorta: string;
  tipo: 'personalidad' | 'puntuacion' | 'enigma';
  categoria?: 'personalidad' | 'logica' | 'humor' | 'curiosidades';
  categoriaLabel?: string;
  icono: string;
  tiempoMin: number;
  color: string;
}

export interface PersonalityTest extends BaseTest {
  tipo: 'personalidad';
  preguntas: Array<{
    id: string;
    texto: string;
    opciones: Array<{
      texto: string;
      arquetipo: string;
      puntos?: number;
    }>;
  }>;
  resultados: Record<
    string,
    {
      nombre: string;
      tituloCorto: string;
      icono: string;
      color: string;
      descripcion: string;
      fortaleza: string;
      desvario: string;
      afinidad: string;
    }
  >;
}

export interface ScoreTest extends BaseTest {
  tipo: 'puntuacion';
  preguntas: Array<{
    id: string;
    texto: string;
    opciones: Array<{
      texto: string;
      puntos: number;
    }>;
  }>;
  rangos: Array<{
    min: number;
    max: number;
    nivel: string;
    titulo: string;
    icono: string;
    color: string;
    descripcion: string;
    consejo: string;
  }>;
}

export interface EnigmaTest extends BaseTest {
  tipo: 'enigma';
  enigmas: Array<{
    id: string;
    titulo: string;
    planteamiento: string;
    pistas: string[];
    opciones: Array<{
      id: string;
      texto: string;
      correcta: boolean;
    }>;
    explicacion: string;
  }>;
}

export type AnyTest = PersonalityTest | ScoreTest | EnigmaTest;

const testsDirectory = path.join(process.cwd(), 'data', 'tests');

export async function getAllTests(): Promise<AnyTest[]> {
  try {
    if (!fs.existsSync(testsDirectory)) {
      return [];
    }
    const fileNames = fs.readdirSync(testsDirectory);
    const tests = fileNames
      .filter((file) => file.endsWith('.json'))
      .map((file) => {
        const fullPath = path.join(testsDirectory, file);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        return JSON.parse(fileContents) as AnyTest;
      });
    return tests;
  } catch (error) {
    console.error('Error reading tests:', error);
    return [];
  }
}

export async function getTestBySlug(slug: string): Promise<AnyTest | null> {
  try {
    const fullPath = path.join(testsDirectory, `${slug}.json`);
    if (!fs.existsSync(fullPath)) {
      return null;
    }
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    return JSON.parse(fileContents) as AnyTest;
  } catch (error) {
    console.error(`Error loading test ${slug}:`, error);
    return null;
  }
}
