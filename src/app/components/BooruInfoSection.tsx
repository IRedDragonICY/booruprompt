'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  InformationCircleIcon, 
  LightBulbIcon, 
  TagIcon, 
  CubeIcon,
  SparklesIcon
} from './icons/icons';

export function BooruInfoSection() {
  // Desktop tips (more detailed)
  const desktopTips = [
    {
      icon: <TagIcon className="h-5 w-5" />,
      title: "Smart Tag Extraction",
      description: "Automatically extracts and categorizes tags from popular booru sites with intelligent filtering"
    },
    {
      icon: <CubeIcon className="h-5 w-5" />,
      title: "Multi-Platform Support", 
      description: "Works seamlessly with Danbooru, Safebooru, Gelbooru, Rule34, e621, and many more platforms"
    },
    {
      icon: <SparklesIcon className="h-5 w-5" />,
      title: "One-Click Copy",
      description: "Copy filtered tags instantly for use in your AI art generation workflows and prompts"
    },
    {
      icon: <InformationCircleIcon className="h-5 w-5" />,
      title: "Preview & Filter",
      description: "Preview images and filter tags by category (General, Character, Meta, etc.) with real-time updates"
    }
  ];

  // Mobile tips (compact)
  const mobileTips = [
    {
      icon: <TagIcon className="h-4 w-4" />,
      title: "Smart Extraction",
      description: "Auto-extract tags with category filtering"
    },
    {
      icon: <CubeIcon className="h-4 w-4" />,
      title: "Multi-Platform", 
      description: "Danbooru, Safebooru, Gelbooru, Rule34, e621+"
    },
    {
      icon: <SparklesIcon className="h-4 w-4" />,
      title: "One-Click Copy",
      description: "Instant copy for AI art workflows"
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-3 md:space-y-6"
    >
      {/* Main Info Section */}
      <div className="rounded-lg md:rounded-xl bg-gradient-to-br from-[rgb(var(--color-surface-alt-rgb))] via-[rgb(var(--color-surface-alt-rgb))] to-[rgb(var(--color-surface-alt-2-rgb))] border border-[rgb(var(--color-surface-border-rgb))] p-3 md:p-6 shadow-sm">
        <div className="flex items-start gap-3 md:gap-4">
          <div className="rounded-md md:rounded-lg bg-[rgb(var(--color-primary-rgb))]/10 p-2 md:p-3">
            <InformationCircleIcon className="h-5 w-5 md:h-6 md:w-6 text-[rgb(var(--color-primary-rgb))]" />
          </div>
          <div className="flex-1">
            <h2 className="text-base md:text-xl font-semibold text-[rgb(var(--color-on-surface-rgb))] mb-1 md:mb-2">
              What is Booru Tag Extractor?
            </h2>
            <p className="text-sm md:text-base text-[rgb(var(--color-on-surface-muted-rgb))] leading-snug md:leading-relaxed">
              <span className="md:hidden">Extract and organize tags from booru image boards. Perfect for AI artists who need clean, categorized tags for their workflows.</span>
              <span className="hidden md:block">A powerful web tool that extracts and organizes tags from booru image boards. Perfect for AI artists, researchers, and content creators who need clean, categorized tags for their workflows. Simply paste a booru URL and get professionally formatted tags instantly.</span>
            </p>
          </div>
        </div>
      </div>

      {/* Tips Grid */}
      {/* Mobile Version */}
      <div className="grid grid-cols-3 gap-2 md:hidden">
        {mobileTips.map((tip, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05, ease: "easeOut" }}
            className="rounded-lg bg-[rgb(var(--color-surface-alt-rgb))] border border-[rgb(var(--color-surface-border-rgb))] p-2 text-center"
          >
            <div className="flex flex-col items-center gap-1">
              <div className="rounded-md bg-[rgb(var(--color-primary-rgb))]/10 p-1.5 text-[rgb(var(--color-primary-rgb))]">
                {tip.icon}
              </div>
              <div>
                <h3 className="font-medium text-xs text-[rgb(var(--color-on-surface-rgb))]">
                  {tip.title}
                </h3>
                <p className="text-[10px] text-[rgb(var(--color-on-surface-muted-rgb))] leading-tight">
                  {tip.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Desktop Version */}
      <div className="hidden md:grid md:grid-cols-2 md:gap-4">
        {desktopTips.map((tip, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
            className="group rounded-lg bg-[rgb(var(--color-surface-alt-rgb))] border border-[rgb(var(--color-surface-border-rgb))] p-4 transition-all duration-200 hover:shadow-md hover:border-[rgb(var(--color-primary-rgb))]/20"
          >
            <div className="flex items-start gap-3">
              <div className="rounded-md bg-[rgb(var(--color-primary-rgb))]/10 p-2 text-[rgb(var(--color-primary-rgb))] group-hover:bg-[rgb(var(--color-primary-rgb))]/15 transition-colors duration-200">
                {tip.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-[rgb(var(--color-on-surface-rgb))] mb-1">
                  {tip.title}
                </h3>
                <p className="text-sm text-[rgb(var(--color-on-surface-muted-rgb))] leading-relaxed">
                  {tip.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Start Section */}
      {/* Mobile Version */}
      <div className="md:hidden rounded-lg bg-[rgb(var(--color-info-bg-rgb))]/50 border border-[rgb(var(--color-info-rgb))]/20 p-2">
        <div className="flex items-center gap-2">
          <div className="rounded-md bg-[rgb(var(--color-info-rgb))]/15 p-1">
            <LightBulbIcon className="h-3 w-3 text-[rgb(var(--color-info-rgb))]" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-[rgb(var(--color-on-surface-muted-rgb))]">
              💡 <strong>Quick Start:</strong> Paste URL → Extract → Filter → Copy!
            </p>
          </div>
        </div>
      </div>

      {/* Desktop Version */}
      <div className="hidden md:block rounded-lg bg-[rgb(var(--color-info-bg-rgb))]/50 border border-[rgb(var(--color-info-rgb))]/20 p-4">
        <div className="flex items-start gap-3">
          <div className="rounded-md bg-[rgb(var(--color-info-rgb))]/15 p-2">
            <LightBulbIcon className="h-5 w-5 text-[rgb(var(--color-info-rgb))]" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-[rgb(var(--color-on-surface-rgb))] mb-2">
              Quick Start Guide
            </h3>
            <ol className="text-sm text-[rgb(var(--color-on-surface-muted-rgb))] space-y-1 list-decimal list-inside">
              <li>Paste a booru post URL in the field above</li>
              <li>Click &quot;Extract Manually&quot; or enable auto-extraction in settings</li>
              <li>Filter tags by category using the toggles below</li>
              <li>Copy your filtered tags with the &quot;Copy Tags&quot; button</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Additional Desktop Features */}
      <div className="hidden md:block">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
            className="rounded-lg bg-gradient-to-br from-[rgb(var(--color-success-rgb))]/10 to-[rgb(var(--color-success-rgb))]/5 border border-[rgb(var(--color-success-rgb))]/20 p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="h-2 w-2 rounded-full bg-[rgb(var(--color-success-rgb))]"></div>
              <h4 className="font-semibold text-sm text-[rgb(var(--color-success-rgb))]">AI-Powered</h4>
            </div>
            <p className="text-xs text-[rgb(var(--color-on-surface-muted-rgb))]">
              Intelligent tag extraction with advanced filtering and categorization
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
            className="rounded-lg bg-gradient-to-br from-[rgb(var(--color-secondary-rgb))]/10 to-[rgb(var(--color-secondary-rgb))]/5 border border-[rgb(var(--color-secondary-rgb))]/20 p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="h-2 w-2 rounded-full bg-[rgb(var(--color-secondary-rgb))]"></div>
              <h4 className="font-semibold text-sm text-[rgb(var(--color-secondary-rgb))]">Fast & Reliable</h4>
            </div>
            <p className="text-xs text-[rgb(var(--color-on-surface-muted-rgb))]">
              Lightning-fast extraction with 99.9% accuracy across all supported platforms
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
            className="rounded-lg bg-gradient-to-br from-[rgb(var(--color-accent-rgb))]/10 to-[rgb(var(--color-accent-rgb))]/5 border border-[rgb(var(--color-accent-rgb))]/20 p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="h-2 w-2 rounded-full bg-[rgb(var(--color-accent-rgb))]"></div>
              <h4 className="font-semibold text-sm text-[rgb(var(--color-accent-rgb))]">Privacy First</h4>
            </div>
            <p className="text-xs text-[rgb(var(--color-on-surface-muted-rgb))]">
              No data logging. All processing happens client-side for maximum privacy
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default BooruInfoSection;
