'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export function BooruInfoSection() {
  const { t } = useTranslation();

  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
      title: t('extractor:info.features.smart.title'),
      subtitle: t('extractor:info.features.smart.subtitle')
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: t('extractor:info.features.fast.title'),
      subtitle: t('extractor:info.features.fast.subtitle')
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: t('extractor:info.features.private.title'),
      subtitle: t('extractor:info.features.private.subtitle')
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      title: t('extractor:info.features.copy.title'),
      subtitle: t('extractor:info.features.copy.subtitle')
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full"
    >
      {/* Hero Section */}
      <div className="text-center mb-8 md:mb-12 px-4">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl md:text-5xl font-bold text-[rgb(var(--color-on-surface-rgb))] mb-3 md:mb-4 tracking-tight"
        >
          {t('extractor:info.heroTitle')}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base md:text-xl text-[rgb(var(--color-on-surface-muted-rgb))] max-w-2xl mx-auto leading-relaxed"
        >
          {t('extractor:info.heroSubtitle')}
        </motion.p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8 md:mb-10">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.4,
              delay: 0.3 + (index * 0.1),
              ease: [0.22, 1, 0.36, 1]
            }}
            whileHover={{
              y: -4,
              transition: { duration: 0.2 }
            }}
            className="group relative"
          >
            <div className="h-full rounded-2xl bg-[rgb(var(--color-surface-alt-rgb))] border border-[rgb(var(--color-surface-border-rgb))] p-4 md:p-6 transition-all duration-300 hover:shadow-lg hover:border-[rgb(var(--color-primary-rgb))]/30">
              {/* Icon */}
              <div className="flex justify-center mb-3 md:mb-4">
                <div className="rounded-xl bg-[rgb(var(--color-primary-rgb))]/10 p-3 md:p-4 text-[rgb(var(--color-primary-rgb))] group-hover:bg-[rgb(var(--color-primary-rgb))]/15 group-hover:scale-110 transition-all duration-300">
                  {feature.icon}
                </div>
              </div>

              {/* Text */}
              <div className="text-center">
                <h3 className="text-sm md:text-base font-semibold text-[rgb(var(--color-on-surface-rgb))] mb-1">
                  {feature.title}
                </h3>
                <p className="text-xs md:text-sm text-[rgb(var(--color-on-surface-muted-rgb))]">
                  {feature.subtitle}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA Flow */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="rounded-2xl bg-gradient-to-br from-[rgb(var(--color-primary-rgb))]/5 to-[rgb(var(--color-primary-rgb))]/10 border border-[rgb(var(--color-primary-rgb))]/20 p-4 md:p-6"
      >
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3">
          <div className="flex items-center gap-2 md:gap-3 text-sm md:text-base font-medium text-[rgb(var(--color-on-surface-rgb))]">
            <span className="px-3 py-1.5 rounded-lg bg-[rgb(var(--color-surface-alt-rgb))] border border-[rgb(var(--color-surface-border-rgb))]">
              {t('extractor:info.cta.paste')}
            </span>
            <svg className="w-4 h-4 text-[rgb(var(--color-primary-rgb))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="px-3 py-1.5 rounded-lg bg-[rgb(var(--color-surface-alt-rgb))] border border-[rgb(var(--color-surface-border-rgb))]">
              {t('extractor:info.cta.extract')}
            </span>
            <svg className="w-4 h-4 text-[rgb(var(--color-primary-rgb))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="px-3 py-1.5 rounded-lg bg-[rgb(var(--color-surface-alt-rgb))] border border-[rgb(var(--color-surface-border-rgb))]">
              {t('extractor:info.cta.filter')}
            </span>
            <svg className="w-4 h-4 text-[rgb(var(--color-primary-rgb))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="px-3 py-1.5 rounded-lg bg-[rgb(var(--color-primary-rgb))] text-[rgb(var(--color-primary-content-rgb))] shadow-sm">
              {t('extractor:info.cta.copy')}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Platforms Badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.9 }}
        className="mt-6 text-center"
      >
        <p className="text-xs md:text-sm text-[rgb(var(--color-on-surface-muted-rgb))]">
          {t('extractor:info.supportNotice')}
        </p>
      </motion.div>
    </motion.div>
  );
}

export default BooruInfoSection;
