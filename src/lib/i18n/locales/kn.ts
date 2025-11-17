import { en } from './en';
import type { TranslationSchema } from './en';

export const kn: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Booru ಟ್ಯಾಗ್ ಎಕ್ಸ್‌ಟ್ರಾಕ್ಟರ್',
    language: 'ಭಾಷೆ',
    english: 'ಇಂಗ್ಲಿಷ್',
    indonesian: 'ಇಂಡೋನೇಷಿಯನ್',
    chinese: 'ಚೈನೀಸ್',
    languageSwitcher: {
      title: 'ಇಂಟರ್‌ಫೇಸ್ ಭಾಷೆ',
      description: 'ನಿಮ್ಮ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಉಳಿಸಲಾಗಿದೆ. ಡೀಫಾಲ್ಟ್ ಭಾಷೆ ಇಂಗ್ಲಿಷ್ ಆಗಿದೆ.',
      instantNotice: 'ಬದಲಾವಣೆಗಳು ರೀಲೋಡ್ ಇಲ್ಲದೆ ಅನ್ವಯಿಸುತ್ತವೆ.',
      searchPlaceholder: 'ಭಾಷೆಗಳನ್ನು ಹುಡುಕಿ...',
      noResults: 'ಯಾವುದೇ ಭಾಷೆಗಳು ಸಿಗಲಿಲ್ಲ'
    },
    nav: {
      extractor: 'ಟ್ಯಾಗ್‌ಗಳು',
      image: 'ಚಿತ್ರ',
      booruList: 'Booru',
      settings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು'
    },
    actions: {
      ...en.common.actions,
      add: 'ಸೇರಿಸಿ',
      apply: 'ಅನ್ವಯಿಸಿ',
      back: 'ಹಿಂದೆ',
      cancel: 'ರದ್ದುಮಾಡಿ',
      clear: 'ತೆರವುಗೊಳಿಸಿ',
      close: 'ಮುಚ್ಚಿ',
      confirm: 'ದೃಢೀಕರಿಸಿ',
      copy: 'ನಕಲಿಸಿ',
      copied: 'ನಕಲು ಮಾಡಲಾಗಿದೆ!',
      delete: 'ಅಳಿಸಿ',
      save: 'ಉಳಿಸಿ',
      search: 'ಹುಡುಕಿ',
      all: 'ಎಲ್ಲಾ',
      none: 'ಯಾವುದೂ ಇಲ್ಲ'
    }
  },
  settings: {
    title: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    sections: {
      appearance: 'ನೋಟ',
      colorTheme: 'ಬಣ್ಣದ ಥೀಮ್',
      dataFetch: 'ಡೇಟಾ ಪಡೆಯುವ ವಿಧಾನ'
    },
    themeOptions: {
      system: 'ಸಿಸ್ಟಮ್',
      light: 'ಬೆಳಕು',
      dark: 'ಗಾಢ'
    },
    colorThemes: {
      blue: 'ನೀಲಿ',
      orange: 'ಕಿತ್ತಳೆ',
      teal: 'ಟೀಲ್',
      rose: 'ಗುಲಾಬಿ',
      purple: 'ನೇರಳೆ',
      green: 'ಹಸಿರು',
      custom: 'ಕಸ್ಟಮ್ ಬಣ್ಣ'
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
