import { en } from './en';
import type { TranslationSchema } from './en';

export const lv: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Booru birku ekstraktors',
    language: 'Valoda',
    english: 'Angļu',
    indonesian: 'Indonēziešu',
    chinese: 'Ķīniešu',
    languageSwitcher: {
      title: 'Saskarnes valoda',
      description: 'Saglabāts jūsu pārlūkprogrammā. Noklusējuma valoda ir angļu.',
      instantNotice: 'Izmaiņas tiek piemērotas uzreiz bez pārlādēšanas.',
      searchPlaceholder: 'Meklēt valodas...',
      noResults: 'Nav atrasta neviena valoda'
    },
    nav: {
      extractor: 'Birkas',
      image: 'Attēls',
      booruList: 'Booru',
      settings: 'Iestatījumi'
    },
    actions: {
      ...en.common.actions,
      add: 'Pievienot',
      apply: 'Lietot',
      back: 'Atpakaļ',
      cancel: 'Atcelt',
      clear: 'Notīrīt',
      close: 'Aizvērt',
      confirm: 'Apstiprināt',
      copy: 'Kopēt',
      copied: 'Nokopēts!',
      delete: 'Dzēst',
      save: 'Saglabāt',
      search: 'Meklēt',
      all: 'Visi',
      none: 'Nekas'
    }
  },
  settings: {
    title: 'Iestatījumi',
    sections: {
      appearance: 'Izskats',
      colorTheme: 'Krāsu tēma',
      dataFetch: 'Datu iegūšanas metode'
    },
    themeOptions: {
      system: 'Sistēma',
      light: 'Gaišs',
      dark: 'Tumšs'
    },
    colorThemes: {
      blue: 'Zils',
      orange: 'Oranžs',
      teal: 'Zilganzaļš',
      rose: 'Rozā',
      purple: 'Violets',
      green: 'Zaļš',
      custom: 'Pielāgota krāsa'
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
