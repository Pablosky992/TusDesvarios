import { MetadataRoute } from 'next';
import { getAllTests } from '@/lib/tests';
import { getAllStories } from '@/lib/stories';
import { getAllGames } from '@/lib/games';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://tusdesvarios.com';
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
  ];

  // Dynamic Stories
  const stories = await getAllStories();
  stories.forEach((story) => {
    routes.push({
      url: `${baseUrl}/crea-tu-historia/historia/${story.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    });
  });

  // Dynamic Retro Games
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
