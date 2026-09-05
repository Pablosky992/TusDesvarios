import React from 'react';
import { Metadata } from 'next';
import SpaceShooterGame from './SpaceShooterGame';

export const metadata: Metadata = {
  title: 'Invasores del Espacio (Defensa Cósmica) — Juego Arcade Gratis | TusDesvarios.com',
  description:
    'Juega gratis a Invasores del Espacio: el mítico matamarcianos retro arcade reinventado con estética synthwave neón, 60 FPS, búnkeres destructibles, nave nodriza de bonificación y sonido 8-bit.',
  keywords: [
    'juego marcianos gratis',
    'invasores del espacio online',
    'matamarcianos retro',
    'space shooter arcade',
    'alien invaders gratis',
    'juegos arcade retro gratis',
    'tus desvarios',
    'desvarios retro',
  ],
  alternates: {
    canonical: 'https://tusdesvarios.com/desvarios-retro/invasores-del-espacio',
  },
  openGraph: {
    title: 'Invasores del Espacio (Defensa Cósmica) | Tus Desvaríos',
    description:
      'Defiende la órbita de hordas alienígenas con tu cañón de plasma. ¡Juega gratis en tu navegador!',
    url: 'https://tusdesvarios.com/desvarios-retro/invasores-del-espacio',
    siteName: 'Tus Desvaríos',
    type: 'website',
    images: [
      {
        url: '/images/games/portada_invasores.jpg',
        width: 1200,
        height: 630,
        alt: 'Invasores del Espacio — Desvaríos Retro',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Invasores del Espacio — Juego Arcade Retro Gratis',
    description:
      'El clásico matamarcianos arcade con física a 60 FPS, oleadas progresivas y estética synthwave.',
    images: ['/images/games/portada_invasores.jpg'],
  },
};

export default function SpaceShooterPage() {
  const gameSchema = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: 'Invasores del Espacio (Defensa Cósmica)',
    description:
      'El legendario matamarcianos arcade retro reinventado con estética synthwave neón, 60 FPS, búnkeres destructibles, nave nodriza misteriosa y sonido 8-bit.',
    url: 'https://tusdesvarios.com/desvarios-retro/invasores-del-espacio',
    genre: ['Arcade', 'Action', 'Shoot em up', 'Space Shooter', 'Retro Arcade'],
    playMode: 'SinglePlayer',
    applicationCategory: 'Game',
    inLanguage: 'es',
    image: 'https://tusdesvarios.com/images/games/portada_invasores.jpg',
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
        name: 'Invasores del Espacio',
        item: 'https://tusdesvarios.com/desvarios-retro/invasores-del-espacio',
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
      <SpaceShooterGame />
    </>
  );
}
