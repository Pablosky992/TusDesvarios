import React from 'react';
import { Metadata } from 'next';
import { getAllWebs, getAllAmazonProducts } from '@/lib/red';
import RedClient from './RedClient';

export const metadata: Metadata = {
  title: 'Desvaríos por la Red — Escaparate Web & Bazar de Gadgets Curiosos | Tus Desvaríos',
  description:
    'Descubre proyectos web recomendados, publica tu propio sitio y explora una selección de gadgets insólitos y curiosidades de Amazon en Tus Desvaríos.',
  keywords: [
    'desvarios por la red',
    'escaparate web',
    'webs recomendadas',
    'gadgets amazon',
    'curiosidades de internet',
    'comunidad web',
  ],
  alternates: {
    canonical: 'https://tusdesvarios.com/desvarios-por-la-red',
  },
  openGraph: {
    title: 'Desvaríos por la Red — Escaparate Web & Gadgets de Amazon',
    description:
      'Directorio de proyectos web de la comunidad y catálogo de gadgets curiosos y regalos originales.',
    type: 'website',
    url: 'https://tusdesvarios.com/desvarios-por-la-red',
    images: [
      {
        url: '/images/categories/desvarios-red.jpg',
        width: 1200,
        height: 630,
        alt: 'Desvaríos por la Red — Tus Desvaríos',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Desvaríos por la Red — Tus Desvaríos',
    description: 'Escaparate de webs recomendadas y bazar de gadgets curiosos.',
    images: ['/images/categories/desvarios-red.jpg'],
  },
};

export default async function DesvariosPorLaRedPage() {
  const webs = await getAllWebs();
  const products = await getAllAmazonProducts();

  // Schema.org CollectionPage
  const pageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Desvaríos por la Red — Escaparate Web & Bazar de Amazon',
    description: 'Directorio de proyectos web de la comunidad y bazar de gadgets curiosos.',
    url: 'https://tusdesvarios.com/desvarios-por-la-red',
    inLanguage: 'es',
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
      />
      <RedClient webs={webs} products={products} />
    </>
  );
}
