import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';
export const revalidate = 86400;

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://booruprompt.vercel.app';
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/__api_disabled__/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}


