import { en } from './en';
import type { TranslationSchema } from './en';

export const is: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Booru merkjaútdráttur',
    language: 'Tungumál',
    english: 'Enska',
    indonesian: 'Indónesíska',
    chinese: 'Kínverska',
    languageSwitcher: {
      title: 'Viðmótstungumál',
      description: 'Vistað í vafranum þínum. Sjálfgefið tungumál er enska.',
      instantNotice: 'Breytingar eru notaðar strax án þess að endurhlaða.',
      searchPlaceholder: 'Leita að tungumálum...',
      noResults: 'Engin tungumál fundust'
    },
    nav: {
      extractor: 'Merki',
      image: 'Mynd',
      booruList: 'Booru',
      settings: 'Stillingar'
    },
    actions: {
      ...en.common.actions,
      add: 'Bæta við',
      apply: 'Nota',
      back: 'Til baka',
      cancel: 'Hætta við',
      clear: 'Hreinsa',
      close: 'Loka',
      confirm: 'Staðfesta',
      copy: 'Afrita',
      copied: 'Afritað!',
      delete: 'Eyða',
      save: 'Vista',
      search: 'Leita',
      all: 'Allt',
      none: 'Ekkert'
    }
  },
  settings: {
    title: 'Stillingar',
    sections: {
      appearance: 'Útlit',
      colorTheme: 'Litaþema',
      dataFetch: 'Gagnaöflunaraðferð'
    },
    themeOptions: {
      system: 'Kerfi',
      light: 'Ljóst',
      dark: 'Dökkt'
    },
    colorThemes: {
      blue: 'Blár',
      orange: 'Appelsínugulur',
      teal: 'Grænblár',
      rose: 'Bleikur',
      purple: 'Fjólublár',
      green: 'Grænn',
      custom: 'Sérsniðinn litur'
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
