import React from 'react';
import { Metadata } from 'next';
import SnakeGame from './SnakeGame';

export const metadata: Metadata = {
  title: 'Snake Cyberpunk 2084 — Juego Arcade de la Serpiente Neón | TusDesvarios.com',
  description:
    'Juega gratis a Snake Cyberpunk 2084: la mítica serpiente arcade reinventada con estética synthwave, portales dimensionales, modo contrarreloj y efectos 8-bit.',
  keywords: [
    'juego de la serpiente gratis',
    'snake online gratis',
    'snake cyberpunk',
    'juegos retro arcade online',
    'minijuego snake navegador',
    'tus desvarios',
    'desvarios retro',
  ],
  alternates: {
    canonical: 'https://tusdesvarios.com/desvarios-retro/snake-cyberpunk',
  },
  openGraph: {
    title: 'Snake Cyberpunk 2084 — Juego Arcade de Neón | Tus Desvaríos',
    description:
      'Guía a la serpiente de neón a través de cuadrículas synthwave, portales y nodos de datos cuánticos. ¡Juega gratis en tu navegador!',
    url: 'https://tusdesvarios.com/desvarios-retro/snake-cyberpunk',
    siteName: 'Tus Desvaríos',
    type: 'website',
    images: [
      {
        url: '/images/games/portada_snake.jpg',
        width: 1200,
        height: 630,
        alt: 'Snake Cyberpunk 2084 — Desvaríos Retro',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Snake Cyberpunk 2084 — Juego Arcade Retro Gratis',
    description:
      'El clásico juego de la serpiente con modos de portales, contrarreloj, efectos de sonido 8-bit y estética neón.',
    images: ['/images/games/portada_snake.jpg'],
  },
};

export default function SnakePage() {
  // Schema.org VideoGame structured data
  const gameSchema = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: 'Snake Cyberpunk 2084',
    description:
      'La mítica serpiente arcade en una cuadrícula synthwave futurista con modos de portales, contrarreloj y efectos 8-bit.',
    url: 'https://tusdesvarios.com/desvarios-retro/snake-cyberpunk',
    genre: ['Arcade', 'Action', 'Retro Arcade', 'Snake'],
    playMode: 'SinglePlayer',
    applicationCategory: 'Game',
    inLanguage: 'es',
    image: 'https://tusdesvarios.com/images/games/portada_snake.jpg',
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
        name: 'Snake Cyberpunk 2084',
        item: 'https://tusdesvarios.com/desvarios-retro/snake-cyberpunk',
      },
    ],
  };

  return (
    <div className="main-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(gameSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <SnakeGame />
    </div>
  );
}
