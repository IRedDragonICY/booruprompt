import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: { unoptimized: true },
  async rewrites() {
    return [
      {
        source: '/booru-tag',
        destination: '/',
      },
      {
        source: '/image-metadata',
        destination: '/',
      },
    ];
  },
};

export default nextConfig;