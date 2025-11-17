import { en } from './en';
import type { TranslationSchema } from './en';

export const et: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Booru siltide ekstraktor',
    language: 'Keel',
    english: 'Inglise',
    indonesian: 'Indoneesia',
    chinese: 'Hiina',
    languageSwitcher: {
      title: 'Liidese keel',
      description: 'Salvestatud teie brauserisse. Vaikekeel on inglise.',
      instantNotice: 'Muudatused rakenduvad kohe ilma uuesti laadimata.',
      searchPlaceholder: 'Otsi keeli...',
      noResults: 'Keeli ei leitud'
    },
    nav: {
      extractor: 'Sildid',
      image: 'Pilt',
      booruList: 'Booru',
      settings: 'Seaded'
    },
    actions: {
      ...en.common.actions,
      add: 'Lisa',
      apply: 'Rakenda',
      back: 'Tagasi',
      cancel: 'Tühista',
      clear: 'Kustuta',
      close: 'Sulge',
      confirm: 'Kinnita',
      copy: 'Kopeeri',
      copied: 'Kopeeritud!',
      delete: 'Kustuta',
      save: 'Salvesta',
      search: 'Otsi',
      all: 'Kõik',
      none: 'Mitte midagi'
    }
  },
  settings: {
    title: 'Seaded',
    sections: {
      appearance: 'Välimus',
      colorTheme: 'Värviteema',
      dataFetch: 'Andmete hankimise meetod'
    },
    themeOptions: {
      system: 'Süsteem',
      light: 'Hele',
      dark: 'Tume'
    },
    colorThemes: {
      blue: 'Sinine',
      orange: 'Oranž',
      teal: 'Sinakasroheline',
      rose: 'Roosa',
      purple: 'Lilla',
      green: 'Roheline',
      custom: 'Kohandatud värv'
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
