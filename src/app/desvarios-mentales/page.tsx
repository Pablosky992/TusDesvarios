import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getAllTests } from '@/lib/tests';
import { Sparkles, ArrowLeft, Brain, HelpCircle, ShieldCheck, Zap, Share2 } from 'lucide-react';
import TestCatalogueClient from './TestCatalogueClient';

export const metadata: Metadata = {
  title: 'Desvaríos Mentales — Tests de Personalidad, Acertijos y Retos Psicológicos | TusDesvarios.com',
  description:
    'Explora nuestra colección interactiva de tests psicológicos, cuestionarios de personalidad oscura, dilemas morales, retos de supervivencia y acertijos de lógica pura. ¡Descubre tu arquetipo y pon a prueba tu mente gratis!',
  keywords: [
    'tests de personalidad gratis',
    'test psicologico online',
    'acertijos de logica pura',
    'test de supervivencia apocalipsis',
    'dilemas morales filosoficos',
    'test de sesgos cognitivos',
    'arquetipo de personalidad',
    'juegos mentales gratis',
    'tus desvarios',
    'desvarios mentales',
  ],
  alternates: {
    canonical: 'https://tusdesvarios.com/desvarios-mentales',
  },
  openGraph: {
    title: 'Desvaríos Mentales — Tests, Enigmas y Retos Psicológicos | Tus Desvaríos',
    description:
      'Cuestionarios de personalidad, diagnósticos delirantes, retos de supervivencia, dilemas morales y acertijos de lógica pura. 100% gratis y sin registro.',
    url: 'https://tusdesvarios.com/desvarios-mentales',
    siteName: 'Tus Desvaríos',
    type: 'website',
    images: [
      {
        url: '/images/categories/desvarios-mentales.jpg',
        width: 1200,
        height: 630,
        alt: 'Desvaríos Mentales — Tests y Retos Psicológicos en TusDesvarios.com',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Desvaríos Mentales — Tests y Retos Psicológicos',
    description:
      'Descubre tu arquetipo, mide tu nivel de desvarío y resuelve acertijos de lógica pura. ¡Gratis y en tu navegador!',
    images: ['/images/categories/desvarios-mentales.jpg'],
  },
};

export default async function DesvariosMentalesPage() {
  const tests = await getAllTests();

  // Structured Data (JSON-LD) for SEO
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Colección de Tests y Desvaríos Mentales',
    description: 'Catálogo de cuestionarios psicológicos, enigmas de lógica, retos de supervivencia y dilemas morales.',
    numberOfItems: tests.length,
    itemListElement: tests.map((t, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: t.titulo,
      description: t.descripcionCorta,
      url: `https://tusdesvarios.com/desvarios-mentales/${t.slug}`,
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
        name: 'Desvaríos Mentales',
        item: 'https://tusdesvarios.com/desvarios-mentales',
      },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: '¿Qué son los Desvaríos Mentales de TusDesvarios.com?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Son una colección de tests interactivos, acertijos de lógica con pistas y soluciones, dilemas éticos filosóficos, simuladores de supervivencia y cuestionarios de personalidad diseñados para entretener y ejercitar la mente.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Es necesario registrarse o pagar para hacer los tests?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. Todos los tests y desafíos de Desvaríos Mentales son 100% gratuitos, completamente anónimos y funcionan directamente en el navegador sin descargas ni registros.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Cómo se calculan los resultados y arquetipos?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Cada cuestionario utiliza algoritmos de ponderación que contrastan tus elecciones frente a arquetipos psicológicos, matrices de supervivencia, sesgos cognitivos o corrientes filosóficas, ofreciendo un informe completo con virtudes, desvaríos y afinidades.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Puedo compartir mis diagnósticos en redes sociales?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sí. Al concluir cualquier test obtienes una tarjeta de resultados con tu título obtenido, porcentaje y descripción, lista para compartir con un clic en WhatsApp, Telegram, X o redes sociales.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Qué categorías de tests están disponibles?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Existen 4 áreas temáticas: Personalidad & Arquetipos (psicología profunda y perfiles míticos), Lógica & Paradojas (acertijos deductivos y sesgos), Humor & Supervivencia (diagnósticos delirantes y retos tácticos) y Curiosidades & Trivia (mitos y realidades insólitas).',
        },
      },
    ],
  };

  return (
    <div className="home-container">
      {/* Schema.org Injections */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Breadcrumb Navigation */}
      <div style={{ marginBottom: '1.5rem' }}>
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

      {/* Hero */}
      <section className="hero-section">
        <div
          className="hero-badge"
          style={{
            background: 'rgba(6, 182, 212, 0.12)',
            borderColor: 'rgba(6, 182, 212, 0.35)',
            color: '#38bdf8',
          }}
        >
          <Sparkles size={14} />
          <span>Laboratorio Mental & Tests Online</span>
        </div>

        <h1 className="hero-title">Desvaríos Mentales</h1>

        <p className="hero-description">
          Cuestionarios de personalidad, diagnósticos delirantes, retos de supervivencia, dilemas morales y acertijos de lógica pura.
          Descubre qué arquetipo habita en ti o desafía a tus neuronas de forma gratuita e interactiva.
        </p>

        {/* SEO Trust Signals */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '1rem',
            marginTop: '1.5rem',
          }}
        >
          <span className="cat-badge" style={{ '--cat-accent': '#10b981', '--cat-glow': 'rgba(16,185,129,0.2)' } as React.CSSProperties}>
            <ShieldCheck size={14} /> <span>100% Gratis y Anónimo</span>
          </span>
          <span className="cat-badge" style={{ '--cat-accent': '#06b6d4', '--cat-glow': 'rgba(6,182,212,0.2)' } as React.CSSProperties}>
            <Zap size={14} /> <span>Resultados Instantáneos</span>
          </span>
          <span className="cat-badge" style={{ '--cat-accent': '#8b5cf6', '--cat-glow': 'rgba(139,92,246,0.2)' } as React.CSSProperties}>
            <Share2 size={14} /> <span>Fácil de Compartir</span>
          </span>
        </div>
      </section>

      {/* Interactive Filtered Catalog */}
      <TestCatalogueClient tests={tests} />

      {/* SEO Educational & Category Guide Section */}
      <section
        style={{
          marginTop: '4rem',
          padding: '2.5rem 1.75rem',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 2.5rem' }}>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 700, marginBottom: '0.75rem', color: '#fff' }}>
            Explora las Categorías de Desafíos Mentales
          </h2>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Nuestros tests han sido estructurados en cuatro áreas del pensamiento para que encuentres la experiencia exacta que buscas hoy:
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem',
          }}
        >
          <div
            style={{
              padding: '1.25rem',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(139, 92, 246, 0.25)',
            }}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🧙</div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#c084fc', marginBottom: '0.4rem' }}>
              Personalidad & Arquetipos
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Viajes al subconsciente para descubrir tus rasgos ocultos, sombras psicológicas y criaturas míticas que definen tu carácter ante la adversidad.
            </p>
          </div>

          <div
            style={{
              padding: '1.25rem',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(6, 182, 212, 0.25)',
            }}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🧩</div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#38bdf8', marginBottom: '0.4rem' }}>
              Lógica & Paradojas
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Enigmas deductivos progresivos con pistas graduales y trampas de sesgos cognitivos para desafiar tu intuición y razonamiento analítico.
            </p>
          </div>

          <div
            style={{
              padding: '1.25rem',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
            }}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🤪</div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f87171', marginBottom: '0.4rem' }}>
              Humor & Supervivencia
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Cuestionarios hilarantes para medir tu temperatura de cordura o calcular tus probabilidades reales de sobrevivir a un colapso zombi.
            </p>
          </div>

          <div
            style={{
              padding: '1.25rem',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
            }}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🌍</div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fbbf24', marginBottom: '0.4rem' }}>
              Curiosidades & Trivia
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Hechos asombrosos del mundo real donde deberás discernir entre la verdad científica, mitos urbanos arraigados y auténticos desvaríos.
            </p>
          </div>
        </div>
      </section>

      {/* SEO FAQ Section */}
      <section
        style={{
          marginTop: '3.5rem',
          padding: '2.5rem 1.75rem',
          background: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <HelpCircle size={24} style={{ color: 'var(--accent-cyan)' }} />
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#fff' }}>
            Preguntas Frecuentes sobre Desvaríos Mentales
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <details
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              padding: '1rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              cursor: 'pointer',
            }}
          >
            <summary style={{ fontWeight: 600, color: '#f1f5f9', fontSize: '0.98rem' }}>
              ¿Qué tipo de tests encontraré en Desvaríos Mentales?
            </summary>
            <p style={{ marginTop: '0.75rem', fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Encontrarás una cuidada selección de 8 cuestionarios únicos: desde diagnósticos psicológicos de arquetipos oscuros y monstruos interiores, pasando por dilemas morales clásicos, hasta acertijos de lógica con pistas interactivas y simuladores tácticos de supervivencia.
            </p>
          </details>

          <details
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              padding: '1rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              cursor: 'pointer',
            }}
          >
            <summary style={{ fontWeight: 600, color: '#f1f5f9', fontSize: '0.98rem' }}>
              ¿Los tests son totalmente gratuitos y anónimos?
            </summary>
            <p style={{ marginTop: '0.75rem', fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Sí, 100%. No recopilamos ningún dato personal, no exigimos registro ni correos electrónicos, y no hay micropagos. Todo el contenido está abierto y disponible para disfrutarlo de inmediato.
            </p>
          </details>

          <details
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              padding: '1rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              cursor: 'pointer',
            }}
          >
            <summary style={{ fontWeight: 600, color: '#f1f5f9', fontSize: '0.98rem' }}>
              ¿Cómo se obtienen las conclusiones de cada test?
            </summary>
            <p style={{ marginTop: '0.75rem', fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Cada respuesta asigna puntos hacia rasgos psicológicos específicos o evalúa tu razonamiento deductivo. Al finalizar, el motor genera un desglose de porcentaje de afinidad, tu arquetipo dominante, virtudes y recomendaciones con un toque mordaz y entretenido.
            </p>
          </details>

          <details
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              padding: '1rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              cursor: 'pointer',
            }}
          >
            <summary style={{ fontWeight: 600, color: '#f1f5f9', fontSize: '0.98rem' }}>
              ¿Puedo realizarlos desde mi teléfono móvil?
            </summary>
            <p style={{ marginTop: '0.75rem', fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Absolutamente. Toda la plataforma está optimizada para una navegación ultrarrápida y táctil en teléfonos móviles, tabletas y ordenadores de escritorio sin consumo excesivo de datos ni batería.
            </p>
          </details>
        </div>
      </section>
    </div>
  );
}
