import type { Metadata } from 'next';
import MainPageContent from '../page';

export const metadata: Metadata = {
  title: 'Top Booru Sites List - Booru Prompt',
  description: 'Comprehensive list of top booru image board sites ranked by popularity, images, and members. Discover the best booru sites for your interests.',
  keywords: 'booru, image board, anime, manga, fan art, booru list, top booru sites, booru ranking',
  openGraph: {
    title: 'Top Booru Sites List - Booru Prompt',
    description: 'Comprehensive list of top booru image board sites ranked by popularity, images, and members.',
    type: 'website',
    url: 'https://booruprompt.vercel.app/booru-list',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Top Booru Sites List - Booru Prompt',
    description: 'Comprehensive list of top booru image board sites ranked by popularity, images, and members.',
  },
  alternates: {
    canonical: 'https://booruprompt.vercel.app/booru-list',
  },
};

export default MainPageContent;
