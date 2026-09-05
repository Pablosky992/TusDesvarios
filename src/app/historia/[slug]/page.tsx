import { redirect } from 'next/navigation';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Keep backward compatibility: redirect old /historia/[slug] to new route
export default async function OldStoryRedirect({ params }: PageProps) {
  const { slug } = await params;
  redirect(`/crea-tu-historia/historia/${slug}`);
}
