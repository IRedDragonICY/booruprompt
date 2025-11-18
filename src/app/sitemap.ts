import type {MetadataRoute} from 'next';
import { readFileSync } from 'fs';
import { join } from 'path';
import { SUPPORTED_LOCALES } from '@/lib/i18n/constants';
import { SITE_URL } from '@/lib/seo/metadata';

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
  const baseUrl = SITE_URL;
  const now = new Date().toISOString();
  const locales = SUPPORTED_LOCALES;

  // Define all routes
  const routes = [
    { path: '/', priority: 1, changeFrequency: 'weekly' as const },
    { path: '/booru-tag', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/booru-list', priority: 0.9, changeFrequency: 'daily' as const },
    { path: '/image-metadata', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/settings', priority: 0.5, changeFrequency: 'monthly' as const },
  ];

  // Generate sitemap entries with language alternates
  const mainEntries: MetadataRoute.Sitemap = routes.map((route) => {
    const alternates: Record<string, string> = {};
    locales.forEach((locale) => {
      alternates[locale] = `${baseUrl}${route.path}`;
    });

    return {
      url: `${baseUrl}${route.path}`,
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        languages: alternates,
      },
    };
  });

  // Read booru data from JSON file
  let booruEntries: MetadataRoute.Sitemap = [];
  try {
    const filePath = join(process.cwd(), 'public', 'booru_top.json');
    const fileContents = readFileSync(filePath, 'utf8');
    const booruData: BooruData[] = JSON.parse(fileContents);

    // Create sitemap entries for each booru with language alternates
    booruEntries = booruData.map(booru => {
      const booruPath = `/booru-list/${encodeURIComponent(booru.domain)}`;
      const alternates: Record<string, string> = {};
      locales.forEach((locale) => {
        alternates[locale] = `${baseUrl}${booruPath}`;
      });

      return {
        url: `${baseUrl}${booruPath}`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
        alternates: {
          languages: alternates,
        },
      };
    });
  } catch (error) {
    console.error('Error reading booru data for sitemap:', error);
  }

  return [
    ...mainEntries,
    ...booruEntries,
  ];
}


