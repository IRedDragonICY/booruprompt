import { en } from './en';
import type { TranslationSchema } from './en';

export const eu: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Booru etiketa erausgailua',
    language: 'Hizkuntza',
    english: 'Ingelesa',
    indonesian: 'Indonesiarra',
    chinese: 'Txinera',
    languageSwitcher: {
      title: 'Interfazearen hizkuntza',
      description: 'Zure nabigatzailean gordeta. Hizkuntza lehenetsia ingelesa da.',
      instantNotice: 'Aldaketak berehala aplikatzen dira, berritu gabe.',
      searchPlaceholder: 'Bilatu hizkuntzak...',
      noResults: 'Ez da hizkuntzarik aurkitu'
    },
    nav: {
      extractor: 'Etiketak',
      image: 'Irudia',
      booruList: 'Booru',
      settings: 'Ezarpenak'
    },
    actions: {
      ...en.common.actions,
      add: 'Gehitu',
      apply: 'Aplikatu',
      back: 'Atzera',
      cancel: 'Utzi',
      clear: 'Garbitu',
      close: 'Itxi',
      confirm: 'Baieztatu',
      copy: 'Kopiatu',
      copied: 'Kopiatuta!',
      delete: 'Ezabatu',
      save: 'Gorde',
      search: 'Bilatu',
      all: 'Guztiak',
      none: 'Bat ere ez'
    }
  },
  settings: {
    title: 'Ezarpenak',
    sections: {
      appearance: 'Itxura',
      colorTheme: 'Kolore gaia',
      dataFetch: 'Datuak eskuratzeko metodoa'
    },
    themeOptions: {
      system: 'Sistema',
      light: 'Argia',
      dark: 'Iluna'
    },
    colorThemes: {
      blue: 'Urdina',
      orange: 'Laranja',
      teal: 'Turkesa',
      rose: 'Arrosa',
      purple: 'More',
      green: 'Berdea',
      custom: 'Kolore pertsonalizatua'
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
