import type { Locale, TranslationSchema } from './types';

// Lazy-loaded dictionaries - only loaded when requested
const dictionaries = {
  en: () => import('./locales/en.json').then((module) => module.default as TranslationSchema),
  id: () => import('./locales/id.json').then((module) => module.default as TranslationSchema),
  zh: () => import('./locales/zh.json').then((module) => module.default as TranslationSchema),
  'zh-TW': () => import('./locales/zh-TW.json').then((module) => module.default as TranslationSchema),
  ja: () => import('./locales/ja.json').then((module) => module.default as TranslationSchema),
  ar: () => import('./locales/ar.json').then((module) => module.default as TranslationSchema),
  ru: () => import('./locales/ru.json').then((module) => module.default as TranslationSchema),
  es: () => import('./locales/es.json').then((module) => module.default as TranslationSchema),
  fr: () => import('./locales/fr.json').then((module) => module.default as TranslationSchema),
  de: () => import('./locales/de.json').then((module) => module.default as TranslationSchema),
  pt: () => import('./locales/pt.json').then((module) => module.default as TranslationSchema),
  ko: () => import('./locales/ko.json').then((module) => module.default as TranslationSchema),
  it: () => import('./locales/it.json').then((module) => module.default as TranslationSchema),
  nl: () => import('./locales/nl.json').then((module) => module.default as TranslationSchema),
  tr: () => import('./locales/tr.json').then((module) => module.default as TranslationSchema),
  pl: () => import('./locales/pl.json').then((module) => module.default as TranslationSchema),
  vi: () => import('./locales/vi.json').then((module) => module.default as TranslationSchema),
  th: () => import('./locales/th.json').then((module) => module.default as TranslationSchema),
  hi: () => import('./locales/hi.json').then((module) => module.default as TranslationSchema),
  uk: () => import('./locales/uk.json').then((module) => module.default as TranslationSchema)
} as const;

// Cache for loaded dictionaries
const cache = new Map<Locale, TranslationSchema>();

/**
 * Get dictionary for the specified locale with caching
 * @param locale - The locale to load
 * @returns Promise resolving to the translation dictionary
 */
export const getDictionary = async (locale: Locale): Promise<TranslationSchema> => {
  // Return cached version if available
  if (cache.has(locale)) {
    return cache.get(locale)!;
  }

  // Load and cache the dictionary
  const dictionary = await dictionaries[locale]();
  cache.set(locale, dictionary);

  return dictionary;
};

/**
 * Preload a dictionary for better performance
 * @param locale - The locale to preload
 */
export const preloadDictionary = (locale: Locale): void => {
  if (!cache.has(locale)) {
    getDictionary(locale).catch(console.error);
  }
};

/**
 * Clear the dictionary cache
 * @param locale - Optional locale to clear. If not provided, clears all
 */
export const clearDictionaryCache = (locale?: Locale): void => {
  if (locale) {
    cache.delete(locale);
  } else {
    cache.clear();
  }
};
