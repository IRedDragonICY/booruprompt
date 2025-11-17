import { en } from './en';
import type { TranslationSchema } from './en';

export const ne: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Booru Tag Extractor',
    language: 'भाषा',
    english: 'अङ्ग्रेजी',
    indonesian: 'इन्डोनेसियाली',
    chinese: 'चिनियाँ',
    languageSwitcher: {
      title: 'इन्टरफेस भाषा',
      description: 'तपाईंको ब्राउजरमा बचत गरिएको। पूर्वनिर्धारित भाषा अङ्ग्रेजी हो।',
      instantNotice: 'परिवर्तनहरू पुन: लोड नगरी तुरुन्तै लागू हुन्छन्।',
      searchPlaceholder: 'भाषाहरू खोज्नुहोस्...',
      noResults: 'कुनै भाषा फेला परेन'
    },
    nav: {
      extractor: 'ट्यागहरू',
      image: 'तस्बिर',
      booruList: 'Booru',
      settings: 'सेटिङहरू'
    },
    actions: {
      ...en.common.actions,
      add: 'थप्नुहोस्',
      apply: 'लागू गर्नुहोस्',
      back: 'फिर्ता',
      cancel: 'रद्द गर्नुहोस्',
      clear: 'खाली गर्नुहोस्',
      close: 'बन्द गर्नुहोस्',
      confirm: 'पुष्टि गर्नुहोस्',
      copy: 'प्रतिलिपि',
      copied: 'प्रतिलिपि गरियो!',
      delete: 'मेटाउनुहोस्',
      save: 'बचत गर्नुहोस्',
      search: 'खोज्नुहोस्',
      all: 'सबै',
      none: 'कुनै पनि होइन'
    }
  },
  settings: {
    title: 'सेटिङहरू',
    sections: {
      appearance: 'उपस्थिति',
      colorTheme: 'रङ थिम',
      dataFetch: 'डेटा प्राप्ति विधि'
    },
    themeOptions: {
      system: 'प्रणाली',
      light: 'उज्यालो',
      dark: 'अँध्यारो'
    },
    colorThemes: {
      blue: 'नीलो',
      orange: 'सुन्तला',
      teal: 'टिल',
      rose: 'गुलाब',
      purple: 'बैजनी',
      green: 'हरियो',
      custom: 'अनुकूलित रङ'
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
