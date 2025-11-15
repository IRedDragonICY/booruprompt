'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { LocaleCode, DEFAULT_LOCALE, getLocaleFromStorage, setLocaleToStorage } from './config';

type Messages = Record<string, any>;

interface I18nContextValue {
  locale: LocaleCode;
  setLocale: (locale: LocaleCode) => void;
  messages: Messages;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

interface I18nProviderProps {
  children: React.ReactNode;
  initialLocale?: LocaleCode;
}

export function I18nProvider({ children, initialLocale }: I18nProviderProps) {
  const [locale, setLocaleState] = useState<LocaleCode>(initialLocale || DEFAULT_LOCALE);
  const [messages, setMessages] = useState<Messages>({});
  const [isLoading, setIsLoading] = useState(false);

  // Load messages for the current locale
  useEffect(() => {
    let isMounted = true;

    async function loadMessages() {
      try {
        setIsLoading(true);
        const msgs = await import(`./locales/${locale}.json`);
        if (isMounted) {
          setMessages(msgs.default);
          setIsLoading(false);
        }
      } catch (error) {
        console.error(`Failed to load messages for locale "${locale}":`, error);
        // Fallback to English if the locale fails to load
        if (locale !== DEFAULT_LOCALE && isMounted) {
          try {
            const fallbackMsgs = await import(`./locales/${DEFAULT_LOCALE}.json`);
            if (isMounted) {
              setMessages(fallbackMsgs.default);
              setIsLoading(false);
            }
          } catch (fallbackError) {
            console.error('Failed to load fallback messages:', fallbackError);
            if (isMounted) {
              setIsLoading(false);
            }
          }
        } else if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadMessages();

    return () => {
      isMounted = false;
    };
  }, [locale]);

  // Initialize locale from localStorage on mount
  useEffect(() => {
    const storedLocale = getLocaleFromStorage();
    if (storedLocale !== locale) {
      setLocaleState(storedLocale);
    }
  }, []);

  const setLocale = useCallback((newLocale: LocaleCode) => {
    setLocaleState(newLocale);
    setLocaleToStorage(newLocale);

    // Update HTML lang attribute for accessibility and SEO
    if (typeof document !== 'undefined') {
      document.documentElement.lang = newLocale;
    }
  }, []);

  // Translation function with nested key support and parameter substitution
  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: any = messages;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Return key as fallback if translation not found
        console.warn(`Translation key not found: "${key}" for locale "${locale}"`);
        return key;
      }
    }

    if (typeof value !== 'string') {
      console.warn(`Translation key "${key}" is not a string for locale "${locale}"`);
      return key;
    }

    // Replace parameters in the format {{paramName}}
    if (params) {
      return value.replace(/\{\{(\w+)\}\}/g, (match, paramName) => {
        return paramName in params ? String(params[paramName]) : match;
      });
    }

    return value;
  }, [messages, locale]);

  const value: I18nContextValue = {
    locale,
    setLocale,
    messages,
    t,
  };

  // Always render children even while loading
  // The UI will use default locale (en) initially
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
}

// Convenience hook for just the translation function
export function useT() {
  const { t } = useTranslation();
  return t;
}
