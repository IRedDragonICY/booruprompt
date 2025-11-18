import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import type { Locale, LanguageOption } from './types';
import { getDictionary } from './dictionaries';

export const LANGUAGE_STORAGE_KEY = 'booruPreferredLanguage';
export const DEFAULT_LANGUAGE: Locale = 'en';

export const availableLanguages: readonly LanguageOption[] = [
  { code: 'en', label: 'English' },
  { code: 'id', label: 'Bahasa Indonesia' },
  { code: 'zh', label: '中文' },
  { code: 'zh-TW', label: '繁體中文' },
  { code: 'ja', label: '日本語' },
  { code: 'ar', label: 'العربية' },
  { code: 'ru', label: 'Русский' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'pt', label: 'Português' },
  { code: 'ko', label: '한국어' },
  { code: 'it', label: 'Italiano' },
  { code: 'nl', label: 'Nederlands' },
  { code: 'tr', label: 'Türkçe' },
  { code: 'pl', label: 'Polski' },
  { code: 'vi', label: 'Tiếng Việt' },
  { code: 'th', label: 'ไทย' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'uk', label: 'Українська' }
] as const;

// Lazy load resources for better performance
const loadResources = async () => {
  const [en, id, zh, zhTW, ja, ar, ru, es, fr, de, pt, ko, it, nl, tr, pl, vi, th, hi, uk] = await Promise.all([
    getDictionary('en'),
    getDictionary('id'),
    getDictionary('zh'),
    getDictionary('zh-TW'),
    getDictionary('ja'),
    getDictionary('ar'),
    getDictionary('ru'),
    getDictionary('es'),
    getDictionary('fr'),
    getDictionary('de'),
    getDictionary('pt'),
    getDictionary('ko'),
    getDictionary('it'),
    getDictionary('nl'),
    getDictionary('tr'),
    getDictionary('pl'),
    getDictionary('vi'),
    getDictionary('th'),
    getDictionary('hi'),
    getDictionary('uk')
  ]);

  return {
    en: { translation: en },
    id: { translation: id },
    zh: { translation: zh },
    'zh-TW': { translation: zhTW },
    ja: { translation: ja },
    ar: { translation: ar },
    ru: { translation: ru },
    es: { translation: es },
    fr: { translation: fr },
    de: { translation: de },
    pt: { translation: pt },
    ko: { translation: ko },
    it: { translation: it },
    nl: { translation: nl },
    tr: { translation: tr },
    pl: { translation: pl },
    vi: { translation: vi },
    th: { translation: th },
    hi: { translation: hi },
    uk: { translation: uk }
  };
};

// Initialize i18n
const initializeI18n = async () => {
  if (i18n.isInitialized) {
    return i18n;
  }

  const resources = await loadResources();

  await i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: DEFAULT_LANGUAGE,
      fallbackLng: DEFAULT_LANGUAGE,
      interpolation: { escapeValue: false },
      defaultNS: 'translation',
      react: { useSuspense: false }
    });

  return i18n;
};

// Auto-initialize
initializeI18n().catch((err) => {
  console.error('Failed to initialize i18next:', err);
});

export default i18n;
export { getDictionary } from './dictionaries';
export type { Locale, LanguageOption, TranslationSchema } from './types';
