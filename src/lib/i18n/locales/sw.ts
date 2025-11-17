import { en } from './en';
import type { TranslationSchema } from './en';

export const sw: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Booru Tag Extractor',
    language: 'Lugha',
    english: 'Kiingereza',
    indonesian: 'Kiindonesia',
    chinese: 'Kichina',
    languageSwitcher: {
      title: 'Lugha ya kiolesura',
      description: 'Imehifadhiwa kwenye kivinjari chako. Lugha chaguo-msingi ni Kiingereza.',
      instantNotice: 'Mabadiliko yanatekelezwa mara moja bila kupakia upya.',
      searchPlaceholder: 'Tafuta lugha...',
      noResults: 'Hakuna lugha zilizopatikana'
    },
    nav: {
      extractor: 'Lebo',
      image: 'Picha',
      booruList: 'Booru',
      settings: 'Mipangilio'
    },
    actions: {
      ...en.common.actions,
      add: 'Ongeza',
      apply: 'Tekeleza',
      back: 'Rudi',
      cancel: 'Ghairi',
      clear: 'Futa',
      close: 'Funga',
      confirm: 'Thibitisha',
      copy: 'Nakili',
      copied: 'Imenakiliwa!',
      delete: 'Futa',
      save: 'Hifadhi',
      search: 'Tafuta',
      all: 'Yote',
      none: 'Hamna'
    }
  },
  settings: {
    title: 'Mipangilio',
    sections: {
      appearance: 'Muonekano',
      colorTheme: 'Mandhari ya Rangi',
      dataFetch: 'Mbinu ya Kupata Data'
    },
    themeOptions: {
      system: 'Mfumo',
      light: 'Nuru',
      dark: 'Giza'
    },
    colorThemes: {
      blue: 'Bluu',
      orange: 'Chungwa',
      teal: 'Teal',
      rose: 'Waridi',
      purple: 'Zambarau',
      green: 'Kijani',
      custom: 'Rangi Maalum'
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
