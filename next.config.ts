import type { NextConfig } from "next";

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
          ];
        },
      }),
};

export default nextConfig;