import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getAllGames } from '@/lib/games';
import { Sparkles, ArrowLeft, Gamepad2, ShieldCheck, Zap, Volume2, HelpCircle } from 'lucide-react';
import GameCatalogueClient from './GameCatalogueClient';

export const metadata: Metadata = {
  title: 'Desvaríos Retro — Juegos Clásicos, Arcade de los 80s y Puzles de Ingenio | TusDesvarios.com',
  description:
    'Juega gratis a clásicos del arcade y minijuegos de ingenio retro: El Ahorcado Desvariado con temáticas góticas y sci-fi, puzles lógicos y más. ¡Sin descargas ni registros!',
  keywords: [
    'juegos retro online gratis',
    'juego del ahorcado online',
    'juegos arcade clasicos',
    'juegos de palabras gratis',
    'minijuegos retro navegador',
    'tus desvarios',
    'desvarios retro',
  ],
  alternates: {
    canonical: 'https://tusdesvarios.com/desvarios-retro',
  },
  openGraph: {
    title: 'Desvaríos Retro — Sala Arcade & Juegos Clásicos | Tus Desvaríos',
    description:
      'Juegos arcade de los 80s y puzles de ingenio retro. Juega gratis a El Ahorcado y reta a tu mente.',
    url: 'https://tusdesvarios.com/desvarios-retro',
    siteName: 'Tus Desvaríos',
    type: 'website',
    images: [
      {
        url: '/images/categories/desvarios-retro.jpg',
        width: 1200,
        height: 630,
        alt: 'Desvaríos Retro — Arcade y Juegos Clásicos',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Desvaríos Retro — Sala Arcade y Juegos Clásicos',
    description:
      'Juegos de palabras, lógica y arcade con estética synthwave y efectos 8-bit. ¡Juega gratis en tu navegador!',
    images: ['/images/categories/desvarios-retro.jpg'],
  },
};

export default async function DesvariosRetroPage() {
  const games = await getAllGames();

  // Structured Data (JSON-LD) for SEO
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Colección de Juegos Retro y Arcade',
    description: 'Catálogo de juegos clásicos de palabras, puzles lógicos y acción arcade de Tus Desvaríos.',
    numberOfItems: games.length,
    itemListElement: games.map((g, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: g.titulo,
      description: g.descripcionCorta,
      url: `https://tusdesvarios.com/desvarios-retro/${g.slug}`,
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
        name: 'Desvaríos Retro',
        item: 'https://tusdesvarios.com/desvarios-retro',
      },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: '¿Qué es la sección Desvaríos Retro de TusDesvarios.com?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Es un salón arcade digital que rinde homenaje a los juegos clásicos de los años 80 y 90, combinando mecánicas retro nostálgicas con temáticas literarias, de ciencia ficción y efectos de sonido 8-bit sintetizados.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Es necesario descargar o pagar para jugar al Ahorcado?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. Todos los juegos de Desvaríos Retro se ejecutan 100% en el navegador, son totalmente gratuitos, sin necesidad de registro ni publicidad invasiva.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Se guardan mis puntuaciones y récords?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sí, tus rachas de victorias y puntuaciones máximas se almacenan localmente en tu navegador para que puedas superarte en cada partida.',
        },
      },
    ],
  };

  return (
    <div className="home-container">
      {/* Schema.org structured data */}
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
            background: 'rgba(168, 85, 247, 0.12)',
            borderColor: 'rgba(168, 85, 247, 0.35)',
            color: '#c084fc',
          }}
        >
          <Gamepad2 size={14} />
          <span>Salón Arcade & Clásicos de Ingenio</span>
        </div>

        <h1 className="hero-title">Desvaríos Retro</h1>

        <p className="hero-description">
          Minijuegos nostálgicos, desafíos de palabras, puzles de tablero y clásicos arcade de los 80s y 90s reinventados con estética synthwave y efectos 8-bit.
        </p>

        {/* SEO Trust Badges */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '1rem',
            marginTop: '1.5rem',
          }}
        >
          <span className="cat-badge" style={{ '--cat-accent': '#a855f7', '--cat-glow': 'rgba(168,85,247,0.2)' } as React.CSSProperties}>
            <Gamepad2 size={14} /> <span>100% Gratis en Navegador</span>
          </span>
          <span className="cat-badge" style={{ '--cat-accent': '#06b6d4', '--cat-glow': 'rgba(6,182,212,0.2)' } as React.CSSProperties}>
            <Volume2 size={14} /> <span>Efectos de Sonido 8-Bit</span>
          </span>
          <span className="cat-badge" style={{ '--cat-accent': '#10b981', '--cat-glow': 'rgba(16,185,129,0.2)' } as React.CSSProperties}>
            <Zap size={14} /> <span>Guarda tus Récords</span>
          </span>
        </div>
      </section>

      {/* Games Filtered Catalog */}
      <GameCatalogueClient games={games} />

      {/* SEO Category Guide */}
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
            Explora las Salas de Juego Arcade
          </h2>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Revive la magia de las recreativas clásicas adaptadas a cualquier dispositivo:
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
              border: '1px solid rgba(168, 85, 247, 0.25)',
            }}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🔤</div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#c084fc', marginBottom: '0.4rem' }}>
              Palabras & Letras
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Desafíos léxicos como El Ahorcado con temáticas oscuras, literatura fantástica y cine de culto para poner a prueba tu vocabulario.
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
              Lógica & Tablero
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Puzles matemáticos como 2048, Buscaminas cuántico y retos tácticos de ajedrez rápido para exprimir tu agilidad mental.
            </p>
          </div>

          <div
            style={{
              padding: '1.25rem',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
            }}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🕹️</div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#34d399', marginBottom: '0.4rem' }}>
              Acción Arcade
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Reflejos rápidos y adrenalina de los 80s con versiones modernizadas de la clásica serpiente Snake y arcades retro.
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
          <HelpCircle size={24} style={{ color: 'var(--accent-purple)' }} />
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#fff' }}>
            Preguntas Frecuentes sobre Desvaríos Retro
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
              ¿Puedo jugar con mi teclado físico o solo en pantalla táctil?
            </summary>
            <p style={{ marginTop: '0.75rem', fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Todos los juegos están diseñados con soporte dual: si juegas en un ordenador, puedes teclear directamente con tu teclado físico; si juegas desde un móvil o tableta, dispones de un teclado virtual cómodo y adaptado.
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
              ¿Cómo funcionan los efectos de sonido retro?
            </summary>
            <p style={{ marginTop: '0.75rem', fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Utilizamos la Web Audio API del navegador para sintetizar ondas cuadradas y arpegios de 8-bit en tiempo real. No descargan archivos de audio pesados y puedes silenciarlos en cualquier instante con el botón de volumen.
            </p>
          </details>
        </div>
      </section>
    </div>
  );
}
