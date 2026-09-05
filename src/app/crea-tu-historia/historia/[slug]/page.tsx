import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getStoryBySlug, getAllStories } from '@/lib/stories';
import { StoryViewer } from '@/components/StoryViewer';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const stories = await getAllStories();
  return stories.map((story) => ({
    slug: story.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);

  if (!story) {
    return {
      title: 'Historia no encontrada — Tus Desvaríos',
    };
  }

  const url = `https://tusdesvarios.com/crea-tu-historia/historia/${slug}`;

  return {
    title: `${story.titulo} — Crea tus Desvaríos | TusDesvarios.com`,
    description: story.descripcionCorta,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${story.titulo} — Ficción Interactiva | Tus Desvaríos`,
      description: story.descripcionCorta,
      url: url,
      siteName: 'Tus Desvaríos',
      type: 'book',
      images: [
        {
          url: story.portada,
          width: 1200,
          height: 630,
          alt: story.titulo,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: story.titulo,
      description: story.descripcionCorta,
      images: [story.portada],
    },
  };
}

export default async function StoryPage({ params }: PageProps) {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);

  if (!story) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: story.titulo,
    description: story.descripcionCorta,
    url: `https://tusdesvarios.com/crea-tu-historia/historia/${story.slug}`,
    genre: story.genero,
    inLanguage: 'es',
    author: {
      '@type': 'Person',
      name: story.autor || 'Tus Desvaríos',
    },
    image: `https://tusdesvarios.com${story.portada}`,
  };

  return (
    <div className="story-page-container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <StoryViewer story={story} backPath="/crea-tu-historia" />
    </div>
  );
}
