import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://booruprompt.vercel.app';
  const now = new Date().toISOString();

  const routes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/booru-tag`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/image-metadata`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
  ];

  return routes;
}


