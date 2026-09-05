import React from 'react';
import { Metadata } from 'next';
import BuscaminasGame from './BuscaminasGame';

export const metadata: Metadata = {
  title: 'Buscaminas Desvariado — Puzle Lógico Retro Gratis | TusDesvarios.com',
  description:
    'Juega gratis al legendario Buscaminas con estética retro arcade, primer clic seguro garantizado, tres dificultades, efectos de sonido 8-bit y récords.',
  keywords: [
    'buscaminas gratis',
    'buscaminas online gratis',
    'juegos clasicos retro',
    'puzles logicos navegador',
    'minesweeper online',
    'tus desvarios',
    'desvarios retro',
  ],
  alternates: {
    canonical: 'https://tusdesvarios.com/desvarios-retro/buscaminas',
  },
  openGraph: {
    title: 'Buscaminas Desvariado — El Clásico de Lógica Retro | Tus Desvaríos',
    description:
      'Desactiva minas con pura lógica deductiva en una consola arcade retro. ¡Juega gratis en tu navegador!',
    url: 'https://tusdesvarios.com/desvarios-retro/buscaminas',
    siteName: 'Tus Desvaríos',
    type: 'website',
    images: [
      {
        url: '/images/games/portada_buscaminas.jpg',
        width: 1200,
        height: 630,
        alt: 'Buscaminas Desvariado — Desvaríos Retro',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Buscaminas Desvariado — Juego Arcade Retro Gratis',
    description:
      'El mítico Buscaminas con modos principiante, intermedio y experto, sonido 8-bit y cronómetro.',
    images: ['/images/games/portada_buscaminas.jpg'],
  },
};

export default function BuscaminasPage() {
  // Schema.org VideoGame structured data
  const gameSchema = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: 'Buscaminas Desvariado',
    description:
      'El legendario puzle de banderas y números con modos clásicos, temporizador digital, sonido 8-bit y selector de dificultad.',
    url: 'https://tusdesvarios.com/desvarios-retro/buscaminas',
    genre: ['Puzzle', 'Logic', 'Retro Arcade', 'Minesweeper'],
    playMode: 'SinglePlayer',
    applicationCategory: 'Game',
    inLanguage: 'es',
    image: 'https://tusdesvarios.com/images/games/portada_buscaminas.jpg',
    publisher: {
      '@type': 'Organization',
      name: 'Tus Desvaríos',
      url: 'https://tusdesvarios.com',
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Inicio',
        item: 'https://tusdesvarios.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Desvaríos Retro',
        item: 'https://tusdesvarios.com/desvarios-retro',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Buscaminas Desvariado',
        item: 'https://tusdesvarios.com/desvarios-retro/buscaminas',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(gameSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <BuscaminasGame />
    </>
  );
}
