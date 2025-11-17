import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en } from './locales/en';
import { id } from './locales/id';
import { jv } from './locales/jv';
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
  { code: 'en', label: 'English', nativeName: 'English', region: 'United States, United Kingdom' },
  { code: 'id', label: 'Indonesian', nativeName: 'Bahasa Indonesia', region: 'Indonesia' },
  { code: 'jv', label: 'Javanese', nativeName: 'Basa Jawa', region: 'Java, Indonesia' },
  { code: 'zh-CN', label: 'Chinese (Simplified)', nativeName: '简体中文', region: 'China, Singapore' },
  { code: 'zh-TW', label: 'Chinese (Traditional)', nativeName: '繁體中文', region: 'Taiwan, Hong Kong' },
  { code: 'ja', label: 'Japanese', nativeName: '日本語', region: 'Japan' },
  { code: 'ko', label: 'Korean', nativeName: '한국어', region: 'Korea, South Korea' },
  { code: 'es', label: 'Spanish', nativeName: 'Español', region: 'Spain, Mexico, Latin America' },
  { code: 'fr', label: 'French', nativeName: 'Français', region: 'France, Canada, Belgium' },
  { code: 'de', label: 'German', nativeName: 'Deutsch', region: 'Germany, Austria, Switzerland' },
  { code: 'it', label: 'Italian', nativeName: 'Italiano', region: 'Italy' },
  { code: 'pt', label: 'Portuguese', nativeName: 'Português', region: 'Portugal, Brazil' },
  { code: 'ru', label: 'Russian', nativeName: 'Русский', region: 'Russia' },
  { code: 'ar', label: 'Arabic', nativeName: 'العربية', region: 'Saudi Arabia, UAE, Egypt, Middle East' },
  { code: 'hi', label: 'Hindi', nativeName: 'हिन्दी', region: 'India' },
  { code: 'th', label: 'Thai', nativeName: 'ไทย', region: 'Thailand' },
  { code: 'vi', label: 'Vietnamese', nativeName: 'Tiếng Việt', region: 'Vietnam' },
  { code: 'tr', label: 'Turkish', nativeName: 'Türkçe', region: 'Turkey' },
  { code: 'pl', label: 'Polish', nativeName: 'Polski', region: 'Poland' },
  { code: 'nl', label: 'Dutch', nativeName: 'Nederlands', region: 'Netherlands, Belgium' },
  { code: 'sv', label: 'Swedish', nativeName: 'Svenska', region: 'Sweden' },
  { code: 'no', label: 'Norwegian', nativeName: 'Norsk', region: 'Norway' },
  { code: 'da', label: 'Danish', nativeName: 'Dansk', region: 'Denmark' },
  { code: 'fi', label: 'Finnish', nativeName: 'Suomi', region: 'Finland' },
  { code: 'el', label: 'Greek', nativeName: 'Ελληνικά', region: 'Greece' },
  { code: 'cs', label: 'Czech', nativeName: 'Čeština', region: 'Czech Republic' },
  { code: 'hu', label: 'Hungarian', nativeName: 'Magyar', region: 'Hungary' },
  { code: 'ro', label: 'Romanian', nativeName: 'Română', region: 'Romania' },
  { code: 'uk', label: 'Ukrainian', nativeName: 'Українська', region: 'Ukraine' },
  { code: 'he', label: 'Hebrew', nativeName: 'עברית', region: 'Israel' },
  { code: 'ms', label: 'Malay', nativeName: 'Bahasa Melayu', region: 'Malaysia' },
  { code: 'tl', label: 'Tagalog', nativeName: 'Tagalog', region: 'Philippines' },
  { code: 'bn', label: 'Bengali', nativeName: 'বাংলা', region: 'Bangladesh, India' },
  { code: 'fa', label: 'Persian', nativeName: 'فارسی', region: 'Iran' }
] as const;

const resources = {
  en: { translation: en },
  id: { translation: id },
  jv: { translation: jv },
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
