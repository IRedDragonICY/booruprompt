import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';

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
  { code: 'fa', label: 'Persian', nativeName: 'فارسی', region: 'Iran' },
  { code: 'su', label: 'Sundanese', nativeName: 'Basa Sunda', region: 'West Java, Indonesia' },
  { code: 'sw', label: 'Swahili', nativeName: 'Kiswahili', region: 'East Africa, Tanzania, Kenya' },
  { code: 'ta', label: 'Tamil', nativeName: 'தமிழ்', region: 'Tamil Nadu, Sri Lanka, Singapore' },
  { code: 'te', label: 'Telugu', nativeName: 'తెలుగు', region: 'Andhra Pradesh, Telangana, India' },
  { code: 'ur', label: 'Urdu', nativeName: 'اردو', region: 'Pakistan, India' },
  { code: 'my', label: 'Burmese', nativeName: 'မြန်မာဘာသာ', region: 'Myanmar' },
  { code: 'km', label: 'Khmer', nativeName: 'ខ្មែរ', region: 'Cambodia' },
  { code: 'lo', label: 'Lao', nativeName: 'ລາວ', region: 'Laos' },
  { code: 'ne', label: 'Nepali', nativeName: 'नेपाली', region: 'Nepal' },
  { code: 'si', label: 'Sinhala', nativeName: 'සිංහල', region: 'Sri Lanka' },
  { code: 'kk', label: 'Kazakh', nativeName: 'Қазақ тілі', region: 'Kazakhstan' },
  { code: 'ka', label: 'Georgian', nativeName: 'ქართული', region: 'Georgia' },
  { code: 'hy', label: 'Armenian', nativeName: 'Հայերեն', region: 'Armenia' },
  { code: 'am', label: 'Amharic', nativeName: 'አማርኛ', region: 'Ethiopia' },
  { code: 'ps', label: 'Pashto', nativeName: 'پښتو', region: 'Afghanistan, Pakistan' },
  { code: 'ku', label: 'Kurdish', nativeName: 'Kurdî', region: 'Kurdistan, Iraq, Iran, Turkey' },
  { code: 'mr', label: 'Marathi', nativeName: 'मराठी', region: 'Maharashtra, India' },
  { code: 'gu', label: 'Gujarati', nativeName: 'ગુજરાતી', region: 'Gujarat, India' },
  { code: 'kn', label: 'Kannada', nativeName: 'ಕನ್ನಡ', region: 'Karnataka, India' },
  { code: 'ml', label: 'Malayalam', nativeName: 'മലയാളം', region: 'Kerala, India' },
  { code: 'pa', label: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', region: 'Punjab, India, Pakistan' },
  { code: 'sr', label: 'Serbian', nativeName: 'Српски', region: 'Serbia' },
  { code: 'hr', label: 'Croatian', nativeName: 'Hrvatski', region: 'Croatia' },
  { code: 'bg', label: 'Bulgarian', nativeName: 'Български', region: 'Bulgaria' },
  { code: 'sk', label: 'Slovak', nativeName: 'Slovenčina', region: 'Slovakia' },
  { code: 'sl', label: 'Slovenian', nativeName: 'Slovenščina', region: 'Slovenia' },
  { code: 'et', label: 'Estonian', nativeName: 'Eesti', region: 'Estonia' },
  { code: 'lv', label: 'Latvian', nativeName: 'Latviešu', region: 'Latvia' },
  { code: 'lt', label: 'Lithuanian', nativeName: 'Lietuvių', region: 'Lithuania' },
  { code: 'sq', label: 'Albanian', nativeName: 'Shqip', region: 'Albania, Kosovo' },
  { code: 'mk', label: 'Macedonian', nativeName: 'Македонски', region: 'North Macedonia' },
  { code: 'is', label: 'Icelandic', nativeName: 'Íslenska', region: 'Iceland' },
  { code: 'ca', label: 'Catalan', nativeName: 'Català', region: 'Catalonia, Valencia, Balearic Islands' },
  { code: 'eu', label: 'Basque', nativeName: 'Euskara', region: 'Basque Country, Spain, France' },
  { code: 'cy', label: 'Welsh', nativeName: 'Cymraeg', region: 'Wales, United Kingdom' },
  { code: 'af', label: 'Afrikaans', nativeName: 'Afrikaans', region: 'South Africa, Namibia' }
] as const;

if (!i18n.isInitialized) {
  i18n
    .use(HttpBackend)
    .use(initReactI18next)
    .init({
      lng: DEFAULT_LANGUAGE,
      fallbackLng: DEFAULT_LANGUAGE,

      // Single JSON file per language
      backend: {
        loadPath: '/locales/{{lng}}.json',
      },

      // Use empty namespace to load all keys directly from JSON root
      ns: [''],
      defaultNS: '',

      // Key separator for nested keys (e.g., 'settings.title')
      keySeparator: '.',
      nsSeparator: false,

      // Interpolation settings
      interpolation: {
        escapeValue: false,
      },

      // React settings
      react: {
        useSuspense: false,
      },

      // Load current language only
      load: 'currentOnly',

      // Supported languages
      supportedLngs: availableLanguages.map(({ code }) => code),
      nonExplicitSupportedLngs: false,
    })
    .catch((err) => {
      console.error('Failed to initialize i18next:', err);
    });
}

export default i18n;
