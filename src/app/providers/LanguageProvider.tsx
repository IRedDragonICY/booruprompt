'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n, { availableLanguages, DEFAULT_LANGUAGE, LANGUAGE_STORAGE_KEY } from '@/lib/i18n';

type LanguageCode = (typeof availableLanguages)[number]['code'];

interface LanguageContextValue {
  language: LanguageCode;
  changeLanguage: (lang: LanguageCode) => void;
  languages: typeof availableLanguages;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<LanguageCode>(DEFAULT_LANGUAGE);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const initializeLanguage = async () => {
      const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY) as LanguageCode | null;
      const initialLanguage = stored && availableLanguages.some(({ code }) => code === stored) ? stored : DEFAULT_LANGUAGE;

      try {
        await i18n.changeLanguage(initialLanguage);
        setLanguage(initialLanguage);
        if (typeof document !== 'undefined') {
          document.documentElement.lang = initialLanguage;
        }
      } catch (error) {
        console.error('Failed to initialize language:', error);
      }
    };

    initializeLanguage();
  }, []);

  const changeLanguage = useCallback(async (lang: LanguageCode) => {
    if (!availableLanguages.some(({ code }) => code === lang)) {
      return;
    }

    try {
      await i18n.changeLanguage(lang);
      setLanguage(lang);

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      }
      if (typeof document !== 'undefined') {
        document.documentElement.lang = lang;
      }
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  }, []);

  const value = useMemo(() => ({ language, changeLanguage, languages: availableLanguages }), [language, changeLanguage]);

  return (
    <LanguageContext.Provider value={value}>
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    </LanguageContext.Provider>
  );
};
