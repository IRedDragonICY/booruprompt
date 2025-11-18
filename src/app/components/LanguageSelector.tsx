import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/app/providers/LanguageProvider';
import { GlobeAltIcon, ChevronDownIcon, MagnifyingGlassIcon } from './icons/icons';

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
        case 'en':
        default:
          return t('common.english');
      }
    },
    [t]
  );

  const localizedLanguages = useMemo(
    () => languages.map(({ code }) => ({ code, label: resolveLabel(code) })),
    [languages, resolveLabel]
  );

  const filteredLanguages = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) {
      return localizedLanguages;
    }
    return localizedLanguages.filter(({ label, code }) =>
      `${label} ${code}`.toLowerCase().includes(query)
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
    <div className="rounded-xl border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-rgb))] p-3" ref={containerRef}>
      <label className="mb-1.5 flex items-center text-sm font-medium text-[rgb(var(--color-on-surface-rgb))]">
        <GlobeAltIcon className="mr-2 h-5 w-5" />
        <span>{t('common.languageSwitcher.title')}</span>
      </label>
      <p className="mb-3 text-xs text-[rgb(var(--color-on-surface-muted-rgb))]">
        {t('common.languageSwitcher.description')}
      </p>
      <div className="relative">
        <button
          type="button"
          onClick={handleToggle}
          className="flex w-full items-center justify-between rounded-lg border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-alt-2-rgb))] px-3 py-2 text-sm font-medium text-[rgb(var(--color-on-surface-rgb))] transition hover:border-[rgb(var(--color-primary-rgb))]/50 hover:text-[rgb(var(--color-primary-rgb))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary-rgb))]/40"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label={t('common.languageSwitcher.title')}
        >
          <span>{resolveLabel(language)}</span>
          <span className={`text-[rgb(var(--color-on-surface-muted-rgb))] transition-transform ${isOpen ? 'rotate-180' : ''}`}>
            <ChevronDownIcon />
          </span>
        </button>

        {isOpen && (
          <div
            className="absolute left-0 right-0 z-20 mt-2 rounded-xl border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-rgb))] p-3 shadow-xl"
            role="listbox"
            aria-activedescendant={language}
          >
            <div className="relative mb-3">
              <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[rgb(var(--color-on-surface-faint-rgb))]" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder={t('common.languageSwitcher.searchPlaceholder')}
                aria-label={t('common.languageSwitcher.searchPlaceholder')}
                className="w-full rounded-lg border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-alt-2-rgb))] py-2 pl-9 pr-3 text-sm text-[rgb(var(--color-on-surface-rgb))] placeholder:text-[rgb(var(--color-on-surface-faint-rgb))] focus:border-[rgb(var(--color-primary-rgb))] focus:outline-none focus:ring-1 focus:ring-[rgb(var(--color-primary-rgb))]"
              />
            </div>

            <div className="max-h-60 overflow-y-auto space-y-1 pr-1">
              {filteredLanguages.length === 0 && (
                <p className="py-2 text-center text-xs text-[rgb(var(--color-on-surface-faint-rgb))]">
                  {t('common.languageSwitcher.noResults')}
                </p>
              )}

              {filteredLanguages.map(({ code, label }) => {
                const isActive = code === language;
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => handleSelectLanguage(code)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
                      isActive
                        ? 'bg-[rgba(var(--color-primary-rgb),0.1)] text-[rgb(var(--color-primary-rgb))] shadow-sm'
                        : 'text-[rgb(var(--color-on-surface-rgb))] hover:bg-[rgb(var(--color-surface-alt-2-rgb))]'
                    }`}
                    role="option"
                    aria-selected={isActive}
                    id={code}
                  >
                    <span>{label}</span>
                    <span
                      className={`ml-3 h-2.5 w-2.5 rounded-full border ${
                        isActive
                          ? 'border-[rgb(var(--color-primary-rgb))] bg-[rgb(var(--color-primary-rgb))]'
                          : 'border-transparent bg-[rgb(var(--color-on-surface-faint-rgb))]/40'
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <p className="mt-2 text-[10px] text-[rgb(var(--color-on-surface-faint-rgb))]">
        {t('common.languageSwitcher.instantNotice')}
      </p>
    </div>
  );
};

export default LanguageSelector;
