import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(process.env.NEXT_OUTPUT === 'export' ? { output: 'export' as const } : {}),
  images: { unoptimized: true },
  async rewrites() {
    // When exporting static (NEXT_OUTPUT=export), rewrites are not supported
    if (process.env.NEXT_OUTPUT === 'export') {
      return [];
    }
    return [
      { source: '/booru-tag', destination: '/' },
      { source: '/image-metadata', destination: '/' },
    ];
  },
};

export default nextConfig;