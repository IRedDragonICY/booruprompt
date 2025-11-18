import type { Metadata } from 'next';
import MainPageContent from '../page';

export const metadata: Metadata = {
  title: 'API Status - Booru Prompt',
  description: 'Real-time status monitoring for all supported booru image board sites. Check uptime, response times, and operational status.',
  keywords: 'booru status, api status, uptime, booru monitoring, service status, danbooru status, gelbooru status',
  openGraph: {
    title: 'API Status - Booru Prompt',
    description: 'Real-time status monitoring for all supported booru image board sites.',
    type: 'website',
    url: 'https://booruprompt.vercel.app/status',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'API Status - Booru Prompt',
    description: 'Real-time status monitoring for all supported booru image board sites.',
  },
  alternates: {
    canonical: 'https://booruprompt.vercel.app/status',
  },
};

export default MainPageContent;
