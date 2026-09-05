import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getAllRelatos } from '@/lib/literarios';
import { Sparkles, ArrowLeft, BookOpen, ScrollText, Compass, Heart, ShieldCheck } from 'lucide-react';
import LiterariosClient from './LiterariosClient';

export const metadata: Metadata = {
  title: 'Desvaríos Literarios — Historias Cortas, Terror Gótico, Ciencia Ficción y Relatos | Tus Desvaríos',
  description:
    'Sumérgete en nuestra biblioteca de ficción narrativa: cuentos de terror psicológico, distopías espaciales, fantasía oscura y microrrelatos con modo de lectura inmersivo.',
  keywords: [
    'desvarios literarios',
    'relatos cortos gratis',
    'cuentos de terror psicologico',
    'ciencia ficcion espacial relatos',
    'fantasia oscura cuentos',
    'microrrelatos',
    'historias para leer online',
    'tus desvarios',
  ],
  alternates: {
    canonical: 'https://tusdesvarios.com/desvarios-literarios',
  },
  openGraph: {
    title: 'Desvaríos Literarios — Relatos, Novelas y Ficción Inmersiva | Tus Desvaríos',
    description:
      'Historias cortas para evadirse: terror gótico, ciencia ficción profunda, leyendas de taberna y microrrelatos con lector configurable.',
    url: 'https://tusdesvarios.com/desvarios-literarios',
    siteName: 'Tus Desvaríos',
    type: 'website',
    images: [
      {
        url: '/images/categories/desvarios-literarios.jpg',
        width: 1200,
        height: 630,
        alt: 'Desvaríos Literarios en TusDesvarios.com',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Desvaríos Literarios — Relatos y Ficción Inmersiva',
    description: 'Historias cortas de terror, ciencia ficción y fantasía para disfrutar de buena lectura.',
    images: ['/images/categories/desvarios-literarios.jpg'],
  },
};

export default async function DesvariosLiterariosPage() {
  const relatos = await getAllRelatos();

  // Structured Data (JSON-LD) for SEO
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Antología de Desvaríos Literarios',
    description: 'Colección de relatos cortos, cuentos de terror, ciencia ficción y microrrelatos.',
    numberOfItems: relatos.length,
    itemListElement: relatos.map((r, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: r.titulo,
      description: r.descripcionCorta,
      url: `https://tusdesvarios.com/desvarios-literarios/relato/${r.slug}`,
    })),
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
        name: 'Desvaríos Literarios',
        item: 'https://tusdesvarios.com/desvarios-literarios',
      },
    ],
  };

  return (
    <div className="home-container" style={{ padding: '2rem 1.25rem 5rem' }}>
      {/* Schema.org Injections */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Breadcrumb Navigation */}
      <div style={{ maxWidth: '1100px', margin: '0 auto 1.5rem' }}>
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            transition: 'color 0.2s',
          }}
          className="breadcrumb-link"
        >
          <ArrowLeft size={14} />
          Volver a Tus Desvaríos
        </Link>
      </div>

      {/* Hero Section */}
      <section className="hero-section" style={{ textAlign: 'center', padding: '1rem 1rem 3rem' }}>
        <div
          className="hero-badge"
          style={{
            background: 'rgba(245, 158, 11, 0.12)',
            borderColor: 'rgba(245, 158, 11, 0.35)',
            color: '#fbbf24',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.35rem 0.95rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.8rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: '1.25rem',
            boxShadow: '0 0 20px rgba(245, 158, 11, 0.25)',
          }}
        >
          <ScrollText size={15} />
          <span>Ficción Narrativa & Cuentos de Autor</span>
        </div>

        <h1
          className="hero-title"
          style={{
            fontFamily: "var(--font-display, 'Cinzel', serif)",
            fontSize: 'clamp(2.4rem, 5.5vw, 3.6rem)',
            fontWeight: 900,
            letterSpacing: '0.04em',
            color: '#ffffff',
            lineHeight: 1.15,
            marginBottom: '1rem',
          }}
        >
          Desvaríos <span style={{ color: '#f59e0b', textShadow: '0 0 35px rgba(245,158,11,0.5)' }}>Literarios</span>
        </h1>

        <p
          className="hero-description"
          style={{
            fontSize: '1.05rem',
            color: 'var(--text-secondary)',
            maxWidth: '680px',
            margin: '0 auto 1.75rem',
            lineHeight: 1.65,
          }}
        >
          Historias breves, terror gótico, paradojas de ciencia ficción y realismo mágico.
          Lecturas completas diseñadas para desconectar de la prisa y perderse entre palabras.
        </p>

        {/* SEO Trust Badges */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '0.85rem',
          }}
        >
          <span
            className="cat-badge"
            style={{ '--cat-accent': '#f59e0b', '--cat-glow': 'rgba(245,158,11,0.2)' } as React.CSSProperties}
          >
            <BookOpen size={14} /> <span>Lector Inmersivo Ajustable</span>
          </span>
          <span
            className="cat-badge"
            style={{ '--cat-accent': '#10b981', '--cat-glow': 'rgba(16,185,129,0.2)' } as React.CSSProperties}
          >
            <ShieldCheck size={14} /> <span>100% Gratis y Sin Publicidad</span>
          </span>
          <span
            className="cat-badge"
            style={{ '--cat-accent': '#8b5cf6', '--cat-glow': 'rgba(139,92,246,0.2)' } as React.CSSProperties}
          >
            <Sparkles size={14} /> <span>Relatos Autoconclusivos</span>
          </span>
        </div>
      </section>

      {/* Literary Catalog Component */}
      <LiterariosClient relatos={relatos} />
    </div>
  );
}
