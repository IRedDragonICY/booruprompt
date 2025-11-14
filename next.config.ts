import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    // Allow production builds even if there are ESLint errors
    ignoreDuringBuilds: true,
  },
  ...(process.env.NEXT_OUTPUT === 'export' ? { output: 'export' as const } : {}),
  images: { unoptimized: true },
  // Avoid rewrites when using static export to silence warnings
  ...(process.env.NEXT_OUTPUT === 'export'
    ? {}
    : {
        async rewrites() {
          return [
            { source: '/booru-tag', destination: '/' },
            { source: '/image-metadata', destination: '/' },
            { source: '/booru-list', destination: '/' },
          ];
        },
        async headers() {
          return [
            {
              // Cache static files (images, fonts, etc.) for 1 year
              source: '/(.*)\\.(ico|png|jpg|jpeg|gif|svg|webp|woff|woff2|ttf|otf|eot)$',
              headers: [
                {
                  key: 'Cache-Control',
                  value: 'public, max-age=31536000, immutable',
                },
              ],
            },
            {
              // Cache JSON files for 1 hour with stale-while-revalidate
              source: '/(.*)\\.(json)$',
              headers: [
                {
                  key: 'Cache-Control',
                  value: 'public, max-age=3600, stale-while-revalidate=86400',
                },
              ],
            },
          ];
        },
      }),
};

export default withNextIntl(nextConfig);