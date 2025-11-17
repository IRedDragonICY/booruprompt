import { en } from './en';
import type { TranslationSchema } from './en';

export const lt: TranslationSchema = {
  ...en,
  common: {
    ...en.common,
    appName: 'Booru žymų ekstraktorius',
    language: 'Kalba',
    english: 'Anglų',
    indonesian: 'Indoneziečių',
    chinese: 'Kinų',
    languageSwitcher: {
      title: 'Sąsajos kalba',
      description: 'Išsaugota jūsų naršyklėje. Numatytoji kalba yra anglų.',
      instantNotice: 'Pakeitimai taikomi iš karto be perkrovimo.',
      searchPlaceholder: 'Ieškoti kalbų...',
      noResults: 'Kalbų nerasta'
    },
    nav: {
      extractor: 'Žymos',
      image: 'Paveikslas',
      booruList: 'Booru',
      settings: 'Nustatymai'
    },
    actions: {
      ...en.common.actions,
      add: 'Pridėti',
      apply: 'Taikyti',
      back: 'Atgal',
      cancel: 'Atšaukti',
      clear: 'Išvalyti',
      close: 'Uždaryti',
      confirm: 'Patvirtinti',
      copy: 'Kopijuoti',
      copied: 'Nukopijuota!',
      delete: 'Ištrinti',
      save: 'Išsaugoti',
      search: 'Ieškoti',
      all: 'Visi',
      none: 'Nieko'
    }
  },
  settings: {
    title: 'Nustatymai',
    sections: {
      appearance: 'Išvaizda',
      colorTheme: 'Spalvų tema',
      dataFetch: 'Duomenų gavimo metodas'
    },
    themeOptions: {
      system: 'Sistema',
      light: 'Šviesi',
      dark: 'Tamsi'
    },
    colorThemes: {
      blue: 'Mėlyna',
      orange: 'Oranžinė',
      teal: 'Žydra',
      rose: 'Rožinė',
      purple: 'Violetinė',
      green: 'Žalia',
      custom: 'Pasirinktinė spalva'
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
