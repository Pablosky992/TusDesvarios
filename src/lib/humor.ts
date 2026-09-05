import excusasData from '@/../data/humor/excusas.json';
import oraculoData from '@/../data/humor/oraculo.json';
import leyesData from '@/../data/humor/leyes.json';
import pildorasData from '@/../data/humor/pildoras.json';

// --- 1. Excusas ---
export interface AmbitoExcusa {
  id: string;
  nombre: string;
  icono: string;
}

export interface GravedadExcusa {
  id: string;
  nombre: string;
  icono: string;
  color: string;
}

export interface TonoExcusa {
  id: string;
  nombre: string;
  icono: string;
}

export interface ExcusaItem {
  ambito: string;
  gravedad: string;
  tono: string;
  texto: string;
  credibilidad: number;
  consejo: string;
}

// --- 2. Oráculo (Predicciones Directas) ---
export interface PrediccionOraculo {
  id: string;
  icono: string;
  titulo: string;
  dilema: string;
  veredicto: string;
  razon: string;
  consejo: string;
  signoAfin: string;
  probabilidad: string;
}

// --- 3. Leyes del Caos (Murphy) ---
export interface LeyItem {
  id: string;
  numero: string;
  icono: string;
  categoria: string;
  nombre: string;
  descripcion: string;
  probabilidad: string;
  consejo: string;
}

// --- 4. Pensamientos de Ducha ---
export interface PensamientoItem {
  id: string;
  icono: string;
  titulo: string;
  contenido: string;
  autor: string;
}

// Getters
export function getAmbitos(): AmbitoExcusa[] {
  return excusasData.ambitos;
}

export function getGravedades(): GravedadExcusa[] {
  return excusasData.gravedades;
}

export function getTonos(): TonoExcusa[] {
  return excusasData.tonos;
}

export function getCatalogoExcusas(): ExcusaItem[] {
  return excusasData.catalogo;
}

export function getPrediccionesOraculo(): PrediccionOraculo[] {
  return (oraculoData as { predicciones: PrediccionOraculo[] }).predicciones;
}

export function getLeyes(): LeyItem[] {
  return (leyesData as { leyes: LeyItem[] }).leyes;
}

export function getPensamientos(): PensamientoItem[] {
  return (pildorasData as { pensamientos: PensamientoItem[] }).pensamientos;
}
