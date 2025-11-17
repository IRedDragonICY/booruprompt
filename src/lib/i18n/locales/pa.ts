import { en } from './en';
import type { TranslationSchema } from './en';

export const pa: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Booru ਟੈਗ ਐਕਸਟ੍ਰੈਕਟਰ',
    language: 'ਭਾਸ਼ਾ',
    english: 'ਅੰਗਰੇਜ਼ੀ',
    indonesian: 'ਇੰਡੋਨੇਸ਼ੀਆਈ',
    chinese: 'ਚੀਨੀ',
    languageSwitcher: {
      title: 'ਇੰਟਰਫੇਸ ਭਾਸ਼ਾ',
      description: 'ਤੁਹਾਡੇ ਬ੍ਰਾਊਜ਼ਰ ਵਿੱਚ ਸੁਰੱਖਿਅਤ। ਮੂਲ ਭਾਸ਼ਾ ਅੰਗਰੇਜ਼ੀ ਹੈ।',
      instantNotice: 'ਬਦਲਾਅ ਰੀਲੋਡ ਕੀਤੇ ਬਿਨਾਂ ਲਾਗੂ ਹੁੰਦੇ ਹਨ।',
      searchPlaceholder: 'ਭਾਸ਼ਾਵਾਂ ਖੋਜੋ...',
      noResults: 'ਕੋਈ ਭਾਸ਼ਾ ਨਹੀਂ ਮਿਲੀ'
    },
    nav: {
      extractor: 'ਟੈਗ',
      image: 'ਤਸਵੀਰ',
      booruList: 'Booru',
      settings: 'ਸੈਟਿੰਗਾਂ'
    },
    actions: {
      ...en.common.actions,
      add: 'ਸ਼ਾਮਲ ਕਰੋ',
      apply: 'ਲਾਗੂ ਕਰੋ',
      back: 'ਪਿੱਛੇ',
      cancel: 'ਰੱਦ ਕਰੋ',
      clear: 'ਸਾਫ਼ ਕਰੋ',
      close: 'ਬੰਦ ਕਰੋ',
      confirm: 'ਪੁਸ਼ਟੀ ਕਰੋ',
      copy: 'ਕਾਪੀ ਕਰੋ',
      copied: 'ਕਾਪੀ ਹੋ ਗਿਆ!',
      delete: 'ਮਿਟਾਓ',
      save: 'ਸੁਰੱਖਿਅਤ ਕਰੋ',
      search: 'ਖੋਜੋ',
      all: 'ਸਾਰੇ',
      none: 'ਕੋਈ ਨਹੀਂ'
    }
  },
  settings: {
    title: 'ਸੈਟਿੰਗਾਂ',
    sections: {
      appearance: 'ਦਿੱਖ',
      colorTheme: 'ਰੰਗ ਥੀਮ',
      dataFetch: 'ਡੇਟਾ ਪ੍ਰਾਪਤ ਕਰਨ ਦੀ ਵਿਧੀ'
    },
    themeOptions: {
      system: 'ਸਿਸਟਮ',
      light: 'ਹਲਕਾ',
      dark: 'ਗੂੜ੍ਹਾ'
    },
    colorThemes: {
      blue: 'ਨੀਲਾ',
      orange: 'ਸੰਤਰੀ',
      teal: 'ਟੀਲ',
      rose: 'ਗੁਲਾਬੀ',
      purple: 'ਜਾਮਨੀ',
      green: 'ਹਰਾ',
      custom: 'ਕਸਟਮ ਰੰਗ'
    },
    customColor: {
      ...en.settings.customColor
    },
    fetchModes: {
      ...en.settings.fetchModes
    },
    clientProxy: {
      ...en.settings.clientProxy
    },
    toggles: {
      ...en.settings.toggles
    },
    historySize: {
      ...en.settings.historySize
    },
    accessibility: {
      ...en.settings.accessibility
    },
    historySizeOptions: {
      ...en.settings.historySizeOptions
    },
    support: {
      ...en.settings.support
    },
    modal: {
      ...en.settings.modal
    }
  }
};
