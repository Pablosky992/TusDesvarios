import React from 'react';
import { Metadata } from 'next';
import RetroTennisGame from './RetroTennisGame';

export const metadata: Metadata = {
  title: 'Tenis Retro 1972 (Duelo de Palas) — Juego Arcade Clásico Gratis | TusDesvarios.com',
  description:
    'Juega gratis a Tenis Retro 1972: el legendario duelo arcade de palas y pelota en blanco y negro a 60 FPS. Modo 1P contra la IA (3 dificultades), modo 2P local, física de rebote angular y sonido 8-bit.',
  keywords: [
    'juego estilo pong antiguo gratis',
    'juego palas y pelota retro',
    'tenis retro 1972',
    'juego arcade tenis de mesa',
    'duelo de palas retro',
    'juegos retro dos jugadores',
    'juegos gratis navegador',
    'tus desvarios',
    'desvarios retro',
  ],
  alternates: {
    canonical: 'https://tusdesvarios.com/desvarios-retro/tenis-retro',
  },
  openGraph: {
    title: 'Tenis Retro 1972 (Duelo de Palas) | Tus Desvaríos',
    description:
      'El clásico duelo de palas y pelota de 1972 a 60 FPS. Juega gratis contra la IA o reta a un amigo en local.',
    url: 'https://tusdesvarios.com/desvarios-retro/tenis-retro',
    siteName: 'Tus Desvaríos',
    type: 'website',
    images: [
      {
        url: '/images/games/portada_tenis_retro.jpg',
        width: 1200,
        height: 630,
        alt: 'Tenis Retro 1972 — Desvaríos Retro',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tenis Retro 1972 — Duelo de Palas Arcade Gratis',
    description:
      'El mítico duelo de tenis arcade de 1972 a 60 FPS con modos 1P y 2P, paletas CRT y sonido procedural.',
    images: ['/images/games/portada_tenis_retro.jpg'],
  },
};

export default function TenisRetroPage() {
  const gameSchema = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: 'Tenis Retro 1972 (Duelo de Palas)',
    description:
      'El clásico duelo arcade de palas y pelota de 1972 con física angular dinámica, aceleración por peloteo, modo 1P vs IA (3 dificultades), modo 2P local y sonido procedural 8-bit.',
    url: 'https://tusdesvarios.com/desvarios-retro/tenis-retro',
    genre: ['Arcade', 'Sports', 'Retro Arcade', 'Table Tennis'],
    playMode: ['SinglePlayer', 'MultiPlayer'],
    applicationCategory: 'Game',
    inLanguage: 'es',
    image: 'https://tusdesvarios.com/images/games/portada_tenis_retro.jpg',
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
      <RetroTennisGame />
    </>
  );
}
