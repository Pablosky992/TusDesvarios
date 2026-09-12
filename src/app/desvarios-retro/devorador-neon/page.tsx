import React from 'react';
import { Metadata } from 'next';
import NeonChompGame from './NeonChompGame';

export const metadata: Metadata = {
  title: 'Devorador Neón (Fuga en la Red) — Juego Arcade Retro Gratis | TusDesvarios.com',
  description:
    'Juega gratis a Devorador Neón: el mítico arcade de laberinto y persecución reinventado con 60 FPS, estética synthwave neón, 4 cortafuegos con IA táctica, pulsos EMP y sonido 8-bit.',
  keywords: [
    'juego estilo pacman gratis',
    'juego comer puntos laberinto',
    'arcade retro laberinto',
    'devorador neon',
    'juego neon synthwave',
    'juegos retro gratis',
    'tus desvarios',
    'desvarios retro',
  ],
  alternates: {
    canonical: 'https://tusdesvarios.com/desvarios-retro/devorador-neon',
  },
  openGraph: {
    title: 'Devorador Neón (Fuga en la Red) | Tus Desvaríos',
    description:
      'Navega por el circuito de datos, absorbe pulsos cuánticos y burla a los cortafuegos en una cabina arcade retro. ¡Juega gratis en tu navegador!',
    url: 'https://tusdesvarios.com/desvarios-retro/devorador-neon',
    siteName: 'Tus Desvaríos',
    type: 'website',
    images: [
      {
        url: '/images/games/portada_devorador_neon.jpg',
        width: 1200,
        height: 630,
        alt: 'Devorador Neón — Desvaríos Retro',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Devorador Neón — Juego Arcade Retro Gratis',
    description:
      'El clásico juego de laberinto y persecución con estética synthwave, 60 FPS, pulsos EMP y sonido 8-bit.',
    images: ['/images/games/portada_devorador_neon.jpg'],
  },
};

export default function DevoradorNeonPage() {
  const gameSchema = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: 'Devorador Neón (Fuga en la Red)',
    description:
      'Arcade retro de laberinto y persecución con estética synthwave neón, 60 FPS, 4 cortafuegos con IA táctica, pulsos EMP y sonido 8-bit.',
    url: 'https://tusdesvarios.com/desvarios-retro/devorador-neon',
    genre: ['Arcade', 'Action', 'Maze Runner', 'Retro Arcade'],
    playMode: 'SinglePlayer',
    applicationCategory: 'Game',
    inLanguage: 'es',
    image: 'https://tusdesvarios.com/images/games/portada_devorador_neon.jpg',
    publisher: {
      '@type': 'Organization',
      name: 'Tus Desvaríos',
      url: 'https://tusdesvarios.com',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(gameSchema) }}
      />
      <NeonChompGame />
    </>
  );
}
