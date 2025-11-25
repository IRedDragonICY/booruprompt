import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/app/providers/LanguageProvider';
import { GlobeAltIcon, ChevronDownIcon, MagnifyingGlassIcon, CheckCircleIcon } from './icons/icons';
import { AnimatePresence, motion } from 'framer-motion';

// English names for search functionality
const LANGUAGE_ENGLISH_NAMES: Record<string, string> = {
  'en': 'English',
  'id': 'Indonesian',
  'zh': 'Chinese Simplified',
  'zh-TW': 'Chinese Traditional',
  'ja': 'Japanese',
  'ar': 'Arabic',
  'ru': 'Russian',
  'es': 'Spanish',
  'fr': 'French',
  'de': 'German',
  'pt': 'Portuguese',
  'ko': 'Korean',
  'it': 'Italian',
  'nl': 'Dutch',
  'tr': 'Turkish',
  'pl': 'Polish',
  'vi': 'Vietnamese',
  'th': 'Thai',
  'hi': 'Hindi',
  'uk': 'Ukrainian'
};

export const LanguageSelector: React.FC = () => {
  const { t } = useTranslation();
  const { language, changeLanguage, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const resolveLabel = useCallback(
    (code: string) => {
      switch (code) {
        case 'id':
          return t('common.indonesian');
        case 'zh':
          return t('common.chinese');
        case 'zh-TW':
          return t('common.chineseTraditional');
        case 'ja':
          return t('common.japanese');
        case 'ar':
          return t('common.arabic');
        case 'ru':
          return t('common.russian');
        case 'es':
          return t('common.spanish');
        case 'fr':
          return t('common.french');
        case 'de':
          return t('common.german');
        case 'pt':
          return t('common.portuguese');
        case 'ko':
          return t('common.korean');
        case 'it':
          return t('common.italian');
        case 'nl':
          return t('common.dutch');
        case 'tr':
          return t('common.turkish');
        case 'pl':
          return t('common.polish');
        case 'vi':
          return t('common.vietnamese');
        case 'th':
          return t('common.thai');
        case 'hi':
          return t('common.hindi');
        case 'uk':
          return t('common.ukrainian');
        case 'en':
        default:
          return t('common.english');
      }
    },
    [t]
  );

  const localizedLanguages = useMemo(
    () => languages.map(({ code }) => ({
      code,
      label: resolveLabel(code),
      englishName: LANGUAGE_ENGLISH_NAMES[code] || code
    })),
    [languages, resolveLabel]
  );

  const filteredLanguages = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) {
      return localizedLanguages;
    }
    return localizedLanguages.filter(({ label, code, englishName }) =>
      `${label} ${code} ${englishName}`.toLowerCase().includes(query)
    );
  }, [localizedLanguages, searchTerm]);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    setSearchTerm('');
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeDropdown, isOpen]);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => {
        searchInputRef.current?.focus();
      });
    }
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen((prev) => {
      if (prev) {
        setSearchTerm('');
        return false;
      }
      return true;
    });
  };

  const handleSelectLanguage = (code: string) => {
    if (code === language) {
      closeDropdown();
      return;
    }
    changeLanguage(code as typeof language);
    closeDropdown();
  };

  return (
    <div className="rounded-2xl bg-[rgb(var(--color-surface-alt-rgb))] p-4 transition-colors duration-200" ref={containerRef}>
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgb(var(--color-surface-rgb))] text-[rgb(var(--color-primary-rgb))]">
          <GlobeAltIcon className="h-6 w-6" />
        </div>
        <div className="flex flex-col">
          <span className="text-base font-medium text-[rgb(var(--color-on-surface-rgb))]">
            {t('common.languageSwitcher.title')}
          </span>
          <span className="text-sm text-[rgb(var(--color-on-surface-muted-rgb))]">
            {t('common.languageSwitcher.description')}
          </span>
        </div>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={handleToggle}
          className="flex w-full items-center justify-between rounded-xl bg-[rgb(var(--color-surface-rgb))] px-4 py-3 text-sm font-medium text-[rgb(var(--color-on-surface-rgb))] shadow-sm ring-1 ring-inset ring-[rgb(var(--color-surface-border-rgb))] transition-all hover:bg-[rgb(var(--color-surface-hover-rgb))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary-rgb))]"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label={t('common.languageSwitcher.title')}
        >
          <span className="flex items-center gap-2">
            {resolveLabel(language)}
          </span>
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-[rgb(var(--color-on-surface-muted-rgb))]"
          >
            <ChevronDownIcon className="h-5 w-5" />
          </motion.span>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute left-0 right-0 z-30 mt-2 overflow-hidden rounded-xl border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-rgb))] shadow-xl ring-1 ring-black/5"
              role="listbox"
              aria-activedescendant={language}
            >
              <div className="border-b border-[rgb(var(--color-surface-border-rgb))] p-2">
                <div className="relative">
                  <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[rgb(var(--color-on-surface-muted-rgb))]" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder={t('common.languageSwitcher.searchPlaceholder')}
                    className="w-full rounded-lg bg-[rgb(var(--color-surface-alt-rgb))] py-2 pl-9 pr-3 text-sm text-[rgb(var(--color-on-surface-rgb))] placeholder-[rgb(var(--color-on-surface-muted-rgb))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary-rgb))]"
                  />
                </div>
              </div>

              <div className="max-h-60 overflow-y-auto p-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[rgb(var(--color-surface-border-rgb))]">
                {filteredLanguages.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-sm text-[rgb(var(--color-on-surface-muted-rgb))]">
                      {t('common.languageSwitcher.noResults')}
                    </p>
                  </div>
                ) : (
                  filteredLanguages.map(({ code, label }) => {
                    const isActive = code === language;
                    return (
                      <button
                        key={code}
                        type="button"
                        onClick={() => handleSelectLanguage(code)}
                        className={`group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                          isActive
                            ? 'bg-[rgb(var(--color-primary-rgb))]/10 text-[rgb(var(--color-primary-rgb))]'
                            : 'text-[rgb(var(--color-on-surface-rgb))] hover:bg-[rgb(var(--color-surface-alt-rgb))]'
                        }`}
                        role="option"
                        aria-selected={isActive}
                      >
                        <span className="font-medium">{label}</span>
                        {isActive && (
                          <CheckCircleIcon className="h-5 w-5 text-[rgb(var(--color-primary-rgb))]" />
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <p className="mt-3 text-xs text-[rgb(var(--color-on-surface-muted-rgb))]">
        {t('common.languageSwitcher.instantNotice')}
      </p>
    </div>
  );
};

export default LanguageSelector;
