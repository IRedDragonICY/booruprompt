import { en } from './en';
import type { TranslationSchema } from './en';

export const mr: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Booru टॅग एक्स्ट्रॅक्टर',
    language: 'भाषा',
    english: 'इंग्रजी',
    indonesian: 'इंडोनेशियन',
    chinese: 'चिनी',
    languageSwitcher: {
      title: 'इंटरफेस भाषा',
      description: 'तुमच्या ब्राउझरमध्ये सेव्ह केले. डीफॉल्ट भाषा इंग्रजी आहे.',
      instantNotice: 'बदल रीलोड न करता लागू होतात.',
      searchPlaceholder: 'भाषा शोधा...',
      noResults: 'भाषा सापडल्या नाहीत'
    },
    nav: {
      extractor: 'टॅग्ज',
      image: 'प्रतिमा',
      booruList: 'Booru',
      settings: 'सेटिंग्ज'
    },
    actions: {
      ...en.common.actions,
      add: 'जोडा',
      apply: 'लागू करा',
      back: 'मागे',
      cancel: 'रद्द करा',
      clear: 'साफ करा',
      close: 'बंद करा',
      confirm: 'पुष्टी करा',
      copy: 'कॉपी करा',
      copied: 'कॉपी झाले!',
      delete: 'हटवा',
      save: 'सेव्ह करा',
      search: 'शोधा',
      all: 'सर्व',
      none: 'काहीही नाही'
    }
  },
  settings: {
    title: 'सेटिंग्ज',
    sections: {
      appearance: 'देखावा',
      colorTheme: 'रंग थीम',
      dataFetch: 'डेटा मिळवण्याची पद्धत'
    },
    themeOptions: {
      system: 'सिस्टम',
      light: 'उजळ',
      dark: 'गडद'
    },
    colorThemes: {
      blue: 'निळा',
      orange: 'केशरी',
      teal: 'टील',
      rose: 'गुलाबी',
      purple: 'जांभळा',
      green: 'हिरवा',
      custom: 'सानुकूल रंग'
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
