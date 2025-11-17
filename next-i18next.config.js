/**
 * @type {import('next-i18next').UserConfig}
 *
 * Configuration for next-i18next internationalization
 * This enables server-side translation support with JSON files
 */

module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: [
      'en', 'id', 'jv', 'su',
      'zh-CN', 'zh-TW', 'ja', 'ko',
      'es', 'fr', 'de', 'it', 'pt', 'ru',
      'ar', 'hi', 'th', 'vi', 'tr',
      'pl', 'nl', 'sv', 'no', 'da', 'fi',
      'el', 'cs', 'hu', 'ro', 'uk', 'he',
      'ms', 'tl', 'bn', 'fa', 'ur',
      'sw', 'ta', 'te', 'my', 'km', 'lo',
      'ne', 'si', 'kk', 'ka', 'hy',
      'am', 'ps', 'ku', 'mr', 'gu',
      'kn', 'ml', 'pa', 'sr', 'hr',
      'bg', 'sk', 'sl', 'et', 'lv',
      'lt', 'sq', 'mk', 'is', 'ca',
      'eu', 'cy', 'af'
    ],
  },

  // Default namespaces to load (reduces bundle size)
  ns: ['common', 'settings', 'extractor', 'imageTool', 'booruList'],

  // Default namespace used if not specified
  defaultNS: 'common',

  // Fallback language when translation is missing
  fallbackLng: 'en',

  // Support all language variants without explicit JSON files
  nonExplicitSupportedLngs: false,

  // Reload translations in development when files change
  reloadOnPrerender: process.env.NODE_ENV === 'development',

  // Serialize config for serverSideTranslations
  serializeConfig: true,

  // Custom path for locale files
  localePath:
    typeof window === 'undefined'
      ? require('path').resolve('./public/locales')
      : '/locales',

  // Interpolation settings (must match localeStructure)
  interpolation: {
    escapeValue: false, // React already escapes
  },

  // Detection settings (optional - for advanced use)
  detection: {
    order: ['cookie', 'header', 'querystring'],
    caches: ['cookie'],
  },

  // React settings
  react: {
    useSuspense: false, // Disable suspense for SSR compatibility
  },

  // Debug mode (only in development)
  debug: process.env.NODE_ENV === 'development',

  // Save missing translations (helpful for crowdfunding)
  saveMissing: process.env.NODE_ENV === 'development',
  missingKeyHandler: (lng, ns, key) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Missing translation: [${lng}] ${ns}:${key}`);
    }
  },
};
