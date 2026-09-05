export type EndingType = 'bueno' | 'malo' | 'neutro' | 'secreto';

export interface StoryOption {
  id: string;
  texto: string;
  destinoId: string;
  impacto?: string; // Etiqueta descriptiva opcional (ej: "Arriesgado", "Prudente")
}

export interface StoryNode {
  id: string;
  titulo?: string;
  texto: string;
  imagen?: string;
  opciones?: StoryOption[];
  esFinal?: boolean;
  tipo_final?: EndingType;
  mensaje_final?: string;
  dynamic?: boolean; // Para futura integración con generación vía IA
  contexto_prompt?: string;
}

export interface Story {
  slug: string;
  titulo: string;
  subtitulo?: string;
  descripcionCorta: string;
  genero: string;
  tiempoLecturaMin: number;
  portada: string;
  autor: string;
  nodoInicialId: string;
  totalNodosEstimados: number;
  nodos: Record<string, StoryNode>;
}

export interface StoryProgress {
  nodoActualId: string;
  historialNodos: string[];
  finalAlcanzado?: EndingType;
  finalesDescubiertos?: string[];
  fechaUltimoAcceso: string;
  completada: boolean;
  leida?: boolean;
}
