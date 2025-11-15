'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SUPPORTED_LOCALES, LocaleCode } from '../../i18n/config';
import { useTranslation } from '../../i18n/provider';

interface LanguageSelectorProps {
  currentLanguage: LocaleCode;
  onLanguageChange: (locale: LocaleCode) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  onLanguageChange,
}) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const filteredLocales = useMemo(() => {
    if (!searchQuery.trim()) return SUPPORTED_LOCALES;

    const query = searchQuery.toLowerCase();
    return SUPPORTED_LOCALES.filter(
      (locale) =>
        locale.name.toLowerCase().includes(query) ||
        locale.nativeName.toLowerCase().includes(query) ||
        locale.code.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleLanguageSelect = useCallback(
    (locale: LocaleCode) => {
      onLanguageChange(locale);
      setIsExpanded(false);
      setSearchQuery('');
    },
    [onLanguageChange]
  );

  const currentLocale = SUPPORTED_LOCALES.find((l) => l.code === currentLanguage) || SUPPORTED_LOCALES[0];

  return (
    <div>
      {/* Language Selector Button */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between rounded-lg border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-alt-2-rgb))] px-3 py-2.5 text-sm text-[rgb(var(--color-on-surface-rgb))] transition duration-200 hover:bg-[rgb(var(--color-surface-border-rgb))] focus:border-[rgb(var(--color-primary-rgb))] focus:outline-none focus:ring-1 focus:ring-[rgb(var(--color-primary-rgb))]"
        aria-label="Select Language"
      >
        <div className="flex items-center gap-2">
          {/* Globe Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5 text-[rgb(var(--color-primary-rgb))]"
          >
            <path d="M21.721 12.752a9.711 9.711 0 00-.945-5.003 12.754 12.754 0 01-4.339 2.708 18.991 18.991 0 01-.214 4.772 17.165 17.165 0 005.498-2.477zM14.634 15.55a17.324 17.324 0 00.332-4.647c-.952.227-1.945.347-2.966.347-1.021 0-2.014-.12-2.966-.347a17.515 17.515 0 00.332 4.647 17.385 17.385 0 005.268 0zM9.772 17.119a18.963 18.963 0 004.456 0A17.182 17.182 0 0112 21.724a17.18 17.18 0 01-2.228-4.605zM7.777 15.23a18.87 18.87 0 01-.214-4.774 12.753 12.753 0 01-4.34-2.708 9.711 9.711 0 00-.944 5.004 17.165 17.165 0 005.498 2.477zM21.356 14.752a9.765 9.765 0 01-7.478 6.817 18.64 18.64 0 001.988-4.718 18.627 18.627 0 005.49-2.098zM2.644 14.752c1.682.971 3.53 1.688 5.49 2.099a18.64 18.64 0 001.988 4.718 9.765 9.765 0 01-7.478-6.816zM13.878 2.43a9.755 9.755 0 016.116 3.986 11.267 11.267 0 01-3.746 2.504 18.63 18.63 0 00-2.37-6.49zM12 2.276a17.152 17.152 0 012.805 7.121c-.897.23-1.837.353-2.805.353-.968 0-1.908-.122-2.805-.353A17.151 17.151 0 0112 2.276zM10.122 2.43a18.629 18.629 0 00-2.37 6.490 11.266 11.266 0 01-3.746-2.504 9.754 9.754 0 016.116-3.985z" />
          </svg>
          <div className="flex flex-col items-start">
            <span className="font-medium">{currentLocale?.nativeName || currentLanguage}</span>
            {currentLocale && (
              <span className="text-xs text-[rgb(var(--color-on-surface-muted-rgb))]">
                {currentLocale.name}
              </span>
            )}
          </div>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`h-5 w-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Language Dropdown */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: '0.5rem' }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden rounded-lg border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-alt-2-rgb))]"
          >
            {/* Search Input */}
            <div className="border-b border-[rgb(var(--color-surface-border-rgb))] p-2">
              <div className="relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[rgb(var(--color-on-surface-muted-rgb))]"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                    clipRule="evenodd"
                  />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('settings.language.searchPlaceholder')}
                  className="w-full rounded-md border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-rgb))] py-1.5 pl-8 pr-3 text-sm focus:border-[rgb(var(--color-primary-rgb))] focus:outline-none focus:ring-1 focus:ring-[rgb(var(--color-primary-rgb))]"
                />
              </div>
            </div>

            {/* Language List */}
            <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[rgb(var(--color-surface-border-rgb))]">
              {filteredLocales.length > 0 ? (
                filteredLocales.map((locale) => (
                  <button
                    key={locale.code}
                    type="button"
                    onClick={() => handleLanguageSelect(locale.code)}
                    className={`w-full px-3 py-2.5 text-left text-sm transition-colors hover:bg-[rgb(var(--color-surface-border-rgb))] ${
                      currentLanguage === locale.code
                        ? 'bg-[rgb(var(--color-primary-rgb))]/10 font-medium text-[rgb(var(--color-primary-rgb))]'
                        : 'text-[rgb(var(--color-on-surface-rgb))]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="font-medium">{locale.nativeName}</span>
                        <span className="text-xs text-[rgb(var(--color-on-surface-muted-rgb))]">
                          {locale.name}
                        </span>
                      </div>
                      {currentLanguage === locale.code && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="h-5 w-5 text-[rgb(var(--color-primary-rgb))]"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-3 py-6 text-center text-sm text-[rgb(var(--color-on-surface-muted-rgb))]">
                  {t('status.noBooruSites')}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSelector;
