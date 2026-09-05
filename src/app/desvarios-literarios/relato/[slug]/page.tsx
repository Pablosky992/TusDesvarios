import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getAllRelatos, getRelatoBySlug } from '@/lib/literarios';
import ReaderClient from './ReaderClient';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const relatos = await getAllRelatos();
  return relatos.map((r) => ({
    slug: r.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const relato = await getRelatoBySlug(slug);

  if (!relato) {
    return {
      title: 'Relato no encontrado | Tus Desvaríos',
    };
  }

  let imageName = 'el-susurro-relojes.jpg';
  if (relato.slug === 'el-ultimo-eco-de-andromeda') imageName = 'el-ultimo-eco-andromeda.jpg';
  if (relato.slug === 'la-taberna-del-cuervo-ciego') imageName = 'la-taberna-cuervo-ciego.jpg';
  if (relato.slug === 'el-coleccionista-de-silencios') imageName = 'el-coleccionista-silencios.jpg';
  if (relato.slug === 'microrrelatos-de-impacto') imageName = 'microrrelatos-impacto.jpg';

  return {
    title: `${relato.titulo} — Desvaríos Literarios | Tus Desvaríos`,
    description: relato.descripcionCorta,
    authors: [{ name: relato.autor || 'Tus Desvaríos' }],
    keywords: [...relato.etiquetas, 'desvarios literarios', 'relato corto', 'cuento online'],
    alternates: {
      canonical: `https://tusdesvarios.com/desvarios-literarios/relato/${relato.slug}`,
    },
    openGraph: {
      title: `${relato.titulo} — ${relato.subtitulo}`,
      description: relato.descripcionCorta,
      type: 'article',
      url: `https://tusdesvarios.com/desvarios-literarios/relato/${relato.slug}`,
      images: [
        {
          url: `/images/literarios/${imageName}`,
          width: 1200,
          height: 630,
          alt: relato.titulo,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${relato.titulo} — Tus Desvaríos`,
      description: relato.descripcionCorta,
      images: [`/images/literarios/${imageName}`],
    },
  };
}

export default async function RelatoPage({ params }: PageProps) {
  const { slug } = await params;
  const relato = await getRelatoBySlug(slug);

  if (!relato) {
    notFound();
  }

  const allRelatos = await getAllRelatos();

  // Schema.org Article
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: relato.titulo,
    description: relato.descripcionCorta,
    author: {
      '@type': 'Organization',
      name: relato.autor || 'Tus Desvaríos',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Tus Desvaríos',
      url: 'https://tusdesvarios.com',
    },
    datePublished: relato.fecha,
    wordCount: relato.palabras,
    timeRequired: `PT${relato.tiempoLecturaMin}M`,
    mainEntityOfPage: `https://tusdesvarios.com/desvarios-literarios/relato/${relato.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <ReaderClient relato={relato} allRelatos={allRelatos} />
    </>
  );
}
