import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en } from './locales/en';
import { id } from './locales/id';
import { zh } from './locales/zh';

export const LANGUAGE_STORAGE_KEY = 'booruPreferredLanguage';
export const DEFAULT_LANGUAGE = 'en';

export const availableLanguages = [
  { code: 'en', label: 'English' },
  { code: 'id', label: 'Bahasa Indonesia' },
  { code: 'zh', label: '中文' }
] as const;

const resources = {
  en: { translation: en },
  id: { translation: id },
  zh: { translation: zh }
};

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: DEFAULT_LANGUAGE,
      fallbackLng: DEFAULT_LANGUAGE,
      interpolation: { escapeValue: false },
      defaultNS: 'translation',
      react: { useSuspense: false }
    })
    .catch((err) => {
      console.error('Failed to initialize i18next:', err);
    });
}

export default i18n;
