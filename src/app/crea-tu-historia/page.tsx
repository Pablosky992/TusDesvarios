import { getAllStories } from '@/lib/stories';
import { StoryCard } from '@/components/StoryCard';
import { Sparkles, Compass, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 60;

export const metadata = {
  title: 'Crea tus Desvaríos — Ficción Interactiva Ramificada | TusDesvarios.com',
  description: 'Sumérgete en novelas interactivas donde tú eres el protagonista. Elige sabiamente: cada decisión forja tu destino entre múltiples caminos y finales.',
};

export default async function CreaHistoriaPage() {
  const stories = await getAllStories();

  return (
    <div className="home-container">
      {/* Breadcrumb */}
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

      <section className="hero-section">
        <div className="hero-badge">
          <Sparkles size={14} />
          <span>Ficción Interactiva Ramificada</span>
        </div>

        <h1 className="hero-title">
          Crea tus Desvaríos
        </h1>

        <p className="hero-description">
          Sumérgete en novelas interactivas donde tú eres el protagonista. Elige sabiamente:
          cada decisión forja tu destino entre múltiples caminos y finales.
        </p>
      </section>

      <section className="stories-catalog-section">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem',
            paddingBottom: '0.75rem',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Compass size={18} style={{ color: 'var(--accent-amber)' }} />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Historias Disponibles
            </h2>
          </div>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            {stories.length} {stories.length === 1 ? 'relato' : 'relatos'}
          </span>
        </div>

        <div className="stories-grid">
          {stories.map((story) => (
            <StoryCard key={story.slug} story={story} basePath="/crea-tu-historia/historia" />
          ))}
        </div>
      </section>
    </div>
  );
}
