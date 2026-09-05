import { MetadataRoute } from 'next';
import { getAllTests } from '@/lib/tests';
import { getAllStories } from '@/lib/stories';
import { getAllGames } from '@/lib/games';
import { getAllRelatos } from '@/lib/literarios';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.tusdesvarios.com';
  const now = new Date();

  // Static core routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/crea-tu-historia`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/desvarios-retro`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/desvarios-mentales`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/desvarios-literarios`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/desvarios-de-humor`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/desvarios-por-la-red`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/foro`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/aviso-legal`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/politica-de-privacidad`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/politica-de-cookies`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  // Dynamic Stories (Crea tu historia)
  const stories = await getAllStories();
  stories.forEach((story) => {
    routes.push({
      url: `${baseUrl}/crea-tu-historia/historia/${story.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    });
  });

  // Dynamic Literary Stories (Desvaríos Literarios)
  const relatos = await getAllRelatos();
  relatos.forEach((relato) => {
    routes.push({
      url: `${baseUrl}/desvarios-literarios/relato/${relato.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    });
  });

  // Dynamic Retro Games (Desvaríos Retro)
  const games = await getAllGames();
  games
    .filter((g) => g.disponible)
    .forEach((game) => {
      routes.push({
        url: `${baseUrl}/desvarios-retro/${game.slug}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.9,
      });
    });

  // Dynamic Tests (Desvaríos Mentales)
  const tests = await getAllTests();
  tests.forEach((test) => {
    routes.push({
      url: `${baseUrl}/desvarios-mentales/${test.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    });
  });

  return routes;
}
