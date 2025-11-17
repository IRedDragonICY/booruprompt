import { en } from './en';
import type { TranslationSchema } from './en';

export const no: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Booru Tagg-ekstraktor',
    language: 'Språk',
    english: 'Engelsk',
    indonesian: 'Indonesisk',
    chinese: 'Kinesisk',
    languageSwitcher: {
      title: 'Grensesnittspråk',
      description: 'Lagres i nettleseren din. Standardspråket er engelsk.',
      instantNotice: 'Endringer brukes umiddelbart uten oppdatering.',
      searchPlaceholder: 'Søk språk...',
      noResults: 'Ingen språk funnet'
    },
    nav: {
      extractor: 'Tagger',
      image: 'Bilde',
      booruList: 'Booru',
      settings: 'Innstillinger'
    },
    actions: {
      ...en.common.actions,
      add: 'Legg til',
      apply: 'Bruk',
      back: 'Tilbake',
      cancel: 'Avbryt',
      clear: 'Tøm',
      close: 'Lukk',
      confirm: 'Bekreft',
      copy: 'Kopier',
      copied: 'Kopiert!',
      delete: 'Slett',
      save: 'Lagre',
      search: 'Søk',
      all: 'Alle',
      none: 'Ingen'
    }
  },
  settings: {
    title: 'Innstillinger',
    sections: {
      appearance: 'Utseende',
      colorTheme: 'Fargetema',
      dataFetch: 'Datahentingsmetode'
    },
    themeOptions: {
      system: 'System',
      light: 'Lys',
      dark: 'Mørk'
    },
    colorThemes: {
      blue: 'Blå',
      orange: 'Oransje',
      teal: 'Turkis',
      rose: 'Rosa',
      purple: 'Lilla',
      green: 'Grønn',
      custom: 'Tilpasset Farge'
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
