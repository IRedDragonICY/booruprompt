import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
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