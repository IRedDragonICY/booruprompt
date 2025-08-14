import type {MetadataRoute} from 'next';

// Ensure static generation for Next.js `output: export`
export const dynamic = 'force-static';
export const revalidate = 86400; // 24h

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://booruprompt.vercel.app';
  const now = new Date().toISOString();

  return [
    {url: `${baseUrl}/`, lastModified: now, changeFrequency: 'weekly', priority: 1},
    {url: `${baseUrl}/booru-tag`, lastModified: now, changeFrequency: 'weekly', priority: 0.9},
    {url: `${baseUrl}/image-metadata`, lastModified: now, changeFrequency: 'weekly', priority: 0.7},
  ];
}


