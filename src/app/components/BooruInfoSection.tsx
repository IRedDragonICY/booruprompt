'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export function BooruInfoSection() {
  const { t } = useTranslation();

  const features = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
      title: t('extractor.info.features.smart.title'),
      subtitle: t('extractor.info.features.smart.subtitle')
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: t('extractor.info.features.fast.title'),
      subtitle: t('extractor.info.features.fast.subtitle')
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: t('extractor.info.features.private.title'),
      subtitle: t('extractor.info.features.private.subtitle')
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      title: t('extractor.info.features.copy.title'),
      subtitle: t('extractor.info.features.copy.subtitle')
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="w-full flex flex-col justify-center"
    >
      {/* Hero Section - Compact */}
      <div className="text-center mb-4 px-2">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-xl font-bold text-[rgb(var(--color-on-surface-rgb))] mb-1 tracking-tight"
        >
          {t('extractor.info.heroTitle')}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="text-sm text-[rgb(var(--color-on-surface-muted-rgb))] leading-snug"
        >
          {t('extractor.info.heroSubtitle')}
        </motion.p>
      </div>

      {/* Feature Cards - Compact 2x2 Grid */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.3,
              delay: 0.2 + (index * 0.05),
              ease: [0.22, 1, 0.36, 1]
            }}
            className="group"
          >
            <div className="h-full rounded-xl bg-[rgb(var(--color-surface-alt-rgb))] border border-[rgb(var(--color-surface-border-rgb))]/50 p-3 transition-all duration-200 active:scale-[0.98]">
              <div className="flex items-center gap-2.5">
                {/* Icon */}
                <div className="shrink-0 rounded-lg bg-[rgb(var(--color-primary-rgb))]/10 p-2 text-[rgb(var(--color-primary-rgb))]">
                  {feature.icon}
                </div>
                {/* Text */}
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-[rgb(var(--color-on-surface-rgb))] leading-tight">
                    {feature.title}
                  </h3>
                  <p className="text-[11px] text-[rgb(var(--color-on-surface-muted-rgb))] leading-tight truncate">
                    {feature.subtitle}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA Flow - Compact */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="rounded-xl bg-gradient-to-r from-[rgb(var(--color-primary-rgb))]/5 to-[rgb(var(--color-primary-rgb))]/10 border border-[rgb(var(--color-primary-rgb))]/20 p-3"
      >
        <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-[rgb(var(--color-on-surface-rgb))]">
          <span className="px-2 py-1 rounded-md bg-[rgb(var(--color-surface-alt-rgb))] border border-[rgb(var(--color-surface-border-rgb))]/50">
            {t('extractor.info.cta.paste')}
          </span>
          <svg className="w-3 h-3 text-[rgb(var(--color-primary-rgb))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
          <span className="px-2 py-1 rounded-md bg-[rgb(var(--color-surface-alt-rgb))] border border-[rgb(var(--color-surface-border-rgb))]/50">
            {t('extractor.info.cta.extract')}
          </span>
          <svg className="w-3 h-3 text-[rgb(var(--color-primary-rgb))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
          <span className="px-2 py-1 rounded-md bg-[rgb(var(--color-surface-alt-rgb))] border border-[rgb(var(--color-surface-border-rgb))]/50">
            {t('extractor.info.cta.filter')}
          </span>
          <svg className="w-3 h-3 text-[rgb(var(--color-primary-rgb))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
          <span className="px-2 py-1 rounded-md bg-[rgb(var(--color-primary-rgb))] text-white shadow-sm">
            {t('extractor.info.cta.copy')}
          </span>
        </div>
      </motion.div>

      {/* Platforms Badge - Compact */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="mt-3 text-center text-[10px] text-[rgb(var(--color-on-surface-muted-rgb))]/70"
      >
        {t('extractor.info.supportNotice')}
      </motion.p>
    </motion.div>
  );
}

export default BooruInfoSection;
