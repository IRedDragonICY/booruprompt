import { en } from './en';
import type { TranslationSchema } from './en';

export const sq: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Booru ekstraktor etiketash',
    language: 'Gjuha',
    english: 'Anglisht',
    indonesian: 'Indonezisht',
    chinese: 'Kinezisht',
    languageSwitcher: {
      title: 'Gjuha e ndërfaqes',
      description: 'E ruajtur në shfletuesin tuaj. Gjuha e paracaktuar është anglisht.',
      instantNotice: 'Ndryshimet aplikohen menjëherë pa rifreskuar.',
      searchPlaceholder: 'Kërko gjuhë...',
      noResults: 'Nuk u gjet asnjë gjuhë'
    },
    nav: {
      extractor: 'Etiketa',
      image: 'Imazh',
      booruList: 'Booru',
      settings: 'Cilësimet'
    },
    actions: {
      ...en.common.actions,
      add: 'Shto',
      apply: 'Apliko',
      back: 'Prapa',
      cancel: 'Anulo',
      clear: 'Pastro',
      close: 'Mbyll',
      confirm: 'Konfirmo',
      copy: 'Kopjo',
      copied: 'U kopjua!',
      delete: 'Fshi',
      save: 'Ruaj',
      search: 'Kërko',
      all: 'Të gjitha',
      none: 'Asnjë'
    }
  },
  settings: {
    title: 'Cilësimet',
    sections: {
      appearance: 'Pamja',
      colorTheme: 'Tema e ngjyrave',
      dataFetch: 'Metoda e marrjes së të dhënave'
    },
    themeOptions: {
      system: 'Sistemi',
      light: 'E ndritshme',
      dark: 'E errët'
    },
    colorThemes: {
      blue: 'Blu',
      orange: 'Portokalli',
      teal: 'Gurkali',
      rose: 'Rozë',
      purple: 'Vjollcë',
      green: 'Jeshile',
      custom: 'Ngjyrë e personalizuar'
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
