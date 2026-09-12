import fs from 'fs';
import path from 'path';

export interface GameMetadata {
  id: string;
  slug: string;
  titulo: string;
  subtitulo: string;
  descripcionCorta: string;
  icono: string;
  categoria: 'palabras' | 'logica' | 'arcade' | 'tablero';
  categoriaLabel: string;
  tiempoMin: number;
  color: string;
  portada?: string;
  disponible: boolean;
  etiqueta?: string;
}

export interface HangmanCategory {
  id: string;
  nombre: string;
  icono: string;
  descripcion: string;
}

export interface HangmanWord {
  palabra: string;
  categoria: string;
  pista: string;
  curiosidad?: string;
}

export interface HangmanGameData {
  id: string;
  slug: string;
  titulo: string;
  subtitulo: string;
  descripcionCorta: string;
  icono: string;
  categoria: string;
  categoriaLabel: string;
  tiempoMin: number;
  color: string;
  portada: string;
  categorias: HangmanCategory[];
  palabras: HangmanWord[];
}

export const RETRO_GAMES_CATALOG: GameMetadata[] = [
  {
    id: 'el-ahorcado',
    slug: 'el-ahorcado',
    titulo: 'El Ahorcado Desvariado',
    subtitulo: 'Descifra la palabra oculta antes de que el cadalso de neón reclame tu alma',
    descripcionCorta:
      'El clásico juego del ahorcado con estética retro arcade, efectos de sonido 8-bit, 6 categorías temáticas (literatura, cine sci-fi, filosofía, mitología, retro) y pistas.',
    icono: '🔤',
    categoria: 'palabras',
    categoriaLabel: 'Palabras & Letras',
    tiempoMin: 3,
    color: '#a855f7',
    portada: 'images/games/portada_ahorcado.jpg',
    disponible: true,
    etiqueta: '🟢 Disponible',
  },
  {
    id: 'snake-cyberpunk',
    slug: 'snake-cyberpunk',
    titulo: 'Snake Cyberpunk 2084',
    subtitulo: 'Conduce a la serpiente de neón a través de portales y anomalías de datos',
    descripcionCorta:
      'La mítica serpiente arcade en una cuadrícula synthwave futurista con multiplicadores de velocidad y obstáculos dinámicos.',
    icono: '🐍',
    categoria: 'arcade',
    categoriaLabel: 'Acción Arcade',
    tiempoMin: 5,
    color: '#10b981',
    portada: 'images/games/portada_snake.jpg',
    disponible: true,
    etiqueta: '🟢 Disponible',
  },
  {
    id: 'buscaminas',
    slug: 'buscaminas',
    titulo: 'Buscaminas Desvariado',
    subtitulo: 'Desactiva anomalías dimensionales usando pura lógica y deducción',
    descripcionCorta:
      'El legendario puzle de banderas y números con modos clásicos, temporizador digital, sonido 8-bit y selector de dificultad.',
    icono: '💣',
    categoria: 'logica',
    categoriaLabel: 'Lógica & Tablero',
    tiempoMin: 4,
    color: '#f59e0b',
    portada: 'images/games/portada_buscaminas.jpg',
    disponible: true,
    etiqueta: '🟢 Disponible',
  },
  {
    id: 'tres-en-raya-imposible',
    slug: 'tres-en-raya-imposible',
    titulo: 'Tres en Raya Imposible (IA Minimax)',
    subtitulo: '¿Serás capaz de vencer a la inteligencia artificial invencible?',
    descripcionCorta:
      'Desafía a un motor matemático imbatible o juega contra un amigo en local en una pantalla retro pixel.',
    icono: '❌',
    categoria: 'tablero',
    categoriaLabel: 'Lógica & Tablero',
    tiempoMin: 2,
    color: '#06b6d4',
    portada: 'images/games/portada_tres_en_raya.jpg',
    disponible: true,
    etiqueta: '🟢 Disponible',
  },
  {
    id: 'rompebloques-neon',
    slug: 'rompebloques-neon',
    titulo: 'Rompebloques Neón (Dimensión Cósmica)',
    subtitulo: 'Destruye barreras dimensionales y recolecta cápsulas de energía cósmica',
    descripcionCorta:
      'El clásico rompebloques arcade reinventado con estética synthwave neón, física dinámica a 60 FPS, múltiples niveles, power-ups y sonido 8-bit.',
    icono: '🧱',
    categoria: 'arcade',
    categoriaLabel: 'Acción Arcade',
    tiempoMin: 4,
    color: '#ec4899',
    portada: 'images/games/portada_rompebloques.jpg',
    disponible: true,
    etiqueta: '🟢 Disponible',
  },
  {
    id: 'invasores-del-espacio',
    slug: 'invasores-del-espacio',
    titulo: 'Invasores del Espacio (Defensa Cósmica)',
    subtitulo: 'Defiende la órbita terrestre de hordas alienígenas con tu cañón de plasma',
    descripcionCorta:
      'El legendario matamarcianos retro arcade reinventado con 60 FPS, estética synthwave neón, búnkeres destructibles, nave nodriza misteriosa y sonido 8-bit.',
    icono: '👾',
    categoria: 'arcade',
    categoriaLabel: 'Acción Arcade',
    tiempoMin: 4,
    color: '#06b6d4',
    portada: 'images/games/portada_invasores.jpg',
    disponible: true,
    etiqueta: '🟢 Disponible',
  },
  {
    id: 'bloques-neon',
    slug: 'bloques-neon',
    titulo: 'Bloques Neón (Matriz Cuántica)',
    subtitulo: 'Alinea módulos geométricos, activa pulsos cuánticos y desafía a la gravedad arcade',
    descripcionCorta:
      'El legendario puzle de encaje y caída de bloques reinventado con estética synthwave neón, 60 FPS, aceleración progresiva, reserva cuántica, partículas y sonido 8-bit.',
    icono: '🧩',
    categoria: 'arcade',
    categoriaLabel: 'Acción Arcade',
    tiempoMin: 5,
    color: '#38bdf8',
    portada: 'images/games/portada_bloques_neon.jpg',
    disponible: true,
    etiqueta: '🟢 Disponible',
  },
  {
    id: 'devorador-neon',
    slug: 'devorador-neon',
    titulo: 'Devorador Neón (Fuga en la Red)',
    subtitulo: 'Navega por la placa base, devora nodos de datos y hackea a los cortafuegos centinela',
    descripcionCorta:
      'El mítico arcade de laberintos y persecución reinventado con estética synthwave neón, 60 FPS, 4 cortafuegos con IA táctica, pulsos EMP, portales cuánticos y controles táctiles.',
    icono: '👾',
    categoria: 'arcade',
    categoriaLabel: 'Acción Arcade',
    tiempoMin: 4,
    color: '#10b981',
    portada: 'images/games/portada_devorador_neon.jpg',
    disponible: true,
    etiqueta: '🟢 Disponible',
  },
  {
    id: 'tenis-retro',
    slug: 'tenis-retro',
    titulo: 'Tenis Retro 1972 (Duelo de Palas)',
    subtitulo: 'El legendario enfrentamiento de tenis arcade de 1972 que inició la era del videojuego',
    descripcionCorta:
      'El clásico duelo de palas y pelota en blanco y negro a 60 FPS con física de rebote angular, aceleración por peloteo, modo 1P vs IA (3 dificultades) y modo 2P local.',
    icono: '🏓',
    categoria: 'arcade',
    categoriaLabel: 'Acción Arcade',
    tiempoMin: 3,
    color: '#f8fafc',
    portada: 'images/games/portada_tenis_retro.jpg',
    disponible: true,
    etiqueta: '🟢 Disponible',
  },
];

export async function getAllGames(): Promise<GameMetadata[]> {
  return RETRO_GAMES_CATALOG;
}

export async function getHangmanData(): Promise<HangmanGameData> {
  const filePath = path.join(process.cwd(), 'data', 'games', 'ahorcado.json');
  const fileContent = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContent) as HangmanGameData;
}
