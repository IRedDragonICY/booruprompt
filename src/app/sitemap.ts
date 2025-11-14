import type {MetadataRoute} from 'next';
import { readFileSync } from 'fs';
import { join } from 'path';

// Ensure static generation for Next.js `output: export`
export const dynamic = 'force-static';
export const revalidate = 86400; // 24h

interface BooruData {
  rank: number;
  domain: string;
  booru_title: string;
  images: number;
  members: number;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://booruprompt.vercel.app';
  const now = new Date().toISOString();

  // Read booru data from JSON file
  let booruEntries: MetadataRoute.Sitemap = [];
  try {
    const filePath = join(process.cwd(), 'public', 'booru_top.json');
    const fileContents = readFileSync(filePath, 'utf8');
    const booruData: BooruData[] = JSON.parse(fileContents);

    // Create sitemap entries for each booru
    booruEntries = booruData.map(booru => ({
      url: `${baseUrl}/booru-list/${encodeURIComponent(booru.domain)}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));
  } catch (error) {
    console.error('Error reading booru data for sitemap:', error);
  }

  return [
    {url: `${baseUrl}/`, lastModified: now, changeFrequency: 'weekly', priority: 1},
    {url: `${baseUrl}/booru-tag`, lastModified: now, changeFrequency: 'weekly', priority: 0.9},
    {url: `${baseUrl}/booru-list`, lastModified: now, changeFrequency: 'daily', priority: 0.9},
    {url: `${baseUrl}/image-metadata`, lastModified: now, changeFrequency: 'weekly', priority: 0.7},
    ...booruEntries,
  ];
}


