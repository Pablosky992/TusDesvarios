import React from 'react';
import { Metadata } from 'next';
import { getHangmanData } from '@/lib/games';
import HangmanGame from './HangmanGame';

export const metadata: Metadata = {
  title: 'El Ahorcado Desvariado — Juego Arcade de Palabras Retro | TusDesvarios.com',
  description:
    'Juega gratis al Ahorcado clásico con estética synthwave retro y temáticas de literatura gótica, cine de culto, filosofía, mitología y videojuegos retro.',
  keywords: [
    'el ahorcado online gratis',
    'juego del ahorcado sin registro',
    'ahorcado retro arcade',
    'juegos de palabras clasicos',
    'tus desvarios',
    'desvarios retro',
  ],
  alternates: {
    canonical: 'https://tusdesvarios.com/desvarios-retro/el-ahorcado',
  },
  openGraph: {
    title: 'El Ahorcado Desvariado — Juego Arcade Retro | Tus Desvaríos',
    description:
      'Descifra la palabra oculta antes de que el cadalso de neón reclame tu alma. Efectos de sonido 8-bit y temáticas oscuras.',
    url: 'https://tusdesvarios.com/desvarios-retro/el-ahorcado',
    siteName: 'Tus Desvaríos',
    type: 'website',
    images: [
      {
        url: '/images/games/portada_ahorcado.jpg',
        width: 1200,
        height: 630,
        alt: 'El Ahorcado Desvariado — Desvaríos Retro',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'El Ahorcado Desvariado — Minijuego Retro Gratis',
    description:
      'Descifra palabras misteriosas en un arcade de neón con sonido 8-bit y 6 categorías temáticas.',
    images: ['/images/games/portada_ahorcado.jpg'],
  },
};

export default async function HangmanPage() {
  const gameData = await getHangmanData();

  // Schema.org VideoGame structured data
  const gameSchema = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: 'El Ahorcado Desvariado',
    description: gameData.descripcionCorta,
    url: 'https://tusdesvarios.com/desvarios-retro/el-ahorcado',
    genre: ['Word Game', 'Puzzle', 'Retro Arcade'],
    playMode: 'SinglePlayer',
    applicationCategory: 'Game',
    inLanguage: 'es',
    image: 'https://tusdesvarios.com/images/games/portada_ahorcado.jpg',
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
        name: 'El Ahorcado',
        item: 'https://tusdesvarios.com/desvarios-retro/el-ahorcado',
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
      <HangmanGame gameData={gameData} />
    </div>
  );
}
