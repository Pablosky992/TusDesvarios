import React from 'react';
import { Metadata } from 'next';
import NeonBlocksGame from './NeonBlocksGame';

export const metadata: Metadata = {
  title: 'Bloques Neón (Matriz Cuántica) — Puzle Arcade Retro Gratis | TusDesvarios.com',
  description:
    'Juega gratis a Bloques Neón: el legendario juego arcade de caída de bloques y encaje geométrico. 60 FPS, estética synthwave neón, reserva de piezas, multiplicadores cuánticos y controles táctiles.',
  keywords: [
    'juego de bloques gratis',
    'puzle de bloques online',
    'bloques retro arcade',
    'juego caida de bloques',
    'bloques neon synthwave',
    'juego estilo bloques',
    'tus desvarios',
    'desvarios retro',
  ],
  alternates: {
    canonical: 'https://tusdesvarios.com/desvarios-retro/bloques-neon',
  },
  openGraph: {
    title: 'Bloques Neón (Matriz Cuántica) | Tus Desvaríos',
    description:
      'Alinea módulos geométricos, activa pulsos cuánticos y desafía a la gravedad en una cabina arcade retro. ¡Juega gratis en tu navegador!',
    url: 'https://tusdesvarios.com/desvarios-retro/bloques-neon',
    siteName: 'Tus Desvaríos',
    type: 'website',
    images: [
      {
        url: '/images/games/portada_bloques_neon.jpg',
        width: 1200,
        height: 630,
        alt: 'Bloques Neón — Desvaríos Retro',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bloques Neón — Puzle Arcade Retro Gratis',
    description:
      'El clásico juego de caída de bloques con estética synthwave, física precisa a 60 FPS, reserva cuántica y sonido 8-bit.',
    images: ['/images/games/portada_bloques_neon.jpg'],
  },
};

export default function BloquesNeonPage() {
  const gameSchema = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: 'Bloques Neón (Matriz Cuántica)',
    description:
      'Puzle arcade de encaje geométrico y caída de bloques con estética synthwave neón, velocidad progresiva, reserva cuántica y efectos 8-bit.',
    url: 'https://tusdesvarios.com/desvarios-retro/bloques-neon',
    genre: ['Arcade', 'Puzzle', 'Falling Blocks', 'Retro Arcade'],
    playMode: 'SinglePlayer',
    applicationCategory: 'Game',
    inLanguage: 'es',
    image: 'https://tusdesvarios.com/images/games/portada_bloques_neon.jpg',
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
      <NeonBlocksGame />
    </>
  );
}
