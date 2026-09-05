import React from 'react';
import { Metadata } from 'next';
import BrickBreakerGame from './BrickBreakerGame';

export const metadata: Metadata = {
  title: 'Rompebloques Neón (Dimensión Cósmica) — Juego Arcade Retro Gratis | TusDesvarios.com',
  description:
    'Juega gratis a Rompebloques Neón: el clásico arcade de rebotar la bola reinventado con física a 60 FPS, estética synthwave neón, cápsulas de power-ups, disparos láser y sonido 8-bit.',
  keywords: [
    'rompebloques gratis',
    'rompebloques online gratis',
    'juego rompebloques arcade',
    'breakout neón',
    'juego romper ladrillos',
    'brick breaker retro',
    'tus desvarios',
    'desvarios retro',
  ],
  alternates: {
    canonical: 'https://tusdesvarios.com/desvarios-retro/rompebloques-neon',
  },
  openGraph: {
    title: 'Rompebloques Neón (Dimensión Cósmica) | Tus Desvaríos',
    description:
      'Destruye barreras dimensionales y recolecta cápsulas de energía cósmica en una cabina arcade retro. ¡Juega gratis en tu navegador!',
    url: 'https://tusdesvarios.com/desvarios-retro/rompebloques-neon',
    siteName: 'Tus Desvaríos',
    type: 'website',
    images: [
      {
        url: '/images/games/portada_rompebloques.jpg',
        width: 1200,
        height: 630,
        alt: 'Rompebloques Neón — Desvaríos Retro',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rompebloques Neón — Juego Arcade Retro Gratis',
    description:
      'El clásico rompebloques con física a 60 FPS, múltiples niveles, power-ups y estética synthwave.',
    images: ['/images/games/portada_rompebloques.jpg'],
  },
};

export default function RompebloquesPage() {
  const gameSchema = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: 'Rompebloques Neón (Dimensión Cósmica)',
    description:
      'El clásico rompebloques arcade reinventado con estética synthwave neón, física dinámica a 60 FPS, múltiples niveles, power-ups y sonido 8-bit.',
    url: 'https://tusdesvarios.com/desvarios-retro/rompebloques-neon',
    genre: ['Arcade', 'Action', 'Breakout', 'Retro Arcade', 'Brick Breaker'],
    playMode: 'SinglePlayer',
    applicationCategory: 'Game',
    inLanguage: 'es',
    image: 'https://tusdesvarios.com/images/games/portada_rompebloques.jpg',
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
        name: 'Rompebloques Neón',
        item: 'https://tusdesvarios.com/desvarios-retro/rompebloques-neon',
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
      <BrickBreakerGame />
    </>
  );
}
