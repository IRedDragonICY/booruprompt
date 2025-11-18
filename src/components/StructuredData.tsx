'use client';

import React from 'react';
import type { Locale } from '@/lib/i18n/types';
import { seoTranslations, SITE_URL } from '@/lib/seo/metadata';

interface StructuredDataProps {
  locale?: Locale;
  type?: 'website' | 'webApplication';
}

export function StructuredData({ locale = 'en', type = 'webApplication' }: StructuredDataProps) {
  const seo = seoTranslations[locale];

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': type === 'webApplication' ? 'WebApplication' : 'WebSite',
    name: seo.title,
    description: seo.description,
    url: SITE_URL,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    author: {
      '@type': 'Person',
      name: 'IRedDragonICY',
      url: 'https://x.com/ireddragonicy',
    },
    inLanguage: locale,
    keywords: seo.keywords.join(', '),
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    softwareVersion: '1.0',
    screenshot: `${SITE_URL}/og-image.png`,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '100',
      bestRating: '5',
      worstRating: '1',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function BreadcrumbStructuredData({ items }: { items: { name: string; url: string }[] }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
