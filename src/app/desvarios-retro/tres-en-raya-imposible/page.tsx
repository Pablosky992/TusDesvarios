import React from 'react';
import { Metadata } from 'next';
import TicTacToeGame from './TicTacToeGame';

export const metadata: Metadata = {
  title: 'Tres en Raya Imposible (IA Minimax) — Juego Retro Online Gratis | TusDesvarios.com',
  description:
    'Juega gratis al Tres en Raya clásico y arcade: desafía a la IA Minimax invencible o compite con un amigo en modo local para 2 jugadores con efectos retro de neón y sonido 8-bit.',
  keywords: [
    'tres en raya online gratis',
    'tres en raya ia minimax',
    'tic tac toe retro',
    'juego del tres en raya',
    'tres en raya dos jugadores',
    'tus desvarios',
    'desvarios retro',
  ],
  alternates: {
    canonical: 'https://tusdesvarios.com/desvarios-retro/tres-en-raya-imposible',
  },
  openGraph: {
    title: 'Tres en Raya Imposible (IA Minimax) | Tus Desvaríos',
    description:
      '¿Podrás vencer al algoritmo matemático invencible? Juega al Tres en Raya en solitario o a 2 jugadores con estética synthwave neón.',
    url: 'https://tusdesvarios.com/desvarios-retro/tres-en-raya-imposible',
    siteName: 'Tus Desvaríos',
    type: 'website',
    images: [
      {
        url: '/images/games/portada_tres_en_raya.jpg',
        width: 1200,
        height: 630,
        alt: 'Tres en Raya Imposible — Desvaríos Retro',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tres en Raya Imposible (IA Minimax) — Juego Retro Gratis',
    description:
      'Compite contra la IA perfecta o reta a un amigo en local en una cuadrícula arcade de neón con sonido 8-bit.',
    images: ['/images/games/portada_tres_en_raya.jpg'],
  },
};

export default function TicTacToePage() {
  const gameSchema = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: 'Tres en Raya Imposible (IA Minimax)',
    description:
      'Desafía a un motor matemático imbatible o juega contra un amigo en local en una pantalla arcade retro neón.',
    url: 'https://tusdesvarios.com/desvarios-retro/tres-en-raya-imposible',
    genre: ['Board Game', 'Logic', 'Strategy', 'Tic Tac Toe'],
    playMode: ['SinglePlayer', 'MultiPlayer'],
    applicationCategory: 'Game',
    inLanguage: 'es',
    image: 'https://tusdesvarios.com/images/games/portada_tres_en_raya.jpg',
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
        name: 'Tres en Raya Imposible',
        item: 'https://tusdesvarios.com/desvarios-retro/tres-en-raya-imposible',
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
      <TicTacToeGame />
    </>
  );
}
