import type { Metadata } from 'next';
import BooruDetailClient from './client';

interface BooruData {
  rank: number;
  booru_short_name: string;
  booru_title: string;
  booru_url: string;
  favicon_url: string;
  images: number;
  members: number;
  owner_name: string;
  status_label: string;
  is_safe: boolean;
  scheme: string;
  domain: string;
  booru_subdomain: string;
  hosted_by_booru_org: boolean;
  page_index: number;
}

export async function generateMetadata({ params }: { params: Promise<{ domain: string }> }): Promise<Metadata> {
  const { domain: encodedDomain } = await params;
  const domain = decodeURIComponent(encodedDomain);

  try {
    // Read booru data from JSON file (server-side)
    const fs = await import('fs');
    const path = await import('path');
    const filePath = path.join(process.cwd(), 'public', 'booru_top.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const booruData: BooruData[] = JSON.parse(fileContents);
    const booru = booruData.find(b => b.domain === domain);

    if (!booru) {
      return {
        title: 'Booru Not Found - Booru Prompt',
        description: 'The requested booru site was not found.',
      };
    }

    const formatNumber = (num: number) => num.toLocaleString();

    return {
      title: `${booru.booru_title} - Rank #${booru.rank} | Booru Prompt`,
      description: `${booru.booru_title} is ranked #${booru.rank} with ${formatNumber(booru.images)} images and ${formatNumber(booru.members)} members. ${booru.status_label} booru image board.`,
      keywords: `${booru.booru_title}, ${booru.booru_short_name}, booru, image board, ${booru.domain}, ${booru.status_label}`,
      openGraph: {
        title: `${booru.booru_title} - Rank #${booru.rank}`,
        description: `${formatNumber(booru.images)} images, ${formatNumber(booru.members)} members. ${booru.status_label} booru site.`,
        type: 'website',
        url: `https://booruprompt.vercel.app/booru-list/${encodeURIComponent(domain)}`,
      },
      twitter: {
        card: 'summary',
        title: `${booru.booru_title} - Rank #${booru.rank}`,
        description: `${formatNumber(booru.images)} images, ${formatNumber(booru.members)} members.`,
      },
      alternates: {
        canonical: `https://booruprompt.vercel.app/booru-list/${encodeURIComponent(domain)}`,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Booru Details - Booru Prompt',
      description: 'View details about this booru site.',
    };
  }
}

export default async function BooruDetailPage({ params }: { params: Promise<{ domain: string }> }) {
  const resolvedParams = await params;
  return <BooruDetailClient params={resolvedParams} />;
}
