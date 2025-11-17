import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en } from './locales/en';
import { id } from './locales/id';
import { zh_CN } from './locales/zh-CN';
import { zh_TW } from './locales/zh-TW';
import { ja } from './locales/ja';
import { ko } from './locales/ko';
import { es } from './locales/es';
import { fr } from './locales/fr';
import { de } from './locales/de';
import { it } from './locales/it';
import { pt } from './locales/pt';
import { ru } from './locales/ru';
import { ar } from './locales/ar';
import { hi } from './locales/hi';
import { th } from './locales/th';
import { vi } from './locales/vi';
import { tr } from './locales/tr';
import { pl } from './locales/pl';
import { nl } from './locales/nl';
import { sv } from './locales/sv';
import { no } from './locales/no';
import { da } from './locales/da';
import { fi } from './locales/fi';
import { el } from './locales/el';
import { cs } from './locales/cs';
import { hu } from './locales/hu';
import { ro } from './locales/ro';
import { uk } from './locales/uk';
import { he } from './locales/he';
import { ms } from './locales/ms';
import { tl } from './locales/tl';
import { bn } from './locales/bn';
import { fa } from './locales/fa';

export const LANGUAGE_STORAGE_KEY = 'booruPreferredLanguage';
export const DEFAULT_LANGUAGE = 'en';

export const availableLanguages = [
  { code: 'en', label: 'English', nativeName: 'English' },
  { code: 'id', label: 'Indonesian', nativeName: 'Bahasa Indonesia' },
  { code: 'zh-CN', label: 'Chinese (Simplified)', nativeName: '简体中文' },
  { code: 'zh-TW', label: 'Chinese (Traditional)', nativeName: '繁體中文' },
  { code: 'ja', label: 'Japanese', nativeName: '日本語' },
  { code: 'ko', label: 'Korean', nativeName: '한국어' },
  { code: 'es', label: 'Spanish', nativeName: 'Español' },
  { code: 'fr', label: 'French', nativeName: 'Français' },
  { code: 'de', label: 'German', nativeName: 'Deutsch' },
  { code: 'it', label: 'Italian', nativeName: 'Italiano' },
  { code: 'pt', label: 'Portuguese', nativeName: 'Português' },
  { code: 'ru', label: 'Russian', nativeName: 'Русский' },
  { code: 'ar', label: 'Arabic', nativeName: 'العربية' },
  { code: 'hi', label: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'th', label: 'Thai', nativeName: 'ไทย' },
  { code: 'vi', label: 'Vietnamese', nativeName: 'Tiếng Việt' },
  { code: 'tr', label: 'Turkish', nativeName: 'Türkçe' },
  { code: 'pl', label: 'Polish', nativeName: 'Polski' },
  { code: 'nl', label: 'Dutch', nativeName: 'Nederlands' },
  { code: 'sv', label: 'Swedish', nativeName: 'Svenska' },
  { code: 'no', label: 'Norwegian', nativeName: 'Norsk' },
  { code: 'da', label: 'Danish', nativeName: 'Dansk' },
  { code: 'fi', label: 'Finnish', nativeName: 'Suomi' },
  { code: 'el', label: 'Greek', nativeName: 'Ελληνικά' },
  { code: 'cs', label: 'Czech', nativeName: 'Čeština' },
  { code: 'hu', label: 'Hungarian', nativeName: 'Magyar' },
  { code: 'ro', label: 'Romanian', nativeName: 'Română' },
  { code: 'uk', label: 'Ukrainian', nativeName: 'Українська' },
  { code: 'he', label: 'Hebrew', nativeName: 'עברית' },
  { code: 'ms', label: 'Malay', nativeName: 'Bahasa Melayu' },
  { code: 'tl', label: 'Tagalog', nativeName: 'Tagalog' },
  { code: 'bn', label: 'Bengali', nativeName: 'বাংলা' },
  { code: 'fa', label: 'Persian', nativeName: 'فارسی' }
] as const;

const resources = {
  en: { translation: en },
  id: { translation: id },
  'zh-CN': { translation: zh_CN },
  'zh-TW': { translation: zh_TW },
  ja: { translation: ja },
  ko: { translation: ko },
  es: { translation: es },
  fr: { translation: fr },
  de: { translation: de },
  it: { translation: it },
  pt: { translation: pt },
  ru: { translation: ru },
  ar: { translation: ar },
  hi: { translation: hi },
  th: { translation: th },
  vi: { translation: vi },
  tr: { translation: tr },
  pl: { translation: pl },
  nl: { translation: nl },
  sv: { translation: sv },
  no: { translation: no },
  da: { translation: da },
  fi: { translation: fi },
  el: { translation: el },
  cs: { translation: cs },
  hu: { translation: hu },
  ro: { translation: ro },
  uk: { translation: uk },
  he: { translation: he },
  ms: { translation: ms },
  tl: { translation: tl },
  bn: { translation: bn },
  fa: { translation: fa }
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
