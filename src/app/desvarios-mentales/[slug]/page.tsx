import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllTests, getTestBySlug } from '@/lib/tests';
import TestRunner from './TestRunner';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const tests = await getAllTests();
  return tests.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const test = await getTestBySlug(slug);
  if (!test) return { title: 'Test no encontrado — Tus Desvaríos' };

  const url = `https://tusdesvarios.com/desvarios-mentales/${slug}`;

  return {
    title: `${test.titulo} — Desvaríos Mentales | TusDesvarios.com`,
    description: test.descripcionCorta,
    keywords: [
      test.titulo.toLowerCase(),
      test.slug.replace(/-/g, ' '),
      test.categoriaLabel ? test.categoriaLabel.toLowerCase() : 'tests online',
      'tests de personalidad gratis',
      'test psicologico interactivo',
      'desvarios mentales',
      'tus desvarios',
    ],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${test.titulo} — Desvaríos Mentales | Tus Desvaríos`,
      description: test.descripcionCorta,
      url: url,
      siteName: 'Tus Desvaríos',
      type: 'website',
      images: [
        {
          url: '/images/categories/desvarios-mentales.jpg',
          width: 1200,
          height: 630,
          alt: test.titulo,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${test.titulo} — Desvaríos Mentales`,
      description: test.descripcionCorta,
      images: ['/images/categories/desvarios-mentales.jpg'],
    },
  };
}

export default async function TestDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const test = await getTestBySlug(slug);

  if (!test) {
    notFound();
  }

  // Generate Questions for Schema.org Quiz
  const questionEntities = ('preguntas' in test ? test.preguntas : []).map((q, idx) => ({
    '@type': 'Question',
    name: `Pregunta ${idx + 1}: ${q.texto}`,
    suggestedAnswer: ('opciones' in q ? q.opciones : []).map((opt) => ({
      '@type': 'Answer',
      text: opt.texto,
    })),
  }));

  const quizSchema = {
    '@context': 'https://schema.org',
    '@type': 'Quiz',
    name: test.titulo,
    description: test.descripcionCorta,
    url: `https://tusdesvarios.com/desvarios-mentales/${test.slug}`,
    inLanguage: 'es',
    timeRequired: `PT${test.tiempoMin || 5}M`,
    about: {
      '@type': 'Thing',
      name: test.categoriaLabel || 'Desvaríos Mentales',
    },
    hasPart: questionEntities.length > 0 ? questionEntities : undefined,
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
        name: 'Desvaríos Mentales',
        item: 'https://tusdesvarios.com/desvarios-mentales',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: test.titulo,
        item: `https://tusdesvarios.com/desvarios-mentales/${test.slug}`,
      },
    ],
  };

  return (
    <div className="main-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(quizSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <TestRunner test={test} />
    </div>
  );
}
