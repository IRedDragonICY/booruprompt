'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { locales, localeNames, type Locale } from '@/i18n';

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className = '' }: LanguageSwitcherProps) {
  const t = useTranslations('settings.language');
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLocaleChange = useCallback(
    (newLocale: Locale) => {
      setIsOpen(false);

      // Remove the current locale prefix from pathname if it exists
      const pathWithoutLocale = pathname.replace(`/${locale}`, '');

      // Navigate to the new locale
      const newPath = newLocale === 'en' ? pathWithoutLocale || '/' : `/${newLocale}${pathWithoutLocale || '/'}`;
      router.push(newPath);
    },
    [locale, pathname, router]
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Language flag/icon mapping
  const languageIcons: Record<Locale, string> = {
    en: '🇺🇸',
    id: '🇮🇩',
    ja: '🇯🇵',
    zh: '🇨🇳',
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Language Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[rgb(var(--color-surface-alt-rgb))] border border-[rgb(var(--color-surface-border-rgb))] text-[rgb(var(--color-on-surface-rgb))] hover:bg-[rgb(var(--color-surface-alt-2-rgb))] hover:border-[rgb(var(--color-primary-rgb))] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary-rgb))]/20"
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        <span className="text-lg">{languageIcons[locale]}</span>
        <span className="text-sm font-medium hidden sm:inline">{localeNames[locale]}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-56 rounded-lg bg-[rgb(var(--color-surface-alt-rgb))] border border-[rgb(var(--color-surface-border-rgb))] shadow-lg overflow-hidden z-50"
          >
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-semibold text-[rgb(var(--color-on-surface-muted-rgb))] uppercase tracking-wider">
                {t('title')}
              </div>
              <div className="space-y-1">
                {locales.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => handleLocaleChange(loc)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-150 ${
                      locale === loc
                        ? 'bg-[rgb(var(--color-primary-rgb))] text-[rgb(var(--color-primary-content-rgb))] font-semibold'
                        : 'text-[rgb(var(--color-on-surface-rgb))] hover:bg-[rgb(var(--color-surface-alt-2-rgb))]'
                    }`}
                  >
                    <span className="text-lg">{languageIcons[loc]}</span>
                    <span className="flex-1 text-left">{localeNames[loc]}</span>
                    {locale === loc && (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default LanguageSwitcher;
