import { en } from './en';
import type { TranslationSchema } from './en';

export const sk: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Booru extraktor značiek',
    language: 'Jazyk',
    english: 'Angličtina',
    indonesian: 'Indonézština',
    chinese: 'Čínština',
    languageSwitcher: {
      title: 'Jazyk rozhrania',
      description: 'Uložené vo vašom prehliadači. Predvolený jazyk je angličtina.',
      instantNotice: 'Zmeny sa aplikujú okamžite bez opätovného načítania.',
      searchPlaceholder: 'Hľadať jazyky...',
      noResults: 'Žiadne jazyky nenájdené'
    },
    nav: {
      extractor: 'Značky',
      image: 'Obrázok',
      booruList: 'Booru',
      settings: 'Nastavenia'
    },
    actions: {
      ...en.common.actions,
      add: 'Pridať',
      apply: 'Použiť',
      back: 'Späť',
      cancel: 'Zrušiť',
      clear: 'Vymazať',
      close: 'Zavrieť',
      confirm: 'Potvrdiť',
      copy: 'Kopírovať',
      copied: 'Skopírované!',
      delete: 'Vymazať',
      save: 'Uložiť',
      search: 'Hľadať',
      all: 'Všetko',
      none: 'Nič'
    }
  },
  settings: {
    title: 'Nastavenia',
    sections: {
      appearance: 'Vzhľad',
      colorTheme: 'Farebná téma',
      dataFetch: 'Metóda získavania dát'
    },
    themeOptions: {
      system: 'Systémová',
      light: 'Svetlá',
      dark: 'Tmavá'
    },
    colorThemes: {
      blue: 'Modrá',
      orange: 'Oranžová',
      teal: 'Tyrkysová',
      rose: 'Ružová',
      purple: 'Fialová',
      green: 'Zelená',
      custom: 'Vlastná farba'
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
