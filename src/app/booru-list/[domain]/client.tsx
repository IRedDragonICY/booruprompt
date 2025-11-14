'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeftIcon, GlobeAltIcon, PhotoIcon, UserGroupIcon, ArrowUpRightIcon } from '@/app/components/icons/icons';

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

export default function BooruDetailClient({ params }: { params: { domain: string } }) {
  const router = useRouter();
  const domain = params.domain as string;
  const [booru, setBooru] = useState<BooruData | null>(null);
  const [loading, setLoading] = useState(true);
  const [faviconError, setFaviconError] = useState(false);

  useEffect(() => {
    const fetchBooru = async () => {
      try {
        const response = await fetch('/api/booru-list');
        if (!response.ok) throw new Error('Failed to fetch');
        const data: BooruData[] = await response.json();
        const found = data.find(b => b.domain === decodeURIComponent(domain));
        setBooru(found || null);
      } catch (err) {
        console.error('Error fetching booru:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooru();
  }, [domain]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[rgb(var(--color-primary-rgb))] mx-auto mb-4"></div>
          <p className="text-[rgb(var(--color-on-surface-muted-rgb))]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!booru) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-[rgb(var(--color-on-surface-rgb))] mb-4">Booru Not Found</h1>
          <p className="text-[rgb(var(--color-on-surface-muted-rgb))] mb-6">
            The booru domain "{decodeURIComponent(domain)}" was not found in our database.
          </p>
          <button
            onClick={() => router.push('/booru-list')}
            className="px-6 py-3 bg-[rgb(var(--color-primary-rgb))] text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Back to Booru List
          </button>
        </div>
      </div>
    );
  }

  const faviconUrl = `/api/favicon?domain=${encodeURIComponent(booru.domain)}&sz=128`;
  const formatNumber = (num: number) => num.toLocaleString();

  return (
    <div className="min-h-screen bg-[rgb(var(--color-surface-rgb))] p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.push('/booru-list')}
          className="flex items-center gap-2 text-[rgb(var(--color-primary-rgb))] hover:opacity-80 transition-opacity mb-6"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span>Back to Booru List</span>
        </button>

        {/* Main Card */}
        <div className="bg-[rgb(var(--color-surface-alt-rgb))] rounded-2xl shadow-lg border border-[rgb(var(--color-surface-border-rgb))] overflow-hidden">
          {/* Header with Rank Badge */}
          <div className="relative bg-gradient-to-br from-[rgb(var(--color-primary-rgb))]/10 to-transparent p-8 md:p-12">
            <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-[rgb(var(--color-primary-rgb))] text-white font-bold text-xl flex items-center justify-center shadow-lg">
              #{booru.rank}
            </div>

            <div className="flex items-center gap-6">
              {/* Favicon */}
              <div className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-[rgb(var(--color-surface-alt-2-rgb))] border-2 border-[rgb(var(--color-surface-border-rgb))] flex items-center justify-center overflow-hidden shadow-md">
                {!faviconError ? (
                  <img
                    src={faviconUrl}
                    alt={booru.booru_title}
                    className="w-16 h-16 md:w-20 md:h-20 object-contain"
                    onError={() => setFaviconError(true)}
                    loading="eager"
                  />
                ) : (
                  <GlobeAltIcon className="h-12 w-12 md:h-16 md:w-16 text-[rgb(var(--color-on-surface-muted-rgb))]" />
                )}
              </div>

              {/* Title and Domain */}
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl md:text-4xl font-bold text-[rgb(var(--color-on-surface-rgb))] mb-2 break-words">
                  {booru.booru_title}
                </h1>
                <div className="flex items-center gap-2 text-[rgb(var(--color-on-surface-muted-rgb))] mb-3">
                  <GlobeAltIcon className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm md:text-base break-all">{booru.domain}</span>
                </div>

                {/* Status Badge */}
                <div className="inline-flex items-center gap-2">
                  <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                    booru.is_safe
                      ? 'bg-[rgb(var(--color-success-rgb))]/10 text-[rgb(var(--color-success-rgb))]'
                      : 'bg-[rgb(var(--color-error-rgb))]/10 text-[rgb(var(--color-error-rgb))]'
                  }`}>
                    {booru.status_label}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="p-8 md:p-12">
            <h2 className="text-xl font-bold text-[rgb(var(--color-on-surface-rgb))] mb-6">Statistics</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Images */}
              <div className="flex items-center gap-4 p-6 rounded-xl bg-[rgb(var(--color-surface-alt-2-rgb))] border border-[rgb(var(--color-surface-border-rgb))]">
                <div className="w-12 h-12 rounded-full bg-[rgb(var(--color-primary-rgb))]/10 flex items-center justify-center">
                  <PhotoIcon className="h-6 w-6 text-[rgb(var(--color-primary-rgb))]" />
                </div>
                <div>
                  <p className="text-sm text-[rgb(var(--color-on-surface-muted-rgb))] mb-1">Total Images</p>
                  <p className="text-2xl font-bold text-[rgb(var(--color-on-surface-rgb))]">
                    {formatNumber(booru.images)}
                  </p>
                </div>
              </div>

              {/* Members */}
              <div className="flex items-center gap-4 p-6 rounded-xl bg-[rgb(var(--color-surface-alt-2-rgb))] border border-[rgb(var(--color-surface-border-rgb))]">
                <div className="w-12 h-12 rounded-full bg-[rgb(var(--color-primary-rgb))]/10 flex items-center justify-center">
                  <UserGroupIcon className="h-6 w-6 text-[rgb(var(--color-primary-rgb))]" />
                </div>
                <div>
                  <p className="text-sm text-[rgb(var(--color-on-surface-muted-rgb))] mb-1">Total Members</p>
                  <p className="text-2xl font-bold text-[rgb(var(--color-on-surface-rgb))]">
                    {formatNumber(booru.members)}
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="space-y-4 mb-8">
              <div className="flex justify-between py-3 border-b border-[rgb(var(--color-surface-border-rgb))]">
                <span className="text-[rgb(var(--color-on-surface-muted-rgb))]">Short Name</span>
                <span className="font-medium text-[rgb(var(--color-on-surface-rgb))]">{booru.booru_short_name}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-[rgb(var(--color-surface-border-rgb))]">
                <span className="text-[rgb(var(--color-on-surface-muted-rgb))]">Owner</span>
                <span className="font-medium text-[rgb(var(--color-on-surface-rgb))]">{booru.owner_name}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-[rgb(var(--color-surface-border-rgb))]">
                <span className="text-[rgb(var(--color-on-surface-muted-rgb))]">Hosted by booru.org</span>
                <span className="font-medium text-[rgb(var(--color-on-surface-rgb))]">
                  {booru.hosted_by_booru_org ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-[rgb(var(--color-on-surface-muted-rgb))]">Protocol</span>
                <span className="font-medium text-[rgb(var(--color-on-surface-rgb))]">{booru.scheme.toUpperCase()}</span>
              </div>
            </div>

            {/* Visit Button */}
            <a
              href={booru.booru_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full py-4 px-6 bg-[rgb(var(--color-primary-rgb))] text-white rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-md"
            >
              <span>Visit {booru.booru_title}</span>
              <ArrowUpRightIcon className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* SEO Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: booru.booru_title,
              url: booru.booru_url,
              description: `${booru.booru_title} - A booru image board with ${formatNumber(booru.images)} images and ${formatNumber(booru.members)} members. Ranked #${booru.rank}.`,
              image: faviconUrl,
              mainEntity: {
                '@type': 'Organization',
                name: booru.booru_title,
                url: booru.booru_url,
                logo: faviconUrl,
              },
            }),
          }}
        />
      </div>
    </div>
  );
}
